import { Search, Target, Globe } from "lucide-react";

interface StatsCardsProps {
  totalScanned: number;
  totalMatches: number;
  marketStatus: string;
}

export default function StatsCards({
  totalScanned,
  totalMatches,
  marketStatus,
}: StatsCardsProps) {
  const isOpen = marketStatus === "OPEN";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 rounded-lg">
            <Search className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Taranan Hisse</p>
            <p className="text-2xl font-bold text-white">{totalScanned}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-lg">
            <Target className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Momentum Sinyali</p>
            <p className="text-2xl font-bold text-emerald-400">{totalMatches}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${isOpen ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
            <Globe className={`w-5 h-5 ${isOpen ? "text-emerald-400" : "text-amber-400"}`} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Piyasa Durumu</p>
            <div className="flex items-center gap-2">
              <p className={`text-lg font-bold ${isOpen ? "text-emerald-400" : "text-amber-400"}`}>
                {isOpen ? "AÇIK" : "KAPALI"}
              </p>
              <span className={`w-2.5 h-2.5 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
