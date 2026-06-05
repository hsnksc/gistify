/*
 * DESIGN: "Precision Finance" — Overview Tab
 * Hero banner + summary stats + top picks grid + macro context
 */

import { stocksData, sectorMacroData, signalConfig, type StockData } from '@/lib/stockData';
import { getTooltipLabel } from '@/lib/chartTooltip';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const HERO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663682523726/f6iQZ4ZvSyNWxyJ4Djp26f/hero_banner-iCqwWxUrnD74QRvdzpTN5G.webp';

interface Props {
  onStockClick: (ticker: string) => void;
  stocks?: StockData[];
  reportWindow?: string;
  analysisDateLabel?: string;
  headline?: string;
  summary?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const resolvedLabel = getTooltipLabel(payload, label);
    return (
      <div className="px-3 py-2 border" style={{
        background: 'oklch(0.15 0.03 225)',
        borderColor: 'oklch(0.25 0.03 225)',
        borderRadius: 0,
      }}>
        <p className="data-mono text-xs font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{resolvedLabel}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="data-mono text-xs" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function OverviewTab({
  onStockClick,
  stocks = stocksData,
  reportWindow = 'Haftalik gorunum',
  analysisDateLabel = 'Canli',
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
            EARNING STRATEGY<br />
            <span style={{ color: 'oklch(0.78 0.18 160)' }}>DERİN ANALİZ</span>
          </h1>
          <p className="text-sm max-w-xl" style={{ color: 'oklch(0.65 0.015 225)', lineHeight: 1.6 }}>
            {headline || 'Secili haftanin en iyi momentum, beat ve IV crush kurulumlari burada toplanir.'}
          </p>
          <p className="mt-2 text-sm max-w-2xl" style={{ color: 'oklch(0.56 0.015 225)', lineHeight: 1.6 }}>
            {summary || 'Her hisse ayni akista momentum, hacim kalitesi, earnings zamanlamasi ve opsiyon senaryosuyla okunur.'}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="badge-strong">{strongBuyCount} GÜÇLÜ AL</span>
              <span className="badge-warning">{neutralCount} NÖTR</span>
              <span className="badge-danger">{watchCount} İZLE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Analiz Edilen Hisse', value: String(stocks.length), sub: reportWindow, color: 'oklch(0.78 0.18 160)' },
            { label: 'Öne Çıkan Kurulum', value: String(topPicks.length), sub: topPicks.map(stock => stock.ticker).join(' · ') || 'Watchlist', color: 'oklch(0.78 0.18 160)' },
            { label: 'Ort. Beat İhtimali', value: `%${avgBeat}`, sub: 'Secili hafta ortalamasi', color: 'oklch(0.75 0.15 75)' },
            { label: 'Ort. Momentum', value: String(avgMomentum), sub: leadSector, color: 'oklch(0.75 0.15 75)' },
          ].map((kpi, i) => (
            <div key={i} className="tactical-card p-4">
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
                EN İYİ OLASILILIKLI HİSSELER
              </h2>
            </div>
            <div className="space-y-2">
              {topPicks.map((stock, i) => {
                const cfg = signalConfig[stock.signal];
                return (
                  <button
                    key={stock.ticker}
                    onClick={() => onStockClick(stock.ticker)}
                    className="w-full tactical-card p-3 text-left"
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
                        <span className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>Earnings: </span>
                        <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.75 0.15 75)' }}>{stock.earningsDate}</span>
                      </div>
                      <div>
                        <span className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>Beat İht: </span>
                        <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.78 0.18 160)' }}>%{stock.earningsBeatProbability}</span>
                      </div>
                      <div>
                        <span className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>6A: </span>
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
                MOMENTUM SKORU SIRALAMASI
              </h2>
            </div>
            <div className="tactical-card p-4" style={{ height: '340px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={momentumChartData} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                  <YAxis type="category" dataKey="ticker" tick={{ fill: 'oklch(0.75 0.01 220)', fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 600 }} width={40} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" name="Momentum" radius={[0, 0, 0, 0]} maxBarSize={18}>
                    {momentumChartData.map((entry) => (
                      <Cell
                        key={entry.ticker}
                        fill={
                          entry.score >= 85 ? 'oklch(0.78 0.18 160)' :
                          entry.score >= 65 ? '#4ade80' :
                          entry.score >= 50 ? 'oklch(0.75 0.15 75)' :
                          'oklch(0.65 0.22 25)'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Macro Context */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4" style={{ background: 'oklch(0.6 0.12 250)' }} />
            <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
              MAKRO BAĞLAM — SEKTÖREL BÜYÜME 2026
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.values(sectorMacroData).map((sector) => (
              <div key={sector.name} className="tactical-card p-4">
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
            <span className="font-semibold" style={{ color: 'oklch(0.65 0.22 25)' }}>⚠ YASAL UYARI:</span>{' '}
            Bu rapor yalnızca bilgilendirme amaçlıdır ve yatırım tavsiyesi niteliği taşımaz. Geçmiş performans gelecekteki sonuçları garanti etmez. 
            Hisse senedi yatırımları risk içerir. Yatırım kararlarınızı vermeden önce lisanslı bir finansal danışmana başvurmanız önerilir. 
            Veriler: Yahoo Finance, MarketBeat, ChartMill, Gartner, Deloitte kaynaklarından derlenmiştir.
          </p>
        </div>
      </div>
    </div>
  );
}
