import { useCallback, useEffect, useMemo, useState } from "react";
import type { DailyReportRecord } from "@shared/dailyReports";
import {
  BookOpen,
  CalendarRange,
  GalleryHorizontal,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";
import DailyReportViewer from "@/components/reports/DailyReportViewer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortDailyReportsNewestFirst } from "@/lib/dailyReports";

interface DailyReportsResponse {
  reports?: DailyReportRecord[];
}

function formatReportDate(reportDate: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${reportDate}T00:00:00Z`));
}

function formatUpdateStamp(value: string) {
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

function MetaPill({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarRange;
  label: string;
  value: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-2 text-xs text-muted-foreground">
      <Icon className="size-3.5 text-emerald-300" />
      <span className="font-semibold uppercase tracking-[0.16em]">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function ReportSelectorCard({
  report,
  active,
  onSelect,
}: {
  report: DailyReportRecord;
  active: boolean;
  onSelect: (reportId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(report.id)}
      className={`min-w-[220px] rounded-2xl border px-4 py-3 text-left transition-all ${
        active
          ? "border-indigo-400/45 bg-indigo-500/14 shadow-[0_0_18px_rgba(99,102,241,0.14)]"
          : "border-border bg-background/45 hover:bg-background/70"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
          {formatReportDate(report.reportDate)}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {formatUpdateStamp(report.updatedAt)}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-semibold text-foreground">
        {report.title}
      </p>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
        {report.content.headline}
      </p>
    </button>
  );
}

export default function DailyReportPage() {
  const [reports, setReports] = useState<DailyReportRecord[]>([]);
  const [selectedReportId, setSelectedReportId] = useState("");
  const [loading, setLoading] = useState(true);

  const getFigureFiles = (report: DailyReportRecord) =>
    Array.isArray(report.content.figureFiles) ? report.content.figureFiles : [];
  const getTickerUniverse = (report: DailyReportRecord) =>
    Array.isArray(report.content.tickerUniverse) ? report.content.tickerUniverse : [];
  const getOpenAiFigures = (report: DailyReportRecord) =>
    Array.isArray(report.content.openAiFigureFiles)
      ? report.content.openAiFigureFiles
      : [];

  const loadReports = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/daily-reports", {
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as DailyReportsResponse;
      const nextReports = sortDailyReportsNewestFirst(payload.reports || []);
      setReports(nextReports);
      setSelectedReportId(current =>
        current && nextReports.some(report => report.id === current)
          ? current
          : nextReports[0]?.id || ""
      );
    } catch {
      // Honest empty state.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const selectedReport = useMemo(
    () => reports.find(report => report.id === selectedReportId) || reports[0] || null,
    [reports, selectedReportId]
  );

  const latestReport = reports[0] || null;
  const selectedStats = selectedReport
    ? {
        figures: getFigureFiles(selectedReport).length,
        aiFigures: getOpenAiFigures(selectedReport).length,
        tickers: getTickerUniverse(selectedReport).length,
        updatedAt: formatUpdateStamp(selectedReport.updatedAt),
      }
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <section className="workspace-panel overflow-hidden">
          <div className="px-5 py-5 md:px-6 md:py-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div className="space-y-2">
                  <p className="heading-condensed text-sm uppercase tracking-[0.18em] text-indigo-300">
                    Daily Report
                  </p>
                  <h1 className="heading-condensed text-3xl leading-none text-foreground md:text-5xl">
                    {selectedReport?.title || "Gunluk raporlar"}
                  </h1>
                  <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-[15px]">
                    En guncel rapor ustte acilir. Buradan tarih secerek daily reader
                    panelini degistirebilirsin.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="outline" onClick={() => void loadReports()}>
                    <RefreshCw className="size-4" />
                    Yenile
                  </Button>
                </div>
              </div>

              {reports.length ? (
                <>
                  <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
                    <div className="rounded-[1.75rem] border border-border bg-background/45 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                        En Guncel
                      </p>
                      <p className="mt-2 text-lg font-semibold text-foreground">
                        {latestReport?.title || "-"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {latestReport?.reportDate
                          ? formatReportDate(latestReport.reportDate)
                          : "-"}{" "}
                        · {latestReport ? formatUpdateStamp(latestReport.updatedAt) : "-"}
                      </p>
                    </div>

                    <div className="space-y-3 rounded-[1.75rem] border border-border bg-background/45 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Gunluk Rapor Secimi
                        </p>
                        <div className="w-full md:max-w-[360px]">
                          <Select value={selectedReport?.id || ""} onValueChange={setSelectedReportId}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Bir daily report sec" />
                            </SelectTrigger>
                            <SelectContent>
                              {reports.map(report => (
                                <SelectItem key={report.id} value={report.id}>
                                  {formatReportDate(report.reportDate)} · {report.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="terminal-scrollbar flex gap-3 overflow-x-auto pb-1">
                        {reports.map(report => (
                          <ReportSelectorCard
                            key={report.id}
                            report={report}
                            active={report.id === selectedReport?.id}
                            onSelect={setSelectedReportId}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedReport ? (
                    <div className="flex flex-wrap gap-2">
                      <MetaPill
                        icon={BookOpen}
                        label="Kaynak"
                        value={selectedReport.content.sourceLabel || selectedReport.sourceFolder}
                      />
                      <MetaPill
                        icon={CalendarRange}
                        label="Rapor Tarihi"
                        value={formatReportDate(selectedReport.reportDate)}
                      />
                      <MetaPill
                        icon={GalleryHorizontal}
                        label="Figure"
                        value={String(selectedStats?.figures || 0)}
                      />
                      <MetaPill
                        icon={Sparkles}
                        label="OpenAI"
                        value={String(selectedStats?.aiFigures || 0)}
                      />
                      <MetaPill
                        icon={Target}
                        label="Ticker"
                        value={String(selectedStats?.tickers || 0)}
                      />
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-background/35 px-4 py-3 text-sm text-muted-foreground">
                  {loading
                    ? "Daily report kutuphanesi yukleniyor."
                    : "`dailyreport/` icinde gosterilebilir bir rapor bulunamadi."}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-6 workspace-panel min-w-0 overflow-hidden">
          <div className="border-b border-border px-5 py-4 md:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
                    Daily intelligence
                  </span>
                  {selectedStats?.aiFigures ? (
                    <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                      OpenAI chart enabled
                    </span>
                  ) : null}
                </div>
                <h2 className="heading-condensed text-2xl text-foreground md:text-3xl">
                  {selectedReport?.title || "Daily report sec"}
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                  {selectedReport?.content.headline ||
                    "Ustteki secim alanindan bir daily report secildiginde okuma paneli burada acilir."}
                </p>
              </div>

              {selectedStats ? (
                <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  <span className="rounded-full border border-border bg-background/70 px-3 py-1">
                    {selectedStats.figures} figure
                  </span>
                  <span className="rounded-full border border-border bg-background/70 px-3 py-1">
                    {selectedStats.tickers} ticker
                  </span>
                  <span className="rounded-full border border-border bg-background/70 px-3 py-1">
                    Updated {selectedStats.updatedAt}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="p-4 md:p-6">
            {selectedReport ? (
              <DailyReportViewer
                title={selectedReport.title}
                reportDate={selectedReport.reportDate}
                sourceFolder={selectedReport.sourceFolder}
                content={selectedReport.content}
              />
            ) : (
              <div className="grid min-h-[420px] place-items-center">
                <div className="text-center">
                  <BookOpen className="mx-auto size-10 text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Ustteki secim alanindan bir daily report secildiginde okuma
                    paneli burada acilacak.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
