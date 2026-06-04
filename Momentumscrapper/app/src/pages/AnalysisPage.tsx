import { useState } from "react";
import {
  BarChart3, Search, TrendingUp, TrendingDown, Activity,
  Target, Shield, Zap, Brain, Clock, AlertTriangle, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area
} from "recharts";
import { useTranslation } from "@/i18n/I18nContext";

const DEFAULT_TICKERS = ["AAPL", "MSFT", "AMZN", "GOOGL", "NVDA", "META", "TSLA", "NFLX", "AMD", "CRM", "SNOW", "PLTR", "HOOD", "SOFI", "MU", "AVGO", "MRVL", "IONQ", "ACHR", "IREN"];

interface AnalysisResult {
  ticker: string;
  price: number;
  change: number;
  score: number;
  bearScore: number;
  persistenceScore: number;
  isT1Suitable: boolean;
  catalystScore: 1 | 2 | 3;
  catalystFlags: string[];
  microScore: number;
  microReversalRisk: string;
  rsi: number;
  rvol: number;
  factors: { name: string; value: number }[];
  callSetup: { strategy: string; strike: number; pop: number; kelly: string };
  putSetup: { strategy: string; strike: number; pop: number; kelly: string };
}

function generateAnalysis(ticker: string): AnalysisResult {
  const score = Math.round(35 + Math.random() * 50);
  const bearScore = Math.round(20 + Math.random() * 55);
  const price = 10 + Math.random() * 900;
  const change = (Math.random() - 0.3) * 12;
  const persistenceScore = Math.round(45 + Math.random() * 45);
  const isT1Suitable = persistenceScore >= 65;
  const catalystScore = (Math.random() > 0.6 ? 3 : Math.random() > 0.3 ? 2 : 1) as 1 | 2 | 3;
  const microScore = Math.round(Math.random() * 100);
  const microReversalRisk = microScore >= 70 ? "HIGH" : microScore >= 40 ? "MEDIUM" : "LOW";
  const rsi = Math.round(35 + Math.random() * 45);
  const rvol = 0.5 + Math.random() * 4;

  return {
    ticker, price, change, score, bearScore, persistenceScore, isT1Suitable,
    catalystScore,
    catalystFlags: catalystScore === 1 ? ["GUIDANCE_CUT"] : catalystScore === 3 ? ["EARNINGS_BEAT"] : [],
    microScore, microReversalRisk, rsi, rvol,
    factors: [
      { name: "RVOL", value: Math.round(50 + Math.random() * 50) },
      { name: "ORB", value: Math.round(40 + Math.random() * 55) },
      { name: "VWAP", value: Math.round(45 + Math.random() * 50) },
      { name: "Yapı", value: Math.round(35 + Math.random() * 55) },
      { name: "RSI", value: Math.round(40 + Math.random() * 45) },
      { name: "GAP", value: Math.round(30 + Math.random() * 60) },
      { name: "Velocity", value: Math.round(40 + Math.random() * 50) },
      { name: "ATR", value: Math.round(35 + Math.random() * 50) },
    ],
    callSetup: {
      strategy: score >= 70 ? "Long Call" : "Bull Call Spread",
      strike: Math.round(price * 1.05),
      pop: Math.round(45 + Math.random() * 25),
      kelly: `NLV %${(Math.min(2.0, score / 50)).toFixed(1)}`,
    },
    putSetup: {
      strategy: bearScore >= 60 ? "Long Put" : "Bear Put Spread",
      strike: Math.round(price * 0.95),
      pop: Math.round(40 + Math.random() * 25),
      kelly: `NLV %${(Math.min(1.5, bearScore / 60)).toFixed(1)}`,
    },
  };
}

export default function AnalysisPage() {
  const { t } = useTranslation();
  const [ticker, setTicker] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(["NVDA", "HOOD", "SOFI"]);

  const handleAnalyze = () => {
    if (!ticker) return;
    setLoading(true);
    setTimeout(() => {
      const analysis = generateAnalysis(ticker.toUpperCase());
      setResult(analysis);
      setRecentSearches((prev) => [ticker.toUpperCase(), ...prev.filter((t) => t !== ticker.toUpperCase())].slice(0, 5));
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t("analysis.title")}</h1>
        <p className="text-sm text-slate-400 mt-1">v4.3 Çift yönlü motor — AI Catalyst + Microstructure + PDT</p>
      </div>

      {/* Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            placeholder={t("analysis.enterTicker")}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        <Button onClick={handleAnalyze} disabled={loading} className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          {loading ? t("analysis.analyzing") : t("analysis.analyzeButton")}
        </Button>
      </div>

      {/* Recent */}
      {recentSearches.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{t("analysis.subtitle")}:</span>
          {recentSearches.map((t) => (
            <button key={t} onClick={() => { setTicker(t); handleAnalyze(); }} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 transition-all">
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-500">Fiyat</p>
              <p className="text-lg font-bold text-white">${result.price.toFixed(2)}</p>
              <p className={`text-xs ${result.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>{result.change >= 0 ? "+" : ""}{result.change.toFixed(2)}%</p>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 text-center">
              <p className="text-xs text-emerald-400/70">Bull Skor</p>
              <p className="text-lg font-bold text-emerald-400">{result.score}</p>
              <p className="text-[10px] text-emerald-400/50">Momentum</p>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3 text-center">
              <p className="text-xs text-red-400/70">Bear Skor</p>
              <p className="text-lg font-bold text-red-400">{result.bearScore}</p>
              <p className="text-[10px] text-red-400/50">Düşüş</p>
            </div>
            <div className={`${result.isT1Suitable ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"} border rounded-xl p-3 text-center`}>
              <p className={`text-xs ${result.isT1Suitable ? "text-emerald-400/70" : "text-red-400/70"}`}>PDT</p>
              <p className={`text-lg font-bold ${result.isT1Suitable ? "text-emerald-400" : "text-red-400"}`}>{result.persistenceScore}</p>
              <p className="text-[10px] text-slate-500">{result.isT1Suitable ? "✓ Uygun" : "✗ Uygun değil"}</p>
            </div>
            <div className={`${result.catalystScore === 1 ? "bg-red-500/5 border-red-500/20" : result.catalystScore === 3 ? "bg-emerald-500/5 border-emerald-500/20" : "bg-slate-800/40 border-slate-700/30"} border rounded-xl p-3 text-center`}>
              <p className="text-xs text-slate-500">AI Katalizör</p>
              <p className={`text-lg font-bold ${result.catalystScore === 1 ? "text-red-400" : result.catalystScore === 3 ? "text-emerald-400" : "text-slate-400"}`}>{result.catalystScore}/3</p>
              <p className="text-[10px] text-slate-500">{result.catalystFlags.join(", ") || "Nötr"}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Factor Radar */}
            <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" /> Faktör Analizi
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={result.factors}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <PolarRadiusAxis stroke="#475569" fontSize={10} domain={[0, 100]} />
                  <Radar name="Skor" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Factor Bars */}
            <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" /> Faktör Skorları
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={result.factors} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#475569" fontSize={10} domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={60} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Call / Put Setups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> CALL Setup
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Strateji:</span><span className="text-white">{result.callSetup.strategy}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Strike:</span><span className="text-emerald-400">${result.callSetup.strike}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">POP:</span><span className="text-cyan-400">%{result.callSetup.pop}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Kelly:</span><span className="text-purple-400">{result.callSetup.kelly}</span></div>
              </div>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" /> PUT Setup
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Strateji:</span><span className="text-white">{result.putSetup.strategy}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Strike:</span><span className="text-red-400">${result.putSetup.strike}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">POP:</span><span className="text-cyan-400">%{result.putSetup.pop}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Kelly:</span><span className="text-purple-400">{result.putSetup.kelly}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
