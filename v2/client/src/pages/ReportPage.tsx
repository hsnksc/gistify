/*
 * DESIGN: "Precision Finance" — Report Selection Page
 * Choose between May-June and June earnings reports
 */

import { useState } from 'react';
import ReportSelector from '@/components/ReportSelector';
import AdminPanel from '@/components/AdminPanel';
import OverviewTab from '@/components/tabs/OverviewTab';
import MomentumTab from '@/components/tabs/MomentumTab';
import StockDetailTab from '@/components/tabs/StockDetailTab';
import CalendarTab from '@/components/tabs/CalendarTab';
import SectorTab from '@/components/tabs/SectorTab';
import RiskTab from '@/components/tabs/RiskTab';
import IVCrushTab from '@/components/tabs/IVCrushTab';
import OptionDetailTab from '@/components/tabs/OptionDetailTab';
import JuneOverviewTab from '@/components/tabs/JuneOverviewTab';
import JuneMomentumTab from '@/components/tabs/JuneMomentumTab';
import JuneStockDetailTab from '@/components/tabs/JuneStockDetailTab';
import DynamicReportTab from '@/components/tabs/DynamicReportTab';
import { DynamicReport, generateReportFromDateRange } from '@/lib/reportGenerator';

type TabId = 'overview' | 'momentum' | 'stocks' | 'calendar' | 'sector' | 'risk' | 'ivcrush' | 'optiondetail' | 'juneearnings' | 'juneoptiondetail' | 'dynamic';

const mayJuneTabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Genel Bakış', icon: '◈' },
  { id: 'momentum', label: 'Momentum', icon: '⚡' },
  { id: 'stocks', label: 'Hisse Analizi', icon: '◎' },
  { id: 'calendar', label: 'Takvim', icon: '◷' },
  { id: 'sector', label: 'Sektörel', icon: '⬡' },
  { id: 'risk', label: 'Risk Matrisi', icon: '◉' },
  { id: 'ivcrush', label: 'IV Crush', icon: '💰' },
  { id: 'optiondetail', label: 'Opsiyon Detay', icon: '📊' },
];

const juneTabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'juneearnings', label: 'Genel Bakış', icon: '◈' },
  { id: 'momentum', label: 'Momentum', icon: '⚡' },
  { id: 'stocks', label: 'Hisse Analizi', icon: '◎' },
  { id: 'calendar', label: 'Takvim', icon: '◷' },
  { id: 'sector', label: 'Sektörel', icon: '⬡' },
  { id: 'risk', label: 'Risk Matrisi', icon: '◉' },
  { id: 'ivcrush', label: 'IV Crush', icon: '💰' },
  { id: 'optiondetail', label: 'Opsiyon Detay', icon: '📊' },
];

export default function ReportPage() {
  const [selectedReport, setSelectedReport] = useState<'mayJune' | 'june' | 'dynamic'>('mayJune');
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [dynamicReports, setDynamicReports] = useState<DynamicReport[]>([]);
  const [activeDynamicReport, setActiveDynamicReport] = useState<DynamicReport | null>(null);

  const tabs = selectedReport === 'mayJune' ? mayJuneTabs : selectedReport === 'june' ? juneTabs : [{ id: 'dynamic' as TabId, label: 'Rapor', icon: '📊' }];

  const handleStockClick = (ticker: string) => {
    setSelectedTicker(ticker);
    setActiveTab('stocks');
  };

  const handleReportChange = (report: 'mayJune' | 'june' | 'dynamic') => {
    setSelectedReport(report);
    setActiveTab(report === 'mayJune' ? 'overview' : report === 'june' ? 'juneearnings' : 'dynamic');
    setSelectedTicker(null);
  };

  const handleGenerateReport = (config: { name: string; startDate: string; endDate: string }) => {
    const newReport = generateReportFromDateRange(config.startDate, config.endDate, config.name);
    setDynamicReports([...dynamicReports, newReport]);
    setActiveDynamicReport(newReport);
    setSelectedReport('dynamic');
    setActiveTab('dynamic');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.12 0.02 225)' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b" style={{ borderColor: 'oklch(0.22 0.03 225)', background: 'oklch(0.12 0.02 225)' }}>
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6" style={{ background: 'oklch(0.78 0.18 160)' }} />
            <h1 className="heading-condensed text-xl" style={{ color: 'oklch(0.92 0.01 220)' }}>
              EARNINGS BENCHMARK RAPORU
            </h1>
          </div>
          <div className="text-xs data-mono" style={{ color: 'oklch(0.5 0.015 225)' }}>
            Analiz: 21.05.2026
          </div>
        </div>
      </header>

      {/* Report Selector */}
      <div className="px-6 pt-6">
        <ReportSelector selectedReport={selectedReport} onSelectReport={handleReportChange} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className="transition-all duration-300 overflow-y-auto"
          style={{
            width: sidebarOpen ? '220px' : '0',
            borderRight: sidebarOpen ? '1px solid oklch(0.22 0.03 225)' : 'none',
            background: 'oklch(0.13 0.025 230)',
          }}
        >
          <nav className="p-4 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="w-full px-3 py-2.5 text-left text-xs font-semibold data-mono transition-all duration-150"
                style={{
                  background: activeTab === tab.id ? 'oklch(0.78 0.18 160 / 0.2)' : 'transparent',
                  color: activeTab === tab.id ? 'oklch(0.78 0.18 160)' : 'oklch(0.55 0.015 225)',
                  borderLeft: activeTab === tab.id ? '3px solid oklch(0.78 0.18 160)' : '3px solid transparent',
                  paddingLeft: activeTab === tab.id ? '12px' : '12px',
                }}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ background: 'oklch(0.12 0.02 225)' }}
        >
          {/* May-June Report */}
          {selectedReport === 'mayJune' && (
            <>
              {activeTab === 'overview' && <OverviewTab onStockClick={handleStockClick} />}
              {activeTab === 'momentum' && <MomentumTab onStockClick={handleStockClick} />}
              {activeTab === 'stocks' && <StockDetailTab selectedTicker={selectedTicker} onSelectTicker={setSelectedTicker} />}
              {activeTab === 'calendar' && <CalendarTab onStockClick={handleStockClick} />}
              {activeTab === 'sector' && <SectorTab />}
              {activeTab === 'risk' && <RiskTab onStockClick={handleStockClick} />}
              {activeTab === 'ivcrush' && <IVCrushTab onStockClick={handleStockClick} />}
              {activeTab === 'optiondetail' && <OptionDetailTab selectedTicker={selectedTicker} onSelectTicker={setSelectedTicker} />}
            </>
          )}

          {/* June Report */}
          {selectedReport === 'june' && (
            <>
              {activeTab === 'juneearnings' && <JuneOverviewTab onStockClick={handleStockClick} />}
              {activeTab === 'momentum' && <JuneMomentumTab onStockClick={handleStockClick} />}
              {activeTab === 'stocks' && <JuneStockDetailTab selectedTicker={selectedTicker} onSelectTicker={setSelectedTicker} />}
              {activeTab === 'calendar' && <CalendarTab onStockClick={handleStockClick} />}
              {activeTab === 'sector' && <SectorTab onStockClick={handleStockClick} />}
              {activeTab === 'risk' && <RiskTab onStockClick={handleStockClick} />}
              {activeTab === 'ivcrush' && <IVCrushTab onStockClick={handleStockClick} />}
              {activeTab === 'optiondetail' && <OptionDetailTab selectedTicker={selectedTicker} onSelectTicker={setSelectedTicker} />}
            </>
          )}

          {/* Dynamic Reports */}
          {selectedReport === 'dynamic' && activeDynamicReport && (
            <>{activeTab === 'dynamic' && <DynamicReportTab report={activeDynamicReport} />}</>
          )}
        </main>
      </div>

      {/* Admin Panel */}
      <AdminPanel
        onGenerateReport={handleGenerateReport}
        existingReports={dynamicReports}
      />

      {/* Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-0 top-1/2 z-50 p-2 transition-all duration-300"
        style={{
          background: 'oklch(0.78 0.18 160)',
          color: 'oklch(0.12 0.02 225)',
          transform: sidebarOpen ? 'translateX(220px)' : 'translateX(0)',
        }}
      >
        {sidebarOpen ? '◀' : '▶'}
      </button>
    </div>
  );
}
