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
      { forward: "Kind von", inverse: "Elternteil von" },
      { forward: "Sohn von", inverse: "Vater von" },
      { forward: "Tochter von", inverse: "Mutter von" },
      { forward: "Vater von", inverse: "Sohn von" },
      { forward: "Mutter von", inverse: "Tochter von" },
      { forward: "Ehefrau von", inverse: "Ehemann von" },
      { forward: "Ehemann von", inverse: "Ehefrau von" },
      { forward: "Bruder von", inverse: "Bruder von" },
      { forward: "Schwester von", inverse: "Schwester von" },
      { forward: "Enkel von", inverse: "Großelternteil von" },
      { forward: "Großvater von", inverse: "Enkel von" },
      { forward: "Onkel von", inverse: "Neffe von" },
      { forward: "Tante von", inverse: "Nichte von" },
      { forward: "Neffe von", inverse: "Onkel von" },
      { forward: "Nichte von", inverse: "Tante von" },
      { forward: "Cousin von", inverse: "Cousin von" },
      { forward: "Cousine von", inverse: "Cousine von" },
      { forward: "Schwiegervater von", inverse: "Schwiegersohn von" },
      { forward: "Schwiegermutter von", inverse: "Schwiegertochter von" },
      { forward: "Schwiegersohn von", inverse: "Schwiegervater von" },
      { forward: "Schwiegertochter von", inverse: "Schwiegermutter von" },
    ],
    romantic: [
      { forward: "Freund von", inverse: "Freundin von" },
      { forward: "Freundin von", inverse: "Freund von" },
      { forward: "Verlobter von", inverse: "Verlobte von" },
      { forward: "Verlobte von", inverse: "Verlobter von" },
      { forward: "Ex von", inverse: "Ex von" },
      { forward: "Verliebt in", inverse: "Geliebt von" },
    ],
    friendship: [
      { forward: "Bester freund von", inverse: "Bester freund von" },
      { forward: "Mitbewohner von", inverse: "Mitbewohner von" },
      { forward: "Verbündeter von", inverse: "Verbündeter von" },
      { forward: "Feind von", inverse: "Feind von" },
      { forward: "Rivale von", inverse: "Rivale von" },
      { forward: "Bekannter von", inverse: "Bekannter von" },
    ],
    professional: [
      { forward: "Kollege von", inverse: "Kollege von" },
      { forward: "Chef von", inverse: "Angestellter von" },
      { forward: "Geschäftspartner von", inverse: "Geschäftspartner von" },
      { forward: "Manager von", inverse: "Verwaltet von" },
      { forward: "Assistent von", inverse: "Unterstützt von" },
      { forward: "Nachfolger von", inverse: "Vorgänger von" },
      { forward: "Vorgänger von", inverse: "Nachfolger von" },
    ],
    education: [
      { forward: "Lehrer von", inverse: "Schüler von" },
      { forward: "Mentor von", inverse: "Mentee von" },
    ],
    creative: [
      { forward: "Mitarbeiter von", inverse: "Mitarbeiter von" },
      { forward: "Inspiriert von", inverse: "Inspiration für" },
    ],
    misc: [
      { forward: "Mitglied von", inverse: "Hat mitglied" },
      { forward: "Erstellt von", inverse: "Schöpfer von" },
    ],
  },
};
