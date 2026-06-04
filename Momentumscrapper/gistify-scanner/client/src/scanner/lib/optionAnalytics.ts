/**
 * Option Analytics v3.0 — Katman 2: Expected Move, POP, EV
 * Artık sadece "güzel grafik" yok, "POP %72, EV +$45" var.
 */

import type { ExpectedMove, ProbabilityOfProfit, SpreadMetrics, IVCurve, Greeks } from "@/types/options";

// ─── EXPECTED MOVE HESAPLAMA ───

/**
 * Expected Move = Straddle Price ≈ ATM_IV × Spot × √(DTE/365)
 * Earnings öncesi straddle $5 ise piyasa %8 hareket bekliyor demektir.
 */
export function calculateExpectedMove(
  ivCurve: IVCurve,
  dte: number,
  method: "STRADDLE" | "FORMULA" = "FORMULA"
): ExpectedMove {
  const spot = ivCurve.spotPrice;
  const iv = ivCurve.currentIV / 100; // decimal
  const t = dte / 365;

  if (method === "STRADDLE") {
    // Straddle approximation: 0.8 × IV × Spot × √t
    const moveDollars = 0.8 * iv * spot * Math.sqrt(t);
    return {
      days: dte,
      moveDollars: Math.round(moveDollars * 100) / 100,
      movePercent: Math.round((moveDollars / spot) * 100 * 10) / 10,
      straddleCost: Math.round(moveDollars * 100) / 100,
      source: "STRADDLE",
    };
  }

  // FORMULA: IV × Spot × √(DTE/365)
  const moveDollars = iv * spot * Math.sqrt(t);
  return {
    days: dte,
    moveDollars: Math.round(moveDollars * 100) / 100,
    movePercent: Math.round((moveDollars / spot) * 100 * 10) / 10,
    straddleCost: Math.round(moveDollars * 100) / 100,
    source: "FORMULA",
  };
}

/**
 * Earnings Expected Move: Straddle price × 1.5 (binary event premium)
 */
export function calculateEarningsExpectedMove(
  ivCurve: IVCurve,
  dte: number
): ExpectedMove {
  const base = calculateExpectedMove(ivCurve, dte, "STRADDLE");
  // Earnings binary event: ×1.5 premium
  const earningsMove = base.moveDollars * 1.5;
  return {
    days: dte,
    moveDollars: Math.round(earningsMove * 100) / 100,
    movePercent: Math.round((earningsMove / ivCurve.spotPrice) * 100 * 10) / 10,
    straddleCost: Math.round(earningsMove * 100) / 100,
    source: "STRADDLE",
  };
}

// ─── PROBABILITY OF PROFIT (POP) ───

/**
 * POP from Delta: Short option POP ≈ 100 - |delta| × 100
 * Monte Carlo: 10,000 path simulation
 */
export function calculatePOP(
  ivCurve: IVCurve,
  shortStrike: number,
  dte: number,
  isCreditSpread: boolean = true
): ProbabilityOfProfit {
  const spot = ivCurve.spotPrice;
  const iv = ivCurve.currentIV / 100;
  const t = dte / 365;

  // Method 1: Delta approximation
  const distance = Math.abs(shortStrike - spot) / spot;
  const zScore = distance / (iv * Math.sqrt(t));
  const popFromDelta = Math.round((1 - Math.min(0.5, zScore * 0.4)) * 100);

  // Method 2: Monte Carlo (simplified)
  const paths = 10000;
  let wins = 0;
  const drift = 0; // Risk-neutral

  for (let i = 0; i < paths; i++) {
    // Geometric Brownian Motion: S_T = S_0 × exp((μ - 0.5σ²)T + σ√T × Z)
    const z = boxMuller();
    const finalPrice = spot * Math.exp((drift - 0.5 * iv * iv) * t + iv * Math.sqrt(t) * z);
    if (isCreditSpread) {
      // Credit spread wins if price stays above short strike (for puts)
      if (finalPrice >= shortStrike) wins++;
    } else {
      // Debit spread wins if price moves favorably
      if (shortStrike > spot ? finalPrice >= shortStrike : finalPrice <= shortStrike) wins++;
    }
  }
  const popMC = Math.round((wins / paths) * 100);

  // Expected Value calculation
  const avgCredit = distance * spot * 0.35; // ~35% of width as typical credit
  const avgWin = avgCredit * (popMC / 100);
  const avgLoss = (distance * spot - avgCredit) * ((100 - popMC) / 100);
  const ev = Math.round((avgWin - avgLoss) * 100) / 100;

  // Win rates at management points
  const win50Pct = Math.round(popMC * 1.15); // ~15% better with 50% profit management
  const win21Dte = Math.round(popMC * 1.08);  // ~8% better with 21 DTE roll

  return {
    popPercent: Math.min(99, Math.max(1, popMC)),
    popMethod: "MONTE_CARLO",
    expectedValue: ev,
    winRate50Pct: Math.min(99, win50Pct),
    winRate21Dte: Math.min(99, win21Dte),
    maxProfitProbability: Math.round(popMC * 0.3), // Only ~30% of wins reach max profit
  };
}

// ─── SPREAD METRİKLERİ ───

export function calculateSpreadMetrics(
  ivCurve: IVCurve,
  shortStrike: number,
  longStrike: number,
  dte: number,
  isPutSpread: boolean = true
): SpreadMetrics {
  const spot = ivCurve.spotPrice;
  const spreadWidth = Math.abs(shortStrike - longStrike);
  const isCredit = isPutSpread;

  // Net credit/debit estimation
  // Credit ≈ Width × (1 - moneyness factor) × 0.4
  const shortMoneyness = isPutSpread
    ? (shortStrike - spot) / spot  // OTM put: positive
    : (spot - shortStrike) / spot;

  const credit = Math.max(0.05, spreadWidth * 0.35 * (1 - Math.max(0, shortMoneyness)));
  const netCredit = Math.round(credit * 100) / 100;
  const netDebit = 0; // Credit spread

  const maxProfit = netCredit;
  const maxLoss = spreadWidth - netCredit;

  const breakeven = isPutSpread
    ? shortStrike - netCredit
    : shortStrike + netCredit;

  const pop = calculatePOP(ivCurve, shortStrike, dte, isCredit);
  const expMove = calculateExpectedMove(ivCurve, dte);

  // v3.0: Management rules
  const management = {
    entryRules: [
      `IV Rank ${ivCurve.iVRank >= 50 ? ">= 50" : "< 50"} → ${ivCurve.iVRank >= 50 ? "Credit spread" : "Bekle"}`,
      `DTE ${dte} ≤ 45 gün`,
      `Expected Move ($${expMove.moveDollars}) < Spread Width ($${spreadWidth})`,
    ],
    profitTarget: 50,
    profitTargetDollar: Math.round(maxProfit * 0.5 * 100) / 100,
    stopLoss: 200, // 2x credit
    stopLossDollar: Math.round(maxLoss * 100) / 100,
    dteRoll: 21,
    timeStop: 14,
    orderType: "LIMIT",
    slippageMax: 5,
    actions: [
      { trigger: `PNL >= ${Math.round(maxProfit * 0.5 * 100) / 100}$ (%50)`, action: "TAKE_PROFIT", priority: 1 },
      { trigger: `DTE <= 21`, action: "ROLL", priority: 2 },
      { trigger: `PNL <= -${Math.round(maxLoss * 100) / 100}$ (2x credit)`, action: "CLOSE", priority: 1 },
      { trigger: `DTE <= 14`, action: "CLOSE", priority: 3 },
    ],
  };

  // Risk-adjusted metrics
  const rReturn = maxLoss > 0 ? (pop.expectedValue / maxLoss) : 0;
  const sharpeLike = (pop.popPercent / 100) * Math.max(0, rReturn);

  return {
    shortStrike,
    longStrike,
    spreadWidth: Math.round(spreadWidth * 100) / 100,
    netCredit: Math.round(netCredit * 100) / 100,
    netDebit,
    maxProfit: Math.round(maxProfit * 100) / 100,
    maxLoss: Math.round(maxLoss * 100) / 100,
    breakeven: Math.round(breakeven * 100) / 100,
    pop,
    expectedMove: expMove,
    management,
    rReturn: Math.round(rReturn * 100) / 100,
    sharpeLike: Math.round(sharpeLike * 100) / 100,
  };
}

// ─── GREEKS AGGREGATION ───

export function aggregateGreeks(positions: { greeks: Greeks; quantity: number }[]): Greeks {
  return {
    delta: positions.reduce((s, p) => s + p.greeks.delta * p.quantity, 0),
    gamma: positions.reduce((s, p) => s + p.greeks.gamma * p.quantity, 0),
    theta: positions.reduce((s, p) => s + p.greeks.theta * p.quantity, 0),
    vega: positions.reduce((s, p) => s + p.greeks.vega * p.quantity, 0),
    rho: positions.reduce((s, p) => s + p.greeks.rho * p.quantity, 0),
  };
}

export function estimateGreeksFromDelta(
  delta: number,
  optionType: "CALL" | "PUT",
  dte: number,
  iv: number
): Greeks {
  // Simplified Greeks estimation for positions without full option chain data
  const absDelta = Math.abs(delta);
  const gamma = absDelta < 0.5 ? 0.04 : absDelta > 0.7 ? 0.02 : 0.03;
  const thetaPerDay = -(0.01 + iv / 1000 * (45 / Math.max(dte, 7)));
  const vega = 0.1 * iv / 30;

  return {
    delta: optionType === "PUT" ? -absDelta : absDelta,
    gamma,
    theta: thetaPerDay,
    vega,
    rho: 0.01,
  };
}

// ─── UTILITIES ───

function boxMuller(): number {
  // Standard normal random variable
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// ─── IVR SİNYALİ ───
export function ivSignal(ivRank: number, ivPremium: number): {
  signal: "SELL_PREMIUM" | "BUY_PREMIUM" | "NEUTRAL";
  note: string;
} {
  if (ivRank > 70 && ivPremium > 3) {
    return { signal: "SELL_PREMIUM", note: `IV Rank ${ivRank} çok yüksek → Credit spread sat, long premium AÇMA` };
  }
  if (ivRank < 30 && ivPremium < -3) {
    return { signal: "BUY_PREMIUM", note: `IV Rank ${ivRank} çok düşük → Long premium (ucuz), credit spread BEKLE` };
  }
  return { signal: "NEUTRAL", note: `IV Rank ${ivRank} normal → Standart stratejiler` };
}
