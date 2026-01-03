// CC99 - state.js Portafoglio 2.0 v0.95

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

// --- SALVATAGGIO E CARICAMENTO PROFONDO ---
function saveState() {
  localStorage.setItem("portafoglio2_state", JSON.stringify(appState));
}

function loadState() {
  const data = localStorage.getItem("portafoglio2_state");
  if(data){
    const parsed = JSON.parse(data);
    mergeDeep(appState, parsed);
  }
  if(appState.ui.darkMode){
    document.body.classList.add("dark");
  }
}

// Merge profondo
function mergeDeep(target, source){
  for(const key in source){
    if(source[key] instanceof Object && key in target){
      mergeDeep(target[key], source[key]);
    }else{
      target[key] = source[key];
    }
  }
}
