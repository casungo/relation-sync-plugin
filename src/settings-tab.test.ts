import { type App, type Setting, type SettingDefinition, type SettingDefinitionItem } from "obsidian";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type RelationSyncPlugin from "./main";
import { RelationSyncSettingTab } from "./settings-tab";
import { t } from "./locales";

const api = vi.hoisted(() => ({ modern: true, update: vi.fn() }));
vi.mock("obsidian", () => ({
  Modal: class {},
  Notice: class {},
  TFile: class {},
  Setting: class {},
  PluginSettingTab: class { update = api.update; },
  requireApiVersion: (version: string) => version === "1.13.0" && api.modern,
}));

beforeEach(() => {
  api.modern = true;
  api.update.mockClear();
  vi.stubGlobal("window", { moment: { locale: () => "en" } });
});

afterEach(() => vi.unstubAllGlobals());

function fixture() {
  const plugin = {
    settings: { syncEnabled: false, excludePaths: "Archive", relations: [{ forward: "parent", inverse: "child", forwardAliases: ["mother"] }] },
    engine: { getState: vi.fn(() => "paused"), canUndoLastSync: vi.fn(() => false) },
    saveSettings: vi.fn(async () => {}),
  };
  const tab = new RelationSyncSettingTab({} as App, plugin as unknown as RelationSyncPlugin);
  return { plugin, tab };
}

function rows(items: SettingDefinitionItem[]): SettingDefinition[] {
  return items.flatMap((item) => "items" in item ? rows(item.items ?? []) : [item as SettingDefinition]);
}

function bind(definition: SettingDefinition, kind: "addToggle" | "addText") {
  let onChange!: (value: never) => Promise<void>;
  const control = {
    setValue: vi.fn(() => control),
    setPlaceholder: vi.fn(() => control),
    onChange: (callback: typeof onChange) => { onChange = callback; return control; },
    inputEl: { setAttribute: vi.fn() },
  };
  const setting = { [kind]: (callback: (value: typeof control) => void) => callback(control) } as unknown as Setting;
  if (!definition.render) throw new Error("Missing setting render callback");
  definition.render(setting, {} as Parameters<typeof definition.render>[1]);
  return { control, change: (value: boolean | string) => onChange(value as never) };
}

describe("declarative settings with legacy compatibility", () => {
  it("indexes every tool and relation aliases without saving or rendering", () => {
    const { plugin, tab } = fixture();
    const definitions = rows(tab.getSettingDefinitions());
    const strings = t();
    expect(definitions.map((item) => item.name)).toEqual(expect.arrayContaining([
      strings.syncEnabled, strings.checkCurrentNote, strings.relationsHeading,
      strings.syncVault, strings.viewRecentLog, strings.undoLastSync, strings.excludePaths,
      strings.languagePresets, strings.exportPairs, strings.importPairs, strings.resetToDefaults,
    ]));
    expect(definitions.find((item) => item.name === strings.relationsHeading)?.aliases).toContain("mother");
    expect(plugin.saveSettings).not.toHaveBeenCalled();
    expect(api.update).not.toHaveBeenCalled();
  });

  it("saves through the plugin hook and updates declarative settings after toggling sync", async () => {
    const { plugin, tab } = fixture();
    const definition = rows(tab.getSettingDefinitions()).find((item) => item.name === t().syncEnabled)!;
    const { control, change } = bind(definition, "addToggle");
    expect(control.setValue).toHaveBeenCalledWith(false);
    await change(true);
    expect(plugin.settings.syncEnabled).toBe(true);
    expect(plugin.saveSettings).toHaveBeenCalledOnce();
    expect(api.update).toHaveBeenCalledOnce();
  });

  it("refreshes the legacy UI without calling a new API on older Obsidian", async () => {
    api.modern = false;
    const { tab } = fixture();
    const legacy = vi.spyOn(tab as unknown as { renderLegacySettings(): void }, "renderLegacySettings").mockImplementation(() => {});
    const definition = rows(tab.getSettingDefinitions()).find((item) => item.name === t().syncEnabled)!;
    await bind(definition, "addToggle").change(true);
    expect(legacy).toHaveBeenCalledOnce();
    expect(api.update).not.toHaveBeenCalled();
    tab.display();
    expect(legacy).toHaveBeenCalledTimes(2);
  });

  it("persists exclusions through the plugin hook", async () => {
    const { plugin, tab } = fixture();
    const definition = rows(tab.getSettingDefinitions()).find((item) => item.name === t().excludePaths)!;
    const { control, change } = bind(definition, "addText");
    expect(control.setValue).toHaveBeenCalledWith("Archive");
    await change("Private");
    expect(plugin.settings.excludePaths).toBe("Private");
    expect(plugin.saveSettings).toHaveBeenCalledOnce();
  });
});
