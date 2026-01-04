// CC99 - ui.js

// --- NAVIGAZIONE ---
const pages = document.querySelectorAll(".page");
const toolbarBtns = document.querySelectorAll(".toolbar button");
toolbarBtns.forEach(btn=>{
  btn.onclick=()=>{
    const target = btn.dataset.page;
    pages.forEach(p=>p.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  };
});

// --- DARK MODE ---
const darkToggle = document.getElementById("darkToggle");
darkToggle.onclick = () => {
  document.body.classList.toggle("dark");
  appState.darkMode = document.body.classList.contains("dark");
  saveState();
};

// --- POPOLAMENTO IMPOSTAZIONI ---
function renderSettings(){
  const div = document.getElementById("walletSettings");
  div.innerHTML="";
  appState.finance.wallets.forEach(w=>{
    const container = document.createElement("div");
    container.innerHTML = `<strong>${w.name}</strong> - Mostra nei grafici: <input type="checkbox" ${w.includeInCharts?"checked":""} data-id="${w.id}">`;
    div.appendChild(container);
    container.querySelector("input").onchange = (e)=>{
      const wal = getWalletById(parseInt(e.target.dataset.id));
      wal.includeInCharts = e.target.checked;
      saveState();
      renderCharts();
    };
  });
}
renderSettings();
