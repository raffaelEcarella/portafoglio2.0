// CC99 - ui.js Portafoglio 2.0

// --- NAVIGAZIONE ---
document.querySelectorAll("[data-page]").forEach(btn=>{
  btn.onclick=()=>showPage(btn.dataset.page);
});
document.querySelectorAll(".homeBtn").forEach(btn=>{
  btn.onclick=()=>showPage("menu");
});

function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const s=document.getElementById(page);
  if(s) s.classList.add("active");
  if(page==="grafici") renderGrafici();
}

// --- DARK MODE ---
document.getElementById("darkToggle").onclick = toggleDarkMode;
document.getElementById("darkToggle2").onclick = toggleDarkMode;

function toggleDarkMode(){
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
}

// --- COLORI GRAFICI ---
document.getElementById("colorEntrate").onchange = e=>{appState.ui.chartColors.entrate=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorSpese").onchange = e=>{appState.ui.chartColors.spese=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorTraguardo").onchange = e=>{appState.ui.chartColors.traguardo=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorSaldo").onchange = e=>{appState.ui.chartColors.saldo=e.target.value; saveState(); renderGrafici();}

// --- GRAFICI ---
let chartCategorie=null;
let chartSaldo=null;

function renderGrafici(){
  // dati cumulativi di portafogli inclusi nei grafici
  const wallets = appState.finance.wallets.filter(w=>w.includeInCharts);
  let entrate=0, spese=0, saldo=0;
  wallets.forEach(w=>{
    w.movimenti.forEach(m=>{
      if(m.tipo==="entrata") entrate+=m.importo;
      else spese+=m.importo;
    });
    saldo += w.movimenti.reduce((s,m)=>m.tipo==="entrata"?s+m.importo:s-m.importo,0);
  });
  const traguardo = appState.finance.traguardo;

  // grafico percentuali
  const ctx1 = document.getElementById("graficoCategorie").getContext("2d");
  if(chartCategorie) chartCategorie.destroy();
  chartCategorie = new Chart(ctx1,{
    type:'doughnut',
    data:{
      labels:['Entrate','Spese','Traguardo'],
      datasets:[{
        data:[entrate, spese, traguardo],
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
        tooltip:{callbacks:{label:ctx=>`${ctx.label}: €${ctx.raw.toFixed(2)} (${((ctx.raw/(entrate+spese+traguardo))*100).toFixed(1)}%)`}}
      }
    }
  });

  // grafico progressivo saldo
  const labels = [];
  const dataSaldo = [];
  wallets.forEach(w=>{
    w.movimenti.sort((a,b)=>new Date(a.data)-new Date(b.data)).forEach(m=>{
      labels.push(m.data);
      dataSaldo.push(m.tipo==="entrata"?m.importo:-m.importo);
    });
  });

  const ctx2 = document.getElementById("graficoSaldo").getContext("2d");
  if(chartSaldo) chartSaldo.destroy();
  chartSaldo = new Chart(ctx2,{
    type:'bar',
    data:{
      labels:labels,
      datasets:[{
        label:'Saldo',
        data:dataSaldo,
        backgroundColor: appState.ui.chartColors.saldo
      }]
    },
    options:{
      responsive:true,
      plugins:{
        legend:{display:true, position:'bottom'},
        tooltip:{callbacks:{label:ctx=>`€${ctx.raw.toFixed(2)}`}}
      },
      scales:{
        x:{title:{display:true,text:'Data'}},
        y:{title:{display:true,text:'Saldo'}}
      }
    }
  });
}
