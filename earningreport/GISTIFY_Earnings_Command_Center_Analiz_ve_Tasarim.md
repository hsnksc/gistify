# GISTIFY EARNINGS COMMAND CENTER
## Analiz Raporu + Gelişmiş Birleşik Modül Tasarımı

**Tarih:** 28 Haziran 2026  
**Analiz Eden:** Gistify Earning Strategy Uzmanı  
**Hedef:** `/app` ve `/earnings` deneyimlerini tek bir gelişmiş modülde birleştirmek

---

## 1. EXECUTIVE SUMMARY

Gistify platformunda iki ana earnings odaklı sayfa bulunuyor:

| Sayfa | URL | Odak | Güçlü Yön | Eksiklik |
|-------|-----|------|-----------|----------|
| **Earnings Strategy Workspace** | `/app` | Archive + Report Reader | Markdown rapor görüntüleme, Playbook/Calendar/Risk tab'ları | Etkileşimli strateji yönetimi, canlı takip, P&L yok |
| **Earnings Workspace** | `/earnings` | Rolling 2-Month Strategy | Greeks Dashboard, Makro entegrasyon, FOMC Pipeline, Budget Friendly | Archive/rapor okuma, backtest, portföy analizi zayıf |

**Temel Problem:** İki sayfa birbirinin tamamlayıcısı ama ayrık (siloed). Kullanıcı earnings raporunu `/app`'te okuyor, stratejiyi `/earnings`'te yönetiyor, Greeks'i başka yerden takip ediyor. Bu sürtünme yaratıyor.

**Öneri:** Tek bir **"Earnings Command Center"** modülü. Archive + Live Strategy + Greeks Matrix + Risk Ops + Deploy Pipeline — hepsi tek sayfa, tek context, tek workflow.

---

## 2. MEVCUT MİMARİNİN DETAYLI ANALİZİ

### 2.1 `/app` — Earnings Strategy Workspace

**Görsel Özellikler (Dark Theme, Modern UI):**
- Header: Gistify logo + "Earnings Intelligence" tagline
- Navigation: Earnings Strategy | Admin | Earnings | Momentum | Daily | CPI/PPI | Calendar | Market Flash | Flow
- Dil: TR | EN toggle
- Stats badges: `19 BULLISH BIAS` | `4 BEARISH BIAS` | `7 BALANCED`

**Ana Bileşenler:**

#### A. Archive Carousel
- **LIVE** raporlar: VIX değeri + timestamp + rapor başlığı
- **ARCHIVE** raporlar: Geçmiş raporlar tarih sırasıyla
- Örnek: "EarningsPlay v4 Metodolojisi | 32 Hisse | CPR Analizi | IV Rank Bazlı Stratejiler" (VIX 18.92, Jun 27, 2026)
- Örnek: "VIX 18.6 ile low-volatility ortamı..." (VIX 18.63, Jun 25, 2026)
- Örnek: "ORCL, CHWY, ADBE, FDX ve MU için earnings öncesi opsiyon stratejisi" (VIX PENDING, Jun 09, 2026)

#### B. Summary Metrics Bar
```
30 earnings event | 19 bullish | 4 bearish | Avg IV Rank %50 | Avg CPR 1.03
```

#### C. Selected Report Panel
- **Post:** Markdown raporun tam metni (okuma modu)
- **Playbook:** Strateji özetleri
- **Calendar:** Earnings takvimi
- **Risk:** Risk analizleri
- *Not: Bu tab'lar READ-ONLY. Etkileşimli düzenleme veya canlı takip yok.*

#### D. Current Snapshot Widget
- REPORT COUNT: 3
- LATEST LOAD: timestamp
- ACTIVE SETUPS: 30
- NEAREST EVENT: NKE (30 Haziran 2026 · 21 days)

#### E. Momentum Panel (LIVE)
- VIX: 18.92 (canlı güncelleme)
- Timestamp: Jun 28, 2026, 02:04 AM

---

### 2.2 `/earnings` — Earnings Workspace (Rolling 2-Month Strategy)

**6 Tab Yapısı:** Overview | Calendar | Strategies | CPR & Greeks | Portfolio | Greeks

#### A. Overview Tab

**Makro Dashboard Kartları:**
| Sembol | Değer | Yorum |
|--------|-------|-------|
| VIX | 18.63 | Low vol, earnings ramp ahead |
| S&P 500 | 7,358.22 | Pullback from highs, support 7,330 |
| NASDAQ | 25,476.64 | Tech correction, fear extreme |
| Russell 2000 | 2,986.63 | Small-cap outperforming YTD |
| 10Y Yield | 4.42% | Higher-for-longer, FOMC hawkish |
| DXY | 101.50 | Dollar consolidation |
| WTI | $88.50 | War premium fading, supply... |
| Bitcoin | $61,486 | — |
| Fear & Greed | 26 | Extreme Fear |

**Regime:** `neutral`  
**Pipeline Status:** `FOMC Approaching`  
- Blackout window: 2026-07-18 → 2026-07-29
- FOMC meeting: 2026-07-29
- Market pricing: 95% no-change
- Fed Chair Warsh first meeting completed
- Öneri: "Consider reducing position size and reviewing hedges against IV crush risk as FOMC approaches."

**Rolling 2-Month Header:**
- Current Month: Haziran 2026
- Next Month: Temmuz 2026
- FOMC countdown: 34 days left

#### B. Strategies Tab

**14 Hisse, Her Biri İçin Kart:**

Örnek: **NFLX**
- Sektör: COMMUNICATION SERVICES
- Fiyat: $72.43
- IV Rank: 65
- CPR: 0.72
- Strateji: Long Call
- Entry: 2026-07-14
- Exit: 2026-07-23
- Max Hold: Through 2026-07-22
- Credit: $0
- Max Risk: $280
- K.O.: High importance
- Greeks: Δ 0.28 | Θ -0.12 | V 0.18 | Γ 0.04
- Budget Friendly:
  - $200-$500: Long Call Spread → $280
  - $50-$200: Call Spread (half size) → $140
- Detay: "Buy 75 Call / Sell 85 Call, Jul-25 expiry. Ad-tier subscriber momentum + content slate. Earnings AMC Jul-22. Entry 1 week before to capture IV expansion."
- Aksiyonlar: "Ticker detail" | "Portfolio lens"

Örnek: **META**
- Sektör: COMMUNICATION SERVICES
- Fiyat: $556.33
- IV Rank: 58 | CPR: 0.85
- Strateji: Long Call
- Entry: 2026-07-15 | Exit: 2026-07-30 | Max Risk: $450
- Greeks: Δ 0.35 | Θ -0.15 | V 0.22 | Γ 0.05

#### C. Greeks Tab

**Greeks Dashboard:**
- Filtre: ALL | COMMUNICATION SERVICES | CONSUMER DISCRETIONARY | TECHNOLOGY | FINANCIALS | HEALTHCARE | ENERGY
- 14 hisse
- Tablo sütunları: TICKER | Δ DELTA | Θ THETA | V VEGA | Γ GAMMA | IV RANK

| Ticker | Sektör | Δ | Θ | V | Γ | IV Rank |
|--------|--------|-----|------|------|------|---------|
| AMD | Technology | 0.30 | -0.10 | 0.20 | 0.04 | 68 |
| AMZN | Consumer Disc. | 0.22 | 0.12 | -0.08 | -0.03 | 48 |
| BAC | Financials | 0.18 | 0.10 | -0.06 | -0.02 | 40 |
| CRM | Technology | 0.32 | -0.14 | 0.21 | 0.05 | 60 |
| GOOGL | Comm. Services | -0.02 | 0.18 | -0.12 | -0.01 | 55 |
| JPM | Financials | 0.15 | 0.08 | 0.15 | 0.01 | 42 |
| META | Comm. Services | 0.35 | -0.15 | 0.22 | 0.05 | 58 |
| MSFT | Technology | 0.25 | 0.15 | -0.10 | -0.02 | 52 |
| NFLX | Comm. Services | 0.28 | -0.12 | 0.18 | 0.04 | 65 |
| PLTR | Technology | 0.28 | -0.16 | 0.20 | 0.04 | 75 |
| SOFI | Financials | 0.35 | -0.08 | 0.12 | 0.06 | 70 |
| TSLA | Consumer Disc. | 0.02 | -0.28 | 0.45 | 0.06 | 72 |
| UNH | Healthcare | -0.30 | -0.13 | 0.19 | 0.04 | 55 |
| XOM | Energy | 0.20 | 0.11 | -0.07 | -0.02 | 38 |

**Legend:**
- Delta / Theta positive → Yeşil
- Delta / Theta negative → Kırmızı
- Vega negative (IV crush gain) → Mavi
- Gamma high (risk) → Turuncu

#### D. Calendar, CPR & Greeks, Portfolio Tab'ları
- Calendar: Earnings takvimi (detaylı analiz edilemedi — scroll gerektiriyor)
- CPR & Greeks: CPR + Greeks birleşik analizi (detaylı analiz edilemedi)
- Portfolio: Portföy takibi (detaylı analiz edilemedi)

---

## 3. GÜÇLÜ YÖNLER (What Works)

### 3.1 Rolling 2-Month Konsepti
- Current + Next month birlikte göstermek — earnings trader'ları için mükemmel. Zaman penceresi net.
- FOMC countdown (34 days left) — trader'ın risk yönetimi için kritik.

### 3.2 Makro Dashboard Entegrasyonu
- VIX, SPY, QQQ, Russell, 10Y, DXY, WTI, BTC, Fear & Greed — hepsi tek bakışta.
- Regime classification (`neutral`) — otomatik piyasa durumu yorumu.
- Pipeline Status (FOMC Approaching, Blackout window) — proaktif risk yönetimi.

### 3.3 Greeks Dashboard
- 14 hisse için Delta, Theta, Vega, Gamma, IV Rank — sektör filtresi ile.
- Color-coded legend (positive/negative/IV crush/gamma risk) — görsel hızlı okuma.
- Bu, özellikle options trader'ları için çok değerli.

### 3.4 Strategy Cards
- Her hisse için "kart" formatı — temiz, mobil-uyumlu.
- Entry/Exit/Max Hold zamanlaması — EarningsPlay formatına uygun.
- Budget Friendly seviyeleri — $50-$200, $200-$500, vb. — bütçe dostu.
- K.O. (Knock-Out / High Importance) tagging — önceliklendirme.

### 3.5 Archive Sistemi (/app)
- Markdown raporlarını tarih sırasıyla arşivleme — geçmişe dönük analiz için iyi.
- Post/Playbook/Calendar/Risk tab'ları — raporun farklı kesitlerine hızlı erişim.

### 3.6 UI/UX
- Dark theme — trader dostu, gece çalışmaya uygun.
- TR/EN dil desteği — Türkçe kullanıcılar için büyük avantaj.
- Responsive layout — kartlar ve tablolar temiz.
- Workspace Legend — ikonlar + renkler tutarlı.

---

## 4. EKSİKLİKLER VE GELİŞTİRME FIRSATLARI (What’s Missing)

### 4.1 Kritik Eksiklik: İki Sayfa Arasında Kopukluk
| Sorun | Etki |
|-------|------|
| `/app`'te okuduğun raporun stratejileri `/earnings`'te manuel olarak aktarılmalı | Çift iş, hata riski |
| `/earnings`'teki stratejiler `/app`'teki raporla senkronize değil | Tutarsızlık |
| Archive'den bir rapor seçince stratejiler otomatik yüklenmiyor | Sürtünme |
| Greeks Dashboard sadece 14 hisse — rapor 30+ hisse içeriyor | Kapsam eksikliği |

### 4.2 Canlı Takip ve P&L Yönetimi Eksik
- **Entry/Exit countdown timer** var ama canlı P&L (Profit & Loss) yok.
- Pozisyon açıldıktan sonra ne oluyor? Takip edilemiyor.
- Greeks değerleri pozisyon açıldığında anlık değişiyor — ama canlı takip yok.
- **P&L Simulator** ("eğer 5% move olursa ne kazanırım/kaybederim?") yok.

### 4.3 Portföy Analizi Zayıf
- Portfolio tab var ama detaylı aggregate Greeks, risk metrics, correlation matrix göremedim.
- Toplam portföy Delta, Theta, Vega, Gamma — bu, risk yönetimi için kritik.
- **Max Drawdown projection**, **Sharpe Ratio**, **Kelly Criterion** hesaplaması yok.

### 4.4 Backtesting ve Validation Yok
- Stratejiler geçmiş veriyle test edilemiyor.
- "Earnings Play formatı" çalışıyor mu? — historical win rate yok.
- **Backtest module** ("2024 Q1-Q4 earnings sezonlarında bu strateji %X kazandı") eksik.

### 4.5 Alert ve Notification Sistemi Pasif
- Notifications paneli var (`alt+T`) ama konfigüre edilebilir alert'ler göremedim.
- Örnek eksik alert'ler:
  - "VIX 25'i aştı — pozisyonları %50 azalt"
  - "NFLX earnings 2 gün kaldı — entry zamanı"
  - "FOMC blackout window başladı — yeni pozisyon açma"
  - "Portfolio Delta 0.80'i aştı — hedge gerekli"

### 4.6 Options Chain ve Strike Selection Interaktif Değil
- Strateji kartlarında "Buy 75 Call / Sell 85 Call" yazıyor ama:
  - Gerçek options chain (bid/ask, open interest, volume) gösterilmiyor.
  - Strike seçimi interaktif değil — kullanıcı sadece okuyor, seçemiyor.
  - **IV Skew** görselleştirmesi yok.

### 4.7 Economic Calendar Entegrasyonu Sınırlı
- FOMC countdown var ama CPI, PPI, NFP, GDP release'leri tek bir takvimde değil.
- `/earnings`'te "Calendar" tab var ama detaylı macro event calendar göremedim.

### 4.8 Midas ve Momentum Verisi Entegre Değil
- Momentum menüsü var (navigasyonda) ama earnings stratejisi ile momentum verisi entegre değil.
- VWAP, RSI, MACD gibi teknik indikatörler strateji kartlarında yok.
- Midas Atlas'tan gelen sinyaller ile earnings setup'ları çaprazlanmıyor.

### 4.9 Deploy ve Otomasyon Eksik
- `/app`'teki rapor manuel upload ediliyor.
- Günlük otomatik rapor üretimi ve deploy (gistify-deploy-sync) arayüzden tetiklenemiyor.
- Cron job yönetimi arayüzde yok.

### 4.10 Risk Ops Merkezi Yok
- **FOMC öncesi pozisyon azaltma** önerisi metin olarak var ama otomatik hesaplama ve öneri yok.
- **Correlation matrix** (hangi hisseler birbiriyle pozitif/negatif korele?) eksik.
- **Scenario analysis** ("Soft CPI + Bullish Earnings" vs "Hot CPI + Bearish Earnings") yok.
- **Dynamic hedge suggestions** (portföy Delta'sına göre SPY put önerisi) yok.

---

## 5. GELİŞMİŞ BİRLEŞİK MODÜL TASARIMI

### 5.1 Modül Adı: **GISTIFY EARNINGS COMMAND CENTER (ECC)**

**Tagline:** *"One Screen. All Earnings. Full Control."*  
**URL:** `/command-center` veya `/ecc`  
**Dil:** TR | EN  
**Tema:** Dark (mevcut temaya sadık kal)

---

### 5.2 Mimarisi: "5-Zone Layout"

```
┌─────────────────────────────────────────────────────────────┐
│ ZONE 1: GLOBAL INTELLIGENCE BAR (Sabit Üst Bar)             │
│ VIX | SPY | QQQ | IWM | FOMC ⏱ | Fear&Greed | Regime | 🔔   │
├──────────┬────────────────────────────────────────────────────┤
│ ZONE 2:  │ ZONE 3: ACTIVE COMMAND DASHBOARD               │
│ STRATEGY │                                                   │
│ NAVIGATOR│  [Tab Bar] Alpha | Deck | Matrix | Risk Ops |     │
│ (Sol     │           Deploy | Backtest                       │
│  Sidebar)│                                                   │
│          │  • Alpha View: Makro + Pipeline + Econ Calendar  │
│  Archive │  • Deck: Interaktif Strateji Kartları             │
│  List    │  • Matrix: Greeks + CPR + Sektör Aggregasyon      │
│  +       │  • Risk Ops: Portföy Risk + Scenario + Hedge    │
│  Report  │  • Deploy: Cron + Auto-Report + Sync              │
│  Tree    │  • Backtest: Historical validation               │
│          │                                                   │
├──────────┼────────────────────────────────────────────────────┤
│          │ ZONE 4: LIVE ACTION PANEL (Alt Kartlar)           │
│          │ Nearest Events | Entry Alerts | P&L Snapshot |     │
│          │ Momentum Sync | IV Skew Radar                    │
└──────────┴────────────────────────────────────────────────────┘
```

---

### 5.3 ZONE 1: Global Intelligence Bar (Sabit)

**Mevcut `/earnings` makro dashboard'undan daha zengin.**

| Kart | Veri | Alert Koşulu |
|------|------|--------------|
| VIX | Canlı + Sparkline (son 5 gün) | VIX > 25: 🔴 Flash; VIX > 35: 🚨 |
| SPY | Canlı + %Değişim + VWAP | SPY > VWAP +2σ: 🟢; <-2σ: 🔴 |
| QQQ | Canlı + %Değişim | — |
| IWM | Canlı + %Değişim | IWM outperformance vs SPY: 🟡 |
| FOMC ⏱ | Gün sayacı + Blackout window | Blackout start: 🟠; Meeting day: 🔴 |
| Fear & Greed | 0-100 gauge + extreme label | <25 veya >75: 🔔 |
| Regime | neutral / bullish / bearish | Değişim anında: 🔔 |
| 🔔 Alerts | 3 son alert | Tüm alert'lerin listesi modal'da |

**Yeni:** Canlı fiyat tick'leri (WebSocket) + Sparkline mini grafikler.

---

### 5.4 ZONE 2: Strategy Navigator (Sol Sidebar)

**`/app`'in archive yapısını al, ama etkileşimli hale getir.**

```
📁 ROLLING ARCHIVE
├── 📄 LIVE — EarningsPlay v4 (32 Hisse) [VIX 18.92]
│   ├── 📋 Post
│   ├── 📖 Playbook
│   ├── 📅 Calendar
│   └── ⚠️ Risk
├── 📄 ARCHIVE — VIX 18.6 (Jun 25)
├── 📄 ARCHIVE — ORCL/CHWY/ADBE/FDX/MU (Jun 09)
└── ➕ NEW REPORT (Auto-deploy'dan gelen)

🎯 ACTIVE DEPLOYMENTS
├── 🟢 NFLX Long Call — Entry 14 Jul (4 gün kaldı)
├── 🟡 META Long Call — Entry 15 Jul (5 gün kaldı)
└── ⚪ TSLA Iron Condor — FOMC risk, izlemede

🔔 ALERT CENTER
├── ⏰ NKE earnings 30 Haziran (2 gün)
├── 📈 VIX 18.92 → yükseliş trendi
└── 🚨 FOMC blackout 18 Temmuz'da başlıyor
```

**Her archive raporu için:**
- "Activate into Command Center" butonu → tüm hisseler Zone 3'e yüklenir
- "View Raw Markdown" butonu → mevcut Post/Playbook/Calendar/Risk tab'ları
- "Auto-Refresh" toggle → her gün 08:07'de yeni rapor otomatik yüklenir (cron)

---

### 5.5 ZONE 3: Active Command Dashboard (Ana Panel)

**6 Tab:** Alpha | Deck | Matrix | Risk Ops | Deploy | Backtest

#### Tab 1: ALPHA VIEW (Overview + Calendar + Makro)

**Üst Bölüm — Makro Dashboard:**
- Mevcut `/earnings` Overview tab'ının tamamı + Economic Calendar
- Yeni: **Economic Calendar Strip** — CPI, PPI, NFP, GDP, FOMC release'leri timeline üzerinde
- Yeni: **Earnings Density Heatmap** — haftalık earnings sayısı (yoğun haftalar kırmızı)

**Orta Bölüm — Pipeline Status:**
- FOMC Approaching + Blackout window + Countdown
- Yeni: **CPI/PPI Pipeline** — CPI release'e kaç gün kaldı, soft/hot scenario probabilities
- Yeni: **Earnings Peak Warning** — "Bu hafta 15+ earnings — pozisyon %50 azalt"

**Alt Bölüm — Regime Intelligence:**
- Mevcut Regime + yorum
- Yeni: **Sector Rotation Signal** — hangi sektörler outperforming
- Yeni: **Midas Sync Widget** — Midas Atlas'tan gelen momentum sinyalleri (VWAP, RSI, MACD)

#### Tab 2: DECK (Strategies + Interaktif)

**Mevcut `/earnings` Strategies tab'ının evrimi.**

**Her Kart Artık Interaktif:**

```
┌─────────────────────────────────────────┐
|  NFLX    COMMUNICATION SERVICES    🟢   |
|  $72.43  IV Rank 65  CPR 0.72           |
|  ─────────────────────────────────────  |
|  [Long Call]  [Dropdown ▼]              |
|  Entry: Jul 14 (4 days)  ⏱              |
|  Exit: Jul 23  |  Max Hold: Jul 22      |
|  Max Risk: $280  |  K.O.: ⭐ High        |
|  ─────────────────────────────────────  |
|  📊 GREEKS  Δ 0.28  Θ -0.12  V 0.18 Γ 0.04  |
|  ─────────────────────────────────────  |
|  💰 BUDGET: [$50-200] [$200-500] [$500+]  |
|  ─────────────────────────────────────  |
|  [📈 Options Chain]  [🎯 P&L Sim]  [➕ Add to Portfolio]  |
|  Buy 75 Call / Sell 85 Call, Jul-25     |
|  Ad-tier subscriber momentum...         |
└─────────────────────────────────────────┘
```

**Yeni Interaktif Özellikler:**
1. **Strateji Dropdown:** Long Call → Long Call Spread → Iron Condor → Butterfly — tek tıkla değiştir.
2. **Options Chain Butonu:** Tıklayınca gerçek options chain açılır (strike, bid/ask, IV, OI, volume).
3. **P&L Simulator:** Slider ile "%5 up / %5 down / %10 up" senaryoları — kar/zarar anında hesaplanır.
4. **Add to Portfolio:** Tıklayınca portföye eklenir, Zone 3-Matrix ve Zone 4 otomatik güncellenir.
5. **Entry Countdown:** Gerçek zamanlı gün/saat sayacı ("4 days 12 hours left").
6. **Status Badge:** 🟡 Watch (izlemede) | 🟢 Ready (entry zamanı) | 🔴 Hold (bekle) | ⚪ Closed (kapandı)

**Yeni Kart Görünümleri:**
- **Grid View:** Mevcut kartlar (default)
- **Timeline View:** Tüm entry/exit'ler timeline üzerinde (Gantt chart tarzı)
- **Kanban View:** Watch → Ready → Active → Closed sütunları

#### Tab 3: MATRIX (Greeks + CPR + Aggregation)

**Mevcut `/earnings` Greeks tab'ının evrimi.**

**Tablo (Güncellenmiş):**
| Ticker | Δ | Θ | V | Γ | IV Rank | CPR | Sektör | Status | P&L |
|--------|---|---|---|---|---------|-----|--------|--------|-----|
| NFLX | 0.28 | -0.12 | 0.18 | 0.04 | 65 | 0.72 | Comm | 🟢 Ready | — |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

**Yeni Özellikler:**
1. **Aggregate Greeks Panel (Tablo Üstü):**
   ```
   PORTFOLIO GREEKS TOTAL
   Δ: 2.45 | Θ: -1.12 | V: 1.85 | Γ: 0.68
   Risk: MEDIUM | Exposure: NET LONG | Hedge Needed: NO
   ```
2. **Sector Aggregation:** Tek tıkla sektör bazlı toplam Greeks (Technology sektörünün toplam Delta'sı kaç?)
3. **CPR Heatmap:** CPR değerleri renkli heatmap (0.5-0.7 kırmızı, 0.7-1.0 sarı, 1.0-1.5 yeşil)
4. **IV Rank Sparkline:** Her hisse için son 30 gün IV Rank değişimi mini grafik
5. **Greeks Radar Chart:** Tek bir hisse seçince Delta/Theta/Vega/Gamma radar chart gösterimi
6. **Real-time Update:** Pozisyon açıldığında kart yeşil yanar, P&L sütunu dolar değeri gösterir

#### Tab 4: RISK OPS (Portföy + Senaryo + Hedge)

**Tamamen yeni tab. Mevcutta yok.**

**Panel A: Portföy Risk Snapshot**
```
Total Capital: $10,000
Deployed: $4,200 (42%)
Cash: $5,800 (58%)

Aggregate Greeks:
  Δ: 2.45 (Net Long) → SPY exposure: $490
  Θ: -1.12 (Time decay) → Daily cost: $112
  V: 1.85 (IV exposure) → VIX +1 = +$185
  Γ: 0.68 (Acceleration risk) → Sharp move risk: MEDIUM

Max Risk per Ticker:
  NFLX: $280 (2.8% of capital) ✅
  META: $450 (4.5% of capital) ⚠️ (limit: 2%)
  ...

Sector Concentration:
  Technology: 35% ✅
  Communication: 25% ✅
  ...
```

**Panel B: Scenario Simulator**
- **Scenario Builder:** Kullanıcı senaryo oluşturur
  - "VIX +20% + SPY -3% + AAPL beats earnings"
  - Her senaryo için portföy P&L hesaplanır
- **Preset Scenarios:**
  - Soft CPI + Bullish Earnings → +$X
  - Hot CPI + Bearish Earnings → -$Y
  - FOMC Hawkish Surprise → -$Z
- **Monte Carlo Simulation:** 1000 run, 95% confidence interval

**Panel C: Dynamic Hedge Suggestions**
- Portföy Delta'sına göre otomatik hedge önerisi:
  - "Portfolio Δ = 2.45 → Buy 1 SPY 720 Put (Δ -0.45) for delta-neutral"
  - "Portfolio V = 1.85 → VIX calls veya straddle düşün"
  - "FOMC 7 gün kaldı → SPY collar önerisi"

**Panel D: FOMC Risk Protocol**
- Otomatik countdown + pozisyon azaltma önerisi
- "FOMC 14 gün → Max position %50"
- "FOMC 7 gün → Max position %25"
- "Blackout window → No new entries"
- Auto-hedge button (SPY puts, collar)

#### Tab 5: DEPLOY (Auto-Report + Cron + Sync)

**Mevcut `gistify-deploy-sync` skill'inin arayüz entegrasyonu.**

```
🔄 AUTO-DEPLOY PIPELINE

[Cron Status] 🟢 Running  |  [Last Run] Jun 28, 08:07  |  [Next Run] Jun 29, 08:07

Daily Schedule: 08:07 AM (Off-peak, pre-market)
Pipeline Steps:
  1. ⏳ Tarih belirle (Mevcut ay + Gelecek ay) ✅
  2. ⏳ Veri topla (VIX, SPY, 45+ hisse) ✅
  3. ⏳ 4 Agent çalıştır (Paralel) ✅
  4. ⏳ Rapor birleştir ✅
  5. ⏳ Markdown → DOCX ✅
  6. ⏳ Gistify public dizinine sync ✅
  7. ⏳ VPS'e atomic deploy (isteğe bağlı) ✅

[🚀 Manuel Trigger]  [⚙️ Edit Schedule]  [📊 Pipeline Logs]

📁 OUTPUT FILES
├── 202607_202608_Earnings_Opsiyon_Master_Stratejisi.md
├── 202607_202608_Earnings_Opsiyon_Master_Stratejisi.docx
├── takvim_202607.md
└── makro_dashboard_202607.csv

[🔄 Sync to Gistify]  [🌐 Deploy to VPS]  [📥 Download All]
```

**Yeni Özellikler:**
1. **Pipeline Status:** Her adımın durumu (success/pending/failed)
2. **Manuel Trigger:** Tek tıkla rapor üretimi başlat
3. **Edit Schedule:** Cron saatini arayüzden değiştir
4. **Pipeline Logs:** Son çalıştırmanın detaylı log'ları
5. **Sync Controls:** Gistify public dizinine + VPS'e atomik sync
6. **Download All:** Tüm çıktıları zip olarak indir

#### Tab 6: BACKTEST (Historical Validation)

**Tamamen yeni. Mevcutta yok.**

```
🧪 BACKTEST LAB

Strategy: EarningsPlay v4 (Long Call + IV Crush)
Period: Jan 2024 - Jun 2026
Universe: 45 hisse, rolling 2-month

RESULTS
├── Total Trades: 312
├── Win Rate: 62.5%
├── Avg Return: +18.3%
├── Avg Loss: -12.1%
├── Expectancy: +$47 per trade
├── Sharpe: 1.45
├── Max Drawdown: -23.7%
├── Profit Factor: 1.82
└── Kelly Criterion: 0.18 (optimal bet size: 18% of bankroll)

REGIME BREAKDOWN
├── VIX < 20: Win Rate 68%, Avg Return +22% (Best)
├── VIX 20-25: Win Rate 58%, Avg Return +14%
├── VIX > 25: Win Rate 45%, Avg Return +6% (Avoid)
└── FOMC Week: Win Rate 42%, Avg Return +3% (Avoid)

SECTOR BREAKDOWN
├── Technology: Win Rate 71%, Avg Return +24% (Best)
├── Healthcare: Win Rate 65%, Avg Return +19%
├── ...

[🔍 Run New Backtest]  [📊 Export Results]  [📈 Optimize Parameters]
```

**Yeni Özellikler:**
1. **Historical Trade Log:** Her earnings sezonu, her hisse, her strateji — tek tek listelenir
2. **Regime Analysis:** VIX seviyesine göre performans farkı
3. **Sector Analysis:** Hangi sektörlerde strateji daha iyi çalışıyor
4. **Parameter Optimization:** "Entry 3 gün önce mi 5 gün önce mi daha iyi?" — grid search
5. **Monte Carlo:** 1000 simülasyon, confidence intervals
6. **Walk-Forward:** Out-of-sample validation

---

### 5.6 ZONE 4: Live Action Panel (Alt Bar)

**Sabit alt bar — her tab'da görünür.**

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ⏰ NEAREST EVENTS          🔔 ALERTS              📊 MOMENTUM SYNC    │
│ NKE  30 Haz  (2g) 🟢       VIX ↑ 18.92           Midas: 5 sinyal     │
│ WDFC 30 Haz  (2g) 🟡       FOMC 31 gün kaldı      3 BUY, 2 SELL       │
│ ...                        Entry: NFLX (4g)       [Sync Now]          │
│ [View Calendar]            [View All Alerts]      [View Dashboard]    │
└─────────────────────────────────────────────────────────────────────────┘
```

**Yeni Özellikler:**
1. **Nearest Events:** Earnings'e en yakın 5 event — countdown + status badge
2. **Alert Ticker:** Son 3 alert kayan yazı (marquee) — tıklayınca Alert Center
3. **Momentum Sync:** Midas Atlas'tan son sinyaller — "Sync Now" butonu ile Midas pipeline çalıştırma
4. **Quick Actions:** Her hisse için "Entry Alert Set", "Hedge Check", "Close Position" hızlı aksiyonları

---

## 6. TEKNİK IMPLEMENTASYON REHBERİ

### 6.1 Teknoloji Stack Önerisi

| Katman | Teknoloji | Mevcut Gistify Uyumlu mu? |
|--------|-----------|---------------------------|
| **Frontend** | React + TypeScript + Tailwind CSS | ✅ Mevcut stack ile uyumlu |
| **State Management** | Zustand veya Redux Toolkit | ✅ |
| **Real-time Data** | WebSocket ( Finnhub / Polygon ) | ⚠️ Yeni entegrasyon gerekli |
| **Charts** | Recharts + D3.js | ✅ |
| **Tables** | TanStack Table (React Table) | ✅ |
| **Backend** | Next.js API Routes / Server Actions | ✅ |
| **Database** | PostgreSQL + Redis (cache) | ⚠️ Mevcut DB'ye ekleme |
| **Cron** | node-cron / Vercel Cron | ✅ gistify-deploy-sync ile uyumlu |
| **File Sync** | SCP + GitHub Actions | ✅ |

### 6.2 Bileşen Hiyerarşisi (React)

```
EarningsCommandCenter (page)
├── GlobalIntelligenceBar (sticky)
│   ├── VIXCard (live + sparkline)
│   ├── IndexCard (SPY, QQQ, IWM)
│   ├── FOMCCountdown (progress bar)
│   ├── FearGreedGauge (0-100)
│   ├── RegimeBadge
│   └── AlertTicker
├── StrategyNavigator (sidebar)
│   ├── ArchiveTree (collapsible)
│   ├── ActiveDeploymentList
│   └── AlertCenter
├── CommandDashboard (main)
│   ├── TabBar (Alpha|Deck|Matrix|RiskOps|Deploy|Backtest)
│   ├── AlphaViewTab
│   │   ├── MacroDashboard
│   │   ├── EconCalendarStrip
│   │   ├── PipelineStatus
│   │   └── MidasSyncWidget
│   ├── DeckTab
│   │   ├── StrategyCardGrid
│   │   ├── StrategyCard (reusable)
│   │   ├── OptionsChainModal
│   │   ├── PnLSimulatorModal
│   │   └── KanbanView (optional)
│   ├── MatrixTab
│   │   ├── AggregateGreeksPanel
│   │   ├── GreeksTable (sortable, filterable)
│   │   ├── SectorAggregation
│   │   ├── CPRHeatmap
│   │   └── GreeksRadarChart
│   ├── RiskOpsTab
│   │   ├── PortfolioRiskSnapshot
│   │   ├── ScenarioSimulator
│   │   ├── HedgeSuggestions
│   │   └── FOMCProtocol
│   ├── DeployTab
│   │   ├── PipelineStatus
│   │   ├── CronControl
│   │   ├── OutputFiles
│   │   └── SyncButtons
│   └── BacktestTab
│       ├── BacktestConfig
│       ├── ResultsDashboard
│       ├── RegimeBreakdown
│       └── ParameterOptimizer
└── LiveActionPanel (bottom bar)
    ├── NearestEvents
    ├── AlertMarquee
    └── MomentumSync
```

### 6.3 Veri Akış Şeması

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  YAHOO FINANCE  │────▶│  GISTIFY API     │────▶│  COMMAND CENTER │
│  (VIX, SPY, ...)│     │  (Cache + Transform)│  │  (UI render)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                              │
                              ▼
┌─────────────────┐     ┌──────────────────┐
│  MIDAS ATLAS    │────▶│  KIMI AGENT      │
│  (Momentum)     │     │  (Auto-Report)     │
└─────────────────┘     └──────────────────┘
                              │
                              ▼
                        ┌──────────────────┐
                        │  CRON JOB        │
                        │  (08:07 daily)   │
                        └──────────────────┘
                              │
                              ▼
                        ┌──────────────────┐     ┌─────────────────┐
                        │  OUTPUT FILES    │────▶│  GISTIFY PUBLIC │
                        │  (.md + .docx)   │     │  + VPS SYNC     │
                        └──────────────────┘     └─────────────────┘
```

### 6.4 API Endpoints (Gerekli)

```
GET  /api/v1/market/snapshot          → VIX, SPY, QQQ, IWM, F&G
GET  /api/v1/market/sparkline/:symbol  → Son 5-30 gün fiyat
GET  /api/v1/earnings/calendar         → Rolling 2-month earnings
GET  /api/v1/greeks/:ticker            → Delta, Theta, Vega, Gamma, IV Rank
GET  /api/v1/portfolio/aggregate       → Toplam Greeks, risk metrics
POST /api/v1/portfolio/simulate        → Scenario P&L simülasyonu
GET  /api/v1/backtest/results          → Historical backtest sonuçları
POST /api/v1/deploy/trigger            → Manuel rapor üretimi trigger
GET  /api/v1/deploy/status             → Cron + pipeline durumu
GET  /api/v1/midas/sync                → Midas sinyallerini çek
GET  /api/v1/alerts                    → Aktif alert'ler
POST /api/v1/alerts/:id/ack            → Alert acknowledge
```

### 6.5 Cron Job Entegrasyonu (gistify-deploy-sync)

**Mevcut `gistify-deploy-sync` skill'i doğrudan entegre edilecek.**

```javascript
// DeployTab bileşeni içinde
const triggerDeploy = async () => {
  const res = await fetch('/api/v1/deploy/trigger', {
    method: 'POST',
    body: JSON.stringify({ 
      type: 'daily_earnings_report',
      currentMonth: '2026-07',
      nextMonth: '2026-08'
    })
  });
  // Pipeline status polling başlat
};
```

**Cron Job UI Kontrolü:**
- `Cron` tool ile oluşturulan job'un durumu API üzerinden çekilecek
- Kullanıcı arayüzden: Enable/Disable, Schedule değiştirme, Manuel trigger

---

## 7. UI/UX TASARIM DETAYLARI

### 7.1 Renk Paleti (Mevcut Temaya Sadık)

| Anlam | Renk | Hex | Kullanım |
|-------|------|-----|----------|
| Bullish | Yeşil | `#10B981` | ▲, positive Greeks, win rate |
| Bearish | Kırmızı | `#EF4444` | ▼, negative Greeks, loss |
| Neutral | Sarı | `#F59E0B` | •, balanced, caution |
| IV Crush | Mavi | `#3B82F6` | Vega negative, straddle gain |
| Gamma Risk | Turuncu | `#F97316` | Gamma high, acceleration |
| Primary | Cyan | `#06B6D4` | Butonlar, aktif tab, link |
| Background | Koyu Mavi | `#0F172A` | Ana arka plan |
| Card | Koyu | `#1E293B` | Kart arka planı |
| Border | Gri | `#334155` | Kart border |

### 7.2 Tipografi

| Element | Font | Boyut | Ağırlık |
|---------|------|-------|---------|
| Modül Başlık | Inter | 28px | 700 |
| Tab Başlık | Inter | 14px | 600 |
| Kart Başlık | Inter | 18px | 600 |
| Metrik Değer | Inter | 24px | 700 (tabular nums) |
| Metrik Label | Inter | 11px | 500 |
| Body | Inter | 14px | 400 |
| Monospace | JetBrains Mono | 13px | 400 | Fiyat, Greeks, tarih |

### 7.3 Responsive Davranış

| Ekran | Layout |
|-------|--------|
| Desktop (1440px+) | 5-Zone full layout |
| Laptop (1024-1440px) | Zone 2 collapsible sidebar, Zone 3 expanded |
| Tablet (768-1024px) | Zone 2 drawer (hamburger), Zone 4 bottom sheet |
| Mobile (<768px) | Single column, Zone 1 compressed, Zone 2 modal, Zone 4 scrollable |

### 7.4 Animasyonlar

- **Kart hover:** Subtle scale (1.02) + shadow elevation
- **Greeks update:** Flash animation (yeşil/kırmızı) when value changes
- **Countdown:** Pulse animation on last 24 hours
- **Alert:** Slide-in from top + sound (optional)
- **Tab switch:** Fade transition (200ms)
- **Loading:** Skeleton screens, not spinners

---

## 8. ENTegrasyonLAR

### 8.1 Midas Pipeline Entegrasyonu (midas-pipeline-sync)

```
[MIDAS ATLAS] ──WebBridge──▶ [Midas Sync Widget] ──▶ [Command Center]
                                    │
                                    ▼
                            [Midas Signals JSON]
                            ├── Ticker
                            ├── Signal (BUY/SELL/HOLD)
                            ├── Confidence
                            ├── RSI, MACD, VWAP
                            └── Timeframe
```

**Kullanım:**
- Midas sinyali "BUY" olan hisse → Earnings stratejisinde "🟢 Momentum Confirm" badge
- Midas sinyali "SELL" olan hisse → "🔴 Momentum Conflict" warning
- "Sync Now" butonu → Midas pipeline çalıştır → sinyaller güncellenir

### 8.2 Gistify Deploy Sync Entegrasyonu (gistify-deploy-sync)

```
[Cron Job: 08:07 daily] ──▶ [Kimi Agent] ──▶ [Markdown Report]
                                                  │
                                                  ▼
[Deploy Tab] ◀── [API] ── [DOCX Convert] ── [Gistify Public]
     │                                              │
     ▼                                              ▼
[Pipeline Status]                            [VPS Atomic Sync]
```

### 8.3 WebBridge Entegrasyonu (kimi-webbridge)

**Kimi Agent → Command Center iletişimi:**
- Kimi Agent raporu ürettiğinde → Command Center otomatik refresh
- Kimi Agent alert gönderdiğinde → Command Center Alert Ticker'da görünür
- Kimi Agent FOMC pipeline update ettiğinde → Global Intelligence Bar güncellenir

---

## 9. ÖNERİLEN YOL HARİTASI (Roadmap)

### Faz 1: MVP (2-3 Hafta)
- [ ] Zone 1 + Zone 2 + Zone 3 (Alpha + Deck + Matrix) — mevcut `/app` + `/earnings` birleşimi
- [ ] Archive → Command Center aktifleştirme
- [ ] Basic Deploy Tab (manuel trigger + status)
- [ ] Live Action Panel (Nearest Events + Alerts)

### Faz 2: Risk + Backtest (3-4 Hafta)
- [ ] Risk Ops Tab (Portfolio Greeks + FOMC Protocol)
- [ ] Scenario Simulator
- [ ] Backtest Lab (basit historical validation)
- [ ] Alert Center (konfigüre edilebilir alert'ler)

### Faz 3: Interaktif + Auto (4-6 Hafta)
- [ ] Options Chain Modal
- [ ] P&L Simulator
- [ ] Midas Sync Widget
- [ ] Auto-deploy cron arayüz kontrolü
- [ ] Advanced Backtest (parameter optimization, Monte Carlo)

### Faz 4: Polish + Mobile (2-3 Hafta)
- [ ] Responsive mobile layout
- [ ] Animasyonlar + micro-interactions
- [ ] Performance optimization (virtualization, lazy loading)
- [ ] TR/EN full localization
- [ ] User onboarding tour

**Toplam Tahmini Süre:** 11-16 hafta (2.5-4 ay) — 1 senior frontend + 1 backend developer

---

## 10. BAŞARI METRİKLERİ (KPI'lar)

| Metrik | Hedef | Nasıl Ölçülür |
|--------|-------|---------------|
| **Time to Action** | < 30 sn | Rapor seç → Strateji kartı görüntüleme süresi |
| **Decision Confidence** | +40% | Kullanıcı anket: "Bu setup'ı trade eder miydin?" (öncesi/sonrası) |
| **Earnings Miss Rate** | < 15% | Backtest: Yanlış yönlü strateji oranı |
| **Portfolio Risk Awareness** | +60% | Risk Ops tab kullanım sıklığı |
| **Auto-Deploy Adoption** | > 80% | Günlük cron raporunun manuel vs otomatik üretim oranı |
| **Midas Cross-Usage** | > 50% | Earnings stratejisi + Midas sinyali birlikte kullanım oranı |

---

## 11. SONUÇ

Gistify platformu, earnings opsiyon stratejisi alanında **benzersiz bir konumda**. Mevcut `/app` (archive/reader) ve `/earnings` (live strategy/Greeks) sayfaları her biri kendi içinde güçlü, ama **birbirinden kopuk**.

**Earnings Command Center** bu kopukluğu ortadan kaldırarak:
1. **Rapor → Strateji → Greeks → Risk → Deploy** zincirini tek ekranda birleştirir.
2. **Gerçek zamanlı veri** (VIX, fiyatlar, countdown'lar) ile sürekli güncel kalır.
3. **Interaktif strateji kartları** ile kullanıcı sadece okumakla kalmaz, aksiyon alır.
4. **Risk Ops** ile portföy yönetimi bilimselleşir.
5. **Backtest Lab** ile stratejiler geçmişle doğrulanır.
6. **Auto-Deploy** ile günlük rapor üretimi ve dağıtımı tamamen otomatize edilir.
7. **Midas Sync** ile momentum ve earnings stratejileri çaprazlanır.

Bu modül, Gistify'ı bir "rapor arşivi"nden **"gerçek zamanlı earnings opsiyon command center"**a dönüştürür.

---

*Rapor hazırlayan: Gistify Earning Strategy Uzmanı*  
*WebBridge analiz tarihi: 28 Haziran 2026*  
*Analiz edilen URL'ler: https://gistify.pro/app, https://gistify.pro/earnings?tab=greeks*
