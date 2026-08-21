import { describe, expect, it } from "vitest";
import {
  linkTargetsEqual,
  matchesFrontmatterRelationKey,
  parseWikiLinks,
  replaceWikiLinkTarget,
  toWikiLink,
} from "./utils";

describe("parseWikiLinks", () => {
  it("extracts links from strings and arrays", () => {
    expect(parseWikiLinks(["[[People/Alice|Alice]]", "prefix [[Bob#Bio]] suffix"])).toEqual([
      "People/Alice",
      "Bob",
    ]);
  });

  it("ignores non-string frontmatter values", () => {
    expect(parseWikiLinks([42, null, { link: "[[Alice]]" }])).toEqual([]);
  });
});

describe("matchesFrontmatterRelationKey", () => {
  it("matches only the field itself and numeric array entries", () => {
    expect(matchesFrontmatterRelationKey("family", "Family")).toBe(true);
    expect(matchesFrontmatterRelationKey("family.0", "family")).toBe(true);
    expect(matchesFrontmatterRelationKey("family.12", "family")).toBe(true);
    expect(matchesFrontmatterRelationKey("family.parent", "family")).toBe(false);
    expect(matchesFrontmatterRelationKey("family.0.link", "family")).toBe(false);
  });
});

describe("link target helpers", () => {
  it("compares plain, wiki, heading, alias, and .md variants", () => {
    expect(linkTargetsEqual("[[People/Alice.md|A]]", "People/Alice#Intro")).toBe(true);
  });

  it("wraps normalized link text as a wiki link", () => {
    expect(toWikiLink("[[People/Alice.md|A]]")).toBe("[[People/Alice]]");
  });
});

describe("replaceWikiLinkTarget", () => {
  it("replaces basename links while preserving alias and heading", () => {
    expect(replaceWikiLinkTarget("[[Alice#Bio|A]]", "Alice.md", "People/Alice.md")).toBe("[[People/Alice#Bio|A]]");
  });

  it("replaces path-aware links with the new path", () => {
    expect(replaceWikiLinkTarget("[[Old/Alice|A]]", "Old/Alice.md", "New/Alice.md")).toBe("[[New/Alice|A]]");
  });

  it("renames basename links when the basename changes", () => {
    expect(replaceWikiLinkTarget("[[Alice]] and [[Other]]", "Alice.md", "Alicia.md")).toBe("[[Alicia]] and [[Other]]");
  });

  it("does not replace path-qualified links that only share the basename", () => {
    expect(replaceWikiLinkTarget("[[Archive/Alice]] and [[Alice]]", "People/Alice.md", "People/Alicia.md")).toBe("[[Archive/Alice]] and [[Alicia]]");
  });

  it("allows rename callers to preserve an ambiguous basename link", () => {
    const result = replaceWikiLinkTarget(
      "[[People/Alice]] and [[Alice]]",
      "People/Alice.md",
      "People/Alicia.md",
      (target) => target === "People/Alice",
    );

    expect(result).toBe("[[People/Alicia]] and [[Alice]]");
  });
});
