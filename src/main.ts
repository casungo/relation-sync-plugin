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

    // Rewrite backlinks when a file is renamed or moved.
    this.registerEvent(
      this.app.vault.on("rename", (file, oldPath) => {
        if (file instanceof TFile) {
          void this.engine.handleFileRenamed(file, oldPath);
        }
      }),
    );

    // ── Command palette ────────────────────────────────────────────────
    this.addCommand({
      id: "run-bulk-sync",
      name: "Run bulk sync",
      callback: () => {
        void this.runBulkSyncCommand();
      },
    });

    this.addCommand({
      id: "cancel-bulk-sync",
      name: "Cancel bulk sync",
      callback: () => {
        this.engine.cancelBulkSync();
      },
    });

    this.addCommand({
      id: "open-settings",
      name: "Open settings",
      callback: () => {
        // Navigate to the plugin's settings pane
        const appWithSetting = this.app as unknown as { setting?: { open(): void; openTabById(id: string): void } };
        appWithSetting.setting?.open();
        appWithSetting.setting?.openTabById(this.manifest.id);
      },
    });

    this.addSettingTab(new RelationSyncSettingTab(this.app, this));

    if (process.env.NODE_ENV === "development") {
      console.debug("RelationSync: loaded");
    }
  }

  onunload(): void {
    this.engine.destroy();
    if (process.env.NODE_ENV === "development") {
      console.debug("RelationSync: unloaded");
    }
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

  private async runBulkSyncCommand(): Promise<void> {
    const { Notice } = await import("obsidian");
    const notice = new Notice("Relation sync: bulk sync running…", 0);
    try {
      const { count } = await this.engine.runBulkSync();
      notice.hide();
      new Notice(`Relation sync: sync completed on ${count} notes.`);
    } catch (e) {
      notice.hide();
      new Notice("Relation sync: bulk sync failed.");
      console.error("RelationSync bulk sync error:", e);
    }
  }
}
