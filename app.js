const app = {
  initMovimenti() {
    storage.caricaMovimenti();
    storage.caricaDarkMode();
    this.applyDarkMode();
  },

  aggiungiMovimento(descrizione, importo, tipo) {
    const movimento = { descrizione, importo, tipo };
    state.movimenti.push(movimento);
    storage.salvaMovimenti();
  },

  renderMovimenti() {
    const tbody = document.querySelector('#movimentiTable tbody');
    tbody.innerHTML = '';
    state.movimenti.forEach(m => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${m.descrizione}</td><td>€${m.importo.toFixed(2)}</td><td>${m.tipo}</td>`;
      tbody.appendChild(tr);
    });
  },

  applyDarkMode() {
    if (state.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    storage.salvaDarkMode();
  }
};
