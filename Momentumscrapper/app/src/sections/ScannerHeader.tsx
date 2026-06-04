import { TrendingUp, Activity, BarChart3 } from "lucide-react";

export default function ScannerHeader() {
  return (
    <header className="text-center mb-10">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
          <TrendingUp className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
          NASDAQ Momentum Scanner
        </h1>
      </div>
      <p className="text-slate-400 text-lg max-w-2xl mx-auto">
        Günün ilk yarım saatinde hacim ve momentumu en yüksek NASDAQ hisselerini
        yapay zeka destekli analiz ile keşfedin
      </p>
      <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-500">
        <div className="flex items-center gap-1.5">
          <Activity className="w-4 h-4" />
          <span>RSI Analizi</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4" />
          <span>MACD Sinyali</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4" />
          <span>VWAP Sapması</span>
        </div>
      </div>
    </header>
  );
}
