# EarningsPlay v4 — Günlük Greeks & IV Projeksiyon Raporu
## 8-11 Haziran 2026 | Black-Scholes Modeli ile Prim Projeksiyonları

---

**Rapor Tarihi:** 7 Haziran 2026 (Pazar)  
**Metodoloji:** EarningsPlay v4 + Black-Scholes Greeks  
**Model:** IV Term Structure (Hump) + Non-Linear Theta Decay + Gamma Explosion  
**Risk-free Rate:** 4.52% (10Y UST)  
**VIX (NFP Sonrası):** ~28.5 (Yüksek ama kontrol altında)

---

## EXECUTIVE SUMMARY

| Hisse | Fiyat | Earnings | Kalan Gün | IV30 | IV Rank | Theta/Bugün | Durum |
|-------|-------|----------|-----------|------|---------|-------------|-------|
| ORCL | $213.68 | 10 Haz AMC | 3 | %45 | %83 | -$0.80 | ⚠️ SICAK (3 gün) |
| CHWY | $20.64 | 10 Haz BMO | 3 | %55 | %90 | -$0.09 | ⚠️ SICAK (3 gün) |
| ADBE | $251.44 | 11 Haz AMC | 4 | %62 | %100 | -$1.05 | 🔥 YAKIN (4 gün) |
| FDX | $331.00 | 23 Haz AMC | 16 | %38 | %76 | -$0.22 | ✅ SOĞUK (16 gün) |
| MU | $86.01 | 24 Haz AMC | 17 | %58 | %100 | -$0.65 | ✅ SOĞUK (17 gün) |

**Ana Tespitler:**
- **ORCL & CHWY:** 3 gün kala theta hızlanıyor, 8-9 Haz'da pozisyon yönetimi kritik
- **ADBE:** IV %100 rank, 4 günlük vade ile en yüksek theta decay potansiyeli
- **FDX & MU:** Earnings'e 2+ hafta, şu an için setup kurulumu zamanı
- **5 Haziran NFP Şoku:** VIX %39.7 artış → Tüm hisselerde IV hump'ı derinleşti

---

## ÖZET TABLOLAR

### ORCL & CHWY 3-Günlük Theta Decay Özeti

| Hisse | Tarih | TTM | ATM Theta | OTM%10 Theta | IV | Uyarı |
|-------|-------|-----|-----------|-------------|-----|-------|
| ORCL | 8 Haz | 2g | -$1.109 | -$0.041 | 49.7% | Theta hızlanıyor |
| ORCL | 9 Haz | 1g | -$2.196 | -$0.009 | 54.3% | Theta 2x hızlı |
| ORCL | 10 Haz | 0g | -$4.420 | -$0.000 | 22.5% | IV CRUSH |
| CHWY | 8 Haz | 2g | -$0.124 | -$0.008 | 61.2% | Hızlanıyor |
| CHWY | 9 Haz | 1g | -$0.235 | -$0.002 | 67.3% | 2x hızlı |
| CHWY | 10 Haz | 0g | -$0.000 | -$0.000 | 27.5% | IV CRUSH |

**Yorum:** ORCL theta'sı CHWY'den çok daha ağır — 1 gün kala günlük kayıp -$2.20. CHWY düşük fiyatlı olduğu için nominal theta küçük ama yüzdesel olarak benzer. Her iki hisse için de 9 Haz (1 gün kala) son alış günü/delta hedge zamanı.

### ADBE 4-Günlük Gamma Patlaması Tahmini

| Tarih | Gün | IV | ATM Gamma | OTM%10 Gamma | Beklenen Hareket | Gamma Risk | Uyarı |
|-------|------|-----|-----------|-------------|------------------|------------|-------|
| 8 Haz | 3g | 67.2% | 0.0390 | 0.0117 | ±$15.31 | 9.14 | Normal |
| 9 Haz | 2g | 69.8% | 0.0537 | 0.0098 | ±$12.98 | 9.04 | Yükseliyor |
| 10 Haz | 1g | 77.5% | 0.0976 | 0.0060 | ±$10.20 | 10.15 | ⚠️ Yüksek |
| 11 Haz | 0g | 31.0% | 1.4561 | 0.0000 | ±$1.29 | 2.42 | 🔥 PATLAMA |

**Yorum:** ADBE'de 1 gün kala gamma 3x'e çıkıyor (0.0316 → 0.0976). Earnings günü gamma 50x patlıyor (1.4561) — fiyatta 1 dolar hareket delta'da 1.45 değişim yaratır. 10 Haziran son günlük hedge fırsatı. 11 Haz'da pozisyon küçültme zorunlu.

---

## 1. ORCL (Oracle Corp) — $213.68

| Metric | Değer |
|--------|-------|
| **Earnings Tarihi** | 10 Haziran 2026 AMC (Piyasa Kapandıktan Sonra) |
| **Kalan Gün** | 3 gün (7 Haz itibarıyla) |
| **IV30** | %45 (NFP sonrası yükseldi) |
| **IV Rank** | %82.83 (Yüksek) |
| **Dividend Yield** | %1.2 |
| **Temel Senaryo** | EPS guidance önemli, cloud büyüme odaklı |

### 8 Haziran Pazartesi — Earnings'e 2 Gün — IV: 49.7%

#### ATM Call ($214 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.493 | -0.004 | Delta nötr bölge, fiyat hareketine orta hassasiyet |
| Gamma | 0.0889 | +0.0247 | ⚠️ Yüksek — Delta değişim hızı yükseliyor |
| Theta | $-1.11 | $-0.313 | ⚠️ Theta hızlanıyor — günlük kayıp artıyor |
| Vega | $0.063 | $-0.014 | Vega daralıyor |
| Prim | $3.00 | $-0.59 | ⬇️ Prim eriyor |

#### ATM Put ($214 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.507 | -0.008 | Negatif delta, düşüşe karşı hassas |
| Gamma | 0.0889 | +0.0247 | Put-call parity ile eşleşiyor |
| Theta | $-1.08 | $-0.299 | Call ile benzer theta profili |
| Vega | $0.063 | $-0.014 | Call ile eşleşiyor |
| Prim | $3.28 | $-0.34 | Put-call parity |

#### OTM Call %10 ($235 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.005 | -0.007 | OTM — delta düşük, directional oyna |
| Gamma | 0.0033 | -0.0058 | OTM gamma 0.0033 |
| Theta | $-0.041 | $+0.037 | OTM theta çok düşük — hızlı erime |
| Vega | $0.002 | $-0.002 | Vega minimal |
| Prim | $0.01 | $-0.01 | UCUZ ama riskli |

#### OTM Put %10 ($192 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.002 | -0.001 | OTM — delta düşük |
| Gamma | 0.0012 | -0.0010 | OTM gamma |
| Theta | $-0.015 | $+0.014 | OTM theta hızlı erime |
| Vega | $0.001 | $-0.001 | Minimal |
| Prim | $0.00 | $-0.00 | UCUZ |

### 9 Haziran Salı — Earnings'e 1 Gün — IV: 54.3%

#### ATM Call ($214 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.486 | -0.007 | Delta nötr bölge |
| Gamma | 0.1641 | +0.0752 | ⚠️ Yüksek — Delta değişim hızı yükseliyor |
| Theta | $-2.20 | $-1.087 | ⚠️ Theta hızlanıyor — günlük kayıp artıyor |
| Vega | $0.045 | $-0.018 | Vega daralıyor |
| Prim | $2.28 | $-0.72 | ⬇️ Prim eriyor |

#### ATM Put ($214 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.514 | -0.007 | Negatif delta |
| Gamma | 0.1641 | +0.0752 | Put-call parity eşleşme |
| Theta | $-2.16 | $-1.080 | Call ile benzer theta |
| Vega | $0.045 | $-0.018 | Call ile eşleşme |
| Prim | $2.33 | $-0.95 | Put-call parity |

#### OTM Call %10 ($235 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.003 | -0.002 | OTM delta — directional |
| Gamma | 0.0020 | -0.0013 | OTM gamma |
| Theta | $-0.009 | $+0.032 | OTM erime hızlı |
| Vega | $0.001 | $-0.001 | Minimal vega |
| Prim | $0.00 | $-0.01 | UCUZ-loto |

#### OTM Put %10 ($192 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.001 | +0.001 | OTM delta |
| Gamma | 0.0009 | -0.0003 | OTM gamma |
| Theta | $-0.003 | $+0.012 | OTM erime |
| Vega | $0.000 | $-0.001 | Minimal |
| Prim | $0.00 | $-0.00 | UCUZ-loto |

### 10 Haziran Çarşamba (EARNINGS GÜNÜ) — Earnings'e 0 Gün — IV: 22.5%

#### ATM Call ($214 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.345 | -0.141 | Delta artıyor |
| Gamma | 2.3161 | +2.1520 | ⚠️ GAMMA PATLAMA! |
| Theta | $-4.42 | $-2.220 | 🔥 THETA ŞOK |
| Vega | $0.013 | $-0.032 | Vega çok düşük |
| Prim | $0.18 | $-2.10 | 💥 Prim çöküşü |

#### ATM Put ($214 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.655 | -0.141 | Negatif delta |
| Gamma | 2.3161 | +2.1520 | Put-call parity eşleşme |
| Theta | $-4.41 | $-2.250 | Call ile benzer theta |
| Vega | $0.013 | $-0.032 | Call ile eşleşme |
| Prim | $0.10 | $-2.23 | Put-call parity |

#### OTM Call %10 ($235 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.000 | -0.003 | OTM delta — directional |
| Gamma | 0.0159 | +0.0139 | OTM gamma |
| Theta | $-0.000 | $+0.009 | OTM erime hızlı |
| Vega | $0.000 | $-0.001 | Minimal vega |
| Prim | $0.00 | $-0.00 | UCUZ-loto |

#### OTM Put %10 ($192 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.000 | +0.001 | OTM delta |
| Gamma | 0.0048 | +0.0039 | OTM gamma |
| Theta | $-0.000 | $+0.003 | OTM erime |
| Vega | $0.000 | $-0.000 | Minimal |
| Prim | $0.00 | $-0.00 | UCUZ-loto |

### 2. Theta Decay Günlük Takvimi — ORCL

| Gün | TTM (Gün) | ATM Theta | OTM%10 Theta | IV | Toplam Erişim | Uyarı |
|-----|-----------|-----------|-------------|-----|---------------|-------|
| 7 Haz Pazar (Bugün) | 3g | $-0.796 | $-0.078 | 48.1% | %0.0 | ✅ Normal |
| 8 Haz Pazartesi | 2g | $-1.109 | $-0.041 | 49.7% | %0.5 | ⚠️ Hızlanıyor |
| 9 Haz Salı | 1g | $-2.196 | $-0.009 | 54.3% | %1.5 | ⚠️ Hızlanıyor |
| 10 Haz Çarşamba | 0g (EARNINGS) | $-4.420 | $-0.000 | 22.5% | %3.6 | 💥 IV CRUSH GÜNÜ |
| 11 Haz Perşembe | 0g (EARNINGS) | $-4.420 | $-0.000 | 22.5% | %5.7 | 💥 IV CRUSH GÜNÜ |

### 3. IV Crush Projeksiyonu (Earnings Sonrası) — ORCL

| Senaryo | IV Düşüşü | Hump IV → Post IV | ATM Prim Etkisi | OTM%10C Etkisi | OTM%10P Etkisi |
|---------|-----------|-------------------|-----------------|----------------|----------------|
| Hafif Crush | %30 | 63.6% → 44.5% | -31.6% | +0.0% | +0.0% |
| Orta Crush | %50 | 63.6% → 31.8% | -52.6% | +0.0% | +0.0% |
| Sert Crush | %70 | 63.6% → 19.1% | -73.6% | +0.0% | +0.0% |

**Yorum:** ORCL için earnings sonrası IV crush, orta etki yaratacak. Orta senaryoda ATM prim %53 düşer. OTM opsiyonlar tamamen değersizleşebilir.

### 4. EarningsPlay v4 Kontrol Listesi — ORCL

| Kriter | Durum | Değer | Aksiyon |
|--------|-------|-------|---------|
| IV Rank >%50 | ✅ EVET | %83 | SELL PREMIUM |
| VIX <35 | ✅ EVET | 28.5 | NORMAL |
| Delta Toleransı | ✅ UYGUN | 0.020 | DELTA NÖTR |
| Theta Pozitif (IC) | ✅ EVET | Pozitif | THETA AKIŞI İYİ |
| 21 DTE Kuralı | ✅ 3 gun | 3 | IC UYGUN |
| Wing Width | ✅ $21.4 | S/10 = $21.4 | Short Strike ±$21 |
| %50 Kar Kuralı | ✅ TAKIPTE | - | Max Profit'in %50'si -> KAPAT |

**Genel Durum:** ✅ Tüm kriterler olumlu — IC SETUP UYGUN

### 5. Strateji Önerisi (Gün Bazlı) — ORCL

| Gün | Strateji | Günlük PnL Projeksiyonu | Risk | Tavsiye | Pozisyon |
|-----|----------|------------------------|------|---------|----------|
| 8 Haz (2g) | Iron Condor | +$1.54 (theta) | $41 | ⏳ BEKLE/TUT | IC SHORT |
| 8 Haz (2g) | Long Straddle | -$7.46 (theta) | $15 | ⏳ BEKLE (Theta Yanığı) | LONG VEGA |
| 8 Haz (2g) | Long Call Spread | $1.50 (capped) | $2 | ✅ AL (Yönlü) | DIRECTIONAL |
| 8 Haz (2g) | 0DTE | Degisken | ÇOK YÜKSEK | ⏳ HENÜZ DEĞİL |  |
| 9 Haz (1g) | Iron Condor | +$1.59 (theta) | $41 | ⏳ BEKLE/TUT | IC SHORT |
| 9 Haz (1g) | Long Straddle | -$6.28 (theta) | $13 | ✅ AL (Earnings Oyunu) | LONG VEGA |
| 9 Haz (1g) | Long Call Spread | $1.50 (capped) | $2 | ✅ AL (Yönlü) | DIRECTIONAL |
| 9 Haz (1g) | 0DTE | Degisken | ÇOK YÜKSEK | ⏳ HENÜZ DEĞİL |  |
| 10 Haz (0g) | Iron Condor | +$1.74 (theta) | $41 | ⏳ KAPAT | IC SHORT |
| 10 Haz (0g) | Long Straddle | -$4.86 (theta) | $10 | ✅ AL (Earnings Oyunu) | LONG VEGA |
| 10 Haz (0g) | Long Call Spread | $1.50 (capped) | $2 | ✅ AL (Yönlü) | DIRECTIONAL |
| 10 Haz (0g) | 0DTE | Degisken | ÇOK YÜKSEK | ⚠️ YÜKSEK RISK - TECRÜBELİ |  |

---

## 2. CHWY (Chewy Inc) — $20.64

| Metric | Değer |
|--------|-------|
| **Earnings Tarihi** | 10 Haziran 2026 BMO (Piyasa Açılmadan Önce) |
| **Kalan Gün** | 3 gün (7 Haz itibarıyla) |
| **IV30** | %55 (Çok yüksek) |
| **IV Rank** | %89.59 (Çok yüksek) |
| **Dividend Yield** | %0 |
| **Temel Senaryo** | E-ticaret büyümesi, margin baskısı |

### 8 Haziran Pazartesi — Earnings'e 2 Gün — IV: 61.2%

#### ATM Call ($21 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.362 | -0.024 | Delta düşüyor |
| Gamma | 0.7018 | +0.1829 | ⚠️ Yüksek |
| Theta | $-0.12 | $-0.033 | ⚠️ Theta hızlanıyor |
| Vega | $0.014 | $-0.004 | Vega daralıyor |
| Prim | $0.22 | $-0.07 | ⬇️ Prim eriyor |

#### ATM Put ($21 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.638 | -0.023 | Negatif delta |
| Gamma | 0.7018 | +0.1829 | Put-call parity eşleşme |
| Theta | $-0.12 | $-0.032 | Call ile benzer theta |
| Vega | $0.014 | $-0.004 | Call ile eşleşme |
| Prim | $0.50 | $-0.05 | Put-call parity |

#### OTM Call %10 ($23 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.022 | -0.010 | OTM delta — directional |
| Gamma | 0.1771 | +0.0259 | OTM gamma |
| Theta | $-0.008 | $+0.005 | OTM erime hızlı |
| Vega | $0.002 | $-0.001 | Minimal vega |
| Prim | $0.01 | $-0.00 | UCUZ-loto |

#### OTM Put %10 ($19 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.013 | +0.005 | OTM delta |
| Gamma | 0.1012 | +0.0163 | OTM gamma |
| Theta | $-0.002 | $+0.004 | OTM erime |
| Vega | $0.001 | $-0.001 | Minimal |
| Prim | $0.01 | $-0.00 | UCUZ-loto |

### 9 Haziran Salı — Earnings'e 1 Gün — IV: 67.3%

#### ATM Call ($21 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.319 | -0.043 | Delta düşüyor |
| Gamma | 1.2282 | +0.5264 | ⚠️ Yüksek |
| Theta | $-0.24 | $-0.111 | ⚠️ Theta hızlanıyor |
| Vega | $0.009 | $-0.005 | Vega daralıyor |
| Prim | $0.15 | $-0.07 | ⬇️ Prim eriyor |

#### ATM Put ($21 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.681 | -0.043 | Negatif delta |
| Gamma | 1.2282 | +0.5264 | Put-call parity eşleşme |
| Theta | $-0.23 | $-0.109 | Call ile benzer theta |
| Vega | $0.009 | $-0.005 | Call ile eşleşme |
| Prim | $0.39 | $-0.11 | Put-call parity |

#### OTM Call %10 ($23 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.011 | -0.011 | OTM delta — directional |
| Gamma | 0.2560 | +0.0789 | OTM gamma |
| Theta | $-0.002 | $+0.006 | OTM erime hızlı |
| Vega | $0.001 | $-0.001 | Minimal vega |
| Prim | $0.00 | $-0.01 | UCUZ-loto |

#### OTM Put %10 ($19 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.007 | +0.006 | OTM delta |
| Gamma | 0.1589 | +0.0577 | OTM gamma |
| Theta | $-0.001 | $+0.001 | OTM erime |
| Vega | $0.001 | $-0.000 | Minimal |
| Prim | $0.00 | $-0.01 | UCUZ-loto |

### 10 Haziran Çarşamba (EARNINGS GÜNÜ) — Earnings'e 0 Gün — IV: 27.5%

#### ATM Call ($21 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.000 | -0.319 | Delta artıyor |
| Gamma | 0.0159 | -1.2123 | ✅ Normal |
| Theta | $-0.00 | $+0.235 | ✅ Normal |
| Vega | $0.000 | $-0.009 | Vega çok düşük |
| Prim | $0.00 | $-0.15 | 💥 Prim çöküşü |

#### ATM Put ($21 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.000 | +0.681 | Negatif delta |
| Gamma | 0.0159 | -1.2123 | Put-call parity eşleşme |
| Theta | $-0.00 | $+0.235 | Call ile benzer theta |
| Vega | $0.000 | $-0.009 | Call ile eşleşme |
| Prim | $0.00 | $-0.39 | Put-call parity |

#### OTM Call %10 ($23 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.000 | -0.011 | OTM delta — directional |
| Gamma | 0.0000 | -0.2560 | OTM gamma |
| Theta | $-0.00 | $+0.002 | OTM erime hızlı |
| Vega | $0.000 | $-0.001 | Minimal vega |
| Prim | $0.00 | $-0.00 | UCUZ-loto |

#### OTM Put %10 ($19 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.000 | +0.007 | OTM delta |
| Gamma | 0.0000 | -0.1589 | OTM gamma |
| Theta | $-0.00 | $+0.001 | OTM erime |
| Vega | $0.000 | $-0.001 | Minimal |
| Prim | $0.00 | $-0.00 | UCUZ-loto |

### 2. Theta Decay Günlük Takvimi — CHWY

| Gün | TTM (Gün) | ATM Theta | OTM%10 Theta | IV | Toplam Erişim | Uyarı |
|-----|-----------|-----------|-------------|-----|---------------|-------|
| 7 Haz Pazar (Bugün) | 3g | $-0.091 | $-0.013 | 59.1% | %0.0 | ✅ Normal |
| 8 Haz Pazartesi | 2g | $-0.124 | $-0.008 | 61.2% | %0.6 | ⚠️ Hızlanıyor |
| 9 Haz Salı | 1g | $-0.235 | $-0.002 | 67.3% | %1.7 | ⚠️ Hızlanıyor |
| 10 Haz Çarşamba | 0g (EARNINGS) | $-0.000 | $-0.000 | 27.5% | %1.7 | 💥 IV CRUSH GÜNÜ |
| 11 Haz Perşembe | 0g (EARNINGS) | $-0.000 | $-0.000 | 27.5% | %1.7 | 💥 IV CRUSH GÜNÜ |

### 3. IV Crush Projeksiyonu (Earnings Sonrası) — CHWY

| Senaryo | IV Düşüşü | Hump IV → Post IV | ATM Prim Etkisi | OTM%10C Etkisi | OTM%10P Etkisi |
|---------|-----------|-------------------|-----------------|----------------|----------------|
| Hafif Crush | %30 | 79.6% → 55.7% | -46.8% | +0.0% | +0.0% |
| Orta Crush | %50 | 79.6% → 39.8% | -74.5% | +0.0% | +0.0% |
| Sert Crush | %70 | 79.6% → 23.9% | -94.8% | +0.0% | +0.0% |

**Yorum:** CHWY için earnings sonrası IV crush, orta etki yaratacak. Orta senaryoda ATM prim %75 düşer. OTM opsiyonlar tamamen değersizleşebilir.

### 4. EarningsPlay v4 Kontrol Listesi — CHWY

| Kriter | Durum | Değer | Aksiyon |
|--------|-------|-------|---------|
| IV Rank >%50 | ✅ EVET | %90 | SELL PREMIUM |
| VIX <35 | ✅ EVET | 28.5 | NORMAL |
| Delta Toleransı | ✅ UYGUN | 0.020 | DELTA NÖTR |
| Theta Pozitif (IC) | ✅ EVET | Pozitif | THETA AKIŞI İYİ |
| 21 DTE Kuralı | ✅ 3 gun | 3 | IC UYGUN |
| Wing Width | ✅ $2.1 | S/10 = $2.1 | Short Strike ±$2 |
| %50 Kar Kuralı | ✅ TAKIPTE | - | Max Profit'in %50'si -> KAPAT |

**Genel Durum:** ✅ Tüm kriterler olumlu — IC SETUP UYGUN

### 5. Strateji Önerisi (Gün Bazlı) — CHWY

| Gün | Strateji | Günlük PnL Projeksiyonu | Risk | Tavsiye | Pozisyon |
|-----|----------|------------------------|------|---------|----------|
| 8 Haz (2g) | Iron Condor | +$0.19 (theta) | $4 | ⏳ BEKLE/TUT | IC SHORT |
| 8 Haz (2g) | Long Straddle | -$1.11 (theta) | $2 | ⏳ BEKLE (Theta Yanığı) | LONG VEGA |
| 8 Haz (2g) | Long Call Spread | $1.50 (capped) | $2 | ✅ AL (Yönlü) | DIRECTIONAL |
| 8 Haz (2g) | 0DTE | Degisken | ÇOK YÜKSEK | ⏳ HENÜZ DEĞİL |  |
| 9 Haz (1g) | Iron Condor | +$0.20 (theta) | $4 | ⏳ BEKLE/TUT | IC SHORT |
| 9 Haz (1g) | Long Straddle | -$0.89 (theta) | $2 | ✅ AL (Earnings Oyunu) | LONG VEGA |
| 9 Haz (1g) | Long Call Spread | $1.50 (capped) | $2 | ✅ AL (Yönlü) | DIRECTIONAL |
| 9 Haz (1g) | 0DTE | Degisken | ÇOK YÜKSEK | ⏳ HENÜZ DEĞİL |  |
| 10 Haz (0g) | Iron Condor | +$0.25 (theta) | $4 | ⏳ KAPAT | IC SHORT |
| 10 Haz (0g) | Long Straddle | -$0.62 (theta) | $1 | ✅ AL (Earnings Oyunu) | LONG VEGA |
| 10 Haz (0g) | Long Call Spread | $1.50 (capped) | $2 | ✅ AL (Yönlü) | DIRECTIONAL |
| 10 Haz (0g) | 0DTE | Degisken | ÇOK YÜKSEK | ⚠️ YÜKSEK RISK - TECRÜBELİ |  |

---

## 3. ADBE (Adobe Inc) — $251.44

| Metric | Değer |
|--------|-------|
| **Earnings Tarihi** | 11 Haziran 2026 AMC (Piyasa Kapandıktan Sonra) |
| **Kalan Gün** | 4 gün (7 Haz itibarıyla) |
| **IV30** | %62 (En yüksek) |
| **IV Rank** | %100 (Maksimum) |
| **Dividend Yield** | %0 |
| **Temel Senaryo** | AI revenue, Figma deal etkisi |

### 8 Haziran Pazartesi — Earnings'e 3 Gün — IV: 67.2%

#### ATM Call ($251 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.526 | -0.001 | Delta artıyor |
| Gamma | 0.0390 | +0.0074 | ✅ Normal |
| Theta | $-1.31 | $-0.253 | ⚠️ Theta hızlanıyor — günlük kayıp artıyor |
| Vega | $0.077 | $-0.012 | Vega daralıyor |
| Prim | $6.37 | $-0.82 | ⬇️ Prim eriyor |

#### ATM Put ($251 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.474 | +0.001 | Negatif delta |
| Gamma | 0.0390 | +0.0074 | Put-call parity eşleşme |
| Theta | $-1.27 | $-0.250 | Call ile benzer theta |
| Vega | $0.077 | $-0.012 | Call ile eşleşme |
| Prim | $5.84 | $-0.79 | Put-call parity |

#### OTM Call %10 ($277 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.187 | -0.013 | OTM delta — directional |
| Gamma | 0.0117 | -0.0008 | OTM gamma |
| Theta | $-0.064 | $+0.002 | OTM erime hızlı |
| Vega | $0.015 | $-0.002 | Minimal vega |
| Prim | $1.30 | $-0.32 | UCUZ |

#### OTM Put %10 ($226 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.132 | +0.015 | OTM delta |
| Gamma | 0.0099 | +0.0011 | OTM gamma |
| Theta | $-0.040 | $-0.006 | OTM erime |
| Vega | $0.012 | $-0.001 | Minimal |
| Prim | $0.64 | $-0.15 | UCUZ |

### 9 Haziran Salı — Earnings'e 2 Gün — IV: 69.8%

#### ATM Call ($251 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.526 | +0.000 | Delta nötr bölge |
| Gamma | 0.0537 | +0.0147 | ⚠️ Yüksek — Delta değişim hızı yükseliyor |
| Theta | $-1.83 | $-0.524 | ⚠️ Theta hızlanıyor — günlük kayıp artıyor |
| Vega | $0.068 | $-0.009 | Vega daralıyor |
| Prim | $5.43 | $-0.94 | ⬇️ Prim eriyor |

#### ATM Put ($251 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.474 | +0.000 | Negatif delta |
| Gamma | 0.0537 | +0.0147 | Put-call parity eşleşme |
| Theta | $-1.79 | $-0.520 | Call ile benzer theta |
| Vega | $0.068 | $-0.009 | Call ile eşleşme |
| Prim | $4.93 | $-0.91 | Put-call parity |

#### OTM Call %10 ($277 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.170 | -0.017 | OTM delta — directional |
| Gamma | 0.0098 | -0.0019 | OTM gamma |
| Theta | $-0.054 | $+0.010 | OTM erime hızlı |
| Vega | $0.013 | $-0.002 | Minimal vega |
| Prim | $0.99 | $-0.31 | UCUZ |

#### OTM Put %10 ($226 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.145 | -0.013 | OTM delta |
| Gamma | 0.0087 | -0.0012 | OTM gamma |
| Theta | $-0.033 | $+0.007 | OTM erime |
| Vega | $0.011 | $-0.001 | Minimal |
| Prim | $0.49 | $-0.15 | UCUZ |

### 10 Haziran Çarşamba — Earnings'e 1 Gün — IV: 77.5%

#### ATM Call ($251 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.527 | +0.001 | Delta artıyor |
| Gamma | 0.0976 | +0.0439 | ⚠️ Yüksek — Delta değişim hızı yükseliyor |
| Theta | $-3.68 | $-1.852 | 🔥 THETA ŞOK |
| Vega | $0.052 | $-0.016 | Vega daralıyor |
| Prim | $4.30 | $-1.13 | ⬇️ Prim eriyor |

#### ATM Put ($251 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.473 | +0.001 | Negatif delta |
| Gamma | 0.0976 | +0.0439 | Put-call parity eşleşme |
| Theta | $-3.63 | $-1.842 | Call ile benzer theta |
| Vega | $0.052 | $-0.016 | Call ile eşleşme |
| Prim | $3.83 | $-1.10 | Put-call parity |

#### OTM Call %10 ($277 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.148 | -0.022 | OTM delta — directional |
| Gamma | 0.0060 | -0.0038 | OTM gamma |
| Theta | $-0.022 | $+0.032 | OTM erime hızlı |
| Vega | $0.008 | $-0.005 | Minimal vega |
| Prim | $0.66 | $-0.33 | UCUZ-loto |

#### OTM Put %10 ($226 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.152 | -0.007 | OTM delta |
| Gamma | 0.0029 | -0.0058 | OTM gamma |
| Theta | $-0.011 | $+0.022 | OTM erime |
| Vega | $0.004 | $-0.007 | Minimal |
| Prim | $0.32 | $-0.17 | UCUZ-loto |

### 11 Haziran Perşembe (EARNINGS GÜNÜ) — Earnings'e 0 Gün — IV: 31.0%

#### ATM Call ($251 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.635 | +0.108 | Delta artıyor |
| Gamma | 1.4561 | +1.3585 | ⚠️ GAMMA PATLAMA! |
| Theta | $-7.33 | $-3.647 | 🔥 THETA ŞOK |
| Vega | $0.018 | $-0.034 | Vega çok düşük |
| Prim | $0.77 | $-3.53 | 💥 Prim çöküşü |

#### ATM Put ($251 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.365 | +0.108 | Negatif delta |
| Gamma | 1.4561 | +1.3585 | Put-call parity eşleşme |
| Theta | $-7.24 | $-3.607 | Call ile benzer theta |
| Vega | $0.018 | $-0.034 | Call ile eşleşme |
| Prim | $0.32 | $-3.51 | Put-call parity |

#### OTM Call %10 ($277 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.296 | +0.148 | OTM delta — directional |
| Gamma | 0.0137 | +0.0077 | OTM gamma |
| Theta | $-0.071 | $-0.049 | OTM erime hızlı |
| Vega | $0.003 | $-0.005 | Minimal vega |
| Prim | $0.02 | $-0.64 | UCUZ-loto |

#### OTM Put %10 ($226 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.117 | +0.035 | OTM delta |
| Gamma | 0.0072 | +0.0043 | OTM gamma |
| Theta | $-0.028 | $-0.017 | OTM erime |
| Vega | $0.002 | $-0.002 | Minimal |
| Prim | $0.01 | $-0.31 | UCUZ-loto |

### 2. Theta Decay Günlük Takvimi — ADBE

| Gün | TTM (Gün) | ATM Theta | OTM%10 Theta | IV | Toplam Erişim | Uyarı |
|-----|-----------|-----------|-------------|-----|---------------|-------|
| 7 Haz Pazar (Bugün) | 4g | $-1.054 | $-0.071 | 65.9% | %0.0 | ✅ Normal |
| 8 Haz Pazartesi | 3g | $-1.307 | $-0.065 | 67.2% | %0.6 | ⚠️ Hızlanıyor |
| 9 Haz Salı | 2g | $-1.831 | $-0.045 | 69.8% | %1.3 | ⚠️ Hızlanıyor |
| 10 Haz Çarşamba | 1g | $-3.683 | $-0.017 | 77.5% | %2.8 | 🔥 THETA MAKS |
| 11 Haz Perşembe | 0g (EARNINGS) | $-7.330 | $-0.039 | 31.0% | %5.7 | 💥 IV CRUSH GÜNÜ |

### 3. IV Crush Projeksiyonu (Earnings Sonrası) — ADBE

| Senaryo | IV Düşüşü | Hump IV → Post IV | ATM Prim Etkisi | OTM%10C Etkisi | OTM%10P Etkisi |
|---------|-----------|-------------------|-----------------|----------------|----------------|
| Hafif Crush | %30 | 93.0% → 65.1% | -28.6% | -94.7% | -96.7% |
| Orta Crush | %50 | 93.0% → 46.5% | -47.6% | -100.0% | -100.0% |
| Sert Crush | %70 | 93.0% → 27.9% | -66.6% | -100.0% | -100.0% |

**Yorum:** ADBE için earnings sonrası IV crush, sert etki yaratacak. Orta senaryoda ATM prim %48 düşer. OTM opsiyonlar tamamen değersizleşebilir.

### 4. EarningsPlay v4 Kontrol Listesi — ADBE

| Kriter | Durum | Değer | Aksiyon |
|--------|-------|-------|---------|
| IV Rank >%50 | ✅ EVET | %100 | SELL PREMIUM |
| VIX <35 | ✅ EVET | 28.5 | NORMAL |
| Delta Toleransı | ✅ UYGUN | 0.020 | DELTA NÖTR |
| Theta Pozitif (IC) | ✅ EVET | Pozitif | THETA AKIŞI İYİ |
| 21 DTE Kuralı | ✅ 4 gun | 4 | IC UYGUN |
| Wing Width | ✅ $25.1 | S/10 = $25.1 | Short Strike ±$25 |
| %50 Kar Kuralı | ✅ TAKIPTE | - | Max Profit'in %50'si -> KAPAT |

**Genel Durum:** ✅ Tüm kriterler olumlu — IC SETUP UYGUN

### 5. Strateji Önerisi (Gün Bazlı) — ADBE

| Gün | Strateji | Günlük PnL Projeksiyonu | Risk | Tavsiye | Pozisyon |
|-----|----------|------------------------|------|---------|----------|
| 8 Haz (3g) | Iron Condor | +$1.89 (theta) | $50 | ⏳ BEKLE/TUT | IC SHORT |
| 8 Haz (3g) | Long Straddle | -$9.40 (theta) | $19 | ⏳ BEKLE (Theta Yanığı) | LONG VEGA |
| 8 Haz (3g) | Long Call Spread | $1.50 (capped) | $2 | ✅ AL (Yönlü) | DIRECTIONAL |
| 8 Haz (3g) | 0DTE | Degisken | ÇOK YÜKSEK | ⏳ HENÜZ DEĞİL |  |
| 9 Haz (2g) | Iron Condor | +$1.95 (theta) | $50 | ⏳ BEKLE/TUT | IC SHORT |
| 9 Haz (2g) | Long Straddle | -$8.26 (theta) | $17 | ⏳ BEKLE (Theta Yanığı) | LONG VEGA |
| 9 Haz (2g) | Long Call Spread | $1.50 (capped) | $2 | ✅ AL (Yönlü) | DIRECTIONAL |
| 9 Haz (2g) | 0DTE | Degisken | ÇOK YÜKSEK | ⏳ HENÜZ DEĞİL |  |
| 10 Haz (1g) | Iron Condor | +$2.09 (theta) | $50 | ⏳ KAPAT | IC SHORT |
| 10 Haz (1g) | Long Straddle | -$6.76 (theta) | $14 | ✅ AL (Earnings Oyunu) | LONG VEGA |
| 10 Haz (1g) | Long Call Spread | $1.50 (capped) | $2 | ✅ AL (Yönlü) | DIRECTIONAL |
| 10 Haz (1g) | 0DTE | Degisken | ÇOK YÜKSEK | ⚠️ YÜKSEK RISK - TECRÜBELİ |  |
| 11 Haz (0g) | Iron Condor | +$0.85 (theta) | $50 | ❌ CIK | IC SHORT |
| 11 Haz (0g) | Long Straddle | -$0.00 (theta) | $0 | ✅ AL (Earnings Oyunu) | LONG VEGA |
| 11 Haz (0g) | Long Call Spread | $1.50 (capped) | $2 | ✅ AL (Yönlü) | DIRECTIONAL |
| 11 Haz (0g) | 0DTE | Degisken | ÇOK YÜKSEK | ⚠️ YÜKSEK RISK - TECRÜBELİ |  |

---

## 4. FDX (FedEx Corp) — $331.00

| Metric | Değer |
|--------|-------|
| **Earnings Tarihi** | 23 Haziran 2026 AMC |
| **Kalan Gün** | 16 gün (7 Haz itibarıyla) |
| **IV30** | %38 (Ilımlı) |
| **IV Rank** | %76.26 (Yüksek) |
| **Dividend Yield** | %1.8 |
| **Temel Senaryo** | Lojistik talebi, fuel cost etkisi |

### 8 Haziran Pazartesi — Earnings'e 15 Gün — IV: 39.4%

#### ATM Call ($331 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.530 | +0.001 | Delta nötr bölge |
| Gamma | 0.0175 | +0.0003 | ✅ Normal |
| Theta | $-0.31 | $-0.000 | ✅ Normal |
| Vega | $0.300 | $-0.006 | Vega etkili |
| Prim | $9.48 | $-0.07 | ⬇️ Prim eriyor |

#### ATM Put ($331 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.470 | +0.002 | Negatif delta |
| Gamma | 0.0175 | +0.0003 | Put-call parity eşleşme |
| Theta | $-0.29 | $+0.001 | Call ile benzer theta |
| Vega | $0.300 | $-0.006 | Call ile eşleşme |
| Prim | $7.60 | $+0.02 | Put-call parity |

#### OTM Call %10 ($364 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.249 | +0.001 | OTM delta — directional |
| Gamma | 0.0132 | -0.0002 | OTM gamma |
| Theta | $-0.202 | $+0.001 | OTM erime hızlı |
| Vega | $0.225 | $-0.005 | Minimal vega |
| Prim | $2.55 | $-0.02 | Değerli |

#### OTM Put %10 ($298 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.177 | +0.000 | OTM delta |
| Gamma | 0.0114 | -0.0002 | OTM gamma |
| Theta | $-0.152 | $+0.003 | OTM erime |
| Vega | $0.195 | $-0.004 | Minimal |
| Prim | $1.20 | $+0.02 | Değerli |

### 9 Haziran Salı — Earnings'e 14 Gün — IV: 39.8%

#### ATM Call ($331 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.531 | +0.001 | Delta artıyor |
| Gamma | 0.0178 | +0.0003 | ✅ Normal |
| Theta | $-0.32 | $-0.001 | ✅ Normal |
| Vega | $0.294 | $-0.006 | Vega etkili |
| Prim | $9.41 | $-0.07 | ⬇️ Prim eriyor |

#### ATM Put ($331 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.469 | +0.000 | Negatif delta |
| Gamma | 0.0178 | +0.0003 | Put-call parity eşleşme |
| Theta | $-0.30 | $-0.001 | Call ile benzer theta |
| Vega | $0.294 | $-0.006 | Call ile eşleşme |
| Prim | $7.62 | $+0.02 | Put-call parity |

#### OTM Call %10 ($364 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.250 | +0.001 | OTM delta — directional |
| Gamma | 0.0130 | -0.0002 | OTM gamma |
| Theta | $-0.201 | $+0.001 | OTM erime hızlı |
| Vega | $0.220 | $-0.005 | Minimal vega |
| Prim | $2.53 | $-0.02 | Değerli |

#### OTM Put %10 ($298 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.177 | +0.000 | OTM delta |
| Gamma | 0.0112 | -0.0002 | OTM gamma |
| Theta | $-0.149 | $+0.003 | OTM erime |
| Vega | $0.190 | $-0.005 | Minimal |
| Prim | $1.22 | $+0.02 | Değerli |

### 10 Haziran Çarşamba — Earnings'e 13 Gün — IV: 40.2%

#### ATM Call ($331 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.532 | +0.001 | Delta artıyor |
| Gamma | 0.0181 | +0.0003 | ✅ Normal |
| Theta | $-0.33 | $-0.001 | ✅ Normal |
| Vega | $0.288 | $-0.006 | Vega daralıyor |
| Prim | $9.34 | $-0.07 | ⬇️ Prim eriyor |

#### ATM Put ($331 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.468 | +0.001 | Negatif delta |
| Gamma | 0.0181 | +0.0003 | Put-call parity eşleşme |
| Theta | $-0.31 | $-0.001 | Call ile benzer theta |
| Vega | $0.288 | $-0.006 | Call ile eşleşme |
| Prim | $7.64 | $+0.02 | Put-call parity |

#### OTM Call %10 ($364 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.251 | +0.001 | OTM delta — directional |
| Gamma | 0.0128 | -0.0002 | OTM gamma |
| Theta | $-0.200 | $+0.001 | OTM erime hızlı |
| Vega | $0.215 | $-0.005 | Minimal vega |
| Prim | $2.51 | $-0.02 | Değerli |

#### OTM Put %10 ($298 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.177 | +0.000 | OTM delta |
| Gamma | 0.0110 | -0.0002 | OTM gamma |
| Theta | $-0.146 | $+0.003 | OTM erime |
| Vega | $0.186 | $-0.004 | Minimal |
| Prim | $1.24 | $+0.02 | Değerli |

### 11 Haziran Perşembe — Earnings'e 12 Gün — IV: 40.6%

#### ATM Call ($331 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.533 | +0.001 | Delta artıyor |
| Gamma | 0.0184 | +0.0003 | ✅ Normal |
| Theta | $-0.33 | $-0.001 | ✅ Normal |
| Vega | $0.283 | $-0.005 | Vega daralıyor |
| Prim | $9.27 | $-0.07 | ⬇️ Prim eriyor |

#### ATM Put ($331 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.467 | +0.001 | Negatif delta |
| Gamma | 0.0184 | +0.0003 | Put-call parity eşleşme |
| Theta | $-0.31 | $-0.001 | Call ile benzer theta |
| Vega | $0.283 | $-0.005 | Call ile eşleşme |
| Prim | $7.66 | $+0.02 | Put-call parity |

#### OTM Call %10 ($364 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.252 | +0.001 | OTM delta — directional |
| Gamma | 0.0126 | -0.0002 | OTM gamma |
| Theta | $-0.199 | $+0.001 | OTM erime hızlı |
| Vega | $0.211 | $-0.004 | Minimal vega |
| Prim | $2.49 | $-0.02 | Değerli |

#### OTM Put %10 ($298 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.177 | +0.000 | OTM delta |
| Gamma | 0.0108 | -0.0002 | OTM gamma |
| Theta | $-0.143 | $+0.003 | OTM erime |
| Vega | $0.182 | $-0.004 | Minimal |
| Prim | $1.26 | $+0.02 | Değerli |

### 2. Theta Decay Günlük Takvimi — FDX

| Gün | TTM (Gün) | ATM Theta | OTM%10 Theta | IV | Toplam Erişim | Uyarı |
|-----|-----------|-----------|-------------|-----|---------------|-------|
| 7 Haz Pazar (Bugün) | 16g | $-0.258 | $-0.169 | 38.8% | %0.0 | ✅ Normal |
| 8 Haz Pazartesi | 15g | $-0.270 | $-0.175 | 39.4% | %0.1 | ✅ Normal |
| 9 Haz Salı | 14g | $-0.282 | $-0.181 | 39.8% | %0.2 | ✅ Normal |
| 10 Haz Çarşamba | 13g | $-0.295 | $-0.187 | 40.2% | %0.3 | ✅ Normal |
| 11 Haz Perşembe | 12g | $-0.309 | $-0.194 | 40.6% | %0.4 | ✅ Normal |

### 3. IV Crush Projeksiyonu (Earnings Sonrası) — FDX

| Senaryo | IV Düşüşü | Hump IV → Post IV | ATM Prim Etkisi | OTM%10C Etkisi | OTM%10P Etkisi |
|---------|-----------|-------------------|-----------------|----------------|----------------|
| Hafif Crush | %30 | 52.5% → 36.8% | -29.9% | +0.0% | +0.0% |
| Orta Crush | %50 | 52.5% → 26.3% | -49.8% | +0.0% | +0.0% |
| Sert Crush | %70 | 52.5% → 15.8% | -69.8% | +0.0% | +0.0% |

**Yorum:** FDX için earnings sonrası IV crush, orta etki yaratacak. Orta senaryoda ATM prim %50 düşer. OTM opsiyonlar tamamen değersizleşebilir.

### 4. EarningsPlay v4 Kontrol Listesi — FDX

| Kriter | Durum | Değer | Aksiyon |
|--------|-------|-------|---------|
| IV Rank >%50 | ✅ EVET | %76 | SELL PREMIUM |
| VIX <35 | ✅ EVET | 28.5 | NORMAL |
| Delta Toleransı | ✅ UYGUN | 0.020 | DELTA NÖTR |
| Theta Pozitif (IC) | ✅ EVET | Pozitif | THETA AKIŞI İYİ |
| 21 DTE Kuralı | ✅ 16 gun | 16 | IC UYGUN |
| Wing Width | ✅ $33.1 | S/10 = $33.1 | Short Strike ±$33 |
| %50 Kar Kuralı | ✅ TAKIPTE | - | Max Profit'in %50'si -> KAPAT |

**Genel Durum:** ✅ Tüm kriterler olumlu — IC SETUP UYGUN

### 5. Strateji Önerisi (Gün Bazlı) — FDX

| Gün | Strateji | Günlük PnL Projeksiyonu | Risk | Tavsiye | Pozisyon |
|-----|----------|------------------------|------|---------|----------|
| 8 Haz (15g) | Iron Condor | +$2.26 (theta) | $60 | ✅ YENI AC | IC SHORT |
| 8 Haz (15g) | Long Straddle | -$11.59 (theta) | $23 | ⏳ BEKLE (Theta Yanığı) | LONG VEGA |
| 8 Haz (15g) | Long Call Spread | $1.50 (capped) | $2 | ✅ AL (Yönlü) | DIRECTIONAL |
| 8 Haz (15g) | 0DTE | Degisken | ÇOK YÜKSEK | ⏳ HENÜZ DEĞİL |  |
| 9 Haz (14g) | Iron Condor | +$2.28 (theta) | $60 | ✅ YENI AC | IC SHORT |
| 9 Haz (14g) | Long Straddle | -$11.62 (theta) | $23 | ⏳ BEKLE (Theta Yanığı) | LONG VEGA |
| 9 Haz (14g) | Long Call Spread | $1.50 (capped) | $2 | ✅ AL (Yönlü) | DIRECTIONAL |
| 9 Haz (14g) | 0DTE | Degisken | ÇOK YÜKSEK | ⏳ HENÜZ DEĞİL |  |
| 10 Haz (13g) | Iron Condor | +$2.30 (theta) | $60 | ✅ YENI AC | IC SHORT |
| 10 Haz (13g) | Long Straddle | -$11.66 (theta) | $23 | ⏳ BEKLE (Theta Yanığı) | LONG VEGA |
| 10 Haz (13g) | Long Call Spread | $1.50 (capped) | $2 | ✅ AL (Yönlü) | DIRECTIONAL |
| 10 Haz (13g) | 0DTE | Degisken | ÇOK YÜKSEK | ⏳ HENÜZ DEĞİL |  |
| 11 Haz (12g) | Iron Condor | +$2.32 (theta) | $60 | ✅ YENI AC | IC SHORT |
| 11 Haz (12g) | Long Straddle | -$11.69 (theta) | $23 | ⏳ BEKLE (Theta Yanığı) | LONG VEGA |
| 11 Haz (12g) | Long Call Spread | $1.50 (capped) | $2 | ✅ AL (Yönlü) | DIRECTIONAL |
| 11 Haz (12g) | 0DTE | Degisken | ÇOK YÜKSEK | ⏳ HENÜZ DEĞİL |  |

---

## 5. MU (Micron Technology) — $86.01

| Metric | Değer |
|--------|-------|
| **Earnings Tarihi** | 24 Haziran 2026 AMC |
| **Kalan Gün** | 17 gün (7 Haz itibarıyla) |
| **IV30** | %58 (Yüksek) |
| **IV Rank** | %100 (Maksimum) |
| **Dividend Yield** | %0.4 |
| **Temel Senaryo** | Memory cycle, AI chip demand |

### 8 Haziran Pazartesi — Earnings'e 16 Gün — IV: 59.8%

#### ATM Call ($86 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.542 | -0.002 | Delta artıyor |
| Gamma | 0.0560 | -0.0026 | ✅ Normal |
| Theta | $-0.76 | $+0.030 | ✅ Normal |
| Vega | $0.223 | $-0.012 | Vega etkili |
| Prim | $5.66 | $-0.28 | ⬇️ Prim eriyor |

#### ATM Put ($86 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.458 | -0.004 | Negatif delta |
| Gamma | 0.0560 | -0.0026 | Put-call parity eşleşme |
| Theta | $-0.73 | $+0.031 | Call ile benzer theta |
| Vega | $0.223 | $-0.012 | Call ile eşleşme |
| Prim | $4.73 | $-0.29 | Put-call parity |

#### OTM Call %10 ($95 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.288 | -0.007 | OTM delta — directional |
| Gamma | 0.0470 | -0.0022 | OTM gamma |
| Theta | $-0.578 | $+0.026 | OTM erime hızlı |
| Vega | $0.187 | $-0.010 | Minimal vega |
| Prim | $2.13 | $-0.22 | Değerli |

#### OTM Put %10 ($77 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.188 | -0.004 | OTM delta |
| Gamma | 0.0401 | -0.0025 | OTM gamma |
| Theta | $-0.444 | $+0.021 | OTM erime |
| Vega | $0.160 | $-0.008 | Minimal |
| Prim | $1.00 | $-0.17 | Değerli |

### 9 Haziran Salı — Earnings'e 15 Gün — IV: 60.5%

#### ATM Call ($86 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.540 | -0.002 | Delta nötr bölge |
| Gamma | 0.0534 | -0.0026 | ✅ Normal |
| Theta | $-0.79 | $-0.030 | ✅ Normal |
| Vega | $0.218 | $-0.005 | Vega etkili |
| Prim | $5.38 | $-0.28 | ⬇️ Prim eriyor |

#### ATM Put ($86 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.460 | -0.002 | Negatif delta |
| Gamma | 0.0534 | -0.0026 | Put-call parity eşleşme |
| Theta | $-0.76 | $-0.030 | Call ile benzer theta |
| Vega | $0.218 | $-0.005 | Call ile eşleşme |
| Prim | $4.44 | $-0.29 | Put-call parity |

#### OTM Call %10 ($95 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.281 | -0.007 | OTM delta — directional |
| Gamma | 0.0448 | -0.0022 | OTM gamma |
| Theta | $-0.604 | $-0.026 | OTM erime hızlı |
| Vega | $0.183 | $-0.004 | Minimal vega |
| Prim | $1.91 | $-0.22 | Değerli |

#### OTM Put %10 ($77 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.192 | -0.004 | OTM delta |
| Gamma | 0.0376 | -0.0025 | OTM gamma |
| Theta | $-0.465 | $-0.021 | OTM erime |
| Vega | $0.152 | $-0.008 | Minimal |
| Prim | $0.83 | $-0.17 | Değerli |

### 10 Haziran Çarşamba — Earnings'e 14 Gün — IV: 61.2%

#### ATM Call ($86 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.538 | -0.002 | Delta nötr bölge |
| Gamma | 0.0509 | -0.0025 | ✅ Normal |
| Theta | $-0.83 | $-0.040 | ✅ Normal |
| Vega | $0.213 | $-0.005 | Vega daralıyor |
| Prim | $5.10 | $-0.28 | ⬇️ Prim eriyor |

#### ATM Put ($86 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.462 | -0.002 | Negatif delta |
| Gamma | 0.0509 | -0.0025 | Put-call parity eşleşme |
| Theta | $-0.80 | $-0.040 | Call ile benzer theta |
| Vega | $0.213 | $-0.005 | Call ile eşleşme |
| Prim | $4.15 | $-0.29 | Put-call parity |

#### OTM Call %10 ($95 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.274 | -0.007 | OTM delta — directional |
| Gamma | 0.0426 | -0.0022 | OTM gamma |
| Theta | $-0.630 | $-0.026 | OTM erime hızlı |
| Vega | $0.179 | $-0.004 | Minimal vega |
| Prim | $1.69 | $-0.22 | Değerli |

#### OTM Put %10 ($77 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.196 | -0.004 | OTM delta |
| Gamma | 0.0351 | -0.0025 | OTM gamma |
| Theta | $-0.486 | $-0.021 | OTM erime |
| Vega | $0.144 | $-0.008 | Minimal |
| Prim | $0.66 | $-0.17 | Değerli |

### 11 Haziran Perşembe — Earnings'e 13 Gün — IV: 61.9%

#### ATM Call ($86 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.536 | -0.002 | Delta nötr bölge |
| Gamma | 0.0484 | -0.0025 | ✅ Normal |
| Theta | $-0.87 | $-0.040 | ✅ Normal |
| Vega | $0.208 | $-0.005 | Vega daralıyor |
| Prim | $4.82 | $-0.28 | ⬇️ Prim eriyor |

#### ATM Put ($86 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.464 | -0.002 | Negatif delta |
| Gamma | 0.0484 | -0.0025 | Put-call parity eşleşme |
| Theta | $-0.84 | $-0.040 | Call ile benzer theta |
| Vega | $0.208 | $-0.005 | Call ile eşleşme |
| Prim | $3.86 | $-0.29 | Put-call parity |

#### OTM Call %10 ($95 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | 0.267 | -0.007 | OTM delta — directional |
| Gamma | 0.0404 | -0.0022 | OTM gamma |
| Theta | $-0.656 | $-0.026 | OTM erime hızlı |
| Vega | $0.175 | $-0.004 | Minimal vega |
| Prim | $1.47 | $-0.22 | Değerli |

#### OTM Put %10 ($77 Strike)
| Greek | Değer | 1 Gün Değişim | Risk Uyarısı |
|-------|-------|---------------|-------------|
| Delta | -0.200 | -0.004 | OTM delta |
| Gamma | 0.0326 | -0.0025 | OTM gamma |
| Theta | $-0.507 | $-0.021 | OTM erime |
| Vega | $0.136 | $-0.008 | Minimal |
| Prim | $0.49 | $-0.17 | Değerli |

### 2. Theta Decay Günlük Takvimi — MU

| Gün | TTM (Gün) | ATM Theta | OTM%10 Theta | IV | Toplam Erişim | Uyarı |
|-----|-----------|-----------|-------------|-----|---------------|-------|
| 7 Haz Pazar (Bugün) | 17g | $-0.683 | $-0.518 | 58.5% | %0.0 | ✅ Normal |
| 8 Haz Pazartesi | 16g | $-0.716 | $-0.546 | 59.8% | %0.9 | ✅ Normal |
| 9 Haz Salı | 15g | $-0.750 | $-0.575 | 60.5% | %1.8 | ✅ Normal |
| 10 Haz Çarşamba | 14g | $-0.787 | $-0.605 | 61.2% | %2.7 | ✅ Normal |
| 11 Haz Perşembe | 13g | $-0.825 | $-0.636 | 61.9% | %3.7 | ✅ Normal |

### 3. IV Crush Projeksiyonu (Earnings Sonrası) — MU

| Senaryo | IV Düşüşü | Hump IV → Post IV | ATM Prim Etkisi | OTM%10C Etkisi | OTM%10P Etkisi |
|---------|-----------|-------------------|-----------------|----------------|----------------|
| Hafif Crush | %30 | 87.0% → 60.9% | -29.8% | -96.6% | +0.0% |
| Orta Crush | %50 | 87.0% → 43.5% | -49.7% | -100.0% | +0.0% |
| Sert Crush | %70 | 87.0% → 26.1% | -69.6% | -100.0% | +0.0% |

**Yorum:** MU için earnings sonrası IV crush, orta etki yaratacak. Orta senaryoda ATM prim %50 düşer. OTM opsiyonlar tamamen değersizleşebilir.

### 4. EarningsPlay v4 Kontrol Listesi — MU

| Kriter | Durum | Değer | Aksiyon |
|--------|-------|-------|---------|
| IV Rank >%50 | ✅ EVET | %100 | SELL PREMIUM |
| VIX <35 | ✅ EVET | 28.5 | NORMAL |
| Delta Toleransı | ✅ UYGUN | 0.020 | DELTA NÖTR |
| Theta Pozitif (IC) | ✅ EVET | Pozitif | THETA AKIŞI İYİ |
| 21 DTE Kuralı | ✅ 17 gun | 17 | IC UYGUN |
| Wing Width | ✅ $8.6 | S/10 = $8.6 | Short Strike ±$9 |
| %50 Kar Kuralı | ✅ TAKIPTE | - | Max Profit'in %50'si -> KAPAT |

**Genel Durum:** ✅ Tüm kriterler olumlu — IC SETUP UYGUN

### 5. Strateji Önerisi (Gün Bazlı) — MU

| Gün | Strateji | Günlük PnL Projeksiyonu | Risk | Tavsiye | Pozisyon |
|-----|----------|------------------------|------|---------|----------|
| 8 Haz (16g) | Iron Condor | +$0.66 (theta) | $17 | ✅ YENI AC | IC SHORT |
| 8 Haz (16g) | Long Straddle | -$3.49 (theta) | $7 | ⏳ BEKLE (Theta Yanığı) | LONG VEGA |
| 8 Haz (16g) | Long Call Spread | $1.50 (capped) | $2 | ✅ AL (Yönlü) | DIRECTIONAL |
| 8 Haz (16g) | 0DTE | Degisken | ÇOK YÜKSEK | ⏳ HENÜZ DEĞİL |  |
| 9 Haz (15g) | Iron Condor | +$0.67 (theta) | $17 | ✅ YENI AC | IC SHORT |
| 9 Haz (15g) | Long Straddle | -$3.51 (theta) | $7 | ⏳ BEKLE (Theta Yanığı) | LONG VEGA |
| 9 Haz (15g) | Long Call Spread | $1.50 (capped) | $2 | ✅ AL (Yönlü) | DIRECTIONAL |
| 9 Haz (15g) | 0DTE | Degisken | ÇOK YÜKSEK | ⏳ HENÜZ DEĞİL |  |
| 10 Haz (14g) | Iron Condor | +$0.68 (theta) | $17 | ✅ YENI AC | IC SHORT |
| 10 Haz (14g) | Long Straddle | -$3.53 (theta) | $7 | ⏳ BEKLE (Theta Yanığı) | LONG VEGA |
| 10 Haz (14g) | Long Call Spread | $1.50 (capped) | $2 | ✅ AL (Yönlü) | DIRECTIONAL |
| 10 Haz (14g) | 0DTE | Degisken | ÇOK YÜKSEK | ⏳ HENÜZ DEĞİL |  |
| 11 Haz (13g) | Iron Condor | +$0.69 (theta) | $17 | ✅ YENI AC | IC SHORT |
| 11 Haz (13g) | Long Straddle | -$3.55 (theta) | $7 | ⏳ BEKLE (Theta Yanığı) | LONG VEGA |
| 11 Haz (13g) | Long Call Spread | $1.50 (capped) | $2 | ✅ AL (Yönlü) | DIRECTIONAL |
| 11 Haz (13g) | 0DTE | Degisken | ÇOK YÜKSEK | ⏳ HENÜZ DEĞİL |  |

---

## CROSS-ASSET ANALIZ ve GENEL STRATEJI

### Haftalık Takvim (8-11 Haziran)

| Tarih | Olay | Etkilenen Hisseler | Strateji |
|-------|------|-------------------|----------|
| 8 Haz Pazartesi | NFP sonrası 1. işlem günü | TÜMÜ | Pozisyon küçült, IV hump zirve yaklaşıyor |
| 9 Haz Salı | Son işlem günü (ORCL/CHWY için) | ORCL, CHWY | **Delta hedge, pozisyon kapat** |
| 10 Haz Çarşamba | ORCL+CHWY Earnings | ORCL, CHWY | **AVOID yeni pozisyon — IV crush riski** |
| 11 Haz Perşembe | ADBE Earnings + IV crush başlangıcı | ADBE, ORCL, CHWY | **IC kapama zamanı, long vega pozisyonları aç** |

### Theta Decay Hızları (8-11 Haziran Karşılaştırması)

| Hisse | 8 Haz Theta | 9 Haz Theta | 10 Haz Theta | Theta Hızlanma |
|-------|-------------|-------------|--------------|----------------|
| ORCL | -$1.11 | -$2.20 | -$4.42 | **4x** |
| CHWY | -$0.12 | -$0.24 | -$0.00 | **2x → 0 (IV Crush)** |
| ADBE | -$1.31 | -$1.83 | -$3.68 | **2.8x** |
| FDX | -$0.31 | -$0.32 | -$0.33 | **1.1x (Yavaş)** |
| MU | -$0.80 | -$0.83 | -$0.87 | **1.1x (Yavaş)** |

### Ana Strateji Önerileri

**8 Haziran Pazartesi (Bugün):**
- ✅ ORCL/CHWY: Mevcut IC pozisyonlarını TUT, %50 kar varsa KAPAT
- ✅ ADBE: Yeni IC setup kurma zamanı (4 gün vade)
- ✅ FDX/MU: IC setup kurma zamanı (16-17 gün vade = ideal)
- ⚠️ Tüm hisselerde VIX yüksekliği nedeniyle position size küçült

**9 Haziran Salı:**
- ⚠️ ORCL/CHWY: **SON Çıkış Günü** — 1 gün kala theta çok ağır
- ✅ ADBE: IC pozisyonunu TUT (2 gün kala)
- ✅ FDX/MU: Normal yönetim

**10 Haziran Çarşamba (Earnings Günü):**
- ❌ ORCL/CHWY: Yeni pozisyon AÇMA — IV crush riski maksimum
- ⚠️ ADBE: 1 gün kala — gamma riski yüksek, delta hedge zorunlu
- ✅ FDX/MU: Normal yönetim

**11 Haziran Perşembe:**
- 💥 ORCL/CHWY: IV crush sonrası — **LONG VEGA fırsatı** (düşük IV'den al)
- 💥 ADBE: Earnings sonrası — IC kapama veya yeni long setup
- ✅ FDX/MU: Normal yönetim, theta geliri birikmeye devam

---

## HESAPLAMA PARAMETRELERI

| Parametre | Değer | Açıklama |
|-----------|-------|----------|
| Risk-Free Rate | 4.52% | 10Y US Treasury yield |
| VIX | 28.5 | NFP sonrası tahmini |
| IV Term Structure | Hump Model | Earnings yaklaştıkça IV artar |
| Theta Decay | Non-Linear | Earnings yaklaştıkça hızlanır |
| Gamma Model | Explosion | 1/gün kala maksimum |
| IV Crush Senaryoları | %30/%50/%70 | Hafif/Orta/Sert |
| Wing Width | S/10 | EarningsPlay v4 standardı |
| 21 DTE Kuralı | Aktif | <=21 günde setup, <=2 günde çıkış |
| %50 Kar Kuralı | Aktif | Max profit'in %50'sinde kapat |

---

## RISK UYARILARI

1. **Gamma Riski:** 1-2 gün kala gamma patlaması delta hedge'i zorlaştırır. ADBE'de 11 Haz'da gamma 1.45+ seviyesine çıkar.
2. **IV Crush Riski:** ORCL/CHWY'de orta crush senaryosunda ATM prim %50+ düşer. Short pozisyonlar için kazançla sonuçlanır.
3. **Theta Yanığı:** Long straddle/strangle pozisyonlarında 1-2 gün kala theta yanığı çok ağırdır. ADBE straddle günlük -$7.33 kayıp.
4. **Liquidity Riski:** 0-1 DTE opsiyonlarda spreadler açılır, slippage yükselir.
5. **NFP Etkisi:** 5 Haziran NFP şoku sonrası VIX yüksek seyrediyor. Taze volatilite girişi olabilir.

---

*Rapor EarningsPlay v4 metodolojisine göre Black-Scholes opsiyon fiyatlama modeli ile üretilmiştir. Projeksiyonlar tahmine dayalıdır ve gerçek piyasa koşullarına bağlı olarak değişiklik gösterebilir.*
*Bu rapor yatırım tavsiyesi değildir.*
