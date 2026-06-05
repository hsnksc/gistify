import { Fragment, useCallback, useEffect, useState } from "react";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Clock,
  Filter,
  Loader2,
  Radar,
} from "lucide-react";
import { runMomentumScan } from "@/scanner";
import { useScannerI18n } from "@/scanner/useScannerI18n";
import { scoreColor, signalBg, signalLabel } from "@/scanner/lib/scoreConfig";
import { getScanTimingWarning } from "@/scanner/lib/momentum";
import type { ScanResponse, StockResult } from "@/scanner/types";
import OptionStrategyPanel from "./OptionStrategyPanel";

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

function getFilterLabel(signal: string, lang: "tr" | "en") {
  if (signal === "ALL") return lang === "en" ? "All" : "Tümü";
  if (signal === "STRONG_BUY") return lang === "en" ? "Strong Buy" : "Guclu Al";
  if (signal === "BUY") return lang === "en" ? "Buy" : "Al";
  if (signal === "NEUTRAL") return lang === "en" ? "Neutral" : "Notr";
  return signal;
}

export default function ScannerPage({ lang }: ScannerPageProps) {
  const { t } = useScannerI18n(lang);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<StockResult[]>([]);
  const [scanResponse, setScanResponse] = useState<ScanResponse | null>(null);
  const [scanProgress, setScanProgress] = useState({
    scanned: 0,
    total: DEFAULT_TICKERS.length,
    current: "",
  });
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [minScore, setMinScore] = useState("35");
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
    setScanProgress({
      scanned: 0,
      total: DEFAULT_TICKERS.length,
      current: "",
    });

    try {
      const response = await runMomentumScan(DEFAULT_TICKERS, {
        minScore: parseInt(minScore, 10) || 35,
        signalFilter: filterSignal,
        onProgress: (scanned, total, current) => {
          setScanProgress({ scanned, total, current });
        },
      });

      if (response?.stocks) {
        setResults(response.stocks);
        setScanResponse(response);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setIsScanning(false);
    }
  }, [filterSignal, minScore]);

  const filtered = results
    .filter((result) => (filterSignal === "ALL" ? true : result.signal === filterSignal))
    .filter((result) => result.score >= (parseInt(minScore, 10) || 0))
    .sort((a, b) => {
      const av = (a[sortKey] as number) ?? 0;
      const bv = (b[sortKey] as number) ?? 0;
      return sortDir === "asc" ? av - bv : bv - av;
    });

  const handleSort = (key: keyof StockResult) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
      return;
    }

    setSortKey(key);
    setSortDir("desc");
  };

  return (
    <div className="space-y-6 p-5 lg:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Radar className="h-6 w-6 text-emerald-400" />
            {t("NASDAQ Momentum Tarama")}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {t("Günün ilk yarım saatinde en güçlü momentum gösteren hisseler")}
          </p>
        </div>

        {timingWarning ? (
          <span className="flex items-center gap-1 text-xs text-amber-400">
            <Clock className="h-3.5 w-3.5" />
            {timingWarning}
          </span>
        ) : null}
      </div>

      <div className="space-y-4 rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
        <div className="flex flex-wrap items-end gap-4">
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 font-semibold text-white transition-all hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("Taranıyor...")} ({scanProgress.scanned}/{scanProgress.total})
              </>
            ) : (
              <>
                <Radar className="h-4 w-4" />
                {t("Tarama Yap")}
              </>
            )}
          </button>

          <div>
            <label className="mb-1 block text-xs text-slate-500">{t("Min Skor")}</label>
            <input
              value={minScore}
              onChange={(event) => setMinScore(event.target.value)}
              className="w-20 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white"
              type="number"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">{t("Sinyal")}</label>
            <div className="flex gap-1">
              {["ALL", "STRONG_BUY", "BUY", "NEUTRAL"].map((signal) => (
                <button
                  key={signal}
                  onClick={() => setFilterSignal(signal)}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                    filterSignal === signal
                      ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-300"
                      : "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {getFilterLabel(signal, lang)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isScanning ? (
          <div className="space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                style={{
                  width: `${Math.min(100, (scanProgress.scanned / scanProgress.total) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-slate-500">
              {scanProgress.current
                ? `${scanProgress.current} ${lang === "en" ? "is being analyzed" : "analiz ediliyor"}`
                : lang === "en"
                  ? "Universe is being scanned."
                  : "Tarama evreni isleniyor."}
            </p>
          </div>
        ) : null}

        {!isScanning && results.length === 0 && !error ? (
          <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  {lang === "en" ? "Premarket and opening-drive radar" : "Acilis ivmesi radar paneli"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {lang === "en"
                    ? "The scanner ranks 60 liquid names by momentum, volume expansion, structure and intraday retention."
                    : "Tarayici 60 likit hisseyi momentum, hacim patlamasi, yapi ve intraday retention ile siralar."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
                  {lang === "en" ? "Universe: 60 names" : "Evren: 60 hisse"}
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
                  {lang === "en" ? "Primary feed: Yahoo" : "Ana veri: Yahoo"}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        ) : null}
      </div>

      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-slate-800/60 bg-slate-900/60">
          <div className="flex items-center justify-between border-b border-slate-800/60 p-3">
            <span className="text-sm text-slate-400">
              {filtered.length} {t("hisse eşleşti")} | {t("Sonuçlar")}
            </span>
            <span className="text-xs text-slate-500">{scanResponse?.scanTime || ""}</span>
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
                  ].map((column) => (
                    <th
                      key={column.key}
                      onClick={() => handleSort(column.key)}
                      className="cursor-pointer px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400 hover:text-white"
                    >
                      {column.label} {sortKey === column.key && (sortDir === "asc" ? "↑" : "↓")}
                    </th>
                  ))}
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((stock) => (
                  <Fragment key={stock.ticker}>
                    <tr
                      className="cursor-pointer border-b border-slate-800/30 transition-all hover:bg-slate-800/30"
                      onClick={() => setExpandedRow(expandedRow === stock.ticker ? null : stock.ticker)}
                    >
                      <td className="px-3 py-3">
                        <span className="font-semibold text-white">{stock.ticker}</span>
                        <span className="ml-2 text-xs text-slate-500">{stock.name}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`font-bold ${scoreColor(stock.score)}`}>{stock.score}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex rounded border px-2 py-0.5 text-[10px] font-medium text-white ${signalBg(stock.signal)}`}>
                          {signalLabel(stock.signal)}
                        </span>
                        {stock.rsiWarning ? (
                          <span className="ml-2 text-[9px] font-medium text-red-400">RED</span>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-300">${stock.currentPrice.toFixed(2)}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`text-sm font-medium ${
                            stock.priceChangePct >= 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {stock.priceChangePct >= 0 ? "+" : ""}
                          {stock.priceChangePct.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-400">{stock.rsi.toFixed(1)}</td>
                      <td className="px-3 py-3 text-sm text-slate-400">{stock.volumeRatio.toFixed(2)}x</td>
                      <td className="px-3 py-3">
                        <span
                          className={`text-xs ${
                            (stock.confidenceScore || 0) >= 80
                              ? "text-emerald-400"
                              : (stock.confidenceScore || 0) >= 50
                                ? "text-amber-400"
                                : "text-red-400"
                          }`}
                        >
                          {stock.confidenceScore || 0}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {expandedRow === stock.ticker ? (
                          <ChevronUp className="h-4 w-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-500" />
                        )}
                      </td>
                    </tr>

                    {expandedRow === stock.ticker ? (
                      <tr>
                        <td colSpan={9} className="bg-slate-900/80 px-4 py-4">
                          <StockDetail stock={stock} t={t} />
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {results.length > 0 && filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-500">
          <Filter className="mx-auto mb-3 h-8 w-8 opacity-50" />
          <p>{t("Eşleşen hisse bulunamadı")}</p>
          <p className="mt-1 text-sm">{t("Filtreleri genişletmeyi dene")}</p>
        </div>
      ) : null}
    </div>
  );
}

function StockDetail({ stock, t }: { stock: StockResult; t: (key: string) => string }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-lg bg-slate-800/40 p-3">
          <p className="text-[10px] text-slate-500">{t("Güncel Fiyat")}</p>
          <p className="text-sm font-bold text-white">${stock.currentPrice.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-slate-800/40 p-3">
          <p className="text-[10px] text-slate-500">{t("Günlük Değişim")}</p>
          <p
            className={`text-sm font-bold ${
              stock.priceChangePct >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {stock.priceChangePct >= 0 ? "+" : ""}
            {stock.priceChangePct.toFixed(2)}%
          </p>
        </div>
        <div className="rounded-lg bg-slate-800/40 p-3">
          <p className="text-[10px] text-slate-500">ATR (14)</p>
          <p className="text-sm font-bold text-white">${stock.atr14d.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-slate-800/40 p-3">
          <p className="text-[10px] text-slate-500">{t("Hedef Fiyat")}</p>
          <p className="text-sm font-bold text-emerald-400">${(stock.targetPrice || 0).toFixed(2)}</p>
        </div>
      </div>

      {stock.scoreExplanations?.length ? (
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Activity className="h-3.5 w-3.5" />
            {t("Skor Açıklamaları")}
          </h4>
          <div className="space-y-1.5">
            {stock.scoreExplanations.map((explanation, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded bg-slate-800/30 p-2 text-xs"
              >
                <span className="w-24 flex-shrink-0 text-slate-500">{explanation.factor}</span>
                <span className={`w-10 text-right font-medium ${scoreColor(explanation.score)}`}>
                  {Math.round(explanation.score * explanation.weight)}
                </span>
                <span className="text-slate-400">{explanation.reason}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {stock.rsiWarning ? (
        <div
          className={`rounded-lg border p-3 ${
            stock.signal === "OVERBOUGHT_RED"
              ? "border-red-500/30 bg-red-500/10"
              : "border-orange-500/30 bg-orange-500/10"
          }`}
        >
          <p
            className={`text-xs font-semibold ${
              stock.signal === "OVERBOUGHT_RED" ? "text-red-400" : "text-orange-400"
            }`}
          >
            {stock.signal === "OVERBOUGHT_RED" ? "🚨 AŞIRI ALIM" : "⚠️ SICAK BÖLGE"}
          </p>
          <p className="mt-1 text-xs text-slate-400">{stock.rsiWarning}</p>
        </div>
      ) : null}

      <OptionStrategyPanel stock={stock} />
    </div>
  );
}
