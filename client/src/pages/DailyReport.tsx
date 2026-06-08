import { useCallback, useEffect, useMemo, useState } from "react";
import type { DailyReportRecord } from "@shared/dailyReports";
import {
  BookOpen,
  CalendarRange,
  DatabaseZap,
  GalleryHorizontal,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";
import DailyReportViewer from "@/components/reports/DailyReportViewer";
import { Button } from "@/components/ui/button";
import { sortDailyReportsNewestFirst } from "@/lib/dailyReports";
import { useLocation } from "wouter";

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

function SummaryCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof CalendarRange;
  tone: "info" | "bull" | "caution";
}) {
  const toneClasses = {
    info: "border-indigo-500/22 bg-indigo-500/10 text-indigo-300",
    bull: "border-emerald-500/22 bg-emerald-500/10 text-emerald-300",
    caution: "border-amber-500/22 bg-amber-500/10 text-amber-300",
  } as const;

  return (
    <div className="workspace-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <p className="data-mono mt-2 text-2xl font-bold text-foreground">
            {value}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{hint}</p>
        </div>
        <div className={`rounded-xl border p-2 ${toneClasses[tone]}`}>
          <Icon className="size-4" />
        </div>
      </div>
    </div>
  );
}

export default function DailyReportPage() {
  const [, setLocation] = useLocation();
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
      // Leave page in empty state.
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

  const libraryStats = useMemo(() => {
    const totalFigures = reports.reduce(
      (sum, report) => sum + getFigureFiles(report).length,
      0
    );
    const totalTickers = reports.reduce(
      (sum, report) => sum + getTickerUniverse(report).length,
      0
    );
    const aiEnhancedReports = reports.filter(
      report => getOpenAiFigures(report).length > 0
    ).length;

    return {
      reports: reports.length,
      figures: totalFigures,
      tickers: totalTickers,
      aiEnhancedReports,
      latestDate: reports[0]?.reportDate ? formatReportDate(reports[0].reportDate) : "-",
    };
  }, [reports]);

  const selectedReportStats = selectedReport
    ? {
        figures: getFigureFiles(selectedReport).length,
        aiFigures: getOpenAiFigures(selectedReport).length,
        tickers: getTickerUniverse(selectedReport).length,
        updatedAt: formatUpdateStamp(selectedReport.updatedAt),
      }
    : null;
  const hasReports = reports.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <section className="workspace-panel overflow-hidden">
          <div className="relative overflow-hidden px-5 py-5 md:px-6 md:py-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_28%)]" />
            <div className="relative space-y-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge-strong">{libraryStats.aiEnhancedReports} AI chart set</span>
                    <span className="badge-warning">{libraryStats.figures} total figure</span>
                    <span className="badge-strong">{libraryStats.tickers} ticker coverage</span>
                  </div>
                  <div className="space-y-2">
                    <p className="heading-condensed text-sm uppercase tracking-[0.18em] text-indigo-300">
                      Daily Report Library
                    </p>
                    <h1 className="heading-condensed max-w-4xl text-3xl leading-none text-foreground md:text-5xl">
                      Gunluk intelligence arsivini,
                      <span className="text-glow-accent text-indigo-300"> okunur bir reader</span>
                      {" "}duzenine tası.
                    </h1>
                    <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-[15px]">
                      Solda tarih sirali arsiv, sagda secili raporun tam okuma paneli.
                      Paket kaynaklari, OpenAI ile uretilmis chart varyantlari ve ticker
                      coverage tek bakista gorunur.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="outline" onClick={() => void loadReports()}>
                    <RefreshCw className="size-4" />
                    Yenile
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setLocation("/app/admin")}>
                    Admin / Chart Studio
                  </Button>
                </div>
              </div>

              {hasReports ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <SummaryCard
                    label="Son rapor"
                    value={libraryStats.latestDate}
                    hint="Arsivde ustte gorunen tarih"
                    icon={CalendarRange}
                    tone="info"
                  />
                  <SummaryCard
                    label="Rapor adedi"
                    value={String(libraryStats.reports)}
                    hint="Toplam daily source"
                    icon={DatabaseZap}
                    tone="bull"
                  />
                  <SummaryCard
                    label="Figure"
                    value={String(libraryStats.figures)}
                    hint="Kaynak chart / gorsel"
                    icon={GalleryHorizontal}
                    tone="caution"
                  />
                  <SummaryCard
                    label="AI set"
                    value={String(libraryStats.aiEnhancedReports)}
                    hint="OpenAI varyanti olan rapor"
                    icon={Sparkles}
                    tone="info"
                  />
                </div>
              ) : (
                <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-xl border border-dashed border-border bg-background/35 px-4 py-3 text-xs text-muted-foreground">
                  {loading
                    ? "Daily report kutuphanesi yukleniyor."
                    : "`dailyreport/` source geldikten sonra library istatistikleri burada dolacak."}
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)] xl:items-start">
          <aside className="min-w-0 space-y-6 xl:sticky xl:top-24 xl:self-start">
            <section className="workspace-panel p-5 xl:flex xl:h-[calc(100vh-8rem)] xl:flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Archive
                  </p>
                  <h2 className="mt-2 heading-condensed text-2xl text-foreground">
                    Daily index
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tarihe ve son update saatine gore secim yap.
                  </p>
                </div>
                {loading ? (
                  <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Loading
                  </span>
                ) : null}
              </div>

              {selectedReportStats ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <SummaryCard
                    label="Secili rapor"
                    value={formatReportDate(selectedReport?.reportDate || "")}
                    hint={selectedReport?.title || "Daily report"}
                    icon={BookOpen}
                    tone="info"
                  />
                  <SummaryCard
                    label="OpenAI chart"
                    value={String(selectedReportStats.aiFigures)}
                    hint="Hazir gpt chart varyanti"
                    icon={Sparkles}
                    tone="bull"
                  />
                  <SummaryCard
                    label="Ticker"
                    value={String(selectedReportStats.tickers)}
                    hint="Kapsanan sembol"
                    icon={Target}
                    tone="caution"
                  />
                  <SummaryCard
                    label="Update"
                    value={selectedReportStats.updatedAt}
                    hint="Kayit degisiklik saati"
                    icon={RefreshCw}
                    tone="info"
                  />
                </div>
              ) : null}

              <div className="terminal-scrollbar mt-5 space-y-3 overflow-y-auto pr-1 xl:min-h-0 xl:flex-1">
                {reports.map((report, index) => {
                  const active = selectedReport?.id === report.id;
                  const figureCount = getFigureFiles(report).length;
                  const tickerCount = getTickerUniverse(report).length;
                  const aiCount = getOpenAiFigures(report).length;

                  return (
                    <button
                      key={report.id}
                      type="button"
                      onClick={() => setSelectedReportId(report.id)}
                      className={`w-full rounded-xl border p-4 text-left transition-all duration-150 ${
                        active
                          ? "border-indigo-400/45 bg-indigo-500/14 shadow-[0_0_18px_rgba(99,102,241,0.16)]"
                          : "border-border bg-background/45 hover:border-border hover:bg-[rgba(35,45,66,0.72)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="data-mono text-[11px] text-muted-foreground">
                          {index === 0 ? "LATEST" : "ARCHIVE"}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                          {report.content.sourceKind === "file" ? "file" : "package"}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-semibold text-foreground">
                        {report.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatReportDate(report.reportDate)} · {formatUpdateStamp(report.updatedAt)}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {report.content.headline}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        <span className="rounded-full border border-border bg-background/70 px-2 py-1">
                          {figureCount} figure
                        </span>
                        <span className="rounded-full border border-border bg-background/70 px-2 py-1">
                          {tickerCount} ticker
                        </span>
                        {aiCount > 0 ? (
                          <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-emerald-300">
                            {aiCount} ai chart
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}

                {!loading && !reports.length ? (
                  <div className="rounded-xl border border-dashed border-border bg-background/45 p-4 text-sm leading-6 text-muted-foreground">
                    Henuz bulunabilir bir gunluk rapor yok. `dailyreport/` altina tarihli
                    paket veya `.md` dosyasi eklendiginde burada otomatik gorunecek.
                  </div>
                ) : null}
              </div>
            </section>
          </aside>

          <section className="workspace-panel min-w-0 overflow-hidden xl:sticky xl:top-24 xl:flex xl:h-[calc(100vh-8rem)] xl:flex-col">
            <div className="border-b border-border px-5 py-4 md:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
                      Daily intelligence
                    </span>
                    {selectedReport?.content.sourceLabel ? (
                      <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {selectedReport.content.sourceLabel}
                      </span>
                    ) : null}
                    {selectedReportStats?.aiFigures ? (
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
                      "Soldaki arsivden bir rapor secildiginde okuma paneli burada acilir."}
                  </p>
                </div>

                {selectedReportStats ? (
                  <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    <span className="rounded-full border border-border bg-background/70 px-3 py-1">
                      {selectedReportStats.figures} figure
                    </span>
                    <span className="rounded-full border border-border bg-background/70 px-3 py-1">
                      {selectedReportStats.tickers} ticker
                    </span>
                    <span className="rounded-full border border-border bg-background/70 px-3 py-1">
                      Updated {selectedReportStats.updatedAt}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="terminal-scrollbar p-4 md:p-6 xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
              {selectedReport ? (
                <DailyReportViewer
                  title={selectedReport.title}
                  reportDate={selectedReport.reportDate}
                  sourceFolder={selectedReport.sourceFolder}
                  content={selectedReport.content}
                />
              ) : (
                <div className="grid min-h-[460px] place-items-center">
                  <div className="text-center">
                    <BookOpen className="mx-auto size-10 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      Arsivden bir rapor secildiginde okuma paneli burada acilacak.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
