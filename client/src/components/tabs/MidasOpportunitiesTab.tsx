import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowRightLeft,
  ArrowUp,
  BarChart3,
  Clock,
  Filter,
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
  MidasSignalRecord,
  MidasSignalsData,
} from "@shared/midasSignals";
import { runMomentumScan, type StockResult } from "@/scanner";
import { copy, type AppLanguage } from "@/lib/i18n";

type SignalDirection = "positive" | "negative" | "neutral";
type SurfaceMode = "overview" | "positive" | "negative" | "shifts";

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
  dataQuality?: StockResult["dataQuality"];
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

function signalLabel(signal: ActionSignal, language: AppLanguage) {
  switch (signal) {
    case "STRONG_BUY":
      return copy(language, "GÜÇLÜ AL", "STRONG BUY");
    case "BUY":
      return copy(language, "AL", "BUY");
    case "SELL":
      return copy(language, "SAT", "SELL");
    case "STRONG_SELL":
      return copy(language, "GÜÇLÜ SAT", "STRONG SELL");
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
      return copy(language, "NÖTR-POZİTİF", "NEUTRAL-BULLISH");
    case "NEUTRAL":
      return copy(language, "NÖTR", "NEUTRAL");
    case "NEUTRAL_BEARISH":
      return copy(language, "NÖTR-NEGATİF", "NEUTRAL-BEARISH");
    case "WEAK":
      return copy(language, "ZAYIF", "WEAK");
    case "CAUTION_HOT":
      return copy(language, "SICAK BÖLGE", "HOT ZONE");
    case "OVERBOUGHT_RED":
      return copy(language, "AŞIRI ALIM", "OVERBOUGHT");
    case "OVERSOLD_CAUTION":
      return copy(language, "AŞIRI SATIM", "OVERSOLD");
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

function deriveStats(signals: Array<{ resolvedSignal: ActionSignal }>) {
  return {
    strongBuy: signals.filter((item) => item.resolvedSignal === "STRONG_BUY").length,
    buy: signals.filter((item) => item.resolvedSignal === "BUY").length,
    hold: signals.filter((item) => item.resolvedSignal === "HOLD").length,
    sell: signals.filter((item) => item.resolvedSignal === "SELL").length,
    strongSell: signals.filter((item) => item.resolvedSignal === "STRONG_SELL").length,
  };
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getDirectionalBias(signal: ActionSignal): SignalDirection {
  if (signal === "STRONG_BUY" || signal === "BUY") {
    return "positive";
  }

  if (signal === "STRONG_SELL" || signal === "SELL") {
    return "negative";
  }

  return "neutral";
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
      return copy(
        language,
        "Canli motor sinyali yukari revize etti.",
        "The live engine upgraded the setup to the upside."
      );
    }

    if (getDirectionalBias(resolvedSignal) === "negative") {
      return copy(
        language,
        "Canli motor sinyali asagi revize etti.",
        "The live engine downgraded the setup to the downside."
      );
    }
  }

  switch (resolvedSignal) {
    case "STRONG_BUY":
      return copy(
        language,
        "Trend, breadth ve hiz ayni yone bakiyor.",
        "Trend, breadth, and velocity are aligned higher."
      );
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
      reasons.push(
        copy(
          language,
          `Canli motor bull ${live.bullScore} / bear ${live.bearScore} uretiyor.`,
          `The live engine prints bull ${live.bullScore} versus bear ${live.bearScore}.`
        )
      );
    } else if (direction === "negative") {
      reasons.push(
        copy(
          language,
          `Canli motor bear ${live.bearScore} / bull ${live.bullScore} uretiyor.`,
          `The live engine prints bear ${live.bearScore} versus bull ${live.bullScore}.`
        )
      );
    }

    if (live.volumeRatio >= 1.25) {
      reasons.push(
        copy(
          language,
          `Hacim destegi RVOL ${live.volumeRatio.toFixed(2)}x seviyesinde.`,
          `Volume support is running at ${live.volumeRatio.toFixed(2)}x RVOL.`
        )
      );
    }

    if (direction === "positive" && live.rsi >= 58) {
      reasons.push(
        copy(
          language,
          `RSI ${live.rsi.toFixed(1)} ile yukari momentum teyitli.`,
          `RSI at ${live.rsi.toFixed(1)} confirms upside momentum.`
        )
      );
    }

    if (direction === "negative" && live.rsi <= 45) {
      reasons.push(
        copy(
          language,
          `RSI ${live.rsi.toFixed(1)} ile zayiflik teyit ediliyor.`,
          `RSI at ${live.rsi.toFixed(1)} confirms the weakness.`
        )
      );
    }
  }

  if (direction === "positive") {
    if (dayChange > 0) {
      reasons.push(
        copy(language, `Gunluk akis ${formatPct(dayChange)} ile pozitif.`, `Daily flow is positive at ${formatPct(dayChange)}.`)
      );
    }

    if (signal.weekly_pct > 0) {
      reasons.push(
        copy(language, `Haftalik momentum ${formatPct(signal.weekly_pct)} seviyesinde.`, `Weekly momentum is running at ${formatPct(signal.weekly_pct)}.`)
      );
    }

    if (signal.monthly_pct > 0) {
      reasons.push(
        copy(language, `Aylik ivme ${formatPct(signal.monthly_pct)} ile destek veriyor.`, `Monthly acceleration supports the move at ${formatPct(signal.monthly_pct)}.`)
      );
    }
  }

  if (direction === "negative") {
    if (dayChange < 0) {
      reasons.push(
        copy(language, `Gunluk akis ${formatPct(dayChange)} ile asagi yone egiliyor.`, `Daily flow is leaning lower at ${formatPct(dayChange)}.`)
      );
    }

    if (signal.weekly_pct < 0) {
      reasons.push(
        copy(language, `Haftalik momentum ${formatPct(signal.weekly_pct)} ile zayif.`, `Weekly momentum is weak at ${formatPct(signal.weekly_pct)}.`)
      );
    }

    if (signal.monthly_pct < 0) {
      reasons.push(
        copy(language, `Aylik trend ${formatPct(signal.monthly_pct)} ile bozuluyor.`, `The monthly trend is deteriorating at ${formatPct(signal.monthly_pct)}.`)
      );
    }
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
  const priceChangeScore =
    stock.priceChangePct < 0 ? Math.min(Math.abs(stock.priceChangePct) * 18, 100) : 0;
  const vwapScore =
    stock.currentPrice < stock.vwap
      ? Math.min((Math.abs(stock.vwapDeviation) / Math.max(stock.atr14d, 0.01)) * 25, 100)
      : 0;
  const structureScore = Math.max(0, Math.min(100, 100 - stock.structureScore));
  const volumeScore =
    stock.volumeRatio >= 1.25 && stock.priceChangePct < 0
      ? Math.min(stock.volumeRatio * 28, 100)
      : Math.min(stock.volumeRatio * 10, 40);
  const weaknessScore =
    stock.signal === "WEAK"
      ? 85
      : stock.signal === "NEUTRAL_BEARISH"
        ? 70
        : stock.signal === "OVERBOUGHT_RED"
          ? 65
          : stock.signal === "CAUTION_HOT"
            ? 35
            : 0;
  const intradayScore =
    stock.currentPrice < stock.openPrice
      ? Math.min(((stock.openPrice - stock.currentPrice) / Math.max(stock.atr14d, 0.01)) * 20, 100)
      : 0;
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
    dataQuality: stock.dataQuality,
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
    <article className={`rounded-xl border p-4 shadow-[0_18px_48px_rgba(3,7,18,0.22)] transition-transform duration-200 hover:-translate-y-0.5 ${toneClass}`}>
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
            <span className="data-mono rounded-full border border-border bg-background/60 px-2.5 py-1">
              {formatPrice(currentPrice)}
            </span>
            {signal.live ? (
              <span className="rounded-full border border-border bg-background/60 px-2.5 py-1">
                {copy(language, "Scanner", "Scanner")}:{" "}
                {scannerSignalLabel(signal.live.scannerSignal, language)}
              </span>
            ) : null}
          </div>
        </div>

        <span
          className={`shrink-0 rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${signalBadgeClass(
            signal.resolvedSignal
          )}`}
        >
          {signalLabel(signal.resolvedSignal, language)}
        </span>
      </div>

      {(signal.setup_type || signal.direction || signal.conviction_tier) ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {signal.setup_type ? (
            <span className="rounded-full border border-sky-400/25 bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-200">
              {signal.setup_type}
            </span>
          ) : null}
          {signal.direction ? (
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
              signal.direction === 'LONG'
                ? 'border-emerald-400/25 bg-emerald-500/10 text-emerald-300'
                : 'border-rose-400/25 bg-rose-500/10 text-rose-300'
            }`}>
              {signal.direction === 'LONG' ? copy(language, "↑ LONG", "↑ LONG") : copy(language, "↓ SHORT", "↓ SHORT")}
            </span>
          ) : null}
          {signal.conviction_tier ? (
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
              signal.conviction_tier === 'A+' ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300' :
              signal.conviction_tier === 'A' ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-200' :
              signal.conviction_tier === 'B' ? 'border-amber-400/25 bg-amber-500/10 text-amber-300' :
              signal.conviction_tier === 'C' ? 'border-orange-400/25 bg-orange-500/10 text-orange-300' :
              'border-rose-400/25 bg-rose-500/10 text-rose-300'
            }`}>
              {signal.conviction_tier}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>{copy(language, "Momentum gucu", "Momentum conviction")}</span>
          <span className="data-mono text-foreground/85">{convictionWidth}/100</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-background/75">
          <div
            className={`h-full rounded-full transition-all duration-300 ${meterClass}`}
            style={{ width: `${convictionWidth}%` }}
          />
        </div>
      </div>

      {typeof signal.apex_score === 'number' ? (
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <span>{copy(language, "Apex Skoru", "Apex Score")}</span>
            <span className="data-mono text-foreground/85">{signal.apex_score}/100</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-background/75">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                signal.apex_score >= 60
                  ? 'bg-emerald-400'
                  : signal.apex_score >= 40
                  ? 'bg-amber-400'
                  : 'bg-rose-400'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, signal.apex_score))}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
        <span className={`data-mono rounded-full border border-border bg-background/70 px-2.5 py-1 ${pctClass(currentDayPct)}`}>
          {copy(language, "Gunluk", "Daily")}: {formatPct(currentDayPct)}
        </span>
        <span className={`data-mono rounded-full border border-border bg-background/70 px-2.5 py-1 ${pctClass(signal.weekly_pct)}`}>
          {copy(language, "Haftalik", "Weekly")}: {formatPct(signal.weekly_pct)}
        </span>
        <span className={`data-mono rounded-full border border-border bg-background/70 px-2.5 py-1 ${pctClass(signal.monthly_pct)}`}>
          {copy(language, "Aylik", "Monthly")}: {formatPct(signal.monthly_pct)}
        </span>
        <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-muted-foreground">
          {copy(language, "Konviksiyon", "Conviction")}: {Math.round(signal.conviction)}
        </span>
        {signal.live ? (
          <span className="data-mono rounded-full border border-border bg-background/70 px-2.5 py-1 text-muted-foreground">
            Bull {signal.live.bullScore} / Bear {signal.live.bearScore}
          </span>
        ) : null}
      </div>

      {signalChanged ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-sky-400/20 bg-sky-500/10 px-3 py-2 text-[11px] text-sky-100">
          <ArrowRightLeft className="size-3.5" />
          <span>
            {copy(language, "Snapshot", "Snapshot")} {signalLabel(signal.signal, language)} -{" "}
            {copy(language, "Canli", "Live")} {signalLabel(signal.resolvedSignal, language)}
          </span>
        </div>
      ) : null}

      <div className="mt-4 space-y-2">
        {signal.reasonDetails.map(reason => (
          <div
            key={reason}
            className="rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-xs leading-6 text-foreground/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
          >
            {reason}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {signal.setup_type ? (
          <span className="rounded-full border border-sky-400/25 bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-200">
            {signal.setup_type}
          </span>
        ) : null}
        {signal.direction ? (
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
            signal.direction === 'LONG'
              ? 'border-emerald-400/25 bg-emerald-500/10 text-emerald-300'
              : 'border-rose-400/25 bg-rose-500/10 text-rose-300'
          }`}>
            {signal.direction === 'LONG' ? '↑ LONG' : '↓ SHORT'}
          </span>
        ) : null}
        {signal.conviction_tier ? (
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
            signal.conviction_tier === 'A+' ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300' :
            signal.conviction_tier === 'A' ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-200' :
            signal.conviction_tier === 'B' ? 'border-amber-400/25 bg-amber-500/10 text-amber-300' :
            signal.conviction_tier === 'C' ? 'border-orange-400/25 bg-orange-500/10 text-orange-300' :
            'border-rose-400/25 bg-rose-500/10 text-rose-300'
          }`}>
            {signal.conviction_tier}
          </span>
        ) : null}
        {signal.signals.slice(0, 4).map(tag => (
          <span
            key={tag}
            className="rounded-full border border-border bg-background/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {signal.factor_breakdown ? (
        <div className="mt-4 space-y-1.5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{copy(language, "Faktor Dagilimi", "Factor Breakdown")}</p>
          {[
            { key: 'f1_momentum_quality', label: copy(language, 'F1', 'F1') },
            { key: 'f2_relative_strength', label: copy(language, 'F2', 'F2') },
            { key: 'f3_volume_liquidity', label: copy(language, 'F3', 'F3') },
            { key: 'f4_technical_structure', label: copy(language, 'F4', 'F4') },
            { key: 'f5_volatility_regime', label: copy(language, 'F5', 'F5') },
            { key: 'f6_catalyst_flow', label: copy(language, 'F6', 'F6') },
          ].map((f) => {
            const score = (signal.factor_breakdown as Record<string, number>)[f.key] ?? 0;
            return (
              <div key={f.key} className="flex items-center gap-2">
                <span className="w-5 text-[10px] font-medium text-muted-foreground">{f.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background/75">
                  <div
                    className="h-full rounded-full bg-sky-400"
                    style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
                  />
                </div>
                <span className="w-6 text-right text-[10px] data-mono text-foreground/80">{Math.round(score)}</span>
              </div>
            );
          })}
        </div>
      ) : null}

      {signal.trade_plan ? (
        <div className="mt-4 rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-[11px]">
          <p className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{copy(language, "Trade Plan", "Trade Plan")}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <span>{copy(language, "Giris:", "Entry:")} {formatPrice(signal.trade_plan.entry)}</span>
            <span className="text-rose-300">{copy(language, "Stop:", "Stop:")} {formatPrice(signal.trade_plan.stop)}</span>
            <span className="text-emerald-300">{copy(language, "T1:", "T1:")} {formatPrice(signal.trade_plan.target1)}</span>
            <span className="text-emerald-300">{copy(language, "T2:", "T2:")} {formatPrice(signal.trade_plan.target2)}</span>
            <span>{copy(language, "RR:", "RR:")} {signal.trade_plan.rr_ratio.toFixed(1)}</span>
            <span>{copy(language, "Stop%:", "Stop%:")} {signal.trade_plan.stop_pct.toFixed(1)}%</span>
          </div>
        </div>
      ) : null}

      {signal.position_sizing && signal.position_sizing.shares > 0 ? (
        <div className="mt-4 rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-[11px]">
          <p className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{copy(language, "Pozisyon Buyuklugu", "Position Sizing")}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <span>{copy(language, "Adet:", "Shares:")} {signal.position_sizing.shares}</span>
            <span>{copy(language, "Pozisyon:", "Position:")} ${signal.position_sizing.position_value.toLocaleString()}</span>
            <span>{copy(language, "Risk:", "Risk:")} ${signal.position_sizing.dollar_risk.toFixed(0)} ({signal.position_sizing.risk_pct_of_account.toFixed(1)}%)</span>
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
              signal.position_sizing.kelly_fraction >= 0.25 ? 'bg-emerald-500/20 text-emerald-300' :
              signal.position_sizing.kelly_fraction >= 0.15 ? 'bg-amber-500/20 text-amber-300' :
              'bg-rose-500/20 text-rose-300'
            }`}>
              {copy(language, "Kelly:", "Kelly:")} {(signal.position_sizing.kelly_fraction * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
        <span>
          {copy(language, "Snapshot", "Snapshot")}:{" "}
          {formatTimestamp(signal.timestamp || snapshotTimestamp, language)}
        </span>
        {signal.live ? (
          <span>
            {copy(language, "Canli", "Live")}: {formatTimestamp(signal.live.updatedAt, language)}
          </span>
        ) : null}
      </div>
    </article>
  );
}

export default function MidasOpportunitiesTab({
  language = "tr",
}: {
  language?: AppLanguage;
}) {
  const [data, setData] = useState<MidasSignalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [snapshotRefreshing, setSnapshotRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [liveSignals, setLiveSignals] = useState<Record<string, LiveSignalSummary>>({});
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveScanTime, setLiveScanTime] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState<ScanProgressState>({
    scanned: 0,
    total: 0,
    current: "",
  });
  const autoScanRef = useRef(false);
  const liveRunRef = useRef(0);
  const lastAutoScanKeyRef = useRef("");

  const loadSnapshot = useCallback(
    async (silent = false) => {
      if (!silent) {
        if (data) {
          setSnapshotRefreshing(true);
        } else {
          setLoading(true);
        }
      }

      try {
        const response = await fetch("/api/midas/signals", {
          credentials: "include",
          cache: "no-store",
        });
        if (!response.ok) {
          const payload =
            ((await response.json().catch(() => null)) as { error?: string } | null) ||
            null;
          throw new Error(payload?.error || `HTTP ${response.status}`);
        }

        const json = (await response.json()) as MidasSignalsData;
        setData(json);
        setError(null);
      } catch (loadError) {
        const message =
          loadError instanceof Error && loadError.message
            ? loadError.message
            : copy(
                language,
                "Midas sinyal verisi yuklenemedi.",
                "Failed to load Midas signal data."
              );
        setError(message);
      } finally {
        setLoading(false);
        setSnapshotRefreshing(false);
      }
    },
    [data, language]
  );

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

  const runLiveRefresh = useCallback(
    async (symbols: string[]) => {
      if (!symbols.length) return;

      const runId = liveRunRef.current + 1;
      liveRunRef.current = runId;
      setLiveLoading(true);
      setLiveError(null);
      setScanProgress({
        scanned: 0,
        total: symbols.length,
        current: "",
      });

      try {
        const response = await runMomentumScan(symbols, {
          minScore: 0,
          onProgress: (scanned, total, current) => {
            if (liveRunRef.current !== runId) return;
            setScanProgress({ scanned, total, current });
          },
        });

        if (liveRunRef.current !== runId) return;

        setLiveSignals(
          Object.fromEntries(
            response.stocks.map((stock) => [stock.ticker, deriveLiveSignal(stock)])
          )
        );
        setLiveScanTime(response.scanTime);
      } catch {
        if (liveRunRef.current !== runId) return;

        setLiveError(
          copy(
            language,
            "Canli scanner verisi uretilemedi. Snapshot gorunumu korunuyor.",
            "Live scanner data could not be produced. Snapshot view remains active."
          )
        );
      } finally {
        if (liveRunRef.current === runId) {
          setLiveLoading(false);
        }
      }
    },
    [language]
  );

  // Auto live-scan disabled: client-side CORS proxy 50-symbol fetch locks browser
  // useEffect(() => {
  //   if (!data) return;
  //   const nextKey = `${data.timestamp}:${data.symbol_count}`;
  //   if (lastAutoScanKeyRef.current === nextKey) return;
  //   lastAutoScanKeyRef.current = nextKey;
  //   autoScanRef.current = true;
  //   void runLiveRefresh(data.signals.map((signal) => signal.symbol));
  // }, [data, runLiveRefresh]);

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

  const filteredSignals = useMemo(() => {
    const sorted = [...mergedSignals].sort((left, right) => {
      const priorityGap = actionPriority(right.resolvedSignal) - actionPriority(left.resolvedSignal);
      if (priorityGap !== 0) return priorityGap;

      const convictionGap = right.conviction - left.conviction;
      if (convictionGap !== 0) return convictionGap;

      return right.dayChange - left.dayChange;
    });

    switch (filter) {
      case "buy":
        return sorted.filter(
          (item) => item.resolvedSignal === "BUY" || item.resolvedSignal === "STRONG_BUY"
        );
      case "sell":
        return sorted.filter(
          (item) => item.resolvedSignal === "SELL" || item.resolvedSignal === "STRONG_SELL"
        );
      case "top_up":
        return [...sorted].sort((a, b) => b.dayChange - a.dayChange).slice(0, 10);
      case "top_down":
        return [...sorted].sort((a, b) => a.dayChange - b.dayChange).slice(0, 10);
      default:
        return sorted;
    }
  }, [filter, mergedSignals]);

  const stats = useMemo(() => deriveStats(mergedSignals), [mergedSignals]);
  const snapshotStats = useMemo(
    () =>
      deriveStats(
        mergedSignals.map((signal) => ({
          resolvedSignal: signal.signal,
        }))
      ),
    [mergedSignals]
  );
  const changedCount = useMemo(
    () => mergedSignals.filter((signal) => signal.live && signal.live.action !== signal.signal).length,
    [mergedSignals]
  );
  const liveCoverageCount = useMemo(() => Object.keys(liveSignals).length, [liveSignals]);
  const positiveSignals = useMemo(
    () =>
      [...mergedSignals]
        .filter((signal) => signal.directionalBias === "positive")
        .sort((left, right) => {
          const actionGap = actionPriority(right.resolvedSignal) - actionPriority(left.resolvedSignal);
          if (actionGap !== 0) return actionGap;

          const convictionGap = right.conviction - left.conviction;
          if (convictionGap !== 0) return convictionGap;

          const weeklyGap = right.weekly_pct - left.weekly_pct;
          if (weeklyGap !== 0) return weeklyGap;

          return right.monthly_pct - left.monthly_pct;
        }),
    [mergedSignals]
  );
  const negativeSignals = useMemo(
    () =>
      [...mergedSignals]
        .filter((signal) => signal.directionalBias === "negative")
        .sort((left, right) => {
          const actionGap = actionPriority(right.resolvedSignal) - actionPriority(left.resolvedSignal);
          if (actionGap !== 0) return actionGap;

          const convictionGap = right.conviction - left.conviction;
          if (convictionGap !== 0) return convictionGap;

          const weeklyGap = left.weekly_pct - right.weekly_pct;
          if (weeklyGap !== 0) return weeklyGap;

          return left.monthly_pct - right.monthly_pct;
        }),
    [mergedSignals]
  );
  const neutralCount = useMemo(
    () => mergedSignals.filter((signal) => signal.directionalBias === "neutral").length,
    [mergedSignals]
  );
  const changedSignals = useMemo(
    () => mergedSignals.filter((signal) => signal.live && signal.live.action !== signal.signal),
    [mergedSignals]
  );

  if (loading && !data) {
    return (
      <div className="workspace-card p-6">
        <div className="flex items-center gap-2">
          <LineChart className="size-4 animate-pulse text-sky-300" />
          <p className="text-sm text-foreground">
            {copy(language, "Momentum akisi yukleniyor...", "Loading momentum flow...")}
          </p>
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

  const filterButtons: Array<{
    id: FilterMode;
    label: string;
    icon: typeof TrendingUp;
  }> = [
    { id: "all", label: copy(language, "Tum Sinyaller", "All Signals"), icon: BarChart3 },
    { id: "buy", label: copy(language, "Al Firsatlari", "Buy Opportunities"), icon: TrendingUp },
    { id: "sell", label: copy(language, "Sat Firsatlari", "Sell Opportunities"), icon: TrendingDown },
    { id: "top_up", label: copy(language, "Gunun Yuksekleri", "Top Gainers"), icon: ArrowUp },
    { id: "top_down", label: copy(language, "Gunun Dusukleri", "Top Losers"), icon: ArrowDown },
  ];
  const snapshotTimestampLabel = formatTimestamp(data.timestamp, language);
  const liveTimestampLabel = formatTimestamp(liveScanTime || undefined, language);
  const progressPct =
    scanProgress.total > 0
      ? Math.min(100, Math.round((scanProgress.scanned / scanProgress.total) * 100))
      : 0;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-background/45 p-4 md:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-sky-300" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
                {copy(language, "Canli momentum orkestra", "Live momentum orchestration")}
              </p>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-foreground/90">
              {copy(
                language,
                "Sayfa pipeline snapshot'ini dakikalik olarak yeniden ceker. Gelen evren daha sonra canli scanner ile tekrar skorlanir ve hisseler pozitif ya da negatif momentum yonune gore yeniden siralanir.",
                "The page re-pulls the pipeline snapshot on a rolling basis. The incoming universe is then rescored by the live scanner and ranked again by positive or negative momentum direction."
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void loadSnapshot()}
              disabled={snapshotRefreshing}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background/70 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
            >
              {snapshotRefreshing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              {copy(language, "Kaynagi yenile", "Refresh source")}
            </button>
            <button
              type="button"
              onClick={() => void runLiveRefresh(data.signals.map((signal) => signal.symbol))}
              disabled={liveLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-sky-400/30 bg-sky-500/12 px-4 py-2 text-sm font-semibold text-sky-100 transition-colors hover:bg-sky-500/18 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {liveLoading ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
              {copy(language, "Canli yeniden tara", "Run live rescore")}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          <span className="rounded-full border border-border bg-background/70 px-3 py-1">
            Snapshot: {snapshotTimestampLabel}
          </span>
          <span className="rounded-full border border-border bg-background/70 px-3 py-1">
            {copy(language, "Canli update", "Live update")}: {liveTimestampLabel}
          </span>
          <span
            className={`rounded-full border px-3 py-1 ${pipelineStatusClass(
              data.pipeline?.status || "idle"
            )}`}
          >
            {copy(language, "Pipeline", "Pipeline")}:{" "}
            {pipelineStatusLabel(data.pipeline?.status || "idle", language)}
          </span>
          <span className="rounded-full border border-border bg-background/70 px-3 py-1">
            {liveCoverageCount}/{data.symbol_count} {copy(language, "sembol tarandi", "symbols scanned")}
          </span>
          <span className="rounded-full border border-border bg-background/70 px-3 py-1">
            {changedSignals.length} {copy(language, "sinyal degisti", "signals changed")}
          </span>
          {data.pipeline?.pollIntervalMs ? (
            <span className="rounded-full border border-border bg-background/70 px-3 py-1">
              {copy(language, "Cekim araligi", "Poll interval")}:{" "}
              {Math.round(data.pipeline.pollIntervalMs / 1000)}s
            </span>
          ) : null}
        </div>

        {liveLoading ? (
          <div className="mt-4 space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-background/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-500 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {scanProgress.current
                ? `${scanProgress.current} ${copy(language, "icin canli skor uretiliyor.", "is being rescored live.")}`
                : copy(language, "Momentum evreni canli yeniden skorlanıyor.", "The momentum universe is being rescored live.")}
            </p>
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        {liveError ? (
          <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {liveError}
          </div>
        ) : null}

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300/80">
              {copy(language, "Pozitif", "Positive")}
            </p>
            <p className="heading-condensed mt-1 text-2xl text-emerald-100">
              {stats.strongBuy + stats.buy}
            </p>
          </div>
          <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-300/80">
              {copy(language, "Negatif", "Negative")}
            </p>
            <p className="heading-condensed mt-1 text-2xl text-rose-100">
              {stats.sell + stats.strongSell}
            </p>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300/80">
              {copy(language, "Notr", "Neutral")}
            </p>
            <p className="heading-condensed mt-1 text-2xl text-amber-100">{neutralCount}</p>
          </div>
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-200">
              {copy(language, "Sinyal degisenler", "Signal shifts")}
            </p>
            <p className="heading-condensed mt-1 text-2xl text-sky-100">
              {changedSignals.length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background/55 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {copy(language, "Kaynak modu", "Source mode")}
            </p>
            <p className="mt-1 text-sm text-foreground">
              {liveCoverageCount > 0
                ? copy(language, "Snapshot + canli motor", "Snapshot + live engine")
                : copy(language, "Snapshot", "Snapshot")}
            </p>
          </div>
        </div>
      </div>

      {data?.market_overview ? (
        <section className="rounded-xl border border-border/60 bg-background/55 p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="size-4 text-sky-300" />
            <p className="text-sm font-semibold text-foreground">
              {copy(language, "Genel Piyasa", "Broad Market")}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(data.market_overview).map(([ticker, info]) => {
              const change = info.change_pct;
              const changeClass = change > 0 ? "text-emerald-300" : change < 0 ? "text-rose-300" : "text-muted-foreground";
              const sign = change > 0 ? "+" : "";
              return (
                <div key={ticker} className="rounded-xl border border-border/40 bg-background/70 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {ticker}
                  </p>
                  <p className="data-mono mt-1 text-lg font-semibold text-foreground">
                    ${info.price.toFixed(2)}
                  </p>
                  <p className={`data-mono text-sm font-semibold ${changeClass}`}>
                    {sign}{change.toFixed(2)}%
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {info.name}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {changedSignals.length > 0 ? (
        <section className="rounded-xl border border-sky-400/18 bg-sky-500/10 p-4">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="size-4 text-sky-200" />
            <p className="text-sm font-semibold text-sky-100">
              {copy(language, "Canli motorun revize ettigi isimler", "Names revised by the live engine")}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {changedSignals.slice(0, 10).map((signal) => (
              <span
                key={signal.symbol}
                className="rounded-full border border-sky-400/18 bg-background/35 px-3 py-1 text-[11px] text-sky-100"
              >
                {signal.symbol}: {signalLabel(signal.signal, language)} -{" "}
                {signalLabel(signal.resolvedSignal, language)}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] p-4">
            <TrendingUp className="mt-0.5 size-5 text-emerald-300" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
                {copy(language, "Pozitif momentum", "Positive momentum")}
              </p>
              <h3 className="mt-1 heading-condensed text-2xl text-emerald-100">
                {copy(language, "Yukari yone guclu isimler", "Upside leaders")}
              </h3>
              <p className="mt-2 text-sm leading-7 text-emerald-50/85">
                {copy(
                  language,
                  "Al ve guclu al sinyalleri burada konviksiyon, haftalik ivme ve aylik devam gucu ile siralanir.",
                  "Buy and strong buy names are ranked here by conviction, weekly acceleration, and monthly continuation strength."
                )}
              </p>
            </div>
          </div>

          {positiveSignals.length > 0 ? (
            positiveSignals.map((signal) => (
              <MomentumSignalCard
                key={signal.symbol}
                language={language}
                signal={signal}
                snapshotTimestamp={data.timestamp}
              />
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-background/35 p-6 text-sm text-muted-foreground">
              {copy(
                language,
                "Su an pozitif momentum listesine giren isim yok.",
                "There are no names in the positive momentum list right now."
              )}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/[0.07] p-4">
            <ShieldAlert className="mt-0.5 size-5 text-rose-300" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-300/80">
                {copy(language, "Negatif momentum", "Negative momentum")}
              </p>
              <h3 className="mt-1 heading-condensed text-2xl text-rose-100">
                {copy(language, "Asagi yone baski altindaki isimler", "Names under downside pressure")}
              </h3>
              <p className="mt-2 text-sm leading-7 text-rose-50/85">
                {copy(
                  language,
                  "Sat ve guclu sat sinyalleri burada canli bear skoru, kisa vade zayiflik ve trend bozulmasi ile one cikar.",
                  "Sell and strong sell names stand out here through live bear score, short-term weakness, and broader trend deterioration."
                )}
              </p>
            </div>
          </div>

          {negativeSignals.length > 0 ? (
            negativeSignals.map((signal) => (
              <MomentumSignalCard
                key={signal.symbol}
                language={language}
                signal={signal}
                snapshotTimestamp={data.timestamp}
              />
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-background/35 p-6 text-sm text-muted-foreground">
              {copy(
                language,
                "Su an negatif momentum listesine giren isim yok.",
                "There are no names in the negative momentum list right now."
              )}
            </div>
          )}
        </section>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Clock className="size-3.5" />
        <span className="data-mono">
          {snapshotTimestampLabel} - {data.mode} mode - {data.successful}/{data.symbol_count}{" "}
          {copy(language, "sembol", "symbols")}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="workspace-card rounded-xl border border-border bg-background/45 p-4 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-sky-300" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
                {copy(language, "Canli Kimi Signal Engine", "Live Kimi Signal Engine")}
              </p>
            </div>
            <p className="text-sm leading-7 text-foreground/90">
              {copy(
                language,
                "Midas snapshot evreni ayni anda canli scanner motorundan geciyor. Karttaki ana AL / TUT / SAT rozeti, canli tarama geldiyse guncel sinyali; gelmediyse snapshot sinyalini gosterir.",
                "The Midas snapshot universe is rescanned through the live scanner engine. When live data is available, the main BUY / HOLD / SELL badge uses the fresh signal; otherwise it falls back to the snapshot."
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void runLiveRefresh(data.signals.map((signal) => signal.symbol))}
            disabled={liveLoading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-sky-400/30 bg-sky-500/12 px-4 py-2 text-sm font-semibold text-sky-100 transition-all hover:bg-sky-500/18 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {liveLoading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            {liveLoading
              ? copy(language, "Canli tarama calisiyor", "Running live scan")
              : copy(language, "Canli sinyalleri yenile", "Refresh live signals")}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          <span className="rounded-full border border-border bg-background/70 px-3 py-1">
            Snapshot: {snapshotTimestampLabel}
          </span>
          <span className="rounded-full border border-border bg-background/70 px-3 py-1">
            {copy(language, "Canli update", "Live update")}: {liveTimestampLabel}
          </span>
          <span className="rounded-full border border-border bg-background/70 px-3 py-1">
            {liveCoverageCount}/{data.symbol_count} {copy(language, "sembol tarandi", "symbols scanned")}
          </span>
          <span className="rounded-full border border-border bg-background/70 px-3 py-1">
            {changedCount} {copy(language, "sinyal degisti", "signals changed")}
          </span>
        </div>

        {liveLoading ? (
          <div className="mt-4 space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-background/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-500 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {scanProgress.current
                ? `${scanProgress.current} ${copy(language, "icin canli sinyal uretiliyor.", "is being scored live.")}`
                : copy(language, "Midas evreni canli taraniyor.", "Scanning the Midas universe live.")}
            </p>
          </div>
        ) : null}

        {liveError ? (
          <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {liveError}
          </div>
        ) : null}

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-border bg-background/55 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {copy(language, "Snapshot", "Snapshot")}
            </p>
            <p className="mt-1 text-sm text-foreground">
              {snapshotStats.strongBuy + snapshotStats.buy} {copy(language, "bullish", "bullish")} /{" "}
              {snapshotStats.sell + snapshotStats.strongSell} {copy(language, "bearish", "bearish")}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background/55 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {copy(language, "Canli Motor", "Live Engine")}
            </p>
            <p className="mt-1 text-sm text-foreground">
              {stats.strongBuy + stats.buy} {copy(language, "al", "buy")} / {stats.sell + stats.strongSell}{" "}
              {copy(language, "sat", "sell")}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background/55 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {copy(language, "Kaynak Modu", "Source Mode")}
            </p>
            <p className="mt-1 text-sm text-foreground">
              {liveCoverageCount > 0
                ? copy(language, "Canli + Snapshot Blend", "Live + Snapshot Blend")
                : copy(language, "Snapshot Only", "Snapshot Only")}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background/55 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {copy(language, "Tarama Kapsami", "Scan Coverage")}
            </p>
            <p className="mt-1 text-sm text-foreground">
              {data.successful}/{data.symbol_count} {copy(language, "snapshot", "snapshot")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="workspace-card flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3">
          <TrendingUp className="size-5 text-emerald-300" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300/80">
              {copy(language, "Guclu Al", "Strong Buy")}
            </p>
            <p className="heading-condensed text-2xl text-emerald-100">{stats.strongBuy}</p>
          </div>
        </div>
        <div className="workspace-card flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/8 px-4 py-3">
          <TrendingUp className="size-5 text-emerald-300/80" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300/70">
              {copy(language, "Al", "Buy")}
            </p>
            <p className="heading-condensed text-2xl text-emerald-100/90">{stats.buy}</p>
          </div>
        </div>
        <div className="workspace-card flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-400/8 px-4 py-3">
          <BarChart3 className="size-5 text-amber-300/80" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300/70">
              {copy(language, "Tut", "Hold")}
            </p>
            <p className="heading-condensed text-2xl text-amber-100/90">{stats.hold}</p>
          </div>
        </div>
        <div className="workspace-card flex items-center gap-3 rounded-xl border border-rose-400/20 bg-rose-400/8 px-4 py-3">
          <TrendingDown className="size-5 text-rose-300/80" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-300/70">
              {copy(language, "Sat", "Sell")}
            </p>
            <p className="heading-condensed text-2xl text-rose-100/90">{stats.sell}</p>
          </div>
        </div>
        <div className="workspace-card flex items-center gap-3 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3">
          <TrendingDown className="size-5 text-rose-300" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-300/80">
              {copy(language, "Guclu Sat", "Strong Sell")}
            </p>
            <p className="heading-condensed text-2xl text-rose-100">{stats.strongSell}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background/45 p-1">
        <div className="flex items-center gap-1.5 px-2 py-1.5">
          <Filter className="size-3.5 text-muted-foreground" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {copy(language, "Filtre", "Filter")}
          </span>
        </div>
        {filterButtons.map((button) => {
          const active = filter === button.id;
          return (
            <button
              key={button.id}
              type="button"
              onClick={() => setFilter(button.id)}
              className={`workspace-tab relative inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold ${
                active ? "active" : ""
              }`}
            >
              <button.icon className="size-3.5" />
              {button.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Clock className="size-3.5" />
        <span className="data-mono">
          {snapshotTimestampLabel} - {data.mode} mode - {data.successful}/{data.symbol_count} sembol
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSignals.map((signal) => {
          const currentPrice = signal.live?.currentPrice ?? signal.price;
          const currentDayPct = signal.live?.priceChangePct ?? signal.daily_pct;
          const signalChanged = signal.live && signal.live.action !== signal.signal;

          return (
            <div
              key={signal.symbol}
              className="workspace-card group relative overflow-hidden rounded-xl border border-border bg-card/80 p-4 transition-all hover:border-sky-400/30 hover:bg-[rgba(35,45,66,0.85)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="heading-condensed text-xl text-foreground">{signal.symbol}</p>
                  <p className="data-mono text-sm text-muted-foreground">{formatPrice(currentPrice)}</p>
                </div>
                <span
                  className={`rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${signalBadgeClass(
                    signal.resolvedSignal
                  )}`}
                >
                  {signalLabel(signal.resolvedSignal, language)}
                </span>
              </div>

              {(signal.setup_type || signal.direction || signal.conviction_tier) ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {signal.setup_type ? (
                    <span className="rounded-full border border-sky-400/25 bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-200">
                      {signal.setup_type}
                    </span>
                  ) : null}
                  {signal.direction ? (
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                      signal.direction === 'LONG'
                        ? 'border-emerald-400/25 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-400/25 bg-rose-500/10 text-rose-300'
                    }`}>
                      {signal.direction === 'LONG' ? copy(language, "↑ LONG", "↑ LONG") : copy(language, "↓ SHORT", "↓ SHORT")}
                    </span>
                  ) : null}
                  {signal.conviction_tier ? (
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                      signal.conviction_tier === 'A+' ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300' :
                      signal.conviction_tier === 'A' ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-200' :
                      signal.conviction_tier === 'B' ? 'border-amber-400/25 bg-amber-500/10 text-amber-300' :
                      signal.conviction_tier === 'C' ? 'border-orange-400/25 bg-orange-500/10 text-orange-300' :
                      'border-rose-400/25 bg-rose-500/10 text-rose-300'
                    }`}>
                      {signal.conviction_tier}
                    </span>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full border border-border bg-background/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Snapshot {signalLabel(signal.signal, language)}
                </span>
                {signal.live ? (
                  <span className="rounded-full border border-sky-400/25 bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-200">
                    {copy(language, "Scanner", "Scanner")}: {scannerSignalLabel(signal.live.scannerSignal, language)}
                  </span>
                ) : null}
              </div>

              {signalChanged ? (
                <div className="mt-3 rounded-lg border border-sky-400/18 bg-sky-500/10 px-3 py-2 text-[11px] text-sky-100">
                  {copy(language, "Snapshot", "Snapshot")} {signalLabel(signal.signal, language)} →{" "}
                  {copy(language, "Canli", "Live")} {signalLabel(signal.resolvedSignal, language)}
                </div>
              ) : null}

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-border/60 bg-background/50 p-2 text-center">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {copy(language, "Gunluk", "Daily")}
                  </p>
                  <p className={`data-mono mt-1 text-sm font-semibold ${pctClass(currentDayPct)}`}>
                    {formatPct(currentDayPct)}
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-background/50 p-2 text-center">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {copy(language, "Haftalik", "Weekly")}
                  </p>
                  <p className={`data-mono mt-1 text-sm font-semibold ${pctClass(signal.weekly_pct)}`}>
                    {formatPct(signal.weekly_pct)}
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-background/50 p-2 text-center">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {copy(language, "Aylik", "Monthly")}
                  </p>
                  <p className={`data-mono mt-1 text-sm font-semibold ${pctClass(signal.monthly_pct)}`}>
                    {formatPct(signal.monthly_pct)}
                  </p>
                </div>
              </div>

              {typeof signal.apex_score === 'number' ? (
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    <span>Apex Score</span>
                    <span className="data-mono text-foreground/85">{signal.apex_score}/100</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-border/60">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        signal.apex_score >= 60
                          ? 'bg-emerald-400'
                          : signal.apex_score >= 40
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${Math.max(0, Math.min(100, signal.apex_score))}%` }}
                    />
                  </div>
                </div>
              ) : null}

              {signal.live ? (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  <div className="rounded-lg border border-border/60 bg-background/50 p-2 text-center">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Bull</p>
                    <p className="data-mono mt-1 text-sm font-semibold text-emerald-300">
                      {signal.live.bullScore}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-background/50 p-2 text-center">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Bear</p>
                    <p className="data-mono mt-1 text-sm font-semibold text-rose-300">
                      {signal.live.bearScore}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-background/50 p-2 text-center">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">RSI</p>
                    <p className="data-mono mt-1 text-sm font-semibold text-foreground">
                      {signal.live.rsi.toFixed(1)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-background/50 p-2 text-center">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">RVOL</p>
                    <p className="data-mono mt-1 text-sm font-semibold text-foreground">
                      {signal.live.volumeRatio.toFixed(2)}x
                    </p>
                  </div>
                </div>
              ) : null}

              {signal.factor_breakdown ? (
                <div className="mt-3 space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Factor Breakdown</p>
                  {[
                    { key: 'f1_momentum_quality', label: 'F1' },
                    { key: 'f2_relative_strength', label: 'F2' },
                    { key: 'f3_volume_liquidity', label: 'F3' },
                    { key: 'f4_technical_structure', label: 'F4' },
                    { key: 'f5_volatility_regime', label: 'F5' },
                    { key: 'f6_catalyst_flow', label: 'F6' },
                  ].map((f) => {
                    const score = (signal.factor_breakdown as Record<string, number>)[f.key] ?? 0;
                    return (
                      <div key={f.key} className="flex items-center gap-2">
                        <span className="w-4 text-[10px] font-medium text-muted-foreground">{f.label}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border/60">
                          <div
                            className="h-full rounded-full bg-sky-400"
                            style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
                          />
                        </div>
                        <span className="w-5 text-right text-[10px] data-mono text-foreground/80">{Math.round(score)}</span>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {signal.trade_plan ? (
                <div className="mt-3 rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-[11px]">
                  <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Trade Plan</p>
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    <span>Entry: {formatPrice(signal.trade_plan.entry)}</span>
                    <span className="text-rose-300">Stop: {formatPrice(signal.trade_plan.stop)}</span>
                    <span className="text-emerald-300">T1: {formatPrice(signal.trade_plan.target1)}</span>
                    <span className="text-emerald-300">T2: {formatPrice(signal.trade_plan.target2)}</span>
                    <span>RR: {signal.trade_plan.rr_ratio.toFixed(1)}</span>
                    <span>Stop%: {signal.trade_plan.stop_pct.toFixed(1)}%</span>
                  </div>
                </div>
              ) : null}

              {signal.position_sizing && signal.position_sizing.shares > 0 ? (
                <div className="mt-3 rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-[11px]">
                  <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Position Sizing</p>
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    <span>Shares: {signal.position_sizing.shares}</span>
                    <span>Position: ${signal.position_sizing.position_value.toLocaleString()}</span>
                    <span>Risk: ${signal.position_sizing.dollar_risk.toFixed(0)} ({signal.position_sizing.risk_pct_of_account.toFixed(1)}%)</span>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      signal.position_sizing.kelly_fraction >= 0.25 ? 'bg-emerald-500/20 text-emerald-300' :
                      signal.position_sizing.kelly_fraction >= 0.15 ? 'bg-amber-500/20 text-amber-300' :
                      'bg-rose-500/20 text-rose-300'
                    }`}>
                      Kelly: {(signal.position_sizing.kelly_fraction * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {signal.signals.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-background/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(signal.conviction, 100)}%`,
                      backgroundColor:
                        signal.resolvedSignal === "STRONG_BUY" || signal.resolvedSignal === "BUY"
                          ? "rgba(16,185,129,0.7)"
                          : signal.resolvedSignal === "SELL" || signal.resolvedSignal === "STRONG_SELL"
                            ? "rgba(244,63,94,0.7)"
                            : "rgba(245,158,11,0.7)",
                    }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between gap-3 text-[10px] text-muted-foreground">
                  <span>
                    {signal.live
                      ? `${copy(language, "Bull", "Bull")}: ${signal.live.bullScore} / ${copy(language, "Bear", "Bear")}: ${signal.live.bearScore}`
                      : `${copy(language, "Guc", "Strength")}: ${signal.strength}`}
                  </span>
                  {signal.live ? (
                    <span>
                      {copy(language, "Guven", "Confidence")}: {signal.live.confidenceScore}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 text-[10px] text-muted-foreground">
                <span>
                  {copy(language, "Snapshot", "Snapshot")}:{" "}
                  {formatTimestamp(signal.timestamp || data.timestamp, language)}
                </span>
                {signal.live ? (
                  <span>
                    {copy(language, "Canli", "Live")}: {formatTimestamp(signal.live.updatedAt, language)}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSignals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-background/35 p-6 text-center text-sm text-muted-foreground">
          {copy(
            language,
            "Bu filtreye uygun sinyal bulunamadi.",
            "No signals match this filter."
          )}
        </div>
      ) : null}
    </div>
  );
}


