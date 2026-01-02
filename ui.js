// Navigazione
document.querySelectorAll("[data-page]").forEach(btn=>{
  btn.onclick=()=>showPage(btn.dataset.page);
});
document.querySelectorAll(".homeBtn").forEach(btn=>{
  btn.onclick=()=>showPage("menu");
});

function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const s=document.getElementById(page);
  if(s) s.classList.add("active");
}

// Filtri Movimenti
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

// Calendario
function renderCalendario(){
  const tbody=document.querySelector("#calendarioTable tbody");
  tbody.innerHTML="";
  const movs=appState.finance.movimenti;
  const mapData={};
  movs.forEach(m=>{
    if(!mapData[m.data]) mapData[m.data]={entrate:0,spese:0};
    if(m.tipo==="entrata") mapData[m.data].entrate+=m.importo;
    else mapData[m.data].spese+=m.importo;
  });
  Object.keys(mapData).sort().forEach(d=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${d}</td><td>€${mapData[d].entrate.toFixed(2)}</td><td>€${mapData[d].spese.toFixed(2)}</td>`;
    tbody.appendChild(tr);
  });
}

// Grafici e previsioni (vedi codice app.js precedente)
