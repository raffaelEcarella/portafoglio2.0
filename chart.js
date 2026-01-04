// CC99 - chart.js
let chartCategorie, chartSaldo;

function renderCharts(){
  const categorieData = {};
  const saldoProgressivo = [];
  const dateProgressivo = [];

  appState.finance.wallets.forEach(w=>{
    if(!w.includeInCharts) return;
    w.movimenti.forEach(m=>{
      categorieData[m.descrizione] = (categorieData[m.descrizione]||0) + (m.tipo==="entrata"?m.importo:-m.importo);
    });
  });

  // SALDO PROGRESSIVO
  const allMov = [];
  appState.finance.wallets.forEach(w=>{
    if(!w.includeInCharts) return;
    w.movimenti.forEach(m=>{
      allMov.push({data:new Date(m.data), importo:m.tipo==="entrata"?m.importo:-m.importo});
    });
  });
  allMov.sort((a,b)=>a.data-b.data);
  let cum = 0;
  allMov.forEach(m=>{
    cum += m.importo;
    saldoProgressivo.push(cum);
    dateProgressivo.push(m.data.toISOString().split("T")[0]);
  });

  // --- GRAFICO CATEGORIE ---
  const ctxCat = document.getElementById("graficoCategorie").getContext("2d");
  if(chartCategorie) chartCategorie.destroy();
  chartCategorie = new Chart(ctxCat,{
    type:'doughnut',
    data:{
      labels:Object.keys(categorieData),
      datasets:[{
        label:"Categorie",
        data:Object.values(categorieData),
        backgroundColor:Object.keys(categorieData).map((_,i)=>`hsl(${i*60 % 360},70%,50%)`)
      }]
    }
  });

  // --- GRAFICO SALDO ---
  const ctxSaldo = document.getElementById("graficoSaldo").getContext("2d");
  if(chartSaldo) chartSaldo.destroy();
  chartSaldo = new Chart(ctxSaldo,{
    type:'line',
    data:{
      labels:dateProgressivo,
      datasets:[{
        label:"Saldo Progressivo",
        data:saldoProgressivo,
        borderColor:"#2a9d8f",
        backgroundColor:"rgba(42,157,143,0.2)",
        fill:true
      }]
    }
  });
}
