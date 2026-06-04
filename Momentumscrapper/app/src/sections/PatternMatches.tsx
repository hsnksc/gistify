import type { PatternMatch } from "@/lib/patternEngine";
import { Brain, CheckCircle, AlertTriangle } from "lucide-react";

interface PatternMatchesProps {
  matches: PatternMatch[];
  onSelectStock: (ticker: string) => void;
}

export default function PatternMatches({ matches, onSelectStock }: PatternMatchesProps) {
  if (matches.length === 0) return null;

  return (
    <div className="mb-6 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-white">AI Pattern Eşleşmeleri</h2>
        <span className="text-sm text-slate-400">({matches.length} hisse)</span>
      </div>

      <p className="text-sm text-slate-400 mb-4">
        Geçmiş 1 aylık verilerde, ilk 30dk artışının gün boyu devam ettiği günlerin pattern'leri ile
        bugünkü hisseler karşılaştırıldı. Yüksek benzerlik gösteren hisseler opsiyon stratejisi için uygun.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {matches.slice(0, 9).map((match) => {
          const isHigh = match.confidence === "HIGH";
          const isMedium = match.confidence === "MEDIUM";

          return (
            <div
              key={match.ticker}
              className={`bg-slate-900/50 border rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                isHigh
                  ? "border-emerald-500/30 hover:border-emerald-500/50"
                  : isMedium
                  ? "border-amber-500/30 hover:border-amber-500/50"
                  : "border-slate-600/30 hover:border-slate-500/50"
              }`}
              onClick={() => onSelectStock(match.ticker)}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-bold text-white text-lg">{match.ticker}</span>
                  <span className="text-xs text-slate-500 ml-2">{match.name}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    isHigh
                      ? "bg-emerald-500/20 text-emerald-400"
                      : isMedium
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-slate-500/20 text-slate-400"
                  }`}
                >
                  {match.confidence}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center">
                  <p className="text-xs text-slate-500">Benzerlik</p>
                  <p className={`text-sm font-bold ${match.similarityScore >= 70 ? "text-emerald-400" : "text-purple-400"}`}>
                    {match.similarityScore}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">Devam Oranı</p>
                  <p className="text-sm font-bold text-cyan-400">%{match.historicalContinuationRate}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">Momentum</p>
                  <p className="text-sm font-bold text-teal-400">{match.todayScore}</p>
                </div>
              </div>

              {/* Mini factor indicators */}
              <div className="flex flex-wrap gap-1">
                {match.matchingFactors.slice(0, 3).map((f, i) => (
                  <span key={i} className={`text-xs px-1.5 py-0.5 rounded ${
                    f.startsWith("✓") ? "bg-emerald-500/10 text-emerald-400" :
                    f.startsWith("△") ? "bg-amber-500/10 text-amber-400" :
                    "bg-red-500/10 text-red-400"
                  }`}>
                    {f.slice(2).split(" - ")[0]}
                  </span>
                ))}
              </div>

              <div className="mt-2 text-xs text-purple-400 font-medium">
                {isHigh && <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {match.recommendation}</span>}
                {isMedium && <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {match.recommendation}</span>}
                {!isHigh && !isMedium && <span>{match.recommendation}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
