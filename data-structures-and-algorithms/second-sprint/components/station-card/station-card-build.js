function buildStationCard(stationId) {
  const session = activeSessions.get(stationId);
  const card = document.createElement("div");
  card.className = "station-card" + (session ? " " + session.status : "");
  card.id = "station-card-" + stationId;
  card.dataset.vehicleId = session ? session.vehicleId : "";

  if (!session) {
    card.innerHTML = `
      <div class="station-card-header">
        <div class="station-id">${stationId}</div>
        <div class="station-card-title">
          <span class="station-name">Estação ${stationId}</span>
          <span class="station-status-badge">Livre</span>
        </div>
      </div>
      <div class="station-card-actions">
        <button class="btn btn-primary" onclick="openSessionForm('${stationId}')">Iniciar Recarga</button>
      </div>`;
  } else {
    const pct = Math.round(calcCurrentPct(session));
    const cost = calcEnergyDelivered(session) * session.pricePerKwh;
    const throttled = session.power < session.powerMax;
    card.innerHTML = `
      <div class="station-card-header">
        <div class="station-id">${stationId}</div>
        <div class="station-card-title">
          <span class="station-name">Estação ${stationId} · ${session.vehicleId}</span>
          <span class="station-status-badge">Carregando</span>
        </div>
      </div>
      <div class="station-card-body">
        <div class="station-battery-bar-track">
          <div id="sc-${stationId}-fill" class="station-battery-bar-fill"
               style="width:${pct}%;background:${batteryColor(pct)}"></div>
        </div>
        <div class="station-stat-row">
          <span class="station-stat-label">Bateria</span>
          <span class="station-stat-value">${session.initialPct}% → <span id="sc-${stationId}-pct">${pct}</span>%</span>
        </div>
        <div class="station-stat-row">
          <span class="station-stat-label" id="sc-${stationId}-pow-label">Potência${throttled ? " ⚡" : ""}</span>
          <span class="station-stat-value" id="sc-${stationId}-pow-val">${session.power.toFixed(1)} kW${throttled ? " / " + session.powerMax + " kW" : ""}</span>
        </div>
        <div class="station-stat-row">
          <span class="station-stat-label">Tempo</span>
          <span class="station-stat-value" id="sc-${stationId}-time">${formatDuration(session.elapsedMinutes)}</span>
        </div>
        <div class="station-stat-row">
          <span class="station-stat-label">Custo</span>
          <span class="station-stat-value" id="sc-${stationId}-cost">${formatBRL(cost)}</span>
        </div>
        <div class="station-stat-row">
          <span class="station-stat-label">Plano</span>
          <span class="station-stat-value">${session.plan.name} · ${session.userType === "premium" ? "Premium" : "Padrão"}</span>
        </div>
      </div>
      <div class="station-card-actions">
        <button class="btn btn-danger" onclick="handleStopSession('${stationId}')">Encerrar</button>
      </div>`;
  }
  return card;
}

function updateStationCard(stationId, session) {
  const pct = Math.round(calcCurrentPct(session));
  const cost = calcEnergyDelivered(session) * session.pricePerKwh;
  const throttled = session.power < session.powerMax;

  const fill = document.getElementById("sc-" + stationId + "-fill");
  if (fill) { fill.style.width = pct + "%"; fill.style.background = batteryColor(pct); }

  const pctEl = document.getElementById("sc-" + stationId + "-pct");
  if (pctEl) pctEl.textContent = pct;

  const powLabel = document.getElementById("sc-" + stationId + "-pow-label");
  if (powLabel) powLabel.textContent = "Potência" + (throttled ? " ⚡" : "");

  const powVal = document.getElementById("sc-" + stationId + "-pow-val");
  if (powVal) powVal.textContent = session.power.toFixed(1) + " kW" + (throttled ? " / " + session.powerMax + " kW" : "");

  const timeEl = document.getElementById("sc-" + stationId + "-time");
  if (timeEl) timeEl.textContent = formatDuration(session.elapsedMinutes);

  const costEl = document.getElementById("sc-" + stationId + "-cost");
  if (costEl) costEl.textContent = formatBRL(cost);
}
