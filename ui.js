// navigazione
document.querySelectorAll("[data-page]").forEach(btn=>{
  btn.onclick=()=>showPage(btn.dataset.page);
});
document.querySelectorAll(".homeBtn").forEach(btn=>{
  btn.onclick=()=>showPage("menu");
});

function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const s=document.getElementById(page);
  if(s) s.classList.add("active");
  if(page==="grafici") renderGrafici();
}

// gestione dark mode
document.getElementById("darkToggle").onclick = toggleDarkMode;
document.getElementById("darkToggle2").onclick = toggleDarkMode;
function toggleDarkMode(){
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
}

// gestione colori grafici
document.getElementById("colorEntrate").onchange = e=>{appState.ui.chartColors.entrate=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorSpese").onchange = e=>{appState.ui.chartColors.spese=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorTraguardo").onchange = e=>{appState.ui.chartColors.traguardo=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorSaldo").onchange = e=>{appState.ui.chartColors.saldo=e.target.value; saveState(); renderGrafici();}
