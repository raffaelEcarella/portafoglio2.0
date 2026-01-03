loadState();
renderAll();

function renderAll(){
  renderWallets();
  renderSaldo();
  renderMovimenti();
  renderCalendar();
}

function addWallet(){
  if(appState.wallets.length>=6) return alert("Max 6 portafogli");
  const nome=prompt("Nome portafoglio");
  const colore=prompt("Colore HEX","#10b981");
  appState.wallets.push({
    id:Date.now()+"",
    nome,colore,includeCharts:true,movimenti:[]
  });
  saveState(); renderAll();
}

function renderWallets(){
  walletList.innerHTML="";
  walletFilter.innerHTML="";
  walletChartSelect.innerHTML="";
  walletCalendarSelect.innerHTML="";
  movWallet.innerHTML="";

  appState.wallets.forEach(w=>{
    const saldo=w.movimenti.reduce((a,m)=>a+(m.tipo==="entrata"?m.importo:-m.importo),0);
    walletList.innerHTML+=`
      <div class="wallet" style="border-color:${w.colore}">
        <span>${w.nome}</span>
        <b>€${saldo}</b>
      </div>`;
    walletFilter.innerHTML+=`<option value="${w.id}">${w.nome}</option>`;
    walletChartSelect.innerHTML+=`<option value="${w.id}">${w.nome}</option>`;
    walletCalendarSelect.innerHTML+=`<option value="${w.id}">${w.nome}</option>`;
    if(w.id!=="total") movWallet.innerHTML+=`<option value="${w.id}">${w.nome}</option>`;
  });
}

function renderSaldo(){
  let t=0;
  appState.wallets.forEach(w=>w.movimenti.forEach(m=>{
    t+=m.tipo==="entrata"?m.importo:-m.importo;
  }));
  saldoTotale.textContent="€"+t;
}

function openModal(tipo){
  movimentoModal.style.display="flex";
  movTipo.value=tipo;
  movData.valueAsDate=new Date();
}

function closeModal(){movimentoModal.style.display="none"}

function saveMovimento(){
  const w=appState.wallets.find(x=>x.id===movWallet.value);
  for(let i=0;i<=+movRicorrenza.value;i++){
    const d=new Date(movData.value);
    d.setMonth(d.getMonth()+i);
    w.movimenti.push({
      descrizione:movDescrizione.value,
      importo:+movImporto.value,
      tipo:movTipo.value,
      data:d.toISOString().split("T")[0]
    });
  }
  saveState(); closeModal(); renderAll();
}

function renderMovimenti(){
  movimentiList.innerHTML="";
  const w=appState.wallets.find(x=>x.id===walletFilter.value);
  if(!w) return;
  w.movimenti.forEach(m=>{
    movimentiList.innerHTML+=`
      <li>
        ${m.data} ${m.descrizione}
        <span class="${m.tipo==="entrata"?"in":"out"}">€${m.importo}</span>
      </li>`;
  });
}

function renderCalendar(){
  calendar.innerHTML="";
  const wId=walletCalendarSelect.value;
  const movs=wId==="total"
    ? appState.wallets.flatMap(w=>w.movimenti)
    : appState.wallets.find(w=>w.id===wId)?.movimenti||[];

  const now=new Date();
  const y=now.getFullYear(),m=now.getMonth();
  const first=new Date(y,m,1).getDay();
  const days=new Date(y,m+1,0).getDate();

  for(let i=0;i<first;i++) calendar.innerHTML+="<div></div>";

  for(let d=1;d<=days;d++){
    const date=`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    let e=0,s=0;
    movs.filter(x=>x.data===date).forEach(x=>{
      x.tipo==="entrata"?e+=x.importo:s+=x.importo;
    });
    calendar.innerHTML+=`
      <div class="day">
        <b>${d}</b><br>
        <span class="in">+€${e}</span><br>
        <span class="out">-€${s}</span>
      </div>`;
  }
}
