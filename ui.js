// ui.js

const UI = (() => {
    function renderWalletOptions() {
        const walletSelect = document.getElementById("filter-wallet");
        walletSelect.innerHTML = `<option value="all">Tutti i Portafogli</option>`;
        state.wallets.forEach(wallet => {
            const option = document.createElement("option");
            option.value = wallet.id;
            option.textContent = wallet.name;
            walletSelect.appendChild(option);
        });
    }

    function renderMovements() {
        const list = document.getElementById("movements-list");
        list.innerHTML = "";
        const filtered = state.getFilteredMovements();
        filtered.forEach(m => {
            const li = document.createElement("li");
            li.textContent = `${m.date} - ${m.category} - ${m.amount}€ (${m.type})`;
            list.appendChild(li);
        });
        ChartModule.updateCharts(filtered);
    }

    function showMovementForm(type) {
        const amount = prompt(`Inserisci importo (${type === "income" ? "Entrata" : "Spesa"}):`);
        if (!amount || isNaN(amount)) return alert("Importo non valido");
        const category = prompt("Categoria:");
        if (!category) return alert("Categoria obbligatoria");
        const walletId = prompt("Portafoglio (inserire ID):");
        if (!walletId) return alert("Portafoglio obbligatorio");

        state.addMovement({
            id: Date.now(),
            type,
            amount: parseFloat(amount),
            category,
            walletId,
            date: new Date().toLocaleDateString()
        });
        renderMovements();
    }

    function applyFilters() {
        state.filters.wallet = document.getElementById("filter-wallet").value;
        state.filters.category = document.getElementById("filter-category").value;
        renderMovements();
    }

    return {
        renderWalletOptions,
        renderMovements,
        showMovementForm,
        applyFilters
    };
})();
