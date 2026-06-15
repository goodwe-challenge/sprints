function renderTariffBreakdown() {
  const container = document.getElementById("tariff-breakdown-list");
  if (!container) return;

  if (activeSessions.size === 0) {
    container.innerHTML = `<div class="tariff-empty">Nenhuma sessão ativa.</div>`;
    return;
  }

  const hour = getHour();
  const demandRatio = calcTotalActivePower() / GRID_CAPACITY_KW;

  const rendered = new Set(
    [...container.querySelectorAll("[data-station-id]")].map(el => el.dataset.stationId)
  );
  const active = new Set(activeSessions.keys());
  const sameSet = rendered.size === active.size && [...active].every(id => rendered.has(id));

  if (!sameSet) {
    container.innerHTML = "";
    activeSessions.forEach((session, stationId) =>
      container.appendChild(buildTariffBlock(stationId, session, hour, demandRatio))
    );
  } else {
    activeSessions.forEach((session, stationId) =>
      updateTariffBlock(stationId, session, hour, demandRatio)
    );
  }
}
