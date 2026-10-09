# Modifiche dopo il report sul primo utilizzo

Queste note descrivono le modifiche preparate per la versione `1.3.0`. Il report originale descrive il commit `249eb6a` e resta una fotografia dello stato precedente.

## Implementato

- Interfaccia e cataloghi solo inglesi e italiani, indipendenti dalla lingua delle proprietà.
- Sinonimi su entrambi i lati delle coppie e inversi neutri. I sinonimi già presenti non vengono duplicati; un nuovo collegamento non viene inserito sotto un sinonimo che potrebbe attribuire un genere sbagliato.
- Tutte le vecchie proprietà dei predefiniti inglesi e italiani restano riconosciute. Le forme con `of` e `di` mantengono la direzione del ruolo della nota di origine.
- Migrazione dei predefiniti, rimozione delle altre lingue dalle impostazioni e conservazione di coppie personalizzate, stato automatico ed esclusioni. La migrazione non modifica note.
- Sincronizzazione globale conservativa e idempotente, con anteprima comune a impostazioni e comandi.
- Anteprima della nota corrente e segnalazioni di destinazioni mancanti, escluse, non Markdown o con valori inversi non supportati.
- Nuove installazioni in pausa, esempio su due note, bozze validate prima del salvataggio e abilitazioni dei predefiniti che rispettano i conflitti.
- Reset limitato alle coppie; anteprima dell'annullamento con controllo del batch; log localizzati con percorsi completi e conteggi delle scritture applicate.
- Rinomine limitate ai campi configurati, snapshot indipendenti dalle liste della cache, gestione delle modifiche accodate e dei target creati successivamente.
- Pannello con stato effettivo, verifica degli inversi e azioni per configurazione e anteprima.
- Guide inglese e italiana aggiornate, controlli più leggibili e adattamento della pagina delle impostazioni a larghezze ridotte.

## Verifica

- 74 test superati in 6 file.
- Lint e build di produzione superati.
- Controllo isolato del bundle di produzione: caricamento, avvio in pausa, registrazione dei comandi italiani e scaricamento del plugin superati. È un controllo con API simulate, non una prova nel vero host.
- `git diff --check` superato.

## Limiti ancora da verificare

La cattura del vero host Obsidian ha continuato a mostrare una schermata nera dopo l'apertura del vault temporaneo. La resa visiva e il percorso completo dentro Obsidian non sono quindi verificati. Non è dimostrato che il problema della cattura sia causato dal plugin.

L'annullamento rimane una cronologia di collegamenti in memoria, non un ripristino completo dei documenti. Le rinomine sono fuori dal batch annullabile. I nomi italiani ambigui come `nipote` richiedono proprietà esplicite; nessun genere o grado di parentela viene dedotto dai nomi o dal contenuto delle note.
