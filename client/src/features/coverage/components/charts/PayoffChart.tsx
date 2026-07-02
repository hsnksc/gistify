import { type AppLanguage } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

export interface PayoffChartProps {
  breakeven?: number;
  currentPrice?: number;
  data: Array<{
    pnl: number;
    price: number;
    roi?: number;
  }>;
  language?: AppLanguage;
}

export default function PayoffChart({
  breakeven,
  currentPrice,
  data,
  language = "en",
}: PayoffChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { minPrice, maxPrice, minPnl, maxPnl } = useMemo(() => {
    if (data.length === 0) {
      return { minPrice: 0, maxPrice: 100, minPnl: -100, maxPnl: 100 };
    }
    const prices = data.map((d) => d.price);
    const pnls = data.map((d) => d.pnl);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      minPnl: Math.min(...pnls, 0),
      maxPnl: Math.max(...pnls, 0),
    };
  }, [data]);

  const padding = { top: 40, right: 20, bottom: 50, left: 60 };
  const width = 640;
  const height = 320;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const scaleX = (price: number) =>
    padding.left +
    ((price - minPrice) / (maxPrice - minPrice || 1)) * chartW;
  const scaleY = (pnl: number) =>
    padding.top +
    chartH -
    ((pnl - minPnl) / (maxPnl - minPnl || 1)) * chartH;

  const zeroY = scaleY(0);

  const linePath = useMemo(() => {
    if (data.length === 0) return "";
    return data
      .map((d, i) => `${i === 0 ? "M" : "L"} ${scaleX(d.price)} ${scaleY(d.pnl)}`)
      .join(" ");
  }, [data, minPrice, maxPrice, minPnl, maxPnl]);

  const areaPath = useMemo(() => {
    if (data.length === 0) return "";
    const top = data
      .map((d, i) => `${i === 0 ? "M" : "L"} ${scaleX(d.price)} ${scaleY(d.pnl)}`)
      .join(" ");
    const firstX = scaleX(data[0].price);
    const lastX = scaleX(data[data.length - 1].price);
    return `${top} L ${lastX} ${zeroY} L ${firstX} ${zeroY} Z`;
  }, [data, minPrice, maxPrice, minPnl, maxPnl]);

  const ticks = 5;
  const priceTicks = Array.from({ length: ticks + 1 }, (_, i) =>
    minPrice + (i * (maxPrice - minPrice)) / ticks
  );
  const pnlTicks = Array.from({ length: ticks + 1 }, (_, i) =>
    minPnl + (i * (maxPnl - minPnl)) / ticks
  );

  return (
    <div className="space-y-3 rounded-xl border border-border bg-background/30 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {copy(language, "Payoff Grafigi", "Payoff Chart")}
      </p>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full max-w-[640px]"
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Profit zone (above zero) */}
          <defs>
            <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(34,197,94,0.15)" />
              <stop offset="100%" stopColor="rgba(34,197,94,0.03)" />
            </linearGradient>
            <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(244,63,94,0.03)" />
              <stop offset="100%" stopColor="rgba(244,63,94,0.15)" />
            </linearGradient>
          </defs>

          {/* Background zones */}
          <rect
            x={padding.left}
            y={padding.top}
            width={chartW}
            height={zeroY - padding.top}
            fill="url(#profitGrad)"
          />
          <rect
            x={padding.left}
            y={zeroY}
            width={chartW}
            height={padding.top + chartH - zeroY}
            fill="url(#lossGrad)"
          />

          {/* Grid lines */}
          {priceTicks.map((t, i) => (
            <g key={`gx-${i}`}>
              <line
                x1={scaleX(t)}
                y1={padding.top}
                x2={scaleX(t)}
                y2={padding.top + chartH}
                stroke="currentColor"
                strokeWidth="1"
                className="text-border/40"
                strokeDasharray="2 2"
              />
            </g>
          ))}
          {pnlTicks.map((t, i) => (
            <g key={`gy-${i}`}>
              <line
                x1={padding.left}
                y1={scaleY(t)}
                x2={padding.left + chartW}
                y2={scaleY(t)}
                stroke="currentColor"
                strokeWidth="1"
                className="text-border/40"
                strokeDasharray="2 2"
              />
            </g>
          ))}

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

          {/* Zero line */}
          <line
            x1={padding.left}
            y1={zeroY}
            x2={padding.left + chartW}
            y2={zeroY}
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground/60"
          />

          {/* Area */}
          <path d={areaPath} fill="rgba(99,102,241,0.08)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-indigo-400"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={scaleX(d.price)}
              cy={scaleY(d.pnl)}
              r="4"
              className={cn(
                "fill-current stroke-background stroke-2",
                d.pnl >= 0 ? "text-emerald-400" : "text-rose-400"
              )}
              onMouseEnter={() => setHoverIndex(i)}
            />
          ))}

          {/* Breakeven line */}
          {breakeven !== undefined && (
            <g>
              <line
                x1={scaleX(breakeven)}
                y1={padding.top}
                x2={scaleX(breakeven)}
                y2={padding.top + chartH}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="text-amber-400"
              />
              <text
                x={scaleX(breakeven)}
                y={padding.top - 8}
                textAnchor="middle"
                className="fill-amber-400 text-[10px] font-medium"
              >
                BE {breakeven.toFixed(2)}
              </text>
            </g>
          )}

          {/* Current price line */}
          {currentPrice !== undefined && (
            <g>
              <line
                x1={scaleX(currentPrice)}
                y1={padding.top}
                x2={scaleX(currentPrice)}
                y2={padding.top + chartH}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="text-sky-400"
              />
              <text
                x={scaleX(currentPrice)}
                y={padding.top - 8}
                textAnchor="middle"
                className="fill-sky-400 text-[10px] font-medium"
              >
                ${currentPrice.toFixed(2)}
              </text>
            </g>
          )}

          {/* X axis labels */}
          {priceTicks.map((t, i) => (
            <text
              key={`xt-${i}`}
              x={scaleX(t)}
              y={padding.top + chartH + 18}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              ${t.toFixed(0)}
            </text>
          ))}

          {/* Y axis labels */}
          {pnlTicks.map((t, i) => (
            <text
              key={`yt-${i}`}
              x={padding.left - 8}
              y={scaleY(t) + 4}
              textAnchor="end"
              className="fill-muted-foreground text-[10px]"
            >
              {t >= 0 ? `+$${t.toFixed(0)}` : `-$${Math.abs(t).toFixed(0)}`}
            </text>
          ))}

          {/* Hover tooltip */}
          {hoverIndex !== null && data[hoverIndex] && (
            <g>
              <rect
                x={scaleX(data[hoverIndex].price) - 55}
                y={scaleY(data[hoverIndex].pnl) - 45}
                width="110"
                height="38"
                rx="6"
                className="fill-background/90 stroke-border"
                strokeWidth="1"
              />
              <text
                x={scaleX(data[hoverIndex].price)}
                y={scaleY(data[hoverIndex].pnl) - 28}
                textAnchor="middle"
                className="fill-foreground text-[11px] font-medium"
              >
                ${data[hoverIndex].price.toFixed(2)} → P&L: ${data[hoverIndex].pnl.toFixed(0)}
              </text>
              {data[hoverIndex].roi !== undefined && (
                <text
                  x={scaleX(data[hoverIndex].price)}
                  y={scaleY(data[hoverIndex].pnl) - 16}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px]"
                >
                  ROI: {data[hoverIndex].roi!.toFixed(0)}%
                </text>
              )}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
