import { describe, expect, it } from "vitest";
import { isExcludedPath } from "./path-rules";

describe("exclude path matching", () => {
  it("matches exact files and folders case-insensitively", () => {
    const rules = "Templates, Archive/old, People/Alice.md";

    expect(isExcludedPath("Templates/Person.md", rules)).toBe(true);
    expect(isExcludedPath("archive/old/Note.md", rules)).toBe(true);
    expect(isExcludedPath("people/alice.md", rules)).toBe(true);
  });

  it("does not match partial path prefixes", () => {
    const rules = "Archive";

    expect(isExcludedPath("Archived/Note.md", rules)).toBe(false);
    expect(isExcludedPath("Notes/Archive.md", rules)).toBe(false);
  });
});
