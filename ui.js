// Mostra una pagina
function showPage(page) {
  document.querySelectorAll(".page").forEach(p =>
    p.classList.remove("active")
  );

  const section = document.getElementById(page);
  if (section) {
    section.classList.add("active");
    document.getElementById("headerTitle").textContent =
      page.charAt(0).toUpperCase() + page.slice(1);
  }

  appState.ui.currentPage = page;
  saveState();
}

// Navigazione
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    showPage(btn.dataset.page);
  });
});

// Dark mode
document.getElementById("darkToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
});

// RESET TOTALE (FIX DEFINITIVO LOGIN BLOCCATA)
function resetAll() {
  // 1. Cancella storage
  localStorage.removeItem("cassa2026_state");

  // 2. Reset stato in memoria
  appState.security.authenticated = false;
  appState.security.attempts = 0;

  appState.ui.currentPage = "home";
  appState.ui.darkMode = false;

  appState.finance.movimenti = [];

  // 3. Reset UI
  document.body.classList.remove("dark");
  showPage("home");

  // 4. Torna alla login
  document.getEl
