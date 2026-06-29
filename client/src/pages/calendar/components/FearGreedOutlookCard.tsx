import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Gauge } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { THEME } from "../Calendar.theme";

function parseFearGreedNumber(text: string | undefined): number | null {
  if (!text) return null;
  const match = text.match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

function FearGreedMiniBar({ value, language }: { value: number | null; language: AppLanguage }) {
  if (value === null) return null;
  const pct = Math.min(value, 100);
  let color = "bg-emerald-500";
  if (value <= 25) color = "bg-rose-500";
  else if (value <= 45) color = "bg-amber-500";
  else if (value <= 55) color = "bg-slate-400";
  else if (value <= 75) color = "bg-emerald-400";
  let label = copy(language, "Nötr", "Neutral");
  if (value <= 25) label = copy(language, "Aşırı Korku", "Extreme Fear");
  else if (value <= 45) label = copy(language, "Korku", "Fear");
  else if (value <= 55) label = copy(language, "Nötr", "Neutral");
  else if (value <= 75) label = copy(language, "Açgözlülük", "Greed");
  else label = copy(language, "Aşırı Açgözlülük", "Extreme Greed");
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-2xl font-bold tabular-nums text-foreground">{value}</span>
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border",
          value <= 25 ? "border-rose-500/30 bg-rose-500/10 text-rose-200" :
          value <= 45 ? "border-amber-500/30 bg-amber-500/10 text-amber-200" :
          value <= 55 ? "border-slate-500/30 bg-slate-500/10 text-slate-300" :
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
        )}>{label}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden relative">
        <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
        <span>{copy(language, "Aşırı Korku", "Extreme Fear")}</span>
        <span>{copy(language, "Nötr", "Neutral")}</span>
        <span>{copy(language, "Aşırı Açgözlülük", "Extreme Greed")}</span>
      </div>
    </div>
  );
}

export function FearGreedOutlookCard({
  fearGreedOutlook,
  language,
}: {
  fearGreedOutlook?: string;
  language: AppLanguage;
}) {
  if (!fearGreedOutlook) return null;
  const value = parseFearGreedNumber(fearGreedOutlook);
  return (
    <Card className={cn("overflow-hidden", THEME.softCardClassName)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Gauge className={cn("size-4", THEME.iconClassName)} />
          {copy(language, "Fear & Greed Gorusu", "Fear & Greed Outlook")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FearGreedMiniBar value={value} language={language} />
        <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-[12px] leading-5 text-foreground/80">{fearGreedOutlook}</p>
        </div>
      </CardContent>
    </Card>
  );
}

