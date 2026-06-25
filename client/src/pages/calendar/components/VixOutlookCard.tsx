import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { THEME } from "../Calendar.theme";

export function VixOutlookCard({
  vixOutlook,
  language,
}: {
  vixOutlook?: string;
  language: AppLanguage;
}) {
  if (!vixOutlook) return null;
  return (
    <Card className={cn("overflow-hidden", THEME.softCardClassName)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className={cn("size-5", THEME.iconClassName)} />
          {copy(language, "VIX Gorusu", "VIX Outlook")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-white/10 bg-black/20 p-3.5">
          <p className="text-[13px] leading-6 text-foreground/88">{vixOutlook}</p>
        </div>
      </CardContent>
    </Card>
  );
}

