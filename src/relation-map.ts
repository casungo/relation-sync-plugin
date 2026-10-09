import type { RelationPair } from "./types";

export function relationKeys(pair: RelationPair, side: "forward" | "inverse"): string[] {
  return [pair[side], ...(pair[`${side}Aliases`] ?? [])].map((key) => key.trim()).filter(Boolean);
}

/**
 * Build a case-insensitive lookup map from forward key → inverse key.
 * Both directions are always registered so that symmetric pairs (e.g.
 * sibling ↔ sibling) sync correctly regardless of which note is edited.
 */
export function buildRelationMap(
  relations: RelationPair[],
): Map<string, string> {
  const map = new Map<string, string>();
  for (const pair of relations) {
    // Skip disabled pairs
    if (pair.enabled === false) continue;
    const fwdVal = pair.forward.trim();
    const invVal = pair.inverse.trim();
    if (fwdVal && invVal) {
      for (const key of relationKeys(pair, "forward")) map.set(key.toLowerCase(), invVal);
      for (const key of relationKeys(pair, "inverse")) map.set(key.toLowerCase(), fwdVal);
    }
  }
  return map;
}
