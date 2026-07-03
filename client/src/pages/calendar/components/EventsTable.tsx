import { useState } from "react";
import { Globe, Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  ToggleGroup, ToggleGroupItem, } from "@/components/ui/toggle-group";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { type AppLanguage, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@shared/calendar";
import { THEME } from "../Calendar.theme";
import {
  importanceClass,
  importanceLabel,
  importanceRowClass,
  actualHighlightClass,
} from "../calendar.utils";
import { EventRow } from "./EventRow";
import { useExpandedRow } from "../hooks/useExpandedRow";
import { CountdownTimer } from "./CountdownTimer";

export function EventsTable({
  events,
  language,
  initialFilter = "all",
}: {
  events: CalendarEvent[];
  language: AppLanguage;
  initialFilter?: "all" | "high" | "medium" | "low";
}) {
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">(
    initialFilter
  );
  const [sortBy, setSortBy] = useState<"time" | "importance" | "country">(
    "time"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { expandedId, toggle } = useExpandedRow();

  const filtered = events
    .filter((e) => filter === "all" || e.importance === filter)
    .filter(
      (e) =>
        searchQuery === "" ||
        e.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.country.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "time") return a.time.localeCompare(b.time);
      if (sortBy === "importance") {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.importance] - order[b.importance];
      }
      return a.country.localeCompare(b.country);
    });

  const filterCounts = {
    all: events.length,
    high: events.filter((e) => e.importance === "high").length,
    medium: events.filter((e) => e.importance === "medium").length,
    low: events.filter((e) => e.importance === "low").length,
  };

  const headers = [
    t("calendar:time"),
    t("calendar:country"),
    t("common:event"),
    t("calendar:imp"),
    t("calendar:prev"),
    t("calendar:fcst"),
    t("calendar:actual"),
    "",
  ];

  return (
    <Card className={cn("overflow-hidden", THEME.cardClassName)}>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className={cn("size-5", THEME.iconClassName)} />
            {t("calendar:macroEvents")}
            <Badge
              variant="outline"
              className="ml-1 text-[10px] font-medium border-white/10 bg-white/5"
            >
              {filtered.length}
            </Badge>
          </CardTitle>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("calendar:search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-full bg-background/60 pl-8 text-xs border-white/10 focus:border-emerald-500/40"
              />
            </div>
            <ToggleGroup
              type="single"
              value={filter}
              onValueChange={(v) => v && setFilter(v as typeof filter)}
              className="grid h-auto w-full grid-cols-4 gap-1 sm:flex sm:w-auto sm:gap-0.5"
            >
              <ToggleGroupItem
                value="all"
                className="h-8 text-xs px-2.5 data-[state=on]:bg-white/10 data-[state=on]:border-white/20"
              >
                {t("calendar:all")}{" "}
                <span className="ml-1 text-[10px] text-muted-foreground">
                  {filterCounts.all}
                </span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="high"
                className="h-8 text-xs px-2.5 data-[state=on]:bg-rose-500/20 data-[state=on]:border-rose-500/40 data-[state=on]:text-rose-200"
              >
                <span className="mr-1 inline-block size-2 rounded-full bg-rose-500" />
                {t("common:high")}
                <span className="ml-1 text-[10px] text-muted-foreground">
                  {filterCounts.high}
                </span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="medium"
                className="h-8 text-xs px-2.5 data-[state=on]:bg-amber-500/20 data-[state=on]:border-amber-500/40 data-[state=on]:text-amber-200"
              >
                <span className="mr-1 inline-block size-2 rounded-full bg-amber-500" />
                {t("calendar:med")}
                <span className="ml-1 text-[10px] text-muted-foreground">
                  {filterCounts.medium}
                </span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="low"
                className="h-8 text-xs px-2.5 data-[state=on]:bg-emerald-500/20 data-[state=on]:border-emerald-500/40 data-[state=on]:text-emerald-200"
              >
                <span className="mr-1 inline-block size-2 rounded-full bg-emerald-500" />
                {t("common:low")}
                <span className="ml-1 text-[10px] text-muted-foreground">
                  {filterCounts.low}
                </span>
              </ToggleGroupItem>
            </ToggleGroup>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as typeof sortBy)}
            >
              <SelectTrigger className="h-8 w-full bg-background/60 text-xs border-white/10 sm:w-28">
                <SlidersHorizontal className="size-3 mr-1.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time">
                  {t("calendar:time")}
                </SelectItem>
                <SelectItem value="importance">
                  {t("calendar:importance")}
                </SelectItem>
                <SelectItem value="country">
                  {t("calendar:country")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent bg-black/20">
                {headers.map((header, i) => (
                  <TableHead
                    key={i}
                    className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground py-2"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length ? (
                filtered.map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    language={language}
                    isExpanded={expandedId === event.id}
                    onToggle={() => toggle(event.id)}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={headers.length}
                    className="text-sm text-muted-foreground py-6 text-center"
                  >
                    {t("calendar:noResultsFound")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden space-y-2 p-3">
          {filtered.length ? (
            filtered.map((event) => (
              <MobileEventCard
                key={event.id}
                event={event}
                language={language}
                isExpanded={expandedId === event.id}
                onToggle={() => toggle(event.id)}
              />
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-black/15 px-4 py-3 text-sm text-muted-foreground text-center">
              {t("calendar:noResultsFound")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MobileEventCard({
  event,
  language,
  isExpanded,
  onToggle,
}: {
  event: CalendarEvent;
  language: AppLanguage;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-black/20 overflow-hidden",
        importanceRowClass(event.importance),
        event.importance === "high" && "border-l-2 border-l-rose-500/50"
      )}
      onClick={onToggle}
    >
      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {event.time}
              </span>
              <span className="text-base">{event.countryFlag}</span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[9px] uppercase tracking-[0.14em] font-semibold px-1.5 py-0",
                  importanceClass(event.importance)
                )}
              >
                {importanceLabel(event.importance, language)}
              </Badge>
            </div>
            <p className="text-sm font-medium text-foreground leading-snug">
              {event.eventName}
            </p>
          </div>
          <ChevronDown
            className={cn(
              "size-4 mt-0.5 transition-transform duration-200 text-muted-foreground shrink-0",
              isExpanded && "rotate-180"
            )}
          />
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          <div className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5">
            <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              {t("calendar:prev")}
            </p>
            <p className="mt-0.5 text-xs font-medium text-foreground">{event.previous || "-"}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5">
            <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              {t("calendar:fcst")}
            </p>
            <p className="mt-0.5 text-xs font-medium text-foreground">{event.forecast || "-"}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5">
            <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              {t("calendar:actual")}
            </p>
            <p
              className={cn(
                "mt-0.5 text-xs font-semibold",
                actualHighlightClass(
                  event.actual,
                  event.forecast,
                  event.impactDirection
                )
              )}
            >
              {event.actual || "-"}
              {event.unit && event.actual ? (
                <span className="text-[9px] text-muted-foreground ml-0.5">
                  {event.unit}
                </span>
              ) : null}
            </p>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="border-t border-white/5 bg-gradient-to-b from-black/30 to-black/20 p-3 space-y-2">
          {event.analysis && (
            <div className="rounded-md border border-emerald-500/10 bg-emerald-500/[0.04] p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300 mb-1">
                {t("calendar:analysis")}
              </p>
              <p className="text-xs leading-relaxed text-foreground/80">
                {event.analysis}
              </p>
            </div>
          )}
          <CountdownTimer targetTime={event.time} language={language} />
        </div>
      )}
    </div>
  );
}

