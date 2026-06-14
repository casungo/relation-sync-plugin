import { linkTargetsEqual } from "./utils";

export function findActualKey(
  fm: Record<string, unknown>,
  key: string,
): string | undefined {
  const lowerKey = key.toLowerCase();
  return Object.keys(fm).find((candidate) => candidate.toLowerCase() === lowerKey);
}

export function getExistingStringValues(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  return [];
}

export function addInverseToFrontmatter(
  fm: Record<string, unknown>,
  inverseKey: string,
  sourceLink: string,
): boolean {
  const actualKey = findActualKey(fm, inverseKey) ?? inverseKey;
  const existing = fm[actualKey];

  if (existing === undefined || existing === null) {
    fm[actualKey] = sourceLink;
    return true;
  }

  if (Array.isArray(existing)) {
    const alreadyPresent = existing.some(
      (v: unknown) =>
        typeof v === "string" && linkTargetsEqual(v, sourceLink),
    );
    if (alreadyPresent) return false;
    existing.push(sourceLink);
    return true;
  }

  if (typeof existing === "string" && !linkTargetsEqual(existing, sourceLink)) {
    fm[actualKey] = [existing, sourceLink];
    return true;
  }

  return false;
}

export function removeInverseFromFrontmatter(
  fm: Record<string, unknown>,
  inverseKey: string,
  sourceLink: string,
): boolean {
  const actualKey = findActualKey(fm, inverseKey) ?? inverseKey;
  const existing = fm[actualKey];
  if (existing === undefined || existing === null) return false;

  if (Array.isArray(existing)) {
    const filtered = existing.filter(
      (v: unknown) =>
        !(typeof v === "string" && linkTargetsEqual(v, sourceLink)),
    );
    if (filtered.length === existing.length) return false;
    if (filtered.length === 0) {
      delete fm[actualKey];
    } else if (filtered.length === 1) {
      fm[actualKey] = filtered[0];
    } else {
      fm[actualKey] = filtered;
    }
    return true;
  }

  if (typeof existing === "string" && linkTargetsEqual(existing, sourceLink)) {
    delete fm[actualKey];
    return true;
  }

  return false;
}
