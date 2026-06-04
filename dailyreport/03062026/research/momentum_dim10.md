# Boyut 10: Yuksek Hacimli ve Volatil Hisseler - Derinlemesine Arastirma Raporu

## Ozet

Bu rapor, 3 Haziran 2026 tarihi itibariyle Amerikan borsalarinda (NYSE, NASDAQ) en yuksek hacimli ve en volatil hisseleri kapsamli bir sekilde analiz etmektedir. Arastirma, guncel piyasa verileri, teknik gostergeler, opsiyon metrikleri ve short interest verilerini bir araya getirmektedir.

---

## 1. Piyasa Volatilite Ortami - VIX Analizi

### 1.1 VIX Genel Gorunum (Haziran 2026)

```
Claim: VIX spot fiyat 3 Haziran 2026 itibariyle ~16.05-16.20 araliginda islem goruyor, bu tarihsel ortalamanin (%18.54) altinda ve dusuk volatilite rejimine isaret ediyor [^925^][^414^]
Source: Cboe Global Markets / MarketWatch
URL: https://www.cboe.com/en/tradable-products/vix/
Date: 2026-06-03
Excerpt: "VIX Spot Price: $16.09, Change: +2.03%, 52 Week Range: 13.38 - 35.30"
Context: VIX uzun donem ortalamasi 18.54 olup, mevcut seviye %15.0 altinda. Medyan deger 17.62. Tipik aralik 11.25-25.83.
Confidence: high
```

```
Claim: VIX futures term structure inversion'dan cikmis ve contango yapisina donmus, bu piyasada gerginligin azaldigini gosteriyor [^946^]
Source: Cboe Futures Exchange
URL: https://www.cboe.com/en/tradable-products/vix/vix-futures/
Date: 2026-06-03
Excerpt: "VX/M6 (June): 17.80, VX/N6 (July): 20.26, VX/Q6 (Aug): 21.17, VX/U6 (Sept): 21.68"
Context: Yakindaki futures spot VIX'ten yuksek (backwardation yok), bu sakin piyasa kosullarini gosterir.
Confidence: high
```

```
Claim: VIX mayis ayi kapanisi 16.29 oldu, bu yilbasindan bu yana %8.23 dusus gosteriyor [^954^]
Source: Trading Economics / Fed Data
URL: https://tradingeconomics.com/united-states/cboe-volatility-index-vix-fed-data.html
Date: 2026-05-31
Excerpt: "VIX was 16.29000 Index in May of 2026"
Context: VIX yillik bazda %8.12 dusus, 3 aylik %23.50 dusus trendinde.
Confidence: high
```

### 1.2 Volatilite Rejimi Degisimi

```
Claim: 2026 yilinda volatilite rejimi degisimi gozleniyor - "elevator up, elevator down" paterni hakim, VIX spike'lari 3-5 yildan 1 yila indi, volatilitenin sakinlesme suresi 25 gunden 9 gune dustu [^1020^]
Source: Allianz Global Investors
URL: https://hk.allianzgi.com/documents/AllianzGI-Volatility-short-version-Boess-Krayzler-Stamos-EN-2026
Date: 2026-05
Excerpt: "spikes in the VIX Index that used to occur every three to five years now appear every year. And the time for volatility to subside has halved, from around 25 days to only nine days."
Context: "When calm no longer means safe: navigating a new volatility regime"
Confidence: high
```

```
Claim: 2026'in basinda implied volatilite ile realized volatilite arasindaki fark (volatility risk premium) son yillarin en yuksek seviyelerine ulasti - implied volatilite %23 iken realized volatilite %14'un altinda kaldi [^952^]
Source: Penn Mutual Asset Management
URL: https://www.pennmutualam.com/market-insights-news/blogs/chart-of-the-week/2026-03-26-when-fear-leads-reality-inside-2026-volatility-surge
Date: 2026-03-26
Excerpt: "S&P 500 Index's 30-day implied volatility has climbed above 23%, nearly double the level observed at the start of the year, even as the index's 30-day realized volatility has remained below 14%"
Context: Orta Dogu'daki Iran catismasi, petrol fiyatlarindaki yukselis ve stagflasyon endiseleri volatilite risk primini artirdi.
Confidence: high
```

```
Claim: State Street arastirmasina gore, yukselen politik belirisizlige ragmen dusuk VIX seviyeleri "sinyal kalitesi" zayifligini yansitiyor - bu potansiyel ani volatilite repricing riski tasiyor [^1017^]
Source: State Street Global Advisors
URL: https://www.statestreet.com/au/en/insights/market-calm-policy-noise-volatility-repricing
Date: 2026-06-02
Excerpt: "calm markets amid elevated policy uncertainty may reflect rational investor behavior rather than market complacency"
Context: ABD-Iran catismasina ragmen VIX 17.44 ile on-catisma seviyelerine yakin kaldi.
Confidence: high
```

---

## 2. En Yuksek Hacimli Hisseler (Gunluk / Ortalama)

### 2.1 En Aktif Hisseler Listesi (3 Haziran 2026)

```
Claim: Gunluk en yuksek hacimli hisseler sirasiyla: NU (171.6M), NVDA (164.5M), HPE (147.1M), NOK (123.7M), MRVL (93.1M), INTC (92.2M), ONDS (85.5M), PLUG (78.5M), RGTI (73.7M) [^924^]
Source: Yahoo Finance - Most Active Stocks
URL: https://finance.yahoo.com/markets/stocks/most-active/
Date: 2026-06-03
Excerpt: "NU: 171.62M volume, NVDA: 164.515M, HPE: 147.148M (+19.47%), NOK: 123.695M, MRVL: 93.149M (+32.52%)"
Context: HPE ve MRVL gunluk hacimlerinde ortalamanin 5-6x uzerinde patlama yasadi.
Confidence: high
```

### 2.2 Top 10 Hisseler - Detayli Hacim Analizi

| Ticker | Gunluk Hacim | 3M Ort. Hacim | RVOL | Fiyat | Gunluk Degisim | 52Hk % |
|--------|-------------|---------------|------|-------|---------------|--------|
| NU | 171.6M | 52.5M | 3.27x | $11.93 | -8.16% | -0.08% |
| NVDA | 164.5M | 166.7M | 0.99x | $222.82 | -0.69% | +57.00% |
| HPE | 147.1M | 22.4M | 6.57x | $56.15 | +19.47% | +214.74% |
| NOK | 123.7M | 94.3M | 1.31x | $16.85 | +3.69% | +211.46% |
| MRVL | 93.1M | 29.0M | 3.21x | $290.79 | +32.52% | +338.60% |
| INTC | 92.2M | 122.2M | 0.75x | $107.93 | -1.28% | +432.99% |
| ONDS | 85.5M | 76.3M | 1.12x | $13.58 | +0.89% | +676.00% |
| PLUG | 78.5M | 79.3M | 0.99x | $4.09 | +3.81% | +339.78% |
| RGTI | 73.7M | 37.5M | 1.97x | $26.88 | +4.88% | +127.41% |

**Kaynak:** Yahoo Finance Most Active [^924^]

### 2.3 Islem Hacmi Tarihsel Rekorlari

```
Claim: Kasim 2025'te tek gunluk en yuksek hacim: NVDA 173.63M, OPEN 155.44M, ONDS 154.72M, TSLA 102.21M hisse [^930^]
Source: BestBrokers / TradingView
URL: https://www.bestbrokers.com/stock-trading/stock-trading-market-statistics/
Date: 2026-01-14
Excerpt: "Nvidia (NVDA) topped the list with 173.63 million shares traded in a single day"
Context: 2026 yilinda AI temali hisselerde hacim patlamalari gozleniyor.
Confidence: high
```

---

## 3. En Volatil Hisseler - Teknik Metrikler

### 3.1 Average True Range (ATR) Analizi

```
Claim: NVDA'nin 14 gunluk ATR'si $7.84 (fiyatin %3.52'si) olup yuksek volatilite sinifinda. 9 gunluk ATR $8.22 (%3.69). [^978^]
Source: Barchart Technical Analysis
URL: https://www.barchart.com/stocks/quotes/NVDA/technical-analysis
Date: 2026-06-03
Excerpt: "9-Day ATR: 8.22 (3.69%), 14-Day ATR: 7.84 (3.52%), Average Daily Range %: 3.19%-3.52%"
Context: NVDA gunluk $7-8 araliginda hareket ediyor, bu da +/- %3.5 volatilite demek.
Confidence: high
```

```
Claim: NVDA icin expected move (1 gun): +/- $7.40 (%3.23%), fiyat araligi $221.42 - $236.22 [^989^]
Source: OptionCharts Expected Move Calculator
URL: https://optioncharts.io/options/NVDA/expected-move
Date: 2026-06-03
Excerpt: "Expected move for NVDA options expiring on Jun 03, 2026 (1 days) is +/-$7.40 (3.23%)"
Context: NVDA opsiyon piyasasi gunluk %3.23 hareket bekliyor.
Confidence: high
```

### 3.2 Implied Volatility (IV) Siralamasi

| Ticker | Implied Volatility | IV Rank | IV Percentile | 30G HV |
|--------|-------------------|---------|---------------|--------|
| DELL | 74.8-80.3% | 95-100% | 94% | 81.7% |
| SMCI | 86.6-109.7% | 64% | 94% | N/A |
| COHR | 89.9% | N/A | N/A | 74.7% |
| LITE | 90-94% | N/A | N/A | 91.7% |
| INTC | 79.3% | N/A | N/A | 91.3% |
| MSTR | 78.7% | 43% | N/A | N/A |
| HOOD | 68.2-68.5% | 44% | 71% | N/A |
| AMD | 71.2% | 93% | N/A | N/A |
| NVDA | 65-78% | N/A | N/A | N/A |
| PLUG | Y Yuksek | N/A | N/A | N/A |
| RGTI | 88-448% (opsiyonlarda) | N/A | N/A | 88.6% |

**Kaynaklar:** [^936^][^1019^][^996^][^999^][^986^][^1044^][^1079^][^1027^]

### 3.3 Etkileyici Gunluk Hareketler (3 Haziran 2026)

```
Claim: 3 Haziran 2026 gunluk en yuksek kazananlar: MRVL +32.52%, HPE +19.47%, COHR +17.63%, LITE +13.66%, STM +15.20%, AEHR +20.70% [^1022^]
Source: Yahoo Finance Gainers / WallStreetZen
URL: https://finance.yahoo.com/markets/stocks/gainers/
Date: 2026-06-03
Excerpt: "MRVL: +71.36 (+32.52%), HPE: +9.15 (+19.47%), COHR: +63.99 (+17.63%), LITE: +123.61 (+13.66%)"
Context: Bu hareketlerin cogu AI/semiconductor temali. MRVL earnings-driven hareket.
Confidence: high
```

```
Claim: MRVL 27 Mayis earnings sonrasi gercek hareket +24.5% oldu, opsiyon piyasasinin ongordugu +/-14.3% hareketin cok uzerinde [^1018^]
Source: MarketChameleon Earnings Analysis
URL: https://marketchameleon.com/Overview/SMCI/Earnings/Earnings-Charts/
Date: 2026-06
Excerpt: "SMCI last reported earnings on May 05, 2026 AMC. The options prices predicted a +/-14.3% post earnings move, compared to a +24.5% actual move."
Context: Opsiyon piyasasi earnings oncesi volatiliteyi yetersiz fiyatlamis.
Confidence: high
```

### 3.4 Beta Katsayilari (5 Yillik Aylik)

| Ticker | Beta | Yorum |
|--------|------|-------|
| TSLA | 1.79 | Cok volatil |
| AVGO | 1.44 | YUKsek volatilite |
| LITE | 1.01-1.16 | Piyasa ile uyumlu |
| HPE | 1.27 | Yuksek volatilite |
| NVDA | 1.75-2.0 | Cok volatil |
| INTC | 0.85-1.0 | Piyasa seviyesinde |

**Kaynaklar:** [^968^][^999^][^199^]

### 3.5 Tarihsel Volatilite (30 Gunluk)

```
Claim: DELL'in 30 gunluk tarihsel volatilitesi %81.69 (2026-05-28), COHR %74.69, LITE %91.72 (2026-05-13) [^940^][^997^][^1005^]
Source: AlphaQuery
URL: https://www.alphaquery.com/
Date: 2026-05-28
Excerpt: "DELL 30-Day Historical Volatility: 0.8169, COHR: 0.7469, LITE: 0.9172"
Context: LITE en yuksek tarihsel volatiliteye sahip (%91.72).
Confidence: high
```

---

## 4. Implied vs Historical Volatilite Analizi

```
Claim: INTC icin implied volatilite (%79.3) 20 gunluk tarihsel volatiliteden (%91.3) %13.1 dusuk, opsiyon piyasasi volatilite beklentisini dusuruyor [^986^]
Source: MarketChameleon
URL: https://marketchameleon.com/Overview/INTC/IV/
Date: 2026-05-28
Excerpt: "The current IV (79.3) in INTC is -13.1% below its 20 day HV (91.3)"
Context: IV < HV = opsiyon piyasasi "backward looking" volatiliteden daha sakin.
Confidence: high
```

```
Claim: COHR icin implied volatilite (%89.9) 20 gunluk HV'den (%86.3) %4.1 yuksek, opsiyon piyasasi yukselen volatilite bekliyor [^996^]
Source: MarketChameleon
URL: https://marketchameleon.com/Overview/COHR/IV/
Date: 2026-06
Excerpt: "The current IV (89.9) in COHR is 4.1% above its 20 day HV (86.3)"
Context: IV > HV = opsiyon piyasasi yukselen volatilite fiyatliyor.
Confidence: high
```

---

## 5. Opsiyon Aktivitesi - Unusual Options Activity

### 5.1 En Aktif Opsiyon Hisseleri

```
Claim: En aktif opsiyon islemi goren hisseler: NVDA (383K+ kontrat), SPY (550K+), QQQ (251K+), TSLA (194K+), AMZN (200K+) [^922^]
Source: Yahoo Finance Options
URL: https://finance.yahoo.com/markets/options/most-active/
Date: 2026-05-31
Excerpt: "NVDA Jun 2026 222.500 call: 383,212 volume, SPY Jun 2026 758 call: 585,654 volume"
Context: NVDA call opsiyonlarinda %380-715 artislar gozleniyor.
Confidence: high
```

### 5.2 Unusual Options Activity (TipRanks)

```
Claim: NVDA'da bullish opsiyon akisi hakim, Jun 3 '26 212.50 Call on planlanmamis aktivite gosteriyor. PATH'da bearish call akisi var. [^927^]
Source: TipRanks Unusual Activity
URL: https://www.tipranks.com/options/unusual-activity-stocks
Date: 2026-06-02
Excerpt: "NVDA Jun 3 '26 212.50 Call - Bullish, PATH Jun 5 '26 20.00 Call - Bearish"
Context: NVDA'da yukselis beklentisi, PATH'da dusus beklentisi hakim.
Confidence: medium
```

### 5.3 DELL Opsiyon Metrikleri

```
Claim: DELL opsiyonlarinda IV %80.26, IV rank %94.95, hacim 179K kontrat (ortalamanin %166'si). Implied move: +/-$34.13 (7.32%) [^936^][^993^]
Source: OptionCharts / UnusualWhales
URL: https://optioncharts.io/options/DELL
Date: 2026-06-02
Excerpt: "DELL options: IV 80.26%, IV rank 94.95%, Volume 179.09K (166.23% of ADV)"
Context: DELL opsiyonlari yukssek volatilite ve yuksek aktivite gosteriyor.
Confidence: high
```

### 5.4 MSTR Opsiyon Metrikleri

```
Claim: MSTR opsiyonlarinda IV %78.66, IV rank %43.41, hacim 618K kontrat (ortalamanin %140'i). Fiyat $149.78 (-5.85%) [^945^]
Source: OptionCharts
URL: https://optioncharts.io/options/MSTR
Date: 2026-06-03
Excerpt: "MSTR options: IV 78.66%, IV rank 43.41%, Volume 618.15K (140.38% of ADV)"
Context: MSTR volatilitesi Bitcoin volatilitesi ile baglantili.
Confidence: high
```

```
Claim: MSTR'de 10 gunluk realized volatilite 2020'den bu yana en dusuk seviyelerde, IV %48.33'e dusmus (Kasim 2024'te %225 zirvesi) [^950^]
Source: CoinDesk
URL: https://www.coindesk.com/markets/2025/06/24/strategy-stock-volatility-sinks-to-historic-lows-possibly-making-shares-less-attractive
Date: 2025-06-24
Excerpt: "MSTR's implied volatility currently sits at 48.33 percent... IV peaked at 225% in November 2024"
Context: MSTR volatilitesinde buyuk dusus trendi - bu hissenin cazibesini azaltabilir.
Confidence: high (ancak 2025 tarihli)
```

### 5.5 HOOD Opsiyon Metrikleri

```
Claim: HOOD opsiyonlarinda IV %68.2, IV rank %44.24, hacim 1.04M kontrat (ortalamanin %331'i) [^1050^]
Source: OptionCharts
URL: https://optioncharts.io/options/HOOD
Date: 2026-05-29
Excerpt: "HOOD options: IV 68.49%, IV rank 44.24%, Volume 1.04M (331.65% of ADV)"
Context: HOOD opsiyon aktivitesi 3x ortalama - asiri yuksek.
Confidence: high
```

### 5.6 INTC Expected Move

```
Claim: INTC icin opsiyon piyasasi Temmuz 2026'ya kadar +/-%23 hareket ongoruyor [^979^]
Source: Barchart / Yahoo Finance
URL: https://finance.yahoo.com/markets/options/articles/options-traders-betting-increasingly-diverging-153011910.html
Date: 2026-04-30
Excerpt: "the expected move in Intel shares through July 2026 now exceeds 23% in either direction"
Context: INTC opsiyon piyasasi buyuk bir hareket bekliyor.
Confidence: high
```

---

## 6. Short Interest ve Squeeze Potansiyeli

### 6.1 En Yuksek Short Interest Hisseleri

| Ticker | Short Interest % | Days to Cover | Son Kayit |
|--------|-----------------|---------------|-----------|
| ONDS | 31.33% | 2.1 | 2026-05-15 |
| SMCI | 16.10% | 1.8 | 2026-05-15 |
| PLUG | 24.76% | 4.4 | 2026-04-30 |
| HOOD | 4.90% | 1.7 | 2026-05-15 |
| WOLF | Yuksek | N/A | 2026-06 |
| HPE | 5.13% | N/A | 2026-05 |
| INDI | 31.2% | 8.6 | 2026-05 |
| SLS | 32.2% | 14.5 | 2026-05 |
| SOUN | Yuksek | N/A | 2026-06 |
| CLSK | Yuksek | N/A | 2026-06 |

**Kaynaklar:** [^1028^][^933^][^1076^][^948^][^960^]

### 6.2 SMCI Short Interest Detayi

```
Claim: SMCI short interest 81.22M hisse (%16.10 float), short interest ratio 1.8 gun, $2.52B short edilmis [^933^]
Source: MarketBeat
URL: https://www.marketbeat.com/stocks/NASDAQ/SMCI/short-interest/
Date: 2026-05-29
Excerpt: "Short Interest: 81,224,279 shares (16.10% of float), Days to Cover: 1.8, Dollar Volume Sold Short: $2.52 billion"
Context: SMCI short interest onceki aya gore %0.80 artti - ayi baskisi devam ediyor.
Confidence: high
```

```
Claim: SMCI 3. en cok short edilen hedge fund hissesi ve 2026 icin potansiyel short squeeze adayi olarak goruluyor [^939^]
Source: Barchart
URL: https://www.barchart.com/story/news/37090884/super-micro-computer-is-one-of-the-most-shorted-stocks-could-a-squeeze-take-it-higher-in-2026
Date: 2026-01-16
Excerpt: "SMCI is the third-most-shorted stock by hedge funds... SMCI stock can therefore be a potential short squeeze candidate for 2026"
Context: SMCI 52-hafta zirvesinden %51 duzeltme yasadi, bu bir first buying firsati olabilir.
Confidence: medium
```

### 6.3 ONDS Short Interest Detayi

```
Claim: ONDS short interest 152.84M hisse (%31.33 float), short interest ratio 2.1 gun, $1.62B short edilmis [^1028^]
Source: MarketBeat
URL: https://marketbeat.com/stocks/NASDAQ/ONDS/short-interest/
Date: 2026-05-30
Excerpt: "Short Interest: 152,837,863 shares (31.33% of float), Days to Cover: 2.1"
Context: ONDS en yuksek short interest oranlarindan birine sahip - squeeze potansiyeli yuksek.
Confidence: high
```

### 6.4 PLUG Short Interest Detayi

```
Claim: PLUG short interest 343.46M hisse (%24.76 float), short interest ratio 4.4 gun, $1.08B short edilmis [^1076^]
Source: MarketBeat
URL: https://www.marketbeat.com/stocks/NASDAQ/PLUG/short-interest/
Date: 2026-05-21
Excerpt: "Short Interest: 343,460,531 shares (24.76% of float), Days to Cover: 4.4"
Context: PLUG en cok short edilen hisselerden biri, squeeze potansiyeli var.
Confidence: high
```

### 6.5 Short Squeeze Screener Kriterleri

```
Claim: Chartmill Most Shorted Stocks screener: Average Volume > 500K, Market Cap > $300M, Price > $5, Short Interest > 10%, Days to Cover > 5 [^929^]
Source: Chartmill
URL: https://www.chartmill.com/stock/markets/usa/screener/most-shorted-stocks
Date: 2026-05-20
Excerpt: "Average Volume above 500K, Market Cap above $300M, Price above $5, Short Interest above 10% of Float, Days to Cover above 5"
Context: Bu kriterlere gore en iyi squeeze adaylari: ONDS, PLUG, SMCI, WOLF.
Confidence: high
```

---

## 7. Hacim-Fiyat Iliskisi Analizi

### 7.1 Volume-Price Confirmation Prensipleri

```
Claim: Yuksek hacimli yukselis = saglikli trend isareti; yuksek hacimli dusus = trend zayiflamasi. Hacim-fiyat divergence trend reversal sinyali olabilir. [^955^]
Source: CashBackISL Volume-Price Analysis
URL: https://www.cashbackisl.com/en/volume-price-relationship-guide-2/
Date: 2026-02-27
Excerpt: "Rising Price With Increasing Volume: The Most Classic Bullish Attack Signal... Top Divergence (Rising Price With Decreasing Volume): A Warning of Insufficient Upward Momentum"
Context: HPE gunluk +%19.47 ile 6.5x ortalama hacimde yukseldi - bu saglam bir confirmation.
Confidence: high
```

### 7.2 Gunluk Hacim-Fiyat Ornekleri (3 Haziran 2026)

| Ticker | Fiyat Degisimi | Hacim / Ort. | Yorum |
|--------|---------------|-------------|-------|
| HPE | +19.47% | 6.57x | Yuksek hacimli confirmation - saglam |
| MRVL | +32.52% | 3.21x | Earnings-driven, yuksek hacimli |
| COHR | +17.63% | 1.14x | Fiyat yukseldi ama hacim ortalama |
| LITE | +13.66% | 1.14x | Fiyat yukseldi, hacim ortalama |
| NU | -8.16% | 3.27x | Yuksek hacimli dusus - distribution |
| NVDA | -0.69% | 0.99x | Dusuk hacimli yatay - consolidation |

### 7.3 Market Breadth - Advance/Decline

```
Claim: S&P 500 advance/decline cizgisi Iran catismasi sonrasi dususun en dusuk noktasindan bu yana yukselis trendinde, piyasa genislemesi saglikli [^1045^]
Source: Fidelity
URL: https://www.fidelity.com/learning-center/trading-investing/advance-decline
Date: 2026-04-20
Excerpt: "Since the Iran conflict selloff hit its most recent nadir in late March, the S&P 500's advance/decline line has been trending higher alongside the index itself"
Context: "US stocks have erased all of their losses since the Iran conflict began."
Confidence: high
```

```
Claim: NYSE'de decliners advancers'i 1.04-to-1 oraninda geciyor (hafif negatif breadth) [^971^]
Source: Yahoo Finance Market News
URL: https://sg.finance.yahoo.com/news/stock-market-news-jun-2-130600173.html
Date: 2026-06-02
Excerpt: "Decliners outnumbered advancers on the NYSE by a 1.04-to-1 ratio"
Context: Hafif negatif breadth - endeksler yukselse de katilim tam degil.
Confidence: high
```

---

## 8. PHASE 1 Baglamindaki Hisseler - Ozel Analiz

### 8.1 SMCI ($50.17)

| Metrik | Deger |
|--------|-------|
| 3Aylik Getiri | +42.30% |
| 6Aylik Getiri | +37.95% |
| IV | 86.6-109.7% |
| IV Rank | 64% |
| Short Interest | 16.10% |
| Days to Cover | 1.8 |
| Gunluk Hacim | 30.4M |
| Avg Volume (3M) | 36.7M |

```
Claim: SMCI 2026'da yuksek volatilite yasadi - Nisan ayinda %27 tek gunluk dusus gordu (export-control indictment) [^937^]
Source: StocksToTrade
URL: https://stockstotrade.com/news/super-micro-computer-inc-smci-news-2026_04_02/
Date: 2026-04-02
Excerpt: "SMCI ran from roughly $31 in late April to $50.45 on June 2, 2026... The company's shares faced a dramatic fall of about 27% in a session"
Context: SMCI event-driven volatilite ornegi - compliance sorunlari ve AI server trade.
Confidence: high
```

### 8.2 DELL ($435.31)

| Metrik | Deger |
|--------|-------|
| 3Aylik Getiri | +184.25% |
| 6Aylik Getiri | +218.65% |
| IV | 74.8-80.3% |
| IV Rank | 95-100% |
| 30G HV | 81.7% |
| Beta | 1.0-1.2 |

```
Claim: DELL'in IV'si 1 yillik en yuksek seviyede, opsiyon piyasasi cok yuksek hareket bekliyor. Implied move +/-$34.13 (7.32%) [^993^][^998^]
Source: UnusualWhales / PowerOptions
URL: https://unusualwhales.com/stock/DELL/volatility
Date: 2026-06
Excerpt: "DELL has an implied move of $34.134 (7.3186%)... IV rank is 100.00"
Context: DELL'in IV'si 52-hafta zirvesinde - bu bir reversal sinyali olabilir.
Confidence: high
```

### 8.3 COHR ($426.89)

| Metrik | Deger |
|--------|-------|
| 3Aylik Getiri | +39.60% |
| 6Aylik Getiri | +121.08% |
| 1Yillik Getiri | +377.95% |
| IV | 89.9% |
| 30G HV | 74.7% |

```
Claim: COHR IV'si (%89.9) HV'sinden (%86.3) yuksek, opsiyon piyasasi yukselen volatilite bekliyor. COHR 30 gunluk HV %74.69. [^996^][^997^]
Source: MarketChameleon / AlphaQuery
URL: https://marketchameleon.com/Overview/COHR/IV/
Date: 2026-06
Excerpt: "COHR IV: 89.9, 20-day HV: 86.3... 30-Day Historical Volatility: 0.7469"
Context: COHR'da IV > HV = opsiyon piyasasi yukaridan volatilite bekliyor.
Confidence: high
```

### 8.4 LITE ($1,029.15)

| Metrik | Deger |
|--------|-------|
| 3Aylik Getiri | +21.98% |
| 6Aylik Getiri | +168.91% |
| 1Yillik Getiri | +1,082.84% |
| IV | 90-94% |
| 30G HV | 91.7% |
| Beta | 1.01-1.16 |
| ATR | Yuksek |

```
Claim: LITE 30 gunluk HV'si %91.72 ile cok yuksek volatilite gosteriyor. Beta 1.01-1.16 araliginda. [^1005^][^999^]
Source: AlphaQuery / MarketChameleon
URL: https://www.alphaquery.com/stock/LITE/volatility-option-statistics
Date: 2026-05-13
Excerpt: "LITE 30-Day Historical Volatility: 0.9172, Beta: 1.16"
Context: LITE en yuksek volatiliteye sahip hisselerden biri, 1 yilda %1082 getiri.
Confidence: high
```

```
Claim: LITE volatilitesi (%26.64) COHR'dan (%21.17) daha yuksek [^959^]
Source: PortfoliosLab
URL: https://portfolioslab.com/tools/stock-comparison/LITE/COHR
Date: 2026
Excerpt: "LITE has a higher volatility of 26.64% compared to COHR at 21.17%"
Context: LITE COHR'dan daha volatil.
Confidence: high
```

### 8.5 HPE ($56.15)

| Metrik | Deger |
|--------|-------|
| 3Aylik Getiri | +100.47% |
| 6Aylik Getiri | +96.17% |
| 1Yillik Getiri | +149.07% |
| Gunluk Degisim | +19.47% |
| Gunluk Hacim | 147.1M (6.6x ort.) |

```
Claim: HPE 3 Haziran'da %19.47 yukseldi ve 147M hacimle 3 aylik ortalamasinin 6.5x uzerinde islem gordu. [^924^]
Source: Yahoo Finance
URL: https://finance.yahoo.com/markets/stocks/most-active/
Date: 2026-06-03
Excerpt: "HPE: +9.15 (+19.47%), Volume: 147.148M (Avg Vol 3M: 22.39M)"
Context: HPE'de hacimli yukselis - saglam trend confirmation.
Confidence: high
```

### 8.6 MSTR ($149.78)

| Metrik | Deger |
|--------|-------|
| IV | 78.7% |
| IV Rank | 43.41% |
| 52Hk Araligi | $104.17 - $457.22 |
| Hacim | 17.78M (97% ort.) |

```
Claim: MSTR 3 Haziran 2026'da $149.78 (-5.85%), 52-hafta dusuk $104.17'den yukselis trendinde ancak $457.22 zirvesinden %67 uzakta [^944^]
Source: MarketWatch
URL: https://www.marketwatch.com/investing/stock/mstr/options
Date: 2026-06-01
Excerpt: "MSTR: $149.78 (-5.85%), 52 Week Range: 104.17-457.22"
Context: MSTR Bitcoin ile baglantili volatilite gosteriyor.
Confidence: high
```

---

## 9. Celiskili Bilgiler ve Uyusmazliklar

### 9.1 VIX Dusuk / Hisseler Volatil

```
Claim: CELISKILI: VIX ~16 ile tarihsel ortalamanin (%18.54) altinda ve "sakin" olarak siniflandirilirken, bireysel hisselerde (LITE, DELL, MRVL, SMCI) son derece yuksek volatilite gozleniyor. [^414^][^999^]
Source: Cboe / MarketChameleon
URL: Multiple
Date: 2026-06-03
Excerpt: VIX 16.09, LITE HV 91.7%, DELL HV 81.7%
Context: Bu ayrism VIX'in S&P 500 opsiyonlarina dayali olmasindan ve bireysel hisselerdeki sektorel volatilitenin farkli dinamiklere sahip olmasindan kaynaklaniyor.
Confidence: high
```

### 9.2 Implied vs Historical Volatilite Uyusmazligi

| Ticker | IV | HV | Yorum |
|--------|-----|-----|-------|
| INTC | 79.3% | 91.3% | IV < HV (opsiyon piyasasi "ucuz") |
| COHR | 89.9% | 86.3% | IV > HV (opsiyon piyasasi "pahali") |
| DELL | 74.8% | 81.7% | IV < HV |
| LITE | 90-94% | 91.7% | IV ~ HV (dengeli) |

### 9.3 Short Interest Trendleri

```
Claim: CELISKILI: ONDS short interest %31.33'e duserken (onceki %34.19'dan), hala squeeze potansiyeli tasiyor ancak short baskisi azaliyor [^1028^][^1026^]
Source: MarketBeat / Finviz
URL: https://marketbeat.com/stocks/NASDAQ/ONDS/short-interest/
Date: 2026-05-30
Excerpt: "ONDS Short Interest: 31.33% (decrease of 7.03% from previous)"
Context: Short interest azaliyor ama hala cok yuksek seviyede.
Confidence: high
```

### 9.4 Volume Interpretasyonlari

| Ticker | Fiyat | Hacim | Farkli Yorumlar |
|--------|-------|-------|----------------|
| MRVL | +32.52% | 3.2x | Bullish: Earnings super beat. Bearish: Short covering? |
| HPE | +19.47% | 6.6x | Bullish: Buyout rumor? Bearish: Distribution? |
| NU | -8.16% | 3.3x | Bearish: Heavy selling. Bullish: Capitulation bottom? |

---

## 10. Sector Volatilite Karsilastirmasi

```
Claim: 2026 sektor volatilite karsilastirmasi: Enerji %3.1 (En yuksek), Teknoloji %2.8, Saglik %2.3, Finans %1.9, Utilities %1.2 (En dusuk) [^932^]
Source: VT Markets
URL: https://www.vtmarkets.com/discover/average-true-range-atr-indicator-guide/
Date: 2026-01-20
Excerpt: "Technology: 2.8% (High), Energy: 3.1% (High), Financials: 1.9% (Moderate), Utilities: 1.2% (Low)"
Context: Teknoloji ve enerji sektorleri en volatil sektorler.
Confidence: medium
```

---

## 11. ATR ve Volatilite Siniflandirmasi

### 11.1 ATR% Siniflandirmasi

| ATR% | Volatilite Sinifi | Hisse Ornekleri |
|------|-------------------|-----------------|
| < 1% | Cok dusuk | KO, PG, JNJ |
| 1-3% | Dusuk-Orta | SPY, AAPL, MSFT |
| 3-5% | Orta-Yuksek | NVDA, TSLA, AMD |
| 5-10% | Yuksek | MSTR, PLUG, ONDS |
| > 10% | Asiri yuksek | RGTI, penny stocks |

```
Claim: NVDA ATR% 3.52 ile "orta-yuksek" volatilite sinifinda. MSTR, DELL, COHR "yuksek" volatilite sinifinda (>5% ATR%) [^978^]
Source: Barchart / TradingView
URL: Multiple
Date: 2026-06-03
Excerpt: "NVDA 14-Day ATR%: 3.52%"
Context: Bu siniflandirma pozisyon buyuklugu belirleme ve risk yonetimi icin kritik.
Confidence: high
```

---

## 12. Kaynaklar ve Referanslar

### Web Aramasi Kaynaklari:
1. [^414^] Cboe VIX Products - https://www.cboe.com/en/tradable-products/vix/
2. [^924^] Yahoo Finance Most Active - https://finance.yahoo.com/markets/stocks/most-active/
3. [^925^] MarketWatch VIX - https://www.marketwatch.com/investing/index/vix
4. [^929^] Chartmill Short Screener - https://www.chartmill.com/stock/markets/usa/screener/most-shorted-stocks
5. [^930^] BestBrokers Volume Stats - https://www.bestbrokers.com/stock-trading/stock-trading-market-statistics/
6. [^932^] VT Markets ATR Guide - https://www.vtmarkets.com/discover/average-true-range-atr-indicator-guide/
7. [^933^] MarketBeat SMCI SI - https://www.marketbeat.com/stocks/NASDAQ/SMCI/short-interest/
8. [^936^] OptionCharts DELL - https://optioncharts.io/options/DELL
9. [^937^] StocksToTrade SMCI News - https://stockstotrade.com/news/super-micro-computer-inc-smci-news-2026_04_02/
10. [^940^] AlphaQuery DELL HV - https://www.alphaquery.com/stock/DELL/volatility-option-statistics/30-day/historical-volatility
11. [^945^] OptionCharts MSTR - https://optioncharts.io/options/MSTR
12. [^946^] Cboe VIX Futures - https://www.cboe.com/en/tradable-products/vix/vix-futures/
13. [^948^] MarketBeat HOOD SI - https://www.marketbeat.com/stocks/NASDAQ/HOOD/short-interest/
14. [^950^] CoinDesk MSTR Vol - https://www.coindesk.com/markets/2025/06/24/strategy-stock-volatility-sinks-to-historic-lows-possibly-making-shares-less-attractive
15. [^954^] TradingEconomics VIX - https://tradingeconomics.com/united-states/cboe-volatility-index-vix-fed-data.html
16. [^955^] Volume-Price Analysis - https://www.cashbackisl.com/en/volume-price-relationship-guide-2/
17. [^959^] LITE vs COHR Vol - https://portfolioslab.com/tools/stock-comparison/LITE/COHR
18. [^960^] USNews Short Squeeze - https://money.usnews.com/investing/articles/short-squeeze-stocks-that-could-take-off
19. [^965^] Yahoo Most Shorted - https://finance.yahoo.com/research-hub/screener/most_shorted_stocks/
20. [^968^] Yahoo AVGO - https://finance.yahoo.com/quote/AVGO/
21. [^971^] Yahoo Market News - https://sg.finance.yahoo.com/news/stock-market-news-jun-2-130600173.html
22. [^974^] Cryptonomist NVDA - https://en.cryptonomist.ch/2026/06/03/nvidia-stock-holds-bullish-trend-but-momentum-stalls-at-232-resistance/
23. [^975^] Kavout INTC Vol - https://www.kavout.com/market-lens/what-s-driving-intel-s-recent-volatility
24. [^978^] Barchart NVDA Tech - https://www.barchart.com/stocks/quotes/NVDA/technical-analysis
25. [^979^] Yahoo INTC Options - https://finance.yahoo.com/markets/options/articles/options-traders-betting-increasingly-diverging-153011910.html
26. [^980^] Barchart NVDA Puts - https://www.barchart.com/story/news/32376419/unusual-activity-in-nvidia-put-options-ahead-of-earnings-are-investors-still-bullish
27. [^986^] MarketChameleon INTC IV - https://marketchameleon.com/Overview/INTC/IV/
28. [^989^] OptionCharts NVDA EM - https://optioncharts.io/options/NVDA/expected-move
29. [^993^] UnusualWhales DELL - https://unusualwhales.com/stock/DELL/volatility
30. [^996^] MarketChameleon COHR IV - https://marketchameleon.com/Overview/COHR/IV/
31. [^997^] AlphaQuery COHR HV - https://www.alphaquery.com/stock/COHR/volatility-option-statistics
32. [^999^] MarketChameleon LITE - https://marketchameleon.com/Overview/LITE
33. [^1005^] AlphaQuery LITE HV - https://www.alphaquery.com/stock/LITE/volatility-option-statistics
34. [^1017^] StateStreet Vol - https://www.statestreet.com/au/en/insights/market-calm-policy-noise-volatility-repricing
35. [^1018^] MarketChameleon SMCI Earn - https://marketchameleon.com/Overview/SMCI/Earnings/Earnings-Charts/
36. [^1019^] MarketChameleon SMCI IV - https://marketchameleon.com/Overview/SMCI/IV/
37. [^1020^] AllianzGI Vol Regime - https://hk.allianzgi.com/documents/AllianzGI-Volatility-short-version-Boess-Krayzler-Stamos-EN-2026
38. [^1022^] Yahoo Gainers - https://finance.yahoo.com/markets/stocks/gainers/
39. [^1028^] MarketBeat ONDS SI - https://www.marketbeat.com/stocks/NASDAQ/ONDS/short-interest/
40. [^1044^] AlphaQuery HOOD IV - https://www.alphaquery.com/stock/HOOD/volatility-option-statistics/20-day/iv-mean
41. [^1045^] Fidelity A/D - https://www.fidelity.com/learning-center/trading-investing/advance-decline
42. [^1047^] GuruFocus VIX - https://www.gurufocus.com/economic_indicators/234/vix
43. [^1050^] OptionCharts HOOD - https://optioncharts.io/options/HOOD
44. [^1052^] MarketChameleon HOOD IV - https://marketchameleon.com/Overview/HOOD/IV/
45. [^1055^] Robinhood Metrics - https://www.threads.com/@stockmktnewz/post/DWhxSFyD5Pl/
46. [^1073^] IBD MRVL Options - https://www.investors.com/research/options/marvell-mrvl-stock-earnings-volatility-cash-secured-put-options/
47. [^1076^] MarketBeat PLUG SI - https://www.marketbeat.com/stocks/NASDAQ/PLUG/short-interest/
48. [^1079^] OptionCharts AMD - https://optioncharts.io/options/AMD
49. [^1081^] OptionSlam MRVL - https://www.optionslam.com/earnings/stocks/MRVL
50. [^1083^] MarketChameleon MRVL Earn - https://marketchameleon.com/Overview/MRVL/Earnings/Earnings-Charts/

---

## 13. Sonuc ve Ana Bulgular

### Ana Bulgular:

1. **VIX ~16 ile "sakin" seviyelerde** ancak bireysel hisselerde volatilite cok yuksek - bu bir **aYRISMA** gostergesi

2. **En yuksek hacimli hisseler:** NU (171.6M), NVDA (164.5M), HPE (147.1M), NOK (123.7M), MRVL (93.1M)

3. **En volatil hisseler (IV bazinda):** DELL (80%), SMCI (87-110%), COHR (90%), LITE (90-94%), INTC (79%)

4. **Short squeeze potansiyeli:** ONDS (%31.33 SI), PLUG (%24.76), SMCI (%16.10), INDI (%31.2), SLS (%32.2)

5. **Options aktivitesi en yuksek:** HOOD (331% ort.), NVDA, DELL (166% ort.), MSTR (140% ort.)

6. **Volume-Price Confirmation:** HPE (+19.47% / 6.6x hacim) saglam, MRVL (+32.52% / 3.2x) earnings-driven

7. **Celiskili sinyal:** VIX dusuk ama bireysel hisselerde volatilite cok yuksek; IV/HV oranlari hisseden hisseye buyuk farklilik gosteriyor

8. **2026 volatilite rejimi:** "Elevator up, elevator down" paterni hakim - ani ve sert hareketler bekleniyor

### Risk Uyarilari:
- VIX'in dusuk olmasi "guvenli" anlamina gelmeyebilir (sinyal kalitesi zayifligi)
- Yuksek short interest'li hisselerde ani squeeze'ler mumkun
- Implied volatilitenin IV rank/percentile'ine gore opsiyon stratejileri secilmeli
- Hacim-fiyat divergence trend reversal icin oncu sinyal olabilir

---

*Rapor Tarihi: 3 Haziran 2026*
*Toplam Arama Sayisi: 25+
*Veri Kaynaklari: Yahoo Finance, MarketWatch, Cboe, MarketBeat, Barchart, OptionCharts, MarketChameleon, AlphaQuery, UnusualWhales, TipRanks, Chartmill, TradingView, Fidelity, State Street, AllianzGI, Penn Mutual*
