// CC99 - Gestione salvataggio e caricamento dello stato

function saveState() {
  localStorage.setItem("portafoglio2_state", JSON.stringify(appState));
}

function loadState() {
  const data = localStorage.getItem("portafoglio2_state");
  if (data) {
    Object.assign(appState, JSON.parse(data));
  }
}
