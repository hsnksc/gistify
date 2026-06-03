import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BookmarkCheck,
  BookmarkPlus,
  CalendarDays,
  ChevronRight,
  Gauge,
  Radar as RadarIcon,
  RefreshCw,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import type {
  OpportunityRecord,
  OpportunityTier,
  WatchlistRecord,
} from "@shared/opportunities";
import type { WeeklyReportEntry, WeeklyReportRecord } from "@shared/weeklyReports";
import { Button } from "@/components/ui/button";
import {
  biasLabels,
  formatAnalysisDate,
  formatCalendarDay,
  formatWeekRange,
  getReportSummary,
  groupEntriesByDay,
  riskLabels,
  sortReportsNewestFirst,
  strategyPresentation,
} from "@/lib/weeklyReports";
import { useLocation } from "wouter";

type ReportTabId =
  | "overview"
  | "calendar"
  | "ivcrush"
  | "stocks"
  | "options"
  | "signals";

interface WeeklyReportsApiResponse {
  reports?: WeeklyReportRecord[];
  admin?: {
    authorized?: boolean;
    email?: string;
  };
}

interface OpportunitiesApiResponse {
  data?: OpportunityRecord[];
  meta?: {
    total?: number;
    tier?: OpportunityTier;
  };
}

interface WatchlistApiResponse {
  items?: WatchlistRecord[];
}

const REPORT_TABS: Array<{
  id: ReportTabId;
  label: string;
  icon: typeof Sparkles;
}> = [
  { id: "overview", label: "Genel Bakis", icon: Sparkles },
  { id: "calendar", label: "Takvim", icon: CalendarDays },
  { id: "ivcrush", label: "IV Crush", icon: RadarIcon },
  { id: "stocks", label: "Hisse Analizi", icon: TrendingUp },
  { id: "options", label: "Opsiyon Plani", icon: WalletCards },
  { id: "signals", label: "Firsatlar", icon: Target },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
        {eyebrow}
      </p>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {description ? (
        <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card/90 p-4 shadow-xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

function OpportunityPanel({
  items,
  total,
  tier,
  watchlistTickers,
  loading,
  error,
  busyTicker,
  onRefresh,
  onToggleWatchlist,
}: {
  items: OpportunityRecord[];
  total: number;
  tier: OpportunityTier;
  watchlistTickers: Set<string>;
  loading: boolean;
  error: string;
  busyTicker?: string;
  onRefresh: () => void;
  onToggleWatchlist: (opportunity: OpportunityRecord) => void;
}) {
  return (
    <div className="space-y-4">
      <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHeading
            eyebrow="Opportunity Projection"
            title="Published haftalardan turetilen aktif setup'lar"
            description="Bu alan v3 agent dokumanindaki ilk uygulanan katmandir. Firsatlar su an admin tarafindan yayinlanan weekly report'lardan projection olarak uretilir."
          />
          <Button type="button" variant="outline" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Yenile
          </Button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Aktif Firsat"
            value={String(total)}
            hint="Yayinlanmis ve halen aktif olan projection kayitlari"
          />
          <MetricCard
            label="Gorunen Kart"
            value={String(items.length)}
            hint="UI tarafinda ilk sayfada render edilen kayitlar"
          />
          <MetricCard
            label="Tier"
            value={tier.toUpperCase()}
            hint="API tier filtresi buna gore uygulanir"
          />
        </div>
      </section>

      {error ? (
        <section className="rounded-[2rem] border border-destructive/30 bg-card/90 p-5 shadow-xl">
          <p className="text-sm text-destructive">{error}</p>
        </section>
      ) : null}

      {!loading && !items.length ? (
        <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <p className="text-base font-semibold text-foreground">Aktif firsat yok</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Admin yeni haftayi publish ettiginde veya projection tekrar calistirildiginda
            burada kartlar olusur.
          </p>
        </section>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {items.map(item => {
          const isSaved = watchlistTickers.has(item.ticker);
          const disabled = busyTicker === item.ticker;

          return (
            <article
              key={item.id}
              className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                      {item.ticker}
                    </span>
                    <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {item.tierRequired}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.sector} · {item.daysToEarnings} gun kala · {item.earningsTime}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Composite
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">
                    {item.compositeScore}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {[
                  ["IV Crush", `%${item.expectedIVCrush}`],
                  ["Momentum", String(item.momentumScore)],
                  ["Beat Rate", `%${item.beatRate}`],
                  ["Target", `%${item.targetProfitPercent}`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-border bg-background/60 p-3"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-3xl border border-border bg-background/60 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Strategy
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {item.recommendedStrategy}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.aiStrategyRationale}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {item.aiKeyCatalysts.slice(0, 3).map(catalyst => (
                    <span
                      key={catalyst}
                      className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
                    >
                      {catalyst}
                    </span>
                  ))}
                </div>
                <Button
                  type="button"
                  variant={isSaved ? "secondary" : "outline"}
                  onClick={() => onToggleWatchlist(item)}
                  disabled={disabled}
                >
                  {isSaved ? (
                    <BookmarkCheck className="size-4" />
                  ) : (
                    <BookmarkPlus className="size-4" />
                  )}
                  {disabled
                    ? "Kaydediliyor"
                    : isSaved
                      ? "Watchlist'ten cikar"
                      : "Watchlist'e ekle"}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function StockPills({
  entries,
  selectedTicker,
  onSelect,
}: {
  entries: WeeklyReportEntry[];
  selectedTicker?: string;
  onSelect: (ticker: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(entry => {
        const active = entry.ticker === selectedTicker;
        const rating = strategyPresentation[entry.strategyRating];

        return (
          <button
            key={entry.id}
            type="button"
            onClick={() => onSelect(entry.ticker)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              active
                ? rating.badgeClass
                : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            {entry.ticker}
          </button>
        );
      })}
    </div>
  );
}

function OverviewPanel({
  report,
  onSelectTicker,
}: {
  report: WeeklyReportRecord;
  onSelectTicker: (ticker: string) => void;
}) {
  const summary = getReportSummary(report);
  const chartData = report.content.entries.slice(0, 6).map(entry => ({
    ticker: entry.ticker,
    momentum: entry.momentumScore,
    ivCrush: entry.expectedIVCrush,
    color: strategyPresentation[entry.strategyRating].color,
  }));
  const sectorData = Array.from(
    report.content.entries.reduce((map, entry) => {
      const current = map.get(entry.sector) || { total: 0, count: 0 };
      current.total += entry.ivCrushScore;
      current.count += 1;
      map.set(entry.sector, current);
      return map;
    }, new Map<string, { total: number; count: number }>())
  ).map(([sector, value]) => ({
    sector,
    score: Math.round(value.total / value.count),
  }));

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="space-y-4">
            <SectionHeading
              eyebrow="Haftalik Baslik"
              title={report.content.headline}
              description={report.content.summary}
            />
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="rounded-full border border-border bg-background/70 px-3 py-1.5">
                Aralik: {formatWeekRange(report)}
              </span>
              <span className="rounded-full border border-border bg-background/70 px-3 py-1.5">
                Analiz: {formatAnalysisDate(report.analysisDate)}
              </span>
              <span className="rounded-full border border-border bg-background/70 px-3 py-1.5">
                {report.content.entries.length} hisse
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Makro Baglam
            </p>
            <p className="mt-3 text-sm leading-relaxed text-emerald-100/90">
              {report.content.marketContext}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Toplam Hisse"
          value={String(summary.totalEntries)}
          hint="Hafta boyunca izlenen earnings adedi"
        />
        <MetricCard
          label="Mukemmel Setup"
          value={String(summary.excellentCount)}
          hint="EXCELLENT rating ile gelen firsatlar"
        />
        <MetricCard
          label="Ort. IV Crush"
          value={`%${summary.avgIvCrush}`}
          hint="Prim bosalmasi beklenen ortalama oran"
        />
        <MetricCard
          label="Ort. Momentum"
          value={String(summary.avgMomentum)}
          hint="Trend devam gucunun ortalama skoru"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <SectionHeading
            eyebrow="Skor Dagilimi"
            title="Momentum ve IV crush dengesi"
            description="En yuksek puanli tickerlarda momentum ve beklenen volatilite bosalmasi ayni anda izleniyor."
          />
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 12, right: 12, bottom: 12, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
                <XAxis dataKey="ticker" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "#08131b",
                    border: "1px solid rgba(148,163,184,0.2)",
                    borderRadius: 16,
                  }}
                />
                <Bar dataKey="momentum" radius={[10, 10, 0, 0]}>
                  {chartData.map(item => (
                    <Cell key={item.ticker} fill={item.color} />
                  ))}
                </Bar>
                <Bar dataKey="ivCrush" radius={[10, 10, 0, 0]} fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
            <SectionHeading
              eyebrow="Top Picks"
              title="Bu haftanin one cikanlari"
            />
            <div className="mt-4 space-y-3">
              {report.content.entries.slice(0, 3).map((entry, index) => {
                const rating = strategyPresentation[entry.strategyRating];

                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => onSelectTicker(entry.ticker)}
                    className="flex w-full items-start justify-between gap-3 rounded-2xl border border-border bg-background/60 p-4 text-left transition-colors hover:border-emerald-500/30 hover:bg-background"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        #{index + 1} · {entry.ticker}
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {entry.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {entry.recommendedStrategy}
                      </p>
                    </div>
                    <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase ${rating.badgeClass}`}>
                      {rating.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
            <SectionHeading
              eyebrow="Sektorler"
              title="Ortalama IV crush skoru"
            />
            <div className="mt-4 space-y-3">
              {sectorData.map(item => (
                <div key={item.sector} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.sector}</span>
                    <span className="font-semibold text-foreground">{item.score}</span>
                  </div>
                  <div className="h-2 rounded-full bg-background/70">
                    <div
                      className="h-2 rounded-full bg-emerald-400"
                      style={{ width: `${Math.min(item.score, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
        <div className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <SectionHeading eyebrow="Katalizorler" title="Haftalik checklist" />
          <div className="mt-4 grid gap-3">
            {report.content.keyCatalysts.map(item => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-border bg-background/50 p-4"
              >
                <ChevronRight className="mt-0.5 size-4 text-emerald-300" />
                <p className="text-sm text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <SectionHeading
            eyebrow="Execution"
            title="Pozisyonlama notlari"
            description={report.content.executionNotes}
          />
          {summary.topPick ? (
            <div className="mt-5 rounded-3xl border border-emerald-500/20 bg-emerald-500/8 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Top Pick
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {summary.topPick.ticker}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {summary.topPick.thesis}
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function CalendarPanel({
  report,
  onSelectTicker,
}: {
  report: WeeklyReportRecord;
  onSelectTicker: (ticker: string) => void;
}) {
  const groups = groupEntriesByDay(report.content.entries);

  return (
    <div className="space-y-4">
      <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
        <SectionHeading
          eyebrow="Earnings Takvimi"
          title="Gun bazli dagilim"
          description="Admin tarafindan yayinlanan haftalik rapordaki tickerlar gunlerine gore listelenir."
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {groups.map(group => (
          <section
            key={group.date}
            className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {formatCalendarDay(group.date)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {group.entries.length} earnings setup
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {group.entries.map(entry => {
                const rating = strategyPresentation[entry.strategyRating];

                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => onSelectTicker(entry.ticker)}
                    className="flex w-full items-start justify-between gap-3 rounded-2xl border border-border bg-background/60 p-4 text-left transition-colors hover:border-emerald-500/30 hover:bg-background"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        {entry.ticker} · {entry.name}
                      </p>
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        {entry.earningsTime} · {entry.sector}
                      </p>
                      <p className="text-sm text-muted-foreground">{entry.thesis}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {entry.ivCrushScore}
                      </p>
                      <p className={`mt-2 rounded-full border px-2 py-1 text-[10px] font-semibold uppercase ${rating.badgeClass}`}>
                        {rating.label}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function IvCrushPanel({ report }: { report: WeeklyReportRecord }) {
  const chartData = report.content.entries.map(entry => ({
    ticker: entry.ticker,
    score: entry.ivCrushScore,
    color: strategyPresentation[entry.strategyRating].color,
  }));

  return (
    <div className="space-y-4">
      <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
        <SectionHeading
          eyebrow="IV Crush Matrix"
          title="Firsat siralamasi"
          description="En yuksek iv crush ve momentum dengesine sahip tickerlar yukarida toplanir."
        />
        <div className="mt-5 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 12, right: 12, bottom: 12, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
              <XAxis dataKey="ticker" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "#08131b",
                  border: "1px solid rgba(148,163,184,0.2)",
                  borderRadius: 16,
                }}
              />
              <Bar dataKey="score" radius={[10, 10, 0, 0]}>
                {chartData.map(item => (
                  <Cell key={item.ticker} fill={item.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-border bg-card/90 shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-background/80">
              <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {[
                  "Sira",
                  "Ticker",
                  "Rating",
                  "IV Crush",
                  "Momentum",
                  "Call Gain",
                  "Target",
                ].map(label => (
                  <th key={label} className="px-4 py-3">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.content.entries.map((entry, index) => {
                const rating = strategyPresentation[entry.strategyRating];

                return (
                  <tr
                    key={entry.id}
                    className="border-b border-border/70 transition-colors hover:bg-background/60"
                  >
                    <td className="px-4 py-3 text-muted-foreground">#{index + 1}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">
                      {entry.ticker}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase ${rating.badgeClass}`}>
                        {rating.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      %{entry.expectedIVCrush}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {entry.momentumScore}
                    </td>
                    <td className="px-4 py-3 text-emerald-300">
                      %{entry.callGainFromIV}
                    </td>
                    <td className="px-4 py-3 text-amber-300">
                      %{entry.targetProfit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StockDetailPanel({
  report,
  selectedStock,
  onSelectTicker,
}: {
  report: WeeklyReportRecord;
  selectedStock: WeeklyReportEntry | null;
  onSelectTicker: (ticker: string) => void;
}) {
  if (!selectedStock) {
    return null;
  }

  const radarData = [
    { label: "Momentum", value: selectedStock.momentumScore, fullMark: 100 },
    { label: "IV Crush", value: selectedStock.expectedIVCrush * 2, fullMark: 100 },
    { label: "Beat Rate", value: selectedStock.beatRate, fullMark: 100 },
    { label: "Call Gain", value: Math.min(selectedStock.callGainFromIV, 100), fullMark: 100 },
    { label: "Target", value: Math.min(selectedStock.targetProfit, 100), fullMark: 100 },
  ];
  const rating = strategyPresentation[selectedStock.strategyRating];

  return (
    <div className="space-y-4">
      <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
        <SectionHeading
          eyebrow="Ticker Secimi"
          title="Detayli hisse analizi"
          description="v2 mantigindaki haftalik rapor akisi artik secili ticker uzerinden ilerliyor."
        />
        <div className="mt-4">
          <StockPills
            entries={report.content.entries}
            selectedTicker={selectedStock.ticker}
            onSelect={onSelectTicker}
          />
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              {selectedStock.ticker}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              {selectedStock.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {selectedStock.sector} · {formatCalendarDay(selectedStock.earningsDate)} ·{" "}
              {selectedStock.earningsTime}
            </p>
          </div>

          <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${rating.badgeClass}`}>
            {rating.label}
          </span>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)]">
          <div className="rounded-3xl border border-border bg-background/60 p-4">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(148,163,184,0.18)" />
                  <PolarAngleAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                  <Radar
                    dataKey="value"
                    stroke={rating.color}
                    fill={rating.color}
                    fillOpacity={0.22}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Momentum", selectedStock.momentumScore],
              ["Current IV", `%${selectedStock.currentIV}`],
              ["Historical IV", `%${selectedStock.historicalIV}`],
              ["Beat Rate", `%${selectedStock.beatRate}`],
              ["Risk", riskLabels[selectedStock.riskLevel]],
              ["Bias", biasLabels[selectedStock.directionalBias]],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-3xl border border-border bg-background/60 p-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
        <div className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <SectionHeading eyebrow="Yatirim Tezi" title="Admin yorumu" />
          <p className="mt-4 text-sm leading-relaxed text-foreground">
            {selectedStock.thesis}
          </p>
        </div>

        <div className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <SectionHeading eyebrow="Tarihsel Okuma" title="Son earnings davranisi" />
          <div className="mt-4 grid gap-3">
            {[
              ["Son earnings move", `%${selectedStock.lastEarningsMove}`],
              ["Historical IV crush", `%${selectedStock.historicalIVCrush}`],
              ["Earnings miss risk", `%${selectedStock.earningsMissRisk}`],
              ["Gap risk", `%${selectedStock.gapRisk}`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-2xl border border-border bg-background/50 px-4 py-3"
              >
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function OptionDetailPanel({
  report,
  selectedStock,
  onSelectTicker,
}: {
  report: WeeklyReportRecord;
  selectedStock: WeeklyReportEntry | null;
  onSelectTicker: (ticker: string) => void;
}) {
  if (!selectedStock) {
    return null;
  }

  const rewardRisk = selectedStock.maxLoss
    ? (selectedStock.targetProfit / selectedStock.maxLoss).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-4">
      <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
        <SectionHeading
          eyebrow="Opsiyon Plan"
          title="Call / put premium oyunu"
          description="Secili ticker icin v2 tarzi opsiyon detay okuması."
        />
        <div className="mt-4">
          <StockPills
            entries={report.content.entries}
            selectedTicker={selectedStock.ticker}
            onSelect={onSelectTicker}
          />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {[
          {
            title: "Call tarafi",
            buy: selectedStock.callPremiumBuy,
            sell: selectedStock.callPremiumSell,
            gain: selectedStock.callGainFromIV,
          },
          {
            title: "Put tarafi",
            buy: selectedStock.putPremiumBuy,
            sell: selectedStock.putPremiumSell,
            gain: selectedStock.putGainFromIV,
          },
        ].map(card => (
          <div
            key={card.title}
            className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl"
          >
            <SectionHeading eyebrow="Premium" title={card.title} />
            <div className="mt-4 space-y-3">
              {[
                ["Alis", `$${card.buy.toFixed(2)}`],
                ["Satis", `$${card.sell.toFixed(2)}`],
                ["Brut kar", `$${(card.sell - card.buy).toFixed(2)}`],
                ["Kazanc", `%${card.gain}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl border border-border bg-background/50 px-4 py-3"
                >
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)]">
        <div className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <SectionHeading eyebrow="Risk / Odul" title="Pozisyon matematigi" />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["Target profit", `%${selectedStock.targetProfit}`],
              ["Max loss", `%${selectedStock.maxLoss}`],
              ["Reward / risk", `${rewardRisk}:1`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-3xl border border-border bg-background/60 p-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
          <SectionHeading eyebrow="Execution" title="Haftalik notlar" />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {report.content.executionNotes}
          </p>
          <div className="mt-5 rounded-3xl border border-emerald-500/20 bg-emerald-500/8 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Onerilen Yapi
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {selectedStock.recommendedStrategy}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [reports, setReports] = useState<WeeklyReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReportId, setSelectedReportId] = useState("");
  const [activeTab, setActiveTab] = useState<ReportTabId>("overview");
  const [selectedTicker, setSelectedTicker] = useState("");
  const [opportunities, setOpportunities] = useState<OpportunityRecord[]>([]);
  const [opportunitiesTotal, setOpportunitiesTotal] = useState(0);
  const [opportunitiesTier, setOpportunitiesTier] = useState<OpportunityTier>("free");
  const [opportunityLoading, setOpportunityLoading] = useState(false);
  const [opportunityError, setOpportunityError] = useState("");
  const [watchlistItems, setWatchlistItems] = useState<WatchlistRecord[]>([]);
  const [watchlistBusyTicker, setWatchlistBusyTicker] = useState("");

  const [adminEmail, setAdminEmail] = useState("hsnksc@gmail.com");

  const selectedReport = useMemo(() => {
    if (!reports.length) {
      return null;
    }

    return reports.find(report => report.id === selectedReportId) || reports[0];
  }, [reports, selectedReportId]);

  const selectedStock = useMemo(() => {
    if (!selectedReport) {
      return null;
    }

    return (
      selectedReport.content.entries.find(entry => entry.ticker === selectedTicker) ||
      selectedReport.content.entries[0] ||
      null
    );
  }, [selectedReport, selectedTicker]);
  const watchlistTickerSet = useMemo(
    () => new Set(watchlistItems.map(item => item.ticker)),
    [watchlistItems]
  );

  const loadViewerReports = useCallback(
    async () => {
      const response = await fetch("/api/reports/weekly", {
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Haftalik raporlar yuklenemedi.");
      }

      const payload = (await response.json()) as WeeklyReportsApiResponse;
      const nextReports = sortReportsNewestFirst(payload.reports || []);
      setReports(nextReports);
      setAdminEmail(payload.admin?.email || "hsnksc@gmail.com");

      return payload;
    },
    []
  );

  const loadOpportunityWorkspace = useCallback(async () => {
    setOpportunityLoading(true);
    setOpportunityError("");

    try {
      const [opportunitiesResponse, watchlistResponse] = await Promise.all([
        fetch("/api/opportunities?limit=8", {
          credentials: "include",
          cache: "no-store",
        }),
        fetch("/api/watchlist", {
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      if (!opportunitiesResponse.ok) {
        throw new Error("Firsatlar yuklenemedi.");
      }

      if (!watchlistResponse.ok) {
        throw new Error("Watchlist yuklenemedi.");
      }

      const opportunitiesPayload =
        (await opportunitiesResponse.json()) as OpportunitiesApiResponse;
      const watchlistPayload = (await watchlistResponse.json()) as WatchlistApiResponse;
      setOpportunities(opportunitiesPayload.data || []);
      setOpportunitiesTotal(opportunitiesPayload.meta?.total || 0);
      setOpportunitiesTier(opportunitiesPayload.meta?.tier || "free");
      setWatchlistItems(watchlistPayload.items || []);
    } catch (loadError) {
      setOpportunityError(
        loadError instanceof Error ? loadError.message : "Firsatlar yuklenemedi."
      );
    } finally {
      setOpportunityLoading(false);
    }
  }, []);

  const refreshWorkspace = useCallback(
    async () => {
      setLoading(true);
      setError("");

      try {
        await loadViewerReports();
        await loadOpportunityWorkspace();
      } catch (refreshError) {
        setError(
          refreshError instanceof Error
            ? refreshError.message
            : "Haftalik raporlar yuklenemedi."
        );
      } finally {
        setLoading(false);
      }
    },
    [loadOpportunityWorkspace, loadViewerReports]
  );

  useEffect(() => {
    void refreshWorkspace();
  }, [refreshWorkspace]);

  useEffect(() => {
    if (!reports.length) {
      setSelectedReportId("");
      return;
    }

    if (!reports.some(report => report.id === selectedReportId)) {
      setSelectedReportId(reports[0].id);
    }
  }, [reports, selectedReportId]);

  useEffect(() => {
    if (!selectedReport?.content.entries.length) {
      setSelectedTicker("");
      return;
    }

    if (
      !selectedTicker ||
      !selectedReport.content.entries.some(entry => entry.ticker === selectedTicker)
    ) {
      setSelectedTicker(selectedReport.content.entries[0].ticker);
    }
  }, [selectedReport, selectedTicker]);

  const handleToggleWatchlist = async (opportunity: OpportunityRecord) => {
    const ticker = opportunity.ticker;
    setWatchlistBusyTicker(ticker);
    setOpportunityError("");

    try {
      const isSaved = watchlistTickerSet.has(ticker);
      const response = await fetch(isSaved ? `/api/watchlist/${ticker}` : "/api/watchlist", {
        method: isSaved ? "DELETE" : "POST",
        credentials: "include",
        headers: isSaved
          ? undefined
          : {
              "Content-Type": "application/json",
            },
        body: isSaved ? undefined : JSON.stringify({ ticker }),
      });

      if (!response.ok) {
        throw new Error(
          isSaved
            ? "Watchlist kaydi kaldirilamadi."
            : "Watchlist kaydi eklenemedi."
        );
      }

      const payload = (await response.json()) as WatchlistApiResponse;
      setWatchlistItems(payload.items || []);
    } catch (toggleError) {
      setOpportunityError(
        toggleError instanceof Error
          ? toggleError.message
          : "Watchlist islemi tamamlanamadi."
      );
    } finally {
      setWatchlistBusyTicker("");
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-card/95 p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold tracking-tight">Haftalik raporlar yukleniyor</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Admin tarafindan yayinlanan earnings planlari getiriliyor.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-destructive/30 bg-card/95 p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Raporlar acilamadi
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-5" onClick={() => void refreshWorkspace()}>
            Tekrar dene
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedReport) {
    return (
      <div className="px-4 py-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-border bg-card/95 p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Yayinlanmis haftalik rapor yok
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Admin analiz yapip yayina aldiginda ustte haftalik tablar burada
            gorunecek. Sol tarafta ise secili haftanin earnings ve IV crush
            sekmeleri acilacak.
          </p>
        </div>
      </div>
    );
  }

  const summary = getReportSummary(selectedReport);

  return (
    <>
      <div className="px-4 py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  <Gauge className="size-3.5" />
                  Weekly Earnings Workspace
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                    Earnings IV Crush Analiz Sistemi
                  </h1>
                  <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    `v2` mantigi artik kalici hale geldi. Admin haftalik analiz
                    yapip yayina aldikca ustte haftalar gorunur, sol tarafta ise
                    secili haftanin sekmeleri acilir.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/app/admin")}
                  >
                    <Shield className="size-4" />
                    Admin workspace
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Editor artik ayri sayfada acilir.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  ["En yeni hafta", formatWeekRange(selectedReport)],
                  ["Top pick", summary.topPick?.ticker || "-"],
                  ["Admin", adminEmail],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-border bg-background/60 p-4"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card/90 p-4 shadow-xl">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {reports.map(report => {
                const active = report.id === selectedReport.id;

                return (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => setSelectedReportId(report.id)}
                    className={`min-w-[250px] rounded-[1.5rem] border px-4 py-4 text-left transition-colors ${
                      active
                        ? "border-emerald-500/40 bg-emerald-500/10"
                        : "border-border bg-background/60 hover:bg-background"
                    }`}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                      {formatWeekRange(report)}
                    </p>
                    <p className="mt-2 text-base font-semibold text-foreground">
                      {report.title}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {report.content.entries.length} hisse · analiz{" "}
                      {formatAnalysisDate(report.analysisDate)}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[250px_minmax(0,1fr)]">
            <aside className="rounded-[2rem] border border-border bg-card/90 p-4 shadow-xl">
              <div className="space-y-2 border-b border-border pb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Secili Hafta
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {selectedReport.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedReport.content.headline}
                </p>
              </div>

              <nav className="mt-4 space-y-2">
                {REPORT_TABS.map(tab => {
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors ${
                        activeTab === tab.id
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                          : "border-transparent text-muted-foreground hover:border-border hover:bg-background/60 hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-4" />
                      <span className="text-sm font-semibold">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 space-y-3 border-t border-border pt-4">
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Top pick
                  </p>
                  <p className="mt-2 text-xl font-semibold text-foreground">
                    {summary.topPick?.ticker || "-"}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Ortalama target
                  </p>
                  <p className="mt-2 text-xl font-semibold text-foreground">
                    %{summary.avgTargetProfit}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Excellent count
                  </p>
                  <p className="mt-2 text-xl font-semibold text-foreground">
                    {summary.excellentCount}
                  </p>
                </div>
              </div>
            </aside>

            <main className="min-w-0">
              {activeTab === "overview" ? (
                <OverviewPanel report={selectedReport} onSelectTicker={setSelectedTicker} />
              ) : null}
              {activeTab === "calendar" ? (
                <CalendarPanel report={selectedReport} onSelectTicker={setSelectedTicker} />
              ) : null}
              {activeTab === "ivcrush" ? <IvCrushPanel report={selectedReport} /> : null}
              {activeTab === "stocks" ? (
                <StockDetailPanel
                  report={selectedReport}
                  selectedStock={selectedStock}
                  onSelectTicker={setSelectedTicker}
                />
              ) : null}
              {activeTab === "options" ? (
                <OptionDetailPanel
                  report={selectedReport}
                  selectedStock={selectedStock}
                  onSelectTicker={setSelectedTicker}
                />
              ) : null}
              {activeTab === "signals" ? (
                <OpportunityPanel
                  items={opportunities}
                  total={opportunitiesTotal}
                  tier={opportunitiesTier}
                  watchlistTickers={watchlistTickerSet}
                  loading={opportunityLoading}
                  error={opportunityError}
                  busyTicker={watchlistBusyTicker}
                  onRefresh={() => void loadOpportunityWorkspace()}
                  onToggleWatchlist={opportunity => void handleToggleWatchlist(opportunity)}
                />
              ) : null}
            </main>
          </div>
        </div>
      </div>

    </>
  );
}
