document.addEventListener("DOMContentLoaded", () => {
    // Inizializza UI
    renderMovimenti();
    initGrafico();
    initNav();
    initModal();
    initSettings();
});

// Aggiungi Movimento
function aggiungiMovimento(movimento) {
    appState.movimenti.push(movimento);
    salvaMovimenti();
    renderMovimenti();
    aggiornaGrafico();
}

// Submit form movimento
document.getElementById("form-movimento").addEventListener("submit", (e) => {
    e.preventDefault();
    const desc = document.getElementById("movimento-desc").value;
    const importo = parseFloat(document.getElementById("movimento-importo").value);
    const tipo = document.getElementById("movimento-tipo").value;

    aggiungiMovimento({ desc, importo, tipo, data: new Date().toISOString() });
    chiudiModal();
});

// Bottone apri modale
document.getElementById("btn-add-movimento").addEventListener("click", apriModal);
