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
    stateReady: "Automatic sync is active",
    statePaused: "Automatic sync is paused",
    stateBlocked: "Sync is blocked: review enabled pairs",
    firstRunTitle: "Start with two notes",
    firstRunDesc: "The property names describe the person you link to. Create both notes, add a quoted wiki link to a property, then preview the current note before enabling automatic sync.",
    exampleSource: "Alex.md",
    exampleTarget: "Morgan.md",
    exampleForward: "mother",
    exampleInverse: "child",
    checkCurrentNote: "Preview current note",
    checkCurrentNoteDesc: "Add missing inverse links for this note. The preview also lists missing and excluded targets. This manual action works while automatic sync is paused.",
    noActiveNote: "Open a Markdown note first.",
    openSettings: "Open settings",
    relationsHeading: "Relation pairs",
    advancedHeading: "Vault tools and presets",
    editPair: "Edit pair",
    savePair: "Save pair",
    pairEnabled: "Enable this pair",
    forwardLabel: "Property on the source note",
    inverseLabel: "Property to add on the linked note",
    forwardAliasesLabel: "Other names for the source property",
    inverseAliasesLabel: "Other names for the inverse property",
    aliasesDesc: "Comma-separated synonyms. An inverse is written under the main name; existing synonyms are preserved.",
    aliasesPlaceholder: "mother, mom, mum, father, dad",
    activePairs: (active, total) => `${active} active / ${total} pairs`,
    logAdded: "Added",
    logRemoved: "Removed",
    syncBusy: "A sync is already running. Wait for it to finish.",
    previewChanged: "The notes or configuration changed after the preview. Preview again before applying.",
    writeError: (file, message) => `Relation Sync: could not update ${file}: ${message}`,
    syncResult: (scanned, changed, changes, failed) => `Read ${scanned} notes; changed ${changed} notes; applied ${changes} changes; ${failed} write errors.`,
    problemsHeading: "Links that cannot be synchronized",
    problemMissing: "Target note does not exist",
    problemExcluded: "Target note is excluded",
    problemValue: "The inverse property has an unsupported value; change it to a wiki link or a list.",
    problemInvalid: "Target is not a Markdown note",
    undoSessionDesc: "Undo covers only the latest write batch in this plugin session. Later sync writes replace it; restarting Obsidian clears it. Renaming notes is outside this undo.",
    settingsMigrated: "Relation Sync now uses English and Italian presets with neutral inverses. Custom pairs, automatic sync and exclusions were preserved. Review the updated pairs before syncing.",
    languageFilter: "Property language",
    allLanguages: "English and Italian",
    languagePresets: "Enable a preset",
    languagePresetsDesc: "Add compatible pairs without overriding custom mappings. Property language is independent of the interface language.",
    enableEnglish: "Enable English pairs",
    enableItalian: "Enable Italian pairs",
    presetConflicts: (count) => `${count} incompatible pairs were left disabled. Review their property names.`,
    panelCheck: "Preview inverse links",
    panelConfigured: "Configure relation pairs",
    panelMissing: "Missing note",
    panelExcluded: "Excluded note",
    panelReciprocal: "Inverse found",
    panelUnpaired: "Inverse missing",
    undoPreviewTitle: "Changes to undo",
    undoChanges: (count) => `Undo ${count} recorded changes. Review the list before continuing.`,

    pluginTitle: "Relation sync",
    pluginDescription:
      "Maintain inverse links between note properties. English and Italian synonyms share neutral roles; no gender is inferred.",

    resetToDefaults: "Reset relation pairs",
    resetToDefaultsDesc:
      "Replace relation pairs only. Automatic sync and excluded paths stay unchanged.",
    resetToDefaultsButton: "Reset relation pairs",
    resetConfirm:
      "Replace all relation pairs, including custom pairs? Automatic sync and excluded paths will stay unchanged. No note properties will be removed.",
    resetNotice: "RelationSync: relations reset to defaults.",

    syncVault: "Sync entire vault",
    syncVaultDesc:
      "Preview and add missing inverse links. Existing relations are preserved; this manual action also works while automatic sync is paused.",
    syncVaultButton: "Run global sync",
    bulkSyncRunningNotice: "RelationSync: bulk sync running...",
    bulkSyncFailedNotice: "RelationSync: bulk sync failed.",
    bulkPreviewTitle: "Bulk sync preview",
    bulkPreviewDesc: (changes, files) =>
      `Review ${changes} planned changes across ${files} notes before writing to the vault.`,
    bulkPreviewSummary: (files, added, removed) =>
      `${files} files will change: ${added} additions, ${removed} removals.`,
    bulkPreviewTruncated: (count) => `${count} more changes are not shown.`,
    confirmBulkSyncButton: "Apply changes",
    syncLogTitle: "Sync log",
    noSyncChanges: "No changes were made.",
    copyLogButton: "Copy log",
    copyLogNotice: "RelationSync: log copied.",
    logFileColumn: "File",
    logActionColumn: "Action",
    logKeyColumn: "Key",
    logLinkColumn: "Link",
    cancelButton: "Cancel",
    confirmButton: "Confirm",
    openRelationsPanel: "Open relations panel",
    syncEnabled: "Automatic sync",
    syncEnabledDesc:
      "When off, Relation Sync watches changes but does not write inverse relations.",
    viewRecentLog: "Recent sync log",
    viewRecentLogDesc: "Review up to 200 recent writes from this plugin session, including full note paths.",
    viewRecentLogButton: "View log",
    undoLastSync: "Undo last sync",
    undoLastSyncButton: "Undo last sync",
    undoLastSyncNotice: (count) =>
      `RelationSync: reversed ${count} sync changes.`,
    noUndoAvailable: "RelationSync: no sync batch is available to undo.",
    configInvalidTitle: "Configuration needs attention",
    configInvalidDesc:
      "Fix empty or conflicting enabled property names and aliases before syncing. Enable at least one valid pair.",
    bulkProgress: (filesDone, filesTotal, changes) =>
      `RelationSync: synced ${filesDone}/${filesTotal} files (${changes} changes applied).`,
    bulkSyncCancelledNotice: (changes) =>
      `RelationSync: bulk sync cancelled after ${changes} changes.`,

    relationsPanelTitle: "Relations",
    relationsPanelNoFile: "Open a note to see its relations.",
    relationsPanelNoFrontmatter: "This note has no frontmatter.",
    relationsPanelNoRelations: "No configured relations found in this note.",
    relationsPanelRelationCount: (count) =>
      count === 1 ? "1 related note" : `${count} related notes`,
    relationsPanelOpenNoteTooltip: "Open note",

    exportPairs: "Export relation pairs",
    exportPairsDesc:
      "Save all current relation pairs to a JSON file in your vault root.",
    exportPairsButton: "Export to JSON",
    exportSuccess: (filename) => `RelationSync: exported to ${filename}.`,
    exportError: "RelationSync: export failed.",
    exportOverwriteConfirm: (filename) =>
      `${filename} already exists in the vault root.\n\nOverwrite it?`,
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

    forwardPlaceholder: "parent",
    inversePlaceholder: "child",
    removePairTooltip: "Remove this pair",
    togglePairTooltip: "Enable/disable this pair",
    validationEmptyField: "Both relation fields are required.",
    validationDuplicatePair: "This relation pair is duplicated.",
    validationConflictingKey: (key) =>
      `"${key}" is already managed by another enabled pair.`,

    noSearchResults: "No relations match your search.",
    noRelations: 'No relations defined. Click "add pair" to create one.',

    duplicateImportSkipped: (added, skipped) =>
      `RelationSync: imported ${added} pairs; skipped ${skipped} duplicates.`,

    catFamily: "Family",
    catRomantic: "Romantic",
    catFriendship: "Friendship & social",
    catProfessional: "Professional",
    catEducation: "Education",
    catCreative: "Creative",
    catMisc: "Miscellaneous",
    catCustom: "Custom",
  },

  categories: {
    family: [
      {
        forward: "parent", inverse: "child",
        forwardAliases: ["parents", "mother", "mom", "mum", "mama", "father", "dad", "Child of", "Son of", "Daughter of"],
        inverseAliases: ["children", "son", "sons", "daughter", "daughters", "Parent of", "Father of", "Mother of"],
      },
      {
        forward: "stepparent", inverse: "stepchild",
        forwardAliases: ["stepmother", "stepfather", "Stepchild of", "Stepson of", "Stepdaughter of"],
        inverseAliases: ["stepchildren", "stepson", "stepdaughter", "Stepparent of", "Stepfather of", "Stepmother of"],
      },
      {
        forward: "adoptive parent", inverse: "adopted child",
        forwardAliases: ["Adopted child of"],
        inverseAliases: ["Adoptive parent of"],
      },
      {
        forward: "foster parent", inverse: "foster child",
        forwardAliases: ["Foster child of"],
        inverseAliases: ["Foster parent of"],
      },
      {
        forward: "spouse", inverse: "spouse",
        forwardAliases: ["wife", "husband", "Wife of", "Husband of", "Spouse of"],
      },
      {
        forward: "sibling", inverse: "sibling",
        forwardAliases: ["siblings", "brother", "sister", "Brother of", "Sister of", "Sibling of"],
      },
      {
        forward: "half sibling", inverse: "half sibling",
        forwardAliases: ["half-brother", "half-sister", "Half-brother of", "Half-sister of"],
      },
      {
        forward: "step sibling", inverse: "step sibling",
        forwardAliases: ["stepbrother", "stepsister", "Stepbrother of", "Stepsister of"],
      },
      {
        forward: "twin", inverse: "twin",
        forwardAliases: ["twins", "Twin of"],
      },
      {
        forward: "grandparent", inverse: "grandchild",
        forwardAliases: ["grandparents", "grandmother", "grandma", "grandfather", "grandpa", "Grandchild of", "Grandson of", "Granddaughter of"],
        inverseAliases: ["grandchildren", "grandson", "granddaughter", "Grandparent of", "Grandfather of", "Grandmother of"],
      },
      {
        forward: "great grandparent", inverse: "great grandchild",
        forwardAliases: ["Great-grandchild of"],
        inverseAliases: ["Great-grandparent of"],
      },
      {
        forward: "aunt or uncle", inverse: "nibling",
        forwardAliases: ["aunt", "uncle", "Nephew of", "Niece of"],
        inverseAliases: ["niece", "nephew", "Uncle of", "Aunt of"],
      },
      {
        forward: "cousin", inverse: "cousin",
        forwardAliases: ["cousins", "Cousin of"],
      },
      {
        forward: "parent in law", inverse: "child in law",
        forwardAliases: ["mother-in-law", "father-in-law", "Son-in-law of", "Daughter-in-law of"],
        inverseAliases: ["son-in-law", "daughter-in-law", "Father-in-law of", "Mother-in-law of"],
      },
      {
        forward: "sibling in law", inverse: "sibling in law",
        forwardAliases: ["brother-in-law", "sister-in-law", "Brother-in-law of", "Sister-in-law of"],
      },
      {
        forward: "godparent", inverse: "godchild",
        forwardAliases: ["godmother", "godfather", "Godchild of"],
        inverseAliases: ["Godfather of", "Godmother of", "Godparent of"],
      },
    ],
    romantic: [
      {
        forward: "partner", inverse: "partner",
        forwardAliases: ["boyfriend", "girlfriend", "Boyfriend of", "Girlfriend of", "Partner of", "Life partner of", "Companion of"],
      },
      {
        forward: "fiance", inverse: "fiance",
        forwardAliases: ["fiancé", "fiancée", "Fiancé of", "Fiancée of", "Engaged to"],
      },
      {
        forward: "ex partner", inverse: "ex partner",
        forwardAliases: ["Ex of", "Ex-boyfriend of", "Ex-girlfriend of", "Ex-husband of", "Ex-wife of"],
      },
      {
        forward: "lover", inverse: "lover",
        forwardAliases: ["Lover of"],
      },
      {
        forward: "admirer", inverse: "admired person",
        forwardAliases: ["Admired by"],
        inverseAliases: ["Admirer of"],
      },
      {
        forward: "loved person", inverse: "loving person",
        forwardAliases: ["crush", "In love with"],
        inverseAliases: ["Loved by", "Crush of"],
      },
      {
        forward: "dating", inverse: "dating",
      },
    ],
    friendship: [
      {
        forward: "friend", inverse: "friend",
        forwardAliases: ["friends", "Friend of"],
      },
      {
        forward: "best friend", inverse: "best friend",
        forwardAliases: ["Best friend of"],
      },
      {
        forward: "close friend", inverse: "close friend",
        forwardAliases: ["Close friend of"],
      },
      {
        forward: "childhood friend", inverse: "childhood friend",
        forwardAliases: ["Childhood friend of"],
      },
      {
        forward: "acquaintance", inverse: "acquaintance",
        forwardAliases: ["Acquaintance of"],
      },
      {
        forward: "neighbor", inverse: "neighbor",
        forwardAliases: ["neighbour", "Neighbor of"],
      },
      {
        forward: "roommate", inverse: "roommate",
        forwardAliases: ["Roommate of"],
      },
      {
        forward: "pen pal", inverse: "pen pal",
        forwardAliases: ["Pen pal of"],
      },
      {
        forward: "ally", inverse: "ally",
        forwardAliases: ["Ally of"],
      },
      {
        forward: "enemy", inverse: "enemy",
        forwardAliases: ["Enemy of"],
      },
      {
        forward: "rival", inverse: "rival",
        forwardAliases: ["Rival of"],
      },
    ],
    professional: [
      {
        forward: "colleague", inverse: "colleague",
        forwardAliases: ["coworker", "Colleague of", "Coworker of"],
      },
      {
        forward: "manager", inverse: "employee",
        forwardAliases: ["boss", "Employee of", "Managed by", "Supervised by"],
        inverseAliases: ["Boss of", "Manager of", "Supervisor of"],
      },
      {
        forward: "assistant", inverse: "assisted person",
        forwardAliases: ["Assisted by"],
        inverseAliases: ["Assistant of"],
      },
      {
        forward: "business partner", inverse: "business partner",
        forwardAliases: ["Business partner of"],
      },
      {
        forward: "cofounder", inverse: "cofounded organization",
        forwardAliases: ["Co-founded by"],
        inverseAliases: ["Co-founder of"],
      },
      {
        forward: "provider", inverse: "client",
        forwardAliases: ["Client of"],
        inverseAliases: ["Provider of"],
      },
      {
        forward: "predecessor", inverse: "successor",
        forwardAliases: ["Successor of"],
        inverseAliases: ["Predecessor of"],
      },
    ],
    education: [
      {
        forward: "teacher", inverse: "student",
        forwardAliases: ["professor", "Student of"],
        inverseAliases: ["Teacher of", "Professor of"],
      },
      {
        forward: "mentor", inverse: "mentee",
        forwardAliases: ["Mentee of"],
        inverseAliases: ["Mentor of"],
      },
      {
        forward: "tutor", inverse: "tutored person",
        forwardAliases: ["Tutored by"],
        inverseAliases: ["Tutor of"],
      },
      {
        forward: "classmate", inverse: "classmate",
        forwardAliases: ["Classmate of"],
      },
      {
        forward: "schoolmate", inverse: "schoolmate",
        forwardAliases: ["Schoolmate of"],
      },
      {
        forward: "master", inverse: "apprentice",
        forwardAliases: ["Apprentice of"],
        inverseAliases: ["Master of"],
      },
    ],
    creative: [
      {
        forward: "collaborator", inverse: "collaborator",
        forwardAliases: ["Collaborator of"],
      },
      {
        forward: "inspiration", inverse: "inspired person",
        forwardAliases: ["Inspired by"],
        inverseAliases: ["Inspiration for"],
      },
      {
        forward: "influence", inverse: "influenced person",
        forwardAliases: ["Influenced by"],
        inverseAliases: ["Influenced"],
      },
      {
        forward: "bandmate", inverse: "bandmate",
        forwardAliases: ["Bandmate of"],
      },
      {
        forward: "teammate", inverse: "teammate",
        forwardAliases: ["Teammate of"],
      },
    ],
    misc: [
      {
        forward: "relative", inverse: "relative",
        forwardAliases: ["Related to"],
      },
      {
        forward: "knows", inverse: "known by",
      },
      {
        forward: "introducer", inverse: "introduced person",
        forwardAliases: ["Introduced by"],
        inverseAliases: ["Introduced"],
      },
      {
        forward: "guardian", inverse: "ward",
        forwardAliases: ["Ward of"],
        inverseAliases: ["Guardian of"],
      },
      {
        forward: "caretaker", inverse: "cared for person",
        forwardAliases: ["Cared for by"],
        inverseAliases: ["Caretaker of"],
      },
      {
        forward: "donor", inverse: "recipient",
        forwardAliases: ["Recipient of"],
        inverseAliases: ["Donor to"],
      },
      {
        forward: "organization", inverse: "member",
        forwardAliases: ["Member of"],
        inverseAliases: ["Has member"],
      },
      {
        forward: "owner", inverse: "owned item",
        forwardAliases: ["Belongs to"],
        inverseAliases: ["Owner of"],
      },
      {
        forward: "creator", inverse: "creation",
        forwardAliases: ["Created by"],
        inverseAliases: ["Creator of"],
      },
      {
        forward: "founder", inverse: "founded organization",
        forwardAliases: ["Founded by"],
        inverseAliases: ["Founder of"],
      },
    ],
  },
};
