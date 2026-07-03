import { useMemo } from "react";
import { type AppLanguage } from "@/lib/i18n";
import { type ProbSpec } from "../../lib/vizSchema";
import VizContainer from "./VizContainer";
import { formatCurrency, formatNumber, uniqueId } from "./utils";

interface ProbVizProps {
  language: AppLanguage;
  spec: ProbSpec;
}

export default function ProbViz({ language, spec }: ProbVizProps) {
  const { buckets, showEV, caption, insight } = spec;
  const id = useMemo(() => uniqueId("prob"), []);

  const width = 640;
  const height = 260;
  const pad = { top: 24, right: 16, bottom: 80, left: 56 };
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;

  const maxProb = Math.max(...buckets.map(b => b.prob), 1);
  const totalProb = buckets.reduce((s, b) => s + b.prob, 0);
  const expectedValue = useMemo(
    () => buckets.reduce((s, b) => s + (b.prob / 100) * b.plMid, 0),
    [buckets]
  );

  const barWidth = (plotWidth / buckets.length) * 0.72;
  const xForIndex = (i: number) =>
    pad.left + (plotWidth * (i + 0.5)) / buckets.length;
  const yForProb = (p: number) =>
    pad.top + plotHeight * (1 - p / maxProb);

  return (
    <VizContainer
      ariaLabel={`Probability distribution with ${buckets.length} buckets`}
      caption={caption}
      className="rounded-xl border border-border bg-background/30 p-4"
      insight={insight}
      language={language}
      title={language === "en" ? "Probability Distribution" : "Olasılık Dağılımı"}
    >
      <svg
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <defs>
          <linearGradient id={`${id}-pos`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-bull)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-bull)" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id={`${id}-neg`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-bear)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-bear)" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {Array.from({ length: 5 }, (_, i) => {
          const p = (maxProb * i) / 4;
          return (
            <line
              key={i}
              x1={pad.left}
              y1={yForProb(p)}
              x2={width - pad.right}
              y2={yForProb(p)}
              stroke="var(--color-border-subtle)"
              strokeDasharray="3 3"
            />
          );
        })}

        {/* Bars */}
        {buckets.map((bucket, i) => {
          const x = xForIndex(i);
          const y = yForProb(bucket.prob);
          const h = pad.top + plotHeight - y;
          const isPositive = bucket.plMid >= 0;
          return (
            <g key={i}>
              <rect
                x={x - barWidth / 2}
                y={y}
                width={barWidth}
                height={h}
                rx={4}
                fill={isPositive ? `url(#${id}-pos)` : `url(#${id}-neg)`}
                stroke={isPositive ? "var(--color-bull)" : "var(--color-bear)"}
                strokeOpacity={0.5}
                strokeWidth={1}
              >
                <title>{`${bucket.range}: ${bucket.prob}% · P&L ${formatCurrency(bucket.plMid)}`}</title>
              </rect>
              <text
                x={x}
                y={y - 6}
                textAnchor="middle"
                fill="var(--color-text-primary)"
                fontSize={10}
                fontWeight={600}
              >
                {formatNumber(bucket.prob, 0)}%
              </text>
              <text
                x={x}
                y={height - pad.bottom + 18}
                textAnchor="middle"
                fill="var(--color-text-secondary)"
                fontSize={9}
              >
                {bucket.range}
              </text>
              <text
                x={x}
                y={height - pad.bottom + 34}
                textAnchor="middle"
                fill={isPositive ? "var(--color-bull)" : "var(--color-bear)"}
                fontSize={9}
              >
                {formatCurrency(bucket.plMid)}
              </text>
            </g>
          );
        })}

        {/* Y axis labels */}
        {Array.from({ length: 5 }, (_, i) => {
          const p = (maxProb * i) / 4;
          return (
            <text
              key={`yl-${i}`}
              x={pad.left - 8}
              y={yForProb(p) + 4}
              textAnchor="end"
              fill="var(--color-text-muted)"
              fontSize={9}
            >
              {formatNumber(p, 0)}%
            </text>
          );
        })}
      </svg>

      {showEV ? (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2">
          <span className="text-xs text-muted-foreground">
            {language === "en" ? "Expected Value" : "Beklenen Değer"}
          </span>
          <span
            className={`font-mono text-sm font-semibold ${
              expectedValue >= 0 ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {formatCurrency(expectedValue)}
          </span>
        </div>
      ) : null}
      {showEV ? (
        <p className="mt-1 text-[10px] text-muted-foreground/60">
          {language === "en"
            ? "EV = Σ p × midpoint P&L. Assumes probabilities are approximate scenario weights."
            : "EV = Σ p × P&L orta değeri. Olasılıklar yaklaşık senaryo ağırlığıdır."}
        </p>
      ) : null}
    </VizContainer>
  );
}
