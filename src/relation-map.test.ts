import { describe, expect, it } from "vitest";
import { buildRelationMap } from "./relation-map";
import { validateRelationPairs } from "./validation";
import { LEGACY_RELATIONS } from "./legacy-relations";
import { getDefaultRelations, getLocaleCodes } from "./locales";

const messages = {
  emptyField: "empty",

  duplicatePair: "duplicate",
  conflictingKey: (key: string) => `conflict:${key}`,
};

describe("buildRelationMap", () => {
  it("registers enabled pairs in both directions", () => {
    const map = buildRelationMap([{ forward: "Parent of", inverse: "Child of" }]);

    expect(map.get("parent of")).toBe("Child of");
    expect(map.get("child of")).toBe("Parent of");
  });

  it("skips disabled and empty pairs", () => {
    const map = buildRelationMap([
      { forward: "A", inverse: "B", enabled: false },
      { forward: "", inverse: "C" },
    ]);

    expect(map.size).toBe(0);
  });
});

describe("validateRelationPairs", () => {
  it("flags empty, duplicate, and conflicting relation keys", () => {
    const issues = validateRelationPairs(
      [
        { forward: "", inverse: "Child of" },
        { forward: "Sibling of", inverse: "Sibling of" },
        { forward: "Parent of", inverse: "Child of" },
        { forward: "Child of", inverse: "Parent of" },
        { forward: "Parent of", inverse: "Child of" },
        { forward: "Parent of", inverse: "Mentor of" },
      ],
      messages,
    );

    expect(issues.map((issue) => issue.message)).toEqual([
      "empty",
      "duplicate",
      "conflict:parent of",
    ]);
  });

  it("allows reciprocal and self-inverse bundled relations", () => {
    const issues = validateRelationPairs(getDefaultRelations("en"), messages);

    expect(issues).toEqual([]);
  });

  it("enables only the selected locale in the default relation set", () => {
    const defaults = getDefaultRelations("en");
    const english = defaults.find((pair) => pair.forward === "parent");
    const italian = defaults.find((pair) => pair.forward === "genitore");

    expect(english?.enabled).toBe(true);
    expect(italian?.enabled).toBe(false);
  });

  it("plans sync mappings only for enabled default language pairs", () => {
    const map = buildRelationMap(getDefaultRelations("en"));

    expect(map.get("mother")).toBe("child");
    expect(map.has("madre")).toBe(false);
  });
});


describe("English and Italian presets", () => {
  it("ships only English and Italian with conflict-free defaults enabled together", () => {
    expect(getLocaleCodes()).toEqual(["en", "it"]);
    const defaults = getDefaultRelations();
    expect(defaults.every((pair) => pair.enabled)).toBe(true);
    expect(validateRelationPairs(defaults, messages)).toEqual([]);
    const map = buildRelationMap(defaults);
    expect(map.get("mamma")).toBe("figli");
    expect(map.get("papà")).toBe("figli");
    expect(map.get("daughter")).toBe("parent");
    expect(map.get("figlia")).toBe("genitore");
  });

  it("validates aliases on both sides, including collisions with a canonical name", () => {
    expect(validateRelationPairs([
      { forward: "parent", inverse: "child", forwardAliases: ["mother"] },
      { forward: "mother", inverse: "daughter" },
    ], messages)).toEqual([{ index: 1, message: "conflict:mother" }]);
    expect(validateRelationPairs([
      { forward: "parent", inverse: "child", inverseAliases: ["parent"] },
    ], messages).map((issue) => issue.message)).toEqual(["conflict:parent"]);
  });

  it("retains the meaning of legacy source-role phrases", () => {
    const map = buildRelationMap(getDefaultRelations());
    expect(map.get("figlio di")).toBe("figli");
    expect(map.get("madre di")).toBe("genitore");
    expect(map.get("child of")).toBe("child");
    expect(map.get("mother of")).toBe("parent");
  });
});


it("recognizes every legacy English and Italian property through the new catalog", () => {
  const map = buildRelationMap(getDefaultRelations());
  for (const code of ["en", "it"]) {
    for (const pair of LEGACY_RELATIONS[code]!) {
      for (const key of pair.split("|")) expect(map.has(key), key).toBe(true);
    }
  }
});
