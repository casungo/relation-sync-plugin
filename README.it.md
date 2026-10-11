# Relation Sync per Obsidian

Relation Sync mantiene i collegamenti inversi tra le proprietà delle note. Colleghi una persona al suo genitore e il plugin aggiunge il figlio nella nota del genitore. Modifica solo il frontmatter, conserva il corpo delle note e non crea destinazioni mancanti.

Interfaccia e predefiniti sono disponibili in **italiano e inglese**. Le proprietà di entrambe le lingue funzionano indipendentemente dalla lingua di Obsidian. Nelle nuove installazioni la sincronizzazione automatica parte in pausa.

## Prima prova

1. Crea due note Markdown, `Luca` e `Maria`.
2. In Luca aggiungi una proprietà `madre` che contiene `[[Maria]]`. Nell'editor Proprietà di Obsidian inserisci il link come testo o elemento di lista. Se scrivi YAML, usa le virgolette:

   ```yaml
   ---
   madre: "[[Maria]]"
   ---
   ```

3. Apri **Impostazioni → Relation Sync → Anteprima nota corrente**, oppure il comando omonimo. Controlla le modifiche proposte e le eventuali destinazioni mancanti o escluse.
4. Applica. Nella nota di Maria comparirà:

   ```yaml
   ---
   figli: "[[Luca]]"
   ---
   ```

5. Verifica il risultato e attiva **Sincronizzazione automatica** per le modifiche successive. Per collegamenti già presenti, o aggiunti durante la pausa, usa l'anteprima manuale.

Prima di un'operazione estesa, fai un backup o versiona il vault. **Strumenti del vault e predefiniti → Sincronizza l'intero vault** completa gli inversi mancanti e conserva le relazioni esistenti. Ripetere l'operazione senza modificare le note non produce nuove scritture.

## Nomi e sinonimi

I nomi semplici delle proprietà indicano il ruolo della **persona collegata**. `madre` nella nota di Luca indica la madre di Luca. Il plugin riconosce i sinonimi, ma non deduce il genere della persona dalla proprietà o dal nome della nota.

| Proprietà inserita | Inverso aggiunto nella destinazione |
| --- | --- |
| `genitore`, `genitori`, `madre`, `mamma`, `padre`, `papà`, `papa`, `babbo` | `figli` |
| `figli`, `figlio`, `figlia`, `figlie` | `genitore` |
| `fratello`, `sorella`, `fratelli`, `sorelle` | `fratelli e sorelle` |
| `moglie`, `marito` | `coniuge` |
| `nonno`, `nonna` | `nipoti di nonni` |
| `zio`, `zia` | `nipoti di zii` |
| `mother`, `mom`, `mum`, `father`, `dad` | `child` |
| `son`, `daughter`, `children` | `parent` |

I plurali come `figli` sono nomi di proprietà collettive. Non attribuiscono un genere alla nota collegata.

Se Luca ha già `mamma: "[[Maria]]"`, aggiungere Luca ai `figli` di Maria non crea una proprietà `genitore` duplicata su Luca. Per un nuovo collegamento il plugin usa il nome neutro principale. Se Luca ha già una madre e viene aggiunto un altro genitore, il nuovo collegamento va in `genitore`, senza inserirlo nel campo `madre`.

Le vecchie frasi con `di` descrivono invece il ruolo della **persona della nota**. `Figlio di` punta a un genitore; `Madre di` punta a un figlio. Queste forme restano riconosciute come sinonimi nella direzione corretta.

`Nipote` è ambiguo. Usa `nipoti di nonni` o `nipoti di zii`. La vecchia forma `Nipote di` mantiene la direzione verso i nonni; il plugin non sceglie una parentela leggendo il contenuto delle note.

## Coppie personalizzate

Con **Aggiungi coppia** definisci la proprietà di origine, l'inverso e gli eventuali sinonimi separati da virgole. Ogni coppia funziona in entrambe le direzioni: non serve aggiungerla due volte. Per una relazione simmetrica puoi usare lo stesso nome sui due lati.

La coppia resta una bozza fino al salvataggio. I campi incompleti non fermano le relazioni attive. L'editor segnala i conflitti prima di salvare. Anche importazioni e abilitazioni controllano i nomi e i sinonimi; un predefinito incompatibile con una coppia personalizzata non viene attivato.

## Liste e modifiche

Puoi usare un valore singolo o una lista. In YAML quota ogni link:

```yaml
---
genitore:
  - "[[Persone/Maria]]"
  - "[[Marco|Papà]]"
---
```

Il plugin conserva le proprietà estranee e gli elementi non testuali delle liste. Durante la sincronizzazione automatica, rimuovere o cambiare una destinazione aggiorna l'inverso. Cambiare `madre` in `mamma` senza cambiare la destinazione mantiene il collegamento.

Le esclusioni valgono per origine e destinazione. Le destinazioni devono essere note Markdown esistenti. Se crei successivamente una destinazione mancante, il plugin riprova quando la nota viene indicizzata e l'automatismo è attivo. Puoi sempre usare l'anteprima della nota corrente per riprovare manualmente.

## Controllo e annullamento

Il pannello **Relazioni** mostra la nota corrente, lo stato del plugin e gli inversi presenti o mancanti. Segnala anche destinazioni mancanti ed escluse e offre l'accesso alle impostazioni e all'anteprima.

Il **Log sincronizzazione recente** contiene fino a 200 modifiche della sessione corrente, con percorsi completi. **Annulla ultima sincronizzazione** mostra prima le modifiche inverse da applicare. Una successiva sincronizzazione con modifiche sostituisce il gruppo annullabile. Riavviare Obsidian o disattivare il plugin cancella questa cronologia in memoria.

L'annullamento inverte i collegamenti registrati dal plugin. Non è un backup o una cronologia completa delle note. Le rinomine non sono incluse. Il gestore di rinomina del plugin modifica solo le proprietà configurate; Obsidian può aggiornare separatamente altri collegamenti secondo le proprie impostazioni.

Il ripristino dei predefiniti sostituisce solo le coppie. Conserva la pausa e i percorsi esclusi e non elimina proprietà dalle note.

## Aggiornamento dai vecchi predefiniti

Le vecchie coppie integrate vengono sostituite dal catalogo italiano e inglese. I predefiniti delle altre lingue vengono rimossi dalle impostazioni. Le coppie personalizzate, lo stato della sincronizzazione e le esclusioni restano; la migrazione non riscrive le note.

Un gruppo nuovo viene abilitato quando erano abilitate le sue vecchie proprietà. I sinonimi ora condividono un interruttore. Controlla le coppie dopo l'avviso di migrazione. Una coppia modificata che non corrisponde più a un vecchio predefinito resta personalizzata, anche se è scritta in un'altra lingua.

## Accesso alle note e agli appunti

Relation Sync enumera le note Markdown per rilevare le relazioni, preparare l'anteprima dell'intero vault e aggiornare i link dopo una rinomina. Le esclusioni limitano le note elaborate dal motore. Il plugin modifica il frontmatter tramite le API di Obsidian, dopo i controlli di sincronizzazione e anteprima previsti.

Il pulsante di copia del report scrive il report negli appunti. Il plugin non legge mai gli appunti e non effettua richieste di rete.

Per installazione, sviluppo e segnalazioni consulta il [README inglese](README.md).

Prima di pubblicare, segui i [controlli per la review](docs/review-readiness.md). `npm run check` richiede zero warning ESLint, zero vulnerabilità note nelle dipendenze, test riusciti, metadati coerenti e build riproducibile. Il workflow verifica attestazioni e asset scaricati dalla bozza prima di pubblicare. La scansione completa va provata anche dal portale Obsidian con **Review branch**.
