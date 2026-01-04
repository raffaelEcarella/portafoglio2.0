// CC99 - app.js Portafoglio 2.0
loadState();

// --- UTILITY ---
function getWalletById(id){
  return appState.finance.wallets.find(w => w.id === parseInt(id));
}

// --- AGGIORNAMENTO SALDI ---
function updateSaldi(){
  let cumulative = 0;
  appState.finance.wallets.forEach(w=>{
    let saldo = w.movimenti.reduce((acc,m)=> m.tipo==="entrata"?acc+m.importo:acc-m.importo,0);
    w.saldo = saldo;
    cumulative += saldo;
  });
  document.getElementById("saldoVal").textContent = `€${cumulative.toFixed(2)}`;
  saveState();
  renderWallets();
  renderCharts(); // usa chart.js
}

// --- RENDER WALLETS ---
function renderWallets(){
  const container = document.getElementById("walletsContainer");
  container.innerHTML = "";
  appState.finance.wallets.forEach(w=>{
    const div = document.createElement("div");
    div.className = "wallet-card";
    div.style.backgroundColor = w.color;
    div.innerHTML = `<h3>${w.name}</h3><div>€${(w.saldo||0).toFixed(2)}</div>`;
    container.appendChild(div);
  });
}

// --- MODALE MOVIMENTO ---
function openMovimentoModal(tipo){
  const modal = document.getElementById("movimentoModal");
  modal.style.display = "flex";
  document.getElementById("movTipo").value = tipo;
  populateWalletSelect();
}

function populateWalletSelect(){
  const sel = document.getElementById("movWalletSelect");
  sel.innerHTML="";
  appState.finance.wallets.forEach(w=>{
    const opt = document.createElement("option");
    opt.value = w.id;
    opt.textContent = w.name;
    sel.appendChild(opt);
  });
}

// --- SALVA MOVIMENTO ---
document.getElementById("saveMovimentoBtn").onclick = ()=>{
  const walletId = parseInt(document.getElementById("movWalletSelect").value);
  const descrizione = document.getElementById("movDescrizione").value;
  const importo = parseFloat(document.getElementById("movImporto").value);
  const tipo = document.getElementById("movTipo").value;
  const data = document.getElementById("movData").value;
  const ricorrenza = parseInt(document.getElementById("movRicorrenza").value) || 0;

  const wallet = getWalletById(walletId);
  if(!wallet) return;

  for(let i=0;i<=ricorrenza;i++){
    const d = new Date(data);
    d.setMonth(d.getMonth()+i);
    wallet.movimenti.push({
      descrizione,
      importo,
      tipo,
      data: d.toISOString().split('T')[0]
    });
  }

  updateSaldi();
  closeMovimentoModal();
};

document.getElementById("cancelMovimentoBtn").onclick = closeMovimentoModal;
function closeMovimentoModal(){
  document.getElementById("movimentoModal").style.display="none";
  document.getElementById("movDescrizione").value="";
  document.getElementById("movImporto").value="";
  document.getElementById("movRicorrenza").value=0;
}

// --- ADD PORTAFOGLIO ---
document.getElementById("addWalletBtn").onclick = ()=>{
  if(appState.finance.wallets.length>=6) return alert("Massimo 6 portafogli");
  const name = prompt("Nome nuovo portafoglio:");
  if(!name) return;
  const color = prompt("Colore (hex) per il portafoglio:", "#0d47a1"); // blu default
  const newWallet = {
    id: Date.now(),
    name,
    color,
    movimenti: [],
    includeInCharts:true
  };
  appState.finance.wallets.push(newWallet);
  saveState();
  renderWallets();
  populateWalletSelect();
  populateWalletFilter();
};

// --- FILTRI ---
function populateWalletFilter(){
  const selMov = document.getElementById("filterWalletMovimenti");
  const selCal = document.getElementById("filterWalletCalendario");
  [selMov, selCal].forEach(sel=>{
    sel.innerHTML="";
    appState.finance.wallets.forEach(w=>{
      const opt = document.createElement("option");
      opt.value = w.id;
      opt.textContent = w.name;
      sel.appendChild(opt);
    });
  });
}

// --- INIT ---
updateSaldi();
populateWalletFilter();
