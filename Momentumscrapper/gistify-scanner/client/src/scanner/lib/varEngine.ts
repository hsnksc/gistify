/**
 * VaR Engine v4.0 — Value at Risk & Expected Shortfall
 * Kurumsal risk yönetimi: VaR (Parametrik + Tarihsel + Monte Carlo)
 * Expected Shortfall (CVaR) ile kuyruk riski ölçümü
 * Portföy ısısı limiti: NLV'nin %5'i
 */

// ─── PARAMETRİK VaR (Variance-Covariance) ───
// Varsayım: Getiriler normal dağılımlı
// VaR = μ - z_α × σ × PortfolioValue

export function parametricVaR(
  portfolioValue: number,
  meanReturn: number,     // Günlük ortalama getiri
  stdDev: number,         // Günlük standart sapma
  confidenceLevel: number = 0.99, // %99 güven
  holdingPeriod: number = 1        // 1 gün
): { varAmount: number; varPercent: number; zScore: number } {
  // Z-skoru
  const zScores: Record<number, number> = { 0.90: 1.28, 0.95: 1.645, 0.99: 2.326, 0.999: 3.09 };
  const z = zScores[confidenceLevel] || 2.326;

  // Günlük VaR
  const dailyVaR = Math.abs(portfolioValue * (meanReturn - z * stdDev));

  // Holding period adjustment (√T)
  const scaledVaR = dailyVaR * Math.sqrt(holdingPeriod);

  return {
    varAmount: Math.round(scaledVaR),
    varPercent: Math.round((scaledVaR / portfolioValue) * 1000) / 10,
    zScore: z,
  };
}

// ─── TARİHSEL VaR (Historical Simulation) ───
// Geçmiş getirileri sırala, α-percentile'ı al

export function historicalVaR(
  portfolioValue: number,
  historicalReturns: number[], // Günlük getiriler (decimal)
  confidenceLevel: number = 0.99,
  holdingPeriod: number = 1
): { varAmount: number; varPercent: number; worstDay: number; percentileIndex: number } {
  // Sırala (küçükten büyüğe)
  const sorted = [...historicalReturns].sort((a, b) => a - b);
  const n = sorted.length;

  // Percentile index
  const alpha = 1 - confidenceLevel;
  const idx = Math.floor(n * alpha);
  const worstReturn = sorted[Math.max(0, idx)];

  // VaR
  const dailyVaR = Math.abs(portfolioValue * worstReturn);
  const scaledVaR = dailyVaR * Math.sqrt(holdingPeriod);

  return {
    varAmount: Math.round(scaledVaR),
    varPercent: Math.round((scaledVaR / portfolioValue) * 1000) / 10,
    worstDay: Math.round(worstReturn * 1000) / 10,
    percentileIndex: idx,
  };
}

// ─── MONTE CARLO VaR ───
// Geometrik Brownian Motion ile 10,000 path simülasyonu

export function monteCarloVaR(
  portfolioValue: number,
  positions: { ticker: string; beta: number; weight: number }[],
  spyMeanReturn: number,    // SPY günlük ortalama
  spyStdDev: number,        // SPY günlük volatilite
  confidenceLevel: number = 0.99,
  paths: number = 10000,
  days: number = 1
): { varAmount: number; varPercent: number; expectedShortfall: number; esPercent: number; pathsGenerated: number } {
  const returns: number[] = [];

  for (let i = 0; i < paths; i++) {
    // Her pozisyon için GBM
    let portfolioReturn = 0;
    for (const pos of positions) {
      const z = boxMuller();
      // Correlated return: SPY hareketi × beta
      const posReturn = spyMeanReturn + spyStdDev * z * pos.beta;
      portfolioReturn += posReturn * pos.weight;
    }
    returns.push(portfolioReturn);
  }

  // VaR = α-percentile
  const sorted = returns.sort((a, b) => a - b);
  const alpha = 1 - confidenceLevel;
  const varIdx = Math.floor(paths * alpha);
  const varReturn = sorted[Math.max(0, varIdx)];

  // Expected Shortfall = VaR'ın altındaki getirilerin ortalaması
  const tailReturns = sorted.slice(0, varIdx);
  const esReturn = tailReturns.length > 0
    ? tailReturns.reduce((a, b) => a + b, 0) / tailReturns.length
    : varReturn;

  return {
    varAmount: Math.round(Math.abs(portfolioValue * varReturn)),
    varPercent: Math.round(Math.abs(varReturn) * 1000) / 10,
    expectedShortfall: Math.round(Math.abs(portfolioValue * esReturn)),
    esPercent: Math.round(Math.abs(esReturn) * 1000) / 10,
    pathsGenerated: paths,
  };
}

// ─── EXPECTED SHORTFALL (CVaR) ───
// VaR'ın altındaki ortalama kayıp — "kuyruk riski"

export function expectedShortfall(
  portfolioValue: number,
  historicalReturns: number[],
  confidenceLevel: number = 0.99
): { esAmount: number; esPercent: number; tailDays: number; avgTailLoss: number } {
  const sorted = [...historicalReturns].sort((a, b) => a - b);
  const alpha = 1 - confidenceLevel;
  const n = sorted.length;
  const varIdx = Math.floor(n * alpha);

  // Tail: VaR altındaki getiriler
  const tail = sorted.slice(0, Math.max(1, varIdx));
  const avgTailReturn = tail.reduce((a, b) => a + b, 0) / tail.length;

  return {
    esAmount: Math.round(Math.abs(portfolioValue * avgTailReturn)),
    esPercent: Math.round(Math.abs(avgTailReturn) * 1000) / 10,
    tailDays: tail.length,
    avgTailLoss: Math.round(avgTailReturn * 1000) / 10,
  };
}

// ─── AGGREGATE GREEKS LİMİTLERİ ───
// v4.0: Portföy seviyesinde Greeks limitleri

export interface GreeksLimits {
  netDelta: number;       // Max |delta|
  netGamma: number;       // Max gamma (değişkenlik)
  netVega: number;        // Max |vega| ($ per 1% IV)
  netTheta: number;       // Min theta ($/day income)
}

export function calculateGreeksLimits(nlv: number): GreeksLimits {
  return {
    netDelta: Math.round(nlv * 0.01),    // Delta limiti: NLV'nin %1'i
    netGamma: Math.round(nlv * 0.005),   // Gamma limiti: NLV'nin %0.5'i
    netVega: Math.round(nlv * 0.02),     // Vega limiti: NLV'nin %2'si
    netTheta: Math.round(nlv * 0.001),   // Theta hedefi: NLV'nin %0.1'i/gün
  };
}

export function checkGreeksLimits(
  currentGreeks: { delta: number; gamma: number; vega: number; theta: number },
  limits: GreeksLimits
): { withinLimits: boolean; violations: string[] } {
  const violations: string[] = [];

  if (Math.abs(currentGreeks.delta) > limits.netDelta) {
    violations.push(`Delta ${currentGreeks.delta} > limit ${limits.netDelta} → Piyasa hareketine aşırı duyarlı`);
  }
  if (currentGreeks.gamma > limits.netGamma) {
    violations.push(`Gamma ${currentGreeks.gamma} > limit ${limits.netGamma} → Delta değişkenliği tehlikeli`);
  }
  if (Math.abs(currentGreeks.vega) > limits.netVega) {
    violations.push(`Vega ${currentGreeks.vega} > limit ${limits.netVega} → IV hareketine aşırı duyarlı`);
  }
  if (currentGreeks.theta < limits.netTheta) {
    violations.push(`Theta $${currentGreeks.theta}/gün < hedef $${limits.netTheta} → Yetersiz zaman geliri`);
  }

  return {
    withinLimits: violations.length === 0,
    violations,
  };
}

// ─── TARİHSEL ŞOK TESTLERİ ───
// Black Swan senaryoları

export interface ShockScenario {
  name: string;
  spyMove: number;     // % SPY hareketi
  vixMove: number;     // % VIX hareketi
  ivSpike: number;     // % IV artışı
  description: string;
}

export const SHOCK_SCENARIOS: ShockScenario[] = [
  { name: "1987 Crash (Black Monday)", spyMove: -20.0, vixMove: +300, ivSpike: +150, description: "Tek günde %20 düşüş, VIX 150+'ye çıkış" },
  { name: "2008 Lehman", spyMove: -8.0, vixMove: +150, ivSpike: +80, description: "Sistemik risk, kredi piyasası donması" },
  { name: "2020 COVID Crash", spyMove: -12.0, vixMove: +200, ivSpike: +100, description: "Pandimik şok, 34 günde %34 düşüş" },
  { name: "2022 Inflation Shock", spyMove: -5.0, vixMove: +80, ivSpike: +50, description: "Fed agresif sıkılaştırma" },
  { name: "Flash Crash 2010", spyMove: -9.0, vixMove: +100, ivSpike: +60, description: "Algo-driven ani çöküş, 15 dk içinde" },
];

export function stressTestShock(
  portfolioValue: number,
  betaWeightedDelta: number,
  totalVega: number,
  scenario: ShockScenario
): { portfolioPnL: number; pnLPct: number; description: string } {
  // Delta P&L: BWD × SPY move
  const deltaPnL = betaWeightedDelta * (scenario.spyMove / 100) * 100;
  // Vega P&L: Vega × IV spike
  const vegaPnL = totalVega * (scenario.ivSpike / 100);
  // Total
  const totalPnL = deltaPnL + vegaPnL;

  return {
    portfolioPnL: Math.round(totalPnL),
    pnLPct: Math.round((totalPnL / portfolioValue) * 1000) / 10,
    description: `${scenario.name}: SPY ${scenario.spyMove}% / VIX +${scenario.vixMove}% → P&L $${Math.round(totalPnL)} (%${Math.round((totalPnL / portfolioValue) * 1000) / 10})`,
  };
}

// ─── UTIL ───

function boxMuller(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
