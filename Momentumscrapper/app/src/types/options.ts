/**
 * NASDAQ Momentum Scanner v3.0 — Kurumsal Opsiyon Analiz Tipleri
 * 6 kritik eksiklik kapatıldı:
 *  1. IV Term Structure + Skew (eğri okuma)
 *  2. Beta-weighted Greeks (portföy seviyesi)
 *  3. Expected Move hesaplama
 *  4. Yönetim kuralları (çıkış stratejileri)
 *  5. Korelasyon riski (sektör matrisi)
 *  6. Execution kalitesi (giriş/çıkış kuralları)
 */

// ──────────────────────── KATMAN 0: TEMEL GREKS ────────────────────────

export interface Greeks {
  delta: number;   // -1 to +1
  gamma: number;   // Greek per $1 move
  theta: number;   // $/day decay
  vega: number;    // $ per 1% IV change
  rho: number;     // $ per 1% rate change
}

export interface OptionLeg {
  side: "BUY" | "SELL";
  optionType: "CALL" | "PUT";
  strike: number;
  expiration: string; // YYYY-MM-DD
  quantity: number;
  premium: number;    // per contract
  greeks: Greeks;
}

export interface OptionPosition {
  id: string;
  ticker: string;
  strategy: string;        // "Bull Put Spread", "Long Call", etc.
  legs: OptionLeg[];
  entryDate: string;
  entryPrice: number;      // Net debit/credit per spread
  currentPrice: number;
  dte: number;             // Days to expiration
  greeks: Greeks;          // Position-level aggregated Greeks
  pnl: number;
  pnlPct: number;
  // v3.0: Yönetim kuralları
  management: PositionManagement;
}

// ──────────────────────── KATMAN 1: REJİM ────────────────────────

export type VixRegime = "EXTREME_FEAR" | "FEAR" | "NORMAL" | "COMPLACENT" | "EXTREME_COMPLACENT";
export type TermStructure = "CONTANGO" | "BACKWARDATION" | "FLAT";

export interface IVTermPoint {
  daysToExpiry: number;
  iv: number;         // Implied vol at this tenor
  label: string;      // "0DTE", "7D", "30D", "60D", "90D"
}

export interface IVSkewPoint {
  delta: number;      // 0.10, 0.25, 0.50, 0.75, 0.90
  strikePct: number;  // % of spot (e.g. 0.90 = 90% OTM put)
  iv: number;
  label: string;      // "10Δ Put", "25Δ Put", "ATM", "25Δ Call", "10Δ Call"
}

export interface IVCurve {
  ticker: string;
  spotPrice: number;
  termStructure: IVTermPoint[];  // IV eğrisi (vade yapısı)
  skew: IVSkewPoint[];           // Vol skew (smile/smirk)
  iVRank: number;                // 0-100
  iVPercentile: number;          // 0-100
  termShape: TermStructure;      // Contango / Backwardation / Flat
  currentIV: number;             // 30-day ATM IV
  historicalIV: number;          // 20-day realized vol
  ivPremium: number;             // IV - HV (positive = opsiyon pahalı)
}

export interface MarketRegime {
  vixLevel: number;
  vixRegime: VixRegime;
  termStructure: TermStructure;
  vixTrend: "RISING" | "FALLING" | "STABLE";
  // Kurallar
  creditSpreadAllowed: boolean;    // Backwardation'da credit satma YASAK
  longPremiumAllowed: boolean;     // Yüksek IV'da long premium YASAK
  maxDteRecommendation: number;    // Regime'e göre max vade
  sizingFactor: number;            // 0.5-1.5 (regime'e göre pozisyon büyüklüğü)
}

// ──────────────────────── KATMAN 2: ANALİTİKLER ────────────────────────

export interface ExpectedMove {
  days: number;
  moveDollars: number;     // $ move expected
  movePercent: number;     // % move expected
  straddleCost: number;    // ATM Straddle = Expected Move
  source: "STRADDLE" | "FORMULA" | "HISTORICAL";
}

export interface ProbabilityOfProfit {
  popPercent: number;           // Probability of Profit (%)
  popMethod: "DELTA" | "MONTE_CARLO" | "HISTORICAL";
  expectedValue: number;        // EV = (Win% × AvgWin) - (Loss% × AvgLoss)
  winRate50Pct: number;         // %50 kâr realizasyonu win rate
  winRate21Dte: number;         // 21 DTE roll win rate
  maxProfitProbability: number; // Max profit realization %
}

export interface SpreadMetrics {
  shortStrike: number;
  longStrike: number;
  spreadWidth: number;
  netCredit: number;
  netDebit: number;
  maxProfit: number;
  maxLoss: number;
  breakeven: number;
  pop: ProbabilityOfProfit;
  expectedMove: ExpectedMove;
  management: PositionManagement;
  // v3.0: Risk-adjusted
  rReturn: number;        // Expected Return / Max Risk
  sharpeLike: number;     // POP × rReturn
}

// ──────────────────────── KATMAN 3: YÖNETİM KURALLARI ────────────────────────

export interface PositionManagement {
  // Giriş kuralları
  entryRules: string[];
  // Çıkış kuralları (kurumsal trader çıkışı optimize eder)
  profitTarget: number;          // %50 kâr al (Tastytrade kuralı)
  profitTargetDollar: number;    // $ cinsinden
  stopLoss: number;              // 2x credit received (Tastytrade kuralı)
  stopLossDollar: number;        // $ cinsinden
  dteRoll: number;               // 21 DTE'de roll (kurumsal kural)
  timeStop: number;              // 14 DTE'de kapat (son çare)
  // Execution
  orderType: "LIMIT" | "MIDPOINT" | "MARKET";
  slippageMax: number;           // Max % slippage tolerance
  // Aksiyon planı
  actions: ManagementAction[];
}

export interface ManagementAction {
  trigger: string;          // "PNL >= 50%", "DTE <= 21", "UNDERLYING_TOUCH_SHORT"
  action: string;           // "CLOSE", "ROLL", "TAKE_PROFIT", "ADJUST"
  priority: number;         // 1 = highest
}

// ──────────────────────── KATMAN 4: PORTFÖY RİSKİ ────────────────────────

export interface SectorExposure {
  sector: string;
  betaWeightedDelta: number;
  notionalExposure: number;    // $ exposure
  pctOfPortfolio: number;      // % of total NLV
  warning: boolean;            // TRUE if > 30% concentration
}

export interface PortfolioRisk {
  // Ana metrikler
  netLiquidationValue: number;
  betaWeightedDelta: number;       // SPY equivalent delta
  totalTheta: number;              // $/day time decay income
  totalVega: number;               // $ per 1% IV move
  totalGamma: number;              // Greek risk
  // Sektör dağılımı
  sectorExposures: SectorExposure[];
  maxSectorConcentration: number;  // %
  // Stress test
  stressTest: StressTestResult;
  // Limitler
  vegaLimit: number;               // Max allowed vega (NLV × 0.02)
  thetaTarget: number;             // Min theta income (NLV × 0.001/day)
  // Korelasyon uyarıları
  correlationWarnings: string[];
}

export interface StressTestResult {
  scenario: string;           // "SPY -2% / VIX +30%"
  portfolioPnL: number;       // $ P&L under stress
  portfolioPnLPct: number;    // % P&L under stress
  maxLossTicker: string;      // Worst performer
  marginImpact: number;       // Buying power impact
  withinLimits: boolean;      // Pass/fail
}

export interface BetaMatrix {
  ticker: string;
  sector: string;
  betaToSPY: number;
  betaToQQQ: number;
  betaToSector: number;
}

// ──────────────────────── KATMAN 5: RAPOR ────────────────────────

export interface v3Report {
  generatedAt: string;
  version: "3.0";
  // Katman 1: Rejim
  regime: MarketRegime;
  // Katman 2: Açık Pozisyonlar
  openPositions: OptionPosition[];
  positionActions: PositionActionItem[];
  // Katman 3: Yeni Kurulumlar
  newSetups: NewSetup[];
  // Katman 4: Portföy Sağlığı
  portfolioRisk: PortfolioRisk;
  // Kritik öncelikler
  criticalPriorities: PriorityItem[];
}

export interface PositionActionItem {
  ticker: string;
  strategy: string;
  dte: number;
  pnlPct: number;
  action: string;       // "KAPAT", "KAR REALİZE", "ROLL", "HEDGE"
  urgency: "CRITICAL" | "WARNING" | "INFO";
  rationale: string;    // Neden bu aksiyon
}

export interface NewSetup {
  ticker: string;
  strategy: string;
  score: number;        // 0-10
  setup: string;        // "Short 45P / Long 40P, 35 DTE"
  pop: number;          // % Probability of Profit
  maxRisk: number;      // $ max risk
  maxRiskPctNLV: number; // % of net liquidation value
  credit: number;       // $ credit received
  profitTarget: number; // %50
  stopLoss: number;     // 2x credit
  dteRoll: number;      // 21
  expectedMove: number; // $ expected move
  breakeven: number;    // $ breakeven price
  ivRank: number;
  ifFails: string;      // "IV spike + put skew artışı"
}

export interface PriorityItem {
  emoji: string;        // 🚨 ⚠️ ✅
  ticker: string;
  issue: string;
  action: string;
}

// ──────────────────────── EXECUTION ────────────────────────

export interface ExecutionPlan {
  symbol: string;
  strategy: string;
  orderType: "LIMIT" | "MIDPOINT" | "MARKET";
  limitPrice: number;       // Natural or mid price
  midPrice: number;         // Midpoint of bid/ask
  slippageEstimate: number; // % estimated slippage
  fillProbability: number;  // % chance of fill at limit
  timing: string;           // "OPEN_930", "MID_1100", "CLOSE_1530"
  notes: string[];
}

// ──────────────────────── BACKWARD COMPAT ────────────────────────

export { ScoreExplanation, ConfidenceBreakdown, RankingInfo, StockResult, ScanStats, ScanResponse } from "./scanner";
