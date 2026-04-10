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

    exportPairs: "Exporter les paires de relations",
    exportPairsDesc:
      "Enregistre toutes les paires de relations actuelles dans un fichier JSON à la racine du coffre.",
    exportPairsButton: "Exporter en JSON",
    importPairs: "Importer des paires de relations",
    importPairsDesc:
      "Charge des paires de relations depuis un fichier JSON (fusionne avec les paires existantes).",
    importPairsButton: "Importer depuis JSON",
    importSuccess: (count) => `RelationSync : ${count} paires importées.`,
    importError: "RelationSync : échec de l'importation — fichier invalide ou illisible.",

    excludePaths: "Chemins exclus",
    excludePathsDesc:
      "Chemins de dossiers ou fichiers séparés par des virgules à ignorer lors de la synchronisation (ex. Templates, Archives).",
    excludePathsPlaceholder: "Templates, Archives, Notes Quotidiennes",

    filterRelations: "Filtrer les relations",
    searchPlaceholder: "Rechercher… (ex: ami, friend, ex)",

    addPairButton: "+ Ajouter une paire",

    pairsTotal: (count) => `${count} paires au total`,
    pairsShown: (visible, total) => `${visible} / ${total} paires affichées`,

    forwardPlaceholder: "direct (ex: ami de)",
    inversePlaceholder: "inverse (ex: ami de)",
    removePairTooltip: "Supprimer cette paire",
    togglePairTooltip: "Activer / désactiver cette paire",

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
      { forward: "Enfant de", inverse: "Parent de" },
      { forward: "Parent de", inverse: "Enfant de" },
      { forward: "Fils de", inverse: "Père de" },
      { forward: "Père de", inverse: "Fils de" },
      { forward: "Fille de", inverse: "Mère de" },
      { forward: "Mère de", inverse: "Fille de" },
      { forward: "épouse de", inverse: "Mari de" },
      { forward: "Mari de", inverse: "épouse de" },
      { forward: "Frère de", inverse: "Frère de" },
      { forward: "Sœur de", inverse: "Sœur de" },
      { forward: "Grand-père de", inverse: "Petit-enfant de" },
      { forward: "Grand-mère de", inverse: "Petit-enfant de" },
      { forward: "Oncle de", inverse: "Neveu de" },
      { forward: "Tante de", inverse: "Nièce de" },
      { forward: "Neveu de", inverse: "Oncle de" },
      { forward: "Nièce de", inverse: "Tante de" },
      { forward: "Cousin de", inverse: "Cousin de" },
      { forward: "Cousine de", inverse: "Cousine de" },
      { forward: "Beau-père de", inverse: "Gendre de" },
      { forward: "Belle-mère de", inverse: "Bru de" },
    ],
    romantic: [
      { forward: "Petit ami de", inverse: "Petite amie de" },
      { forward: "Petite amie de", inverse: "Petit ami de" },
      { forward: "Fiancé de", inverse: "Fiancée de" },
      { forward: "Fiancée de", inverse: "Fiancé de" },
      { forward: "Ex de", inverse: "Ex de" },
      { forward: "Amoureux de", inverse: "Aimé par" },
    ],
    friendship: [
      { forward: "Ami de", inverse: "Ami de" },
      { forward: "Meilleur ami de", inverse: "Meilleur ami de" },
      { forward: "Allié de", inverse: "Allié de" },
      { forward: "Ennemi de", inverse: "Ennemi de" },
      { forward: "Rival de", inverse: "Rival de" },
      { forward: "Connaissance de", inverse: "Connaissance de" },
    ],
    professional: [
      { forward: "Collègue de", inverse: "Collègue de" },
      { forward: "Patron de", inverse: "Employé de" },
      { forward: "Employé de", inverse: "Patron de" },
      { forward: "Manager de", inverse: "Géré par" },
      { forward: "Assistant de", inverse: "Assisté par" },
      { forward: "Successeur de", inverse: "Prédécesseur de" },
    ],
    education: [
      { forward: "Professeur de", inverse: "étudiant de" },
      { forward: "étudiant de", inverse: "Professeur de" },
      { forward: "Mentor de", inverse: "Protégé de" },
    ],
    creative: [
      { forward: "Collaborateur de", inverse: "Collaborateur de" },
      { forward: "Inspiré par", inverse: "Inspiration pour" },
    ],
    misc: [
      { forward: "Membre de", inverse: "A pour membre" },
      { forward: "Créé par", inverse: "Créateur de" },
    ],
  },
};
