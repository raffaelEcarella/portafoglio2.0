function saveState(){
  localStorage.setItem("portafoglio2_0", JSON.stringify(appState));
}

function loadState(){
  const data = localStorage.getItem("portafoglio2_0");
  if(data){
    Object.assign(appState, JSON.parse(data));
  }
}
