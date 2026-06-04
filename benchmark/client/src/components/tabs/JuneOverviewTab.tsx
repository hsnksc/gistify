/*
 * DESIGN: "Precision Finance" — June Overview Tab
 * Same structure as May-June Overview
 */

import { juneDetailedEarningsData, juneDetailedStrategyConfig } from '@/lib/juneDetailedEarningsData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  onStockClick: (ticker: string) => void;
}

export default function JuneOverviewTab({ onStockClick }: Props) {
  const sorted = [...juneDetailedEarningsData].sort((a, b) => b.ivCrushScore - a.ivCrushScore);
  const topPicks = sorted.slice(0, 3);

  const momentumData = juneDetailedEarningsData.map(s => ({
    ticker: s.ticker,
    momentum: s.momentumScore,
  }));

  const getRatingColor = (rating: string) => {
    if (rating === 'EXCELLENT') return 'oklch(0.78 0.18 160)';
    if (rating === 'GOOD') return '#4ade80';
    if (rating === 'FAIR') return 'oklch(0.75 0.15 75)';
    return 'oklch(0.65 0.22 25)';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5" style={{ background: 'oklch(0.78 0.18 160)' }} />
          <h1 className="heading-condensed text-xl" style={{ color: 'oklch(0.92 0.01 220)' }}>
            HAZIRAN EARNINGS ÖZETİ
          </h1>
        </div>
        <p className="text-sm ml-3" style={{ color: 'oklch(0.5 0.015 225)' }}>
          3-12 Haziran 2026 · Yarı iletken yoğun · 10 hisse · Yüksek IV crush potansiyeli
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Analiz Edilen Hisse', value: juneDetailedEarningsData.length, color: 'oklch(0.78 0.18 160)' },
          { label: 'Mükemmel Fırsat', value: sorted.filter(s => s.strategyRating === 'EXCELLENT').length, color: 'oklch(0.78 0.18 160)' },
          { label: 'Ort. IV Crush', value: `${Math.round(juneDetailedEarningsData.reduce((a, s) => a + s.expectedIVCrush, 0) / juneDetailedEarningsData.length)}%`, color: 'oklch(0.75 0.15 75)' },
          { label: 'Ort. Kar Potansiyeli', value: `${Math.round(juneDetailedEarningsData.reduce((a, s) => a + s.targetProfit, 0) / juneDetailedEarningsData.length)}%`, color: 'oklch(0.75 0.15 75)' },
        ].map(kpi => (
          <div key={kpi.label} className="tactical-card p-4" style={{ borderLeftColor: kpi.color }}>
            <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{kpi.label}</div>
            <div className="data-mono text-2xl font-bold mt-1" style={{ color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Strategy Explanation */}
      <div className="tactical-card p-5" style={{ borderLeftColor: 'oklch(0.78 0.18 160)', borderLeftWidth: '4px' }}>
        <div className="heading-condensed text-base mb-3" style={{ color: 'oklch(0.78 0.18 160)' }}>
          💡 Haziran Earnings Stratejisi
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-semibold mb-1" style={{ color: 'oklch(0.85 0.01 220)' }}>Yarı İletken Dominansı</div>
            <div style={{ color: 'oklch(0.65 0.015 225)' }}>LRCX, ASML, MCHP, NXPI, AMAT, AVGO, SLAB. Tüm hisseler yarı iletken sektöründe.</div>
          </div>
          <div>
            <div className="font-semibold mb-1" style={{ color: 'oklch(0.85 0.01 220)' }}>Yüksek IV Crush</div>
            <div style={{ color: 'oklch(0.65 0.015 225)' }}>Ortalama 36% IV crush beklentisi. Opsiyon IV expansion stratejisi optimal.</div>
          </div>
          <div>
            <div className="font-semibold mb-1" style={{ color: 'oklch(0.85 0.01 220)' }}>Kar Potansiyeli</div>
            <div style={{ color: 'oklch(0.65 0.015 225)' }}>Ortalama 128% hedef kar. Top 3 hisse +135% potansiyeli.</div>
          </div>
        </div>
      </div>

      {/* Top Picks */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.78 0.18 160)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            EN İYİ HAZIRAN FIRASAT HISSELER
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPicks.map((stock, i) => {
            const cfg = juneDetailedStrategyConfig[stock.strategyRating];
            return (
              <button
                key={stock.ticker}
                onClick={() => onStockClick(stock.ticker)}
                className="tactical-card p-4 text-left cursor-pointer hover:opacity-80 transition-opacity"
                style={{ borderLeftColor: cfg.color }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="data-mono text-lg font-bold" style={{ color: 'oklch(0.92 0.01 220)' }}>{stock.ticker}</span>
                    <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>#{i + 1} Fırsat</div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`} style={{ borderRadius: 0 }}>
                    {cfg.label}
                  </span>
                </div>
                <div className="text-sm mb-3" style={{ color: 'oklch(0.65 0.015 225)' }}>{stock.name}</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div style={{ color: 'oklch(0.4 0.015 225)' }}>Earnings</div>
                    <div className="data-mono font-semibold" style={{ color: 'oklch(0.85 0.01 220)' }}>{stock.earningsDate}</div>
                  </div>
                  <div>
                    <div style={{ color: 'oklch(0.4 0.015 225)' }}>IV Crush</div>
                    <div className="data-mono font-semibold" style={{ color: cfg.color }}>-{stock.expectedIVCrush}%</div>
                  </div>
                  <div>
                    <div style={{ color: 'oklch(0.4 0.015 225)' }}>Call Kazancı</div>
                    <div className="data-mono font-semibold" style={{ color: 'oklch(0.78 0.18 160)' }}>+{stock.callGainFromIV}%</div>
                  </div>
                  <div>
                    <div style={{ color: 'oklch(0.4 0.015 225)' }}>Hedef Kar</div>
                    <div className="data-mono font-semibold" style={{ color: 'oklch(0.75 0.15 75)' }}>{stock.targetProfit}%</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

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
              <Tooltip content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="px-3 py-2 border" style={{ background: 'oklch(0.15 0.03 225)', borderColor: 'oklch(0.25 0.03 225)', borderRadius: 0 }}>
                      <p className="data-mono text-xs font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{label}</p>
                      <p className="data-mono text-xs" style={{ color: 'oklch(0.78 0.18 160)' }}>Momentum: {payload[0]?.value}</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Bar dataKey="momentum" fill="oklch(0.78 0.18 160)" maxBarSize={30}>
                {momentumData.map((entry, i) => {
                  const stock = juneDetailedEarningsData.find(s => s.ticker === entry.ticker);
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
            HAZIRAN EARNINGS FIRASAT SIRALAMASI
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
              {sorted.map((stock, i) => {
                const cfg = juneDetailedStrategyConfig[stock.strategyRating];
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
