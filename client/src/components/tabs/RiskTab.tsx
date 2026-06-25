/*
 * DESIGN: "Precision Finance" — Risk Matrix Tab
 * 2D risk matrix, risk breakdown, portfolio strategy
 */

import { stocksData, signalConfig, riskConfig, type StockData } from '@/lib/stockData';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import {
  chartAxisLabel,
  chartAxisTick,
  chartCursorLine,
  chartGrid,
  chartPalette,
  formatChartNumber,
  formatChartPercent,
  getChartAriaLabel,
  getSignalChartColor,
} from '@/lib/chartTheme';
import { copy } from '@/lib/i18n';
import type { AppLanguage } from '@/lib/i18n';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Cell,
} from 'recharts';

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
      label: copy(language, 'Momentum', 'Momentum'),
      color: chartPalette.accent,
    },
    x: {
      label: copy(language, 'Beat İhtimali', 'Beat Probability'),
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
            {copy(language, 'RİSK MATRİSİ', 'RISK MATRIX')}
          </h1>
        </div>
        <p className="text-sm ml-3" style={{ color: 'oklch(0.5 0.015 225)' }}>
          {copy(language, 'Beat İhtimali × Momentum Skoru · Renk = Sinyal Gücü', 'Beat Probability × Momentum Score · Color = Signal Strength')}
        </p>
      </div>

      {/* Risk Matrix Scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4" style={{ background: 'oklch(0.65 0.22 25)' }} />
            <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
              {copy(language, 'BEAT İHTİMALİ vs MOMENTUM', 'BEAT PROBABILITY vs MOMENTUM')}
            </h2>
          </div>
          <div className="tactical-card p-4 relative" style={{ height: '360px' }}>
            {/* Quadrant labels */}
            <div className="absolute top-8 right-8 text-xs font-semibold" style={{ color: 'oklch(0.78 0.18 160 / 0.5)' }}>
              {copy(language, 'İDEAL BÖLGE ↗', 'IDEAL ZONE ↗')}
            </div>
            <div className="absolute bottom-12 left-8 text-xs font-semibold" style={{ color: 'oklch(0.65 0.22 25 / 0.5)' }}>
              {copy(language, 'RİSKLİ BÖLGE ↙', 'RISKY ZONE ↙')}
            </div>
            <ChartContainer
              aria-label={getChartAriaLabel(
                copy(language, 'Risk matrisi scatter grafiği', 'Risk matrix scatter chart'),
                copy(language, 'X ekseni beat ihtimalini, Y ekseni momentum skorunu ve nokta rengi sinyal gücünü gösterir.', 'The X axis shows beat probability, the Y axis shows momentum score, and point color shows signal strength.')
              )}
              className="h-full aspect-auto"
              config={matrixChartConfig}
            >
              <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
                <CartesianGrid {...chartGrid} />
                <XAxis
                  dataKey="x"
                  name={copy(language, 'Beat İhtimali', 'Beat Probability')}
                  unit="%"
                  domain={[30, 85]}
                  tick={chartAxisTick}
                  label={chartAxisLabel(copy(language, 'Beat İhtimali (%)', 'Beat Probability (%)'), { position: 'insideBottom', offset: -15 })}
                />
                <YAxis
                  dataKey="y"
                  name={copy(language, 'Momentum', 'Momentum')}
                  domain={[20, 100]}
                  tick={chartAxisTick}
                  label={chartAxisLabel(copy(language, 'Momentum', 'Momentum'), { angle: -90, position: 'insideLeft' })}
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
                              {copy(language, 'Beat İhtimali', 'Beat Probability')}
                            </span>
                            <span className="data-mono font-semibold text-foreground">
                              {formatChartPercent(datum?.x)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">
                              {copy(language, 'Momentum', 'Momentum')}
                            </span>
                            <span className="data-mono font-semibold text-foreground">
                              {formatChartNumber(datum?.y)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">
                              {copy(language, 'Risk', 'Risk')}
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
                <Scatter data={matrixData} name={copy(language, 'Hisseler', 'Stocks')}>
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
              {copy(language, 'RİSK DAĞILIMI', 'RISK DISTRIBUTION')}
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
                  className="w-full tactical-card p-3 text-left"
                  style={{ borderLeftColor: cfg.color }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="data-mono text-sm font-bold" style={{ color: 'oklch(0.92 0.01 220)' }}>{stock.ticker}</span>
                      <span className="text-xs" style={{ color: 'oklch(0.5 0.015 225)' }}>{stock.sector}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`data-mono text-xs font-bold ${rCfg.textClass}`}>{rCfg.label} {copy(language, 'Risk', 'Risk')}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`} style={{ borderRadius: 0 }}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs" style={{ color: 'oklch(0.4 0.015 225)' }}>{copy(language, 'Momentum', 'Momentum')}</span>
                        <span className="data-mono text-xs" style={{ color: cfg.color }}>{stock.momentumScore}</span>
                      </div>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ width: `${stock.momentumScore}%`, background: cfg.color }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs" style={{ color: 'oklch(0.4 0.015 225)' }}>{copy(language, 'Beat İht.', 'Beat Prob.')}</div>
                      <div className="data-mono text-xs font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>%{stock.earningsBeatProbability}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs" style={{ color: 'oklch(0.4 0.015 225)' }}>{copy(language, 'Implied', 'Implied')}</div>
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
            {copy(language, 'PORTFÖY STRATEJİSİ ÖNERİSİ', 'PORTFOLIO STRATEGY RECOMMENDATION')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              title: copy(language, 'GÜÇLÜ AL', 'STRONG BUY'),
              stocks: strongBuy,
              color: 'oklch(0.78 0.18 160)',
              desc: copy(language, 'Earnings öncesi pozisyon açılabilir. Yüksek momentum + güçlü sektörel destek.', 'Position can be opened before earnings. High momentum + strong sectoral support.'),
              action: copy(language, 'Pozisyon Aç', 'Open Position'),
            },
            {
              title: copy(language, 'AL', 'BUY'),
              stocks: buy,
              color: '#4ade80',
              desc: copy(language, 'Earnings öncesi dikkatli pozisyon. İyi fundamentaller, makul risk.', 'Cautious position before earnings. Good fundamentals, reasonable risk.'),
              action: copy(language, 'Küçük Pozisyon', 'Small Position'),
            },
            {
              title: copy(language, 'NÖTR', 'NEUTRAL'),
              stocks: neutral,
              color: 'oklch(0.75 0.15 75)',
              desc: copy(language, 'Earnings sonrasına kadar bekle. Karışık sinyaller, yüksek "haberle sat" riski.', 'Wait until after earnings. Mixed signals, high "sell the news" risk.'),
              action: copy(language, 'İzle', 'Watch'),
            },
            {
              title: copy(language, 'SAT / GÜÇLÜ SAT', 'SELL / STRONG SELL'),
              stocks: sell,
              color: 'oklch(0.65 0.22 25)',
              desc: copy(language, 'Kırılmış momentum, zayıf sektörel destek. Earnings öncesi kaçın.', 'Broken momentum, weak sectoral support. Avoid before earnings.'),
              action: copy(language, 'Kaçın', 'Avoid'),
            },
          ].map(group => (
            <div key={group.title} className="tactical-card p-4" style={{ borderLeftColor: group.color }}>
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
      <div className="tactical-card p-6" style={{ borderLeftColor: 'oklch(0.65 0.22 25)', borderLeftWidth: '4px' }}>
        <div className="heading-condensed text-base mb-3" style={{ color: 'oklch(0.65 0.22 25)' }}>
          {copy(language, '⚠ GENEL RİSK FAKTÖRLERİ', '⚠ GENERAL RISK FACTORS')}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {[
            {
              title: copy(language, 'RSI Aşırı Alım', 'RSI Overbought'),
              desc: copy(language, 'PANW (RSI 78) ve CRWD (RSI 72) aşırı alım bölgesine yakın. Earnings iyi gelse bile "haberle sat" dinamiği devreye girebilir.', 'PANW (RSI 78) and CRWD (RSI 72) are near the overbought zone. Even if earnings are good, "sell the news" dynamics may kick in.'),
              color: 'oklch(0.75 0.15 75)',
            },
            {
              title: copy(language, 'Hacim-Fiyat Uyumsuzluğu', 'Volume-Price Divergence'),
              desc: copy(language, 'CRM yüksek hacimde düşüş gösteriyor (distribution sinyali). DELL ise fiyat yükselirken hacim düşüyor (yorgunluk sinyali).', 'CRM is showing decline on high volume (distribution signal). DELL is seeing volume drop while price rises (fatigue signal).'),
              color: 'oklch(0.65 0.22 25)',
            },
            {
              title: copy(language, 'Kırılmış Momentum', 'Broken Momentum'),
              desc: copy(language, 'SNOW (-35%), CRM (-33%), ZS (-40%) son 6 ayda ciddi kayıp yaşadı. Earnings iyi gelse bile güçlü toparlanma için güçlü katalizör gerekiyor.', 'SNOW (-35%), CRM (-33%), ZS (-40%) suffered serious losses in the last 6 months. Even if earnings are good, a strong catalyst is needed for a strong recovery.'),
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

