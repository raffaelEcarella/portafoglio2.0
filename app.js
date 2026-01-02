loadState();

if (!appState.security.authenticated) {
  location.href = "login.html";
}

document.getElementById("logoutBtn").onclick = () => {
  appState.security.authenticated = false;
  saveState();
  location.href = "login.html";
};
