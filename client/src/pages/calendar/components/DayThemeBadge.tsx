import { Badge } from "@/components/ui/badge";
import { getDayTheme } from "../calendar.utils";
import type { CalendarEvent } from "@shared/calendar";
import type { AppLanguage } from "@/lib/i18n";

export function DayThemeBadge({
  events,
  language,
}: {
  events: CalendarEvent[];
  language: AppLanguage;
}) {
  const theme = getDayTheme(events, language);
  if (!theme) return null;
  return (
    <Badge className="mt-1 bg-amber-500/10 text-amber-300 border-amber-500/20">
      {theme}
    </Badge>
  );
}
