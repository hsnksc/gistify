import type {
  WeeklyDirectionalBias,
  WeeklyReportEntry,
  WeeklyReportRecord,
  WeeklyRiskLevel,
  WeeklyStrategyRating,
} from "@shared/weeklyReports";

export const REPORT_ADMIN_SECRET_STORAGE_KEY = "gistify_report_admin_secret";

export const strategyPresentation: Record<
  WeeklyStrategyRating,
  { label: string; badgeClass: string; accentClass: string; color: string }
> = {
  EXCELLENT: {
    label: "Mukemmel",
    badgeClass: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
    accentClass: "border-emerald-500/40",
    color: "#34d399",
  },
  GOOD: {
    label: "Iyi",
    badgeClass: "border-lime-500/40 bg-lime-500/15 text-lime-300",
    accentClass: "border-lime-500/40",
    color: "#84cc16",
  },
  FAIR: {
    label: "Izleme",
    badgeClass: "border-amber-500/40 bg-amber-500/15 text-amber-300",
    accentClass: "border-amber-500/40",
    color: "#f59e0b",
  },
  POOR: {
    label: "Dusuk",
    badgeClass: "border-rose-500/40 bg-rose-500/15 text-rose-300",
    accentClass: "border-rose-500/40",
    color: "#f43f5e",
  },
};

export const riskLabels: Record<WeeklyRiskLevel, string> = {
  LOW: "Dusuk",
  MEDIUM: "Orta",
  HIGH: "Yuksek",
  VERY_HIGH: "Cok Yuksek",
};

export const biasLabels: Record<WeeklyDirectionalBias, string> = {
  Bullish: "Yukselis",
  Bearish: "Dusus",
  Neutral: "Notr",
};

function formatParts(date: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function formatWeekRange(report: WeeklyReportRecord) {
  return `${formatParts(report.weekStart)} - ${formatParts(report.weekEnd)}`;
}

export function formatAnalysisDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function formatCalendarDay(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function getReportSummary(report: WeeklyReportRecord) {
  const entries = report.content.entries;
  const totalEntries = entries.length;
  const excellentCount = entries.filter(
    entry => entry.strategyRating === "EXCELLENT"
  ).length;
  const avgMomentum = totalEntries
    ? Math.round(
        entries.reduce((total, entry) => total + entry.momentumScore, 0) /
          totalEntries
      )
    : 0;
  const avgIvCrush = totalEntries
    ? Math.round(
        entries.reduce((total, entry) => total + entry.expectedIVCrush, 0) /
          totalEntries
      )
    : 0;
  const avgTargetProfit = totalEntries
    ? Math.round(
        entries.reduce((total, entry) => total + entry.targetProfit, 0) /
          totalEntries
      )
    : 0;
  const topPick = [...entries].sort(
    (left, right) => right.ivCrushScore - left.ivCrushScore
  )[0];

  return {
    totalEntries,
    excellentCount,
    avgMomentum,
    avgIvCrush,
    avgTargetProfit,
    topPick,
  };
}

export function groupEntriesByDay(entries: WeeklyReportEntry[]) {
  const groups = new Map<string, WeeklyReportEntry[]>();

  for (const entry of [...entries].sort((left, right) =>
    left.earningsDate.localeCompare(right.earningsDate)
  )) {
    const current = groups.get(entry.earningsDate) || [];
    current.push(entry);
    groups.set(entry.earningsDate, current);
  }

  return Array.from(groups.entries()).map(([date, dayEntries]) => ({
    date,
    entries: dayEntries.sort((left, right) => right.ivCrushScore - left.ivCrushScore),
  }));
}

export function sortReportsNewestFirst(reports: WeeklyReportRecord[]) {
  return [...reports].sort((left, right) =>
    right.weekStart.localeCompare(left.weekStart)
  );
}

export function deepCloneReport(report: WeeklyReportRecord) {
  return JSON.parse(JSON.stringify(report)) as WeeklyReportRecord;
}

export function createEmptyEntry(index = 0): WeeklyReportEntry {
  return {
    id: `entry-${Date.now()}-${index + 1}`,
    ticker: `STK${index + 1}`,
    name: "Yeni Hisse",
    sector: "Technology",
    earningsDate: new Date().toISOString().slice(0, 10),
    earningsTime: "AH",
    momentumScore: 70,
    priceChange6M: 0,
    rsi14: 50,
    currentIV: 70,
    historicalIV: 55,
    impliedMove: 8,
    expectedIVCrush: 30,
    ivCrushPotential: "MEDIUM",
    callPremiumBuy: 1.5,
    callPremiumSell: 4,
    callGainFromIV: 120,
    putPremiumBuy: 1.5,
    putPremiumSell: 4,
    putGainFromIV: 120,
    ivCrushScore: 70,
    strategyRating: "GOOD",
    riskLevel: "MEDIUM",
    earningsMissRisk: 25,
    gapRisk: 25,
    recommendedStrategy: "Bull Call Spread",
    targetProfit: 100,
    maxLoss: 25,
    lastEarningsMove: 6,
    historicalIVCrush: 28,
    beatRate: 70,
    thesis: "Yeni haftalik analiz notu.",
    directionalBias: "Neutral",
  };
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function createNextWeeklyReportDraft(source?: WeeklyReportRecord) {
  const nowIso = new Date().toISOString();
  const tempId = `draft-${Date.now()}`;
  const startBase = source
    ? new Date(`${source.weekStart}T00:00:00Z`)
    : new Date();
  const nextWeekStart = source ? addDays(startBase, 7) : startBase;
  if (!source) {
    const day = nextWeekStart.getUTCDay() || 7;
    nextWeekStart.setUTCDate(nextWeekStart.getUTCDate() - day + 1);
  }
  nextWeekStart.setUTCHours(0, 0, 0, 0);
  const nextWeekEnd = addDays(nextWeekStart, 6);
  const shiftedEntries =
    source?.content.entries.map(entry => {
      const nextEntry = { ...entry };
      const entryDate = new Date(`${entry.earningsDate}T00:00:00Z`);
      nextEntry.id = `entry-${Date.now()}-${entry.ticker.toLowerCase()}`;
      nextEntry.earningsDate = toIsoDate(addDays(entryDate, 7));
      return nextEntry;
    }) || [createEmptyEntry(0)];

  return {
    id: tempId,
    slug: tempId,
    title: `${formatParts(toIsoDate(nextWeekStart))} - ${formatParts(
      toIsoDate(nextWeekEnd)
    )} Earnings Plan`,
    weekStart: toIsoDate(nextWeekStart),
    weekEnd: toIsoDate(nextWeekEnd),
    analysisDate: nowIso,
    status: "draft",
    authorEmail: "hsnksc@gmail.com",
    createdAt: nowIso,
    updatedAt: nowIso,
    publishedAt: undefined,
    content: {
      headline: "Yeni haftalik earnings plani",
      summary: "Bu hafta icin earnings ve iv crush planini duzenleyin.",
      marketContext: "Makro baglam notlarini girin.",
      executionNotes: "Pozisyonlama ve risk notlarini girin.",
      keyCatalysts: ["Katalizor 1", "Katalizor 2"],
      entries: shiftedEntries,
    },
  } satisfies WeeklyReportRecord;
}
