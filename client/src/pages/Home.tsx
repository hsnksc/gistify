import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  PanelLeftClose,
  PanelLeftOpen,
  Radar,
  Shield,
} from "lucide-react";
import { useLocation } from "wouter";
import type { WeeklyReportRecord } from "@shared/weeklyReports";
import { Button } from "@/components/ui/button";
import { signalConfig } from "@/lib/stockData";
import {
  buildEarningStrategyUniverse,
} from "@/lib/earningStrategyData";
import { formatAnalysisDate } from "@/lib/weeklyReports";
import CalendarTab from "@/components/tabs/CalendarTab";
import IVCrushTab from "@/components/tabs/IVCrushTab";
import MomentumTab from "@/components/tabs/MomentumTab";
import StrategyPlaybookTab from "@/components/tabs/StrategyPlaybookTab";

type TabId = "playbook" | "momentum" | "calendar" | "ivcrush";

const tabs: Array<{ id: TabId; label: string; icon: string }> = [
  { id: "playbook", label: "Playbook", icon: "◈" },
  { id: "momentum", label: "Momentum", icon: "⚡" },
  { id: "calendar", label: "Takvim", icon: "◷" },
  { id: "ivcrush", label: "Opsiyon", icon: "💰" },
];

interface WeeklyReportsResponse {
  reports?: WeeklyReportRecord[];
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

export default function Home() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabId>("playbook");
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [publishedReports, setPublishedReports] = useState<WeeklyReportRecord[]>([]);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [activeTab]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch("/api/reports/weekly", {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as WeeklyReportsResponse;
        if (cancelled) {
          return;
        }

        setPublishedReports(payload.reports || []);
      } catch {
        // Static fallback keeps the workspace usable without published reports.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const strategyData = useMemo(
    () => buildEarningStrategyUniverse(publishedReports),
    [publishedReports]
  );
  const activeStocks = strategyData.stocks;
  const activeOptions = strategyData.options;
  const activeCalendar = strategyData.calendar;

  useEffect(() => {
    if (!activeStocks.length) {
      setSelectedTicker(null);
      return;
    }

    setSelectedTicker(current =>
      current && activeStocks.some(stock => stock.ticker === current)
        ? current
        : activeStocks[0].ticker
    );
  }, [activeStocks]);

  const sortedByMomentum = useMemo(
    () => [...activeStocks].sort((a, b) => b.momentumScore - a.momentumScore),
    [activeStocks]
  );
  const topPicks = useMemo(
    () =>
      sortedByMomentum
        .filter(stock => stock.signal === "STRONG_BUY" || stock.signal === "BUY")
        .slice(0, 4),
    [sortedByMomentum]
  );

  const latestPublishedReport = useMemo(() => {
    if (!publishedReports.length) {
      return null;
    }

    return [...publishedReports].sort((left, right) =>
      right.analysisDate.localeCompare(left.analysisDate)
    )[0];
  }, [publishedReports]);

  const reportWindow =
    activeCalendar.length > 0
      ? `${activeCalendar[0].label} -> ${
          activeCalendar[activeCalendar.length - 1].label
        }`
      : "Canli coverage";
  const analysisDate = latestPublishedReport
    ? formatAnalysisDate(latestPublishedReport.analysisDate)
    : "Canli";

  const strongBuyCount = activeStocks.filter(
    stock => stock.signal === "STRONG_BUY"
  ).length;
  const buyCount = activeStocks.filter(stock => stock.signal === "BUY").length;
  const neutralCount = activeStocks.filter(
    stock => stock.signal === "NEUTRAL"
  ).length;
  const sellCount = activeStocks.filter(
    stock => stock.signal === "SELL" || stock.signal === "STRONG_SELL"
  ).length;
  const avgBeatProbability = Math.round(
    activeStocks.reduce((sum, stock) => sum + stock.earningsBeatProbability, 0) /
      Math.max(activeStocks.length, 1)
  );
  const avgMomentumScore = Math.round(
    activeStocks.reduce((sum, stock) => sum + stock.momentumScore, 0) /
      Math.max(activeStocks.length, 1)
  );
  const topTicker = topPicks[0]?.ticker || activeStocks[0]?.ticker || "-";
  const coverageHint = publishedReports.length
    ? `${publishedReports.length} published week + live setup coverage`
    : "Static benchmark + live setup coverage";

  const handleStockClick = (ticker: string) => {
    setSelectedTicker(ticker);
    setActiveTab("playbook");
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "playbook":
        return (
          <StrategyPlaybookTab
            stocks={activeStocks}
            strategies={activeOptions}
            calendar={activeCalendar}
            selectedTicker={selectedTicker}
            onSelectTicker={setSelectedTicker}
            reportWindow={reportWindow}
            analysisDateLabel={analysisDate}
          />
        );
      case "momentum":
        return <MomentumTab onStockClick={handleStockClick} stocks={activeStocks} />;
      case "calendar":
        return (
          <CalendarTab
            onStockClick={handleStockClick}
            stocks={activeStocks}
            calendar={activeCalendar}
            reportWindow={reportWindow}
          />
        );
      case "ivcrush":
        return <IVCrushTab onStockClick={handleStockClick} strategies={activeOptions} />;
      default:
        return (
          <StrategyPlaybookTab
            stocks={activeStocks}
            strategies={activeOptions}
            calendar={activeCalendar}
            selectedTicker={selectedTicker}
            onSelectTicker={setSelectedTicker}
            reportWindow={reportWindow}
            analysisDateLabel={analysisDate}
          />
        );
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
                  Earning Strategy Workspace
                </p>
                <p className="text-xs text-muted-foreground">
                  Tarih sirali benchmark playbook
                </p>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-5 md:flex">
            <div className="text-right">
              <p className="data-mono text-[11px] text-muted-foreground">
                DONEM
              </p>
              <p className="data-mono text-xs font-semibold text-emerald-300">
                {reportWindow}
              </p>
            </div>
            <div className="text-right">
              <p className="data-mono text-[11px] text-muted-foreground">
                ANALIZ
              </p>
              <p className="data-mono text-xs font-semibold text-foreground">
                {analysisDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-none"
              onClick={() => setLocation("/momentum")}
            >
              <Radar className="h-4 w-4" />
              Momentum Scanner
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="hidden rounded-none md:inline-flex"
              onClick={() => setLocation("/app/admin")}
            >
              <Shield className="h-4 w-4" />
              Admin
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
              <span className="badge-strong">{strongBuyCount} guclu al</span>
              <span className="badge-warning">{neutralCount} notr</span>
              <span className="badge-danger">{sellCount} sat</span>
            </div>

            <div className="space-y-2">
              <h1
                className="heading-condensed text-3xl leading-none md:text-5xl"
                style={{ color: "oklch(0.95 0.01 220)" }}
              >
                Earnings benchmark,
                <br />
                <span style={{ color: "oklch(0.78 0.18 160)" }}>
                  hisse hisse playbook
                </span>
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Ayrik haftalar ve setup bloklari yerine, tum coverage tek timeline
                icinde birlestirildi. Artik her hisse earning tarihine gore
                siralanir ve ayni kartta momentum, tez, risk ve opsiyon plani
                okunur.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="rounded-none border border-border bg-card/60 px-3 py-1.5">
                {activeStocks.length} analiz edilen hisse
              </span>
              <span className="rounded-none border border-border bg-card/60 px-3 py-1.5">
                {coverageHint}
              </span>
              <span className="rounded-none border border-border bg-card/60 px-3 py-1.5">
                Sources: Yahoo, Gartner, Deloitte
              </span>
            </div>

            <div className="rounded-none border border-emerald-400/25 bg-emerald-500/5 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Yeni Okuma Mantigi
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ana akıs simdi dogrudan `Playbook` sekmesinden baslar. Oradan
                hisse sec, sonra gerekirse ayni evreni momentum, takvim ve opsiyon
                kesitlerinde yan gorunum olarak ac.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <SummaryCard
              label="Top ticker"
              value={topTicker}
              hint={topPicks[0]?.name || "En guclu ilk kurulum"}
            />
            <SummaryCard
              label="Ort. beat"
              value={`%${avgBeatProbability}`}
              hint="Toplu benchmark evreni ortalamasi"
            />
            <SummaryCard
              label="Ort. momentum"
              value={String(avgMomentumScore)}
              hint="Tek timeline icindeki ortalama skor"
            />
          </div>
        </div>
      </section>

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen ? (
          <aside
            className="hidden border-r lg:flex lg:w-[250px] lg:min-w-[250px] lg:flex-col"
            style={{
              background: "oklch(0.09 0.025 230)",
              borderColor: "oklch(0.22 0.03 225)",
            }}
          >
            <nav className="flex-1 p-3">
              <div className="mb-3 px-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Earning Strategy Sekmeleri
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
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>

            <div className="border-t p-3" style={{ borderColor: "oklch(0.22 0.03 225)" }}>
              <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Ozet
              </div>
              <div className="space-y-2">
                {[
                  {
                    label: "Guclu Al",
                    value: strongBuyCount,
                    color: "text-emerald-400",
                  },
                  {
                    label: "Al",
                    value: buyCount,
                    color: "text-green-400",
                  },
                  {
                    label: "Notr",
                    value: neutralCount,
                    color: "text-amber-400",
                  },
                  {
                    label: "Sat",
                    value: sellCount,
                    color: "text-red-400",
                  },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-2"
                  >
                    <span className="text-xs text-muted-foreground">
                      {item.label}
                    </span>
                    <span className={`data-mono text-sm font-bold ${item.color}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t p-3" style={{ borderColor: "oklch(0.22 0.03 225)" }}>
              <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Top Secimler
              </div>
              <div className="space-y-1">
                {topPicks.map((stock, index) => {
                  const signal = signalConfig[stock.signal];

                  return (
                    <button
                      key={stock.ticker}
                      type="button"
                      onClick={() => handleStockClick(stock.ticker)}
                      className="flex w-full items-center justify-between px-2 py-2 text-left transition-opacity hover:opacity-80"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="data-mono text-xs font-bold text-muted-foreground">
                            #{index + 1}
                          </span>
                          <span
                            className="data-mono text-xs font-bold"
                            style={{ color: signal.color }}
                          >
                            {stock.ticker}
                          </span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {stock.name}
                        </p>
                      </div>
                      <span className="data-mono text-xs font-bold text-emerald-300">
                        {stock.momentumScore}
                      </span>
                    </button>
                  );
                })}
              </div>
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
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {renderActiveTab()}

          <div className="border-t px-6 py-5" style={{ borderColor: "oklch(0.22 0.03 225)" }}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="heading-condensed text-sm text-foreground">
                  Sonraki adim: momentum scanner
                </p>
                <p className="text-xs text-muted-foreground">
                  Playbook icindeki kurulumlari okuduktan sonra ayni evrende
                  anlik tarama yapmak icin scanner alanina gecebilirsin.
                </p>
              </div>
              <Button
                type="button"
                className="rounded-none"
                onClick={() => setLocation("/momentum")}
              >
                Momentum Scanner'a git
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
