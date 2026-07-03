/*
 * DESIGN: "Precision Finance" — Option Strategy Detail Tab
 * Deep dive into each stock's option strategy
 */

import { optionStrategyData, strategyConfig, riskLevelConfig, type OptionStrategy } from '@/lib/optionStrategyData';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import {
  chartAxisLabel, chartAxisTick, chartCursorLine, chartGrid, chartLineDot, chartPalette, formatChartCurrency, formatChartNumber, getChartAriaLabel, } from '@/lib/chartTheme';

import type { AppLanguage } from '@/lib/i18n';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, } from 'recharts';import { t } from "@/lib/i18n";


interface Props {
  selectedTicker: string | null;
  onSelectTicker: (ticker: string) => void;
  strategies?: OptionStrategy[];
  language: AppLanguage;
}

export default function OptionDetailTab({
  selectedTicker,
  onSelectTicker,
  strategies = optionStrategyData,
  language,
}: Props) {
  const stock = selectedTicker
    ? strategies.find(s => s.ticker === selectedTicker) || strategies[0]
    : strategies[0];

  const cfg = strategyConfig[stock.strategyRating];
  const rCfg = riskLevelConfig[stock.riskLevel];

  // Timeline data
  const timelineData = [
    {
      day: t("common:15DaysBefore"),
      axisLabel: t("common:15dPrior"),
      iv: stock.historicalIV,
      callPrice: stock.callPremiumBuy,
      status: 'BUY',
    },
    {
      day: t("common:10DaysBefore"),
      axisLabel: t("common:10dPrior"),
      iv: stock.historicalIV + 8,
      callPrice: stock.callPremiumBuy + 0.5,
      status: 'HOLD',
    },
    {
      day: t("common:5DaysBefore"),
      axisLabel: t("common:5dPrior"),
      iv: stock.currentIV - 15,
      callPrice: stock.callPremiumBuy + 1.2,
      status: 'HOLD',
    },
    {
      day: t("common:2DaysBefore"),
      axisLabel: t("common:2dPrior"),
      iv: stock.currentIV - 5,
      callPrice: stock.callPremiumSell - 0.3,
      status: 'HOLD',
    },
    {
      day: t("common:1DayBefore"),
      axisLabel: t("common:1dPrior"),
      iv: stock.currentIV,
      callPrice: stock.callPremiumSell,
      status: 'SELL',
    },
    {
      day: t("common:afterEarnings"),
      axisLabel: t("common:afterEr"),
      iv: stock.currentIV - stock.expectedIVCrush,
      callPrice:
        stock.callPremiumSell -
        (stock.callPremiumSell * stock.expectedIVCrush) / 100,
      status: 'CRUSH',
    },
  ];
  const timelineChartConfig = {
    iv: {
      label: 'IV',
      color: chartPalette.warning,
    },
    callPrice: {
      label: t("common:callPrice"),
      color: chartPalette.bull,
    },
  } satisfies ChartConfig;

  return (
    <div className="p-6 space-y-4">
      {/* Stock Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {strategies.map(s => {
          const c = strategyConfig[s.strategyRating];
          const isSelected = s.ticker === stock.ticker;
          return (
            <button
              key={s.ticker}
              onClick={() => onSelectTicker(s.ticker)}
              className="min-h-11 px-4 py-2 text-[clamp(0.875rem,2.8vw,0.95rem)] font-bold data-mono border transition-all duration-150 md:min-h-8 md:px-3 md:py-1.5 md:text-xs"
              style={{
                borderRadius: 0,
                background: isSelected ? `${c.color}20` : 'transparent',
                borderColor: isSelected ? c.color : 'oklch(0.25 0.03 225)',
                color: isSelected ? c.color : 'oklch(0.55 0.015 225)',
              }}
            >
              {s.ticker}
            </button>
          );
        })}
      </div>

      {/* Stock Header */}
      <div className="data-card p-6" style={{ borderLeftColor: cfg.color, borderLeftWidth: '4px' }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="heading-condensed text-3xl" style={{ color: 'oklch(0.92 0.01 220)' }}>{stock.ticker}</h1>
              <span className={`text-sm font-bold px-3 py-1 border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`} style={{ borderRadius: 0 }}>
                {cfg.label}
              </span>
              <span 
                className="data-mono text-sm font-bold px-3 py-1 border" 
                style={{ 
                  borderRadius: 0, 
                  background: stock.directionalBias === 'CALL' ? 'oklch(0.78 0.18 160 / 0.15)' : stock.directionalBias === 'PUT' ? 'oklch(0.65 0.22 25 / 0.15)' : 'oklch(0.75 0.15 75 / 0.15)',
                  color: stock.directionalBias === 'CALL' ? 'oklch(0.78 0.18 160)' : stock.directionalBias === 'PUT' ? 'oklch(0.65 0.22 25)' : 'oklch(0.75 0.15 75)',
                  borderColor: stock.directionalBias === 'CALL' ? 'oklch(0.78 0.18 160 / 0.4)' : stock.directionalBias === 'PUT' ? 'oklch(0.65 0.22 25 / 0.4)' : 'oklch(0.75 0.15 75 / 0.4)',
                }}
              >
                {t("common:direction")}: {stock.directionalBias} %{stock.biasStrength}
              </span>
            </div>
            <div className="text-base" style={{ color: 'oklch(0.65 0.015 225)' }}>{stock.name}</div>
            <div className="text-sm mt-1" style={{ color: 'oklch(0.5 0.015 225)' }}>
              {'Earnings'}: {stock.earningsDate} · {t("common:sectorc5c4")}: {stock.sector}
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="text-center">
              <div className="data-mono text-2xl font-bold" style={{ color: cfg.color }}>{stock.ivCrushScore}</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{t("common:ivCrushScore")}</div>
            </div>
            <div className="text-center">
              <div className="data-mono text-2xl font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>+{stock.callGainFromIV}%</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{t("common:callProfit")}</div>
            </div>
            <div className="text-center">
              <div className="data-mono text-2xl font-bold" style={{ color: 'oklch(0.75 0.15 75)' }}>{stock.targetProfit}%</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{t("common:targetProfit")}</div>
            </div>
            <div className="text-center">
              <div className={`data-mono text-2xl font-bold ${rCfg.textClass}`}>{rCfg.label}</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{'Risk'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Yönsel Analiz & Momentum Section */}
      <div className="data-card p-4" style={{ borderLeftColor: stock.directionalBias === 'CALL' ? 'oklch(0.78 0.18 160)' : stock.directionalBias === 'PUT' ? 'oklch(0.65 0.22 25)' : 'oklch(0.75 0.15 75)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="heading-condensed text-sm" style={{ color: 'oklch(0.92 0.01 220)' }}>{t("common:directionalAnalysisMomentumRationale")}</div>
          <div className="flex-1 h-[1px]" style={{ background: 'oklch(0.22 0.03 225)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div>
              <div className="text-[10px] uppercase font-bold mb-1" style={{ color: 'oklch(0.45 0.015 225)' }}>{t("common:weightedDirection")}</div>
              <div className="flex items-center gap-2">
                <span className="data-mono text-xl font-bold" style={{ color: stock.directionalBias === 'CALL' ? 'oklch(0.78 0.18 160)' : stock.directionalBias === 'PUT' ? 'oklch(0.65 0.22 25)' : 'oklch(0.75 0.15 75)' }}>
                  {stock.directionalBias}
                </span>
                <div className="flex-1 h-2 bg-slate-800">
                  <div 
                    className="h-full" 
                    style={{ 
                      width: `${stock.biasStrength}%`, 
                      background: stock.directionalBias === 'CALL' ? 'oklch(0.78 0.18 160)' : stock.directionalBias === 'PUT' ? 'oklch(0.65 0.22 25)' : 'oklch(0.75 0.15 75)' 
                    }} 
                  />
                </div>
                <span className="data-mono text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>%{stock.biasStrength}</span>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="text-[10px] uppercase font-bold mb-1" style={{ color: 'oklch(0.45 0.015 225)' }}>{t("common:analysisSummary")}</div>
            <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.85 0.01 220)' }}>
              {t("common:basedOnMomentumScore100", { biasreason: stock.biasReason, momentumscore: stock.momentumScore, rsi14: stock.rsi14, directionalbias: stock.directionalBias, biasstrength: stock.biasStrength })}
            </p>
          </div>
        </div>
      </div>

      {/* Strategy Timeline */}
      <div className="data-card p-4">
        <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(0.45 0.015 225)' }}>
          {t("common:strategyTimelineIvExpansionOpportunity")}
        </div>
        <div style={{ height: '250px' }}>
          <ChartContainer
            aria-label={getChartAriaLabel(
              t("common:ivAndCallPriceTimeline"),
              t("common:theLinesShowImpliedVolatility")
            )}
            className="h-full aspect-auto"
            config={timelineChartConfig}
          >
            <LineChart data={timelineData} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid {...chartGrid} />
              <XAxis
                dataKey="axisLabel"
                tick={chartAxisTick}
                tickMargin={12}
              />
              <YAxis
                yAxisId="left"
                tick={chartAxisTick}
                tickMargin={8}
                label={chartAxisLabel('IV', { angle: -90, position: 'insideLeft' })}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={chartAxisTick}
                tickMargin={8}
                label={chartAxisLabel(t("common:callPricea605"), { angle: 90, position: 'insideRight' })}
              />
              <ChartTooltip
                cursor={chartCursorLine}
                content={
                  <ChartTooltipContent
                    labelKey="day"
                    renderContent={({ datum, label }) => (
                      <>
                        <div className="data-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                          {label}
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">IV</span>
                          <span className="data-mono font-semibold text-foreground">
                            {formatChartNumber(datum?.iv, 1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">
                            {t("common:callPrice")}
                          </span>
                          <span className="data-mono font-semibold text-foreground">
                            {formatChartCurrency(datum?.callPrice)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">
                            {t("common:status")}
                          </span>
                          <span className="data-mono font-semibold" style={{ color: cfg.color }}>
                            {typeof datum?.status === 'string' ? datum.status : '-'}
                          </span>
                        </div>
                      </>
                    )}
                  />
                }
              />
              <Line yAxisId="left" type="monotone" dataKey="iv" stroke={chartPalette.warning} strokeWidth={2} dot={chartLineDot(chartPalette.warning)} activeDot={chartLineDot(chartPalette.warning)} />
              <Line yAxisId="right" type="monotone" dataKey="callPrice" stroke={chartPalette.bull} strokeWidth={2} dot={chartLineDot(chartPalette.bull)} activeDot={chartLineDot(chartPalette.bull)} />
            </LineChart>
          </ChartContainer>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Call Strategy */}
        <div className="data-card p-4">
          <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(0.45 0.015 225)' }}>
            {t("common:callOptionStrategy")}
          </div>
          <div className="space-y-2">
            {[
              { label: t("common:buy15DaysBefore"), value: `$${stock.callPremiumBuy.toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
              { label: t("common:sell12DaysBefore"), value: `$${stock.callPremiumSell.toFixed(2)}`, color: 'oklch(0.75 0.15 75)' },
              { label: t("common:grossProfit"), value: `$${(stock.callPremiumSell - stock.callPremiumBuy).toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
              { label: t("common:profitPercentage"), value: `+${stock.callGainFromIV}%`, color: 'oklch(0.78 0.18 160)' },
              { label: t("common:ivExpansionContribution"), value: t("common:avoidIvCrush", { expectedivcrush: stock.expectedIVCrush }), color: 'oklch(0.75 0.15 75)' },
            ].map(m => (
              <div key={m.label} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid oklch(0.18 0.025 225)' }}>
                <span className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{m.label}</span>
                <span className="data-mono text-xs font-semibold" style={{ color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Put Strategy */}
        <div className="data-card p-4">
          <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(0.45 0.015 225)' }}>
            {t("common:putOptionStrategy")}
          </div>
          <div className="space-y-2">
            {[
              { label: t("common:buy15DaysBefore"), value: `$${stock.putPremiumBuy.toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
              { label: t("common:sell12DaysBefore"), value: `$${stock.putPremiumSell.toFixed(2)}`, color: 'oklch(0.75 0.15 75)' },
              { label: t("common:grossProfit"), value: `$${(stock.putPremiumSell - stock.putPremiumBuy).toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
              { label: t("common:profitPercentage"), value: `+${stock.putGainFromIV}%`, color: 'oklch(0.78 0.18 160)' },
              { label: 'Directional Hedging', value: t("common:providesDownsideProtection"), color: 'oklch(0.75 0.15 75)' },
            ].map(m => (
              <div key={m.label} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid oklch(0.18 0.025 225)' }}>
                <span className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{m.label}</span>
                <span className="data-mono text-xs font-semibold" style={{ color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk vs Reward */}
      <div className="data-card p-4">
        <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(0.45 0.015 225)' }}>
          {t("common:riskVsReward")}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: t("common:targetProfit"), value: `+${stock.targetProfit}%`, color: 'oklch(0.78 0.18 160)' },
            { label: t("common:maxLoss"), value: `-${stock.maxLoss}%`, color: 'oklch(0.65 0.22 25)' },
            { label: t("common:rewardRiskRatio"), value: `${(stock.targetProfit / stock.maxLoss).toFixed(1)}:1`, color: 'oklch(0.75 0.15 75)' },
          ].map(m => (
            <div key={m.label} className="text-center p-3" style={{ background: 'oklch(0.13 0.025 230)', borderRadius: 0 }}>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{m.label}</div>
              <div className="data-mono text-lg font-bold mt-1" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Strategy */}
      <div className="data-card p-4" style={{ borderLeftColor: cfg.color }}>
        <div className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'oklch(0.45 0.015 225)' }}>
          {t("common:recommendedStrategy")}
        </div>
        <div className="text-sm font-semibold mb-2" style={{ color: cfg.color }}>{stock.recommendedStrategy}</div>
        <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.65 0.015 225)' }}>
          {stock.ticker === 'MRVL' && t("common:highMomentumHighIvCrush")}
          {stock.ticker === 'CRWD' && t("common:strongMomentumMediumHighIv")}
          {stock.ticker === 'AVGO' && t("common:safePlayLowIvCrush")}
          {stock.ticker === 'COST' && t("common:veryStableStockIronCondor")}
          {stock.ticker === 'DELL' && t("common:mediumMomentumMediumIvCrush")}
          {stock.ticker === 'PANW' && t("common:overboughtRsi87CoveredCall")}
          {stock.ticker === 'ADSK' && t("common:neutralMomentumIronCondorPreferred")}
          {stock.ticker === 'CRM' && t("common:brokenMomentumAvoidOrVery")}
          {stock.ticker === 'SNOW' && t("common:highIvCrushButVery")}
          {stock.ticker === 'ZS' && t("common:highIvCrushButVeryd2f9")}
        </p>
      </div>

      {/* Risk Factors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="data-card p-3" style={{ borderLeftColor: 'oklch(0.65 0.22 25)' }}>
          <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.22 25)' }}>{t("common:earningsMissRisk98c9")}</div>
          <div className="data-mono text-2xl font-bold mb-1" style={{ color: 'oklch(0.65 0.22 25)' }}>{stock.earningsMissRisk}%</div>
          <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>{t("common:riskOfSharpPriceDrop")}</div>
        </div>
        <div className="data-card p-3" style={{ borderLeftColor: 'oklch(0.75 0.15 75)' }}>
          <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.75 0.15 75)' }}>{t("common:gapRisk")}</div>
          <div className="data-mono text-2xl font-bold mb-1" style={{ color: 'oklch(0.75 0.15 75)' }}>{stock.gapRisk}%</div>
          <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>{t("common:riskOfGapOpeningAfter")}</div>
        </div>
        <div className="data-card p-3" style={{ borderLeftColor: 'oklch(0.78 0.18 160)' }}>
          <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.78 0.18 160)' }}>{t("common:historicalBeatRate")}</div>
          <div className="data-mono text-2xl font-bold mb-1" style={{ color: 'oklch(0.78 0.18 160)' }}>%{stock.beatRate}</div>
          <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>{t("common:beatRateOverTheLast")}</div>
        </div>
      </div>
    </div>
  );
}


