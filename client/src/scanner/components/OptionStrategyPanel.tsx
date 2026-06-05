import type { StockResult } from "@/scanner/types";
import {
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  Target,
  Clock,
  DollarSign,
  BarChart3,
  Activity,
  Zap,
} from "lucide-react";

interface OptionStrategyPanelProps {
  stock: StockResult;
}

// ═══════════════════════════════════════════════════════════════════════════════
// v4.0 KURUMSAL METRİKLER
// ═══════════════════════════════════════════════════════════════════════════════

interface v4Metrics {
  pop: number;                    // Probability of Profit (%)
  expectedMove: number;           // Expected Move ($)
  expectedMovePct: number;       // Expected Move (%)
  ivSignal: "SELL_PREMIUM" | "BUY_PREMIUM" | "NEUTRAL";
  ivSignalLabel: string;
  kellyContracts: number;       // Kelly sizing ile hesaplanan contract sayısı
  kellyRisk: number;             // Kelly risk ($)
  spreadWidth: number;           // Spread width ($)
  netCredit: number;             // Net credit ($)
  netDebit: number;              // Net debit ($)
  breakeven: number;             // Breakeven ($)
  maxProfit: number;             // Max profit ($)
  maxLoss: number;               // Max loss ($)
  rReturn: number;               // Risk-adjusted return
  entryWindow: string;           // Optimal entry time
  orderType: string;             // LIMIT / MIDPOINT
  slippageEstimate: number;      // Slippage %
  managementRules: string[];     // %50 kar al, 21 DTE roll, 2x stop
}

function calculateV4Metrics(stock: StockResult): v4Metrics {
  const price = stock.currentPrice;
  const atr = stock.atr14d || price * 0.02;
  const rsi = stock.rsi;
  const change = stock.priceChangePct;
  const score = stock.score;
  const iv = stock.ivProxy || 50;
  const rvol = stock.volumeRatio || 1;

  // DTE: IV'e göre 14-30 gün
  const dte = iv > 60 ? 14 : iv > 40 ? 21 : 30;

  // ─── POP HESAPLAMA ───
  // Base POP skora göre
  let pop = score >= 75 ? 72 : score >= 60 ? 65 : score >= 45 ? 58 : 50;
  // IV adjustment
  if (iv > 60) pop += 5;      // Yüksek IV = premium satışı daha olası
  else if (iv < 30) pop -= 3; // Düşük IV = long premium daha zor
  // RVOL adjustment
  if (rvol > 2) pop += 3;     // Yüksek hacim = momentum güçlü
  else if (rvol < 0.8) pop -= 5; // Düşük hacim = zayıf momentum
  pop = Math.max(35, Math.min(85, pop));

  // ─── EXPECTED MOVE ───
  // EM = ATR × √DTE (basitleştirilmiş)
  const expectedMove = atr * Math.sqrt(dte / 30);
  const expectedMovePct = (expectedMove / price) * 100;

  // ─── IV SİNYALİ ───
  let ivSignal: "SELL_PREMIUM" | "BUY_PREMIUM" | "NEUTRAL";
  let ivSignalLabel: string;
  if (iv > 60) {
    ivSignal = "SELL_PREMIUM";
    ivSignalLabel = "Premium Satışı (IV Yüksek)";
  } else if (iv < 30) {
    ivSignal = "BUY_PREMIUM";
    ivSignalLabel = "Premium Alımı (IV Düşük)";
  } else {
    ivSignal = "NEUTRAL";
    ivSignalLabel = "IV Nötr";
  }

  // ─── SPREAD METRİKLERİ ───
  const spreadWidth = Math.max(2.5, atr * 1.5); // Min $2.5 spread
  const netCredit = spreadWidth * 0.35;         // ~35% of width
  const netDebit = spreadWidth * 0.65;
  const breakeven = price + netCredit;          // Credit spread için
  const maxProfit = netCredit;
  const maxLoss = spreadWidth - netCredit;

  // ─── KELLY SİZİNG ───
  // K% = (POP/100 - (1-POP/100) × MaxLoss/MaxProfit) × 0.25
  const winProb = pop / 100;
  const lossProb = 1 - winProb;
  const kellyRaw = maxProfit > 0
    ? Math.max(0, (winProb * maxProfit - lossProb * maxLoss) / maxProfit)
    : 0;
  const kellyFraction = kellyRaw * 0.25; // Fraksiyonel Kelly %25
  const nlv = 100_000; // Varsayılan $100K portföy
  const maxRiskDollars = nlv * 0.02; // Hard cap %2
  const kellyRisk = Math.min(maxRiskDollars, nlv * kellyFraction);
  const kellyContracts = Math.max(1, Math.floor(kellyRisk / maxLoss));

  // ─── RİSK-ADJUSTED RETURN ───
  const rReturn = maxLoss > 0 ? (pop / 100 * maxProfit - (1 - pop / 100) * maxLoss) / maxLoss : 0;

  // ─── EXECUTION ───
  const entryWindow = iv > 50 ? "10:30-11:00 AM (volatilite yüksek, sabah bekle)" : "10:30-11:30 AM";
  const orderType = "MIDPOINT LIMIT";
  const slippageEstimate = rvol > 2 ? 3 : rvol > 1 ? 2 : 1;

  // ─── YÖNETİM KURALLARI ───
  const managementRules = [
    `✅ %50 kârda ($${(maxProfit * 0.5).toFixed(2)}) → yarısını kapat`,
    `📅 21 DTE'de roll düşün (vade: ${dte} gün)`,
    `🛑 2x kredi ($${(maxLoss * 2).toFixed(2)}) → zararda kapat`,
    `⏰ 14 DTE time stop → zaman değeri eriyor`,
    `📊 Limit emir: Midpoint giriş, slippage ≤%${slippageEstimate}`,
  ];

  return {
    pop,
    expectedMove,
    expectedMovePct,
    ivSignal,
    ivSignalLabel,
    kellyContracts,
    kellyRisk,
    spreadWidth,
    netCredit,
    netDebit,
    breakeven,
    maxProfit,
    maxLoss,
    rReturn,
    entryWindow,
    orderType,
    slippageEstimate,
    managementRules,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// STRATEJİ ÖNERİSİ
// ═══════════════════════════════════════════════════════════════════════════════

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
  metrics: v4Metrics;
}

function suggestStrategy(stock: StockResult): StrategySuggestion {
  const price = stock.currentPrice;
  const atr = stock.atr14d || price * 0.02;
  const rsi = stock.rsi;
  const change = stock.priceChangePct;
  const signal = stock.signal;
  const iv = stock.ivProxy || 50;
  const metrics = calculateV4Metrics(stock);

  // DTE
  const dte = iv > 60 ? 14 : iv > 40 ? 21 : 30;

  // Strike hesaplama (5'lik grid)
  const roundTo5 = (n: number) => Math.round(n / 5) * 5;
  const atmStrike = roundTo5(price);
  const otmStrike = roundTo5(price + atr * 1.5);
  const itmStrike = roundTo5(Math.max(price - atr * 1.5, 5));

  if (signal === "OVERBOUGHT_RED" || signal === "CAUTION_HOT") {
    // Overbought → Bearish strategy (Credit spread)
    const shortCall = atmStrike;
    const longCall = roundTo5(atmStrike + metrics.spreadWidth);
    return {
      name: "Bear Call Spread",
      nameTr: "Ayı Call Spread'i (Kredi)",
      direction: "BEARISH",
      setup: `Sell ${shortCall}C / Buy ${longCall}C`,
      strikes: `${shortCall}C / ${longCall}C`,
      dte,
      popEstimate: `%${metrics.pop}`,
      maxRisk: `$${metrics.maxLoss.toFixed(2)}`,
      breakeven: `$${metrics.breakeven.toFixed(2)}`,
      notes: [
        `📊 POP: %${metrics.pop} | Max Profit: $${metrics.maxProfit.toFixed(2)} | R/R: ${(metrics.maxProfit / metrics.maxLoss).toFixed(2)}`,
        `📈 IV Rank: ${iv}/100 — ${metrics.ivSignalLabel}`,
        `🎯 Expected Move: $${metrics.expectedMove.toFixed(2)} (%${metrics.expectedMovePct.toFixed(1)})`,
        `💰 Kelly Sizing: ${metrics.kellyContracts} contract ($${metrics.kellyRisk.toFixed(0)} risk)`,
        `⏰ Entry: ${metrics.entryWindow}`,
        `📋 Order: ${metrics.orderType} (slippage ≤%${metrics.slippageEstimate})`,
      ],
      warnings: [
        stock.earningsWarning || null,
        rsi >= 80 ? `🚨 RSI ${rsi.toFixed(1)} — Aşırı alım, geri çekilme yakın` : null,
        change > 5 ? `⚠️ Gün içi %${change.toFixed(1)} — Slippage riski yüksek` : null,
        metrics.ivSignal === "SELL_PREMIUM" ? "✅ IV yüksek — Premium satışı mantıklı" : null,
      ].filter(Boolean) as string[],
      color: "text-red-400",
      metrics,
    };
  }

  if (signal === "OVERSOLD_CAUTION") {
    // Oversold → Bullish reversal (Credit spread)
    const shortPut = atmStrike;
    const longPut = roundTo5(Math.max(atmStrike - metrics.spreadWidth, 1));
    return {
      name: "Bull Put Spread",
      nameTr: "Boğa Put Spread'i (Kredi)",
      direction: "BULLISH",
      setup: `Sell ${shortPut}P / Buy ${longPut}P`,
      strikes: `${shortPut}P / ${longPut}P`,
      dte,
      popEstimate: `%${metrics.pop}`,
      maxRisk: `$${metrics.maxLoss.toFixed(2)}`,
      breakeven: `$${(shortPut - metrics.netCredit).toFixed(2)}`,
      notes: [
        `📊 POP: %${metrics.pop} | Max Profit: $${metrics.maxProfit.toFixed(2)} | R/R: ${(metrics.maxProfit / metrics.maxLoss).toFixed(2)}`,
        `📈 IV Rank: ${iv}/100 — ${metrics.ivSignalLabel}`,
        `🎯 Expected Move: $${metrics.expectedMove.toFixed(2)} (%${metrics.expectedMovePct.toFixed(1)})`,
        `💰 Kelly Sizing: ${metrics.kellyContracts} contract ($${metrics.kellyRisk.toFixed(0)} risk)`,
        `⏰ Entry: ${metrics.entryWindow}`,
        `📋 Order: ${metrics.orderType} (slippage ≤%${metrics.slippageEstimate})`,
      ],
      warnings: [
        stock.earningsWarning || null,
        `⚠️ RSI ${rsi.toFixed(1)} — Aşırı satım, dönüş potansiyeli ama riskli`,
        metrics.ivSignal === "BUY_PREMIUM" ? "✅ IV düşük — Long premium mantıklı" : null,
      ].filter(Boolean) as string[],
      color: "text-amber-400",
      metrics,
    };
  }

  if (signal === "STRONG_BUY" || signal === "BUY" || signal === "NEUTRAL_BULLISH") {
    // Bullish momentum
    return {
      name: "Bull Call Spread",
      nameTr: "Boğa Call Spread'i (Debit)",
      direction: "BULLISH",
      setup: `Buy ${itmStrike}C / Sell ${otmStrike}C`,
      strikes: `${itmStrike}C / ${otmStrike}C`,
      dte,
      popEstimate: `%${metrics.pop}`,
      maxRisk: `$${metrics.netDebit.toFixed(2)}`,
      breakeven: `$${(itmStrike + metrics.netDebit).toFixed(2)}`,
      notes: [
        `📊 POP: %${metrics.pop} | Max Profit: $${(otmStrike - itmStrike - metrics.netDebit).toFixed(2)} | R/R: ${((otmStrike - itmStrike - metrics.netDebit) / metrics.netDebit).toFixed(2)}`,
        `📈 IV Rank: ${iv}/100 — ${metrics.ivSignalLabel}`,
        `🎯 Expected Move: $${metrics.expectedMove.toFixed(2)} (%${metrics.expectedMovePct.toFixed(1)})`,
        `💰 Kelly Sizing: ${metrics.kellyContracts} contract ($${metrics.kellyRisk.toFixed(0)} risk)`,
        `⏰ Entry: ${metrics.entryWindow}`,
        `📋 Order: ${metrics.orderType} (slippage ≤%${metrics.slippageEstimate})`,
      ],
      warnings: [
        stock.earningsWarning || null,
        stock.rsiWarning || null,
        stock.volumeRatio < 1 ? "⚠️ Düşük hacim — Büyük pozisyonlardan kaçının" : null,
        metrics.ivSignal === "SELL_PREMIUM" ? "⚠️ IV yüksek — Debit spread pahalı olabilir, credit düşün" : null,
      ].filter(Boolean) as string[],
      color: "text-emerald-400",
      metrics,
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
    metrics,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// RENDER
// ═══════════════════════════════════════════════════════════════════════════════

export default function OptionStrategyPanel({ stock }: OptionStrategyPanelProps) {
  const strategy = suggestStrategy(stock);
  const m = strategy.metrics;

  if (strategy.direction === "NEUTRAL") {
    return (
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/20 p-3">
        <p className="text-xs text-slate-500">Opsiyon Stratejisi</p>
        <p className="mt-1 text-sm text-slate-400">{strategy.nameTr} — Bugün için uygun setup yok</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <h4 className="flex items-center gap-2 text-xs font-semibold text-slate-300">
        {strategy.direction === "BULLISH" ? (
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 text-red-400" />
        )}
        v4.0 Kurumsal Opsiyon Analizi — {strategy.nameTr}
      </h4>

      {/* Primary Metrics Grid */}
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
          <p className="text-[10px] text-slate-500">POP</p>
          <p className="text-sm font-bold text-white">{strategy.popEstimate}</p>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5">
          <p className="text-[10px] text-slate-500">Max Risk</p>
          <p className="text-sm font-bold text-white">{strategy.maxRisk}</p>
        </div>
      </div>

      {/* Secondary Metrics */}
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
            Giriş Penceresi
          </div>
          <p className="text-sm font-bold text-white">{m.entryWindow}</p>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <DollarSign className="h-3 w-3" />
            Kelly Sizing
          </div>
          <p className="text-sm font-bold text-white">{m.kellyContracts} lot (%2 NLV)</p>
        </div>
      </div>

      {/* v4.0 Advanced Metrics */}
      <div className="rounded-lg border border-slate-700/30 bg-slate-800/20 p-3">
        <h5 className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <BarChart3 className="h-3 w-3" />
          v4.0 Kurumsal Metrikler
        </h5>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <div>
            <p className="text-[10px] text-slate-500">Expected Move</p>
            <p className="text-xs font-bold text-white">${m.expectedMove.toFixed(2)} ({m.expectedMovePct.toFixed(1)}%)</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500">IV Sinyali</p>
            <p className={`text-xs font-bold ${m.ivSignal === "SELL_PREMIUM" ? "text-emerald-400" : m.ivSignal === "BUY_PREMIUM" ? "text-amber-400" : "text-slate-400"}`}>
              {m.ivSignalLabel}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500">Spread Width</p>
            <p className="text-xs font-bold text-white">${m.spreadWidth.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500">R-Adj Return</p>
            <p className="text-xs font-bold text-white">{m.rReturn.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Notes */}
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

      {/* Management Rules */}
      {m.managementRules.length > 0 ? (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
          <h5 className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            <Activity className="h-3 w-3" />
            Yönetim Kuralları (Kurumsal Disiplin)
          </h5>
          <div className="space-y-1">
            {m.managementRules.map((rule, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                <Zap className="mt-0.5 h-3 w-3 flex-shrink-0 text-emerald-400" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Warnings */}
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
