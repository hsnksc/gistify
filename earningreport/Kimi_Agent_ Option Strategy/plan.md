# Haziran 2026 Earnings Opsiyon Stratejisi — Agent Swarm Planı

## Hedef
Kimi'deki mevcut earnings opsiyon stratejisini agent swarm mimarisiyle çok daha kapsamlı ve profesyonel hale getirmek. Her hisse için:
1. Gerçek opsiyon zinciri verileri (expire, strike, Greeks, bid-ask, OI)
2. Çoklu bütçe seviyelerinde strateji setupları (premium + bütçe dostu)
3. Günlük momentum takibi entegrasyonu
4. Makro/sektörel bağlam

## Kullanılacak Skill'ler
- `earningsplay-opsiyon-stratejisi` — Ana earnings stratejileri (IV Crush, Iron Condor, Straddle, Greeks)
- `borsa-tarama-gunluk` — Günlük tarama, opsiyon zinciri verileri, IV analizi
- `gunluk-momentum-al-sat` — Momentum takibi, VIX rejimi, intraday stratejiler
- `dailystockscan-makro-sektorel` — Makro rejim, sektör rotasyonu, çok faktörlü tarama

## Stage 1: Araştırma (Paralel — 4 Agent)

### Agent 1A: Earnings_Takvim_Aracı
- Haziran 2026 earnings takvimini topla (8-12 Haziran haftası + kalan Haziran)
- Önemli şirketler: ORCL, AVGO, CRWD, PANW, CRDO ve diğerleri
- Her hisse için: earnings tarihi, saati (BMO/AMC), sektör, piyasa değeri
- Kaynak: EarningsWhispers, Yahoo Finance, Nasdaq

### Agent 1B: Hisse_Veri_Aracı
- Her earnings hissesi için güncel fiyat, hacim, ATR, VWAP, RSI, MACD
- IV Rank, IV Percentile, IV30/60/90
- Geçmiş earnings tepkisi (implied vs actual move)
- 50MA/200MA durumu
- Kaynak: Yahoo Finance, Finviz, MarketChameleon

### Agent 1C: Opsiyon_Zinciri_Aracı ⭐ Kullanıcı İsteği
- Her hisse için mevcut opsiyon zincirini analiz et
- **Expire tarihleri**: Haftalık, aylık, en yakın 3-5 expiration
- **Strikes**: ATM, OTM (%5, %10, %15 OTM)
- **Greeks**: Delta, Gamma, Theta, Vega her strike için
- **Primler**: Bid-ask, mid-price, son işlem
- **Likidite**: Open Interest, hacim, spread %
- Kaynak: MarketChameleon, CBOE, Yahoo Finance Options

### Agent 1D: Makro_Sektor_Aracı
- VIX, Fear & Greed, 10Y Yield, DXY durumu
- Sektör rotasyonu (XLK, XLV, XLE, XLF vs)
- FOMC, CPI, NFP takvimi (çakışma kontrolü)
- Jeopolitik riskler
- Kaynak: CBOE, CNN F&G, FRED

## Stage 2: Strateji Geliştirme (Paralel — 3 Agent)

### Agent 2A: Premium_Strateji_Uzmani
- Her hisse için "premium" (ITM/ATM) stratejiler:
  - Long Straddle (ATM Call + ATM Put)
  - Long Strangle (OTM Call + OTM Put)
  - Iron Condor (geniş wing'li)
  - Calendar Spread
- Maliyet: $1000-$5000+ arası
- Detaylı Greeks, max risk/reward, breakeven'ler

### Agent 2B: Bütçe_Dostu_Strateji_Uzmani ⭐ Kullanıcı İsteği
- Her hisse için "bütçe dostu" alternatifler:
  - **Debit Call Spread** (bullish bias, $50-$200 maliyet)
  - **Debit Put Spread** (bearish bias, $50-$200 maliyet)
  - **Call/Put Ratio Spread** (asimetrik, $100-$300 maliyet)
  - **Far OTM Strangle** ($0.50-$2.00 primli, toplam $100-$400)
  - **Risk Reversal** (collar benzeri, düşük/near-zero maliyet)
  - **OTM Butterfly** ($50-$150 maliyet)
- Her strateji için: gerçek strike'lar, primler, max kazanç/kayıp, breakeven

### Agent 2C: Risk_Greeks_Uzmani
- Her strateji için detaylı Greeks analizi
- IV Crush etkisi simülasyonu (%30-70 crush senaryoları)
- Risk/Reward oranları ve kazanma olasılıkları
- Pozisyon boyutlandırma (hesap büyüklüğüne göre)
- Stop-loss ve take-profit seviyeleri

## Stage 3: Rapor Birleştirme (1 Agent)

### Agent 3A: Rapor_Birlestirici
- Tüm Stage 1 ve Stage 2 çıktılarını birleştir
- Final markdown raporu oluştur:
  - Makro Bağlam ve Piyasa Rejimi
  - Sektörel Analiz
  - Hisse Bazlı Detaylı Analiz (her biri için):
    - Şirket profili ve teknik veriler
    - Opsiyon zinciri özeti (expire'lar, strikes, Greeks)
    - Premium strateji setupları ($1000+)
    - Bütçe dostu strateji setupları ($50-$500)
    - Risk/Greeks analizi
  - Günlük Momentum Takibi
  - Eylem Planı ve Takvim
- `/mnt/agents/output/Haziran2026_Earnings_Opsiyon_Stratejisi.md`

## Çıktı Dosyaları
```
/mnt/agents/output/research/
  earnings_takvim_20260606.md
  hisse_verileri_20260606.md
  opsiyon_zinciri_20260606.md
  makro_sektor_20260606.md
/mnt/agents/output/strategies/
  premium_stratejiler_20260606.md
  butce_dostu_stratejiler_20260606.md
  risk_greeks_20260606.md
/mnt/agents/output/
  Haziran2026_Earnings_Opsiyon_Stratejisi.md  (FINAL)
```
