import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  CandlestickChart,
  PanelLeftClose,
  PanelLeftOpen,
  Radar,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useLocation } from "wouter";
import type {
  MomentumSourceRecord,
  MomentumSourceSummary,
} from "@shared/momentumSources";
import { Button } from "@/components/ui/button";
import { formatMomentumReportDate, sortMomentumReportsNewestFirst } from "@/lib/momentumReportLibrary";
import { parseMomentumReportMarkdown } from "@/lib/momentumReportSource";
import type { AppLanguage } from "@/lib/i18n";
import MomentumMarketTab from "@/scanner/components/MomentumMarketTab";
import MomentumSetupsTab from "@/scanner/components/MomentumSetupsTab";
import MomentumStrategyTab from "@/scanner/components/MomentumStrategyTab";
import ScannerPage from "@/scanner/components/ScannerPage";

type TabId = "market" | "setups" | "strategy" | "scanner";

const tabs: Array<{
  id: TabId;
  label: string;
  icon: typeof CandlestickChart;
}> = [
  { id: "market", label: "Market Pulse", icon: CandlestickChart },
  { id: "setups", label: "Setups", icon: TrendingUp },
  { id: "strategy", label: "Strategy", icon: ShieldCheck },
  { id: "scanner", label: "Live Scanner", icon: Radar },
];

interface ScannerRoutePageProps {
  language: AppLanguage;
}

interface MomentumReportsListResponse {
  reports?: MomentumSourceSummary[];
}

interface MomentumReportDetailResponse {
  report?: MomentumSourceRecord | null;
}

function formatMomentumUpdateStamp(value: string) {
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
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-none border border-border bg-card/80 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="data-mono mt-2 text-2xl font-bold text-foreground">
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <section className="rounded-[2rem] border border-border bg-card/90 p-6 text-sm leading-7 text-muted-foreground shadow-xl">
      {label}
    </section>
  );
}

export default function Scanner({ language }: ScannerRoutePageProps) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabId>("market");
  const [selectedReportId, setSelectedReportId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reports, setReports] = useState<MomentumSourceSummary[]>([]);
  const [activeReport, setActiveReport] = useState<MomentumSourceRecord | null>(null);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [activeTab, selectedReportId]);

  const loadReports = useCallback(async () => {
    setLoadingReports(true);

    try {
      const response = await fetch("/api/momentum/sources", {
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as MomentumReportsListResponse;
      const nextReports = sortMomentumReportsNewestFirst(payload.reports || []);
      setReports(nextReports);
      setSelectedReportId(current =>
        current && nextReports.some(report => report.id === current)
          ? current
          : nextReports[0]?.id || ""
      );
    } catch {
      // Leave the page in honest empty state.
    } finally {
      setLoadingReports(false);
    }
  }, []);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  useEffect(() => {
    if (!selectedReportId) {
      setActiveReport(null);
      return;
    }

    let cancelled = false;

    async function loadReportDetail() {
      setLoadingDetail(true);

      try {
        const response = await fetch(`/api/momentum/sources/${encodeURIComponent(selectedReportId)}`, {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          if (!cancelled) {
            setActiveReport(null);
          }
          return;
        }

        const payload = (await response.json()) as MomentumReportDetailResponse;
        if (!cancelled) {
          setActiveReport(payload.report || null);
        }
      } catch {
        if (!cancelled) {
          setActiveReport(null);
        }
      } finally {
        if (!cancelled) {
          setLoadingDetail(false);
        }
      }
    }

    void loadReportDetail();

    return () => {
      cancelled = true;
    };
  }, [selectedReportId]);

  const selectedSummary = useMemo(
    () => reports.find(report => report.id === selectedReportId) || reports[0] || null,
    [reports, selectedReportId]
  );

  const parsedReport = useMemo(() => {
    if (!activeReport) {
      return null;
    }

    return parseMomentumReportMarkdown(activeReport.markdown, activeReport.sourceFile);
  }, [activeReport]);

  const topSetup = useMemo(() => {
    if (!parsedReport) {
      return null;
    }

    return [...parsedReport.candidates].sort(
      (left, right) => (right.score || 0) - (left.score || 0)
    )[0] || null;
  }, [parsedReport]);

  const negativeIndices = parsedReport?.indexRows.filter(row => (row.pctChange || 0) < 0).length || 0;
  const regimeCount = parsedReport?.regimeFactors.length || 0;

  const renderActiveTab = () => {
    if (activeTab === "scanner") {
      return (
        <section className="overflow-hidden rounded-[2rem] border border-border bg-card/95 shadow-xl">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <Radar className="h-4 w-4 text-emerald-400" />
              <p className="heading-condensed text-sm text-foreground">
                Live Scanner Workspace
              </p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Raporu okuduktan sonra anlik tarama ve score breakdown burada devam eder.
            </p>
          </div>
          <ScannerPage lang={language} />
        </section>
      );
    }

    if (loadingReports || loadingDetail) {
      return <LoadingState label="Momentum report workspace yukleniyor." />;
    }

    if (!parsedReport) {
      return (
        <LoadingState label="Henuz goruntulenebilir bir momentum report yok. `momentum/` altina yeni `.md` dosyasi eklendiginde burada otomatik listelenecek." />
      );
    }

    switch (activeTab) {
      case "market":
        return <MomentumMarketTab report={parsedReport} />;
      case "setups":
        return <MomentumSetupsTab report={parsedReport} />;
      case "strategy":
        return <MomentumStrategyTab report={parsedReport} />;
      default:
        return <MomentumMarketTab report={parsedReport} />;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.11 0.025 230)" }}
    >
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          borderColor: "oklch(0.22 0.03 225)",
          background: "oklch(0.09 0.025 230 / 0.97)",
        }}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(current => !current)}
              className="hidden rounded-none border border-border bg-card/80 p-2 text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
              aria-label={sidebarOpen ? "Sidebar gizle" : "Sidebar goster"}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
            </button>

            <div className="flex items-center gap-3">
              <div
                className="h-2 w-2 rounded-full pulse-live"
                style={{ background: "oklch(0.78 0.18 160)" }}
              />
              <div className="leading-tight">
                <p
                  className="heading-condensed text-sm"
                  style={{ color: "oklch(0.78 0.18 160)" }}
                >
                  Momentum Report Workspace
                </p>
                <p className="text-xs text-muted-foreground">
                  Runtime markdown library + live scanner
                </p>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-5 md:flex">
            <div className="text-right">
              <p className="data-mono text-[11px] text-muted-foreground">
                SON RAPOR
              </p>
              <p className="data-mono text-xs font-semibold text-emerald-300">
                {selectedSummary?.reportDateLabel || "-"}
              </p>
            </div>
            <div className="text-right">
              <p className="data-mono text-[11px] text-muted-foreground">
                HEDEF
              </p>
              <p className="data-mono text-xs font-semibold text-foreground">
                {selectedSummary?.targetDateLabel || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-none"
              onClick={() => void loadReports()}
            >
              <RefreshCw className="h-4 w-4" />
              Yenile
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-none"
              onClick={() => setLocation("/daily-report")}
            >
              <Activity className="h-4 w-4" />
              Daily
            </Button>
          </div>
        </div>
      </header>

      <section
        className="border-b px-4 py-5 lg:px-6"
        style={{
          borderColor: "oklch(0.22 0.03 225)",
          background:
            "linear-gradient(180deg, oklch(0.13 0.03 225) 0%, oklch(0.11 0.025 230) 100%)",
        }}
      >
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge-danger">{negativeIndices} negatif endeks</span>
              <span className="badge-strong">{regimeCount} rejim faktoru</span>
              <span className="badge-warning">{reports.length} rapor arsivi</span>
            </div>

            <div className="space-y-2">
              <h1
                className="heading-condensed text-3xl leading-none md:text-5xl"
                style={{ color: "oklch(0.95 0.01 220)" }}
              >
                Momentum rapor kutuphanesi,
                <br />
                <span style={{ color: "oklch(0.78 0.18 160)" }}>
                  gunden gune guncel analiz workspace'i
                </span>
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                `momentum/` altina yeni `.md` dosyasi biraktiginda sistem onu otomatik
                indeksler, ayni gunde birden fazla update gelse bile zaman damgasina
                gore siralar ve ayni tema icinde chart destekli analiz ekranina
                cevirir. Scanner artik raporun alt katmani.
              </p>
            </div>

            <div className="rounded-none border border-emerald-400/25 bg-emerald-500/5 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Selected source
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="data-mono text-foreground">
                  {selectedSummary?.sourceFile || "momentum/"}
                </span>{" "}
                dosyasi secili. En yeni rapor varsayilan secim olur, onceki gunler
                arsivde kalir.
              </p>
            </div>

            {parsedReport?.executiveSummary ? (
              <div className="rounded-[1.5rem] border border-border bg-card/65 px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Executive Summary
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  {parsedReport.executiveSummary}
                </p>
              </div>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <SummaryCard
              label="Rapor adedi"
              value={String(reports.length)}
              hint="momentum kutuphanesi"
            />
            <SummaryCard
              label="Son update"
              value={formatMomentumUpdateStamp(selectedSummary?.updatedAt || "")}
              hint="Dosyanin son degisiklik zamani"
            />
            <SummaryCard
              label="Session"
              value={selectedSummary?.sessionDateLabel || "-"}
              hint="Referans seans tarihi"
            />
            <SummaryCard
              label="Target"
              value={selectedSummary?.targetDateLabel || "-"}
              hint="Raporun aksiyon gunu"
            />
            <SummaryCard
              label="VIX"
              value={selectedSummary?.vixLabel || "-"}
              hint="Secili rapor volatilite bandi"
            />
            <SummaryCard
              label="Top setup"
              value={topSetup?.ticker || topSetup?.name || "-"}
              hint={topSetup ? topSetup.scoreLabel : "Momentum skoru"}
            />
            <SummaryCard
              label="Okuma"
              value={selectedSummary?.readingTimeLabel || "-"}
              hint="Rapor icindeki tahmini sure"
            />
          </div>
        </div>
      </section>

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen ? (
          <aside
            className="hidden border-r lg:flex lg:w-[320px] lg:min-w-[320px] lg:flex-col"
            style={{
              background: "oklch(0.09 0.025 230)",
              borderColor: "oklch(0.22 0.03 225)",
            }}
          >
            <nav className="border-b p-3" style={{ borderColor: "oklch(0.22 0.03 225)" }}>
              <div className="mb-3 px-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Workspace Sekmeleri
                </span>
              </div>
              <div className="space-y-0.5">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className="w-full px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] transition-all"
                    style={{
                      background:
                        activeTab === tab.id
                          ? "oklch(0.78 0.18 160 / 0.12)"
                          : "transparent",
                      borderLeft:
                        activeTab === tab.id
                          ? "2px solid oklch(0.78 0.18 160)"
                          : "2px solid transparent",
                      color:
                        activeTab === tab.id
                          ? "oklch(0.78 0.18 160)"
                          : "oklch(0.55 0.015 225)",
                    }}
                  >
                    <tab.icon className="mr-2 inline-flex h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>

            <div className="flex-1 overflow-y-auto p-3">
              <div className="mb-3 flex items-center justify-between gap-3 px-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Report Index
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Tarih + update zamani
                  </p>
                </div>
                {loadingReports ? (
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Loading
                  </span>
                ) : null}
              </div>

              <div className="space-y-3">
                {reports.map(report => {
                  const active = report.id === selectedReportId;

                  return (
                    <button
                      key={report.id}
                      type="button"
                      onClick={() => setSelectedReportId(report.id)}
                      className={`w-full rounded-[1.5rem] border p-4 text-left transition-all ${
                        active
                          ? "border-emerald-400/35 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.08)]"
                          : "border-border bg-background/45 hover:border-white/12 hover:bg-background/65"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          {formatMomentumReportDate(report.reportDate)}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                          {report.vixLabel || "VIX -"}
                        </span>
                      </div>

                      <h2 className="mt-3 line-clamp-2 text-base font-semibold leading-6 text-foreground">
                        {report.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {report.subtitle || report.headline}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          {report.targetDateLabel || report.reportDateLabel}
                        </span>
                        <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          {formatMomentumUpdateStamp(report.updatedAt)}
                        </span>
                        <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          {report.fileName}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {!loadingReports && !reports.length ? (
                <div className="rounded-[1.5rem] border border-dashed border-border bg-background/40 p-4 text-sm leading-6 text-muted-foreground">
                  `momentum/` altina yeni `.md` dosyasi eklendiginde burada otomatik
                  gorunecek.
                </div>
              ) : null}
            </div>
          </aside>
        ) : null}

        <main
          ref={contentRef}
          className="min-w-0 flex-1 overflow-y-auto"
          style={{ background: "oklch(0.11 0.025 230)" }}
        >
          <div
            className="border-b px-4 py-3 lg:hidden"
            style={{ borderColor: "oklch(0.22 0.03 225)" }}
          >
            <div className="flex gap-2 overflow-x-auto pb-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 rounded-none border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] ${
                    activeTab === tab.id
                      ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-300"
                      : "border-border bg-card/70 text-muted-foreground"
                  }`}
                >
                  <tab.icon className="mr-2 inline-flex h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {reports.map(report => (
                <button
                  key={report.id}
                  type="button"
                  onClick={() => setSelectedReportId(report.id)}
                  className={`shrink-0 rounded-none border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] ${
                    selectedReportId === report.id
                      ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-300"
                      : "border-border bg-card/70 text-muted-foreground"
                  }`}
                >
                  {report.title}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="rounded-[2rem] border border-border bg-card/95 p-5 shadow-xl">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Selected report
                  </p>
                  <h2 className="heading-condensed text-3xl text-foreground">
                    {selectedSummary?.title || "Momentum report bekleniyor"}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {selectedSummary?.subtitle || selectedSummary?.headline || "Secili raporun alt basligi burada gorunur."}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[420px]">
                  <div className="rounded-none border border-border bg-background/50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Session
                    </p>
                    <p className="mt-2 data-mono text-sm font-bold text-foreground">
                      {selectedSummary?.sessionDateLabel || "-"}
                    </p>
                  </div>
                  <div className="rounded-none border border-border bg-background/50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Hedef
                    </p>
                    <p className="mt-2 data-mono text-sm font-bold text-amber-300">
                      {selectedSummary?.targetDateLabel || "-"}
                    </p>
                  </div>
                  <div className="rounded-none border border-border bg-background/50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Kaynak
                    </p>
                    <p className="mt-2 data-mono text-sm font-bold text-foreground">
                      {selectedSummary?.fileName || "-"}
                    </p>
                  </div>
                  <div className="rounded-none border border-border bg-background/50 p-3 sm:col-span-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Update stamp
                    </p>
                    <p className="mt-2 data-mono text-sm font-bold text-emerald-300">
                      {formatMomentumUpdateStamp(selectedSummary?.updatedAt || "")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}
