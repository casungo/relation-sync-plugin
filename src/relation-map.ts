import type { RelationPair } from "./types";

/**
 * Build a case-insensitive lookup map from forward key → inverse key.
 * Multiple forward keys may map to the same inverse key.
 */
export function buildRelationMap(
  relations: RelationPair[],
): Map<string, string> {
  const map = new Map<string, string>();
  for (const pair of relations) {
    const fwd = pair.forward.trim().toLowerCase();
    const inv = pair.inverse.trim().toLowerCase();
    if (fwd && inv) {
      map.set(fwd, inv);
    }
  }
  return map;
}
