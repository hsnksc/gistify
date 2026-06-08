import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  Activity,
  ArrowRight,
  CandlestickChart,
  Clock3,
  PanelLeftClose,
  PanelLeftOpen,
  Radar,
  RefreshCw,
  ShieldCheck,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useLocation } from "wouter";
import type {
  MomentumSourceRecord,
  MomentumSourceSummary,
} from "@shared/momentumSources";
import { Button } from "@/components/ui/button";
import {
  formatMomentumReportDate,
  sortMomentumReportsNewestFirst,
} from "@/lib/momentumReportLibrary";
import { parseMomentumReportMarkdown } from "@/lib/momentumReportSource";
import type { AppLanguage } from "@/lib/i18n";
import MomentumMarketTab from "@/scanner/components/MomentumMarketTab";
import MomentumSetupsTab from "@/scanner/components/MomentumSetupsTab";
import MomentumStrategyTab from "@/scanner/components/MomentumStrategyTab";
import ScannerPage from "@/scanner/components/ScannerPage";

type TabId = "market" | "setups" | "strategy" | "scanner";
type SummaryTone = "bull" | "bear" | "caution" | "info";

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

function hasDisplayValue(value: string | null | undefined) {
  const normalized = String(value || "").trim();
  return Boolean(normalized && normalized !== "-" && normalized !== "momentum/");
}

function SummaryCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "info",
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof CandlestickChart;
  tone?: SummaryTone;
}) {
  const toneClasses: Record<SummaryTone, string> = {
    bull: "border-emerald-500/22 bg-emerald-500/10 text-emerald-300",
    bear: "border-red-500/22 bg-red-500/10 text-red-300",
    caution: "border-amber-500/22 bg-amber-500/10 text-amber-300",
    info: "border-indigo-500/22 bg-indigo-500/10 text-indigo-300",
  };

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

function LoadingState({ label }: { label: string }) {
  return (
    <section className="workspace-card p-6 text-sm leading-7 text-muted-foreground">
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
  const [isTabPending, startTabTransition] = useTransition();
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
        const response = await fetch(
          `/api/momentum/sources/${encodeURIComponent(selectedReportId)}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

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
  const activeSummary = selectedSummary || activeReport;

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

  const negativeIndices =
    parsedReport?.indexRows.filter(row => (row.pctChange || 0) < 0).length || 0;
  const regimeCount = parsedReport?.regimeFactors.length || 0;
  const positiveIndices = (parsedReport?.indexRows.length || 0) - negativeIndices;

  const summaryCards = useMemo(() => {
    const items: Array<{
      label: string;
      value: string;
      hint: string;
      icon: typeof CandlestickChart;
      tone?: SummaryTone;
    }> = [];

    items.push({
      label: "Rapor adedi",
      value: String(reports.length),
      hint: "momentum kutuphanesi",
      icon: Radar,
      tone: "info",
    });

    const updateStamp = formatMomentumUpdateStamp(activeSummary?.updatedAt || "");
    if (hasDisplayValue(updateStamp)) {
      items.push({
        label: "Son update",
        value: updateStamp,
        hint: "Kaynak degisiklik zamani",
        icon: RefreshCw,
        tone: "bull",
      });
    }

    if (hasDisplayValue(activeSummary?.vixLabel)) {
      items.push({
        label: "VIX",
        value: activeSummary?.vixLabel || "",
        hint: "Secili rapor volatilite baglami",
        icon: Zap,
        tone: "caution",
      });
    }

    if (topSetup?.ticker || topSetup?.name) {
      items.push({
        label: "Top setup",
        value: topSetup?.ticker || topSetup?.name || "",
        hint: topSetup?.scoreLabel || "Momentum skoru",
        icon: Target,
        tone: "bull",
      });
    }

    return items;
  }, [activeSummary, reports.length, topSetup]);

  const selectedSourceLabel = useMemo(() => {
    return activeSummary?.sourceFile || parsedReport?.sourceFile || "";
  }, [activeSummary, parsedReport]);

  const selectedSubtitle = useMemo(() => {
    return activeSummary?.subtitle || activeSummary?.headline || parsedReport?.subtitle || "";
  }, [activeSummary, parsedReport]);

  const selectedUpdateLabel = formatMomentumUpdateStamp(activeSummary?.updatedAt || "");
  const selectedTitle =
    activeSummary?.title || parsedReport?.title || "Momentum report bekleniyor";

  const handleTabChange = (tab: TabId) => {
    startTabTransition(() => {
      setActiveTab(tab);
    });
  };

  const renderActiveTab = () => {
    if (activeTab === "scanner") {
      return (
        <section className="workspace-card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <Radar className="size-4 text-indigo-300" />
              <p className="heading-condensed text-sm text-foreground">
                Live scanner workspace
              </p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Momentum raporundan sonra canli tarama, filtreleme ve option breakdown
              ayni panelde devam eder.
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
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <section className="workspace-panel overflow-hidden">
          <div className="relative overflow-hidden px-5 py-5 md:px-6 md:py-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_26%)]" />
            <div className="relative space-y-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge-strong">{positiveIndices} pozitif endeks</span>
                    <span className="badge-danger">{negativeIndices} negatif endeks</span>
                    <span className="badge-warning">{regimeCount} rejim faktor</span>
                  </div>
                  <div className="space-y-2">
                    <p className="heading-condensed text-sm uppercase tracking-[0.18em] text-indigo-300">
                      Momentum Scanner Workspace
                    </p>
                    <h1 className="heading-condensed max-w-4xl text-3xl leading-none text-foreground md:text-5xl">
                      Gunluk momentum analizini,
                      <span className="text-glow-accent text-indigo-300"> rapor + scanner</span>
                      {" "}ikilisinde tut.
                    </h1>
                    <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-[15px]">
                      Ustte zaman damgali report seridi, ortada secili raporun piyasa
                      ozetleri, altta ise market tabs ve live scanner ayni duzende acilir.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="outline" onClick={() => void loadReports()}>
                    <RefreshCw className="size-4" />
                    Yenile
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setLocation("/daily-report")}>
                    <Activity className="size-4" />
                    Daily
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSidebarOpen(current => !current)}
                  >
                    {sidebarOpen ? (
                      <PanelLeftClose className="size-4" />
                    ) : (
                      <PanelLeftOpen className="size-4" />
                    )}
                    Arsiv
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto terminal-scrollbar pb-2">
                {reports.map((report, index) => {
                  const active = report.id === selectedReportId;

                  return (
                    <button
                      key={report.id}
                      type="button"
                      onClick={() => setSelectedReportId(report.id)}
                      className={`min-w-[220px] shrink-0 rounded-xl border px-4 py-3 text-left transition-all duration-150 ${
                        active
                          ? "border-indigo-400/45 bg-indigo-500/14 shadow-[0_0_18px_rgba(99,102,241,0.16)]"
                          : "border-border bg-card/80 hover:border-border hover:bg-[rgba(35,45,66,0.72)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="data-mono text-[11px] text-muted-foreground">
                          {index === 0 ? "LATEST" : "ARCHIVE"}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-300">
                          {report.vixLabel || "VIX -"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-foreground">
                        {report.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {report.targetDateLabel || formatMomentumReportDate(report.reportDate)}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Clock3 className="size-3.5" />
                        <span>{formatMomentumUpdateStamp(report.updatedAt)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CandlestickChart className="size-3.5 text-sky-300" />
                  {parsedReport?.indexRows.length || 0} index row
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="size-3.5 text-emerald-300" />
                  {parsedReport?.candidates.length || 0} setup
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="flex items-center gap-1.5">
                  <TrendingDown className="size-3.5 text-red-300" />
                  {negativeIndices} negative breadth
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="flex items-center gap-1.5">
                  <Target className="size-3.5 text-indigo-300" />
                  {topSetup?.ticker || "Top setup bekleniyor"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div
          className={`mt-6 grid gap-6 ${
            sidebarOpen ? "xl:grid-cols-[minmax(0,1.55fr)_340px]" : ""
          }`}
        >
          <main ref={contentRef} className="min-w-0 space-y-6">
            <section className="workspace-panel p-4 md:p-5">
              <div className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
                    Selected report
                  </p>
                  <h2 className="heading-condensed text-2xl text-foreground md:text-3xl">
                    {selectedTitle}
                  </h2>
                  <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                    {selectedSubtitle || "Secili raporun alt basligi burada gorunur."}
                  </p>
                  {hasDisplayValue(selectedSourceLabel) ? (
                    <p className="data-mono text-xs text-muted-foreground">
                      Source: {selectedSourceLabel}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-3 md:min-w-[420px]">
                  <SummaryCard
                    label="Rapor tarihi"
                    value={activeSummary?.reportDateLabel || "-"}
                    hint="Momentum source takvimi"
                    icon={CandlestickChart}
                    tone="info"
                  />
                  <SummaryCard
                    label="Target"
                    value={activeSummary?.targetDateLabel || "-"}
                    hint="Aksiyon / hedef seans"
                    icon={Target}
                    tone="caution"
                  />
                  <SummaryCard
                    label="Update"
                    value={selectedUpdateLabel}
                    hint="Dosya degisiklik damgasi"
                    icon={Clock3}
                    tone="bull"
                  />
                </div>
              </div>

              {parsedReport?.executiveSummary ? (
                <div className="mt-4 workspace-card p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Executive Summary
                  </p>
                  <p className="mt-2 text-sm leading-7 text-foreground/90">
                    {parsedReport.executiveSummary}
                  </p>
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2 rounded-xl border border-border bg-background/45 p-1">
                {tabs.map(tab => {
                  const active = activeTab === tab.id;
                  const hasAlert = tab.id === "scanner" && negativeIndices > 0;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabChange(tab.id)}
                      className={`workspace-tab relative inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold ${
                        active ? "active" : ""
                      }`}
                    >
                      <tab.icon className="size-3.5" />
                      {tab.label}
                      {hasAlert ? (
                        <span className="absolute -right-1 -top-1 size-2 rounded-full bg-amber-400" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 space-y-5">
                {isTabPending ? (
                  <div className="rounded-xl border border-indigo-500/18 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-200">
                    Gorunum degisiyor...
                  </div>
                ) : null}
                {renderActiveTab()}
              </div>
            </section>

            <section className="workspace-panel p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="heading-condensed text-sm text-foreground">
                    Sonraki akis: daily intelligence
                  </p>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground">
                    Momentum raporundaki market rejimi ile daily report tarafindaki
                    uzun form analizleri ayni gorunur duzende birbirine bagla.
                  </p>
                </div>
                <Button type="button" onClick={() => setLocation("/daily-report")}>
                  Daily Report
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </section>
          </main>

          {sidebarOpen ? (
            <aside className="hidden min-w-0 space-y-6 xl:block">
              <section className="workspace-panel p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Snapshot
                    </p>
                    <h3 className="mt-2 heading-condensed text-xl text-foreground">
                      {activeSummary?.targetDateLabel || activeSummary?.reportDateLabel || "-"}
                    </h3>
                  </div>
                  <span className="badge-strong">scanner ready</span>
                </div>

                <div className="mt-4 space-y-3">
                  {summaryCards.map(card => (
                    <SummaryCard
                      key={card.label}
                      label={card.label}
                      value={card.value}
                      hint={card.hint}
                      icon={card.icon}
                      tone={card.tone}
                    />
                  ))}
                </div>
              </section>

              <section className="workspace-panel p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Archive
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Zaman damgali report indeks listesi.
                    </p>
                  </div>
                  {loadingReports ? (
                    <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Loading
                    </span>
                  ) : null}
                </div>

                <div className="terminal-scrollbar mt-4 max-h-[680px] space-y-3 overflow-y-auto pr-1">
                  {reports.map((report, index) => {
                    const active = report.id === selectedReportId;

                    return (
                      <button
                        key={report.id}
                        type="button"
                        onClick={() => setSelectedReportId(report.id)}
                        className={`w-full rounded-xl border p-4 text-left transition-all ${
                          active
                            ? "border-indigo-400/45 bg-indigo-500/12 shadow-[0_0_18px_rgba(99,102,241,0.12)]"
                            : "border-border bg-background/45 hover:border-border hover:bg-[rgba(35,45,66,0.72)]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="data-mono text-[11px] text-muted-foreground">
                            {index === 0 ? "LATEST" : "ARCHIVE"}
                          </span>
                          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-300">
                            {report.vixLabel || "VIX -"}
                          </span>
                        </div>
                        <p className="mt-3 line-clamp-2 text-sm font-semibold text-foreground">
                          {report.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {report.targetDateLabel || report.reportDateLabel}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          <span className="rounded-full border border-border bg-background/70 px-2 py-1">
                            {formatMomentumUpdateStamp(report.updatedAt)}
                          </span>
                          <span className="rounded-full border border-border bg-background/70 px-2 py-1">
                            {report.readingTimeLabel || "report"}
                          </span>
                        </div>
                      </button>
                    );
                  })}

                  {!loadingReports && !reports.length ? (
                    <div className="rounded-xl border border-dashed border-border bg-background/45 p-4 text-sm leading-6 text-muted-foreground">
                      `momentum/` altina yeni `.md` dosyasi eklendiginde burada otomatik
                      gorunecek.
                    </div>
                  ) : null}
                </div>
              </section>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}
