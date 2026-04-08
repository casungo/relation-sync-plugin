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

/** How long to wait (ms) after a metadata change before flushing writes. */
const DEBOUNCE_MS = 300;

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

  /** Previous frontmatter snapshot per file path (for diffing). */
  private readonly prevFm = new Map<string, Record<string, unknown>>();

  /** Debounced flush trigger. */
  private readonly debouncedFlush: (() => void) & { cancel(): void };

  /** Pending sync operations waiting to be flushed. */
  private pendingQueue: Array<{ file: TFile; cache: CachedMetadata }> = [];

  /** Prevents concurrent flush operations. */
  private flushing = false;

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
      this.writing.delete(file.path);
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

  /** Run a full vault sync — re-computes all inverse relations from scratch. */
  async runBulkSync(): Promise<number> {
    const files = this.app.vault.getMarkdownFiles();
    let count = 0;
    for (const file of files) {
      const cache = this.app.metadataCache.getFileCache(file);
      if (!cache?.frontmatter) continue;
      this.prevFm.set(file.path, {}); // pretend everything is new
      await this.processMetaChanged(file, cache);
      count++;
    }
    return count;
  }

  /** Clean up timers and state. */
  destroy(): void {
    this.debouncedFlush.cancel();
    this.pendingQueue.length = 0;
    this.prevFm.clear();
    this.writing.clear();
  }

  // ── Internal ────────────────────────────────────────────────────────────

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
        (l) => !prevLinks.some((p) => linksEqual(l, p)),
      );
      const removed = prevLinks.filter(
        (l) => !currentLinks.some((c) => linksEqual(l, c)),
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

    const sourceLink = `[[${sourceFile.basename}]]`;
    this.writing.add(target.path);

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
    } catch (err: unknown) {
      this.writing.delete(target.path);
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

    const sourceLink = `[[${sourceFile.basename}]]`;
    this.writing.add(target.path);

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
    } catch (err: unknown) {
      this.writing.delete(target.path);
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(
        `RelationSync: failed to remove inverse in "${target.path}": ${msg}`,
      );
      new Notice(`RelationSync: error updating "${target.basename}" — ${msg}`);
    }
  }
}
