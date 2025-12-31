loadState();

const loginScreen = document.getElementById("login");
const appScreen = document.getElementById("app");
const pinInput = document.getElementById("pinInput");
const loginMsg = document.getElementById("loginMsg");
const loginBtn = document.getElementById("loginBtn");

// Ripristina dark mode
if (appState.ui.darkMode) {
  document.body.classList.add("dark");
}

// VISIBILITÀ
function showLogin() {
  loginScreen.classList.add("active");
  appScreen.classList.remove("active");
}

function showApp() {
  loginScreen.classList.remove("active");
  appScreen.classList.add("active");
  showPage(appState.ui.currentPage || "home");
}

// LOGIN
function handleLogin() {
  const pin = pinInput.value.trim();
  if (!pin) return;

  if (pin === "AUTOOF") {
    resetAll();
    return;
  }

  // Primo accesso
  if (!appState.security.pin) {
    appState.security.pin = pin;
    appState.security.authenticated = true;
    saveState();
    showApp();
    return;
  }

  // Accesso normale
  if (pin === appState.security.pin) {
    appState.security.authenticated = true;
    appState.security.attempts = 0;
    saveState();
    showApp();
  } else {
    appState.security.attempts++;
    saveState();
    loginMsg.textContent =
      appState.security.attempts >= 3
        ? "Troppi tentativi. Usa AUTOOF"
        : "PIN errato";
  }
}

// EVENTI
loginBtn.addEventListener("click", handleLogin);
pinInput.addEventListener("keydown", e => {
  if (e.key === "Enter") handleLogin();
});

// AVVIO
if (appState.security.authenticated) {
  showApp();
} else {
  showLogin();
}
