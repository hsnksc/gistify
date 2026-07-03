import { type AppLanguage, t } from "@/lib/i18n";


export interface ProbabilityBarsProps {
  items: Array<{
    label: string;
    probability: number;
  }>;
  language?: AppLanguage;
}

export default function ProbabilityBars({
  items,
  language = "en",
}: ProbabilityBarsProps) {
  const total = items.reduce((sum, item) => sum + item.probability, 0);
  const normalized =
    total > 0 ? items.map((item) => (item.probability / total) * 100) : [];

  const colorSpectrum = (index: number, totalItems: number): string => {
    const ratio = index / Math.max(totalItems - 1, 1);
    // Green -> Yellow -> Red spectrum
    if (ratio < 0.5) {
      return `rgba(34, 197, 94, ${0.5 + ratio})`; // emerald
    }
    return `rgba(244, 63, 94, ${0.3 + ratio * 0.7})`; // rose
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-background/30 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {t("coverage:probabilityDistribution")}
      </p>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-semibold tabular-nums text-foreground">
                {item.probability}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-background/50">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${normalized[index] || 0}%`,
                  backgroundColor: colorSpectrum(index, items.length),
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex h-4 w-full overflow-hidden rounded-full bg-background/50">
        {items.map((item, index) => (
          <div
            key={index}
            className="h-full transition-all"
            style={{
              width: `${normalized[index] || 0}%`,
              backgroundColor: colorSpectrum(index, items.length),
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
