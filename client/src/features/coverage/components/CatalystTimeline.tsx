import { type AppLanguage, t } from "@/lib/i18n";

import { cn } from "@/lib/utils";

export interface CatalystTimelineProps {
  items: Array<{
    olay: string;
    onem?: string;
    tarih: string;
  }>;
  language?: AppLanguage;
}

// Validated against the dark surface (#0a0e1a).
const CRITICAL_COLOR = "#f43f5e";
const HIGH_COLOR = "#d97706";
const MEDIUM_COLOR = "#0284c7";
const DEFAULT_COLOR = "#71717a";

const importanceColor = (onem?: string) => {
  if (!onem) return DEFAULT_COLOR;
  const o = onem.toLowerCase();
  if (o.includes("kritik") || o.includes("critical") || o.includes("🔴"))
    return CRITICAL_COLOR;
  if (o.includes("yuksek") || o.includes("yüksek") || o.includes("high") || o.includes("🟠"))
    return HIGH_COLOR;
  if (o.includes("orta") || o.includes("medium") || o.includes("🟡"))
    return MEDIUM_COLOR;
  return DEFAULT_COLOR;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export default function CatalystTimeline({
  items,
  language = "en",
}: CatalystTimelineProps) {
  const today = new Date().toISOString().slice(0, 10);

  const isPast = (tarih: string) => ISO_DATE.test(tarih) && tarih < today;
  const daysUntil = (tarih: string) => {
    if (!ISO_DATE.test(tarih)) return undefined;
    const diff = Math.round(
      (new Date(`${tarih}T00:00:00Z`).getTime() -
        new Date(`${today}T00:00:00Z`).getTime()) /
        86_400_000
    );
    return diff >= 0 ? diff : undefined;
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-background/30 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {t("coverage:catalystTimeline")}
      </p>

      <div className="relative space-y-4 pl-5">
        {/* Vertical line */}
        <div className="absolute top-1 bottom-1 left-[7px] w-px bg-border" />

        {items.map((item, index) => {
          const past = isPast(item.tarih);
          const critical = item.olay.includes("**");
          const cleanOlay = item.olay.replace(/\*\*/g, "");
          const color = importanceColor(item.onem);
          const days = past ? undefined : daysUntil(item.tarih);

          return (
            <div key={index} className="relative flex items-start gap-3.5">
              {/* Node: importance color, surface ring; critical events get the big node */}
              <span
                className={cn(
                  "relative z-10 shrink-0 rounded-full border-2",
                  critical ? "mt-0.5 size-4" : "mt-1 size-3"
                )}
                style={{
                  backgroundColor: past ? "transparent" : color,
                  borderColor: color,
                  opacity: past ? 0.45 : 1,
                }}
                aria-hidden
              />

              <div className={cn("flex-1", past && "opacity-50")}>
                <p className="flex flex-wrap items-center gap-2 text-xs font-medium tabular-nums text-muted-foreground">
                  <span className={cn(critical && "text-foreground")}>
                    {item.tarih}
                  </span>
                  {days !== undefined && days <= 90 && (
                    <span className="rounded-full border border-border bg-background/60 px-1.5 py-px text-[10px] text-muted-foreground">
                      {days === 0
                        ? language === "tr"
                          ? "bugün"
                          : "today"
                        : language === "tr"
                          ? `${days} gün kaldı`
                          : `in ${days}d`}
                    </span>
                  )}
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
