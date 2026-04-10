import { type App, Modal, Notice, PluginSettingTab, Setting, TFile } from "obsidian";
import type RelationSyncPlugin from "./main";
import { DEFAULT_SETTINGS, type RelationPair } from "./types";
import type { SyncLogEntry } from "./sync-engine";
import {
  type CategoryId,
  t,
  detectLocale,
  getCategoryForKey,
  pairMatchesLocale,
} from "./locales";

// ── Category helpers ─────────────────────────────────────────────────────

/** Stable display order — known categories first, custom last. */
const CATEGORY_ORDER: (CategoryId | "custom")[] = [
  "family",
  "romantic",
  "friendship",
  "professional",
  "education",
  "creative",
  "misc",
  "custom",
];

/** Map a category ID to its localized display label. */
function categoryLabel(id: CategoryId | "custom"): string {
  const strings = t();
  const map: Record<CategoryId | "custom", string> = {
    family: strings.catFamily,
    romantic: strings.catRomantic,
    friendship: strings.catFriendship,
    professional: strings.catProfessional,
    education: strings.catEducation,
    creative: strings.catCreative,
    misc: strings.catMisc,
    custom: strings.catCustom,
  };
  return map[id];
}

// ── Sync Log Modal ────────────────────────────────────────────────────────

class SyncLogModal extends Modal {
  private readonly entries: SyncLogEntry[];

  constructor(app: App, entries: SyncLogEntry[]) {
    super(app);
    this.entries = entries;
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "Sync log" });

    if (this.entries.length === 0) {
      contentEl.createEl("p", { text: "No changes were made.", cls: "setting-item-description" });
      return;
    }

    const table = contentEl.createEl("table", { cls: "relation-sync-log-table" });
    const head = table.createEl("thead").createEl("tr");
    head.createEl("th", { text: "File" });
    head.createEl("th", { text: "Action" });
    head.createEl("th", { text: "Key" });
    head.createEl("th", { text: "Link" });

    const tbody = table.createEl("tbody");
    for (const e of this.entries) {
      const tr = tbody.createEl("tr");
      tr.createEl("td", { text: e.file.split("/").pop() ?? e.file });
      tr.createEl("td", { text: e.action, cls: `sync-log-${e.action}` });
      tr.createEl("td", { text: e.key });
      tr.createEl("td", { text: e.link });
    }
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

class ConfirmModal extends Modal {
  constructor(app: App, private message: string, private onConfirm: () => void) {
    super(app);
  }
  onOpen() {
    this.contentEl.createEl("p", { text: this.message });
    new Setting(this.contentEl)
      .addButton(btn => btn.setButtonText("Cancel").onClick(() => this.close()))
      .addButton(btn => btn.setButtonText("Confirm").setWarning().onClick(() => {
        this.onConfirm();
        this.close();
      }));
  }
  onClose() {
    this.contentEl.empty();
  }
}

// ── Settings tab ─────────────────────────────────────────────────────────

export class RelationSyncSettingTab extends PluginSettingTab {
  private readonly plugin: RelationSyncPlugin;
  private searchQuery = "";
  private showAllLanguages = false;

  constructor(app: App, plugin: RelationSyncPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    const strings = t();
    const locale = detectLocale();

    // ── Header ────────────────────────────────────────────────────────
    new Setting(containerEl)
      .setName(strings.pluginTitle)
      .setDesc(strings.pluginDescription)
      .setHeading();

    // ── Reset ─────────────────────────────────────────────────────────
    new Setting(containerEl)
      .setName(strings.resetToDefaults)
      .setDesc(strings.resetToDefaultsDesc)
      .addButton((btn) =>
        btn
          .setButtonText(strings.resetToDefaultsButton)
          .setWarning()
          .onClick(() => {
            new ConfirmModal(this.app, strings.resetConfirm, async () => {
              this.plugin.settings = JSON.parse(
                JSON.stringify(DEFAULT_SETTINGS),
              );
              await this.plugin.saveSettings();
              new Notice(strings.resetNotice);
              this.display();
            }).open();
          }),
      );

    // ── Bulk Sync ─────────────────────────────────────────────────────
    new Setting(containerEl)
      .setName(strings.syncVault)
      .setDesc(strings.syncVaultDesc)
      .addButton((btn) =>
        btn
          .setButtonText(strings.syncVaultButton)
          .setWarning()
          .onClick(() => void this.runBulkSync()),
      );

    containerEl.createEl("hr");

    // ── Export pairs ──────────────────────────────────────────────────
    new Setting(containerEl)
      .setName(strings.exportPairs)
      .setDesc(strings.exportPairsDesc)
      .addButton((btn) =>
        btn
          .setButtonText(strings.exportPairsButton)
          .onClick(() => void this.exportPairs()),
      );

    // ── Import pairs ──────────────────────────────────────────────────
    new Setting(containerEl)
      .setName(strings.importPairs)
      .setDesc(strings.importPairsDesc)
      .addButton((btn) =>
        btn
          .setButtonText(strings.importPairsButton)
          .onClick(() => void this.importPairs()),
      );

    containerEl.createEl("hr");

    // ── Exclude paths ─────────────────────────────────────────────────
    new Setting(containerEl)
      .setName(strings.excludePaths)
      .setDesc(strings.excludePathsDesc)
      .addText((text) =>
        text
          .setPlaceholder(strings.excludePathsPlaceholder)
          .setValue(this.plugin.settings.excludePaths ?? "")
          .onChange(async (val) => {
            this.plugin.settings.excludePaths = val;
            await this.plugin.saveSettings();
          }),
      );

    containerEl.createEl("hr");

    // ── Show all languages toggle ──────────────────────────────────────
    new Setting(containerEl)
      .setName(strings.showAllLanguages)
      .setDesc(strings.showAllLanguagesDesc)
      .addToggle((toggle) =>
        toggle.setValue(this.showAllLanguages).onChange((val) => {
          this.showAllLanguages = val;
          this.renderRelations(listEl, countEl, locale);
        }),
      );

    // ── Search / filter ────────────────────────────────────────────────
    const searchSetting = new Setting(containerEl).setName(
      strings.filterRelations,
    );
    searchSetting.addSearch((search) =>
      search
        .setPlaceholder(strings.searchPlaceholder)
        .setValue(this.searchQuery)
        .onChange((val) => {
          this.searchQuery = val;
          this.renderRelations(listEl, countEl, locale);
        }),
    );

    // ── + Add pair ────────────────────────────────────────────────────
    new Setting(containerEl).addButton((btn) =>
      btn
        .setButtonText(strings.addPairButton)
        .setCta()
        .onClick(async () => {
          this.plugin.settings.relations.push({ forward: "", inverse: "", enabled: true });
          await this.plugin.saveSettings();
          this.searchQuery = "";
          this.display();
          // Scroll the list to bottom after DOM update
          requestAnimationFrame(() => {
            listEl.scrollTop = listEl.scrollHeight;
          });
        }),
    );

    // ── Count label ────────────────────────────────────────────────────
    const countEl = containerEl.createEl("div", {
      cls: "relation-sync-count",
      text: strings.pairsTotal(this.plugin.settings.relations.length),
    });

    // ── Scrollable relations list ──────────────────────────────────────
    const listEl = containerEl.createDiv({ cls: "relation-sync-list" });
    this.renderRelations(listEl, countEl, locale);
  }

  // ── Render the grouped, filterable relation list ──────────────────────

  private renderRelations(
    container: HTMLElement,
    countEl: HTMLElement,
    locale: string,
  ): void {
    container.empty();

    const strings = t();
    const query = this.searchQuery.toLowerCase().trim();
    const relations = this.plugin.settings.relations;

    // Group by category ID
    const grouped = new Map<
      CategoryId | "custom",
      { pair: RelationPair; index: number }[]
    >();
    let visibleCount = 0;

    for (let i = 0; i < relations.length; i++) {
      const pair = relations[i];
      if (!pair) continue;

      // Language filter (unless showing all)
      if (!this.showAllLanguages && !pairMatchesLocale(pair, locale)) continue;

      // Apply search filter
      if (query) {
        const fwd = pair.forward.toLowerCase();
        const inv = pair.inverse.toLowerCase();
        if (!fwd.includes(query) && !inv.includes(query)) continue;
      }

      const catId = getCategoryForKey(pair.forward);
      if (!grouped.has(catId)) grouped.set(catId, []);
      grouped.get(catId)!.push({ pair, index: i });
      visibleCount++;
    }

    // Update count
    if (query || !this.showAllLanguages) {
      countEl.textContent = strings.pairsShown(visibleCount, relations.length);
    } else {
      countEl.textContent = strings.pairsTotal(relations.length);
    }

    // Sort categories by defined order
    const sortedCategories = [...grouped.keys()].sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a);
      const ib = CATEGORY_ORDER.indexOf(b);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });

    if (sortedCategories.length === 0) {
      container.createEl("div", {
        text: query ? strings.noSearchResults : strings.noRelations,
        cls: "relation-sync-empty",
      });
      return;
    }

    for (const catId of sortedCategories) {
      const items = grouped.get(catId)!;
      const label = categoryLabel(catId);

      const details = container.createEl("details", {
        cls: "relation-sync-category",
      });
      // Auto-open when searching, or for small/custom groups
      if (query || catId === "custom") {
        details.open = true;
      }

      const summary = details.createEl("summary");
      summary.createSpan({
        text: label,
        cls: "relation-sync-cat-label",
      });
      summary.createSpan({
        text: ` (${items.length})`,
        cls: "relation-sync-cat-count",
      });

      const rowsEl = details.createDiv({ cls: "relation-sync-rows" });
      for (const { pair, index } of items) {
        this.renderPairRow(rowsEl, pair, index);
      }
    }
  }

  // ── Single pair row ───────────────────────────────────────────────────

  private renderPairRow(
    containerEl: HTMLElement,
    pair: RelationPair,
    index: number,
  ): void {
    const strings = t();
    const isEnabled = pair.enabled !== false;
    const setting = new Setting(containerEl);
    setting.settingEl.addClass("relation-sync-row");
    if (!isEnabled) setting.settingEl.addClass("relation-sync-row--disabled");

    // Enable / Disable toggle button
    setting.addExtraButton((btn) =>
      btn
        .setIcon(isEnabled ? "check-circle" : "circle")
        .setTooltip(strings.togglePairTooltip)
        .onClick(async () => {
          pair.enabled = !isEnabled;
          await this.plugin.saveSettings();
          // Re-render only this row's container
          this.display();
        }),
    );

    // Forward key input
    setting.addText((text) =>
      text
        .setPlaceholder(strings.forwardPlaceholder)
        .setValue(pair.forward)
        .onChange(async (val) => {
          pair.forward = val;
          await this.plugin.saveSettings();
        }),
    );

    // Arrow separator
    setting.controlEl.createSpan({
      text: " ↔ ",
      cls: "relation-sync-arrow",
    });

    // Inverse key input
    setting.addText((text) =>
      text
        .setPlaceholder(strings.inversePlaceholder)
        .setValue(pair.inverse)
        .onChange(async (val) => {
          pair.inverse = val;
          await this.plugin.saveSettings();
        }),
    );

    // Delete button
    setting.addExtraButton((btn) =>
      btn
        .setIcon("trash")
        .setTooltip(strings.removePairTooltip)
        .onClick(async () => {
          this.plugin.settings.relations.splice(index, 1);
          await this.plugin.saveSettings();
          this.display();
        }),
    );
  }

  // ── Bulk sync ────────────────────────────────────────────────────────

  private async runBulkSync(): Promise<void> {
    const strings = t();
    const { count, log } = await this.plugin.engine.runBulkSync();
    new Notice(strings.syncNotice(count));
    if (log.length > 0) {
      new SyncLogModal(this.app, log).open();
    }
  }

  // ── Export pairs ──────────────────────────────────────────────────────

  private async exportPairs(): Promise<void> {
    const strings = t();
    const json = JSON.stringify(this.plugin.settings.relations, null, 2);
    const filename = "relation-sync-pairs.json";
    try {
      const existing = this.app.vault.getAbstractFileByPath(filename);
      if (existing instanceof TFile) {
        await this.app.vault.modify(existing, json);
      } else {
        await this.app.vault.create(filename, json);
      }
      new Notice(`RelationSync: exported to ${filename}`);
    } catch (e) {
      new Notice(strings.importError);
      console.error("RelationSync export error:", e);
    }
  }

  // ── Import pairs ──────────────────────────────────────────────────────

  private importPairs(): void {
    const strings = t();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text) as unknown;
        if (!Array.isArray(parsed)) throw new Error("Not an array");
        const pairs = parsed.filter(
          (p): p is RelationPair =>
            typeof p === "object" &&
            p !== null &&
            typeof (p as RelationPair).forward === "string" &&
            typeof (p as RelationPair).inverse === "string",
        );

        // Merge: skip duplicates by forward+inverse key
        const existing = new Set(
          this.plugin.settings.relations.map(
            (r) => `${r.forward.toLowerCase()}|${r.inverse.toLowerCase()}`,
          ),
        );
        let added = 0;
        for (const pair of pairs) {
          const key = `${pair.forward.toLowerCase()}|${pair.inverse.toLowerCase()}`;
          if (!existing.has(key)) {
            this.plugin.settings.relations.push(pair);
            existing.add(key);
            added++;
          }
        }
        await this.plugin.saveSettings();
        new Notice(strings.importSuccess(added));
        this.display();
      } catch (e) {
        new Notice(strings.importError);
        console.error("RelationSync import error:", e);
      }
    };
    input.click();
  }
}
