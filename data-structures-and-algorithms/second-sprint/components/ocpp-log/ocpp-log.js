let _ocppRenderedCount = 0;

function buildLogEntry(entry) {
  const isSend = entry.direction.includes("SEND");
  const div = document.createElement("div");
  div.className = "ocpp-log-entry " + (isSend ? "send" : "recv");
  const payloadStr = JSON.stringify(entry.payload || {}).slice(0, 60);
  div.innerHTML = `
    <div class="ocpp-log-meta">
      <span class="ocpp-log-dir">${entry.direction}</span>
      <span class="ocpp-log-action">${entry.action}</span>
      <span class="ocpp-log-ts">${entry.ts}</span>
    </div>
    <div class="ocpp-log-payload">${payloadStr}</div>`;
  return div;
}

function renderOcppLog() {
  const list = document.getElementById("ocpp-log-list");
  if (!list) return;

  const total = ocppBus._totalSent;
  if (total === _ocppRenderedCount) return;

  const empty = document.getElementById("ocpp-log-empty");
  if (empty) empty.remove();

  const numNew = Math.min(total - _ocppRenderedCount, 20);
  for (let i = numNew - 1; i >= 0; i--) {
    list.insertBefore(buildLogEntry(ocppBus.messageLog[i]), list.firstChild);
  }
  while (list.children.length > 20) list.removeChild(list.lastChild);
  _ocppRenderedCount = total;

  const countEl = document.getElementById("ocpp-log-count");
  if (countEl) countEl.textContent = total + " msgs";
}
