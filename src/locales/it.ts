import type { LocaleDefinition } from "./types";

/**
 * 🇮🇹 Definizione localizzazione italiana.
 *
 * Contiene tutte le stringhe UI e le coppie di relazioni predefinite in italiano.
 */
export const it: LocaleDefinition = {
  code: "it",

  // ── Stringhe UI ────────────────────────────────────────────────────────
  strings: {
    pluginTitle: "Relation Sync",
    pluginDescription:
      "Definisci coppie di relazioni inverse. Quando scrivi " +
      '"diretto: [[Destinazione]]" nel frontmatter di una nota, il plugin ' +
      'aggiunge automaticamente "inverso: [[Origine]]" nel frontmatter della nota di destinazione.',

    resetToDefaults: "Ripristina predefiniti",
    resetToDefaultsDesc:
      "Elimina tutte le modifiche personalizzate e ripristina il set di relazioni predefinito.",
    resetToDefaultsButton: "Ripristina predefiniti",
    resetConfirm:
      "Questo sostituirà TUTTE le tue relazioni attuali con quelle predefinite.\n\nContinuare?",
    resetNotice: "RelationSync: relazioni ripristinate ai predefiniti.",

    syncVault: "Sincronizza l'intero vault",
    syncVaultDesc:
      "Ricalcola e aggiunge tutte le relazioni inverse in ogni file del vault.",
    syncVaultButton: "Avvia sincronizzazione globale",
    syncNotice: (count) =>
      `RelationSync: sincronizzazione completata su ${count} note.`,

    exportPairs: "Esporta coppie di relazioni",
    exportPairsDesc:
      "Salva tutte le coppie di relazioni attuali in un file JSON nella radice del vault.",
    exportPairsButton: "Esporta in JSON",
    importPairs: "Importa coppie di relazioni",
    importPairsDesc:
      "Carica coppie di relazioni da un file JSON (unisce alle coppie esistenti).",
    importPairsButton: "Importa da JSON",
    importSuccess: (count) => `RelationSync: importate ${count} coppie.`,
    importError: "RelationSync: importazione fallita — file non valido o illeggibile.",

    excludePaths: "Percorsi esclusi",
    excludePathsDesc:
      "Percorsi di cartelle o file separati da virgola da ignorare durante la sincronizzazione (es. Templates, Archivio).",
    excludePathsPlaceholder: "Templates, Archivio, Note Giornaliere",

    filterRelations: "Filtra relazioni",
    searchPlaceholder: "Cerca… (es. amico, friend, ex)",

    addPairButton: "+ Aggiungi coppia",

    pairsTotal: (count) => `${count} coppie in totale`,
    pairsShown: (visible, total) => `${visible} / ${total} coppie mostrate`,

    forwardPlaceholder: "diretto (es. amico di)",
    inversePlaceholder: "inverso (es. amico di)",
    removePairTooltip: "Rimuovi questa coppia",
    togglePairTooltip: "Abilita / disabilita questa coppia",

    noSearchResults: "Nessuna relazione corrisponde alla ricerca.",
    noRelations:
      'Nessuna relazione definita. Clicca "+ Aggiungi coppia" per crearne una.',

    showAllLanguages: "Mostra tutte le lingue",
    showAllLanguagesDesc:
      "Quando disattivato, vengono mostrate solo le relazioni nella tua lingua. Attiva per vedere tutte.",

    catFamily: "👨‍👩‍👧‍👦 Famiglia",
    catRomantic: "💕 Sentimentale",
    catFriendship: "🤝 Amicizia e Sociale",
    catProfessional: "💼 Professionale",
    catEducation: "🎓 Istruzione",
    catCreative: "🎨 Creativo",
    catMisc: "🔗 Varie",
    catCustom: "📦 Personalizzato",
  },

  // ── Coppie di relazioni per categoria ──────────────────────────────────
  categories: {
    family: [
      // Genitore / Figlio
      { forward: "Figlio di", inverse: "Genitore di" },
      { forward: "Figlia di", inverse: "Genitore di" },
      { forward: "Genitore di", inverse: "Figlio di" },
      { forward: "Padre di", inverse: "Figlio di" },
      { forward: "Madre di", inverse: "Figlio di" },
      { forward: "Figliastro di", inverse: "Patrigno di" },
      { forward: "Figliastra di", inverse: "Matrigna di" },
      { forward: "Patrigno di", inverse: "Figliastro di" },
      { forward: "Matrigna di", inverse: "Figliastra di" },
      { forward: "Figlio adottivo di", inverse: "Genitore adottivo di" },
      { forward: "Genitore adottivo di", inverse: "Figlio adottivo di" },
      // Coniugi e Partner
      { forward: "Moglie di", inverse: "Marito di" },
      { forward: "Marito di", inverse: "Moglie di" },
      { forward: "Coniuge di", inverse: "Coniuge di" },
      { forward: "Compagno di", inverse: "Compagna di" },
      { forward: "Compagna di", inverse: "Compagno di" },
      { forward: "Convivente di", inverse: "Convivente di" },
      // Fratelli / Sorelle
      { forward: "Fratello di", inverse: "Fratello di" },
      { forward: "Sorella di", inverse: "Sorella di" },
      { forward: "Fratellastro di", inverse: "Fratellastro di" },
      { forward: "Sorellastra di", inverse: "Sorellastra di" },
      { forward: "Gemello di", inverse: "Gemello di" },
      { forward: "Gemella di", inverse: "Gemella di" },
      // Nonni / Nipoti
      { forward: "Nipote di", inverse: "Nonno di" },
      { forward: "Nonno di", inverse: "Nipote di" },
      { forward: "Nonna di", inverse: "Nipote di" },
      { forward: "Bisnonno di", inverse: "Bisnipote di" },
      { forward: "Bisnonna di", inverse: "Bisnipote di" },
      { forward: "Bisnipote di", inverse: "Bisnonno di" },
      // Zii / Cugini
      { forward: "Zio di", inverse: "Nipote di" },
      { forward: "Zia di", inverse: "Nipote di" },
      { forward: "Cugino di", inverse: "Cugino di" },
      { forward: "Cugina di", inverse: "Cugina di" },
      // Suoceri / Cognati
      { forward: "Suocero di", inverse: "Genero di" },
      { forward: "Suocera di", inverse: "Nuora di" },
      { forward: "Genero di", inverse: "Suocero di" },
      { forward: "Nuora di", inverse: "Suocera di" },
      { forward: "Cognato di", inverse: "Cognato di" },
      { forward: "Cognata di", inverse: "Cognata di" },
      // Padrini
      { forward: "Padrino di", inverse: "Figlioccio di" },
      { forward: "Madrina di", inverse: "Figlioccia di" },
      { forward: "Figlioccio di", inverse: "Padrino di" },
      { forward: "Figlioccia di", inverse: "Madrina di" },
    ],

    romantic: [
      { forward: "Fidanzato di", inverse: "Fidanzata di" },
      { forward: "Fidanzata di", inverse: "Fidanzato di" },
      { forward: "Ragazzo di", inverse: "Ragazza di" },
      { forward: "Ragazza di", inverse: "Ragazzo di" },
      { forward: "Ex di", inverse: "Ex di" },
      { forward: "Ex ragazzo di", inverse: "Ex ragazza di" },
      { forward: "Ex ragazza di", inverse: "Ex ragazzo di" },
      { forward: "Ex fidanzato di", inverse: "Ex fidanzata di" },
      { forward: "Ex fidanzata di", inverse: "Ex fidanzato di" },
      { forward: "Ex marito di", inverse: "Ex moglie di" },
      { forward: "Ex moglie di", inverse: "Ex marito di" },
      { forward: "Cotta di", inverse: "Cotta di" },
      { forward: "Amante di", inverse: "Amante di" },
      { forward: "Innamorato di", inverse: "Amato da" },
      { forward: "Amato da", inverse: "Innamorato di" },
      { forward: "Spasimante di", inverse: "Corteggiato da" },
      { forward: "Corteggiato da", inverse: "Spasimante di" },
      { forward: "Frequenta", inverse: "Frequenta" },
      { forward: "Promesso sposo di", inverse: "Promessa sposa di" },
      { forward: "Promessa sposa di", inverse: "Promesso sposo di" },
    ],

    friendship: [
      { forward: "Amico di", inverse: "Amico di" },
      { forward: "Amica di", inverse: "Amica di" },
      { forward: "Migliore amico di", inverse: "Migliore amico di" },
      { forward: "Migliore amica di", inverse: "Migliore amica di" },
      { forward: "Amico d'infanzia di", inverse: "Amico d'infanzia di" },
      { forward: "Conoscente di", inverse: "Conoscente di" },
      { forward: "Vicino di", inverse: "Vicino di" },
      { forward: "Vicina di", inverse: "Vicina di" },
      { forward: "Coinquilino di", inverse: "Coinquilino di" },
      { forward: "Coinquilina di", inverse: "Coinquilina di" },
      { forward: "Alleato di", inverse: "Alleato di" },
      { forward: "Nemico di", inverse: "Nemico di" },
      { forward: "Rivale di", inverse: "Rivale di" },
    ],

    professional: [
      { forward: "Collega di", inverse: "Collega di" },
      { forward: "Capo di", inverse: "Dipendente di" },
      { forward: "Dipendente di", inverse: "Capo di" },
      { forward: "Responsabile di", inverse: "Subordinato di" },
      { forward: "Subordinato di", inverse: "Responsabile di" },
      { forward: "Assistente di", inverse: "Assistito da" },
      { forward: "Assistito da", inverse: "Assistente di" },
      { forward: "Socio di", inverse: "Socio di" },
      { forward: "Co-fondatore di", inverse: "Co-fondato da" },
      { forward: "Co-fondato da", inverse: "Co-fondatore di" },
      { forward: "Cliente di", inverse: "Fornitore di" },
      { forward: "Fornitore di", inverse: "Cliente di" },
      { forward: "Successore di", inverse: "Predecessore di" },
      { forward: "Predecessore di", inverse: "Successore di" },
      { forward: "Datore di lavoro di", inverse: "Lavoratore di" },
      { forward: "Lavoratore di", inverse: "Datore di lavoro di" },
    ],

    education: [
      { forward: "Insegnante di", inverse: "Studente di" },
      { forward: "Studente di", inverse: "Insegnante di" },
      { forward: "Professore di", inverse: "Alunno di" },
      { forward: "Alunno di", inverse: "Professore di" },
      { forward: "Mentore di", inverse: "Allievo di" },
      { forward: "Allievo di", inverse: "Mentore di" },
      { forward: "Compagno di classe di", inverse: "Compagno di classe di" },
      { forward: "Compagno di scuola di", inverse: "Compagno di scuola di" },
      { forward: "Maestro di", inverse: "Apprendista di" },
      { forward: "Apprendista di", inverse: "Maestro di" },
    ],

    creative: [
      { forward: "Collaboratore di", inverse: "Collaboratore di" },
      { forward: "Ispirato da", inverse: "Ispirazione per" },
      { forward: "Ispirazione per", inverse: "Ispirato da" },
      { forward: "Influenzato da", inverse: "Ha influenzato" },
      { forward: "Ha influenzato", inverse: "Influenzato da" },
      { forward: "Compagno di band di", inverse: "Compagno di band di" },
      { forward: "Compagno di squadra di", inverse: "Compagno di squadra di" },
    ],

    misc: [
      { forward: "Imparentato con", inverse: "Imparentato con" },
      { forward: "Conosce", inverse: "Conosciuto da" },
      { forward: "Conosciuto da", inverse: "Conosce" },
      { forward: "Presentato da", inverse: "Ha presentato" },
      { forward: "Ha presentato", inverse: "Presentato da" },
      { forward: "Compagno di", inverse: "Compagno di" },
      { forward: "Tutore di", inverse: "Protetto di" },
      { forward: "Protetto di", inverse: "Tutore di" },
      { forward: "Membro di", inverse: "Ha membro" },
      { forward: "Ha membro", inverse: "Membro di" },
      { forward: "Appartiene a", inverse: "Proprietario di" },
      { forward: "Proprietario di", inverse: "Appartiene a" },
      { forward: "Creato da", inverse: "Creatore di" },
      { forward: "Creatore di", inverse: "Creato da" },
      { forward: "Fondato da", inverse: "Fondatore di" },
      { forward: "Fondatore di", inverse: "Fondato da" },
    ],
  },
};
