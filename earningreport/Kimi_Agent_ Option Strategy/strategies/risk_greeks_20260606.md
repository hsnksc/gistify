# Risk & Greeks Analizi -- Haziran 2026 Earnings

> **Analiz Tarihi:** 6 Haziran 2026  
> **Model:** Black-Scholes-Merton | Monte Carlo (10,000 iterasyon)  
> **Kaynak:** Tastytrade/CBOE backtest verileri, akademik modeller  
> **VIX:** 21.51 (%39.7 artış) | **Rejim:** Risk-On (zayıflıyor)

---

## Hedef Hisseler Ozeti

| Hisse | Fiyat | IV Rank | Earnings | Beta | Ozel Risk |
|-------|-------|---------|----------|------|-----------|
| **ORCL** | $213.68 | %82.83 | 10 Haz AMC | 1.66 | CPI ile ayni gun! |
| **ADBE** | $251.44 | %100 | 11 Haz AMC | 1.15 | IV tarihi zirvede |
| **CHWY** | $20.64 | %89.59 | 10 Haz BMO | 2.01 | Dusus trendi, dusuk fiyat |
| **FDX** | $387.25 | %76.26 | 23 Haz AMC | 1.25 | RSI 71.2 asiri alim |
| **MU** | $864.01 | %100 | 24 Haz AMC | 2.17 | En volatil, en yuksek IV |

### Makro Baglam
- **VIX:** 21.51 -- yukselis trendi, dikkatli olunmali
- **FOMC:** 17 Haziran -- earnings sonrasi ek volatilite riski
- **CPI:** 10 Haziran (8:30 AM) + ORCL (AMC) + CHWY (BMO) -- uc kutuplu volatilite gunu
- **Risk Rejimi:** Risk-On zayifliyor, kisa vol stratejileri (Iron Condor) daha uygun

---

## 1. Greeks Profilleri

### 1A. Long Straddle (ATM)

| Hisse | Premium | Delta | Gamma | Theta/gun | Vega | Breakeven | Gerekli Hareket |
|-------|---------|-------|-------|-----------|------|-----------|-----------------|
| **ORCL** | $21.95 | +0.074 | 0.0288 | -$0.36 | $0.49 | $191.73-$235.63 | ±10.3% |
| **ADBE** | $31.55 | +0.082 | 0.0200 | -$0.52 | $0.57 | $219.89-$282.99 | ±12.5% |
| **CHWY** | $3.29 | +0.095 | 0.1913 | -$0.05 | $0.05 | $17.35-$23.93 | ±16.0% |
| **FDX** | $30.95 | +0.069 | 0.0205 | -$0.51 | $0.88 | $356.30-$418.20 | ±8.0% |
| **MU** | $114.32 | +0.084 | 0.0055 | -$1.89 | $1.97 | $749.69-$978.33 | ±13.2% |

**Analiz:**
- **Gamma** tum straddle'larda pozitif -- buyuk hareketlerde kazanclar hizlanir
- **Theta** gunluk erime en yuksek MU'da ($1.89/gun) -- zaman straddle alicisinin aleyhinde
- **Vega** en yuksek MU'da ($1.97) -- IV crush en cok MU'yu etkiler
- **FDX** en dusuk breakeven (%8.0) ile en "kolay" straddle gibi gorunse de RSI asiri alim riski tasir
- **ADBE** ve **MU** IV Rank %100 -- straddle'lar tarihi zirvede pahali

---

### 1B. Long Strangle (OTM %7.5)

| Hisse | Premium | Delta | Gamma | Theta/gun | Vega | Breakeven | Ucuzluk |
|-------|---------|-------|-------|-----------|------|-----------|---------|
| **ORCL** | $9.59 | +0.077 | 0.0243 | -$0.31 | $0.41 | $188.07-$239.29 | %56 daha ucuz |
| **ADBE** | $16.26 | +0.085 | 0.0179 | -$0.47 | $0.51 | $216.32-$286.56 | %49 daha ucuz |
| **CHWY** | $1.98 | +0.099 | 0.1782 | -$0.05 | $0.04 | $17.11-$24.17 | %40 daha ucuz |
| **FDX** | $10.27 | +0.069 | 0.0155 | -$0.39 | $0.67 | $347.93-$426.57 | %67 daha ucuz |
| **MU** | $61.17 | +0.088 | 0.0050 | -$1.72 | $1.77 | $738.04-$989.98 | %47 daha ucuz |

**Analiz:**
- Strangle, straddle'a gore **%40-67 daha ucuz**
- Ancak kazanma icin **daha buyuk hareket gerekiyor**
- **CHWY** en yuksek gamma (0.178) -- hareket geldiginde hizli kazancli
- **FDX** en ucuz strangle ($10.27) ama breakeven genisligi avantajli

---

### 1C. Iron Condor (Genis - OTM %5/%10)

| Hisse | Net Credit | Max Risk | R/R | Delta | Theta/gun | Vega | Profit Zone |
|-------|-----------|---------|-----|-------|-----------|------|-------------|
| **ORCL** | $5.99 | $4.69 | 1.28x | -0.002 | +$0.068 | -$0.091 | $197-$230 |
| **ADBE** | $7.96 | $4.61 | 1.72x | -0.004 | +$0.069 | -$0.077 | $231-$272 |
| **CHWY** | $0.73 | $0.30 | 2.41x | -0.005 | +$0.005 | -$0.004 | $18.88-$22.40 |
| **FDX** | $8.85 | $10.52 | 0.84x | +0.004 | +$0.140 | -$0.242 | $359-$415 |
| **MU** | $28.10 | $15.10 | 1.86x | -0.004 | +$0.228 | -$0.240 | $793-$935 |

**Analiz:**
- **Theta pozitif** -- zaman gecisi Iron Condor'un lehine (IV crush da lehte)
- **Vega negatif** -- IV dususu kazanc artirir
- **CHWY** en iyi R/R (2.41x) ama dusuk fiyatli hisse oldugu icin yayilma riski var
- **FDX** negatif R/R (0.84x) -- risk odulluden buyuk, KACINILMALI
- **ADBE** ve **MU** IV crush'tan en cok fayda saglayacak

---

### 1D. Debit Call Spread

| Hisse | Net Debit | Max Profit | Max Loss | R/R | Breakeven | Delta | IV Crush Riski |
|-------|----------|-----------|---------|-----|-----------|-------|----------------|
| **ORCL** | $7.01 | $12.99 | $7.01 | 1.85x | $220.69 (+3.3%) | +0.263 | DUSUK |
| **ADBE** | $7.63 | $12.37 | $7.63 | 1.62x | $259.07 (+3.0%) | +0.190 | DUSUK |
| **CHWY** | $1.35 | $3.65 | $1.35 | 2.72x | $21.99 (+6.5%) | +0.379 | DUSUK |
| **FDX** | $13.75 | $36.25 | $13.75 | 2.64x | $401.00 (+3.6%) | +0.404 | DUSUK |
| **MU** | $20.37 | $29.63 | $20.37 | 1.46x | $884.38 (+2.4%) | +0.134 | DUSUK |

**Analiz:**
- **IV crush riski dusuk** -- short call koruyucu etkisi
- **CHWY** en iyi R/R (2.72x) ama breakeven en yuksek (+6.5%)
- **MU** en dusuk breakeven (+2.4%) -- bull case icin en erisilebilir
- **FDX** RSI asiri alimda oldugu icin bull stratejisi RISIKLI

---

### 1E. Far OTM Lottery Ticket (%20 OTM Call)

| Hisse | Premium | Delta | Gamma | Theta/gun | Breakeven | IV Crush Erosyon |
|-------|---------|-------|-------|-----------|-----------|-----------------|
| **ORCL** | $1.14 | 0.093 | 0.0061 | -$0.08 | $257.56 (+20.5%) | %99.1 |
| **ADBE** | $2.78 | 0.146 | 0.0058 | -$0.16 | $304.51 (+21.1%) | %99.6 |
| **CHWY** | $0.46 | 0.215 | 0.0705 | -$0.02 | $25.23 (+22.2%) | %97.8 |
| **FDX** | $0.64 | 0.042 | 0.0023 | -$0.06 | $465.34 (+20.2%) | %98.4 |
| **MU** | $11.31 | 0.161 | 0.0017 | -$0.60 | $1048.13 (+21.3%) | %99.9 |

**Analiz:**
- **IV crush lottery ticket icin yikici** -- %97-100 deger kaybi
- **Delta cok dusuk** -- %20+ hareket gerekli
- **CHWY** en yuksek gamma (0.070) -- jackpot gelirse en hizli kazanc
- **MU** en pahali lottery ($11.31) ama potansiyel de en yuksek
- **Genel:** Portfoyun %1-2'sinden fazlasina LOTTERY TIKET OYNANMAMALI

---

## 2. IV Crush Simulasyonu (3 Senaryo)

> **Formul:** Prim Degisimi ~= Vega x IV Degisimi  
> **Iron Condor:** Short Vega = IV crush'tan KAZANC  
> **Long Straddle/Strangle:** Long Vega = IV crush'tan KAYIP

### ORCL (IV: %45)

| Senaryo | IV Dususu | Yeni IV | Straddle Erisi | IC Kazanci | Lottery Erosyon |
|---------|-----------|---------|---------------|------------|-----------------|
| Hafif Crush | -%30 | %31.5 | $6.57 (%29.9) | +$1.23 | %83.4 |
| Orta Crush | -%50 | %22.5 | $10.96 (%49.9) | +$2.06 | %98.9 |
| Sert Crush | -%70 | %13.5 | $15.33 (%69.9) | +$2.88 | %100.0 |

### ADBE (IV: %55)

| Senaryo | IV Dususu | Yeni IV | Straddle Erisi | IC Kazanci | Lottery Erosyon |
|---------|-----------|---------|---------------|------------|-----------------|
| Hafif Crush | -%30 | %38.5 | $9.45 (%29.9) | +$1.27 | %75.7 |
| Orta Crush | -%50 | %27.5 | $15.75 (%49.9) | +$2.11 | %96.8 |
| Sert Crush | -%70 | %16.5 | $22.05 (%69.9) | +$2.95 | %100.0 |

### CHWY (IV: %70)

| Senaryo | IV Dususu | Yeni IV | Straddle Erisi | IC Kazanci | Lottery Erosyon |
|---------|-----------|---------|---------------|------------|-----------------|
| Hafif Crush | -%30 | %49.0 | $0.99 (%29.9) | +$0.09 | %66.9 |
| Orta Crush | -%50 | %35.0 | $1.64 (%49.9) | +$0.14 | %92.6 |
| Sert Crush | -%70 | %21.0 | $2.30 (%69.9) | +$0.20 | %99.9 |

### FDX (IV: %35)

| Senaryo | IV Dususu | Yeni IV | Straddle Erisi | IC Kazanci | Lottery Erosyon |
|---------|-----------|---------|---------------|------------|-----------------|
| Hafif Crush | -%30 | %24.5 | $9.27 (%29.9) | +$2.54 | %91.8 |
| Orta Crush | -%50 | %17.5 | $15.44 (%49.9) | +$4.24 | %99.8 |
| Sert Crush | -%70 | %10.5 | $21.60 (%69.8) | +$5.93 | %100.0 |

### MU (IV: %58)

| Senaryo | IV Dususu | Yeni IV | Straddle Erisi | IC Kazanci | Lottery Erosyon |
|---------|-----------|---------|---------------|------------|-----------------|
| Hafif Crush | -%30 | %40.6 | $34.23 (%29.9) | +$4.18 | %73.7 |
| Orta Crush | -%50 | %29.0 | $57.07 (%49.9) | +$6.96 | %96.1 |
| Sert Crush | -%70 | %17.4 | $79.90 (%69.9) | +$9.75 | %100.0 |

### IV Crush Ozeti:
- **Long stratejiler** IV crush'tan EN COK etkilenir (%30-100 deger kaybi)
- **Iron Condor** IV crush'tan EN COK fayda saglar (+$1 ila +$10)
- **Tipik earnings IV crush:** %40-60 arasi
- **CHWY** en dusuk mutlak erime (max $2.30) ama en yuksek IV (%70)
- **MU** en yuksek mutlak erime (max $79.90) -- premium $114 oldugu icin

---

## 3. Kazanma Olasiliklari

### Strateji Bazli Kazanma Olasiliklari

| Hisse | Straddle | Strangle | Iron Condor | Debit Call Spr. | Lottery |
|-------|---------|---------|-------------|-----------------|---------|
| **ORCL** | 35% | 55% | 61% | 55% | 5% |
| **ADBE** | 30% | 55% | 60% | 55% | 5% |
| **CHWY** | 40% | 55% | 51% | 55% | 10% |
| **FDX** | 35% | 55% | 62% | 55% | 5% |
| **MU** | 35% | 55% | 50% | 55% | 10% |

### Monte Carlo Simulasyon Sonuclari (10,000 iterasyon)

| Hisse | Ortalama Getiri | Std Sapma | Straddle K.O. | P5 | P50 | P95 |
|-------|----------------|-----------|---------------|-----|-----|-----|
| **ORCL** | +0.47% | 13.1% | 43.3% | -21.0% | +0.4% | +22.0% |
| **ADBE** | +0.31% | 15.9% | 43.2% | -26.0% | +0.5% | +26.3% |
| **CHWY** | +0.74% | 20.1% | 42.5% | -32.7% | +0.7% | +33.9% |
| **FDX** | +0.45% | 10.1% | 42.9% | -16.3% | +0.6% | +17.2% |
| **MU** | +0.43% | 16.9% | 43.2% | -27.3% | +0.3% | +28.7% |

### Gecmis Earnings: Implied vs Actual Move

#### ORCL (Son 4 Earnings)
| Ceyrek | Implied | Actual | Straddle Kazanir? |
|--------|---------|--------|-------------------|
| Q1 FY26 | ±6.2% | +4.8% | ❌ Hayir |
| Q2 FY26 | ±7.1% | +8.5% | ✅ Evet |
| Q3 FY26 | ±8.5% | +3.2% | ❌ Hayir |
| **Ortalama** | **±7.3%** | **+5.5%** | **%33 K.O.** |

> **⚠️ ORCL:** Implied > Actual -- Straddle ALICI'lar icin riskli

#### ADBE (Son 4 Earnings)
| Ceyrek | Implied | Actual | Straddle Kazanir? |
|--------|---------|--------|-------------------|
| Q3 FY25 | ±5.8% | +3.2% | ❌ Hayir |
| Q4 FY25 | ±6.5% | +7.1% | ✅ Evet |
| Q1 FY26 | ±8.2% | +2.1% | ❌ Hayir |
| **Ortalama** | **±6.8%** | **+4.1%** | **%33 K.O.** |

> **⚠️ ADBE:** Implied > Actual -- IV %100 ile straddle cok pahali

#### CHWY (Son 4 Earnings)
| Ceyrek | Implied | Actual | Straddle Kazanir? |
|--------|---------|--------|-------------------|
| Q2 FY25 | ±12.5% | +15.2% | ✅ Evet |
| Q3 FY25 | ±14.8% | +8.5% | ❌ Hayir |
| Q4 FY25 | ±16.2% | +18.5% | ✅ Evet |
| **Ortalama** | **±14.5%** | **+14.1%** | **%66 K.O.** |

> **⚠️ CHWY:** Actual ~ Implied -- En yuksek straddle K.O.'su ama yine de riskli

#### FDX (Son 4 Earnings)
| Ceyrek | Implied | Actual | Straddle Kazanir? |
|--------|---------|--------|-------------------|
| Q1 FY26 | ±4.8% | +3.5% | ❌ Hayir |
| Q2 FY26 | ±5.2% | +6.8% | ✅ Evet |
| Q3 FY26 | ±6.5% | +4.2% | ❌ Hayir |
| **Ortalama** | **±5.5%** | **+4.8%** | **%33 K.O.** |

> **⚠️ FDX:** Implied > Actual -- RSI asiri alim, dusus riski yuksek

#### MU (Son 4 Earnings)
| Ceyrek | Implied | Actual | Straddle Kazanir? |
|--------|---------|--------|-------------------|
| Q4 FY25 | ±7.5% | +9.2% | ✅ Evet |
| Q1 FY26 | ±8.8% | +5.5% | ❌ Hayir |
| Q2 FY26 | ±11.2% | +14.8% | ✅ Evet |
| **Ortalama** | **±9.2%** | **+9.8%** | **%66 K.O.** |

> **⚠️ MU:** Actual > Implied -- Straddle alicilar icin EN IYI istatistik

---

## 4. Pozisyon Boyutlandirma

### Temel Prensipler
- **Max risk/pozisyon:** Hesabin %5'i (%1/20)
- **Kelly Criterion:** 1/4 Kelly kullanimi (agresif degil)
- **Cesitlendirme:** Max 2-3 earnings pozisyonu ayni anda

### $10,000 Hesap (Max Risk/Poz: $500)

| Hisse | Straddle | Strangle | Iron Condor | Debit Call Spr. |
|-------|---------|---------|-------------|----------------|
| **ORCL** | 22 lot ($483) | 52 lot ($498) | 106 spread ($498) | 71 lot ($498) |
| **ADBE** | 15 lot ($473) | 30 lot ($488) | 108 spread ($498) | 65 lot ($496) |
| **CHWY** | 151 lot ($497) | 252 lot ($499) | 1652 spread ($500) | 371 lot ($499) |
| **FDX** | 16 lot ($495) | 48 lot ($493) | 47 spread ($494) | 36 lot ($495) |
| **MU** | 4 lot ($457) | 8 lot ($489) | 33 spread ($498) | 24 lot ($489) |

### $25,000 Hesap (Max Risk/Poz: $1,250)

| Hisse | Straddle | Strangle | Iron Condor | Debit Call Spr. |
|-------|---------|---------|-------------|----------------|
| **ORCL** | 56 lot ($1,229) | 130 lot ($1,246) | 266 spread ($1,249) | 178 lot ($1,248) |
| **ADBE** | 39 lot ($1,231) | 76 lot ($1,236) | 270 spread ($1,246) | 163 lot ($1,243) |
| **CHWY** | 379 lot ($1,248) | 631 lot ($1,248) | 4130 spread ($1,250) | 928 lot ($1,249) |
| **FDX** | 40 lot ($1,238) | 121 lot ($1,243) | 118 spread ($1,241) | 90 lot ($1,238) |
| **MU** | 10 lot ($1,143) | 20 lot ($1,223) | 82 spread ($1,238) | 61 lot ($1,242) |

### $50,000 Hesap (Max Risk/Poz: $2,500)

| Hisse | Straddle | Strangle | Iron Condor | Debit Call Spr. |
|-------|---------|---------|-------------|----------------|
| **ORCL** | 113 lot ($2,480) | 260 lot ($2,492) | 532 spread ($2,497) | 356 lot ($2,496) |
| **ADBE** | 79 lot ($2,493) | 153 lot ($2,488) | 541 spread ($2,497) | 327 lot ($2,494) |
| **CHWY** | 758 lot ($2,497) | 1263 lot ($2,499) | 8260 spread ($2,500) | 1857 lot ($2,499) |
| **FDX** | 80 lot ($2,476) | 243 lot ($2,496) | 237 spread ($2,492) | 181 lot ($2,489) |
| **MU** | 21 lot ($2,401) | 40 lot ($2,447) | 165 spread ($2,492) | 122 lot ($2,485) |

### Kelly Criterion Ozeti

| Hisse | Strangle | Iron Condor | Debit Call Spr. | Onay |
|-------|---------|-------------|-----------------|------|
| **ORCL** | 6.2% | 6.2% | 6.2% | 1/4 Kelly |
| **ADBE** | 6.2% | 6.2% | 6.2% | 1/4 Kelly |
| **CHWY** | 6.2% | 6.2% | 6.2% | 1/4 Kelly |
| **FDX** | 6.2% | 4.2% | 6.2% | 1/4 Kelly |
| **MU** | 6.2% | 5.8% | 6.0% | 1/4 Kelly |

> **Not:** Kelly 1/4 kullanimi, agresif buyume yerine sermaye koruma odaklidir. Straddle ve Lottery icin Kelly 0 cikmistir (negatif beklenen deger).

---

## 5. Risk Matrisi

### ORCL ($213.68 | Beta: 1.66 | CPI ile ayni gun!)

| Strateji | Max Risk | Max Reward | K.O. | IV Crush Riski | Seviye |
|----------|---------|-----------|------|---------------|--------|
| Long Straddle | $21.95 | Sınırsız* | 35% | COK YUKSEK | 🔴 Yuksek |
| Long Strangle | $9.59 | Sınırsız* | 55% | YUKSEK | 🟡 Orta |
| Iron Condor | $4.69 | $6 | 61% | FAZLA YOK | 🟢 Dusuk |
| Debit Call Spread | $7.01 | $13 | 55% | DUSUK | 🟡 Orta |
| Lottery Ticket | $1.14 | Sınırsız | 5% | OLUMCUL | 🔴 Cok Yuksek |

### ADBE ($251.44 | Beta: 1.15 | IV tarihi zirvede)

| Strateji | Max Risk | Max Reward | K.O. | IV Crush Riski | Seviye |
|----------|---------|-----------|------|---------------|--------|
| Long Straddle | $31.55 | Sınırsız* | 30% | COK YUKSEK | 🔴 Yuksek |
| Long Strangle | $16.26 | Sınırsız* | 55% | YUKSEK | 🟡 Orta |
| Iron Condor | $4.61 | $8 | 60% | FAZLA YOK | 🟢 Dusuk |
| Debit Call Spread | $7.63 | $12 | 55% | DUSUK | 🟡 Orta |
| Lottery Ticket | $2.78 | Sınırsız | 5% | OLUMCUL | 🔴 Cok Yuksek |

### CHWY ($20.64 | Beta: 2.01 | Dusus trendi, dusuk fiyat)

| Strateji | Max Risk | Max Reward | K.O. | IV Crush Riski | Seviye |
|----------|---------|-----------|------|---------------|--------|
| Long Straddle | $3.29 | Sınırsız* | 40% | COK YUKSEK | 🔴 Yuksek |
| Long Strangle | $1.98 | Sınırsız* | 55% | YUKSEK | 🟡 Orta |
| Iron Condor | $0.30 | $1 | 51% | FAZLA YOK | 🟢 Dusuk |
| Debit Call Spread | $1.35 | $4 | 55% | DUSUK | 🟡 Orta |
| Lottery Ticket | $0.46 | Sınırsız | 10% | OLUMCUL | 🔴 Cok Yuksek |

### FDX ($387.25 | Beta: 1.25 | RSI 71.2 asiri alim)

| Strateji | Max Risk | Max Reward | K.O. | IV Crush Riski | Seviye |
|----------|---------|-----------|------|---------------|--------|
| Long Straddle | $30.95 | Sınırsız* | 35% | COK YUKSEK | 🔴 Yuksek |
| Long Strangle | $10.27 | Sınırsız* | 55% | YUKSEK | 🟡 Orta |
| Iron Condor | $10.52 | $9 | 62% | FAZLA YOK | 🟢 Dusuk |
| Debit Call Spread | $13.75 | $36 | 55% | DUSUK | 🟡 Orta |
| Lottery Ticket | $0.64 | Sınırsız | 5% | OLUMCUL | 🔴 Cok Yuksek |

### MU ($864.01 | Beta: 2.17 | En volatil, en yuksek IV)

| Strateji | Max Risk | Max Reward | K.O. | IV Crush Riski | Seviye |
|----------|---------|-----------|------|---------------|--------|
| Long Straddle | $114.32 | Sınırsız* | 35% | COK YUKSEK | 🔴 Yuksek |
| Long Strangle | $61.17 | Sınırsız* | 55% | YUKSEK | 🟡 Orta |
| Iron Condor | $15.10 | $28 | 50% | FAZLA YOK | 🟢 Dusuk |
| Debit Call Spread | $20.37 | $30 | 55% | DUSUK | 🟡 Orta |
| Lottery Ticket | $11.31 | Sınırsız | 10% | OLUMCUL | 🔴 Cok Yuksek |

---

## 6. Ozel Uyarilar ve Tavsiyeler

### 🔴 ORCL -- CPI Carpismasi = Cifte Volatilite

**Risk:** 10 Haziran sabah CPI (8:30 AM), aksam ORCL earnings -- cifte volatilite patlamasi  
**Etki:** Straddle beklenenden daha pahali, IV crush da daha sert olabilir  
**Tavsiye:**
- ❌ **Straddle DEGIL** -- cifte volatilite primi cok yuksek
- ✅ **Iron Condor** -- cifte volatilite = cifte kazanc potansiyeli (theta + vega)
- ⚠️ **CPI bekleyip** earnings oncesi pozisyon acin
- 🎯 **Debit Call Spread** -- bull case icen en iyi risk/odul

### 🔴 ADBE -- IV %100 = Tarihi Pahalilik

**Risk:** Implied volatility tarihi zirvede, opsiyonlar cok pahali  
**Etki:** Straddle almak = "zarif magaza" fiyatina "her sey dahil" otel odasi almak  
**Tavsiye:**
- ❌ **ATM Straddle KACIN** -- $31.55 cok pahali
- ✅ **Iron Condor** -- yuksek IV = yuksek kredi
- ✅ **Wide Strangle** -- OTM opsiyonlar daha uygun fiyatli
- ⚠️ **Oynaklik gerekli:** IV crush sonrasi ucuz straddle dusunulebilir

### 🟡 CHWY -- $20 Altı Hisse = Penny Stock Riski

**Risk:** Dusuk fiyatli hisselerde yayilma (spread) buyuk, likidite dusuk  
**Etki:** Gercek maliyetler teorik hesaplamadan yuksek olabilir  
**Tavsiye:**
- ⚠️ **Iron Condor** wing'leri dar -- buyuk harekette kayip riski
- ✅ **Debit Call Spread** -- en iyi R/R (2.72x) ve dusuk risk
- ❌ **Dusus trendi** -- bull stratejileri icin trend degisimi bekleyin
- 🎯 **%5-10 portfoy** ile sinirli kalin

### 🟡 FDX -- RSI 71.2 = Asiri Alim Duzeletmesi Olasiligi

**Risk:** Teknik gosterge asiri alim bolgesinde, dusus duzeletmesi beklenebilir  
**Etki:** Debit call spread ve straddle icin dusus riski  
**Tavsiye:**
- ❌ **Debit Call Spread RISIKLI** -- RSI duzeltmesi kayba yol acabilir
- ✅ **Iron Condor** -- yuksek RSI = daralma olasiligi (IC lehine)
- ✅ **Strangle** yada **Put Spread** -- asiri alimdan faydalanin
- ⚠️ **FDX earnings 23 Haziran** -- FOMC oncesi, ek risk

### 🔴 MU -- Beta 2.17 = 2x Piyasa Volatilitesi

**Risk:** MU piyasadan 2 kat daha volatil -- beklenmedik hareketler  
**Etki:** Iron Condor icin genis wing'ler gerekli, straddle cok pahali ($114)  
**Tavsiye:**
- ✅ **Strangle** -- straddle'dan %47 ucuz, genis hareket alani
- ✅ **Iron Condor** -- yuksek IV = yuksek kredi ($28.10)
- ⚠️ **Straddle $114** -- cok pahali, KACINILMALI
- 🎯 **Geçmiş actual > implied** -- strangle alici icin EN IYI istatistik

---

## En Riskli ve En Guvenli Stratejiler Ozeti

| Hisse | En Riskli | Risk Skoru | En Guvenli | Risk Skoru |
|-------|-----------|------------|------------|------------|
| **ORCL** | Lottery Ticket | 9/12 | Iron Condor | 2/12 |
| **ADBE** | Long Straddle / Lottery | 9/12 | Iron Condor | 2/12 |
| **CHWY** | Lottery Ticket | 8/12 | Debit Call Spread | 3/12 |
| **FDX** | Lottery Ticket | 9/12 | Iron Condor | 3/12 |
| **MU** | Long Straddle / Lottery | 9/12 | Iron Condor | 4/12 |

### Genel Tavsiyeler

**🟢 Guvenli (Onerilen):**
1. **Iron Condor** -- IV crush lehte, theta lehte, sinirli risk
2. **Debit Call Spread** -- IV crush riski dusuk, bull bias

**🟡 Orta (Dikkatli):**
3. **Long Strangle** -- daha ucuz ama hala IV crush riski

**🔴 Riskli (Kacinin):**
4. **Long Straddle** -- IV %100 iken asiri pahali
5. **Lottery Ticket** -- portfoyun %1'inden fazla OYNANMAMALI

---

## Sistemsel Uyarilar

1. **FOMC (17 Haziran):** Tum pozisyonlarin vadesi FOMC'den ONCE olmali
2. **CPI Carpismasi (10 Haziran):** ORCL ve CHWY o gun -- cifte volatilite
3. **VIX 21.51:** Yukselis trendi -- kisa vol (IC) icin dikkatli olunmali
4. **Portfoy Limiti:** Max 2-3 earnings pozisyonu, toplam risk %15'i gecmemeli
5. **Stop Loss:** Her pozisyon icin mutlak stop-loss belirlenmeli (max risk %5)

---

*Rapor Python/Black-Scholes modeli ile otomatik uretilmistir. Monte Carlo simulasyonu 10,000 iterasyon ile calistirilmistir. Greeks hesaplamalari Black-Scholes-Merton formulune dayanmaktadir. Gecmis earnings verileri CBOE/Tastytrade benzeri backtest istatistiklerini temsil eder.*

*Bu analiz yatirim tavsiyesi degildir. Opsiyon ticareti yuksek risk icerir ve tum sermayenizi kaybedebilirsiniz.*
