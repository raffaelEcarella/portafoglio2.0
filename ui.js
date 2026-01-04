// CC99 - ui.js

document.querySelectorAll(".toolbar button").forEach(btn=>{
  btn.onclick = ()=>showPage(btn.dataset.page);
});

function showPage(p){
  document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
  document.getElementById(p).classList.add("active");
  if(p==="grafici") renderGrafici();
}

const darkBtn = document.getElementById("darkToggle");
if(darkBtn){
  darkBtn.onclick = ()=>{
    document.body.classList.toggle("dark");
    appState.ui.darkMode = document.body.classList.contains("dark");
    saveState();
  };
}

let chartCategorie=null, chartSaldo=null;

function renderGrafici(){
  const c1 = document.getElementById("graficoCategorie");
  const c2 = document.getElementById("graficoSaldo");
  if(!c1 || !c2) return;

  const wallets = appState.finance.wallets;
  const entrate = wallets.flatMap(w=>w.movimenti.filter(m=>m.tipo==="entrata")).reduce((a,b)=>a+b.importo,0);
  const spese   = wallets.flatMap(w=>w.movimenti.filter(m=>m.tipo==="spesa")).reduce((a,b)=>a+b.importo,0);

  if(chartCategorie) chartCategorie.destroy();
  chartCategorie = new Chart(c1,{
    type:"doughnut",
    data:{
      labels:["Entrate","Spese"],
      datasets:[{
        data:[entrate,spese],
        backgroundColor:[
          appState.ui.chartColors.entrate,
          appState.ui.chartColors.spese
        ]
      }]
    }
  });

  const mov = wallets.flatMap(w=>w.movimenti)
    .sort((a,b)=>new Date(a.data)-new Date(b.data));

  let saldo = 0;
  const progressivo = mov.map(m=>{
    saldo += m.tipo==="entrata" ? m.importo : -m.importo;
    return saldo;
  });

  if(chartSaldo) chartSaldo.destroy();
  chartSaldo = new Chart(c2,{
    type:"line",
    data:{
      labels: mov.map(m=>m.data),
      datasets:[{
        label:"Saldo",
        data: progressivo,
        borderColor: appState.ui.chartColors.saldo,
        fill:false
      }]
    }
  });
}
