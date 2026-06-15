function renderModbusTable() {
  const container = document.getElementById("modbus-table");
  if (!container) return;

  container.innerHTML = "";
  Object.entries(modbusRegisters).forEach(([addrStr, reg]) => {
    const addr = parseInt(addrStr);
    const real = (reg.value * reg.factor).toFixed(reg.factor < 1 ? 1 : 0);
    const row = document.createElement("div");
    row.className = "modbus-row";
    row.innerHTML = `
      <span class="modbus-addr">0x${addr.toString(16).padStart(4,"0").toUpperCase()}</span>
      <span class="modbus-label">${reg.label}</span>
      <span class="modbus-value">${real} ${reg.unit}</span>
      <span class="modbus-raw">[${reg.value}]</span>
    `;
    container.appendChild(row);
  });
}
