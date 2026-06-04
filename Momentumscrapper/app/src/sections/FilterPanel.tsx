import type { FilterState, RvolThreshold, SignalType, MarketCapCategory } from "@/lib/filters";
import { SECTORS } from "@/lib/filters";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

interface FilterPanelProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onReset: () => void;
  resultCount: number;
  totalCount: number;
}

export default function FilterPanel({ filters, onChange, onReset, resultCount, totalCount }: FilterPanelProps) {
  const update = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial });

  return (
    <div className="mb-6 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Filtreler</h3>
          <span className="text-xs text-slate-500">({resultCount} / {totalCount} gösteriliyor)</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} className="text-slate-400 hover:text-white h-7 px-2">
          <RotateCcw className="w-3.5 h-3.5 mr-1" /> Sıfırla
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Sector */}
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Sektör</label>
          <select
            value={filters.sector}
            onChange={(e) => update({ sector: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Min Score */}
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Min Skor: {filters.minScore}</label>
          <input
            type="range" min={0} max={100} step={5}
            value={filters.minScore}
            onChange={(e) => update({ minScore: Number(e.target.value) })}
            className="w-full accent-cyan-500 h-1.5"
          />
        </div>

        {/* RVOL */}
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Min RVOL</label>
          <select
            value={filters.rvolThreshold}
            onChange={(e) => update({ rvolThreshold: e.target.value as RvolThreshold })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Tümü</option>
            <option value="1">1x+</option>
            <option value="1.5">1.5x+</option>
            <option value="2">2x+</option>
            <option value="3">3x+</option>
          </select>
        </div>

        {/* Signal Type */}
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Sinyal</label>
          <select
            value={filters.signalType}
            onChange={(e) => update({ signalType: e.target.value as SignalType })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Tümü</option>
            <option value="STRONG_BUY">GÜÇLÜ AL</option>
            <option value="BUY">AL</option>
            <option value="NEUTRAL_BULLISH">NÖTR-YUKARI</option>
          </select>
        </div>

        {/* Market Cap */}
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Market Cap</label>
          <select
            value={filters.marketCap}
            onChange={(e) => update({ marketCap: e.target.value as MarketCapCategory })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Tümü</option>
            <option value="MEGA">Mega ($200B+)</option>
            <option value="LARGE">Large ($10-200B)</option>
            <option value="MID">Mid ($1-10B)</option>
          </select>
        </div>

        {/* RSI Range */}
        <div>
          <label className="text-xs text-slate-400 mb-1 block">RSI: {filters.rsiMin}-{filters.rsiMax}</label>
          <div className="flex items-center gap-1">
            <input
              type="range" min={0} max={100} step={5}
              value={filters.rsiMin}
              onChange={(e) => {
                const v = Number(e.target.value);
                update({ rsiMin: Math.min(v, filters.rsiMax) });
              }}
              className="w-full accent-cyan-500 h-1.5"
            />
            <input
              type="range" min={0} max={100} step={5}
              value={filters.rsiMax}
              onChange={(e) => {
                const v = Number(e.target.value);
                update({ rsiMax: Math.max(v, filters.rsiMin) });
              }}
              className="w-full accent-cyan-500 h-1.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
