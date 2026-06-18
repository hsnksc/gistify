# Earnings Günlük Projeksiyon Raporu — Plan v3

## Hedef
Mevcut opsiyon stratejilerini SADECE rapor günü için degil, her hissenin earnings gününe kadar GUNLUK PROJEKSIYON tutarak detayli hazirla. 5 Haziran (NFP soku) gununden baslayarak her hissenin earnings gunune kadar olan gunleri kapsar.

## Skill'ler
- /gunluk-momentum-al-sat — VIX rejimi, ORB, VWAP, 0DTE, Fade/Chase, R-based risk
- /earningsplay-opsiyon-stratejisi — IV Crush, Iron Condor, Greeks, katalist skoru, wing width

## Takvim
- 7 Haziran Pazar (bugun) -> Rapor hazirlama gunu
- 8 Haziran Pazartesi -> Piyasa acik, 2 gun once (ORCL/CHWY icin)
- 9 Haziran Sali -> 1 gun once (ORCL/CHWY icin)
- 10 Haziran Carsamba -> EARNINGS GUNU (ORCL AMC, CHWY BMO) + CPI
- 11 Haziran Persembe -> EARNINGS GUNU (ADBE AMC) + PPI
- 12 Haziran Cuma -> IV Crush sonrasi 1. gun
- ... 23-24 Haziran -> FDX ve MU earnings

## Stage 1: Paralel Projeksiyon Agentlari (4 agent)

### Agent 1A: Gunluk_Projeksiyon_ORCL_CHWY
- ORCL (10 Haziran AMC) ve CHWY (10 Haziran BMO) icin gunluk projeksiyon
- 8-9-10 Haziran her gun icin: fiyat projeksiyonu, IV hareketi, theta decay, momentum stratejisi
- 0DTE opsiyon stratejileri (10 Haziran sabahi)
- CPI etkisi (10 Haziran 8:30 AM)

### Agent 1B: Gunluk_Projeksiyon_ADBE_FDX_MU
- ADBE (11 Haziran AMC), FDX (23 Haziran), MU (24 Haziran) icin gunluk projeksiyon
- ADBE: 8-9-10-11 Haziran gunluk
- FDX: 8-23 Haziran haftalik projeksiyon
- MU: 8-24 Haziran haftalik projeksiyon

### Agent 1C: Momentum_Gunluk_Strateji_Uzmani
- 5 Haziran analizinden (Kimi raporu) baslayarak gunluk momentum stratejileri
- Her gun icin: ORB, VWAP, Fade/Chase, 0DTE kurallari
- VIX rejimi tespiti ve gunluk pozisyon buyuklugu
- Earnings oncesi ozel intraday kurallar

### Agent 1D: EarningsPlay_Projeksiyon_Uzmani
- EarningsPlay v4 kurallarina gore gunluk Greeks projeksiyonu
- Theta decay gunluk hesabi (takvim gunu gunluk)
- IV crush oncesi IV seyri projeksiyonu
- Wing width, short strike gunluk ayarlamalari
- %50 kar kurali ve 21 DTE gunluk kontrol

## Stage 2: Final Birlestirme (1 agent)
- Butun projeksiyonlari birlestir
- Her hisse icin: gunluk fiyat/IV/Greeks/projeksiyon tablosu
- Gunluk aksiyon plani (ne zaman gir, ne zaman cik, ne izle)
- 0DTE/haftalik opsiyon stratejileri gunluk hali

## Cikti
/mnt/agents/output/Haziran2026_Earnings_Gunluk_Projeksiyon_v3.md
