// NAVIGAZIONE
document.querySelectorAll("[data-page]").forEach(btn=>{
  btn.onclick=()=>showPage(btn.dataset.page);
});

function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const s=document.getElementById(page);
  if(s) s.classList.add("active");
  if(page==="grafici") renderGrafici();
}

// DARK MODE
document.getElementById("darkToggle").onclick = toggleDarkMode;
document.getElementById("darkToggle2").onclick = toggleDarkMode;
function toggleDarkMode(){
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
}

// COLORI GRAFICI
document.getElementById("colorEntrate").onchange = e=>{
  appState.ui.chartColors.entrate=e.target.value; saveState(); renderGrafici();
};
document.getElementById("colorSpese").onchange = e=>{
  appState.ui.chartColors.spese=e.target.value; saveState(); renderGrafici();
};
document.getElementById("colorTraguardo").onchange = e=>{
  appState.ui.chartColors.traguardo=e.target.value; saveState(); renderGrafici();
};
document.getElementById("colorSaldo").onchange = e=>{
  appState.ui.chartColors.saldo=e.target.value; saveState(); renderGrafici();
};

// AGGIUNGI MOVIMENTO
document.getElementById("addIncomeBtn").onclick = ()=>openMovimentoModal("entrata");
document.getElementById("addExpenseBtn").onclick = ()=>openMovimentoModal("spesa");

function openMovimentoModal(tipo){
  const modal = document.getElementById("movimentoModal");
  modal.style.display="flex";
  document.getElementById("movTipo").value = tipo;
  populateWalletsSelect();
}

function populateWalletsSelect(){
  const sel = document.getElementById("movWallet");
  sel.innerHTML="";
  appState.finance.wallets.forEach(w=>{
    const opt = document.createElement("option");
    opt.value=w.id; opt.textContent=w.name;
    sel.appendChild(opt);
  });
}

// AGGIUNGI PORTAFOGLIO
document.getElementById("addWalletBtn").onclick = ()=>{
  document.getElementById("walletModal").style.display="flex";
};

document.getElementById("saveWalletBtn").onclick = ()=>{
  const name = document.getElementById("walletName").value.trim();
  const color = document.getElementById("walletColor").value;
  if(name && appState.finance.wallets.length<6){
    const id = Date.now();
    appState.finance.wallets.push({id,name,color,movimenti:[],includeInCharts:true});
    saveState();
    document.getElementById("walletModal").style.display="none";
    document.getElementById("walletName").value="";
    renderWalletList();
    updateSaldo();
  }
};

document.getElementById("cancelWalletBtn").onclick = ()=>{
  document.getElementById("walletModal").style.display="none";
};

// LISTA PORTAFOGLI
function renderWalletList(){
  const container = document.getElementById("walletsList");
  container.innerHTML="";
  appState.finance.wallets.forEach(w=>{
    const div = document.createElement("div");
    div.textContent = w.name;
    div.style.color=w.color;
    container.appendChild(div);
  });
}

// CHIUDI MODALI
document.getElementById("cancelMovimentoBtn").onclick = ()=>{
  document.getElementById("movimentoModal").style.display="none";
};
