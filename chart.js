// CC99 - chart.js Portafoglio 2.0
// Gestione grafici professionali e moderni

let chartCategorie = null;
let chartSaldo = null;

function renderCharts() {
  const wallets = appState.finance.wallets.filter(w => w.includeInCharts);

  // --- DATI GRAFICO CATEGORIE ---
  const entrateTot = wallets.flatMap(w => w.movimenti)
                            .filter(m => m.tipo === "entrata")
                            .reduce((a,b) => a + b.importo, 0);
  const speseTot = wallets.flatMap(w => w.movimenti)
                          .filter(m => m.tipo === "spesa")
                          .reduce((a,b) => a + b.importo, 0);
  const traguardo = appState.finance.traguardo || 0;

  const ctx1 = document.getElementById("graficoCategorie").getContext("2d");
  if(chartCategorie) chartCategorie.destroy();

  chartCategorie = new Chart(ctx1, {
    type: 'doughnut',
    data: {
      labels: ['Entrate', 'Spese', 'Traguardo'],
      datasets: [{
        data: [entrateTot, speseTot, traguardo],
        backgroundColor: [
          'rgba(16,185,129,0.8)',  // verde
          'rgba(239,68,68,0.8)',   // rosso leggero
          'rgba(13,71,161,0.8)'    // blu
        ],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels:{color:'#1f2937', font:{weight:'600'}} },
        tooltip: {
          backgroundColor: '#0d47a1',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 8,
          callbacks: {
            label: ctx => `${ctx.label}: €${ctx.raw} (${((ctx.raw/(entrateTot+speseTot+traguardo))*100).toFixed(1)}%)`
          }
        }
      }
    }
  });

  // --- DATI GRAFICO SALDO PROGRESSIVO ---
  const movimentiOrdinati = wallets.flatMap(w => 
    w.movimenti.map(m => ({...m, wallet: w.name}))
  ).sort((a,b)=> new Date(a.data) - new Date(b.data));

  const labelsSaldo = movimentiOrdinati.map(m => m.data);
  const dataSaldo = movimentiOrdinati.map(m => m.tipo === "entrata" ? m.importo : -m.importo);

  const ctx2 = document.getElementById("graficoSaldo").getContext("2d");
  if(chartSaldo) chartSaldo.destroy();

  const gradient = ctx2.createLinearGradient(0,0,0,400);
  gradient.addColorStop(0, 'rgba(16,185,129,0.6)'); // verde chiaro
  gradient.addColorStop(1, 'rgba(13,71,161,0.6)');  // blu scuro

  chartSaldo = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: labelsSaldo,
      datasets: [{
        label: 'Saldo',
        data: dataSaldo,
        backgroundColor: gradient
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0d47a1',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 8,
          callbacks: {
            label: ctx => `€${ctx.raw.toFixed(2)}`
          }
        }
      },
      scales: {
        x: { title: { display:true, text:'Data', color:'#1f2937' }, grid:{ color:'#e5e7eb' } },
        y: { title: { display:true, text:'Saldo', color:'#1f2937' }, grid:{ color:'#e5e7eb' } }
      }
    }
  });
}
