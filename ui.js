function showPage(page) {
  document.querySelectorAll(".page").forEach(p =>
    p.classList.remove("active")
  );

  const section = document.getElementById(page);
  if (section) {
    section.classList.add("active");
    document.getElementById("headerTitle").textContent =
      page.charAt(0).toUpperCase() + page.slice(1);
  }

  appState.ui.currentPage = page;
  saveState();
}

document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    showPage(btn.dataset.page);
  });
});

document.getElementById("darkToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  appState.ui.darkMode = document.body.classList.contains("dark");
  saveState();
});

document.getElementById("resetBtn").addEventListener("click", resetAll);
