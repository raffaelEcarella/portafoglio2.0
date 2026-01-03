// CC99 - State iniziale dell'app

const appState = {
  finance: {
    saldo: 0,
    wallets: [], // Array di portafogli {id, nome, colore, movimenti:[]}
    traguardo: 1000
  },
  ui: {
    darkMode: false,
    chartColors: {
      entrate: "#009246", // verde bandiera
      spese: "#CE2B37",   // rosso sangue piccione
      traguardo: "#FFC107", // giallo
      saldo: "#007bff"
    }
  }
};
