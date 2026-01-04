// chart.js

const ChartModule = (() => {
    let balanceChart, categoryChart;

    function initCharts() {
        const ctxBalance = document.getElementById("chart-balance").getContext("2d");
        balanceChart = new Chart(ctxBalance, {
            type: "line",
            data: {
                labels: [],
                datasets: [{
                    label: "Saldo",
                    data: [],
                    borderColor: "#1E90FF",
                    backgroundColor: "rgba(30,144,255,0.2)",
                    tension: 0.3
                }]
            }
        });

        const ctxCategory = document.getElementById("chart-category").getContext("2d");
        categoryChart = new Chart(ctxCategory, {
            type: "doughnut",
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: ["#1E90FF", "#32CD32", "#778899", "#20B2AA", "#4682B4"]
                }]
            }
        });
    }

    function updateCharts(filteredMovements) {
        // Balance chart
        let balance = 0;
        const labels = [];
        const data = [];
        filteredMovements.forEach(m => {
            balance += m.type === "income" ? m.amount : -m.amount;
            labels.push(m.date);
            data.push(balance);
        });
        balanceChart.data.labels = labels;
        balanceChart.data.datasets[0].data = data;
        balanceChart.update();

        // Category chart
        const categoryTotals = {};
        filteredMovements.forEach(m => {
            if (!categoryTotals[m.category]) categoryTotals[m.category] = 0;
            categoryTotals[m.category] += m.amount;
        });
        categoryChart.data.labels = Object.keys(categoryTotals);
        categoryChart.data.datasets[0].data = Object.values(categoryTotals);
        categoryChart.update();
    }

    return {
        initCharts,
        updateCharts
    };
})();
