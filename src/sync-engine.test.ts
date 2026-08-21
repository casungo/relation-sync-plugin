import { TFile, type App } from "obsidian";
import { describe, expect, it, vi } from "vitest";

import { SyncEngine } from "./sync-engine";

describe("SyncEngine rename handling", () => {
  it("does not rewrite included notes when the renamed target is excluded", async () => {
    vi.stubGlobal("activeWindow", { setTimeout: vi.fn(() => 0), clearTimeout: vi.fn() });
    const renamed = new TFile();
    renamed.path = "Archive/Alice.md";
    renamed.basename = "Alice";
    const reference = new TFile();
    reference.path = "People/Bob.md";
    reference.basename = "Bob";
    const processFrontMatter = vi.fn();
    const app = {
      vault: { getMarkdownFiles: () => [reference] },
      metadataCache: {
        getFileCache: () => ({ frontmatter: { relation: "[[People/Alice]]" } }),
      },
      fileManager: { processFrontMatter },
    } as unknown as App;
    const engine = new SyncEngine(app, {
      syncEnabled: true,
      relations: [],
      excludePaths: "Archive",
    });

    await engine.handleFileRenamed(renamed, "People/Alice.md");

    expect(processFrontMatter).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
