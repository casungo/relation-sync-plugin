import { TFile, type App, type CachedMetadata } from "obsidian";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SyncEngine } from "./sync-engine";
import { getDefaultRelations } from "./locales";
import type { RelationPair, RelationSyncSettings } from "./types";

function vault(initial: Record<string, Record<string, unknown>>, relations = getDefaultRelations()) {
  const fm = structuredClone(initial);
  const files = Object.keys(fm).map((path) => Object.assign(new TFile(), {
    path, basename: path.replace(/\.md$/, "").split("/").pop(), extension: "md",
  }));
  const cache = (file: TFile): CachedMetadata => ({ frontmatter: structuredClone(fm[file.path] ?? {}) });
  const processFrontMatter = vi.fn(async (file: TFile, callback: (value: Record<string, unknown>) => void) => {
    callback(fm[file.path]!);
    engine.handleMetaChanged(file, cache(file));
  });
  const app = {
    vault: { getMarkdownFiles: () => files, getAbstractFileByPath: (path: string) => files.find((file) => file.path === path) },
    metadataCache: {
      getFileCache: cache,
      getFirstLinkpathDest: (link: string) => files.find((file) => file.path.replace(/\.md$/, "") === link || file.basename === link),
      fileToLinktext: (file: TFile) => file.path.replace(/\.md$/, ""),
    },
    fileManager: { processFrontMatter },
  } as unknown as App;
  const settings: RelationSyncSettings = { syncEnabled: true, relations, excludePaths: "" };
  const engine = new SyncEngine(app, settings);
  engine.snapshotVault();
  const edit = async (path: string, next: Record<string, unknown>) => {
    fm[path] = structuredClone(next);
    engine.handleMetaChanged(files.find((file) => file.path === path)!, cache(files.find((file) => file.path === path)!));
    await vi.advanceTimersByTimeAsync(350);
  };
  return { fm, files, cache, app, settings, engine, processFrontMatter, edit };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("activeWindow", globalThis);
  vi.stubGlobal("window", { moment: { locale: () => "en" } });
});
afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); vi.unstubAllGlobals(); });

describe("conservative bulk sync", () => {
  it("preserves a one-sided relation, completes the inverse and reaches a fixed point", async () => {
    const v = vault({ "Alice.md": { parent: "[[Bob]]", tags: ["family"] }, "Bob.md": {} });
    expect(v.engine.previewBulkSync()).toMatchObject({ filesToChange: 1, added: 1, removed: 0 });
    const result = await v.engine.runBulkSync();
    expect(result).toMatchObject({ count: 1, scanned: 2, failed: 0 });
    expect(v.fm).toEqual({ "Alice.md": { parent: "[[Bob]]", tags: ["family"] }, "Bob.md": { child: "[[Alice]]" } });
    expect(v.engine.previewBulkSync().entries).toEqual([]);
    expect((await v.engine.runBulkSync()).count).toBe(0);
    expect(v.processFrontMatter).toHaveBeenCalledTimes(1);
  });

  it("previews only the current source and does not write unrelated notes", async () => {
    const v = vault({ "Alice.md": { mother: "[[Bob]]" }, "Bob.md": {}, "Carol.md": { father: "[[Dave]]" }, "Dave.md": {} });
    const source = v.files[0]!;
    const plan = v.engine.previewBulkSync(source);
    expect(plan).toMatchObject({ filesScanned: 1, filesToChange: 1 });
    await v.engine.runBulkSync(undefined, source, plan);
    expect(v.fm["Dave.md"]).toEqual({});
    expect(v.fm["Bob.md"]).toEqual({ child: "[[Alice]]" });
  });

  it("distinguishes missing, excluded and non-Markdown targets", () => {
    const v = vault({ "Alice.md": { parent: ["[[Missing]]", "[[Archive/Bob]]", "[[Attachment]]"] }, "Archive/Bob.md": {}, "Attachment.md": {} });
    v.settings.excludePaths = "Archive";
    v.files[2]!.extension = "png";
    expect(v.engine.previewBulkSync(v.files[0]).problems.map((p) => p.reason)).toEqual(["missing", "excluded", "invalid"]);
  });

  it("rejects stale previews before making any write", async () => {
    const v = vault({ "Alice.md": { parent: "[[Bob]]" }, "Bob.md": {}, "Carol.md": {} });
    const plan = v.engine.previewBulkSync();
    v.fm["Alice.md"]!.parent = "[[Carol]]";
    await expect(v.engine.runBulkSync(undefined, undefined, plan)).rejects.toThrow("changed after the preview");
    expect(v.processFrontMatter).not.toHaveBeenCalled();
  });

  it("can preview and manually sync while automatic writes are paused", async () => {
    const v = vault({ "Alice.md": { mamma: "[[Maria]]" }, "Maria.md": {} });
    v.settings.syncEnabled = false;
    expect(v.engine.getState()).toBe("paused");
    await v.engine.runBulkSync();
    expect(v.fm["Maria.md"]).toEqual({ figli: "[[Alice]]" });
  });

  it("cancels between files and keeps the applied batch undoable", async () => {
    const v = vault({ "Alice.md": { parent: ["[[Bob]]", "[[Carol]]"] }, "Bob.md": {}, "Carol.md": {} });
    const result = await v.engine.runBulkSync(() => v.engine.cancelBulkSync());
    expect(result).toMatchObject({ cancelled: true, count: 1 });
    expect(v.engine.getUndoBatch()).toHaveLength(1);
    await v.engine.undoLastSync();
    expect(v.fm["Bob.md"]).toEqual({});
    expect(v.fm["Carol.md"]).toEqual({});
  });

  it("reports failed writes without calling them applied", async () => {
    const v = vault({ "Alice.md": { parent: "[[Bob]]" }, "Bob.md": {} });
    v.processFrontMatter.mockRejectedValueOnce(new Error("disk full"));
    const result = await v.engine.runBulkSync();
    expect(result).toMatchObject({ count: 0, failed: 1, log: [] });
    expect(v.engine.canUndoLastSync()).toBe(false);
  });
});

describe("neutral inverse roles and synonyms", () => {
  it.each(["mother", "mom", "mum", "father", "dad"])("writes child for %s without guessing gender", async (key) => {
    const v = vault({ "Alex.md": {}, "Morgan.md": {} });
    await v.edit("Alex.md", { [key]: "[[Morgan]]" });
    expect(v.fm["Morgan.md"]).toEqual({ child: "[[Alex]]" });
    expect(v.fm["Alex.md"]).toEqual({ [key]: "[[Morgan]]" });
    expect(v.engine.previewBulkSync().entries).toEqual([]);
  });

  it.each(["madre", "mamma", "padre", "papà", "papa", "babbo"])("writes figli for %s", async (key) => {
    const v = vault({ "Luca.md": {}, "Maria.md": {} });
    await v.edit("Luca.md", { [key]: "[[Maria]]" });
    expect(v.fm["Maria.md"]).toEqual({ figli: "[[Luca]]" });
  });

  it.each(["figlio", "figlia", "figli", "figlie"])("writes genitore for %s", async (key) => {
    const v = vault({ "Maria.md": {}, "Luca.md": {} });
    await v.edit("Maria.md", { [key]: "[[Luca]]" });
    expect(v.fm["Luca.md"]).toEqual({ genitore: "[[Maria]]" });
  });

  it("preserves existing inverse aliases without adding a redundant canonical field", async () => {
    const v = vault({ "Maria.md": { figli: "[[Luca]]" }, "Luca.md": { mamma: "[[Maria]]" } });
    expect(v.engine.previewBulkSync().entries).toEqual([]);
    await v.engine.runBulkSync();
    expect(v.processFrontMatter).not.toHaveBeenCalled();
    expect(v.engine.getLinkState(v.files[0]!, "figli", "Luca")).toBe("reciprocal");
  });

  it("handles an alias rename or removing one duplicate alias without deleting the inverse", async () => {
    const v = vault({ "Luca.md": { madre: "[[Maria]]" }, "Maria.md": { figli: "[[Luca]]" } });
    await v.edit("Luca.md", { mamma: "[[Maria]]" });
    expect(v.processFrontMatter).not.toHaveBeenCalled();
    await v.edit("Luca.md", { mamma: "[[Maria]]", madre: "[[Maria]]" });
    await v.edit("Luca.md", { madre: "[[Maria]]" });
    expect(v.fm["Maria.md"]).toEqual({ figli: "[[Luca]]" });
  });

  it("removes the actual inverse alias and restores that exact field on undo", async () => {
    const v = vault({ "Maria.md": { figli: "[[Luca]]" }, "Luca.md": { mamma: "[[Maria|Mamma]]", unrelated: "keep" } });
    await v.edit("Maria.md", {});
    expect(v.fm["Luca.md"]).toEqual({ unrelated: "keep" });
    expect(v.engine.getUndoBatch()).toEqual([{ file: "Luca.md", action: "removed", key: "mamma", link: "[[Maria|Mamma]]" }]);
    await v.engine.undoLastSync();
    expect(v.fm["Luca.md"]).toEqual({ mamma: "[[Maria|Mamma]]", unrelated: "keep" });
  });

  it("does not add a father to a mother's field when the links differ", async () => {
    const v = vault({ "Luca.md": { madre: "[[Maria]]" }, "Maria.md": {}, "Marco.md": { figli: "[[Luca]]" } });
    await v.engine.runBulkSync();
    expect(v.fm["Luca.md"]).toEqual({ madre: "[[Maria]]", genitore: "[[Marco]]" });
  });

  it("supports asymmetric and symmetric custom aliases", async () => {
    const pairs: RelationPair[] = [{ forward: "project", inverse: "task", forwardAliases: ["initiative"] },
      { forward: "friend", inverse: "friend", forwardAliases: ["buddy"] }];
    const v = vault({ "A.md": { initiative: "[[B]]", buddy: "[[C]]" }, "B.md": {}, "C.md": {} }, pairs);
    await v.engine.runBulkSync();
    expect(v.fm["B.md"]).toEqual({ task: "[[A]]" });
    expect(v.fm["C.md"]).toEqual({ friend: "[[A]]" });
    expect(v.engine.previewBulkSync().entries).toEqual([]);
  });
});

describe("automatic sync boundaries", () => {
  it("tracks paused edits and requires a manual preview to reconcile them", async () => {
    const v = vault({ "Alice.md": {}, "Bob.md": {} });
    v.settings.syncEnabled = false;
    await v.edit("Alice.md", { mother: "[[Bob]]" });
    expect(v.fm["Bob.md"]).toEqual({});
    v.settings.syncEnabled = true;
    await v.edit("Alice.md", { mother: "[[Bob]]", title: "changed" });
    expect(v.fm["Bob.md"]).toEqual({});
    expect(v.engine.previewBulkSync(v.files[0]).added).toBe(1);
  });

  it("adds inverses when a missing target is later created", async () => {
    const v = vault({ "Alice.md": { mother: "[[Bob]]" } });
    const target = Object.assign(new TFile(), { path: "Bob.md", basename: "Bob", extension: "md" });
    v.files.push(target); v.fm["Bob.md"] = {};
    v.engine.handleMetaChanged(target, v.cache(target));
    await vi.advanceTimersByTimeAsync(350);
    expect(v.fm["Bob.md"]).toEqual({ child: "[[Alice]]" });
  });

  it("removes the old inverse when a target changes and preserves unrelated values", async () => {
    const v = vault({ "Alice.md": { parent: "[[Bob]]" }, "Bob.md": { child: ["[[Alice]]", 42, "[[Dave]]"] }, "Carol.md": {} });
    await v.edit("Alice.md", { father: "[[Carol]]" });
    expect(v.fm["Bob.md"]).toEqual({ child: [42, "[[Dave]]"] });
    expect(v.fm["Carol.md"]).toEqual({ child: "[[Alice]]" });
  });

  it("keeps snapshot arrays independent from cache mutations", async () => {
    const v = vault({ "Alice.md": { parent: ["[[Bob]]"] }, "Bob.md": { child: "[[Alice]]" }, "Carol.md": {} });
    v.fm["Alice.md"]!.parent = ["[[Carol]]"];
    v.engine.handleMetaChanged(v.files[0]!, v.cache(v.files[0]!));
    await vi.advanceTimersByTimeAsync(350);
    expect(v.fm["Bob.md"]).toEqual({});
    expect(v.fm["Carol.md"]).toEqual({ child: "[[Alice]]" });
  });

  it("blocks invalid enabled aliases and leaves disabled drafts harmless", () => {
    const v = vault({ "Alice.md": {} }, [{ forward: "parent", inverse: "child" }, { forward: "", inverse: "", enabled: false }]);
    expect(v.engine.getState()).toBe("ready");
    v.settings.relations[1]!.enabled = true;
    v.engine.refreshMap(v.settings);
    expect(v.engine.getState()).toBe("blocked");
  });

  it("renames configured links only, preserving unrelated frontmatter", async () => {
    const v = vault({ "Alice.md": { parent: "[[Bob]]", unrelated: "[[Bob]]" }, "Bob.md": {} });
    const target = v.files[1]!;
    target.path = "Bobby.md"; target.basename = "Bobby";
    v.fm["Bobby.md"] = v.fm["Bob.md"]!;
    await v.engine.handleFileRenamed(target, "Bob.md");
    expect(v.fm["Alice.md"]).toEqual({ parent: "[[Bobby]]", unrelated: "[[Bob]]" });
  });

  it("does not rewrite included notes when the renamed target is excluded", async () => {
    const v = vault({ "People/Alice.md": { parent: "[[Bob]]" }, "Archive/Bob.md": {} });
    v.settings.excludePaths = "Archive";
    await v.engine.handleFileRenamed(v.files[1]!, "People/Bob.md");
    expect(v.processFrontMatter).not.toHaveBeenCalled();
  });
});


it("reports an unsupported inverse value instead of proposing an impossible write", async () => {
  const v = vault({ "Alice.md": { mother: "[[Bob]]" }, "Bob.md": { child: 42 } });
  const plan = v.engine.previewBulkSync();
  expect(plan.entries).toEqual([]);
  expect(plan.problems).toEqual([{ file: "Bob.md", key: "child", link: "[[Alice]]", reason: "value" }]);
  const result = await v.engine.runBulkSync();
  expect(result.count).toBe(0);
  expect(v.fm["Bob.md"]).toEqual({ child: 42 });
});

it("rejects a second bulk operation while the first one is writing", async () => {
  const v = vault({ "Alice.md": { parent: "[[Bob]]" }, "Bob.md": {} });
  let release!: () => void;
  v.processFrontMatter.mockImplementationOnce(async (_file, callback) => {
    await new Promise<void>((resolve) => { release = resolve; });
    callback(v.fm["Bob.md"]!);
  });
  const first = v.engine.runBulkSync();
  await expect(v.engine.runBulkSync()).rejects.toThrow("already running");
  release();
  await first;
});

it("retains source edits queued during a bulk operation", async () => {
  const v = vault({ "Alice.md": { parent: "[[Bob]]" }, "Bob.md": {} });
  await v.engine.runBulkSync(() => {
    v.fm["Alice.md"] = {};
    v.engine.handleMetaChanged(v.files[0]!, v.cache(v.files[0]!));
  });
  await vi.advanceTimersByTimeAsync(350);
  expect(v.fm["Bob.md"]).toEqual({});
});

it("does not write a queued edit after automatic sync has been paused", async () => {
  const v = vault({ "Alice.md": {}, "Bob.md": {} });
  v.fm["Alice.md"] = { parent: "[[Bob]]" };
  v.engine.handleMetaChanged(v.files[0]!, v.cache(v.files[0]!));
  v.settings.syncEnabled = false;
  await vi.advanceTimersByTimeAsync(350);
  expect(v.fm["Bob.md"]).toEqual({});
});

it("refuses to undo a different batch from the one reviewed", async () => {
  const v = vault({ "Alice.md": { parent: "[[Bob]]" }, "Bob.md": {}, "Carol.md": {}, "Dave.md": {} });
  await v.engine.runBulkSync();
  const reviewed = v.engine.getUndoBatch();
  await v.edit("Carol.md", { parent: "[[Dave]]" });
  await expect(v.engine.undoLastSync(reviewed)).rejects.toThrow("changed after the preview");
  expect(v.fm["Dave.md"]).toEqual({ child: "[[Carol]]" });
});
