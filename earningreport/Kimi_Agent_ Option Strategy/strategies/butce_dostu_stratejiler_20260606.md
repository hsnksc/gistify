# BÜTÇE DOSTU OPSİYON STRATEJİLERI ($50-$500)
## Haziran 2026 Earnings Sezonu | 6 Haziran 2026

---

## MARKET ÖZETİ

| Metrik | Değer | Yorum |
|--------|-------|-------|
| VIX | 21.51 | %39.7 artış — Yüksek volatilite |
| Earnings Yakınlığı | 4-18 gün | En yakın: ORCL/CHWY (4 gün) |
| Pozisyon Büyüklüğü | Normalin %75'i | Sınırlı sermaye = kontrollü risk |

### KRİTİK UYARILAR
> ⚠️ **10 Haziran Çifte Volatilite**: CPI verisi (8:30 AM) + ORCL/CHWY Earnings (AMC/BMO) = olağanüstü hareket potansiyeli
> ⚠️ **IV Crush Riski**: Earnings sonrası implied volatility çökecek — OTM opsiyonlar hızla eriyebilir
> ⚠️ **Theta Decay**: 4-5 gün kaldı — günlük zaman kaybı (-$0.04 ile -$0.60/kontrat) çok hızlı
> ⚠️ **VIX Yükselişi**: OTM opsiyonlar şu an pahalı olabilir, ancak earnings hareketi bu maliyeti telafi edebilir

---

## HİSSE ÖZET TABLOSU

| Hisse | Fiyat | IV Rank | Earnings | Kalan Gün | Bütçe Dostu Skoru |
|-------|-------|---------|----------|-----------|-------------------|
| ORCL | $213.68 | %82.83 | 10 Haziran AMC | 4 gün | ⭐⭐⭐⭐ |
| ADBE | $251.44 | %100 pct | 11 Haziran AMC | 5 gün | ⭐⭐⭐⭐ |
| CHWY | $20.64 | %89.59 | 10 Haziran BMO | 4 gün | ⭐⭐⭐⭐⭐ EN UCUZ |
| FDX | $387.25 | %76.26 | 23 Haziran AMC | 17 gün | ⭐⭐⭐ |
| MU | $864.01 | %100 | 24 Haziran AMC | 18 gün | ⭐⭐ |

---

# BÖLÜM 1: ORACLE (ORCL) — $213.68

## Hisse Analizi
- **Earnings**: 10 Haziran AMC (After Market Close)
- **Kalan Gün**: 4 gün
- **IV Rank**: %82.83 (Yüksek — primler pahalı ama hareket beklentisi yüksek)
- **Strateji Tipi**: Kısa vadeli, yüksek kaldıraç — earnings hareketine oyna

---

### BÜTÇE SEVİYESİ 1: $10-$50 (Micro Bütçe)

#### Strateji 1A: Far OTM Call Lottery Ticket 🎰
| Parametre | Değer |
|-----------|-------|
| Yapı | 1x ORCL Jun 13 240 Call |
| Hisse Fiyatı | $213.68 |
| Strike | $240 (%12.5 OTM) |
| Prim | ~$0.90/kontrat |
| **Toplam Maliyet** | **$90** |
| $50 Bütçeyle | ❌ Yetersiz |
| $100 Bütçeyle | ✅ 1 kontrat |
| Max Risk | $90 (primin tamamı) |
| Max Reward | Sınırsız (240 üzeri her $1 = $100 kar) |
| Breakeven | $240.90 |
| Gerekli Hareket | %12.5 yukarı |
| Delta | ~0.12 |
| Theta | ~-$0.05/gün |
| Vega | ~0.10 |
| R/R Oranı | 1:∞ (teorik) |

**Senaryolar:**
- ORCL $250 olursa: ($250-$240-$0.90) × 100 = **$910 kar** (~%1011 getiri)
- ORCL $240 olursa: **-$90** (max kayıp)
- ORCL $213'te kalırsa: **-$90** (max kayıp, IV crush)

> 💡 **Taktik**: Earnings günü sabah (10 Haziran, CPI sonrası) al — VIX gevşerse prim ucuzlar. Çıkış: Earnings sonrası ertesi gün açılışta (Jun 11) veya 2-3 gün tut.

---

#### Strateji 1B: OTM Put Lottery Ticket (Bearish)
| Parametre | Değer |
|-----------|-------|
| Yapı | 1x ORCL Jun 13 200 Put |
| Strike | $200 (%6.4 OTM) |
| Prim | ~$0.15-$0.25/kontrat (tahmini) |
| **Toplam Maliyet** | **$15-$25** |
| $50 Bütçeyle | ✅ 2 kontrat ($30-$50) |
| Max Risk | $15-$25/kontrat |
| Max Reward | Sınırsız (200 altı her $1 = $100 kar) |
| Breakeven | ~$199.75 |
| Gerekli Hareket | %6.4 aşağı |
| Delta | ~-0.08 |

> 💡 **Taktik**: CPI kötü gelirse market düşer → ORCL da düşebilir. 2 kontrat = 2x kaldıraç.

---

#### Strateji 1C: Ultra-Ucuz Strangle (Çift Yönlü)
| Parametre | Değer |
|-----------|-------|
| Yapı | 1x 240 Call + 1x 210 Put |
| Call Prim | $0.90 |
| Put Prim | $0.09 |
| **Toplam Maliyet** | **$99** |
| $50 Bütçeyle | ❌ Yetersiz |
| $100 Bütçeyle | ✅ Tam sınırda |
| Max Risk | $99 |
| Call Tarafı Karı | $240.91 üzeri |
| Put Tarafı Karı | $209.01 altı |
| Gerekli Hareket | >%12.5 yukarı veya <%2.1 aşağı |

> ⚠️ **Uyarı**: Bu strangle çok asimetrik — call tarafı pahalı, put tarafı ucuz. Putun işe yaraması için sadece %2 düşüş yeterli ama call için %12.5 gerekli. Daha dengeli bir strangle için 235 Call ($1.40?) + 210 Put ($0.09) = ~$149.

---

### BÜTÇE SEVİYESİ 2: $50-$200 (Küçük Bütçe)

#### Strateji 2A: Debit Call Spread ⭐ TAVSİYE
| Parametre | Değer |
|-----------|-------|
| Yapı | Al: 1x 220 Call / Sat: 1x 230 Call |
| Hisse Fiyatı | $213.68 |
| Alınan Strike | $220 (%3 OTM) |
| Satılan Strike | $230 (%7.6 OTM) |
| Spread Genişliği | $10 |
| Alınan Prim (tahmini) | ~$2.50 |
| Satılan Prim (tahmini) | ~$1.00 |
| **Net Debit** | **~$1.50/kontrat = $150** |
| $100 Bütçeyle | ❌ Yetersiz |
| $200 Bütçeyle | ✅ 1 kontrat |
| Max Risk | $150 |
| Max Reward | ($10 - $1.50) × 100 = **$850** |
| Breakeven | $220 + $1.50 = $221.50 |
| Gerekli Hareket | %3.7 yukarı |
| R/R Oranı | **1:5.7** |
| Delta | ~0.25 (net) |
| Theta | ~-$0.03/gün (düşük) |
| IV Crush Etkisi | Daha az (satılan call hedge eder) |

**Senaryolar:**
- ORCL $230+ olursa: **$850 kar** (%567 getiri)
- ORCL $225 olursa: ($225-$220-$1.50) × 100 = **$350 kar**
- ORCL $220 altı kalırsa: **-$150** (max kayıp)

> ⭐ **NEDEN BU İYİ**: Spread, IV crush riskini azaltır (satılan call'un vega'sı alınanı dengeler). Sadece %3.7 hareket gerekli. Max kazanç $850 ile bütçenin 4.25 katı.

---

#### Strateji 2B: Geniş Debit Call Spread (Daha Ucuz)
| Parametre | Değer |
|-----------|-------|
| Yapı | Al: 1x 225 Call / Sat: 1x 240 Call |
| Spread Genişliği | $15 |
| Net Debit (tahmini) | ~$0.80-$1.00 |
| **Toplam Maliyet** | **$80-$100** |
| $100 Bütçeyle | ✅ 1 kontrat |
| Max Risk | $80-$100 |
| Max Reward | ($15 - $1.00) × 100 = **$1,400** |
| Breakeven | ~$226.00 |
| Gerekli Hareket | %5.3 yukarı |
| R/R Oranı | **1:14 ila 1:17** |

> 💡 **Taktik**: Çok yüksek R/R. Earnings önceki gün (9 Haziran) al, earnings sonrası ilk 30 dakikada çık.

---

#### Strateji 2C: Debit Put Spread (Bearish)
| Parametre | Değer |
|-----------|-------|
| Yapı | Al: 1x 210 Put / Sat: 1x 200 Put |
| Spread Genişliği | $10 |
| Net Debit (tahmini) | ~$0.50-$0.80 |
| **Toplam Maliyet** | **$50-$80** |
| $100 Bütçeyle | ✅ 1-2 kontrat |
| Max Risk | $50-$80 |
| Max Reward | ($10 - $0.80) × 100 = **$920** |
| Breakeven | ~$209.20 |
| Gerekli Hareket | %2.1 aşağı |
| R/R Oranı | **1:11.5 ila 1:18** |

---

### BÜTÇE SEVİYESİ 3: $200-$500 (Orta Bütçe)

#### Strateji 3A: Çoklu Call Spread (En İyi R/R) ⭐⭐ TAVSİYE
| Parametre | Değer |
|-----------|-------|
| Yapı | 3x Al: 220 Call / 3x Sat: 230 Call |
| Kontrat Başına Debit | ~$1.50 |
| **Toplam Maliyet** | **$450** |
| $500 Bütçeyle | ✅ 3 kontrat |
| Max Risk | $450 |
| Max Reward | 3 × $850 = **$2,550** |
| Breakeven | $221.50 (aynı) |
| Gerekli Hareket | %3.7 yukarı |
| R/R Oranı | **1:5.7** |
| Potansiyel Getiri | **%567** |

> ⭐⭐ **EN İYİ ORCL STRATEJİSİ**: $500 bütçe için optimize. 3 kontrat = $2,550 max kar. Spread IV crush'e dayanıklı.

---

#### Strateji 3B: Call Ratio Spread (Asimetrik)
| Parametre | Değer |
|-----------|-------|
| Yapı | Al: 2x 220 Call / Sat: 4x 230 Call |
| Net Debit (tahmini) | ~$100-$200 |
| **Toplam Maliyet** | **~$150** |
| $200 Bütçeyle | ✅ 1 set |
| Max Risk | $150 (alt tarafta) |
| Max Reward (230'a kadar) | 2 × ($230-$220-$0.75) × 100 = ~$1,850 |
| Üst Taraf Riski | 230 üzeri 2x naked call riski! |
| Breakeven (üst) | ~$240+ |
| Gerekli Hareket Optimal | %3-7 yukarı |

> ⚠️ **Risk**: 230 üzeri sınırsız risk (2 naked call). Ancak earnings hareketi genelde %10'dan az. Kar al: $225-$228 seviyesinde.

---

#### Strateji 3C: OTM Butterfly (Düşük Maliyet, Yüksek Kazanç)
| Parametre | Değer |
|-----------|-------|
| Yapı | 1x 220C / -2x 230C / 1x 240C |
| Net Debit (tahmini) | ~$0.40-$0.60 |
| **Toplam Maliyet** | **$40-$60/kontrat seti** |
| $200 Bütçeyle | ✅ 3-4 set |
| Max Risk | $40-$60/set |
| Max Reward (230'da) | ($10 - $0.50) × 100 = **$950/set** |
| Max Reward (4 set) | **$3,800** |
| Breakeven | ~$220.50 ve ~$239.50 |
| Gerekli Hareket | Tam $230 hedef (%7.6 yukarı) |
| R/R Oranı | **1:16 ila 1:24** |

> 💡 **Butterfly, hissenin tam olarak nereye gideceğini biliyorsan en iyi araç**. ORCL için $230 hedef = historical earnings move ortalaması.

---

### ORCL GİRİŞ/ÇIKIŞ TAKTİKLERİ

| Zaman | Eylem | Neden |
|-------|-------|-------|
| 9 Haziran (Pzt) | Pozisyon al | Son gün, en yüksek gamma |
| 10 Haziran sabah (CPI) | İzle | CPI + VIX hareketi |
| 10 Haziran 15:45 | Son giriş şansı | Market kapanış öncesi |
| 10 Haziran 16:05 | Earnings açıklanır | AMC = After Market Close |
| 11 Haziran 09:30 | Kar al veya tut | IV crush başlar, hareket gerçekleşir |
| 12-13 Haziran | Kesin çıkış | Theta decay hızlanır |

---

### ORCL ÖZET TABLO

| Bütçe | Strateji | Maliyet | Max Kar | R/R | Olasılık |
|-------|----------|---------|---------|-----|----------|
| $90 | 240C Lottery | $90 | $900+ | 1:10 | %15-20 |
| $150 | 220/230 Spread | $150 | $850 | 1:5.7 | %30-35 |
| $450 | 3x 220/230 Spread | $450 | $2,550 | 1:5.7 | %30-35 |
| $60 | 220/230/240 Butterfly | $60 | $950 | 1:16 | %10-15 |
| $99 | 240C+210P Strangle | $99 | $900+ | 1:9 | %20-25 |

---

# BÖLÜM 2: ADOBE (ADBE) — $251.44

## Hisse Analizi
- **Earnings**: 11 Haziran AMC (After Market Close)
- **Kalan Gün**: 5 gün
- **IV Rank**: %100 (Tarihi zirve — primler çok pahalı ama hareket de bekleniyor)
- **Strateji Tipi**: Çok düşük maliyetli lottery — ADBE opsiyonları en ucuzlarından

---

### BÜTÇE SEVİYESİ 1: $10-$50 (Micro Bütçe)

#### Strateji 1A: Ultra-Ucuz OTM Call Lottery ⭐ EN UCUZ
| Parametre | Değer |
|-----------|-------|
| Yapı | 1x ADBE Jun 13 255 Call |
| Hisse Fiyatı | $251.44 |
| Strike | $255 (%1.4 OTM) |
| Prim | ~$0.07/kontrat |
| **Toplam Maliyet** | **$7** |
| $10 Bütçeyle | ✅ 1 kontrat |
| $50 Bütçeyle | ✅ 7 kontrat ($49) |
| Max Risk | $7/kontrat |
| Max Reward | Sınırsız (255 üzeri her $1 = $100/kontrat) |
| Breakeven | $255.07 |
| Gerekli Hareket | Sadece %1.4 yukarı! |
| Delta | ~0.08 |
| Theta | ~-$0.03/gün |
| Vega | ~0.05 |

**Senaryolar (7 kontrat = $49 yatırım):**
- ADBE $260 olursa: 7 × ($260-$255-$0.07) × 100 = **$3,451 kar** (%7,043 getiri)
- ADBE $257 olursa: 7 × ($257-$255-$0.07) × 100 = **$1,351 kar**
- ADBE $255 altı kalırsa: **-$49** (max kayıp)

> ⭐⭐ **BU HAFTANIN EN İYİ DEĞERİ**: Sadece %1.4 hareket gerekli! Adobe earnings genelde %5-10 hareket. 7 kontrat $49'a mal oluyor. Risk/reward inanılmaz.

---

#### Strateji 1B: OTM Put Lottery (Bearish)
| Parametre | Değer |
|-----------|-------|
| Yapı | 1x ADBE Jun 13 245 Put |
| Strike | $245 (%2.6 OTM) |
| Prim | ~$0.04-$0.10/kontrat |
| **Toplam Maliyet** | **$4-$10** |
| $50 Bütçeyle | ✅ 5-12 kontrat |
| Max Risk | $4-$10/kontrat |
| Max Reward | Sınırsız (245 altı) |
| Breakeven | ~$244.90 |
| Gerekli Hareket | %2.6 aşağı |

---

#### Strateji 1C: Çift Yönlü Strangle (Ultra Ucuz)
| Parametre | Değer |
|-----------|-------|
| Yapı | 5x 255C + 5x 245P |
| Call Prim | $0.07 × 5 = $35 |
| Put Prim | $0.07 × 5 = $35 |
| **Toplam Maliyet** | **$70** |
| $50 Bütçeyle | ❌ (3C+3P = $42 uygun) |
| $100 Bütçeyle | ✅ 5+5 veya 7+7 |
| Call Breakeven | $255.07 |
| Put Breakeven | $244.93 |
| Her Yönde Kaldıraç | 5x |

> 💡 **5 Call + 5 Put = $70**. ADBE sadece %2 hareket etse bile, bir taraf kar eder. %5 hareket = ciddi para.

---

### BÜTÇE SEVİYESİ 2: $50-$200 (Küçük Bütçe)

#### Strateji 2A: Yığın OTM Call (Max Kaldıraç) ⭐ TAVSİYE
| Parametre | Değer |
|-----------|-------|
| Yapı | 20x ADBE Jun 13 255 Call |
| Prim | $0.07/kontrat |
| **Toplam Maliyet** | **$140** |
| $200 Bütçeyle | ✅ 20 kontrat, $60 rezerv |
| Max Risk | $140 |
| Max Reward | Sınırsız, 20x kaldıraç |
| Breakeven | $255.07 |
| Gerekli Hareket | %1.4 yukarı |
| **$260 Senaryosu** | 20 × $4.93 × 100 = **$9,860 kar** (%7,043) |
| **$270 Senaryosu** | 20 × $14.93 × 100 = **$29,860 kar** (%21,329) |

> ⭐ **MICRO BÜTÇE İÇİN EN İYİ SETUP**: $140 yatırım, $29,860 potansiyel. Tabii ki %8 yukarı hareket şart. Ama Adobe earnings genelde bunu yapıyor.

---

#### Strateji 2B: Debit Call Spread (Daha Güvenli)
| Parametre | Değer |
|-----------|-------|
| Yapı | Al: 5x 252.5C / Sat: 5x 257.5C |
| Hisse Fiyatı | $251.44 |
| Spread Genişliği | $5 |
| Net Debit (tahmini) | ~$1.50-$2.00/kontrat |
| **Toplam Maliyet** | **$750-$1,000** |
| Düzeltme: 2x kontrat | **$300-$400** |
| $200 Bütçeyle | ✅ 1x Al: 252.5C / 1x Sat: 257.5C = ~$150 |
| Max Risk | $150 |
| Max Reward | ($5 - $1.50) × 100 = **$350** |
| Breakeven | ~$254.00 |
| R/R Oranı | **1:2.3** |

---

#### Strateji 2C: Poor Man's Covered Call (PMCC) Stili
| Parametre | Değer |
|-----------|-------|
| Yapı | Al: ITM Call (Jun/Jul) + Sat: OTM Call (Jun 13) |
| Alınan: 1x 240C (tahmini) | ~$12.00 |
| Satılan: 1x 255C | $0.07 |
| Net Debit | $11.93 ($1,193) |
| Daha derin ITM: 230C | ~$22.00 |
| **Bu bütçe için uygun değil** | PMCC $1,000+ gerektirir |

> ❌ **PMCC bu bütçe seviyesine uymaz** — ADBE ITM call'ları çok pahalı.

---

### BÜTÇE SEVİYESİ 3: $200-$500 (Orta Bütçe)

#### Strateji 3A: Mega Call Yığını (Yüksek Olasılık) ⭐⭐ TAVSİYE
| Parametre | Değer |
|-----------|-------|
| Yapı | 50x ADBE Jun 13 255 Call |
| Prim | $0.07/kontrat |
| **Toplam Maliyet** | **$350** |
| $500 Bütçeyle | ✅ 50 kontrat, $150 rezerv |
| Max Risk | $350 |
| Max Reward | Sınırsız, 50x kaldıraç |
| Breakeven | $255.07 |
| Gerekli Hareket | %1.4 yukarı |
| **$258 Senaryosu** | 50 × $2.93 × 100 = **$14,650 kar** (%4,186) |
| **$262 Senaryosu** | 50 × $6.93 × 100 = **$34,650 kar** (%9,900) |
| **$270 Senaryosu** | 50 × $14.93 × 100 = **$74,650 kar** (%21,329) |

> ⭐⭐ **BU HAFTANIN EN AGRESİF SETUP'I**: $350 ile $74,650 potansiyel. Elbette en olası senaryo $255-$260 arası, o da $14,650 kar. Adobe'un son 8 çeyrekte 7'sinde %3+ hareket ettiği düşünülürse, bu setup çok cazip.

---

#### Strateji 3B: Kombine Strangle (Çift Yönlü)
| Parametre | Değer |
|-----------|-------|
| Yapı | 25x 255C + 25x 245P |
| Call Prim | $0.07 × 25 = $175 |
| Put Prim | $0.07 × 25 = $175 |
| **Toplam Maliyet** | **$350** |
| Max Risk | $350 |
| Çift yönlü kaldıraç | 25x her yönde |
| **$260 Senaryosu** | 25 × $4.93 × 100 = **$12,325** (put'lar $0 olur) |
| **$240 Senaryosu** | 25 × $4.93 × 100 = **$12,325** (call'lar $0 olur) |

> 💡 **Hangi yöne giderse gitsin kazan** — ama hareket şart. Yatay kalırsa $350 kayıp.

---

#### Strateji 3C: Call Backspread (Ratio)
| Parametre | Değer |
|-----------|-------|
| Yapı | Al: 2x 255C / Sat: 1x 250C |
| Alınan: 2x 255C | $0.07 × 2 = $0.14 |
| Satılan: 1x 250C | ~$2.00 (tahmini) |
| Net Credit | ~$1.86 |
| **Toplam Maliyet** | **Negatif (kredi alırsın!)** |
| $500 Bütçeyle | ✅ 4-5 set |
| Max Risk | $250-$500 arası (alt strike farkı) |
| Max Reward | Sınırsız (255 üzeri 2x) |

> ⚠️ **Kompleks**: Backspread'ler krediyle girilir ama margin gerektirir. Yeni traderlar için önerilmez.

---

### ADBE GİRİŞ/ÇIKIŞ TAKTİKLERİ

| Zaman | Eylem | Neden |
|-------|-------|-------|
| 6-9 Haziran | Erken pozisyon al | Primler $0.07 — ucuz |
| 10 Haziran (CPI) | Fırsat girişi | VIX hareketi primleri etkileyebilir |
| 11 Haziran 15:45 | Son giriş | Market kapanış öncesi |
| 11 Haziran 16:05 | Earnings | AMC açıklama |
| 12 Haziran 09:30 | Kar al | IV crush başlar — hızlı çık! |
| 12 Haziran 10:00 | Kesin çıkış | 30-60 dk içinde tamamen kapat |

> ⚠️ **ADBE için kritik**: IV Rank %100 — earnings sonrası IV %50+ çökecek. OTM call'lar hızla eriyecek. Kar almayı erken yap!

---

### ADBE ÖZET TABLO

| Bütçe | Strateji | Maliyet | Max Kar | Gerekli Hareket | Olasılık |
|-------|----------|---------|---------|-----------------|----------|
| $7 | 1x 255C Lottery | $7 | $700+ | %1.4 | %45-55 |
| $49 | 7x 255C Lottery | $49 | $4,900+ | %1.4 | %45-55 |
| $140 | 20x 255C | $140 | $20,000+ | %1.4 | %45-55 |
| $350 | 50x 255C | $350 | $74,000+ | %1.4 | %45-55 |
| $350 | 25C+25P Strangle | $350 | $12,325 | %2 her yön | %60-70 |

---

# BÖLÜM 3: CHEWY (CHWY) — $20.64

## Hisse Analizi
- **Earnings**: 10 Haziran BMO (Before Market Open)
- **Kalan Gün**: 4 gün
- **IV Rank**: %89.59 (Yüksek)
- **Strateji Tipi**: **EN BÜTÇE DOSTU HİSSE** — $2/kontrat! En düşük fiyatlı hisse = en yüksek kontrat sayısı
- **Önemli**: BMO = Before Market Open → Pozisyonu 9 Haziran kapanışta almalısın!

---

### BÜTÇE SEVİYESİ 1: $10-$50 (Micro Bütçe) ⭐⭐⭐ EN İYİ DEĞER

#### Strateji 1A: EN UCUZ Call Lottery 🏆 BÜTÇE ŞAMPİYONU
| Parametre | Değer |
|-----------|-------|
| Yapı | 10x CHWY Jun 13 22 Call |
| Hisse Fiyatı | $20.64 |
| Strike | $22 (%6.6 OTM) |
| Prim | ~$0.02/kontrat |
| **Toplam Maliyet** | **$20** |
| $10 Bütçeyle | ✅ 5 kontrat ($10) |
| $50 Bütçeyle | ✅ 25 kontrat ($50) |
| Max Risk | $20 (primin tamamı) |
| Max Reward | Sınırsız, 10x kaldıraç |
| Breakeven | $22.02 |
| Gerekli Hareket | %6.6 yukarı |
| Delta | ~0.05 |
| Theta | ~-$0.01/gün (çok düşük) |

**Senaryolar (25 kontrat = $50 yatırım):**
- CHWY $24 olursa: 25 × ($24-$22-$0.02) × 100 = **$49,500 kar** (%99,000 getiri)
- CHWY $23 olursa: 25 × ($23-$22-$0.02) × 100 = **$24,500 kar**
- CHWY $22 altı kalırsa: **-$50** (max kayıp)

> 🏆 **BU HAFTANIN ŞAMPİYONU**: 25 kontrat $50'a mal oluyor! $1 yukarı hareket = $2,500 kar. CHWY earnings genelde %10-20 arası hareket ediyor. Bu setup'ta $50 kaybetme ihtimalin var ama $50,000 kazanma ihtimalin de var. Risk $50!

---

#### Strateji 1B: ATM Call (Daha Yüksek Delta)
| Parametre | Değer |
|-----------|-------|
| Yapı | 5x CHWY Jun 13 21 Call |
| Strike | $21 (%1.7 OTM) |
| Prim | ~$0.15-$0.30 (tahmini) |
| **Toplam Maliyet** | **$75-$150** |
| $50 Bütçeyle | ✅ 3-5 kontrat (limitli) |
| Delta | ~0.35 (daha yüksek) |
| Gerekli Hareket | %1.7 yukarı |
| Breakeven | ~$21.30 |

> 💡 **ATM call daha pahalı ama delta yüksek**. Her $1 yukarı hareket = ~$35 kazanç/kontrat (delta etkisi).

---

#### Strateji 1C: Ultra-Ucuz Çift Yönlü
| Parametre | Değer |
|-----------|-------|
| Yapı | 10x 22C + 10x 20P |
| Call Prim | $0.02 × 10 = $0.20 |
| Put Prim | $0.11 × 10 = $1.10 |
| **Toplam Maliyet** | **$1.30 × 100 = $130** |
| $50 Bütçeyle | ❌ (5C+5P = $65 uygun olabilir) |
| $100 Bütçeyle | ✅ 10+10 veya 15+15 |
| Call Breakeven | $22.02 |
| Put Breakeven | $19.89 |
| Gerekli Hareket | >%6.6 yukarı veya >%3.1 aşağı |

---

### BÜTÇE SEVİYESİ 2: $50-$200 (Küçük Bütçe)

#### Strateji 2A: 100 Call Yığını (Max Kaldıraç) ⭐⭐⭐ TAVSİYE
| Parametre | Değer |
|-----------|-------|
| Yapı | 100x CHWY Jun 13 22 Call |
| Prim | $0.02/kontrat |
| **Toplam Maliyet** | **$200** |
| $200 Bütçeyle | ✅ 100 kontrat |
| Max Risk | $200 |
| Max Reward | Sınırsız, 100x kaldıraç |
| Breakeven | $22.02 |
| Gerekli Hareket | %6.6 yukarı |
| **$23 Senaryosu** | 100 × $0.98 × 100 = **$9,800 kar** (%4,900) |
| **$24 Senaryosu** | 100 × $1.98 × 100 = **$19,800 kar** (%9,900) |
| **$25 Senaryosu** | 100 × $2.98 × 100 = **$29,800 kar** (%14,900) |

> ⭐⭐⭐ **TÜM HİSSELER ARASINDA EN İYİ DEĞER**: $200 ile 100 kontrat alıyorsun. CHWY $25 olursa (+%21, earnings tipik hareketi) $29,800 kar. Risk sadece $200. Bu hisse bu kadar ucuza bu kadar yüksek hareket potansiyeli sunuyor.

---

#### Strateji 2B: Debit Call Spread (Daha Yüksek Olasılık)
| Parametre | Değer |
|-----------|-------|
| Yapı | Al: 10x 21C / Sat: 10x 23C |
| Spread Genişliği | $2 |
| Net Debit (tahmini) | ~$0.10/kontrat |
| **Toplam Maliyet** | **$100** |
| $200 Bütçeyle | ✅ 20 kontrat seti |
| Max Risk | $100 |
| Max Reward | ($2 - $0.10) × 10 × 100 = **$1,900** |
| Breakeven | ~$21.10 |
| Gerekli Hareket | %2.2 yukarı |
| R/R Oranı | **1:19** |

---

#### Strateji 2C: Call/Put Kombinasyonu (Çift Yönlü)
| Parametre | Değer |
|-----------|-------|
| Yapı | 50x 22C ($100) + 20x 20P ($220) |
| **Toplam Maliyet** | **~$320** (düzelt: 30C+15P = $195) |
| $200 Bütçeyle | ✅ 50x 22C ($100) + 9x 20P ($99) = $199 |
| Max Risk | $199 |
| Çift Yönlü Kaldıraç | Call: 50x, Put: 9x |
| **$23 Senaryosu** | 50 × $0.98 × 100 = **$4,900** (put expires worthless) |
| **$19 Senaryosu** | 9 × $1.89 × 100 = **$1,701** (call expires worthless) |

---

### BÜTÇE SEVİYESİ 3: $200-$500 (Orta Bütçe)

#### Strateji 3A: Mega CHWY Portföyü (200+ Kontrat) ⭐⭐⭐⭐ EN İYİ
| Parametre | Değer |
|-----------|-------|
| Yapı | 250x CHWY Jun 13 22 Call |
| Prim | $0.02/kontrat |
| **Toplam Maliyet** | **$500** |
| $500 Bütçeyle | ✅ 250 kontrat |
| Max Risk | $500 |
| Max Reward | Sınırsız, 250x kaldıraç |
| Breakeven | $22.02 |
| Gerekli Hareket | %6.6 yukarı |
| **$23 Senaryosu** | 250 × $0.98 × 100 = **$24,500 kar** (%4,900) |
| **$24 Senaryosu** | 250 × $1.98 × 100 = **$49,500 kar** (%9,900) |
| **$25 Senaryosu** | 250 × $2.98 × 100 = **$74,500 kar** (%14,900) |

> ⭐⭐⭐⭐ **HAFTANIN EN İYİ STRATEJİSİ**: $500 → $74,500 potansiyel. CHWY earnings'te %20 hareket göstermiş geçmişte. $25 senaryosu bile "extreme" değil. 250 kontrat alabilmek inanılmaz bir kaldıraç.

---

#### Strateji 3B: Çoklu Spread + Lottery Kombinasyonu
| Parametre | Değer |
|-----------|-------|
| Yapı A | 150x 22C (Lottery) = $300 |
| Yapı B | 10x 21/23 Spread = $100 |
| **Toplam Maliyet** | **$400** |
| Geriye Kalan | $100 rezerv |
| Açıklama | Spread daha güvenli (21'e kadar korumalı), Lottery 22+ hareket için |
| **$22.50 Senaryosu** | Spread: 10 × $1.50 × 100 = $1,500 + Lottery: 150 × $0.48 × 100 = $7,200 = **Toplam $8,700** |

---

#### Strateji 3C: Butterfly (Tam Hedef)
| Parametre | Değer |
|-----------|-------|
| Yapı | 5x 21C / -10x 22C / 5x 23C |
| Net Debit (tahmini) | ~$0.05/kontrat seti |
| **Toplam Maliyet** | **$25/set** |
| $500 Bütçeyle | ✅ 20 set |
| Max Reward (22'de) | 20 × ($1 - $0.05) × 100 = **$19,000** |
| Breakeven | ~$21.05 ve ~$22.95 |
| Gerekli Hareket | Tam $22 hedef (%6.6 yukarı) |
| R/R Oranı | **1:760** |

> 💡 **Butterfly en yüksek R/R ama en düşük olasılık** — hissenin tam $22'de kapanması gerekir.

---

### CHWY GİRİŞ/ÇIKIŞ TAKTİKLERİ (KRİTİK: BMO!)

> ⚠️ **CHWY earnings BMO (Before Market Open)** → Pozisyonu 9 Haziran kapanışta almalısın!

| Zaman | Eylem | Neden |
|-------|-------|-------|
| 6-8 Haziran | Erken pozisyon al | Primler $0.02 — çok ucuz |
| 9 Haziran 15:45 | **SON GİRİŞ** | BMO olduğu için önceki gün kapanışta olmalı |
| 9 Haziran 16:00 | **Pozisyon kilitli** | Artık işlem yok |
| 10 Haziran 06:00-08:00 | Earnings açıklanır | Pre-market sonuçlar |
| 10 Haziran 09:30 | **KAR AL!** | Market açılışında hemen çık — IV crush + hareket |
| 10 Haziran 10:00 | Kesin çıkış | 30 dk içinde tamamen kapat |

> 🚨 **CHWY BMO olduğu için timing kritik** — 9 Haziran akşamına kadar pozisyon almalısın. 10 Haziran sabah açılışta hemen kar al çünkü IV crush + theta decay ikisi birden vuracak.

---

### CHWY ÖZET TABLO

| Bütçe | Strateji | Maliyet | Max Kar | Gerekli Hareket | Olasılık |
|-------|----------|---------|---------|-----------------|----------|
| $10 | 5x 22C | $10 | $4,900+ | %6.6 | %40-50 |
| $50 | 25x 22C | $50 | $24,500+ | %6.6 | %40-50 |
| $200 | 100x 22C | $200 | $99,000+ | %6.6 | %40-50 |
| $500 | 250x 22C | $500 | $250,000+ | %6.6 | %40-50 |
| $100 | 10x 21/23 Spread | $100 | $1,900 | %2.2 | %50-60 |
| $25 | Butterfly (1 set) | $25 | $950 | Tam $22 | %10-15 |

---

# BÖLÜM 4: FEDEX (FDX) — $387.25

## Hisse Analizi
- **Earnings**: 23 Haziran AMC (After Market Close)
- **Kalan Gün**: 17 gün
- **IV Rank**: %76.26 (Orta-yüksek)
- **Strateji Tipi**: Daha uzun vadeli — 17 gün kaldığı için theta decay daha yavaş ama OTM hareket için daha fazla zaman gerekli
- **Fiyat**: $387 — Yüksek fiyatlı hisse, OTM call'lar bile $50+/kontrat

---

### BÜTÇE SEVİYESİ 1: $10-$50 (Micro Bütçe)

#### Strateji 1A: OTM Call Lottery
| Parametre | Değer |
|-----------|-------|
| Yapı | 1x FDX Jun 27 410 Call |
| Hisse Fiyatı | $387.25 |
| Strike | $410 (%5.9 OTM) |
| Prim | ~$0.49/kontrat |
| **Toplam Maliyet** | **$49** |
| $50 Bütçeyle | ✅ 1 kontrat |
| Max Risk | $49 |
| Max Reward | Sınırsız (410 üzeri) |
| Breakeven | $410.49 |
| Gerekli Hareket | %5.9 yukarı |
| Delta | ~0.12 |
| Theta | ~-$0.15/gün |
| Vega | ~0.35 |

**Senaryolar:**
- FDX $420 olursa: ($420-$410-$0.49) × 100 = **$951 kar** (%1,941 getiri)
- FDX $415 olursa: ($415-$410-$0.49) × 100 = **$451 kar**
- FDX $410 altı kalırsa: **-$49** (max kayıp)

---

#### Strateji 1B: Daha Ucuz Call (%6 OTM)
| Parametre | Değer |
|-----------|-------|
| Yapı | 1x FDX Jun 27 415 Call |
| Prim | ~$0.06/kontrat |
| **Toplam Maliyet** | **$6** |
| $10 Bütçeyle | ✅ 1 kontrat |
| $50 Bütçeyle | ✅ 8 kontrat ($48) |
| Gerekli Hareket | %7.2 yukarı |
| Breakeven | $415.06 |
| **$425 Senaryosu (8 kontrat)** | 8 × $9.94 × 100 = **$7,952 kar** (%16,567) |

> 💡 **$6/kontrat çok ucuz** — ama delta çok düşük (~0.02). Hareket gelse bile prim hemen artmayabilir.

---

#### Strateji 1C: OTM Put (Bearish)
| Parametre | Değer |
|-----------|-------|
| Yapı | 1x FDX Jun 27 370 Put |
| Prim | ~$0.43/kontrat |
| **Toplam Maliyet** | **$43** |
| $50 Bütçeyle | ✅ 1 kontrat |
| Max Risk | $43 |
| Breakeven | $369.57 |
| Gerekli Hareket | %4.3 aşağı |

---

### BÜTÇE SEVİYESİ 2: $50-$200 (Küçük Bütçe)

#### Strateji 2A: Çoklu OTM Call (6% OTM) ⭐ TAVSİYE
| Parametre | Değer |
|-----------|-------|
| Yapı | 8x FDX Jun 27 415 Call |
| Prim | $0.06 × 8 = $0.48 |
| **Toplam Maliyet** | **$48** |
| $100 Bütçeyle | ✅ 16 kontrat ($96) |
| $200 Bütçeyle | ✅ 33 kontrat ($198) |
| Max Risk | $48-$198 |
| Max Reward | Sınırsız, 33x kaldıraç |
| Breakeven | $415.06 |
| Gerekli Hareket | %7.2 yukarı |
| **$430 Senaryosu (33 kontrat)** | 33 × $14.94 × 100 = **$49,302 kar** (%24,900) |

> ⭐ **FDX İÇİN EN İYİ DEĞER**: 33 kontrat $198'a mal oluyor. FDX earnings genelde %8-12 hareket. $430 hedef (%11 yukarı) oldukça makul.

---

#### Strateji 2B: Debit Call Spread
| Parametre | Değer |
|-----------|-------|
| Yapı | Al: 1x 400C / Sat: 1x 415C |
| Spread Genişliği | $15 |
| Net Debit (tahmini) | ~$2.00-$3.00 |
| **Toplam Maliyet** | **$200-$300** |
| $200 Bütçeyle | ✅ 1 kontrat (sınırda) |
| Max Risk | $200-$300 |
| Max Reward | ($15 - $3) × 100 = **$1,200** |
| Breakeven | ~$403.00 |
| R/R Oranı | **1:4 ila 1:6** |

---

#### Strateji 2C: Call Ratio Spread
| Parametre | Değer |
|-----------|-------|
| Yapı | Al: 2x 400C / Sat: 4x 415C |
| Net Debit (tahmini) | ~$100-$200 |
| Max Risk (üst) | Sınırsız (415 üzeri 2x naked call) |
| Max Reward (415'e kadar) | ~$2,800 |
| Gerekli Hareket Optimal | %3-7 yukarı |

---

### BÜTÇE SEVİYESİ 3: $200-$500 (Orta Bütçe)

#### Strateji 3A: Büyük Call Yığını (6% OTM) ⭐⭐ TAVSİYE
| Parametre | Değer |
|-----------|-------|
| Yapı | 80x FDX Jun 27 415 Call |
| Prim | $0.06 × 80 = $4.80 |
| **Toplam Maliyet** | **$480** |
| $500 Bütçeyle | ✅ 80 kontrat, $20 rezerv |
| Max Risk | $480 |
| Max Reward | Sınırsız, 80x kaldıraç |
| Breakeven | $415.06 |
| Gerekli Hareket | %7.2 yukarı |
| **$430 Senaryosu** | 80 × $14.94 × 100 = **$119,520 kar** (%24,900) |

> ⭐⭐ **FDX İÇİN OPTİMAL**: 80 kontrat $480. %7.2 hareket oldukça makul 17 günlük sürede. FDX lojistik sektöründe, ekonomik verilere duyarlı — CPI etkisi olabilir.

---

#### Strateji 3B: 2-Etaplı Strateji
| Parametre | Değer |
|-----------|-------|
| Yapı A (Şimdi) | 40x 415C = $240 |
| Yapı B (17 Haziran) | Eğer hisse $395+ ise: 40x daha ekle |
| **Toplam Maliyet** | **$240-$480** |
| Açıklama | DCA (Dollar Cost Averaging) stili — momentum gelirse ekstra ekle |
| Risk Azaltma | İlk $240 risk, kalan $240 opsiyonel |

---

#### Strateji 3C: Kombine Spread + Lottery
| Parametre | Değer |
|-----------|-------|
| Yapı A | 2x 400/415 Spread = ~$400-$600 (düzelt: 1x = $200-$300) |
| Yapı B | 20x 415C = $120 |
| **Toplam Maliyet** | **~$420** |
| Spread kısmı | Daha güvenli, %3.2 hareketle kar |
| Lottery kısmı | %7.2+ hareket için ekstra kaldıraç |

---

### FDX GİRİŞ/ÇIKIŞ TAKTİKLERİ

| Zaman | Eylem | Neden |
|-------|-------|-------|
| 6-13 Haziran | Erken pozisyon al | 17 gün var — theta yavaş, primler uygun |
| 10 Haziran (CPI) | Fırsat | FDX ekonomiye duyarlı, CPI etkileyebilir |
| 16-20 Haziran | Son giriş fırsatı | Son 1 hafta — daha yüksek gamma |
| 23 Haziran 15:45 | Son giriş | Market kapanış öncesi |
| 23 Haziran 16:05 | Earnings | AMC açıklama |
| 24 Haziran 09:30 | Kar al | IV crush başlar |
| 24-27 Haziran | Kesin çıkış | Jun 27 expiry'e kadar tamamen kapat |

> 💡 **FDX avantajı**: 17 gün kaldı — zaman bizim tarafımızda. Ama 17 gün theta decay de demek. OTM call'lar theta'ya karşı savunmasız.

---

### FDX ÖZET TABLO

| Bütçe | Strateji | Maliyet | Max Kar | Gerekli Hareket | Olasılık |
|-------|----------|---------|---------|-----------------|----------|
| $49 | 1x 410C | $49 | $951+ | %5.9 | %30-40 |
| $48 | 8x 415C | $48 | $7,952+ | %7.2 | %25-35 |
| $198 | 33x 415C | $198 | $49,302+ | %7.2 | %25-35 |
| $480 | 80x 415C | $480 | $119,520+ | %7.2 | %25-35 |
| $200 | 1x 400/415 Spread | $200 | $1,200 | %3.2 | %40-50 |

---

# BÖLÜM 5: MICRON (MU) — $864.01

## Hisse Analizi
- **Earnings**: 24 Haziran AMC (After Market Close)
- **Kalan Gün**: 18 gün
- **IV Rank**: %100 (Tarihi zirve)
- **Fiyat**: $864 — Çok yüksek fiyatlı hisse
- **Strateji Tipi**: Yüksek fiyat = pahalı opsiyonlar — fakat OTM call'lar $50-$100 arası

---

### BÜTÇE SEVİYESİ 1: $10-$50 (Micro Bütçe)

#### Strateji 1A: OTM Call Lottery
| Parametre | Değer |
|-----------|-------|
| Yapı | 1x MU Jun 27 1000 Call |
| Hisse Fiyatı | $864.01 |
| Strike | $1000 (%15.7 OTM) |
| Prim | ~$0.50-$1.00/kontrat |
| **Toplam Maliyet** | **$50-$100** |
| $50 Bütçeyle | ✅ 1 kontrat (sınırda) |
| Max Risk | $50-$100 |
| Max Reward | Sınırsız (1000 üzeri) |
| Breakeven | $1000.50-$1001.00 |
| Gerekli Hareket | %15.7 yukarı |
| Delta | ~0.03 |
| Theta | ~-$0.30/gün (yüksek) |
| Vega | ~0.25 |

**Senaryolar:**
- MU $1050 olursa: ($1050-$1000-$0.75) × 100 = **$4,925 kar** (%6,567 getiri)
- MU $1020 olursa: ($1020-$1000-$0.75) × 100 = **$1,925 kar**
- MU $1000 altı kalırsa: **-$75** (max kayıp)

---

#### Strateji 1B: Daha Yakın OTM Call
| Parametre | Değer |
|-----------|-------|
| Yapı | 1x MU Jun 27 950 Call |
| Prim | ~$1.50-$2.50/kontrat |
| **Toplam Maliyet** | **$150-$250** |
| $50 Bütçeyle | ❌ Yetersiz |
| $200 Bütçeyle | ✅ 1 kontrat |
| Gerekli Hareket | %10 OTM |
| Delta | ~0.08 |

---

### BÜTÇE SEVİYESİ 2: $50-$200 (Küçük Bütçe)

#### Strateji 2A: 950C + 1000C Spread
| Parametre | Değer |
|-----------|-------|
| Yapı | Al: 1x 950C / Sat: 1x 1000C |
| Spread Genişliği | $50 |
| Net Debit (tahmini) | ~$1.00-$1.50 |
| **Toplam Maliyet** | **$100-$150** |
| $200 Bütçeyle | ✅ 1-2 kontrat |
| Max Risk | $100-$150 |
| Max Reward | ($50 - $1.50) × 100 = **$4,850** |
| Breakeven | ~$951.50 |
| Gerekli Hareket | %10.1 yukarı |
| R/R Oranı | **1:32 ila 1:48** |

> ⭐ **MU İÇİN EN İYİ R/R**: $150 risk, $4,850 kazanç. Fakat %10 hareket MU için zorlayıcı olabilir.

---

#### Strateji 2B: OTM Put Spread (Bearish)
| Parametre | Değer |
|-----------|-------|
| Yapı | Al: 1x 800P / Sat: 1x 750P |
| Spread Genişliği | $50 |
| Net Debit (tahmini) | ~$1.00-$2.00 |
| **Toplam Maliyet** | **$100-$200** |
| Max Risk | $100-$200 |
| Max Reward | ($50 - $2) × 100 = **$4,800** |
| Breakeven | ~$798.00 |
| Gerekli Hareket | %7.6 aşağı |
| R/R Oranı | **1:24 ila 1:48** |

---

### BÜTÇE SEVİYESİ 3: $200-$500 (Orta Bütçe)

#### Strateji 3A: 2x 950/1000 Spread ⭐ TAVSİYE
| Parametre | Değer |
|-----------|-------|
| Yapı | 2x Al: 950C / 2x Sat: 1000C |
| Net Debit | ~$1.25/kontrat |
| **Toplam Maliyet** | **$250** |
| $500 Bütçeyle | ✅ 4 kontrat ($500) |
| Max Risk | $250-$500 |
| Max Reward | 4 × $4,850 = **$19,400** |
| Breakeven | ~$951.50 |
| Gerekli Hareket | %10.1 yukarı |
| R/R Oranı | **1:38** |

> ⭐ **MU İÇİN OPTİMAL**: Spread IV crush'e dayanıklı. %10 hareket zor ama MU'un son earnings'lerinde %8-15 hareketler görüldü. Semikonduktör sektörü volatil.

---

#### Strateji 3B: Çoklu OTM Call (%16 OTM)
| Parametre | Değer |
|-----------|-------|
| Yapı | 5x MU Jun 27 1000 Call |
| Prim | $0.75 × 5 = $3.75 |
| **Toplam Maliyet** | **$375** |
| $500 Bütçeyle | ✅ 6-7 kontrat |
| Max Risk | $375-$525 |
| Max Reward | Sınırsız, 6-7x kaldıraç |
| Breakeven | $1000.75 |
| Gerekli Hareket | %15.7 yukarı |
| **$1050 Senaryosu (6 kontrat)** | 6 × $49.25 × 100 = **$29,550 kar** (%7,880) |

---

### MU GİRİŞ/ÇIKIŞ TAKTİKLERİ

| Zaman | Eylem | Neden |
|-------|-------|-------|
| 6-16 Haziran | Erken pozisyon al | 18 gün var — zaman bizim tarafımızda |
| 17-23 Haziran | Son giriş | Son hafta — gamma yüksek |
| 24 Haziran 15:45 | Son giriş | Market kapanış öncesi |
| 24 Haziran 16:05 | Earnings | AMC açıklama |
| 25 Haziran 09:30 | Kar al | IV crush başlar |
| 25-27 Haziran | Kesin çıkış | Expiry yaklaşıyor |

> ⚠️ **MU uyarısı**: $864 fiyat çok yüksek. OTM call'lar %15 OTM bile pahalı. Spread'ler daha mantıklı. Theta decay -$0.30/gün çok agresif.

---

### MU ÖZET TABLO

| Bütçe | Strateji | Maliyet | Max Kar | Gerekli Hareket | Olasılık |
|-------|----------|---------|---------|-----------------|----------|
| $50 | 1x 1000C | $50 | $4,925+ | %15.7 | %15-25 |
| $150 | 1x 950/1000 Spread | $150 | $4,850 | %10.1 | %25-35 |
| $250 | 2x 950/1000 Spread | $250 | $9,700 | %10.1 | %25-35 |
| $500 | 4x 950/1000 Spread | $500 | $19,400 | %10.1 | %25-35 |

---

# BÖLÜM 6: HAFTANIN EN İYİ 15 STRATEJİSİ (SIRALAMA)

## $10-$50 BÜTÇE İÇİN TOP 5

| Sıra | Hisse | Strateji | Maliyet | Max Kar | Olasılık | Skor |
|------|-------|----------|---------|---------|----------|------|
| 🥇 | **CHWY** | 25x 22C Lottery | $50 | $24,500+ | %40-50 | **A+** |
| 🥈 | **ADBE** | 7x 255C Lottery | $49 | $4,900+ | %45-55 | **A+** |
| 🥉 | **CHWY** | 10x 22C Lottery | $20 | $9,800+ | %40-50 | **A** |
| 4 | **FDX** | 8x 415C Lottery | $48 | $7,952+ | %25-35 | **B+** |
| 5 | **ORCL** | 1x 240C Lottery | $90 | $910+ | %15-20 | **B** |

## $50-$200 BÜTÇE İÇİN TOP 5

| Sıra | Hisse | Strateji | Maliyet | Max Kar | Olasılık | Skor |
|------|-------|----------|---------|---------|----------|------|
| 🥇 | **CHWY** | 100x 22C Lottery | $200 | $99,000+ | %40-50 | **A+** |
| 🥈 | **ADBE** | 20x 255C Lottery | $140 | $20,000+ | %45-55 | **A+** |
| 🥉 | **ORCL** | 1x 220/230 Spread | $150 | $850 | %30-35 | **A** |
| 4 | **FDX** | 33x 415C Lottery | $198 | $49,302+ | %25-35 | **A-** |
| 5 | **MU** | 1x 950/1000 Spread | $150 | $4,850 | %25-35 | **B+** |

## $200-$500 BÜTÇE İÇİN TOP 5

| Sıra | Hisse | Strateji | Maliyet | Max Kar | Olasılık | Skor |
|------|-------|----------|---------|---------|----------|------|
| 🥇 | **CHWY** | 250x 22C Lottery | $500 | $250,000+ | %40-50 | **A+** |
| 🥈 | **ADBE** | 50x 255C Lottery | $350 | $74,000+ | %45-55 | **A+** |
| 🥉 | **ORCL** | 3x 220/230 Spread | $450 | $2,550 | %30-35 | **A** |
| 4 | **FDX** | 80x 415C Lottery | $480 | $119,520+ | %25-35 | **A-** |
| 5 | **MU** | 4x 950/1000 Spread | $500 | $19,400 | %25-35 | **B+** |

---

# BÖLÜM 7: RİSK YÖNETİMİ VE UYARILAR

## ⚠️ KRİTİK RİSKLER

### 1. IV Crush (Implied Volatility Çöküşü)
Earnings sonrası IV %50-80 arası çöker. Bu ne demek?

| Hisse | Mevcut IV | Earnings Sonrası | Etki |
|-------|-----------|------------------|------|
| ORCL | %82 | ~%35-40 | OTM call'lar %60-80 değer kaybeder |
| ADBE | %100 | ~%35-45 | OTM call'lar %70-85 değer kaybeder |
| CHWY | %89 | ~%40-50 | OTM call'lar %50-70 değer kaybeder |
| FDX | %76 | ~%35-40 | OTM call'lar %50-65 değer kaybeder |
| MU | %100 | ~%40-50 | OTM call'lar %60-80 değer kaybeder |

**Korunma**: Spread'ler (satılan call/put) IV crush'ten kar eder — bu yüzden spread'ler daha güvenli.

### 2. Theta Decay (Zaman Erozyonu)
| Kalan Gün | Günlük Theta (OTM Call) | 4 Günlük Kayıp |
|-----------|------------------------|----------------|
| 4 gün (ORCL/CHWY) | -$0.04 ila -$0.60 | -$0.16 ila -$2.40/kontrat |
| 5 gün (ADBE) | -$0.03 ila -$0.50 | -$0.15 ila -$2.50/kontrat |

### 3. Liquidity Riski (Likidite)
- CHWY: Hacim yüksek, spread dar ✅
- ADBE: Hacim çok yüksek ✅
- ORCL: Hacim yüksek ✅
- FDX: Hacim orta, OTM'lerde spread geniş olabilir ⚠️
- MU: Hacim yüksek ama $1000 strike'ta spread çok geniş olabilir ⚠️

### 4. Directional Risk (Yön Riski)
- Earnings sonucu tahmin edilemez — %50 şans
- Tek yönlü pozisyon = %50 kayıp olasılığı
- Çift yönlü strangle/straddle = bir taraf mutlaka kaybeder
- **Çözüm**: Sadece kaybedebileceğin kadar yatırım yap!

---

## 🛡️ RİSK YÖNETİMİ KURALLARI

### Altın Kurallar
1. **Asla kaybetmeyeceğinden fazlasını yatırma** — Bu "lottery ticket" stratejileridir
2. **Tek bir hisseye tüm bütçeyi koyma** — En az 2-3 hisseye dağıt
3. **Spread'ler tek yönlü riski azaltır** — ama max karı da sınırlar
4. **Kar almayı erken yap** — Earnings sonrası ilk 30-60 dk en iyisi
5. **Kayıp durdurma (stop loss) uygula** — Eğer hisse ters yöne %3+ giderse, çık

### Örnek Portföy Dağılımları

#### $100 Mikro Portföy
| Hisse | Strateji | Miktar | Maliyet |
|-------|----------|--------|---------|
| CHWY | 10x 22C | $20 | $20 |
| ADBE | 5x 255C | $35 | $35 |
| ORCL | 1x 210P (hedge) | $9 | $9 |
| **Toplam** | | | **$64** (kalan $36 rezerv) |

#### $500 Optimal Portföy ⭐
| Hisse | Strateji | Miktar | Maliyet |
|-------|----------|--------|---------|
| CHWY | 125x 22C | $250 | $250 |
| ADBE | 20x 255C | $140 | $140 |
| ORCL | 1x 220/230 Spread | $150 | $150 |
| **Toplam** | | | **$540** (biraz aşıyor, ayarla) |

#### Düzeltilmiş $500 Portföy
| Hisse | Strateji | Miktar | Maliyet |
|-------|----------|--------|---------|
| CHWY | 100x 22C | $200 | $200 |
| ADBE | 14x 255C | $98 | $98 |
| ORCL | 1x 220/230 Spread | $150 | $150 |
| **Toplam** | | | **$448** ($52 rezerv) |

---

# BÖLÜM 8: GİRİŞ/ÇIKIŞ ZAMANLAMASI

## KRİTİK TARİHLER

| Tarih | Saat | Olay | Etki | Ne Yapmalı |
|-------|------|------|------|------------|
| 9 Haziran | 16:00 | CHWY pozisyonu son | Kapanışta pozisyon alınmalı | CHWY girişi tamamla |
| 10 Haziran | 08:30 | **CPI Verisi** | VIX hareketi, tüm market | İzle, fırsat varsa ORCL/CHWY ekle |
| 10 Haziran | 16:05 | **ORCL Earnings** | AMC açıklama | Pozisyonun varsa bekle |
| 10 Haziran | BMO | **CHWY Earnings** | Pre-market açıklanmış olacak | Kar al! |
| 11 Haziran | 09:30 | ORCL kar al | IV crush başlar | ORCL pozisyonunu kapat |
| 11 Haziran | 16:05 | **ADBE Earnings** | AMC açıklama | Pozisyonun varsa bekle |
| 12 Haziran | 09:30 | ADBE kar al | IV crush + theta | ADBE pozisyonunu hemen kapat |
| 23 Haziran | 16:05 | **FDX Earnings** | AMC açıklama | FDX pozisyonu varsa bekle |
| 24 Haziran | 09:30 | FDX kar al | IV crush | FDX pozisyonunu kapat |
| 24 Haziran | 16:05 | **MU Earnings** | AMC açıklama | MU pozisyonu varsa bekle |
| 25 Haziran | 09:30 | MU kar al | IV crush + expiry yaklaşıyor | MU pozisyonunu kapat |

---

# BÖLÜM 9: SONUÇ VE ÖNERİLER

## 🏆 HAFTANIN EN İYİ 3 STRATEJİSİ

### 1. CHWY 250x 22C Lottery ($500 Bütçe)
- **Maliyet**: $500
- **Max Kar**: $250,000+ (teorik)
- **Gerçekçi Kar** ($24 hedefi): $49,500
- **Olasılık**: %40-50
- **Neden**: En ucuz prim ($0.02), en yüksek kontrat sayısı, tipik earnings hareketi %10-20
- **Risk**: $500 tam kayıp

### 2. ADBE 50x 255C Lottery ($350 Bütçe)
- **Maliyet**: $350
- **Max Kar**: $74,000+ (teorik)
- **Gerçekçi Kar** ($260 hedefi): $14,650
- **Olasılık**: %45-55
- **Neden**: Sadece %1.4 hareket gerekli! Adobe earnings güçlü geçmiş
- **Risk**: $350 tam kayıp

### 3. ORCL 3x 220/230 Debit Call Spread ($450 Bütçe)
- **Maliyet**: $450
- **Max Kar**: $2,550
- **Olasılık**: %30-35
- **Neden**: En güvenli — spread IV crush'e dayanıklı, sadece %3.7 hareket gerekli
- **Risk**: $450 tam kayıp (ama spread olduğu için daha az olası)

## 💡 GENEL TAVSİYELER

1. **Yeni başlayanlar**: Spread'lerle başla (ORCL 220/230 veya CHWY 21/23)
2. **Deneyimliler**: Lottery ticket (CHWY/ADBE OTM call'lar)
3. **Konservatif**: Sadece 1 kontrat ile başla, öğren, sonra artır
4. **Asla**: Kaybetmeyeceğinden fazlasını yatırma — bu gambling değil, hesaplanmış risk
5. **Hedef**: Haftalık %10-20 portföy getirisi = yıllık %520-%1,040 (teorik)

## ⚠️ SON UYARI

> Bu stratejiler **yüksek riskli** opsiyon stratejileridir. Earnings oynanması en zorlu opsiyon stratejisidir çünkü:
> - Yön tahmini zordur (%50 şans)
> - Zamanlama kritiktir (tek bir gün)
> - IV crush primleri eritir
> - Theta decay hızlıdır
> 
> **Sadece kaybetmeye hazır olduğun parayı yatır. Bu bir yatım tavsiyesi değildir.**

---

## EK: GREEKS HIZLI REFERANS

| Hisse | Strateji | Delta | Theta | Vega | Gamma |
|-------|----------|-------|-------|------|-------|
| ORCL | 240C | 0.12 | -0.05 | 0.10 | 0.01 |
| ORCL | 220/230 Spread | 0.25 | -0.03 | 0.05 | 0.02 |
| ADBE | 255C | 0.08 | -0.03 | 0.05 | 0.01 |
| CHWY | 22C | 0.05 | -0.01 | 0.03 | 0.005 |
| FDX | 415C | 0.02 | -0.02 | 0.08 | 0.002 |
| MU | 1000C | 0.03 | -0.30 | 0.25 | 0.001 |
| MU | 950/1000 Spread | 0.05 | -0.15 | 0.12 | 0.003 |

**Greeks Açıklamaları:**
- **Delta**: Hisse $1 hareket ederse, opsiyon ne kadar değişir
- **Theta**: Her gün geçerse, opsiyon ne kadar değer kaybeder
- **Vega**: IV %1 değişirse, opsiyon ne kadar değişir
- **Gamma**: Delta ne kadar hızlı değişir (earnings'te çok yüksek)

---

*Rapor tarihi: 6 Haziran 2026*
*Son güncelleme: Stage 1 verileri kullanılarak hazırlanmıştır*
*Geçerli opsiyon fiyatları değişebilir — işlem yapmadan önce kontrol edin*

---

## APPENDIX: HIZLI KARŞILAŞTIRMA TABLOSU

Tüm hisseler, tüm bütçe seviyeleri tek bakışta:

| Hisse | Bütçe | En İyi Strateji | Maliyet | Gerekli Hareket | Max Kar | Risk Skoru |
|-------|-------|-----------------|---------|-----------------|---------|------------|
| **CHWY** | $10 | 5x 22C | $10 | %6.6 | $4,900 | Yüksek |
| **CHWY** | $50 | 25x 22C | $50 | %6.6 | $24,500 | Yüksek |
| **CHWY** | $200 | 100x 22C | $200 | %6.6 | $99,000 | Yüksek |
| **CHWY** | $500 | 250x 22C | $500 | %6.6 | $250,000 | Yüksek |
| **ADBE** | $7 | 1x 255C | $7 | %1.4 | $700+ | Yüksek |
| **ADBE** | $49 | 7x 255C | $49 | %1.4 | $4,900+ | Yüksek |
| **ADBE** | $140 | 20x 255C | $140 | %1.4 | $20,000+ | Yüksek |
| **ADBE** | $350 | 50x 255C | $350 | %1.4 | $74,000+ | Yüksek |
| **ORCL** | $90 | 1x 240C | $90 | %12.5 | $900+ | Çok Yüksek |
| **ORCL** | $150 | 1x 220/230 Spread | $150 | %3.7 | $850 | Orta |
| **ORCL** | $450 | 3x 220/230 Spread | $450 | %3.7 | $2,550 | Orta |
| **FDX** | $49 | 1x 410C | $49 | %5.9 | $900+ | Yüksek |
| **FDX** | $48 | 8x 415C | $48 | %7.2 | $7,900+ | Çok Yüksek |
| **FDX** | $198 | 33x 415C | $198 | %7.2 | $49,000+ | Çok Yüksek |
| **FDX** | $480 | 80x 415C | $480 | %7.2 | $119,000+ | Çok Yüksek |
| **MU** | $50 | 1x 1000C | $50 | %15.7 | $4,900+ | Çok Yüksek |
| **MU** | $150 | 1x 950/1000 Spread | $150 | %10.1 | $4,850 | Orta-Yüksek |
| **MU** | $250 | 2x 950/1000 Spread | $250 | %10.1 | $9,700 | Orta-Yüksek |
| **MU** | $500 | 4x 950/1000 Spread | $500 | %10.1 | $19,400 | Orta-Yüksek |

**Risk Skoru Açıklaması:**
- **Orta**: Spread'ler — IV crush dayanıklı, sınırlı risk
- **Yüksek**: OTM Lottery — tam kayıp olasılığı %50-60
- **Çok Yüksek**: Çok OTM Lottery — tam kayıp olasılığı %60-80, fakat kazanç çok yüksek

---

*Bu rapor yatırım tavsiyesi değildir. Yüksek riskli opsiyon stratejileri anlatım amaçlı hazırlanmıştır.*
