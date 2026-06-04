import { useState } from "react";
import type { PatternDatabase, PatternMatch } from "@/lib/patternEngine";
import { trainPatterns, matchPatterns } from "@/lib/patternEngine";
import { NASDAQ_TICKERS } from "@/lib/yahooFinance";
import type { StockResult } from "@/types/scanner";
import { Button } from "@/components/ui/button";
import { Loader2, Brain, TrendingUp, Zap } from "lucide-react";

interface TrainingPanelProps {
  todayResults: StockResult[];
  onPatternMatches?: (matches: PatternMatch[]) => void;
}

export default function TrainingPanel({ todayResults, onPatternMatches }: TrainingPanelProps) {
  const [isTraining, setIsTraining] = useState(false);
  const [db, setDb] = useState<PatternDatabase | null>(null);
  const [progress, setProgress] = useState({ done: 0, total: 0, current: "" });
  const [error, setError] = useState<string | null>(null);

  const handleTrain = async () => {
    setIsTraining(true);
    setError(null);
    setDb(null);

    try {
      const database = await trainPatterns(NASDAQ_TICKERS, (done, total, current) => {
        setProgress({ done, total, current });
      });
      setDb(database);

      // Match patterns with today's results
      if (todayResults.length > 0) {
        const matches = matchPatterns(todayResults, database);
        onPatternMatches?.(matches);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Eğitim hatası");
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="mb-8 bg-slate-800/30 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          Pattern Recognition AI Eğitimi
        </h2>
        <Button
          onClick={handleTrain}
          disabled={isTraining}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white px-6 py-2 rounded-xl transition-all"
        >
          {isTraining ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Brain className="w-4 h-4 mr-2" />
          )}
          {isTraining ? "Eğitiliyor..." : db ? "Tekrar Eğit" : "1 Aylık Veri ile Eğit"}
        </Button>
      </div>

      <p className="text-sm text-slate-400 mb-4">
        Son 1 aylık verileri analiz ederek, ilk 30 dakikadaki artışın gün boyu devam ettiği pattern'leri öğrenir.
        Ardından bugünkü hisselerle karşılaştırarak opsiyon stratejileri önerir.
      </p>

      {/* Progress */}
      {isTraining && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-400 mb-1">
            <span>{progress.current}</span>
            <span>{progress.done} / {progress.total}</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-300"
              style={{ width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Training Results */}
      {db && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/30">
              <p className="text-xs text-slate-400">Analiz Edilen Hisse</p>
              <p className="text-xl font-bold text-white">{db.totalTickers}</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/30">
              <p className="text-xs text-slate-400">Toplam Gün</p>
              <p className="text-xl font-bold text-cyan-400">{db.totalDaysAnalyzed}</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/30">
              <p className="text-xs text-slate-400">Devam Oranı</p>
              <p className="text-xl font-bold text-emerald-400">%{db.overallContinuationRate}</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/30">
              <p className="text-xs text-slate-400">Optimal RSI</p>
              <p className="text-xl font-bold text-purple-400">{db.optimalRsiRange[0]}-{db.optimalRsiRange[1]}</p>
            </div>
          </div>

          {/* Learned Thresholds */}
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
            <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Öğrenilen Eşik Değerler (Devam Eden Günler İçin)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500">Ort. İlk 30dk Artış</p>
                <p className="text-lg font-semibold text-emerald-400">%{db.avgFirst30mWhenContinues}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Ort. Hacim Oranı</p>
                <p className="text-lg font-semibold text-cyan-400">{db.avgVolumeRatioWhenContinues}x</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Min. Hacim Oranı</p>
                <p className="text-lg font-semibold text-amber-400">{db.minVolumeRatioForContinuation}x</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Ort. Açılış Gap'i</p>
                <p className="text-lg font-semibold text-purple-400">%{db.avgGapWhenContinues}</p>
              </div>
            </div>
          </div>

          {/* Top Continuation Tickers */}
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
            <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              En İyi Devam Eden Hisseler
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-700/50">
                    <th className="py-2 px-2">Hisse</th>
                    <th className="py-2 px-2 text-center">Devam Oranı</th>
                    <th className="py-2 px-2 text-center">Gün</th>
                    <th className="py-2 px-2 text-center">Ort. İlk 30dk</th>
                    <th className="py-2 px-2 text-center">Ort. RSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/20">
                  {db.tickerPatterns.slice(0, 10).map((tp) => (
                    <tr key={tp.ticker} className="hover:bg-slate-700/20">
                      <td className="py-2 px-2">
                        <span className="font-medium text-white">{tp.ticker}</span>
                        <span className="text-xs text-slate-500 ml-2">{tp.name}</span>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span className={`font-medium ${tp.continuationRate >= 60 ? "text-emerald-400" : tp.continuationRate >= 40 ? "text-amber-400" : "text-slate-400"}`}>
                          %{Math.round(tp.continuationRate)}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center text-slate-400">{tp.totalDays}</td>
                      <td className="py-2 px-2 text-center text-cyan-400">%{tp.avgFirst30mChange.toFixed(2)}</td>
                      <td className="py-2 px-2 text-center text-purple-400">{tp.avgRsiOnContinuation.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
