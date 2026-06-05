import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  ClipboardList,
  PanelLeftClose,
  PanelLeftOpen,
  Radar,
  Shield,
} from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import EarningReportCalendarTab from "@/components/tabs/EarningReportCalendarTab";
import EarningReportPlaybookTab from "@/components/tabs/EarningReportPlaybookTab";
import EarningReportRiskTab from "@/components/tabs/EarningReportRiskTab";
import { juneEarningReport } from "@/lib/earningReportSource";

type TabId = "playbook" | "calendar" | "risk";

const tabs: Array<{
  id: TabId;
  label: string;
  icon: typeof ClipboardList;
}> = [
  { id: "playbook", label: "Playbook", icon: ClipboardList },
  { id: "calendar", label: "Takvim", icon: CalendarDays },
  { id: "risk", label: "Risk", icon: AlertTriangle },
];

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
  const contentRef = useRef<HTMLDivElement | null>(null);
  const report = juneEarningReport;

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [activeTab]);

  const positions = useMemo(
    () =>
      [...report.positions].sort((left, right) => {
        if (left.daysLeft !== right.daysLeft) {
          return left.daysLeft - right.daysLeft;
        }

        return left.order - right.order;
      }),
    [report.positions]
  );

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

  const avgIvRank = useMemo(() => {
    const valid = positions.filter(position => position.ivRank !== null);
    if (!valid.length) {
      return "-";
    }

    const total = valid.reduce((sum, position) => sum + (position.ivRank || 0), 0);
    return `%${Math.round(total / valid.length)}`;
  }, [positions]);

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
  const activeMeta = report.meta.filter(
    item => item.label !== "Rapor Tarihi" && item.label !== "VIX"
  );

  const handleTickerSelect = (ticker: string) => {
    setSelectedTicker(ticker);
    setActiveTab("playbook");
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "playbook":
        return (
          <EarningReportPlaybookTab
            report={report}
            selectedTicker={selectedTicker}
            onSelectTicker={setSelectedTicker}
          />
        );
      case "calendar":
        return (
          <EarningReportCalendarTab
            report={report}
            onOpenTicker={handleTickerSelect}
          />
        );
      case "risk":
        return <EarningReportRiskTab report={report} />;
      default:
        return (
          <EarningReportPlaybookTab
            report={report}
            selectedTicker={selectedTicker}
            onSelectTicker={setSelectedTicker}
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
                  Haziran 2026 IV expansion playbook
                </p>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-5 md:flex">
            <div className="text-right">
              <p className="data-mono text-[11px] text-muted-foreground">
                RAPOR
              </p>
              <p className="data-mono text-xs font-semibold text-emerald-300">
                {report.reportDate}
              </p>
            </div>
            <div className="text-right">
              <p className="data-mono text-[11px] text-muted-foreground">
                VIX
              </p>
              <p className="data-mono text-xs font-semibold text-foreground">
                {report.vixLabel}
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
              <span className="badge-strong">{bullishCount} bullish bias</span>
              <span className="badge-danger">{bearishCount} bearish bias</span>
              <span className="badge-warning">{balancedCount} dengeli</span>
            </div>

            <div className="space-y-2">
              <h1
                className="heading-condensed text-3xl leading-none md:text-5xl"
                style={{ color: "oklch(0.95 0.01 220)" }}
              >
                Pre-earnings IV expansion,
                <br />
                <span style={{ color: "oklch(0.78 0.18 160)" }}>
                  hisse hisse playbook
                </span>
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Bu sayfa tek kaynak olarak{" "}
                <span className="data-mono text-foreground">{report.sourceFile}</span>{" "}
                dosyasini kullanir. Setup, takvim, risk ve opsiyon plani
                bolumleri dosyadaki gercek basliklardan uretilir; mock benchmark
                metrikleri kullanilmaz.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {activeMeta.map(item => (
                <div
                  key={item.label}
                  className="rounded-none border border-border bg-card/60 px-4 py-3"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-none border border-emerald-400/25 bg-emerald-500/5 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Ana pencere
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {report.coreWindow}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <SummaryCard
              label="Setup sayisi"
              value={String(positions.length)}
              hint="Dosyadan parse edilen toplam hisse"
            />
            <SummaryCard
              label="Ort. IV Rank"
              value={avgIvRank}
              hint="Yalnizca dosyadaki IV Rank alanlari"
            />
            <SummaryCard
              label="Yakin event"
              value={nextEvent?.ticker || "-"}
              hint={
                nextEvent
                  ? `${nextEvent.earningsDate} · ${nextEvent.daysLeft} gun`
                  : "En yakin earnings setup"
              }
            />
            <SummaryCard
              label="Rejim"
              value={report.vixLabel}
              hint="Makro giris filtresi"
            />
          </div>
        </div>
      </section>

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen ? (
          <aside
            className="hidden border-r lg:flex lg:w-[260px] lg:min-w-[260px] lg:flex-col"
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
                    <tab.icon className="mr-2 inline-flex h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>

            <div className="border-t p-3" style={{ borderColor: "oklch(0.22 0.03 225)" }}>
              <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Coverage
              </div>
              <div className="space-y-2">
                {[
                  { label: "Bullish", value: bullishCount, color: "text-emerald-400" },
                  { label: "Bearish", value: bearishCount, color: "text-red-400" },
                  { label: "Dengeli", value: balancedCount, color: "text-amber-400" },
                  { label: "Setup", value: positions.length, color: "text-sky-300" },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-2"
                  >
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className={`data-mono text-sm font-bold ${item.color}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t p-3" style={{ borderColor: "oklch(0.22 0.03 225)" }}>
              <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Haziran Coverage
              </div>
              <div className="space-y-1">
                {positions.map(position => (
                  <button
                    key={position.ticker}
                    type="button"
                    onClick={() => handleTickerSelect(position.ticker)}
                    className="flex w-full items-center justify-between px-2 py-2 text-left transition-opacity hover:opacity-80"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="data-mono text-xs font-bold"
                          style={{ color: "oklch(0.92 0.01 220)" }}
                        >
                          {position.ticker}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          {position.earningsTime}
                        </span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {position.earningsDate}
                      </p>
                    </div>
                    <span className="data-mono text-[11px] font-bold text-emerald-300">
                      {position.blueprint.ratioText || "-"}
                    </span>
                  </button>
                ))}
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
                  <tab.icon className="mr-2 inline-flex h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {positions.map(position => (
                <button
                  key={position.ticker}
                  type="button"
                  onClick={() => handleTickerSelect(position.ticker)}
                  className={`shrink-0 rounded-none border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] ${
                    selectedTicker === position.ticker
                      ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-300"
                      : "border-border bg-card/70 text-muted-foreground"
                  }`}
                >
                  {position.ticker}
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
                  Buradaki playbook yapisini okuduktan sonra ayni tema icinde
                  anlik tarama icin scanner alanina gecebilirsin.
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
