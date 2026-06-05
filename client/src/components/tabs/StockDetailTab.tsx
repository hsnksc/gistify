/*
 * DESIGN: "Precision Finance" — Stock Detail Tab
 * Full stock analysis with radar chart, historical moves, catalysts/risks
 */

import { stocksData, signalConfig, riskConfig, type StockData } from '@/lib/stockData';
import { getTooltipLabel } from '@/lib/chartTooltip';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine,
} from 'recharts';

interface Props {
  selectedTicker: string | null;
  onSelectTicker: (ticker: string) => void;
  stocks?: StockData[];
}

export default function StockDetailTab({
  selectedTicker,
  onSelectTicker,
  stocks = stocksData,
}: Props) {
  const stock = selectedTicker
    ? stocks.find(s => s.ticker === selectedTicker) || stocks[0]
    : stocks[0];

  const cfg = signalConfig[stock.signal];
  const rCfg = riskConfig[stock.riskLevel];

  const radarData = [
    { subject: 'Momentum', value: stock.momentumScore },
    { subject: 'Beat İht.', value: stock.earningsBeatProbability },
    { subject: 'Analist', value: stock.analystBuyConsensus },
    { subject: 'Hacim', value: stock.volumeStatus === 'VERY_HIGH' ? 95 : stock.volumeStatus === 'HIGH' ? 75 : stock.volumeStatus === 'NORMAL' ? 50 : 25 },
    { subject: 'Sektör', value: stock.sectorTrend === 'BULLISH' ? 90 : stock.sectorTrend === 'NEUTRAL' ? 55 : 25 },
    { subject: 'RSI Sağlık', value: stock.rsi14 > 75 ? 30 : stock.rsi14 < 35 ? 40 : 80 },
  ];

  const historicalData = stock.historicalMoves.map((move, i) => ({
    quarter: `Q${4 - i} ${i === 0 ? '\'26' : i === 1 ? '\'25' : '\'25'}`,
    hareket: move,
  })).reverse();

  return (
    <div className="p-6 space-y-4">
      {/* Stock Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {stocks.map(s => {
          const c = signalConfig[s.signal];
          const isSelected = s.ticker === stock.ticker;
          return (
            <button
              key={s.ticker}
              onClick={() => onSelectTicker(s.ticker)}
              className="px-3 py-1.5 text-xs font-bold data-mono border transition-all duration-150"
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
      <div className="tactical-card p-5" style={{ borderLeftColor: cfg.color, borderLeftWidth: '4px' }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="heading-condensed text-3xl" style={{ color: 'oklch(0.92 0.01 220)' }}>{stock.ticker}</h1>
              <span className={`text-sm font-bold px-3 py-1 border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`} style={{ borderRadius: 0 }}>
                {cfg.label}
              </span>
            </div>
            <div className="text-base" style={{ color: 'oklch(0.65 0.015 225)' }}>{stock.name}</div>
            <div className="text-sm mt-1" style={{ color: 'oklch(0.5 0.015 225)' }}>{stock.sector}</div>
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="text-center">
              <div className="data-mono text-2xl font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{stock.momentumScore}</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>Momentum Skoru</div>
            </div>
            <div className="text-center">
              <div className="data-mono text-2xl font-bold" style={{ color: 'oklch(0.75 0.15 75)' }}>%{stock.earningsBeatProbability}</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>Beat İhtimali</div>
            </div>
            <div className="text-center">
              <div className="data-mono text-2xl font-bold" style={{ color: stock.priceChange6M > 0 ? 'oklch(0.78 0.18 160)' : 'oklch(0.65 0.22 25)' }}>
                {stock.priceChange6M > 0 ? '+' : ''}{stock.priceChange6M}%
              </div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>6A Getiri</div>
            </div>
            <div className="text-center">
              <div className={`data-mono text-2xl font-bold ${rCfg.textClass}`}>{rCfg.label}</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>Risk Seviyesi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Radar Chart */}
        <div className="tactical-card p-4">
          <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(0.45 0.015 225)' }}>
            Çok Boyutlu Analiz
          </div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="oklch(0.25 0.03 225)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'oklch(0.55 0.015 225)', fontSize: 10 }} />
                <Radar
                  name={stock.ticker}
                  dataKey="value"
                  stroke={cfg.color}
                  fill={cfg.color}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="tactical-card p-4">
          <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(0.45 0.015 225)' }}>
            Temel Metrikler
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Mevcut Fiyat', value: `$${stock.currentPrice.toLocaleString()}` },
              { label: 'Earnings Tarihi', value: stock.earningsDate, highlight: true },
              { label: 'EPS Beklentisi', value: `$${stock.epsEstimate}` },
              { label: 'Gelir Beklentisi', value: stock.revenueEstimate },
              { label: 'Gelir Büyümesi', value: `+${stock.revenueGrowthYoY}% YoY` },
              { label: 'Son 4Q Beat Oranı', value: `%${stock.beatRateLast4Q}` },
              { label: 'Ort. EPS Beat', value: `+%${stock.avgEpsBeat}` },
              { label: 'RSI (14)', value: stock.rsi14.toString() },
              { label: 'Analist Buy %', value: `%${stock.analystBuyConsensus} (${stock.analystCount} analist)` },
              { label: 'Hedef Fiyat', value: `$${stock.priceTarget} (${stock.priceTargetUpside > 0 ? '+' : ''}${stock.priceTargetUpside.toFixed(1)}%)` },
            ].map(m => (
              <div key={m.label} className="flex items-center justify-between py-1" style={{ borderBottom: '1px solid oklch(0.18 0.025 225)' }}>
                <span className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{m.label}</span>
                <span className={`data-mono text-xs font-semibold ${m.highlight ? 'text-amber-400' : ''}`} style={{ color: m.highlight ? undefined : 'oklch(0.85 0.01 220)' }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Moves + Key Metric */}
        <div className="space-y-4">
          <div className="tactical-card p-4">
            <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'oklch(0.45 0.015 225)' }}>
              Kritik Metrik
            </div>
            <div className="text-sm font-semibold mb-1" style={{ color: 'oklch(0.65 0.015 225)' }}>{stock.keyMetric}</div>
            <div className="data-mono text-2xl font-bold" style={{ color: cfg.color }}>{stock.keyMetricValue}</div>
          </div>

          <div className="tactical-card p-4">
            <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(0.45 0.015 225)' }}>
              Geçmiş Earnings Hareketi
            </div>
            <div style={{ height: '130px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" />
                  <XAxis dataKey="quarter" tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                  <YAxis tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 9, fontFamily: 'JetBrains Mono' }} unit="%" />
                  <Tooltip content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const resolvedLabel = getTooltipLabel(payload, label, ['quarter']);
                      return (
                        <div className="px-3 py-2 border" style={{ background: 'oklch(0.15 0.03 225)', borderColor: 'oklch(0.25 0.03 225)', borderRadius: 0 }}>
                          <p className="data-mono text-xs font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{resolvedLabel}</p>
                          {payload.map((item: any, index: number) => (
                            <p key={index} className="data-mono text-xs" style={{ color: item.color || item.fill }}>
                              Hareket: {item.value}%
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <ReferenceLine y={0} stroke="oklch(0.35 0.03 225)" />
                  <Bar dataKey="hareket" maxBarSize={24}>
                    {historicalData.map((entry, i) => (
                      <Cell key={i} fill={entry.hareket >= 0 ? 'oklch(0.78 0.18 160)' : 'oklch(0.65 0.22 25)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>Options Implied Move:</span>
              <span className="data-mono text-xs font-bold" style={{ color: 'oklch(0.75 0.15 75)' }}>±{stock.impliedMove}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Thesis */}
      <div className="tactical-card p-4" style={{ borderLeftColor: cfg.color }}>
        <div className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'oklch(0.45 0.015 225)' }}>
          Yatırım Tezi
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.75 0.01 220)' }}>{stock.thesis}</p>
      </div>

      {/* Catalysts + Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="tactical-card p-4" style={{ borderLeftColor: 'oklch(0.78 0.18 160)' }}>
          <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(0.78 0.18 160)' }}>
            ↑ Katalizörler
          </div>
          <ul className="space-y-1.5">
            {stock.catalysts.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'oklch(0.7 0.01 220)' }}>
                <span style={{ color: 'oklch(0.78 0.18 160)', flexShrink: 0 }}>▸</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="tactical-card p-4" style={{ borderLeftColor: 'oklch(0.65 0.22 25)' }}>
          <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(0.65 0.22 25)' }}>
            ↓ Riskler
          </div>
          <ul className="space-y-1.5">
            {stock.risks.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'oklch(0.7 0.01 220)' }}>
                <span style={{ color: 'oklch(0.65 0.22 25)', flexShrink: 0 }}>▸</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
