import { useState } from "react";
import { PieChart, ArrowRight, TrendingUp, Shield } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { PortfolioLevel, PortfolioRecommendation } from "@shared/earnings";

interface PortfolioBuilderProps {
  language: AppLanguage;
  portfolio: PortfolioLevel[];
}

const BUDGETS = ["$1,000", "$5,000", "$10,000", "$25,000", "$50,000"];

const RISK_COLORS = {
  low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  high: "text-rose-400 bg-rose-500/10 border-rose-500/30",
};

export default function PortfolioBuilder({
  language,
  portfolio,
}: PortfolioBuilderProps) {
  const [selected, setSelected] = useState("$1,000");
  const level = portfolio.find(l => l.budget === selected);

  return (
    <section className="panel p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <PieChart className="size-5 text-sky-400" />
        <h2 className="text-lg font-bold text-white">
          {copy(language, "Portföy Önerileri", "Portfolio Recommendations")}
        </h2>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {BUDGETS.map(budget => {
          const exists = portfolio.some(l => l.budget === budget);
          return (
            <Button
              key={budget}
              variant={selected === budget ? "default" : "outline"}
              size="sm"
              onClick={() => setSelected(budget)}
              disabled={!exists}
              className={cn(
                selected === budget
                  ? "bg-sky-500 text-white hover:bg-sky-600"
                  : "border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white",
                !exists && "opacity-40 cursor-not-allowed"
              )}
            >
              {budget}
            </Button>
          );
        })}
      </div>

      {!level || level.recommendations.length === 0 ? (
        <p className="text-sm text-slate-400">
          {copy(language, "Bu bütçe için öneri bulunamadı.", "No recommendations for this budget.")}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 pl-4">{copy(language, "Hisse", "Ticker")}</th>
                <th className="py-3">{copy(language, "Strateji", "Strategy")}</th>
                <th className="py-3">{copy(language, "Ağırlık", "Allocation")}</th>
                <th className="py-3">{copy(language, "Sektör", "Sector")}</th>
                <th className="py-3">FOMC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {level.recommendations.map((rec, idx) => (
                <tr
                  key={`${rec.ticker}-${idx}`}
                  className={cn(
                    "transition-colors hover:bg-slate-800/50",
                    idx % 2 === 0 ? "bg-slate-900/30" : "bg-transparent"
                  )}
                >
                  <td className="py-3 pl-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{rec.ticker}</span>
                      {rec.expectedReturn && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                          <TrendingUp className="size-3" />
                          {rec.expectedReturn}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-slate-300">{rec.strategy}</td>
                  <td className="py-3">
                    <span className="font-semibold text-sky-400">
                      {rec.allocation}
                    </span>
                  </td>
                  <td className="py-3">
                    {rec.sector ? (
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                        {rec.sector}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3">
                    {rec.fomcRisk ? (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                          RISK_COLORS[rec.risk || "medium"] || RISK_COLORS.medium
                        )}
                      >
                        <Shield className="size-3" />
                        {rec.fomcRisk}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
