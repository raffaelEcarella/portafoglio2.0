// CC99 - Gestione UI, navigazione e eventi

// --- NAVIGAZIONE ---
document.querySelectorAll("[data-page]").forEach(btn=>{
  btn.onclick=()=>showPage(btn.dataset.page);
});
document.querySelectorAll(".homeBtn").forEach(btn=>{
  btn.onclick=()=>showPage("menu");
});

function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const s=document.getElementById(page);
  if(s) s.classList.add("active");
  if(page==="grafici") renderGrafici();
  if(page==="saldo") updateSaldo();
}

// --- DARK MODE ---
document.getElementById("darkToggle").onclick = toggleDarkMode;
document.getElementById("darkToggle2").onclick = toggleDarkMode;

function toggleDarkMode(){
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
}

// --- EVENTI PORTAFOGLIO ---
document.getElementById("addWalletBtn").onclick = addWallet;

// --- EVENTI MOVIMENTO ---
document.getElementById("addIncomeBtn").onclick = ()=>{
  openMovimentoModal("entrata");
};
document.getElementById("addExpenseBtn").onclick = ()=>{
  openMovimentoModal("spesa");
};

document.getElementById("saveMovimentoBtn").onclick = ()=>{
  const mov = {
    walletId: parseInt(document.getElementById("movWallet").value),
    descrizione: document.getElementById("movDescrizione").value,
    importo: parseFloat(document.getElementById("movImporto").value),
    tipo: document.getElementById("movTipo").value,
    categoria: document.getElementById("movCategoria").value,
    data: document.getElementById("movData").value,
    ricorrenza: parseInt(document.getElementById("movRicorrenza").value) || 0
  };
  addMovimento(mov);
  closeMovimentoModal();
};

document.getElementById("cancelMovimentoBtn").onclick = closeMovimentoModal;

function openMovimentoModal(tipo){
  document.getElementById("movimentoModal").style.display="flex";
  document.getElementById("movTipo").value = tipo;
  document.getElementById("modalTitle").textContent = tipo==="entrata"?"Aggiungi Entrata":"Aggiungi Spesa";
  renderWalletSelects();
}

function closeMovimentoModal(){
  document.getElementById("movimentoModal").style.display="none";
  // reset campi
  document.getElementById("movDescrizione").value="";
  document.getElementById("movImporto").value="";
  document.getElementById("movCategoria").value="";
  document.getElementById("movData").value="";
  document.getElementById("movRicorrenza").value=0;
}

// --- FILTRI MOVIMENTI ---
document.getElementById("applyFiltersBtn").onclick = ()=>{
  const filter = {
    wallet: document.getElementById("filterWallet").value,
    categoria: document.getElementById("filterCategoria").value,
    da: document.getElementById("filterDa").value,
    a: document.getElementById("filterA").value
  };
  renderMovimenti(filter);
};

document.getElementById("clearFiltersBtn").onclick = ()=>{
  document.getElementById("filterCategoria").value="";
  document.getElementById("filterDa").value="";
  document.getElementById("filterA").value="";
  document.getElementById("filterWallet").value="all";
  renderMovimenti();
};

// --- CALENDARIO ---
document.getElementById("calendarWallet").onchange = renderCalendar;
document.getElementById("calendarMonth").onchange = renderCalendar;

// --- COLORI GRAFICI ---
document.getElementById("colorEntrate").onchange = e=>{
  appState.ui.chartColors.entrate=e.target.value;
  saveState();
  renderGrafici();
};
document.getElementById("colorSpese").onchange = e=>{
  appState.ui.chartColors.spese=e.target.value;
  saveState();
  renderGrafici();
};
document.getElementById("colorTraguardo").onchange = e=>{
  appState.ui.chartColors.traguardo=e.target.value;
  saveState();
  renderGrafici();
};
document.getElementById("colorSaldo").onchange = e=>{
  appState.ui.chartColors.saldo=e.target.value;
  saveState();
  renderGrafici();
};
