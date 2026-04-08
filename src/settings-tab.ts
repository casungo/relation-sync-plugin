import { type App, Notice, PluginSettingTab, Setting } from "obsidian";
import type RelationSyncPlugin from "./main";
import { DEFAULT_SETTINGS, type RelationPair } from "./types";
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
    containerEl.createEl("h2", { text: strings.pluginTitle });
    containerEl.createEl("p", {
      text: strings.pluginDescription,
      cls: "setting-item-description",
    });

    // ── Action buttons ────────────────────────────────────────────────
    new Setting(containerEl)
      .setName(strings.resetToDefaults)
      .setDesc(strings.resetToDefaultsDesc)
      .addButton((btn) =>
        btn
          .setButtonText(strings.resetToDefaultsButton)
          .setWarning()
          .onClick(async () => {
            const confirmed = confirm(strings.resetConfirm);
            if (!confirmed) return;

            this.plugin.settings = JSON.parse(
              JSON.stringify(DEFAULT_SETTINGS),
            );
            await this.plugin.saveSettings();
            new Notice(strings.resetNotice);
            this.display();
          }),
      );

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

    // ── Show all languages toggle ─────────────────────────────────────
    new Setting(containerEl)
      .setName(strings.showAllLanguages)
      .setDesc(strings.showAllLanguagesDesc)
      .addToggle((toggle) =>
        toggle.setValue(this.showAllLanguages).onChange((val) => {
          this.showAllLanguages = val;
          this.renderRelations(listEl, countEl, locale);
        }),
      );

    // ── Search / filter ───────────────────────────────────────────────
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
          this.plugin.settings.relations.push({ forward: "", inverse: "" });
          await this.plugin.saveSettings();
          this.searchQuery = "";
          this.display();
          // Scroll the list to bottom after DOM update
          requestAnimationFrame(() => {
            listEl.scrollTop = listEl.scrollHeight;
          });
        }),
    );

    // ── Count label ───────────────────────────────────────────────────
    const countEl = containerEl.createEl("div", {
      cls: "relation-sync-count",
      text: strings.pairsTotal(this.plugin.settings.relations.length),
    });

    // ── Scrollable relations list ─────────────────────────────────────
    const listEl = containerEl.createDiv({ cls: "relation-sync-list" });
    this.renderRelations(listEl, countEl, locale);

    // ── Inject styles (once) ──────────────────────────────────────────
    this.injectStyles(containerEl);
  }

  // ── Render the grouped, filterable relation list ─────────────────────

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

  // ── Single pair row ──────────────────────────────────────────────────

  private renderPairRow(
    containerEl: HTMLElement,
    pair: RelationPair,
    index: number,
  ): void {
    const strings = t();
    const setting = new Setting(containerEl);
    setting.settingEl.addClass("relation-sync-row");

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
    const count = await this.plugin.engine.runBulkSync();
    new Notice(strings.syncNotice(count));
  }

  // ── Scoped CSS ───────────────────────────────────────────────────────

  private injectStyles(containerEl: HTMLElement): void {
    if (containerEl.querySelector("style.relation-sync-styles")) return;

    const style = containerEl.createEl("style");
    style.addClass("relation-sync-styles");
    style.textContent = /* css */ `
      /* ── Scrollable list container ─────────────────────────────── */
      .relation-sync-list {
        max-height: 55vh;
        overflow-y: auto;
        border: 1px solid var(--background-modifier-border);
        border-radius: var(--radius-m, 8px);
        padding: 6px;
        margin-top: 6px;
      }

      /* ── Count label ───────────────────────────────────────────── */
      .relation-sync-count {
        font-size: var(--font-ui-smaller);
        color: var(--text-muted);
        padding: 4px 0;
        text-align: right;
      }

      /* ── Category accordion ────────────────────────────────────── */
      .relation-sync-category {
        margin-bottom: 4px;
        border-radius: var(--radius-s, 6px);
        overflow: hidden;
      }

      .relation-sync-category > summary {
        cursor: pointer;
        padding: 6px 12px;
        border-radius: var(--radius-s, 6px);
        background: var(--background-secondary);
        font-weight: 600;
        font-size: var(--font-ui-small);
        user-select: none;
        list-style: none;
        display: flex;
        align-items: center;
        gap: 2px;
        transition: background 0.15s ease;
      }
      .relation-sync-category > summary::-webkit-details-marker { display: none; }
      .relation-sync-category > summary::before {
        content: "▸";
        display: inline-block;
        margin-right: 6px;
        transition: transform 0.15s ease;
      }
      .relation-sync-category[open] > summary::before {
        transform: rotate(90deg);
      }
      .relation-sync-category > summary:hover {
        background: var(--background-modifier-hover);
      }

      .relation-sync-cat-count {
        opacity: 0.45;
        font-weight: 400;
      }

      .relation-sync-rows {
        padding: 2px 0 2px 8px;
      }

      /* ── Compact pair row ──────────────────────────────────────── */
      .relation-sync-row {
        padding: 2px 4px !important;
        border-bottom: none !important;
        min-height: unset !important;
      }
      .relation-sync-row .setting-item-info {
        display: none !important;
      }
      .relation-sync-row .setting-item-control {
        width: 100%;
        gap: 4px;
        flex-wrap: nowrap;
      }
      .relation-sync-row .setting-item-control input[type="text"] {
        flex: 1;
        min-width: 0;
        padding: 4px 8px;
        font-size: var(--font-ui-smaller);
      }

      /* ── Arrow ─────────────────────────────────────────────────── */
      .relation-sync-arrow {
        align-self: center;
        margin: 0 2px;
        opacity: 0.4;
        flex-shrink: 0;
        font-size: var(--font-ui-smaller);
      }

      /* ── Empty state ───────────────────────────────────────────── */
      .relation-sync-empty {
        text-align: center;
        opacity: 0.45;
        padding: 32px 16px;
        font-size: var(--font-ui-small);
      }
    `;
  }
}
