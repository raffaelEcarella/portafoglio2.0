loadState();

if (appState.ui.darkMode) document.body.classList.add("dark");

const loginDiv = document.getElementById("login");
const appDiv = document.getElementById("app");

function login(pin) {
  if (pin === "AUTOOF") resetAll();

  if (!appState.security.pin) {
    appState.security.pin = pin;
    saveState();
    enterApp();
    return;
  }

  if (pin === appState.security.pin) {
    appState.security.attempts = 0;
    saveState();
    enterApp();
  } else {
    appState.security.attempts++;
    document.getElementById("loginMsg").textContent =
      appState.security.attempts >= 3
        ? "Troppi tentativi. Usa AUTOOF."
        : "PIN errato";
  }
}

function enterApp() {
  loginDiv.hidden = true;
  appDiv.hidden = false;
  showPage(appState.ui.currentPage || "home");
}

document.getElementById("loginBtn").onclick = () =>
  login(document.getElementById("pinInput").value.trim());

document.getElementById("pinInput").addEventListener("keydown", e => {
  if (e.key === "Enter")
    login(document.getElementById("pinInput").value.trim());
});
