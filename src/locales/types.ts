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
  /** When false the pair is skipped during sync. Defaults to true. */
  enabled?: boolean;
  forwardAliases?: string[];
  inverseAliases?: string[];
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
  stateReady: string;
  statePaused: string;
  stateBlocked: string;
  firstRunTitle: string;
  firstRunDesc: string;
  exampleSource: string;
  exampleTarget: string;
  exampleForward: string;
  exampleInverse: string;
  checkCurrentNote: string;
  checkCurrentNoteDesc: string;
  noActiveNote: string;
  openSettings: string;
  relationsHeading: string;
  advancedHeading: string;
  editPair: string;
  savePair: string;
  pairEnabled: string;
  forwardLabel: string;
  inverseLabel: string;
  forwardAliasesLabel: string;
  inverseAliasesLabel: string;
  aliasesDesc: string;
  aliasesPlaceholder: string;
  activePairs: (active: number, total: number) => string;
  logAdded: string;
  logRemoved: string;
  syncBusy: string;
  previewChanged: string;
  writeError: (file: string, message: string) => string;
  syncResult: (scanned: number, changed: number, changes: number, failed: number) => string;
  problemsHeading: string;
  problemMissing: string;
  problemExcluded: string;
  problemValue: string;
  problemInvalid: string;
  undoSessionDesc: string;
  settingsMigrated: string;
  languageFilter: string;
  allLanguages: string;
  languagePresets: string;
  languagePresetsDesc: string;
  enableEnglish: string;
  enableItalian: string;
  presetConflicts: (count: number) => string;
  panelCheck: string;
  panelConfigured: string;
  panelMissing: string;
  panelExcluded: string;
  panelReciprocal: string;
  panelUnpaired: string;
  undoPreviewTitle: string;
  undoChanges: (count: number) => string;

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
  bulkSyncRunningNotice: string;
  bulkSyncFailedNotice: string;
  bulkPreviewTitle: string;
  bulkPreviewDesc: (changes: number, files: number) => string;
  bulkPreviewSummary: (files: number, added: number, removed: number) => string;
  bulkPreviewTruncated: (count: number) => string;
  confirmBulkSyncButton: string;
  syncLogTitle: string;
  noSyncChanges: string;
  copyLogButton: string;
  copyLogNotice: string;
  logFileColumn: string;
  logActionColumn: string;
  logKeyColumn: string;
  logLinkColumn: string;
  cancelButton: string;
  confirmButton: string;
  openRelationsPanel: string;
  syncEnabled: string;
  syncEnabledDesc: string;
  viewRecentLog: string;
  viewRecentLogDesc: string;
  viewRecentLogButton: string;
  undoLastSync: string;
  undoLastSyncButton: string;
  undoLastSyncNotice: (count: number) => string;
  noUndoAvailable: string;
  configInvalidTitle: string;
  configInvalidDesc: string;
  bulkProgress: (filesDone: number, filesTotal: number, changes: number) => string;
  bulkSyncCancelledNotice: (changes: number) => string;

  // ── Relations panel
  relationsPanelTitle: string;
  relationsPanelNoFile: string;
  relationsPanelNoFrontmatter: string;
  relationsPanelNoRelations: string;
  relationsPanelRelationCount: (count: number) => string;
  relationsPanelOpenNoteTooltip: string;

  // ── Import / Export
  exportPairs: string;
  exportPairsDesc: string;
  exportPairsButton: string;
  exportSuccess: (filename: string) => string;
  exportError: string;
  exportOverwriteConfirm: (filename: string) => string;
  importPairs: string;
  importPairsDesc: string;
  importPairsButton: string;
  importSuccess: (count: number) => string;
  importError: string;

  // ── Exclude paths
  excludePaths: string;
  excludePathsDesc: string;
  excludePathsPlaceholder: string;

  // ── Search / filter
  filterRelations: string;
  searchPlaceholder: string;

  // ── Add pair
  addPairButton: string;

  // ── Count labels

  // ── Pair row
  forwardPlaceholder: string;
  inversePlaceholder: string;
  removePairTooltip: string;
  togglePairTooltip: string;
  validationEmptyField: string;
  validationDuplicatePair: string;
  validationConflictingKey: (key: string) => string;

  // ── Empty state
  noSearchResults: string;
  noRelations: string;

  // ── Language filter toggle
  duplicateImportSkipped: (added: number, skipped: number) => string;

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
  /** ISO 639-1 code, "en" or "it". */
  code: string;

  /** UI strings for settings and notices. */
  strings: I18nStrings;

  /**
   * Default relation pairs grouped by category.
   * Each category ID maps to a list of forward/inverse pairs.
   */
  categories: Record<CategoryId, RelationPair[]>;
}
