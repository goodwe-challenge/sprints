const _storedUser = sessionStorage.getItem("loggedUser");
if (!_storedUser) window.location.href = "index.html";
const currentUser = JSON.parse(_storedUser);

const ARC_CIRCUMFERENCE = 2 * Math.PI * 90;
const CARBON_CIRCUMFERENCE = 2 * Math.PI * 40;
const CO2_TREE_GOAL_KG = 21;
const KM_PER_KWH = 6;
const CO2_SAVING_PER_KWH = 1.18;

function initSidebar() {
  document.getElementById("sidebar-name").textContent = currentUser.name;
  document.getElementById("sidebar-plan").textContent =
    `Plano ${currentUser.plan.name} · ${currentUser.plan.power} kW`;
  document.getElementById("sidebar-avatar").textContent =
    currentUser.name.charAt(0).toUpperCase();
}

function initDashboard() {
  const firstName = currentUser.name.split(" ")[0];
  document.getElementById("dash-greeting").textContent = `Olá, ${firstName}!`;
  document.getElementById("dash-plan-badge").textContent =
    `${currentUser.plan.power} kW · ${currentUser.plan.name}`;
  document.getElementById("stat-rate-val").textContent =
    currentUser.plan.pricePerKwh.toFixed(2);
  updateDashboardStats();
}

function updateDashboardStats() {
  let totalEnergy = 0;
  let totalCost = 0;

  for (let i = 0; i < sessionHistory.length; i++) {
    totalEnergy += sessionHistory[i].energyKwh;
    totalCost += sessionHistory[i].totalCost;
  }

  document.getElementById("stat-sessions").textContent = sessionHistory.length;
  document.getElementById("stat-energy").innerHTML =
    `${totalEnergy.toFixed(2)} <span>kWh</span>`;
  document.getElementById("stat-cost-val").textContent =
    formatBRL(totalCost).replace("R$ ", "");

  renderDashHistory();
  updateCarbonCard(totalEnergy);
}

function updateCarbonCard(totalEnergy) {
  const co2Saved = totalEnergy * CO2_SAVING_PER_KWH;
  const kmClean = totalEnergy * KM_PER_KWH;
  const treeDays = co2Saved / (CO2_TREE_GOAL_KG / 365);
  const treeProgress = Math.min(1, co2Saved / CO2_TREE_GOAL_KG);
  const treeProgressPct = Math.round(treeProgress * 100);

  document.getElementById("cs-co2").textContent = `${co2Saved.toFixed(2).replace(".", ",")} kg`;
  document.getElementById("cs-km").textContent = `≈ ${kmClean.toFixed(0)} km`;
  document.getElementById("cs-tree-days").textContent = treeDays >= 1
    ? `≈ ${treeDays.toFixed(1)} dias`
    : "< 1 dia";

  const offset = CARBON_CIRCUMFERENCE * (1 - treeProgress);
  const ringEl = document.getElementById("carbon-ring-progress");
  ringEl.style.strokeDashoffset = offset;
  ringEl.style.stroke = co2Saved === 0 ? "var(--border-strong)" : "#5ab896";

  const centerPct = document.getElementById("carbon-ring-pct");
  centerPct.textContent = `${treeProgressPct}%`;
  centerPct.style.color = co2Saved === 0 ? "var(--text-3)" : "#5ab896";

  const milestone = document.getElementById("carbon-milestone");
  if (co2Saved >= CO2_TREE_GOAL_KG) {
    const trees = Math.floor(co2Saved / CO2_TREE_GOAL_KG);
    milestone.textContent = `Você equivale a plantar ${trees} árvore${trees > 1 ? "s" : ""} por ano!`;
    milestone.classList.remove("hidden");
  } else {
    milestone.classList.add("hidden");
  }
}

function updateEstimate() {
  const capacity = parseFloat(document.getElementById("s-capacity").value);
  const initialPct = parseFloat(document.getElementById("s-initial-charge").value);
  const power = parseFloat(document.getElementById("s-power").value);
  const userType = document.getElementById("s-user-type").value;
  const timeInput = document.getElementById("s-time").value;

  const hour = timeInput ? parseInt(timeInput.split(":")[0]) : new Date().getHours();
  const effectivePrice = calcPricePerKwh(currentUser.plan.pricePerKwh, hour, userType);

  const energyTo100 = capacity * (100 - initialPct) / 100;
  const energyTo80 = initialPct < 80 ? capacity * (80 - initialPct) / 100 : 0;
  const minsTo100 = (energyTo100 / power) * 60;
  const minsTo80 = energyTo80 > 0 ? (energyTo80 / power) * 60 : 0;

  const fillEl = document.getElementById("est-battery-fill");
  fillEl.style.width = `${initialPct}%`;
  fillEl.style.background = batteryColor(initialPct);

  const pctEl = document.getElementById("est-battery-pct");
  pctEl.textContent = `${initialPct}%`;
  pctEl.style.color = initialPct > 45 ? "#fff" : "";

  document.getElementById("est-energy").textContent = `${energyTo100.toFixed(1)} kWh`;
  document.getElementById("est-time-80").textContent =
    energyTo80 > 0 ? formatSimTime(minsTo80) : "Já atingido";
  document.getElementById("est-time-100").textContent = formatSimTime(minsTo100);
  document.getElementById("est-cost-80").textContent =
    energyTo80 > 0 ? formatBRL(energyTo80 * effectivePrice) : "—";
  document.getElementById("est-cost-100").textContent = formatBRL(energyTo100 * effectivePrice);

  const isPeak = hour >= tariffRules.peakStart && hour < tariffRules.peakEnd;
  document.getElementById("est-peak-warn").classList.toggle("hidden", !isPeak);
}

function startSession() {
  const capacity = parseFloat(document.getElementById("s-capacity").value);
  const initialPct = parseFloat(document.getElementById("s-initial-charge").value);
  const power = parseFloat(document.getElementById("s-power").value);
  const userType = document.getElementById("s-user-type").value;
  const timeInput = document.getElementById("s-time").value;

  let hour = new Date().getHours();
  if (timeInput) hour = parseInt(timeInput.split(":")[0]);

  const pricePerKwh = calcPricePerKwh(currentUser.plan.pricePerKwh, hour, userType);
  const energyTo100 = capacity * (100 - initialPct) / 100;
  const energyTo80 = initialPct < 80 ? capacity * (80 - initialPct) / 100 : 0;
  const estimatedMaxCost = energyTo100 * pricePerKwh;

  const warnEl = document.getElementById("wallet-insufficient-warn");
  if (wallet.balance < estimatedMaxCost) {
    warnEl.classList.remove("hidden");
    return;
  }
  warnEl.classList.add("hidden");

  activeSession.running = true;
  activeSession.startTime = new Date();
  activeSession.elapsedMinutes = 0;
  activeSession.totalMinutes = (energyTo100 / power) * 60;
  activeSession.minutesTo80 = energyTo80 > 0 ? (energyTo80 / power) * 60 : -1;
  activeSession.initialPct = initialPct;
  activeSession.batteryCapacity = capacity;
  activeSession.power = power;
  activeSession.pricePerKwh = pricePerKwh;
  activeSession.userType = userType;
  activeSession.hour = hour;

  updatePowerBars(power);
  document.getElementById("live-power-badge").textContent = `${power} kW`;
  document.getElementById("live-power-label").textContent = `${power} kW`;

  document.getElementById("session-setup").classList.add("hidden");
  document.getElementById("session-live").classList.remove("hidden");
  document.getElementById("report-card").classList.add("hidden");
  updateLiveDisplay();

  activeSession.intervalId = setInterval(() => {
    activeSession.elapsedMinutes++;
    updateLiveDisplay();
    if (calcCurrentPct() >= 100) stopSession();
  }, 1000);
}

function calcCurrentPct() {
  const energyDelivered = (activeSession.power / 60) * activeSession.elapsedMinutes;
  return Math.min(100, activeSession.initialPct + (energyDelivered / activeSession.batteryCapacity) * 100);
}

function updateLiveDisplay() {
  const elapsed = activeSession.elapsedMinutes;
  const currentPct = calcCurrentPct();
  const energyDelivered = (activeSession.power / 60) * elapsed;
  const currentCost = energyDelivered * activeSession.pricePerKwh;
  const remaining = Math.max(0, activeSession.totalMinutes - elapsed);

  const arcEl = document.getElementById("arc-progress");
  arcEl.style.strokeDashoffset = ARC_CIRCUMFERENCE * (1 - currentPct / 100);
  arcEl.style.stroke = batteryColor(currentPct);

  document.getElementById("arc-pct").textContent = `${Math.round(currentPct)}%`;
  document.getElementById("arc-pct").style.color = batteryColor(currentPct);
  document.getElementById("arc-kwh").textContent = `${energyDelivered.toFixed(3)} kWh`;
  document.getElementById("progress-bar").style.width = `${currentPct}%`;

  document.getElementById("live-elapsed").textContent = formatSimTime(elapsed);
  document.getElementById("live-remaining").textContent = formatSimTime(remaining);
  document.getElementById("live-cost").textContent = formatBRL(currentCost);

  const card80 = document.getElementById("lm-80-card");
  if (activeSession.minutesTo80 < 0 || currentPct >= 80) {
    document.getElementById("live-time-80").textContent = "Atingido ✓";
    card80.style.borderColor = "rgba(90,184,150,0.35)";
  } else {
    document.getElementById("live-time-80").textContent =
      formatSimTime(Math.max(0, activeSession.minutesTo80 - elapsed));
    card80.style.borderColor = "";
  }
}

function stopSession() {
  if (!activeSession.running) return;

  clearInterval(activeSession.intervalId);
  activeSession.running = false;

  const elapsed = activeSession.elapsedMinutes;
  const energyDelivered = (activeSession.power / 60) * elapsed;
  const totalCost = energyDelivered * activeSession.pricePerKwh;

  const sessionRecord = {
    id: Date.now(),
    date: activeSession.startTime.toLocaleDateString("pt-BR"),
    startHour: activeSession.hour,
    userType: activeSession.userType,
    power: activeSession.power,
    pricePerKwh: activeSession.pricePerKwh,
    durationMinutes: elapsed,
    energyKwh: energyDelivered,
    totalCost: totalCost,
    initialPct: activeSession.initialPct,
    finalPct: Math.round(calcCurrentPct()),
    batteryCapacity: activeSession.batteryCapacity,
  };

  sessionHistory.unshift(sessionRecord);

  wallet.balance = Math.max(0, wallet.balance - totalCost);
  wallet.transactions.unshift({
    id: sessionRecord.id,
    type: "session",
    date: sessionRecord.date,
    label: `Recarga · ${sessionRecord.power} kW · ${sessionRecord.initialPct}%→${sessionRecord.finalPct}%`,
    energyKwh: sessionRecord.energyKwh,
    durationMinutes: sessionRecord.durationMinutes,
    amount: -totalCost,
  });

  document.getElementById("session-live").classList.add("hidden");
  document.getElementById("session-setup").classList.remove("hidden");
  document.getElementById("progress-bar").style.width = "0%";

  renderReport(sessionRecord);
  updateDashboardStats();
  updateWalletDisplay();
  renderWalletHistory();
}

function speedSession() {
  if (!activeSession.running) return;
  clearInterval(activeSession.intervalId);
  activeSession.elapsedMinutes = Math.ceil(activeSession.totalMinutes);
  updateLiveDisplay();
  stopSession();
}

function batteryColor(pct) {
  if (pct < 20) return "#e05050";
  if (pct < 50) return "#e09030";
  if (pct < 80) return "#5ab896";
  return "#7c5cbf";
}

function updatePowerBars(power) {
  let activeLevels = 1;
  let speedLabel = "Lento";
  if (power >= 15) { activeLevels = 3; speedLabel = "Rápido"; }
  else if (power >= 6) { activeLevels = 2; speedLabel = "Padrão"; }

  document.querySelectorAll(".power-bar").forEach((bar) => {
    bar.classList.toggle("active", parseInt(bar.dataset.level) <= activeLevels);
  });
  document.getElementById("power-speed-label").textContent = speedLabel;
}

function renderReport(s) {
  const isPeak = s.startHour >= tariffRules.peakStart && s.startHour < tariffRules.peakEnd;

  const items = [
    { label: "Duração simulada",      value: formatSimTime(s.durationMinutes) },
    { label: "Carga inicial → final", value: `${s.initialPct}% → ${s.finalPct}%` },
    { label: "Energia carregada",     value: `${s.energyKwh.toFixed(3)} kWh` },
    { label: "Potência usada",        value: `${s.power} kW` },
    { label: "Tarifa aplicada",       value: `${formatBRL(s.pricePerKwh)}/kWh`, highlight: true },
    { label: "Horário",               value: isPeak ? "Pico (+30%)" : "Fora de pico" },
    { label: "Custo total",           value: formatBRL(s.totalCost), highlight: true },
    { label: "Autonomia ganha",       value: `≈ ${(s.energyKwh * KM_PER_KWH).toFixed(0)} km` },
    { label: "CO₂ economizado",       value: `≈ ${(s.energyKwh * CO2_SAVING_PER_KWH).toFixed(2)} kg` },
  ];

  const grid = document.getElementById("report-grid");
  grid.innerHTML = "";

  for (let i = 0; i < items.length; i++) {
    const div = document.createElement("div");
    div.className = "r-item";
    div.innerHTML = `
      <div class="r-label">${items[i].label}</div>
      <div class="r-value${items[i].highlight ? " highlight" : ""}">${items[i].value}</div>
    `;
    grid.appendChild(div);
  }

  document.getElementById("report-card").classList.remove("hidden");
}

function renderDashHistory() {
  const list = document.getElementById("dash-history-list");
  const recent = sessionHistory.slice(0, 4);

  if (recent.length === 0) {
    list.innerHTML = `<div class="empty-state">Nenhuma sessão registrada ainda.</div>`;
    return;
  }
  list.innerHTML = "";
  recent.forEach((s) => list.appendChild(createHistoryItem(s)));
}

function createHistoryItem(s) {
  const item = document.createElement("div");
  item.className = "history-item";
  item.innerHTML = `
    <div>
      <div class="hi-label">Recarga · ${s.power} kW · ${s.initialPct}%→${s.finalPct}%</div>
      <div class="hi-date">${s.date} · ${formatSimTime(s.durationMinutes)}</div>
    </div>
    <div class="hi-energy">${s.energyKwh.toFixed(2)} kWh</div>
    <div class="hi-cost">${formatBRL(s.totalCost)}</div>
  `;
  return item;
}

function initWallet() {
  updateWalletDisplay();
  renderWalletHistory();
}

function updateWalletDisplay() {
  document.getElementById("wallet-balance").textContent = formatBRL(wallet.balance);
}

function renderWalletHistory() {
  const list = document.getElementById("wallet-history-list");

  if (wallet.transactions.length === 0) {
    list.innerHTML = `<div class="empty-state">Nenhuma transação ainda.</div>`;
    return;
  }
  list.innerHTML = "";
  wallet.transactions.forEach((tx) => list.appendChild(createWalletTransactionItem(tx)));
}

function createWalletTransactionItem(tx) {
  const item = document.createElement("div");
  item.className = `wallet-tx-item wallet-tx-${tx.type}`;

  if (tx.type === "session") {
    item.innerHTML = `
      <div>
        <div class="wallet-tx-label">${tx.label}</div>
        <div class="wallet-tx-date">${tx.date} · ${formatSimTime(tx.durationMinutes)}</div>
      </div>
      <div class="wallet-tx-energy">${tx.energyKwh.toFixed(2)} kWh</div>
      <div class="wallet-tx-amount debit">${formatBRL(Math.abs(tx.amount))}</div>
    `;
  } else {
    item.innerHTML = `
      <div>
        <div class="wallet-tx-label">${tx.label}</div>
        <div class="wallet-tx-date">${tx.date}</div>
      </div>
      <div></div>
      <div class="wallet-tx-amount credit">+${formatBRL(tx.amount)}</div>
    `;
  }
  return item;
}

function navigateTo(sectionId) {
  document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));

  const section = document.getElementById(`section-${sectionId}`);
  const navItem = document.querySelector(`[data-section="${sectionId}"]`);

  if (section) {
    section.classList.add("active");
    section.style.animation = "none";
    section.offsetHeight;
    section.style.animation = "";
  }
  if (navItem) navItem.classList.add("active");
}

document.querySelectorAll(".nav-item").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo(link.dataset.section);
  });
});

document.querySelector(".see-all").addEventListener("click", (e) => {
  e.preventDefault();
  navigateTo("wallet");
});

document.getElementById("btn-start-session").addEventListener("click", startSession);
document.getElementById("btn-stop-session").addEventListener("click", stopSession);
document.getElementById("btn-speed-session").addEventListener("click", speedSession);

document.getElementById("btn-clear-history").addEventListener("click", () => {
  sessionHistory = [];
  wallet.transactions = [];
  updateDashboardStats();
  renderWalletHistory();
});

document.getElementById("btn-logout").addEventListener("click", () => {
  sessionStorage.removeItem("loggedUser");
});

document.getElementById("btn-add-funds").addEventListener("click", () => {
  document.getElementById("btn-add-funds").classList.add("hidden");
  document.getElementById("wallet-add-form").classList.remove("hidden");
  document.getElementById("wallet-add-amount").focus();
});

document.getElementById("btn-cancel-add").addEventListener("click", () => {
  document.getElementById("wallet-add-form").classList.add("hidden");
  document.getElementById("btn-add-funds").classList.remove("hidden");
  document.getElementById("wallet-add-amount").value = "";
});

document.getElementById("btn-confirm-add").addEventListener("click", () => {
  const amount = parseFloat(document.getElementById("wallet-add-amount").value);
  if (!amount || amount <= 0) return;
  wallet.balance += amount;
  wallet.transactions.unshift({
    id: Date.now(),
    type: "deposit",
    date: new Date().toLocaleDateString("pt-BR"),
    label: "Recarga de saldo",
    amount: amount,
  });
  document.getElementById("wallet-add-form").classList.add("hidden");
  document.getElementById("btn-add-funds").classList.remove("hidden");
  document.getElementById("wallet-add-amount").value = "";
  updateWalletDisplay();
  renderWalletHistory();
});

["s-capacity", "s-power", "s-user-type", "s-time"].forEach((id) => {
  document.getElementById(id).addEventListener("change", updateEstimate);
});

document.getElementById("s-initial-charge").addEventListener("input", () => {
  const slider = document.getElementById("s-initial-charge");
  const pct = parseInt(slider.value);
  const fillPct = (pct / 95) * 100;
  slider.style.background =
    `linear-gradient(to right, var(--violet) ${fillPct}%, rgba(160,140,210,0.28) ${fillPct}%)`;
  document.getElementById("s-initial-label").textContent = `${pct}%`;
  updateEstimate();
});

initSidebar();
initDashboard();
initWallet();

const _slider = document.getElementById("s-initial-charge");
_slider.style.background =
  `linear-gradient(to right, var(--violet) ${(20 / 95) * 100}%, rgba(160,140,210,0.28) ${(20 / 95) * 100}%)`;

const _now = new Date();
document.getElementById("s-time").value =
  `${String(_now.getHours()).padStart(2, "0")}:${String(_now.getMinutes()).padStart(2, "0")}`;

updateEstimate();
