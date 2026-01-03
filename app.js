loadState();
const TODAY = new Date().toISOString().split("T")[0];
document.getElementById("oggiLabel").textContent = "Aggiornato al " + TODAY;

renderAll();

/* =================== SALDI =================== */
function saldoAdOggi(movs){
  return movs.filter(m=>m.data<=TODAY).reduce((a,m)=>a+(m.tipo==="entrata"?m.importo:-m.importo),0);
}

function renderSaldoTotale(){
  let t=0;
  appState.wallets.forEach(w=> t+=saldoAdOggi(w.movimenti) );
  saldoTotale.textContent = "€" + t.toFixed(2);
}

/* =================== PORTAFOGLI =================== */
function renderWallets(){
  walletList.innerHTML="";
  walletCalendarSelect.innerHTML="";
  appState.wallets.forEach(w=>{
    const saldo = saldoAdOggi(w.movimenti);
    walletList.innerHTML+=`
      <div class="wallet" style="border-color:${w.colore}">
        <span>${w.nome}</span> <b>€${saldo.toFixed(2)}</b>
      </div>`;
    walletCalendarSelect.innerHTML += `<option value="${w.id}">${w.nome}</option>`;
  });
}

/* =================== MOVIMENTI =================== */
function renderMovimenti(){
  const list = document.getElementById("movimentiList");
  list.innerHTML="";
  const allMovs = appState.wallets.flatMap(w=>w.movimenti);
  allMovs.sort((a,b)=>a.data.localeCompare(b.data));
  allMovs.forEach(m=>{
    list.innerHTML+=`<li>[${m.tipo}] ${m.descrizione} €${m.importo} (${m.wallet}) - ${m.data}</li>`;
  });
}

/* =================== AGGIUNGI MOVIMENTO =================== */
document.getElementById("saveMovimentoBtn").onclick = ()=>{
  const tipo = movTipo.value;
  const walletId = movWallet.value;
  const importo = parseFloat(movImporto.value);
  const data = movData.value;
  const descrizione = movDescrizione.value;
  const ricorrenza = parseInt(movRicorrenza.value)||0;

  const w = appState.wallets.find(w=>w.id===walletId);
  if(!w) return;

  w.movimenti.push({tipo,descrizione,importo,data,wallet:w.nome});

  if(tipo==="spesa" && ricorrenza>0){
    let dt = new Date(data);
    for(let i=1;i<=ricorrenza;i++){
      dt.setMonth(dt.getMonth()+1);
      w.movimenti.push({
        tipo,
        descrizione,
        importo,
        data: dt.toISOString().split("T")[0],
        wallet:w.nome
      });
    }
  }

  saveState();
  renderAll();
  closeModal();
}

/* =================== GRAFICI =================== */
let doughnut=null, line=null;

function renderGrafici(){
  renderWalletCheckboxes();

  const selectedWallets = appState.wallets.filter(w=>w.includeCharts);
  const movs = selectedWallets.flatMap(w=>w.movimenti).filter(m=>m.data<=TODAY);

  const entrate = movs.filter(m=>m.tipo==="entrata").reduce((a,b)=>a+b.importo,0);
  const spese = movs.filter(m=>m.tipo==="spesa").reduce((a,b)=>a+b.importo,0);
  const traguardo = selectedWallets.reduce((a,b)=>a+b.traguardo,0);

  if(doughnut) doughnut.destroy();
  doughnut = new Chart(graficoPercentuali,{
    type:"doughnut",
    data:{
      labels:["Entrate","Spese","Traguardo"],
      datasets:[{data:[entrate,spese,traguardo], backgroundColor:["#009246","#CE2B37","#FACC15"]}]
    }
  });

  const days=[...new Set(movs.map(m=>m.data))].sort();
  let running=0;
  const values=days.map(d=>{
    movs.filter(m=>m.data===d).forEach(m=> running += m.tipo==="entrata"?m.importo:-m.importo );
    return running;
  });

  if(line) line.destroy();
  line = new Chart(graficoProgressivo,{
    type:"line",
    data:{labels:days,datasets:[{label:"Saldo progressivo",data:values,borderColor:"#1e40af",fill:false,tension:.3}]}
  });
}

/* =================== CALENDARIO =================== */
calendarMonth.value = new Date().toISOString().slice(0,7);
walletCalendarSelect.onchange = renderCalendar;
calendarMonth.onchange = renderCalendar;

function renderCalendar(){
  calendar.innerHTML="";
  const [y,m] = calendarMonth.value.split("-").map(Number);
  const wId = walletCalendarSelect.value || "total";
  const movs = wId==="total"
    ? appState.wallets.flatMap(w=>w.movimenti)
    : appState.wallets.find(w=>w.id===wId)?.movimenti || [];

  const first = new Date(y,m-1,1).getDay();
  const daysInMonth = new Date(y,m,0).getDate();

  for(let i=0;i<first;i++) calendar.innerHTML+="<div></div>";

  for(let d=1;d<=daysInMonth;d++){
    const date = `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    let e=0,s=0;
    movs.filter(x=>x.data===date).forEach(x=> x.tipo==="entrata"?e+=x.importo:s+=x.importo );
    calendar.innerHTML+=`<div class="day"><b>${d}</b><br><span class="in">+€${e}</span><br><span class="out">-€${s}</span></div>`;
  }
}

/* =================== RENDER TUTTO =================== */
function renderAll(){
  renderWallets();
  renderSaldoTotale();
  renderMovimenti();
  renderGrafici();
  renderCalendar();
}
