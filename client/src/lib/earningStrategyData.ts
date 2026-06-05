import type {
  WeeklyDirectionalBias,
  WeeklyEarningsTime,
  WeeklyReportEntry,
  WeeklyReportRecord,
} from "@shared/weeklyReports";
import {
  earningsCalendar as staticCalendar,
  stocksData as staticStocks,
  type RiskLevel,
  type SignalLevel,
  type StockData,
  type VolumeStatus,
} from "@/lib/stockData";
import {
  optionStrategyData as staticOptions,
  type OptionStrategy,
} from "@/lib/optionStrategyData";

export interface StrategyCalendarItem {
  id: string;
  sortDate: string;
  label: string;
  ticker: string;
  name: string;
  time: string;
  signal: SignalLevel;
}

export interface EarningStrategyDataset {
  source: "static" | "published";
  stocks: StockData[];
  options: OptionStrategy[];
  calendar: StrategyCalendarItem[];
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function round(value: number, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function formatDisplayDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatCalendarLabel(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function normalizeStockEarningsTime(
  value: WeeklyEarningsTime
): StockData["earningsTime"] {
  if (value === "BMO" || value === "BH") {
    return "BMO";
  }

  return "AMC";
}

function mapBiasToOptionDirection(
  value: WeeklyDirectionalBias
): OptionStrategy["directionalBias"] {
  if (value === "Bullish") {
    return "CALL";
  }
  if (value === "Bearish") {
    return "PUT";
  }

  return "NEUTRAL";
}

function mapStrategyToSignal(entry: WeeklyReportEntry): SignalLevel {
  if (entry.directionalBias === "Bearish") {
    if (entry.strategyRating === "EXCELLENT" || entry.strategyRating === "GOOD") {
      return "SELL";
    }
    return "STRONG_SELL";
  }

  if (entry.strategyRating === "EXCELLENT") {
    return entry.momentumScore >= 85 ? "STRONG_BUY" : "BUY";
  }
  if (entry.strategyRating === "GOOD") {
    return "BUY";
  }
  if (entry.strategyRating === "FAIR") {
    return "NEUTRAL";
  }

  return "SELL";
}

function deriveVolumeStatus(entry: WeeklyReportEntry): VolumeStatus {
  if (entry.momentumScore >= 85 || entry.currentIV >= 85) {
    return "VERY_HIGH";
  }
  if (entry.momentumScore >= 70 || entry.currentIV >= 65) {
    return "HIGH";
  }
  if (entry.momentumScore >= 50) {
    return "NORMAL";
  }

  return "LOW";
}

function deriveRiskLevel(entry: WeeklyReportEntry): RiskLevel {
  return entry.riskLevel;
}

function buildFallbackCatalysts(entry: WeeklyReportEntry, report?: WeeklyReportRecord) {
  return [
    ...(report?.content.keyCatalysts || []).slice(0, 2),
    entry.thesis,
    `Önerilen yapı: ${entry.recommendedStrategy}`,
  ].filter((value, index, list) => Boolean(value) && list.indexOf(value) === index);
}

function buildFallbackRisks(entry: WeeklyReportEntry) {
  return [
    `Gap riski: %${entry.gapRisk}`,
    `Miss riski: %${entry.earningsMissRisk}`,
    entry.riskLevel === "VERY_HIGH"
      ? "Yüksek oynaklık nedeniyle küçük boyut tercih edilmeli."
      : "Pozisyon boyutu implied move ile uyumlu tutulmalı.",
  ];
}

function buildFallbackHistoricalMoves(entry: WeeklyReportEntry) {
  return [
    round(entry.lastEarningsMove, 1),
    round(entry.lastEarningsMove * 0.7, 1),
    round(entry.targetProfit / 12, 1),
    round(-entry.gapRisk / 8, 1),
  ];
}

function buildVolumeNumbers(
  base: StockData | undefined,
  entry: WeeklyReportEntry,
  status: VolumeStatus
) {
  if (base) {
    return {
      volumeCurrent: base.volumeCurrent,
      volumeAvg3M: base.volumeAvg3M,
      volumePriceFit: base.volumePriceFit,
    };
  }

  const multiplier =
    status === "VERY_HIGH" ? 1.9 : status === "HIGH" ? 1.45 : status === "NORMAL" ? 1.1 : 0.85;
  const volumeAvg3M = round(Math.max(1, entry.currentIV / 8), 1);
  const volumeCurrent = round(volumeAvg3M * multiplier, 1);

  return {
    volumeCurrent,
    volumeAvg3M,
    volumePriceFit:
      entry.strategyRating === "POOR"
        ? "MISALIGNED"
        : entry.strategyRating === "FAIR"
          ? "RISKY"
          : "ALIGNED",
  } satisfies Pick<
    StockData,
    "volumeCurrent" | "volumeAvg3M" | "volumePriceFit"
  >;
}

function buildStockFromEntry(
  entry: WeeklyReportEntry,
  report?: WeeklyReportRecord
): StockData {
  const base = staticStocks.find(stock => stock.ticker === entry.ticker);
  const signal = mapStrategyToSignal(entry);
  const volumeStatus = deriveVolumeStatus(entry);
  const riskLevel = deriveRiskLevel(entry);
  const { volumeCurrent, volumeAvg3M, volumePriceFit } = buildVolumeNumbers(
    base,
    entry,
    volumeStatus
  );
  const currentPrice =
    base?.currentPrice ??
    round(Math.max(20, (entry.callPremiumSell + entry.putPremiumSell) * 11), 2);
  const priceTargetUpside =
    base?.priceTargetUpside ??
    clamp(round(entry.targetProfit * 0.18, 1), -18, 30);
  const priceTarget =
    base?.priceTarget ?? round(currentPrice * (1 + priceTargetUpside / 100), 2);
  const analystBuyConsensus =
    base?.analystBuyConsensus ??
    clamp(
      Math.round(
        40 +
          entry.beatRate * 0.35 +
          (entry.directionalBias === "Bullish"
            ? 12
            : entry.directionalBias === "Bearish"
              ? -8
              : 0)
      ),
      20,
      92
    );

  return {
    ticker: entry.ticker,
    name: entry.name,
    sector: entry.sector || base?.sector || "Technology",
    earningsDate: formatDisplayDate(entry.earningsDate),
    earningsTime: normalizeStockEarningsTime(entry.earningsTime),
    currentPrice,
    priceChange6M: entry.priceChange6M,
    priceChange1M: base?.priceChange1M ?? round(entry.priceChange6M / 6, 1),
    epsEstimate: base?.epsEstimate ?? round(entry.callPremiumBuy / 2, 2),
    epsLastQuarter: base?.epsLastQuarter ?? round(entry.callPremiumBuy / 2.2, 2),
    revenueEstimate: base?.revenueEstimate ?? `${round(currentPrice / 10, 2)}B`,
    revenueGrowthYoY: base?.revenueGrowthYoY ?? clamp(Math.round(entry.beatRate / 2), 4, 40),
    beatRateLast4Q: base?.beatRateLast4Q ?? entry.beatRate,
    avgEpsBeat: base?.avgEpsBeat ?? round(entry.beatRate / 9, 1),
    rsi14: entry.rsi14,
    volumeCurrent,
    volumeAvg3M,
    volumeStatus,
    volumePriceFit,
    etfBenchmark: base?.etfBenchmark ?? "QQQ",
    sectorBeta: base?.sectorBeta ?? round(1 + entry.momentumScore / 250, 2),
    sectorTrend:
      base?.sectorTrend ??
      (entry.directionalBias === "Bearish"
        ? "BEARISH"
        : entry.momentumScore >= 65
          ? "BULLISH"
          : "NEUTRAL"),
    analystBuyConsensus,
    analystCount: base?.analystCount ?? clamp(Math.round(entry.beatRate / 4), 8, 42),
    priceTarget,
    priceTargetUpside,
    catalysts: base?.catalysts?.length
      ? [...base.catalysts.slice(0, 4), ...buildFallbackCatalysts(entry, report).slice(0, 2)]
      : buildFallbackCatalysts(entry, report).slice(0, 6),
    risks: base?.risks?.length
      ? [...base.risks.slice(0, 2), ...buildFallbackRisks(entry)]
      : buildFallbackRisks(entry),
    momentumScore: entry.momentumScore,
    earningsBeatProbability: entry.beatRate,
    signal,
    riskLevel,
    thesis: entry.thesis || base?.thesis || report?.content.summary || "Haftalik earning strategy notu.",
    keyMetric: base?.keyMetric ?? "IV Crush Potansiyeli",
    keyMetricValue: base?.keyMetricValue ?? `-%${entry.expectedIVCrush}`,
    historicalMoves: base?.historicalMoves ?? buildFallbackHistoricalMoves(entry),
    impliedMove: entry.impliedMove,
  };
}

function buildOptionFromEntry(
  entry: WeeklyReportEntry
): OptionStrategy {
  const base = staticOptions.find(option => option.ticker === entry.ticker);

  return {
    ticker: entry.ticker,
    name: entry.name,
    sector: entry.sector || base?.sector || "Technology",
    earningsDate: formatDisplayDate(entry.earningsDate),
    momentumScore: entry.momentumScore,
    priceChange6M: entry.priceChange6M,
    rsi14: entry.rsi14,
    currentIV: entry.currentIV,
    historicalIV: entry.historicalIV,
    impliedMove: entry.impliedMove,
    expectedIVCrush: entry.expectedIVCrush,
    ivCrushPotential: entry.ivCrushPotential,
    callPremiumBuy: entry.callPremiumBuy,
    callPremiumSell: entry.callPremiumSell,
    callGainFromIV: entry.callGainFromIV,
    putPremiumBuy: entry.putPremiumBuy,
    putPremiumSell: entry.putPremiumSell,
    putGainFromIV: entry.putGainFromIV,
    directionalBias: mapBiasToOptionDirection(entry.directionalBias),
    biasReason: entry.thesis || base?.biasReason || entry.recommendedStrategy,
    biasStrength:
      base?.biasStrength ??
      clamp(
        entry.momentumScore +
          (entry.directionalBias === "Bullish"
            ? 8
            : entry.directionalBias === "Bearish"
              ? 4
              : -5),
        35,
        95
      ),
    ivCrushScore: entry.ivCrushScore,
    strategyRating: entry.strategyRating,
    riskLevel: entry.riskLevel,
    earningsMissRisk: entry.earningsMissRisk,
    gapRisk: entry.gapRisk,
    recommendedStrategy: entry.recommendedStrategy,
    targetProfit: entry.targetProfit,
    maxLoss: entry.maxLoss,
    lastEarningsMove: entry.lastEarningsMove,
    historicalIVCrush: entry.historicalIVCrush,
    beatRate: entry.beatRate,
  };
}

function buildCalendarFromEntries(entries: WeeklyReportEntry[]) {
  return [...entries]
    .sort((left, right) => left.earningsDate.localeCompare(right.earningsDate))
    .map(entry => ({
      id: entry.id,
      sortDate: entry.earningsDate,
      label: formatCalendarLabel(entry.earningsDate),
      ticker: entry.ticker,
      name: entry.name,
      time: entry.earningsTime,
      signal: mapStrategyToSignal(entry),
    }));
}

function buildStaticCalendar(): StrategyCalendarItem[] {
  return staticCalendar.map((item, index) => ({
    id: `${item.ticker}-${index + 1}`,
    sortDate: `2026-${String(index + 5).padStart(2, "0")}-01`,
    label: item.date,
    ticker: item.ticker,
    name: item.name,
    time: item.time,
    signal: item.signal,
  }));
}

export function buildEarningStrategyDataset(
  report?: WeeklyReportRecord | null
): EarningStrategyDataset {
  if (!report?.content.entries.length) {
    return {
      source: "static",
      stocks: staticStocks,
      options: staticOptions,
      calendar: buildStaticCalendar(),
    };
  }

  const entries = report.content.entries;

  return {
    source: "published",
    stocks: entries.map(entry => buildStockFromEntry(entry, report)),
    options: entries.map(buildOptionFromEntry),
    calendar: buildCalendarFromEntries(entries),
  };
}
