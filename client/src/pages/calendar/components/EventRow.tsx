import { ChevronDown, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@shared/calendar";
import {
  importanceClass,
  importanceLabel,
  importanceRowClass,
  actualHighlightClass,
} from "../calendar.utils";
import { CountdownTimer } from "./CountdownTimer";

export function EventRow({
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
    <>
      <TableRow
        className={cn(importanceRowClass(event.importance), "cursor-pointer")}
        onClick={onToggle}
      >
        <TableCell className="text-foreground/90">
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-muted-foreground" />
            {event.time || "-"}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className="text-base">{event.countryFlag}</span>
            <span className="text-foreground/90">{event.country}</span>
            {event.currency && (
              <Badge variant="outline" className="text-[10px]">
                {event.currency}
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell className="font-medium text-foreground">
          {event.eventName}
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] uppercase tracking-[0.14em]",
              importanceClass(event.importance)
            )}
          >
            {importanceLabel(event.importance, language)}
          </Badge>
        </TableCell>
        <TableCell className="text-muted-foreground">
          {event.previous || "-"}
        </TableCell>
        <TableCell className="text-muted-foreground">
          {event.forecast || "-"}
        </TableCell>
        <TableCell
          className={actualHighlightClass(
            event.actual,
            event.forecast,
            event.impactDirection
          )}
        >
          {event.actual || "-"}
          {event.unit && event.actual ? (
            <span className="text-xs text-muted-foreground ml-1">
              {event.unit}
            </span>
          ) : null}
        </TableCell>
        <TableCell>
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={8} className="bg-black/20">
            <div className="rounded-xl p-4 text-sm text-foreground/80 space-y-3">
              {event.analysis && (
                <div>
                  <p className="font-medium text-emerald-300">
                    {copy(language, "Analiz", "Analysis")}
                  </p>
                  <p className="mt-1">{event.analysis}</p>
                </div>
              )}
              <CountdownTimer targetTime={event.time} language={language} />
              {event.currency && (
                <p className="text-xs text-muted-foreground">
                  {copy(language, "Para Birimi", "Currency")}: {event.currency}
                  {event.unit ? ` · ${event.unit}` : ""}
                </p>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
