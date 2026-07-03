import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, ArrowRightLeft, BarChart3, Clock, LineChart, Loader2, RefreshCw, ShieldAlert, TrendingDown, TrendingUp, Zap, } from "lucide-react";
import type {
  MidasActionSignal as ActionSignal, MidasRiskLevel, MidasSignalRecord, MidasSignalsData, } from "@shared/midasSignals";
import { runMomentumScan, type StockResult } from "@/scanner";
import { type AppLanguage, t } from "@/lib/i18n";

type SurfaceMode = "overview" | "positive" | "neutral" | "negative" | "shifts";
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
const MAX_OVERVIEW_SIGNALS = 4;
const MAX_OVERVIEW_NEUTRALS = 4;
const MAX_OVERVIEW_SHIFTS = 4;

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
      return t("common:lowRisk");
    case "HIGH":
      return t("coverage:total");
    case "MEDIUM":
      return t("common:mediumRisk");
    default:
      return "Risk n/a";
  }
}

function signalLabel(signal: ActionSignal, language: AppLanguage) {
  switch (signal) {
    case "STRONG_BUY":
      return t("common:strongBuybe09");
    case "BUY":
      return t("common:buy36db");
    case "SELL":
      return t("common:sell");
    case "STRONG_SELL":
      return t("flow:htmlReportDetailForDated");
    default:
      return t("common:hold");
  }
}

function scannerSignalLabel(signal: string, language: AppLanguage) {
  switch (signal) {
    case "STRONG_BUY":
      return signalLabel("STRONG_BUY", language);
    case "BUY":
      return signalLabel("BUY", language);
    case "NEUTRAL_BULLISH":
      return t("common:neutralBullish71fe");
    case "NEUTRAL":
      return t("common:neutral0dc3");
    case "NEUTRAL_BEARISH":
      return t("common:neutralBearishd74b");
    case "WEAK":
      return t("common:weak");
    case "CAUTION_HOT":
      return t("common:hotZone0372");
    case "OVERBOUGHT_RED":
      return t("common:overbought836a");
    case "OVERSOLD_CAUTION":
      return t("common:oversold6192");
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
      return t("common:intradayMomentumIsAcceleratingHigher");
    case "DAILY_UP":
      return t("common:intradayFlowIsTiltedHigher");
    case "WEEKLY_STRONG_UP":
      return t("common:theWeeklyTrendIsStrongly");
    case "WEEKLY_UP":
      return t("common:weeklyMomentumIsSupportive");
    case "MONTHLY_STRONG_UP":
      return t("common:theMonthlyTrendIsShowing");
    case "MONTHLY_UP":
      return t("common:monthlyMomentumRemainsPositive");
    case "ALL_UP":
      return t("common:everyMajorTimeframeIsAligned");
    case "DAILY_STRONG_DOWN":
      return t("common:intradaySellingPressureIsSharp");
    case "DAILY_DOWN":
      return t("common:intradayFlowIsLeaningLower");
    case "WEEKLY_STRONG_DOWN":
      return t("common:weeklyWeaknessIsDeepening");
    case "WEEKLY_DOWN":
      return t("common:weeklyMomentumIsNegative");
    case "MONTHLY_STRONG_DOWN":
      return t("common:theMonthlyTrendIsDecisively");
    case "MONTHLY_DOWN":
      return t("common:monthlyMomentumIsWeak");
    case "ALL_DOWN":
      return t("common:everyMajorTimeframeIsAlignedc31c");
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
      return t("common:theLiveEngineUpgradedThe");
    }

    if (getDirectionalBias(resolvedSignal) === "negative") {
      return t("common:theLiveEngineDowngradedThe");
    }
  }

  switch (resolvedSignal) {
    case "STRONG_BUY":
      return t("common:trendBreadthAndVelocityAre");
    case "BUY":
      return t("common:upsideMomentumRemainsIntact");
    case "SELL":
      return t("common:downsideMomentumIsTakingControl");
    case "STRONG_SELL":
      return t("common:sellingPressureIsAccelerating");
    default:
      return t("common:directionIsMixedThisIs");
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
      reasons.push(t("common:theLiveEnginePrintsBull", { bullscore: live.bullScore, bearscore: live.bearScore }));
    } else if (direction === "negative") {
      reasons.push(t("common:theLiveEnginePrintsBear", { bearscore: live.bearScore, bullscore: live.bullScore }));
    }

    if (live.volumeRatio >= 1.25) {
      reasons.push(t("common:volumeSupportIsRunningAt", { tofixed2: live.volumeRatio.toFixed(2) }));
    }
  }

  if (direction === "positive") {
    if (dayChange > 0) reasons.push(t("common:dailyFlowIsPositiveAt", { formatpctDaychange: formatPct(dayChange) }));
    if (signal.weekly_pct > 0) reasons.push(t("common:weeklyMomentumIsRunningAt", { weekly_pct: formatPct(signal.weekly_pct) }));
    if (signal.monthly_pct > 0) reasons.push(t("common:monthlyAccelerationSupportsTheMove", { monthly_pct: formatPct(signal.monthly_pct) }));
  }

  if (direction === "negative") {
    if (dayChange < 0) reasons.push(t("common:dailyFlowIsLeaningLower", { formatpctDaychange: formatPct(dayChange) }));
    if (signal.weekly_pct < 0) reasons.push(t("common:weeklyMomentumIsWeakAt", { weekly_pct: formatPct(signal.weekly_pct) }));
    if (signal.monthly_pct < 0) reasons.push(t("common:theMonthlyTrendIsDeteriorating", { monthly_pct: formatPct(signal.monthly_pct) }));
  }

  for (const tag of signal.signals.slice(0, 4)) {
    reasons.push(describeSnapshotTag(tag, language));
  }

  return uniqueStrings(reasons).slice(0, 4);
}

function pipelineStatusLabel(status: string, language: AppLanguage) {
  switch (status) {
    case "ok":
      return t("common:synced");
    case "stale":
      return t("common:stale");
    case "error":
      return t("common:error");
    default:
      return t("earnings:gammaHighRisk");
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
  compact = false,
}: {
  language: AppLanguage;
  signal: MergedSignalRecord;
  snapshotTimestamp: string;
  compact?: boolean;
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
  const visibleReasonDetails = compact
    ? signal.reasonDetails.slice(0, 2)
    : signal.reasonDetails;
  const visibleTags = compact ? signal.signals.slice(0, 3) : signal.signals.slice(0, 4);
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
  const cardClassName = compact
    ? "rounded-xl border p-2.5 shadow-[0_10px_28px_rgba(3,7,18,0.16)] transition-colors duration-200"
    : "rounded-xl border p-3 shadow-[0_12px_32px_rgba(3,7,18,0.18)] transition-colors duration-200";

  return (
    <article className={`${cardClassName} ${toneClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className={`heading-condensed text-foreground ${compact ? "text-lg" : "text-xl"}`}>
              {signal.symbol}
            </p>
            {signal.directionalBias === "positive" ? (
              <TrendingUp className={`${compact ? "size-3.5" : "size-4"} text-emerald-300`} />
            ) : signal.directionalBias === "negative" ? (
              <TrendingDown className={`${compact ? "size-3.5" : "size-4"} text-rose-300`} />
            ) : (
              <LineChart className={`${compact ? "size-3.5" : "size-4"} text-amber-300`} />
            )}
          </div>
          <p className={`mt-0.5 text-foreground/90 ${compact ? "text-[12px] leading-5" : "text-[13px] leading-5"}`}>
            {signal.headline}
          </p>
          <div className={`flex flex-wrap items-center gap-1.5 text-muted-foreground ${compact ? "mt-1 text-[9px]" : "mt-1.5 text-[10px]"}`}>
            <span className="data-mono rounded-full border border-border bg-background/60 px-2 py-0.5">{formatPrice(currentPrice)}</span>
            {signal.live ? (
              <span className="rounded-full border border-border bg-background/60 px-2 py-0.5">
                {"Scanner"}: {scannerSignalLabel(signal.live.scannerSignal, language)}
              </span>
            ) : null}
          </div>
        </div>

        <span className={`shrink-0 rounded-md border px-2 py-0.5 font-bold uppercase tracking-[0.14em] ${compact ? "text-[8px]" : "text-[9px]"} ${signalBadgeClass(signal.resolvedSignal)}`}>
          {signalLabel(signal.resolvedSignal, language)}
        </span>
      </div>

      <div className={`flex flex-wrap gap-1.5 ${compact ? "mt-2.5 text-[9px]" : "mt-3 text-[10px]"}`}>
        {displayConfidenceLabel ? (
          <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-2 py-0.5 text-sky-100">
            {t("common:confidence")}: {displayConfidenceLabel}
          </span>
        ) : null}
        {signal.riskLevel ? (
          <span className={`rounded-full border px-2 py-0.5 ${riskBadgeClass(signal.riskLevel)}`}>
            {riskLabel(signal.riskLevel, language)}
          </span>
        ) : null}
        {signal.live && snapshotConfidenceLabel ? (
          <span className="rounded-full border border-border bg-background/70 px-2 py-0.5 text-muted-foreground">
            {t("common:snapshotConfidence")}: {snapshotConfidenceLabel}
          </span>
        ) : null}
      </div>

      <div className={compact ? "mt-2.5" : "mt-3"}>
        <div className={`mb-1.5 flex items-center justify-between gap-3 uppercase tracking-[0.16em] text-muted-foreground ${compact ? "text-[9px]" : "text-[10px]"}`}>
          <span>{t("common:momentumConviction")}</span>
          <span className="data-mono text-foreground/85">{convictionWidth}/100</span>
        </div>
        <div className={`${compact ? "h-1.5" : "h-1.5"} overflow-hidden rounded-full bg-background/75`}>
          <div className={`h-full rounded-full transition-all duration-300 ${meterClass}`} style={{ width: `${convictionWidth}%` }} />
        </div>
      </div>

      <div className={`flex flex-wrap gap-1.5 ${compact ? "mt-2.5 text-[9px]" : "mt-3 text-[10px]"}`}>
        <span className={`data-mono rounded-full border border-border bg-background/70 px-2 py-0.5 ${pctClass(currentDayPct)}`}>{t("common:daily")}: {formatPct(currentDayPct)}</span>
        <span className={`data-mono rounded-full border border-border bg-background/70 px-2 py-0.5 ${pctClass(signal.weekly_pct)}`}>{t("common:weekly")}: {formatPct(signal.weekly_pct)}</span>
        <span className={`data-mono rounded-full border border-border bg-background/70 px-2 py-0.5 ${pctClass(signal.monthly_pct)}`}>{t("common:monthly")}: {formatPct(signal.monthly_pct)}</span>
        {signal.live ? (
          <span className="data-mono rounded-full border border-border bg-background/70 px-2 py-0.5 text-muted-foreground">
            {"Bull"} {signal.live.bullScore} / {"Bear"} {signal.live.bearScore}
          </span>
        ) : null}
      </div>

      {signalChanged ? (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-sky-400/20 bg-sky-500/10 px-2.5 py-1.5 text-[10px] text-sky-100">
          <ArrowRightLeft className="size-3.5" />
          <span>
            {"Snapshot"} {signalLabel(signal.signal, language)} - {t("common:live")} {signalLabel(signal.resolvedSignal, language)}
          </span>
        </div>
      ) : null}

      {signal.notes ? (
        <div className={`mt-3 rounded-lg border border-sky-400/18 bg-sky-500/[0.08] px-2.5 py-2 text-[11px] leading-5 text-sky-50/88 ${compact ? "hidden" : ""}`}>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-200/78">
            {t("common:analystNote")}
          </p>
          <p>{signal.notes}</p>
        </div>
      ) : null}

      <div className={`space-y-1.5 ${compact ? "mt-2.5" : "mt-3"}`}>
        {visibleReasonDetails.map((reason) => (
          <div key={reason} className={`rounded-lg border border-border/70 bg-background/60 px-2.5 py-1.5 leading-5 text-foreground/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] ${compact ? "text-[10px]" : "text-[11px]"}`}>
            {reason}
          </div>
        ))}
      </div>

      {hasLayers && !compact ? (
        <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
          <div className="rounded-lg border border-border/70 bg-background/60 px-2.5 py-1.5 text-[11px] text-muted-foreground">
            <p className="text-[10px] uppercase tracking-[0.14em]">{"Momentum"}</p>
            <p className="data-mono mt-1 text-[13px] text-foreground">{signal.layers?.momentumScore ?? "-"}</p>
          </div>
          <div className="rounded-lg border border-border/70 bg-background/60 px-2.5 py-1.5 text-[11px] text-muted-foreground">
            <p className="text-[10px] uppercase tracking-[0.14em]">{t("common:oscillator")}</p>
            <p className="data-mono mt-1 text-[13px] text-foreground">{signal.layers?.oscillatorScore ?? "-"}</p>
          </div>
          <div className="rounded-lg border border-border/70 bg-background/60 px-2.5 py-1.5 text-[11px] text-muted-foreground">
            <p className="text-[10px] uppercase tracking-[0.14em]">{"Trend"}</p>
            <p className="data-mono mt-1 text-[13px] text-foreground">{signal.layers?.trendScore ?? "-"}</p>
          </div>
          <div className="rounded-lg border border-border/70 bg-background/60 px-2.5 py-1.5 text-[11px] text-muted-foreground">
            <p className="text-[10px] uppercase tracking-[0.14em]">{t("common:confluence")}</p>
            <p className="data-mono mt-1 text-[13px] text-foreground">{signal.layers?.confluenceScore ?? "-"}</p>
          </div>
        </div>
      ) : null}

      <div className={`flex flex-wrap gap-1.5 ${compact ? "mt-2.5" : "mt-3"}`}>
        {visibleTags.map((tag) => (
          <span key={tag} className={`rounded-full border border-border bg-background/70 px-2 py-0.5 font-medium text-muted-foreground ${compact ? "text-[8px]" : "text-[9px]"}`}>
            {tag}
          </span>
        ))}
      </div>

      <div className={`flex flex-wrap items-center gap-2 text-muted-foreground ${compact ? "mt-2.5 text-[9px]" : "mt-3 text-[10px]"}`}>
        <span>{"Snapshot"}: {formatTimestamp(signal.timestamp || snapshotTimestamp, language)}</span>
        {signal.live ? <span>{t("common:live")}: {formatTimestamp(signal.live.updatedAt, language)}</span> : null}
      </div>
    </article>
  );
}

function MarketOverviewStrip({
  language,
  marketOverview,
}: {
  language: AppLanguage;
  marketOverview: NonNullable<MidasSignalsData["market_overview"]>;
}) {
  const entries = Object.entries(marketOverview).slice(0, 4);
  if (!entries.length) {
    return null;
  }

  return (
    <section className="rounded-xl border border-border bg-background/38 p-3.5">
      <div className="mb-3 flex items-center gap-2">
        <BarChart3 className="size-4 text-sky-300" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
          {t("common:broadMarketPulse")}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {entries.map(([ticker, info]) => {
          const changeClass =
            info.change_pct > 0
              ? "text-emerald-300"
              : info.change_pct < 0
                ? "text-rose-300"
                : "text-muted-foreground";
          const sign = info.change_pct > 0 ? "+" : "";

          return (
            <div
              key={ticker}
              className="rounded-xl border border-border/70 bg-background/70 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {ticker}
                  </p>
                  <p className="mt-1 heading-condensed text-xl text-foreground">
                    {formatPrice(info.price)}
                  </p>
                </div>
                <span className={`data-mono text-sm ${changeClass}`}>
                  {sign}
                  {info.change_pct.toFixed(2)}%
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                {info.name}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FlowMetricCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Activity;
  label: string;
  value: number;
  tone: "positive" | "neutral" | "negative" | "shift";
}) {
  const toneClass =
    tone === "positive"
      ? "border-emerald-500/18 bg-[linear-gradient(180deg,rgba(16,185,129,0.14),rgba(6,78,59,0.18))] text-emerald-100"
      : tone === "negative"
        ? "border-rose-500/18 bg-[linear-gradient(180deg,rgba(244,63,94,0.14),rgba(76,5,25,0.18))] text-rose-100"
        : tone === "shift"
          ? "border-sky-500/18 bg-[linear-gradient(180deg,rgba(14,165,233,0.14),rgba(30,27,75,0.18))] text-sky-100"
          : "border-amber-500/18 bg-[linear-gradient(180deg,rgba(245,158,11,0.14),rgba(120,53,15,0.18))] text-amber-100";
  const iconClass =
    tone === "positive"
      ? "text-emerald-300"
      : tone === "negative"
        ? "text-rose-300"
        : tone === "shift"
          ? "text-sky-200"
          : "text-amber-300";

  return (
    <div className={`rounded-xl border p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] ${toneClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] opacity-80">
            {label}
          </p>
          <p className="heading-condensed mt-1 text-[1.9rem] leading-none">
            {value}
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-background/30 p-2">
          <Icon className={`size-3.5 ${iconClass}`} />
        </div>
      </div>
    </div>
  );
}

function HeroInsightCard({
  icon: Icon,
  label,
  symbol,
  detail,
  description,
  tone,
  onClick,
}: {
  icon: typeof Activity;
  label: string;
  symbol: string;
  detail: string;
  description: string;
  tone: "positive" | "neutral" | "negative" | "shift";
  onClick: () => void;
}) {
  const toneClass =
    tone === "positive"
      ? "border-emerald-500/20 bg-[linear-gradient(180deg,rgba(16,185,129,0.10),rgba(6,78,59,0.24))] text-emerald-50 hover:border-emerald-400/28"
      : tone === "negative"
        ? "border-rose-500/20 bg-[linear-gradient(180deg,rgba(244,63,94,0.10),rgba(76,5,25,0.24))] text-rose-50 hover:border-rose-400/28"
        : tone === "shift"
          ? "border-sky-500/20 bg-[linear-gradient(180deg,rgba(14,165,233,0.10),rgba(30,27,75,0.24))] text-sky-50 hover:border-sky-400/28"
          : "border-amber-500/20 bg-[linear-gradient(180deg,rgba(245,158,11,0.10),rgba(120,53,15,0.24))] text-amber-50 hover:border-amber-400/28";
  const accentClass =
    tone === "positive"
      ? "from-emerald-300 via-emerald-400 to-teal-300"
      : tone === "negative"
        ? "from-rose-300 via-rose-400 to-orange-300"
        : tone === "shift"
          ? "from-sky-200 via-sky-300 to-sky-300"
          : "from-amber-200 via-amber-300 to-yellow-200";
  const labelClass =
    tone === "positive"
      ? "text-emerald-300/85"
      : tone === "negative"
        ? "text-rose-300/85"
        : tone === "shift"
          ? "text-sky-200/85"
          : "text-amber-300/85";
  const detailClass =
    tone === "positive"
      ? "text-emerald-200"
      : tone === "negative"
        ? "text-rose-200"
        : tone === "shift"
          ? "text-sky-100"
          : "text-amber-100";
  const glowClass =
    tone === "positive"
      ? "bg-emerald-400/16"
      : tone === "negative"
        ? "bg-rose-400/16"
        : tone === "shift"
          ? "bg-sky-400/16"
          : "bg-amber-400/16";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative min-h-[128px] overflow-hidden rounded-xl border p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-background/20 ${toneClass}`}
    >
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accentClass}`} />
      <div className={`absolute -right-6 -top-8 h-20 w-20 rounded-full blur-2xl ${glowClass}`} />

      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-white/10 bg-background/25 p-1.5">
              <Icon className={`size-3.5 ${labelClass}`} />
            </div>
            <p className={`text-[9px] font-semibold uppercase tracking-[0.18em] ${labelClass}`}>
              {label}
            </p>
          </div>
          <span className={`data-mono text-[12px] font-semibold ${detailClass}`}>
            {detail}
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <h4 className="heading-condensed text-[2rem] leading-none text-foreground">
            {symbol}
          </h4>
        </div>

        <p className="mt-3 text-[13px] leading-6 text-foreground/84">
          {description}
        </p>
      </div>
    </button>
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
      setError(loadError instanceof Error && loadError.message ? loadError.message : t("common:failedToLoadMidasSignal"));
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
      setLiveError(t("common:liveScannerDataCouldNot"));
    } finally {
      if (liveRunRef.current === runId) setLiveLoading(false);
    }
  }, [language]);

  // Auto live-scan disabled: client-side CORS proxy 50-symbol fetch locks browser
  // useEffect(() => {
  //   if (!data) return;
  //   const nextKey = `${data.timestamp}:${data.symbol_count}`;
  //   if (lastAutoScanKeyRef.current === nextKey) return;
  //   lastAutoScanKeyRef.current = nextKey;
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
  const neutralSignals = useMemo(() => [...mergedSignals].filter((signal) => signal.directionalBias === "neutral").sort((left, right) => {
    const convictionGap = right.conviction - left.conviction;
    if (convictionGap !== 0) return convictionGap;
    const dayGap = Math.abs(right.dayChange) - Math.abs(left.dayChange);
    if (dayGap !== 0) return dayGap;
    const weeklyGap = Math.abs(right.weekly_pct) - Math.abs(left.weekly_pct);
    if (weeklyGap !== 0) return weeklyGap;
    return Math.abs(right.monthly_pct) - Math.abs(left.monthly_pct);
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
          <LineChart className="size-4 animate-pulse text-sky-300" />
          <p className="text-sm text-foreground">{t("common:loadingMomentumFlow")}</p>
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
  const strongestNeutral = neutralSignals[0] ?? null;
  const strongestNegative = negativeSignals[0] ?? null;
  const featuredShift = orderedChangedSignals[0] ?? null;
  const visiblePositiveSignals = surfaceMode === "overview" ? positiveSignals.slice(0, MAX_OVERVIEW_SIGNALS) : positiveSignals;
  const visibleNeutralSignals = surfaceMode === "overview" ? neutralSignals.slice(0, MAX_OVERVIEW_NEUTRALS) : neutralSignals;
  const visibleNegativeSignals = surfaceMode === "overview" ? negativeSignals.slice(0, MAX_OVERVIEW_SIGNALS) : negativeSignals;
  const visibleChangedSignals = surfaceMode === "overview" ? orderedChangedSignals.slice(0, MAX_OVERVIEW_SHIFTS) : orderedChangedSignals;
  const showPositiveSection = surfaceMode === "overview" || surfaceMode === "positive";
  const showNeutralSection = surfaceMode === "overview" || surfaceMode === "neutral";
  const showNegativeSection = surfaceMode === "overview" || surfaceMode === "negative";
  const showShiftSection = surfaceMode === "overview" || surfaceMode === "shifts";
  const positiveCardLayout =
    surfaceMode === "positive"
      ? "grid gap-3 md:grid-cols-2 2xl:grid-cols-3"
      : "grid gap-3 md:grid-cols-2";
  const neutralCardLayout =
    surfaceMode === "neutral"
      ? "grid gap-3 md:grid-cols-2 xl:grid-cols-3"
      : "grid gap-3 md:grid-cols-2 xl:grid-cols-4";
  const negativeCardLayout =
    surfaceMode === "negative"
      ? "grid gap-3 md:grid-cols-2 2xl:grid-cols-3"
      : "grid gap-3 md:grid-cols-2";
  const balanceHeadline =
    neutralCount >= positiveCount && neutralCount >= negativeCount && neutralCount > 0
      ? t("common:theMarketIsSittingIn")
      : positiveCount > negativeCount
      ? t("common:flowIsTiltedToThe")
      : negativeCount > positiveCount
        ? t("common:downsidePressureIsInControl")
        : t("common:momentumIsBalanced");
  const balanceDescription =
    neutralCount >= positiveCount && neutralCount >= negativeCount && neutralCount > 0
      ? t("common:theNeutralBlockHasExpanded")
      : positiveCount > negativeCount
      ? t("common:thereAreMoreLeadersOn")
      : negativeCount > positiveCount
        ? t("common:moreNamesAreDeterioratingOn")
        : t("common:theListIsMixedFor");
  const viewButtons: Array<{ id: SurfaceMode; label: string; count: number; icon: typeof TrendingUp }> = [
    { id: "overview", label: t("common:commandView"), count: mergedSignals.length, icon: BarChart3 },
    { id: "positive", label: t("common:leaders"), count: positiveSignals.length, icon: TrendingUp },
    { id: "neutral", label: t("common:neutralRadar"), count: neutralSignals.length, icon: LineChart },
    { id: "negative", label: t("common:risks"), count: negativeSignals.length, icon: TrendingDown },
    { id: "shifts", label: t("common:shifts"), count: orderedChangedSignals.length, icon: ArrowRightLeft },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_26%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(17,24,39,0.98))] p-4 shadow-[0_24px_80px_rgba(3,7,18,0.34)] md:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-sky-300" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
                {t("common:momentumCommandLayer")}
              </p>
            </div>
            <h3 className="heading-condensed text-3xl text-foreground md:text-[2rem]">{balanceHeadline}</h3>
            <p className="max-w-3xl text-sm leading-7 text-foreground/90">
              {t("common:thisSurfaceFirstPullsThe")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => void loadSnapshot()} disabled={snapshotRefreshing} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background/70 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-60">
              {snapshotRefreshing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              {t("common:refreshSource")}
            </button>
            <button type="button" onClick={() => void runLiveRefresh(data.signals.map((signal) => signal.symbol))} disabled={liveLoading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-sky-400/30 bg-sky-500/12 px-4 py-2 text-sm font-semibold text-sky-100 transition-colors hover:bg-sky-500/18 disabled:cursor-not-allowed disabled:opacity-60">
              {liveLoading ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
              {t("common:runLiveRescore")}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          <span className="rounded-full border border-border bg-background/70 px-3 py-1">{"Snapshot: "}{snapshotTimestampLabel}</span>
          <span className="rounded-full border border-border bg-background/70 px-3 py-1">{t("common:liveUpdate")}: {liveTimestampLabel}</span>
          <span className={`rounded-full border px-3 py-1 ${pipelineStatusClass(data.pipeline?.status || "idle")}`}>{"Pipeline"}: {pipelineStatusLabel(data.pipeline?.status || "idle", language)}</span>
          <span className="rounded-full border border-border bg-background/70 px-3 py-1">{liveCoverageCount}/{data.symbol_count} {t("common:symbolsScanned")}</span>
          <span className="rounded-full border border-border bg-background/70 px-3 py-1">{orderedChangedSignals.length} {t("common:signalsChanged")}</span>
          {data.pipeline?.pollIntervalMs ? <span className="rounded-full border border-border bg-background/70 px-3 py-1">{t("common:pollInterval")}: {Math.round(data.pipeline.pollIntervalMs / 1000)}s</span> : null}
        </div>

        {liveLoading ? (
          <div className="mt-4 space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-background/80">
              <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">
              {scanProgress.current ? `${scanProgress.current} ${t("common:isBeingRescoredLive")}` : t("common:theMomentumUniverseIsBeingcaf6")}
            </p>
          </div>
        ) : null}

        {error ? <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}
        {liveError ? <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{liveError}</div> : null}

        <div className="mt-6 grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
          <div className="rounded-xl border border-border bg-background/38 p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("common:flowMap")}</p>
                <p className="mt-1 text-[13px] leading-6 text-foreground/90">{balanceDescription}</p>
              </div>
              <div className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-[10px] text-muted-foreground">
                {t("common:mode")}: <span className="data-mono">{data.mode}</span>
              </div>
            </div>

            <div className="mt-3 overflow-hidden rounded-full border border-border bg-background/70">
              <div className="flex h-2.5 w-full">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${positiveRatio}%` }} />
                <div className="bg-gradient-to-r from-amber-400 to-yellow-300" style={{ width: `${neutralRatio}%` }} />
                <div className="bg-gradient-to-r from-rose-500 to-orange-400" style={{ width: `${negativeRatio}%` }} />
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <FlowMetricCard
                icon={TrendingUp}
                label={t("common:positive")}
                value={positiveCount}
                tone="positive"
              />
              <FlowMetricCard
                icon={LineChart}
                label={t("common:neutral")}
                value={neutralCount}
                tone="neutral"
              />
              <FlowMetricCard
                icon={ShieldAlert}
                label={t("common:negative")}
                value={negativeCount}
                tone="negative"
              />
              <FlowMetricCard
                icon={ArrowRightLeft}
                label={t("common:shiftse1fc")}
                value={orderedChangedSignals.length}
                tone="shift"
              />
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <HeroInsightCard
              icon={TrendingUp}
              label={t("common:leadLongSetup")}
              symbol={strongestPositive?.symbol || "--"}
              detail={
                strongestPositive
                  ? formatPct(strongestPositive.dayChange)
                  : t("common:waiting")
              }
              description={
                strongestPositive?.headline ||
                t("common:thereIsNoClearLeader")
              }
              tone="positive"
              onClick={() => setSurfaceMode("positive")}
            />

            <HeroInsightCard
              icon={LineChart}
              label={t("common:transitionRadar")}
              symbol={strongestNeutral?.symbol || "--"}
              detail={
                strongestNeutral
                  ? formatPct(strongestNeutral.dayChange)
                  : t("common:waiting")
              }
              description={
                strongestNeutral?.headline ||
                t("common:thereIsNoNeutralTransition")
              }
              tone="neutral"
              onClick={() => setSurfaceMode("neutral")}
            />

            <HeroInsightCard
              icon={ShieldAlert}
              label={t("common:leadShortSetup")}
              symbol={strongestNegative?.symbol || "--"}
              detail={
                strongestNegative
                  ? formatPct(strongestNegative.dayChange)
                  : t("common:waiting")
              }
              description={
                strongestNegative?.headline ||
                t("common:thereIsNoClearBreakdown")
              }
              tone="negative"
              onClick={() => setSurfaceMode("negative")}
            />

            <HeroInsightCard
              icon={featuredShift ? ArrowRightLeft : Zap}
              label={
                featuredShift
                  ? t("common:liveRevision")
                  : t("common:fastMove")
              }
              symbol={featuredShift?.symbol || biggestMover?.symbol || "--"}
              detail={
                featuredShift
                  ? `${signalLabel(featuredShift.signal, language)} -> ${signalLabel(featuredShift.resolvedSignal, language)}`
                  : biggestMover
                    ? formatPct(biggestMover.dayChange)
                    : t("common:waiting")
              }
              description={
                featuredShift?.headline ||
                (biggestMover
                  ? t("common:whenThereIsNoLive")
                  : t("common:thereIsNoStandoutFast"))
              }
              tone="shift"
              onClick={() => setSurfaceMode(featuredShift ? "shifts" : "overview")}
            />
          </div>
        </div>
      </div>

      {data.market_overview ? (
        <MarketOverviewStrip language={language} marketOverview={data.market_overview} />
      ) : null}

      <div className="sticky top-4 z-10 rounded-xl border border-border bg-background/75 p-1.5 shadow-[0_18px_48px_rgba(3,7,18,0.24)] backdrop-blur">
        <div className="flex flex-wrap items-center gap-1.5">
          {viewButtons.map((button) => {
            const active = surfaceMode === button.id;
            const Icon = button.icon;

            return (
              <button key={button.id} type="button" onClick={() => setSurfaceMode(button.id)} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${active ? "bg-sky-500/18 text-sky-100 shadow-[0_0_0_1px_rgba(14,165,233,0.18)]" : "text-muted-foreground hover:bg-background/70 hover:text-foreground"}`}>
                <Icon className="size-3.5" />
                {button.label}
                <span className="data-mono rounded-full bg-background/60 px-1.5 py-0.5 text-[10px]">{button.count}</span>
              </button>
            );
          })}

          <div className="ml-auto flex items-center gap-2 rounded-xl border border-border bg-background/55 px-3 py-2 text-[11px] text-muted-foreground">
            <Clock className="size-3.5" />
            {t("common:autoPull")}: <span className="data-mono">{Math.round((data.pipeline?.pollIntervalMs || SNAPSHOT_REFRESH_INTERVAL_MS) / 1000)}s</span>
          </div>
        </div>
      </div>

      {showShiftSection ? (
        <section className="rounded-xl border border-sky-400/18 bg-[linear-gradient(180deg,rgba(14,165,233,0.10),rgba(15,23,42,0.86))] p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="size-4 text-sky-200" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">{t("common:signalShifts1180")}</p>
              </div>
              <h3 className="heading-condensed text-2xl text-sky-50">{t("common:namesRevisedByTheLive")}</h3>
              <p className="max-w-3xl text-sm leading-7 text-sky-50/78">
                {t("common:ifTheSnapshotAndThe")}
              </p>
            </div>

            {surfaceMode === "overview" && orderedChangedSignals.length > MAX_OVERVIEW_SHIFTS ? (
              <button type="button" onClick={() => setSurfaceMode("shifts")} className="inline-flex items-center gap-2 rounded-lg border border-sky-400/20 bg-background/35 px-3 py-2 text-xs font-semibold text-sky-100 transition-colors hover:bg-background/50">
                {t("common:openAllShifts")}
              </button>
            ) : null}
          </div>

          {visibleChangedSignals.length > 0 ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleChangedSignals.map((signal) => (
                <div key={signal.symbol} className="rounded-xl border border-sky-400/18 bg-background/35 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="heading-condensed text-xl text-sky-50">{signal.symbol}</p>
                      <p className="mt-1 text-xs text-sky-50/72">{signal.headline}</p>
                    </div>
                    <ArrowRightLeft className="size-4 text-sky-200" />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                    <span className="rounded-full border border-border bg-background/55 px-2.5 py-1 text-muted-foreground">{"Snapshot"}: {signalLabel(signal.signal, language)}</span>
                    <span className="rounded-full border border-sky-400/18 bg-sky-500/10 px-2.5 py-1 text-sky-100">{t("common:live")}: {signalLabel(signal.resolvedSignal, language)}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                    <span className={`data-mono rounded-full border border-border bg-background/55 px-2.5 py-1 ${pctClass(signal.dayChange)}`}>{t("common:daily")}: {formatPct(signal.dayChange)}</span>
                    {signal.live ? <span className="data-mono rounded-full border border-border bg-background/55 px-2.5 py-1 text-muted-foreground">{"Bull"} {signal.live.bullScore} / {"Bear"} {signal.live.bearScore}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-sky-400/18 bg-background/30 p-6 text-sm text-sky-50/78">
              {t("common:theSnapshotAndTheLive")}
            </div>
          )}
        </section>
      ) : null}

      {showNeutralSection ? (
        <section className="space-y-4">
          <div className="flex items-start justify-between gap-3 rounded-xl border border-amber-500/20 bg-[linear-gradient(180deg,rgba(245,158,11,0.10),rgba(15,23,42,0.86))] p-3.5">
            <div className="flex items-start gap-3">
              <LineChart className="mt-0.5 size-4 text-amber-300" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300/80">{"Neutral radar"}</p>
                <h3 className="mt-1 heading-condensed text-xl text-amber-100">{t("common:namesInTransitionThatStill")}</h3>
                <p className="mt-1.5 text-xs leading-6 text-amber-50/85">
                  {t("common:holdSignalsDoNotDisappear")}
                </p>
              </div>
            </div>
            <div className="rounded-full border border-amber-500/18 bg-background/35 px-2.5 py-0.5 text-[10px] text-amber-100">{neutralSignals.length} {t("common:names")}</div>
          </div>

          {visibleNeutralSignals.length > 0 ? (
            <div className={neutralCardLayout}>
              {visibleNeutralSignals.map((signal) => (
                <MomentumSignalCard
                  key={signal.symbol}
                  language={language}
                  signal={signal}
                  snapshotTimestamp={data.timestamp}
                  compact={surfaceMode === "overview"}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-background/35 p-6 text-sm text-muted-foreground">{t("common:thereAreNoNamesIn8306")}</div>
          )}

          {surfaceMode === "overview" && neutralSignals.length > MAX_OVERVIEW_NEUTRALS ? (
            <button type="button" onClick={() => setSurfaceMode("neutral")} className="inline-flex items-center gap-2 rounded-lg border border-amber-500/18 bg-amber-500/[0.08] px-3 py-2 text-xs font-semibold text-amber-100 transition-colors hover:bg-amber-500/[0.12]">
              {t("common:openTheFullNeutralList")}
            </button>
          ) : null}
        </section>
      ) : null}

      <div className={`grid gap-4 ${showPositiveSection && showNegativeSection ? "xl:grid-cols-2" : ""}`}>
        {showPositiveSection ? (
          <section className="space-y-4">
            <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-500/20 bg-[linear-gradient(180deg,rgba(16,185,129,0.10),rgba(15,23,42,0.86))] p-3.5">
              <div className="flex items-start gap-3">
                <TrendingUp className="mt-0.5 size-4 text-emerald-300" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">{t("common:positiveMomentum")}</p>
                  <h3 className="mt-1 heading-condensed text-xl text-emerald-100">{t("common:upsideLeaders")}</h3>
                  <p className="mt-1.5 text-xs leading-6 text-emerald-50/85">
                    {t("common:buyAndStrongBuyNames")}
                  </p>
                </div>
              </div>
              <div className="rounded-full border border-emerald-500/18 bg-background/35 px-2.5 py-0.5 text-[10px] text-emerald-100">{positiveSignals.length} {t("common:names")}</div>
            </div>

            {visiblePositiveSignals.length > 0 ? (
              <div className={positiveCardLayout}>
                {visiblePositiveSignals.map((signal) => (
                  <MomentumSignalCard
                    key={signal.symbol}
                    language={language}
                    signal={signal}
                    snapshotTimestamp={data.timestamp}
                    compact={surfaceMode === "overview"}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-background/35 p-6 text-sm text-muted-foreground">{t("common:thereAreNoNamesIn")}</div>
            )}

            {surfaceMode === "overview" && positiveSignals.length > MAX_OVERVIEW_SIGNALS ? (
              <button type="button" onClick={() => setSurfaceMode("positive")} className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/18 bg-emerald-500/[0.08] px-3 py-2 text-xs font-semibold text-emerald-100 transition-colors hover:bg-emerald-500/[0.12]">
                {t("common:openTheFullPositiveList")}
              </button>
            ) : null}
          </section>
        ) : null}

        {showNegativeSection ? (
          <section className="space-y-4">
            <div className="flex items-start justify-between gap-3 rounded-xl border border-rose-500/20 bg-[linear-gradient(180deg,rgba(244,63,94,0.10),rgba(15,23,42,0.86))] p-3.5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 size-4 text-rose-300" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-300/80">{t("common:negativeMomentum")}</p>
                  <h3 className="mt-1 heading-condensed text-xl text-rose-100">{t("common:namesUnderDownsidePressure")}</h3>
                  <p className="mt-1.5 text-xs leading-6 text-rose-50/85">
                    {t("common:sellAndStrongSellNames")}
                  </p>
                </div>
              </div>
              <div className="rounded-full border border-rose-500/18 bg-background/35 px-2.5 py-0.5 text-[10px] text-rose-100">{negativeSignals.length} {t("common:names")}</div>
            </div>

            {visibleNegativeSignals.length > 0 ? (
              <div className={negativeCardLayout}>
                {visibleNegativeSignals.map((signal) => (
                  <MomentumSignalCard
                    key={signal.symbol}
                    language={language}
                    signal={signal}
                    snapshotTimestamp={data.timestamp}
                    compact={surfaceMode === "overview"}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-background/35 p-6 text-sm text-muted-foreground">{t("common:thereAreNoNamesIn5027")}</div>
            )}

            {surfaceMode === "overview" && negativeSignals.length > MAX_OVERVIEW_SIGNALS ? (
              <button type="button" onClick={() => setSurfaceMode("negative")} className="inline-flex items-center gap-2 rounded-lg border border-rose-500/18 bg-rose-500/[0.08] px-3 py-2 text-xs font-semibold text-rose-100 transition-colors hover:bg-rose-500/[0.12]">
                {t("common:openTheFullNegativeList")}
              </button>
            ) : null}
          </section>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Clock className="size-3.5" />
        <span className="data-mono">{snapshotTimestampLabel} - {data.mode} mode - {data.successful}/{data.symbol_count} {t("common:symbols")}</span>
        {data.pipeline?.resolvedSourceFile ? <span className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px]">{t("common:source")}: {data.pipeline.resolvedSourceFile}</span> : null}
      </div>
    </div>
  );
}


