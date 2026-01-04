// ui.js
import { getState } from './state.js';
import Chart from 'chart.js/auto';

const state = getState();

let graficoCategorie;
let graficoSaldo;

export function renderWallets() {
  const container = document.getElementById('walletsContainer');
  container.innerHTML = '';
  state.wallets.forEach(w => {
    const div = document.createElement('div');
    div.classList.add('wallet-card');
    div.innerHTML = `<strong>${w.name}</strong><br>Saldo: €${w.balance.toFixed(2)}`;
    container.appendChild(div);
  });
}

export function renderMovements() {
  const container = document.getElementById('movementsContainer');
  container.innerHTML = '';
  state.movements.forEach(m => {
    const div = document.createElement('div');
    div.classList.add('movement-card');
    div.innerHTML = `
      ${m.date} - <strong>${m.category}</strong> (${m.type}) : €${m.amount.toFixed(2)} 
      <em>Wallet: ${m.wallet}</em>`;
    container.appendChild(div);
  });
}

export function populateWalletSelect() {
  const select = document.getElementById('movementWallet');
  select.innerHTML = '';
  state.wallets.forEach(w => {
    const opt = document.createElement('option');
    opt.value = w.name;
    opt.textContent = w.name;
    select.appendChild(opt);
  });
}

export function renderCharts() {
  // --- DATI ---
  const categorie = {};
  let saldoTotale = 0;

  state.wallets.forEach(w => saldoTotale += w.balance);

  state.movements.forEach(m => {
    if (!categorie[m.category]) categorie[m.category] = 0;
    categorie[m.category] += (m.type === 'income' ? m.amount : -m.amount);
  });

  // --- GRAFICO CATEGORIE ---
  const ctx1 = document.getElementById('graficoCategorie').getContext('2d');
  if (graficoCategorie) graficoCategorie.destroy();
  graficoCategorie = new Chart(ctx1, {
    type: 'doughnut',
    data: {
      labels: Object.keys(categorie),
      datasets: [{
        label: 'Movimenti per Categoria',
        data: Object.values(categorie),
        backgroundColor: ['#1E3A8A', '#10B981', '#6B7280', '#3B82F6', '#34D399'],
      }]
    },
    options: { responsive: true }
  });

  // --- GRAFICO SALDO ---
  const ctx2 = document.getElementById('graficoSaldo').getContext('2d');
  if (graficoSaldo) graficoSaldo.destroy();
  graficoSaldo = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: state.wallets.map(w => w.name),
      datasets: [{
        label: 'Saldo Wallet',
        data: state.wallets.map(w => w.balance),
        backgroundColor: '#3B82F6'
      }]
    },
    options: { responsive: true }
  });
}
