// app.js

import { getState, setState } from './state.js';
import { saveData, loadData } from './storage.js';
import { renderWallets, renderMovements, renderCharts, populateWalletSelect } from './ui.js';

const state = getState();

// --- INIZIALIZZAZIONE ---
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderWallets();
  renderMovements();
  renderCharts();
  populateWalletSelect();
});

// --- GESTIONE PAGINE ---
document.querySelectorAll('.toolbar button[data-page]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(btn.dataset.page).classList.add('active');
  });
});

// --- MOVIMENTI ---
document.getElementById('addMovementBtn').addEventListener('click', () => {
  document.getElementById('modalMovement').style.display = 'block';
});

document.getElementById('cancelMovementBtn').addEventListener('click', () => {
  document.getElementById('modalMovement').style.display = 'none';
});

document.getElementById('saveMovementBtn').addEventListener('click', () => {
  const walletName = document.getElementById('movementWallet').value;
  const type = document.getElementById('movementType').value; // income / expense
  const category = document.getElementById('movementCategory').value;
  const amount = parseFloat(document.getElementById('movementAmount').value);
  const date = document.getElementById('movementDate').value;

  if (!walletName || !category || !amount || !date) {
    return alert('Compila tutti i campi');
  }

  // --- AGGIUNGI MOVIMENTO ---
  state.movements.push({ wallet: walletName, type, category, amount, date });

  // --- AGGIORNA SALDO WALLET ---
  const wallet = state.wallets.find(w => w.name === walletName);
  if (wallet) {
    if (type === 'income') wallet.balance += amount;
    else if (type === 'expense') wallet.balance -= amount;
  }

  setState(state);
  saveData();

  renderMovements();
  renderWallets();
  renderCharts();
  document.getElementById('modalMovement').style.display = 'none';
});

// --- WALLET ---
document.getElementById('addWalletBtn').addEventListener('click', () => {
  document.getElementById('modalWallet').style.display = 'block';
});

document.getElementById('cancelWalletBtn').addEventListener('click', () => {
  document.getElementById('modalWallet').style.display = 'none';
});

document.getElementById('saveWalletBtn').addEventListener('click', () => {
  const name = document.getElementById('walletName').value;
  const balance = parseFloat(document.getElementById('walletBalance').value);

  if (!name || isNaN(balance)) return alert('Compila tutti i campi');

  state.wallets.push({ name, balance });
  setState(state);
  saveData();

  renderWallets();
  populateWalletSelect();
  document.getElementById('modalWallet').style.display = 'none';
});

// --- DARK MODE ---
document.getElementById('darkModeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
