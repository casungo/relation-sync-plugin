import { DEFAULT_SETTINGS, type RelationSyncSettings, type RelationPair } from "./types";
import { getDefaultRelations, getRelationsForLocale } from "./locales";
import { LEGACY_RELATIONS } from "./legacy-relations";
import { relationKeys } from "./relation-map";
import { isRelationPair, validateRelationPairs } from "./validation";

const messages = { emptyField: "empty", duplicatePair: "duplicate", conflictingKey: () => "conflict" };
const fingerprint = (pair: RelationPair): string => `${pair.forward.trim().toLowerCase()}|${pair.inverse.trim().toLowerCase()}`;

export function loadRelationSettings(data: unknown): { settings: RelationSyncSettings; migrated: boolean } {
  const stored = data && typeof data === "object" ? data as Partial<RelationSyncSettings> : null;
  const settings: RelationSyncSettings = {
    ...DEFAULT_SETTINGS,
    relations: getDefaultRelations(),
    syncEnabled: typeof stored?.syncEnabled === "boolean" ? stored.syncEnabled : Array.isArray(stored?.relations),
    excludePaths: typeof stored?.excludePaths === "string" ? stored.excludePaths : "",
  };
  if (!stored || !Array.isArray(stored.relations)) return { settings, migrated: false };
  const pairs = stored.relations.filter(isRelationPair);
  if (stored.schemaVersion === 2) {
    settings.relations = structuredClone(pairs);
    return { settings, migrated: false };
  }

  const legacy = new Set(Object.values(LEGACY_RELATIONS).flat());
  const retained = pairs.filter((pair) => !legacy.has(fingerprint(pair)) || (pair.forwardAliases?.length ?? 0) > 0 || (pair.inverseAliases?.length ?? 0) > 0);
  const activeKeys = new Set(pairs.filter((pair) => pair.enabled !== false && legacy.has(fingerprint(pair)))
    .flatMap((pair) => [pair.forward.toLowerCase(), pair.inverse.toLowerCase()]));
  settings.relations = structuredClone(retained);
  for (const preset of getDefaultRelations()) {
    const matchesExisting = retained.some((pair) => fingerprint(pair) === fingerprint(preset));
    if (matchesExisting) continue;
    preset.enabled = [...relationKeys(preset, "forward"), ...relationKeys(preset, "inverse")]
      .some((key) => activeKeys.has(key.toLowerCase()));
    // Preserve custom mappings; an overlapping new preset stays off until reviewed.
    if (validateRelationPairs([...settings.relations, preset], messages).length > 0) preset.enabled = false;
    settings.relations.push(preset);
  }
  return { settings, migrated: true };
}

export function enablePresetPairs(relations: RelationPair[], locale: string): { relations: RelationPair[]; skipped: number } {
  let result = structuredClone(relations);
  let skipped = 0;
  for (const preset of getRelationsForLocale(locale)) {
    const existing = result.findIndex((pair) => fingerprint(pair) === fingerprint(preset));
    const candidate = existing < 0 ? { ...preset, enabled: true } : { ...result[existing]!, enabled: true };
    const proposed = [...result];
    if (existing < 0) proposed.push(candidate); else proposed[existing] = candidate;
    if (validateRelationPairs(proposed, messages).length > 0) { skipped++; continue; }
    result = proposed;
  }
  return { relations: result, skipped };
}
