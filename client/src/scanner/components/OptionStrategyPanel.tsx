import type { StockResult } from "@/scanner/types";
import { TrendingUp, TrendingDown, Shield, AlertTriangle, Target, Clock, DollarSign } from "lucide-react";

interface OptionStrategyPanelProps {
  stock: StockResult;
}

interface StrategySuggestion {
  name: string;
  nameTr: string;
  direction: "BULLISH" | "BEARISH" | "NEUTRAL";
  setup: string;
  strikes: string;
  dte: number;
  popEstimate: string;
  maxRisk: string;
  breakeven: string;
  notes: string[];
  warnings: string[];
  color: string;
}

function suggestStrategy(stock: StockResult): StrategySuggestion {
  const price = stock.currentPrice;
  const atr = stock.atr14d || price * 0.02;
  const rsi = stock.rsi;
  const change = stock.priceChangePct;
  const signal = stock.signal;
  const iv = stock.ivProxy || 50;

  // Base DTE: 14-30 days based on IV
  const dte = iv > 60 ? 14 : iv > 40 ? 21 : 30;

  // Determine direction and strategy
  if (signal === "OVERBOUGHT_RED" || signal === "CAUTION_HOT") {
    // Overbought → Bearish strategy
    const shortStrike = Math.ceil(price / 5) * 5; // Round to nearest 5
    const longStrike = shortStrike + 5;
    const breakeven = shortStrike + (price * 0.02);
    return {
      name: "Bear Call Spread",
      nameTr: "Ayı Call Spread'i",
      direction: "BEARISH",
      setup: `Sell ${shortStrike}C / Buy ${longStrike}C`,
      strikes: `${shortStrike}C / ${longStrike}C`,
      dte,
      popEstimate: iv > 60 ? "~75%" : "~65%",
      maxRisk: `$${(longStrike - shortStrike - (price * 0.02)).toFixed(2)}`,
      breakeven: `$${breakeven.toFixed(2)}`,
      notes: [
        `IV Rank ${iv}/100 — ${iv > 60 ? "Premium satışı mantıklı" : "Premium ortalama"}`,
        `RSI ${rsi.toFixed(1)} — Aşırı alım bölgesi, geri çekilme olasılığı yüksek`,
        `Vade: ${dte} gün (theta decay optimal zone)`,
      ],
      warnings: [
        stock.earningsWarning || null,
        rsi >= 80 ? "🚨 RSI 80+ — Kesinlikle küçük pozisyon" : null,
        change > 5 ? "⚠️ Gün içi %5+ hareket — Slippage riski yüksek" : null,
      ].filter(Boolean) as string[],
      color: "text-red-400",
    };
  }

  if (signal === "OVERSOLD_CAUTION") {
    // Oversold → Bullish reversal
    const longStrike = Math.floor(price / 5) * 5;
    const shortStrike = Math.max(longStrike - 5, 1);
    return {
      name: "Bull Put Spread",
      nameTr: "Boğa Put Spread'i",
      direction: "BULLISH",
      setup: `Sell ${longStrike}P / Buy ${shortStrike}P`,
      strikes: `${longStrike}P / ${shortStrike}P`,
      dte,
      popEstimate: "~70%",
      maxRisk: `$${(longStrike - shortStrike).toFixed(2)}`,
      breakeven: `$${(longStrike - (price * 0.02)).toFixed(2)}`,
      notes: [
        `RSI ${rsi.toFixed(1)} — Aşırı satım, dönüş potansiyeli`,
        `Vade: ${dte} gün`,
        "Limit emir kullanın — Piyasa emiri slippage riski",
      ],
      warnings: [
        stock.earningsWarning || null,
        "⚠️ Aşırı satım = bıçak yakalama riski — Küçük pozisyon",
      ].filter(Boolean) as string[],
      color: "text-amber-400",
    };
  }

  if (signal === "STRONG_BUY" || signal === "BUY" || signal === "NEUTRAL_BULLISH") {
    // Bullish momentum
    const otmStrike = Math.ceil(price * 1.02 / 5) * 5; // OTM 2%, round to 5
    const itmStrike = Math.floor(price * 0.98 / 5) * 5;  // ITM 2%
    const spreadWidth = otmStrike - itmStrike;
    const credit = (price * 0.015).toFixed(2);
    return {
      name: "Bull Call Spread",
      nameTr: "Boğa Call Spread'i",
      direction: "BULLISH",
      setup: `Buy ${itmStrike}C / Sell ${otmStrike}C`,
      strikes: `${itmStrike}C / ${otmStrike}C`,
      dte,
      popEstimate: change > 3 ? "~68%" : "~58%",
      maxRisk: `$${(spreadWidth - parseFloat(credit)).toFixed(2)}`,
      breakeven: `$${(itmStrike + parseFloat(credit)).toFixed(2)}`,
      notes: [
        `Momentum skoru: ${stock.score}/100 — ${stock.score >= 75 ? "Güçlü" : "Orta"} setup`,
        `Hedef: $${(stock.targetPrice || price * 1.03).toFixed(2)} (+${((stock.targetPrice || price * 1.03) / price * 100 - 100).toFixed(1)}%)`,
        `Vade: ${dte} gün — Theta decay zone`,
        `IV Rank: ${iv}/100 — ${iv > 60 ? "Premium satış fırsatı" : iv < 30 ? "Ucuz premium" : "Ortalama"}`,
      ],
      warnings: [
        stock.earningsWarning || null,
        stock.rsiWarning || null,
        stock.volumeRatio < 1 ? "⚠️ Düşük hacim — Büyük pozisyonlardan kaçının" : null,
      ].filter(Boolean) as string[],
      color: "text-emerald-400",
    };
  }

  // Default: Neutral / Weak
  return {
    name: "No Setup",
    nameTr: "Uygun Setup Yok",
    direction: "NEUTRAL",
    setup: "Bekle",
    strikes: "—",
    dte: 0,
    popEstimate: "—",
    maxRisk: "—",
    breakeven: "—",
    notes: [
      `Sinyal: ${signal} — Momentum zayıf`,
      "Bugün için opsiyon setup'ı önerilmiyor",
      "Yarın tekrar tarama yapın",
    ],
    warnings: [],
    color: "text-slate-400",
  };
}

export default function OptionStrategyPanel({ stock }: OptionStrategyPanelProps) {
  const strategy = suggestStrategy(stock);

  if (strategy.direction === "NEUTRAL") {
    return (
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/20 p-3">
        <p className="text-xs text-slate-500">Opsiyon Stratejisi</p>
        <p className="mt-1 text-sm text-slate-400">{strategy.nameTr} — Bugün için uygun setup yok</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 text-xs font-semibold text-slate-300">
        {strategy.direction === "BULLISH" ? (
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 text-red-400" />
        )}
        Opsiyon Stratejisi — {strategy.nameTr}
      </h4>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5">
          <p className="text-[10px] text-slate-500">Kurulum</p>
          <p className={`text-sm font-bold ${strategy.color}`}>{strategy.setup}</p>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5">
          <p className="text-[10px] text-slate-500">Vade (DTE)</p>
          <p className="text-sm font-bold text-white">{strategy.dte} gün</p>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5">
          <p className="text-[10px] text-slate-500">POP Tahmini</p>
          <p className="text-sm font-bold text-white">{strategy.popEstimate}</p>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5">
          <p className="text-[10px] text-slate-500">Max Risk</p>
          <p className="text-sm font-bold text-white">{strategy.maxRisk}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Target className="h-3 w-3" />
            Breakeven
          </div>
          <p className="text-sm font-bold text-white">{strategy.breakeven}</p>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Clock className="h-3 w-3" />
            Giriş Saati
          </div>
          <p className="text-sm font-bold text-white">10:30-11:30 AM</p>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <DollarSign className="h-3 w-3" />
            Pozisyon Boyutu
          </div>
          <p className="text-sm font-bold text-white">≤%2 NLV</p>
        </div>
      </div>

      {strategy.notes.length > 0 ? (
        <div className="space-y-1">
          {strategy.notes.map((note, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
              <Shield className="mt-0.5 h-3 w-3 flex-shrink-0 text-emerald-400" />
              <span>{note}</span>
            </div>
          ))}
        </div>
      ) : null}

      {strategy.warnings.length > 0 ? (
        <div className="space-y-1 rounded-lg border border-red-500/20 bg-red-500/5 p-2.5">
          {strategy.warnings.map((warning, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-red-400">
              <AlertTriangle className="mt-0.5 h-3 w-3 flex-shrink-0" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
