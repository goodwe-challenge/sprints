function buildTariffBlock(stationId, session, hour, demandRatio) {
  const bd = getTariffBreakdown(session.plan.pricePerKwh, hour, session.userType, demandRatio);
  const block = document.createElement("div");
  block.className = "tariff-session-block";
  block.dataset.stationId = stationId;

  const premLine = bd.premiumMultiplier < 1 ? `
    <span class="tariff-sep">×</span>
    <div class="tariff-factor">
      <span class="tariff-factor-value">${bd.premiumMultiplier.toFixed(2)}</span>
      <span class="tariff-factor-label">premium</span>
    </div>` : "";

  block.innerHTML = `
    <div class="tariff-session-id">Estação ${stationId} · ${session.vehicleId}</div>
    <div class="tariff-formula">
      <div class="tariff-factor">
        <span class="tariff-factor-value">${formatBRL(bd.base)}</span>
        <span class="tariff-factor-label">base</span>
      </div>
      <span class="tariff-sep">×</span>
      <div class="tariff-factor">
        <span class="tariff-factor-value" id="tb-${stationId}-time-val">${bd.timeMultiplier.toFixed(2)}</span>
        <span class="tariff-factor-label" id="tb-${stationId}-time-name">${bd.timeName}</span>
      </div>
      <span class="tariff-sep">×</span>
      <div class="tariff-factor">
        <span class="tariff-factor-value" id="tb-${stationId}-demand-val">${bd.demandMultiplier.toFixed(2)}</span>
        <span class="tariff-factor-label">demanda</span>
      </div>
      ${premLine}
    </div>
    <div class="tariff-effective">
      <span class="tariff-effective-label">Efetivo</span>
      <span class="tariff-effective-value" id="tb-${stationId}-effective">= ${formatBRL(bd.effective)}/kWh</span>
    </div>`;
  return block;
}

function updateTariffBlock(stationId, session, hour, demandRatio) {
  const bd = getTariffBreakdown(session.plan.pricePerKwh, hour, session.userType, demandRatio);

  const timeVal   = document.getElementById("tb-" + stationId + "-time-val");
  const timeName  = document.getElementById("tb-" + stationId + "-time-name");
  const demandVal = document.getElementById("tb-" + stationId + "-demand-val");
  const effective = document.getElementById("tb-" + stationId + "-effective");

  if (timeVal)   timeVal.textContent   = bd.timeMultiplier.toFixed(2);
  if (timeName)  timeName.textContent  = bd.timeName;
  if (demandVal) demandVal.textContent = bd.demandMultiplier.toFixed(2);
  if (effective) effective.textContent = "= " + formatBRL(bd.effective) + "/kWh";
}
