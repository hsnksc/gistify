/*
 * DESIGN: "Precision Finance" — June Momentum Tab
 * Composite momentum scoring for June earnings
 */

import { juneDetailedEarningsData, juneDetailedStrategyConfig } from '@/lib/juneDetailedEarningsData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  onStockClick: (ticker: string) => void;
}

export default function JuneMomentumTab({ onStockClick }: Props) {
  const sorted = [...juneDetailedEarningsData].sort((a, b) => b.momentumScore - a.momentumScore);

  const momentumData = sorted.map(s => ({
    ticker: s.ticker,
    momentum: s.momentumScore,
    rsi: s.rsi14,
    priceChange: s.priceChange6M,
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
            HAZIRAN MOMENTUM ANALİZİ
          </h1>
        </div>
        <p className="text-sm ml-3" style={{ color: 'oklch(0.5 0.015 225)' }}>
          Bileşik momentum skoru: 6 aylık fiyat hareketi + RSI14 + IV crush potansiyeli
        </p>
      </div>

      {/* Momentum Chart */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.78 0.18 160)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            MOMENTUM SKORU (0-100)
          </h2>
        </div>
        <div className="tactical-card p-4" style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={momentumData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" />
              <XAxis dataKey="ticker" tick={{ fill: 'oklch(0.55 0.015 225)', fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 600 }} />
              <YAxis tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 10, fontFamily: 'JetBrains Mono' }} domain={[0, 100]} />
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0]?.payload;
                  return (
                    <div className="px-3 py-2 border" style={{ background: 'oklch(0.15 0.03 225)', borderColor: 'oklch(0.25 0.03 225)', borderRadius: 0 }}>
                      <p className="data-mono text-xs font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{data?.ticker}</p>
                      <p className="data-mono text-xs" style={{ color: 'oklch(0.78 0.18 160)' }}>Momentum: {data?.momentum}</p>
                      <p className="data-mono text-xs" style={{ color: 'oklch(0.75 0.15 75)' }}>RSI14: {data?.rsi}</p>
                      <p className="data-mono text-xs" style={{ color: 'oklch(0.78 0.18 160)' }}>6M: +{data?.priceChange}%</p>
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

      {/* Detailed Table */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.78 0.18 160)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            MOMENTUM FAKTÖRLERI
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '2px solid oklch(0.22 0.03 225)', background: 'oklch(0.13 0.025 230)' }}>
                {['Sıra', 'Hisse', 'Momentum', 'RSI14', '6M Fiyat', 'IV Crush', 'Rating'].map(h => (
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
                      <div className="flex items-center gap-2">
                        <span className="data-mono text-sm font-bold" style={{ color: cfg.color }}>{stock.momentumScore}</span>
                        <div style={{ width: '50px', height: '4px', background: 'oklch(0.2 0.03 225)' }}>
                          <div style={{
                            width: `${stock.momentumScore}%`,
                            height: '100%',
                            background: cfg.color,
                          }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.75 0.15 75)' }}>{stock.rsi14}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.78 0.18 160)' }}>+{stock.priceChange6M}%</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.75 0.15 75)' }}>-{stock.expectedIVCrush}%</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs font-bold px-2 py-0.5 border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`} style={{ borderRadius: 0 }}>
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Momentum Explanation */}
      <div className="tactical-card p-4" style={{ borderLeftColor: 'oklch(0.78 0.18 160)', borderLeftWidth: '4px' }}>
        <div className="heading-condensed text-sm mb-2" style={{ color: 'oklch(0.78 0.18 160)' }}>
          📊 MOMENTUM SKORU AÇIKLAMASI
        </div>
        <div className="text-sm space-y-2" style={{ color: 'oklch(0.65 0.015 225)' }}>
          <p>
            <strong>90+:</strong> Extreme momentum. Hisse 6 ayda +120% üstü kazanmış, RSI 70+. IV crush stratejisi optimal.
          </p>
          <p>
            <strong>80-89:</strong> Güçlü momentum. Hisse 6 ayda +100% kazanmış, RSI 68+. Yüksek IV crush potansiyeli.
          </p>
          <p>
            <strong>70-79:</strong> İyi momentum. Hisse 6 ayda +80% kazanmış, RSI 65+. Orta IV crush potansiyeli.
          </p>
          <p>
            <strong>60-69:</strong> Orta momentum. Hisse 6 ayda +50% kazanmış, RSI 60+. Düşük IV crush potansiyeli.
          </p>
          <p>
            <strong>-60:</strong> Zayıf momentum. Hisse düşüş trendinde. IV crush stratejisi riskli.
          </p>
        </div>
      </div>
    </div>
  );
}
