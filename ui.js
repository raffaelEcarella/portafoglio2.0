// Contiene funzioni UI aggiuntive se vuoi animazioni o notifiche
const ui = {
  notifica(msg) {
    const div = document.createElement('div');
    div.className = 'notifica';
    div.textContent = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  }
};
