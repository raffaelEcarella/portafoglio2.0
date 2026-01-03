// CC99 - ui.js

// --- NAVIGAZIONE PAGINE ---
document.querySelectorAll(".toolbar button").forEach(btn=>{
  btn.onclick=()=>showPage(btn.dataset.page);
});
function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(page).classList.add("active");
  if(page==="grafici") renderGrafici();
}

// --- DARK MODE ---
document.getElementById("darkToggle").onclick = ()=>{
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
};

// --- GRAFICI ---
let chartCategorie=null, chartSaldo=null;
function renderGrafici(){
  const wallets = appState.finance.wallets.filter(w=>w.includeInCharts);
  const labels = wallets.map(w=>w.name);
  const entrateData = wallets.map(w=>w.movimenti.filter(m=>m.tipo==="entrata").reduce((a,b)=>a+b.importo,0));
  const speseData = wallets.map(w=>w.movimenti.filter(m=>m.tipo==="spesa").reduce((a,b)=>a+b.importo,0));
  const traguardo = appState.finance.traguardo;

  // CATEGORIE
  const ctx1 = document.getElementById("graficoCategorie").getContext("2d");
  if(chartCategorie) chartCategorie.destroy();
  chartCategorie = new Chart(ctx1,{
    type:'doughnut',
    data:{
      labels:['Entrate','Spese','Traguardo'],
      datasets:[{data:[entrateData.reduce((a,b)=>a+b,0), speseData.reduce((a,b)=>a+b,0), traguardo],
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
        tooltip:{callbacks:{label:ctx=>`${ctx.label}: €${ctx.raw} (${((ctx.raw/(entrateData.reduce((a,b)=>a+b,0)+speseData.reduce((a,b)=>a+b,0)+traguardo))*100).toFixed(1)}%)`}}}
      }
    }
  });

  // SALDO PROGRESSIVO
  const ctx2 = document.getElementById("graficoSaldo").getContext("2d");
  if(chartSaldo) chartSaldo.destroy();
  const movimenti = wallets.flatMap(w=>w.movimenti.map(m=>({...m,wallet:w.name}))).sort((a,b)=>new Date(a.data)-new Date(b.data));
  chartSaldo = new Chart(ctx2,{
    type:'bar',
    data:{
      labels: movimenti.map(m=>m.data),
      datasets:[{
        label:'Saldo',
        data: movimenti.map(m=>m.tipo==="entrata"?m.importo:-m.importo),
        backgroundColor: appState.ui.chartColors.saldo
      }]
    },
    options:{
      responsive:true,
      plugins:{legend:{display:true, position:'bottom'}},
      scales:{x:{title:{display:true,text:'Data'}}, y:{title:{display:true,text:'Saldo'}}}
    }
  });
}
