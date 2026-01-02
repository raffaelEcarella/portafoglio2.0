function saveState() {
  localStorage.setItem("cassa2026", JSON.stringify(appState));
}

function loadState() {
  const data = localStorage.getItem("cassa2026");
  if (data) Object.assign(appState, JSON.parse(data));
}

function resetAll() {
  localStorage.removeItem("cassa2026");

  appState.security = { pin: null, attempts: 0, authenticated: false };
  appState.ui = { currentPage: "home", darkMode: false };
  appState.finance.movimenti = [];

  document.body.classList.remove("dark");
  showPage("home");
  showLogin();
  saveState();
}
