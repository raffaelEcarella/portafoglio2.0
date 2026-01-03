function saveState() {
  localStorage.setItem("portafoglio2", JSON.stringify(appState));
}

function loadState() {
  const data = localStorage.getItem("portafoglio2");
  if (data) Object.assign(appState, JSON.parse(data));
}
