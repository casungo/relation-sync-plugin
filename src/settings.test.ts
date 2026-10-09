import { describe, expect, it } from "vitest";
import { loadRelationSettings, enablePresetPairs } from "./settings";
import { validateRelationPairs, isRelationPair } from "./validation";
import { getDefaultRelations } from "./locales";

const messages = { emptyField: "empty", duplicatePair: "duplicate", conflictingKey: () => "conflict" };

describe("settings loading and migration", () => {
  it("starts new installations paused with independent English and Italian presets", () => {
    const { settings, migrated } = loadRelationSettings(null);
    expect(settings).toMatchObject({ syncEnabled: false, excludePaths: "", schemaVersion: 2 });
    expect(settings.relations).toEqual(getDefaultRelations());
    expect(migrated).toBe(false);
  });

  it("replaces stock presets, retires other languages and preserves custom pairs and safety choices", () => {
    const custom = { forward: "project", inverse: "task", forwardAliases: ["initiative"], enabled: true };
    const { settings, migrated } = loadRelationSettings({
      syncEnabled: false, excludePaths: "Templates, Archive", relations: [
        { forward: "Figlio di", inverse: "Genitore di", enabled: true },
        { forward: "Genitore di", inverse: "Figlio di", enabled: true },
        { forward: "Child of", inverse: "Parent of", enabled: false },
        { forward: "Enfant de", inverse: "Parent de", enabled: true },
        custom,
      ],
    });
    expect(migrated).toBe(true);
    expect(settings.syncEnabled).toBe(false);
    expect(settings.excludePaths).toBe("Templates, Archive");
    expect(settings.relations).toContainEqual(custom);
    expect(settings.relations.find((pair) => pair.forward === "genitore")?.enabled).toBe(true);
    expect(settings.relations.find((pair) => pair.forward === "parent")?.enabled).toBe(false);
    expect(settings.relations.some((pair) => pair.forward === "Enfant de")).toBe(false);
    expect(validateRelationPairs(settings.relations, messages)).toEqual([]);
  });

  it("preserves custom mappings that overlap a new preset, leaving that preset off", () => {
    const custom = { forward: "mother", inverse: "related person", enabled: true };
    const result = loadRelationSettings({ syncEnabled: true, relations: [
      { forward: "Child of", inverse: "Parent of", enabled: true }, custom,
    ] });
    expect(result.settings.relations).toContainEqual(custom);
    expect(result.settings.relations.find((pair) => pair.forward === "parent")?.enabled).toBe(false);
    expect(result.settings.syncEnabled).toBe(true);
    expect(validateRelationPairs(result.settings.relations, messages)).toEqual([]);
  });

  it("does not re-enable edited or removed presets on a subsequent load", () => {
    const saved = { schemaVersion: 2, syncEnabled: true, excludePaths: "Archive", relations: [
      { forward: "custom", inverse: "other", enabled: false, forwardAliases: ["alias"] },
    ] };
    const result = loadRelationSettings(saved);
    expect(result.migrated).toBe(false);
    expect(result.settings).toEqual(saved);
    result.settings.relations[0]!.forwardAliases!.push("new");
    expect(saved.relations[0]!.forwardAliases).toEqual(["alias"]);
  });

  it("recognizes only well-formed imported pairs and aliases", () => {
    expect(isRelationPair({ forward: "a", inverse: "b", enabled: "yes" })).toBe(false);
    expect(isRelationPair({ forward: "a", inverse: "b", forwardAliases: "mother" })).toBe(false);
    expect(isRelationPair({ forward: "a", inverse: "b", inverseAliases: [42] })).toBe(false);
    expect(isRelationPair({ forward: "a", inverse: "b", forwardAliases: [" "] })).toBe(false);
    expect(isRelationPair({ forward: "a", inverse: "b", forwardAliases: ["mother"] })).toBe(true);
  });
});


describe("preset activation", () => {
  it("activates both supported catalogs without conflicts", () => {
    const en = enablePresetPairs([], "en");
    const all = enablePresetPairs(en.relations, "it");
    expect(en.skipped).toBe(0);
    expect(all.skipped).toBe(0);
    expect(validateRelationPairs(all.relations, messages)).toEqual([]);
  });

  it("keeps custom mappings and skips overlapping preset aliases", () => {
    const custom = { forward: "mamma", inverse: "relazione", enabled: true };
    const result = enablePresetPairs([custom], "it");
    expect(result.skipped).toBe(1);
    expect(result.relations).toContainEqual(custom);
    expect(result.relations.some((pair) => pair.forward === "genitore")).toBe(false);
    expect(validateRelationPairs(result.relations, messages)).toEqual([]);
  });
});
