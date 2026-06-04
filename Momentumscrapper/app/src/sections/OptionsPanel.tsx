import { useState, useMemo } from "react";
import type { StockResult } from "@/types/scanner";
import type { BiDirectionalSetup, OptionSetup } from "@/types/scanner";
import { recommendBiDirectionalStrategies } from "@/lib/optionsStrategies";
import { calculateBearScore, calculatePersistenceScore } from "@/lib/momentum";
import { isT1Suitable } from "@/lib/executionRules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield, TrendingUp, TrendingDown, AlertTriangle, Target,
  ChevronDown, ChevronUp, Sparkles, DollarSign, Calendar,
  BarChart3, Clock, Activity, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { useTranslation } from "@/i18n/I18nContext";

interface OptionsPanelProps {
  stock: StockResult;
  onClose: () => void;
}

// v4.2: Çift yönlü kart bileşeni
function OptionCard({
  type, setup, stock
}: {
  type: "CALL" | "PUT";
  setup: OptionSetup;
  stock: StockResult;
}) {
  const isCall = type === "CALL";
  const accentColor = isCall ? "emerald" : "red";
  const Icon = isCall ? TrendingUp : TrendingDown;

  const signalColors: Record<string, string> = {
    STRONG_BUY: isCall ? "text-emerald-400 bg-emerald-500/20" : "text-red-400 bg-red-500/20",
    BUY: isCall ? "text-teal-400 bg-teal-500/20" : "text-orange-400 bg-orange-500/20",
    NEUTRAL: "text-slate-400 bg-slate-500/20",
    AVOID: "text-red-500 bg-red-500/10",
  };

  const { t } = useTranslation();
  const signalLabels: Record<string, string> = {
    STRONG_BUY: isCall ? t("signals.STRONG_BUY") : t("signals.STRONG_SELL"),
    BUY: isCall ? t("signals.BUY") : t("signals.SELL"),
    NEUTRAL: t("signals.NEUTRAL"),
    AVOID: t("signals.AVOID"),
  };

  if (setup.signal === "AVOID") {
    return (
      <div className={`bg-${accentColor}-500/5 border border-${accentColor}-500/10 rounded-xl p-4 opacity-60`}>
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-5 h-5 text-${accentColor}-400`} />
          <h3 className={`font-semibold text-${accentColor}-400`}>{type === "CALL" ? "CALL" : "PUT"} — {setup.strategy}</h3>
        </div>
        <p className="text-sm text-slate-400">{setup.reason}</p>
      </div>
    );
  }

  return (
    <div className={`bg-${accentColor}-500/5 border border-${accentColor}-500/20 rounded-xl p-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 text-${accentColor}-400`} />
          <h3 className="font-semibold text-white">{type} — {setup.strategy}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${signalColors[setup.signal] || signalColors.NEUTRAL}`}>
            {signalLabels[setup.signal] || setup.signal}
          </span>
          <span className="text-lg font-bold text-white">{setup.score}/100</span>
        </div>
      </div>

      {/* Temel bilgiler */}
      <div className="grid grid-cols-4 gap-2 text-sm mb-3">
        <div className="text-center">
          <p className="text-xs text-slate-500">Strike</p>
          <p className={`font-bold text-${accentColor}-400`}>${setup.strike}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">Hedef</p>
          <p className={`font-bold text-${accentColor}-400`}>{setup.targetMove}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">POP</p>
          <p className="font-bold text-cyan-400">%{setup.pop}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">R/R</p>
          <p className="font-bold text-amber-400">{setup.riskReward}</p>
        </div>
      </div>

      {/* Detaylar */}
      <div className="space-y-1 text-sm">
        <div className="flex justify-between"><span className="text-slate-500">Giriş:</span><span className="text-slate-300">{setup.entryCondition}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Max Zarar:</span><span className="text-red-400">{setup.maxLoss}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Kar Al:</span><span className="text-emerald-400">{setup.takeProfit}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Stop:</span><span className="text-amber-400">{setup.stopCondition}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Kelly:</span><span className="text-purple-400">{setup.kellySize}</span></div>
      </div>

      {/* PDT Notu */}
      {setup.pdtNote && (
        <div className={`mt-3 bg-${accentColor}-500/10 rounded-lg p-2 text-xs text-${accentColor}-300`}>
          <Clock className="w-3 h-3 inline mr-1" />
          {setup.pdtNote}
        </div>
      )}
    </div>
  );
}

// v4.2: Ana panel
export default function OptionsPanel({ stock, onClose }: OptionsPanelProps) {
  const [showSizing, setShowSizing] = useState(false);
  const [accountBalance, setAccountBalance] = useState("");
  const [riskPercent, setRiskPercent] = useState("2");
  const [selectedDte, setSelectedDte] = useState(14);

  // v4.2: Çift yönlü analiz
  const setup = useMemo(() => {
    try {
      const bearScore = calculateBearScore(stock as any);
      const persistence = calculatePersistenceScore(stock as any, stock.score > 50 ? "BULL" : "BEAR");
      return recommendBiDirectionalStrategies(stock, selectedDte, persistence.score, bearScore.score);
    } catch (e) {
      // Fallback: eski sistem
      return null;
    }
  }, [stock, selectedDte]);

  // T+1 uygunluk
  const t1Check = useMemo(() => {
    if (!setup) return null;
    return isT1Suitable(stock, setup.pdtPersistenceScore, null);
  }, [setup, stock]);

  const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const todayDow = new Date().getDay();

  // Yön tavsiyesi rengi
  const recColors: Record<string, { text: string; bg: string; icon: string }> = {
    STRADDLE: { text: "text-purple-400", bg: "bg-purple-500/10", icon: "⚡" },
    CALL_PRIMARY: { text: "text-emerald-400", bg: "bg-emerald-500/10", icon: "▲" },
    PUT_PRIMARY: { text: "text-red-400", bg: "bg-red-500/10", icon: "▼" },
    WAIT: { text: "text-slate-400", bg: "bg-slate-500/10", icon: "⏸" },
  };

  const recMessages: Record<string, string> = {
    STRADDLE: "İki yön yakın — Straddle değerlendirilebilir",
    CALL_PRIMARY: "CALL ağırlıklı momentum — PDT uygun",
    PUT_PRIMARY: "PUT ağırlıklı momentum — PDT uygun",
    WAIT: "Persistence zayıf — T+1 için bekle",
  };

  if (!setup) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center" onClick={(e) => e.stopPropagation()}>
          <p className="text-slate-400">v4.2 çift yönlü analiz yüklenemedi. Fallback mod.</p>
          <Button onClick={onClose} className="mt-4">Kapat</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 p-5 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl border border-purple-500/20">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{stock.ticker} — Çift Yönlü Analiz</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm text-slate-400">${stock.currentPrice}</span>
                <span className={`text-sm font-medium ${stock.score >= 60 ? "text-emerald-400" : "text-slate-400"}`}>Bull: {stock.score}</span>
                <span className={`text-sm font-medium ${(setup?.put?.score || 0) <= 40 ? "text-red-400" : "text-slate-400"}`}>Bear: {setup?.put?.score || 0}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-all">
            <span className="text-lg">×</span>
          </button>
        </div>

        <div className="p-5 space-y-5">

          {/* v4.2: PDT Persistence Badge */}
          <div className={`rounded-xl p-4 border ${setup.pdtSuitable ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"}`}>
            <div className="flex items-center gap-3">
              <Activity className={`w-5 h-5 ${setup.pdtSuitable ? "text-emerald-400" : "text-red-400"}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${setup.pdtSuitable ? "text-emerald-400" : "text-red-400"}`}>
                    PDT {setup.pdtSuitable ? "✓ UYGUN" : "✗ UYGUN DEĞİL"} — Persistence {setup.pdtPersistenceScore}/100
                  </span>
                </div>
                {t1Check && !t1Check.suitable && (
                  <p className="text-xs text-orange-400 mt-1">{t1Check.reasons.join(" · ")}</p>
                )}
              </div>
            </div>
          </div>

          {/* Yön Tavsiyesi */}
          {setup.recommendation && (
            <div className={`${recColors[setup.recommendation]?.bg || "bg-slate-500/10"} rounded-xl p-3 text-center border border-slate-700/30`}>
              <span className={`text-sm font-medium ${recColors[setup.recommendation]?.text || "text-slate-400"}`}>
                {recColors[setup.recommendation]?.icon} {recMessages[setup.recommendation] || setup.recommendation}
              </span>
            </div>
          )}

          {/* DTE Seçici */}
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-medium text-amber-300">Vade Seçimi (DTE)</h3>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[7, 14, 21, 30, 45].map((dte) => (
                <button
                  key={dte}
                  onClick={() => setSelectedDte(dte)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedDte === dte
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {dte} gün {dte < 14 && "⚠️"}
                </button>
              ))}
            </div>
            {selectedDte < 14 && (
              <p className="text-xs text-orange-400 mt-2">⚠️ 14 gün altı — Theta decay hızlı, dikkatli ol!</p>
            )}
          </div>

          {/* Hedef / Stop */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">Giriş</p>
              <p className="text-lg font-bold text-white">${stock.currentPrice}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <p className="text-xs text-emerald-400 mb-1">Hedef</p>
              </div>
              <p className="text-lg font-bold text-emerald-400">${stock.targetPrice || "—"}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <Shield className="w-3.5 h-3.5 text-red-400" />
                <p className="text-xs text-red-400 mb-1">Stop</p>
              </div>
              <p className="text-lg font-bold text-red-400">${stock.stopLossPrice || "—"}</p>
            </div>
          </div>

          {/* v4.2: Çift Yönlü Kartlar — CALL | PUT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OptionCard type="CALL" setup={setup.call} stock={stock} />
            <OptionCard type="PUT" setup={setup.put} stock={stock} />
          </div>

          {/* Gün Bilgisi */}
          <div className="text-center text-xs text-slate-500">
            Bugün: {dayNames[todayDow]} | v4.2 Çift Yönlü PDT Motor
          </div>
        </div>
      </div>
    </div>
  );
}
