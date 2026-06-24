# Midas Momentum Pipeline — Değerleme ve Sinyal Motoru Dokümantasyonu

> Son Güncelleme: 2026-06-24  
> Versiyon: v3.1  
> Skill: `midas-pipeline`  

---

## 1. Pipeline Overview

Bu pipeline **teknik analiz ve momentum tabanlı** alım/satım sinyalleri üretir.  
**Değerleme (valuation / fundamental analysis) içermez.**

**Çıktı:** `midas_signals.json` — 50 hisse için momentum skorları ve sinyaller.

---

## 2. Veri Kaynakları

| Kaynak | Ne Çekiliyor | Güvenilirlik |
|--------|-------------|--------------|
| **Midas Atlas Dashboard** (WebBridge) | Symbol, fiyat, daily%, weekly%, monthly% | **Fiyat için tek kaynak** |
| **Yahoo Finance** (yfinance API) | Hacim, RSI, VWAP, SMA20/50, EMA9/21, MACD, Bollinger, avg_volume | Teknik indikatörler |
| **Alpaca Market Data** (data.alpaca.markets) | Daily OHLCV, VWAP, bid/ask, spread, latest trade | Teknik cross-check + likidite |
| **VIX (Yahoo Finance)** | Piyasa volatilite indeksi | Genel piyasa duyarlılığı |

> **Not:** Fiyat **sadece Midas'tan** gelir. Alpaca ve Yahoo Finance fiyat verisi kullanılmaz.

---

## 3. Pipeline Adımları (Step-by-Step)

### Adım 1: WebBridge ile Midas Dashboard'a Bağlan
- `http://127.0.0.1:10086` (Kimi WebBridge daemon)
- Chrome'da açık Midas session'ı kullanır
- Dashboard yenilenerek page 1'e dönülür (`go_to_first_page()`)

### Adım 2: Sayfa Verisi Çek
- 3 sayfa gezilerek (20+20+10 = 50 sembol)
- Her sayfada `extract_page_data_v2()` ile DOM'dan tablo verisi çekilir
- `all_rows = {}` dict ile **symbol bazlı dedupe** yapılır

### Adım 3: Teknik Veri Çek (Her Sembol İçin)

#### 3A. Yahoo Finance (`fetch_technical_data(symbol)`)
```python
hist = yf.Ticker(symbol).history(period="60d", interval="1d")
```

Çekilen veriler:
- `volume` — Bugünkü hacim
- `avg_volume` — 20 günlük ortalama hacim
- `volume_ratio` — Bugünkü / ortalama (örn: 1.5x = hacim patlaması)
- `rsi` — 14 günlük RSI
- `sma20` — 20 günlük SMA
- `sma50` — 50 günlük SMA
- `ema9` — 9 günlük EMA
- `ema21` — 21 günlük EMA
- `vwap` — 20 günlük VWAP (Volume-Weighted Average Price)
- `bb_upper` / `bb_lower` — Bollinger Bands (±2 sigma)
- `macd` — MACD line
- `macd_signal` — MACD signal line

#### 3B. Alpaca (`fetch_alpaca_snapshot(symbol)`)
```python
GET https://data.alpaca.markets/v2/stocks/{symbol}/snapshot
```

Çekilen veriler:
- `daily_bar` — Günlük OHLCV + VWAP
- `prev_daily_bar` — Önceki gün kapanış
- `quote` — Bid, ask, spread, bid/ask size
- `latest_trade` — Son trade fiyat ve hacim

### Adım 4: Sinyal Motoru (`generate_signals()`)

Her hisse için `strength` skoru hesaplanır. Skor **+20 ile -20** arasındadır.

#### 4A. Fiyat Momentum Skorlaması

| Koşul | signals[] | strength |
|-------|-----------|----------|
| daily > 8% | DAILY_STRONG_UP | +3.5 |
| daily > 4% | DAILY_UP | +2.0 |
| daily > 1% | DAILY_POSITIVE | +0.8 |
| daily < -8% | DAILY_STRONG_DOWN | -3.5 |
| daily < -4% | DAILY_DOWN | -2.0 |
| daily < -1% | DAILY_NEGATIVE | -0.8 |
| weekly > 20% | WEEKLY_STRONG_UP | +3.5 |
| weekly > 10% | WEEKLY_UP | +2.0 |
| weekly > 3% | WEEKLY_POSITIVE | +0.8 |
| weekly < -20% | WEEKLY_STRONG_DOWN | -3.5 |
| weekly < -10% | WEEKLY_DOWN | -2.0 |
| weekly < -3% | WEEKLY_NEGATIVE | -0.8 |
| monthly > 40% | MONTHLY_STRONG_UP | +3.0 |
| monthly > 20% | MONTHLY_UP | +1.8 |
| monthly > 5% | MONTHLY_POSITIVE | +0.7 |
| monthly < -40% | MONTHLY_STRONG_DOWN | -3.0 |
| monthly < -20% | MONTHLY_DOWN | -1.8 |
| monthly < -5% | MONTHLY_NEGATIVE | -0.7 |

#### 4B. Confluence (Uyum) Analizi

| Koşul | signals[] | strength |
|-------|-----------|----------|
| daily + weekly + monthly > 0 | ALL_UP | +2.0 |
| 2 pozitif, 1 negatif | BULLISH_CONFLUENCE | +1.0 |
| daily + weekly + monthly < 0 | ALL_DOWN | -2.0 |
| 2 negatif, 1 pozitif | BEARISH_CONFLUENCE | -1.0 |

#### 4C. Trend Alignment (Yön Uyumu)

| Koşul | signals[] | strength |
|-------|-----------|----------|
| daily>0, weekly>10, monthly>20 | STRONG_BULLISH_TREND | +1.5 |
| daily<0, weekly<-10, monthly<-20 | STRONG_BEARISH_TREND | -1.5 |

#### 4D. Aşırı Hareketler

| Koşul | signals[] | strength |
|-------|-----------|----------|
| daily>15, monthly>60 | EXTREME_MOMENTUM | +1.0 |
| daily<-15, monthly<-40 | EXTREME_WEAKNESS | -1.0 |

#### 4E. Hacim Analizi (Yahoo Finance)

| Koşul | signals[] | strength |
|-------|-----------|----------|
| volume_ratio > 3x | HACIM_PATLAMA | +2.0 |
| volume_ratio > 1.5x | HACIM_YUKSEK | +1.0 |
| volume_ratio < 0.5x | HACIM_DUSUK | -0.5 |

#### 4F. RSI (Yahoo Finance)

| Koşul | signals[] | strength |
|-------|-----------|----------|
| RSI < 30 | RSI_OVERSOLD | +1.5 |
| RSI > 70 | RSI_OVERBOUGHT | -1.5 |

#### 4G. VWAP (Yahoo Finance)

| Koşul | signals[] | strength |
|-------|-----------|----------|
| price > VWAP × 1.02 | VWAP_USTU | +0.8 |
| price < VWAP × 0.98 | VWAP_ALTI | -0.8 |

#### 4H. SMA (Yahoo Finance)

| Koşul | signals[] | strength |
|-------|-----------|----------|
| price > SMA20 | SMA20_USTU | +0.5 |
| price > SMA50 | SMA50_USTU | +0.5 |

#### 4I. EMA Crossover (Yahoo Finance)

| Koşul | signals[] | strength |
|-------|-----------|----------|
| EMA9 > EMA21 | EMA_BULLISH_CROSS | +1.0 |
| EMA9 < EMA21 | EMA_BEARISH_CROSS | -1.0 |

#### 4J. MACD (Yahoo Finance)

| Koşul | signals[] | strength |
|-------|-----------|----------|
| MACD > Signal ve MACD > 0 | MACD_BULLISH | +1.0 |
| MACD < Signal ve MACD < 0 | MACD_BEARISH | -1.0 |

#### 4K. Bollinger Bands (Yahoo Finance)

| Koşul | signals[] | strength |
|-------|-----------|----------|
| price < BB_lower | BB_OVERSOLD | +1.0 |
| price > BB_upper | BB_OVERBOUGHT | -1.0 |

### Adım 5: Sinyal Sınıflandırma (Mode Bazlı)

Toplam `strength` skoruna göre sinyal üretilir:

#### Default Mode (Varsayılan)

| strength | Sinyal |
|----------|--------|
| ≥ +7.0 | STRONG_BUY |
| ≥ +3.0 | BUY |
| ≤ -7.0 | STRONG_SELL |
| ≤ -3.0 | SELL |
| arası | HOLD |

#### Aggressive Mode (Agresif)

| strength | Sinyal |
|----------|--------|
| ≥ +5.0 | STRONG_BUY |
| ≥ +2.0 | BUY |
| ≤ -5.0 | STRONG_SELL |
| ≤ -2.0 | SELL |
| arası | HOLD |

#### Conservative Mode (Muhafazakar)

| strength | Sinyal |
|----------|--------|
| ≥ +10.0 | STRONG_BUY |
| ≥ +5.0 | BUY |
| ≤ -10.0 | STRONG_SELL |
| ≤ -5.0 | SELL |
| arası | HOLD |

### Adım 6: Confidence (Güven) Hesaplama

| Koşul | confidence |
|-------|-----------|
| \|strength\| ≥ 10 | 90% |
| \|strength\| ≥ 7 | 80% |
| \|strength\| ≥ 4 | 70% |
| \|strength\| ≥ 2 | 60% |
| diğer | 40% |

**Bonus:**
- +5: Tüm zaman dilimleri aynı yönde (ALL_UP / ALL_DOWN)
- +3: Günlük > 5% ve haftalık > 10%
- +3: Hacim > 1.5x ortalama (volume confirmation)
- +2: RSI < 30 veya > 70 (extreme)

### Adım 7: Risk Level (Risk Seviyesi)

| Koşul | risk_level |
|-------|-----------|
| \|strength\| ≥ 8 veya \|daily\| > 10% | HIGH |
| \|strength\| ≥ 4 veya \|daily\| > 5% | MEDIUM |
| diğer | LOW |

### Adım 8: Notes (Hisseye Özel Notlar)

Teknik indikatörlere göre dinamik not üretilir:

**Hacim bazlı:**
- "Hacim patlaması (2.5x ort), alış onaylı"
- "Hacim düşük, sinyal zayıf"

**RSI bazlı:**
- "RSI oversold dönüşü, teknik alış fırsatı"
- "RSI overbought, aşırı alım riski"

**VWAP bazlı:**
- "VWAP üstü, intraday momentum pozitif"

**MACD bazlı:**
- "MACD bullish crossover, momentum güçlü"

**SMA bazlı:**
- "SMA20/50 üstü, trend yapısal"
- "SMA20/50 altında, trend kırılması"

### Adım 9: Sıralama

```python
results.sort(key=lambda x: (
    x["signal"] not in ("STRONG_BUY", "BUY"),  # BUY'lar önce
    -abs(x.get("strength", 0)) if x["signal"] in ("STRONG_BUY", "BUY") else abs(x.get("strength", 0)),
    -x.get("strength", 0)  # Strength'e göre azalan
))
```

Pozitif momentum hisseleri önce, sonra negatifler.

### Adım 10: Summary (Özet)

```json
{
  "summary": {
    "strong_buy": N,
    "buy": N,
    "hold": N,
    "sell": N,
    "strong_sell": N,
    "avg_confidence": 60.5,
    "market_sentiment": "STRONGLY_BEARISH"
  }
}
```

**market_sentiment:**
- STRONGLY_BULLISH: bullish > bearish × 2
- BULLISH: bullish > bearish
- NEUTRAL: eşit veya karışık
- BEARISH: bearish > bullish
- STRONGLY_BEARISH: bearish > bullish × 2

---

## 4. Çıktı Formatı (JSON)

```json
{
  "timestamp": "2026-06-24T06:10:00+00:00",
  "symbol_count": 50,
  "successful": 50,
  "failed": 0,
  "mode": "default",
  "summary": { ... },
  "market_overview": {
    "SPY": { "name": "S&P 500 ETF", "price": 733.58, "change_pct": -1.45, "volume": 66642100 },
    "QQQ": { "name": "Nasdaq 100 ETF", "price": 713.65, "change_pct": -3.29, "volume": 45000000 },
    "DIA": { "name": "Dow Jones ETF", "price": 516.62, "change_pct": -0.09, "volume": 12000000 },
    "^VIX": { "name": "Volatility Index", "price": 20.54, "change_pct": 4.38, "volume": 0 }
  },
  "signals": [
    {
      "symbol": "BE",
      "signal": "STRONG_BUY",
      "strength": 8.8,
      "confidence": 85,
      "risk_level": "HIGH",
      "daily_pct": 2.87,
      "weekly_pct": 13.38,
      "monthly_pct": 7.27,
      "price": 331.23,
      "signals": ["DAILY_POSITIVE", "WEEKLY_UP", "MONTHLY_POSITIVE", "ALL_UP", "VWAP_USTU", "SMA20_USTU", "EMA_BULLISH_CROSS", "MACD_BULLISH"],
      "notes": "RSI nötr bölgede, momentum dengeli; VWAP üstü, intraday momentum pozitif; MACD bullish crossover, momentum güçlü",
      "technical": {
        "volume": 11400000,
        "avg_volume": 10900000,
        "volume_ratio": 1.05,
        "rsi": 54.3,
        "sma20": 284.17,
        "sma50": 284.17,
        "ema9": 300.83,
        "ema21": 289.19,
        "vwap": 284.29,
        "bb_upper": 339.62,
        "bb_lower": 228.73,
        "macd": 7.75,
        "macd_signal": 7.43,
        "close": 331.23,
        "alpaca": {
          "daily_bar": { "open": 320.0, "high": 335.0, "low": 318.0, "close": 331.23, "volume": 11400000, "vwap": 328.5 },
          "quote": { "bid": 330.5, "ask": 331.8, "spread": 1.3, "bid_size": 100, "ask_size": 200 },
          "latest_trade": { "price": 331.23, "size": 50 }
        }
      }
    }
  ]
}
```

---

## 5. Neler EKLENMEMİŞ (Değerleme Yok)

| Değerleme Metriği | Pipeline'da Var mı? |
|---------------------|---------------------|
| **P/E (Price-to-Earnings)** | ❌ Yok |
| **P/B (Price-to-Book)** | ❌ Yok |
| **PEG Ratio** | ❌ Yok |
| **EPS (Earnings Per Share)** | ❌ Yok |
| **Revenue Growth** | ❌ Yok |
| **Net Margin / Gross Margin** | ❌ Yok |
| **ROE (Return on Equity)** | ❌ Yok |
| **Debt-to-Equity** | ❌ Yok |
| **Free Cash Flow** | ❌ Yok |
| **Enterprise Value** | ❌ Yok |
| **DCF (Discounted Cash Flow)** | ❌ Yok |
| **Sector Comparison** | ❌ Yok |
| **Earnings Surprise** | ❌ Yok |
| **Insider Trading** | ❌ Yok |
| **Institutional Ownership** | ❌ Yok |

---

## 6. Cron Job Zamanlaması

| Piyasa Dönemi | TR Saat | EDT | Sıklık |
|---------------|---------|-----|--------|
| Pre-market | 11:00–15:00 | 04:00–08:00 | **Saatte 1** |
| Regular | 16:00–22:50 | 09:30–15:50 | **10 dakikada 1** |
| After-hours | 23:00–03:00 | 16:00–20:00 | **Saatte 1** |

**Timeout:** 15 dakika (900.000ms)  
**Hafta sonu:** Kapalı (Pzt–Cum)

---

## 7. Sync Akışı

```
Windows Local
  │
  ├─► Midas Pipeline → midas_signals.json
  │
  ├─► Local Gistify → client/public/midas_signals.json
  │
  └─► VPS SCP → /srv/gistify/midas/midas_signals.json
            │
            ▼
      Coolify Container (volume mount)
            │
            ▼
      /data/midas/midas_signals.json
            │
            ▼
      Gistify Server → /api/midas/signals
            │
            ▼
      React UI → MidasOpportunitiesTab
```

---

## 8. Değerleme Eklemek İstersek

### A) Momentum'a Değerleme Kat
Yahoo Finance fundamental API'si ile:
```python
info = yf.Ticker(symbol).info
pe = info.get("trailingPE")
pb = info.get("priceToBook")
peg = info.get("pegRatio")
roe = info.get("returnOnEquity")
```
Bu verileri `strength` skoruna ekleyip "value-momentum" filtresi yapılabilir.

### B) Ayrı Değerleme Pipeline'ı
- SEC EDGAR (10-K, 10-Q) → `sec_edgar` skill
- Finviz / Simply Wall St → WebBridge scraping
- Çıktı: Fair value, margin of safety, intrinsic value

---

> **Disclaimer:** Bu sinyaller sadece momentum ve teknik analiz tabanlıdır. Yatırım tavsiyesi değildir. Değerleme (fundamental) analizi içermez.
