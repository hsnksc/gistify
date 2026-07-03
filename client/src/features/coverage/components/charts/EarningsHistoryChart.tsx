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

export default function EarningsHistoryChart({
  data,
  language = "en",
}: EarningsHistoryChartProps) {
  if (data.length === 0) return null;

  const allValues = data.flatMap((d) => [
    d.epsTahmin ?? 0,
    d.epsGercek ?? 0,
  ]);
  const minVal = Math.min(...allValues) * 1.1;
  const maxVal = Math.max(...allValues) * 1.1;
  const range = maxVal - minVal || 1;

  const padding = { top: 50, right: 20, bottom: 50, left: 50 };
  const width = 600;
  const height = 280;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const scaleY = (val: number) =>
    padding.top + chartH - ((val - minVal) / range) * chartH;
  const barWidth = (chartW / data.length) * 0.35;
  const gap = (chartW / data.length) * 0.15;

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) =>
    minVal + (i * range) / ticks
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
          {/* Grid lines */}
          {yTicks.map((t, i) => (
            <line
              key={`gy-${i}`}
              x1={padding.left}
              y1={scaleY(t)}
              x2={padding.left + chartW}
              y2={scaleY(t)}
              stroke="currentColor"
              strokeWidth="1"
              className="text-border/40"
              strokeDasharray="2 2"
            />
          ))}

          {/* Zero line if in range */}
          {minVal <= 0 && maxVal >= 0 && (
            <line
              x1={padding.left}
              y1={scaleY(0)}
              x2={padding.left + chartW}
              y2={scaleY(0)}
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-muted-foreground/60"
            />
          )}

          {/* Axes */}
          <line
            x1={padding.left}
            y1={padding.top + chartH}
            x2={padding.left + chartW}
            y2={padding.top + chartH}
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-muted-foreground/50"
          />
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + chartH}
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-muted-foreground/50"
          />

          {/* Bars */}
          {data.map((d, i) => {
            const xBase = padding.left + (i * chartW) / data.length + gap / 2;
            const beat = (d.epsGercek ?? 0) > (d.epsTahmin ?? 0);
            const miss = (d.epsGercek ?? 0) < (d.epsTahmin ?? 0);

            return (
              <g key={i}>
                {/* Estimate bar (muted) */}
                {d.epsTahmin !== undefined && (
                  <rect
                    x={xBase}
                    y={scaleY(d.epsTahmin)}
                    width={barWidth}
                    height={scaleY(minVal) - scaleY(d.epsTahmin)}
                    rx="3"
                    className="fill-zinc-500/30"
                  />
                )}
                {/* Actual bar (solid) */}
                {d.epsGercek !== undefined && (
                  <rect
                    x={xBase + barWidth + gap / 4}
                    y={scaleY(d.epsGercek)}
                    width={barWidth}
                    height={scaleY(minVal) - scaleY(d.epsGercek)}
                    rx="3"
                    className={cn(
                      "fill-current",
                      beat
                        ? "text-emerald-400/70"
                        : miss
                          ? "text-rose-400/70"
                          : "text-sky-400/70"
                    )}
                  />
                )}
                {/* Surprise % */}
                {d.surpriz !== undefined && (
                  <text
                    x={xBase + barWidth + gap / 8}
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
                  x={xBase + barWidth + gap / 8}
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
          {yTicks.map((t, i) => (
            <text
              key={`yt-${i}`}
              x={padding.left - 8}
              y={scaleY(t) + 4}
              textAnchor="end"
              className="fill-muted-foreground text-[10px]"
            >
              {t.toFixed(2)}
            </text>
          ))}

          {/* Legend */}
          <g transform={`translate(${padding.left + 10}, 18)`}>
            <rect x="0" y="0" width="10" height="10" rx="2" className="fill-zinc-500/30" />
            <text x="16" y="9" className="fill-muted-foreground text-[9px]">
              {t("coverage:estimate")}
            </text>
            <rect x="70" y="0" width="10" height="10" rx="2" className="fill-emerald-400/70" />
            <text x="86" y="9" className="fill-muted-foreground text-[9px]">
              {t("coverage:actual")}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
