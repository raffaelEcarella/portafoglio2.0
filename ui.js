function showPage(page) {
  document.querySelectorAll(".page").forEach(p =>
    p.classList.remove("active")
  );
  const section = document.getElementById(page);
  if (section) section.classList.add("active");

  const header = document.getElementById("headerTitle");
  if (header) header.textContent = page.charAt(0).toUpperCase() + page.slice(1);

  appState.ui.currentPage = page;
  saveState();
}

function showLogin() {
  document.getElementById("login").classList.add("active");
  document.getElementById("app").classList.remove("active");
}

function showApp() {
  document.getElementById("login").classList.remove("active");
  document.getElementById("app").classList.add("active");
}
