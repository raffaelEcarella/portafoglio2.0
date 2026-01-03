loadState();
renderWallets();
updateSaldo();
renderMovimenti();
renderCalendario();

let chart;

function renderWallets(){
  walletSelect.innerHTML = movWallet.innerHTML = "";
  appState.wallets.forEach(w=>{
    walletSelect.innerHTML += `<option value="${w.id}">${w.nome}</option>`;
    if(w.id!=="total")
      movWallet.innerHTML += `<option value="${w.id}">${w.nome}</option>`;
  });
}

function addWallet(){
  if(appState.wallets.length>=6) return alert("Max 6 portafogli");
  const nome=prompt("Nome");
  const colore=prompt("Colore HEX","#22c55e");
  appState.wallets.push({
    id:Date.now()+"",
    nome,
    colore,
    includeCharts:true,
    movimenti:[]
  });
  saveState(); renderWallets();
}

function openModal(tipo){
  movimentoModal.style.display="flex";
  movTipo.value=tipo;
  movData.valueAsDate=new Date();
}

function closeModal(){movimentoModal.style.display="none"}

saveMovimentoBtn.onclick=()=>{
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
  saveState(); closeModal();
  updateSaldo(); renderMovimenti(); renderCalendario();
};

function updateSaldo(){
  let t=0;
  appState.wallets.forEach(w=>w.movimenti.forEach(m=>{
    t+=m.tipo==="entrata"?m.importo:-m.importo;
  }));
  saldoVal.textContent="€"+t;
}

function renderMovimenti(){
  movimentiList.innerHTML="";
  appState.wallets.forEach(w=>{
    w.movimenti.forEach(m=>{
      movimentiList.innerHTML+=`<li>${w.nome} | ${m.data} | €${m.importo}</li>`;
    });
  });
}

function renderCalendario(){
  calendarGrid.innerHTML="";
  const map={};
  appState.wallets.forEach(w=>{
    w.movimenti.forEach(m=>{
      if(!map[m.data]) map[m.data]={e:0,s:0};
      m.tipo==="entrata"?map[m.data].e+=m.importo:map[m.data].s+=m.importo;
    });
  });
  Object.keys(map).sort().forEach(d=>{
    calendarGrid.innerHTML+=`
      <div class="day">
        <b>${d}</b><br>+€${map[d].e}<br>-€${map[d].s}
      </div>`;
  });
}

function exportCSV(){
  let c="Data,Descrizione,Importo,Tipo,Portafoglio\n";
  appState.wallets.forEach(w=>w.movimenti.forEach(m=>{
    c+=`${m.data},${m.descrizione},${m.importo},${m.tipo},${w.nome}\n`;
  }));
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([c]));
  a.download="movimenti.csv";
  a.click();
}
