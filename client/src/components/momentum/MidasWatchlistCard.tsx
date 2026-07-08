import { Eye, TrendingUp, TrendingDown, Briefcase } from "lucide-react";
import { useMidasData } from "@/lib/useMidasData";
import { useAppLanguage } from "@/lib/i18n";

function gradeBadgeClass(grade: string) {
  switch (grade) {
    case "A":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    case "B":
      return "bg-sky-500/15 text-sky-300 border-sky-500/30";
    case "C":
      return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    case "D":
      return "bg-orange-500/15 text-orange-300 border-orange-500/30";
    case "E":
      return "bg-rose-500/15 text-rose-300 border-rose-500/30";
    default:
      return "bg-slate-500/10 text-slate-300 border-slate-500/20";
  }
}

export function MidasWatchlistCard() {
  const midas = useMidasData();
  const language = useAppLanguage();
  const copy =
    language === "en"
      ? {
          holding: "HOLDING",
          holdings: "holdings",
          loading: "Loading Midas watchlist...",
          marketPhaseUnit: "stocks",
          positionHealth: "Position health",
          title: "Midas Watchlist",
          loadFailed: "Midas watchlist could not load",
        }
      : {
          holding: "TAŞINIYOR",
          holdings: "pozisyon",
          loading: "Midas watchlist yükleniyor...",
          marketPhaseUnit: "hisse",
          positionHealth: "Pozisyon sağlığı",
          title: "Midas Watchlist",
          loadFailed: "Midas watchlist yüklenemedi",
        };

  if (midas.loading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-background/55 p-4">
        <p className="text-sm text-muted-foreground">{copy.loading}</p>
      </div>
    );
  }

  if (midas.error) {
    return (
      <div className="rounded-2xl border border-border/60 bg-background/55 p-4">
        <p className="text-sm text-rose-400">
          {copy.loadFailed}: {midas.error}
        </p>
      </div>
    );
  }

  const top5 = midas.listRanking.slice(0, 5);
  const holdingCount = midas.holdings.length;

  return (
    <div className="rounded-2xl border border-border/60 bg-background/55 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="size-4 text-sky-400" />
          <h3 className="text-sm font-semibold">{copy.title}</h3>
          <span className="text-[10px] text-muted-foreground">
            {midas.marketPhase} • {midas.listRanking.length}{" "}
            {copy.marketPhaseUnit}
          </span>
        </div>
        {holdingCount > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Briefcase className="size-3" />
            {holdingCount} {copy.holdings}
          </div>
        )}
      </div>

      <div className="grid gap-2">
        {top5.map(item => (
          <div
            key={item.ticker}
            className="flex items-center justify-between rounded-lg border border-border/40 bg-background/80 px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold">${item.ticker}</span>
              <span
                className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase ${gradeBadgeClass(item.grade)}`}
              >
                {item.grade}
              </span>
              {item.status === "holding" && (
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] text-emerald-300">
                  {copy.holding}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-muted-foreground">
                MSS {item.mss.toFixed(2)}
              </span>
              <span
                className={`flex items-center gap-0.5 ${item.changePct >= 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {item.changePct >= 0 ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {item.changePct >= 0 ? "+" : ""}
                {item.changePct.toFixed(2)}%
              </span>
              <span className="text-muted-foreground text-[10px]">
                {item.phase}
              </span>
            </div>
          </div>
        ))}
      </div>

      {midas.holdings.length > 0 && (
        <div className="mt-3 border-t border-border/30 pt-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {copy.positionHealth}
          </p>
          <div className="grid gap-1.5">
            {midas.holdings.slice(0, 4).map(h => (
              <div
                key={h.ticker}
                className="flex items-center justify-between text-xs"
              >
                <span className="font-medium">${h.ticker}</span>
                <span
                  className={
                    h.unrealizedPct >= 0 ? "text-emerald-400" : "text-rose-400"
                  }
                >
                  {h.unrealizedPct >= 0 ? "+" : ""}
                  {h.unrealizedPct.toFixed(1)}% — {h.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
