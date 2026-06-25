import { useState } from "react";
import { Globe, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { copy, type AppLanguage } from "@/lib/i18n";
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

  const headers = [
    copy(language, "Saat", "Time"),
    copy(language, "Ulke", "Country"),
    copy(language, "Olay", "Event"),
    copy(language, "Onem", "Importance"),
    copy(language, "Onceki", "Previous"),
    copy(language, "Beklenen", "Forecast"),
    copy(language, "Gerceklesen", "Actual"),
    "",
  ];

  return (
    <Card className={cn("overflow-hidden", THEME.cardClassName)}>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className={cn("size-5", THEME.iconClassName)} />
            {copy(language, "Makro Olaylar", "Macro Events")}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={copy(language, "Ara...", "Search...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-40 bg-background/70 pl-8 text-xs"
              />
            </div>
            <ToggleGroup
              type="single"
              value={filter}
              onValueChange={(v) => v && setFilter(v as typeof filter)}
              className="h-8"
            >
              <ToggleGroupItem value="all" className="text-xs">
                {copy(language, "Tumu", "All")}
              </ToggleGroupItem>
              <ToggleGroupItem value="high" className="text-xs">
                🔴
              </ToggleGroupItem>
              <ToggleGroupItem value="medium" className="text-xs">
                🟡
              </ToggleGroupItem>
              <ToggleGroupItem value="low" className="text-xs">
                🟢
              </ToggleGroupItem>
            </ToggleGroup>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as typeof sortBy)}
            >
              <SelectTrigger className="h-8 w-32 text-xs bg-background/70">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time">
                  {copy(language, "Saat", "Time")}
                </SelectItem>
                <SelectItem value="importance">
                  {copy(language, "Onem", "Importance")}
                </SelectItem>
                <SelectItem value="country">
                  {copy(language, "Ulke", "Country")}
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
              <TableRow className="border-white/10 hover:bg-transparent">
                {headers.map((header, i) => (
                  <TableHead
                    key={i}
                    className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
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
                    className="text-sm text-muted-foreground"
                  >
                    {copy(language, "Bulunamadi", "No results found")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden space-y-3 p-4">
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
            <div className="rounded-xl border border-dashed border-white/10 bg-black/15 px-4 py-3 text-sm text-muted-foreground">
              {copy(language, "Bulunamadi", "No results found")}
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
        "rounded-xl border border-white/10 bg-black/20 p-3.5",
        importanceRowClass(event.importance)
      )}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {event.eventName}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {event.countryFlag} {event.country} · {event.time}
            {event.currency && ` · ${event.currency}`}
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "shrink-0 text-[10px] uppercase tracking-[0.14em]",
            importanceClass(event.importance)
          )}
        >
          {importanceLabel(event.importance, language)}
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-xl border border-white/10 bg-black/20 px-2 py-1.5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {copy(language, "Onceki", "Previous")}
          </p>
          <p className="mt-1 text-foreground">{event.previous || "-"}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-2 py-1.5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {copy(language, "Beklenen", "Forecast")}
          </p>
          <p className="mt-1 text-foreground">{event.forecast || "-"}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-2 py-1.5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {copy(language, "Gerceklesen", "Actual")}
          </p>
          <p
            className={cn(
              "mt-1",
              actualHighlightClass(
                event.actual,
                event.forecast,
                event.impactDirection
              )
            )}
          >
            {event.actual || "-"}
            {event.unit && event.actual ? (
              <span className="text-xs text-muted-foreground ml-1">
                {event.unit}
              </span>
            ) : null}
          </p>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-3 rounded-xl bg-black/30 p-3 text-sm text-foreground/80 space-y-2">
          {event.analysis && (
            <div>
              <p className="font-medium text-emerald-300">
                {copy(language, "Analiz", "Analysis")}
              </p>
              <p className="mt-1 text-xs">{event.analysis}</p>
            </div>
          )}
          <CountdownTimer targetTime={event.time} language={language} />
        </div>
      )}
    </div>
  );
}

