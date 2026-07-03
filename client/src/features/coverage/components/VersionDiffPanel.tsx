import { ArrowDown, ArrowRight, ArrowUp, GitCompareArrows } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type AppLanguage, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface DiffItem {
  label: string;
  next: string;
  previous: string;
}

interface VersionDiffPanelProps {
  changedMetrics: DiffItem[];
  changedSections: string[];
  hasPrevious: boolean;
  language: AppLanguage;
}

function parseNumeric(value: string): number | null {
  const cleaned = value.replace(/[^\d.-]/g, "");
  if (!cleaned || cleaned === "-" || cleaned === ".") return null;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

function directionOf(previous: string, next: string): "up" | "down" | "flat" {
  const a = parseNumeric(previous);
  const b = parseNumeric(next);
  if (a === null || b === null) return "flat";
  if (b > a) return "up";
  if (b < a) return "down";
  return "flat";
}

function deltaOf(previous: string, next: string): string {
  const a = parseNumeric(previous);
  const b = parseNumeric(next);
  if (a === null || b === null || a === 0) return "";
  const delta = ((b - a) / Math.abs(a)) * 100;
  return `${delta > 0 ? "+" : ""}${delta.toFixed(1)}%`;
}

export default function VersionDiffPanel({
  changedMetrics,
  changedSections,
  hasPrevious,
  language,
}: VersionDiffPanelProps) {
  return (
    <Card className="gap-4" interactive={false}>
      <CardHeader className="gap-2">
        <div className="flex items-center gap-2">
          <GitCompareArrows className="size-4 text-sky-500" />
          <CardTitle>{t("coverage:versionDiff")}</CardTitle>
        </div>
        <CardDescription>
          {hasPrevious
            ? t("coverage:theSelectedVersionIsCompared")
            : t("coverage:thereIsOnlyOneVersion")}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border border-border bg-background/35 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("coverage:changedMetrics")}
          </p>
          <div className="mt-4 space-y-3">
            {changedMetrics.length > 0 ? (
              changedMetrics.map(item => {
                const direction = directionOf(item.previous, item.next);
                const delta = deltaOf(item.previous, item.next);
                return (
                  <div
                    key={item.label}
                    className="flex flex-col gap-2 rounded-xl border border-border/80 bg-background/45 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground line-through">
                        {item.previous}
                      </span>
                      {direction !== "flat" ? (
                        direction === "up" ? (
                          <ArrowUp className="size-3 text-emerald-500" />
                        ) : (
                          <ArrowDown className="size-3 text-rose-500" />
                        )
                      ) : (
                        <ArrowRight className="size-3 text-muted-foreground" />
                      )}
                      <span className="text-sm font-semibold text-foreground">{item.next}</span>
                      {delta ? (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px]",
                            direction === "up"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                              : "border-rose-500/30 bg-rose-500/10 text-rose-500"
                          )}
                        >
                          {delta}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("coverage:noMetricDelta")}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background/35 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("coverage:changedSections")}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {changedSections.length > 0 ? (
              changedSections.map(sectionTitle => (
                <Badge
                  key={sectionTitle}
                  variant="outline"
                  className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-100"
                >
                  {sectionTitle}
                </Badge>
              )))
             : (
              <span className="text-sm text-muted-foreground">
                {t("coverage:noSectionLevelDelta")}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
