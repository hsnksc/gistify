import { useState, useMemo } from "react";
import type { StockResult } from "@/types/scanner";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/watchlist";
import { signalColor, signalBg, signalLabel } from "@/lib/scoreConfig";
import RadarTooltip from "./RadarTooltip";
import {
  ArrowUp, ArrowDown, TrendingUp, Volume2, Activity, Eye,
  Star, ArrowUpRight, ArrowDownRight, Minus, AlertTriangle
} from "lucide-react";

type SortKey = "ticker" | "score" | "rankingScore" | "priceChangePct" | "volumeRatio" | "rsi" | "signal";
type SortDir = "asc" | "desc";

interface ResultsTableProps {
  stocks: StockResult[];
  onSelectStock: (ticker: string) => void;
  onOptionStrategy?: (ticker: string) => void;
  watchlistOnly?: boolean;
}

export default function ResultsTable({ stocks, onSelectStock, onOptionStrategy, watchlistOnly }: ResultsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [hoveredTicker, setHoveredTicker] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());

  // Watchlist filter
  const wl = isInWatchlist;
  const displayStocks = useMemo(() => {
    let data = watchlistOnly ? stocks.filter((s) => wl(s.ticker)) : stocks;
    data = [...data].sort((a, b) => {
      // FAZ 1: rankingScore özel handle (fallback to score)
      if (sortKey === "rankingScore") {
        const av = (a.rankingScore ?? a.score);
        const bv = (b.rankingScore ?? b.score);
        return sortDir === "asc" ? av - bv : bv - av;
      }
      let av: number | string = a[sortKey];
      let bv: number | string = b[sortKey];
      if (typeof av === "string") {
        return sortDir === "asc" ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      }
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return data;
  }, [stocks, sortKey, sortDir, watchlistOnly, favorites]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="text-slate-600 text-[10px]">⇅</span>;
    return sortDir === "asc"
      ? <ArrowUp className="w-3 h-3 text-cyan-400" />
      : <ArrowDown className="w-3 h-3 text-cyan-400" />;
  };

  // Trend icon based on price structure
  const getTrendIcon = (stock: StockResult) => {
    if (stock.structureScore >= 70) return <ArrowUpRight className="w-4 h-4 text-emerald-400" aria-label="Higher Highs / Higher Lows" />;
    if (stock.structureScore <= 30) return <ArrowDownRight className="w-4 h-4 text-red-400" aria-label="Lower Highs / Lower Lows" />;
    return <Minus className="w-4 h-4 text-slate-500" aria-label="Karışık trend" />;
  };

  const getSignalBadge = (signal: string) => {
    // v4.1 signal renkleri — scoreConfig'ten senkronize
    switch (signal) {
      case "OVERBOUGHT_RED":
        return { bg: "bg-red-500", text: "text-white", border: "border-red-500", icon: <AlertTriangle className="w-3 h-3 mr-1" /> };
      case "CAUTION_HOT":
        return { bg: "bg-orange-500", text: "text-white", border: "border-orange-500", icon: <AlertTriangle className="w-3 h-3 mr-1" /> };
      case "OVERSOLD_CAUTION":
        return { bg: "bg-amber-500", text: "text-white", border: "border-amber-500", icon: null };
      case "STRONG_BUY":
        return { bg: "bg-emerald-500", text: "text-white", border: "border-emerald-500", icon: null };
      case "BUY":
        return { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30", icon: null };
      case "NEUTRAL_BULLISH":
        return { bg: "bg-teal-500/20", text: "text-teal-400", border: "border-teal-500/30", icon: null };
      case "NEUTRAL":
        return { bg: "bg-slate-500/20", text: "text-slate-400", border: "border-slate-500/30", icon: null };
      case "NEUTRAL_BEARISH":
        return { bg: "bg-slate-600/20", text: "text-slate-500", border: "border-slate-600/30", icon: null };
      case "WEAK":
        return { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30", icon: null };
      default:
        return { bg: "bg-slate-500/20", text: "text-slate-400", border: "border-slate-500/30", icon: null };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-400";
    if (score >= 60) return "text-teal-400";
    if (score >= 45) return "text-cyan-400";
    return "text-slate-400";
  };

  if (displayStocks.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg">{watchlistOnly ? "İzleme listesi boş" : "Momentum sinyali bulunamadı"}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm">
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          {watchlistOnly ? "İzleme Listesi" : "Momentum Sinyalleri"}
        </h2>
        <span className="text-sm text-slate-500">{displayStocks.length} hisse</span>
      </div>

      <div className="overflow-x-auto relative">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50 text-left">
              <th className="px-3 py-3"></th>
              {[
                { key: "ticker" as SortKey, label: "Hisse", icon: null },
                { key: "score" as SortKey, label: "Momentum", icon: <Activity className="w-3 h-3" /> },
                { key: "rankingScore" as SortKey, label: "Rank", icon: <TrendingUp className="w-3 h-3" /> },
                { key: "signal" as SortKey, label: "Sinyal", icon: null },
                { key: "priceChangePct" as SortKey, label: "Değişim", icon: <ArrowUp className="w-3 h-3" /> },
                { key: "volumeRatio" as SortKey, label: "Hacim", icon: <Volume2 className="w-3 h-3" /> },
                { key: "rsi" as SortKey, label: "RSI", icon: <Activity className="w-3 h-3" /> },
                // v4.2: Çift yönlü sütunlar
                { key: "score" as SortKey, label: "Bear", icon: <ArrowDown className="w-3 h-3" /> },
                { key: "score" as SortKey, label: "PDT", icon: <Activity className="w-3 h-3" /> },
              ].map((col) => (
                <th key={col.key + col.label}
                  className="px-3 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white select-none"
                  onClick={() => toggleSort(col.key)}>
                  <div className="flex items-center gap-1">
                    {col.icon}
                    {col.label}
                    <SortIcon col={col.key} />
                  </div>
                </th>
              ))}
              <th className="px-3 py-3 text-xs font-medium text-slate-400 text-center">Trend</th>
              <th className="px-3 py-3 text-xs font-medium text-slate-400 text-center">Detay</th>
              {onOptionStrategy && (
                <th className="px-3 py-3 text-xs font-medium text-slate-400 text-center">Opsiyon</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {displayStocks.map((stock, index) => {
              const isPositive = stock.priceChangePct >= 0;
              const isFav = isInWatchlist(stock.ticker);

              return (
                <tr key={stock.ticker}
                  className="hover:bg-slate-700/20 transition-colors cursor-pointer group"
                  onClick={() => onSelectStock(stock.ticker)}
                  onMouseEnter={() => setHoveredTicker(stock.ticker)}
                  onMouseLeave={() => setHoveredTicker(null)}>

                  {/* Favorite star */}
                  <td className="px-2 py-3">
                    <button
                      className={`transition-all ${isFav ? "text-amber-400" : "text-slate-600 opacity-0 group-hover:opacity-100"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isFav) removeFromWatchlist(stock.ticker);
                        else addToWatchlist(stock.ticker);
                        setFavorites(new Set()); // force refresh
                      }}>
                      <Star className={`w-4 h-4 ${isFav ? "fill-amber-400" : ""}`} />
                    </button>
                  </td>

                  {/* Ticker + name */}
                  <td className="px-3 py-3 relative">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-5">{index + 1}</span>
                      <div>
                        <div className="font-semibold text-white text-sm">{stock.ticker}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[100px]">{stock.name}</div>
                      </div>
                    </div>
                    {/* Radar tooltip on hover */}
                    {hoveredTicker === stock.ticker && (
                      <div className="absolute left-full top-0 z-50 ml-2">
                        <RadarTooltip stock={stock} />
                      </div>
                    )}
                  </td>

                  {/* Momentum Score */}
                  <td className="px-3 py-3 text-center">
                    <span className={`text-lg font-bold ${getScoreColor(stock.score)}`}>{stock.score}</span>
                    <div className="w-10 h-1 bg-slate-700 rounded-full mt-0.5 overflow-hidden mx-auto">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${stock.score}%` }} />
                    </div>
                  </td>

                  {/* Ranking Score */}
                  <td className="px-3 py-3 text-center">
                    <span className={`text-sm font-bold ${getScoreColor(stock.rankingScore ?? stock.score)}`}>
                      {stock.rankingScore ?? stock.score}
                    </span>
                    {stock.dataQuality && (
                      <div className={`text-[9px] font-medium mt-0.5 ${
                        stock.dataQuality === "GOOD" ? "text-emerald-500" :
                        stock.dataQuality === "FAIR" ? "text-amber-500" : "text-red-500"
                      }`}>
                        {stock.dataQuality === "GOOD" ? "\u2713" : stock.dataQuality === "FAIR" ? "~" : "!"}
                      </div>
                    )}
                  </td>

                  {/* Signal — v4.1: OVERBOUGHT_RED/CAUTION_HOT desteği */}
                  <td className="px-3 py-3 text-center">
                    {(() => {
                      const badge = getSignalBadge(stock.signal);
                      return (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ${badge.bg} ${badge.text} border ${badge.border}`}>
                          {badge.icon}
                          {signalLabel(stock.signal)}
                        </span>
                      );
                    })()}
                    {/* RSI RED uyarı ikonu */}
                    {stock.rsiWarning && (
                      <div className="mt-1">
                        <span className="text-[9px] text-red-400 font-medium" title={stock.rsiWarning}>RED</span>
                      </div>
                    )}
                  </td>

                  {/* Price Change */}
                  <td className="px-3 py-3">
                    <div className={`flex items-center gap-1 ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                      {isPositive ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                      <span className="text-sm font-medium">{isPositive ? "+" : ""}{stock.priceChangePct.toFixed(2)}%</span>
                    </div>
                  </td>

                  {/* Volume Bar */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${stock.volumeRatio >= 3 ? "bg-emerald-500" : stock.volumeRatio >= 2 ? "bg-teal-500" : stock.volumeRatio >= 1.5 ? "bg-cyan-500" : "bg-blue-500"}`}
                          style={{ width: `${Math.min(stock.volumeRatio * 20, 100)}%` }} />
                      </div>
                      <span className={`text-xs font-medium ${stock.volumeRatio >= 2 ? "text-emerald-400" : "text-slate-400"}`}>
                        {stock.volumeRatio.toFixed(1)}x
                      </span>
                    </div>
                  </td>

                  {/* RSI */}
                  <td className="px-3 py-3 text-center">
                    <span className={`text-sm font-medium ${stock.rsi >= 70 ? "text-amber-400" : stock.rsi >= 55 ? "text-emerald-400" : "text-slate-400"}`}>
                      {stock.rsi.toFixed(1)}
                    </span>
                  </td>

                  {/* v4.2: Bear Skoru */}
                  <td className="px-3 py-3 text-center">
                    <span className={`text-sm font-medium ${(stock.bearScore ?? 0) >= 60 ? "text-red-400" : (stock.bearScore ?? 0) >= 45 ? "text-orange-400" : "text-slate-500"}`}>
                      {stock.bearScore ?? "—"}
                    </span>
                    {stock.bearSignal && (stock.bearSignal === "STRONG_SELL" || stock.bearSignal === "SELL") && (
                      <div className="text-[9px] text-red-400 mt-0.5">{stock.bearSignal === "STRONG_SELL" ? "🔴" : "🟠"}</div>
                    )}
                  </td>

                  {/* v4.2: PDT Persistence Badge */}
                  <td className="px-3 py-3 text-center">
                    {(stock.persistenceScore !== undefined) ? (
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        (stock.isT1Suitable ?? false)
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/15 text-red-400 border border-red-500/20"
                      }`}>
                        {(stock.isT1Suitable ?? false) ? "✓" : "✗"} {stock.persistenceScore}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>

                  {/* Trend Icon */}
                  <td className="px-3 py-3 text-center">
                    {getTrendIcon(stock)}
                  </td>

                  {/* Detail button */}
                  <td className="px-3 py-3 text-center">
                    <button className="p-1.5 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                      onClick={(e) => { e.stopPropagation(); onSelectStock(stock.ticker); }}>
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>

                  {/* Option button */}
                  {onOptionStrategy && (
                    <td className="px-3 py-3 text-center">
                      <button className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        onClick={(e) => { e.stopPropagation(); onOptionStrategy(stock.ticker); }}
                        title="Opsiyon Stratejisi">
                        <TrendingUp className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
