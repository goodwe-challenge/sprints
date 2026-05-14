const PLANS = [
  {
    id: "basic",
    name: "Básico",
    icon: "fi-rr-leaf",
    power: 3.7,
    monthlyPrice: 49,
    pricePerKwh: 1.40,
    features: [
      "Carregador AC monofásico 3,7 kW",
      "Ideal para recarga noturna em casa",
      "Monitoramento via app GoodWe",
      "Suporte técnico por e-mail",
    ],
    popular: false,
  },
  {
    id: "plus",
    name: "Plus",
    icon: "fi-rr-bolt",
    power: 7.4,
    monthlyPrice: 89,
    pricePerKwh: 1.10,
    features: [
      "Carregador AC monofásico 7,4 kW",
      "Compatível com a maioria dos VEs",
      "Monitoramento + histórico avançado",
      "Tarifa reduzida por kWh",
      "Suporte prioritário",
    ],
    popular: true,
  },
  {
    id: "ultra",
    name: "Ultra",
    icon: "fi-rr-rocket",
    power: 22,
    monthlyPrice: 139,
    pricePerKwh: 0.80,
    features: [
      "Carregador AC trifásico 22 kW",
      "Recarga completa em ~2h",
      "Prioridade na fila de carregamento",
      "Menor tarifa por kWh",
      "Suporte 24/7 dedicado",
      "Dashboard analítico avançado",
    ],
    popular: false,
  },
];

const tariffRules = {
  peakStart: 18,
  peakEnd: 22,
  peakMultiplier: 1.30,
  premiumDiscount: 0.85,
};

function getRegisteredUsers() {
  return JSON.parse(localStorage.getItem("registeredUsers") || "{}");
}

function saveRegisteredUser(user) {
  const users = getRegisteredUsers();
  users[user.email] = user;
  localStorage.setItem("registeredUsers", JSON.stringify(users));
}

function findUser(email) {
  return getRegisteredUsers()[email] || null;
}

let sessionHistory = [];

let activeSession = {
  running: false,
  startTime: null,
  elapsedMinutes: 0,
  totalMinutes: 0,
  minutesTo80: 0,
  initialPct: 0,
  batteryCapacity: 75,
  power: 0,
  pricePerKwh: 0,
  intervalId: null,
  userType: null,
  hour: null,
};

let wallet = {
  balance: 100,
  transactions: [],
};

let pendingRegistration = null;
let selectedPlanId = null;
