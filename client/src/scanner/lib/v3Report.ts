/**
 * v3.0 Kurumsal Rapor Motoru — 4 Katmanlı Sistem
 * Katman 1: Rejim | Katman 2: Açık Pozisyonlar | Katman 3: Yeni Kurulumlar | Katman 4: Portföy Sağlığı
 */

import type {
  v3Report, OptionPosition, PositionActionItem, NewSetup,
  PriorityItem, PortfolioRisk, MarketRegime, IVCurve,
  StressTestResult, SectorExposure,
} from "./optionsTypes";
import { detectMarketRegime, calculateIVCurve, regimeDescription } from "./regimeDetector";
import { calculateExpectedMove, calculatePOP, calculateSpreadMetrics } from "./optionAnalytics";
import { createManagementRules, determineAction } from "./executionRules";
import { calculatePortfolioRisk } from "./portfolioRisk";
import { type AppLanguage } from "@/lib/i18n";

// ─── DEMO/GERÇEK POZİSYON ÜRETİCİ ───

export interface RawPosition {
  ticker: string;
  strategy: string;
  entryDate: string;
  entryPrice: number;      // per spread
  currentPrice: number;
  shortStrike: number;
  longStrike: number;
  dte: number;
  greeks: { delta: number; gamma: number; theta: number; vega: number };
  underlyingPrice: number;
  isCreditSpread: boolean;
  quantity: number;
}

// ─── KATMAN 1: REJİM ───

function buildRegimeLayer(ivCurves: IVCurve[]): MarketRegime {
  return detectMarketRegime(ivCurves);
}

// ─── KATMAN 2: AÇIK POZİSYONLAR ───

function buildPositionLayer(
  positions: RawPosition[],
  ivCurves: Record<string, IVCurve>
): { openPositions: OptionPosition[]; actions: PositionActionItem[] } {
  const openPositions: OptionPosition[] = [];
  const actions: PositionActionItem[] = [];

  for (const raw of positions) {
    const iv = ivCurves[raw.ticker];
    const pnl = (raw.currentPrice - raw.entryPrice) * raw.quantity * (raw.isCreditSpread ? -1 : 1);
    const pnlPct = ((raw.currentPrice - raw.entryPrice) / Math.abs(raw.entryPrice)) * 100 * (raw.isCreditSpread ? -1 : 1);

    const mgmt = createManagementRules(
      Math.abs(raw.entryPrice),
      Math.abs(raw.shortStrike - raw.longStrike),
      raw.dte,
      raw.isCreditSpread
    );

    const pos: OptionPosition = {
      id: `${raw.ticker}_${raw.strategy}_${raw.entryDate}`,
      ticker: raw.ticker,
      strategy: raw.strategy,
      legs: [], // Simplified
      entryDate: raw.entryDate,
      entryPrice: raw.entryPrice,
      currentPrice: raw.currentPrice,
      dte: raw.dte,
      greeks: {
        delta: raw.greeks.delta * raw.quantity,
        gamma: raw.greeks.gamma * raw.quantity,
        theta: raw.greeks.theta * raw.quantity,
        vega: raw.greeks.vega * raw.quantity,
        rho: 0,
      },
      pnl: Math.round(pnl * 100) / 100,
      pnlPct: Math.round(pnlPct * 100) / 100,
      management: mgmt,
    };
    openPositions.push(pos);

    // Aksiyon belirle
    const actionResult = determineAction(
      pnlPct,
      raw.dte,
      Math.abs(raw.entryPrice),
      Math.abs(raw.shortStrike - raw.longStrike),
      raw.underlyingPrice,
      raw.shortStrike,
      iv?.iVRank || 50
    );

    actions.push({
      ticker: raw.ticker,
      strategy: raw.strategy,
      dte: raw.dte,
      pnlPct: Math.round(pnlPct * 100) / 100,
      action: actionResult.action,
      urgency: actionResult.urgency,
      rationale: actionResult.reason,
    });
  }

  return { openPositions, actions };
}

// ─── KATMAN 3: YENİ KURULUMLAR ───

function buildSetupLayer(
  candidates: { ticker: string; score: number; price: number; atr: number; rsi: number }[],
  ivCurves: Record<string, IVCurve>,
  nlv: number,
  regime: MarketRegime
): NewSetup[] {
  const setups: NewSetup[] = [];

  for (const c of candidates) {
    if (c.score < 45) continue;
    const iv = ivCurves[c.ticker];
    if (!iv) continue;

    // Skip if regime doesn't allow
    if (!regime.creditSpreadAllowed && c.score >= 50) continue;

    const dte = Math.min(regime.maxDteRecommendation, 45);
    const expMove = calculateExpectedMove(iv, dte);

    // Spread design: 0.15-0.25 delta short strike
    const otmPct = c.rsi > 70 ? 0.08 : c.rsi > 60 ? 0.06 : 0.05; // Deeper OTM if extended
    const shortStrike = Math.round(c.price * (1 - otmPct));
    const longStrike = Math.round(shortStrike * 0.90); // 10% width
    const spreadWidth = shortStrike - longStrike;

    const metrics = calculateSpreadMetrics(iv, shortStrike, longStrike, dte, true);

    const maxRiskPctNLV = (metrics.maxLoss / nlv) * 100;
    if (maxRiskPctNLV > 2.5) continue; // Skip if too big for account

    setups.push({
      ticker: c.ticker,
      strategy: `Bull Put Spread`,
      score: Math.min(10, Math.round(c.score / 10)),
      setup: `Short ${shortStrike}P / Long ${longStrike}P, ${dte} DTE`,
      pop: metrics.pop.popPercent,
      maxRisk: metrics.maxLoss,
      maxRiskPctNLV: Math.round(maxRiskPctNLV * 100) / 100,
      credit: metrics.netCredit,
      profitTarget: 50,
      stopLoss: 200, // 2x credit
      dteRoll: 21,
      expectedMove: expMove.moveDollars,
      breakeven: metrics.breakeven,
      ivRank: iv.iVRank,
      ifFails: iv.termShape === "BACKWARDATION"
        ? "IV spike + put skew artışı, assignment riski"
        : "Delta hedge veya kapat",
    });
  }

  return setups.sort((a, b) => b.score - a.score).slice(0, 5);
}

// ─── KATMAN 4: PORTFÖY SAĞLIĞI ───

function buildPortfolioLayer(
  positions: RawPosition[],
  nlv: number,
  language: AppLanguage = "tr"
): PortfolioRisk {
  const posForRisk = positions.map((p) => ({
    ticker: p.ticker,
    greeks: { ...p.greeks, rho: 0 },
    notionalValue: Math.abs(p.greeks.delta * p.underlyingPrice * 100 * p.quantity),
    quantity: p.quantity,
  }));

  return calculatePortfolioRisk(posForRisk, nlv, language);
}

// ─── KRİTİK ÖNCELİKLER ───

function buildPriorities(
  actions: PositionActionItem[],
  portfolio: PortfolioRisk,
  regime: MarketRegime
): PriorityItem[] {
  const priorities: PriorityItem[] = [];

  // 1. Critical position actions
  const criticalActions = actions.filter((a) => a.urgency === "CRITICAL");
  for (const a of criticalActions.slice(0, 3)) {
    priorities.push({
      emoji: "🚨",
      ticker: a.ticker,
      issue: a.action,
      action: a.rationale,
    });
  }

  // 2. Regime warnings
  if (!regime.creditSpreadAllowed) {
    priorities.push({
      emoji: "⚠️",
      ticker: "MARKET",
      issue: `BACKWARDATION: Credit spread SATMA`,
      action: "Long premium stratejilerine geç, pozisyon yarıya",
    });
  }

  // 3. Portfolio warnings
  if (portfolio.maxSectorConcentration > 30) {
    const maxSector = portfolio.sectorExposures.sort((a, b) => b.pctOfPortfolio - a.pctOfPortfolio)[0];
    priorities.push({
      emoji: "⚠️",
      ticker: maxSector?.sector || "PORTFOLIO",
      issue: `Sektör konsantrasyonu %${portfolio.maxSectorConcentration}`,
      action: "Çeşitlendir: Farklı sektörlere spread aç",
    });
  }

  if (Math.abs(portfolio.totalVega) > portfolio.vegaLimit) {
    priorities.push({
      emoji: "⚠️",
      ticker: "PORTFOLIO",
      issue: `Vega $${portfolio.totalVega} > limit $${portfolio.vegaLimit}`,
      action: "IV hareketine hedge ekle veya pozisyon küçült",
    });
  }

  // 4. Opportunities
  if (regime.creditSpreadAllowed && regime.vixRegime === "EXTREME_FEAR") {
    priorities.push({
      emoji: "✅",
      ticker: "MARKET",
      issue: `VIX ${regime.vixLevel}: Premium zengini ortam`,
      action: "Korku zirvede → Credit spread fırsatı (discipline ile)",
    });
  }

  return priorities.slice(0, 5);
}

// ─── ANA RAPOR MOTORU ───

export interface ReportInputs {
  language?: AppLanguage;
  positions: RawPosition[];
  candidates: { ticker: string; score: number; price: number; atr: number; rsi: number; closePrices: number[]; highPrices: number[]; lowPrices: number[] }[];
  nlv: number; // Net Liquidation Value
}

export function generateV3Report(inputs: ReportInputs): v3Report {
  const now = new Date().toISOString();

  // 1. Build IV Curves for all tickers
  const ivCurves: Record<string, IVCurve> = {};
  const allTickers = new Set([
    ...inputs.positions.map((p) => p.ticker),
    ...inputs.candidates.map((c) => c.ticker),
  ]);

  Array.from(allTickers).forEach((t) => {
    const cand = inputs.candidates.find((c) => c.ticker === t);
    const pos = inputs.positions.find((p) => p.ticker === t);
    const price = cand?.price || pos?.underlyingPrice || 100;
    const closes = cand?.closePrices || [price * 0.95, price * 0.97, price * 0.96, price * 0.98, price];
    const highs = cand?.highPrices || closes.map((c) => c * 1.02);
    const lows = cand?.lowPrices || closes.map((c) => c * 0.98);

    ivCurves[t] = calculateIVCurve(t, price, closes, highs, lows);
  });

  // 2. Katman 1: Rejim
  const regime = buildRegimeLayer(Object.values(ivCurves));

  // 3. Katman 2: Açık Pozisyonlar
  const { openPositions, actions } = buildPositionLayer(inputs.positions, ivCurves);

  // 4. Katman 3: Yeni Kurulumlar
  const newSetups = buildSetupLayer(inputs.candidates, ivCurves, inputs.nlv, regime);

  // 5. Katman 4: Portföy Sağlığı
  const portfolioRisk = buildPortfolioLayer(inputs.positions, inputs.nlv, inputs.language);

  // 6. Kritik Öncelikler
  const priorities = buildPriorities(actions, portfolioRisk, regime);

  return {
    generatedAt: now,
    version: "3.0",
    regime,
    openPositions,
    positionActions: actions,
    newSetups,
    portfolioRisk,
    criticalPriorities: priorities,
  };
}

// ─── RAPOR FORMATLAYICI (Text Output) ───

export function formatV3Report(report: v3Report): string {
  const lines: string[] = [];

  lines.push("=".repeat(80));
  lines.push(`📊 OPSİYON STRATEJİ RAPORU v${report.version}`);
  lines.push(`📅 ${new Date(report.generatedAt).toLocaleString("tr-TR")}`);
  lines.push("=".repeat(80));

  // Katman 1
  lines.push("");
  lines.push("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
  lines.push("┃ 🔬 KATMAN 1: PİYASA REJİMİ                                                  ┃");
  lines.push("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛");
  const r = report.regime;
  lines.push(`   VIX: ${r.vixLevel} (${r.vixRegime.replace(/_/g, " ")}) | Trend: ${r.vixTrend}`);
  lines.push(`   Term Structure: ${r.termStructure}`);
  lines.push(`   Credit Spread: ${r.creditSpreadAllowed ? "✅ İzinli" : "❌ YASAK"} | Long Premium: ${r.longPremiumAllowed ? "✅ İzinli" : "❌ YASAK"}`);
  lines.push(`   Max DTE: ${r.maxDteRecommendation} gün | Sizing: ${r.sizingFactor}x`);

  // Katman 2
  lines.push("");
  lines.push("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
  lines.push("┃ ⚡ KATMAN 2: AÇIK POZİSYONLAR                                               ┃");
  lines.push("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛");

  if (report.openPositions.length === 0) {
    lines.push("   Açık pozisyon yok.");
  } else {
    for (const pos of report.openPositions) {
      const emoji = pos.pnlPct >= 0 ? "🟢" : "🔴";
      lines.push(`   ${emoji} ${pos.ticker} ${pos.strategy} | DTE:${pos.dte} | Δ:${pos.greeks.delta.toFixed(0)} | P&L:${pos.pnlPct >= 0 ? "+" : ""}${pos.pnlPct.toFixed(1)}%`);
      lines.push(`      Theta: $${pos.greeks.theta.toFixed(2)}/gün | Vega: $${pos.greeks.vega.toFixed(2)}`);
      lines.push(`      Yönetim: %${pos.management.profitTarget} kâr al | ${pos.management.dteRoll} DTE roll | ${pos.management.stopLoss/100}x kredi stop`);
    }
  }

  // Actions
  lines.push("");
  lines.push("   📋 AKSİYON LİSTESİ:");
  const sortedActions = [...report.positionActions].sort((a, b) => {
    const order = { CRITICAL: 0, WARNING: 1, INFO: 2 };
    return order[a.urgency] - order[b.urgency];
  });
  for (const a of sortedActions) {
    const emoji = a.urgency === "CRITICAL" ? "🚨" : a.urgency === "WARNING" ? "⚠️" : "ℹ️";
    lines.push(`   ${emoji} [${a.ticker}] ${a.action} (P&L: ${a.pnlPct >= 0 ? "+" : ""}${a.pnlPct.toFixed(1)}%, DTE:${a.dte})`);
    lines.push(`      → ${a.rationale}`);
  }

  // Katman 3
  lines.push("");
  lines.push("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
  lines.push("┃ 🎯 KATMAN 3: YENİ KURULUMLAR                                                ┃");
  lines.push("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛");

  if (report.newSetups.length === 0) {
    lines.push("   Uygun kurulum bulunamadı (rejim kısıtlamaları veya düşük skor).");
  } else {
    for (const s of report.newSetups) {
      const scoreEmoji = s.score >= 8 ? "🟢" : s.score >= 6 ? "🟡" : "⚪";
      lines.push(`   ${scoreEmoji} [${s.ticker}] ${s.strategy} (Skor ${s.score}/10)`);
      lines.push(`      ↳ Kurulum: ${s.setup}`);
      lines.push(`      ↳ POP: %${s.pop} | Max Risk: $${s.maxRisk} (NLV %${s.maxRiskPctNLV}) | Kredi: $${s.credit}`);
      lines.push(`      ↳ Kâr Al: %${s.profitTarget} | Stop: ${s.stopLoss/100}x kredi | Yönetim: ${s.dteRoll} DTE roll`);
      lines.push(`      ↳ Expected Move: $${s.expectedMove.toFixed(2)} | Breakeven: $${s.breakeven.toFixed(2)} | IV Rank: ${s.ivRank}`);
      lines.push(`      ↳ Çalışmazsa: ${s.ifFails}`);
      lines.push("");
    }
  }

  // Katman 4
  lines.push("");
  lines.push("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
  lines.push("┃ 🛡️ KATMAN 4: PORTFÖY SAĞLIĞI                                               ┃");
  lines.push("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛");
  const pr = report.portfolioRisk;
  const spyEquiv = (pr.betaWeightedDelta / 100).toFixed(1);
  lines.push(`   Beta-Weighted Delta: ${pr.betaWeightedDelta >= 0 ? "+" : ""}${pr.betaWeightedDelta.toFixed(0)} (≈SPY %${spyEquiv} long)`);
  lines.push(`   Vega: $${pr.totalVega.toFixed(0)} (Limit: $${pr.vegaLimit}) | Theta: +$${pr.totalTheta.toFixed(2)}/gün (Hedef: $${pr.thetaTarget})`);
  lines.push(`   Sektör Dağılımı:`);
  for (const se of pr.sectorExposures) {
    const warning = se.warning ? " ⚠️" : "";
    lines.push(`      ${se.sector}: Δ${se.betaWeightedDelta >= 0 ? "+" : ""}${se.betaWeightedDelta.toFixed(0)} | $${se.notionalExposure.toLocaleString()} (%${se.pctOfPortfolio})${warning}`);
  }

  // Stress Test
  lines.push(`   Stress Test (${pr.stressTest.scenario}):`);
  lines.push(`      P&L: $${pr.stressTest.portfolioPnL.toLocaleString()} (${pr.stressTest.portfolioPnLPct >= 0 ? "+" : ""}${pr.stressTest.portfolioPnLPct.toFixed(2)}% NLV)`);
  lines.push(`      En kötü: ${pr.stressTest.maxLossTicker} | BP Etki: $${pr.stressTest.marginImpact.toLocaleString()}`);
  lines.push(`      ${pr.stressTest.withinLimits ? "✅ Limit içinde" : "🚨 LİMİT AŞILDI"}`);

  // Korelasyon uyarıları
  if (pr.correlationWarnings.length > 0) {
    lines.push("   Korelasyon Uyarıları:");
    for (const w of pr.correlationWarnings) {
      lines.push(`      ${w}`);
    }
  }

  // Kritik Öncelikler
  lines.push("");
  lines.push("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
  lines.push("┃ 📌 KRİTİK ÖNCELİKLER                                                        ┃");
  lines.push("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛");
  for (const p of report.criticalPriorities) {
    lines.push(`   ${p.emoji} [${p.ticker}] ${p.issue}`);
    lines.push(`      → ${p.action}`);
  }

  lines.push("");
  lines.push("=".repeat(80));

  return lines.join("\n");
}
