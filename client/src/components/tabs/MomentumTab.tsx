/*
 * DESIGN: "Precision Finance" — Momentum Tab
 * Full momentum scoring table + scatter chart + volume analysis
 */

import { stocksData, signalConfig, riskConfig, type StockData } from '@/lib/stockData';
import { type AppLanguage } from "@/lib/i18n";
import { Delta } from '@/components/ui/delta';
import {
  ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig, } from '@/components/ui/chart';
import {
  chartAxisLabel, chartAxisStrongTick, chartAxisTick, chartCursorLine, chartCursorZone, chartGrid, chartPalette, coerceChartNumber, formatChartNumber, formatChartPercent, getChartAriaLabel, getMomentumBandColor, getSignalChartColor, } from '@/lib/chartTheme';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Cell, BarChart, Bar, } from 'recharts';import { t } from "@/lib/i18n";


interface Props {
  onStockClick: (ticker: string) => void;
  stocks?: StockData[];
  language: AppLanguage;
}

export default function MomentumTab({ onStockClick, stocks = stocksData, language }: Props) {
  const sorted = [...stocks].sort((a, b) => b.momentumScore - a.momentumScore);

  const scatterData = stocks.map(s => ({
    ticker: s.ticker,
    x: s.priceChange6M,
    y: s.momentumScore,
    beat: s.earningsBeatProbability,
    signal: s.signal,
  }));

  const volumeData = stocks.map(s => ({
    ticker: s.ticker,
    mevcut: s.volumeCurrent,
    ortalama: s.volumeAvg3M,
  }));
  const scatterChartConfig = {
    y: {
      label: 'Momentum',
      color: chartPalette.accent,
    },
  } satisfies ChartConfig;
  const volumeChartConfig = {
    mevcut: {
      label: t("common:currentVolume"),
      color: chartPalette.bull,
    },
    ortalama: {
      label: t("common:3mAvgVolume"),
      color: chartPalette.warning,
    },
  } satisfies ChartConfig;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5" style={{ background: 'oklch(0.78 0.18 160)' }} />
          <h1 className="heading-condensed text-xl" style={{ color: 'oklch(0.92 0.01 220)' }}>
            {t("common:realMomentumScoring")}
          </h1>
        </div>
        <p className="text-sm ml-3" style={{ color: 'oklch(0.5 0.015 225)' }}>
          {t("common:priceVolumeSectorSupportCorrelation")}
        </p>
      </div>

      {/* Methodology */}
      <div className="p-4 border-l-2" style={{ borderColor: 'oklch(0.75 0.15 75)', background: 'oklch(0.75 0.15 75 / 0.05)' }}>
        <div className="text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.75 0.15 75)' }}>
          {t("common:methodology")}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { id: 'Fiyat Momentum', label: t("common:priceMomentum"), weight: '25%', desc: t("common:6m1mReturn") },
            { id: 'Hacim Analizi', label: t("common:volumeAnalysis"), weight: '20%', desc: t("common:priceVolumeAlignment") },
            { id: 'Sektörel Destek', label: t("common:sectorSupport"), weight: '20%', desc: t("common:etfCorrelation") },
            { id: 'Analist Konsensüs', label: t("common:analystConsensus"), weight: '20%', desc: t("common:buyTarget") },
            { id: 'Earnings Geçmişi', label: t("common:earningsHistory"), weight: '15%', desc: t("common:beatRateGrowth") },
          ].map(m => (
            <div key={m.id} className="text-center">
              <div className="data-mono text-lg font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{m.weight}</div>
              <div className="text-xs font-semibold" style={{ color: 'oklch(0.75 0.01 220)' }}>{m.label}</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Scoring Table */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.78 0.18 160)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            {t("common:fullScoringTable")}
          </h2>
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '2px solid oklch(0.22 0.03 225)', background: 'oklch(0.13 0.025 230)' }}>
                {[
                  t("common:rank"),
                  t("common:ticker"),
                  t("common:signal"),
                  'Momentum',
                  t("common:beatProb3e17"),
                  t("common:6mReturn"),
                  'RSI',
                  t("common:volume"),
                  t("common:analystBuy"),
                  'Risk',
                  'Earnings',
                ].map((h, idx) => (
                  <th key={idx} className="px-3 py-2 text-left heading-condensed text-xs tracking-wider" style={{ color: 'oklch(0.55 0.015 225)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((stock, i) => {
                const cfg = signalConfig[stock.signal];
                const rCfg = riskConfig[stock.riskLevel];
                return (
                  <tr
                    key={stock.ticker}
                    onClick={() => onStockClick(stock.ticker)}
                    className="cursor-pointer transition-colors"
                    style={{
                      borderBottom: '1px solid oklch(0.18 0.025 225)',
                      background: i % 2 === 0 ? 'transparent' : 'oklch(0.13 0.025 230 / 0.5)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0.78 0.18 160 / 0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'oklch(0.13 0.025 230 / 0.5)')}
                  >
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-bold" style={{ color: 'oklch(0.4 0.02 225)' }}>#{i + 1}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div>
                        <span className="data-mono text-sm font-bold" style={{ color: 'oklch(0.92 0.01 220)' }}>{stock.ticker}</span>
                        <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{stock.sector}</div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs font-bold px-2 py-0.5 border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`} style={{ borderRadius: 0 }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="data-mono text-sm font-bold" style={{
                          color: stock.momentumScore >= 80 ? 'oklch(0.78 0.18 160)' :
                                 stock.momentumScore >= 60 ? 'oklch(0.75 0.15 75)' :
                                 'oklch(0.65 0.22 25)'
                        }}>
                          {stock.momentumScore}
                        </span>
                        <div style={{ width: '50px', height: '4px', background: 'oklch(0.2 0.03 225)' }}>
                          <div style={{
                            width: `${stock.momentumScore}%`,
                            height: '100%',
                            background: stock.momentumScore >= 80 ? 'oklch(0.78 0.18 160)' :
                                        stock.momentumScore >= 60 ? 'oklch(0.75 0.15 75)' :
                                        'oklch(0.65 0.22 25)',
                          }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.78 0.18 160)' }}>
                        %{stock.earningsBeatProbability}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{
                        color: stock.priceChange6M > 0 ? 'oklch(0.78 0.18 160)' : 'oklch(0.65 0.22 25)'
                      }}>
                        {stock.priceChange6M > 0 ? '+' : ''}{stock.priceChange6M}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs" style={{
                        color: stock.rsi14 > 75 ? 'oklch(0.65 0.22 25)' :
                               stock.rsi14 < 35 ? 'oklch(0.75 0.15 75)' :
                               'oklch(0.75 0.01 220)'
                      }}>
                        {stock.rsi14}
                        {stock.rsi14 > 75 && <span className="ml-1 text-xs">⚠</span>}
                        {stock.rsi14 < 35 && <span className="ml-1 text-xs">↓</span>}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs font-semibold ${
                        stock.volumeStatus === 'VERY_HIGH' ? 'text-emerald-400' :
                        stock.volumeStatus === 'HIGH' ? 'text-green-400' :
                        stock.volumeStatus === 'LOW' ? 'text-red-400' :
                        'text-amber-400'
                      }`}>
                        {stock.volumeStatus === 'VERY_HIGH'
                          ? t("common:veryHigh")
                          : stock.volumeStatus === 'HIGH'
                            ? t("common:highbd6c")
                            : stock.volumeStatus === 'LOW'
                              ? t("common:low2982")
                              : 'Normal'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs" style={{ color: 'oklch(0.75 0.01 220)' }}>
                        %{stock.analystBuyConsensus}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`data-mono text-xs font-semibold ${rCfg.textClass}`}>
                        {rCfg.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs" style={{ color: 'oklch(0.75 0.15 75)' }}>
                        {stock.earningsDate}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="space-y-3 md:hidden">
          {sorted.map((stock, i) => (
            <MomentumMobileCard
              key={stock.ticker}
              stock={stock}
              rank={i + 1}
              onClick={() => onStockClick(stock.ticker)}
              language={language}
            />
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Scatter: 6A Getiri vs Momentum */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4" style={{ background: 'oklch(0.6 0.12 250)' }} />
            <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
              {t("common:6mReturnVsMomentumScore")}
            </h2>
          </div>
          <div className="data-card p-4" style={{ height: '320px' }}>
            <ChartContainer
              aria-label={getChartAriaLabel(
                t("common:6mReturnAndMomentumScatter"),
                t("common:xAxisShowsSixMonth")
              )}
              className="h-full aspect-auto"
              config={scatterChartConfig}
            >
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid {...chartGrid} />
                <XAxis
                  dataKey="x"
                  name={t("common:6mReturn")}
                  unit="%"
                  tick={chartAxisTick}
                  label={chartAxisLabel(t("common:6mReturn5a67"), { position: 'insideBottom', offset: -10 })}
                />
                <YAxis
                  dataKey="y"
                  name={'Momentum'}
                  tick={chartAxisTick}
                  label={chartAxisLabel('Momentum', { angle: -90, position: 'insideLeft' })}
                />
                <ChartTooltip
                  cursor={chartCursorLine}
                  content={
                    <ChartTooltipContent
                      labelKey="ticker"
                      renderContent={({ datum, label }) => (
                        <>
                          <div className="data-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                            {label}
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">{t("common:6mReturn")}</span>
                            <Delta value={coerceChartNumber(datum?.x as number | string | null | undefined)} precision={1} />
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">{'Momentum'}</span>
                            <span className="data-mono font-semibold text-foreground">
                              {formatChartNumber(datum?.y)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">{t("common:beatProb3e17")}</span>
                            <span className="data-mono font-semibold text-foreground">
                              {formatChartPercent(datum?.beat)}
                            </span>
                          </div>
                        </>
                      )}
                    />
                  }
                />
                <Scatter data={scatterData} name={t("flow:ticker")}>
                  {scatterData.map((entry, i) => (
                    <Cell key={i} fill={getSignalChartColor(entry.signal)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ChartContainer>
          </div>
        </div>

        {/* Volume Comparison */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4" style={{ background: 'oklch(0.75 0.15 75)' }} />
            <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
              {t("common:volumeAnalysisCurrentVs3m")}
            </h2>
          </div>
          <div className="data-card p-4" style={{ height: '320px' }}>
            <ChartContainer
              aria-label={getChartAriaLabel(
                t("common:volumeComparisonChart"),
                t("common:currentVolumeVsThreeMonth")
              )}
              className="h-full aspect-auto"
              config={volumeChartConfig}
            >
              <BarChart data={volumeData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid {...chartGrid} />
                <XAxis dataKey="ticker" tick={chartAxisStrongTick} />
                <YAxis tick={chartAxisTick} />
                <ChartTooltip
                  cursor={chartCursorZone}
                  content={
                    <ChartTooltipContent
                      labelKey="ticker"
                      renderContent={({ datum, label }) => (
                        <>
                          <div className="data-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                            {label}
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">{t("common:current")}</span>
                            <span className="data-mono font-semibold text-foreground">
                              {formatChartNumber(datum?.mevcut)}M
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">{t("common:3mAverage")}</span>
                            <span className="data-mono font-semibold text-foreground">
                              {formatChartNumber(datum?.ortalama)}M
                            </span>
                          </div>
                        </>
                      )}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="mevcut" name={t("common:currentVolume")} fill={chartPalette.bull} maxBarSize={20} />
                <Bar dataKey="ortalama" name={t("common:3mAvgVolume")} fill={chartPalette.warningSoft} maxBarSize={20} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function MomentumMobileCard({
  stock,
  rank,
  onClick,
  language,
}: {
  stock: StockData;
  rank: number;
  onClick: () => void;
  language: AppLanguage;
}) {
  const cfg = signalConfig[stock.signal];
  const rCfg = riskConfig[stock.riskLevel];
  const momentumColor = getMomentumBandColor(stock.momentumScore);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-white/10 bg-black/20 p-4 text-left"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="data-mono text-sm font-bold text-slate-400">
              #{rank}
            </span>
            <span className="data-mono text-base font-bold text-foreground">
              {stock.ticker}
            </span>
            <span className="truncate text-sm text-muted-foreground">
              {stock.sector}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`rounded-md border px-2 py-1 text-sm font-bold ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`}
            >
              {cfg.label}
            </span>
            <span className={`data-mono text-sm font-semibold ${rCfg.textClass}`}>
              {rCfg.label}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[13px] text-muted-foreground">{'Momentum'}</div>
          <div className="data-mono text-lg font-bold" style={{ color: momentumColor }}>
            {stock.momentumScore}
          </div>
        </div>
      </div>

      <div className="mt-3 h-1.5 rounded-full bg-white/10">
        <div
          className="h-full rounded-full"
          style={{ width: `${stock.momentumScore}%`, background: momentumColor }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
          <div className="text-[13px] text-muted-foreground">{t("common:beatProb3e17")}</div>
          <div className="mt-1 data-mono font-semibold text-foreground">
            %{stock.earningsBeatProbability}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
          <div className="text-[13px] text-muted-foreground">{t("common:6mReturn")}</div>
          <div className="mt-1">
            <Delta value={stock.priceChange6M} precision={1} />
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
          <div className="text-[13px] text-muted-foreground">{'RSI'}</div>
          <div className="mt-1 data-mono font-semibold text-foreground">
            {stock.rsi14}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
          <div className="text-[13px] text-muted-foreground">{t("common:analystBuy")}</div>
          <div className="mt-1 data-mono font-semibold text-foreground">
            %{stock.analystBuyConsensus}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span className="text-muted-foreground">
          {'Earnings:'} <span className="data-mono text-foreground">{stock.earningsDate}</span>
        </span>
        <span className="text-muted-foreground">
          {t("common:volume9346")}{" "}
          <span className="font-semibold text-foreground">
            {stock.volumeStatus === 'VERY_HIGH'
              ? t("common:veryHigh")
              : stock.volumeStatus === 'HIGH'
                ? t("common:highbd6c")
                : stock.volumeStatus === 'LOW'
                  ? t("common:low2982")
                  : 'Normal'}
          </span>
        </span>
      </div>
    </button>
  );
}

