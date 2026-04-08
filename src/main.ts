import { Plugin, TFile } from "obsidian";
import { type RelationSyncSettings, DEFAULT_SETTINGS } from "./types";
import { SyncEngine } from "./sync-engine";
import { RelationSyncSettingTab } from "./settings-tab";

export default class RelationSyncPlugin extends Plugin {
  settings!: RelationSyncSettings;
  engine!: SyncEngine;

  async onload(): Promise<void> {
    await this.loadSettings();
    this.engine = new SyncEngine(this.app, this.settings);

    // Snapshot vault once the workspace layout is ready.
    this.app.workspace.onLayoutReady(() => {
      this.engine.snapshotVault();
    });

    // React to metadata-cache changes (fires after a file is saved).
    this.registerEvent(
      this.app.metadataCache.on("changed", (file, _data, cache) => {
        this.engine.handleMetaChanged(file, cache);
      }),
    );

    // Clean up snapshots when a file is deleted.
    this.registerEvent(
      this.app.vault.on("delete", (file) => {
        if (file instanceof TFile) {
          this.engine.handleFileDeleted(file.path);
        }
      }),
    );

    this.addSettingTab(new RelationSyncSettingTab(this.app, this));
    console.log("RelationSync: loaded");
  }

  onunload(): void {
    this.engine.destroy();
    console.log("RelationSync: unloaded");
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      (await this.loadData()) as Partial<RelationSyncSettings> | null,
    );
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    this.engine.refreshMap(this.settings);
  }
}
