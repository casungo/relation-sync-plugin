import type { LocaleDefinition } from "./types";

/**
 * 🇩🇪 Deutsche Lokalisierungsdefinition.
 */
export const de: LocaleDefinition = {
  code: "de",

  strings: {
    pluginTitle: "Relation Sync",
    pluginDescription:
      "Definieren Sie inverse Beziehungspaare. Wenn Sie " +
      '"forward: [[Ziel]]" im Frontmatter einer Notiz schreiben, fügt das Plugin ' +
      'automatisch "inverse: [[Quelle]]" im Frontmatter des Ziels hinzu.',

    resetToDefaults: "Auf Standardwerte zurücksetzen",
    resetToDefaultsDesc:
      "Löscht alle benutzerdefinierten Änderungen und stellt den integrierten Beziehungssatz wieder her.",
    resetToDefaultsButton: "Auf Standardwerte zurücksetzen",
    resetConfirm:
      "Dies ersetzt ALLE Ihre aktuellen Beziehungen durch die integrierten Standardwerte.\n\nFortfahren?",
    resetNotice: "RelationSync: Beziehungen auf Standardwerte zurückgesetzt.",

    syncVault: "Gesamten Vault synchronisieren",
    syncVaultDesc:
      "Berechnet alle inversen Beziehungen in jeder Datei im Vault neu und fügt sie hinzu.",
    syncVaultButton: "Globale Synchronisierung ausführen",
    syncNotice: (count) => `RelationSync: Synchronisierung in ${count} Notizen abgeschlossen.`,

    exportPairs: "Beziehungspaare exportieren",
    exportPairsDesc:
      "Alle aktuellen Beziehungspaare als JSON-Datei im Vault-Stammverzeichnis speichern.",
    exportPairsButton: "Als JSON exportieren",
    importPairs: "Beziehungspaare importieren",
    importPairsDesc:
      "Beziehungspaare aus einer JSON-Datei laden (wird mit vorhandenen Paaren zusammengeführt).",
    importPairsButton: "Aus JSON importieren",
    importSuccess: (count) => `RelationSync: ${count} Paare importiert.`,
    importError: "RelationSync: Import fehlgeschlagen — ungültige oder unleserliche Datei.",

    excludePaths: "Pfade ausschließen",
    excludePathsDesc:
      "Kommagetrennte Ordner- oder Dateipfade, die beim Synchronisieren ignoriert werden sollen (z. B. Templates, Archiv).",
    excludePathsPlaceholder: "Templates, Archiv, Tagesnotizen",

    filterRelations: "Beziehungen filtern",
    searchPlaceholder: "Suche… (z. B. Freund, Friend, Ex)",

    addPairButton: "+ Paar hinzufügen",

    pairsTotal: (count) => `${count} Paare insgesamt`,
    pairsShown: (visible, total) => `${visible} / ${total} Paare angezeigt`,

    forwardPlaceholder: "vorwärts (z. B. Freund von)",
    inversePlaceholder: "invers (z. B. Freund von)",
    removePairTooltip: "Dieses Paar entfernen",
    togglePairTooltip: "Dieses Paar aktivieren / deaktivieren",

    noSearchResults: "Keine Beziehungen entsprechen Ihrer Suche.",
    noRelations: 'Keine Beziehungen definiert. Klicken Sie auf "+ Paar hinzufügen", um eine zu erstellen.',

    showAllLanguages: "Alle Sprachen anzeigen",
    showAllLanguagesDesc:
      "Wenn deaktiviert, werden nur Beziehungen angezeigt, die Ihrer Sprache entsprechen. Aktivieren Sie dies, um alle zu sehen.",

    catFamily: "👨‍👩‍👧‍👦 Familie",
    catRomantic: "💕 Romantisch",
    catFriendship: "🤝 Freundschaft & Soziales",
    catProfessional: "💼 Beruflich",
    catEducation: "🎓 Bildung",
    catCreative: "🎨 Kreativ",
    catMisc: "🔗 Verschiedenes",
    catCustom: "📦 Benutzerdefiniert",
  },

  categories: {
    family: [
      { forward: "kind von", inverse: "elternteil von" },
      { forward: "sohn von", inverse: "vater von" },
      { forward: "tochter von", inverse: "mutter von" },
      { forward: "vater von", inverse: "sohn von" },
      { forward: "mutter von", inverse: "tochter von" },
      { forward: "ehefrau von", inverse: "ehemann von" },
      { forward: "ehemann von", inverse: "ehefrau von" },
      { forward: "bruder von", inverse: "bruder von" },
      { forward: "schwester von", inverse: "schwester von" },
      { forward: "enkel von", inverse: "großelternteil von" },
      { forward: "großvater von", inverse: "enkel von" },
      { forward: "onkel von", inverse: "neffe von" },
      { forward: "tante von", inverse: "nichte von" },
      { forward: "neffe von", inverse: "onkel von" },
      { forward: "nichte von", inverse: "tante von" },
      { forward: "cousin von", inverse: "cousin von" },
      { forward: "cousine von", inverse: "cousine von" },
      { forward: "schwiegervater von", inverse: "schwiegersohn von" },
      { forward: "schwiegermutter von", inverse: "schwiegertochter von" },
      { forward: "schwiegersohn von", inverse: "schwiegervater von" },
      { forward: "schwiegertochter von", inverse: "schwiegermutter von" },
    ],
    romantic: [
      { forward: "freund von", inverse: "freundin von" },
      { forward: "freundin von", inverse: "freund von" },
      { forward: "verlobter von", inverse: "verlobte von" },
      { forward: "verlobte von", inverse: "verlobter von" },
      { forward: "ex von", inverse: "ex von" },
      { forward: "verliebt in", inverse: "geliebt von" },
    ],
    friendship: [
      { forward: "bester freund von", inverse: "bester freund von" },
      { forward: "mitbewohner von", inverse: "mitbewohner von" },
      { forward: "verbündeter von", inverse: "verbündeter von" },
      { forward: "feind von", inverse: "feind von" },
      { forward: "rivale von", inverse: "rivale von" },
      { forward: "bekannter von", inverse: "bekannter von" },
    ],
    professional: [
      { forward: "kollege von", inverse: "kollege von" },
      { forward: "chef von", inverse: "angestellter von" },
      { forward: "geschäftspartner von", inverse: "geschäftspartner von" },
      { forward: "manager von", inverse: "verwaltet von" },
      { forward: "assistent von", inverse: "unterstützt von" },
      { forward: "nachfolger von", inverse: "vorgänger von" },
      { forward: "vorgänger von", inverse: "nachfolger von" },
    ],
    education: [
      { forward: "lehrer von", inverse: "schüler von" },
      { forward: "mentor von", inverse: "mentee von" },
    ],
    creative: [
      { forward: "mitarbeiter von", inverse: "mitarbeiter von" },
      { forward: "inspiriert von", inverse: "inspiration für" },
    ],
    misc: [
      { forward: "mitglied von", inverse: "hat mitglied" },
      { forward: "erstellt von", inverse: "schöpfer von" },
    ],
  },
};
