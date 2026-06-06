function renderStationCards() {
  const grid = document.getElementById("stations-grid");
  if (!grid) return;
  STATION_IDS.forEach(id => {
    const session = activeSessions.get(id);
    const existing = document.getElementById("station-card-" + id);
    const wasCharging  = existing && existing.classList.contains("charging");
    const wasVehicleId = existing ? existing.dataset.vehicleId : null;
    const isCharging   = !!session;
    const isVehicleId  = session ? session.vehicleId : null;
    const needsRebuild = !existing || wasCharging !== isCharging || wasVehicleId !== isVehicleId;
    if (needsRebuild) {
      const card = buildStationCard(id);
      if (existing) grid.replaceChild(card, existing); else grid.appendChild(card);
    } else if (session) {
      updateStationCard(id, session);
    }
  });
}

function handleStopSession(stationId) {
  const record = stopSession(stationId);
  if (record) renderAll();
}
