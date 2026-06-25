import { CalendarDays } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { EarningsEvent, EarningsTime } from "@shared/earnings";

interface EarningsCalendarProps {
  language: AppLanguage;
  events: EarningsEvent[];
}

export default function EarningsCalendar({
  language,
  events,
}: EarningsCalendarProps) {
  const grouped = groupByDate(events);
  const sortedDates = Object.keys(grouped).sort();

  return (
    <section className="panel p-4">
      <div className="mb-3 flex items-center gap-2">
        <CalendarDays className="size-4 text-sky-300" />
        <h2 className="heading-condensed text-base">
          {copy(language, "Earnings Takvimi", "Earnings Calendar")}
        </h2>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {sortedDates.map(date => (
          <DayRow
            key={date}
            language={language}
            date={date}
            events={grouped[date]}
          />
        ))}
      </div>
    </section>
  );
}

function DayRow({
  language,
  date,
  events,
}: {
  language: AppLanguage;
  date: string;
  events: EarningsEvent[];
}) {
  const parsed = new Date(date);
  const dateLabel = Number.isNaN(parsed.getTime())
    ? date
    : new Intl.DateTimeFormat(language === "en" ? "en-US" : "tr-TR", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(parsed);

  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {dateLabel}
      </p>
      <div className="flex flex-wrap gap-2">
        {events.map(event => (
          <EventChip key={event.ticker} language={language} event={event} />
        ))}
      </div>
    </div>
  );
}

function EventChip({
  language,
  event,
}: {
  language: AppLanguage;
  event: EarningsEvent;
}) {
  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs",
        event.time === "BMO"
          ? "border-emerald-500/20 bg-emerald-500/10"
          : event.time === "AMC"
            ? "border-purple-500/20 bg-purple-500/10"
            : "border-border bg-background"
      )}
      title={event.company}
    >
      <span className="font-semibold text-foreground">{event.ticker}</span>
      <span className="text-muted-foreground">{event.time}</span>
      <span className="text-[10px]">{"⭐".repeat(event.importance)}</span>
      <div className="pointer-events-none absolute left-0 top-full z-10 mt-2 hidden w-56 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md group-hover:block">
        <p className="font-semibold">{event.company || event.ticker}</p>
        {event.sector && (
          <p className="text-xs text-muted-foreground">{event.sector}</p>
        )}
        {event.marketCap && (
          <p className="text-xs text-muted-foreground">
            {copy(language, "Piyasa Değeri", "Market Cap")}: {event.marketCap}
          </p>
        )}
        {event.strategy && (
          <p className="mt-1 text-xs">{event.strategy}</p>
        )}
      </div>
    </div>
  );
}

function groupByDate(events: EarningsEvent[]) {
  const map: Record<string, EarningsEvent[]> = {};
  for (const event of events) {
    if (!map[event.date]) map[event.date] = [];
    map[event.date].push(event);
  }
  return map;
}
