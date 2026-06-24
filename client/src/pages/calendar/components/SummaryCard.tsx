import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { CalendarDayReport, CalendarImportance } from "@shared/calendar";
import { THEME } from "../Calendar.theme";
import { CompactStatCard } from "./CompactStatCard";
import { DayThemeBadge } from "./DayThemeBadge";
import { MarketSessionIndicator } from "./MarketSessionIndicator";

export function SummaryCard({
  report,
  language,
  onFilter,
}: {
  report: CalendarDayReport;
  language: AppLanguage;
  onFilter?: (importance: CalendarImportance | "all") => void;
}) {
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
          <CompactStatCard
            label={copy(language, "VIX", "VIX")}
            value={report.vixOutlook || "-"}
            hint={copy(
              language,
              "Volatilite gorusu",
              "Volatility outlook"
            )}
          />
          <CompactStatCard
            label={copy(language, "Fear & Greed", "Fear & Greed")}
            value={report.fearGreedOutlook || "-"}
            hint={copy(
              language,
              "Piyasa duyarlilik gorusu",
              "Market sentiment outlook"
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
