import type { RelationPair } from "./types";

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
    const fwd = pair.forward.trim().toLowerCase();
    const inv = pair.inverse.trim().toLowerCase();
    if (fwd && inv) {
      map.set(fwd, inv);
      // Always register the inverse direction so symmetric and asymmetric
      // pairs are both handled no matter which note the user edits first.
      if (!map.has(inv)) {
        map.set(inv, fwd);
      }
    }
  }
  return map;
}
