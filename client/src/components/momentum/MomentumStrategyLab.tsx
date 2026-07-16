import { useEffect, useMemo, useState } from "react";
import { FlaskConical, Info, Save, Scale, SlidersHorizontal, Trash2 } from "lucide-react";
import type { SavedPortfolioScenarioRecord } from "@shared/opportunities";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AppLanguage } from "@/lib/i18n";
import {
  STRATEGY_LENSES,
  scoreStrategyLens,
  simulatePortfolio,
  type PortfolioWeighting,
  type StrategyLabSignal,
  type StrategyLensId,
} from "./strategyLab";

const lensLabels: Record<StrategyLensId, [string, string]> = {
  opening_drive: ["Açılış İtkisi", "Opening Drive"],
  trend_continuation: ["Trend Devamı", "Trend Continuation"],
  reversal: ["Dönüş", "Reversal"],
  defensive: ["Defansif", "Defensive"],
  catalyst: ["Katalizör", "Catalyst"],
};

function metric(value: number, suffix = "") {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}${suffix}`;
}

export default function MomentumStrategyLab({
  signals,
  selectedTickers,
  language,
  calibrationDate,
  paramsVersion,
  activeListId,
  activeListName,
}: {
  signals: StrategyLabSignal[];
  selectedTickers: string[];
  language: AppLanguage;
  calibrationDate?: string;
  paramsVersion?: string;
  activeListId: string;
  activeListName: string;
}) {
  const [lens, setLens] = useState<StrategyLensId>("trend_continuation");
  const [weighting, setWeighting] =
    useState<PortfolioWeighting>("equal");
  const [transactionCostBps, setTransactionCostBps] = useState(10);
  const [savedScenarios, setSavedScenarios] = useState<
    SavedPortfolioScenarioRecord[]
  >([]);
  const [canSave, setCanSave] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saving, setSaving] = useState(false);
  const isEnglish = language === "en";
  const copy = isEnglish
    ? {
        eyebrow: "Strategy lab",
        title: "Turn the active list into a transparent portfolio test",
        description:
          "Rank the same Midas evidence through five published lenses, then compare the active list with the equal-weight Midas universe.",
        ranking: "Lens ranking",
        simulation: "Portfolio simulation",
        equal: "Equal weight",
        riskParity: "Risk parity",
        cost: "Transaction cost",
        portfolio: "Portfolio",
        benchmark: "Midas universe",
        return: "Return",
        drawdown: "Max drawdown",
        volatility: "Ann. volatility",
        sharpe: "Sharpe",
        coverage: "Coverage",
        noData:
          "Add names with at least five historical closes to the active list to run the simulation.",
        snapshot:
          "Snapshot-window simulation — not a production backtest or a forecast.",
        methodology: "Methodology and weights",
        calibration: "Calibration",
        version: "Parameter version",
        sessions: "sessions",
        save: "Save basket",
        saved: "Saved baskets",
        savePlaceholder: "Basket name",
      }
    : {
        eyebrow: "Strateji laboratuvarı",
        title: "Aktif listeyi şeffaf bir portföy testine dönüştür",
        description:
          "Aynı Midas kanıtlarını beş yayınlanmış lensle sırala; aktif listeyi eşit ağırlıklı Midas evreniyle karşılaştır.",
        ranking: "Lens sıralaması",
        simulation: "Portföy simülasyonu",
        equal: "Eşit ağırlık",
        riskParity: "Risk parity",
        cost: "İşlem maliyeti",
        portfolio: "Portföy",
        benchmark: "Midas evreni",
        return: "Getiri",
        drawdown: "Maks. drawdown",
        volatility: "Yıllık volatilite",
        sharpe: "Sharpe",
        coverage: "Kapsam",
        noData:
          "Simülasyon için aktif listeye en az beş kapanış verisi olan hisseler ekle.",
        snapshot:
          "Snapshot-pencere simülasyonudur; üretim backtest'i veya tahmin değildir.",
        methodology: "Metodoloji ve ağırlıklar",
        calibration: "Kalibrasyon",
        version: "Parametre sürümü",
        sessions: "seans",
        save: "Sepeti kaydet",
        saved: "Kayıtlı sepetler",
        savePlaceholder: "Sepet adı",
      };

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/portfolios", { cache: "no-store", credentials: "include" })
      .then(async response => {
        if (!response.ok) return null;
        return (await response.json()) as {
          items: SavedPortfolioScenarioRecord[];
        };
      })
      .then(payload => {
        if (!cancelled && payload) {
          setSavedScenarios(payload.items || []);
          setCanSave(true);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const ranked = useMemo(
    () =>
      signals
        .map(signal => ({ signal, score: scoreStrategyLens(signal, lens) }))
        .sort((left, right) => right.score - left.score)
        .slice(0, 8),
    [lens, signals]
  );
  const selected = useMemo(() => {
    const selectedSet = new Set(selectedTickers);
    return signals.filter(signal => selectedSet.has(signal.symbol));
  }, [selectedTickers, signals]);
  const simulation = useMemo(
    () =>
      simulatePortfolio({
        selected,
        universe: signals,
        weighting,
        transactionCostBps,
      }),
    [selected, signals, transactionCostBps, weighting]
  );
  const definition = STRATEGY_LENSES.find(item => item.id === lens)!;

  const saveScenario = async () => {
    if (!canSave || !selectedTickers.length || saving) return;
    setSaving(true);
    try {
      const response = await fetch("/api/portfolios", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:
            saveName.trim() ||
            `${activeListName} · ${lensLabels[lens][isEnglish ? 1 : 0]}`,
          listId: activeListId,
          weighting,
          transactionCostBps,
          tickers: selectedTickers,
        }),
      });
      if (response.ok) {
        const payload = (await response.json()) as {
          items: SavedPortfolioScenarioRecord[];
        };
        setSavedScenarios(payload.items || []);
        setSaveName("");
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteScenario = async (scenarioId: string) => {
    const response = await fetch(`/api/portfolios/${encodeURIComponent(scenarioId)}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      const payload = (await response.json()) as {
        items: SavedPortfolioScenarioRecord[];
      };
      setSavedScenarios(payload.items || []);
    }
  };

  return (
    <section className="border-t border-border bg-[linear-gradient(180deg,rgba(14,165,233,0.035),rgba(15,23,42,0.15))] p-4 md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-violet-300">
            <FlaskConical className="size-4" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
              {copy.eyebrow}
            </p>
          </div>
          <h3 className="heading-condensed text-2xl text-foreground">
            {copy.title}
          </h3>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            {copy.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {STRATEGY_LENSES.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLens(item.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                lens === item.id
                  ? "border-violet-400/35 bg-violet-500/15 text-violet-100"
                  : "border-border bg-background/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {lensLabels[item.id][isEnglish ? 1 : 0]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-xl border border-border bg-card/55 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-foreground">{copy.ranking}</h4>
            <span className="data-mono text-[10px] text-muted-foreground">
              0–100
            </span>
          </div>
          <div className="mt-3 space-y-2">
            {ranked.map(({ signal, score }, index) => (
              <div
                key={signal.symbol}
                className="grid grid-cols-[1.5rem_4rem_1fr_3rem] items-center gap-2 text-xs"
              >
                <span className="data-mono text-muted-foreground">{index + 1}</span>
                <a
                  href={`/coverage/${signal.symbol}`}
                  className="font-semibold text-foreground hover:text-sky-300"
                >
                  {signal.symbol}
                </a>
                <div className="h-1.5 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-violet-400"
                    style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                  />
                </div>
                <span className="data-mono text-right text-foreground">
                  {score.toFixed(0)}
                </span>
              </div>
            ))}
          </div>

          <details className="mt-4 rounded-xl border border-border/70 bg-background/35 p-3">
            <summary className="cursor-pointer text-xs font-semibold text-muted-foreground">
              {copy.methodology}
            </summary>
            <div className="mt-3 space-y-2">
              {definition.weights.map(item => (
                <div key={item.factor} className="flex justify-between gap-3 text-xs">
                  <span className="text-muted-foreground">{item.factor}</span>
                  <span className="data-mono text-foreground">{item.weight}%</span>
                </div>
              ))}
              <div className="mt-3 border-t border-border/70 pt-3 text-[10px] leading-5 text-muted-foreground">
                {copy.calibration}: {calibrationDate || "-"} · {copy.version}: {paramsVersion || "-"}
              </div>
            </div>
          </details>
        </div>

        <div className="rounded-xl border border-border bg-card/55 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">{copy.simulation}</h4>
              <p className="mt-1 text-[11px] text-muted-foreground">{copy.snapshot}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Scale className="size-3.5" />
                <select
                  value={weighting}
                  onChange={event => setWeighting(event.target.value as PortfolioWeighting)}
                  className="h-8 rounded-lg border border-border bg-background px-2 text-xs text-foreground"
                >
                  <option value="equal">{copy.equal}</option>
                  <option value="risk_parity">{copy.riskParity}</option>
                </select>
              </label>
              <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <SlidersHorizontal className="size-3.5" />
                {copy.cost}
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={transactionCostBps}
                  onChange={event => setTransactionCostBps(Math.min(100, Math.max(0, Number(event.target.value) || 0)))}
                  className="h-8 w-16 rounded-lg border border-border bg-background px-2 text-xs text-foreground"
                />
                bps
              </label>
            </div>
          </div>

          {simulation ? (
            <>
              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simulation.points}>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="session" tick={{ fontSize: 10 }} stroke="rgba(148,163,184,0.45)" />
                    <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} stroke="rgba(148,163,184,0.45)" />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(15,23,42,0.96)",
                        border: "1px solid rgba(148,163,184,0.2)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                    <Line type="monotone" dataKey="portfolio" name={copy.portfolio} stroke="#38bdf8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="benchmark" name={copy.benchmark} stroke="#a78bfa" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  [copy.return, metric(simulation.portfolio.returnPct, "%"), metric(simulation.benchmark.returnPct, "%")],
                  [copy.drawdown, metric(simulation.portfolio.maxDrawdownPct, "%"), metric(simulation.benchmark.maxDrawdownPct, "%")],
                  [copy.volatility, metric(simulation.portfolio.volatilityPct, "%"), metric(simulation.benchmark.volatilityPct, "%")],
                  [copy.sharpe, simulation.portfolio.sharpe.toFixed(2), simulation.benchmark.sharpe.toFixed(2)],
                ].map(([label, portfolioValue, benchmarkValue]) => (
                  <div key={label} className="rounded-xl border border-border/70 bg-background/35 p-3">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
                    <p className="data-mono mt-1 text-sm font-semibold text-sky-200">{portfolioValue}</p>
                    <p className="data-mono mt-0.5 text-[10px] text-violet-300">{benchmarkValue}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
                <span>{copy.coverage}: {simulation.coveredSymbols}/{selectedTickers.length}</span>
                <span>{simulation.sessions} {copy.sessions}</span>
                <span>{simulation.weights.slice(0, 5).map(item => `${item.symbol} ${(item.weight * 100).toFixed(0)}%`).join(" · ")}</span>
              </div>
              {canSave ? (
                <div className="mt-4 flex flex-col gap-2 border-t border-border/70 pt-4 sm:flex-row sm:items-center">
                  <input
                    value={saveName}
                    onChange={event => setSaveName(event.target.value)}
                    placeholder={copy.savePlaceholder}
                    maxLength={64}
                    className="h-9 min-w-0 flex-1 rounded-xl border border-border bg-background/55 px-3 text-xs text-foreground outline-none focus:border-sky-400/40"
                  />
                  <button
                    type="button"
                    onClick={() => void saveScenario()}
                    disabled={saving || selectedTickers.length === 0}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-sky-500/18 px-3 text-xs font-semibold text-sky-100 disabled:opacity-45"
                  >
                    <Save className="size-3.5" />
                    {copy.save}
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="mt-4 flex min-h-52 items-center justify-center rounded-xl border border-dashed border-border bg-background/25 p-6 text-center">
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                <Info className="mx-auto mb-2 size-5 text-sky-300" />
                {copy.noData}
              </p>
            </div>
          )}
          {savedScenarios.length ? (
            <div className="mt-4 border-t border-border/70 pt-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {copy.saved}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {savedScenarios.slice(0, 8).map(scenario => (
                  <span
                    key={scenario.id}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background/45 px-3 py-1.5 text-[11px] text-foreground"
                  >
                    {scenario.name}
                    <button
                      type="button"
                      onClick={() => void deleteScenario(scenario.id)}
                      className="text-muted-foreground hover:text-rose-300"
                      aria-label={`${scenario.name} delete`}
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
