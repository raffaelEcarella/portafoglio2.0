loadState();

// Dark mode
if(appState.ui.darkMode) document.body.classList.add("dark");
document.getElementById("darkToggle").onclick = toggleDark;
document.getElementById("darkToggle2").onclick = toggleDark;

function toggleDark(){
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
}

// Modal e movimento
let editingIndex = null;
const modal = document.getElementById("movimentoModal");
const descrInput = document.getElementById("movDescrizione");
const importoInput = document.getElementById("movImporto");
const tipoInput = document.getElementById("movTipo");
const categoriaInput = document.getElementById("movCategoria");
const dataInput = document.getElementById("movData");
const ricorrenzaInput = document.getElementById("movRicorrenza");
const saveBtn = document.getElementById("saveMovimentoBtn");
const cancelBtn = document.getElementById("cancelMovimentoBtn");

document.getElementById("addMovimentoBtn").onclick = ()=>openModal();
cancelBtn.onclick = ()=>{modal.style.display="none"; resetModal();};

function openModal(movimento=null,index=null){
  modal.style.display="flex";
  if(movimento){
    editingIndex = index;
    document.getElementById("modalTitle").textContent="Modifica Movimento";
    descrInput.value=movimento.descrizione;
    importoInput.value=movimento.importo;
    tipoInput.value=movimento.tipo;
    categoriaInput.value=movimento.categoria;
    dataInput.value=movimento.data;
    ricorrenzaInput.value=movimento.ricorrenza||0;
    saveBtn.textContent="Salva";
  } else {
    editingIndex=null;
    document.getElementById("modalTitle").textContent="Aggiungi Movimento";
    saveBtn.textContent="Aggiungi";
  }
}

saveBtn.onclick = ()=>{
  const descr = descrInput.value.trim();
  const importo = parseFloat(importoInput.value);
  const tipo = tipoInput.value;
  const categoria = categoriaInput.value.trim();
  const data = dataInput.value;
  const ricorrenza = parseInt(ricorrenzaInput.value)||0;

  if(!descr || isNaN(importo) || !tipo || !categoria || !data){
    alert("Compila tutti i campi");
    return;
  }

  const mov = {descrizione:descr, importo, tipo, categoria, data, ricorrenza};

  if(editingIndex!==null){
    const old = appState.finance.movimenti[editingIndex];
    if(old.tipo==="entrata") appState.finance.saldo-=old.importo;
    else appState.finance.saldo+=old.importo;

    appState.finance.movimenti[editingIndex]=mov;
  } else {
    appState.finance.movimenti.push(mov);
  }

  if(tipo==="entrata") appState.finance.saldo+=importo;
  else appState.finance.saldo-=importo;

  saveState();
  updateSaldo();
  renderMovimenti();
  renderGrafici();
  renderPrevisioni();
  renderCalendario();
  modal.style.display="none";
  resetModal();
};

function resetModal(){
  descrInput.value="";
  importoInput.value="";
  tipoInput.value="entrata";
  categoriaInput.value="";
  dataInput.value="";
  ricorrenzaInput.value=0;
  editingIndex=null;
}

// Init
updateSaldo();
renderMovimenti();
renderGrafici();
renderPrevisioni();
renderCalendario();
