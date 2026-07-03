import { type AppLanguage, t } from "@/lib/i18n";

import { cn } from "@/lib/utils";

export interface OptionsChainHeatmapProps {
  data: Array<{
    ask: number;
    bid: number;
    delta?: number;
    iv?: number;
    strike: number;
    volume?: number;
  }>;
  language?: AppLanguage;
  price?: number;
}

export default function OptionsChainHeatmap({
  data,
  language = "en",
  price,
}: OptionsChainHeatmapProps) {
  if (data.length === 0) return null;

  const maxVolume = Math.max(...data.map((d) => d.volume ?? 0), 1);
  const maxIv = Math.max(...data.map((d) => d.iv ?? 0), 1);

  const atmStrike = price
    ? data.reduce((closest, d) =>
        Math.abs(d.strike - price) < Math.abs(closest.strike - price)
          ? d
          : closest
      )
    : null;

  const volumeColor = (vol: number) => {
    const intensity = vol / maxVolume;
    return `rgba(34, 197, 94, ${0.1 + intensity * 0.5})`;
  };

  const ivColor = (iv: number) => {
    const intensity = iv / maxIv;
    return `rgba(244, 63, 94, ${0.1 + intensity * 0.5})`;
  };

  const volumeWidth = (vol: number) => {
    const intensity = vol / maxVolume;
    return `${intensity * 100}%`;
  };

  return (
    <div className="space-y-3 rounded-xl border border-border bg-background/30 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {t("coverage:optionsChain")}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {"Strike"}
              </th>
              <th className="px-3 py-2 text-right text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Bid
              </th>
              <th className="px-3 py-2 text-right text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Ask
              </th>
              <th className="px-3 py-2 text-right text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {t("common:volume")}
              </th>
              <th className="px-3 py-2 text-right text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                IV
              </th>
              {data.some((d) => d.delta !== undefined) && (
                <th className="px-3 py-2 text-right text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Delta
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const isAtm = atmStrike?.strike === row.strike;

              return (
                <tr
                  key={index}
                  className={cn(
                    "border-b border-border/50 transition-colors",
                    isAtm && "bg-sky-500/5"
                  )}
                >
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        "font-semibold tabular-nums",
                        isAtm
                          ? "text-sky-300"
                          : "text-foreground"
                      )}
                    >
                      ${row.strike.toFixed(2)}
                    </span>
                    {isAtm && (
                      <span className="ml-1.5 rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-medium text-sky-300">
                        ATM
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                    {row.bid.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                    {row.ask.toFixed(2)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <span className="tabular-nums text-muted-foreground">
                        {(row.volume ?? 0).toLocaleString()}
                      </span>
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-background/50">
                        <div
                          className="h-full rounded-full bg-emerald-400/60"
                          style={{ width: volumeWidth(row.volume ?? 0) }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <span className="tabular-nums text-muted-foreground">
                        {row.iv !== undefined ? `${row.iv.toFixed(1)}%` : "—"}
                      </span>
                      <div
                        className="h-4 w-4 rounded"
                        style={{
                          backgroundColor: ivColor(row.iv ?? 0),
                        }}
                      />
                    </div>
                  </td>
                  {row.delta !== undefined && (
                    <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                      {row.delta.toFixed(2)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
