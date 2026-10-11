import { type App, type CachedMetadata, Notice, TFile } from "obsidian";
import type { RelationSyncSettings } from "./types";
import { buildRelationMap } from "./relation-map";
import { validateRelationPairs } from "./validation";
import {
  addInverseToFrontmatter,
  findActualKey,
  removeInverseFromFrontmatter,
} from "./frontmatter-ops";
import { t } from "./locales";
import { isExcludedPath } from "./path-rules";
import {
  debounce,
  linkTargetsEqual,
  matchesFrontmatterRelationKey,
  parseWikiLinks,
  matchCasing,
  replaceWikiLinkTarget,
  toWikiLink,
} from "./utils";

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

export interface SyncProblem {
  file: string;
  key: string;
  link: string;
  reason: "missing" | "excluded" | "invalid" | "value";
}

export interface BulkSyncPlan {
  problems: SyncProblem[];
  filesScanned: number;
  entries: SyncLogEntry[];
  filesToChange: number;
  added: number;
  removed: number;
}

export interface BulkSyncProgress {
  filesChanged: number;
  totalFilesToChange: number;
  changesApplied: number;
}

interface PlannedSyncChange extends SyncLogEntry {
  sourcePath: string;
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
  private readonly writingTimers = new Map<string, number>();

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
  private bulkSyncRunning = false;
  private writeFailures = 0;

  /** Log entries from the most recent operation. */
  private syncLog: SyncLogEntry[] = [];

  /** Recent applied changes shown in settings and the relations panel. */
  private recentLog: SyncLogEntry[] = [];

  /** Last coherent write batch that can be reversed. */
  private lastUndoBatch: SyncLogEntry[] = [];

  /** Active batch collector for automatic or bulk sync operations. */
  private activeBatch: SyncLogEntry[] | null = null;

  constructor(app: App, settings: RelationSyncSettings) {
    this.app = app;
    this.settings = settings;
    this.relationMap = this.createValidatedRelationMap(settings);
    this.debouncedFlush = debounce(() => {
      void this.flushQueue();
    }, DEBOUNCE_MS);
  }

  // ── Public API ──────────────────────────────────────────────────────────

  /** Rebuild the relation map after a settings change. */
  refreshMap(settings: RelationSyncSettings): void {
    this.settings = settings;
    this.relationMap = this.createValidatedRelationMap(settings);
  }

  getState(): "paused" | "blocked" | "ready" {
    if (this.relationMap.size === 0) return "blocked";
    return this.settings.syncEnabled ? "ready" : "paused";
  }

  getUndoBatch(): SyncLogEntry[] { return [...this.lastUndoBatch]; }

  getLinkState(source: TFile, key: string, link: string): "missing" | "excluded" | "invalid" | "reciprocal" | "unpaired" {
    const target = this.app.metadataCache.getFirstLinkpathDest(link, source.path);
    if (!(target instanceof TFile)) return "missing";
    if (target.extension !== "md") return "invalid";
    if (this.isExcluded(source.path) || this.isExcluded(target.path)) return "excluded";
    const inverse = this.relationMap.get(key.toLowerCase());
    const fm = this.app.metadataCache.getFileCache(target)?.frontmatter ?? {};
    return inverse && this.hasEquivalentLink(fm, inverse, this.makeLinkToFile(source, target.path), target.path) ? "reciprocal" : "unpaired";
  }

  /** Take a snapshot of every markdown file's frontmatter. */
  snapshotVault(skipQueued = false): void {
    for (const file of this.app.vault.getMarkdownFiles()) {
      if (skipQueued && this.pendingQueue.some((item) => item.file.path === file.path)) continue;
      const cache = this.app.metadataCache.getFileCache(file);
      this.prevFm.set(file.path, structuredClone(cache?.frontmatter ?? {}));
    }
  }

  /** Handle a metadata-cache change event (debounced). */
  handleMetaChanged(file: TFile, cache: CachedMetadata): void {
    if (!this.settings.syncEnabled) {
      this.prevFm.set(file.path, structuredClone(cache.frontmatter ?? {}));
      return;
    }

    // Skip our own writes — clear the guard flag when we see its echo.
    if (this.writing.has(file.path)) {
      this.clearWritingGuard(file.path);
      this.prevFm.set(file.path, structuredClone(cache.frontmatter ?? {}));
      return;
    }

    // A newly indexed target may resolve links that were previously missing.
    if (!this.prevFm.has(file.path)) {
      for (const source of this.app.vault.getMarkdownFiles()) {
        if (source.path === file.path || this.isExcluded(source.path)) continue;
        const sourceCache = this.app.metadataCache.getFileCache(source);
        if (sourceCache?.frontmatter && Object.entries(sourceCache.frontmatter).some(([key, value]) =>
          this.relationMap.has(key.toLowerCase()) && parseWikiLinks(value).some((link) =>
            this.app.metadataCache.getFirstLinkpathDest(link, source.path)?.path === file.path),
          )) {
          this.pendingQueue.push({ file: source, cache: structuredClone(sourceCache) });
          // Only the previously unresolved links need to be reconsidered.
          const previous = structuredClone(this.prevFm.get(source.path) ?? {});
          for (const key of Object.keys(previous)) {
            if (!this.relationMap.has(key.toLowerCase())) continue;
            const values = Array.isArray(previous[key]) ? previous[key] as unknown[] : [previous[key]];
            previous[key] = values.filter((value) => !parseWikiLinks(value).some((link) =>
              this.app.metadataCache.getFirstLinkpathDest(link, source.path)?.path === file.path));
          }
          this.prevFm.set(source.path, previous);
        }
      }
    }
    this.pendingQueue.push({ file, cache: structuredClone(cache) });
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
    if (!this.settings.syncEnabled || this.relationMap.size === 0) return;

    // Update our snapshot key
    const snap = this.prevFm.get(oldPath);
    this.prevFm.delete(oldPath);
    if (snap) this.prevFm.set(file.path, snap);

    if (this.isExcluded(file.path)) return;

    const oldLinkPath = oldPath.replace(/\.md$/i, "");
    const newLinkPath = file.path.replace(/\.md$/i, "");
    const oldBasename = oldLinkPath.split("/").pop() ?? oldLinkPath;

    for (const f of this.app.vault.getMarkdownFiles()) {
      if (f.path === file.path) continue;
      if (this.isExcluded(f.path)) continue;
      const cache = this.app.metadataCache.getFileCache(f);
      if (!cache?.frontmatter) continue;

      const fm = cache.frontmatter;
      const shouldReplaceTarget = (targetName: string): boolean => {
        if (linkTargetsEqual(targetName, oldLinkPath)) return true;
        if (targetName.includes("/") || !linkTargetsEqual(targetName, oldBasename)) return false;
        const resolved = this.app.metadataCache.getFirstLinkpathDest(targetName, f.path);
        return !(resolved instanceof TFile) || resolved.path === file.path;
      };
      const hasRef = Object.entries(fm).some(([key, value]) =>
        this.relationMap.has(key.toLowerCase()) && parseWikiLinks(value).some(shouldReplaceTarget),
      );
      if (!hasRef) continue;

      this.writing.add(f.path);
      this.setWritingGuardTimer(f.path);
      try {
        await this.app.fileManager.processFrontMatter(f, (fmObj: Record<string, unknown>) => {
          for (const key of Object.keys(fmObj)) {
            if (!this.relationMap.has(key.toLowerCase())) continue;
            const val = fmObj[key];
            if (typeof val === "string") {
              fmObj[key] = replaceWikiLinkTarget(val, oldLinkPath, newLinkPath, shouldReplaceTarget);
            } else if (Array.isArray(val)) {
              fmObj[key] = val.map((item: unknown) =>
                typeof item === "string" ? replaceWikiLinkTarget(item, oldLinkPath, newLinkPath, shouldReplaceTarget) : item
              );
            }
          }
        });
      } catch (err: unknown) {
        this.clearWritingGuard(f.path);
        const msg = err instanceof Error ? err.message : String(err);
        new Notice(t().writeError(f.path, msg));
      }
    }
  }

  /** Compute the changes a full vault sync would apply. */
  previewBulkSync(sourceFile?: TFile): BulkSyncPlan {
    const planned = this.createBulkSyncPlan(sourceFile);
    const changedFiles = new Set(planned.entries.map((entry) => entry.file));
    return {
      problems: planned.problems,
      filesScanned: planned.filesScanned,
      filesToChange: changedFiles.size,
      added: planned.entries.filter((entry) => entry.action === "added").length,
      removed: planned.entries.filter((entry) => entry.action === "removed").length,
      entries: planned.entries.map((entry) => ({
        file: entry.file,
        action: entry.action,
        key: entry.key,
        link: entry.link,
      })),
    };
  }

  /** Run a full vault sync — re-computes all inverse relations from scratch. */
  async runBulkSync(
    onProgress?: (progress: BulkSyncProgress) => void,
    sourceFile?: TFile,
    reviewedPlan?: BulkSyncPlan,
  ): Promise<{ count: number; scanned: number; failed: number; log: SyncLogEntry[]; cancelled: boolean }> {
    if (this.flushing || this.bulkSyncRunning) throw new Error(t().syncBusy);
    const preview = this.previewBulkSync(sourceFile);
    if (reviewedPlan && JSON.stringify(preview) !== JSON.stringify(reviewedPlan)) throw new Error(t().previewChanged);
    if (this.relationMap.size === 0) throw new Error(t().configInvalidDesc);
    this.bulkSyncRunning = true;
    this.writeFailures = 0;
    this.bulkSyncAbort = false;
    this.syncLog = [];

    const plan = this.createBulkSyncPlan(sourceFile);
    const changesByFile = new Map<string, PlannedSyncChange[]>();
    for (const entry of plan.entries) {
      const source = this.app.vault.getAbstractFileByPath(entry.sourcePath);
      if (!(source instanceof TFile)) continue;
      const changes = changesByFile.get(entry.file) ?? [];
      changes.push(entry);
      changesByFile.set(entry.file, changes);
    }

    this.beginBatch();
    try {
      let filesChanged = 0;
      let changesApplied = 0;
      for (const [path, changes] of changesByFile) {
        if (this.bulkSyncAbort) break;
        const target = this.app.vault.getAbstractFileByPath(path);
        if (!(target instanceof TFile)) continue;
        const before = this.syncLog.length;
        await this.applyBulkChanges(target, changes);
        const applied = this.syncLog.length - before;
        if (applied > 0) filesChanged++;
        changesApplied += applied;
        onProgress?.({
          filesChanged,
          totalFilesToChange: changesByFile.size,
          changesApplied,
        });
      }
      this.snapshotVault(true);
      return { count: filesChanged, scanned: plan.filesScanned, failed: this.writeFailures, log: [...this.syncLog], cancelled: this.bulkSyncAbort };
    } finally {
      this.endBatch();
      this.bulkSyncRunning = false;
      if (this.pendingQueue.length > 0) this.debouncedFlush();
    }
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

  /** Return recent automatic and bulk sync changes without clearing them. */
  getRecentLog(): SyncLogEntry[] {
    return [...this.recentLog];
  }

  /** Whether a reversible write batch is available. */
  canUndoLastSync(): boolean {
    return this.lastUndoBatch.length > 0;
  }

  /** Reverse the most recent sync batch. */
  async undoLastSync(reviewedBatch?: SyncLogEntry[]): Promise<{ count: number; log: SyncLogEntry[] }> {
    if (this.flushing || this.bulkSyncRunning) throw new Error(t().syncBusy);
    if (reviewedBatch && JSON.stringify(reviewedBatch) !== JSON.stringify(this.lastUndoBatch)) throw new Error(t().previewChanged);
    const batch = [...this.lastUndoBatch].reverse();
    if (batch.length === 0) return { count: 0, log: [] };

    this.bulkSyncRunning = true;
    try {
      const undoLog: SyncLogEntry[] = [];
      const changesByFile = new Map<string, SyncLogEntry[]>();
      for (const entry of batch) {
        const changes = changesByFile.get(entry.file) ?? [];
        changes.push(entry);
        changesByFile.set(entry.file, changes);
      }

      for (const [path, changes] of changesByFile) {
        const target = this.app.vault.getAbstractFileByPath(path);
        if (!(target instanceof TFile)) continue;
        await this.applyUndoChanges(target, changes, undoLog);
      }

      this.lastUndoBatch = [];
      this.syncLog = undoLog;
      this.recentLog.unshift(...undoLog);
      this.recentLog = this.recentLog.slice(0, 200);
      this.snapshotVault(true);
      return { count: undoLog.length, log: undoLog };
    } finally {
      this.bulkSyncRunning = false;
      if (this.pendingQueue.length > 0) this.debouncedFlush();
    }
  }

  /** Clean up timers and state. */
  destroy(): void {
    this.debouncedFlush.cancel();
    this.pendingQueue.length = 0;
    this.prevFm.clear();
    for (const t of this.writingTimers.values()) window.clearTimeout(t);
    this.writingTimers.clear();
    this.writing.clear();
    this.bulkSyncAbort = true;
  }

  // ── Internal ────────────────────────────────────────────────────────────

  /** Check whether a file path should be skipped based on excludePaths setting. */
  private isExcluded(filePath: string): boolean {
    return isExcludedPath(filePath, this.settings.excludePaths ?? "");
  }

  /** Set the writing guard and arm its safety-net timeout. */
  private setWritingGuardTimer(path: string): void {
    // Clear any existing timer first
    const existing = this.writingTimers.get(path);
    if (existing) window.clearTimeout(existing);

    const t = window.setTimeout(() => {
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
      window.clearTimeout(t);
      this.writingTimers.delete(path);
    }
  }

  private async flushQueue(): Promise<void> {
    if (this.flushing || this.bulkSyncRunning) return;
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
        if (this.isExcluded(file.path) || !this.settings.syncEnabled) {
          this.prevFm.set(file.path, structuredClone(cache.frontmatter ?? {}));
          continue;
        }
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
    this.beginBatch();

    try {
      const groups = new Map<string, string[]>();
      for (const rawKey of new Set([...Object.keys(fm), ...Object.keys(prev)])) {
        const inverse = this.relationMap.get(rawKey.toLowerCase());
        if (!inverse) continue;
        const keys = groups.get(inverse) ?? [];
        keys.push(rawKey);
        groups.set(inverse, keys);
      }
      for (const [inverseKey, keys] of groups) {
        const originalKey = keys.find((key) => key in fm) ?? keys[0] ?? inverseKey;
        const dynamicInverseKey = matchCasing(originalKey, inverseKey);
        const currentLinks = [...new Set(keys.flatMap((key) => {
          const cached = this.getLinksViaCache(cache, key.toLowerCase());
          return cached.length > 0 ? cached : parseWikiLinks(fm[key]);
        }))];
        const prevLinks = [...new Set(keys.flatMap((key) => parseWikiLinks(prev[key])))];

        const added = currentLinks.filter(
          (l) => !prevLinks.some((p) => this.resolvedLinksEqual(l, p, file.path)),
        );
        const removed = prevLinks.filter(
          (l) => !currentLinks.some((c) => this.resolvedLinksEqual(l, c, file.path)),
        );

        for (const name of added) {
          await this.addInverse(file, name, dynamicInverseKey);
        }
        for (const name of removed) {
          await this.removeInverse(file, name, dynamicInverseKey);
        }
      }

      // Update snapshot.
      this.prevFm.set(file.path, structuredClone(fm));
    } finally {
      this.endBatch();
    }
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
        return matchesFrontmatterRelationKey(k, key);
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
    return linkTargetsEqual(a, b);
  }

  private createBulkSyncPlan(sourceFile?: TFile): { filesScanned: number; entries: PlannedSyncChange[]; problems: SyncProblem[] } {
    const files = (sourceFile ? [sourceFile] : this.app.vault.getMarkdownFiles()).filter((file) => !this.isExcluded(file.path));
    const problems: SyncProblem[] = [];
    const entries: PlannedSyncChange[] = [];
    const desired = new Map<string, Map<string, Map<string, PlannedSyncChange>>>();
    const filesScanned = files.length;

    const addDesired = (target: TFile, key: string, link: string, sourcePath: string): void => {
      const targetMap = desired.get(target.path) ?? new Map<string, Map<string, PlannedSyncChange>>();
      desired.set(target.path, targetMap);
      const keyMap = targetMap.get(key.toLowerCase()) ?? new Map<string, PlannedSyncChange>();
      targetMap.set(key.toLowerCase(), keyMap);
      keyMap.set(sourcePath, { file: target.path, action: "added", key, link, sourcePath });
    };

    for (const sourceFile of files) {
      const cache = this.app.metadataCache.getFileCache(sourceFile);
      if (!cache?.frontmatter) continue;
      const fm = cache.frontmatter;

      for (const rawKey of Object.keys(fm)) {
        const key = rawKey.toLowerCase();
        const inverseKey = this.relationMap.get(key);
        if (!inverseKey) continue;
        const dynamicInverseKey = matchCasing(rawKey, inverseKey);
        const currentLinks = this.getLinksViaCache(cache, key);
        const links = currentLinks.length > 0 ? currentLinks : this.getLinksFromRaw(fm, key);
        for (const targetName of links) {
          const target = this.app.metadataCache.getFirstLinkpathDest(targetName, sourceFile.path);
          if (!(target instanceof TFile) || target.extension !== "md" || this.isExcluded(target.path)) {
            problems.push({ file: sourceFile.path, key: rawKey, link: targetName, reason: !target ? "missing" : this.isExcluded(target.path) ? "excluded" : "invalid" });
            continue;
          }
          addDesired(target, dynamicInverseKey, this.makeLinkToFile(sourceFile, target.path), sourceFile.path);
        }
      }
    }

    for (const targetChanges of desired.values()) {
      for (const keyChanges of targetChanges.values()) {
        for (const change of keyChanges.values()) {
          const target = this.app.vault.getAbstractFileByPath(change.file);
          if (!(target instanceof TFile)) continue;
          const cache = this.app.metadataCache.getFileCache(target);
          const fm = cache?.frontmatter ?? {};
          const alreadyPresent = this.hasEquivalentLink(fm, change.key, change.link, target.path);
          const actualKey = findActualKey(fm, change.key);
          const value: unknown = actualKey ? fm[actualKey] : undefined;
          if (!alreadyPresent && value != null && typeof value !== "string" && !Array.isArray(value)) {
            problems.push({ file: target.path, key: actualKey ?? change.key, link: change.link, reason: "value" });
            continue;
          }
          if (!alreadyPresent) entries.push(change);
        }
      }
    }

    entries.sort((a, b) =>
      a.file.localeCompare(b.file) ||
      a.key.localeCompare(b.key) ||
      a.action.localeCompare(b.action) ||
      a.link.localeCompare(b.link),
    );
    return { filesScanned, entries, problems };
  }

  private equivalentKeys(fm: Record<string, unknown>, key: string): string[] {
    const inverse = this.relationMap.get(key.toLowerCase());
    return Object.keys(fm).filter((candidate) => candidate.toLowerCase() === key.toLowerCase() ||
      (inverse !== undefined && this.relationMap.get(candidate.toLowerCase()) === inverse));
  }

  private hasEquivalentLink(fm: Record<string, unknown>, key: string, link: string, sourcePath: string): boolean {
    return this.equivalentKeys(fm, key).some((candidate) =>
      parseWikiLinks(fm[candidate]).some((value) => this.resolvedLinksEqual(value, link, sourcePath)));
  }

  private makeLinkToFile(file: TFile, sourcePath: string): string {
    const linkText = this.app.metadataCache.fileToLinktext?.(file, sourcePath, true) ?? file.basename;
    return toWikiLink(linkText);
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
    if (!(target instanceof TFile) || target.extension !== "md") return;
    if (this.isExcluded(target.path)) return;

    const sourceLink = this.makeLinkToFile(sourceFile, target.path);
    await this.applyAddInverse(target, inverseKey, sourceLink);
  }

  private async applyAddInverse(
    target: TFile,
    inverseKey: string,
    sourceLink: string,
  ): Promise<void> {
    this.writing.add(target.path);
    this.setWritingGuardTimer(target.path);

    try {
      let changed = false;
      await this.app.fileManager.processFrontMatter(
        target,
        (fm: Record<string, unknown>) => {
          if (!this.hasEquivalentLink(fm, inverseKey, sourceLink, target.path)) {
            changed = addInverseToFrontmatter(fm, inverseKey, sourceLink);
          }
        },
      );
      if (changed) this.recordChange({ file: target.path, action: "added", key: inverseKey, link: sourceLink });
      else this.clearWritingGuard(target.path);
    } catch (err: unknown) {
      this.clearWritingGuard(target.path);
      const msg = err instanceof Error ? err.message : String(err);
      this.writeFailures++;
      new Notice(t().writeError(target.path, msg));
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
    if (!(target instanceof TFile) || target.extension !== "md") return;
    if (this.isExcluded(target.path)) return;

    const sourceLink = this.makeLinkToFile(sourceFile, target.path);
    await this.applyRemoveInverse(target, inverseKey, sourceLink);
  }

  private async applyRemoveInverse(
    target: TFile,
    inverseKey: string,
    sourceLink: string,
  ): Promise<void> {
    this.writing.add(target.path);
    this.setWritingGuardTimer(target.path);

    try {
      const removed: SyncLogEntry[] = [];
      await this.app.fileManager.processFrontMatter(target, (fm: Record<string, unknown>) => {
        for (const key of this.equivalentKeys(fm, inverseKey)) {
          const values = Array.isArray(fm[key]) ? fm[key] as unknown[] : [fm[key]];
          for (const value of values) {
            if (typeof value !== "string" || !parseWikiLinks(value).some((link) => this.resolvedLinksEqual(link, sourceLink, target.path))) continue;
            if (removeInverseFromFrontmatter(fm, key, value)) removed.push({ file: target.path, action: "removed", key, link: value });
          }
        }
      });
      for (const entry of removed) this.recordChange(entry);
      if (removed.length === 0) this.clearWritingGuard(target.path);
    } catch (err: unknown) {
      this.clearWritingGuard(target.path);
      const msg = err instanceof Error ? err.message : String(err);
      this.writeFailures++;
      new Notice(t().writeError(target.path, msg));
    }
  }

  private async applyBulkChanges(target: TFile, changes: PlannedSyncChange[]): Promise<void> {
    this.writing.add(target.path);
    this.setWritingGuardTimer(target.path);

    try {
      const applied: PlannedSyncChange[] = [];
      await this.app.fileManager.processFrontMatter(
        target,
        (fm: Record<string, unknown>) => {
          for (const change of changes) {
            const changed = !this.hasEquivalentLink(fm, change.key, change.link, target.path) &&
              addInverseToFrontmatter(fm, change.key, change.link);
            if (changed) applied.push(change);
          }
        },
      );
      for (const change of applied) {
        this.recordChange({
          file: target.path,
          action: change.action,
          key: change.key,
          link: change.link,
        });
      }
      if (applied.length === 0) this.clearWritingGuard(target.path);
    } catch (err: unknown) {
      this.clearWritingGuard(target.path);
      const msg = err instanceof Error ? err.message : String(err);
      this.writeFailures++;
      new Notice(t().writeError(target.path, msg));
    }
  }

  private beginBatch(): void {
    this.activeBatch = [];
  }

  private endBatch(): void {
    if (this.activeBatch && this.activeBatch.length > 0) {
      this.lastUndoBatch = [...this.activeBatch];
    }
    this.activeBatch = null;
  }

  private recordChange(entry: SyncLogEntry): void {
    this.syncLog.push(entry);
    this.recentLog.unshift(entry);
    this.recentLog = this.recentLog.slice(0, 200);
    if (this.activeBatch) {
      this.activeBatch.push(entry);
    } else {
      this.lastUndoBatch = [entry];
    }
  }

  private async applyUndoChanges(
    target: TFile,
    changes: SyncLogEntry[],
    undoLog: SyncLogEntry[],
  ): Promise<void> {
    this.writing.add(target.path);
    this.setWritingGuardTimer(target.path);

    try {
      await this.app.fileManager.processFrontMatter(
        target,
        (fm: Record<string, unknown>) => {
          for (const change of changes) {
            const undoAction = change.action === "added" ? "removed" : "added";
            const changed = undoAction === "added"
              ? addInverseToFrontmatter(fm, change.key, change.link)
              : removeInverseFromFrontmatter(fm, change.key, change.link);
            if (changed) {
              undoLog.push({
                file: target.path,
                action: undoAction,
                key: change.key,
                link: change.link,
              });
            }
          }
        },
      );
    } catch (err: unknown) {
      this.clearWritingGuard(target.path);
      const msg = err instanceof Error ? err.message : String(err);
      new Notice(t().writeError(target.path, msg));
    }
  }

  private createValidatedRelationMap(settings: RelationSyncSettings): Map<string, string> {
    const issues = validateRelationPairs(settings.relations, {
      emptyField: "empty",

      duplicatePair: "duplicate",
      conflictingKey: () => "conflict",
    });
    if (issues.length > 0) return new Map();
    return buildRelationMap(settings.relations);
  }

}
