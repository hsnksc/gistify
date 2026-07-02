---
contract: coverage-md/1
ticker: CRWV
company: CoreWeave, Inc.
exchange: NASDAQ
sector: AI Infrastructure
date: 2026-07-02
type: earnings-option-play
signal: SPEC-BULLISH
metrics:
  price: 85.69
  price_date: 2026-07-01
  change_pct: -13.92
  low52: 63.80
  high52: 166.22
  target_avg: 143.41
  earnings_date: 2026-08-11
  earnings_approx: true
  option_expiry: 2026-08-21
  iv: 96.2
  iv_rank: 31.7
  short_float: 15.42
  rsi: 37.98
  sma50: 110.42
  sma200: 100.48
  budget: 150
strategy:
  name: 130/150 Call Debit Spread
  legs: 1x Long 130C + 1x Short 150C @ 2026-08-21
  cost: 148
  max_gain: 1852
  max_loss: 148
  breakeven: 131.48
---

# CoreWeave (CRWV) — Q2 Earnings Opsiyon Stratejisi

|  |  |
|---|---|
| **Rapor Tarihi** | 2026-07-02 |
| **Mevcut Fiyat** | 85.69 USD |
| **Fiyat Değişimi** | -13.92% |
| **52 Haftalık Aralık** | 63.80 – 166.22 USD |
| **Earnings Tarihi** | ~2026-08-11 |
| **Opsiyon Vadesi** | 2026-08-21 |
| **Analyst Hedef Ortalama** | 143.41 USD |
| **IV (Mutlak)** | 96.2% |
| **Short % of Float** | 15.42% |
| **Bütçe** | 150 USD |

## 1. Executive Summary

CRWV, 99.4B USD kontratlı backlog'a rağmen Nisan zirvesinden %48 gerilemiş durumda. Düşüşü insider satışları, 15.42% short float ve faiz baskısı sürüklüyor. Earnings beat + squeeze kombinasyonu asimetrik bir upside senaryosu yaratıyor.

> **STRATEJİ:** 130/150 Call Debit Spread (CRWV · vade 2026-08-21)
> **Kurulum:** 1x Long 130 Call + 1x Short 150 Call
> **Maliyet:** 148 USD
> **Max Gain:** 1,852 USD
> **Max Loss:** 148 USD
> **Breakeven:** 131.48 USD
> **Hedef:** 150.00 USD ve üzeri

> ⚠️ 150 USD bütçeyle 10x hedefi bir "lottery ticket" profilidir; sermayenin tamamını kaybetme olasılığı yüksektir. Bu rapor yatırım tavsiyesi değildir.

## 2. Teknik Durum & Seviyeler

Fiyat SMA 50 (110.42) ve SMA 200 (100.48) altında; RSI 37.98 ile oversold sınırında. 80.00 USD psikolojik desteği kritik pivot.

| Seviye | Tür | Güç | Gerekçe |
|---|---|---|---|
| 63.80 | Destek | ★★★★★ | 52 haftalık dip |
| 80.00 | Destek | ★★★★ | Yuvarlak sayı + put writer savunması |
| 85.00 | Pivot | ★★★★ | Mevcut fiyat, ATM strike |
| 100.00 | Direnç | ★★★★ | SMA 200 + psikolojik seviye |
| 110.00 | Direnç | ★★★★ | SMA 50 + yüksek açık pozisyon |
| 150.00 | Direnç | ★★★ | Strateji hedefi, zirve öncesi eşik |

> **Not:** 80.00 USD altı günlük kapanış, bir sonraki desteğin 63.80 olduğu bearish senaryoyu açar.

## 3. Earnings Geçmişi & Konsensus

| Dönem | EPS Tahmin | EPS Gerçek | Sürpriz | Revenue Gerçek | Fiyat Tepkisi |
|---|---|---|---|---|---|
| Q3 2025 | -0.48 | -0.22 | +54.4% | 1.365B USD | +5.99% |
| Q4 2025 | -0.68 | -0.89 | -30.0% | 1.572B USD | — |
| Q1 2026 | -1.20 | -1.40 | -16.3% | 2.08B USD | — |

| Metrik | Konsensus | Düşük | Yüksek | Analist Sayısı |
|---|---|---|---|---|
| Q2 Revenue | 2.56B USD | 2.50B USD | 2.69B USD | 29 |
| Q2 EPS | -1.25 | -1.68 | -0.67 | 16 |

Revenue 4 çeyrektir beat ediyor; EPS tarafı zayıf. Piyasa tepkisi gelir büyümesi ve guidance'a duyarlı.

## 4. Ekosistem & İlişkili Hisseler

| Şirket | Ticker | İlişki | Önem | Detay |
|---|---|---|---|---|
| Meta Platforms | META | En büyük müşteri | 🔴 Kritik | 35.2B USD toplam taahhüt, 2032'ye kadar |
| NVIDIA | NVDA | GPU tedarikçisi + müşteri | 🔴 Kritik | Elite Partner; 6.3B USD kapasite alımı |
| Microsoft | MSFT | Müşteri + rakip | 🟠 Yüksek | ~10B USD overflow kapasite, Azure rekabeti |
| OpenAI | Özel | Training müşterisi | 🔴 Kritik | ~22.4B USD, 5 yıllık |
| Vertiv | VRT | Soğutma ve güç altyapısı | 🔴 Kritik | AI veri merkezi fiziksel katmanı |

NVDA ve META sonuçları, CRWV earnings öncesi en güçlü öncü göstergelerdir.

## 5. Opsiyon Yapısı

**Expected Move:** ±18.4% (±15.84 USD)

| Strike | Bid | Ask | Volume | IV | Delta |
|---|---|---|---|---|---|
| 80.00 | 15.12 | 15.93 | 190 | 109.6% | 0.63 |
| 85.00 | 12.84 | 13.14 | 609 | 106.9% | 0.57 |
| 90.00 | 10.40 | 10.79 | 992 | 103.2% | 0.51 |
| 100.00 | 7.49 | 7.54 | 12,830 | 103.2% | 0.40 |
| 120.00 | 3.38 | 3.65 | 3,177 | 101.5% | 0.23 |
| 130.00 | 2.19 | 2.56 | 635 | 100.9% | 0.17 |
| 150.00 | 1.08 | 1.26 | 481 | — | — |

| Kriter | 130/150 Spread | 150 Call | 120/140 Spread |
|---|---|---|---|
| Net Maliyet | 148 USD | 126 USD | 214 USD |
| Max Gain | 1,852 USD | Sınırsız | 1,786 USD |
| 10x Hedefi | ✅ | ✅ | ✅ |
| IV Crush Dayanıklılığı | ✅ | ❌ | ✅ |
| 150 USD Bütçeye Uygun | ✅ | ✅ | ❌ |
| Öneri | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ❌ |

| Senaryo | Hisse Hedefi | Spread P&L | Not |
|---|---|---|---|
| Strong Beat + Guidance Raise | 150 – 180 USD | +1,852 USD | Max gain, squeeze desteği |
| Modest Beat | 120 – 140 USD | 0 – +852 USD | Kısmi kâr bölgesi |
| In-Line | 95 – 110 USD | -148 USD | Spread değersiz |
| Miss | 70 – 80 USD | -148 USD | Max loss |

| Hisse Fiyatı | P&L | ROI | Durum |
|---|---|---|---|
| 86.00 | -148 USD | -100% | ❌ Max loss |
| 120.00 | -148 USD | -100% | ❌ Breakeven altı |
| 130.00 | -148 USD | -100% | ❌ Breakeven altı |
| 135.00 | +352 USD | +238% | ✅ Kârlı |
| 140.00 | +852 USD | +576% | ✅ Kârlı |
| 150.00 | +1,852 USD | +1,251% | ✅ Max gain |
| 160.00 | +1,852 USD | +1,251% | ✅ Max gain (tavanlı) |

## 6. Katalizör Takvimi

| Katalizör | Etki | Önem | Durum |
|---|---|---|---|
| Meta 21B USD sözleşme genişlemesi | Pozitif | ★★★★★ | Aktif, 2032'ye kadar |
| Insider satışları | Negatif | ★★★★ | 10b5-1 planlı, 100 – 130 USD bandında |
| Short interest 15.42% | Çift Yönlü | ★★★★ | Aylık +26.4% artış, squeeze potansiyeli |

| Tarih | Olay | Önem |
|---|---|---|
| 2026-07-28 | **FOMC toplantısı ve Powell konferansı** | 🔴 Kritik |
| 2026-07-29 | NVDA Q1 FY2027 earnings | 🟠 Yüksek |
| 2026-08-05 | Short interest raporu | 🟡 Orta |
| 2026-08-07 | META Q2 earnings | 🟠 Yüksek |
| 2026-08-11 | **CRWV Q2 earnings** | 🔴 Kritik |
| 2026-08-12 | CPI verisi (Temmuz) | 🟡 Orta |
| 2026-08-21 | Opsiyon vadesi | 🟠 Yüksek |

## 7. Takip & Bayraklar

### Kırmızı Bayraklar

- [ ] CRWV günlük kapanışı 80.00 USD altına inerse
- [ ] CEO veya CFO 85 USD altında yeni satış bildirirse
- [ ] Meta anlaşmasında iptal veya gecikme haberi çıkarsa
- [ ] NVDA earnings çağrısında talep yavaşlaması sinyali verilirse

### Yeşil Bayraklar

- [ ] CRWV 90.00 USD üzerinde yüksek hacimle kapanırsa
- [ ] META earnings AI capex artışı duyurursa
- [ ] Short interest 12% altına düşerse (covering başlangıcı)
- [ ] Yeni büyük müşteri duyurusu gelirse

## 8. Sonuç & Olasılıklar

Spread yapısı, 150 USD bütçeyle 10x hedefini teknik olarak mümkün kılan tek kurgu; IV crush'a tekli OTM call'dan belirgin şekilde daha dayanıklı. Beklenti dağılımı gerçekçi tutulmalı.

- %70 olasılık: Hisse 130 USD altında kalır, spread değersiz kapanır, kayıp 148 USD
- %20 olasılık: 130 – 150 USD aralığı, kâr 200 – 1,000 USD
- %8 olasılık: 150 USD üzeri kapanış, max gain 1,852 USD
- %2 olasılık: 170 USD üzeri squeeze, spread yine tavanlı 1,852 USD

## 9. Kaynaklar

| Kaynak | URL | Zaman Damgası |
|---|---|---|
| Yahoo Finance — CRWV quote | https://finance.yahoo.com/quote/CRWV/ | 2026-07-01 |
| MarketBeat — Short Interest | https://www.marketbeat.com/stocks/NASDAQ/CRWV/short-interest/ | 2026-06-25 |
| Alpaca Markets — Opsiyon Zinciri | https://data.alpaca.markets/ | 2026-07-01 |
| CoreWeave IR — Meta anlaşması | https://www.coreweave.com/news/ | 2026-04-09 |

Bu rapor bilgilendirme amaçlıdır ve yatırım tavsiyesi değildir. Opsiyon işlemleri yüksek risk içerir; sermayenin tamamını kaybetme riski vardır.
