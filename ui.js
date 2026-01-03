document.querySelectorAll("[data-page]").forEach(b=>{
  b.onclick=()=>showPage(b.dataset.page);
});
document.querySelectorAll(".homeBtn").forEach(b=>{
  b.onclick=()=>showPage("menu");
});

function showPage(p){
  document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
  document.getElementById(p).classList.add("active");
  if(p==="grafici") renderGrafici();
}

darkToggle.onclick=()=>{
  document.body.classList.toggle("dark");
  appState.ui.darkMode=document.body.classList.contains("dark");
  saveState();
};

function renderGrafici(){
  if(chart) chart.destroy();
  const labels=[],data=[];
  const map={};

  appState.wallets.filter(w=>w.includeCharts).forEach(w=>{
    w.movimenti.forEach(m=>{
      const k=periodSelect.value==="month"?m.data.slice(0,7):m.data;
      map[k]=(map[k]||0)+(m.tipo==="entrata"?m.importo:-m.importo);
    });
  });

  for(const k in map){labels.push(k);data.push(map[k]);}

  chart=new Chart(graficoSaldo,{
    type:"line",
    data:{labels,datasets:[{data,label:"Saldo"}]}
  });
}
