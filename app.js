// CC99 - app.js v0.95

loadState();

// --- UTILITY ---
function generateId(){ return Date.now() + Math.floor(Math.random()*1000); }
function todayStr(){ 
  const d = new Date(); 
  return d.toISOString().split('T')[0]; 
}

// --- AGGIORNA SALDI ---
function updateSaldos(){
  appState.finance.wallets.forEach(wallet=>{
    let saldo = 0;
    wallet.movimenti.forEach(m=>{
      const date = new Date(m.data);
      const now = new Date(todayStr());
      if(date <= now){
        saldo += (m.tipo==="entrata"?1:-1) * m.importo;
      }
    });
    wallet.saldo = saldo;
  });
  renderHomeWallets();
  saveState();
}

// --- RENDER HOME PORTAFOGLI ---
function renderHomeWallets(){
  const container = document.getElementById("homeWallets");
  if(!container) return;
  container.innerHTML = "";
  appState.finance.wallets.forEach(wallet=>{
    const div = document.createElement("div");
    div.className="card center-card wallet-card";
    div.innerHTML = `
      <h3 style="color:${wallet.color}">${wallet.name}</h3>
      <p>Saldo: €${wallet.saldo || 0}</p>
      <button onclick="showWalletMovimenti(${wallet.id})">Vedi Movimenti</button>
    `;
    container.appendChild(div);
  });
}

// --- MOSTRA MOVIMENTI DI UN PORTAFOGLIO ---
function showWalletMovimenti(walletId){
  const wallet = appState.finance.wallets.find(w=>w.id===walletId);
  if(!wallet) return;
  showPage("movimenti");
  renderMovimentiList(wallet.movimenti);
}

// --- RENDER LISTA MOVIMENTI ---
function renderMovimentiList(movimenti){
  const list = document.getElementById("movimentiList");
  if(!list) return;
  list.innerHTML = "";
  movimenti.forEach(m=>{
    const li = document.createElement("li");
    li.textContent = `${m.data} | ${m.tipo.toUpperCase()} | €${m.importo} | ${m.descrizione}`;
    list.appendChild(li);
  });
}

// --- AGGIUNGI MOVIMENTO ---
function addMovimento(walletId, tipo){
  const wallet = appState.finance.wallets.find(w=>w.id===walletId);
  if(!wallet) return;

  const descrizione = prompt("Descrizione:");
  let importo = parseFloat(prompt("Importo:"));
  if(isNaN(importo) || importo<=0) return alert("Importo non valido");
  const data = prompt("Data (YYYY-MM-DD):", todayStr());
  if(!data) return alert("Data non valida");

  let ricorrenza = 0;
  if(tipo==="spesa") ricorrenza = parseInt(prompt("Ricorrenza mesi (0 se nessuna):", "0")) || 0;

  wallet.movimenti.push({id:generateId(), descrizione, importo, tipo, data, ricorrenza});
  
  // aggiungi movimenti ricorrenti
  for(let i=1;i<=ricorrenza;i++){
    const nextDate = new Date(data);
    nextDate.setMonth(nextDate.getMonth()+i);
    wallet.movimenti.push({
      id:generateId(),
      descrizione,
      importo,
      tipo,
      data: nextDate.toISOString().split('T')[0],
      ricorrenza:0
    });
  }
  updateSaldos();
  saveState();
}

// --- GRAFICI ---
let chartCategorie=null;
let chartSaldo=null;

function renderGrafici(){
  const walletsToInclude = appState.finance.wallets.filter(w=>w.includeInCharts);
  const entrate = walletsToInclude.reduce((a,w)=>a + w.movimenti.filter(m=>m.tipo==="entrata").reduce((x,m)=>x+m.importo,0),0);
  const spese = walletsToInclude.reduce((a,w)=>a + w.movimenti.filter(m=>m.tipo==="spesa").reduce((x,m)=>x+m.importo,0),0);
  const traguardo = appState.finance.traguardo;

  // grafico categorie
  const ctx1 = document.getElementById("graficoCategorie")?.getContext("2d");
  if(!ctx1) return;
  if(chartCategorie) chartCategorie.destroy();
  chartCategorie = new Chart(ctx1,{
    type:'doughnut',
    data:{
      labels:['Entrate','Spese','Traguardo'],
      datasets:[{data:[entrate,spese,traguardo], backgroundColor:[
        appState.ui.chartColors.entrate,
        appState.ui.chartColors.spese,
        appState.ui.chartColors.traguardo
      ]}]
    },
    options:{
      responsive:true,
      plugins:{
        legend:{display:true, position:'bottom'},
        tooltip:{callbacks:{label:ctx=>`${ctx.label}: €${ctx.raw} (${((ctx.raw/(entrate+spese+traguardo))*100).toFixed(1)}%)`}}}
    }
  });

  // grafico saldo progressivo
  const allMovimenti = walletsToInclude.flatMap(w=>w.movimenti).sort((a,b)=>new Date(a.data)-new Date(b.data));
  const saldoCumulativo = [];
  let cum=0;
  allMovimenti.forEach(m=>{
    cum += (m.tipo==="entrata"?1:-1)*m.importo;
    saldoCumulativo.push({x:m.data,y:cum});
  });

  const ctx2 = document.getElementById("graficoSaldo")?.getContext("2d");
  if(!ctx2) return;
  if(chartSaldo) chartSaldo.destroy();
  chartSaldo = new Chart(ctx2,{
    type:'line',
    data:{
      datasets:[{
        label:'Saldo Progressivo',
        data:saldoCumulativo,
        borderColor: appState.ui.chartColors.saldo,
        backgroundColor: 'rgba(0,123,255,0.2)',
        fill:true
      }]
    },
    options:{
      responsive:true,
      scales:{
        x:{type:'time', time:{unit:'day'}, title:{display:true,text:'Data'}},
        y:{title:{display:true,text:'Saldo'}}
      }
    }
  });
}

// --- CALENDARIO ---
function renderCalendario(mese=null, walletId=null){
  const tableBody = document.querySelector("#calendarioTable tbody");
  if(!tableBody) return;
  tableBody.innerHTML = "";
  
  const dateRef = mese ? new Date(mese+"-01") : new Date();
  const year = dateRef.getFullYear();
  const month = dateRef.getMonth();
  const daysInMonth = new Date(year, month+1, 0).getDate();

  const wallets = walletId ? [appState.finance.wallets.find(w=>w.id===walletId)] : appState.finance.wallets;

  for(let d=1; d<=daysInMonth; d++){
    const dayStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    let entrate=0, spese=0;
    wallets.forEach(w=>{
      w.movimenti.forEach(m=>{
        if(m.data===dayStr){
          if(m.tipo==="entrata") entrate+=m.importo;
          else spese+=m.importo;
        }
      });
    });
    const tr = document.createElement("tr");
    tr.innerHTML=`<td>${dayStr}</td><td>€${entrate}</td><td>€${spese}</td>`;
    tableBody.appendChild(tr);
  }
}

// --- INIZIALIZZAZIONE ---
document.addEventListener("DOMContentLoaded",()=>{
  updateSaldos();
  renderGrafici();
  renderCalendario();
});
