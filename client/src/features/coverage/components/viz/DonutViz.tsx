import { useMemo } from "react";
import { type AppLanguage } from "@/lib/i18n";
import { type DonutSpec } from "../../lib/vizSchema";
import VizContainer from "./VizContainer";
import { formatCurrency, formatNumber, uniqueId } from "./utils";

interface DonutVizProps {
  language: AppLanguage;
  spec: DonutSpec;
}

const DONUT_COLORS = [
  "var(--color-bull)",
  "var(--color-info)",
  "var(--color-accent)",
  "var(--color-caution)",
  "var(--color-bear)",
];

export default function DonutViz({ language, spec }: DonutVizProps) {
  const { total, unit, slices, note, caption, insight } = spec;
  const id = useMemo(() => uniqueId("donut"), []);

  const cx = 110;
  const cy = 110;
  const radius = 80;
  const innerRadius = 52;

  const normalizedSlices = useMemo(() => {
    const sorted = [...slices].sort((a, b) => b.value - a.value);
    const others = sorted.slice(4);
    const main = sorted.slice(0, 4);
    if (others.length > 0) {
      main.push({
        name: language === "en" ? "Other" : "Diğer",
        value: others.reduce((s, item) => s + item.value, 0),
      });
    }
    return main;
  }, [slices, language]);

  const totalValue = normalizedSlices.reduce((s, item) => s + item.value, 0);

  const arcs = useMemo(() => {
    let start = 0;
    return normalizedSlices.map((slice, index) => {
      const angle = totalValue > 0 ? (slice.value / totalValue) * 2 * Math.PI : 0;
      const end = start + angle;
      const largeArc = angle > Math.PI ? 1 : 0;
      const x1 = cx + radius * Math.cos(start);
      const y1 = cy + radius * Math.sin(start);
      const x2 = cx + radius * Math.cos(end);
      const y2 = cy + radius * Math.sin(end);
      const xi1 = cx + innerRadius * Math.cos(start);
      const yi1 = cy + innerRadius * Math.sin(start);
      const xi2 = cx + innerRadius * Math.cos(end);
      const yi2 = cy + innerRadius * Math.sin(end);

      const d = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${xi2} ${yi2}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${xi1} ${yi1}`,
        "Z",
      ].join(" ");

      const midAngle = start + angle / 2;
      const labelRadius = radius + 18;
      const lx = cx + labelRadius * Math.cos(midAngle);
      const ly = cy + labelRadius * Math.sin(midAngle);

      const result = {
        color: DONUT_COLORS[index % DONUT_COLORS.length],
        d,
        labelX: lx,
        labelY: ly,
        midAngle,
        pct: totalValue > 0 ? (slice.value / totalValue) * 100 : 0,
        slice,
      };
      start = end;
      return result;
    });
  }, [normalizedSlices, totalValue]);

  return (
    <VizContainer
      ariaLabel={`Donut chart: ${formatCurrency(total)} ${unit ?? ""}`}
      caption={caption}
      className="rounded-xl border border-border bg-background/30 p-4"
      insight={insight}
      language={language}
      title={language === "en" ? "Concentration" : "Konsantrasyon"}
    >
      <div className="flex flex-col items-center gap-6 md:flex-row">
        <svg
          role="img"
          viewBox="0 0 220 220"
          className="w-full max-w-[220px]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <defs>
            <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {arcs.map((arc, i) => (
            <g key={arc.slice.name}>
              <path
                d={arc.d}
                fill={arc.color}
                fillOpacity={0.85}
                stroke="var(--color-bg-elevated)"
                strokeWidth={2}
              >
                <title>{`${arc.slice.name}: ${formatNumber(arc.pct)}%`}</title>
              </path>
              {arc.pct >= 6 ? (
                <text
                  x={cx + (radius - 14) * Math.cos(arc.midAngle)}
                  y={cy + (radius - 14) * Math.sin(arc.midAngle)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--color-bg-elevated)"
                  fontSize={10}
                  fontWeight={600}
                >
                  {formatNumber(arc.pct, 0)}%
                </text>
              ) : null}
            </g>
          ))}

          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize={18}
            fontWeight={700}
          >
            {formatCurrency(total, true)}
          </text>
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            fill="var(--color-text-muted)"
            fontSize={10}
          >
            {unit ?? ""}
          </text>
        </svg>

        <div className="flex-1 space-y-2">
          {arcs.map(arc => (
            <div key={arc.slice.name} className="flex items-center gap-2 text-sm">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: arc.color }}
              />
              <span className="flex-1 text-muted-foreground">{arc.slice.name}</span>
              <span className="font-mono text-foreground">{formatNumber(arc.pct)}%</span>
              <span className="font-mono text-muted-foreground text-xs">
                {formatCurrency(arc.slice.value)}
              </span>
            </div>
          ))}
          {note ? (
            <p className="pt-2 text-xs text-muted-foreground/70">{note}</p>
          ) : null}
        </div>
      </div>
    </VizContainer>
  );
}
