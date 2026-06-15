function startSession(stationId, config) {
  const { vehicleId, userId, userType, planId, batteryCapacity, initialPct } = config;

  if (!Number.isFinite(batteryCapacity) || !Number.isFinite(initialPct)) return null;

  const plan = PLANS.find(p => p.id === planId);
  if (!plan) return null;

  const hour = getHour();
  const demandRatio = calcTotalActivePower() / GRID_CAPACITY_KW;
  const pricePerKwh = calcPricePerKwh(plan.pricePerKwh, hour, userType, demandRatio);
  const totalMinutes = (batteryCapacity * (100 - initialPct) / 100 / plan.power) * 60;

  const session = {
    id: "sess_" + Date.now(),
    stationId,
    vehicleId,
    userId,
    userType,
    plan,
    power: plan.power,
    powerMax: plan.power,
    pricePerKwh,
    startTime: new Date(),
    elapsedMinutes: 0,
    totalMinutes,
    initialPct,
    batteryCapacity,
    status: "charging",
  };

  activeSessions.set(stationId, session);
  applyThrottling();

  ocppBus.send("BootNotification", { chargePointVendor: "GoodWe", chargePointModel: "EVCS-" + stationId });
  setTimeout(() => {
    ocppBus.send("Authorize", { idTag: userId });
    setTimeout(() => {
      ocppBus.send("StartTransaction", { connectorId: stationId, idTag: userId, meterStart: 0 });
    }, 300);
  }, 300);

  return session;
}

function stopSession(stationId) {
  const session = activeSessions.get(stationId);
  if (!session) return null;

  const energyDelivered = calcEnergyDelivered(session);
  const totalCost = energyDelivered * session.pricePerKwh;

  const record = {
    id: session.id,
    stationId,
    vehicleId: session.vehicleId,
    date: session.startTime.toLocaleDateString("pt-BR"),
    plan: session.plan,
    userType: session.userType,
    power: session.powerMax,
    pricePerKwh: session.pricePerKwh,
    durationMinutes: session.elapsedMinutes,
    energyKwh: energyDelivered,
    totalCost,
    initialPct: session.initialPct,
    finalPct: Math.round(calcCurrentPct(session)),
    batteryCapacity: session.batteryCapacity,
  };

  ocppBus.send("StopTransaction", { transactionId: session.id, meterStop: Math.round(energyDelivered * 1000) });

  activeSessions.delete(stationId);
  applyThrottling();

  state.sessionHistory.unshift(record);
  state.wallet.balance = Math.max(0, state.wallet.balance - totalCost);
  state.wallet.transactions.unshift({
    id: record.id,
    type: "session",
    date: record.date,
    label: `Recarga · Estação ${stationId} · ${record.initialPct}%→${record.finalPct}%`,
    energyKwh: record.energyKwh,
    durationMinutes: record.durationMinutes,
    amount: -totalCost,
  });
  saveState();

  if (!waitingQueue.isEmpty) {
    const next = waitingQueue.dequeue();
    startSession(stationId, Object.assign(next, { stationId }));
  }

  return record;
}
