import type { LocaleDefinition } from "./types";

/**
 * 🇫🇷 Définition de la localisation française.
 */
export const fr: LocaleDefinition = {
  code: "fr",

  strings: {
    pluginTitle: "Relation Sync",
    pluginDescription:
      "Définissez des paires de relations inverses. Lorsque vous écrivez " +
      '"forward: [[Cible]]" dans le frontmatter d\'une note, le plugin ' +
      'ajoute automatiquement "inverse: [[Source]]" dans le frontmatter de la cible.',

    resetToDefaults: "Réinitialiser aux valeurs par défaut",
    resetToDefaultsDesc:
      "Supprime tous les changements personnalisés et restaure le jeu de relations intégré.",
    resetToDefaultsButton: "Réinitialiser aux valeurs par défaut",
    resetConfirm:
      "Cela remplacera TOUTES vos relations actuelles par les valeurs par défaut intégrées.\n\nContinuer ?",
    resetNotice: "RelationSync : relations réinitialisées aux valeurs par défaut.",

    syncVault: "Synchroniser tout le coffre",
    syncVaultDesc:
      "Re-calcule et ajoute toutes les relations inverses dans chaque fichier du coffre.",
    syncVaultButton: "Lancer la synchronisation globale",
    syncNotice: (count) => `RelationSync : synchronisation terminée sur ${count} notes.`,

    filterRelations: "Filtrer les relations",
    searchPlaceholder: "Rechercher… (ex: ami, friend, ex)",

    addPairButton: "+ Ajouter une paire",

    pairsTotal: (count) => `${count} paires au total`,
    pairsShown: (visible, total) => `${visible} / ${total} paires affichées`,

    forwardPlaceholder: "direct (ex: ami de)",
    inversePlaceholder: "inverse (ex: ami de)",
    removePairTooltip: "Supprimer cette paire",

    noSearchResults: "Aucune relation ne correspond à votre recherche.",
    noRelations: 'Aucune relation définie. Cliquez sur "+ Ajouter une paire" pour en créer une.',

    showAllLanguages: "Afficher toutes les langues",
    showAllLanguagesDesc:
      "Lorsqu'il est désactivé, seules les relations correspondant à votre langue sont affichées. Activez-le pour tout voir.",

    catFamily: "👨‍👩‍👧‍👦 Famille",
    catRomantic: "💕 Romantique",
    catFriendship: "🤝 Amitié et Social",
    catProfessional: "💼 Professionnel",
    catEducation: "🎓 Éducation",
    catCreative: "🎨 Créatif",
    catMisc: "🔗 Divers",
    catCustom: "📦 Personnalisé",
  },

  categories: {
    family: [
      { forward: "enfant de", inverse: "parent de" },
      { forward: "parent de", inverse: "enfant de" },
      { forward: "fils de", inverse: "père de" },
      { forward: "père de", inverse: "fils de" },
      { forward: "fille de", inverse: "mère de" },
      { forward: "mère de", inverse: "fille de" },
      { forward: "épouse de", inverse: "mari de" },
      { forward: "mari de", inverse: "épouse de" },
      { forward: "frère de", inverse: "frère de" },
      { forward: "sœur de", inverse: "sœur de" },
      { forward: "grand-père de", inverse: "petit-enfant de" },
      { forward: "grand-mère de", inverse: "petit-enfant de" },
      { forward: "oncle de", inverse: "neveu de" },
      { forward: "tante de", inverse: "nièce de" },
      { forward: "neveu de", inverse: "oncle de" },
      { forward: "nièce de", inverse: "tante de" },
      { forward: "cousin de", inverse: "cousin de" },
      { forward: "cousine de", inverse: "cousine de" },
      { forward: "beau-père de", inverse: "gendre de" },
      { forward: "belle-mère de", inverse: "bru de" },
    ],
    romantic: [
      { forward: "petit ami de", inverse: "petite amie de" },
      { forward: "petite amie de", inverse: "petit ami de" },
      { forward: "fiancé de", inverse: "fiancée de" },
      { forward: "fiancée de", inverse: "fiancé de" },
      { forward: "ex de", inverse: "ex de" },
      { forward: "amoureux de", inverse: "aimé par" },
    ],
    friendship: [
      { forward: "ami de", inverse: "ami de" },
      { forward: "meilleur ami de", inverse: "meilleur ami de" },
      { forward: "allié de", inverse: "allié de" },
      { forward: "ennemi de", inverse: "ennemi de" },
      { forward: "rival de", inverse: "rival de" },
      { forward: "connaissance de", inverse: "connaissance de" },
    ],
    professional: [
      { forward: "collègue de", inverse: "collègue de" },
      { forward: "patron de", inverse: "employé de" },
      { forward: "employé de", inverse: "patron de" },
      { forward: "manager de", inverse: "géré par" },
      { forward: "assistant de", inverse: "assisté par" },
      { forward: "successeur de", inverse: "prédécesseur de" },
    ],
    education: [
      { forward: "professeur de", inverse: "étudiant de" },
      { forward: "étudiant de", inverse: "professeur de" },
      { forward: "mentor de", inverse: "protégé de" },
    ],
    creative: [
      { forward: "collaborateur de", inverse: "collaborateur de" },
      { forward: "inspiré par", inverse: "inspiration pour" },
    ],
    misc: [
      { forward: "membre de", inverse: "a pour membre" },
      { forward: "créé par", inverse: "créateur de" },
    ],
  },
};
