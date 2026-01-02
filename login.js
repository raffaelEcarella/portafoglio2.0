loadState();

// SE GIÀ AUTENTICATO → VAI ALL'APP
if (appState.security.authenticated === true) {
  location.replace("app.html");
}

const pinInput = document.getElementById("pinInput");
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("loginMsg");

loginBtn.addEventListener("click", handleLogin);
pinInput.addEventListener("keydown", e => {
  if (e.key === "Enter") handleLogin();
});

function handleLogin() {
  const pin = pinInput.value.trim();
  if (!pin) return;

  // RESET TOTALE
  if (pin === "AUTOOF") {
    localStorage.clear();
    location.reload();
    return;
  }

  // PRIMO ACCESSO → CREA PIN
  if (!appState.security.pin) {
    appState.security.pin = pin;
    appState.security.authenticated = true;
    appState.security.attempts = 0;
    saveState();
    location.replace("app.html");
    return;
  }

  // LOGIN NORMALE
  if (pin === appState.security.pin) {
    appState.security.authenticated = true;
    appState.security.attempts = 0;
    saveState();
    location.replace("app.html");
  } else {
    appState.security.attempts++;
    saveState();
    loginMsg.textContent =
      appState.security.attempts >= 3
        ? "Troppi tentativi. Usa AUTOOF"
        : "PIN errato";
  }
}
