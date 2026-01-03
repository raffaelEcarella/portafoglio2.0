// Navigazione
document.querySelectorAll("[data-page]").forEach(b =>
  b.onclick = () => showPage(b.dataset.page)
);
document.querySelectorAll(".homeBtn").forEach(b =>
  b.onclick = () => showPage("menu")
);

function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Modal
addEntrataBtn.onclick = () => openModal("entrata");
addSpesaBtn.onclick = () => openModal("spesa");

function openModal(tipo) {
  movimentoModal.style.display = "flex";
  movTipo.value = tipo;
  modalTitle.textContent = tipo === "entrata" ? "Aggiungi Entrata" : "Aggiungi Spesa";
  movDescrizione.value = "";
  movImporto.value = "";
  movData.valueAsDate = new Date();

  ricLabel.style.display = tipo === "spesa" ? "block" : "none";
  movRicorrenza.style.display = tipo === "spesa" ? "block" : "none";
}

cancelMovimentoBtn.onclick = () =>
  movimentoModal.style.display = "none";

// Dark mode
darkToggle.onclick = toggleDark;
darkToggle2.onclick = toggleDark;

function toggleDark() {
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
}
