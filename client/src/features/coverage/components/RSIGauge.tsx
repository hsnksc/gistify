export interface RSIGaugeProps {
  language?: "tr" | "en";
  rsi: number;
}

// Validated against the dark surface (#0a0e1a): OKLCH band, chroma, CVD, contrast.
const ZONE_COLORS = {
  oversold: "#059669",
  neutral: "#d97706",
  overbought: "#f43f5e",
} as const;

const CX = 110;
const CY = 112;
const R = 84;
const STROKE = 13;
const ZONE_GAP = 0.9; // in RSI units ≈ 2px surface gap on the arc

// 0 → 180° (left), 100 → 360° (right), sweeping over the top (SVG y-down)
const toAngle = (value: number) => 180 + (value / 100) * 180;

const polar = (angleDeg: number, radius: number) => {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
};

const arcPath = (fromValue: number, toValue: number, radius: number) => {
  const a = polar(toAngle(fromValue), radius);
  const b = polar(toAngle(toValue), radius);
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${radius} ${radius} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
};

export default function RSIGauge({ rsi, language = "tr" }: RSIGaugeProps) {
  const t = (tr: string, en: string) => (language === "tr" ? tr : en);

  const clamped = Math.max(0, Math.min(100, rsi));

  const zone =
    clamped < 30 ? "oversold" : clamped > 70 ? "overbought" : "neutral";
  const zoneColor = ZONE_COLORS[zone];
  const zoneLabel =
    zone === "oversold"
      ? t("Aşırı Satım (Fırsat)", "Oversold (Opportunity)")
      : zone === "overbought"
        ? t("Aşırı Alım (Risk)", "Overbought (Risk)")
        : t("Nötr", "Neutral");

  const tip = polar(toAngle(clamped), R);

  const thresholds = [
    { anchor: "end", value: 30 },
    { anchor: "middle", value: 50 },
    { anchor: "start", value: 70 },
  ] as const;

  return (
    <div className="rounded-xl border border-border bg-background/40 p-5">
      <h3 className="mb-3 text-sm font-semibold text-foreground">RSI</h3>
      <div className="flex flex-col items-center">
        <svg
          viewBox="0 0 220 136"
          className="w-full max-w-[260px]"
          role="img"
          aria-label={`RSI ${clamped.toFixed(2)} — ${zoneLabel}`}
        >
          <title>{`RSI ${clamped.toFixed(2)} — ${zoneLabel}`}</title>

          {/* Muted zone track: 0–30 / 30–70 / 70–100 with surface gaps at the thresholds */}
          <path
            d={arcPath(0, 30 - ZONE_GAP, R)}
            fill="none"
            stroke={ZONE_COLORS.oversold}
            strokeOpacity="0.22"
            strokeWidth={STROKE}
            strokeLinecap="butt"
          />
          <path
            d={arcPath(30 + ZONE_GAP, 70 - ZONE_GAP, R)}
            fill="none"
            stroke={ZONE_COLORS.neutral}
            strokeOpacity="0.22"
            strokeWidth={STROKE}
            strokeLinecap="butt"
          />
          <path
            d={arcPath(70 + ZONE_GAP, 100, R)}
            fill="none"
            stroke={ZONE_COLORS.overbought}
            strokeOpacity="0.22"
            strokeWidth={STROKE}
            strokeLinecap="butt"
          />

          {/* Value arc from 0 to the current reading, in the active zone's color */}
          {clamped > 0.5 && (
            <path
              d={arcPath(0, clamped, R)}
              fill="none"
              stroke={zoneColor}
              strokeWidth={STROKE}
              strokeLinecap="butt"
            />
          )}

          {/* End marker with a surface ring so it stays legible on the arc */}
          <circle
            cx={tip.x}
            cy={tip.y}
            r="6.5"
            fill={zoneColor}
            stroke="var(--background)"
            strokeWidth="2"
          />

          {/* Threshold labels outside the arc */}
          {thresholds.map(({ anchor, value }) => {
            const pos = polar(toAngle(value), R + 17);
            return (
              <text
                key={value}
                x={pos.x}
                y={pos.y + 3}
                textAnchor={anchor}
                fontSize="9"
                className="fill-muted-foreground"
              >
                {value}
              </text>
            );
          })}

          {/* Scale extremes on the baseline */}
          <text
            x={CX - R}
            y={CY + 16}
            textAnchor="middle"
            fontSize="9"
            className="fill-muted-foreground"
          >
            0
          </text>
          <text
            x={CX + R}
            y={CY + 16}
            textAnchor="middle"
            fontSize="9"
            className="fill-muted-foreground"
          >
            100
          </text>

          {/* Reading, centered in the gauge hollow — text stays in text tokens */}
          <text
            x={CX}
            y={CY - 8}
            textAnchor="middle"
            fontSize="30"
            fontWeight="700"
            className="fill-foreground"
          >
            {clamped.toFixed(2)}
          </text>
        </svg>

        <div className="mt-1 inline-flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: zoneColor }}
            aria-hidden
          />
          <span className="text-xs text-muted-foreground">{zoneLabel}</span>
        </div>
      </div>
    </div>
  );
}
