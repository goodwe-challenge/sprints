const activeSessions = new Map();
const waitingQueue = new Queue();

function calcTotalActivePower() {
  let total = 0;
  activeSessions.forEach(s => { total += s.power; });
  return total;
}

function applyThrottling() {
  const total = calcTotalActivePower();
  if (total > GRID_CAPACITY_KW) {
    const factor = GRID_CAPACITY_KW / total;
    activeSessions.forEach(s => { s.power = s.powerMax * factor; });
  } else {
    activeSessions.forEach(s => { s.power = s.powerMax; });
  }
}
