/*
 * DESIGN: "Precision Finance" — Option Strategy Detail Tab
 * Deep dive into each stock's option strategy
 */

import { useState } from 'react';
import { optionStrategyData, strategyConfig, riskLevelConfig } from '@/lib/optionStrategyData';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts';

interface Props {
  selectedTicker: string | null;
  onSelectTicker: (ticker: string) => void;
}

export default function OptionDetailTab({ selectedTicker, onSelectTicker }: Props) {
  const stock = selectedTicker
    ? optionStrategyData.find(s => s.ticker === selectedTicker) || optionStrategyData[0]
    : optionStrategyData[0];

  const cfg = strategyConfig[stock.strategyRating];
  const rCfg = riskLevelConfig[stock.riskLevel];

  // Timeline data
  const timelineData = [
    { day: '15 gün öncesi', iv: stock.historicalIV, callPrice: stock.callPremiumBuy, status: 'BUY' },
    { day: '10 gün öncesi', iv: stock.historicalIV + 8, callPrice: stock.callPremiumBuy + 0.5, status: 'HOLD' },
    { day: '5 gün öncesi', iv: stock.currentIV - 15, callPrice: stock.callPremiumBuy + 1.2, status: 'HOLD' },
    { day: '2 gün öncesi', iv: stock.currentIV - 5, callPrice: stock.callPremiumSell - 0.3, status: 'HOLD' },
    { day: '1 gün öncesi', iv: stock.currentIV, callPrice: stock.callPremiumSell, status: 'SELL' },
    { day: 'Earnings sonrası', iv: stock.currentIV - stock.expectedIVCrush, callPrice: stock.callPremiumSell - (stock.callPremiumSell * stock.expectedIVCrush / 100), status: 'CRUSH' },
  ];

  return (
    <div className="p-6 space-y-4">
      {/* Stock Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {optionStrategyData.map(s => {
          const c = strategyConfig[s.strategyRating];
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
              Earnings: {stock.earningsDate} · Sektor: {stock.sector}
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
            <div className="text-center">
              <div className={`data-mono text-2xl font-bold ${rCfg.textClass}`}>{rCfg.label}</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>Risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Timeline */}
      <div className="tactical-card p-4">
        <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(0.45 0.015 225)' }}>
          Strateji Timeline: IV Expansion Fırsat
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
              <YAxis yAxisId="left" tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 9, fontFamily: 'JetBrains Mono' }} label={{ value: 'IV', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 9, fontFamily: 'JetBrains Mono' }} label={{ value: 'Call Fiyatı ($)', angle: 90, position: 'insideRight' }} />
              <Tooltip content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0]?.payload;
                  return (
                    <div className="px-3 py-2 border" style={{ background: 'oklch(0.15 0.03 225)', borderColor: 'oklch(0.25 0.03 225)', borderRadius: 0 }}>
                      <p className="data-mono text-xs font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{data?.day}</p>
                      <p className="data-mono text-xs" style={{ color: 'oklch(0.75 0.15 75)' }}>IV: {data?.iv}</p>
                      <p className="data-mono text-xs" style={{ color: 'oklch(0.78 0.18 160)' }}>Call: ${data?.callPrice.toFixed(2)}</p>
                      <p className="text-xs" style={{ color: cfg.color }}>{data?.status}</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Line yAxisId="left" type="monotone" dataKey="iv" stroke="oklch(0.75 0.15 75)" strokeWidth={2} dot={{ fill: 'oklch(0.75 0.15 75)', r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="callPrice" stroke="oklch(0.78 0.18 160)" strokeWidth={2} dot={{ fill: 'oklch(0.78 0.18 160)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Call Strategy */}
        <div className="tactical-card p-4">
          <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(0.45 0.015 225)' }}>
            📞 CALL OPSİYON STRATEJİSİ
          </div>
          <div className="space-y-2">
            {[
              { label: 'Satın Al (15 gün öncesi)', value: `$${stock.callPremiumBuy.toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
              { label: 'Sat (1-2 gün öncesi)', value: `$${stock.callPremiumSell.toFixed(2)}`, color: 'oklch(0.75 0.15 75)' },
              { label: 'Brüt Kar', value: `$${(stock.callPremiumSell - stock.callPremiumBuy).toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
              { label: 'Kar Yüzdesi', value: `+${stock.callGainFromIV}%`, color: 'oklch(0.78 0.18 160)' },
              { label: 'IV Expansion Katkısı', value: `${stock.expectedIVCrush}% IV crush'tan kaçınma`, color: 'oklch(0.75 0.15 75)' },
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
            📉 PUT OPSİYON STRATEJİSİ
          </div>
          <div className="space-y-2">
            {[
              { label: 'Satın Al (15 gün öncesi)', value: `$${stock.putPremiumBuy.toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
              { label: 'Sat (1-2 gün öncesi)', value: `$${stock.putPremiumSell.toFixed(2)}`, color: 'oklch(0.75 0.15 75)' },
              { label: 'Brüt Kar', value: `$${(stock.putPremiumSell - stock.putPremiumBuy).toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
              { label: 'Kar Yüzdesi', value: `+${stock.putGainFromIV}%`, color: 'oklch(0.78 0.18 160)' },
              { label: 'Directional Hedging', value: 'Aşağı yönlü korunma sağlar', color: 'oklch(0.75 0.15 75)' },
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
            { label: 'Ödül/Risk Oranı', value: `${(stock.targetProfit / stock.maxLoss).toFixed(1)}:1`, color: 'oklch(0.75 0.15 75)' },
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
          {stock.ticker === 'MRVL' && 'Yüksek momentum + Yüksek IV crush potansiyeli. Long Call satın al 15 gün öncesi, 1-2 gün öncesi sat. IV expansion\'dan maksimum faydalanma.'}
          {stock.ticker === 'CRWD' && 'Güçlü momentum + Orta-yüksek IV crush. Bull Call Spread veya Long Call. Earnings öncesi IV yükselmesinden faydalanma.'}
          {stock.ticker === 'AVGO' && 'Güvenli play. Düşük IV crush ama stabil. Long Call, IV crush riski minimal. Earnings miss riski düşük.'}
          {stock.ticker === 'COST' && 'Çok stabil hisse. Iron Condor tercih edilir. Limited profit ama risk de sınırlı.'}
          {stock.ticker === 'DELL' && 'Orta momentum + Orta IV crush. Bull Call Spread optimal. Maliyeti düşürmek için spread kullan.'}
          {stock.ticker === 'PANW' && 'Aşırı alım (RSI 87). Covered Call veya Put satış. Kar realizasyonu için iyi fırsat.'}
          {stock.ticker === 'ADSK' && 'Nötr momentum. Iron Condor tercih edilir. Earnings miss riski yüksek, spread stratejileri tercih et.'}
          {stock.ticker === 'CRM' && 'Kırılmış momentum. Kaçın veya çok küçük pozisyon. Earnings miss riski yüksek.'}
          {stock.ticker === 'SNOW' && 'Yüksek IV crush ama çok riskli. Sell Straddle veya IV crush play tercih et, directional risk\'ten kaçın.'}
          {stock.ticker === 'ZS' && 'Yüksek IV crush ama çok riskli. Kaçın veya IV crush play yap, directional risk\'ten kaçın.'}
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
