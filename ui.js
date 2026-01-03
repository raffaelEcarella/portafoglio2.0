// ===== NAVEGAZIONE =====
document.querySelectorAll(".homeBtn").forEach(btn => btn.onclick = () => showPage("home"));

function showPage(page){
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const s = document.getElementById(page);
  if(s) s.classList.add("active");

  if(page==="grafici") renderGrafici();
  if(page==="calendario") renderCalendar();
  if(page==="movimenti") renderMovimenti();
}

// ===== DARK MODE =====
const darkBtn = document.getElementById("darkToggle");
darkBtn.onclick = toggleDarkMode;

function toggleDarkMode(){
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
}

if(appState.ui.darkMode) document.body.classList.add("dark");

// ===== MODAL =====
function openModal(tipo){
  document.getElementById("movimentoModal").style.display="flex";
  document.getElementById("movTipo").value = tipo;
  document.getElementById("modalTitle").textContent = tipo==="entrata" ? "Aggiungi Entrata" : "Aggiungi Spesa";
  renderWalletSelect();
}

function closeModal(){ document.getElementById("movimentoModal").style.display="none"; }
document.getElementById("cancelMovimentoBtn").onclick = closeModal;

// ===== Wallet select nel modal =====
function renderWalletSelect(){
  const sel = document.getElementById("movWallet");
  sel.innerHTML = "";
  appState.wallets.forEach(w=>{
    sel.innerHTML += `<option value="${w.id}">${w.nome}</option>`;
  });
}

// ===== CHECKBOX PORTAFOGLI GRAFICI =====
function renderWalletCheckboxes(){
  const container = document.getElementById("walletCheckboxes");
  if(!container) return;
  container.innerHTML="";
  appState.wallets.forEach(w=>{
    container.innerHTML += `
      <label>
        <input type="checkbox" class="chartWalletCheckbox" value="${w.id}" ${w.includeCharts?"checked":""}>
        ${w.nome}
      </label>
    `;
  });
  document.querySelectorAll(".chartWalletCheckbox").forEach(cb=>{
    cb.onchange = ()=>{
      const w = appState.wallets.find(w=>w.id===cb.value);
      if(w) w.includeCharts = cb.checked;
      saveState();
      renderGrafici();
    };
  });
}
