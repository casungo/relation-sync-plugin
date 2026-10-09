# Report sul primo utilizzo di Relation Sync

Data: 8 ottobre 2026. Versione locale: 1.2.0. Commit: `249eb6a`.

## Giudizio

L'idea è comprensibile e utile: scrivo una relazione in una nota e il plugin mantiene il collegamento inverso nell'altra. Il primo utilizzo, però, richiede di conoscere già il funzionamento del plugin. L'interfaccia espone molti strumenti di amministrazione prima di aiutare a ottenere una prima relazione funzionante.

Il problema più grave è la prevedibilità. Due azioni plausibili per un principiante, sincronizzare tutto e abilitare la propria lingua, producono rispettivamente una relazione che cambia lato a ogni passaggio e una configurazione che blocca il motore. Questi difetti vanno risolti prima di intervenire sull'aspetto grafico.

## Metodo e limiti

Ho letto impostazioni, pannello, testi italiani e inglesi, README e motore. Ho eseguito test, lint e controllo TypeScript. Ho inoltre eseguito il motore attuale su un vault simulato in memoria, senza usare note personali.

Ho preparato un vault temporaneo e una build separata in `/tmp/relation-sync-usability-20261008`, poi aperto il vault in Obsidian 1.14.4 nell'ambiente disponibile. La cattura del selettore iniziale funzionava, ma dopo l'apertura del vault lo streaming mostrava una schermata nera anche dopo un nuovo collegamento. Non è quindi un audit visivo completato. Non attribuisco la schermata nera al plugin.

Le osservazioni sull'interfaccia derivano dalla sua implementazione. Non sono risultati di un test con utenti. Contrasto, tastiera, screen reader, resa mobile e flusso reale di Obsidian restano da verificare. Non ho modificato il codice del plugin, pubblicato o eseguito sincronizzazioni su vault personali.

## Percorso di un nuovo utente

| Passaggio | Cosa cerca di fare | Stato e ostacolo |
| --- | --- | --- |
| 1 | Abilitare il plugin e capire da dove iniziare | Debole. Nessuna guida iniziale; sincronizzazione automatica già attiva. |
| 2 | Scegliere una coppia adatta alle proprie note | Debole. La lista arriva dopo log, annullamento, reset, sincronizzazione globale e import/export. |
| 3 | Seguire un esempio per scrivere la prima relazione | Problematico. L'esempio principale usa chiavi assenti dai preset e link YAML senza virgolette. |
| 4 | Creare una coppia personalizzata | Problematico. Il pulsante salva subito una coppia vuota abilitata, bloccando tutte le relazioni. |
| 5 | Sincronizzare note già esistenti | Critico. La sincronizzazione globale può togliere il lato originale e aggiungere l'inverso, senza raggiungere uno stato stabile. |
| 6 | Capire se ha funzionato | Debole. Il pannello mostra collegamenti ma non verifica che siano reciproci e non aiuta a correggere gli stati vuoti. |
| 7 | Annullare o ripristinare | Parziale. Esiste un annullamento, ma lo stato disponibile e i suoi limiti sono poco visibili; il reset cambia anche le protezioni. |

## Problemi prioritari

P0 indica un comportamento da correggere prima di consigliare il flusso. P1 indica un ostacolo alla riuscita o al controllo dell'utente. P2 indica una semplificazione successiva. Le stime S e M significano rispettivamente intervento circoscritto e intervento che coinvolge più parti; non sono preventivi in ore.

### 1. La sincronizzazione globale sposta le relazioni invece di completarle

Priorità P0. Verificato con il motore attuale. Confidenza alta. Sforzo M, rischio della correzione alto perché cambia le regole di riconciliazione.

Con una sola coppia `parent ↔ child`, Alice contiene `parent: "[[Bob]]"` e Bob non ha relazioni. L'anteprima propone di rimuovere `parent` da Alice e aggiungere `child` a Bob. Dopo l'applicazione rimane solo il lato di Bob. Alla seconda sincronizzazione il motore propone il contrario e ritorna allo stato iniziale.

Un utente interpreta "sincronizza" come completare entrambi i lati. Qui ripetere l'azione cambia nuovamente le note. Anche il testo italiano dice che l'operazione "ricalcola e aggiunge", senza anticipare questa rimozione.

Evidenza: [pianificazione e rimozioni](../src/sync-engine.ts#L483), [applicazione](../src/sync-engine.ts#L652), [descrizione](../src/locales/it.ts#L27).

Raccomandazione: definire una riconciliazione conservativa per relazioni esistenti su un solo lato. In assenza di una cancellazione esplicita, completare l'inverso. Il secondo passaggio deve proporre zero modifiche. Aggiungere un test di integrazione del motore che verifichi entrambi i lati e l'idempotenza.

### 2. "Abilita questa lingua" rende invalida la configurazione predefinita

Priorità P0. Verificati i conflitti dei preset e il codice dell'azione. Confidenza alta. Sforzo S, rischio medio.

Il primo caricamento sceglie coppie compatibili. Il pulsante di abilitazione, invece, abilita indiscriminatamente anche le varianti escluse proprio perché conflittuali. Il pacchetto italiano genera 9 segnalazioni di conflitto, quello inglese 8. Il motore restituisce una mappa vuota per tutta la configurazione.

Il comando sembra una scelta normale per iniziare. Il risultato è che nessuna coppia sincronizza, anche quando l'interruttore generale resta acceso. "Abilita categoria" può produrre lo stesso problema quando comprende varianti incompatibili.

Evidenza: [azione lingua](../src/settings-tab.ts#L686), [azione categoria](../src/settings-tab.ts#L677), [selezione iniziale compatibile](../src/locales/index.ts#L104), [blocco del motore](../src/sync-engine.ts#L741).

Raccomandazione: riutilizzare la selezione compatibile oppure mostrare i conflitti prima di salvare e chiedere di scegliere le varianti. Esporre lo stato effettivo "Bloccato dalla configurazione" vicino all'interruttore.

### 3. Aggiungere una coppia interrompe il servizio durante la compilazione

Priorità P1. Blocco verificato con il motore, comportamento UI verificato nel codice. Confidenza alta. Sforzo M, rischio medio.

"Aggiungi coppia" salva immediatamente due campi vuoti con `enabled: true`. Basta questo per svuotare la mappa dell'intero motore. Ogni carattere successivo salva di nuovo, ma non aggiorna gli errori visualizzati. Dopo aver completato correttamente i campi, il motore può essere operativo mentre l'avviso precedente rimane.

C'è anche un ostacolo al recupero: gli errori della singola riga sono scritti in `descEl`, dentro `setting-item-info`, che il CSS nasconde nelle righe della lista. Il principiante deve dedurre cosa non va da un avviso generale.

Evidenza: [creazione della coppia](../src/settings-tab.ts#L417), [salvataggio dei campi](../src/settings-tab.ts#L610), [errore della riga](../src/settings-tab.ts#L638), [contenitore nascosto](../styles.css#L82).

Raccomandazione: usare una bozza locale, validarla e attivarla al salvataggio. Gli errori devono apparire accanto ai campi e aggiornarsi durante la compilazione. Una bozza incompleta non deve fermare le coppie già valide.

### 4. La documentazione non offre un primo esempio affidabile

Priorità P1. Chiavi e parsing YAML verificati. Confidenza alta. Sforzo S, rischio basso.

L'esempio principale usa `father` e `child`, mentre i preset inglesi contengono chiavi come `Child of` e `Parent of`. La differenza non è solo nelle maiuscole. Quel caso richiede una coppia personalizzata che il testo non chiede di creare. Con Obsidian in italiano, anche i preset inglesi sono disabilitati inizialmente.

Inoltre `father: [[David Doe]]` è letto dal parser YAML disponibile come un array annidato, non come una stringa wiki link. Lo stesso problema riguarda gli esempi delle liste. Il plugin dichiara di usare stringhe e le sue funzioni ignorano gli elementi non stringa. Non ho verificato le eventuali normalizzazioni specifiche di Obsidian su questo YAML.

Evidenza: [esempio principale](../README.md#L25), [esempi YAML](../README.md#L56), [preset inglesi](../src/locales/en.ts#L150), [lettura delle stringhe](../src/utils.ts#L5).

Raccomandazione: dare un esempio copiabile con link quotati e una coppia esplicitamente configurata, spiegando quale nota creare prima. Mostrare anche come inserire la relazione dalle Proprietà di Obsidian, oltre al YAML.

### 5. Il primo avvio espone manutenzione prima del primo risultato

Priorità P1. Valutazione del percorso sulla base del codice. Confidenza media sull'impatto, alta sull'ordine dei controlli. Sforzo M, rischio medio.

Non esiste un passaggio di benvenuto o una prova guidata. La sincronizzazione automatica parte attiva. In impostazioni, l'utente incontra log, annullamento, reset e operazioni globali prima di scegliere la coppia che userà. La cautela descritta nel README non è un passaggio del prodotto.

Evidenza: [default attivo](../src/types.ts#L21), [caricamento](../src/main.ts#L12), [ordine delle impostazioni](../src/settings-tab.ts#L242).

Raccomandazione: per le nuove installazioni partire in pausa e proporre una coppia, due note esistenti e una prova sulla nota corrente. Attivare l'automatismo dopo che l'utente ha visto l'effetto. Conservare lo stato scelto dagli utenti esistenti durante un aggiornamento.

### 6. Lingua dell'interfaccia e schema delle note sono accoppiati

Priorità P1. Conteggi e regole verificati. Confidenza alta sul comportamento, media sulla frequenza della confusione. Sforzo M, rischio medio.

La prima configurazione carica 525 righe di tutte le lingue. In italiano ne mostra 125 e ne abilita 117; in inglese ne mostra 135 e ne abilita 127. Il conteggio principale dice quante coppie sono mostrate, non quante funzionano. Ci sono inoltre coppie espresse due volte nelle direzioni opposte, benché il motore registri già entrambe le direzioni.

La lingua di Obsidian determina quali chiavi sono abilitate inizialmente e quali vengono mostrate. Un utente con interfaccia italiana e proprietà inglesi può cercare una relazione valida e non trovarla nella vista iniziale. Cambiare la lingua dell'interfaccia non converte le impostazioni salvate.

Evidenza: [preset e filtro](../src/locales/index.ts#L104), [conteggio](../src/settings-tab.ts#L508), [mappa bidirezionale](../src/relation-map.ts#L10), [impostazioni persistenti](../src/main.ts#L98).

Raccomandazione: separare "lingua dell'interfaccia" da "nomi delle proprietà nelle mie note". Presentare prima le coppie attive e un piccolo catalogo importabile. Contare attive, disattivate e in conflitto; rappresentare una coppia bidirezionale una volta sola.

### 7. Le relazioni preesistenti e le destinazioni mancanti non hanno un recupero chiaro

Priorità P1. Comportamento delle relazioni preesistenti verificato nel motore; mancato recupero delle destinazioni dedotto dai gestori. Confidenza alta. Sforzo M, rischio medio.

All'avvio il motore fotografa le proprietà esistenti. Una relazione che era già presente non è un'aggiunta, quindi una modifica del solo corpo non crea l'inverso. L'utente che installa il plugin su note già collegate deve ricorrere alla sincronizzazione globale, oggi affetta dal problema 1.

Se la destinazione non esiste, l'aggiornamento termina senza una spiegazione. Creare successivamente quella nota non fa riesaminare la relazione della sorgente: manca un recupero dedicato. Il limite "non crea note" è ragionevole; manca il modo di capire e risolvere il caso.

Evidenza: [snapshot](../src/sync-engine.ts#L122), [confronto delle modifiche](../src/sync-engine.ts#L388), [destinazione assente](../src/sync-engine.ts#L572), [eventi registrati](../src/main.ts#L21).

Raccomandazione: offrire "Controlla questa nota" con anteprima, elencare le destinazioni mancanti e permettere di riprovare dopo la loro creazione. Distinguere "nessuna modifica necessaria" da "non posso sincronizzare".

### 8. Il pannello mostra le relazioni, ma non aiuta a iniziare o verificare

Priorità P2. Verificato nel codice. Confidenza alta sul comportamento, media sull'impatto. Sforzo S/M, rischio basso.

Il pannello è raggiungibile dal ribbon, quindi è un punto di ingresso plausibile. Negli stati vuoti si limita a dire che manca frontmatter o che non ci sono relazioni configurate. Non offre un esempio, un collegamento alle impostazioni o un'azione successiva.

Una relazione visualizzata non certifica che l'inverso esista. Anche una destinazione non risolta entra nella lista. Il pannello non segnala inoltre pausa, conflitti o esclusioni e non registra cambiamenti delle impostazioni per aggiornarsi subito.

Evidenza: [eventi e stati vuoti](../src/relation-panel.ts#L35), [raggruppamento](../src/relation-panel.ts#L101).

Raccomandazione: accompagnare ogni stato vuoto con un prossimo passo. Distinguere relazione letta, inverso verificato e destinazione mancante. Rendere visibile lo stato del motore senza trasformare il pannello in un editor completo.

### 9. "Ripristina predefiniti" cambia anche pausa ed esclusioni

Priorità P1. Verificato nel codice. Confidenza alta. Sforzo S, rischio basso.

Il testo e la conferma parlano di sostituire le relazioni. L'azione sostituisce invece l'intero oggetto delle impostazioni con i default: riattiva la sincronizzazione e svuota le esclusioni. Un utente che voleva solo recuperare le coppie può ritrovarsi con scritture automatiche attive anche nelle cartelle che aveva protetto.

Evidenza: [reset completo](../src/settings-tab.ts#L297), [default](../src/types.ts#L21), [conferma italiana](../src/locales/it.ts#L19).

Raccomandazione: limitare il reset alle coppie, conservando pausa ed esclusioni. Un eventuale reset completo deve dichiarare tutte le impostazioni che cambia.

### 10. Anteprima, esito e annullamento non raccontano la stessa operazione

Priorità P1. Verificato nel codice. Confidenza alta. Sforzo M, rischio medio.

Dalle impostazioni si vede una tabella di anteprima, un progresso e il log finale. Dalla palette si vede solo un conteggio prima di applicare, poi una notifica. Sono due percorsi per la stessa operazione con livelli diversi di controllo.

Il conteggio di completamento deriva dalle note con frontmatter scansionate, non dalle note effettivamente modificate. L'annullamento rimane solo in memoria, viene sostituito dal successivo batch con modifiche e non mostra prima del clic quale operazione riguarda. Il pulsante è disponibile anche quando non c'è nulla da annullare. Le azioni del log sono inoltre `added` e `removed` anche in italiano, e il log recente mostra solo il nome finale del file, ambiguo se ci sono omonimi.

Le rinomine sono un limite ulteriore: il relativo gestore aggiorna link in tutti i campi frontmatter, anche fuori dalle coppie configurate, senza registrarli nei batch di annullamento descritti qui.

Evidenza: [percorso palette](../src/main.ts#L128), [percorso impostazioni](../src/settings-tab.ts#L660), [conteggio restituito](../src/sync-engine.ts#L266), [batch e log](../src/sync-engine.ts#L684), [pulsante annullamento](../src/settings-tab.ts#L275), [colonne del log](../src/settings-tab.ts#L80), [rinomine](../src/sync-engine.ts#L158).

Raccomandazione: condividere il flusso di anteprima e risultato. Mostrare note lette, note modificate, modifiche applicate e problemi incontrati separatamente. Prima dell'annullamento mostrare il batch e i suoi limiti, disabilitando l'azione quando indisponibile. Dichiarare e verificare separatamente il comportamento delle rinomine.

## Cosa conserverei

La coppia bidirezionale è un modello semplice quando la si spiega con due note concrete. Riutilizzare le API di Obsidian e intervenire sulle proprietà è una scelta sensata. Anteprima, pausa, esclusioni, log e annullamento sono strumenti utili già presenti. Il primo caricamento evita i conflitti dei preset: va mantenuta questa selezione anche nelle azioni successive.

Non aggiungerei altri preset adesso. La quantità disponibile aumenta il lavoro necessario per capire quali coppie sono attive e quali chiavi scrivere.

## Percorso consigliato

1. Il nuovo utente abilita il plugin e vede che è in pausa.
2. Sceglie una coppia concreta, per esempio `progetto ↔ attività`, o ne crea una validata.
3. Seleziona due note esistenti e vede come compilare la proprietà.
4. Controlla la nota corrente. L'anteprima spiega quale proprietà aggiungerà alla destinazione.
5. Applica la modifica e può aprire subito la nota modificata.
6. Attiva la sincronizzazione automatica. Lo stato effettivo rimane visibile.
7. Le operazioni su tutto il vault, import/export e reset restano disponibili in una sezione successiva.

## Ordine di lavoro suggerito

Prima correggere riconciliazione globale, abilitazione dei preset, reset e gestione delle bozze. I test del motore devono coprire questi casi prima di cambiare il percorso iniziale.

Poi rendere affidabile l'esempio, aggiungere una prova sulla nota corrente e comunicare stato e problemi. Infine semplificare catalogo, log e pannello. Una riprogettazione grafica estesa non è necessaria per risolvere i principali ostacoli.

## Verifiche eseguite e mancanti

- `npm test`: 25 test superati in 5 file.
- `npm run lint`: superato.
- `tsc --noEmit --skipLibCheck`: superato.
- Build separata del codice attuale per il vault temporaneo: completata, senza sovrascrivere `main.js` nel repository.
- Riproduzione in memoria: oscillazione globale su due passaggi, blocco da coppia vuota, conflitti abilitando tutti i preset italiani e inglesi, nessuna scrittura automatica per una relazione già fotografata.
- Parsing YAML con `js-yaml` presente nell'ambiente: `father: [[David Doe]]` produce `{"father":[["David Doe"]]}`.
- Evidenza riproducibile locale: `/tmp/relation-sync-usability-20261008/reproduce.cjs` e relativi bundle. Sono artefatti temporanei, non una suite di regressione del progetto.
- Mancano test del percorso UI, prova completa in Obsidian, accessibilità e feedback di nuovi utenti. La suite esistente non dimostra la riuscita del primo utilizzo: il file di test del motore copre attualmente un solo caso di rinomina con destinazione esclusa.
