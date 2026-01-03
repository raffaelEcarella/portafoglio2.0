loadState();
updateSaldo();
renderMovimenti();

function updateSaldo() {
  appState.finance.saldo = appState.finance.movimenti.reduce(
    (acc, m) => m.tipo === "entrata" ? acc + m.importo : acc - m.importo, 0
  );
  document.getElementById("saldoVal").textContent = "€" + appState.finance.saldo;
  saveState();
}

document.getElementById("saveMovimentoBtn").onclick = () => {
  const descrizione = movDescrizione.value;
  const importo = parseFloat(movImporto.value);
  const data = movData.value;
  const tipo = movTipo.value;
  const ric = parseInt(movRicorrenza.value) || 0;

  if (!descrizione || !importo || !data) return alert("Compila tutti i campi");

  for (let i = 0; i <= ric; i++) {
    const d = new Date(data);
    d.setMonth(d.getMonth() + i);

    appState.finance.movimenti.push({
      descrizione,
      importo,
      tipo,
      data: d.toISOString().split("T")[0]
    });
  }

  saveState();
  updateSaldo();
  renderMovimenti();
  movimentoModal.style.display = "none";
};

function renderMovimenti() {
  const ul = document.getElementById("movimentiList");
  ul.innerHTML = "";
  appState.finance.movimenti.forEach(m => {
    const li = document.createElement("li");
    li.textContent = `${m.data} - ${m.descrizione} (${m.tipo}) €${m.importo}`;
    ul.appendChild(li);
  });
}
