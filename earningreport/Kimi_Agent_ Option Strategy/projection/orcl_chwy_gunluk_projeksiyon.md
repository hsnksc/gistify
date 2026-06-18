# ORCL & CHWY Günlük Projeksiyon Raporu
## 8-10 Haziran 2026 | Earnings + CPI Üçlü Volatilite Etkisi

**Hazırlayan:** Earnings Opsiyon Analiz Sistemi
**Referans Tarihi:** 7 Haziran 2026 Pazar (Piyasalar Kapalı)
**Earnings Tarihi:** 10 Haziran 2026 Çarşamba
**Özel Durum:** CPI (8:30 AM) + CHWY BMO + ORCL AMC

---

## Genel Piyasa Durumu (7 Haziran Baz)

| Metrik | Değer |
|--------|-------|
| VIX | 21.51 (+39.7% patlama) |
| S&P 500 | -2.64% (NFP şoku) |
| Nasdaq | -4.18% |
| 10Y Yield | 4.52% (+10bp) |
| DXY | 100.07 (güçlü) |
| NFP | +172K (beklenti +80K) |
| **Piyasa Rejimi** | **SARI/KIRMIZI sınırı** |

> **Uyarı:** Bu projeksiyonlar Black-Scholes modeli, IV ramp-up modeli ve teknik analiz 
> baz alınarak hesaplanmıştır. Gerçek piyasa koşulları farklılık gösterebilir.

---

# ============================================================
# GÜN 1: 8 HAZİRAN PAZARTESİ — 3 GÜN KALDI
# ============================================================

## Piyasa Bağlamı
- Cuma günkü NFP şoku sonrası ilk işlem günü
- VIX 21.51 seviyesinde - yüksek ama panik satışı sınırında değil
- Teknik dönüş (mean reversion) potansiyeli yüksek
- Earnings'e 3 gün, CHWY için pozisyon almak için 2 gün kaldı

---

### ORCL — 8 Haziran Pazartesi — 3 gün kaldı

**Açılış Beklentisi:** $209.50 - $212.00 (Overnight gap riski: Orta)

#### 1. Fiyat Projeksiyonu

| Senaryo | Fiyat | Olasılık | Tetikleyici |
|---------|-------|----------|-------------|
| Bull | $214.50 | %30 | NFP şoku sonrası teknik dönüş, dip alımları, VIX sakinleşmesi |
| Base | $211.50 | %45 | Yatay-dar bant konsolidasyonu, hacim düşüşü, bekle-gör |
| Bear | $207.00 | %25 | Cuma satışı devamı, DXY güçlülüğü, teknoloji risk-off |

**Teknik Seviyeler:**
- Destek 1: $208.00 (200MA yakını)
- Destek 2: $205.00 (Cuma dip seviyesi)
- Direnc 1: $213.00 (PSY seviye)
- Direnc 2: $216.00 (Cuma açılış)

#### 2. IV (Implied Volatility) Projeksiyonu

| Metrik | Değer | Değişim | Yorum |
|--------|-------|---------|-------|
| IV30 | %47.0 | +2.0pp | NFP şoku sonrası IV base yüksek seyrediyor |
| IV Rank | %84 | +1pp | Earnings'e yaklaştıkça yükseliş |
| IV Skew | Çağrı taraflı | — | Short-covering + earnings beklentisi |
| 12 Haziran IV | %52 | +7pp | Earnings haftası yaklaşımı |

#### 3. Opsiyon Prim Projeksiyonu (12 Haziran Vadeli)

| Tip | Strike | Mevcut Prim | Günlük Theta | 8 Haziran Projeksiyon |
|-----|--------|-------------|--------------|----------------------|
| Call (ITM) | $200 | $18.50 | -$1.45 | $17.80 (+IV artışı theta'yı telafi) |
| Call (ATM) | $210 | $14.20 | -$1.60 | $14.50 (IV ramp-up kazancı) |
| Call (OTM) | $220 | $10.50 | -$1.35 | $11.20 (daha volatil) |
| Put (ATM) | $210 | $13.80 | -$1.55 | $13.50 |
| Put (OTM) | $200 | $9.20 | -$1.10 | $8.80 |

#### 4. Greeks Projeksiyonu (Gün Sonu)

| Greek | Değer | Değişim | Risk |
|-------|-------|---------|------|
| Delta (ATM C) | 0.55 | +0.02 | Hafif ITM kayma, spot $211.50 |
| Delta (ATM P) | -0.45 | -0.02 | OTM kayma |
| Theta (ATM C) | -$1.60 | -$0.30 | Earnings yaklaştıkça hızlanıyor |
| Theta (ATM P) | -$1.55 | -$0.25 | — |
| Vega (ATM) | $0.28 | +$0.03 | IV artışına duyarlılık yükseliyor |
| Gamma (ATM) | 0.018 | +0.002 | Spot yaklaştıkça gamma riski artıyor |

#### 5. Günlük Momentum Stratejisi

**ORB Seviyeleri:**
- ORB High: $212.80 (Spot + %0.6)
- ORB Low: $209.20 (Spot - %1.0)
- ORB Breakout: $212.80 üzeri long, $209.20 altı short

**VWAP Projeksiyonu:**
- VWAP Tahmini: $210.80
- +1σ: $213.40 | +2σ: $216.00
- -1σ: $208.20 | -2σ: $205.60

**Strateji Önerisi:**
- **Açılış:** ORB break bekleyin, gap fill potansiyeli yüksek (%65)
- **Fade/Chase:** Cuma satışından sonra fade the dip stratejisi (bullish bias)
- **0DTE Uygun mu?** ⚠️ Kısmen — VIX yüksek ama 0DTE 12 Haziran vadeli değil, bu Pazartesi 
  henüz 0DTE yok. Earnings öncesi straddle/strangle biriktirme günü.
- **Öneri:** 210 Straddle veya 200/220 Strangle pozisyonları açma günü

#### 6. EarningsPlay Kontrol Listesi

- [x] IV Rank >%50 (%84 ✅)
- [ ] 21 DTE kontrolü — 12 Haziran vadeli kullan (4 DTE ⚠️)
- [ ] %50 kar kuralı — Henüz pozisyon yok
- [ ] Delta toleransı ±0.10 — Straddle delta ~0
- [x] Pre-earnings momentum: Cuma %9.6 düşüş sonrası dönüş potansiyeli

---

### CHWY — 8 Haziran Pazartesi — 3 gün kaldı

**Açılış Beklentisi:** $20.80 - $21.40 (Pre-market hareketli)

#### 1. Fiyat Projeksiyonu

| Senaryo | Fiyat | Olasılık | Tetikleyici |
|---------|-------|----------|-------------|
| Bull | $22.00 | %35 | Short squeeze başlangıcı, dip alımları, SSR tetiklenmesi |
| Base | $21.10 | %40 | Konsolidasyon, shortlar kararlı duruyor |
| Bear | $19.80 | %25 | Yeni dip testi, $19.30 desteğine yaklaşma |

**Teknik Seviyeler:**
- Destek 1: $20.00 (PSY seviye)
- Destek 2: $19.30 (52-hafta dip)
- Direnc 1: $21.50 (Cuma direnç)
- Direnc 2: $22.50 (squeeze hedefi)
- **SSR:** $19.50 altı kapanışta Short Sale Rule devreye girer

#### 2. IV (Implied Volatility) Projeksiyonu

| Metrik | Değer | Değişim | Yorum |
|--------|-------|---------|-------|
| IV30 | %100 | +5pp | Short squeeze + earnings double premium |
| IV Rank | %91 | +1pp | Rekor seviyelere yakın |
| IV Skew | Çağrı ağır | — | Short-covering patlaması beklentisi |
| 12 Haziran IV | %110 | +10pp | Çift volatilite etkisi |

#### 3. Opsiyon Prim Projeksiyonu (12 Haziran Vadeli)

| Tip | Strike | Mevcut Prim | Günlük Theta | 8 Haziran Projeksiyon |
|-----|--------|-------------|--------------|----------------------|
| Call (ITM) | $20 | $2.10 | -$0.18 | $2.30 (IV artışı) |
| Call (ATM) | $21 | $1.45 | -$0.15 | $1.65 (squeeze bekleyişi) |
| Call (OTM) | $22 | $0.95 | -$0.12 | $1.15 (%20+ artış potansiyeli) |
| Put (ATM) | $21 | $1.55 | -$0.14 | $1.70 (downside koruma) |
| Put (OTM) | $20 | $0.90 | -$0.10 | $1.00 |

#### 4. Greeks Projeksiyonu (Gün Sonu)

| Greek | Değer | Değişim | Risk |
|-------|-------|---------|------|
| Delta (ATM C) | 0.48 | +0.01 | Nötr-OTM, squeeze ile hızlı değişebilir |
| Delta (ATM P) | -0.52 | -0.01 | Hafif ITM put |
| Theta (ATM C) | -$0.15 | -$0.03 | Düşük fiyatlı ama hızlanıyor |
| Theta (ATM P) | -$0.14 | -$0.02 | — |
| Vega (ATM) | $0.035 | +$0.005 | %1 IV artış = $0.035 kazanç |
| Gamma (ATM) | 0.12 | +0.02 | Yüksek gamma — squeeze'de çok hızlı kar |

#### 5. Günlük Momentum Stratejisi

**ORB Seviyeleri:**
- ORB High: $21.40 (Spot + %1.4)
- ORB Low: $20.60 (Spot - %2.4)
- ORB Breakout: $21.40 üzeri long, $20.60 altı short

**VWAP Projeksiyonu:**
- VWAP Tahmini: $21.00
- +1σ: $21.50 | +2σ: $22.00
- -1σ: $20.50 | -2σ: $20.00

**Strateji Önerisi:**
- **Açılış:** Gap varsa %50'sini hemen kapat, kalanı ORB break'e taşı
- **Fade/Chase:** $20.50 altı FADE (bearish), $21.40 üzeri CHASE (squeeze)
- **0DTE Uygun mu?** ⚠️ Hayır — CHWY 0DTE likiditesi düşük, 12 Haziran vadeli kullan
- **Öneri:** 
  - Bull: 21/22 Call Spread ($0.45 maliyet, $0.55 max kar)
  - Risk-off: 20 Long Put ($0.90, 52w dip stoplu)
  - **Short Squeeze Play:** OTM 22-24 Call'ları ucuzken biriktir

#### 6. EarningsPlay Kontrol Listesi

- [x] IV Rank >%50 (%91 ✅)
- [ ] 21 DTE kontrolü — 12 Haziran vadeli kullan (4 DTE ⚠️)
- [ ] %50 kar kuralı — Henüz pozisyon yok
- [ ] Delta toleransı ±0.10 — Call spread delta ~0.25
- [x] Short Squeeze Potansiyeli: 5/5 (Days to Cover 3.42, SI %11.59)
- [x] Short Interest: 26.8M hisse (+%44 artış)

---
---

# ============================================================
# GÜN 2: 9 HAZİRAN SALI — 2 GÜN KALDI (CHWY İÇİN SON GÜN)
# ============================================================

## Piyasa Bağlamı
- CHWY için son pozisyon alma günü (BMO oldugu icin kapanista pozisyon alinmali)
- ORCL için henüz 2 gün var, pozisyon ertelenebilir
- Earnings IV ramp-up ivme kazanıyor
- Theta decay hızlanıyor (earnings'e 2 gün kala)

---

### ORCL — 9 Haziran Salı — 2 gün kaldı

**Açılış Beklentisi:** $211.00 - $214.00
**8 Haziran Gerçekleşmesi Varsayımı:** Base senaryo ($211.50) gerçekleşti

#### 1. Fiyat Projeksiyonu

| Senaryo | Fiyat | Olasılık | Tetikleyici |
|---------|-------|----------|-------------|
| Bull | $215.50 | %35 | Earnings öncesi pozisyon biriktirme, IV ramp-up alımları |
| Base | $212.80 | %40 | Son dakika konsolidasyonu, bekle-gör modu |
| Bear | $209.00 | %25 | Kar realizasyonu, son dakika satışları, risk azaltma |

**Teknik Seviyeler:**
- Destek 1: $210.50
- Destek 2: $208.00 (200MA)
- Direnc 1: $214.00
- Direnc 2: $216.50

#### 2. IV (Implied Volatility) Projeksiyonu

| Metrik | Değer | Değişim | Yorum |
|--------|-------|---------|-------|
| IV30 | %49.0 | +2.0pp | Earnings'e 2 gün — hızlanıyor |
| IV Rank | %86 | +2pp | Yukarı trend sürüyor |
| 12 Haziran IV | %56 | +7pp | Earnings haftası — maksimum IV |
| IV Skew | Çağrı taraflı | — | Bullish bias güçleniyor |

#### 3. Opsiyon Prim Projeksiyonu (12 Haziran Vadeli)

| Tip | Strike | 8 Haziran Prim | Günlük Theta | 9 Haziran Projeksiyon |
|-----|--------|---------------|--------------|----------------------|
| Call (ITM) | $200 | $17.80 | -$1.80 | $17.50 (IV artışı theta'yi aşıyor) |
| Call (ATM) | $210 | $14.50 | -$1.95 | $14.80 (IV ramp-up kazancı) |
| Call (OTM) | $220 | $11.20 | -$1.65 | $12.00 (volatilite primi artıyor) |
| Put (ATM) | $210 | $13.50 | -$1.85 | $13.20 |
| Put (OTM) | $200 | $8.80 | -$1.35 | $8.50 |

#### 4. Greeks Projeksiyonu (Gün Sonu)

| Greek | Değer | Değişim | Risk |
|-------|-------|---------|------|
| Delta (ATM C) | 0.57 | +0.02 | Spot yukarı, ITM derinleşiyor |
| Delta (ATM P) | -0.43 | -0.02 | Put OTM kayıyor |
| Theta (ATM C) | -$1.95 | -$0.35 | **Hızlanıyor** — son 2 gün kritik |
| Theta (ATM P) | -$1.85 | -$0.30 | — |
| Vega (ATM) | $0.22 | -$0.06 | Time decay vega'yı eritiyor |
| Gamma (ATM) | 0.022 | +0.004 | **Yüksek gamma riski** — pin riski artıyor |

> **⚠️ UYARI:** Theta decay 9 Haziran itibarıyla **2x hızlanıyor**. 
> Earnings'e 2 gün kala günlük kayıp ~$2.00/opsiyon.

#### 5. Günlük Momentum Stratejisi

**ORB Seviyeleri:**
- ORB High: $213.60 (Spot + %0.4)
- ORB Low: $211.20 (Spot - %0.8)
- ORB Breakout: $213.60 üzeri long

**VWAP Projeksiyonu:**
- VWAP Tahmini: $212.80
- +1σ: $215.00 | +2σ: $217.20
- -1σ: $210.60 | -2σ: $208.40

**Strateji Önerisi:**
- **Açılış:** Gap açılırsa %50 kapat, ORB onayı bekle
- **Fade/Chase:** $211 altı FADE (bearish bias), $214 üzeri CHASE (earnings momentum)
- **0DTE Uygun mu?** ✅ **EVET** — 12 Haziran vadeli opsiyonlar artık 0DTE/1DTE 
  karakteristiği gösteriyor. LIKİDİTE yüksekse ORCL 0DTE kullanılabilir.
- **Öneri:** 
  - Eğer 8 Haziran'da pozisyon açıldıysa: Bugün **%50 kar realizasyonu** günü
  - Yeni pozisyon: 210/220 Call Spread veya 210 Straddle (son gün girişi)
  - **10 Haziran sabah:** CPI sonrası ORCL pozisyonu açılabilir (AMC olduğu için)

#### 6. EarningsPlay Kontrol Listesi

- [x] IV Rank >%50 (%86 ✅)
- [ ] 21 DTE kontrolü — 12 Haziran vadeli (3 DTE ⚠️ **Riskli**)
- [ ] %50 kar kuralı — Eğer açık pozisyon varsa BUGÜN %50 kar al
- [x] Delta toleransı ±0.10 — Straddle delta ~0
- [ ] Pozisyon açık mı? — Varsa bugün kapanışta yarısını kapat

---

### CHWY — 9 Haziran Salı — 2 gün kaldı (SON GÜN)

**⚠️ KRİTİK UYARI:** CHWY BMO (Before Market Open) olduğu için 
**9 HAZİRAN KAPANIŞTA pozisyon alınmalı!**

**Açılış Beklentisi:** $20.90 - $21.80
**8 Haziran Gerçekleşmesi Varsayımı:** Base senaryo ($21.10) gerçekleşti

#### 1. Fiyat Projeksiyonu

| Senaryo | Fiyat | Olasılık | Tetikleyici |
|---------|-------|----------|-------------|
| Bull | $22.50 | %40 | Son gün squeeze, earnings öncesi agresif alım, FOMO |
| Base | $21.50 | %35 | Son dakika konsolidasyon, pozisyon birikimi |
| Bear | $20.30 | %25 | Son dakika satış, $20 psikolojik destek testi |

**Teknik Seviyeler:**
- Destek 1: $21.00
- Destek 2: $20.00 (PSY + Short Squeeze Rule tetikleyici)
- Direnc 1: $22.00 (squeeze hedefi 1)
- Direnc 2: $23.00 (squeeze hedefi 2, Days to Cover 3.42)

#### 2. IV (Implied Volatility) Projeksiyonu

| Metrik | Değer | Değişim | Yorum |
|--------|-------|---------|-------|
| IV30 | %105 | +5pp | Son gün — maksimum IV seviyesi |
| IV Rank | %93 | +2pp | Tarihi zirvelere yakın |
| 12 Haziran IV | %118 | +8pp | Squeeze + Earnings double premium |
| IV Skew | Aşırı çağrı taraflı | — | OTM call'lar aşırı değerli |

#### 3. Opsiyon Prim Projeksiyonu (12 Haziran Vadeli — KAPANIŞTA ALINMALI)

| Tip | Strike | 8 Haziran Prim | Günlük Theta | 9 Haziran Kapanış Projeksiyon |
|-----|--------|---------------|--------------|------------------------------|
| Call (ITM) | $20 | $2.30 | -$0.22 | $2.45 (IV ramp-up) |
| Call (ATM) | $21 | $1.65 | -$0.18 | $1.80 (son giriş fırsatı) |
| Call (OTM) | $22 | $1.15 | -$0.15 | $1.40 (squeeze lottery ticket) |
| Call (Deep OTM) | $24 | $0.35 | -$0.08 | $0.50 (yüksek risk/ödül) |
| Put (ATM) | $21 | $1.70 | -$0.17 | $1.85 |
| Put (OTM) | $20 | $1.00 | -$0.12 | $1.15 |

> **💡 STRATEJİ NOTU:** 9 Haziran kapanışta CHWY pozisyonu açmak,
> earnings IV crush riskini minimize eder (2 gün erken girersiniz)
> ama aynı zamanda squeeze potansiyelinden de tam faydalanırsınız.

#### 4. Greeks Projeksiyonu (Gün Sonu — POZİSYON AÇMA ANI)

| Greek | Değer | Değişim | Risk |
|-------|-------|---------|------|
| Delta (ATM C) | 0.50 | +0.02 | ATM — maksimum gamma/theta noktası |
| Delta (ATM P) | -0.50 | -0.02 | — |
| Theta (ATM C) | -$0.18 | -$0.03 | Günlük erime hızlanıyor |
| Theta (ATM P) | -$0.17 | -$0.03 | — |
| Vega (ATM) | $0.025 | -$0.010 | Time decay vega'yı eritiyor |
| Gamma (ATM) | 0.15 | +0.03 | **Çok yüksek** — $0.10 hareket = delta %50 değişir |

#### 5. Günlük Momentum Stratejisi

**ORB Seviyeleri:**
- ORB High: $21.80 (Spot + %1.4)
- ORB Low: $20.80 (Spot - %3.3)
- ORB Breakout: $21.80 üzeri long, $20.80 altı short

**VWAP Projeksiyonu:**
- VWAP Tahmini: $21.40
- +1σ: $21.90 | +2σ: $22.40
- -1σ: $20.90 | -2σ: $20.40

**Strateji Önerisi:**
- **Açılış:** Gap açılışta kapatma yok — CHWY earnings günü yakın
- **Fade/Chase:** $20.50 altı FADE, $22.00 üzeri CHASE (squeeze başladı)
- **0DTE Uygun mu?** ⚠️ Hayır — 12 Haziran vadeli kullan, 0DTE likidite yetersiz
- **Kapanış Stratejisi (KRİTİK):**
  - **15:30-16:00 arası pozisyon aç** (son 30 dakika IV genellikle düşer)
  - Öneri: 21 Call ($1.80) veya 20/23 Call Spread ($1.20 maliyet)
  - Max risk: %100 | Max ödül: Squeeze'de %200-500

#### 6. EarningsPlay Kontrol Listesi

- [x] IV Rank >%50 (%93 ✅)
- [ ] 21 DTE kontrolü — 12 Haziran vadeli (3 DTE ⚠️)
- [ ] %50 kar kuralı — Pozisyon yeni açılacak
- [x] Delta toleransı ±0.10 — ATM Call delta 0.50 (sınırda ✅)
- [x] **9 Haziran Kapanışta Pozisyon Al** — BMO olduğu için zorunlu
- [x] Short Squeeze: Days to Cover 3.42, SI %11.59 (5/5 potansiyel)

---
---

# ============================================================
# GÜN 3: 10 HAZİRAN ÇARŞAMBA — EARNINGS GÜNÜ + CPI
# ============================================================

## Gün Akışı (Zaman Çizelgesi)

```
06:00 AM  — Pre-market açılış (Futures etkin)
08:30 AM  — CPI AÇIKLAMASI (Beklenti: %4.2 yıllık)
08:30 AM  — CHWY earnings için son ticaret fırsatı (BMO)
09:30 AM  — Piyasa açılışı (CPI + CHWY earnings etkisi)
09:45 AM  — ORB penceresi açılır
10:00 AM  — CHWY ilk yön belli olur (earnings reaksiyonu)
12:00 PM  — Orta gün volatilite sakinleşmesi
15:30 PM  — Son saat hareketliliği başlar
16:00 PM  — Kapanış (ORCL pozisyonu açma zamanı)
16:05 PM  — ORCL EARNINGS AÇIKLAMASI (AMC)
16:30 PM  — After-hours trading başlar
```

## Piyasa Bağlamı
- **ÇİFT VOLATİLİTE GÜNÜ:** CPI + Earnings (CHWY BMO + ORCL AMC)
- Hisse başına %10+ hareket potansiyeli
- VIX muhtemelen 22-26 aralığında
- Tüm piyasalar CPI'ya kilitlenecek

---

### ORCL — 10 Haziran Çarşamba — 1 gün kaldı / EARNINGS GÜNÜ

**⚠️ KRİTİK UYARI:** ORCL AMC olduğu için **10 HAZİRAN KAPANIŞTA** 
pozisyon açılabilir (CPI sonrası). Eğer 9 Haziran'da pozisyon açılmadıysa,
bu son fırsattır.

**Açılış Beklentisi:** $210.00 - $218.00 (CPI'ye bağlı geniş range)
**9 Haziran Gerçekleşmesi Varsayımı:** Base senaryo ($212.80) gerçekleşti

#### 1. Fiyat Projeksiyonu

| Senaryo | Fiyat | Olasılık | Tetikleyici |
|---------|-------|----------|-------------|
| Bull | $220.00 | %30 | CPI düşük gelirse ralli (%3.8-4.0), ORCL earnings öncesi spekülasyon |
| Base | $215.00 | %35 | CPI beklenenden yakın (%4.1-4.3), earnings beklentisi dengelenir |
| Bear | $208.00 | %35 | CPI yüksek gelirse satış (%4.4+), ORCL AMC öncesi risk azaltma |

**Teknik Seviyeler:**
- Destek 1: $212.00
- Destek 2: $208.00 (200MA)
- Destek 3: $205.00 (Cuma dip)
- Direnc 1: $216.00
- Direnc 2: $220.00
- Direnc 3: $225.00 (earnings öncesi psikolojik hedef)

#### 2. IV (Implied Volatility) Projeksiyonu

| Metrik | Değer | Değişim | Yorum |
|--------|-------|---------|-------|
| IV30 | %54.0 | +5pp | **Earnings + CPI günü — maksimum IV** |
| IV Rank | %89 | +3pp | Tarihi yüksek seviyede |
| 12 Haziran IV | %62 | +8pp | Earnings IV crush sonrası düşüş olacak |
| IV Skew | Çağrı ağır | — | Bullish bias, ama put'lar da pahalı (çift yönlü risk) |
| Post-Earnings IV Crush | %35-40 | -%15-20 | **Earnings sonrası IV çökmesi beklentisi** |

> **⚠️ IV CRUSH UYARISI:** ORCL earnings AMC açıklanacak. 
> Earnings sonrası IV %15-20 çökecek. 
> Long straddle/strangle sahipleri IV crush riskiyle karşı karşıya.

#### 3. Opsiyon Prim Projeksiyonu (12 Haziran Vadeli — KAPANIŞTA ALINMALI)

| Tip | Strike | 9 Haziran Prim | Günlük Theta | 10 Haziran Kapanış Projeksiyon |
|-----|--------|---------------|--------------|-------------------------------|
| Call (ITM) | $200 | $17.50 | -$2.20 | $18.00 (IV zirvesi) |
| Call (ATM) | $210 | $14.80 | -$2.50 | $16.50 (maksimum volatilite primi) |
| Call (OTM) | $220 | $12.00 | -$2.10 | $14.50 (earnings lottery ticket) |
| Put (ATM) | $210 | $13.20 | -$2.35 | $15.00 (downside koruma zirvesi) |
| Put (OTM) | $200 | $8.50 | -$1.70 | $10.50 |
| **210 Straddle** | **210C+210P** | **$28.00** | **-$4.85** | **$31.50 (maksimum)** |

> **💡 STRATEJİ:** 10 Haziran kapanışta ORCL pozisyonu açmak,
> CPI'ı görmek avantajı sağlar. Ama IV zirvede olacağı için
> maliyet yüksek olacak. Earnings beat için %8+ hareket gerekli.

#### 4. Greeks Projeksiyonu (Gün Sonu — Pozisyon Açma Anı)

| Greek | Değer | Değişim | Risk |
|-------|-------|---------|------|
| Delta (ATM C) | 0.60 | +0.03 | ITM derinleşiyor, spot $215 |
| Delta (ATM P) | -0.40 | -0.03 | Put OTM kayıyor |
| Theta (ATM C) | -$2.50 | -$0.55 | **Maksimum erime günü** |
| Theta (ATM P) | -$2.35 | -$0.50 | — |
| Vega (ATM) | $0.015 | -$0.005 | Son gün — vega anlamsızlaşıyor |
| Gamma (ATM) | 0.028 | +0.006 | **Pin riski maksimum** — $210 pin olabilir |

#### 5. Günlük Momentum Stratejisi

**CPI Öncesi (08:30 AM öncesi):**
- Pre-market hacim yüksek olacak
- Futures üzerinden yön tayini yapılabilir
- ORCL pozisyonu henüz açılmamalı

**CPI Sonrası (08:30-09:30 AM):**
- **CPI < %4.0:** Rally modu — Call ağırlıklı pozisyon
- **CPI %4.0-4.3:** Nötr — Straddle/Strangle
- **CPI > %4.3:** Risk-off — Put koruma veya pozisyon erteleme

**ORB Seviyeleri (CPI Sonrası):**
- ORB High: $216.50 (CPI sonrası +%0.7)
- ORB Low: $213.50 (CPI sonrası -%0.7)
- **CPI volatilitesi dahil gerçek range: $208 - $220 (%5.7)**

**VWAP Projeksiyonu:**
- VWAP Tahmini: $215.00
- +1σ: $218.50 | +2σ: $222.00
- -1σ: $211.50 | -2σ: $208.00

**Strateji Önerisi:**
- **09:30 Açılış:** CPI reaksiyonunu izle, ilk 5 dakika trade ETME
- **09:45-10:00:** ORB onayı al, pozisyon aç
- **10:00-15:30:** Trend takibi, pozisyonu taşı
- **15:30-16:00:** ORCL pozisyonu AÇ (son 30 dk)
- **0DTE Uygun mu?** ✅ **EVET** — 12 Haziran vadeli 0DTE/1DTE 
  (2 gün kala ama earnings sonrası IV crush olacak)
- **Öneri:**
  - CPI < 4.0: 215/220 Call Spread ($2.50 maliyet)
  - CPI 4.0-4.3: 210 Straddle ($16.50 maliyet, beat gerekli)
  - CPI > 4.3: 210/205 Put Spread ($2.20 maliyet) veya pozisyon yok

#### 6. EarningsPlay Kontrol Listesi

- [x] IV Rank >%50 (%89 ✅)
- [ ] 21 DTE kontrolü — 12 Haziran vadeli (2 DTE 🔴 **Çok Riskli**)
- [ ] %50 kar kuralı — Yeni pozisyon
- [x] Delta toleransı ±0.10 — Straddle delta ~0
- [x] **10 Haziran Kapanışta Pozisyon Al** — AMC + CPI sonrası
- [x] Pre-earnings momentum: RPO $553B rekor, Cloud %84 YoY

---

### CHWY — 10 Haziran Çarşamba — EARNINGS GÜNÜ (BMO)

**⚠️ KRİTİK UYARI:** CHWY earnings BMO açıklanacak! 
- 06:00-08:30 AM arası earnings sonuçları belli olur
- 09:30 AM açılışta CHWY büyük gap açılabilir
- 9 Haziran kapanışta pozisyon açıldıysa, bugün KAR realizasyonu günü

**Açılış Beklentisi:** Gap açılış $19.00 - $25.00 arası (earnings'e bağlı)
**9 Haziran Gerçekleşmesi Varsayımı:** Base senaryo ($21.50) gerçekleşti

#### 1. Fiyat Projeksiyonu (Earnings Reaksiyonu)

| Senaryo | Fiyat | Olasılık | Tetikleyici |
|---------|-------|----------|-------------|
| Bull | $25.00 | %35 | **Earnings beat + guidance yukarı + short squeeze patlaması** |
| Base | $22.30 | %35 | Hafif beat / inline, kısmi squeeze, IV crush dengesi |
| Bear | $18.50 | %30 | Earnings miss, guidance düşürme, shortlar saldırmaya devam |

**Earnings Sonrası Teknik Seviyeler:**
- **Gap Up Destekleri:** $22.00 | $21.00
- **Gap Down Direnci:** $20.50 | $21.50
- **Short Squeeze Hedefleri:** $24.00 | $26.00 | $28.00
- **Yeni Dip:** $18.50 (earnings miss durumunda)

#### 2. IV (Implied Volatility) Projeksiyonu

| Metrik | Değer | Değişim | Yorum |
|--------|-------|---------|-------|
| Pre-Earnings IV | %115 | +10pp | Tarihi zirve |
| Post-Earnings IV | %55-65 | -%50 | **IV CRUSH** — Earnings sonrası çöküş |
| IV Rank (Pre) | %96 | +3pp | Maksimum seviye |
| IV Rank (Post) | %45-55 | — | Normalize olmuş |

> **⚠️ IV CRUSH ETKİSİ:** CHWY earnings BMO. 
> 09:30 açılışta IV %50 çökecek.
> Long call/put sahipleri IV crush'ten etkilenecek.
> **Eğer pozisyon 9 Haziran'da açıldıysa, bugün kar almak zorunlu.**

#### 3. Opsiyon Prim Projeksiyonu (Earnings Sonrası)

| Tip | Strike | Pre-Earnings Prim | IV Crush Etkisi | Post-Earnings Prim |
|-----|--------|------------------|-----------------|-------------------|
| Call (ATM) | $21 | $1.80 | -%45 | $1.00 (hafir artı) |
| Call (OTM) | $23 | $0.85 | -%50 | $0.40 (büyük kayıp) |
| Call (ITM) | $20 | $2.45 | -%40 | $1.80 (min. kayıp) |
| Put (ATM) | $21 | $1.85 | -%45 | $1.10 |
| 21 Straddle | 21C+21P | $3.65 | -%50 | $2.10 |

> **💡 KAR REALİZASYONU:** Eğer 9 Haziran kapanışta 21 Call ($1.65) alındıysa:
> - Bull senaryo ($25.00): Call = $4.00 → **%142 kar** ✅
> - Base senaryo ($22.30): Call = $1.80 → **%9 kar** (IV crush!)
> - Bear senaryo ($18.50): Call = $0.10 → **-%94 kayıp** 🔴

#### 4. Greeks Projeksiyonu (Earnings Sonrası)

| Greek | Pre-Earnings | Post-Earnings | Değişim | Risk |
|-------|-------------|---------------|---------|------|
| Delta (ATM C) | 0.50 | 0.70 (bull) / 0.10 (bear) | ±0.20 | Squeeze'de delta patlaması |
| Gamma (ATM) | 0.15 | 0.08 | -0.07 | IV crush gamma düşürür |
| Theta | -$0.18 | -$0.05 | +$0.13 | Earnings sonrası theta rahatlar |
| Vega | $0.025 | $0.012 | -$0.013 | IV crush vega'yı yarılar |

#### 5. Günlük Momentum Stratejisi

**06:00-08:30 AM (Pre-Market):**
- CHWY earnings sonuçlarını izle
- EPS karşılaştırması: Beklenti vs Gerçekleşme
- Guidance yukarı/aşağı yönünü belirle
- Pre-market hacim ve fiyat hareketini analiz et

**08:30 AM (CPI Açıklaması):**
- CPI + CHWY earnings birlikte piyasayı etkiler
- **CPI düşük + CHWY beat:** Çifte ralli — en iyi senaryo
- **CPI yüksek + CHWY miss:** Çifte felaket — en kötü senaryo

**09:30 AM Açılış Stratejisi:**
- Gap %5+ ise: %50 kar al, kalanı trailing stopla taşı
- Gap %2-5 ise: Pozisyonu değerlendir, hedef belirle
- Gap aşağı ise: Stop-loss uygula veya put hedge düşün

**Strateji Önerisi:**
- **06:00-08:30:** Earnings sonucunu bekle, pozisyon değerlendirmesi yap
- **08:30-09:30:** CPI + CHWY etkileşimini analiz et
- **09:30 Açılış:** Eğer pozisyon açıksa:
  - **Kar hedefi:** %50-100 (gap açılışta hemen değerlendir)
  - **Stop-loss:** Maliyetin %50 altı
  - **Trailing stop:** Gap karı al, kalanı %10 trailing ile taşı
- **0DTE Uygun mu?** 🔴 **HAYIR** — Earnings sonrası IV crush aktif,
  yeni 0DTE pozisyon açmak riskli
- **Öneri:** Sadece mevcut pozisyon yönetimi, yeni pozisyon AÇMA

#### 6. EarningsPlay Kontrol Listesi

- [x] IV Rank >%50 (%96 ✅)
- [x] Earnings BMO — Sonuç belli oldu
- [ ] **KAR REALİZASYONU:** Eğer pozisyon açıksa BUGÜN %50-100 kar al
- [ ] IV Crush etkisini hesaba kat — intrinsic value + min time value
- [x] Short Squeeze: Pozisyon açıksa squeeze'den faydalan
- [ ] Earnings sonrası yeni pozisyon: 12 Haziran vadeli hala kârlı olabilir

---
---

# ============================================================
# GENEL ÖZET ve STRATEJİ KARŞILAŞTIRMASI
# ============================================================

## 3 Günlük Fiyat Projeksiyon Özeti

### ORCL Fiyat Seyri

| Gün | Tarih | Kalan Gün | Bull | Base | Bear | IV30 | Kritik Not |
|-----|-------|-----------|------|------|------|------|------------|
| Gün 1 | 8 Haziran Pazartesi | 3 | $214.50 | $211.50 | $207.00 | %47 | Teknik dönüş günü, pozisyon biriktir |
| Gün 2 | 9 Haziran Salı | 2 | $215.50 | $212.80 | $209.00 | %49 | %50 kar kontrolü, son hazırlık |
| Gün 3 | 10 Haziran Çarşamba | 1 | $220.00 | $215.00 | $208.00 | %54 | CPI + Earnings, kapanışta pozisyon aç |

### CHWY Fiyat Seyri

| Gün | Tarih | Kalan Gün | Bull | Base | Bear | IV30 | Kritik Not |
|-----|-------|-----------|------|------|------|------|------------|
| Gün 1 | 8 Haziran Pazartesi | 3 | $22.00 | $21.10 | $19.80 | %100 | Squeeze potansiyeli, ucuz call biriktir |
| Gün 2 | 9 Haziran Salı | 2 | $22.50 | $21.50 | $20.30 | %105 | **Kapanışta pozisyon al (BMO)** |
| Gün 3 | 10 Haziran Çarşamba | Earnings | $25.00 | $22.30 | $18.50 | %115→%55 | **Kar realizasyonu günü** |

---

## Greeks Trend Özeti

### ORCL 210 Call Greeks (3 Günlük)

| Gün | Delta | Theta | Vega | Gamma | Risk Seviyesi |
|-----|-------|-------|------|-------|---------------|
| 8 Haziran | 0.55 | -$1.60 | $0.28 | 0.018 | 🟡 Orta |
| 9 Haziran | 0.57 | -$1.95 | $0.22 | 0.022 | 🟠 Yüksek |
| 10 Haziran | 0.60 | -$2.50 | $0.015 | 0.028 | 🔴 Çok Yüksek |

### CHWY 21 Call Greeks (3 Günlük)

| Gün | Delta | Theta | Vega | Gamma | Risk Seviyesi |
|-----|-------|-------|------|-------|---------------|
| 8 Haziran | 0.48 | -$0.15 | $0.035 | 0.12 | 🟡 Orta |
| 9 Haziran | 0.50 | -$0.18 | $0.025 | 0.15 | 🟠 Yüksek |
| 10 Haziran | 0.50→0.70 | -$0.18 | $0.012 | 0.08 | 🔴 Maksimum |

---

## Theta Decay (Günlük Erime) Özeti

### ORCL 210 Straddle (210C + 210P)

| Gün | Call Theta | Put Theta | Toplam Günlük Kayıp | Kümülatif Kayıp |
|-----|------------|-----------|---------------------|-----------------|
| 8 Haziran | -$1.60 | -$1.55 | **-$3.15** | -$3.15 |
| 9 Haziran | -$1.95 | -$1.85 | **-$3.80** | -$6.95 |
| 10 Haziran | -$2.50 | -$2.35 | **-$4.85** | -$11.80 |
| **Toplam** | | | | **~$12** (3 günde straddle değerinin %43'ü eriyor) |

### CHWY 21 Straddle

| Gün | Call Theta | Put Theta | Toplam Günlük Kayıp | Kümülatif Kayıp |
|-----|------------|-----------|---------------------|-----------------|
| 8 Haziran | -$0.15 | -$0.14 | **-$0.29** | -$0.29 |
| 9 Haziran | -$0.18 | -$0.17 | **-$0.35** | -$0.64 |
| 10 Haziran | -$0.20 | -$0.18 | **-$0.38** | -$1.02 |
| **Toplam** | | | | **~$1.02** (3 günde straddle değerinin ~%28'i eriyor) |

---

## IV (Implied Volatility) Trend Özeti

```
ORCL IV Seyri:
7 Haz: %45.0 ████████████████████
8 Haz: %47.0 █████████████████████
9 Haz: %49.0 ██████████████████████
10 Haz: %54.0 █████████████████████████ (Earnings + CPI günü zirve)
Post-Earnings: %35-40 (IV Crush)

CHWY IV Seyri:
7 Haz: %95.0 ████████████████████████████████
8 Haz: %100.0 █████████████████████████████████
9 Haz: %105.0 ███████████████████████████████████
10 Haz: %115.0 █████████████████████████████████████ (Earnings öncesi zirve)
Post-Earnings: %55-65 (IV Crush)
```

---

## En İyi Strateji Önerileri (Özet)

### ORCL — Strateji Zaman Çizelgesi

| Gün | Strateji | Pozisyon | Hedef | Stop |
|-----|----------|----------|-------|------|
| 8 Haziran | Strangle biriktir | 200P / 220C ( debit ~$5.50 ) | Earnings volatilitesi | Pozisyonun %50'si |
| 9 Haziran | %50 kar al / tut | Mevcut pozisyon | %50 kar = $2.75 | Maliyetin altı |
| 10 Haziran Kapanış | Yeni pozisyon (CPI sonrası) | 215C veya 210 Straddle | Earnings beat | %50 kar hemen |

### CHWY — Strateji Zaman Çizelgesi

| Gün | Strateji | Pozisyon | Hedef | Stop |
|-----|----------|----------|-------|------|
| 8 Haziran | OTM Call biriktir | 22-24 Call'lar (ucuz) | Squeeze fiyat hedefi | %100 kayıp |
| 9 Haziran Kapanış | **Ana pozisyon aç** | 21 ATM Call ($1.80) veya 20/23 Spread | Earnings + Squeeze | Maliyetin %50'si |
| 10 Haziran | **Kar realizasyonu** | Gap açılışta %50-100 kar | Squeeze hedefleri | Trailing %10 |

---

## Risk Uyarıları ve Dikkat Edilmesi Gerekenler

### 🔴 Yüksek Risk Faktörleri

1. **Üçlü Volatilite (10 Haziran):** CPI + CHWY BMO + ORCL AMC bir arada
   - Beklenenden büyük hareketler olabilir
   - Pozisyon boyutu normalin %50'sini geçmemeli

2. **IV Crush Riski:**
   - Earnings sonrası IV %15-50 çökecek
   - Long straddle/strangle sahipleri zarar edebilir (directional hareket IV crush'i telafi etmezse)
   - **Çözüm:** ITM opsiyonlar tercih edin (IV crush'den daha az etkilenir)

3. **CHWY Short Squeeze Belirsizliği:**
   - Days to Cover 3.42 (potansiyel var ama garanti değil)
   - Earnings miss durumunda squeeze ertelenebilir
   - Short Interest son verileri takip edin

4. **0DTE Riski:**
   - 12 Haziran vadeli opsiyonlar earnings sonrası IV crush yaşayacak
   - 0DTE piyasada likidite sorunu olabilir
   - Sadece yüksek hacimli strike'larda işlem yapın

### 🟡 Orta Risk Faktörleri

1. **CPI Beklentisi Sapması:** Beklenti %4.2, sapma ±0.2 hisselerde %5+ etki yapar
2. **Piyasa Korelasyonu:** S&P 500 ve Nasdaq genel yönü etkiler
3. **DXY Güçlülüğü:** Dolar endeksi teknoloji hisselerini baskılar
4. **Theta Decay Hızlanması:** Son 2 gün theta 2x hızlanır

### ✅ Risk Azaltma Stratejileri

1. **Pozisyon boyutlandırma:** Her trade portföyün en fazla %2'si
2. **Kar hedefi:** %50 kar seviyesinde mutlaka realizasyon
3. **Spread kullanımı:** Tekli call/put yerine spread'ler (risk sınırlı)
4. **Hedge:** ORCL/CHWY straddle'larına karşı S&P 500 put hedge'i
5. **Trailing stop:** Kârlı pozisyonlarda %10 trailing stop

---

## Karşılaştırmalı Özet: ORCL vs CHWY

| Kriter | ORCL | CHWY | Avantaj |
|--------|------|------|---------|
| Earnings Zamanı | AMC (kapanış sonrası) | BMO (açılış öncesi) | ORCL — CPI'ı görebilirsiniz |
| IV Crush Riski | Orta (%15-20) | Yüksek (%40-50) | ORCL — Daha az IV kaybı |
| Squeeze Potansiyeli | Düşük | Çok Yüksek (5/5) | CHWY — Aşırı getiri potansiyeli |
| Likidite | Yüksek | Orta | ORCL — Daha kolay giriş/çıkış |
| Teknik Durum | 200MA üzerinde | 50MA altında, dip | ORCL — Daha sağlam |
| Fiyat | $210+ | $20+ | CHWY — Daha düşük maliyetle pozisyon |
| Theta Riski | Yüksek ($2.50/gün) | Düşük ($0.20/gün) | CHWY — Daha az zaman kaybı |
| **Genel Değerlendirme** | Daha güvenli | Daha spekülatif | **ORCL** (konservatif) / **CHWY** (agresif) |

---

## Sonuç ve Tavsiyeler

### Konservatif Yatırımcı İçin (Düşük Risk)
- **ORCL 10 Haziran Kapanış:** CPI sonrası 215 Call veya 210/220 Call Spread
- **CHWY:** Pozisyon açma, sadece izleme
- **Max Risk:** Pozisyonun %50'si
- **Beklenti:** %20-40 getiri

### Agresif Yatırımcı İçin (Yüksek Risk/Ödül)
- **CHWY 9 Haziran Kapanış:** 21 ATM Call veya 22-24 OTM Call bileti
- **ORCL 8-9 Haziran:** 220 OTM Call veya 200/220 Strangle
- **Max Risk:** Pozisyonun %100'ü
- **Beklenti:** %100-500 getiri (squeeze durumunda)

### Dengeleyici Strateji (Orta Risk)
- **ORCL + CHWY çift pozisyon:** Biri güvenli, biri spekülatif
- **Oran:** ORCL %70 (güvenli) + CHWY %30 (spekülatif)
- **Beklenti:** Portföy bazında %30-50 getiri

---

> **ÖNEMLİ TARİHLER TAKVİMİ:**
> - **8 Haziran:** Pozisyon biriktirme günü (her iki hisse için)
> - **9 Haziran Kapanış:** CHWY pozisyonu aç (son şans)
> - **10 Haziran 08:30 AM:** CPI Açıklaması
> - **10 Haziran Açılış:** CHWY earnings reaksiyonu
> - **10 Haziran Kapanış:** ORCL pozisyonu aç (CPI sonrası)
> - **10 Haziran Kapanış Sonrası:** ORCL earnings
> - **11 Haziran Açılış:** ORCL earnings reaksiyonu + IV crush
> - **12 Haziran:** Opsiyon vade sonu (12 Haziran vadeli)

---

*Bu rapor 7 Haziran 2026 Pazar günü hazırlanmıştır. Piyasa koşulları değişebilir.*
*Projeksiyonlar Black-Scholes modeli ve teknik analiz baz alınarak hesaplanmıştır.*
*Yatırım tavsiyesi değildir. Kendi araştırmanızı yapın.*

---
**Rapor Sonu**
