import { cn } from "@/lib/utils";

export interface RSIGaugeProps {
  language?: "tr" | "en";
  rsi: number;
}

export default function RSIGauge({ rsi, language = "tr" }: RSIGaugeProps) {
  const t = (tr: string, en: string) => (language === "tr" ? tr : en);

  const clamped = Math.max(0, Math.min(100, rsi));
  const angle = (clamped / 100) * 180 - 90; // -90 to +90 degrees

  const zoneColor = () => {
    if (clamped < 30) return "text-emerald-400";
    if (clamped > 70) return "text-rose-400";
    return "text-amber-400";
  };

  const zoneLabel = () => {
    if (clamped < 30) return t("Aşırı Satım (Fırsat)", "Oversold (Opportunity)");
    if (clamped > 70) return t("Aşırı Alım (Risk)", "Overbought (Risk)");
    return t("Nötr", "Neutral");
  };

  return (
    <div className="rounded-xl border border-border bg-background/40 p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">RSI</h3>
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 200 190" className="w-full max-w-[240px]">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            className="text-border/40"
          />
          {/* Zones */}
          <path
            d="M 20 100 A 80 80 0 0 1 68 30.7"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="butt"
            className="text-emerald-500/30"
          />
          <path
            d="M 68 30.7 A 80 80 0 0 1 132 30.7"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="butt"
            className="text-amber-500/30"
          />
          <path
            d="M 132 30.7 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="butt"
            className="text-rose-500/30"
          />
          {/* Tick marks */}
          {[0, 30, 50, 70, 100].map(val => {
            const a = (val / 100) * 180 - 90;
            const rad = (a * Math.PI) / 180;
            const x1 = 100 + 68 * Math.cos(rad);
            const y1 = 100 + 68 * Math.sin(rad);
            const x2 = 100 + 80 * Math.cos(rad);
            const y2 = 100 + 80 * Math.sin(rad);
            return (
              <g key={val}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.5" className="text-foreground/30" />
                <text
                  x={100 + 50 * Math.cos(rad)}
                  y={100 + 50 * Math.sin(rad) + 4}
                  textAnchor="middle"
                  fontSize="8"
                  className="fill-muted-foreground"
                >
                  {val}
                </text>
              </g>
            );
          })}
          {/* Needle */}
          <line
            x1="100"
            y1="100"
            x2={100 + 58 * Math.cos((angle * Math.PI) / 180)}
            y2={100 + 58 * Math.sin((angle * Math.PI) / 180)}
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={cn(zoneColor())}
          />
          {/* Needle tip */}
          <circle
            cx={100 + 58 * Math.cos((angle * Math.PI) / 180)}
            cy={100 + 58 * Math.sin((angle * Math.PI) / 180)}
            r="4"
            className={cn("fill-current", zoneColor())}
          />
          {/* Center dot */}
          <circle cx="100" cy="100" r="4" className={cn("fill-current", zoneColor())} />
        </svg>
        <div className="mt-2 text-center">
          <p className={cn("text-2xl font-bold", zoneColor())}>{clamped.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">{zoneLabel()}</p>
        </div>
      </div>
    </div>
  );
}
