import { useMemo, useState } from "react";
import { CalendarDays, Star, ChevronLeft, ChevronRight } from "lucide-react";
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
  const { weeks, monthNames, eventMap } = useMemo(
    () => buildCalendar(events, language),
    [events, language]
  );
  const dayLabels = [
    copy(language, "Pzt", "Mon"),
    copy(language, "Sal", "Tue"),
    copy(language, "Çar", "Wed"),
    copy(language, "Per", "Thu"),
    copy(language, "Cum", "Fri"),
    copy(language, "Cmt", "Sat"),
    copy(language, "Paz", "Sun"),
  ];
  const [hoveredTicker, setHoveredTicker] = useState<string | null>(null);

  const bmoCount = events.filter(e => e.time === "BMO").length;
  const amcCount = events.filter(e => e.time === "AMC").length;
  const highCount = events.filter(e => e.importance >= 4).length;

  return (
    <section className="panel overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-5 md:p-6">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10">
            <CalendarDays className="size-5 text-sky-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {copy(language, "Earnings Takvimi", "Earnings Calendar")}
            </h2>
            <p className="text-xs text-slate-400">
              {monthNames.join(" · ")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <Badge
            dot="emerald"
            label={`BMO ${bmoCount}`}
          />
          <Badge
            dot="violet"
            label={`AMC ${amcCount}`}
          />
          <Badge
            icon={<Star className="size-3 text-amber-400" />}
            label={`${copy(language, "Yüksek Önem", "High Imp.")} ${highCount}`}
          />
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 border-b border-white/10 pb-2">
        {dayLabels.map(d => (
          <div
            key={d}
            className="py-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="mt-2 space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((day, di) => (
              <DayCell
                key={`${wi}-${di}`}
                day={day}
                eventMap={eventMap}
                language={language}
                onHover={setHoveredTicker}
                hoveredTicker={hoveredTicker}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-white/10 pt-3 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-emerald-500" />
          BMO
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-violet-500" />
          AMC
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-slate-500" />
          TBA
        </span>
      </div>
    </section>
  );
}

function Badge({
  dot,
  icon,
  label,
}: {
  dot?: "emerald" | "violet" | "amber" | "slate";
  icon?: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-800/50 px-2.5 py-1 text-slate-300">
      {dot ? (
        <span
          className={cn(
            "size-1.5 rounded-full",
            dot === "emerald" && "bg-emerald-500",
            dot === "violet" && "bg-violet-500",
            dot === "amber" && "bg-amber-500",
            dot === "slate" && "bg-slate-500"
          )}
        />
      ) : null}
      {icon}
      {label}
    </span>
  );
}

function DayCell({
  day,
  eventMap,
  language,
  onHover,
  hoveredTicker,
}: {
  day: CalendarDay;
  eventMap: Map<string, EarningsEvent[]>;
  language: AppLanguage;
  onHover: (ticker: string | null) => void;
  hoveredTicker: string | null;
}) {
  if (!day.date) {
    return (
      <div className="min-h-[80px] rounded-xl bg-slate-800/20 p-1.5 md:min-h-[96px]" />
    );
  }

  const events = eventMap.get(day.date) || [];
  const isToday = false;

  return (
    <div
      className={cn(
        "group relative flex min-h-[80px] flex-col rounded-xl border p-1.5 transition-colors md:min-h-[96px]",
        events.length > 0
          ? "border-white/10 bg-slate-800/40 hover:bg-slate-800/60"
          : "border-transparent bg-slate-800/20"
      )}
    >
      <span
        className={cn(
          "self-start rounded-md px-1.5 py-0.5 text-[10px] font-bold",
          isToday
            ? "bg-sky-500 text-white"
            : "text-slate-400 group-hover:text-slate-200"
        )}
      >
        {day.dayOfMonth}
      </span>

      <div className="mt-1 flex flex-1 flex-col gap-1 overflow-hidden">
        {events.map(event => (
          <a
            key={event.ticker}
            href={`/earnings/${event.ticker}`}
            onMouseEnter={() => onHover(event.ticker)}
            onMouseLeave={() => onHover(null)}
            className={cn(
              "flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold transition-all",
              hoveredTicker === event.ticker
                ? "scale-[1.02] border-white/20 bg-slate-700/60"
                : "border-transparent bg-slate-700/30 hover:bg-slate-700/50",
              event.time === "BMO"
                ? "text-emerald-300"
                : event.time === "AMC"
                  ? "text-violet-300"
                  : "text-slate-300"
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                event.time === "BMO" && "bg-emerald-500",
                event.time === "AMC" && "bg-violet-500",
                event.time === "TBA" && "bg-slate-500"
              )}
            />
            <span className="truncate">{event.ticker}</span>
            {event.importance >= 4 ? (
              <Star className="ml-auto size-2.5 shrink-0 text-amber-400" />
            ) : null}
          </a>
        ))}
      </div>
    </div>
  );
}

interface CalendarDay {
  date: string | null;
  dayOfMonth: number | null;
}

function buildCalendar(events: EarningsEvent[], language: "en" | "tr") {
  const eventMap = new Map<string, EarningsEvent[]>();
  const monthSet = new Set<string>();
  let minDate: Date | null = null;
  let maxDate: Date | null = null;

  for (const event of events) {
    if (!event.date) continue;
    const list = eventMap.get(event.date) || [];
    list.push(event);
    eventMap.set(event.date, list);

    const d = new Date(`${event.date}T00:00:00`);
    if (!Number.isNaN(d.getTime())) {
      if (!minDate || d < minDate) minDate = d;
      if (!maxDate || d > maxDate) maxDate = d;
      monthSet.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
  }

  // Sort events within each day by importance desc, then ticker asc
  for (const list of Array.from(eventMap.values())) {
    list.sort((a: EarningsEvent, b: EarningsEvent) => {
      if (b.importance !== a.importance) return b.importance - a.importance;
      return a.ticker.localeCompare(b.ticker);
    });
  }

  const monthNames: string[] = [];
  const monthFormatter = new Intl.DateTimeFormat(language === "en" ? "en-US" : "tr-TR", {
    month: "long",
    year: "numeric",
  });

  if (minDate && maxDate) {
    let cursor = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
    while (cursor <= end) {
      monthNames.push(monthFormatter.format(cursor));
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }
  }

  const weeks: CalendarDay[][] = [];

  if (!minDate || !maxDate) {
    return { weeks, monthNames, eventMap };
  }

  const start = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const end = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0);

  // Adjust start to Monday
  const startDay = start.getDay(); // 0 = Sunday
  const mondayOffset = startDay === 0 ? -6 : 1 - startDay;
  const cursor = new Date(start);
  cursor.setDate(cursor.getDate() + mondayOffset);

  while (cursor <= end) {
    const week: CalendarDay[] = [];
    for (let i = 0; i < 7; i++) {
      const dateStr = cursor.toISOString().slice(0, 10);
      const inRange = cursor >= start && cursor <= end;
      week.push({
        date: inRange ? dateStr : null,
        dayOfMonth: inRange ? cursor.getDate() : null,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return { weeks, monthNames, eventMap };
}
