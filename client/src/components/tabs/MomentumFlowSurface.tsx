import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRightLeft,
  BarChart3,
  Clock,
  LineChart,
  Loader2,
  RefreshCw,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import type {
  MidasActionSignal as ActionSignal,
  MidasRiskLevel,
  MidasSignalRecord,
  MidasSignalsData,
} from "@shared/midasSignals";
import { runMomentumScan, type StockResult } from "@/scanner";
import type { AppLanguage } from "@/lib/i18n";

type SurfaceMode = "overview" | "positive" | "negative" | "shifts";
type SignalDirection = "positive" | "negative" | "neutral";

interface LiveSignalSummary {
  action: ActionSignal;
  scannerSignal: string;
  bullScore: number;
  bearScore: number;
  currentPrice: number;
  priceChangePct: number;
  rsi: number;
  volumeRatio: number;
  confidenceScore: number;
  updatedAt: string;
}

interface ScanProgressState {
  scanned: number;
  total: number;
  current: string;
}

interface MergedSignalRecord extends MidasSignalRecord {
  live?: LiveSignalSummary;
  resolvedSignal: ActionSignal;
  conviction: number;
  dayChange: number;
  directionalBias: SignalDirection;
  headline: string;
  reasonDetails: string[];
}

const SNAPSHOT_REFRESH_INTERVAL_MS = 60 * 1000;
const MAX_OVERVIEW_SIGNALS = 6;
const MAX_OVERVIEW_SHIFTS = 6;

function copy(language: AppLanguage, tr: string, en: string) {
  return language === "en" ? en : tr;
}

function signalBadgeClass(signal: ActionSignal) {
  switch (signal) {
    case "STRONG_BUY":
      return "bg-emerald-500/18 text-emerald-300 border-emerald-500/35";
    case "BUY":
      return "bg-emerald-400/12 text-emerald-300 border-emerald-400/30";
    case "SELL":
      return "bg-rose-400/12 text-rose-300 border-rose-400/30";
    case "STRONG_SELL":
      return "bg-rose-500/18 text-rose-300 border-rose-500/35";
    default:
      return "bg-amber-400/10 text-amber-300 border-amber-400/25";
  }
}

function riskBadgeClass(riskLevel: MidasRiskLevel | undefined) {
  switch (riskLevel) {
    case "LOW":
      return "border-emerald-500/25 bg-emerald-500/10 text-emerald-200";
    case "HIGH":
      return "border-rose-500/25 bg-rose-500/10 text-rose-200";
    default:
      return "border-amber-500/25 bg-amber-500/10 text-amber-200";
  }
}

function riskLabel(riskLevel: MidasRiskLevel | undefined, language: AppLanguage) {
  switch (riskLevel) {
    case "LOW":
      return copy(language, "Dusuk risk", "Low risk");
    case "HIGH":
      return copy(language, "Yuksek risk", "High risk");
    case "MEDIUM":
      return copy(language, "Orta risk", "Medium risk");
    default:
      return copy(language, "Risk n/a", "Risk n/a");
  }
}

function signalLabel(signal: ActionSignal, language: AppLanguage) {
  switch (signal) {
    case "STRONG_BUY":
      return copy(language, "GUCLU AL", "STRONG BUY");
    case "BUY":
      return copy(language, "AL", "BUY");
    case "SELL":
      return copy(language, "SAT", "SELL");
    case "STRONG_SELL":
      return copy(language, "GUCLU SAT", "STRONG SELL");
    default:
      return copy(language, "TUT", "HOLD");
  }
}

function scannerSignalLabel(signal: string, language: AppLanguage) {
  switch (signal) {
    case "STRONG_BUY":
      return signalLabel("STRONG_BUY", language);
    case "BUY":
      return signalLabel("BUY", language);
    case "NEUTRAL_BULLISH":
      return copy(language, "NOTR-POZITIF", "NEUTRAL-BULLISH");
    case "NEUTRAL":
      return copy(language, "NOTR", "NEUTRAL");
    case "NEUTRAL_BEARISH":
      return copy(language, "NOTR-NEGATIF", "NEUTRAL-BEARISH");
    case "WEAK":
      return copy(language, "ZAYIF", "WEAK");
    case "CAUTION_HOT":
      return copy(language, "SICAK BOLGE", "HOT ZONE");
    case "OVERBOUGHT_RED":
      return copy(language, "ASIRI ALIM", "OVERBOUGHT");
    case "OVERSOLD_CAUTION":
      return copy(language, "ASIRI SATIM", "OVERSOLD");
    default:
      return signal;
  }
}

function pctClass(value: number) {
  if (value > 0) return "text-emerald-300";
  if (value < 0) return "text-rose-300";
  return "text-muted-foreground";
}

function formatPct(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

function formatConfidence(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return null;
  }

  return `${Math.round(value)}%`;
}

function formatTimestamp(value: string | undefined, language: AppLanguage) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(language === "en" ? "en-US" : "tr-TR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function actionPriority(signal: ActionSignal) {
  switch (signal) {
    case "STRONG_BUY":
    case "STRONG_SELL":
      return 5;
    case "BUY":
    case "SELL":
      return 4;
    default:
      return 3;
  }
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getDirectionalBias(signal: ActionSignal): SignalDirection {
  if (signal === "STRONG_BUY" || signal === "BUY") return "positive";
  if (signal === "STRONG_SELL" || signal === "SELL") return "negative";
  return "neutral";
}

function deriveStats(signals: Array<{ resolvedSignal: ActionSignal }>) {
  return {
    strongBuy: signals.filter((item) => item.resolvedSignal === "STRONG_BUY").length,
    buy: signals.filter((item) => item.resolvedSignal === "BUY").length,
    hold: signals.filter((item) => item.resolvedSignal === "HOLD").length,
    sell: signals.filter((item) => item.resolvedSignal === "SELL").length,
    strongSell: signals.filter((item) => item.resolvedSignal === "STRONG_SELL").length,
  };
}

function describeSnapshotTag(tag: string, language: AppLanguage) {
  switch (tag) {
    case "DAILY_STRONG_UP":
      return copy(language, "Gun ici hareket sert yukari.", "Intraday momentum is accelerating higher.");
    case "DAILY_UP":
      return copy(language, "Gun ici akis yukari yone donuk.", "Intraday flow is tilted higher.");
    case "WEEKLY_STRONG_UP":
      return copy(language, "Haftalik trend guclu sekilde pozitif.", "The weekly trend is strongly positive.");
    case "WEEKLY_UP":
      return copy(language, "Haftalik momentum destek veriyor.", "Weekly momentum is supportive.");
    case "MONTHLY_STRONG_UP":
      return copy(language, "Aylik trend liderlik ediyor.", "The monthly trend is showing leadership.");
    case "MONTHLY_UP":
      return copy(language, "Aylik momentum pozitif tarafta.", "Monthly momentum remains positive.");
    case "ALL_UP":
      return copy(language, "Tum zaman pencereleri yukari bakiyor.", "Every major timeframe is aligned higher.");
    case "DAILY_STRONG_DOWN":
      return copy(language, "Gun ici satis baskisi sert.", "Intraday selling pressure is sharp.");
    case "DAILY_DOWN":
      return copy(language, "Gun ici akis asagi yone kayiyor.", "Intraday flow is leaning lower.");
    case "WEEKLY_STRONG_DOWN":
      return copy(language, "Haftalik zayiflik derinlesiyor.", "Weekly weakness is deepening.");
    case "WEEKLY_DOWN":
      return copy(language, "Haftalik momentum negatif.", "Weekly momentum is negative.");
    case "MONTHLY_STRONG_DOWN":
      return copy(language, "Aylik trend belirgin sekilde bozuk.", "The monthly trend is decisively broken.");
    case "MONTHLY_DOWN":
      return copy(language, "Aylik momentum zayif.", "Monthly momentum is weak.");
    case "ALL_DOWN":
      return copy(language, "Tum zaman pencereleri asagi bakiyor.", "Every major timeframe is aligned lower.");
    default:
      return tag.replace(/_/g, " ");
  }
}

function buildHeadline(
  signal: MidasSignalRecord,
  live: LiveSignalSummary | undefined,
  resolvedSignal: ActionSignal,
  language: AppLanguage
) {
  if (live && live.action !== signal.signal) {
    if (getDirectionalBias(resolvedSignal) === "positive") {
      return copy(language, "Canli motor sinyali yukari revize etti.", "The live engine upgraded the setup to the upside.");
    }

    if (getDirectionalBias(resolvedSignal) === "negative") {
      return copy(language, "Canli motor sinyali asagi revize etti.", "The live engine downgraded the setup to the downside.");
    }
  }

  switch (resolvedSignal) {
    case "STRONG_BUY":
      return copy(language, "Trend, breadth ve hiz ayni yone bakiyor.", "Trend, breadth, and velocity are aligned higher.");
    case "BUY":
      return copy(language, "Yukari momentum korunuyor.", "Upside momentum remains intact.");
    case "SELL":
      return copy(language, "Asagi momentum one cikiyor.", "Downside momentum is taking control.");
    case "STRONG_SELL":
      return copy(language, "Satis baskisi hizlaniyor.", "Selling pressure is accelerating.");
    default:
      return copy(language, "Yon kararsiz; gecis bolgesi.", "Direction is mixed; this is a transition zone.");
  }
}

function buildReasonDetails(
  signal: MidasSignalRecord,
  live: LiveSignalSummary | undefined,
  resolvedSignal: ActionSignal,
  dayChange: number,
  language: AppLanguage
) {
  const direction = getDirectionalBias(resolvedSignal);
  const reasons: string[] = [];
  if (live) {
    if (direction === "positive") {
      reasons.push(copy(language, `Canli motor bull ${live.bullScore} / bear ${live.bearScore} uretiyor.`, `The live engine prints bull ${live.bullScore} versus bear ${live.bearScore}.`));
    } else if (direction === "negative") {
      reasons.push(copy(language, `Canli motor bear ${live.bearScore} / bull ${live.bullScore} uretiyor.`, `The live engine prints bear ${live.bearScore} versus bull ${live.bullScore}.`));
    }

    if (live.volumeRatio >= 1.25) {
      reasons.push(copy(language, `Hacim destegi RVOL ${live.volumeRatio.toFixed(2)}x seviyesinde.`, `Volume support is running at ${live.volumeRatio.toFixed(2)}x RVOL.`));
    }
  }

  if (direction === "positive") {
    if (dayChange > 0) reasons.push(copy(language, `Gunluk akis ${formatPct(dayChange)} ile pozitif.`, `Daily flow is positive at ${formatPct(dayChange)}.`));
    if (signal.weekly_pct > 0) reasons.push(copy(language, `Haftalik momentum ${formatPct(signal.weekly_pct)} seviyesinde.`, `Weekly momentum is running at ${formatPct(signal.weekly_pct)}.`));
    if (signal.monthly_pct > 0) reasons.push(copy(language, `Aylik ivme ${formatPct(signal.monthly_pct)} ile destek veriyor.`, `Monthly acceleration supports the move at ${formatPct(signal.monthly_pct)}.`));
  }

  if (direction === "negative") {
    if (dayChange < 0) reasons.push(copy(language, `Gunluk akis ${formatPct(dayChange)} ile asagi yone egiliyor.`, `Daily flow is leaning lower at ${formatPct(dayChange)}.`));
    if (signal.weekly_pct < 0) reasons.push(copy(language, `Haftalik momentum ${formatPct(signal.weekly_pct)} ile zayif.`, `Weekly momentum is weak at ${formatPct(signal.weekly_pct)}.`));
    if (signal.monthly_pct < 0) reasons.push(copy(language, `Aylik trend ${formatPct(signal.monthly_pct)} ile bozuluyor.`, `The monthly trend is deteriorating at ${formatPct(signal.monthly_pct)}.`));
  }

  for (const tag of signal.signals.slice(0, 4)) {
    reasons.push(describeSnapshotTag(tag, language));
  }

  return uniqueStrings(reasons).slice(0, 4);
}

function pipelineStatusLabel(status: string, language: AppLanguage) {
  switch (status) {
    case "ok":
      return copy(language, "Senkron", "Synced");
    case "stale":
      return copy(language, "Eski veri", "Stale");
    case "error":
      return copy(language, "Hata", "Error");
    default:
      return copy(language, "Beklemede", "Idle");
  }
}

function pipelineStatusClass(status: string) {
  switch (status) {
    case "ok":
      return "border-emerald-500/25 bg-emerald-500/12 text-emerald-200";
    case "stale":
      return "border-amber-500/25 bg-amber-500/12 text-amber-200";
    case "error":
      return "border-rose-500/25 bg-rose-500/12 text-rose-200";
    default:
      return "border-border bg-background/70 text-muted-foreground";
  }
}

function deriveBearScore(stock: StockResult) {
  const rsiScore =
    stock.rsi <= 25 ? 100 : stock.rsi <= 35 ? 78 : stock.rsi <= 45 ? 58 : stock.rsi <= 55 ? 28 : 0;
  const priceChangeScore = stock.priceChangePct < 0 ? Math.min(Math.abs(stock.priceChangePct) * 18, 100) : 0;
  const vwapScore = stock.currentPrice < stock.vwap ? Math.min((Math.abs(stock.vwapDeviation) / Math.max(stock.atr14d, 0.01)) * 25, 100) : 0;
  const structureScore = Math.max(0, Math.min(100, 100 - stock.structureScore));
  const volumeScore =
    stock.volumeRatio >= 1.25 && stock.priceChangePct < 0
      ? Math.min(stock.volumeRatio * 28, 100)
      : Math.min(stock.volumeRatio * 10, 40);
  const weaknessScore =
    stock.signal === "WEAK" ? 85 : stock.signal === "NEUTRAL_BEARISH" ? 70 : stock.signal === "OVERBOUGHT_RED" ? 65 : stock.signal === "CAUTION_HOT" ? 35 : 0;
  const intradayScore =
    stock.currentPrice < stock.openPrice ? Math.min(((stock.openPrice - stock.currentPrice) / Math.max(stock.atr14d, 0.01)) * 20, 100) : 0;
  const weightedScore =
    rsiScore * 0.2 +
    priceChangeScore * 0.2 +
    vwapScore * 0.18 +
    structureScore * 0.15 +
    volumeScore * 0.12 +
    weaknessScore * 0.1 +
    intradayScore * 0.05;
  const confidence = stock.confidenceScore ?? 60;
  const confidenceMultiplier = confidence >= 80 ? 1 : confidence >= 50 ? 0.92 : 0.82;
  return Math.round(Math.max(0, Math.min(100, weightedScore * confidenceMultiplier)));
}

function deriveLiveSignal(stock: StockResult): LiveSignalSummary {
  const bullScore = Math.round(stock.score);
  const bearScore = deriveBearScore(stock);
  let action: ActionSignal = "HOLD";

  if (bullScore >= 75 && bullScore - bearScore >= 8) action = "STRONG_BUY";
  else if (bearScore >= 75 && bearScore - bullScore >= 8) action = "STRONG_SELL";
  else if (bullScore >= 60 && bullScore - bearScore >= 5) action = "BUY";
  else if (bearScore >= 60 && bearScore - bullScore >= 5) action = "SELL";

  return {
    action,
    scannerSignal: stock.signal,
    bullScore,
    bearScore,
    currentPrice: stock.currentPrice,
    priceChangePct: stock.priceChangePct,
    rsi: stock.rsi,
    volumeRatio: stock.volumeRatio,
    confidenceScore: stock.confidenceScore ?? 0,
    updatedAt: stock.timestamp,
  };
}

function MomentumSignalCard({
  language,
  signal,
  snapshotTimestamp,
}: {
  language: AppLanguage;
  signal: MergedSignalRecord;
  snapshotTimestamp: string;
}) {
  const currentPrice = signal.live?.currentPrice ?? signal.price;
  const currentDayPct = signal.live?.priceChangePct ?? signal.daily_pct;
  const signalChanged = signal.live && signal.live.action !== signal.signal;
  const convictionWidth = Math.max(8, Math.min(100, Math.round(signal.conviction)));
  const displayConfidence = signal.live?.confidenceScore ?? signal.confidence;
  const displayConfidenceLabel = formatConfidence(displayConfidence);
  const snapshotConfidenceLabel = formatConfidence(signal.confidence);
  const hasLayers = Boolean(
    signal.layers &&
      (signal.layers.momentumScore !== undefined ||
        signal.layers.oscillatorScore !== undefined ||
        signal.layers.trendScore !== undefined ||
        signal.layers.confluenceScore !== undefined)
  );
  const toneClass =
    signal.directionalBias === "positive"
      ? "border-emerald-500/25 bg-[linear-gradient(180deg,rgba(16,185,129,0.12),rgba(15,23,42,0.74))]"
      : signal.directionalBias === "negative"
        ? "border-rose-500/25 bg-[linear-gradient(180deg,rgba(244,63,94,0.12),rgba(15,23,42,0.74))]"
        : "border-border bg-[linear-gradient(180deg,rgba(245,158,11,0.10),rgba(15,23,42,0.74))]";
  const meterClass =
    signal.directionalBias === "positive"
      ? "bg-gradient-to-r from-emerald-400 to-teal-300"
      : signal.directionalBias === "negative"
        ? "bg-gradient-to-r from-rose-400 to-orange-300"
        : "bg-gradient-to-r from-amber-400 to-yellow-200";

  return (
    <article className={`rounded-[1.35rem] border p-4 shadow-[0_18px_48px_rgba(3,7,18,0.22)] transition-transform duration-200 hover:-translate-y-0.5 ${toneClass}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="heading-condensed text-2xl text-foreground">{signal.symbol}</p>
            {signal.directionalBias === "positive" ? (
              <TrendingUp className="size-4 text-emerald-300" />
            ) : signal.directionalBias === "negative" ? (
              <TrendingDown className="size-4 text-rose-300" />
            ) : (
              <LineChart className="size-4 text-amber-300" />
            )}
          </div>
          <p className="mt-1 text-sm text-foreground/90">{signal.headline}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="data-mono rounded-full border border-border bg-background/60 px-2.5 py-1">{formatPrice(currentPrice)}</span>
            {signal.live ? (
              <span className="rounded-full border border-border bg-background/60 px-2.5 py-1">
                {copy(language, "Scanner", "Scanner")}: {scannerSignalLabel(signal.live.scannerSignal, language)}
              </span>
            ) : null}
          </div>
        </div>

        <span className={`shrink-0 rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${signalBadgeClass(signal.resolvedSignal)}`}>
          {signalLabel(signal.resolvedSignal, language)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
        {displayConfidenceLabel ? (
          <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-2.5 py-1 text-sky-100">
            {copy(language, "Guven", "Confidence")}: {displayConfidenceLabel}
          </span>
        ) : null}
        {signal.riskLevel ? (
          <span className={`rounded-full border px-2.5 py-1 ${riskBadgeClass(signal.riskLevel)}`}>
            {riskLabel(signal.riskLevel, language)}
          </span>
        ) : null}
        {signal.live && snapshotConfidenceLabel ? (
          <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-muted-foreground">
            {copy(language, "Snapshot guven", "Snapshot confidence")}: {snapshotConfidenceLabel}
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>{copy(language, "Momentum gucu", "Momentum conviction")}</span>
          <span className="data-mono text-foreground/85">{convictionWidth}/100</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-background/75">
          <div className={`h-full rounded-full transition-all duration-300 ${meterClass}`} style={{ width: `${convictionWidth}%` }} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
        <span className={`data-mono rounded-full border border-border bg-background/70 px-2.5 py-1 ${pctClass(currentDayPct)}`}>{copy(language, "Gunluk", "Daily")}: {formatPct(currentDayPct)}</span>
        <span className={`data-mono rounded-full border border-border bg-background/70 px-2.5 py-1 ${pctClass(signal.weekly_pct)}`}>{copy(language, "Haftalik", "Weekly")}: {formatPct(signal.weekly_pct)}</span>
        <span className={`data-mono rounded-full border border-border bg-background/70 px-2.5 py-1 ${pctClass(signal.monthly_pct)}`}>{copy(language, "Aylik", "Monthly")}: {formatPct(signal.monthly_pct)}</span>
        {signal.live ? (
          <span className="data-mono rounded-full border border-border bg-background/70 px-2.5 py-1 text-muted-foreground">
            Bull {signal.live.bullScore} / Bear {signal.live.bearScore}
          </span>
        ) : null}
      </div>

      {signalChanged ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-3 py-2 text-[11px] text-indigo-100">
          <ArrowRightLeft className="size-3.5" />
          <span>
            {copy(language, "Snapshot", "Snapshot")} {signalLabel(signal.signal, language)} - {copy(language, "Canli", "Live")} {signalLabel(signal.resolvedSignal, language)}
          </span>
        </div>
      ) : null}

      {signal.notes ? (
        <div className="mt-4 rounded-xl border border-sky-400/18 bg-sky-500/[0.08] px-3 py-3 text-xs leading-6 text-sky-50/88">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-200/78">
            {copy(language, "Analist notu", "Analyst note")}
          </p>
          <p>{signal.notes}</p>
        </div>
      ) : null}

      <div className="mt-4 space-y-2">
        {signal.reasonDetails.map((reason) => (
          <div key={reason} className="rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-xs leading-6 text-foreground/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
            {reason}
          </div>
        ))}
      </div>

      {hasLayers ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
            <p className="text-[10px] uppercase tracking-[0.14em]">{copy(language, "Momentum", "Momentum")}</p>
            <p className="data-mono mt-1 text-sm text-foreground">{signal.layers?.momentumScore ?? "-"}</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
            <p className="text-[10px] uppercase tracking-[0.14em]">{copy(language, "Osilator", "Oscillator")}</p>
            <p className="data-mono mt-1 text-sm text-foreground">{signal.layers?.oscillatorScore ?? "-"}</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
            <p className="text-[10px] uppercase tracking-[0.14em]">{copy(language, "Trend", "Trend")}</p>
            <p className="data-mono mt-1 text-sm text-foreground">{signal.layers?.trendScore ?? "-"}</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
            <p className="text-[10px] uppercase tracking-[0.14em]">{copy(language, "Uyum", "Confluence")}</p>
            <p className="data-mono mt-1 text-sm text-foreground">{signal.layers?.confluenceScore ?? "-"}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {signal.signals.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-full border border-border bg-background/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
        <span>{copy(language, "Snapshot", "Snapshot")}: {formatTimestamp(signal.timestamp || snapshotTimestamp, language)}</span>
        {signal.live ? <span>{copy(language, "Canli", "Live")}: {formatTimestamp(signal.live.updatedAt, language)}</span> : null}
      </div>
    </article>
  );
}

export default function MomentumFlowSurface({
  language = "tr",
}: {
  language?: AppLanguage;
}) {
  const [data, setData] = useState<MidasSignalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [snapshotRefreshing, setSnapshotRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [surfaceMode, setSurfaceMode] = useState<SurfaceMode>("overview");
  const [liveSignals, setLiveSignals] = useState<Record<string, LiveSignalSummary>>({});
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveScanTime, setLiveScanTime] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState<ScanProgressState>({ scanned: 0, total: 0, current: "" });
  const liveRunRef = useRef(0);
  const lastAutoScanKeyRef = useRef("");

  const loadSnapshot = useCallback(async (silent = false) => {
    if (!silent) {
      if (data) setSnapshotRefreshing(true);
      else setLoading(true);
    }

    try {
      const response = await fetch("/api/midas/signals", {
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        const payload = ((await response.json().catch(() => null)) as { error?: string } | null) || null;
        throw new Error(payload?.error || `HTTP ${response.status}`);
      }

      setData((await response.json()) as MidasSignalsData);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error && loadError.message ? loadError.message : copy(language, "Midas sinyal verisi yuklenemedi.", "Failed to load Midas signal data."));
    } finally {
      setLoading(false);
      setSnapshotRefreshing(false);
    }
  }, [data, language]);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void loadSnapshot(true);
    }, SNAPSHOT_REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [loadSnapshot]);

  const runLiveRefresh = useCallback(async (symbols: string[]) => {
    if (!symbols.length) return;

    const runId = liveRunRef.current + 1;
    liveRunRef.current = runId;
    setLiveLoading(true);
    setLiveError(null);
    setScanProgress({ scanned: 0, total: symbols.length, current: "" });
  
    try {
      const response = await runMomentumScan(symbols, {
        minScore: 0,
        onProgress: (scanned, total, current) => {
          if (liveRunRef.current !== runId) return;
          setScanProgress({ scanned, total, current });
        },
      });

      if (liveRunRef.current !== runId) return;

      setLiveSignals(Object.fromEntries(response.stocks.map((stock) => [stock.ticker, deriveLiveSignal(stock)])));
      setLiveScanTime(response.scanTime);
    } catch {
      if (liveRunRef.current !== runId) return;
      setLiveError(copy(language, "Canli scanner verisi uretilemedi. Snapshot gorunumu korunuyor.", "Live scanner data could not be produced. Snapshot view remains active."));
    } finally {
      if (liveRunRef.current === runId) setLiveLoading(false);
    }
  }, [language]);

  useEffect(() => {
    if (!data) return;
    const nextKey = `${data.timestamp}:${data.symbol_count}`;
    if (lastAutoScanKeyRef.current === nextKey) return;
    lastAutoScanKeyRef.current = nextKey;
    void runLiveRefresh(data.signals.map((signal) => signal.symbol));
  }, [data, runLiveRefresh]);

  const mergedSignals = useMemo(() => {
    if (!data) return [];

    return data.signals.map((signal) => {
      const live = liveSignals[signal.symbol];
      const resolvedSignal = live?.action ?? signal.signal;
      const dayChange = live?.priceChangePct ?? signal.daily_pct;

      return {
        ...signal,
        live,
        resolvedSignal,
        conviction: live ? Math.max(live.bullScore, live.bearScore) : Math.abs(signal.strength) * 14,
        dayChange,
        directionalBias: getDirectionalBias(resolvedSignal),
        headline: buildHeadline(signal, live, resolvedSignal, language),
        reasonDetails: buildReasonDetails(signal, live, resolvedSignal, dayChange, language),
      } satisfies MergedSignalRecord;
    });
  }, [data, language, liveSignals]);

  const stats = useMemo(() => deriveStats(mergedSignals), [mergedSignals]);
  const liveCoverageCount = useMemo(() => Object.keys(liveSignals).length, [liveSignals]);
  const positiveSignals = useMemo(() => [...mergedSignals].filter((signal) => signal.directionalBias === "positive").sort((left, right) => {
    const actionGap = actionPriority(right.resolvedSignal) - actionPriority(left.resolvedSignal);
    if (actionGap !== 0) return actionGap;
    const convictionGap = right.conviction - left.conviction;
    if (convictionGap !== 0) return convictionGap;
    const weeklyGap = right.weekly_pct - left.weekly_pct;
    if (weeklyGap !== 0) return weeklyGap;
    return right.monthly_pct - left.monthly_pct;
  }), [mergedSignals]);
  const negativeSignals = useMemo(() => [...mergedSignals].filter((signal) => signal.directionalBias === "negative").sort((left, right) => {
    const actionGap = actionPriority(right.resolvedSignal) - actionPriority(left.resolvedSignal);
    if (actionGap !== 0) return actionGap;
    const convictionGap = right.conviction - left.conviction;
    if (convictionGap !== 0) return convictionGap;
    const weeklyGap = left.weekly_pct - right.weekly_pct;
    if (weeklyGap !== 0) return weeklyGap;
    return left.monthly_pct - right.monthly_pct;
  }), [mergedSignals]);
  const neutralCount = useMemo(() => mergedSignals.filter((signal) => signal.directionalBias === "neutral").length, [mergedSignals]);
  const changedSignals = useMemo(() => mergedSignals.filter((signal) => signal.live && signal.live.action !== signal.signal), [mergedSignals]);
  const orderedChangedSignals = useMemo(() => [...changedSignals].sort((left, right) => {
    const actionGap = actionPriority(right.resolvedSignal) - actionPriority(left.resolvedSignal);
    if (actionGap !== 0) return actionGap;
    return right.conviction - left.conviction;
  }), [changedSignals]);
  const biggestMover = useMemo(() => [...mergedSignals].sort((left, right) => Math.abs(right.dayChange) - Math.abs(left.dayChange))[0] ?? null, [mergedSignals]);

  if (loading && !data) {
    return (
      <div className="workspace-card p-6">
        <div className="flex items-center gap-2">
          <LineChart className="size-4 animate-pulse text-indigo-300" />
          <p className="text-sm text-foreground">{copy(language, "Momentum akisi yukleniyor...", "Loading momentum flow...")}</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="workspace-card p-6">
        <div className="flex items-center gap-2 text-rose-300">
          <TrendingDown className="size-4" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const snapshotTimestampLabel = formatTimestamp(data.timestamp, language);
  const liveTimestampLabel = formatTimestamp(liveScanTime || data.pipeline?.lastSyncedAt || undefined, language);
  const progressPct = scanProgress.total > 0 ? Math.min(100, Math.round((scanProgress.scanned / scanProgress.total) * 100)) : 0;
  const positiveCount = stats.strongBuy + stats.buy;
  const negativeCount = stats.sell + stats.strongSell;
  const totalSignals = Math.max(mergedSignals.length, 1);
  const positiveRatio = Math.round((positiveCount / totalSignals) * 100);
  const neutralRatio = Math.round((neutralCount / totalSignals) * 100);
  const negativeRatio = Math.max(0, 100 - positiveRatio - neutralRatio);
  const strongestPositive = positiveSignals[0] ?? null;
  const strongestNegative = negativeSignals[0] ?? null;
  const featuredShift = orderedChangedSignals[0] ?? null;
  const visiblePositiveSignals = surfaceMode === "overview" ? positiveSignals.slice(0, MAX_OVERVIEW_SIGNALS) : positiveSignals;
  const visibleNegativeSignals = surfaceMode === "overview" ? negativeSignals.slice(0, MAX_OVERVIEW_SIGNALS) : negativeSignals;
  const visibleChangedSignals = surfaceMode === "overview" ? orderedChangedSignals.slice(0, MAX_OVERVIEW_SHIFTS) : orderedChangedSignals;
  const showPositiveSection = surfaceMode === "overview" || surfaceMode === "positive";
  const showNegativeSection = surfaceMode === "overview" || surfaceMode === "negative";
  const showShiftSection = surfaceMode === "overview" || surfaceMode === "shifts";
  const balanceHeadline =
    positiveCount > negativeCount
      ? copy(language, "Akis yukari yone egimli", "Flow is tilted to the upside")
      : negativeCount > positiveCount
        ? copy(language, "Asagi baski agir basiyor", "Downside pressure is in control")
        : copy(language, "Momentum dengede", "Momentum is balanced");
  const balanceDescription =
    positiveCount > negativeCount
      ? copy(language, "Pozitif tarafta daha fazla lider var; canli motor buy tarafini one cikariyor.", "There are more leaders on the positive side, and the live engine is favoring buy setups.")
      : negativeCount > positiveCount
        ? copy(language, "Negatif tarafta daha fazla bozulma var; risk yuzeyi kalinlasiyor.", "More names are deteriorating on the negative side, and the risk surface is thickening.")
        : copy(language, "Liste simdilik daginik; liderleri ve bozulmalari secmek daha onemli.", "The list is mixed for now, so isolating leaders and breakdowns matters more.");
  const viewButtons: Array<{ id: SurfaceMode; label: string; count: number; icon: typeof TrendingUp }> = [
    { id: "overview", label: copy(language, "Komuta gorunumu", "Command view"), count: mergedSignals.length, icon: BarChart3 },
    { id: "positive", label: copy(language, "Liderler", "Leaders"), count: positiveSignals.length, icon: TrendingUp },
    { id: "negative", label: copy(language, "Riskler", "Risks"), count: negativeSignals.length, icon: TrendingDown },
    { id: "shifts", label: copy(language, "Degisimler", "Shifts"), count: orderedChangedSignals.length, icon: ArrowRightLeft },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-[1.6rem] border border-border bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_26%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(17,24,39,0.98))] p-4 shadow-[0_24px_80px_rgba(3,7,18,0.34)] md:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-indigo-300" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-200">
                {copy(language, "Momentum komuta katmani", "Momentum command layer")}
              </p>
            </div>
            <h3 className="heading-condensed text-3xl text-foreground md:text-[2rem]">{balanceHeadline}</h3>
            <p className="max-w-3xl text-sm leading-7 text-foreground/90">
              {copy(language, "Bu yuzey once snapshot'i ceker, sonra ayni evreni canli scanner ile yeniden tartar. Ust katman sana aninda piyasa dengesini, alt katman ise liderleri, bozulmalari ve sinyal kaymalarini verir.", "This surface first pulls the snapshot, then re-weighs the same universe through the live scanner. The upper layer gives you the market balance at a glance, while the lower layer surfaces leaders, breakdowns, and signal shifts.")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => void loadSnapshot()} disabled={snapshotRefreshing} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background/70 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-60">
              {snapshotRefreshing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              {copy(language, "Kaynagi yenile", "Refresh source")}
            </button>
            <button type="button" onClick={() => void runLiveRefresh(data.signals.map((signal) => signal.symbol))} disabled={liveLoading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-400/30 bg-indigo-500/12 px-4 py-2 text-sm font-semibold text-indigo-100 transition-colors hover:bg-indigo-500/18 disabled:cursor-not-allowed disabled:opacity-60">
              {liveLoading ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
              {copy(language, "Canli yeniden tara", "Run live rescore")}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          <span className="rounded-full border border-border bg-background/70 px-3 py-1">Snapshot: {snapshotTimestampLabel}</span>
          <span className="rounded-full border border-border bg-background/70 px-3 py-1">{copy(language, "Canli update", "Live update")}: {liveTimestampLabel}</span>
          <span className={`rounded-full border px-3 py-1 ${pipelineStatusClass(data.pipeline?.status || "idle")}`}>{copy(language, "Pipeline", "Pipeline")}: {pipelineStatusLabel(data.pipeline?.status || "idle", language)}</span>
          <span className="rounded-full border border-border bg-background/70 px-3 py-1">{liveCoverageCount}/{data.symbol_count} {copy(language, "sembol tarandi", "symbols scanned")}</span>
          <span className="rounded-full border border-border bg-background/70 px-3 py-1">{orderedChangedSignals.length} {copy(language, "sinyal degisti", "signals changed")}</span>
          {data.pipeline?.pollIntervalMs ? <span className="rounded-full border border-border bg-background/70 px-3 py-1">{copy(language, "Cekim araligi", "Poll interval")}: {Math.round(data.pipeline.pollIntervalMs / 1000)}s</span> : null}
        </div>

        {liveLoading ? (
          <div className="mt-4 space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-background/80">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">
              {scanProgress.current ? `${scanProgress.current} ${copy(language, "icin canli skor uretiliyor.", "is being rescored live.")}` : copy(language, "Momentum evreni canli yeniden skorlanuyor.", "The momentum universe is being rescored live.")}
            </p>
          </div>
        ) : null}

        {error ? <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}
        {liveError ? <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{liveError}</div> : null}

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="rounded-[1.35rem] border border-border bg-background/38 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{copy(language, "Akis haritasi", "Flow map")}</p>
                <p className="mt-1 text-sm text-foreground/90">{balanceDescription}</p>
              </div>
              <div className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] text-muted-foreground">
                {copy(language, "Mod", "Mode")}: <span className="data-mono">{data.mode}</span>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-full border border-border bg-background/70">
              <div className="flex h-3 w-full">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${positiveRatio}%` }} />
                <div className="bg-gradient-to-r from-amber-400 to-yellow-300" style={{ width: `${neutralRatio}%` }} />
                <div className="bg-gradient-to-r from-rose-500 to-orange-400" style={{ width: `${negativeRatio}%` }} />
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300/80">{copy(language, "Pozitif", "Positive")}</p>
                <p className="heading-condensed mt-1 text-2xl text-emerald-100">{positiveCount}</p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300/80">{copy(language, "Notr", "Neutral")}</p>
                <p className="heading-condensed mt-1 text-2xl text-amber-100">{neutralCount}</p>
              </div>
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-300/80">{copy(language, "Negatif", "Negative")}</p>
                <p className="heading-condensed mt-1 text-2xl text-rose-100">{negativeCount}</p>
              </div>
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-200">{copy(language, "Kaymalar", "Shifts")}</p>
                <p className="heading-condensed mt-1 text-2xl text-indigo-100">{orderedChangedSignals.length}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <button type="button" onClick={() => setSurfaceMode("positive")} className="rounded-[1.25rem] border border-emerald-500/22 bg-emerald-500/[0.08] p-4 text-left transition-colors hover:bg-emerald-500/[0.12]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">{copy(language, "Oncu uzun taraf", "Lead long setup")}</p>
              {strongestPositive ? (
                <>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <h4 className="heading-condensed text-2xl text-emerald-100">{strongestPositive.symbol}</h4>
                    <span className="data-mono text-sm text-emerald-200">{formatPct(strongestPositive.dayChange)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-emerald-50/88">{strongestPositive.headline}</p>
                </>
              ) : <p className="mt-2 text-sm text-emerald-50/80">{copy(language, "Su an net bir lider yok.", "There is no clear leader right now.")}</p>}
            </button>

            <button type="button" onClick={() => setSurfaceMode("negative")} className="rounded-[1.25rem] border border-rose-500/22 bg-rose-500/[0.08] p-4 text-left transition-colors hover:bg-rose-500/[0.12]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-300/80">{copy(language, "Oncu kisa taraf", "Lead short setup")}</p>
              {strongestNegative ? (
                <>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <h4 className="heading-condensed text-2xl text-rose-100">{strongestNegative.symbol}</h4>
                    <span className="data-mono text-sm text-rose-200">{formatPct(strongestNegative.dayChange)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-rose-50/88">{strongestNegative.headline}</p>
                </>
              ) : <p className="mt-2 text-sm text-rose-50/80">{copy(language, "Su an net bir bozulma lideri yok.", "There is no clear breakdown leader right now.")}</p>}
            </button>

            <button type="button" onClick={() => setSurfaceMode(featuredShift ? "shifts" : "overview")} className="rounded-[1.25rem] border border-indigo-500/22 bg-indigo-500/[0.08] p-4 text-left transition-colors hover:bg-indigo-500/[0.12]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-200">
                {featuredShift ? copy(language, "Canli revizyon", "Live revision") : copy(language, "Hizli hareket", "Fast move")}
              </p>
              {featuredShift ? (
                <>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <h4 className="heading-condensed text-2xl text-indigo-100">{featuredShift.symbol}</h4>
                    <span className="text-[11px] text-indigo-100">{signalLabel(featuredShift.signal, language)} - {signalLabel(featuredShift.resolvedSignal, language)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-indigo-50/88">{featuredShift.headline}</p>
                </>
              ) : biggestMover ? (
                <>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <h4 className="heading-condensed text-2xl text-indigo-100">{biggestMover.symbol}</h4>
                    <span className={`data-mono text-sm ${pctClass(biggestMover.dayChange)}`}>{formatPct(biggestMover.dayChange)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-indigo-50/88">{copy(language, "Canli sinyal kaymasi yoksa gun ici en sert hareketi burada sabitliyoruz.", "When there is no live signal shift, we pin the sharpest intraday move here.")}</p>
                </>
              ) : null}
            </button>
          </div>
        </div>
      </div>

      <div className="sticky top-4 z-10 rounded-[1.25rem] border border-border bg-background/75 p-1.5 shadow-[0_18px_48px_rgba(3,7,18,0.24)] backdrop-blur">
        <div className="flex flex-wrap items-center gap-1.5">
          {viewButtons.map((button) => {
            const active = surfaceMode === button.id;
            const Icon = button.icon;

            return (
              <button key={button.id} type="button" onClick={() => setSurfaceMode(button.id)} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${active ? "bg-indigo-500/18 text-indigo-100 shadow-[0_0_0_1px_rgba(99,102,241,0.18)]" : "text-muted-foreground hover:bg-background/70 hover:text-foreground"}`}>
                <Icon className="size-3.5" />
                {button.label}
                <span className="data-mono rounded-full bg-background/60 px-1.5 py-0.5 text-[10px]">{button.count}</span>
              </button>
            );
          })}

          <div className="ml-auto flex items-center gap-2 rounded-xl border border-border bg-background/55 px-3 py-2 text-[11px] text-muted-foreground">
            <Clock className="size-3.5" />
            {copy(language, "Otomatik cekim", "Auto pull")}: <span className="data-mono">{Math.round((data.pipeline?.pollIntervalMs || SNAPSHOT_REFRESH_INTERVAL_MS) / 1000)}s</span>
          </div>
        </div>
      </div>

      {showShiftSection ? (
        <section className="rounded-[1.4rem] border border-indigo-400/18 bg-[linear-gradient(180deg,rgba(99,102,241,0.10),rgba(15,23,42,0.86))] p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="size-4 text-indigo-200" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-200">{copy(language, "Sinyal kaymalari", "Signal shifts")}</p>
              </div>
              <h3 className="heading-condensed text-2xl text-indigo-50">{copy(language, "Canli motorun revize ettigi isimler", "Names revised by the live engine")}</h3>
              <p className="max-w-3xl text-sm leading-7 text-indigo-50/78">
                {copy(language, "Snapshot ile canli motor ayni yone bakmiyorsa, once bu blok okunmali. Burasi en kritik rejim degisimlerini biriktirir.", "If the snapshot and the live engine disagree, this block should be read first. It collects the most important regime shifts.")}
              </p>
            </div>

            {surfaceMode === "overview" && orderedChangedSignals.length > MAX_OVERVIEW_SHIFTS ? (
              <button type="button" onClick={() => setSurfaceMode("shifts")} className="inline-flex items-center gap-2 rounded-lg border border-indigo-400/20 bg-background/35 px-3 py-2 text-xs font-semibold text-indigo-100 transition-colors hover:bg-background/50">
                {copy(language, "Tum kaymalari ac", "Open all shifts")}
              </button>
            ) : null}
          </div>

          {visibleChangedSignals.length > 0 ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleChangedSignals.map((signal) => (
                <div key={signal.symbol} className="rounded-2xl border border-indigo-400/18 bg-background/35 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="heading-condensed text-xl text-indigo-50">{signal.symbol}</p>
                      <p className="mt-1 text-xs text-indigo-50/72">{signal.headline}</p>
                    </div>
                    <ArrowRightLeft className="size-4 text-indigo-200" />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                    <span className="rounded-full border border-border bg-background/55 px-2.5 py-1 text-muted-foreground">{copy(language, "Snapshot", "Snapshot")}: {signalLabel(signal.signal, language)}</span>
                    <span className="rounded-full border border-indigo-400/18 bg-indigo-500/10 px-2.5 py-1 text-indigo-100">{copy(language, "Canli", "Live")}: {signalLabel(signal.resolvedSignal, language)}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                    <span className={`data-mono rounded-full border border-border bg-background/55 px-2.5 py-1 ${pctClass(signal.dayChange)}`}>{copy(language, "Gunluk", "Daily")}: {formatPct(signal.dayChange)}</span>
                    {signal.live ? <span className="data-mono rounded-full border border-border bg-background/55 px-2.5 py-1 text-muted-foreground">Bull {signal.live.bullScore} / Bear {signal.live.bearScore}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-indigo-400/18 bg-background/30 p-6 text-sm text-indigo-50/78">
              {copy(language, "Su an snapshot ile canli motor ayni yone bakiyor; dikkat edilmesi gereken acik bir sinyal kaymasi yok.", "The snapshot and the live engine are aligned right now, so there is no meaningful signal shift to escalate.")}
            </div>
          )}
        </section>
      ) : null}

      <div className={`grid gap-5 ${showPositiveSection && showNegativeSection ? "xl:grid-cols-2" : ""}`}>
        {showPositiveSection ? (
          <section className="space-y-4">
            <div className="flex items-start justify-between gap-4 rounded-[1.4rem] border border-emerald-500/20 bg-[linear-gradient(180deg,rgba(16,185,129,0.10),rgba(15,23,42,0.86))] p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="mt-0.5 size-5 text-emerald-300" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">{copy(language, "Pozitif momentum", "Positive momentum")}</p>
                  <h3 className="mt-1 heading-condensed text-2xl text-emerald-100">{copy(language, "Yukari yone guclu isimler", "Upside leaders")}</h3>
                  <p className="mt-2 text-sm leading-7 text-emerald-50/85">
                    {copy(language, "Al ve guclu al sinyalleri burada konviksiyon, haftalik ivme ve aylik devam gucu ile siralanir.", "Buy and strong buy names are ranked here by conviction, weekly acceleration, and monthly continuation strength.")}
                  </p>
                </div>
              </div>
              <div className="rounded-full border border-emerald-500/18 bg-background/35 px-3 py-1 text-[11px] text-emerald-100">{positiveSignals.length} {copy(language, "isim", "names")}</div>
            </div>

            {visiblePositiveSignals.length > 0 ? visiblePositiveSignals.map((signal) => (
              <MomentumSignalCard key={signal.symbol} language={language} signal={signal} snapshotTimestamp={data.timestamp} />
            )) : (
              <div className="rounded-2xl border border-dashed border-border bg-background/35 p-6 text-sm text-muted-foreground">{copy(language, "Su an pozitif momentum listesine giren isim yok.", "There are no names in the positive momentum list right now.")}</div>
            )}

            {surfaceMode === "overview" && positiveSignals.length > MAX_OVERVIEW_SIGNALS ? (
              <button type="button" onClick={() => setSurfaceMode("positive")} className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/18 bg-emerald-500/[0.08] px-3 py-2 text-xs font-semibold text-emerald-100 transition-colors hover:bg-emerald-500/[0.12]">
                {copy(language, "Tum pozitif listeyi ac", "Open the full positive list")}
              </button>
            ) : null}
          </section>
        ) : null}

        {showNegativeSection ? (
          <section className="space-y-4">
            <div className="flex items-start justify-between gap-4 rounded-[1.4rem] border border-rose-500/20 bg-[linear-gradient(180deg,rgba(244,63,94,0.10),rgba(15,23,42,0.86))] p-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 size-5 text-rose-300" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-300/80">{copy(language, "Negatif momentum", "Negative momentum")}</p>
                  <h3 className="mt-1 heading-condensed text-2xl text-rose-100">{copy(language, "Asagi yone baski altindaki isimler", "Names under downside pressure")}</h3>
                  <p className="mt-2 text-sm leading-7 text-rose-50/85">
                    {copy(language, "Sat ve guclu sat sinyalleri burada canli bear skoru, kisa vade zayiflik ve trend bozulmasi ile one cikar.", "Sell and strong sell names stand out here through live bear score, short-term weakness, and broader trend deterioration.")}
                  </p>
                </div>
              </div>
              <div className="rounded-full border border-rose-500/18 bg-background/35 px-3 py-1 text-[11px] text-rose-100">{negativeSignals.length} {copy(language, "isim", "names")}</div>
            </div>

            {visibleNegativeSignals.length > 0 ? visibleNegativeSignals.map((signal) => (
              <MomentumSignalCard key={signal.symbol} language={language} signal={signal} snapshotTimestamp={data.timestamp} />
            )) : (
              <div className="rounded-2xl border border-dashed border-border bg-background/35 p-6 text-sm text-muted-foreground">{copy(language, "Su an negatif momentum listesine giren isim yok.", "There are no names in the negative momentum list right now.")}</div>
            )}

            {surfaceMode === "overview" && negativeSignals.length > MAX_OVERVIEW_SIGNALS ? (
              <button type="button" onClick={() => setSurfaceMode("negative")} className="inline-flex items-center gap-2 rounded-lg border border-rose-500/18 bg-rose-500/[0.08] px-3 py-2 text-xs font-semibold text-rose-100 transition-colors hover:bg-rose-500/[0.12]">
                {copy(language, "Tum negatif listeyi ac", "Open the full negative list")}
              </button>
            ) : null}
          </section>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Clock className="size-3.5" />
        <span className="data-mono">{snapshotTimestampLabel} - {data.mode} mode - {data.successful}/{data.symbol_count} {copy(language, "sembol", "symbols")}</span>
        {data.pipeline?.resolvedSourceFile ? <span className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px]">{copy(language, "Kaynak", "Source")}: {data.pipeline.resolvedSourceFile}</span> : null}
      </div>
    </div>
  );
}
