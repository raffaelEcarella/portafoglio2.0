// CC99 - state.js Portafoglio 2.0
const appState = {
  finance: {
    wallets: [
      {id:1, name:"Conto Cumulativo", color:"#007bff", movimenti:[], includeInCharts:true}
    ],
    traguardo: 1000
  },
  ui: {
    darkMode: false,
    chartColors: {
      entrate: "#28a745",   // verde Italia
      spese: "#b71c1c",     // rosso sangue piccione
      traguardo: "#ffc107", // giallo
      saldo: "#007bff"      // blu principale
    }
  }
};

// --- SALVATAGGIO E CARICAMENTO ---
function saveState() {
  localStorage.setItem("portafoglio2_state", JSON.stringify(appState));
}

function loadState() {
  const data = localStorage.getItem("portafoglio2_state");
  if(data){
    Object.assign(appState, JSON.parse(data));
  }
  if(appState.ui.darkMode){
    document.body.classList.add("dark");
  }
}
