// NAVIGAZIONE
function initNav() {
    const pagine = ["home", "movimenti", "grafici", "impostazioni"];
    pagine.forEach(p => {
        document.getElementById(`nav-${p}`).addEventListener("click", () => mostraPagina(p));
    });
}

function mostraPagina(pagina) {
    document.querySelectorAll(".page").forEach(sec => sec.classList.remove("active"));
    document.getElementById(`page-${pagina}`).classList.add("active");
}

// MODALE
function initModal() {
    const modal = document.getElementById("modal-movimento");
    const close = modal.querySelector(".close");
    close.addEventListener("click", chiudiModal);
    window.addEventListener("click", (e) => {
        if(e.target === modal) chiudiModal();
    });
}

function apriModal() {
    document.getElementById("modal-movimento").style.display = "block";
}

function chiudiModal() {
    document.getElementById("modal-movimento").style.display = "none";
}

// RENDER MOVIMENTI
function renderMovimenti() {
    const tbody = document.querySelector("#movimenti-table tbody");
    tbody.innerHTML = "";
    appState.movimenti.forEach(m => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${new Date(m.data).toLocaleDateString()}</td>
                        <td>${m.desc}</td>
                        <td>${m.tipo}</td>
                        <td>${m.importo.toFixed(2)}</td>`;
        tbody.appendChild(tr);
    });
}

// IMPOSTAZIONI
function initSettings() {
    const darkmode = document.getElementById("toggle-darkmode");
    darkmode.checked = appState.darkMode;
    darkmode.addEventListener("change", () => {
        appState.darkMode = darkmode.checked;
        document.body.classList.toggle("darkmode", darkmode.checked);
        salvaSettings();
    });
}

// GRAFICO
let chart;
function initGrafico() {
    const ctx = document.getElementById("graficoMovimenti").getContext("2d");
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: appState.movimenti.map(m => new Date(m.data).toLocaleDateString()),
            datasets: [{
                label: 'Movimenti',
                data: appState.movimenti.map(m => m.tipo === "entrata" ? m.importo : -m.importo),
                backgroundColor: appState.movimenti.map(m => m.tipo === "entrata" ? "#4caf50" : "#f44336")
            }]
        },
        options: { responsive: true }
    });
}

function aggiornaGrafico() {
    chart.data.labels = appState.movimenti.map(m => new Date(m.data).toLocaleDateString());
    chart.data.datasets[0].data = appState.movimenti.map(m => m.tipo === "entrata" ? m.importo : -m.importo);
    chart.data.datasets[0].backgroundColor = appState.movimenti.map(m => m.tipo === "entrata" ? "#4caf50" : "#f44336");
    chart.update();
}
