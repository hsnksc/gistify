import { useCallback, useEffect, useState } from "react";
import type {
  CalendarData,
  CalendarDayReport,
  CalendarEvent,
  CalendarImportance,
  CalendarOptionSetup,
  CalendarPipelineStatus,
} from "@shared/calendar";
import {
  AlertTriangle,
  CalendarDays,
  Clock,
  Globe,
  RefreshCw,
  TrendingUp,
  Zap,
} from "lucide-react";
import WorkspaceLoadingState from "@/components/workspace/WorkspaceLoadingState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const SNAPSHOT_REFRESH_INTERVAL_MS = 60 * 1000;

const THEME = {
  shellClassName:
    "border-emerald-500/20 bg-[linear-gradient(180deg,rgba(9,29,18,0.96),rgba(8,16,12,0.98))]",
  innerClassName:
    "bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_32%),linear-gradient(180deg,rgba(10,24,18,0.94),rgba(8,16,12,0.98))]",
  cardClassName: "border-emerald-500/18 bg-emerald-500/[0.07]",
  softCardClassName: "border-emerald-500/16 bg-emerald-500/[0.06]",
  glowClassName: "from-emerald-400/16 via-emerald-500/0 to-transparent",
  iconClassName: "text-emerald-200",
  eyebrowClassName: "text-emerald-300",
  lineClassName: "bg-emerald-400/70",
};

function formatTimestamp(value: string | null | undefined, language: AppLanguage) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(language === "en" ? "en-US" : "tr-TR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function formatDateLabel(value: string | undefined, language: AppLanguage) {
  if (!value) {
    return "-";
  }

  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T00:00:00Z`
    : value;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(language === "en" ? "en-US" : "tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function pipelineStatusLabel(
  status: CalendarPipelineStatus,
  language: AppLanguage
) {
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

function pipelineStatusClass(status: CalendarPipelineStatus) {
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

function importanceLabel(
  importance: CalendarImportance,
  language: AppLanguage
) {
  switch (importance) {
    case "high":
      return copy(language, "Yuksek", "High");
    case "medium":
      return copy(language, "Orta", "Medium");
    default:
      return copy(language, "Dusuk", "Low");
  }
}

function importanceClass(importance: CalendarImportance) {
  switch (importance) {
    case "high":
      return "border-rose-500/25 bg-rose-500/12 text-rose-200";
    case "medium":
      return "border-amber-500/25 bg-amber-500/12 text-amber-200";
    default:
      return "border-slate-500/25 bg-slate-500/10 text-slate-300";
  }
}

function importanceRowClass(importance: CalendarImportance) {
  switch (importance) {
    case "high":
      return "bg-rose-500/[0.04]";
    case "medium":
      return "bg-amber-500/[0.03]";
    default:
      return "";
  }
}

function biasLabel(bias: CalendarOptionSetup["bias"], language: AppLanguage) {
  switch (bias) {
    case "bullish":
      return copy(language, "Yukari yonlu", "Bullish");
    case "bearish":
      return copy(language, "Asagi yonlu", "Bearish");
    default:
      return copy(language, "Notr", "Neutral");
  }
}

function biasClass(bias: CalendarOptionSetup["bias"]) {
  switch (bias) {
    case "bullish":
      return "border-emerald-500/25 bg-emerald-500/12 text-emerald-200";
    case "bearish":
      return "border-rose-500/25 bg-rose-500/12 text-rose-200";
    default:
      return "border-amber-500/25 bg-amber-500/12 text-amber-200";
  }
}

function parseNumericValue(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const cleaned = value
    .replace(/%/g, "")
    .replace(/,/g, ".")
    .replace(/[^\d.\-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function actualHighlightClass(
  actual: string | undefined,
  forecast: string | undefined
): string {
  if (!actual || !forecast) {
    return "text-foreground";
  }

  const actualValue = parseNumericValue(actual);
  const forecastValue = parseNumericValue(forecast);

  if (actualValue === null || forecastValue === null) {
    return "text-foreground";
  }

  if (actualValue > forecastValue) {
    return "text-emerald-400 font-semibold";
  }

  if (actualValue < forecastValue) {
    return "text-rose-400 font-semibold";
  }

  return "text-foreground";
}

function CompactStatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/20 px-3.5 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{hint}</p>
    </article>
  );
}

function EventRow({
  event,
  language,
}: {
  event: CalendarEvent;
  language: AppLanguage;
}) {
  return (
    <TableRow className={importanceRowClass(event.importance)}>
      <TableCell className="text-foreground/90">
        <div className="flex items-center gap-1.5">
          <Clock className="size-3.5 text-muted-foreground" />
          {event.time || "-"}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="text-base">{event.countryFlag}</span>
          <span className="text-foreground/90">{event.country}</span>
        </div>
      </TableCell>
      <TableCell className="font-medium text-foreground">
        {event.eventName}
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={cn("text-[10px] uppercase tracking-[0.14em]", importanceClass(event.importance))}
        >
          {importanceLabel(event.importance, language)}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">{event.previous || "-"}</TableCell>
      <TableCell className="text-muted-foreground">{event.forecast || "-"}</TableCell>
      <TableCell className={actualHighlightClass(event.actual, event.forecast)}>
        {event.actual || "-"}
      </TableCell>
    </TableRow>
  );
}

function EventsTable({
  events,
  language,
}: {
  events: CalendarEvent[];
  language: AppLanguage;
}) {
  const headers = [
    copy(language, "Saat", "Time"),
    copy(language, "Ulke", "Country"),
    copy(language, "Olay", "Event"),
    copy(language, "Onem", "Importance"),
    copy(language, "Onceki", "Previous"),
    copy(language, "Beklenen", "Forecast"),
    copy(language, "Gerceklesen", "Actual"),
  ];

  return (
    <Card className={cn("overflow-hidden", THEME.cardClassName)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className={cn("size-5", THEME.iconClassName)} />
          {copy(language, "Makro Olaylar", "Macro Events")}
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
              {events.length ? (
                events.map(event => (
                  <EventRow
                    key={event.id}
                    event={event}
                    language={language}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={headers.length}
                    className="text-sm text-muted-foreground"
                  >
                    {copy(language, "Bugun icin olay bulunmuyor.", "No events for today.")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden space-y-3 p-4">
          {events.length ? (
            events.map(event => (
              <div
                key={event.id}
                className={cn(
                  "rounded-2xl border border-white/10 bg-black/20 p-3.5",
                  importanceRowClass(event.importance)
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {event.eventName}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {event.countryFlag} {event.country} · {event.time}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("shrink-0 text-[10px] uppercase tracking-[0.14em]", importanceClass(event.importance))}
                  >
                    {importanceLabel(event.importance, language)}
                  </Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl border border-white/10 bg-black/20 px-2 py-1.5">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {copy(language, "Onceki", "Previous")}
                    </p>
                    <p className="mt-1 text-foreground">{event.previous || "-"}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 px-2 py-1.5">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {copy(language, "Beklenen", "Forecast")}
                    </p>
                    <p className="mt-1 text-foreground">{event.forecast || "-"}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 px-2 py-1.5">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {copy(language, "Gerceklesen", "Actual")}
                    </p>
                    <p className={cn("mt-1", actualHighlightClass(event.actual, event.forecast))}>
                      {event.actual || "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/15 px-4 py-3 text-sm text-muted-foreground">
              {copy(language, "Bugun icin olay bulunmuyor.", "No events for today.")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function OptionSetupsCard({
  setups,
  language,
}: {
  setups: CalendarOptionSetup[];
  language: AppLanguage;
}) {
  return (
    <Card className={cn("overflow-hidden", THEME.softCardClassName)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className={cn("size-5", THEME.iconClassName)} />
          {copy(
            language,
            "Opsiyon Stratejisi Onerileri",
            "Option Strategy Setups"
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {setups.length ? (
          setups.map((setup, index) => (
            <div
              key={`${setup.asset}-${setup.trigger}-${index}`}
              className="rounded-2xl border border-white/10 bg-black/20 p-3.5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {setup.asset}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {setup.setupType}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn("text-[10px] uppercase tracking-[0.14em]", biasClass(setup.bias))}
                >
                  {biasLabel(setup.bias, language)}
                </Badge>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.05] px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-emerald-200/80">
                    {copy(language, "Tetik", "Trigger")}
                  </p>
                  <p className="mt-1 text-[13px] leading-5 text-foreground/88">
                    {setup.trigger}
                  </p>
                </div>
                <div className="rounded-xl border border-rose-500/10 bg-rose-500/[0.05] px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-rose-200/80">
                    {copy(language, "Invalidasyon", "Invalidation")}
                  </p>
                  <p className="mt-1 text-[13px] leading-5 text-foreground/88">
                    {setup.invalidation}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/15 px-4 py-3 text-sm text-muted-foreground">
            {copy(
              language,
              "Bugun icin opsiyon setup'i bulunmuyor.",
              "No option setups for today."
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MarketNarrativeCard({
  narrative,
  language,
}: {
  narrative: string;
  language: AppLanguage;
}) {
  return (
    <Card className={cn("overflow-hidden", THEME.softCardClassName)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className={cn("size-5", THEME.iconClassName)} />
          {copy(language, "Piyasa Hikayesi", "Market Narrative")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-3.5">
          <p className="text-[13px] leading-6 text-foreground/88">
            {narrative ||
              copy(
                language,
                "Piyasa hikayesi henuz yuklenmedi.",
                "Market narrative has not loaded yet."
              )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryCard({
  report,
  language,
}: {
  report: CalendarDayReport;
  language: AppLanguage;
}) {
  return (
    <Card className={cn("overflow-hidden", THEME.cardClassName)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-foreground">
          {report.title ||
            copy(
              language,
              "Bugunun Makro Olaylari",
              "Today's Macro Events"
            )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {report.summary ? (
          <p className="text-[13px] leading-6 text-foreground/84">
            {report.summary}
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CompactStatCard
            label={copy(language, "Yuksek Onemli", "High Importance")}
            value={String(report.highImportanceCount)}
            hint={copy(
              language,
              "Bugun takvime giren kritik olay",
              "Critical events on today's calendar"
            )}
          />
          <CompactStatCard
            label={copy(language, "Toplam Olay", "Total Events")}
            value={String(report.events.length)}
            hint={copy(
              language,
              "Tum onem seviyelerindeki olaylar",
              "Events across all importance levels"
            )}
          />
          <CompactStatCard
            label="VIX"
            value={report.vixOutlook || "-"}
            hint={copy(language, "Volatilite gorusu", "Volatility outlook")}
          />
          <CompactStatCard
            label={copy(language, "Fear & Greed", "Fear & Greed")}
            value={report.fearGreedOutlook || "-"}
            hint={copy(language, "Piyasa duyarlilik gorusu", "Market sentiment outlook")}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Calendar({ language }: { language: AppLanguage }) {
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  const loadData = useCallback(
    async (silent = false) => {
      if (!silent) {
        setLoading(true);
      }
      setRefreshing(true);

      try {
        const response = await fetch("/api/calendar", {
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) {
          const payload =
            ((await response.json().catch(() => null)) as {
              error?: string;
            } | null) || null;
          throw new Error(
            payload?.error ||
              copy(
                language,
                "Ekonomik takvim verisi yuklenemedi.",
                "Failed to load the economic calendar."
              )
          );
        }

        setData((await response.json()) as CalendarData);
        setError(null);
      } catch (loadError) {
        setError(
          loadError instanceof Error && loadError.message
            ? loadError.message
            : copy(
                language,
                "Ekonomik takvim verisi yuklenemedi.",
                "Failed to load the economic calendar."
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
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const timer = window.setInterval(
      () => void loadData(true),
      SNAPSHOT_REFRESH_INTERVAL_MS
    );

    return () => window.clearInterval(timer);
  }, [loadData, autoRefresh]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-6 md:py-8">
          <WorkspaceLoadingState
            label={copy(
              language,
              "Ekonomik takvim yukleniyor.",
              "Loading the economic calendar."
            )}
          />
        </div>
      </div>
    );
  }

  if (!data || !data.report) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-6 md:py-8">
          <WorkspaceLoadingState
            label={
              error ||
              copy(
                language,
                "Henüz ekonomik takvim snapshot'i bulunmuyor.",
                "There is no economic calendar snapshot yet."
              )
            }
          />
        </div>
      </div>
    );
  }

  const report = data.report;
  const pipeline = data.pipeline;

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
                      {copy(language, "Ekonomik Takvim", "Economic Calendar")}
                    </p>
                  </div>
                  <h1 className="mt-2 heading-condensed text-[1.65rem] leading-none text-foreground md:text-[1.9rem]">
                    {copy(
                      language,
                      "Gunun Makro Olaylari",
                      "Today's Macro Events"
                    )}
                  </h1>
                  <p className="mt-2 text-[13px] leading-6 text-foreground/82">
                    {formatDateLabel(report.reportDate, language)} ·{" "}
                    {copy(
                      language,
                      "ABD ve global veri takvimi",
                      "US and global data calendar"
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                      pipelineStatusClass(pipeline.status)
                    )}
                  >
                    {copy(language, "Pipeline", "Pipeline")}:{" "}
                    {pipelineStatusLabel(pipeline.status, language)}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void loadData()}
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
                    <CalendarDays className="mr-1.5 size-4" />
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

              <SummaryCard report={report} language={language} />

              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <EventsTable events={report.events} language={language} />

                <div className="space-y-4">
                  <OptionSetupsCard setups={report.optionSetups} language={language} />
                  <MarketNarrativeCard
                    narrative={report.marketNarrative}
                    language={language}
                  />
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-emerald-500/16 bg-emerald-500/[0.05] p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-[0.16em]",
                        THEME.eyebrowClassName
                      )}
                    >
                      {copy(language, "Pipeline", "Pipeline")}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-foreground">
                      {pipelineStatusLabel(pipeline.status, language)}
                    </h3>
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                      pipelineStatusClass(pipeline.status)
                    )}
                  >
                    {formatTimestamp(pipeline.lastSyncedAt, language)}
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-[12px] text-muted-foreground">
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    {copy(language, "Son senkron", "Last sync")}:{" "}
                    <span className="text-foreground">
                      {formatTimestamp(pipeline.lastSyncedAt, language)}
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    {copy(language, "Kaynak", "Source")}:{" "}
                    <span className="break-all text-foreground">
                      {pipeline.resolvedSourceFile ||
                        pipeline.configuredSourceFile ||
                        "-"}
                    </span>
                  </div>
                  {pipeline.error ? (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-rose-100">
                      {pipeline.error}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
