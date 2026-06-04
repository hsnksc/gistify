import { useEffect, useMemo, useState } from "react";
import type { DailyReportRecord } from "@shared/dailyReports";
import { CalendarRange, DatabaseZap, GalleryHorizontal, RefreshCw } from "lucide-react";
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

export default function DailyReportPage() {
  const [, setLocation] = useLocation();
  const [reports, setReports] = useState<DailyReportRecord[]>([]);
  const [selectedReportId, setSelectedReportId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadReports() {
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
        if (cancelled) {
          return;
        }

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
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadReports();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedReport = useMemo(
    () => reports.find(report => report.id === selectedReportId) || reports[0] || null,
    [reports, selectedReportId]
  );

  const libraryStats = useMemo(() => {
    const totalFigures = reports.reduce(
      (sum, report) => sum + report.content.figureFiles.length,
      0
    );
    const totalTickers = reports.reduce(
      (sum, report) => sum + report.content.tickerUniverse.length,
      0
    );

    return {
      reports: reports.length,
      figures: totalFigures,
      tickers: totalTickers,
      latestDate: reports[0]?.reportDate ? formatReportDate(reports[0].reportDate) : "-",
    };
  }, [reports]);

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <section className="relative overflow-hidden rounded-[2.25rem] border border-border bg-card/95 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_28%)]" />
          <div className="absolute inset-0 tactical-grid opacity-20" />

          <div className="relative flex flex-wrap items-start justify-between gap-5 p-6">
            <div className="max-w-4xl space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Daily Report Library
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                Gunluk derin analiz arsivi
              </h1>
              <p className="text-sm leading-7 text-muted-foreground md:text-[15px]">
                `dailyreport/` altindaki klasor paketleri ve tek markdown raporlari bu
                ekranda otomatik toplanir. Publish edilmis kayit varsa korunur; yoksa
                kaynak dosya dogrudan gorunur.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="size-4" />
                Yenile
              </Button>
              <Button type="button" variant="outline" onClick={() => setLocation("/app/admin")}>
                Admin Workspace
              </Button>
            </div>
          </div>

          <div className="relative grid gap-3 border-t border-border/70 p-6 md:grid-cols-4">
            <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-300">
                  <CalendarRange className="size-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Son rapor
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {libraryStats.latestDate}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-2 text-cyan-300">
                  <DatabaseZap className="size-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Rapor adedi
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {libraryStats.reports}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-2 text-amber-300">
                  <GalleryHorizontal className="size-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Toplam figuer
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {libraryStats.figures}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 p-2 text-fuchsia-300">
                  <DatabaseZap className="size-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Ticker coverage
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {libraryStats.tickers}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-[2rem] border border-border bg-card/95 p-4 shadow-2xl xl:sticky xl:top-24 xl:h-[calc(100vh-8rem)] xl:overflow-y-auto">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Report index
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tarih ve kaynak bazli secim
                </p>
              </div>
              {loading ? (
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Loading
                </span>
              ) : null}
            </div>

            <div className="space-y-3">
              {reports.map(report => {
                const active = selectedReport?.id === report.id;

                return (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => setSelectedReportId(report.id)}
                    className={`w-full rounded-[1.6rem] border p-4 text-left transition-all ${
                      active
                        ? "border-emerald-400/35 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.08)]"
                        : "border-border bg-background/45 hover:border-white/12 hover:bg-background/65"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {formatReportDate(report.reportDate)}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                        {report.content.sourceKind === "file" ? "file" : "package"}
                      </span>
                    </div>

                    <h2 className="mt-3 line-clamp-2 text-base font-semibold leading-6 text-foreground">
                      {report.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {report.content.headline}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        {report.content.figureFiles.length} figure
                      </span>
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        {report.content.tickerUniverse.length} ticker
                      </span>
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        {report.content.sourceLabel || report.sourceFolder}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="min-w-0">
            {selectedReport ? (
              <DailyReportViewer
                title={selectedReport.title}
                reportDate={selectedReport.reportDate}
                sourceFolder={selectedReport.sourceFolder}
                content={selectedReport.content}
              />
            ) : (
              <section className="rounded-[2rem] border border-dashed border-border bg-card/90 p-6 text-sm leading-7 text-muted-foreground shadow-xl">
                {loading
                  ? "Gunluk rapor kutuphanesi yukleniyor."
                  : "Henuz bulunabilir bir gunluk rapor yok. `dailyreport/` altina tarihli paket veya `.md` dosyasi eklendiginde burada otomatik gorunecek."}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
