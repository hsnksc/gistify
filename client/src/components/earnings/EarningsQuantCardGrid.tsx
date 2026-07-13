import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Database,
  Search,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { EarningsStrategyData, Strategy } from "@shared/earnings";
import { type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import EarningsQuantCommandCenter from "@/components/earnings/EarningsQuantCommandCenter";

type FilterKey = "all" | "eod" | "changed" | "critical";

const PAGE_SIZE = 8;

export default function EarningsQuantCardGrid({
  data,
  language,
  selectedTicker,
  onSelectTicker,
}: {
  data: EarningsStrategyData;
  language: AppLanguage;
  selectedTicker?: string | null;
  onSelectTicker?: (ticker: string) => void;
}) {
  const tr = language === "tr";
  const overview = data.quantOverview;
  const candidates = useMemo(
    () =>
      data.strategies.filter(
        (
          strategy
        ): strategy is Strategy & {
          intelligence: NonNullable<Strategy["intelligence"]>;
        } => Boolean(strategy.intelligence)
      ),
    [data.strategies]
  );
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [page, setPage] = useState(1);
  const [detailTicker, setDetailTicker] = useState<string | null>(() => {
    if (
      selectedTicker &&
      candidates.some(strategy => strategy.ticker === selectedTicker)
    ) {
      return selectedTicker;
    }

    return candidates[0]?.ticker || null;
  });

  useEffect(() => {
    setDetailTicker(current => {
      if (
        selectedTicker &&
        candidates.some(strategy => strategy.ticker === selectedTicker)
      ) {
        return selectedTicker;
      }

      if (current && candidates.some(strategy => strategy.ticker === current)) {
        return current;
      }

      return candidates[0]?.ticker || null;
    });
  }, [candidates, selectedTicker]);

  const filtered = useMemo(() => {
    const normalizedQuery = query
      .trim()
      .toLocaleLowerCase(tr ? "tr-TR" : "en-US");

    return candidates
      .filter(strategy => {
        if (
          normalizedQuery &&
          !`${strategy.ticker} ${strategy.company || ""}`
            .toLocaleLowerCase(tr ? "tr-TR" : "en-US")
            .includes(normalizedQuery)
        ) {
          return false;
        }

        if (filter === "eod") {
          return (
            strategy.intelligence.dataQuality === "eod" ||
            strategy.intelligence.dataQuality === "live" ||
            strategy.intelligence.dataQuality === "mixed"
          );
        }
        if (filter === "changed") {
          return strategy.intelligence.decision.changed;
        }
        if (filter === "critical") {
          return strategy.intelligence.alerts.some(
            alert => alert.severity === "critical"
          );
        }
        return true;
      })
      .sort((left, right) => {
        const leftHasMarketData =
          left.intelligence.dataQuality !== "report" ? 0 : 1;
        const rightHasMarketData =
          right.intelligence.dataQuality !== "report" ? 0 : 1;
        if (leftHasMarketData !== rightHasMarketData)
          return leftHasMarketData - rightHasMarketData;
        return (
          left.intelligence.options.dte - right.intelligence.options.dte ||
          left.ticker.localeCompare(right.ticker)
        );
      });
  }, [candidates, filter, query, tr]);

  useEffect(() => {
    setPage(1);
  }, [filter, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );
  const rangeStart = filtered.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, filtered.length);
  const filters: Array<{ key: FilterKey; label: string; count: number }> = [
    { key: "all", label: tr ? "Tümü" : "All", count: candidates.length },
    {
      key: "eod",
      label: "Theta EOD",
      count: candidates.filter(
        strategy => strategy.intelligence.dataQuality !== "report"
      ).length,
    },
    {
      key: "changed",
      label: tr ? "Değişen" : "Changed",
      count: candidates.filter(
        strategy => strategy.intelligence.decision.changed
      ).length,
    },
    {
      key: "critical",
      label: tr ? "Kritik" : "Critical",
      count: candidates.filter(strategy =>
        strategy.intelligence.alerts.some(
          alert => alert.severity === "critical"
        )
      ).length,
    },
  ];

  const openDetail = (ticker: string) => {
    setDetailTicker(ticker);
    onSelectTicker?.(ticker);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 rounded-xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/[0.08] via-slate-950/55 to-violet-500/[0.06] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-2.5 text-cyan-300">
            <BrainCircuit className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">
              {tr
                ? "Hisse bazlı earnings stratejileri"
                : "Stock-based earnings strategies"}
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">
              {tr
                ? "Bir kart seçin; opsiyon yapısı, risk planı ve uyarılar kartların altında kalıcı olarak gösterilir."
                : "Select a card; its options structure, risk plan, and alerts stay visible below the cards."}
            </p>
          </div>
        </div>
        {overview ? (
          <div className="grid grid-cols-4 gap-2 lg:min-w-[390px]">
            <CompactMetric
              label={tr ? "Kapsam" : "Coverage"}
              value={`%${overview.marketDataCoverage}`}
            />
            <CompactMetric label="EOD" value={`%${overview.eodCoverage}`} />
            <CompactMetric
              label={tr ? "Değişim" : "Changes"}
              value={overview.strategyChanges}
            />
            <CompactMetric
              label={tr ? "Kritik" : "Critical"}
              value={overview.criticalAlerts}
              alert={overview.criticalAlerts > 0}
            />
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-white/8 bg-slate-950/35 p-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={
              tr ? "Hisse veya şirket ara…" : "Search stock or company…"
            }
            className="h-10 w-full rounded-lg border border-white/10 bg-slate-950/70 pl-9 pr-3 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
          />
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <SlidersHorizontal className="size-4 shrink-0 text-slate-500" />
          {filters.map(item => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition",
                filter === item.key
                  ? "border-cyan-400/35 bg-cyan-400/10 text-cyan-200"
                  : "border-white/8 bg-slate-900/50 text-slate-400 hover:border-white/20 hover:text-white"
              )}
            >
              {item.label}
              <span className="font-mono text-[10px] opacity-65">
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {pageItems.length ? (
        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          {pageItems.map(strategy => (
            <StockStrategyCard
              key={strategy.ticker}
              strategy={strategy}
              tr={tr}
              active={detailTicker === strategy.ticker}
              onOpen={() => openDetail(strategy.ticker)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/30 px-4 py-10 text-center text-sm text-slate-500">
          {tr
            ? "Bu filtreyle eşleşen hisse bulunamadı."
            : "No stocks match this filter."}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-white/8 bg-slate-950/30 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          <span className="font-mono font-bold text-slate-300">
            {rangeStart}–{rangeEnd}
          </span>{" "}
          / {filtered.length} {tr ? "hisse" : "stocks"}
          <span className="ml-2 text-slate-600">
            ·{" "}
            {tr
              ? "Seçili kartın analizi aşağıdadır"
              : "The selected card analysis is below"}
          </span>
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage(current => Math.max(1, current - 1))}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={tr ? "Önceki sayfa" : "Previous page"}
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-16 text-center font-mono text-xs font-bold text-slate-300">
            {safePage} / {pageCount}
          </span>
          <button
            type="button"
            disabled={safePage >= pageCount}
            onClick={() => setPage(current => Math.min(pageCount, current + 1))}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={tr ? "Sonraki sayfa" : "Next page"}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {detailTicker ? (
        <div className="scroll-mt-24 rounded-xl border border-cyan-400/20 bg-slate-950/30 p-2 md:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-2 pb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400">
                {tr ? "Seçili hisse analizi" : "Selected stock analysis"}
              </p>
              <h3 className="mt-1 text-xl font-black text-white">
                {detailTicker}
              </h3>
            </div>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/8 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
              {tr ? "Kart seçimi korunur" : "Selection stays open"}
            </span>
          </div>
          <EarningsQuantCommandCenter
            data={data}
            language={language}
            selectedTicker={detailTicker}
            onSelectTicker={openDetail}
            showOverview={false}
            showTickerSelector={false}
          />
        </div>
      ) : null}
    </section>
  );
}

function StockStrategyCard({
  strategy,
  tr,
  active,
  onOpen,
}: {
  strategy: Strategy & { intelligence: NonNullable<Strategy["intelligence"]> };
  tr: boolean;
  active: boolean;
  onOpen: () => void;
}) {
  const intelligence = strategy.intelligence;
  const criticalAlerts = intelligence.alerts.filter(
    alert => alert.severity === "critical"
  ).length;
  const warningAlerts = intelligence.alerts.filter(
    alert => alert.severity === "warning"
  ).length;
  const hasMarketData = intelligence.dataQuality !== "report";
  const change = intelligence.market.change1d;

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group flex min-h-[250px] flex-col rounded-xl border bg-slate-950/45 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/35 hover:bg-slate-950/70 hover:shadow-[0_14px_35px_rgba(8,145,178,0.08)]",
        active ? "border-cyan-400/35 ring-1 ring-cyan-400/15" : "border-white/8"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-white">
              {strategy.ticker}
            </span>
            <BiasPill bias={intelligence.decision.bias} />
          </div>
          <p className="mt-1 line-clamp-1 text-xs text-slate-500">
            {strategy.company || "—"}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-base font-bold text-white">
            ${intelligence.market.spot.toFixed(2)}
          </p>
          <p
            className={cn(
              "mt-0.5 text-[11px] font-bold",
              change === undefined
                ? "text-slate-500"
                : change >= 0
                  ? "text-emerald-400"
                  : "text-rose-400"
            )}
          >
            {change === undefined
              ? "1D —"
              : `1D ${change > 0 ? "+" : ""}${change.toFixed(2)}%`}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-black tracking-wide",
            hasMarketData
              ? "border-emerald-400/25 bg-emerald-400/8 text-emerald-300"
              : "border-amber-400/25 bg-amber-400/8 text-amber-300"
          )}
        >
          <Database className="size-3" />
          {hasMarketData
            ? `${intelligence.dataQuality.toUpperCase()} + MODEL`
            : "MODEL / VERIFY"}
        </span>
        <span
          className={cn(
            "rounded-full border px-2 py-1 text-[9px] font-black",
            intelligence.decision.tradeStatus === "TRADE"
              ? "border-emerald-400/25 text-emerald-300"
              : intelligence.decision.tradeStatus === "WATCH"
                ? "border-amber-400/25 text-amber-300"
                : "border-rose-400/25 text-rose-300"
          )}
        >
          {intelligence.decision.tradeStatus}
        </span>
        {intelligence.decision.changed ? (
          <span className="rounded-full border border-amber-400/25 bg-amber-400/8 px-2 py-1 text-[9px] font-black text-amber-300">
            ∆ {tr ? "DEĞİŞTİ" : "CHANGED"}
          </span>
        ) : null}
      </div>

      <div className="mt-3 rounded-lg border border-cyan-400/15 bg-cyan-400/[0.045] p-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-400/80">
          {tr ? "Seçilen strateji" : "Selected strategy"}
        </p>
        <p className="mt-1 line-clamp-1 text-sm font-bold text-slate-100">
          {intelligence.decision.strategy}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-1.5">
        <CardMetric label="DTE" value={intelligence.options.dte} />
        <CardMetric
          label="CALL/PUT"
          value={intelligence.options.callPutRatio?.toFixed(2) || "—"}
        />
        <CardMetric
          label={tr ? "GÜVEN" : "CONF"}
          value={`%${intelligence.decision.confidence}`}
        />
        <CardMetric
          label={tr ? "UYARI" : "ALERT"}
          value={criticalAlerts || warningAlerts || intelligence.alerts.length}
          alert={criticalAlerts > 0}
        />
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-white/7 pt-3 text-[11px]">
        <span
          className={
            criticalAlerts
              ? "text-rose-300"
              : warningAlerts
                ? "text-amber-300"
                : "text-slate-500"
          }
        >
          {criticalAlerts
            ? `${criticalAlerts} ${tr ? "kritik uyarı" : "critical alerts"}`
            : warningAlerts
              ? `${warningAlerts} ${tr ? "uyarı" : "warnings"}`
              : tr
                ? "Kritik uyarı yok"
                : "No critical alerts"}
        </span>
        <span className="inline-flex items-center gap-1 font-bold text-cyan-300 transition group-hover:gap-2">
          {tr ? "Detay" : "Details"}
          <ArrowRight className="size-3.5" />
        </span>
      </div>
    </button>
  );
}

function BiasPill({ bias }: { bias: "bullish" | "neutral" | "bearish" }) {
  const Icon =
    bias === "bullish"
      ? TrendingUp
      : bias === "bearish"
        ? TrendingDown
        : SlidersHorizontal;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[8px] font-black uppercase",
        bias === "bullish"
          ? "border-emerald-400/20 bg-emerald-400/8 text-emerald-300"
          : bias === "bearish"
            ? "border-rose-400/20 bg-rose-400/8 text-rose-300"
            : "border-slate-400/20 bg-slate-400/8 text-slate-300"
      )}
    >
      <Icon className="size-2.5" />
      {bias}
    </span>
  );
}

function CompactMetric({
  label,
  value,
  alert = false,
}: {
  label: string;
  value: string | number;
  alert?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/8 bg-slate-950/55 px-2 py-2 text-center">
      <p
        className={cn(
          "font-mono text-sm font-black",
          alert ? "text-rose-300" : "text-cyan-200"
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 truncate text-[8px] font-bold uppercase tracking-wider text-slate-600">
        {label}
      </p>
    </div>
  );
}

function CardMetric({
  label,
  value,
  alert = false,
}: {
  label: string;
  value: string | number;
  alert?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-white/7 bg-slate-900/45 px-1.5 py-2 text-center">
      <p className="truncate text-[7px] font-bold tracking-wide text-slate-600">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 truncate font-mono text-xs font-bold",
          alert ? "text-rose-300" : "text-slate-200"
        )}
      >
        {value}
      </p>
    </div>
  );
}
