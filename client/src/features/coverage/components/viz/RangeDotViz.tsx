import { type AppLanguage } from "@/lib/i18n";
import { type RangeDotSpec } from "../../lib/vizSchema";
import VizContainer from "./VizContainer";
import { formatCurrency, formatNumber, uniqueId } from "./utils";

interface RangeDotVizProps {
  language: AppLanguage;
  spec: RangeDotSpec;
}

export default function RangeDotViz({ language, spec }: RangeDotVizProps) {
  const { rows, caption, insight } = spec;
  const id = uniqueId("range");

  const width = 640;
  const height = rows.length * 56 + 48;
  const pad = { top: 24, right: 120, bottom: 24, left: 120 };
  const plotWidth = width - pad.left - pad.right;

  const allValues = rows.flatMap(r => [r.low, r.value, r.high]);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;

  const xFor = (v: number) => pad.left + ((v - min) / range) * plotWidth;

  return (
    <VizContainer
      ariaLabel={`Range dot chart for ${rows.length} metrics`}
      caption={caption}
      className="rounded-xl border border-border bg-background/30 p-4"
      insight={insight}
      language={language}
      title={language === "en" ? "Range Dot" : "Hedef Aralığı"}
    >
      <svg
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <defs>
          <marker id={`${id}-arrow-up`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M5 0 L10 10 L0 10 Z" fill="var(--color-bull)" />
          </marker>
          <marker id={`${id}-arrow-down`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 0 L5 10 Z" fill="var(--color-bear)" />
          </marker>
        </defs>

        {rows.map((row, i) => {
          const y = 40 + i * 56;
          const xLow = xFor(row.low);
          const xMid = xFor(row.value);
          const xHigh = xFor(row.high);

          return (
            <g key={row.metric}>
              <text
                x={pad.left - 10}
                y={y + 4}
                textAnchor="end"
                fill="var(--color-text-secondary)"
                fontSize={11}
                fontWeight={600}
              >
                {row.metric}
              </text>

              {/* Whisker line */}
              <line
                x1={xLow}
                y1={y}
                x2={xHigh}
                y2={y}
                stroke="var(--color-border-strong)"
                strokeWidth={2}
              />
              <line
                x1={xLow}
                y1={y - 6}
                x2={xLow}
                y2={y + 6}
                stroke="var(--color-border-strong)"
                strokeWidth={2}
              />
              <line
                x1={xHigh}
                y1={y - 6}
                x2={xHigh}
                y2={y + 6}
                stroke="var(--color-border-strong)"
                strokeWidth={2}
              />

              {/* Mid dot */}
              <circle
                cx={xMid}
                cy={y}
                r={6}
                fill="var(--color-accent)"
                stroke="var(--color-bg-elevated)"
                strokeWidth={2}
              />

              {/* Labels */}
              <text
                x={xLow}
                y={y + 20}
                textAnchor="middle"
                fill="var(--color-text-muted)"
                fontSize={9}
              >
                {formatCurrency(row.low)}
              </text>
              <text
                x={xHigh}
                y={y + 20}
                textAnchor="middle"
                fill="var(--color-text-muted)"
                fontSize={9}
              >
                {formatCurrency(row.high)}
              </text>
              <text
                x={xMid}
                y={y - 12}
                textAnchor="middle"
                fill="var(--color-text-primary)"
                fontSize={10}
                fontWeight={600}
              >
                {formatCurrency(row.value)}
              </text>

              {/* Revision */}
              {row.revision ? (
                <g>
                  <line
                    x1={xFor(row.revision.from)}
                    y1={y + 10}
                    x2={xMid}
                    y2={y + 10}
                    stroke={row.revision.from <= row.value ? "var(--color-bull)" : "var(--color-bear)"}
                    strokeWidth={1.5}
                    markerEnd={`url(#${id}-arrow-${row.revision.from <= row.value ? "up" : "down"})`}
                  />
                  <text
                    x={width - pad.right + 8}
                    y={y + 4}
                    textAnchor="start"
                    fill="var(--color-text-muted)"
                    fontSize={9}
                  >
                    {row.revision.window}
                    {row.analysts ? ` · n=${row.analysts}` : ""}
                  </text>
                </g>
              ) : row.analysts ? (
                <text
                  x={width - pad.right + 8}
                  y={y + 4}
                  textAnchor="start"
                  fill="var(--color-text-muted)"
                  fontSize={9}
                >
                  n={row.analysts}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </VizContainer>
  );
}
