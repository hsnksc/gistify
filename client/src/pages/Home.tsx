import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  ClipboardList,
  PanelLeftClose,
  PanelLeftOpen,
  Radar,
  RefreshCw,
  Shield,
} from "lucide-react";
import { useLocation } from "wouter";
import type {
  EarningReportSourceRecord,
  EarningReportSourceSummary,
} from "@shared/earningReports";
import { Button } from "@/components/ui/button";
import EarningReportCalendarTab from "@/components/tabs/EarningReportCalendarTab";
import EarningReportPlaybookTab from "@/components/tabs/EarningReportPlaybookTab";
import EarningReportRiskTab from "@/components/tabs/EarningReportRiskTab";
import { formatEarningReportDate, sortEarningReportsNewestFirst } from "@/lib/earningReports";
import { parseEarningReportMarkdown } from "@/lib/earningReportSource";

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

interface EarningReportsListResponse {
  reports?: EarningReportSourceSummary[];
}

interface EarningReportDetailResponse {
  report?: EarningReportSourceRecord | null;
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

export default function Home() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabId>("playbook");
  const [selectedReportId, setSelectedReportId] = useState("");
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reports, setReports] = useState<EarningReportSourceSummary[]>([]);
  const [activeReport, setActiveReport] = useState<EarningReportSourceRecord | null>(null);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
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
        const response = await fetch(`/api/earning-reports/${encodeURIComponent(selectedReportId)}`, {
          credentials: "include",
          cache: "no-store",
        });

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

  const selectedSummary = useMemo(
    () => reports.find(report => report.id === selectedReportId) || reports[0] || null,
    [reports, selectedReportId]
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

  const latestReport = reports[0] || null;
  const nextEvent = positions[0] || null;
  const avgIvRank = useMemo(() => {
    const valid = positions.filter(position => position.ivRank !== null);
    if (!valid.length) {
      return "-";
    }

    const total = valid.reduce((sum, position) => sum + (position.ivRank || 0), 0);
    return `%${Math.round(total / valid.length)}`;
  }, [positions]);

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
  const activeMeta = parsedReport
    ? parsedReport.meta.filter(
        item => item.label !== "Rapor Tarihi" && item.label !== "VIX"
      )
    : [];

  const handleTickerSelect = (ticker: string) => {
    setSelectedTicker(ticker);
    setActiveTab("playbook");
  };

  const renderActiveTab = () => {
    if (loadingReports || loadingDetail) {
      return <LoadingState label="Earning report workspace yukleniyor." />;
    }

    if (!parsedReport) {
      return (
        <LoadingState label="Henuz goruntulenebilir bir earning report yok. `earningreport/` altina yeni `.md` dosyasi eklendiginde burada otomatik listelenecek." />
      );
    }

    switch (activeTab) {
      case "playbook":
        return (
          <EarningReportPlaybookTab
            report={parsedReport}
            selectedTicker={selectedTicker}
            onSelectTicker={setSelectedTicker}
          />
        );
      case "calendar":
        return (
          <EarningReportCalendarTab
            report={parsedReport}
            onOpenTicker={handleTickerSelect}
          />
        );
      case "risk":
        return <EarningReportRiskTab report={parsedReport} />;
      default:
        return (
          <EarningReportPlaybookTab
            report={parsedReport}
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
                  Runtime earning report library
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
                VIX
              </p>
              <p className="data-mono text-xs font-semibold text-foreground">
                {selectedSummary?.vixLabel || "-"}
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
                Earning report library,
                <br />
                <span style={{ color: "oklch(0.78 0.18 160)" }}>
                  gunden gune guncel playbook
                </span>
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                `earningreport/` altina yeni `.md` dosyasi biraktiginda sistem onu
                otomatik indeksler, tarihine gore siralar ve en yeniyi current
                source-of-truth olarak acar. Onceki dosyalar arsivde kalir; her
                yeni rapor bir oncekinin guncellenmis devamidir.
              </p>
            </div>

            <div className="rounded-none border border-emerald-400/25 bg-emerald-500/5 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Source path
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="data-mono text-foreground">earningreport/</span>{" "}
                klasorundeki markdown dosyalari runtime’da okunur. En yeni rapor
                varsayilan secim olur, onceki gunler de arsivde kalir.
              </p>
            </div>

            {activeMeta.length ? (
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
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <SummaryCard
              label="Rapor adedi"
              value={String(reports.length)}
              hint="earningreport kutuphanesi"
            />
            <SummaryCard
              label="Son tarih"
              value={latestReport ? formatEarningReportDate(latestReport.reportDate) : "-"}
              hint="En yeni indekslenen rapor"
            />
            <SummaryCard
              label="Aktif setup"
              value={String(positions.length)}
              hint="Secili rapordaki ticker sayisi"
            />
            <SummaryCard
              label="Ort. IV Rank"
              value={avgIvRank}
              hint="Secili rapor metriklerinden"
            />
            <SummaryCard
              label="Yakin event"
              value={nextEvent?.ticker || "-"}
              hint={
                nextEvent
                  ? `${nextEvent.earningsDate} · ${nextEvent.daysLeft} gun`
                  : "Secili rapordan"
              }
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
                    Update Chain
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    En yeni rapor current, eskiler arsiv
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
                          {formatEarningReportDate(report.reportDate)}
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
                          {report.reportDateLabel}
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
                  `earningreport/` altina yeni `.md` dosyasi eklendiginde burada
                  otomatik gorunecek.
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
                    {selectedSummary?.title || "Earning report bekleniyor"}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {selectedSummary?.subtitle || selectedSummary?.headline || "Secili raporun alt basligi burada gorunur."}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[420px]">
                  <div className="rounded-none border border-border bg-background/50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Tarih
                    </p>
                    <p className="mt-2 data-mono text-sm font-bold text-foreground">
                      {selectedSummary?.reportDateLabel || "-"}
                    </p>
                  </div>
                  <div className="rounded-none border border-border bg-background/50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      VIX
                    </p>
                    <p className="mt-2 data-mono text-sm font-bold text-amber-300">
                      {selectedSummary?.vixLabel || "-"}
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
                </div>
              </div>
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
                  Earning report akisini gunluk olarak guncelledikten sonra ayni
                  theme icinde anlik tarama icin scanner alanina gecebilirsin.
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
