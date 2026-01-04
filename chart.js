let chartCategorie=null, chartSaldo=null;

function renderGrafici(){
  const wallets = appState.finance.wallets.filter(w=>w.includeInCharts);
  const labels = wallets.map(w=>w.name);
  const entrateData = wallets.map(w=>w.movimenti.filter(m=>m.tipo==="entrata").reduce((a,b)=>a+b.importo,0));
  const speseData = wallets.map(w=>w.movimenti.filter(m=>m.tipo==="spesa").reduce((a,b)=>a+b.importo,0));

  const ctx1 = document.getElementById("graficoCategorie")?.getContext("2d");
  if(ctx1){
    if(chartCategorie) chartCategorie.destroy();
    chartCategorie = new Chart(ctx1,{
      type:'doughnut',
      data:{
        labels:['Entrate','Spese'],
        datasets:[{data:[entrateData.reduce((a,b)=>a+b,0), speseData.reduce((a,b)=>a+b,0)],
          backgroundColor:[appState.ui.chartColors.entrate, appState.ui.chartColors.spese]}]
      },
      options:{responsive:true}
    });
  }

  const ctx2 = document.getElementById("graficoSaldo")?.getContext("2d");
  if(ctx2){
    if(chartSaldo) chartSaldo.destroy();
    const movimenti = wallets.flatMap(w=>w.movimenti.map(m=>({...m,wallet:w.name}))).sort((a,b)=>new Date(a.data)-new Date(b.data));
    chartSaldo = new Chart(ctx2,{
      type:'bar',
      data:{
        labels: movimenti.map(m=>m.data),
        datasets:[{label:'Saldo', data: movimenti.map(m=>m.tipo==="entrata"?m.importo:-m.importo), backgroundColor: appState.ui.chartColors.saldo}]
      },
      options:{responsive:true}
    });
  }
}
