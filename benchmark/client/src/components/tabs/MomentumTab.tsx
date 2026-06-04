/*
 * DESIGN: "Precision Finance" — Momentum Tab
 * Full momentum scoring table + scatter chart + volume analysis
 */

import { stocksData, signalConfig, riskConfig } from '@/lib/stockData';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  BarChart, Bar, Legend,
} from 'recharts';

interface Props {
  onStockClick: (ticker: string) => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0]?.payload;
    return (
      <div className="px-3 py-2 border" style={{ background: 'oklch(0.15 0.03 225)', borderColor: 'oklch(0.25 0.03 225)', borderRadius: 0 }}>
        <p className="data-mono text-xs font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{d?.ticker}</p>
        <p className="data-mono text-xs" style={{ color: 'oklch(0.75 0.15 75)' }}>6A Getiri: {d?.x}%</p>
        <p className="data-mono text-xs" style={{ color: 'oklch(0.78 0.18 160)' }}>Momentum: {d?.y}</p>
        <p className="data-mono text-xs" style={{ color: 'oklch(0.65 0.22 25)' }}>Beat İht: %{d?.beat}</p>
      </div>
    );
  }
  return null;
};

export default function MomentumTab({ onStockClick }: Props) {
  const sorted = [...stocksData].sort((a, b) => b.momentumScore - a.momentumScore);

  const scatterData = stocksData.map(s => ({
    ticker: s.ticker,
    x: s.priceChange6M,
    y: s.momentumScore,
    beat: s.earningsBeatProbability,
    signal: s.signal,
  }));

  const volumeData = stocksData.map(s => ({
    ticker: s.ticker,
    mevcut: s.volumeCurrent,
    ortalama: s.volumeAvg3M,
  }));

  const getScatterColor = (signal: string) => {
    if (signal === 'STRONG_BUY') return 'oklch(0.78 0.18 160)';
    if (signal === 'BUY') return '#4ade80';
    if (signal === 'NEUTRAL') return 'oklch(0.75 0.15 75)';
    return 'oklch(0.65 0.22 25)';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5" style={{ background: 'oklch(0.78 0.18 160)' }} />
          <h1 className="heading-condensed text-xl" style={{ color: 'oklch(0.92 0.01 220)' }}>
            GERÇEK MOMENTUM SKORLAMASI
          </h1>
        </div>
        <p className="text-sm ml-3" style={{ color: 'oklch(0.5 0.015 225)' }}>
          Fiyat + Hacim + Sektörel Destek + Korelasyon Uyumu + Analist Konsensüsü
        </p>
      </div>

      {/* Methodology */}
      <div className="p-4 border-l-2" style={{ borderColor: 'oklch(0.75 0.15 75)', background: 'oklch(0.75 0.15 75 / 0.05)' }}>
        <div className="text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'oklch(0.75 0.15 75)' }}>
          Metodoloji
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Fiyat Momentum', weight: '25%', desc: '6A + 1A getiri' },
            { label: 'Hacim Analizi', weight: '20%', desc: 'Fiyat-hacim uyumu' },
            { label: 'Sektörel Destek', weight: '20%', desc: 'ETF korelasyonu' },
            { label: 'Analist Konsensüs', weight: '20%', desc: 'Buy % + hedef' },
            { label: 'Earnings Geçmişi', weight: '15%', desc: 'Beat oranı + büyüme' },
          ].map(m => (
            <div key={m.label} className="text-center">
              <div className="data-mono text-lg font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{m.weight}</div>
              <div className="text-xs font-semibold" style={{ color: 'oklch(0.75 0.01 220)' }}>{m.label}</div>
              <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Scoring Table */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.78 0.18 160)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            TAM SKORLAMA TABLOSU
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '2px solid oklch(0.22 0.03 225)', background: 'oklch(0.13 0.025 230)' }}>
                {['Sıra', 'Hisse', 'Sinyal', 'Momentum', 'Beat İht.', '6A Getiri', 'RSI', 'Hacim', 'Analist Buy%', 'Risk', 'Earnings'].map(h => (
                  <th key={h} className="px-3 py-2 text-left heading-condensed text-xs tracking-wider" style={{ color: 'oklch(0.55 0.015 225)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((stock, i) => {
                const cfg = signalConfig[stock.signal];
                const rCfg = riskConfig[stock.riskLevel];
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
                      <div>
                        <span className="data-mono text-sm font-bold" style={{ color: 'oklch(0.92 0.01 220)' }}>{stock.ticker}</span>
                        <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{stock.sector}</div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs font-bold px-2 py-0.5 border ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`} style={{ borderRadius: 0 }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="data-mono text-sm font-bold" style={{
                          color: stock.momentumScore >= 80 ? 'oklch(0.78 0.18 160)' :
                                 stock.momentumScore >= 60 ? 'oklch(0.75 0.15 75)' :
                                 'oklch(0.65 0.22 25)'
                        }}>
                          {stock.momentumScore}
                        </span>
                        <div style={{ width: '50px', height: '4px', background: 'oklch(0.2 0.03 225)' }}>
                          <div style={{
                            width: `${stock.momentumScore}%`,
                            height: '100%',
                            background: stock.momentumScore >= 80 ? 'oklch(0.78 0.18 160)' :
                                        stock.momentumScore >= 60 ? 'oklch(0.75 0.15 75)' :
                                        'oklch(0.65 0.22 25)',
                          }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.78 0.18 160)' }}>
                        %{stock.earningsBeatProbability}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{
                        color: stock.priceChange6M > 0 ? 'oklch(0.78 0.18 160)' : 'oklch(0.65 0.22 25)'
                      }}>
                        {stock.priceChange6M > 0 ? '+' : ''}{stock.priceChange6M}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs" style={{
                        color: stock.rsi14 > 75 ? 'oklch(0.65 0.22 25)' :
                               stock.rsi14 < 35 ? 'oklch(0.75 0.15 75)' :
                               'oklch(0.75 0.01 220)'
                      }}>
                        {stock.rsi14}
                        {stock.rsi14 > 75 && <span className="ml-1 text-xs">⚠</span>}
                        {stock.rsi14 < 35 && <span className="ml-1 text-xs">↓</span>}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs font-semibold ${
                        stock.volumeStatus === 'VERY_HIGH' ? 'text-emerald-400' :
                        stock.volumeStatus === 'HIGH' ? 'text-green-400' :
                        stock.volumeStatus === 'LOW' ? 'text-red-400' :
                        'text-amber-400'
                      }`}>
                        {stock.volumeStatus === 'VERY_HIGH' ? 'Çok Yüksek' :
                         stock.volumeStatus === 'HIGH' ? 'Yüksek' :
                         stock.volumeStatus === 'LOW' ? 'Düşük' : 'Normal'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs" style={{ color: 'oklch(0.75 0.01 220)' }}>
                        %{stock.analystBuyConsensus}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`data-mono text-xs font-semibold ${rCfg.textClass}`}>
                        {rCfg.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs" style={{ color: 'oklch(0.75 0.15 75)' }}>
                        {stock.earningsDate}
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
        {/* Scatter: 6A Getiri vs Momentum */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4" style={{ background: 'oklch(0.6 0.12 250)' }} />
            <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
              6A GETİRİ vs MOMENTUM SKORU
            </h2>
          </div>
          <div className="tactical-card p-4" style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" />
                <XAxis
                  dataKey="x"
                  name="6A Getiri"
                  unit="%"
                  tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  label={{ value: '6A Getiri (%)', position: 'insideBottom', offset: -10, fill: 'oklch(0.45 0.015 225)', fontSize: 10 }}
                />
                <YAxis
                  dataKey="y"
                  name="Momentum"
                  tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  label={{ value: 'Momentum', angle: -90, position: 'insideLeft', fill: 'oklch(0.45 0.015 225)', fontSize: 10 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Scatter data={scatterData} name="Hisseler">
                  {scatterData.map((entry, i) => (
                    <Cell key={i} fill={getScatterColor(entry.signal)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Comparison */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4" style={{ background: 'oklch(0.75 0.15 75)' }} />
            <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
              HACİM ANALİZİ (MEVCUT vs 3A ORT.)
            </h2>
          </div>
          <div className="tactical-card p-4" style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" />
                <XAxis dataKey="ticker" tick={{ fill: 'oklch(0.55 0.015 225)', fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 600 }} />
                <YAxis tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <Tooltip content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="px-3 py-2 border" style={{ background: 'oklch(0.15 0.03 225)', borderColor: 'oklch(0.25 0.03 225)', borderRadius: 0 }}>
                        <p className="data-mono text-xs font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{label}</p>
                        {payload.map((p: any, i: number) => (
                          <p key={i} className="data-mono text-xs" style={{ color: p.fill }}>{p.name}: {p.value}M</p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: 'oklch(0.55 0.015 225)' }} />
                <Bar dataKey="mevcut" name="Mevcut Hacim" fill="oklch(0.78 0.18 160)" maxBarSize={20} />
                <Bar dataKey="ortalama" name="3A Ortalama" fill="oklch(0.75 0.15 75 / 0.6)" maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
