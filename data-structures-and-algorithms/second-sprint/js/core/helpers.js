function formatBRL(value) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function formatDuration(minutes) {
  if (minutes <= 0) return "0 min";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m} min`;
  return `${h}h ${String(m).padStart(2, "0")}min`;
}

function formatTime(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
}

function batteryColor(pct) {
  if (pct < 20) return "var(--color-danger)";
  if (pct < 50) return "var(--color-warning)";
  return "var(--color-accent)";
}

function calcCurrentPct(session) {
  const energyDelivered = (session.power / 60) * session.elapsedMinutes;
  return Math.min(100, session.initialPct + (energyDelivered / session.batteryCapacity) * 100);
}

function calcEnergyDelivered(session) {
  return (session.power / 60) * session.elapsedMinutes;
}
