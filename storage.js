function saveState(){
  localStorage.setItem("p2_state", JSON.stringify(appState));
}

function loadState(){
  const d = localStorage.getItem("p2_state");
  if(d) Object.assign(appState, JSON.parse(d));
  if(appState.ui.darkMode) document.body.classList.add("dark");
}
