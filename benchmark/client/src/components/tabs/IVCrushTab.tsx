/*
 * DESIGN: "Precision Finance" — IV Crush Strategy Tab
 * Buy low IV, sell high IV before earnings
 */

import { optionStrategyData, strategyConfig, riskLevelConfig } from '@/lib/optionStrategyData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  ScatterChart, Scatter, Legend,
} from 'recharts';

interface Props {
  onStockClick: (ticker: string) => void;
}

export default function IVCrushTab({ onStockClick }: Props) {
  const sorted = [...optionStrategyData].sort((a, b) => b.ivCrushScore - a.ivCrushScore);

  const scatterData = optionStrategyData.map(s => ({
    ticker: s.ticker,
    x: s.currentIV,
    y: s.momentumScore,
    crush: s.expectedIVCrush,
    rating: s.strategyRating,
  }));

  const profitData = optionStrategyData.map(s => ({
    ticker: s.ticker,
    callGain: s.callGainFromIV,
    putGain: s.putGainFromIV,
    targetProfit: s.targetProfit,
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
            OPSIYON IV CRUSH STRATEJİSİ
          </h1>
        </div>
        <p className="text-sm ml-3" style={{ color: 'oklch(0.5 0.015 225)' }}>
          Düşük IV'de satın al, yüksek IV'de sat · Earnings öncesi IV expansion'dan faydalanma
        </p>
      </div>

      {/* Strategy Explanation */}
      <div className="tactical-card p-5" style={{ borderLeftColor: 'oklch(0.78 0.18 160)', borderLeftWidth: '4px' }}>
        <div className="heading-condensed text-base mb-3" style={{ color: 'oklch(0.78 0.18 160)' }}>
          💡 Strateji Mantığı
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-semibold mb-1" style={{ color: 'oklch(0.85 0.01 220)' }}>Aşama 1: Satın Al (10-15 gün öncesi)</div>
            <div style={{ color: 'oklch(0.65 0.015 225)' }}>IV düşük olduğunda CALL veya PUT satın al. Maliyet minimal.</div>
          </div>
          <div>
            <div className="font-semibold mb-1" style={{ color: 'oklch(0.85 0.01 220)' }}>Aşama 2: Sat (1-2 gün öncesi)</div>
            <div style={{ color: 'oklch(0.65 0.015 225)' }}>IV maksimum seviyede opsiyon satış. IV expansion'dan faydalanma.</div>
          </div>
          <div>
            <div className="font-semibold mb-1" style={{ color: 'oklch(0.85 0.01 220)' }}>Aşama 3: Kar</div>
            <div style={{ color: 'oklch(0.65 0.015 225)' }}>IV crush'tan kaçın, IV expansion'dan kazanç sağla. Earnings riski yok.</div>
          </div>
        </div>
      </div>

      {/* Full Ranking Table */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.78 0.18 160)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            IV CRUSH FIRASAT SIRALAMASI
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '2px solid oklch(0.22 0.03 225)', background: 'oklch(0.13 0.025 230)' }}>
                {['Sıra', 'Hisse', 'Rating', 'IV Crush Skoru', 'Mevcut IV', 'Beklenen IV Crush', 'Call Kazancı', 'Put Kazancı', 'Hedef Kar', 'Risk', 'Strateji'].map(h => (
                  <th key={h} className="px-3 py-2 text-left heading-condensed text-xs tracking-wider" style={{ color: 'oklch(0.55 0.015 225)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((stock, i) => {
                const cfg = strategyConfig[stock.strategyRating];
                const rCfg = riskLevelConfig[stock.riskLevel];
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
                      <div className="flex items-center gap-2">
                        <span className="data-mono text-sm font-bold" style={{ color: cfg.color }}>{stock.ivCrushScore}</span>
                        <div style={{ width: '50px', height: '4px', background: 'oklch(0.2 0.03 225)' }}>
                          <div style={{
                            width: `${stock.ivCrushScore}%`,
                            height: '100%',
                            background: cfg.color,
                          }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.75 0.15 75)' }}>
                        {stock.currentIV}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.78 0.18 160)' }}>
                        -{stock.expectedIVCrush}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.78 0.18 160)' }}>
                        +{stock.callGainFromIV}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.78 0.18 160)' }}>
                        +{stock.putGainFromIV}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.75 0.15 75)' }}>
                        {stock.targetProfit}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs font-semibold ${rCfg.textClass}`}>{rCfg.label}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs" style={{ color: 'oklch(0.65 0.015 225)' }}>
                        {stock.recommendedStrategy.split('(')[0].trim()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* IV vs Momentum Scatter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4" style={{ background: 'oklch(0.6 0.12 250)' }} />
            <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
              MEVCUT IV vs MOMENTUM SKORU
            </h2>
          </div>
          <div className="tactical-card p-4" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" />
                <XAxis
                  dataKey="x"
                  name="Mevcut IV"
                  unit=""
                  tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  label={{ value: 'Mevcut IV', position: 'insideBottom', offset: -10, fill: 'oklch(0.45 0.015 225)', fontSize: 10 }}
                />
                <YAxis
                  dataKey="y"
                  name="Momentum"
                  tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  label={{ value: 'Momentum Skoru', angle: -90, position: 'insideLeft', fill: 'oklch(0.45 0.015 225)', fontSize: 10 }}
                />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0]?.payload;
                    return (
                      <div className="px-3 py-2 border" style={{ background: 'oklch(0.15 0.03 225)', borderColor: 'oklch(0.25 0.03 225)', borderRadius: 0 }}>
                        <p className="data-mono text-xs font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{d?.ticker}</p>
                        <p className="data-mono text-xs" style={{ color: 'oklch(0.75 0.15 75)' }}>IV: {d?.x}</p>
                        <p className="data-mono text-xs" style={{ color: 'oklch(0.78 0.18 160)' }}>Momentum: {d?.y}</p>
                        <p className="data-mono text-xs" style={{ color: 'oklch(0.65 0.22 25)' }}>IV Crush: -{d?.crush}%</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Scatter data={scatterData} name="Hisseler">
                  {scatterData.map((entry, i) => (
                    <Cell key={i} fill={getRatingColor(entry.rating)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Potential */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4" style={{ background: 'oklch(0.75 0.15 75)' }} />
            <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
              CALL vs PUT KAR POTANSİYELİ
            </h2>
          </div>
          <div className="tactical-card p-4" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitData.slice(0, 8)} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" />
                <XAxis dataKey="ticker" tick={{ fill: 'oklch(0.55 0.015 225)', fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 600 }} />
                <YAxis tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 10, fontFamily: 'JetBrains Mono' }} unit="%" />
                <Tooltip content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="px-3 py-2 border" style={{ background: 'oklch(0.15 0.03 225)', borderColor: 'oklch(0.25 0.03 225)', borderRadius: 0 }}>
                        <p className="data-mono text-xs font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{label}</p>
                        {payload.map((p: any, i: number) => (
                          <p key={i} className="data-mono text-xs" style={{ color: p.fill }}>
                            {p.name}: +{p.value}%
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: 'oklch(0.55 0.015 225)' }} />
                <Bar dataKey="callGain" name="Call Kazancı" fill="oklch(0.78 0.18 160)" maxBarSize={20} />
                <Bar dataKey="putGain" name="Put Kazancı" fill="oklch(0.75 0.15 75)" maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Opportunities */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.78 0.18 160)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            EN İYİ FIRASAT HISSELER
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.slice(0, 4).map(stock => {
            const cfg = strategyConfig[stock.strategyRating];
            return (
              <button
                key={stock.ticker}
                onClick={() => onStockClick(stock.ticker)}
                className="tactical-card p-4 text-left"
                style={{ borderLeftColor: cfg.color }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="data-mono text-lg font-bold" style={{ color: 'oklch(0.92 0.01 220)' }}>{stock.ticker}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`} style={{ borderRadius: 0 }}>
                    {cfg.label}
                  </span>
                </div>
                <div className="text-sm mb-3" style={{ color: 'oklch(0.65 0.015 225)' }}>{stock.name}</div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <div className="text-xs" style={{ color: 'oklch(0.4 0.015 225)' }}>Mevcut IV</div>
                    <div className="data-mono text-sm font-bold" style={{ color: 'oklch(0.75 0.15 75)' }}>{stock.currentIV}</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: 'oklch(0.4 0.015 225)' }}>IV Crush</div>
                    <div className="data-mono text-sm font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>-{stock.expectedIVCrush}%</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: 'oklch(0.4 0.015 225)' }}>Call Kazancı</div>
                    <div className="data-mono text-sm font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>+{stock.callGainFromIV}%</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: 'oklch(0.4 0.015 225)' }}>Hedef Kar</div>
                    <div className="data-mono text-sm font-bold" style={{ color: 'oklch(0.75 0.15 75)' }}>{stock.targetProfit}%</div>
                  </div>
                </div>
                <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>
                  <strong>Strateji:</strong> {stock.recommendedStrategy}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Risk Warning */}
      <div className="tactical-card p-4" style={{ borderLeftColor: 'oklch(0.65 0.22 25)', borderLeftWidth: '4px' }}>
        <div className="heading-condensed text-sm mb-2" style={{ color: 'oklch(0.65 0.22 25)' }}>
          ⚠ RİSK UYARISI
        </div>
        <div className="text-sm space-y-1.5" style={{ color: 'oklch(0.65 0.015 225)' }}>
          <p>
            <strong>Earnings Miss Riski:</strong> Fiyat keskin düşüş yaşayabilir. IV crush play'i yaparken, directional risk'ten kaçınmak için spread stratejileri (Bull Call Spread, Iron Condor) kullanın.
          </p>
          <p>
            <strong>Gap Risk:</strong> Earnings sonrası gap açılabilir. Pozisyon sizing'i küçük tutun.
          </p>
          <p>
            <strong>IV Expansion Riski:</strong> Bazı durumlarda IV crush yerine expansion olabilir (ör. geopolitik kriz). Tarihsel IV crush oranlarını kontrol edin.
          </p>
          <p>
            <strong>Friday Kapanış:</strong> Earnings Perşembe/Cuma açıklanırsa, Friday options çok riskli. Önceki hafta Friday options tercih edin.
          </p>
        </div>
      </div>
    </div>
  );
}
