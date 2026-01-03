// CC99 - ui.js Portafoglio 2.0

// --- MODALI MOVIMENTO ---
const movimentoModal = document.getElementById("movimentoModal");
const modalTitle = document.getElementById("modalTitle");
const movDescrizione = document.getElementById("movDescrizione");
const movImporto = document.getElementById("movImporto");
const movTipo = document.getElementById("movTipo");
const movCategoria = document.getElementById("movCategoria");
const movData = document.getElementById("movData");
const movRicorrenza = document.getElementById("movRicorrenza");
const saveMovimentoBtn = document.getElementById("saveMovimentoBtn");
const cancelMovimentoBtn = document.getElementById("cancelMovimentoBtn");

// --- APRI MODALE ---
function openMovimentoModal(tipo){
  modalTitle.textContent = tipo === "entrata" ? "Aggiungi Entrata" : "Aggiungi Spesa";
  movTipo.value = tipo;
  movDescrizione.value = "";
  movImporto.value = "";
  movCategoria.value = "";
  movData.value = new Date().toISOString().split("T")[0];
  movRicorrenza.value = 0;
  movimentoModal.style.display = "flex";
}

// --- CHIUDI MODALE ---
cancelMovimentoBtn.onclick = ()=>{movimentoModal.style.display="none";}

// --- SALVA MOVIMENTO ---
saveMovimentoBtn.onclick = ()=>{
  const tipo = movTipo.value;
  const descrizione = movDescrizione.value;
  const importo = parseFloat(movImporto.value);
  const categoria = movCategoria.value;
  const data = movData.value;
  const ricorrenza = parseInt(movRicorrenza.value);

  if(!descrizione || !importo || !data){
    alert("Compila tutti i campi richiesti!");
    return;
  }

  // selezione portafoglio
  const wallets = appState.finance.wallets;
  if(wallets.length === 0){
    alert("Crea prima un portafoglio!");
    return;
  }
  const walletId = parseInt(prompt(`Seleziona portafoglio:\n${wallets.map(w=>w.id + ": " + w.name).join("\n")}`));
  const wallet = wallets.find(w=>w.id===walletId);
  if(!wallet){ alert("Portafoglio non valido!"); return; }

  const mov = {descrizione, importo, tipo, categoria, data, ricorrenza};
  wallet.movimenti.push(mov);

  // gestione ricorrenza
  if(tipo==="spesa" && ricorrenza>0){
    let d = new Date(data);
    for(let i=1;i<=ricorrenza;i++){
      d.setMonth(d.getMonth()+1);
      wallet.movimenti.push({
        descrizione: descrizione + " (ricorrenza)",
        importo,
        tipo,
        categoria,
        data: d.toISOString().split("T")[0],
        ricorrenza:0
      });
    }
  }

  movimentoModal.style.display="none";
  saveState();
  updateSaldo();
  renderMovimenti();
  renderCalendario(document.getElementById("calendarioMonth").value, parseInt(document.getElementById("calendarioWallet").value));
}

// --- NAVIGAZIONE ---
document.querySelectorAll("[data-page]").forEach(btn=>{
  btn.onclick = ()=> showPage(btn.dataset.page);
});
document.querySelectorAll(".homeBtn").forEach(btn=>{
  btn.onclick = ()=> showPage("menu");
});

// --- MOSTRA PAGINA ---
function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const s = document.getElementById(page);
  if(s) s.classList.add("active");
  if(page==="grafici") renderGrafici();
}

// --- DARK MODE ---
document.getElementById("darkToggle").onclick = toggleDarkMode;
document.getElementById("darkToggle2").onclick = toggleDarkMode;

function toggleDarkMode(){
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
}

// --- COLORI GRAFICI ---
document.getElementById("colorEntrate").onchange = e=>{appState.ui.chartColors.entrate=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorSpese").onchange = e=>{appState.ui.chartColors.spese=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorTraguardo").onchange = e=>{appState.ui.chartColors.traguardo=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorSaldo").onchange = e=>{appState.ui.chartColors.saldo=e.target.value; saveState(); renderGrafici();}

// --- FILTRI MOVIMENTI ---
document.getElementById("applyFiltersBtn").onclick = renderMovimenti;
document.getElementById("clearFiltersBtn").onclick = ()=>{
  document.getElementById("filterCategoria").value="";
  document.getElementById("filterDa").value="";
  document.getElementById("filterA").value="";
  document.getElementById("filterWallet").value="0";
  renderMovimenti();
}

// --- CALENDARIO FILTRI ---
document.getElementById("calendarioMonth").onchange = ()=>{
  const walletId = parseInt(document.getElementById("calendarioWallet").value);
  renderCalendario(document.getElementById("calendarioMonth").value, walletId);
}
document.getElementById("calendarioWallet").onchange = ()=>{
  const walletId = parseInt(document.getElementById("calendarioWallet").value);
  renderCalendario(document.getElementById("calendarioMonth").value, walletId);
}

// --- AGGIUNGI ENTRATA E SPESA ---
document.getElementById("addEntrataBtn").onclick = ()=> openMovimentoModal("entrata");
document.getElementById("addSpesaBtn").onclick = ()=> openMovimentoModal("spesa");
