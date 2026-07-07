import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  MarketFlashCarryForward, MarketFlashEarningsItem, MarketFlashIndexQuote, MarketFlashMarketSummary, MarketFlashMover, MarketFlashReport, MarketFlashRiskAssessment, MarketFlashReportType, MarketFlashSetup, } from "@shared/marketFlash";
import {
  AlertTriangle, ArrowDown, ArrowUp, BarChart3, CalendarDays, ChevronRight, Clock, Flame, History, Info, RefreshCw, Target, TrendingDown, TrendingUp, Zap, } from "lucide-react";
import WorkspaceLoadingState from "@/components/workspace/WorkspaceLoadingState";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import MarkdownReportRenderer from "@/components/reports/MarkdownReportRenderer";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useAppLanguage, type AppLanguage, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const DEFAULT_POLL_INTERVAL_MS = 60 * 1000;
const OFF_MARKET_POLL_INTERVAL_MS = 5 * 60 * 1000;

const THEME = {
  shellClassName:
    "border-violet-500/20 bg-[linear-gradient(180deg,rgba(18,16,36,0.96),rgba(10,10,18,0.98))]",
  innerClassName:
    "bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_32%),linear-gradient(180deg,rgba(18,16,32,0.94),rgba(10,10,18,0.98))]",
  cardClassName: "border-violet-500/18 bg-violet-500/[0.07]",
  softCardClassName: "border-violet-500/16 bg-violet-500/[0.06]",
  glowClassName: "from-violet-400/16 via-violet-500/0 to-transparent",
  iconClassName: "text-violet-200",
  eyebrowClassName: "text-violet-300",
  lineClassName: "bg-violet-400/70",
};

type LooseRecord = Record<string, unknown>;

function asRecord(value: unknown): LooseRecord | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as LooseRecord)
    : null;
}

function asRecordArray(value: unknown): LooseRecord[] {
  return Array.isArray(value)
    ? value.map(item => asRecord(item)).filter((item): item is LooseRecord => item !== null)
    : [];
}

function asString(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
}

function toFiniteNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/[$,%\s,]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parseScaledNumber(value: unknown): number | undefined {
  if (isFiniteNumber(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  const direct = Number(trimmed.replace(/[,$]/g, ""));
  if (Number.isFinite(direct)) {
    return direct;
  }

  const match = trimmed.match(/^([\d.]+)\s*([KMBT])$/i);
  if (!match) {
    return undefined;
  }

  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) {
    return undefined;
  }

  const multipliers: Record<string, number> = {
    K: 1_000,
    M: 1_000_000,
    B: 1_000_000_000,
    T: 1_000_000_000_000,
  };

  return amount * multipliers[match[2].toUpperCase()];
}

function normalizeRevenueValue(value: unknown): number | undefined {
  const parsed = toFiniteNumber(value);
  if (!isFiniteNumber(parsed)) {
    return undefined;
  }

  // Kimi raporu ciroyu bazen "35.0" gibi milyar biriminde yaziyor.
  if (parsed > 0 && parsed < 1_000) {
    return parsed * 1_000_000_000;
  }

  return parsed;
}

function normalizeReportType(value: unknown): MarketFlashReportType {
  const raw = asString(value)?.toLowerCase();
  if (raw === "pre-market" || raw === "after-market" || raw === "hourly") {
    return raw;
  }
  return "hourly";
}

function normalizeEarningsTime(
  value: unknown
): MarketFlashEarningsItem["time"] {
  const raw = asString(value)?.toLowerCase().replace(/\s+/g, "-");
  if (!raw) {
    return "intraday";
  }

  if (raw.includes("before") || raw === "bmo" || raw === "before-open") {
    return "before-open";
  }

  if (raw.includes("after") || raw === "amc" || raw === "after-close") {
    return "after-close";
  }

  return "intraday";
}

function normalizeExpiry(
  expiry: unknown,
  zeroDte: unknown
): MarketFlashSetup["expiry"] {
  if (zeroDte === true) {
    return "0DTE";
  }

  const raw = asString(expiry)?.toLowerCase() ?? "";
  if (raw.includes("0dte")) {
    return "0DTE";
  }
  if (raw.includes("week")) {
    return "weekly";
  }
  return "monthly";
}

function normalizeSentiment(
  value: unknown
): MarketFlashEarningsItem["analystSentiment"] | undefined {
  const raw = asString(value)?.toLowerCase();
  if (raw === "bullish" || raw === "bearish" || raw === "neutral") {
    return raw;
  }
  return undefined;
}

function normalizeGapStatus(value: unknown): MarketFlashCarryForward["gapStatus"] {
  const raw = asString(value)?.toLowerCase();
  switch (raw) {
    case "gap-up-maintained":
    case "gap-up-faded":
    case "gap-down-maintained":
    case "gap-down-faded":
    case "flat":
      return raw;
    default:
      return "flat";
  }
}

function normalizeRiskLevel(
  value: unknown
): MarketFlashRiskAssessment["level"] {
  const raw = asString(value)?.toLowerCase();
  if (raw === "low" || raw === "medium" || raw === "high") {
    return raw;
  }
  return undefined;
}

function normalizeStringList(value: unknown): string[] | undefined {
  const items = Array.isArray(value)
    ? value.map(entry => asString(entry)).filter((entry): entry is string => Boolean(entry))
    : [];

  return items.length ? items : undefined;
}

function normalizeRiskAssessment(value: unknown): MarketFlashRiskAssessment {
  if (typeof value === "string") {
    return { summary: value };
  }

  const record = asRecord(value);
  const details =
    normalizeStringList(record?.details) ??
    normalizeStringList(record?.notes) ??
    normalizeStringList(record?.bullets);
  const summary =
    asString(record?.summary) ??
    asString(record?.text) ??
    asString(record?.body) ??
    asString(record?.description) ??
    details?.[0] ??
    "";

  return {
    level: normalizeRiskLevel(record?.level ?? record?.riskLevel),
    title: asString(record?.title) ?? asString(record?.label),
    summary,
    details,
  };
}

function inferSectorLabel(ticker: string, catalyst: string, fallback?: string) {
  if (fallback) {
    return fallback;
  }

  const haystack = `${ticker} ${catalyst}`.toLowerCase();

  if (
    ["amd", "nvda", "mu", "avgo", "tsm", "qcom", "soxl", "smci"].some(symbol =>
      haystack.includes(symbol)
    ) ||
    haystack.includes("semiconductor")
  ) {
    return "Semiconductors";
  }

  if (
    ["run", "enph", "fslr", "sedg"].some(symbol => haystack.includes(symbol)) ||
    haystack.includes("solar")
  ) {
    return "Solar";
  }

  if (
    ["spy", "qqq", "iwm", "dia", "tlt"].some(symbol => haystack.includes(symbol))
  ) {
    return "ETF";
  }

  if (
    ["absi", "plsm", "biotech", "health", "pharma"].some(symbol =>
      haystack.includes(symbol)
    )
  ) {
    return "Biotech";
  }

  if (
    ["meta", "amzn", "aapl", "msft", "goog", "tech", "software"].some(symbol =>
      haystack.includes(symbol)
    )
  ) {
    return "Technology";
  }

  if (haystack.includes("energy") || haystack.includes("oil")) {
    return "Energy";
  }

  return "Single Name";
}

function normalizeIndexQuote(value: unknown): MarketFlashIndexQuote {
  const record = asRecord(value);

  return {
    price: toFiniteNumber(record?.price) ?? 0,
    change:
      toFiniteNumber(record?.changePercent) ??
      toFiniteNumber(record?.change) ??
      0,
    vwap:
      toFiniteNumber(record?.vwap) ?? toFiniteNumber(record?.vwapAnchor),
  };
}

function normalizeMover(value: unknown): MarketFlashMover {
  const record = asRecord(value);
  const ticker = asString(record?.ticker) ?? "-";
  const catalyst =
    asString(record?.catalyst) ?? asString(record?.reason) ?? "-";
  const sector = inferSectorLabel(
    ticker,
    catalyst,
    asString(record?.sector) ?? asString(record?.company)
  );

  return {
    ticker,
    price:
      toFiniteNumber(record?.price) ??
      toFiniteNumber(record?.preMarketPrice) ??
      0,
    change:
      toFiniteNumber(record?.change) ??
      toFiniteNumber(record?.changePercent) ??
      0,
    catalyst,
    volume:
      toFiniteNumber(record?.volume) ??
      toFiniteNumber(record?.preMarketVolume) ??
      0,
    sector,
    marketCap:
      parseScaledNumber(record?.marketCap) ?? toFiniteNumber(record?.marketCap),
  };
}

function normalizeSetup(value: unknown): MarketFlashSetup {
  const record = asRecord(value);
  const ticker = asString(record?.ticker) ?? "-";
  const catalyst = asString(record?.catalyst) ?? asString(record?.warning) ?? "-";

  return {
    ticker,
    price:
      toFiniteNumber(record?.price) ??
      toFiniteNumber(record?.preMarketPrice) ??
      toFiniteNumber(record?.entry) ??
      0,
    setup: asString(record?.setup) ?? asString(record?.setupType) ?? "-",
    entry: toFiniteNumber(record?.entry) ?? 0,
    stop: toFiniteNumber(record?.stop) ?? 0,
    target: toFiniteNumber(record?.target) ?? 0,
    rr:
      toFiniteNumber(record?.rr) ??
      toFiniteNumber(record?.riskReward) ??
      0,
    expiry: normalizeExpiry(record?.expiry ?? record?.optionType, record?.zeroDTE),
    catalyst,
    sector: inferSectorLabel(
      ticker,
      catalyst,
      asString(record?.sector)
    ),
  };
}

function normalizeEarningsItem(value: unknown): MarketFlashEarningsItem {
  const record = asRecord(value);

  return {
    ticker: asString(record?.ticker) ?? "-",
    company: asString(record?.company),
    time: normalizeEarningsTime(record?.time),
    consensusEps:
      toFiniteNumber(record?.consensusEps) ??
      toFiniteNumber(record?.epsEstimate),
    consensusRev: normalizeRevenueValue(
      record?.consensusRev ?? record?.revenueEstimate
    ),
    priorEps: toFiniteNumber(record?.priorEps ?? record?.previousEps),
    priorRev: normalizeRevenueValue(record?.priorRev ?? record?.previousRevenue),
    expectedMove: asString(record?.expectedMove),
    analystSentiment: normalizeSentiment(record?.analystSentiment),
    consensusRange: asString(record?.consensusRange),
    note: asString(record?.note) ?? asString(record?.warning),
  };
}

function normalizeCarryForward(value: unknown): MarketFlashCarryForward {
  const record = asRecord(value);

  return {
    ticker: asString(record?.ticker) ?? "-",
    todayChange: toFiniteNumber(record?.todayChange) ?? 0,
    gapStatus: normalizeGapStatus(record?.gapStatus),
    bias:
      asString(record?.bias) === "CALL" ||
      asString(record?.bias) === "PUT" ||
      asString(record?.bias) === "NEUTRAL"
        ? (asString(record?.bias) as MarketFlashCarryForward["bias"])
        : "NEUTRAL",
    setupType: asString(record?.setupType) ?? "-",
  };
}

function normalizeMarketFlashReport(value: unknown): MarketFlashReport {
  const record = asRecord(value);
  const marketSummary = asRecord(record?.marketSummary);
  const movers = asRecord(record?.topMovers);

  return {
    reportType: normalizeReportType(record?.reportType),
    reportDate: asString(record?.reportDate) ?? new Date().toISOString().slice(0, 10),
    generatedAt: asString(record?.generatedAt) ?? new Date().toISOString(),
    marketSummary: {
      spy: normalizeIndexQuote(marketSummary?.spy),
      qqq: normalizeIndexQuote(marketSummary?.qqq),
      iwm: normalizeIndexQuote(marketSummary?.iwm),
      vix: normalizeIndexQuote(marketSummary?.vix),
    },
    topMovers: {
      gainers: asRecordArray(movers?.gainers).map(normalizeMover),
      losers: asRecordArray(movers?.losers).map(normalizeMover),
    },
    callSetups: asRecordArray(record?.callSetups).map(normalizeSetup),
    putSetups: asRecordArray(record?.putSetups).map(normalizeSetup),
    earningsCalendar: asRecordArray(record?.earningsCalendar).map(
      normalizeEarningsItem
    ),
    vwapNotes: asString(record?.vwapNotes) ?? "",
    riskAssessment: normalizeRiskAssessment(record?.riskAssessment),
    nextDayCarryForward: asRecordArray(record?.nextDayCarryForward).map(
      normalizeCarryForward
    ),
  };
}

function formatNumber(value: number | null | undefined, decimals = 2) {
  if (!isFiniteNumber(value)) {
    return "-";
  }

  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatCompactNumber(value: number | undefined) {
  if (!isFiniteNumber(value)) {
    return "-";
  }

  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }

  return `$${value}`;
}

function formatVolume(value: number | null | undefined) {
  if (!isFiniteNumber(value)) {
    return "-";
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return String(value);
}

function formatTimestamp(value: string | undefined, language: AppLanguage) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(language === "en" ? "en-US" : "tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: language === "en",
  }).format(parsed);
}

function formatReportDate(value: string | undefined, language: AppLanguage) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(language === "en" ? "en-US" : "tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function getReportTypeLabel(
  reportType: MarketFlashReportType,
  language: AppLanguage
) {
  switch (reportType) {
    case "pre-market":
      return t("marketFlash:preMarketReport");
    case "after-market":
      return t("marketFlash:afterMarketReport");
    default:
      return t("marketFlash:hourlyReport");
  }
}

function changeClass(change: number | null | undefined) {
  if (!isFiniteNumber(change)) {
    return "text-muted-foreground";
  }

  if (change > 0) {
    return "text-emerald-400";
  }
  if (change < 0) {
    return "text-rose-400";
  }
  return "text-muted-foreground";
}

function changeBgClass(change: number | null | undefined) {
  if (!isFiniteNumber(change)) {
    return "border-border bg-background/60";
  }

  if (change > 0) {
    return "border-emerald-500/20 bg-emerald-500/10";
  }
  if (change < 0) {
    return "border-rose-500/20 bg-rose-500/10";
  }
  return "border-border bg-background/60";
}

function inferRiskLevel(report: MarketFlashReport): "low" | "medium" | "high" {
  if (report.riskAssessment.level) {
    return report.riskAssessment.level;
  }

  const detailText = report.riskAssessment.details?.join(" ") ?? "";
  const text = `${report.riskAssessment.summary} ${detailText} ${report.vwapNotes}`.toLowerCase();
  const vix = report.marketSummary.vix?.price ?? 0;

  if (
    text.includes("yüksek") ||
    text.includes("high") ||
    text.includes("panic") ||
    text.includes("crash") ||
    vix > 25
  ) {
    return "high";
  }

  if (
    text.includes("düşük") ||
    text.includes("low") ||
    text.includes("sakin") ||
    vix < 15
  ) {
    return "low";
  }

  return "medium";
}

function isUsMarketOpen() {
  const now = new Date();
  const etFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
    weekday: "short",
    hour12: false,
  });
  const parts = etFormatter.formatToParts(now);
  const hour = Number(parts.find(p => p.type === "hour")?.value || "0");
  const minute = Number(parts.find(p => p.type === "minute")?.value || "0");
  const weekday = parts.find(p => p.type === "weekday")?.value || "";
  const etMinutes = hour * 60 + minute;

  const isWeekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(weekday);
  const marketOpen = 9 * 60 + 30; // 09:30 ET
  const marketClose = 16 * 60; // 16:00 ET

  return isWeekday && etMinutes >= marketOpen && etMinutes < marketClose;
}

function IndexPill({
  label,
  quote,
  language,
  isVix = false,
}: {
  label: string;
  quote: MarketFlashIndexQuote | undefined;
  language: AppLanguage;
  isVix?: boolean;
}) {
  if (!quote) {
    return null;
  }

  const change = isFiniteNumber(quote.change) ? quote.change : 0;
  const positive = change >= 0;

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border px-4 py-3",
        changeBgClass(change)
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        {isVix && isFiniteNumber(quote.price) && quote.price > 20 ? (
          <Badge
            variant="outline"
            className="border-rose-500/25 bg-rose-500/12 text-rose-200 text-[9px]"
          >
            {"VIX"} {formatNumber(quote.price)}
          </Badge>
        ) : null}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-lg font-semibold text-foreground">
          {formatNumber(quote.price)}
        </span>
        <span className={cn("text-sm font-medium", changeClass(change))}>
          {positive ? "+" : ""}
          {formatNumber(change)}%
        </span>
      </div>
      {isFiniteNumber(quote.vwap) ? (
        <p className="mt-1 text-[11px] text-muted-foreground">
          {"VWAP"} {formatNumber(quote.vwap)}
        </p>
      ) : null}
    </div>
  );
}

function MoverRow({
  mover,
  onSelect,
  language,
}: {
  mover: MarketFlashMover;
  onSelect: (mover: MarketFlashMover) => void;
  language: AppLanguage;
}) {
  const positive = mover.change >= 0;

  return (
    <TableRow
      className="cursor-pointer hover:bg-white/[0.03]"
      onClick={() => onSelect(mover)}
    >
      <TableCell className="font-semibold text-foreground">
        {mover.ticker}
      </TableCell>
      <TableCell className="text-foreground/90">
        {formatNumber(mover.price)}
      </TableCell>
      <TableCell className={changeClass(mover.change)}>
        <div className="flex items-center gap-1">
          {positive ? (
            <ArrowUp className="size-3.5" />
          ) : (
            <ArrowDown className="size-3.5" />
          )}
          {positive ? "+" : ""}
          {formatNumber(mover.change)}%
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatVolume(mover.volume)}
      </TableCell>
      <TableCell className="max-w-[200px] truncate text-muted-foreground">
        {mover.catalyst}
      </TableCell>
    </TableRow>
  );
}

function MoversTable({
  title,
  icon: Icon,
  movers,
  onSelect,
  language,
  tone,
}: {
  title: string;
  icon: typeof TrendingUp;
  movers: MarketFlashMover[];
  onSelect: (mover: MarketFlashMover) => void;
  language: AppLanguage;
  tone: "gainer" | "loser";
}) {
  const headers = [
    t("common:ticker"),
    t("common:price"),
    t("common:apexScore"),
    t("common:volume"),
    t("marketFlash:catalyst"),
  ];

  return (
    <Card
      className={cn(
        "overflow-hidden",
        tone === "gainer"
          ? "border-emerald-500/15 bg-emerald-500/[0.05]"
          : "border-rose-500/15 bg-rose-500/[0.05]"
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle
          className={cn(
            "flex items-center gap-2 text-lg",
            tone === "gainer" ? "text-emerald-200" : "text-white"
          )}
        >
          <Icon className="size-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                {headers.map(header => (
                  <TableHead
                    key={header}
                    className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {movers.length ? (
                movers.map(mover => (
                  <MoverRow
                    key={mover.ticker}
                    mover={mover}
                    onSelect={onSelect}
                    language={language}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={headers.length}
                    className="text-sm text-muted-foreground"
                  >
                    {t("marketFlash:noData")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden space-y-2 p-4">
          {movers.length ? (
            movers.map(mover => (
              <button
                key={mover.ticker}
                type="button"
                onClick={() => onSelect(mover)}
                className={cn(
                  "w-full rounded-xl border border-white/10 bg-black/20 p-3 text-left transition-colors hover:bg-white/[0.03]",
                  tone === "gainer"
                    ? "border-l-4 border-l-emerald-500"
                    : "border-l-4 border-l-rose-500"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-foreground">
                    {mover.ticker}
                  </span>
                  <span className={changeClass(mover.change)}>
                    {mover.change >= 0 ? "+" : ""}
                    {formatNumber(mover.change)}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatNumber(mover.price)} · {formatVolume(mover.volume)} ·{" "}
                  {mover.catalyst}
                </p>
              </button>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-black/15 px-4 py-3 text-sm text-muted-foreground">
              {t("marketFlash:noData")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SetupCard({
  setup,
  type,
  language,
}: {
  setup: MarketFlashSetup;
  type: "call" | "put";
  language: AppLanguage;
}) {
  const isCall = type === "call";
  const rrHigh = isFiniteNumber(setup.rr) && setup.rr >= 2.0;
  const is0DTE = setup.expiry === "0DTE";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-black/20 p-4",
        isCall ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-rose-500"
      )}
    >
      {is0DTE ? (
        <div className="absolute right-3 top-3 flex items-center gap-1 text-rose-300">
          <Zap className="size-4" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
            0DTE
          </span>
        </div>
      ) : null}

      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl border",
            isCall
              ? "border-emerald-500/20 bg-emerald-500/10"
              : "border-rose-500/20 bg-rose-500/10"
          )}
        >
          {isCall ? (
            <TrendingUp className="size-5 text-emerald-300" />
          ) : (
            <TrendingDown className="size-5 text-rose-300" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-foreground">
              {setup.ticker}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatNumber(setup.price)}
            </span>
          </div>
          <p className="text-[13px] text-foreground/84">{setup.setup}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl border border-white/10 bg-black/20 px-2.5 py-1.5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {t("common:entry")}
          </p>
          <p className="mt-0.5 font-medium text-foreground">
            {formatNumber(setup.entry)}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-2.5 py-1.5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {"Stop"}
          </p>
          <p className="mt-0.5 font-medium text-rose-300">
            {formatNumber(setup.stop)}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-2.5 py-1.5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {t("marketFlash:target")}
          </p>
          <p className="mt-0.5 font-medium text-emerald-300">
            {formatNumber(setup.target)}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-2.5 py-1.5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {"R/R"}
          </p>
          <p className="mt-0.5 font-medium text-foreground">
            {isFiniteNumber(setup.rr) ? `1:${setup.rr.toFixed(1)}` : "-"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] uppercase tracking-[0.12em]",
            rrHigh
              ? "border-emerald-500/25 bg-emerald-500/12 text-emerald-200"
              : "border-amber-500/25 bg-amber-500/12 text-amber-200"
          )}
        >
          {rrHigh
            ? t("common:high")
            : t("common:medium")}
        </Badge>
        <Badge
          variant="outline"
          className="border-slate-500/25 bg-slate-500/10 text-slate-300 text-[10px] uppercase tracking-[0.12em]"
        >
          {setup.expiry}
        </Badge>
        <span className="text-[11px] text-muted-foreground">
          {setup.sector}
        </span>
      </div>

      <p className="mt-2 text-[12px] leading-5 text-muted-foreground">
        {setup.catalyst}
      </p>
    </div>
  );
}

function EarningsCalendar({
  items,
  language,
}: {
  items: MarketFlashEarningsItem[];
  language: AppLanguage;
}) {
  if (!items.length) {
    return (
      <Card className={cn("overflow-hidden", THEME.softCardClassName)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className={cn("size-5", THEME.iconClassName)} />
            {t("marketFlash:earningsCalendar")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-dashed border-white/10 bg-black/15 px-4 py-3 text-sm text-muted-foreground">
            {t("marketFlash:noEarningsOnTheCalendar")}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", THEME.softCardClassName)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarDays className={cn("size-5", THEME.iconClassName)} />
          {t("marketFlash:earningsCalendar")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {items.map(item => {
            const metrics = [
              isFiniteNumber(item.consensusEps)
                ? {
                    label: t("marketFlash:consensusEps"),
                    value: `$${formatNumber(item.consensusEps)}`,
                  }
                : null,
              isFiniteNumber(item.consensusRev)
                ? {
                    label: t("marketFlash:consensusRev"),
                    value: `$${formatCompactNumber(item.consensusRev)}`,
                  }
                : null,
              isFiniteNumber(item.priorEps)
                ? {
                    label: t("marketFlash:priorEps"),
                    value: `$${formatNumber(item.priorEps)}`,
                  }
                : null,
              isFiniteNumber(item.priorRev)
                ? {
                    label: t("marketFlash:priorRev"),
                    value: `$${formatCompactNumber(item.priorRev)}`,
                  }
                : null,
            ].filter(
              (
                metric
              ): metric is {
                label: string;
                value: string;
              } => Boolean(metric)
            );

            return (
              <AccordionItem
                key={item.ticker}
                value={item.ticker}
                className="border-b border-white/10 last:border-b-0"
              >
                <AccordionTrigger className="py-3 text-sm hover:no-underline">
                  <div className="flex w-full items-center justify-between pr-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-foreground">
                          {item.ticker}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] uppercase tracking-[0.12em]",
                            item.time === "before-open"
                              ? "border-emerald-500/25 bg-emerald-500/12 text-emerald-200"
                              : item.time === "after-close"
                                ? "border-violet-500/25 bg-violet-500/12 text-violet-200"
                                : "border-amber-500/25 bg-amber-500/12 text-amber-200"
                          )}
                        >
                          {item.time === "before-open"
                            ? "BMO"
                            : item.time === "after-close"
                              ? "AMC"
                              : "Intraday"}
                        </Badge>
                      </div>
                      {item.company ? (
                        <p className="mt-1 truncate text-[12px] text-muted-foreground">
                          {item.company}
                        </p>
                      ) : null}
                    </div>
                    {item.expectedMove ? (
                      <span className="text-[12px] text-muted-foreground">
                        {t("marketFlash:move")} {item.expectedMove}
                      </span>
                    ) : null}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {metrics.length ? (
                    <div className="grid gap-2 pb-2 sm:grid-cols-2">
                      {metrics.map(metric => (
                        <div
                          key={metric.label}
                          className="rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                        >
                          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {metric.label}
                          </p>
                          <p className="mt-0.5 text-foreground">{metric.value}</p>
                        </div>
                      ))}
                      {item.consensusRange ? (
                        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 sm:col-span-2">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {t("marketFlash:consensusRange")}
                          </p>
                          <p className="mt-0.5 text-foreground">{item.consensusRange}</p>
                        </div>
                      ) : null}
                      {item.analystSentiment ? (
                        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 sm:col-span-2">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {t("marketFlash:analystSentiment")}
                          </p>
                          <p className="mt-0.5 capitalize text-foreground">
                            {item.analystSentiment}
                          </p>
                        </div>
                      ) : null}
                      {item.note ? (
                        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 sm:col-span-2">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {t("marketFlash:note")}
                          </p>
                          <p className="mt-0.5 text-foreground">{item.note}</p>
                        </div>
                      ) : null}
                    </div>
                  ) : item.note || item.consensusRange || item.analystSentiment ? (
                    <div className="grid gap-2 pb-2 sm:grid-cols-2">
                      {item.consensusRange ? (
                        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 sm:col-span-2">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {t("marketFlash:consensusRange")}
                          </p>
                          <p className="mt-0.5 text-foreground">{item.consensusRange}</p>
                        </div>
                      ) : null}
                      {item.analystSentiment ? (
                        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 sm:col-span-2">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {t("marketFlash:analystSentiment")}
                          </p>
                          <p className="mt-0.5 capitalize text-foreground">
                            {item.analystSentiment}
                          </p>
                        </div>
                      ) : null}
                      {item.note ? (
                        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 sm:col-span-2">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {t("marketFlash:note")}
                          </p>
                          <p className="mt-0.5 text-foreground">{item.note}</p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function RiskAlert({
  report,
  language,
}: {
  report: MarketFlashReport;
  language: AppLanguage;
}) {
  const level = inferRiskLevel(report);

  const config = {
    low: {
      icon: Info,
      title: t("marketFlash:lowRisk"),
      className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-100",
    },
    medium: {
      icon: AlertTriangle,
      title: t("marketFlash:mediumRisk"),
      className: "border-amber-500/25 bg-amber-500/10 text-amber-100",
    },
    high: {
      icon: Flame,
      title: t("marketFlash:highRisk"),
      className: "border-rose-500/25 bg-rose-500/10 text-rose-100",
    },
  }[level];

  const Icon = config.icon;
  const riskTitle = report.riskAssessment.title || config.title;
  const riskDetails = report.riskAssessment.details ?? [];

  return (
    <Alert
      className={cn(
        "rounded-xl border",
        config.className
      )}
    >
      <Icon className="size-4" />
      <AlertTitle className="flex items-center justify-between gap-3">
        <span>{riskTitle}</span>
        <Badge
          variant="outline"
          className="border-white/15 bg-black/20 text-[10px] uppercase tracking-[0.14em] text-current"
        >
          {(language === "en" ? level : level === "high" ? "Yuksek" : level === "low" ? "Dusuk" : "Orta")}
        </Badge>
      </AlertTitle>
      <AlertDescription className="text-foreground/80">
        <p>{report.riskAssessment.summary}</p>
        {riskDetails.length ? (
          <ul className="mt-2 space-y-1 text-[12px] leading-5 text-foreground/70">
            {riskDetails.map(detail => (
              <li key={detail}>• {detail}</li>
            ))}
          </ul>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}

function CarryForwardTable({
  items,
  language,
}: {
  items: MarketFlashCarryForward[];
  language: AppLanguage;
}) {
  const headers = [
    t("common:ticker"),
    t("marketFlash:today"),
    "Gap",
    "Bias",
    "Setup",
  ];

  return (
    <Card className={cn("overflow-hidden", THEME.softCardClassName)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className={cn("size-5", THEME.iconClassName)} />
          {t("marketFlash:carryForward")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                {headers.map(header => (
                  <TableHead
                    key={header}
                    className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length ? (
                items.map(item => (
                  <TableRow key={item.ticker}>
                    <TableCell className="font-semibold text-foreground">
                      {item.ticker}
                    </TableCell>
                    <TableCell className={changeClass(item.todayChange)}>
                      {item.todayChange >= 0 ? "+" : ""}
                      {formatNumber(item.todayChange)}%
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.gapStatus.replace(/-/g, " ")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] uppercase tracking-[0.12em]",
                          item.bias === "CALL"
                            ? "border-emerald-500/25 bg-emerald-500/12 text-emerald-200"
                            : item.bias === "PUT"
                              ? "border-rose-500/25 bg-rose-500/12 text-rose-200"
                              : "border-amber-500/25 bg-amber-500/12 text-amber-200"
                        )}
                      >
                        {item.bias}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.setupType}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={headers.length}
                    className="text-sm text-muted-foreground"
                  >
                    {t("marketFlash:noData")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden space-y-2 p-4">
          {items.length ? (
            items.map(item => (
              <div
                key={item.ticker}
                className="rounded-xl border border-white/10 bg-black/20 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-foreground">
                    {item.ticker}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] uppercase tracking-[0.12em]",
                      item.bias === "CALL"
                        ? "border-emerald-500/25 bg-emerald-500/12 text-emerald-200"
                        : item.bias === "PUT"
                          ? "border-rose-500/25 bg-rose-500/12 text-rose-200"
                          : "border-amber-500/25 bg-amber-500/12 text-amber-200"
                    )}
                  >
                    {item.bias}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatNumber(item.todayChange)}% · {item.gapStatus.replace(/-/g, " ")} ·{" "}
                  {item.setupType}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-black/15 px-4 py-3 text-sm text-muted-foreground">
              {t("marketFlash:noData")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StockDetailModal({
  mover,
  open,
  onClose,
  language,
}: {
  mover: MarketFlashMover | null;
  open: boolean;
  onClose: () => void;
  language: AppLanguage;
}) {
  if (!mover) {
    return null;
  }

  const [low52, high52] = mover.week52Range ?? [0, 0];
  const range = high52 - low52;
  const position = range > 0 ? ((mover.price - low52) / range) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md border-border bg-card/95 text-card-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="size-5 text-violet-300" />
            {mover.ticker}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mover.sector}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-foreground">
              {formatNumber(mover.price)}
            </span>
            <span className={cn("text-lg font-medium", changeClass(mover.change))}>
              {mover.change >= 0 ? "+" : ""}
              {formatNumber(mover.change)}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {"Market Cap"}
              </p>
              <p className="mt-1 text-foreground">
                {isFiniteNumber(mover.marketCap)
                  ? formatCompactNumber(mover.marketCap)
                  : t("marketFlash:dataUnavailable")}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {t("common:volume")}
              </p>
              <p className="mt-1 text-foreground">{formatVolume(mover.volume)}</p>
            </div>
          </div>

          {mover.week52Range ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{t("marketFlash:52wLow")} {formatNumber(low52)}</span>
                <span>{t("marketFlash:52wHigh")} {formatNumber(high52)}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-violet-400"
                  style={{ width: `${Math.max(0, Math.min(100, position))}%` }}
                />
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {t("marketFlash:catalyst")}
            </p>
            <p className="mt-1 text-[13px] leading-5 text-foreground/88">
              {mover.catalyst}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MarketFlash() {
  const language = useAppLanguage();
  const [report, setReport] = useState<MarketFlashReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [selectedMover, setSelectedMover] = useState<MarketFlashMover | null>(null);

  usePageMeta({
    description: t("marketFlash:marketFlashCombinesTheIntraday"),
    title: `Gistify | ${t("common:marketFlash")}`,
  });

  const pollIntervalMs = useMemo(() => {
    return isUsMarketOpen() ? DEFAULT_POLL_INTERVAL_MS : OFF_MARKET_POLL_INTERVAL_MS;
  }, []);

  const loadReport = useCallback(
    async (silent = false) => {
      if (!silent) {
        setLoading(true);
      }
      setRefreshing(true);

      try {
        const url = `/api/marketflash?t=${Date.now()}`;
        const response = await fetch(url, {
          cache: "no-store",
          credentials: "same-origin",
        });

        if (!response.ok) {
          throw new Error(
            t("marketFlash:failedToLoadMarketFlash")
          );
        }

        setReport(normalizeMarketFlashReport(await response.json()));
        setError(null);
      } catch (loadError) {
        setError(
          loadError instanceof Error && loadError.message
            ? loadError.message
            : t("marketFlash:failedToLoadMarketFlash")
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [language]
  );

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const timer = window.setInterval(
      () => void loadReport(true),
      pollIntervalMs
    );

    return () => window.clearInterval(timer);
  }, [loadReport, autoRefresh, pollIntervalMs]);

  if (loading && !report) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-6 md:py-8">
          <WorkspaceLoadingState
            label={t("marketFlash:loadingMarketFlash")}
          />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-6 md:py-8">
          <WorkspaceLoadingState
            label={
              error ||
              t("marketFlash:thereIsNoMarketFlash")
            }
          />
        </div>
      </div>
    );
  }

  const summary = report.marketSummary;
  const showCarryForward = report.reportType === "after-market";

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <section
          className={cn(
            "overflow-hidden rounded-xl border p-[1px]",
            THEME.shellClassName
          )}
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-xl p-4 md:p-6",
              THEME.innerClassName
            )}
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b",
                THEME.glowClassName
              )}
            />

            <div className="relative space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        THEME.lineClassName
                      )}
                    />
                    <p
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-[0.18em]",
                        THEME.eyebrowClassName
                      )}
                    >
                      {"Market Flash"}
                    </p>
                  </div>
                  <h1 className="mt-2 heading-condensed text-[1.65rem] leading-none text-foreground md:text-[1.9rem]">
                    {getReportTypeLabel(report.reportType, language)}
                  </h1>
                  <p className="mt-2 text-[13px] leading-6 text-foreground/82">
                    {formatReportDate(report.reportDate, language)} ·{" "}
                    {t("marketFlash:lastUpdated")}{" "}
                    {formatTimestamp(report.generatedAt, language)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] uppercase tracking-[0.14em]",
                      report.reportType === "pre-market"
                        ? "border-emerald-500/25 bg-emerald-500/12 text-emerald-200"
                        : report.reportType === "after-market"
                          ? "border-violet-500/25 bg-violet-500/12 text-violet-200"
                          : "border-amber-500/25 bg-amber-500/12 text-amber-200"
                    )}
                  >
                    {report.reportType.toUpperCase()}
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void loadReport()}
                    disabled={refreshing}
                    className="bg-background/70"
                  >
                    <RefreshCw
                      className={cn("mr-1.5 size-4", refreshing && "animate-spin")}
                    />
                    {t("common:refresh")}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAutoRefresh(current => !current)}
                    className={cn(
                      "bg-background/70",
                      autoRefresh &&
                        "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                    )}
                  >
                    <Clock className="mr-1.5 size-4" />
                    {autoRefresh
                      ? t("marketFlash:autoRefreshOn")
                      : t("marketFlash:autoRefreshOff")}
                  </Button>
                </div>
              </div>

              {error ? (
                <div className="flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  {error}
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <IndexPill label="SPY" quote={summary.spy} language={language} />
                <IndexPill label="QQQ" quote={summary.qqq} language={language} />
                <IndexPill label="IWM" quote={summary.iwm} language={language} />
                <IndexPill
                  label="VIX"
                  quote={summary.vix}
                  language={language}
                  isVix
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <MoversTable
                  title={"Gainers"}
                  icon={TrendingUp}
                  movers={report.topMovers.gainers}
                  onSelect={setSelectedMover}
                  language={language}
                  tone="gainer"
                />
                <MoversTable
                  title={"Losers"}
                  icon={TrendingDown}
                  movers={report.topMovers.losers}
                  onSelect={setSelectedMover}
                  language={language}
                  tone="loser"
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="overflow-hidden border-emerald-500/15 bg-emerald-500/[0.05]">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg text-emerald-200">
                      <Target className="size-5" />
                      {t("marketFlash:callSetups")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {report.callSetups.length ? (
                      report.callSetups.map((setup, index) => (
                        <SetupCard
                          key={`${setup.ticker}-${setup.setup}-${index}`}
                          setup={setup}
                          type="call"
                          language={language}
                        />
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-white/10 bg-black/15 px-4 py-3 text-sm text-muted-foreground">
                        {t("marketFlash:noCallSetups")}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-rose-500/15 bg-rose-500/[0.05]">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg text-rose-200">
                      <Target className="size-5" />
                      {t("marketFlash:putSetups")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {report.putSetups.length ? (
                      report.putSetups.map((setup, index) => (
                        <SetupCard
                          key={`${setup.ticker}-${setup.setup}-${index}`}
                          setup={setup}
                          type="put"
                          language={language}
                        />
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-white/10 bg-black/15 px-4 py-3 text-sm text-muted-foreground">
                        {t("marketFlash:noPutSetups")}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  <EarningsCalendar
                    items={report.earningsCalendar}
                    language={language}
                  />

                  <Card className={cn("overflow-hidden", THEME.softCardClassName)}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart3 className={cn("size-5", THEME.iconClassName)} />
                        {t("marketFlash:vwapTechnicalNotes")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MarkdownReportRenderer
                        language={language}
                        markdown={report.vwapNotes}
                        emptyMessage={t("marketFlash:noTechnicalNotes")}
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <RiskAlert report={report} language={language} />

                  {showCarryForward ? (
                    <CarryForwardTable
                      items={report.nextDayCarryForward}
                      language={language}
                    />
                  ) : null}

                  <Card className={cn("overflow-hidden", THEME.softCardClassName)}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Info className={cn("size-5", THEME.iconClassName)} />
                        {t("marketFlash:dataSource")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-[12px] text-muted-foreground">
                        <p>
                          {t("marketFlash:reportIsGeneratedAndOverwritten")}
                        </p>
                        <p className="flex items-center gap-1 text-foreground/70">
                          <ChevronRight className="size-3" />
                          <code className="rounded bg-black/20 px-1.5 py-0.5 text-[11px]">
                            /api/marketflash
                          </code>
                        </p>
                        <p>
                          {t("marketFlash:refreshInterval")}
                          <span className="text-foreground">
                            {isUsMarketOpen()
                              ? "60s"
                              : "5m"}
                          </span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <StockDetailModal
        mover={selectedMover}
        open={Boolean(selectedMover)}
        onClose={() => setSelectedMover(null)}
        language={language}
      />
    </div>
  );
}

