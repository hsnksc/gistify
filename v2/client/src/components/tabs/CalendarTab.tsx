/*
 * DESIGN: "Precision Finance" — Calendar Tab
 * Earnings calendar with signal indicators
 */

import { earningsCalendar, stocksData, signalConfig } from '@/lib/stockData';

interface Props {
  onStockClick: (ticker: string) => void;
}

export default function CalendarTab({ onStockClick }: Props) {
  // Group by date
  const grouped = earningsCalendar.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, typeof earningsCalendar>);

  const dates = Object.keys(grouped);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5" style={{ background: 'oklch(0.75 0.15 75)' }} />
          <h1 className="heading-condensed text-xl" style={{ color: 'oklch(0.92 0.01 220)' }}>
            EARNINGS TAKVİMİ
          </h1>
        </div>
        <p className="text-sm ml-3" style={{ color: 'oklch(0.5 0.015 225)' }}>
          27 Mayıs — 3 Haziran 2026 · Tüm raporlar piyasa kapanışı sonrası (AMC)
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[140px] top-0 bottom-0 w-px" style={{ background: 'oklch(0.22 0.03 225)' }} />

        <div className="space-y-6">
          {dates.map((date, di) => (
            <div key={date} className="flex gap-0">
              {/* Date label */}
              <div className="w-[140px] flex-shrink-0 pr-4 pt-1 text-right">
                <div className="data-mono text-xs font-bold" style={{ color: 'oklch(0.75 0.15 75)' }}>{date}</div>
                <div className="text-xs" style={{ color: 'oklch(0.4 0.015 225)' }}>AMC</div>
              </div>

              {/* Dot */}
              <div className="relative flex-shrink-0 flex items-start justify-center w-0">
                <div className="w-3 h-3 rounded-full border-2 mt-1.5 -ml-1.5" style={{
                  background: 'oklch(0.11 0.025 230)',
                  borderColor: 'oklch(0.78 0.18 160)',
                }} />
              </div>

              {/* Cards */}
              <div className="flex-1 pl-6 space-y-2">
                {grouped[date].map((item) => {
                  const stock = stocksData.find(s => s.ticker === item.ticker);
                  const cfg = signalConfig[item.signal];
                  if (!stock) return null;
                  return (
                    <button
                      key={item.ticker}
                      onClick={() => onStockClick(item.ticker)}
                      className="w-full tactical-card p-3 text-left"
                      style={{ borderLeftColor: cfg.color }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="data-mono text-base font-bold" style={{ color: 'oklch(0.92 0.01 220)' }}>{item.ticker}</span>
                          <span className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>{item.name}</span>
                          <span className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{stock.sector}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="data-mono text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>
                            EPS: <span style={{ color: 'oklch(0.75 0.01 220)' }}>${stock.epsEstimate}</span>
                          </span>
                          <span className="data-mono text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>
                            Gelir: <span style={{ color: 'oklch(0.75 0.01 220)' }}>{stock.revenueEstimate}</span>
                          </span>
                          <span className="data-mono text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>
                            Beat İht: <span style={{ color: 'oklch(0.78 0.18 160)' }}>%{stock.earningsBeatProbability}</span>
                          </span>
                          <span className={`text-xs font-bold px-2 py-0.5 border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`} style={{ borderRadius: 0 }}>
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1.5 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span className="text-xs" style={{ color: 'oklch(0.4 0.015 225)' }}>Momentum:</span>
                          <div style={{ width: '60px', height: '3px', background: 'oklch(0.2 0.03 225)' }}>
                            <div style={{
                              width: `${stock.momentumScore}%`,
                              height: '100%',
                              background: cfg.color,
                            }} />
                          </div>
                          <span className="data-mono text-xs font-bold" style={{ color: cfg.color }}>{stock.momentumScore}</span>
                        </div>
                        <span className="text-xs" style={{ color: 'oklch(0.4 0.015 225)' }}>
                          Implied Move: <span className="data-mono font-semibold" style={{ color: 'oklch(0.75 0.15 75)' }}>±{stock.impliedMove}%</span>
                        </span>
                        <span className="text-xs" style={{ color: 'oklch(0.4 0.015 225)' }}>
                          6A: <span className="data-mono font-semibold" style={{ color: stock.priceChange6M > 0 ? 'oklch(0.78 0.18 160)' : 'oklch(0.65 0.22 25)' }}>
                            {stock.priceChange6M > 0 ? '+' : ''}{stock.priceChange6M}%
                          </span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Table */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.6 0.12 250)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            TAKVİM ÖZET TABLOSU
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '2px solid oklch(0.22 0.03 225)', background: 'oklch(0.13 0.025 230)' }}>
                {['Tarih', 'Hisse', 'Sektör', 'EPS Beklenti', 'Gelir Beklenti', 'Gelir Büyümesi', 'Beat İhtimali', 'Implied Move', 'Sinyal'].map(h => (
                  <th key={h} className="px-3 py-2 text-left heading-condensed text-xs tracking-wider" style={{ color: 'oklch(0.55 0.015 225)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {earningsCalendar.map((item, i) => {
                const stock = stocksData.find(s => s.ticker === item.ticker);
                const cfg = signalConfig[item.signal];
                if (!stock) return null;
                return (
                  <tr
                    key={item.ticker}
                    onClick={() => onStockClick(item.ticker)}
                    className="cursor-pointer transition-colors"
                    style={{
                      borderBottom: '1px solid oklch(0.18 0.025 225)',
                      background: i % 2 === 0 ? 'transparent' : 'oklch(0.13 0.025 230 / 0.5)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0.78 0.18 160 / 0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'oklch(0.13 0.025 230 / 0.5)')}
                  >
                    <td className="px-3 py-2.5 data-mono text-xs" style={{ color: 'oklch(0.75 0.15 75)' }}>{item.date}</td>
                    <td className="px-3 py-2.5 data-mono text-sm font-bold" style={{ color: 'oklch(0.92 0.01 220)' }}>{item.ticker}</td>
                    <td className="px-3 py-2.5 text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>{stock.sector}</td>
                    <td className="px-3 py-2.5 data-mono text-xs" style={{ color: 'oklch(0.75 0.01 220)' }}>${stock.epsEstimate}</td>
                    <td className="px-3 py-2.5 data-mono text-xs" style={{ color: 'oklch(0.75 0.01 220)' }}>{stock.revenueEstimate}</td>
                    <td className="px-3 py-2.5 data-mono text-xs" style={{ color: 'oklch(0.78 0.18 160)' }}>+{stock.revenueGrowthYoY}%</td>
                    <td className="px-3 py-2.5 data-mono text-xs font-semibold" style={{ color: 'oklch(0.78 0.18 160)' }}>%{stock.earningsBeatProbability}</td>
                    <td className="px-3 py-2.5 data-mono text-xs" style={{ color: 'oklch(0.75 0.15 75)' }}>±{stock.impliedMove}%</td>
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
    </div>
  );
}
