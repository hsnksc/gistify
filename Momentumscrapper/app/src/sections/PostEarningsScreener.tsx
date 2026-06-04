import { useState, useCallback } from "react";
import type { PostEarningsMomentumResult, ContinuationPick } from "@/lib/earningsMomentum";
import { scanPostEarningsMomentum, getTopContinuationPicks } from "@/lib/earningsMomentum";
import { NASDAQ_TICKERS } from "@/lib/yahooFinance";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Loader2, Zap, TrendingUp, TrendingDown, Volume2,
  Target, ArrowUpRight, ArrowDownRight, Minus,
  ChevronDown, ChevronUp, AlertTriangle, Star,
  BarChart3, Calendar, Clock, Award, Brain
} from "lucide-react";

export default function PostEarningsScreener() {
  const [results, setResults] = useState<PostEarningsMomentumResult[]>([]);
  const [picks, setPicks] = useState<ContinuationPick[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, ticker: "" });
  const [error, setError] = useState<string | null>(null);
  const [useTop30, setUseTop30] = useState(true);
  const [showReasons, setShowReasons] = useState<string | null>(null);
  const [minGapPct, setMinGapPct] = useState(1);

  const handleScan = useCallback(async () => {
    setIsScanning(true);
    setError(null);
    setResults([]);
    setPicks([]);

    const tickers = useTop30 ? NASDAQ_TICKERS.slice(0, 30) : NASDAQ_TICKERS;
    setProgress({ current: 0, total: tickers.length, ticker: "" });

    try {
      const res = await scanPostEarningsMomentum(tickers, (current, total, ticker) => {
        setProgress({ current, total, ticker });
      });

      const filtered = res.filter((r) => r.gapPct >= minGapPct);
      setResults(filtered);
      setPicks(getTopContinuationPicks(filtered, 5));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Tarama hatası");
    } finally {
      setIsScanning(false);
    }
  }, [useTop30, minGapPct]);

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "STRONG_CONTINUATION": return "bg-emerald-500 text-white";
      case "CONTINUATION": return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "NEUTRAL": return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
      case "FADE": return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "STRONG_FADE": return "bg-red-500 text-white";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const getSignalLabel = (signal: string) => {
    switch (signal) {
      case "STRONG_CONTINUATION": return "GÜÇLÜ DEVAM";
      case "CONTINUATION": return "DEVAM";
      case "NEUTRAL": return "NÖTR";
      case "FADE": return "GERİ ÇEKİLME";
      case "STRONG_FADE": return "GÜÇLÜ GERİ ÇEKİLME";
      default: return signal;
    }
  };

  const confBadge = (c: string) => c === "HIGH"
    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
    : c === "MEDIUM"
    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
    : "bg-red-500/10 text-red-400 border border-red-500/20";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Gap-Up &amp; Next-Day Continuation Screener
          </h2>
          <p className="text-sm text-slate-400">
            Kazanç/haber sonrası gap-up yapan hisseleri bulur. Geçmiş next-day continuation oranına göre ertesi gün devam olasılığı hesaplar.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-slate-400">Min Gap %</Label>
            <select
              value={minGapPct}
              onChange={(e) => setMinGapPct(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-2 py-1"
            >
              <option value={1}>≥1%</option>
              <option value={2}>≥2%</option>
              <option value={3}>≥3%</option>
              <option value={5}>≥5%</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-slate-400">İlk 30</Label>
            <Switch checked={useTop30} onCheckedChange={setUseTop30} />
          </div>
          <Button
            onClick={handleScan}
            disabled={isScanning}
            className="bg-amber-500 hover:bg-amber-400 text-white px-5 py-2 rounded-xl"
          >
            {isScanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
            {isScanning ? "Taranıyor..." : "Gap-Up Tara"}
          </Button>
        </div>
      </div>

      {/* Progress */}
      {isScanning && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{progress.current} / {progress.total} — {progress.ticker}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Top Picks */}
      {picks.length > 0 && (
        <div className="bg-emerald-900/10 border border-emerald-500/30 rounded-xl p-4">
          <h3 className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            En İyi Next-Day Continuation Adayları ({picks.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {picks.map((pick) => (
              <div key={pick.ticker} className="bg-slate-900/50 border border-emerald-500/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">{pick.ticker}</span>
                  <span className="text-xs text-emerald-400">%{pick.continuationProbability} devam</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{pick.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              Gap-Up Hisse Sonuçları ({results.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800/50 text-left text-xs text-slate-400">
                  <th className="px-3 py-3">Hisse</th>
                  <th className="px-3 py-3 text-center">Gap %</th>
                  <th className="px-3 py-3 text-center">PEAD Skor</th>
                  <th className="px-3 py-3 text-center">Devam %</th>
                  <th className="px-3 py-3 text-center">Sinyal</th>
                  <th className="px-3 py-3 text-center">RVOL</th>
                  <th className="px-3 py-3 text-center">Gün İçi</th>
                  <th className="px-3 py-3 text-center">Geçmiş WR</th>
                  <th className="px-3 py-3 text-center">Detay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/20">
                {results.map((r) => (
                  <>
                    <tr key={r.ticker} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-3 py-3">
                        <div>
                          <div className="font-semibold text-white">{r.ticker}</div>
                          <div className="text-xs text-slate-500">{r.name}</div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`font-bold ${r.gapPct >= 5 ? "text-emerald-400" : r.gapPct >= 2 ? "text-teal-400" : "text-cyan-400"}`}>
                          +{r.gapPct.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`font-bold ${r.peadScore >= 75 ? "text-emerald-400" : r.peadScore >= 60 ? "text-teal-400" : "text-amber-400"}`}>
                            {r.peadScore}
                          </span>
                          <div className="w-10 h-1 bg-slate-700 rounded-full mt-0.5 overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${r.peadScore}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`font-bold ${r.continuationProbability >= 60 ? "text-emerald-400" : r.continuationProbability >= 45 ? "text-teal-400" : "text-amber-400"}`}>
                          %{r.continuationProbability}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ${getSignalColor(r.signal)}`}>
                          {getSignalLabel(r.signal)}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={r.rvol >= 2 ? "text-emerald-400 font-medium" : "text-slate-400"}>
                          {r.rvol.toFixed(1)}x
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`text-xs ${r.continuationPct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {r.continuationPct >= 0 ? "+" : ""}{r.continuationPct.toFixed(1)}%
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
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => setShowReasons(showReasons === r.ticker ? null : r.ticker)}
                          className="p-1.5 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-600 hover:text-white transition-all"
                        >
                          {showReasons === r.ticker ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                    {showReasons === r.ticker && (
                      <tr>
                        <td colSpan={9} className="px-4 py-3 bg-slate-900/30">
                          <div className="space-y-1">
                            {r.reasons.map((reason, i) => (
                              <p key={i} className="text-xs text-slate-400 flex items-start gap-2">
                                <ArrowUpRight className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                                {reason}
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

      {!isScanning && results.length === 0 && !error && (
        <div className="text-center py-12 text-slate-500">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Gap-Up Screener</p>
          <p className="text-sm">Bugün gap-up yapan hisseleri bulmak için "Gap-Up Tara" butonuna tıklayın.</p>
          <p className="text-xs mt-2 opacity-60">Kazanç açıklaması veya haber sonrası momentum yakalayan hisseleri tespit eder.</p>
        </div>
      )}
    </div>
  );
}
