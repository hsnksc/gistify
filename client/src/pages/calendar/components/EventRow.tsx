import { ChevronDown, Clock, MapPin, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { type AppLanguage, t } from "@/lib/i18n";
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
        className={cn(
          importanceRowClass(event.importance),
          "cursor-pointer transition-colors duration-150",
          event.importance === "high" && "shadow-[inset_2px_0_0_rgba(244,63,94,0.5)]"
        )}
        onClick={onToggle}
      >
        <TableCell className="py-2.5">
          <div className="flex items-center gap-1.5">
            <Clock className="size-3 text-muted-foreground shrink-0" />
            <span className="text-sm font-semibold tabular-nums text-foreground">
              {event.time || "-"}
            </span>
          </div>
        </TableCell>
        <TableCell className="py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-lg leading-none">{event.countryFlag}</span>
            <span className="text-xs font-medium tracking-wider text-foreground/80">
              {event.country}
            </span>
            {event.currency && (
              <Badge variant="outline" className="text-[10px] font-medium border-white/10">
                {event.currency}
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell className="py-2.5 max-w-[280px]">
          <p className="text-sm font-medium leading-snug text-foreground line-clamp-2">
            {event.eventName}
          </p>
        </TableCell>
        <TableCell className="py-2.5">
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] uppercase tracking-[0.16em] font-semibold px-2 py-0.5",
              importanceClass(event.importance)
            )}
          >
            {importanceLabel(event.importance, language)}
          </Badge>
        </TableCell>
        <TableCell className="py-2.5 text-xs tabular-nums text-muted-foreground">
          {event.previous || "-"}
        </TableCell>
        <TableCell className="py-2.5 text-xs tabular-nums text-muted-foreground">
          {event.forecast || "-"}
        </TableCell>
        <TableCell
          className={cn(
            "py-2.5 text-xs tabular-nums font-semibold",
            actualHighlightClass(
              event.actual,
              event.forecast,
              event.impactDirection
            )
          )}
        >
          {event.actual || "-"}
          {event.unit && event.actual ? (
            <span className="text-[10px] text-muted-foreground ml-1">
              {event.unit}
            </span>
          ) : null}
        </TableCell>
        <TableCell className="py-2.5">
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-200 text-muted-foreground",
              isExpanded && "rotate-180"
            )}
          />
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={8} className="p-0">
            <div className="border-t border-white/5 bg-gradient-to-b from-black/30 to-black/20">
              <div className="p-4 space-y-3">
                {event.analysis && (
                  <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/[0.04] p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <BarChart3 className="size-3.5 text-emerald-300" />
                      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                        {t("calendar:analysis")}
                      </p>
                    </div>
                    <p className="text-[13px] leading-relaxed text-foreground/85">
                      {event.analysis}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <CountdownTimer targetTime={event.time} language={language} />
                  {event.currency && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {event.currency}
                      {event.unit ? ` · ${event.unit}` : ""}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
