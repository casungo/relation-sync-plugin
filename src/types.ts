/**
 * A pair of relation keys: when `forward` appears in note A pointing to note B,
 * the plugin ensures `inverse` appears in note B pointing back to note A.
 */
export type { RelationPair } from "./locales/types";

import { getAllRelations } from "./locales";
import type { RelationPair } from "./locales/types";

export interface RelationSyncSettings {
  relations: RelationPair[];
}

export const DEFAULT_SETTINGS: RelationSyncSettings = {
  relations: getAllRelations(),
};
