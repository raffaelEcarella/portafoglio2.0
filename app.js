loadState();
updateSaldo();
renderMovimenti();
renderGrafici();
renderPrevisioni();
renderObiettivo();

// SALDO E OBIETTIVO
function updateSaldo() {
  document.getElementById("saldo").textContent = `€${appState.finance.saldo.toFixed(2)}`;
  document.getElementById("obiettivo").textContent = `€${appState.finance.obiettivo.toFixed(2)}`;
}

document.getElementById("saveGoal").onclick = () => {
  const val = parseFloat(document.getElementById("setGoal").value);
  if(!isNaN(val)) {
    appState.finance.obiettivo = val;
    saveState();
    renderObiettivo();
  }
};

function renderObiettivo() {
  document.getElementById("obiettivo").textContent = `€${appState.finance.obiettivo.toFixed(2)}`;
}

// AGGIUNTA MOVIMENTO
document.getElementById("addMovimentoBtn").onclick = () => {
  const descr = prompt("Descrizione movimento:");
  const tipo = prompt("Tipo: entrata/spesa").toLowerCase();
  const importo = parseFloat(prompt("Importo:"));
  const categoria = prompt("Categoria:").toLowerCase();
  const ricorrente = confirm("Vuoi renderlo ricorrente mensile?");
  if (!descr || !tipo || isNaN(importo) || !categoria) return alert("Valore non valido");

  const data = new Date().toISOString().split("T")[0];
  const m = { descrizione: descr, tipo, importo, categoria, data, ricorrente };
  appState.finance.movimenti.push(m);
  if(tipo === "entrata") appState.finance.saldo += importo;
  else appState.finance.saldo -= importo;

  // aggiunta ricorrente
  if(ricorrente) appState.finance.ricorrenti.push({descrizione: descr, tipo, importo, categoria, giorno: new Date().getDate(), mesi: 12});

  saveState();
  updateSaldo();
  renderMovimenti();
  renderGrafici();
  renderPrevisioni();
};

// RESET
document.getElementById("resetBtn").onclick = () => {
  if(confirm("Sei sicuro di resettare tutto?")) {
    localStorage.clear();
    location.reload();
  }
};

// RENDER MOVIMENTI
function renderMovimenti() {
  const list = document.getElementById("movimentiList");
  list.innerHTML = "";
  appState.finance.movimenti.forEach(m => {
    const li = document.createElement("li");
    li.textContent = `${m.tipo.toUpperCase()} - ${m.descrizione} (€${m.importo.toFixed(2)}) [${m.categoria}]`;
    list.appendChild(li);
  });
}

// GRAFICI
let chartCategorie, chartSaldo, chartPrevisioni;
function renderGrafici() {
  // Doughnut per categorie
  const ctxCat = document.getElementById("graficoCategorie").getContext("2d");
  const categories = {};
  appState.finance.movimenti.forEach(m => { categories[m.categoria] = (categories[m.categoria]||0)+m.importo; });
  if(chartCategorie) chartCategorie.destroy();
  chartCategorie = new Chart(ctxCat, {
    type:"doughnut",
    data: { labels: Object.keys(categories), datasets:[{data:Object.values(categories), backgroundColor: generateColors(Object.keys(categories).length)}]},
    options:{responsive:true, plugins:{legend:{position:'bottom'}}}
  });

  // Line per saldo
  const ctxSaldo = document.getElementById("graficoSaldo").getContext("2d");
  const dates = appState.finance.movimenti.map(m=>m.data);
  const saldoArr = [];
  let s = 0;
  appState.finance.movimenti.forEach(m=>{ s += m.tipo==="entrata"?m.importo:-m.importo; saldoArr.push(s); });
  if(chartSaldo) chartSaldo.destroy();
  chartSaldo = new Chart(ctxSaldo, {
    type:"line",
    data:{labels:dates,datasets:[{label:"Saldo",data:saldoArr,borderColor:"#2563eb",fill:false}]},
    options:{responsive:true,plugins:{legend:{display:true}}}
  });
}

function renderPrevisioni() {
  const ctx = document.getElementById("graficoPrevisioni").getContext("2d");
  const today = new Date();
  const labels = [];
  const forecast = [];
  let saldo = appState.finance.saldo;
  for(let i=0;i<15;i++){
    const d = new Date(today); d.setDate(d.getDate()+i);
    const giorno = d.toISOString().split("T")[0];
    labels.push(giorno);
    // calcolo media giornaliera storica per entrate/spese
    let media = 0;
    appState.finance.movimenti.forEach(m=>{
      if(m.tipo==="entrata") media += m.importo/15;
      else media -= m.importo/15;
    });
    saldo += media;
    forecast.push(saldo.toFixed(2));
  }
  if(chartPrevisioni) chartPrevisioni.destroy();
  chartPrevisioni = new Chart(ctx,{
    type:"line",
    data:{labels:labels,datasets:[{label:"Saldo Previsto",data:forecast,borderColor:"#16a34a",fill:false}]},
    options:{responsive:true,plugins:{legend:{display:true}}}
  });
}

// funzione helper generazione colori
function generateColors(n){
  const palette=["#2563eb","#16a34a","#dc2626","#f59e0b","#9333ea","#14b8a6","#f43f5e","#8b5cf6"];
  const colors = [];
  for(let i=0;i<n;i++) colors.push(palette[i%palette.length]);
  return colors;
}
