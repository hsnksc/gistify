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
import {
  juneEarningsData,
  type JuneEarningsStock,
} from "@/lib/juneEarningsData";

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

const MONTH_LOOKUP: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function round(value: number, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function parseLooseDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00Z`);
  }

  const rangeMatch = value.match(/^(\d{1,2})(?:-\d{1,2})?\s+([A-Za-z]+)\s+(\d{4})$/);
  if (rangeMatch) {
    const day = Number(rangeMatch[1]);
    const month = MONTH_LOOKUP[rangeMatch[2].toLowerCase()];
    const year = Number(rangeMatch[3]);

    if (Number.isInteger(day) && Number.isInteger(month) && Number.isInteger(year)) {
      return new Date(Date.UTC(year, month, day));
    }
  }

  const timestamp = Date.parse(`${value} UTC`);
  if (Number.isFinite(timestamp)) {
    return new Date(timestamp);
  }

  return new Date("2100-12-31T00:00:00Z");
}

function resolveSortDate(value: string) {
  return parseLooseDate(value).toISOString().slice(0, 10);
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
  const base = report
    ? undefined
    : staticStocks.find(stock => stock.ticker === entry.ticker);
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
  return {
    ticker: entry.ticker,
    name: entry.name,
    sector: entry.sector || "Technology",
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
    biasReason: entry.thesis || entry.recommendedStrategy,
    biasStrength: clamp(
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
  return [...staticCalendar]
    .sort((left, right) => resolveSortDate(left.date).localeCompare(resolveSortDate(right.date)))
    .map((item, index) => ({
    id: `${item.ticker}-${index + 1}`,
    sortDate: resolveSortDate(item.date),
    label: item.date,
    ticker: item.ticker,
    name: item.name,
    time: item.time,
    signal: item.signal,
  }));
}

function buildJuneSignal(entry: JuneEarningsStock): SignalLevel {
  if (entry.strategyRating === "POOR") {
    return "SELL";
  }

  if (entry.sector.includes("Macro") && entry.ticker === "QQQ") {
    return "SELL";
  }

  if (entry.strategyRating === "EXCELLENT") {
    return entry.momentumScore >= 85 ? "STRONG_BUY" : "BUY";
  }

  if (entry.strategyRating === "GOOD") {
    return "BUY";
  }

  return "NEUTRAL";
}

function buildJuneDirectionalBias(
  entry: JuneEarningsStock
): OptionStrategy["directionalBias"] {
  if (entry.ticker === "QQQ") {
    return "PUT";
  }

  if (
    entry.recommendedStrategy.includes("Long Call") ||
    entry.recommendedStrategy.includes("Bull Call") ||
    entry.recommendedStrategy.includes("Momentum Long")
  ) {
    return "CALL";
  }

  if (entry.recommendedStrategy.includes("Put")) {
    return "PUT";
  }

  return "NEUTRAL";
}

function buildJuneCatalysts(entry: JuneEarningsStock) {
  const base = [
    `${entry.earningsDate} odakli setup penceresi.`,
    `Momentum skoru ${entry.momentumScore} ve IV seviyesi ${entry.currentIV}.`,
    `Beklenen IV crush: %${entry.expectedIVCrush}.`,
    `Onerilen yapi: ${entry.recommendedStrategy}`,
  ];

  if (entry.ticker === "ORCL") {
    base.unshift("Cloud ve AI guidance yorumu fiyatlamanin ana belirleyicisi.");
  }
  if (entry.ticker === "LEN" || entry.ticker === "DHI" || entry.ticker === "TOL") {
    base.unshift("Mortgage rate hassasiyeti nedeniyle FOMC tonu kritik.");
  }
  if (entry.ticker === "SPY" || entry.ticker === "QQQ") {
    base.unshift("FOMC ve dot plot oynakligi event odakli prim yaratir.");
  }

  return base;
}

function buildJuneRisks(entry: JuneEarningsStock) {
  return [
    `Gap riski: %${entry.gapRisk}`,
    `Miss veya event riski: %${entry.earningsMissRisk}`,
    entry.riskLevel === "HIGH" || entry.riskLevel === "VERY_HIGH"
      ? "Pozisyon boyutu kucuk tutulmali, implied move ile hizalanmali."
      : "Kar al ve zarar kes seviyeleri earnings oncesinde netlestirilmeli.",
  ];
}

function buildJuneThesis(entry: JuneEarningsStock) {
  const direction = buildJuneDirectionalBias(entry);

  if (entry.ticker === "SPY" || entry.ticker === "QQQ") {
    return `${entry.earningsDate} penceresinde makro event oynakligi fiyatlamayi yonlendirir. ${entry.recommendedStrategy} yapisi, iv expansion ve event sonrasi normalizasyonu birlikte okumak icin kuruldu.`;
  }

  return `${entry.name} icin ${entry.earningsDate} setup'i, ${direction} agirlikli bir planla okunuyor. Momentum ${entry.momentumScore}, beklenen iv crush %${entry.expectedIVCrush} ve hedef kar %${entry.targetProfit} seviyesinde.`;
}

function buildStockFromJuneEntry(entry: JuneEarningsStock): StockData {
  const signal = buildJuneSignal(entry);
  const volumeStatus: VolumeStatus =
    entry.momentumScore >= 85 ? "VERY_HIGH" : entry.momentumScore >= 70 ? "HIGH" : "NORMAL";
  const currentPrice = round(
    Math.max(25, (entry.callPremiumSell + entry.putPremiumSell) * 11),
    2
  );
  const priceTargetUpside = clamp(round(entry.targetProfit * 0.18, 1), -12, 28);

  return {
    ticker: entry.ticker,
    name: entry.name,
    sector: entry.sector,
    earningsDate: formatDisplayDate(entry.sortDate),
    earningsTime: entry.ticker === "ORCL" || entry.ticker === "ADBE" || entry.ticker === "LEN" ? "AMC" : "BMO",
    currentPrice,
    priceChange6M: entry.priceChange6M,
    priceChange1M: round(entry.priceChange6M / 6, 1),
    epsEstimate: round(entry.callPremiumBuy / 2, 2),
    epsLastQuarter: round(entry.callPremiumBuy / 2.3, 2),
    revenueEstimate: `${round(currentPrice / 12, 2)}B`,
    revenueGrowthYoY: clamp(Math.round(entry.beatRate / 2), 4, 38),
    beatRateLast4Q: entry.beatRate,
    avgEpsBeat: round(entry.beatRate / 8, 1),
    rsi14: entry.rsi14,
    volumeCurrent: round(Math.max(1.5, entry.currentIV / 5.5), 1),
    volumeAvg3M: round(Math.max(1, entry.historicalIV / 6.5), 1),
    volumeStatus,
    volumePriceFit: signal === "SELL" ? "RISKY" : "ALIGNED",
    etfBenchmark:
      entry.sector.includes("Semiconductors")
        ? "SOXX"
        : entry.sector.includes("Homebuilders")
          ? "XHB"
          : entry.ticker === "SPY"
            ? "SPY"
            : "QQQ",
    sectorBeta: round(1 + entry.momentumScore / 250, 2),
    sectorTrend:
      signal === "SELL" ? "BEARISH" : entry.momentumScore >= 65 ? "BULLISH" : "NEUTRAL",
    analystBuyConsensus: clamp(40 + Math.round(entry.beatRate * 0.45), 28, 90),
    analystCount: clamp(Math.round(entry.beatRate / 4), 8, 40),
    priceTarget: round(currentPrice * (1 + priceTargetUpside / 100), 2),
    priceTargetUpside,
    catalysts: buildJuneCatalysts(entry),
    risks: buildJuneRisks(entry),
    momentumScore: entry.momentumScore,
    earningsBeatProbability: entry.beatRate,
    signal,
    riskLevel: entry.riskLevel,
    thesis: buildJuneThesis(entry),
    keyMetric: entry.sector.includes("Macro") ? "Event Catalyst" : "IV Crush Potansiyeli",
    keyMetricValue:
      entry.sector.includes("Macro")
        ? entry.earningsDate
        : `-%${entry.expectedIVCrush}`,
    historicalMoves: [
      round(entry.lastEarningsMove, 1),
      round(entry.lastEarningsMove * 0.6, 1),
      round(entry.targetProfit / 14, 1),
      round(-entry.gapRisk / 9, 1),
    ],
    impliedMove: entry.impliedMove,
  };
}

function buildOptionFromJuneEntry(entry: JuneEarningsStock): OptionStrategy {
  const directionalBias = buildJuneDirectionalBias(entry);

  return {
    ticker: entry.ticker,
    name: entry.name,
    sector: entry.sector,
    earningsDate: formatDisplayDate(entry.sortDate),
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
    directionalBias,
    biasReason: buildJuneThesis(entry),
    biasStrength: clamp(
      entry.momentumScore +
        (directionalBias === "CALL" ? 8 : directionalBias === "PUT" ? 4 : -6),
      35,
      96
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

function buildCalendarFromJuneEntries(entries: JuneEarningsStock[]) {
  return [...entries]
    .sort((left, right) => left.sortDate.localeCompare(right.sortDate))
    .map(entry => ({
      id: `june-${entry.ticker.toLowerCase()}`,
      sortDate: entry.sortDate,
      label: formatCalendarLabel(entry.sortDate),
      ticker: entry.ticker,
      name: entry.name,
      time:
        entry.ticker === "SPY" || entry.ticker === "QQQ"
          ? "EVENT"
          : entry.earningsDate.includes("Momentum")
            ? "WATCH"
            : "AMC",
      signal: buildJuneSignal(entry),
    }));
}

function sortStocksByCalendar(
  stocks: StockData[],
  calendar: StrategyCalendarItem[]
) {
  const order = new Map(calendar.map((item, index) => [item.ticker, index]));
  return [...stocks].sort(
    (left, right) => (order.get(left.ticker) ?? 999) - (order.get(right.ticker) ?? 999)
  );
}

function sortOptionsByCalendar(
  options: OptionStrategy[],
  calendar: StrategyCalendarItem[]
) {
  const order = new Map(calendar.map((item, index) => [item.ticker, index]));
  return [...options].sort(
    (left, right) => (order.get(left.ticker) ?? 999) - (order.get(right.ticker) ?? 999)
  );
}

function dedupeByTicker<T extends { ticker: string }>(items: T[]) {
  const seen = new Set<string>();
  const deduped: T[] = [];

  for (const item of items) {
    if (seen.has(item.ticker)) {
      continue;
    }
    seen.add(item.ticker);
    deduped.push(item);
  }

  return deduped;
}

export function buildEarningStrategyDataset(
  report?: WeeklyReportRecord | null
): EarningStrategyDataset {
  if (!report?.content.entries.length) {
    return {
      source: "published",
      stocks: [],
      options: [],
      calendar: [],
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

export function buildEarningStrategyUniverse(
  reports?: WeeklyReportRecord[] | null
): EarningStrategyDataset {
  const publishedPairs =
    reports?.flatMap(report =>
      report.content.entries.map(entry => ({ entry, report }))
    ) || [];

  if (!publishedPairs.length) {
    return {
      source: "published",
      stocks: [],
      options: [],
      calendar: [],
    };
  }

  const sortedPairs = [...publishedPairs].sort((left, right) =>
    left.entry.earningsDate.localeCompare(right.entry.earningsDate)
  );
  const calendar = buildCalendarFromEntries(sortedPairs.map(item => item.entry));
  const stocks = sortStocksByCalendar(
    dedupeByTicker(
      sortedPairs.map(({ entry, report }) => buildStockFromEntry(entry, report))
    ),
    calendar
  );
  const options = sortOptionsByCalendar(
    dedupeByTicker(sortedPairs.map(({ entry }) => buildOptionFromEntry(entry))),
    calendar
  );

  return {
    source: "published",
    stocks,
    options,
    calendar,
  };
}
