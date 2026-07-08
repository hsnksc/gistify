import { type AppLanguage, t as i18nT } from "@/lib/i18n";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LevelLadderProps {
  language?: AppLanguage;
  levels: Array<{
    gerekce?: string;
    guc: string;
    seviye: number;
    tur: string;
  }>;
  price?: number;
}

// Validated against the dark surface (#0a0e1a).
const TYPE_COLORS = {
  pivot: "#8b5cf6",
  resistance: "#f43f5e",
  support: "#0284c7",
} as const;

const PRICE_COLOR = "#d97706";

type LevelType = keyof typeof TYPE_COLORS;

const levelType = (tur: string): LevelType => {
  const t = tur.toLowerCase().trim();
  if (t.includes("destek") || t.includes("support")) return "support";
  if (t.includes("direnc") || t.includes("direnç") || t.includes("resist"))
    return "resistance";
  return "pivot";
};

const starCount = (guc: string) => {
  const match = guc.match(/★/g);
  return match ? Math.min(match.length, 5) : 0;
};

export default function LevelLadder({
  language = "en",
  levels,
  price,
}: LevelLadderProps) {
  const sorted = [...levels].sort((a, b) => b.seviye - a.seviye);

  // Insert the current-price marker in ladder order (levels are sorted descending)
  const priceIndex =
    price === undefined
      ? -1
      : sorted.findIndex(level => level.seviye <= price);
  const markerIndex = price === undefined ? -1 : priceIndex === -1 ? sorted.length : priceIndex;

  const priceMarker =
    price !== undefined ? (
      <div className="flex items-center gap-2" aria-label={`${i18nT("coverage:currentPrice")}: $${price.toFixed(2)}`}>
        <span
          className="h-px flex-1"
          style={{ backgroundColor: PRICE_COLOR, opacity: 0.6 }}
        />
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5"
          style={{ borderColor: PRICE_COLOR }}
        >
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: PRICE_COLOR }}
          />
          <span className="text-[11px] font-semibold tabular-nums text-foreground">
            ${price.toFixed(2)}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {i18nT("coverage:current")}
          </span>
        </span>
        <span
          className="h-px flex-1"
          style={{ backgroundColor: PRICE_COLOR, opacity: 0.6 }}
        />
      </div>
    ) : null;

  return (
    <div className="space-y-3 rounded-xl border border-border bg-background/30 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {i18nT("coverage:levelLadder")}
      </p>

      <div className="space-y-2">
        {sorted.map((level, index) => {
          const type = levelType(level.tur);
          const color = TYPE_COLORS[type];
          const stars = starCount(level.guc);
          const distancePct =
            price !== undefined && price > 0
              ? ((level.seviye - price) / price) * 100
              : undefined;

          const row = (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border border-border/80 bg-background/45 px-3 py-2.5"
              title={level.gerekce || undefined}
            >
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-md"
                style={{ backgroundColor: `${color}2e` }}
              >
                {type === "support" ? (
                  <ArrowDown className="size-3.5" style={{ color }} />
                ) : type === "resistance" ? (
                  <ArrowUp className="size-3.5" style={{ color }} />
                ) : (
                  <Minus className="size-3.5" style={{ color }} />
                )}
              </span>

              <span className="w-20 shrink-0 text-sm font-bold tabular-nums text-foreground">
                ${level.seviye.toFixed(2)}
              </span>

              {/* Strength: 5 equal segments, 2px surface gaps */}
              <div
                className="flex flex-1 items-center gap-0.5"
                aria-label={`${stars}/5`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 w-4 rounded-full",
                      i >= stars && "bg-border/60"
                    )}
                    style={i < stars ? { backgroundColor: color } : undefined}
                  />
                ))}
              </div>

              <span className="hidden text-[11px] text-muted-foreground sm:inline">
                {level.tur}
              </span>

              {distancePct !== undefined && (
                <span className="w-14 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
                  {distancePct >= 0 ? "+" : ""}
                  {distancePct.toFixed(1)}%
                </span>
              )}
            </div>
          );

          return (
            <div key={index} className="space-y-2">
              {index === markerIndex ? priceMarker : null}
              {row}
            </div>
          );
        })}
        {markerIndex === sorted.length ? priceMarker : null}
      </div>
    </div>
  );
}
