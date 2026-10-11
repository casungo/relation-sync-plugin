import { Notice, Plugin, TFile } from "obsidian";
import { type RelationSyncSettings } from "./types";
import { SyncEngine } from "./sync-engine";
import { RelationSyncSettingTab, showSyncPreview } from "./settings-tab";
import { t } from "./locales";
import { loadRelationSettings } from "./settings";
import { RelationPanelView, RELATION_PANEL_VIEW_TYPE } from "./relation-panel";

export default class RelationSyncPlugin extends Plugin {
  declare settings: RelationSyncSettings;
  engine!: SyncEngine;

  async onload(): Promise<void> {
    await this.loadSettings();
    this.engine = new SyncEngine(this.app, this.settings);

    this.registerView(
      RELATION_PANEL_VIEW_TYPE,
      (leaf) => new RelationPanelView(leaf, this),
    );

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
      name: t().syncVault,
      callback: () => {
        showSyncPreview(this.app, this.engine);
      },
    });

    this.addCommand({
      id: "cancel-bulk-sync",
      name: t().cancelButton,
      callback: () => {
        this.engine.cancelBulkSync();
      },
    });

    this.addCommand({
      id: "open-settings",
      name: t().openSettings,
      callback: () => {
        this.openSettings();
      },
    });

    this.addCommand({
      id: "preview-current-note",
      name: t().checkCurrentNote,
      callback: () => {
        const file = this.app.workspace.getActiveFile();
        if (file instanceof TFile && file.extension === "md") showSyncPreview(this.app, this.engine, file);
        else new Notice(t().noActiveNote);
      },
    });

    this.addCommand({
      id: "open-relations-panel",
      name: t().openRelationsPanel,
      callback: () => {
        void this.activateRelationPanel();
      },
    });

    this.addRibbonIcon("network", t().openRelationsPanel, () => {
      void this.activateRelationPanel();
    });

    this.addSettingTab(new RelationSyncSettingTab(this.app, this));
  }

  onunload(): void {
    this.engine.destroy();
  }

  async loadSettings(): Promise<void> {
    const { settings, migrated } = loadRelationSettings(await this.loadData());
    this.settings = settings;
    if (migrated) {
      await this.saveData(settings);
      new Notice(t().settingsMigrated, 12000);
    }
  }

  openSettings(): void {
    const appWithSetting = this.app as unknown as { setting?: { open(): void; openTabById(id: string): void } };
    appWithSetting.setting?.open();
    appWithSetting.setting?.openTabById(this.manifest.id);
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    this.engine.refreshMap(this.settings);
    for (const leaf of this.app.workspace.getLeavesOfType(RELATION_PANEL_VIEW_TYPE)) {
      if (leaf.view instanceof RelationPanelView) leaf.view.render();
    }
  }

  private async activateRelationPanel(): Promise<void> {
    const existingLeaf = this.app.workspace.getLeavesOfType(RELATION_PANEL_VIEW_TYPE)[0];
    if (existingLeaf) {
      await this.app.workspace.revealLeaf(existingLeaf);
      return;
    }

    const leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf) return;

    await leaf.setViewState({
      type: RELATION_PANEL_VIEW_TYPE,
      active: true,
    });
    await this.app.workspace.revealLeaf(leaf);
  }

}
