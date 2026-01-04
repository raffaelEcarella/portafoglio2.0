// CC99 - app.js
loadState();

function updateSaldi(){
  let cumulativo = 0;

  appState.finance.wallets.forEach(w=>{
    w.saldo = w.movimenti.reduce(
      (acc,m)=> m.tipo==="entrata" ? acc+m.importo : acc-m.importo
    ,0);
    cumulativo += w.saldo;
  });

  document.getElementById("saldoVal").textContent = `€${cumulativo.toFixed(2)}`;
  saveState();
  renderWallets();
}

function renderWallets(){
  const c = document.getElementById("walletsContainer");
  c.innerHTML = "";

  appState.finance.wallets.forEach(w=>{
    const d = document.createElement("div");
    d.className = "wallet-card";
    d.style.backgroundColor = w.color;
    d.innerHTML = `<strong>${w.name}</strong><span>€${w.saldo.toFixed(2)}</span>`;
    c.appendChild(d);
  });
}

document.getElementById("addWalletBtn").onclick = ()=>{
  const name = prompt("Nome portafoglio:");
  if(!name) return;

  appState.finance.wallets.push({
    id: Date.now(),
    name,
    color: "#2563eb",
    movimenti: [],
    includeInCharts: true
  });

  updateSaldi();
};

updateSaldi();
