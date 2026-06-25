import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, BookOpen } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { THEME } from "../Calendar.theme";

export function MarketNarrativeCard({
  narrative,
  language,
}: {
  narrative: string;
  language: AppLanguage;
}) {
  const safeNarrative =
    narrative ||
    copy(
      language,
      "Piyasa hikayesi henuz yuklenmedi.",
      "Market narrative has not loaded yet."
    );

  return (
    <Card className={cn("overflow-hidden", THEME.softCardClassName)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className={cn("size-4", THEME.iconClassName)} />
          {copy(language, "Piyasa Hikayesi", "Market Narrative")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3.5">
          <p className="text-[13px] leading-relaxed text-foreground/85">
            {safeNarrative}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

