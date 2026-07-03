/*
 * DESIGN: "Precision Finance" — Sector Tab
 * Macro sector analysis, IT spending breakdown, growth drivers
 */

import { sectorMacroData, stocksData, type StockData } from '@/lib/stockData';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import {
  chartAxisStrongTick, chartAxisTick, chartCursorZone, chartGrid, chartPalette, formatChartNumber, formatChartPercent, getChartAriaLabel, } from '@/lib/chartTheme';

import type { AppLanguage } from '@/lib/i18n';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, } from 'recharts';import { t } from "@/lib/i18n";


interface Props {
  stocks?: StockData[];
  language: AppLanguage;
}

export default function SectorTab({ stocks = stocksData, language }: Props) {
  const itSpendingData = [
    {
      name: t("common:dataCenter"),
      axisLabel: t("common:dataCtr"),
      value: 653,
      growth: 31.7,
      color: 'oklch(0.78 0.18 160)',
    },
    {
      name: t("common:software"),
      axisLabel: t("common:software1f91"),
      value: 1434,
      growth: 14.7,
      color: '#4ade80',
    },
    {
      name: t("common:itServices"),
      axisLabel: t("common:itSvcs"),
      value: 1867,
      growth: 8.7,
      color: 'oklch(0.75 0.15 75)',
    },
    {
      name: t("common:devices"),
      axisLabel: t("common:devices99e3"),
      value: 836,
      growth: 6.1,
      color: 'oklch(0.6 0.12 250)',
    },
    {
      name: t("common:communications"),
      axisLabel: t("common:comms"),
      value: 1365,
      growth: 4.7,
      color: 'oklch(0.7 0.15 300)',
    },
  ];

  const sectorStockMap = [
    {
      sector: t("common:aiSemiconductor"),
      axisLabel: t("common:aiSemi"),
      tickers: ['MRVL', 'AVGO', 'DELL'],
      color: 'oklch(0.78 0.18 160)',
    },
    {
      sector: t("common:cybersecurity"),
      axisLabel: t("common:cybersec"),
      tickers: ['CRWD', 'PANW', 'ZS'],
      color: '#4ade80',
    },
    {
      sector: t("common:cloudSoftware"),
      axisLabel: t("common:cloudSw"),
      tickers: ['SNOW', 'CRM', 'ADSK'],
      color: 'oklch(0.75 0.15 75)',
    },
    {
      sector: t("common:defensive"),
      axisLabel: t("common:defensive"),
      tickers: ['COST'],
      color: 'oklch(0.6 0.12 250)',
    },
  ];

  const avgMomentumBySector = sectorStockMap.map(s => {
    const sectorStocks = stocks.filter(st => s.tickers.includes(st.ticker));
    const avg = sectorStocks.length
      ? sectorStocks.reduce((sum, st) => sum + st.momentumScore, 0) / sectorStocks.length
      : 0;
    return {
      sector: s.sector,
      axisLabel: s.axisLabel,
      momentum: Math.round(avg),
      color: s.color,
    };
  });
  const spendingChartConfig = {
    value: {
      label: t("common:spendingM"),
      color: chartPalette.accent,
    },
    growth: {
      label: t("common:growth"),
      color: chartPalette.warning,
    },
  } satisfies ChartConfig;
  const momentumChartConfig = {
    momentum: {
      label: t("common:avgMomentum"),
      color: chartPalette.info,
    },
  } satisfies ChartConfig;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5" style={{ background: 'oklch(0.6 0.12 250)' }} />
          <h1 className="heading-condensed text-xl" style={{ color: 'oklch(0.92 0.01 220)' }}>
            {t("common:sectoralMacroAnalysis")}
          </h1>
        </div>
        <p className="text-sm ml-3" style={{ color: 'oklch(0.5 0.015 225)' }}>
          {t("common:gartnerDeloitte2026ForecastsGlobal")}
        </p>
      </div>

      {/* Gartner IT Spending */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.78 0.18 160)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            {t("common:globalItSpending2026Gartner")}
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="data-card p-4" style={{ height: '300px' }}>
            <div className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'oklch(0.45 0.015 225)' }}>
              {t("common:spendingSizeM")}
            </div>
            <ChartContainer
              aria-label={getChartAriaLabel(
                t("common:itSpendingSizeChart"),
                t("common:showsGlobalItSpendingSize")
              )}
              className="h-[90%] aspect-auto"
              config={spendingChartConfig}
            >
              <BarChart data={itSpendingData} margin={{ top: 5, right: 10, bottom: 20, left: 10 }}>
                <CartesianGrid {...chartGrid} />
                <XAxis
                  dataKey="axisLabel"
                  tick={chartAxisTick}
                  tickMargin={12}
                />
                <YAxis
                  tick={chartAxisTick}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={chartCursorZone}
                  content={
                    <ChartTooltipContent
                      labelKey="name"
                      renderContent={({ datum, label }) => (
                        <>
                          <div className="data-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                            {label}
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">
                              {t("common:spending")}
                            </span>
                            <span className="data-mono font-semibold text-foreground">
                              {formatChartNumber(datum?.value)}M
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">
                              {t("common:growth0261")}
                            </span>
                            <span className="data-mono font-semibold text-foreground">
                              {formatChartPercent(datum?.growth, 1)}
                            </span>
                          </div>
                        </>
                      )}
                    />
                  }
                />
                <Bar dataKey="value" name={t("common:spendingM")} maxBarSize={40}>
                  {itSpendingData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
          <div className="data-card p-4" style={{ height: '300px' }}>
            <div className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'oklch(0.45 0.015 225)' }}>
              {t("common:yoyGrowthRates")}
            </div>
            <ChartContainer
              aria-label={getChartAriaLabel(
                t("common:itSpendingGrowthChart"),
                t("common:showsYearOverYearGrowth")
              )}
              className="h-[90%] aspect-auto"
              config={spendingChartConfig}
            >
              <BarChart data={itSpendingData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 60 }}>
                <CartesianGrid {...chartGrid} horizontal={false} />
                <XAxis
                  type="number"
                  unit="%"
                  tick={chartAxisTick}
                  tickMargin={8}
                />
                <YAxis
                  type="category"
                  dataKey="axisLabel"
                  tick={chartAxisStrongTick}
                  width={84}
                />
                <ChartTooltip
                  cursor={chartCursorZone}
                  content={
                    <ChartTooltipContent
                      labelKey="name"
                      renderContent={({ datum, label }) => (
                        <>
                          <div className="data-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                            {label}
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">
                              {t("common:yoyGrowth")}
                            </span>
                            <span className="data-mono font-semibold text-foreground">
                              {formatChartPercent(datum?.growth, 1)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">
                              {t("common:spending")}
                            </span>
                            <span className="data-mono font-semibold text-foreground">
                              {formatChartNumber(datum?.value)}M
                            </span>
                          </div>
                        </>
                      )}
                    />
                  }
                />
                <Bar dataKey="growth" name={t("marketing:scanTheTapeFrameThe")} maxBarSize={18}>
                  {itSpendingData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      {/* Sector Cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.75 0.15 75)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            {t("common:sectorBasedOutlook")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(sectorMacroData).map((sector) => (
            <div key={sector.name} className="data-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="heading-condensed text-base" style={{ color: 'oklch(0.85 0.01 220)' }}>{sector.name}</h3>
                <span className={`text-xs font-bold px-2 py-0.5 border ${
                  sector.outlook === 'BULLISH' ? 'badge-strong' :
                  sector.outlook === 'NEUTRAL' ? 'badge-warning' : 'badge-danger'
                }`}>
                  {sector.outlook === 'BULLISH' ? t("common:bullish") : sector.outlook === 'NEUTRAL' ? t("common:neutralb713") : t("scanner:volatilityNotes")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{t("common:marketSize2026")}</div>
                  <div className="data-mono text-xl font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{sector.marketSize2026}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{t("common:growthRate")}</div>
                  <div className="data-mono text-xl font-bold" style={{ color: 'oklch(0.75 0.15 75)' }}>{sector.growthRate}</div>
                </div>
              </div>
              <div className="mb-2">
                <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{t("common:mainDriver")}</div>
                <div className="text-sm" style={{ color: 'oklch(0.7 0.01 220)' }}>{sector.keyDriver}</div>
              </div>
              <div className="text-xs italic" style={{ color: 'oklch(0.38 0.015 225)' }}>{t("common:sourcee196")} {sector.source}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Momentum Comparison */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.7 0.15 300)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            {t("common:sectorBasedAvgMomentumScore")}
          </h2>
        </div>
        <div className="data-card p-4" style={{ height: '220px' }}>
          <ChartContainer
            aria-label={getChartAriaLabel(
              t("common:averageMomentumBySectorChart"),
              t("common:barLengthShowsTheAverage")
            )}
            className="h-full aspect-auto"
            config={momentumChartConfig}
          >
            <BarChart data={avgMomentumBySector} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid {...chartGrid} />
              <XAxis
                dataKey="axisLabel"
                tick={chartAxisStrongTick}
                tickMargin={10}
              />
              <YAxis
                domain={[0, 100]}
                tick={chartAxisTick}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={chartCursorZone}
                content={
                  <ChartTooltipContent
                    labelKey="sector"
                    renderContent={({ datum, label }) => (
                      <>
                        <div className="data-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                          {label}
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">
                            {t("common:avgMomentum")}
                          </span>
                          <span className="data-mono font-semibold text-foreground">
                            {formatChartNumber(datum?.momentum)}
                          </span>
                        </div>
                      </>
                    )}
                  />
                }
              />
              <Bar dataKey="momentum" name={t("common:avgMomentum")} maxBarSize={60}>
                {avgMomentumBySector.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      {/* AI Semiconductor Deep Dive */}
      <div className="data-card p-6" style={{ borderLeftColor: 'oklch(0.78 0.18 160)', borderLeftWidth: '4px' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="heading-condensed text-base" style={{ color: 'oklch(0.78 0.18 160)' }}>
            {t("common:aiSemiconductorDeepContext")}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.45 0.015 225)' }}>{t("common:deloitte2026Forecast")}</div>
            <div className="data-mono text-lg font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>~$500B</div>
            <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>{t("common:aiChipRevenue50Of")}</div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.45 0.015 225)' }}>{t("common:serverSpendingGrowth")}</div>
            <div className="data-mono text-lg font-bold" style={{ color: 'oklch(0.75 0.15 75)' }}>+36.9%</div>
            <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>{t("common:aiWorkloadServersGartner2026")}</div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.45 0.015 225)' }}>{'Hyperscaler AI CAPEX'}</div>
            <div className="data-mono text-lg font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{t("common:accelerating")}</div>
            <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>{t("scanner:aboveVwap")}</div>
          </div>
        </div>
        <div className="mt-3 text-sm leading-relaxed" style={{ color: 'oklch(0.65 0.015 225)' }}>
          {t("common:globalInvestmentMomentumTowardsAi")}
        </div>
      </div>
    </div>
  );
}


