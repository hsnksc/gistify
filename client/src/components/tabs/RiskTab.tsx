/*
 * DESIGN: "Precision Finance" — Risk Matrix Tab
 * 2D risk matrix, risk breakdown, portfolio strategy
 */

import { stocksData, signalConfig, riskConfig, type StockData } from '@/lib/stockData';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import {
  chartAxisLabel, chartAxisTick, chartCursorLine, chartGrid, chartPalette, formatChartNumber, formatChartPercent, getChartAriaLabel, getSignalChartColor, } from '@/lib/chartTheme';

import type { AppLanguage } from '@/lib/i18n';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Cell, } from 'recharts';import { t } from "@/lib/i18n";


interface Props {
  onStockClick: (ticker: string) => void;
  stocks?: StockData[];
  language: AppLanguage;
}

const riskOrder = { LOW: 1, MEDIUM: 2, HIGH: 3, VERY_HIGH: 4 };

export default function RiskTab({ onStockClick, stocks = stocksData, language }: Props) {
  const matrixData = stocks.map(s => ({
    ticker: s.ticker,
    x: s.earningsBeatProbability,
    y: s.momentumScore,
    risk: riskOrder[s.riskLevel],
    riskLabel: riskConfig[s.riskLevel].label,
    signal: s.signal,
    language,
  }));
  const matrixChartConfig = {
    y: {
      label: 'Momentum',
      color: chartPalette.accent,
    },
    x: {
      label: t("common:15dPrior"),
      color: chartPalette.warning,
    },
  } satisfies ChartConfig;

  // Portfolio strategy groups
  const strongBuy = stocks.filter(s => s.signal === 'STRONG_BUY');
  const buy = stocks.filter(s => s.signal === 'BUY');
  const neutral = stocks.filter(s => s.signal === 'NEUTRAL');
  const sell = stocks.filter(s => s.signal === 'SELL' || s.signal === 'STRONG_SELL');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5" style={{ background: 'oklch(0.65 0.22 25)' }} />
          <h1 className="heading-condensed text-xl" style={{ color: 'oklch(0.92 0.01 220)' }}>
            {t("earnings:theEarningsWorkspaceReturnedEmpty")}
          </h1>
        </div>
        <p className="text-sm ml-3" style={{ color: 'oklch(0.5 0.015 225)' }}>
          {t("common:beatProbabilityMomentumScoreColor")}
        </p>
      </div>

      {/* Risk Matrix Scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4" style={{ background: 'oklch(0.65 0.22 25)' }} />
            <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
              {t("common:beatProbabilityVsMomentum")}
            </h2>
          </div>
          <div className="data-card p-4 relative" style={{ height: '360px' }}>
            {/* Quadrant labels */}
            <div className="absolute top-8 right-8 text-xs font-semibold" style={{ color: 'oklch(0.78 0.18 160 / 0.5)' }}>
              {t("common:idealZone")}
            </div>
            <div className="absolute bottom-12 left-8 text-xs font-semibold" style={{ color: 'oklch(0.65 0.22 25 / 0.5)' }}>
              {t("common:riskyZone")}
            </div>
            <ChartContainer
              aria-label={getChartAriaLabel(
                t("common:riskMatrixScatterChart"),
                t("flow:reportDetail")
              )}
              className="h-full aspect-auto"
              config={matrixChartConfig}
            >
              <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
                <CartesianGrid {...chartGrid} />
                <XAxis
                  dataKey="x"
                  name={t("common:beatProbability")}
                  unit="%"
                  domain={[30, 85]}
                  tick={chartAxisTick}
                  label={chartAxisLabel(t("common:beatProbabilityb6a2"), { position: 'insideBottom', offset: -15 })}
                />
                <YAxis
                  dataKey="y"
                  name={'Momentum'}
                  domain={[20, 100]}
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
                            <span className="text-muted-foreground">
                              {t("common:beatProbability")}
                            </span>
                            <span className="data-mono font-semibold text-foreground">
                              {formatChartPercent(datum?.x)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">
                              {'Momentum'}
                            </span>
                            <span className="data-mono font-semibold text-foreground">
                              {formatChartNumber(datum?.y)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">
                              {'Risk'}
                            </span>
                            <span className="data-mono font-semibold text-foreground">
                              {typeof datum?.riskLabel === 'string' ? datum.riskLabel : '-'}
                            </span>
                          </div>
                        </>
                      )}
                    />
                  }
                />
                <Scatter data={matrixData} name={t("common:stocksa823")}>
                  {matrixData.map((entry, i) => (
                    <Cell key={i} fill={getSignalChartColor(entry.signal)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ChartContainer>
          </div>
        </div>

        {/* Risk Summary */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4" style={{ background: 'oklch(0.75 0.15 75)' }} />
            <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
              {t("common:riskDistribution")}
            </h2>
          </div>
          <div className="space-y-2">
            {[...stocks].sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]).map(stock => {
              const cfg = signalConfig[stock.signal];
              const rCfg = riskConfig[stock.riskLevel];
              return (
                <button
                  key={stock.ticker}
                  onClick={() => onStockClick(stock.ticker)}
                  className="w-full data-card p-3 text-left"
                  style={{ borderLeftColor: cfg.color }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="data-mono text-sm font-bold" style={{ color: 'oklch(0.92 0.01 220)' }}>{stock.ticker}</span>
                      <span className="text-xs" style={{ color: 'oklch(0.5 0.015 225)' }}>{stock.sector}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`data-mono text-xs font-bold ${rCfg.textClass}`}>{rCfg.label} {'Risk'}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`} style={{ borderRadius: 0 }}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs" style={{ color: 'oklch(0.4 0.015 225)' }}>{'Momentum'}</span>
                        <span className="data-mono text-xs" style={{ color: cfg.color }}>{stock.momentumScore}</span>
                      </div>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ width: `${stock.momentumScore}%`, background: cfg.color }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs" style={{ color: 'oklch(0.4 0.015 225)' }}>{t("scanner:rsiRange")}</div>
                      <div className="data-mono text-xs font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>%{stock.earningsBeatProbability}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs" style={{ color: 'oklch(0.4 0.015 225)' }}>{'Implied'}</div>
                      <div className="data-mono text-xs font-bold" style={{ color: 'oklch(0.75 0.15 75)' }}>±{stock.impliedMove}%</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Portfolio Strategy */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.78 0.18 160)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            {t("common:portfolioStrategyRecommendation")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              title: t("scanner:shortLossStreaksDaysStrategy"),
              stocks: strongBuy,
              color: 'oklch(0.78 0.18 160)',
              desc: t("common:positionCanBeOpenedBefore"),
              action: t("common:openPosition"),
            },
            {
              title: t("scanner:highVolatilityDirectionIndependent"),
              stocks: buy,
              color: '#4ade80',
              desc: t("common:cautiousPositionBeforeEarningsGood"),
              action: t("common:smallPosition"),
            },
            {
              title: t("common:neutral43cc"),
              stocks: neutral,
              color: 'oklch(0.75 0.15 75)',
              desc: t("common:waitUntilAfterEarningsMixed"),
              action: t("flow:oldest"),
            },
            {
              title: t("common:sellStrongSell"),
              stocks: sell,
              color: 'oklch(0.65 0.22 25)',
              desc: t("common:brokenMomentumWeakSectoralSupport"),
              action: t("common:avoid"),
            },
          ].map(group => (
            <div key={group.title} className="data-card p-4" style={{ borderLeftColor: group.color }}>
              <div className="heading-condensed text-sm mb-1" style={{ color: group.color }}>{group.title}</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {group.stocks.map(s => (
                  <button
                    key={s.ticker}
                    onClick={() => onStockClick(s.ticker)}
                    className="data-mono text-xs font-bold px-1.5 py-0.5"
                    style={{ background: `${group.color}20`, color: group.color, border: `1px solid ${group.color}40`, borderRadius: 0 }}
                  >
                    {s.ticker}
                  </button>
                ))}
              </div>
              <p className="text-xs mb-2" style={{ color: 'oklch(0.55 0.015 225)', lineHeight: 1.5 }}>{group.desc}</p>
              <div className="text-xs font-bold" style={{ color: group.color }}>→ {group.action}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Risk Factors */}
      <div className="data-card p-6" style={{ borderLeftColor: 'oklch(0.65 0.22 25)', borderLeftWidth: '4px' }}>
        <div className="heading-condensed text-base mb-3" style={{ color: 'oklch(0.65 0.22 25)' }}>
          {t("common:generalRiskFactors")}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {[
            {
              title: t("common:rsiOverbought"),
              desc: t("common:panwRsi78AndCrwd"),
              color: 'oklch(0.75 0.15 75)',
            },
            {
              title: t("common:volumePriceDivergence"),
              desc: t("common:crmIsShowingDeclineOn"),
              color: 'oklch(0.65 0.22 25)',
            },
            {
              title: t("common:brokenMomentum"),
              desc: t("common:snow35Crm33Zs"),
              color: 'oklch(0.65 0.22 25)',
            },
          ].map(risk => (
            <div key={risk.title}>
              <div className="text-xs font-bold mb-1" style={{ color: risk.color }}>{risk.title}</div>
              <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.6 0.015 225)' }}>{risk.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


