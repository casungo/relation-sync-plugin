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

/** Case-insensitive link comparison. */
export function linksEqual(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
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
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: A): void => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, ms);
  };

  debounced.cancel = (): void => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced as ((...args: A) => void) & { cancel(): void };
}
