const modbusRegisters = {
  0x0001: { value: 0, label: "Tensão",         unit: "V",  factor: 0.1 },
  0x0002: { value: 0, label: "Corrente",        unit: "A",  factor: 0.1 },
  0x0003: { value: 0, label: "Potência Ativa",  unit: "W",  factor: 1   },
  0x0004: { value: 0, label: "Energia Total",   unit: "Wh", factor: 1   },
  0x0005: { value: 0, label: "Temperatura",     unit: "°C", factor: 0.1 },
};

function updateModbusFromSession(session) {
  if (!session) return;
  const voltageRaw  = Math.round((220 + Math.random() * 5) / 0.1);
  const currentRaw  = Math.round((session.power * 1000 / 220) / 0.1);
  const powerRaw    = Math.round(session.power * 1000);
  const energyRaw   = Math.round((session.elapsedMinutes / 60) * session.power * 1000);
  const tempRaw     = Math.round((35 + Math.random() * 10) / 0.1);

  modbusRegisters[0x0001].value = voltageRaw;
  modbusRegisters[0x0002].value = currentRaw;
  modbusRegisters[0x0003].value = powerRaw;
  modbusRegisters[0x0004].value = energyRaw;
  modbusRegisters[0x0005].value = tempRaw;
}
