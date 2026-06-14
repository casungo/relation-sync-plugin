import { describe, expect, it } from "vitest";
import { buildRelationMap } from "./relation-map";
import { validateRelationPairs } from "./validation";
import { getDefaultRelations } from "./locales";

const messages = {
  emptyField: "empty",
  sameField: "same",
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
    const english = defaults.find((pair) => pair.forward === "Parent of");
    const italian = defaults.find((pair) => pair.forward === "Genitore di");

    expect(english?.enabled).toBe(true);
    expect(italian?.enabled).toBe(false);
  });

  it("plans sync mappings only for enabled default language pairs", () => {
    const map = buildRelationMap(getDefaultRelations("en"));

    expect(map.get("parent of")).toBe("Child of");
    expect(map.has("genitore di")).toBe(false);
  });
});
