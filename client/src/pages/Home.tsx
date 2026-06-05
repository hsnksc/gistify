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
import { earningsCalendar, signalConfig, stocksData } from "@/lib/stockData";
import { buildEarningStrategyDataset } from "@/lib/earningStrategyData";
import {
  formatAnalysisDate,
  formatWeekRange,
  getReportSummary,
} from "@/lib/weeklyReports";
import CalendarTab from "@/components/tabs/CalendarTab";
import IVCrushTab from "@/components/tabs/IVCrushTab";
import JuneEarningsTab from "@/components/tabs/JuneEarningsTab";
import JuneOptionDetailTab from "@/components/tabs/JuneOptionDetailTab";
import MomentumTab from "@/components/tabs/MomentumTab";
import OptionDetailTab from "@/components/tabs/OptionDetailTab";
import OverviewTab from "@/components/tabs/OverviewTab";
import RiskTab from "@/components/tabs/RiskTab";
import SectorTab from "@/components/tabs/SectorTab";
import StockDetailTab from "@/components/tabs/StockDetailTab";
import { juneEarningsData } from "@/lib/juneEarningsData";

type TabId =
  | "overview"
  | "momentum"
  | "stocks"
  | "calendar"
  | "sector"
  | "risk"
  | "ivcrush"
  | "optiondetail"
  | "juneearnings"
  | "juneoptiondetail";

const tabs: Array<{ id: TabId; label: string; icon: string }> = [
  { id: "overview", label: "Genel Bakis", icon: "◈" },
  { id: "momentum", label: "Momentum", icon: "⚡" },
  { id: "stocks", label: "Hisse Analizi", icon: "◎" },
  { id: "calendar", label: "Takvim", icon: "◷" },
  { id: "sector", label: "Sektorel", icon: "⬡" },
  { id: "risk", label: "Risk Matrisi", icon: "◉" },
  { id: "ivcrush", label: "IV Crush", icon: "💰" },
  { id: "optiondetail", label: "Opsiyon Detay", icon: "📊" },
  { id: "juneearnings", label: "8-19 Haziran Setuplari", icon: "▣" },
  { id: "juneoptiondetail", label: "8-19 Haziran Detay", icon: "⌁" },
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
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [selectedTicker, setSelectedTicker] = useState<string | null>(
    stocksData[0]?.ticker ?? null
  );
  const [selectedJuneTicker, setSelectedJuneTicker] = useState<string | null>(
    juneEarningsData[0]?.ticker ?? null
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [publishedReports, setPublishedReports] = useState<WeeklyReportRecord[]>([]);
  const [selectedPublishedReportId, setSelectedPublishedReportId] = useState("");
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

        const nextReports = payload.reports || [];
        setPublishedReports(nextReports);
        setSelectedPublishedReportId(current =>
          current && nextReports.some(report => report.id === current)
            ? current
            : nextReports[0]?.id || ""
        );
      } catch {
        // Leave the earning strategy page usable with static fallback data.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedPublishedReport = useMemo(
    () =>
      publishedReports.find(report => report.id === selectedPublishedReportId) ||
      publishedReports[0] ||
      null,
    [publishedReports, selectedPublishedReportId]
  );
  const publishedReportSummary = useMemo(
    () => (selectedPublishedReport ? getReportSummary(selectedPublishedReport) : null),
    [selectedPublishedReport]
  );
  const strategyData = useMemo(
    () => buildEarningStrategyDataset(selectedPublishedReport),
    [selectedPublishedReport]
  );
  const activeStocks = strategyData.stocks;
  const activeOptions = strategyData.options;
  const activeCalendar = strategyData.calendar;
  const sortedByMomentum = useMemo(
    () => [...activeStocks].sort((a, b) => b.momentumScore - a.momentumScore),
    [activeStocks]
  );
  const publishedTopEntries = useMemo(
    () => selectedPublishedReport?.content.entries.slice(0, 4) || [],
    [selectedPublishedReport]
  );
  const publishedAvgBeat = useMemo(() => {
    if (!activeStocks.length) {
      return 0;
    }

    return Math.round(
      activeStocks.reduce((sum, entry) => sum + entry.earningsBeatProbability, 0) /
        activeStocks.length
    );
  }, [activeStocks]);
  const topPicks = useMemo(
    () =>
      sortedByMomentum
        .filter(stock => stock.signal === "STRONG_BUY" || stock.signal === "BUY")
        .slice(0, 3),
    [sortedByMomentum]
  );

  const strongBuyCount = activeStocks.filter(
    stock => stock.signal === "STRONG_BUY"
  ).length;
  const buyCount = activeStocks.filter(stock => stock.signal === "BUY").length;
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
  const reportWindow = selectedPublishedReport
    ? formatWeekRange(selectedPublishedReport)
    : `${earningsCalendar[0]?.date || "-"} - ${
        earningsCalendar[earningsCalendar.length - 1]?.date || "-"
      }`;
  const analysisDate = selectedPublishedReport
    ? formatAnalysisDate(selectedPublishedReport.analysisDate)
    : "21.05.2026";

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

  const handleStockClick = (ticker: string) => {
    setSelectedTicker(ticker);
    setActiveTab("stocks");
  };

  const handleJuneStockClick = (ticker: string) => {
    setSelectedJuneTicker(ticker);
    setActiveTab("juneoptiondetail");
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            onStockClick={handleStockClick}
            stocks={activeStocks}
            reportWindow={reportWindow}
            analysisDateLabel={analysisDate}
            headline={selectedPublishedReport?.content.headline}
            summary={selectedPublishedReport?.content.summary}
          />
        );
      case "momentum":
        return <MomentumTab onStockClick={handleStockClick} stocks={activeStocks} />;
      case "stocks":
        return (
          <StockDetailTab
            selectedTicker={selectedTicker}
            onSelectTicker={setSelectedTicker}
            stocks={activeStocks}
          />
        );
      case "calendar":
        return (
          <CalendarTab
            onStockClick={handleStockClick}
            stocks={activeStocks}
            calendar={activeCalendar}
            reportWindow={reportWindow}
          />
        );
      case "sector":
        return <SectorTab stocks={activeStocks} />;
      case "risk":
        return <RiskTab onStockClick={handleStockClick} stocks={activeStocks} />;
      case "ivcrush":
        return <IVCrushTab onStockClick={handleStockClick} strategies={activeOptions} />;
      case "optiondetail":
        return (
          <OptionDetailTab
            selectedTicker={selectedTicker}
            onSelectTicker={setSelectedTicker}
            strategies={activeOptions}
          />
        );
      case "juneearnings":
        return <JuneEarningsTab onStockClick={handleJuneStockClick} />;
      case "juneoptiondetail":
        return (
          <JuneOptionDetailTab
            selectedTicker={selectedJuneTicker}
            onSelectTicker={setSelectedJuneTicker}
          />
        );
      default:
        return (
          <OverviewTab
            onStockClick={handleStockClick}
            stocks={activeStocks}
            reportWindow={reportWindow}
            analysisDateLabel={analysisDate}
            headline={selectedPublishedReport?.content.headline}
            summary={selectedPublishedReport?.content.summary}
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
                  Precision Finance strateji akisi
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
              <span className="badge-warning">
                {activeStocks.filter(stock => stock.signal === "NEUTRAL").length} notr
              </span>
              <span className="badge-danger">{sellCount} sat</span>
            </div>

            <div className="space-y-2">
              <h1
                className="heading-condensed text-3xl leading-none md:text-5xl"
                style={{ color: "oklch(0.95 0.01 220)" }}
              >
                Earnings oncesi
                <br />
                <span style={{ color: "oklch(0.78 0.18 160)" }}>
                  earning strategy
                </span>
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Secilen hafta artik sadece ust kartlarda degil, tum sekmelerde
                ayni veriyle akar. Momentum, takvim, risk matrisi, hisse
                detaylari ve IV crush analizleri ayni earning strategy
                datasetini paylasir.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="rounded-none border border-border bg-card/60 px-3 py-1.5">
                {activeStocks.length} analiz edilen hisse
              </span>
              <span className="rounded-none border border-border bg-card/60 px-3 py-1.5">
                AI chips + cybersecurity + software
              </span>
              <span className="rounded-none border border-border bg-card/60 px-3 py-1.5">
                Sources: Yahoo, Gartner, Deloitte
              </span>
            </div>

            <div className="grid gap-3 pt-1 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
              <div className="rounded-none border border-emerald-400/25 bg-emerald-500/5 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  June Setup Pack
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  8-19 Haziran setup akisi artik bu workspace icinde. ORCL,
                  LEN, ADBE ve FOMC odakli pencereyi canli sekmelerden ac.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-none"
                onClick={() => setActiveTab("juneearnings")}
              >
                8-19 Haziran Setuplari
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="rounded-none"
                onClick={() => setActiveTab("juneoptiondetail")}
              >
                Opsiyon Detay
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <SummaryCard
              label="Top pick"
              value={
                publishedReportSummary?.topPick?.ticker || topPicks[0]?.ticker || "-"
              }
              hint={
                publishedReportSummary?.topPick?.name ||
                topPicks[0]?.name ||
                "En yuksek momentum ve beat setup"
              }
            />
            <SummaryCard
              label="Ort. beat"
              value={`%${publishedAvgBeat || avgBeatProbability}`}
              hint={
                selectedPublishedReport
                  ? "Published rapordaki ortalama beat ihtimali"
                  : "Workspace evrenindeki ortalama beat ihtimali"
              }
            />
            <SummaryCard
              label="Ort. momentum"
              value={String(publishedReportSummary?.avgMomentum || avgMomentumScore)}
              hint={
                selectedPublishedReport
                  ? "Published rapordaki ortalama momentum skoru"
                  : "Tum earning strategy hisseleri icin ortalama skor"
              }
            />
          </div>
        </div>
      </section>

      {publishedReports.length ? (
        <section
          className="border-b px-4 py-5 lg:px-6"
          style={{
            borderColor: "oklch(0.22 0.03 225)",
            background: "oklch(0.105 0.025 230)",
          }}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Published Earnings Weeks
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Buradan haftayi degistirdiginde alt sekmelerin tamami ayni dataset ile yenilenir.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-none"
                onClick={() => setLocation("/app/admin")}
              >
                <Shield className="h-4 w-4" />
                Admin Workspace
              </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {publishedReports.map(report => (
                <button
                  key={report.id}
                  type="button"
                  onClick={() => setSelectedPublishedReportId(report.id)}
                  className={`shrink-0 rounded-none border px-3 py-2 text-left ${
                    selectedPublishedReport?.id === report.id
                      ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-300"
                      : "border-border bg-card/70 text-muted-foreground"
                  }`}
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                    {formatWeekRange(report)}
                  </div>
                  <div className="mt-1 text-xs">{report.content.entries.length} hisse</div>
                </button>
              ))}
            </div>

            {selectedPublishedReport ? (
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div className="rounded-none border border-border bg-card/80 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Hafta Ozeti
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">
                    {selectedPublishedReport.content.headline}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {selectedPublishedReport.content.summary}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {selectedPublishedReport.content.marketContext}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {publishedTopEntries.map(entry => (
                    <article
                      key={entry.id}
                      className="rounded-none border border-border bg-card/80 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {entry.ticker}
                          </p>
                          <p className="text-xs text-muted-foreground">{entry.name}</p>
                        </div>
                        <span className="data-mono text-lg font-bold text-emerald-300">
                          {entry.ivCrushScore}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Momentum</p>
                          <p className="font-semibold text-foreground">
                            {entry.momentumScore}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">IV Crush</p>
                          <p className="font-semibold text-foreground">
                            %{entry.expectedIVCrush}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Beat</p>
                          <p className="font-semibold text-foreground">
                            %{entry.beatRate}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

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
                    value: activeStocks.filter(stock => stock.signal === "NEUTRAL").length,
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
                  Earning strategy akisini okuduktan sonra acilis momentumu scanner alanina
                  gecebilirsin.
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
