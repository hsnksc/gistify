/*
 * DESIGN: "Precision Finance" — Dynamic Report Tab
 * Renders dynamically generated reports with full analysis
 */

import { useState } from 'react';
import { DynamicReport, reportStrategyConfig } from '@/lib/reportGenerator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface Props {
  report: DynamicReport;
}

export default function DynamicReportTab({ report }: Props) {
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const selectedStock = selectedTicker
    ? report.stocks.find(s => s.ticker === selectedTicker)
    : report.stocks[0];

  const momentumData = report.stocks.map(s => ({
    ticker: s.ticker,
    momentum: s.momentumScore,
  }));

  const radarData = selectedStock
    ? [
        { name: 'Momentum', value: selectedStock.momentumScore, fullMark: 100 },
        { name: 'IV Crush', value: selectedStock.expectedIVCrush * 2, fullMark: 100 },
        { name: 'Call Kazancı', value: Math.min(selectedStock.callGainFromIV, 100), fullMark: 100 },
        { name: 'Hedef Kar', value: Math.min(selectedStock.targetProfit, 100), fullMark: 100 },
        { name: 'Beat Oranı', value: selectedStock.beatRate, fullMark: 100 },
      ]
    : [];

  const getRatingColor = (rating: string) => {
    if (rating === 'EXCELLENT') return 'oklch(0.78 0.18 160)';
    if (rating === 'GOOD') return '#4ade80';
    if (rating === 'FAIR') return 'oklch(0.75 0.15 75)';
    return 'oklch(0.65 0.22 25)';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Report Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5" style={{ background: 'oklch(0.78 0.18 160)' }} />
          <h1 className="heading-condensed text-2xl" style={{ color: 'oklch(0.92 0.01 220)' }}>
            {report.name}
          </h1>
        </div>
        <p className="text-sm ml-3" style={{ color: 'oklch(0.5 0.015 225)' }}>
          {report.startDate} → {report.endDate} · {report.stocks.length} hisse · Otomatik oluşturulmuş
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Toplam Hisse', value: report.summary.totalStocks, color: 'oklch(0.78 0.18 160)' },
          { label: 'Mükemmel Fırsat', value: report.summary.excellentCount, color: 'oklch(0.78 0.18 160)' },
          { label: 'Ort. IV Crush', value: `${report.summary.avgIVCrush}%`, color: 'oklch(0.75 0.15 75)' },
          { label: 'Ort. Kar Potansiyeli', value: `${report.summary.avgTargetProfit}%`, color: 'oklch(0.75 0.15 75)' },
        ].map(kpi => (
          <div key={kpi.label} className="tactical-card p-4" style={{ borderLeftColor: kpi.color }}>
            <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{kpi.label}</div>
            <div className="data-mono text-2xl font-bold mt-1" style={{ color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Stock Selector */}
      <div className="flex flex-wrap gap-2">
        {report.stocks.slice(0, 10).map(stock => {
          const cfg = reportStrategyConfig[stock.strategyRating];
          const isSelected = stock.ticker === selectedStock?.ticker;
          return (
            <button
              key={stock.ticker}
              onClick={() => setSelectedTicker(stock.ticker)}
              className="px-3 py-1.5 text-xs font-bold data-mono border transition-all duration-150"
              style={{
                borderRadius: 0,
                background: isSelected ? `${cfg.color}20` : 'transparent',
                borderColor: isSelected ? cfg.color : 'oklch(0.25 0.03 225)',
                color: isSelected ? cfg.color : 'oklch(0.55 0.015 225)',
              }}
            >
              {stock.ticker}
            </button>
          );
        })}
        {report.stocks.length > 10 && (
          <div className="px-3 py-1.5 text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>
            +{report.stocks.length - 10} daha
          </div>
        )}
      </div>

      {/* Selected Stock Details */}
      {selectedStock && (
        <>
          {/* Stock Header */}
          <div className="tactical-card p-5" style={{ borderLeftColor: getRatingColor(selectedStock.strategyRating), borderLeftWidth: '4px' }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="heading-condensed text-3xl" style={{ color: 'oklch(0.92 0.01 220)' }}>
                    {selectedStock.ticker}
                  </h2>
                  <span
                    className={`text-sm font-bold px-3 py-1 border ${reportStrategyConfig[selectedStock.strategyRating].bgClass} ${reportStrategyConfig[selectedStock.strategyRating].textClass} ${reportStrategyConfig[selectedStock.strategyRating].borderClass}`}
                    style={{ borderRadius: 0 }}
                  >
                    {reportStrategyConfig[selectedStock.strategyRating].label}
                  </span>
                </div>
                <div className="text-base" style={{ color: 'oklch(0.65 0.015 225)' }}>{selectedStock.name}</div>
                <div className="text-sm mt-1" style={{ color: 'oklch(0.5 0.015 225)' }}>
                  Earnings: {selectedStock.earningsDate} ({selectedStock.earningsTime}) · Sektor: {selectedStock.sector}
                </div>
              </div>
              <div className="flex gap-4 flex-wrap">
                <div className="text-center">
                  <div className="data-mono text-2xl font-bold" style={{ color: getRatingColor(selectedStock.strategyRating) }}>
                    {selectedStock.ivCrushScore}
                  </div>
                  <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>IV Crush Skoru</div>
                </div>
                <div className="text-center">
                  <div className="data-mono text-2xl font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>
                    +{selectedStock.callGainFromIV}%
                  </div>
                  <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>Call Kazancı</div>
                </div>
                <div className="text-center">
                  <div className="data-mono text-2xl font-bold" style={{ color: 'oklch(0.75 0.15 75)' }}>
                    {selectedStock.targetProfit}%
                  </div>
                  <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>Hedef Kar</div>
                </div>
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="tactical-card p-4">
            <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(0.45 0.015 225)' }}>
              Hisse Profili Radar
            </div>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="oklch(0.22 0.03 225)" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 9 }} />
                  <Radar name={selectedStock.ticker} dataKey="value" stroke={getRatingColor(selectedStock.strategyRating)} fill={getRatingColor(selectedStock.strategyRating)} fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Call Strategy */}
            <div className="tactical-card p-4">
              <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(0.45 0.015 225)' }}>
                📞 CALL OPSİYON
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Satın Al', value: `$${selectedStock.callPremiumBuy.toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
                  { label: 'Sat', value: `$${selectedStock.callPremiumSell.toFixed(2)}`, color: 'oklch(0.75 0.15 75)' },
                  { label: 'Brüt Kar', value: `$${(selectedStock.callPremiumSell - selectedStock.callPremiumBuy).toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
                  { label: 'Kar %', value: `+${selectedStock.callGainFromIV}%`, color: 'oklch(0.78 0.18 160)' },
                ].map(m => (
                  <div key={m.label} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid oklch(0.18 0.025 225)' }}>
                    <span className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{m.label}</span>
                    <span className="data-mono text-xs font-semibold" style={{ color: m.color }}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Put Strategy */}
            <div className="tactical-card p-4">
              <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(0.45 0.015 225)' }}>
                📉 PUT OPSİYON
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Satın Al', value: `$${selectedStock.putPremiumBuy.toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
                  { label: 'Sat', value: `$${selectedStock.putPremiumSell.toFixed(2)}`, color: 'oklch(0.75 0.15 75)' },
                  { label: 'Brüt Kar', value: `$${(selectedStock.putPremiumSell - selectedStock.putPremiumBuy).toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
                  { label: 'Kar %', value: `+${selectedStock.putGainFromIV}%`, color: 'oklch(0.78 0.18 160)' },
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
          <div className="tactical-card p-4">
            <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(0.45 0.015 225)' }}>
              ⚖ RİSK vs ÖDÜL
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Hedef Kar', value: `+${selectedStock.targetProfit}%`, color: 'oklch(0.78 0.18 160)' },
                { label: 'Max Zarar', value: `-${selectedStock.maxLoss}%`, color: 'oklch(0.65 0.22 25)' },
                { label: 'Ödül/Risk', value: `${(selectedStock.targetProfit / selectedStock.maxLoss).toFixed(1)}:1`, color: 'oklch(0.75 0.15 75)' },
              ].map(m => (
                <div key={m.label} className="text-center p-3" style={{ background: 'oklch(0.13 0.025 230)', borderRadius: 0 }}>
                  <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{m.label}</div>
                  <div className="data-mono text-lg font-bold mt-1" style={{ color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Momentum Chart */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.6 0.12 250)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            MOMENTUM SKORU SIRALAMASI
          </h2>
        </div>
        <div className="tactical-card p-4" style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={momentumData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" />
              <XAxis dataKey="ticker" tick={{ fill: 'oklch(0.55 0.015 225)', fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 600 }} />
              <YAxis tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 10, fontFamily: 'JetBrains Mono' }} domain={[0, 100]} />
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="px-3 py-2 border" style={{ background: 'oklch(0.15 0.03 225)', borderColor: 'oklch(0.25 0.03 225)', borderRadius: 0 }}>
                      <p className="data-mono text-xs font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{payload[0]?.payload?.ticker}</p>
                      <p className="data-mono text-xs" style={{ color: 'oklch(0.78 0.18 160)' }}>Momentum: {payload[0]?.value}</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Bar dataKey="momentum" fill="oklch(0.78 0.18 160)" maxBarSize={30}>
                {momentumData.map((entry, i) => {
                  const stock = report.stocks.find(s => s.ticker === entry.ticker);
                  return <Cell key={i} fill={getRatingColor(stock?.strategyRating || 'POOR')} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Table */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.78 0.18 160)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            RAPOR FIRASAT SIRALAMASI
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '2px solid oklch(0.22 0.03 225)', background: 'oklch(0.13 0.025 230)' }}>
                {['Sıra', 'Hisse', 'Rating', 'IV Crush Skoru', 'Earnings', 'Momentum', 'IV Crush', 'Call Kazancı', 'Hedef Kar'].map(h => (
                  <th key={h} className="px-3 py-2 text-left heading-condensed text-xs tracking-wider" style={{ color: 'oklch(0.55 0.015 225)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.stocks.map((stock, i) => {
                const cfg = reportStrategyConfig[stock.strategyRating];
                return (
                  <tr
                    key={stock.ticker}
                    onClick={() => setSelectedTicker(stock.ticker)}
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
                      <span className="data-mono text-sm font-bold" style={{ color: 'oklch(0.92 0.01 220)' }}>{stock.ticker}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs font-bold px-2 py-0.5 border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`} style={{ borderRadius: 0 }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-sm font-bold" style={{ color: cfg.color }}>{stock.ivCrushScore}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs" style={{ color: 'oklch(0.65 0.015 225)' }}>{stock.earningsDate}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.78 0.18 160)' }}>{stock.momentumScore}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.75 0.15 75)' }}>-{stock.expectedIVCrush}%</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.78 0.18 160)' }}>+{stock.callGainFromIV}%</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.75 0.15 75)' }}>{stock.targetProfit}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
