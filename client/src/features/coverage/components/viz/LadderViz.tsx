import { useMemo } from "react";
import { type AppLanguage } from "@/lib/i18n";
import { type LadderSpec } from "../../lib/vizSchema";
import VizContainer from "./VizContainer";
import { clamp, formatCurrency, formatPercent, uniqueId } from "./utils";

interface LadderVizProps {
  language: AppLanguage;
  spec: LadderSpec;
}

export default function LadderViz({ language, spec }: LadderVizProps) {
  const {
    levels,
    current,
    stop,
    band,
    caption,
    insight,
  } = spec;

  const id = useMemo(() => uniqueId("ladder"), []);

  const allPrices = useMemo(
    () =>
      [...levels.map(l => l.price), current, stop, ...(band || [])].filter(
        (v): v is number => typeof v === "number" && Number.isFinite(v)
      ),
    [levels, current, stop, band]
  );

  const minPrice = useMemo(() => Math.min(...allPrices) * 0.95, [allPrices]);
  const maxPrice = useMemo(() => Math.max(...allPrices) * 1.05, [allPrices]);

  const width = 640;
  const height = 420;
  const pad = { top: 24, right: 80, bottom: 40, left: 80 };
  const plotHeight = height - pad.top - pad.bottom;

  const yForPrice = (price: number) =>
    pad.top + plotHeight * (1 - (price - minPrice) / (maxPrice - minPrice));

  const centerX = width / 2;

  const ticks = useMemo(() => {
    const count = 6;
    return Array.from({ length: count }, (_, i) => {
      const price = minPrice + ((maxPrice - minPrice) * i) / (count - 1);
      return { price, y: yForPrice(price) };
    });
  }, [minPrice, maxPrice]);

  return (
    <VizContainer
      ariaLabel={`Level ladder from ${formatCurrency(minPrice)} to ${formatCurrency(maxPrice)}`}
      caption={caption}
      className="rounded-xl border border-border bg-background/30 p-4"
      insight={insight}
      language={language}
      title={language === "en" ? "Level Ladder" : "Seviye Merdiveni"}
    >
      <svg
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <defs>
          <linearGradient id={`${id}-band`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-info)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-info)" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {ticks.map(t => (
          <line
            key={t.price}
            x1={pad.left}
            y1={t.y}
            x2={width - pad.right}
            y2={t.y}
            stroke="var(--color-border-subtle)"
            strokeDasharray="4 4"
          />
        ))}

        {/* Band */}
        {band ? (
          <rect
            x={pad.left}
            y={yForPrice(band[1])}
            width={width - pad.left - pad.right}
            height={yForPrice(band[0]) - yForPrice(band[1])}
            fill={`url(#${id}-band)`}
            stroke="var(--color-info)"
            strokeOpacity={0.3}
            rx={4}
          />
        ) : null}

        {/* Levels */}
        {levels.map((level, index) => {
          const y = yForPrice(level.price);
          const isRes = level.type === "res";
          const isSup = level.type === "sup";
          const color = isRes
            ? "var(--color-bear)"
            : isSup
              ? "var(--color-bull)"
              : "var(--color-caution)";
          const alignRight = index % 2 === 0;
          const lineX1 = alignRight ? centerX : pad.left;
          const lineX2 = alignRight ? width - pad.right : centerX;
          const textX = alignRight ? width - pad.right + 8 : pad.left - 8;
          const textAnchor = alignRight ? "start" : "end";
          const dist = ((level.price - current) / current) * 100;

          return (
            <g key={`${level.price}-${index}`}>
              <line
                x1={lineX1}
                y1={y}
                x2={lineX2}
                y2={y}
                stroke={color}
                strokeWidth={level.tag === "current" ? 3 : 1.5}
                strokeOpacity={0.8}
              />
              <circle cx={centerX} cy={y} r={4} fill={color} />
              <text
                x={textX}
                y={y + 4}
                textAnchor={textAnchor}
                fill="var(--color-text-secondary)"
                fontSize={11}
              >
                {formatCurrency(level.price)}
                {level.tag ? ` · ${level.tag}` : ""}
              </text>
              <text
                x={textX}
                y={y + 17}
                textAnchor={textAnchor}
                fill={color}
                fontSize={10}
              >
                {formatPercent(dist)}
              </text>
            </g>
          );
        })}

        {/* Current price */}
        <g>
          <line
            x1={pad.left}
            y1={yForPrice(current)}
            x2={width - pad.right}
            y2={yForPrice(current)}
            stroke="var(--color-text-primary)"
            strokeWidth={2}
            strokeDasharray="6 4"
          />
          <text
            x={centerX}
            y={yForPrice(current) - 8}
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize={12}
            fontWeight={600}
          >
            {language === "en" ? "Current" : "Güncel"} {formatCurrency(current)}
          </text>
        </g>

        {/* Stop */}
        {stop ? (
          <g>
            <line
              x1={pad.left}
              y1={yForPrice(stop)}
              x2={width - pad.right}
              y2={yForPrice(stop)}
              stroke="var(--color-bear)"
              strokeWidth={2}
              strokeDasharray="2 2"
            />
            <text
              x={pad.left - 8}
              y={yForPrice(stop) + 4}
              textAnchor="end"
              fill="var(--color-bear)"
              fontSize={10}
            >
              {language === "en" ? "Stop" : "Stop"} {formatCurrency(stop)}
            </text>
          </g>
        ) : null}

        {/* Y axis labels */}
        {ticks.map(t => (
          <text
            key={t.price}
            x={pad.left - 8}
            y={t.y + 4}
            textAnchor="end"
            fill="var(--color-text-muted)"
            fontSize={10}
          >
            {formatCurrency(t.price)}
          </text>
        ))}
      </svg>
    </VizContainer>
  );
}
