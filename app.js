// CC99 - app.js
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
  renderGrafici();
  renderTraguardi();
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
  const categoria = document.getElementById("movCategoria").value || "Generale";
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
      categoria,
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
  document.getElementById("movCategoria").value="";
  document.getElementById("movRicorrenza").value=0;
}

// --- ADD PORTAFOGLIO ---
document.getElementById("addWalletBtn").onclick = ()=>{
  if(appState.finance.wallets.length>=6) return alert("Massimo 6 portafogli");
  const name = prompt("Nome nuovo portafoglio:");
  if(!name) return;
  const color = prompt("Colore (hex) per il portafoglio:", "#007bff");
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
  populateCategoriaFilter();
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

function populateCategoriaFilter(){
  const sel = document.getElementById("filterCategoriaMovimenti");
  sel.innerHTML = "<option value=''>Tutte</option>";
  const categorie = new Set();
  appState.finance.wallets.forEach(w=>{
    w.movimenti.forEach(m=>categorie.add(m.categoria));
  });
  categorie.forEach(c=>{
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  });
}

// --- CALENDARIO ---
function renderCalendario(filterWallet, da, a){
  const tbody = document.querySelector("#calendarioTable tbody");
  tbody.innerHTML="";
  let movimenti = appState.finance.wallets.flatMap(w=>w.movimenti.map(m=>({...m,wallet:w.name})));
  if(filterWallet) movimenti = movimenti.filter(m=>m.wallet==filterWallet);
  if(da) movimenti = movimenti.filter(m=>new Date(m.data)>=new Date(da));
  if(a) movimenti = movimenti.filter(m=>new Date(m.data)<=new Date(a));
  movimenti.sort((x,y)=>new Date(x.data)-new Date(y.data));

  movimenti.forEach(m=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${m.data}</td><td>${m.tipo==='entrata'?m.importo:"-"}</td><td>${m.tipo==='spesa'?m.importo:"-"}</td>`;
    tbody.appendChild(tr);
  });
}

// --- TRAGUARDI ---
function renderTraguardi(){
  const container = document.getElementById("traguardiList");
  container.innerHTML = "";
  if(!appState.finance.traguardo) return;
  const cumulative = appState.finance.wallets.reduce((acc,w)=>acc + w.saldo,0);
  const li = document.createElement("li");
  li.textContent = `Traguardo: €${appState.finance.traguardo} | Saldo attuale: €${cumulative.toFixed(2)} | ${((cumulative/appState.finance.traguardo)*100).toFixed(1)}% completato`;
  container.appendChild(li);
}

// --- INIT ---
updateSaldi();
populateWalletFilter();
populateCategoriaFilter();
