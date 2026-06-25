import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  ClipboardList,
  Clock3,
  FileText,
  Radar,
  RefreshCw,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useLocation } from "wouter";
import type {
  EarningReportSourceRecord,
  EarningReportSourceSummary,
} from "@shared/earningReports";
import type { AppLanguage } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import WorkspaceHeroPanel from "@/components/workspace/WorkspaceHeroPanel";
import WorkspaceLoadingState from "@/components/workspace/WorkspaceLoadingState";
import WorkspaceSummaryCard from "@/components/workspace/WorkspaceSummaryCard";
import EarningReportCalendarTab from "@/components/tabs/EarningReportCalendarTab";
import EarningReportPostTab from "@/components/tabs/EarningReportPostTab";
import EarningReportPlaybookTab from "@/components/tabs/EarningReportPlaybookTab";
import EarningReportRiskTab from "@/components/tabs/EarningReportRiskTab";
import {
  formatEarningReportDate,
  formatEarningReportDateTime,
  sortEarningReportsNewestFirst,
} from "@/lib/earningReports";
import { parseEarningReportMarkdown } from "@/lib/earningReportSource";

type TabId = "post" | "playbook" | "calendar" | "risk";

function getTabs(language: AppLanguage) {
  return [
    { id: "post" as const, label: copy(language, "Post", "Post"), icon: FileText },
    { id: "playbook" as const, label: copy(language, "Playbook", "Playbook"), icon: ClipboardList },
    { id: "calendar" as const, label: copy(language, "Takvim", "Calendar"), icon: CalendarDays },
    { id: "risk" as const, label: copy(language, "Risk", "Risk"), icon: AlertTriangle },
  ];
}

interface EarningReportsListResponse {
  reports?: EarningReportSourceSummary[];
}

interface EarningReportDetailResponse {
  report?: EarningReportSourceRecord | null;
}

export default function Home({ language }: { language: AppLanguage }) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabId>("post");
  const [selectedReportId, setSelectedReportId] = useState("");
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [reports, setReports] = useState<EarningReportSourceSummary[]>([]);
  const [activeReport, setActiveReport] = useState<EarningReportSourceRecord | null>(null);
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
      const response = await fetch("/api/earning-reports", {
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as EarningReportsListResponse;
      const nextReports = sortEarningReportsNewestFirst(payload.reports || []);
      setReports(nextReports);
      setSelectedReportId(current =>
        current && nextReports.some(report => report.id === current)
          ? current
          : nextReports[0]?.id || ""
      );
    } catch {
      // Leave page in honest empty state.
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
          `/api/earning-reports/${encodeURIComponent(selectedReportId)}`,
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

        const payload = (await response.json()) as EarningReportDetailResponse;
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

  const visibleReports = useMemo(() => reports, [reports]);

  const selectedSummary = useMemo(
    () =>
      visibleReports.find(report => report.id === selectedReportId) ||
      visibleReports[0] ||
      null,
    [visibleReports, selectedReportId]
  );

  const parsedReport = useMemo(() => {
    if (!activeReport) {
      return null;
    }

    return parseEarningReportMarkdown(activeReport.markdown, activeReport.sourceFile);
  }, [activeReport]);

  const positions = useMemo(() => {
    if (!parsedReport) {
      return [];
    }

    return [...parsedReport.positions].sort((left, right) => {
      if (left.daysLeft !== right.daysLeft) {
        return left.daysLeft - right.daysLeft;
      }

      return left.order - right.order;
    });
  }, [parsedReport]);

  useEffect(() => {
    if (!positions.length) {
      setSelectedTicker(null);
      return;
    }

    setSelectedTicker(current =>
      current && positions.some(position => position.ticker === current)
        ? current
        : positions[0].ticker
    );
  }, [positions]);

  const latestReport = visibleReports[0] || null;
  const hasReports = visibleReports.length > 0;
  const sidebarOpen = true;
  const locale = language === "en" ? "en-US" : "tr-TR";
  const latestUploadLabel = latestReport
    ? formatEarningReportDateTime(latestReport.updatedAt, locale)
    : "-";
  const selectedUploadLabel = selectedSummary
    ? formatEarningReportDateTime(selectedSummary.updatedAt, locale)
    : "-";
  const nextEvent = positions[0] || null;
  const bullishCount = positions.filter(position => {
    const callWeight = position.blueprint.callWeight ?? 0;
    const putWeight = position.blueprint.putWeight ?? 0;
    return callWeight > putWeight;
  }).length;
  const bearishCount = positions.filter(position => {
    const callWeight = position.blueprint.callWeight ?? 0;
    const putWeight = position.blueprint.putWeight ?? 0;
    return putWeight > callWeight;
  }).length;
  const balancedCount = positions.length - bullishCount - bearishCount;

  const avgIvRank = useMemo(() => {
    const valid = positions.filter(position => position.ivRank !== null);
    if (!valid.length) {
      return "-";
    }

    const total = valid.reduce((sum, position) => sum + (position.ivRank || 0), 0);
    return `%${Math.round(total / valid.length)}`;
  }, [positions]);

  const avgCpr = useMemo(() => {
    const valid = positions
      .map(position => {
        const metric = position.metrics.find(item =>
          item.label.toLocaleLowerCase("tr-TR").includes("cpr")
        );
        const match = metric?.value.match(/-?\d+(?:[.,]\d+)?/);
        if (!match) {
          return null;
        }

        const parsed = Number(match[0].replace(",", "."));
        return Number.isFinite(parsed) ? parsed : null;
      })
      .filter((value): value is number => value !== null);
    if (!valid.length) {
      return "-";
    }

    const total = valid.reduce((sum, value) => sum + value, 0);
    return (total / valid.length).toFixed(2);
  }, [positions]);

  const selectedHeadline =
    parsedReport?.subtitle ||
    selectedSummary?.headline ||
    copy(
      language,
      "Secili earnings raporunun ana tezleri, strateji setleri ve takvim akisi.",
      "Core thesis, strategy sets and calendar flow for the selected earnings report."
    );

  const handleTickerSelect = (ticker: string) => {
    setSelectedTicker(ticker);
    setActiveTab("playbook");
  };

  const handleTabChange = (tab: TabId) => {
    startTabTransition(() => {
      setActiveTab(tab);
    });
  };

  const renderActiveTab = () => {
    if (loadingReports || loadingDetail) {
      return (
        <WorkspaceLoadingState
          label={copy(language, "Earning report workspace yukleniyor.", "Loading earnings workspace.")}
        />
      );
    }

    if (!parsedReport) {
      return (
        <WorkspaceLoadingState
          label={copy(
            language,
            "Henuz goruntulenebilir bir earnings raporu yok. `earningreport/` klasorune yeni rapor yuklendiginde burada otomatik listelenecek.",
            "There is no viewable earnings report yet. When a new report is added under `earningreport/`, it will appear here automatically."
          )}
        />
      );
    }

    switch (activeTab) {
      case "post":
        return (
          <EarningReportPostTab
            report={parsedReport}
            language={language}
            reportDateLabel={selectedSummary?.reportDateLabel}
            updatedAtLabel={selectedUploadLabel}
          />
        );
      case "playbook":
        return (
          <EarningReportPlaybookTab
            key={`${selectedReportId}:${selectedTicker || "none"}`}
            report={parsedReport}
            language={language}
            selectedTicker={selectedTicker}
            onSelectTicker={handleTickerSelect}
          />
        );
      case "calendar":
        return (
          <EarningReportCalendarTab
            report={parsedReport}
            language={language}
            onOpenTicker={handleTickerSelect}
          />
        );
      case "risk":
        return <EarningReportRiskTab report={parsedReport} language={language} />;
      default:
        return (
          <EarningReportPostTab
            report={parsedReport}
            language={language}
            reportDateLabel={selectedSummary?.reportDateLabel}
            updatedAtLabel={selectedUploadLabel}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 md:py-8">
        <WorkspaceHeroPanel
          overlayClassName="bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_28%)]"
          badges={
            <>
              <span className="badge-strong">{bullishCount} {copy(language, "bullish egilim", "bullish bias")}</span>
              <span className="badge-danger">{bearishCount} {copy(language, "bearish egilim", "bearish bias")}</span>
              <span className="badge-warning">
                {balancedCount} {copy(language, "dengeli", "balanced")}
              </span>
            </>
          }
          eyebrow={copy(language, "Earning Strategy Workspace", "Earnings Strategy Workspace")}
          title={copy(language, "Guncel earnings strateji paneli", "Current earnings strategy panel")}
          description={copy(
            language,
            "Tum yuklenen earnings markdown dosyalari arsivde tutulur. Varsayilan gorunum, secili dosyayi eksiksiz bir post gibi acar; playbook, takvim ve risk sekmeleri destek katmani olarak kalir.",
            "Every uploaded earnings markdown file stays in the archive. The default view opens the selected file as a complete post, while playbook, calendar, and risk tabs stay as supporting layers."
          )}
          actions={
            <>
              <Button type="button" variant="outline" onClick={() => void loadReports()}>
                <RefreshCw className="size-4" />
                {copy(language, "Yenile", "Refresh")}
              </Button>
              <Button type="button" variant="outline" onClick={() => setLocation("/momentum")}>
                <Radar className="size-4" />
                {copy(language, "Momentum", "Momentum")}
              </Button>
              <Button type="button" variant="outline" onClick={() => setLocation("/app/admin")}>
                <Shield className="size-4" />
                {copy(language, "Admin", "Admin")}
              </Button>
            </>
          }
          reportStrip={
            <div className="flex items-center gap-2 overflow-x-auto terminal-scrollbar pb-2">
              {visibleReports.map((report, index) => {
                const active = report.id === selectedReportId;

                return (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => setSelectedReportId(report.id)}
                    className={`min-w-[185px] shrink-0 rounded-xl border px-4 py-3 text-left transition-all duration-150 ${
                      active
                        ? "border-sky-400/45 bg-sky-500/14 shadow-[0_0_18px_rgba(14,165,233,0.16)]"
                        : "border-border bg-card/80 hover:border-border hover:bg-[rgba(35,45,66,0.72)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="data-mono text-[11px] text-muted-foreground">
                        {index === 0 ? copy(language, "CANLI", "LIVE") : copy(language, "ARŞIV", "ARCHIVE")}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-300">
                        {report.vixLabel || "VIX -"}
                      </span>
                    </div>
                    <p className="data-mono mt-2 text-sm font-semibold text-foreground">
                      {formatEarningReportDateTime(report.updatedAt)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {report.reportDateLabel || formatEarningReportDate(report.reportDate, locale)}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Clock3 className="size-3.5" />
                      <span className="line-clamp-1">{report.headline || copy(language, "Earning raporu", "Earning report")}</span>
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
                  <BarChart3 className="size-3.5 text-sky-300" />
                  {positions.length} {copy(language, "earnings eventi", "earnings event")}
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="size-3.5 text-emerald-300" />
                  {bullishCount} {copy(language, "bullish", "bullish")}
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="flex items-center gap-1.5">
                  <TrendingDown className="size-3.5 text-red-300" />
                  {bearishCount} {copy(language, "bearish", "bearish")}
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="flex items-center gap-1.5">
                  <Zap className="size-3.5 text-amber-300" />
                  {copy(language, "Ort. IV Rank", "Avg IV Rank")} {avgIvRank}
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="flex items-center gap-1.5">
                  <Target className="size-3.5 text-sky-300" />
                  {copy(language, "Ort. CPR", "Avg CPR")} {avgCpr}
                </span>
              </div>
            ) : (
              <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-xl border border-dashed border-border bg-background/35 px-4 py-3 text-xs text-muted-foreground">
                {loadingReports
                  ? copy(language, "Earnings report listesi yukleniyor.", "Loading earnings report list.")
                  : copy(language, "`earningreport/` kaynagi gelince stat bar otomatik dolacak.", "The stat bar will populate automatically when an `earningreport/` source is available.")}
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
            <section className="workspace-panel p-4 md:p-6">
              {hasReports ? (
                <div className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-end md:justify-between">
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                      {copy(language, "Secili rapor", "Selected report")}
                    </p>
                    <h2 className="heading-condensed text-2xl text-foreground md:text-3xl">
                      {selectedUploadLabel}
                    </h2>
                    <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                      {selectedHeadline}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 md:min-w-[420px]">
                    <WorkspaceSummaryCard
                      label={copy(language, "Rapor tarihi", "Report date")}
                      value={selectedSummary?.reportDateLabel || "-"}
                      hint={copy(language, "Parser ile okunan ana tarih", "Primary date parsed from the report")}
                      icon={CalendarDays}
                      tone="info"
                    />
                    <WorkspaceSummaryCard
                      label="VIX"
                      value={selectedSummary?.vixLabel || "-"}
                      hint={copy(language, "Secili rapor volatilite baglami", "Volatility context for the selected report")}
                      icon={Zap}
                      tone="caution"
                    />
                    <WorkspaceSummaryCard
                      label={copy(language, "Yuklenme", "Loaded")}
                      value={selectedUploadLabel}
                      hint={copy(language, "Liste siralamasi bu zamana gore", "List ordering uses this timestamp")}
                      icon={Clock3}
                      tone="bull"
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-background/35 p-4 text-sm leading-7 text-muted-foreground">
                  {loadingReports
                    ? copy(language, "Secili earnings raporu yukleniyor.", "Loading selected earnings report.")
                    : copy(language, "Henuz secilebilir bir earnings raporu yok. Yeni source geldikten sonra bu alan otomatik dolacak.", "There is no selectable earnings report yet. This area will populate automatically when a new source arrives.")}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2 rounded-xl border border-border bg-background/45 p-1">
                {getTabs(language).map(tab => {
                  const active = activeTab === tab.id;
                  const hasAlert = tab.id === "risk" && balancedCount < positions.length;

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
                        <span className="absolute -right-1 -top-1 size-2 rounded-full bg-red-400" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 space-y-6">
                {isTabPending ? (
                  <div className="rounded-xl border border-sky-500/18 bg-sky-500/10 px-3 py-2 text-xs text-sky-200">
                    {copy(language, "Gorunum degisiyor...", "Switching view...")}
                  </div>
                ) : null}
                {renderActiveTab()}
              </div>
            </section>
          </main>

          {sidebarOpen ? (
            <aside className="hidden min-w-0 space-y-6 xl:block">
              <section className="workspace-panel p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {copy(language, "Guncel snapshot", "Current snapshot")}
                    </p>
                    <h3 className="mt-2 heading-condensed text-xl text-foreground">
                      {selectedSummary?.reportDateLabel || "-"}
                    </h3>
                  </div>
                  <span className="badge-strong">
                    {copy(language, "canli endeks", "live index")}
                  </span>
                </div>

                {hasReports ? (
                  <div className="mt-4 space-y-3">
                    <WorkspaceSummaryCard
                      label={copy(language, "Rapor adedi", "Report count")}
                      value={String(visibleReports.length)}
                      hint={copy(language, "Tum yuklenen raporlar arsivde listelenir", "All uploaded reports stay listed in the archive")}
                      icon={BarChart3}
                      tone="info"
                    />
                    <WorkspaceSummaryCard
                      label={copy(language, "Son yukleme", "Latest load")}
                      value={latestUploadLabel}
                      hint={copy(language, "Varsayilan acilan rapor", "Default report opened on entry")}
                      icon={RefreshCw}
                      tone="bull"
                    />
                    <WorkspaceSummaryCard
                      label={copy(language, "Aktif setup", "Active setups")}
                      value={String(positions.length)}
                      hint={copy(language, "Secili rapordaki ticker", "Tickers in the selected report")}
                      icon={Target}
                      tone="info"
                    />
                    <WorkspaceSummaryCard
                      label={copy(language, "Yakin event", "Nearest event")}
                      value={nextEvent?.ticker || "-"}
                      hint={
                        nextEvent
                          ? `${nextEvent.earningsDate} · ${nextEvent.daysLeft} ${copy(language, "gun", "days")}`
                          : copy(language, "Secili rapordan", "From the selected report")
                      }
                      icon={CalendarDays}
                      tone="caution"
                    />
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-dashed border-border bg-background/35 p-4 text-sm leading-6 text-muted-foreground">
                    {loadingReports
                      ? copy(language, "Sidebar snapshot hazirlaniyor.", "Preparing sidebar snapshot.")
                      : copy(language, "Rapor gelmeden ozet kartlari bos gosterilmeyecek; veri geldiginde burada dolacak.", "Summary cards stay hidden until data is available and will populate automatically.")}
                  </div>
                )}
              </section>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}


