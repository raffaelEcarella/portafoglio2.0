// app.js

// Inizializza app
document.addEventListener("DOMContentLoaded", () => {
    UI.renderWalletOptions();
    UI.renderMovements();
    ChartModule.initCharts();

    // Bottoni
    document.getElementById("btn-add-income").addEventListener("click", () => {
        UI.showMovementForm("income");
    });

    document.getElementById("btn-add-expense").addEventListener("click", () => {
        UI.showMovementForm("expense");
    });

    // Filtri
    document.getElementById("filter-wallet").addEventListener("change", UI.applyFilters);
    document.getElementById("filter-category").addEventListener("change", UI.applyFilters);
});
