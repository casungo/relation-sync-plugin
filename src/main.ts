import { type App, Modal, Notice, Plugin, Setting, TFile } from "obsidian";
import { type RelationSyncSettings, DEFAULT_SETTINGS } from "./types";
import { SyncEngine } from "./sync-engine";
import { RelationSyncSettingTab } from "./settings-tab";
import { t } from "./locales";
import { RelationPanelView, RELATION_PANEL_VIEW_TYPE } from "./relation-panel";

export default class RelationSyncPlugin extends Plugin {
  settings!: RelationSyncSettings;
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
        // Navigate to this settings pane.
        const appWithSetting = this.app as unknown as { setting?: { open(): void; openTabById(id: string): void } };
        appWithSetting.setting?.open();
        appWithSetting.setting?.openTabById(this.manifest.id);
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

  private async activateRelationPanel(): Promise<void> {
    const existingLeaf = this.app.workspace.getLeavesOfType(RELATION_PANEL_VIEW_TYPE)[0];
    if (existingLeaf) {
      this.app.workspace.revealLeaf(existingLeaf);
      return;
    }

    const leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf) return;

    await leaf.setViewState({
      type: RELATION_PANEL_VIEW_TYPE,
      active: true,
    });
    this.app.workspace.revealLeaf(leaf);
  }

  private async runBulkSyncCommand(): Promise<void> {
    const strings = t();
    const plan = this.engine.previewBulkSync();
    new BulkSyncCommandModal(this.app, plan.entries.length, plan.filesScanned, async () => {
      const notice = new Notice(strings.bulkSyncRunningNotice, 0);
      try {
        const { count } = await this.engine.runBulkSync();
        notice.hide();
        new Notice(strings.syncNotice(count));
      } catch {
        notice.hide();
        new Notice(strings.bulkSyncFailedNotice);
      }
    }).open();
  }
}

class BulkSyncCommandModal extends Modal {
  constructor(
    app: App,
    private readonly changes: number,
    private readonly files: number,
    private readonly onConfirm: () => Promise<void>,
  ) {
    super(app);
  }

  onOpen(): void {
    const strings = t();
    this.contentEl.empty();
    new Setting(this.contentEl).setName(strings.bulkPreviewTitle).setHeading();
    this.contentEl.createEl("p", {
      text: strings.bulkPreviewDesc(this.changes, this.files),
      cls: "setting-item-description",
    });
    new Setting(this.contentEl)
      .addButton((btn) => btn.setButtonText(strings.cancelButton).onClick(() => this.close()))
      .addButton((btn) =>
        btn
          .setButtonText(strings.confirmBulkSyncButton)
          .setWarning()
          .onClick(() => {
            void this.onConfirm();
            this.close();
          }),
      );
  }

  onClose(): void {
    this.contentEl.empty();
  }
}
