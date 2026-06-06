function initSidebar() {
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      navigateTo(item.dataset.section);
    });
  });
}

function navigateTo(sectionId) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

  const section = document.getElementById("section-" + sectionId);
  const navItem = document.querySelector(`[data-section="${sectionId}"]`);

  if (section) section.classList.add("active");
  if (navItem) navItem.classList.add("active");
}

function renderSidebarBalance() {
  const el = document.getElementById("sidebar-balance");
  if (el) el.textContent = formatBRL(state.wallet.balance);
}
