/*
 * DESIGN: "Precision Finance" — Risk Matrix Tab
 * 2D risk matrix, risk breakdown, portfolio strategy
 */

import { stocksData, signalConfig, riskConfig, type StockData } from '@/lib/stockData';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

interface Props {
  onStockClick: (ticker: string) => void;
  stocks?: StockData[];
}

const riskOrder = { LOW: 1, MEDIUM: 2, HIGH: 3, VERY_HIGH: 4 };

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0]?.payload;
    return (
      <div className="px-3 py-2 border" style={{ background: 'oklch(0.15 0.03 225)', borderColor: 'oklch(0.25 0.03 225)', borderRadius: 0 }}>
        <p className="data-mono text-xs font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{d?.ticker}</p>
        <p className="data-mono text-xs" style={{ color: 'oklch(0.75 0.15 75)' }}>Beat İhtimali: %{d?.x}</p>
        <p className="data-mono text-xs" style={{ color: 'oklch(0.78 0.18 160)' }}>Momentum: {d?.y}</p>
        <p className="data-mono text-xs" style={{ color: 'oklch(0.65 0.22 25)' }}>Risk: {d?.riskLabel}</p>
      </div>
    );
  }
  return null;
};

export default function RiskTab({ onStockClick, stocks = stocksData }: Props) {
  const matrixData = stocks.map(s => ({
    ticker: s.ticker,
    x: s.earningsBeatProbability,
    y: s.momentumScore,
    risk: riskOrder[s.riskLevel],
    riskLabel: riskConfig[s.riskLevel].label,
    signal: s.signal,
  }));

  const getColor = (signal: string) => {
    if (signal === 'STRONG_BUY') return 'oklch(0.78 0.18 160)';
    if (signal === 'BUY') return '#4ade80';
    if (signal === 'NEUTRAL') return 'oklch(0.75 0.15 75)';
    return 'oklch(0.65 0.22 25)';
  };

  // Portfolio strategy groups
  const strongBuy = stocks.filter(s => s.signal === 'STRONG_BUY');
  const buy = stocks.filter(s => s.signal === 'BUY');
  const neutral = stocks.filter(s => s.signal === 'NEUTRAL');
  const sell = stocks.filter(s => s.signal === 'SELL' || s.signal === 'STRONG_SELL');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5" style={{ background: 'oklch(0.65 0.22 25)' }} />
          <h1 className="heading-condensed text-xl" style={{ color: 'oklch(0.92 0.01 220)' }}>
            RİSK MATRİSİ
          </h1>
        </div>
        <p className="text-sm ml-3" style={{ color: 'oklch(0.5 0.015 225)' }}>
          Beat İhtimali × Momentum Skoru · Renk = Sinyal Gücü
        </p>
      </div>

      {/* Risk Matrix Scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4" style={{ background: 'oklch(0.65 0.22 25)' }} />
            <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
              BEAT İHTİMALİ vs MOMENTUM
            </h2>
          </div>
          <div className="tactical-card p-4 relative" style={{ height: '360px' }}>
            {/* Quadrant labels */}
            <div className="absolute top-8 right-8 text-xs font-semibold" style={{ color: 'oklch(0.78 0.18 160 / 0.5)' }}>
              İDEAL BÖLGE ↗
            </div>
            <div className="absolute bottom-12 left-8 text-xs font-semibold" style={{ color: 'oklch(0.65 0.22 25 / 0.5)' }}>
              RİSKLİ BÖLGE ↙
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" />
                <XAxis
                  dataKey="x"
                  name="Beat İhtimali"
                  unit="%"
                  domain={[30, 85]}
                  tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  label={{ value: 'Beat İhtimali (%)', position: 'insideBottom', offset: -15, fill: 'oklch(0.45 0.015 225)', fontSize: 10 }}
                />
                <YAxis
                  dataKey="y"
                  name="Momentum"
                  domain={[20, 100]}
                  tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  label={{ value: 'Momentum', angle: -90, position: 'insideLeft', fill: 'oklch(0.45 0.015 225)', fontSize: 10 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Scatter data={matrixData} name="Hisseler">
                  {matrixData.map((entry, i) => (
                    <Cell key={i} fill={getColor(entry.signal)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Summary */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4" style={{ background: 'oklch(0.75 0.15 75)' }} />
            <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
              RİSK DAĞILIMI
            </h2>
          </div>
          <div className="space-y-2">
            {[...stocks].sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]).map(stock => {
              const cfg = signalConfig[stock.signal];
              const rCfg = riskConfig[stock.riskLevel];
              return (
                <button
                  key={stock.ticker}
                  onClick={() => onStockClick(stock.ticker)}
                  className="w-full tactical-card p-3 text-left"
                  style={{ borderLeftColor: cfg.color }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="data-mono text-sm font-bold" style={{ color: 'oklch(0.92 0.01 220)' }}>{stock.ticker}</span>
                      <span className="text-xs" style={{ color: 'oklch(0.5 0.015 225)' }}>{stock.sector}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`data-mono text-xs font-bold ${rCfg.textClass}`}>{rCfg.label} Risk</span>
                      <span className={`text-xs font-bold px-2 py-0.5 border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`} style={{ borderRadius: 0 }}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs" style={{ color: 'oklch(0.4 0.015 225)' }}>Momentum</span>
                        <span className="data-mono text-xs" style={{ color: cfg.color }}>{stock.momentumScore}</span>
                      </div>
                      <div className="score-bar">
                        <div className="score-bar-fill" style={{ width: `${stock.momentumScore}%`, background: cfg.color }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs" style={{ color: 'oklch(0.4 0.015 225)' }}>Beat İht.</div>
                      <div className="data-mono text-xs font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>%{stock.earningsBeatProbability}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs" style={{ color: 'oklch(0.4 0.015 225)' }}>Implied</div>
                      <div className="data-mono text-xs font-bold" style={{ color: 'oklch(0.75 0.15 75)' }}>±{stock.impliedMove}%</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Portfolio Strategy */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.78 0.18 160)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            PORTFÖY STRATEJİSİ ÖNERİSİ
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              title: 'GÜÇLÜ AL',
              stocks: strongBuy,
              color: 'oklch(0.78 0.18 160)',
              desc: 'Earnings öncesi pozisyon açılabilir. Yüksek momentum + güçlü sektörel destek.',
              action: 'Pozisyon Aç',
            },
            {
              title: 'AL',
              stocks: buy,
              color: '#4ade80',
              desc: 'Earnings öncesi dikkatli pozisyon. İyi fundamentaller, makul risk.',
              action: 'Küçük Pozisyon',
            },
            {
              title: 'NÖTR',
              stocks: neutral,
              color: 'oklch(0.75 0.15 75)',
              desc: 'Earnings sonrasına kadar bekle. Karışık sinyaller, yüksek "haberle sat" riski.',
              action: 'İzle',
            },
            {
              title: 'SAT / GÜÇLÜ SAT',
              stocks: sell,
              color: 'oklch(0.65 0.22 25)',
              desc: 'Kırılmış momentum, zayıf sektörel destek. Earnings öncesi kaçın.',
              action: 'Kaçın',
            },
          ].map(group => (
            <div key={group.title} className="tactical-card p-4" style={{ borderLeftColor: group.color }}>
              <div className="heading-condensed text-sm mb-1" style={{ color: group.color }}>{group.title}</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {group.stocks.map(s => (
                  <button
                    key={s.ticker}
                    onClick={() => onStockClick(s.ticker)}
                    className="data-mono text-xs font-bold px-1.5 py-0.5"
                    style={{ background: `${group.color}20`, color: group.color, border: `1px solid ${group.color}40`, borderRadius: 0 }}
                  >
                    {s.ticker}
                  </button>
                ))}
              </div>
              <p className="text-xs mb-2" style={{ color: 'oklch(0.55 0.015 225)', lineHeight: 1.5 }}>{group.desc}</p>
              <div className="text-xs font-bold" style={{ color: group.color }}>→ {group.action}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Risk Factors */}
      <div className="tactical-card p-5" style={{ borderLeftColor: 'oklch(0.65 0.22 25)', borderLeftWidth: '4px' }}>
        <div className="heading-condensed text-base mb-3" style={{ color: 'oklch(0.65 0.22 25)' }}>
          ⚠ GENEL RİSK FAKTÖRLERİ
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {[
            {
              title: 'RSI Aşırı Alım',
              desc: 'PANW (RSI 78) ve CRWD (RSI 72) aşırı alım bölgesine yakın. Earnings iyi gelse bile "haberle sat" dinamiği devreye girebilir.',
              color: 'oklch(0.75 0.15 75)',
            },
            {
              title: 'Hacim-Fiyat Uyumsuzluğu',
              desc: 'CRM yüksek hacimde düşüş gösteriyor (distribution sinyali). DELL ise fiyat yükselirken hacim düşüyor (yorgunluk sinyali).',
              color: 'oklch(0.65 0.22 25)',
            },
            {
              title: 'Kırılmış Momentum',
              desc: 'SNOW (-35%), CRM (-33%), ZS (-40%) son 6 ayda ciddi kayıp yaşadı. Earnings iyi gelse bile güçlü toparlanma için güçlü katalizör gerekiyor.',
              color: 'oklch(0.65 0.22 25)',
            },
          ].map(risk => (
            <div key={risk.title}>
              <div className="text-xs font-bold mb-1" style={{ color: risk.color }}>{risk.title}</div>
              <p className="text-xs leading-relaxed" style={{ color: 'oklch(0.6 0.015 225)' }}>{risk.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
