import type {
  WeeklyDirectionalBias,
  WeeklyEarningsTime,
  WeeklyReportEntry,
  WeeklyReportRecord,
  WeeklyStrategyRating,
} from "../shared/weeklyReports";

const ADMIN_EMAIL = "hsnksc@gmail.com";

interface SeedEntry {
  ticker: string;
  name: string;
  sector: string;
  earningsDate: string;
  momentumScore: number;
  priceChange6M: number;
  rsi14: number;
  currentIV: number;
  historicalIV: number;
  impliedMove: number;
  expectedIVCrush: number;
  ivCrushPotential: "HIGH" | "MEDIUM" | "LOW";
  callPremiumBuy: number;
  callPremiumSell: number;
  callGainFromIV: number;
  putPremiumBuy: number;
  putPremiumSell: number;
  putGainFromIV: number;
  ivCrushScore: number;
  strategyRating: WeeklyStrategyRating;
  riskLevel: WeeklyReportEntry["riskLevel"];
  earningsMissRisk: number;
  gapRisk: number;
  recommendedStrategy: string;
  targetProfit: number;
  maxLoss: number;
  lastEarningsMove: number;
  historicalIVCrush: number;
  beatRate: number;
}

const juneSeedData: SeedEntry[] = [
  {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Semiconductors",
    earningsDate: "3 June 2026",
    momentumScore: 98,
    priceChange6M: 185,
    rsi14: 78,
    currentIV: 105,
    historicalIV: 72,
    impliedMove: 14.8,
    expectedIVCrush: 48,
    ivCrushPotential: "HIGH",
    callPremiumBuy: 3.2,
    callPremiumSell: 7.8,
    callGainFromIV: 144,
    putPremiumBuy: 2.9,
    putPremiumSell: 7.2,
    putGainFromIV: 148,
    ivCrushScore: 96,
    strategyRating: "EXCELLENT",
    riskLevel: "HIGH",
    earningsMissRisk: 25,
    gapRisk: 35,
    recommendedStrategy: "Long Call (Extreme momentum, massive IV crush)",
    targetProfit: 140,
    maxLoss: 32,
    lastEarningsMove: 18.5,
    historicalIVCrush: 45,
    beatRate: 88,
  },
  {
    ticker: "AMD",
    name: "Advanced Micro Devices",
    sector: "Semiconductors",
    earningsDate: "4 June 2026",
    momentumScore: 92,
    priceChange6M: 156,
    rsi14: 75,
    currentIV: 98,
    historicalIV: 68,
    impliedMove: 13.2,
    expectedIVCrush: 44,
    ivCrushPotential: "HIGH",
    callPremiumBuy: 2.8,
    callPremiumSell: 7.1,
    callGainFromIV: 154,
    putPremiumBuy: 2.6,
    putPremiumSell: 6.8,
    putGainFromIV: 162,
    ivCrushScore: 94,
    strategyRating: "EXCELLENT",
    riskLevel: "HIGH",
    earningsMissRisk: 28,
    gapRisk: 38,
    recommendedStrategy: "Bull Call Spread (High IV, strong momentum)",
    targetProfit: 150,
    maxLoss: 28,
    lastEarningsMove: 16.2,
    historicalIVCrush: 42,
    beatRate: 85,
  },
  {
    ticker: "INTC",
    name: "Intel Corporation",
    sector: "Semiconductors",
    earningsDate: "5 June 2026",
    momentumScore: 58,
    priceChange6M: -22,
    rsi14: 44,
    currentIV: 82,
    historicalIV: 65,
    impliedMove: 11.5,
    expectedIVCrush: 38,
    ivCrushPotential: "MEDIUM",
    callPremiumBuy: 2.1,
    callPremiumSell: 5.2,
    callGainFromIV: 148,
    putPremiumBuy: 2,
    putPremiumSell: 5,
    putGainFromIV: 150,
    ivCrushScore: 72,
    strategyRating: "GOOD",
    riskLevel: "HIGH",
    earningsMissRisk: 55,
    gapRisk: 50,
    recommendedStrategy: "Iron Condor (Weak momentum, IV crush play)",
    targetProfit: 95,
    maxLoss: 35,
    lastEarningsMove: -8.5,
    historicalIVCrush: 35,
    beatRate: 35,
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    sector: "Automotive",
    earningsDate: "6 June 2026",
    momentumScore: 85,
    priceChange6M: 128,
    rsi14: 72,
    currentIV: 110,
    historicalIV: 75,
    impliedMove: 15.2,
    expectedIVCrush: 50,
    ivCrushPotential: "HIGH",
    callPremiumBuy: 3.5,
    callPremiumSell: 8.5,
    callGainFromIV: 143,
    putPremiumBuy: 3.2,
    putPremiumSell: 8,
    putGainFromIV: 150,
    ivCrushScore: 95,
    strategyRating: "EXCELLENT",
    riskLevel: "VERY_HIGH",
    earningsMissRisk: 40,
    gapRisk: 45,
    recommendedStrategy: "Long Call (Extreme volatility, high risk/reward)",
    targetProfit: 140,
    maxLoss: 38,
    lastEarningsMove: 12.8,
    historicalIVCrush: 48,
    beatRate: 72,
  },
  {
    ticker: "META",
    name: "Meta Platforms",
    sector: "Technology",
    earningsDate: "7 June 2026",
    momentumScore: 88,
    priceChange6M: 95,
    rsi14: 70,
    currentIV: 92,
    historicalIV: 62,
    impliedMove: 12.8,
    expectedIVCrush: 42,
    ivCrushPotential: "HIGH",
    callPremiumBuy: 2.7,
    callPremiumSell: 6.5,
    callGainFromIV: 141,
    putPremiumBuy: 2.5,
    putPremiumSell: 6.2,
    putGainFromIV: 148,
    ivCrushScore: 92,
    strategyRating: "EXCELLENT",
    riskLevel: "MEDIUM",
    earningsMissRisk: 22,
    gapRisk: 28,
    recommendedStrategy: "Long Call + Bull Call Spread",
    targetProfit: 135,
    maxLoss: 26,
    lastEarningsMove: 10.5,
    historicalIVCrush: 40,
    beatRate: 82,
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Technology",
    earningsDate: "8 June 2026",
    momentumScore: 82,
    priceChange6M: 72,
    rsi14: 68,
    currentIV: 85,
    historicalIV: 58,
    impliedMove: 11.2,
    expectedIVCrush: 38,
    ivCrushPotential: "MEDIUM",
    callPremiumBuy: 2.4,
    callPremiumSell: 5.8,
    callGainFromIV: 142,
    putPremiumBuy: 2.2,
    putPremiumSell: 5.5,
    putGainFromIV: 150,
    ivCrushScore: 88,
    strategyRating: "EXCELLENT",
    riskLevel: "LOW",
    earningsMissRisk: 18,
    gapRisk: 22,
    recommendedStrategy: "Long Call (Stable, good IV crush)",
    targetProfit: 130,
    maxLoss: 24,
    lastEarningsMove: 8.2,
    historicalIVCrush: 36,
    beatRate: 88,
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    sector: "Technology",
    earningsDate: "9 June 2026",
    momentumScore: 80,
    priceChange6M: 65,
    rsi14: 66,
    currentIV: 78,
    historicalIV: 55,
    impliedMove: 10.5,
    expectedIVCrush: 35,
    ivCrushPotential: "MEDIUM",
    callPremiumBuy: 2.2,
    callPremiumSell: 5.2,
    callGainFromIV: 136,
    putPremiumBuy: 2,
    putPremiumSell: 4.9,
    putGainFromIV: 145,
    ivCrushScore: 85,
    strategyRating: "GOOD",
    riskLevel: "LOW",
    earningsMissRisk: 15,
    gapRisk: 18,
    recommendedStrategy: "Long Call (Safe, consistent)",
    targetProfit: 120,
    maxLoss: 22,
    lastEarningsMove: 6.8,
    historicalIVCrush: 33,
    beatRate: 90,
  },
  {
    ticker: "ORCL",
    name: "Oracle Corporation",
    sector: "Software",
    earningsDate: "10 June 2026",
    momentumScore: 72,
    priceChange6M: 48,
    rsi14: 62,
    currentIV: 68,
    historicalIV: 52,
    impliedMove: 8.8,
    expectedIVCrush: 32,
    ivCrushPotential: "MEDIUM",
    callPremiumBuy: 1.8,
    callPremiumSell: 4.2,
    callGainFromIV: 133,
    putPremiumBuy: 1.7,
    putPremiumSell: 4,
    putGainFromIV: 135,
    ivCrushScore: 78,
    strategyRating: "GOOD",
    riskLevel: "LOW",
    earningsMissRisk: 20,
    gapRisk: 24,
    recommendedStrategy: "Bull Call Spread (Moderate IV crush)",
    targetProfit: 110,
    maxLoss: 20,
    lastEarningsMove: 5.5,
    historicalIVCrush: 30,
    beatRate: 85,
  },
  {
    ticker: "IBM",
    name: "IBM Corporation",
    sector: "Technology",
    earningsDate: "11 June 2026",
    momentumScore: 55,
    priceChange6M: -15,
    rsi14: 48,
    currentIV: 62,
    historicalIV: 50,
    impliedMove: 7.5,
    expectedIVCrush: 28,
    ivCrushPotential: "LOW",
    callPremiumBuy: 1.5,
    callPremiumSell: 3.4,
    callGainFromIV: 127,
    putPremiumBuy: 1.4,
    putPremiumSell: 3.2,
    putGainFromIV: 129,
    ivCrushScore: 62,
    strategyRating: "FAIR",
    riskLevel: "MEDIUM",
    earningsMissRisk: 45,
    gapRisk: 40,
    recommendedStrategy: "Iron Condor (Low IV crush, weak momentum)",
    targetProfit: 75,
    maxLoss: 25,
    lastEarningsMove: -3.2,
    historicalIVCrush: 25,
    beatRate: 50,
  },
  {
    ticker: "QCOM",
    name: "Qualcomm Inc.",
    sector: "Semiconductors",
    earningsDate: "12 June 2026",
    momentumScore: 84,
    priceChange6M: 118,
    rsi14: 71,
    currentIV: 88,
    historicalIV: 60,
    impliedMove: 12.2,
    expectedIVCrush: 40,
    ivCrushPotential: "HIGH",
    callPremiumBuy: 2.6,
    callPremiumSell: 6.3,
    callGainFromIV: 142,
    putPremiumBuy: 2.4,
    putPremiumSell: 6,
    putGainFromIV: 150,
    ivCrushScore: 90,
    strategyRating: "EXCELLENT",
    riskLevel: "MEDIUM",
    earningsMissRisk: 26,
    gapRisk: 32,
    recommendedStrategy: "Long Call (Strong momentum, good IV crush)",
    targetProfit: 135,
    maxLoss: 25,
    lastEarningsMove: 11.5,
    historicalIVCrush: 38,
    beatRate: 83,
  },
];

function createEntryId(ticker: string, earningsDate: string) {
  return `${ticker.toLowerCase()}-${earningsDate}`;
}

function normalizeJuneDate(label: string) {
  const match = label.match(/(\d{1,2})\s+June\s+(\d{4})/i);
  if (!match) {
    return "2026-06-01";
  }

  const [, dayText, year] = match;
  return `${year}-06-${dayText.padStart(2, "0")}`;
}

function inferDirectionalBias(
  strategyRating: WeeklyStrategyRating,
  momentumScore: number
): WeeklyDirectionalBias {
  if (strategyRating === "EXCELLENT" || momentumScore >= 82) {
    return "Bullish";
  }

  if (momentumScore <= 60) {
    return "Bearish";
  }

  return "Neutral";
}

function inferThesis(
  ticker: string,
  sector: string,
  expectedIVCrush: number,
  momentumScore: number
) {
  if (momentumScore >= 90) {
    return `${ticker} tarafinda ${sector.toLowerCase()} liderligi ve yuksek beklenti fiyatlamasi var. Earnings sonrasi ana trade motifi volatilite sıkışması ve guclu trendin devam etmesi.`;
  }

  if (momentumScore <= 60) {
    return `${ticker} tarafinda beklenti zayif ve fiyatlama savunmaci. Burada ana avantaj yon degil, earnings sonrasi implied volatility bosalmasini kontrollu bir opsiyon yapisiyla kullanmak.`;
  }

  if (expectedIVCrush >= 40) {
    return `${ticker} icin iv crush potansiyeli yuksek. Beklenti fiyatlanmis olsa da premium yapisi earnings sonrasi normalize olabilecek bir alan birakiyor.`;
  }

  return `${ticker} tarafinda daha dengeli bir setup var. Ana odak, ${sector.toLowerCase()} temasi icinde orta riskli bir volatilite ve momentum dengesini kullanmak.`;
}

function mapSeedEntry(stock: SeedEntry) {
  const earningsDate = normalizeJuneDate(stock.earningsDate);

  return {
    id: createEntryId(stock.ticker, earningsDate),
    ticker: stock.ticker,
    name: stock.name,
    sector: stock.sector,
    earningsDate,
    earningsTime: "AH" as WeeklyEarningsTime,
    momentumScore: stock.momentumScore,
    priceChange6M: stock.priceChange6M,
    rsi14: stock.rsi14,
    currentIV: stock.currentIV,
    historicalIV: stock.historicalIV,
    impliedMove: stock.impliedMove,
    expectedIVCrush: stock.expectedIVCrush,
    ivCrushPotential: stock.ivCrushPotential,
    callPremiumBuy: stock.callPremiumBuy,
    callPremiumSell: stock.callPremiumSell,
    callGainFromIV: stock.callGainFromIV,
    putPremiumBuy: stock.putPremiumBuy,
    putPremiumSell: stock.putPremiumSell,
    putGainFromIV: stock.putGainFromIV,
    ivCrushScore: stock.ivCrushScore,
    strategyRating: stock.strategyRating,
    riskLevel: stock.riskLevel,
    earningsMissRisk: stock.earningsMissRisk,
    gapRisk: stock.gapRisk,
    recommendedStrategy: stock.recommendedStrategy,
    targetProfit: stock.targetProfit,
    maxLoss: stock.maxLoss,
    lastEarningsMove: stock.lastEarningsMove,
    historicalIVCrush: stock.historicalIVCrush,
    beatRate: stock.beatRate,
    thesis: inferThesis(
      stock.ticker,
      stock.sector,
      stock.expectedIVCrush,
      stock.momentumScore
    ),
    directionalBias: inferDirectionalBias(
      stock.strategyRating,
      stock.momentumScore
    ),
  } satisfies WeeklyReportEntry;
}

function buildReport(
  id: string,
  slug: string,
  title: string,
  weekStart: string,
  weekEnd: string,
  analysisDate: string,
  publishedAt: string,
  headline: string,
  summary: string,
  marketContext: string,
  executionNotes: string,
  keyCatalysts: string[],
  entries: WeeklyReportEntry[]
) {
  return {
    id,
    slug,
    title,
    weekStart,
    weekEnd,
    analysisDate,
    status: "published",
    authorEmail: ADMIN_EMAIL,
    createdAt: publishedAt,
    updatedAt: publishedAt,
    publishedAt,
    content: {
      headline,
      summary,
      marketContext,
      executionNotes,
      keyCatalysts,
      entries,
    },
  } satisfies WeeklyReportRecord;
}

export function buildInitialWeeklyReports() {
  const mapped = juneSeedData.map(mapSeedEntry);
  const firstWeekTickers = new Set(["NVDA", "AMD", "INTC", "TSLA", "META"]);
  const secondWeekTickers = new Set(["GOOGL", "MSFT", "ORCL", "IBM", "QCOM"]);

  const firstWeekEntries = mapped
    .filter(entry => firstWeekTickers.has(entry.ticker))
    .sort((left, right) => right.ivCrushScore - left.ivCrushScore);
  const secondWeekEntries = mapped
    .filter(entry => secondWeekTickers.has(entry.ticker))
    .sort((left, right) => right.ivCrushScore - left.ivCrushScore);

  return [
    buildReport(
      "weekly-report-2026-06-01",
      "2026-06-01-2026-06-07",
      "01 - 07 Haziran Earnings Plan",
      "2026-06-01",
      "2026-06-07",
      "2026-06-02T08:30:00.000Z",
      "2026-06-02T08:30:00.000Z",
      "AI beta ve mega-cap volatilitesi bu haftanin ana trade zemini.",
      "Ilk hafta raporu, AI beta ve momentum liderlerinde beklenti fiyatlamasinin ne kadar dolu olduguna odaklaniyor. Ana amac, earnings sonrasi volatilite bosalmasini yuksek skorla gelen isimlerde kontrollu riskle kullanmak.",
      "Semiconductor ve mega-cap teknoloji temasi halen baskin. Momentum güçlü ama beklenti de yuksek; bu yüzden yonsel takip kadar implied move ile gercek hareket farki kritik olacak.",
      "En yuksek conviction setuplarda call tarafinda net avantaj var. Daha zayif momentumlu INTC gibi isimlerde ise yonsel takipten cok premium bosalmasi odakli yapilar tercih edilmeli.",
      [
        "NVDA ve AMD tarafinda momentum + IV kombinasyonu olagandisi guclu.",
        "TSLA ve META volatilite sikismasi sonrasinda directional continuation adayi.",
        "INTC daha savunmaci, volatilite satimi odakli.",
      ],
      firstWeekEntries
    ),
    buildReport(
      "weekly-report-2026-06-08",
      "2026-06-08-2026-06-14",
      "08 - 14 Haziran Earnings Plan",
      "2026-06-08",
      "2026-06-14",
      "2026-06-06T08:30:00.000Z",
      "2026-06-06T08:30:00.000Z",
      "Ikinci hafta daha dengeli bir software ve platform sepeti sunuyor.",
      "Ikinci haftada mega-cap software ve platform isimlerine geciliyor. Skor dagilimi daha dengeli; trade kalitesi burada risk kontrolu, beklenen iv crush ve tarihsel beat disiplininin birlikte okunmasina bagli.",
      "Software tarafinda beklenti daha oturmus, realized move genelde daha kontrollu. Bu nedenle GOOGL, MSFT ve QCOM gibi isimlerde temiz premium bosalmasi ile orta riskli directional yapilar one cikiyor.",
      "Bu hafta call tarafinda hala avantaj var ancak ilk haftaya gore daha secici olmak gerekiyor. IBM gibi dusuk momentumlu isimler ana sepetin daha gerisinde tutulmali.",
      [
        "GOOGL ve QCOM bu haftanin en dengeli kalite skorlari.",
        "MSFT ve ORCL daha dusuk riskli continuation oyunlari sunuyor.",
        "IBM sadece dusuk conviction / hedge mantiginda ele alinmali.",
      ],
      secondWeekEntries
    ),
  ];
}
