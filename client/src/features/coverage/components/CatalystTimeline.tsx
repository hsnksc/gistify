import { type AppLanguage } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CatalystTimelineProps {
  items: Array<{
    olay: string;
    onem?: string;
    tarih: string;
  }>;
  language?: AppLanguage;
}

export default function CatalystTimeline({
  items,
  language = "en",
}: CatalystTimelineProps) {
  const today = new Date().toISOString().slice(0, 10);

  const isPast = (tarih: string) => tarih < today;
  const isCritical = (olay: string) => olay.includes("**");
  const importanceColor = (onem?: string) => {
    if (!onem) return "bg-zinc-400";
    const o = onem.toLowerCase();
    if (o.includes("kritik") || o.includes("🔴")) return "bg-rose-400";
    if (o.includes("yuksek") || o.includes("🟠")) return "bg-amber-400";
    if (o.includes("orta") || o.includes("🟡")) return "bg-yellow-400";
    return "bg-zinc-400";
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-background/30 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {copy(language, "Katalizor Takvimi", "Catalyst Timeline")}
      </p>

      <div className="relative space-y-4 pl-4">
        {/* Vertical line */}
        <div className="absolute top-0 bottom-0 left-[7px] w-px bg-border" />

        {items.map((item, index) => {
          const past = isPast(item.tarih);
          const critical = isCritical(item.olay);
          const cleanOlay = item.olay.replace(/\*\*/g, "");

          return (
            <div key={index} className="relative flex items-start gap-4">
              <div className="relative z-10 mt-0.5">
                <Circle
                  className={cn(
                    "size-3.5 fill-current",
                    importanceColor(item.onem),
                    past && "opacity-40"
                  )}
                />
              </div>

              <div className={cn("flex-1", past && "opacity-50")}>
                <p
                  className={cn(
                    "text-xs font-medium tabular-nums text-muted-foreground",
                    critical && "text-foreground"
                  )}
                >
                  {item.tarih}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-sm leading-relaxed",
                    critical
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {cleanOlay}
                </p>
                {item.onem && (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {item.onem}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
