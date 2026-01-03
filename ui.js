// CC99 - ui.js Portafoglio 2.0

// ---------------- NAVIGAZIONE ----------------
document.querySelectorAll("[data-page]").forEach(btn=>{
    btn.onclick = () => showPage(btn.dataset.page);
});

document.querySelectorAll(".homeBtn").forEach(btn=>{
    btn.onclick = () => showPage("menu");
});

function showPage(page){
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    const s = document.getElementById(page);
    if(s) s.classList.add("active");

    // Aggiornamenti specifici per pagina
    if(page==="grafici") renderGrafici();
    if(page==="movimenti") renderMovimenti();
    if(page==="calendario") renderCalendario();
    if(page==="saldo") updateSaldo();
}

// ---------------- MODAL ----------------
const modal = document.getElementById("movimentoModal");
window.onclick = function(event){
    if(event.target === modal){
        modal.style.display = "none";
    }
}

// ---------------- BUTTONS ----------------
// Aggiungi Entrata/Spesa
document.getElementById("addEntrataBtn").onclick = ()=>addMovimento("entrata");
document.getElementById("addSpesaBtn").onclick = ()=>addMovimento("spesa");

// Salva/Annulla movimento gestiti in app.js

// Aggiungi Portafoglio
document.getElementById("addWalletBtn").onclick = addWallet;
document.getElementById("addWalletBtnSettings").onclick = addWallet;

// ---------------- DARK MODE ----------------
document.getElementById("darkToggle").onclick = toggleDarkMode;
document.getElementById("darkToggle2").onclick = toggleDarkMode;

function toggleDarkMode(){
    document.body.classList.toggle("dark");
    appState.ui.darkMode = document.body.classList.contains("dark");
    saveState();
}

// ---------------- COLORI GRAFICI ----------------
document.getElementById("colorEntrate").onchange = e=>{
    appState.ui.chartColors.entrate = e.target.value;
    saveState();
    renderGrafici();
};
document.getElementById("colorSpese").onchange = e=>{
    appState.ui.chartColors.spese = e.target.value;
    saveState();
    renderGrafici();
};
document.getElementById("colorTraguardo").onchange = e=>{
    appState.ui.chartColors.traguardo = e.target.value;
    saveState();
    renderGrafici();
};
document.getElementById("colorSaldo").onchange = e=>{
    appState.ui.chartColors.saldo = e.target.value;
    saveState();
    renderGrafici();
};

// ---------------- FILTRI MOVIMENTI ----------------
document.getElementById("applyFiltersBtn").onclick = renderMovimenti;
document.getElementById("clearFiltersBtn").onclick = ()=>{
    document.getElementById("filterCategoria").value="";
    document.getElementById("filterDa").value="";
    document.getElementById("filterA").value="";
    document.getElementById("filterWallet").value="0";
    renderMovimenti();
};

// ---------------- CALENDARIO ----------------
document.getElementById("calendarioWallet").onchange = renderCalendario;
document.getElementById("calendarioMonth").onchange = renderCalendario;

// ---------------- INIZIALIZZAZIONE ----------------
showPage("menu");
