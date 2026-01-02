function saveState() {
  localStorage.setItem("cassa2026", JSON.stringify(appState));
}

function loadState() {
  const data = localStorage.getItem("cassa2026");
  if (data) Object.assign(appState, JSON.parse(data));
}

function resetAll() {
  // Rimuove dal localStorage
  localStorage.removeItem("cassa2026");

  // Reset stato in memoria
  appState.security = { pin: null, attempts: 0, authenticated: false };
  appState.ui = { currentPage: "home", darkMode: false };
  appState.finance = { movimenti: [] };

  // Reset UI
  document.body.classList.remove("dark");
  showLogin();
  showPage("home");

  saveState();
}
