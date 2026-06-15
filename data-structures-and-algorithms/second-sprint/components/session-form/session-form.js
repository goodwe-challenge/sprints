let _pendingStationId = null;

function openSessionForm(stationId) {
  if (activeSessions.size >= MAX_STATIONS && !activeSessions.has(stationId)) {
    alert("Todas as estações estão ocupadas. Veículo adicionado à fila de espera.");
    enqueueVehicle(stationId);
    return;
  }
  _pendingStationId = stationId;
  document.getElementById("session-modal-title").textContent = "Estação " + stationId;
  document.getElementById("session-form-error").textContent = "";
  document.getElementById("sf-vehicle-id").value = "VH-" + stationId + "-" + String(Date.now()).slice(-4);
  document.getElementById("session-modal").classList.add("open");
}

function closeSessionForm() {
  document.getElementById("session-modal").classList.remove("open");
  _pendingStationId = null;
}

function enqueueVehicle(stationId) {
  const config = readFormConfig(stationId);
  if (!config) return;
  const queued = Object.assign(config, { status: "queued" });
  waitingQueue.enqueue(queued);
  renderWaitingQueue();
}

function readFormConfig(stationId) {
  const vehicleId = document.getElementById("sf-vehicle-id").value.trim();
  const userId = "user_" + Date.now();
  const userType = document.getElementById("sf-user-type").value;
  const planId = document.getElementById("sf-plan").value;
  const batteryCapacity = parseFloat(document.getElementById("sf-capacity").value);
  const initialPct = parseFloat(document.getElementById("sf-initial").value);

  if (!vehicleId) {
    document.getElementById("session-form-error").textContent = "Informe o ID do veículo.";
    return null;
  }
  if (!Number.isFinite(batteryCapacity) || batteryCapacity <= 0) {
    document.getElementById("session-form-error").textContent = "Capacidade inválida.";
    return null;
  }
  if (!Number.isFinite(initialPct) || initialPct < 0 || initialPct >= 100) {
    document.getElementById("session-form-error").textContent = "Carga inicial inválida (0–99).";
    return null;
  }

  return { vehicleId, userId, userType, planId, batteryCapacity, initialPct, stationId };
}

function submitSessionForm() {
  const config = readFormConfig(_pendingStationId);
  if (!config) return;

  startSession(_pendingStationId, config);
  closeSessionForm();
  renderAll();
}

function initSessionForm() {
  const plans = PLANS.map(p =>
    `<option value="${p.id}">${p.name} — ${p.power} kW · ${formatBRL(p.pricePerKwh)}/kWh</option>`
  ).join("");
  document.getElementById("sf-plan").innerHTML = plans;

  const slider = document.getElementById("sf-initial");
  slider.addEventListener("input", () => {
    document.getElementById("sf-initial-value").textContent = slider.value + "%";
  });

  document.getElementById("btn-session-confirm").addEventListener("click", submitSessionForm);
  document.getElementById("btn-session-cancel").addEventListener("click", closeSessionForm);

  document.getElementById("session-modal").addEventListener("click", e => {
    if (e.target === document.getElementById("session-modal")) closeSessionForm();
  });
}
