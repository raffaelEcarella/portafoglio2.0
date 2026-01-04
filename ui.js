document.querySelectorAll(".toolbar button").forEach(b=>{
  b.onclick=()=>showPage(b.dataset.page);
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

let chart1=null,chart2=null;
function renderGrafici(){
  const w=appState.finance.wallets;
  const entr=w.flatMap(x=>x.movimenti.filter(m=>m.tipo==="entrata"))
    .reduce((a,b)=>a+b.importo,0);
  const spe=w.flatMap(x=>x.movimenti.filter(m=>m.tipo==="spesa"))
    .reduce((a,b)=>a+b.importo,0);

  if(chart1) chart1.destroy();
  chart1=new Chart(graficoCategorie,{
    type:"doughnut",
    data:{
      labels:["Entrate","Spese"],
      datasets:[{data:[entr,spe],
        backgroundColor:["#22c55e","#ef4444"]}]
    }
  });

  const mov=w.flatMap(x=>x.movimenti).sort((a,b)=>a.data.localeCompare(b.data));
  let s=0;
  const prog=mov.map(m=>{
    s+=m.tipo==="entrata"?m.importo:-m.importo;
    return s;
  });

  if(chart2) chart2.destroy();
  chart2=new Chart(graficoSaldo,{
    type:"line",
    data:{
      labels:mov.map(m=>m.data),
      datasets:[{data:prog,borderColor:"#3b82f6"}]
    }
  });
}
