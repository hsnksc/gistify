import { Activity } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { MacroData } from "@shared/earnings";

interface MacroDashboardProps {
  language: AppLanguage;
  macro: MacroData;
}

export default function MacroDashboard({ language, macro }: MacroDashboardProps) {
  const items = [
    { key: "vix", label: "VIX", value: macro.vix },
    { key: "sp500", label: "S&P 500", value: macro.sp500 },
    { key: "nasdaq", label: "Nasdaq", value: macro.nasdaq },
    { key: "russell2000", label: "Russell 2000", value: macro.russell2000 },
    { key: "tenYearYield", label: "10Y Yield", value: macro.tenYearYield },
    { key: "dxy", label: "DXY", value: macro.dxy },
    { key: "wti", label: "WTI", value: macro.wti },
    { key: "bitcoin", label: "Bitcoin", value: macro.bitcoin },
    { key: "fearGreed", label: "Fear & Greed", value: macro.fearGreed },
  ];

  return (
    <section className="panel p-4">
      <div className="mb-3 flex items-center gap-2">
        <Activity className="size-4 text-sky-300" />
        <h2 className="heading-condensed text-base">
          {copy(language, "Makro Dashboard", "Macro Dashboard")}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.map(item =>
          item.value ? (
            <div
              key={item.key}
              className="rounded-lg border border-border bg-background p-2.5"
            >
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {item.value}
              </p>
            </div>
          ) : null
        )}
      </div>
    </section>
  );
}
