import { useMemo, useState } from "react";
import type { BacktestSummary } from "@/lib/backtestEngine";
import { generateConsistencyReport } from "@/lib/consistencyReport";
import {
  Shield, TrendingUp, TrendingDown, Activity, BarChart3,
  Target, Calendar, Zap, AlertTriangle, CheckCircle,
  ChevronDown, ChevronUp, FileText, Award, Gauge
} from "lucide-react";

interface Props {
  summary: BacktestSummary;
}

export default function ConsistencyReportPanel({ summary }: Props) {
  const report = useMemo(() => generateConsistencyReport(summary), [summary]);
  const [expanded, setExpanded] = useState<string | null>("summary");

  const toggle = (key: string) => setExpanded(expanded === key ? null : key);

  const gradeColors: Record<string, string> = {
    A: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    B: "text-teal-400 border-teal-500/30 bg-teal-500/10",
    C: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    D: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    F: "text-red-400 border-red-500/30 bg-red-500/10",
  };

  const scoreColor = (s: number) => s >= 85 ? "text-emerald-400" : s >= 70 ? "text-teal-400" : s >= 55 ? "text-amber-400" : s >= 40 ? "text-orange-400" : "text-red-400";
  const scoreBar = (s: number) => s >= 85 ? "bg-emerald-500" : s >= 70 ? "bg-teal-500" : s >= 55 ? "bg-amber-500" : s >= 40 ? "bg-orange-500" : "bg-red-500";

  const Section = ({
    id, icon, title, grade, score, children
  }: {
    id: string; icon: React.ReactNode; title: string; grade: string; score?: number;
    children: React.ReactNode;
  }) => (
    <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl overflow-hidden">
      <button
        onClick={() => toggle(id)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-sm font-medium text-slate-300">{title}</span>
          <span className={`px-2 py-0.5 rounded border text-xs font-bold ${gradeColors[grade] || gradeColors.F}`}>
            {grade}
          </span>
          {score !== undefined && (
            <span className={`text-xs font-mono ${scoreColor(score)}`}>{score}/100</span>
          )}
        </div>
        {expanded === id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {expanded === id && <div className="px-4 pb-4">{children}</div>}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Genel Not */}
      <div className={`p-5 rounded-xl border ${gradeColors[report.overallGrade]} flex items-center gap-4`}>
        <div className="flex-shrink-0">
          <span className="text-5xl font-black">{report.overallGrade}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold">Tutarlılık Notu: {report.overallGrade}</span>
            <span className={`text-sm font-mono ${scoreColor(report.overallScore)}`}>({report.overallScore}/100)</span>
          </div>
          <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden mb-2">
            <div className={`h-full ${scoreBar(report.overallScore)}`} style={{ width: `${report.overallScore}%` }} />
          </div>
          <p className="text-sm opacity-80">{report.summary}</p>
        </div>
      </div>

      {/* Özet */}
      <Section id="summary" icon={<FileText className="w-4 h-4 text-blue-400" />} title="Özet" grade={report.overallGrade} score={report.overallScore}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <MiniStat label="Win Rate" value={`%${report.winRateConsistency.overallWinRate}`} />
          <MiniStat label="Skor-P&L Korelasyonu" value={`r=${report.scorePnLCorrelation.pearsonR}`} />
          <MiniStat label="Sharpe Ratio" value={report.riskMetrics.sharpeRatio} />
          <MiniStat label="Max Drawdown" value={`-${report.riskMetrics.maxDrawdownPct}%`} />
        </div>
        <p className="text-sm text-slate-400">{report.summary}</p>
      </Section>

      {/* 1. Win Rate Tutarlılığı */}
      <Section id="winrate" icon={<Target className="w-4 h-4 text-emerald-400" />} title="Win Rate Tutarlılığı" grade={report.winRateConsistency.grade}>
        <p className="text-sm text-slate-400 mb-3">{report.winRateConsistency.interpretation}</p>
        <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
          <div><span className="text-slate-500">Standart Sapma:</span> <span className="text-white">{report.winRateConsistency.stdDeviation}%</span></div>
          <div><span className="text-slate-500">Varyasyon Katsayısı:</span> <span className="text-white">{(report.winRateConsistency.coefficientOfVariation * 100).toFixed(0)}%</span></div>
          <div><span className="text-slate-500">Tutarlı mı?</span> <span className={report.winRateConsistency.isConsistent ? "text-emerald-400" : "text-red-400"}>{report.winRateConsistency.isConsistent ? "Evet" : "Hayır"}</span></div>
          <div><span className="text-slate-500">Genel Win Rate:</span> <span className="text-emerald-400">%{report.winRateConsistency.overallWinRate}</span></div>
        </div>
        {report.winRateConsistency.monthlyWinRates.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500">Aylık Win Rate:</p>
            {report.winRateConsistency.monthlyWinRates.map((m) => (
              <div key={m.period} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-16">{m.period}</span>
                <div className="flex-1 h-3 bg-slate-700/50 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${m.winRate >= 50 ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${Math.min(m.winRate, 100)}%` }} />
                </div>
                <span className={`text-xs font-bold w-12 text-right ${m.winRate >= 50 ? "text-emerald-400" : "text-red-400"}`}>%{m.winRate}</span>
                <span className="text-xs text-slate-500 w-14 text-right">{m.trades} işl.</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* 2. Skor → P&L Korelasyonu */}
      <Section id="correlation" icon={<BarChart3 className="w-4 h-4 text-purple-400" />} title="Skor → P&L Korelasyonu" grade={report.scorePnLCorrelation.grade}>
        <p className="text-sm text-slate-400 mb-3">{report.scorePnLCorrelation.interpretation}</p>
        <div className="mb-3 p-2 bg-slate-800/50 rounded-lg">
          <span className="text-sm text-slate-400">Optimal Entry Threshold: </span>
          <span className="text-lg font-bold text-emerald-400">{report.scorePnLCorrelation.optimalThreshold}+</span>
        </div>
        <div className="space-y-2">
          {report.scorePnLCorrelation.scoreRanges.map((r) => (
            <div key={r.range} className="flex items-center gap-3">
              <span className="text-xs text-slate-400 w-16">Skor {r.range}</span>
              <div className="flex-1 h-3 bg-slate-700/50 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${r.avgPnL >= 0 ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${Math.min(Math.abs(r.avgPnL) * 10, 100)}%` }} />
              </div>
              <span className={`text-xs font-bold w-14 text-right ${r.avgPnL >= 0 ? "text-emerald-400" : "text-red-400"}`}>{r.avgPnL >= 0 ? "+" : ""}{r.avgPnL}%</span>
              <span className={`text-xs w-12 text-right ${r.winRate >= 50 ? "text-emerald-400" : "text-red-400"}`}>%{r.winRate} WR</span>
              <span className="text-xs text-slate-500 w-12 text-right">{r.trades} işl.</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 3. Gün İçi Tutarlılık */}
      <Section id="daily" icon={<Calendar className="w-4 h-4 text-cyan-400" />} title="Gün İçi Tutarlılık" grade={report.dailyConsistency.grade}>
        <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
          <div><span className="text-slate-500">Ort. İşlem/Gün:</span> <span className="text-white">{report.dailyConsistency.avgTradesPerDay}</span></div>
          <div><span className="text-slate-500">Günlük P&L StdDev:</span> <span className="text-white">{report.dailyConsistency.dailyPnLStdDev}%</span></div>
          <div><span className="text-slate-500">Max Artış Serisi:</span> <span className="text-emerald-400">{report.dailyConsistency.maxConsecutiveWins} gün</span></div>
          <div><span className="text-slate-500">Max Düşüş Serisi:</span> <span className={report.dailyConsistency.maxConsecutiveLosses <= 3 ? "text-emerald-400" : "text-red-400"}>{report.dailyConsistency.maxConsecutiveLosses} gün</span></div>
        </div>
        <p className="text-sm text-slate-400">{report.dailyConsistency.streakAnalysis}</p>
      </Section>

      {/* 4. Risk Metrikleri */}
      <Section id="risk" icon={<Shield className="w-4 h-4 text-red-400" />} title="Risk Metrikleri" grade={report.riskMetrics.grade}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <RiskCard label="Sharpe Ratio" value={report.riskMetrics.sharpeRatio} threshold={1} />
          <RiskCard label="Sortino Ratio" value={report.riskMetrics.sortinoRatio} threshold={1} />
          <RiskCard label="Calmar Ratio" value={report.riskMetrics.calmarRatio} threshold={1} />
          <RiskCard label="Win/Loss Oranı" value={report.riskMetrics.avgWinToAvgLoss} threshold={1.5} />
          <RiskCard label="Expectancy" value={`${report.riskMetrics.expectancy}%`} threshold={0} />
          <RiskCard label="Max Drawdown" value={`-${report.riskMetrics.maxDrawdownPct}%`} threshold={5} invert />
          <RiskCard label="Risk of Ruin" value={`%${report.riskMetrics.riskOfRuin}`} threshold={10} invert />
        </div>
      </Section>

      {/* 5. Faktör Analizi */}
      <Section id="factors" icon={<Zap className="w-4 h-4 text-amber-400" />} title="Faktör Analizi" grade={report.factorAnalysis.grade}>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">En İyi Gün:</span>
            <span className="text-emerald-400">{report.factorAnalysis.bestPerformingDay}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-slate-400">En Kötü Gün:</span>
            <span className="text-red-400">{report.factorAnalysis.worstPerformingDay}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">RVOL Etkisi:</span>
            <span className="text-cyan-400">{report.factorAnalysis.rvolEffect}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400">RSI Etkisi:</span>
            <span className="text-purple-400">{report.factorAnalysis.rsiEffect}</span>
          </div>
        </div>
      </Section>

      {/* 6. Öneriler */}
      <div className="bg-amber-900/10 border border-amber-500/30 rounded-xl p-4">
        <h3 className="text-sm font-medium text-amber-400 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Öneriler ve İyileştirmeler
        </h3>
        <ul className="space-y-2">
          {report.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-2">
      <p className="text-[10px] text-slate-500">{label}</p>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function RiskCard({ label, value, threshold, invert }: { label: string; value: string | number; threshold: number; invert?: boolean }) {
  const num = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]/g, "")) : value;
  const isGood = invert ? num <= threshold : num >= threshold;
  return (
    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
      <p className="text-[10px] text-slate-500">{label}</p>
      <p className={`text-lg font-bold ${isGood ? "text-emerald-400" : "text-red-400"}`}>{value}</p>
    </div>
  );
}
