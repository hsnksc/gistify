import { useState, useCallback } from "react";
import { Link } from "react";
import {
  Radar, Play, Square, Settings, Filter, TrendingUp,
  TrendingDown, Activity, Zap, ArrowUpRight, ArrowDownRight,
  Loader2, ChevronDown, ChevronUp, Target, BarChart3,
  Clock, Shield, Brain, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from "recharts";
import { useTranslation } from "@/i18n/I18nContext";

// Demo ticker listesi
const DEFAULT_TICKERS = [
  "AAPL", "MSFT", "AMZN", "GOOGL", "NVDA", "META", "TSLA", "NFLX", "AMD", "AVGO",
  "CRM", "SNOW", "MRVL", "PLTR", "HOOD", "SOFI", "ACHR", "MU", "IREN", "RGTI",
  "QBTS", "IONQ", "BURL", "DLTR", "COST", "DKS", "INOD", "BKE", "FUTU", "LI",
];

interface ScanResult {
  ticker: string;
  score: number;
  change: number;
  price: number;
  rsi: number;
  rvol: number;
  signal: string;
  bearScore?: number;
  persistenceScore?: number;
  isT1Suitable?: boolean;
  catalystScore?: number;
  microScore?: number;
  microReversalRisk?: string;
}

// Demo veri üretici
function generateMockResult(ticker: string): ScanResult {
  const score = Math.round(30 + Math.random() * 55);
  const change = (Math.random() - 0.3) * 15;
  const price = 10 + Math.random() * 900;
  const rsi = Math.round(30 + Math.random() * 55);
  const rvol = 0.5 + Math.random() * 4;
  let signal = "NEUTRAL";
  if (score >= 75) signal = "STRONG_BUY";
  else if (score >= 60) signal = "BUY";
  else if (score >= 45) signal = "NEUTRAL";
  else if (score >= 30) signal = "WEAK";

  return {
    ticker, score, change, price, rsi, rvol, signal,
    bearScore: Math.round(20 + Math.random() * 50),
    persistenceScore: Math.round(40 + Math.random() * 50),
    isT1Suitable: Math.random() > 0.4,
    catalystScore: Math.random() > 0.6 ? 3 : Math.random() > 0.3 ? 2 : 1,
    microScore: Math.round(Math.random() * 100),
    microReversalRisk: Math.random() > 0.7 ? "HIGH" : Math.random() > 0.4 ? "MEDIUM" : "LOW",
  };
}

export default function ScanPage() {
  const { t } = useTranslation();
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [filterSignal, setFilterSignal] = useState<string>("ALL");
  const [sortKey, setSortKey] = useState<keyof ScanResult>("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [minScore, setMinScore] = useState("45");
  const [dte, setDte] = useState(21);

  const handleScan = useCallback(() => {
    setIsScanning(true);
    setResults([]);

    // Simüle edilmiş tarama (gerçekte API çağrısı olacak)
    const batchSize = 5;
    let current = 0;

    const interval = setInterval(() => {
      const batch = DEFAULT_TICKERS.slice(current, current + batchSize);
      if (batch.length === 0) {
        clearInterval(interval);
        setIsScanning(false);
        return;
      }

      const newResults = batch.map(generateMockResult);
      setResults((prev) => [...prev, ...newResults]);
      current += batchSize;
    }, 300);
  }, []);

  const handleSort = (key: keyof ScanResult) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = results
    .filter((r) => (filterSignal === "ALL" ? true : r.signal === filterSignal))
    .filter((r) => r.score >= parseInt(minScore || "0"))
    .sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });

  const signalColors: Record<string, string> = {
    STRONG_BUY: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    BUY: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    NEUTRAL: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    WEAK: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{t("scan.title")}</h1>
        <p className="text-sm text-slate-400 mt-1">v4.3 AI Catalyst + Microstructure — 11 {t("factors.rvol")}</p>
      </div>

      {/* Controls */}
      <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4 space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          {/* Tara Butonu */}
          <Button
            onClick={handleScan}
            disabled={isScanning}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-6"
          >
            {isScanning ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("scan.scanning")} ({results.length}/{DEFAULT_TICKERS.length})</>
            ) : (
              <><Radar className="w-4 h-4 mr-2" /> {t("scan.runScan")}</>
            )}
          </Button>

          {isScanning && (
            <Button variant="outline" onClick={() => { setIsScanning(false); }} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
              <Square className="w-4 h-4 mr-2" /> {t("misc.cancel")}
            </Button>
          )}

          {/* Min Skor */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{t("controls.minScore")}</label>
            <Input value={minScore} onChange={(e) => setMinScore(e.target.value)} className="w-20 bg-slate-800 border-slate-700 text-white" />
          </div>

          {/* DTE */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">DTE</label>
            <div className="flex gap-1">
              {[14, 21, 30].map((d) => (
                <button key={d} onClick={() => setDte(d)} className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${dte === d ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Signal Filter */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{t("resultsTable.signal")}</label>
            <div className="flex gap-1">
              {["ALL", "STRONG_BUY", "BUY", "NEUTRAL"].map((s) => (
                <button key={s} onClick={() => setFilterSignal(s)} className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${filterSignal === s ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"}`}>
                  {s === "ALL" ? t("controls.allSectors") : s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress */}
        {isScanning && (
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all" style={{ width: `${(results.length / DEFAULT_TICKERS.length) * 100}%` }} />
          </div>
        )}
      </div>

      {/* Results */}
      {filtered.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/60">
                  {[
                    { key: "ticker" as keyof ScanResult, label: t("resultsTable.ticker") },
                    { key: "score" as keyof ScanResult, label: t("resultsTable.score") },
                    { key: "signal" as keyof ScanResult, label: t("resultsTable.signal") },
                    { key: "price" as keyof ScanResult, label: t("resultsTable.price") },
                    { key: "change" as keyof ScanResult, label: t("resultsTable.change") },
                    { key: "rsi" as keyof ScanResult, label: "RSI" },
                    { key: "rvol" as keyof ScanResult, label: "RVOL" },
                    { key: "bearScore" as keyof ScanResult, label: "Bear" },
                    { key: "persistenceScore" as keyof ScanResult, label: "PDT" },
                  ].map((col) => (
                    <th key={col.key} onClick={() => handleSort(col.key)} className="px-3 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white text-left">
                      {col.label} {sortKey === col.key && (sortDir === "asc" ? "↑" : "↓")}
                    </th>
                  ))}
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <>
                    <tr key={r.ticker} className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-all cursor-pointer" onClick={() => setExpandedRow(expandedRow === r.ticker ? null : r.ticker)}>
                      <td className="px-3 py-3">
                        <span className="font-semibold text-white">{r.ticker}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`font-bold ${r.score >= 75 ? "text-emerald-400" : r.score >= 60 ? "text-teal-400" : "text-slate-400"}`}>{r.score}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium border ${signalColors[r.signal] || signalColors.NEUTRAL}`}>{r.signal}</span>
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-300">${r.price.toFixed(2)}</td>
                      <td className="px-3 py-3">
                        <span className={`text-sm font-medium ${r.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>{r.change >= 0 ? "+" : ""}{r.change.toFixed(2)}%</span>
                      </td>
                      <td className="px-3 py-3 text-sm text-slate-400">{r.rsi.toFixed(1)}</td>
                      <td className="px-3 py-3 text-sm text-slate-400">{r.rvol.toFixed(2)}x</td>
                      <td className="px-3 py-3">
                        <span className={`text-sm font-medium ${(r.bearScore ?? 0) >= 60 ? "text-red-400" : "text-slate-500"}`}>{r.bearScore ?? "—"}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${r.isT1Suitable ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                          {r.isT1Suitable ? "✓" : "✗"} {r.persistenceScore}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {expandedRow === r.ticker ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </td>
                    </tr>
                    {/* Expanded Detail */}
                    {expandedRow === r.ticker && (
                      <tr>
                        <td colSpan={11} className="px-4 py-4 bg-slate-900/80">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* AI Catalyst */}
                            <div className={`rounded-lg p-3 border ${r.catalystScore === 1 ? "bg-red-500/10 border-red-500/20" : r.catalystScore === 3 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-slate-800/40 border-slate-700/30"}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <Brain className={`w-4 h-4 ${r.catalystScore === 1 ? "text-red-400" : r.catalystScore === 3 ? "text-emerald-400" : "text-slate-400"}`} />
                                <span className="text-xs font-medium text-slate-300">AI {t("scan.results")}</span>
                                <span className={`text-xs font-bold ml-auto ${r.catalystScore === 1 ? "text-red-400" : r.catalystScore === 3 ? "text-emerald-400" : "text-slate-400"}`}>{r.catalystScore}/3</span>
                              </div>
                              <p className="text-[10px] text-slate-400">Haber analizi sonucu</p>
                            </div>
                            {/* Microstructure */}
                            <div className={`rounded-lg p-3 border ${r.microReversalRisk === "HIGH" ? "bg-red-500/10 border-red-500/20" : r.microReversalRisk === "MEDIUM" ? "bg-amber-500/10 border-amber-500/20" : "bg-slate-800/40 border-slate-700/30"}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <Activity className={`w-4 h-4 ${r.microReversalRisk === "HIGH" ? "text-red-400" : r.microReversalRisk === "MEDIUM" ? "text-amber-400" : "text-slate-400"}`} />
                                <span className="text-xs font-medium text-slate-300">Microstructure</span>
                                <span className={`text-xs font-bold ml-auto ${r.microReversalRisk === "HIGH" ? "text-red-400" : r.microReversalRisk === "MEDIUM" ? "text-amber-400" : "text-emerald-400"}`}>{r.microReversalRisk}</span>
                              </div>
                              <p className="text-[10px] text-slate-400">Yorgunluk: {r.microScore}/100</p>
                            </div>
                            {/* Mini Chart */}
                            <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30">
                              <span className="text-xs font-medium text-slate-300">Skor Trendi</span>
                              <ResponsiveContainer width="100%" height={60}>
                                <AreaChart data={Array.from({ length: 10 }, (_, i) => ({ v: Math.max(30, r.score + (Math.random() - 0.5) * 20) }))}>
                                  <Area type="monotone" dataKey="v" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        
        </div>
      )}
    </div>
  );
}
