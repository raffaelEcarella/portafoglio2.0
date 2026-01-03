// CC99 - app.js Portafoglio 2.0

loadState(); // carica stato salvato

// --- AGGIORNAMENTO SALDI ---
function updateSaldo() {
  appState.finance.wallets.forEach(w=>{
    w.saldo = w.movimenti.reduce((acc,m)=> m.tipo==="entrata"?acc+m.importo:acc-m.importo,0);
  });
  renderHomeWallets();
  renderGrafici();
  saveState();
}

// --- AGGIUNGI MOVIMENTO ---
function aggiungiMovimentoPrompt(tipo) {
  const wallets = appState.finance.wallets;
  if(wallets.length === 0){
    alert("Prima crea un portafoglio!");
    return;
  }
  const walletId = parseInt(prompt(`Seleziona ID portafoglio:\n${wallets.map(w=>w.id + ": " + w.name).join("\n")}`));
  const wallet = wallets.find(w=>w.id===walletId);
  if(!wallet){ alert("Portafoglio non valido!"); return; }

  const descrizione = prompt("Descrizione:");
  const importo = parseFloat(prompt("Importo:"));
  const data = prompt("Data (YYYY-MM-DD):", new Date().toISOString().split("T")[0]);
  let ricorrenza = 0;
  if(tipo==="spesa") {
    ricorrenza = parseInt(prompt("Ricorrenza mensile (0 per nessuna):", "0"));
  }

  const mov = {descrizione, importo, tipo, data, ricorrenza};
  wallet.movimenti.push(mov);

  // se ricorrenza > 0, aggiunge per i mesi successivi
  if(ricorrenza>0){
    let d = new Date(data);
    for(let i=1;i<=ricorrenza;i++){
      d.setMonth(d.getMonth()+1);
      wallet.movimenti.push({
        descrizione: descrizione + " (ricorrenza)",
        importo,
        tipo,
        data: d.toISOString().split("T")[0],
        ricorrenza:0
      });
    }
  }

  saveState();
  updateSaldo();
  renderMovimenti();
}

// --- RENDER HOME PORTAFOGLI ---
function renderHomeWallets(){
  const container = document.getElementById("homeWallets");
  container.innerHTML = "";
  let saldoTotale = 0;
  appState.finance.wallets.forEach(w => {
    const walletSaldo = w.movimenti.reduce((acc,m)=> m.tipo==="entrata"?acc+m.importo:acc-m.importo,0);
    saldoTotale += walletSaldo;
    const div = document.createElement("div");
    div.className = "wallet-card";
    div.style.background = w.color;
    div.style.padding="10px";
    div.style.margin="5px";
    div.style.borderRadius="8px";
    div.innerHTML = `<strong>${w.name}</strong><br>Saldo: €${walletSaldo}`;
    container.appendChild(div);
  });
  // saldo cumulativo
  const totalDiv = document.createElement("div");
  totalDiv.className = "wallet-card";
  totalDiv.style.background="#f2f2f2";
  totalDiv.style.color="#000";
  totalDiv.style.padding="10px";
  totalDiv.style.margin="5px";
  totalDiv.style.borderRadius="8px";
  totalDiv.innerHTML = `<strong>Saldo Cumulativo</strong><br>€${saldoTotale}`;
  container.prepend(totalDiv);
}

// --- RENDER SELECT PORTAFOGLI ---
function renderWalletSelects(){
  const selects = ["filterWallet","calendarioWallet"];
  selects.forEach(id=>{
    const sel = document.getElementById(id);
    if(sel){
      sel.innerHTML = `<option value="0">Tutti i portafogli</option>`;
      appState.finance.wallets.forEach(w=>{
        const opt = document.createElement("option");
        opt.value = w.id;
        opt.textContent = w.name;
        sel.appendChild(opt);
      });
    }
  });
}

// --- RENDER MOVIMENTI FILTRATI ---
function renderMovimenti(){
  const list = document.getElementById("movimentiList");
  list.innerHTML = "";
  let walletFilter = parseInt(document.getElementById("filterWallet").value);
  let categoria = document.getElementById("filterCategoria").value.toLowerCase();
  let da = document.getElementById("filterDa").value;
  let a = document.getElementById("filterA").value;

  let movs = [];
  appState.finance.wallets.forEach(w=>{
    if(walletFilter===0 || w.id===walletFilter){
      movs = movs.concat(w.movimenti.map(m=>({...m,walletName:w.name})));
    }
  });

  movs = movs.filter(m=>{
    if(categoria && !m.descrizione.toLowerCase().includes(categoria)) return false;
    if(da && m.data<da) return false;
    if(a && m.data>a) return false;
    return true;
  });

  movs.sort((a,b)=>new Date(b.data)-new Date(a.data));

  movs.forEach(m=>{
    const li = document.createElement("li");
    li.textContent = `${m.data} - [${m.walletName}] ${m.tipo.toUpperCase()}: €${m.importo} (${m.descrizione})`;
    list.appendChild(li);
  });
}

// --- RENDER CALENDARIO ---
function renderCalendario(mese, walletId){
  const table = document.getElementById("calendarioTable").querySelector("tbody");
  table.innerHTML="";
  if(!mese) mese = new Date().toISOString().slice(0,7);
  const [year, month] = mese.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();

  for(let d=1; d<=daysInMonth; d++){
    const dayStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    let entrate=0, spese=0;
    appState.finance.wallets.forEach(w=>{
      if(walletId===0 || w.id===walletId){
        w.movimenti.forEach(m=>{
          if(m.data===dayStr){
            if(m.tipo==="entrata") entrate+=m.importo;
            else spese+=m.importo;
          }
        });
      }
    });
    const row = document.createElement("tr");
    row.innerHTML = `<td>${dayStr}</td><td>€${entrate}</td><td>€${spese}</td>`;
    table.appendChild(row);
  }
}

// --- RENDER GRAFICI ---
let chartCategorie=null;
let chartSaldo=null;

function renderGrafici(){
  const labels = [];
  const saldoData = [];
  let entrateTot=0, speseTot=0, traguardo = appState.finance.traguardo;

  appState.finance.wallets.forEach(w=>{
    if(!w.includeInCharts) return;
    w.movimenti.forEach(m=>{
      labels.push(m.data);
      saldoData.push(m.tipo==="entrata"?m.importo:-m.importo);
      if(m.tipo==="entrata") entrateTot+=m.importo;
      else speseTot+=m.importo;
    });
  });

  // grafico categorie
  const ctx1 = document.getElementById("graficoCategorie").getContext("2d");
  if(chartCategorie) chartCategorie.destroy();
  chartCategorie = new Chart(ctx1,{
    type:'doughnut',
    data:{
      labels:['Entrate','Spese','Traguardo'],
      datasets:[{
        data:[entrateTot,speseTot,traguardo],
        backgroundColor:[
          appState.ui.chartColors.entrate,
          appState.ui.chartColors.spese,
          appState.ui.chartColors.traguardo
        ]
      }]
    },
    options:{
      responsive:true,
      plugins:{
        legend:{display:true, position:'bottom'},
        tooltip:{callbacks:{label:ctx=>`${ctx.label}: €${ctx.raw} (${((ctx.raw/(entrateTot+speseTot+traguardo))*100).toFixed(1)}%)`}}
      }
    }
  });

  // grafico saldo progressivo
  const ctx2 = document.getElementById("graficoSaldo").getContext("2d");
  if(chartSaldo) chartSaldo.destroy();
  chartSaldo = new Chart(ctx2,{
    type:'bar',
    data:{
      labels,
      datasets:[{
        label:'Saldo',
        data: saldoData,
        backgroundColor: appState.ui.chartColors.saldo
      }]
    },
    options:{
      responsive:true,
      plugins:{
        legend:{display:true, position:'bottom'},
        tooltip:{callbacks:{label:ctx=>`€${ctx.raw}`}}
      },
      scales:{x:{title:{display:true,text:'Data'}},y:{title:{display:true,text:'Saldo'}}}
    }
  });
}

// --- INIZIALIZZAZIONE ---
window.addEventListener("load", ()=>{
  initWallets();
  updateSaldo();
  renderMovimenti();
});

// --- FUNZIONI DARK MODE ---
document.getElementById("darkToggle").onclick = toggleDarkMode;
document.getElementById("darkToggle2").onclick = toggleDarkMode;

function toggleDarkMode(){
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
}

// --- COLORI GRAFICI ---
document.getElementById("colorEntrate").onchange = e=>{appState.ui.chartColors.entrate=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorSpese").onchange = e=>{appState.ui.chartColors.spese=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorTraguardo").onchange = e=>{appState.ui.chartColors.traguardo=e.target.value; saveState(); renderGrafici();}
document.getElementById("colorSaldo").onchange = e=>{appState.ui.chartColors.saldo=e.target.value; saveState(); renderGrafici();}

// --- NAVIGAZIONE PAGINE ---
document.querySelectorAll("[data-page]").forEach(btn=>{ btn.onclick=()=>showPage(btn.dataset.page); });
document.querySelectorAll(".homeBtn").forEach(btn=>{ btn.onclick=()=>showPage("menu"); });

function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const s=document.getElementById(page);
  if(s) s.classList.add("active");
  if(page==="grafici") renderGrafici();
}

// --- FILTRI MOVIMENTI ---
document.getElementById("applyFiltersBtn").onclick = renderMovimenti;
document.getElementById("clearFiltersBtn").onclick = ()=>{
  document.getElementById("filterCategoria").value="";
  document.getElementById("filterDa").value="";
  document.getElementById("filterA").value="";
  document.getElementById("filterWallet").value="0";
  renderMovimenti();
};

// --- FUNZIONE AGGIUNGI WALLET (max 6) ---
function initWallets(){
  renderHomeWallets();
  renderWalletSelects();
}
