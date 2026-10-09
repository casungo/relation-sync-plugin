import { ItemView, TFile, type WorkspaceLeaf } from "obsidian";
import type RelationSyncPlugin from "./main";
import { t } from "./locales";
import { parseWikiLinks } from "./utils";
import { buildRelationMap } from "./relation-map";
import { showSyncPreview } from "./settings-tab";

export const RELATION_PANEL_VIEW_TYPE = "relation-sync-panel";

interface GroupedRelation {
  targetKey: string;
  displayName: string;
  linkText: string;
  relations: string[];
}

export class RelationPanelView extends ItemView {
  private readonly plugin: RelationSyncPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: RelationSyncPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return RELATION_PANEL_VIEW_TYPE;
  }

  getDisplayText(): string {
    return t().relationsPanelTitle;
  }

  getIcon(): string {
    return "network";
  }

  async onOpen(): Promise<void> {
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => {
        this.render();
      }),
    );
    this.registerEvent(
      this.app.metadataCache.on("changed", () => {
        this.render();
      }),
    );
    this.render();
  }

  async onClose(): Promise<void> {
    this.contentEl.empty();
  }

  render(): void {
    const strings = t();
    const file = this.app.workspace.getActiveFile();
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("relation-sync-panel");

    contentEl.createEl("h2", {
      text: strings.relationsPanelTitle,
      cls: "relation-sync-panel-title",
    });

    const state = this.plugin.engine.getState();
    contentEl.createDiv({ cls: "relation-sync-status", text: state === "ready" ? strings.stateReady : state === "paused" ? strings.statePaused : strings.stateBlocked });
    const settingsButton = contentEl.createEl("button", { text: strings.panelConfigured });
    settingsButton.addEventListener("click", () => this.plugin.openSettings());
    if (!(file instanceof TFile)) {
      this.renderEmpty(strings.relationsPanelNoFile);
      return;
    }

    contentEl.createEl("p", { text: file.path, cls: "relation-sync-panel-note" });
    const checkButton = contentEl.createEl("button", { text: strings.panelCheck });
    checkButton.addEventListener("click", () => showSyncPreview(this.app, this.plugin.engine, file));
    const cache = this.app.metadataCache.getFileCache(file);
    const frontmatter = cache?.frontmatter;
    if (!frontmatter) {
      this.renderEmpty(`${strings.relationsPanelNoFrontmatter} ${strings.firstRunDesc}`);
      return;
    }

    const groups = this.getGroupedRelations(file, frontmatter);
    if (groups.length === 0) {
      this.renderEmpty(`${strings.relationsPanelNoRelations} ${strings.aliasesDesc}`);
      return;
    }

    contentEl.createDiv({
      text: strings.relationsPanelRelationCount(groups.length),
      cls: "relation-sync-panel-count",
    });

    const listEl = contentEl.createDiv({ cls: "relation-sync-panel-list" });
    for (const group of groups) {
      this.renderGroup(listEl, file, group);
    }
  }

  private renderEmpty(message: string): void {
    this.contentEl.createDiv({
      text: message,
      cls: "relation-sync-panel-empty",
    });
  }

  private getGroupedRelations(
    sourceFile: TFile,
    frontmatter: Record<string, unknown>,
  ): GroupedRelation[] {
    const enabledRelationKeys = buildRelationMap(this.plugin.settings.relations);

    const groups = new Map<string, GroupedRelation>();
    for (const rawKey of Object.keys(frontmatter)) {
      if (!enabledRelationKeys.has(rawKey.toLowerCase())) continue;

      for (const linkText of parseWikiLinks(frontmatter[rawKey])) {
        const target = this.app.metadataCache.getFirstLinkpathDest(linkText, sourceFile.path);
        const targetKey = target?.path ?? linkText.toLowerCase();
        const displayName = target?.basename ?? linkText.split("/").pop() ?? linkText;
        const existing = groups.get(targetKey) ?? {
          targetKey,
          displayName,
          linkText,
          relations: [],
        };
        if (!existing.relations.includes(rawKey)) {
          existing.relations.push(rawKey);
        }
        groups.set(targetKey, existing);
      }
    }

    return [...groups.values()].sort((a, b) =>
      a.displayName.localeCompare(b.displayName, undefined, { sensitivity: "base" }),
    );
  }

  private renderGroup(containerEl: HTMLElement, sourceFile: TFile, group: GroupedRelation): void {
    const strings = t();
    const itemEl = containerEl.createDiv({ cls: "relation-sync-panel-item" });
    const headerEl = itemEl.createDiv({ cls: "relation-sync-panel-item-header" });
    const linkEl = headerEl.createEl("button", {
      text: group.displayName,
      cls: "relation-sync-panel-link",
    });
    linkEl.type = "button";
    const states = group.relations.map((key) => this.plugin.engine.getLinkState(sourceFile, key, group.linkText));
    const state = states.find((value) => value !== "reciprocal") ?? "reciprocal";
    linkEl.disabled = state === "missing" || state === "invalid";
    itemEl.createDiv({ cls: "relation-sync-link-state", text: state === "missing" ? strings.panelMissing :
      state === "invalid" ? strings.problemInvalid : state === "excluded" ? strings.panelExcluded :
      state === "reciprocal" ? strings.panelReciprocal : strings.panelUnpaired });
    linkEl.title = strings.relationsPanelOpenNoteTooltip;
    linkEl.addEventListener("click", () => {
      void this.app.workspace.openLinkText(group.linkText, sourceFile.path);
    });

    headerEl.createSpan({
      text: String(group.relations.length),
      cls: "relation-sync-panel-badge",
    });

    const relationListEl = itemEl.createDiv({ cls: "relation-sync-panel-relations" });
    for (const relation of group.relations.sort((a, b) => a.localeCompare(b))) {
      relationListEl.createSpan({
        text: relation,
        cls: "relation-sync-panel-chip",
      });
    }
  }
}
