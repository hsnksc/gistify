import { useState, useCallback } from "react";
import { NASDAQ_TICKERS, NYSE_TICKERS } from "@/lib/yahooFinance";
import { fetchStockData } from "@/lib/dataProviders";
import { analyzeStockFull, calculateBearScore, calculatePersistenceScore } from "@/lib/momentum";
import { TRAINED_WEIGHTS, TRAINED_THRESHOLDS, getDayAdjustment, SECTOR_BONUS, getModelDescription } from "@/lib/trainedModel";
import { runBrowserTraining, saveTrainingResults, loadTrainingResults } from "@/lib/browserTrainer";
import { sanityGate } from "@/lib/sanityGate";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Loader2, Radar, TrendingUp, TrendingDown, Zap, Target,
  ArrowUpRight, ChevronDown, ChevronUp, Shield, Activity,
  Volume2, BarChart3, Clock, Award, AlertTriangle, RefreshCw
} from "lucide-react";

const ALL_TICKERS = [...NASDAQ_TICKERS, ...NYSE_TICKERS];

interface ScanResult {
  ticker: string;
  name: string;
  sector: string;
  exchange: string;
  currentPrice: number;
  priceChangePct: number;
  score: number;
  signal: string;
  rvol: number;
  gapPct: number;
  rsi: number;
  vwapDev: number;
  orbScore: number;
  structureScore: number;
  reasons: string[];
  confidence: "HIGH" | "MEDIUM" | "LOW";
  targetPrice: number;
  // v4.2: Çift yönlü motor
  bearScore?: number;
  bearSignal?: string;
  persistenceScore?: number;
  isT1Suitable?: boolean;
}

export default function SmartScanner() {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, ticker: "" });
  const [showModel, setShowModel] = useState(false);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [scanComplete, setScanComplete] = useState(false);
  const [useNYSE, setUseNYSE] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const [trainProgress, setTrainProgress] = useState({ current: 0, total: 0, ticker: "", status: "" });
  const [trainResults, setTrainResults] = useState<ReturnType<typeof loadTrainingResults>>(null);
  const [showTrainPanel, setShowTrainPanel] = useState(false);

  const tickers = useNYSE ? ALL_TICKERS : NASDAQ_TICKERS;

  const runTraining = useCallback(async () => {
    setIsTraining(true);
    setTrainResults(null);

    const results = await runBrowserTraining((current, total, ticker, status) => {
      setTrainProgress({ current, total, ticker, status });
    });

    if (results) {
      saveTrainingResults(results);
      setTrainResults({ ...results, trainedAt: new Date().toISOString() });
    }

    setIsTraining(false);
  }, []);

  const runScan = useCallback(async () => {
    setIsScanning(true);
    setResults([]);
    setScanComplete(false);
    setProgress({ current: 0, total: tickers.length, ticker: "" });

    const scanned: ScanResult[] = [];
    const CHUNK = 4;

    for (let i = 0; i < tickers.length; i += CHUNK) {
      const chunk = tickers.slice(i, i + CHUNK);

      const settled = await Promise.allSettled(
        chunk.map(async (ticker) => {
          try {
            const data = await fetchStockData(ticker);
            if (!data) return null;

            const analysis = analyzeStockFull(data);
            if (!analysis) return null;

            // Eğitilmiş model ile skor hesapla
            const adjScore = analysis.score + getDayAdjustment() + (SECTOR_BONUS[analysis.sector] || 0);
            const finalScore = Math.max(0, Math.min(100, adjScore));

            // Confidence
            const confidence: ScanResult["confidence"] =
              analysis.volumeRatio >= 2 && analysis.gapScore >= 60 ? "HIGH"
              : analysis.volumeRatio >= 1.5 ? "MEDIUM"
              : "LOW";

            // Nedenler
            const reasons: string[] = [];
            if (analysis.volumeRatio >= TRAINED_THRESHOLDS.strongRvol)
              reasons.push(`RVOL ${analysis.volumeRatio.toFixed(1)}x — Güçlü hacim onayı`);
            else if (analysis.volumeRatio >= TRAINED_THRESHOLDS.minRvol)
              reasons.push(`RVOL ${analysis.volumeRatio.toFixed(1)}x — Yeterli hacim`);

            if (analysis.gapScore >= 60)
              reasons.push(`GAP +${((data.open[data.open.length - 1] - data.prevClose) / data.prevClose * 100).toFixed(1)}% — Momentumcu açılış`);

            if (analysis.orbScore >= 70)
              reasons.push(`ORB ${analysis.orbScore} — Opening range kırılımı`);

            if (analysis.vwapDeviation > TRAINED_THRESHOLDS.minVwapDeviation)
              reasons.push(`VWAP üstünde +${analysis.vwapDeviation.toFixed(2)}% — Boğa kontrolü`);

            if (analysis.rsi >= TRAINED_THRESHOLDS.rsiMin && analysis.rsi <= TRAINED_THRESHOLDS.rsiMax)
              reasons.push(`RSI ${analysis.rsi} — Optimum momentum bölgesi`);

            if (analysis.structureScore >= TRAINED_THRESHOLDS.minStructureScore)
              reasons.push(`Yapı skoru ${analysis.structureScore} — Yükselen trend`);

            const exchange = NYSE_TICKERS.includes(ticker) ? "NYSE" : "NASDAQ";

            // Signal
            let signal: string;
            if (finalScore >= 78) signal = "GÜÇLÜ AL";
            else if (finalScore >= 65) signal = "AL";
            else if (finalScore >= 55) signal = "ZAYIF AL";
            else if (finalScore >= 40) signal = "NÖTR";
            else signal = "BEKLE";

            // Threshold filtresi
            if (finalScore < TRAINED_THRESHOLDS.minMomentumScore) return null;

            // v4.2: Çift yönlü skorlama
            const bearResult = calculateBearScore(data as any);
            const persistence = calculatePersistenceScore(data as any, finalScore > 50 ? "BULL" : "BEAR");

            return {
              ticker: analysis.ticker,
              name: analysis.name,
              sector: analysis.sector,
              exchange,
              currentPrice: analysis.currentPrice,
              priceChangePct: analysis.priceChangePct,
              score: finalScore,
              signal,
              rvol: analysis.volumeRatio,
              gapPct: ((data.open[data.open.length - 1] - data.prevClose) / data.prevClose * 100),
              rsi: analysis.rsi,
              vwapDev: analysis.vwapDeviation,
              orbScore: analysis.orbScore,
              structureScore: analysis.structureScore,
              reasons,
              confidence,
              targetPrice: analysis.targetPrice || analysis.currentPrice * 1.02,
              // v4.2: Çift yönlü motor verileri
              bearScore: bearResult.score,
              bearSignal: bearResult.signal,
              persistenceScore: persistence.score,
              isT1Suitable: persistence.isT1Suitable,
            } as ScanResult;
          } catch {
            return null;
          }
        })
      );

      for (let j = 0; j < settled.length; j++) {
        if (settled[j].status === "fulfilled" && settled[j].value) {
          scanned.push(settled[j].value as ScanResult);
        }
        setProgress({ current: Math.min(i + j + 1, tickers.length), total: tickers.length, ticker: chunk[j] });
      }
    }

    // Skora göre sırala
    scanned.sort((a, b) => b.score - a.score);
    setResults(scanned);
    setScanComplete(true);
    setIsScanning(false);
  }, [tickers]);

  const getScoreColor = (s: number) =>
    s >= 80 ? "text-emerald-400" : s >= 65 ? "text-teal-400" : s >= 55 ? "text-cyan-400" : "text-slate-400";

  const getScoreBg = (s: number) =>
    s >= 80 ? "bg-emerald-500" : s >= 65 ? "bg-teal-500" : s >= 55 ? "bg-cyan-500" : "bg-slate-500";

  const selected = results.find((r) => r.ticker === selectedStock);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-500/20">
            <Radar className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-white">Momentum Scanner</h1>
            <p className="text-sm text-slate-400">
              Eğitilmiş model + Gerçek zamanlı veri
            </p>
          </div>
        </div>

        {/* Model açıklaması + Eğitim butonu */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => setShowModel(!showModel)}
            className="text-xs text-emerald-400/70 hover:text-emerald-400 underline transition-colors"
          >
            {showModel ? "Model detayını gizle" : "Model detayı"}
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => setShowTrainPanel(!showTrainPanel)}
            className="text-xs text-amber-400/70 hover:text-amber-400 underline transition-colors"
          >
            {showTrainPanel ? "Eğitim panelini gizle" : "Modeli Eğit"}
          </button>
        </div>
        {showModel && (
          <div className="text-xs text-slate-500 bg-slate-900/50 border border-slate-700/30 rounded-xl p-3 text-left max-w-lg mx-auto whitespace-pre-line">
            {getModelDescription()}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          onClick={runScan}
          disabled={isScanning}
          className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-6 rounded-2xl text-lg font-semibold transition-all shadow-lg shadow-emerald-500/20"
        >
          {isScanning ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Radar className="w-5 h-5 mr-2" />}
          {isScanning ? "Taranıyor..." : "TARA"}
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-slate-400">NASDAQ</Label>
            <Switch checked={useNYSE} onCheckedChange={setUseNYSE} />
            <Label className="text-xs text-slate-400">NASDAQ+NYSE ({tickers.length})</Label>
          </div>
        </div>
      </div>

      {/* Training Panel */}
      {showTrainPanel && (
        <div className="max-w-3xl mx-auto bg-amber-900/10 border border-amber-500/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-amber-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Model Eğitimi (Gerçek Geçmiş Veriler)
            </h3>
            {trainResults && (
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                Eğitildi: {new Date(trainResults.trainedAt).toLocaleDateString("tr-TR")}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400">
            30 en likit hisse üzerinde 1 yıllık geçmiş veri çekilir, walk-forward simülasyon yapılır,
            optimal parametreler bulunur. Eğitim sonuçları tarayıcınızda saklanır.
          </p>

          {!isTraining && !trainResults && (
            <Button onClick={runTraining} className="bg-amber-500 hover:bg-amber-400 text-white px-6 rounded-xl">
              <Zap className="w-4 h-4 mr-2" />
              Eğitimi Başlat (~2 dk)
            </Button>
          )}

          {isTraining && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-amber-400">{trainProgress.ticker} {trainProgress.status}</span>
                <span className="text-slate-400">{trainProgress.current} / {trainProgress.total}</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${(trainProgress.current / trainProgress.total) * 100}%` }} />
              </div>
            </div>
          )}

          {trainResults && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-slate-500">Analiz Edilen Trade</p>
                  <p className="text-lg font-bold text-white">{trainResults.totalTrades}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-slate-500">En İyi WR</p>
                  <p className="text-lg font-bold text-emerald-400">%{trainResults.bestWinRate}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-slate-500">Optimal Skor</p>
                  <p className="text-lg font-bold text-cyan-400">{trainResults.optimalScoreThreshold}+</p>
                </div>
              </div>

              {trainResults.scoreThresholds.length > 0 && (
                <div>
                  <p className="text-xs text-slate-400 mb-2">Skor Threshold Analizi:</p>
                  <div className="space-y-1">
                    {trainResults.scoreThresholds.map((s) => (
                      <div key={s.threshold} className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 w-12">Skor {s.threshold}+</span>
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.wr >= 55 ? "bg-emerald-500" : s.wr >= 45 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${Math.min(s.wr, 100)}%` }} />
                        </div>
                        <span className={`text-xs w-10 text-right ${s.wr >= 55 ? "text-emerald-400" : "text-slate-400"}`}>%{s.wr}</span>
                        <span className="text-[10px] text-slate-600 w-10 text-right">n={s.trades}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={runTraining} disabled={isTraining} variant="outline" className="text-amber-400 border-amber-500/30">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Yeniden Eğit
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progress */}
      {isScanning && (
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-slate-400 mb-1">
            <span>{progress.ticker}</span>
            <span>{progress.current} / {progress.total}</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 text-center mt-2">
            {Math.round((progress.current / progress.total) * 100)}% — Chunk'lı paralel tarama
          </p>
        </div>
      )}

      {/* Results Summary */}
      {scanComplete && results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-500">Bulunan Hisse</p>
            <p className="text-2xl font-bold text-white">{results.length}</p>
          </div>
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-3 text-center">
            <p className="text-xs text-emerald-400/70">En Yüksek Skor</p>
            <p className="text-2xl font-bold text-emerald-400">{results[0].score}</p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-500">Ortalama Skor</p>
            <p className="text-2xl font-bold text-cyan-400">
              {Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)}
            </p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-500">Ortalama RVOL</p>
            <p className="text-2xl font-bold text-amber-400">
              {(results.reduce((s, r) => s + r.rvol, 0) / results.length).toFixed(1)}x
            </p>
          </div>
        </div>
      )}

      {/* Top Pick */}
      {scanComplete && results.length > 0 && (
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-medium text-amber-400">Günün En Güçlü Adayı</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-white">{results[0].ticker}</span>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {results[0].signal}
                </span>
              </div>
              <p className="text-sm text-slate-400">{results[0].name} • {results[0].sector} • {results[0].exchange}</p>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-black ${getScoreColor(results[0].score)}`}>{results[0].score}</p>
              <p className="text-xs text-slate-500">Eğitilmiş Model Skoru</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {results[0].reasons.map((r, i) => (
              <span key={i} className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div className="max-w-4xl mx-auto bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Devam Edecek Hisse Adayları ({results.length})
            </h3>
            <span className="text-xs text-slate-500">Skor {TRAINED_THRESHOLDS.minMomentumScore}+ filtreli</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800/50 text-left text-xs text-slate-400">
                  <th className="px-3 py-3">#</th>
                  <th className="px-3 py-3">Hisse</th>
                  <th className="px-3 py-3 text-center">Skor</th>
                  <th className="px-3 py-3 text-center">Sinyal</th>
                  <th className="px-3 py-3 text-center">Fiyat</th>
                  <th className="px-3 py-3 text-center">Değişim</th>
                  <th className="px-3 py-3 text-center">RVOL</th>
                  <th className="px-3 py-3 text-center">RSI</th>
                  {/* v4.2: Çift yönlü sütunlar */}
                  <th className="px-3 py-3 text-center text-red-400/70">Bear</th>
                  <th className="px-3 py-3 text-center text-emerald-400/70">PDT</th>
                  <th className="px-3 py-3 text-center">Hedef</th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/20">
                {results.map((r, i) => (
                  <>
                    <tr
                      key={r.ticker}
                      className="hover:bg-slate-700/20 transition-colors cursor-pointer"
                      onClick={() => setSelectedStock(selectedStock === r.ticker ? null : r.ticker)}
                    >
                      <td className="px-3 py-3">
                        <span className={`text-xs font-bold ${i < 3 ? "text-emerald-400" : "text-slate-500"}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-semibold text-white">{r.ticker}</div>
                            <div className="text-[10px] text-slate-500">{r.exchange}</div>
                          </div>
                          {r.confidence === "HIGH" && (
                            <Shield className="w-3.5 h-3.5 text-emerald-400" title="Yüksek güven" />
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`text-lg font-bold ${getScoreColor(r.score)}`}>{r.score}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          r.score >= 80 ? "bg-emerald-500/20 text-emerald-400" :
                          r.score >= 65 ? "bg-teal-500/20 text-teal-400" :
                          r.score >= 55 ? "bg-cyan-500/20 text-cyan-400" :
                          "bg-slate-500/20 text-slate-400"
                        }`}>
                          {r.signal}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center text-slate-300">${r.currentPrice.toFixed(2)}</td>
                      <td className="px-3 py-3 text-center">
                        <span className={`${r.priceChangePct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {r.priceChangePct >= 0 ? "+" : ""}{r.priceChangePct.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={r.rvol >= 3 ? "text-emerald-400 font-medium" : r.rvol >= 2 ? "text-teal-400" : "text-slate-400"}>
                          {r.rvol.toFixed(1)}x
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`${r.rsi >= 70 ? "text-amber-400" : r.rsi >= 55 ? "text-emerald-400" : "text-slate-400"}`}>
                          {r.rsi.toFixed(1)}
                        </span>
                      </td>
                      {/* v4.2: Bear Skoru */}
                      <td className="px-3 py-3 text-center">
                        <span className={`text-sm font-medium ${(r.bearScore ?? 0) >= 60 ? "text-red-400" : (r.bearScore ?? 0) >= 45 ? "text-orange-400" : "text-slate-500"}`}>
                          {r.bearScore ?? "—"}
                        </span>
                      </td>
                      {/* v4.2: PDT Persistence Badge */}
                      <td className="px-3 py-3 text-center">
                        {(r.persistenceScore !== undefined) ? (
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            (r.isT1Suitable ?? false)
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-red-500/15 text-red-400"
                          }`}>
                            {(r.isT1Suitable ?? false) ? "✓" : "✗"} {r.persistenceScore}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center text-emerald-400">${r.targetPrice.toFixed(2)}</td>
                      <td className="px-3 py-3 text-center">
                        {selectedStock === r.ticker ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </td>
                    </tr>
                    {selectedStock === r.ticker && (
                      <tr>
                        <td colSpan={12} className="px-4 py-4 bg-slate-900/50">
                          {/* v4.2: Çift yönlü detay grid */}
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-3">
                            <DetailStat icon={<Zap className="w-4 h-4 text-amber-400" />} label="Gap" value={`+${r.gapPct.toFixed(2)}%`} />
                            <DetailStat icon={<Target className="w-4 h-4 text-purple-400" />} label="ORB" value={r.orbScore.toString()} />
                            <DetailStat icon={<BarChart3 className="w-4 h-4 text-teal-400" />} label="VWAP Sapma" value={`+${r.vwapDev.toFixed(2)}%`} />
                            <DetailStat icon={<Activity className="w-4 h-4 text-cyan-400" />} label="Yapı" value={r.structureScore.toString()} />
                            {/* v4.2: Bear + PDT */}
                            <DetailStat icon={<TrendingDown className="w-4 h-4 text-red-400" />} label="Bear Skor" value={r.bearScore?.toString() ?? "—"} />
                            <DetailStat icon={<Clock className="w-4 h-4 text-emerald-400" />} label="PDT" value={r.isT1Suitable ? `✓ ${r.persistenceScore}` : `✗ ${r.persistenceScore}`} />
                          </div>
                          {/* v4.3: AI Catalyst + Microstructure */}
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            {/* AI Catalyst */}
                            <div className={`rounded-lg p-2 border ${
                              (r.catalystScore === 1) ? "bg-red-500/10 border-red-500/20" :
                              (r.catalystScore === 3) ? "bg-emerald-500/10 border-emerald-500/20" :
                              "bg-slate-800/40 border-slate-700/30"
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                <Activity className={`w-4 h-4 ${
                                  r.catalystScore === 1 ? "text-red-400" : r.catalystScore === 3 ? "text-emerald-400" : "text-slate-400"
                                }`} />
                                <span className="text-xs font-medium text-slate-300">AI Katalizör</span>
                                <span className={`text-xs font-bold ml-auto ${
                                  r.catalystScore === 1 ? "text-red-400" : r.catalystScore === 3 ? "text-emerald-400" : "text-slate-400"
                                }`}>{r.catalystScore}/3</span>
                              </div>
                              <p className="text-[10px] text-slate-400">{r.catalystSummary || "Nötr"}</p>
                              {r.catalystFlags && r.catalystFlags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {r.catalystFlags.map((f, i) => (
                                    <span key={i} className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">{f}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            {/* Microstructure */}
                            <div className={`rounded-lg p-2 border ${
                              (r.microReversalRisk === "HIGH") ? "bg-red-500/10 border-red-500/20" :
                              (r.microReversalRisk === "MEDIUM") ? "bg-amber-500/10 border-amber-500/20" :
                              "bg-slate-800/40 border-slate-700/30"
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                <BarChart3 className={`w-4 h-4 ${
                                  r.microReversalRisk === "HIGH" ? "text-red-400" : r.microReversalRisk === "MEDIUM" ? "text-amber-400" : "text-slate-400"
                                }`} />
                                <span className="text-xs font-medium text-slate-300">Microstructure</span>
                                <span className={`text-xs font-bold ml-auto ${
                                  r.microReversalRisk === "HIGH" ? "text-red-400" : r.microReversalRisk === "MEDIUM" ? "text-amber-400" : "text-emerald-400"
                                }`}>{r.microReversalRisk || "LOW"}</span>
                              </div>
                              <p className="text-[10px] text-slate-400">
                                Yorgunluk: {r.microScore ?? 0}/100
                                {r.microWarning && <span className="text-red-400 block mt-0.5">{r.microWarning}</span>}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            {r.reasons.map((reason, j) => (
                              <p key={j} className="text-xs text-slate-400 flex items-start gap-2">
                                <ArrowUpRight className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                                {reason}
                              </p>
                            ))}
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

      {scanComplete && results.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Kriterlere uygun hisse bulunamadı</p>
          <p className="text-sm">Tüm hisseler minimum skorun altında kaldı.</p>
        </div>
      )}
    </div>
  );
}

function DetailStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-2 flex items-center gap-2">
      {icon}
      <div>
        <p className="text-[10px] text-slate-500">{label}</p>
        <p className="text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
