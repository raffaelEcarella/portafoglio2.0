// CC99 - app.js Portafoglio 2.0

loadState();

// --- UTILI ---
function getWalletById(id){
  return appState.finance.wallets.find(w => w.id === parseInt(id));
}

function updateSaldo() {
  const saldo = appState.finance.wallets.reduce((acc, w)=>{
    return acc + w.movimenti.reduce((s,m)=> m.tipo==="entrata"?s+m.importo:s-m.importo,0);
  },0);
  document.getElementById("saldoVal").textContent = `€${saldo.toFixed(2)}`;
  renderWallets();
  saveState();
}

// --- RENDER PORTAFOGLI ---
function renderWallets(){
  const container = document.getElementById("walletsList");
  container.innerHTML="";
  appState.finance.wallets.forEach(w=>{
    const li=document.createElement("li");
    li.textContent=`${w.name} - €${w.movimenti.reduce((s,m)=> m.tipo==="entrata"?s+m.importo:s-m.importo,0).toFixed(2)}`;
    li.style.color=w.color;
    container.appendChild(li);
  });

  // aggiorna select filtri e modal
  const filterWallet = document.getElementById("filterWallet");
  const calendarioWallet = document.getElementById("calendarioWallet");
  const movWallet = document.getElementById("movWallet");
  [filterWallet, calendarioWallet, movWallet].forEach(sel=>{
    sel.innerHTML="";
    appState.finance.wallets.forEach(w=>{
      const opt=document.createElement("option");
      opt.value=w.id;
      opt.textContent=w.name;
      sel.appendChild(opt);
    });
  });
}

// --- MODAL MOVIMENTO ---
function openMovimentoModal(tipo){
  document.getElementById("modalTitle").textContent = tipo==="entrata"?"Aggiungi Entrata":"Aggiungi Spesa";
  document.getElementById("movTipo").value=tipo;
  document.getElementById("movDescrizione").value="";
  document.getElementById("movImporto").value="";
  document.getElementById("movCategoria").value="";
  document.getElementById("movData").valueAsDate = new Date();
  document.getElementById("movRicorrenza").value=0;
  document.getElementById("movimentoModal").style.display="flex";
}

document.getElementById("addEntrataBtn").onclick = ()=>openMovimentoModal("entrata");
document.getElementById("addSpesaBtn").onclick = ()=>openMovimentoModal("spesa");
document.getElementById("cancelMovimentoBtn").onclick = ()=>document.getElementById("movimentoModal").style.display="none";

// --- SALVA MOVIMENTO ---
document.getElementById("saveMovimentoBtn").onclick = ()=>{
  const walletId = parseInt(document.getElementById("movWallet").value);
  const wallet = getWalletById(walletId);
  if(!wallet) return alert("Portafoglio non trovato");

  const mov = {
    tipo: document.getElementById("movTipo").value,
    descrizione: document.getElementById("movDescrizione").value,
    importo: parseFloat(document.getElementById("movImporto").value),
    categoria: document.getElementById("movCategoria").value,
    data: document.getElementById("movData").value,
  };

  wallet.movimenti.push(mov);

  // gestisci ricorrenza solo per spese
  const ricorrenza = parseInt(document.getElementById("movRicorrenza").value);
  if(mov.tipo==="spesa" && ricorrenza>0){
    const d = new Date(mov.data);
    for(let i=1;i<=ricorrenza;i++){
      const newDate = new Date(d);
      newDate.setMonth(d.getMonth()+i);
      wallet.movimenti.push({...mov, data: newDate.toISOString().slice(0,10)});
    }
  }

  document.getElementById("movimentoModal").style.display="none";
  updateSaldo();
};

// --- MODAL PORTAFOGLIO ---
document.getElementById("addWalletBtn").onclick = ()=>{
  if(appState.finance.wallets.length>=6) return alert("Massimo 6 portafogli");
  document.getElementById("walletName").value="";
  document.getElementById("walletColor").value="#007bff";
  document.getElementById("walletModal").style.display="flex";
};

document.getElementById("cancelWalletBtn").onclick = ()=>document.getElementById("walletModal").style.display="none";

document.getElementById("saveWalletBtn").onclick = ()=>{
  const name = document.getElementById("walletName").value.trim();
  const color = document.getElementById("walletColor").value;
  if(!name) return alert("Nome portafoglio richiesto");

  const newWallet = {
    id: Date.now(),
    name: name,
    color: color,
    movimenti: [],
    includeInCharts:true
  };

  appState.finance.wallets.push(newWallet);
  document.getElementById("walletModal").style.display="none";
  renderWallets();
  updateSaldo();
};

// --- SALDO GIORNALIERO ---
function saldoGiornaliero(wallet){
  const oggi = new Date().toISOString().slice(0,10);
  return wallet.movimenti.reduce((s,m)=> m.data<=oggi ? (m.tipo==="entrata"?s+m.importo:s-m.importo):s ,0);
}

// --- FILTRI MOVIMENTI ---
document.getElementById("applyFiltersBtn").onclick = ()=>{
  const walletId = parseInt(document.getElementById("filterWallet").value);
  const wallet = getWalletById(walletId);
  const cat = document.getElementById("filterCategoria").value.toLowerCase();
  const da = document.getElementById("filterDa").value;
  const a = document.getElementById("filterA").value;

  const list = wallet.movimenti.filter(m=>{
    return (!cat || m.categoria.toLowerCase().includes(cat)) &&
           (!da || m.data>=da) &&
           (!a || m.data<=a);
  });

  const ul = document.getElementById("movimentiList");
  ul.innerHTML="";
  list.forEach(m=>{
    const li=document.createElement("li");
    li.textContent = `${m.data} | ${m.tipo.toUpperCase()} | ${m.descrizione} | €${m.importo.toFixed(2)}`;
    li.style.color = m.tipo==="entrata"?appState.ui.chartColors.entrate:appState.ui.chartColors.spese;
    ul.appendChild(li);
  });
};

document.getElementById("clearFiltersBtn").onclick = ()=>{
  document.getElementById("filterCategoria").value="";
  document.getElementById("filterDa").value="";
  document.getElementById("filterA").value="";
  document.getElementById("applyFiltersBtn").click();
};

// --- CALENDARIO ---
document.getElementById("calendarioWallet").onchange = renderCalendario;
document.getElementById("calendarioMonth").onchange = renderCalendario;

function renderCalendario(){
  const walletId = parseInt(document.getElementById("calendarioWallet").value);
  const wallet = getWalletById(walletId);
  const month = document.getElementById("calendarioMonth").value; // YYYY-MM
  if(!wallet || !month) return;
  const [y,m] = month.split("-");

  const tbody = document.querySelector("#calendarioTable tbody");
  tbody.innerHTML="";
  const daysInMonth = new Date(y, m, 0).getDate();
  for(let d=1;d<=daysInMonth;d++){
    const day = `${y}-${m.padStart(2,"0")}-${d.toString().padStart(2,"0")}`;
    const entrate = wallet.movimenti.filter(m=>m.tipo==="entrata" && m.data===day).reduce((s,m)=>s+m.importo,0);
    const spese = wallet.movimenti.filter(m=>m.tipo==="spesa" && m.data===day).reduce((s,m)=>s+m.importo,0);
    const tr = document.createElement("tr");
    tr.innerHTML=`<td>${day}</td><td style="color:${appState.ui.chartColors.entrate}">€${entrate.toFixed(2)}</td><td style="color:${appState.ui.chartColors.spese}">€${spese.toFixed(2)}</td>`;
    tbody.appendChild(tr);
  }
}

// --- INIZIALIZZAZIONE ---
renderWallets();
updateSaldo();
