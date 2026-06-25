import { useMemo } from "react";
import { CalendarDays, Star } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { EarningsEvent, EarningsTime } from "@shared/earnings";

interface EarningsCalendarProps {
  language: AppLanguage;
  events: EarningsEvent[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_LABELS_TR = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export default function EarningsCalendar({
  language,
  events,
}: EarningsCalendarProps) {
  const { weeks, monthNames } = useMemo(() => buildCalendar(events), [events]);
  const dayLabels = language === "en" ? DAYS : DAY_LABELS_TR;

  return (
    <section className={cn(
      "panel p-6 md:p-8",
      "bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm"
    )}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10">
            <CalendarDays className="size-5 text-sky-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {copy(language, "Earnings Takvimi", "Earnings Calendar")}
            </h2>
            <p className="text-xs text-slate-400">
              {copy(language, "BMO: Açılış Öncesi", "BMO: Before Market Open")} · {copy(language, "AMC: Kapanış Sonrası", "AMC: After Market Close")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/50 px-3 py-1.5">
            <span className="inline-block size-2.5 rounded-full bg-emerald-500" />
            BMO
          </span>
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/50 px-3 py-1.5">
            <span className="inline-block size-2.5 rounded-full bg-violet-500" />
            AMC
          </span>
        </div>
      </div>

      {/* Month pills */}
      <div className="mb-4 flex items-center gap-3">
        {monthNames.map((m, i) => (
          <span
            key={m}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-bold",
              i === 0
                ? "border border-sky-500/30 bg-sky-500/15 text-sky-400"
                : "border border-white/10 bg-slate-800/50 text-slate-400"
            )}
          >
            {m}
          </span>
        ))}
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 border-b border-white/10 pb-3">
        {dayLabels.map(d => (
          <div
            key={d}
            className="text-center text-xs font-bold uppercase tracking-wider text-slate-400"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="mt-3 space-y-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-2">
            {week.map((day, di) => (
              <DayCell
                key={`${wi}-${di}`}
                language={language}
                day={day}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-4 border-t border-white/10 pt-4 text-xs text-slate-500">
        <span className="flex items-center gap-2">
          <Star className="size-3.5 text-amber-400" />
          {copy(language, "Yüksek Önem", "High Importance")}
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block size-3 rounded border border-slate-700 border-dashed" />
          {copy(language, "Sonraki Ay", "Next Month")}
        </span>
      </div>
    </section>
  );
}

function DayCell({
  language,
  day,
}: {
  language: AppLanguage;
  day: CalendarDay;
}) {
  if (!day.date) {
    return (
      <div className="min-h-[110px] rounded-2xl border border-white/5 bg-slate-900/30 md:min-h-[130px]" />
    );
  }

  const parsed = new Date(day.date);
  const dayNum = parsed.getDate();
  const isCurrentMonth = day.isCurrentMonth;
  const hasHighImportance = day.events.some(e => e.importance >= 3);
  const maxStars = day.events.reduce((max, e) => Math.max(max, e.importance), 0);

  return (
    <div
      className={cn(
        "group relative min-h-[110px] rounded-2xl border p-2.5 transition-all duration-300 md:min-h-[130px] md:p-3",
        day.events.length > 0
          ? isCurrentMonth
            ? "border-white/10 bg-slate-800/50 hover:-translate-y-0.5 hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-500/5"
            : "border-white/5 border-dashed bg-slate-800/30 hover:-translate-y-0.5 hover:border-sky-500/20 hover:shadow-lg hover:shadow-sky-500/5"
          : isCurrentMonth
            ? "border-white/5 bg-slate-900/30"
            : "border-white/5 border-dashed bg-slate-900/20"
      )}
    >
      {/* Day number + importance indicator */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-sm font-bold",
            isCurrentMonth ? "text-slate-200" : "text-slate-600"
          )}
        >
          {dayNum}
        </span>
        {hasHighImportance && (
          <div className="flex items-center gap-0.5">
            {Array.from({ length: Math.min(maxStars, 3) }).map((_, i) => (
              <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
        )}
      </div>

      {/* Event chips stacked */}
      <div className="mt-2 space-y-1.5">
        {day.events.slice(0, 4).map(event => (
          <EventPill key={event.ticker} event={event} />
        ))}
        {day.events.length > 4 && (
          <span className="block text-center text-[10px] font-medium text-slate-500">
            +{day.events.length - 4}
          </span>
        )}
      </div>

      {/* Hover tooltip — detailed */}
      {day.events.length > 0 && (
        <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-72 -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md group-hover:block md:left-full md:top-0 md:ml-2 md:mt-0 md:translate-x-0">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-sky-400">
            {day.date}
          </p>
          <div className="space-y-3">
            {day.events.map(e => (
              <div
                key={e.ticker}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-slate-800/50 p-2.5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{e.ticker}</span>
                    <TimeBadge time={e.time} />
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-slate-400">{e.company}</p>
                  {(e as unknown as { sector?: string }).sector && (
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      {(e as unknown as { sector?: string }).sector}
                    </p>
                  )}
                  {(e as unknown as { marketCap?: string }).marketCap && (
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      {(e as unknown as { marketCap?: string }).marketCap}
                    </p>
                  )}
                  {(e as unknown as { strategy?: string }).strategy && (
                    <p className="mt-1 text-[10px] font-medium text-sky-400/80">
                      {(e as unknown as { strategy?: string }).strategy}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: Math.min(e.importance, 3) }).map((_, i) => (
                    <Star key={i} className="size-2.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EventPill({ event }: { event: EarningsEvent }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border px-2 py-1 text-[10px] font-medium transition-all hover:scale-[1.02]",
        event.time === "BMO"
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
          : event.time === "AMC"
            ? "border-violet-500/20 bg-violet-500/10 text-violet-300"
            : "border-white/5 bg-slate-800/50 text-slate-300"
      )}
      title={event.company}
    >
      <span className="font-bold">{event.ticker}</span>
      <span className="opacity-70">{event.time}</span>
    </div>
  );
}

function TimeBadge({ time }: { time: EarningsTime }) {
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5 text-[10px] font-bold",
        time === "BMO"
          ? "bg-emerald-500/15 text-emerald-400"
          : time === "AMC"
            ? "bg-violet-500/15 text-violet-400"
            : "bg-slate-700 text-slate-300"
      )}
    >
      {time}
    </span>
  );
}

interface CalendarDay {
  date: string | null;
  events: EarningsEvent[];
  isCurrentMonth: boolean;
}

function buildCalendar(events: EarningsEvent[]) {
  const grouped: Record<string, EarningsEvent[]> = {};
  for (const e of events) {
    if (!grouped[e.date]) grouped[e.date] = [];
    grouped[e.date].push(e);
  }

  const dates = Object.keys(grouped).sort();
  if (dates.length === 0) return { weeks: [] as CalendarDay[][], monthNames: [] };

  const first = new Date(dates[0]);
  const last = new Date(dates[dates.length - 1]);

  const start = new Date(first);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const end = new Date(last);
  end.setDate(end.getDate() + ((7 - end.getDay()) % 7));

  const weeks: CalendarDay[][] = [];
  let current: CalendarDay[] = [];
  const cur = new Date(start);
  const currentMonth = first.getMonth();
  const monthNamesSet = new Set<string>();

  while (cur <= end) {
    const iso = cur.toISOString().split("T")[0];
    const eventsForDay = grouped[iso] || [];
    const isCurrentMonth = cur.getMonth() === currentMonth;
    if (isCurrentMonth) {
      monthNamesSet.add(
        cur.toLocaleString("en-US", { month: "long" })
      );
    }
    current.push({
      date: iso,
      events: eventsForDay,
      isCurrentMonth,
    });
    if (current.length === 7) {
      weeks.push(current);
      current = [];
    }
    cur.setDate(cur.getDate() + 1);
  }

  return { weeks, monthNames: Array.from(monthNamesSet) };
}
