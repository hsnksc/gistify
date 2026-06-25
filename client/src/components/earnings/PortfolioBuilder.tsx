import { useState } from "react";
import { PieChart } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { PortfolioLevel, PortfolioRecommendation } from "@shared/earnings";

interface PortfolioBuilderProps {
  language: AppLanguage;
  portfolio: PortfolioLevel[];
}

const BUDGETS = ["$1,000", "$5,000", "$10,000", "$25,000", "$50,000"];

export default function PortfolioBuilder({
  language,
  portfolio,
}: PortfolioBuilderProps) {
  const [selected, setSelected] = useState("$1,000");
  const level = portfolio.find(l => l.budget === selected);

  return (
    <section className="panel p-4">
      <div className="mb-3 flex items-center gap-2">
        <PieChart className="size-4 text-sky-300" />
        <h2 className="heading-condensed text-base">
          {copy(language, "Portföy Önerileri", "Portfolio Recommendations")}
        </h2>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {BUDGETS.map(budget => (
          <Button
            key={budget}
            variant={selected === budget ? "default" : "outline"}
            size="sm"
            onClick={() => setSelected(budget)}
          >
            {budget}
          </Button>
        ))}
      </div>

      {!level || level.recommendations.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {copy(language, "Bu bütçe için öneri bulunamadı.", "No recommendations for this budget.")}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="py-2">{copy(language, "Hisse", "Ticker")}</th>
                <th className="py-2">{copy(language, "Strateji", "Strategy")}</th>
                <th className="py-2">{copy(language, "Ağırlık", "Allocation")}</th>
                <th className="py-2">{copy(language, "Sektör", "Sector")}</th>
                <th className="py-2">FOMC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {level.recommendations.map((rec, idx) => (
                <tr key={`${rec.ticker}-${idx}`} className="hover:bg-muted/30">
                  <td className="py-2 font-semibold text-foreground">
                    {rec.ticker}
                  </td>
                  <td className="py-2 text-muted-foreground">
                    {rec.strategy}
                  </td>
                  <td className="py-2 text-muted-foreground">
                    {rec.allocation}
                  </td>
                  <td className="py-2 text-muted-foreground">
                    {rec.sector || "-"}
                  </td>
                  <td className="py-2 text-muted-foreground">
                    {rec.fomcRisk || "-"}
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
