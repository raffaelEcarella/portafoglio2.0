// state.js

const state = {
    wallets: [
        { id: "wallet1", name: "Conto Corrente" },
        { id: "wallet2", name: "Carta di Credito" }
    ],
    movements: JSON.parse(localStorage.getItem("movements")) || [],
    filters: { wallet: "all", category: "all" },

    addMovement(movement) {
        this.movements.push(movement);
        storage.saveMovements(this.movements);
    },

    getFilteredMovements() {
        return this.movements.filter(m => 
            (this.filters.wallet === "all" || m.walletId === this.filters.wallet) &&
            (this.filters.category === "all" || m.category === this.filters.category)
        );
    }
};
