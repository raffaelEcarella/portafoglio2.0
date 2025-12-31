// ==== BOOTSTRAP ====
loadState();

const loginDiv = document.getElementById("login");
const appDiv = document.getElementById("app");
const pinInput = document.getElementById("pinInput");
const loginMsg = document.getElementById("loginMsg");

// Ripristina dark mode
if (appState.ui.darkMode) {
  document.body.classList.add("dark");
}

// ==== LOGIN LOGIC ====
function handleLogin() {
  const pin = pinInput.value.trim();

  if (!pin) return;

  // RESET TOTALE
  if (pin === "AUTOOF") {
    resetAll();
    return;
  }

  // PRIMO ACCESSO → imposta PIN
  if (!appState.security.pin) {
    appState.security.pin = pin;
    appState.security.attempts = 0;
    saveState();
    enterApp();
    return;
  }

  // ACCESSO NORMALE
  if (pin === appState.security.pin) {
    appState.security.attempts = 0;
    saveState();
    enterApp();
  } else {
    appState.security.attempts++;
    saveState();

    if (appState.security.attempts >= 3) {
      loginMsg.textContent = "Troppi tentativi. Usa AUTOOF per resettare.";
    } else {
      loginMsg.textContent = "PIN errato";
    }
  }
}

// ==== ENTRATA APP (FIX CHIAVE) ====
function enterApp() {
  // Nasconde COMPLETAMENTE il login
  loginDiv.style.display = "none";

  // Mostra l'app
  appDiv.hidden = false;
  appDiv.style.display = "block";

  // Forza pagina iniziale
  showPage("home");

  // Pulisce input
  pinInput.value = "";
  loginMsg.textContent = "";
}

// ==== EVENTI ====
document.getElementById("loginBtn").addEventListener("click", handleLogin);

pinInput.addEventListener("keydown", e => {
  if (e.key === "Enter") handleLogin();
});

// ==== AUTO LOGIN SE PIN GIÀ PRESENTE ====
if (appState.security.pin) {
  // resta nel login finché non inserisce PIN
  appDiv.hidden = true;
} else {
  // primo avvio: resta nel login per impostare PIN
  appDiv.hidden = true;
}
