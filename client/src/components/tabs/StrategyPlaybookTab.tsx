import { useEffect, useMemo, useRef } from "react";
import type { StrategyCalendarItem } from "@/lib/earningStrategyData";
import { copy, useAppLanguage } from "@/lib/i18n";
import {
  riskConfig,
  signalConfig,
  type StockData,
} from "@/lib/stockData";
import {
  riskLevelConfig,
  strategyConfig,
  type OptionStrategy,
} from "@/lib/optionStrategyData";

interface Props {
  stocks: StockData[];
  strategies: OptionStrategy[];
  calendar: StrategyCalendarItem[];
  selectedTicker: string | null;
  onSelectTicker: (ticker: string) => void;
  reportWindow: string;
  analysisDateLabel: string;
}

export default function StrategyPlaybookTab({
  stocks,
  strategies,
  calendar,
  selectedTicker,
  onSelectTicker,
  reportWindow,
  analysisDateLabel,
}: Props) {
  const language = useAppLanguage();
  const hasInitialSelection = useRef(false);
  const entries = useMemo(() => {
    const optionMap = new Map(strategies.map(strategy => [strategy.ticker, strategy]));
    const calendarMap = new Map(calendar.map(item => [item.ticker, item]));

    return stocks.map(stock => ({
      stock,
      option: optionMap.get(stock.ticker),
      calendar: calendarMap.get(stock.ticker),
    }));
  }, [calendar, stocks, strategies]);

  useEffect(() => {
    if (!selectedTicker) {
      return;
    }

    if (!hasInitialSelection.current) {
      hasInitialSelection.current = true;
      return;
    }

    const target = document.getElementById(`playbook-${selectedTicker}`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedTicker]);

  if (!entries.length) {
    return (
      <div className="p-6">
        <section className="rounded-none border border-border bg-card/80 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
            {copy(language, "Published data bekleniyor", "Waiting for published data")}
          </p>
          <h1 className="mt-3 heading-condensed text-3xl text-foreground">
            {copy(language, "Gosterilecek earning benchmark verisi yok", "No earning benchmark data to display")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {copy(
              language,
              "Bu ekran artik static seed veya uydurma fallback gostermiyor. Admin workspace uzerinden gercek weekly report publish edilince benchmark burada gorunur.",
              "This screen no longer shows static seeds or fabricated fallbacks. The benchmark appears here once a real weekly report is published from the admin workspace."
            )}
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <section className="rounded-none border border-border bg-card/80 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              {copy(language, "Birlesik Earnings Playbook", "Unified Earnings Playbook")}
            </p>
            <h1 className="heading-condensed text-3xl leading-none text-foreground md:text-4xl">
              {copy(language, "Hisse hisse,", "Stock by stock,")}
              <br />
              {copy(language, "earning tarihine gore akis", "flow by earnings date")}
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {copy(
                language,
                "Tum coverage tek formatta birlestirildi. Her kart, secili hissenin momentum profilini, tezini, risklerini ve opsiyon planini ayni yerde toplar.",
                "All coverage is merged into a single format. Each card gathers the selected stock's momentum profile, thesis, risks, and options plan in one place."
              )}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[460px]">
            <div className="rounded-none border border-border bg-background/50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {copy(language, "Coverage", "Coverage")}
              </p>
              <p className="mt-2 data-mono text-lg font-bold text-foreground">
                {stocks.length} {copy(language, "hisse", "stocks")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{reportWindow}</p>
            </div>
            <div className="rounded-none border border-border bg-background/50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {copy(language, "Analysis", "Analysis")}
              </p>
              <p className="mt-2 data-mono text-lg font-bold text-foreground">
                {analysisDateLabel}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {copy(language, "Son toplu strateji guncellemesi", "Latest batch strategy refresh")}
              </p>
            </div>
            <div className="rounded-none border border-border bg-background/50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Flow
              </p>
              <p className="mt-2 data-mono text-lg font-bold text-emerald-300">
                {copy(language, "Tarih sirali", "Date ranked")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {copy(language, "En yakin event en ustte kalir", "The nearest event stays on top")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1" style={{ background: "oklch(0.78 0.18 160)" }} />
          <h2 className="heading-condensed text-base text-foreground">
            {copy(language, "Hisse Atlama Menusu", "Stock Jump Menu")}
          </h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {entries.map(({ stock, calendar: calendarItem }) => (
            <button
              key={stock.ticker}
              type="button"
              onClick={() => onSelectTicker(stock.ticker)}
              className={`shrink-0 rounded-none border px-3 py-2 text-left ${
                selectedTicker === stock.ticker
                  ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-300"
                  : "border-border bg-card/70 text-muted-foreground"
              }`}
            >
              <div className="data-mono text-xs font-bold">{stock.ticker}</div>
              <div className="mt-1 text-[11px]">
                {calendarItem?.label || stock.earningsDate}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        {entries.map(({ stock, option, calendar: calendarItem }) => {
          const signal = signalConfig[stock.signal];
          const stockRisk = riskConfig[stock.riskLevel];
          const strategy = option ? strategyConfig[option.strategyRating] : null;
          const optionRisk = option ? riskLevelConfig[option.riskLevel] : null;
          const directionalColor =
            option?.directionalBias === "CALL"
              ? "text-emerald-300 border-emerald-400/30 bg-emerald-500/10"
              : option?.directionalBias === "PUT"
                ? "text-red-300 border-red-400/30 bg-red-500/10"
                : "text-amber-300 border-amber-400/30 bg-amber-500/10";

          return (
            <article
              id={`playbook-${stock.ticker}`}
              key={stock.ticker}
              className={`rounded-none border bg-card/80 p-5 transition-colors ${
                selectedTicker === stock.ticker
                  ? "border-emerald-400/50"
                  : "border-border"
              }`}
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <span>{calendarItem?.label || stock.earningsDate}</span>
                    <span className="rounded-none border border-border bg-background/60 px-2 py-1">
                      {calendarItem?.time || stock.earningsTime}
                    </span>
                    <span className="rounded-none border border-border bg-background/60 px-2 py-1">
                      {stock.sector}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="heading-condensed text-3xl leading-none text-foreground">
                        {stock.ticker}
                      </h3>
                      <span
                        className={`border px-2.5 py-1 text-xs font-bold ${signal.bgClass} ${signal.textClass} ${signal.borderClass}`}
                      >
                        {signal.label}
                      </span>
                      {strategy ? (
                        <span
                          className={`border px-2.5 py-1 text-xs font-bold ${strategy.bgClass} ${strategy.textClass} ${strategy.borderClass}`}
                        >
                          {strategy.label}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{stock.name}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 xl:w-[440px]">
                  {[
                    {
                      label: "Momentum",
                      labelEn: "Momentum",
                      value: String(stock.momentumScore),
                      color: "text-emerald-300",
                    },
                    {
                      label: "Beat ihtimali",
                      labelEn: "Beat probability",
                      value: `%${stock.earningsBeatProbability}`,
                      color: "text-foreground",
                    },
                    {
                      label: "IV crush",
                      labelEn: "IV crush",
                      value: option ? `-%${option.expectedIVCrush}` : "-",
                      color: "text-amber-300",
                    },
                    {
                      label: "Implied move",
                      labelEn: "Implied move",
                      value: `±%${stock.impliedMove}`,
                      color: "text-foreground",
                    },
                    {
                      label: "Target",
                      labelEn: "Target",
                      value: option ? `%${option.targetProfit}` : "-",
                      color: "text-emerald-300",
                    },
                    {
                      label: "Max loss",
                      labelEn: "Max loss",
                      value: option ? `-%${option.maxLoss}` : "-",
                      color: "text-red-300",
                    },
                  ].map(metric => (
                    <div
                      key={metric.label}
                      className="rounded-none border border-border bg-background/50 p-3"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {copy(language, metric.label, metric.labelEn)}
                      </p>
                      <p className={`mt-2 data-mono text-lg font-bold ${metric.color}`}>
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <section className="rounded-none border border-border bg-background/40 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-4 w-1" style={{ background: "oklch(0.78 0.18 160)" }} />
                    <h4 className="heading-condensed text-sm text-foreground">
                      {copy(language, "Hisse Gorunumu", "Stock View")}
                    </h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    {[
                      [copy(language, "Earnings tarihi", "Earnings date"), stock.earningsDate],
                      [copy(language, "6A performans", "6M performance"), `${stock.priceChange6M > 0 ? "+" : ""}${stock.priceChange6M}%`],
                      [copy(language, "1A performans", "1M performance"), `${stock.priceChange1M > 0 ? "+" : ""}${stock.priceChange1M}%`],
                      ["RSI 14", String(stock.rsi14)],
                      ["Current IV", option ? String(option.currentIV) : "-"],
                      ["Historical IV", option ? String(option.historicalIV) : "-"],
                      [copy(language, "Tarihsel move", "Historical move"), option ? `%${option.lastEarningsMove}` : "-"],
                      [copy(language, "Risk seviyesi", "Risk level"), stockRisk.label],
                    ].map(([label, value]) => (
                      <div
                        key={String(label)}
                        className="flex items-center justify-between gap-3 border-b border-border/60 py-1.5"
                      >
                        <span className="text-muted-foreground">{label}</span>
                        <span className="data-mono text-xs font-semibold text-foreground">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-none border border-border bg-background/40 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-4 w-1" style={{ background: "oklch(0.75 0.15 75)" }} />
                    <h4 className="heading-condensed text-sm text-foreground">
                      {copy(language, "Opsiyon Oyun Plani", "Options Game Plan")}
                    </h4>
                  </div>

                  {option ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`border px-2.5 py-1 text-xs font-bold ${directionalColor}`}>
                          {copy(language, "Yon", "Bias")}: {option.directionalBias}
                        </span>
                        {optionRisk ? (
                          <span className={`data-mono text-xs font-bold ${optionRisk.textClass}`}>
                            {copy(language, "Risk", "Risk")}: {optionRisk.label}
                          </span>
                        ) : null}
                      </div>

                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {option.recommendedStrategy}
                      </p>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-none border border-border bg-card/70 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {copy(language, "Call setup", "Call setup")}
                          </p>
                          <div className="mt-2 space-y-1.5 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">{copy(language, "Al", "Buy")}</span>
                              <span className="data-mono text-xs font-semibold text-foreground">
                                ${option.callPremiumBuy.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">{copy(language, "Sat", "Sell")}</span>
                              <span className="data-mono text-xs font-semibold text-foreground">
                                ${option.callPremiumSell.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">{copy(language, "Getiri", "Gain")}</span>
                              <span className="data-mono text-xs font-semibold text-emerald-300">
                                +%{option.callGainFromIV}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-none border border-border bg-card/70 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {copy(language, "Put setup", "Put setup")}
                          </p>
                          <div className="mt-2 space-y-1.5 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">{copy(language, "Al", "Buy")}</span>
                              <span className="data-mono text-xs font-semibold text-foreground">
                                ${option.putPremiumBuy.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">{copy(language, "Sat", "Sell")}</span>
                              <span className="data-mono text-xs font-semibold text-foreground">
                                ${option.putPremiumSell.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">{copy(language, "Getiri", "Gain")}</span>
                              <span className="data-mono text-xs font-semibold text-emerald-300">
                                +%{option.putGainFromIV}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {copy(language, "Bu hisse icin opsiyon plani bulunamadi.", "No options plan was found for this stock.")}
                    </p>
                  )}
                </section>
              </div>

              <section className="mt-4 rounded-none border border-border bg-background/40 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-4 w-1" style={{ background: "oklch(0.6 0.12 250)" }} />
                  <h4 className="heading-condensed text-sm text-foreground">
                    {copy(language, "Tez", "Thesis")}
                  </h4>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {stock.thesis}
                </p>
              </section>

              <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
                <section className="rounded-none border border-border bg-background/40 p-4">
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    {copy(language, "Katalizorler", "Catalysts")}
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {stock.catalysts.slice(0, 4).map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-0.5 text-emerald-300">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-none border border-border bg-background/40 p-4">
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                    {copy(language, "Riskler", "Risks")}
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {stock.risks.slice(0, 4).map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-0.5 text-red-300">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-none border border-border bg-background/40 p-4">
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                    {copy(language, "Execution Notlari", "Execution Notes")}
                  </h4>
                  <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground">1. Build</p>
                      <p>
                        {copy(
                          language,
                          "10-15 gun once plan kur, implied move ve boyut sinirini yaz.",
                          "Build the plan 10-15 days ahead, and write down the implied move and sizing limit."
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">2. Reduce</p>
                      <p>
                        {copy(
                          language,
                          "1-2 gun kala IV expansion karini realize et, event riskini tasima.",
                          "Realize the IV expansion gain 1-2 days before the event and do not carry event risk."
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">3. Review</p>
                      <p>
                        {copy(
                          language,
                          "Beat, rehberlik ve gap davranisini ertesi gun ayni karttan yeniden degerlendir.",
                          "Re-evaluate the beat, guidance, and gap behavior from the same card on the next day."
                        )}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
