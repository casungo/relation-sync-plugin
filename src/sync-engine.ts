import { type App, type CachedMetadata, Notice, TFile } from "obsidian";
import type { RelationSyncSettings } from "./types";
import { buildRelationMap } from "./relation-map";
import { debounce, linksEqual, parseWikiLinks } from "./utils";

/** Typed representation of Obsidian's frontmatter link entry (available 1.4+). */
interface FrontmatterLinkEntry {
  key: string;
  link: string;
  original: string;
  displayText: string;
}

/** A record of a single sync operation — used for the sync log. */
export interface SyncLogEntry {
  file: string;
  action: "added" | "removed";
  key: string;
  link: string;
}

/** How long to wait (ms) after a metadata change before flushing writes. */
const DEBOUNCE_MS = 300;

/** How long (ms) before a writing-guard entry is force-cleared as a safety net. */
const WRITING_GUARD_TTL = 5_000;

/**
 * SyncEngine owns all state and logic for keeping inverse
 * relations in sync across the vault.
 */
export class SyncEngine {
  private readonly app: App;
  private relationMap: Map<string, string>;
  private settings: RelationSyncSettings;

  /** Files the engine is currently writing to (loop guard). */
  private readonly writing = new Set<string>();

  /** Safety-net timers so a writing-guard can never leak forever. */
  private readonly writingTimers = new Map<string, ReturnType<typeof setTimeout>>();

  /** Previous frontmatter snapshot per file path (for diffing). */
  private readonly prevFm = new Map<string, Record<string, unknown>>();

  /** Debounced flush trigger. */
  private readonly debouncedFlush: (() => void) & { cancel(): void };

  /** Pending sync operations waiting to be flushed. */
  private pendingQueue: Array<{ file: TFile; cache: CachedMetadata }> = [];

  /** Prevents concurrent flush operations. */
  private flushing = false;

  /** Whether a bulk sync is currently running (for cancellation). */
  private bulkSyncAbort = false;

  /** Log entries from the most recent operation. */
  private syncLog: SyncLogEntry[] = [];

  constructor(app: App, settings: RelationSyncSettings) {
    this.app = app;
    this.settings = settings;
    this.relationMap = buildRelationMap(settings.relations);
    this.debouncedFlush = debounce(() => {
      void this.flushQueue();
    }, DEBOUNCE_MS);
  }

  // ── Public API ──────────────────────────────────────────────────────────

  /** Rebuild the relation map after a settings change. */
  refreshMap(settings: RelationSyncSettings): void {
    this.settings = settings;
    this.relationMap = buildRelationMap(settings.relations);
  }

  /** Take a snapshot of every markdown file's frontmatter. */
  snapshotVault(): void {
    for (const file of this.app.vault.getMarkdownFiles()) {
      const cache = this.app.metadataCache.getFileCache(file);
      if (cache?.frontmatter) {
        this.prevFm.set(file.path, { ...cache.frontmatter });
      }
    }
  }

  /** Handle a metadata-cache change event (debounced). */
  handleMetaChanged(file: TFile, cache: CachedMetadata): void {
    // Skip our own writes — clear the guard flag when we see its echo.
    if (this.writing.has(file.path)) {
      this.clearWritingGuard(file.path);
      this.prevFm.set(file.path, { ...(cache.frontmatter ?? {}) });
      return;
    }

    this.pendingQueue.push({ file, cache });
    this.debouncedFlush();
  }

  /** Remove the snapshot for a deleted file. */
  handleFileDeleted(path: string): void {
    this.prevFm.delete(path);
  }

  /**
   * Handle a file rename/move.
   * Updates all notes in the vault that reference the old name's link.
   */
  async handleFileRenamed(file: TFile, oldPath: string): Promise<void> {
    // Update our snapshot key
    const snap = this.prevFm.get(oldPath);
    this.prevFm.delete(oldPath);
    if (snap) this.prevFm.set(file.path, snap);

    const oldBasename = oldPath.split("/").pop()?.replace(/\.md$/, "") ?? "";
    const newBasename = file.basename;
    if (oldBasename === newBasename) return; // only the folder changed — links still valid

    const oldLink = `[[${oldBasename}]]`;
    const newLink = `[[${newBasename}]]`;

    for (const f of this.app.vault.getMarkdownFiles()) {
      if (f.path === file.path) continue;
      if (this.isExcluded(f.path)) continue;
      const cache = this.app.metadataCache.getFileCache(f);
      if (!cache?.frontmatter) continue;

      // Check if any frontmatter value references the old link
      const fm = cache.frontmatter;
      const hasRef = Object.values(fm).some((v) => {
        if (typeof v === "string") return v.includes(oldBasename);
        if (Array.isArray(v)) return v.some((item) => typeof item === "string" && item.includes(oldBasename));
        return false;
      });
      if (!hasRef) continue;

      this.writing.add(f.path);
      this.setWritingGuardTimer(f.path);
      try {
        await this.app.fileManager.processFrontMatter(f, (fmObj: Record<string, unknown>) => {
          for (const key of Object.keys(fmObj)) {
            const val = fmObj[key];
            if (typeof val === "string") {
              fmObj[key] = val.replace(oldLink, newLink);
            } else if (Array.isArray(val)) {
              fmObj[key] = val.map((item) =>
                typeof item === "string" ? item.replace(oldLink, newLink) : item
              );
            }
          }
        });
      } catch (err: unknown) {
        this.clearWritingGuard(f.path);
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`RelationSync: failed to rewrite link in "${f.path}" after rename: ${msg}`);
      }
    }
  }

  /** Run a full vault sync — re-computes all inverse relations from scratch. */
  async runBulkSync(): Promise<{ count: number; log: SyncLogEntry[] }> {
    this.bulkSyncAbort = false;
    this.syncLog = [];

    const files = this.app.vault.getMarkdownFiles();
    let count = 0;
    for (const file of files) {
      if (this.bulkSyncAbort) break;
      if (this.isExcluded(file.path)) continue;
      const cache = this.app.metadataCache.getFileCache(file);
      if (!cache?.frontmatter) continue;
      this.prevFm.set(file.path, {}); // pretend everything is new
      await this.processMetaChanged(file, cache);
      count++;
    }
    return { count, log: [...this.syncLog] };
  }

  /** Cancel an in-progress bulk sync. */
  cancelBulkSync(): void {
    this.bulkSyncAbort = true;
  }

  /** Return (and clear) the most recent sync log. */
  drainLog(): SyncLogEntry[] {
    const log = [...this.syncLog];
    this.syncLog = [];
    return log;
  }

  /** Clean up timers and state. */
  destroy(): void {
    this.debouncedFlush.cancel();
    this.pendingQueue.length = 0;
    this.prevFm.clear();
    for (const t of this.writingTimers.values()) clearTimeout(t);
    this.writingTimers.clear();
    this.writing.clear();
    this.bulkSyncAbort = true;
  }

  // ── Internal ────────────────────────────────────────────────────────────

  /** Check whether a file path should be skipped based on excludePaths setting. */
  private isExcluded(filePath: string): boolean {
    const raw = this.settings.excludePaths ?? "";
    if (!raw.trim()) return false;
    const patterns = raw.split(",").map((p) => p.trim().toLowerCase()).filter(Boolean);
    const lower = filePath.toLowerCase();
    return patterns.some((p) => lower === p || lower.startsWith(p + "/") || lower.startsWith(p + "\\"));
  }

  /** Set the writing guard and arm its safety-net timeout. */
  private setWritingGuardTimer(path: string): void {
    // Clear any existing timer first
    const existing = this.writingTimers.get(path);
    if (existing) clearTimeout(existing);

    const t = setTimeout(() => {
      this.writing.delete(path);
      this.writingTimers.delete(path);
    }, WRITING_GUARD_TTL);
    this.writingTimers.set(path, t);
  }

  /** Clear the writing guard and its safety-net timer. */
  private clearWritingGuard(path: string): void {
    this.writing.delete(path);
    const t = this.writingTimers.get(path);
    if (t) {
      clearTimeout(t);
      this.writingTimers.delete(path);
    }
  }

  private async flushQueue(): Promise<void> {
    if (this.flushing) return;
    this.flushing = true;

    try {
      // Drain the queue so new events during processing go to a fresh batch.
      const items = this.pendingQueue;
      this.pendingQueue = [];

      // De-duplicate: keep only the latest entry per file path.
      const seen = new Map<string, { file: TFile; cache: CachedMetadata }>();
      for (const item of items) {
        seen.set(item.file.path, item);
      }

      for (const { file, cache } of seen.values()) {
        if (this.isExcluded(file.path)) continue;
        await this.processMetaChanged(file, cache);
      }
    } finally {
      this.flushing = false;

      // If events accumulated during the flush, schedule another round.
      if (this.pendingQueue.length > 0) {
        this.debouncedFlush();
      }
    }
  }

  private async processMetaChanged(
    file: TFile,
    cache: CachedMetadata,
  ): Promise<void> {
    const fm = cache.frontmatter ?? {};
    const prev = this.prevFm.get(file.path) ?? {};

    // Gather all keys that are known relation keys.
    const allKeys = new Set([
      ...Object.keys(fm).map((k) => k.toLowerCase()),
      ...Object.keys(prev).map((k) => k.toLowerCase()),
    ]);

    for (const key of allKeys) {
      const inverseKey = this.relationMap.get(key);
      if (!inverseKey) continue;

      const currentLinks = this.getLinksViaCache(cache, key);
      const prevLinks = this.getLinksFromRaw(prev, key);

      const added = currentLinks.filter(
        (l) => !prevLinks.some((p) => this.resolvedLinksEqual(l, p, file.path)),
      );
      const removed = prevLinks.filter(
        (l) => !currentLinks.some((c) => this.resolvedLinksEqual(l, c, file.path)),
      );

      for (const name of added) {
        await this.addInverse(file, name, inverseKey);
      }
      for (const name of removed) {
        await this.removeInverse(file, name, inverseKey);
      }
    }

    // Update snapshot.
    this.prevFm.set(file.path, { ...fm });
  }

  /**
   * Extract links for a given key from the metadata cache's frontmatterLinks
   * (available in Obsidian 1.4+). The `key` field uses dot notation for arrays,
   * e.g. `"wife of"` or `"wife of.0"`.
   */
  private getLinksViaCache(
    cache: CachedMetadata,
    key: string,
  ): string[] {
    const fmLinks =
      ((cache as Record<string, unknown>)["frontmatterLinks"] as
        | FrontmatterLinkEntry[]
        | undefined) ?? [];

    return fmLinks
      .filter((l) => {
        const k = l.key?.toLowerCase() ?? "";
        return k === key || k.startsWith(key + ".");
      })
      .map((l) => l.link);
  }

  private getLinksFromRaw(
    fm: Record<string, unknown>,
    key: string,
  ): string[] {
    const rawKey = Object.keys(fm).find((k) => k.toLowerCase() === key);
    if (!rawKey) return [];
    return parseWikiLinks(fm[rawKey]);
  }

  /**
   * Compare two link strings by resolving them to TFile objects first.
   * This handles path-prefixed links like [[People/David Doe]] vs [[David Doe]]
   * pointing to the same file. Falls back to case-insensitive string comparison
   * when resolution fails.
   */
  private resolvedLinksEqual(a: string, b: string, sourcePath: string): boolean {
    const fileA = this.app.metadataCache.getFirstLinkpathDest(a, sourcePath);
    const fileB = this.app.metadataCache.getFirstLinkpathDest(b, sourcePath);
    if (fileA && fileB) return fileA.path === fileB.path;
    return linksEqual(a, b);
  }

  private async addInverse(
    sourceFile: TFile,
    targetName: string,
    inverseKey: string,
  ): Promise<void> {
    const target = this.app.metadataCache.getFirstLinkpathDest(
      targetName,
      sourceFile.path,
    );
    if (!(target instanceof TFile)) return;
    if (this.isExcluded(target.path)) return;

    const sourceLink = `[[${sourceFile.basename}]]`;
    this.writing.add(target.path);
    this.setWritingGuardTimer(target.path);

    try {
      await this.app.fileManager.processFrontMatter(
        target,
        (fm: Record<string, unknown>) => {
          const existing = fm[inverseKey];

          if (existing === undefined || existing === null) {
            fm[inverseKey] = sourceLink;
          } else if (Array.isArray(existing)) {
            const alreadyPresent = existing.some(
              (v: unknown) =>
                typeof v === "string" && linksEqual(v, sourceLink),
            );
            if (!alreadyPresent) existing.push(sourceLink);
          } else if (
            typeof existing === "string" &&
            !linksEqual(existing, sourceLink)
          ) {
            fm[inverseKey] = [existing, sourceLink];
          }
        },
      );
      this.syncLog.push({ file: target.path, action: "added", key: inverseKey, link: sourceLink });
    } catch (err: unknown) {
      this.clearWritingGuard(target.path);
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(
        `RelationSync: failed to add inverse in "${target.path}": ${msg}`,
      );
      new Notice(`RelationSync: error updating "${target.basename}" — ${msg}`);
    }
  }

  private async removeInverse(
    sourceFile: TFile,
    targetName: string,
    inverseKey: string,
  ): Promise<void> {
    const target = this.app.metadataCache.getFirstLinkpathDest(
      targetName,
      sourceFile.path,
    );
    if (!(target instanceof TFile)) return;
    if (this.isExcluded(target.path)) return;

    const sourceLink = `[[${sourceFile.basename}]]`;
    this.writing.add(target.path);
    this.setWritingGuardTimer(target.path);

    try {
      await this.app.fileManager.processFrontMatter(
        target,
        (fm: Record<string, unknown>) => {
          const existing = fm[inverseKey];
          if (existing === undefined || existing === null) return;

          if (Array.isArray(existing)) {
            const filtered = existing.filter(
              (v: unknown) =>
                !(typeof v === "string" && linksEqual(v, sourceLink)),
            );
            if (filtered.length === 0) {
              delete fm[inverseKey];
            } else if (filtered.length === 1) {
              fm[inverseKey] = filtered[0];
            } else {
              fm[inverseKey] = filtered;
            }
          } else if (
            typeof existing === "string" &&
            linksEqual(existing, sourceLink)
          ) {
            delete fm[inverseKey];
          }
        },
      );
      this.syncLog.push({ file: target.path, action: "removed", key: inverseKey, link: sourceLink });
    } catch (err: unknown) {
      this.clearWritingGuard(target.path);
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(
        `RelationSync: failed to remove inverse in "${target.path}": ${msg}`,
      );
      new Notice(`RelationSync: error updating "${target.basename}" — ${msg}`);
    }
  }
}
