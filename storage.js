function saveState() {
  localStorage.setItem("cassa2026", JSON.stringify(appState));
}

function loadState() {
  const data = localStorage.getItem("cassa2026");
  if (data) Object.assign(appState, JSON.parse(data));
}

function resetAll() {
  localStorage.clear();
  location.reload();
}
