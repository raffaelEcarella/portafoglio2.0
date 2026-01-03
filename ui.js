// CC99 - ui.js v0.95

// PAGINE
function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const s=document.getElementById(page);
  if(s) s.classList.add("active");
  if(page==="grafici") renderGrafici();
  if(page==="calendario") renderCalendario();
}

document.querySelectorAll("[data-page]").forEach(btn=>{
  btn.onclick=()=>showPage(btn.dataset.page);
});
document.querySelectorAll(".homeBtn").forEach(btn=>{
  btn.onclick=()=>showPage("menu");
});

// DARK MODE
document.getElementById("darkToggle")?.addEventListener("click", toggleDarkMode);
document.getElementById("darkToggle2")?.addEventListener("click", toggleDarkMode);

function toggleDarkMode(){
  document.body.classList.toggle("dark");
  appState.ui.darkMode=document.body.classList.contains("dark");
  saveState();
}

// COLORI GRAFICI
["Entrate","Spese","Traguardo","Saldo"].forEach(c=>{
  const el = document.getElementById("color"+c);
  if(el){
    el.onchange = e=>{
      const key=c.toLowerCase();
      appState.ui.chartColors[key]=e.target.value;
      saveState();
      renderGrafici();
    };
  }
});
