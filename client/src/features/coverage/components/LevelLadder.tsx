import { type AppLanguage } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
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

export default function LevelLadder({
  language = "en",
  levels,
  price,
}: LevelLadderProps) {
  const sorted = [...levels].sort((a, b) => b.seviye - a.seviye);

  const typeColor = (tur: string) => {
    const t = tur.toLowerCase().trim();
    if (t.includes("destek")) return "bg-sky-500/20 border-sky-500/40 text-sky-200";
    if (t.includes("direnc")) return "bg-rose-500/20 border-rose-500/40 text-rose-200";
    return "bg-violet-500/20 border-violet-500/40 text-violet-200";
  };

  const typeIcon = (tur: string) => {
    const t = tur.toLowerCase().trim();
    if (t.includes("destek")) return <ArrowDown className="size-3.5 text-sky-300" />;
    if (t.includes("direnc")) return <ArrowUp className="size-3.5 text-rose-300" />;
    return <Minus className="size-3.5 text-violet-300" />;
  };

  const starCount = (guc: string) => {
    const match = guc.match(/★/g);
    return match ? match.length : 0;
  };

  return (
    <div className="space-y-3 rounded-xl border border-border bg-background/30 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {copy(language, "Seviye Merdiveni", "Level Ladder")}
      </p>

      <div className="space-y-2">
        {sorted.map((level, index) => {
          const stars = starCount(level.guc);
          const isNearPrice =
            price !== undefined &&
            Math.abs(level.seviye - price) / price < 0.05;

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                typeColor(level.tur),
                isNearPrice && "ring-1 ring-amber-500/50"
              )}
            >
              <div className="flex items-center gap-1.5">
                {typeIcon(level.tur)}
                <span className="text-sm font-bold tabular-nums">
                  ${level.seviye.toFixed(2)}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1.5 rounded-full",
                        i < stars
                          ? level.tur.toLowerCase().includes("destek")
                            ? "bg-sky-400"
                            : level.tur.toLowerCase().includes("direnc")
                              ? "bg-rose-400"
                              : "bg-violet-400"
                          : "bg-background/50"
                      )}
                      style={{ width: `${12 + i * 4}px` }}
                    />
                  ))}
                </div>
              </div>

              <span className="text-[11px] text-muted-foreground">
                {level.tur}
              </span>

              {isNearPrice && (
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-200">
                  {copy(language, "Mevcut", "Current")}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {price !== undefined && (
        <p className="text-xs text-muted-foreground">
          {copy(language, "Mevcut fiyat", "Current price")}: ${price.toFixed(2)}
        </p>
      )}
    </div>
  );
}
