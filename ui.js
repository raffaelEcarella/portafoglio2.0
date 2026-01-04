// --- WALLET LIST ---
function renderWallets(){
  const container = document.getElementById("walletsContainer");
  if(!container) return;
  container.innerHTML="";
  appState.finance.wallets.forEach(w=>{
    const div = document.createElement("div");
    div.className = "wallet-card";
    div.style.backgroundColor = w.color;
    const saldo = w.movimenti.reduce((acc,m)=> m.tipo==="entrata"?acc+m.importo:acc-m.importo,0);
    w.saldo = saldo;
    div.innerHTML = `<h3>${w.name}</h3><div>€${saldo.toFixed(2)}</div>`;
    container.appendChild(div);
  });
  updateSaldoCumulativo();
}

// --- SALDO CUMULATIVO ---
function updateSaldoCumulativo(){
  const cumulative = appState.finance.wallets.reduce((acc,w)=> acc + (w.saldo||0),0);
  const el = document.getElementById("saldoVal");
  if(el) el.textContent = `€${cumulative.toFixed(2)}`;
}

// --- MODALE MOVIMENTO ---
function openMovimentoModal(tipo){
  const modal = document.getElementById("movimentoModal");
  if(!modal) return;
  modal.style.display="flex";
  document.getElementById("movTipo").value=tipo;
  populateWalletSelect();
}

function populateWalletSelect(){
  const sel = document.getElementById("movWalletSelect");
  if(!sel) return;
  sel.innerHTML="";
  appState.finance.wallets.forEach(w=>{
    const opt = document.createElement("option");
    opt.value=w.id;
    opt.textContent=w.name;
    sel.appendChild(opt);
  });
}

// --- SALVA MOVIMENTO ---
document.getElementById("saveMovimentoBtn").onclick = ()=>{
  const walletId = parseInt(document.getElementById("movWalletSelect").value);
  const wallet = appState.finance.wallets.find(w=>w.id===walletId);
  if(!wallet) return;

  const movimento = {
    descrizione: document.getElementById("movDescrizione").value,
    importo: parseFloat(document.getElementById("movImporto").value),
    tipo: document.getElementById("movTipo").value,
    data: document.getElementById("movData").value
  };
  wallet.movimenti.push(movimento);
  saveState();
  closeMovimentoModal();
  renderWallets();
  renderMovimenti();
  renderGrafici();
};

document.getElementById("cancelMovimentoBtn").onclick = closeMovimentoModal;
function closeMovimentoModal(){
  const modal = document.getElementById("movimentoModal");
  if(!modal) return;
  modal.style.display="none";
  document.getElementById("movDescrizione").value="";
  document.getElementById("movImporto").value="";
}
