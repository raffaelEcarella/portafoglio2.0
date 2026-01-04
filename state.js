// Stato globale dell'app
const state = {
  movimenti: [],
  darkMode: false,
  getSaldo() {
    return this.movimenti.reduce((acc, m) => {
      return m.tipo === 'entrata' ? acc + m.importo : acc - m.importo;
    }, 0);
  }
};
