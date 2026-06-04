import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import {
  TrendingUp, TrendingDown, Activity, Zap, Target,
  Shield, BarChart3, Clock, ArrowUpRight, ArrowDownRight,
  DollarSign, Flame, Brain, AlertTriangle
} from "lucide-react";
import { useTranslation } from "@/i18n/I18nContext";

// Demo data — gerçek uygulamada API'den gelecek
const momentumHistory = [
  { time: "09:30", score: 45, volume: 120 },
  { time: "09:45", score: 52, volume: 180 },
  { time: "10:00", score: 68, volume: 250 },
  { time: "10:15", score: 74, volume: 320 },
  { time: "10:30", score: 71, volume: 280 },
  { time: "10:45", score: 78, volume: 350 },
  { time: "11:00", score: 82, volume: 400 },
  { time: "11:15", score: 79, volume: 360 },
  { time: "11:30", score: 85, volume: 420 },
  { time: "11:45", score: 80, volume: 380 },
  { time: "12:00", score: 76, volume: 300 },
  { time: "12:30", score: 72, volume: 260 },
  { time: "13:00", score: 74, volume: 290 },
  { time: "13:30", score: 81, volume: 370 },
  { time: "14:00", score: 88, volume: 450 },
  { time: "14:30", score: 83, volume: 410 },
  { time: "15:00", score: 79, volume: 340 },
  { time: "15:30", score: 72, volume: 280 },
];

const sectorPerformance = [
  { name: "Teknoloji", score: 82, change: 2.4 },
  { name: "Finans", score: 68, change: 1.2 },
  { name: "Sağlık", score: 74, change: -0.5 },
  { name: "Enerji", score: 55, change: 3.1 },
  { name: "Perakende", score: 61, change: 1.8 },
  { name: "Ulaşım", score: 48, change: -1.2 },
];

const signalDistribution = [
  { name: "STRONG_BUY", value: 5, color: "#10b981" },
  { name: "BUY", value: 12, color: "#14b8a6" },
  { name: "NEUTRAL", value: 28, color: "#64748b" },
  { name: "CAUTION", value: 8, color: "#f59e0b" },
  { name: "RED", value: 3, color: "#ef4444" },
];

const radarFactors = [
  { factor: "RVOL", fullMark: 100, value: 85 },
  { factor: "ORB", fullMark: 100, value: 72 },
  { factor: "VWAP", fullMark: 100, value: 90 },
  { factor: "Structure", fullMark: 100, value: 68 },
  { factor: "RSI", fullMark: 100, value: 55 },
  { factor: "GAP", fullMark: 100, value: 78 },
  { factor: "Velocity", fullMark: 100, value: 82 },
  { factor: "ATR", fullMark: 100, value: 64 },
];

const topMovers = [
  { ticker: "HOOD", change: 9.65, price: 93.03, signal: "STRONG_BUY" },
  { ticker: "PLTR", change: 8.68, price: 155.78, signal: "BUY" },
  { ticker: "SNOW", change: 7.12, price: 250.13, signal: "RED" },
  { ticker: "SOFI", change: 7.98, price: 18.48, signal: "CAUTION" },
  { ticker: "MU", change: 4.84, price: 968.25, signal: "BUY" },
];

const COLORS = ["#10b981", "#14b8a6", "#64748b", "#f59e0b", "#ef4444"];

export default function Dashboard() {
  const { t, lang } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString(lang === "tr" ? "tr-TR" : "en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("dashboard.title")}</h1>
          <p className="text-sm text-slate-400 mt-1">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/40 rounded-lg px-3 py-2 border border-slate-700/40">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-mono text-emerald-400">{formatTime(currentTime)} EST</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t("dashboard.activeSignals"), value: "17", sub: t("dashboard.strongBuyCount", { count: 5 }), icon: Zap, color: "emerald", change: "+3" },
          { label: t("dashboard.avgMomentum"), value: "68.4", sub: t("dashboard.lastScan"), icon: Activity, color: "cyan", change: "+2.1" },
          { label: t("dashboard.bestSector"), value: t("controls.technology"), sub: t("dashboard.score", { val: 82 }), icon: TrendingUp, color: "purple", change: "+2.4%" },
          { label: t("dashboard.marketRegime"), value: t("layout.bull"), sub: t("dashboard.spyAboveEma"), icon: Shield, color: "emerald", change: t("dashboard.stable") },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500">{stat.label}</span>
              <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
            </div>
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[10px] text-slate-500">{stat.sub}</p>
              <span className={`text-[10px] font-medium ${stat.change.startsWith("+") ? "text-emerald-400" : "text-slate-400"}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Momentum Chart */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/60 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">{t("dashboard.momentumFlow")}</h2>
            </div>
            <span className="text-[10px] text-slate-500">{t("dashboard.timeRange")}</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={momentumHistory}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#475569" fontSize={10} />
              <YAxis stroke="#475569" fontSize={10} domain={[30, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} fill="url(#scoreGrad)" name="Momentum" />
              <Area type="monotone" dataKey="volume" stroke="#06b6d4" strokeWidth={1} fill="url(#volGrad)" name={t("dashboard.volume")} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Signal Distribution */}
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-white">{t("dashboard.signalDistribution")}</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={signalDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {signalDistribution.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {signalDistribution.map((s, i) => (
              <span key={i} className="text-[10px] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-400">{s.name} ({s.value})</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sector Performance */}
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">{t("dashboard.sectorPerformance")}</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sectorPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#475569" fontSize={10} domain={[0, 100]} />
              <YAxis dataKey="name" type="category" stroke="#475569" fontSize={11} width={70} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
              />
              <Bar dataKey="score" fill="#06b6d4" radius={[0, 4, 4, 0]} name="Skor" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Factor Radar */}
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">{t("dashboard.factorRadar")}</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarFactors}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="factor" stroke="#64748b" fontSize={10} />
              <PolarRadiusAxis stroke="#475569" fontSize={10} domain={[0, 100]} />
              <Radar name="Skor" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Movers + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Movers */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/60 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <h2 className="text-sm font-semibold text-white">{t("dashboard.topMovers")}</h2>
            </div>
            <Link to="/scan" className="text-xs text-emerald-400 hover:text-emerald-300">{t("dashboard.viewAll")}</Link>
          </div>
          <div className="space-y-2">
            {topMovers.map((stock, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-5">{i + 1}</span>
                  <div>
                    <span className="text-sm font-semibold text-white">{stock.ticker}</span>
                    <span className="text-xs text-slate-500 ml-2">${stock.price}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    stock.signal === "STRONG_BUY" ? "bg-emerald-500/20 text-emerald-400" :
                    stock.signal === "BUY" ? "bg-teal-500/20 text-teal-400" :
                    stock.signal === "RED" ? "bg-red-500/20 text-red-400" :
                    "bg-amber-500/20 text-amber-400"
                  }`}>
                    {stock.signal}
                  </span>
                  <span className={`text-sm font-medium flex items-center gap-1 ${stock.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {stock.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h2 className="text-sm font-semibold text-white">{t("dashboard.alerts")}</h2>
          </div>
          <div className="space-y-3">
            {[
              { level: "HIGH", msg: "SNOW RSI 92.3 — Aşırı alım!", color: "red" },
              { level: "MED", msg: "VIX 15.6 — Yükseliş trendi", color: "amber" },
              { level: "LOW", msg: "HOOD Micro: Yorgunluk sinyali", color: "cyan" },
              { level: "HIGH", msg: "IONQ Pre-market -8.3%", color: "red" },
              { level: "MED", msg: "FED: 16-17 Haziran toplantı", color: "amber" },
            ].map((alert, i) => (
              <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg bg-${alert.color}-500/5 border border-${alert.color}-500/10`}>
                <span className={`text-[10px] font-bold text-${alert.color}-400 mt-0.5`}>{alert.level}</span>
                <p className="text-xs text-slate-300">{alert.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
