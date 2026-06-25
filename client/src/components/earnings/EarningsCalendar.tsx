import { useMemo, useState } from "react";
import { CalendarDays, SlidersHorizontal, Star } from "lucide-react";
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
  const [timeFilter, setTimeFilter] = useState<"all" | EarningsTime>("all");
  const [importanceFilter, setImportanceFilter] = useState<"all" | "high">("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const sectors = useMemo(
    () =>
      Array.from(
        new Set(
          events
            .map(event => event.sector?.trim())
            .filter((sector): sector is string => Boolean(sector))
        )
      )
        .sort((left, right) => left.localeCompare(right))
        .slice(0, 8),
    [events]
  );
  const filteredEvents = useMemo(
    () =>
      events.filter(event => {
        if (timeFilter !== "all" && event.time !== timeFilter) {
          return false;
        }

        if (importanceFilter === "high" && event.importance < 3) {
          return false;
        }

        if (sectorFilter !== "all" && event.sector !== sectorFilter) {
          return false;
        }

        return true;
      }),
    [events, importanceFilter, sectorFilter, timeFilter]
  );
  const { weeks, monthNames } = useMemo(() => buildCalendar(filteredEvents), [filteredEvents]);
  const dayLabels = language === "en" ? DAYS : DAY_LABELS_TR;
  const visibleCount = filteredEvents.length;

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
          <span className="rounded-full border border-white/10 bg-slate-800/50 px-3 py-1.5 font-semibold text-slate-300">
            {visibleCount} {copy(language, "event", "events")}
          </span>
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

      <div className="mb-4 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          <SlidersHorizontal className="size-3.5" />
          {copy(language, "Takvim filtreleri", "Calendar filters")}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterChip
            active={timeFilter === "all"}
            label={copy(language, "Tum zamanlar", "All times")}
            onClick={() => setTimeFilter("all")}
          />
          <FilterChip
            active={timeFilter === "BMO"}
            label="BMO"
            onClick={() => setTimeFilter("BMO")}
          />
          <FilterChip
            active={timeFilter === "AMC"}
            label="AMC"
            onClick={() => setTimeFilter("AMC")}
          />
          <FilterChip
            active={importanceFilter === "high"}
            label={copy(language, "Yuksek onem", "High importance")}
            onClick={() =>
              setImportanceFilter(value => (value === "high" ? "all" : "high"))
            }
          />
        </div>
        {sectors.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <FilterChip
              active={sectorFilter === "all"}
              label={copy(language, "Tum sektorler", "All sectors")}
              onClick={() => setSectorFilter("all")}
            />
            {sectors.map(sector => (
              <FilterChip
                key={sector}
                active={sectorFilter === sector}
                label={sector}
                onClick={() => setSectorFilter(sector)}
              />
            ))}
          </div>
        ) : null}
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
        {dayLabels.map((d, index) => (
          <div
            key={d}
            className={cn(
              "text-center text-xs font-bold uppercase tracking-wider",
              index >= 5 ? "text-slate-600" : "text-slate-400"
            )}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {filteredEvents.length > 0 ? (
        <div className="mt-3 space-y-2">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-2">
              {week.map((day, di) => (
                <DayCell
                  key={`${wi}-${di}`}
                  day={day}
                  isWeekend={di >= 5}
                  language={language}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-2xl border border-dashed border-slate-700 bg-slate-900/35 px-4 py-8 text-center">
          <p className="text-sm font-semibold text-slate-300">
            {copy(
              language,
              "Bu filtre kombinasyonunda event yok.",
              "No events match this filter combination."
            )}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {copy(
              language,
              "Zaman, onem veya sektor secimini gevsetin.",
              "Relax the time, importance, or sector filter."
            )}
          </p>
        </div>
      )}

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
  isWeekend,
}: {
  language: AppLanguage;
  day: CalendarDay;
  isWeekend: boolean;
}) {
  if (!day.date) {
    return (
      <div
        className={cn(
          "min-h-[110px] rounded-2xl border border-white/5 bg-slate-900/30 md:min-h-[130px]",
          isWeekend ? "opacity-55" : ""
        )}
      />
    );
  }

  const parsed = new Date(day.date);
  const dayNum = parsed.getDate();
  const isCurrentMonth = day.isCurrentMonth;
  const hasHighImportance = day.events.some(e => e.importance >= 3);
  const maxStars = day.events.reduce((max, e) => Math.max(max, e.importance), 0);
  const intensityScore = day.events.reduce(
    (sum, event) => sum + Math.min(event.importance, 3),
    0
  );
  const heatClass =
    intensityScore >= 8
      ? "border-sky-400/30 bg-sky-500/18"
      : intensityScore >= 4
        ? "border-sky-500/20 bg-sky-500/10"
        : intensityScore > 0
          ? "border-white/10 bg-slate-800/55"
          : isCurrentMonth
            ? "border-white/5 bg-slate-900/30"
            : "border-white/5 border-dashed bg-slate-900/20";

  return (
    <div
      className={cn(
        "group relative min-h-[110px] rounded-2xl border p-2.5 transition-all duration-300 md:min-h-[130px] md:p-3",
        heatClass,
        !isCurrentMonth && day.events.length > 0 ? "border-dashed" : "",
        isWeekend ? "opacity-75" : "",
        day.events.length > 0
          ? "hover:-translate-y-0.5 hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-500/5"
          : ""
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
        <div className="invisible absolute left-1/2 top-full z-30 mt-2 w-72 -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-900/95 p-4 opacity-0 shadow-2xl backdrop-blur-md transition-opacity duration-150 group-hover:visible group-hover:opacity-100 md:left-full md:top-0 md:ml-2 md:mt-0 md:translate-x-0">
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
                    <a
                      href={`/earnings/${e.ticker}`}
                      className="font-bold text-white transition-colors hover:text-sky-400"
                    >
                      {e.ticker}
                    </a>
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

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "border-sky-500/30 bg-sky-500/15 text-sky-300"
          : "border-white/10 bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
      )}
    >
      {label}
    </button>
  );
}

function EventPill({ event }: { event: EarningsEvent }) {
  return (
    <a
      href={`/earnings/${event.ticker}`}
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
    </a>
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
