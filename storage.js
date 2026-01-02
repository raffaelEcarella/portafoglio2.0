function saveState(){
  localStorage.setItem("portafoglio2_0", JSON.stringify(appState));
}

function loadState(){
  const data = localStorage.getItem("portafoglio2_0");
  if(data){
    const parsed = JSON.parse(data);
    Object.assign(appState, parsed);
  }
}
