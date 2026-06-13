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
  CandlestickChart,
  Clock3,
  FileText,
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
import WorkspaceHeroPanel from "@/components/workspace/WorkspaceHeroPanel";
import WorkspaceLoadingState from "@/components/workspace/WorkspaceLoadingState";
import WorkspaceSummaryCard, {
  type SummaryTone,
} from "@/components/workspace/WorkspaceSummaryCard";
import MomentumReportDocumentTab from "@/components/tabs/MomentumReportDocumentTab";
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

type TabId = "market" | "setups" | "strategy" | "document" | "scanner";

const tabs: Array<{
  id: TabId;
  label: string;
  icon: typeof CandlestickChart;
}> = [
  { id: "market", label: "Market Pulse", icon: CandlestickChart },
  { id: "setups", label: "Setups", icon: TrendingUp },
  { id: "strategy", label: "Strategy", icon: ShieldCheck },
  { id: "document", label: "Document", icon: FileText },
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

function formatMomentumUpdateStamp(value: string, locale = "tr-TR") {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
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

function copy(language: AppLanguage, tr: string, en: string) {
  return language === "en" ? en : tr;
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
  const locale = language === "en" ? "en-US" : "tr-TR";

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
      label: copy(language, "Rapor adedi", "Report count"),
      value: String(reports.length),
      hint: copy(language, "momentum kutuphanesi", "Momentum library"),
      icon: Radar,
      tone: "info",
    });

    const updateStamp = formatMomentumUpdateStamp(activeSummary?.updatedAt || "", locale);
    if (hasDisplayValue(updateStamp)) {
      items.push({
        label: copy(language, "Son update", "Latest update"),
        value: updateStamp,
        hint: copy(language, "Kaynak degisiklik zamani", "Source change timestamp"),
        icon: RefreshCw,
        tone: "bull",
      });
    }

    if (hasDisplayValue(activeSummary?.vixLabel)) {
      items.push({
        label: "VIX",
        value: activeSummary?.vixLabel || "",
        hint: copy(language, "Secili rapor volatilite baglami", "Volatility context for the selected report"),
        icon: Zap,
        tone: "caution",
      });
    }

    if (topSetup?.ticker || topSetup?.name) {
      items.push({
        label: "Top setup",
        value: topSetup?.ticker || topSetup?.name || "",
        hint: topSetup?.scoreLabel || copy(language, "Momentum skoru", "Momentum score"),
        icon: Target,
        tone: "bull",
      });
    }

    return items;
  }, [activeSummary, language, locale, reports.length, topSetup]);

  const selectedSourceLabel = useMemo(() => {
    return activeSummary?.sourceFile || parsedReport?.sourceFile || "";
  }, [activeSummary, parsedReport]);

  const selectedSubtitle = useMemo(() => {
    return activeSummary?.subtitle || activeSummary?.headline || parsedReport?.subtitle || "";
  }, [activeSummary, parsedReport]);

  const selectedUpdateLabel = formatMomentumUpdateStamp(activeSummary?.updatedAt || "", locale);
  const selectedTitle =
    activeSummary?.title ||
    parsedReport?.title ||
    copy(language, "Momentum report bekleniyor", "Momentum report pending");
  const hasReports = reports.length > 0;

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
              {copy(
                language,
                "Momentum raporundan sonra canli tarama, filtreleme ve option breakdown ayni panelde devam eder.",
                "After the momentum report, live scanning, filtering and option breakdown continue in the same panel."
              )}
            </p>
          </div>
          <ScannerPage lang={language} />
        </section>
      );
    }

    if (loadingReports || loadingDetail) {
      return (
        <WorkspaceLoadingState
          label={copy(language, "Momentum report workspace yukleniyor.", "Loading momentum workspace.")}
        />
      );
    }

    if (!parsedReport) {
      return (
        <WorkspaceLoadingState
          label={copy(
            language,
            "Henuz goruntulenebilir bir momentum report yok. `momentum/` altina yeni `.md` dosyasi eklendiginde burada otomatik listelenecek.",
            "There is no viewable momentum report yet. When a new `.md` file is added under `momentum/`, it will appear here automatically."
          )}
        />
      );
    }

    switch (activeTab) {
      case "market":
        return <MomentumMarketTab report={parsedReport} language={language} />;
      case "setups":
        return <MomentumSetupsTab report={parsedReport} language={language} />;
      case "strategy":
        return <MomentumStrategyTab report={parsedReport} language={language} />;
      case "document":
        return <MomentumReportDocumentTab report={parsedReport} language={language} />;
      default:
        return <MomentumMarketTab report={parsedReport} language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <WorkspaceHeroPanel
          overlayClassName="bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_26%)]"
          badges={
            <>
              <span className="badge-strong">
                {positiveIndices} {copy(language, "pozitif endeks", "positive indices")}
              </span>
              <span className="badge-danger">
                {negativeIndices} {copy(language, "negatif endeks", "negative indices")}
              </span>
              <span className="badge-warning">
                {regimeCount} {copy(language, "rejim faktor", "regime factors")}
              </span>
            </>
          }
          eyebrow="Momentum Scanner Workspace"
          title={copy(language, "Momentum report ve live scanner", "Momentum report and live scanner")}
          description={copy(
            language,
            "Tum yuklenen momentum markdown dosyalari bu arsivde gorunur. Secili rapor icin sade market, setup, strategy, tam dokuman ve live scanner akislari ayni workspace icinde acilir.",
            "Every uploaded momentum markdown file appears in this archive. For the selected report, the simplified market, setup, strategy, full document and live scanner flows open in the same workspace."
          )}
          actions={
            <>
              <Button type="button" variant="outline" onClick={() => void loadReports()}>
                <RefreshCw className="size-4" />
                {copy(language, "Yenile", "Refresh")}
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
                {copy(language, "Arsiv", "Archive")}
              </Button>
            </>
          }
          reportStrip={
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
                      {report.targetDateLabel || formatMomentumReportDate(report.reportDate, locale)}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Clock3 className="size-3.5" />
                      <span>{formatMomentumUpdateStamp(report.updatedAt, locale)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          }
          statusBar={
            hasReports ? (
              <div className="inline-flex max-w-full flex-wrap items-center gap-3 rounded-xl border border-border bg-background/40 px-4 py-3 text-xs text-muted-foreground">
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
                  {topSetup?.ticker || copy(language, "Top setup bekleniyor", "Top setup pending")}
                </span>
              </div>
            ) : (
              <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-xl border border-dashed border-border bg-background/35 px-4 py-3 text-xs text-muted-foreground">
                {loadingReports
                  ? copy(language, "Momentum report listesi yukleniyor.", "Loading momentum report list.")
                  : copy(language, "`momentum/` source geldikten sonra piyasa stat bar otomatik dolacak.", "The market stat bar will populate automatically when a `momentum/` source is available.")}
              </div>
            )
          }
        />

        <div
          className={`mt-6 grid gap-6 ${
            sidebarOpen ? "xl:grid-cols-[minmax(0,1.55fr)_340px]" : ""
          }`}
        >
          <main ref={contentRef} className="min-w-0 space-y-6">
            <section className="workspace-panel p-4 md:p-5">
              {hasReports ? (
                <div className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-end md:justify-between">
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
                      Selected report
                    </p>
                    <h2 className="heading-condensed text-2xl text-foreground md:text-3xl">
                      {selectedTitle}
                    </h2>
                    <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                      {selectedSubtitle ||
                        copy(
                          language,
                          "Secili raporun alt basligi burada gorunur.",
                          "The subtitle for the selected report appears here."
                        )}
                    </p>
                    {hasDisplayValue(selectedSourceLabel) ? (
                      <p className="data-mono text-xs text-muted-foreground">
                        Source: {selectedSourceLabel}
                      </p>
                    ) : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 md:min-w-[420px]">
                    <WorkspaceSummaryCard
                      label={copy(language, "Rapor tarihi", "Report date")}
                      value={activeSummary?.reportDateLabel || "-"}
                      hint={copy(language, "Momentum source takvimi", "Momentum source calendar")}
                      icon={CandlestickChart}
                      tone="info"
                    />
                    <WorkspaceSummaryCard
                      label="Target"
                      value={activeSummary?.targetDateLabel || "-"}
                      hint={copy(language, "Aksiyon / hedef seans", "Action / target session")}
                      icon={Target}
                      tone="caution"
                    />
                    <WorkspaceSummaryCard
                      label="Update"
                      value={selectedUpdateLabel}
                      hint={copy(language, "Dosya degisiklik damgasi", "File update timestamp")}
                      icon={Clock3}
                      tone="bull"
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-background/35 p-4 text-sm leading-7 text-muted-foreground">
                  {loadingReports
                    ? copy(language, "Secili momentum raporu yukleniyor.", "Loading selected momentum report.")
                    : copy(language, "Henuz secilebilir bir momentum raporu yok. Yeni source geldikten sonra bu alan otomatik dolacak.", "There is no selectable momentum report yet. This area will populate automatically when a new source arrives.")}
                </div>
              )}

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
                    {copy(language, "Gorunum degisiyor...", "Switching view...")}
                  </div>
                ) : null}
                {renderActiveTab()}
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

                {hasReports ? (
                  <div className="mt-4 space-y-3">
                    {summaryCards.map(card => (
                      <WorkspaceSummaryCard
                        key={card.label}
                        label={card.label}
                        value={card.value}
                        hint={card.hint}
                        icon={card.icon}
                        tone={card.tone}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-dashed border-border bg-background/35 p-4 text-sm leading-6 text-muted-foreground">
                    {loadingReports
                      ? copy(language, "Sidebar snapshot hazirlaniyor.", "Preparing sidebar snapshot.")
                      : copy(language, "Rapor gelmeden ozet kartlari bos gosterilmeyecek; veri geldiginde burada dolacak.", "Summary cards stay hidden until data is available and will populate automatically.")}
                  </div>
                )}
              </section>

              <section className="workspace-panel p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Archive
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {copy(language, "Zaman damgali report indeks listesi.", "Timestamped report index list.")}
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
                            {formatMomentumUpdateStamp(report.updatedAt, locale)}
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
                      {copy(
                        language,
                        "`momentum/` altina yeni `.md` dosyasi eklendiginde burada otomatik gorunecek.",
                        "When a new `.md` file is added under `momentum/`, it will appear here automatically."
                      )}
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
