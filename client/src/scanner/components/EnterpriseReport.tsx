import type { StockResult } from "@/scanner/types";
import { copy } from "@/lib/i18n";
import type { AppLanguage } from "@/lib/i18n";
import { Delta } from "@/components/ui/delta";
import {
  Activity,
  BarChart3,
  Shield,
  TrendingUp,
  AlertTriangle,
  Target,
  Zap,
  PieChart,
} from "lucide-react";

interface EnterpriseReportProps {
  stocks: StockResult[];
  scanTime: string;
  language: AppLanguage;
}

// ═══════════════════════════════════════════════════════════════════════════════
// KATMAN 1: PİYASA REJİMİ
// ═══════════════════════════════════════════════════════════════════════════════

function RegimeLayer({ stocks, language }: { stocks: StockResult[]; language: AppLanguage }) {
  // Basit rejim tespiti: Ortalama IV, momentum dağılımı
  const avgIV = stocks.length > 0
    ? stocks.reduce((s, st) => s + (st.ivProxy || 50), 0) / stocks.length
    : 50;
  const avgRSI = stocks.length > 0
    ? stocks.reduce((s, st) => s + st.rsi, 0) / stocks.length
    : 50;
  const bullishCount = stocks.filter((s) => s.signal === "STRONG_BUY" || s.signal === "BUY").length;
  const bearishCount = stocks.filter((s) => s.signal === "OVERBOUGHT_RED" || s.signal === "CAUTION_HOT").length;
  const neutralCount = stocks.length - bullishCount - bearishCount;

  const regime = avgIV > 60
    ? copy(language, "YÜKSEK_VOLATİLİTE", "HIGH_VOLATILITY")
    : avgIV < 30
      ? copy(language, "DÜŞÜK_VOLATİLİTE", "LOW_VOLATILITY")
      : copy(language, "NORMAL", "NORMAL");
  const termStructure = avgRSI > 70 ? "BACKWARDATION" : avgRSI < 40 ? "CONTANGO" : "FLAT";
  const creditAllowed = avgIV > 50;
  const longPremiumAllowed = avgIV < 40;

  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
        <BarChart3 className="h-4 w-4 text-blue-400" />
        {copy(language, "Katman 1: Piyasa Rejimi", "Layer 1: Market Regime")}
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded bg-slate-800/50 p-2.5">
          <p className="text-[10px] text-slate-500">{copy(language, "Ortalama IV", "Avg IV")}</p>
          <p className={`text-lg font-bold ${avgIV > 60 ? "text-red-400" : avgIV < 30 ? "text-emerald-400" : "text-white"}`}>
            {avgIV.toFixed(1)}
          </p>
        </div>
        <div className="rounded bg-slate-800/50 p-2.5">
          <p className="text-[10px] text-slate-500">{copy(language, "Ortalama RSI", "Avg RSI")}</p>
          <p className={`text-lg font-bold ${avgRSI > 70 ? "text-red-400" : avgRSI < 40 ? "text-emerald-400" : "text-white"}`}>
            {avgRSI.toFixed(1)}
          </p>
        </div>
        <div className="rounded bg-slate-800/50 p-2.5">
          <p className="text-[10px] text-slate-500">{copy(language, "Rejim", "Regime")}</p>
          <p className="text-sm font-bold text-white">{regime.replace(/_/g, " ")}</p>
        </div>
        <div className="rounded bg-slate-800/50 p-2.5">
          <p className="text-[10px] text-slate-500">{copy(language, "Term Structure", "Term Structure")}</p>
          <p className="text-sm font-bold text-white">{termStructure}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className={`rounded-full px-2.5 py-1 ${creditAllowed ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}>
          {creditAllowed
            ? copy(language, "✅ Credit Spread İzinli", "✅ Credit Spread Allowed")
            : copy(language, "❌ Credit Spread Yasak", "❌ Credit Spread Forbidden")}
        </span>
        <span className={`rounded-full px-2.5 py-1 ${longPremiumAllowed ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>
          {longPremiumAllowed
            ? copy(language, "✅ Long Premium İzinli", "✅ Long Premium Allowed")
            : copy(language, "⚠️ Long Premium Dikkat", "⚠️ Long Premium Caution")}
        </span>
        <span className="rounded-full bg-blue-500/15 px-2.5 py-1 text-blue-300">
          🐂 {bullishCount} | ⚠️ {bearishCount} | ➖ {neutralCount}
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// KATMAN 2: AÇIK POZİSYONLAR
// ═══════════════════════════════════════════════════════════════════════════════

function PositionLayer({ language }: { language: AppLanguage }) {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
        <Shield className="h-4 w-4 text-amber-400" />
        {copy(language, "Katman 2: Açık Pozisyonlar", "Layer 2: Open Positions")}
      </h3>
      <div className="rounded bg-slate-800/50 p-4 text-center">
        <p className="text-sm text-slate-400">{copy(language, "Açık pozisyon bulunmuyor", "No open positions")}</p>
        <p className="mt-1 text-xs text-slate-500">
          {copy(
            language,
            "Pozisyon açtığınızda burada DTE, Delta, Theta decay ve çıkış planı görünecek",
            "When you open a position, DTE, Delta, Theta decay and exit plan will appear here"
          )}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// KATMAN 3: YENİ KURULUMLAR
// ═══════════════════════════════════════════════════════════════════════════════

function SetupLayer({ stocks, language }: { stocks: StockResult[]; language: AppLanguage }) {
  const top5 = stocks.slice(0, 5);

  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
        <Target className="h-4 w-4 text-emerald-400" />
        {copy(language, "Katman 3: Yeni Kurulumlar (Top 5)", "Layer 3: New Setups (Top 5)")}
      </h3>
      <div className="space-y-2">
        {top5.map((stock) => {
          const price = stock.currentPrice;
          const atr = stock.atr14d || price * 0.02;
          const iv = stock.ivProxy || 50;
          const dte = iv > 60 ? 14 : iv > 40 ? 21 : 30;
          const em = atr * Math.sqrt(dte / 30);
          const pop = stock.score >= 75 ? 72 : stock.score >= 60 ? 65 : 58;
          const spreadWidth = Math.max(2.5, atr * 1.5);
          const netCredit = spreadWidth * 0.35;
          const maxLoss = spreadWidth - netCredit;
          const breakeven = price + netCredit;

          return (
            <div key={stock.ticker} className="flex items-center justify-between rounded bg-slate-800/50 p-2.5">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">{stock.ticker}</span>
                <Delta value={stock.priceChangePct} className="text-xs" />
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>{copy(language, "POP: ", "POP: ")}<b className="text-white">%{pop}</b></span>
                <span>{copy(language, "EM: ", "EM: ")}<b className="text-white">${em.toFixed(2)}</b></span>
                <span>{copy(language, "BE: ", "BE: ")}<b className="text-white">${breakeven.toFixed(2)}</b></span>
                <span>{copy(language, "Risk: ", "Risk: ")}<b className="text-white">${maxLoss.toFixed(2)}</b></span>
                <span>{copy(language, "DTE: ", "DTE: ")}<b className="text-white">{dte}</b></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// KATMAN 4: PORTFÖY SAĞLIĞI
// ═══════════════════════════════════════════════════════════════════════════════

function PortfolioLayer({ stocks, language }: { stocks: StockResult[]; language: AppLanguage }) {
  // Sektör dağılımı
  const sectorMap: Record<string, number> = {};
  stocks.forEach((s) => {
    sectorMap[s.sector] = (sectorMap[s.sector] || 0) + 1;
  });
  const sectors = Object.entries(sectorMap).sort((a, b) => b[1] - a[1]);

  // Basit stress test
  const avgScore = stocks.length > 0
    ? stocks.reduce((s, st) => s + st.score, 0) / stocks.length
    : 0;
  const maxRSI = stocks.length > 0 ? Math.max(...stocks.map((s) => s.rsi)) : 50;
  const minRSI = stocks.length > 0 ? Math.min(...stocks.map((s) => s.rsi)) : 50;

  // Portföy ısısı (basit)
  const heat = stocks.length > 0
    ? (stocks.filter((s) => s.signal === "OVERBOUGHT_RED" || s.signal === "CAUTION_HOT").length / stocks.length) * 100
    : 0;

  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
        <PieChart className="h-4 w-4 text-purple-400" />
        {copy(language, "Katman 4: Portföy Sağlığı", "Layer 4: Portfolio Health")}
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded bg-slate-800/50 p-2.5">
          <p className="text-[10px] text-slate-500">{copy(language, "Ortalama Skor", "Avg Score")}</p>
          <p className={`text-lg font-bold ${avgScore >= 60 ? "text-emerald-400" : avgScore >= 40 ? "text-amber-400" : "text-red-400"}`}>
            {avgScore.toFixed(1)}
          </p>
        </div>
        <div className="rounded bg-slate-800/50 p-2.5">
          <p className="text-[10px] text-slate-500">{copy(language, "Portföy Isısı", "Portfolio Heat")}</p>
          <p className={`text-lg font-bold ${heat >= 30 ? "text-red-400" : heat >= 15 ? "text-amber-400" : "text-emerald-400"}`}>
            %{heat.toFixed(1)}
          </p>
        </div>
        <div className="rounded bg-slate-800/50 p-2.5">
          <p className="text-[10px] text-slate-500">{copy(language, "RSI Aralığı", "RSI Range")}</p>
          <p className="text-sm font-bold text-white">{minRSI.toFixed(1)} - {maxRSI.toFixed(1)}</p>
        </div>
        <div className="rounded bg-slate-800/50 p-2.5">
          <p className="text-[10px] text-slate-500">{copy(language, "Hisse Sayısı", "Stock Count")}</p>
          <p className="text-lg font-bold text-white">{stocks.length}</p>
        </div>
      </div>

      {/* Sektör Dağılımı */}
      {sectors.length > 0 ? (
        <div className="mt-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{copy(language, "Sektör Dağılımı", "Sector Distribution")}</p>
          <div className="flex flex-wrap gap-2">
            {sectors.slice(0, 6).map(([sector, count]) => (
              <span key={sector} className="rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-[10px] text-slate-400">
                {sector}: {count}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Stress Test */}
      <div className="mt-3 rounded border border-slate-700/30 bg-slate-800/30 p-2.5">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{copy(language, "Basit Stress Test", "Simple Stress Test")}</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 md:grid-cols-4">
          <div>
            <p className="text-[10px] text-slate-500">{copy(language, "-2% Piyasa", "-2% Market")}</p>
            <p className="font-bold text-white">{heat > 20 ? copy(language, "🔴 Yüksek Risk", "🔴 High Risk") : copy(language, "🟢 Kontrollü", "🟢 Controlled")}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500">{copy(language, "+30% IV Patlaması", "+30% IV Spike")}</p>
            <p className="font-bold text-white">{avgScore < 50 ? copy(language, "🔴 Zarar Artar", "🔴 Loss Increases") : copy(language, "🟢 Spread Korur", "🟢 Spread Protects")}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500">{copy(language, "Earnings Gap", "Earnings Gap")}</p>
            <p className="font-bold text-white">{maxRSI > 75 ? copy(language, "🔴 Aşırı Alım", "🔴 Overbought") : copy(language, "🟢 Normal", "🟢 Normal")}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500">{copy(language, "Likidite", "Liquidity")}</p>
            <p className="font-bold text-white">{stocks.filter((s) => s.avgDollarVolume > 50_000_000).length}/{stocks.length} ✅</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANA RAPOR
// ═══════════════════════════════════════════════════════════════════════════════

export default function EnterpriseReport({ stocks, scanTime, language }: EnterpriseReportProps) {
  if (stocks.length === 0) return null;

  const overboughtStocks = stocks.filter((s) => s.signal === "OVERBOUGHT_RED");
  const overboughtCount = overboughtStocks.length;
  const overboughtTickers = overboughtStocks.map((s) => s.ticker).join(", ");

  const hotStocks = stocks.filter((s) => s.signal === "CAUTION_HOT");
  const hotCount = hotStocks.length;
  const hotTickers = hotStocks.map((s) => s.ticker).join(", ");

  const best = stocks.filter((s) => s.signal === "STRONG_BUY" || s.signal === "BUY").slice(0, 3);
  const bestSetup = best.length > 0
    ? best.map((s) => `${s.ticker} (${copy(language, "Skor", "Score")} ${s.score})`).join(", ")
    : copy(language, "Bugün için güçlü setup yok", "No strong setup for today");

  return (
    <div className="space-y-4 rounded-xl border border-slate-700/50 bg-slate-900/40 p-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          {copy(language, "v4.0 Kurumsal Rapor", "v4.0 Enterprise Report")}
        </h2>
        <span className="text-xs text-slate-500">{scanTime}</span>
      </div>

      <RegimeLayer stocks={stocks} language={language} />
      <PositionLayer language={language} />
      <SetupLayer stocks={stocks} language={language} />
      <PortfolioLayer stocks={stocks} language={language} />

      {/* Kritik Öncelikler */}
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-300">
          <AlertTriangle className="h-4 w-4" />
          {copy(language, "3 Kritik Öncelik", "3 Critical Priorities")}
        </h3>
        <div className="space-y-1.5">
          {overboughtCount > 0 ? (
            <div className="flex items-start gap-2 text-xs text-red-400">
              <Zap className="mt-0.5 h-3 w-3 flex-shrink-0" />
              <span>
                {copy(
                  language,
                  `🚨 ${overboughtCount} hisse aşırı alım — KESİNLİKLE girmeyin: ${overboughtTickers}`,
                  `🚨 ${overboughtCount} stocks overbought — DO NOT enter: ${overboughtTickers}`
                )}
              </span>
            </div>
          ) : null}
          {hotCount > 0 ? (
            <div className="flex items-start gap-2 text-xs text-amber-400">
              <Zap className="mt-0.5 h-3 w-3 flex-shrink-0" />
              <span>
                {copy(
                  language,
                  `⚠️ ${hotCount} hisse sıcak bölge — Küçük pozisyon, sıkı stop: ${hotTickers}`,
                  `⚠️ ${hotCount} stocks in hot zone — Small position, tight stop: ${hotTickers}`
                )}
              </span>
            </div>
          ) : null}
          <div className="flex items-start gap-2 text-xs text-emerald-400">
            <Activity className="mt-0.5 h-3 w-3 flex-shrink-0" />
            <span>
              {copy(language, `✅ En iyi kurulum: ${bestSetup}`, `✅ Best setup: ${bestSetup}`)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

