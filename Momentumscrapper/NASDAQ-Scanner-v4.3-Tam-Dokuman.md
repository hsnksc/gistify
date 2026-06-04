# NASDAQ Momentum Scanner v4.3 — Tam Teknik Dokuman
## AI Catalyst + Microstructure + PDT Persistence + 5 Sekmeli Portal

**Versiyon:** 4.3 | **Tarih:** 29 Mayis 2026 | **Toplam Kod:** ~10,000+ satir | **Dosya:** 60+

---

## ICINDEKILER

1. [Proje Ozeti](#1-proje-ozeti)
2. [Klasor Yapisi](#2-klasor-yapisi)
3. [Algoritma Mimarisi](#3-algoritma-mimarisi)
4. [11 Faktor Skorlama](#4-11-faktor-skorlama)
5. [v4.1 RSI RED Filtresi](#51-v41-rsi-red-filtresi)
6. [v4.2 Cift Yonlu Motor](#52-v42-cift-yonlu-motor)
7. [v4.2 PDT Persistence](#53-v42-pdt-persistence)
8. [v4.3 AI Catalyst Analyzer](#54-v43-ai-catalyst-analyzer)
9. [v4.3 Microstructure Check](#55-v43-microstructure-check)
10. [Confidence Score](#6-confidence-score)
11. [Ranking Score](#7-ranking-score)
12. [Opsiyon Stratejileri](#8-opsiyon-stratejileri)
13. [Hibrit Veri Saglayici](#9-hibrit-veri-saglayici)
14. [Sanity Gate](#10-sanity-gate)
15. [5 Sekmeli Portal](#11-5-sekmele-portal)
16. [Veri Akisi](#12-veri-akisi)
17. [API Anahtarlari](#13-api-anahtarlari)
18. [Bilinen Sorunlar](#14-bilinen-sorunlar)
19. [Degisiklik Gecmisi](#15-degisiklik-gecmisi)

---

## 1. PROJE OZETI

NASDAQ Momentum Scanner, NASDAQ borsasinda gunun ilk yarim saatinde (09:30-10:00 EST) en guclu momentumu gosteren hisseleri bulan, cift yonlu (CALL/PUT) opsiyon stratejisi ureten, AI katalizor ve mikro yapi analizi ile zenginlestirilmis web tabanli bir analiz platformudur.

### Ozellikler

| Ozellik | Versiyon | Aciklama |
|---------|----------|----------|
| 11 Faktor Skorlama | v1-v3 | RVOL, GAP, ORB, VWAP, Structure, RSI, Velocity, MarketCap, Retention, Price Change |
| RSI RED Filtresi | v4.1 | RSI >= 80 = skor 0 (otomatik RED) |
| Cift Yonlu Motor | v4.2 | Hem CALL hem PUT skorlama |
| PDT Persistence | v4.2 | T+1 uygunluk analizi |
| AI Catalyst | v4.3 | Haber/katalizor analizi (PDF entegrasyonu) |
| Microstructure | v4.3 | 1dk bar yorgunluk tespiti (PDF entegrasyonu) |
| 5 Sekmeli Portal | v4.3 | Dashboard, Tarama, Analiz, Gecmis, Portfoy |
| 10+ Grafik | v4.3 | Area, Pie, Bar, Radar chart'lar |

---

## 2. KLASOR YAPISI

```
app/
├── public/
│   └── favicon.ico
├── src/
│   ├── layouts/
│   │   └── PortalLayout.tsx          # Ana layout (sidebar + header + content)
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx             # Dashboard sekme (6 grafik + 4 kart)
│   │   ├── ScanPage.tsx              # Tarama sekme (30 hisse + filtreleme)
│   │   ├── AnalysisPage.tsx          # Analiz sekme (tek hisse detayli)
│   │   ├── HistoryPage.tsx           # Gecmis sekme (8 kayit + trend)
│   │   ├── PortfolioPage.tsx         # Portfoy sekme (5 pozisyon + P/L)
│   │   └── Home.tsx                  # Eski ana sayfa (yedek)
│   │
│   ├── sections/
│   │   ├── ResultsTable.tsx          # Sonuc tablosu (v4.2 sutunlar)
│   │   ├── StockDetailModal.tsx      # Hisse detay modal
│   │   ├── OptionsPanel.tsx          # Opsiyon paneli (cift yonlu)
│   │   ├── ScannerControls.tsx       # Tarama kontrolleri
│   │   ├── StatsCards.tsx            # Istatistik kartlari
│   │   ├── SmartScanner.tsx          # Akilli tarama motoru
│   │   ├── FilterPanel.tsx           # Filtre paneli
│   │   ├── AlertSystem.tsx           # Uyari sistemi
│   │   ├── PatternMatches.tsx        # Pattern eslesmeleri
│   │   └── RadarTooltip.tsx          # Radar aciklamasi
│   │
│   ├── components/
│   │   └── ui/                       # shadcn/ui bileşenleri
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       └── ...
│   │
│   ├── lib/
│   │   ├── momentum.ts               # ANA MOTOR (740 satir, 11 faktor)
│   │   ├── v4Engine.ts              # v4 Prop Desk motoru (319 satir)
│   │   ├── scoreConfig.ts            # Skor yapilandirma (311 satir)
│   │   ├── optionsStrategies.ts      # Opsiyon stratejileri (412 satir)
│   │   ├── dataProviders.ts          # Hibrit veri saglayici (716 satir)
│   │   ├── sanityGate.ts             # Veri dogrulama (231 satir)
│   │   ├── pdtAnalyzer.ts            # PDT analiz motoru (380 satir)
│   │   ├── aiCatalystAnalyzer.ts     # AI katalizor analizi (187 satir) NEW
│   │   ├── microstructureCheck.ts    # Mikro yapi kontrolu (142 satir) NEW
│   │   ├── executionRules.ts         # Giris/cikis kurallari
│   │   ├── yahooFinance.ts           # Yahoo Finance istemcisi
│   │   ├── regimeDetector.ts         # Piyasa rejimi tespiti
│   │   ├── optionAnalytics.ts        # POP, Expected Move
│   │   ├── portfolioRisk.ts          # Portfoy risk analizi
│   │   ├── trainedModel.ts           # Egitilmis agirliklar
│   │   ├── filters.ts                # Tarama filtreleri
│   │   ├── parallelScanner.ts        # Paralel tarama
│   │   ├── dailyScanner.ts           # Gunluk tarama
│   │   ├── advancedPattern.ts        # Ileri duzey pattern
│   │   ├── backtestEngine.ts         # Backtest motoru
│   │   ├── consistencyReport.ts      # Tutarlilik raporu
│   │   ├── queryEngine.ts            # Sorgu motoru
│   │   ├── v3Report.ts              # v3 raporlama
│   │   ├── varEngine.ts             # Value at Risk
│   │   └── watchlist.ts             # Izleme listesi
│   │
│   ├── types/
│   │   ├── scanner.ts                # Ana tip tanimlari
│   │   └── options.ts                # Opsiyon tip tanimlari
│   │
│   ├── hooks/
│   │   └── use-mobile.ts
│   │
│   ├── App.tsx                       # Router + Layout
│   └── main.tsx                      # Entry point
│
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 3. ALGORITMA MIMARISI

### Katmanli Yapi (5 Katman)

```
KATMAN 1: VERI CEKME (dataProviders.ts)
  Yahoo Finance -> Massive -> TwelveData -> Alphavantage
  CORS Proxy: AllOrigins -> corsproxy.io

KATMAN 2: ANALIZ (momentum.ts)
  11 Faktor skorlama
  + Bear skoru (v4.2)
  + Persistence skoru (v4.2)
  + AI Catalyst (v4.3)
  + Microstructure (v4.3)
  + RSI RED filtresi (v4.1)
  = Raw Score

KATMAN 3: DOGRULAMA (sanityGate.ts)
  NaN/Infinity kontrolu
  Aralik clamp [0, 100]
  Agirlik normalize

KATMAN 4: SKORLAMA (scoreConfig.ts)
  Confidence Score (4 bilesen)
  Ranking Score (4 bilesen)
  Signal belirleme (9 sinyal)

KATMAN 5: CIKTI (optionsStrategies.ts)
  CALL setup (Long Call / Bull Call Spread)
  PUT setup (Long Put / Bear Put Spread)
  POP hesaplama
  Kelly sizing
  Execution plan
```

---

## 4. 11 FAKTOR SKORLAMA

### Faktorler ve Agirliklari (v3 normalize)

| # | Faktor | Fonksiyon | Agirlik | Aciklama |
|---|--------|-----------|---------|----------|
| 1 | **RVOL** | `rvolScore()` | 0.1489 | Goreceli Hacim. 1x=15, 2x=50, 4x=100. **En onemli faktor.** |
| 2 | **GAP** | `gapScore()` | 0.10 | Acilis boslugu. 1-4% = optimal. >8% = riskli. |
| 3 | **ORB** | `orbScore()` | 0.13 | Opening Range Breakout. 30dk zorunlu. 2x ATR = guclu. |
| 4 | **VWAP** | `vwapScore()` | 0.13 | VWAP pozisyonu + normalize egim. Ustunde + egim yukari = 90. |
| 5 | **Structure** | `checkStructure()` | 0.08 | Higher Highs / Higher Lows (10 gun). 50 = tam HH/HL. |
| 6 | **RSI Short** | `rsiShortScore()` | 0.10 | RSI(7)*0.7 + RSI(9)*0.3 blend. 55-75 = optimal (85 puan). |
| 7 | **Velocity Dir** | `velocityScore()` | 0.07 | ATR bazli yon. >2 ATR = 95. Yonlu hareket puani. |
| 8 | **Velocity Vol** | `velocityScore()` | 0.03 | ATR bazli volatilite. Gunluk range / ATR. |
| 9 | **MarketCap** | `marketCapScore()` | 0.04 | Piyasa degeri bonusu. >$100B = guvenli. <$2B = riskli. |
| 10 | **Retention** | `intradayRetentionScore()` | 0.08 | Gun ici geri cekilme kalitesi. <%0.3 pullback = 85. |
| 11 | **Price Change** | (inline) | 0.09 | Gunluk degisim skoru. 3-8% = optimal (75 puan). |

**Agirlik Toplami:** 1.0000

### Her Faktorun Skor Araligi

```
0-25:   Zayif / Riskli
25-50:  Orta / Nötr
50-75:  Iyi / Pozitif
75-100: Mükemmel / Güclu
```

---

## 5. VERSIYON GECMISI

### 5.1 v4.1 — RSI RED Filtresi

```typescript
if (rsi14 >= 80) {
  signal = "OVERBOUGHT_RED";
  score = 0;  // SIFIR!
} else if (rsi14 >= 75) {
  signal = "CAUTION_HOT";
  score = raw_score * 0.3;  // %70 düşüş
} else if (rsi14 <= 25) {
  signal = "OVERSOLD_CAUTION";
  score = raw_score * 0.5;  // %50 düşüş
}
```

**Amac:** RSI 80+ hisselere "gir" demek yerine otomatik engel koymak.

### 5.2 v4.2 — Cift Yonlu Motor

**Yeni fonksiyonlar:**

| Fonksiyon | Dosya | Satir | Aciklama |
|-----------|-------|-------|----------|
| `calculateBearScore()` | momentum.ts | ~50 | Bullish faktorleri tersine cevirir |
| `calculatePersistenceScore()` | momentum.ts | ~40 | T+1 uygunluk skoru |
| `recommendBiDirectionalStrategies()` | optionsStrategies.ts | ~30 | CALL + PUT setup'lari |
| `buildCallSetup()` | optionsStrategies.ts | ~40 | CALL stratejisi |
| `buildPutSetup()` | optionsStrategies.ts | ~40 | PUT stratejisi |
| `decidePrimaryDirection()` | optionsStrategies.ts | ~15 | Yön tavsiyesi |
| `isT1Suitable()` | optionsStrategies.ts | ~25 | T+1 kontrolu |

**Bear Skorlama Mantigi:**
```
RSI:     Ters cevrilmis (<=25 = 100 puan)
VWAP:    Altinda = pozitif
RVOL:    Negatif degisim + yüksek hacim = pozitif
Yapi:    Lower Lows / Lower Highs
GAP:     Negatif gap
Velocity: Asagi yon
```

### 5.3 v4.2 — PDT Persistence

**T+1'de gecerli faktorler:**
- Structure (0.35 agirlik)
- RSI (0.25 agirlik)
- RVOL (0.20 agirlik)
- Price Change (0.10 agirlik)
- MarketCap (0.10 agirlik)

**T+1'de gecersiz faktorler (sifirlandi):**
- ORB (%13 -> 0)
- VWAP (%13 -> 0)
- Retention (%8 -> 0)
- **Toplam etki:** %34 agirlik sifir

**Threshold:** Persistence >= 65 = T+1 uygun

### 5.4 v4.3 — AI Catalyst Analyzer

**Dosya:** `src/lib/aiCatalystAnalyzer.ts` (187 satir)

**25 haber kategorisi:**

| Kategori | Ornekler |
|----------|----------|
| **Pozitif (+3)** | EARNINGS_BEAT, FDA_APPROVAL, M_AND_A |
| **Pozitif (+2)** | UPGRADE, BUYBACK, PARTNERSHIP, TARGET_RAISE |
| **Pozitif (+1)** | INSIDER_BUYING, SHORT_SQUEEZE |
| **Negatif (-3)** | DILUTION, EARNINGS_MISS, GUIDANCE_CUT, SELL_RATING, SEC_INVESTIGATION |
| **Negatif (-2)** | DOWNGRADE, SHARE_ISSUANCE, DEBT_CONCERN, LAWSUIT, EXECUTIVE_SELL |

**Entegrasyon:**
```typescript
// Risk flag varsa skordan düs
if (catalyst.flags.length > 0) {
  score = Math.max(0, score - flags.length * 8);
}
// Katalizör skoruna göre ayarla
score += (catalyst.score - 2) * 10;  // -10, 0, veya +10
```

### 5.5 v4.3 — Microstructure Check

**Dosya:** `src/lib/microstructureCheck.ts` (142 satir)

**4 Metrik birlesik:**

| Metrik | Agirlik | Aciklama |
|--------|---------|----------|
| Lower Low (ardisik) | +15/birim | Son kac bar üst üste düsük dip yapti |
| Lower High (ardisik) | +10/birim | Son kac bar üst üste düsük zirve yapti |
| Hacim düsüsü | +15 | Son bar hacim ortalamanin %70 altinda |
| Fitil orani | +20 max | (Üst fitil + Alt fitil) / Range > 0.5 = yorgunluk |

**Entegrasyon:**
```typescript
if (micro.reversalRisk === "HIGH") {
  score = score * 0.6;        // %40 düşüş
  signal = bir seviye aşağı;  // STRONG_BUY -> BUY
}
if (micro.reversalRisk === "MEDIUM") {
  score = score * 0.85;       // %15 düşüş
}
```

---

## 6. CONFIDENCE SCORE

4 alt bilesen:

| Bilesen | Agirlik | Aciklama |
|---------|---------|----------|
| Data Completeness | 0.30 | Fiyat, hacim, marketCap verisi tam mi? |
| Price Recency | 0.25 | Son fiyat ne kadar taze? |
| Volume Quality | 0.25 | Sifir hacimli gün var mi? |
| Indicator Reliability | 0.20 | Fiyat gap'i var mi (eksik veri)? |

```
Confidence = completeness*0.30 + recency*0.25 + volume*0.25 + reliability*0.20
```

---

## 7. RANKING SCORE

```
Ranking = momentum*0.55 + confidence*0.25 + R/R*0.10 + pattern*0.10
```

| Bilesen | Agirlik | Aciklama |
|---------|---------|----------|
| Momentum Skoru | 0.55 | 11 faktorün agirlikli toplami |
| Confidence Score | 0.25 | Veri kalitesi güveni |
| Risk/Ödül | 0.10 | (Hedef - Fiyat) / (Fiyat - Stop) |
| Pattern | 0.10 | Breakout, reversal, vb. pattern puani |

---

## 8. OPSIYON STRATEJILERI

### Strateji Secim Mantigi

| Durum | CALL Stratejisi | PUT Stratejisi |
|-------|----------------|----------------|
| Skor >= 75 + RVOL >= 2 + RSI 50-80 | Long Call | — |
| Skor >= 55 + VWAP > 0 | Bull Call Spread | — |
| Bear >= 75 + RVOL >= 2 + RSI <= 50 | — | Long Put |
| Bear >= 55 + VWAP < 0 | — | Bear Put Spread |
| Her ikisi de orta | Bull Put Spread (konservatif) | Bull Put Spread |

### POP Hesaplama

```
POP = P(fiyat > breakeven at expiration)
ITM call: ~65% POP
OTM call: distance / (dailyMove * sqrt(DTE/5))
```

### Kelly Sizing

```
winProb = POP / 100
edge = winProb - (1 / (R/R + 1))
kelly = edge / (1 / R/R) * 100
```

| Kelly | Pozisyon |
|-------|----------|
| >= 2.0% | NLV %2.0 |
| >= 1.5% | NLV %1.5 |
| >= 1.0% | NLV %1.0 |
| >= 0.5% | NLV %0.5 |
| < 0.5% | NLV %0.3 (küçük) |

### Vade Kurallari

| DTE | Durum |
|-----|-------|
| < 3 gün | Yeni pozisyon ACMA (theta decay maksimum) |
| < 7 gün + RSI 80+ | ACMA (cift risk) |
| < 14 gün | Uyari (14 DTE time stop yaklasiyor) |
| 14-21 gün | Ideal |
| > 21 gün | Güvenli ama prim pahali |

---

## 9. HIBRIT VERI SAGLAYICI

### API Zinciri (Öncelik Sirasi)

| # | API | Rate Limit | Durum | Veri Kalitesi |
|---|-----|-----------|-------|--------------|
| 1 | **Yahoo Finance** | 30/dk, 2000/gün | Calisiyor | 90 (en zengin) |
| 2 | **Massive** | 100/dk, 10000/gün | Test edildi | 92 (yüksek limit) |
| 3 | **TwelveData** | 8/dk, 800/gün | Test edildi | 88 (60 gün + real-time) |
| 4 | **Alphavantage** | 5/dk, 25/gün | Son çare | 60 (çok kisitli) |

### CORS Proxy Fallback

```
1. AllOrigins  (https://api.allorigins.win/raw?url=)
2. corsproxy.io (https://corsproxy.io/?)
```

### Test Sonuclari

| API | Durum | Not |
|-----|-------|-----|
| Massive | ✅ 40 gün AAPL $308.82 | Basarili |
| TwelveData | ✅ 10 gün + meta | Basarili |
| Yahoo | ✅ Ana kaynak | Basarili |
| Finnhub | ❌ 401 Invalid API Key | Kaldirildi |
| Stooq | ❌ "Get your apikey" | Kaldirildi |
| Nasdaq Link | ❌ 403 Forbidden | Kaldirildi |
| Finazon | ❌ 401 | Kaldirildi |

---

## 10. SANITY GATE

### Güvenlik Fonksiyonlari

```typescript
isSafeNumber(v)     → number ve NaN/Infinity degilse true
safeNumber(v, fb)   → Güvensizse fallback deger döndür
clamp100(v)         → [0, 100] araligina zorla
```

### Kontrol Sirasi

1. Her faktor skoru kontrol et (NaN/Infinity/null → 50)
2. Aralik disiysa clamp ([0,100] içine zorla)
3. Agirliklari kontrol et (toplam 1.00 degilse normalize)
4. Final skoru clamp et
5. Yahoo veri yapisi kontrolu (JSON, meta, null orani <%30)

---

## 11. 5 SEKMELI PORTAL

### Portal Layout (`layouts/PortalLayout.tsx`)

**Özellikler:**
- Sidebar (acilir/kapanir, lg breakpoint)
- Mobile overlay
- Header (arama, bildirim, kullanici)
- Responsive (mobil sidebar collapse)
- Aktif sekme isaretleme (Activity animasyonu)
- Piyasa durumu widgeti (BULL/BEAR)

### 11.1 Dashboard Sekme

**Grafikler:**
| Grafik | Tip | Veri |
|--------|-----|------|
| Momentum Akisi | AreaChart | 09:30-15:30 saatlik skor |
| Sinyal Dagilimi | PieChart (donut) | 5 kategori (STRONG_BUY'dan RED'e) |
| Sektör Performansi | BarChart (vertical) | 6 sektör skoru |
| Faktör Analizi | RadarChart | 8 faktör skoru |

**Kartlar:**
- Aktif Sinyal (17)
- Ortalama Momentum (68.4)
- En Iyi Sektör (Teknoloji)
- Piyasa Rejimi (BULL)

**Listeler:**
- Günün en hareketlileri (5 hisse)
- Uyarilar (5 alert)

### 11.2 Tarama Sekme

**Kontroller:**
- Tara/Durdur butonlari
- Min skor filtresi (Input)
- Vade secimi (14/21/30 gün)
- Sinyal filtresi (ALL/STRONG_BUY/BUY/NEUTRAL)
- Progress bar (tarama ilerlemesi)

**Tablo Sütunlari:**
Hisse | Skor | Sinyal | Fiyat | Degisim | RSI | RVOL | **Bear** | **PDT** | Detay

**Detay Kartlari (Expanded Row):**
- AI Katalizör (skor + flag'ler)
- Microstructure (yorgunluk + risk)
- Mini AreaChart (skor trendi)

### 11.3 Analiz Sekme

**Arama:**
- Ticker input
- Son aramalar (5 kayit)

**Sonuclar:**
- 5 özet kart (Fiyat, Bull Skor, Bear Skor, PDT, AI Katalizör)
- Faktör RadarChart
- Faktör BarChart (vertical)
- CALL Setup karti
- PUT Setup karti

### 11.4 Gecmis Sekme

**Istatistikler:**
- Toplam tarama (8)
- Ortalama en iyi skor
- Bull orani (%)
- Ortalama VIX

**Grafik:**
- Skor trendi AreaChart (en iyi + ortalama)

**Tablo:**
Tarih | Hisse | Skor | Ortalama | Rejim | VIX

### 11.5 Portföy Sekme

**Özet Kartlari:**
- Toplam P/L (+$3)
- Yatirilan ($242)
- Açik pozisyon (5)
- Theta riski (5 poz.)
- Win rate (%40)

**Pozisyon Tablosu:**
Hisse | Tip | Strike | Vade | Giris | Güncel | DTE | P/L | Sil

**Theta Uyarilari:**
- DTE <= 7 olan pozisyonlar listelenir

**Yeni Pozisyon Formu:**
- Ticker, Tip (CALL/PUT), Strike, Giris $, Adet, Vade

---

## 12. VERI AKISI

```
1. Kullanici "TARA" butonuna tiklar
   ↓
2. ScannerControls → App.tsx'e SCAN_START
   ↓
3. App.tsx → parallelScanner.ts
   ↓
4. Her hisse (30 adet):
   a. dataProviders.ts → fetchStockDataHybrid()
      Oncelik: Yahoo → Massive → TwelveData → Alphavantage
   b. Ilk basarili API'den veri döner
   ↓
5. momentum.ts → analyzeStockFull() [v4.3]
   a. 11 faktor skorlanir (momentum.ts)
   b. Bear skoru hesaplanir (calculateBearScore)
   c. Persistence skoru (calculatePersistenceScore)
   d. AI Catalyst analizi (aiCatalystAnalyzer.ts)
   e. Microstructure check (microstructureCheck.ts)
   f. RSI RED filtresi uygulanir
   g. Sonuclar entegre edilir
   ↓
6. sanityGate.ts kontrolu
   ↓
7. Confidence + Ranking Score
   ↓
8. optionsStrategies.ts
   CALL setup + PUT setup
   POP, Kelly, Execution plan
   ↓
9. StockResult üretilir
   ↓
10. ResultsTable / SmartScanner gösterimi
    ↓
11. Kullanici hisse tiklar
    → StockDetailModal / OptionsPanel (cift yonlu)
    ↓
12. Portfoy'e eklenebilir (PortfolioPage)
```

---

## 13. API ANAHTARLARI

```
TwelveData:  d2bff39c345a49f1aa9ab15c70fcd6a9
Massive:     3AjVXfyR6gxZgB9g3SpN7e6e7JLiIxTq
Alphavantage: d7mjhe1r01qngrvoel6gd7mjhe1r01qngrvoel70
```

**Calismayan API'ler:**
- Finnhub (401 Invalid API Key)
- Stooq ("Get your apikey")
- Nasdaq Data Link (403 Forbidden)
- Finazon (401)

---

## 14. BILINEN SORUNLAR

| # | Sorun | Etki | Cozum |
|---|-------|------|-------|
| 1 | EOD veri sadece — Intraday 30m CORS'ta çalismiyor | ORB skoru gerçekci degil | WebSocket veya Alpaca entegrasyonu |
| 2 | Yahoo Finance CORS engeli | Tarayici tarafinda bloklaniyor | Backend proxy |
| 3 | AI Catalyst offline — gerçek API yok | Haber analizi simülasyon | Gemini/OpenAI API entegrasyonu |
| 4 | Microstructure 1dk bar yok | Günlük bar proxy kullaniliyor | Alpaca/Polygon 1dk data |
| 5 | Chunk size uyari (865 KB) | Performans etkisi | Code splitting |

---

## 15. DEGISIKLIK GECMISI

| Versiyon | Tarih | Degisiklikler |
|----------|-------|--------------|
| v1.0 | 2024 | Temel 11 faktor skorlama |
| v2.0 | 2025 | Confidence Score + Explanation Engine |
| v3.0 | 2025 | Wilson CI + Vade kontrolü + Sektör haritasi |
| v4.0 | 2026 | Confidence + Ranking + Sanity Gate |
| v4.1 | May 2026 | **RSI RED filtresi** (RSI >= 80 = skor 0) |
| v4.2 | May 2026 | **Cift yonlu motor** (CALL/PUT) + **PDT Persistence** |
| v4.3 | May 2026 | **AI Catalyst Analyzer** + **Microstructure Check** + **5 Sekmeli Portal** + **10+ Grafik** |

---

*Hazirlayan: NASDAQ Momentum Scanner AI*
*Versiyon: 4.3*
*Son Güncelleme: 29 Mayis 2026*
