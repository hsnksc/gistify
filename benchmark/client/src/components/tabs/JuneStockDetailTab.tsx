/*
 * DESIGN: "Precision Finance" — June Stock Detail Tab
 */

import { useState } from 'react';
import { juneDetailedEarningsData, juneDetailedStrategyConfig } from '@/lib/juneDetailedEarningsData';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface Props {
  selectedTicker: string | null;
  onSelectTicker: (ticker: string) => void;
}

export default function JuneStockDetailTab({ selectedTicker, onSelectTicker }: Props) {
  const stock = selectedTicker
    ? juneDetailedEarningsData.find(s => s.ticker === selectedTicker) || juneDetailedEarningsData[0]
    : juneDetailedEarningsData[0];

  const cfg = juneDetailedStrategyConfig[stock.strategyRating];

  const radarData = [
    { name: 'Momentum', value: stock.momentumScore, fullMark: 100 },
    { name: 'IV Crush', value: stock.expectedIVCrush * 2, fullMark: 100 },
    { name: 'Call Kazancı', value: Math.min(stock.callGainFromIV, 100), fullMark: 100 },
    { name: 'Hedef Kar', value: Math.min(stock.targetProfit, 100), fullMark: 100 },
    { name: 'Beat Oranı', value: stock.beatRate, fullMark: 100 },
  ];

  const timelineData = [
    { day: '15 gün öncesi', iv: stock.historicalIV, status: 'BUY' },
    { day: '10 gün öncesi', iv: stock.historicalIV + 8, status: 'HOLD' },
    { day: '5 gün öncesi', iv: stock.currentIV - 15, status: 'HOLD' },
    { day: '2 gün öncesi', iv: stock.currentIV - 5, status: 'HOLD' },
    { day: '1 gün öncesi', iv: stock.currentIV, status: 'SELL' },
    { day: 'Earnings sonrası', iv: stock.currentIV - stock.expectedIVCrush, status: 'CRUSH' },
  ];

  return (
    <div className="p-6 space-y-4">
      {/* Stock Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {juneDetailedEarningsData.map(s => {
          const c = juneDetailedStrategyConfig[s.strategyRating];
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
            <div className="text-sm mt-1" style={{ color: 'oklch(0.5 0.015 225)' }}>
              Earnings: {stock.earningsDate} ({stock.earningsTime}) · Sektor: {stock.sector}
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="text-center">
              <div className="data-mono text-2xl font-bold" style={{ color: cfg.color }}>{stock.ivCrushScore}</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>IV Crush Skoru</div>
            </div>
            <div className="text-center">
              <div className="data-mono text-2xl font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>+{stock.callGainFromIV}%</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>Call Kazancı</div>
            </div>
            <div className="text-center">
              <div className="data-mono text-2xl font-bold" style={{ color: 'oklch(0.75 0.15 75)' }}>{stock.targetProfit}%</div>
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
              <Radar name={stock.ticker} dataKey="value" stroke={cfg.color} fill={cfg.color} fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* IV Timeline */}
      <div className="tactical-card p-4">
        <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(0.45 0.015 225)' }}>
          IV Expansion Timeline
        </div>
        <div style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" />
              <XAxis
                dataKey="day"
                tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                angle={-20}
                textAnchor="end"
              />
              <YAxis tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 9, fontFamily: 'JetBrains Mono' }} label={{ value: 'IV', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0]?.payload;
                  return (
                    <div className="px-3 py-2 border" style={{ background: 'oklch(0.15 0.03 225)', borderColor: 'oklch(0.25 0.03 225)', borderRadius: 0 }}>
                      <p className="data-mono text-xs font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{data?.day}</p>
                      <p className="data-mono text-xs" style={{ color: 'oklch(0.75 0.15 75)' }}>IV: {data?.iv}</p>
                      <p className="text-xs" style={{ color: cfg.color }}>{data?.status}</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Line type="monotone" dataKey="iv" stroke={cfg.color} strokeWidth={2} dot={{ fill: cfg.color, r: 4 }} />
            </LineChart>
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
              { label: 'Satın Al', value: `$${stock.callPremiumBuy.toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
              { label: 'Sat', value: `$${stock.callPremiumSell.toFixed(2)}`, color: 'oklch(0.75 0.15 75)' },
              { label: 'Brüt Kar', value: `$${(stock.callPremiumSell - stock.callPremiumBuy).toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
              { label: 'Kar %', value: `+${stock.callGainFromIV}%`, color: 'oklch(0.78 0.18 160)' },
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
              { label: 'Satın Al', value: `$${stock.putPremiumBuy.toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
              { label: 'Sat', value: `$${stock.putPremiumSell.toFixed(2)}`, color: 'oklch(0.75 0.15 75)' },
              { label: 'Brüt Kar', value: `$${(stock.putPremiumSell - stock.putPremiumBuy).toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
              { label: 'Kar %', value: `+${stock.putGainFromIV}%`, color: 'oklch(0.78 0.18 160)' },
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
            { label: 'Hedef Kar', value: `+${stock.targetProfit}%`, color: 'oklch(0.78 0.18 160)' },
            { label: 'Max Zarar', value: `-${stock.maxLoss}%`, color: 'oklch(0.65 0.22 25)' },
            { label: 'Ödül/Risk', value: `${(stock.targetProfit / stock.maxLoss).toFixed(1)}:1`, color: 'oklch(0.75 0.15 75)' },
          ].map(m => (
            <div key={m.label} className="text-center p-3" style={{ background: 'oklch(0.13 0.025 230)', borderRadius: 0 }}>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{m.label}</div>
              <div className="data-mono text-lg font-bold mt-1" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Strategy */}
      <div className="tactical-card p-4" style={{ borderLeftColor: cfg.color }}>
        <div className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'oklch(0.45 0.015 225)' }}>
          ✅ ÖNERİLEN STRATEJİ
        </div>
        <div className="text-sm font-semibold mb-2" style={{ color: cfg.color }}>{stock.recommendedStrategy}</div>
        <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.65 0.015 225)' }}>
          {stock.ticker === 'LRCX' && 'Yüksek momentum (92) + Yüksek IV crush (42%). Bull Call Spread tercih edilir. Yarı iletken sektörü güçlü.'}
          {stock.ticker === 'ASML' && 'Güçlü momentum (88) + Yüksek IV crush (38%). Long Call optimal. Avrupa yarı iletken lideri.'}
          {stock.ticker === 'MCHP' && 'İyi momentum (76) + Orta IV crush (35%). Bull Call Spread tercih edilir. Moderate risk/reward.'}
          {stock.ticker === 'NXPI' && 'Güçlü momentum (85) + Yüksek IV crush (40%). Long Call tercih edilir. Mobil chip lideri.'}
          {stock.ticker === 'AMAT' && 'Extreme momentum (90) + Yüksek IV crush (44%). Bull Call Spread tercih edilir. Equipment leader.'}
          {stock.ticker === 'SNPS' && 'İyi momentum (82) + Orta IV crush (32%). Long Call tercih edilir. Yazılım tarafı stabil.'}
          {stock.ticker === 'CDNS' && 'İyi momentum (80) + Orta IV crush (30%). Bull Call Spread tercih edilir. Güvenli play.'}
          {stock.ticker === 'ACLS' && 'Orta momentum (72) + Düşük IV crush (28%). Iron Condor tercih edilir. Küçük cap, riskli.'}
          {stock.ticker === 'AVGO' && 'Güçlü momentum (88) + Yüksek IV crush (41%). Long Call tercih edilir. Infrastructure leader.'}
          {stock.ticker === 'SLAB' && 'İyi momentum (75) + Orta IV crush (32%). Bull Call Spread tercih edilir. Moderate fırsat.'}
        </p>
      </div>

      {/* Risk Factors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="tactical-card p-3" style={{ borderLeftColor: 'oklch(0.65 0.22 25)' }}>
          <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.22 25)' }}>Earnings Miss Riski</div>
          <div className="data-mono text-2xl font-bold mb-1" style={{ color: 'oklch(0.65 0.22 25)' }}>{stock.earningsMissRisk}%</div>
          <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>Fiyat keskin düşüş riski</div>
        </div>
        <div className="tactical-card p-3" style={{ borderLeftColor: 'oklch(0.75 0.15 75)' }}>
          <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.75 0.15 75)' }}>Gap Riski</div>
          <div className="data-mono text-2xl font-bold mb-1" style={{ color: 'oklch(0.75 0.15 75)' }}>{stock.gapRisk}%</div>
          <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>Earnings sonrası gap açılma riski</div>
        </div>
        <div className="tactical-card p-3" style={{ borderLeftColor: 'oklch(0.78 0.18 160)' }}>
          <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.78 0.18 160)' }}>Tarihsel Beat Oranı</div>
          <div className="data-mono text-2xl font-bold mb-1" style={{ color: 'oklch(0.78 0.18 160)' }}>%{stock.beatRate}</div>
          <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>Son 4 çeyrekte beat oranı</div>
        </div>
      </div>
    </div>
  );
}
