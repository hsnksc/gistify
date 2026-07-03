import { type AppLanguage } from "@/lib/i18n";
import { type BulletSpec } from "../../lib/vizSchema";
import VizContainer from "./VizContainer";
import { clamp, formatCurrency, formatNumber } from "./utils";

interface BulletVizProps {
  language: AppLanguage;
  spec: BulletSpec;
}

export default function BulletViz({ language, spec }: BulletVizProps) {
  const { value, band, max, label, caption, insight } = spec;

  const width = 640;
  const height = 96;
  const pad = { left: 12, right: 12, top: 28, bottom: 32 };
  const plotWidth = width - pad.left - pad.right;

  const xForValue = (v: number) =>
    pad.left + (clamp(v, 0, max) / max) * plotWidth;

  const bandStart = xForValue(band[0]);
  const bandEnd = xForValue(band[1]);

  return (
    <VizContainer
      ariaLabel={`Bullet chart for ${label ?? "value"}: ${formatNumber(value)}`}
      caption={caption}
      className="rounded-xl border border-border bg-background/30 p-4"
      insight={insight}
      language={language}
      title={label ?? (language === "en" ? "Comparison" : "Karşılaştırma")}
    >
      <svg
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {/* Background track */}
        <rect
          x={pad.left}
          y={pad.top}
          width={plotWidth}
          height={16}
          rx={8}
          fill="var(--color-bg-overlay)"
          stroke="var(--color-border-subtle)"
        />

        {/* Band */}
        <rect
          x={bandStart}
          y={pad.top - 2}
          width={bandEnd - bandStart}
          height={20}
          rx={6}
          fill="var(--color-caution-dim)"
          stroke="var(--color-caution)"
          strokeOpacity={0.4}
        />

        {/* Value marker */}
        <line
          x1={xForValue(value)}
          y1={pad.top - 8}
          x2={xForValue(value)}
          y2={pad.top + 24}
          stroke="var(--color-text-primary)"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle
          cx={xForValue(value)}
          cy={pad.top + 8}
          r={5}
          fill="var(--color-text-primary)"
        />

        {/* Labels */}
        <text
          x={pad.left}
          y={pad.top + 40}
          fill="var(--color-text-muted)"
          fontSize={10}
        >
          0
        </text>
        <text
          x={pad.left + plotWidth / 2}
          y={pad.top + 40}
          textAnchor="middle"
          fill="var(--color-text-muted)"
          fontSize={10}
        >
          {formatCurrency(max / 2)}
        </text>
        <text
          x={pad.left + plotWidth}
          y={pad.top + 40}
          textAnchor="end"
          fill="var(--color-text-muted)"
          fontSize={10}
        >
          {formatCurrency(max)}
        </text>

        <text
          x={xForValue(value)}
          y={pad.top - 14}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize={12}
          fontWeight={600}
        >
          {formatNumber(value)}
        </text>

        <text
          x={bandStart + (bandEnd - bandStart) / 2}
          y={pad.top + 58}
          textAnchor="middle"
          fill="var(--color-caution)"
          fontSize={10}
        >
          {language === "en" ? "Band" : "Bant"}: {formatCurrency(band[0])} – {formatCurrency(band[1])}
        </text>
      </svg>
    </VizContainer>
  );
}
