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
