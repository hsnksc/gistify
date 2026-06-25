import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { THEME } from "../Calendar.theme";

function parseVixNumber(text: string | undefined): number | null {
  if (!text) return null;
  const match = text.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function VixMiniBar({ value }: { value: number | null }) {
  if (value === null) return null;
  const pct = Math.min((value / 50) * 100, 100);
  let color = "bg-emerald-500";
  if (value >= 30) color = "bg-rose-500";
  else if (value >= 22) color = "bg-amber-500";
  let label = "Low";
  if (value >= 30) label = "High";
  else if (value >= 22) label = "Elevated";
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-2xl font-bold tabular-nums text-foreground">{value.toFixed(2)}</span>
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", 
          value >= 30 ? "border-rose-500/30 bg-rose-500/10 text-rose-200" :
          value >= 22 ? "border-amber-500/30 bg-amber-500/10 text-amber-200" :
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
        )}>{label}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
        <span>0</span>
        <span>Low vol</span>
        <span>25</span>
        <span>High vol</span>
        <span>50+</span>
      </div>
    </div>
  );
}

export function VixOutlookCard({
  vixOutlook,
  language,
}: {
  vixOutlook?: string;
  language: AppLanguage;
}) {
  if (!vixOutlook) return null;
  const value = parseVixNumber(vixOutlook);
  return (
    <Card className={cn("overflow-hidden", THEME.softCardClassName)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className={cn("size-4", THEME.iconClassName)} />
          {copy(language, "VIX Gorusu", "VIX Outlook")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <VixMiniBar value={value} />
        <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-[12px] leading-5 text-foreground/80">{vixOutlook}</p>
        </div>
      </CardContent>
    </Card>
  );
}

