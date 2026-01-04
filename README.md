Finance Tracker App
Descrizione

Questa è un'applicazione web per la gestione delle finanze personali e dei portafogli multipli.
Include funzionalità di:

Gestione entrate e spese

Filtri per portafogli e categorie

Grafici professionali con Chart.js (saldo progressivo e categorie)

Design moderno “bank-friendly” (blu, grigio, verde)

Modalità Dark/Light

Salvataggio automatico dei dati in localStorage

Progressive Web App (PWA) pronta all’uso

Struttura dei file
/index.html       --> Pagina principale
/app.html         --> Struttura dell'app
/app.js           --> Logica principale
/ui.js            --> Gestione UI (navigazione, dark mode, impostazioni)
/chart.js         --> Grafici Chart.js
/state.js         --> Stato globale dell'app
/storage.js       --> Funzioni di salvataggio/recupero
/style.css        --> Stile moderno e professionale
/sw.js            --> Service worker PWA
/manifest.json    --> Manifest PWA

Installazione e Avvio

Scarica tutti i file nella stessa cartella.

Apri il file index.html con un browser moderno (Chrome, Edge, Firefox).

Se vuoi usare la modalità PWA:

Servi l’app via localhost (es. con Live Server in VSCode) per testare il service worker.

Clicca su “Installa app” dal browser.

Funzionalità
1. Portafogli

Aggiungi, modifica o elimina portafogli multipli

Ogni portafoglio mostra saldo attuale e totale entrate/uscite

Selezione portafogli da includere nei grafici

2. Movimenti

Aggiungi entrate o uscite con data, importo, categoria e descrizione

Bottoni Entrata/Spesa chiaramente identificati

Possibilità di filtrare movimenti per portafoglio o data

3. Grafici

Saldo progressivo: line chart con andamento totale dei portafogli inclusi

Categorie: doughnut chart con somma entrate/uscite per categoria

Grafici aggiornati in tempo reale ad ogni movimento

4. Dark Mode

Toggle nella toolbar in basso

Salvataggio preferenza nel localStorage

Colori e Design

Palette: Blu (#0d3b66, #3f88c5), Verde (#2a9d8f), Grigio (#f5f7fa)

Stile moderno, professionale, “bank-friendly”

Responsive e mobile-friendly

Animazioni morbide su hover e click

Dipendenze

Chart.js
 (incluso via CDN nel index.html)

Nessuna libreria esterna aggiuntiva richiesta

Suggerimenti per l’uso

Aggiungi sempre la data corretta ai movimenti per avere grafici precisi

Usa categorie coerenti per vedere il doughnut chart dettagliato

Puoi salvare il backup dei dati copiando il localStorage o esportando lo stato JSON

Debug & Manutenzione

Apri console del browser per vedere eventuali errori

Tutti i dati sono salvati in localStorage sotto la chiave appState

Per resettare l’app, cancella i dati del localStorage
