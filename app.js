loadState();

function getWallet(id){
  return appState.finance.wallets.find(w=>w.id===id);
}

function updateSaldi(){
  let tot=0;
  appState.finance.wallets.forEach(w=>{
    w.saldo = w.movimenti.reduce(
      (a,m)=>m.tipo==="entrata"?a+m.importo:a-m.importo,0
    );
    tot+=w.saldo;
  });
  saldoVal.textContent=`€${tot.toFixed(2)}`;
  saveState();
  renderWallets();
}

function renderWallets(){
  walletsContainer.innerHTML="";
  appState.finance.wallets.forEach(w=>{
    const d=document.createElement("div");
    d.className="wallet-card";
    d.innerHTML=`${w.name}<strong>€${w.saldo.toFixed(2)}</strong>`;
    walletsContainer.appendChild(d);
  });
  populateSelects();
}

function populateSelects(){
  [filterWallet,movWallet].forEach(sel=>{
    sel.innerHTML=`<option value="">Tutti</option>`;
    appState.finance.wallets.forEach(w=>{
      const o=document.createElement("option");
      o.value=w.id;
      o.textContent=w.name;
      sel.appendChild(o);
    });
  });
}

function renderMovimenti(){
  movimentiList.innerHTML="";
  let movs=appState.finance.wallets.flatMap(w=>
    w.movimenti.map(m=>({...m,wallet:w.name,id:w.id}))
  );

  if(filterWallet.value) movs=movs.filter(m=>m.id==filterWallet.value);
  if(filterTipo.value) movs=movs.filter(m=>m.tipo===filterTipo.value);
  if(filterDa.value) movs=movs.filter(m=>m.data>=filterDa.value);
  if(filterA.value) movs=movs.filter(m=>m.data<=filterA.value);

  movs.sort((a,b)=>b.data.localeCompare(a.data));
  movs.forEach(m=>{
    const li=document.createElement("li");
    li.textContent=`${m.data} | ${m.wallet} | ${m.descrizione} | €${m.importo}`;
    movimentiList.appendChild(li);
  });
}

addWalletBtn.onclick=()=>{
  const name=prompt("Nome portafoglio");
  if(!name) return;
  appState.finance.wallets.push({
    id:Date.now(),
    name,
    movimenti:[],
    saldo:0
  });
  updateSaldi();
};

addEntrataBtn.onclick=()=>openMovimento("entrata");
addSpesaBtn.onclick=()=>openMovimento("spesa");

function openMovimento(tipo){
  movimentoModal.style.display="flex";
  movTipo.value=tipo;
  movData.value=new Date().toISOString().split("T")[0];
}

saveMovimentoBtn.onclick=()=>{
  const w=getWallet(+movWallet.value);
  if(!w) return;
  w.movimenti.push({
    descrizione:movDesc.value,
    importo:+movImporto.value,
    tipo:movTipo.value,
    data:movData.value
  });
  movimentoModal.style.display="none";
  updateSaldi();
  renderMovimenti();
};

cancelMovimentoBtn.onclick=()=>movimentoModal.style.display="none";
applyFiltersBtn.onclick=renderMovimenti;

updateSaldi();
renderMovimenti();
