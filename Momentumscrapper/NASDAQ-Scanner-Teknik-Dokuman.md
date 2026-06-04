# NASDAQ Momentum Scanner v4.1 — Teknik Dokuman
## Tam Algoritma ve Bilesen Referansi

---

## ICINDEKILER

1. [Proje Yapisi](#1-proje-yapisi)
2. [Momentum Motoru (momentum.ts)](#2-momentum-motoru)
3. [v4 Prop Desk Motoru (v4Engine.ts)](#3-v4-prop-desk-motoru)
4. [Skor Yapilandirma (scoreConfig.ts)](#4-skor-yapilandirma)
5. [Opsiyon Strateji Motoru (optionsStrategies.ts)](#5-opsiyon-strateji-motoru)
6. [Hibrit Veri Saglayici (dataProviders.ts)](#6-hibrit-veri-saglayici)
7. [Sanity Gate (sanityGate.ts)](#7-sanity-gate)
8. [Diger Bilesenler](#8-diger-bilesenler)
9. [Veri Akisi](#9-veri-akisi)
10. [Bilinen Sorunlar ve Iyilestirme Alanlari](#10-bilinen-sorunlar)

---

## 1. PROJE YAPISI

```
src/
  lib/
    momentum.ts           # Ana momentum motoru (740 satir) — 11 faktorel skorlama
    v4Engine.ts           # v4 Prop Desk motoru (319 satir) — Dinamik agirlik, Kelly sizing
    scoreConfig.ts        # Skor yapilandirma (311 satir) — Agirliklar, threshold'lar, renkler
    optionsStrategies.ts  # Opsiyon stratejileri (412 satir) — POP, Expected Move, Spread
    dataProviders.ts      # Hibrit veri saglayici (716 satir) — 4 API, fallback zinciri
    sanityGate.ts         # Veri dogrulama (231 satir) — NaN/Infinity engelleme
    yahooFinance.ts       # Yahoo Finance istemcisi
    regimeDetector.ts     # Piyasa rejimi tespiti
    optionAnalytics.ts    # POP, Expected Move hesaplama
    executionRules.ts     # Giris/CIkis kurallari
    portfolioRisk.ts      # Portfoy risk analizi
    trainedModel.ts       # Egitilmis agirliklar
    filters.ts            # Tarama filtreleri
    parallelScanner.ts    # Paralel tarama
    dailyScanner.ts       # Gunluk tarama
    advancedPattern.ts    # Ileri duzey pattern tespiti
    backtestEngine.ts     # Backtest motoru
    consistencyReport.ts  # Tutarlilik raporu
    queryEngine.ts        # Sorgu motoru
    v3Report.ts           # v3 raporlama
    varEngine.ts          # Value at Risk
    watchlist.ts          # Izleme listesi
  types/
    scanner.ts            # Tip tanimlari
    options.ts            # Opsiyon tip tanimlari
  sections/
    ResultsTable.tsx       # Sonuc tablosu
    StockDetailModal.tsx   # Detay modal
    ScannerControls.tsx    # Tarama kontrolleri
    OptionsPanel.tsx       # Opsiyon paneli
    StatsCards.tsx         # Istatistik kartlari
    RadarTooltip.tsx       # Radar aciklamasi
    AlertSystem.tsx        # Uyari sistemi
    FilterPanel.tsx        # Filtre paneli
    PatternMatches.tsx     # Pattern eslesmeleri
```

**Toplam:** 60+ kaynak dosyasi, ~8000+ satir TypeScript kod

---

## 2. MOMENTUM MOTORU (momentum.ts)

**Dosya:** `src/lib/momentum.ts` | **Satir:** 740 | **Rol:** Ana analiz motoru

### 2.1 Giris Filtreleri (Satir 503-506)

```
MIN_AVG_VOLUME_20D = 500_000    // Minimum 20 gunluk ortalama hacim
MIN_DOLLAR_VOLUME  = 50_000_000 // Minimum dolar hacim (fiyat * hacim)
```

Hisse bu threshold'lari gecmezse analize dahil edilmez.

### 2.2 11 Faktor Skorlama

| # | Faktor | Fonksiyon | Agirlik | Aciklama |
|---|--------|-----------|---------|----------|
| 1 | **RVOL** | `rvolScore()` | 0.1489 | Goreceli Hacim (lineer interpolasyon) |
| 2 | **GAP** | `gapScore()` | 0.10 | Acilis boslugu kalitesi |
| 3 | **ORB** | `orbScore()` | 0.13 | Opening Range Breakout (30dk zorunlu) |
| 4 | **VWAP** | `vwapScore()` | 0.13 | VWAP pozisyonu + normalize egim |
| 5 | **Structure** | `checkStructure()` | 0.08 | Higher Highs / Higher Lows (10 gun) |
| 6 | **RSI Short** | `rsiShortScore()` | 0.10 | RSI(7)*0.7 + RSI(9)*0.3 blend |
| 7 | **Velocity Dir** | `velocityScore()` | 0.07 | ATR bazli yon skoru |
| 8 | **Velocity Vol** | `velocityScore()` | 0.03 | ATR bazli volatilite skoru |
| 9 | **MarketCap** | `marketCapScore()` | 0.04 | Piyasa degeri bonusu |
| 10 | **Retention** | `intradayRetentionScore()` | 0.08 | Gun ici geri cekilme kalitesi |
| 11 | **Price Change** | (inline) | 0.09 | Gunluk degisim skoru |

**Agirlik Toplami:** 1.0000 (scoreConfig.ts'de normalize edilmis)

### 2.3 RSI RED Filtresi (Satir 660-684)

```
RSI >= 80 → OVERBOUGHT_RED (skor = 0, giris YASAK)
RSI 75-79 → CAUTION_HOT (skor x0.3)
RSI 25-   → OVERSOLD_CAUTION (skor x0.5)
```

Bu filtre RSI 80+ hisselere otomatik RED verir. Elestri #11 sonrasi eklendi.

### 2.4 Confidence Score (Satir 279-346)

4 alt bilesen:

| Bilesen | Agirlik | Aciklama |
|---------|---------|----------|
| Data Completeness | 0.30 | Fiyat, hacim, marketCap verisi tam mi? |
| Price Recency | 0.25 | Son fiyat ne kadar taze? |
| Volume Quality | 0.25 | Sifir hacimli gun var mi? |
| Indicator Reliability | 0.20 | Fiyat gap'i var mi (eksik veri)? |

### 2.5 Ranking Score (Satir 464-486)

```
Ranking = momentum*0.55 + confidence*0.25 + R/R*0.10 + pattern*0.10
```

### 2.6 Score Explanation Engine (Satir 348-462)

Her faktorden 11 adet dogal dil aciklamasi uretir. Ornek:
- RVOL 3.5x → "Hacim patlamasi - cok guclu ilgi"
- RSI 72 → "Aşiri alim yakini - dikkat, geri cekilme riski artiyor"

### 2.7 Tarama Zaman Uyarisi (Satir 266-272)

```
09:30 oncesi → "Piyasa henuz acilmadi"
09:30-10:00 → "Piyasa yeni acildi, ORB anlamsiz"
10:00-10:30 → "Ideal tarama zamani"
```

---

## 3. v4 PROP DESK MOTORU (v4Engine.ts)

**Dosya:** `src/lib/v4Engine.ts` | **Satir:** 319 | **Rol:** Kurumsal seviye setup uretici

### 3.1 Dinamik Agirlik (Satir 44-87)

VIX rejimine gore faktor agirliklari degisir:

| VIX Rejimi | RVOL | Price Chg | Yapi | Ozel |
|------------|------|-----------|------|------|
| EXTREME_FEAR (35+) | 0.22 | 0.12 | - | ORB azaltilir |
| FEAR (25-34) | 0.20 | 0.10 | - | RSI azaltilir |
| NORMAL (16-24) | Standart | Standart | Standart | - |
| COMPLACENT (13-15) | 0.12 | 0.10 | 0.10 | - |
| EXTREME_COMPLACENT (<12) | 0.10 | - | 0.12 | VWAP 0.15 |

### 3.2 Volatilite-Adjusted Skor (Satir 93-107)

```
volFactor = 3.0 / ATR%
adjustedScore = rawScore * volFactor
```

Yuksek vol hissenin +3%'u, dusuk vol hissenin +3%'unden daha zor skorlanir.

### 3.3 v4 Setup Uretici (Satir 190-257)

Her hisse icin tam opsiyon setup'i uretir:
- **Spread tasarimi:** RSI > 70 ise %8 OTM, degilse %5 OTM
- **Kelly Sizing:** Edge'e gore pozisyon boyutu (max NLV %2)
- **Execution:** Midpoint limit, 10:30-11:30 giris penceresi
- **Management:** %50 kar al, 21 DTE roll, 2x kredi = stop

---

## 4. SKOR YAPILANDIRMA (scoreConfig.ts)

**Dosya:** `src/lib/scoreConfig.ts` | **Satir:** 311 | **Rol:** Tum sabitler, threshold'lar, renkler

### 4.1 Threshold'lar

```
STRONG_BUY:  75+ (Güclü Al)
BUY:         60+ (Al)
NEUTRAL_BULLISH: 45+ (Nötr-Pozitif)
NEUTRAL:     30+ (Nötr)
HIGH_CONFIDENCE: 80+ (Yüksek Güven)
TOP_TIER:    70+ (En Iyi Kategori)
```

### 4.2 Portfoy Isi Kontrolu

```
Isi >= %5 → Yeni islem YASAK
Isi >= %4 → Uyari, cok küçük pozisyon
Isi < %4  → Güvenli
```

### 4.3 Sinyal Renkleri

```
OVERBOUGHT_RED  → bg-red-500    (RSI 80+)
CAUTION_HOT     → bg-orange-500 (RSI 75-79)
STRONG_BUY      → bg-emerald-500 (Skor 75+)
BUY             → bg-teal-500    (Skor 60+)
```

---

## 5. OPSIYON STRATEJI MOTORU (optionsStrategies.ts)

**Dosya:** `src/lib/optionsStrategies.ts` | **Satir:** 412 | **Rol:** Strateji onerisi + POP + Expected Move

### 5.4 Strateji Secim Mantigi (Satir 233-289)

```
Skor >= 75 + RVOL >= 2 + RSI 50-80 → Long Call veya Bull Call Spread
Skor >= 55 + VWAP > 0             → Bull Call Spread
RVOL >= 3 + |Degisim| > 2%        → Long Straddle
Diger                              → Bull Put Spread (konservatif)
```

### 5.5 POP Hesaplama (optionAnalytics.ts)

```
POP = P(fiyat > breakeven at expiration)
Black-Scholes delta yaklasimi kullanilir
```

### 5.6 Vade Kontrolu (v4.1) (Satir 370-397)

```
DTE < 3  → Yeni pozisyon ACMA (theta decay maksimum)
DTE < 7  → RED/HOT sinyalinde ACMA
DTE < 14 → Uyari (14 DTE time stop yaklasiyor)
DTE >= 14 → Güvenli
```

---

## 6. HIBRIT VERI SAGLAYICI (dataProviders.ts)

**Dosya:** `src/lib/dataProviders.ts` | **Satir:** 716 | **Rol:** 4 API'li fallback zinciri

### 6.1 API Zinciri (Oncelik Sirasi)

| # | API | Rate Limit | Durum | Veri Kalitesi |
|---|-----|-----------|-------|--------------|
| 1 | **Yahoo Finance** | 30/dk, 2000/gun | Calisiyor | 90 (en zengin: marketCap, intraday) |
| 2 | **Massive** | 100/dk, 10000/gun | Test EDILDI | 92 (OHLCV, yüksek limit) |
| 3 | **TwelveData** | 8/dk, 800/gun | Test EDILDI | 88 (60 gun + real-time quote) |
| 4 | **Alphavantage** | 5/dk, 25/gun | Son care | 60 (çok kisitli) |

### 6.2 CORS Proxy Fallback

```
1. AllOrigins (https://api.allorigins.win/raw?url=)
2. Corsproxy.io (https://corsproxy.io/?)
```

Her API cagrisi proxy uzerinden yapilir, biri calismazsa digeri denenir.

### 6.3 Rate Limit Yonetimi

```
canCall(provider) → true/false
  - Dakika limiti asildiysa 60sn blok
  - Gunluk limit asildiysa 60dk blok
trackCall(provider) → Sayaci artir
```

---

## 7. SANITY GATE (sanityGate.ts)

**Dosya:** `src/lib/sanityGate.ts` | **Satir:** 231 | **Rol:** NaN/Infinity/null engelleme

### 7.1 Guvenlik Fonksiyonlari

```
isSafeNumber(v)     → number ve NaN/Infinity degilse true
safeNumber(v, fb)   → Güvensizse fallback deger dondur
clamp100(v)         → [0, 100] araligina zorla
```

### 7.2 Skor Validasyonu

```
1. Her faktor skoru kontrol et (NaN/Infinity/null → 50)
2. Aralik disiysa clamp ([0,100] icine zorla)
3. Agirliklari kontrol et (toplam 1.00 degilse normalize)
4. Final skoru clamp et
```

### 7.3 Yahoo Veri Validasyonu

```
1. JSON yapisi kontrolu
2. Meta ve fiyat verisi var mi?
3. Null orani <%30 mu?
4. Minimum 20 gun veri var mi?
```

---

## 8. DIGER BILEŞENLER

### 8.1 Piyasa Rejimi Tespiti (regimeDetector.ts)

```
VIX < 12 → EXTREME_COMPLACENT
VIX 13-15 → COMPLACENT
VIX 16-24 → NORMAL
VIX 25-34 → FEAR
VIX >= 35 → EXTREME_FEAR
```

Term Structure tespiti: CONTANGO vs BACKWARDATION

### 8.2 Eğitilmis Model (trainedModel.ts)

```
TRAINED_WEIGHTS = {
  rvol: 0.1489, gap: 0.10, orb: 0.13, vwap: 0.13,
  structure: 0.08, rsi_short: 0.10, velocity_dir: 0.07,
  velocity_vol: 0.03, marketCap: 0.04, retention: 0.08, price_change: 0.09
}
```

### 8.3 Sektör Haritasi (dataProviders.ts, 193 satir)

~200 hissenin sektör map'i (NASDAQ + NYSE popüler hisseler)

---

## 9. VERI AKISI

```
1. Kullanici "Tara" butonuna tiklar
   ↓
2. ScannerControls.tsx → App.tsx'e SCAN_START gonderir
   ↓
3. App.tsx → parallelScanner.ts'i calistirir
   ↓
4. Her hisse icin:
   a. dataProviders.ts → fetchStockDataHybrid() cagrilir
   b. Oncelik: Yahoo → Massive → TwelveData → Alphavantage
   c. Ilk basarili API'den veri doner
   ↓
5. Veri momentum.ts → analyzeStock()'a gider
   a. Giris filtreleri (hacim, dolar hacim)
   b. 11 faktor skorlanir
   c. Sanity Gate kontrolu
   d. Confidence Score hesaplanir
   e. Ranking Score hesaplanir
   f. RSI RED filtresi uygulanir
   g. Explanation Engine calistirilir
   ↓
6. Sonuc StockResult tipinde uretilir
   ↓
7. ResultsTable.tsx'de gosterilir
   ↓
8. Kullanici hisse tiklar → StockDetailModal.tsx acilir
   ↓
9. optionsStrategies.ts → recommendStrategies() calistirilir
   a. POP, Expected Move, Spread metrikleri
   b. Kelly sizing, execution plan
   ↓
10. Kullanici kararini verir
```

---

## 10. BILINEN SORUNLAR VE IYILESTIRME ALANLARI

### 10.1 Kritik Sorunlar

| # | Sorun | Etki | Cozum Onerisi |
|---|-------|------|---------------|
| 1 | **EOD veri sadece** — Intraday 30m verisi CORS proxy ile calismiyor | ORB skoru gercekci degil, 30dk zorunlu kurali islevsiz | WebSocket veya alpaca integration |
| 2 | **Yahoo Finance CORS** — Tarayici tarafinda engelleniyor | Veri cekelemiyor, fallback calismak zorunda | Backend proxy veya CORS çözümü |
| 3 | **v4Engine.ts duplike skorlama** — momentum.ts ile ayni faktorleri hesapliyor | Iki ayri motor bakim maliyeti | Tek motor birlestir |
| 4 | **DTE kontrolu eksik test** — optionsStrategies'te vade kontrolu eklendi ama App.tsx'ten DTE gecilmiyor | Vade kontrolu calismiyor olabilir | App.tsx'ten daysToExpiration gec |
| 5 | **Kelly Sizing sabit** — trainedModel'de gercek edge verisi yok | Pozisyon boyutu rastgele | Backtest sonuclarindan edge hesapla |

### 10.2 Iyilestirme Onerileri

| # | Oneri | Zorluk | Etki |
|---|-------|--------|------|
| 1 | **WebSocket ile real-time veri** | Yuksek | Cok yuksek |
| 2 | **Alpaca Markets integration** ($99/ay) | Orta | Cok yuksek |
| 3 | **v3Engine + v4Engine birlestir** | Dusuk | Orta |
| 4 | **Backtest engine calistir** | Orta | Yuksek |
| 5 | **Options Greeks hesaplama** (Delta, Theta, Gamma) | Orta | Yuksek |
| 6 | **Portfolio tracking** (gercek P/L izleme) | Dusuk | Orta |
| 7 | **Multi-timeframe analiz** (1H, 4H, 1G) | Orta | Yuksek |
| 8 | **Machine Learning skorlama** | Yuksek | Cok yuksek |

---

## EK: API ANAHTARLARI (Test Edilmis)

```
TwelveData:  d2bff39c345a49f1aa9ab15c70fcd6a9
Massive:     3AjVXfyR6gxZgB9g3SpN7e6e7JLiIxTq
Alphavantage: d7mjhe1r01qngrvoel6gd7mjhe1r01qngrvoel70
```

**Calismayan API'ler:** Finnhub (401), Stooq (key gerekli), Nasdaq Data Link (403), Finazon (401)

---

*Dokuman: v4.1 | Tarih: 29 Mayis 2026 | Satir Sayisi: ~8000+ TypeScript*
