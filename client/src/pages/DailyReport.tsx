import { useEffect, useMemo, useState } from "react";
import type { DailyReportRecord } from "@shared/dailyReports";
import DailyReportViewer from "@/components/reports/DailyReportViewer";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface DailyReportsResponse {
  reports?: DailyReportRecord[];
}

function sortDailyReportsNewestFirst(reports: DailyReportRecord[]) {
  return [...reports].sort((left, right) => right.reportDate.localeCompare(left.reportDate));
}

export default function DailyReportPage() {
  const [, setLocation] = useLocation();
  const [reports, setReports] = useState<DailyReportRecord[]>([]);
  const [selectedReportId, setSelectedReportId] = useState("");

  useEffect(() => {
    let cancelled = false;

    void (async () => {
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
        setSelectedReportId(nextReports[0]?.id || "");
      } catch {
        // Leave page in empty state.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedReport = useMemo(
    () => reports.find(report => report.id === selectedReportId) || reports[0] || null,
    [reports, selectedReportId]
  );

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Daily Report
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                Gunluk Derin Analiz
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Admin tarafinda `dailyreport/` klasorune birakilan gunluk paketler
                preview edilip publish edilir. Burada son yayinlar tarih sirasiyla
                gorunur.
              </p>
            </div>

            <Button type="button" variant="outline" onClick={() => setLocation("/app/admin")}>
              Admin Workspace
            </Button>
          </div>

          {reports.length ? (
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {reports.map(report => (
                <button
                  key={report.id}
                  type="button"
                  onClick={() => setSelectedReportId(report.id)}
                  className={`shrink-0 rounded-full border px-3 py-2 text-sm ${
                    selectedReport?.id === report.id
                      ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-300"
                      : "border-border bg-background/60 text-muted-foreground"
                  }`}
                >
                  {new Intl.DateTimeFormat("tr-TR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(`${report.reportDate}T00:00:00Z`))}
                </button>
              ))}
            </div>
          ) : null}
        </section>

        {selectedReport ? (
          <DailyReportViewer
            title={selectedReport.title}
            reportDate={selectedReport.reportDate}
            sourceFolder={selectedReport.sourceFolder}
            content={selectedReport.content}
          />
        ) : (
          <section className="rounded-[2rem] border border-dashed border-border bg-card/90 p-6 text-sm text-muted-foreground shadow-xl">
            Henuz yayinlanmis daily report yok. Admin workspace'ten bir source
            package publish edildiginde burada gorunecek.
          </section>
        )}
      </div>
    </div>
  );
}
