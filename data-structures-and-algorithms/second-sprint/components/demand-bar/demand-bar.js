function renderDemandBar() {
  const total = calcTotalActivePower();
  const ratio = total / GRID_CAPACITY_KW;
  const pct = Math.min(100, ratio * 100);

  const fill = document.getElementById("demand-bar-fill");
  const valEl = document.getElementById("demand-bar-values");
  const ratioEl = document.getElementById("demand-bar-ratio");

  if (!fill) return;

  fill.style.width = pct + "%";
  fill.className = "demand-bar-fill";
  if (ratio >= 0.9) fill.classList.add("danger");
  else if (ratio >= 0.7) fill.classList.add("warning");

  if (valEl) valEl.textContent = total.toFixed(1) + " kW / " + GRID_CAPACITY_KW + " kW";
  if (ratioEl) ratioEl.textContent = Math.round(pct) + "%";
}
