import { Activity } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Strategy } from "@shared/earnings";

interface GreeksDashboardProps {
  language: AppLanguage;
  strategies: Strategy[];
}

export default function GreeksDashboard({
  language,
  strategies,
}: GreeksDashboardProps) {
  const withGreeks = strategies.filter(s => s.greeks);

  return (
    <section className="panel p-4">
      <div className="mb-3 flex items-center gap-2">
        <Activity className="size-4 text-sky-300" />
        <h2 className="heading-condensed text-base">
          {copy(language, "Greeks Dashboard", "Greeks Dashboard")}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="py-2">{copy(language, "Hisse", "Ticker")}</th>
              <th className="py-2">Delta</th>
              <th className="py-2">Theta</th>
              <th className="py-2">Vega</th>
              <th className="py-2">Gamma</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {withGreeks.slice(0, 30).map(strategy => (
              <tr key={strategy.ticker} className="hover:bg-muted/30">
                <td className="py-2 font-semibold text-foreground">
                  {strategy.ticker}
                </td>
                <td className={cn("py-2", signColor(strategy.greeks?.delta))}>
                  {strategy.greeks?.delta || "-"}
                </td>
                <td className={cn("py-2", signColor(strategy.greeks?.theta, true))}>
                  {strategy.greeks?.theta || "-"}
                </td>
                <td className="py-2 text-muted-foreground">
                  {strategy.greeks?.vega || "-"}
                </td>
                <td className="py-2 text-muted-foreground">
                  {strategy.greeks?.gamma || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function signColor(value?: string, invert = false) {
  const num = value ? parseFloat(value.replace(/[$,]/g, "")) : NaN;
  if (Number.isNaN(num)) return "text-muted-foreground";
  if (num > 0) return invert ? "text-emerald-300" : "text-emerald-300";
  if (num < 0) return "text-rose-300";
  return "text-muted-foreground";
}
