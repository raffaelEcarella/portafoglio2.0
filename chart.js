const chart = {
  renderGrafico() {
    const ctx = document.getElementById('graficoMovimenti').getContext('2d');
    const entrate = state.movimenti.filter(m => m.tipo === 'entrata').reduce((a,b) => a + b.importo, 0);
    const uscite = state.movimenti.filter(m => m.tipo === 'uscita').reduce((a,b) => a + b.importo, 0);

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Entrate', 'Uscite'],
        datasets: [{
          label: 'Movimenti',
          data: [entrate, uscite],
          backgroundColor: ['#4CAF50', '#2196F3'],
          borderColor: ['#388E3C', '#1976D2'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
        }
      }
    });
  }
};
