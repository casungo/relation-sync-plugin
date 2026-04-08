/**
 * Shared types for the locale system.
 *
 * This file has ZERO imports from the rest of the plugin
 * to avoid circular dependencies.
 */

// ── Relation pair ────────────────────────────────────────────────────────

/** A pair of relation keys (forward ↔ inverse). */
export interface RelationPair {
  forward: string;
  inverse: string;
}

// ── Category IDs ─────────────────────────────────────────────────────────

export type CategoryId =
  | "family"
  | "romantic"
  | "friendship"
  | "professional"
  | "education"
  | "creative"
  | "misc";

// ── UI translation strings ──────────────────────────────────────────────

export interface I18nStrings {
  // ── Header
  pluginTitle: string;
  pluginDescription: string;

  // ── Action buttons
  resetToDefaults: string;
  resetToDefaultsDesc: string;
  resetToDefaultsButton: string;
  resetConfirm: string;
  resetNotice: string;

  syncVault: string;
  syncVaultDesc: string;
  syncVaultButton: string;
  syncNotice: (count: number) => string;

  // ── Search / filter
  filterRelations: string;
  searchPlaceholder: string;

  // ── Add pair
  addPairButton: string;

  // ── Count labels
  pairsTotal: (count: number) => string;
  pairsShown: (visible: number, total: number) => string;

  // ── Pair row
  forwardPlaceholder: string;
  inversePlaceholder: string;
  removePairTooltip: string;

  // ── Empty state
  noSearchResults: string;
  noRelations: string;

  // ── Language filter toggle
  showAllLanguages: string;
  showAllLanguagesDesc: string;

  // ── Category labels
  catFamily: string;
  catRomantic: string;
  catFriendship: string;
  catProfessional: string;
  catEducation: string;
  catCreative: string;
  catMisc: string;
  catCustom: string;
}

// ── Locale definition ────────────────────────────────────────────────────

/**
 * A complete locale definition.
 *
 * To add a new language, create a file that exports a `LocaleDefinition`,
 * fill in `strings`, and list the relation pairs grouped by category.
 */
export interface LocaleDefinition {
  /** ISO 639-1 code, e.g. "en", "it", "es". */
  code: string;

  /** UI strings for settings and notices. */
  strings: I18nStrings;

  /**
   * Default relation pairs grouped by category.
   * Each category ID maps to a list of forward/inverse pairs.
   */
  categories: Record<CategoryId, RelationPair[]>;
}
