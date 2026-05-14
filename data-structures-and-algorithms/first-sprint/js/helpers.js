function formatBRL(value) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function formatSimTime(minutes) {
  if (minutes <= 0) return "0 min";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m} min`;
  return `${h}h ${String(m).padStart(2, "0")}min`;
}

function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = "";
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  const target = document.getElementById(id);
  target.classList.add("active");
  target.style.animation = "none";
  target.offsetHeight;
  target.style.animation = "";
}

function calcPricePerKwh(basePricePerKwh, hour, userType) {
  let price = basePricePerKwh;
  if (hour >= tariffRules.peakStart && hour < tariffRules.peakEnd) {
    price *= tariffRules.peakMultiplier;
  }
  if (userType === "premium") {
    price *= tariffRules.premiumDiscount;
  }
  return price;
}
