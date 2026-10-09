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
    stateReady: "Sincronizzazione automatica attiva",
    statePaused: "Sincronizzazione automatica in pausa",
    stateBlocked: "Sincronizzazione bloccata: controlla le coppie abilitate",
    firstRunTitle: "Inizia con due note",
    firstRunDesc: "I nomi delle proprietà descrivono la persona collegata. Crea entrambe le note, aggiungi un wiki link tra virgolette in una proprietà e controlla l'anteprima della nota corrente prima di attivare la sincronizzazione automatica.",
    exampleSource: "Luca.md",
    exampleTarget: "Maria.md",
    exampleForward: "madre",
    exampleInverse: "figli",
    checkCurrentNote: "Anteprima nota corrente",
    checkCurrentNoteDesc: "Completa gli inversi mancanti per questa nota. L'anteprima elenca anche le destinazioni mancanti ed escluse. Questa azione manuale funziona anche con la sincronizzazione automatica in pausa.",
    noActiveNote: "Apri prima una nota Markdown.",
    openSettings: "Apri impostazioni",
    relationsHeading: "Coppie di relazioni",
    advancedHeading: "Strumenti del vault e predefiniti",
    editPair: "Modifica coppia",
    savePair: "Salva coppia",
    pairEnabled: "Abilita questa coppia",
    forwardLabel: "Proprietà nella nota di origine",
    inverseLabel: "Proprietà da aggiungere nella nota collegata",
    forwardAliasesLabel: "Altri nomi della proprietà di origine",
    inverseAliasesLabel: "Altri nomi della proprietà inversa",
    aliasesDesc: "Sinonimi separati da virgole. Gli inversi usano il nome principale; i sinonimi già presenti vengono conservati.",
    aliasesPlaceholder: "madre, mamma, padre, papà, babbo",
    activePairs: (active, total) => `${active} attive / ${total} coppie`,
    logAdded: "Aggiunto",
    logRemoved: "Rimosso",
    syncBusy: "Una sincronizzazione è già in corso. Attendi che finisca.",
    previewChanged: "Le note o la configurazione sono cambiate dopo l'anteprima. Controlla una nuova anteprima prima di applicare.",
    writeError: (file, message) => `Relation Sync: impossibile aggiornare ${file}: ${message}`,
    syncResult: (scanned, changed, changes, failed) => `Lette ${scanned} note; modificate ${changed} note; applicate ${changes} modifiche; ${failed} errori di scrittura.`,
    problemsHeading: "Collegamenti che non possono essere sincronizzati",
    problemMissing: "La nota di destinazione non esiste",
    problemExcluded: "La nota di destinazione è esclusa",
    problemValue: "La proprietà inversa ha un valore non supportato; usa un wiki link o una lista.",
    problemInvalid: "La destinazione non è una nota Markdown",
    undoSessionDesc: "Puoi annullare solo l'ultimo gruppo di scritture di questa sessione. Una nuova sincronizzazione con modifiche lo sostituisce; riavviare Obsidian lo cancella. Le rinomine non sono incluse.",
    settingsMigrated: "Relation Sync ora usa predefiniti inglesi e italiani con inversi neutri. Coppie personalizzate, sincronizzazione automatica ed esclusioni sono state conservate. Controlla le coppie aggiornate prima di sincronizzare.",
    languageFilter: "Lingua delle proprietà",
    allLanguages: "Inglese e italiano",
    languagePresets: "Abilita un set predefinito",
    languagePresetsDesc: "Aggiunge le coppie compatibili senza sostituire le associazioni personalizzate. La lingua delle proprietà è indipendente da quella dell'interfaccia.",
    enableEnglish: "Abilita coppie inglesi",
    enableItalian: "Abilita coppie italiane",
    presetConflicts: (count) => `${count} coppie incompatibili sono rimaste disabilitate. Controlla i nomi delle proprietà.`,
    panelCheck: "Controlla i collegamenti inversi",
    panelConfigured: "Configura le coppie",
    panelMissing: "Nota mancante",
    panelExcluded: "Nota esclusa",
    panelReciprocal: "Inverso presente",
    panelUnpaired: "Inverso mancante",
    undoPreviewTitle: "Modifiche da annullare",
    undoChanges: (count) => `Annulla ${count} modifiche registrate. Controlla l’elenco prima di continuare.`,

    pluginTitle: "Relation Sync",
    pluginDescription:
      "Mantiene i collegamenti inversi tra le proprietà delle note. I sinonimi italiani e inglesi usano ruoli neutri, senza dedurre il genere.",

    resetToDefaults: "Ripristina coppie predefinite",
    resetToDefaultsDesc:
      "Sostituisce solo le coppie. Sincronizzazione automatica e percorsi esclusi restano invariati.",
    resetToDefaultsButton: "Ripristina coppie predefinite",
    resetConfirm:
      "Sostituire tutte le coppie, comprese quelle personalizzate? Sincronizzazione automatica ed esclusioni restano invariate. Nessuna proprietà delle note verrà eliminata.",
    resetNotice: "RelationSync: relazioni ripristinate ai predefiniti.",

    syncVault: "Sincronizza l'intero vault",
    syncVaultDesc:
      "Mostra un'anteprima e aggiunge gli inversi mancanti. Conserva le relazioni esistenti; questa azione manuale funziona anche con l'automatismo in pausa.",
    syncVaultButton: "Avvia sincronizzazione globale",
    bulkSyncRunningNotice: "RelationSync: sincronizzazione massiva in corso...",
    bulkSyncFailedNotice: "RelationSync: sincronizzazione massiva fallita.",
    bulkPreviewTitle: "Anteprima sincronizzazione massiva",
    bulkPreviewDesc: (changes, files) =>
      `Controlla ${changes} modifiche previste su ${files} note prima di scrivere nel vault.`,
    bulkPreviewSummary: (files, added, removed) =>
      `${files} file verranno modificati: ${added} aggiunte, ${removed} rimozioni.`,
    bulkPreviewTruncated: (count) => `${count} altre modifiche non sono mostrate.`,
    confirmBulkSyncButton: "Applica modifiche",
    syncLogTitle: "Log sincronizzazione",
    noSyncChanges: "Nessuna modifica effettuata.",
    copyLogButton: "Copia log",
    copyLogNotice: "RelationSync: log copiato.",
    logFileColumn: "File",
    logActionColumn: "Azione",
    logKeyColumn: "Chiave",
    logLinkColumn: "Link",
    cancelButton: "Annulla",
    confirmButton: "Conferma",
    openRelationsPanel: "Apri pannello relazioni",
    syncEnabled: "Sincronizzazione automatica",
    syncEnabledDesc:
      "Quando è disattivata, Relation Sync osserva le modifiche ma non scrive relazioni inverse.",
    viewRecentLog: "Log sincronizzazione recente",
    viewRecentLogDesc: "Rivedi fino a 200 scritture di questa sessione, con i percorsi completi delle note.",
    viewRecentLogButton: "Vedi log",
    undoLastSync: "Annulla ultima sincronizzazione",
    undoLastSyncButton: "Annulla ultima sincronizzazione",
    undoLastSyncNotice: (count) =>
      `RelationSync: annullate ${count} modifiche di sincronizzazione.`,
    noUndoAvailable: "RelationSync: nessun gruppo di modifiche disponibile da annullare.",
    configInvalidTitle: "La configurazione richiede attenzione",
    configInvalidDesc:
      "Correggi i nomi e i sinonimi vuoti o in conflitto prima di sincronizzare. Abilita almeno una coppia valida.",
    bulkProgress: (filesDone, filesTotal, changes) =>
      `RelationSync: sincronizzati ${filesDone}/${filesTotal} file (${changes} modifiche applicate).`,
    bulkSyncCancelledNotice: (changes) =>
      `RelationSync: sincronizzazione massiva annullata dopo ${changes} modifiche.`,

    relationsPanelTitle: "Relazioni",
    relationsPanelNoFile: "Apri una nota per vedere le sue relazioni.",
    relationsPanelNoFrontmatter: "Questa nota non ha frontmatter.",
    relationsPanelNoRelations: "Nessuna relazione configurata trovata in questa nota.",
    relationsPanelRelationCount: (count) =>
      count === 1 ? "1 nota collegata" : `${count} note collegate`,
    relationsPanelOpenNoteTooltip: "Apri nota",

    exportPairs: "Esporta coppie di relazioni",
    exportPairsDesc:
      "Salva tutte le coppie di relazioni attuali in un file JSON nella radice del vault.",
    exportPairsButton: "Esporta in JSON",
    exportSuccess: (filename) => `RelationSync: esportato in ${filename}.`,
    exportError: "RelationSync: esportazione fallita.",
    exportOverwriteConfirm: (filename) =>
      `${filename} esiste già nella radice del vault.\n\nSovrascriverlo?`,
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

    forwardPlaceholder: "genitore",
    inversePlaceholder: "figli",
    removePairTooltip: "Rimuovi questa coppia",
    togglePairTooltip: "Abilita / disabilita questa coppia",
    validationEmptyField: "Entrambi i campi relazione sono obbligatori.",
    validationDuplicatePair: "Questa coppia di relazioni è duplicata.",
    validationConflictingKey: (key) =>
      `"${key}" è già gestita da un'altra coppia abilitata.`,

    noSearchResults: "Nessuna relazione corrisponde alla ricerca.",
    noRelations:
      'Nessuna relazione definita. Clicca "+ Aggiungi coppia" per crearne una.',

    duplicateImportSkipped: (added, skipped) =>
      `RelationSync: importate ${added} coppie; saltati ${skipped} duplicati.`,

    catFamily: "Famiglia",
    catRomantic: "Sentimentale",
    catFriendship: "Amicizia e Sociale",
    catProfessional: "Professionale",
    catEducation: "Istruzione",
    catCreative: "Creativo",
    catMisc: "Varie",
    catCustom: "Personalizzato",
  },

  categories: {
    family: [
      {
        forward: "genitore", inverse: "figli",
        forwardAliases: ["genitori", "madre", "mamma", "mammà", "padre", "papà", "papa", "babbo", "Figlio di", "Figlia di"],
        inverseAliases: ["figlio", "figlia", "figlie", "Genitore di", "Padre di", "Madre di"],
      },
      {
        forward: "genitore acquisito", inverse: "figli acquisiti",
        forwardAliases: ["patrigno", "matrigna", "Figliastro di", "Figliastra di"],
        inverseAliases: ["figliastro", "figliastra", "Patrigno di", "Matrigna di"],
      },
      {
        forward: "genitore adottivo", inverse: "figli adottivi",
        forwardAliases: ["Figlio adottivo di"],
        inverseAliases: ["Genitore adottivo di"],
      },
      {
        forward: "coniuge", inverse: "coniuge",
        forwardAliases: ["moglie", "marito", "Moglie di", "Marito di", "Coniuge di"],
      },
      {
        forward: "fratelli e sorelle", inverse: "fratelli e sorelle",
        forwardAliases: ["fratello", "sorella", "fratelli", "sorelle", "Fratello di", "Sorella di"],
      },
      {
        forward: "fratelli e sorelle acquisiti", inverse: "fratelli e sorelle acquisiti",
        forwardAliases: ["fratellastro", "sorellastra", "Fratellastro di", "Sorellastra di"],
      },
      {
        forward: "gemelli", inverse: "gemelli",
        forwardAliases: ["gemello", "gemella", "Gemello di", "Gemella di"],
      },
      {
        forward: "nonni", inverse: "nipoti di nonni",
        forwardAliases: ["nonno", "nonna", "Nipote di"],
        inverseAliases: ["nipote di nonni", "Nonno di", "Nonna di"],
      },
      {
        forward: "bisnonni", inverse: "pronipoti",
        forwardAliases: ["bisnonno", "bisnonna", "Bisnipote di"],
        inverseAliases: ["bisnipote", "Bisnonno di", "Bisnonna di"],
      },
      {
        forward: "zii", inverse: "nipoti di zii",
        forwardAliases: ["zio", "zia"],
        inverseAliases: ["nipote di zii", "Zio di", "Zia di"],
      },
      {
        forward: "cugini", inverse: "cugini",
        forwardAliases: ["cugino", "cugina", "Cugino di", "Cugina di"],
      },
      {
        forward: "suoceri", inverse: "generi e nuore",
        forwardAliases: ["suocero", "suocera", "Genero di", "Nuora di"],
        inverseAliases: ["genero", "nuora", "Suocero di", "Suocera di"],
      },
      {
        forward: "cognati", inverse: "cognati",
        forwardAliases: ["cognato", "cognata", "Cognato di", "Cognata di"],
      },
      {
        forward: "genitore spirituale", inverse: "figli spirituali",
        forwardAliases: ["padrino", "madrina", "Figlioccio di", "Figlioccia di"],
        inverseAliases: ["figlioccio", "figlioccia", "Padrino di", "Madrina di"],
      },
    ],
    romantic: [
      {
        forward: "relazione sentimentale", inverse: "relazione sentimentale",
        forwardAliases: ["compagno", "compagna", "fidanzato", "fidanzata", "ragazzo", "ragazza", "Fidanzato di", "Fidanzata di", "Ragazzo di", "Ragazza di", "Compagno di", "Compagna di", "Convivente di"],
      },
      {
        forward: "promessi sposi", inverse: "promessi sposi",
        forwardAliases: ["Promesso sposo di", "Promessa sposa di"],
      },
      {
        forward: "ex", inverse: "ex",
        forwardAliases: ["Ex di", "Ex ragazzo di", "Ex ragazza di", "Ex fidanzato di", "Ex fidanzata di", "Ex marito di", "Ex moglie di"],
      },
      {
        forward: "amante", inverse: "amante",
        forwardAliases: ["Amante di"],
      },
      {
        forward: "persona amata", inverse: "persona innamorata",
        forwardAliases: ["cotta", "Innamorato di"],
        inverseAliases: ["Amato da", "Cotta di"],
      },
      {
        forward: "persona ammirata", inverse: "ammiratori",
        forwardAliases: ["Spasimante di"],
        inverseAliases: ["Corteggiato da"],
      },
      {
        forward: "frequenta", inverse: "frequenta",
      },
    ],
    friendship: [
      {
        forward: "amicizie", inverse: "amicizie",
        forwardAliases: ["amico", "amica", "amici", "amiche", "Amico di", "Amica di"],
      },
      {
        forward: "migliori amicizie", inverse: "migliori amicizie",
        forwardAliases: ["Migliore amico di", "Migliore amica di"],
      },
      {
        forward: "amicizie di infanzia", inverse: "amicizie di infanzia",
        forwardAliases: ["Amico d'infanzia di"],
      },
      {
        forward: "conoscenze", inverse: "conoscenze",
        forwardAliases: ["conoscente", "Conoscente di"],
      },
      {
        forward: "vicinato", inverse: "vicinato",
        forwardAliases: ["vicino", "vicina", "Vicino di", "Vicina di"],
      },
      {
        forward: "coinquilini", inverse: "coinquilini",
        forwardAliases: ["coinquilino", "coinquilina", "Coinquilino di", "Coinquilina di"],
      },
      {
        forward: "alleanze", inverse: "alleanze",
        forwardAliases: ["alleato", "alleata", "Alleato di"],
      },
      {
        forward: "inimicizie", inverse: "inimicizie",
        forwardAliases: ["nemico", "nemica", "Nemico di"],
      },
      {
        forward: "rivalità", inverse: "rivalità",
        forwardAliases: ["rivale", "Rivale di"],
      },
    ],
    professional: [
      {
        forward: "colleghi", inverse: "colleghi",
        forwardAliases: ["collega", "Collega di"],
      },
      {
        forward: "responsabile", inverse: "dipendenti",
        forwardAliases: ["capo", "Dipendente di", "Subordinato di", "Lavoratore di"],
        inverseAliases: ["dipendente", "Capo di", "Responsabile di", "Datore di lavoro di"],
      },
      {
        forward: "assistente", inverse: "persona assistita",
        forwardAliases: ["Assistito da"],
        inverseAliases: ["Assistente di"],
      },
      {
        forward: "soci", inverse: "soci",
        forwardAliases: ["socio", "socia", "Socio di"],
      },
      {
        forward: "cofondatori", inverse: "organizzazione cofondata",
        forwardAliases: ["Co-fondato da"],
        inverseAliases: ["Co-fondatore di"],
      },
      {
        forward: "fornitore", inverse: "clienti",
        forwardAliases: ["Cliente di"],
        inverseAliases: ["cliente", "Provider di", "Fornitore di"],
      },
      {
        forward: "predecessore", inverse: "successore",
        forwardAliases: ["Successore di"],
        inverseAliases: ["Predecessore di"],
      },
    ],
    education: [
      {
        forward: "insegnante", inverse: "studenti",
        forwardAliases: ["professore", "professoressa", "Studente di", "Alunno di"],
        inverseAliases: ["studente", "studentessa", "Insegnante di", "Professore di"],
      },
      {
        forward: "mentore", inverse: "allievi",
        forwardAliases: ["Allievo di"],
        inverseAliases: ["allievo", "allieva", "Mentore di"],
      },
      {
        forward: "compagni di classe", inverse: "compagni di classe",
        forwardAliases: ["Compagno di classe di"],
      },
      {
        forward: "compagni di scuola", inverse: "compagni di scuola",
        forwardAliases: ["Compagno di scuola di"],
      },
      {
        forward: "maestro", inverse: "apprendisti",
        forwardAliases: ["Apprendista di"],
        inverseAliases: ["apprendista", "Maestro di"],
      },
    ],
    creative: [
      {
        forward: "collaborazioni", inverse: "collaborazioni",
        forwardAliases: ["collaboratore", "collaboratrice", "Collaboratore di"],
      },
      {
        forward: "ispirazione", inverse: "persone ispirate",
        forwardAliases: ["Ispirato da"],
        inverseAliases: ["Ispirazione per"],
      },
      {
        forward: "influenze", inverse: "persone influenzate",
        forwardAliases: ["Influenzato da"],
        inverseAliases: ["Ha influenzato"],
      },
      {
        forward: "compagni di band", inverse: "compagni di band",
        forwardAliases: ["Compagno di band di"],
      },
      {
        forward: "compagni di squadra", inverse: "compagni di squadra",
        forwardAliases: ["Compagno di squadra di"],
      },
    ],
    misc: [
      {
        forward: "parentela", inverse: "parentela",
        forwardAliases: ["Imparentato con"],
      },
      {
        forward: "conosce", inverse: "conosciuto da",
      },
      {
        forward: "presentato da", inverse: "ha presentato",
      },
      {
        forward: "tutore", inverse: "persone tutelate",
        forwardAliases: ["Protetto di"],
        inverseAliases: ["Tutore di"],
      },
      {
        forward: "organizzazione", inverse: "membri",
        forwardAliases: ["Membro di"],
        inverseAliases: ["Ha membro"],
      },
      {
        forward: "proprietario", inverse: "beni",
        forwardAliases: ["Appartiene a"],
        inverseAliases: ["Proprietario di"],
      },
      {
        forward: "autore", inverse: "opere",
        forwardAliases: ["Creato da"],
        inverseAliases: ["Creatore di"],
      },
      {
        forward: "fondatori", inverse: "organizzazione fondata",
        forwardAliases: ["Fondato da"],
        inverseAliases: ["Fondatore di"],
      },
    ],
  },
};
