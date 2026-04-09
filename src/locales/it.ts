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
      { forward: "figlio di", inverse: "genitore di" },
      { forward: "figlia di", inverse: "genitore di" },
      { forward: "genitore di", inverse: "figlio di" },
      { forward: "padre di", inverse: "figlio di" },
      { forward: "madre di", inverse: "figlio di" },
      { forward: "figliastro di", inverse: "patrigno di" },
      { forward: "figliastra di", inverse: "matrigna di" },
      { forward: "patrigno di", inverse: "figliastro di" },
      { forward: "matrigna di", inverse: "figliastra di" },
      { forward: "figlio adottivo di", inverse: "genitore adottivo di" },
      { forward: "genitore adottivo di", inverse: "figlio adottivo di" },
      // Coniugi e Partner
      { forward: "moglie di", inverse: "marito di" },
      { forward: "marito di", inverse: "moglie di" },
      { forward: "coniuge di", inverse: "coniuge di" },
      { forward: "compagno di", inverse: "compagna di" },
      { forward: "compagna di", inverse: "compagno di" },
      { forward: "convivente di", inverse: "convivente di" },
      // Fratelli / Sorelle
      { forward: "fratello di", inverse: "fratello di" },
      { forward: "sorella di", inverse: "sorella di" },
      { forward: "fratellastro di", inverse: "fratellastro di" },
      { forward: "sorellastra di", inverse: "sorellastra di" },
      { forward: "gemello di", inverse: "gemello di" },
      { forward: "gemella di", inverse: "gemella di" },
      // Nonni / Nipoti
      { forward: "nipote di", inverse: "nonno di" },
      { forward: "nonno di", inverse: "nipote di" },
      { forward: "nonna di", inverse: "nipote di" },
      { forward: "bisnonno di", inverse: "bisnipote di" },
      { forward: "bisnonna di", inverse: "bisnipote di" },
      { forward: "bisnipote di", inverse: "bisnonno di" },
      // Zii / Cugini
      { forward: "zio di", inverse: "nipote di" },
      { forward: "zia di", inverse: "nipote di" },
      { forward: "cugino di", inverse: "cugino di" },
      { forward: "cugina di", inverse: "cugina di" },
      // Suoceri / Cognati
      { forward: "suocero di", inverse: "genero di" },
      { forward: "suocera di", inverse: "nuora di" },
      { forward: "genero di", inverse: "suocero di" },
      { forward: "nuora di", inverse: "suocera di" },
      { forward: "cognato di", inverse: "cognato di" },
      { forward: "cognata di", inverse: "cognata di" },
      // Padrini
      { forward: "padrino di", inverse: "figlioccio di" },
      { forward: "madrina di", inverse: "figlioccia di" },
      { forward: "figlioccio di", inverse: "padrino di" },
      { forward: "figlioccia di", inverse: "madrina di" },
    ],

    romantic: [
      { forward: "fidanzato di", inverse: "fidanzata di" },
      { forward: "fidanzata di", inverse: "fidanzato di" },
      { forward: "ragazzo di", inverse: "ragazza di" },
      { forward: "ragazza di", inverse: "ragazzo di" },
      { forward: "ex di", inverse: "ex di" },
      { forward: "ex ragazzo di", inverse: "ex ragazza di" },
      { forward: "ex ragazza di", inverse: "ex ragazzo di" },
      { forward: "ex fidanzato di", inverse: "ex fidanzata di" },
      { forward: "ex fidanzata di", inverse: "ex fidanzato di" },
      { forward: "ex marito di", inverse: "ex moglie di" },
      { forward: "ex moglie di", inverse: "ex marito di" },
      { forward: "cotta di", inverse: "cotta di" },
      { forward: "amante di", inverse: "amante di" },
      { forward: "innamorato di", inverse: "amato da" },
      { forward: "amato da", inverse: "innamorato di" },
      { forward: "spasimante di", inverse: "corteggiato da" },
      { forward: "corteggiato da", inverse: "spasimante di" },
      { forward: "frequenta", inverse: "frequenta" },
      { forward: "promesso sposo di", inverse: "promessa sposa di" },
      { forward: "promessa sposa di", inverse: "promesso sposo di" },
    ],

    friendship: [
      { forward: "amico di", inverse: "amico di" },
      { forward: "amica di", inverse: "amica di" },
      { forward: "migliore amico di", inverse: "migliore amico di" },
      { forward: "migliore amica di", inverse: "migliore amica di" },
      { forward: "amico d'infanzia di", inverse: "amico d'infanzia di" },
      { forward: "conoscente di", inverse: "conoscente di" },
      { forward: "vicino di", inverse: "vicino di" },
      { forward: "vicina di", inverse: "vicina di" },
      { forward: "coinquilino di", inverse: "coinquilino di" },
      { forward: "coinquilina di", inverse: "coinquilina di" },
      { forward: "alleato di", inverse: "alleato di" },
      { forward: "nemico di", inverse: "nemico di" },
      { forward: "rivale di", inverse: "rivale di" },
    ],

    professional: [
      { forward: "collega di", inverse: "collega di" },
      { forward: "capo di", inverse: "dipendente di" },
      { forward: "dipendente di", inverse: "capo di" },
      { forward: "responsabile di", inverse: "subordinato di" },
      { forward: "subordinato di", inverse: "responsabile di" },
      { forward: "assistente di", inverse: "assistito da" },
      { forward: "assistito da", inverse: "assistente di" },
      { forward: "socio di", inverse: "socio di" },
      { forward: "co-fondatore di", inverse: "co-fondato da" },
      { forward: "co-fondato da", inverse: "co-fondatore di" },
      { forward: "cliente di", inverse: "fornitore di" },
      { forward: "fornitore di", inverse: "cliente di" },
      { forward: "successore di", inverse: "predecessore di" },
      { forward: "predecessore di", inverse: "successore di" },
      { forward: "datore di lavoro di", inverse: "lavoratore di" },
      { forward: "lavoratore di", inverse: "datore di lavoro di" },
    ],

    education: [
      { forward: "insegnante di", inverse: "studente di" },
      { forward: "studente di", inverse: "insegnante di" },
      { forward: "professore di", inverse: "alunno di" },
      { forward: "alunno di", inverse: "professore di" },
      { forward: "mentore di", inverse: "allievo di" },
      { forward: "allievo di", inverse: "mentore di" },
      { forward: "compagno di classe di", inverse: "compagno di classe di" },
      { forward: "compagno di scuola di", inverse: "compagno di scuola di" },
      { forward: "maestro di", inverse: "apprendista di" },
      { forward: "apprendista di", inverse: "maestro di" },
    ],

    creative: [
      { forward: "collaboratore di", inverse: "collaboratore di" },
      { forward: "ispirato da", inverse: "ispirazione per" },
      { forward: "ispirazione per", inverse: "ispirato da" },
      { forward: "influenzato da", inverse: "ha influenzato" },
      { forward: "ha influenzato", inverse: "influenzato da" },
      { forward: "compagno di band di", inverse: "compagno di band di" },
      { forward: "compagno di squadra di", inverse: "compagno di squadra di" },
    ],

    misc: [
      { forward: "imparentato con", inverse: "imparentato con" },
      { forward: "conosce", inverse: "conosciuto da" },
      { forward: "conosciuto da", inverse: "conosce" },
      { forward: "presentato da", inverse: "ha presentato" },
      { forward: "ha presentato", inverse: "presentato da" },
      { forward: "compagno di", inverse: "compagno di" },
      { forward: "tutore di", inverse: "protetto di" },
      { forward: "protetto di", inverse: "tutore di" },
      { forward: "membro di", inverse: "ha membro" },
      { forward: "ha membro", inverse: "membro di" },
      { forward: "appartiene a", inverse: "proprietario di" },
      { forward: "proprietario di", inverse: "appartiene a" },
      { forward: "creato da", inverse: "creatore di" },
      { forward: "creatore di", inverse: "creato da" },
      { forward: "fondato da", inverse: "fondatore di" },
      { forward: "fondatore di", inverse: "fondato da" },
    ],
  },
};
