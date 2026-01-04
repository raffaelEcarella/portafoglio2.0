// CC99 - state.js
const appState = {
  finance:{wallets:[]},
  darkMode:false
};

function loadState(){
  const s = localStorage.getItem("appState");
  if(s) Object.assign(appState, JSON.parse(s));
}
function saveState(){
  localStorage.setItem("appState",JSON.stringify(appState));
}
