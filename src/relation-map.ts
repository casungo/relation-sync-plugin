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
    const fwdKey = pair.forward.trim().toLowerCase();
    const invKey = pair.inverse.trim().toLowerCase();
    const fwdVal = pair.forward.trim();
    const invVal = pair.inverse.trim();
    
    if (fwdKey && invKey) {
      map.set(fwdKey, invVal);
      // Always register the inverse direction so symmetric and asymmetric
      // pairs are both handled no matter which note the user edits first.
      if (!map.has(invKey)) {
        map.set(invKey, fwdVal);
      }
    }
  }
  return map;
}
