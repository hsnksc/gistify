/*
 * DESIGN: "Precision Finance" — Admin Panel
 * Dynamic report generator with date range selector
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ReportConfig {
  name: string;
  startDate: string;
  endDate: string;
}

interface Props {
  onGenerateReport: (config: ReportConfig) => void;
  existingReports: any[];
}

export default function AdminPanel({ onGenerateReport, existingReports }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportName, setReportName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate || !reportName) {
      alert('Lütfen tüm alanları doldurunuz');
      return;
    }

    setIsGenerating(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    onGenerateReport({
      name: reportName,
      startDate,
      endDate,
    });

    setIsGenerating(false);
    setStartDate('');
    setEndDate('');
    setReportName('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
        style={{
          background: 'oklch(0.78 0.18 160)',
          color: 'oklch(0.12 0.02 225)',
        }}
        title="Admin Paneli"
      >
        <span className="text-2xl">⚙️</span>
      </button>

      {/* Admin Panel Popup */}
      {isOpen && (
        <div
          className="absolute bottom-20 right-0 w-96 p-6 rounded-lg shadow-2xl border"
          style={{
            background: 'oklch(0.15 0.03 225)',
            borderColor: 'oklch(0.25 0.03 225)',
          }}
        >
          <div className="mb-4">
            <h2 className="heading-condensed text-lg mb-1" style={{ color: 'oklch(0.92 0.01 220)' }}>
              📊 Rapor Oluşturucu
            </h2>
            <p className="text-xs" style={{ color: 'oklch(0.5 0.015 225)' }}>
              Yeni earnings raporu oluşturmak için tarih aralığı seçin
            </p>
          </div>

          {/* Form */}
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: 'oklch(0.55 0.015 225)' }}>
                Rapor Adı
              </label>
              <Input
                type="text"
                placeholder="örn: Haziran Mega-Cap Earnings"
                value={reportName}
                onChange={e => setReportName(e.target.value)}
                className="text-sm"
                style={{
                  background: 'oklch(0.12 0.02 225)',
                  borderColor: 'oklch(0.22 0.03 225)',
                  color: 'oklch(0.85 0.01 220)',
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: 'oklch(0.55 0.015 225)' }}>
                  Başlangıç Tarihi
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="text-sm"
                  style={{
                    background: 'oklch(0.12 0.02 225)',
                    borderColor: 'oklch(0.22 0.03 225)',
                    color: 'oklch(0.85 0.01 220)',
                  }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: 'oklch(0.55 0.015 225)' }}>
                  Bitiş Tarihi
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="text-sm"
                  style={{
                    background: 'oklch(0.12 0.02 225)',
                    borderColor: 'oklch(0.22 0.03 225)',
                    color: 'oklch(0.85 0.01 220)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="flex-1 text-sm font-semibold"
              style={{
                background: isGenerating ? 'oklch(0.5 0.015 225)' : 'oklch(0.78 0.18 160)',
                color: 'oklch(0.12 0.02 225)',
              }}
            >
              {isGenerating ? '⏳ Oluşturuluyor...' : '✨ Rapor Oluştur'}
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="flex-1 text-sm"
              style={{
                borderColor: 'oklch(0.25 0.03 225)',
                color: 'oklch(0.55 0.015 225)',
              }}
            >
              Kapat
            </Button>
          </div>

          {/* Existing Reports */}
          {existingReports && existingReports.length > 0 && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid oklch(0.22 0.03 225)' }}>
              <div className="text-xs font-semibold mb-2" style={{ color: 'oklch(0.55 0.015 225)' }}>
                📁 Oluşturulan Raporlar ({existingReports.length})
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {existingReports.map((report: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-2 text-xs rounded cursor-pointer transition-colors"
                    style={{
                      background: 'oklch(0.12 0.02 225)',
                      color: 'oklch(0.78 0.18 160)',
                      border: '1px solid oklch(0.22 0.03 225)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0.78 0.18 160 / 0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'oklch(0.12 0.02 225)')}
                  >
                    <div className="font-semibold">{report.name}</div>
                    <div style={{ color: 'oklch(0.5 0.015 225)' }}>
                      {report.startDate} → {report.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
