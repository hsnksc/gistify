import { useState, useEffect, useCallback } from "react";
import type { QueryResult } from "@/lib/stockDatabase";
import { queryTopStocks, querySingleStock, queryDatabaseStats, processTextQuery } from "@/lib/queryEngine";
import { runDailyScan, isTodayScanned, markTodayScanned } from "@/lib/dailyScanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Database, Search, Zap, TrendingUp, TrendingDown, Loader2,
  Trash2, RefreshCw, AlertTriangle, ChevronDown, ChevronUp,
  Star, BarChart3, Shield, Award, Activity, ArrowUpRight
} from "lucide-react";

export default function StockDatabasePanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QueryResult[]>([]);
  const [singleResult, setSingleResult] = useState<QueryResult | null>(null);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof queryDatabaseStats>> | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState({ current: 0, total: 0, ticker: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [showReasons, setShowReasons] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"COMPOSITE" | "PROBABILITY" | "PEAD_SCORE" | "HISTORICAL_WR">("COMPOSITE");
  const [todayScanned, setTodayScanned] = useState(false);

  // Bugün taranmış mı kontrol et
  useEffect(() => {
    isTodayScanned().then(setTodayScanned);
    loadStats();
  }, []);

  const loadStats = async () => {
    const s = await queryDatabaseStats();
    setStats(s);
  };

  const handleDailyScan = async () => {
    setIsScanning(true);
    setMessage(null);
    setScanProgress({ current: 0, total: 0, ticker: "" });

    try {
      const result = await runDailyScan((current, total, ticker) => {
        setScanProgress({ current, total, ticker });
      });

      markTodayScanned();
      setTodayScanned(true);

      setMessage(
        `${result.tickersScanned} hisse tarandı, ${result.gapUpFound} gap-up bulundu, ${result.strongContinuation} güçlü devam adayı, ${result.savedToDB} hisse veritabanına kaydedildi.`
      );

      await loadStats();

      // Tarama sonrası otomatik sorgula
      const topStocks = await queryTopStocks({ sortBy }, 20);
      setResults(topStocks);
      setSingleResult(null);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Tarama hatası");
    } finally {
      setIsScanning(false);
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) {
      // Boş sorgu = en iyi hisseler
      setIsQuerying(true);
      const res = await queryTopStocks({ sortBy }, 20);
      setResults(res);
      setSingleResult(null);
      setMessage(res.length > 0 ? `Olasılığı en yüksek ${res.length} hisse gösteriliyor.` : "Veritabanı boş. Önce günlük tarama yapın.");
      setIsQuerying(false);
      return;
    }

    setIsQuerying(true);
    setMessage(null);

    try {
      const response = await processTextQuery(query);
      setMessage(response.message);

      if (response.type === "LIST" && response.results) {
        setResults(response.results);
        setSingleResult(null);
      } else if (response.type === "SINGLE") {
        setSingleResult(response.singleResult || null);
        setResults([]);
      } else if (response.type === "STATS" && response.stats) {
        setStats(response.stats);
        setResults([]);
        setSingleResult(null);
      }
    } catch (e) {
      setMessage("Sorgu hatası: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setIsQuerying(false);
    }
  };

  const handleQuickQuery = async (type: "top" | "strong" | "all") => {
    setIsQuerying(true);
    const filter = type === "strong"
      ? { minPeadScore: 60, minContinuationProb: 50, sortBy }
      : type === "top"
      ? { minPeadScore: 45, sortBy }
      : { sortBy };

    const res = await queryTopStocks(filter, 20);
    setResults(res);
    setSingleResult(null);
    setMessage(`${res.length} hisse bulundu.`);
    setIsQuerying(false);
  };

  const getSignalColor = (signal: string) => {
    if (signal === "STRONG_CONTINUATION") return "bg-emerald-500 text-white";
    if (signal === "CONTINUATION") return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    if (signal === "NEUTRAL") return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
    return "bg-red-500/20 text-red-400 border border-red-500/30";
  };

  const getSignalLabel = (s: string) =>
    s === "STRONG_CONTINUATION" ? "GÜÇLÜ DEVAM" :
    s === "CONTINUATION" ? "DEVAM" :
    s === "NEUTRAL" ? "NÖTR" :
    s === "FADE" ? "GERİ ÇEKİLME" :
    "GÜÇLÜ GERİ ÇEKİLME";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            Hisse Veritabanı &amp; Sorgulama
          </h2>
          <p className="text-sm text-slate-400">
            {stats
              ? `${stats.totalStocks} hisse (${stats.activeStocks} aktif) | ${stats.totalDailyScans} tarama kaydı`
              : "Veritabanı yükleniyor..."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {todayScanned ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
              <Shield className="w-3 h-3" /> Bugün tarandı
            </span>
          ) : (
            <span className="text-xs text-amber-400 flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
              <AlertTriangle className="w-3 h-3" /> Tarama gerekli
            </span>
          )}
          <Button
            onClick={handleDailyScan}
            disabled={isScanning}
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl"
          >
            {isScanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            {isScanning ? "Taranıyor..." : "Günlük Tara"}
          </Button>
        </div>
      </div>

      {/* Tarama Progress */}
      {isScanning && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{scanProgress.current} / {scanProgress.total} — {scanProgress.ticker || "başlatılıyor..."}</span>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-xl text-sm ${
          message.includes("hata") || message.includes("HATA") || message.includes("boş")
            ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
            : "bg-blue-500/10 border border-blue-500/30 text-blue-400"
        }`}>
          {message}
        </div>
      )}

      {/* Sorgu */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleQuery()}
            placeholder="'sorgula', 'AAPL', veya 'istatistik' yazın..."
            className="flex-1 bg-slate-800/50 border-slate-700 text-white"
          />
          <Button onClick={handleQuery} disabled={isQuerying} className="bg-blue-500 hover:bg-blue-400 text-white px-5">
            {isQuerying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Sorgula
          </Button>
        </div>

        {/* Quick filters */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleQuickQuery("top")} className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
            En İyi 20
          </button>
          <button onClick={() => handleQuickQuery("strong")} className="px-3 py-1.5 bg-emerald-900/20 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/20 transition-all">
            Güçlü Devam
          </button>
          <button onClick={() => handleQuickQuery("all")} className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
            Tümü
          </button>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value as typeof sortBy); handleQuery(); }}
            className="bg-slate-800/50 border border-slate-700 rounded-lg text-xs text-slate-400 px-2 py-1.5"
          >
            <option value="COMPOSITE">Composite Sıralama</option>
            <option value="PROBABILITY">Devam Olasılığı</option>
            <option value="PEAD_SCORE">PEAD Skor</option>
            <option value="HISTORICAL_WR">Geçmiş WR</option>
          </select>
        </div>
      </div>

      {/* Tekil Sonuç */}
      {singleResult && (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white">{singleResult.ticker}</h3>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSignalColor(singleResult.signal)}`}>
              {getSignalLabel(singleResult.signal)}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <Stat label="PEAD Skor" value={singleResult.peadScore} />
            <Stat label="Devam Olasılığı" value={`%${singleResult.continuationProbability}`} />
            <Stat label="Geçmiş WR" value={`%${singleResult.nextDayWinRate}`} />
            <Stat label="Gap %" value={`+${singleResult.gapPct}%`} />
          </div>
          <div className="space-y-1">
            {singleResult.reasons.map((r, i) => (
              <p key={i} className="text-xs text-slate-400 flex items-start gap-2">
                <ArrowUpRight className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" /> {r}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Liste Sonuçlar */}
      {results.length > 0 && (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Sorgu Sonuçları ({results.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800/50 text-left text-xs text-slate-400">
                  <th className="px-3 py-3">#</th>
                  <th className="px-3 py-3">Hisse</th>
                  <th className="px-3 py-3 text-center">PEAD</th>
                  <th className="px-3 py-3 text-center">Devam %</th>
                  <th className="px-3 py-3 text-center">Geçmiş WR</th>
                  <th className="px-3 py-3 text-center">Gap</th>
                  <th className="px-3 py-3 text-center">RVOL</th>
                  <th className="px-3 py-3 text-center">Sinyal</th>
                  <th className="px-3 py-3 text-center">Taranma</th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/20">
                {results.map((r) => (
                  <>
                    <tr key={r.ticker} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-3 py-3">
                        <span className={`text-xs font-bold ${r.rank <= 3 ? "text-emerald-400" : "text-slate-500"}`}>
                          {r.rank}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div>
                          <div className="font-semibold text-white">{r.ticker}</div>
                          <div className="text-xs text-slate-500">{r.name}</div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`font-bold ${r.peadScore >= 75 ? "text-emerald-400" : r.peadScore >= 60 ? "text-teal-400" : "text-amber-400"}`}>
                          {r.peadScore}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`font-bold ${r.continuationProbability >= 60 ? "text-emerald-400" : r.continuationProbability >= 45 ? "text-teal-400" : "text-amber-400"}`}>
                          %{r.continuationProbability}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className={r.nextDayWinRate >= 60 ? "text-emerald-400" : r.nextDayWinRate >= 40 ? "text-amber-400" : "text-red-400"}>
                            %{r.nextDayWinRate}
                          </span>
                          <span className="text-[9px] text-slate-500">{r.historicalGapUps} örnek</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center text-cyan-400">+{r.gapPct.toFixed(1)}%</td>
                      <td className="px-3 py-3 text-center text-slate-400">{r.rvol.toFixed(1)}x</td>
                      <td className="px-3 py-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getSignalColor(r.signal)}`}>
                          {getSignalLabel(r.signal)}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center text-xs text-slate-500">{r.scanCount}x</td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => setShowReasons(showReasons === r.ticker ? null : r.ticker)}
                          className="p-1.5 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-600 hover:text-white transition-all"
                        >
                          {showReasons === r.ticker ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </td>
                    </tr>
                    {showReasons === r.ticker && (
                      <tr>
                        <td colSpan={10} className="px-4 py-3 bg-slate-900/30">
                          <div className="space-y-1">
                            {r.reasons.map((reason, i) => (
                              <p key={i} className="text-xs text-slate-400 flex items-start gap-2">
                                <ArrowUpRight className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" /> {reason}
                              </p>
                            ))}
                          </div>
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
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-2">
      <p className="text-[10px] text-slate-500">{label}</p>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  );
}
