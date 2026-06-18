# 🇺🇸 Amerikan Piyasaları — Ücretsiz & Kaliteli Veri Kaynakları

> Yapay zeka agentları için derlenmiş kaynak rehberi | Güncelleme: Haziran 2026

---

## 📊 1. Fiyat & Borsa Verileri (API)

### 🟢 Alpha Vantage
- **URL:** https://www.alphavantage.co/
- **Ücretsiz Plan:** Günlük 25 istek (hisse, ETF, forex, kripto, teknik indikatörler)
- **Format:** JSON, CSV
- **Özellik:** NASDAQ'ın resmi lisanslı veri sağlayıcısı; AI/MCP uyumlu
- **API Key:** `OTREUM7KTYQJQZWG`
- **Örnek endpoint:**
  ```
  https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=OTREUM7KTYQJQZWG
  ```

---

### 🟢 Finnhub
- **URL:** https://finnhub.io/
- **Ücretsiz Plan:** 60 istek/dakika; gerçek zamanlı hisse fiyatları, şirket fundamentalleri, haberler
- **Format:** JSON, WebSocket
- **Özellik:** 30+ yıllık bilanço verisi, insider işlemler, kazanç tahminleri
- **API Key:** `d0q5u9pr01qt60ombm90d0q5u9pr01qt60ombm9g`
- **Örnek endpoint:**
  ```
  https://finnhub.io/api/v1/quote?symbol=AAPL&token=d0q5u9pr01qt60ombm90d0q5u9pr01qt60ombm9g
  ```

---

### 🟢 Twelve Data
- **URL:** https://twelvedata.com/
- **Ücretsiz Plan:** 800 istek/gün; 50+ borsadan hisse, forex, kripto
- **Format:** JSON, CSV
- **Özellik:** 100+ teknik indikatör; WebSocket desteği (ücretsiz planda sınırlı)
- **API Key:** `d2bff39c345a49f1aa9ab15c70fcd6a9`
- **Örnek endpoint:**
  ```
  https://api.twelvedata.com/price?symbol=AAPL&apikey=d2bff39c345a49f1aa9ab15c70fcd6a9
  ```

---

### 🟢 yfinance (Python Kütüphanesi)
- **GitHub:** https://github.com/ranaroussi/yfinance
- **Ücretsiz Plan:** Tamamen ücretsiz, API key gerekmez
- **Format:** Pandas DataFrame
- **Özellik:** Prototipleme ve veri bilimi MVP'leri için ideal; Yahoo Finance verilerine erişim
- **Kurulum:**
  ```bash
  pip install yfinance
  ```
- **Kullanım:**
  ```python
  import yfinance as yf
  aapl = yf.Ticker("AAPL")
  print(aapl.history(period="1mo"))
  ```
- ⚠️ **Not:** Resmi olmayan wrapper; zaman zaman kesintiler yaşanabilir

---

### 🟡 Polygon.io / Massive (Sınırlı Ücretsiz)
- **URL:** https://polygon.io/
- **Ücretsiz Plan:** 5 istek/dakika, 15 dakika gecikmeli veri
- **Format:** JSON, WebSocket
- **Özellik:** Hisse, opsiyon, forex ve kripto; düşük gecikmeli tick verisi
- **API Key:** `3AjVXfyR6gxZgB9g3SpN7e6e7JLiIxTq`
- **Örnek endpoint:**
  ```
  https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2024-01-01/2024-12-31?apiKey=3AjVXfyR6gxZgB9g3SpN7e6e7JLiIxTq
  ```
- ⚠️ **Not:** Gerçek zamanlı veri için ücretli plan gerekli ($29/ay+); Ekim 2025'te Massive.com olarak yeniden markalaştı, mevcut API key'ler geçerlidir

---

### 🟡 Marketstack
- **URL:** https://marketstack.com/
- **Ücretsiz Plan:** 100 istek/ay; 70+ borsadan 170.000+ hisse geçmiş verisi (EOD)
- **Format:** JSON
- **API Key:** `a38643a37faef147cd66bc053b1b75a3`
- **Örnek endpoint:**
  ```
  http://api.marketstack.com/v1/eod?access_key=a38643a37faef147cd66bc053b1b75a3&symbols=AAPL
  ```

---

## 📈 2. Ekonomik Göstergeler (Makro Veri)

### 🟢 FRED API (Federal Reserve Economic Data)
- **URL:** https://fred.stlouisfed.org/docs/api/fred/
- **API Dokümantasyonu:** https://fred.stlouisfed.org/docs/api/fred/overview.html
- **Ücretsiz Plan:** 120 istek/dakika; 816.000+ zaman serisi
- **Format:** JSON, XML
- **Özellik:** ABD GDP, enflasyon (CPI), işsizlik, faiz oranları, konut verileri; 76 yıllık tarihsel veri
- **API Key:** Ücretsiz kayıtla alınır → https://fredaccount.stlouisfed.org/apikeys
- **Kritik Seriler:**

  | Seri ID | Açıklama |
  |---------|----------|
  | `GDP` | Gayri Safi Yurtiçi Hasıla |
  | `CPIAUCSL` | Tüketici Fiyat Endeksi (CPI) |
  | `UNRATE` | İşsizlik Oranı |
  | `DFF` | Fed Fon Faiz Oranı |
  | `T10Y2Y` | 10-2 Yıllık Tahvil Spread'i |
  | `SP500` | S&P 500 Endeksi |
  | `VIXCLS` | VIX (Oynaklık Endeksi) |

- **Örnek endpoint:**
  ```
  https://api.stlouisfed.org/fred/series/observations?series_id=GDP&api_key=YOUR_KEY&file_type=json
  ```

---

### 🟢 BLS Public Data API (Bureau of Labor Statistics)
- **URL:** https://api.bls.gov/publicAPI/v2/timeseries/data/
- **Ücretsiz Plan:** Günlük 25 seri; API key ile 500 seri
- **Format:** JSON
- **Özellik:** Resmi CPI, işsizlik, istihdam, ücret verileri
- **API Key:** Ücretsiz kayıt → https://data.bls.gov/registrationEngine/
- **Kritik Seriler:**

  | Seri ID | Açıklama |
  |---------|----------|
  | `CUSR0000SA0` | CPI Tüm Kentsel Tüketiciler |
  | `LNS14000000` | İşsizlik Oranı |
  | `CES0000000001` | Tarım Dışı İstihdam |

---

### 🟢 U.S. Treasury — Hazine Faiz Oranları
- **URL:** https://home.treasury.gov/resource-center/data-chart-center/interest-rates/
- **XML Feed:**
  ```
  https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_yield_curve&field_tdr_date_value=202501
  ```
- **Ücretsiz Plan:** Tamamen ücretsiz, giriş gerekmez
- **Özellik:** Günlük getiri eğrisi verileri; 2 yıl, 5 yıl, 10 yıl, 30 yıl tahvil faizleri

---

## 📰 3. Haberler & RSS Beslemeleri

### 🟢 SEC EDGAR — Şirket Bildirim RSS
- **Tüm Son Bildirimler:**
  ```
  https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=&dateb=&owner=include&count=40&search_text=&output=atom
  ```
- **10-K Yıllık Raporlar:**
  ```
  https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=10-K&dateb=&owner=include&count=10&search_text=&output=atom
  ```
- **8-K Anlık Bildirimler:**
  ```
  https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&dateb=&owner=include&count=10&search_text=&output=atom
  ```
- **Güncellenme Sıklığı:** Her 10 dakikada bir (Pazartesi-Cuma, 06:00–22:00 EST)
- **Format:** Atom/RSS XML

---

### 🟢 Federal Reserve — Basın Açıklamaları RSS
- **URL:** https://www.federalreserve.gov/feeds/press_all.xml
- **FOMC Kararları:**
  ```
  https://www.federalreserve.gov/feeds/press_monetary.xml
  ```
- **Ücretsiz Plan:** Tamamen ücretsiz

---

### 🟢 Investing.com Haber RSS
- **Genel Haberler:**
  ```
  https://www.investing.com/rss/news.rss
  ```
- **ABD Haberleri:**
  ```
  https://www.investing.com/rss/news_285.rss
  ```

---

### 🟢 Seeking Alpha RSS
- **Market Haberleri:**
  ```
  https://seekingalpha.com/feed.xml
  ```

---

### 🟢 Yahoo Finance RSS
- **ABD Borsa Haberleri:**
  ```
  https://finance.yahoo.com/rss/topfinstories
  ```
- **Belirli Hisse Haberleri:**
  ```
  https://feeds.finance.yahoo.com/rss/2.0/headline?s=AAPL&region=US&lang=en-US
  ```

---

## 📅 4. Ekonomik Takvim

### 🟢 Investing.com Ekonomik Takvim API
- **URL:** https://www.investing.com/economic-calendar/
- ⚠️ Resmi API yok, scraping ile kullanılır

### 🟢 Finnhub Ekonomik Takvim
- **Endpoint:**
  ```
  https://finnhub.io/api/v1/calendar/economic?token=d0q5u9pr01qt60ombm90d0q5u9pr01qt60ombm9g
  ```
- **Ücretsiz** (Finnhub hesabıyla)

---

## 🏦 5. Resmi Hükümet & Borsa Kaynakları

### Referans Linkler

| Kaynak | URL | İçerik |
|--------|-----|--------|
| SEC EDGAR | https://www.sec.gov/cgi-bin/browse-edgar | Tüm şirket bildirimleri |
| SEC Data API | https://data.sec.gov/submissions/ | JSON formatında bildirim geçmişi |
| EDGAR Full-Text Search | https://efts.sec.gov/LATEST/search-index?q= | Metin bazlı EDGAR araması |
| Fed Faiz Kararları | https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm | FOMC toplantı takvimi |
| FRED Veri Sitesi | https://fred.stlouisfed.org/ | 816.000+ ekonomik seri |
| BLS Ana Sayfa | https://www.bls.gov/data/ | İstihdam & enflasyon |
| U.S. Treasury | https://home.treasury.gov/ | Hazine verileri |
| NYSE Veri Servisleri | https://www.nyse.com/data-and-tech | NYSE resmi verileri |
| NASDAQ Veri | https://www.nasdaq.com/market-data | NASDAQ piyasa verileri |
| CBOE (VIX) | https://www.cboe.com/tradable_products/vix/ | Oynaklık endeksi |

---

## 🤖 6. Agent Kullanımı için Öneri Kombinasyonu

```
┌─────────────────────────────────────────────────────────┐
│          AMERIKAN PİYASASI AGENT VERİ MİMARİSİ         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📈 FIYAT VERİSİ                                        │
│     → yfinance (ücretsiz, hızlı prototip)              │
│     → Alpha Vantage (kalite, NASDAQ lisanslı)           │
│     → Finnhub (gerçek zamanlı, 60 req/dk)              │
│                                                         │
│  📊 EKONOMİK GÖSTERGE                                   │
│     → FRED API (800k+ seri, 120 req/dk)                │
│     → BLS API (resmi CPI, işsizlik)                    │
│     → U.S. Treasury (tahvil faizleri)                  │
│                                                         │
│  📰 HABER & BİLDİRİM                                    │
│     → SEC EDGAR RSS (şirket bildirimleri)              │
│     → Fed RSS (FOMC kararları)                          │
│     → Finnhub /news (haber API)                        │
│                                                         │
│  📅 TAKVİM                                              │
│     → Finnhub Economic Calendar                        │
│     → FOMC Takvimi (Fed sitesi)                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ⚡ Hızlı Başlangıç — Python Örneği

```python
import yfinance as yf
import requests

# --- Hisse Fiyatı (ücretsiz, key gerekmez) ---
ticker = yf.Ticker("SPY")
df = ticker.history(period="1mo")
print(df[["Close", "Volume"]].tail(5))

# --- FRED API: Fed Faiz Oranı ---
# ⚠️ FRED key'ini https://fredaccount.stlouisfed.org/apikeys adresinden alın
FRED_KEY = "YOUR_FRED_KEY"
url = "https://api.stlouisfed.org/fred/series/observations"
params = {
    "series_id": "DFF",
    "api_key": FRED_KEY,
    "file_type": "json",
    "sort_order": "desc",
    "limit": 5
}
r = requests.get(url, params=params).json()
for obs in r["observations"]:
    print(obs["date"], obs["value"])

# --- Alpha Vantage: Anlık Fiyat ---
AV_KEY = "OTREUM7KTYQJQZWG"
r = requests.get(
    f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey={AV_KEY}"
).json()
print(r["Global Quote"]["05. price"])

# --- Finnhub: Anlık Fiyat ---
FH_KEY = "d0q5u9pr01qt60ombm90d0q5u9pr01qt60ombm9g"
r = requests.get(
    f"https://finnhub.io/api/v1/quote?symbol=AAPL&token={FH_KEY}"
).json()
print("Finnhub AAPL:", r["c"])  # c = current price

# --- Twelve Data: Anlık Fiyat ---
TD_KEY = "d2bff39c345a49f1aa9ab15c70fcd6a9"
r = requests.get(
    f"https://api.twelvedata.com/price?symbol=AAPL&apikey={TD_KEY}"
).json()
print("Twelve Data AAPL:", r["price"])

# --- Polygon.io: Günlük Bar ---
POLY_KEY = "3AjVXfyR6gxZgB9g3SpN7e6e7JLiIxTq"
r = requests.get(
    f"https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2025-01-01/2025-12-31?apiKey={POLY_KEY}"
).json()
print("Polygon bars:", r.get("resultsCount"))

# --- Marketstack: EOD Fiyat ---
MS_KEY = "a38643a37faef147cd66bc053b1b75a3"
r = requests.get(
    f"http://api.marketstack.com/v1/eod?access_key={MS_KEY}&symbols=AAPL&limit=5"
).json()
for item in r["data"]:
    print(item["date"], item["close"])

# --- SEC EDGAR: Son 8-K Bildirimleri ---
import feedparser
rss_url = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&dateb=&owner=include&count=10&search_text=&output=atom"
feed = feedparser.parse(rss_url)
for entry in feed.entries[:3]:
    print(entry.title, entry.updated)
```

---

## 📝 Notlar & Sınırlamalar

| API | Ücretsiz Limit | Gecikme | Not |
|-----|---------------|---------|-----|
| Alpha Vantage | 25 istek/gün | 15-20 dk | NASDAQ lisanslı |
| Finnhub | 60 istek/dk | Gerçek zamanlı | En cömert ücretsiz plan |
| Twelve Data | 800 istek/gün | Gerçek zamanlı | WebSocket sınırlı |
| yfinance | Sınırsız* | ~15 dk | Resmi değil, stabil değil |
| Polygon.io | 5 istek/dk | 15 dk | Gerçek zamanlı için ücretli |
| FRED API | 120 istek/dk | Günlük | En stabil ve güvenilir |
| BLS API | 25-500 seri/gün | Resmi yayın | Resmi hükümet verisi |
| SEC EDGAR | 10 istek/sn | 10 dk | Resmi, hiçbir zaman kapanmaz |

> \* yfinance'in rate limiti Yahoo Finance'e bağlıdır; ağır kullanımda kısıtlanabilir.

---

## 🔑 API Key Özeti

| Servis | API Key |
|--------|---------|
| Alpha Vantage | `OTREUM7KTYQJQZWG` |
| Finnhub | `d0q5u9pr01qt60ombm90d0q5u9pr01qt60ombm9g` |
| Twelve Data | `d2bff39c345a49f1aa9ab15c70fcd6a9` |
| Polygon.io / Massive | `3AjVXfyR6gxZgB9g3SpN7e6e7JLiIxTq` |
| Marketstack | `a38643a37faef147cd66bc053b1b75a3` |
| FRED | *(Kişisel kayıt gerekli)* |
| BLS | *(Kişisel kayıt gerekli)* |

---

*Son güncelleme: Haziran 2026 | Kaynak: Resmi API dokümantasyonları ve güncel araştırmalar*
