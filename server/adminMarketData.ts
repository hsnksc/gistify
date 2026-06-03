import type {
  WeeklyDirectionalBias,
  WeeklyEarningsTime,
  WeeklyIvCrushPotential,
  WeeklyReportEntry,
  WeeklyReportRecord,
  WeeklyRiskLevel,
  WeeklyStrategyRating,
} from "../shared/weeklyReports";
import type { SuggestedWeeklyReport } from "./weeklyReportSeeds";

const FMP_BASE_URL = "https://financialmodelingprep.com/stable";

interface FmpEarningsCalendarRow {
  symbol?: unknown;
  name?: unknown;
  date?: unknown;
  epsEstimated?: unknown;
  revenueEstimated?: unknown;
  time?: unknown;
}

interface FmpProfileRow {
  symbol?: unknown;
  companyName?: unknown;
  sector?: unknown;
  mktCap?: unknown;
}

interface FmpQuoteRow {
  symbol?: unknown;
  name?: unknown;
  price?: unknown;
  previousClose?: unknown;
  marketCap?: unknown;
}

interface FmpHistoricalRow {
  date?: unknown;
  close?: unknown;
  volume?: unknown;
}

interface NormalizedEarningsEvent {
  ticker: string;
  name: string;
  earningsDate: string;
  earningsTime: WeeklyEarningsTime;
  epsEstimated?: number;
  revenueEstimated?: string;
}

interface EnrichedEarningsEvent extends NormalizedEarningsEvent {
  companyName: string;
  sector: string;
  marketCap: number;
  currentPrice: number;
  prevClose: number;
  priceChange6M: number;
  rsi14: number;
  avgDailyVolume: number;
  realizedVolatility: number;
  momentumScore: number;
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const raw = normalizeString(value);
  if (!raw) {
    return 0;
  }

  const parsed = Number(raw.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function startOfWeekUtc(date: Date) {
  const next = new Date(date);
  next.setUTCHours(0, 0, 0, 0);
  const day = next.getUTCDay() || 7;
  next.setUTCDate(next.getUTCDate() - day + 1);
  return next;
}

function getFmpApiKey() {
  return normalizeString(process.env.FMP_API_KEY);
}

export function isFmpConfigured() {
  return Boolean(getFmpApiKey());
}

export function getAdminMarketDataStatus() {
  return {
    earningsImport: {
      provider: "financial-modeling-prep",
      configured: isFmpConfigured(),
      mode: isFmpConfigured() ? "live" : "disabled",
    },
    optionsData: {
      provider: "heuristic",
      configured: true,
      mode: "heuristic",
      note:
        "Gercek IV / option chain provider bagli degil. IV-related alanlar fiyat gecmisi uzerinden heuristik uretilir.",
    },
    momentumData: {
      provider: "browser-scanner",
      configured: true,
      mode: "live",
      fallbackKeys: {
        massive: Boolean(normalizeString(process.env.VITE_SCANNER_MASSIVE_API_KEY)),
        twelvedata: Boolean(
          normalizeString(process.env.VITE_SCANNER_TWELVEDATA_API_KEY)
        ),
        alphavantage: Boolean(
          normalizeString(process.env.VITE_SCANNER_ALPHAVANTAGE_API_KEY)
        ),
      },
    },
  } as const;
}

async function fetchFmpJson<T>(
  endpoint: string,
  params: Record<string, string>
): Promise<T> {
  const apiKey = getFmpApiKey();
  if (!apiKey) {
    throw new Error("FMP API key tanimli degil.");
  }

  const url = new URL(`${FMP_BASE_URL}/${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url.toString(), {
    headers: {
      apikey: apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`FMP istegi basarisiz oldu: ${response.status}`);
  }

  return (await response.json()) as T;
}

function normalizeEarningsTime(value: unknown): WeeklyEarningsTime {
  const raw = normalizeString(value).toUpperCase();
  if (raw.includes("AMC") || raw.includes("AFTER")) {
    return "AMC";
  }
  if (raw.includes("BMO") || raw.includes("BEFORE")) {
    return "BMO";
  }
  if (raw === "AH") {
    return "AH";
  }
  if (raw === "BH") {
    return "BH";
  }
  return "AMC";
}

function normalizeEarningsCalendarRows(payload: unknown) {
  if (!Array.isArray(payload)) {
    return [];
  }

  const rows: NormalizedEarningsEvent[] = [];
  for (const row of payload as FmpEarningsCalendarRow[]) {
    const ticker = normalizeString(row.symbol).toUpperCase();
    const date = normalizeString(row.date).slice(0, 10);
    if (!ticker || !date) {
      continue;
    }

    const revenueEstimated = normalizeNumber(row.revenueEstimated);

    rows.push({
      ticker,
      name: normalizeString(row.name) || ticker,
      earningsDate: date,
      earningsTime: normalizeEarningsTime(row.time),
      epsEstimated: normalizeNumber(row.epsEstimated) || undefined,
      revenueEstimated:
        revenueEstimated > 0 ? formatRevenueEstimate(revenueEstimated) : undefined,
    });
  }

  return rows;
}

function normalizeHistoricalRows(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload as FmpHistoricalRow[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { historical?: unknown[] }).historical)
  ) {
    return (payload as { historical: FmpHistoricalRow[] }).historical;
  }

  return [];
}

function normalizeSingleObject<T extends object>(payload: unknown) {
  if (Array.isArray(payload)) {
    return (payload[0] as T | undefined) || null;
  }

  if (payload && typeof payload === "object") {
    return payload as T;
  }

  return null;
}

function calculateRsi(closes: number[], period = 14) {
  if (closes.length < period + 1) {
    return 50;
  }

  let gains = 0;
  let losses = 0;
  for (let index = closes.length - period; index < closes.length; index += 1) {
    const delta = closes[index] - closes[index - 1];
    if (delta >= 0) {
      gains += delta;
    } else {
      losses += Math.abs(delta);
    }
  }

  if (losses === 0) {
    return 100;
  }

  const rs = gains / losses;
  return round(100 - 100 / (1 + rs), 1);
}

function calculateRealizedVolatility(closes: number[]) {
  if (closes.length < 2) {
    return 0.02;
  }

  const returns: number[] = [];
  for (let index = 1; index < closes.length; index += 1) {
    const previous = closes[index - 1];
    const current = closes[index];
    if (previous <= 0 || current <= 0) {
      continue;
    }
    returns.push(Math.log(current / previous));
  }

  if (!returns.length) {
    return 0.02;
  }

  const mean =
    returns.reduce((total, current) => total + current, 0) / returns.length;
  const variance =
    returns.reduce(
      (total, current) => total + (current - mean) * (current - mean),
      0
    ) / returns.length;

  return Math.sqrt(variance);
}

function calculateMomentumScore({
  priceChange6M,
  rsi14,
  realizedVolatility,
  marketCap,
  currentPrice,
  highRef,
}: {
  priceChange6M: number;
  rsi14: number;
  realizedVolatility: number;
  marketCap: number;
  currentPrice: number;
  highRef: number;
}) {
  const distanceFromHigh =
    highRef > 0 ? clamp((currentPrice / highRef) * 100, 0, 100) : 70;
  const marketCapBonus =
    marketCap > 0 ? clamp(Math.log10(marketCap) * 3 - 18, 0, 10) : 0;
  const volatilityPenalty = clamp(realizedVolatility * 120, 0, 18);

  return Math.round(
    clamp(
      52 +
        priceChange6M * 0.22 +
        (rsi14 - 50) * 0.9 +
        (distanceFromHigh - 60) * 0.28 +
        marketCapBonus -
        volatilityPenalty,
      25,
      99
    )
  );
}

function inferDirectionalBias(
  momentumScore: number,
  priceChange6M: number,
  rsi14: number
): WeeklyDirectionalBias {
  if (momentumScore >= 72 && priceChange6M >= 0 && rsi14 >= 52) {
    return "Bullish";
  }
  if (momentumScore <= 48 || priceChange6M < -12) {
    return "Bearish";
  }
  return "Neutral";
}

function inferRiskLevel(
  momentumScore: number,
  rsi14: number,
  realizedVolatility: number
): WeeklyRiskLevel {
  const heatScore =
    (rsi14 >= 75 ? 2 : 0) + (realizedVolatility >= 0.035 ? 2 : 0) + (momentumScore <= 45 ? 1 : 0);

  if (heatScore >= 4) {
    return "VERY_HIGH";
  }
  if (heatScore >= 3) {
    return "HIGH";
  }
  if (heatScore >= 1) {
    return "MEDIUM";
  }
  return "LOW";
}

function inferStrategyRating(
  momentumScore: number,
  expectedIVCrush: number,
  rsi14: number
): WeeklyStrategyRating {
  if (momentumScore >= 84 && expectedIVCrush >= 26 && rsi14 <= 78) {
    return "EXCELLENT";
  }
  if (momentumScore >= 68 && expectedIVCrush >= 20) {
    return "GOOD";
  }
  if (momentumScore >= 50) {
    return "FAIR";
  }
  return "POOR";
}

function inferIvCrushPotential(expectedIVCrush: number): WeeklyIvCrushPotential {
  if (expectedIVCrush >= 30) {
    return "HIGH";
  }
  if (expectedIVCrush >= 20) {
    return "MEDIUM";
  }
  return "LOW";
}

function buildRecommendedStrategy(
  directionalBias: WeeklyDirectionalBias,
  strategyRating: WeeklyStrategyRating,
  riskLevel: WeeklyRiskLevel
) {
  if (directionalBias === "Bullish") {
    return strategyRating === "EXCELLENT" && riskLevel !== "VERY_HIGH"
      ? "Bull Call Spread"
      : "Long Call";
  }
  if (directionalBias === "Bearish") {
    return strategyRating === "EXCELLENT" ? "Bear Put Spread" : "Long Put";
  }
  return riskLevel === "HIGH" || riskLevel === "VERY_HIGH"
    ? "Iron Condor"
    : "Strangle";
}

function formatRevenueEstimate(value: number) {
  if (value >= 1_000_000_000) {
    return `${round(value / 1_000_000_000, 2)}B`;
  }
  if (value >= 1_000_000) {
    return `${round(value / 1_000_000, 2)}M`;
  }
  return `${Math.round(value)}`;
}

function buildEntryThesis(event: EnrichedEarningsEvent) {
  const direction =
    event.momentumScore >= 75
      ? "fiyat yapisi ve momentum destegi guclu"
      : event.momentumScore <= 50
        ? "momentum zayif ve daha savunmaci bir durus gerekiyor"
        : "skor dagilimi dengeli";

  return `${event.ticker} icin ${event.sector.toLowerCase()} temasi ve earnings tarihine yaklasan fiyat yapisi izleniyor. ${direction}. Gercek earnings takvimi FMP uzerinden cekildi, IV related alanlar ise opsiyon provider olmadigi icin fiyat gecmisi temelli heuristik hesaplandi.`;
}

function buildWeeklyEntry(event: EnrichedEarningsEvent, index: number) {
  const currentIV = Math.round(
    clamp(
      28 +
        event.realizedVolatility * 900 +
        Math.max(0, event.priceChange6M) * 0.08 +
        Math.abs(event.currentPrice - event.prevClose) * 0.12,
      24,
      118
    )
  );
  const historicalIV = Math.round(clamp(currentIV * 0.74, 18, 96));
  const expectedIVCrush = Math.round(clamp(currentIV - historicalIV, 14, 48));
  const impliedMove = round(
    clamp(event.realizedVolatility * 220, 3.5, 17.5),
    1
  );
  const directionalBias = inferDirectionalBias(
    event.momentumScore,
    event.priceChange6M,
    event.rsi14
  );
  const riskLevel = inferRiskLevel(
    event.momentumScore,
    event.rsi14,
    event.realizedVolatility
  );
  const strategyRating = inferStrategyRating(
    event.momentumScore,
    expectedIVCrush,
    event.rsi14
  );
  const recommendedStrategy = buildRecommendedStrategy(
    directionalBias,
    strategyRating,
    riskLevel
  );
  const optionBase = clamp(event.currentPrice * impliedMove * 0.0018, 1.2, 8.5);
  const callPremiumBuy = round(optionBase, 2);
  const callPremiumSell = round(optionBase * (1 + expectedIVCrush / 100), 2);
  const putPremiumBuy = round(optionBase * 0.94, 2);
  const putPremiumSell = round(putPremiumBuy * (1 + expectedIVCrush / 100), 2);
  const targetProfit = Math.round(clamp(expectedIVCrush * 3.1, 55, 155));
  const maxLoss = Math.round(
    clamp(18 + event.realizedVolatility * 1200, 18, 42)
  );
  const beatRate = Math.round(
    clamp(54 + event.priceChange6M * 0.12 + (event.rsi14 - 50) * 0.5, 38, 86)
  );

  return {
    id: `${event.ticker.toLowerCase()}-${event.earningsDate}-${index + 1}`,
    ticker: event.ticker,
    name: event.companyName,
    sector: event.sector,
    earningsDate: event.earningsDate,
    earningsTime: event.earningsTime,
    momentumScore: event.momentumScore,
    priceChange6M: round(event.priceChange6M, 1),
    rsi14: round(event.rsi14, 1),
    currentIV,
    historicalIV,
    impliedMove,
    expectedIVCrush,
    ivCrushPotential: inferIvCrushPotential(expectedIVCrush),
    callPremiumBuy,
    callPremiumSell,
    callGainFromIV: Math.round(
      clamp(((callPremiumSell - callPremiumBuy) / callPremiumBuy) * 100, 35, 180)
    ),
    putPremiumBuy,
    putPremiumSell,
    putGainFromIV: Math.round(
      clamp(((putPremiumSell - putPremiumBuy) / putPremiumBuy) * 100, 35, 180)
    ),
    ivCrushScore: Math.round(
      clamp(event.momentumScore * 0.55 + expectedIVCrush * 1.15, 40, 97)
    ),
    strategyRating,
    riskLevel,
    earningsMissRisk: Math.round(clamp(100 - beatRate + 12, 18, 66)),
    gapRisk: Math.round(clamp(impliedMove * 2.7, 12, 58)),
    recommendedStrategy,
    targetProfit,
    maxLoss,
    lastEarningsMove: round(clamp(impliedMove * 0.92, 2.4, 16), 1),
    historicalIVCrush: Math.round(clamp(expectedIVCrush - 5, 10, 42)),
    beatRate,
    thesis: buildEntryThesis(event),
    directionalBias,
  } satisfies WeeklyReportEntry;
}

async function fetchUpcomingEarningsEvents(from: string, to: string) {
  const payload = await fetchFmpJson<unknown>("earnings-calendar", {
    from,
    to,
  });

  return normalizeEarningsCalendarRows(payload);
}

async function enrichEarningsEvent(
  event: NormalizedEarningsEvent
): Promise<EnrichedEarningsEvent | null> {
  const [profilePayload, quotePayload, historicalPayload] = await Promise.all([
    fetchFmpJson<unknown>("profile", { symbol: event.ticker }).catch(() => null),
    fetchFmpJson<unknown>("quote", { symbol: event.ticker }).catch(() => null),
    fetchFmpJson<unknown>("historical-price-eod/full", {
      symbol: event.ticker,
      from: toIsoDate(addDays(new Date(`${event.earningsDate}T00:00:00Z`), -220)),
      to: event.earningsDate,
    }).catch(() => null),
  ]);

  const profile = normalizeSingleObject<FmpProfileRow>(profilePayload);
  const quote = normalizeSingleObject<FmpQuoteRow>(quotePayload);
  const historicalRows = normalizeHistoricalRows(historicalPayload)
    .map(row => ({
      date: normalizeString(row.date),
      close: normalizeNumber(row.close),
      volume: normalizeNumber(row.volume),
    }))
    .filter(row => row.date && row.close > 0)
    .sort((left, right) => left.date.localeCompare(right.date));

  if (historicalRows.length < 20) {
    return null;
  }

  const closes = historicalRows.map(row => row.close);
  const volumes = historicalRows
    .slice(-20)
    .map(row => row.volume)
    .filter(volume => volume > 0);
  const avgDailyVolume = volumes.length
    ? volumes.reduce((total, current) => total + current, 0) / volumes.length
    : 0;
  const firstClose = closes[0];
  const lastClose = closes[closes.length - 1];
  const highRef = Math.max(...closes.slice(-60));
  const priceChange6M =
    firstClose > 0 ? ((lastClose - firstClose) / firstClose) * 100 : 0;
  const rsi14 = calculateRsi(closes, 14);
  const realizedVolatility = calculateRealizedVolatility(closes.slice(-30));
  const marketCap =
    normalizeNumber(profile?.mktCap) || normalizeNumber(quote?.marketCap);
  const currentPrice = normalizeNumber(quote?.price) || lastClose;
  const prevClose =
    normalizeNumber(quote?.previousClose) || closes[closes.length - 2] || lastClose;
  const momentumScore = calculateMomentumScore({
    priceChange6M,
    rsi14,
    realizedVolatility,
    marketCap,
    currentPrice,
    highRef,
  });

  return {
    ...event,
    companyName:
      normalizeString(profile?.companyName) ||
      normalizeString(quote?.name) ||
      event.name,
    sector: normalizeString(profile?.sector) || "Technology",
    marketCap,
    currentPrice,
    prevClose,
    priceChange6M,
    rsi14,
    avgDailyVolume,
    realizedVolatility,
    momentumScore,
  };
}

function buildTitle(weekStart: string, weekEnd: string) {
  const start = new Date(`${weekStart}T00:00:00Z`);
  const end = new Date(`${weekEnd}T00:00:00Z`);
  const startDay = start.getUTCDate().toString().padStart(2, "0");
  const endDay = end.getUTCDate().toString().padStart(2, "0");
  const startMonth = start.toLocaleString("tr-TR", { month: "long", timeZone: "UTC" });
  const endMonth = end.toLocaleString("tr-TR", { month: "long", timeZone: "UTC" });

  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth} Earnings Plan`;
  }

  return `${startDay} ${startMonth} - ${endDay} ${endMonth} Earnings Plan`;
}

function buildWeeklyReportFromEvents(
  weekStart: string,
  events: EnrichedEarningsEvent[],
  existingReport: WeeklyReportRecord | undefined,
  authorEmail: string
) {
  const weekStartDate = new Date(`${weekStart}T00:00:00Z`);
  const weekEnd = toIsoDate(addDays(weekStartDate, 6));
  const createdAt = existingReport?.createdAt || new Date().toISOString();
  const updatedAt = new Date().toISOString();
  const entries = events
    .sort((left, right) => right.momentumScore - left.momentumScore)
    .slice(0, 10)
    .map(buildWeeklyEntry);
  const topTickers = entries
    .slice(0, 3)
    .map(entry => entry.ticker)
    .join(", ");
  const dominantSectors = Array.from(new Set(entries.map(entry => entry.sector))).slice(
    0,
    3
  );

  return {
    id: existingReport?.id || `live-${weekStart}`,
    slug: existingReport?.slug || `${weekStart}-fmp-live`,
    title: existingReport?.title || buildTitle(weekStart, weekEnd),
    weekStart,
    weekEnd,
    analysisDate: updatedAt,
    status: existingReport?.status || "draft",
    authorEmail,
    createdAt,
    updatedAt,
    publishedAt: existingReport?.publishedAt,
    content: {
      headline:
        existingReport?.content.headline ||
        `${topTickers || "Secili hisseler"} bu haftanin oncelikli earnings setup listesi.`,
      summary:
        existingReport?.content.summary ||
        `Bu taslak FMP earnings calendar, profile, quote ve historical price verileriyle olusturuldu. ${entries.length} hisse tarandi; IV-related alanlar opsiyon provider olmadigi icin heuristik hesaplandi.`,
      marketContext:
        existingReport?.content.marketContext ||
        `Bu hafta ${dominantSectors.join(", ")} temalari one cikiyor. Earnings tarihleri gercek takvim verisinden cekildi; fiyat yapisi ve RSI skorlari son 6 ay fiyat gecmisiyle hesaplandi.`,
      executionNotes:
        existingReport?.content.executionNotes ||
        "Admin oncesi taslak otomatik geldi. Publish etmeden once headline, makro baglam ve strategy alanlarini kisa bir gozden gecir.",
      keyCatalysts:
        existingReport?.content.keyCatalysts || [
          "Gercek earnings takvimi FMP stable earnings-calendar endpoint'inden cekildi.",
          "Momentum, RSI ve fiyat degisimi son fiyat gecmisi uzerinden hesaplandi.",
          "Opsiyon/IV provider bagli degilse IV crush alanlari heuristik gelir.",
        ],
      entries,
    },
  } satisfies WeeklyReportRecord;
}

export async function buildLiveWeeklyReportSuggestions(
  existingReports: WeeklyReportRecord[],
  authorEmail: string,
  referenceDate = new Date(),
  count = 2
): Promise<SuggestedWeeklyReport[]> {
  if (!isFmpConfigured()) {
    return [];
  }

  const firstWeekStart = startOfWeekUtc(referenceDate);
  const from = toIsoDate(firstWeekStart);
  const to = toIsoDate(addDays(firstWeekStart, count * 7 + 1));
  const calendarEvents = await fetchUpcomingEarningsEvents(from, to);
  const byWeek = new Map<string, NormalizedEarningsEvent[]>();

  for (const event of calendarEvents) {
    const weekStart = toIsoDate(startOfWeekUtc(new Date(`${event.earningsDate}T00:00:00Z`)));
    const current = byWeek.get(weekStart) || [];
    current.push(event);
    byWeek.set(weekStart, current);
  }

  const existingByWeek = new Map(
    existingReports.map(report => [report.weekStart, report])
  );
  const suggestions: SuggestedWeeklyReport[] = [];

  for (let index = 0; index < count; index += 1) {
    const weekStart = toIsoDate(addDays(firstWeekStart, index * 7));
    const weekEvents = byWeek.get(weekStart) || [];
    if (!weekEvents.length) {
      continue;
    }

    const enriched = (
      await Promise.all(weekEvents.slice(0, 12).map(enrichEarningsEvent))
    ).filter((item): item is EnrichedEarningsEvent => Boolean(item));

    if (!enriched.length) {
      continue;
    }

    const existingReport = existingByWeek.get(weekStart);
    const report = buildWeeklyReportFromEvents(
      weekStart,
      enriched,
      existingReport,
      authorEmail
    );

    suggestions.push({
      report,
      source: "fmp_live",
      alreadyExists: Boolean(existingReport),
    });
  }

  return suggestions.sort((left, right) =>
    right.report.weekStart.localeCompare(left.report.weekStart)
  );
}
