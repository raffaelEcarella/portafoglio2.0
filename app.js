// CC99 - Logica principale app

loadState();

// --- SALDO GIORNALIERO ---
function updateSaldo() {
  const today = new Date().toISOString().split("T")[0]; // data corrente YYYY-MM-DD
  let totalSaldo = 0;
  appState.finance.wallets.forEach(wallet => {
    let walletSaldo = wallet.movimenti
      .filter(m => m.data <= today)
      .reduce((acc, m) => acc + (m.tipo === "entrata" ? m.importo : -m.importo), 0);
    wallet.saldo = walletSaldo;
    totalSaldo += walletSaldo;
  });
  appState.finance.saldo = totalSaldo;
  document.getElementById("saldoVal").textContent = `€${totalSaldo.toFixed(2)}`;
  renderWalletList();
  saveState();
}

// --- RENDER PORTAFOGLI ---
function renderWalletList() {
  const ul = document.getElementById("walletList");
  ul.innerHTML = "";
  appState.finance.wallets.forEach(w => {
    const li = document.createElement("li");
    li.textContent = `${w.nome}: €${w.saldo.toFixed(2)}`;
    li.style.color = w.colore;
    ul.appendChild(li);
  });
}

// --- AGGIUNGI PORTAFOGLIO ---
function addWallet() {
  if(appState.finance.wallets.length >= 6){
    alert("Hai raggiunto il massimo di 6 portafogli!");
    return;
  }
  const nome = prompt("Nome del portafoglio:");
  if(!nome) return;
  const colore = prompt("Colore del portafoglio (es. #009246):","#009246");
  const wallet = {id:Date.now(), nome, colore, movimenti:[], saldo:0};
  appState.finance.wallets.push(wallet);
  saveState();
  updateSaldo();
  renderWalletSelects();
}

// --- RENDER SELECT PORTAFOGLI ---
function renderWalletSelects() {
  const selects = ["movWallet", "filterWallet", "calendarWallet"];
  selects.forEach(id => {
    const sel = document.getElementById(id);
    if(!sel) return;
    sel.innerHTML = "";
    const optAll = document.createElement("option");
    optAll.value = "all"; optAll.textContent = "Tutti";
    sel.appendChild(optAll);
    appState.finance.wallets.forEach(w => {
      const opt = document.createElement("option");
      opt.value = w.id; opt.textContent = w.nome;
      sel.appendChild(opt);
    });
  });
}

// --- RENDER MOVIMENTI ---
function renderMovimenti(filter={wallet:"all", categoria:"", da:"", a:""}) {
  const ul = document.getElementById("movimentiList");
  ul.innerHTML = "";
  let movs = appState.finance.wallets.flatMap(w => w.movimenti.map(m => ({...m, walletNome:w.nome})));
  // FILTRI
  if(filter.wallet !== "all") movs = movs.filter(m => m.walletId==filter.wallet);
  if(filter.categoria) movs = movs.filter(m => m.categoria.toLowerCase().includes(filter.categoria.toLowerCase()));
  if(filter.da) movs = movs.filter(m => m.data >= filter.da);
  if(filter.a) movs = movs.filter(m => m.data <= filter.a);

  movs.forEach(m => {
    const li = document.createElement("li");
    li.textContent = `[${m.walletNome}] ${m.data} - ${m.tipo.toUpperCase()} €${m.importo.toFixed(2)} - ${m.descrizione} (${m.categoria})`;
    li.style.color = m.tipo==="entrata"?appState.ui.chartColors.entrate:appState.ui.chartColors.spese;
    ul.appendChild(li);
  });
}

// --- AGGIUNGI MOVIMENTO ---
function addMovimento(mov) {
  const wallet = appState.finance.wallets.find(w => w.id == mov.walletId);
  if(!wallet) return;
  wallet.movimenti.push({...mov});
  // ricorrenza
  for(let i=1;i<=mov.ricorrenza;i++){
    const newDate = new Date(mov.data);
    newDate.setMonth(newDate.getMonth()+i);
    wallet.movimenti.push({...mov, data:newDate.toISOString().split("T")[0]});
  }
  saveState();
  updateSaldo();
  renderMovimenti();
  renderCalendar();
  renderGrafici();
}

// --- CALENDARIO ---
function renderCalendar() {
  const tbody = document.querySelector("#calendarioTable tbody");
  tbody.innerHTML = "";
  const sel = document.getElementById("calendarWallet").value;
  const monthInput = document.getElementById("calendarMonth").value;
  if(!monthInput) return;
  const [year, month] = monthInput.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  let walletMovs = sel==="all"?appState.finance.wallets.flatMap(w=>w.movimenti):appState.finance.wallets.find(w=>w.id==sel).movimenti;
  for(let d=1;d<=daysInMonth;d++){
    const day = `${year}-${String(month).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const entrate = walletMovs.filter(m=>m.data===day && m.tipo==="entrata").reduce((a,b)=>a+b.importo,0);
    const spese = walletMovs.filter(m=>m.data===day && m.tipo==="spesa").reduce((a,b)=>a+b.importo,0);
    const tr = document.createElement("tr");
    tr.innerHTML=`<td>${day}</td><td style="color:${appState.ui.chartColors.entrate}">€${entrate.toFixed(2)}</td><td style="color:${appState.ui.chartColors.spese}">€${spese.toFixed(2)}</td>`;
    tbody.appendChild(tr);
  }
}

// --- GRAFICI ---
let chartCategorie=null, chartSaldo=null;

function renderGrafici(){
  const selectedWallets = appState.finance.wallets.filter(w=>{
    const cb = document.querySelector(`.walletCheckbox[value="${w.id}"]`);
    return !cb || cb.checked;
  });
  const allMovs = selectedWallets.flatMap(w=>w.movimenti).sort((a,b)=>a.data.localeCompare(b.data));

  const entrate = allMovs.filter(m=>m.tipo==="entrata").reduce((a,b)=>a+b.importo,0);
  const spese = allMovs.filter(m=>m.tipo==="spesa").reduce((a,b)=>a+b.importo,0);
  const traguardo = appState.finance.traguardo;

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
        legend:{display:true, position:'bottom'},
        tooltip:{callbacks:{label:ctx=>`${ctx.label}: €${ctx.raw.toFixed(2)} (${((ctx.raw/(entrate+spese+traguardo))*100).toFixed(1)}%)`}}
      }
    }
  });

  // grafico saldo progressivo
  const ctx2 = document.getElementById("graficoSaldo").getContext("2d");
  if(chartSaldo) chartSaldo.destroy();
  chartSaldo = new Chart(ctx2,{
    type:'bar',
    data:{
      labels: allMovs.map(m=>m.data),
      datasets:[{
        label:'Saldo',
        data: allMovs.map(m=>m.tipo==="entrata"?m.importo:-m.importo),
        backgroundColor: appState.ui.chartColors.saldo
      }]
    },
    options:{
      responsive:true,
      plugins:{
        legend:{display:true, position:'bottom'},
        tooltip:{callbacks:{label:ctx=>`€${ctx.raw.toFixed(2)}`}}
      },
      scales:{x:{title:{display:true,text:'Data'}},y:{title:{display:true,text:'Saldo'}}}
    }
  });
}

// --- INIZIALIZZAZIONE ---
updateSaldo();
renderWalletSelects();
renderMovimenti();
renderCalendar();
renderGrafici();
