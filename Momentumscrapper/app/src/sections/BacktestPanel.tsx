import { useState } from "react";
import type { BacktestSummary, BacktestProgress } from "@/lib/backtestEngine";
import { runBacktest } from "@/lib/backtestEngine";
import ConsistencyReportPanel from "./ConsistencyReportPanel";
import { NASDAQ_TICKERS } from "@/lib/yahooFinance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Loader2, Play, TrendingUp, TrendingDown, BarChart3, Target,
  Calendar, Shield, Award, AlertTriangle, ChevronDown, ChevronUp,
  Brain, Zap, FileText
} from "lucide-react";

const DEFAULT_CONFIG = {
  tickers: NASDAQ_TICKERS,
  startDate: (() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return d.toISOString().split("T")[0];
  })(),
  endDate: new Date().toISOString().split("T")[0],
  entryScoreThreshold: 60,
  tpPct: 3.0,
  slPct: 2.0,
  maxPositionsPerDay: 5,
  positionSizePct: 20,
};

export default function BacktestPanel() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<BacktestProgress | null>(null);
  const [result, setResult] = useState<BacktestSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAllTrades, setShowAllTrades] = useState(false);
  const [useTop30, setUseTop30] = useState(true);
  const [resultTab, setResultTab] = useState<"overview" | "consistency">("overview");

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    setResult(null);
    setProgress({ phase: "FETCHING", current: 0, total: 1, detail: "Veriler yükleniyor..." });

    try {
      const backtestConfig = {
        ...config,
        tickers: useTop30 ? NASDAQ_TICKERS.slice(0, 30) : NASDAQ_TICKERS,
      };

      const summary = await runBacktest(backtestConfig);

      if (summary.totalTrades === 0) {
        setError("Seçilen tarih aralığında yeterli veri bulunamadı. Tarih aralığını genişletin.");
      } else {
        setResult(summary);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Backtest sırasında hata oluştu");
    } finally {
      setIsRunning(false);
      setProgress(null);
    }
  };

  const updateConfig = (key: string, value: string | number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mb-8 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
      <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-400" />
        Walk-Forward Backtest & Eğitim Motoru
      </h2>
      <p className="text-sm text-slate-400 mb-4">
        Geçmiş verilerle momentum stratejisini test eder. Her gün açılıştan itibaren skor hesaplanır, aynı gün kapanışta P&L değerlendirilir.
      </p>

      {/* Config */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <Label className="text-xs text-slate-400 mb-1.5 block">Başlangıç Tarihi</Label>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
            <Input type="date" value={config.startDate}
              onChange={(e) => updateConfig("startDate", e.target.value)}
              className="pl-9 bg-slate-800/50 border-slate-700 text-white text-sm" />
          </div>
        </div>
        <div>
          <Label className="text-xs text-slate-400 mb-1.5 block">Bitiş Tarihi</Label>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
            <Input type="date" value={config.endDate}
              onChange={(e) => updateConfig("endDate", e.target.value)}
              className="pl-9 bg-slate-800/50 border-slate-700 text-white text-sm" />
          </div>
        </div>
        <div>
          <Label className="text-xs text-slate-400 mb-1.5 block">Min. Skor (Entry)</Label>
          <Input type="number" value={config.entryScoreThreshold}
            onChange={(e) => updateConfig("entryScoreThreshold", parseInt(e.target.value) || 60)}
            min={30} max={100}
            className="bg-slate-800/50 border-slate-700 text-white text-sm" />
        </div>
        <div>
          <Label className="text-xs text-slate-400 mb-1.5 block">Günde Max Hisse</Label>
          <Input type="number" value={config.maxPositionsPerDay}
            onChange={(e) => updateConfig("maxPositionsPerDay", parseInt(e.target.value) || 5)}
            min={1} max={20}
            className="bg-slate-800/50 border-slate-700 text-white text-sm" />
        </div>
        <div>
          <Label className="text-xs text-slate-400 mb-1.5 block">Kar Al (TP %)</Label>
          <Input type="number" value={config.tpPct} step="0.5"
            onChange={(e) => updateConfig("tpPct", parseFloat(e.target.value) || 3.0)}
            className="bg-slate-800/50 border-slate-700 text-white text-sm" />
        </div>
        <div>
          <Label className="text-xs text-slate-400 mb-1.5 block">Zarar Durdur (SL %)</Label>
          <Input type="number" value={config.slPct} step="0.5"
            onChange={(e) => updateConfig("slPct", parseFloat(e.target.value) || 2.0)}
            className="bg-slate-800/50 border-slate-700 text-white text-sm" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-slate-400">İlk 30 Hisse</Label>
            <Switch checked={useTop30} onCheckedChange={setUseTop30} />
          </div>
          <span className="text-xs text-slate-500 mt-4">
            {useTop30 ? "30" : "100"} hisse test edilecek
          </span>
        </div>
      </div>

      <Button onClick={handleRun} disabled={isRunning}
        className="bg-purple-500 hover:bg-purple-400 text-white px-6 py-2 rounded-xl transition-all">
        {isRunning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
        {isRunning ? "Simülasyon çalışıyor..." : "Backtest & Eğit"}
      </Button>

      {isRunning && progress && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 text-sm flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {progress.detail}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* Sekme Navigasyonu */}
          <div className="flex items-center gap-2 border-b border-slate-700/50 pb-2">
            <button
              onClick={() => setResultTab("overview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                resultTab === "overview"
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Genel Bakış
            </button>
            <button
              onClick={() => setResultTab("consistency")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                resultTab === "consistency"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <FileText className="w-4 h-4" />
              Tutarlılık Raporu
            </button>
          </div>

          {resultTab === "consistency" ? (
            <ConsistencyReportPanel summary={result} />
          ) : (
          <div className="space-y-6">
          {/* Ana Metrikler */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Toplam İşlem" value={result.totalTrades} color="white" />
            <StatCard
              label="Kazanma Oranı"
              value={`%${result.winRate}`}
              color={result.winRate >= 50 ? "emerald" : "red"}
              sub={`${result.winningTrades}W / ${result.losingTrades}L`}
            />
            <StatCard
              label="Toplam P&L"
              value={`${result.totalPnLPct >= 0 ? "+" : ""}${result.totalPnLPct}%`}
              color={result.totalPnLPct >= 0 ? "emerald" : "red"}
              sub={`Ort: ${result.avgTradePnL}%`}
            />
            <StatCard label="Sharpe Ratio" value={result.sharpeRatio} color="cyan" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Profit Factor" value={result.profitFactor} color="purple" />
            <StatCard label="Max Drawdown" value={`-${result.maxDrawdownPct}%`} color="red" />
            <StatCard label="Ort. Kazanç" value={`+${result.avgWinPct}%`} color="emerald" />
            <StatCard label="Ort. Kayıp" value={`${result.avgLossPct}%`} color="red" />
          </div>

          {/* Exit Dağılımı */}
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
            <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              Çıkış Nedenleri
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <ExitBadge label="TP (Kar Al)" value={result.tpHitRate} color="emerald" />
              <ExitBadge label="SL (Zarar Durdur)" value={result.slHitRate} color="red" />
              <ExitBadge label="EOD (Gün Sonu)" value={result.eodRate} color="slate" />
            </div>
          </div>

          {/* Skor Seviyesine Göre Performans */}
          {result.performanceByScore.length > 0 && (
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
              <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Skor Seviyesine Göre Performans
              </h3>
              <div className="space-y-2">
                {result.performanceByScore.map((p) => (
                  <div key={p.scoreRange} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-16">{p.scoreRange}</span>
                    <div className="flex-1 h-4 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${p.winRate >= 50 ? "bg-emerald-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min(p.winRate, 100)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium w-12 text-right ${p.winRate >= 50 ? "text-emerald-400" : "text-red-400"}`}>
                      %{p.winRate}
                    </span>
                    <span className="text-xs text-slate-500 w-16 text-right">
                      {p.trades} işlem
                    </span>
                    <span className={`text-xs w-20 text-right ${p.avgPnL >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {p.avgPnL >= 0 ? "+" : ""}{p.avgPnL}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Güne Göre Performans */}
          {result.performanceByDay.length > 0 && (
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
              <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Haftanın Gününe Göre Performans
              </h3>
              <div className="space-y-2">
                {result.performanceByDay.map((p) => (
                  <div key={p.day} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-20">{p.day}</span>
                    <div className="flex-1 h-4 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${p.winRate >= 50 ? "bg-emerald-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min(p.winRate, 100)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium w-12 text-right ${p.winRate >= 50 ? "text-emerald-400" : "text-red-400"}`}>
                      %{p.winRate}
                    </span>
                    <span className="text-xs text-slate-500 w-16 text-right">
                      {p.trades} işlem
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best / Worst Trade */}
          {result.bestTrade && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">En İyi İşlem</span>
                </div>
                <p className="text-lg font-bold text-emerald-400">+{result.bestTrade.pnlPct}%</p>
                <p className="text-xs text-slate-400">{result.bestTrade.ticker} — {result.bestTrade.date}</p>
                <p className="text-xs text-slate-500">Skor: {result.bestTrade.score} | RVOL: {result.bestTrade.rvol}x</p>
              </div>
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-red-400 font-medium">En Kötü İşlem</span>
                </div>
                <p className="text-lg font-bold text-red-400">{result.worstTrade?.pnlPct}%</p>
                <p className="text-xs text-slate-400">{result.worstTrade?.ticker} — {result.worstTrade?.date}</p>
                <p className="text-xs text-slate-500">Skor: {result.worstTrade?.score} | RVOL: {result.worstTrade?.rvol}x</p>
              </div>
            </div>
          )}

          {/* Tüm İşlemler */}
          {result.trades.length > 0 && (
            <div className="bg-slate-900/50 rounded-xl border border-slate-700/30 overflow-hidden">
              <button
                onClick={() => setShowAllTrades(!showAllTrades)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-slate-300">Tüm İşlemler</span>
                  <span className="text-xs text-slate-500">({result.trades.length} işlem)</span>
                </div>
                {showAllTrades ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {showAllTrades && (
                <div className="px-4 pb-4 overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-slate-400 border-b border-slate-700/50">
                        <th className="py-2 px-2">Tarih</th>
                        <th className="py-2 px-2">Hisse</th>
                        <th className="py-2 px-2 text-right">Skor</th>
                        <th className="py-2 px-2 text-right">Giriş</th>
                        <th className="py-2 px-2 text-right">Çıkış</th>
                        <th className="py-2 px-2 text-right">P&L</th>
                        <th className="py-2 px-2 text-center">Neden</th>
                        <th className="py-2 px-2 text-center">RSI</th>
                        <th className="py-2 px-2 text-center">RVOL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/20">
                      {result.trades.map((trade, i) => (
                        <tr key={i} className="hover:bg-slate-800/30">
                          <td className="py-1.5 px-2 text-slate-400">{trade.date}</td>
                          <td className="py-1.5 px-2 font-medium text-white">{trade.ticker}</td>
                          <td className="py-1.5 px-2 text-right">
                            <span className={`${trade.score >= 75 ? "text-emerald-400" : trade.score >= 60 ? "text-teal-400" : "text-cyan-400"}`}>
                              {trade.score}
                            </span>
                          </td>
                          <td className="py-1.5 px-2 text-right text-slate-300">${trade.entryPrice.toFixed(2)}</td>
                          <td className="py-1.5 px-2 text-right text-slate-300">${trade.exitPrice.toFixed(2)}</td>
                          <td className={`py-1.5 px-2 text-right font-bold ${trade.pnlPct > 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {trade.pnlPct > 0 ? "+" : ""}{trade.pnlPct.toFixed(2)}%
                          </td>
                          <td className="py-1.5 px-2 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              trade.exitReason === "TP" ? "bg-emerald-500/20 text-emerald-400" :
                              trade.exitReason === "SL" ? "bg-red-500/20 text-red-400" :
                              "bg-slate-500/20 text-slate-400"
                            }`}>
                              {trade.exitReason}
                            </span>
                          </td>
                          <td className="py-1.5 px-2 text-center text-slate-400">{trade.rsi.toFixed(1)}</td>
                          <td className="py-1.5 px-2 text-center text-slate-400">{trade.rvol.toFixed(1)}x</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ===================== Alt Bileşenler =====================

function StatCard({ label, value, color, sub }: { label: string; value: string | number; color: string; sub?: string }) {
  const colorClasses: Record<string, string> = {
    white: "text-white",
    emerald: "text-emerald-400",
    red: "text-red-400",
    cyan: "text-cyan-400",
    purple: "text-purple-400",
    amber: "text-amber-400",
    slate: "text-slate-400",
  };
  return (
    <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/30">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`text-xl font-bold ${colorClasses[color] || "text-white"}`}>{value}</p>
      {sub && <p className="text-[10px] text-slate-500">{sub}</p>}
    </div>
  );
}

function ExitBadge({ label, value, color }: { label: string; value: number; color: string }) {
  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    red: "bg-red-500/10 border-red-500/30 text-red-400",
    slate: "bg-slate-500/10 border-slate-500/30 text-slate-400",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  };
  return (
    <div className={`rounded-xl p-3 border text-center ${colorClasses[color]}`}>
      <p className="text-xs opacity-80">{label}</p>
      <p className="text-lg font-bold">%{value}</p>
    </div>
  );
}
