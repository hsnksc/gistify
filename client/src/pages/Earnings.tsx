import { useEffect, useState } from "react";
import EarningsCalendar from "@/components/earnings/EarningsCalendar";
import EarningsHero from "@/components/earnings/EarningsHero";
import CPRTable from "@/components/earnings/CPRTable";
import FOMCWarningBanner from "@/components/earnings/FOMCWarningBanner";
import MacroDashboard from "@/components/earnings/MacroDashboard";
import BudgetMatrix from "@/components/earnings/BudgetMatrix";
import PortfolioBuilder from "@/components/earnings/PortfolioBuilder";
import GreeksDashboard from "@/components/earnings/GreeksDashboard";
import ActionPlan from "@/components/earnings/ActionPlan";
import ReportDownload from "@/components/earnings/ReportDownload";
import { usePageMeta } from "@/hooks/usePageMeta";
import type { AppLanguage } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Target,
  BarChart3,
  Wallet,
} from "lucide-react";
import {
  CalendarStatsPanel,
  EarningsLoadingState,
  EarningsPipelinePanel,
  EarningsUnavailableState,
  EarningsWorkspaceToolbar,
  EarningsWorkspaceFrame,
  ExecutiveSummaryPanel,
  PortfolioPanel,
  StrategyCollectionPanel,
} from "./earnings/EarningsSurface";
import { useEarningsStrategy } from "./earnings/useEarningsStrategy";
import { toast } from "sonner";

type TabKey = "overview" | "calendar" | "strategies" | "cpr" | "portfolio";
const ACTIVE_TAB_STORAGE_KEY = "gistify:earnings:active-tab";

function isTabKey(value: string | null): value is TabKey {
  return (
    value === "overview" ||
    value === "calendar" ||
    value === "strategies" ||
    value === "cpr" ||
    value === "portfolio"
  );
}

function replaceEarningsQueryParam(key: string, value: string) {
  if (typeof window === "undefined") {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  params.set(key, value);
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState({}, "", nextUrl);
}

function readStoredTab(): TabKey {
  if (typeof window === "undefined") {
    return "overview";
  }

  const queryTab = new URLSearchParams(window.location.search).get("tab");
  if (isTabKey(queryTab)) {
    return queryTab;
  }

  const value = window.localStorage.getItem(ACTIVE_TAB_STORAGE_KEY);
  return isTabKey(value) ? value : "overview";
}

const TABS: { key: TabKey; labelTr: string; labelEn: string; icon: React.ReactNode }[] = [
  { key: "overview", labelTr: "Genel Bakış", labelEn: "Overview", icon: <LayoutDashboard className="size-4" /> },
  { key: "calendar", labelTr: "Takvim", labelEn: "Calendar", icon: <CalendarDays className="size-4" /> },
  { key: "strategies", labelTr: "Stratejiler", labelEn: "Strategies", icon: <Target className="size-4" /> },
  { key: "cpr", labelTr: "CPR & Greeks", labelEn: "CPR & Greeks", icon: <BarChart3 className="size-4" /> },
  { key: "portfolio", labelTr: "Portföy", labelEn: "Portfolio", icon: <Wallet className="size-4" /> },
];

export default function EarningsPage({
  language,
}: {
  language: AppLanguage;
}) {
  const { data, error, isLoading, isRefreshing, pipeline, refresh } =
    useEarningsStrategy();
  const [activeTab, setActiveTab] = useState<TabKey>(() => readStoredTab());

  usePageMeta({
    description: copy(
      language,
      "Gistify earnings workspace takvim, strateji, CPR, Greeks ve portfoy katmanini tek karar yuzeyinde birlestirir.",
      "The Gistify earnings workspace combines calendar, strategy, CPR, Greeks and portfolio layers on one decision surface."
    ),
    title: copy(
      language,
      "Gistify | Earnings Workspace",
      "Gistify | Earnings Workspace"
    ),
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, activeTab);
    replaceEarningsQueryParam("tab", activeTab);
  }, [activeTab]);

  if (isLoading) {
    return <EarningsLoadingState language={language} />;
  }

  if (!data) {
    return (
      <EarningsUnavailableState
        error={error}
        language={language}
        onRetry={async () => {
          const result = await refresh();
          if (result.ok) {
            toast.success(
              copy(language, "Earnings workspace yenilendi.", "The earnings workspace refreshed.")
            );
            return;
          }
          toast.error(
            copy(language, "Yenileme basarisiz.", "Refresh failed."),
            {
              description:
                result.error ||
                copy(
                  language,
                  "Pipeline verisi alinamadi.",
                  "The pipeline data could not be loaded."
                ),
            }
          );
        }}
      />
    );
  }

  const handleRefresh = async () => {
    const result = await refresh();
    if (result.ok) {
      toast.success(
        copy(language, "Earnings workspace yenilendi.", "The earnings workspace refreshed."),
        {
          description: copy(
            language,
            "Takvim, strateji ve portfoy snapshot'i guncellendi.",
            "The calendar, strategy, and portfolio snapshot were refreshed."
          ),
        }
      );
      return;
    }

    toast.error(copy(language, "Yenileme basarisiz.", "Refresh failed."), {
      description:
        result.error ||
        copy(
          language,
          "Pipeline verisi alinamadi.",
          "The pipeline data could not be loaded."
        ),
    });
  };

  const bmoCount = data.calendar.filter(e => e.time === "BMO").length;
  const amcCount = data.calendar.filter(e => e.time === "AMC").length;
  const highImportanceCount = data.calendar.filter(e => e.importance >= 3).length;

  return (
    <EarningsWorkspaceFrame>
      <EarningsHero
        data={data}
        isRefreshing={isRefreshing}
        language={language}
        onRefresh={() => {
          void handleRefresh();
        }}
      />

      {/* Tabs */}
      <div className="sticky top-0 z-30 -mx-2 px-2 py-2 backdrop-blur-md">
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-slate-800/60 bg-slate-900/80 p-1">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all whitespace-nowrap",
                activeTab === tab.key
                  ? "bg-sky-500/15 text-sky-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              {tab.icon}
              {copy(language, tab.labelTr, tab.labelEn)}
            </button>
          ))}
        </div>
      </div>

      <EarningsWorkspaceToolbar
        language={language}
        pipeline={pipeline}
        sectionLabel={copy(
          language,
          TABS.find(tab => tab.key === activeTab)?.labelTr || "Genel Bakış",
          TABS.find(tab => tab.key === activeTab)?.labelEn || "Overview"
        )}
      />

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <EarningsPipelinePanel language={language} pipeline={pipeline} />
          {data.fomc ? (
            <FOMCWarningBanner fomc={data.fomc} language={language} />
          ) : null}
          <MacroDashboard language={language} macro={data.macro} />
          <CalendarStatsPanel
            amcCount={amcCount}
            bmoCount={bmoCount}
            highImportanceCount={highImportanceCount}
            language={language}
            totalCount={data.calendar.length}
          />
          <ExecutiveSummaryPanel
            items={data.executiveSummary}
            language={language}
          />
          <ActionPlan items={data.actionPlan} language={language} />
          <ReportDownload
            fileName={
              pipeline.resolvedSourceFile
                ? pipeline.resolvedSourceFile.split(/[/\\]/).pop()
                : undefined
            }
            language={language}
            reportDate={data.reportDate}
          />
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === "calendar" && (
        <div className="space-y-6">
          <EarningsCalendar
            events={data.calendar}
            language={language}
          />
        </div>
      )}

      {/* Strategies Tab */}
      {activeTab === "strategies" && (
        <div className="space-y-6">
          <StrategyCollectionPanel
            description={data.summary}
            language={language}
            strategies={data.strategies}
            title={copy(language, "Tüm Stratejiler", "All Strategies")}
          />
          <BudgetMatrix
            language={language}
            strategies={data.budgetStrategies.length > 0 ? data.budgetStrategies : data.strategies}
          />
        </div>
      )}

      {/* CPR & Greeks Tab */}
      {activeTab === "cpr" && (
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <CPRTable language={language} stocks={data.cprStocks} />
            <GreeksDashboard
              language={language}
              strategies={data.strategies}
            />
          </div>
        </div>
      )}

      {/* Portfolio Tab */}
      {activeTab === "portfolio" && (
        <div className="space-y-6">
          <PortfolioBuilder
            language={language}
            portfolio={data.portfolio}
          />
          <PortfolioPanel language={language} levels={data.portfolio} />
        </div>
      )}
    </EarningsWorkspaceFrame>
  );
}
