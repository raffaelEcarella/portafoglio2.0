// NAVIGAZIONE
function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(page).classList.add("active");
  document.getElementById("headerTitle").textContent = page.charAt(0).toUpperCase()+page.slice(1);
  appState.ui.currentPage = page;
  saveState();
}

document.querySelectorAll("nav button").forEach(btn=>btn.onclick=()=>showPage(btn.dataset.page));

// DARK MODE
document.getElementById("darkToggle").onclick=()=>{
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
};

// SWIPE GESTURE
let touchstartX = 0;
let touchendX = 0;
function handleGesture(){
  const pages=["home","movimenti","grafici","statistiche","impostazioni"];
  let current = pages.indexOf(appState.ui.currentPage);
  if(touchendX < touchstartX - 50){ current = (current+1)%pages.length; showPage(pages[current]); }
  if(touchendX > touchstartX + 50){ current = (current-1+pages.length)%pages.length; showPage(pages[current]); }
}

document.addEventListener('touchstart', e=>touchstartX=e.changedTouches[0].screenX);
document.addEventListener('touchend', e=>{ touchendX=e.changedTouches[0].screenX; handleGesture(); });

// INIZIALIZZAZIONE UI
loadState();
showPage(appState.ui.currentPage);
if(appState.ui.darkMode) document.body.classList.add("dark");
