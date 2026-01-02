loadState();

// aggiornamento saldo
function updateSaldo(){
  const saldo = appState.finance.movimenti.reduce((acc,m)=> m.tipo==="entrata"?acc+m.importo : acc-m.importo,0);
  appState.finance.saldo=saldo;
  document.getElementById("saldoVal").textContent = `€${saldo}`;
  saveState();
}

// gestione grafici
let chartCategorie=null;
let chartSaldo=null;

function renderGrafici(){
  const entrate = appState.finance.movimenti.filter(m=>m.tipo==="entrata").reduce((a,b)=>a+b.importo,0);
  const spese = appState.finance.movimenti.filter(m=>m.tipo==="spesa").reduce((a,b)=>a+b.importo,0);
  const traguardo = appState.finance.traguardo;
  const saldo = appState.finance.saldo;

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
        tooltip:{callbacks:{label:ctx=>`${ctx.label}: €${ctx.raw} (${((ctx.raw/(entrate+spese+traguardo))*100).toFixed(1)}%)`}}
      }
    }
  });

  // grafico saldo
  const ctx2 = document.getElementById("graficoSaldo").getContext("2d");
  if(chartSaldo) chartSaldo.destroy();
  chartSaldo = new Chart(ctx2,{
    type:'bar',
    data:{
      labels: appState.finance.movimenti.map(m=>m.data),
      datasets:[{
        label:'Saldo',
        data: appState.finance.movimenti.map(m=>m.tipo==="entrata"?m.importo:-m.importo),
        backgroundColor: appState.ui.chartColors.saldo
      }]
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
