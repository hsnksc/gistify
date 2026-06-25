/*
 * DESIGN: "Precision Finance" — Sector Tab
 * Macro sector analysis, IT spending breakdown, growth drivers
 */

import { sectorMacroData, stocksData, type StockData } from '@/lib/stockData';
import { getTooltipLabel } from '@/lib/chartTooltip';
import { copy } from '@/lib/i18n';
import type { AppLanguage } from '@/lib/i18n';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

interface Props {
  stocks?: StockData[];
  language: AppLanguage;
}

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

export default function SectorTab({ stocks = stocksData, language }: Props) {
  const itSpendingData = [
    {
      name: copy(language, 'Veri Merkezi', 'Data Center'),
      axisLabel: copy(language, 'Veri Mrk.', 'Data Ctr'),
      value: 653,
      growth: 31.7,
      color: 'oklch(0.78 0.18 160)',
    },
    {
      name: copy(language, 'Yazılım', 'Software'),
      axisLabel: copy(language, 'Yazilim', 'Software'),
      value: 1434,
      growth: 14.7,
      color: '#4ade80',
    },
    {
      name: copy(language, 'BT Hizmetleri', 'IT Services'),
      axisLabel: copy(language, 'BT Hiz.', 'IT Svcs'),
      value: 1867,
      growth: 8.7,
      color: 'oklch(0.75 0.15 75)',
    },
    {
      name: copy(language, 'Cihazlar', 'Devices'),
      axisLabel: copy(language, 'Cihaz', 'Devices'),
      value: 836,
      growth: 6.1,
      color: 'oklch(0.6 0.12 250)',
    },
    {
      name: copy(language, 'İletişim', 'Communications'),
      axisLabel: copy(language, 'Iletisim', 'Comms'),
      value: 1365,
      growth: 4.7,
      color: 'oklch(0.7 0.15 300)',
    },
  ];

  const sectorStockMap = [
    {
      sector: copy(language, 'AI Yarı İletken', 'AI Semiconductor'),
      axisLabel: copy(language, 'AI Yari Iltk.', 'AI Semi'),
      tickers: ['MRVL', 'AVGO', 'DELL'],
      color: 'oklch(0.78 0.18 160)',
    },
    {
      sector: copy(language, 'Siber Güvenlik', 'Cybersecurity'),
      axisLabel: copy(language, 'Siber Guv.', 'Cybersec'),
      tickers: ['CRWD', 'PANW', 'ZS'],
      color: '#4ade80',
    },
    {
      sector: copy(language, 'Bulut Yazılım', 'Cloud Software'),
      axisLabel: copy(language, 'Bulut Yzm.', 'Cloud SW'),
      tickers: ['SNOW', 'CRM', 'ADSK'],
      color: 'oklch(0.75 0.15 75)',
    },
    {
      sector: copy(language, 'Defansif', 'Defensive'),
      axisLabel: copy(language, 'Defansif', 'Defensive'),
      tickers: ['COST'],
      color: 'oklch(0.6 0.12 250)',
    },
  ];

  const avgMomentumBySector = sectorStockMap.map(s => {
    const sectorStocks = stocks.filter(st => s.tickers.includes(st.ticker));
    const avg = sectorStocks.length
      ? sectorStocks.reduce((sum, st) => sum + st.momentumScore, 0) / sectorStocks.length
      : 0;
    return {
      sector: s.sector,
      axisLabel: s.axisLabel,
      momentum: Math.round(avg),
      color: s.color,
    };
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5" style={{ background: 'oklch(0.6 0.12 250)' }} />
          <h1 className="heading-condensed text-xl" style={{ color: 'oklch(0.92 0.01 220)' }}>
            {copy(language, 'SEKTÖREL MAKRO ANALİZ', 'SECTORAL MACRO ANALYSIS')}
          </h1>
        </div>
        <p className="text-sm ml-3" style={{ color: 'oklch(0.5 0.015 225)' }}>
          {copy(language, 'Gartner & Deloitte 2026 Tahminleri · Küresel BT Harcamaları $6.15T', 'Gartner & Deloitte 2026 Forecasts · Global IT Spending $6.15T')}
        </p>
      </div>

      {/* Gartner IT Spending */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.78 0.18 160)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            {copy(language, 'KÜRESEL BT HARCAMALARI 2026 (GARTNER)', 'GLOBAL IT SPENDING 2026 (GARTNER)')}
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="tactical-card p-4" style={{ height: '300px' }}>
            <div className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'oklch(0.45 0.015 225)' }}>
              {copy(language, 'Harcama Büyüklüğü ($M)', 'Spending Size ($M)')}
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={itSpendingData} margin={{ top: 5, right: 10, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" />
                <XAxis
                  dataKey="axisLabel"
                  tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  tickMargin={12}
                />
                <YAxis
                  tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  tickMargin={8}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name={copy(language, 'Harcama ($M)', 'Spending ($M)')} maxBarSize={40}>
                  {itSpendingData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="tactical-card p-4" style={{ height: '300px' }}>
            <div className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'oklch(0.45 0.015 225)' }}>
              {copy(language, 'YoY Büyüme Oranları (%)', 'YoY Growth Rates (%)')}
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={itSpendingData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" horizontal={false} />
                <XAxis
                  type="number"
                  unit="%"
                  tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  tickMargin={8}
                />
                <YAxis
                  type="category"
                  dataKey="axisLabel"
                  tick={{ fill: 'oklch(0.65 0.01 220)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  width={84}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="growth" name={copy(language, 'Büyüme (%)', 'Growth (%)')} maxBarSize={18}>
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
            {copy(language, 'SEKTÖR BAZLI GÖRÜNÜM', 'SECTOR-BASED OUTLOOK')}
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
                  {sector.outlook === 'BULLISH' ? copy(language, '↑ YÜKSELIŞ', '↑ BULLISH') : sector.outlook === 'NEUTRAL' ? copy(language, '→ NÖTR', '→ NEUTRAL') : copy(language, '↓ DÜŞÜŞ', '↓ BEARISH')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{copy(language, 'Pazar Büyüklüğü 2026', 'Market Size 2026')}</div>
                  <div className="data-mono text-xl font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{sector.marketSize2026}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{copy(language, 'Büyüme Oranı', 'Growth Rate')}</div>
                  <div className="data-mono text-xl font-bold" style={{ color: 'oklch(0.75 0.15 75)' }}>{sector.growthRate}</div>
                </div>
              </div>
              <div className="mb-2">
                <div className="text-xs" style={{ color: 'oklch(0.45 0.015 225)' }}>{copy(language, 'Ana Sürücü', 'Main Driver')}</div>
                <div className="text-sm" style={{ color: 'oklch(0.7 0.01 220)' }}>{sector.keyDriver}</div>
              </div>
              <div className="text-xs italic" style={{ color: 'oklch(0.38 0.015 225)' }}>{copy(language, 'Kaynak:', 'Source:')} {sector.source}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Momentum Comparison */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: 'oklch(0.7 0.15 300)' }} />
          <h2 className="heading-condensed text-base" style={{ color: 'oklch(0.92 0.01 220)' }}>
            {copy(language, 'SEKTÖR BAZLI ORT. MOMENTUM SKORU', 'SECTOR-BASED AVG. MOMENTUM SCORE')}
          </h2>
        </div>
        <div className="tactical-card p-4" style={{ height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={avgMomentumBySector} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" />
              <XAxis
                dataKey="axisLabel"
                tick={{ fill: 'oklch(0.55 0.015 225)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                tickMargin={10}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: 'oklch(0.45 0.015 225)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                tickMargin={8}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="momentum" name={copy(language, 'Ort. Momentum', 'Avg. Momentum')} maxBarSize={60}>
                {avgMomentumBySector.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Semiconductor Deep Dive */}
      <div className="tactical-card p-6" style={{ borderLeftColor: 'oklch(0.78 0.18 160)', borderLeftWidth: '4px' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="heading-condensed text-base" style={{ color: 'oklch(0.78 0.18 160)' }}>
            {copy(language, '◈ AI YARI İLETKEN — DERİN BAĞLAM', '◈ AI SEMICONDUCTOR — DEEP CONTEXT')}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.45 0.015 225)' }}>{copy(language, 'Deloitte 2026 Tahmini', 'Deloitte 2026 Forecast')}</div>
            <div className="data-mono text-lg font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>~$500B</div>
            <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>{copy(language, "AI çip geliri (küresel yarı iletken pazarının ~%50'si)", 'AI chip revenue (~50% of global semiconductor market)')}</div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.45 0.015 225)' }}>{copy(language, 'Sunucu Harcaması Büyümesi', 'Server Spending Growth')}</div>
            <div className="data-mono text-lg font-bold" style={{ color: 'oklch(0.75 0.15 75)' }}>+36.9%</div>
            <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>{copy(language, 'AI workload sunucuları (Gartner 2026)', 'AI workload servers (Gartner 2026)')}</div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: 'oklch(0.45 0.015 225)' }}>{copy(language, 'Hyperscaler AI CAPEX', 'Hyperscaler AI CAPEX')}</div>
            <div className="data-mono text-lg font-bold" style={{ color: 'oklch(0.78 0.18 160)' }}>{copy(language, 'Hızlanıyor', 'Accelerating')}</div>
            <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>{copy(language, 'ASML: "Çip talebi arzı geçiyor" — Nisan 2026', 'ASML: "Chip demand is exceeding supply" — April 2026')}</div>
          </div>
        </div>
        <div className="mt-3 text-sm leading-relaxed" style={{ color: 'oklch(0.65 0.015 225)' }}>
          {copy(
            language,
            "Yapay zeka altyapısına yönelik küresel yatırım ivmesi 2026'da da sürmektedir. Hyperscaler bulut sağlayıcıları (Amazon, Google, Microsoft, Meta) kendi özel AI çiplerini tasarlatmakta; bu durum MRVL ve AVGO gibi özel ASIC tasarım şirketlerine güçlü bir yapısal talep yaratmaktadır. ASML CEO'su Nisan 2026'da \"çip talebinin arzı geçtiğini\" açıkça ifade etmiştir — bu, sektörün döngüsel değil yapısal bir büyüme içinde olduğunun en güçlü sinyalidir.",
            'Global investment momentum towards AI infrastructure continues in 2026. Hyperscaler cloud providers (Amazon, Google, Microsoft, Meta) are designing their own custom AI chips; this creates strong structural demand for custom ASIC design companies like MRVL and AVGO. ASML\'s CEO clearly stated in April 2026 that "chip demand is exceeding supply" — this is the strongest signal that the sector is in structural rather than cyclical growth.'
          )}
        </div>
      </div>
    </div>
  );
}

