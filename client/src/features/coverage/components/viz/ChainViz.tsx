import { useMemo } from "react";
import { type AppLanguage } from "@/lib/i18n";
import { type ChainVizSpec } from "../../lib/vizSchema";
import VizContainer from "./VizContainer";
import { formatCurrency, formatNumber, uniqueId } from "./utils";

interface ChainVizProps {
  language: AppLanguage;
  spec: ChainVizSpec;
}

export default function ChainViz({ language, spec }: ChainVizProps) {
  const { rows, caption, insight } = spec;
  const id = useMemo(() => uniqueId("chain"), []);

  const width = 640;
  const height = 320;
  const pad = { top: 24, right: 24, bottom: 56, left: 56 };
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;

  const strikes = useMemo(() => rows.map(r => r.strike), [rows]);
  const minStrike = Math.min(...strikes);
  const maxStrike = Math.max(...strikes);
  const strikeRange = maxStrike - minStrike || 1;

  const maxIv = Math.max(...rows.map(r => r.iv), 1);
  const maxVolume = Math.max(...rows.map(r => r.volume ?? 0), 1);

  const xFor = (strike: number) =>
    pad.left + ((strike - minStrike) / strikeRange) * plotWidth;
  const yForIv = (iv: number) =>
    pad.top + plotHeight * (1 - iv / maxIv);
  const barWidth = (plotWidth / rows.length) * 0.5;

  const linePath = useMemo(() => {
    return rows
      .map((r, i) => `${i === 0 ? "M" : "L"} ${xFor(r.strike)} ${yForIv(r.iv)}`)
      .join(" ");
  }, [rows]);

  return (
    <VizContainer
      ariaLabel={`Option chain IV curve for ${rows.length} strikes`}
      caption={caption}
      className="rounded-xl border border-border bg-background/30 p-4"
      insight={insight}
      language={language}
      title={language === "en" ? "Option Chain" : "Opsiyon Zinciri"}
    >
      <svg
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <defs>
          <linearGradient id={`${id}-iv-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {Array.from({ length: 5 }, (_, i) => {
          const iv = (maxIv * i) / 4;
          return (
            <line
              key={`y-${i}`}
              x1={pad.left}
              y1={yForIv(iv)}
              x2={width - pad.right}
              y2={yForIv(iv)}
              stroke="var(--color-border-subtle)"
              strokeDasharray="3 3"
            />
          );
        })}

        {/* Volume bars */}
        {rows.map(r => {
          const h = ((r.volume ?? 0) / maxVolume) * plotHeight;
          return (
            <rect
              key={`vol-${r.strike}`}
              x={xFor(r.strike) - barWidth / 2}
              y={pad.top + plotHeight - h}
              width={barWidth}
              height={h}
              fill="var(--color-info)"
              fillOpacity={0.12}
              rx={2}
            />
          );
        })}

        {/* IV area */}
        <path
          d={`${linePath} L ${xFor(rows[rows.length - 1].strike)} ${pad.top + plotHeight} L ${xFor(rows[0].strike)} ${pad.top + plotHeight} Z`}
          fill={`url(#${id}-iv-area)`}
        />

        {/* IV line */}
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {rows.map(r => (
          <g key={`pt-${r.strike}`}>
            <circle
              cx={xFor(r.strike)}
              cy={yForIv(r.iv)}
              r={r.atm ? 6 : 4}
              fill={r.atm ? "var(--color-bear)" : "var(--color-bg-elevated)"}
              stroke={r.atm ? "var(--color-bear)" : "var(--color-accent)"}
              strokeWidth={2}
            >
              <title>{`Strike ${formatCurrency(r.strike)} · IV ${formatNumber(r.iv * 100, 1)}%`}</title>
            </circle>
          </g>
        ))}

        {/* Y axis labels */}
        {Array.from({ length: 5 }, (_, i) => {
          const iv = (maxIv * i) / 4;
          return (
            <text
              key={`yl-${i}`}
              x={pad.left - 8}
              y={yForIv(iv) + 4}
              textAnchor="end"
              fill="var(--color-text-muted)"
              fontSize={9}
            >
              {formatNumber(iv * 100, 0)}%
            </text>
          );
        })}

        {/* X axis labels */}
        {rows.map(r => (
          <text
            key={`xl-${r.strike}`}
            x={xFor(r.strike)}
            y={height - pad.bottom + 18}
            textAnchor="middle"
            fill={r.atm ? "var(--color-bear)" : "var(--color-text-muted)"}
            fontSize={9}
            fontWeight={r.atm ? 700 : 400}
          >
            {formatCurrency(r.strike, true)}
          </text>
        ))}
      </svg>
    </VizContainer>
  );
}
