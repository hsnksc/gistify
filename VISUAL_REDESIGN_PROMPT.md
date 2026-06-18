# Gistify Visual Redesign Prompt (Production-Ready Final Spec)

## 1. Overview & Technical Architecture

Redesign the UI/UX of **Gistify** (an earnings intelligence platform) across three main pages. This is a **purely visual and structural layout redesign** — do not change backend code, data fetching hooks, route management, or data schemas. Keep all component props backward-compatible.

### Tech Stack Standards
- **Framework:** React 19 (utilize standard render optimizations).
- **Styling:** Tailwind CSS v4 (using CSS-based configuration).
- **UI Components:** shadcn/ui primitives.
- **Charts:** Recharts (responsive, dark-mode native styling).
- **Routing:** Wouter.
- **Theme:** Strict Dark Mode (no light mode transition logic is needed).

### Data Model Protection Boundaries
**CRITICAL:** The following data structures must remain untouched. All UI changes must consume these exact types:

```typescript
// shared/weeklyReports.ts — DO NOT MODIFY
interface WeeklyReportEntry {
  ticker: string;
  name: string;
  sector: string;
  earningsDate: string;
  earningsTime: "AMC" | "BMO" | "AH" | "BH";
  momentumScore: number;
  priceChange6M: number;
  rsi14: number;
  currentIV: number;
  historicalIV: number;
  impliedMove: number;
  expectedIVCrush: number;
  ivCrushPotential: "HIGH" | "MEDIUM" | "LOW";
  callPremiumBuy: number;
  callPremiumSell: number;
  callGainFromIV: number;
  putPremiumBuy: number;
  putPremiumSell: number;
  putGainFromIV: number;
  ivCrushScore: number;
  strategyRating: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
  earningsMissRisk: number;
  gapRisk: number;
  recommendedStrategy: string;
  targetProfit: number;
  maxLoss: number;
  lastEarningsMove: number;
  historicalIVCrush: number;
  beatRate: number;
  thesis: string;
  directionalBias: "Bullish" | "Bearish" | "Neutral";
}

// client/src/scanner/types.ts — DO NOT MODIFY
interface StockResult {
  ticker: string;
  name: string;
  sector: string;
  currentPrice: number;
  prevClose: number;
  priceChangePct: number;
  openPrice: number;
  opening30mHigh: number;
  openingMomentum: number;
  volume: number;
  avgVolume20d: number;
  volumeRatio: number;
  opening30mVolume: number;
  rsi: number;
  rsi2: number;
  rsi7: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  vwap: number;
  vwapSlope: number;
  vwapDeviation: number;
  atr14d: number;
  atrMomentumScore: number;
  gapScore: number;
  orbScore: number;
  structureScore: number;
  rvolScore: number;
  rsiShortScore: number;
  catalystScore: number;
  high52w: number;
  low52w: number;
  range52wPct: number;
  marketCap: number;
  avgDollarVolume: number;
  score: number;
  signal: string;
  timestamp: string;
  targetPrice?: number;
  ivProxy?: number;
  earningsWarning?: string | null;
  confidenceScore?: number;
  confidenceBreakdown?: ConfidenceBreakdown;
  rankingScore?: number;
  rankingInfo?: RankingInfo;
  scoreExplanations?: ScoreExplanation[];
  dataQuality?: "GOOD" | "FAIR" | "POOR";
  rsiWarning?: string | null;
}
```

**UI Mapping Rules:**
- Every field rendered in the UI must correspond to a field in these interfaces.
- If a field is optional (`?`), always provide a fallback: `value ?? "—"`.
- Never invent new data fields in the UI that don't exist in the types.
- For calculated display values (e.g., formatted percentages), compute them at render time, never store them in state.

---

## 2. Directory & Component Mapping

Apply changes systematically across the following files:

| File | Change Type |
|------|-------------|
| `client/src/index.css` | Global styling, Tailwind v4 custom theme, `@utility` classes |
| `client/src/pages/Home.tsx` | Earning Strategy Workspace container |
| `client/src/components/tabs/OverviewTab.tsx` | Executive summary + metric cards |
| `client/src/components/tabs/MomentumTab.tsx` | Horizontal bar chart |
| `client/src/components/tabs/StockDetailTab.tsx` | High-density table + sparklines |
| `client/src/components/tabs/CalendarTab.tsx` | Visual calendar grid |
| `client/src/components/tabs/SectorTab.tsx` | Sector distribution grid |
| `client/src/components/tabs/RiskTab.tsx` | Risk matrix heatmap |
| `client/src/components/tabs/IVCrushTab.tsx` | IV surface visualization |
| `client/src/components/tabs/OptionDetailTab.tsx` | Strategy comparison cards |
| `client/src/pages/Scanner.tsx` | Scanner shell layout |
| `client/src/scanner/components/ScannerPage.tsx` | Results table + expansion panels |
| `client/src/pages/DailyReport.tsx` | Report list + markdown reader |

---

## 3. Global Design System (Tailwind CSS v4)

### 3.1 `@theme` Configuration

Replace the entire `client/src/index.css` theme block with:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* Background layers — Depth-based scaling */
  --color-bg-base: #0a0e1a;
  --color-bg-elevated: #111827;
  --color-bg-surface: #1a2235;
  --color-bg-overlay: #232d42;

  /* Typography color scale */
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-text-tertiary: #64748b;
  --color-text-muted: #475569;

  /* Semantic status colors (Strictly for data-driven signals) */
  --color-bull: #10b981;
  --color-bull-dim: rgba(16, 185, 129, 0.12);
  --color-bear: #ef4444;
  --color-bear-dim: rgba(239, 68, 68, 0.12);
  --color-caution: #f59e0b;
  --color-caution-dim: rgba(245, 158, 11, 0.12);
  --color-info: #3b82f6;
  --color-info-dim: rgba(59, 130, 246, 0.12);

  /* Borders */
  --color-border-subtle: rgba(148, 163, 184, 0.08);
  --color-border-medium: rgba(148, 163, 184, 0.15);
  --color-border-strong: rgba(148, 163, 184, 0.25);

  /* Accent */
  --color-accent: #6366f1;
  --color-accent-glow: rgba(99, 102, 241, 0.15);

  /* Font families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Font sizes */
  --text-xs: 11px;
  --text-sm: 13px;
  --text-base: 14px;
  --text-lg: 16px;
  --text-xl: 20px;
  --text-2xl: 24px;

  /* Spacing */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
}
```

### 3.2 `@utility` Directives (Tailwind v4)

Define custom utilities using the new `@utility` directive (replaces `@layer utilities`):

```css
@utility tabular-nums {
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

@utility text-glow-accent {
  text-shadow: 0 0 12px var(--color-accent-glow);
}

@utility terminal-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--color-border-strong) var(--color-bg-base);
}

@utility terminal-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

@utility terminal-scrollbar::-webkit-scrollbar-track {
  background: var(--color-bg-base);
}

@utility terminal-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-border-strong);
  border-radius: 3px;
}

@utility terminal-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--color-accent);
}

@utility animate-flash {
  animation: data-flash 500ms ease-out;
}

@keyframes data-flash {
  0% { background-color: rgba(99, 102, 241, 0.2); }
  100% { background-color: transparent; }
}

@utility line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

@utility line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
```

### 3.3 Base Styles

```css
@layer base {
  body {
    background-color: var(--color-bg-base);
    color: var(--color-text-primary);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Force dark mode always */
  :root {
    color-scheme: dark;
  }
}
```

---

## 4. Lucide React Icon Semantic Guide

Use icons consistently across the application. Never mix metaphors.

| Icon | Lucide Name | Usage Context |
|------|-------------|---------------|
| 📊 | `BarChart3` | Analytics, reports, data visualization |
| 📈 | `TrendingUp` | Bullish signals, positive momentum, gains |
| 📉 | `TrendingDown` | Bearish signals, negative momentum, losses |
| ⚠️ | `AlertTriangle` | Warnings, risk alerts, caution zones |
| 🛡️ | `Shield` | Risk management, portfolio protection |
| 🎯 | `Target` | Price targets, breakeven points, goals |
| ⏰ | `Clock` | Timing, DTE, market hours, schedules |
| 💰 | `DollarSign` | Pricing, premiums, P&L, position sizing |
| 🔍 | `Search` | Search, filter, scan operations |
| 📅 | `Calendar` | Earnings dates, event schedules |
| 🏭 | `Factory` | Sector analysis, industry breakdown |
| 💥 | `Zap` | IV crush, volatility spikes, quick actions |
| 🔍 | `Eye` | Detail view, expand, inspect |
| 📖 | `BookOpen` | Reports, documentation, daily briefings |
| 📰 | `Newspaper` | News, catalysts, market updates |
| 🤖 | `Bot` | AI-generated content, agent outputs |
| ✨ | `Sparkles` | AI features, generated content highlight |
| 🔄 | `RefreshCw` | Reload, rescan, update data |
| ⬇️ | `ChevronDown` | Expand, collapse, dropdown |
| ⬆️ | `ChevronUp` | Collapse, scroll up |
| ☀️ | `Sun` | Before Market Open (BMO) |
| 🌙 | `Moon` | After Market Close (AMC) |
| 📋 | `ClipboardList` | Checklists, management rules |
| 🚫 | `Ban` | Blocked, restricted, not suitable |
| ✅ | `CheckCircle2` | Confirmed, suitable, passed |
| 🔴 | `Circle` (filled red) | Overbought, danger zone |
| 🟡 | `Circle` (filled amber) | Caution, hot zone |
| 🟢 | `Circle` (filled green) | Safe, optimal zone |
| 📊 | `PieChart` | Portfolio distribution, sector allocation |
| 🏆 | `Trophy` | Top performers, best setups |
| 🔥 | `Flame` | High momentum, trending |
| ❄️ | `Snowflake` | Low momentum, cooling |

**Icon Size Standards:**
- Navigation: `h-5 w-5` (20px)
- Table headers: `h-4 w-4` (16px)
- Inline actions: `h-4 w-4` (16px)
- Badges/indicators: `h-3 w-3` (12px)
- Empty states: `h-12 w-12` (48px)

---

## 5. Recharts Integration Standards

All charts must utilize native CSS variables. Avoid hardcoded hex values in inline props.

### 5.1 Standard Chart Wrapper

```tsx
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";

// Wrapper component for all charts
function ChartWrapper({ children, height = 320 }: { children: React.ReactNode; height?: number }) {
  return (
    <div className="w-full" style={{ minHeight: height, maxHeight: height }}>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
```

### 5.2 Custom Tooltip

```tsx
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-elevated border border-border-strong rounded-lg p-3 shadow-xl backdrop-blur-md">
        <p className="font-mono text-xs text-text-tertiary mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-semibold tabular-nums" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
```

### 5.3 Axis & Grid Configuration

```tsx
// XAxis — always use CSS variables
<XAxis 
  dataKey="name" 
  tick={{ fill: "var(--color-text-tertiary)", fontSize: 11, fontFamily: "var(--font-sans)" }}
  axisLine={{ stroke: "var(--color-border-medium)" }}
  tickLine={{ stroke: "var(--color-border-subtle)" }}
/>

// YAxis
<YAxis 
  tick={{ fill: "var(--color-text-tertiary)", fontSize: 11, fontFamily: "var(--font-mono)" }}
  axisLine={{ stroke: "var(--color-border-medium)" }}
  tickLine={{ stroke: "var(--color-border-subtle)" }}
/>

// CartesianGrid
<CartesianGrid stroke="var(--color-border-subtle)" strokeDasharray="3 3" />

// Reference Lines (thresholds)
<ReferenceLine y={70} stroke="var(--color-bear)" strokeDasharray="3 3" strokeOpacity={0.6} />
<ReferenceLine y={30} stroke="var(--color-bull)" strokeDasharray="3 3" strokeOpacity={0.6} />
```

### 5.4 Area/Line Colors

```tsx
// For general trends
<Area 
  type="monotone" 
  dataKey="value" 
  stroke="var(--color-accent)" 
  fill="var(--color-accent-glow)"
  strokeWidth={2}
/>

// For sentiment/momentum (conditional coloring)
<Bar 
  dataKey="score" 
  fill={(entry: any) => entry.score >= 75 ? "var(--color-bull)" : entry.score >= 45 ? "var(--color-caution)" : "var(--color-bear)"}
  radius={[4, 4, 0, 0]}
/>
```

---

## 6. React 19 Performance & CLS Control

### 6.1 Tab Transition Optimization

Use React 19's `useTransition` to prevent UI blocking during tab switches:

```tsx
import { useTransition, useState } from "react";

function TabContainer() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (tab: string) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  };

  return (
    <div className="min-h-[600px]"> {/* CLS prevention: fixed minimum height */}
      {/* Tab Navigation */}
      <div className="flex gap-1 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
              activeTab === tab.id
                ? "bg-accent text-white"
                : "bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-overlay"
            } ${isPending && activeTab !== tab.id ? "opacity-50 cursor-wait" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content with loading state */}
      <div className="relative">
        {isPending && (
          <div className="absolute inset-0 bg-bg-base/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="animate-pulse text-text-secondary text-sm">Loading...</div>
          </div>
        )}
        <div className={isPending ? "opacity-50" : "opacity-100 transition-opacity duration-200"}>
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "momentum" && <MomentumTab />}
          {/* ... other tabs */}
        </div>
      </div>
    </div>
  );
}
```

### 6.2 Scanner Table CLS Prevention

```tsx
// Fixed table layout prevents column width jumping
<table className="w-full table-fixed">
  <colgroup>
    <col className="w-[40px]" />   {/* Rank */}
    <col className="w-[80px]" />   {/* Ticker */}
    <col className="w-[100px]" />  {/* Price */}
    <col className="w-[80px]" />   {/* Chg% */}
    <col className="w-[70px]" />   {/* Score */}
    <col className="w-[100px]" />  {/* Signal */}
    <col className="w-[60px]" />   {/* RSI */}
    <col className="w-[70px]" />   {/* RVOL */}
    <col className="w-[80px]" />   {/* Conf */}
    <col className="w-[50px]" />   {/* Actions */}
  </colgroup>
  {/* ... */}
</table>
```

### 6.3 Live Data Update Flash

```tsx
function FlashingValue({ value, className }: { value: string | number; className?: string }) {
  const [flash, setFlash] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 500);
      prevValue.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <span className={`tabular-nums transition-colors duration-300 ${flash ? "animate-flash" : ""} ${className}`}>
      {value}
    </span>
  );
}
```

---

## 7. Page Redesign Directives

### 7.1 `/app` — Earning Strategy Workspace

#### Header / Week Selector

```tsx
// Horizontal Date Strip
<div className="flex items-center gap-2 overflow-x-auto terminal-scrollbar pb-2">
  {weeks.map((week) => (
    <button
      key={week.id}
      onClick={() => selectWeek(week.id)}
      className={`flex-shrink-0 px-4 py-3 rounded-lg border text-left transition-all duration-150 min-w-[140px] ${
        selectedWeek === week.id
          ? "border-accent bg-bg-surface shadow-[0_0_15px_rgba(99,102,241,0.15)]"
          : "border-border-subtle bg-bg-elevated hover:border-border-medium"
      }`}
    >
      <p className="text-xs text-text-tertiary font-mono">{week.dateRange}</p>
      <p className="text-sm font-semibold text-text-primary mt-1">{week.eventCount} Events</p>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-bull">{week.bullishCount} 🐂</span>
        <span className="text-xs text-bear">{week.bearishCount} 🐻</span>
      </div>
    </button>
  ))}
</div>

// Quick Stats Bar
<div className="flex items-center gap-4 text-xs text-text-secondary mt-3">
  <span className="flex items-center gap-1.5">
    <BarChart3 className="h-3.5 w-3.5 text-info" />
    {entries.length} Earnings Events
  </span>
  <span className="w-px h-3 bg-border-medium" />
  <span className="flex items-center gap-1.5">
    <TrendingUp className="h-3.5 w-3.5 text-bull" />
    {bullishCount} Bullish Bias ({((bullishCount / entries.length) * 100).toFixed(0)}%)
  </span>
  <span className="w-px h-3 bg-border-medium" />
  <span className="flex items-center gap-1.5">
    <Zap className="h-3.5 w-3.5 text-caution" />
    Avg IV: {avgIV.toFixed(1)}%
  </span>
</div>
```

#### Tab Navigation (Pill Style)

```tsx
<div className="flex gap-1 p-1 bg-bg-elevated rounded-lg border border-border-subtle">
  {TABS.map((tab) => {
    const hasAlert = tab.id === "risk" && highRiskCount > 0;
    return (
      <button
        key={tab.id}
        onClick={() => handleTabChange(tab.id)}
        className={`relative px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${
          activeTab === tab.id
            ? "bg-accent text-white shadow-sm"
            : "text-text-secondary hover:text-text-primary hover:bg-bg-overlay"
        }`}
      >
        <tab.icon className="h-3.5 w-3.5" />
        {tab.label}
        {hasAlert && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-bear animate-pulse" />
        )}
      </button>
    );
  })}
</div>
```

#### Overview Tab (65/35 Split)

```tsx
<div className="grid grid-cols-12 gap-6">
  {/* Left: Executive Summary (65%) */}
  <div className="col-span-8">
    <div className="bg-bg-elevated border border-border-subtle rounded-lg p-5">
      <h2 className="text-lg font-bold text-text-primary mb-3">Executive Summary</h2>
      <div className="prose prose-invert max-w-none">
        <p className="text-text-secondary leading-relaxed">{report.summary}</p>
      </div>
      {report.keyCatalysts?.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-text-primary mb-2">Key Catalysts</h3>
          <div className="flex flex-wrap gap-2">
            {report.keyCatalysts.map((catalyst, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full bg-bg-surface border border-border-medium text-xs text-text-secondary">
                {catalyst}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Right: Metric Cards (35%) */}
  <div className="col-span-4 space-y-3">
    <MetricCard label="Total Events" value={entries.length} icon={BarChart3} color="info" />
    <MetricCard label="Bullish Bias" value={`${((bullishCount / entries.length) * 100).toFixed(0)}%`} icon={TrendingUp} color="bull" />
    <MetricCard label="Avg IV" value={`${avgIV.toFixed(1)}%`} icon={Zap} color="caution" />
    <MetricCard label="Avg RVOL" value={`${avgRVOL.toFixed(1)}x`} icon={Activity} color="info" />
  </div>
</div>

// MetricCard component
function MetricCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  const colorMap: Record<string, string> = {
    bull: "text-bull bg-bull-dim border-bull/20",
    bear: "text-bear bg-bear-dim border-bear/20",
    caution: "text-caution bg-caution-dim border-caution/20",
    info: "text-info bg-info-dim border-info/20",
  };
  return (
    <div className={`p-4 rounded-lg border ${colorMap[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 opacity-70" />
        <span className="text-xs text-text-tertiary uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
```

#### Momentum Tab (Horizontal Bar Chart)

```tsx
<ChartWrapper height={400}>
  <BarChart data={entries} layout="vertical" margin={{ left: 80, right: 40, top: 20, bottom: 20 }}>
    <CartesianGrid stroke="var(--color-border-subtle)" strokeDasharray="3 3" horizontal={false} />
    <XAxis type="number" domain={[0, 100]} tick={{ fill: "var(--color-text-tertiary)", fontSize: 11 }} />
    <YAxis 
      type="category" 
      dataKey="ticker" 
      tick={{ fill: "var(--color-text-primary)", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-mono)" }}
      width={70}
    />
    <Tooltip content={<CustomTooltip />} />
    <Bar 
      dataKey="momentumScore" 
      radius={[0, 4, 4, 0]}
      fill={(entry: any) => {
        if (entry.momentumScore >= 75) return "var(--color-bull)";
        if (entry.momentumScore >= 45) return "var(--color-caution)";
        return "var(--color-bear)";
      }}
    />
  </BarChart>
</ChartWrapper>
```

#### Stocks Tab (High-Density Table)

```tsx
<table className="w-full table-fixed">
  <thead>
    <tr className="border-b border-border-medium">
      <th className="text-left py-2 px-3 text-xs text-text-tertiary uppercase tracking-wider font-medium">Ticker</th>
      <th className="text-left py-2 px-3 text-xs text-text-tertiary uppercase tracking-wider font-medium">Name</th>
      <th className="text-right py-2 px-3 text-xs text-text-tertiary uppercase tracking-wider font-medium">Price</th>
      <th className="text-right py-2 px-3 text-xs text-text-tertiary uppercase tracking-wider font-medium">Chg%</th>
      <th className="text-right py-2 px-3 text-xs text-text-tertiary uppercase tracking-wider font-medium">RSI</th>
      <th className="text-right py-2 px-3 text-xs text-text-tertiary uppercase tracking-wider font-medium">IV</th>
      <th className="text-right py-2 px-3 text-xs text-text-tertiary uppercase tracking-wider font-medium">IV/HV</th>
      <th className="text-center py-2 px-3 text-xs text-text-tertiary uppercase tracking-wider font-medium">Strategy</th>
      <th className="text-right py-2 px-3 text-xs text-text-tertiary uppercase tracking-wider font-medium">Spark</th>
    </tr>
  </thead>
  <tbody>
    {entries.map((entry) => (
      <tr key={entry.ticker} className="border-b border-border-subtle hover:bg-bg-surface transition-colors duration-100">
        <td className="py-2 px-3">
          <span className="font-mono font-semibold text-text-primary">{entry.ticker}</span>
        </td>
        <td className="py-2 px-3">
          <span className="text-sm text-text-secondary truncate">{entry.name}</span>
        </td>
        <td className="py-2 px-3 text-right tabular-nums text-text-primary">${entry.currentPrice?.toFixed(2) ?? "—"}</td>
        <td className={`py-2 px-3 text-right tabular-nums ${entry.priceChange6M >= 0 ? "text-bull" : "text-bear"}`}>
          {entry.priceChange6M >= 0 ? "+" : ""}{entry.priceChange6M?.toFixed(1) ?? "—"}%
        </td>
        <td className={`py-2 px-3 text-right tabular-nums ${entry.rsi14 >= 70 ? "text-bear" : entry.rsi14 <= 30 ? "text-bull" : "text-text-primary"}`}>
          {entry.rsi14?.toFixed(0) ?? "—"}
        </td>
        <td className="py-2 px-3 text-right tabular-nums text-text-primary">{entry.currentIV?.toFixed(0) ?? "—"}%</td>
        <td className="py-2 px-3 text-right tabular-nums text-text-primary">
          {entry.historicalIV > 0 ? (entry.currentIV / entry.historicalIV).toFixed(1) + "x" : "—"}
        </td>
        <td className="py-2 px-3 text-center">
          <StrategyBadge strategy={entry.recommendedStrategy} rating={entry.strategyRating} />
        </td>
        <td className="py-2 px-3">
          <Sparkline data={entry.sparklineData} width={60} height={20} />
        </td>
      </tr>
    ))}
  </tbody>
</table>

// StrategyBadge component
function StrategyBadge({ strategy, rating }: { strategy: string; rating: string }) {
  const config: Record<string, { bg: string; text: string; border: string }> = {
    "Bull Call Spread": { bg: "bg-bull-dim", text: "text-bull", border: "border-bull/20" },
    "Bear Put Spread": { bg: "bg-bear-dim", text: "text-bear", border: "border-bear/20" },
    "Long Call": { bg: "bg-info-dim", text: "text-info", border: "border-info/20" },
    "Long Put": { bg: "bg-caution-dim", text: "text-caution", border: "border-caution/20" },
  };
  const c = config[strategy] || { bg: "bg-bg-surface", text: "text-text-secondary", border: "border-border-medium" };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      {strategy}
    </span>
  );
}
```

#### Calendar Tab (Visual Grid)

```tsx
<div className="grid grid-cols-7 gap-2">
  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
    <div key={day} className="text-center text-xs text-text-tertiary uppercase tracking-wider py-2">
      {day}
    </div>
  ))}
  {calendarDays.map((day) => (
    <div 
      key={day.date} 
      className={`min-h-[100px] p-2 rounded-lg border ${
        day.hasEvents 
          ? "bg-bg-elevated border-border-medium" 
          : "bg-bg-base border-border-subtle"
      }`}
    >
      <p className="text-xs text-text-tertiary font-mono mb-2">{day.date}</p>
      {day.events.map((event) => (
        <div key={event.ticker} className="flex items-center gap-1.5 mb-1">
          {event.earningsTime === "BMO" ? (
            <Sun className="h-3 w-3 text-caution" />
          ) : (
            <Moon className="h-3 w-3 text-info" />
          )}
          <span className="text-xs font-mono font-medium text-text-primary">{event.ticker}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${
            event.marketCap > 500_000_000_000 ? "bg-accent" : 
            event.marketCap > 50_000_000_000 ? "bg-info" : "bg-text-muted"
          }`} />
        </div>
      ))}
    </div>
  ))}
</div>
```

### 7.2 `/momentum` — Momentum Scanner

#### Header (Compact Terminal Style)

```tsx
<div className="flex items-center justify-between gap-4 mb-4">
  <div className="flex items-center gap-3">
    <Zap className="h-5 w-5 text-accent" />
    <div>
      <h1 className="text-lg font-bold text-text-primary">Momentum Scanner</h1>
      <p className="text-xs text-text-tertiary">60 liquid US names | Real-time | v4.0 Engine</p>
    </div>
  </div>
  
  {timingWarning && (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-caution-dim border border-caution/20 text-caution text-xs">
      <Clock className="h-3 w-3" />
      {timingWarning}
    </div>
  )}
</div>

<div className="flex items-center gap-3 mb-4 p-3 bg-bg-elevated rounded-lg border border-border-subtle">
  <button 
    onClick={handleScan}
    disabled={isScanning}
    className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-md text-sm font-semibold hover:bg-accent/90 active:scale-[0.97] transition-all duration-150 disabled:opacity-50"
  >
    {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
    {isScanning ? "Scanning..." : "Run Scan"}
  </button>
  
  <div className="h-6 w-px bg-border-medium" />
  
  <div className="flex items-center gap-2">
    <label className="text-xs text-text-tertiary">Min Score:</label>
    <input 
      type="number" 
      value={minScore} 
      onChange={(e) => setMinScore(e.target.value)}
      className="w-16 px-2 py-1 bg-bg-surface border border-border-medium rounded text-sm text-text-primary tabular-nums focus:ring-2 focus:ring-accent focus:outline-none"
    />
  </div>
  
  <div className="flex items-center gap-2">
    <label className="text-xs text-text-tertiary">Signal:</label>
    <select 
      value={filterSignal}
      onChange={(e) => setFilterSignal(e.target.value)}
      className="px-2 py-1 bg-bg-surface border border-border-medium rounded text-sm text-text-primary focus:ring-2 focus:ring-accent focus:outline-none"
    >
      <option value="ALL">All</option>
      <option value="STRONG_BUY">Strong Buy</option>
      <option value="BUY">Buy</option>
      <option value="NEUTRAL">Neutral</option>
    </select>
  </div>
</div>
```

#### Scanner Table (High-Density)

```tsx
<table className="w-full table-fixed">
  <colgroup>
    <col className="w-[40px]" />
    <col className="w-[80px]" />
    <col className="w-[100px]" />
    <col className="w-[80px]" />
    <col className="w-[70px]" />
    <col className="w-[100px]" />
    <col className="w-[60px]" />
    <col className="w-[70px]" />
    <col className="w-[80px]" />
    <col className="w-[50px]" />
  </colgroup>
  <thead>
    <tr className="border-b border-border-medium bg-bg-base">
      <th className="py-2 px-2 text-left text-[10px] text-text-tertiary uppercase tracking-wider font-medium">#</th>
      <th className="py-2 px-2 text-left text-[10px] text-text-tertiary uppercase tracking-wider font-medium">Ticker</th>
      <th className="py-2 px-2 text-right text-[10px] text-text-tertiary uppercase tracking-wider font-medium">Price</th>
      <th className="py-2 px-2 text-right text-[10px] text-text-tertiary uppercase tracking-wider font-medium">Chg%</th>
      <th className="py-2 px-2 text-right text-[10px] text-text-tertiary uppercase tracking-wider font-medium">Score</th>
      <th className="py-2 px-2 text-center text-[10px] text-text-tertiary uppercase tracking-wider font-medium">Signal</th>
      <th className="py-2 px-2 text-right text-[10px] text-text-tertiary uppercase tracking-wider font-medium">RSI</th>
      <th className="py-2 px-2 text-right text-[10px] text-text-tertiary uppercase tracking-wider font-medium">RVOL</th>
      <th className="py-2 px-2 text-right text-[10px] text-text-tertiary uppercase tracking-wider font-medium">Conf</th>
      <th className="py-2 px-2 text-center text-[10px] text-text-tertiary uppercase tracking-wider font-medium"></th>
    </tr>
  </thead>
  <tbody>
    {results.map((stock, index) => (
      <>
        <tr 
          key={stock.ticker}
          className="border-b border-border-subtle hover:bg-bg-surface transition-colors duration-100 cursor-pointer"
          onClick={() => toggleExpand(stock.ticker)}
        >
          <td className="py-2 px-2 text-xs text-text-tertiary tabular-nums">{index + 1}</td>
          <td className="py-2 px-2">
            <span className="font-mono font-semibold text-sm text-text-primary">{stock.ticker}</span>
          </td>
          <td className="py-2 px-2 text-right tabular-nums text-sm text-text-primary">${stock.currentPrice.toFixed(2)}</td>
          <td className={`py-2 px-2 text-right tabular-nums text-sm ${stock.priceChangePct >= 0 ? "text-bull" : "text-bear"}`}>
            {stock.priceChangePct >= 0 ? "+" : ""}{stock.priceChangePct.toFixed(2)}%
          </td>
          <td className="py-2 px-2 text-right tabular-nums text-sm font-semibold text-text-primary">{stock.score}</td>
          <td className="py-2 px-2 text-center">
            <SignalBadge signal={stock.signal} />
          </td>
          <td className={`py-2 px-2 text-right tabular-nums text-sm ${stock.rsi >= 70 ? "text-bear" : stock.rsi <= 30 ? "text-bull" : "text-text-primary"}`}>
            {stock.rsi.toFixed(0)}
          </td>
          <td className="py-2 px-2 text-right tabular-nums text-sm text-text-primary">{stock.volumeRatio.toFixed(1)}x</td>
          <td className="py-2 px-2 text-right tabular-nums text-sm text-text-primary">{stock.confidenceScore ?? "—"}</td>
          <td className="py-2 px-2 text-center">
            <button className="p-1 rounded hover:bg-bg-overlay transition-colors">
              {expandedRow === stock.ticker ? (
                <ChevronUp className="h-4 w-4 text-text-secondary" />
              ) : (
                <ChevronDown className="h-4 w-4 text-text-secondary" />
              )}
            </button>
          </td>
        </tr>
        {expandedRow === stock.ticker && (
          <tr>
            <td colSpan={10} className="p-0">
              <div className="bg-bg-elevated border-l-2 border-l-accent border-y border-r border-border-subtle p-5 m-0">
                <OptionStrategyPanel stock={stock} />
              </div>
            </td>
          </tr>
        )}
      </>
    ))}
  </tbody>
</table>

// SignalBadge component
function SignalBadge({ signal }: { signal: string }) {
  const config: Record<string, { bg: string; text: string; border: string; label: string }> = {
    "STRONG_BUY": { bg: "bg-bull-dim", text: "text-bull", border: "border-bull/20", label: "STRONG" },
    "BUY": { bg: "bg-bull-dim", text: "text-bull", border: "border-bull/20", label: "BUY" },
    "NEUTRAL_BULLISH": { bg: "bg-caution-dim", text: "text-caution", border: "border-caution/20", label: "BULL" },
    "NEUTRAL": { bg: "bg-bg-surface", text: "text-text-secondary", border: "border-border-medium", label: "NEUT" },
    "NEUTRAL_BEARISH": { bg: "bg-caution-dim", text: "text-caution", border: "border-caution/20", label: "BEAR" },
    "CAUTION_HOT": { bg: "bg-caution-dim", text: "text-caution", border: "border-caution/20", label: "HOT" },
    "OVERBOUGHT_RED": { bg: "bg-bear-dim", text: "text-bear", border: "border-bear/20", label: "RED" },
  };
  const c = config[signal] || config["NEUTRAL"];
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  );
}
```

### 7.3 `/daily-report` — Daily Report Library

#### Master-Detail Layout

```tsx
<div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
  {/* Left: Report List (40%) */}
  <div className="col-span-5 overflow-y-auto terminal-scrollbar pr-2">
    <div className="space-y-3">
      {reports.map((report) => (
        <button
          key={report.id}
          onClick={() => setSelectedReport(report)}
          className={`w-full text-left p-4 rounded-lg border transition-all duration-150 ${
            selectedReport?.id === report.id
              ? "border-accent bg-bg-surface shadow-[0_0_15px_rgba(99,102,241,0.1)]"
              : "border-border-subtle bg-bg-elevated hover:border-border-medium hover:bg-bg-surface"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-tertiary font-mono">
              {new Date(report.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            {report.source === "kimi" && (
              <span className="flex items-center gap-1 text-[10px] text-accent">
                <Sparkles className="h-3 w-3" />
                AI
              </span>
            )}
          </div>
          <h3 className={`text-sm font-semibold mb-1 transition-colors ${
            selectedReport?.id === report.id ? "text-accent" : "text-text-primary group-hover:text-accent"
          }`}>
            {report.title}
          </h3>
          <p className="text-xs text-text-secondary line-clamp-2 mb-3">{report.summary}</p>
          <div className="flex flex-wrap gap-1.5">
            {report.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-bg-base border border-border-subtle text-[10px] text-text-tertiary">
                #{tag}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  </div>

  {/* Right: Reading Pane (60%) */}
  <div className="col-span-7 overflow-y-auto terminal-scrollbar bg-bg-elevated rounded-lg border border-border-subtle">
    {selectedReport ? (
      <div className="p-6 report-content">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-medium">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-accent" />
              <span className="text-xs text-accent font-medium uppercase tracking-wider">Daily Intelligence</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">{selectedReport.title}</h1>
            <p className="text-sm text-text-tertiary mt-1">
              {new Date(selectedReport.createdAt).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-md bg-bg-surface border border-border-medium hover:bg-bg-overlay transition-colors">
              <Download className="h-4 w-4 text-text-secondary" />
            </button>
            <button className="p-2 rounded-md bg-bg-surface border border-border-medium hover:bg-bg-overlay transition-colors">
              <Share2 className="h-4 w-4 text-text-secondary" />
            </button>
          </div>
        </div>
        <Streamdown>{selectedReport.content}</Streamdown>
      </div>
    ) : (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <BookOpen className="h-12 w-12 text-text-muted mb-4" />
        <p className="text-text-secondary text-sm">Select a report from the archive to read</p>
        <p className="text-text-tertiary text-xs mt-1">Daily intelligence briefings and market analysis</p>
      </div>
    )}
  </div>
</div>
```

#### Markdown Typography Styles

```css
/* Add to client/src/index.css */
.report-content h1 {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-2);
  border-bottom: 1px solid var(--color-border-medium);
}

.report-content h2 {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-top: var(--spacing-6);
  margin-bottom: var(--spacing-3);
}

.report-content h3 {
  font-size: var(--text-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-4);
  margin-bottom: var(--spacing-2);
}

.report-content p {
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-4);
}

.report-content ul,
.report-content ol {
  margin-bottom: var(--spacing-4);
  padding-left: var(--spacing-5);
}

.report-content li {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-1);
}

.report-content blockquote {
  border-left: 3px solid var(--color-accent);
  background-color: var(--color-bg-surface);
  padding: var(--spacing-3) var(--spacing-4);
  font-style: italic;
  margin: var(--spacing-4) 0;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  color: var(--color-text-secondary);
}

.report-content code {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  background-color: var(--color-bg-surface);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  color: var(--color-accent);
}

.report-content pre {
  background-color: var(--color-bg-surface);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  overflow-x: auto;
  margin-bottom: var(--spacing-4);
  border: 1px solid var(--color-border-subtle);
}

.report-content pre code {
  background-color: transparent;
  padding: 0;
  color: var(--color-text-secondary);
}

.report-content table {
  width: 100%;
  margin: var(--spacing-4) 0;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

.report-content th {
  background-color: var(--color-bg-base);
  color: var(--color-text-tertiary);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: var(--spacing-2) var(--spacing-3);
  text-align: left;
  font-weight: var(--font-weight-semibold);
  border-bottom: 1px solid var(--color-border-strong);
}

.report-content td {
  padding: var(--spacing-2) var(--spacing-3);
  border-bottom: 1px solid var(--color-border-subtle);
  color: var(--color-text-secondary);
}

.report-content tr:hover td {
  background-color: var(--color-bg-surface);
}

.report-content a {
  color: var(--color-accent);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 150ms ease;
}

.report-content a:hover {
  border-bottom-color: var(--color-accent);
}

.report-content hr {
  border: none;
  border-top: 1px solid var(--color-border-medium);
  margin: var(--spacing-6) 0;
}

.report-content img {
  max-width: 100%;
  border-radius: var(--radius-lg);
  margin: var(--spacing-4) 0;
}
```

---

## 8. Responsive Design Standards

### Desktop (≥1280px)
- Full split layouts as specified above
- All table columns visible
- Side-by-side panels

### Tablet (768px–1279px)
```tsx
// Hide secondary columns in tables
<th className="hidden lg:table-cell">RVOL</th>
<th className="hidden lg:table-cell">Confidence</th>

// Split layouts become stacked
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  <div className="lg:col-span-5">{/* Left panel */}</div>
  <div className="lg:col-span-7">{/* Right panel */}</div>
</div>
```

### Mobile (<768px)
```tsx
// Tables become card lists
<div className="lg:hidden space-y-3">
  {results.map((stock) => (
    <div key={stock.ticker} className="bg-bg-elevated border border-border-subtle rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono font-bold text-text-primary">{stock.ticker}</span>
        <SignalBadge signal={stock.signal} />
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-[10px] text-text-tertiary">Price</p>
          <p className="text-sm font-semibold tabular-nums">${stock.currentPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-tertiary">Chg%</p>
          <p className={`text-sm font-semibold tabular-nums ${stock.priceChangePct >= 0 ? "text-bull" : "text-bear"}`}>
            {stock.priceChangePct >= 0 ? "+" : ""}{stock.priceChangePct.toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-[10px] text-text-tertiary">Score</p>
          <p className="text-sm font-semibold tabular-nums">{stock.score}</p>
        </div>
      </div>
    </div>
  ))}
</div>

// Detail panels become bottom sheets
{/* Use a slide-up drawer or full-screen modal for expanded stock details on mobile */}
```

---

## 9. Accessibility & Defensive Design

### 9.1 Accessibility Checklist

```tsx
// Color contrast verification
// All text colors must maintain 4.5:1 contrast against backgrounds
// Use this helper to verify:
function getContrastRatio(foreground: string, background: string): number {
  // Implementation of WCAG contrast ratio calculation
  // Ensure all combinations pass AA (4.5:1 for normal text, 3:1 for large text)
}

// Aria attributes
<table aria-label="Earnings strategy stock list">
  <thead>
    <tr>
      <th scope="col">Ticker</th>
      <th scope="col">Price</th>
      {/* ... */}
    </tr>
  </thead>
</table>

// Icon buttons must have aria-label
<button aria-label="Expand stock details" onClick={toggleExpand}>
  <ChevronDown className="h-4 w-4" />
</button>

// Focus management
<button className="focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base focus-visible:outline-none">
  {/* ... */}
</button>
```

### 9.2 Defensive Layout Rules

```tsx
// Truncation for long names
<span className="truncate max-w-[120px]" title={longName}>
  {longName}
</span>

// Null/undefined fallbacks
<td className="text-right tabular-nums">
  {value != null ? value.toFixed(2) : <span className="text-text-muted">—</span>}
</td>

// Safe division
<td className="text-right tabular-nums">
  {denominator !== 0 ? (numerator / denominator).toFixed(1) + "x" : <span className="text-text-muted">—</span>}
</td>

// Chart constraints
<div className="w-full" style={{ minHeight: 320, maxHeight: 320 }}>
  <ResponsiveContainer width="100%" height={320}>
    {/* Chart content */}
  </ResponsiveContainer>
</div>
```

---

## 10. Success & Validation Criteria

Before delivering the refactored code, confirm:

1. **Zero compilation errors:** `pnpm exec tsc --noEmit` returns exit code 0.
2. **No data model changes:** `shared/weeklyReports.ts`, `shared/momentumReports.ts`, `shared/dailyReports.ts`, and `client/src/scanner/types.ts` are untouched.
3. **Visual consistency:** All green/red/amber colors are used exclusively for data meaning, never decoratively.
4. **Responsive test:** Application is usable down to 320px viewport width.
5. **CLS check:** No layout shifts >0.1 on tab switches or data updates (use Chrome DevTools Performance panel).
6. **Keyboard navigation:** All interactive elements are reachable via Tab key and activatable via Enter/Space.
7. **Screen reader test:** Table headers, icon buttons, and dynamic content updates are properly announced.

---

## 11. Implementation Order

1. **Phase 1: Foundation**
   - Update `client/src/index.css` with new theme tokens and `@utility` classes
   - Verify build passes

2. **Phase 2: Global Components**
   - Create reusable components: `SignalBadge`, `MetricCard`, `ChartWrapper`, `CustomTooltip`
   - Update table styles globally

3. **Phase 3: `/app` Workspace**
   - Redesign header/week selector
   - Redesign tab navigation
   - Update each tab component (Overview → Option Detail)

4. **Phase 4: `/momentum` Scanner**
   - Redesign scanner header
   - Update results table
   - Polish expandable detail panel

5. **Phase 5: `/daily-report` Library**
   - Implement master-detail layout
   - Add markdown typography styles
   - Test responsive behavior

6. **Phase 6: Polish**
   - Add loading skeletons
   - Add empty states
   - Final accessibility audit
   - Performance check (CLS, render times)
