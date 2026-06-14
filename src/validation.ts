import type { RelationPair } from "./types";

export interface RelationValidationIssue {
  index: number;
  message: string;
}

export interface RelationValidationMessages {
  emptyField: string;
  sameField: string;
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
      { key: forwardKey, target: inverseKey },
      { key: inverseKey, target: forwardKey },
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
