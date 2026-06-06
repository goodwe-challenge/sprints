const state = {
  wallet: { balance: 100, transactions: [] },
  sessionHistory: [],
};

function saveState() {
  localStorage.setItem("ss2_wallet", JSON.stringify(state.wallet));
  localStorage.setItem("ss2_history", JSON.stringify(state.sessionHistory));
}

function loadState() {
  const w = localStorage.getItem("ss2_wallet");
  const h = localStorage.getItem("ss2_history");
  if (w) state.wallet = JSON.parse(w);
  if (h) state.sessionHistory = JSON.parse(h);
}

loadState();

let simulatedHour = null;
function getHour() { return simulatedHour !== null ? simulatedHour : new Date().getHours(); }

let tickMultiplier = 1;
let _tickCount = 0;
let globalTick = null;

function startGlobalTick() {
  if (globalTick) return;
  globalTick = setInterval(() => {
    _tickCount++;
    const hour = getHour();
    const demandRatio = calcTotalActivePower() / GRID_CAPACITY_KW;

    activeSessions.forEach((session, stationId) => {
      session.elapsedMinutes += tickMultiplier;
      session.pricePerKwh = calcPricePerKwh(session.plan.pricePerKwh, hour, session.userType, demandRatio);

      if (_tickCount % 10 === 0) {
        ocppBus.send("MeterValues", {
          connectorId: stationId,
          transactionId: session.id,
          meterValue: Math.round(calcEnergyDelivered(session) * 1000),
        });
      }

      if (calcCurrentPct(session) >= 100) stopSession(stationId);
    });

    const first = activeSessions.values().next().value;
    if (first) updateModbusFromSession(first);

    if (typeof renderAll === "function") renderAll();
  }, TICK_INTERVAL_MS);
}

startGlobalTick();
