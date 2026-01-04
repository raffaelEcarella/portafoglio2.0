// CC99 - ui.js Portafoglio 2.0

// --- NAVIGAZIONE PAGINE ---
document.querySelectorAll(".toolbar button").forEach(btn=>{
  btn.onclick=()=>showPage(btn.dataset.page);
});
function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(page).classList.add("active");
  if(page==="grafici") renderCharts(); // usa chart.js
}

// --- DARK MODE ---
document.getElementById("darkToggle").onclick = ()=>{
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
};
