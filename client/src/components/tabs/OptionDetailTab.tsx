/*
 * DESIGN: "Precision Finance" — Option Strategy Detail Tab
 * Deep dive into each stock's option strategy
 */

import { optionStrategyData, strategyConfig, riskLevelConfig, type OptionStrategy } from '@/lib/optionStrategyData';
import { copy } from '@/lib/i18n';
import type { AppLanguage } from '@/lib/i18n';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface Props {
  selectedTicker: string | null;
  onSelectTicker: (ticker: string) => void;
  strategies?: OptionStrategy[];
  language: AppLanguage;
}

export default function OptionDetailTab({
  selectedTicker,
  onSelectTicker,
  strategies = optionStrategyData,
  language,
}: Props) {
  const stock = selectedTicker
    ? strategies.find(s => s.ticker === selectedTicker) || strategies[0]
    : strategies[0];

  const cfg = strategyConfig[stock.strategyRating];
  const rCfg = riskLevelConfig[stock.riskLevel];

  // Timeline data
  const timelineData = [
    { day: copy(language, '15 gün öncesi', '15 days before'), iv: stock.historicalIV, callPrice: stock.callPremiumBuy, status: 'BUY' },
    { day: copy(language, '10 gün öncesi', '10 days before'), iv: stock.historicalIV + 8, callPrice: stock.callPremiumBuy + 0.5, status: 'HOLD' },
    { day: copy(language, '5 gün öncesi', '5 days before'), iv: stock.currentIV - 15, callPrice: stock.callPremiumBuy + 1.2, status: 'HOLD' },
    { day: copy(language, '2 gün öncesi', '2 days before'), iv: stock.currentIV - 5, callPrice: stock.callPremiumSell - 0.3, status: 'HOLD' },
    { day: copy(language, '1 gün öncesi', '1 day before'), iv: stock.currentIV, callPrice: stock.callPremiumSell, status: 'SELL' },
    { day: copy(language, 'Earnings sonrası', 'After earnings'), iv: stock.currentIV - stock.expectedIVCrush, callPrice: stock.callPremiumSell - (stock.callPremiumSell * stock.expectedIVCrush / 100), status: 'CRUSH' },
  ];

  return (
    <div className="p-6 space-y-4">
      {/* Stock Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {strategies.map(s => {
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
              <span 
                className="data-mono text-sm font-bold px-3 py-1 border" 
                style={{ 
                  borderRadius: 0, 
                  background: stock.directionalBias === 'CALL' ? 'oklch(0.78 0.18 160 / 0.15)' : stock.directionalBias === 'PUT' ? 'oklch(0.65 0.22 25 / 0.15)' : 'oklch(0.75 0.15 75 / 0.15)',
                  color: stock.directionalBias === 'CALL' ? 'oklch(0.78 0.18 160)' : stock.directionalBias === 'PUT' ? 'oklch(0.65 0.22 25)' : 'oklch(0.75 0.15 75)',
                  borderColor: stock.directionalBias === 'CALL' ? 'oklch(0.78 0.18 160 / 0.4)' : stock.directionalBias === 'PUT' ? 'oklch(0.65 0.22 25 / 0.4)' : 'oklch(0.75 0.15 75 / 0.4)',
                }}
              >
                {copy(language, 'YÖN', 'DIRECTION')}: {stock.directionalBias} %{stock.biasStrength}
              </span>
            </div>
            <div className="text-base" style={{ color: 'oklch(0.65 0.015 225)' }}>{stock.name}</div>
            <div className="text-sm mt-1" style={{ color: 'oklch(0.5 0.015 225)' }}>
              {copy(language, 'Earnings', 'Earnings')}: {stock.earningsDate} · {copy(language, 'Sektor', 'Sector')}: {stock.sector}
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="text-center">
              <div className="data-mono text-2xl font-bold" style={{ color: cfg.color }}>{stock.ivCrushScore}</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{copy(language, 'IV Crush Skoru', 'IV Crush Score')}</div>
            </div>
            <div className="text-center">
              <div className="data-mono text-2xl font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>+{stock.callGainFromIV}%</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{copy(language, 'Call Kazancı', 'Call Profit')}</div>
            </div>
            <div className="text-center">
              <div className="data-mono text-2xl font-bold" style={{ color: 'oklch(0.75 0.15 75)' }}>{stock.targetProfit}%</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{copy(language, 'Hedef Kar', 'Target Profit')}</div>
            </div>
            <div className="text-center">
              <div className={`data-mono text-2xl font-bold ${rCfg.textClass}`}>{rCfg.label}</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{copy(language, 'Risk', 'Risk')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Yönsel Analiz & Momentum Section */}
      <div className="tactical-card p-4" style={{ borderLeftColor: stock.directionalBias === 'CALL' ? 'oklch(0.78 0.18 160)' : stock.directionalBias === 'PUT' ? 'oklch(0.65 0.22 25)' : 'oklch(0.75 0.15 75)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="heading-condensed text-sm" style={{ color: 'oklch(0.92 0.01 220)' }}>{copy(language, 'YÖNSEL ANALİZ & MOMENTUM GEREKÇESİ', 'DIRECTIONAL ANALYSIS & MOMENTUM RATIONALE')}</div>
          <div className="flex-1 h-[1px]" style={{ background: 'oklch(0.22 0.03 225)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div>
              <div className="text-[10px] uppercase font-bold mb-1" style={{ color: 'oklch(0.45 0.015 225)' }}>{copy(language, 'Ağırlıklı Yön', 'Weighted Direction')}</div>
              <div className="flex items-center gap-2">
                <span className="data-mono text-xl font-bold" style={{ color: stock.directionalBias === 'CALL' ? 'oklch(0.78 0.18 160)' : stock.directionalBias === 'PUT' ? 'oklch(0.65 0.22 25)' : 'oklch(0.75 0.15 75)' }}>
                  {stock.directionalBias}
                </span>
                <div className="flex-1 h-2 bg-slate-800">
                  <div 
                    className="h-full" 
                    style={{ 
                      width: `${stock.biasStrength}%`, 
                      background: stock.directionalBias === 'CALL' ? 'oklch(0.78 0.18 160)' : stock.directionalBias === 'PUT' ? 'oklch(0.65 0.22 25)' : 'oklch(0.75 0.15 75)' 
                    }} 
                  />
                </div>
                <span className="data-mono text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>%{stock.biasStrength}</span>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="text-[10px] uppercase font-bold mb-1" style={{ color: 'oklch(0.45 0.015 225)' }}>{copy(language, 'Analiz Özeti', 'Analysis Summary')}</div>
            <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.85 0.01 220)' }}>
              {copy(
                language,
                `${stock.biasReason} Momentum skoru (${stock.momentumScore}/100) ve RSI-14 (${stock.rsi14}) verileri ışığında, 15 gün öncesinden kurulacak pozisyonlarda ${stock.directionalBias} tarafının %${stock.biasStrength} olasılıkla daha avantajlı olduğu değerlendirilmektedir.`,
                `${stock.biasReason} Based on momentum score (${stock.momentumScore}/100) and RSI-14 (${stock.rsi14}) data, for positions established 15 days in advance, the ${stock.directionalBias} side is assessed to be more advantageous with a ${stock.biasStrength}% probability.`
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Strategy Timeline */}
      <div className="tactical-card p-4">
        <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(0.45 0.015 225)' }}>
          {copy(language, 'Strateji Timeline: IV Expansion Fırsat', 'Strategy Timeline: IV Expansion Opportunity')}
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
              <YAxis yAxisId="right" orientation="right" tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 9, fontFamily: 'JetBrains Mono' }} label={{ value: copy(language, 'Call Fiyatı ($)', 'Call Price ($)'), angle: 90, position: 'insideRight' }} />
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
            {copy(language, '📞 CALL OPSİYON STRATEJİSİ', '📞 CALL OPTION STRATEGY')}
          </div>
          <div className="space-y-2">
            {[
              { label: copy(language, 'Satın Al (15 gün öncesi)', 'Buy (15 days before)'), value: `$${stock.callPremiumBuy.toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
              { label: copy(language, 'Sat (1-2 gün öncesi)', 'Sell (1-2 days before)'), value: `$${stock.callPremiumSell.toFixed(2)}`, color: 'oklch(0.75 0.15 75)' },
              { label: copy(language, 'Brüt Kar', 'Gross Profit'), value: `$${(stock.callPremiumSell - stock.callPremiumBuy).toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
              { label: copy(language, 'Kar Yüzdesi', 'Profit Percentage'), value: `+${stock.callGainFromIV}%`, color: 'oklch(0.78 0.18 160)' },
              { label: copy(language, 'IV Expansion Katkısı', 'IV Expansion Contribution'), value: copy(language, `${stock.expectedIVCrush}% IV crush'tan kaçınma`, `${stock.expectedIVCrush}% avoid IV crush`), color: 'oklch(0.75 0.15 75)' },
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
            {copy(language, '📉 PUT OPSİYON STRATEJİSİ', '📉 PUT OPTION STRATEGY')}
          </div>
          <div className="space-y-2">
            {[
              { label: copy(language, 'Satın Al (15 gün öncesi)', 'Buy (15 days before)'), value: `$${stock.putPremiumBuy.toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
              { label: copy(language, 'Sat (1-2 gün öncesi)', 'Sell (1-2 days before)'), value: `$${stock.putPremiumSell.toFixed(2)}`, color: 'oklch(0.75 0.15 75)' },
              { label: copy(language, 'Brüt Kar', 'Gross Profit'), value: `$${(stock.putPremiumSell - stock.putPremiumBuy).toFixed(2)}`, color: 'oklch(0.78 0.18 160)' },
              { label: copy(language, 'Kar Yüzdesi', 'Profit Percentage'), value: `+${stock.putGainFromIV}%`, color: 'oklch(0.78 0.18 160)' },
              { label: copy(language, 'Directional Hedging', 'Directional Hedging'), value: copy(language, 'Aşağı yönlü korunma sağlar', 'Provides downside protection'), color: 'oklch(0.75 0.15 75)' },
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
          {copy(language, '⚖ RİSK vs ÖDÜL', '⚖ RISK vs REWARD')}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: copy(language, 'Hedef Kar', 'Target Profit'), value: `+${stock.targetProfit}%`, color: 'oklch(0.78 0.18 160)' },
            { label: copy(language, 'Max Zarar', 'Max Loss'), value: `-${stock.maxLoss}%`, color: 'oklch(0.65 0.22 25)' },
            { label: copy(language, 'Ödül/Risk Oranı', 'Reward/Risk Ratio'), value: `${(stock.targetProfit / stock.maxLoss).toFixed(1)}:1`, color: 'oklch(0.75 0.15 75)' },
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
          {copy(language, '✅ ÖNERİLEN STRATEJİ', '✅ RECOMMENDED STRATEGY')}
        </div>
        <div className="text-sm font-semibold mb-2" style={{ color: cfg.color }}>{stock.recommendedStrategy}</div>
        <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.65 0.015 225)' }}>
          {stock.ticker === 'MRVL' && copy(language, "Yüksek momentum + Yüksek IV crush potansiyeli. Long Call satın al 15 gün öncesi, 1-2 gün öncesi sat. IV expansion'dan maksimum faydalanma.", 'High momentum + High IV crush potential. Buy Long Call 15 days before, sell 1-2 days before. Maximize benefit from IV expansion.')}
          {stock.ticker === 'CRWD' && copy(language, 'Güçlü momentum + Orta-yüksek IV crush. Bull Call Spread veya Long Call. Earnings öncesi IV yükselmesinden faydalanma.', 'Strong momentum + Medium-high IV crush. Bull Call Spread or Long Call. Benefit from pre-earnings IV rise.')}
          {stock.ticker === 'AVGO' && copy(language, 'Güvenli play. Düşük IV crush ama stabil. Long Call, IV crush riski minimal. Earnings miss riski düşük.', 'Safe play. Low IV crush but stable. Long Call, IV crush risk is minimal. Earnings miss risk is low.')}
          {stock.ticker === 'COST' && copy(language, 'Çok stabil hisse. Iron Condor tercih edilir. Limited profit ama risk de sınırlı.', 'Very stable stock. Iron Condor preferred. Limited profit but risk is also limited.')}
          {stock.ticker === 'DELL' && copy(language, 'Orta momentum + Orta IV crush. Bull Call Spread optimal. Maliyeti düşürmek için spread kullan.', 'Medium momentum + Medium IV crush. Bull Call Spread optimal. Use spread to reduce cost.')}
          {stock.ticker === 'PANW' && copy(language, 'Aşırı alım (RSI 87). Covered Call veya Put satış. Kar realizasyonu için iyi fırsat.', 'Overbought (RSI 87). Covered Call or Put sale. Good opportunity for profit realization.')}
          {stock.ticker === 'ADSK' && copy(language, 'Nötr momentum. Iron Condor tercih edilir. Earnings miss riski yüksek, spread stratejileri tercih et.', 'Neutral momentum. Iron Condor preferred. Earnings miss risk is high, prefer spread strategies.')}
          {stock.ticker === 'CRM' && copy(language, 'Kırılmış momentum. Kaçın veya çok küçük pozisyon. Earnings miss riski yüksek.', 'Broken momentum. Avoid or very small position. Earnings miss risk is high.')}
          {stock.ticker === 'SNOW' && copy(language, "Yüksek IV crush ama çok riskli. Sell Straddle veya IV crush play tercih et, directional risk'ten kaçın.", 'High IV crush but very risky. Prefer Sell Straddle or IV crush play, avoid directional risk.')}
          {stock.ticker === 'ZS' && copy(language, "Yüksek IV crush ama çok riskli. Kaçın veya IV crush play yap, directional risk'ten kaçın.", 'High IV crush but very risky. Avoid or do IV crush play, avoid directional risk.')}
        </p>
      </div>

      {/* Risk Factors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="tactical-card p-3" style={{ borderLeftColor: 'oklch(0.65 0.22 25)' }}>
          <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.65 0.22 25)' }}>{copy(language, 'Earnings Miss Riski', 'Earnings Miss Risk')}</div>
          <div className="data-mono text-2xl font-bold mb-1" style={{ color: 'oklch(0.65 0.22 25)' }}>{stock.earningsMissRisk}%</div>
          <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>{copy(language, 'Fiyat keskin düşüş riski', 'Risk of sharp price drop')}</div>
        </div>
        <div className="tactical-card p-3" style={{ borderLeftColor: 'oklch(0.75 0.15 75)' }}>
          <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.75 0.15 75)' }}>{copy(language, 'Gap Riski', 'Gap Risk')}</div>
          <div className="data-mono text-2xl font-bold mb-1" style={{ color: 'oklch(0.75 0.15 75)' }}>{stock.gapRisk}%</div>
          <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>{copy(language, 'Earnings sonrası gap açılma riski', 'Risk of gap opening after earnings')}</div>
        </div>
        <div className="tactical-card p-3" style={{ borderLeftColor: 'oklch(0.78 0.18 160)' }}>
          <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.78 0.18 160)' }}>{copy(language, 'Tarihsel Beat Oranı', 'Historical Beat Rate')}</div>
          <div className="data-mono text-2xl font-bold mb-1" style={{ color: 'oklch(0.78 0.18 160)' }}>%{stock.beatRate}</div>
          <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>{copy(language, 'Son 4 çeyrekte beat oranı', 'Beat rate over the last 4 quarters')}</div>
        </div>
      </div>
    </div>
  );
}
