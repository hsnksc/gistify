import { useMemo } from "react";
import { type AppLanguage } from "@/lib/i18n";
import { type PayoffSpec } from "../../lib/vizSchema";
import VizContainer from "./VizContainer";
import { clamp, formatCurrency, formatNumber, formatPercent, uniqueId } from "./utils";

interface PayoffVizProps {
  language: AppLanguage;
  spec: PayoffSpec;
}

function payoffAtPrice(legs: PayoffSpec["legs"], price: number): number {
  return legs.reduce((total, leg) => {
    const qty = leg.qty ?? 1;
    const premium = leg.premium ?? 0;
    let intrinsic = 0;

    if (leg.type === "call") {
      intrinsic = Math.max(0, price - leg.strike);
    } else if (leg.type === "put") {
      intrinsic = Math.max(0, leg.strike - price);
    } else if (leg.type === "stock") {
      intrinsic = price - leg.strike;
    }

    if (leg.side === "long") {
      return total + qty * (intrinsic - premium);
    }
    return total + qty * (premium - intrinsic);
  }, 0);
}

export default function PayoffViz({ language, spec }: PayoffVizProps) {
  const { legs, xRange, band, markers, probDots, caption, insight } = spec;
  const id = useMemo(() => uniqueId("payoff"), []);

  const width = 640;
  const height = 320;
  const pad = { top: 24, right: 16, bottom: 40, left: 56 };
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;

  const points = useMemo(() => {
    const count = 120;
    return Array.from({ length: count }, (_, i) => {
      const x = xRange[0] + ((xRange[1] - xRange[0]) * i) / (count - 1);
      const pl = payoffAtPrice(legs, x);
      return { pl, x };
    });
  }, [legs, xRange]);

  const minPl = useMemo(() => Math.min(...points.map(p => p.pl), 0), [points]);
  const maxPl = useMemo(() => Math.max(...points.map(p => p.pl), 0), [points]);
  const plRange = Math.max(maxPl - minPl, 1);

  const xFor = (price: number) =>
    pad.left + ((price - xRange[0]) / (xRange[1] - xRange[0])) * plotWidth;
  const yFor = (pl: number) =>
    pad.top + plotHeight * (1 - (pl - minPl) / plRange);
  const zeroY = yFor(0);

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(p.x)} ${yFor(p.pl)}`)
    .join(" ");

  const positiveArea =
    `${linePath} L ${xFor(points[points.length - 1].x)} ${zeroY} L ${xFor(points[0].x)} ${zeroY} Z`;

  const yTicks = useMemo(() => {
    const ticks = 5;
    return Array.from({ length: ticks }, (_, i) => {
      const pl = minPl + (plRange * i) / (ticks - 1);
      return { pl, y: yFor(pl) };
    });
  }, [minPl, maxPl]);

  const xTicks = useMemo(() => {
    const ticks = 6;
    return Array.from({ length: ticks }, (_, i) => {
      const x = xRange[0] + ((xRange[1] - xRange[0]) * i) / (ticks - 1);
      return { x, px: xFor(x) };
    });
  }, [xRange]);

  return (
    <VizContainer
      ariaLabel={`Payoff curve from ${formatCurrency(xRange[0])} to ${formatCurrency(xRange[1])}`}
      caption={caption}
      className="rounded-xl border border-border bg-background/30 p-4"
      insight={insight}
      language={language}
      title={language === "en" ? "Payoff Curve" : "P&L Eğrisi"}
    >
      <svg
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <defs>
          <linearGradient id={`${id}-profit`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-bull)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-bull)" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id={`${id}-loss`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-bear)" stopOpacity="0.04" />
            <stop offset="100%" stopColor="var(--color-bear)" stopOpacity="0.22" />
          </linearGradient>
          <clipPath id={`${id}-profit-clip`}>
            <rect x={pad.left} y={pad.top} width={plotWidth} height={zeroY - pad.top} />
          </clipPath>
          <clipPath id={`${id}-loss-clip`}>
            <rect x={pad.left} y={zeroY} width={plotWidth} height={height - pad.bottom - zeroY} />
          </clipPath>
        </defs>

        {/* Grid */}
        {yTicks.map((t, i) => (
          <line
            key={`y-${i}`}
            x1={pad.left}
            y1={t.y}
            x2={width - pad.right}
            y2={t.y}
            stroke="var(--color-border-subtle)"
            strokeDasharray="3 3"
          />
        ))}
        {xTicks.map((t, i) => (
          <line
            key={`x-${i}`}
            x1={t.px}
            y1={pad.top}
            x2={t.px}
            y2={height - pad.bottom}
            stroke="var(--color-border-subtle)"
            strokeDasharray="3 3"
          />
        ))}

        {/* Zero line */}
        <line
          x1={pad.left}
          y1={zeroY}
          x2={width - pad.right}
          y2={zeroY}
          stroke="var(--color-text-muted)"
          strokeWidth={1}
          strokeDasharray="5 3"
        />

        {/* Band */}
        {band ? (
          <rect
            x={xFor(band[0])}
            y={pad.top}
            width={xFor(band[1]) - xFor(band[0])}
            height={plotHeight}
            fill="var(--color-info)"
            fillOpacity={0.06}
            stroke="var(--color-info)"
            strokeOpacity={0.2}
            rx={4}
          />
        ) : null}

        {/* Areas */}
        <path d={positiveArea} fill={`url(#${id}-profit)`} clipPath={`url(#${id}-profit-clip)`} />
        <path d={positiveArea} fill={`url(#${id}-loss)`} clipPath={`url(#${id}-loss-clip)`} />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-text-primary)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Markers */}
        {markers?.current ? (
          <g>
            <line
              x1={xFor(markers.current)}
              y1={pad.top}
              x2={xFor(markers.current)}
              y2={height - pad.bottom}
              stroke="var(--color-info)"
              strokeWidth={2}
              strokeDasharray="4 3"
            />
            <text
              x={xFor(markers.current)}
              y={pad.top - 6}
              textAnchor="middle"
              fill="var(--color-info)"
              fontSize={10}
              fontWeight={600}
            >
              {language === "en" ? "Current" : "Güncel"}
            </text>
          </g>
        ) : null}
        {markers?.breakeven ? (
          <g>
            <line
              x1={xFor(markers.breakeven)}
              y1={pad.top}
              x2={xFor(markers.breakeven)}
              y2={height - pad.bottom}
              stroke="var(--color-caution)"
              strokeWidth={1.5}
              strokeDasharray="2 2"
            />
            <text
              x={xFor(markers.breakeven)}
              y={height - pad.bottom + 14}
              textAnchor="middle"
              fill="var(--color-caution)"
              fontSize={9}
            >
              BE
            </text>
          </g>
        ) : null}
        {markers?.target ? (
          <g>
            <line
              x1={xFor(markers.target)}
              y1={pad.top}
              x2={xFor(markers.target)}
              y2={height - pad.bottom}
              stroke="var(--color-bull)"
              strokeWidth={1.5}
              strokeDasharray="2 2"
            />
            <text
              x={xFor(markers.target)}
              y={height - pad.bottom + 14}
              textAnchor="middle"
              fill="var(--color-bull)"
              fontSize={9}
            >
              {language === "en" ? "Target" : "Hedef"}
            </text>
          </g>
        ) : null}

        {/* Prob dots */}
        {probDots?.map((dot, i) => {
          const x = xFor(dot.x);
          const pl = payoffAtPrice(legs, dot.x);
          const y = yFor(pl);
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={clamp(3 + dot.p / 6, 3, 14)}
                fill="var(--color-info)"
                fillOpacity={0.35}
                stroke="var(--color-info)"
                strokeWidth={1}
              >
                <title>{`${formatCurrency(dot.x)}: ${formatPercent(dot.p, 0)}`}</title>
              </circle>
            </g>
          );
        })}

        {/* Axes labels */}
        {yTicks.map((t, i) => (
          <text
            key={`yl-${i}`}
            x={pad.left - 8}
            y={t.y + 4}
            textAnchor="end"
            fill="var(--color-text-muted)"
            fontSize={9}
          >
            {formatCurrency(t.pl)}
          </text>
        ))}
        {xTicks.map((t, i) => (
          <text
            key={`xl-${i}`}
            x={t.px}
            y={height - pad.bottom + 18}
            textAnchor="middle"
            fill="var(--color-text-muted)"
            fontSize={9}
          >
            {formatCurrency(t.x)}
          </text>
        ))}
      </svg>
    </VizContainer>
  );
}
