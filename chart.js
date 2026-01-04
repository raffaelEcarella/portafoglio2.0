// chart.js
import Chart from 'chart.js/auto';

export function creaDoughnutChart(ctx, labels, data, colors) {
  return new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors }] },
    options: { responsive: true }
  });
}

export function creaBarChart(ctx, labels, data, color) {
  return new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ data, backgroundColor: color }] },
    options: { responsive: true }
  });
}
