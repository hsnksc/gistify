import { useState } from "react";
import {
  ChevronDown,
  Lightbulb,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { CalendarOptionSetup } from "@shared/calendar";
import { THEME } from "../Calendar.theme";
import { biasClass, biasLabel } from "../calendar.utils";

function SetupIcon({ type }: { type: string }) {
  const lower = type.toLowerCase();
  if (lower.includes("call"))
    return <ArrowUp className="size-4 text-emerald-400" />;
  if (lower.includes("put"))
    return <ArrowDown className="size-4 text-rose-400" />;
  if (lower.includes("straddle") || lower.includes("strangle"))
    return <Minus className="size-4 text-amber-400" />;
  return <TrendingUp className="size-4 text-muted-foreground" />;
}

export function OptionSetupsCard({
  setups,
  language,
}: {
  setups: CalendarOptionSetup[];
  language: AppLanguage;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <Card className={cn("overflow-hidden", THEME.softCardClassName)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className={cn("size-5", THEME.iconClassName)} />
          {copy(
            language,
            "Opsiyon Stratejisi Onerileri",
            "Option Strategy Setups"
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {setups.length ? (
          setups.map((setup, index) => {
            const id = `${setup.asset}-${index}`;
            const isOpen = openId === id;
            return (
              <Collapsible
                key={id}
                open={isOpen}
                onOpenChange={() =>
                  setOpenId((prev) => (prev === id ? null : id))
                }
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-3.5">
                    <div className="flex items-center gap-2">
                      <SetupIcon type={setup.setupType} />
                      <span className="text-sm font-semibold text-foreground">
                        {setup.asset}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {setup.setupType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] uppercase tracking-[0.14em]",
                          biasClass(setup.bias)
                        )}
                      >
                        {biasLabel(setup.bias, language)}
                      </Badge>
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform",
                          isOpen && "rotate-180"
                        )}
                      />
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="grid gap-2 sm:grid-cols-2 mt-2">
                    <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.05] px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-emerald-200/80">
                        {copy(language, "Tetik", "Trigger")}
                      </p>
                      <p className="mt-1 text-[13px] leading-5 text-foreground/88">
                        {setup.trigger}
                      </p>
                    </div>
                    <div className="rounded-xl border border-rose-500/10 bg-rose-500/[0.05] px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-rose-200/80">
                        {copy(language, "Invalidasyon", "Invalidation")}
                      </p>
                      <p className="mt-1 text-[13px] leading-5 text-foreground/88">
                        {setup.invalidation}
                      </p>
                    </div>
                  </div>
                  {setup.rationale && (
                    <div className="mt-2 rounded-lg bg-amber-500/5 p-2 text-xs text-amber-200/80">
                      <Lightbulb className="inline size-3 mr-1" />
                      {setup.rationale}
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 bg-black/15 px-4 py-3 text-sm text-muted-foreground">
            {copy(
              language,
              "Bugun icin opsiyon setup'i bulunmuyor.",
              "No option setups for today."
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

