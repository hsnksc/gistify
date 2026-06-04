import type { StockResult } from "@/types/scanner";
import { scoreColor, scoreBg, signalColor, signalBg, signalLabel } from "@/lib/scoreConfig";
import {
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  BarChart3,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Layers,
  Gauge,
  Shield,
  Trophy,
  Info,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

interface StockDetailModalProps {
  stock: StockResult;
  onClose: () => void;
}

export default function StockDetailModal({ stock, onClose }: StockDetailModalProps) {
  const [showExplanations, setShowExplanations] = useState(false);
  const isPositive = stock.priceChangePct >= 0;
  const isMacdPositive = stock.macdHistogram >= 0;
  const isAboveVwap = stock.vwapDeviation > 0;
  const isVwapRising = stock.vwapSlope > 0;

  // v4 skorlar
  const confidence = stock.confidenceScore ?? 50;
  const ranking = stock.rankingScore ?? stock.score;
  const confLabel = stock.confidenceBreakdown?.label ?? "MEDIUM";
  const dataQual = stock.dataQuality ?? "FAIR";

  const getRsiSignal = (rsi: number) => {
    if (rsi >= 80) return { text: "AŞIRI ALIM", color: "text-amber-400", bg: "bg-amber-500/10" };
    if (rsi >= 65) return { text: "GÜÇLÜ", color: "text-emerald-400", bg: "bg-emerald-500/10" };
    if (rsi >= 55) return { text: "YUKARI", color: "text-teal-400", bg: "bg-teal-500/10" };
    if (rsi >= 45) return { text: "NÖTR", color: "text-cyan-400", bg: "bg-cyan-500/10" };
    if (rsi >= 35) return { text: "AŞAĞI", color: "text-slate-400", bg: "bg-slate-500/10" };
    return { text: "AŞIRI SATIM", color: "text-red-400", bg: "bg-red-500/10" };
  };

  const getMacdSignal = (hist: number) => {
    if (hist > 1) return { text: "GÜÇLÜ AL", color: "text-emerald-400", icon: ArrowUpRight };
    if (hist > 0) return { text: "AL", color: "text-teal-400", icon: ArrowUpRight };
    if (hist > -0.5) return { text: "ZAYIF", color: "text-slate-400", icon: ArrowDownRight };
    return { text: "SAT", color: "text-red-400", icon: ArrowDownRight };
  };

  const getScoreBar = (score: number, label: string, color: string, explanation?: string) => (
    <div className="mb-2 group relative">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400 flex items-center gap-1">
          {label}
          {explanation && (
            <span className="text-slate-600 cursor-help" title={explanation}>
              <Info className="w-3 h-3" />
            </span>
          )}
        </span>
        <span className={color}>{score}/100</span>
      </div>
      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color.replace("text-", "bg-")}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );

  const rsiSignal = getRsiSignal(stock.rsi);
  const macdSignal = getMacdSignal(stock.macdHistogram);
  const MacdIcon = macdSignal.icon;

  // Confidence badge rengi
  const confBadgeColor = confLabel === "HIGH"
    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    : confLabel === "MEDIUM"
    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
    : "bg-red-500/10 text-red-400 border-red-500/30";

  // Data quality badge
  const dqBadgeColor = dataQual === "GOOD"
    ? "bg-emerald-500/10 text-emerald-400"
    : dataQual === "FAIR"
    ? "bg-amber-500/10 text-amber-400"
    : "bg-red-500/10 text-red-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 p-5 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/20">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{stock.ticker}</h2>
                {/* v4.1 Signal Badge */}
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${signalBg(stock.signal)} text-white`}>
                  {signalLabel(stock.signal)}
                </span>
                {/* Data Quality Badge */}
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${dqBadgeColor}`}>
                  {dataQual}
                </span>
              </div>
              <p className="text-sm text-slate-400">{stock.name} {stock.sector !== "N/A" ? `• ${stock.sector}` : ""}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* v4.1: RSI RED Uyarı Banner */}
          {stock.rsiWarning && (
            <div className={`rounded-xl p-4 border ${stock.signal === "OVERBOUGHT_RED" ? "bg-red-500/10 border-red-500/30" : "bg-orange-500/10 border-orange-500/30"}`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${stock.signal === "OVERBOUGHT_RED" ? "text-red-400" : "text-orange-400"}`} />
                <div>
                  <p className={`text-sm font-semibold ${stock.signal === "OVERBOUGHT_RED" ? "text-red-400" : "text-orange-400"}`}>
                    {stock.signal === "OVERBOUGHT_RED" ? "🚨 AŞIRI ALIM — POZİSYON AÇMA YASAK" : "⚠️ SICAK BÖLGE — YÜKSEK RİSK"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{stock.rsiWarning}</p>
                  {stock.signal === "OVERBOUGHT_RED" && (
                    <p className="text-xs text-red-400 mt-2 font-medium">Skor otomatik olarak 0'a çekildi. Bu hisseye girmek RSI RED filtresi nedeniyle engellendi.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Price Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-400">Mevcut Fiyat</span>
              </div>
              <p className="text-2xl font-bold text-white">${stock.currentPrice.toFixed(2)}</p>
              <div className={`flex items-center gap-1 mt-1 ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{isPositive ? "+" : ""}{stock.priceChangePct.toFixed(2)}%</span>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-400">Momentum Skoru</span>
              </div>
              <p className={`text-2xl font-bold ${scoreColor(stock.score)}`}>
                {stock.score}/100
              </p>
              <div className="w-full h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
                <div className={`h-full rounded-full ${scoreBg(stock.score)}`} style={{ width: `${stock.score}%` }} />
              </div>
            </div>
          </div>

          {/* FAZ 1: Three-Score Dashboard */}
          <div className="grid grid-cols-3 gap-3">
            {/* Momentum Score */}
            <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-slate-400">Momentum</span>
              </div>
              <p className={`text-xl font-bold ${scoreColor(stock.score)}`}>{stock.score}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">%55 ağırlık</p>
            </div>
            {/* Confidence Score */}
            <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-slate-400">Confidence</span>
              </div>
              <p className={`text-xl font-bold ${scoreColor(confidence)}`}>{confidence}</p>
              <div className="flex justify-center mt-0.5">
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${confBadgeColor}`}>
                  {confLabel}
                </span>
              </div>
            </div>
            {/* Ranking Score */}
            <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs text-slate-400">Ranking</span>
              </div>
              <p className={`text-xl font-bold ${scoreColor(ranking)}`}>{ranking}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">#{stock.rankingInfo?.rank ?? "-"}</p>
            </div>
          </div>

          {/* FAZ 1: Confidence Breakdown */}
          {stock.confidenceBreakdown && (
            <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-medium text-slate-300">Confidence Breakdown</h3>
              </div>
              {getScoreBar(stock.confidenceBreakdown.dataCompleteness, "Veri Bütünlüğü", "text-emerald-400", "Tüm kritik veri alanları mevcut mu?")}
              {getScoreBar(stock.confidenceBreakdown.priceRecency, "Fiyat Tazeliği", "text-teal-400", "Son fiyat verisi ne kadar taze?")}
              {getScoreBar(stock.confidenceBreakdown.volumeQuality, "Hacim Kalitesi", "text-cyan-400", "Hacim verisi güvenilir mi?")}
              {getScoreBar(stock.confidenceBreakdown.indicatorReliability, "Gösterge Güvenilirliği", "text-blue-400", "Teknik göstergeler güvenilir mi?")}
            </div>
          )}

          {/* FAZ 1: Ranking Breakdown */}
          {stock.rankingInfo && (
            <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-medium text-slate-300">Ranking Breakdown</h3>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Momentum Katkısı (×0.55):</span>
                  <span className="text-amber-400">{stock.rankingInfo.momentumContribution.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Confidence Katkısı (×0.25):</span>
                  <span className="text-blue-400">{stock.rankingInfo.confidenceContribution.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk/Return (×0.10):</span>
                  <span className="text-teal-400">{stock.rankingInfo.rrContribution.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pattern Bonus (×0.10):</span>
                  <span className="text-purple-400">{stock.rankingInfo.patternBonus.toFixed(1)}</span>
                </div>
                <div className="border-t border-slate-700 pt-1.5 flex justify-between font-medium">
                  <span className="text-slate-300">Final Ranking Score:</span>
                  <span className={`${scoreColor(ranking)}`}>{ranking}/100</span>
                </div>
              </div>
            </div>
          )}

          {/* Component Scores */}
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-medium text-slate-300">Bileşen Skorları</h3>
            </div>
            {getScoreBar(stock.rvolScore, "RVOL (Göreceli Hacim)", "text-blue-400")}
            {getScoreBar(stock.gapScore, "GAP Kalitesi", "text-amber-400")}
            {getScoreBar(stock.orbScore, "ORB (Açılış Kırılım)", "text-purple-400")}
            {getScoreBar(Math.round((isAboveVwap ? 60 : 30) + (isVwapRising ? 20 : 0)), "VWAP Pozisyon/Eğim", "text-teal-400")}
            {getScoreBar(stock.structureScore, "Fiyat Yapısı (HH/HL)", "text-cyan-400")}
            {getScoreBar(stock.rsiShortScore, "RSI Kısa Vade", "text-pink-400")}
            {getScoreBar(stock.atrMomentumScore, "ATR Momentum", "text-orange-400")}
            {getScoreBar(stock.catalystScore, "Katalizör/Analiz", "text-indigo-400")}
          </div>

          {/* FAZ 1: Score Explanations (Collapsible) */}
          {stock.scoreExplanations && stock.scoreExplanations.length > 0 && (
            <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowExplanations(!showExplanations)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-medium text-slate-300">Skor Açıklamaları</h3>
                  <span className="text-xs text-slate-500">({stock.scoreExplanations.length} faktör)</span>
                </div>
                {showExplanations ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {showExplanations && (
                <div className="px-4 pb-4 space-y-2">
                  {stock.scoreExplanations.map((exp, idx) => (
                    <div key={idx} className="bg-slate-900/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-300">{exp.factor}</span>
                          <span className="text-[10px] text-slate-500">(ağırlık: {Math.round(exp.weight * 100)}%)</span>
                        </div>
                        <span className={`text-xs font-bold ${scoreColor(exp.score)}`}>{exp.score}/100</span>
                      </div>
                      <p className="text-xs text-emerald-400 mb-0.5">{exp.reason}</p>
                      <p className="text-[11px] text-slate-500">{exp.detail}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Opening Range */}
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-medium text-slate-300">Açılış Aralığı (İlk 30 dk)</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Açılış</p>
                <p className="text-lg font-semibold text-white">${stock.openPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">30dk Yüksek</p>
                <p className="text-lg font-semibold text-emerald-400">${stock.opening30mHigh.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Açılış Momentumu</p>
                <p className={`text-lg font-semibold ${stock.openingMomentum > 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {stock.openingMomentum > 0 ? "+" : ""}{stock.openingMomentum.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* Volume Analysis */}
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
            <h3 className="text-sm font-medium text-slate-300 mb-3">Hacim Analizi</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Günlük Hacim</p>
                <p className="text-lg font-semibold text-white">{(stock.volume / 1_000_000).toFixed(1)}M</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">30dk Hacim</p>
                <p className="text-lg font-semibold text-cyan-400">{(stock.opening30mVolume / 1_000_000).toFixed(2)}M</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Hacim Oranı (RVOL)</p>
                <p className={`text-lg font-semibold ${stock.volumeRatio >= 2 ? "text-emerald-400" : "text-cyan-400"}`}>
                  {stock.volumeRatio.toFixed(2)}x
                </p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Ort. Hacim (20g): {(stock.avgVolume20d / 1_000_000).toFixed(1)}M</span>
                <span>Ort. $ Hacim: ${(stock.avgDollarVolume / 1_000_000).toFixed(0)}M</span>
              </div>
              <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${stock.volumeRatio >= 3 ? "bg-emerald-500" : stock.volumeRatio >= 2 ? "bg-teal-500" : "bg-cyan-500"}`} style={{ width: `${Math.min(stock.volumeRatio * 25, 100)}%` }} />
              </div>
            </div>
          </div>

          {/* Technical Indicators */}
          <div className="grid grid-cols-2 gap-4">
            {/* RSI */}
            <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-slate-300">RSI</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs text-slate-500">RSI(14)</p>
                  <p className="text-xl font-bold text-white">{stock.rsi.toFixed(1)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">RSI(2) / RSI(7)</p>
                  <p className="text-sm text-slate-300">{stock.rsi2.toFixed(1)} / {stock.rsi7.toFixed(1)}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${rsiSignal.bg} ${rsiSignal.color}`}>
                  {rsiSignal.text}
                </span>
              </div>
              <div className="relative w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-[30%] bg-red-500/30 rounded-l-full" />
                <div className="absolute inset-y-0 left-[30%] w-[40%] bg-emerald-500/20" />
                <div className="absolute inset-y-0 right-0 w-[30%] bg-amber-500/30 rounded-r-full" />
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-cyan-400"
                  style={{ left: `${Math.min(Math.max(stock.rsi, 0), 100)}%`, transform: `translate(-50%, -50%)` }} />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0</span><span>30</span><span>70</span><span>100</span>
              </div>
            </div>

            {/* MACD */}
            <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-slate-300">MACD</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs text-slate-500">Histogram</p>
                  <p className={`text-lg font-bold ${isMacdPositive ? "text-emerald-400" : "text-red-400"}`}>
                    {isMacdPositive ? "+" : ""}{stock.macdHistogram.toFixed(3)}
                  </p>
                </div>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${isMacdPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                  <MacdIcon className="w-3 h-3" />
                  {macdSignal.text}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-500">MACD: </span><span className="text-slate-300">{stock.macd.toFixed(3)}</span></div>
                <div><span className="text-slate-500">Sinyal: </span><span className="text-slate-300">{stock.macdSignal.toFixed(3)}</span></div>
              </div>
            </div>
          </div>

          {/* VWAP & ATR & 52W */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-medium text-slate-300">VWAP</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">VWAP</p>
                  <p className="text-lg font-semibold text-white">${stock.vwap.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Sapma</p>
                  <p className={`text-lg font-semibold ${isAboveVwap ? "text-emerald-400" : "text-red-400"}`}>
                    {isAboveVwap ? "+" : ""}{stock.vwapDeviation.toFixed(2)}%
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Eğim: {isVwapRising ? "Yükselen" : "Düşen"} ({stock.vwapSlope.toFixed(4)})
              </p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-slate-300">ATR (14g)</span>
              </div>
              <p className="text-lg font-semibold text-white">${stock.atr14d.toFixed(4)}</p>
              <p className="text-xs text-slate-500 mt-2">
                ATR Momentum Skoru: {stock.atrMomentumScore}
              </p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-slate-300">52H Aralık</span>
              </div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-500">Düşük: ${stock.low52w.toFixed(2)}</span>
                <span className="text-slate-500">Yüksek: ${stock.high52w.toFixed(2)}</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${stock.range52wPct}%` }} />
              </div>
              <p className="text-xs text-center text-slate-400">
                Pozisyon: <span className="text-white font-medium">%{stock.range52wPct.toFixed(1)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
