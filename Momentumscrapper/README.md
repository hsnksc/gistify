# NASDAQ Momentum Scanner v4

## Gunun Ilk Yarim Saatinde En Guclu Momentumu Gosteren Hisse Senetlerini Tespit Eden Akilli Sistem

---

## 1. Proje Ozeti

**NASDAQ Momentum Scanner**, günün ilk yarım saatinde (09:30-10:00 EST) NASDAQ-100 hisselerini tarayan, 11 faktörlü momentum analizi ile en güçlü yükseliş potansiyeli olan hisseleri tespit eden tam istemci tarafli (client-side) bir web uygulamasidir.

### Temel Ozellikler
- **11 Faktörlü Momentum Skorlama** (Toplam = %100)
- **Confidence Score** (Veri kalitesine dayalı güven skoru)
- **Ranking Score** (Momentum + Confidence + Risk/Return + Pattern)
- **Score Explanation Engine** (Her faktörün nedenini doğal dilde açıklama)
- **Sanity Gate** (NaN/Infinity/null engelleme)
- **Paralel Tarama** (5'li chunk + exponential backoff + jitter)
- **CORS Proxy Fallback Zinciri** (AllOrigins → corsproxy.io)
- **Opsiyon Stratejisi Motoru** (Long Call, Bull Call Spread, Bull Put Spread)
- **Piyasa Rejimi Tespiti** (LOW/NORMAL/HIGH volatilite)
- **Wilson Score Interval** ile istatistiksel güven aralığı
- **AI Pattern Matching** (Sektor + Rejim + Gün + Wilson CI)

---

## 2. Mimari

```
┌─────────────────────────────────────────────────────────────┐
│                    React 19 + TypeScript                     │
│                   Tailwind CSS + shadcn/ui                   │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Scanner    │  │   Momentum   │  │    Options       │  │
│  │   Controls   │→ │    Engine    │→ │   Strategies     │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│         ↓                  ↓                  ↓              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Parallel   │  │  Confidence  │  │  Advanced        │  │
│  │   Scanner    │  │  + Ranking   │  │  Pattern Engine  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│         ↓                  ↓                  ↓              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Yahoo Finance│  │   Sanity     │  │   Stock Detail   │  │
│  │    Client    │  │    Gate      │  │     Modal        │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │  CORS Proxy  │
                    │   Fallback   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │allorigins│ │corsproxy │ │ (retry)  │
       │   .win   │ │   .io    │ │          │
       └──────────┘ └──────────┘ └──────────┘
                           │
                    ┌──────┴──────┐
                    │ query1.fina │
                    │ nce.yahoo.c │
                    │     om      │
                    └─────────────┘
```

### Tam Istemci Tarafli (Client-Side)
- **Backend yok.** Tüm hesaplama tarayicida yapilir.
- Yahoo Finance API'den CORS proxy ile veri cekilir.
- Hicbir veri sunucuya gitmez, tum analiz yerel olarak calisir.

---

## 3. 11 Faktörlü Momentum Skorlamasi

### Faktör Agirliklari (Toplam = 1.00)

| # | Faktor | Agirlik | Aciklama |
|---|--------|---------|----------|
| 1 | **RVOL** | 0.15 | Göreceli Hacim - Linear interpolasyon (cliff effect yok) |
| 2 | **ORB** | 0.13 | Opening Range Breakout - 30dk sonrasi gecerli |
| 3 | **VWAP** | 0.13 | VWAP pozisyonu + normalize egim (slope/VWAP) |
| 4 | **GAP** | 0.10 | Acilis boslugu kalitesi (%1-4 ideal) |
| 5 | **RSI Short** | 0.10 | RSI(7) agirlikli + RSI(9), mutuclusively exclusive araliklar |
| 6 | **Structure** | 0.08 | Higher Highs / Higher Lols (trend yapisi) |
| 7 | **Retention** | 0.08 | Intraday Retention - GAP'tan bagimsiz tutma gucu |
| 8 | **Velocity Dir** | 0.07 | Yonlu hareket hizi (ATR bazli) |
| 9 | **Price Change** | 0.06 | Günlük fiyat degisimi |
| 10 | **Velocity Vol** | 0.03 | Volatilite büyüklügü (range/ATR) |
| 11 | **MarketCap** | 0.04 | Piyasa degeri (likidite proxy) |

### Faktor Skorlama Detayi

#### RVOL (Relative Volume)
```
rvol < 1.0  → linear: 0-15
rvol 1.0-2.0 → linear: 15-50
rvol 2.0-4.0 → linear: 50-100
rvol > 4.0   → 100
```

#### GAP Kalitesi
```
%1-4 GAP    → 80-100 (Ideal)
%0.5-1 GAP  → 60-80  (Kabul edilebilir)
%4-8 GAP    → 50-70  (Genis, dikkat)
%>8 GAP     → 40     (Asiri genis, gap fill riski)
```

#### ORB (Opening Range Breakout)
- **Gecersiz** piyasa acilisindan 30 dk once
- Kırılım testi: Fiyat > 30dk high = 1.0, Fiyat > acilis = 0.5
- Normalize ORB Range = (30m High - 30m Low) / ATR

#### VWAP
- Normalize egim = egim / VWAP (oransal, dolar cinsinden degil)
- VWAP üstünde + yükselen egim = en güçlü sinyal
- Sadece gun içi (intraday) 30dk barlariyla hesaplanir

#### RSI Short (Kisa Vade)
- RSI(7) × 0.7 + RSI(9) × 0.3 blended
- **Araliklar birbirini kesmez (mutually exclusive):**
  - 60-75 → 85 puan (Optimal)
  - 55-60 → 70 puan (Güçlü)
  - 45-55 → 55 puan (Nötr)
  - 35-45 → 40 puan (Zayif)
  - 75-80 → 60 puan (Asiri alim yakin)
  - >80 → 30 puan (Asiri alim)

#### Velocity (Yon + Volatilite Ayrimi)
- **Yon skoru**: (Mevcut - Acilis) / ATR → ATR bazli yonlu hareket
- **Volatilite skoru**: (Mevcut - Low) / ATR → Günlük range
- Ikisi ayri ayrı hesaplanip agirliklandirilir

---

## 4. Confidence Score (Güven Skoru)

Confidence Score, veri **kalitesine** dayalı ayrı bir güven ölçüsüdür. Momentum skorundan bagimsizdir.

### Alt Bilesenler

| Bilesen | Agirlik | Aciklama |
|---------|---------|----------|
| Data Completeness | 0.30 | Tüm kritik veri alanlari mevcut mu? |
| Price Recency | 0.25 | Fiyat verisi ne kadar taze? |
| Volume Quality | 0.25 | Hacim verisi güvenilir mi? |
| Indicator Reliability | 0.20 | Teknik göstergeler güvenilir mi? |

### Etiketler
- **HIGH** (≥80): Veri kalitesi mükemmel
- **MEDIUM** (≥50): Veri kullanilabilir ama dikkatli olun
- **LOW** (<50): Veri güvenilmez, sinyal kalitesi düsük

---

## 5. Ranking Score (Siralaama Skoru)

Final siralama formülü — tüm hisseler bu skora göre siralanir:

```
Ranking Score = (Momentum Score × 0.55)
              + (Confidence Score × 0.25)
              + (Risk/Return Score × 0.10)
              + (Pattern Bonus × 0.10)
```

| Katki | Agirlik | Aciklama |
|-------|---------|----------|
| Momentum | 0.55 | Ana momentum skoru (en baskin) |
| Confidence | 0.25 | Veri kalitesi güveni |
| Risk/Return | 0.10 | Hedef fiyata göre risk/ödül orani |
| Pattern | 0.10 | AI pattern eslestirme bonusu |

### Risk/Return Skoru
```
R/R ≥ 3.0 → 100 puan
R/R ≥ 2.0 → 85 puan
R/R ≥ 1.5 → 70 puan
R/R ≥ 1.0 → 55 puan
R/R ≥ 0.5 → 35 puan
R/R < 0.5 → 20 puan
```

---

## 6. Score Explanation Engine (Skor Açiklama Motoru)

Her faktörün neden o skoru aldığını açıklayan doğal dil metinleri üretir. Detay modalında açılır/kapanır panel olarak gösterilir.

### Örnek Çiktilar

| Faktör | Skor | Açiklama |
|--------|------|----------|
| RVOL | 85 | "Hacim patlamasi — çok güçlü ilgi. RVOL 3.2x: Normalin 3 kati üzerinde hacim, institüsel ilgi isareti." |
| GAP | 80 | "Ideal GAP araligi. GAP %2.1: Momentumcu acilis, fazla geri çekilme riski düsük." |
| RSI Short | 85 | "Optimum RSI araligi. RSI 62.5: Momentum güçlü ama asiri alim degil." |
| ORB | 95 | "Güçlü ORB kirilimi. Fiyat opening range'in üzerine çikti, yükselis momentumu güçlü." |
| VWAP | 90 | "Güçlü VWAP üstü + yükselen. VWAP üstünde %1.8 ve egim pozitif, boga kontrolü." |

---

## 7. Sanity Gate (Veri Güvenligi)

Tüm faktör skorlari üretim öncesinde validasyondan geçer:

```
1. Güvensiz deger kontrolü: NaN/Infinity/null → 50 (fallback)
2. Aralik kontrolü: <0 veya >100 → [0,100] clamp
3. Agirlik toplami kontrolü: ≠1.0 → otomatik normalizasyon
4. Issue loglama: Her sorun console.warn ile raporlanir
```

### Güvenlik Katmanlari
1. **Yahoo Response Validation**: Runtime'da API yaniti dogrulanir
2. **Candle Data Validation**: Array uzunluklari, null orani kontrol edilir
3. **Factor Validation**: Her skor 0-100 araliginda midir?
4. **Weight Validation**: Agirliklar toplami 1.00 mi?
5. **Final Clamp**: Tüm skorlar [0, 100] araligina zorlanir

---

## 8. Veri Akisi

### Adim 1: Paralel Tarama
```
NASDAQ-100 (96 hisse)
    ↓
5'li chunk'lar halinde
    ↓
Promise.allSettled() (paralel)
    ↓
Her hisse için:
    ├── Gunluk veri (60d, 1d interval) — Yahoo Finance
    └── Intraday veri (5d, 30m interval) — Yahoo Finance
```

### Adim 2: Momentum Analizi
```
Yahoo Finance verisi
    ↓
11 faktör hesaplanir
    ↓
Sanity Gate validasyonu
    ↓
Momentum Score (0-100)
```

### Adim 3: v4 Hesaplamalari
```
Momentum Score
    ↓
Confidence Score hesaplanir
    ↓
Ranking Score hesaplanir
    ↓
Score Explanations üretilir
    ↓
Opsiyon stratejisi önerilir
```

### Adim 4: Siralama ve Gösterim
```
Tüm hisseler Ranking Score'a göre siralanir
    ↓
Filtreler uygulanir (sektor, skor, hacim, RSI)
    ↓
Sonuçlar tabloda gösterilir
    ↓
Detay modalinda tüm skorlar ve açiklamalar sunulur
```

---

## 9. CORS Proxy Fallback Zinciri

```
Istek 1 → api.allorigins.win
    ↓ (hata/timeout)
Istek 2 → corsproxy.io
    ↓ (hata/timeout)
Yeniden dene (exponential backoff: 500ms → 1000ms → 2000ms)
```

### Güvenlik Önlemleri
- **AbortController**: 15 saniye timeout
- **Jitter**: Her chunk arasi 0-200ms rastgele gecikme
- **Cache-Control**: `no-store` (her zaman taze veri)

---

## 10. Dosya Yapisi

```
src/
├── types/
│   └── scanner.ts              # TypeScript arayüzleri
├── lib/
│   ├── scoreConfig.ts          # Merkezi skor yapilandirmasi (agirliklar, threshold'lar)
│   ├── sanityGate.ts           # NaN/Infinity/null korumasi + validasyon
│   ├── yahooFinance.ts         # Yahoo Finance client + CORS proxy
│   ├── momentum.ts             # 11 faktörlü momentum motoru v4
│   ├── parallelScanner.ts      # Paralel tarama motoru
│   ├── filters.ts              # Istemci tarafli filtreleme
│   ├── optionsStrategies.ts    # Opsiyon stratejisi seçici
│   ├── advancedOptions.ts      # ATM/OTM + vade + pozisyon boyutu
│   ├── advancedPattern.ts      # AI pattern matching + Wilson CI
│   └── watchlist.ts            # Yerel izleme listesi (localStorage)
├── sections/
│   ├── ScannerHeader.tsx       # Baslik banner
│   ├── ScannerControls.tsx     # Tarama butonlari
│   ├── ResultsTable.tsx        # Sonuçlar tablosu (ranking kolonlu)
│   ├── StockDetailModal.tsx    # Detay modal (3 skor + açiklamalar)
│   ├── FilterPanel.tsx         # Filtre paneli
│   ├── OptionsPanel.tsx        # Opsiyon stratejisi paneli
│   ├── AlertSystem.tsx         # Uyari sistemi
│   ├── StatsCards.tsx          # Istatistik kartlari
│   └── RadarTooltip.tsx        # Radar grafik tooltip
└── pages/
    └── Home.tsx                # Ana sayfa (tüm bilesenlerin birlesimi)
```

---

## 11. Sinyal Seviyeleri

| Momentum Skor | Sinyal | Renk |
|---------------|--------|------|
| ≥75 | **STRONG_BUY** | Zümrüt yeşili |
| ≥60 | **BUY** | Yesil |
| ≥45 | **NEUTRAL_BULLISH** | Camgöbegi |
| ≥30 | **NEUTRAL** | Gri |
| ≥20 | **NEUTRAL_BEARISH** | Koyu gri |
| <20 | **WEAK** | Kirmizi |

---

## 12. Piyasa Rejimi Tespiti

SPY'nin gunlük ATR'sine göre piyasa volatilitesi belirlenir:

| Rejim | ATR Durumu | Renk |
|-------|-----------|------|
| LOW_VOL | Düsük volatilite | Yesil |
| NORMAL | Normal volatilite | Mavi |
| HIGH_VOL | Yüksek volatilite | Kirmizi |

Rejim, opsiyon stratejisi seçimini ve risk yönetimini etkiler.

---

## 13. Opsiyon Stratejisi Motoru

### Strateji Seçimi (Piyasa Rejimine Göre)

| Rejim | Öncelikli Strateji | Açiklama |
|-------|-------------------|----------|
| LOW_VOL | Long Call | Düsük IV = ucuz opsiyonlar |
| NORMAL | Bull Call Spread | Sinirli risk/ödül |
| HIGH_VOL | Bull Put Spread | Yüksek IV = prim toplama |

### ATM/OTM Seçimi
- Hedef fiyata göre delta önerisi
- Fiyat-hedef mesafesi > 2 ATR → OTM
- Fiyat-hedef mesafesi < 1 ATR → ATM
- Vade önerisi: 30-45 gün (gamma/theta dengesi)

---

## 14. Tarama Zaman Uyarilari

| Piyasa Acilis Süresi | Uyari |
|---------------------|-------|
| 09:30 öncesi | "Piyasa henüz açilmadi. En erken 10:00 EST'de tarayin." |
| 0-30 dk | "30dk dolmadan ORB kirilim testi anlamsiz. 10:00 EST'yi bekleyin." |
| 30-60 dk | "Ideal tarama: 10:00-10:30 EST arasi." |
| 60 dk+ | Uyari yok — normal tarama |

---

## 15. Gelistirme Tarihçesi

| Versiyon | Tarih | Degisiklikler |
|----------|-------|--------------|
| v1 | Baslangiç | Temel momentum skorlama (6 faktör) |
| v2 | +Elestiri 1-15 | 9 faktör, Wilson CI, sektör map, earnings uyari |
| v3 | +Elestiri 16-27 | RVOL linear, RSI aralik ayrimi, VWAP normalize, Velocity ayrimi |
| **v4** | **Faz 1** | **Confidence Score, Ranking Score, Explanation Engine, Sanity Gate, AbortController** |

---

## 16. Kullanim

1. Uygulamayi açin
2. **"Taramayi Baslat"** butonuna tiklayin (~30-60 saniye)
3. Sonuçlar **Ranking Score**'a göre sirali gelir
4. Herhangi bir hisseye tiklayarak **detay modalini** açin
5. **3'lü Skor Dashboardu** nu inceleyin (Momentum / Confidence / Ranking)
6. **Confidence Breakdown** ile veri kalitesini degerlendirin
7. **Skor Açiklamalari** ile her faktörün nedenini ögrenin
8. **Opsiyon Stratejisi** butonu ile strateji önerisi alin
9. Filtreleri kullanarak sonuçlari daraltin
10. Favorilerinizi yildiz ile isaretleyin

---

## 17. Teknik Stack

| Katman | Teknoloji |
|--------|-----------|
| Framework | React 19 + TypeScript |
| Stil | Tailwind CSS 3.4 |
| Bilesenler | shadcn/ui |
| Derleyici | Vite 7 |
| Veri Kaynagi | Yahoo Finance API (ücretsiz) |
| CORS Proxy | AllOrigins + corsproxy.io |
| State | React useState/useCallback |
| Depolama | localStorage (izleme listesi + filtreler) |

---

## 18. Kistlamalar ve Bilinen Sorunlar

1. **Yahoo Finance Rate Limiting**: Asiri tarama IP bazli kisitlamaya neden olabilir
2. **CORS Proxy Güvenilirligi**: Ücretsiz proxy'ler zaman zaman çalisMAYABILIR
3. **Intraday Veri**: Piyasa kapali ise son islem günü verileri kullanilir
4. **EST Saat Hesaplamasi**: Yaz saati uygulamasi otomatik degil, sabit UTC-5
5. **Veri Gecikmesi**: Proxy + Yahoo zinciri ~1-3 saniyelik gecikme olusturur
6. **Opsiyon Stratejileri**: IV proxy tahmini yaklasiktir, gerçek IV için broker API'si gerekir

---

*NASDAQ Momentum Scanner v4 — Gelistirilmis Skorlama + Güven Sistemi*
