import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { THEME } from "../Calendar.theme";

export function FearGreedOutlookCard({
  fearGreedOutlook,
  language,
}: {
  fearGreedOutlook?: string;
  language: AppLanguage;
}) {
  if (!fearGreedOutlook) return null;
  return (
    <Card className={cn("overflow-hidden", THEME.softCardClassName)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className={cn("size-5", THEME.iconClassName)} />
          {copy(language, "Fear & Greed Gorusu", "Fear & Greed Outlook")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-white/10 bg-black/20 p-3.5">
          <p className="text-[13px] leading-6 text-foreground/88">{fearGreedOutlook}</p>
        </div>
      </CardContent>
    </Card>
  );
}

