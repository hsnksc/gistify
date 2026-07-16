import type { MidasSignalRecord, MidasSignalsData } from "../shared/midasSignals";
import type {
  WatchtowerEntry,
  WatchtowerLanguage,
  WatchtowerReportRecord,
} from "../shared/watchtower";

const score = (signal: MidasSignalRecord) =>
  signal.confidence ?? signal.apex_score ?? signal.mss ?? Math.abs(signal.strength);

function createEntry(
  signal: MidasSignalRecord,
  language: WatchtowerLanguage
): WatchtowerEntry {
  const conviction = Math.max(0, Math.min(100, score(signal)));
  const reasons = [
    ...signal.signals,
    signal.setup_type,
    signal.notes,
  ].filter((item): item is string => Boolean(item && item.trim())).slice(0, 4);
  const thesis = language === "en"
    ? `${signal.symbol} is in the ${signal.signal.replaceAll("_", " ").toLowerCase()} group with ${Math.round(conviction)}/100 conviction. Validate liquidity and the invalidation level before acting.`
    : `${signal.symbol}, ${Math.round(conviction)}/100 güç ile ${signal.signal.replaceAll("_", " ")} grubunda. İşlem öncesi likiditeyi ve geçersizlik seviyesini doğrulayın.`;

  return {
    symbol: signal.symbol,
    signal: signal.signal,
    conviction,
    price: signal.price,
    dailyPct: signal.daily_pct,
    weeklyPct: signal.weekly_pct,
    monthlyPct: signal.monthly_pct,
    riskLevel: signal.riskLevel,
    thesis,
    reasons,
    href: `/coverage/${encodeURIComponent(signal.symbol)}`,
  };
}

export function generateWatchtowerDraft(
  snapshot: MidasSignalsData,
  language: WatchtowerLanguage,
  authorEmail: string,
  now = new Date()
): WatchtowerReportRecord {
  const reportDate = (snapshot.timestamp || now.toISOString()).slice(0, 10);
  const byScore = (left: MidasSignalRecord, right: MidasSignalRecord) =>
    score(right) - score(left);
  const leaders = snapshot.signals
    .filter(item => item.signal === "STRONG_BUY" || item.signal === "BUY")
    .sort(byScore)
    .slice(0, 5)
    .map(item => createEntry(item, language));
  const risks = snapshot.signals
    .filter(item => item.signal === "STRONG_SELL" || item.signal === "SELL")
    .sort(byScore)
    .slice(0, 5)
    .map(item => createEntry(item, language));
  const watch = snapshot.signals
    .filter(item => item.signal === "HOLD")
    .sort(byScore)
    .slice(0, 5)
    .map(item => createEntry(item, language));
  const timestamp = now.toISOString();
  const sentiment = snapshot.summary?.market_sentiment || "NEUTRAL";
  const summary = language === "en"
    ? `Midas scanned ${snapshot.signals.length} symbols. This editor draft highlights ${leaders.length} leaders, ${risks.length} risk signals and ${watch.length} names to watch. Market sentiment: ${sentiment}.`
    : `Midas ${snapshot.signals.length} sembolü taradı. Bu editör taslağı ${leaders.length} lideri, ${risks.length} risk sinyalini ve izlenecek ${watch.length} hisseyi öne çıkarıyor. Piyasa görünümü: ${sentiment}.`;

  return {
    id: `watchtower-${reportDate}-${language}`,
    reportDate,
    language,
    title: language === "en" ? `Watchtower · ${reportDate}` : `Watchtower · ${reportDate}`,
    status: "draft",
    authorEmail,
    createdAt: timestamp,
    updatedAt: timestamp,
    content: {
      summary,
      marketSentiment: sentiment,
      leaders,
      risks,
      watch,
      methodology: language === "en"
        ? "Deterministic editorial draft generated from the latest Midas snapshot. It is not a forecast or investment advice. Publication requires editor approval."
        : "En güncel Midas snapshot'ından deterministik olarak üretilen editör taslağıdır. Tahmin veya yatırım tavsiyesi değildir. Yayın için editör onayı gerekir.",
      sourceTimestamp: snapshot.timestamp,
      sourceVersion: snapshot.version || snapshot.paramsVersion,
      universeCount: snapshot.signals.length,
    },
  };
}

export function ensureWatchtowerDrafts(
  billingStore: {
    getWatchtowerReportByDateAndLanguage: (date: string, language: WatchtowerLanguage) => WatchtowerReportRecord | null;
    upsertWatchtowerReport: (record: WatchtowerReportRecord) => void;
  },
  snapshot: MidasSignalsData,
  authorEmail: string
) {
  const reportDate = snapshot.timestamp.slice(0, 10);
  for (const language of ["tr", "en"] as const) {
    if (!billingStore.getWatchtowerReportByDateAndLanguage(reportDate, language)) {
      billingStore.upsertWatchtowerReport(
        generateWatchtowerDraft(snapshot, language, authorEmail)
      );
    }
  }
}
