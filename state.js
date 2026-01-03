<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Portafoglio 2.0</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>

<!-- TOP BAR -->
<header class="topbar">
  <h1>Portafoglio 2.0</h1>
</header>

<!-- MAIN CONTAINER -->
<main class="main-container">

  <!-- HOME / SALDO -->
  <section id="home" class="page active">
    <div id="walletsContainer" class="wallets-grid"></div>
    <div class="wallet-card cumulative">
      <h3>Saldo Cumulativo</h3>
      <div id="saldoVal">€0</div>
      <button id="addWalletBtn">+ Aggiungi Portafoglio</button>
    </div>
  </section>

  <!-- MOVIMENTI -->
  <section id="movimenti" class="page">
    <div class="wallet-card">
      <h3>Movimenti</h3>
      <div class="filters">
        <label>Portafoglio:</label>
        <select id="filterWalletMovimenti"></select>
        <label>Categoria:</label>
        <input type="text" id="filterCategoria">
        <label>Da:</label>
        <input type="date" id="filterDa">
        <label>A:</label>
        <input type="date" id="filterA">
        <div class="btn-row">
          <button id="applyFiltersBtn">Applica Filtri</button>
          <button id="clearFiltersBtn">Pulisci Filtri</button>
        </div>
      </div>
      <ul id="movimentiList"></ul>
      <div class="btn-row">
        <button id="addEntrataBtn">+ Entrata</button>
        <button id="addSpesaBtn">+ Spesa</button>
      </div>
    </div>
  </section>

  <!-- GRAFICI -->
  <section id="grafici" class="page">
    <div class="wallet-card">
      <h3>Grafico Categorie</h3>
      <canvas id="graficoCategorie"></canvas>
    </div>
    <div class="wallet-card">
      <h3>Saldo Progressivo</h3>
      <canvas id="graficoSaldo"></canvas>
    </div>
  </section>

  <!-- CALENDARIO -->
  <section id="calendario" class="page">
    <div class="wallet-card">
      <h3>Calendario Movimenti</h3>
      <label>Portafoglio:</label>
      <select id="filterWalletCalendario"></select>
      <label>Mese:</label>
      <input type="month" id="filterMeseCalendario">
      <table id="calendarioTable">
        <thead>
          <tr><th>Data</th><th>Entrate</th><th>Spese</th></tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </section>

  <!-- IMPOSTAZIONI -->
  <section id="impostazioni" class="page">
    <div class="wallet-card">
      <h3>Impostazioni</h3>
      <label>Dark Mode:</label>
      <button id="darkToggle">🌙 Toggle Dark Mode</button>
      <div id="walletSettings"></div>
      <div class="settings-footer">CREATED BY CLAUDIONIX99</div>
    </div>
  </section>

</main>

<!-- TOOLBAR INFERIORE -->
<div class="toolbar">
  <button data-page="home">Home</button>
  <button data-page="movimenti">Movimenti</button>
  <button data-page="grafici">Grafici</button>
  <button data-page="calendario">Calendario</button>
  <button data-page="impostazioni">Impostazioni</button>
</div>

<!-- MODALE AGGIUNGI/MODIFICA MOVIMENTO -->
<div id="movimentoModal" class="modal">
  <div class="modal-content">
    <h3 id="modalTitle">Aggiungi Movimento</h3>
    <label>Portafoglio:</label>
    <select id="movWalletSelect"></select>
    <label>Descrizione:</label>
    <input type="text" id="movDescrizione">
    <label>Importo:</label>
    <input type="number" id="movImporto">
    <label>Tipo:</label>
    <select id="movTipo">
      <option value="entrata">Entrata</option>
      <option value="spesa">Spesa</option>
    </select>
    <label>Data:</label>
    <input type="date" id="movData">
    <label>Ricorrenza (mesi, solo spese):</label>
    <input type="number" id="movRicorrenza" value="0">
    <div class="modal-buttons">
      <button id="saveMovimentoBtn">Salva</button>
      <button id="cancelMovimentoBtn">Annulla</button>
    </div>
  </div>
</div>

<script src="state.js"></script>
<script src="storage.js"></script>
<script src="app.js"></script>
<script src="ui.js"></script>
</body>
</html>
