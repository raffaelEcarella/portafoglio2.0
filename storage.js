// storage.js

const storage = {
    saveMovements(movements) {
        localStorage.setItem("movements", JSON.stringify(movements));
    },
    loadMovements() {
        return JSON.parse(localStorage.getItem("movements")) || [];
    }
};
