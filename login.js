loadState();

const pinInput = document.getElementById("pinInput");
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("loginMsg");

loginBtn.onclick = login;
pinInput.onkeydown = e => e.key === "Enter" && login();

function login() {
  const pin = pinInput.value.trim();
  if (!pin) return;

  if (pin === "AUTOOF") {
    localStorage.clear();
    location.reload();
    return;
  }

  if (!appState.security.pin) {
    appState.security.pin = pin;
    appState.security.authenticated = true;
    saveState();
    location.href = "app.html";
    return;
  }

  if (pin === appState.security.pin) {
    appState.security.authenticated = true;
    saveState();
    location.href = "app.html";
  } else {
    loginMsg.textContent = "PIN errato";
  }
}
