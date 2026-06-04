/*
 * DESIGN: "Precision Finance" — Tactical Intelligence Dashboard
 * Layout: Fixed left sidebar + scrollable right content
 * Colors: Navy base, signal green primary, amber accent, red alert
 * Typography: Barlow Condensed (headings), JetBrains Mono (data), Inter (body)
 */

import { useState, useEffect, useRef } from 'react';
import { stocksData, earningsCalendar, sectorMacroData, signalConfig, riskConfig, type SignalLevel } from '@/lib/stockData';
import OverviewTab from '@/components/tabs/OverviewTab';
import StockDetailTab from '@/components/tabs/StockDetailTab';
import MomentumTab from '@/components/tabs/MomentumTab';
import CalendarTab from '@/components/tabs/CalendarTab';
import SectorTab from '@/components/tabs/SectorTab';
import RiskTab from '@/components/tabs/RiskTab';
import IVCrushTab from '@/components/tabs/IVCrushTab';
import OptionDetailTab from '@/components/tabs/OptionDetailTab';
import JuneEarningsTab from '@/components/tabs/JuneEarningsTab';
import JuneOptionDetailTab from '@/components/tabs/JuneOptionDetailTab';

type TabId = 'overview' | 'momentum' | 'stocks' | 'calendar' | 'sector' | 'risk' | 'ivcrush' | 'optiondetail' | 'juneearnings' | 'juneoptiondetail';

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Genel Bakış', icon: '◈' },
  { id: 'momentum', label: 'Momentum', icon: '⚡' },
  { id: 'stocks', label: 'Hisse Analizi', icon: '◎' },
  { id: 'calendar', label: 'Takvim', icon: '◷' },
  { id: 'sector', label: 'Sektörel', icon: '⬡' },
  { id: 'risk', label: 'Risk Matrisi', icon: '◉' },
  { id: 'ivcrush', label: 'IV Crush Stratejisi', icon: '💰' },
  { id: 'optiondetail', label: 'Opsiyon Detay', icon: '📊' },
  { id: 'juneearnings', label: 'Haziran Earnings', icon: '📈' },
  { id: 'juneoptiondetail', label: 'Haziran Opsiyon', icon: '🎯' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top on tab change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const strongBuyCount = stocksData.filter(s => s.signal === 'STRONG_BUY').length;
  const buyCount = stocksData.filter(s => s.signal === 'BUY').length;
  const sellCount = stocksData.filter(s => s.signal === 'SELL' || s.signal === 'STRONG_SELL').length;

  const handleStockClick = (ticker: string) => {
    setSelectedTicker(ticker);
    setActiveTab('stocks');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.11 0.025 230)', fontFamily: "'Inter', sans-serif" }}>
      {/* Top Header Bar */}
      <header className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'oklch(0.22 0.03 225)', background: 'oklch(0.09 0.025 230)' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:opacity-70 transition-opacity"
            style={{ color: 'oklch(0.55 0.015 225)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect y="2" width="16" height="1.5" rx="0.5"/>
              <rect y="7.25" width="16" height="1.5" rx="0.5"/>
              <rect y="12.5" width="16" height="1.5" rx="0.5"/>
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full pulse-live" style={{ background: 'oklch(0.78 0.18 160)' }} />
            <span className="heading-condensed text-sm" style={{ color: 'oklch(0.78 0.18 160)', letterSpacing: '0.1em' }}>
              EARNINGS BENCHMARK RAPORU
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="data-mono text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>DÖNEM</span>
            <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.78 0.18 160)' }}>27 MAY — 3 HAZ 2026</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="data-mono text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>ANALİZ</span>
            <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.92 0.01 220)' }}>21.05.2026</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-strong">{strongBuyCount + buyCount} AL</span>
            <span className="badge-danger">{sellCount} SAT</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 41px)' }}>
        {/* Left Sidebar */}
        {sidebarOpen && (
          <aside
            className="flex flex-col border-r"
            style={{
              width: '220px',
              minWidth: '220px',
              background: 'oklch(0.09 0.025 230)',
              borderColor: 'oklch(0.22 0.03 225)',
            }}
          >
            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-0.5">
              <div className="mb-3 px-2">
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'oklch(0.4 0.02 225)' }}>
                  Navigasyon
                </span>
              </div>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left transition-all duration-150"
                  style={{
                    background: activeTab === tab.id ? 'oklch(0.78 0.18 160 / 0.12)' : 'transparent',
                    borderLeft: activeTab === tab.id ? '2px solid oklch(0.78 0.18 160)' : '2px solid transparent',
                    color: activeTab === tab.id ? 'oklch(0.78 0.18 160)' : 'oklch(0.55 0.015 225)',
                    borderRadius: '0',
                  }}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span className="text-xs font-semibold tracking-wide uppercase">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Quick Stats */}
            <div className="p-3 border-t space-y-2" style={{ borderColor: 'oklch(0.22 0.03 225)' }}>
              <div className="text-xs font-semibold tracking-widest uppercase mb-2 px-1" style={{ color: 'oklch(0.4 0.02 225)' }}>
                Özet
              </div>
              {[
                { label: 'Güçlü Al', value: strongBuyCount, colorClass: 'text-emerald-400' },
                { label: 'Al', value: buyCount, colorClass: 'text-green-400' },
                { label: 'Nötr', value: stocksData.filter(s => s.signal === 'NEUTRAL').length, colorClass: 'text-amber-400' },
                { label: 'Sat/G.Sat', value: sellCount, colorClass: 'text-red-400' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between px-2">
                  <span className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>{item.label}</span>
                  <span className={`data-mono text-sm font-bold ${item.colorClass}`}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Top 3 Picks */}
            <div className="p-3 border-t" style={{ borderColor: 'oklch(0.22 0.03 225)' }}>
              <div className="text-xs font-semibold tracking-widest uppercase mb-2 px-1" style={{ color: 'oklch(0.4 0.02 225)' }}>
                Top Seçimler
              </div>
              {stocksData
                .filter(s => s.signal === 'STRONG_BUY')
                .map((stock, i) => (
                  <button
                    key={stock.ticker}
                    onClick={() => handleStockClick(stock.ticker)}
                    className="w-full flex items-center justify-between px-2 py-1.5 hover:opacity-80 transition-opacity"
                    style={{ background: 'transparent' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="data-mono text-xs font-bold" style={{ color: 'oklch(0.4 0.02 225)' }}>#{i + 1}</span>
                      <span className="data-mono text-xs font-bold text-emerald-400">{stock.ticker}</span>
                    </div>
                    <span className="data-mono text-xs font-semibold" style={{ color: 'oklch(0.78 0.18 160)' }}>
                      {stock.momentumScore}
                    </span>
                  </button>
                ))}
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main
          ref={contentRef}
          className="flex-1 overflow-y-auto"
          style={{ background: 'oklch(0.11 0.025 230)' }}
        >
          {activeTab === 'overview' && (
            <OverviewTab onStockClick={handleStockClick} />
          )}
          {activeTab === 'momentum' && (
            <MomentumTab onStockClick={handleStockClick} />
          )}
          {activeTab === 'stocks' && (
            <StockDetailTab selectedTicker={selectedTicker} onSelectTicker={setSelectedTicker} />
          )}
          {activeTab === 'calendar' && (
            <CalendarTab onStockClick={handleStockClick} />
          )}
          {activeTab === 'sector' && (
            <SectorTab />
          )}
          {activeTab === 'risk' && <RiskTab onStockClick={handleStockClick} />}
          {activeTab === 'ivcrush' && <IVCrushTab onStockClick={handleStockClick} />}
          {activeTab === 'optiondetail' && <OptionDetailTab selectedTicker={selectedTicker} onSelectTicker={setSelectedTicker} />}
          {activeTab === 'juneearnings' && <JuneEarningsTab onStockClick={handleStockClick} />}
          {activeTab === 'juneoptiondetail' && <JuneOptionDetailTab selectedTicker={selectedTicker} onSelectTicker={setSelectedTicker} />}
        </main>
      </div>
    </div>
  );
}
