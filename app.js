// CC99 - App.js Gestione logica Portafoglio 2.0

loadState();

// --- AGGIUNTA PORTAFOGLIO ---
function addWallet() {
  if(appState.finance.wallets.length>=6){
    alert("Limite massimo di 6 portafogli raggiunto");
    return;
  }
  const name = prompt("Nome nuovo portafoglio:");
  if(!name) return;
  const color = prompt("Colore portafoglio (es. #28a745):","#28a745");
  appState.finance.wallets.push({id:Date.now(),name,color,movimenti:[]});
  saveState();
  renderWalletList();
}

// --- RENDER PORTAFOGLI HOME ---
function renderWalletList(){
  const ul = document.getElementById("walletList");
  ul.innerHTML="";
  appState.finance.wallets.forEach(w=>{
    const li = document.createElement("li");
    li.textContent = `${w.name}: €${getWalletSaldo(w.id)}`;
    li.style.color=w.color;
    ul.appendChild(li);
  });
}

// --- CALCOLO SALDI ---
function getWalletSaldo(walletId){
  const w = appState.finance.wallets.find(w=>w.id===walletId);
  if(!w) return 0;
  return w.movimenti.reduce((acc,m)=> acc + (m.tipo==="entrata"? m.importo:-m.importo),0);
}

function updateSaldo(){
  let total=0;
  appState.finance.wallets.forEach(w=>{
    total+=getWalletSaldo(w.id);
  });
  document.getElementById("saldoVal").textContent = `€${total}`;
  renderWalletList();
  saveState();
}

// --- MOVIMENTI ---
function addMovimento(mov){
  const w = appState.finance.wallets.find(w=>w.id===mov.walletId);
  if(!w) return;
  w.movimenti.push({...mov});
  // gestione ricorrenza
  for(let i=1;i<=mov.ricorrenza;i++){
    const next = new Date(mov.data);
    next.setMonth(next.getMonth()+i);
    w.movimenti.push({...mov,data:next.toISOString().split('T')[0]});
  }
  saveState();
  updateSaldo();
  renderMovimenti();
  renderGrafici();
  renderCalendar();
}

// --- FILTRI MOVIMENTI ---
function renderMovimenti(filter){
  const ul = document.getElementById("movimentiList");
  ul.innerHTML="";
  let allMov = [];
  appState.finance.wallets.forEach(w=>{
    allMov = allMov.concat(w.movimenti.map(m=>({...m,walletName:w.name})));
  });

  if(filter){
    if(filter.wallet && filter.wallet!=="all") allMov = allMov.filter(m=>m.walletId==filter.wallet);
    if(filter.categoria) allMov = allMov.filter(m=>m.categoria.toLowerCase().includes(filter.categoria.toLowerCase()));
    if(filter.da) allMov = allMov.filter(m=>m.data>=filter.da);
    if(filter.a) allMov = allMov.filter(m=>m.data<=filter.a);
  }

  allMov.sort((a,b)=> new Date(b.data)-new Date(a.data));

  allMov.forEach(m=>{
    const li = document.createElement("li");
    li.textContent = `${m.data} - ${m.walletName} - ${m.tipo}: €${m.importo} - ${m.categoria}`;
    ul.appendChild(li);
  });
}

// --- GRAFICI ---
let chartCategorie=null;
let chartSaldo=null;

function renderGrafici(){
  const labels = [];
  const saldoProgress = [];
  let totalSaldo=0;
  const walletFilter = appState.finance.wallets.filter(w=>w.includeInCharts!==false);

  // dati per percentuali
  let entrateTot=0, speseTot=0, traguardo=appState.finance.traguardo||1000;
  walletFilter.forEach(w=>{
    w.movimenti.forEach(m=>{
      if(m.tipo==="entrata") entrateTot+=m.importo;
      else speseTot+=m.importo;
    });
  });

  // Grafico categorie
  const ctx1 = document.getElementById("graficoCategorie").getContext("2d");
  if(chartCategorie) chartCategorie.destroy();
  chartCategorie = new Chart(ctx1,{
    type:'doughnut',
    data:{
      labels:['Entrate','Spese','Traguardo'],
      datasets:[{data:[entrateTot,speseTot,traguardo],
        backgroundColor:[
          appState.ui.chartColors.entrate,
          appState.ui.chartColors.spese,
          appState.ui.chartColors.traguardo
        ]}]
    },
    options:{
      responsive:true,
      plugins:{
        legend:{display:true, position:'bottom'},
        tooltip:{callbacks:{label:ctx=>`${ctx.label}: €${ctx.raw} (${((ctx.raw/(entrateTot+speseTot+traguardo))*100).toFixed(1)}%)`}}}
      }
  });

  // Grafico saldo progressivo
  let allMov = [];
  walletFilter.forEach(w=>{
    allMov = allMov.concat(w.movimenti.map(m=>({...m,walletName:w.name})));
  });
  allMov.sort((a,b)=> new Date(a.data)-new Date(b.data));
  allMov.forEach(m=>{
    totalSaldo += m.tipo==="entrata"?m.importo:-m.importo;
    labels.push(m.data);
    saldoProgress.push(totalSaldo);
  });

  const ctx2 = document.getElementById("graficoSaldo").getContext("2d");
  if(chartSaldo) chartSaldo.destroy();
  chartSaldo = new Chart(ctx2,{
    type:'bar',
    data:{
      labels:labels,
      datasets:[{label:'Saldo', data:saldoProgress, backgroundColor: appState.ui.chartColors.saldo}]
    },
    options:{
      responsive:true,
      plugins:{
        legend:{display:true, position:'bottom'},
        tooltip:{callbacks:{label:ctx=>`€${ctx.raw}`}} 
      },
      scales:{x:{title:{display:true,text:'Data'}},y:{title:{display:true,text:'Saldo'}}}
    }
  });
}

// --- CALENDARIO ---
function renderWalletSelects(){
  const selMov = document.getElementById("movWallet");
  const selFilter = document.getElementById("filterWallet");
  const selCalendar = document.getElementById("calendarWallet");
  [selMov, selFilter, selCalendar].forEach(sel=>{
    sel.innerHTML="";
    const allOption = document.createElement("option");
    allOption.value="all";
    allOption.textContent="Tutti";
    sel.appendChild(allOption);
    appState.finance.wallets.forEach(w=>{
      const opt = document.createElement("option");
      opt.value=w.id;
      opt.textContent=w.name;
      sel.appendChild(opt);
    });
  });
}

function renderCalendar(){
  const walletId = document.getElementById("calendarWallet").value;
  const monthInput = document.getElementById("calendarMonth").value;
  if(!monthInput) return;
  const [y,m] = monthInput.split("-");
  const tbody = document.querySelector("#calendarioTable tbody");
  tbody.innerHTML="";

  const startDate = new Date(y,m-1,1);
  const endDate = new Date(y,parseInt(m),0);

  for(let d=startDate.getDate(); d<=endDate.getDate(); d++){
    const dateStr = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    let entrate=0, spese=0;
    appState.finance.wallets.forEach(w=>{
      if(walletId!=="all" && w.id!=walletId) return;
      w.movimenti.forEach(mov=>{
        if(mov.data===dateStr){
          if(mov.tipo==="entrata") entrate+=mov.importo;
          else spese+=mov.importo;
        }
      });
    });
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${dateStr}</td><td>€${entrate}</td><td>€${spese}</td>`;
    tbody.appendChild(tr);
  }
}

// --- INIT ---
updateSaldo();
renderWalletList();
renderWalletSelects();
renderCalendar();
