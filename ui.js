function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(page).classList.add("active");
  document.getElementById("headerTitle").textContent =
    page.charAt(0).toUpperCase() + page.slice(1);
  appState.ui.currentPage = page;
  saveState();
}

document.querySelectorAll("nav button").forEach(btn => {
  btn.onclick = () => showPage(btn.dataset.page);
});

document.getElementById("darkToggle").onclick = () => {
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
};

document.getElementById("resetBtn").onclick = resetAll;
