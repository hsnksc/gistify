import { useState } from "react";
import {
  History, Calendar, TrendingUp, TrendingDown, Filter,
  Download, BarChart3, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";
import { useTranslation } from "@/i18n/I18nContext";

interface ScanRecord {
  id: string;
  date: string;
  time: string;
  tickers: number;
  topPick: string;
  topScore: number;
  avgScore: number;
  regime: string;
  vix: number;
}

const mockHistory: ScanRecord[] = [
  { id: "1", date: "29 Mayıs", time: "10:30", tickers: 30, topPick: "HOOD", topScore: 91, avgScore: 58, regime: "BULL", vix: 15.6 },
  { id: "2", date: "28 Mayıs", time: "10:15", tickers: 30, topPick: "SNOW", topScore: 88, avgScore: 62, regime: "BULL", vix: 16.2 },
  { id: "3", date: "27 Mayıs", time: "10:45", tickers: 30, topPick: "PLTR", topScore: 85, avgScore: 55, regime: "BULL", vix: 17.1 },
  { id: "4", date: "26 Mayıs", time: "10:00", tickers: 30, topPick: "NVDA", topScore: 82, avgScore: 60, regime: "NEUTRAL", vix: 18.5 },
  { id: "5", date: "23 Mayıs", time: "10:30", tickers: 30, topPick: "MRVL", topScore: 79, avgScore: 52, regime: "NEUTRAL", vix: 19.2 },
  { id: "6", date: "22 Mayıs", time: "10:15", tickers: 30, topPick: "MU", topScore: 84, avgScore: 57, regime: "BULL", vix: 16.8 },
  { id: "7", date: "21 Mayıs", time: "11:00", tickers: 30, topPick: "AVGO", topScore: 76, avgScore: 54, regime: "NEUTRAL", vix: 17.5 },
  { id: "8", date: "20 Mayıs", time: "10:30", tickers: 30, topPick: "CRM", topScore: 81, avgScore: 59, regime: "BULL", vix: 15.9 },
];

const scoreTrend = mockHistory.map((h, i) => ({
  date: h.date,
  topScore: h.topScore,
  avgScore: h.avgScore,
  vix: h.vix,
})).reverse();

export default function HistoryPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("ALL");

  const filtered = filter === "ALL" ? mockHistory : mockHistory.filter((h) => h.regime === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t("history.title")}</h1>
        <p className="text-sm text-slate-400 mt-1">{t("history.subtitle")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-3">
          <p className="text-xs text-slate-500">{t("history.scanned")}</p>
          <p className="text-xl font-bold text-white">{mockHistory.length}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-3">
          <p className="text-xs text-slate-500">Ort. En İyi Skor</p>
          <p className="text-xl font-bold text-emerald-400">{(mockHistory.reduce((a, h) => a + h.topScore, 0) / mockHistory.length).toFixed(1)}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-3">
          <p className="text-xs text-slate-500">Bull Oranı</p>
          <p className="text-xl font-bold text-purple-400">%{Math.round((mockHistory.filter((h) => h.regime === "BULL").length / mockHistory.length) * 100)}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-3">
          <p className="text-xs text-slate-500">Ort. VIX</p>
          <p className="text-xl font-bold text-amber-400">{(mockHistory.reduce((a, h) => a + h.vix, 0) / mockHistory.length).toFixed(1)}</p>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" /> {t("detail.score")} Trend
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={scoreTrend}>
            <defs>
              <linearGradient id="topGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#475569" fontSize={10} />
            <YAxis stroke="#475569" fontSize={10} domain={[40, 100]} />
            <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }} />
            <Area type="monotone" dataKey="topScore" stroke="#10b981" strokeWidth={2} fill="url(#topGrad)" name="Top Score" />
            <Area type="monotone" dataKey="avgScore" stroke="#06b6d4" strokeWidth={1} fill="url(#avgGrad)" name="Avg Score" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500">{t("controls.filters")}:</span>
            {["ALL", "BULL", "NEUTRAL"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`text-xs px-2 py-1 rounded ${filter === f ? "bg-purple-500/20 text-purple-400" : "text-slate-400 hover:text-white"}`}>
                {f === "ALL" ? t("controls.allSectors") : f}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:text-white">
            <Download className="w-3 h-3 mr-1" /> {t("misc.save")}
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/60">
                <th className="px-3 py-3 text-xs text-slate-400 text-left">{t("history.date")}</th>
                <th className="px-3 py-3 text-xs text-slate-400 text-left">{t("resultsTable.ticker")}</th>
                <th className="px-3 py-3 text-xs text-slate-400 text-center">{t("resultsTable.score")}</th>
                <th className="px-3 py-3 text-xs text-slate-400 text-center">{t("history.avgScore")}</th>
                <th className="px-3 py-3 text-xs text-slate-400 text-center">{t("dashboard.marketRegime")}</th>
                <th className="px-3 py-3 text-xs text-slate-400 text-center">VIX</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((h) => (
                <tr key={h.id} className="border-b border-slate-800/30 hover:bg-slate-800/30">
                  <td className="px-3 py-3 text-sm text-slate-300">{h.date} {h.time}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-white">{h.topPick}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`text-sm font-bold ${h.topScore >= 85 ? "text-emerald-400" : h.topScore >= 70 ? "text-teal-400" : "text-slate-400"}`}>{h.topScore}</span>
                  </td>
                  <td className="px-3 py-3 text-center text-sm text-slate-400">{h.avgScore}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded ${h.regime === "BULL" ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"}`}>{h.regime}</span>
                  </td>
                  <td className="px-3 py-3 text-center text-sm text-slate-400">{h.vix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
