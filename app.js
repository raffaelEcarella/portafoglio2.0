loadState();

// AGGIORNAMENTO SALDO GIORNALIERO
function updateSaldo() {
  let saldoTotale = 0;
  appState.finance.wallets.forEach(wallet => {
    wallet.saldo = wallet.movimenti.reduce((acc,m)=>{
      return m.tipo==="entrata"? acc+m.importo : acc-m.importo;
    },0);
    saldoTotale += wallet.saldo;
  });
  document.getElementById("saldoVal").textContent = `€${saldoTotale.toFixed(2)}`;
  renderWalletBalances();
  saveState();
}

function renderWalletBalances(){
  const container = document.getElementById("walletBalances");
  if(!container) return;
  container.innerHTML = "";
  appState.finance.wallets.forEach(wallet=>{
    const div = document.createElement("div");
    div.style.color = wallet.color;
    div.textContent = `${wallet.name}: €${wallet.saldo.toFixed(2)}`;
    container.appendChild(div);
  });
}

// GRAFICI
let chartCategorie=null;
let chartSaldo=null;

function renderGrafici(){
  const wallets = appState.finance.wallets.filter(w=>w.includeInCharts);
  let entrate = 0, spese = 0, traguardo = appState.finance.traguardo;

  wallets.forEach(w=>{
    w.movimenti.forEach(m=>{
      if(m.tipo==="entrata") entrate+=m.importo;
      else spese+=m.importo;
    });
  });

  // CATEGORIE
  const ctx1 = document.getElementById("graficoCategorie").getContext("2d");
  if(chartCategorie) chartCategorie.destroy();
  chartCategorie = new Chart(ctx1,{
    type:'doughnut',
    data:{
      labels:['Entrate','Spese','Traguardo'],
      datasets:[{data:[entrate,spese,traguardo], 
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
        tooltip:{callbacks:{label:ctx=>`${ctx.label}: €${ctx.raw} (${((ctx.raw/(entrate+spese+traguardo))*100).toFixed(1)}%)`}}  
      }
    }
  });

  // SALDO PROGRESSIVO
  const ctx2 = document.getElementById("graficoSaldo").getContext("2d");
  if(chartSaldo) chartSaldo.destroy();

  const labels = [];
  const dataSaldo = [];
  let progress=0;
  wallets.forEach(w=>{
    w.movimenti.forEach(m=>{
      labels.push(m.data);
      progress += m.tipo==="entrata"? m.importo : -m.importo;
      dataSaldo.push(progress);
    });
  });

  chartSaldo = new Chart(ctx2,{
    type:'bar',
    data:{
      labels: labels,
      datasets:[{
        label:'Saldo Progressivo',
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
      scales:{x:{title:{display:true,text:'Data'}},y:{title:{display:true,text:'Saldo'}}}
    }
  });
}
