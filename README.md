# Finanze 2026

App di gestione finanze personale moderna e compatibile PWA.

## Funzionalità

- Home con saldo e riepilogo movimenti
- Gestione movimenti (entrate/uscite)
- Grafici dinamici con Chart.js
- Impostazioni (modalità scura)
- Salvataggio locale tramite LocalStorage
- PWA con service worker

## Struttura dei file

- `index.html` → Home
- `movements.html` → Movimenti
- `charts.html` → Grafici
- `settings.html` → Impostazioni
- `style.css` → Stile app
- `app.js` → Logica movimenti e dark mode
- `chart.js` → Gestione grafici Chart.js
- `state.js` → Stato globale
- `storage.js` → Wrapper localStorage
- `sw.js` → Service Worker
- `manifest.json` → Manifest PWA
- `ui.js` → Funzioni UI extra

## Installazione

1. Aprire il progetto in un server locale (es. VSCode Live Server)
2. Aprire `index.html`
3. Aggiungere movimenti e visualizzare grafici
4. Abilitare modalità scura dalle impostazioni
