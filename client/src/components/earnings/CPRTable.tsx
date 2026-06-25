import { useMemo, useState } from "react";
import { ArrowUpDown, Filter } from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { CPRStock } from "@shared/earnings";

type SortKey = "ticker" | "hacimCPR" | "oiCPR" | "sector" | "sentiment";

interface CPRTableProps {
  language: AppLanguage;
  stocks: CPRStock[];
}

export default function CPRTable({ language, stocks }: CPRTableProps) {
  const [sortBy, setSortBy] = useState<SortKey>("hacimCPR");
  const [sortDesc, setSortDesc] = useState(true);
  const [sectorFilter, setSectorFilter] = useState<string>("all");

  const sectors = useMemo(
    () => Array.from(new Set(stocks.map(s => s.sector).filter(Boolean))),
    [stocks]
  );

  const sorted = useMemo(() => {
    let list = sectorFilter === "all" ? stocks : stocks.filter(s => s.sector === sectorFilter);
    return list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "ticker") cmp = a.ticker.localeCompare(b.ticker);
      else if (sortBy === "sector") cmp = (a.sector || "").localeCompare(b.sector || "");
      else if (sortBy === "sentiment") cmp = (a.sentiment || "").localeCompare(b.sentiment || "");
      else {
        const aVal = parseFloat((a[sortBy] || "0").replace(/,/g, ""));
        const bVal = parseFloat((b[sortBy] || "0").replace(/,/g, ""));
        cmp = (Number.isFinite(aVal) ? aVal : 0) - (Number.isFinite(bVal) ? bVal : 0);
      }
      return sortDesc ? -cmp : cmp;
    });
  }, [stocks, sortBy, sortDesc, sectorFilter]);

  return (
    <section className="panel p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="heading-condensed text-base">
          {copy(language, "CPR Sıralaması", "CPR Ranking")}
        </h2>
        <div className="flex items-center gap-2">
          <Filter className="size-3.5 text-muted-foreground" />
          <select
            className="rounded-md border border-border bg-background px-2 py-1 text-xs"
            value={sectorFilter}
            onChange={e => setSectorFilter(e.target.value)}
          >
            <option value="all">
              {copy(language, "Tüm Sektörler", "All Sectors")}
            </option>
            {sectors.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <Th label={copy(language, "Hisse", "Ticker")} />
              <Th
                label="Hacim CPR"
                sortKey="hacimCPR"
                sortBy={sortBy}
                sortDesc={sortDesc}
                onSort={setSortBy}
                onDirection={() => setSortDesc(d => !d)}
              />
              <Th label="OI CPR" />
              <Th label={copy(language, "Sektör", "Sector")} />
              <Th label={copy(language, "Sentiment", "Sentiment")} />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map(stock => (
              <tr key={stock.ticker} className="hover:bg-muted/30">
                <td className="py-2 font-semibold text-foreground">
                  {stock.ticker}
                </td>
                <td className={cn("py-2", cprColor(stock.hacimCPR))}>
                  {stock.hacimCPR || "-"}
                </td>
                <td className="py-2 text-muted-foreground">
                  {stock.oiCPR || "-"}
                </td>
                <td className="py-2 text-muted-foreground">
                  {stock.sector || "-"}
                </td>
                <td className="py-2 text-muted-foreground">
                  {stock.sentiment || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Th({
  label,
  sortKey,
  sortBy,
  sortDesc,
  onSort,
  onDirection,
}: {
  label: string;
  sortKey?: SortKey;
  sortBy?: SortKey;
  sortDesc?: boolean;
  onSort?: (key: SortKey) => void;
  onDirection?: () => void;
}) {
  const active = sortKey && sortBy === sortKey;
  return (
    <th className="py-2 font-medium">
      {sortKey ? (
        <Button
          variant="ghost"
          size="sm"
          className="h-auto px-0 py-0 text-xs font-medium text-muted-foreground hover:text-foreground"
          onClick={() => {
            if (active) {
              onDirection?.();
            } else {
              onSort?.(sortKey);
            }
          }}
        >
          {label}
          <ArrowUpDown
            className={cn(
              "ml-1 size-3",
              active ? "text-foreground" : "text-muted-foreground"
            )}
          />
        </Button>
      ) : (
        label
      )}
    </th>
  );
}

function cprColor(value?: string) {
  const num = value ? parseFloat(value.replace(/,/g, "")) : NaN;
  if (Number.isNaN(num)) return "text-muted-foreground";
  if (num > 2) return "text-emerald-300";
  if (num >= 1.25) return "text-emerald-200/70";
  if (num >= 0.8) return "text-muted-foreground";
  if (num >= 0.6) return "text-amber-300";
  return "text-rose-300";
}
