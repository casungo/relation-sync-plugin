import { type App, type ButtonComponent, Modal, Notice, PluginSettingTab, Setting, TFile, requireApiVersion, type SettingDefinitionItem } from "obsidian";
import type RelationSyncPlugin from "./main";
import { type RelationPair } from "./types";
import { type BulkSyncPlan, type BulkSyncProgress, type SyncLogEntry, SyncEngine } from "./sync-engine";
import { isRelationPair, validateRelationPairs } from "./validation";
import {
  type CategoryId,
  t,
  getDefaultRelations,
  getCategoryForKey,
  pairMatchesLocale,
} from "./locales";
import { relationKeys } from "./relation-map";
import { enablePresetPairs } from "./settings";

function destructiveButton(button: ButtonComponent): ButtonComponent {
  if (requireApiVersion("1.13.0")) button.setDestructive();
  else button.setClass("mod-warning");
  return button;
}

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
    const strings = t();
    contentEl.empty();
    new Setting(contentEl)
      .setName(strings.syncLogTitle)
      .setHeading()
      .addButton((btn) =>
        btn
          .setButtonText(strings.copyLogButton)
          .onClick(() => void this.copyLog()),
      );

    if (this.entries.length === 0) {
      contentEl.createEl("p", { text: strings.noSyncChanges, cls: "setting-item-description" });
      return;
    }

    const table = contentEl.createEl("table", { cls: "relation-sync-log-table" });
    const head = table.createEl("thead").createEl("tr");
    head.createEl("th", { text: strings.logFileColumn });
    head.createEl("th", { text: strings.logActionColumn });
    head.createEl("th", { text: strings.logKeyColumn });
    head.createEl("th", { text: strings.logLinkColumn });

    const tbody = table.createEl("tbody");
    for (const e of this.entries) {
      const tr = tbody.createEl("tr");
      tr.createEl("td", { text: e.file });
      tr.createEl("td", { text: e.action === "added" ? strings.logAdded : strings.logRemoved, cls: `sync-log-${e.action}` });
      tr.createEl("td", { text: e.key });
      tr.createEl("td", { text: e.link });
    }
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private async copyLog(): Promise<void> {
    const strings = t();
    const text = this.entries
      .map((entry) => `${entry.action}\t${entry.file}\t${entry.key}\t${entry.link}`)
      .join("\n");
    await navigator.clipboard.writeText(text || strings.noSyncChanges);
    new Notice(strings.copyLogNotice);
  }
}

class ConfirmModal extends Modal {
  constructor(app: App, private message: string, private onConfirm: () => void) {
    super(app);
  }
  onOpen() {
    const strings = t();
    this.contentEl.createEl("p", { text: this.message });
    new Setting(this.contentEl)
      .addButton(btn => btn.setButtonText(strings.cancelButton).onClick(() => this.close()))
      .addButton(btn => destructiveButton(btn).setButtonText(strings.confirmButton).onClick(() => {
        this.onConfirm();
        this.close();
      }));
  }
  onClose() {
    this.contentEl.empty();
  }
}

class BulkSyncPreviewModal extends Modal {
  constructor(
    app: App,
    private readonly plan: BulkSyncPlan,
    private readonly onConfirm: () => void,
    private readonly undo = false,
  ) {
    super(app);
  }

  onOpen(): void {
    const strings = t();
    const { contentEl } = this;
    contentEl.empty();

    new Setting(contentEl).setName(this.undo ? strings.undoPreviewTitle : strings.bulkPreviewTitle).setHeading();
    contentEl.createEl("p", {
      text: this.undo ? strings.undoChanges(this.plan.entries.length) : strings.bulkPreviewDesc(this.plan.entries.length, this.plan.filesScanned),
      cls: "setting-item-description",
    });
    contentEl.createEl("p", {
      text: strings.bulkPreviewSummary(this.plan.filesToChange, this.plan.added, this.plan.removed),
      cls: "setting-item-description",
    });

    if (this.plan.entries.length > 0) {
      const table = contentEl.createEl("table", { cls: "relation-sync-log-table relation-sync-preview-table" });
      const head = table.createEl("thead").createEl("tr");
      head.createEl("th", { text: strings.logFileColumn });
      head.createEl("th", { text: strings.logActionColumn });
      head.createEl("th", { text: strings.logKeyColumn });
      head.createEl("th", { text: strings.logLinkColumn });

      const tbody = table.createEl("tbody");
      for (const entry of this.plan.entries.slice(0, 200)) {
        const tr = tbody.createEl("tr");
        tr.createEl("td", { text: entry.file });
        tr.createEl("td", { text: entry.action === "added" ? strings.logAdded : strings.logRemoved, cls: `sync-log-${entry.action}` });
        tr.createEl("td", { text: entry.key });
        tr.createEl("td", { text: entry.link });
      }
      if (this.plan.entries.length > 200) {
        contentEl.createEl("p", {
          text: strings.bulkPreviewTruncated(this.plan.entries.length - 200),
          cls: "setting-item-description",
        });
      }
    } else {
      contentEl.createEl("p", { text: strings.noSyncChanges, cls: "setting-item-description" });
    }

    if (this.plan.problems.length > 0) {
      contentEl.createEl("h3", { text: strings.problemsHeading });
      const list = contentEl.createEl("ul");
      for (const problem of this.plan.problems) {
        const reason = problem.reason === "missing" ? strings.problemMissing :
          problem.reason === "excluded" ? strings.problemExcluded : problem.reason === "value" ? strings.problemValue : strings.problemInvalid;
        list.createEl("li", { text: `${problem.file} · ${problem.key} · [[${problem.link}]]: ${reason}` });
      }
    }
    new Setting(contentEl)
      .addButton((btn) => btn.setButtonText(strings.cancelButton).onClick(() => this.close()))
      .addButton((btn) =>
        destructiveButton(btn)
          .setButtonText(this.undo ? strings.undoLastSyncButton : strings.confirmBulkSyncButton)
          .setDisabled(this.plan.entries.length === 0)
          .onClick(() => {
            this.onConfirm();
            this.close();
          }),
      );
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

class BulkSyncRunningModal extends Modal {
  private progressEl?: HTMLElement;

  constructor(
    app: App,
    private readonly onCancel: () => void,
  ) {
    super(app);
  }

  onOpen(): void {
    const strings = t();
    this.contentEl.empty();
    new Setting(this.contentEl).setName(strings.bulkSyncRunningNotice).setHeading();
    this.progressEl = this.contentEl.createEl("p", {
      text: strings.bulkProgress(0, 0, 0),
      cls: "setting-item-description",
    });
    new Setting(this.contentEl).addButton((btn) =>
      destructiveButton(btn).setButtonText(strings.cancelButton).onClick(() => {
        this.onCancel();
      }),
    );
  }

  update(progress: BulkSyncProgress): void {
    if (!this.progressEl) return;
    this.progressEl.textContent = t().bulkProgress(
      progress.filesChanged,
      progress.totalFilesToChange,
      progress.changesApplied,
    );
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

function validationIssues(pairs: RelationPair[]) {
  const strings = t();
  return validateRelationPairs(pairs, {
    emptyField: strings.validationEmptyField,

    duplicatePair: strings.validationDuplicatePair,
    conflictingKey: strings.validationConflictingKey,
  });
}

export function showSyncPreview(app: App, engine: SyncEngine, sourceFile?: TFile, onDone?: () => void): void {
  const strings = t();
  if (engine.getState() === "blocked") {
    new Notice(strings.configInvalidDesc);
    return;
  }
  const plan = engine.previewBulkSync(sourceFile);
  new BulkSyncPreviewModal(app, plan, () => {
    void (async () => {
      const running = new BulkSyncRunningModal(app, () => engine.cancelBulkSync());
      running.open();
      try {
        const result = await engine.runBulkSync((progress) => running.update(progress), sourceFile, plan);
        new Notice(result.cancelled ? strings.bulkSyncCancelledNotice(result.log.length) :
          strings.syncResult(result.scanned, result.count, result.log.length, result.failed));
        new SyncLogModal(app, result.log).open();
      } catch (error) {
        new Notice(error instanceof Error ? error.message : strings.bulkSyncFailedNotice);
      } finally {
        running.close();
        onDone?.();
      }
    })();
  }).open();
}

class PairEditModal extends Modal {
  constructor(app: App, private readonly pairs: RelationPair[], private readonly index: number | undefined,
    private readonly onSave: (pair: RelationPair) => Promise<void>) { super(app); }

  onOpen(): void {
    const strings = t();
    const draft: RelationPair = this.index === undefined ? { forward: "", inverse: "", enabled: true } :
      structuredClone(this.pairs[this.index]!);
    const { contentEl } = this;
    new Setting(contentEl).setName(this.index === undefined ? strings.addPairButton : strings.editPair).setHeading();
    for (const side of ["forward", "inverse"] as const) {
      new Setting(contentEl).setName(side === "forward" ? strings.forwardLabel : strings.inverseLabel)
        .addText((text) => {
          text.setValue(draft[side]).setPlaceholder(side === "forward" ? strings.forwardPlaceholder : strings.inversePlaceholder)
            .onChange((value) => { draft[side] = value; errorEl.setText(""); });
          text.inputEl.setAttribute("aria-label", side === "forward" ? strings.forwardLabel : strings.inverseLabel);
        });
      new Setting(contentEl).setName(side === "forward" ? strings.forwardAliasesLabel : strings.inverseAliasesLabel)
        .setDesc(strings.aliasesDesc).addTextArea((text) => {
          text.setValue((draft[`${side}Aliases`] ?? []).join(", ")).setPlaceholder(strings.aliasesPlaceholder)
            .onChange((value) => { draft[`${side}Aliases`] = [...new Set(value.split(",").map((key) => key.trim()).filter(Boolean))]; errorEl.setText(""); });
          text.inputEl.setAttribute("aria-label", side === "forward" ? strings.forwardAliasesLabel : strings.inverseAliasesLabel);
        });
    }
    new Setting(contentEl).setName(strings.pairEnabled).addToggle((toggle) =>
      toggle.setValue(draft.enabled !== false).onChange((value) => { draft.enabled = value; }));
    const errorEl = contentEl.createDiv({ cls: "relation-sync-validation" });
    errorEl.setAttribute("role", "alert");
    new Setting(contentEl)
      .addButton((btn) => btn.setButtonText(strings.cancelButton).onClick(() => this.close()))
      .addButton((btn) => btn.setButtonText(strings.savePair).setCta().onClick(() => {
        draft.forward = draft.forward.trim();
        draft.inverse = draft.inverse.trim();
        if (!draft.forward || !draft.inverse) { errorEl.setText(strings.validationEmptyField); return; }
        const proposed = [...this.pairs];
        if (this.index === undefined) proposed.push(draft); else proposed[this.index] = draft;
        const issues = validationIssues(proposed);
        if (issues.length > 0) { errorEl.setText([...new Set(issues.map((issue) => issue.message))].join(" ")); return; }
        btn.setDisabled(true);
        void this.onSave(draft).then(() => this.close()).catch((error: unknown) => {
          btn.setDisabled(false);
          errorEl.setText(error instanceof Error ? error.message : strings.configInvalidDesc);
        });
      }));
  }

  onClose(): void { this.contentEl.empty(); }
}

export class RelationSyncSettingTab extends PluginSettingTab {
  private readonly plugin: RelationSyncPlugin;
  private searchQuery = "";
  private languageFilter = "all";
  private readonly openCategories = new Set<string>(["family", "custom"]);
  private advancedOpen = false;

  constructor(app: App, plugin: RelationSyncPlugin) { super(app, plugin); this.plugin = plugin; }

  getSettingDefinitions(): SettingDefinitionItem[] {
    const strings = t();
    const state = this.plugin.engine.getState();
    return [
      { type: "group", heading: strings.pluginTitle, items: [
        { name: strings.pluginDescription, desc: state === "ready" ? strings.stateReady : state === "paused" ? strings.statePaused : strings.stateBlocked },
        { name: strings.syncEnabled, desc: strings.syncEnabledDesc, render: (setting) => {
          setting.addToggle((toggle) => toggle.setValue(this.plugin.settings.syncEnabled).onChange(async (value) => {
            this.plugin.settings.syncEnabled = value;
            await this.plugin.saveSettings();
            this.refreshSettings();
          }));
        } },
      ] },
      { type: "group", heading: strings.firstRunTitle, cls: "relation-sync-start", items: [
        { name: strings.firstRunDesc, render: (setting) => {
          setting.settingEl.addClass("relation-sync-example-row");
          this.renderExamples(setting.settingEl);
        } },
        { name: strings.checkCurrentNote, desc: strings.checkCurrentNoteDesc, render: (setting) => {
          setting.addButton((btn) => btn.setButtonText(strings.checkCurrentNote).setCta().onClick(() => this.previewCurrent()));
        } },
      ] },
      { name: strings.relationsHeading, desc: strings.aliasesDesc,
        aliases: [strings.languageFilter, strings.filterRelations, strings.addPairButton,
          ...this.plugin.settings.relations.flatMap((pair) => [...relationKeys(pair, "forward"), ...relationKeys(pair, "inverse")])],
        render: (setting) => {
          setting.settingEl.addClass("relation-sync-editor");
          this.renderRelationEditor(setting.settingEl);
        },
      },
      { type: "group", heading: strings.advancedHeading, items: [
        { name: strings.syncVault, desc: strings.syncVaultDesc, render: (setting) => {
          setting.addButton((btn) => btn.setButtonText(strings.syncVaultButton).onClick(() =>
            showSyncPreview(this.app, this.plugin.engine, undefined, () => this.refreshSettings())));
        } },
        { name: strings.viewRecentLog, desc: strings.viewRecentLogDesc, render: (setting) => {
          setting.addButton((btn) => btn.setButtonText(strings.viewRecentLogButton).onClick(() =>
            new SyncLogModal(this.app, this.plugin.engine.getRecentLog()).open()));
        } },
        { name: strings.undoLastSync, desc: strings.undoSessionDesc, render: (setting) => {
          setting.addButton((btn) => btn.setButtonText(strings.undoLastSyncButton)
            .setDisabled(!this.plugin.engine.canUndoLastSync()).onClick(() => this.previewUndo()));
        } },
        { name: strings.excludePaths, desc: strings.excludePathsDesc, render: (setting) => {
          setting.addText((text) => {
            text.setValue(this.plugin.settings.excludePaths).setPlaceholder(strings.excludePathsPlaceholder)
              .onChange(async (value) => { this.plugin.settings.excludePaths = value; await this.plugin.saveSettings(); });
            text.inputEl.setAttribute("aria-label", strings.excludePaths);
          });
        } },
        { name: strings.languagePresets, desc: strings.languagePresetsDesc, render: (setting) => {
          setting.addButton((btn) => btn.setButtonText(strings.enableEnglish).onClick(() => void this.enablePreset("en")))
            .addButton((btn) => btn.setButtonText(strings.enableItalian).onClick(() => void this.enablePreset("it")));
        } },
        { name: strings.exportPairs, desc: strings.exportPairsDesc, render: (setting) => {
          setting.addButton((btn) => btn.setButtonText(strings.exportPairsButton).onClick(() => void this.exportPairs()));
        } },
        { name: strings.importPairs, desc: strings.importPairsDesc, render: (setting) => {
          setting.addButton((btn) => btn.setButtonText(strings.importPairsButton).onClick(() => this.importPairs()));
        } },
        { name: strings.resetToDefaults, desc: strings.resetToDefaultsDesc, render: (setting) => {
          setting.addButton((btn) => destructiveButton(btn).setButtonText(strings.resetToDefaultsButton).onClick(() => this.confirmReset()));
        } },
      ] },
    ];
  }

  private refreshSettings(): void {
    if (requireApiVersion("1.13.0")) this.update();
    else this.renderLegacySettings();
  }

  display(): void { this.renderLegacySettings(); }

  private renderExamples(container: HTMLElement): void {
    const strings = t();
    const examples = container.createDiv({ cls: "relation-sync-examples" });
    for (const [name, key, target] of [[strings.exampleSource, strings.exampleForward, strings.exampleTarget],
      [strings.exampleTarget, strings.exampleInverse, strings.exampleSource]]) {
      const example = examples.createDiv();
      example.createEl("strong", { text: name });
      example.createEl("pre", { text: `---\n${key}: "[[${target?.replace(/\.md$/, "")}]]"\n---` });
    }
  }

  private renderRelationEditor(container: HTMLElement): void {
    const strings = t();
    new Setting(container).setName(strings.languageFilter).addDropdown((dropdown) =>
      dropdown.addOptions({ all: strings.allLanguages, en: "English", it: "Italiano" }).setValue(this.languageFilter)
        .onChange((value) => { this.languageFilter = value; this.renderRelations(listEl, countEl); }));
    new Setting(container).setName(strings.filterRelations).addSearch((search) => {
      search.setValue(this.searchQuery).setPlaceholder(strings.searchPlaceholder)
        .onChange((value) => { this.searchQuery = value; this.renderRelations(listEl, countEl); });
      search.inputEl.setAttribute("aria-label", strings.filterRelations);
    }).addButton((btn) => btn.setButtonText(strings.addPairButton).onClick(() => this.editPair()));
    const countEl = container.createDiv({ cls: "relation-sync-count" });
    const listEl = container.createDiv({ cls: "relation-sync-list" });
    this.renderRelations(listEl, countEl);
  }

  private confirmReset(): void {
    const strings = t();
    new ConfirmModal(this.app, strings.resetConfirm, () => {
      this.plugin.settings.relations = getDefaultRelations();
      void this.plugin.saveSettings().then(() => { new Notice(strings.resetNotice); this.refreshSettings(); });
    }).open();
  }

  private renderLegacySettings(): void {
    const { containerEl } = this;
    const strings = t();
    const scrollTop = containerEl.scrollTop;
    containerEl.empty();
    window.requestAnimationFrame(() => { containerEl.scrollTop = scrollTop; });
    new Setting(containerEl).setName(strings.pluginTitle).setDesc(strings.pluginDescription).setHeading();
    const statusEl = containerEl.createDiv({ cls: "relation-sync-status" });
    statusEl.setAttribute("role", "status");
    const updateStatus = () => {
      const state = this.plugin.engine.getState();
      statusEl.setText(state === "ready" ? strings.stateReady : state === "paused" ? strings.statePaused : strings.stateBlocked);
      statusEl.toggleClass("relation-sync-warning", state === "blocked");
    };
    updateStatus();
    new Setting(containerEl).setName(strings.syncEnabled).setDesc(strings.syncEnabledDesc).addToggle((toggle) =>
      toggle.setValue(this.plugin.settings.syncEnabled).onChange((value) => {
        this.plugin.settings.syncEnabled = value;
        void this.plugin.saveSettings().then(updateStatus);
      }));

    const start = containerEl.createDiv({ cls: "relation-sync-start" });
    new Setting(start).setName(strings.firstRunTitle).setHeading();
    start.createEl("p", { text: strings.firstRunDesc });
    this.renderExamples(start);
    new Setting(start).setName(strings.checkCurrentNote).setDesc(strings.checkCurrentNoteDesc).addButton((btn) =>
      btn.setButtonText(strings.checkCurrentNote).setCta().onClick(() => this.previewCurrent()));

    new Setting(containerEl).setName(strings.relationsHeading).setDesc(strings.aliasesDesc).setHeading();
    this.renderRelationEditor(containerEl);

    const advanced = containerEl.createEl("details", { cls: "relation-sync-advanced" });
    advanced.open = this.advancedOpen;
    advanced.addEventListener("toggle", () => { this.advancedOpen = advanced.open; });
    advanced.createEl("summary", { text: strings.advancedHeading });
    const tools = advanced.createDiv();
    new Setting(tools).setName(strings.syncVault).setDesc(strings.syncVaultDesc).addButton((btn) =>
      btn.setButtonText(strings.syncVaultButton).onClick(() => showSyncPreview(this.app, this.plugin.engine, undefined, () => this.refreshSettings())));
    new Setting(tools).setName(strings.viewRecentLog).setDesc(strings.viewRecentLogDesc).addButton((btn) =>
      btn.setButtonText(strings.viewRecentLogButton).onClick(() => new SyncLogModal(this.app, this.plugin.engine.getRecentLog()).open()));
    new Setting(tools).setName(strings.undoLastSync).setDesc(strings.undoSessionDesc).addButton((btn) =>
      btn.setButtonText(strings.undoLastSyncButton).setDisabled(!this.plugin.engine.canUndoLastSync()).onClick(() => this.previewUndo()));
    new Setting(tools).setName(strings.excludePaths).setDesc(strings.excludePathsDesc).addText((text) => {
      text.setValue(this.plugin.settings.excludePaths).setPlaceholder(strings.excludePathsPlaceholder)
        .onChange((value) => { this.plugin.settings.excludePaths = value; void this.plugin.saveSettings(); });
      text.inputEl.setAttribute("aria-label", strings.excludePaths);
    });
    new Setting(tools).setName(strings.languagePresets).setDesc(strings.languagePresetsDesc)
      .addButton((btn) => btn.setButtonText(strings.enableEnglish).onClick(() => void this.enablePreset("en")))
      .addButton((btn) => btn.setButtonText(strings.enableItalian).onClick(() => void this.enablePreset("it")));
    new Setting(tools).setName(strings.exportPairs).setDesc(strings.exportPairsDesc).addButton((btn) =>
      btn.setButtonText(strings.exportPairsButton).onClick(() => void this.exportPairs()));
    new Setting(tools).setName(strings.importPairs).setDesc(strings.importPairsDesc).addButton((btn) =>
      btn.setButtonText(strings.importPairsButton).onClick(() => this.importPairs()));
    new Setting(tools).setName(strings.resetToDefaults).setDesc(strings.resetToDefaultsDesc).addButton((btn) =>
      destructiveButton(btn).setButtonText(strings.resetToDefaultsButton).onClick(() => {
        this.confirmReset();
      }));
  }

  private previewCurrent(): void {
    const file = this.app.workspace.getActiveFile();
    if (!(file instanceof TFile) || file.extension !== "md") { new Notice(t().noActiveNote); return; }
    showSyncPreview(this.app, this.plugin.engine, file, () => this.refreshSettings());
  }

  private previewUndo(): void {
    const entries = this.plugin.engine.getUndoBatch();
    new BulkSyncPreviewModal(this.app, {
      entries: entries.map((entry) => ({ ...entry, action: entry.action === "added" ? "removed" : "added" })), problems: [], filesScanned: 0, filesToChange: new Set(entries.map((entry) => entry.file)).size,
      added: entries.filter((entry) => entry.action === "removed").length,
      removed: entries.filter((entry) => entry.action === "added").length,
    }, () => {
      void this.plugin.engine.undoLastSync(entries).then((result) => {
        new Notice(t().undoLastSyncNotice(result.count));
        new SyncLogModal(this.app, result.log).open();
        this.refreshSettings();
      }).catch((error: unknown) => new Notice(error instanceof Error ? error.message : t().bulkSyncFailedNotice));
    }, true).open();
  }

  private editPair(index?: number): void {
    new PairEditModal(this.app, this.plugin.settings.relations, index, async (pair) => {
      if (index === undefined) this.plugin.settings.relations.push(pair); else this.plugin.settings.relations[index] = pair;
      await this.plugin.saveSettings();
      this.refreshSettings();
    }).open();
  }

  private renderRelations(container: HTMLElement, countEl: HTMLElement): void {
    container.empty();
    const strings = t();
    const relations = this.plugin.settings.relations;
    const issues = validationIssues(relations);
    const query = this.searchQuery.trim().toLowerCase();
    countEl.setText(strings.activePairs(relations.filter((pair) => pair.enabled !== false).length, relations.length));
    if (issues.length > 0) {
      const warning = container.createDiv({ cls: "relation-sync-warning", text: strings.configInvalidDesc });
      warning.setAttribute("role", "alert");
    }
    const grouped = new Map<CategoryId | "custom", { pair: RelationPair; index: number }[]>();
    for (const [index, pair] of relations.entries()) {
      if (this.languageFilter !== "all" && !pairMatchesLocale(pair, this.languageFilter)) continue;
      const keys = [...relationKeys(pair, "forward"), ...relationKeys(pair, "inverse")];
      if (query && !keys.some((key) => key.toLowerCase().includes(query))) continue;
      const category = getCategoryForKey(pair.forward);
      const rows = grouped.get(category) ?? [];
      rows.push({ pair, index }); grouped.set(category, rows);
    }
    if (grouped.size === 0) container.createEl("p", { text: query ? strings.noSearchResults : strings.noRelations });
    for (const category of CATEGORY_ORDER) {
      const rows = grouped.get(category);
      if (!rows) continue;
      const details = container.createEl("details", { cls: "relation-sync-category" });
      details.open = Boolean(query) || this.openCategories.has(category);
      details.addEventListener("toggle", () => {
        if (this.searchQuery) return;
        if (details.open) this.openCategories.add(category); else this.openCategories.delete(category);
      });
      details.createEl("summary", { text: `${categoryLabel(category)} · ${rows.length}` });
      for (const { pair, index } of rows) {
        const aliases = [...(pair.forwardAliases ?? []), ...(pair.inverseAliases ?? [])];
        const row = new Setting(details).setName(`${pair.forward} ↔ ${pair.inverse}`)
          .setDesc(aliases.join(", "));
        row.settingEl.addClass("relation-sync-row");
        row.addToggle((toggle) => {
          toggle.setValue(pair.enabled !== false).onChange((value) => {
            const proposed = relations.map((existing, i) => i === index ? { ...existing, enabled: value } : existing);
            const errors = validationIssues(proposed);
            if (value && errors.length > 0) {
              toggle.setValue(false); new Notice(errors.map((error) => error.message).join(" ")); return;
            }
            pair.enabled = value;
            void this.plugin.saveSettings().then(() => this.refreshSettings());
          });
          toggle.toggleEl.setAttribute("aria-label", `${strings.pairEnabled}: ${pair.forward} ↔ ${pair.inverse}`);
        });
        row.addButton((btn) => btn.setButtonText(strings.editPair).onClick(() => this.editPair(index)))
          .addExtraButton((btn) => btn.setIcon("trash").setTooltip(strings.removePairTooltip).onClick(() => {
            relations.splice(index, 1); void this.plugin.saveSettings().then(() => this.refreshSettings());
          }));
        const errors = issues.filter((issue) => issue.index === index);
        if (errors.length > 0) {
          row.settingEl.createDiv({ cls: "relation-sync-validation", text: errors.map((error) => error.message).join(" ") });
        }
      }
    }
  }

  private async enablePreset(locale: string): Promise<void> {
    const { relations, skipped } = enablePresetPairs(this.plugin.settings.relations, locale);
    this.plugin.settings.relations = relations;
    await this.plugin.saveSettings();
    if (skipped > 0) new Notice(t().presetConflicts(skipped));
    this.refreshSettings();
  }

  private async exportPairs(): Promise<void> {
    const strings = t();
    const json = JSON.stringify(this.plugin.settings.relations, null, 2);
    const filename = "relation-sync-pairs.json";
    try {
      const existing = this.app.vault.getAbstractFileByPath(filename);
      if (existing instanceof TFile) {
        new ConfirmModal(this.app, strings.exportOverwriteConfirm(filename), () => {
          void (async () => {
            await this.app.vault.modify(existing, json);
            new Notice(strings.exportSuccess(filename));
          })();
        }).open();
      } else {
        await this.app.vault.create(filename, json);
        new Notice(strings.exportSuccess(filename));
      }
    } catch {
      new Notice(strings.exportError);
    }
  }

  // ── Import pairs ──────────────────────────────────────────────────────

  private importPairs(): void {
    const strings = t();
    const input = createEl("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = () => {
      void (async () => {
        const file = input.files?.[0];
        if (!file) return;
        try {
          const text = await file.text();
          const parsed = JSON.parse(text) as unknown;
          if (!Array.isArray(parsed)) throw new Error("Not an array");
          if (!parsed.every(isRelationPair)) throw new Error("Invalid relation pair");
          const pairs: RelationPair[] = parsed;


          // Merge: skip duplicates by forward+inverse key
          const existing = new Set(
            this.plugin.settings.relations.map(
              (r) => `${r.forward.toLowerCase()}|${r.inverse.toLowerCase()}`,
            ),
          );
          let added = 0;
          let skipped = 0;
          for (const pair of pairs) {
            const key = `${pair.forward.toLowerCase()}|${pair.inverse.toLowerCase()}`;
            if (!existing.has(key)) {
              this.plugin.settings.relations.push(pair);
              existing.add(key);
              added++;
            } else {
              skipped++;
            }
          }
          const issues = validationIssues(this.plugin.settings.relations);
          if (issues.length > 0) {
            this.plugin.settings.relations.splice(this.plugin.settings.relations.length - added, added);
            throw new Error("Conflicting import");
          }
          await this.plugin.saveSettings();
          new Notice(skipped > 0 ? strings.duplicateImportSkipped(added, skipped) : strings.importSuccess(added));
          this.refreshSettings();
        } catch {
          new Notice(strings.importError);
        }
      })();
    };
    input.click();
  }
}
