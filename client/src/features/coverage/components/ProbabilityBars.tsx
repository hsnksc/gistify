import { type AppLanguage, t } from "@/lib/i18n";

export interface ProbabilityBarsProps {
  items: Array<{
    label: string;
    probability: number;
  }>;
  language?: AppLanguage;
}

// Fixed categorical order, validated against the dark surface (#0a0e1a);
// color follows the scenario's position in the list, never recomputed.
const PALETTE = ["#0284c7", "#059669", "#8b5cf6", "#d97706", "#f43f5e"];

const colorFor = (index: number) => PALETTE[index % PALETTE.length];

export default function ProbabilityBars({
  items,
  language = "en",
}: ProbabilityBarsProps) {
  const total = items.reduce((sum, item) => sum + item.probability, 0);
  const normalized =
    total > 0 ? items.map(item => (item.probability / total) * 100) : [];

  return (
    <div className="space-y-4 rounded-xl border border-border bg-background/30 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {t("coverage:probabilityDistribution")}
      </p>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="inline-flex min-w-0 items-center gap-2 text-muted-foreground">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: colorFor(index) }}
                  aria-hidden
                />
                <span className="truncate">{item.label}</span>
              </span>
              <span className="shrink-0 font-semibold tabular-nums text-foreground">
                {item.probability}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-border/40">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${normalized[index] || 0}%`,
                  backgroundColor: colorFor(index),
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Stacked strip: same colors as the rows, 2px surface gaps between segments */}
      <div className="flex h-3 w-full items-stretch gap-0.5">
        {items.map((item, index) => (
          <div
            key={index}
            className="h-full min-w-1 rounded-[3px] transition-all first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${normalized[index] || 0}%`,
              backgroundColor: colorFor(index),
            }}
            title={`${item.label}: ${item.probability}%`}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {t("coverage:total")}: {total}%
      </p>
    </div>
  );
}
