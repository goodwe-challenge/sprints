let _lastQueueSnapshot = null;

function renderWaitingQueue() {
  const list = document.getElementById("waiting-queue-list");
  const badge = document.getElementById("queue-badge");
  if (!list) return;

  const size = waitingQueue.size;
  if (badge) {
    badge.textContent = size;
    badge.classList.toggle("hidden", size === 0);
  }

  const snapshot = waitingQueue.items.map(i => i.vehicleId).join(",");
  if (snapshot === _lastQueueSnapshot) return;
  _lastQueueSnapshot = snapshot;

  if (size === 0) {
    list.innerHTML = `<div class="waiting-queue-empty">Nenhum veículo aguardando.</div>`;
    return;
  }

  list.innerHTML = "";
  waitingQueue.items.forEach((item, idx) => {
    const plan = PLANS.find(p => p.id === item.planId) || { name: item.planId };
    const div = document.createElement("div");
    div.className = "queue-item";
    div.innerHTML = `
      <span class="queue-position">#${idx + 1}</span>
      <span class="queue-vehicle">${item.vehicleId}</span>
      <span class="queue-plan">${plan.name} · ${item.userType === "premium" ? "Premium" : "Padrão"}</span>
    `;
    list.appendChild(div);
  });
}
