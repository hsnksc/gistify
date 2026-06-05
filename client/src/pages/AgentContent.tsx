import { useEffect, useState } from "react";
import { Bot, FileText, Sparkles, Upload } from "lucide-react";
import { Streamdown } from "streamdown";

interface AgentContentItem {
  id: string;
  title: string;
  source: "kimi" | "manual";
  createdAt: string;
  summary: string;
  content: string;
  tags: string[];
}

// Demo content — replace with API fetch later
const DEMO_CONTENT: AgentContentItem[] = [
  {
    id: "1",
    title: "28 Mayıs 2026 — Momentum & Opsiyon Raporu",
    source: "kimi",
    createdAt: "2026-05-28T10:30:00Z",
    summary: "META ve AMZN call, JPM ve BAC put opsiyon analizi. v4.0 kurumsal skorlama ile.",
    content: `## 🎯 28 Mayıs 2026 — v4.0 Call & Put Opsiyon Analizi

### 📈 CALL OPSİYONLARI

| # | Hisse | Fiyat | Getiri | Strateji | POP | Risk |
|---|-------|-------|--------|----------|-----|------|
| 🥇 | META | $635.26 | +3.74% | Long Call Spread 630/640 | %50 | $5.0 |
| 🥈 | AMZN | $271.85 | +2.47% | Long Call Spread 270/275 | %50 | $2.5 |
| 🥉 | HD | $317.85 | +2.35% | Long Call Spread 315/320 | %50 | $2.5 |

### 📉 PUT OPSİYONLARI

| # | Hisse | Fiyat | Getiri | Strateji | POP | Risk |
|---|-------|-------|--------|----------|-----|------|
| 🥇 | JPM | $299.28 | -2.43% | Bear Put Spread 300/290 | %58 | $4.0 |
| 🥈 | BAC | $51.10 | -2.11% | Bear Put Spread 50/47.5 | %55 | $1.5 |

### 💡 Strateji Detayları

**META Bull Call Spread**
- Kurulum: Buy 630C / Sell 640C
- POP: %50 | Max Risk: $5.0 | Max Profit: $5.0
- Breakeven: $635.00
- Yönetim: %50 kar → yarı kapat, debit x2 → stop

**JPM Bear Put Spread**
- Kurulum: Buy 300P / Sell 290P
- POP: %58 | Max Risk: $4.0 | Max Profit: $6.0
- Breakeven: $296.00
- Yönetim: %50 kar → yarı kapat, debit x2 → stop

### ⚠️ Uyarılar
- Piyasa kararsız — 7/15 yükseldi, 8/15 düştü
- Hacimler düşük — Büyük pozisyonlardan kaçının (%2 NLV)
- Limit emir kullanın — Piyasa emiri slippage riski
- En iyi giriş: 10:30-11:30 AM EDT
`,
    tags: ["momentum", "options", "v4.0", "daily"],
  },
  {
    id: "2",
    title: "NASDAQ Momentum Scanner v4.0 — Teknik Doküman",
    source: "kimi",
    createdAt: "2026-05-27T14:00:00Z",
    summary: "v1'den v4.0'a evrim, 11 faktörlü skorlama, kurumsal özellikler, 4 katmanlı rapor formatı.",
    content: `## NASDAQ Momentum Scanner v4.0 — Teknik Doküman

### Sistem Genel Bakış
- **Mimari**: Client-side React + Python backend modülleri
- **Teknoloji Yığını**: React 19, TypeScript, Tailwind, Recharts
- **Veri Kaynakları**: Yahoo Finance, Massive, TwelveData, Alphavantage

### v1 → v4.0 Evrimi

| Versiyon | Özellik |
|----------|---------|
| v1 | Temel momentum skorlama (5 faktör) |
| v2 | IV Proxy, ATR hedef, Earnings uyarısı |
| v3 | 11 faktör, Confidence Score, Ranking Score, RSI RED filtresi |
| v4.0 | Dinamik ağırlık, Kelly sizing, VaR, IV Surface, Execution disiplini |

### 11 Faktörlü Skorlama Motoru

1. RVOL (Göreceli Hacim) — 0.15
2. GAP (Açılış Boşluğu) — 0.10
3. ORB (Opening Range Breakout) — 0.13
4. VWAP (Pozisyon/Eğim) — 0.13
5. Fiyat Yapısı (HH/HL) — 0.08
6. RSI Kısa Vade — 0.10
7. Velocity Yön — 0.07
8. Velocity Volatilite — 0.03
9. Piyasa Değeri — 0.04
10. Intraday Retention — 0.08
11. Günlük Değişim — 0.09

### v4.0 Kurumsal Özellikler

- **Dinamik Ağırlık**: VIX rejimine göre RVOL ve Price Change ağırlıklarını otomatik kaydır
- **Kelly Sizing**: Edge'e göre pozisyon boyutu, max %2 NLV
- **IV Yüzeyi**: Term structure + skew + IV/HV oranı
- **Portföy Isısı**: %5 limit — geçerse yeni işlem durur
- **Execution Disiplini**: 10:30 giriş, midpoint limit, slippage %5

### 4 Katmanlı Rapor Formatı

1. **Katman 1 — Piyasa Rejimi**: VIX, Term Structure, IV/HV
2. **Katman 2 — Açık Pozisyonlar**: DTE, Delta, Theta decay, çıkış planı
3. **Katman 3 — Yeni Kurulumlar**: POP, Max Risk, Expected Move, Breakeven
4. **Katman 4 — Portföy Sağlığı**: Beta-weighted delta, sektör dağılımı, stress test
`,
    tags: ["documentation", "v4.0", "technical"],
  },
];

export default function AgentContent() {
  const [items] = useState<AgentContentItem[]>(DEMO_CONTENT);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [language, setLanguage] = useState<"tr" | "en">("tr");

  const selected = items.find((i) => i.id === selectedId);

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="overflow-hidden rounded-none border border-border bg-card/95 shadow-2xl">
          <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:p-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-none border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                <Bot className="h-3.5 w-3.5" />
                Agent Content
              </div>
              <div className="space-y-2">
                <h1 className="heading-condensed text-3xl text-foreground md:text-5xl">
                  {language === "en" ? "AI-Generated Intelligence" : "AI Üretim İstihbaratı"}
                </h1>
                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {language === "en"
                    ? "Reports, analyses and strategies generated by Kimi AI Agent Swarm. Curated and deployed directly into Gistify."
                    : "Kimi AI Agent Swarm tarafından üretilen raporlar, analizler ve stratejiler. Doğrudan Gistify'ye aktarılır."}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-none border border-border bg-background/60 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {language === "en" ? "Source" : "Kaynak"}
                </p>
                <p className="data-mono mt-2 text-2xl font-bold text-emerald-300">
                  Kimi AI
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Agent Swarm + Deep Research
                </p>
              </div>
              <div className="rounded-none border border-border bg-background/60 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {language === "en" ? "Format" : "Format"}
                </p>
                <p className="data-mono mt-2 text-2xl font-bold text-emerald-300">
                  Markdown
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Streamdown rendering
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)]">
          {/* Sidebar — Content List */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {language === "en" ? "Library" : "Kütüphane"}
              </p>
              <span className="text-xs text-muted-foreground">{items.length} items</span>
            </div>

            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`w-full rounded-none border p-4 text-left transition-all ${
                  selectedId === item.id
                    ? "border-emerald-400/30 bg-emerald-500/10"
                    : "border-border bg-card/80 hover:bg-card"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {item.source === "kimi" ? (
                      <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <FileText className="h-3.5 w-3.5 text-slate-400" />
                    )}
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {item.source}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString(
                      language === "en" ? "en-US" : "tr-TR",
                      { day: "2-digit", month: "short" }
                    )}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {item.summary}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}

            {/* Upload hint */}
            <div className="rounded-none border border-dashed border-border bg-card/40 p-4 text-center">
              <Upload className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-2 text-xs text-muted-foreground">
                {language === "en"
                  ? "Paste Kimi-generated markdown to deploy"
                  : "Kimi'den üretilen markdown'ı yapıştırarak deploy edin"}
              </p>
            </div>
          </section>

          {/* Main — Content Viewer */}
          <section className="rounded-none border border-border bg-card/95 p-6 shadow-2xl">
            {selected ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                        {selected.source} Agent
                      </span>
                    </div>
                    <h2 className="mt-2 heading-condensed text-2xl text-foreground">
                      {selected.title}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(selected.createdAt).toLocaleString(
                        language === "en" ? "en-US" : "tr-TR",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {selected.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <Streamdown>{selected.content}</Streamdown>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <Bot className="h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-sm text-muted-foreground">
                  {language === "en"
                    ? "Select a report from the sidebar to view"
                    : "Görüntülemek için kenar çubuğundan bir rapor seçin"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {language === "en"
                    ? "Or paste Kimi-generated content to deploy"
                    : "Veya Kimi'den üretilen içeriği yapıştırarak deploy edin"}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
