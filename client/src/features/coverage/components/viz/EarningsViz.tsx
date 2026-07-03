import { type AppLanguage } from "@/lib/i18n";
import { type EarningsSpec } from "../../lib/vizSchema";
import VizContainer from "./VizContainer";
import { formatCurrency, formatNumber } from "./utils";

interface EarningsVizProps {
  language: AppLanguage;
  spec: EarningsSpec;
}

export default function EarningsViz({ language, spec }: EarningsVizProps) {
  const { rows, caption, insight } = spec;

  const width = 640;
  const height = 300;
  const pad = { top: 24, right: 16, bottom: 64, left: 56 };
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;

  const allValues = rows.flatMap(r => [r.est, r.act, r.rev ?? 0].filter(Boolean));
  const maxValue = Math.max(...allValues, 1);
  const minValue = Math.min(...allValues, 0);
  const valueRange = maxValue - minValue || 1;

  const xForIndex = (i: number) =>
    pad.left + (plotWidth * (i + 0.5)) / rows.length;
  const yForValue = (v: number) =>
    pad.top + plotHeight * (1 - (v - minValue) / valueRange);
  const zeroY = yForValue(0);

  const barWidth = plotWidth / rows.length * 0.28;

  return (
    <VizContainer
      ariaLabel={`Earnings history for ${rows.length} periods`}
      caption={caption}
      className="rounded-xl border border-border bg-background/30 p-4"
      insight={insight}
      language={language}
      title={language === "en" ? "Earnings History" : "Kazanç Geçmişi"}
    >
      <svg
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {/* Zero line */}
        <line
          x1={pad.left}
          y1={zeroY}
          x2={width - pad.right}
          y2={zeroY}
          stroke="var(--color-text-muted)"
          strokeWidth={1}
          strokeDasharray="4 3"
        />

        {/* Grid */}
        {Array.from({ length: 5 }, (_, i) => {
          const v = minValue + (valueRange * i) / 4;
          const y = yForValue(v);
          return (
            <line
              key={i}
              x1={pad.left}
              y1={y}
              x2={width - pad.right}
              y2={y}
              stroke="var(--color-border-subtle)"
              strokeDasharray="3 3"
            />
          );
        })}

        {rows.map((row, i) => {
          const x = xForIndex(i);
          const estHeight = Math.abs(yForValue(row.est) - zeroY);
          const actHeight = Math.abs(yForValue(row.act) - zeroY);
          const estY = row.est >= 0 ? yForValue(row.est) : zeroY;
          const actY = row.act >= 0 ? yForValue(row.act) : zeroY;
          const surprise = row.surprise ?? ((row.act - row.est) / Math.abs(row.est)) * 100;
          const surpriseColor = surprise >= 0 ? "var(--color-bull)" : "var(--color-bear)";

          return (
            <g key={row.q}>
              {/* Estimate bar */}
              <rect
                x={x - barWidth}
                y={estY}
                width={barWidth}
                height={estHeight}
                rx={3}
                fill="var(--color-info)"
                fillOpacity={0.35}
                stroke="var(--color-info)"
                strokeWidth={1}
              >
                <title>{`Est: ${formatCurrency(row.est)}`}</title>
              </rect>
              {/* Actual bar */}
              <rect
                x={x}
                y={actY}
                width={barWidth}
                height={actHeight}
                rx={3}
                fill={surpriseColor}
                fillOpacity={0.6}
                stroke={surpriseColor}
                strokeWidth={1}
              >
                <title>{`Actual: ${formatCurrency(row.act)} (${formatNumber(surprise)}%)`}</title>
              </rect>
              {/* Surprise lollipop */}
              <line
                x1={x - barWidth / 2}
                y1={actY + actHeight / 2}
                x2={x + barWidth / 2}
                y2={actY + actHeight / 2}
                stroke={surpriseColor}
                strokeWidth={2}
              />
              <circle
                cx={x + barWidth / 2}
                cy={actY + actHeight / 2}
                r={4}
                fill={surpriseColor}
              />
              {/* Label */}
              <text
                x={x}
                y={height - pad.bottom + 18}
                textAnchor="middle"
                fill="var(--color-text-secondary)"
                fontSize={10}
                fontWeight={600}
              >
                {row.q}
              </text>
              <text
                x={x}
                y={height - pad.bottom + 34}
                textAnchor="middle"
                fill={surpriseColor}
                fontSize={9}
              >
                {formatNumber(surprise)}%
              </text>
            </g>
          );
        })}

        {/* Y axis labels */}
        {Array.from({ length: 5 }, (_, i) => {
          const v = minValue + (valueRange * i) / 4;
          return (
            <text
              key={`yl-${i}`}
              x={pad.left - 8}
              y={yForValue(v) + 4}
              textAnchor="end"
              fill="var(--color-text-muted)"
              fontSize={9}
            >
              {formatCurrency(v)}
            </text>
          );
        })}
      </svg>
    </VizContainer>
  );
}
