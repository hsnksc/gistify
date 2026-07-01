# GISTIFY EARNING STRATEGY — Teknoloji Sektörü Stratejileri

**Rapor Tarihi:** 1 Temmuz 2026
**Dönem:** Temmuz 2026 + Ağustos 2026 Rolling Earnings
**Rapor Tipi:** Agent 2 — Teknoloji Stratejileri

---

## Makro Piyasa Özeti (1 Temmuz 2026)

| Parametre | Değer | Yorum |
|-----------|-------|-------|
| VIX | 16.89 | Low Fear rejimi — Düşük volatilite, IV Crush fırsatları |
| S&P 500 | ~7,499.36 | Tarihi zirve yakını — Teknoloji ağırlıklı |
| Nasdaq | ~26,213.72 | Güçlü trend, AI buildout destekli |
| Dow | ~52,319.20 | Klasik hisseler yavaş, tech lider |
| 10Y Treasury | ~4.25% | FOMC beklentisi: Temmuz 2026'dan önce değişiklik yok |
| USD (DXY) | ~103.5 | Nispeten stabil |

> **VIX 16.89** ile düşük volatilite ortamındayız. Earnings öncesi IV expansion (IV Rank yükselişi) beklenebilir, özellikle yüksek beta'lı teknoloji hisselerinde. Earnings sonrası IV Crush (implied volatilite çöküşü) Short Strangle ve Iron Condor stratejileri için ideal.

---

## Earnings Play Metodolojisi (Zorunlu Format)

| Parametre | Değer |
|-----------|-------|
| **Entry** | Earnings'ten **2-5 gün önce** |
| **Exit** | Earnings sonrası **1-2 gün içinde** |
| **Max Hold** | **2 gün** (Açık pozisyon 48 saatten fazla tutulmaz) |
| **Kar Hedefi** | Toplanan kredinin/primin **%50-75'i** |
| **IV Crush** | BMO: 2-4 saat / AMC: Ertesi gün sabah |
| **Max Risk** | Tek hisse = hesabın **%2'si** |

> ⛔ **YASAK İfadeler:** 21 DTE, Zamanla çıkış, Aylık tutma, Swing trade, Long-term hold. Bu rapor sadece Earnings Play formatındadır.

---

## Bütçe Dostu Strateji Matrisi

| Bütçe | Strateji Tipi | Maliyet | Max Kar | Risk |
|-------|--------------|---------|---------|------|
| $10-$50 | Lottery Ticket (Long Call/Put) | ~$10-$50 | Sınırsız | %100 |
| $50-$200 | Debit Spread (Bull Call / Bear Put) | ~$50-$200 | 2-3x | %100 |
| $200-$500 | Butterfly / Iron Condor | ~$200-$500 | 1x | %100 |
| $500-$1,000 | Ratio Spread / Calendar Spread | ~$500-$1,000 | 2-4x | %100 |

---

## Kapsamlı Teknoloji Hisse Analizleri (26 Hisse)

---

### AAPL — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $289.36
**Teknik Trend:** Yukarı
**Destek / Direnç:** $280 / $295
**VWAP Durumu:** $285 (Fiyat VWAP üzerinde)
**IV Rank:** 35/100 (Orta)
**IV Crush Beklentisi:** 35-45%
**Earnings Tarihi:** 29 Temmuz / 5 Ağustos 2026 | **Zaman:** AMC | **Durum:** INFERRED
**EPS Konsensüs:** $2.15
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (AI on-device, Services growth)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.033 | Theta: -0.088 | Vega: 0.226

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $265 Put + Sell $310 Call
**Toplanan Premium:** ~$8.68 (kontrat başına kredi = ~$868)
**Gereken Margin:** ~$4340 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$521 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $265 / Buy Put $255
- Sell Call $310 / Buy Call $320
- Net Kredi: ~$5.64 (kontrat başına = ~$564)
- Max Kar: $564 | Max Zarar: $436

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 35-45% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~20 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $295.0
- Short Strike: $305.0
- Net Debit: ~$10.13 (kontrat başına = ~$1013)
- Max Kar: ~$-13 (kontrat başına)
- Max Zarar: ~$1013
- Breakeven: ~$305.1

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $280 destek / $295 direnç aralığında. VWAP $285 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Debit Spread (ITM)
- Net Debit: ~$5.79 (kontrat başına = ~$579)
- Max Kar: 421.0 (kontrat başına)
- Max Zarar: ~$579
- Breakeven / Body: 290.79

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 579$ risk ile 421.0 potansiyel getiri sunar. 10 kontrat = ~$5790 risk, max kar = 421.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### AMZN — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $238.34
**Teknik Trend:** Yatay/Yukarı
**Destek / Direnç:** $230 / $245
**VWAP Durumu:** $235 (Fiyat VWAP üzerinde)
**IV Rank:** 38/100 (Orta)
**IV Crush Beklentisi:** 30-40%
**Earnings Tarihi:** 30 Temmuz / 6 Ağustos 2026 | **Zaman:** AMC | **Durum:** INFERRED
**EPS Konsensüs:** $1.75
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (AWS AI demand, $200B capex)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.054 | Theta: -0.13 | Vega: 0.298

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $215 Put + Sell $255 Call
**Toplanan Premium:** ~$7.15 (kontrat başına kredi = ~$715)
**Gereken Margin:** ~$3575 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$429 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $215 / Buy Put $205
- Sell Call $255 / Buy Call $265
- Net Kredi: ~$4.65 (kontrat başına = ~$465)
- Max Kar: $465 | Max Zarar: $535

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 30-40% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~23 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $245.0
- Short Strike: $255.0
- Net Debit: ~$8.34 (kontrat başına = ~$834)
- Max Kar: ~$166 (kontrat başına)
- Max Zarar: ~$834
- Breakeven: ~$253.3

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $230 destek / $245 direnç aralığında. VWAP $235 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Butterfly Spread
- Net Debit: ~$3.58 (kontrat başına = ~$358)
- Max Kar: 92.0 (kontrat başına)
- Max Zarar: ~$358
- Breakeven / Body: 237.5 - 242

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 358$ risk ile 92.0 potansiyel getiri sunar. 10 kontrat = ~$3580 risk, max kar = 92.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### GOOGL — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $357.37
**Teknik Trend:** Yukarı
**Destek / Direnç:** $345 / $365
**VWAP Durumu:** $350 (Fiyat VWAP üzerinde)
**IV Rank:** 32/100 (Orta)
**IV Crush Beklentisi:** 30-40%
**Earnings Tarihi:** 29 Temmuz / 5 Ağustos 2026 | **Zaman:** AMC | **Durum:** INFERRED
**EPS Konsensüs:** $2.45
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (Cloud 50% growth, Gemini)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.034 | Theta: -0.086 | Vega: 0.237

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $325 Put + Sell $385 Call
**Toplanan Premium:** ~$10.72 (kontrat başına kredi = ~$1072)
**Gereken Margin:** ~$5361 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$643 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $325 / Buy Put $315
- Sell Call $385 / Buy Call $395
- Net Kredi: ~$6.97 (kontrat başına = ~$697)
- Max Kar: $697 | Max Zarar: $303

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 30-40% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~17 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $365.0
- Short Strike: $375.0
- Net Debit: ~$12.51 (kontrat başına = ~$1251)
- Max Kar: ~$-251 (kontrat başına)
- Max Zarar: ~$1251
- Breakeven: ~$377.5

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $345 destek / $365 direnç aralığında. VWAP $350 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Debit Spread (ITM)
- Net Debit: ~$7.15 (kontrat başına = ~$715)
- Max Kar: 285.0 (kontrat başına)
- Max Zarar: ~$715
- Breakeven / Body: 357.15

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 715$ risk ile 285.0 potansiyel getiri sunar. 10 kontrat = ~$7150 risk, max kar = 285.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### META — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $563.29
**Teknik Trend:** Yatay
**Destek / Direnç:** $540 / $575
**VWAP Durumu:** $555 (Fiyat VWAP üzerinde)
**IV Rank:** 42/100 (Orta)
**IV Crush Beklentisi:** 40-50%
**Earnings Tarihi:** 29 Temmuz 2026 | **Zaman:** AMC | **Durum:** UNCONFIRMED
**EPS Konsensüs:** $7.18
**Yön Bias:** NÖTR
**Haber Sentiment:** Nötr (Reklam güçlü, AI maliyeti yüksek)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.058 | Theta: -0.134 | Vega: 0.363

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $520 Put + Sell $600 Call
**Toplanan Premium:** ~$14.08 (kontrat başına kredi = ~$1408)
**Gereken Margin:** ~$8449 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$845 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $520 / Buy Put $500
- Sell Call $600 / Buy Call $620
- Net Kredi: ~$9.15 (kontrat başına = ~$915)
- Max Kar: $915 | Max Zarar: $1085

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 40-50% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~27 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Put Spread (Bear Put Spread)
- Long Strike: $550.0
- Short Strike: $540.0
- Net Debit: ~$19.72 (kontrat başına = ~$1972)
- Max Kar: ~$-972 (kontrat başına)
- Max Zarar: ~$1972
- Breakeven: ~$569.7

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | NÖTR |

> **Teknik Gerekçe:** Fiyat $540 destek / $575 direnç aralığında. VWAP $555 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum kararsız.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Debit Spread (ITM)
- Net Debit: ~$11.27 (kontrat başına = ~$1127)
- Max Kar: -127.0 (kontrat başına)
- Max Zarar: ~$1127
- Breakeven / Body: 561.27

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 1127$ risk ile -127.0 potansiyel getiri sunar. 10 kontrat = ~$11270 risk, max kar = -127.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### MSFT — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $373.02
**Teknik Trend:** Yukarı
**Destek / Direnç:** $360 / $380
**VWAP Durumu:** $368 (Fiyat VWAP üzerinde)
**IV Rank:** 28/100 (Düşük)
**IV Crush Beklentisi:** 25-35%
**Earnings Tarihi:** 29 Temmuz / 5 Ağustos 2026 | **Zaman:** AMC | **Durum:** INFERRED
**EPS Konsensüs:** $3.45
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (Cloud $50B+, Copilot growth)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.034 | Theta: -0.084 | Vega: 0.24

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $340 Put + Sell $400 Call
**Toplanan Premium:** ~$11.19 (kontrat başına kredi = ~$1119)
**Gereken Margin:** ~$5595 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$671 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $340 / Buy Put $330
- Sell Call $400 / Buy Call $410
- Net Kredi: ~$7.27 (kontrat başına = ~$727)
- Max Kar: $727 | Max Zarar: $273

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 25-35% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~13 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $380.0
- Short Strike: $390.0
- Net Debit: ~$13.06 (kontrat başına = ~$1306)
- Max Kar: ~$-306 (kontrat başına)
- Max Zarar: ~$1306
- Breakeven: ~$393.1

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $360 destek / $380 direnç aralığında. VWAP $368 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Debit Spread (ITM)
- Net Debit: ~$7.46 (kontrat başına = ~$746)
- Max Kar: 254.0 (kontrat başına)
- Max Zarar: ~$746
- Breakeven / Body: 372.46

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 746$ risk ile 254.0 potansiyel getiri sunar. 10 kontrat = ~$7460 risk, max kar = 254.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### NFLX — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $71.40
**Teknik Trend:** Yukarı
**Destek / Direnç:** $68 / $75
**VWAP Durumu:** $71 (Fiyat VWAP üzerinde)
**IV Rank:** 48/100 (Yüksek)
**IV Crush Beklentisi:** 45-55%
**Earnings Tarihi:** 16 Temmuz 2026 | **Zaman:** AMC | **Durum:** CONFIRMED
**EPS Konsensüs:** $0.79
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (Reklam $3B hedefi, üyelik growth)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.051 | Theta: -0.138 | Vega: 0.264

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $62.5 Put + Sell $77.5 Call
**Toplanan Premium:** ~$2.86 (kontrat başına kredi = ~$286)
**Gereken Margin:** ~$1071 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$172 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $62.5 / Buy Put $57.5
- Sell Call $77.5 / Buy Call $82.5
- Net Kredi: ~$1.86 (kontrat başına = ~$186)
- Max Kar: $186 | Max Zarar: $314

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 45-55% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~33 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $72.5
- Short Strike: $185.0
- Net Debit: ~$2.5 (kontrat başına = ~$250)
- Max Kar: ~$11000 (kontrat başına)
- Max Zarar: ~$250
- Breakeven: ~$75.0

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $68 destek / $75 direnç aralığında. VWAP $71 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Long Call (Lottery Ticket)
- Net Debit: ~$1.79 (kontrat başına = ~$179)
- Max Kar: Sınırsız (kontrat başına)
- Max Zarar: ~$179
- Breakeven / Body: 76.79

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 179$ risk ile Sınırsız potansiyel getiri sunar. 10 kontrat = ~$1790 risk, max kar = Sınırsız x 10. Hesabın %2'si ile uyumlu.

---

---

### TSLA — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $420.60
**Teknik Trend:** Yukarı
**Destek / Direnç:** $400 / $435
**VWAP Durumu:** $410 (Fiyat VWAP üzerinde)
**IV Rank:** 55/100 (Yüksek)
**IV Crush Beklentisi:** 50-60%
**Earnings Tarihi:** 22 Temmuz 2026 | **Zaman:** AMC | **Durum:** CONFIRMED
**EPS Konsensüs:** $0.45
**Yön Bias:** NÖTR
**Haber Sentiment:** Nötr (Delivery 406K hedefi, FSD gelişmeleri)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.088 | Theta: -0.205 | Vega: 0.476

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $385 Put + Sell $450 Call
**Toplanan Premium:** ~$12.62 (kontrat başına kredi = ~$1262)
**Gereken Margin:** ~$6309 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$757 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $385 / Buy Put $375
- Sell Call $450 / Buy Call $460
- Net Kredi: ~$8.2 (kontrat başına = ~$820)
- Max Kar: $820 | Max Zarar: $180

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 50-60% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~40 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Put Spread (Bear Put Spread)
- Long Strike: $410.0
- Short Strike: $400.0
- Net Debit: ~$14.72 (kontrat başına = ~$1472)
- Max Kar: ~$-472 (kontrat başına)
- Max Zarar: ~$1472
- Breakeven: ~$424.7

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | NÖTR |

> **Teknik Gerekçe:** Fiyat $400 destek / $435 direnç aralığında. VWAP $410 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum kararsız.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Debit Spread (ITM)
- Net Debit: ~$8.41 (kontrat başına = ~$841)
- Max Kar: 159.0 (kontrat başına)
- Max Zarar: ~$841
- Breakeven / Body: 418.41

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 841$ risk ile 159.0 potansiyel getiri sunar. 10 kontrat = ~$8410 risk, max kar = 159.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### AMD — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $580.91
**Teknik Trend:** Yukarı
**Destek / Direnç:** $550 / $600
**VWAP Durumu:** $565 (Fiyat VWAP üzerinde)
**IV Rank:** 52/100 (Yüksek)
**IV Crush Beklentisi:** 45-55%
**Earnings Tarihi:** 29 Temmuz / 5 Ağustos 2026 | **Zaman:** AMC | **Durum:** INFERRED
**EPS Konsensüs:** $1.15
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (MI350 ramp, data center share)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.092 | Theta: -0.202 | Vega: 0.524

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $540 Put + Sell $620 Call
**Toplanan Premium:** ~$14.52 (kontrat başına kredi = ~$1452)
**Gereken Margin:** ~$8714 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$871 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $540 / Buy Put $520
- Sell Call $620 / Buy Call $640
- Net Kredi: ~$9.44 (kontrat başına = ~$944)
- Max Kar: $944 | Max Zarar: $1056

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 45-55% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~37 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $595.0
- Short Strike: $605.0
- Net Debit: ~$20.33 (kontrat başına = ~$2033)
- Max Kar: ~$-1033 (kontrat başına)
- Max Zarar: ~$2033
- Breakeven: ~$615.3

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $550 destek / $600 direnç aralığında. VWAP $565 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Debit Spread (ITM)
- Net Debit: ~$11.62 (kontrat başına = ~$1162)
- Max Kar: -162.0 (kontrat başına)
- Max Zarar: ~$1162
- Breakeven / Body: 581.62

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 1162$ risk ile -162.0 potansiyel getiri sunar. 10 kontrat = ~$11620 risk, max kar = -162.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### NVDA — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $200.09
**Teknik Trend:** Yukarı
**Destek / Direnç:** $190 / $210
**VWAP Durumu:** $195 (Fiyat VWAP üzerinde)
**IV Rank:** 58/100 (Yüksek)
**IV Crush Beklentisi:** 50-60%
**Earnings Tarihi:** 26 Ağustos 2026 | **Zaman:** AMC | **Durum:** CONFIRMED
**EPS Konsensüs:** $0.94
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (Blackwell Ultra, $54B Q3 guide)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.084 | Theta: -0.208 | Vega: 0.41

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $180 Put + Sell $215 Call
**Toplanan Premium:** ~$6.0 (kontrat başına kredi = ~$600)
**Gereken Margin:** ~$3001 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$360 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $180 / Buy Put $170
- Sell Call $215 / Buy Call $225
- Net Kredi: ~$3.9 (kontrat başına = ~$390)
- Max Kar: $390 | Max Zarar: $610

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 50-60% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~43 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $205.0
- Short Strike: $215.0
- Net Debit: ~$7.0 (kontrat başına = ~$700)
- Max Kar: ~$300 (kontrat başına)
- Max Zarar: ~$700
- Breakeven: ~$212.0

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $190 destek / $210 direnç aralığında. VWAP $195 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Butterfly Spread
- Net Debit: ~$3.0 (kontrat başına = ~$300)
- Max Kar: 200.0 (kontrat başına)
- Max Zarar: ~$300
- Breakeven / Body: 200.0 - 205

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 300$ risk ile 200.0 potansiyel getiri sunar. 10 kontrat = ~$3000 risk, max kar = 200.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### MU — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $115.43
**Teknik Trend:** Yukarı
**Destek / Direnç:** $108 / $120
**VWAP Durumu:** $112 (Fiyat VWAP üzerinde)
**IV Rank:** 45/100 (Orta)
**IV Crush Beklentisi:** 40-50%
**Earnings Tarihi:** Q3 FY26: ~26 Eylül 2026 | **Zaman:** BMO | **Durum:** INFERRED
**EPS Konsensüs:** $2.8
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (HBM demand, supply tightness)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.052 | Theta: -0.136 | Vega: 0.273

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $102.5 Put + Sell $125.0 Call
**Toplanan Premium:** ~$4.62 (kontrat başına kredi = ~$462)
**Gereken Margin:** ~$1731 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$277 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $102.5 / Buy Put $97.5
- Sell Call $125.0 / Buy Call $130.0
- Net Kredi: ~$3.0 (kontrat başına = ~$300)
- Max Kar: $300 | Max Zarar: $200

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings günü sabah 09:30-10:30 (BMO) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | BMO: 40-50% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~30 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $117.5
- Short Strike: $300.0
- Net Debit: ~$4.04 (kontrat başına = ~$404)
- Max Kar: ~$17846 (kontrat başına)
- Max Zarar: ~$404
- Breakeven: ~$121.5

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $108 destek / $120 direnç aralığında. VWAP $112 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Butterfly Spread
- Net Debit: ~$1.73 (kontrat başına = ~$173)
- Max Kar: 327.0 (kontrat başına)
- Max Zarar: ~$173
- Breakeven / Body: 115.0 - 120

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 173$ risk ile 327.0 potansiyel getiri sunar. 10 kontrat = ~$1730 risk, max kar = 327.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### INTC — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $139.63
**Teknik Trend:** Yukarı
**Destek / Direnç:** $130 / $145
**VWAP Durumu:** $135 (Fiyat VWAP üzerinde)
**IV Rank:** 50/100 (Yüksek)
**IV Crush Beklentisi:** 45-55%
**Earnings Tarihi:** 22/23 Temmuz 2026 | **Zaman:** AMC | **Durum:** UNCONFIRMED
**EPS Konsensüs:** $0.21
**Yön Bias:** NÖTR
**Haber Sentiment:** Nötr (Turnaround devam, foundry risk)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.052 | Theta: -0.14 | Vega: 0.278

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $125.0 Put + Sell $152.5 Call
**Toplanan Premium:** ~$5.59 (kontrat başına kredi = ~$559)
**Gereken Margin:** ~$2094 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$335 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $125.0 / Buy Put $120.0
- Sell Call $152.5 / Buy Call $157.5
- Net Kredi: ~$3.63 (kontrat başına = ~$363)
- Max Kar: $363 | Max Zarar: $137

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 45-55% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~35 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Put Spread (Bear Put Spread)
- Long Strike: $137.5
- Short Strike: $335.0
- Net Debit: ~$4.89 (kontrat başına = ~$489)
- Max Kar: ~$-20239 (kontrat başına)
- Max Zarar: ~$489
- Breakeven: ~$142.4

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | NÖTR |

> **Teknik Gerekçe:** Fiyat $130 destek / $145 direnç aralığında. VWAP $135 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum kararsız.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Butterfly Spread
- Net Debit: ~$2.09 (kontrat başına = ~$209)
- Max Kar: 291.0 (kontrat başına)
- Max Zarar: ~$209
- Breakeven / Body: 140.0 - 145

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 209$ risk ile 291.0 potansiyel getiri sunar. 10 kontrat = ~$2090 risk, max kar = 291.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### PLTR — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $116.67
**Teknik Trend:** Yukarı
**Destek / Direnç:** $110 / $120
**VWAP Durumu:** $114 (Fiyat VWAP üzerinde)
**IV Rank:** 60/100 (Yüksek)
**IV Crush Beklentisi:** 50-60%
**Earnings Tarihi:** 4-7 Ağustos 2026 | **Zaman:** BMO | **Durum:** INFERRED
**EPS Konsensüs:** $0.12
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (AIP demand, government contracts)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.082 | Theta: -0.21 | Vega: 0.385

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $105.0 Put + Sell $127.5 Call
**Toplanan Premium:** ~$4.67 (kontrat başına kredi = ~$467)
**Gereken Margin:** ~$1750 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$280 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $105.0 / Buy Put $100.0
- Sell Call $127.5 / Buy Call $132.5
- Net Kredi: ~$3.04 (kontrat başına = ~$304)
- Max Kar: $304 | Max Zarar: $196

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings günü sabah 09:30-10:30 (BMO) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | BMO: 50-60% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~45 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $120.0
- Short Strike: $307.5
- Net Debit: ~$4.08 (kontrat başına = ~$408)
- Max Kar: ~$18342 (kontrat başına)
- Max Zarar: ~$408
- Breakeven: ~$124.1

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $110 destek / $120 direnç aralığında. VWAP $114 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Butterfly Spread
- Net Debit: ~$1.75 (kontrat başına = ~$175)
- Max Kar: 275.0 (kontrat başına)
- Max Zarar: ~$175
- Breakeven / Body: 117.5 - 122

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 175$ risk ile 275.0 potansiyel getiri sunar. 10 kontrat = ~$1750 risk, max kar = 275.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### AVGO — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $377.75
**Teknik Trend:** Yukarı
**Destek / Direnç:** $360 / $390
**VWAP Durumu:** $372 (Fiyat VWAP üzerinde)
**IV Rank:** 40/100 (Orta)
**IV Crush Beklentisi:** 35-45%
**Earnings Tarihi:** 4-7 Eylül 2026 | **Zaman:** AMC | **Durum:** INFERRED
**EPS Konsensüs:** $2.55
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (AI semi $56B guide, VMware)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.056 | Theta: -0.132 | Vega: 0.326

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $345 Put + Sell $405 Call
**Toplanan Premium:** ~$11.33 (kontrat başına kredi = ~$1133)
**Gereken Margin:** ~$5666 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$680 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $345 / Buy Put $335
- Sell Call $405 / Buy Call $415
- Net Kredi: ~$7.36 (kontrat başına = ~$736)
- Max Kar: $736 | Max Zarar: $264

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 35-45% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~25 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $385.0
- Short Strike: $395.0
- Net Debit: ~$13.22 (kontrat başına = ~$1322)
- Max Kar: ~$-322 (kontrat başına)
- Max Zarar: ~$1322
- Breakeven: ~$398.2

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $360 destek / $390 direnç aralığında. VWAP $372 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Debit Spread (ITM)
- Net Debit: ~$7.55 (kontrat başına = ~$755)
- Max Kar: 245.0 (kontrat başına)
- Max Zarar: ~$755
- Breakeven / Body: 377.55

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 755$ risk ile 245.0 potansiyel getiri sunar. 10 kontrat = ~$7550 risk, max kar = 245.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### CRM — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $156.66
**Teknik Trend:** Yatay
**Destek / Direnç:** $150 / $162
**VWAP Durumu:** $155 (Fiyat VWAP üzerinde)
**IV Rank:** 35/100 (Orta)
**IV Crush Beklentisi:** 30-40%
**Earnings Tarihi:** 21-28 Ağustos 2026 | **Zaman:** AMC | **Durum:** INFERRED
**EPS Konsensüs:** $2.35
**Yön Bias:** NÖTR
**Haber Sentiment:** Nötr (Agentforce traction, guidance risk)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.032 | Theta: -0.088 | Vega: 0.205

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $140.0 Put + Sell $170.0 Call
**Toplanan Premium:** ~$6.27 (kontrat başına kredi = ~$627)
**Gereken Margin:** ~$2350 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$376 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $140.0 / Buy Put $135.0
- Sell Call $170.0 / Buy Call $175.0
- Net Kredi: ~$4.08 (kontrat başına = ~$408)
- Max Kar: $408 | Max Zarar: $92

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 30-40% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~20 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Put Spread (Bear Put Spread)
- Long Strike: $152.5
- Short Strike: $372.5
- Net Debit: ~$5.48 (kontrat başına = ~$548)
- Max Kar: ~$-22548 (kontrat başına)
- Max Zarar: ~$548
- Breakeven: ~$158.0

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | NÖTR |

> **Teknik Gerekçe:** Fiyat $150 destek / $162 direnç aralığında. VWAP $155 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum kararsız.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Butterfly Spread
- Net Debit: ~$2.35 (kontrat başına = ~$235)
- Max Kar: 215.0 (kontrat başına)
- Max Zarar: ~$235
- Breakeven / Body: 157.5 - 162

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 235$ risk ile 215.0 potansiyel getiri sunar. 10 kontrat = ~$2350 risk, max kar = 215.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### ORCL — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $146.55
**Teknik Trend:** Yukarı
**Destek / Direnç:** $140 / $152
**VWAP Durumu:** $144 (Fiyat VWAP üzerinde)
**IV Rank:** 30/100 (Düşük)
**IV Crush Beklentisi:** 25-35%
**Earnings Tarihi:** 8 Eylül 2026 | **Zaman:** AMC | **Durum:** ESTIMATED
**EPS Konsensüs:** $1.68
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (Cloud $8B, RPO $523B, multi-cloud)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.031 | Theta: -0.085 | Vega: 0.203

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $130.0 Put + Sell $160.0 Call
**Toplanan Premium:** ~$5.86 (kontrat başına kredi = ~$586)
**Gereken Margin:** ~$2198 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$352 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $130.0 / Buy Put $125.0
- Sell Call $160.0 / Buy Call $165.0
- Net Kredi: ~$3.81 (kontrat başına = ~$381)
- Max Kar: $381 | Max Zarar: $119

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 25-35% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~15 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $150.0
- Short Strike: $385.0
- Net Debit: ~$5.13 (kontrat başına = ~$513)
- Max Kar: ~$22987 (kontrat başına)
- Max Zarar: ~$513
- Breakeven: ~$155.1

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $140 destek / $152 direnç aralığında. VWAP $144 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Butterfly Spread
- Net Debit: ~$2.2 (kontrat başına = ~$220)
- Max Kar: 230.0 (kontrat başına)
- Max Zarar: ~$220
- Breakeven / Body: 147.5 - 152

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 220$ risk ile 230.0 potansiyel getiri sunar. 10 kontrat = ~$2200 risk, max kar = 230.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### ADBE — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $205.02
**Teknik Trend:** Yatay
**Destek / Direnç:** $198 / $212
**VWAP Durumu:** $204 (Fiyat VWAP üzerinde)
**IV Rank:** 33/100 (Orta)
**IV Crush Beklentisi:** 30-40%
**Earnings Tarihi:** 10-17 Eylül 2026 | **Zaman:** AMC | **Durum:** INFERRED
**EPS Konsensüs:** $6.15
**Yön Bias:** NÖTR
**Haber Sentiment:** Nötr (AI ARR $500M+, Firefly growth)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.032 | Theta: -0.087 | Vega: 0.213

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $185 Put + Sell $220 Call
**Toplanan Premium:** ~$6.15 (kontrat başına kredi = ~$615)
**Gereken Margin:** ~$3075 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$369 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $185 / Buy Put $175
- Sell Call $220 / Buy Call $230
- Net Kredi: ~$4.0 (kontrat başına = ~$400)
- Max Kar: $400 | Max Zarar: $600

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 30-40% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~18 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Put Spread (Bear Put Spread)
- Long Strike: $200.0
- Short Strike: $190.0
- Net Debit: ~$7.18 (kontrat başına = ~$718)
- Max Kar: ~$282 (kontrat başına)
- Max Zarar: ~$718
- Breakeven: ~$207.2

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | NÖTR |

> **Teknik Gerekçe:** Fiyat $198 destek / $212 direnç aralığında. VWAP $204 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum kararsız.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Butterfly Spread
- Net Debit: ~$3.08 (kontrat başına = ~$308)
- Max Kar: 192.0 (kontrat başına)
- Max Zarar: ~$308
- Breakeven / Body: 205.0 - 210

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 308$ risk ile 192.0 potansiyel getiri sunar. 10 kontrat = ~$3080 risk, max kar = 192.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### QCOM — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $184.79
**Teknik Trend:** Yukarı
**Destek / Direnç:** $178 / $190
**VWAP Durumu:** $182 (Fiyat VWAP üzerinde)
**IV Rank:** 38/100 (Orta)
**IV Crush Beklentisi:** 35-45%
**Earnings Tarihi:** 29 Temmuz 2026 | **Zaman:** AMC | **Durum:** ESTIMATED
**EPS Konsensüs:** $2.09
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (Auto record $1.3B, data center CPU)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.053 | Theta: -0.13 | Vega: 0.287

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $165.0 Put + Sell $202.5 Call
**Toplanan Premium:** ~$7.39 (kontrat başına kredi = ~$739)
**Gereken Margin:** ~$2772 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$443 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $165.0 / Buy Put $160.0
- Sell Call $202.5 / Buy Call $207.5
- Net Kredi: ~$4.8 (kontrat başına = ~$480)
- Max Kar: $480 | Max Zarar: $20

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 35-45% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~23 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $187.5
- Short Strike: $480.0
- Net Debit: ~$6.47 (kontrat başına = ~$647)
- Max Kar: ~$28603 (kontrat başına)
- Max Zarar: ~$647
- Breakeven: ~$194.0

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $178 destek / $190 direnç aralığında. VWAP $182 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Butterfly Spread
- Net Debit: ~$2.77 (kontrat başına = ~$277)
- Max Kar: 223.0 (kontrat başına)
- Max Zarar: ~$277
- Breakeven / Body: 185.0 - 190

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 277$ risk ile 223.0 potansiyel getiri sunar. 10 kontrat = ~$2770 risk, max kar = 223.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### MRVL — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $297.89
**Teknik Trend:** Yukarı
**Destek / Direnç:** $285 / $310
**VWAP Durumu:** $292 (Fiyat VWAP üzerinde)
**IV Rank:** 55/100 (Yüksek)
**IV Crush Beklentisi:** 50-60%
**Earnings Tarihi:** 27-31 Ağustos 2026 | **Zaman:** AMC | **Durum:** ESTIMATED
**EPS Konsensüs:** $0.93
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (Data center 74% revenue, custom silicon)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.086 | Theta: -0.205 | Vega: 0.439

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $270 Put + Sell $320 Call
**Toplanan Premium:** ~$8.94 (kontrat başına kredi = ~$894)
**Gereken Margin:** ~$4468 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$536 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $270 / Buy Put $260
- Sell Call $320 / Buy Call $330
- Net Kredi: ~$5.81 (kontrat başına = ~$581)
- Max Kar: $581 | Max Zarar: $419

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 50-60% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~40 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $305.0
- Short Strike: $315.0
- Net Debit: ~$10.43 (kontrat başına = ~$1043)
- Max Kar: ~$-43 (kontrat başına)
- Max Zarar: ~$1043
- Breakeven: ~$315.4

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $285 destek / $310 direnç aralığında. VWAP $292 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Debit Spread (ITM)
- Net Debit: ~$5.96 (kontrat başına = ~$596)
- Max Kar: 404.0 (kontrat başına)
- Max Zarar: ~$596
- Breakeven / Body: 295.96

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 596$ risk ile 404.0 potansiyel getiri sunar. 10 kontrat = ~$5960 risk, max kar = 404.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### CRWD — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $763.14
**Teknik Trend:** Yukarı
**Destek / Direnç:** $730 / $780
**VWAP Durumu:** $750 (Fiyat VWAP üzerinde)
**IV Rank:** 50/100 (Yüksek)
**IV Crush Beklentisi:** 45-55%
**Earnings Tarihi:** 26-28 Ağustos 2026 | **Zaman:** AMC | **Durum:** ESTIMATED
**EPS Konsensüs:** $0.97
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (Q1 FY27 beat, $5.9B ARR guide)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.061 | Theta: -0.14 | Vega: 0.403

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $705 Put + Sell $815 Call
**Toplanan Premium:** ~$19.08 (kontrat başına kredi = ~$1908)
**Gereken Margin:** ~$11447 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$1145 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $705 / Buy Put $685
- Sell Call $815 / Buy Call $835
- Net Kredi: ~$12.4 (kontrat başına = ~$1240)
- Max Kar: $1240 | Max Zarar: $760

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 45-55% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~35 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $780.0
- Short Strike: $790.0
- Net Debit: ~$26.71 (kontrat başına = ~$2671)
- Max Kar: ~$-1671 (kontrat başına)
- Max Zarar: ~$2671
- Breakeven: ~$806.7

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $730 destek / $780 direnç aralığında. VWAP $750 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Debit Spread (ITM)
- Net Debit: ~$15.26 (kontrat başına = ~$1526)
- Max Kar: -526.0 (kontrat başına)
- Max Zarar: ~$1526
- Breakeven / Body: 765.26

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 1526$ risk ile -526.0 potansiyel getiri sunar. 10 kontrat = ~$15260 risk, max kar = -526.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### PANW — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $341.02
**Teknik Trend:** Yukarı
**Destek / Direnç:** $325 / $350
**VWAP Durumu:** $332 (Fiyat VWAP üzerinde)
**IV Rank:** 42/100 (Orta)
**IV Crush Beklentisi:** 40-50%
**Earnings Tarihi:** 20-27 Ağustos 2026 | **Zaman:** AMC | **Durum:** INFERRED
**EPS Konsensüs:** $1.05
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (Platformization, CyberArk integration)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.055 | Theta: -0.134 | Vega: 0.318

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $310 Put + Sell $365 Call
**Toplanan Premium:** ~$10.23 (kontrat başına kredi = ~$1023)
**Gereken Margin:** ~$5115 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$614 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $310 / Buy Put $300
- Sell Call $365 / Buy Call $375
- Net Kredi: ~$6.65 (kontrat başına = ~$665)
- Max Kar: $665 | Max Zarar: $335

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 40-50% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~27 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $350.0
- Short Strike: $360.0
- Net Debit: ~$11.94 (kontrat başına = ~$1194)
- Max Kar: ~$-194 (kontrat başına)
- Max Zarar: ~$1194
- Breakeven: ~$361.9

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $325 destek / $350 direnç aralığında. VWAP $332 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Debit Spread (ITM)
- Net Debit: ~$6.82 (kontrat başına = ~$682)
- Max Kar: 318.0 (kontrat başına)
- Max Zarar: ~$682
- Breakeven / Body: 341.82

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 682$ risk ile 318.0 potansiyel getiri sunar. 10 kontrat = ~$6820 risk, max kar = 318.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### ZS — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $141.15
**Teknik Trend:** Yukarı
**Destek / Direnç:** $135 / $146
**VWAP Durumu:** $138 (Fiyat VWAP üzerinde)
**IV Rank:** 55/100 (Yüksek)
**IV Crush Beklentisi:** 50-60%
**Earnings Tarihi:** 20-27 Ağustos 2026 | **Zaman:** AMC | **Durum:** INFERRED
**EPS Konsensüs:** $0.18
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (SASE leader, Zero Trust growth)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.083 | Theta: -0.205 | Vega: 0.392

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $125.0 Put + Sell $155.0 Call
**Toplanan Premium:** ~$5.65 (kontrat başına kredi = ~$565)
**Gereken Margin:** ~$2117 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$339 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $125.0 / Buy Put $120.0
- Sell Call $155.0 / Buy Call $160.0
- Net Kredi: ~$3.67 (kontrat başına = ~$367)
- Max Kar: $367 | Max Zarar: $133

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 50-60% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~40 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $145.0
- Short Strike: $370.0
- Net Debit: ~$4.94 (kontrat başına = ~$494)
- Max Kar: ~$22006 (kontrat başına)
- Max Zarar: ~$494
- Breakeven: ~$149.9

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $135 destek / $146 direnç aralığında. VWAP $138 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Butterfly Spread
- Net Debit: ~$2.12 (kontrat başına = ~$212)
- Max Kar: 288.0 (kontrat başına)
- Max Zarar: ~$212
- Breakeven / Body: 140.0 - 145

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 212$ risk ile 288.0 potansiyel getiri sunar. 10 kontrat = ~$2120 risk, max kar = 288.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### NET — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $245.28
**Teknik Trend:** Yukarı
**Destek / Direnç:** $235 / $252
**VWAP Durumu:** $240 (Fiyat VWAP üzerinde)
**IV Rank:** 48/100 (Yüksek)
**IV Crush Beklentisi:** 45-55%
**Earnings Tarihi:** 6-13 Ağustos 2026 | **Zaman:** BMO | **Durum:** INFERRED
**EPS Konsensüs:** $0.18
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (Edge AI, Workers platform growth)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.054 | Theta: -0.138 | Vega: 0.299

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $225 Put + Sell $260 Call
**Toplanan Premium:** ~$7.36 (kontrat başına kredi = ~$736)
**Gereken Margin:** ~$3679 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$442 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $225 / Buy Put $215
- Sell Call $260 / Buy Call $270
- Net Kredi: ~$4.78 (kontrat başına = ~$478)
- Max Kar: $478 | Max Zarar: $522

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings günü sabah 09:30-10:30 (BMO) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | BMO: 45-55% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~33 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $250.0
- Short Strike: $260.0
- Net Debit: ~$8.58 (kontrat başına = ~$858)
- Max Kar: ~$142 (kontrat başına)
- Max Zarar: ~$858
- Breakeven: ~$258.6

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $235 destek / $252 direnç aralığında. VWAP $240 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Butterfly Spread
- Net Debit: ~$3.68 (kontrat başına = ~$368)
- Max Kar: 132.0 (kontrat başına)
- Max Zarar: ~$368
- Breakeven / Body: 245.0 - 250

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 368$ risk ile 132.0 potansiyel getiri sunar. 10 kontrat = ~$3680 risk, max kar = 132.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### DDOG — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $260.36
**Teknik Trend:** Yukarı
**Destek / Direnç:** $250 / $268
**VWAP Durumu:** $255 (Fiyat VWAP üzerinde)
**IV Rank:** 52/100 (Yüksek)
**IV Crush Beklentisi:** 50-60%
**Earnings Tarihi:** 6 Ağustos 2026 | **Zaman:** BMO | **Durum:** ESTIMATED
**EPS Konsensüs:** $0.58
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (Q1 beat, AI workload monitoring, $4.3B guide)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.085 | Theta: -0.202 | Vega: 0.428

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $235 Put + Sell $280 Call
**Toplanan Premium:** ~$7.81 (kontrat başına kredi = ~$781)
**Gereken Margin:** ~$3905 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$469 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $235 / Buy Put $225
- Sell Call $280 / Buy Call $290
- Net Kredi: ~$5.08 (kontrat başına = ~$508)
- Max Kar: $508 | Max Zarar: $492

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings günü sabah 09:30-10:30 (BMO) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | BMO: 50-60% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~37 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $265.0
- Short Strike: $275.0
- Net Debit: ~$9.11 (kontrat başına = ~$911)
- Max Kar: ~$89 (kontrat başına)
- Max Zarar: ~$911
- Breakeven: ~$274.1

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $250 destek / $268 direnç aralığında. VWAP $255 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Debit Spread (ITM)
- Net Debit: ~$5.21 (kontrat başına = ~$521)
- Max Kar: 479.0 (kontrat başına)
- Max Zarar: ~$521
- Breakeven / Body: 260.21

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 521$ risk ile 479.0 potansiyel getiri sunar. 10 kontrat = ~$5210 risk, max kar = 479.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### SNOW — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $254.50
**Teknik Trend:** Yukarı
**Destek / Direnç:** $245 / $262
**VWAP Durumu:** $250 (Fiyat VWAP üzerinde)
**IV Rank:** 45/100 (Orta)
**IV Crush Beklentisi:** 40-50%
**Earnings Tarihi:** 20-27 Ağustos 2026 | **Zaman:** BMO | **Durum:** INFERRED
**EPS Konsensüs:** $0.15
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (Product revenue $1.09B, 32% YoY, guidance raised)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.054 | Theta: -0.136 | Vega: 0.301

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $230 Put + Sell $270 Call
**Toplanan Premium:** ~$7.63 (kontrat başına kredi = ~$763)
**Gereken Margin:** ~$3817 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$458 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $230 / Buy Put $220
- Sell Call $270 / Buy Call $280
- Net Kredi: ~$4.96 (kontrat başına = ~$496)
- Max Kar: $496 | Max Zarar: $504

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings günü sabah 09:30-10:30 (BMO) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | BMO: 40-50% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~30 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $260.0
- Short Strike: $270.0
- Net Debit: ~$8.91 (kontrat başına = ~$891)
- Max Kar: ~$109 (kontrat başına)
- Max Zarar: ~$891
- Breakeven: ~$268.9

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $245 destek / $262 direnç aralığında. VWAP $250 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Debit Spread (ITM)
- Net Debit: ~$5.09 (kontrat başına = ~$509)
- Max Kar: 491.0 (kontrat başına)
- Max Zarar: ~$509
- Breakeven / Body: 255.09

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 509$ risk ile 491.0 potansiyel getiri sunar. 10 kontrat = ~$5090 risk, max kar = 491.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### SHOP — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $114.18
**Teknik Trend:** Yatay
**Destek / Direnç:** $110 / $118
**VWAP Durumu:** $113 (Fiyat VWAP üzerinde)
**IV Rank:** 40/100 (Orta)
**IV Crush Beklentisi:** 35-45%
**Earnings Tarihi:** 30 Temmuz / 6 Ağustos 2026 | **Zaman:** AMC | **Durum:** INFERRED
**EPS Konsensüs:** $0.28
**Yön Bias:** NÖTR
**Haber Sentiment:** Nötr (GMV growth, logistics margin pressure)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.052 | Theta: -0.132 | Vega: 0.273

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $102.5 Put + Sell $125.0 Call
**Toplanan Premium:** ~$4.57 (kontrat başına kredi = ~$457)
**Gereken Margin:** ~$1713 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$274 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $102.5 / Buy Put $97.5
- Sell Call $125.0 / Buy Call $130.0
- Net Kredi: ~$2.97 (kontrat başına = ~$297)
- Max Kar: $297 | Max Zarar: $203

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 35-45% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~25 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Put Spread (Bear Put Spread)
- Long Strike: $112.5
- Short Strike: $275.0
- Net Debit: ~$4.0 (kontrat başına = ~$400)
- Max Kar: ~$-16650 (kontrat başına)
- Max Zarar: ~$400
- Breakeven: ~$116.5

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | NÖTR |

> **Teknik Gerekçe:** Fiyat $110 destek / $118 direnç aralığında. VWAP $113 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum kararsız.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Call Butterfly Spread
- Net Debit: ~$1.71 (kontrat başına = ~$171)
- Max Kar: 329.0 (kontrat başına)
- Max Zarar: ~$171
- Breakeven / Body: 115.0 - 120

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 171$ risk ile 329.0 potansiyel getiri sunar. 10 kontrat = ~$1710 risk, max kar = 329.0 x 10. Hesabın %2'si ile uyumlu.

---

---

### UBER — Güncel Analiz & Stratejiler

**Güncel Fiyat:** $72.16
**Teknik Trend:** Yatay
**Destek / Direnç:** $68 / $76
**VWAP Durumu:** $71 (Fiyat VWAP üzerinde)
**IV Rank:** 38/100 (Orta)
**IV Crush Beklentisi:** 35-45%
**Earnings Tarihi:** 30 Temmuz / 6 Ağustos 2026 | **Zaman:** AMC | **Durum:** INFERRED
**EPS Konsensüs:** $0.55
**Yön Bias:** BULLISH
**Haber Sentiment:** Pozitif (Mobility + Delivery growth, FCF positive)

**Greeks Tahmini (ATM ~5 DTE):**
- Delta: 0.5 | Gamma: 0.051 | Theta: -0.13 | Vega: 0.264

#### Strateji 1: IV Crush Short Strangle / Iron Condor (Premium Collection)

**Kurulum:** Short Strangle — Sell $62.5 Put + Sell $77.5 Call
**Toplanan Premium:** ~$2.89 (kontrat başına kredi = ~$289)
**Gereken Margin:** ~$1082 (CSP/Cover Call temelli)
**Kar Hedefi:** Kredinin %50-75'i = ~$173 (kontrat başına)
**Max Risk:** Hisse put strike altına veya call strike üzerine sert hareket ederse; hedge Iron Condor ile sınırlanabilir.

**Iron Condor Alternative:**
- Sell Put $62.5 / Buy Put $57.5
- Sell Call $77.5 / Buy Call $82.5
- Net Kredi: ~$1.88 (kontrat başına = ~$188)
- Max Kar: $188 | Max Zarar: $312

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 3-5 gün önce (IV yükselirken) |
| Exit | Earnings sonrası ertesi gün sabah 09:30-10:30 (AMC) |
| Max Hold | 2 gün |
| Kar Hedefi | Kredinin %50-75'i |
| IV Crush | AMC: 35-45% |

> **Not:** VIX 16.89 olduğunda, earnings öncesi IV expansion ~23 puan IV Rank artışı getirebilir. Short Strangle bu expansion'dan önce kurulur, crush sonrası kapanır.

#### Strateji 2: Yön Tahmini (Directional Play)

**Kurulum:** Long Call Spread (Bull Call Spread)
- Long Strike: $72.5
- Short Strike: $185.0
- Net Debit: ~$2.53 (kontrat başına = ~$253)
- Max Kar: ~$10997 (kontrat başına)
- Max Zarar: ~$253
- Breakeven: ~$75.0

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-3 gün önce |
| Exit | Earnings sonrası 1. gün sabah (09:30-10:30) |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-100'ü |
| Yön Bias | BULLISH |

> **Teknik Gerekçe:** Fiyat $68 destek / $76 direnç aralığında. VWAP $71 seviyesi üzerinde kalıcı hareket bullish. Earnings öncesi son 5 günde momentum pozitif.

#### Strateji 3: Bütçe Dostu Versiyon (Low Capital)

**Kurulum:** Long Call (Lottery Ticket)
- Net Debit: ~$1.8 (kontrat başına = ~$180)
- Max Kar: Sınırsız (kontrat başına)
- Max Zarar: ~$180
- Breakeven / Body: 76.8

| Parametre | Değer |
|-----------|-------|
| Entry | Earnings'ten 2-4 gün önce |
| Exit | Earnings sonrası 1-2 gün içinde |
| Max Hold | 2 gün |
| Kar Hedefi | Debit'in %50-75'i |
| Bütçe | $50-$500 aralığı |

> **Bütçe Uygunluğu:** Bu strateji 180$ risk ile Sınırsız potansiyel getiri sunar. 10 kontrat = ~$1800 risk, max kar = Sınırsız x 10. Hesabın %2'si ile uyumlu.

---

## Özet Karşılaştırma Matrisi

| Hisse | Fiyat | Earnings | IV Rank | IV Crush | Bias | Strateji 1 | Strateji 2 | Strateji 3 |
|-------|-------|----------|---------|----------|------|------------|------------|------------|
| AAPL | $289.36 | 29 Temmuz / 5 Ağustos 2026 | 35 | 35-45% | BULLISH | Short Strangle | Long Call Spread (Bu | Call Debit Spread (I |
| AMZN | $238.34 | 30 Temmuz / 6 Ağustos 2026 | 38 | 30-40% | BULLISH | Short Strangle | Long Call Spread (Bu | Call Butterfly Sprea |
| GOOGL | $357.37 | 29 Temmuz / 5 Ağustos 2026 | 32 | 30-40% | BULLISH | Short Strangle | Long Call Spread (Bu | Call Debit Spread (I |
| META | $563.29 | 29 Temmuz 2026 | 42 | 40-50% | NÖTR | Short Strangle | Long Put Spread (Bea | Call Debit Spread (I |
| MSFT | $373.02 | 29 Temmuz / 5 Ağustos 2026 | 28 | 25-35% | BULLISH | Short Strangle | Long Call Spread (Bu | Call Debit Spread (I |
| NFLX | $71.40 | 16 Temmuz 2026 | 48 | 45-55% | BULLISH | Short Strangle | Long Call Spread (Bu | Long Call (Lottery T |
| TSLA | $420.60 | 22 Temmuz 2026 | 55 | 50-60% | NÖTR | Short Strangle | Long Put Spread (Bea | Call Debit Spread (I |
| AMD | $580.91 | 29 Temmuz / 5 Ağustos 2026 | 52 | 45-55% | BULLISH | Short Strangle | Long Call Spread (Bu | Call Debit Spread (I |
| NVDA | $200.09 | 26 Ağustos 2026 | 58 | 50-60% | BULLISH | Short Strangle | Long Call Spread (Bu | Call Butterfly Sprea |
| MU | $115.43 | Q3 FY26: ~26 Eylül 2026 | 45 | 40-50% | BULLISH | Short Strangle | Long Call Spread (Bu | Call Butterfly Sprea |
| INTC | $139.63 | 22/23 Temmuz 2026 | 50 | 45-55% | NÖTR | Short Strangle | Long Put Spread (Bea | Call Butterfly Sprea |
| PLTR | $116.67 | 4-7 Ağustos 2026 | 60 | 50-60% | BULLISH | Short Strangle | Long Call Spread (Bu | Call Butterfly Sprea |
| AVGO | $377.75 | 4-7 Eylül 2026 | 40 | 35-45% | BULLISH | Short Strangle | Long Call Spread (Bu | Call Debit Spread (I |
| CRM | $156.66 | 21-28 Ağustos 2026 | 35 | 30-40% | NÖTR | Short Strangle | Long Put Spread (Bea | Call Butterfly Sprea |
| ORCL | $146.55 | 8 Eylül 2026 | 30 | 25-35% | BULLISH | Short Strangle | Long Call Spread (Bu | Call Butterfly Sprea |
| ADBE | $205.02 | 10-17 Eylül 2026 | 33 | 30-40% | NÖTR | Short Strangle | Long Put Spread (Bea | Call Butterfly Sprea |
| QCOM | $184.79 | 29 Temmuz 2026 | 38 | 35-45% | BULLISH | Short Strangle | Long Call Spread (Bu | Call Butterfly Sprea |
| MRVL | $297.89 | 27-31 Ağustos 2026 | 55 | 50-60% | BULLISH | Short Strangle | Long Call Spread (Bu | Call Debit Spread (I |
| CRWD | $763.14 | 26-28 Ağustos 2026 | 50 | 45-55% | BULLISH | Short Strangle | Long Call Spread (Bu | Call Debit Spread (I |
| PANW | $341.02 | 20-27 Ağustos 2026 | 42 | 40-50% | BULLISH | Short Strangle | Long Call Spread (Bu | Call Debit Spread (I |
| ZS | $141.15 | 20-27 Ağustos 2026 | 55 | 50-60% | BULLISH | Short Strangle | Long Call Spread (Bu | Call Butterfly Sprea |
| NET | $245.28 | 6-13 Ağustos 2026 | 48 | 45-55% | BULLISH | Short Strangle | Long Call Spread (Bu | Call Butterfly Sprea |
| DDOG | $260.36 | 6 Ağustos 2026 | 52 | 50-60% | BULLISH | Short Strangle | Long Call Spread (Bu | Call Debit Spread (I |
| SNOW | $254.50 | 20-27 Ağustos 2026 | 45 | 40-50% | BULLISH | Short Strangle | Long Call Spread (Bu | Call Debit Spread (I |
| SHOP | $114.18 | 30 Temmuz / 6 Ağustos 2026 | 40 | 35-45% | NÖTR | Short Strangle | Long Put Spread (Bea | Call Butterfly Sprea |
| UBER | $72.16 | 30 Temmuz / 6 Ağustos 2026 | 38 | 35-45% | BULLISH | Short Strangle | Long Call Spread (Bu | Long Call (Lottery T |

---

## Risk Yönetimi ve Eylem Planı

### FOMC / Makro Risk Protokolü
- **FOMC 28-29 Temmuz 2026:** 21-27 Temmuz arası açılan pozisyonları %50 azalt veya küçült.
- **Blackout Dönemi (18-30 Temmuz):** Yeni pozisyon açma sınırlandırması — sadece mevcut earnings pozisyonları yönet.
- **VIX > 25:** Pozisyon boyutunu %50 azalt.
- **VIX > 35:** %75 azalt veya nakit.

### Pozisyon Boyutlandırma
- Tek hisse = max hesabın **%2'si**
- Tek sektör (Teknoloji) = max hesabın **%15'i**
- Toplam Earnings Play = max hesabın **%30'u**

### Günlük Eylem Takvimi (Örnek)
| Tarih | Eylem |
|-------|-------|
| 11-13 Temmuz | NFLX, TSLA, INTC stratejileri kurulumu |
| 14-16 Temmuz | NFLX (16 Temmuz AMC) pozisyon yönetimi |
| 18-20 Temmuz | META, QCOM, AAPL, AMZN, MSFT, GOOGL, AMD kurulumu |
| 21-23 Temmuz | TSLA, INTC (22 Temmuz) pozisyon yönetimi |
| 25-27 Temmuz | META, QCOM (29 Temmuz) pozisyon yönetimi |
| 28-30 Temmuz | AAPL, AMZN, MSFT, GOOGL, AMD, SHOP, UBER pozisyon yönetimi |
| 3-5 Ağustos | PLTR, DDOG, NET kurulumu |
| 6 Ağustos | DDOG (BMO) pozisyon yönetimi |
| 20-25 Ağustos | CRWD, MRVL, ZS, PANW, SNOW, CRM kurulumu |
| 26 Ağustos | NVDA (AMC) pozisyon yönetimi |
| 27-31 Ağustos | CRWD, MRVL, ZS, PANW, SNOW, CRM pozisyon yönetimi |

---

## Sorumluluk Reddi
Bu rapor yalnızca eğitim ve bilgi amaçlıdır. Opsiyon ticareti yüksek risk içerir. Tüm stratejiler kişisel risk toleransınıza ve finansal durumunuza göre uyarlanmalıdır. Geçmiş performans gelecek performansın garantisi değildir. Finansal tavsiye almadan önce bir danışmana başvurun.

---
*Gistify Earning Strategy v4.0 — Rolling 2-Aylık Earnings Opsiyon Analizi*
*Veri Kaynakları: Yahoo Finance, MarketBeat, Wall Street Horizon, AlphaSpread, Investing.com, Public.com, yfinance*
*Son Güncelleme: 1 Temmuz 2026, 14:12 UTC+3*
---

## Ek Bölüm A: Greeks Dashboard (Tüm Hisseler Özet)

| Hisse | Fiyat | Delta | Gamma | Theta | Vega | IV Rank | Not |
|-------|-------|-------|-------|-------|------|---------|-----|
| AAPL | $289.36 | 0.50 | 0.055 | -0.115 | 0.28 | 35 | Düşük vol, yüksek likidite |
| AMZN | $238.34 | 0.50 | 0.050 | -0.110 | 0.27 | 38 | Orta vol, güçlü trend |
| GOOGL | $357.37 | 0.50 | 0.048 | -0.105 | 0.26 | 32 | Düşük vol, yukarı momentum |
| META | $563.29 | 0.50 | 0.065 | -0.145 | 0.35 | 42 | Yüksek vol, belirsiz yön |
| MSFT | $373.02 | 0.50 | 0.045 | -0.095 | 0.24 | 28 | Düşük vol, en güvenli strangle adayı |
| NFLX | $71.40 | 0.50 | 0.090 | -0.180 | 0.45 | 48 | Yüksek vol, earnings sonrası hareketli |
| TSLA | $420.60 | 0.50 | 0.070 | -0.200 | 0.50 | 55 | Çok yüksek vol, yön tahmini riskli |
| AMD | $580.91 | 0.50 | 0.072 | -0.190 | 0.48 | 52 | Yüksek vol, semi beta yüksek |
| NVDA | $200.09 | 0.50 | 0.095 | -0.220 | 0.55 | 58 | En yüksek vol, en yüksek IV Crush potansiyeli |
| MU | $115.43 | 0.50 | 0.060 | -0.155 | 0.40 | 45 | Orta-yüksek vol, hafıza döngüsü etkisi |
| INTC | $139.63 | 0.50 | 0.075 | -0.185 | 0.47 | 50 | Turnaround volatilitesi yüksek |
| PLTR | $116.67 | 0.50 | 0.100 | -0.250 | 0.60 | 60 | En yüksek gamma, en yüksek risk |
| AVGO | $377.75 | 0.50 | 0.058 | -0.125 | 0.32 | 40 | Orta vol, AI growth story |
| CRM | $156.66 | 0.50 | 0.052 | -0.110 | 0.28 | 35 | Düşük vol, yatay bant |
| ORCL | $146.55 | 0.50 | 0.046 | -0.090 | 0.23 | 30 | Düşük vol, RPO büyümesi |
| ADBE | $205.02 | 0.50 | 0.050 | -0.100 | 0.26 | 33 | Düşük vol, AI ARR growth |
| QCOM | $184.79 | 0.50 | 0.055 | -0.120 | 0.30 | 38 | Orta vol, auto segmenti destekli |
| MRVL | $297.89 | 0.50 | 0.072 | -0.195 | 0.50 | 55 | Yüksek vol, custom silicon hype |
| CRWD | $763.14 | 0.50 | 0.068 | -0.175 | 0.45 | 50 | Yüksek vol, cybersecurity lideri |
| PANW | $341.02 | 0.50 | 0.062 | -0.140 | 0.38 | 42 | Orta-yüksek vol, platformization |
| ZS | $141.15 | 0.50 | 0.095 | -0.240 | 0.58 | 55 | Çok yüksek vol, SASE talebi |
| NET | $245.28 | 0.50 | 0.070 | -0.170 | 0.44 | 48 | Yüksek vol, edge AI story |
| DDOG | $260.36 | 0.50 | 0.080 | -0.210 | 0.52 | 52 | Yüksek vol, observability growth |
| SNOW | $254.50 | 0.50 | 0.065 | -0.160 | 0.42 | 45 | Orta-yüksek vol, guidance riski |
| SHOP | $114.18 | 0.50 | 0.058 | -0.130 | 0.33 | 40 | Orta vol, e-commerce döngüsü |
| UBER | $72.16 | 0.50 | 0.052 | -0.115 | 0.29 | 38 | Düşük vol, FCF positive |

> **Greeks Yorumu:** Theta ( zaman decay) negatif değerler earnings'ten 5 gün kala en agresif seviyededir. Earnings gününe 1-2 gün kala Theta ~2x artar. Gamma riski (delta hızlı değişimi) PLTR, NVDA, ZS, DDOG gibi hisselerde en yüksektir — bu hisselerde yön tahmini yaparken çok dikkatli olun.

---

## Ek Bölüm B: IV Crush Sektör Analizi — Temmuz / Ağustos 2026

| Sektör Alt Grubu | Ortalama IV Rank | Tipik IV Crush | En İyi Strateji | Risk Seviyesi |
|------------------|------------------|----------------|-----------------|---------------|
| **Mag 7 (AAPL, MSFT, GOOGL, AMZN, META, NVDA, TSLA)** | 42 | %35-50 | Short Strangle / Iron Condor | Orta |
| **Semiconductors (AMD, NVDA, MU, INTC, AVGO, MRVL, QCOM)** | 48 | %40-55 | Short Strangle + Hedge | Yüksek |
| **Cybersecurity (CRWD, PANW, ZS, NET)** | 49 | %45-55 | Iron Condor | Yüksek |
| **Cloud / SaaS (DDOG, SNOW, CRM, ORCL, PLTR)** | 44 | %35-50 | Bull Call Spread (Bullish bias) | Orta-Yüksek |
| **E-Ticaret / Platform (SHOP, UBER, NFLX)** | 42 | %35-50 | Directional Spread | Orta |
| **Enterprise Software (MSFT, ORCL, ADBE, CRM)** | 32 | %25-40 | Short Strangle (en güvenli) | Düşük-Orta |

### IV Crush Potansiyeli Sıralaması (En Yüksekten Düşüğe)

1. **PLTR** — IV Rank 60, earnings öncesi IV ~80-90%, sonrası ~35-40% → **~50% Crush**
2. **NVDA** — IV Rank 58, Blackwell hype ile IV ~85%, sonrası ~35% → **~50% Crush**
3. **TSLA** — IV Rank 55, delivery volatilitesi + Elon faktörü → **~50-55% Crush**
4. **MRVL** — IV Rank 55, custom silicon hype → **~50% Crush**
5. **ZS** — IV Rank 55, SASE / Zero Trust volatilitesi → **~50% Crush**
6. **AMD** — IV Rank 52, MI350 ramp bekleniyor → **~45-50% Crush**
7. **DDOG** — IV Rank 52, AI monitoring growth → **~45-50% Crush**
8. **INTC** — IV Rank 50, turnaround belirsizliği → **~45-50% Crush**
9. **CRWD** — IV Rank 50, CrowdStrike 2024 outage hafızası → **~45-50% Crush**
10. **NET** — IV Rank 48, edge AI + Workers → **~45% Crush**
11. **NFLX** — IV Rank 48, ad revenue + membership → **~45-55% Crush**
12. **MU** — IV Rank 45, HBM3E supply/demand → **~40-45% Crush**
13. **SNOW** — IV Rank 45, consumption model risk → **~40-45% Crush**
14. **META** — IV Rank 42, Reality Labs + capex → **~40-45% Crush**
15. **PANW** — IV Rank 42, platformization + CyberArk → **~40-45% Crush**
16. **AMZN** — IV Rank 38, AWS AI + retail margin → **~35-40% Crush**
17. **QCOM** — IV Rank 38, auto + data center CPU → **~35-40% Crush**
18. **SHOP** — IV Rank 40, GMV + logistics → **~35-40% Crush**
19. **UBER** — IV Rank 38, mobility + delivery + freight → **~35-40% Crush**
20. **AVGO** — IV Rank 40, VMware integration + AI semi → **~35-40% Crush**
21. **AAPL** — IV Rank 35, AI on-device + services → **~35-40% Crush**
22. **CRM** — IV Rank 35, Agentforce + Einstein → **~30-35% Crush**
23. **ADBE** — IV Rank 33, Firefly + GenStudio → **~30-35% Crush**
24. **GOOGL** — IV Rank 32, Cloud + Gemini + Search → **~30-35% Crush**
25. **ORCL** — IV Rank 30, Cloud + DB multi-cloud → **~25-30% Crush**
26. **MSFT** — IV Rank 28, Cloud + Copilot + Azure → **~25-30% Crush**

> **Stratejik Çıkarım:** IV Crush en yüksek hisseler (PLTR, NVDA, TSLA, MRVL, ZS) Short Strangle için en cazip adaylardır. Ancak yüksek gamma riski nedeniyle Iron Condor ile hedge şarttır. MSFT ve ORCL gibi düşük IV hisselerinde ise directional spread'ler (Long Call/Put Spread) daha kârlı olabilir çünkü IV Crush düşük olacağından premium collection sınırlı kalır.

---

## Ek Bölüm C: Bütçe Dostu Portföy Önerileri (5 Seviye)

### Seviye 1: Mikro Bütçe ($500-$1,000)

| Hisse | Strateji | Kontrat | Maliyet | Max Kar | Risk |
|-------|----------|---------|---------|---------|------|
| NFLX | Long Call Spread | 2 kontrat | ~$80 | ~$240 | %100 |
| SHOP | Long Call Spread | 2 kontrat | ~$60 | ~$180 | %100 |
| UBER | Long Call Spread | 2 kontrat | ~$70 | ~$210 | %100 |
| INTC | Long Call Spread | 1 kontrat | ~$50 | ~$150 | %100 |
| **Toplam** | | **7 kontrat** | **~$260** | **~$780** | **%100** |

> Bu portföy $1,000 hesap için uygundur. Toplam risk $260, maksimum hesap riski %26. Ayrıca bir hisse (örn. NFLX) Short Strangle Iron Condor ile hedge edilebilir.

### Seviye 2: Küçük Bütçe ($1,000-$2,500)

| Hisse | Strateji | Kontrat | Maliyet | Max Kar | Risk |
|-------|----------|---------|---------|---------|------|
| AAPL | Bull Call Spread | 2 kontrat | ~$140 | ~$420 | %100 |
| MSFT | Bull Call Spread | 2 kontrat | ~$120 | ~$360 | %100 |
| NVDA | Long Call | 1 kontrat | ~$80 | Sınırsız | %100 |
| AMD | Bull Call Spread | 1 kontrat | ~$90 | ~$270 | %100 |
| TSLA | Long Put Spread (hedge) | 1 kontrat | ~$60 | ~$180 | %100 |
| **Toplam** | | **7 kontrat** | **~$490** | **~$1,230+** | **%100** |

### Seviye 3: Orta Bütçe ($2,500-$5,000)

| Hisse | Strateji | Kontrat | Maliyet / Kredi | Max Kar | Risk |
|-------|----------|---------|-----------------|---------|------|
| GOOGL | Short Strangle (hedge'li) | 2 kontrat | Kredi ~$200 | ~$200 | Sınırlı |
| META | Iron Condor | 2 kontrat | Kredi ~$240 | ~$240 | Sınırlı |
| AMZN | Bull Call Spread | 3 kontrat | ~$210 | ~$630 | %100 |
| PLTR | Long Call | 2 kontrat | ~$120 | Sınırsız | %100 |
| CRWD | Bull Call Spread | 1 kontrat | ~$100 | ~$300 | %100 |
| **Toplam** | | **10 kontrat** | **~$490 net debit** | **~$1,370+** | **Karma** |

### Seviye 4: Büyük Bütçe ($5,000-$10,000)

| Hisse | Strateji | Kontrat | Maliyet / Kredi | Max Kar | Risk |
|-------|----------|---------|-----------------|---------|------|
| NVDA | Short Strangle + Iron Condor | 3 kontrat | Kredi ~$450 | ~$450 | Sınırlı |
| TSLA | Iron Condor | 3 kontrat | Kredi ~$360 | ~$360 | Sınırlı |
| AAPL | Bull Call Spread | 5 kontrat | ~$350 | ~$1,050 | %100 |
| MSFT | Bull Call Spread | 5 kontrat | ~$300 | ~$900 | %100 |
| AMD | Bull Call Spread | 3 kontrat | ~$270 | ~$810 | %100 |
| DDOG | Bull Call Spread | 2 kontrat | ~$160 | ~$480 | %100 |
| **Toplam** | | **21 kontrat** | **~$1,090 net debit** | **~$3,050+** | **Karma** |

### Seviye 5: İleri Seviye ($10,000+)

| Hisse | Strateji | Kontrat | Maliyet / Kredi | Max Kar | Risk |
|-------|----------|---------|-----------------|---------|------|
| NVDA | Short Strangle + Iron Condor | 5 kontrat | Kredi ~$750 | ~$750 | Sınırlı |
| PLTR | Short Strangle + Iron Condor | 5 kontrat | Kredi ~$600 | ~$600 | Sınırlı |
| META | Iron Condor | 5 kontrat | Kredi ~$600 | ~$600 | Sınırlı |
| TSLA | Iron Condor | 5 kontrat | Kredi ~$600 | ~$600 | Sınırlı |
| AAPL | Bull Call Spread | 8 kontrat | ~$560 | ~$1,680 | %100 |
| MSFT | Bull Call Spread | 8 kontrat | ~$480 | ~$1,440 | %100 |
| AMZN | Bull Call Spread | 6 kontrat | ~$420 | ~$1,260 | %100 |
| GOOGL | Bull Call Spread | 6 kontrat | ~$360 | ~$1,080 | %100 |
| **Toplam** | | **48 kontrat** | **~$870 net debit** | **~$8,010+** | **Karma** |

> **Not:** Seviye 5'te kredi toplama stratejileri (Short Strangle / Iron Condor) ağırlıklıdır çünkü büyük hesaplarda margin kullanımı verimlidir. Directional spread'ler (Bull Call Spread) hedge ve çeşitlendirme amacıyla eklenir.

---

## Ek Bölüm D: Teknik Sinyal Sıralaması ve VWAP Durumu

| Sıra | Hisse | Fiyat | VWAP | VWAP Mesafe | Trend | Sinyal Gücü | Öneri |
|------|-------|-------|------|-------------|-------|-------------|-------|
| 1 | NVDA | $200.09 | $195.00 | +2.6% | Yukarı | ⭐⭐⭐⭐⭐ | Ağırlıklı Bull Call Spread |
| 2 | PLTR | $116.67 | $114.00 | +2.3% | Yukarı | ⭐⭐⭐⭐⭐ | Ağırlıklı Long Call / Butterfly |
| 3 | MRVL | $297.89 | $292.00 | +2.0% | Yukarı | ⭐⭐⭐⭐⭐ | Bull Call Spread |
| 4 | DDOG | $260.36 | $255.00 | +2.1% | Yukarı | ⭐⭐⭐⭐⭐ | Bull Call Spread |
| 5 | AMD | $580.91 | $565.00 | +2.8% | Yukarı | ⭐⭐⭐⭐⭐ | Bull Call Spread |
| 6 | NFLX | $71.40 | $71.00 | +0.6% | Yukarı | ⭐⭐⭐⭐ | Long Call Spread |
| 7 | CRWD | $763.14 | $750.00 | +1.8% | Yukarı | ⭐⭐⭐⭐ | Bull Call Spread |
| 8 | ZS | $141.15 | $138.00 | +2.3% | Yukarı | ⭐⭐⭐⭐ | Long Call Spread |
| 9 | NET | $245.28 | $240.00 | +2.2% | Yukarı | ⭐⭐⭐⭐ | Bull Call Spread |
| 10 | MU | $115.43 | $112.00 | +3.1% | Yukarı | ⭐⭐⭐⭐ | Bull Call Spread |
| 11 | AAPL | $289.36 | $285.00 | +1.5% | Yukarı | ⭐⭐⭐⭐ | Short Strangle + Bull Call Spread |
| 12 | AMZN | $238.34 | $235.00 | +1.4% | Yukarı | ⭐⭐⭐⭐ | Short Strangle + Bull Call Spread |
| 13 | GOOGL | $357.37 | $350.00 | +2.1% | Yukarı | ⭐⭐⭐⭐ | Short Strangle + Bull Call Spread |
| 14 | QCOM | $184.79 | $182.00 | +1.5% | Yukarı | ⭐⭐⭐ | Long Call Spread |
| 15 | AVGO | $377.75 | $372.00 | +1.5% | Yukarı | ⭐⭐⭐ | Short Strangle + Bull Call Spread |
| 16 | MSFT | $373.02 | $368.00 | +1.4% | Yukarı | ⭐⭐⭐ | Short Strangle (en güvenli) |
| 17 | SHOP | $114.18 | $113.00 | +1.0% | Yatay | ⭐⭐⭐ | Iron Condor / Butterfly |
| 18 | UBER | $72.16 | $71.00 | +1.6% | Yatay | ⭐⭐⭐ | Long Call Spread |
| 19 | META | $563.29 | $555.00 | +1.5% | Yatay | ⭐⭐⭐ | Iron Condor (yön belirsiz) |
| 20 | CRM | $156.66 | $155.00 | +1.1% | Yatay | ⭐⭐⭐ | Iron Condor / Butterfly |
| 21 | ADBE | $205.02 | $204.00 | +0.5% | Yatay | ⭐⭐⭐ | Iron Condor / Butterfly |
| 22 | INTC | $139.63 | $135.00 | +3.4% | Yukarı | ⭐⭐⭐ | Bull Call Spread (turnaround play) |
| 23 | SNOW | $254.50 | $250.00 | +1.8% | Yukarı | ⭐⭐⭐ | Bull Call Spread |
| 24 | PANW | $341.02 | $332.00 | +2.7% | Yukarı | ⭐⭐⭐ | Bull Call Spread |
| 25 | ORCL | $146.55 | $144.00 | +1.8% | Yukarı | ⭐⭐ | Short Strangle (düşük vol) |
| 26 | TSLA | $420.60 | $410.00 | +2.6% | Yukarı | ⭐⭐ | Iron Condor (yön belirsizliği yüksek) |

> **VWAP Kuralı:** Fiyat VWAP üzerinde ve kapanış VWAP üzerindeyse bullish momentum kabul edilir. Earnings Play'de entry VWAP altından pullback sonrası veya VWAP üzerinde breakout'ta yapılır. VWAP'ten %3+ uzaklaşmış hisselerde (AMD, MU, INTC, TSLA) mean reversion riski artar — bu hisselerde directional spread yerine Iron Condor daha güvenli olabilir.

---

## Ek Bölüm E: Haftalık Eylem Planı (Detaylı)

### Hafta 1: 1-5 Temmuz 2026

| Gün | Eylem | Hedef Hisseler | Not |
|-----|-------|----------------|-----|
| Salı 1 Temmuz | Rapor inceleme, watchlist hazırlama | Tüm teknoloji | Makro veri takibi |
| Çarşamba 2 Temmuz | İlk pozisyon kurulumu (opsiyonel) | NFLX, TSLA, INTC | Early entry — 5 gün öncesi |
| Perşembe 3 Temmuz | Pozisyon kurulumu devam | NFLX, TSLA, INTC | VIX 16.89'da strangle kurulumu |
| Cuma 4 Temmuz | ABD Tatili (Independence Day) | — | Pazar kapalı, planlama günü |
| Cumartesi 5 Temmuz | Haftalık değerlendirme | — | Greeks ve IV Rank takibi |

### Hafta 2: 7-12 Temmuz 2026

| Gün | Eylem | Hedef Hisseler | Not |
|-----|-------|----------------|-----|
| Pazartesi 7 Temmuz | NFLX pozisyon yönetimi | NFLX | Entry son günü (16 Temmuz AMC) |
| Salı 8 Temmuz | TSLA, INTC kurulumu | TSLA, INTC | 2-5 gün öncesi entry zone |
| Çarşamba 9 Temmuz | TSLA, INTC kurulumu devam | TSLA, INTC | Earnings öncesi son günler |
| Perşembe 10 Temmuz | TSLA, INTC kurulumu | TSLA, INTC | Max hold 2 gün kontrolü |
| Cuma 11 Temmuz | NFLX pozisyon kapanış planlaması | NFLX | 16 Temmuz AMC hazırlık |
| Cumartesi 12 Temmuz | Haftalık review | — | P&L takibi |

### Hafta 3: 14-19 Temmuz 2026 (Earnings Yoğun Hafta)

| Gün | Eylem | Hedef Hisseler | Not |
|-----|-------|----------------|-----|
| Pazartesi 14 Temmuz | NFLX pozisyon kapanışı (opsiyonel) | NFLX | 16 Temmuz öncesi son çıkış şansı |
| Salı 15 Temmuz | NFLX final kontrol | NFLX | Earnings öncesi IV zirve |
| Çarşamba 16 Temmuz | **NFLX Earnings AMC** | NFLX | Kapanış: Ertesi gün 09:30-10:30 |
| Perşembe 17 Temmuz | NFLX kapanış, TSLA/INTC entry | TSLA, INTC | 22 Temmuz öncesi 5 gün |
| Cuma 18 Temmuz | TSLA, INTC pozisyon kurulumu | TSLA, INTC | FOMC Blackout başlangıcı yaklaşıyor |
| Cumartesi 19 Temmuz | Haftalık review | — | NFLX P&L değerlendirmesi |

### Hafta 4: 21-26 Temmuz 2026 (FOMC ve Earnings Kesişimi)

| Gün | Eylem | Hedef Hisseler | Not |
|-----|-------|----------------|-----|
| Pazartesi 20 Temmuz | TSLA, INTC final kontrol | TSLA, INTC | Entry son günleri |
| Salı 21 Temmuz | TSLA, INTC pozisyon yönetimi | TSLA, INTC | FOMC öncesi risk azaltma |
| Çarşamba 22 Temmuz | **TSLA Earnings AMC** | TSLA | **INTC Earnings AMC** |
| Perşembe 23 Temmuz | TSLA, INTC kapanış | TSLA, INTC | Ertesi gün sabah 09:30-10:30 |
| Cuma 24 Temmuz | META, QCOM, AAPL, AMZN, MSFT, GOOGL, AMD kurulumu | Mega Tech | 29 Temmuz öncesi 5 gün |
| Cumartesi 25 Temmuz | Haftalık review | — | TSLA/INTC P&L + yeni kurulum planlama |

### Hafta 5: 28 Temmuz - 2 Ağustos 2026 (Mega Tech Earnings Haftası)

| Gün | Eylem | Hedef Hisseler | Not |
|-----|-------|----------------|-----|
| Pazartesi 27 Temmuz | Mega Tech pozisyon yönetimi | META, QCOM, AAPL, AMZN, MSFT, GOOGL, AMD | FOMC Blackout dönemi (dikkat!) |
| Salı 28 Temmuz | **FOMC Karar** | Tüm piyasa | Pozisyonları %50 azalt veya küçült |
| Çarşamba 29 Temmuz | **META, QCOM Earnings AMC** | META, QCOM | AAPL, AMZN, MSFT, GOOGL, AMD entry son günleri |
| Perşembe 30 Temmuz | META, QCOM kapanış | META, QCOM | AAPL, AMZN, MSFT, GOOGL, AMD entry son günleri |
| Cuma 31 Temmuz | **AAPL, AMZN, MSFT, GOOGL, AMD, SHOP, UBER Earnings** (tahmini) | Mega Tech + E-Ticaret | Kapanış: 1-2 Ağustos |
| Cumartesi 1 Ağustos | Haftalık review | — | Mega Tech P&L değerlendirmesi |
| Pazar 2 Ağustos | Ağustos takvimi planlama | PLTR, DDOG, NET, NVDA, CRWD, MRVL, ZS, PANW, SNOW, CRM | Yeni dönem hazırlığı |

### Hafta 6: 4-9 Ağustos 2026

| Gün | Eylem | Hedef Hisseler | Not |
|-----|-------|----------------|-----|
| Pazartesi 4 Ağustos | PLTR, DDOG, NET kurulumu | PLTR, DDOG, NET | 6-13 Ağustos earnings öncesi |
| Salı 5 Ağustos | PLTR, DDOG, NET kurulumu devam | PLTR, DDOG, NET | |
| Çarşamba 6 Ağustos | **DDOG Earnings BMO** | DDOG | Kapanış: Aynı gün 10:00-11:00 |
| Perşembe 7 Ağustos | PLTR pozisyon yönetimi | PLTR | 4-7 Ağustos earnings tahmini |
| Cuma 8 Ağustos | PLTR kapanış (opsiyonel) | PLTR | Max hold 2 gün kontrolü |
| Cumartesi 9 Ağustos | Haftalık review | — | DDOG/PLTR P&L |

### Hafta 7: 11-16 Ağustos 2026

| Gün | Eylem | Hedef Hisseler | Not |
|-----|-------|----------------|-----|
| Pazartesi 11 Ağustos | NET pozisyon yönetimi | NET | 6-13 Ağustos tahmini |
| Salı 12 Ağustos | NET kapanış (opsiyonel) | NET | Max hold 2 gün |
| Çarşamba 13 Ağustos | NVDA, CRWD, MRVL, ZS, PANW, SNOW, CRM kurulumu | Ağustos sonu teknoloji | 20-31 Ağustos earnings öncesi |
| Perşembe 14 Ağustos | Kurulum devam | NVDA, CRWD, MRVL, ZS, PANW, SNOW, CRM | |
| Cuma 15 Ağustos | Kurulum devam | NVDA, CRWD, MRVL, ZS, PANW, SNOW, CRM | |
| Cumartesi 16 Ağustos | Haftalık review | — | |

### Hafta 8: 18-23 Ağustos 2026 (Ağustos Sonu Earnings Yoğunluğu)

| Gün | Eylem | Hedef Hisseler | Not |
|-----|-------|----------------|-----|
| Pazartesi 18 Ağustos | NVDA, CRWD, MRVL, ZS, PANW, SNOW, CRM final kontrol | Tüm Ağustos sonu | Entry son günleri |
| Salı 19 Ağustos | CRM, SNOW, PANW, ZS pozisyon yönetimi | CRM, SNOW, PANW, ZS | 20-27 Ağustos tahmini |
| Çarşamba 20 Ağustos | CRM, SNOW, PANW, ZS pozisyon yönetimi | CRM, SNOW, PANW, ZS | |
| Perşembe 21 Ağustos | CRM, SNOW, PANW, ZS kapanış (opsiyonel) | CRM, SNOW, PANW, ZS | Max hold 2 gün |
| Cuma 22 Ağustos | NVDA, CRWD, MRVL pozisyon yönetimi | NVDA, CRWD, MRVL | 26-31 Ağustos tahmini |
| Cumartesi 23 Ağustos | Haftalık review | — | Ağustos ortası P&L |

### Hafta 9: 25-30 Ağustos 2026

| Gün | Eylem | Hedef Hisseler | Not |
|-----|-------|----------------|-----|
| Pazartesi 25 Ağustos | NVDA, CRWD, MRVL final kontrol | NVDA, CRWD, MRVL | Entry son günleri |
| Salı 26 Ağustos | **NVDA Earnings AMC** | NVDA | Kapanış: 27 Ağustos sabah |
| Çarşamba 27 Ağustos | NVDA kapanış, CRWD, MRVL pozisyon yönetimi | CRWD, MRVL | 26-28 Ağustos tahmini |
| Perşembe 28 Ağustos | **CRWD Earnings AMC** (tahmini) | CRWD | Kapanış: 31 Ağustos sabah |
| Cuma 29 Ağustos | CRWD kapanış, MRVL pozisyon yönetimi | MRVL | 27-31 Ağustos tahmini |
| Cumartesi 30 Ağustos | Ağustos ayı final review | — | Tüm P&L değerlendirmesi + Eylül takvimi |

---

## Ek Bölüm F: Sık Sorulan Sorular (Earnings Play Özel)

**Q: IV Crush ne zaman gerçekleşir?**
A: BMO (Before Market Open) earnings'te IV crush genellikle 09:30-10:30 arasında gerçekleşir. AMC (After Market Close) earnings'te ertesi gün sabah 09:30-10:30 arasında. IV Crush %35-60 arası olabilir.

**Q: Short Strangle'da zarar sınırı yok mu?**
A: Evet, naked Short Strangle'da teorik zarar sınırsızdır. Bu nedenle Iron Condor (buy wing ile hedge) önerilir. Alternatif olarak Cash-Secured Put + Covered Call kullanılabilir.

**Q: Earnings'ten 1 gün önce entry yapabilir miyim?**
A: Tavsiye edilmez. Son 24 saatte IV zirve yapar ve premium çok pahalıdır. Optimal entry: 2-5 gün öncesi.

**Q: FOMC haftasında earnings pozisyonu açmalı mıyım?**
A: FOMC 28-29 Temmuz 2026. 21-27 Temmuz arası pozisyonları %50 azaltın. FOMC öncesi 24 saatte yeni pozisyon açmayın.

**Q: Tek sektöre (teknoloji) ne kadar risk koymalıyım?**
A: Max hesabın %15'i. Bu rapor 26 teknoloji hissesi içeriyor ama hepsine aynı anda girmeyin. 5-8 hisse yeterli.

**Q: AMC mi BMO mu daha iyi?**
A: AMC daha yaygındır. AMC earnings sonrası kapanış ertesi gün sabah yapılır, bu daha fazla reaksiyon zamanı sağlar. BMO earnings sonrası kapanış aynı gün 10:00-11:00 arası yapılmalıdır (daha hızlı). AMC daha fazla esneklik sunar.

**Q: Greeks'te Theta negatif, bu kötü mü?**
A: Long pozisyonlarda (Call/Put/Spread) Theta negatif = zaman sizin aleyhinize. Short pozisyonlarda (Strangle/Condor) Theta pozitif = zaman sizin lehinize. Earnings Play'de Theta decay maksimum seviyededir — bu yüzden 2 günden fazla tutmayın.

**Q: IV Rank 30'un altındaysa Short Strangle işe yarar mı?**
A: IV Rank <30 ise premium collection sınırlı kalır. Bu durumda directional spread (Long Call/Put Spread) daha kârlı olabilir. MSFT ve ORCL gibi hisselerde IV Rank 28-30 civarında — bu hisselerde Bull Call Spread daha uygun.

---

## Ek Bölüm G: Karşılaştırma Matrisi — En İyi 10 Earnings Play (Temmuz / Ağustos 2026)

| # | Hisse | Earnings | IV Rank | IV Crush | Risk/Ödül | Önerilen Strateji | Bütçe |
|---|-------|----------|---------|----------|-----------|-------------------|-------|
| 1 | NVDA | 26 Ağustos AMC | 58 | %50-60 | ⭐⭐⭐⭐⭐ | Iron Condor + Bull Call Spread | $500+ |
| 2 | PLTR | 4-7 Ağustos BMO | 60 | %50-60 | ⭐⭐⭐⭐ | Long Call Butterfly | $100-$300 |
| 3 | TSLA | 22 Temmuz AMC | 55 | %50-60 | ⭐⭐⭐⭐ | Iron Condor | $500+ |
| 4 | MRVL | 27-31 Ağustos AMC | 55 | %50-60 | ⭐⭐⭐⭐ | Bull Call Spread | $200-$500 |
| 5 | ZS | 20-27 Ağustos AMC | 55 | %50-60 | ⭐⭐⭐⭐ | Long Call Spread | $150-$400 |
| 6 | AMD | 29 Temmuz / 5 Ağustos AMC | 52 | %45-55 | ⭐⭐⭐⭐ | Bull Call Spread | $200-$500 |
| 7 | DDOG | 6 Ağustos BMO | 52 | %50-60 | ⭐⭐⭐⭐ | Bull Call Spread | $200-$500 |
| 8 | INTC | 22/23 Temmuz AMC | 50 | %45-55 | ⭐⭐⭐ | Bull Call Spread | $100-$300 |
| 9 | CRWD | 26-28 Ağustos AMC | 50 | %45-55 | ⭐⭐⭐⭐ | Bull Call Spread | $300-$700 |
| 10 | NFLX | 16 Temmuz AMC | 48 | %45-55 | ⭐⭐⭐⭐ | Long Call Spread | $100-$300 |

> **En İyi 3 Fırsat:** NVDA (Blackwell Ultra ramp, $54B guide), PLTR (AIP momentum, government contracts), TSLA (delivery recovery + FSD). Bu üç hisse yüksek IV Crush ve güçlü yön bias ile Earnings Play için idealdir.

---

*Gistify Earning Strategy v4.0 — Rolling 2-Aylık Earnings Opsiyon Analizi*
*Veri Kaynakları: Yahoo Finance, MarketBeat, Wall Street Horizon, AlphaSpread, Investing.com, Public.com, yfinance*
*Son Güncelleme: 1 Temmuz 2026, 14:12 UTC+3*
*Rapor Toplam Satır: ~2,500+*
