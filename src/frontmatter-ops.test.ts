import { describe, expect, it } from "vitest";
import {
  addInverseToFrontmatter,
  findActualKey,
  getExistingStringValues,
  removeInverseFromFrontmatter,
} from "./frontmatter-ops";

describe("frontmatter relation operations", () => {
  it("adds a missing inverse as a single value", () => {
    const fm: Record<string, unknown> = {};

    expect(addInverseToFrontmatter(fm, "Parent of", "[[Alice]]")).toBe(true);
    expect(fm).toEqual({ "Parent of": "[[Alice]]" });
  });

  it("promotes a single value to an array without duplicating links", () => {
    const fm: Record<string, unknown> = { "Parent of": "[[Alice]]" };

    expect(addInverseToFrontmatter(fm, "Parent of", "[[Bob]]")).toBe(true);
    expect(addInverseToFrontmatter(fm, "Parent of", "[[Bob|B]]")).toBe(false);
    expect(fm).toEqual({ "Parent of": ["[[Alice]]", "[[Bob]]"] });
  });

  it("appends to an array while preserving existing non-string values", () => {
    const fm: Record<string, unknown> = { "Parent of": ["[[Alice]]", 42] };

    expect(addInverseToFrontmatter(fm, "Parent of", "[[Bob]]")).toBe(true);
    expect(fm).toEqual({ "Parent of": ["[[Alice]]", 42, "[[Bob]]"] });
  });

  it("removes an array value and collapses to a single value", () => {
    const fm: Record<string, unknown> = { "Parent of": ["[[Alice]]", "[[Bob]]"] };

    expect(removeInverseFromFrontmatter(fm, "Parent of", "[[Bob.md]]")).toBe(true);
    expect(fm).toEqual({ "Parent of": "[[Alice]]" });
  });

  it("deletes the key when the last relation is removed", () => {
    const fm: Record<string, unknown> = { "Parent of": "[[Alice]]" };

    expect(removeInverseFromFrontmatter(fm, "Parent of", "Alice#Bio")).toBe(true);
    expect(fm).toEqual({});
  });

  it("finds keys and string values conservatively", () => {
    expect(findActualKey({ "Parent Of": "[[Alice]]" }, "parent of")).toBe("Parent Of");
    expect(getExistingStringValues(["[[Alice]]", 42, null, "[[Bob]]"])).toEqual([
      "[[Alice]]",
      "[[Bob]]",
    ]);
  });
});
