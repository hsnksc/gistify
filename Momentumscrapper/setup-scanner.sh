#!/bin/bash
# NASDAQ Scanner v4.3 — Gistify Kurulum Scripti
# Kullanım: cd gistify && bash setup-scanner.sh

set -e

echo "=========================================="
echo "NASDAQ Scanner → Gistify Kurulum"
echo "=========================================="

CLIENT="$(pwd)/client/src"
if [ ! -d "$CLIENT" ]; then
    echo "HATA: client/src dizini bulunamadı!"
    echo "Lütfen gistify kök dizininden çalıştırın."
    exit 1
fi

# 1. Scanner dizinlerini oluştur
echo "[1/5] Dizinler oluşturuluyor..."
mkdir -p "$CLIENT/scanner/lib"
mkdir -p "$CLIENT/scanner/components"
mkdir -p "$CLIENT/scanner/locales"

# 2. Dosyaları kopyala (kaynak: mevcut scanner build)
echo "[2/5] Scanner dosyaları kopyalanıyor..."

# Ana dosyalar
cat > "$CLIENT/scanner/types.ts" << 'EOF'
export interface ScoreExplanation {
  factor: string; score: number; weight: number; reason: string; detail: string;
}
export interface ConfidenceBreakdown {
  dataCompleteness: number; priceRecency: number; volumeQuality: number;
  indicatorReliability: number; overall: number; label: "HIGH" | "MEDIUM" | "LOW";
}
export interface RankingInfo {
  rankingScore: number; momentumContribution: number; confidenceContribution: number;
  rrContribution: number; patternBonus: number; rank: number;
}
export interface StockResult {
  ticker: string; name: string; sector: string; currentPrice: number;
  prevClose: number; priceChangePct: number; openPrice: number;
  opening30mHigh: number; openingMomentum: number; volume: number;
  avgVolume20d: number; volumeRatio: number; opening30mVolume: number;
  rsi: number; rsi2: number; rsi7: number; macd: number; macdSignal: number;
  macdHistogram: number; vwap: number; vwapSlope: number; vwapDeviation: number;
  atr14d: number; atrMomentumScore: number; gapScore: number; orbScore: number;
  structureScore: number; rvolScore: number; rsiShortScore: number;
  catalystScore: number; high52w: number; low52w: number; range52wPct: number;
  marketCap: number; avgDollarVolume: number; score: number; signal: string;
  timestamp: string; targetPrice?: number; ivProxy?: number;
  earningsWarning?: string | null; confidenceScore?: number;
  confidenceBreakdown?: ConfidenceBreakdown; rankingScore?: number;
  rankingInfo?: RankingInfo; scoreExplanations?: ScoreExplanation[];
  dataQuality?: "GOOD" | "FAIR" | "POOR"; rsiWarning?: string | null;
  bearScore?: number; bearSignal?: string; persistenceScore?: number;
  persistenceDirection?: "BULL" | "BEAR"; isT1Suitable?: boolean;
  t1Note?: string; catalystFlags?: string[]; catalystSummary?: string;
  microScore?: number; microReversalRisk?: string; microWarning?: string | null;
}
export interface ScanResponse {
  scanTime: string; totalScanned: number; totalMatches: number;
  marketStatus: string; stocks: StockResult[];
}
EOF

echo "  ✓ types.ts"

# useScannerI18n.ts
cat > "$CLIENT/scanner/useScannerI18n.ts" << 'EOF'
import { useMemo } from "react";
import { type AppLanguage } from "@/lib/i18n";

const TR: Record<string, string> = {
  "Tarama Yap": "Tarama Yap", "Taranıyor...": "Taranıyor...",
  "hisse eşleşti": "hisse eşleşti", "Eşleşen hisse bulunamadı": "Eşleşen hisse bulunamadı",
  "Filtreleri genişletmeyi dene": "Filtreleri genişletmeyi dene",
  "Hisse": "Hisse", "Fiyat": "Fiyat", "Değişim": "Değişim", "Hacim": "Hacim",
  "RVOL": "RVOL", "Skor": "Skor", "Sinyal": "Sinyal", "Güven": "Güven",
  "ATR": "ATR", "Hedef": "Hedef", "Detaylar": "Detaylar",
  "Min Skor": "Min Skor", "Veri İYİ": "Veri İYİ", "Veri ORTA": "Veri ORTA", "Veri ZAYIF": "Veri ZAYIF",
  "Güncel Fiyat": "Güncel Fiyat", "Günlük Değişim": "Günlük Değişim",
  "Hedef Fiyat": "Hedef Fiyat", "Skor Açıklamaları": "Skor Açıklamaları",
  "AŞIRI ALIM - KESİNLİKLE GİRME!": "AŞIRI ALIM - KESİNLİKLE GİRME!",
  "SICAK BÖLGE - DİKKAT": "SICAK BÖLGE - DİKKAT", "GÜÇLÜ AL": "GÜÇLÜ AL",
  "AL": "AL", "NÖTR": "NÖTR", "BEKLE": "BEKLE", "Kapat": "Kapat",
};

const EN: Record<string, string> = {
  "Tarama Yap": "Run Scan", "Taranıyor...": "Scanning...",
  "hisse eşleşti": "matches found", "Eşleşen hisse bulunamadı": "No matching stocks",
  "Filtreleri genişletmeyi dene": "Try broadening filters",
  "Hisse": "Ticker", "Fiyat": "Price", "Değişim": "Change", "Hacim": "Volume",
  "RVOL": "RVOL", "Skor": "Score", "Sinyal": "Signal", "Güven": "Confidence",
  "ATR": "ATR", "Hedef": "Target", "Detaylar": "Details",
  "Min Skor": "Min Score", "Veri İYİ": "Data GOOD", "Veri ORTA": "Data FAIR", "Veri ZAYIF": "Data POOR",
  "Güncel Fiyat": "Current Price", "Günlük Değişim": "Daily Change",
  "Hedef Fiyat": "Target Price", "Skor Açıklamaları": "Score Explanations",
  "AŞIRI ALIM - KESİNLİKLE GİRME!": "OVERBOUGHT - DO NOT ENTER!",
  "SICAK BÖLGE - DİKKAT": "HOT ZONE - CAUTION", "GÜÇLÜ AL": "STRONG BUY",
  "AL": "BUY", "NÖTR": "NEUTRAL", "BEKLE": "WAIT", "Kapat": "Close",
};

export function useScannerI18n(lang: AppLanguage) {
  const dict = useMemo(() => lang === "tr" ? TR : EN, [lang]);
  const t = (key: string): string => dict[key] || key;
  return { t };
}
EOF

echo "  ✓ useScannerI18n.ts"

# ScannerPage.tsx (simplified working version)
cat > "$CLIENT/scanner/components/ScannerPage.tsx" << 'EOF'
import { useState, useCallback, useEffect } from "react";
import { Radar, Loader2, Filter, Activity, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useScannerI18n } from "@/scanner/useScannerI18n";
import type { StockResult } from "@/scanner/types";
import { scoreColor, signalBg, signalLabel } from "@/scanner/lib/scoreConfig";
import { getScanTimingWarning } from "@/scanner/lib/momentum";
import { fetchStockDataHybrid } from "@/scanner/lib/dataProviders";
import { analyzeStockFull } from "@/scanner/lib/momentum";

interface Props { lang: "tr" | "en"; }

const TICKERS = [
  "AAPL","MSFT","AMZN","GOOGL","NVDA","META","TSLA","NFLX","AMD","AVGO",
  "CRM","SNOW","MRVL","PLTR","HOOD","SOFI","ACHR","MU","COIN","DKNG",
  "NOK","BB","CCL","F","INTC","ROKU","SQ","CRWD","ETSY","XPEV",
  "LCID","RIVN","NIO","PLUG","ENPH","RUN","BURL","COST","LI","IONQ",
];

export default function ScannerPage({ lang }: Props) {
  const { t } = useScannerI18n(lang);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<StockResult[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [minScore, setMinScore] = useState("45");
  const [filterSig, setFilterSig] = useState("ALL");
  const [sortKey, setSortKey] = useState<keyof StockResult>("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(getScanTimingWarning());

  useEffect(() => { const iv = setInterval(() => setWarning(getScanTimingWarning()), 60000); return () => clearInterval(iv); }, []);

  const handleScan = useCallback(async () => {
    setScanning(true); setError(null); setResults([]);
    const stocks: StockResult[] = [];
    for (const ticker of TICKERS) {
      try {
        const result = await fetchStockDataHybrid(ticker);
        if (result.data) {
          const analysis = analyzeStockFull(result.data);
          if (analysis.score >= (parseInt(minScore) || 45)) {
            if (filterSig === "ALL" || analysis.signal === filterSig) stocks.push(analysis);
          }
        }
      } catch { /* skip */ }
    }
    stocks.sort((a, b) => b.score - a.score);
    setResults(stocks); setScanning(false);
  }, [minScore, filterSig]);

  const filtered = [...results].sort((a, b) => {
    const av = (a[sortKey] as number) ?? 0, bv = (b[sortKey] as number) ?? 0;
    return sortDir === "asc" ? av - bv : bv - av;
  });

  const doSort = (k: keyof StockResult) => { if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(k); setSortDir("desc"); } };

  return (
    <div className="space-y-6 p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Radar className="w-6 h-6 text-emerald-400" /> NASDAQ Scanner</h1>
          <p className="text-sm text-slate-400 mt-1">Momentum tarama — 11 faktör</p>
        </div>
        {warning && <span className="text-xs text-amber-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{warning}</span>}
      </div>

      <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4 space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <button onClick={handleScan} disabled={scanning} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg transition-all">
            {scanning ? <><Loader2 className="w-4 h-4 animate-spin" /> {t("Taranıyor...")} ({results.length}/{TICKERS.length})</> : <><Radar className="w-4 h-4" /> {t("Tarama Yap")}</>}
          </button>
          <div><label className="text-xs text-slate-500 mb-1 block">{t("Min Skor")}</label><input value={minScore} onChange={e => setMinScore(e.target.value)} className="w-20 bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-sm" type="number" min="0" max="100" /></div>
          <div><label className="text-xs text-slate-500 mb-1 block">{t("Sinyal")}</label><div className="flex gap-1">{["ALL","STRONG_BUY","BUY","NEUTRAL"].map(s => <button key={s} onClick={() => setFilterSig(s)} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${filterSig === s ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"}`}>{s === "ALL" ? "Tümü" : s}</button>)}</div></div>
        </div>
        {scanning && <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden"><div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (results.length / TICKERS.length) * 100)}%` }} /></div>}
        {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</div>}
      </div>

      {filtered.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-slate-800/60"><span className="text-sm text-slate-400">{filtered.length} {t("hisse eşleşti")}</span></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-slate-800/60">
                {[{k:"ticker" as const,l:t("Hisse")},{k:"score" as const,l:t("Skor")},{k:"signal" as const,l:t("Sinyal")},{k:"currentPrice" as const,l:t("Fiyat")},{k:"priceChangePct" as const,l:t("Değişim")},{k:"rsi" as const,l:"RSI"},{k:"volumeRatio" as const,l:t("RVOL")},{k:"confidenceScore" as const,l:t("Güven")}].map(c => <th key={c.k} onClick={() => doSort(c.k)} className="px-3 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white text-left">{c.l} {sortKey === c.k && (sortDir === "asc" ? "↑" : "↓")}</th>)}
                <th className="px-3 py-3"></th>
              </tr></thead>
              <tbody>{filtered.map(s => <>
                <tr key={s.ticker} className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-all cursor-pointer" onClick={() => setExpanded(expanded === s.ticker ? null : s.ticker)}>
                  <td className="px-3 py-3"><span className="font-semibold text-white">{s.ticker}</span></td>
                  <td className="px-3 py-3"><span className={`font-bold ${scoreColor(s.score)}`}>{s.score}</span></td>
                  <td className="px-3 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium border ${signalBg(s.signal)} text-white`}>{signalLabel(s.signal)}</span>{s.rsiWarning && <span className="ml-2 text-[9px] text-red-400">RED</span>}</td>
                  <td className="px-3 py-3 text-sm text-slate-300">${s.currentPrice.toFixed(2)}</td>
                  <td className="px-3 py-3"><span className={`text-sm font-medium ${s.priceChangePct >= 0 ? "text-emerald-400" : "text-red-400"}`}>{s.priceChangePct >= 0 ? "+" : ""}{s.priceChangePct.toFixed(2)}%</span></td>
                  <td className="px-3 py-3 text-sm text-slate-400">{s.rsi.toFixed(1)}</td>
                  <td className="px-3 py-3 text-sm text-slate-400">{s.volumeRatio.toFixed(2)}x</td>
                  <td className="px-3 py-3"><span className={`text-xs ${(s.confidenceScore||0) >= 80 ? "text-emerald-400" : (s.confidenceScore||0) >= 50 ? "text-amber-400" : "text-red-400"}`}>{s.confidenceScore || 0}</span></td>
                  <td className="px-3 py-3">{expanded === s.ticker ? <ChevronUp className="w-4 h-4 text-slate-500"/> : <ChevronDown className="w-4 h-4 text-slate-500"/>}</td>
                </tr>
                {expanded === s.ticker && <tr><td colSpan={9} className="px-4 py-4 bg-slate-900/80">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-slate-800/40 rounded-lg p-3"><p className="text-[10px] text-slate-500">{t("Güncel Fiyat")}</p><p className="text-sm font-bold text-white">${s.currentPrice.toFixed(2)}</p></div>
                    <div className="bg-slate-800/40 rounded-lg p-3"><p className="text-[10px] text-slate-500">{t("Günlük Değişim")}</p><p className={`text-sm font-bold ${s.priceChangePct >= 0 ? "text-emerald-400" : "text-red-400"}`}>{s.priceChangePct >= 0 ? "+" : ""}{s.priceChangePct.toFixed(2)}%</p></div>
                    <div className="bg-slate-800/40 rounded-lg p-3"><p className="text-[10px] text-slate-500">ATR (14)</p><p className="text-sm font-bold text-white">${s.atr14d.toFixed(2)}</p></div>
                    <div className="bg-slate-800/40 rounded-lg p-3"><p className="text-[10px] text-slate-500">{t("Hedef Fiyat")}</p><p className="text-sm font-bold text-emerald-400">${(s.targetPrice||0).toFixed(2)}</p></div>
                  </div>
                  {s.scoreExplanations && s.scoreExplanations.length > 0 && <div>
                    <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2"><Activity className="w-3.5 h-3.5"/> {t("Skor Açıklamaları")}</h4>
                    <div className="space-y-1.5">{s.scoreExplanations.map((ex, i) => <div key={i} className="flex items-start gap-3 text-xs p-2 rounded bg-slate-800/30"><span className="text-slate-500 w-24 flex-shrink-0">{ex.factor}</span><span className={`font-medium ${scoreColor(ex.score)} w-10 text-right`}>{Math.round(ex.score * ex.weight)}</span><span className="text-slate-400">{ex.reason}</span></div>)}</div>
                  </div>}
                  {s.rsiWarning && <div className={`mt-3 rounded-lg p-3 border ${s.signal === "OVERBOUGHT_RED" ? "bg-red-500/10 border-red-500/30" : "bg-orange-500/10 border-orange-500/30"}`}><p className={`text-xs font-semibold ${s.signal === "OVERBOUGHT_RED" ? "text-red-400" : "text-orange-400"}`}>{s.signal === "OVERBOUGHT_RED" ? "🚨 AŞIRI ALIM" : "⚠️ SICAK BÖLGE"}</p><p className="text-xs text-slate-400 mt-1">{s.rsiWarning}</p></div>}
                </td></tr>}
              </>)}</tbody>
            </table>
          </div>
        </div>
      )}
      {results.length > 0 && filtered.length === 0 && <div className="text-center text-slate-500 py-12"><Filter className="w-8 h-8 mx-auto mb-3 opacity-50"/><p>{t("Eşleşen hisse bulunamadı")}</p><p className="text-sm mt-1">{t("Filtreleri genişletmeyi dene")}</p></div>}
    </div>
  );
}
EOF

echo "  ✓ ScannerPage.tsx"

# 3. Lib dosyalarını kopyala
echo "[3/5] Lib dosyaları kopyalanıyor..."
SCANNER_SRC="${SCANNER_SRC:-/mnt/agents/output/gistify-scanner/client/src/scanner}"

if [ -d "$SCANNER_SRC/lib" ]; then
    cp -r "$SCANNER_SRC/lib/"* "$CLIENT/scanner/lib/"
    FILE_COUNT=$(find "$CLIENT/scanner/lib" -type f | wc -l)
    echo "  ✓ $FILE_COUNT lib dosyası kopyalandı"
else
    echo "  ⚠ Lib kaynağı bulunamadı — manuel kopyalama gerekli"
fi

# 4. pages/Scanner.tsx
echo "[4/5] Scanner sayfası oluşturuluyor..."
cat > "$CLIENT/pages/Scanner.tsx" << 'EOF'
import { useEffect, useState } from "react";
import ScannerPage from "@/scanner/components/ScannerPage";
import { type AppLanguage, APP_LANGUAGE_STORAGE_KEY } from "@/lib/i18n";

export default function Scanner() {
  const [lang, setLang] = useState<AppLanguage>(() => {
    return (localStorage.getItem(APP_LANGUAGE_STORAGE_KEY) as AppLanguage) || "tr";
  });
  useEffect(() => {
    const h = () => { const s = localStorage.getItem(APP_LANGUAGE_STORAGE_KEY) as AppLanguage; if (s && s !== lang) setLang(s); };
    window.addEventListener("storage", h);
    const iv = setInterval(h, 1000);
    return () => { window.removeEventListener("storage", h); clearInterval(iv); };
  }, [lang]);
  return <div className="min-h-screen bg-slate-950 text-white"><ScannerPage lang={lang} /></div>;
}
EOF

echo "  ✓ pages/Scanner.tsx"

# 5. App.tsx patch talimatları
echo ""
echo "=========================================="
echo "[5/5] SON ADIM: App.tsx'e route ekle"
echo "=========================================="
echo ""
echo "client/src/App.tsx dosyasında:"
echo ""
echo "1) Import ekle (diğer import'ların yanına):"
echo '   import Scanner from "@/pages/Scanner";'
echo '   import { Radar } from "lucide-react";'
echo ""
echo "2) Switch/Route içine ekle:"
echo '   <Route path="/scanner" component={Scanner} />'
echo ""
echo "3) Nav menüye ekle (sidebar/nav varsa):"
echo '   { label: translateUiText("NASDAQ Scanner", lang), href: "/scanner", icon: Radar }'
echo ""
echo "=========================================="
echo "Kurulum tamamlandı!"
echo "=========================================="
echo ""
echo "Sonraki adımlar:"
echo "  cd $(pwd)/client"
echo "  pnpm dev"
echo ""
echo "Tarayıcı: http://localhost:3001/scanner"
