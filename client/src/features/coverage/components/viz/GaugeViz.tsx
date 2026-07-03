import { type AppLanguage } from "@/lib/i18n";
import { type GaugeSpec } from "../../lib/vizSchema";
import VizContainer from "./VizContainer";
import { clamp, formatNumber, uniqueId } from "./utils";

interface GaugeVizProps {
  language: AppLanguage;
  spec: GaugeSpec;
}

export default function GaugeViz({ language, spec }: GaugeVizProps) {
  const { value, min, max, zones, label, caption, insight } = spec;
  const id = uniqueId("gauge");

  const cx = 120;
  const cy = 110;
  const radius = 80;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;

  const polar = (angle: number) => ({
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  });

  const valueAngle = startAngle + ((value - min) / (max - min)) * (endAngle - startAngle);
  const needle = polar(valueAngle);

  const arcPath = (a1: number, a2: number) => {
    const p1 = polar(a1);
    const p2 = polar(a2);
    const largeArc = a2 - a1 <= Math.PI ? 0 : 1;
    return `M ${p1.x} ${p1.y} A ${radius} ${radius} 0 ${largeArc} 1 ${p2.x} ${p2.y}`;
  };

  const zoneDefs =
    zones && zones.length > 0
      ? zones.map((z, i, arr) => {
          const prev = i === 0 ? min : arr[i - 1].to;
          return {
            color: z.color || "var(--color-info)",
            from: prev,
            label: z.label,
            to: z.to,
          };
        })
      : [
          { color: "var(--color-bull)", from: min, label: "Low", to: min + (max - min) * 0.3 },
          { color: "var(--color-caution)", from: min + (max - min) * 0.3, label: "Mid", to: min + (max - min) * 0.7 },
          { color: "var(--color-bear)", from: min + (max - min) * 0.7, label: "High", to: max },
        ];

  return (
    <VizContainer
      ariaLabel={`${label ?? "Gauge"}: ${formatNumber(value)}`}
      caption={caption}
      className="rounded-xl border border-border bg-background/30 p-4"
      insight={insight}
      language={language}
      title={label ?? (language === "en" ? "Gauge" : "Gösterge")}
    >
      <svg
        role="img"
        viewBox="0 0 240 140"
        className="mx-auto w-full max-w-[280px]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <defs>
          <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background arc */}
        <path
          d={arcPath(startAngle, endAngle)}
          fill="none"
          stroke="var(--color-border-medium)"
          strokeLinecap="round"
          strokeWidth={14}
        />

        {/* Zones */}
        {zoneDefs.map((zone, index) => {
          const a1 = startAngle + ((zone.from - min) / (max - min)) * (endAngle - startAngle);
          const a2 = startAngle + ((clamp(zone.to, min, max) - min) / (max - min)) * (endAngle - startAngle);
          return (
            <path
              key={index}
              d={arcPath(a1, a2)}
              fill="none"
              stroke={zone.color}
              strokeLinecap="round"
              strokeWidth={14}
              opacity={0.85}
            />
          );
        })}

        {/* Ticks */}
        {Array.from({ length: 7 }, (_, i) => {
          const v = min + ((max - min) * i) / 6;
          const a = startAngle + ((v - min) / (max - min)) * (endAngle - startAngle);
          const p1 = polar(a);
          const p2 = {
            x: cx + (radius - 22) * Math.cos(a),
            y: cy + (radius - 22) * Math.sin(a),
          };
          return (
            <g key={i}>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--color-text-muted)" strokeWidth={1} />
              <text
                x={cx + (radius - 34) * Math.cos(a)}
                y={cy + (radius - 34) * Math.sin(a)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--color-text-muted)"
                fontSize={9}
              >
                {formatNumber(v, 0)}
              </text>
            </g>
          );
        })}

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needle.x}
          y2={needle.y}
          stroke="var(--color-text-primary)"
          strokeWidth={2.5}
          strokeLinecap="round"
          filter={`url(#${id}-glow)`}
        />
        <circle cx={cx} cy={cy} r={5} fill="var(--color-text-primary)" />

        {/* Center value */}
        <text
          x={cx}
          y={cy + 28}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize={22}
          fontWeight={700}
        >
          {formatNumber(value)}
        </text>
      </svg>
    </VizContainer>
  );
}
