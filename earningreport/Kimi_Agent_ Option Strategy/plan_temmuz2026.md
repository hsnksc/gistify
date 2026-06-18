# Temmuz 2026 Earnings Opsiyon Stratejisi — Master Plan

## Hedef
Temmuz 2026'da earnings açıklayacak TÜM önemli NYSE/NASDAQ hisseleri için:
- Güncel fiyat, IV, CPR, teknik analiz
- Call/Put oranları ve giriş seviyeleri
- EarningsPlay v4 stratejileri (IC, Straddle, Spread)
- Bütçe dostu + premium stratejiler
- Grafikli, detaylı, gistify.pro'ya uygun format

## Skill
- /earningsplay-opsiyon-stratejisi (v4)

## Stage 1: Araştırma (Paralel — 5+ agent)

### Agent 1A: Temmuz_Earnings_Takvim_Aracı
- Temmuz 2026 earnings takvimini topla
- Önemli şirketler: NFLX, TSLA, AAPL, AMZN, GOOGL, META, MSFT, AMD, NVDA, JPM, BAC, GS, vb.
- Her hisse için: earnings tarihi, saat (BMO/AMC), sektör, piyasa değeri

### Agent 1B: Hisse_Veri_Tarayici_1 (Teknoloji)
- NFLX, TSLA, AAPL, AMZN, GOOGL, META, MSFT
- Güncel fiyat, RSI, IV Rank, IV30, ATR, 50MA/200MA, Beta
- Call/Put Ratio (CPR)

### Agent 1C: Hisse_Veri_Tarayici_2 (Finansal + Chip + Diğer)
- AMD, NVDA, JPM, BAC, GS, WFC, C, XOM, JNJ, UNH, PFE, MA, V
- Güncel fiyat, RSI, IV Rank, IV30, ATR, 50MA/200MA, Beta
- Call/Put Ratio (CPR)

### Agent 1D: Makro_Veri_Aracı
- VIX, Fear & Greed, 10Y Yield, DXY
- FOMC takvimi (Temmuz 2026 toplantısı)
- CPI/PPI/NFP takvimi

### Agent 1E: Opsiyon_Zinciri_Tarayici
- Her hisse için mevcut opsiyon zinciri
- Expire tarihleri, ATM/OTM strikes, primler, Greeks, OI, hacim, spread %
- Bütçe dostu opsiyonlar ($0.50-$5.00 primli)

## Stage 2: Strateji Geliştirme (Paralel — 3 agent)

### Agent 2A: Strateji_Uzmani_Teknoloji
- NFLX, TSLA, AAPL, AMZN, GOOGL, META, MSFT, AMD, NVDA
- EarningsPlay v4 kurallarına göre stratejiler
- CPR bazlı call/put oranları
- Giriş seviyeleri ve zamanlaması

### Agent 2B: Strateji_Uzmani_Finansal_Diger
- JPM, BAC, GS, WFC, C, XOM, JNJ, UNH, PFE, MA, V
- Sektörel IV davranışları (Finans %20-30 crush, Enerji %25-35)
- CPR bazlı stratejiler

### Agent 2C: Butce_Dostu_Strateji_Uzmani
- Tüm hisseler için $10-$500 bütçe stratejileri
- Debit Spread, Far OTM, Lottery Ticket, Butterfly
- Call/Put oranları ve risk yönetimi

## Stage 3: Final Rapor Birleştirme

### Agent 3A: Rapor_Birlestirici
- Tüm çıktıları birleştir
- Grafikli, tablolu, detaylı format
- Her hisse için: profil, CPR, strateji, giriş seviyeleri, risk matrisi
- gistify.pro'ya uygun markdown formatı

## Çıktı
`/mnt/agents/output/Temmuz2026_Earnings_Opsiyon_Master_Stratejisi.md`
