// CC99 - app.js Portafoglio 2.0 v0.95

loadState();

// UTILITY
function formatCurrency(val){ return `€${val.toFixed(2)}`; }

// AGGIORNA SALDO GIORNALIERO E CUMULATIVO
function updateSaldos(){
  const oggi = new Date().toISOString().split('T')[0];
  let cumulativo = 0;
  appState.finance.wallets.forEach(w=>{
    let saldo = 0;
    w.movimenti.forEach(m=>{
      if(m.data <= oggi) saldo += m.tipo==="entrata"?m.importo:-m.importo;
    });
    w.saldo = saldo;
    cumulativo += saldo;
  });
  document.getElementById("saldoCumulativo").textContent = formatCurrency(cumulativo);
  renderWalletList();
  saveState();
}

// RENDER LISTA PORTAFOGLI
function renderWalletList(){
  const ul = document.getElementById("walletList");
  ul.innerHTML = "";
  appState.finance.wallets.forEach(w=>{
    const li = document.createElement("li");
    li.textContent = `${w.name}: ${formatCurrency(w.saldo || 0)}`;
    li.style.color = w.color;
    ul.appendChild(li);
  });
}

// RENDER SELECT PORTAFOGLI
function renderWalletSelects(){
  const selects = ["movWallet","filterWallet","calendarWallet"];
  selects.forEach(id=>{
    const sel = document.getElementById(id);
    sel.innerHTML="";
    appState.finance.wallets.forEach(w=>{
      const opt = document.createElement("option");
      opt.value = w.id; opt.textContent=w.name;
      sel.appendChild(opt);
    });
  });
}

// AGGIUNGI MOVIMENTO
function addMovimento(m){
  const w = appState.finance.wallets.find(w=>w.id==m.walletId);
  if(!w) return;
  w.movimenti.push(m);
  // movimenti ricorrenti
  for(let i=1;i<=m.ricorrenza;i++){
    const dt = new Date(m.data);
    dt.setMonth(dt.getMonth()+i);
    w.movimenti.push({...m, data: dt.toISOString().split('T')[0]});
  }
  updateSaldos();
  renderMovimentiList();
  renderGrafici();
}

// RENDER LISTA MOVIMENTI
function renderMovimentiList(){
  const ul = document.getElementById("movimentiList");
  ul.innerHTML="";
  appState.finance.wallets.forEach(w=>{
    w.movimenti.forEach(m=>{
      const li = document.createElement("li");
      li.textContent = `[${w.name}] ${m.data} | ${m.tipo.toUpperCase()} | ${m.categoria} | ${formatCurrency(m.importo)} | ${m.descrizione}`;
      ul.appendChild(li);
    });
  });
}

// AGGIUNGI PORTAFOGLIO
function addWallet(name,color){
  if(appState.finance.wallets.length>=appState.finance.maxWallets) return alert("Massimo 6 portafogli!");
  const id = Date.now();
  appState.finance.wallets.push({id,name,color,movimenti:[],includeInCharts:true});
  saveState();
  renderWalletList();
  renderWalletSelects();
  showPage("home");
}

// CALENDARIO
function renderCalendario(){
  const tbody = document.querySelector("#calendarioTable tbody");
  tbody.innerHTML="";
  const selWalletId = document.getElementById("calendarWallet").value;
  const month = document.getElementById("calendarMonth").value;
  if(!month) return;
  const [year,mon] = month.split("-");
  const days = new Date(year, mon,0).getDate();
  let movs=[];
  appState.finance.wallets.forEach(w=>{
    if(selWalletId=="all" || w.id==selWalletId) movs = movs.concat(w.movimenti);
  });
  for(let d=1;d<=days;d++){
    const date = `${year}-${String(mon).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const entrate = movs.filter(m=>m.data==date && m.tipo=="entrata").reduce((a,b)=>a+b.importo,0);
    const spese = movs.filter(m=>m.data==date && m.tipo=="spesa").reduce((a,b)=>a+b.importo,0);
    const tr = document.createElement("tr");
    tr.innerHTML=`<td>${date}</td><td>${formatCurrency(entrate)}</td><td>${formatCurrency(spese)}</td>`;
    tbody.appendChild(tr);
  }
}

// GRAFICI
let chartCategorie=null;
let chartSaldo=null;
function renderGrafici(){
  // dati cumulativi solo portafogli inclusi
  const wallets = appState.finance.wallets.filter(w=>w.includeInCharts);
  let entrate =0, spese=0, traguardo=appState.finance.traguardo;
  wallets.forEach(w=>{
    w.movimenti.forEach(m=>{
      if(m.tipo=="entrata") entrate+=m.importo;
      else spese+=m.importo;
    });
  });

  // grafico categorie
  const ctx1 = document.getElementById("graficoCategorie").getContext("2d");
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
        legend:{display:true,position:'bottom'},
        tooltip:{callbacks:{label:ctx=>`${ctx.label}: €${ctx.raw} (${((ctx.raw/(entrate+spese+traguardo))*100).toFixed(1)}%)`}}}
    }
  });

  // grafico progressivo
  const movimenti = [];
  wallets.forEach(w=> w.movimenti.forEach(m=> movimenti.push({...m,walletName:w.name})));
  movimenti.sort((a,b)=>new Date(a.data)-new Date(b.data));
  const ctx2 = document.getElementById("graficoSaldo").getContext("2d");
  if(chartSaldo) chartSaldo.destroy();
  let saldoProgressivo =0;
  chartSaldo = new Chart(ctx2,{
    type:'bar',
    data:{
      labels: movimenti.map(m=>m.data),
      datasets:[{
        label:'Saldo',
        data: movimenti.map(m=>{saldoProgressivo += m.tipo=="entrata"?m.importo:-m.importo; return saldoProgressivo;}),
        backgroundColor: appState.ui.chartColors.saldo
      }]
    },
    options:{responsive:true,plugins:{legend:{display:true}},scales:{x:{title:{display:true,text:'Data'}},y:{title:{display:true,text:'Saldo'}}}}
  });
}

// INIT
function initApp(){
  updateSaldos();
  renderWalletSelects();
  renderCalendario();
  renderGrafici();
}

window.addEventListener("load",initApp);
