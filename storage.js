function saveState() {
  localStorage.setItem("pf2", JSON.stringify(appState));
}
function loadState() {
  const d = localStorage.getItem("pf2");
  if (d) Object.assign(appState, JSON.parse(d));
}
