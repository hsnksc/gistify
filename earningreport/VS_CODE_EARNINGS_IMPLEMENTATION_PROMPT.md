# Gistify Earnings Strategy — VS Code Implementation Prompt
## Frontend / App Integration Guide
### Version: v2.1 | Rolling 2-Month Earnings Analysis

---

## 🎯 Amaç

Gistify web uygulamasına, AI agent'ın her gün otomatik olarak ürettiği **rolling 2-aylık earnings opsiyon stratejisi raporunu** entegre etmek. Kullanıcı, uygulama içerisinden anlık earnings takvimini, opsiyon stratejilerini, Greeks analizini ve bütçe dostu önerileri görüntüleyebilecek.

---

## 📁 AI Agent Çıktısı (Input Data)

Her gün 08:07'de agent şu dosyaları üretir:

```
C:\Users\hasan\OneDrive\Desktop\gistify\earningreport\
├── YYYYMM_YYYYMM_Earnings_Opsiyon_Master_Stratejisi.md      # Ana rapor (Markdown)
├── YYYYMM_YYYYMM_Earnings_Opsiyon_Master_Stratejisi.docx    # Word belgesi
├── takvim_YYYYMM.md                                         # Günlük detaylı takvim
├── makro_dashboard_YYYYMM.csv                               # Makro veri snapshot
└── Kimi_Agent_ Option Strategy\                             # Skill ve geçmiş raporlar
    ├── skill\SKILL.md
    └── temmuz2026\
        ├── research\                        # Araştırma dosyaları
        └── strategies\                      # Bölüm dosyaları
```

### Örnek dosya adları (Rolling mantığı):
- Haziran'da: `202607_202608_Earnings_Opsiyon_Master_Stratejisi.md` (Temmuz + Ağustos)
- Temmuz'da: `202608_202609_Earnings_Opsiyon_Master_Stratejisi.md` (Ağustos + Eylül)
- Ağustos'ta: `202609_202610_Earnings_Opsiyon_Master_Stratejisi.md` (Eylül + Ekim)

---

## 🏗️ Frontend Entegrasyon Planı

### 1. Yeni Route: `/earnings`

```tsx
// App.tsx veya router config'e ekle
<Route path="/earnings" element={<EarningsPage />} />
<Route path="/earnings/:ticker" element={<EarningsDetailPage />} />
<Route path="/earnings/calendar" element={<EarningsCalendarPage />} />
<Route path="/earnings/strategies" element={<EarningsStrategiesPage />} />
```

### 2. Ana Sayfa Yapısı (`/earnings`)

```tsx
interface EarningsPageProps {
  // Agent tarafından üretilen rapor verisi
  reportData: EarningsReportData;
}

// Sayfa bölümleri (top-to-bottom):
// 1. Hero Section: Mevcut Ay + Gelecek Ay başlıkları, VIX, S&P 500, Nasdaq snapshot
// 2. Executive Summary: En önemli 5 strateji, 3 kritik tarih, piyava havası
// 3. Earnings Calendar: Takvim görünümü (günlük/haftalık/aylık toggle)
// 4. Sector Breakdown: Sektör bazlı earnings yoğunluğu (chart)
// 5. Top Strategies: En iyi 10 earnings play (kartlar)
// 6. Macro Dashboard: Makro veriler (mini kartlar)
// 7. FOMC Warning: Eğer FOMC yakınsa banner uyarısı
```

### 3. Bileşenler (Components)

#### A. `EarningsCalendar` — Takvim Bileşeni
```tsx
interface EarningsCalendarProps {
  events: EarningsEvent[];
  viewMode: 'day' | 'week' | 'month';
  currentMonth: string;  // "Temmuz 2026"
  nextMonth: string;     // "Ağustos 2026"
}

interface EarningsEvent {
  ticker: string;
  company: string;
  sector: string;
  date: string;          // ISO 8601
  time: 'BMO' | 'AMC';
  marketCap: number;     // Billions
  importance: 1 | 2 | 3 | 4 | 5;  // ⭐
  expectedMove: number;  // %
  ivRank: number;        // %
  cpr: number;           // Call/Put Ratio
  strategy?: string;     // Önerilen strateji
}

// Görünüm: FullCalendar benzeri grid veya custom timeline
// Renk kodu: 
//   - Yeşil: BMO (Before Market Open)
//   - Mor: AMC (After Market Close)
//   - Koyu: ⭐⭐⭐⭐⭐ (5 yıldız)
//   - Açık: ⭐ (1 yıldız)
// Hover: Şirket detayları, strateji önerisi
```

#### B. `StrategyCard` — Strateji Kartı
```tsx
interface StrategyCardProps {
  ticker: string;
  company: string;
  price: number;
  ivRank: number;
  cpr: number;
  strategy: {
    type: 'Iron Condor' | 'Bull Call Spread' | 'Bear Put Spread' | 'Long Straddle' | 'Butterfly';
    entry: string;       // "Earnings'ten 2-5 gün önce"
    exit: string;        // "Earnings sonrası 1-2 gün"
    maxHold: string;     // "2 gün"
    profitTarget: string; // "%50-75 kredi"
    credit: number;      // Tahmini kredi
    maxRisk: number;
    breakeven: [number, number]; // [lower, upper]
    koProbability: number; // %
    positionSize: string;  // "Hesabın %1-2'si"
  };
  greeks: {
    delta: number;
    theta: number;
    vega: number;
    gamma: number;
  };
  budgetOptions: BudgetOption[];
}

interface BudgetOption {
  budget: string;        // "$10-$50"
  strategy: string;      // "Long Call"
  cost: string;
  maxProfit: string;
}

// Kart görünümü:
// ┌─────────────────────────────────────┐
// │ 🟢 AMD  $488.45  IV Rank: >90%    │
// │ CPR: 0.71 (Ayı-egilimli)          │
// ├─────────────────────────────────────┤
// │ 📊 Ana Strateji: Iron Condor      │
// │    Kredi: $8.50 | Max Risk: $91.50│
// │    K.O. Olasılığı: ~72%           │
// │    Entry: 25-27 Tem | Exit: 31 Tem │
// ├─────────────────────────────────────┤
// │ Δ: -0.03 | Θ: +0.15 | V: -0.20    │
// │ Γ: 0.008 (Düşük gamma riski)       │
// ├─────────────────────────────────────┤
// │ 💰 Bütçe Dostu:                   │
// │    $10-50: Long Call (~$42)       │
// │    $50-200: Bull Call (~$95)      │
// └─────────────────────────────────────┘
```

#### C. `MacroDashboard` — Makro Dashboard
```tsx
interface MacroDashboardProps {
  vix: number;
  sp500: number;
  nasdaq: number;
  russell2000: number;
  tenYearYield: number;
  dxy: number;
  wti: number;
  bitcoin: number;
  fearGreed: number;
  regime: 'Bullish' | 'Neutral' | 'Bearish' | 'Fragile Bull';
}

// Görünüm: Mini kartlar grid (2x4 veya 4x2)
// Her kart: Değer, önceki gün/kapanış, değişim %, trend oku (↑↓)
// Renk: Yeşil (yukarı), Kırmızı (aşağı), Gri (yatay)
// VIX kartı: 15-20 yeşil, 20-25 sarı, 25+ kırmızı
```

#### D. `FOMCWarningBanner` — FOMC Uyarı Banner'ı
```tsx
interface FOMCWarningBannerProps {
  fomcDate: string;      // "28-29 Temmuz 2026"
  daysUntil: number;     // 33
  blackoutStart: string; // "18 Temmuz"
  status: 'distant' | 'approaching' | 'imminent' | 'blackout';
}

// Görünüm:
// status = 'distant' (30+ gün): Gizli veya soluk
// status = 'approaching' (15-30 gün): Sarı banner
// status = 'imminent' (7-15 gün): Turuncu banner
// status = 'blackout' (0-18 gün): Kırmızı banner, pozisyon azaltma uyarısı
```

#### E. `CPRSortableTable` — CPR Sıralama Tablosu
```tsx
interface CPRTableProps {
  stocks: CPRStock[];
  sortBy: 'hacimCPR' | 'oiCPR' | 'ivRank' | 'earningsDate';
  filterBy: 'all' | 'technology' | 'financial' | 'healthcare' | 'energy' | 'other';
}

interface CPRStock {
  ticker: string;
  company: string;
  price: number;
  hacimCPR: number;
  oiCPR: number;
  sentiment: 'Güçlü Boğa' | 'Boğa' | 'Nötr' | 'Ayı' | 'Güçlü Ayı';
  sector: string;
  earningsDate: string;
  ivRank: number;
}

// Sortable columns, filterable by sector
// Color-coded CPR: >2.0 yeşil, 1.0-2.0 açık yeşil, 0.8-1.0 gri, 0.6-0.8 sarı, <0.6 kırmızı
```

#### F. `BudgetStrategyMatrix` — Bütçe Strateji Matrisi
```tsx
interface BudgetMatrixProps {
  strategies: BudgetStrategy[];
}

// Görünüm: 4xN grid (4 bütçe seviyesi x her seviye için 5-10 hisse)
// $10-50 | $50-200 | $200-500 | $500-1000
// Her hücre: kartlar listesi
```

#### G. `PortfolioBuilder` — Portföy Oluşturucu
```tsx
interface PortfolioBuilderProps {
  budget: 1000 | 5000 | 10000 | 25000 | 50000;
  recommendations: PortfolioRecommendation[];
}

interface PortfolioRecommendation {
  ticker: string;
  strategy: string;
  allocation: string;  // "$200 (%20)"
  expectedReturn: string;
  risk: 'low' | 'medium' | 'high';
}

// Görünüm: Pasta grafik (sektör dağılımı) + liste
// Bütçe seçici: 5 buton ($1K, $5K, $10K, $25K, $50K)
```

#### H. `GreeksDashboard` — Greeks Dashboard
```tsx
interface GreeksDashboardProps {
  stocks: GreeksStock[];
}

interface GreeksStock {
  ticker: string;
  delta: number;
  theta: number;
  vega: number;
  gamma: number;
  ivRank: number;
}

// Görünüm: Heatmap (tablo)
// Delta: Yeşil (pozitif), Kırmızı (negatif)
// Theta: Yeşil (pozitif)
// Vega: Kırmızı (negatif = IV crush kazancı)
// Gamma: Sarı (yüksek = risk)
```

### 4. Data Fetching (Backend / API)

#### A. Rapor Dosyasını Oku
```typescript
// src/api/earnings.ts

const EARNINGREPORT_DIR = 'C:/Users/hasan/OneDrive/Desktop/gistify/earningreport';

// En son raporu bul (tarihe göre sırala)
async function getLatestReport(): Promise<EarningsReportData> {
  // 1. Dizindeki .md dosyalarını listele
  // 2. En yenisini bul (YYYYMM_YYYYMM_... formatından parse et)
  // 3. Markdown'ı parse et (sections, tables, data)
  // 4. JSON objesine dönüştür
}

// VEYA agent tarafından üretilen JSON dosyasını oku
// (agent'ın ayrıca JSON output üretmesi önerilir)
```

#### B. Önerilen API Endpoint'leri (Backend)
```typescript
// /api/earnings/latest          -> Son rapor metadata
// /api/earnings/calendar        -> Earnings takvimi (array)
// /api/earnings/strategies      -> Stratejiler (array)
// /api/earnings/macro           -> Makro veriler
// /api/earnings/stock/:ticker   -> Hisse detaylı analiz
// /api/earnings/portfolio       -> Portföy önerileri
// /api/earnings/greeks          -> Greeks dashboard
```

#### C. JSON Output Şeması (Agent'tan beklenen)
Agent'ın ayrıca `YYYYMM_YYYYMM_earnings_data.json` üretmesi önerilir:

```json
{
  "generatedAt": "2026-06-25T08:07:00+03:00",
  "currentMonth": "Temmuz 2026",
  "nextMonth": "Ağustos 2026",
  "macro": {
    "vix": 19.44,
    "sp500": 7394.30,
    "nasdaq": 25809.66,
    "regime": "Fragile Bull"
  },
  "calendar": [
    {
      "ticker": "JPM",
      "date": "2026-07-14",
      "time": "BMO",
      "sector": "Financial",
      "importance": 5
    }
  ],
  "strategies": [
    {
      "ticker": "AMD",
      "price": 488.45,
      "ivRank": 90,
      "cpr": 0.71,
      "strategy": "Iron Condor",
      "entry": "2026-07-25",
      "exit": "2026-07-31",
      "maxHold": "2 gün",
      "credit": 8.50,
      "greeks": {"delta": -0.03, "theta": 0.15, "vega": -0.20, "gamma": 0.008}
    }
  ],
  "fomc": {
    "date": "2026-07-28",
    "daysUntil": 33,
    "status": "approaching"
  }
}
```

---

## 🎨 UI/UX Tasarım Rehberi

### Renk Paleti (Gistify Earnings)
```css
:root {
  --earnings-primary: #1F4E79;      /* Koyu mavi (başlıklar) */
  --earnings-accent: #2E8B57;       /* Yeşil (kazanç, IV crush) */
  --earnings-warning: #D97706;      /* Turuncu (FOMC uyarı) */
  --earnings-danger: #DC2626;       /* Kırmızı (risk, VIX yüksek) */
  --earnings-neutral: #6B7280;      /* Gri (nötr CPR) */
  --earnings-bg: #F8FAFC;           /* Arka plan */
  --earnings-card: #FFFFFF;         /* Kart arka planı */
  --earnings-border: #E2E8F0;     /* Border */
}
```

### Typography
- Başlıklar: Inter, bold, 24px/32px/48px
- Body: Inter, regular, 14px/16px
- Tablolar: Inter, medium, 13px
- Monospace (fiyatlar): JetBrains Mono, 14px

### Responsive Breakpoints
```
mobile:  < 640px
tablet:  640px - 1024px
desktop: > 1024px
```

### Animasyonlar
- Kart hover: `translateY(-2px)`, `box-shadow` artışı, 200ms ease
- Tablo sıralama: 300ms fade-in
- FOMC banner: pulse animation (yaklaştıkça hızlanır)
- Sayfa yükleme: staggered fade-in (her bölüm 100ms gecikme)

---

## 📱 Sayfa Düzeni (Wireframe)

```
┌─────────────────────────────────────────────┐
│  🏠 Gistify  >  Earnings Strategy           │
├─────────────────────────────────────────────┤
│  [FOMC Uyarı Banner] (varsa)               │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐   │
│  │  Temmuz 2026 + Ağustos 2026       │   │
│  │  VIX: 19.44 | S&P: 7,394 | NDX: 25,810 │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  Executive Summary (5 strateji, 3 tarih)   │
├─────────────────────────────────────────────┤
│  [Earnings Calendar]  [Hafta/Gün/Ay toggle] │
│  ┌────┬────┬────┬────┬────┬────┬────┐    │
│  │ Pzt│ Sa │ Çar│ Per│ Cum│ Cmt│ Paz│    │
│  │    │    │ JPM│ NFL│    │    │    │    │
│  │    │    │ BAC│    │    │    │    │    │
│  └────┴────┴────┴────┴────┴────┴────┘    │
├─────────────────────────────────────────────┤
│  Sektör Dağılımı (Donut Chart)             │
├─────────────────────────────────────────────┤
│  Top 10 Earnings Play Stratejileri          │
│  ┌────────┐ ┌────────┐ ┌────────┐ ...    │
│  │ AMD    │ │ UNH    │ │ NFLX   │        │
│  │ IC $8.5│ │ BCS $10│ │ IC+BP$39│        │
│  └────────┘ └────────┘ └────────┘        │
├─────────────────────────────────────────────┤
│  [Tüm Hisseler] [Teknoloji] [Finansal] ... │
│  CPR Sıralama Tablosu (sortable)           │
├─────────────────────────────────────────────┤
│  Bütçe Dostu Stratejiler ($10-$1000)       │
├─────────────────────────────────────────────┤
│  Portföy Önerileri ($1K / $5K / $10K ...)  │
├─────────────────────────────────────────────┤
│  Greeks Dashboard (Heatmap)                 │
├─────────────────────────────────────────────┤
│  Makro Dashboard (Mini Kartlar)             │
├─────────────────────────────────────────────┤
│  Eylem Planı — Haftalık Takvim              │
├─────────────────────────────────────────────┤
│  📄 Rapor İndir (Markdown / DOCX)           │
└─────────────────────────────────────────────┘
```

---

## 🔧 Teknik Stack

| Katman | Teknoloji | Not |
|--------|-----------|-----|
| Frontend | React 18 + TypeScript | Mevcut stack ile uyumlu |
| Styling | Tailwind CSS | Mevcut config kullan |
| Charts | Recharts veya Chart.js | Sektör dağılımı, makro trend |
| Calendar | react-big-calendar veya custom | Earnings takvimi |
| Tables | TanStack Table | Sortable, filterable |
| State | React Query (TanStack Query) | API cache, refetch |
| Icons | Lucide React | Mevcut icon set |
| Markdown | react-markdown | Rapor gösterimi (opsiyonel) |

---

## 🚀 Implementasyon Adımları

### Adım 1: Temel Yapı (Route + Layout)
```bash
# Yeni dosyalar
src/
  pages/
    Earnings/
      index.tsx              # Ana sayfa (/earnings)
      Calendar.tsx         # Takvim (/earnings/calendar)
      Strategies.tsx       # Stratejiler (/earnings/strategies)
      StockDetail.tsx      # Hisse detay (/earnings/:ticker)
  components/
    earnings/
      EarningsCalendar.tsx
      StrategyCard.tsx
      MacroDashboard.tsx
      FOMCWarningBanner.tsx
      CPRTable.tsx
      BudgetMatrix.tsx
      PortfolioBuilder.tsx
      GreeksDashboard.tsx
      ActionPlan.tsx
      ReportDownload.tsx
  hooks/
    useEarningsReport.ts     # Rapor verisini çek
    useEarningsCalendar.ts   # Takvim verisini çek
  api/
    earnings.ts              # API fonksiyonları
  types/
    earnings.ts              # TypeScript interfaces
```

### Adım 2: TypeScript Interfaces
```typescript
// src/types/earnings.ts

export interface EarningsReport {
  generatedAt: string;
  currentMonth: string;
  nextMonth: string;
  macro: MacroData;
  calendar: EarningsEvent[];
  strategies: Strategy[];
  fomc?: FOMCData;
  portfolio: PortfolioRecommendation[][];
}

export interface EarningsEvent {
  ticker: string;
  company: string;
  sector: string;
  date: string;
  time: 'BMO' | 'AMC';
  marketCap: number;
  importance: 1 | 2 | 3 | 4 | 5;
  expectedMove?: number;
  ivRank?: number;
  cpr?: number;
}

export interface Strategy {
  ticker: string;
  company: string;
  price: number;
  ivRank: number;
  cpr: number;
  type: StrategyType;
  entry: string;
  exit: string;
  maxHold: string;
  profitTarget: string;
  credit: number;
  maxRisk: number;
  breakeven: [number, number];
  koProbability: number;
  positionSize: string;
  greeks: Greeks;
  budgetOptions: BudgetOption[];
}

export type StrategyType = 
  | 'Iron Condor' 
  | 'Bull Call Spread' 
  | 'Bear Put Spread' 
  | 'Long Straddle' 
  | 'Long Strangle'
  | 'Butterfly'
  | 'Calendar Spread'
  | 'Ratio Spread';

export interface Greeks {
  delta: number;
  theta: number;
  vega: number;
  gamma: number;
}

export interface BudgetOption {
  budget: string;
  strategy: string;
  cost: string;
  maxProfit: string;
}

export interface MacroData {
  vix: number;
  sp500: number;
  nasdaq: number;
  russell2000: number;
  tenYearYield: number;
  dxy: number;
  wti: string;
  bitcoin: number;
  fearGreed: number;
  regime: string;
}

export interface FOMCData {
  date: string;
  daysUntil: number;
  status: 'distant' | 'approaching' | 'imminent' | 'blackout';
  currentRate: string;
  marketExpectation: string;
}

export interface PortfolioRecommendation {
  ticker: string;
  strategy: string;
  allocation: string;
  expectedReturn: string;
  risk: 'low' | 'medium' | 'high';
}
```

### Adım 3: API Hook'ları
```typescript
// src/hooks/useEarningsReport.ts
import { useQuery } from '@tanstack/react-query';
import { getLatestReport } from '@/api/earnings';

export function useEarningsReport() {
  return useQuery({
    queryKey: ['earnings', 'latest'],
    queryFn: getLatestReport,
    staleTime: 1000 * 60 * 60, // 1 saat
    refetchInterval: 1000 * 60 * 60, // Her saat kontrol et
  });
}

// src/hooks/useEarningsCalendar.ts
export function useEarningsCalendar(month: string) {
  return useQuery({
    queryKey: ['earnings', 'calendar', month],
    queryFn: () => getCalendar(month),
    staleTime: 1000 * 60 * 60,
  });
}
```

### Adım 4: Bileşen Implementasyonu
Her bileşen için ayrı ayrı implementasyon:

1. **EarningsCalendar** — react-big-calendar veya custom grid
2. **StrategyCard** — DaisyUI card + tooltip
3. **MacroDashboard** — Grid + sparkline (mini chart)
4. **FOMCWarningBanner** — Alert component + conditional render
5. **CPRTable** — TanStack Table + sorting + filtering
6. **BudgetMatrix** — CSS Grid + card hover effects
7. **PortfolioBuilder** — Pie chart + allocation list
8. **GreeksDashboard** — Heatmap table + color coding
9. **ActionPlan** — Timeline component
10. **ReportDownload** — File download links

### Adım 5: Rapor İndirme
```tsx
// src/components/earnings/ReportDownload.tsx

export function ReportDownload() {
  return (
    <div className="flex gap-4">
      <a 
        href="/api/earnings/download?format=md" 
        className="btn btn-primary"
        download
      >
        📄 Markdown İndir
      </a>
      <a 
        href="/api/earnings/download?format=docx" 
        className="btn btn-secondary"
        download
      >
        📝 Word İndir
      </a>
    </div>
  );
}
```

---

## 📋 Backend API (Node.js / Express Örneği)

```typescript
// server/routes/earnings.ts
import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter'; // Markdown parser

const EARNINGREPORT_DIR = 'C:/Users/hasan/OneDrive/Desktop/gistify/earningreport';

router.get('/api/earnings/latest', async (req, res) => {
  try {
    // En son .md dosyasını bul
    const files = await glob('*_Earnings_Opsiyon_Master_Stratejisi.md', {
      cwd: EARNINGREPORT_DIR,
    });
    
    // Tarihe göre sırala (en yeni)
    const latestFile = files.sort().reverse()[0];
    const fullPath = path.join(EARNINGREPORT_DIR, latestFile);
    
    // Markdown'ı oku
    const content = await fs.readFile(fullPath, 'utf-8');
    
    // Parse et (sections, tables, data)
    const parsed = parseEarningsMarkdown(content);
    
    res.json({
      success: true,
      data: parsed,
      generatedAt: fs.stat(fullPath).then(s => s.mtime),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/api/earnings/download', async (req, res) => {
  const format = req.query.format as 'md' | 'docx';
  const files = await glob(`*_Earnings_Opsiyon_Master_Stratejisi.${format}`, {
    cwd: EARNINGREPORT_DIR,
  });
  const latestFile = files.sort().reverse()[0];
  const fullPath = path.join(EARNINGREPORT_DIR, latestFile);
  
  res.download(fullPath, latestFile);
});

// Agent'ın JSON output'unu oku (önerilen)
router.get('/api/earnings/data', async (req, res) => {
  const jsonFiles = await glob('*_earnings_data.json', {
    cwd: EARNINGREPORT_DIR,
  });
  const latestFile = jsonFiles.sort().reverse()[0];
  const fullPath = path.join(EARNINGREPORT_DIR, latestFile);
  const data = JSON.parse(await fs.readFile(fullPath, 'utf-8'));
  res.json({ success: true, data });
});
```

---

## 🧪 Test Planı

### Birim Testler
- `EarningsCalendar` — doğru gün sayısı, event yerleşimi
- `StrategyCard` — props doğru render, eksik data handling
- `CPRTable` — sorting, filtering, color coding
- `FOMCWarningBanner` — conditional render, status değişimi

### Entegrasyon Testleri
- API endpoint'leri — 200/404/500 durumları
- Rapor parse — farklı rapor versiyonları (v2.0, v2.1, vb.)
- File download — MD ve DOCX indirme

### E2E Testleri (Playwright)
- `/earnings` sayfası yükleniyor
- Takvim günler arasında gezinme
- Strateji kartı expand/collapse
- Portföy bütçe değiştirme
- Rapor indirme

---

## 📅 Geliştirme Takvimi (Öneri)

| Hafta | Görev | Tahmini Süre |
|-------|-------|--------------|
| 1 | Route yapısı, types, API layer, useEarningsReport hook | 8h |
| 1 | EarningsCalendar bileşeni | 6h |
| 2 | StrategyCard, MacroDashboard, FOMCWarningBanner | 8h |
| 2 | CPRTable, BudgetMatrix | 6h |
| 3 | PortfolioBuilder, GreeksDashboard, ActionPlan | 8h |
| 3 | ReportDownload, responsive, polish | 4h |
| 4 | Test, bug fix, deploy | 6h |

**Toplam: ~46 saat (1 geliştirici, 2-3 hafta)**

---

## 🔗 Gistify Mevcut Sistem ile Entegrasyon

| Mevcut Sistem | Yeni Earnings Modülü | Entegrasyon Noktası |
|---------------|---------------------|---------------------|
| `/app` (Earning Strategy) | `/earnings` | Aynı navbar, farklı route |
| `/momentum` (Momentum Scanner) | CPRTable | Momentum skorları + CPR |
| `/daily-report` | MacroDashboard | Makro veriler paylaşımı |
| `midas_signals.json` | PortfolioBuilder | Sinyal + portföy önerisi birleşimi |
| `marketflash_report.json` | EarningsCalendar | Earnings günü momentum hisseleri |
| `calendar_forecast.json` | ActionPlan | Makro takvim + earnings takvimi birleşimi |

---

## ✅ Acceptance Criteria (Kabul Kriterleri)

- [ ] `/earnings` route açılıyor ve rapor verisi yükleniyor
- [ ] Earnings takvimi günlük/haftalık/aylık görünümü destekliyor
- [ ] En az 45 hisse CPR sıralama tablosunda görünüyor
- [ ] Her hisse için en az 3 strateji gösteriliyor
- [ ] Bütçe dostu stratejiler 4 seviye ($10-$1000) ayrılmış
- [ ] Portföy önerileri 5 bütçe seviyesi ($1K-$50K) destekliyor
- [ ] Greeks Dashboard (Delta, Theta, Vega, Gamma) heatmap olarak görünüyor
- [ ] FOMC yaklaştıkça banner rengi değişiyor (sarı → turuncu → kırmızı)
- [ ] Rapor Markdown ve DOCX olarak indirilebiliyor
- [ ] Mobile responsive (640px breakpoint)
- [ ] Sayfa yükleme süresi < 3 saniye (ilk yükleme)
- [ ] Rapor verisi her gün 08:07'de otomatik güncelleniyor

---

> **NOT:** Bu prompt, AI agent'ın her gün ürettiği rolling 2-aylık earnings raporunu frontend'e entegre etmek için kapsamlı bir rehberdir. Gistify mevcut stack'i (React + TypeScript + Tailwind) kullanılarak implemente edilmelidir. Her bileşen kendi dosyasında, atomic design prensiplerine uygun olarak yazılmalıdır.
