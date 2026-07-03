import { useCallback, useEffect, useMemo, useRef, useState, useTransition, } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle, BarChart3, CalendarDays, ClipboardList, Clock3, FileText, Layers3, Radar, RefreshCw, Target, TrendingDown, TrendingUp, Zap, } from "lucide-react";
import { useLocation } from "wouter";
import type {
  EarningReportSourceRecord, EarningReportSourceSummary, } from "@shared/earningReports";
import { AppLanguage, t } from "@/lib/i18n";

import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
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
    { id: "post" as const, label: "Post", icon: FileText },
    { id: "playbook" as const, label: "Playbook", icon: ClipboardList },
    { id: "calendar" as const, label: t("common:calendar"), icon: CalendarDays },
    { id: "risk" as const, label: "Risk", icon: AlertTriangle },
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

  usePageMeta({
    description: t("common:theGistifyEarningsWorkspaceOpens"),
    noindex: true,
    title: t("common:gistifyEarningsStrategyWorkspace"),
  });

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

  useEffect(() => {
    if (latestReport && selectedReportId !== latestReport.id) {
      setSelectedReportId(latestReport.id);
    }
  }, [latestReport?.id]);

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
    return language === "en" ? `${Math.round(total / valid.length)}%` : `%${Math.round(total / valid.length)}`;
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
    t("common:coreThesisStrategySetsAnd");
  const selectedReportDateLabel = selectedSummary
    ? formatEarningReportDate(selectedSummary.reportDate, locale)
    : "-";
  const selectedVixLabel =
    selectedSummary?.vixLabel ||
    parsedReport?.vixLabel ||
    t("common:pending");

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
          label={t("common:loadingEarningsWorkspace")}
        />
      );
    }

    if (!parsedReport) {
      return (
        <WorkspaceLoadingState
          label={t("common:thereIsNoViewableEarnings")}
        />
      );
    }

    switch (activeTab) {
      case "post":
        return (
          <EarningReportPostTab
            report={parsedReport}
            language={language}
            reportDateLabel={selectedReportDateLabel}
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
            reportDateLabel={selectedReportDateLabel}
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
              <span className="badge-strong">{bullishCount} {t("scanner:30IvSpike")}</span>
              <span className="badge-danger">{bearishCount} {t("common:bearishBias")}</span>
              <span className="badge-warning">
                {balancedCount} {t("common:balanced08d9")}
              </span>
            </>
          }
          eyebrow={t("common:earningsStrategyWorkspace")}
          title={t("common:currentEarningsStrategyPanel")}
          description={t("common:everyUploadedEarningsMarkdownFile")}
          actions={
            <>
              <Button type="button" variant="outline" onClick={() => void loadReports()}>
                <RefreshCw className="size-4" />
                {t("common:refresh")}
              </Button>
              <Button type="button" variant="outline" onClick={() => setLocation("/momentum")}>
                <Radar className="size-4" />
                {"Momentum"}
              </Button>
            </>
          }
          reportStrip={
            <div className="space-y-4">
              {latestReport ? (
                <div className="flex flex-col gap-4 rounded-xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 via-card/90 to-card/90 p-5 shadow-xl lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                        {t("common:live9031")}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-300">
                        {latestReport.vixLabel || t("common:vixPending")}
                      </span>
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                      {formatEarningReportDateTime(latestReport.updatedAt, locale)}
                    </h3>
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {latestReport.headline || t("common:earningsReport")}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" />
                      <span>{formatEarningReportDate(latestReport.reportDate, locale)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button type="button" variant="outline" onClick={() => setLocation("/reports")}>
                      <Layers3 className="size-4" />
                      {t("common:viewFullArchive")}
                    </Button>
                    {reports.length > 1 && (
                      <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        +{reports.length - 1} {t("common:reportsInArchive")}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-background/35 p-4 text-sm text-muted-foreground">
                  {t("common:noReportsYet")}
                </div>
              )}
            </div>
          }
          statusBar={
            hasReports ? (
              <div className="inline-flex max-w-full flex-wrap items-center gap-3 rounded-xl border border-border bg-background/40 px-4 py-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="size-3.5 text-sky-300" />
                  {positions.length} {t("common:earningsEvent")}
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="size-3.5 text-emerald-300" />
                  {bullishCount} {"bullish"}
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="flex items-center gap-1.5">
                  <TrendingDown className="size-3.5 text-red-300" />
                  {bearishCount} {"bearish"}
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="flex items-center gap-1.5">
                  <Zap className="size-3.5 text-amber-300" />
                  {t("common:avgIvRank")} {avgIvRank}
                </span>
                <span className="h-3 w-px bg-border" />
                <span className="flex items-center gap-1.5">
                  <Target className="size-3.5 text-sky-300" />
                  {t("common:avgCpr")} {avgCpr}
                </span>
              </div>
            ) : (
              <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-xl border border-dashed border-border bg-background/35 px-4 py-3 text-xs text-muted-foreground">
                {loadingReports
                  ? t("common:loadingEarningsReportList")
                  : t("common:theStatBarWillPopulate")}
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
            <section className="panel p-4 md:p-6">
              {hasReports ? (
                <div className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-end md:justify-between">
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                      {t("common:selectedReport")}
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
                      label={t("common:reportDateae39")}
                      value={selectedReportDateLabel}
                      hint={t("common:primaryDateParsedFromThe")}
                      icon={CalendarDays}
                      tone="info"
                    />
                    <WorkspaceSummaryCard
                      label="VIX"
                      value={selectedVixLabel}
                      hint={t("common:volatilityContextForTheSelected")}
                      icon={Zap}
                      tone="caution"
                    />
                    <WorkspaceSummaryCard
                      label={t("common:loaded")}
                      value={selectedUploadLabel}
                      hint={t("common:listOrderingUsesThisTimestamp")}
                      icon={Clock3}
                      tone="bull"
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-background/35 p-4 text-sm leading-7 text-muted-foreground">
                  {loadingReports
                    ? t("common:loadingSelectedEarningsReport")
                    : t("common:thereIsNoSelectableEarnings")}
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
                    {t("common:switchingView")}
                  </div>
                ) : null}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${activeTab}:${selectedReportId}:${selectedTicker || "none"}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {renderActiveTab()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>
          </main>

          {sidebarOpen ? (
            <aside className="hidden min-w-0 space-y-6 xl:block">
              <section className="panel p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {t("common:currentSnapshot")}
                    </p>
                    <h3 className="mt-2 heading-condensed text-xl text-foreground">
                      {selectedReportDateLabel}
                    </h3>
                  </div>
                  <span className="badge-strong">
                    {t("common:liveIndex")}
                  </span>
                </div>

                {hasReports ? (
                  <div className="mt-4 space-y-3">
                    <WorkspaceSummaryCard
                      label={t("common:reportCount")}
                      value={String(visibleReports.length)}
                      hint={t("common:allUploadedReportsStayListed")}
                      icon={BarChart3}
                      tone="info"
                    />
                    <WorkspaceSummaryCard
                      label={t("common:latestLoad")}
                      value={latestUploadLabel}
                      hint={t("common:defaultReportOpenedOnEntry")}
                      icon={RefreshCw}
                      tone="bull"
                    />
                    <WorkspaceSummaryCard
                      label={t("common:activeSetups")}
                      value={String(positions.length)}
                      hint={t("common:tickersInTheSelectedReport")}
                      icon={Target}
                      tone="info"
                    />
                    <WorkspaceSummaryCard
                      label={t("common:nearestEventc30d")}
                      value={nextEvent?.ticker || "-"}
                      hint={
                        nextEvent
                          ? `${nextEvent.earningsDate} · ${nextEvent.daysLeft} ${t("common:days")}`
                          : t("common:fromTheSelectedReport")
                      }
                      icon={CalendarDays}
                      tone="caution"
                    />
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-dashed border-border bg-background/35 p-4 text-sm leading-6 text-muted-foreground">
                    {loadingReports
                      ? t("common:preparingSidebarSnapshot")
                      : t("common:summaryCardsStayHiddenUntil")}
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



