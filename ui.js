// CC99 - ui.js Portafoglio 2.0 v0.95

// Navigazione pagine
document.querySelectorAll("[data-page]").forEach(btn=>{
  btn.onclick=()=>showPage(btn.dataset.page);
});
document.querySelectorAll(".homeBtn").forEach(btn=> btn.onclick=()=>showPage("home"));

function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const s=document.getElementById(page);
  if(s) s.classList.add("active");
  if(page==="grafici") renderGrafici();
  if(page==="calendario") renderCalendario();
}

// MODAL MOVIMENTO
const movimentoModal=document.getElementById("movimentoModal");
document.getElementById("addEntrataBtn").onclick=()=>openMovimentoModal("entrata");
document.getElementById("addSpesaBtn").onclick=()=>openMovimentoModal("spesa");
document.getElementById("cancelMovimentoBtn").onclick=()=>movimentoModal.style.display="none";
function openMovimentoModal(tipo){
  document.getElementById("movTipo").value=tipo;
  document.getElementById("modalTitle").textContent = tipo=="entrata"?"Aggiungi Entrata":"Aggiungi Spesa";
  movimentoModal.style.display="flex";
  renderWalletSelects();
}

// SALVA MOVIMENTO
document.getElementById("saveMovimentoBtn").onclick=()=>{
  const m={
    walletId: parseInt(document.getElementById("movWallet").value),
    descrizione: document.getElementById("movDescrizione").value,
    importo: parseFloat(document.getElementById("movImporto").value),
    tipo: document.getElementById("movTipo").value,
    categoria: document.getElementById("movCategoria").value,
    data: document.getElementById("movData").value,
    ricorrenza: parseInt(document.getElementById("movRicorrenza").value)
  };
  addMovimento(m);
  movimentoModal.style.display="none";
};

// MODAL PORTAFOGLIO
const walletModal=document.getElementById("walletModal");
document.getElementById("addWalletBtn").onclick=()=>walletModal.style.display="flex";
document.getElementById("cancelWalletBtn").onclick=()=>walletModal.style.display="none";
document.getElementById("saveWalletBtn").onclick=()=>{
  const name=document.getElementById("walletName").value;
  const color=document.getElementById("walletColor").value;
  if(name) addWallet(name,color);
  walletModal.style.display="none";
};

// DARK MODE
document.getElementById("darkToggle").onclick = toggleDarkMode;
document.getElementById("darkToggle2").onclick = toggleDarkMode;
function toggleDarkMode(){
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
}

// COLORI GRAFICI
document.getElementById("colorEntrate").onchange=e=>{appState.ui.chartColors.entrate=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorSpese").onchange=e=>{appState.ui.chartColors.spese=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorTraguardo").onchange=e=>{appState.ui.chartColors.traguardo=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorSaldo").onchange=e=>{appState.ui.chartColors.saldo=e.target.value; saveState(); renderGrafici();}
