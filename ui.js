// --- NAVIGAZIONE TRA LE PAGINE ---
document.querySelectorAll("[data-page]").forEach(btn => {
  btn.onclick = () => showPage(btn.dataset.page);
});

function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const s = document.getElementById(page);
  if (s) s.classList.add("active");

  if (page === "grafici") renderGrafici();
  if (page === "movimenti") renderMovimenti();
  if (page === "saldo") updateSaldoDisplay();
  if (page === "calendario") renderCalendario();
}

// --- DARK MODE ---
document.getElementById("darkToggle").onclick = toggleDarkMode;
document.getElementById("darkToggle2").onclick = toggleDarkMode;

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
}

// --- MODALI ---
const movimentoModal = document.getElementById("movimentoModal");
const walletModal = document.getElementById("walletModal");

document.getElementById("addIncomeBtn").onclick = () => openMovimentoModal("entrata");
document.getElementById("addExpenseBtn").onclick = () => openMovimentoModal("spesa");
document.getElementById("addWalletBtn").onclick = () => {
  walletModal.style.display = "flex";
};

document.getElementById("cancelMovimentoBtn").onclick = () => { movimentoModal.style.display = "none"; };
document.getElementById("cancelWalletBtn").onclick = () => { walletModal.style.display = "none"; };

function openMovimentoModal(tipo) {
  document.getElementById("modalTitle").textContent = tipo === "entrata" ? "Aggiungi Entrata" : "Aggiungi Spesa";
  document.getElementById("movTipo").value = tipo;
  document.getElementById("movRicorrenza").parentElement.style.display = tipo === "spesa" ? "block" : "none";
  populateWalletSelect("movWallet");
  movimentoModal.style.display = "flex";
}

// --- AGGIUNGI PORTAFOGLIO ---
document.getElementById("saveWalletBtn").onclick = () => {
  const name = document.getElementById("walletName").value.trim();
  const color = document.getElementById("walletColor").value;
  if (!name) return alert("Inserisci il nome del portafoglio");
  if (appState.finance.wallets.length >= 6) return alert("Puoi avere massimo 6 portafogli");
  const id = Date.now();
  appState.finance.wallets.push({id, name, color, movimenti: [], includeInCharts: true});
  saveState();
  walletModal.style.display = "none";
  renderWallets();
};

// --- AGGIUNGI MOVIMENTO ---
document.getElementById("saveMovimentoBtn").onclick = () => {
  const walletId = parseInt(document.getElementById("movWallet").value);
  const descr = document.getElementById("movDescrizione").value;
  const importo = parseFloat(document.getElementById("movImporto").value);
  const tipo = document.getElementById("movTipo").value;
  const categoria = document.getElementById("movCategoria").value;
  const data = document.getElementById("movData").value;
  const ricorrenza = parseInt(document.getElementById("movRicorrenza").value) || 0;

  if(!walletId || !descr || isNaN(importo) || !data) return alert("Compila tutti i campi obbligatori");

  const wallet = appState.finance.wallets.find(w => w.id === walletId);
  if(!wallet) return alert("Portafoglio non trovato");

  wallet.movimenti.push({descrizione: descr, importo, tipo, categoria, data});
  // aggiungi ricorrenza se spesa
  for(let i=1; i<=ricorrenza; i++){
    const d = new Date(data);
    d.setMonth(d.getMonth()+i);
    wallet.movimenti.push({descrizione: descr, importo, tipo, categoria, data: d.toISOString().slice(0,10)});
  }
  saveState();
  movimentoModal.style.display = "none";
  updateSaldoDisplay();
  renderMovimenti();
  renderGrafici();
  renderCalendario();
};

// --- RENDER WALLETS HOME ---
function renderWallets() {
  const container = document.getElementById("walletsContainer");
  container.innerHTML = "";
  appState.finance.wallets.forEach(w => {
    const div = document.createElement("div");
    div.className = "wallet-card";
    div.style.borderLeft = `6px solid ${w.color}`;
    const saldo = w.movimenti.reduce((acc,m)=> m.tipo==="entrata"? acc+m.importo : acc-m.importo,0);
    div.innerHTML = `<strong>${w.name}</strong> - €${saldo.toFixed(2)}`;
    container.appendChild(div);
  });
}

// --- POPOLA SELECT PORTAFOGLI ---
function populateWalletSelect(selectId) {
  const sel = document.getElementById(selectId);
  sel.innerHTML = "";
  appState.finance.wallets.forEach(w => {
    const option = document.createElement("option");
    option.value = w.id;
    option.textContent = w.name;
    sel.appendChild(option);
  });
}

// --- SALDO ---
function updateSaldoDisplay() {
  const totale = appState.finance.wallets.reduce((acc,w)=>{
    const saldo = w.movimenti.reduce((a,m)=> m.tipo==="entrata"? a+m.importo : a-m.importo,0);
    return acc+saldo;
  },0);
  document.getElementById("saldoVal").textContent = `€${totale.toFixed(2)}`;
}

// --- MOVIMENTI ---
function renderMovimenti() {
  const lista = document.getElementById("movimentiList");
  lista.innerHTML = "";
  const walletId = parseInt(document.getElementById("filterWallet")?.value) || null;
  appState.finance.wallets.forEach(w => {
    if(walletId && w.id !== walletId) return;
    w.movimenti.forEach(m=>{
      const li = document.createElement("li");
      li.textContent = `[${w.name}] ${m.data} - ${m.tipo.toUpperCase()}: €${m.importo} - ${m.descrizione}`;
      lista.appendChild(li);
    });
  });
}

// --- CALENDARIO ---
function renderCalendario() {
  const walletId = parseInt(document.getElementById("calendarWallet")?.value) || null;
  const month = document.getElementById("calendarMonth")?.value;
  const tbody = document.querySelector("#calendarioTable tbody");
  tbody.innerHTML = "";

  const [year, monthNum] = month ? month.split("-").map(Number) : [new Date().getFullYear(), new Date().getMonth()+1];
  const daysInMonth = new Date(year, monthNum, 0).getDate();

  for(let d=1; d<=daysInMonth; d++){
    const dateStr = `${year}-${String(monthNum).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    let entrate=0, spese=0;
    appState.finance.wallets.forEach(w => {
      if(walletId && w.id !== walletId) return;
      w.movimenti.forEach(m=>{
        if(m.data === dateStr){
          if(m.tipo==="entrata") entrate+=m.importo;
          else spese+=m.importo;
        }
      });
    });
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${dateStr}</td><td>€${entrate.toFixed(2)}</td><td>€${spese.toFixed(2)}</td>`;
    tbody.appendChild(tr);
  }
}

// --- GRAFICI ---
let chartCategorie = null;
let chartSaldo = null;

function renderGrafici() {
  const entrate = appState.finance.wallets.reduce((acc,w)=>{
    if(!w.includeInCharts) return acc;
    return acc + w.movimenti.filter(m=>m.tipo==="entrata").reduce((a,b)=>a+b.importo,0);
  },0);
  const spese = appState.finance.wallets.reduce((acc,w)=>{
    if(!w.includeInCharts) return acc;
    return acc + w.movimenti.filter(m=>m.tipo==="spesa").reduce((a,b)=>a+b.importo,0);
  },0);
  const traguardo = appState.finance.traguardo;

  // Grafico Categorie
  const ctx1 = document.getElementById("graficoCategorie").getContext("2d");
  if(chartCategorie) chartCategorie.destroy();
  chartCategorie = new Chart(ctx1,{
    type:'doughnut',
    data:{
      labels:['Entrate','Spese','Traguardo'],
      datasets:[{
        data:[entrate,spese,traguardo],
        backgroundColor:[
          appState.ui.chartColors.entrate,
          appState.ui.chartColors.spese,
          appState.ui.chartColors.traguardo
        ]
      }]
    },
    options:{
      responsive:true,
      plugins:{
        legend:{display:true, position:'bottom'},
        tooltip:{callbacks:{label:ctx=>`${ctx.label}: €${ctx.raw} (${((ctx.raw/(entrate+spese+traguardo))*100).toFixed(1)}%)`}}
      }
    }
  });

  // Grafico Saldo
  const ctx2 = document.getElementById("graficoSaldo").getContext("2d");
  if(chartSaldo) chartSaldo.destroy();
  const labels = [];
  const dataSaldo = [];
  const today = new Date();
  appState.finance.wallets.forEach(w=>{
    if(!w.includeInCharts) return;
    w.movimenti.forEach(m=>{
      const date = new Date(m.data);
      if(date <= today){
        labels.push(m.data);
        dataSaldo.push(m.tipo==="entrata"? m.importo : -m.importo);
      }
    });
  });
  chartSaldo = new Chart(ctx2,{
    type:'bar',
    data:{
      labels: labels,
      datasets:[{
        label:'Saldo',
        data: dataSaldo,
        backgroundColor: appState.ui.chartColors.saldo
      }]
    },
    options:{
      responsive:true,
      plugins:{
        legend:{display:true},
        tooltip:{callbacks:{label:ctx=>`€${ctx.raw}`}}
      },
      scales:{x:{title:{display:true,text:'Data'}},y:{title:{display:true,text:'Saldo'}}}
    }
  });
}

// --- POPOLARE SELECT FILTRI ---
function populateFilterWallets() {
  ["filterWallet","calendarWallet"].forEach(id=>{
    const sel = document.getElementById(id);
    sel.innerHTML = "<option value=''>Tutti</option>";
    appState.finance.wallets.forEach(w=>{
      const opt = document.createElement("option");
      opt.value = w.id;
      opt.textContent = w.name;
      sel.appendChild(opt);
    });
  });
}

// --- COLORI GRAFICI ---
document.getElementById("colorEntrate").onchange = e => { appState.ui.chartColors.entrate=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorSpese").onchange = e => { appState.ui.chartColors.spese=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorTraguardo").onchange = e => { appState.ui.chartColors.traguardo=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorSaldo").onchange = e => { appState.ui.chartColors.saldo=e.target.value; saveState(); renderGrafici();}

// --- INIZIALIZZAZIONE ---
window.onload = () => {
  populateWalletSelect("movWallet");
  populateFilterWallets();
  renderWallets();
  updateSaldoDisplay();
};
