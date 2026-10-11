/**
 * Parse [[WikiLinks]] from a raw frontmatter value (string or array of strings).
 * Handles both `[[Name]]` and `[[Name|Alias]]` / `[[Name#Heading]]` forms.
 */
export function parseWikiLinks(value: unknown): string[] {
  if (!value) return [];
  const items = Array.isArray(value) ? (value as unknown[]) : [value];
  const result: string[] = [];
  for (const item of items) {
    if (typeof item !== "string") continue;
    const re = /\[\[([^\]|#]+)(?:[|#][^\]]*)?]]/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(item)) !== null) {
      const link = m[1]?.trim();
      if (link) result.push(link);
    }
  }
  return result;
}

/** Match a frontmatter cache key to a relation field or one of its array items. */
export function matchesFrontmatterRelationKey(linkKey: string, relationKey: string): boolean {
  const normalizedLinkKey = linkKey.toLowerCase();
  const normalizedRelationKey = relationKey.toLowerCase();
  if (normalizedLinkKey === normalizedRelationKey) return true;

  const arrayIndex = normalizedLinkKey.slice(normalizedRelationKey.length + 1);
  return normalizedLinkKey.startsWith(normalizedRelationKey + ".") && /^\d+$/.test(arrayIndex);
}

/** Case-insensitive link comparison. */
export function linksEqual(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}

/** Return the note target portion from a wiki link or plain link text. */
export function normalizeLinkTarget(link: string): string {
  let target = link.trim();
  const wikiMatch = target.match(/^\[\[([^\]]+)]]$/);
  if (wikiMatch?.[1]) target = wikiMatch[1];
  const pipe = target.indexOf("|");
  if (pipe !== -1) target = target.slice(0, pipe);
  const hash = target.indexOf("#");
  if (hash !== -1) target = target.slice(0, hash);
  return target.replace(/\.md$/i, "").trim();
}

/** Compare link targets after removing wiki syntax, aliases, headings, and .md. */
export function linkTargetsEqual(a: string, b: string): boolean {
  return linksEqual(normalizeLinkTarget(a), normalizeLinkTarget(b));
}

/** Wrap Obsidian link text in wiki-link syntax. */
export function toWikiLink(linkText: string): string {
  return `[[${normalizeLinkTarget(linkText)}]]`;
}

/** Replace the target portion of matching wiki links while preserving alias/heading text. */
export function replaceWikiLinkTarget(
  value: string,
  oldPath: string,
  newPath: string,
  shouldReplaceTarget?: (target: string) => boolean,
): string {
  const oldTarget = normalizeLinkTarget(oldPath);
  const oldBase = oldTarget.split("/").pop() ?? oldTarget;
  const newTarget = normalizeLinkTarget(newPath);
  const newBase = newTarget.split("/").pop() ?? newTarget;

  return value.replace(/\[\[([^\]|#]+)((?:#[^\]|]+)?(?:\|[^\]]+)?)]]/g, (match, rawTarget: string, suffix: string) => {
    const target = normalizeLinkTarget(rawTarget);
    const targetBase = target.split("/").pop() ?? target;
    const matches = shouldReplaceTarget
      ? shouldReplaceTarget(rawTarget)
      : linksEqual(target, oldTarget) || (!target.includes("/") && linksEqual(targetBase, oldBase));
    if (!matches) return match;

    const replacement = linksEqual(target, oldTarget) ? newTarget : newBase;
    return `[[${replacement}${suffix}]]`;
  });
}

/**
 * Adapt the casing of `target` to match `source`.
 */
export function matchCasing(source: string, target: string): string {
  if (!source || !target) return target;

  if (source === source.toLowerCase()) return target.toLowerCase();
  if (source === source.toUpperCase()) return target.toUpperCase();

  // If source starts with a capital letter
  if (source.charAt(0) === source.charAt(0).toUpperCase()) {
    // If the rest of the source string is lowercase (e.g. "Child of")
    if (source.slice(1) === source.slice(1).toLowerCase()) {
      return target.charAt(0).toUpperCase() + target.slice(1).toLowerCase();
    }
  }

  // Fallback to configured target casing
  return target;
}

/**
 * Trailing-edge debounce that returns a callable with a `.cancel()` handle.
 * Calls `fn` after `ms` milliseconds of inactivity.
 */
export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  ms: number,
): ((...args: A) => void) & { cancel(): void } {
  let timer: number | null = null;

  const debounced = (...args: A): void => {
    if (timer !== null) window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      timer = null;
      fn(...args);
    }, ms);
  };

  debounced.cancel = (): void => {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
}
