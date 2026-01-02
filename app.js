loadState();

// Dark mode
if(appState.ui.darkMode) document.body.classList.add("dark");
document.getElementById("darkToggle").onclick = ()=>{
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
};

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

// Render lista movimenti
function renderMovimenti(){
  const list = document.getElementById("movimentiList");
  list.innerHTML="";
  let movs = applyFilters(appState.finance.movimenti);
  movs.forEach((m,i)=>{
    const li = document.createElement("li");
    li.innerHTML=`${m.tipo.toUpperCase()} - ${m.descrizione} (€${m.importo.toFixed(2)}) [${m.categoria}] 
    <button onclick="openModal(appState.finance.movimenti[${i}],${i})">Modifica</button>
    <button onclick="deleteMovimento(${i})">Elimina</button>`;
    list.appendChild(li);
  });
}

function deleteMovimento(i){
  const m = appState.finance.movimenti[i];
  if(m.tipo==="entrata") appState.finance.saldo-=m.importo;
  else appState.finance.saldo+=m.importo;

  appState.finance.movimenti.splice(i,1);
  saveState();
  updateSaldo();
  renderMovimenti();
  renderGrafici();
  renderPrevisioni();
}

function updateSaldo(){
  document.getElementById("saldo").textContent=`€${appState.finance.saldo.toFixed(2)}`;
}

// Filtri
document.getElementById("applyFiltersBtn").onclick = renderMovimenti;
document.getElementById("clearFiltersBtn").onclick = ()=>{
  document.getElementById("filterCategoria").value="";
  document.getElementById("filterDa").value="";
  document.getElementById("filterA").value="";
  renderMovimenti();
};

function applyFilters(movs){
  let cat = document.getElementById("filterCategoria").value.trim().toLowerCase();
  let da = document.getElementById("filterDa").value;
  let a = document.getElementById("filterA").value;

  return movs.filter(m=>{
    let ok = true;
    if(cat && m.categoria.toLowerCase().indexOf(cat)===-1) ok=false;
    if(da && m.data<da) ok=false;
    if(a && m.data>a) ok=false;
    return ok;
  });
}

// Previsioni 15 giorni
function renderPrevisioni(){
  const list = document.getElementById("previsioniList");
  list.innerHTML="";
  const today = new Date();
  const previsioni = [];

  for(let i=1;i<=15;i++){
    const d = new Date(today); d.setDate(today.getDate()+i);
    let dayStr = d.toISOString().split("T")[0];
    let saldoGiorno = appState.finance.saldo;

    appState.finance.movimenti.forEach(m=>{
      // movimenti futuri
      if(m.ricorrenza>0){
        const mData = new Date(m.data);
        for(let r=0;r<m.ricorrenza;r++){
          mData.setMonth(mData.getMonth()+1);
          if(mData.toISOString().split("T")[0]===dayStr){
            saldoGiorno += (m.tipo==="entrata"?m.importo:-m.importo);
          }
        }
      }
      if(m.data===dayStr){
        saldoGiorno += (m.tipo==="entrata"?m.importo:-m.importo);
      }
    });

    previsioni.push({data:dayStr,saldo:saldoGiorno});
  }

  previsioni.forEach(p=>{
    const li = document.createElement("li");
    li.textContent=`${p.data}: €${p.saldo.toFixed(2)}`;
    list.appendChild(li);
  });
}

// Grafici
let chartCategorie=null;
let chartSaldo=null;
function renderGrafici(){
  // Categorie
  const ctxCat = document.getElementById("graficoCategorie").getContext("2d");
  const cats = {};
  appState.finance.movimenti.forEach(m=>cats[m.categoria]=(cats[m.categoria]||0)+m.importo);
  if(chartCategorie) chartCategorie.destroy();
  chartCategorie = new Chart(ctxCat,{
    type:"doughnut",
    data:{labels:Object.keys(cats),datasets:[{data:Object.values(cats),backgroundColor:generateColors(Object.keys(cats).length)}]}
  });

  // Saldo 30 giorni
  const ctxSaldo = document.getElementById("graficoSaldo").getContext("2d");
  const today = new Date();
  const past30 = [];
  for(let i=29;i>=0;i--){
    const d = new Date(today); d.setDate(today.getDate()-i);
    past30.push(d.toISOString().split("T")[0]);
  }

  const saldoArr = past30.map(date=>{
    let s=0;
    appState.finance.movimenti.forEach(m=>{
      if(m.data<=date) s+=(m.tipo==="entrata"?m.importo:-m.importo);
      if(m.ricorrenza>0){
        let mData = new Date(m.data);
        for(let r=0;r<m.ricorrenza;r++){
          mData.setMonth(mData.getMonth()+1);
          if(mData.toISOString().split("T")[0]<=date) s+=(m.tipo==="entrata"?m.importo:-m.importo);
        }
      }
    });
    return s.toFixed(2);
  });

  if(chartSaldo) chartSaldo.destroy();
  chartSaldo = new Chart(ctxSaldo,{
    type:"line",
    data:{labels:past30,datasets:[{label:"Saldo Ultimi 30 giorni",data:saldoArr,borderColor:"#2563eb",fill:false}]}
  });
}

function generateColors(n){
  const colors=[];
  for(let i=0;i<n;i++){
    colors.push(`hsl(${i*360/n},70%,50%)`);
  }
  return colors;
}

// Init
updateSaldo();
renderMovimenti();
renderGrafici();
renderPrevisioni();
