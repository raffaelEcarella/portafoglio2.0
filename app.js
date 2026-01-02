loadState();

const loginScreen = document.getElementById("login");
const appScreen = document.getElementById("app");
const pinInput = document.getElementById("pinInput");
const loginMsg = document.getElementById("loginMsg");
const loginBtn = document.getElementById("loginBtn");
const resetBtn = document.getElementById("resetBtn");
const darkToggle = document.getElementById("darkToggle");
const changePinBtn = document.getElementById("changePinBtn");
const togglePinBtn = document.getElementById("togglePin");

// Mostra/nascondi PIN
togglePinBtn.addEventListener("click", () => {
  if (pinInput.type === "password") pinInput.type = "text";
  else pinInput.type = "password";
});

// LOGIN
function handleLogin() {
  const pin = pinInput.value.trim();
  if (!pin) return;

  if (pin === "AUTOOF") { resetAll(); return; }

  if (!appState.security.pin) {
    appState.security.pin = pin;
    appState.security.authenticated = true;
    saveState();
    showApp();
    return;
  }

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

loginBtn.addEventListener("click", handleLogin);
pinInput.addEventListener("keydown", e => { if (e.key === "Enter") handleLogin(); });

// NAVIGAZIONE
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => showPage(btn.dataset.page));
});

// DARK MODE
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
});

// RESET
resetBtn.addEventListener("click", resetAll);

// CAMBIA PIN
changePinBtn.addEventListener("click", () => {
  const newPin = prompt("Inserisci il nuovo PIN:");
  if (!newPin) return alert("PIN non valido!");
  const confirmPin = prompt("Conferma il nuovo PIN:");
  if (newPin !== confirmPin) return alert("PIN non corrisponde!");
  appState.security.pin = newPin;
  appState.security.attempts = 0;
  saveState();
  alert("PIN aggiornato con successo!");
});

// AVVIO
if (appState.security.authenticated) showApp();
else showLogin();

if (appState.ui.darkMode) document.body.classList.add("dark");
