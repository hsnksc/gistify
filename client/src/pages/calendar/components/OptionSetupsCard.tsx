import { useState } from "react";
import {
  ChevronDown, Lightbulb, TrendingUp, ArrowUp, ArrowDown, Minus, Target, ShieldAlert, } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible";
import { type AppLanguage, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { CalendarOptionSetup } from "@shared/calendar";
import { THEME } from "../Calendar.theme";
import { biasClass, biasLabel } from "../calendar.utils";

function SetupIcon({ type, bias }: { type: string; bias: string }) {
  const lower = type.toLowerCase();
  const isBearish = bias === "bearish";
  if (lower.includes("put") || isBearish)
    return <ArrowDown className="size-4 text-rose-400" />;
  if (lower.includes("call") || bias === "bullish")
    return <ArrowUp className="size-4 text-emerald-400" />;
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
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className={cn("size-4", THEME.iconClassName)} />
          {t("calendar:optionStrategySetups")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
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
                  <div className={cn(
                    "flex items-center justify-between rounded-lg border p-3 transition-colors duration-150",
                    setup.bias === "bullish" ? "border-emerald-500/15 bg-emerald-500/[0.04] hover:bg-emerald-500/[0.07]" :
                    setup.bias === "bearish" ? "border-rose-500/15 bg-rose-500/[0.04] hover:bg-rose-500/[0.07]" :
                    "border-amber-500/15 bg-amber-500/[0.04] hover:bg-amber-500/[0.07]"
                  )}>
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "flex size-8 items-center justify-center rounded-lg border",
                        setup.bias === "bullish" ? "border-emerald-500/20 bg-emerald-500/10" :
                        setup.bias === "bearish" ? "border-rose-500/20 bg-rose-500/10" :
                        "border-amber-500/20 bg-amber-500/10"
                      )}>
                        <SetupIcon type={setup.setupType} bias={setup.bias} />
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-bold text-foreground">
                          {setup.asset}
                        </span>
                        <span className="ml-2 text-[11px] text-muted-foreground">
                          {setup.setupType}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] uppercase tracking-[0.14em] font-semibold",
                          biasClass(setup.bias)
                        )}
                      >
                        {biasLabel(setup.bias, language)}
                      </Badge>
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform duration-200 text-muted-foreground",
                          isOpen && "rotate-180"
                        )}
                      />
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="grid gap-2 sm:grid-cols-2 mt-2">
                    <div className="rounded-lg border border-emerald-500/12 bg-emerald-500/[0.04] p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Target className="size-3 text-emerald-300" />
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                          {t("calendar:trigger")}
                        </p>
                      </div>
                      <p className="text-[12px] leading-5 text-foreground/85">
                        {setup.trigger}
                      </p>
                    </div>
                    <div className="rounded-lg border border-rose-500/12 bg-rose-500/[0.04] p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <ShieldAlert className="size-3 text-rose-300" />
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-300">
                          {t("calendar:invalidation")}
                        </p>
                      </div>
                      <p className="text-[12px] leading-5 text-foreground/85">
                        {setup.invalidation}
                      </p>
                    </div>
                  </div>
                  {setup.rationale && (
                    <div className="mt-2 rounded-lg border border-amber-500/12 bg-amber-500/[0.04] p-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Lightbulb className="size-3 text-amber-300" />
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                          {"Rationale"}
                        </p>
                      </div>
                      <p className="text-[12px] leading-5 text-foreground/85">
                        {setup.rationale}
                      </p>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            );
          })
        ) : (
          <div className="rounded-lg border border-dashed border-white/10 bg-black/15 px-4 py-3 text-sm text-muted-foreground text-center">
            {t("calendar:noOptionSetupsForToday")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

