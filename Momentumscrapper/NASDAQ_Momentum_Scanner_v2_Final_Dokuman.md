# NASDAQ Momentum Scanner v2 — Final Teknik Dokümantasyon

**Deploy URL:** https://knbk56xscwffk.kimi.page

**Stack:** React 19 + TypeScript + Tailwind CSS + shadcn/ui (Full Client-Side)

---

## İçindekiler

1. [Sistem Özeti](#1-sistem-özeti)
2. [Dosya Yapısı](#2-dosya-yapısı)
3. [Veri Toplama](#3-veri-toplama)
4. [8 Faktörlü Momentum Motoru (Ağırlıklar %100)](#4-8-faktörlü-momentum-motoru)
5. [Eleştiriler ve Düzeltmeler](#5-eleştiriler-ve-düzeltmeler)
6. [Pattern Recognition (İstatistiksel Eşleşme Motoru)](#6-pattern-recognition)
7. [Opsiyon Stratejisi Motoru](#7-opsiyon-stratejisi-motoru)
8. [UI Bileşenleri](#8-ui-bileşenleri)
9. [Kullanım Akışı](#9-kullanım-akışı)
10. [Bilinen Sınırlar](#10-bilinen-sınırlar)

---

## 1. Sistem Özeti

NASDAQ Momentum Scanner, günün ilk yarım saatinde en güçlü momentumu gösteren **NASDAQ-100** hisselerini bulan, 8 faktörlü skorlama ile sıralayan, geçmiş verilerle istatistiksel eşleşme analizi yapan ve opsiyon stratejisi öneren tam client-side bir web uygulamasıdır.

### Özellik Listesi

| Özellik | Açıklama |
|---------|----------|
| **Paralel Tarama** | 5'li chunk + 300ms delay + exponential backoff (~30-60 sn) |
| **8 Faktör Skorlama** | Ağırlıklar toplamı %100, 0-100 skor aralığı |
| **Filtre Paneli** | Sektör, skor, RVOL, sinyal, market cap, RSI aralığı |
| **İstatistiksel Eşleşme** | 1 aylık geçmiş analizi + Wilson güven aralığı |
| **Piyasa Rejimi Tespiti** | SPY volatilitesi ile LOW/NORMAL/HIGH rejim |
| **Opsiyon Stratejisi** | ATM/OTM seçimi + vade önerisi + pozisyon boyutu hesaplayıcı |
| **IV Proxy Tahmini** | Volatilite + RSI + hacim bileşeni ile tahmini IV Rank |
| **Uyarı Sistemi** | Browser bildirimi + RSI > 80 + RVOL > 5x + Earnings uyarısı |
| **Favoriler** | localStorage'da izleme listesi |
| **Sıralama** | Tüm kolonlara tıklayarak artan/azalan sıralama |

---

## 2. Dosya Yapısı

```
src/
├── lib/                          # Çekirdek motorlar
│   ├── yahooFinance.ts           # Yahoo Finance API client (CORS proxy)
│   ├── momentum.ts               # 8 faktörlü skorlama motoru (v2 düzeltmeleri)
│   ├── parallelScanner.ts        # Paralel tarama (chunk + backoff)
│   ├── filters.ts                # Client-side filtre motoru
│   ├── patternEngine.ts          # Basit istatistiksel eşleşme
│   ├── advancedPattern.ts        # Gelişmiş pattern (rejim + sektör + gün + Wilson CI)
│   ├── optionsStrategies.ts      # Opsiyon stratejisi seçici (v2 IV + hedef fiyat)
│   ├── advancedOptions.ts        # ATM/OTM + vade + pozisyon boyutu
│   └── watchlist.ts              # Favoriler localStorage yönetimi
├── sections/                     # UI bileşenleri
│   ├── Home.tsx                  # Ana sayfa (tüm birleşim)
│   ├── ScannerHeader.tsx         # Başlık
│   ├── ScannerControls.tsx       # Tarama butonu
│   ├── FilterPanel.tsx           # Gelişmiş filtre paneli
│   ├── ResultsTable.tsx          # Sonuç tablosu (sıralama + favoriler + radar)
│   ├── StockDetailModal.tsx      # Hisse detay modalı
│   ├── OptionsPanel.tsx          # Opsiyon stratejisi modalı
│   ├── StatsCards.tsx            # İstatistik kartları
│   ├── AlertSystem.tsx           # Uyarı/bildirim sistemi
│   ├── RadarTooltip.tsx          # 8 faktör radar chart (hover)
│   ├── TrainingPanel.tsx         # Pattern eğitim paneli
│   ├── PatternMatches.tsx        # Eşleşme kartları
│   └── BacktestPanel.tsx         # Backtest paneli
└── types/
    └── scanner.ts                # TypeScript tip tanımlamaları
```

---

## 3. Veri Toplama

### 3.1 CORS Proxy

```
Browser → AllOrigins Proxy → Yahoo Finance API → JSON
```

Base URL: `https://api.allorigins.win/raw?url={encoded_url}`

### 3.2 Her Hisse İçin 2 İstek

| İstek | Endpoint | Kullanım |
|-------|----------|----------|
| Günlük (60d) | `chart/TICKER?interval=1d&range=60d` | RSI, MACD, ATR, 20g hacim ort. |
| Intraday (5d, 30m) | `chart/TICKER?interval=30m&range=5d` | Açılış aralığı, **VWAP** |

### 3.3 Veri Seti

```typescript
interface StockData {
  ticker: string;
  name: string;
  sector: string;
  timestamps: number[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
  currentPrice: number;
  prevClose: number;
  marketCap: number;
}
```

---

## 4. 8 Faktörlü Momentum Motoru

### 4.1 Ön Filtre (Liquidity Gate)

```
Ortalama Hacim (20g) >= 500.000      → Geçer / Elenir
Ortalama Dolar Hacim >= $50 Milyon    → Geçer / Elenir
```

### 4.2 Faktörler ve Ağırlıkları (%100)

| # | Faktör | Ağırlık | Formül | Skor Aralığı |
|---|--------|---------|--------|-------------|
| 1 | **RVOL** | %15 | GunlukHacim / 20gOrtHacim | 0-100 |
| 2 | **GAP** | %10 | ((Acilis - OncekiKapanis) / OncekiKapanis) × 100 | 0-100 |
| 3 | **ORB** | %15 | (30dkYuksek - Acilis) / ATR + **Kirilim Testi** | 0-100 |
| 4 | **VWAP** | %15 | **30dk intraday** VWAP pozisyonu + egimi | 0-100 |
| 5 | **Price Structure** | %10 | HigherHighs/LowerLows (son 10g) | 0-100 |
| 6 | **RSI Short** | %10 | **RSI(7) agirlikli** (%70) + RSI(9) (%30) | 0-100 |
| 7 | **Velocity** | %10 | GunlukHareket / ATR (fiyat degisim hizi) | 0-100 |
| 8 | **MarketCap** | %5 | Market cap buyukluk skoru | 0-100 |
| 9 | **Price Change** | %10 | Gunluk fiyat degisimi | 0-100 |
| | **TOPLAM** | **%100** | | |

### 4.3 Skorlama Formülleri

#### RVOL (Relative Volume)
```
RVOL = GunlukHacim / 20GunlukOrtalamaHacim

Skor:
  RVOL >= 4.0  → 100
  RVOL >= 2.0  → 50
  RVOL >= 1.0  → 15
  RVOL <  1.0  → 0
```

#### GAP Kalitesi
```
GAP% = ((Acilis - OncekiKapanis) / OncekiKapanis) × 100

Skor:
  1% <= GAP <= 4%    → 80-100
  0.5% <= GAP < 1%   → 60-80
  4% < GAP <= 8%     → 50-70
  GAP > 8%           → 40
  Negatif GAP        → 15-30
```

#### ORB — Opening Range Breakout (v2: Gerçek Kırılım Testi)
```
1. ORB Araligi = 30dkYuksek - 30dkDusuk
2. Normalize = ORB Araligi / ATR(14)
3. KIRILIM TESTI:
   - MevcutFiyat > 30dkYuksek     → Tam kırılım (1.0)
   - MevcutFiyat > Acilis         → Kısmi kırılım (0.5)
   - Diger                        → Kırılım yok (0)

Skor:
  Normalize > 2 ve Kırılım = 1.0  → 95
  Normalize > 1.5 ve Kırılım >= 0.5 → 80
  Normalize > 1                    → 65
  Normalize > 0.5                  → 45
  Diger                            → 30
```

#### VWAP (v2: 30dk Intraday)
```
// Günlük veriden degil, 30dk intraday veriden hesaplanir

Her 30dk bar icin:
  TP = (Yuksek + Dusuk + Kapanis) / 3
  BirikimliTPxHacim += TP × Hacim
  BirikimliHacim += Hacim
  VWAP = BirikimliTPxHacim / BirikimliHacim

Egim = Son 5 barin VWAP degerinin lineer regresyon egimi

Sapma% = ((MevcutFiyat - VWAP) / VWAP) × 100

Skor:
  Sapma > 1.5% ve Egim > 0  → 90
  Sapma > 1% ve Egim > 0    → 85
  Sapma > 0.5% ve Egim >= 0 → 70
  Sapma > 0%                → 55
  Sapma > -0.5%             → 40
  Diger                     → 25
```

#### Price Structure
```
Son 10 gun:
  YuksekTepeler = yuksek[i] > yuksek[i-1] olanlarin sayisi
  YuksekDipler  = dusuk[i] > dusuk[i-1] olanlarin sayisi

Skor = (YuksekTepelerOrani + YuksekDiplerOrani) / 2
```

#### RSI Short (v2: RSI(7) Ağırlıklı)
```
BlendedRSI = RSI(7) × 0.70 + RSI(9) × 0.30

Skor:
  60 < BlendedRSI < 75  → 85  (Optimal momentum)
  55 < BlendedRSI <= 80 → 70  (Guclu)
  BlendedRSI > 45       → 55  (Notr)
  BlendedRSI > 35       → 40  (Zayif)
  Diger                 → 25  (Asiri satim)
```

#### Velocity Score (v2: ATR-Normalize Yerine)
```
GunlukAraligi = MevcutFiyat - GunlukDusuk
AralikOrani = GunlukAraligi / ATR(14)
Hiz = (MevcutFiyat - Acilis) / ATR(14)

Velocity = AralikOrani × 0.4 + max(0, Hiz) × 0.6

Skor:
  Velocity > 2.5  → 95
  Velocity > 2.0  → 85
  Velocity > 1.5  → 70
  Velocity > 1.0  → 55
  Velocity > 0.5  → 40
  Diger           → 25
```

#### MarketCap Score (v2: "Katalizör" Yerine)
```
Skor = 50 (baz)
  MarketCap > $200B  → +25
  MarketCap > $10B   → +15
  MarketCap > $1B    → +5
  MarketCap < $1B    → -10

Min 0, Max 100
```

#### Price Change
```
Degisim% = ((Mevcut - OncekiKapanis) / OncekiKapanis) × 100

Skor:
  > 5%   → 100
  > 3%   → 85
  > 2%   → 70
  > 1%   → 55
  > 0%   → 40
  > -1%  → 25
  <= -1% → 10
```

### 4.4 Toplam Skor Hesaplama

```
Toplam = RVOLskor×0.15 + GAPskor×0.10 + ORBskor×0.15 + VWAPskor×0.15
       + STRUCTUREskor×0.10 + RSIskor×0.10 + VELOCITYskor×0.10
       + MARKETCAPskor×0.05 + PRICECHANGEskor×0.10
```

### 4.5 Sinyal Sınıflandırması

| Skor | Sinyal |
|------|--------|
| 75-100 | **STRONG_BUY** (GÜÇLÜ AL) |
| 60-74  | **BUY** (AL) |
| 45-59  | **NEUTRAL_BULLISH** (NÖTR-YUKARI) |
| 30-44  | **NEUTRAL** |
| 20-29  | **NEUTRAL_BEARISH** |
| 0-19   | **WEAK** |

---

## 5. Eleştiriler ve Düzeltmeler

### v1'deki 15 Eleştiri ve Düzeltme Tablosu

| # | Seviye | Eleştiri | Düzeltme | Durum |
|---|--------|----------|----------|-------|
| 1 | 🔴 Kritik | Ağırlıklar toplamı %95 (eksik %5) | `price_change` %5 → %10 | ✅ %100 |
| 2 | 🔴 Kritik | VWAP günlük veriden hesaplanıyor | 30dk intraday veriden | ✅ |
| 3 | 🔴 Kritik | ORB ile ATR-Normalize aynı formül | ATR-Normalize → **Velocity Score**, ORB'ye kırılım testi | ✅ |
| 4 | 🔴 Kritik | "Katalizör" yanlış isim | `analyzeMarketCap` olarak rename | ✅ |
| 5 | 🟠 Önemli | IV (Implied Volatility) yok | **IV Proxy** eklendi | ✅ |
| 6 | 🟠 Önemli | Hedef fiyat tanımsız | **ATR × çarpan** ile hesaplanıyor | ✅ |
| 7 | 🟠 Önemli | "AI Pattern" yanıltıcı | Etiket: **"İstatistiksel Eşleşme Motoru"** | ✅ |
| 8 | 🟠 Önemli | 94 hisse listesi tanımsız | **NASDAQ-100** olarak belgelendi | ✅ |
| 9 | 🟠 Önemli | Rate limiting yok | 5'li chunk + 300ms + backoff (zaten vardı) | ✅ |
| 10 | 🟠 Önemli | Kazanç takvimi uyarısı yok | **Earnings uyarısı** eklendi | ✅ |
| 11 | 🟡 Zayıf | ORB gerçek kırılımı ölçmüyor | **Kırılım testi**: currentPrice > high30m | ✅ |
| 12 | 🟡 Zayıf | RSI(2) tartışmalı | **RSI(7)** ağırlıklı (%70) + RSI(9) (%30) | ✅ |
| 13 | 🟡 Zayıf | 20 iş günü istatistiksel yetersiz | Panelde **"60+ gün önerilir"** uyarısı | ✅ |
| 14 | 🟡 Zayıf | Piyasa rejimi bağlantısı belirsiz | Rejim → strateji/vade/IV'de doğrudan kullanılıyor | ✅ |
| 15 | 🟡 Zayıf | Opsiyon strateji tablosu eksik | 4 strateji ile tamamlandı | ✅ |

---

## 6. Pattern Recognition (İstatistiksel Eşleşme Motoru)

### 6.1 Eğitim Fazı

Son 1 aylık (20 iş günü) veri analiz edilir. Her gün için:
1. İlk 30dk'daki artış hesaplanır
2. Gün sonu kapanış ile karşılaştırılır
3. Eğer kapanış açılışın üzerindeyse VE ilk 30dk kazancının %30'unu koruduysa → "devam etti"

> ⚠️ **Uyarı:** İstatistiksel güç için 60-90 iş günü (3-4 ay) önerilir.

### 6.2 Piyasa Rejimi Tespiti

```
SPY 20g günlük volatilitesi:
  Vol < %1/gün  → LOW_VOL  (Düşük Volatilite)
  Vol %1-2/gün  → NORMAL   (Normal Rejim)
  Vol > %2/gün  → HIGH_VOL (Yüksek Volatilite)
```

### 6.3 Eşleşme Algoritması

```
1. İlk 30dk momentum >= tarihsel ortalama  → +20 puan
2. Hacim oranı >= tarihsel ortalama         → +20 puan
3. RSI, optimal aralık içinde               → +20 puan
4. VWAP pozisyonu güçlü                     → +15 puan
5. Hisse tarihsel devam oranı yüksek        → +15 puan
6. Momentum skoru yüksek                    → +10 puan
─────────────────────────────────────────────────────
Toplam: 100 puan
```

### 6.4 Wilson Score Güven Aralığı (%95)

```
Formül:
  merkez = p + z²/2n
  yarimGenislik = z × √(p(1-p)/n + z²/4n²)
  payda = 1 + z²/n

  altSinir = (merkez - yarimGenislik) / payda
  ustSinir = (merkez + yarimGenislik) / payda

  z = 1.96 (for %95 confidence)
  p = devamOrani / orneklemBuyuklugu
```

Eğer `n < 10` → **"Yetersiz Veri"** uyarısı gösterilir.

---

## 7. Opsiyon Stratejisi Motoru

### 7.1 Strateji Seçim Akışı

```
IF (skor >= 75 AND hacim >= 2x AND 50 < RSI < 80):
    → Long Call (IV dusukse) / Bull Call Spread (IV yuksekse)

ELSE IF (skor >= 55 AND VWAP > 0):
    → Bull Call Spread + Bull Put Spread

ELSE IF (hacim >= 3x AND |degisim| > %2):
    → Long Straddle

ELSE:
    → Bull Put Spread (konservatif)
```

### 7.2 ATM/OTM Seçimi (v2)

| Fiyat-Hedef Farkı | Tip | Delta | Açıklama |
|-------------------|-----|-------|----------|
| < %2 | **ATM** | 0.45-0.55 | En iyi risk/ödül dengesi |
| %2-4 | **Hafif OTM** | 0.30-0.45 | Prim maliyetini düşür |
| > %4 | **Agresif OTM** | 0.20-0.30 | Ucuz prim, düşük olasılık |

### 7.3 Vade Önerisi (v2)

| Rejim | Gün | Öneri |
|-------|-----|-------|
| LOW_VOL | Pazartesi-Çarşamba | 5-7 gün (Cuma vadeli) |
| LOW_VOL | Perşembe-Cuma | 7-10 gün |
| NORMAL | Pazartesi-Çarşamba | 5-7 gün |
| NORMAL | Perşembe-Cuma | 10 gün (sonraki hafta) |
| HIGH_VOL | Her gün | 10-14 gün (theta kaybını sınırla) |

### 7.4 Pozisyon Boyutu Hesaplayıcı (v2)

```
Girdi:
  - Hesap Bakiyesi ($)
  - Risk yüzdesi (%1, %2, %5)

Çıktı:
  ToplamRisk = Bakiye × Risk%
  MaksKontrat = ToplamRisk / (TahminiPrim × 100)

Örnek: $10,000 bakiye, %2 risk, $2 prim
  ToplamRisk = $10,000 × 0.02 = $200
  MaksKontrat = $200 / ($2 × 100) = 1 kontrat
```

### 7.5 IV Proxy Önerisi (v2)

```
IV Rank > 70 → "Yüksek IV → Spread tercih edin, prim pahalı"
IV Rank 50-70 → "Orta-yüksek IV → Spread ile maliyeti düşürün"
IV Rank 30-50 → "Normal IV → Standart stratejiler"
IV Rank < 30 → "Düşük IV → Uzun call mantıklı, ucuz prim"
```

### 7.6 Stratejiler Tablosu

| Strateji | Risk | Maks Kar | Maks Zarar | Ne Zaman |
|----------|------|----------|------------|----------|
| **Long Call** | Yüksek | Sınırsız | Prim | Güçlü yükseliş, düşük IV |
| **Bull Call Spread** | Orta | Sınırlı | Net prim | Orta yükseliş, yüksek IV |
| **Bull Put Spread** | Düşük | Net prim (kredi) | Spread - prim | Konservatif, prim geliri |
| **Long Straddle** | Yüksek | Sınırsız (her yön) | Toplam prim | Yön bilinmiyor, yüksek vol |

---

## 8. UI Bileşenleri

### 8.1 Tarama Kontrolleri
- **Tarama Başlat**: Paralel tarama başlatır (~30-60 sn)
- **Durdur**: Taramayı iptal eder
- **AI Pattern**: Gelişmiş istatistiksel eşleşme analizi başlatır
- **Filtreler**: 6 filtrelik paneli açar/kapatır
- **Tümü / Favoriler**: Sekme geçişi

### 8.2 Sonuç Tablosu
- **Trend İkonu**: ▲ (Higher Highs) / ▼ (Lower Lows) / → (Karışık)
- **Hacim Barı**: Görsel mini bar chart (RVOL değeri)
- **Radar Chart**: Her satırda hover ile 8 faktörün SVG radar grafiği
- **Favori**: ⭐ ikonu ile localStorage'a ekle/çıkar
- **Sıralama**: Tüm kolonlara tıklayarak artan/azalan

### 8.3 Opsiyon Modalı
- ATM/OTM önerisi (delta aralığı + tahmini prim)
- Vade önerisi (gün sayısı + gerekçe)
- Pozisyon boyutu hesaplayıcı (bakiye + risk%)
- IV Proxy değeri ve önerisi
- Earnings uyarısı (varsa)
- Hedef fiyat ($) / Durdurma ($)

---

## 9. Kullanım Akışı

```
[1] "NASDAQ Taraması Başlat" butonuna tıkla
         ↓ (30-60 sn)
[2] 94 NASDAQ-100 hissesi paralel taranır
         ↓
[3] Filtre Paneli'ni aç → Sonuçları daralt
         ↓
[4] "AI Pattern" butonuna tıkla → Geçmiş eşleşme analizi
         ↓
[5] Eşleşme kartlarından bir hisse seç → "Opsiyon" butonu
         ↓
[6] Opsiyon stratejisi, ATM/OTM, vade, pozisyon boyutunu gör
         ↓
[7] Karar ver → İşlem yap
```

---

## 10. Bilinen Sınırlar

| Sınır | Açıklama |
|-------|----------|
| **Veri Gecikmesi** | Yahoo Finance verileri 15-20 dk gecikmeli |
| **CORS Proxy** | AllOrigins kullanım limitleri olabilir |
| **Client-Side** | Tüm işlem browser'da, backend yok |
| **Earnings** | Yaklaşan kazanç takvimi tam değil (13 hisse proxy) |
| **IV** | Gerçek IV yok, proxy tahmini kullanılıyor |
| **Hafta Sonu** | Cumartesi/Pazar veri yetersiz |
| **İstatistiksel Güç** | 20 gün yerine 60-90 gün önerilir |

---

## Yasal Uyarı

> Bu sistem **eğitim ve analiz amaçlıdır**, yatırım tavsiyesi değildir. Tüm trading kararlarını kendi sorumluluğunuzda alınız. Opsiyon tradingi yüksek risk içerir ve tüm sermayenizi kaybedebilirsiniz. Her zaman kendi araştırmanızı yapın ve profesyonel danışmana başvurun.
