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
  const keyOwners = new Map<string, number>();

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

    if (forwardKey === inverseKey) {
      issues.push({ index, message: messages.sameField });
    }

    const pairKey = `${forwardKey}|${inverseKey}`;
    const reversePairKey = `${inverseKey}|${forwardKey}`;
    const duplicateOwner = pairOwners.get(pairKey) ?? pairOwners.get(reversePairKey);
    if (duplicateOwner !== undefined) {
      issues.push({ index, message: messages.duplicatePair });
      continue;
    } else {
      pairOwners.set(pairKey, index);
    }

    for (const key of [forwardKey, inverseKey]) {
      const owner = keyOwners.get(key);
      if (owner !== undefined && owner !== index) {
        issues.push({ index, message: messages.conflictingKey(key) });
      } else {
        keyOwners.set(key, index);
      }
    }
  }

  return issues;
}
