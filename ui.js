document.querySelectorAll("[data-page]").forEach(b=>{
  b.onclick=()=>showPage(b.dataset.page);
});
document.querySelectorAll(".homeBtn").forEach(b=>{
  b.onclick=()=>showPage("home");
});

function showPage(p){
  document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
  document.getElementById(p).classList.add("active");
}

darkToggle.onclick=()=>{
  document.body.classList.toggle("dark");
  appState.ui.darkMode=document.body.classList.contains("dark");
  saveState();
};
