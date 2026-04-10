import type { LocaleDefinition } from "./types";

/**
 * 🇬🇧 English locale definition.
 *
 * Contains all UI strings and the default relation pairs for English.
 */
export const en: LocaleDefinition = {
  code: "en",

  // ── UI strings ─────────────────────────────────────────────────────────
  strings: {
    pluginTitle: "Relation sync",
    pluginDescription:
      'Define inverse relation pairs. When you write "forward: [[Target]]" ' +
      "in a note's frontmatter, the plugin automatically adds " +
      '"inverse: [[Source]]" in the target\'s frontmatter.',

    resetToDefaults: "Reset to defaults",
    resetToDefaultsDesc:
      "Delete all custom changes and restore the built-in relation set.",
    resetToDefaultsButton: "Reset to defaults",
    resetConfirm:
      "This will replace all your current relations with the built-in defaults.\n\nContinue?",
    resetNotice: "RelationSync: relations reset to defaults.",

    syncVault: "Sync entire vault",
    syncVaultDesc:
      "Re-compute and add all inverse relations across every file in the vault.",
    syncVaultButton: "Run global sync",
    syncNotice: (count) => `RelationSync: sync completed on ${count} notes.`,

    exportPairs: "Export relation pairs",
    exportPairsDesc:
      "Save all current relation pairs to a JSON file in your vault root.",
    exportPairsButton: "Export to JSON",
    importPairs: "Import relation pairs",
    importPairsDesc:
      "Load relation pairs from a JSON file (merges with existing pairs).",
    importPairsButton: "Import from JSON",
    importSuccess: (count) => `RelationSync: imported ${count} pairs.`,
    importError: "RelationSync: import failed — invalid or unreadable file.",

    excludePaths: "Exclude paths",
    excludePathsDesc:
      "Comma-separated folder or file paths to ignore during sync (e.g. Templates, Archive/old).",
    excludePathsPlaceholder: "Templates, archive, daily notes",

    filterRelations: "Filter relations",
    searchPlaceholder: "Search… (e.g. friend, amico, ex)",

    addPairButton: "Add pair",

    pairsTotal: (count) => `${count} pairs total`,
    pairsShown: (visible, total) => `${visible} / ${total} pairs shown`,

    forwardPlaceholder: "forward (e.g. friend of)",
    inversePlaceholder: "inverse (e.g. friend of)",
    removePairTooltip: "Remove this pair",
    togglePairTooltip: "Enable/disable this pair",

    noSearchResults: "No relations match your search.",
    noRelations: 'No relations defined. Click "+ Add pair" to create one.',

    showAllLanguages: "Show all languages",
    showAllLanguagesDesc:
      "When off, only relations matching your language are shown. Turn on to see all.",

    catFamily: "👨‍👩‍👧‍👦 Family",
    catRomantic: "💕 Romantic",
    catFriendship: "🤝 Friendship & social",
    catProfessional: "💼 Professional",
    catEducation: "🎓 Education",
    catCreative: "🎨 Creative",
    catMisc: "🔗 Miscellaneous",
    catCustom: "📦 Custom",
  },

  // ── Relation pairs by category ─────────────────────────────────────────
  categories: {
    family: [
      // Parent / Child
      { forward: "child of",         inverse: "parent of" },
      { forward: "parent of",        inverse: "child of" },
      { forward: "son of",           inverse: "father of" },
      { forward: "father of",        inverse: "son of" },
      { forward: "daughter of",      inverse: "mother of" },
      { forward: "mother of",        inverse: "daughter of" },
      { forward: "stepchild of",     inverse: "stepparent of" },
      { forward: "stepparent of",    inverse: "stepchild of" },
      { forward: "stepfather of",    inverse: "stepchild of" },
      { forward: "stepmother of",    inverse: "stepchild of" },
      { forward: "stepson of",       inverse: "stepparent of" },
      { forward: "stepdaughter of",  inverse: "stepparent of" },
      { forward: "adopted child of", inverse: "adoptive parent of" },
      { forward: "adoptive parent of", inverse: "adopted child of" },
      { forward: "foster child of",  inverse: "foster parent of" },
      { forward: "foster parent of", inverse: "foster child of" },
      // Spouses & Partners
      { forward: "wife of",          inverse: "husband of" },
      { forward: "husband of",       inverse: "wife of" },
      { forward: "spouse of",        inverse: "spouse of" },
      { forward: "partner of",       inverse: "partner of" },
      { forward: "life partner of",  inverse: "life partner of" },
      // Siblings
      { forward: "brother of",       inverse: "brother of" },
      { forward: "sister of",        inverse: "sister of" },
      { forward: "sibling of",       inverse: "sibling of" },
      { forward: "twin of",          inverse: "twin of" },
      { forward: "half-brother of",  inverse: "half-brother of" },
      { forward: "half-sister of",   inverse: "half-sister of" },
      { forward: "stepbrother of",   inverse: "stepbrother of" },
      { forward: "stepsister of",    inverse: "stepsister of" },
      // Grandparents / Grandchildren
      { forward: "grandchild of",    inverse: "grandparent of" },
      { forward: "grandparent of",   inverse: "grandchild of" },
      { forward: "grandson of",      inverse: "grandfather of" },
      { forward: "grandfather of",   inverse: "grandson of" },
      { forward: "granddaughter of", inverse: "grandmother of" },
      { forward: "grandmother of",   inverse: "granddaughter of" },
      { forward: "great-grandchild of",  inverse: "great-grandparent of" },
      { forward: "great-grandparent of", inverse: "great-grandchild of" },
      // Uncles / Aunts / Nephews / Nieces
      { forward: "uncle of",         inverse: "nephew of" },
      { forward: "aunt of",          inverse: "niece of" },
      { forward: "nephew of",        inverse: "uncle of" },
      { forward: "niece of",         inverse: "aunt of" },
      // Cousins
      { forward: "cousin of",        inverse: "cousin of" },
      // In-laws
      { forward: "father-in-law of", inverse: "son-in-law of" },
      { forward: "mother-in-law of", inverse: "daughter-in-law of" },
      { forward: "son-in-law of",    inverse: "father-in-law of" },
      { forward: "daughter-in-law of", inverse: "mother-in-law of" },
      { forward: "brother-in-law of", inverse: "brother-in-law of" },
      { forward: "sister-in-law of", inverse: "sister-in-law of" },
      // Godparents
      { forward: "godfather of",     inverse: "godchild of" },
      { forward: "godmother of",     inverse: "godchild of" },
      { forward: "godchild of",      inverse: "godparent of" },
      { forward: "godparent of",     inverse: "godchild of" },
    ],

    romantic: [
      { forward: "boyfriend of",     inverse: "girlfriend of" },
      { forward: "girlfriend of",    inverse: "boyfriend of" },
      { forward: "fiancé of",        inverse: "fiancée of" },
      { forward: "fiancée of",       inverse: "fiancé of" },
      { forward: "engaged to",       inverse: "engaged to" },
      { forward: "ex of",            inverse: "ex of" },
      { forward: "ex-boyfriend of",  inverse: "ex-girlfriend of" },
      { forward: "ex-girlfriend of", inverse: "ex-boyfriend of" },
      { forward: "ex-husband of",    inverse: "ex-wife of" },
      { forward: "ex-wife of",       inverse: "ex-husband of" },
      { forward: "crush of",         inverse: "crush of" },
      { forward: "lover of",         inverse: "lover of" },
      { forward: "admirer of",       inverse: "admired by" },
      { forward: "admired by",       inverse: "admirer of" },
      { forward: "in love with",     inverse: "loved by" },
      { forward: "loved by",         inverse: "in love with" },
      { forward: "dating",           inverse: "dating" },
    ],

    friendship: [
      { forward: "friend of",        inverse: "friend of" },
      { forward: "best friend of",   inverse: "best friend of" },
      { forward: "close friend of",  inverse: "close friend of" },
      { forward: "childhood friend of", inverse: "childhood friend of" },
      { forward: "acquaintance of",  inverse: "acquaintance of" },
      { forward: "neighbor of",      inverse: "neighbor of" },
      { forward: "roommate of",      inverse: "roommate of" },
      { forward: "pen pal of",       inverse: "pen pal of" },
      { forward: "ally of",          inverse: "ally of" },
      { forward: "enemy of",         inverse: "enemy of" },
      { forward: "rival of",         inverse: "rival of" },
    ],

    professional: [
      { forward: "colleague of",     inverse: "colleague of" },
      { forward: "coworker of",      inverse: "coworker of" },
      { forward: "boss of",          inverse: "employee of" },
      { forward: "employee of",      inverse: "boss of" },
      { forward: "manager of",       inverse: "managed by" },
      { forward: "managed by",       inverse: "manager of" },
      { forward: "supervisor of",    inverse: "supervised by" },
      { forward: "supervised by",    inverse: "supervisor of" },
      { forward: "assistant of",     inverse: "assisted by" },
      { forward: "assisted by",      inverse: "assistant of" },
      { forward: "business partner of", inverse: "business partner of" },
      { forward: "co-founder of",    inverse: "co-founded by" },
      { forward: "co-founded by",    inverse: "co-founder of" },
      { forward: "client of",        inverse: "provider of" },
      { forward: "provider of",      inverse: "client of" },
      { forward: "successor of",     inverse: "predecessor of" },
      { forward: "predecessor of",   inverse: "successor of" },
    ],

    education: [
      { forward: "teacher of",       inverse: "student of" },
      { forward: "student of",       inverse: "teacher of" },
      { forward: "mentor of",        inverse: "mentee of" },
      { forward: "mentee of",        inverse: "mentor of" },
      { forward: "tutor of",         inverse: "tutored by" },
      { forward: "tutored by",       inverse: "tutor of" },
      { forward: "classmate of",     inverse: "classmate of" },
      { forward: "schoolmate of",    inverse: "schoolmate of" },
      { forward: "professor of",     inverse: "student of" },
      { forward: "apprentice of",    inverse: "master of" },
      { forward: "master of",        inverse: "apprentice of" },
    ],

    creative: [
      { forward: "collaborator of",  inverse: "collaborator of" },
      { forward: "inspired by",      inverse: "inspiration for" },
      { forward: "inspiration for",  inverse: "inspired by" },
      { forward: "influenced by",    inverse: "influenced" },
      { forward: "influenced",       inverse: "influenced by" },
      { forward: "bandmate of",      inverse: "bandmate of" },
      { forward: "teammate of",      inverse: "teammate of" },
    ],

    misc: [
      { forward: "related to",       inverse: "related to" },
      { forward: "knows",            inverse: "known by" },
      { forward: "known by",         inverse: "knows" },
      { forward: "introduced by",    inverse: "introduced" },
      { forward: "introduced",       inverse: "introduced by" },
      { forward: "companion of",     inverse: "companion of" },
      { forward: "guardian of",      inverse: "ward of" },
      { forward: "ward of",          inverse: "guardian of" },
      { forward: "caretaker of",     inverse: "cared for by" },
      { forward: "cared for by",     inverse: "caretaker of" },
      { forward: "donor to",         inverse: "recipient of" },
      { forward: "recipient of",     inverse: "donor to" },
      { forward: "member of",        inverse: "has member" },
      { forward: "has member",       inverse: "member of" },
      { forward: "belongs to",       inverse: "owner of" },
      { forward: "owner of",         inverse: "belongs to" },
      { forward: "created by",       inverse: "creator of" },
      { forward: "creator of",       inverse: "created by" },
      { forward: "founded by",       inverse: "founder of" },
      { forward: "founder of",       inverse: "founded by" },
    ],
  },
};
