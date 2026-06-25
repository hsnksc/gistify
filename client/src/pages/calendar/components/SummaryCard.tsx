import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { CalendarDayReport, CalendarImportance } from "@shared/calendar";
import { THEME } from "../Calendar.theme";
import { CompactStatCard } from "./CompactStatCard";
import { DayThemeBadge } from "./DayThemeBadge";
import { MarketSessionIndicator } from "./MarketSessionIndicator";

function parseVixNumber(text: string | undefined): number | null {
  if (!text) return null;
  const match = text.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function parseFearGreedNumber(text: string | undefined): number | null {
  if (!text) return null;
  const match = text.match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

function VixGauge({ value }: { value: number | null }) {
  if (value === null) return null;
  const pct = Math.min((value / 50) * 100, 100);
  let color = "bg-emerald-500";
  if (value >= 30) color = "bg-rose-500";
  else if (value >= 22) color = "bg-amber-500";
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">VIX</span>
        <span className="text-sm font-bold tabular-nums text-foreground">{value.toFixed(2)}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
        <span>0</span>
        <span>25</span>
        <span>50</span>
      </div>
    </div>
  );
}

function FearGreedGauge({ value }: { value: number | null }) {
  if (value === null) return null;
  const pct = Math.min(value, 100);
  let color = "bg-emerald-500";
  if (value <= 25) color = "bg-rose-500";
  else if (value <= 45) color = "bg-amber-500";
  else if (value <= 55) color = "bg-slate-400";
  else if (value <= 75) color = "bg-emerald-400";
  else color = "bg-emerald-500";
  let label = "Neutral";
  if (value <= 25) label = "Extreme Fear";
  else if (value <= 45) label = "Fear";
  else if (value <= 55) label = "Neutral";
  else if (value <= 75) label = "Greed";
  else label = "Extreme Greed";
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">F&G</span>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold tabular-nums text-foreground">{value}</span>
          <span className="text-[9px] text-muted-foreground">{label}</span>
        </div>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}

export function SummaryCard({
  report,
  language,
  onFilter,
}: {
  report: CalendarDayReport;
  language: AppLanguage;
  onFilter?: (importance: CalendarImportance | "all") => void;
}) {
  const vixValue = parseVixNumber(report.vixOutlook);
  const fgValue = parseFearGreedNumber(report.fearGreedOutlook);

  return (
    <Card className={cn("overflow-hidden", THEME.cardClassName)}>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg text-foreground">
              {report.title ||
                copy(
                  language,
                  "Bugunun Makro Olaylari",
                  "Today's Macro Events"
                )}
            </CardTitle>
            <DayThemeBadge events={report.events} language={language} />
          </div>
          <MarketSessionIndicator language={language} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {report.summary ? (
          <p className="text-[13px] leading-6 text-foreground/84">
            {report.summary}
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CompactStatCard
            label={copy(language, "Yuksek Onemli", "High Importance")}
            value={String(report.highImportanceCount)}
            hint={copy(
              language,
              "Bugun takvime giren kritik olay",
              "Critical events on today's calendar"
            )}
            onClick={() => onFilter?.("high")}
          />
          <CompactStatCard
            label={copy(language, "Toplam Olay", "Total Events")}
            value={String(report.events.length)}
            hint={copy(
              language,
              "Tum onem seviyelerindeki olaylar",
              "Events across all importance levels"
            )}
            onClick={() => onFilter?.("all")}
          />
          <div className="rounded-xl border border-white/10 bg-black/20 px-3.5 py-3">
            <VixGauge value={vixValue} />
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 px-3.5 py-3">
            <FearGreedGauge value={fgValue} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
