import type { StockResult } from "@/scanner/types";
import { copy } from "@/lib/i18n";
import type { AppLanguage } from "@/lib/i18n";
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
  language: AppLanguage;
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

function calculateV4Metrics(stock: StockResult, language: AppLanguage): v4Metrics {
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
    ivSignalLabel = copy(language, "Premium Satışı (IV Yüksek)", "Premium Sale (High IV)");
  } else if (iv < 30) {
    ivSignal = "BUY_PREMIUM";
    ivSignalLabel = copy(language, "Premium Alımı (IV Düşük)", "Premium Purchase (Low IV)");
  } else {
    ivSignal = "NEUTRAL";
    ivSignalLabel = copy(language, "IV Nötr", "IV Neutral");
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
  const entryWindow = iv > 50
    ? copy(language, "10:30-11:00 AM (volatilite yüksek, sabah bekle)", "10:30-11:00 AM (volatility high, wait for morning)")
    : copy(language, "10:30-11:30 AM", "10:30-11:30 AM");
  const orderType = "MIDPOINT LIMIT";
  const slippageEstimate = rvol > 2 ? 3 : rvol > 1 ? 2 : 1;

  // ─── YÖNETİM KURALLARI ───
  const managementRules = [
    copy(language, `✅ %50 kârda ($${(maxProfit * 0.5).toFixed(2)}) → yarısını kapat`, `✅ At 50% profit ($${(maxProfit * 0.5).toFixed(2)}) → close half`),
    copy(language, `📅 21 DTE'de roll düşün (vade: ${dte} gün)`, `📅 Consider roll at 21 DTE (term: ${dte} days)`),
    copy(language, `🛑 2x kredi ($${(maxLoss * 2).toFixed(2)}) → zararda kapat`, `🛑 2x credit ($${(maxLoss * 2).toFixed(2)}) → close at loss`),
    copy(language, `⏰ 14 DTE time stop → zaman değeri eriyor`, `⏰ 14 DTE time stop → time value eroding`),
    copy(language, `📊 Limit emir: Midpoint giriş, slippage ≤%${slippageEstimate}`, `📊 Limit order: Midpoint entry, slippage ≤%${slippageEstimate}`),
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

function suggestStrategy(stock: StockResult, language: AppLanguage): StrategySuggestion {
  const price = stock.currentPrice;
  const atr = stock.atr14d || price * 0.02;
  const rsi = stock.rsi;
  const change = stock.priceChangePct;
  const signal = stock.signal;
  const iv = stock.ivProxy || 50;
  const metrics = calculateV4Metrics(stock, language);

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
      name: copy(language, "Ayı Call Spread'i (Kredi)", "Bear Call Spread"),
      nameTr: "Ayı Call Spread'i (Kredi)",
      direction: "BEARISH",
      setup: `${copy(language, "Sat", "Sell")} ${shortCall}C / ${copy(language, "Al", "Buy")} ${longCall}C`,
      strikes: `${shortCall}C / ${longCall}C`,
      dte,
      popEstimate: `%${metrics.pop}`,
      maxRisk: `$${metrics.maxLoss.toFixed(2)}`,
      breakeven: `$${metrics.breakeven.toFixed(2)}`,
      notes: [
        copy(language, `📊 POP: %${metrics.pop} | Maks Kâr: $${metrics.maxProfit.toFixed(2)} | R/R: ${(metrics.maxProfit / metrics.maxLoss).toFixed(2)}`, `📊 POP: %${metrics.pop} | Max Profit: $${metrics.maxProfit.toFixed(2)} | R/R: ${(metrics.maxProfit / metrics.maxLoss).toFixed(2)}`),
        copy(language, `📈 IV Rank: ${iv}/100 — ${metrics.ivSignalLabel}`, `📈 IV Rank: ${iv}/100 — ${metrics.ivSignalLabel}`),
        copy(language, `🎯 Beklenen Hareket: $${metrics.expectedMove.toFixed(2)} (%${metrics.expectedMovePct.toFixed(1)})`, `🎯 Expected Move: $${metrics.expectedMove.toFixed(2)} (%${metrics.expectedMovePct.toFixed(1)})`),
        copy(language, `💰 Kelly Boyutlandırma: ${metrics.kellyContracts} ${copy(language, "kontrat", "contract")} ($${metrics.kellyRisk.toFixed(0)} ${copy(language, "risk", "risk")})`, `💰 Kelly Sizing: ${metrics.kellyContracts} contract ($${metrics.kellyRisk.toFixed(0)} risk)`),
        copy(language, `⏰ Giriş: ${metrics.entryWindow}`, `⏰ Entry: ${metrics.entryWindow}`),
        copy(language, `📋 Emir: ${metrics.orderType} (${copy(language, "slippage", "slippage")} ≤%${metrics.slippageEstimate})`, `📋 Order: ${metrics.orderType} (slippage ≤%${metrics.slippageEstimate})`),
      ],
      warnings: [
        stock.earningsWarning || null,
        rsi >= 80 ? copy(language, `🚨 RSI ${rsi.toFixed(1)} — Aşırı alım, geri çekilme yakın`, `🚨 RSI ${rsi.toFixed(1)} — Overbought, pullback near`) : null,
        change > 5 ? copy(language, `⚠️ Gün içi %${change.toFixed(1)} — Slippage riski yüksek`, `⚠️ Intraday %${change.toFixed(1)} — Slippage risk high`) : null,
        metrics.ivSignal === "SELL_PREMIUM" ? copy(language, "✅ IV yüksek — Premium satışı mantıklı", "✅ High IV — Premium sale makes sense") : null,
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
      name: copy(language, "Boğa Put Spread'i (Kredi)", "Bull Put Spread"),
      nameTr: "Boğa Put Spread'i (Kredi)",
      direction: "BULLISH",
      setup: `${copy(language, "Sat", "Sell")} ${shortPut}P / ${copy(language, "Al", "Buy")} ${longPut}P`,
      strikes: `${shortPut}P / ${longPut}P`,
      dte,
      popEstimate: `%${metrics.pop}`,
      maxRisk: `$${metrics.maxLoss.toFixed(2)}`,
      breakeven: `$${(shortPut - metrics.netCredit).toFixed(2)}`,
      notes: [
        copy(language, `📊 POP: %${metrics.pop} | Maks Kâr: $${metrics.maxProfit.toFixed(2)} | R/R: ${(metrics.maxProfit / metrics.maxLoss).toFixed(2)}`, `📊 POP: %${metrics.pop} | Max Profit: $${metrics.maxProfit.toFixed(2)} | R/R: ${(metrics.maxProfit / metrics.maxLoss).toFixed(2)}`),
        copy(language, `📈 IV Rank: ${iv}/100 — ${metrics.ivSignalLabel}`, `📈 IV Rank: ${iv}/100 — ${metrics.ivSignalLabel}`),
        copy(language, `🎯 Beklenen Hareket: $${metrics.expectedMove.toFixed(2)} (%${metrics.expectedMovePct.toFixed(1)})`, `🎯 Expected Move: $${metrics.expectedMove.toFixed(2)} (%${metrics.expectedMovePct.toFixed(1)})`),
        copy(language, `💰 Kelly Boyutlandırma: ${metrics.kellyContracts} ${copy(language, "kontrat", "contract")} ($${metrics.kellyRisk.toFixed(0)} ${copy(language, "risk", "risk")})`, `💰 Kelly Sizing: ${metrics.kellyContracts} contract ($${metrics.kellyRisk.toFixed(0)} risk)`),
        copy(language, `⏰ Giriş: ${metrics.entryWindow}`, `⏰ Entry: ${metrics.entryWindow}`),
        copy(language, `📋 Emir: ${metrics.orderType} (${copy(language, "slippage", "slippage")} ≤%${metrics.slippageEstimate})`, `📋 Order: ${metrics.orderType} (slippage ≤%${metrics.slippageEstimate})`),
      ],
      warnings: [
        stock.earningsWarning || null,
        copy(language, `⚠️ RSI ${rsi.toFixed(1)} — Aşırı satım, dönüş potansiyeli ama riskli`, `⚠️ RSI ${rsi.toFixed(1)} — Oversold, reversal potential but risky`),
        metrics.ivSignal === "BUY_PREMIUM" ? copy(language, "✅ IV düşük — Long premium mantıklı", "✅ Low IV — Long premium makes sense") : null,
      ].filter(Boolean) as string[],
      color: "text-amber-400",
      metrics,
    };
  }

  if (signal === "STRONG_BUY" || signal === "BUY" || signal === "NEUTRAL_BULLISH") {
    // Bullish momentum
    return {
      name: copy(language, "Boğa Call Spread'i (Debit)", "Bull Call Spread"),
      nameTr: "Boğa Call Spread'i (Debit)",
      direction: "BULLISH",
      setup: `${copy(language, "Al", "Buy")} ${itmStrike}C / ${copy(language, "Sat", "Sell")} ${otmStrike}C`,
      strikes: `${itmStrike}C / ${otmStrike}C`,
      dte,
      popEstimate: `%${metrics.pop}`,
      maxRisk: `$${metrics.netDebit.toFixed(2)}`,
      breakeven: `$${(itmStrike + metrics.netDebit).toFixed(2)}`,
      notes: [
        copy(language, `📊 POP: %${metrics.pop} | Maks Kâr: $${(otmStrike - itmStrike - metrics.netDebit).toFixed(2)} | R/R: ${((otmStrike - itmStrike - metrics.netDebit) / metrics.netDebit).toFixed(2)}`, `📊 POP: %${metrics.pop} | Max Profit: $${(otmStrike - itmStrike - metrics.netDebit).toFixed(2)} | R/R: ${((otmStrike - itmStrike - metrics.netDebit) / metrics.netDebit).toFixed(2)}`),
        copy(language, `📈 IV Rank: ${iv}/100 — ${metrics.ivSignalLabel}`, `📈 IV Rank: ${iv}/100 — ${metrics.ivSignalLabel}`),
        copy(language, `🎯 Beklenen Hareket: $${metrics.expectedMove.toFixed(2)} (%${metrics.expectedMovePct.toFixed(1)})`, `🎯 Expected Move: $${metrics.expectedMove.toFixed(2)} (%${metrics.expectedMovePct.toFixed(1)})`),
        copy(language, `💰 Kelly Boyutlandırma: ${metrics.kellyContracts} ${copy(language, "kontrat", "contract")} ($${metrics.kellyRisk.toFixed(0)} ${copy(language, "risk", "risk")})`, `💰 Kelly Sizing: ${metrics.kellyContracts} contract ($${metrics.kellyRisk.toFixed(0)} risk)`),
        copy(language, `⏰ Giriş: ${metrics.entryWindow}`, `⏰ Entry: ${metrics.entryWindow}`),
        copy(language, `📋 Emir: ${metrics.orderType} (${copy(language, "slippage", "slippage")} ≤%${metrics.slippageEstimate})`, `📋 Order: ${metrics.orderType} (slippage ≤%${metrics.slippageEstimate})`),
      ],
      warnings: [
        stock.earningsWarning || null,
        stock.rsiWarning || null,
        stock.volumeRatio < 1 ? copy(language, "⚠️ Düşük hacim — Büyük pozisyonlardan kaçının", "⚠️ Low volume — Avoid large positions") : null,
        metrics.ivSignal === "SELL_PREMIUM" ? copy(language, "⚠️ IV yüksek — Debit spread pahalı olabilir, credit düşün", "⚠️ High IV — Debit spread may be expensive, consider credit") : null,
      ].filter(Boolean) as string[],
      color: "text-emerald-400",
      metrics,
    };
  }

  // Default: Neutral / Weak
  return {
    name: copy(language, "Uygun Setup Yok", "No Setup"),
    nameTr: "Uygun Setup Yok",
    direction: "NEUTRAL",
    setup: copy(language, "Bekle", "Wait"),
    strikes: "—",
    dte: 0,
    popEstimate: "—",
    maxRisk: "—",
    breakeven: "—",
    notes: [
      copy(language, `Sinyal: ${signal} — Momentum zayıf`, `Signal: ${signal} — Momentum weak`),
      copy(language, "Bugün için opsiyon setup'ı önerilmiyor", "No option setup recommended for today"),
      copy(language, "Yarın tekrar tarama yapın", "Scan again tomorrow"),
    ],
    warnings: [],
    color: "text-slate-400",
    metrics,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// RENDER
// ═══════════════════════════════════════════════════════════════════════════════

export default function OptionStrategyPanel({ stock, language }: OptionStrategyPanelProps) {
  const strategy = suggestStrategy(stock, language);
  const m = strategy.metrics;

  if (strategy.direction === "NEUTRAL") {
    return (
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/20 p-3">
        <p className="text-xs text-slate-500">{copy(language, "Opsiyon Stratejisi", "Option Strategy")}</p>
        <p className="mt-1 text-sm text-slate-400">
          {copy(
            language,
            `${strategy.nameTr} — Bugün için uygun setup yok`,
            `${strategy.name} — No suitable setup for today`
          )}
        </p>
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
        {copy(
          language,
          `v4.0 Kurumsal Opsiyon Analizi — ${strategy.nameTr}`,
          `v4.0 Enterprise Option Analysis — ${strategy.name}`
        )}
      </h4>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5">
          <p className="text-[10px] text-slate-500">{copy(language, "Kurulum", "Setup")}</p>
          <p className={`text-sm font-bold ${strategy.color}`}>{strategy.setup}</p>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5">
          <p className="text-[10px] text-slate-500">{copy(language, "Vade (DTE)", "Term (DTE)")}</p>
          <p className="text-sm font-bold text-white">{strategy.dte} {copy(language, "gün", "days")}</p>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5">
          <p className="text-[10px] text-slate-500">POP</p>
          <p className="text-sm font-bold text-white">{strategy.popEstimate}</p>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5">
          <p className="text-[10px] text-slate-500">{copy(language, "Max Risk", "Max Risk")}</p>
          <p className="text-sm font-bold text-white">{strategy.maxRisk}</p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Target className="h-3 w-3" />
            {copy(language, "Breakeven", "Breakeven")}
          </div>
          <p className="text-sm font-bold text-white">{strategy.breakeven}</p>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Clock className="h-3 w-3" />
            {copy(language, "Giriş Penceresi", "Entry Window")}
          </div>
          <p className="text-sm font-bold text-white">{m.entryWindow}</p>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <DollarSign className="h-3 w-3" />
            {copy(language, "Kelly Boyutlandırma", "Kelly Sizing")}
          </div>
          <p className="text-sm font-bold text-white">{m.kellyContracts} {copy(language, "lot", "lot")} (%2 {copy(language, "NLV", "NLV")})</p>
        </div>
      </div>

      {/* v4.0 Advanced Metrics */}
      <div className="rounded-lg border border-slate-700/30 bg-slate-800/20 p-3">
        <h5 className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <BarChart3 className="h-3 w-3" />
          {copy(language, "v4.0 Kurumsal Metrikler", "v4.0 Enterprise Metrics")}
        </h5>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <div>
            <p className="text-[10px] text-slate-500">{copy(language, "Beklenen Hareket", "Expected Move")}</p>
            <p className="text-xs font-bold text-white">${m.expectedMove.toFixed(2)} ({m.expectedMovePct.toFixed(1)}%)</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500">{copy(language, "IV Sinyali", "IV Signal")}</p>
            <p className={`text-xs font-bold ${m.ivSignal === "SELL_PREMIUM" ? "text-emerald-400" : m.ivSignal === "BUY_PREMIUM" ? "text-amber-400" : "text-slate-400"}`}>
              {m.ivSignalLabel}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500">{copy(language, "Spread Genişliği", "Spread Width")}</p>
            <p className="text-xs font-bold text-white">${m.spreadWidth.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500">{copy(language, "R-Adj Getiri", "R-Adj Return")}</p>
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
            {copy(language, "Yönetim Kuralları (Kurumsal Disiplin)", "Management Rules (Enterprise Discipline)")}
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
