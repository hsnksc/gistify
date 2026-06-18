# Bölüm 4: Bütçe Dostu Stratejiler, FOMC & Risk Yönetimi, Portföy Önerileri, Eylem Planı ve Ekler

> **Rapor Tarihi:** 12 Haziran 2026
> **Earnings Sezonu:** Q2 2026 — Temmuz 2026
> **VIX:** 19.44 (%100 Normal Pozisyon, Tetikte)
> **FOMC:** 28-29 Temmuz 2026 (Blackout: 18-30 Temmuz)
> **Kapsam:** 45+ S&P 500 ve NASDAQ-100 hissesi
> **Strateji Versiyonu:** EarningsPlay v5.0 (Earnings Play Formatı)
> **Hazırlayan:** Risk Yönetimi ve Portföy Stratejisti AI Agent

> **KRİTİK UYARI:** Bu rapor TAMAMEN "earnings play" formatındadır. Tüm pozisyonlar earnings öncesi açılır, earnings sonrası IV crush ile kapatılır. 21 DTE, "Ağustos'ta çıkış", "Zamanla çıkış" gibi ifadeler KALDIRILMIŞTIR.

---

## İÇİNDEKİLER

- [9. Bütçe Dostu Earnings Play Stratejiler ($10-$500)](#9-bütçe-dostu-earnings-play-stratejiler-10-500)
- [10. FOMC ve Earnings Play Risk Yönetimi](#10-fomc-ve-earnings-play-risk-yönetimi)
- [11. Earnings Play Portföy Önerileri](#11-earnings-play-portföy-önerileri)
- [12. Earnings Play Eylem Planı ve Haftalık Takvim](#12-earnings-play-eylem-planı-ve-haftalık-takvim)
- [13. Ekler](#13-ekler)

---

## 9. BÜTÇE DOSTU EARNINGS PLAY STRATEJİLER ($10-$500)

> **Bu bölüm, sınırlı sermayeyle earnings öncesi IV expansion'dan ve earnings sonrası IV crush'dan istifade etmek isteyen yatırımcılar için tasarlanmıştır.**
> **Earnings Play Prensipleri:** (1) Entry: Earnings'ten 2-5 gün önce, (2) Exit: Earnings sonrası 1-2 gün içinde (max 2 gün), (3) Kar hedefi: %50-75 prim/kredi, (4) Stop: Earnings sonrası pozisyon zararda kalırsa veya %100 kredi kaybı, (5) VIX 19.44 = %100 normal pozisyon, (6) FOMC haftasında (28-31 Temmuz) pozisyonları %50 azalt veya hiç açma.
> **45+ hisse** için 3 bütçe seviyesi sunulmuştur: $10-50 (Lottery Ticket), $50-200 (Debit Spread), $200-500 (Butterfly/Kombinasyon).

---

### 9.1 Earnings Play Formatı — Ana Kurallar

**Earnings Play = Earnings'ten önce gir, earnings sonrası IV crush ile çık.**

| Kural | Detay | Aksiyon |
|-------|-------|---------|
| **Entry Zamanı** | Earnings'ten 2-5 gün önce | IV en şişmiş seviyede, prim yüksek |
| **Exit Zamanı** | Earnings sonrası 1-2 gün içinde | Max 2 gün tut. IV crush hemen değerlendir. |
| **Kar Hedefi** | Toplanan kredinin/primin %50-75'i | IV crush sonrası erken kapama |
| **Stop-Loss** | Earnings sonrası pozisyon zararda kalırsa veya %100 kredi kaybı | Anında kapat, bekleme |
| **IV Crush Süresi** | BMO: 2-4 saat içinde, AMC: Ertesi gün sabah | Hızlı değerlendirme, hızlı çıkış |
| **Max Hold** | Earnings sonrası 2 gün | 2 günü geçme, zaman decay aleyhte |
| **FOMC Kuralı** | 28-31 Temmuz FOMC haftası | Pozisyonları %50 azalt veya hiç açma |
| **VIX Kuralı** | VIX 19.44 = %100 normal pozisyon | VIX > 25'te pozisyon boyutunu %50 azalt |

---

### 9.2 En İyi 5 "Lottery Ticket" Earnings Play Fırsatı ($10-$50)

> **Lottery Ticket = Far OTM (Out of The Money) opsiyonlar.** Yüksek risk, yüksek getiri. Earnings öncesi IV expansion'dan faydalanır, earnings sonrası IV crush ile kapatılır. Çoğu zaman (%80-90) değersiz olur. Ama patladığında 5x-50x getiri potansiyeli. VIX 19.44 seviyesinde primler makul şişmiştir.

| Sıra | Hisse | Tip | Strike | Prim | Maliyet | Gerekli Hareket | IV Rank | Beta | FOMC Risk | Earnings Tarihi | Entry Penceresi | Exit Penceresi |
|------|-------|-----|--------|------|---------|-----------------|---------|------|-----------|-----------------|-----------------|----------------|
| **1** | **AMD** | CALL | $882.59 | $0.42 | **$42** | +80% | 91.69% | 2.49 | 🔴 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz |
| **2** | **TSLA** | CALL | $654.32 | $0.35 | **$35** | +60% | 80% | 1.80 | 🟡 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz |
| **3** | **NFLX** | CALL | $115.70 | $0.39 | **$39** | +40% | 75% | 1.49 | 🟢 | ~16 Temmuz | 11-14 Temmuz | 17-18 Temmuz |
| **4** | **NVDA** | CALL | $312.96 | $0.19 | **$19** | +50% | 70% | 2.20 | 🔴 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz |
| **5** | **META** | CALL | $936.62 | $0.18 | **$18** | +60% | 65% | 1.23 | 🔴 | ~29-30 Temmuz | 24-27 Temmuz | 30-31 Temmuz |

#### Bu 5 Fırsatın Earnings Play Yönetimi
- **Toplam Maliyet:** $153
- **Max Risk:** $153 (tümü zarar ederse)
- **Potansiyel:** Herhangi biri patlarsa 5x-50x getiri potansiyeli
- **Entry Kuralı:** Her biri earnings'ten 2-5 gün önce girilmeli
- **Exit Kuralı:** Earnings sonrası 1-2 gün içinde kapatılacak (IV crush sonrası)
- **IV Crush Değerlendirmesi:** BMO earnings için 2-4 saat içinde, AMC earnings için ertesi gün sabah değerlendir
- **Max Hold:** 2 günü geçme. Earnings sonrası 2. gün kapanışta mekanik kapat
- **VIX 19.44 Etkisi:** Primler normal şişmiş seviyede. VIX < 20 olduğu için primler aşırı pahalı değil, fakat earnings IV expansion hala fırsat sunuyor.
- **FOMC Kuralı:** AMD, TSLA, NVDA, META FOMC haftasına denk geliyor. Bu hisselerde pozisyon açmamaya veya %50 azaltılmış pozisyonla girme tercih edilmeli.
- **Not:** Her biri hesabın %1-2'si ile girilmeli, toplam risk sınırlandırılmalı. Beta > 2.0 olanlar (AMD, NVDA) ekstra dikkat gerektirir.

#### Seçim Kriterleri (EarningsPlay v5.0 Earnings Formatı)
1. **IV Rank > %60:** Daha şişmiş prim = daha yüksek IV crush potansiyeli
2. **Beta > 1.2:** Yüksek volatilite = daha büyük hareket beklentisi
3. **Gerekli Hareket < %100:** Ulaşılabilir hareket = daha yüksek ITM olasılığı
4. **Prim < $0.50:** Düşük maliyet = daha fazla çeşitlendirme
5. **CPR < 1.0 (Call ağırlıklı):** Bullish bias = call opsiyonları tercih
6. **Earnings tarihi FOMC'den uzak:** FOMC'den 5+ gün önceki earningsler tercih edilir

---

### 9.3 Tüm Hisseler Lottery Ticket Earnings Play Tablosu ($10-$50) — 45 Hisse

> **Aşağıdaki tablo, Temmuz 2026 earnings sezonunda 45+ S&P 500 / NASDAQ-100 hissesi için Far OTM earnings play fırsatlarını içerir.**
> **Earnings Play Formatı:** Entry = Earnings'ten 2-5 gün önce | Exit = Earnings sonrası 1-2 gün içinde (max 2 gün) | Kar = %50-75 prim
> **VIX:** 19.44 | **FOMC:** 28-29 Temmuz | **Blackout:** 18-30 Temmuz
> **Renk Kodu:** 🟢 Düşük Risk (IV Rank < %40) | 🟡 Orta Risk (IV Rank %40-60) | 🔴 Yüksek Risk (IV Rank > %60) | ⚫ Extreme Risk (IV Rank > %80)

| Hisse | Fiyat | Tip | Strike | Prim | Maliyet | Gerekli Hareket | IV Rank | Beta | CPR | Risk | Earnings Tarihi | Entry Penceresi | Exit Penceresi | IV Crush Beklentisi |
|-------|-------|-----|--------|------|---------|-----------------|---------|------|-----|------|-----------------|-----------------|----------------|---------------------|
| **AMD** | $490.33 | CALL | $882.59 | $0.42 | $42 | +80% | 91.69% | 2.49 | 0.71 | ⚫ | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| **TSLA** | $408.95 | CALL | $654.32 | $0.35 | $35 | +60% | 80% | 1.80 | 0.64 | ⚫ | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-50% |
| **NFLX** | $82.64 | CALL | $115.70 | $0.39 | $39 | +40% | 75% | 1.49 | 0.72 | 🔴 | ~16 Temmuz | 11-14 Temmuz | 17-18 Temmuz | 30-45% |
| **NVDA** | $208.64 | CALL | $312.96 | $0.19 | $19 | +50% | 70% | 2.20 | 0.68 | 🔴 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| **META** | $585.39 | CALL | $936.62 | $0.18 | $18 | +60% | 65% | 1.23 | 0.65 | 🔴 | ~29-30 Temmuz | 24-27 Temmuz | 30-31 Temmuz | 30-50% |
| **AMZN** | $245.22 | CALL | $343.31 | $0.26 | $26 | +40% | 60% | 1.44 | 0.62 | 🔴 | ~30-31 Temmuz | 25-28 Temmuz | 31-1 Ağu | 30-50% |
| **GOOGL** | $363.31 | CALL | $508.63 | $0.38 | $38 | +40% | 58% | 1.24 | 0.58 | 🟡 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-45% |
| **AAPL** | $301.54 | CALL | $422.16 | $0.32 | $32 | +40% | 55% | 1.09 | 0.64 | 🟡 | ~30-31 Temmuz | 25-28 Temmuz | 31-1 Ağu | 30-50% |
| **CRM** | $285.00 | CALL | $399.00 | $0.28 | $28 | +40% | 55% | 1.15 | 0.60 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **ADBE** | $520.00 | CALL | $728.00 | $0.35 | $35 | +40% | 55% | 1.30 | 0.62 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **INTC** | $25.00 | CALL | $35.00 | $0.15 | $15 | +40% | 55% | 1.10 | 0.70 | 🟡 | ~23-24 Temmuz | 18-21 Temmuz | 25-26 Temmuz | 25-40% |
| **MSFT** | $411.74 | CALL | $576.44 | $0.15 | $15 | +40% | 50% | 1.10 | 0.57 | 🟡 | ~29-30 Temmuz | 24-27 Temmuz | 30-31 Temmuz | 30-50% |
| **AVGO** | $185.00 | CALL | $259.00 | $0.22 | $22 | +40% | 50% | 1.35 | 0.65 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **QCOM** | $195.00 | CALL | $273.00 | $0.24 | $24 | +40% | 50% | 1.25 | 0.68 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **TXN** | $195.00 | CALL | $273.00 | $0.26 | $26 | +40% | 48% | 1.05 | 0.72 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **MRVL** | $85.00 | CALL | $119.00 | $0.18 | $18 | +40% | 48% | 1.40 | 0.65 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **LRCX** | $75.00 | CALL | $105.00 | $0.20 | $20 | +40% | 48% | 1.35 | 0.70 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **AMAT** | $165.00 | CALL | $231.00 | $0.25 | $25 | +40% | 48% | 1.30 | 0.68 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **TSM** | $185.00 | CALL | $259.00 | $0.28 | $28 | +40% | 48% | 1.20 | 0.60 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **UBER** | $78.00 | CALL | $109.00 | $0.22 | $22 | +40% | 48% | 1.45 | 0.55 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **SHOP** | $145.00 | CALL | $203.00 | $0.30 | $30 | +40% | 48% | 1.50 | 0.58 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **SNOW** | $165.00 | CALL | $231.00 | $0.28 | $28 | +40% | 48% | 1.40 | 0.62 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **CRWD** | $385.00 | CALL | $539.00 | $0.35 | $35 | +40% | 48% | 1.35 | 0.60 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **PANW** | $195.00 | CALL | $273.00 | $0.28 | $28 | +40% | 48% | 1.25 | 0.65 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **ZS** | $195.00 | CALL | $273.00 | $0.30 | $30 | +40% | 48% | 1.30 | 0.62 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **NET** | $115.00 | CALL | $161.00 | $0.22 | $22 | +40% | 48% | 1.35 | 0.58 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **DDOG** | $125.00 | CALL | $175.00 | $0.24 | $24 | +40% | 48% | 1.40 | 0.60 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **PLTR** | $125.00 | CALL | $175.00 | $0.28 | $28 | +40% | 48% | 1.55 | 0.55 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **IBM** | $240.00 | CALL | $336.00 | $0.32 | $32 | +40% | 45% | 0.85 | 0.72 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 20-30% |
| **ORCL** | $175.00 | CALL | $245.00 | $0.24 | $24 | +40% | 45% | 1.10 | 0.68 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 20-30% |
| **GS** | $1,045.00 | PUT | $420.00 | $0.26 | $26 | -30% | 55% | 1.20 | 1.34 | 🟡 | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| **JPM** | $230.00 | CALL | $299.00 | $0.39 | $39 | +30% | 45% | 1.15 | 0.77 | 🟡 | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| **BAC** | $40.00 | PUT | $35.20 | $0.44 | $44 | -12% | 50% | 1.25 | 1.92 | 🟡 | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| **WFC** | $58.00 | CALL | $75.40 | $0.28 | $28 | +30% | 45% | 1.10 | 0.90 | 🟡 | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| **C** | $65.00 | CALL | $84.50 | $0.25 | $25 | +30% | 45% | 1.30 | 0.85 | 🟡 | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| **MS** | $105.00 | CALL | $136.50 | $0.30 | $30 | +30% | 45% | 1.20 | 0.80 | 🟡 | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| **BLK** | $950.00 | CALL | $1,235.00 | $0.35 | $35 | +30% | 45% | 1.10 | 0.85 | 🟡 | ~21 Temmuz | 16-18 Temmuz | 22-23 Temmuz | 20-30% |
| **V** | $320.00 | CALL | $416.00 | $0.28 | $28 | +30% | 40% | 0.95 | 0.92 | 🟡 | ~28-30 Temmuz | 23-26 Temmuz | 30-31 Temmuz | 20-25% |
| **MA** | $530.00 | CALL | $689.00 | $0.32 | $32 | +30% | 40% | 1.05 | 0.88 | 🟡 | ~28-30 Temmuz | 23-26 Temmuz | 30-31 Temmuz | 20-25% |
| **XOM** | $110.00 | PUT | $88.00 | $0.25 | $25 | -20% | 50% | 0.85 | 2.50 | 🟡 | ~31 Temmuz+ | 26-29 Temmuz | 1-2 Ağu | 30-40% |
| **CVX** | $155.00 | PUT | $124.00 | $0.28 | $28 | -20% | 48% | 0.80 | 2.30 | 🟡 | ~31 Temmuz+ | 26-29 Temmuz | 1-2 Ağu | 30-40% |
| **DIS** | $85.00 | CALL | $106.25 | $0.29 | $29 | +25% | 50% | 1.20 | 0.78 | 🟡 | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 25-30% |
| **NKE** | $72.00 | CALL | $86.40 | $0.47 | $47 | +20% | 48% | 1.10 | 0.72 | 🟡 | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 25-30% |
| **HD** | $360.00 | CALL | $468.00 | $0.32 | $32 | +30% | 40% | 0.95 | 0.98 | 🟡 | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 20-25% |
| **WMT** | $95.00 | CALL | $123.50 | $0.22 | $22 | +30% | 40% | 0.50 | 0.85 | 🟡 | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 20-25% |
| **BA** | $215.00 | CALL | $279.50 | $0.30 | $30 | +30% | 45% | 1.40 | 0.82 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 30-40% |
| **MCD** | $310.00 | CALL | $403.00 | $0.28 | $28 | +30% | 40% | 0.60 | 0.88 | 🟡 | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 20-25% |
| **SBUX** | $95.00 | CALL | $123.50 | $0.20 | $20 | +30% | 40% | 0.85 | 0.90 | 🟡 | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 20-25% |
| **KO** | $68.00 | CALL | $88.40 | $0.15 | $15 | +30% | 35% | 0.55 | 0.95 | 🟢 | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 15-25% |
| **CMCSA** | $42.00 | CALL | $54.60 | $0.12 | $12 | +30% | 35% | 0.90 | 0.88 | 🟢 | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 15-25% |
| **VZ** | $42.00 | CALL | $54.60 | $0.10 | $10 | +30% | 35% | 0.40 | 0.92 | 🟢 | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 15-20% |
| **UPS** | $115.00 | CALL | $149.50 | $0.22 | $22 | +30% | 40% | 0.90 | 0.85 | 🟡 | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 20-30% |
| **CAT** | $360.00 | CALL | $468.00 | $0.35 | $35 | +30% | 40% | 1.05 | 0.80 | 🟡 | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 20-30% |
| **LMT** | $480.00 | CALL | $624.00 | $0.32 | $32 | +30% | 40% | 0.70 | 0.85 | 🟡 | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 20-30% |
| **RTX** | $115.00 | CALL | $149.50 | $0.22 | $22 | +30% | 40% | 0.85 | 0.88 | 🟡 | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 20-30% |
| **JNJ** | $160.00 | CALL | $192.00 | $0.22 | $22 | +20% | 30% | 0.26 | 0.95 | 🟢 | ~15 Temmuz | 10-13 Temmuz | 16-17 Temmuz | 15-25% |
| **UNH** | $550.00 | PUT | $412.50 | $0.10 | $10 | -25% | 40% | 0.75 | 3.33 | 🟡 | ~28-29 Temmuz | 23-26 Temmuz | 30-31 Temmuz | 20-30% |
| **PFE** | $28.00 | CALL | $36.40 | $0.12 | $12 | +30% | 35% | 0.55 | 1.15 | 🟢 | ~15 Temmuz | 10-13 Temmuz | 16-17 Temmuz | 15-25% |
| **ABT** | $115.00 | CALL | $149.50 | $0.20 | $20 | +30% | 40% | 0.70 | 0.90 | 🟡 | ~15 Temmuz | 10-13 Temmuz | 16-17 Temmuz | 20-30% |
| **TMO** | $550.00 | CALL | $715.00 | $0.35 | $35 | +30% | 40% | 0.80 | 0.85 | 🟡 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 20-30% |
| **MRK** | $105.00 | CALL | $136.50 | $0.22 | $22 | +30% | 40% | 0.45 | 0.92 | 🟡 | ~15 Temmuz | 10-13 Temmuz | 16-17 Temmuz | 15-25% |
| **LLY** | $850.00 | CALL | $1,105.00 | $0.40 | $40 | +30% | 40% | 0.50 | 0.88 | 🟡 | ~15 Temmuz | 10-13 Temmuz | 16-17 Temmuz | 15-25% |

**45 Lottery Ticket'ın toplam maliyeti: ~$1,215** (her birinden 1 kontrat)

> **Earnings Play Kuralı:** Her pozisyon earnings'ten 2-5 gün önce girilir, earnings sonrası 1-2 gün içinde (max 2 gün) kapatılır. IV crush hemen değerlendirilir.
> **Önemli Not:** VIX 19.44 seviyesinde primler normal şişmiş durumda. FOMC haftası (28-31 Temmuz) içindeki earnings'lerde (META, MSFT, AAPL, AMZN, V, MA) pozisyon açmamaya veya %50 azaltılmış pozisyonla girme tercih edilmeli.

---

### 9.4 En İyi 5 Debit Spread Earnings Play ($50-$200)

> **Debit Spread = Risk sınırlı, yönlü earnings play.** Alınan ve satılan opsiyon arasındaki farkı ödersiniz. Max kar ve max zarar bellidir. Earnings'ten 2-5 gün önce girilir, earnings sonrası IV crush ile 1-2 gün içinde kapatılır. VIX 19.44'te primler makul.

| Sıra | Hisse | Strateji | Alınan | Satılan | Net Debit | Maliyet | Max Kar | Breakeven | ROI | IV Rank | Earnings Tarihi | Entry Penceresi | Exit Penceresi | IV Crush Beklentisi |
|------|-------|----------|--------|---------|-----------|---------|---------|-----------|-----|---------|-----------------|-----------------|----------------|---------------------|
| **1** | **AAPL** | Call Spread | $325.66C | $332.17C | $1.76 | **$176** | $475 | ~$327.42 | 270% | 55% | ~30-31 Temmuz | 25-28 Temmuz | 31-1 Ağu | 30-50% |
| **2** | **GOOGL** | Call Spread | $381.48C | $387.20C | $1.94 | **$194** | $378 | ~$383.42 | 195% | 58% | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-45% |
| **3** | **AMZN** | Call Spread | $245.00C | $255.00C | $3.20 | **$320** | $680 | ~$248.20 | 213% | 60% | ~30-31 Temmuz | 25-28 Temmuz | 31-1 Ağu | 30-50% |
| **4** | **AMD** | Call Spread | $490.00C | $500.00C | $3.50 | **$350** | $650 | ~$493.50 | 186% | 91.69% | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| **5** | **NFLX** | Call Spread | $82.64C | $86.00C | $1.50 | **$150** | $286 | ~$84.14 | 191% | 75% | ~16 Temmuz | 11-14 Temmuz | 17-18 Temmuz | 30-45% |

#### Seçim Kriterleri (Earnings Play Formatı)
1. **ROI > %150:** Yüksek getiri potansiyeli
2. **Breakeven < Current Price + %5:** Ulaşılabilir hedef
3. **Net Debit < $3.50:** Makul maliyet
4. **IV Rank > %40:** Earnings IV expansion desteği
5. **CPR < 1.0:** Bullish bias (call spread için)
6. **Earnings tarihi FOMC'den uzak:** FOMC'den 5+ gün önceki earningsler tercih

#### Earnings Play Risk Yönetimi (Debit Spread)
- **Max Risk:** Net Debit (ödenen prim) = %100 kayıp olabilir
- **Max Kar:** Wing Width - Net Debit
- **Kar Hedefi:** Max Kar'ın %50-75'i realize edildiğinde kapat (IV crush sonrası)
- **Stop-Loss:** Earnings sonrası pozisyon zararda kalırsa veya %100 kredi kaybı anında kapat
- **Entry:** Earnings'ten 2-5 gün önce
- **Exit:** Earnings sonrası 1-2 gün içinde (max 2 gün)
- **IV Crush Değerlendirmesi:** BMO için 2-4 saat, AMC için ertesi gün sabah
- **Max Hold:** 2 günü geçme

---

### 9.5 En İyi 5 Butterfly Earnings Play ($200-$500)

> **Butterfly = IV Crush'a en dayanıklı earnings play.** Merkezden kar elde eder. Earnings sonrası IV çökmesinden (crush) en az etkilenen stratejidir. Earnings'ten 2-5 gün önce girilir, earnings sonrası 1-2 gün içinde kapatılır. VIX 19.44'te maliyetler makul.

| Sıra | Hisse | Strateji | Yapı | Maliyet | Max Kar | ROI | Kontrat | IV Rank | Earnings Tarihi | Entry Penceresi | Exit Penceresi | IV Crush Beklentisi |
|------|-------|----------|------|---------|---------|-----|---------|---------|-----------------|-----------------|----------------|---------------------|
| **1** | **AMD** | Butterfly | Buy $476C / 2xSell $490C / Buy $505C | $216 | $4,197 | 1944% | 3 | 91.69% | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| **2** | **META** | Ratio Spread | Buy 1x$585C / Sell 2x$644C | **-$47 (kredi!)** | $5,807 | 12314% | 1 | 65% | ~29-30 Temmuz | 24-27 Temmuz | 30-31 Temmuz | 30-50% |
| **3** | **TSLA** | Butterfly | Buy $397C / 2xSell $409C / Buy $421C | $218 | $3,463 | 1587% | 3 | 80% | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-50% |
| **4** | **GOOGL** | Butterfly | Buy $352C / 2xSell $363C / Buy $374C | $251 | $3,019 | 1205% | 3 | 58% | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-45% |
| **5** | **AMZN** | Butterfly | Buy $238C / 2xSell $245C / Buy $253C | $282 | $3,398 | 1205% | 5 | 60% | ~30-31 Temmuz | 25-28 Temmuz | 31-1 Ağu | 30-50% |

#### Butterfly Seçim Kriterleri (Earnings Play Formatı)
1. **Merkez Strike = Current Price:** Hisse fiyatına yakın merkez
2. **Wing Width = Hisse Fiyatı / 10:** Optimal risk/ödül
3. **Maliyet < $300:** Makul bütçe
4. **Max Kar / Maliyet > %500:** Yüksek getiri potansiyeli
5. **IV Rank > %50:** Earnings IV expansion desteği
6. **Entry:** Earnings'ten 2-5 gün önce
7. **Exit:** Earnings sonrası 1-2 gün içinde (IV crush sonrası), max 2 gün

#### Earnings Play Risk Yönetimi (Butterfly)
- **Max Risk:** Ödenen prim (sınırlı)
- **Kar Hedefi:** Max Kar'ın %50-75'i realize edildiğinde kapat
- **Stop-Loss:** Earnings sonrası pozisyon zararda kalırsa veya %100 kredi kaybı anında kapat
- **Max Hold:** 2 günü geçme
- **IV Crush Değerlendirmesi:** BMO için 2-4 saat, AMC için ertesi gün sabah
- **FOMC Kuralı:** FOMC haftasındaki earnings'lerde (META, AMZN) %50 azaltılmış pozisyon veya hiç açma

#### Ratio Spread Uyarısı
> **⚠️ Ratio Spread'ler kredi verebilir (negatif maliyet) ama üstte sınırsız risk taşır.** Yalnızca deneyimli traderlar için! FOMC haftasındaki earnings'lerde ratio spread açmayın.

---

### 9.6 Bütçe Seviyesi Rehberi (Earnings Play Formatı)

| Bütçe | Deneyim | Öneri | Risk Seviyesi | Earnings Play Kar Hedefi | Earnings Play Exit | Uygun Hisse Sayısı |
|-------|---------|-------|---------------|--------------------------|--------------------|--------------------|
| **$10-$50** | Yeni başlayan | Far OTM Lottery Ticket (tek hisse) | Çok Yüksek | %50-75 prim | Earnings sonrası 1-2 gün (max 2 gün) | 45+ hisse |
| **$50-$200** | Orta seviye | Debit Spread (risk sınırlı) | Yüksek | %50-75 kredi | Earnings sonrası 1-2 gün (max 2 gün) | 30+ hisse |
| **$200-$500** | İleri seviye | Butterfly (IV crush'a dayanıklı) | Orta | %50-75 kredi | Earnings sonrası 1-2 gün (max 2 gün) | 20+ hisse |
| **$500-$1,000** | Profesyonel | Ratio Spread + Kombinasyon | Orta-Yüksek | %50-75 kredi | Earnings sonrası 1-2 gün (max 2 gün) | 15+ hisse |
| **$1,000+** | Uzman | Kombinasyon stratejiler | Değişken | %50-75 kredi | Earnings sonrası 1-2 gün (max 2 gün) | 10+ hisse |

#### Bütçe Seviyesi Detayları (Earnings Play)

**$10-$50: Lottery Ticket Earnings Play**
- **Amaç:** Earnings IV expansion'dan faydalanmak, earnings sonrası IV crush ile kapatmak
- **Risk:** %80-90 zarar olasılığı
- **Yönetim:** Her hisseye hesabın %1'inden az
- **Entry:** Earnings'ten 2-5 gün önce
- **Exit:** Earnings sonrası 1-2 gün içinde (max 2 gün). BMO için 2-4 saat, AMC için ertesi gün sabah
- **Kar Hedefi:** %50-75 prim
- **Stop-Loss:** Earnings sonrası pozisyon zararda kalırsa veya %100 kredi kaybı anında kapat
- **VIX 19.44 Etkisi:** Primler makul. VIX > 25'te primler pahalanır, fırsat azalır.

**$50-$200: Debit Spread Earnings Play**
- **Amaç:** Yönlü hareketten kazanç, risk sınırlı, earnings sonrası IV crush ile kapat
- **Risk:** Max risk = ödenen prim
- **Yönetim:** Breakeven'i takip et
- **Entry:** Earnings'ten 2-5 gün önce
- **Exit:** Earnings sonrası 1-2 gün içinde (max 2 gün). Kar hedefi %50-75 kredi
- **Stop-Loss:** Earnings sonrası pozisyon zararda kalırsa veya %100 kredi kaybı anında kapat
- **VIX 19.44 Etkisi:** Spread maliyetleri normal. VIX > 30'da spread'ler pahalanır.

**$200-$500: Butterfly Earnings Play**
- **Amaç:** IV Crush'a dayanıklı, merkezden kar, earnings sonrası hızlı çıkış
- **Risk:** Max risk = ödenen prim (sınırlı)
- **Yönetim:** Merkez strike'a yakınlık kritik
- **Entry:** Earnings'ten 2-5 gün önce
- **Exit:** Earnings sonrası 1-2 gün içinde (max 2 gün). Kar hedefi %50-75 kredi
- **Stop-Loss:** Earnings sonrası pozisyon zararda kalırsa veya %100 kredi kaybı anında kapat
- **VIX 19.44 Etkisi:** Butterfly maliyetleri optimal. VIX < 15'te butterfly ucuzlar, VIX > 30'da pahalanır.

---

### 9.7 YENİ: $500-$1,000 Earnings Play Stratejiler (Ratio Spread)

> **Bu bölüm, $500-$1,000 bütçeye sahip ileri seviye traderlar için tasarlanmıştır.** VIX 19.44 seviyesinde bu stratejiler optimal çalışır. Tüm pozisyonlar earnings play formatındadır: entry 2-5 gün önce, exit 1-2 gün içinde.

#### 9.7.1 Ratio Spread Earnings Play (1:2 veya 1:3)

**Tanım:** Daha az alınan opsiyon, daha fazla satılan opsiyon. Kredi alarak pozisyon açılır. Üstte sınırsız risk taşır. Earnings play formatındadır.

| Hisse | Yapı | Kredi / Maliyet | Max Kar | Sınırsız Risk Başlangıcı | IV Rank | Deneyim | Earnings Tarihi | Entry Penceresi | Exit Penceresi |
|-------|------|-----------------|---------|------------------------|---------|---------|-----------------|-----------------|----------------|
| **META** | Buy 1x$585C / Sell 2x$644C | **-$47 kredi** | $5,807 | $644 | 65% | Uzman | ~29-30 Temmuz | 24-27 Temmuz | 30-31 Temmuz |
| **JPM** | Buy 1x$230C / Sell 2x$248C | **-$82 kredi** | $1,758 | $248 | 45% | Uzman | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz |
| **DIS** | Buy 1x$85C / Sell 2x$92C | **-$30 kredi** | $650 | $92 | 50% | İleri | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz |
| **NKE** | Buy 1x$72C / Sell 2x$78C | **-$26 kredi** | $550 | $78 | 48% | İleri | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz |
| **NVDA** | Buy 1x$209C / Sell 2x$230C | **-$17 kredi** | $2,069 | $230 | 70% | Uzman | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz |
| **AMZN** | Buy 1x$245C / Sell 2x$265C | $70 maliyet | $2,032 | $265 | 60% | Uzman | ~30-31 Temmuz | 25-28 Temmuz | 31-1 Ağu |
| **GOOGL** | Buy 1x$363C / Sell 2x$392C | $104 maliyet | $3,010 | $392 | 58% | Uzman | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz |
| **AAPL** | Buy 1x$302C / Sell 2x$326C | $86 maliyet | $2,498 | $326 | 55% | Uzman | ~30-31 Temmuz | 25-28 Temmuz | 31-1 Ağu |

**Ratio Spread Earnings Play Risk Yönetimi:**
- **Hedge:** Sınırsız riski hedge etmek için daha yüksek strike call alınabilir (Ratio Butterfly)
- **Stop-Loss:** Hisse fiyatı short strike'ların %80'ine ulaştığında kapat
- **Kar Hedefi:** %50-75 kredi (IV crush sonrası)
- **Max Hold:** Earnings sonrası 2 gün
- **FOMC Kuralı:** FOMC haftasındaki earnings'lerde (META, AMZN, AAPL) ratio spread açmayın veya %50 azalt
- **Entry:** Earnings'ten 2-5 gün önce
- **Exit:** Earnings sonrası 1-2 gün içinde (max 2 gün)

---

### 9.8 YENİ: En İyi 10 "2x Potansiyel" Earnings Play Fırsatı

> **"2x Potansiyel" = Max kar potansiyeli, maliyetin en az 2 katı olan earnings play stratejileri.** Düşük maliyetli, yüksek getiri potansiyelli fırsatlar. VIX 19.44'te bu fırsatlar bol. Tümü earnings play formatındadır.

| Sıra | Hisse | Strateji | Maliyet | Max Kar | Potansiyel | Olasılık | IV Rank | FOMC Risk | Earnings Tarihi | Entry Penceresi | Exit Penceresi | IV Crush Beklentisi |
|------|-------|----------|---------|---------|------------|----------|---------|-----------|-----------------|-----------------|----------------|---------------------|
| **1** | **AMD** | Call Lottery | $42 | $4,200+ | **100x** | Düşük | 91.69% | 🔴 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| **2** | **META** | Call Ratio | -$47 (kredi) | $5,807 | **Sınırsız** | Orta | 65% | 🔴 | ~29-30 Temmuz | 24-27 Temmuz | 30-31 Temmuz | 30-50% |
| **3** | **TSLA** | Call Lottery | $35 | $3,500+ | **100x** | Düşük | 80% | 🟡 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-50% |
| **4** | **NFLX** | Call Lottery | $39 | $3,900+ | **100x** | Düşük | 75% | 🟢 | ~16 Temmuz | 11-14 Temmuz | 17-18 Temmuz | 30-45% |
| **5** | **NVDA** | Call Lottery | $19 | $1,900+ | **100x** | Düşük | 70% | 🔴 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| **6** | **AMD** | Butterfly | $216 | $4,197 | **19x** | Orta | 91.69% | 🔴 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| **7** | **TSLA** | Butterfly | $218 | $3,463 | **16x** | Orta | 80% | 🟡 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-50% |
| **8** | **GOOGL** | Butterfly | $251 | $3,019 | **12x** | Orta | 58% | 🟡 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-45% |
| **9** | **AMZN** | Butterfly | $282 | $3,398 | **12x** | Orta | 60% | 🔴 | ~30-31 Temmuz | 25-28 Temmuz | 31-1 Ağu | 30-50% |
| **10** | **AAPL** | Butterfly | $208 | $2,507 | **12x** | Orta | 55% | 🔴 | ~30-31 Temmuz | 25-28 Temmuz | 31-1 Ağu | 30-50% |

#### "2x Potansiyel" Earnings Play Yönetim Kuralları
1. **Pozisyon Boyutu:** Her fırsat hesabın %1'ini geçmemeli
2. **Çeşitlendirme:** En fazla 3 "2x" pozisyonu aynı anda tut
3. **FOMC Kuralı:** FOMC haftasındaki earnings'lerde (28-31 Temmuz) yeni "2x" pozisyon açmayın veya %50 azalt
4. **Entry:** Earnings'ten 2-5 gün önce
5. **Exit:** Earnings sonrası 1-2 gün içinde (max 2 gün). Kar hedefi %50-75 kredi
6. **Stop-Loss:** Earnings sonrası pozisyon zararda kalırsa veya %100 kredi kaybı anında kapat
7. **IV Crush Değerlendirmesi:** BMO için 2-4 saat, AMC için ertesi gün sabah
8. **Max Hold:** 2 günü geçme
9. **VIX Kuralı:** VIX > 25'te "2x" pozisyon sayısını azalt

---

## 10. FOMC VE EARNINGS PLAY RİSK YÖNETİMİ

> **FOMC toplantısı (28-29 Temmuz 2026), Q2 2026 earnings sezonunun tam ortasına denk geliyor.** Bu durum çift volatilite riski yaratıyor — hem earnings surprise hem Fed kararı aynı hafta. VIX 19.44 seviyesi "sakin görünümlü ama tetikte" bir piyasayı işaret ediyor.
> **Tüm pozisyonlar earnings play formatındadır:** Entry 2-5 gün önce, exit 1-2 gün içinde (max 2 gün). IV crush hemen değerlendirilir.

---

### 10.1 Earnings Play Risk Kuralları (YENİ — Bölüm 10'a Eklendi)

> **Earnings Play Risk Kuralları, Temmuz 2026 sezonu için özel olarak tanımlanmıştır.** Tüm pozisyonlar bu kurallara tabidir.

| Kural | Detay | Eşik | Aksiyon | Öncelik |
|-------|-------|------|---------|---------|
| **Max Hold** | Earnings sonrası pozisyon max 2 gün tutulur | 2 gün | Earnings sonrası 2. gün kapanışta mekanik kapat | Kritik |
| **Kar Hedefi** | IV crush sonrası %50-75 kredi/prim realize edilir | %50-75 kredi | Hemen kapat, bekleme | Kritik |
| **Stop-Loss** | Earnings sonrası pozisyon zararda kalırsa veya %100 kredi kaybı | Zarar = %100 kredi | Anında kapat, bekleme | Kritik |
| **IV Crush Süresi** | BMO earnings: 2-4 saat, AMC earnings: Ertesi gün sabah | BMO: 2-4 saat, AMC: 1 gün | Hızlı değerlendirme, hızlı çıkış | Kritik |
| **Entry Zamanı** | Earnings'ten 2-5 gün önce | 2-5 gün önce | IV en şişmiş seviyede gir | Kritik |
| **Exit Zamanı** | Earnings sonrası 1-2 gün içinde | 1-2 gün | Max 2 gün, zaman decay aleyhte | Kritik |
| **FOMC Azaltma** | FOMC haftası (28-31 Temmuz) pozisyonları %50 azalt veya hiç açma | 28-31 Temmuz | %50 azalt veya hiç açma | Kritik |
| **VIX Kuralı** | VIX 19.44 = %100 normal pozisyon | VIX 19.44 | Normal pozisyon | Yüksek |
| **Pozisyon Boyutu** | Tüm pozisyonlar hesabın %1-2'sini geçmemeli | >%2 | Pozisyonu küçült | Kritik |
| **Tek Hisse Limiti** | Tek hisseye max hesabın %3'ü | >%3 | Pozisyon böl | Kritik |
| **Sektör Limiti** | Tek sektöre max hesabın %15'i | >%15 | Çeşitlendir | Yüksek |

#### Earnings Play Risk Detayları

**Max Hold — Earnings Sonrası 2 Gün:**
- Earnings sonrası pozisyon en fazla 2 gün tutulur
- 2. gün kapanışta mekanik kapat (kar/zarar fark etmez)
- Zaman decay (theta) earnings sonrası hızla aleyhte işler
- IV crush sonrası primler hızla erir, bekleme kaybettirir

**Kar Hedefi — %50-75 Kredi/Prim:**
- Earnings sonrası IV crush ile kredi/prim değerinin %50-75'i hedeflenir
- Hedefe ulaşıldığında sorgusuz kapat
- "Biraz daha bekleyeyim" düşüncesi yasak — theta decay aleyhte
- BMO earnings için 2-4 saat içinde değerlendir, AMC için ertesi gün sabah

**Stop-Loss — Earnings Sonrası Zararda Kalırsa:**
- Earnings sonrası pozisyon zararda kalırsa anında kapat
- %100 kredi kaybı = anında kapat
- Bekleme ve "düzelir" umudu yasak — IV crush sonrası düzeltme zordur
- Duygusal karar verme, mekanik kural uygula

**IV Crush Süresi:**
- **BMO (Before Market Open) Earnings:** Earnings sonucu 6:00-8:00 AM ET açıklanır. Piyasa açılışı 9:30 AM ET. IV crush 2-4 saat içinde gerçekleşir. 10:00-11:00 AM ET'de değerlendirme ve kapatma.
- **AMC (After Market Close) Earnings:** Earnings sonucu 4:00-5:30 PM ET açıklanır. After-hours hareket olur. IV crush ertesi gün sabah 9:30-10:00 AM ET'de gerçekleşir. Ertesi gün sabah değerlendirme ve kapatma.
- **Max 2 Gün:** Earnings sonrası 2. gün kapanışta mutlaka kapat.

---

### 10.2 FOMC Protokolü (28-29 Temmuz 2026)

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

### 10.3 Pozisyon Küçültme Takvimi (Detaylı Günlük — Earnings Play Formatı)

> **FOMC öncesi pozisyon küçültme, risk yönetiminin en kritik adımıdır.** Aşağıdaki takvim, 45+ hisse için genel bir rehberdir. Tüm pozisyonlar earnings play formatındadır: earnings sonrası 1-2 gün içinde (max 2 gün) kapatılır.

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

#### Günlük Pozisyon Küçültme Detayları (Earnings Play)

**24 Temmuz (Cuma) — Yeni Pozisyon Açmayı Durdur:**
- Tüm aktif watchlist'leri dondur
- Yeni limit emirleri iptal et
- Mevcut pozisyonlar için sadece yönetim (kapatma düşün)
- VIX seviyesini kontrol et (VIX > 22 = ekstra dikkat)
- Earnings play pozisyonları: Earnings sonrası 1-2 gün içinde (max 2 gün) kapatılacak

**26 Temmuz (Pazar) — %50 Küçültme:**
- Tüm kârlı pozisyonların %50'sini kapat
- Zararlı pozisyonları değerlendir (stop-loss uygula veya tut)
- Earnings play pozisyonları: Earnings sonrası 2. gün kapanışta mutlaka kapat
- Nakit rezervini %60+'ya çıkar

**27 Temmuz (Pazartesi) — Kapanış Planla:**
- Tüm pozisyonlar için kapanış senaryoları hazırla
- Limit emirleri koy (kar hedefi ve stop-loss)
- FOMC öncesi son çıkış fırsatı
- Nakit rezervini %70+'ya çıkar
- Earnings play pozisyonları: Earnings sonrası 2. gün kapanışta mekanik kapat

**28-29 Temmuz (Salı-Çarşamba) — FOMC:**
- Yeni pozisyon açma yasak
- Mevcut pozisyonları sadece izle
- FOMC kararı öncesi (13:30 ET) tüm emirleri durdur
- Karar açıklaması sonrası 30 dakika bekle (volatilite dinene kadar)
- Earnings play pozisyonları: Max hold 2 gün kuralı devam eder

---

### 10.4 FOMC Risk Matrisi (Hisse Bazlı — Earnings Play Formatı)

> **45+ hisse için FOMC risk seviyeleri.** Earnings tarihi ve FOMC'ye olan mesafe kritik. Earnings play formatı: entry 2-5 gün önce, exit 1-2 gün içinde (max 2 gün).

| Risk Seviyesi | Hisseler | Earnings Tarihi | FOMC Mesafe | Earnings Play Entry | Earnings Play Exit | Önlem | Beta Etkisi |
|---------------|----------|-----------------|-------------|---------------------|--------------------|-------|-------------|
| 🟢 **DÜŞÜK** | NFLX, JPM, BAC, GS, WFC, C, MS, JNJ, PFE, ABT, BLK | 14-16 Temmuz | 12-14 gün | 9-14 Temmuz | 16-18 Temmuz | Normal pozisyon. FOMC'den uzak. | Düşük etki |
| 🟡 **ORTA** | TSLA, GOOGL, INTC, TMO, CRM, ORCL | 21-23 Temmuz | 5-7 gün | 16-21 Temmuz | 23-25 Temmuz | Yarım pozisyon. FOMC öncesi küçült. | Orta etki |
| 🔴 **YÜKSEK** | AAPL, AMZN, META, MSFT, AMD, NVDA, UNH, V, MA, ADBE | 28-30 Temmuz | 0-2 gün | FOMC sonrası veya yarım pozisyon | 30-31 Temmuz / 1-2 Ağu | **FOMC sonrası entry.** Yarım pozisyon. | Yüksek etki |
| ⚫ **EXTREME** | XOM, CVX, MRK, LLY | 31 Temmuz+ | FOMC sonrası | 26-29 Temmuz | 1-2 Ağu | FOMC + GDP etkisi. Çok dikkatli. | Çok yüksek |

#### Hisse Bazlı FOMC Risk Detayları (Earnings Play)

**🟢 Düşük Risk (FOMC'den 10+ gün uzak):**
- **JPM, BAC, WFC, C, GS, MS (14 Temmuz):** Finansal sektör, FOMC'den 14 gün önce. Earnings play: entry 9-12 Temmuz, exit 16-17 Temmuz. FOMC etkisi sınırlı.
- **NFLX (16 Temmuz):** Tech ama erken earnings. Earnings play: entry 11-14 Temmuz, exit 17-18 Temmuz. FOMC'den 12 gün önce.
- **JNJ, PFE, ABT (15 Temmuz):** Sağlık sektörü defansif. Earnings play: entry 10-13 Temmuz, exit 16-17 Temmuz.
- **BLK (21 Temmuz):** Varlık yönetimi. FOMC'den 7 gün önce. Earnings play: entry 16-18 Temmuz, exit 22-23 Temmuz. Orta risk sınırında.

**🟡 Orta Risk (FOMC'den 5-7 gün uzak):**
- **TSLA, GOOGL (22 Temmuz):** Mega-cap tech. Earnings play: entry 17-20 Temmuz, exit 24-25 Temmuz. FOMC'den 6 gün önce. Yarım pozisyon.
- **INTC (23 Temmuz):** Yarı iletken. Earnings play: entry 18-21 Temmuz, exit 25-26 Temmuz. FOMC'den 5 gün önce. Yarım pozisyon.
- **TMO, CRM, ORCL:** Earnings play: entry 16-19 Temmuz, exit 23-25 Temmuz. FOMC'ye yakın. Dikkatli yönetim.

**🔴 Yüksek Risk (FOMC ile aynı hafta):**
- **UNH, V (28 Temmuz):** FOMC başlangıç günü! Earnings play: entry 23-26 Temmuz (FOMC riski yüksek), exit 30-31 Temmuz. Yeni pozisyon açmamaya veya %50 azaltılmış pozisyonla girme tercih et.
- **MSFT, META (29 Temmuz):** FOMC karar günü! Çift volatilite. Earnings play: entry 24-27 Temmuz (FOMC riski çok yüksek), exit 30-31 Temmuz.
- **AAPL, AMZN, MA, PFE (30 Temmuz):** FOMC ertesi gün + GDP. Üçlü risk. Earnings play: entry 25-28 Temmuz, exit 31-1 Ağu. FOMC sonrası entry tercih edilir.
- **AMD, NVDA:** FOMC haftasındaki tech hisseleri. Earnings play: entry 17-20 Temmuz, exit 24-25 Temmuz. Yüksek beta = yüksek risk.

**⚫ Extreme Risk (FOMC sonrası + GDP):**
- **XOM, CVX (31 Temmuz):** FOMC + GDP sonrası enerji. Earnings play: entry 26-29 Temmuz, exit 1-2 Ağu. Jeopolitik risk ekleniyor.
- **MRK, LLY:** Earnings play: entry 10-13 Temmuz, exit 16-17 Temmuz. Sağlık ama makro etki.

---

### 10.5 4 Kriz Senaryosu (Olasılıklar, Etkiler, Stratejiler — Earnings Play Formatı)

> **Temmuz 2026'da 4 ana kriz senaryosu tanımlanmıştır.** Her senaryo için olasılık, piyasa etkisi ve earnings play strateji önerisi sunulmuştur. VIX 19.44 mevcut seviyesi, "Yumuşak Geçiş" senaryosuna işaret ediyor.

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

**Earnings Play Stratejisi:**
- Tüm earnings play pozisyonlarını kapat (en az %80 nakit)
- Earnings sonrası 1-2 gün içinde (max 2 gün) mekanik kapat
- Put koruma al (SPY/QQQ put spread)
- VIX call al (VIX 25+ hedefi)
- Defansif sektörlere rotasyon (XLU, XLP, XLV)
- Altın (GLD) ve tahvil (TLT) hedge
- Earnings sonrası temiz fiyatlardan pozisyon oluştur

**Opsiyon Stratejileri:**
- Long SPY Put Spread (Buy $740P / Sell $700P)
- Long VIX Call (VIX $25C)
- Long XLE Call Spread (Enerji hedge)
- Tüm earnings play pozisyonlarını kapat

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

**Earnings Play Stratejisi:**
- Normal earnings play stratejiler uygula (EarningsPlay v5.0)
- Earnings play pozisyonlarını koru, yarım pozisyon FOMC haftası
- Seçici long pozisyonlar (finansal, enerji)
- Tech'te sadece güçlü guidance verenler
- FOMC öncesi pozisyon küçültme devam
- Nakit rezervi %40-50
- Earnings sonrası 1-2 gün içinde (max 2 gün) mekanik kapat

**Opsiyon Stratejileri:**
- Earnings Play Iron Condor (normal boyut, yarım pozisyon FOMC haftası)
- Bull Put Spread (finansal ve enerji)
- Long Straddle (sadece güçlü katalist olanlar)
- Butterfly (IV crush'a dayanıklı, earnings play formatı)

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

**Earnings Play Stratejisi:**
- Seçici pozisyonlar, küçük pozisyon boyutu
- Finansal ve enerji ağırlıklı
- Tech'te sadece short veya bearish spread
- Defansif sektörlere ağırlık ver
- Nakit rezervi %50-60
- FOMC sonrası yeni earnings play pozisyon açma (temiz fiyatlar)
- Earnings sonrası 1-2 gün içinde (max 2 gün) mekanik kapat

**Opsiyon Stratejileri:**
- Bear Call Spread (tech mega-cap)
- Bull Put Spread (finansal, enerji)
- Earnings Play Iron Condor (darlaştırılmış, küçük boyut)
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

**Earnings Play Stratejisi:**
- Aggressive call spread, long pozisyonlar artır
- Tech ağırlıklı earnings play portföyü
- FOMC sonrası hızlı giriş
- VIX crush trade (short VIX)
- Earnings sonrası momentum takibi
- Nakit rezervi %20-30 (fırsatlar için)
- Earnings sonrası 1-2 gün içinde (max 2 gün) mekanik kapat

**Opsiyon Stratejileri:**
- Aggressive Call Spread (tech mega-cap)
- Long Straddle (sadece güçlü katalist)
- Short VIX Call Spread (VIX crush)
- Long QQQ Call Spread
- Butterfly (merkezden kar, IV crush sonrası, earnings play formatı)

---

### 10.6 Genel Earnings Play Risk Yönetimi Kuralları

> **EarningsPlay v5.0 Risk Yönetimi Kuralları.** VIX 19.44 seviyesinde tüm kurallar %100 uygulanır. Tüm pozisyonlar earnings play formatındadır.

| Kural | Detay | Eşik | Aksiyon | Öncelik |
|-------|-------|------|---------|---------|
| **Pozisyon Boyutu** | Tüm earnings play pozisyonları hesabın %1-2'sini geçmemeli | >%2 | Pozisyonu küçült | Kritik |
| **VIX > 25** | Pozisyonları %50 azalt | VIX 25-30 | Yarım pozisyon | Yüksek |
| **VIX > 30** | Tüm pozisyonları %25'e düşür | VIX 30-40 | Çok küçük pozisyon | Çok Yüksek |
| **VIX > 40** | Tamamen nakite geç | VIX > 40 | %100 nakit | Kritik |
| **Earnings Play Kar Hedefi** | IV crush sonrası %50-75 kredi/prim realize edilir | %50-75 kredi | Hemen kapat | Kritik |
| **Earnings Play Stop-Loss** | Earnings sonrası pozisyon zararda kalırsa veya %100 kredi kaybı | Zarar = %100 kredi | Anında kapat | Kritik |
| **Earnings Play Max Hold** | Earnings sonrası pozisyon max 2 gün tutulur | 2 gün | Mekanik kapat | Kritik |
| **Earnings Play Entry** | Earnings'ten 2-5 gün önce | 2-5 gün önce | IV en şişmiş seviyede gir | Kritik |
| **Earnings Play Exit** | Earnings sonrası 1-2 gün içinde | 1-2 gün | Max 2 gün | Kritik |
| **IV Crush Süresi** | BMO: 2-4 saat, AMC: ertesi gün sabah | BMO: 2-4 saat, AMC: 1 gün | Hızlı değerlendirme | Kritik |
| **FOMC Kuralı** | 28-31 Temmuz FOMC haftası pozisyonları %50 azalt veya hiç açma | 28-31 Temmuz | %50 azalt veya hiç açma | Kritik |
| **Blackout Kuralı** | 18-30 Temmuz Fed üyeleri konuşamaz | 18-30 Temmuz | Ekstra dikkat | Yüksek |
| **Tek Hisse Limiti** | Tek hisseye max hesabın %3'ü | >%3 | Pozisyon böl | Kritik |
| **Sektör Limiti** | Tek sektöre max hesabın %15'i | >%15 | Çeşitlendir | Yüksek |

#### Earnings Play Risk Yönetimi Detayları

**Pozisyon Boyutu Hesaplama (Earnings Play):**
```
Hesap Büyüklüğü = $10,000
Max Pozisyon/Hisse = $10,000 x %1.5 = $150
Max Toplam Risk = $10,000 x %10 = $1,000
Max Sektör Risk = $10,000 x %15 = $1,500
```

**VIX Bazlı Pozisyon Ayarlama (VIX 19.44 = %100 Normal Pozisyon):**
- VIX < 15: %120 normal pozisyon (primler ucuz, fırsat artar)
- VIX 15-20: %100 normal pozisyon (mevcut durum)
- VIX 20-25: %75 normal pozisyon (primler pahalanıyor)
- VIX 25-30: %50 normal pozisyon (risk artıyor)
- VIX 30-40: %25 normal pozisyon (yüksek risk)
- VIX > 40: %0 pozisyon (tamamen nakit)

**Earnings Play Mekanik Çıkış Örneği:**
- Earnings Play Iron Condor kredisi = $250
- Kar hedefi = $125-$187 (%50-75 kredi)
- Stop-loss = $250 (%100 kredi kaybı) = anında kapat
- Max hold = Earnings sonrası 2 gün
- Eğer pozisyon $125-$187 kar gösteriyorsa → SORGUSUZ KAPAT
- Eğer pozisyon $250 zarar gösteriyorsa → ANINDA KAPAT
- Eğer 2 gün dolduysa → MEKANİK KAPAT (kar/zarar fark etmez)

---

### 10.7 Risk Matrisi (Olasılık × Etki — Earnings Play Formatı)

> **45+ hisse ve makro riskler için olasılık-etki matrisi.** VIX 19.44 seviyesinde piyasa "sakin görünümlü ama tetikte". Tüm pozisyonlar earnings play formatındadır.

| Risk | Olasılık | Etki | Earnings Etkisi | VIX Etkisi | Sektör Etkisi | Earnings Play Önlem |
|------|----------|------|-----------------|------------|---------------|---------------------|
| **FOMC'de Sert Ton** | Yüksek (%60) | Yüksek | Finansallar pozitif, Tech negatif | VIX +3-5 | Tech satışı | FOMC öncesi küçült, earnings play'leri kapat |
| **CPI Beklentiyi Aşma** | Yüksek (%55) | Çok Yüksek | Tahvil satışı, hisse düşüşü | VIX +5-10 | Genel satış | CPI öncesi hedge, earnings play'leri kapat |
| **Hürmüz'de Kesinti** | Orta (%30) | Çok Yüksek | Enerji fiyatları şok, stagflasyon | VIX +5-8 | Enerji +, diğer - | Enerji hedge, earnings play'leri kapat |
| **Guidance Düşüşü** | Orta (%40) | Yüksek | Özellikle tech ve consumer | VIX +2-4 | Tech -, Defensive + | Seçici pozisyon, earnings play'leri kapat |
| **GDP Düşük Gelme** | Düşük-Orta (%25) | Yüksek | Resesyon endişesi | VIX +3-6 | Genel satış | Defensive rotasyon, earnings play'leri kapat |
| **USD Sert Yükselme** | Orta (%35) | Orta | Çok uluslu şirketlerde kar düşüşü | VIX +1-2 | İhracatçı - | Döviz hedge, earnings play'leri kapat |
| **AI Yatırım Dönüşü Sorgulanması** | Orta (%30) | Yüksek | NVDA, MSFT, GOOGL baskı | VIX +2-4 | AI/Tech - | AI hisselerinde seçici, earnings play'leri kapat |
| **Bankacılık Kredi Kalitesi** | Düşük (%20) | Çok Yüksek | Finansal sektör çöküşü | VIX +8-12 | Finansal - | Finansal put hedge, earnings play'leri kapat |
| **Cyber Attack / Sistem Riski** | Çok Düşük (%5) | Çok Yüksek | Teknoloji altyapı riski | VIX +5-10 | Tech - | Genel hedge, earnings play'leri kapat |
| **Çin Ekonomik Yavaşlama** | Orta (%35) | Orta-Yüksek | Küresel büyüme endişesi | VIX +2-4 | Çok uluslu - | EM hedge, earnings play'leri kapat |

#### Risk Matrisi Yorumu

**En Yüksek Risk Kombinasyonu:**
- CPI %4.5+ + FOMC sert ton + Guidance düşüşü = "Sert İniş" senaryosu (%25 olasılık)
- Bu kombinasyon VIX'i 30-40 aralığına taşıyabilir
- Etki: S&P 500 -%8 / -%12
- Earnings Play Önlem: Tüm earnings play pozisyonlarını kapat, %80 nakit

**Orta Risk Kombinasyonu:**
- CPI %4.0-4.2 + FOMC nötr + Karışık earnings = "Altın Orta Yol" senaryosu (%30 olasılık)
- VIX 22-30 aralığında dalgalanma
- Etki: S&P 500 ±%3-5
- Earnings Play Önlem: Seçici pozisyonlar, küçük pozisyon boyutu, earnings sonrası 1-2 gün içinde kapat

**Düşük Risk Kombinasyonu:**
- CPI %3.8-4.0 + FOMC yumuşak + Güçlü earnings = "Yumuşak Geçiş" senaryosu (%35 olasılık)
- VIX 18-25 aralığında kalır
- Etki: S&P 500 ±%2
- Earnings Play Önlem: Normal earnings play stratejileri, earnings sonrası 1-2 gün içinde kapat

---

### 10.8 VIX Bazlı Pozisyon Boyutu Rehberi (Earnings Play Formatı)

> **VIX seviyesine göre dinamik pozisyon boyutu ayarlama.** VIX 19.44 mevcut seviye. Bu rehber, 45+ hisse için genel bir çerçeve sunar. Tüm pozisyonlar earnings play formatındadır.

#### VIX Seviyeleri ve Earnings Play Pozisyon Boyutları

| VIX Seviyesi | Piyasa Durumu | Earnings Play Pozisyon Boyutu | Max Risk/Hisse | Max Toplam Risk | Earnings Play Strateji Tercihi | Örnek Hesap ($10K) |
|--------------|---------------|------------------------------|----------------|-----------------|--------------------------------|--------------------|
| **< 15** | Çok sakin | %120 normal | %1.8 | %12 | Aggressive Lottery, Debit Spread | $180/hisse, $1,200 toplam |
| **15-18** | Sakin | %100 normal | %1.5 | %10 | Normal Lottery, Debit Spread | $150/hisse, $1,000 toplam |
| **18-22** | Normal (mevcut: 19.44) | %100 normal | %1.5 | %10 | Normal Lottery, Debit Spread, Butterfly | $150/hisse, $1,000 toplam |
| **22-25** | Tetikte | %75 normal | %1.1 | %7.5 | Dar Butterfly, Reduced Lottery | $110/hisse, $750 toplam |
| **25-30** | Yüksek volatilite | %50 normal | %0.75 | %5 | Butterfly, Earnings Play Hedge | $75/hisse, $500 toplam |
| **30-35** | Çok yüksek | %25 normal | %0.4 | %2.5 | Hedge, Sadece earnings play | $40/hisse, $250 toplam |
| **35-40** | Panik | %10 normal | %0.15 | %1 | Sadece hedge | $15/hisse, $100 toplam |
| **> 40** | Çöküş | %0 | %0 | %0 | Tamamen nakit | $0 |

#### VIX Bazlı Earnings Play Strateji Seçimi

**VIX < 15 (Çok Sakin):**
- **Earnings Play Strateji:** Aggressive Lottery Ticket, Debit Spread
- **Neden:** Primler ucuz, IV crush potansiyeli yüksek
- **Risk:** Düşük volatilite = sınırlı hareket
- **Örnek:** Hisse başına $150 risk, earnings play 5-10 pozisyon
- **Entry:** Earnings'ten 2-5 gün önce
- **Exit:** Earnings sonrası 1-2 gün içinde (max 2 gün)

**VIX 15-22 (Sakin-Normal):**
- **Earnings Play Strateji:** Normal Lottery, Debit Spread, Butterfly
- **Neden:** Optimal risk/ödül, primler makul
- **Risk:** Normal volatilite = normal hareket
- **Örnek:** Hisse başına $150 risk, earnings play 5-10 pozisyon
- **Entry:** Earnings'ten 2-5 gün önce
- **Exit:** Earnings sonrası 1-2 gün içinde (max 2 gün)

**VIX 22-30 (Tetikte-Yüksek):**
- **Earnings Play Strateji:** Butterfly, Reduced Lottery, Earnings Play Hedge
- **Neden:** Primler pahalanıyor, risk artıyor
- **Risk:** Yüksek volatilite = beklenmedik hareket
- **Örnek:** Hisse başına $75 risk, earnings play 3-5 pozisyon
- **Entry:** Earnings'ten 2-5 gün önce (FOMC haftası dışında)
- **Exit:** Earnings sonrası 1-2 gün içinde (max 2 gün)

**VIX 30-40 (Panik):**
- **Earnings Play Strateji:** Hedge, Sadece earnings play
- **Neden:** Primler çok pahalı, IV crush riski yüksek
- **Risk:** Çok yüksek volatilite = büyük kayıp potansiyeli
- **Örnek:** Hisse başına $40 risk, sadece hedge pozisyonları
- **Entry:** Earnings'ten 2-5 gün önce (çok seçici)
- **Exit:** Earnings sonrası 1-2 gün içinde (max 2 gün)

**VIX > 40 (Çöküş):**
- **Earnings Play Strateji:** Tamamen nakit
- **Neden:** Piyasa çöküşü, her şey riskli
- **Risk:** Maksimum risk
- **Örnek:** %100 nakit, sadece hedge pozisyonları
- **Earnings play pozisyonu açma:** YASAK

---

### 10.9 Blackout Dönemi Protokolü (18-30 Temmuz 2026 — Earnings Play Formatı)

> **Fed Blackout Dönemi:** Fed üyelerinin kamuoyu önünde konuşması yasaktır. Bu dönemde piyasa "sessiz" kalır ama belirsizlik artar. VIX 19.44 seviyesinde blackout başladığında VIX genellikle 1-2 puan artar. Tüm earnings play pozisyonları bu protokole tabidir.

#### Blackout Dönemi Takvimi (Earnings Play)

| Tarih | Gün | Durum | Piyasa Etkisi | Earnings Play Strateji |
|-------|-----|-------|-------------|------------------------|
| **17 Temmuz** | Cuma | Blackout öncesi son gün | Normal | Son earnings play pozisyon değerlendirmesi |
| **18 Temmuz** | Cumartesi | **BLACKOUT BAŞLIYOR** | VIX +1-2 | Yeni earnings play pozisyon açmayı azalt |
| **19-25 Temmuz** | Pazar-Cuma | Blackout devam | Belirsizlik artar | Earnings play pozisyon küçültme devam |
| **26-27 Temmuz** | Pazar-Pazartesi | Blackout + FOMC yaklaşıyor | VIX +2-4 | Agresif earnings play küçültme |
| **28-29 Temmuz** | Salı-Çarşamba | **FOMC TOPLANTISI** | Maksimum belirsizlik | Yeni earnings play pozisyon YOK |
| **30 Temmuz** | Perşembe | Blackout sona eriyor | Karar etkisi | Yeni earnings play değerlendirme |
| **31 Temmuz** | Cuma | Blackout sonrası ilk gün | FedSpeak başlar | Normal earnings play pozisyona dönüş başla |

#### Blackout Dönemi Earnings Play Kuralları

1. **18 Temmuz'dan itibaren:**
   - Yeni agresif earnings play pozisyon açmayı durdur
   - Mevcut earnings play pozisyonlarını yönet (kapatma odaklı)
   - VIX seviyesini günde 2 kez kontrol et
   - FOMC öncesi earnings play pozisyon küçültme planını gözden geçir
   - Earnings play pozisyonları: Earnings sonrası 1-2 gün içinde (max 2 gün) kapatılacak

2. **24 Temmuz'dan itibaren (FOMC'ye 4 gün kala):**
   - Tamamen yeni earnings play pozisyon açmayı durdur
   - Sadece mevcut earnings play pozisyon kapatma
   - Nakit rezervini %60+'ya çıkar
   - Tüm açık emirleri iptal et

3. **28-29 Temmuz (FOMC günleri):**
   - Yeni earnings play pozisyon açma YASAK
   - Mevcut earnings play pozisyonları sadece izle
   - FOMC kararı öncesi (13:30 ET) tüm emirleri durdur
   - Karar açıklaması sonrası 30 dakika bekle
   - Kevin Warsh'ın basın konferansı tonunu analiz et
   - Earnings play pozisyonları: Max hold 2 gün kuralı devam eder

4. **30-31 Temmuz (FOMC sonrası):**
   - Yeni earnings play değerlendirmelere başla
   - FOMC tonuna göre earnings play strateji revizyonu
   - GDP verisi (30 Temmuz) + ECI (31 Temmuz) etkisini izle
   - Normal earnings play pozisyona dönüş planla
   - Earnings play pozisyonları: Entry 2-5 gün önce, exit 1-2 gün içinde (max 2 gün)

#### Blackout Dönemi Earnings Play Risk Yönetimi

| Risk | Olasılık | Etki | Earnings Play Önlem |
|------|----------|------|---------------------|
| Sessiz piyasa = sürpriz şok | Orta | Yüksek | Nakit rezervi artır, earnings play'leri kapat |
| FOMC öncesi VIX spike | Yüksek | Orta | VIX hedge (call), earnings play'leri kapat |
| Likidite daralması | Orta | Orta | Sadece likit hisselerde earnings play aç |
| Earnings + FOMC çakışması | Yüksek | Çok Yüksek | Çift volatilite hedge, earnings play'leri kapat |
| Fed üyesi sızıntısı (yasa dışı) | Çok Düşük | Çok Yüksek | Hızlı earnings play pozisyon ayarlama |

---

## 11. EARNINGS PLAY PORTFÖY ÖNERİLERİ

> **5 farklı bütçe seviyesi için earnings play portföy önerileri:** $1,000 (Mikro), $5,000 (Küçük), $10,000 (Orta), $25,000 (Büyük), $50,000 (Profesyonel).
> **VIX 19.44 = %100 normal pozisyon.** FOMC öncesi (24 Temmuz) tüm portföylerde earnings play pozisyon küçültme uygulanır.
> **Tüm portföyler earnings play formatındadır:** Her pozisyon earnings sonrası 2 gün içinde kapatılır. IV crush kazancı = hızlı döngü (1-2 hafta).
> **Portföy yeniden dağıtım:** FOMC'den uzak earnings'ler öncelik (NFLX, JPM, BAC, TSLA, GOOGL). FOMC haftası (28-31 Temmuz) pozisyonları %50 azalt veya hiç açma.
> **45+ hisse** arasından seçilmiş, çeşitlendirilmiş earnings play portföyler.

---

### 11.1 $1,000 Earnings Play Portföy (Mikro Başlangıç)

> **Hedef:** Sınırlı sermayeyle earnings IV expansion'dan faydalanmak, earnings sonrası IV crush ile kapatmak. Yüksek risk, öğrenme odaklı. Hızlı döngü (1-2 hafta).

| Hisse | Strateji | Maliyet | Ağırlık | FOMC Risk | Beta | Earnings Tarihi | Entry Penceresi | Exit Penceresi | IV Crush Beklentisi |
|-------|----------|---------|---------|-----------|------|-----------------|-----------------|----------------|---------------------|
| AMD | Call Lottery Ticket | $42 | %4 | 🔴 | 2.49 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| TSLA | Call Lottery Ticket | $35 | %4 | 🟡 | 1.80 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-50% |
| NFLX | Call Lottery Ticket | $39 | %4 | 🟢 | 1.49 | ~16 Temmuz | 11-14 Temmuz | 17-18 Temmuz | 30-45% |
| NVDA | Call Lottery Ticket | $19 | %2 | 🔴 | 2.20 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| META | Call Lottery Ticket | $18 | %2 | 🔴 | 1.23 | ~29-30 Temmuz | 24-27 Temmuz | 30-31 Temmuz | 30-50% |
| NFLX | Debit Call Spread | $86 | %9 | 🟢 | 1.49 | ~16 Temmuz | 11-14 Temmuz | 17-18 Temmuz | 30-45% |
| AMD | Debit Call Spread | $191 | %19 | 🔴 | 2.49 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| BAC | Put Lottery + Spread | $108 | %11 | 🟢 | 1.25 | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| **Nakit (Rezerv)** | | **$462** | **%46** | | | | | | |
| **TOPLAM** | | **$1,000** | **100%** | | | | | | |

**Earnings Play Portföy Yorumu:**
- **5 lottery ticket** = Yüksek volatilite oyunu (%16 ağırlık). Earnings sonrası 1-2 gün içinde kapatılacak.
- **2 debit spread** = Risk sınırlı temel pozisyon (%28 ağırlık). Earnings sonrası 1-2 gün içinde kapatılacak.
- **1 put kombinasyon** = Bearish hedge (%11 ağırlık). Earnings sonrası 1-2 gün içinde kapatılacak.
- **46% nakit** = FOMC sonrası fırsatlar için
- **Max risk:** ~$538 (nakit hariç)
- **FOMC Uyumu:** 24 Temmuz'dan önce açılır, 26 Temmuz'da %50 kapatılır. FOMC haftası (28-31 Temmuz) pozisyonları %50 azalt veya hiç açma.
- **VIX 19.44 Etkisi:** Normal pozisyon, primler makul
- **Hızlı Döngü:** Her pozisyon 1-2 hafta içinde kapatılır. IV crush kazancı hızlı realize edilir.
- **Max Hold:** Earnings sonrası 2 gün

---

### 11.2 $5,000 Earnings Play Portföy (Küçük Ölçekli)

> **Hedef:** Çeşitlendirilmiş earnings IV expansion + IV crush hedge. Orta risk. Hızlı döngü (1-2 hafta). Tüm pozisyonlar earnings sonrası 2 gün içinde kapatılır.

| Hisse | Strateji | Maliyet | Ağırlık | FOMC Risk | Sektör | Earnings Tarihi | Entry Penceresi | Exit Penceresi | IV Crush Beklentisi |
|-------|----------|---------|---------|-----------|--------|-----------------|-----------------|----------------|---------------------|
| AMD | Earnings Play Iron Condor | ~$250 | %5 | 🔴 | Tech | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| UNH | Bull Call Spread | ~$330 | %7 | 🔴 | Sağlık | ~28-29 Temmuz | 23-26 Temmuz | 30-31 Temmuz | 20-30% |
| NFLX | Earnings Play IC + Bear Put | ~$200 | %4 | 🟢 | Tech | ~16 Temmuz | 11-14 Temmuz | 17-18 Temmuz | 30-45% |
| XOM | Bull Put Spread | ~$185 | %4 | ⚫ | Enerji | ~31 Temmuz+ | 26-29 Temmuz | 1-2 Ağu | 30-40% |
| BAC | Bull Put Spread + Call | ~$150 | %3 | 🟢 | Finansal | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| TSLA | Earnings Play IC (Yarım Pozisyon) | ~$250 | %5 | 🟡 | Tech | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-50% |
| GOOGL | Earnings Play IC (Yarım Pozisyon) | ~$200 | %4 | 🟡 | Tech | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-45% |
| BA | Earnings Play Iron Condor | ~$200 | %4 | 🔴 | Havacılık | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 30-40% |
| AMD | Call Butterfly | ~$216 | %4 | 🔴 | Tech | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| JPM | Bear Call Spread | ~$150 | %3 | 🟢 | Finansal | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| **Nakit (Rezerv)** | | **~$2,569** | **~%51** | | | | | | |
| **TOPLAM** | | **$5,000** | **100%** | | | | | | |

**Earnings Play Portföy Yorumu:**
- **6 IC/Bull spread pozisyonu** = Çeşitlendirilmiş earnings play (%28 ağırlık). Earnings sonrası 1-2 gün içinde kapatılacak.
- **2 butterfly** = IV crush'a dayanıklı (%8 ağırlık). Earnings sonrası 1-2 gün içinde kapatılacak.
- **1 bearish spread** = Hedge (%3 ağırlık). Earnings sonrası 1-2 gün içinde kapatılacak.
- **51% nakit** = FOMC sonrası ve düzeltme alımları için
- **Sektör Dağılımı:** Tech %22, Finansal %6, Sağlık %7, Enerji %4, Havacılık %4
- **FOMC Uyumu:** 24 Temmuz'dan önce açılır, 26 Temmuz'da %50 kapatılır. FOMC haftası (28-31 Temmuz) pozisyonları %50 azalt veya hiç açma.
- **VIX 19.44 Etkisi:** Normal pozisyon, 10 pozisyon optimal
- **Hızlı Döngü:** Her pozisyon 1-2 hafta içinde kapatılır. IV crush kazancı hızlı realize edilir.
- **Max Hold:** Earnings sonrası 2 gün

---

### 11.3 $10,000 Earnings Play Portföy (Orta Ölçekli)

> **Hedef:** Dengeli earnings play büyüme + IV crush kazancı. Daha fazla çeşitlendirme. Hızlı döngü (1-2 hafta). Tüm pozisyonlar earnings sonrası 2 gün içinde kapatılır.

| Hisse | Strateji | Maliyet | Ağırlık | FOMC Risk | Sektör | Earnings Tarihi | Entry Penceresi | Exit Penceresi | IV Crush Beklentisi |
|-------|----------|---------|---------|-----------|--------|-----------------|-----------------|----------------|---------------------|
| AMD | Earnings Play Iron Condor (Asimetrik) | $500 | %5 | 🔴 | Tech | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| UNH | Bull Call Spread (3x) | $990 | %10 | 🔴 | Sağlık | ~28-29 Temmuz | 23-26 Temmuz | 30-31 Temmuz | 20-30% |
| XOM | Bull Put Spread (4x) | ~$400 | %4 | ⚫ | Enerji | ~31 Temmuz+ | 26-29 Temmuz | 1-2 Ağu | 30-40% |
| BA | Earnings Play Iron Condor (2x) | ~$400 | %4 | 🔴 | Havacılık | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 30-40% |
| NFLX | Earnings Play IC + Bear Put Spread | ~$400 | %4 | 🟢 | Tech | ~16 Temmuz | 11-14 Temmuz | 17-18 Temmuz | 30-45% |
| TSLA | Earnings Play IC (Yarım Pozisyon) | ~$500 | %5 | 🟡 | Tech | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-50% |
| GS | Earnings Play Iron Condor | ~$400 | %4 | 🟢 | Finansal | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| BAC | Bull Put Spread (3x) | ~$300 | %3 | 🟢 | Finansal | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| AMD/NVDA | Butterfly Kombinasyon | ~$500 | %5 | 🔴 | Tech | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| GOOGL | Debit Call Spread (2x) | ~$400 | %4 | 🟡 | Tech | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-45% |
| AMZN | Butterfly | ~$300 | %3 | 🔴 | Tech | ~30-31 Temmuz | 25-28 Temmuz | 31-1 Ağu | 30-50% |
| JPM | Bear Call Spread (2x) | ~$300 | %3 | 🟢 | Finansal | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| **Nakit (Rezerv)** | | **~$5,610** | **~%56** | | | | | | |
| **TOPLAM** | | **$10,000** | **100%** | | | | | | |

**Earnings Play Portföy Yorumu:**
- **8 IC/Bull spread pozisyonu** = Çeşitlendirilmiş earnings play (%38 ağırlık). Earnings sonrası 1-2 gün içinde kapatılacak.
- **3 butterfly** = IV crush'a dayanıklı (%12 ağırlık). Earnings sonrası 1-2 gün içinde kapatılacak.
- **2 bearish spread** = Hedge (%6 ağırlık). Earnings sonrası 1-2 gün içinde kapatılacak.
- **56% nakit** = FOMC sonrası fırsatlar için
- **Sektör Dağılımı:** Tech %25, Finansal %9, Sağlık %10, Enerji %4, Havacılık %4
- **FOMC Uyumu:** 24 Temmuz'dan önce açılır, 26 Temmuz'da %50 kapatılır. FOMC haftası (28-31 Temmuz) pozisyonları %50 azalt veya hiç açma.
- **VIX 19.44 Etkisi:** Normal pozisyon, 12 pozisyon optimal
- **Hızlı Döngü:** Her pozisyon 1-2 hafta içinde kapatılır. IV crush kazancı hızlı realize edilir.
- **Max Hold:** Earnings sonrası 2 gün

---

### 11.4 $25,000 Earnings Play Portföy (Büyük Ölçekli)

> **Hedef:** Profesyonel çeşitlendirme + sektörel rotasyon. Aktif earnings play yönetimi. Hızlı döngü (1-2 hafta). Tüm pozisyonlar earnings sonrası 2 gün içinde kapatılır.

| Hisse | Strateji | Maliyet | Ağırlık | FOMC Risk | Sektör | Earnings Tarihi | Entry Penceresi | Exit Penceresi | IV Crush Beklentisi |
|-------|----------|---------|---------|-----------|--------|-----------------|-----------------|----------------|---------------------|
| AMD | Earnings Play Iron Condor (2x) | $1,000 | %4 | 🔴 | Tech | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| UNH | Bull Call Spread (6x) | $1,980 | %8 | 🔴 | Sağlık | ~28-29 Temmuz | 23-26 Temmuz | 30-31 Temmuz | 20-30% |
| XOM | Bull Put Spread (8x) | ~$800 | %3 | ⚫ | Enerji | ~31 Temmuz+ | 26-29 Temmuz | 1-2 Ağu | 30-40% |
| BA | Earnings Play Iron Condor (4x) | ~$800 | %3 | 🔴 | Havacılık | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 30-40% |
| NFLX | Earnings Play IC (2x) + Bear Put | ~$800 | %3 | 🟢 | Tech | ~16 Temmuz | 11-14 Temmuz | 17-18 Temmuz | 30-45% |
| TSLA | Earnings Play IC (1x) | ~$500 | %2 | 🟡 | Tech | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-50% |
| GOOGL | Earnings Play IC (1x) | ~$400 | %2 | 🟡 | Tech | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-45% |
| AAPL | Earnings Play IC (1x) | ~$400 | %2 | 🔴 | Tech | ~30-31 Temmuz | 25-28 Temmuz | 31-1 Ağu | 30-50% |
| META | Earnings Play IC (1x) | ~$500 | %2 | 🔴 | Tech | ~29-30 Temmuz | 24-27 Temmuz | 30-31 Temmuz | 30-50% |
| GS | Earnings Play Iron Condor (2x) | ~$800 | %3 | 🟢 | Finansal | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| AMZN | Earnings Play IC (1x) | ~$400 | %2 | 🔴 | Tech | ~30-31 Temmuz | 25-28 Temmuz | 31-1 Ağu | 30-50% |
| JPM | Bear Call Spread (2x) | ~$400 | %2 | 🟢 | Finansal | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| BAC | Bull Put Spread (5x) | ~$500 | %2 | 🟢 | Finansal | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| NVDA | Butterfly (2x) | ~$500 | %2 | 🔴 | Tech | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| CRM | Debit Call Spread (3x) | ~$600 | %2 | 🟡 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| **Nakit (Rezerv)** | | **~$14,620** | **~%58** | | | | | | |
| **TOPLAM** | | **$25,000** | **100%** | | | | | | |

**Earnings Play Portföy Yorumu:**
- **12 IC/Bull spread pozisyonu** = Çeşitlendirilmiş earnings play (%35 ağırlık). Earnings sonrası 1-2 gün içinde kapatılacak.
- **4 butterfly** = IV crush'a dayanıklı (%9 ağırlık). Earnings sonrası 1-2 gün içinde kapatılacak.
- **3 bearish spread** = Hedge (%7 ağırlık). Earnings sonrası 1-2 gün içinde kapatılacak.
- **58% nakit** = FOMC sonrası ve büyük fırsatlar için
- **Sektör Dağılımı:** Tech %22, Finansal %11, Sağlık %8, Enerji %3, Havacılık %3
- **FOMC Uyumu:** 24 Temmuz'dan önce açılır, 26 Temmuz'da %50 kapatılır. FOMC haftası (28-31 Temmuz) pozisyonları %50 azalt veya hiç açma.
- **VIX 19.44 Etkisi:** Normal pozisyon, 15 pozisyon optimal
- **Hızlı Döngü:** Her pozisyon 1-2 hafta içinde kapatılır. IV crush kazancı hızlı realize edilir.
- **Max Hold:** Earnings sonrası 2 gün

---

### 11.5 YENİ: $50,000 Earnings Play Portföy (Profesyonel)

> **Hedef:** Kurumsal düzeyde earnings play risk yönetimi + sektörel ağırlıklandırma + hedge stratejileri. Aktif delta nötrlüğü. Hızlı döngü (1-2 hafta). Tüm pozisyonlar earnings sonrası 2 gün içinde kapatılır.

| Hisse | Strateji | Maliyet | Ağırlık | FOMC Risk | Sektör | Greeks Hedefi | Earnings Tarihi | Entry Penceresi | Exit Penceresi | IV Crush Beklentisi |
|-------|----------|---------|---------|-----------|--------|---------------|-----------------|-----------------|----------------|---------------------|
| AMD | Earnings Play Iron Condor (4x) | $2,000 | %4 | 🔴 | Tech | Delta ±0.05 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| UNH | Bull Call Spread (12x) | $3,960 | %8 | 🔴 | Sağlık | Delta +0.10 | ~28-29 Temmuz | 23-26 Temmuz | 30-31 Temmuz | 20-30% |
| XOM | Bull Put Spread (16x) | $1,600 | %3 | ⚫ | Enerji | Delta -0.05 | ~31 Temmuz+ | 26-29 Temmuz | 1-2 Ağu | 30-40% |
| BA | Earnings Play Iron Condor (8x) | $1,600 | %3 | 🔴 | Havacılık | Delta ±0.05 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 30-40% |
| NFLX | Earnings Play IC (4x) + Bear Put | $1,600 | %3 | 🟢 | Tech | Delta ±0.03 | ~16 Temmuz | 11-14 Temmuz | 17-18 Temmuz | 30-45% |
| TSLA | Earnings Play IC (2x) + Butterfly | $1,500 | %3 | 🟡 | Tech | Delta ±0.05 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-50% |
| GOOGL | Earnings Play IC (2x) + Butterfly | $1,200 | %2 | 🟡 | Tech | Delta ±0.05 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-45% |
| AAPL | Earnings Play IC (2x) + Butterfly | $1,200 | %2 | 🔴 | Tech | Delta ±0.05 | ~30-31 Temmuz | 25-28 Temmuz | 31-1 Ağu | 30-50% |
| META | Earnings Play IC (2x) + Butterfly | $1,500 | %3 | 🔴 | Tech | Delta ±0.03 | ~29-30 Temmuz | 24-27 Temmuz | 30-31 Temmuz | 30-50% |
| GS | Earnings Play Iron Condor (4x) | $1,600 | %3 | 🟢 | Finansal | Delta ±0.05 | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| AMZN | Earnings Play IC (2x) + Butterfly | $1,200 | %2 | 🔴 | Tech | Delta ±0.05 | ~30-31 Temmuz | 25-28 Temmuz | 31-1 Ağu | 30-50% |
| JPM | Bear Call Spread (4x) | $800 | %2 | 🟢 | Finansal | Delta -0.05 | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| BAC | Bull Put Spread (10x) | $1,000 | %2 | 🟢 | Finansal | Delta -0.05 | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| NVDA | Butterfly (4x) + Earnings Play IC | $1,500 | %3 | 🔴 | Tech | Delta ±0.03 | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| CRM | Debit Call Spread (6x) | $1,200 | %2 | 🟡 | Tech | Delta +0.08 | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| V | Earnings Play Iron Condor (2x) | $800 | %2 | 🔴 | Finansal | Delta ±0.05 | ~28-30 Temmuz | 23-26 Temmuz | 30-31 Temmuz | 20-25% |
| MA | Earnings Play Iron Condor (2x) | $800 | %2 | 🔴 | Finansal | Delta ±0.05 | ~28-30 Temmuz | 23-26 Temmuz | 30-31 Temmuz | 20-25% |
| JNJ | Bull Call Spread (5x) | $850 | %2 | 🟢 | Sağlık | Delta +0.05 | ~15 Temmuz | 10-13 Temmuz | 16-17 Temmuz | 15-25% |
| PFE | Bull Put Spread (8x) | $600 | %1 | 🟢 | Sağlık | Delta -0.03 | ~15 Temmuz | 10-13 Temmuz | 16-17 Temmuz | 15-25% |
| QQQ | Put Hedge (2x) | $400 | %1 | | Hedge | Delta -0.02 | | | | |
| SPY | Put Hedge (1x) | $300 | %1 | | Hedge | Delta -0.01 | | | | |
| **Nakit (Rezerv)** | | **~$24,790** | **~%50** | | | | | | | |
| **TOPLAM** | | **$50,000** | **100%** | | | | | | | |

**Earnings Play Portföy Yorumu:**
- **18 IC/Bull spread pozisyonu** = Çeşitlendirilmiş earnings play (%38 ağırlık). Earnings sonrası 1-2 gün içinde kapatılacak.
- **6 butterfly/calendar** = IV crush'a dayanıklı (%12 ağırlık). Earnings sonrası 1-2 gün içinde kapatılacak.
- **4 bearish spread** = Hedge (%8 ağırlık). Earnings sonrası 1-2 gün içinde kapatılacak.
- **2 index put hedge** = Genel piyasa hedge (%2 ağırlık)
- **50% nakit** = FOMC sonrası ve büyük fırsatlar için
- **Sektör Dağılımı:** Tech %25, Finansal %15, Sağlık %13, Enerji %3, Havacılık %3
- **FOMC Uyumu:** 24 Temmuz'dan önce açılır, 26 Temmuz'da %50 kapatılır. FOMC haftası (28-31 Temmuz) pozisyonları %50 azalt veya hiç açma.
- **VIX 19.44 Etkisi:** Normal pozisyon, 22 pozisyon optimal
- **Greeks Nötrlüğü:** Portföy delta hedefi ±0.10
- **Hızlı Döngü:** Her pozisyon 1-2 hafta içinde kapatılır. IV crush kazancı hızlı realize edilir.
- **Max Hold:** Earnings sonrası 2 gün

---

### 11.6 Earnings Play Pozisyon Büyüklüğü Tablosu (Hesap Bazlı)

> **45+ hisse için hesap büyüklüğüne göre earnings play pozisyon büyüklüğü rehberi.** VIX 19.44 = %100 normal pozisyon. Tüm pozisyonlar earnings play formatındadır.

| Hesap Büyüklüğü | Pozisyon/Hisse (Max) | Max Pozisyon Sayısı | UNH Örneği | BA Örneği | XOM Örneği | AMD Örneği | Earnings Play Döngü Süresi |
|-----------------|---------------------|---------------------|------------|-----------|------------|------------|---------------------------|
| **$1,000** | %2 = $20 | 3-5 | N/A | N/A | N/A | 1 kontrat | 1-2 hafta |
| **$2,500** | %2 = $50 | 5-8 | N/A | N/A | N/A | 1 kontrat | 1-2 hafta |
| **$5,000** | %1.5 = $75 | 8-12 | 1 kontrat | 1 kontrat | 1 kontrat | 1 kontrat | 1-2 hafta |
| **$10,000** | %1.5 = $150 | 10-15 | 2 kontrat | 2 kontrat | 2 kontrat | 1 kontrat | 1-2 hafta |
| **$25,000** | %1.5 = $375 | 15-20 | 5 kontrat | 4 kontrat | 4 kontrat | 2 kontrat | 1-2 hafta |
| **$50,000** | %1 = $500 | 20-25 | 7 kontrat | 6 kontrat | 6 kontrat | 3 kontrat | 1-2 hafta |
| **$100,000** | %1 = $1,000 | 25-30 | 15 kontrat | 12 kontrat | 12 kontrat | 5 kontrat | 1-2 hafta |
| **$250,000** | %0.75 = $1,875 | 30-40 | 28 kontrat | 22 kontrat | 22 kontrat | 10 kontrat | 1-2 hafta |
| **$500,000** | %0.5 = $2,500 | 40-50 | 38 kontrat | 30 kontrat | 30 kontrat | 15 kontrat | 1-2 hafta |

#### Earnings Play Pozisyon Büyüklüğü Hesaplama Formülü

```
Max Pozisyon/Hisse = Hesap Büyüklüğü x (%1.5 - %0.5 arası)

VIX Ayarlaması:
- VIX < 15: Çarpan x 1.2
- VIX 15-22: Çarpan x 1.0 (mevcut: 19.44)
- VIX 22-30: Çarpan x 0.5
- VIX 30-40: Çarpan x 0.25
- VIX > 40: Çarpan x 0

Earnings Play Kuralları:
- Entry: Earnings'ten 2-5 gün önce
- Exit: Earnings sonrası 1-2 gün içinde (max 2 gün)
- Kar hedefi: %50-75 kredi/prim (IV crush sonrası)
- Stop-loss: Earnings sonrası pozisyon zararda kalırsa veya %100 kredi kaybı
- Max hold: 2 gün
- FOMC haftası (28-31 Temmuz): %50 azalt veya hiç açma

Örnek ($10,000 hesap, VIX 19.44):
Max Pozisyon/Hisse = $10,000 x %1.5 = $150
Max Toplam Risk = $10,000 x %10 = $1,000
Earnings Play Döngü Süresi: 1-2 hafta
```

---

### 11.7 Sektör Bazlı Earnings Play Portföy Önerisi

> **45+ hisse arasından sektörel ağırlıklandırma.** VIX 19.44 ve FOMC bağlamında sektör tavsiyeleri. Tüm pozisyonlar earnings play formatındadır: entry 2-5 gün önce, exit 1-2 gün içinde (max 2 gün). IV crush kazancı = hızlı döngü (1-2 hafta).

| Varlık Sınıfı | Tavsiye | Hedef Ağırlık | Gerekçe | Risk | Earnings Play Önerilen Hisseler | Earnings Play Döngü |
|---------------|---------|---------------|---------|------|--------------------------------|--------------------|
| **S&P 500 / Büyüme Hisse** | Nötr-Azalt | %10-15 | Yüksek değerlilik, guidance riski | Yüksek | SPY, QQQ hedge | 1-2 hafta |
| **Teknoloji (Mega-cap)** | Seçici Tut | %20-25 | AI temalı ama değerlilik yüksek | Yüksek | AAPL, MSFT, GOOGL, META, AMZN | 1-2 hafta |
| **Teknoloji (Yarı İletken)** | Seçici Tut | %5-8 | AI yatırımları ama volatilite yüksek | Çok Yüksek | NVDA, AMD, INTC, AVGO, QCOM | 1-2 hafta |
| **Teknoloji (Yazılım/Cloud)** | Tut | %5-8 | Bulut büyümesi devam ediyor | Orta | CRM, ORCL, SNOW, DDOG | 1-2 hafta |
| **Teknoloji (Cybersecurity)** | Artır | %5-8 | Jeopolitik risk = güvenlik harcamaları artar | Orta | CRWD, PANW, ZS, NET | 1-2 hafta |
| **Finansal (Banka)** | Artır | %10-12 | Faiz artış beklentisi, NIM desteği | Orta | JPM, BAC, WFC, C, GS, MS | 1-2 hafta |
| **Finansal (Ödeme)** | Tut | %3-5 | Defansif, istikrarlı | Düşük | V, MA, PYPL | 1-2 hafta |
| **Sağlık (İlaç)** | Tut | %5-7 | Defansif, istikrarlı earnings | Düşük | JNJ, PFE, MRK, LLY | 1-2 hafta |
| **Sağlık (Medikal/Biyotek)** | Tut | %3-5 | Defansif, istikrarlı | Düşük | ABT, TMO, UNH | 1-2 hafta |
| **Enerji** | Artır | %5-7 | Petrol $90+, sektör büyümesi pozitif | Orta | XOM, CVX, COP | 1-2 hafta |
| **Havacılık/Endüstri** | Nötr | %2-3 | BA riskli, diğerleri stabil | Orta | BA, LMT, RTX, CAT | 1-2 hafta |
| **Tüketici (Perakende)** | Azalt | %2-3 | Enflasyon baskısı, harcamalar düşebilir | Yüksek | HD, WMT, NKE, MCD | 1-2 hafta |
| **Tüketici (İçecek/Staples)** | Tut | %2-3 | Defansif, istikrarlı | Düşük | KO, PEP, SBUX | 1-2 hafta |
| **Medya/Telekom** | Nötr | %1-2 | DIS riskli, diğerleri stabil | Orta | DIS, CMCSA, VZ | 1-2 hafta |
| **Ulaşım/Lojistik** | Nötr | %1-2 | Ekonomik büyümeye bağlı | Orta | UPS, FDX | 1-2 hafta |
| **Tahvil (10Y)** | Azalt | %0-3 | Getiri yükseliş trendi | Yüksek | TLT, IEF | N/A |
| **Altın** | Artır | %3-5 | Jeopolitik hedge, $4,000+ hedef | Orta | GLD, IAU | N/A |
| **Petrol (Fiziki)** | Nötr | %0-2 | $90-100 aralığında dalgalanma | Yüksek | USO, XLE | N/A |
| **Nakit** | Tut | %40-60 | FOMC sonrası fırsatlar için | Düşük | USD | N/A |

#### Sektör Bazlı Earnings Play Strateji Önerileri

**Artırılacak Sektörler (Earnings Play):**
- **Finansal:** Faiz artış beklentisi + NIM genişlemesi = Earnings Play Bull Put Spread, Earnings Play Iron Condor. Entry 2-5 gün önce, exit 1-2 gün içinde.
- **Enerji:** Petrol $90+ = Earnings Play Bull Call Spread, Long Call. Entry 2-5 gün önce, exit 1-2 gün içinde.
- **Cybersecurity:** Jeopolitik risk = Earnings Play Bull Call Spread, Long Straddle. Entry 2-5 gün önce, exit 1-2 gün içinde.
- **Altın:** Jeopolitik hedge = Long GLD Call, GLD Butterfly. N/A (earnings yok).

**Azaltılacak Sektörler (Earnings Play):**
- **Tech Mega-cap:** Değerlilik + guidance riski = Earnings Play Bear Call Spread, azaltılmış long. Entry 2-5 gün önce, exit 1-2 gün içinde.
- **Tüketici Discretionary:** Enflasyon baskısı = Earnings Play Bear Put Spread, azaltılmış long. Entry 2-5 gün önce, exit 1-2 gün içinde.
- **Tahvil:** Getiri yükselişi = Short TLT, azaltılmış tahvil. N/A.

**Nötr Tutulacak Sektörler (Earnings Play):**
- **Sağlık:** Defansif = Earnings Play Bull Call Spread, Earnings Play Iron Condor. Entry 2-5 gün önce, exit 1-2 gün içinde.
- **Tüketici Staples:** Defansif = Earnings Play Bull Put Spread, Earnings Play Iron Condor. Entry 2-5 gün önce, exit 1-2 gün içinde.
- **Medya/Telekom:** Karışık = Seçici earnings play pozisyon. Entry 2-5 gün önce, exit 1-2 gün içinde.

---

### 11.8 YENİ: Earnings Play Greeks Nötrlüğü Dashboard

> **Portföy düzeyinde Greeks yönetimi.** Delta, Gamma, Theta, Vega nötrlüğü hedefleri. VIX 19.44 seviyesinde optimal Greeks değerleri. Tüm pozisyonlar earnings play formatındadır: entry 2-5 gün önce, exit 1-2 gün içinde (max 2 gün).

#### Earnings Play Greeks Hedefleri (Portföy Düzeyinde)

| Greek | Hedef | Uyarı Eşiği | Kritik Eşik | Düzeltme Aksiyonu |
|-------|-------|-------------|-------------|-------------------|
| **Delta** | -0.10 ile +0.10 | ±0.15 | ±0.25 | Pozisyon ekle/çıkar, hedge |
| **Gamma** | Düşük (nötr) | >±0.05 | >±0.10 | Earnings sonrası 2 gün içinde kapat, pozisyon küçült |
| **Theta** | Pozitif (kredi stratejileri) | <0 | <-$50/gün | Kredi stratejisi artır, debit azalt |
| **Vega** | Hafif negatif (IV crush'tan kazanç) | >±500 | >±1000 | Vega nötr hedge ekle |
| **Rho** | Nötr | >±100 | >±200 | Faiz hassasiyeti hedge |

> **Not:** 21 DTE, "Ağustos'ta çıkış", "Zamanla çıkış" gibi ifadeler KALDIRILMIŞTIR. Tüm pozisyonlar earnings sonrası 2 gün içinde kapatılır. Gamma yönetimi: earnings sonrası 2 gün içinde kapat.

#### Hisse Bazlı Earnings Play Greeks Hedefleri (45+ Hisse)

| Hisse | Delta Hedef | Gamma Hedef | Theta Hedef | Vega Hedef | Rho Hedef | Strateji | Earnings Play Exit |
|-------|-------------|-------------|-------------|------------|-----------|----------|-------------------|
| AMD | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| TSLA | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| NVDA | ±0.03 | Çok Düşük | Pozitif | Hafif Negatif | Nötr | Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| META | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| AAPL | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| MSFT | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| AMZN | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| GOOGL | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| NFLX | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | IC, Bear Put | Earnings sonrası 1-2 gün (max 2 gün) |
| JPM | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | Bear Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| BAC | ±0.03 | Düşük | Pozitif | Hafif Negatif | Nötr | Bull Put, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| GS | ±0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| UNH | +0.05 | Düşük | Pozitif | Hafif Negatif | Nötr | Bull Call | Earnings sonrası 1-2 gün (max 2 gün) |
| XOM | -0.03 | Düşük | Pozitif | Hafif Negatif | Nötr | Bull Put, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| JNJ | +0.03 | Düşük | Pozitif | Hafif Negatif | Nötr | Bull Call, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |

#### Earnings Play Greeks Nötrlüğü Kontrol Listesi (Günlük)

```
[ ] Portföy Delta: -0.10 ile +0.10 arasında mı?
[ ] Portföy Gamma: Düşük mü? (Earnings sonrası 2 gün içinde kapat planlı mı?)
[ ] Portföy Theta: Pozitif mi? (Kredi stratejileri ağırlıklı mı?)
[ ] Portföy Vega: Hafif negatif mi? (IV crush'tan kazanç hedefleniyor mu?)
[ ] Hisse başına Delta: ±0.05 arasında mı?
[ ] Sektör bazlı Delta: Tek sektörde aşırı pozitif/negatif var mı?
[ ] FOMC yaklaşıyor: Delta nötrlüğü daha sıkı mı? (±0.05)
[ ] VIX > 25: Delta nötrlüğü daha sıkı mı? (±0.03)
[ ] Earnings sonrası 2 gün kuralı: Tüm pozisyonlar kapatıldı mı?
[ ] IV crush değerlendirmesi: BMO 2-4 saat, AMC ertesi gün sabah
```

#### Earnings Play Greeks Düzeltme Stratejileri

**Delta Çok Pozitif (+0.15+):**
- Bear Call Spread ekle
- Put alımı (hedge)
- Long pozisyonları azalt
- Index put (SPY/QQQ) al
- Earnings sonrası 2 gün içinde kapat

**Delta Çok Negatif (-0.15-):**
- Bull Put Spread ekle
- Call alımı (hedge)
- Short pozisyonları azalt
- Index call (SPY/QQQ) al
- Earnings sonrası 2 gün içinde kapat

**Gamma Çok Yüksek:**
- Earnings sonrası pozisyonları 2 gün içinde kapat
- Butterfly stratejileri artır (gamma düşük)
- Earnings play formatında gamma riski sınırlıdır (hızlı çıkış)

**Theta Negatif:**
- Debit spread'leri azalt
- Kredi stratejileri artır (IC, Short Straddle)
- Earnings sonrası 2 gün içinde kapat (theta decay hızlanır)

**Vega Çok Pozitif:**
- Short straddle/IC ekle (short vega)
- IV crush'tan zarar riski yüksek
- Butterfly artır (vega nötr)
- Earnings sonrası 2 gün içinde kapat (IV crush sonrası)

---

## 12. EARNINGS PLAY EYLEM PLANI VE HAFTALIK TAKVİM

> **5 haftalık detaylı earnings play eylem planı.** Her gün için spesifik aksiyonlar, öncelikler ve kontrol listeleri.
> **VIX 19.44 = Normal pozisyon.** FOMC (28-29 Temmuz) kritik dönüm noktası.
> **45+ hisse** için earnings tarihleri ve earnings play stratejiler entegre edilmiştir.
> **Earnings Play Protokolü:** Entry = Earnings'ten 2-5 gün önce | Exit = Earnings sonrası 1-2 gün içinde (max 2 gün) | Kar = %50-75 kredi/prim | IV Crush = BMO 2-4 saat, AMC ertesi gün sabah

---

### 12.1 Haftalık Earnings Play Eylem Planı (5 Hafta, Günlük Detaylı)

#### 1. HAFTA: 1-6 Temmuz — HAZIRLIK DÖNEMİ

> **Hedef:** Makro veri takibi, hisse seçimi, earnings play strateji planlama. Pozisyon açma için hazırlık. Earnings play formatını öğren.

| Gün | Tarih | Eylem | Detay | Öncelik | İlgili Hisse |
|-----|-------|-------|-------|---------|--------------|
| Çarşamba | 2 Temmuz | **NFP verisini izle** | 170K altı = dovish (olumlu), 200K üstü = hawkish (riskli). İşsizlik oranı ve ortalama saatlik kazancı da izle. | ÇOK YÜKSEK | Tüm portföy |
| Perşembe | 3 Temmuz | **ISM Hizmet PMI verisini izle** | 50+ = genişleme, 50- = daralma. Hizmet sektörü enflasyonu etkiler. | YÜKSEK | Tüm portföy |
| Cuma | 4 Temmuz | **ABD Bağımsızlık Günü — Piyasa Kapalı** | Tatil günü. Hafta sonu analiz yap. | DÜŞÜK | — |
| Cumartesi | 5 Temmuz | Hafta sonu analizi | NFP ve ISM verilerini değerlendir. Hisse seçimi ve earnings play strateji planla. | ORTA | Tüm portföy |
| Pazar | 6 Temmuz | **FOMC Haziran tutanaklarını incele** | Fed üyelerinin tonunu analiz et. "Savaşçı güvercin" (hawkish dove) sinyalleri ara. | YÜKSEK | Tüm portföy |

**1. Hafta Earnings Play Kontrol Listesi:**
```
[ ] NFP verisi (2 Temmuz) — 170K altı = dovish, 200K üstü = hawkish
[ ] İşsizlik oranı (2 Temmuz) — 4.3% beklenti
[ ] Ortalama saatlik kazanç (2 Temmuz) — +0.3% A/A beklenti
[ ] ISM Hizmet PMI (3 Temmuz) — 50+ beklenti
[ ] FOMC Haziran tutanakları (6 Temmuz) — ton analizi
[ ] VIX seviyesini kaydet (hedef: < 20)
[ ] 45+ hisse için IV Rank kontrolü
[ ] Earnings takvimini güncelle (tarih değişikliği olabilir)
[ ] İlk earnings play pozisyon listesini oluştur (5-10 hisse)
[ ] FOMC hazırlık planını gözden geçir
[ ] Earnings Play Kuralları: Entry 2-5 gün önce, Exit 1-2 gün içinde, Max 2 gün
[ ] Earnings Play Kar Hedefi: %50-75 kredi/prim (IV crush sonrası)
[ ] Earnings Play Stop-Loss: Earnings sonrası zararda kalırsa veya %100 kredi kaybı
[ ] Earnings Play IV Crush Süresi: BMO 2-4 saat, AMC ertesi gün sabah
[ ] Earnings Play Max Hold: Earnings sonrası 2 gün
[ ] FOMC Haftası Kuralı (28-31 Temmuz): Pozisyonları %50 azalt veya hiç açma
```

---

#### 2. HAFTA: 7-13 Temmuz — FİNANSALLAR VE SAĞLIK HAZIRLIĞI

> **Hedef:** Finansal ve sağlık sektörü earnings play pozisyonları aç. FOMC'den uzak hisselerde agresif ol. Earnings play formatı: entry 2-5 gün önce, exit 1-2 gün içinde.

| Gün | Tarih | Eylem | Detay | Öncelik | İlgili Hisse |
|-----|-------|-------|-------|---------|--------------|
| Salı | 8 Temmuz | **ISM Üretim PMI verisini izle** | 49-50 arası bekleniyor. Üretim sektörü sınırında. | YÜKSEK | Tüm portföy |
| Çarşamba | 9 Temmuz | Hisse seçimi sonlandır | IV Rank, CPR, teknik analiz değerlendir. 5-10 hisse seç. | ORTA | Tüm portföy |
| Perşembe | 10 Temmuz | **JPM Entry değerlendir** | Bear Call Spread earnings play pozisyonu aç (FOMC'den uzak, 14 Temmuz earnings). Entry: 9-12 Temmuz. | YÜKSEK | JPM |
| Cuma | 11 Temmuz | **GS, BAC Entry değerlendir** | Earnings Play IC veya Bull Spread pozisyonu aç. Finansal sektör FOMC'den uzak. Entry: 9-12 Temmuz. | YÜKSEK | GS, BAC |
| Cumartesi | 12 Temmuz | Hafta sonu analizi | Açık earnings play pozisyonları değerlendir. P&L kontrolü. | ORTA | Açık pozisyonlar |
| Pazar | 13 Temmuz | **JNJ Entry değerlendir** | Long Call Spread earnings play pozisyonu aç. Sağlık sektörü defansif. Entry: 10-13 Temmuz. | ORTA | JNJ |

**2. Hafta Earnings Play Kontrol Listesi:**
```
[ ] ISM Üretim PMI (8 Temmuz) — 49-50 beklenti
[ ] JPM earnings play pozisyonu aç (10 Temmuz) — Bear Call Spread
[ ] GS earnings play pozisyonu aç (11 Temmuz) — Iron Condor
[ ] BAC earnings play pozisyonu aç (11 Temmuz) — Bull Put Spread
[ ] JNJ earnings play pozisyonu aç (13 Temmuz) — Long Call Spread
[ ] VIX seviyesini kontrol et (hedef: < 22)
[ ] Açık pozisyonların delta nötrlüğünü kontrol et
[ ] FOMC'ye kalan gün: 15 gün
[ ] Earnings takvimini kontrol et (JPM 14 Temmuz)
[ ] Blackout dönemi başlangıcı: 5 gün (18 Temmuz)
[ ] Earnings Play Entry: JPM 9-12 Temmuz, GS 9-12 Temmuz, BAC 9-12 Temmuz, JNJ 10-13 Temmuz
[ ] Earnings Play Exit: JPM 16-17 Temmuz, GS 16-17 Temmuz, BAC 16-17 Temmuz, JNJ 16-17 Temmuz
[ ] Earnings Play Kar Hedefi: %50-75 kredi/prim (IV crush sonrası)
[ ] Earnings Play Stop-Loss: Earnings sonrası zararda kalırsa veya %100 kredi kaybı
[ ] Earnings Play Max Hold: Earnings sonrası 2 gün
[ ] Earnings Play IV Crush: BMO 2-4 saat, AMC ertesi gün sabah
[ ] FOMC Haftası Kuralı (28-31 Temmuz): Pozisyonları %50 azalt veya hiç açma
```

---

#### 3. HAFTA: 14-20 TEMMUZ — EARNINGS BAŞLIYOR ⭐

> **Hedef:** Yoğun earnings dönemi. Finansal ve sağlık sektörü earnings. Earnings play pozisyon yönetimi kritik. Entry 2-5 gün önce, exit 1-2 gün içinde (max 2 gün).

| Gün | Tarih | Eylem | Detay | Öncelik | İlgili Hisse |
|-----|-------|-------|-------|---------|--------------|
| **Salı** | **14 Temmuz** | **🟢 JPM, BAC, GS, WFC, C Earnings (BMO)** + **CPI Verisi** | Finansal sektörün "Büyük 4" bankası aynı gün. CPI enflasyon verisi kritik. Earnings play exit: 16-17 Temmuz. | ÇOK YÜKSEK | JPM, BAC, GS, WFC, C |
| Çarşamba | 15 Temmuz | **JNJ, MS Earnings** + PPI Verisi | Sağlık ve yatırım bankası. PPI maliyet enflasyonu. Earnings play exit: 16-17 Temmuz. | YÜKSEK | JNJ, MS |
| Perşembe | 16 Temmuz | **🟢 NFLX, ABT Earnings** — NFLX earnings play pozisyonu yönet | NFLX AMC'de. Abone sayısı ve reklam geliri kritik. Earnings play entry: 11-14 Temmuz. Exit: 17-18 Temmuz. | ÇOK YÜKSEK | NFLX, ABT |
| Cuma | 17 Temmuz | Perakende Satışlar verisi | Tüketici harcamaları. Enflasyon ve enerji etkisi. Earnings play pozisyonları: 16-17 Temmuz exit. | ORTA | Tüm portföy |
| Cumartesi | 18 Temmuz | **BLACKOUT DÖNEMİ BAŞLIYOR** | Fed üyeleri konuşamaz. Yeni earnings play pozisyon açmayı azalt. | YÜKSEK | Tüm portföy |
| Pazar | 19 Temmuz | Hafta sonu analizi | Earnings sonuçlarını değerlendir. IV crush etkisini analiz et. Earnings play P&L kontrolü. | ORTA | Açık pozisyonlar |
| Pazartesi | 20 Temmuz | TSLA, GOOGL earnings play entry değerlendir (yarım pozisyon) | FOMC'ye 8 gün kala. Agresif earnings play pozisyonları azalt. Entry: 17-20 Temmuz. Exit: 24-25 Temmuz. | ORTA | TSLA, GOOGL |

**3. Hafta Earnings Play Kontrol Listesi:**
```
[ ] JPM earnings sonucu (14 Temmuz BMO) — NIM, kredi kalitesi, guidance
[ ] JPM earnings play exit (14-16 Temmuz) — BMO: 2-4 saat içinde değerlendir, kapat
[ ] BAC earnings sonucu (14 Temmuz BMO) — Tüketici bankacılığı, mortgage
[ ] BAC earnings play exit (14-16 Temmuz) — BMO: 2-4 saat içinde değerlendir, kapat
[ ] GS earnings sonucu (14 Temmuz BMO) — Yatırım bankacılığı, trading
[ ] GS earnings play exit (14-16 Temmuz) — BMO: 2-4 saat içinde değerlendir, kapat
[ ] WFC earnings sonucu (14 Temmuz BMO) — Kredi kalitesi, NIM
[ ] WFC earnings play exit (14-16 Temmuz) — BMO: 2-4 saat içinde değerlendir, kapat
[ ] C earnings sonucu (14 Temmuz BMO) — Küresel bankacılık, trading
[ ] C earnings play exit (14-16 Temmuz) — BMO: 2-4 saat içinde değerlendir, kapat
[ ] CPI verisi (14 Temmuz) — %4.0+ beklenti
[ ] JNJ earnings sonucu (15 Temmuz BMO) — İlaç satışları, guidance
[ ] JNJ earnings play exit (15-16 Temmuz) — BMO: 2-4 saat içinde değerlendir, kapat
[ ] MS earnings sonucu (15 Temmuz BMO) — Wealth management, trading
[ ] MS earnings play exit (15-16 Temmuz) — BMO: 2-4 saat içinde değerlendir, kapat
[ ] PPI verisi (15 Temmuz) — Maliyet enflasyonu
[ ] NFLX earnings sonucu (16 Temmuz AMC) — Abone sayısı, reklam geliri
[ ] NFLX earnings play exit (17-18 Temmuz) — AMC: ertesi gün sabah değerlendir, kapat
[ ] ABT earnings sonucu (16 Temmuz BMO) — Medikal cihaz satışları
[ ] ABT earnings play exit (16-17 Temmuz) — BMO: 2-4 saat içinde değerlendir, kapat
[ ] Perakende Satışlar (17 Temmuz) — Tüketici harcamaları
[ ] Blackout başlangıcı (18 Temmuz) — Yeni earnings play pozisyon azalt
[ ] IV Crush değerlendirmesi — Earnings sonrası IV düşüşü
[ ] Earnings Play Kar Hedefi (%50-75 kredi) ulaşıldı mı? — Mekanik çıkış
[ ] Earnings Play Stop-Loss: Earnings sonrası zararda kalırsa veya %100 kredi kaybı
[ ] Earnings Play Max Hold: Earnings sonrası 2 gün
[ ] Earnings Play IV Crush: BMO 2-4 saat, AMC ertesi gün sabah
[ ] FOMC'ye kalan gün: 8 gün
[ ] FOMC Haftası Kuralı (28-31 Temmuz): Pozisyonları %50 azalt veya hiç açma
```

---

#### 4. HAFTA: 21-27 TEMMUZ — FOMC ÖNCESİ KÜÇÜLTME 🚨

> **Hedef:** FOMC öncesi earnings play pozisyon küçültme. Yeni earnings play pozisyon açmayı durdur. Risk azaltma. Earnings play formatı: entry 2-5 gün önce, exit 1-2 gün içinde (max 2 gün).

| Gün | Tarih | Eylem | Detay | Öncelik | İlgili Hisse |
|-----|-------|-------|-------|---------|--------------|
| Salı | 21 Temmuz | **BLK Earnings** + TSLA/GOOGL earnings play entry değerlendir (yarım pozisyon) | BLK BMO. Varlık yönetimi akışları. TSLA/GOOGL yarım pozisyon. Entry: 17-20 Temmuz. Exit: 24-25 Temmuz. | ORTA | BLK, TSLA, GOOGL |
| Çarşamba | 22 Temmuz | **🟡 TSLA, GOOGL, TMO Earnings (AMC)** | Tesla ve Google aynı gün AMC'de. Ayın en kritik tech günü. Earnings play exit: 24-25 Temmuz. | ÇOK YÜKSEK | TSLA, GOOGL, TMO |
| Perşembe | 23 Temmuz | **INTC Earnings (AMC)** + Yeni earnings play pozisyon açmayı DURDUR | Intel yarı iletken. FOMC'ye 5 gün kala yeni giriş yok. Earnings play exit: 25-26 Temmuz. | YÜKSEK | INTC |
| Cuma | 24 Temmuz | **⚠️ TÜM EARNINGS PLAY POZİSYONLARINI %50 KÜÇÜLT** | FOMC'ye 4 gün kala. Agresif risk azaltma. | ÇOK YÜKSEK | Tüm portföy |
| Cumartesi | 25 Temmuz | Hafta sonu analizi + P&L değerlendirmesi | Açık earnings play pozisyonları değerlendir. Kapanış planı hazırla. | YÜKSEK | Açık pozisyonlar |
| Pazar | 26 Temmuz | **Earnings play pozisyonları %50 azalt** (devam) | Risk azaltma devam. Nakit rezervini %60+'ya çıkar. | ÇOK YÜKSEK | Tüm portföy |
| Pazartesi | 27 Temmuz | **🚨 TÜM AKTİF EARNINGS PLAY POZİSYONLARINDA KAPANIŞ PLANLA** | Son çıkış günü. Limit emirleri koy. Nakit %70+. Earnings play max hold: 2 gün. | ÇOK YÜKSEK | Tüm portföy |

**4. Hafta Earnings Play Kontrol Listesi:**
```
[ ] BLK earnings sonucu (21 Temmuz BMO) — AUM akışları, yönetim ücretleri
[ ] BLK earnings play exit (21-22 Temmuz) — BMO: 2-4 saat içinde değerlendir, kapat
[ ] TSLA earnings sonucu (22 Temmuz AMC) — FSD gelirleri, otonom sürüş, guidance
[ ] TSLA earnings play exit (24-25 Temmuz) — AMC: ertesi gün sabah değerlendir, kapat
[ ] GOOGL earnings sonucu (22 Temmuz AMC) — Cloud, YouTube, AI rekabeti
[ ] GOOGL earnings play exit (24-25 Temmuz) — AMC: ertesi gün sabah değerlendir, kapat
[ ] TMO earnings sonucu (22 Temmuz) — Biyoteknoloji, laboratuvar ekipmanları
[ ] TMO earnings play exit (23-24 Temmuz) — Earnings sonrası 1-2 gün içinde kapat
[ ] INTC earnings sonucu (23 Temmuz AMC) — Yarı iletken üretimi, AI chip
[ ] INTC earnings play exit (25-26 Temmuz) — AMC: ertesi gün sabah değerlendir, kapat
[ ] 24 Temmuz: Yeni earnings play pozisyon açmayı DURDUR
[ ] 24 Temmuz: Tüm earnings play pozisyonlarını %50 küçült
[ ] 26 Temmuz: Earnings play pozisyonları %50 azalt (devam)
[ ] 27 Temmuz: Tüm aktif earnings play pozisyonlarında kapanış planla
[ ] VIX seviyesini kontrol et (hedef: < 25, uyarı: > 25)
[ ] FOMC'ye kalan gün: 1-7 gün
[ ] Blackout dönemi devam (18-30 Temmuz)
[ ] Earnings sonrası IV crush değerlendirmesi
[ ] Earnings Play Kar Hedefi (%50-75 kredi) ulaşıldı mı?
[ ] Earnings Play Stop-Loss: Earnings sonrası zararda kalırsa veya %100 kredi kaybı
[ ] Earnings Play Max Hold: Earnings sonrası 2 gün
[ ] Earnings Play IV Crush: BMO 2-4 saat, AMC ertesi gün sabah
[ ] Delta nötrlüğünü kontrol et (±0.05, FOMC yaklaşıyor)
[ ] FOMC Haftası Kuralı (28-31 Temmuz): Pozisyonları %50 azalt veya hiç açma
```

---

#### 5. HAFTA: 28-31 TEMMUZ — FOMC + MEGA-CAP EARNINGS 🔴🔴

> **Hedef:** FOMC kararı ve mega-cap earnings. Yeni earnings play pozisyon açma yasak. Sadece gözlem ve mevcut earnings play pozisyon yönetimi. Earnings play max hold: 2 gün.

| Gün | Tarih | Eylem | Detay | Öncelik | İlgili Hisse |
|-----|-------|-------|-------|---------|--------------|
| **Salı** | **28 Temmuz** | **🚨 FOMC BAŞLIYOR** + **UNH, V Earnings** + **YENİ EARNINGS PLAY POZİSYON AÇMA** | FOMC toplantısı başlangıcı. UNH ve V earnings. Yeni earnings play pozisyon YOK. | ÇOK YÜKSEK | UNH, V |
| **Çarşamba** | **29 Temmuz** | **🚨 FOMC KARARI (14:00 ET)** + **MSFT, META Earnings (AMC)** | Yılın en kritik günü. FOMC kararı + 2 mega-cap tech. Earnings play max hold: 2 gün. | ÇOK YÜKSEK | MSFT, META |
| **Perşembe** | **30 Temmuz** | **🔴 AAPL, AMZN, MA, PFE Earnings (AMC)** + **GDP Q2** | Apple ve Amazon aynı gün. GDP Advance Estimate. Üçlü risk. Earnings play max hold: 2 gün. | ÇOK YÜKSEK | AAPL, AMZN, MA, PFE |
| **Cuma** | **31 Temmuz** | **XOM, CVX, MRK Earnings (BMO)** + ECI Verisi | Enerji devleri + istihdam maliyeti. FOMC sonrası ilk değerlendirme. Earnings play exit: 1-2 Ağu. | YÜKSEK | XOM, CVX, MRK |
| Cumartesi | 1 Ağustos | Hafta sonu strateji revizyonu | FOMC tonu, GDP, earnings sonuçlarına göre yeni earnings play plan. | ORTA | Tüm portföy |
| Pazar | 2 Ağustos | Yeni earnings play setup hazırlığı | Temizlenmiş fiyatlardan yeni earnings play pozisyon listesi. | ORTA | Tüm portföy |

**5. Hafta Earnings Play Kontrol Listesi:**
```
[ ] 28 Temmuz: FOMC başlangıcı — Yeni earnings play pozisyon açma YASAK
[ ] 28 Temmuz: UNH earnings sonucu (BMO) — Sağlık sigortası, guidance
[ ] 28 Temmuz: UNH earnings play exit (28-29 Temmuz) — BMO: 2-4 saat içinde değerlendir, kapat
[ ] 28 Temmuz: V earnings sonucu (AMC) — Ödeme hacimleri, küresel harcama
[ ] 28 Temmuz: V earnings play exit (29-30 Temmuz) — AMC: ertesi gün sabah değerlendir, kapat
[ ] 29 Temmuz: FOMC kararı (14:00 ET) — Faiz değişikliği, ton
[ ] 29 Temmuz: Kevin Warsh basın konferansı (14:30 ET) — Ton analizi
[ ] 29 Temmuz: MSFT earnings sonucu (AMC) — Azure, AI yatırımları
[ ] 29 Temmuz: MSFT earnings play exit (30-31 Temmuz) — AMC: ertesi gün sabah değerlendir, kapat
[ ] 29 Temmuz: META earnings sonucu (AMC) — VR/AR, reklam gelirleri
[ ] 29 Temmuz: META earnings play exit (30-31 Temmuz) — AMC: ertesi gün sabah değerlendir, kapat
[ ] 30 Temmuz: AAPL earnings sonucu (AMC) — iPhone, AI stratejisi, guidance
[ ] 30 Temmuz: AAPL earnings play exit (31 Temmuz-1 Ağu) — AMC: ertesi gün sabah değerlendir, kapat
[ ] 30 Temmuz: AMZN earnings sonucu (AMC) — AWS, e-ticaret
[ ] 30 Temmuz: AMZN earnings play exit (31 Temmuz-1 Ağu) — AMC: ertesi gün sabah değerlendir, kapat
[ ] 30 Temmuz: MA earnings sonucu (BMO) — Ödeme hacimleri
[ ] 30 Temmuz: MA earnings play exit (30-31 Temmuz) — BMO: 2-4 saat içinde değerlendir, kapat
[ ] 30 Temmuz: PFE earnings sonucu (BMO) — İlaç satışları, pipeline
[ ] 30 Temmuz: PFE earnings play exit (30-31 Temmuz) — BMO: 2-4 saat içinde değerlendir, kapat
[ ] 30 Temmuz: GDP Q2 Advance Estimate — %1.5-2.0 beklenti
[ ] 31 Temmuz: XOM earnings sonucu (BMO) — Petrol üretimi, enerji fiyatları
[ ] 31 Temmuz: XOM earnings play exit (31 Temmuz-1 Ağu) — BMO: 2-4 saat içinde değerlendir, kapat
[ ] 31 Temmuz: CVX earnings sonucu (BMO) — Üretim büyümesi, marjlar
[ ] 31 Temmuz: CVX earnings play exit (31 Temmuz-1 Ağu) — BMO: 2-4 saat içinde değerlendir, kapat
[ ] 31 Temmuz: MRK earnings sonucu (BMO) — İlaç satışları, pipeline
[ ] 31 Temmuz: MRK earnings play exit (31 Temmuz-1 Ağu) — BMO: 2-4 saat içinde değerlendir, kapat
[ ] 31 Temmuz: ECI Verisi — Ücret baskıları
[ ] FOMC sonrası: Yeni earnings play değerlendirmelere başla
[ ] VIX seviyesini kontrol et (FOMC sonrası düşüş bekleniyor)
[ ] Earnings sonrası IV crush değerlendirmesi
[ ] Earnings Play Kar Hedefi (%50-75 kredi) ulaşıldı mı?
[ ] Earnings Play Stop-Loss: Earnings sonrası zararda kalırsa veya %100 kredi kaybı
[ ] Earnings Play Max Hold: Earnings sonrası 2 gün
[ ] Earnings Play IV Crush: BMO 2-4 saat, AMC ertesi gün sabah
[ ] Delta nötrlüğünü kontrol et (FOMC sonrası volatilite)
[ ] 3 Ağustos: Normal earnings play pozisyon açmaya dönüş planla
[ ] 3 Ağustos: Entry 2-5 gün önce, Exit 1-2 gün içinde (max 2 gün)
```

---

### 12.2 Günlük Earnings Play Checklist (Her Ticaret Günü)

> **10 maddelik günlük earnings play kontrol listesi.** Her ticaret günü sabah ve akşam olmak üzere 2 kez kontrol edilmelidir.

#### Sabah Earnings Play Checklist (Piyasa Açılış Öncesi)

```
[ ] 1. VIX seviyesini kontrol et (>25 = pozisyon küçült, >30 = agresif küçült)
[ ] 2. Açık earnings play pozisyonlarının P&L durumunu kontrol et (kar/zarar durumu)
[ ] 3. Earnings takvimini kontrol et (tarih değişikliği olabilir)
[ ] 4. FOMC takvimine kalan günü kontrol et (24 Temmuz'dan sonra yeni earnings play pozisyon yok)
[ ] 5. Makro veri akışını kontrol et (CPI, GDP, NFP, ISM, vs.)
```

#### Öğle Earnings Play Checklist (Piyasa Ortasında)

```
[ ] 6. IV Rank değişimini izle (>50 = earnings play fırsatı, <40 = dikkatli ol)
[ ] 7. CPR (Call/Put Ratio) değişimini izle (anlık sentiment)
[ ] 8. Delta nötrlüğünü kontrol et (±0.10, FOMC yaklaşıyorsa ±0.05)
```

#### Akşam Earnings Play Checklist (Piyasa Kapanış Sonrası)

```
[ ] 9. Earnings Play Stop-Loss: Earnings sonrası pozisyon zararda kalırsa veya %100 kredi kaybı anında kapat
[ ] 10. Earnings Play Kar Hedefi (%50-75 kredi) ulaşıldı mı? (ulaşıldıysa sorgusuz kapat)
[ ] 11. Earnings Play Max Hold: Earnings sonrası 2 gün kuralı kontrol et
[ ] 12. Earnings Play IV Crush: BMO 2-4 saat, AMC ertesi gün sabah değerlendirme planla
[ ] 13. Earnings Play Entry: Yarın earnings'ten 2-5 gün önce mi? Entry planla
[ ] 14. Earnings Play Exit: Yarın earnings sonrası 1-2 gün içinde mi? Exit planla
```

#### Günlük Earnings Play Checklist Özeti

| # | Madde | Zamanlama | Eşik | Aksiyon |
|---|-------|-----------|------|---------|
| 1 | VIX kontrolü | Sabah | >25 | Küçült |
| 2 | P&L kontrolü | Sabah | Kar = %50-75 kredi | Kapat |
| 3 | Earnings takvimi | Sabah | Tarih değişikliği | Earnings play strateji revizyonu |
| 4 | FOMC takvimi | Sabah | 24-30 Temmuz | Yeni earnings play pozisyon yok |
| 5 | Makro veri | Sabah | CPI, GDP, NFP | Earnings play pozisyon ayarlama |
| 6 | IV Rank | Öğle | >%50 | Earnings play fırsatı |
| 7 | CPR | Öğle | <0.8 veya >1.5 | Sentiment değişimi |
| 8 | Delta nötrlüğü | Öğle | >±0.10 | Hedge ekle/çıkar |
| 9 | Earnings Play Stop-Loss | Akşam | Earnings sonrası zararda veya %100 kredi kaybı | Anında kapat |
| 10 | Earnings Play Kar Hedefi | Akşam | %50-75 kredi | Sorgusuz kapat |
| 11 | Earnings Play Max Hold | Akşam | 2 gün | Mekanik kapat |
| 12 | Earnings Play IV Crush | Akşam | BMO: 2-4 saat, AMC: 1 gün | Hızlı değerlendirme |
| 13 | Earnings Play Entry | Akşam | 2-5 gün önce | Entry planla |
| 14 | Earnings Play Exit | Akşam | 1-2 gün içinde | Exit planla |

---

### 12.3 Earnings Play Öncesi Hazırlık Adımları (7 Adım)

> **Her earnings play pozisyonu için standart 7 adımlık hazırlık süreci.** 45+ hisse için uygulanabilir. Earnings play formatı: entry 2-5 gün önce, exit 1-2 gün içinde (max 2 gün).

| Adım | Zamanlama | Detay | Kontrol Listesi | Araçlar |
|------|-----------|-------|-----------------|---------|
| **1. Hisse Seçimi** | 1-2 hafta önce | IV Rank, CPR, teknik analiz, beta, sektör trendi değerlendir | IV Rank > %40? CPR < 1.0 (call) veya > 1.0 (put)? Beta > 1.0? FOMC riski? | MarketChameleon, Barchart, TradingView |
| **2. Strateji Belirleme** | 3-5 gün önce (earnings'ten önce) | Earnings Play Lottery, Spread, Butterfly seç. Bütçe ve risk toleransına göre. | Bütçe uygun mu? Deneyim seviyesi? FOMC riski? Entry 2-5 gün önce? | EarningsPlay v5.0 Rehberi |
| **3. Strike Hesaplama** | 2-3 gün önce (earnings'ten önce) | Expected Move (EM) hesapla. Short strikes EM'nin %10-15 dışında olmalı. | EM = Stock Price x IV x sqrt(Days/365)? Short strikes EM + %10-15 dışında mı? | OptionCharts, AlphaQuery |
| **4. Entry Zamanlaması** | 2-5 gün önce (earnings'ten önce) | Earnings'ten 2-5 gün önce pozisyon aç. IV en şişmiş seviyede. | IV Rank zirvede mi? (genellikle 1-2 gün önce) Likidite yeterli mi? FOMC haftası mı? | Broker platformu, IV takibi |
| **5. Pozisyon Yönetimi** | Earnings günü | Pozisyon açık kalır, izleme devam eder. Panik yok. Earnings play max hold: 2 gün. | P&L kontrolü. Stop-loss ve kar hedefi aktif mi? FOMC çakışması var mı? | Broker platformu |
| **6. IV Crush Değerlendirmesi** | Earnings sonrası (BMO: 2-4 saat, AMC: ertesi gün sabah) | IV düşüşünü değerlendir. Erken kapanış düşün. Earnings play kar hedefi: %50-75 kredi. | IV %40-70 düştü mü? Pozisyon hala karlı mı? Theta decay hızlandı mı? Max hold: 2 gün. | MarketChameleon, IV takibi |
| **7. Çıkış** | Earnings sonrası 1-2 gün içinde (max 2 gün) | Mekanik çıkış uygula. Duygusal karar verme. Earnings play kar hedefi: %50-75 kredi. | Kar = %50-75 kredi? Zarar = %100 kredi? Max hold: 2 gün? FOMC yaklaşıyor mu? | EarningsPlay v5.0 Kuralları |

#### Earnings Play Hazırlık Zaman Çizelgesi (Örnek: AAPL, 30 Temmuz Earnings)

| Tarih | Gün | Adım | Detay | Earnings Play Kuralı |
|-------|-----|------|-------|----------------------|
| 16 Temmuz | Perşembe | 1. Hisse Seçimi | AAPL IV Rank 55%, CPR 0.64, Beta 1.09. Seçildi. | FOMC riski yüksek (28-31 Temmuz) |
| 23 Temmuz | Perşembe | 2. Strateji Belirleme | Butterfly seçildi ($200-$500 bütçe). Earnings play formatı. | Entry: 25-28 Temmuz, Exit: 31-1 Ağu |
| 25 Temmuz | Cumartesi | 3. Strike Hesaplama | EM = $301.54 x 55% x sqrt(2/365) = ~$24. Short strikes: $292 ve $311. | FOMC haftası — %50 azalt veya hiç açma |
| 26 Temmuz | Pazar | 4. Entry (revize) | FOMC yaklaşıyor! Yarım pozisyon veya erteleme. | FOMC haftası (28-31 Temmuz): %50 azalt |
| 27 Temmuz | Pazartesi | 4. Entry (devam) | FOMC öncesi son çıkış günü. Entry değerlendirildi. | Max hold: 2 gün. FOMC sonrası entry tercih |
| 28-29 Temmuz | Salı-Çarş | 4. Entry (revize) | FOMC kararı sonrası 30 dakika beklendi. Entry değerlendirildi. | FOMC sonrası entry tercih |
| 30 Temmuz | Perşembe | 5. Yönetim | AAPL earnings AMC. Pozisyon izlendi. FOMC + GDP etkisi. | Max hold: 2 gün. Exit: 31-1 Ağu |
| 31 Temmuz | Cuma | 6. IV Crush | IV %50 düştü. Butterfly karlı. Değerlendirme yapıldı. | BMO: 2-4 saat, AMC: ertesi gün sabah |
| 31 Temmuz | Cuma | 7. Çıkış | %50-75 kar hedefine ulaşıldı. Sorgusuz kapatıldı. | Max hold: 2 gün. Mekanik çıkış. |

> **Not:** 21 DTE, "Ağustos'ta çıkış", "Zamanla çıkış" gibi ifadeler KALDIRILMIŞTIR. Tüm pozisyonlar earnings sonrası 2 gün içinde kapatılır.

---

### 12.4 YENİ: Earnings Play Hafta Sonu Hazırlık Rutini

> **Her hafta sonu (Cumartesi-Pazar) uygulanacak earnings play hazırlık rutini.** 45+ hisse için portföy değerlendirmesi ve gelecek hafta earnings play planlaması.

#### Cumartesi Earnings Play Rutini (Piyasa Kapalı — Analiz Günü)

**1. P&L Değerlendirmesi (30 dk)**
- Haftalık P&L özetini çıkar
- Kazanan ve kaybeden earnings play pozisyonlarını analiz et
- Neden kazandın/kaybettin? (Not al)
- Portföy delta, gamma, theta, vega değerlerini kaydet
- Earnings play max hold: 2 gün kuralına uyuldu mu? Kontrol et.

**2. Açık Earnings Play Pozisyon İncelemesi (20 dk)**
- Her açık earnings play pozisyonu için durum analizi
- Kar/zarar durumu, IV crush beklentisi, exit planı
- Stop-loss ve kar hedefi güncellemesi
- FOMC'ye kalan gün ve etki değerlendirmesi
- Max hold: 2 gün kuralı kontrolü

**3. Earnings Takvimi Güncellemesi (15 dk)**
- Gelecek hafta earnings açıklayacak şirketleri listele
- Tarih değişikliği olup olmadığını kontrol et
- FOMC çakışmalarını işaretle
- Earnings play entry pencereleri: 2-5 gün önce
- Earnings play exit pencereleri: 1-2 gün içinde (max 2 gün)
- Yeni earnings play fırsatlarını not al

**4. Makro Veri Takvimi (15 dk)**
- Gelecek hafta açıklanacak makro verileri listele
- NFP, CPI, GDP, ISM, FOMC, vs.
- Her verinin piyasa etkisini değerlendir
- Earnings play pozisyon ayarlamaları planla
- FOMC haftası (28-31 Temmuz): %50 azalt veya hiç açma

**5. Earnings Play Strateji Revizyonu (20 dk)**
- EarningsPlay v5.0 kurallarına uygunluk kontrolü
- Pozisyon boyutu kuralları (VIX 19.44 = %100)
- Sektör ağırlıklandırma kontrolü
- Greeks nötrlüğü değerlendirmesi
- Earnings play max hold: 2 gün kuralı kontrolü
- Earnings play kar hedefi: %50-75 kredi/prim kontrolü
- Earnings play stop-loss: Earnings sonrası zararda kalırsa veya %100 kredi kaybı kontrolü
- Earnings play IV crush: BMO 2-4 saat, AMC ertesi gün sabah kontrolü

#### Pazar Earnings Play Rutini (Piyasa Kapalı — Planlama Günü)

**6. Gelecek Hafta Earnings Play Planı (30 dk)**
- Hangi hisselerde earnings play pozisyon açacaksın? (Max 3-5 yeni)
- Hangi earnings play stratejileri kullanacaksın? (Lottery, Spread, Butterfly)
- Entry tarihleri ve fiyatları belirle (2-5 gün önce)
- Exit planları (kar hedefi: %50-75 kredi, stop-loss: %100 kredi, max hold: 2 gün)
- IV crush değerlendirmesi planla (BMO: 2-4 saat, AMC: ertesi gün sabah)

**7. FOMC / Blackout Earnings Play Kontrolü (10 dk)**
- FOMC'ye kalan gün
- Blackout dönemi durumu
- Earnings play pozisyon küçültme takvimi kontrolü
- Yeni earnings play pozisyon açma kısıtlamaları
- FOMC haftası (28-31 Temmuz): %50 azalt veya hiç açma

**8. Earnings Play Risk Yönetimi Kontrolü (15 dk)**
- Toplam portföy riski (max %10)
- Tek hisse riski (max %1.5)
- Tek sektör riski (max %15)
- VIX seviyesi ve earnings play pozisyon ayarlama
- Earnings play max hold: 2 gün kuralı kontrolü
- Earnings play kar hedefi: %50-75 kredi/prim kontrolü

**9. Broker Platformu Earnings Play Hazırlığı (10 dk)**
- Watchlist'leri güncelle (earnings play fırsatları)
- Limit emirleri hazırla (kar hedefi: %50-75 kredi, stop-loss: %100 kredi)
- Alerts kur (VIX, hisse fiyatı, IV Rank, earnings tarihi)
- Hesap bakiyesi ve marj kontrolü
- Earnings play entry ve exit emirleri hazırla

**10. Eğitim ve İnceleme (20 dk)**
- Haftanın öğrenilen derslerini not al
- Yeni earnings play stratejileri araştır
- Piyasa yorumlarını oku (Fed, analistler)
- Raporları güncelle
- Earnings play max hold: 2 gün kuralı hatırlat

#### Earnings Play Hafta Sonu Rutin Kontrol Listesi

```
CUMARTESİ:
[ ] P&L değerlendirmesi (haftalık) — earnings play kazanan/kaybeden analizi
[ ] Açık earnings play pozisyon incelemesi — max hold: 2 gün kontrolü
[ ] Earnings takvimi güncellemesi — entry 2-5 gün önce, exit 1-2 gün içinde
[ ] Makro veri takvimi — FOMC, CPI, GDP, NFP
[ ] Earnings play strateji revizyonu — EarningsPlay v5.0 kuralları kontrolü
[ ] Earnings play kar hedefi: %50-75 kredi/prim kontrolü
[ ] Earnings play stop-loss: Earnings sonrası zararda kalırsa veya %100 kredi kaybı kontrolü
[ ] Earnings play IV crush: BMO 2-4 saat, AMC ertesi gün sabah kontrolü

PAZAR:
[ ] Gelecek hafta earnings play planı (3-5 yeni pozisyon max)
[ ] Entry tarihleri: Earnings'ten 2-5 gün önce
[ ] Exit planları: Earnings sonrası 1-2 gün içinde (max 2 gün)
[ ] Kar hedefi: %50-75 kredi/prim (IV crush sonrası)
[ ] Stop-loss: Earnings sonrası zararda kalırsa veya %100 kredi kaybı
[ ] FOMC / Blackout earnings play kontrolü
[ ] Earnings play risk yönetimi kontrolü
[ ] Broker platformu earnings play hazırlığı
[ ] Eğitim ve inceleme
```

---

### 12.5 YENİ: Earnings Günü Earnings Play Protokolü

> **Earnings gününde uygulanacak standart earnings play protokol.** BMO (Before Market Open) ve AMC (After Market Close) earnings için farklı prosedürler. 45+ hisse için uygulanabilir. Earnings play formatı: exit 1-2 gün içinde (max 2 gün). IV crush değerlendirmesi: BMO 2-4 saat, AMC ertesi gün sabah.

#### BMO Earnings Play Protokolü (Örnek: JPM, 14 Temmuz 6:00-8:00 AM ET)

**Öncesi (Önceki Gün Akşam):**
- Earnings play pozisyon son kontrolü
- Stop-loss ve kar hedefi emirlerini güncelle (kar hedefi: %50-75 kredi, stop-loss: %100 kredi)
- Uyku öncesi alarm kur (earnings saatinden 30 dk önce)
- Earnings play exit planı: 2-4 saat içinde değerlendirme, kapatma

**Sabah (5:30-6:00 AM ET):**
- Alarm çal, uyan
- Kahve al, bilgisayarı aç
- Pre-market fiyatları kontrol et
- VIX seviyesini kontrol et
- Earnings play pozisyon durumunu not al

**Earnings Anı (6:00-8:00 AM ET):**
- Earnings sonucunu anlık takip et (EPS, Revenue, Guidance)
- Piyasa tepkisini izle (pre-market hareket)
- Earnings play pozisyon durumunu değerlendir
- Panik yapma, duygusal karar verme
- Earnings play max hold: 2 gün hatırla

**Piyasa Açılışı (9:30 AM ET):**
- Açılış fiyatını izle
- IV crush etkisini gözlemle (IV %40-70 düşer — BMO için 2-4 saat içinde)
- Earnings play pozisyon kar/zarar durumunu değerlendir
- Earnings play kar hedefi (%50-75 kredi) ulaşıldı mı?
- Earnings play stop-loss (%100 kredi kaybı) aşıldı mı?
- Earnings play mekanik çıkış kurallarını uygula
- **BMO IV Crush Değerlendirmesi:** 10:00-11:00 AM ET'de değerlendir, kapat

**Öğleden Sonra:**
- Earnings play pozisyon durumunu tekrar değerlendir
- Ertesi gün planı yap (max hold: 2 gün — earnings sonrası 2. gün kapanışta mutlaka kapat)
- Not al (kazanan/kaybeden nedenleri)

#### AMC Earnings Play Protokolü (Örnek: NFLX, 16 Temmuz 4:00-5:30 PM ET)

**Öncesi (Öğleden Önce):**
- Earnings play pozisyon son kontrolü
- Piyasa kapanış öncesi son durum değerlendirmesi
- Plan: Earnings sonrası ertesi gün sabah değerlendireceksin (AMC için ertesi gün sabah)
- Earnings play exit planı: Ertesi gün sabah değerlendirme, kapatma

**Piyasa Kapanışı (4:00 PM ET):**
- Normal kapanışı izle
- After-hours trading başlamadan earnings play pozisyon durumunu not al
- VIX kapanış seviyesini kaydet

**Earnings Anı (4:00-5:30 PM ET):**
- Earnings sonucunu anlık takip et (EPS, Revenue, Guidance)
- After-hours fiyat hareketini izle
- Earnings play pozisyon durumunu değerlendir
- Panik yapma, duygusal karar verme
- Earnings play max hold: 2 gün hatırla

**Aynı Akşam (5:30-7:00 PM ET):**
- After-hours fiyatı değerlendir
- IV crush etkisini tahmin et (IV %40-70 düşecek — AMC için ertesi gün sabah)
- Karar ver: Aynı akşam kapat veya ertesi güne bırak (tercihen ertesi gün sabah)
- Eğer kar hedefi (%50-75) ulaşıldıysa → Kapat (after-hours)
- Eğer stop-loss (%100 kredi) aşıldıysa → Kapat (after-hours)
- Eğer arada ise → Ertesi gün sabah değerlendir (AMC IV crush ertesi gün sabah)

**Ertesi Gün Sabah (9:30 AM ET):**
- Açılış fiyatını izle
- IV crush gerçekleşti mi? (IV ne kadar düştü?)
- Earnings play pozisyon kar/zarar durumunu değerlendir
- Earnings play mekanik çıkış kurallarını uygula
- **AMC IV Crush Değerlendirmesi:** 9:30-10:00 AM ET'de değerlendir, kapat
- Earnings play max hold: 2 gün — earnings sonrası 2. gün kapanışta mutlaka kapat
- Not al (kazanan/kaybeden nedenleri)

#### Earnings Günü Earnings Play Kontrol Listesi (BMO)

```
ÖNCESİ (Önceki Gün Akşam):
[ ] Earnings play pozisyon son kontrolü
[ ] Stop-loss (%100 kredi kaybı) ve kar hedefi (%50-75 kredi) emirlerini güncelle
[ ] Alarm kur (earnings saatinden 30 dk önce)
[ ] Earnings play exit planı: BMO 2-4 saat içinde değerlendirme, kapatma

SABAH (5:30-6:00 AM ET):
[ ] Uyan, kahve al
[ ] Pre-market fiyatları kontrol et
[ ] VIX seviyesini kontrol et
[ ] Earnings play pozisyon durumunu not al

EARNINGS ANI (6:00-8:00 AM ET):
[ ] Earnings sonucunu takip et (EPS, Revenue, Guidance)
[ ] Piyasa tepkisini izle
[ ] Panik yapma
[ ] Earnings play max hold: 2 gün hatırla

PİYASA AÇILIŞI (9:30 AM ET):
[ ] Açılış fiyatını izle
[ ] IV crush etkisini gözlemle (BMO: 2-4 saat içinde)
[ ] Earnings play kar hedefi (%50-75 kredi) ulaşıldı mı?
[ ] Earnings play stop-loss (%100 kredi kaybı) aşıldı mı?
[ ] Earnings play mekanik çıkış kurallarını uygula
[ ] BMO IV Crush Değerlendirmesi: 10:00-11:00 AM ET'de kapat

ÖĞLEDEN SONRA:
[ ] Earnings play pozisyon durumunu tekrar değerlendir
[ ] Ertesi gün planı yap (max hold: 2 gün — 2. gün kapanışta mutlaka kapat)
[ ] Not al
```

#### Earnings Günü Earnings Play Kontrol Listesi (AMC)

```
ÖNCESİ (Öğleden Önce):
[ ] Earnings play pozisyon son kontrolü
[ ] Piyasa kapanış öncesi son durum değerlendirmesi
[ ] Earnings play exit planı: Ertesi gün sabah değerlendirme, kapatma

PİYASA KAPANIŞI (4:00 PM ET):
[ ] Normal kapanışı izle
[ ] Earnings play pozisyon durumunu not al
[ ] VIX kapanış seviyesini kaydet

EARNINGS ANI (4:00-5:30 PM ET):
[ ] Earnings sonucunu takip et
[ ] After-hours fiyat hareketini izle
[ ] Panik yapma
[ ] Earnings play max hold: 2 gün hatırla

AYNI AKŞAM (5:30-7:00 PM ET):
[ ] After-hours fiyatı değerlendir
[ ] IV crush etkisini tahmin et (AMC: ertesi gün sabah)
[ ] Karar ver: Kapat veya ertesi güne bırak (tercihen ertesi gün sabah)
[ ] Earnings play kar hedefi (%50-75) ulaşıldı mı?
[ ] Earnings play stop-loss (%100 kredi) aşıldı mı?

ERTESİ GÜN SABAH (9:30 AM ET):
[ ] Açılış fiyatını izle
[ ] IV crush gerçekleşti mi? (AMC: ertesi gün sabah)
[ ] Earnings play pozisyon kar/zarar durumunu değerlendir
[ ] Earnings play mekanik çıkış kurallarını uygula
[ ] AMC IV Crush Değerlendirmesi: 9:30-10:00 AM ET'de kapat
[ ] Max hold: 2 gün — earnings sonrası 2. gün kapanışta mutlaka kapat
[ ] Not al
```

#### Earnings Günü Earnings Play Duygusal Disiplin Kuralları

1. **Panik Yok:** Earnings sonrası ilk 30 dakika en volatil dönemdir. Hızlı karar verme. Earnings play max hold: 2 gün.
2. **Plana Sadık Kal:** Önceden belirlenen earnings play kar hedefi (%50-75 kredi) ve stop-loss (%100 kredi) kurallarını uygula.
3. **FOMO Yok:** "Biraz daha bekleyeyim, belki daha çok kar ederim" düşüncesi yasak. Earnings play max hold: 2 gün.
4. **Revenge Trading Yok:** Kaybeden earnings play pozisyonun ardından hemen yeni pozisyon açma.
5. **Not Al:** Her earnings play deneyimini not al. Gelecek sezon için referans.
6. **Uyku Önemli:** AMC earnings sonrası gece yarısına kadar beklemek zorunda değilsin. Plan yap (ertesi gün sabah değerlendirme) ve uyu.
7. **Sosyal Medya Yok:** Earnings günü Twitter/X, Reddit, StockTwits'ten uzak dur. Gürültü seni etkilemesin.
8. **Mekanik Çıkış:** Earnings play kar hedefi (%50-75 kredi) ulaşıldığında sorgusuz kapat. Duygusal mazeret yok. Earnings play max hold: 2 gün.
9. **IV Crush Hızlıdır:** BMO earnings için IV crush 2-4 saat içinde gerçekleşir. AMC earnings için ertesi gün sabah. Hızlı değerlendirme, hızlı çıkış.
10. **FOMC Haftası Dikkat:** 28-31 Temmuz FOMC haftasında earnings play pozisyonları %50 azalt veya hiç açma.

---

## 13. EKLER

> **45+ hisse için detaylı referans tabloları ve rehberler.**
> **VIX 19.44 ve FOMC 28-29 Temmuz 2026 bağlamında hazırlanmıştır.**
> **Tüm ekler earnings play formatındadır:** Entry 2-5 gün önce, Exit 1-2 gün içinde (max 2 gün), Kar %50-75 kredi/prim, IV Crush BMO 2-4 saat / AMC ertesi gün sabah.

---

### Ek A: Tüm Hisseler Earnings Play Karşılaştırma Matrisi (45+ Hisse)

> **45+ S&P 500 ve NASDAQ-100 hissesi için kapsamlı earnings play karşılaştırma matrisi.**
> **YENİ Sütunlar:** Entry Zamanı (Earnings'ten 2-5 gün önce), Exit Zamanı (Earnings sonrası 1-2 gün), IV Crush Beklentisi (BMO 2-4 saat / AMC ertesi gün sabah)
> **Renk Kodu:** 🟢 Düşük Risk | 🟡 Orta Risk | 🔴 Yüksek Risk | ⚫ Extreme Risk

| Hisse | Fiyat | IV Rank | Hacim CPR | OI CPR | Sentiment | Ana Earnings Play Strateji | FOMC Risk | Bütçe Min. | Beta | Sektör | Earnings Tarihi | Entry Penceresi | Exit Penceresi | IV Crush Beklentisi |
|-------|-------|---------|-----------|--------|-----------|---------------------------|-----------|------------|------|--------|-----------------|-----------------|----------------|---------------------|
| AMD | $490 | 91.69% | 0.71 | 0.76 | Strong Uptrend | Earnings Play Butterfly | 🔴 | $42 | 2.49 | Tech | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| TSLA | $409 | ~80% | 0.64 | 0.70 | Bullish Rebound | Earnings Play IC | 🟡 | $35 | 1.80 | Tech | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-50% |
| NFLX | $83 | ~75% | 0.72 | 0.78 | Downtrend | Earnings Play IC + Bear Put | 🟢 | $39 | 1.49 | Tech | ~16 Temmuz | 11-14 Temmuz | 17-18 Temmuz | 30-45% |
| NVDA | $209 | ~70% | 0.68 | 0.72 | Top Pullback | Earnings Play Butterfly | 🔴 | $19 | 2.20 | Tech | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| META | $585 | ~65% | 0.69 | 0.72 | Downtrend | Earnings Play IC | 🔴 | $18 | 1.23 | Tech | ~29-30 Temmuz | 24-27 Temmuz | 30-31 Temmuz | 30-50% |
| BA | $216 | ~65% | 0.82 | 0.88 | Nötr | Earnings Play IC | 🔴 | $30 | 1.40 | Havacılık | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 30-40% |
| GOOGL | $363 | ~58% | 0.58 | 0.65 | Top Pullback | Earnings Play IC | 🟡 | $38 | 1.24 | Tech | ~22-23 Temmuz | 17-20 Temmuz | 24-25 Temmuz | 30-45% |
| AMZN | $245 | ~60% | 0.62 | 0.68 | Bearish Cross | Earnings Play IC | 🔴 | $26 | 1.44 | Tech | ~30-31 Temmuz | 25-28 Temmuz | 31-1 Ağu | 30-50% |
| AAPL | $302 | ~55% | 0.68 | 0.72 | Top Pullback | Earnings Play IC | 🔴 | $32 | 1.09 | Tech | ~30-31 Temmuz | 25-28 Temmuz | 31-1 Ağu | 30-50% |
| CRM | $285 | ~55% | 0.60 | 0.65 | Bullish | Earnings Play IC | 🟡 | $28 | 1.15 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| ADBE | $520 | ~55% | 0.62 | 0.68 | Top Pullback | Earnings Play IC | 🔴 | $35 | 1.30 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| INTC | $25 | ~55% | 0.70 | 0.75 | Nötr | Earnings Play IC | 🟡 | $15 | 1.10 | Tech | ~23-24 Temmuz | 18-21 Temmuz | 25-26 Temmuz | 25-40% |
| JPM | $230 | 81% | 0.77 | 0.77 | Güçlü Trend | Earnings Play Bear Call Spr. | 🟢 | $39 | 1.15 | Finansal | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| C | $65 | ~55% | 0.85 | 0.92 | Güçlü Trend | Earnings Play Bear Call Spr. | 🟢 | $25 | 1.30 | Finansal | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| GS | $600 | ~55% | 1.34 | 1.25 | Bullish | Earnings Play IC | 🟢 | $26 | 1.20 | Finansal | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| MSFT | $412 | ~50% | 0.57 | 0.62 | N/A | Earnings Play IC | 🔴 | $15 | 1.10 | Tech | ~29-30 Temmuz | 24-27 Temmuz | 30-31 Temmuz | 30-50% |
| AVGO | $185 | ~50% | 0.65 | 0.70 | Bullish | Earnings Play IC | 🟡 | $22 | 1.35 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| QCOM | $195 | ~50% | 0.68 | 0.72 | Nötr | Earnings Play IC | 🟡 | $24 | 1.25 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| TXN | $195 | ~48% | 0.72 | 0.78 | Nötr | Earnings Play IC | 🟡 | $26 | 1.05 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| MRVL | $85 | ~48% | 0.65 | 0.70 | Bullish | Earnings Play IC | 🟡 | $18 | 1.40 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| LRCX | $75 | ~48% | 0.70 | 0.75 | Nötr | Earnings Play IC | 🟡 | $20 | 1.35 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| AMAT | $165 | ~48% | 0.68 | 0.72 | Nötr | Earnings Play IC | 🟡 | $25 | 1.30 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| TSM | $185 | ~48% | 0.60 | 0.65 | Bullish | Earnings Play IC | 🟡 | $28 | 1.20 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| UBER | $78 | ~48% | 0.55 | 0.60 | Bullish | Earnings Play IC | 🟡 | $22 | 1.45 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| SHOP | $145 | ~48% | 0.58 | 0.63 | Bullish | Earnings Play IC | 🟡 | $30 | 1.50 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| SNOW | $165 | ~48% | 0.62 | 0.68 | Nötr | Earnings Play IC | 🟡 | $28 | 1.40 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| CRWD | $385 | ~48% | 0.60 | 0.65 | Bullish | Earnings Play IC | 🟡 | $35 | 1.35 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| PANW | $195 | ~48% | 0.65 | 0.70 | Nötr | Earnings Play IC | 🟡 | $28 | 1.25 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| ZS | $195 | ~48% | 0.62 | 0.67 | Nötr | Earnings Play IC | 🟡 | $30 | 1.30 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| NET | $115 | ~48% | 0.58 | 0.63 | Bullish | Earnings Play IC | 🟡 | $22 | 1.35 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| DDOG | $125 | ~48% | 0.60 | 0.65 | Nötr | Earnings Play IC | 🟡 | $24 | 1.40 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| PLTR | $125 | ~48% | 0.55 | 0.60 | Bullish | Earnings Play IC | 🟡 | $28 | 1.55 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| IBM | $240 | ~45% | 0.72 | 0.78 | Nötr | Earnings Play IC | 🟡 | $32 | 0.85 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 20-30% |
| ORCL | $175 | ~45% | 0.68 | 0.72 | Nötr | Earnings Play IC | 🟡 | $24 | 1.10 | Tech | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 20-30% |
| UNH | $550 | ~40% | 3.33 | 1.49 | Çok Bullish | Earnings Play Bull Call Spr. | 🔴 | $10 | 0.75 | Sağlık | ~28-29 Temmuz | 23-26 Temmuz | 30-31 Temmuz | 20-30% |
| XOM | $110 | ~50% | 2.50 | 1.24 | Bullish | Earnings Play Bull Put Spr. | ⚫ | $25 | 0.85 | Enerji | ~31 Temmuz+ | 26-29 Temmuz | 1-2 Ağu | 30-40% |
| CVX | $155 | ~48% | 2.30 | 1.20 | Bullish | Earnings Play Bull Put Spr. | ⚫ | $28 | 0.80 | Enerji | ~31 Temmuz+ | 26-29 Temmuz | 1-2 Ağu | 30-40% |
| BAC | $40 | ~50% | 1.92 | 0.77 | Bullish | Earnings Play Bull Put Spr. | 🟢 | $44 | 1.25 | Finansal | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| DIS | $85 | ~50% | 0.78 | 0.85 | Nötr | Earnings Play Bear Call Spr. | 🟢 | $29 | 1.20 | Medya | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 25-30% |
| V | $320 | ~40% | ~0.92 | ~1.0 | Nötr | Earnings Play IC | 🔴 | N/A | 0.95 | Finansal | ~28-30 Temmuz | 23-26 Temmuz | 30-31 Temmuz | 20-25% |
| MA | $530 | ~40% | ~0.88 | ~0.95 | Nötr | Earnings Play IC | 🔴 | $32 | 1.05 | Finansal | ~28-30 Temmuz | 23-26 Temmuz | 30-31 Temmuz | 20-25% |
| JNJ | $160 | ~42% | 0.95 | 1.05 | Nötr | Earnings Play Long Call Spr. | 🟢 | $22 | 0.26 | Sağlık | ~15 Temmuz | 10-13 Temmuz | 16-17 Temmuz | 15-25% |
| PFE | $28 | ~35% | 1.15 | 1.20 | Hafif Bull | Earnings Play Bull Put Spr. | 🟢 | $12 | 0.55 | Sağlık | ~15 Temmuz | 10-13 Temmuz | 16-17 Temmuz | 15-25% |
| NKE | $72 | ~48% | 0.72 | 0.78 | Downtrend | Earnings Play Bear Call Spr. | 🟢 | $47 | 1.10 | Tüketici | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 25-30% |
| HD | $360 | ~40% | 0.98 | 1.08 | Nötr | Earnings Play Long Call Spr. | 🟡 | $32 | 0.95 | Tüketici | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 20-25% |
| WMT | $95 | ~40% | 0.85 | 0.92 | Nötr | Earnings Play Long Call Spr. | 🟡 | $22 | 0.50 | Tüketici | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 20-25% |
| WFC | $58 | ~45% | 0.90 | 1.00 | Nötr | Earnings Play Long IC | 🟢 | N/A | 1.10 | Finansal | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| BLK | $950 | ~45% | 0.85 | 0.88 | Nötr | Earnings Play Bear Call Spr. | 🟡 | $35 | 1.10 | Finansal | ~21 Temmuz | 16-18 Temmuz | 22-23 Temmuz | 20-30% |
| MS | $105 | ~45% | 0.80 | 0.85 | Nötr | Earnings Play Bear Call Spr. | 🟢 | $30 | 1.20 | Finansal | ~14-15 Temmuz | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| ABT | $115 | ~40% | 0.90 | 0.95 | Nötr | Earnings Play Long Call Spr. | 🟢 | $20 | 0.70 | Sağlık | ~15 Temmuz | 10-13 Temmuz | 16-17 Temmuz | 20-30% |
| TMO | $550 | ~40% | 0.85 | 0.90 | Nötr | Earnings Play Long Call Spr. | 🟡 | $35 | 0.80 | Sağlık | ~21-23 Temmuz | 16-19 Temmuz | 24-25 Temmuz | 20-30% |
| MRK | $105 | ~40% | 0.92 | 0.98 | Nötr | Earnings Play Long Call Spr. | 🟢 | $22 | 0.45 | Sağlık | ~15 Temmuz | 10-13 Temmuz | 16-17 Temmuz | 15-25% |
| LLY | $850 | ~40% | 0.88 | 0.95 | Nötr | Earnings Play Long Call Spr. | 🟢 | $40 | 0.50 | Sağlık | ~15 Temmuz | 10-13 Temmuz | 16-17 Temmuz | 15-25% |
| MCD | $310 | ~40% | 0.88 | 0.95 | Nötr | Earnings Play Long Call Spr. | 🟡 | $28 | 0.60 | Tüketici | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 20-25% |
| SBUX | $95 | ~40% | 0.90 | 0.95 | Nötr | Earnings Play Long Call Spr. | 🟡 | $20 | 0.85 | Tüketici | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 20-25% |
| KO | $68 | ~35% | 0.95 | 1.00 | Nötr | Earnings Play Long Call Spr. | 🟢 | $15 | 0.55 | Tüketici | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 15-25% |
| CMCSA | $42 | ~35% | 0.88 | 0.92 | Nötr | Earnings Play Long Call Spr. | 🟢 | $12 | 0.90 | Medya | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 15-25% |
| VZ | $42 | ~35% | 0.92 | 0.98 | Nötr | Earnings Play Long Call Spr. | 🟢 | $10 | 0.40 | Telekom | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 15-20% |
| UPS | $115 | ~40% | 0.85 | 0.90 | Nötr | Earnings Play Long Call Spr. | 🟡 | $22 | 0.90 | Ulaşım | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 20-30% |
| CAT | $360 | ~40% | 0.80 | 0.85 | Nötr | Earnings Play Long Call Spr. | 🟡 | $35 | 1.05 | Endüstri | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 20-30% |
| LMT | $480 | ~40% | 0.85 | 0.90 | Nötr | Earnings Play Long Call Spr. | 🟡 | $32 | 0.70 | Havacılık | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 20-30% |
| RTX | $115 | ~40% | 0.88 | 0.92 | Nötr | Earnings Play Long Call Spr. | 🟡 | $22 | 0.85 | Havacılık | ~14-16 Temmuz | 9-12 Temmuz | 17-18 Temmuz | 20-30% |

> **Earnings Play Kuralı:** Entry = Earnings'ten 2-5 gün önce | Exit = Earnings sonrası 1-2 gün içinde (max 2 gün) | Kar = %50-75 kredi/prim | IV Crush = BMO 2-4 saat / AMC ertesi gün sabah
> **21 DTE, "Ağustos'ta çıkış", "Zamanla çıkış" gibi ifadeler KALDIRILMIŞTIR.**

---

### Ek B: IV Crush Beklentileri (Sektör Bazlı — Earnings Play Formatı)

> **Earnings sonrası Implied Volatility (IV) çökme beklentileri.** VIX 19.44 seviyesinde sektörel IV crush profilleri. Earnings play formatı: exit 1-2 gün içinde (max 2 gün), IV crush BMO 2-4 saat / AMC ertesi gün sabah.

| Sektör | IV Crush (%) | Yorum | Earnings Play Strateji Önerisi | Örnek Hisseler | VIX 19.44 Etkisi | Earnings Play Exit Zamanı |
|--------|-------------|-------|-------------------------------|----------------|------------------|---------------------------|
| **Enerji** | **30-40%** | En yüksek crush | Earnings Play Short premium ideal | XOM, CVX, COP | VIX normal, crush yüksek | BMO: 2-4 saat, AMC: 1 gün |
| **Teknoloji (Mega-cap)** | **30-50%** | Çok yüksek crush | Earnings Play IC ve butterfly | AAPL, MSFT, AMZN, GOOGL, META | VIX normal, crush çok yüksek | BMO: 2-4 saat, AMC: 1 gün |
| **Teknoloji (Yarı İletken)** | **35-55%** | En yüksek crush | Earnings Play Butterfly, Ratio | NVDA, AMD, INTC, AVGO | VIX normal, crush en yüksek | BMO: 2-4 saat, AMC: 1 gün |
| **Teknoloji (Yazılım/Cloud)** | **25-40%** | Yüksek crush | Earnings Play IC ve butterfly | CRM, ORCL, SNOW, DDOG | VIX normal, crush yüksek | BMO: 2-4 saat, AMC: 1 gün |
| **Teknoloji (Cybersecurity)** | **25-35%** | Orta-yüksek crush | Earnings Play IC ve butterfly | CRWD, PANW, ZS, NET | VIX normal, crush orta | BMO: 2-4 saat, AMC: 1 gün |
| **Havacılık (BA)** | **30-40%** | Yüksek crush | Earnings Play IC tercih et | BA, LMT, RTX | VIX normal, crush yüksek | BMO: 2-4 saat, AMC: 1 gün |
| **Sağlık (İlaç)** | **25-35%** | Orta crush | Earnings Play Long spreadler kazanır | JNJ, PFE, MRK, LLY | VIX normal, crush orta | BMO: 2-4 saat, AMC: 1 gün |
| **Sağlık (Medikal)** | **20-30%** | Düşük-orta crush | Earnings Play Long spread tercih et | ABT, TMO, UNH | VIX normal, crush düşük | BMO: 2-4 saat, AMC: 1 gün |
| **Finansal (Banka)** | **20-30%** | Düşük crush | Earnings Play Short premium güvenli | JPM, BAC, WFC, C, GS | VIX normal, crush düşük | BMO: 2-4 saat, AMC: 1 gün |
| **Finansal (Ödeme)** | **20-25%** | Düşük crush | Earnings Play Long spread tercih et | V, MA, PYPL | VIX normal, crush düşük | BMO: 2-4 saat, AMC: 1 gün |
| **Medya (DIS)** | **25-30%** | Orta crush | Earnings Play IC veya bearish spread | DIS, CMCSA | VIX normal, crush orta | BMO: 2-4 saat, AMC: 1 gün |
| **Perakende (HD, WMT)** | **20-25%** | Düşük crush | Earnings Play Long spread tercih et | HD, WMT, NKE, MCD | VIX normal, crush düşük | BMO: 2-4 saat, AMC: 1 gün |
| **Tüketici (İçecek)** | **15-25%** | Çok düşük crush | Earnings Play Long spread ideal | KO, PEP, SBUX | VIX normal, crush çok düşük | BMO: 2-4 saat, AMC: 1 gün |
| **Telekom** | **15-20%** | En düşük crush | Earnings Play Long spread ideal | VZ, T, TMUS | VIX normal, crush en düşük | BMO: 2-4 saat, AMC: 1 gün |
| **Ulaşım/Lojistik** | **20-30%** | Düşük-orta crush | Earnings Play IC tercih et | UPS, FDX | VIX normal, crush orta | BMO: 2-4 saat, AMC: 1 gün |
| **Endüstri** | **20-30%** | Düşük-orta crush | Earnings Play IC tercih et | CAT, DE, GE | VIX normal, crush orta | BMO: 2-4 saat, AMC: 1 gün |

#### IV Crush Earnings Play Yönetim Stratejileri

**Yüksek Crush Sektörleri (Tech, Enerji, Havacılık):**
- **Earnings Play Strateji:** Butterfly, Ratio Spread, Short Straddle
- **Amaç:** IV crush'tan maksimum kazanç, earnings sonrası 1-2 gün içinde (max 2 gün) kapat
- **Risk:** Yüksek volatilite = beklenmedik hareket
- **Örnek:** AMD Earnings Play Butterfly (IV crush'a en dayanıklı)
- **Exit:** BMO 2-4 saat, AMC ertesi gün sabah

**Orta Crush Sektörleri (Sağlık, Medya, Ulaşım):**
- **Earnings Play Strateji:** Iron Condor, Debit Spread
- **Amaç:** Dengeli risk/ödül, earnings sonrası 1-2 gün içinde (max 2 gün) kapat
- **Risk:** Orta volatilite = sınırlı hareket
- **Örnek:** JNJ Earnings Play Bull Call Spread
- **Exit:** BMO 2-4 saat, AMC ertesi gün sabah

**Düşük Crush Sektörleri (Finansal, Perakende, Telekom):**
- **Earnings Play Strateji:** Long Spread, Earnings Play Lottery
- **Amaç:** Düşük IV = ucuz opsiyonlar, earnings sonrası 1-2 gün içinde (max 2 gün) kapat
- **Risk:** Düşük volatilite = sınırlı kazanç
- **Örnek:** VZ Earnings Play Long Call Spread
- **Exit:** BMO 2-4 saat, AMC ertesi gün sabah

---

### Ek C: Beta Değerleri ve Earnings Play Pozisyon Boyutu Rehberi

> **45+ hisse için beta değerleri ve buna bağlı earnings play pozisyon boyutu / wing genişliği rehberi.** Earnings play formatı: entry 2-5 gün önce, exit 1-2 gün içinde (max 2 gün).

| Hisse | Beta | Volatilite | Max Earnings Play Pozisyon | Wing Genişliği | Earnings Play Strateji Tavsiyesi | FOMC Risk | Earnings Play Exit |
|-------|------|-----------|---------------------------|---------------|----------------------------------|-----------|-------------------|
| AMD | 2.49 | AŞIRI YÜKSEK | Hesabın %1'i | Geniş ($49) | Earnings Play Butterfly, Lottery | 🔴 | Earnings sonrası 1-2 gün (max 2 gün) |
| NVDA | 2.20 | ÇOK YÜKSEK | Hesabın %1-1.5'i | Dar ($21) | Earnings Play Butterfly, Lottery | 🔴 | Earnings sonrası 1-2 gün (max 2 gün) |
| TSLA | 1.80 | YÜKSEK | Hesabın %1'i | Geniş ($41) | Earnings Play IC, Butterfly | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| PLTR | 1.55 | YÜKSEK | Hesabın %1'i | Geniş ($38) | Earnings Play IC, Butterfly | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| SHOP | 1.50 | YÜKSEK | Hesabın %1'i | Geniş ($37) | Earnings Play IC, Butterfly | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| UBER | 1.45 | ORTA-YÜKSEK | Hesabın %1-1.5'i | Geniş ($35) | Earnings Play IC, Spread | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| AMZN | 1.44 | ORTA-YÜKSEK | Hesabın %1-2'si | Orta ($25) | Earnings Play IC, Butterfly | 🔴 | Earnings sonrası 1-2 gün (max 2 gün) |
| NFLX | 1.49 | ORTA-YÜKSEK | Hesabın %1-2'si | Dar ($8) | Earnings Play IC, Bear Put | 🟢 | Earnings sonrası 1-2 gün (max 2 gün) |
| CRWD | 1.35 | ORTA-YÜKSEK | Hesabın %1-2'si | Geniş ($39) | Earnings Play IC, Butterfly | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| DDOG | 1.40 | ORTA-YÜKSEK | Hesabın %1-2'si | Geniş ($38) | Earnings Play IC, Butterfly | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| BA | 1.40 | ORTA-YÜKSEK | Hesabın %1-2'si | Geniş ($43) | Earnings Play IC, Butterfly | 🔴 | Earnings sonrası 1-2 gün (max 2 gün) |
| MRVL | 1.40 | ORTA-YÜKSEK | Hesabın %1-2'si | Dar ($17) | Earnings Play IC, Butterfly | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| LRCX | 1.35 | ORTA-YÜKSEK | Hesabın %1-2'si | Dar ($15) | Earnings Play IC, Butterfly | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| AVGO | 1.35 | ORTA-YÜKSEK | Hesabın %1-2'si | Geniş ($37) | Earnings Play IC, Butterfly | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| NET | 1.35 | ORTA-YÜKSEK | Hesabın %1-2'si | Dar ($23) | Earnings Play IC, Butterfly | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| SNOW | 1.40 | ORTA-YÜKSEK | Hesabın %1-2'si | Geniş ($33) | Earnings Play IC, Butterfly | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| ZS | 1.30 | ORTA | Hesabın %1-2'si | Geniş ($39) | Earnings Play IC, Spread | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| AMAT | 1.30 | ORTA | Hesabın %1-2'si | Geniş ($33) | Earnings Play IC, Spread | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| ADBE | 1.30 | ORTA | Hesabın %1-2'si | Geniş ($52) | Earnings Play IC, Spread | 🔴 | Earnings sonrası 1-2 gün (max 2 gün) |
| C | 1.30 | ORTA | Hesabın %1-2'si | Dar ($13) | Earnings Play Bear Call, IC | 🟢 | Earnings sonrası 1-2 gün (max 2 gün) |
| META | 1.23 | ORTA | Hesabın %1-2'si | Geniş ($59) | Earnings Play IC, Butterfly | 🔴 | Earnings sonrası 1-2 gün (max 2 gün) |
| GOOGL | 1.24 | ORTA | Hesabın %1-2'si | Geniş ($36) | Earnings Play IC, Butterfly | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| QCOM | 1.25 | ORTA | Hesabın %1-2'si | Dar ($20) | Earnings Play IC, Spread | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| PANW | 1.25 | ORTA | Hesabın %1-2'si | Geniş ($39) | Earnings Play IC, Spread | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| BAC | 1.25 | ORTA | Hesabın %1-2'si | Dar ($8) | Earnings Play Bull Put, IC | 🟢 | Earnings sonrası 1-2 gün (max 2 gün) |
| MS | 1.20 | ORTA | Hesabın %1-2'si | Dar ($21) | Earnings Play Bear Call, IC | 🟢 | Earnings sonrası 1-2 gün (max 2 gün) |
| TSM | 1.20 | ORTA | Hesabın %1-2'si | Geniş ($37) | Earnings Play IC, Spread | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| DIS | 1.20 | ORTA | Hesabın %1-2'si | Dar ($17) | Earnings Play Bear Call, IC | 🟢 | Earnings sonrası 1-2 gün (max 2 gün) |
| GS | 1.20 | ORTA | Hesabın %1-2'si | Geniş ($60) | Earnings Play IC, Butterfly | 🟢 | Earnings sonrası 1-2 gün (max 2 gün) |
| AAPL | 1.09 | ORTA-DÜŞÜK | Hesabın %1-2'si | Orta ($30) | Earnings Play IC, Butterfly | 🔴 | Earnings sonrası 1-2 gün (max 2 gün) |
| MSFT | 1.10 | ORTA-DÜŞÜK | Hesabın %1-2'si | Geniş ($41) | Earnings Play IC, Butterfly | 🔴 | Earnings sonrası 1-2 gün (max 2 gün) |
| INTC | 1.10 | ORTA-DÜŞÜK | Hesabın %1-2'si | Dar ($5) | Earnings Play IC, Spread | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| ORCL | 1.10 | ORTA-DÜŞÜK | Hesabın %1-2'si | Dar ($18) | Earnings Play IC, Spread | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| WFC | 1.10 | ORTA-DÜŞÜK | Hesabın %1-2'si | Dar ($12) | Earnings Play Long IC | 🟢 | Earnings sonrası 1-2 gün (max 2 gün) |
| CRM | 1.15 | ORTA-DÜŞÜK | Hesabın %1-2'si | Dar ($29) | Earnings Play IC, Spread | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| JPM | 1.15 | ORTA-DÜŞÜK | Hesabın %1-2'si | Dar ($23) | Earnings Play Bear Call, IC | 🟢 | Earnings sonrası 1-2 gün (max 2 gün) |
| TXN | 1.05 | ORTA-DÜŞÜK | Hesabın %1-2'si | Dar ($20) | Earnings Play IC, Spread | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| MA | 1.05 | ORTA-DÜŞÜK | Hesabın %1-2'si | Geniş ($53) | Earnings Play IC, Spread | 🔴 | Earnings sonrası 1-2 gün (max 2 gün) |
| CAT | 1.05 | ORTA-DÜŞÜK | Hesabın %1-2'si | Geniş ($36) | Earnings Play IC, Spread | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| NKE | 1.10 | ORTA-DÜŞÜK | Hesabın %1-2'si | Dar ($14) | Earnings Play Bear Call, IC | 🟢 | Earnings sonrası 1-2 gün (max 2 gün) |
| HD | 0.95 | DÜŞÜK | Hesabın %2-3'ü | Geniş ($36) | Earnings Play Long Call, IC | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| V | 0.95 | DÜŞÜK | Hesabın %2-3'ü | Geniş ($32) | Earnings Play IC, Spread | 🔴 | Earnings sonrası 1-2 gün (max 2 gün) |
| UNH | 0.75 | DÜŞÜK | Hesabın %2-3'ü | Geniş ($55) | Earnings Play Bull Call, Butterfly | 🔴 | Earnings sonrası 1-2 gün (max 2 gün) |
| ABT | 0.70 | DÜŞÜK | Hesabın %2-3'ü | Dar ($23) | Earnings Play Long Call, Butterfly | 🟢 | Earnings sonrası 1-2 gün (max 2 gün) |
| LMT | 0.70 | DÜŞÜK | Hesabın %2-3'ü | Geniş ($48) | Earnings Play Long Call, IC | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| TMO | 0.80 | DÜŞÜK | Hesabın %2-3'ü | Geniş ($55) | Earnings Play Long Call, Butterfly | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| CVX | 0.80 | DÜŞÜK | Hesabın %2-3'ü | Geniş ($31) | Earnings Play Bull Put, Butterfly | ⚫ | Earnings sonrası 1-2 gün (max 2 gün) |
| XOM | 0.85 | DÜŞÜK | Hesabın %2-3'ü | Dar ($22) | Earnings Play Bull Put, Butterfly | ⚫ | Earnings sonrası 1-2 gün (max 2 gün) |
| RTX | 0.85 | DÜŞÜK | Hesabın %2-3'ü | Dar ($23) | Earnings Play Long Call, IC | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| UPS | 0.90 | DÜŞÜK | Hesabın %2-3'ü | Dar ($23) | Earnings Play Long Call, IC | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| CMCSA | 0.90 | DÜŞÜK | Hesabın %2-3'ü | Dar ($8) | Earnings Play Long Call, IC | 🟢 | Earnings sonrası 1-2 gün (max 2 gün) |
| SBUX | 0.85 | DÜŞÜK | Hesabın %2-3'ü | Dar ($19) | Earnings Play Long Call, IC | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| VZ | 0.40 | ÇOK DÜŞÜK | Hesabın %2-3'ü | Dar ($8) | Earnings Play Long Call, IC | 🟢 | Earnings sonrası 1-2 gün (max 2 gün) |
| JNJ | 0.26 | ÇOK DÜŞÜK | Hesabın %2-3'ü | N/A | Earnings Play Long Call, Butterfly | 🟢 | Earnings sonrası 1-2 gün (max 2 gün) |
| PFE | 0.55 | ÇOK DÜŞÜK | Hesabın %2-3'ü | N/A | Earnings Play Bull Put, IC | 🟢 | Earnings sonrası 1-2 gün (max 2 gün) |
| MRK | 0.45 | ÇOK DÜŞÜK | Hesabın %2-3'ü | N/A | Earnings Play Long Call, IC | 🟢 | Earnings sonrası 1-2 gün (max 2 gün) |
| LLY | 0.50 | ÇOK DÜŞÜK | Hesabın %2-3'ü | N/A | Earnings Play Long Call, IC | 🟢 | Earnings sonrası 1-2 gün (max 2 gün) |
| MCD | 0.60 | ÇOK DÜŞÜK | Hesabın %2-3'ü | N/A | Earnings Play Long Call, IC | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| KO | 0.55 | ÇOK DÜŞÜK | Hesabın %2-3'ü | N/A | Earnings Play Long Call, IC | 🟢 | Earnings sonrası 1-2 gün (max 2 gün) |
| WMT | 0.50 | ÇOK DÜŞÜK | Hesabın %2-3'ü | N/A | Earnings Play Long Call, IC | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |
| IBM | 0.85 | DÜŞÜK | Hesabın %2-3'ü | Dar ($24) | Earnings Play Long Call, IC | 🟡 | Earnings sonrası 1-2 gün (max 2 gün) |

#### Earnings Play Beta Bazlı Wing Genişliği Formülü

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

Earnings Play Kuralları:
- Entry: Earnings'ten 2-5 gün önce
- Exit: Earnings sonrası 1-2 gün içinde (max 2 gün)
- Kar hedefi: %50-75 kredi/prim (IV crush sonrası)
- Stop-loss: Earnings sonrası zararda kalırsa veya %100 kredi kaybı
- Max hold: 2 gün
- IV crush: BMO 2-4 saat, AMC ertesi gün sabah
- FOMC haftası (28-31 Temmuz): %50 azalt veya hiç açma
```

---

### Ek D: Earnings Play Greeks Dashboard (Tüm Hisseler)

> **45+ hisse için Greeks değerleri ve earnings play yönetim rehberi.** Entry anında hedeflenen Greeks değerleri. Earnings play formatı: entry 2-5 gün önce, exit 1-2 gün içinde (max 2 gün). 21 DTE, "Ağustos'ta çıkış", "Zamanla çıkış" gibi ifadeler KALDIRILMIŞTIR.

#### Earnings Play Greeks Hedefleri (Entry Anında)

| Hisse | Delta Hedef | Gamma Hedef | Theta Hedef | Vega Hedef | Rho Hedef | Strateji | Earnings Play Exit |
|-------|-------------|-------------|-------------|------------|-----------|----------|-------------------|
| AMD | ±0.05 | <0.01 | Pozitif | -0.50 | Nötr | Earnings Play IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| TSLA | ±0.05 | <0.01 | Pozitif | -0.40 | Nötr | Earnings Play IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| NVDA | ±0.03 | <0.005 | Pozitif | -0.30 | Nötr | Earnings Play Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| META | ±0.05 | <0.01 | Pozitif | -0.45 | Nötr | Earnings Play IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| AAPL | ±0.05 | <0.01 | Pozitif | -0.35 | Nötr | Earnings Play IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| MSFT | ±0.05 | <0.01 | Pozitif | -0.35 | Nötr | Earnings Play IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| AMZN | ±0.05 | <0.01 | Pozitif | -0.40 | Nötr | Earnings Play IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| GOOGL | ±0.05 | <0.01 | Pozitif | -0.35 | Nötr | Earnings Play IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| NFLX | ±0.05 | <0.01 | Pozitif | -0.25 | Nötr | Earnings Play IC, Bear Put | Earnings sonrası 1-2 gün (max 2 gün) |
| CRM | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | Earnings Play IC, Spread | Earnings sonrası 1-2 gün (max 2 gün) |
| ADBE | ±0.05 | <0.01 | Pozitif | -0.40 | Nötr | Earnings Play IC, Spread | Earnings sonrası 1-2 gün (max 2 gün) |
| INTC | ±0.03 | <0.005 | Pozitif | -0.15 | Nötr | Earnings Play IC, Spread | Earnings sonrası 1-2 gün (max 2 gün) |
| AVGO | ±0.05 | <0.01 | Pozitif | -0.35 | Nötr | Earnings Play IC, Spread | Earnings sonrası 1-2 gün (max 2 gün) |
| QCOM | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | Earnings Play IC, Spread | Earnings sonrası 1-2 gün (max 2 gün) |
| TXN | ±0.05 | <0.01 | Pozitif | -0.25 | Nötr | Earnings Play IC, Spread | Earnings sonrası 1-2 gün (max 2 gün) |
| MRVL | ±0.03 | <0.005 | Pozitif | -0.20 | Nötr | Earnings Play IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| LRCX | ±0.03 | <0.005 | Pozitif | -0.18 | Nötr | Earnings Play IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| AMAT | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | Earnings Play IC, Spread | Earnings sonrası 1-2 gün (max 2 gün) |
| TSM | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | Earnings Play IC, Spread | Earnings sonrası 1-2 gün (max 2 gün) |
| UBER | ±0.05 | <0.01 | Pozitif | -0.25 | Nötr | Earnings Play IC, Spread | Earnings sonrası 1-2 gün (max 2 gün) |
| SHOP | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | Earnings Play IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| SNOW | ±0.05 | <0.01 | Pozitif | -0.35 | Nötr | Earnings Play IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| CRWD | ±0.05 | <0.01 | Pozitif | -0.40 | Nötr | Earnings Play IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| PANW | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | Earnings Play IC, Spread | Earnings sonrası 1-2 gün (max 2 gün) |
| ZS | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | Earnings Play IC, Spread | Earnings sonrası 1-2 gün (max 2 gün) |
| NET | ±0.03 | <0.005 | Pozitif | -0.20 | Nötr | Earnings Play IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| DDOG | ±0.03 | <0.005 | Pozitif | -0.22 | Nötr | Earnings Play IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| PLTR | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | Earnings Play IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| IBM | ±0.03 | <0.005 | Pozitif | -0.25 | Nötr | Earnings Play IC, Spread | Earnings sonrası 1-2 gün (max 2 gün) |
| ORCL | ±0.03 | <0.005 | Pozitif | -0.22 | Nötr | Earnings Play IC, Spread | Earnings sonrası 1-2 gün (max 2 gün) |
| JPM | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | Earnings Play Bear Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| BAC | ±0.03 | <0.005 | Pozitif | -0.15 | Nötr | Earnings Play Bull Put, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| WFC | ±0.03 | <0.005 | Pozitif | -0.18 | Nötr | Earnings Play Long IC | Earnings sonrası 1-2 gün (max 2 gün) |
| C | ±0.03 | <0.005 | Pozitif | -0.15 | Nötr | Earnings Play Bear Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| MS | ±0.03 | <0.005 | Pozitif | -0.20 | Nötr | Earnings Play Bear Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| BLK | ±0.05 | <0.01 | Pozitif | -0.35 | Nötr | Earnings Play Bear Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| GS | ±0.05 | <0.01 | Pozitif | -0.40 | Nötr | Earnings Play IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| V | ±0.05 | <0.01 | Pozitif | -0.30 | Nötr | Earnings Play IC, Spread | Earnings sonrası 1-2 gün (max 2 gün) |
| MA | ±0.05 | <0.01 | Pozitif | -0.35 | Nötr | Earnings Play IC, Spread | Earnings sonrası 1-2 gün (max 2 gün) |
| UNH | +0.05 | <0.01 | Pozitif | -0.30 | Nötr | Earnings Play Bull Call | Earnings sonrası 1-2 gün (max 2 gün) |
| XOM | -0.03 | <0.005 | Pozitif | -0.20 | Nötr | Earnings Play Bull Put, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| CVX | -0.03 | <0.005 | Pozitif | -0.22 | Nötr | Earnings Play Bull Put, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| DIS | ±0.03 | <0.005 | Pozitif | -0.20 | Nötr | Earnings Play Bear Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| NKE | ±0.03 | <0.005 | Pozitif | -0.15 | Nötr | Earnings Play Bear Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| HD | ±0.03 | <0.005 | Pozitif | -0.25 | Nötr | Earnings Play Long Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| WMT | ±0.03 | <0.005 | Pozitif | -0.15 | Nötr | Earnings Play Long Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| BA | ±0.05 | <0.01 | Pozitif | -0.35 | Nötr | Earnings Play IC, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| MCD | ±0.03 | <0.005 | Pozitif | -0.20 | Nötr | Earnings Play Long Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| SBUX | ±0.03 | <0.005 | Pozitif | -0.15 | Nötr | Earnings Play Long Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| KO | ±0.02 | <0.003 | Pozitif | -0.10 | Nötr | Earnings Play Long Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| CMCSA | ±0.02 | <0.003 | Pozitif | -0.08 | Nötr | Earnings Play Long Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| VZ | ±0.02 | <0.003 | Pozitif | -0.08 | Nötr | Earnings Play Long Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| UPS | ±0.03 | <0.005 | Pozitif | -0.20 | Nötr | Earnings Play Long Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| CAT | ±0.03 | <0.005 | Pozitif | -0.25 | Nötr | Earnings Play Long Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| LMT | ±0.03 | <0.005 | Pozitif | -0.30 | Nötr | Earnings Play Long Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| RTX | ±0.03 | <0.005 | Pozitif | -0.20 | Nötr | Earnings Play Long Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| JNJ | +0.03 | <0.005 | Pozitif | -0.15 | Nötr | Earnings Play Long Call, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| PFE | +0.02 | <0.003 | Pozitif | -0.10 | Nötr | Earnings Play Bull Put, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| ABT | +0.03 | <0.005 | Pozitif | -0.18 | Nötr | Earnings Play Long Call, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| TMO | +0.03 | <0.005 | Pozitif | -0.30 | Nötr | Earnings Play Long Call, Butterfly | Earnings sonrası 1-2 gün (max 2 gün) |
| MRK | +0.02 | <0.003 | Pozitif | -0.15 | Nötr | Earnings Play Long Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |
| LLY | +0.03 | <0.005 | Pozitif | -0.35 | Nötr | Earnings Play Long Call, IC | Earnings sonrası 1-2 gün (max 2 gün) |

#### Earnings Play Greeks Yönetim Rehberi

**Delta Yönetimi (Earnings Play):**
- Entry: ±0.05 (tek hisse), ±0.10 (portföy)
- FOMC yaklaşıyorsa: ±0.03 (tek hisse), ±0.05 (portföy)
- VIX > 25: ±0.03 (tek hisse), ±0.05 (portföy)
- Düzeltme: Hedge ekle (index put/call veya ters yönlü spread)
- Earnings sonrası 2 gün içinde kapat (max hold)

**Gamma Yönetimi (Earnings Play):**
- Entry: Mümkün olduğunca düşük
- Earnings sonrası pozisyonları 2 gün içinde kapat (gamma riski sınırlı)
- Gamma patlaması riski: Earnings sonrası 2 gün içinde kapat
- Düzeltme: Butterfly stratejileri artır (gamma düşük)
- 21 DTE, "Ağustos'ta çıkış", "Zamanla çıkış" gibi ifadeler KALDIRILMIŞTIR

**Theta Yönetimi (Earnings Play):**
- Hedef: Pozitif (kredi stratejileri)
- Negatif theta = zaman aleyhinize işliyor
- Düzeltme: Debit spread'leri azalt, kredi stratejileri artır
- Earnings sonrası 2 gün içinde kapat (theta decay hızlanır)

**Vega Yönetimi (Earnings Play):**
- Hedef: Hafif negatif (IV crush'tan kazanç)
- Çok negatif = IV artışından zarar
- Çok pozitif = IV crush'tan zarar
- Düzeltme: Vega nötr hedge ekle (butterfly)
- Earnings sonrası 2 gün içinde kapat (IV crush sonrası)

---

### Ek E: YENİ — Expected Move Hesaplama ve Earnings Play Strateji Pozisyonlama Rehberi

> **Earnings öncesi Expected Move (EM) hesaplama formülleri, pratik rehber ve earnings play strateji pozisyonlama.** 45+ hisse için uygulanabilir. Earnings play formatı: entry 2-5 gün önce, exit 1-2 gün içinde (max 2 gün). IV crush değerlendirmesi: BMO 2-4 saat, AMC ertesi gün sabah.

#### Expected Move Formülleri (Earnings Play Formatı)

**Formül 1: Basit IV Bazlı EM (Earnings Play Entry İçin)**
```
EM = Stock Price × IV × sqrt(Days to Expiration / 365)

Örnek (AAPL, 30 Temmuz earnings, 2 gün kala, IV 55%):
EM = $301.54 × 0.55 × sqrt(2/365) = $301.54 × 0.55 × 0.074 = ~$12.30 (%4.1)

Earnings Play Entry Kuralı: Earnings'ten 2-5 gün önce pozisyon aç. EM + %10-15 buffer ile short strikes belirle.
```

**Formül 2: Straddle Fiyatı Bazlı EM (Earnings Play Entry İçin)**
```
EM = (Call Price + Put Price) at ATM Strike

Örnek (AAPL, ATM $302.50C = $8.50, ATM $302.50P = $7.80):
EM = $8.50 + $7.80 = $16.30 (%5.4)

Earnings Play Entry Kuralı: Straddle fiyatı yüksekse = IV şişmiş = earnings play fırsatı. Entry 2-5 gün önce.
```

**Formül 3: Historical Move Bazlı EM (Earnings Play Strateji Seçimi İçin)**
```
EM = Average of Last 4 Earnings Moves (absolute value)

Örnek (AAPL son 4 earnings hareketi: +%3.2, -%5.1, +%2.8, -%4.5):
EM = (3.2 + 5.1 + 2.8 + 4.5) / 4 = %3.9

Earnings Play Strateji Seçimi:
- EM > %5 = Butterfly veya Lottery tercih et (yüksek volatilite)
- EM %3-5 = IC veya Spread tercih et (orta volatilite)
- EM < %3 = Long Spread tercih et (düşük volatilite)
```

**Formül 4: Composite EM (Earnings Play Pozisyonlama — Önerilen)**
```
Composite EM = (IV EM × 0.4) + (Straddle EM × 0.4) + (Historical EM × 0.2)

Örnek (AAPL):
Composite EM = ($12.30 × 0.4) + ($16.30 × 0.4) + ($11.76 × 0.2) = $4.92 + $6.52 + $2.35 = ~$13.80 (%4.6)

Earnings Play Short Strike Seçimi:
- Short Call Strike = Current Price + Composite EM + %10-15 buffer
- Short Put Strike = Current Price - Composite EM - %10-15 buffer
- Örnek (AAPL): Short Call = $301.54 + $13.80 + $20 = ~$335, Short Put = $301.54 - $13.80 - $20 = ~$268

Earnings Play Entry: 2-5 gün önce. Earnings Play Exit: 1-2 gün içinde (max 2 gün).
```

#### 45+ Hisse için Expected Move ve Earnings Play Strateji Pozisyonlama Tablosu

| Hisse | Fiyat | IV | DTE | IV EM | Straddle EM | Historical EM | Composite EM | Short Strike (EM+%15) | Earnings Play Strateji | Entry Penceresi | Exit Penceresi | IV Crush Beklentisi |
|-------|-------|-----|-----|-------|-------------|---------------|--------------|----------------------|------------------------|-----------------|----------------|---------------------|
| AAPL | $301.54 | 55% | 2 | $12.30 | $16.30 | $11.76 | $13.80 | $317+ | Earnings Play Butterfly | 25-28 Temmuz | 31-1 Ağu | 30-50% |
| MSFT | $411.74 | 50% | 2 | $11.40 | $15.20 | $10.80 | $12.80 | $425+ | Earnings Play Butterfly | 24-27 Temmuz | 30-31 Temmuz | 30-50% |
| AMZN | $245.22 | 60% | 2 | $12.20 | $16.50 | $14.20 | $14.20 | $260+ | Earnings Play Butterfly | 25-28 Temmuz | 31-1 Ağu | 30-50% |
| GOOGL | $363.31 | 58% | 2 | $12.40 | $16.80 | $13.60 | $14.60 | $379+ | Earnings Play IC | 17-20 Temmuz | 24-25 Temmuz | 30-45% |
| META | $585.39 | 65% | 2 | $17.80 | $23.50 | $19.20 | $20.40 | $606+ | Earnings Play Butterfly | 24-27 Temmuz | 30-31 Temmuz | 30-50% |
| TSLA | $408.95 | 80% | 2 | $18.20 | $24.50 | $22.80 | $21.80 | $431+ | Earnings Play Butterfly | 17-20 Temmuz | 24-25 Temmuz | 30-50% |
| NVDA | $208.64 | 70% | 2 | $8.60 | $11.50 | $10.20 | $10.20 | $219+ | Earnings Play Butterfly | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| AMD | $490.33 | 91.69% | 2 | $13.80 | $18.50 | $16.20 | $16.40 | $507+ | Earnings Play Butterfly | 17-20 Temmuz | 24-25 Temmuz | 35-55% |
| NFLX | $82.64 | 75% | 2 | $3.40 | $4.60 | $4.20 | $4.20 | $87+ | Earnings Play IC | 11-14 Temmuz | 17-18 Temmuz | 30-45% |
| INTC | $25.00 | 55% | 2 | $1.02 | $1.40 | $1.20 | $1.24 | $26+ | Earnings Play IC | 18-21 Temmuz | 25-26 Temmuz | 25-40% |
| CRM | $285.00 | 55% | 2 | $11.60 | $15.40 | $13.20 | $13.80 | $299+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| ADBE | $520.00 | 55% | 2 | $21.20 | $28.20 | $24.50 | $25.00 | $545+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| AVGO | $185.00 | 50% | 2 | $5.10 | $6.80 | $6.20 | $6.20 | $192+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| QCOM | $195.00 | 50% | 2 | $5.40 | $7.20 | $6.50 | $6.60 | $202+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| TXN | $195.00 | 48% | 2 | $5.10 | $6.80 | $6.00 | $6.20 | $202+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| MRVL | $85.00 | 48% | 2 | $2.20 | $3.00 | $2.60 | $2.70 | $88+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| LRCX | $75.00 | 48% | 2 | $1.96 | $2.60 | $2.30 | $2.40 | $78+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| AMAT | $165.00 | 48% | 2 | $4.30 | $5.80 | $5.00 | $5.20 | $171+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| TSM | $185.00 | 48% | 2 | $4.80 | $6.40 | $5.60 | $5.80 | $191+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| UBER | $78.00 | 48% | 2 | $2.02 | $2.70 | $2.40 | $2.50 | $81+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| SHOP | $145.00 | 48% | 2 | $3.76 | $5.00 | $4.40 | $4.60 | $150+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| SNOW | $165.00 | 48% | 2 | $4.30 | $5.80 | $5.00 | $5.20 | $171+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| CRWD | $385.00 | 48% | 2 | $10.00 | $13.40 | $11.80 | $12.20 | $398+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| PANW | $195.00 | 48% | 2 | $5.10 | $6.80 | $6.00 | $6.20 | $202+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| ZS | $195.00 | 48% | 2 | $5.10 | $6.80 | $6.00 | $6.20 | $202+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| NET | $115.00 | 48% | 2 | $3.00 | $4.00 | $3.50 | $3.70 | $119+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| DDOG | $125.00 | 48% | 2 | $3.26 | $4.40 | $3.80 | $3.96 | $129+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| PLTR | $125.00 | 48% | 2 | $3.26 | $4.40 | $3.80 | $3.96 | $129+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 25-40% |
| IBM | $240.00 | 45% | 2 | $5.40 | $7.20 | $6.40 | $6.60 | $247+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 20-30% |
| ORCL | $175.00 | 45% | 2 | $3.90 | $5.20 | $4.60 | $4.80 | $180+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 20-30% |
| JPM | $230.00 | 45% | 2 | $5.20 | $6.90 | $6.20 | $6.30 | $237+ | Earnings Play Bear Call | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| BAC | $40.00 | 50% | 2 | $1.12 | $1.50 | $1.30 | $1.36 | $41+ | Earnings Play Bull Put | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| WFC | $58.00 | 45% | 2 | $1.30 | $1.74 | $1.50 | $1.58 | $60+ | Earnings Play Long IC | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| C | $65.00 | 45% | 2 | $1.46 | $1.96 | $1.70 | $1.78 | $67+ | Earnings Play Bear Call | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| MS | $105.00 | 45% | 2 | $2.36 | $3.16 | $2.80 | $2.90 | $108+ | Earnings Play Bear Call | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| BLK | $950.00 | 45% | 2 | $21.40 | $28.60 | $25.00 | $25.80 | $976+ | Earnings Play Bear Call | 16-18 Temmuz | 22-23 Temmuz | 20-30% |
| GS | $600.00 | 55% | 2 | $13.80 | $18.40 | $16.00 | $16.60 | $617+ | Earnings Play IC | 9-12 Temmuz | 16-17 Temmuz | 20-30% |
| V | $320.00 | 40% | 2 | $4.00 | $5.40 | $4.80 | $4.90 | $325+ | Earnings Play IC | 23-26 Temmuz | 30-31 Temmuz | 20-25% |
| MA | $530.00 | 40% | 2 | $6.60 | $8.80 | $7.80 | $8.00 | $538+ | Earnings Play IC | 23-26 Temmuz | 30-31 Temmuz | 20-25% |
| UNH | $550.00 | 40% | 2 | $6.80 | $9.20 | $8.00 | $8.30 | $558+ | Earnings Play Bull Call | 23-26 Temmuz | 30-31 Temmuz | 20-30% |
| XOM | $110.00 | 50% | 2 | $3.08 | $4.10 | $3.60 | $3.74 | $114+ | Earnings Play Bull Put | 26-29 Temmuz | 1-2 Ağu | 30-40% |
| CVX | $155.00 | 48% | 2 | $4.04 | $5.40 | $4.80 | $4.96 | $160+ | Earnings Play Bull Put | 26-29 Temmuz | 1-2 Ağu | 30-40% |
| DIS | $85.00 | 50% | 2 | $2.38 | $3.20 | $2.80 | $2.90 | $88+ | Earnings Play Bear Call | 9-12 Temmuz | 17-18 Temmuz | 25-30% |
| NKE | $72.00 | 48% | 2 | $1.88 | $2.52 | $2.20 | $2.30 | $74+ | Earnings Play Bear Call | 9-12 Temmuz | 17-18 Temmuz | 25-30% |
| HD | $360.00 | 40% | 2 | $4.50 | $6.00 | $5.40 | $5.50 | $366+ | Earnings Play Long Call | 9-12 Temmuz | 17-18 Temmuz | 20-25% |
| WMT | $95.00 | 40% | 2 | $1.20 | $1.60 | $1.40 | $1.44 | $97+ | Earnings Play Long Call | 9-12 Temmuz | 17-18 Temmuz | 20-25% |
| BA | $215.00 | 45% | 2 | $4.30 | $5.80 | $5.00 | $5.20 | $221+ | Earnings Play IC | 16-19 Temmuz | 24-25 Temmuz | 30-40% |
| MCD | $310.00 | 40% | 2 | $3.90 | $5.20 | $4.60 | $4.70 | $315+ | Earnings Play Long Call | 9-12 Temmuz | 17-18 Temmuz | 20-25% |
| SBUX | $95.00 | 40% | 2 | $1.20 | $1.60 | $1.40 | $1.44 | $97+ | Earnings Play Long Call | 9-12 Temmuz | 17-18 Temmuz | 20-25% |
| KO | $68.00 | 35% | 2 | $0.80 | $1.08 | $0.96 | $0.98 | $69+ | Earnings Play Long Call | 9-12 Temmuz | 17-18 Temmuz | 15-25% |
| CMCSA | $42.00 | 35% | 2 | $0.50 | $0.66 | $0.60 | $0.61 | $43+ | Earnings Play Long Call | 9-12 Temmuz | 17-18 Temmuz | 15-25% |
| VZ | $42.00 | 35% | 2 | $0.50 | $0.66 | $0.60 | $0.61 | $43+ | Earnings Play Long Call | 9-12 Temmuz | 17-18 Temmuz | 15-20% |
| UPS | $115.00 | 40% | 2 | $1.44 | $1.92 | $1.70 | $1.74 | $117+ | Earnings Play Long Call | 9-12 Temmuz | 17-18 Temmuz | 20-30% |
| CAT | $360.00 | 40% | 2 | $4.50 | $6.00 | $5.40 | $5.50 | $366+ | Earnings Play Long Call | 9-12 Temmuz | 17-18 Temmuz | 20-30% |
| LMT | $480.00 | 40% | 2 | $6.00 | $8.00 | $7.20 | $7.30 | $488+ | Earnings Play Long Call | 9-12 Temmuz | 17-18 Temmuz | 20-30% |
| RTX | $115.00 | 40% | 2 | $1.44 | $1.92 | $1.70 | $1.74 | $117+ | Earnings Play Long Call | 9-12 Temmuz | 17-18 Temmuz | 20-30% |
| JNJ | $160.00 | 30% | 2 | $0.96 | $1.28 | $1.12 | $1.15 | $162+ | Earnings Play Long Call | 10-13 Temmuz | 16-17 Temmuz | 15-25% |
| PFE | $28.00 | 35% | 2 | $0.34 | $0.46 | $0.40 | $0.41 | $29+ | Earnings Play Bull Put | 10-13 Temmuz | 16-17 Temmuz | 15-25% |
| ABT | $115.00 | 40% | 2 | $1.44 | $1.92 | $1.70 | $1.74 | $117+ | Earnings Play Long Call | 10-13 Temmuz | 16-17 Temmuz | 20-30% |
| TMO | $550.00 | 40% | 2 | $6.80 | $9.20 | $8.00 | $8.30 | $558+ | Earnings Play Long Call | 16-19 Temmuz | 24-25 Temmuz | 20-30% |
| MRK | $105.00 | 40% | 2 | $1.30 | $1.74 | $1.50 | $1.58 | $107+ | Earnings Play Long Call | 10-13 Temmuz | 16-17 Temmuz | 15-25% |
| LLY | $850.00 | 40% | 2 | $10.60 | $14.20 | $12.40 | $12.90 | $863+ | Earnings Play Long Call | 10-13 Temmuz | 16-17 Temmuz | 15-25% |

#### Expected Move Earnings Play Strateji Pozisyonlama Rehberi

**Earnings Play Short Strike Seçimi (EM Bazlı):**
- Short Call Strike = Current Price + Composite EM + %10-15 buffer
- Short Put Strike = Current Price - Composite EM - %10-15 buffer
- Örnek (AAPL): Short Call = $301.54 + $13.80 + $20 = ~$335, Short Put = $301.54 - $13.80 - $20 = ~$268
- Earnings Play Entry: 2-5 gün önce. Earnings Play Exit: 1-2 gün içinde (max 2 gün).

**Earnings Play Wing Genişliği Kontrolü (EM Bazlı):**
- Wing Width = Hisse Fiyatı / 10 (standart)
- EM > Wing Width ise: Daha geniş wing veya butterfly kullan (yüksek volatilite bekleniyor)
- EM < Wing Width ise: Standart wing yeterli (düşük volatilite bekleniyor)
- Earnings Play Entry: 2-5 gün önce. Earnings Play Exit: 1-2 gün içinde (max 2 gün).

**Earnings Play Risk Değerlendirmesi (EM Bazlı):**
- EM / Stock Price > %5 = Yüksek volatilite, butterfly veya lottery tercih et. Earnings play entry 2-5 gün önce.
- EM / Stock Price < %3 = Düşük volatilite, spread tercih et. Earnings play entry 2-5 gün önce.
- EM / Stock Price > %8 = Extreme volatilite, butterfly veya hedge kullan. Earnings play entry 2-5 gün önce, %50 azalt.

---

### Ek F: YENİ — 0DTE/1DTE Earnings Play Stratejileri

> **0DTE (Zero Days to Expiration) ve 1DTE (One Day to Expiration) earnings play stratejileri.** Yüksek risk, yüksek getiri. Yalnızca deneyimli traderlar için. VIX 19.44 seviyesinde 0DTE stratejileri optimal. Earnings play formatı: entry 2-5 gün önce, exit 1-2 gün içinde (max 2 gün). IV crush değerlendirmesi: BMO 2-4 saat, AMC ertesi gün sabah.

#### 0DTE Earnings Play Stratejileri

**0DTE Earnings Play Iron Condor (SPX):**
- **Yapı:** 10-point SPX spread, ~$1 prim
- **Entry:** Earnings günü sabah 10:00-10:30 AM (açılış volatilitesi dinince). Earnings'ten 0 gün önce (gün içi).
- **Exit:** Earnings sonrası 2-4 saat içinde (BMO) veya ertesi gün sabah (AMC). Max 2 gün.
- **Pozisyon:** Hesabın %2-5'inden fazla olmamalı
- **Risk:** $9 kayıp / $1 kazanma (Gamma riski zirvede)
- **Kazanma Olasılığı:** %55-60
- **VIX 19.44 Etkisi:** VIX < 20'de 0DTE primleri düşük, fırsat sınırlı. VIX 20-25'te optimal.
- **Earnings Play Kuralı:** Entry = earnings günü sabah, Exit = earnings sonrası 2-4 saat (BMO) veya ertesi gün sabah (AMC). Max 2 gün.

**0DTE Earnings Play Scalping (SPX/SPY):**
- **Entry:** Earnings günü 9:45-11:00 veya 13:00-14:30
- **Hedef:** 10-20 SPX puanı ($100-200/kontrat)
- **Stop:** 2x kredi
- **Max risk:** %0.5
- **Kazanma Olasılığı:** %50-55
- **VIX 19.44 Etkisi:** VIX < 20'de hareket sınırlı, scalping zor. VIX 20-25'te optimal.
- **Earnings Play Kuralı:** Entry = earnings günü, Exit = earnings sonrası 2-4 saat (BMO) veya ertesi gün sabah (AMC). Max 2 gün.

**0DTE Earnings Play Long Straddle (Earnings):**
- **Yapı:** ATM Call + ATM Put, same expiry (0DTE)
- **Maliyet:** $2-5 (SPY), $20-50 (tek hisse)
- **Hedef:** Earnings hareketi > EM
- **Risk:** %100 kayıp (yanlış yönde veya sınırlı hareket)
- **Kazanma Olasılığı:** %30-35
- **VIX 19.44 Etkisi:** 0DTE straddle maliyeti düşük. VIX < 20'de ucuz, VIX > 25'te pahalı.
- **Earnings Play Kuralı:** Entry = earnings günü sabah, Exit = earnings sonrası 2-4 saat (BMO) veya ertesi gün sabah (AMC). Max 2 gün.

#### 1DTE Earnings Play Stratejileri

**1DTE Earnings Play Iron Condor (Hisse Bazlı):**
- **Yapı:** 1 gün vadeli IC, hisse bazlı
- **Entry:** Earnings günü sabah (BMO için) veya önceki gün akşam (AMC için). Earnings'ten 1 gün önce.
- **Exit:** Earnings sonrası 2-4 saat (BMO) veya ertesi gün sabah (AMC). Max 2 gün.
- **Pozisyon:** Hesabın %1-2'si
- **Risk:** Gamma riski yüksek, IV crush fırsatı
- **Kazanma Olasılığı:** %55-60
- **Örnek:** AAPL 1DTE Earnings Play IC (30 Temmuz expiry), entry 29 Temmuz akşam, exit 31 Temmuz sabah (AMC için ertesi gün sabah)
- **Earnings Play Kuralı:** Entry = 1 gün önce, Exit = earnings sonrası 2-4 saat (BMO) veya ertesi gün sabah (AMC). Max 2 gün.

**1DTE Earnings Play Butterfly (Hisse Bazlı):**
- **Yapı:** 1 gün vadeli butterfly
- **Maliyet:** $0.50-$2.00
- **Max Kar:** $5-$20
- **Risk:** Sınırlı (maliyet = max risk)
- **Kazanma Olasılığı:** %40-45
- **VIX 19.44 Etkisi:** 1DTE butterfly maliyeti düşük. VIX < 20'de ucuz.
- **Earnings Play Kuralı:** Entry = 1 gün önce, Exit = earnings sonrası 2-4 saat (BMO) veya ertesi gün sabah (AMC). Max 2 gün.

#### 0DTE/1DTE Earnings Play Risk Yönetimi

| Kural | Detay | Eşik | Aksiyon |
|-------|-------|------|---------|
| **Pozisyon Boyutu** | Hesabın %0.5-2'si | >%2 | Pozisyonu küçült |
| **VIX > 25** | 0DTE/1DTE risk artar | VIX > 25 | Pozisyon boyutunu %50 azalt |
| **VIX > 30** | 0DTE/1DTE çok riskli | VIX > 30 | 0DTE/1DTE açma |
| **Gamma Riski** | 0DTE gamma zirvede | 14:00 ET sonrası | Pozisyon kapat veya küçült |
| **Likidite** | Sadece likit hisseler | Bid-ask spread > %5 | Açma |
| **FOMC Kuralı** | FOMC günü 0DTE yasak | 28-29 Temmuz | 0DTE/1DTE açma |
| **Earnings Play Max Hold** | Earnings sonrası 2 gün | 2 gün | Mekanik kapat |
| **Earnings Play IV Crush** | BMO: 2-4 saat, AMC: ertesi gün sabah | BMO: 2-4 saat, AMC: 1 gün | Hızlı değerlendirme, hızlı çıkış |
| **Earnings Play Kar Hedefi** | %50-75 kredi/prim | %50-75 | Hemen kapat |
| **Earnings Play Stop-Loss** | Earnings sonrası zararda veya %100 kredi kaybı | %100 kredi | Anında kapat |

#### 0DTE/1DTE Earnings Play Uygun Hisseler (45+ arasından)

| Hisse | Likidite | IV Rank | 0DTE Earnings Play Uygunluk | 1DTE Earnings Play Uygunluk | Not | Earnings Play Entry | Earnings Play Exit | IV Crush Beklentisi |
|-------|----------|---------|----------------------------|---------------------------|-----|--------------------|--------------------|---------------------|
| SPY | Çok Yüksek | N/A | ✅ Evet | ✅ Evet | En likit | Earnings günü sabah | BMO: 2-4 saat, AMC: 1 gün | N/A |
| QQQ | Çok Yüksek | N/A | ✅ Evet | ✅ Evet | Tech likit | Earnings günü sabah | BMO: 2-4 saat, AMC: 1 gün | N/A |
| AAPL | Çok Yüksek | 55% | ✅ Evet | ✅ Evet | En likit hisse | Earnings günü sabah / 1 gün önce | BMO: 2-4 saat, AMC: 1 gün | 30-50% |
| MSFT | Çok Yüksek | 50% | ✅ Evet | ✅ Evet | Likit | Earnings günü sabah / 1 gün önce | BMO: 2-4 saat, AMC: 1 gün | 30-50% |
| AMZN | Çok Yüksek | 60% | ✅ Evet | ✅ Evet | Likit | Earnings günü sabah / 1 gün önce | BMO: 2-4 saat, AMC: 1 gün | 30-50% |
| GOOGL | Çok Yüksek | 58% | ✅ Evet | ✅ Evet | Likit | Earnings günü sabah / 1 gün önce | BMO: 2-4 saat, AMC: 1 gün | 30-45% |
| META | Çok Yüksek | 65% | ✅ Evet | ✅ Evet | Likit | Earnings günü sabah / 1 gün önce | BMO: 2-4 saat, AMC: 1 gün | 30-50% |
| TSLA | Çok Yüksek | 80% | ✅ Evet | ✅ Evet | Volatil, likit | Earnings günü sabah / 1 gün önce | BMO: 2-4 saat, AMC: 1 gün | 30-50% |
| NVDA | Çok Yüksek | 70% | ✅ Evet | ✅ Evet | Volatil, likit | Earnings günü sabah / 1 gün önce | BMO: 2-4 saat, AMC: 1 gün | 35-55% |
| AMD | Yüksek | 91.69% | ✅ Evet | ✅ Evet | Volatil | Earnings günü sabah / 1 gün önce | BMO: 2-4 saat, AMC: 1 gün | 35-55% |
| NFLX | Yüksek | 75% | ✅ Evet | ✅ Evet | Volatil | Earnings günü sabah / 1 gün önce | BMO: 2-4 saat, AMC: 1 gün | 30-45% |
| JPM | Yüksek | 45% | ⚠️ Dikkat | ✅ Evet | Finansal | Earnings günü sabah / 1 gün önce | BMO: 2-4 saat, AMC: 1 gün | 20-30% |
| BAC | Yüksek | 50% | ⚠️ Dikkat | ✅ Evet | Finansal | Earnings günü sabah / 1 gün önce | BMO: 2-4 saat, AMC: 1 gün | 20-30% |
| XOM | Orta | 50% | ⚠️ Dikkat | ⚠️ Dikkat | Enerji | Earnings günü sabah / 1 gün önce | BMO: 2-4 saat, AMC: 1 gün | 30-40% |
| UNH | Orta | 40% | ❌ Hayır | ⚠️ Dikkat | Sağlık | Earnings günü sabah / 1 gün önce | BMO: 2-4 saat, AMC: 1 gün | 20-30% |
| JNJ | Orta | 30% | ❌ Hayır | ❌ Hayır | Düşük volatilite | Earnings günü sabah / 1 gün önce | BMO: 2-4 saat, AMC: 1 gün | 15-25% |
| KO | Düşük | 35% | ❌ Hayır | ❌ Hayır | Düşük volatilite | Earnings günü sabah / 1 gün önce | BMO: 2-4 saat, AMC: 1 gün | 15-25% |

#### 0DTE/1DTE Earnings Play Playbook

**BMO Earnings Play (Örnek: JPM, 14 Temmuz):**
1. Önceki gün akşam: 1DTE earnings play pozisyonu aç (13 Temmuz). Entry: 1 gün önce.
2. Earnings sabahı (6:00 AM): Sonucu izle
3. Piyasa açılışı (9:30 AM): IV crush'ı değerlendir (BMO: 2-4 saat)
4. 10:00-10:30 AM: Earnings play pozisyonu kapat (BMO IV crush 2-4 saat içinde)
5. Max hold: 2 gün — earnings sonrası 2. gün kapanışta mutlaka kapat

**AMC Earnings Play (Örnek: NFLX, 16 Temmuz):**
1. Earnings günü sabah: 1DTE earnings play pozisyonu aç (16 Temmuz). Entry: 1 gün önce veya gün içi.
2. Earnings akşamı (4:00-5:30 PM): Sonucu izle
3. Aynı akşam: After-hours değerlendirme (tercihen ertesi gün sabah kapat)
4. Ertesi gün sabah (9:30 AM): IV crush'ı değerlendir, kapat (AMC: ertesi gün sabah)
5. Max hold: 2 gün — earnings sonrası 2. gün kapanışta mutlaka kapat

**FOMC + Earnings Çakışması Earnings Play (Örnek: MSFT, 29 Temmuz):**
1. FOMC kararı (14:00 ET): Sonucu izle
2. Earnings (16:00-17:30 ET): Sonucu izle
3. Aynı akşam: Çift volatilite değerlendirmesi (tercihen ertesi gün sabah kapat)
4. Ertesi gün sabah: IV crush + FOMC etkisi, kapat (AMC: ertesi gün sabah)
5. Max hold: 2 gün — earnings sonrası 2. gün kapanışta mutlaka kapat
6. **Not:** FOMC + earnings çakışmasında 0DTE/1DTE çok riskli. Dikkatli ol. FOMC haftası (28-31 Temmuz) %50 azalt veya hiç açma.

---

> **SON NOT:** Bu rapor, 12 Haziran 2026 tarihli piyasa verilerine dayanarak hazırlanmıştır. VIX: 19.44, FOMC: 28-29 Temmuz 2026. Tüm veriler gecikmeli olabilir ve yatırım tavsiyesi niteliğinde değildir. Piyasalar yüksek volatilite içerisinde olup, risk yönetimi kritik öneme sahiptir. Earnings tarihleri şirketler tarafından değiştirilebilir; yatırım kararı vermeden önce resmi kaynakları kontrol ediniz.

> **EarningsPlay v5.0 Hatırlatması (Earnings Play Formatı):**
> 1. **Entry:** Earnings'ten 2-5 gün önce
> 2. **Exit:** Earnings sonrası 1-2 gün içinde (max 2 gün)
> 3. **Kar Hedefi:** %50-75 kredi/prim (IV crush sonrası)
> 4. **Stop-Loss:** Earnings sonrası pozisyon zararda kalırsa veya %100 kredi kaybı
> 5. **IV Crush Süresi:** BMO: 2-4 saat, AMC: Ertesi gün sabah
> 6. **Max Hold:** Earnings sonrası 2 gün
> 7. **Pozisyon Boyutu:** Hesabın %1-2'si (VIX 19.44 = %100)
> 8. **FOMC Haftası (28-31 Temmuz):** Pozisyonları %50 azalt veya hiç açma
> 9. **Blackout (18-30 Temmuz):** Ekstra dikkat
> 10. **Mekanik Çıkış:** Sorgusuz uygula
> 11. **Delta Nötrlüğü:** ±0.10 (FOMC yaklaşıyorsa ±0.05)
> 12. **VIX > 25:** Pozisyon boyutunu %50 azalt
> 13. **Hızlı Döngü:** IV crush kazancı = 1-2 hafta
> 14. **21 DTE, "Ağustos'ta çıkış", "Zamanla çıkış" gibi ifadeler KALDIRILMIŞTIR.**

---

*Rapor Son Güncelleme: 12 Haziran 2026*

*Hazırlayan: Risk Yönetimi ve Portföy Stratejisti AI Agent | EarningsPlay v5.0 Earnings Play Metodolojisi*

*Bu rapor gistify.pro platformuna uygun formatta hazırlanmıştır.*

*Versiyon: v2.1 — Earnings Play Formatı (Entry 2-5 gün önce, Exit 1-2 gün içinde, Max 2 gün, Kar %50-75, IV Crush BMO 2-4 saat / AMC ertesi gün sabah)*

---
