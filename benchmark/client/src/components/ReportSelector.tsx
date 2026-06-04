/*
 * DESIGN: "Precision Finance" — Report Selector
 * Choose between May-June and June earnings reports
 */

interface Props {
  selectedReport: 'mayJune' | 'june' | 'dynamic';
  onSelectReport: (report: 'mayJune' | 'june' | 'dynamic') => void;
  dynamicReports?: any[];
}

export default function ReportSelector({ selectedReport, onSelectReport }: Props) {
  return (
    <div className="flex gap-3 mb-6">
      <button
        onClick={() => onSelectReport('mayJune')}
        className="flex-1 p-4 tactical-card transition-all duration-200"
        style={{
          borderLeftWidth: selectedReport === 'mayJune' ? '4px' : '1px',
          borderLeftColor: selectedReport === 'mayJune' ? 'oklch(0.78 0.18 160)' : 'oklch(0.25 0.03 225)',
          background: selectedReport === 'mayJune' ? 'oklch(0.78 0.18 160 / 0.08)' : 'transparent',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="text-lg" style={{ color: selectedReport === 'mayJune' ? 'oklch(0.78 0.18 160)' : 'oklch(0.55 0.015 225)' }}>📊</div>
          <div className="heading-condensed text-base" style={{ color: selectedReport === 'mayJune' ? 'oklch(0.92 0.01 220)' : 'oklch(0.65 0.015 225)' }}>
            Mayıs-Haziran Earnings
          </div>
        </div>
        <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>
          27 Mayıs - 3 Haziran · 10 hisse · MRVL, CRWD, AVGO, COST vb.
        </div>
      </button>

      <button
        onClick={() => onSelectReport('june')}
        className="flex-1 p-4 tactical-card transition-all duration-200"
        style={{
          borderLeftWidth: selectedReport === 'june' ? '4px' : '1px',
          borderLeftColor: selectedReport === 'june' ? 'oklch(0.78 0.18 160)' : 'oklch(0.25 0.03 225)',
          background: selectedReport === 'june' ? 'oklch(0.78 0.18 160 / 0.08)' : 'transparent',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="text-lg" style={{ color: selectedReport === 'june' ? 'oklch(0.78 0.18 160)' : 'oklch(0.55 0.015 225)' }}>🚀</div>
          <div className="heading-condensed text-base" style={{ color: selectedReport === 'june' ? 'oklch(0.92 0.01 220)' : 'oklch(0.65 0.015 225)' }}>
            Haziran Mega-Cap Earnings
          </div>
        </div>
        <div className="text-xs" style={{ color: 'oklch(0.55 0.015 225)' }}>
          1-12 Haziran · 10 hisse · NVDA, AMD, TSLA, META vb.
        </div>
      </button>
    </div>
  );
}
