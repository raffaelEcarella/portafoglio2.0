// --- INIT APP ---
loadState();
renderWallets();
populateWalletFilter();
renderGrafici();

// --- NAVIGAZIONE PAGINE ---
document.querySelectorAll(".navbar button").forEach(btn=>{
  btn.onclick=()=>showPage(btn.dataset.page);
});
function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const section = document.getElementById(page);
  if(section) section.classList.add("active");
  if(page==="grafici") renderGrafici();
}

// --- ADD PORTAFOGLIO ---
document.getElementById("addWalletBtn").onclick = ()=>{
  if(appState.finance.wallets.length>=6) return alert("Massimo 6 portafogli");
  const name = prompt("Nome nuovo portafoglio:");
  if(!name) return;
  const color = prompt("Colore (hex) per il portafoglio:", "#007bff");
  const newWallet = {
    id: Date.now(),
    name,
    color,
    movimenti: [],
    includeInCharts:true
  };
  appState.finance.wallets.push(newWallet);
  saveState();
  renderWallets();
  populateWalletSelect();
  populateWalletFilter();
};

// --- BOTTONI ENTRATE/SPESA ---
document.getElementById("addEntrataBtn").onclick = ()=>openMovimentoModal("entrata");
document.getElementById("addSpesaBtn").onclick = ()=>openMovimentoModal("spesa");
