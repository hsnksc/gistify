import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { copy, type AppLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { CPRStock } from "@shared/earnings";

type SortKey = "ticker" | "hacimCPR" | "oiCPR" | "sector" | "sentiment" | "ivRank";

interface CPRTableProps {
  language: AppLanguage;
  stocks: CPRStock[];
}

const SENTIMENT_EMOJI: Record<string, string> = {
  "Güçlü Boğa": "🟢",
  Boğa: "🟡",
  Nötr: "⚪",
  Ayı: "🟠",
  "Güçlü Ayı": "🔴",
  Unknown: "❓",
};

const SENTIMENT_COLORS: Record<string, string> = {
  "Güçlü Boğa": "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
  Boğa: "text-emerald-300 bg-emerald-500/15 border-emerald-500/30",
  Nötr: "text-slate-400 bg-slate-500/15 border-slate-500/30",
  Ayı: "text-rose-300 bg-rose-500/15 border-rose-500/30",
  "Güçlü Ayı": "text-rose-400 bg-rose-500/15 border-rose-500/30",
  Unknown: "text-slate-500 bg-slate-500/15 border-slate-500/30",
};

export default function CPRTable({ language, stocks }: CPRTableProps) {
  const [sortBy, setSortBy] = useState<SortKey>("hacimCPR");
  const [sortDesc, setSortDesc] = useState(true);
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const sectors = useMemo(
    () =>
      Array.from(
        new Set(
          stocks
            .map(s => s.sector)
            .filter((x): x is string => Boolean(x))
        )
      ),
    [stocks]
  );

  const sorted = useMemo(() => {
    let list = [...stocks];
    if (sectorFilter !== "all") {
      list = list.filter(s => s.sector === sectorFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        s =>
          s.ticker.toLowerCase().includes(q) ||
          (s.sector || "").toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "ticker") cmp = a.ticker.localeCompare(b.ticker);
      else if (sortBy === "sector")
        cmp = (a.sector || "").localeCompare(b.sector || "");
      else if (sortBy === "sentiment")
        cmp = (a.sentiment || "").localeCompare(b.sentiment || "");
      else {
        const aVal = parseFloat((a[sortBy] || "0").replace(/,/g, ""));
        const bVal = parseFloat((b[sortBy] || "0").replace(/,/g, ""));
        cmp =
          (Number.isFinite(aVal) ? aVal : 0) -
          (Number.isFinite(bVal) ? bVal : 0);
      }
      return sortDesc ? -cmp : cmp;
    });
  }, [stocks, sortBy, sortDesc, sectorFilter, search]);

  return (
    <section className="panel p-5 md:p-6">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-5 text-sky-400" />
          <h2 className="text-lg font-bold text-white">
            {copy(language, "CPR Sıralaması", "CPR Ranking")}
          </h2>
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-400">
            {sorted.length}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={copy(language, "Ara...", "Search...")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-9 rounded-xl border border-slate-700 bg-slate-900/60 pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-600 focus:border-sky-500/50 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Sector chips — scrollable */}
      <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="size-3.5 shrink-0 text-slate-500" />
        <button
          onClick={() => setSectorFilter("all")}
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition-colors",
            sectorFilter === "all"
              ? "bg-sky-500/20 text-sky-400"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          )}
        >
          {copy(language, "Tümü", "All")}
        </button>
        {sectors.map(s => (
          <button
            key={s}
            onClick={() => setSectorFilter(s)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition-colors",
              sectorFilter === s
                ? "bg-sky-500/20 text-sky-400"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="max-h-[500px] overflow-y-auto rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/80 text-xs font-semibold uppercase tracking-wider text-sky-300">
            <tr>
              <Th
                label={copy(language, "Hisse", "Ticker")}
                sortKey="ticker"
                sortBy={sortBy}
                sortDesc={sortDesc}
                onSort={setSortBy}
                onDirection={() => setSortDesc(d => !d)}
              />
              <Th
                label="Hacim CPR"
                sortKey="hacimCPR"
                sortBy={sortBy}
                sortDesc={sortDesc}
                onSort={setSortBy}
                onDirection={() => setSortDesc(d => !d)}
              />
              <Th
                label="OI CPR"
                sortKey="oiCPR"
                sortBy={sortBy}
                sortDesc={sortDesc}
                onSort={setSortBy}
                onDirection={() => setSortDesc(d => !d)}
              />
              <Th
                label={copy(language, "Sektör", "Sector")}
                sortKey="sector"
                sortBy={sortBy}
                sortDesc={sortDesc}
                onSort={setSortBy}
                onDirection={() => setSortDesc(d => !d)}
              />
              <Th
                label={copy(language, "Sentiment", "Sentiment")}
                sortKey="sentiment"
                sortBy={sortBy}
                sortDesc={sortDesc}
                onSort={setSortBy}
                onDirection={() => setSortDesc(d => !d)}
              />
              <Th
                label={copy(language, "IV Rank", "IV Rank")}
                sortKey="ivRank"
                sortBy={sortBy}
                sortDesc={sortDesc}
                onSort={setSortBy}
                onDirection={() => setSortDesc(d => !d)}
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sorted.map((stock, index) => (
              <tr
                key={stock.ticker}
                className={cn(
                  "transition-colors",
                  index % 2 === 0 ? "bg-slate-800/30" : "bg-slate-900/30",
                  "hover:bg-sky-500/5"
                )}
              >
                <td className="py-3 pl-4">
                  <div className="flex items-center gap-2">
                    <button
                      className="font-bold text-white hover:text-sky-400 transition-colors"
                      onClick={() => {
                        // navigate or onClick handler
                      }}
                    >
                      {stock.ticker}
                    </button>
                    {stock.price && (
                      <span className="text-xs text-slate-500">
                        {stock.price}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3">
                  <CPRBar value={stock.hacimCPR} />
                </td>
                <td className={cn("py-3", cprColor(stock.oiCPR))}>
                  {stock.oiCPR || "—"}
                </td>
                <td className="py-3">
                  {stock.sector ? (
                    <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">
                      {stock.sector}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-3">
                  {stock.sentiment ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                        SENTIMENT_COLORS[stock.sentiment] ||
                          SENTIMENT_COLORS["Unknown"]
                      )}
                    >
                      {SENTIMENT_EMOJI[stock.sentiment] || "❓"}
                      {stock.sentiment}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-3 pr-4">
                  <IVRankBar value={stock.ivRank} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CPRBar({ value }: { value?: string }) {
  const num = value ? parseFloat(value.replace(/,/g, "")) : NaN;
  const widthPct = Number.isFinite(num) ? Math.min((num / 4) * 100, 100) : 0;
  const color = cprBarColor(value);

  return (
    <div className="flex items-center gap-3">
      <span className={cn("min-w-[3rem] text-xs font-semibold", color)}>
        {value || "—"}
      </span>
      <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-800">
        <div
          className={cn("h-full rounded-full transition-all", color.replace("text-", "bg-"))}
          style={{ width: `${widthPct}%` }}
        />
      </div>
    </div>
  );
}

function IVRankBar({ value }: { value?: string }) {
  const num = value ? parseInt(value.replace(/[^0-9]/g, ""), 10) : NaN;
  const pct = Number.isFinite(num) ? Math.min(num, 100) : 0;
  let color = "bg-slate-600";
  if (pct >= 70) color = "bg-rose-500";
  else if (pct >= 40) color = "bg-amber-500";
  else color = "bg-emerald-500";

  return (
    <div className="flex items-center gap-2">
      <span className="min-w-[2.5rem] text-xs font-semibold text-slate-300">
        {value || "—"}
      </span>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
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
    <th className="py-3 pr-4">
      {sortKey ? (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-auto px-0 py-0 text-xs font-semibold uppercase tracking-wider hover:text-white",
            active ? "text-sky-300" : "text-slate-400"
          )}
          onClick={() => {
            if (active) {
              onDirection?.();
            } else {
              onSort?.(sortKey);
            }
          }}
        >
          {label}
          {active ? (
            sortDesc ? (
              <ArrowDown className="ml-1.5 size-3 text-sky-400" />
            ) : (
              <ArrowUp className="ml-1.5 size-3 text-sky-400" />
            )
          ) : (
            <ArrowUpDown className="ml-1.5 size-3 text-slate-600" />
          )}
        </Button>
      ) : (
        label
      )}
    </th>
  );
}

function cprColor(value?: string) {
  const num = value ? parseFloat(value.replace(/,/g, "")) : NaN;
  if (Number.isNaN(num)) return "text-slate-500";
  if (num > 2) return "text-emerald-400";
  if (num >= 1.25) return "text-emerald-300";
  if (num >= 0.8) return "text-slate-400";
  if (num >= 0.6) return "text-amber-400";
  return "text-rose-400";
}

function cprBarColor(value?: string) {
  const num = value ? parseFloat(value.replace(/,/g, "")) : NaN;
  if (Number.isNaN(num)) return "text-slate-500";
  if (num > 2) return "text-emerald-400";
  if (num >= 1.25) return "text-emerald-300";
  if (num >= 0.8) return "text-slate-400";
  if (num >= 0.6) return "text-amber-400";
  return "text-rose-400";
}
