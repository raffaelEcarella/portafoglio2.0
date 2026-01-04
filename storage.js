// CC99 - storage.js
function saveState(){
  localStorage.setItem("portafoglio2_state", JSON.stringify(appState));
}

function loadState(){
  const data = localStorage.getItem("portafoglio2_state");
  if(data){
    Object.assign(appState, JSON.parse(data));
  }
  if(appState.ui.darkMode){
    document.body.classList.add("dark");
  }
}
