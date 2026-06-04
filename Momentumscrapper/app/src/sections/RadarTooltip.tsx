import { useMemo } from "react";
import type { StockResult } from "@/types/scanner";

interface RadarTooltipProps {
  stock: StockResult;
}

export default function RadarTooltip({ stock }: RadarTooltipProps) {
  // 9 Faktör Radar Chart (v3 düzeltmesi)
  const factors = useMemo(() => [
    { label: "RVOL", value: stock.rvolScore, color: "#3b82f6" },
    { label: "GAP", value: stock.gapScore, color: "#f59e0b" },
    { label: "ORB", value: stock.orbScore, color: "#a855f7" },
    { label: "VWAP", value: Math.min(100, Math.max(0, (stock.vwapDeviation + 2) * 25)), color: "#14b8a6" },
    { label: "Struct", value: stock.structureScore, color: "#06b6d4" },
    { label: "RSI", value: stock.rsiShortScore, color: "#ec4899" },
    { label: "Vel.Dir", value: stock.atrMomentumScore, color: "#f97316" },
    { label: "MktCap", value: stock.catalystScore, color: "#6366f1" },
    { label: "Retent", value: Math.round(Math.min(100, Math.max(0, 100 - (stock.opening30mHigh - stock.currentPrice) / stock.opening30mHigh * 100))), color: "#10b981" },
  ], [stock]);

  const size = 130;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 48;
  const count = factors.length;

  const points = factors.map((f, i) => {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    const r = (f.value / 100) * radius;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  });

  return (
    <div className="bg-slate-900/95 border border-slate-600/50 rounded-xl p-3 shadow-xl backdrop-blur-sm" style={{ width: 210 }}>
      <p className="text-xs font-medium text-white mb-1.5 text-center">{stock.ticker} — 9 Faktör</p>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
        {[25, 50, 75].map((pct) => {
          const r = (pct / 100) * radius;
          return <circle key={pct} cx={cx} cy={cy} r={r} fill="none" stroke="#334155" strokeWidth={0.5} />;
        })}
        {factors.map((_, i) => {
          const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
          return <line key={i} x1={cx} y1={cy} x2={cx + radius * Math.cos(angle)} y2={cy + radius * Math.sin(angle)} stroke="#334155" strokeWidth={0.5} />;
        })}
        <polygon points={points.join(" ")} fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth={1.2} />
        {factors.map((f, i) => {
          const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
          const r = (f.value / 100) * radius;
          return <circle key={i} cx={cx + r * Math.cos(angle)} cy={cy + r * Math.sin(angle)} r={1.8} fill={f.color} />;
        })}
      </svg>
      <div className="grid grid-cols-3 gap-x-1.5 gap-y-0.5 mt-1.5">
        {factors.map((f) => (
          <div key={f.label} className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
            <span className="text-[9px] text-slate-400">{f.label}:</span>
            <span className="text-[9px] text-white font-medium">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
