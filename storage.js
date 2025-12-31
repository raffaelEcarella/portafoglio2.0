function saveState() {
  localStorage.setItem("cassa2026", JSON.stringify(appState));
}

function loadState() {
  const data = localStorage.getItem("cassa2026");
  if (data) {
    const parsed = JSON.parse(data);
    Object.assign(appState, parsed);
  }
}

function resetAll() {
  localStorage.clear();
  location.reload();
}
