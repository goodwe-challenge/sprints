const PLANS = [
  {
    id: "basic",
    name: "Básico",
    power: 3.7,
    monthlyPrice: 49,
    pricePerKwh: 1.40,
  },
  {
    id: "plus",
    name: "Plus",
    power: 7.4,
    monthlyPrice: 89,
    pricePerKwh: 1.10,
  },
  {
    id: "ultra",
    name: "Ultra",
    power: 22,
    monthlyPrice: 139,
    pricePerKwh: 0.80,
  },
];

const GRID_CAPACITY_KW = 50;
const MAX_STATIONS = 4;
const STATION_IDS = ["A", "B", "C", "D"];
const TICK_INTERVAL_MS = 1000;
