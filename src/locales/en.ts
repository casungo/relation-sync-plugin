import type { LocaleDefinition } from "./types";

/**
 * 🇬🇧 English locale definition.
 *
 * Contains all UI strings and the default relation pairs for English.
 */
export const en: LocaleDefinition = {
  code: "EN",

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
    searchPlaceholder: "Search (e.g., friend, ex)",

    addPairButton: "Add pair",

    pairsTotal: (count) => `${count} pairs total`,
    pairsShown: (visible, total) => `${visible} / ${total} pairs shown`,

    forwardPlaceholder: "Forward (e.g., friend of)",
    inversePlaceholder: "Inverse (e.g., friend of)",
    removePairTooltip: "Remove this pair",
    togglePairTooltip: "Enable/disable this pair",

    noSearchResults: "No relations match your search.",
    noRelations: 'No relations defined. Click "add pair" to create one.',

    showAllLanguages: "Show all languages",
    showAllLanguagesDesc:
      "When off, only relations matching your language are shown. Turn on to see all.",

    catFamily: "Family 👨‍👩‍👧‍👦",
    catRomantic: "Romantic 💕",
    catFriendship: "Friendship & social 🤝",
    catProfessional: "Professional 💼",
    catEducation: "Education 🎓",
    catCreative: "Creative 🎨",
    catMisc: "Miscellaneous 🔗",
    catCustom: "Custom 📦",
  },

  // ── Relation pairs by category ─────────────────────────────────────────
  categories: {
    family: [
      // Parent / Child
      { forward: "Child of",         inverse: "Parent of" },
      { forward: "Parent of",        inverse: "Child of" },
      { forward: "Son of",           inverse: "Father of" },
      { forward: "Father of",        inverse: "Son of" },
      { forward: "Daughter of",      inverse: "Mother of" },
      { forward: "Mother of",        inverse: "Daughter of" },
      { forward: "Stepchild of",     inverse: "Stepparent of" },
      { forward: "Stepparent of",    inverse: "Stepchild of" },
      { forward: "Stepfather of",    inverse: "Stepchild of" },
      { forward: "Stepmother of",    inverse: "Stepchild of" },
      { forward: "Stepson of",       inverse: "Stepparent of" },
      { forward: "Stepdaughter of",  inverse: "Stepparent of" },
      { forward: "Adopted child of", inverse: "Adoptive parent of" },
      { forward: "Adoptive parent of", inverse: "Adopted child of" },
      { forward: "Foster child of",  inverse: "Foster parent of" },
      { forward: "Foster parent of", inverse: "Foster child of" },
      // Spouses & Partners
      { forward: "Wife of",          inverse: "Husband of" },
      { forward: "Husband of",       inverse: "Wife of" },
      { forward: "Spouse of",        inverse: "Spouse of" },
      { forward: "Partner of",       inverse: "Partner of" },
      { forward: "Life partner of",  inverse: "Life partner of" },
      // Siblings
      { forward: "Brother of",       inverse: "Brother of" },
      { forward: "Sister of",        inverse: "Sister of" },
      { forward: "Sibling of",       inverse: "Sibling of" },
      { forward: "Twin of",          inverse: "Twin of" },
      { forward: "Half-brother of",  inverse: "Half-brother of" },
      { forward: "Half-sister of",   inverse: "Half-sister of" },
      { forward: "Stepbrother of",   inverse: "Stepbrother of" },
      { forward: "Stepsister of",    inverse: "Stepsister of" },
      // Grandparents / Grandchildren
      { forward: "Grandchild of",    inverse: "Grandparent of" },
      { forward: "Grandparent of",   inverse: "Grandchild of" },
      { forward: "Grandson of",      inverse: "Grandfather of" },
      { forward: "Grandfather of",   inverse: "Grandson of" },
      { forward: "Granddaughter of", inverse: "Grandmother of" },
      { forward: "Grandmother of",   inverse: "Granddaughter of" },
      { forward: "Great-grandchild of",  inverse: "Great-grandparent of" },
      { forward: "Great-grandparent of", inverse: "Great-grandchild of" },
      // Uncles / Aunts / Nephews / Nieces
      { forward: "Uncle of",         inverse: "Nephew of" },
      { forward: "Aunt of",          inverse: "Niece of" },
      { forward: "Nephew of",        inverse: "Uncle of" },
      { forward: "Niece of",         inverse: "Aunt of" },
      // Cousins
      { forward: "Cousin of",        inverse: "Cousin of" },
      // In-laws
      { forward: "Father-in-law of", inverse: "Son-in-law of" },
      { forward: "Mother-in-law of", inverse: "Daughter-in-law of" },
      { forward: "Son-in-law of",    inverse: "Father-in-law of" },
      { forward: "Daughter-in-law of", inverse: "Mother-in-law of" },
      { forward: "Brother-in-law of", inverse: "Brother-in-law of" },
      { forward: "Sister-in-law of", inverse: "Sister-in-law of" },
      // Godparents
      { forward: "Godfather of",     inverse: "Godchild of" },
      { forward: "Godmother of",     inverse: "Godchild of" },
      { forward: "Godchild of",      inverse: "Godparent of" },
      { forward: "Godparent of",     inverse: "Godchild of" },
    ],

    romantic: [
      { forward: "Boyfriend of",     inverse: "Girlfriend of" },
      { forward: "Girlfriend of",    inverse: "Boyfriend of" },
      { forward: "Fiancé of",        inverse: "Fiancée of" },
      { forward: "Fiancée of",       inverse: "Fiancé of" },
      { forward: "Engaged to",       inverse: "Engaged to" },
      { forward: "Ex of",            inverse: "Ex of" },
      { forward: "Ex-boyfriend of",  inverse: "Ex-girlfriend of" },
      { forward: "Ex-girlfriend of", inverse: "Ex-boyfriend of" },
      { forward: "Ex-husband of",    inverse: "Ex-wife of" },
      { forward: "Ex-wife of",       inverse: "Ex-husband of" },
      { forward: "Crush of",         inverse: "Crush of" },
      { forward: "Lover of",         inverse: "Lover of" },
      { forward: "Admirer of",       inverse: "Admired by" },
      { forward: "Admired by",       inverse: "Admirer of" },
      { forward: "In love with",     inverse: "Loved by" },
      { forward: "Loved by",         inverse: "In love with" },
      { forward: "Dating",           inverse: "Dating" },
    ],

    friendship: [
      { forward: "Friend of",        inverse: "Friend of" },
      { forward: "Best friend of",   inverse: "Best friend of" },
      { forward: "Close friend of",  inverse: "Close friend of" },
      { forward: "Childhood friend of", inverse: "Childhood friend of" },
      { forward: "Acquaintance of",  inverse: "Acquaintance of" },
      { forward: "Neighbor of",      inverse: "Neighbor of" },
      { forward: "Roommate of",      inverse: "Roommate of" },
      { forward: "Pen pal of",       inverse: "Pen pal of" },
      { forward: "Ally of",          inverse: "Ally of" },
      { forward: "Enemy of",         inverse: "Enemy of" },
      { forward: "Rival of",         inverse: "Rival of" },
    ],

    professional: [
      { forward: "Colleague of",     inverse: "Colleague of" },
      { forward: "Coworker of",      inverse: "Coworker of" },
      { forward: "Boss of",          inverse: "Employee of" },
      { forward: "Employee of",      inverse: "Boss of" },
      { forward: "Manager of",       inverse: "Managed by" },
      { forward: "Managed by",       inverse: "Manager of" },
      { forward: "Supervisor of",    inverse: "Supervised by" },
      { forward: "Supervised by",    inverse: "Supervisor of" },
      { forward: "Assistant of",     inverse: "Assisted by" },
      { forward: "Assisted by",      inverse: "Assistant of" },
      { forward: "Business partner of", inverse: "Business partner of" },
      { forward: "Co-founder of",    inverse: "Co-founded by" },
      { forward: "Co-founded by",    inverse: "Co-founder of" },
      { forward: "Client of",        inverse: "Provider of" },
      { forward: "Provider of",      inverse: "Client of" },
      { forward: "Successor of",     inverse: "Predecessor of" },
      { forward: "Predecessor of",   inverse: "Successor of" },
    ],

    education: [
      { forward: "Teacher of",       inverse: "Student of" },
      { forward: "Student of",       inverse: "Teacher of" },
      { forward: "Mentor of",        inverse: "Mentee of" },
      { forward: "Mentee of",        inverse: "Mentor of" },
      { forward: "Tutor of",         inverse: "Tutored by" },
      { forward: "Tutored by",       inverse: "Tutor of" },
      { forward: "Classmate of",     inverse: "Classmate of" },
      { forward: "Schoolmate of",    inverse: "Schoolmate of" },
      { forward: "Professor of",     inverse: "Student of" },
      { forward: "Apprentice of",    inverse: "Master of" },
      { forward: "Master of",        inverse: "Apprentice of" },
    ],

    creative: [
      { forward: "Collaborator of",  inverse: "Collaborator of" },
      { forward: "Inspired by",      inverse: "Inspiration for" },
      { forward: "Inspiration for",  inverse: "Inspired by" },
      { forward: "Influenced by",    inverse: "Influenced" },
      { forward: "Influenced",       inverse: "Influenced by" },
      { forward: "Bandmate of",      inverse: "Bandmate of" },
      { forward: "Teammate of",      inverse: "Teammate of" },
    ],

    misc: [
      { forward: "Related to",       inverse: "Related to" },
      { forward: "Knows",            inverse: "Known by" },
      { forward: "Known by",         inverse: "Knows" },
      { forward: "Introduced by",    inverse: "Introduced" },
      { forward: "Introduced",       inverse: "Introduced by" },
      { forward: "Companion of",     inverse: "Companion of" },
      { forward: "Guardian of",      inverse: "Ward of" },
      { forward: "Ward of",          inverse: "Guardian of" },
      { forward: "Caretaker of",     inverse: "Cared for by" },
      { forward: "Cared for by",     inverse: "Caretaker of" },
      { forward: "Donor to",         inverse: "Recipient of" },
      { forward: "Recipient of",     inverse: "Donor to" },
      { forward: "Member of",        inverse: "Has member" },
      { forward: "Has member",       inverse: "Member of" },
      { forward: "Belongs to",       inverse: "Owner of" },
      { forward: "Owner of",         inverse: "Belongs to" },
      { forward: "Created by",       inverse: "Creator of" },
      { forward: "Creator of",       inverse: "Created by" },
      { forward: "Founded by",       inverse: "Founder of" },
      { forward: "Founder of",       inverse: "Founded by" },
    ],
  },
};
