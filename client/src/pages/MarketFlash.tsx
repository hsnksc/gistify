import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  MarketFlashCarryForward,
  MarketFlashEarningsItem,
  MarketFlashIndexQuote,
  MarketFlashMarketSummary,
  MarketFlashMover,
  MarketFlashReport,
  MarketFlashReportType,
  MarketFlashSetup,
} from "@shared/marketFlash";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  CalendarDays,
  ChevronRight,
  Clock,
  Flame,
  History,
  Info,
  RefreshCw,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import WorkspaceLoadingState from "@/components/workspace/WorkspaceLoadingState";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MarkdownReportRenderer from "@/components/reports/MarkdownReportRenderer";
import { copy, type AppLanguage } from "@/lib/i18n";
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

function formatNumber(value: number, decimals = 2) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatCompactNumber(value: number | undefined) {
  if (value === undefined || Number.isNaN(value)) {
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

function formatVolume(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return String(value);
}

function formatTimestamp(value: string | undefined) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function getReportTypeLabel(
  reportType: MarketFlashReportType,
  language: AppLanguage
) {
  switch (reportType) {
    case "pre-market":
      return copy(language, "Pre-Market Raporu", "Pre-Market Report");
    case "after-market":
      return copy(language, "After-Market Raporu", "After-Market Report");
    default:
      return copy(language, "Saatlik Rapor", "Hourly Report");
  }
}

function changeClass(change: number) {
  if (change > 0) {
    return "text-emerald-400";
  }
  if (change < 0) {
    return "text-rose-400";
  }
  return "text-muted-foreground";
}

function changeBgClass(change: number) {
  if (change > 0) {
    return "border-emerald-500/20 bg-emerald-500/10";
  }
  if (change < 0) {
    return "border-rose-500/20 bg-rose-500/10";
  }
  return "border-border bg-background/60";
}

function inferRiskLevel(report: MarketFlashReport): "low" | "medium" | "high" {
  const text = `${report.riskAssessment} ${report.vwapNotes}`.toLowerCase();
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
  isVix = false,
}: {
  label: string;
  quote: MarketFlashIndexQuote | undefined;
  isVix?: boolean;
}) {
  if (!quote) {
    return null;
  }

  const change = quote.change;
  const positive = change >= 0;

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border px-4 py-3",
        changeBgClass(change)
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        {isVix && quote.price > 20 ? (
          <Badge
            variant="outline"
            className="border-rose-500/25 bg-rose-500/12 text-rose-200 text-[9px]"
          >
            VIX {quote.price.toFixed(2)}
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
      {quote.vwap ? (
        <p className="mt-1 text-[11px] text-muted-foreground">
          VWAP {formatNumber(quote.vwap)}
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
    copy(language, "Hisse", "Ticker"),
    copy(language, "Fiyat", "Price"),
    copy(language, "Degisim", "Change"),
    copy(language, "Hacim", "Volume"),
    copy(language, "Katalizor", "Catalyst"),
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
            tone === "gainer" ? "text-emerald-200" : "text-rose-200"
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
                    {copy(language, "Veri yok.", "No data.")}
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
                  "w-full rounded-2xl border border-white/10 bg-black/20 p-3 text-left transition-colors hover:bg-white/[0.03]",
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
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/15 px-4 py-3 text-sm text-muted-foreground">
              {copy(language, "Veri yok.", "No data.")}
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
  const rrHigh = setup.rr >= 2.0;
  const is0DTE = setup.expiry === "0DTE";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4",
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
            Entry
          </p>
          <p className="mt-0.5 font-medium text-foreground">
            {formatNumber(setup.entry)}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-2.5 py-1.5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Stop
          </p>
          <p className="mt-0.5 font-medium text-rose-300">
            {formatNumber(setup.stop)}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-2.5 py-1.5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Target
          </p>
          <p className="mt-0.5 font-medium text-emerald-300">
            {formatNumber(setup.target)}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-2.5 py-1.5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            R/R
          </p>
          <p className="mt-0.5 font-medium text-foreground">
            1:{setup.rr.toFixed(1)}
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
            ? copy(language, "Yuksek", "High")
            : copy(language, "Orta", "Medium")}
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
            {copy(language, "Earnings Takvimi", "Earnings Calendar")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/15 px-4 py-3 text-sm text-muted-foreground">
            {copy(language, "Bugun earnings takvimi bos.", "No earnings on the calendar today.")}
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
          {copy(language, "Earnings Takvimi", "Earnings Calendar")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {items.map(item => (
            <AccordionItem
              key={item.ticker}
              value={item.ticker}
              className="border-b border-white/10 last:border-b-0"
            >
              <AccordionTrigger className="py-3 text-sm hover:no-underline">
                <div className="flex w-full items-center justify-between pr-4">
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
                  <span className="text-[12px] text-muted-foreground">
                    Move {item.expectedMove || "-"}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2 pb-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {copy(language, "EPS Beklenen", "Consensus EPS")}
                    </p>
                    <p className="mt-0.5 text-foreground">
                      {item.consensusEps ? `$${formatNumber(item.consensusEps)}` : "-"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {copy(language, "Rev Beklenen", "Consensus Rev")}
                    </p>
                    <p className="mt-0.5 text-foreground">
                      {item.consensusRev ? `$${formatCompactNumber(item.consensusRev)}` : "-"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {copy(language, "Onceki EPS", "Prior EPS")}
                    </p>
                    <p className="mt-0.5 text-foreground">
                      {item.priorEps ? `$${formatNumber(item.priorEps)}` : "-"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {copy(language, "Onceki Rev", "Prior Rev")}
                    </p>
                    <p className="mt-0.5 text-foreground">
                      {item.priorRev ? `$${formatCompactNumber(item.priorRev)}` : "-"}
                    </p>
                  </div>
                  {item.consensusRange ? (
                    <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 sm:col-span-2">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {copy(language, "Konsensus Araligi", "Consensus Range")}
                      </p>
                      <p className="mt-0.5 text-foreground">{item.consensusRange}</p>
                    </div>
                  ) : null}
                  {item.analystSentiment ? (
                    <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 sm:col-span-2">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {copy(language, "Analist Gorusu", "Analyst Sentiment")}
                      </p>
                      <p className="mt-0.5 capitalize text-foreground">
                        {item.analystSentiment}
                      </p>
                    </div>
                  ) : null}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
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
      title: copy(language, "Dusuk Risk", "Low Risk"),
      className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-100",
    },
    medium: {
      icon: AlertTriangle,
      title: copy(language, "Orta Risk", "Medium Risk"),
      className: "border-amber-500/25 bg-amber-500/10 text-amber-100",
    },
    high: {
      icon: Flame,
      title: copy(language, "Yuksek Risk", "High Risk"),
      className: "border-rose-500/25 bg-rose-500/10 text-rose-100",
    },
  }[level];

  const Icon = config.icon;

  return (
    <Alert
      className={cn(
        "rounded-2xl border",
        config.className
      )}
    >
      <Icon className="size-4" />
      <AlertTitle>{config.title}</AlertTitle>
      <AlertDescription className="text-foreground/80">
        {report.riskAssessment}
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
    copy(language, "Hisse", "Ticker"),
    copy(language, "Bugun %", "Today %"),
    copy(language, "Gap", "Gap"),
    copy(language, "Bias", "Bias"),
    copy(language, "Setup", "Setup"),
  ];

  return (
    <Card className={cn("overflow-hidden", THEME.softCardClassName)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className={cn("size-5", THEME.iconClassName)} />
          {copy(language, "Yarina Tasinanlar", "Carry Forward")}
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
                    {copy(language, "Veri yok.", "No data.")}
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
                className="rounded-2xl border border-white/10 bg-black/20 p-3"
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
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/15 px-4 py-3 text-sm text-muted-foreground">
              {copy(language, "Veri yok.", "No data.")}
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
                {copy(language, "Market Cap", "Market Cap")}
              </p>
              <p className="mt-1 text-foreground">
                {formatCompactNumber(mover.marketCap)}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {copy(language, "Hacim", "Volume")}
              </p>
              <p className="mt-1 text-foreground">{formatVolume(mover.volume)}</p>
            </div>
          </div>

          {mover.week52Range ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>52W Low {formatNumber(low52)}</span>
                <span>52W High {formatNumber(high52)}</span>
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
              {copy(language, "Katalizor", "Catalyst")}
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

export default function MarketFlash({ language }: { language: AppLanguage }) {
  const [report, setReport] = useState<MarketFlashReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [selectedMover, setSelectedMover] = useState<MarketFlashMover | null>(null);

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
        const url = `/marketflash/marketflash_report.json?t=${Date.now()}`;
        const response = await fetch(url, {
          cache: "no-store",
          credentials: "same-origin",
        });

        if (!response.ok) {
          throw new Error(
            copy(
              language,
              "Market Flash raporu yuklenemedi.",
              "Failed to load Market Flash report."
            )
          );
        }

        setReport((await response.json()) as MarketFlashReport);
        setError(null);
      } catch (loadError) {
        setError(
          loadError instanceof Error && loadError.message
            ? loadError.message
            : copy(
                language,
                "Market Flash raporu yuklenemedi.",
                "Failed to load Market Flash report."
              )
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
            label={copy(
              language,
              "Market Flash yukleniyor.",
              "Loading Market Flash."
            )}
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
              copy(
                language,
                "Henuz Market Flash raporu bulunmuyor.",
                "There is no Market Flash report yet."
              )
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
            "overflow-hidden rounded-[1.8rem] border p-[1px]",
            THEME.shellClassName
          )}
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-[1.75rem] p-4 md:p-5",
              THEME.innerClassName
            )}
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b",
                THEME.glowClassName
              )}
            />

            <div className="relative space-y-5">
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
                      {copy(language, "Market Flash", "Market Flash")}
                    </p>
                  </div>
                  <h1 className="mt-2 heading-condensed text-[1.65rem] leading-none text-foreground md:text-[1.9rem]">
                    {getReportTypeLabel(report.reportType, language)}
                  </h1>
                  <p className="mt-2 text-[13px] leading-6 text-foreground/82">
                    {report.reportDate} ·{" "}
                    {copy(
                      language,
                      "Son guncelleme",
                      "Last update"
                    )}{" "}
                    {formatTimestamp(report.generatedAt)}
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
                    {copy(language, "Yenile", "Refresh")}
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
                      ? copy(language, "Oto. yenileme acik", "Auto refresh on")
                      : copy(language, "Oto. yenileme kapali", "Auto refresh off")}
                  </Button>
                </div>
              </div>

              {error ? (
                <div className="flex items-start gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  {error}
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <IndexPill label="SPY" quote={summary.spy} />
                <IndexPill label="QQQ" quote={summary.qqq} />
                <IndexPill label="IWM" quote={summary.iwm} />
                <IndexPill label="VIX" quote={summary.vix} isVix />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <MoversTable
                  title={copy(language, "Gainers", "Gainers")}
                  icon={TrendingUp}
                  movers={report.topMovers.gainers}
                  onSelect={setSelectedMover}
                  language={language}
                  tone="gainer"
                />
                <MoversTable
                  title={copy(language, "Losers", "Losers")}
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
                      {copy(language, "CALL Setup'lari", "CALL Setups")}
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
                      <div className="rounded-2xl border border-dashed border-white/10 bg-black/15 px-4 py-3 text-sm text-muted-foreground">
                        {copy(language, "CALL setup'i yok.", "No CALL setups.")}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-rose-500/15 bg-rose-500/[0.05]">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg text-rose-200">
                      <Target className="size-5" />
                      {copy(language, "PUT Setup'lari", "PUT Setups")}
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
                      <div className="rounded-2xl border border-dashed border-white/10 bg-black/15 px-4 py-3 text-sm text-muted-foreground">
                        {copy(language, "PUT setup'i yok.", "No PUT setups.")}
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
                        {copy(language, "VWAP & Teknik Notlar", "VWAP & Technical Notes")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MarkdownReportRenderer
                        language={language}
                        markdown={report.vwapNotes}
                        emptyMessage={copy(
                          language,
                          "Teknik not bulunmuyor.",
                          "No technical notes."
                        )}
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
                        {copy(language, "Veri Kaynagi", "Data Source")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-[12px] text-muted-foreground">
                        <p>
                          {copy(
                            language,
                            "Rapor her piyasa saati boyunca Kimi tarafindan uretilir ve uzerine yazilir.",
                            "Report is generated and overwritten by Kimi during market hours."
                          )}
                        </p>
                        <p className="flex items-center gap-1 text-foreground/70">
                          <ChevronRight className="size-3" />
                          <code className="rounded bg-black/20 px-1.5 py-0.5 text-[11px]">
                            /marketflash/marketflash_report.json
                          </code>
                        </p>
                        <p>
                          {copy(
                            language,
                            "Yenileme araligi: ",
                            "Refresh interval: "
                          )}
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
