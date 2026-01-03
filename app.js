// CC99 - app.js Portafoglio 2.0

loadState();

// ---------------- SALDO ----------------
function updateSaldo() {
  let saldoTotale = 0;
  appState.finance.wallets.forEach(wallet => {
    wallet.saldo = wallet.movimenti.reduce((acc, m) => m.tipo === "entrata" ? acc + m.importo : acc - m.importo, 0);
    saldoTotale += wallet.saldo;
  });
  document.getElementById("saldoVal").textContent = `€${saldoTotale}`;
  renderWalletList();
  saveState();
}

// Mostra lista portafogli
function renderWalletList() {
  const list = document.getElementById("walletList");
  const settingsList = document.getElementById("settingsWalletList");
  list.innerHTML = "";
  settingsList.innerHTML = "";
  appState.finance.wallets.forEach(wallet => {
    const li = document.createElement("li");
    li.textContent = `${wallet.name}: €${wallet.saldo}`;
    li.style.color = wallet.color;
    list.appendChild(li);

    const li2 = document.createElement("li");
    li2.innerHTML = `<span style="color:${wallet.color}">${wallet.name}</span>`;
    settingsList.appendChild(li2);
  });
  renderWalletSelects();
}

// Aggiorna i select dei portafogli
function renderWalletSelects() {
  const movWallet = document.getElementById("movWallet");
  const filterWallet = document.getElementById("filterWallet");
  const calendarioWallet = document.getElementById("calendarioWallet");

  [movWallet, filterWallet, calendarioWallet].forEach(sel => {
    sel.innerHTML = "";
    const allOption = document.createElement("option");
    allOption.value = 0;
    allOption.textContent = "Tutti";
    sel.appendChild(allOption);
    appState.finance.wallets.forEach(wallet => {
      const option = document.createElement("option");
      option.value = wallet.id;
      option.textContent = wallet.name;
      sel.appendChild(option);
    });
  });
}

// ---------------- MOVIMENTI ----------------
function addMovimento(tipo) {
  document.getElementById("modalTitle").textContent = tipo === "entrata" ? "Aggiungi Entrata" : "Aggiungi Spesa";
  document.getElementById("movTipo").value = tipo;
  document.getElementById("movDescrizione").value = "";
  document.getElementById("movImporto").value = "";
  document.getElementById("movCategoria").value = "";
  document.getElementById("movData").valueAsDate = new Date();
  document.getElementById("movRicorrenza").value = 0;
  document.getElementById("movimentoModal").style.display = "flex";
}

document.getElementById("addEntrataBtn").onclick = () => addMovimento("entrata");
document.getElementById("addSpesaBtn").onclick = () => addMovimento("spesa");

// Salva movimento
document.getElementById("saveMovimentoBtn").onclick = () => {
  const tipo = document.getElementById("movTipo").value;
  const descr = document.getElementById("movDescrizione").value;
  const importo = parseFloat(document.getElementById("movImporto").value);
  const categoria = document.getElementById("movCategoria").value;
  const data = document.getElementById("movData").value;
  const walletId = parseInt(document.getElementById("movWallet").value);
  const ricorrenza = parseInt(document.getElementById("movRicorrenza").value);

  const wallet = appState.finance.wallets.find(w => w.id === walletId) || appState.finance.wallets[0];

  for(let i=0; i<=ricorrenza; i++){
    const mov = {
      tipo, descrizione: descr, importo,
      categoria, data: addMonths(data,i)
    };
    wallet.movimenti.push(mov);
  }

  document.getElementById("movimentoModal").style.display = "none";
  updateSaldo();
  renderMovimenti();
  renderGrafici();
  renderCalendario();
}

// Cancella modal
document.getElementById("cancelMovimentoBtn").onclick = () => {
  document.getElementById("movimentoModal").style.display = "none";
}

// Helper aggiungi mesi
function addMonths(dateStr, months){
  const date = new Date(dateStr);
  date.setMonth(date.getMonth()+months);
  return date.toISOString().split("T")[0];
}

// ---------------- FILTRI MOVIMENTI ----------------
function renderMovimenti() {
  const ul = document.getElementById("movimentiList");
  const walletId = parseInt(document.getElementById("filterWallet").value);
  const categoria = document.getElementById("filterCategoria").value.toLowerCase();
  const da = document.getElementById("filterDa").value;
  const a = document.getElementById("filterA").value;

  let movs = [];
  appState.finance.wallets.forEach(wallet=>{
    if(walletId===0 || wallet.id===walletId){
      movs = movs.concat(wallet.movimenti);
    }
  });

  if(categoria) movs = movs.filter(m=>m.categoria.toLowerCase().includes(categoria));
  if(da) movs = movs.filter(m=>m.data>=da);
  if(a) movs = movs.filter(m=>m.data<=a);

  ul.innerHTML = "";
  movs.sort((a,b)=>a.data.localeCompare(b.data)).forEach(m=>{
    const li = document.createElement("li");
    li.textContent = `${m.data} - ${m.tipo.toUpperCase()} €${m.importo} [${m.categoria}] ${m.descrizione}`;
    li.style.color = m.tipo==="entrata"?appState.ui.chartColors.entrate:appState.ui.chartColors.spese;
    ul.appendChild(li);
  });
}

// Filtri
document.getElementById("applyFiltersBtn").onclick = renderMovimenti;
document.getElementById("clearFiltersBtn").onclick = () => {
  document.getElementById("filterCategoria").value="";
  document.getElementById("filterDa").value="";
  document.getElementById("filterA").value="";
  document.getElementById("filterWallet").value="0";
  renderMovimenti();
}

// ---------------- AGGIUNGI PORTAFOGLIO ----------------
function addWallet() {
  if(appState.finance.wallets.length>=6){
    alert("Hai raggiunto il massimo di 6 portafogli!");
    return;
  }
  const name = prompt("Nome del nuovo portafoglio:");
  if(!name) return;
  const color = prompt("Colore del portafoglio (es. #007bff):", "#007bff");
  const id = appState.finance.wallets.length ? Math.max(...appState.finance.wallets.map(w=>w.id))+1 : 1;
  appState.finance.wallets.push({id, name, color, movimenti:[], includeInCharts:true});
  updateSaldo();
  renderGrafici();
}

document.getElementById("addWalletBtn").onclick = addWallet;
document.getElementById("addWalletBtnSettings").onclick = addWallet;

// ---------------- GRAFICI ----------------
let chartCategorie=null;
let chartSaldo=null;

function renderGrafici() {
  const wallets = appState.finance.wallets.filter(w=>w.includeInCharts);
  const entrate = wallets.reduce((acc,w)=>acc+w.movimenti.filter(m=>m.tipo==="entrata").reduce((a,b)=>a+b.importo,0),0);
  const spese = wallets.reduce((acc,w)=>acc+w.movimenti.filter(m=>m.tipo==="spesa").reduce((a,b)=>a+b.importo,0),0);
  const traguardo = appState.finance.traguardo;

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
        tooltip:{callbacks:{label:ctx=>`${ctx.label}: €${ctx.raw} (${((ctx.raw/(entrate+spese+traguardo))*100).toFixed(1)}%)`}}
      }
    }
  });

  // Grafico saldo progressivo
  const ctx2 = document.getElementById("graficoSaldo").getContext("2d");
  if(chartSaldo) chartSaldo.destroy();
  let labels = [];
  let data = [];
  wallets.forEach(wallet=>{
    wallet.movimenti.sort((a,b)=>a.data.localeCompare(b.data));
    wallet.movimenti.forEach(m=>{
      labels.push(m.data);
      data.push(m.tipo==="entrata"?m.importo:-m.importo);
    });
  });

  chartSaldo = new Chart(ctx2,{
    type:'bar',
    data:{labels:labels, datasets:[{label:'Saldo', data:data, backgroundColor:appState.ui.chartColors.saldo}]},
    options:{responsive:true, plugins:{legend:{display:true}}, scales:{x:{title:{display:true,text:'Data'}},y:{title:{display:true,text:'Saldo'}}}}
  });
}

// ---------------- CALENDARIO ----------------
function renderCalendario() {
  const tableBody = document.querySelector("#calendarioTable tbody");
  const selectedWalletId = parseInt(document.getElementById("calendarioWallet").value);
  const monthInput = document.getElementById("calendarioMonth").value || new Date().toISOString().slice(0,7);
  const [year, month] = monthInput.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();

  tableBody.innerHTML = "";
  for(let d=1; d<=daysInMonth; d++){
    const dayStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    let entrate = 0;
    let spese = 0;
    appState.finance.wallets.forEach(wallet=>{
      if(selectedWalletId===0 || wallet.id===selectedWalletId){
        wallet.movimenti.forEach(m=>{
          if(m.data===dayStr){
            if(m.tipo==="entrata") entrate+=m.importo;
            else spese+=m.importo;
          }
        });
      }
    });
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${dayStr}</td><td style="color:${appState.ui.chartColors.entrate}">€${entrate}</td><td style="color:${appState.ui.chartColors.spese}">€${spese}</td>`;
    tableBody.appendChild(tr);
  }
}

// Aggiorna calendario al cambio select
document.getElementById("calendarioWallet").onchange = renderCalendario;
document.getElementById("calendarioMonth").onchange = renderCalendario;

// ---------------- DARK MODE ----------------
document.getElementById("darkToggle").onclick = toggleDarkMode;
document.getElementById("darkToggle2").onclick = toggleDarkMode;
function toggleDarkMode(){
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
}

// ---------------- COLORI GRAFICI ----------------
document.getElementById("colorEntrate").onchange = e=>{appState.ui.chartColors.entrate=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorSpese").onchange = e=>{appState.ui.chartColors.spese=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorTraguardo").onchange = e=>{appState.ui.chartColors.traguardo=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorSaldo").onchange = e=>{appState.ui.chartColors.saldo=e.target.value; saveState(); renderGrafici();}

// ---------------- INIZIALIZZAZIONE ----------------
updateSaldo();
renderMovimenti();
renderGrafici();
renderCalendario();
