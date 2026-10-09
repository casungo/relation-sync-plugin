import type { RelationPair } from "./types";
import { relationKeys } from "./relation-map";

export function isRelationPair(value: unknown): value is RelationPair {
  if (!value || typeof value !== "object") return false;
  const pair = value as RelationPair;
  return typeof pair.forward === "string" && typeof pair.inverse === "string" &&
    (pair.enabled === undefined || typeof pair.enabled === "boolean") &&
    [pair.forwardAliases, pair.inverseAliases].every((aliases) =>
      aliases === undefined || (Array.isArray(aliases) && aliases.every((key) => typeof key === "string" && key.trim().length > 0)),
    );
}

export interface RelationValidationIssue {
  index: number;
  message: string;
}

export interface RelationValidationMessages {
  emptyField: string;

  duplicatePair: string;
  conflictingKey: (key: string) => string;
}

export function validateRelationPairs(
  pairs: RelationPair[],
  messages: RelationValidationMessages,
): RelationValidationIssue[] {
  const issues: RelationValidationIssue[] = [];
  const pairOwners = new Map<string, number>();
  const keyTargets = new Map<string, string>();

  for (let index = 0; index < pairs.length; index++) {
    const pair = pairs[index];
    if (!pair || pair.enabled === false) continue;

    const forward = pair.forward.trim();
    const inverse = pair.inverse.trim();
    const forwardKey = forward.toLowerCase();
    const inverseKey = inverse.toLowerCase();

    if (!forward || !inverse) {
      issues.push({ index, message: messages.emptyField });
      continue;
    }

    const pairKey = `${forwardKey}|${inverseKey}`;
    const duplicateOwner = pairOwners.get(pairKey);
    if (duplicateOwner !== undefined) {
      issues.push({ index, message: messages.duplicatePair });
      continue;
    } else {
      pairOwners.set(pairKey, index);
    }

    const mappings = [
      ...relationKeys(pair, "forward").map((key) => ({ key: key.toLowerCase(), target: inverseKey })),
      ...relationKeys(pair, "inverse").map((key) => ({ key: key.toLowerCase(), target: forwardKey })),
    ];
    for (const mapping of mappings) {
      const existing = keyTargets.get(mapping.key);
      if (existing && existing !== mapping.target) {
        issues.push({ index, message: messages.conflictingKey(mapping.key) });
      } else {
        keyTargets.set(mapping.key, mapping.target);
      }
    }
  }

  return issues;
}
