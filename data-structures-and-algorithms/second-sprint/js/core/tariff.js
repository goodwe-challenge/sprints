const tariffRules = {
  night:    { start: 0,  end: 6,  multiplier: 0.70 },
  standard: { start: 6,  end: 18, multiplier: 1.00 },
  peak:     { start: 18, end: 22, multiplier: 1.30 },
  premium:  { discount: 0.85 },
  demand: [
    { threshold: 0.0, multiplier: 1.00 },
    { threshold: 0.4, multiplier: 1.10 },
    { threshold: 0.7, multiplier: 1.25 },
    { threshold: 0.9, multiplier: 1.50 },
  ],
};

function calcPricePerKwh(basePricePerKwh, hour, userType, demandRatio) {
  let price = basePricePerKwh;

  if (hour >= 0  && hour < 6)  price *= 0.70;
  if (hour >= 18 && hour < 22) price *= 1.30;

  const demandRule = [...tariffRules.demand]
    .reverse()
    .find(r => demandRatio >= r.threshold);
  price *= demandRule.multiplier;

  if (userType === "premium") price *= 0.85;

  return price;
}

function getTariffBreakdown(basePricePerKwh, hour, userType, demandRatio) {
  let timeMultiplier = 1.00;
  let timeName = "Diurno";
  if (hour >= 0  && hour < 6)  { timeMultiplier = 0.70; timeName = "Madrugada"; }
  if (hour >= 18 && hour < 22) { timeMultiplier = 1.30; timeName = "Pico"; }

  const demandRule = [...tariffRules.demand]
    .reverse()
    .find(r => demandRatio >= r.threshold);

  const premiumMultiplier = userType === "premium" ? 0.85 : 1.00;
  const effective = calcPricePerKwh(basePricePerKwh, hour, userType, demandRatio);

  return {
    base: basePricePerKwh,
    timeMultiplier,
    timeName,
    demandMultiplier: demandRule.multiplier,
    demandRatio,
    premiumMultiplier,
    effective,
  };
}
