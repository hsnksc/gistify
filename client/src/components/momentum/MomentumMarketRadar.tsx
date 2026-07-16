import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
  Bell,
  BellRing,
  Grid3X3,
  Plus,
  Search,
  Star,
  Table2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type {
  FactorBreakdown,
  MidasActionSignal,
  MidasRiskLevel,
} from "@shared/midasSignals";
import type { WatchlistAlertRules } from "@shared/opportunities";
import type { AppLanguage } from "@/lib/i18n";
import { useAccountWatchlists } from "@/hooks/useAccountWatchlists";

const MomentumStrategyLab = lazy(() => import("./MomentumStrategyLab"));

export interface MomentumRadarSignal {
  symbol: string;
  signal: MidasActionSignal;
  price: number;
  dailyPct: number;
  weeklyPct: number;
  monthlyPct: number;
  conviction: number;
  riskLevel?: MidasRiskLevel;
  updatedAt?: string;
  factorBreakdown?: FactorBreakdown;
  catalystTier?: string;
  setupType?: string;
  technical?: Record<string, unknown>;
  priceHistory?: number[];
  companyName?: string;
  sector?: string;
  industry?: string;
  country?: string;
  exchange?: string;
  indexMembership?: string[];
}

type RadarView = "table" | "heatmap";
type RadarMetric = "dailyPct" | "weeklyPct" | "monthlyPct" | "conviction";
type RadarFilter = "all" | "leaders" | "neutral" | "risks" | "favorites";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function signalLabel(signal: MidasActionSignal, language: AppLanguage) {
  const labels: Record<MidasActionSignal, [string, string]> = {
    STRONG_BUY: ["Güçlü Al", "Strong Buy"],
    BUY: ["Al", "Buy"],
    HOLD: ["İzle", "Watch"],
    SELL: ["Sat", "Sell"],
    STRONG_SELL: ["Güçlü Sat", "Strong Sell"],
  };
  return labels[signal][language === "en" ? 1 : 0];
}

function signalClass(signal: MidasActionSignal) {
  if (signal === "STRONG_BUY") {
    return "border-emerald-400/35 bg-emerald-500/16 text-emerald-200";
  }
  if (signal === "BUY") {
    return "border-emerald-400/25 bg-emerald-500/10 text-emerald-300";
  }
  if (signal === "STRONG_SELL") {
    return "border-rose-400/35 bg-rose-500/16 text-rose-200";
  }
  if (signal === "SELL") {
    return "border-rose-400/25 bg-rose-500/10 text-rose-300";
  }
  return "border-amber-400/25 bg-amber-500/10 text-amber-200";
}

function metricValue(signal: MomentumRadarSignal, metric: RadarMetric) {
  return signal[metric];
}

function metricLabel(metric: RadarMetric, language: AppLanguage) {
  const labels: Record<RadarMetric, [string, string]> = {
    dailyPct: ["Günlük", "Daily"],
    weeklyPct: ["Haftalık", "Weekly"],
    monthlyPct: ["Aylık", "Monthly"],
    conviction: ["Güç", "Conviction"],
  };
  return labels[metric][language === "en" ? 1 : 0];
}

function formatMetric(value: number, metric: RadarMetric) {
  if (metric === "conviction") return `${Math.round(value)}/100`;
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function metricTextClass(value: number, metric: RadarMetric) {
  if (metric === "conviction") {
    if (value >= 70) return "text-emerald-300";
    if (value >= 45) return "text-amber-300";
    return "text-muted-foreground";
  }
  if (value > 0) return "text-emerald-300";
  if (value < 0) return "text-rose-300";
  return "text-muted-foreground";
}

function heatmapStyle(value: number, metric: RadarMetric) {
  const normalized =
    metric === "conviction"
      ? clamp((value - 50) / 50, -1, 1)
      : clamp(value / 8, -1, 1);
  const intensity = 0.09 + Math.abs(normalized) * 0.28;

  if (normalized > 0.04) {
    return {
      background: `linear-gradient(145deg, rgba(16,185,129,${intensity}), rgba(15,23,42,0.92))`,
      borderColor: `rgba(52,211,153,${0.18 + Math.abs(normalized) * 0.32})`,
    };
  }
  if (normalized < -0.04) {
    return {
      background: `linear-gradient(145deg, rgba(244,63,94,${intensity}), rgba(15,23,42,0.92))`,
      borderColor: `rgba(251,113,133,${0.18 + Math.abs(normalized) * 0.32})`,
    };
  }
  return {
    background:
      "linear-gradient(145deg, rgba(245,158,11,0.10), rgba(15,23,42,0.92))",
    borderColor: "rgba(251,191,36,0.20)",
  };
}

function riskLabel(risk: MidasRiskLevel | undefined, language: AppLanguage) {
  if (!risk) return "-";
  const labels: Record<MidasRiskLevel, [string, string]> = {
    LOW: ["Düşük", "Low"],
    MEDIUM: ["Orta", "Medium"],
    HIGH: ["Yüksek", "High"],
  };
  return labels[risk][language === "en" ? 1 : 0];
}

function matchesFilter(signal: MomentumRadarSignal, filter: RadarFilter) {
  if (filter === "leaders") {
    return signal.signal === "BUY" || signal.signal === "STRONG_BUY";
  }
  if (filter === "neutral") return signal.signal === "HOLD";
  if (filter === "risks") {
    return signal.signal === "SELL" || signal.signal === "STRONG_SELL";
  }
  return true;
}

export default function MomentumMarketRadar({
  signals,
  language,
  calibrationDate,
  paramsVersion,
}: {
  signals: MomentumRadarSignal[];
  language: AppLanguage;
  calibrationDate?: string;
  paramsVersion?: string;
}) {
  const [view, setView] = useState<RadarView>("table");
  const [metric, setMetric] = useState<RadarMetric>("dailyPct");
  const [filter, setFilter] = useState<RadarFilter>("all");
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("all");
  const [country, setCountry] = useState("all");
  const [marketIndex, setMarketIndex] = useState("all");
  const [selectedListId, setSelectedListId] = useState("default");
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [alertEditor, setAlertEditor] = useState<{
    ticker: string;
    rules: WatchlistAlertRules;
  } | null>(null);
  const {
    createList,
    error: watchlistError,
    isAuthenticated,
    isLoading: watchlistsLoading,
    lists,
    pendingTicker,
    toggleTicker,
    updateAlertRules,
  } = useAccountWatchlists();
  const isEnglish = language === "en";

  useEffect(() => {
    if (lists.length && !lists.some(list => list.id === selectedListId)) {
      setSelectedListId(lists[0].id);
    }
  }, [lists, selectedListId]);

  const selectedList =
    lists.find(list => list.id === selectedListId) || lists[0] || null;
  const favorites = selectedList?.items.map(item => item.ticker) || [];

  const copy = isEnglish
    ? {
        eyebrow: "Market radar",
        title: "Scan every signal from one surface",
        description:
          "Compare momentum across timeframes, isolate leaders and risks, and keep a persistent shortlist for deeper research.",
        search: "Search ticker",
        all: "All",
        leaders: "Leaders",
        neutral: "Neutral",
        risks: "Risks",
        favorites: "Favorites",
        table: "Table",
        heatmap: "Heatmap",
        symbol: "Symbol",
        signal: "Signal",
        price: "Price",
        conviction: "Conviction",
        risk: "Risk",
        open: "Open research",
        empty: "No signals match these filters.",
        colorHint: "Color shows the selected metric; tile size is not a ranking.",
        updated: "Latest signal",
        disclaimer:
          "Decision-support signals only. Confirm the setup, liquidity and invalidation level before acting.",
        list: "Active list",
        newList: "New list",
        listPlaceholder: "List name",
        create: "Create",
        accountSync: "Synced to your account",
        localOnly: "Sign in to sync and create multiple lists",
        signalAlert: "Signal-change alert",
        alertTitle: "Alert rules",
        opportunityAlert: "New opportunity",
        signalChangeAlert: "Signal changes",
        convictionAbove: "Conviction at or above",
        priceAbove: "Price above",
        priceBelow: "Price below / stop",
        earningsWithin: "Earnings within (days)",
        optional: "Optional",
        cancel: "Cancel",
        save: "Save rules",
        sector: "Sector",
        country: "Country",
        marketIndex: "Index",
        any: "All",
      }
    : {
        eyebrow: "Piyasa radarı",
        title: "Tüm sinyalleri tek yüzeyden tara",
        description:
          "Momentum’u farklı vadelerde karşılaştır, liderleri ve riskleri ayır, derin analiz için kalıcı bir kısa liste oluştur.",
        search: "Hisse ara",
        all: "Tümü",
        leaders: "Liderler",
        neutral: "Nötr",
        risks: "Riskler",
        favorites: "Favoriler",
        table: "Tablo",
        heatmap: "Isı haritası",
        symbol: "Hisse",
        signal: "Sinyal",
        price: "Fiyat",
        conviction: "Güç",
        risk: "Risk",
        open: "Araştırmayı aç",
        empty: "Bu filtrelerle eşleşen sinyal yok.",
        colorHint: "Renk seçili metriği gösterir; kutu boyutu sıralama değildir.",
        updated: "Son sinyal",
        disclaimer:
          "Yalnızca karar destek sinyalidir. İşlem öncesi setup, likidite ve geçersizlik seviyesini doğrula.",
        list: "Aktif liste",
        newList: "Yeni liste",
        listPlaceholder: "Liste adı",
        create: "Oluştur",
        accountSync: "Hesabınla senkronize",
        localOnly: "Senkronizasyon ve çoklu liste için giriş yap",
        signalAlert: "Sinyal değişimi uyarısı",
        alertTitle: "Uyarı kuralları",
        opportunityAlert: "Yeni fırsat",
        signalChangeAlert: "Sinyal değişimi",
        convictionAbove: "Conviction en az",
        priceAbove: "Fiyat üstünde",
        priceBelow: "Fiyat altında / stop",
        earningsWithin: "Earnings yaklaşıyor (gün)",
        optional: "Opsiyonel",
        cancel: "Vazgeç",
        save: "Kuralları kaydet",
        sector: "Sektör",
        country: "Ülke",
        marketIndex: "Endeks",
        any: "Tümü",
      };

  const coverageOptions = useMemo(() => ({
    sectors: Array.from(new Set(signals.map(item => item.sector).filter((value): value is string => Boolean(value)))).sort(),
    countries: Array.from(new Set(signals.map(item => item.country).filter((value): value is string => Boolean(value)))).sort(),
    indices: Array.from(new Set(signals.flatMap(item => item.indexMembership || []))).sort(),
  }), [signals]);

  const latestSignalLabel = useMemo(() => {
    const latestTimestamp = signals
      .map(signal => signal.updatedAt)
      .filter((value): value is string => Boolean(value))
      .map(value => new Date(value))
      .filter(value => !Number.isNaN(value.getTime()))
      .sort((left, right) => right.getTime() - left.getTime())[0];

    if (!latestTimestamp) return "-";
    return new Intl.DateTimeFormat(isEnglish ? "en-US" : "tr-TR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(latestTimestamp);
  }, [isEnglish, signals]);

  const filteredSignals = useMemo(() => {
    const normalizedQuery = query.trim().toUpperCase();
    return [...signals]
      .filter(signal =>
        normalizedQuery ? signal.symbol.includes(normalizedQuery) : true
      )
      .filter(signal =>
        filter === "favorites"
          ? favorites.includes(signal.symbol)
          : matchesFilter(signal, filter)
      )
      .filter(signal => sector === "all" || signal.sector === sector)
      .filter(signal => country === "all" || signal.country === country)
      .filter(signal => marketIndex === "all" || signal.indexMembership?.includes(marketIndex))
      .sort(
        (left, right) =>
          metricValue(right, metric) - metricValue(left, metric)
      );
  }, [country, favorites, filter, marketIndex, metric, query, sector, signals]);

  const filterItems: Array<{ id: RadarFilter; label: string; count: number }> = [
    { id: "all", label: copy.all, count: signals.length },
    {
      id: "leaders",
      label: copy.leaders,
      count: signals.filter(signal => matchesFilter(signal, "leaders")).length,
    },
    {
      id: "neutral",
      label: copy.neutral,
      count: signals.filter(signal => matchesFilter(signal, "neutral")).length,
    },
    {
      id: "risks",
      label: copy.risks,
      count: signals.filter(signal => matchesFilter(signal, "risks")).length,
    },
    {
      id: "favorites",
      label: copy.favorites,
      count: signals.filter(signal => favorites.includes(signal.symbol)).length,
    },
  ];

  const toggleFavorite = (symbol: string) => {
    void toggleTicker(symbol, selectedListId).catch(() => undefined);
  };

  const submitNewList = () => {
    const name = newListName.trim();
    if (!name) return;
    void createList(name)
      .then(list => {
        if (list) setSelectedListId(list.id);
        setNewListName("");
        setIsCreatingList(false);
      })
      .catch(() => undefined);
  };

  const openAlertEditor = (symbol: string) => {
    const item = selectedList?.items.find(entry => entry.ticker === symbol);
    if (!item) return;
    setAlertEditor({ ticker: symbol, rules: { ...item.alertRules } });
  };

  const updateAlertNumber = (
    key:
      | "convictionAbove"
      | "priceAbove"
      | "priceBelow"
      | "earningsWithinDays",
    value: string
  ) => {
    setAlertEditor(current =>
      current
        ? {
            ...current,
            rules: {
              ...current.rules,
              [key]: value === "" ? undefined : Number(value),
            },
          }
        : current
    );
  };

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card/75 shadow-[0_20px_70px_rgba(3,7,18,0.24)]">
      <div className="border-b border-border bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.13),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.94),rgba(15,23,42,0.76))] p-4 md:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sky-200">
              <Grid3X3 className="size-4" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                {copy.eyebrow}
              </p>
            </div>
            <h3 className="heading-condensed text-2xl text-foreground md:text-3xl">
              {copy.title}
            </h3>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              {copy.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="relative min-w-[190px] flex-1 sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder={copy.search}
                aria-label={copy.search}
                className="h-10 w-full rounded-xl border border-border bg-background/70 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-sky-400/40"
              />
            </label>
            <select
              value={metric}
              onChange={event => setMetric(event.target.value as RadarMetric)}
              aria-label={isEnglish ? "Radar metric" : "Radar metriği"}
              className="h-10 rounded-xl border border-border bg-background/70 px-3 text-sm text-foreground outline-none focus:border-sky-400/40"
            >
              {(["dailyPct", "weeklyPct", "monthlyPct", "conviction"] as RadarMetric[]).map(
                item => (
                  <option key={item} value={item}>
                    {metricLabel(item, language)}
                  </option>
                )
              )}
            </select>
            <div className="flex rounded-xl border border-border bg-background/60 p-1">
              {([
                { id: "table" as const, label: copy.table, icon: Table2 },
                { id: "heatmap" as const, label: copy.heatmap, icon: Grid3X3 },
              ]).map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setView(item.id)}
                    aria-pressed={view === item.id}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      view === item.id
                        ? "bg-sky-500/18 text-sky-100"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {filterItems.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={filter === item.id}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === item.id
                  ? "border-sky-400/30 bg-sky-500/15 text-sky-100"
                  : "border-border bg-background/55 text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.id === "leaders" ? <TrendingUp className="size-3.5" /> : null}
              {item.id === "risks" ? <TrendingDown className="size-3.5" /> : null}
              {item.id === "favorites" ? <Star className="size-3.5" /> : null}
              {item.label}
              <span className="data-mono rounded-full bg-background/60 px-1.5 py-0.5 text-[10px]">
                {item.count}
              </span>
            </button>
          ))}
          {coverageOptions.sectors.length ? (
            <select value={sector} onChange={event => setSector(event.target.value)} aria-label={copy.sector} className="h-8 rounded-full border border-border bg-background/65 px-3 text-xs text-foreground">
              <option value="all">{copy.sector}: {copy.any}</option>
              {coverageOptions.sectors.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
          ) : null}
          {coverageOptions.countries.length ? (
            <select value={country} onChange={event => setCountry(event.target.value)} aria-label={copy.country} className="h-8 rounded-full border border-border bg-background/65 px-3 text-xs text-foreground">
              <option value="all">{copy.country}: {copy.any}</option>
              {coverageOptions.countries.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
          ) : null}
          {coverageOptions.indices.length ? (
            <select value={marketIndex} onChange={event => setMarketIndex(event.target.value)} aria-label={copy.marketIndex} className="h-8 rounded-full border border-border bg-background/65 px-3 text-xs text-foreground">
              <option value="all">{copy.marketIndex}: {copy.any}</option>
              {coverageOptions.indices.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
          ) : null}
        </div>

        <div className="mt-3 flex flex-col gap-2 rounded-xl border border-border/70 bg-background/35 p-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {copy.list}
            </label>
            <select
              value={selectedListId}
              onChange={event => setSelectedListId(event.target.value)}
              disabled={watchlistsLoading}
              className="h-8 min-w-36 rounded-lg border border-border bg-background/75 px-2 text-xs text-foreground outline-none focus:border-sky-400/40"
            >
              {lists.map(list => (
                <option key={list.id} value={list.id}>
                  {list.name} ({list.items.length})
                </option>
              ))}
            </select>
            {isCreatingList ? (
              <form
                className="flex items-center gap-1.5"
                onSubmit={event => {
                  event.preventDefault();
                  submitNewList();
                }}
              >
                <input
                  autoFocus
                  value={newListName}
                  onChange={event => setNewListName(event.target.value)}
                  placeholder={copy.listPlaceholder}
                  maxLength={48}
                  className="h-8 w-36 rounded-lg border border-border bg-background/75 px-2 text-xs text-foreground outline-none focus:border-sky-400/40"
                />
                <button
                  type="submit"
                  className="h-8 rounded-lg bg-sky-500/18 px-2.5 text-xs font-semibold text-sky-100"
                >
                  {copy.create}
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsCreatingList(true)}
                disabled={!isAuthenticated}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-semibold text-muted-foreground transition-colors enabled:hover:text-foreground disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Plus className="size-3.5" />
                {copy.newList}
              </button>
            )}
          </div>
          <p className={`text-[11px] ${watchlistError ? "text-rose-300" : "text-muted-foreground"}`}>
            {watchlistError || (isAuthenticated ? copy.accountSync : copy.localOnly)}
          </p>
        </div>
      </div>

      {filteredSignals.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          {copy.empty}
        </div>
      ) : view === "table" ? (
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-left text-sm">
            <thead className="border-b border-border bg-background/55 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="w-12 px-3 py-3" aria-label={copy.favorites} />
                <th className="px-3 py-3">{copy.symbol}</th>
                <th className="px-3 py-3">{copy.signal}</th>
                <th className="px-3 py-3">{copy.price}</th>
                <th className="px-3 py-3">1D</th>
                <th className="px-3 py-3">1W</th>
                <th className="px-3 py-3">1M</th>
                <th className="px-3 py-3">{copy.conviction}</th>
                <th className="px-3 py-3">{copy.risk}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSignals.map(signal => {
                const item = selectedList?.items.find(
                  entry => entry.ticker === signal.symbol
                );
                const isFavorite = Boolean(item);
                return (
                  <tr
                    key={signal.symbol}
                    className="border-b border-border/55 transition-colors last:border-b-0 hover:bg-background/55"
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggleFavorite(signal.symbol)}
                          disabled={pendingTicker === signal.symbol}
                          aria-label={`${signal.symbol} ${copy.favorites}`}
                          aria-pressed={isFavorite}
                          className={`rounded-lg p-1.5 transition-colors disabled:opacity-50 ${
                            isFavorite
                              ? "bg-amber-500/12 text-amber-300"
                              : "text-muted-foreground hover:bg-background hover:text-amber-300"
                          }`}
                        >
                          <Star className="size-4" fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                        {isFavorite && isAuthenticated ? (
                          <button
                            type="button"
                            onClick={() => openAlertEditor(signal.symbol)}
                            aria-label={`${signal.symbol} ${copy.signalAlert}`}
                            aria-pressed={Boolean(item?.alertRules.signalChange)}
                            title={copy.signalAlert}
                            className={`rounded-lg p-1.5 transition-colors ${
                              item?.alertRules.signalChange
                                ? "bg-sky-500/12 text-sky-300"
                                : "text-muted-foreground hover:text-sky-300"
                            }`}
                          >
                            {item?.alertRules.signalChange ? (
                              <BellRing className="size-3.5" />
                            ) : (
                              <Bell className="size-3.5" />
                            )}
                          </button>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <a
                        href={`/coverage/${signal.symbol}`}
                        className="font-semibold text-foreground transition-colors hover:text-sky-300"
                        title={copy.open}
                      >
                        ${signal.symbol}
                      </a>
                      {signal.companyName || signal.sector ? (
                        <p className="mt-0.5 max-w-48 truncate text-[10px] text-muted-foreground">
                          {[signal.companyName, signal.sector].filter(Boolean).join(" · ")}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${signalClass(signal.signal)}`}>
                        {signalLabel(signal.signal, language)}
                      </span>
                    </td>
                    <td className="data-mono px-3 py-3 text-foreground">
                      ${signal.price.toFixed(2)}
                    </td>
                    {(["dailyPct", "weeklyPct", "monthlyPct"] as RadarMetric[]).map(item => (
                      <td
                        key={item}
                        className={`data-mono px-3 py-3 ${metricTextClass(metricValue(signal, item), item)}`}
                      >
                        {formatMetric(metricValue(signal, item), item)}
                      </td>
                    ))}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="data-mono w-8 text-foreground">
                          {Math.round(signal.conviction)}
                        </span>
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-background">
                          <div
                            className="h-full rounded-full bg-sky-400"
                            style={{ width: `${clamp(signal.conviction, 0, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {riskLabel(signal.riskLevel, language)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 md:p-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7">
            {filteredSignals.map(signal => {
              const value = metricValue(signal, metric);
              const isFavorite = favorites.includes(signal.symbol);
              return (
                <article
                  key={signal.symbol}
                  style={heatmapStyle(value, metric)}
                  className="group relative min-h-28 rounded-xl border p-3 transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <a
                      href={`/coverage/${signal.symbol}`}
                      className="heading-condensed text-xl text-foreground transition-colors hover:text-sky-200"
                      title={copy.open}
                    >
                      {signal.symbol}
                    </a>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(signal.symbol)}
                      aria-label={`${signal.symbol} ${copy.favorites}`}
                      aria-pressed={isFavorite}
                      className={isFavorite ? "text-amber-300" : "text-foreground/40 hover:text-amber-300"}
                    >
                      <Star className="size-3.5" fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <p className={`data-mono mt-3 text-lg font-semibold ${metricTextClass(value, metric)}`}>
                    {formatMetric(value, metric)}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
                    <span>{signalLabel(signal.signal, language)}</span>
                    <span>${signal.price.toFixed(2)}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
      <Suspense
        fallback={
          <div className="border-t border-border p-5 text-sm text-muted-foreground">
            {isEnglish ? "Loading strategy lab..." : "Strateji laboratuvarı yükleniyor..."}
          </div>
        }
      >
        <MomentumStrategyLab
          signals={signals}
          selectedTickers={favorites}
          language={language}
          calibrationDate={calibrationDate}
          paramsVersion={paramsVersion}
          activeListId={selectedListId}
          activeListName={selectedList?.name || copy.favorites}
        />
      </Suspense>
      {alertEditor ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="radar-alert-title"
          onMouseDown={event => {
            if (event.currentTarget === event.target) setAlertEditor(null);
          }}
        >
          <form
            className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-2xl"
            onSubmit={event => {
              event.preventDefault();
              void updateAlertRules(
                selectedListId,
                alertEditor.ticker,
                alertEditor.rules
              )
                .then(() => setAlertEditor(null))
                .catch(() => undefined);
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-300">
                  ${alertEditor.ticker}
                </p>
                <h4 id="radar-alert-title" className="mt-1 text-xl font-semibold text-foreground">
                  {copy.alertTitle}
                </h4>
              </div>
              <BellRing className="size-5 text-sky-300" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {([
                ["opportunity", copy.opportunityAlert],
                ["signalChange", copy.signalChangeAlert],
              ] as const).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background/45 p-3 text-sm text-foreground"
                >
                  <input
                    type="checkbox"
                    checked={alertEditor.rules[key]}
                    onChange={event =>
                      setAlertEditor(current =>
                        current
                          ? {
                              ...current,
                              rules: {
                                ...current.rules,
                                [key]: event.target.checked,
                              },
                            }
                          : current
                      )
                    }
                    className="size-4 accent-sky-500"
                  />
                  {label}
                </label>
              ))}
              {([
                ["convictionAbove", copy.convictionAbove, 0, 100, "1"],
                ["priceAbove", copy.priceAbove, 0, undefined, "0.01"],
                ["priceBelow", copy.priceBelow, 0, undefined, "0.01"],
                ["earningsWithinDays", copy.earningsWithin, 0, 60, "1"],
              ] as const).map(([key, label, min, max, step]) => (
                <label key={key} className="space-y-1.5 text-xs text-muted-foreground">
                  <span>{label}</span>
                  <input
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={alertEditor.rules[key] ?? ""}
                    onChange={event => updateAlertNumber(key, event.target.value)}
                    placeholder={copy.optional}
                    className="h-10 w-full rounded-xl border border-border bg-background/65 px-3 text-sm text-foreground outline-none focus:border-sky-400/40"
                  />
                </label>
              ))}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAlertEditor(null)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                {copy.cancel}
              </button>
              <button
                type="submit"
                className="rounded-xl bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-100 hover:bg-sky-500/25"
              >
                {copy.save}
              </button>
            </div>
          </form>
        </div>
      ) : null}
      <footer className="flex flex-col gap-2 border-t border-border bg-background/45 px-4 py-3 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>
            {copy.updated}: <span className="data-mono">{latestSignalLabel}</span>
          </span>
          {view === "heatmap" ? <span>{copy.colorHint}</span> : null}
        </div>
        <span>{copy.disclaimer}</span>
      </footer>
    </section>
  );
}
