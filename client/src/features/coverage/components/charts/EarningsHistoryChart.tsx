import { type AppLanguage, t } from "@/lib/i18n";

import { cn } from "@/lib/utils";

export interface EarningsHistoryChartProps {
  data: Array<{
    donem: string;
    epsGercek?: number;
    epsTahmin?: number;
    surpriz?: number;
  }>;
  language?: AppLanguage;
}

// Validated against the dark surface (#0a0e1a).
const BEAT_COLOR = "#059669";
const MISS_COLOR = "#f43f5e";
const INLINE_COLOR = "#0284c7";

// Bar with a 4px rounded data-end and a square baseline; handles negative values.
const barPath = (x: number, value: number, width: number, scaleY: (v: number) => number) => {
  const yZero = scaleY(0);
  const yVal = scaleY(value);
  const top = Math.min(yZero, yVal);
  const bottom = Math.max(yZero, yVal);
  const r = Math.min(4, width / 2, bottom - top);
  if (r <= 0) return "";
  if (value >= 0) {
    return `M ${x} ${bottom} L ${x} ${top + r} Q ${x} ${top} ${x + r} ${top} L ${x + width - r} ${top} Q ${x + width} ${top} ${x + width} ${top + r} L ${x + width} ${bottom} Z`;
  }
  return `M ${x} ${top} L ${x} ${bottom - r} Q ${x} ${bottom} ${x + r} ${bottom} L ${x + width - r} ${bottom} Q ${x + width} ${bottom} ${x + width} ${bottom - r} L ${x + width} ${top} Z`;
};

export default function EarningsHistoryChart({
  data,
  language = "en",
}: EarningsHistoryChartProps) {
  if (data.length === 0) return null;

  const allValues = data.flatMap(d => [d.epsTahmin ?? 0, d.epsGercek ?? 0]);
  // Bars encode length, so the scale always includes zero.
  const minVal = Math.min(0, ...allValues) * 1.1;
  const maxVal = Math.max(0, ...allValues) * 1.1;
  const range = maxVal - minVal || 1;

  const padding = { top: 50, right: 20, bottom: 50, left: 50 };
  const width = 600;
  const height = 280;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const scaleY = (val: number) =>
    padding.top + chartH - ((val - minVal) / range) * chartH;

  const slotW = chartW / data.length;
  const barWidth = Math.min(24, slotW * 0.32);
  const innerGap = 3; // ≈2px rendered surface gap between the pair
  const pairW = barWidth * 2 + innerGap;

  const ticks = 4;
  const yTicks = Array.from(
    { length: ticks + 1 },
    (_, i) => minVal + (i * range) / ticks
  );

  return (
    <div className="space-y-3 rounded-xl border border-border bg-background/30 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {t("coverage:earningsHistory")}
      </p>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full max-w-[600px]"
        >
          {/* Gridlines: recessive solid hairlines */}
          {yTicks.map((tick, i) => (
            <line
              key={`gy-${i}`}
              x1={padding.left}
              y1={scaleY(tick)}
              x2={padding.left + chartW}
              y2={scaleY(tick)}
              stroke="currentColor"
              strokeWidth="1"
              className="text-border/40"
            />
          ))}

          {/* Zero baseline */}
          <line
            x1={padding.left}
            y1={scaleY(0)}
            x2={padding.left + chartW}
            y2={scaleY(0)}
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-muted-foreground/60"
          />

          {data.map((d, i) => {
            const xBase = padding.left + i * slotW + (slotW - pairW) / 2;
            const pairCenter = xBase + pairW / 2;
            const beat = (d.epsGercek ?? 0) > (d.epsTahmin ?? 0);
            const miss = (d.epsGercek ?? 0) < (d.epsTahmin ?? 0);

            return (
              <g key={i}>
                {/* Estimate bar (de-emphasis) */}
                {d.epsTahmin !== undefined && (
                  <path
                    d={barPath(xBase, d.epsTahmin, barWidth, scaleY)}
                    className="fill-zinc-500/30"
                  >
                    <title>{`${d.donem} · ${t("coverage:estimate")}: ${d.epsTahmin.toFixed(2)}`}</title>
                  </path>
                )}
                {/* Actual bar */}
                {d.epsGercek !== undefined && (
                  <path
                    d={barPath(
                      xBase + barWidth + innerGap,
                      d.epsGercek,
                      barWidth,
                      scaleY
                    )}
                    fill={beat ? BEAT_COLOR : miss ? MISS_COLOR : INLINE_COLOR}
                  >
                    <title>{`${d.donem} · ${t("coverage:actual")}: ${d.epsGercek.toFixed(2)}`}</title>
                  </path>
                )}
                {/* Surprise % above the pair */}
                {d.surpriz !== undefined && (
                  <text
                    x={pairCenter}
                    y={padding.top - 10}
                    textAnchor="middle"
                    className={cn(
                      "fill-current text-[10px] font-semibold",
                      d.surpriz > 0 ? "text-emerald-400" : "text-rose-400"
                    )}
                  >
                    {d.surpriz > 0 ? "+" : ""}
                    {d.surpriz.toFixed(1)}%
                  </text>
                )}
                {/* X label */}
                <text
                  x={pairCenter}
                  y={padding.top + chartH + 18}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px]"
                >
                  {d.donem}
                </text>
              </g>
            );
          })}

          {/* Y labels */}
          {yTicks.map((tick, i) => (
            <text
              key={`yt-${i}`}
              x={padding.left - 8}
              y={scaleY(tick) + 4}
              textAnchor="end"
              className="fill-muted-foreground text-[10px]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {tick.toFixed(2)}
            </text>
          ))}

          {/* Legend */}
          <g transform={`translate(${padding.left + 10}, 18)`}>
            <rect x="0" y="0" width="10" height="10" rx="2" className="fill-zinc-500/30" />
            <text x="16" y="9" className="fill-muted-foreground text-[9px]">
              {t("coverage:estimate")}
            </text>
            <rect x="70" y="0" width="10" height="10" rx="2" fill={BEAT_COLOR} />
            <text x="86" y="9" className="fill-muted-foreground text-[9px]">
              {t("coverage:actual")}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
