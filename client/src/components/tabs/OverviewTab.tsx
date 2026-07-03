/*
 * DESIGN: "Precision Finance" — Overview Tab
 * Hero banner + summary stats + top picks grid + macro context
 */

import { stocksData, sectorMacroData, signalConfig, type StockData } from '@/lib/stockData';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import {
  chartAxisStrongTick, chartAxisTick, chartCursorZone, chartGrid, chartPalette, formatChartNumber, formatChartPercent, getChartAriaLabel, getMomentumBandColor, } from '@/lib/chartTheme';

import type { AppLanguage } from '@/lib/i18n';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, } from 'recharts';import { t } from "@/lib/i18n";


const HERO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663682523726/f6iQZ4ZvSyNWxyJ4Djp26f/hero_banner-iCqwWxUrnD74QRvdzpTN5G.webp';

interface Props {
  onStockClick: (ticker: string) => void;
  stocks?: StockData[];
  reportWindow?: string;
  analysisDateLabel?: string;
  headline?: string;
  summary?: string;
  language: AppLanguage;
}

export default function OverviewTab({
  language,
  onStockClick,
  stocks = stocksData,
  reportWindow = t("common:weeklyView"),
  analysisDateLabel = t("common:live"),
  headline,
  summary,
}: Props) {
  const topPicks = stocks.filter(s => s.signal === 'STRONG_BUY' || s.signal === 'BUY').slice(0, 5);
  const momentumChartData = [...stocks]
    .sort((a, b) => b.momentumScore - a.momentumScore)
    .map(s => ({
      ticker: s.ticker,
      score: s.momentumScore,
      beat: s.earningsBeatProbability,
    }));
  const strongBuyCount = stocks.filter(stock => stock.signal === 'STRONG_BUY').length;
  const neutralCount = stocks.filter(stock => stock.signal === 'NEUTRAL').length;
  const watchCount = Math.max(0, stocks.length - strongBuyCount - neutralCount);
  const avgBeat = stocks.length
    ? Math.round(
        stocks.reduce((sum, stock) => sum + stock.earningsBeatProbability, 0) /
          stocks.length
      )
    : 0;
  const avgMomentum = stocks.length
    ? Math.round(
        stocks.reduce((sum, stock) => sum + stock.momentumScore, 0) /
          stocks.length
      )
    : 0;
  const leadSector =
    [...stocks].sort((left, right) => right.momentumScore - left.momentumScore)[0]?.sector ||
    'Technology';
  const momentumChartConfig = {
    score: {
      label: t("common:momentumScore"),
      color: chartPalette.accent,
    },
    beat: {
      label: t("common:beatProbability"),
      color: chartPalette.warning,
    },
  } satisfies ChartConfig;

  return (
    <div className="p-0">
      {/* Hero Banner */}
      <div
        className="relative overflow-hidden"
        style={{
          height: '260px',
          backgroundImage: `url(${HERO_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, oklch(0.09 0.025 230 / 0.95) 0%, oklch(0.09 0.025 230 / 0.7) 50%, oklch(0.09 0.025 230 / 0.3) 100%)' }} />
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full pulse-live" style={{ background: 'oklch(0.78 0.18 160)' }} />
            <span className="data-mono text-xs tracking-widest" style={{ color: 'oklch(0.78 0.18 160)' }}>
              {analysisDateLabel.toUpperCase()} · {reportWindow.toUpperCase()}
            </span>
          </div>
          <h1 className="heading-condensed mb-2" style={{ fontSize: '2.8rem', lineHeight: 1.1, color: 'oklch(0.95 0.01 220)' }}>
            {'EARNING STRATEGY'}<br />
            <span style={{ color: 'oklch(0.78 0.18 160)' }}>{t("earnings:pipelineStatus")}</span>
          </h1>
          <p className="text-sm max-w-xl" style={{ color: 'oklch(0.65 0.015 225)', lineHeight: 1.6 }}>
            {headline || t("common:theBestMomentumBeatAnd")}
          </p>
          <p className="mt-2 text-sm max-w-2xl" style={{ color: 'oklch(0.56 0.015 225)', lineHeight: 1.6 }}>
            {summary || t("common:eachStockIsReadWith")}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="badge-strong">{strongBuyCount} {t("common:strongBuy4b0a")}</span>
              <span className="badge-warning">{neutralCount} {t("common:neutral43cc")}</span>
              <span className="badge-danger">{watchCount} {t("common:watch")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: t("common:analyzedStocks"), value: String(stocks.length), sub: reportWindow, color: 'oklch(0.78 0.18 160)' },
            { label: t("common:featuredSetup"), value: String(topPicks.length), sub: topPicks.map(stock => stock.ticker).join(' · ') || t("common:watchlist"), color: 'oklch(0.78 0.18 160)' },
            { label: t("common:avgBeatProbability"), value: `%${avgBeat}`, sub: t("common:selectedWeekAverage"), color: 'oklch(0.75 0.15 75)' },
            { label: t("earnings:sourceModified"), value: String(avgMomentum), sub: leadSector, color: 'oklch(0.75 0.15 75)' },
          ].map((kpi, i) => (
            <div key={i} className="data-card p-4">
              <div className="text-xs mb-1 tracking-wide uppercase font-semibold" style={{ color: 'oklch(0.45 0.015 225)' }}>
                {kpi.label}
              </div>
              <div className="data-mono text-2xl font-bold mb-1" style={{ color: kpi.color }}>
                {kpi.value}
              </div>
              <div className="text-xs" style={{ color: 'oklch(0.5 0.015 225)' }}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Top Picks + Momentum Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Picks */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4" style={{ background: 'oklch(0.78 0.18 160)' }} />
              <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
                {t("common:topProbabilityStocks")}
              </h2>
            </div>
            <div className="space-y-2">
              {topPicks.map((stock, i) => {
                const cfg = signalConfig[stock.signal];
                return (
                  <button
                    key={stock.ticker}
                    onClick={() => onStockClick(stock.ticker)}
                    className="w-full data-card p-3 text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="data-mono text-xs font-bold" style={{ color: 'oklch(0.4 0.02 225)' }}>#{i + 1}</span>
                        <span className="data-mono text-base font-bold" style={{ color: 'oklch(0.92 0.01 220)' }}>{stock.ticker}</span>
                        <span className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>{stock.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`} style={{ borderRadius: 0 }}>
                          {cfg.label}
                        </span>
                        <span className="data-mono text-sm font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>
                          {stock.momentumScore}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <div>
                        <span className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{'Earnings:'}</span>
                        <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.75 0.15 75)' }}>{stock.earningsDate}</span>
                      </div>
                      <div>
                        <span className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{t("common:beatProb74cc")}</span>
                        <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.78 0.18 160)' }}>%{stock.earningsBeatProbability}</span>
                      </div>
                      <div>
                        <span className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{t("common:6meba0")}</span>
                        <span className="data-mono text-xs font-semibold" style={{ color: stock.priceChange6M > 0 ? 'oklch(0.78 0.18 160)' : 'oklch(0.65 0.22 25)' }}>
                          {stock.priceChange6M > 0 ? '+' : ''}{stock.priceChange6M}%
                        </span>
                      </div>
                    </div>
                    {/* Score bar */}
                    <div className="score-bar">
                      <div
                        className="score-bar-fill"
                        style={{
                          width: `${stock.momentumScore}%`,
                          background: stock.momentumScore >= 80 ? 'oklch(0.78 0.18 160)' :
                                      stock.momentumScore >= 60 ? 'oklch(0.75 0.15 75)' :
                                      'oklch(0.65 0.22 25)',
                        }}
                      />
                    </div>
                    <div className="mt-1.5 text-xs line-clamp-1" style={{ color: 'oklch(0.5 0.015 225)' }}>
                      {stock.thesis.substring(0, 100)}...
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Momentum Bar Chart */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4" style={{ background: 'oklch(0.75 0.15 75)' }} />
              <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
                {t("common:momentumScoreRanking")}
              </h2>
            </div>
            <div className="data-card p-4" style={{ height: '340px' }}>
              <ChartContainer
                aria-label={getChartAriaLabel(
                  t("common:momentumScoreRankingf793"),
                  t("common:eachBarShowsAStock")
                )}
                className="h-full aspect-auto"
                config={momentumChartConfig}
              >
                <BarChart data={momentumChartData} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
                  <CartesianGrid {...chartGrid} horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={chartAxisTick} />
                  <YAxis type="category" dataKey="ticker" tick={chartAxisStrongTick} width={40} />
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
                              <span className="text-muted-foreground">
                                {'Momentum'}
                              </span>
                              <span className="data-mono font-semibold text-foreground">
                                {formatChartNumber(datum?.score)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-muted-foreground">
                                {t("common:beatProb3e17")}
                              </span>
                              <span className="data-mono font-semibold text-foreground">
                                {formatChartPercent(datum?.beat)}
                              </span>
                            </div>
                          </>
                        )}
                      />
                    }
                  />
                  <Bar dataKey="score" name={'Momentum'} radius={[0, 0, 0, 0]} maxBarSize={18}>
                    {momentumChartData.map((entry) => (
                      <Cell
                        key={entry.ticker}
                        fill={getMomentumBandColor(entry.score)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </div>

        {/* Macro Context */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4" style={{ background: 'oklch(0.6 0.12 250)' }} />
            <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
              {t("common:macroContextSectoralGrowth2026")}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.values(sectorMacroData).map((sector) => (
              <div key={sector.name} className="data-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold" style={{ color: 'oklch(0.55 0.015 225)' }}>{sector.name}</span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 ${
                    sector.outlook === 'BULLISH' ? 'badge-strong' :
                    sector.outlook === 'NEUTRAL' ? 'badge-warning' : 'badge-danger'
                  }`}>
                    {sector.outlook === 'BULLISH' ? '↑' : sector.outlook === 'NEUTRAL' ? '→' : '↓'}
                  </span>
                </div>
                <div className="data-mono text-xl font-bold mb-1" style={{ color: 'oklch(0.78 0.18 160)' }}>
                  {sector.marketSize2026}
                </div>
                <div className="data-mono text-xs font-semibold mb-2" style={{ color: 'oklch(0.75 0.15 75)' }}>
                  {sector.growthRate}
                </div>
                <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{sector.keyDriver}</div>
                <div className="text-xs mt-1" style={{ color: 'oklch(0.38 0.015 225)', fontStyle: 'italic' }}>
                  {sector.source}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 border" style={{ borderColor: 'oklch(0.22 0.03 225)', background: 'oklch(0.13 0.025 230)' }}>
          <p className="text-xs" style={{ color: 'oklch(0.4 0.015 225)', lineHeight: 1.7 }}>
            <span className="font-semibold" style={{ color: 'oklch(0.65 0.22 25)' }}>{t("common:legalDisclaimer")}</span>{' '}
            {t("common:thisReportIsForInformational")}
          </p>
        </div>
      </div>
    </div>
  );
}

