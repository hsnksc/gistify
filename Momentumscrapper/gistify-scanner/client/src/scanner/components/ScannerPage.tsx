import { useState, useCallback, useEffect } from "react";
import {
  Radar, Loader2, Filter, Activity,
  Clock, ChevronDown, ChevronUp,
} from "lucide-react";
import { useScannerI18n } from "@/scanner/useScannerI18n";
import type { StockResult } from "@/scanner/types";
import { scoreColor, signalBg, signalLabel } from "@/scanner/lib/scoreConfig";
import { getScanTimingWarning } from "@/scanner/lib/momentum";
import { runMomentumScan } from "@/scanner";

interface ScannerPageProps {
  lang: "tr" | "en";
}

const DEFAULT_TICKERS = [
  "AAPL", "MSFT", "AMZN", "GOOGL", "NVDA", "META", "TSLA", "NFLX", "AMD", "AVGO",
  "CRM", "SNOW", "MRVL", "PLTR", "HOOD", "SOFI", "ACHR", "MU", "IREN", "RGTI",
  "QBTS", "IONQ", "BURL", "DLTR", "COST", "DKS", "INOD", "BKE", "FUTU", "LI",
  "NOK", "BB", "CCL", "F", "INTC", "PENN", "COIN", "ROKU", "SQ", "SHOP",
  "CRWD", "OKTA", "DOCU", "DDOG", "MDB", "NET", "FSLY", "DKNG", "ETSY", "PTON",
  "LCID", "RIVN", "NIO", "XPEV", "FSR", "PLUG", "ENPH", "SEDG", "RUN", "MAXN",
];

export default function ScannerPage({ lang }: ScannerPageProps) {
  const { t } = useScannerI18n(lang);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<StockResult[]>([]);
  const [scanResponse, setScanResponse] = useState<ScanResponse | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [minScore, setMinScore] = useState("45");
  const [filterSignal, setFilterSignal] = useState("ALL");
  const [sortKey, setSortKey] = useState<keyof StockResult>("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [error, setError] = useState<string | null>(null);
  const [timingWarning, setTimingWarning] = useState<string | null>(getScanTimingWarning());

  useEffect(() => {
    setTimingWarning(getScanTimingWarning());
    const interval = setInterval(() => setTimingWarning(getScanTimingWarning()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleScan = useCallback(async () => {
    setIsScanning(true);
    setError(null);
    setResults([]);
    setScanResponse(null);

    try {
      const response = await runMomentumScan(DEFAULT_TICKERS, {
        minScore: parseInt(minScore) || 45,
        signalFilter: filterSignal,
      });

      if (response && response.stocks) {
        setResults(response.stocks);
        setScanResponse(response);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setIsScanning(false);
    }
  }, [minScore, filterSignal]);

  const filtered = results
    .filter((r) => (filterSignal === "ALL" ? true : r.signal === filterSignal))
    .filter((r) => r.score >= (parseInt(minScore) || 0))
    .sort((a, b) => {
      const av = (a[sortKey] as number) ?? 0;
      const bv = (b[sortKey] as number) ?? 0;
      return sortDir === "asc" ? av - bv : bv - av;
    });

  const handleSort = (key: keyof StockResult) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Radar className="w-6 h-6 text-emerald-400" />
            {t("NASDAQ Momentum Tarama")}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t("Günün ilk yarım saatinde en güçlü momentum gösteren hisseler")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {timingWarning && (
            <span className="text-xs text-amber-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {timingWarning}
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4 space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          {/* Tara Butonu */}
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg transition-all"
          >
            {isScanning ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> {t("Taranıyor...")} ({results.length}/{DEFAULT_TICKERS.length})</>
            ) : (
              <><Radar className="w-4 h-4" /> {t("Tarama Yap")}</>
            )}
          </button>

          {/* Min Skor */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{t("Min Skor")}</label>
            <input
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              className="w-20 bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-sm"
              type="number"
              min="0"
              max="100"
            />
          </div>

          {/* Signal Filter */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{t("Sinyal")}</label>
            <div className="flex gap-1">
              {["ALL", "STRONG_BUY", "BUY", "NEUTRAL"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterSignal(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                    filterSignal === s
                      ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                      : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {s === "ALL" ? "Tümü" : t(s) || s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress */}
        {isScanning && (
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (results.length / DEFAULT_TICKERS.length) * 100)}%` }}
            />
          </div>
        )}

        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {filtered.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-slate-800/60 flex items-center justify-between">
            <span className="text-sm text-slate-400">
              {filtered.length} {t("hisse eşleşti")} | {t("Sonuçlar")}
            </span>
            <span className="text-xs text-slate-500">
              {scanResponse?.scanTime || ""}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/60">
                  {[
                    { key: "ticker" as keyof StockResult, label: t("Hisse") },
                    { key: "score" as keyof StockResult, label: t("Skor") },
                    { key: "signal" as keyof StockResult, label: t("Sinyal") },
                    { key: "currentPrice" as keyof StockResult, label: t("Fiyat") },
                    { key: "priceChangePct" as keyof StockResult, label: t("Değişim") },
                    { key: "rsi" as keyof StockResult, label: "RSI" },
                    { key: "volumeRatio" as keyof StockResult, label: t("RVOL") },
                    { key: "confidenceScore" as keyof StockResult, label: t("Güven") },
                  ].map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-3 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white text-left"
                    >
                      {col.label} {sortKey === col.key && (sortDir === "asc" ? "↑" : "↓")}
                    </th>
                  ))}
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((stock) => (
                  <>
                    <tr
                      key={stock.ticker}
                      className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-all cursor-pointer"
                      onClick={() => setExpandedRow(expandedRow === stock.ticker ? null : stock.ticker)}
                    >
                      <td className="px-3 py-3">
                        <span className="font-semibold text-white">{stock.ticker}</span>
                        <span className="text-xs text-slate-500 ml-2">{stock.name}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`font-bold ${scoreColor(stock.score)}`}>{stock.score}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium border ${signalBg(stock.signal)} text-white`}>
                          {signalLabel(stock.signal)}
                        </span>
                        {stock.rsiWarning && (
                          <span className="ml-2 text-[9px] text-red-400 font-medium">RED</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-300">${stock.currentPrice.toFixed(2)}</td>
                      <td className="px-3 py-3">
                        <span className={`text-sm font-medium ${stock.priceChangePct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {stock.priceChangePct >= 0 ? "+" : ""}{stock.priceChangePct.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-400">{stock.rsi.toFixed(1)}</td>
                      <td className="px-3 py-3 text-sm text-slate-400">{stock.volumeRatio.toFixed(2)}x</td>
                      <td className="px-3 py-3">
                        <span className={`text-xs ${
                          (stock.confidenceScore || 0) >= 80 ? "text-emerald-400" :
                          (stock.confidenceScore || 0) >= 50 ? "text-amber-400" : "text-red-400"
                        }`}>
                          {stock.confidenceScore || 0}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {expandedRow === stock.ticker
                          ? <ChevronUp className="w-4 h-4 text-slate-500" />
                          : <ChevronDown className="w-4 h-4 text-slate-500" />
                        }
                      </td>
                    </tr>
                    {expandedRow === stock.ticker && (
                      <tr>
                        <td colSpan={9} className="px-4 py-4 bg-slate-900/80">
                          <StockDetail stock={stock} lang={lang} t={t} />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {results.length > 0 && filtered.length === 0 && (
        <div className="text-center text-slate-500 py-12">
          <Filter className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p>{t("Eşleşen hisse bulunamadı")}</p>
          <p className="text-sm mt-1">{t("Filtreleri genişletmeyi dene")}</p>
        </div>
      )}
    </div>
  );
}

// ─── Stock Detail (Expanded Row) ───
function StockDetail({ stock, lang, t }: { stock: StockResult; lang: string; t: (k: string) => string }) {
  return (
    <div className="space-y-4">
      {/* Price Data */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-800/40 rounded-lg p-3">
          <p className="text-[10px] text-slate-500">{t("Güncel Fiyat")}</p>
          <p className="text-sm font-bold text-white">${stock.currentPrice.toFixed(2)}</p>
        </div>
        <div className="bg-slate-800/40 rounded-lg p-3">
          <p className="text-[10px] text-slate-500">{t("Günlük Değişim")}</p>
          <p className={`text-sm font-bold ${stock.priceChangePct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {stock.priceChangePct >= 0 ? "+" : ""}{stock.priceChangePct.toFixed(2)}%
          </p>
        </div>
        <div className="bg-slate-800/40 rounded-lg p-3">
          <p className="text-[10px] text-slate-500">ATR (14)</p>
          <p className="text-sm font-bold text-white">${stock.atr14d.toFixed(2)}</p>
        </div>
        <div className="bg-slate-800/40 rounded-lg p-3">
          <p className="text-[10px] text-slate-500">{t("Hedef Fiyat")}</p>
          <p className="text-sm font-bold text-emerald-400">${(stock.targetPrice || 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Score Explanations */}
      {stock.scoreExplanations && stock.scoreExplanations.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" /> {t("Skor Açıklamaları")}
          </h4>
          <div className="space-y-1.5">
            {stock.scoreExplanations.map((exp, i) => (
              <div key={i} className="flex items-start gap-3 text-xs p-2 rounded bg-slate-800/30">
                <span className="text-slate-500 w-24 flex-shrink-0">{exp.factor}</span>
                <span className={`font-medium ${scoreColor(exp.score)} w-10 text-right`}>{Math.round(exp.score * exp.weight)}</span>
                <span className="text-slate-400">{exp.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RSI Warning */}
      {stock.rsiWarning && (
        <div className={`rounded-lg p-3 border ${
          stock.signal === "OVERBOUGHT_RED" ? "bg-red-500/10 border-red-500/30" : "bg-orange-500/10 border-orange-500/30"
        }`}>
          <p className={`text-xs font-semibold ${stock.signal === "OVERBOUGHT_RED" ? "text-red-400" : "text-orange-400"}`}>
            {stock.signal === "OVERBOUGHT_RED" ? "🚨 AŞIRI ALIM" : "⚠️ SICAK BÖLGE"}
          </p>
          <p className="text-xs text-slate-400 mt-1">{stock.rsiWarning}</p>
        </div>
      )}
    </div>
  );
}
