/*
 * DESIGN: "Precision Finance" — Sector Tab
 * Macro sector analysis, IT spending breakdown, growth drivers
 */

import { sectorMacroData, stocksData, type StockData } from '@/lib/stockData';
import { getTooltipLabel } from '@/lib/chartTooltip';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const itSpendingData = [
  { name: 'Veri Merkezi', value: 653, growth: 31.7, color: 'oklch(0.78 0.18 160)' },
  { name: 'Yazılım', value: 1434, growth: 14.7, color: '#4ade80' },
  { name: 'BT Hizmetleri', value: 1867, growth: 8.7, color: 'oklch(0.75 0.15 75)' },
  { name: 'Cihazlar', value: 836, growth: 6.1, color: 'oklch(0.6 0.12 250)' },
  { name: 'İletişim', value: 1365, growth: 4.7, color: 'oklch(0.7 0.15 300)' },
];

const sectorStockMap = [
  { sector: 'AI Yarı İletken', tickers: ['MRVL', 'AVGO', 'DELL'], color: 'oklch(0.78 0.18 160)' },
  { sector: 'Siber Güvenlik', tickers: ['CRWD', 'PANW', 'ZS'], color: '#4ade80' },
  { sector: 'Bulut Yazılım', tickers: ['SNOW', 'CRM', 'ADSK'], color: 'oklch(0.75 0.15 75)' },
  { sector: 'Defansif', tickers: ['COST'], color: 'oklch(0.6 0.12 250)' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const resolvedLabel = getTooltipLabel(payload, label);
    return (
      <div className="px-3 py-2 border" style={{ background: 'oklch(0.15 0.03 225)', borderColor: 'oklch(0.25 0.03 225)', borderRadius: 0 }}>
        <p className="data-mono text-xs font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{resolvedLabel}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="data-mono text-xs" style={{ color: p.fill || p.color }}>{p.name}: {p.value}{p.unit || ''}</p>
        ))}
      </div>
    );
  }
  return null;
};

interface Props {
  stocks?: StockData[];
}

export default function SectorTab({ stocks = stocksData }: Props) {
  const avgMomentumBySector = sectorStockMap.map(s => {
    const sectorStocks = stocks.filter(st => s.tickers.includes(st.ticker));
    const avg = sectorStocks.length
      ? sectorStocks.reduce((sum, st) => sum + st.momentumScore, 0) / sectorStocks.length
      : 0;
    return { sector: s.sector, momentum: Math.round(avg), color: s.color };
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5" style={{ background: 'oklch(0.6 0.12 250)' }} />
          <h1 className="heading-condensed text-xl" style={{ color: 'oklch(0.92 0.01 220)' }}>
            SEKTÖREL MAKRO ANALİZ
          </h1>
        </div>
        <p className="text-sm ml-3" style={{ color: 'oklch(0.5 0.015 225)' }}>
          Gartner & Deloitte 2026 Tahminleri · Küresel BT Harcamaları $6.15T
        </p>
      </div>

      {/* Gartner IT Spending */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.78 0.18 160)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            KÜRESEL BT HARCAMALARI 2026 (GARTNER)
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="tactical-card p-4" style={{ height: '300px' }}>
            <div className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'oklch(0.45 0.015 225)' }}>
              Harcama Büyüklüğü ($M)
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={itSpendingData} margin={{ top: 5, right: 10, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" />
                <XAxis dataKey="name" tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 9, fontFamily: 'JetBrains Mono' }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Harcama ($M)" maxBarSize={40}>
                  {itSpendingData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="tactical-card p-4" style={{ height: '300px' }}>
            <div className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'oklch(0.45 0.015 225)' }}>
              YoY Büyüme Oranları (%)
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={itSpendingData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" horizontal={false} />
                <XAxis type="number" unit="%" tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'oklch(0.65 0.01 220)', fontSize: 10, fontFamily: 'JetBrains Mono' }} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="growth" name="Büyüme (%)" maxBarSize={18}>
                  {itSpendingData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sector Cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.75 0.15 75)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            SEKTÖR BAZLI GÖRÜNÜM
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(sectorMacroData).map((sector) => (
            <div key={sector.name} className="tactical-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="heading-condensed text-base" style={{ color: 'oklch(0.85 0.01 220)' }}>{sector.name}</h3>
                <span className={`text-xs font-bold px-2 py-0.5 border ${
                  sector.outlook === 'BULLISH' ? 'badge-strong' :
                  sector.outlook === 'NEUTRAL' ? 'badge-warning' : 'badge-danger'
                }`}>
                  {sector.outlook === 'BULLISH' ? '↑ YÜKSELIŞ' : sector.outlook === 'NEUTRAL' ? '→ NÖTR' : '↓ DÜŞÜŞ'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>Pazar Büyüklüğü 2026</div>
                  <div className="data-mono text-xl font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{sector.marketSize2026}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>Büyüme Oranı</div>
                  <div className="data-mono text-xl font-bold" style={{ color: 'oklch(0.75 0.15 75)' }}>{sector.growthRate}</div>
                </div>
              </div>
              <div className="mb-2">
                <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>Ana Sürücü</div>
                <div className="text-sm" style={{ color: 'oklch(0.7 0.01 220)' }}>{sector.keyDriver}</div>
              </div>
              <div className="text-xs italic" style={{ color: 'oklch(0.38 0.015 225)' }}>Kaynak: {sector.source}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Momentum Comparison */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.7 0.15 300)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            SEKTÖR BAZLI ORT. MOMENTUM SKORU
          </h2>
        </div>
        <div className="tactical-card p-4" style={{ height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={avgMomentumBySector} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" />
              <XAxis dataKey="sector" tick={{ fill: 'oklch(0.55 0.015 225)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <YAxis domain={[0, 100]} tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="momentum" name="Ort. Momentum" maxBarSize={60}>
                {avgMomentumBySector.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Semiconductor Deep Dive */}
      <div className="tactical-card p-5" style={{ borderLeftColor: 'oklch(0.78 0.18 160)', borderLeftWidth: '4px' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="heading-condensed text-base" style={{ color: 'oklch(0.78 0.18 160)' }}>
            ◈ AI YARI İLETKEN — DERİN BAĞLAM
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.45 0.015 225)' }}>Deloitte 2026 Tahmini</div>
            <div className="data-mono text-lg font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>~$500B</div>
            <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>AI çip geliri (küresel yarı iletken pazarının ~%50'si)</div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.45 0.015 225)' }}>Sunucu Harcaması Büyümesi</div>
            <div className="data-mono text-lg font-bold" style={{ color: 'oklch(0.75 0.15 75)' }}>+36.9%</div>
            <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>AI workload sunucuları (Gartner 2026)</div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.45 0.015 225)' }}>Hyperscaler AI CAPEX</div>
            <div className="data-mono text-lg font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>Hızlanıyor</div>
            <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>ASML: "Çip talebi arzı geçiyor" — Nisan 2026</div>
          </div>
        </div>
        <div className="mt-3 text-sm leading-relaxed" style={{ color: 'oklch(0.65 0.015 225)' }}>
          Yapay zeka altyapısına yönelik küresel yatırım ivmesi 2026'da da sürmektedir. Hyperscaler bulut sağlayıcıları 
          (Amazon, Google, Microsoft, Meta) kendi özel AI çiplerini tasarlatmakta; bu durum MRVL ve AVGO gibi özel ASIC 
          tasarım şirketlerine güçlü bir yapısal talep yaratmaktadır. ASML CEO'su Nisan 2026'da "çip talebinin arzı geçtiğini" 
          açıkça ifade etmiştir — bu, sektörün döngüsel değil yapısal bir büyüme içinde olduğunun en güçlü sinyalidir.
        </div>
      </div>
    </div>
  );
}
