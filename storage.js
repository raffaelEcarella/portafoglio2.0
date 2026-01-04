function salvaMovimenti() {
    localStorage.setItem("movimenti", JSON.stringify(appState.movimenti));
}

function caricaMovimenti() {
    const mov = JSON.parse(localStorage.getItem("movimenti") || "[]");
    appState.movimenti = mov;
}

function salvaSettings() {
    localStorage.setItem("darkMode", JSON.stringify(appState.darkMode));
}

function caricaSettings() {
    const dm = JSON.parse(localStorage.getItem("darkMode") || "false");
    appState.darkMode = dm;
    document.body.classList.toggle("darkmode", dm);
}

// Carica tutto all'avvio
document.addEventListener("DOMContentLoaded", () => {
    caricaMovimenti();
    caricaSettings();
});
