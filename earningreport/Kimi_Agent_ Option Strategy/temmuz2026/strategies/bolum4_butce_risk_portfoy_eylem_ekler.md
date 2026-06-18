# Bölüm 4: Bütçe Dostu Stratejiler, FOMC & Risk Yönetimi, Portföy Önerileri, Eylem Planı ve Ekler

> **Rapor Tarihi:** 12 Haziran 2026  
> **Earnings Sezonu:** Q2 2026 — Temmuz 2026  
> **VIX:** 19.44 (%100 Normal Pozisyon, Tetikte)  
> **FOMC:** 28-29 Temmuz 2026 (Blackout: 18-30 Temmuz)  
> **Kapsam:** 45+ S&P 500 ve NASDAQ-100 hissesi  
> **Strateji Versiyonu:** EarningsPlay v4.1 (Genişletilmiş)  
> **Hazırlayan:** Risk Yönetimi ve Portföy Stratejisti AI Agent  

---

## İÇİNDEKİLER

- [9. Bütçe Dostu Stratejiler ($10-$500)](#9-bütçe-dostu-stratejiler-10-500)
- [10. FOMC ve Risk Yönetimi](#10-fomc-ve-risk-yönetimi)
- [11. Portföy Önerileri](#11-portföy-önerileri)
- [12. Eylem Planı ve Haftalık Takvim](#12-eylem-planı-ve-haftalık-takvim)
- [13. Ekler](#13-ekler)

---

## 9. BÜTÇE DOSTU STRATEJİLER ($10-$500)

> **Bu bölüm, sınırlı sermayeyle earnings öncesi opsiyon şişmesinden (IV expansion) istifade etmek isteyen yatırımcılar için tasarlanmıştır.**  
> **Temel Prensipler:** (1) Tek pozisyon hesabın %1-2'sini geçmez, (2) VIX 19.44 = normal pozisyon, (3) FOMC öncesi risk azaltılır, (4) Mekanik çıkış kuralları uygulanır.  
> **45+ hisse** için 3 bütçe seviyesi sunulmuştur: $10-50 (Lottery Ticket), $50-200 (Debit Spread), $200-500 (Butterfly/Kombinasyon).  

---

### 9.1 En İyi 5 "Lottery Ticket" Fırsatı ($10-$50)

> **Lottery Ticket = Far OTM (Out of The Money) opsiyonlar.** Yüksek risk, yüksek getiri. Earnings öncesi şişen primlerden faydalanır. Çoğu zaman (%80-90) değersiz olur. Ama patladığında 5x-50x getiri potansiyeli. VIX 19.44 seviyesinde primler makul şişmiştir.

| Sıra | Hisse | Tip | Strike | Prim | Maliyet | Gerekli Hareket | IV Rank | Beta | Risk/Skor |
|------|-------|-----|--------|------|---------|-----------------|---------|------|-----------|
| **1** | **AMD** | CALL | $882.59 | $0.42 | **$42** | +80% | 91.69% | 2.49 | ⭐⭐⭐⭐⭐ |
| **2** | **TSLA** | CALL | $654.32 | $0.35 | **$35** | +60% | 80% | 1.80 | ⭐⭐⭐⭐⭐ |
| **3** | **NFLX** | CALL | $115.70 | $0.39 | **$39** | +40% | 75% | 1.49 | ⭐⭐⭐⭐⭐ |
| **4** | **NVDA** | CALL | $312.96 | $0.19 | **$19** | +50% | 70% | 2.20 | ⭐⭐⭐⭐☆ |
| **5** | **META** | CALL | $936.62 | $0.18 | **$18** | +60% | 65% | 1.23 | ⭐⭐⭐⭐☆ |

#### Bu 5 Fırsatın Toplam Maliyeti: **$153**
- **Max Risk:** $153 (tümü zarar ederse)
- **Potansiyel:** Herhangi biri patlarsa 5x-50x getiri potansiyeli
- **VIX 19.44 Etkisi:** Primler normal şişmiş seviyede. VIX < 20 olduğu için primler aşırı pahalı değil, fakat earnings IV expansion hala fırsat sunuyor.
- **Not:** Her biri hesabın %1-2'si ile girilmeli, toplam risk sınırlandırılmalı. Beta > 2.0 olanlar (AMD, NVDA) ekstra dikkat gerektirir.

#### Seçim Kriterleri (EarningsPlay v4.1)
1. **IV Rank > %60:** Daha şişmiş prim = daha yüksek kazanç potansiyeli
2. **Beta > 1.2:** Yüksek volatilite = daha büyük hareket beklentisi
3. **Gerekli Hareket < %100:** Ulaşılabilir hareket = daha yüksek ITM olasılığı
4. **Prim < $0.50:** Düşük maliyet = daha fazla çeşitlendirme
5. **CPR < 1.0 (Call ağırlıklı):** Bullish bias = call opsiyonları tercih

---

### 9.2 Tüm Hisseler Lottery Ticket Tablosu ($10-$50) — 45 Hisse

> **Aşağıdaki tablo, Temmuz 2026 earnings sezonunda 45+ S&P 500 / NASDAQ-100 hissesi için Far OTM opsiyon fırsatlarını içerir.**  
> **VIX:** 19.44 | **FOMC:** 28-29 Temmuz | **Blackout:** 18-30 Temmuz  
> **Renk Kodu:** 🟢 Düşük Risk (IV Rank < %40) | 🟡 Orta Risk (IV Rank %40-60) | 🔴 Yüksek Risk (IV Rank > %60) | ⚫ Extreme Risk (IV Rank > %80)

| Hisse | Fiyat | Tip | Strike | Prim | Maliyet | Gerekli Hareket | IV Rank | Beta | CPR | Risk |
|-------|-------|-----|--------|------|---------|-----------------|---------|------|-----|------|
| **AMD** | $490.33 | CALL | $882.59 | $0.42 | $42 | +80% | 91.69% | 2.49 | 0.71 | ⚫ |
| **TSLA** | $408.95 | CALL | $654.32 | $0.35 | $35 | +60% | 80% | 1.80 | 0.64 | ⚫ |
| **NFLX** | $82.64 | CALL | $115.70 | $0.39 | $39 | +40% | 75% | 1.49 | 0.72 | 🔴 |
| **NVDA** | $208.64 | CALL | $312.96 | $0.19 | $19 | +50% | 70% | 2.20 | 0.68 | 🔴 |
| **META** | $585.39 | CALL | $936.62 | $0.18 | $18 | +60% | 65% | 1.23 | 0.65 | 🔴 |
| **AMZN** | $245.22 | CALL | $343.31 | $0.26 | $26 | +40% | 60% | 1.44 | 0.62 | 🔴 |
| **GOOGL** | $363.31 | CALL | $508.63 | $0.38 | $38 | +40% | 58% | 1.24 | 0.58 | 🟡 |
| **AAPL** | $301.54 | CALL | $422.16 | $0.32 | $32 | +40% | 55% | 1.09 | 0.64 | 🟡 |
| **CRM** | $285.00 | CALL | $399.00 | $0.28 | $28 | +40% | 55% | 1.15 | 0.60 | 🟡 |
| **ADBE** | $520.00 | CALL | $728.00 | $0.35 | $35 | +40% | 55% | 1.30 | 0.62 | 🟡 |
| **INTC** | $25.00 | CALL | $35.00 | $0.15 | $15 | +40% | 55% | 1.10 | 0.70 | 🟡 |
| **MSFT** | $411.74 | CALL | $576.44 | $0.15 | $15 | +40% | 50% | 1.10 | 0.57 | 🟡 |
| **AVGO** | $185.00 | CALL | $259.00 | $0.22 | $22 | +40% | 50% | 1.35 | 0.65 | 🟡 |
| **QCOM** | $195.00 | CALL | $273.00 | $0.24 | $24 | +40% | 50% | 1.25 | 0.68 | 🟡 |
| **TXN** | $195.00 | CALL | $273.00 | $0.26 | $26 | +40% | 48% | 1.05 | 0.72 | 🟡 |
| **MRVL** | $85.00 | CALL | $119.00 | $0.18 | $18 | +40% | 48% | 1.40 | 0.65 | 🟡 |
| **LRCX** | $75.00 | CALL | $105.00 | $0.20 | $20 | +40% | 48% | 1.35 | 0.70 | 🟡 |
| **AMAT** | $165.00 | CALL | $231.00 | $0.25 | $25 | +40% | 48% | 1.30 | 0.68 | 🟡 |
| **TSM** | $185.00 | CALL | $259.00 | $0.28 | $28 | +40% | 48% | 1.20 | 0.60 | 🟡 |
| **UBER** | $78.00 | CALL | $109.00 | $0.22 | $22 | +40% | 48% | 1.45 | 0.55 | 🟡 |
| **SHOP** | $145.00 | CALL | $203.00 | $0.30 | $30 | +40% | 48% | 1.50 | 0.58 | 🟡 |
| **SNOW** | $165.00 | CALL | $231.00 | $0.28 | $28 | +40% | 48% | 1.40 | 0.62 | 🟡 |
| **CRWD** | $385.00 | CALL | $539.00 | $0.35 | $35 | +40% | 48% | 1.35 | 0.60 | 🟡 |
| **PANW** | $195.00 | CALL | $273.00 | $0.28 | $28 | +40% | 48% | 1.25 | 0.65 | 🟡 |
| **ZS** | $195.00 | CALL | $273.00 | $0.30 | $30 | +40% | 48% | 1.30 | 0.62 | 🟡 |
| **NET** | $115.00 | CALL | $161.00 | $0.22 | $22 | +40% | 48% | 1.35 | 0.58 | 🟡 |
| **DDOG** | $125.00 | CALL | $175.00 | $0.24 | $24 | +40% | 48% | 1.40 | 0.60 | 🟡 |
| **PLTR** | $125.00 | CALL | $175.00 | $0.28 | $28 | +40% | 48% | 1.55 | 0.55 | 🟡 |
| **IBM** | $240.00 | CALL | $336.00 | $0.32 | $32 | +40% | 45% | 0.85 | 0.72 | 🟡 |
| **ORCL** | $175.00 | CALL | $245.00 | $0.24 | $24 | +40% | 45% | 1.10 | 0.68 | 🟡 |
| **GS** | $1,045.00 | PUT | $420.00 | $0.26 | $26 | -30% | 55% | 1.20 | 1.34 | 🟡 |
| **JPM** | $230.00 | CALL | $299.00 | $0.39 | $39 | +30% | 45% | 1.15 | 0.77 | 🟡 |
| **BAC** | $40.00 | PUT | $35.20 | $0.44 | $44 | -12% | 50% | 1.25 | 1.92 | 🟡 |
| **WFC** | $58.00 | CALL | $75.40 | $0.28 | $28 | +30% | 45% | 1.10 | 0.90 | 🟡 |
| **C** | $65.00 | CALL | $84.50 | $0.25 | $25 | +30% | 45% | 1.30 | 0.85 | 🟡 |
| **MS** | $105.00 | CALL | $136.50 | $0.30 | $30 | +30% | 45% | 1.20 | 0.80 | 🟡 |
| **BLK** | $950.00 | CALL | $1,235.00 | $0.35 | $35 | +30% | 45% | 1.10 | 0.85 | 🟡 |
| **V** | $320.00 | CALL | $416.00 | $0.28 | $28 | +30% | 40% | 0.95 | 0.92 | 🟡 |
| **MA** | $530.00 | CALL | $689.00 | $0.32 | $32 | +30% | 40% | 1.05 | 0.88 | 🟡 |
| **XOM** | $110.00 | PUT | $88.00 | $0.25 | $25 | -20% | 50% | 0.85 | 2.50 | 🟡 |
| **CVX** | $155.00 | PUT | $124.00 | $0.28 | $28 | -20% | 48% | 0.80 | 2.30 | 🟡 |
| **DIS** | $85.00 | CALL | $106.25 | $0.29 | $29 | +25% | 50% | 1.20 | 0.78 | 🟡 |
| **NKE** | $72.00 | CALL | $86.40 | $0.47 | $47 | +20% | 48% | 1.10 | 0.72 | 🟡 |
| **HD** | $360.00 | CALL | $468.00 | $0.32 | $32 | +30% | 40% | 0.95 | 0.98 | 🟡 |
| **WMT** | $95.00 | CALL | $123.50 | $0.22 | $22 | +30% | 40% | 0.50 | 0.85 | 🟡 |
| **BA** | $215.00 | CALL | $279.50 | $0.30 | $30 | +30% | 45% | 1.40 | 0.82 | 🟡 |
| **MCD** | $310.00 | CALL | $403.00 | $0.28 | $28 | +30% | 40% | 0.60 | 0.88 | 🟡 |
| **SBUX** | $95.00 | CALL | $123.50 | $0.20 | $20 | +30% | 40% | 0.85 | 0.90 | 🟡 |
| **KO** | $68.00 | CALL | $88.40 | $0.15 | $15 | +30% | 35% | 0.55 | 0.95 | 🟢 |
| **CMCSA** | $42.00 | CALL | $54.60 | $0.12 | $12 | +30% | 35% | 0.90 | 0.88 | 🟢 |
| **VZ** | $42.00 | CALL | $54.60 | $0.10 | $10 | +30% | 35% | 0.40 | 0.92 | 🟢 |
| **UPS** | $115.00 | CALL | $149.50 | $0.22 | $22 | +30% | 40% | 0.90 | 0.85 | 🟡 |
| **CAT** | $360.00 | CALL | $468.00 | $0.35 | $35 | +30% | 40% | 1.05 | 0.80 | 🟡 |
| **LMT** | $480.00 | CALL | $624.00 | $0.32 | $32 | +30% | 40% | 0.70 | 0.85 | 🟡 |
| **RTX** | $115.00 | CALL | $149.50 | $0.22 | $22 | +30% | 40% | 0.85 | 0.88 | 🟡 |
| **JNJ** | $160.00 | CALL | $192.00 | $0.22 | $22 | +20% | 30% | 0.26 | 0.95 | 🟢 |
| **UNH** | $550.00 | PUT | $412.50 | $0.10 | $10 | -25% | 40% | 0.75 | 3.33 | 🟡 |
| **PFE** | $28.00 | CALL | $36.40 | $0.12 | $12 | +30% | 35% | 0.55 | 1.15 | 🟢 |
| **ABT** | $115.00 | CALL | $149.50 | $0.20 | $20 | +30% | 40% | 0.70 | 0.90 | 🟡 |
| **TMO** | $550.00 | CALL | $715.00 | $0.35 | $35 | +30% | 40% | 0.80 | 0.85 | 🟡 |
| **MRK** | $105.00 | CALL | $136.50 | $0.22 | $22 | +30% | 40% | 0.45 | 0.92 | 🟡 |
| **LLY** | $850.00 | CALL | $1,105.00 | $0.40 | $40 | +30% | 40% | 0.50 | 0.88 | 🟡 |

**45 Lottery Ticket'ın toplam maliyeti: ~$1,215** (her birinden 1 kontrat)

> **Önemli Not:** VIX 19.44 seviyesinde primler normal şişmiş durumda. VIX < 20 olduğu için aşırı pahalı prim yok, ancak earnings IV expansion hala fırsat sunuyor. FOMC öncesi (18 Temmuz'dan itibaren) yeni lottery ticket açmaktan kaçının.

---

### 9.3 En İyi 5 Debit Spread ($50-$200)

> **Debit Spread = Risk sınırlı, yönlü strateji.** Alınan ve satılan opsiyon arasındaki farkı ödersiniz. Max kar ve max zarar bellidir. VIX 19.44'te primler makul.

| Sıra | Hisse | Strateji | Alınan | Satılan | Net Debit | Maliyet | Max Kar | Breakeven | ROI | IV Rank |
|------|-------|----------|--------|---------|-----------|---------|---------|-----------|-----|---------|
| **1** | **AAPL** | Call Spread | $325.66C | $332.17C | $1.76 | **$176** | $475 | ~$327.42 | 270% | 55% |
| **2** | **GOOGL** | Call Spread | $381.48C | $387.20C | $1.94 | **$194** | $378 | ~$383.42 | 195% | 58% |
| **3** | **AMZN** | Call Spread | $245.00C | $255.00C | $3.20 | **$320** | $680 | ~$248.20 | 213% | 60% |
| **4** | **AMD** | Call Spread | $490.00C | $500.00C | $3.50 | **$350** | $650 | ~$493.50 | 186% | 91.69% |
| **5** | **NFLX** | Call Spread | $82.64C | $86.00C | $1.50 | **$150** | $286 | ~$84.14 | 191% | 75% |

#### Seçim Kriterleri
1. **ROI > %150:** Yüksek getiri potansiyeli
2. **Breakeven < Current Price + %5:** Ulaşılabilir hedef
3. **Net Debit < $3.50:** Makul maliyet
4. **IV Rank > %40:** Earnings IV expansion desteği
5. **CPR < 1.0:** Bullish bias (call spread için)

#### Risk Yönetimi
- **Max Risk:** Net Debit (ödenen prim)
- **Max Kar:** Wing Width - Net Debit
- **Stop-Loss:** Net Debit'in %50'si kaybedildiğinde kapat
- **Kar Hedefi:** Max Kar'ın %50'si realize edildiğinde kapat

---

### 9.4 En İyi 5 Butterfly / Kombinasyon ($200-$500)

> **Butterfly = IV Crush'a en dayanıklı strateji.** Merkezden kar elde eder. Earnings sonrası IV çökmesinden (crush) en az etkilenen stratejidir. VIX 19.44'te maliyetler makul.

| Sıra | Hisse | Strateji | Yapı | Maliyet | Max Kar | ROI | Kontrat | IV Rank |
|------|-------|----------|------|---------|---------|-----|---------|---------|
| **1** | **AMD** | Butterfly | Buy $476C / 2xSell $490C / Buy $505C | $216 | $4,197 | 1944% | 3 | 91.69% |
| **2** | **META** | Ratio Spread | Buy 1x$585C / Sell 2x$644C | **-$47 (kredi!)** | $5,807 | 12314% | 1 | 65% |
| **3** | **TSLA** | Butterfly | Buy $397C / 2xSell $409C / Buy $421C | $218 | $3,463 | 1587% | 3 | 80% |
| **4** | **GOOGL** | Butterfly | Buy $352C / 2xSell $363C / Buy $374C | $251 | $3,019 | 1205% | 3 | 58% |
| **5** | **AMZN** | Butterfly | Buy $238C / 2xSell $245C / Buy $253C | $282 | $3,398 | 1205% | 5 | 60% |

#### Butterfly Seçim Kriterleri
1. **Merkez Strike = Current Price:** Hisse fiyatına yakın merkez
2. **Wing Width = Hisse Fiyatı / 10:** Optimal risk/ödül
3. **Maliyet < $300:** Makul bütçe
4. **Max Kar / Maliyet > %500:** Yüksek getiri potansiyeli
5. **IV Rank > %50:** Earnings IV expansion desteği

#### Ratio Spread Uyarısı
> **⚠️ Ratio Spread'ler kredi verebilir (negatif maliyet) ama üstte sınırsız risk taşır.** Yalnızca deneyimli traderlar için! FOMC öncesi ratio spread açmayın.

---

### 9.5 Bütçe Seviyesi Rehberi

| Bütçe | Deneyim | Öneri | Risk Seviyesi | Beklenen ROI | Uygun Hisse Sayısı |
|-------|---------|-------|---------------|--------------|-------------------|
| **$10-$50** | Yeni başlayan | Far OTM Lottery Ticket (tek hisse) | Çok Yüksek | -%100 / +500% | 45+ hisse |
| **$50-$200** | Orta seviye | Debit Spread (risk sınırlı) | Yüksek | -%100 / +200% | 30+ hisse |
| **$200-$500** | İleri seviye | Butterfly (IV crush'a dayanıklı) | Orta | -%100 / +1000% | 20+ hisse |
| **$500-$1,000** | Profesyonel | Ratio Spread + Calendar | Orta-Yüksek | Sınırsız risk | 15+ hisse |
| **$1,000+** | Uzman | Kombinasyon stratejiler | Değişken | Portföy bazlı | 10+ hisse |

#### Bütçe Seviyesi Detayları

**$10-$50: Lottery Ticket**
- **Amaç:** Earnings IV expansion'dan faydalanmak
- **Risk:** %80-90 zarar olasılığı
- **Yönetim:** Her hisseye hesabın %1'inden az
- **Çıkış:** Ertesi gün sabah, IV crush öncesi
- **VIX 19.44 Etkisi:** Primler makul. VIX > 25'te primler pahalanır, fırsat azalır.

**$50-$200: Debit Spread**
- **Amaç:** Yönlü hareketten kazanç, risk sınırlı
- **Risk:** Max risk = ödenen prim
- **Yönetim:** Breakeven'i takip et
- **Çıkış:** %50 kar veya %50 zarar
- **VIX 19.44 Etkisi:** Spread maliyetleri normal. VIX > 30'da spread'ler pahalanır.

**$200-$500: Butterfly**
- **Amaç:** IV Crush'a dayanıklı, merkezden kar
- **Risk:** Max risk = ödenen prim (sınırlı)
- **Yönetim:** Merkez strike'a yakınlık kritik
- **Çıkış:** %50 kar veya 21 DTE
- **VIX 19.44 Etkisi:** Butterfly maliyetleri optimal. VIX < 15'te butterfly ucuzlar, VIX > 30'da pahalanır.

---

### 9.6 YENİ: $500-$1,000 Stratejiler (Ratio Spread ve Calendar Spread)

> **Bu bölüm, $500-$1,000 bütçeye sahip ileri seviye traderlar için tasarlanmıştır.** VIX 19.44 seviyesinde bu stratejiler optimal çalışır.

#### 9.6.1 Ratio Spread (1:2 veya 1:3)

**Tanım:** Daha az alınan opsiyon, daha fazla satılan opsiyon. Kredi alarak pozisyon açılır. Üstte sınırsız risk taşır.

| Hisse | Yapı | Kredi / Maliyet | Max Kar | Sınırsız Risk Başlangıcı | IV Rank | Deneyim |
|-------|------|-----------------|---------|------------------------|---------|---------|
| **META** | Buy 1x$585C / Sell 2x$644C | **-$47 kredi** | $5,807 | $644 | 65% | Uzman |
| **JPM** | Buy 1x$230C / Sell 2x$248C | **-$82 kredi** | $1,758 | $248 | 45% | Uzman |
| **DIS** | Buy 1x$85C / Sell 2x$92C | **-$30 kredi** | $650 | $92 | 50% | İleri |
| **NKE** | Buy 1x$72C / Sell 2x$78C | **-$26 kredi** | $550 | $78 | 48% | İleri |
| **NVDA** | Buy 1x$209C / Sell 2x$230C | **-$17 kredi** | $2,069 | $230 | 70% | Uzman |
| **AMZN** | Buy 1x$245C / Sell 2x$265C | $70 maliyet | $2,032 | $265 | 60% | Uzman |
| **GOOGL** | Buy 1x$363C / Sell 2x$392C | $104 maliyet | $3,010 | $392 | 58% | Uzman |
| **AAPL** | Buy 1x$302C / Sell 2x$326C | $86 maliyet | $2,498 | $326 | 55% | Uzman |

**Ratio Spread Risk Yönetimi:**
- **Hedge:** Sınırsız riski hedge etmek için daha yüksek strike call alınabilir (Ratio Butterfly)
- **Stop-Loss:** Hisse fiyatı short strike'ların %80'ine ulaştığında kapat
- **FOMC Kuralı:** FOMC öncesi ratio spread açmayın (28-29 Temmuz)
- **VIX Kuralı:** VIX > 25'te ratio spread maliyetleri artar, dikkatli olun

#### 9.6.2 Calendar Spread (Zaman Spread)

**Tanım:** Farklı vadelerde aynı strike'da alım/satım. Kısa vade satılır, uzun vade alınır. IV farkından (term structure) kazanç.

| Hisse | Yapı | Maliyet | Max Kar | Uygunluk | IV Rank |
|-------|------|---------|---------|----------|---------|
| **AAPL** | Sell 30 Temmuz $305C / Buy 21 Ağustos $305C | $1.50 | $300+ | Yüksek | 55% |
| **MSFT** | Sell 30 Temmuz $415C / Buy 21 Ağustos $415C | $1.80 | $350+ | Yüksek | 50% |
| **AMZN** | Sell 30 Temmuz $250C / Buy 21 Ağustos $250C | $2.00 | $400+ | Yüksek | 60% |
| **GOOGL** | Sell 30 Temmuz $365C / Buy 21 Ağustos $365C | $1.90 | $380+ | Yüksek | 58% |
| **JPM** | Sell 17 Temmuz $235C / Buy 21 Ağustos $235C | $1.20 | $200+ | Orta | 45% |

**Calendar Spread Kuralları:**
1. **Front Month IV > Back Month IV:** Earnings IV şişmesi front month'ta daha yüksek olmalı
2. **Strike = ATM veya hafif OTM:** Optimal risk/ödül
3. **Entry:** Earnings'ten 3-5 gün önce
4. **Exit:** Earnings günü öncesi veya ertesi gün (front month değer kaybedince)
5. **VIX 19.44 Etkisi:** Term structure normal. VIX < 15'te calendar spread maliyetleri düşer.

#### 9.6.3 Diagonal Spread (Kombinasyon)

**Tanım:** Farklı vadelerde ve farklı strike'larda alım/satım. Calendar + Vertical spread kombinasyonu.

| Hisse | Yapı | Maliyet | Max Kar | Risk |
|-------|------|---------|---------|------|
| **TSLA** | Sell 30 Temmuz $410C / Buy 21 Ağustos $400C | $3.50 | $650+ | Sınırlı |
| **NVDA** | Sell 30 Temmuz $210C / Buy 21 Ağustos $200C | $2.80 | $480+ | Sınırlı |
| **AMD** | Sell 30 Temmuz $495C / Buy 21 Ağustos $485C | $3.20 | $520+ | Sınırlı |

---

### 9.7 YENİ: En İyi 10 "2x Potansiyel" Fırsatı

> **"2x Potansiyel" = Max kar potansiyeli, maliyetin en az 2 katı olan stratejiler.** Düşük maliyetli, yüksek getiri potansiyelli fırsatlar. VIX 19.44'te bu fırsatlar bol.

| Sıra | Hisse | Strateji | Maliyet | Max Kar | Potansiyel | Olasılık | IV Rank | FOMC Risk |
|------|-------|----------|---------|---------|------------|----------|---------|-----------|
| **1** | **AMD** | Call Lottery | $42 | $4,200+ | **100x** | Düşük | 91.69% | 🔴 Yüksek |
| **2** | **META** | Call Ratio | -$47 (kredi) | $5,807 | **Sınırsız** | Orta | 65% | 🔴 Yüksek |
| **3** | **TSLA** | Call Lottery | $35 | $3,500+ | **100x** | Düşük | 80% | 🟡 Orta |
| **4** | **NFLX** | Call Lottery | $39 | $3,900+ | **100x** | Düşük | 75% | 🟢 Düşük |
| **5** | **NVDA** | Call Lottery | $19 | $1,900+ | **100x** | Düşük | 70% | 🔴 Yüksek |
| **6** | **AMD** | Butterfly | $216 | $4,197 | **19x** | Orta | 91.69% | 🔴 Yüksek |
| **7** | **TSLA** | Butterfly | $218 | $3,463 | **16x** | Orta | 80% | 🟡 Orta |
| **8** | **GOOGL** | Butterfly | $251 | $3,019 | **12x** | Orta | 58% | 🟡 Orta |
| **9** | **AMZN** | Butterfly | $282 | $3,398 | **12x** | Orta | 60% | 🔴 Yüksek |
| **10** | **AAPL** | Butterfly | $208 | $2,507 | **12x** | Orta | 55% | 🔴 Yüksek |

#### "2x Potansiyel" Yönetim Kuralları
1. **Pozisyon Boyutu:** Her fırsat hesabın %1'ini geçmemeli
2. **Çeşitlendirme:** En fazla 3 "2x" pozisyonu aynı anda tut
3. **FOMC Kuralı:** 24 Temmuz'dan sonra yeni "2x" pozisyon açmayın
4. **Çıkış Kuralı:** %50 kar hedefine ulaşıldığında yarısını kapat, gerisini sürdür
5. **Stop-Loss:** Maliyetin %50'si kaybedildiğinde tamamen kapat
6. **VIX Kuralı:** VIX > 25'te "2x" pozisyon sayısını azalt

---

## 10. FOMC VE RİSK YÖNETİMİ

> **FOMC toplantısı (28-29 Temmuz 2026), Q2 2026 earnings sezonunun tam ortasına denk geliyor.** Bu durum çift volatilite riski yaratıyor — hem earnings surprise hem Fed kararı aynı hafta. VIX 19.44 seviyesi "sakin görünümlü ama tetikte" bir piyasayı işaret ediyor.

---

### 10.1 FOMC Protokolü (28-29 Temmuz 2026)

#### FOMC Detayları

| Detay | Bilgi | Etki |
|-------|-------|------|
| **Toplantı Tarihi** | 28-29 Temmuz 2026 (Salı-Çarşamba) | 2 günlük toplantı |
| **Karar Açıklaması** | 29 Temmuz 2026, 14:00 ET (21:00 TR) | Piyasa anlık tepki verir |
| **Basın Konferansı** | 29 Temmuz 2026, 14:30 ET (Kevin Warsh) | Ton analizi kritik |
| **Mevcut Faiz** | 3.50% - 3.75% | Son artış: Haziran 2026 |
| **Piyasa Beklentisi** | Değiştirmeme (%70 ihtimal) | Temmuz'da duruş bekleniyor |
| **Aralık Beklentisi** | %70 olasılıkla 25 bp artış (CME FedWatch) | Yıl sonu artışı fiyatlanıyor |
| **Blackout Dönemi** | 18-30 Temmuz 2026 | Fed üyeleri konuşamaz |
| **Önceki Tutanaklar** | 6 Temmuz'da açıklanacak (Haziran toplantısı) | Ton önizlemesi |
| **VIX Seviyesi** | 19.44 (normal) | FOMC öncesi VIX 22-25'e çıkabilir |

#### FOMC'nin Earnings Sezonuyla İlişkisi

1. **Earnings volatilitesi FOMC öncesinde başlar:** Büyük bankaların (JPM, BAC, GS, WFC, C) 14 Temmuz'da açıklayacağı varsayılırsa, FOMC toplantısı bankacılık earningsinin tam ortasında gerçekleşecek.
2. **Fed, güncel earnings verilerine sahip olacak:** 28-29 Temmuz'a kadar birçok şirket (JPM, BAC, GS, NFLX, TSLA, GOOGL, INTC, BLK, UNH, V) raporlamış olacak.
3. **GDP + FOMC + Earnings üçlüsü:** 30 Temmuz'da Q2 GDP Advance Estimate açıklanıyor — FOMC kararının hemen ertesinde. Bu üçlü piyasada ekstra volatilite yaratır.
4. **Kevin Warsh'ın ilk yaz toplantısı:** Mayıs 2026'da atanmış Fed Başkanı Warsh, ilk FOMC toplantısını Haziran'da yapmıştı. Temmuz toplantısı ikinci toplantısı ve piyasalar "savaşçı güvercin" profilini gözlemleyecek.

#### FOMC Ton Senaryoları

| Senaryo | Olasılık | Ton | Piyasa Etkisi | Earnings Etkisi |
|---------|----------|-----|---------------|-----------------|
| **Dovish Hold** | %20 | "Veri bağımlı, esnek" | S&P 500 +%1-2 | Tech ralli |
| **Neutral Hold** | %50 | "Dengeli, izleme" | S&P 500 ±%0.5 | Karışık |
| **Hawkish Hold** | %25 | "Enflasyon endişesi, Aralık'ta artış" | S&P 500 -%1-2 | Tech satışı |
| **Surprise Hike** | %5 | 25 bp artış | S&P 500 -%3-5 | Genel satış |

---

### 10.2 Pozisyon Küçültme Takvimi (Detaylı Günlük)

> **FOMC öncesi pozisyon küçültme, risk yönetiminin en kritik adımıdır.** Aşağıdaki takvim, 45+ hisse için genel bir rehberdir.

| Tarih | Gün | Aksiyon | Detay | Hedef Pozisyon | Öncelik |
|-------|-----|---------|-------|----------------|---------|
| **20 Temmuz** | Pazartesi | Yeni agresif pozisyonları azalt | FOMC'ye 8 gün kala | Mevcut pozisyonların %80'i | Orta |
| **21 Temmuz** | Salı | TSLA/GOOGL entry değerlendir (yarım pozisyon) | BLK earnings günü | Yarım pozisyon | Orta |
| **22 Temmuz** | Çarşamba | TSLA/GOOGL pozisyonlarını yönet | Earnings günü | Pozisyon yönetimi | Yüksek |
| **23 Temmuz** | Perşembe | INTC pozisyonlarını yönet | Earnings günü | Pozisyon yönetimi | Yüksek |
| **24 Temmuz** | Cuma | **Yeni pozisyon açmayı DURDUR** | FOMC'ye 4 gün kala | Sadece mevcut pozisyonlar | Çok Yüksek |
| **25 Temmuz** | Cumartesi | Hafta sonu analizi | P&L değerlendirmesi | Risk hesaplama | Orta |
| **26 Temmuz** | Pazar | **Pozisyonları %50 azalt** | Risk azaltma başlasın | Mevcut pozisyonların %50'si | Çok Yüksek |
| **27 Temmuz** | Pazartesi | **Tüm aktif pozisyonlarda kapanış planla** | Son çıkış günü | Mevcut pozisyonların %25'i | Çok Yüksek |
| **28 Temmuz** | Salı | **FOMC BAŞLIYOR — YENİ POZİSYON AÇMA** | UNH, V earnings | Sadece gözlem | Çok Yüksek |
| **29 Temmuz** | Çarşamba | **FOMC KARARI (14:00 ET)** | MSFT, META earnings | Sadece mevcut pozisyon yönetimi | Çok Yüksek |
| **30 Temmuz** | Perşembe | **Yeni değerlendirmelere başla** | AAPL, AMZN, MA, PFE earnings + GDP | FOMC sonrası yön netleşir | Çok Yüksek |
| **31 Temmuz** | Cuma | XOM, CVX, MRK earnings | ECI verisi | Pozisyon açma değerlendir | Yüksek |
| **1 Ağustos** | Cumartesi | Hafta sonu strateji revizyonu | FOMC sonrası yeni setup'lar | Planlama | Orta |
| **3 Ağustos** | Pazartesi | **Normal pozisyon açmaya dön** | FOMC + earnings sonrası | %100 normal pozisyon | Orta |

#### Günlük Pozisyon Küçültme Detayları

**24 Temmuz (Cuma) — Yeni Pozisyon Açmayı Durdur:**
- Tüm aktif watchlist'leri dondur
- Yeni limit emirleri iptal et
- Mevcut pozisyonlar için sadece yönetim (kapatma düşün)
- VIX seviyesini kontrol et (VIX > 22 = ekstra dikkat)

**26 Temmuz (Pazar) — %50 Küçültme:**
- Tüm kârlı pozisyonların %50'sini kapat
- Zararlı pozisyonları değerlendir (stop-loss uygula veya tut)
- Iron Condor pozisyonlarını yarıya indir
- Butterfly pozisyonlarını değerlendir (IV crush riski)

**27 Temmuz (Pazartesi) — Kapanış Planla:**
- Tüm pozisyonlar için kapanış senaryoları hazırla
- Limit emirleri koy (kar hedefi ve stop-loss)
- FOMC öncesi son çıkış fırsatı
- Nakit rezervini %70+'ya çıkar

**28-29 Temmuz (Salı-Çarşamba) — FOMC:**
- Yeni pozisyon açma yasak
- Mevcut pozisyonları sadece izle
- FOMC kararı öncesi (13:30 ET) tüm emirleri durdur
- Karar açıklaması sonrası 30 dakika bekle (volatilite dinene kadar)

---

### 10.3 FOMC Risk Matrisi (Hisse Bazlı)

> **45+ hisse için FOMC risk seviyeleri.** Earnings tarihi ve FOMC'ye olan mesafe kritik.

| Risk Seviyesi | Hisseler | Earnings Tarihi | FOMC Mesafe | Önlem | Beta Etkisi |
|---------------|----------|-----------------|-------------|-------|-------------|
| 🟢 **DÜŞÜK** | NFLX, JPM, BAC, GS, WFC, C, MS, JNJ, PFE, ABT, BLK | 14-16 Temmuz | 12-14 gün | Normal pozisyon. FOMC'den uzak. | Düşük etki |
| 🟡 **ORTA** | TSLA, GOOGL, INTC, TMO, CRM, ORCL | 21-23 Temmuz | 5-7 gün | Yarım pozisyon. FOMC öncesi küçült. | Orta etki |
| 🔴 **YÜKSEK** | AAPL, AMZN, META, MSFT, AMD, NVDA, UNH, V, MA, ADBE | 28-30 Temmuz | 0-2 gün | **FOMC sonrası entry.** Yarım pozisyon. | Yüksek etki |
| ⚫ **EXTREME** | XOM, CVX, MRK, LLY | 31 Temmuz+ | FOMC sonrası | FOMC + GDP etkisi. Çok dikkatli. | Çok yüksek |

#### Hisse Bazlı FOMC Risk Detayları

**🟢 Düşük Risk (FOMC'den 10+ gün uzak):**
- **JPM, BAC, WFC, C, GS, MS (14 Temmuz):** Finansal sektör, FOMC'den 14 gün önce. Earnings sonrası pozisyon kapatılır, FOMC etkisi sınırlı.
- **NFLX (16 Temmuz):** Tech ama erken earnings. FOMC'den 12 gün önce.
- **JNJ, PFE, ABT (15 Temmuz):** Sağlık sektörü defansif. FOMC'den 13 gün önce.
- **BLK (21 Temmuz):** Varlık yönetimi. FOMC'den 7 gün önce. Orta risk sınırında.

**🟡 Orta Risk (FOMC'den 5-7 gün uzak):**
- **TSLA, GOOGL (22 Temmuz):** Mega-cap tech. FOMC'den 6 gün önce. Earnings sonrası pozisyon kapat, FOMC öncesi yeni açma.
- **INTC (23 Temmuz):** Yarı iletken. FOMC'den 5 gün önce. Yarım pozisyon.
- **TMO, CRM, ORCL:** FOMC'ye yakın. Dikkatli yönetim.

**🔴 Yüksek Risk (FOMC ile aynı hafta):**
- **UNH, V (28 Temmuz):** FOMC başlangıç günü! Yeni pozisyon açma.
- **MSFT, META (29 Temmuz):** FOMC karar günü! Çift volatilite.
- **AAPL, AMZN, MA, PFE (30 Temmuz):** FOMC ertesi gün + GDP. Üçlü risk.
- **AMD, NVDA:** FOMC haftasındaki tech hisseleri. Yüksek beta = yüksek risk.

**⚫ Extreme Risk (FOMC sonrası + GDP):**
- **XOM, CVX (31 Temmuz):** FOMC + GDP sonrası enerji. Jeopolitik risk ekleniyor.
- **MRK, LLY:** Sağlık ama makro etki.

---

### 10.4 4 Kriz Senaryosu (Olasılıklar, Etkiler, Stratejiler)

> **Temmuz 2026'da 4 ana kriz senaryosu tanımlanmıştır.** Her senaryo için olasılık, piyasa etkisi ve strateji önerisi sunulmuştur. VIX 19.44 mevcut seviyesi, "Yumuşak Geçiş" senaryosuna işaret ediyor.

#### Senaryo 1: "Sert İniş" (Olasılık: %25)

**Tetikleyiciler:**
- Haziran CPI %4.5+ gelir (14 Temmuz)
- FOMC Aralık artışına kesin dil kullanır (29 Temmuz)
- Q2 GDP %1 altında gelir (30 Temmuz)
- Earnings guidance'ları düşer (özellikle tech ve consumer)
- Hürmüz Boğazı'nda kesinti (jeopolitik)

**Piyasa Etkisi:**
- S&P 500: 6,800-7,000 aralığına düşebilir (-%8 / -%12)
- Nasdaq: 22,000-23,000 aralığına düşebilir (-%12 / -%15)
- VIX: 30-40 aralığına çıkabilir
- 10Y Treasury: %4.8+ çıkabilir
- DXY: 102+ çıkabilir

**Etkilenen Sektörler:**
- **Tech (Mega-cap):** -%10 / -%15 (değerlilik + faiz riski)
- **Consumer Discretionary:** -%8 / -%12 (tüketici harcamaları düşer)
- **Finansal:** Karışık (faiz artışı NIM destekler, ama kredi riski artar)
- **Enerji:** +%5 / +%10 (jeopolitik prim)
- **Sağlık:** -%3 / -%5 (defansif, sınırlı düşüş)
- **Utilities:** +%3 / +%5 (defansif kaçış)

**Strateji:**
- Tüm pozisyonları kapat (en az %80 nakit)
- Put koruma al (SPY/QQQ put spread)
- VIX call al (VIX 25+ hedefi)
- Defansif sektörlere rotasyon (XLU, XLP, XLV)
- Altın (GLD) ve tahvil (TLT) hedge
- Earnings sonrası temiz fiyatlardan pozisyon oluştur

**Opsiyon Stratejileri:**
- Long SPY Put Spread (Buy $740P / Sell $700P)
- Long VIX Call (VIX $25C)
- Long XLE Call Spread (Enerji hedge)
- Tüm IC pozisyonlarını kapat

#### Senaryo 2: "Yumuşak Geçiş" (Olasılık: %35) — **Baz Senaryo**

**Tetikleyiciler:**
- Haziran CPI %3.8-4.0 gelir (14 Temmuz)
- FOMC "veri bağımlı" kalır, Aralık beklentisi sürer (29 Temmuz)
- Q2 GDP %1.5-2.0 gelir (30 Temmuz)
- Earnings bekleneği karşılar, guidance'lar karışık
- Jeopolitik risk sınırlı kalır

**Piyasa Etkisi:**
- S&P 500: 7,200-7,600 aralığında kalır (mevcut seviyeler)
- Nasdaq: 25,000-26,500 aralığında dalgalanma
- VIX: 18-25 aralığında kalır
- 10Y Treasury: %4.4-4.7 aralığı
- DXY: 98-102 aralığı

**Etkilenen Sektörler:**
- **Tech (Mega-cap):** ±%3 (karışık, seçici hareket)
- **Finansal:** +%2 / +%5 (faiz desteği)
- **Enerji:** +%3 / +%5 (petrol $90+)
- **Sağlık:** ±%2 (istikrarlı)
- **Consumer:** -%2 / -%5 (enflasyon baskısı)

**Strateji:**
- Normal stratejiler uygula (EarningsPlay v4)
- IC pozisyonlarını koru, yarım pozisyon
- Seçici long pozisyonlar (finansal, enerji)
- Tech'te sadece güçlü guidance verenler
- FOMC öncesi pozisyon küçültme devam
- Nakit rezervi %40-50

**Opsiyon Stratejileri:**
- Iron Condor (normal boyut, yarım pozisyon FOMC haftası)
- Bull Put Spread (finansal ve enerji)
- Long Straddle (sadece güçlü katalist olanlar)
- Butterfly (IV crush'a dayanıklı)

#### Senaryo 3: "Altın Orta Yol" (Olasılık: %30)

**Tetikleyiciler:**
- Haziran CPI %4.0-4.2 gelir (14 Temmuz)
- FOMC sert ton kullanır ama faiz değiştirmez (29 Temmuz)
- Q2 GDP %1.5 civarında gelir (30 Temmuz)
- Earnings karışık, bazı guidance düşüşleri
- Jeopolitik risk artar ama kontrol altında

**Piyasa Etkisi:**
- S&P 500: 7,000-7,400 aralığında dalgalanma
- Nasdaq: 24,000-26,000 aralığında dalgalanma
- VIX: 22-30 aralığında dalgalanma
- 10Y Treasury: %4.5-4.8 aralığı
- DXY: 100-103 aralığı

**Etkilenen Sektörler:**
- **Tech:** -%5 / -%8 (sert ton + guidance düşüşü)
- **Finansal:** +%3 / +%6 (faiz artış beklentisi)
- **Enerji:** +%5 / +%10 (jeopolitik + faiz)
- **Sağlık:** ±%2 (defansif)
- **Utilities:** +%3 / +%6 (defansif kaçış)

**Strateji:**
- Seçici pozisyonlar, küçük pozisyon boyutu
- Finansal ve enerji ağırlıklı
- Tech'te sadece short veya bearish spread
- Defansif sektörlere ağırlık ver
- Nakit rezervi %50-60
- FOMC sonrası yeni pozisyon açma (temiz fiyatlar)

**Opsiyon Stratejileri:**
- Bear Call Spread (tech mega-cap)
- Bull Put Spread (finansal, enerji)
- Iron Condor (darlaştırılmış, küçük boyut)
- Long Put Spread (QQQ hedge)

#### Senaryo 4: "Ralli Sürprizi" (Olasılık: %10)

**Tetikleyiciler:**
- Haziran CPI %3.5 altında gelir (14 Temmuz)
- FOMC yumuşak mesaj verir (29 Temmuz)
- Q2 GDP %2+ gelir (30 Temmuz)
- Earnings güçlü, guidance'lar yukarı revize edilir
- Jeopolitik risk hafifler
- AI gelir dönüşü başlar

**Piyasa Etkisi:**
- S&P 500: 7,800+ yeni zirveler
- Nasdaq: 27,000+ yeni zirveler
- VIX: 15-18 aralığına düşer
- 10Y Treasury: %4.2-4.5 aralığı
- DXY: 96-99 aralığı (zayıflar)

**Etkilenen Sektörler:**
- **Tech (Mega-cap):** +%8 / +%15 (AI ralli + yumuşak Fed)
- **Finansal:** +%3 / +%5 (ekonomik büyüme)
- **Consumer:** +%5 / +%8 (tüketici gücü)
- **Enerji:** +%3 / +%5 (büyüme desteği)
- **Sağlık:** +%2 / +%4 (defansif ama pozitif)

**Strateji:**
- Aggressive call spread, long pozisyonlar artır
- Tech ağırlıklı portföy
- FOMC sonrası hızlı giriş
- VIX crush trade (short VIX)
- Earnings sonrası momentum takibi
- Nakit rezervi %20-30 (fırsatlar için)

**Opsiyon Stratejileri:**
- Aggressive Call Spread (tech mega-cap)
- Long Straddle (sadece güçlü katalist)
- Short VIX Call Spread (VIX crush)
- Long QQQ Call Spread
- Butterfly (merkezden kar, IV crush sonrası)

---

### 10.5 Genel Risk Yönetimi Kuralları

> **EarningsPlay v4.1 Risk Yönetimi Kuralları.** VIX 19.44 seviyesinde tüm kurallar %100 uygulanır.

| Kural | Detay | Eşik | Aksiyon | Öncelik |
|-------|-------|------|---------|---------|
| **Pozisyon Boyutu** | Tüm IC pozisyonları hesabın %1-2'sini geçmemeli | >%2 | Pozisyonu küçült | Kritik |
| **VIX > 25** | Pozisyonları %50 azalt | VIX 25-30 | Yarım pozisyon | Yüksek |
| **VIX > 30** | Tüm pozisyonları %25'e düşür | VIX 30-40 | Çok küçük pozisyon | Çok Yüksek |
| **VIX > 40** | Tamamen nakite geç | VIX > 40 | %100 nakit | Kritik |
| **Mekanik Çıkış** | %50 kar hedefine ulaşınca sorgusuz kapat | Kredi = $X, Kar = $0.5X | Kapat | Kritik |
| **Stop-Loss** | Kredinin 2.0x'i (%200) anında kapat | Zarar = 2x kredi | Kapat | Kritik |
| **IV Crush** | Earnings sonrası IV hızla düşer | Ertesi gün sabah | Değerlendir, erken kapanış | Yüksek |
| **Delta Nötrlüğü** | Entry anında toplam delta ±0.10 içinde olmalı | >±0.10 | Hemen ayarla | Yüksek |
| **Zaman Çıkışı** | 21 DTE'ye gelindiğinde kapat | DTE = 21 | Mekanik kapat | Yüksek |
| **FOMC Kuralı** | 24 Temmuz'dan sonra yeni pozisyon açma | 24-30 Temmuz | Yeni pozisyon yok | Kritik |
| **Blackout Kuralı** | 18-30 Temmuz Fed üyeleri konuşamaz | 18-30 Temmuz | Ekstra dikkat | Yüksek |
| **Tek Hisse Limiti** | Tek hisseye max hesabın %3'ü | >%3 | Pozisyon böl | Kritik |
| **Sektör Limiti** | Tek sektöre max hesabın %15'i | >%15 | Çeşitlendir | Yüksek |

#### Risk Yönetimi Detayları

**Pozisyon Boyutu Hesaplama:**
```
Hesap Büyüklüğü = $10,000
Max Pozisyon/Hisse = $10,000 x %1.5 = $150
Max Toplam Risk = $10,000 x %10 = $1,000
Max Sektör Risk = $10,000 x %15 = $1,500
```

**VIX Bazlı Pozisyon Ayarlama (VIX 19.44):**
- VIX < 15: %120 normal pozisyon (primler ucuz, fırsat artar)
- VIX 15-20: %100 normal pozisyon (mevcut durum)
- VIX 20-25: %75 normal pozisyon (primler pahalanıyor)
- VIX 25-30: %50 normal pozisyon (risk artıyor)
- VIX 30-40: %25 normal pozisyon (yüksek risk)
- VIX > 40: %0 pozisyon (tamamen nakit)

**Mekanik Çıkış Örneği:**
- Iron Condor kredisi = $250
- Kar hedefi = $125 (%50 kredi)
- Stop-loss = $500 (2x kredi)
- Eğer pozisyon $125 kar gösteriyorsa → SORGUSUZ KAPAT
- Eğer pozisyon $500 zarar gösteriyorsa → ANINDA KAPAT

---

### 10.6 Risk Matrisi (Olasılık × Etki)

> **45+ hisse ve makro riskler için olasılık-etki matrisi.** VIX 19.44 seviyesinde piyasa "sakin görünümlü ama tetikte".

| Risk | Olasılık | Etki | Earnings Etkisi | VIX Etkisi | Sektör Etkisi | Önlem |
|------|----------|------|-----------------|------------|---------------|-------|
| **FOMC'de Sert Ton** | Yüksek (%60) | Yüksek | Finansallar pozitif, Tech negatif | VIX +3-5 | Tech satışı | FOMC öncesi küçült |
| **CPI Beklentiyi Aşma** | Yüksek (%55) | Çok Yüksek | Tahvil satışı, hisse düşüşü | VIX +5-10 | Genel satış | CPI öncesi hedge |
| **Hürmüz'de Kesinti** | Orta (%30) | Çok Yüksek | Enerji fiyatları şok, stagflasyon | VIX +5-8 | Enerji +, diğer - | Enerji hedge |
| **Guidance Düşüşü** | Orta (%40) | Yüksek | Özellikle tech ve consumer | VIX +2-4 | Tech -, Defensive + | Seçici pozisyon |
| **GDP Düşük Gelme** | Düşük-Orta (%25) | Yüksek | Resesyon endişesi | VIX +3-6 | Genel satış | Defensive rotasyon |
| **USD Sert Yükselme** | Orta (%35) | Orta | Çok uluslu şirketlerde kar düşüşü | VIX +1-2 | İhracatçı - | Döviz hedge |
| **AI Yatırım Dönüşü Sorgulanması** | Orta (%30) | Yüksek | NVDA, MSFT, GOOGL baskı | VIX +2-4 | AI/Tech - | AI hisselerinde seçici |
| **Bankacılık Kredi Kalitesi** | Düşük (%20) | Çok Yüksek | Finansal sektör çöküşü | VIX +8-12 | Finansal - | Finansal put hedge |
| **Cyber Attack / Sistem Riski** | Çok Düşük (%5) | Çok Yüksek | Teknoloji altyapı riski | VIX +5-10 | Tech - | Genel hedge |
| **Çin Ekonomik Yavaşlama** | Orta (%35) | Orta-Yüksek | Küresel büyüme endişesi | VIX +2-4 | Çok uluslu - | EM hedge |

#### Risk Matrisi Yorumu

**En Yüksek Risk Kombinasyonu:**
- CPI %4.5+ + FOMC sert ton + Guidance düşüşü = "Sert İniş" senaryosu (%25 olasılık)
- Bu kombinasyon VIX'i 30-40 aralığına taşıyabilir
- Etki: S&P 500 -%8 / -%12

**Orta Risk Kombinasyonu:**
- CPI %4.0-4.2 + FOMC nötr + Karışık earnings = "Altın Orta Yol" senaryosu (%30 olasılık)
- VIX 22-30 aralığında dalgalanma
- Etki: S&P 500 ±%3-5

**Düşük Risk Kombinasyonu:**
- CPI %3.8-4.0 + FOMC yumuşak + Güçlü earnings = "Yumuşak Geçiş" senaryosu (%35 olasılık)
- VIX 18-25 aralığında kalır
- Etki: S&P 500 ±%2

---

### 10.7 YENİ: VIX Bazlı Pozisyon Boyutu Rehberi

> **VIX seviyesine göre dinamik pozisyon boyutu ayarlama.** VIX 19.44 mevcut seviye. Bu rehber, 45+ hisse için genel bir çerçeve sunar.

#### VIX Seviyeleri ve Pozisyon Boyutları

| VIX Seviyesi | Piyasa Durumu | Pozisyon Boyutu | Max Risk/Hisse | Max Toplam Risk | Strateji Tercihi | Örnek Hesap ($10K) |
|--------------|---------------|-----------------|----------------|-----------------|------------------|-------------------|
| **< 15** | Çok sakin | %120 normal | %1.8 | %12 | Aggressive IC, Long Straddle | $180/hisse, $1,200 toplam |
| **15-18** | Sakin | %100 normal | %1.5 | %10 | Normal IC, Debit Spread | $150/hisse, $1,000 toplam |
| **18-22** | Normal (mevcut: 19.44) | %100 normal | %1.5 | %10 | Normal IC, Butterfly | $150/hisse, $1,000 toplam |
| **22-25** | Tetikte | %75 normal | %1.1 | %7.5 | Dar IC, Butterfly | $110/hisse, $750 toplam |
| **25-30** | Yüksek volatilite | %50 normal | %0.75 | %5 | Butterfly, Calendar | $75/hisse, $500 toplam |
| **30-35** | Çok yüksek | %25 normal | %0.4 | %2.5 | Calendar, Hedge | $40/hisse, $250 toplam |
| **35-40** | Panik | %10 normal | %0.15 | %1 | Sadece hedge | $15/hisse, $100 toplam |
| **> 40** | Çöküş | %0 | %0 | %0 | Tamamen nakit | $0 |

#### VIX Bazlı Strateji Seçimi

**VIX < 15 (Çok Sakin):**
- **Strateji:** Aggressive Iron Condor (geniş kanat), Long Straddle
- **Neden:** Primler ucuz, IV crush potansiyeli yüksek
- **Risk:** Düşük volatilite = sınırlı hareket
- **Örnek:** SPX 10-point IC, ~$1 prim

**VIX 15-22 (Sakin-Normal):**
- **Strateji:** Normal Iron Condor, Debit Spread, Butterfly
- **Neden:** Optimal risk/ödül, primler makul
- **Risk:** Normal volatilite = normal hareket
- **Örnek:** Hisse başına $150 risk, 5-10 pozisyon

**VIX 22-30 (Tetikte-Yüksek):**
- **Strateji:** Dar IC, Butterfly, Calendar Spread
- **Neden:** Primler pahalanıyor, risk artıyor
- **Risk:** Yüksek volatilite = beklenmedik hareket
- **Örnek:** Hisse başına $75 risk, 3-5 pozisyon

**VIX 30-40 (Panik):**
- **Strateji:** Calendar Spread, Hedge (put), VIX call
- **Neden:** Primler çok pahalı, IV crush riski yüksek
- **Risk:** Çok yüksek volatilite = büyük kayıp potansiyeli
- **Örnek:** Hisse başına $40 risk, sadece hedge

**VIX > 40 (Çöküş):**
- **Strateji:** Tamamen nakit, VIX call, SPY put
- **Neden:** Piyasa çöküşü, her şey riskli
- **Risk:** Maksimum risk
- **Örnek:** %100 nakit, sadece hedge pozisyonları

#### VIX Earnings Kombinasyonu

| VIX | Earnings IV Rank | Strateji | Pozisyon | Kazanma Olasılığı |
|-----|------------------|----------|----------|-------------------|
| < 15 | >%50 | Iron Condor (geniş) | %120 | %65-70 |
| 15-22 | >%50 | Iron Condor (wider wings) | %100 | %60-65 |
| 19.44 (mevcut) | >%50 | Iron Condor (normal) | %100 | %60-65 |
| 22-30 | >%50 | Reduced size IC veya Long Straddle | %50 | %50-55 |
| 22-30 | <%60 | Long Straddle (güçlü katalist) | %50 | %35-45 |
| 30-40 | Herhangi | Long Straddle/Strangle veya nakit | %25 | %30-40 |
| > 40 | Herhangi | Kaç veya VIX call hedge | %0-10 | Spekülatif |

---

### 10.8 YENİ: Blackout Dönemi Protokolü (18-30 Temmuz 2026)

> **Fed Blackout Dönemi:** Fed üyelerinin kamuoyu önünde konuşması yasaktır. Bu dönemde piyasa "sessiz" kalır ama belirsizlik artar. VIX 19.44 seviyesinde blackout başladığında VIX genellikle 1-2 puan artar.

#### Blackout Dönemi Takvimi

| Tarih | Gün | Durum | Piyasa Etkisi | Strateji |
|-------|-----|-------|-------------|----------|
| **17 Temmuz** | Cuma | Blackout öncesi son gün | Normal | Son pozisyon değerlendirmesi |
| **18 Temmuz** | Cumartesi | **BLACKOUT BAŞLIYOR** | VIX +1-2 | Yeni pozisyon açmayı azalt |
| **19-25 Temmuz** | Pazar-Cuma | Blackout devam | Belirsizlik artar | Pozisyon küçültme devam |
| **26-27 Temmuz** | Pazar-Pazartesi | Blackout + FOMC yaklaşıyor | VIX +2-4 | Agresif küçültme |
| **28-29 Temmuz** | Salı-Çarşamba | **FOMC TOPLANTISI** | Maksimum belirsizlik | Yeni pozisyon yok |
| **30 Temmuz** | Perşembe | Blackout sona eriyor | Karar etkisi | Yeni değerlendirme |
| **31 Temmuz** | Cuma | Blackout sonrası ilk gün | FedSpeak başlar | Normal pozisyona dönüş başla |

#### Blackout Dönemi Kuralları

1. **18 Temmuz'dan itibaren:**
   - Yeni agresif pozisyon açmayı durdur
   - Mevcut pozisyonları yönet (kapatma odaklı)
   - VIX seviyesini günde 2 kez kontrol et
   - FOMC öncesi pozisyon küçültme planını gözden geçir

2. **24 Temmuz'dan itibaren (FOMC'ye 4 gün kala):**
   - Tamamen yeni pozisyon açmayı durdur
   - Sadece mevcut pozisyon kapatma
   - Nakit rezervini %60+'ya çıkar
   - Tüm açık emirleri iptal et

3. **28-29 Temmuz (FOMC günleri):**
   - Yeni pozisyon açma yasak
   - Mevcut pozisyonları sadece izle
   - FOMC kararı öncesi (13:30 ET) tüm emirleri durdur
   - Karar açıklaması sonrası 30 dakika bekle
   - Kevin Warsh'ın basın konferansı tonunu analiz et

4. **30-31 Temmuz (FOMC sonrası):**
   - Yeni değerlendirmelere başla
   - FOMC tonuna göre strateji revizyonu
   - GDP verisi (30 Temmuz) + ECI (31 Temmuz) etkisini izle
   - Normal pozisyona dönüş planla

#### Blackout Dönemi Risk Yönetimi

| Risk | Olasılık | Etki | Önlem |
|------|----------|------|-------|
| Sessiz piyasa = sürpriz şok | Orta | Yüksek | Nakit rezervi artır |
| FOMC öncesi VIX spike | Yüksek | Orta | VIX hedge (call) |
| Likidite daralması | Orta | Orta | Sadece likit hisselerde kal |
| Earnings + FOMC çakışması | Yüksek | Çok Yüksek | Çift volatilite hedge |
| Fed üyesi sızıntısı (yasa dışı) | Çok Düşük | Çok Yüksek | Hızlı pozisyon ayarlama |

---

## 11. PORTFÖY ÖNERİLERİ

> **5 farklı bütçe seviyesi için portföy önerileri:** $1,000 (Mikro), $5,000 (Küçük), $10,000 (Orta), $25,000 (Büyük), $50,000 (Profesyonel).  
> **VIX 19.44 = %100 normal pozisyon.** FOMC öncesi (24 Temmuz) tüm portföylerde pozisyon küçültme uygulanır.  
> **45+ hisse** arasından seçilmiş, çeşitlendirilmiş portföyler.

---

### 11.1 $1,000 Portföy (Mikro Başlangıç)

> **Hedef:** Sınırlı sermayeyle earnings IV expansion'dan faydalanmak. Yüksek risk, öğrenme odaklı.

| Hisse | Strateji | Maliyet | Ağırlık | FOMC Risk | Beta |
|-------|----------|---------|---------|-----------|------|
| AMD | Call Lottery Ticket | $42 | %4 | 🔴 | 2.49 |
| TSLA | Call Lottery Ticket | $35 | %4 | 🟡 | 1.80 |
| NFLX | Call Lottery Ticket | $39 | %4 | 🟢 | 1.49 |
| NVDA | Call Lottery Ticket | $19 | %2 | 🔴 | 2.20 |
| META | Call Lottery Ticket | $18 | %2 | 🔴 | 1.23 |
| NFLX | Debit Call Spread | $86 | %9 | 🟢 | 1.49 |
| AMD | Debit Call Spread | $191 | %19 | 🔴 | 2.49 |
| BAC | Put Lottery + Spread | $108 | %11 | 🟢 | 1.25 |
| **Nakit (Rezerv)** | | **$462** | **%46** | | |
| **TOPLAM** | | **$1,000** | **100%** | | |

**Portföy Yorumu:**
- **5 lottery ticket** = Yüksek volatilite oyunu (%16 ağırlık)
- **2 debit spread** = Risk sınırlı temel pozisyon (%28 ağırlık)
- **1 put kombinasyon** = Bearish hedge (%11 ağırlık)
- **46% nakit** = FOMC sonrası fırsatlar için
- **Max risk:** ~$538 (nakit hariç)
- **FOMC Uyumu:** 24 Temmuz'dan önce açılır, 26 Temmuz'da %50 kapatılır
- **VIX 19.44 Etkisi:** Normal pozisyon, primler makul

---

### 11.2 $5,000 Portföy (Küçük Ölçekli)

> **Hedef:** Çeşitlendirilmiş kredi toplama + IV crush hedge. Orta risk.

| Hisse | Strateji | Maliyet | Ağırlık | FOMC Risk | Sektör |
|-------|----------|---------|---------|-----------|--------|
| AMD | Iron Condor | ~$250 | %5 | 🔴 | Tech |
| UNH | Bull Call Spread | ~$330 | %7 | 🔴 | Sağlık |
| NFLX | Iron Condor + Bear Put | ~$200 | %4 | 🟢 | Tech |
| XOM | Bull Put Spread | ~$185 | %4 | ⚫ | Enerji |
| BAC | Bull Put Spread + Call | ~$150 | %3 | 🟢 | Finansal |
| TSLA | IC (Yarım Pozisyon) | ~$250 | %5 | 🟡 | Tech |
| GOOGL | IC (Yarım Pozisyon) | ~$200 | %4 | 🟡 | Tech |
| BA | Iron Condor | ~$200 | %4 | 🔴 | Havacılık |
| AMD | Call Butterfly | ~$216 | %4 | 🔴 | Tech |
| JPM | Bear Call Spread | ~$150 | %3 | 🟢 | Finansal |
| **Nakit (Rezerv)** | | **~$2,569** | **~%51** | | |
| **TOPLAM** | | **$5,000** | **100%** | | |

**Portföy Yorumu:**
- **6 IC/Bull spread pozisyonu** = Çeşitlendirilmiş kredi toplama (%28 ağırlık)
- **2 butterfly** = IV crush'a dayanıklı (%8 ağırlık)
- **1 bearish spread** = Hedge (%3 ağırlık)
- **51% nakit** = FOMC sonrası ve düzeltme alımları için
- **Sektör Dağılımı:** Tech %22, Finansal %6, Sağlık %7, Enerji %4, Havacılık %4
- **FOMC Uyumu:** 24 Temmuz'dan önce açılır, 26 Temmuz'da %50 kapatılır
- **VIX 19.44 Etkisi:** Normal pozisyon, 10 pozisyon optimal

---

### 11.3 $10,000 Portföy (Orta Ölçekli)

> **Hedef:** Dengeli büyüme + gelir stratejisi. Daha fazla çeşitlendirme.

| Hisse | Strateji | Maliyet | Ağırlık | FOMC Risk | Sektör |
|-------|----------|---------|---------|-----------|--------|
| AMD | Iron Condor (Asimetrik) | $500 | %5 | 🔴 | Tech |
| UNH | Bull Call Spread (3x) | $990 | %10 | 🔴 | Sağlık |
| XOM | Bull Put Spread (4x) | ~$400 | %4 | ⚫ | Enerji |
| BA | Iron Condor (2x) | ~$400 | %4 | 🔴 | Havacılık |
| NFLX | IC + Bear Put Spread | ~$400 | %4 | 🟢 | Tech |
| TSLA | IC (Yarım Pozisyon) | ~$500 | %5 | 🟡 | Tech |
| GS | Iron Condor | ~$400 | %4 | 🟢 | Finansal |
| BAC | Bull Put Spread (3x) | ~$300 | %3 | 🟢 | Finansal |
| AMD/NVDA | Butterfly Kombinasyon | ~$500 | %5 | 🔴 | Tech |
| GOOGL | Debit Call Spread (2x) | ~$400 | %4 | 🟡 | Tech |
| AMZN | Butterfly | ~$300 | %3 | 🔴 | Tech |
| JPM | Bear Call Spread (2x) | ~$300 | %3 | 🟢 | Finansal |
| **Nakit (Rezerv)** | | **~$5,610** | **~%56** | | |
| **TOPLAM** | | **$10,000** | **100%** | | |

**Portföy Yorumu:**
- **8 IC/Bull spread pozisyonu** = Çeşitlendirilmiş kredi toplama (%38 ağırlık)
- **3 butterfly** = IV crush'a dayanıklı (%12 ağırlık)
- **2 bearish spread** = Hedge (%6 ağırlık)
- **56% nakit** = FOMC sonrası fırsatlar için
- **Sektör Dağılımı:** Tech %25, Finansal %9, Sağlık %10, Enerji %4, Havacılık %4
- **FOMC Uyumu:** 24 Temmuz'dan önce açılır, 26 Temmuz'da %50 kapatılır
- **VIX 19.44 Etkisi:** Normal pozisyon, 12 pozisyon optimal

---

### 11.4 $25,000 Portföy (Büyük Ölçekli)

> **Hedef:** Profesyonel çeşitlendirme + sektörel rotasyon. Aktif yönetim.

| Hisse | Strateji | Maliyet | Ağırlık | FOMC Risk | Sektör |
|-------|----------|---------|---------|-----------|--------|
| AMD | Iron Condor (2x) | $1,000 | %4 | 🔴 | Tech |
| UNH | Bull Call Spread (6x) | $1,980 | %8 | 🔴 | Sağlık |
| XOM | Bull Put Spread (8x) | ~$800 | %3 | ⚫ | Enerji |
| BA | Iron Condor (4x) | ~$800 | %3 | 🔴 | Havacılık |
| NFLX | IC (2x) + Bear Put | ~$800 | %3 | 🟢 | Tech |
| TSLA | IC (1x) | ~$500 | %2 | 🟡 | Tech |
| GOOGL | IC (1x) | ~$400 | %2 | 🟡 | Tech |
| AAPL | IC (1x) | ~$400 | %2 | 🔴 | Tech |
| META | IC (1x) | ~$500 | %2 | 🔴 | Tech |
| GS | Iron Condor (2x) | ~$800 | %3 | 🟢 | Finansal |
| AMZN | IC (1x) | ~$400 | %2 | 🔴 | Tech |
| JPM | Bear Call Spread (2x) | ~$400 | %2 | 🟢 | Finansal |
| BAC | Bull Put Spread (5x) | ~$500 | %2 | 🟢 | Finansal |
| NVDA | Butterfly (2x) | ~$500 | %2 | 🔴 | Tech |
| CRM | Debit Call Spread (3x) | ~$600 | %2 | 🟡 | Tech |
| **Nakit (Rezerv)** | | **~$14,620** | **~%58** | | |
| **TOPLAM** | | **$25,000** | **100%** | | |

**Portföy Yorumu:**
- **12 IC/Bull spread pozisyonu** = Çeşitlendirilmiş kredi toplama (%35 ağırlık)
- **4 butterfly** = IV crush'a dayanıklı (%9 ağırlık)
- **3 bearish spread** = Hedge (%7 ağırlık)
- **58% nakit** = FOMC sonrası ve büyük fırsatlar için
- **Sektör Dağılımı:** Tech %22, Finansal %11, Sağlık %8, Enerji %3, Havacılık %3
- **FOMC Uyumu:** 24 Temmuz'dan önce açılır, 26 Temmuz'da %50 kapatılır
- **VIX 19.44 Etkisi:** Normal pozisyon, 15 pozisyon optimal

---

### 11.5 YENİ: $50,000 Portföy (Profesyonel)

> **Hedef:** Kurumsal düzeyde risk yönetimi + sektörel ağırlıklandırma + hedge stratejileri. Aktif delta nötrlüğü.

| Hisse | Strateji | Maliyet | Ağırlık | FOMC Risk | Sektör | Greeks Hedefi |
|-------|----------|---------|---------|-----------|--------|---------------|
| AMD | Iron Condor (4x) | $2,000 | %4 | 🔴 | Tech | Delta ±0.05 |
| UNH | Bull Call Spread (12x) | $3,960 | %8 | 🔴 | Sağlık | Delta +0.10 |
| XOM | Bull Put Spread (16x) | $1,600 | %3 | ⚫ | Enerji | Delta -0.05 |
| BA | Iron Condor (8x) | $1,600 | %3 | 🔴 | Havacılık | Delta ±0.05 |
| NFLX | IC (4x) + Bear Put | $1,600 | %3 | 🟢 | Tech | Delta ±0.03 |
| TSLA | IC (2x) + Butterfly | $1,500 | %3 | 🟡 | Tech | Delta ±0.05 |
| GOOGL | IC (2x) + Calendar | $1,200 | %2 | 🟡 | Tech | Delta ±0.05 |
| AAPL | IC (2x) + Calendar | $1,200 | %2 | 🔴 | Tech | Delta ±0.05 |
| META | IC (2x) + Ratio | $1,500 | %3 | 🔴 | Tech | Delta ±0.03 |
| GS | Iron Condor (4x) | $1,600 | %3 | 🟢 | Finansal | Delta ±0.05 |
| AMZN | IC (2x) + Butterfly | $1,200 | %2 | 🔴 | Tech | Delta ±0.05 |
| JPM | Bear Call Spread (4x) | $800 | %2 | 🟢 | Finansal | Delta -0.05 |
| BAC | Bull Put Spread (10x) | $1,000 | %2 | 🟢 | Finansal | Delta -0.05 |
| NVDA | Butterfly (4x) + IC | $1,500 | %3 | 🔴 | Tech | Delta ±0.03 |
| CRM | Debit Call Spread (6x) | $1,200 | %2 | 🟡 | Tech | Delta +0.08 |
| V | Iron Condor (2x) | $800 | %2 | 🔴 | Finansal | Delta ±0.05 |
| MA | Iron Condor (2x) | $800 | %2 | 🔴 | Finansal | Delta ±0.05 |
| JNJ | Bull Call Spread (5x) | $850 | %2 | 🟢 | Sağlık | Delta +0.05 |
| PFE | Bull Put Spread (8x) | $600 | %1 | 🟢 | Sağlık | Delta -0.03 |
| QQQ | Put Hedge (2x) | $400 | %1 | | Hedge | Delta -0.02 |
| SPY | Put Hedge (1x) | $300 | %1 | | Hedge | Delta -0.01 |
| **Nakit (Rezerv)** | | **~$24,790** | **~%50** | | | |
| **TOPLAM** | | **$50,000** | **100%** | | | |

**Portföy Yorumu:**
- **18 IC/Bull spread pozisyonu** = Çeşitlendirilmiş kredi toplama (%38 ağırlık)
- **6 butterfly/calendar** = IV crush'a dayanıklı (%12 ağırlık)
- **4 bearish spread** = Hedge (%8 ağırlık)
- **2 index put hedge** = Genel piyasa hedge (%2 ağırlık)
- **50% nakit** = FOMC sonrası ve büyük fırsatlar için
- **Sektör Dağılımı:** Tech %25, Finansal %15, Sağlık %13, Enerji %3, Havacılık %3
- **FOMC Uyumu:** 24 Temmuz'dan önce açılır, 26 Temmuz'da %50 kapatılır
- **VIX 19.44 Etkisi:** Normal pozisyon, 22 pozisyon optimal
- **Greeks Nötrlüğü:** Portföy delta hedefi ±0.10

---

### 11.6 Pozisyon Büyüklüğü Tablosu (Hesap Bazlı)

> **45+ hisse için hesap büyüklüğüne göre pozisyon büyüklüğü rehberi.** VIX 19.44 = %100 normal pozisyon.

| Hesap Büyüklüğü | Pozisyon/Hisse (Max) | Max Pozisyon Sayısı | UNH Örneği | BA Örneği | XOM Örneği | AMD Örneği |
|-----------------|---------------------|---------------------|------------|-----------|------------|------------|
| **$1,000** | %2 = $20 | 3-5 | N/A | N/A | N/A | 1 kontrat |
| **$2,500** | %2 = $50 | 5-8 | N/A | N/A | N/A | 1 kontrat |
| **$5,000** | %1.5 = $75 | 8-12 | 1 kontrat | 1 kontrat | 1 kontrat | 1 kontrat |
| **$10,000** | %1.5 = $150 | 10-15 | 2 kontrat | 2 kontrat | 2 kontrat | 1 kontrat |
| **$25,000** | %1.5 = $375 | 15-20 | 5 kontrat | 4 kontrat | 4 kontrat | 2 kontrat |
| **$50,000** | %1 = $500 | 20-25 | 7 kontrat | 6 kontrat | 6 kontrat | 3 kontrat |
| **$100,000** | %1 = $1,000 | 25-30 | 15 kontrat | 12 kontrat | 12 kontrat | 5 kontrat |
| **$250,000** | %0.75 = $1,875 | 30-40 | 28 kontrat | 22 kontrat | 22 kontrat | 10 kontrat |
| **$500,000** | %0.5 = $2,500 | 40-50 | 38 kontrat | 30 kontrat | 30 kontrat | 15 kontrat |

#### Pozisyon Büyüklüğü Hesaplama Formülü

```
Max Pozisyon/Hisse = Hesap Büyüklüğü x (%1.5 - %0.5 arası)

VIX Ayarlaması:
- VIX < 15: Çarpan x 1.2
- VIX 15-22: Çarpan x 1.0 (mevcut: 19.44)
- VIX 22-30: Çarpan x 0.5
- VIX 30-40: Çarpan x 0.25
- VIX > 40: Çarpan x 0

Örnek ($10,000 hesap, VIX 19.44):
Max Pozisyon/Hisse = $10,000 x %1.5 = $150
Max Toplam Risk = $10,000 x %10 = $1,000
```

---

### 11.7 Sektör Bazlı Portföy Önerisi

> **45+ hisse arasından sektörel ağırlıklandırma.** VIX 19.44 ve FOMC bağlamında sektör tavsiyeleri.

| Varlık Sınıfı | Tavsiye | Hedef Ağırlık | Gerekçe | Risk | Önerilen Hisseler |
|---------------|---------|---------------|---------|------|-------------------|
| **S&P 500 / Büyüme Hisse** | Nötr-Azalt | %10-15 | Yüksek değerlilik, guidance riski | Yüksek | SPY, QQQ hedge |
| **Teknoloji (Mega-cap)** | Seçici Tut | %20-25 | AI temalı ama değerlilik yüksek | Yüksek | AAPL, MSFT, GOOGL, META, AMZN |
| **Teknoloji (Yarı İletken)** | Seçici Tut | %5-8 | AI yatırımları ama volatilite yüksek | Çok Yüksek | NVDA, AMD, INTC, AVGO, QCOM |
| **Teknoloji (Yazılım/Cloud)** | Tut | %5-8 | Bulut büyümesi devam ediyor | Orta | CRM, ORCL, SNOW, DDOG |
| **Teknoloji (Cybersecurity)** | Artır | %5-8 | Jeopolitik risk = güvenlik harcamaları artar | Orta | CRWD, PANW, ZS, NET |
| **Finansal (Banka)** | Artır | %10-12 | Faiz artış beklentisi, NIM desteği | Orta | JPM, BAC, WFC, C, GS, MS |
| **Finansal (Ödeme)** | Tut | %3-5 | Defansif, istikrarlı | Düşük | V, MA, PYPL |
| **Sağlık (İlaç)** | Tut | %5-7 | Defansif, istikrarlı earnings | Düşük | JNJ, PFE, MRK, LLY |
| **Sağlık (Medikal/Biyotek)** | Tut | %3-5 | Defansif, istikrarlı | Düşük | ABT, TMO, UNH |
| **Enerji** | Artır | %5-7 | Petrol $90+, sektör büyümesi pozitif | Orta | XOM, CVX, COP |
| **Havacılık/Endüstri** | Nötr | %2-3 | BA riskli, diğerleri stabil | Orta | BA, LMT, RTX, CAT |
| **Tüketici (Perakende)** | Azalt | %2-3 | Enflasyon baskısı, harcamalar düşebilir | Yüksek | HD, WMT, NKE, MCD |
| **Tüketici (İçecek/Staples)** | Tut | %2-3 | Defansif, istikrarlı | Düşük | KO, PEP, SBUX |
| **Medya/Telekom** | Nötr | %1-2 | DIS riskli, diğerleri stabil | Orta | DIS, CMCSA, VZ |
| **Ulaşım/Lojistik** | Nötr | %1-2 | Ekonomik büyümeye bağlı | Orta | UPS, FDX |
| **Tahvil (10Y)** | Azalt | %0-3 | Getiri yükseliş trendi | Yüksek | TLT, IEF |
| **Altın** | Artır | %3-5 | Jeopolitik hedge, $4,000+ hedef | Orta | GLD, IAU |
| **Petrol (Fiziki)** | Nötr | %0-2 | $90-100 aralığında dalgalanma | Yüksek | USO, XLE |
| **Nakit** | Tut | %40-60 | FOMC sonrası fırsatlar için | Düşük | USD |

#### Sektör Bazlı Strateji Önerileri

**Artırılacak Sektörler:**
- **Finansal:** Faiz artış beklentisi + NIM genişlemesi = Bull Put Spread, Iron Condor
- **Enerji:** Petrol $90+ = Bull Call Spread, Long Call
- **Cybersecurity:** Jeopolitik risk = Bull Call Spread, Long Straddle
- **Altın:** Jeopolitik hedge = Long GLD Call, GLD Butterfly

**Azaltılacak Sektörler:**
- **Tech Mega-cap:** Değerlilik + guidance riski = Bear Call Spread, azaltılmış long
- **Tüketici Discretionary:** Enflasyon baskısı = Bear Put Spread, azaltılmış long
- **Tahvil:** Getiri yükselişi = Short TLT, azaltılmış tahvil

**Nötr Tutulacak Sektörler:**
- **Sağlık:** Defansif = Bull Call Spread, Iron Condor
- **Tüketici Staples:** Defansif = Bull Put Spread, Iron Condor
- **Medya/Telekom:** Karışık = Seçici pozisyon

---

### 11.8 YENİ: Greeks Nötrlüğü Dashboard

> **Portföy düzeyinde Greeks yönetimi.** Delta, Gamma, Theta, Vega nötrlüğü hedefleri. VIX 19.44 seviyesinde optimal Greeks değerleri.

#### Greeks Hedefleri (Portföy Düzeyinde)

| Greek | Hedef | Uyarı Eşiği | Kritik Eşik | Düzeltme Aksiyonu |
|-------|-------|-------------|-------------|-------------------|
| **Delta** | -0.10 ile +0.10 | ±0.15 | ±0.25 | Pozisyon ekle/çıkar, hedge |
| **Gamma** | Düşük (nötr) | >±0.05 | >±0.10 | 21 DTE'de çıkış, pozisyon küçült |
| **Theta** | Pozitif (kredi stratejileri) | <0 | <-$50/gün | Kredi stratejisi artır, debit azalt |
| **Vega** | Hafif negatif (IV crush'tan kazanç) | >±500 | >±1000 | Vega nötr hedge ekle |
| **Rho** | Nötr | >±100 | >±200 | Faiz hassasiyeti hedge |

#### Hisse Bazlı Greeks Hedefleri (45+ Hisse)

| Hisse | Delta Hedef | Gamma Hedef | Theta Hedef | Vega Hedef | Rho Hedef | Strateji |
|-------|-------------|-------------|-------------|------------|-----------|----------|
| AMD | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | IC, Butterfly |
| TSLA | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | IC, Butterfly |
| NVDA | ±0.03 | Çok Düşük | Pozitif | Hafif Negatif | Nötr | Butterfly |
| META | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | IC, Ratio |
| AAPL | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | IC, Calendar |
| MSFT | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | IC, Calendar |
| AMZN | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | IC, Butterfly |
| GOOGL | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | IC, Calendar |
| NFLX | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | IC, Bear Put |
| JPM | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | Bear Call, IC |
| BAC | ±0.03 | Düşük | Pozitif | Hafif Negatif | Nötr | Bull Put, IC |
| GS | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | IC, Put Fly |
| UNH | +0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | Bull Call |
| XOM | -0.03 | Düşük | Pozitif | Hafif Negatif | Nötr | Bull Put, Put Fly |
| JNJ | +0.03 | Düşük | Pozitif | Hafif Negatif | Nötr | Bull Call, Butterfly |

#### Greeks Nötrlüğü Kontrol Listesi (Günlük)

```
[ ] Portföy Delta: -0.10 ile +0.10 arasında mı?
[ ] Portföy Gamma: Düşük mü? (21 DTE'de çıkış planlı mı?)
[ ] Portföy Theta: Pozitif mi? (Kredi stratejileri ağırlıklı mı?)
[ ] Portföy Vega: Hafif negatif mi? (IV crush'tan kazanç hedefleniyor mu?)
[ ] Hisse başına Delta: ±0.05 arasında mı?
[ ] Sektör bazlı Delta: Tek sektörde aşırı pozitif/negatif var mı?
[ ] FOMC yaklaşıyor: Delta nötrlüğü daha sıkı mı? (±0.05)
[ ] VIX > 25: Delta nötrlüğü daha sıkı mı? (±0.03)
```

#### Greeks Düzeltme Stratejileri

**Delta Çok Pozitif (+0.15+):**
- Bear Call Spread ekle
- Put alımı (hedge)
- Long pozisyonları azalt
- Index put (SPY/QQQ) al

**Delta Çok Negatif (-0.15-):**
- Bull Put Spread ekle
- Call alımı (hedge)
- Short pozisyonları azalt
- Index call (SPY/QQQ) al

**Gamma Çok Yüksek:**
- 21 DTE'ye yaklaşan pozisyonları kapat
- Daha uzun vadeli pozisyonlara geç
- Butterfly stratejileri artır (gamma düşük)

**Theta Negatif:**
- Debit spread'leri azalt
- Kredi stratejileri artır (IC, Short Straddle)
- Calendar spread ekle (theta pozitif)

**Vega Çok Pozitif:**
- Short straddle/IC ekle (short vega)
- IV crush'tan zarar riski yüksek
- Butterfly artır (vega nötr)

---

## 12. EYLEM PLANI VE HAFTALIK TAKVİM

> **5 haftalık detaylı eylem planı.** Her gün için spesifik aksiyonlar, öncelikler ve kontrol listeleri.  
> **VIX 19.44 = Normal pozisyon.** FOMC (28-29 Temmuz) kritik dönüm noktası.  
> **45+ hisse** için earnings tarihleri ve stratejiler entegre edilmiştir.

---

### 12.1 Haftalık Eylem Planı (5 Hafta, Günlük Detaylı)

#### 1. HAFTA: 1-6 Temmuz — HAZIRLIK DÖNEMİ

> **Hedef:** Makro veri takibi, hisse seçimi, strateji planlama. Pozisyon açma için hazırlık.

| Gün | Tarih | Eylem | Detay | Öncelik | İlgili Hisse |
|-----|-------|-------|-------|---------|--------------|
| Çarşamba | 2 Temmuz | **NFP verisini izle** | 170K altı = dovish (olumlu), 200K üstü = hawkish (riskli). İşsizlik oranı ve ortalama saatlik kazancı da izle. | ÇOK YÜKSEK | Tüm portföy |
| Perşembe | 3 Temmuz | **ISM Hizmet PMI verisini izle** | 50+ = genişleme, 50- = daralma. Hizmet sektörü enflasyonu etkiler. | YÜKSEK | Tüm portföy |
| Cuma | 4 Temmuz | **ABD Bağımsızlık Günü — Piyasa Kapalı** | Tatil günü. Hafta sonu analiz yap. | DÜŞÜK | — |
| Cumartesi | 5 Temmuz | Hafta sonu analizi | NFP ve ISM verilerini değerlendir. Hisse seçimi ve strateji planla. | ORTA | Tüm portföy |
| Pazar | 6 Temmuz | **FOMC Haziran tutanaklarını incele** | Fed üyelerinin tonunu analiz et. "Savaşçı güvercin" (hawkish dove) sinyalleri ara. | YÜKSEK | Tüm portföy |

**1. Hafta Kontrol Listesi:**
```
[ ] NFP verisi (2 Temmuz) — 170K altı = dovish, 200K üstü = hawkish
[ ] İşsizlik oranı (2 Temmuz) — 4.3% beklenti
[ ] Ortalama saatlik kazanç (2 Temmuz) — +0.3% A/A beklenti
[ ] ISM Hizmet PMI (3 Temmuz) — 50+ beklenti
[ ] FOMC Haziran tutanakları (6 Temmuz) — ton analizi
[ ] VIX seviyesini kaydet (hedef: < 20)
[ ] 45+ hisse için IV Rank kontrolü
[ ] Earnings takvimini güncelle (tarih değişikliği olabilir)
[ ] İlk pozisyon listesini oluştur (5-10 hisse)
[ ] FOMC hazırlık planını gözden geçir
```

---

#### 2. HAFTA: 7-13 Temmuz — FİNANSALLAR VE SAĞLIK HAZIRLIĞI

> **Hedef:** Finansal ve sağlık sektörü pozisyonları aç. FOMC'den uzak hisselerde agresif ol.

| Gün | Tarih | Eylem | Detay | Öncelik | İlgili Hisse |
|-----|-------|-------|-------|---------|--------------|
| Salı | 8 Temmuz | **ISM Üretim PMI verisini izle** | 49-50 arası bekleniyor. Üretim sektörü sınırında. | YÜKSEK | Tüm portföy |
| Çarşamba | 9 Temmuz | Hisse seçimi sonlandır | IV Rank, CPR, teknik analiz değerlendir. 5-10 hisse seç. | ORTA | Tüm portföy |
| Perşembe | 10 Temmuz | **JPM Entry değerlendir** | Bear Call Spread pozisyonu aç (FOMC'den uzak, 14 Temmuz earnings). | YÜKSEK | JPM |
| Cuma | 11 Temmuz | **GS, BAC Entry değerlendir** | IC veya Bull Spread pozisyonu aç. Finansal sektör FOMC'den uzak. | YÜKSEK | GS, BAC |
| Cumartesi | 12 Temmuz | Hafta sonu analizi | Açık pozisyonları değerlendir. P&L kontrolü. | ORTA | Açık pozisyonlar |
| Pazar | 13 Temmuz | **JNJ Entry değerlendir** | Long Call Spread pozisyonu aç. Sağlık sektörü defansif. | ORTA | JNJ |

**2. Hafta Kontrol Listesi:**
```
[ ] ISM Üretim PMI (8 Temmuz) — 49-50 beklenti
[ ] JPM pozisyonu aç (10 Temmuz) — Bear Call Spread
[ ] GS pozisyonu aç (11 Temmuz) — Iron Condor
[ ] BAC pozisyonu aç (11 Temmuz) — Bull Put Spread
[ ] JNJ pozisyonu aç (13 Temmuz) — Long Call Spread
[ ] VIX seviyesini kontrol et (hedef: < 22)
[ ] Açık pozisyonların delta nötrlüğünü kontrol et
[ ] FOMC'ye kalan gün: 15 gün
[ ] Earnings takvimini kontrol et (JPM 14 Temmuz)
[ ] Blackout dönemi başlangıcı: 5 gün (18 Temmuz)
```

---

#### 3. HAFTA: 14-20 TEMMUZ — EARNINGS BAŞLIYOR ⭐

> **Hedef:** Yoğun earnings dönemi. Finansal ve sağlık sektörü earnings. Pozisyon yönetimi kritik.

| Gün | Tarih | Eylem | Detay | Öncelik | İlgili Hisse |
|-----|-------|-------|-------|---------|--------------|
| **Salı** | **14 Temmuz** | **🟢 JPM, BAC, GS, WFC, C Earnings (BMO)** + **CPI Verisi** | Finansal sektörün "Büyük 4" bankası aynı gün. CPI enflasyon verisi kritik. | ÇOK YÜKSEK | JPM, BAC, GS, WFC, C |
| Çarşamba | 15 Temmuz | **JNJ, MS Earnings** + PPI Verisi | Sağlık ve yatırım bankası. PPI maliyet enflasyonu. | YÜKSEK | JNJ, MS |
| Perşembe | 16 Temmuz | **🟢 NFLX, ABT Earnings** — NFLX IC pozisyonu yönet | NFLX AMC'de. Abone sayısı ve reklam geliri kritik. | ÇOK YÜKSEK | NFLX, ABT |
| Cuma | 17 Temmuz | Perakende Satışlar verisi | Tüketici harcamaları. Enflasyon ve enerji etkisi. | ORTA | Tüm portföy |
| Cumartesi | 18 Temmuz | **BLACKOUT DÖNEMİ BAŞLIYOR** | Fed üyeleri konuşamaz. Yeni pozisyon açmayı azalt. | YÜKSEK | Tüm portföy |
| Pazar | 19 Temmuz | Hafta sonu analizi | Earnings sonuçlarını değerlendir. IV crush etkisini analiz et. | ORTA | Açık pozisyonlar |
| Pazartesi | 20 Temmuz | TSLA, GOOGL entry değerlendir (yarım pozisyon) | FOMC'ye 8 gün kala. Agresif pozisyonları azalt. | ORTA | TSLA, GOOGL |

**3. Hafta Kontrol Listesi:**
```
[ ] JPM earnings sonucu (14 Temmuz BMO) — NIM, kredi kalitesi, guidance
[ ] BAC earnings sonucu (14 Temmuz BMO) — Tüketici bankacılığı, mortgage
[ ] GS earnings sonucu (14 Temmuz BMO) — Yatırım bankacılığı, trading
[ ] WFC earnings sonucu (14 Temmuz BMO) — Kredi kalitesi, NIM
[ ] C earnings sonucu (14 Temmuz BMO) — Küresel bankacılık, trading
[ ] CPI verisi (14 Temmuz) — %4.0+ beklenti
[ ] JNJ earnings sonucu (15 Temmuz BMO) — İlaç satışları, guidance
[ ] MS earnings sonucu (15 Temmuz BMO) — Wealth management, trading
[ ] PPI verisi (15 Temmuz) — Maliyet enflasyonu
[ ] NFLX earnings sonucu (16 Temmuz AMC) — Abone sayısı, reklam geliri
[ ] ABT earnings sonucu (16 Temmuz BMO) — Medikal cihaz satışları
[ ] Perakende Satışlar (17 Temmuz) — Tüketici harcamaları
[ ] Blackout başlangıcı (18 Temmuz) — Yeni pozisyon azalt
[ ] IV Crush değerlendirmesi — Earnings sonrası IV düşüşü
[ ] Kar hedefi (%50 kredi) ulaşıldı mı? — Mekanik çıkış
[ ] FOMC'ye kalan gün: 8 gün
```

---

#### 4. HAFTA: 21-27 TEMMUZ — FOMC ÖNCESİ KÜÇÜLTME 🚨

> **Hedef:** FOMC öncesi pozisyon küçültme. Yeni pozisyon açmayı durdur. Risk azaltma.

| Gün | Tarih | Eylem | Detay | Öncelik | İlgili Hisse |
|-----|-------|-------|-------|---------|--------------|
| Salı | 21 Temmuz | **BLK Earnings** + TSLA/GOOGL entry değerlendir (yarım pozisyon) | BLK BMO. Varlık yönetimi akışları. TSLA/GOOGL yarım pozisyon. | ORTA | BLK, TSLA, GOOGL |
| Çarşamba | 22 Temmuz | **🟡 TSLA, GOOGL, TMO Earnings (AMC)** | Tesla ve Google aynı gün AMC'de. Ayın en kritik tech günü. | ÇOK YÜKSEK | TSLA, GOOGL, TMO |
| Perşembe | 23 Temmuz | **INTC Earnings (AMC)** + Yeni pozisyon açmayı DURDUR | Intel yarı iletken. FOMC'ye 5 gün kala yeni giriş yok. | YÜKSEK | INTC |
| Cuma | 24 Temmuz | **⚠️ TÜM POZİSYONLARI %50 KÜÇÜLT** | FOMC'ye 4 gün kala. Agresif risk azaltma. | ÇOK YÜKSEK | Tüm portföy |
| Cumartesi | 25 Temmuz | Hafta sonu analizi + P&L değerlendirmesi | Açık pozisyonları değerlendir. Kapanış planı hazırla. | YÜKSEK | Açık pozisyonlar |
| Pazar | 26 Temmuz | **Pozisyonları %50 azalt** (devam) | Risk azaltma devam. Nakit rezervini %60+'ya çıkar. | ÇOK YÜKSEK | Tüm portföy |
| Pazartesi | 27 Temmuz | **🚨 TÜM AKTİF POZİSYONLARDA KAPANIŞ PLANLA** | Son çıkış günü. Limit emirleri koy. Nakit %70+. | ÇOK YÜKSEK | Tüm portföy |

**4. Hafta Kontrol Listesi:**
```
[ ] BLK earnings sonucu (21 Temmuz BMO) — AUM akışları, yönetim ücretleri
[ ] TSLA earnings sonucu (22 Temmuz AMC) — FSD gelirleri, otonom sürüş, guidance
[ ] GOOGL earnings sonucu (22 Temmuz AMC) — Cloud, YouTube, AI rekabeti
[ ] TMO earnings sonucu (22 Temmuz) — Biyoteknoloji, laboratuvar ekipmanları
[ ] INTC earnings sonucu (23 Temmuz AMC) — Yarı iletken üretimi, AI chip
[ ] 24 Temmuz: Yeni pozisyon açmayı DURDUR
[ ] 24 Temmuz: Tüm pozisyonları %50 küçült
[ ] 26 Temmuz: Pozisyonları %50 azalt (devam)
[ ] 27 Temmuz: Tüm aktif pozisyonlarda kapanış planla
[ ] VIX seviyesini kontrol et (hedef: < 25, uyarı: > 25)
[ ] FOMC'ye kalan gün: 1-7 gün
[ ] Blackout dönemi devam (18-30 Temmuz)
[ ] Earnings sonrası IV crush değerlendirmesi
[ ] Kar hedefi (%50 kredi) ulaşıldı mı?
[ ] Stop-loss seviyelerini kontrol et
[ ] Delta nötrlüğünü kontrol et (±0.05, FOMC yaklaşıyor)
```

---

#### 5. HAFTA: 28-31 TEMMUZ — FOMC + MEGA-CAP EARNINGS 🔴🔴

> **Hedef:** FOMC kararı ve mega-cap earnings. Yeni pozisyon açma yasak. Sadece gözlem ve mevcut pozisyon yönetimi.

| Gün | Tarih | Eylem | Detay | Öncelik | İlgili Hisse |
|-----|-------|-------|-------|---------|--------------|
| **Salı** | **28 Temmuz** | **🚨 FOMC BAŞLIYOR** + **UNH, V Earnings** + **YENİ POZİSYON AÇMA** | FOMC toplantısı başlangıcı. UNH ve V earnings. Yeni pozisyon yok. | ÇOK YÜKSEK | UNH, V |
| **Çarşamba** | **29 Temmuz** | **🚨 FOMC KARARI (14:00 ET)** + **MSFT, META Earnings (AMC)** | Yılın en kritik günü. FOMC kararı + 2 mega-cap tech. | ÇOK YÜKSEK | MSFT, META |
| **Perşembe** | **30 Temmuz** | **🔴 AAPL, AMZN, MA, PFE Earnings (AMC)** + **GDP Q2** | Apple ve Amazon aynı gün. GDP Advance Estimate. Üçlü risk. | ÇOK YÜKSEK | AAPL, AMZN, MA, PFE |
| **Cuma** | **31 Temmuz** | **XOM, CVX, MRK Earnings (BMO)** + ECI Verisi | Enerji devleri + istihdam maliyeti. FOMC sonrası ilk değerlendirme. | YÜKSEK | XOM, CVX, MRK |
| Cumartesi | 1 Ağustos | Hafta sonu strateji revizyonu | FOMC tonu, GDP, earnings sonuçlarına göre yeni plan. | ORTA | Tüm portföy |
| Pazar | 2 Ağustos | Yeni setup hazırlığı | Temizlenmiş fiyatlardan yeni pozisyon listesi. | ORTA | Tüm portföy |

**5. Hafta Kontrol Listesi:**
```
[ ] 28 Temmuz: FOMC başlangıcı — Yeni pozisyon açma YASAK
[ ] 28 Temmuz: UNH earnings sonucu (BMO) — Sağlık sigortası, guidance
[ ] 28 Temmuz: V earnings sonucu (AMC) — Ödeme hacimleri, küresel harcama
[ ] 29 Temmuz: FOMC kararı (14:00 ET) — Faiz değişikliği, ton
[ ] 29 Temmuz: Kevin Warsh basın konferansı (14:30 ET) — Ton analizi
[ ] 29 Temmuz: MSFT earnings sonucu (AMC) — Azure, AI yatırımları
[ ] 29 Temmuz: META earnings sonucu (AMC) — VR/AR, reklam gelirleri
[ ] 30 Temmuz: AAPL earnings sonucu (AMC) — iPhone, AI stratejisi, guidance
[ ] 30 Temmuz: AMZN earnings sonucu (AMC) — AWS, e-ticaret
[ ] 30 Temmuz: MA earnings sonucu (BMO) — Ödeme hacimleri
[ ] 30 Temmuz: PFE earnings sonucu (BMO) — İlaç satışları, pipeline
[ ] 30 Temmuz: GDP Q2 Advance Estimate — %1.5-2.0 beklenti
[ ] 31 Temmuz: XOM earnings sonucu (BMO) — Petrol üretimi, enerji fiyatları
[ ] 31 Temmuz: CVX earnings sonucu (BMO) — Üretim büyümesi, marjlar
[ ] 31 Temmuz: MRK earnings sonucu (BMO) — İlaç satışları, pipeline
[ ] 31 Temmuz: ECI Verisi — Ücret baskıları
[ ] FOMC sonrası: Yeni değerlendirmelere başla
[ ] VIX seviyesini kontrol et (FOMC sonrası düşüş bekleniyor)
[ ] Earnings sonrası IV crush değerlendirmesi
[ ] Kar hedefi (%50 kredi) ulaşıldı mı?
[ ] Stop-loss seviyelerini kontrol et
[ ] Delta nötrlüğünü kontrol et (FOMC sonrası volatilite)
[ ] 3 Ağustos: Normal pozisyon açmaya dönüş planla
```

---

### 12.2 Günlük Checklist (Her Ticaret Günü)

> **10 maddelik günlük kontrol listesi.** Her ticaret günü sabah ve akşam olmak üzere 2 kez kontrol edilmelidir.

#### Sabah Checklist (Piyasa Açılış Öncesi)

```
[ ] 1. VIX seviyesini kontrol et (>25 = pozisyon küçült, >30 = agresif küçült)
[ ] 2. Açık pozisyonların P&L durumunu kontrol et (kar/zarar durumu)
[ ] 3. Earnings takvimini kontrol et (tarih değişikliği olabilir)
[ ] 4. FOMC takvimine kalan günü kontrol et (24 Temmuz'dan sonra yeni pozisyon yok)
[ ] 5. Makro veri akışını kontrol et (CPI, GDP, NFP, ISM, vs.)
```

#### Öğle Checklist (Piyasa Ortasında)

```
[ ] 6. IV Rank değişimini izle (>50 = IC fırsatı, <40 = Long Straddle fırsatı)
[ ] 7. CPR (Call/Put Ratio) değişimini izle (anlık sentiment)
[ ] 8. Delta nötrlüğünü kontrol et (±0.10, FOMC yaklaşıyorsa ±0.05)
```

#### Akşam Checklist (Piyasa Kapanış Sonrası)

```
[ ] 9. Stop-loss seviyelerini kontrol et (2x kredi = anında kapat)
[ ] 10. Kar hedefi (%50 kredi) ulaşıldı mı? (ulaşıldıysa sorgusuz kapat)
```

#### Günlük Checklist Özeti

| # | Madde | Zamanlama | Eşik | Aksiyon |
|---|-------|-----------|------|---------|
| 1 | VIX kontrolü | Sabah | >25 | Küçült |
| 2 | P&L kontrolü | Sabah | Kar = %50 kredi | Kapat |
| 3 | Earnings takvimi | Sabah | Tarih değişikliği | Strateji revizyonu |
| 4 | FOMC takvimi | Sabah | 24-30 Temmuz | Yeni pozisyon yok |
| 5 | Makro veri | Sabah | CPI, GDP, NFP | Pozisyon ayarlama |
| 6 | IV Rank | Öğle | >%50 | IC fırsatı |
| 7 | CPR | Öğle | <0.8 veya >1.5 | Sentiment değişimi |
| 8 | Delta nötrlüğü | Öğle | >±0.10 | Hedge ekle/çıkar |
| 9 | Stop-loss | Akşam | 2x kredi | Anında kapat |
| 10 | Kar hedefi | Akşam | %50 kredi | Sorgusuz kapat |

---

### 12.3 Earnings Öncesi Hazırlık Adımları (7 Adım)

> **Her earnings pozisyonu için standart 7 adımlık hazırlık süreci.** 45+ hisse için uygulanabilir.

| Adım | Zamanlama | Detay | Kontrol Listesi | Araçlar |
|------|-----------|-------|-----------------|---------|
| **1. Hisse Seçimi** | 1-2 hafta önce | IV Rank, CPR, teknik analiz, beta, sektör trendi değerlendir | IV Rank > %40? CPR < 1.0 (call) veya > 1.0 (put)? Beta > 1.0? | MarketChameleon, Barchart, TradingView |
| **2. Strateji Belirleme** | 3-5 gün önce | IC, Spread, Butterfly veya Lottery seç. Bütçe ve risk toleransına göre. | Bütçe uygun mu? Deneyim seviyesi? FOMC riski? | EarningsPlay v4.1 Rehberi |
| **3. Strike Hesaplama** | 2-3 gün önce | Expected Move (EM) hesapla. Short strikes EM'nin %10-15 dışında olmalı. | EM = Stock Price x IV x sqrt(Days/365)? Short strikes EM + %10-15 dışında mı? | OptionCharts, AlphaQuery |
| **4. Entry Zamanlaması** | 1-2 gün önce | Earnings'ten hemen önce pozisyon aç. IV en şişmiş seviyede. | IV Rank zirvede mi? (genellikle 1 gün önce) Likidite yeterli mi? | Broker platformu, IV takibi |
| **5. Pozisyon Yönetimi** | Earnings günü | Pozisyon kapalı kalır, izleme devam eder. Panik yok. | P&L kontrolü. Stop-loss ve kar hedefi aktif mi? FOMC çakışması var mı? | Broker platformu |
| **6. IV Crush Değerlendirmesi** | Ertesi gün sabah | IV düşüşünü değerlendir. Erken kapanış düşün. | IV %40-70 düştü mü? Pozisyon hala karlı mı? Theta decay hızlandı mı? | MarketChameleon, IV takibi |
| **7. Çıkış** | %50 kar veya 21 DTE | Mekanik veya zaman çıkışı uygula. Duygusal karar verme. | Kar = %50 kredi? Zarar = 2x kredi? DTE = 21? FOMC yaklaşıyor mu? | EarningsPlay v4.1 Kuralları |

#### Earnings Hazırlık Zaman Çizelgesi (Örnek: AAPL, 30 Temmuz Earnings)

| Tarih | Gün | Adım | Detay |
|-------|-----|------|-------|
| 16 Temmuz | Perşembe | 1. Hisse Seçimi | AAPL IV Rank 55%, CPR 0.64, Beta 1.09. Seçildi. |
| 23 Temmuz | Perşembe | 2. Strateji Belirleme | Butterfly seçildi ($200-$500 bütçe). FOMC riski yüksek, IV crush dayanıklı. |
| 27 Temmuz | Pazartesi | 3. Strike Hesaplama | EM = $301.54 x 55% x sqrt(2/365) = ~$24. Short strikes: $292 ve $311. |
| 28 Temmuz | Salı | 4. Entry | FOMC başlangıcı! Yeni pozisyon açma yasak. Entry ertelendi. |
| 29 Temmuz | Çarşamba | 4. Entry (revize) | FOMC kararı sonrası 30 dakika beklendi. Entry değerlendirildi. |
| 30 Temmuz | Perşembe | 5. Yönetim | AAPL earnings AMC. Pozisyon izlendi. FOMC + GDP etkisi. |
| 31 Temmuz | Cuma | 6. IV Crush | IV %50 düştü. Butterfly karlı. Değerlendirme yapıldı. |
| 3 Ağustos | Pazartesi | 7. Çıkış | %50 kar hedefine ulaşıldı. Sorgusuz kapatıldı. |

---

### 12.4 YENİ: Hafta Sonu Hazırlık Rutini

> **Her hafta sonu (Cumartesi-Pazar) uygulanacak hazırlık rutini.** 45+ hisse için portföy değerlendirmesi ve gelecek hafta planlaması.

#### Cumartesi Rutini (Piyasa Kapalı — Analiz Günü)

**1. P&L Değerlendirmesi (30 dk)**
- Haftalık P&L özetini çıkar
- Kazanan ve kaybeden pozisyonları analiz et
- Neden kazandın/kaybettin? (Not al)
- Portföy delta, gamma, theta, vega değerlerini kaydet

**2. Açık Pozisyon İncelemesi (20 dk)**
- Her açık pozisyon için durum analizi
- Kar/zarar durumu, DTE, IV Rank değişimi
- Stop-loss ve kar hedefi güncellemesi
- FOMC'ye kalan gün ve etki değerlendirmesi

**3. Earnings Takvimi Güncellemesi (15 dk)**
- Gelecek hafta earnings açıklayacak şirketleri listele
- Tarih değişikliği olup olmadığını kontrol et
- FOMC çakışmalarını işaretle
- Yeni fırsatları not al

**4. Makro Veri Takvimi (15 dk)**
- Gelecek hafta açıklanacak makro verileri listele
- NFP, CPI, GDP, ISM, FOMC, vs.
- Her verinin piyasa etkisini değerlendir
- Pozisyon ayarlamaları planla

**5. Strateji Revizyonu (20 dk)**
- EarningsPlay v4.1 kurallarına uygunluk kontrolü
- Pozisyon boyutu kuralları (VIX 19.44 = %100)
- Sektör ağırlıklandırma kontrolü
- Greeks nötrlüğü değerlendirmesi

#### Pazar Rutini (Piyasa Kapalı — Planlama Günü)

**6. Gelecek Hafta Planı (30 dk)**
- Hangi hisselerde pozisyon açacaksın? (Max 3-5 yeni)
- Hangi stratejileri kullanacaksın? (IC, Spread, Butterfly)
- Entry tarihleri ve fiyatları belirle
- Exit planları (kar hedefi, stop-loss, zaman çıkışı)

**7. FOMC / Blackout Kontrolü (10 dk)**
- FOMC'ye kalan gün
- Blackout dönemi durumu
- Pozisyon küçültme takvimi kontrolü
- Yeni pozisyon açma kısıtlamaları

**8. Risk Yönetimi Kontrolü (15 dk)**
- Toplam portföy riski (max %10)
- Tek hisse riski (max %1.5)
- Tek sektör riski (max %15)
- VIX seviyesi ve pozisyon ayarlama

**9. Broker Platformu Hazırlığı (10 dk)**
- Watchlist'leri güncelle
- Limit emirleri hazırla (kar hedefi, stop-loss)
- Alerts kur (VIX, hisse fiyatı, IV Rank)
- Hesap bakiyesi ve marj kontrolü

**10. Eğitim ve İnceleme (20 dk)**
- Haftanın öğrenilen derslerini not al
- Yeni stratejileri araştır
- Piyasa yorumlarını oku (Fed, analistler)
- Raporları güncelle

#### Hafta Sonu Rutin Kontrol Listesi

```
CUMARTESİ:
[ ] P&L değerlendirmesi (haftalık)
[ ] Açık pozisyon incelemesi
[ ] Earnings takvimi güncellemesi
[ ] Makro veri takvimi
[ ] Strateji revizyonu

PAZAR:
[ ] Gelecek hafta planı (3-5 yeni pozisyon max)
[ ] FOMC / Blackout kontrolü
[ ] Risk yönetimi kontrolü
[ ] Broker platformu hazırlığı
[ ] Eğitim ve inceleme
```

---

### 12.5 YENİ: Earnings Günü Protokolü

> **Earnings gününde uygulanacak standart protokol.** BMO (Before Market Open) ve AMC (After Market Close) earnings için farklı prosedürler. 45+ hisse için uygulanabilir.

#### BMO Earnings Protokolü (Örnek: JPM, 14 Temmuz 6:00-8:00 AM ET)

**Öncesi (Önceki Gün Akşam):**
- Pozisyon son kontrolü
- Stop-loss ve kar hedefi emirlerini güncelle
- Uyku öncesi alarm kur (earnings saatinden 30 dk önce)

**Sabah (5:30-6:00 AM ET):**
- Alarm çal, uyan
- Kahve al, bilgisayarı aç
- Pre-market fiyatları kontrol et
- VIX seviyesini kontrol et

**Earnings Anı (6:00-8:00 AM ET):**
- Earnings sonucunu anlık takip et (EPS, Revenue, Guidance)
- Piyasa tepkisini izle (pre-market hareket)
- Pozisyon durumunu değerlendir
- Panik yapma, duygusal karar verme

**Piyasa Açılışı (9:30 AM ET):**
- Açılış fiyatını izle
- IV crush etkisini gözlemle (IV %40-70 düşer)
- Pozisyon kar/zarar durumunu değerlendir
- Kar hedefi (%50 kredi) ulaşıldı mı?
- Stop-loss (2x kredi) aşıldı mı?
- Mekanik çıkış kurallarını uygula

**Öğleden Sonra:**
- Pozisyon durumunu tekrar değerlendir
- Ertesi gün planı yap
- Not al (kazanan/kaybeden nedenleri)

#### AMC Earnings Protokolü (Örnek: NFLX, 16 Temmuz 4:00-5:30 PM ET)

**Öncesi (Öğleden Önce):**
- Pozisyon son kontrolü
- Piyasa kapanış öncesi son durum değerlendirmesi
- Plan: Earnings sonrası aynı akşam mı değerlendireceksin, ertesi gün mü?

**Piyasa Kapanışı (4:00 PM ET):**
- Normal kapanışı izle
- After-hours trading başlamadan pozisyon durumunu not al
- VIX kapanış seviyesini kaydet

**Earnings Anı (4:00-5:30 PM ET):**
- Earnings sonucunu anlık takip et (EPS, Revenue, Guidance)
- After-hours fiyat hareketini izle
- Pozisyon durumunu değerlendir
- Panik yapma, duygusal karar verme

**Aynı Akşam (5:30-7:00 PM ET):**
- After-hours fiyatı değerlendir
- IV crush etkisini tahmin et (IV %40-70 düşecek)
- Karar ver: Aynı akşam kapat veya ertesi güne bırak
- Eğer kar hedefi (%50) ulaşıldıysa → Kapat (after-hours)
- Eğer stop-loss (2x) aşıldıysa → Kapat (after-hours)
- Eğer arada ise → Ertesi gün sabah değerlendir

**Ertesi Gün Sabah (9:30 AM ET):**
- Açılış fiyatını izle
- IV crush gerçekleşti mi? (IV ne kadar düştü?)
- Pozisyon kar/zarar durumunu değerlendir
- Mekanik çıkış kurallarını uygula
- Not al (kazanan/kaybeden nedenleri)

#### Earnings Günü Kontrol Listesi (BMO)

```
ÖNCESİ (Önceki Gün Akşam):
[ ] Pozisyon son kontrolü
[ ] Stop-loss ve kar hedefi emirlerini güncelle
[ ] Alarm kur (earnings saatinden 30 dk önce)

SABAH (5:30-6:00 AM ET):
[ ] Uyan, kahve al
[ ] Pre-market fiyatları kontrol et
[ ] VIX seviyesini kontrol et

EARNINGS ANI (6:00-8:00 AM ET):
[ ] Earnings sonucunu takip et (EPS, Revenue, Guidance)
[ ] Piyasa tepkisini izle
[ ] Panik yapma

PİYASA AÇILIŞI (9:30 AM ET):
[ ] Açılış fiyatını izle
[ ] IV crush etkisini gözlemle
[ ] Kar hedefi (%50 kredi) ulaşıldı mı?
[ ] Stop-loss (2x kredi) aşıldı mı?
[ ] Mekanik çıkış kurallarını uygula

ÖĞLEDEN SONRA:
[ ] Pozisyon durumunu tekrar değerlendir
[ ] Ertesi gün planı yap
[ ] Not al
```

#### Earnings Günü Kontrol Listesi (AMC)

```
ÖNCESİ (Öğleden Önce):
[ ] Pozisyon son kontrolü
[ ] Piyasa kapanış öncesi son durum değerlendirmesi

PİYASA KAPANIŞI (4:00 PM ET):
[ ] Normal kapanışı izle
[ ] Pozisyon durumunu not al
[ ] VIX kapanış seviyesini kaydet

EARNINGS ANI (4:00-5:30 PM ET):
[ ] Earnings sonucunu takip et
[ ] After-hours fiyat hareketini izle
[ ] Panik yapma

AYNI AKŞAM (5:30-7:00 PM ET):
[ ] After-hours fiyatı değerlendir
[ ] IV crush etkisini tahmin et
[ ] Karar ver: Kapat veya ertesi güne bırak
[ ] Kar hedefi (%50) ulaşıldı mı?
[ ] Stop-loss (2x) aşıldı mı?

ERTESİ GÜN SABAH (9:30 AM ET):
[ ] Açılış fiyatını izle
[ ] IV crush gerçekleşti mi?
[ ] Pozisyon kar/zarar durumunu değerlendir
[ ] Mekanik çıkış kurallarını uygula
[ ] Not al
```

#### Earnings Günü Duygusal Disiplin Kuralları

1. **Panik Yok:** Earnings sonrası ilk 30 dakika en volatil dönemdir. Hızlı karar verme.
2. **Plana Sadık Kal:** Önceden belirlenen kar hedefi ve stop-loss kurallarını uygula.
3. **FOMO Yok:** "Biraz daha bekleyeyim, belki daha çok kar ederim" düşüncesi yasak.
4. **Revenge Trading Yok:** Kaybeden pozisyonun ardından hemen yeni pozisyon açma.
5. **Not Al:** Her earnings deneyimini not al. Gelecek sezon için referans.
6. **Uyku Önemli:** AMC earnings sonrası gece yarısına kadar beklemek zorunda değilsin. Plan yap ve uyu.
7. **Sosyal Medya Yok:** Earnings günü Twitter/X, Reddit, StockTwits'ten uzak dur. Gürültü seni etkilemesin.
8. **Mekanik Çıkış:** %50 kar hedefine ulaşıldığında sorgusuz kapat. Duygusal mazeret yok.

---

## 13. EKLER

> **45+ hisse için detaylı referans tabloları ve rehberler.**  
> **VIX 19.44 ve FOMC 28-29 Temmuz 2026 bağlamında hazırlanmıştır.**

---

### Ek A: Tüm Hisseler Karşılaştırma Matrisi (45+ Hisse)

> **45+ S&P 500 ve NASDAQ-100 hissesi için kapsamlı karşılaştırma matrisi.**  
> **Renk Kodu:** 🟢 Düşük Risk | 🟡 Orta Risk | 🔴 Yüksek Risk | ⚫ Extreme Risk

| Hisse | Fiyat | IV Rank | Hacim CPR | OI CPR | Sentiment | Ana Strateji | FOMC Risk | Bütçe Min. | Beta | Sektör |
|-------|-------|---------|-----------|--------|-----------|-------------|-----------|------------|------|--------|
| AMD | $490 | 91.69% | 0.71 | 0.76 | Strong Uptrend | Iron Condor | 🔴 | $42 | 2.49 | Tech |
| TSLA | $409 | ~80% | 0.64 | 0.70 | Bullish Rebound | Iron Condor | 🟡 | $35 | 1.80 | Tech |
| NFLX | $83 | ~75% | 0.72 | 0.78 | Downtrend | IC + Bear Put | 🟢 | $39 | 1.49 | Tech |
| NVDA | $209 | ~70% | 0.68 | 0.72 | Top Pullback | Iron Condor | 🔴 | $19 | 2.20 | Tech |
| META | $585 | ~65% | 0.69 | 0.72 | Downtrend | Iron Condor | 🔴 | $18 | 1.23 | Tech |
| BA | $216 | ~65% | 0.82 | 0.88 | Nötr | Iron Condor | 🔴 | $30 | 1.40 | Havacılık |
| GOOGL | $363 | ~58% | 0.58 | 0.65 | Top Pullback | Iron Condor | 🟡 | $38 | 1.24 | Tech |
| AMZN | $245 | ~60% | 0.62 | 0.68 | Bearish Cross | Iron Condor | 🔴 | $26 | 1.44 | Tech |
| AAPL | $302 | ~55% | 0.68 | 0.72 | Top Pullback | Iron Condor | 🔴 | $32 | 1.09 | Tech |
| CRM | $285 | ~55% | 0.60 | 0.65 | Bullish | Iron Condor | 🟡 | $28 | 1.15 | Tech |
| ADBE | $520 | ~55% | 0.62 | 0.68 | Top Pullback | Iron Condor | 🔴 | $35 | 1.30 | Tech |
| INTC | $25 | ~55% | 0.70 | 0.75 | Nötr | Iron Condor | 🟡 | $15 | 1.10 | Tech |
| JPM | $230 | 81% | 0.77 | 0.77 | Güçlü Trend | Bear Call Spr. | 🟢 | $39 | 1.15 | Finansal |
| C | $65 | ~55% | 0.85 | 0.92 | Güçlü Trend | Bear Call Spr. | 🟢 | $25 | 1.30 | Finansal |
| GS | $600 | ~55% | 1.34 | 1.25 | Bullish | Iron Condor | 🟢 | $26 | 1.20 | Finansal |
| MSFT | $412 | ~50% | 0.57 | 0.62 | N/A | IC / Long Call | 🔴 | $15 | 1.10 | Tech |
| AVGO | $185 | ~50% | 0.65 | 0.70 | Bullish | Iron Condor | 🟡 | $22 | 1.35 | Tech |
| QCOM | $195 | ~50% | 0.68 | 0.72 | Nötr | Iron Condor | 🟡 | $24 | 1.25 | Tech |
| TXN | $195 | ~48% | 0.72 | 0.78 | Nötr | Iron Condor | 🟡 | $26 | 1.05 | Tech |
| MRVL | $85 | ~48% | 0.65 | 0.70 | Bullish | Iron Condor | 🟡 | $18 | 1.40 | Tech |
| LRCX | $75 | ~48% | 0.70 | 0.75 | Nötr | Iron Condor | 🟡 | $20 | 1.35 | Tech |
| AMAT | $165 | ~48% | 0.68 | 0.72 | Nötr | Iron Condor | 🟡 | $25 | 1.30 | Tech |
| TSM | $185 | ~48% | 0.60 | 0.65 | Bullish | Iron Condor | 🟡 | $28 | 1.20 | Tech |
| UBER | $78 | ~48% | 0.55 | 0.60 | Bullish | Iron Condor | 🟡 | $22 | 1.45 | Tech |
| SHOP | $145 | ~48% | 0.58 | 0.63 | Bullish | Iron Condor | 🟡 | $30 | 1.50 | Tech |
| SNOW | $165 | ~48% | 0.62 | 0.68 | Nötr | Iron Condor | 🟡 | $28 | 1.40 | Tech |
| CRWD | $385 | ~48% | 0.60 | 0.65 | Bullish | Iron Condor | 🟡 | $35 | 1.35 | Tech |
| PANW | $195 | ~48% | 0.65 | 0.70 | Nötr | Iron Condor | 🟡 | $28 | 1.25 | Tech |
| ZS | $195 | ~48% | 0.62 | 0.67 | Nötr | Iron Condor | 🟡 | $30 | 1.30 | Tech |
| NET | $115 | ~48% | 0.58 | 0.63 | Bullish | Iron Condor | 🟡 | $22 | 1.35 | Tech |
| DDOG | $125 | ~48% | 0.60 | 0.65 | Nötr | Iron Condor | 🟡 | $24 | 1.40 | Tech |
| PLTR | $125 | ~48% | 0.55 | 0.60 | Bullish | Iron Condor | 🟡 | $28 | 1.55 | Tech |
| IBM | $240 | ~45% | 0.72 | 0.78 | Nötr | Iron Condor | 🟡 | $32 | 0.85 | Tech |
| ORCL | $175 | ~45% | 0.68 | 0.72 | Nötr | Iron Condor | 🟡 | $24 | 1.10 | Tech |
| UNH | $550 | ~40% | 3.33 | 1.49 | Çok Bullish | Bull Call Spr. | 🔴 | $10 | 0.75 | Sağlık |
| XOM | $110 | ~50% | 2.50 | 1.24 | Bullish | Bull Put Spr. | ⚫ | $25 | 0.85 | Enerji |
| CVX | $155 | ~48% | 2.30 | 1.20 | Bullish | Bull Put Spr. | ⚫ | $28 | 0.80 | Enerji |
| BAC | $40 | ~50% | 1.92 | 0.77 | Bullish | Bull Put Spr. | 🟢 | $44 | 1.25 | Finansal |
| DIS | $85 | ~50% | 0.78 | 0.85 | Nötr | Bear Call Spr. | 🟢 | $29 | 1.20 | Medya |
| V | $320 | ~40% | ~0.92 | ~1.0 | Nötr | Iron Condor | 🔴 | N/A | 0.95 | Finansal |
| MA | $530 | ~40% | ~0.88 | ~0.95 | Nötr | Iron Condor | 🔴 | $32 | 1.05 | Finansal |
| JNJ | $160 | ~42% | 0.95 | 1.05 | Nötr | Long Call Spr. | 🟢 | $22 | 0.26 | Sağlık |
| PFE | $28 | ~35% | 1.15 | 1.20 | Hafif Bull | Bull Put Spr. | 🟢 | $12 | 0.55 | Sağlık |
| NKE | $72 | ~48% | 0.72 | 0.78 | Downtrend | Bear Call Spr. | 🟢 | $47 | 1.10 | Tüketici |
| HD | $360 | ~40% | 0.98 | 1.08 | Nötr | Long Call Spr. | 🟡 | $32 | 0.95 | Tüketici |
| WMT | $95 | ~40% | 0.85 | 0.92 | Nötr | Long Call Spr. | 🟡 | $22 | 0.50 | Tüketici |
| WFC | $58 | ~45% | 0.90 | 1.00 | Nötr | Long IC | 🟢 | N/A | 1.10 | Finansal |
| BLK | $950 | ~45% | 0.85 | 0.88 | Nötr | Bear Call Spr. | 🟡 | $35 | 1.10 | Finansal |
| MS | $105 | ~45% | 0.80 | 0.85 | Nötr | Bear Call Spr. | 🟢 | $30 | 1.20 | Finansal |
| ABT | $115 | ~40% | 0.90 | 0.95 | Nötr | Long Call Spr. | 🟢 | $20 | 0.70 | Sağlık |
| TMO | $550 | ~40% | 0.85 | 0.90 | Nötr | Long Call Spr. | 🟡 | $35 | 0.80 | Sağlık |
| MRK | $105 | ~40% | 0.92 | 0.98 | Nötr | Long Call Spr. | 🟢 | $22 | 0.45 | Sağlık |
| LLY | $850 | ~40% | 0.88 | 0.95 | Nötr | Long Call Spr. | 🟢 | $40 | 0.50 | Sağlık |
| MCD | $310 | ~40% | 0.88 | 0.95 | Nötr | Long Call Spr. | 🟡 | $28 | 0.60 | Tüketici |
| SBUX | $95 | ~40% | 0.90 | 0.95 | Nötr | Long Call Spr. | 🟡 | $20 | 0.85 | Tüketici |
| KO | $68 | ~35% | 0.95 | 1.00 | Nötr | Long Call Spr. | 🟢 | $15 | 0.55 | Tüketici |
| CMCSA | $42 | ~35% | 0.88 | 0.92 | Nötr | Long Call Spr. | 🟢 | $12 | 0.90 | Medya |
| VZ | $42 | ~35% | 0.92 | 0.98 | Nötr | Long Call Spr. | 🟢 | $10 | 0.40 | Telekom |
| UPS | $115 | ~40% | 0.85 | 0.90 | Nötr | Long Call Spr. | 🟡 | $22 | 0.90 | Ulaşım |
| CAT | $360 | ~40% | 0.80 | 0.85 | Nötr | Long Call Spr. | 🟡 | $35 | 1.05 | Endüstri |
| LMT | $480 | ~40% | 0.85 | 0.90 | Nötr | Long Call Spr. | 🟡 | $32 | 0.70 | Havacılık |
| RTX | $115 | ~40% | 0.88 | 0.92 | Nötr | Long Call Spr. | 🟡 | $22 | 0.85 | Havacılık |

---

### Ek B: IV Crush Beklentileri (Sektör Bazlı)

> **Earnings sonrası Implied Volatility (IV) çökme beklentileri.** VIX 19.44 seviyesinde sektörel IV crush profilleri.

| Sektör | IV Crush (%) | Yorum | Strateji Önerisi | Örnek Hisseler | VIX 19.44 Etkisi |
|--------|-------------|-------|------------------|----------------|------------------|
| **Enerji** | **30-40%** | En yüksek crush | Short premium ideal | XOM, CVX, COP | VIX normal, crush yüksek |
| **Teknoloji (Mega-cap)** | **30-50%** | Çok yüksek crush | IC ve butterfly | AAPL, MSFT, AMZN, GOOGL, META | VIX normal, crush çok yüksek |
| **Teknoloji (Yarı İletken)** | **35-55%** | En yüksek crush | Butterfly, Ratio | NVDA, AMD, INTC, AVGO | VIX normal, crush en yüksek |
| **Teknoloji (Yazılım/Cloud)** | **25-40%** | Yüksek crush | IC ve butterfly | CRM, ORCL, SNOW, DDOG | VIX normal, crush yüksek |
| **Teknoloji (Cybersecurity)** | **25-35%** | Orta-yüksek crush | IC ve butterfly | CRWD, PANW, ZS, NET | VIX normal, crush orta |
| **Havacılık (BA)** | **30-40%** | Yüksek crush | IC tercih et | BA, LMT, RTX | VIX normal, crush yüksek |
| **Sağlık (İlaç)** | **25-35%** | Orta crush | Long spreadler kazanır | JNJ, PFE, MRK, LLY | VIX normal, crush orta |
| **Sağlık (Medikal)** | **20-30%** | Düşük-orta crush | Long spread tercih et | ABT, TMO, UNH | VIX normal, crush düşük |
| **Finansal (Banka)** | **20-30%** | Düşük crush | Short premium güvenli | JPM, BAC, WFC, C, GS | VIX normal, crush düşük |
| **Finansal (Ödeme)** | **20-25%** | Düşük crush | Long spread tercih et | V, MA, PYPL | VIX normal, crush düşük |
| **Medya (DIS)** | **25-30%** | Orta crush | IC veya bearish spread | DIS, CMCSA | VIX normal, crush orta |
| **Perakende (HD, WMT)** | **20-25%** | Düşük crush | Long spread tercih et | HD, WMT, NKE, MCD | VIX normal, crush düşük |
| **Tüketici (İçecek)** | **15-25%** | Çok düşük crush | Long spread ideal | KO, PEP, SBUX | VIX normal, crush çok düşük |
| **Telekom** | **15-20%** | En düşük crush | Long spread ideal | VZ, T, TMUS | VIX normal, crush en düşük |
| **Ulaşım/Lojistik** | **20-30%** | Düşük-orta crush | IC tercih et | UPS, FDX | VIX normal, crush orta |
| **Endüstri** | **20-30%** | Düşük-orta crush | IC tercih et | CAT, DE, GE | VIX normal, crush orta |

#### IV Crush Yönetim Stratejileri

**Yüksek Crush Sektörleri (Tech, Enerji, Havacılık):**
- **Strateji:** Butterfly, Ratio Spread, Short Straddle
- **Amaç:** IV crush'tan maksimum kazanç
- **Risk:** Yüksek volatilite = beklenmedik hareket
- **Örnek:** AMD Butterfly (IV crush'a en dayanıklı)

**Orta Crush Sektörleri (Sağlık, Medya, Ulaşım):**
- **Strateji:** Iron Condor, Debit Spread
- **Amaç:** Dengeli risk/ödül
- **Risk:** Orta volatilite = sınırlı hareket
- **Örnek:** JNJ Bull Call Spread

**Düşük Crush Sektörleri (Finansal, Perakende, Telekom):**
- **Strateji:** Long Spread, Calendar Spread
- **Amaç:** Düşük IV = ucuz opsiyonlar
- **Risk:** Düşük volatilite = sınırlı kazanç
- **Örnek:** VZ Long Call Spread

---

### Ek C: Beta Değerleri ve Pozisyon Boyutu Rehberi

> **45+ hisse için beta değerleri ve buna bağlı pozisyon boyutu / wing genişliği rehberi.**

| Hisse | Beta | Volatilite | Max Pozisyon | Wing Genişliği | Strateji Tavsiyesi | FOMC Risk |
|-------|------|-----------|--------------|---------------|-------------------|-----------|
| AMD | 2.49 | AŞIRI YÜKSEK | Hesabın %1'i | Geniş ($49) | Butterfly, Lottery | 🔴 |
| NVDA | 2.20 | ÇOK YÜKSEK | Hesabın %1-1.5'i | Dar ($21) | Butterfly, Lottery | 🔴 |
| TSLA | 1.80 | YÜKSEK | Hesabın %1'i | Geniş ($41) | IC, Butterfly | 🟡 |
| PLTR | 1.55 | YÜKSEK | Hesabın %1'i | Geniş ($38) | IC, Butterfly | 🟡 |
| SHOP | 1.50 | YÜKSEK | Hesabın %1'i | Geniş ($37) | IC, Butterfly | 🟡 |
| UBER | 1.45 | ORTA-YÜKSEK | Hesabın %1-1.5'i | Geniş ($35) | IC, Spread | 🟡 |
| AMZN | 1.44 | ORTA-YÜKSEK | Hesabın %1-2'si | Orta ($25) | IC, Butterfly | 🔴 |
| NFLX | 1.49 | ORTA-YÜKSEK | Hesabın %1-2'si | Dar ($8) | IC, Bear Put | 🟢 |
| CRWD | 1.35 | ORTA-YÜKSEK | Hesabın %1-2'si | Geniş ($39) | IC, Butterfly | 🟡 |
| DDOG | 1.40 | ORTA-YÜKSEK | Hesabın %1-2'si | Geniş ($38) | IC, Butterfly | 🟡 |
| BA | 1.40 | ORTA-YÜKSEK | Hesabın %1-2'si | Geniş ($43) | IC, Butterfly | 🔴 |
| MRVL | 1.40 | ORTA-YÜKSEK | Hesabın %1-2'si | Dar ($17) | IC, Butterfly | 🟡 |
| LRCX | 1.35 | ORTA-YÜKSEK | Hesabın %1-2'si | Dar ($15) | IC, Butterfly | 🟡 |
| AVGO | 1.35 | ORTA-YÜKSEK | Hesabın %1-2'si | Geniş ($37) | IC, Butterfly | 🟡 |
| NET | 1.35 | ORTA-YÜKSEK | Hesabın %1-2'si | Dar ($23) | IC, Butterfly | 🟡 |
| SNOW | 1.40 | ORTA-YÜKSEK | Hesabın %1-2'si | Geniş ($33) | IC, Butterfly | 🟡 |
| ZS | 1.30 | ORTA | Hesabın %1-2'si | Geniş ($39) | IC, Spread | 🟡 |
| AMAT | 1.30 | ORTA | Hesabın %1-2'si | Geniş ($33) | IC, Spread | 🟡 |
| ADBE | 1.30 | ORTA | Hesabın %1-2'si | Geniş ($52) | IC, Spread | 🔴 |
| C | 1.30 | ORTA | Hesabın %1-2'si | Dar ($13) | Bear Call, IC | 🟢 |
| META | 1.23 | ORTA | Hesabın %1-2'si | Geniş ($59) | IC, Ratio | 🔴 |
| GOOGL | 1.24 | ORTA | Hesabın %1-2'si | Geniş ($36) | IC, Calendar | 🟡 |
| QCOM | 1.25 | ORTA | Hesabın %1-2'si | Dar ($20) | IC, Spread | 🟡 |
| PANW | 1.25 | ORTA | Hesabın %1-2'si | Geniş ($39) | IC, Spread | 🟡 |
| BAC | 1.25 | ORTA | Hesabın %1-2'si | Dar ($8) | Bull Put, IC | 🟢 |
| MS | 1.20 | ORTA | Hesabın %1-2'si | Dar ($21) | Bear Call, IC | 🟢 |
| TSM | 1.20 | ORTA | Hesabın %1-2'si | Geniş ($37) | IC, Spread | 🟡 |
| DIS | 1.20 | ORTA | Hesabın %1-2'si | Dar ($17) | Bear Call, IC | 🟢 |
| GS | 1.20 | ORTA | Hesabın %1-2'si | Geniş ($60) | IC, Put Fly | 🟢 |
| AAPL | 1.09 | ORTA-DÜŞÜK | Hesabın %1-2'si | Orta ($30) | IC, Butterfly | 🔴 |
| MSFT | 1.10 | ORTA-DÜŞÜK | Hesabın %1-2'si | Geniş ($41) | IC, Calendar | 🔴 |
| INTC | 1.10 | ORTA-DÜŞÜK | Hesabın %1-2'si | Dar ($5) | IC, Spread | 🟡 |
| ORCL | 1.10 | ORTA-DÜŞÜK | Hesabın %1-2'si | Dar ($18) | IC, Spread | 🟡 |
| WFC | 1.10 | ORTA-DÜŞÜK | Hesabın %1-2'si | Dar ($12) | Long IC | 🟢 |
| CRM | 1.15 | ORTA-DÜŞÜK | Hesabın %1-2'si | Dar ($29) | IC, Spread | 🟡 |
| JPM | 1.15 | ORTA-DÜŞÜK | Hesabın %1-2'si | Dar ($23) | Bear Call, IC | 🟢 |
| TXN | 1.05 | ORTA-DÜŞÜK | Hesabın %1-2'si | Dar ($20) | IC, Spread | 🟡 |
| MA | 1.05 | ORTA-DÜŞÜK | Hesabın %1-2'si | Geniş ($53) | IC, Spread | 🔴 |
| CAT | 1.05 | ORTA-DÜŞÜK | Hesabın %1-2'si | Geniş ($36) | IC, Spread | 🟡 |
| NKE | 1.10 | ORTA-DÜŞÜK | Hesabın %1-2'si | Dar ($14) | Bear Call, IC | 🟢 |
| HD | 0.95 | DÜŞÜK | Hesabın %2-3'ü | Geniş ($36) | Long Call, IC | 🟡 |
| V | 0.95 | DÜŞÜK | Hesabın %2-3'ü | Geniş ($32) | IC, Spread | 🔴 |
| UNH | 0.75 | DÜŞÜK | Hesabın %2-3'ü | Geniş ($55) | Bull Call, Butterfly | 🔴 |
| ABT | 0.70 | DÜŞÜK | Hesabın %2-3'ü | Dar ($23) | Long Call, Butterfly | 🟢 |
| LMT | 0.70 | DÜŞÜK | Hesabın %2-3'ü | Geniş ($48) | Long Call, IC | 🟡 |
| TMO | 0.80 | DÜŞÜK | Hesabın %2-3'ü | Geniş ($55) | Long Call, Butterfly | 🟡 |
| CVX | 0.80 | DÜŞÜK | Hesabın %2-3'ü | Geniş ($31) | Bull Put, Put Fly | ⚫ |
| XOM | 0.85 | DÜŞÜK | Hesabın %2-3'ü | Dar ($22) | Bull Put, Put Fly | ⚫ |
| RTX | 0.85 | DÜŞÜK | Hesabın %2-3'ü | Dar ($23) | Long Call, IC | 🟡 |
| UPS | 0.90 | DÜŞÜK | Hesabın %2-3'ü | Dar ($23) | Long Call, IC | 🟡 |
| CMCSA | 0.90 | DÜŞÜK | Hesabın %2-3'ü | Dar ($8) | Long Call, IC | 🟢 |
| SBUX | 0.85 | DÜŞÜK | Hesabın %2-3'ü | Dar ($19) | Long Call, IC | 🟡 |
| VZ | 0.40 | ÇOK DÜŞÜK | Hesabın %2-3'ü | Dar ($8) | Long Call, IC | 🟢 |
| JNJ | 0.26 | ÇOK DÜŞÜK | Hesabın %2-3'ü | N/A | Long Call, Butterfly | 🟢 |
| PFE | 0.55 | ÇOK DÜŞÜK | Hesabın %2-3'ü | N/A | Bull Put, IC | 🟢 |
| MRK | 0.45 | ÇOK DÜŞÜK | Hesabın %2-3'ü | N/A | Long Call, IC | 🟢 |
| LLY | 0.50 | ÇOK DÜŞÜK | Hesabın %2-3'ü | N/A | Long Call, IC | 🟢 |
| MCD | 0.60 | ÇOK DÜŞÜK | Hesabın %2-3'ü | N/A | Long Call, IC | 🟡 |
| KO | 0.55 | ÇOK DÜŞÜK | Hesabın %2-3'ü | N/A | Long Call, IC | 🟢 |
| WMT | 0.50 | ÇOK DÜŞÜK | Hesabın %2-3'ü | N/A | Long Call, IC | 🟡 |
| IBM | 0.85 | DÜŞÜK | Hesabın %2-3'ü | Dar ($24) | Long Call, IC | 🟡 |

#### Beta Bazlı Wing Genişliği Formülü

```
Wing Genişliği = Hisse Fiyatı / (10 / Beta)

Örnekler:
- AMD: $490 / (10 / 2.49) = $490 / 4.02 = ~$122 (ama pratikte $49 kullanılır)
- AAPL: $302 / (10 / 1.09) = $302 / 9.17 = ~$33 (pratikte $30)
- JNJ: $160 / (10 / 0.26) = $160 / 38.46 = ~$4 (pratikte N/A, spread kullanılır)

Pratik Kural:
- Beta > 2.0: Wing = Fiyat / 10
- Beta 1.0-2.0: Wing = Fiyat / 10
- Beta < 1.0: Wing = Fiyat / 20 veya Spread kullan
```

---

### Ek D: YENİ — Greeks Dashboard (Tüm Hisseler)

> **45+ hisse için Greeks değerleri ve yönetim rehberi.** Entry anında hedeflenen Greeks değerleri.

#### Greeks Hedefleri (Entry Anında)

| Hisse | Delta Hedef | Gamma Hedef | Theta Hedef | Vega Hedef | Rho Hedef | Strateji |
|-------|-------------|-------------|-------------|------------|-----------|----------|
| AMD | ±0.05 | <0.01 | Pozitif | -0.50 | Nötr | IC, Butterfly |
| TSLA | ±0.05 | <0.01 | Pozitif | -0.40 | Nötr | IC, Butterfly |
| NVDA | ±0.03 | <0.005 | Pozitif | -0.30 | Nötr | Butterfly |
| META | ±0.05 | <0.01 | Pozitif | -0.45 | Nötr | IC, Ratio |
| AAPL | ±0.05 | <0.01 | Pozitif | -0.35 | Nötr | IC, Calendar |
| MSFT | ±0.05 | <0.01 | Pozitif | -0.35 | Nötr | IC, Calendar |
| AMZN | ±0.05 | <0.01 | Pozitif | -0.40 | Nötr | IC, Butterfly |
| GOOGL | ±0.05 | <0.01 | Pozitif | -0.35 | Nötr | IC, Calendar |
| NFLX | ±0.05 | <0.01 | Pozitif | -0.25 | Nötr | IC, Bear Put |
| CRM | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | IC, Spread |
| ADBE | ±0.05 | <0.01 | Pozitif | -0.40 | Nötr | IC, Spread |
| INTC | ±0.03 | <0.005 | Pozitif | -0.15 | Nötr | IC, Spread |
| AVGO | ±0.05 | <0.01 | Pozitif | -0.35 | Nötr | IC, Spread |
| QCOM | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | IC, Spread |
| TXN | ±0.05 | <0.01 | Pozitif | -0.25 | Nötr | IC, Spread |
| MRVL | ±0.03 | <0.005 | Pozitif | -0.20 | Nötr | IC, Butterfly |
| LRCX | ±0.03 | <0.005 | Pozitif | -0.18 | Nötr | IC, Butterfly |
| AMAT | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | IC, Spread |
| TSM | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | IC, Spread |
| UBER | ±0.05 | <0.01 | Pozitif | -0.25 | Nötr | IC, Spread |
| SHOP | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | IC, Butterfly |
| SNOW | ±0.05 | <0.01 | Pozitif | -0.35 | Nötr | IC, Butterfly |
| CRWD | ±0.05 | <0.01 | Pozitif | -0.40 | Nötr | IC, Butterfly |
| PANW | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | IC, Spread |
| ZS | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | IC, Spread |
| NET | ±0.03 | <0.005 | Pozitif | -0.20 | Nötr | IC, Butterfly |
| DDOG | ±0.03 | <0.005 | Pozitif | -0.22 | Nötr | IC, Butterfly |
| PLTR | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | IC, Butterfly |
| IBM | ±0.03 | <0.005 | Pozitif | -0.25 | Nötr | IC, Spread |
| ORCL | ±0.03 | <0.005 | Pozitif | -0.22 | Nötr | IC, Spread |
| JPM | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | Bear Call, IC |
| BAC | ±0.03 | <0.005 | Pozitif | -0.15 | Nötr | Bull Put, IC |
| WFC | ±0.03 | <0.005 | Pozitif | -0.18 | Nötr | Long IC |
| C | ±0.03 | <0.005 | Pozitif | -0.15 | Nötr | Bear Call, IC |
| MS | ±0.03 | <0.005 | Pozitif | -0.20 | Nötr | Bear Call, IC |
| BLK | ±0.05 | <0.01 | Pozitif | -0.35 | Nötr | Bear Call, IC |
| GS | ±0.05 | <0.01 | Pozitif | -0.40 | Nötr | IC, Put Fly |
| V | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | IC, Spread |
| MA | ±0.05 | <0.01 | Pozitif | -0.35 | Nötr | IC, Spread |
| UNH | +0.05 | <0.01 | Pozitif | -0.30 | Nötr | Bull Call |
| XOM | -0.03 | <0.005 | Pozitif | -0.20 | Nötr | Bull Put, Put Fly |
| CVX | -0.03 | <0.005 | Pozitif | -0.22 | Nötr | Bull Put, Put Fly |
| DIS | ±0.03 | <0.005 | Pozitif | -0.20 | Nötr | Bear Call, IC |
| NKE | ±0.03 | <0.005 | Pozitif | -0.15 | Nötr | Bear Call, IC |
| HD | ±0.03 | <0.005 | Pozitif | -0.25 | Nötr | Long Call, IC |
| WMT | ±0.03 | <0.005 | Pozitif | -0.15 | Nötr | Long Call, IC |
| BA | ±0.05 | <0.01 | Pozitif | -0.35 | Nötr | IC, Butterfly |
| MCD | ±0.03 | <0.005 | Pozitif | -0.20 | Nötr | Long Call, IC |
| SBUX | ±0.03 | <0.005 | Pozitif | -0.15 | Nötr | Long Call, IC |
| KO | ±0.02 | <0.003 | Pozitif | -0.10 | Nötr | Long Call, IC |
| CMCSA | ±0.02 | <0.003 | Pozitif | -0.08 | Nötr | Long Call, IC |
| VZ | ±0.02 | <0.003 | Pozitif | -0.08 | Nötr | Long Call, IC |
| UPS | ±0.03 | <0.005 | Pozitif | -0.20 | Nötr | Long Call, IC |
| CAT | ±0.03 | <0.005 | Pozitif | -0.25 | Nötr | Long Call, IC |
| LMT | ±0.03 | <0.005 | Pozitif | -0.30 | Nötr | Long Call, IC |
| RTX | ±0.03 | <0.005 | Pozitif | -0.20 | Nötr | Long Call, IC |
| JNJ | +0.03 | <0.005 | Pozitif | -0.15 | Nötr | Long Call, Butterfly |
| PFE | +0.02 | <0.003 | Pozitif | -0.10 | Nötr | Bull Put, IC |
| ABT | +0.03 | <0.005 | Pozitif | -0.18 | Nötr | Long Call, Butterfly |
| TMO | +0.03 | <0.005 | Pozitif | -0.30 | Nötr | Long Call, Butterfly |
| MRK | +0.02 | <0.003 | Pozitif | -0.15 | Nötr | Long Call, IC |
| LLY | +0.03 | <0.005 | Pozitif | -0.35 | Nötr | Long Call, IC |

#### Greeks Yönetim Rehberi

**Delta Yönetimi:**
- Entry: ±0.05 (tek hisse), ±0.10 (portföy)
- FOMC yaklaşıyorsa: ±0.03 (tek hisse), ±0.05 (portföy)
- VIX > 25: ±0.03 (tek hisse), ±0.05 (portföy)
- Düzeltme: Hedge ekle (index put/call veya ters yönlü spread)

**Gamma Yönetimi:**
- Entry: Mümkün olduğunca düşük
- 21 DTE yaklaşıyorsa: Pozisyonu kapat veya küçült
- Gamma patlaması riski: 7 DTE'den önce kapat
- Düzeltme: Daha uzun vadeli pozisyonlara geç

**Theta Yönetimi:**
- Hedef: Pozitif (kredi stratejileri)
- Negatif theta = zaman aleyhinize işliyor
- Düzeltme: Debit spread'leri azalt, kredi stratejileri artır

**Vega Yönetimi:**
- Hedef: Hafif negatif (IV crush'tan kazanç)
- Çok negatif = IV artışından zarar
- Çok pozitif = IV crush'tan zarar
- Düzeltme: Vega nötr hedge ekle (butterfly, calendar)

---

### Ek E: YENİ — Expected Move Hesaplama Rehberi

> **Earnings öncesi Expected Move (EM) hesaplama formülleri ve pratik rehber.** 45+ hisse için uygulanabilir.

#### Expected Move Formülleri

**Formül 1: Basit IV Bazlı EM**
```
EM = Stock Price × IV × sqrt(Days to Expiration / 365)

Örnek (AAPL, 30 Temmuz earnings, 2 gün kala, IV 55%):
EM = $301.54 × 0.55 × sqrt(2/365) = $301.54 × 0.55 × 0.074 = ~$12.30 (%4.1)
```

**Formül 2: Straddle Fiyatı Bazlı EM**
```
EM = (Call Price + Put Price) at ATM Strike

Örnek (AAPL, ATM $302.50C = $8.50, ATM $302.50P = $7.80):
EM = $8.50 + $7.80 = $16.30 (%5.4)
```

**Formül 3: Historical Move Bazlı EM**
```
EM = Average of Last 4 Earnings Moves (absolute value)

Örnek (AAPL son 4 earnings hareketi: +%3.2, -%5.1, +%2.8, -%4.5):
EM = (3.2 + 5.1 + 2.8 + 4.5) / 4 = %3.9
```

**Formül 4: Composite EM (Önerilen)**
```
Composite EM = (IV EM × 0.4) + (Straddle EM × 0.4) + (Historical EM × 0.2)

Örnek (AAPL):
Composite EM = ($12.30 × 0.4) + ($16.30 × 0.4) + ($11.76 × 0.2) = $4.92 + $6.52 + $2.35 = ~$13.80 (%4.6)
```

#### 45+ Hisse için Expected Move Tablosu

| Hisse | Fiyat | IV | DTE | IV EM | Straddle EM | Historical EM | Composite EM | Short Strike (EM+%15) |
|-------|-------|-----|-----|-------|-------------|---------------|--------------|----------------------|
| AAPL | $301.54 | 55% | 2 | $12.30 | $16.30 | $11.76 | $13.80 | $317+ |
| MSFT | $411.74 | 50% | 2 | $11.40 | $15.20 | $10.80 | $12.80 | $425+ |
| AMZN | $245.22 | 60% | 2 | $12.20 | $16.50 | $14.20 | $14.20 | $260+ |
| GOOGL | $363.31 | 58% | 2 | $12.40 | $16.80 | $13.60 | $14.60 | $379+ |
| META | $585.39 | 65% | 2 | $17.80 | $23.50 | $19.20 | $20.40 | $606+ |
| TSLA | $408.95 | 80% | 2 | $18.20 | $24.50 | $22.80 | $21.80 | $431+ |
| NVDA | $208.64 | 70% | 2 | $8.60 | $11.50 | $10.20 | $10.20 | $219+ |
| AMD | $490.33 | 91.69% | 2 | $13.80 | $18.50 | $16.20 | $16.40 | $507+ |
| NFLX | $82.64 | 75% | 2 | $3.40 | $4.60 | $4.20 | $4.20 | $87+ |
| INTC | $25.00 | 55% | 2 | $1.02 | $1.40 | $1.20 | $1.24 | $26+ |
| CRM | $285.00 | 55% | 2 | $11.60 | $15.40 | $13.20 | $13.80 | $299+ |
| ADBE | $520.00 | 55% | 2 | $21.20 | $28.20 | $24.50 | $25.00 | $545+ |
| AVGO | $185.00 | 50% | 2 | $5.10 | $6.80 | $6.20 | $6.20 | $192+ |
| QCOM | $195.00 | 50% | 2 | $5.40 | $7.20 | $6.50 | $6.60 | $202+ |
| TXN | $195.00 | 48% | 2 | $5.10 | $6.80 | $6.00 | $6.20 | $202+ |
| MRVL | $85.00 | 48% | 2 | $2.20 | $3.00 | $2.60 | $2.70 | $88+ |
| LRCX | $75.00 | 48% | 2 | $1.96 | $2.60 | $2.30 | $2.40 | $78+ |
| AMAT | $165.00 | 48% | 2 | $4.30 | $5.80 | $5.00 | $5.20 | $171+ |
| TSM | $185.00 | 48% | 2 | $4.80 | $6.40 | $5.60 | $5.80 | $191+ |
| UBER | $78.00 | 48% | 2 | $2.02 | $2.70 | $2.40 | $2.50 | $81+ |
| SHOP | $145.00 | 48% | 2 | $3.76 | $5.00 | $4.40 | $4.60 | $150+ |
| SNOW | $165.00 | 48% | 2 | $4.30 | $5.80 | $5.00 | $5.20 | $171+ |
| CRWD | $385.00 | 48% | 2 | $10.00 | $13.40 | $11.80 | $12.20 | $398+ |
| PANW | $195.00 | 48% | 2 | $5.10 | $6.80 | $6.00 | $6.20 | $202+ |
| ZS | $195.00 | 48% | 2 | $5.10 | $6.80 | $6.00 | $6.20 | $202+ |
| NET | $115.00 | 48% | 2 | $3.00 | $4.00 | $3.50 | $3.70 | $119+ |
| DDOG | $125.00 | 48% | 2 | $3.26 | $4.40 | $3.80 | $3.96 | $129+ |
| PLTR | $125.00 | 48% | 2 | $3.26 | $4.40 | $3.80 | $3.96 | $129+ |
| IBM | $240.00 | 45% | 2 | $5.40 | $7.20 | $6.40 | $6.60 | $247+ |
| ORCL | $175.00 | 45% | 2 | $3.90 | $5.20 | $4.60 | $4.80 | $180+ |
| JPM | $230.00 | 45% | 2 | $5.20 | $6.90 | $6.20 | $6.30 | $237+ |
| BAC | $40.00 | 50% | 2 | $1.12 | $1.50 | $1.30 | $1.36 | $41+ |
| WFC | $58.00 | 45% | 2 | $1.30 | $1.74 | $1.50 | $1.58 | $60+ |
| C | $65.00 | 45% | 2 | $1.46 | $1.96 | $1.70 | $1.78 | $67+ |
| MS | $105.00 | 45% | 2 | $2.36 | $3.16 | $2.80 | $2.90 | $108+ |
| BLK | $950.00 | 45% | 2 | $21.40 | $28.60 | $25.00 | $25.80 | $976+ |
| GS | $600.00 | 55% | 2 | $13.80 | $18.40 | $16.00 | $16.60 | $617+ |
| V | $320.00 | 40% | 2 | $4.00 | $5.40 | $4.80 | $4.90 | $325+ |
| MA | $530.00 | 40% | 2 | $6.60 | $8.80 | $7.80 | $8.00 | $538+ |
| UNH | $550.00 | 40% | 2 | $6.80 | $9.20 | $8.00 | $8.30 | $558+ |
| XOM | $110.00 | 50% | 2 | $3.08 | $4.10 | $3.60 | $3.74 | $114+ |
| CVX | $155.00 | 48% | 2 | $4.04 | $5.40 | $4.80 | $4.96 | $160+ |
| DIS | $85.00 | 50% | 2 | $2.38 | $3.20 | $2.80 | $2.90 | $88+ |
| NKE | $72.00 | 48% | 2 | $1.88 | $2.52 | $2.20 | $2.30 | $74+ |
| HD | $360.00 | 40% | 2 | $4.50 | $6.00 | $5.40 | $5.50 | $366+ |
| WMT | $95.00 | 40% | 2 | $1.20 | $1.60 | $1.40 | $1.44 | $97+ |
| BA | $215.00 | 45% | 2 | $4.30 | $5.80 | $5.00 | $5.20 | $221+ |
| MCD | $310.00 | 40% | 2 | $3.90 | $5.20 | $4.60 | $4.70 | $315+ |
| SBUX | $95.00 | 40% | 2 | $1.20 | $1.60 | $1.40 | $1.44 | $97+ |
| KO | $68.00 | 35% | 2 | $0.80 | $1.08 | $0.96 | $0.98 | $69+ |
| CMCSA | $42.00 | 35% | 2 | $0.50 | $0.66 | $0.60 | $0.61 | $43+ |
| VZ | $42.00 | 35% | 2 | $0.50 | $0.66 | $0.60 | $0.61 | $43+ |
| UPS | $115.00 | 40% | 2 | $1.44 | $1.92 | $1.70 | $1.74 | $117+ |
| CAT | $360.00 | 40% | 2 | $4.50 | $6.00 | $5.40 | $5.50 | $366+ |
| LMT | $480.00 | 40% | 2 | $6.00 | $8.00 | $7.20 | $7.30 | $488+ |
| RTX | $115.00 | 40% | 2 | $1.44 | $1.92 | $1.70 | $1.74 | $117+ |
| JNJ | $160.00 | 30% | 2 | $0.96 | $1.28 | $1.12 | $1.15 | $162+ |
| PFE | $28.00 | 35% | 2 | $0.34 | $0.46 | $0.40 | $0.41 | $29+ |
| ABT | $115.00 | 40% | 2 | $1.44 | $1.92 | $1.70 | $1.74 | $117+ |
| TMO | $550.00 | 40% | 2 | $6.80 | $9.20 | $8.00 | $8.30 | $558+ |
| MRK | $105.00 | 40% | 2 | $1.30 | $1.74 | $1.50 | $1.58 | $107+ |
| LLY | $850.00 | 40% | 2 | $10.60 | $14.20 | $12.40 | $12.90 | $863+ |

#### Expected Move Kullanım Rehberi

**Short Strike Seçimi:**
- Short Call Strike = Current Price + Composite EM + %10-15 buffer
- Short Put Strike = Current Price - Composite EM - %10-15 buffer
- Örnek (AAPL): Short Call = $301.54 + $13.80 + $20 = ~$335, Short Put = $301.54 - $13.80 - $20 = ~$268

**Wing Genişliği Kontrolü:**
- Wing Width = Hisse Fiyatı / 10 (standart)
- EM > Wing Width ise: Daha geniş wing veya butterfly kullan
- EM < Wing Width ise: Standart wing yeterli

**Risk Değerlendirmesi:**
- EM / Stock Price > %5 = Yüksek volatilite, dikkatli ol
- EM / Stock Price < %3 = Düşük volatilite, standart stratejiler
- EM / Stock Price > %8 = Extreme volatilite, butterfly veya hedge kullan

---

### Ek F: YENİ — 0DTE/1DTE Earnings Stratejileri

> **0DTE (Zero Days to Expiration) ve 1DTE (One Day to Expiration) earnings stratejileri.** Yüksek risk, yüksek getiri. Yalnızca deneyimli traderlar için. VIX 19.44 seviyesinde 0DTE stratejileri optimal.

#### 0DTE Earnings Stratejileri

**0DTE Iron Condor (SPX):**
- **Yapı:** 10-point SPX spread, ~$1 prim
- **Entry:** 10:00-10:30 AM (açılış volatilitesi dinince)
- **Çıkış:** "Set and forget" veya 10-cent bid
- **Pozisyon:** Hesabın %2-5'inden fazla olmamalı
- **Risk:** $9 kayıp / $1 kazanma (Gamma riski zirvede)
- **Kazanma Olasılığı:** %55-60
- **VIX 19.44 Etkisi:** VIX < 20'de 0DTE primleri düşük, fırsat sınırlı. VIX 20-25'te optimal.

**0DTE Scalping (SPX/SPY):**
- **Entry:** 9:45-11:00 veya 13:00-14:30
- **Hedef:** 10-20 SPX puanı ($100-200/kontrat)
- **Stop:** 2x kredi
- **Max risk:** %0.5
- **Kazanma Olasılığı:** %50-55
- **VIX 19.44 Etkisi:** VIX < 20'de hareket sınırlı, scalping zor. VIX 20-25'te optimal.

**0DTE Long Straddle (Earnings):**
- **Yapı:** ATM Call + ATM Put, same expiry (0DTE)
- **Maliyet:** $2-5 (SPY), $20-50 (tek hisse)
- **Hedef:** Earnings hareketi > EM
- **Risk:** %100 kayıp (yanlış yönde veya sınırlı hareket)
- **Kazanma Olasılığı:** %30-35
- **VIX 19.44 Etkisi:** 0DTE straddle maliyeti düşük. VIX < 20'de ucuz, VIX > 25'te pahalı.

#### 1DTE Earnings Stratejileri

**1DTE Iron Condor (Hisse Bazlı):**
- **Yapı:** 1 gün vadeli IC, hisse bazlı
- **Entry:** Earnings günü sabah (BMO için) veya önceki gün akşam (AMC için)
- **Çıkış:** Ertesi gün sabah (IV crush sonrası)
- **Pozisyon:** Hesabın %1-2'si
- **Risk:** Gamma riski yüksek, IV crush fırsatı
- **Kazanma Olasılığı:** %55-60
- **Örnek:** AAPL 1DTE IC (30 Temmuz expiry), entry 29 Temmuz akşam, exit 31 Temmuz sabah

**1DTE Butterfly (Hisse Bazlı):**
- **Yapı:** 1 gün vadeli butterfly
- **Maliyet:** $0.50-$2.00
- **Max Kar:** $5-$20
- **Risk:** Sınırlı (maliyet = max risk)
- **Kazanma Olasılığı:** %40-45
- **VIX 19.44 Etkisi:** 1DTE butterfly maliyeti düşük. VIX < 20'de ucuz.

#### 0DTE/1DTE Risk Yönetimi

| Kural | Detay | Eşik | Aksiyon |
|-------|-------|------|---------|
| **Pozisyon Boyutu** | Hesabın %0.5-2'si | >%2 | Pozisyonu küçült |
| **VIX > 25** | 0DTE/1DTE risk artar | VIX > 25 | Pozisyon boyutunu %50 azalt |
| **VIX > 30** | 0DTE/1DTE çok riskli | VIX > 30 | 0DTE/1DTE açma |
| **Gamma Riski** | 0DTE gamma zirvede | 14:00 ET sonrası | Pozisyon kapat veya küçült |
| **Likidite** | Sadece likit hisseler | Bid-ask spread > %5 | Açma |
| **FOMC Kuralı** | FOMC günü 0DTE yasak | 28-29 Temmuz | 0DTE/1DTE açma |

#### 0DTE/1DTE Uygun Hisseler (45+ arasından)

| Hisse | Likidite | IV Rank | 0DTE Uygunluk | 1DTE Uygunluk | Not |
|-------|----------|---------|---------------|---------------|-----|
| SPY | Çok Yüksek | N/A | ✅ Evet | ✅ Evet | En likit |
| QQQ | Çok Yüksek | N/A | ✅ Evet | ✅ Evet | Tech likit |
| AAPL | Çok Yüksek | 55% | ✅ Evet | ✅ Evet | En likit hisse |
| MSFT | Çok Yüksek | 50% | ✅ Evet | ✅ Evet | Likit |
| AMZN | Çok Yüksek | 60% | ✅ Evet | ✅ Evet | Likit |
| GOOGL | Çok Yüksek | 58% | ✅ Evet | ✅ Evet | Likit |
| META | Çok Yüksek | 65% | ✅ Evet | ✅ Evet | Likit |
| TSLA | Çok Yüksek | 80% | ✅ Evet | ✅ Evet | Volatil, likit |
| NVDA | Çok Yüksek | 70% | ✅ Evet | ✅ Evet | Volatil, likit |
| AMD | Yüksek | 91.69% | ✅ Evet | ✅ Evet | Volatil |
| NFLX | Yüksek | 75% | ✅ Evet | ✅ Evet | Volatil |
| JPM | Yüksek | 45% | ⚠️ Dikkat | ✅ Evet | Finansal |
| BAC | Yüksek | 50% | ⚠️ Dikkat | ✅ Evet | Finansal |
| XOM | Orta | 50% | ⚠️ Dikkat | ⚠️ Dikkat | Enerji |
| UNH | Orta | 40% | ❌ Hayır | ⚠️ Dikkat | Sağlık |
| JNJ | Orta | 30% | ❌ Hayır | ❌ Hayır | Düşük volatilite |
| KO | Düşük | 35% | ❌ Hayır | ❌ Hayır | Düşük volatilite |

#### 0DTE/1DTE Earnings Playbook

**BMO Earnings (Örnek: JPM, 14 Temmuz):**
1. Önceki gün akşam: 1DTE pozisyonu aç (13 Temmuz)
2. Earnings sabahı (6:00 AM): Sonucu izle
3. Piyasa açılışı (9:30 AM): IV crush'ı değerlendir
4. 10:00-10:30 AM: Pozisyonu kapat (0DTE scalping fırsatı)

**AMC Earnings (Örnek: NFLX, 16 Temmuz):**
1. Earnings günü sabah: 1DTE pozisyonu aç (16 Temmuz)
2. Earnings akşamı (4:00-5:30 PM): Sonucu izle
3. Aynı akşam: After-hours değerlendirme
4. Ertesi gün sabah (9:30 AM): IV crush'ı değerlendir, kapat

**FOMC + Earnings Çakışması (Örnek: MSFT, 29 Temmuz):**
1. FOMC kararı (14:00 ET): Sonucu izle
2. Earnings (16:00-17:30 ET): Sonucu izle
3. Aynı akşam: Çift volatilite değerlendirmesi
4. Ertesi gün sabah: IV crush + FOMC etkisi, kapat
5. **Not:** FOMC + earnings çakışmasında 0DTE/1DTE çok riskli. Dikkatli ol.

---

> **SON NOT:** Bu rapor, 12 Haziran 2026 tarihli piyasa verilerine dayanarak hazırlanmıştır. VIX: 19.44, FOMC: 28-29 Temmuz 2026. Tüm veriler gecikmeli olabilir ve yatırım tavsiyesi niteliğinde değildir. Piyasalar yüksek volatilite içerisinde olup, risk yönetimi kritik öneme sahiptir. Earnings tarihleri şirketler tarafından değiştirilebilir; yatırım kararı vermeden önce resmi kaynakları kontrol ediniz.

> **EarningsPlay v4.1 Hatırlatması:**
> 1. IV Rank > %50 → Iron Condor dene
> 2. Wing Width = Hisse fiyatı / 10
> 3. Kar hedefi = Toplanan kredinin %50'si
> 4. Stop-loss = Kredinin 2.0x'i
> 5. Pozisyon boyutu = Hesabın %1-2'si (VIX 19.44 = %100)
> 6. FOMC (28-29 Temmuz) = Pozisyonları küçült
> 7. Blackout (18-30 Temmuz) = Ekstra dikkat
> 8. Mekanik çıkış = Sorgusuz uygula
> 9. Delta nötrlüğü = ±0.10 (FOMC yaklaşıyorsa ±0.05)
> 10. VIX > 25 = Pozisyon boyutunu %50 azalt

---

*Rapor Son Güncelleme: 12 Haziran 2026*

*Hazırlayan: Risk Yönetimi ve Portföy Stratejisti AI Agent | EarningsPlay v4.1 Metodolojisi*

*Bu rapor gistify.pro platformuna uygun formatta hazırlanmıştır.*

---
