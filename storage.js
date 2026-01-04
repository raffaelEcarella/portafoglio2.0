// Wrapper per localStorage
const storage = {
  salvaMovimenti() {
    localStorage.setItem('movimenti', JSON.stringify(state.movimenti));
  },
  caricaMovimenti() {
    const dati = JSON.parse(localStorage.getItem('movimenti') || '[]');
    state.movimenti = dati;
  },
  salvaDarkMode() {
    localStorage.setItem('darkMode', state.darkMode);
  },
  caricaDarkMode() {
    state.darkMode = JSON.parse(localStorage.getItem('darkMode') || 'false');
  }
};
