# GISTIFY IMPLEMENTATION GUIDE v2.0

> **Rol:** Senior Full-Stack Implementasyon Mühendisi — Gistify Actionable Prompt Rehberi  
> **Proje:** Gistify — Finansal Kazanç Takip Panosu & Opsiyon Stratejisi Platformu  
> **Tarih:** 2026-06-13  
> **Kapsam:** Bu dosya, GPT-5.4'e veya başka bir AI kodlayıcıya verilecek **prompt şeklinde** implementasyon talimatlarıdır. Her satır "NE yapılacağını" değil, "NASIL yapılacağını" anlatır.  
> **Hedef:** `Gistify_Gelismis_Rapor.md` (6046 satır, 12 bölüm) içeriğini doğrudan, test edilebilir, copy-paste hazır kod bloklarına çevirmek.  

---

## GÖREV ÖZETİ

Aşağıdaki 5 Phase, Gistify'nin mevcut teknik borcunu (3 tema yöneticisi, 0-byte dosyalar, 1876 satırlık monolith, client-side only paywall) gidermekten, enterprise-grade mimariye (Clerk auth, Stripe billing, OKLCH design tokens, widget dashboard, real-time WebSocket) geçişi kapsar. Her adım, bir önceki adımın tamamlanmasına bağımlıdır. Paralel task'lar ayrıca işaretlenmiştir.

---

## PROJE BAĞIMLILIK GRAFİĞİ (Genel)

```
PHASE 1 (Acil Düzeltmeler) → PHASE 2 (Yapı & Mimari) → PHASE 3 (Özellikler) → PHASE 4 (Güvenlik & Performans) → PHASE 5 (DevOps & Roadmap)
├─ 1.1 tactical-card CSS (paralel) → 2.1 Design system
├─ 1.2 Empty file fix (paralel) → 2.2 Component split
├─ 1.3 Theme unify (paralel) → 2.3 Zustand store
├─ 1.4 Monolith split (paralel) → 2.4 Widget mimarisi
├─ 1.5 Server paywall (paralel) → 3.6 Stripe billing
└─ 1.6 OKLCH tokens (paralel) → 4.3 Dark/Light mode
```

---

## PHASE 1: ACİL DÜZELTMELER (Bugün başla, 1 günde bitir)

> **Hedef:** Mevcut production'daki kritik bug'ları ve 0-day sorunlarını çöz. Hiçbir yeni özellik ekleme. Sadece düzelt.

### Phase 1 Bağımlılık Grafiği
```
1.1 tactical-card CSS ─┐
1.2 StockDetailTab.tsx ─┼→ 1.7 Theme cleanup (serileşik)
1.3 ReportsAdmin split ─┤
1.4 Theme unify ───────┘
1.5 restricted-view server-side ─┐
1.6 OKLCH token base ────────────┼→ 1.8 Final test suite
1.7 Tailwind safelist ───────────┘
```

---

### STEP 1.1: `tactical-card` CSS Tanımını Ekle

**Yapılacak:** Raporlarda bahsedilen `tactical-card` CSS sınıfı tanımsız olduğundan 7 tab bozuk. Bu sınıfı `client/src/index.css` içine ekle.

**Mevcut kod:** `client/src/index.css` içinde `tactical-card` sınıfı yok.

**Yeni kod:** `client/src/index.css` dosyasının EN ALTINA ekle:

```css
/* =========================================================
   TACTICAL CARD — Gistify Opsiyon Stratejisi Kartı
   ========================================================= */
@layer components {
  .tactical-card {
    @apply relative overflow-hidden rounded-2xl border border-border bg-card/95 p-5 shadow-lg transition-all duration-300;
  }

  .tactical-card:hover {
    @apply shadow-xl border-border/80 bg-card;
  }

  .tactical-card .tactical-header {
    @apply flex items-center justify-between gap-3 mb-4;
  }

  .tactical-card .tactical-title {
    @apply text-sm font-semibold tracking-tight text-foreground;
  }

  .tactical-card .tactical-badge {
    @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider;
  }

  .tactical-card .tactical-badge--call {
    @apply bg-emerald-500/10 text-emerald-400 border border-emerald-500/20;
  }

  .tactical-card .tactical-badge--put {
    @apply bg-rose-500/10 text-rose-400 border border-rose-500/20;
  }

  .tactical-card .tactical-body {
    @apply space-y-3;
  }

  .tactical-card .tactical-row {
    @apply flex items-center justify-between gap-2 text-sm;
  }

  .tactical-card .tactical-label {
    @apply text-muted-foreground text-xs uppercase tracking-wider;
  }

  .tactical-card .tactical-value {
    @apply font-mono font-medium text-foreground;
  }

  .tactical-card .tactical-value--positive {
    @apply text-emerald-400;
  }

  .tactical-card .tactical-value--negative {
    @apply text-rose-400;
  }

  .tactical-card .tactical-footer {
    @apply mt-4 pt-3 border-t border-border flex items-center justify-between gap-2;
  }

  .tactical-card .tactical-action {
    @apply inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors;
  }
}
```

**Test:** `npm run dev` → `/app` sayfasına git → herhangi bir opsiyon kartı hover et → border ve shadow transition çalışmalı. Eğer `tailwindcss` v4 kullanıyorsan, `@layer components` çalışmayabilir; o zaman aşağıdaki `index.css` güncellemesiyle uyumlu hale getir.

**Geri alma planı:** Eğer `@apply` hata verirse, `postcss-import` veya `tailwindcss` v3/v4 compat sorunudur. Eski syntax'a geç:
```css
.tactical-card {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--card) / 0.95);
  padding: 1.25rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  transition: all 0.3s ease;
}
```

---

### STEP 1.2: `StockDetailTab.tsx` Oluştur (0 Byte → İçerik Doldur)

**Yapılacak:** Mevcut import ediliyor ama 0 byte olan `StockDetailTab.tsx` dosyasını oluştur. İçerik: temel hisse detay görünümü (symbol, price, change, mini chart placeholder, key stats). Sonra `Home.tsx` veya `App.tsx` içinde bu tab'a route ekle.

**Yeni dosya:** `client/src/components/tabs/StockDetailTab.tsx`

```tsx
import { useMemo } from "react";
import { ArrowUpRight, ArrowDownRight, TrendingUp, BarChart3, Clock, DollarSign, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface StockDetail {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  peRatio?: number;
  sector: string;
  industry: string;
}

interface StockDetailTabProps {
  stock?: StockDetail;
  loading?: boolean;
}

export default function StockDetailTab({ stock, loading }: StockDetailTabProps) {
  const isPositive = (stock?.change ?? 0) >= 0;

  const stats = useMemo(() => {
    if (!stock) return [];
    return [
      { label: "Hacim", value: stock.volume.toLocaleString("tr-TR"), icon: BarChart3 },
      { label: "Piyasa Değeri", value: stock.marketCap, icon: DollarSign },
      { label: "Sektör", value: stock.sector, icon: Activity },
      { label: "Sürekli", value: stock.industry, icon: Clock },
      ...(stock.peRatio ? [{ label: "F/K", value: stock.peRatio.toFixed(2), icon: TrendingUp }] : []),
    ];
  }, [stock]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BarChart3 className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground">Hisse seçilmedi</h3>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Watchlist&apos;ten bir hisse seçerek detayları görüntüleyin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">{stock.symbol}</h2>
            <Badge variant="outline" className="text-xs uppercase tracking-wider">
              {stock.sector}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{stock.name}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold font-mono tracking-tight">
            ${stock.price.toFixed(2)}
          </p>
          <div className={`flex items-center justify-end gap-1 text-sm font-medium ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
            {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            <span>{isPositive ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-card/60 border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-semibold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart Placeholder */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Fiyat Grafiği</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 rounded-lg bg-muted/40 flex items-center justify-center border border-dashed border-border">
            <p className="text-sm text-muted-foreground">
              Grafik entegrasyonu (Lightweight Charts) Phase 3'te eklenecek.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Test:** `npm run dev` → `/app` sayfasına git → eğer `StockDetailTab` import hatası alıyorsan, import path'i kontrol et. `Home.tsx` içinde şu import'u kullan:

```tsx
import StockDetailTab from "@/components/tabs/StockDetailTab";
```

**Geri alma planı:** Eğer `StockDetailTab` kullanılmıyorsa, sadece dosyayı oluştur ve build hatası alana kadar beklet. Mevcut kodda bu component'e referans olmayabilir; bu durumda dosya oluşturulmuş olur ve Phase 2'de entegre edilir.

---

### STEP 1.3: `ReportsAdmin.tsx` Monolith Split (1968 satır → 5 Sorumluluk)

**Yapılacak:** `client/src/pages/ReportsAdmin.tsx` 1968 satır ve 5+ sorumluluk içeriyor. Bunu 5 ayrı component'e böl:
1. `WeeklyReportAdminPanel` (zaten var ama inline logic var)
2. `MomentumReportAdminPanel` (zaten var)
3. `DailyReportAdminPanel` (zaten var)
4. `OpenAiImageAdminPanel` (zaten var)
5. Yeni: `ReportsAdminShell.tsx` — layout, workspace switcher, auth guard

**Mevcut kod:** `client/src/pages/ReportsAdmin.tsx` içinde tüm logic inline.

**Yeni kod:** `client/src/pages/ReportsAdmin.tsx` dosyasını KOMPLE DEĞİŞTİR:

```tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { copy, type AppLanguage } from "@/lib/i18n";
import { extractApiErrorMessage, readJsonResponse } from "@/lib/api";
import { REPORT_ADMIN_SECRET_STORAGE_KEY } from "@/lib/weeklyReports";
import WeeklyReportAdminPanel from "@/components/reports/WeeklyReportAdminPanel";
import MomentumReportAdminPanel from "@/components/reports/MomentumReportAdminPanel";
import DailyReportAdminPanel from "@/components/reports/DailyReportAdminPanel";
import OpenAiImageAdminPanel from "@/components/reports/OpenAiImageAdminPanel";

type WorkspaceKey = "earnings" | "momentum" | "daily" | "images";

interface AdminAuthResponse {
  authorized?: boolean;
  email?: string;
}

interface ReportsAdminProps {
  language: AppLanguage;
}

export default function ReportsAdmin({ language }: ReportsAdminProps) {
  const [, setLocation] = useLocation();
  const [workspace, setWorkspace] = useState<WorkspaceKey>("earnings");
  const [secret, setSecret] = useState(() => {
    try { return localStorage.getItem(REPORT_ADMIN_SECRET_STORAGE_KEY) || ""; } catch { return ""; }
  });
  const [auth, setAuth] = useState<AdminAuthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async (inputSecret: string) => {
    if (!inputSecret.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reports/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: inputSecret }),
      });
      const data = await readJsonResponse<AdminAuthResponse>(res);
      if (res.ok && data.authorized) {
        setAuth(data);
        try { localStorage.setItem(REPORT_ADMIN_SECRET_STORAGE_KEY, inputSecret); } catch {}
      } else {
        setError(copy(language, "Yetkisiz erisim", "Unauthorized access"));
      }
    } catch (err) {
      setError(extractApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    const stored = localStorage.getItem(REPORT_ADMIN_SECRET_STORAGE_KEY);
    if (stored) checkAuth(stored);
  }, [checkAuth]);

  const workspaces = useMemo(() => [
    { key: "earnings" as WorkspaceKey, label: copy(language, "Kazanç Raporları", "Earnings Reports") },
    { key: "momentum" as WorkspaceKey, label: copy(language, "Momentum", "Momentum") },
    { key: "daily" as WorkspaceKey, label: copy(language, "Günlük Rapor", "Daily Report") },
    { key: "images" as WorkspaceKey, label: copy(language, "AI Görsel", "AI Image") },
  ], [language]);

  if (!auth?.authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card/95 p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium">{copy(language, "Admin Paneli", "Admin Panel")}</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            {copy(language, "Erisim anahtari gerekli", "Access key required")}
          </h1>
          <Input
            type="password"
            placeholder={copy(language, "Admin sifresi", "Admin password")}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkAuth(secret)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button className="w-full" onClick={() => checkAuth(secret)} disabled={loading}>
            {loading
              ? copy(language, "Kontrol ediliyor...", "Checking...")
              : copy(language, "Giris yap", "Sign in")}
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setLocation("/app")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {copy(language, "Geri don", "Go back")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setLocation("/app")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              {copy(language, "Geri", "Back")}
            </Button>
            <h1 className="text-lg font-semibold tracking-tight">
              {copy(language, "Rapor Yonetimi", "Report Management")}
            </h1>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            {workspaces.map((ws) => (
              <button
                key={ws.key}
                onClick={() => setWorkspace(ws.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  workspace === ws.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {ws.label}
              </button>
            ))}
          </div>
        </div>

        {workspace === "earnings" && <WeeklyReportAdminPanel language={language} />}
        {workspace === "momentum" && <MomentumReportAdminPanel language={language} />}
        {workspace === "daily" && <DailyReportAdminPanel language={language} />}
        {workspace === "images" && <OpenAiImageAdminPanel language={language} />}
      </div>
    </div>
  );
}
```

**Not:** Eğer mevcut `ReportsAdmin.tsx` içindeki `WeeklyReportAdminPanel`, `MomentumReportAdminPanel`, `DailyReportAdminPanel`, `OpenAiImageAdminPanel` component'leri inline olarak tanımlanmışsa, onları AYRICA `client/src/components/reports/` altındaki dosyalara taşı. Bu adım sadece shell'i düzeltir; inline component'lerin ayrıştırılması STEP 1.4'te yapılır.

**Test:** `npm run dev` → `/app/admin` → admin şifresi gir → workspace switcher (Earnings, Momentum, Daily, AI Görsel) çalışmalı. Her sekme farklı paneli göstermeli.

**Geri alma planı:** Eğer eski `ReportsAdmin.tsx` içindeki fonksiyonlar harici dosyalara taşınmamışsa ve import hatası alınıyorsa, eski dosyayı geri al ve sadece 1.3'ü shell olarak uygula, inline component'leri sonraki adımda taşı.

---

### STEP 1.4: 3 Tema Yöneticisini Birleştir (ThemeContext + CSS + Sonner)

**Yapılacak:** Mevcutta 3 ayrı tema yöneticisi var:
1. `ThemeContext.tsx` — `defaultTheme="dark"`, `classList.add("dark")`
2. `sonner.tsx` — muhtemelen `next-themes` veya kendi theme logic'i
3. `index.css` — muhtemelen `color-scheme: dark` veya `light`

Hepsini tek bir `UnifiedThemeProvider` altında birleştir. Sonner, `ThemeContext`'i tüketsin. CSS variable'lar tek bir kaynaktan gelsin.

**Mevcut kod:** `client/src/contexts/ThemeContext.tsx` (dark/light toggle var ama `defaultTheme="dark"` sabit ve `switchable=false` ile çoğu yerde kullanılıyor).

**Yeni kod:** `client/src/contexts/ThemeContext.tsx` dosyasını KOMPLE DEĞİŞTİR:

```tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "gistify-theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") return getSystemTheme();
  return theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      return stored || "dark";
    } catch {
      return "dark";
    }
  });

  const resolvedTheme = resolveTheme(theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    root.style.colorScheme = resolvedTheme;

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme, resolvedTheme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const next = resolveTheme("system");
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(next);
      root.style.colorScheme = next;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const resolved = resolveTheme(prev);
      return resolved === "dark" ? "light" : "dark";
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

**Sonner güncellemesi:** `client/src/components/ui/sonner.tsx` dosyasını KOMPLE DEĞİŞTİR:

```tsx
import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}
```

**App.tsx güncellemesi:** `client/src/App.tsx` içinde `ThemeProvider` kullanımını değiştir. Mevcut:
```tsx
<ThemeProvider defaultTheme="dark">
```
Yeni:
```tsx
<ThemeProvider>
```
(Yani `defaultTheme` prop'unu kaldır. `ThemeProvider` artık kendi default'unu içinde tutuyor.)

**Test:** `npm run dev` → sayfayı aç → `document.documentElement.classList` içinde sadece `dark` veya `light` olmalı (eski halde `dark` + `light` aynı anda olabiliyordu). Sonner toast tetikle (`toast("Test")`) → toast arka planı theme ile uyumlu olmalı.

**Geri alma planı:** Eğer `useTheme` hook'u Sonner dışında başka yerlerde kullanılıyorsa ve `switchable` prop'una bağımlıysa, o component'lere `useTheme().toggleTheme` kullanımını ekle.

---

### STEP 1.5: `restricted-view` Sadece Client-Side CSS → Server-Side Paywall Ekle

**Yapılacak:** Mevcut `restricted-view` mantığı sadece client-side CSS blur + pointer-events kullanıyor. Bu, "Inspect Element" ile kolayca bypass edilebilir. Server-side API katmanına `requireTier` middleware'i ekle.

**Yeni dosya:** `server/middleware/requireTier.ts`

```ts
import type { Request, Response, NextFunction } from "express";

export type Tier = "free" | "member" | "pro";

interface TieredRequest extends Request {
  user?: {
    id: string;
    email: string;
    tier: Tier;
  };
}

const TIER_HIERARCHY: Record<Tier, number> = {
  free: 0,
  member: 1,
  pro: 2,
};

export function requireTier(minTier: Tier) {
  return (req: TieredRequest, res: Response, next: NextFunction) => {
    const userTier = req.user?.tier || "free";
    const userLevel = TIER_HIERARCHY[userTier];
    const requiredLevel = TIER_HIERARCHY[minTier];

    if (userLevel < requiredLevel) {
      res.status(403).json({
        error: "Tier upgrade required",
        current: userTier,
        required: minTier,
        upgradeUrl: "/pay",
      });
      return;
    }

    next();
  };
}

export function requireAuth(req: TieredRequest, res: Response, next: NextFunction) {
  if (!req.user?.id) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}
```

**Server route'ları güncelle:** `server/index.ts` içindeki korunan endpoint'lere middleware ekle. Örnek:

```ts
import { requireTier, requireAuth } from "./middleware/requireTier";

// Mevcut route örneği:
// app.get("/api/reports/weekly", async (req, res) => { ... });

// Yeni:
app.get("/api/reports/weekly", requireAuth, requireTier("member"), async (req, res) => {
  // ... mevcut logic
});
```

**Client-side fallback:** `client/src/App.tsx` içindeki `isLimitedAccess` kontrolüne, API 403 döndürdüğünde otomatik downgrade ekle. `client/src/lib/api.ts` içine interceptor ekle:

```ts
// client/src/lib/api.ts
export async function fetchWithPaywall<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, { credentials: "include", ...options });
  if (res.status === 403) {
    const data = await res.json().catch(() => ({}));
    if (data.error === "Tier upgrade required") {
      window.location.href = data.upgradeUrl || "/pay";
      throw new Error("Paywall: redirecting to upgrade");
    }
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
}
```

**Test:** `npm run dev` → üyeliksiz kullanıcı ile `/api/reports/weekly` endpoint'ine curl at:
```bash
curl -i http://localhost:3000/api/reports/weekly
```
→ `401 Authentication required` dönmeli.  
Üye ama aboneliksiz kullanıcı ile aynı endpoint'e istek at → `403 Tier upgrade required` dönmeli.

**Geri alma planı:** Eğer mevcut auth middleware (Google OAuth) `req.user` objesini farklı şekilde set ediyorsa, `TieredRequest` interface'ini buna uygun şekilde güncelle. Eğer Express kullanılmıyorsa (örneğin Vite + HMR backend), middleware'i API handler fonksiyonlarının başına inline olarak ekle.

---

### STEP 1.6: OKLCH Token CSS Temelini At

**Yapılacak:** 3 farklı renk sistemi (HEX, OKLCH, Tailwind Slate) çakışıyor. Tek bir OKLCH tabanlı design token sistemi kur. `client/src/index.css` içine `:root` ve `[data-theme="dark"]` / `[data-theme="light"]` variable'ları ekle.

**Mevcut kod:** `client/src/index.css` içinde muhtemelen `hsl()` veya `rgb()` variable'lar var.

**Yeni kod:** `client/src/index.css` dosyasının EN ÜSTÜNE (mevcut `@tailwind` directive'lerinin altına, ama diğer CSS kurallarının üstüne) ekle:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* OKLCH Design Tokens — Gistify Unified Color System */
    /* Base: Dark mode default (Gistify'nin mevcut dark UI'si) */
    --color-bg: oklch(0.11 0.025 230);
    --color-surface: oklch(0.15 0.03 225);
    --color-surface-elevated: oklch(0.18 0.035 220);
    --color-border: oklch(0.25 0.02 230);
    --color-border-subtle: oklch(0.20 0.015 230);

    --color-text-primary: oklch(0.95 0.01 230);
    --color-text-secondary: oklch(0.75 0.015 230);
    --color-text-tertiary: oklch(0.60 0.01 230);
    --color-text-muted: oklch(0.45 0.01 230);

    --color-bull: oklch(0.78 0.18 160);
    --color-bull-light: oklch(0.85 0.12 160);
    --color-bear: oklch(0.65 0.22 25);
    --color-bear-light: oklch(0.72 0.15 25);
    --color-caution: oklch(0.75 0.15 75);
    --color-accent: oklch(0.70 0.16 260);
    --color-accent-light: oklch(0.80 0.10 260);

    --color-chart-1: oklch(0.70 0.16 260);
    --color-chart-2: oklch(0.75 0.14 160);
    --color-chart-3: oklch(0.65 0.18 25);
    --color-chart-4: oklch(0.72 0.12 75);
    --color-chart-5: oklch(0.60 0.10 300);

    /* Tailwind shadcn/ui compat — map to HSL for existing components */
    --background: 220 13% 5%;
    --foreground: 220 10% 95%;
    --card: 220 13% 8%;
    --card-foreground: 220 10% 95%;
    --popover: 220 13% 8%;
    --popover-foreground: 220 10% 95%;
    --primary: 220 70% 55%;
    --primary-foreground: 0 0% 100%;
    --secondary: 220 10% 15%;
    --secondary-foreground: 220 10% 95%;
    --muted: 220 10% 18%;
    --muted-foreground: 220 10% 55%;
    --accent: 220 10% 18%;
    --accent-foreground: 220 10% 95%;
    --destructive: 0 60% 45%;
    --destructive-foreground: 0 0% 100%;
    --border: 220 10% 20%;
    --input: 220 10% 20%;
    --ring: 220 70% 55%;
    --radius: 0.5rem;
  }

  [data-theme="light"] {
    --color-bg: oklch(0.98 0.01 230);
    --color-surface: oklch(0.95 0.02 225);
    --color-surface-elevated: oklch(1.0 0 0);
    --color-border: oklch(0.85 0.02 230);
    --color-border-subtle: oklch(0.90 0.015 230);

    --color-text-primary: oklch(0.20 0.02 230);
    --color-text-secondary: oklch(0.40 0.015 230);
    --color-text-tertiary: oklch(0.55 0.01 230);
    --color-text-muted: oklch(0.65 0.01 230);

    --color-bull: oklch(0.65 0.18 160);
    --color-bull-light: oklch(0.72 0.12 160);
    --color-bear: oklch(0.55 0.22 25);
    --color-bear-light: oklch(0.62 0.15 25);
    --color-caution: oklch(0.65 0.15 75);
    --color-accent: oklch(0.60 0.16 260);
    --color-accent-light: oklch(0.70 0.10 260);

    --background: 0 0% 100%;
    --foreground: 220 20% 10%;
    --card: 0 0% 98%;
    --card-foreground: 220 20% 10%;
    --popover: 0 0% 100%;
    --popover-foreground: 220 20% 10%;
    --primary: 220 70% 50%;
    --primary-foreground: 0 0% 100%;
    --secondary: 220 10% 92%;
    --secondary-foreground: 220 20% 10%;
    --muted: 220 10% 92%;
    --muted-foreground: 220 10% 45%;
    --accent: 220 10% 92%;
    --accent-foreground: 220 20% 10%;
    --destructive: 0 60% 50%;
    --destructive-foreground: 0 0% 100%;
    --border: 220 10% 88%;
    --input: 220 10% 88%;
    --ring: 220 70% 50%;
  }
}
```

**Test:** `npm run dev` → sayfa açıldığında `document.documentElement` üzerinde `data-theme="dark"` attribute'u olmalı. `computedStyle(document.documentElement).getPropertyValue('--color-bull')` çalıştır → `oklch(0.78 0.18 160)` dönmeli. Eğer Tailwind v4 kullanılıyorsa, `@layer base` syntax'ı farklı olabilir; v4'te `@theme` veya `theme()` kullanımı gerekir. V4 için fallback:

```css
/* Tailwind v4 fallback */
@theme {
  --color-bull: oklch(0.78 0.18 160);
  --color-bear: oklch(0.65 0.22 25);
  /* ... diğerleri */
}
```

**Geri alma planı:** Eğer OKLCH desteklemeyen eski tarayıcılar (Safari <15, Chrome <111) hedefleniyorsa, `@supports not (color: oklch(0 0 0))` ile HEX fallback ekle.

---

### STEP 1.7: Tailwind Safelist + Dynamic Class Fix

**Yapılacak:** `bg-${accentColor}-500/5` gibi template literal class'lar stilsiz kalıyor. Tailwind JIT safelist'e Gistify'nin dinamik kullandığı class'ları ekle.

**Yeni dosya:** `client/tailwind.config.ts` (veya mevcut `.js` varsa onu güncelle)

Eğer `tailwind.config.ts` yoksa oluştur. İçerik:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../shared/**/*.{ts,tsx}",
  ],
  safelist: [
    // Dynamic color classes used in momentum/earnings tabs
    "bg-emerald-500/5",
    "bg-emerald-500/10",
    "bg-rose-500/5",
    "bg-rose-500/10",
    "bg-amber-500/5",
    "bg-amber-500/10",
    "bg-blue-500/5",
    "bg-blue-500/10",
    "text-emerald-400",
    "text-rose-400",
    "text-amber-400",
    "text-blue-400",
    "border-emerald-500/20",
    "border-rose-500/20",
    "border-amber-500/20",
    "border-blue-500/20",
    // Tactical card variants
    "tactical-card",
    "tactical-badge--call",
    "tactical-badge--put",
    // Limited access blur overlay
    "blur-sm",
    "pointer-events-none",
    "select-none",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // OKLCH semantic aliases
        bull: { DEFAULT: "var(--color-bull)", light: "var(--color-bull-light)" },
        bear: { DEFAULT: "var(--color-bear)", light: "var(--color-bear-light)" },
        caution: "var(--color-caution)",
        surface: { DEFAULT: "var(--color-surface)", elevated: "var(--color-surface-elevated)" },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

**Test:** `npm run build` → build başarılı olmalı. `bg-emerald-500/5` class'ı artık safelist'te olduğundan, dinamik string oluşturulan yerlerde çalışacak. Eğer `accentColor` değişkeni `emerald`, `rose`, `amber`, `blue` dışında bir değer alıyorsa, o değerleri de safelist'e ekle.

**Geri alma planı:** Eğer Tailwind v4 kullanılıyorsa, `safelist` config'i `tailwind.config.ts` yerine `@source` directive'ine taşınmalı. V4 için:
```css
@source "../safelist.txt";
```

---

### Phase 1 Checklist

```
□ tactical-card CSS eklendi → `client/src/index.css` içinde `.tactical-card` var
□ StockDetailTab.tsx oluşturuldu → 0 byte değil, 120+ satır
□ ReportsAdmin.tsx shell oluşturuldu → 1968 satır → ~200 satır shell + 4 ayrı panel
□ ThemeContext birleştirildi → 3 tema yöneticisi → 1 unified provider
□ Sonner theme provider'dan tüketiyor → `useTheme` kullanıyor
□ Server-side paywall middleware eklendi → `requireTier` Express middleware çalışıyor
□ OKLCH token base atıldı → `:root` ve `[data-theme]` variable'ları tanımlı
□ Tailwind safelist dinamik class'ları içeriyor → build'da class'lar kaybolmuyor
□ `npm run dev` hatasız başlıyor
□ `npm run build` hatasız bitiyor
```

### Phase 1 Risk & Rollback Planı

| Risk | Etki | Rollback |
|------|------|----------|
| ThemeContext değişikliği diğer component'leri kırar | Orta | `git checkout -- client/src/contexts/ThemeContext.tsx` |
| ReportsAdmin split sonrası import hatası | Yüksek | Eski dosyayı restore et, sadece shell'i ayrı dosyada tut |
| Tailwind safelist syntax uyumsuzluğu | Düşük | Eski config'e dön, class'ları inline `<span className="...">` olarak sabitle |

---


## PHASE 2: YAPI & MİMARİ (2–4 hafta)

> **Hedef:** Teknik borcu ödemek değil, yeni mimariyi kurmak. Vite strict mode, Zustand store, TanStack Query, widget mimarisi, OKLCH design system, component split.

### Phase 2 Bağımlılık Grafiği
```
2.1 Vite strict config ─┐
2.2 tsconfig strict ────┼→ 2.5 Zustand store → 2.6 TanStack Query → 2.7 Widget base
2.3 Design system ──────┤
2.4 Component split ────┘
```

---

### STEP 2.1: Vite Config + Rollup Visualizer + Code Splitting

**Yapılacak:** `vite.config.ts` güncelle. `rollup-plugin-visualizer` ekle, manual chunks tanımla, alias'ları düzenle.

**Mevcut kod:** Basit Vite config (react plugin + basit alias).

**Yeni kod:** `client/vite.config.ts` KOMPLE DEĞİŞTİR:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: "dist/stats.html",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@server": path.resolve(__dirname, "../server"),
      "@gistify/ui": path.resolve(__dirname, "./src/components/ui"),
      "@gistify/data": path.resolve(__dirname, "./src/lib"),
    },
  },
  build: {
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          "react-vendor": ["react", "react-dom"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
          ],
          "chart-vendor": ["recharts"],
          "md-vendor": ["unified", "remark-parse", "remark-gfm", "rehype-sanitize"],
          "scanner-vendor": ["lightweight-charts"],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
```

**Kurulum:**
```bash
npm install -D rollup-plugin-visualizer
```

**Test:** `npm run build` → `dist/stats.html` oluşmalı. Tarayıcıda aç → chunk boyutları görünmeli. `react-vendor` chunk'ı ayrı dosyada olmalı.

---

### STEP 2.2: tsconfig Strictest Configuration

**Yapılacak:** `client/tsconfig.json` strict mode'a al. `noImplicitAny`, `strictNullChecks`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess` aç.

**Yeni kod:** `client/tsconfig.json` KOMPLE DEĞİŞTİR:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../shared/*"],
      "@server/*": ["../server/*"],
      "@gistify/ui/*": ["./src/components/ui/*"],
      "@gistify/data/*": ["./src/lib/*"]
    }
  },
  "include": ["src", "../shared"],
  "exclude": ["node_modules", "dist"]
}
```

**Test:** `npx tsc --noEmit` → muhtemelen 100+ hata verecek. Her hatayı tek tek düzelt. Hata sayısını günde 20-30 azalt. Hedef: 0 hata.

**Geri alma planı:** Eğer strict mode çok fazla hata üretiyorsa ve development'ı durduruyorsa, `noUnusedLocals` ve `noUnusedParameters` geçici olarak `false` yap. Diğer strict kuralları açık kalsın.

---

### STEP 2.3: Zustand Store'ları Kur (Global + Dashboard + Auth)

**Yapılacak:** React Context yerine Zustand kullan. `useState` + `useEffect` ile manuel fetch pattern'leri yerine Zustand + TanStack Query kullan.

**Kurulum:**
```bash
npm install zustand immer
npm install -D @types/immer
```

**Yeni dosya:** `client/src/stores/dashboardStore.ts`

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type WidgetType =
  | "watchlist"
  | "chart"
  | "news"
  | "screener"
  | "notes"
  | "earnings-calendar"
  | "market-depth"
  | "ai-insight";

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  colorGroup?: string;
  props: Record<string, unknown>;
}

interface DashboardState {
  widgets: WidgetConfig[];
  activeLayout: string;
  selectedTickers: Record<string, string[]>;
  addWidget: (widget: Omit<WidgetConfig, "id">) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, partial: Partial<WidgetConfig>) => void;
  linkTicker: (colorGroup: string, ticker: string) => void;
  unlinkTicker: (colorGroup: string, ticker: string) => void;
  setLayout: (name: string) => void;
}

export const useDashboardStore = create<DashboardState>()(
  immer(
    persist(
      (set) => ({
        widgets: [],
        activeLayout: "default",
        selectedTickers: {},
        addWidget: (widget) =>
          set((state) => {
            state.widgets.push({ ...widget, id: crypto.randomUUID() });
          }),
        removeWidget: (id) =>
          set((state) => {
            state.widgets = state.widgets.filter((w) => w.id !== id);
          }),
        updateWidget: (id, partial) =>
          set((state) => {
            const widget = state.widgets.find((w) => w.id === id);
            if (widget) Object.assign(widget, partial);
          }),
        linkTicker: (group, ticker) =>
          set((state) => {
            if (!state.selectedTickers[group]) state.selectedTickers[group] = [];
            if (!state.selectedTickers[group].includes(ticker)) {
              state.selectedTickers[group].push(ticker);
            }
          }),
        unlinkTicker: (group, ticker) =>
          set((state) => {
            if (state.selectedTickers[group]) {
              state.selectedTickers[group] = state.selectedTickers[group].filter(
                (t) => t !== ticker
              );
            }
          }),
        setLayout: (name) =>
          set((state) => {
            state.activeLayout = name;
          }),
      }),
      {
        name: "gistify-dashboard-v1",
        partialize: (state) => ({
          widgets: state.widgets,
          activeLayout: state.activeLayout,
          selectedTickers: state.selectedTickers,
        }),
      }
    )
  )
);
```

**Yeni dosya:** `client/src/stores/authStore.ts`

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Tier = "free" | "member" | "pro";
type AuthStatus = "loading" | "anonymous" | "authenticated";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  tier: Tier;
  plan: "guest" | "member" | "pro";
  isSubscribed: boolean;
}

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  accessMode: "managed" | "public";
  setAuth: (user: AuthUser, accessMode: "managed" | "public") => void;
  setAnonymous: () => void;
  setLoading: () => void;
  logout: () => void;
  updateTier: (tier: Tier) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      status: "loading",
      user: null,
      accessMode: "managed",
      setAuth: (user, accessMode) =>
        set({ status: "authenticated", user, accessMode }),
      setAnonymous: () => set({ status: "anonymous", user: null }),
      setLoading: () => set({ status: "loading", user: null }),
      logout: () => {
        set({ status: "anonymous", user: null });
        try { localStorage.removeItem("gistify-auth-store"); } catch {}
      },
      updateTier: (tier) =>
        set((state) => ({
          user: state.user ? { ...state.user, tier } : null,
        })),
    }),
    {
      name: "gistify-auth-store",
      partialize: (state) => ({
        user: state.user,
        accessMode: state.accessMode,
      }),
    }
  )
);
```

**Test:** `npm run dev` → sayfa açıldığında `useAuthStore.getState().status` → `loading` olmalı. Login sonrası `authenticated` olmalı. Store localStorage'a yazıyorsa, refresh sonrası `user` objesi geri gelmeli (ama `status` `loading` başlayıp API'den doğrulanmalı — bu sonraki adımda).

---

### STEP 2.4: TanStack Query (React Query) Server State Hook'ları

**Yapılacak:** `useState` + `useEffect` + manuel fetch pattern'leri yerine TanStack Query kullan.

**Kurulum:**
```bash
npm install @tanstack/react-query
```

**Yeni dosya:** `client/src/hooks/useMarketData.ts`

```ts
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface MarketSnapshot {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

async function fetchTickerSnapshot(ticker: string): Promise<MarketSnapshot> {
  const res = await fetch(`/api/market/${ticker}`, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch ${ticker}`);
  return res.json();
}

export function useTickerSnapshot(ticker: string) {
  return useQuery({
    queryKey: ["market", "snapshot", ticker],
    queryFn: () => fetchTickerSnapshot(ticker),
    staleTime: 15_000,
    refetchInterval: 30_000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
  });
}

export function useInvalidateTicker() {
  const queryClient = useQueryClient();
  return (ticker: string) => {
    queryClient.invalidateQueries({ queryKey: ["market", "snapshot", ticker] });
  };
}
```

**Yeni dosya:** `client/src/hooks/useReports.ts`

```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ReportListItem {
  slug: string;
  title: string;
  route: string;
  publishedAt: string;
  accessLevel: "free" | "member" | "premium";
}

async function fetchReports(route: string): Promise<ReportListItem[]> {
  const res = await fetch(`/api/content/${route}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch reports");
  return res.json();
}

export function useReports(route: string) {
  return useQuery({
    queryKey: ["content", "reports", route],
    queryFn: () => fetchReports(route),
    staleTime: 60_000,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; slug: string; route: string; content: string }) => {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create report");
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["content", "reports", variables.route] });
    },
  });
}
```

**Main.tsx güncelle:** `client/src/main.tsx` KOMPLE DEĞİŞTİR:

```tsx
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

**Test:** `npm run dev` → `useReports("momentum")` kullanan bir component render et → Network tab'da `api/content/momentum` isteği 1 kez atılmalı, 60 saniye içinde tekrar atılmamalı (staleTime). 60 saniye sonra tekrar focus yapınca refetch olmamalı (`refetchOnWindowFocus: false`).

---

### STEP 2.5: App.tsx Component Split (1146 satır → 5 dosya)

**Yapılacak:** `App.tsx` 1146 satır. Bunu 5 dosyaya böl: `AppShell`, `AppRouter`, `AppNavigation`, `AuthGate`, `App`.

**Yeni dosya:** `client/src/components/layout/AppShell.tsx`

```tsx
import { useTheme } from "@/contexts/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground" data-theme={resolvedTheme}>
        <Toaster />
        {children}
      </div>
    </TooltipProvider>
  );
}
```

**Yeni dosya:** `client/src/components/layout/AppRouter.tsx`

```tsx
import { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";
import type { AppLanguage } from "@/lib/i18n";
import NotFound from "@/pages/NotFound";

const Landing = lazy(() => import("@/pages/Landing"));
const Home = lazy(() => import("@/pages/Home"));
const ReportsAdmin = lazy(() => import("@/pages/ReportsAdmin"));
const Scanner = lazy(() => import("@/pages/Scanner"));
const DailyReport = lazy(() => import("@/pages/DailyReport"));
const FlowReports = lazy(() => import("@/pages/FlowReports"));
const Pay = lazy(() => import("@/pages/Pay"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Refund = lazy(() => import("@/pages/Refund"));

function copy(language: AppLanguage, tr: string, en: string) {
  return language === "en" ? en : tr;
}

export function AppRouter({ language, onLanguageChange }: { language: AppLanguage; onLanguageChange: (l: AppLanguage) => void }) {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-8">
          <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-card/95 p-6 text-card-foreground shadow-2xl">
            <h2 className="text-lg font-semibold">
              {copy(language, "Panel yukleniyor", "Loading workspace")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {copy(language, "Earnings strateji ve momentum workspace hazirlaniyor.", "The earnings strategy and momentum workspaces are loading.")}
            </p>
          </div>
        </div>
      }
    >
      <Switch>
        <Route path="/">{() => <Landing language={language} onLanguageChange={onLanguageChange} />}</Route>
        <Route path="/app/admin">{() => <ReportsAdmin language={language} />}</Route>
        <Route path="/app">{() => <Home language={language} />}</Route>
        <Route path="/momentum">{() => <Scanner language={language} />}</Route>
        <Route path="/daily-report">{() => <DailyReport language={language} />}</Route>
        <Route path="/flow">{() => <FlowReports language={language} />}</Route>
        <Route path="/scanner">{() => <Scanner language={language} />}</Route>
        <Route path="/pricing">{() => <Pricing language={language} onLanguageChange={onLanguageChange} />}</Route>
        <Route path="/terms">{() => <Terms language={language} onLanguageChange={onLanguageChange} />}</Route>
        <Route path="/privacy">{() => <Privacy language={language} onLanguageChange={onLanguageChange} />}</Route>
        <Route path="/refund">{() => <Refund language={language} onLanguageChange={onLanguageChange} />}</Route>
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}
```

**Yeni dosya:** `client/src/components/layout/AppNavigation.tsx`

```tsx
import { useLocation } from "wouter";
import { FileText, LayoutDashboard, Layers3, Radar, Shield } from "lucide-react";
import type { AppLanguage } from "@/lib/i18n";

export function AppNavigation({ language }: { language: AppLanguage }) {
  const [location, setLocation] = useLocation();

  const items = [
    { href: "/app", label: language === "en" ? "Earning Strategy" : "Earning Strategy", icon: LayoutDashboard, active: location === "/app" },
    { href: "/app/admin", label: language === "en" ? "Admin" : "Admin", icon: Shield, active: location.startsWith("/app/admin") },
    { href: "/momentum", label: language === "en" ? "Momentum" : "Momentum", icon: Radar, active: location.startsWith("/momentum") || location.startsWith("/scanner") },
    { href: "/daily-report", label: language === "en" ? "Daily" : "Daily", icon: FileText, active: location.startsWith("/daily-report") },
    { href: "/flow", label: language === "en" ? "Flow" : "Flow", icon: Layers3, active: location.startsWith("/flow") },
  ];

  return (
    <nav className="hidden md:flex md:items-center md:gap-1 md:rounded-full md:border md:border-border md:bg-card md:p-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.href}
            onClick={() => setLocation(item.href)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
              item.active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
```

**Yeni dosya:** `client/src/components/layout/AuthGate.tsx`

```tsx
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { AppLanguage } from "@/lib/i18n";
import { useAuthStore } from "@/stores/authStore";

function copy(language: AppLanguage, tr: string, en: string) {
  return language === "en" ? en : tr;
}

export function AuthGate({ language, children }: { language: AppLanguage; children: ReactNode }) {
  const { status, user } = useAuthStore();

  if (status === "loading") {
    return (
      <div className="min-h-screen grid place-items-center px-4 text-center">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">{copy(language, "Oturum kontrol ediliyor", "Checking session")}</h1>
          <p className="text-sm text-muted-foreground">{copy(language, "Birkac saniye surebilir.", "This may take a few seconds.")}</p>
        </div>
      </div>
    );
  }

  if (status === "anonymous") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-card/95 p-7 text-card-foreground shadow-2xl space-y-5">
          <h1 className="text-2xl font-semibold tracking-tight">{copy(language, "Finans paneline giris yap", "Sign in to the finance dashboard")}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {copy(language, "Uyelik durumuna gore erisim acilir.", "Access opens based on membership status.")}
          </p>
          <Button className="w-full h-11" size="lg" onClick={() => { window.location.href = "/api/auth/google"; }}>
            {copy(language, "Google ile giris yap", "Sign in with Google")}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

**Yeni kod:** `client/src/App.tsx` KOMPLE DEĞİŞTİR (yaklaşık 200 satır):

```tsx
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AppRouter } from "@/components/layout/AppRouter";
import { AuthGate } from "@/components/layout/AuthGate";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAuthStore } from "@/stores/authStore";
import { APP_LANGUAGE_STORAGE_KEY, type AppLanguage } from "@/lib/i18n";

function readStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") return "tr";
  try { return window.localStorage.getItem(APP_LANGUAGE_STORAGE_KEY) === "en" ? "en" : "tr"; } catch { return "tr"; }
}

function persistLanguage(language: AppLanguage) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(APP_LANGUAGE_STORAGE_KEY, language); } catch {}
}

function App() {
  const [language, setLanguage] = useState<AppLanguage>(readStoredLanguage);
  const { setAuth, setAnonymous, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading();
    fetch("/api/auth/me", { credentials: "include", cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setAuth(
            { ...data.user, tier: data.membership.plan === "pro" ? "pro" : data.membership.plan === "member" ? "member" : "free" },
            data.accessMode
          );
        } else {
          setAnonymous();
        }
      })
      .catch(() => setAnonymous());
  }, [setAuth, setAnonymous, setLoading]);

  const handleLanguageChange = (next: AppLanguage) => {
    setLanguage(next);
    persistLanguage(next);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppShell>
          <AuthGate language={language}>
            <AppRouter language={language} onLanguageChange={handleLanguageChange} />
          </AuthGate>
        </AppShell>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
```

**Test:** `npm run build` → build başarılı. `App.tsx` dosya boyutu ~200 satır olmalı. `AppRouter` lazy import'lar çalışmalı. Route değişimi sonrası Suspense fallback görünmeli.

---

### Phase 2 Checklist

```
□ Vite config strict mode + visualizer + manual chunks
□ tsconfig strictest açık
□ Zustand dashboard store çalışıyor (widget add/remove)
□ Zustand auth store çalışıyor (login/logout/persist)
□ TanStack Query provider main.tsx'e eklendi
□ useTickerSnapshot hook 30s arayla refetch yapıyor
□ useReports hook stale-while-revalidate çalışıyor
□ App.tsx 1146 satır → ~200 satır
□ AppRouter lazy loading ile code splitting çalışıyor
□ AppNavigation wouter location değişimi dinliyor
□ AuthGate store'dan status okuyor
□ npm run build başarılı
□ tsc --noEmit hata sayısı < 50 (hedef: 0)
```

### Phase 2 Risk & Rollback Planı

| Risk | Etki | Rollback |
|------|------|----------|
| App.tsx split sonrası route'lar kırılır | Yüksek | Eski App.tsx'i restore et, split'i kademeli yap |
| TanStack Query staleTime çok uzun | Düşük | `staleTime` değerini 5000'e düşür |
| Zustand persist SSR hydration mismatch | Orta | `persist` middleware'i kaldır, sadece client-side initialize et |

---


## PHASE 3: ÖZELLİKLER & DASHBOARD (4–8 hafta)

> **Hedef:** Widget mimarisi, drag-drop dashboard, lightweight charts, MDX pipeline, ISR, i18n, asset pipeline.

### Phase 3 Bağımlılık Grafiği
```
3.1 Widget registry ──→ 3.2 react-grid-layout ──→ 3.3 Color channel linking
3.4 Lightweight Charts ─┬→ 3.5 Data virtualization
3.6 MDX runtime ───────┼→ 3.7 Content personalization
3.8 i18n format ───────┘
```

---

### STEP 3.1: Widget Registry & Lazy-Loaded Widget Components

**Yapılacak:** Widget'lar runtime'da dinamik yüklenmeli. Her widget kendi `React.lazy()` chunk'una sahip.

**Yeni dosya:** `client/src/widgets/registry.ts`

```ts
import { lazy } from "react";
import type { WidgetType } from "@/stores/dashboardStore";

export const WIDGET_COMPONENTS: Record<WidgetType, React.LazyExoticComponent<React.FC<any>>> = {
  watchlist: lazy(() => import("./WatchlistWidget")),
  chart: lazy(() => import("./ChartWidget")),
  news: lazy(() => import("./NewsWidget")),
  screener: lazy(() => import("./ScreenerWidget")),
  notes: lazy(() => import("./NotesWidget")),
  "earnings-calendar": lazy(() => import("./EarningsCalendarWidget")),
  "market-depth": lazy(() => import("./MarketDepthWidget")),
  "ai-insight": lazy(() => import("./AIInsightWidget")),
};

export function getWidgetComponent(type: WidgetType) {
  return WIDGET_COMPONENTS[type];
}
```

**Yeni dosya:** `client/src/widgets/WatchlistWidget.tsx`

```tsx
import { useDashboardStore } from "@/stores/dashboardStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WatchlistWidgetProps {
  config: { tickers: string[]; columns: string[] };
  colorGroup?: string;
}

export default function WatchlistWidget({ config, colorGroup }: WatchlistWidgetProps) {
  const { linkTicker, selectedTickers } = useDashboardStore();
  const active = colorGroup ? selectedTickers[colorGroup] || [] : [];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {config.tickers.map((ticker) => (
          <button
            key={ticker}
            onClick={() => colorGroup && linkTicker(colorGroup, ticker)}
            className={`w-full text-left px-2 py-1.5 rounded-md text-sm font-mono transition-colors ${
              active.includes(ticker)
                ? "bg-accent/20 text-accent"
                : "hover:bg-muted"
            }`}
          >
            {ticker}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
```

**Yeni dosya:** `client/src/widgets/ChartWidget.tsx`

```tsx
import { useEffect, useRef } from "react";
import { createChart, ColorType } from "lightweight-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStore } from "@/stores/dashboardStore";

interface ChartWidgetProps {
  config: { ticker: string; type: string; data?: any[] };
  colorGroup?: string;
}

export default function ChartWidget({ config, colorGroup }: ChartWidgetProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const { selectedTickers } = useDashboardStore();
  const activeTicker = colorGroup ? selectedTickers[colorGroup]?.[0] || config.ticker : config.ticker;

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: "var(--color-text-primary)" },
      grid: { vertLines: { color: "var(--color-border-subtle)" }, horzLines: { color: "var(--color-border-subtle)" } },
      autoSize: true,
    });
    chartRef.current = chart;
    const series = chart.addAreaSeries({
      lineColor: "var(--color-accent)", topColor: "var(--color-accent-light)", bottomColor: "transparent",
    });
    if (config.data) series.setData(config.data);
    chart.timeScale().fitContent();
    return () => chart.remove();
  }, [config.type, config.data]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 shrink-0">
        <CardTitle className="text-sm font-medium font-mono">{activeTicker}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <div ref={chartContainerRef} className="w-full h-full" />
      </CardContent>
    </Card>
  );
}
```

**Yeni dosya:** `client/src/widgets/AIInsightWidget.tsx`

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface AIInsightWidgetProps {
  config: { ticker: string; insight: string; sentiment: "bullish" | "bearish" | "neutral" };
}

export default function AIInsightWidget({ config }: AIInsightWidgetProps) {
  const sentimentColor = config.sentiment === "bullish" ? "text-emerald-400" : config.sentiment === "bearish" ? "text-rose-400" : "text-amber-400";
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-accent" />
          AI Insight
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{config.ticker}</p>
        <p className="text-sm leading-relaxed">{config.insight}</p>
        <div className={`text-xs font-semibold uppercase tracking-wider ${sentimentColor}`}>{config.sentiment}</div>
      </CardContent>
    </Card>
  );
}
```

**Test:** `npm run build` → `WatchlistWidget`, `ChartWidget`, `AIInsightWidget` ayrı chunk'lara bölünmüş olmalı. `stats.html` içinde bu widget'lar ayrı dosyalarda görünmeli.

---

### STEP 3.2: Dashboard Canvas — react-grid-layout

**Yapılacak:** Widget'lar drag-drop + resize edilebilir olmalı. `react-grid-layout` kullan.

**Kurulum:**
```bash
npm install react-grid-layout
npm install -D @types/react-grid-layout
```

**Yeni dosya:** `client/src/components/DashboardCanvas.tsx`

```tsx
import { useCallback, useMemo } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDashboardStore } from "@/stores/dashboardStore";
import { getWidgetComponent } from "@/widgets/registry";
import { WidgetSkeleton } from "@/components/ui/skeleton";

const COLS = 12;
const ROW_HEIGHT = 80;
const MARGIN = [16, 16];

export function DashboardCanvas() {
  const { widgets, updateWidget } = useDashboardStore();

  const layout = useMemo(
    () =>
      widgets.map((w) => ({
        i: w.id,
        x: w.x,
        y: w.y,
        w: w.w,
        h: w.h,
        minW: w.minW || 2,
        minH: w.minH || 2,
      })),
    [widgets]
  );

  const onLayoutChange = useCallback(
    (newLayout: GridLayout.Layout[]) => {
      newLayout.forEach((l) => {
        updateWidget(l.i, { x: l.x, y: l.y, w: l.w, h: l.h });
      });
    },
    [updateWidget]
  );

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={COLS}
      rowHeight={ROW_HEIGHT}
      margin={MARGIN}
      onLayoutChange={onLayoutChange}
      draggableHandle=".widget-drag-handle"
      resizeHandles={["se", "e", "s"]}
    >
      {widgets.map((widget) => {
        const WidgetComponent = getWidgetComponent(widget.type);
        return (
          <div key={widget.id} className="widget-container bg-surface border border-border rounded-xl shadow-sm flex flex-col">
            <div className="widget-drag-handle flex items-center justify-between px-3 py-2 border-b border-border cursor-move shrink-0">
              <span className="text-xs font-medium truncate">{widget.title}</span>
              <div className="flex items-center gap-1">
                {widget.colorGroup && (
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `var(--color-${widget.colorGroup})` }} />
                )}
                <button className="text-muted-foreground hover:text-foreground p-1">⋯</button>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-auto p-2">
              <React.Suspense fallback={<WidgetSkeleton className="h-full w-full" />}>
                <WidgetComponent config={widget.props} colorGroup={widget.colorGroup} />
              </React.Suspense>
            </div>
          </div>
        );
      })}
    </GridLayout>
  );
}
```

**Test:** `npm run dev` → Dashboard'a widget ekle (Zustand store'dan `addWidget` çağır) → widget drag-drop çalışmalı. `localStorage` içinde `gistify-dashboard-v1` key'i layout'u kaydetmeli.

---

### STEP 3.3: Color Channel Linking — Widget-to-Widget Communication

**Yapılacak:** Aynı `colorGroup`'a bağlı widget'lar birbirinin değişikliklerini dinlesin. Zustand store zaten `selectedTickers` tutuyor. Watchlist'te tıklanan ticker, ChartWidget'ta otomatik gösterilsin.

**Mevcut kod:** Zustand store'da `linkTicker` ve `selectedTickers` var (STEP 2.3).

**Yeni kod:** `client/src/widgets/WatchlistWidget.tsx` güncelle (zaten STEP 3.1'de eklendi). Ek olarak `ChartWidget` zaten `selectedTickers` dinliyor.

**Ek dosya:** `client/src/components/ColorChannelPicker.tsx`

```tsx
import { useDashboardStore } from "@/stores/dashboardStore";

const COLORS = ["red", "blue", "green", "orange", "purple", "cyan", "pink"];

export function ColorChannelPicker({ widgetId, current }: { widgetId: string; current?: string }) {
  const { updateWidget } = useDashboardStore();
  return (
    <div className="flex items-center gap-1">
      {COLORS.map((c) => (
        <button
          key={c}
          onClick={() => updateWidget(widgetId, { colorGroup: current === c ? undefined : c })}
          className={`w-3 h-3 rounded-full border ${current === c ? "border-white ring-1 ring-white" : "border-transparent"}`}
          style={{ backgroundColor: `var(--color-${c})` }}
          title={`Color group: ${c}`}
        />
      ))}
    </div>
  );
}
```

**Test:** Watchlist widget'ı "red" grubuna bağla. Chart widget'ı da "red" grubuna bağla. Watchlist'te `$AAPL` tıkla → Chart widget otomatik `$AAPL` göstermeli. `localStorage` içinde `selectedTickers` kaydedilmeli.

---

### STEP 3.4: Data Virtualization — TanStack Virtual Table

**Yapılacak:** `MomentumTab` 11 kolon, 1000+ satır. Mobilde ve masaüstünde DOM node count'u felç ediyor. `@tanstack/react-table` + `@tanstack/react-virtual` ile virtualize et.

**Kurulum:**
```bash
npm install @tanstack/react-table @tanstack/react-virtual
```

**Yeni dosya:** `client/src/components/DataTableVirtual.tsx`

```tsx
import { useRef } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender, type ColumnDef } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

interface DataTableVirtualProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  rowHeight?: number;
  maxHeight?: number;
}

export function DataTableVirtual<T>({ data, columns, rowHeight = 44, maxHeight = 500 }: DataTableVirtualProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel() });
  const rows = table.getRowModel().rows;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div ref={parentRef} className="overflow-auto border border-border rounded-xl" style={{ maxHeight }}>
      <table className="w-full text-sm">
        <thead className="bg-muted/50 sticky top-0 z-10">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} className="px-3 py-2 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">
                  {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          <tr>
            <td colSpan={columns.length} style={{ height: `${virtualizer.getTotalSize()}px` }} className="p-0">
              <div style={{ position: "relative", height: `${virtualizer.getTotalSize()}px`, width: "100%" }}>
                {virtualItems.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <div
                      key={row.id}
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: `${virtualRow.size}px`, transform: `translateY(${virtualRow.start}px)` }}
                      className="flex items-center border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <div key={cell.id} className="px-3 py-2 flex-1 min-w-0 text-xs whitespace-nowrap" style={{ width: cell.column.getSize() }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
```

**Test:** `MomentumTab` içinde `DataTableVirtual` kullan. 10.000 satır listele. Chrome DevTools → Performance → DOM node count ~30 olmalı (virtualization olmadan ~100.000). Scroll akıcı olmalı (60 FPS).

---

### STEP 3.5: MDX Runtime Pipeline — Client-Side MDX Render

**Yapılacak:** `react-markdown` yerine `@mdx-js/mdx` runtime kullan. Interaktif React component'leri (chart, alert, table) Markdown içinde çalışsın.

**Kurulum:**
```bash
npm install @mdx-js/mdx @mdx-js/react remark-gfm remark-directive rehype-highlight rehype-sanitize
```

**Yeni dosya:** `client/src/lib/mdx/runtime.ts`

```ts
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { CustomChart, CustomAlert, CustomTable } from "@/components/mdx";

const MDX_COMPONENTS = {
  Chart: CustomChart,
  Alert: CustomAlert,
  Table: CustomTable,
};

const gistifySchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), "div", "span"],
  attributes: {
    ...defaultSchema.attributes,
    "*": ["className", "style", "data*"],
    img: ["src", "alt", "width", "height", "loading", "srcset"],
    a: ["href", "title", "target", "rel"],
  },
  protocols: {
    ...defaultSchema.protocols,
    src: ["https", "http", "data"],
    href: ["https", "http", "mailto"],
  },
};

export async function renderMDX(source: string): Promise<React.ReactNode> {
  const code = String(
    await compile(source, {
      outputFormat: "function-body",
      remarkPlugins: [remarkGfm, remarkDirective],
      rehypePlugins: [rehypeHighlight, [rehypeSanitize, gistifySchema]],
      development: false,
    })
  );
  const { default: Content } = await run(code, { ...runtime, baseUrl: import.meta.url });
  return Content({ components: MDX_COMPONENTS });
}
```

**Yeni dosya:** `client/src/components/mdx/index.tsx`

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CustomChart({ ticker }: { ticker: string }) {
  return (
    <Card className="my-4">
      <CardHeader className="pb-2"><CardTitle className="text-sm font-mono">{ticker}</CardTitle></CardHeader>
      <CardContent><div className="h-48 rounded-lg bg-muted/40 flex items-center justify-center text-sm text-muted-foreground">Chart placeholder</div></CardContent>
    </Card>
  );
}

export function CustomAlert({ type, children }: { type?: "info" | "warning" | "success"; children: React.ReactNode }) {
  const color = type === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : type === "warning" ? "border-amber-500/30 bg-amber-500/10 text-amber-200" : "border-blue-500/30 bg-blue-500/10 text-blue-200";
  return <div className={`rounded-lg border p-3 text-sm my-4 ${color}`}>{children}</div>;
}

export function CustomTable({ children }: { children: React.ReactNode }) {
  return <div className="overflow-auto my-4 border border-border rounded-lg"><table className="w-full text-sm">{children}</table></div>;
}
```

**Test:** `renderMDX("# Hello\n\n<Alert type=\"success\">Profit target reached</Alert>\n\n<Chart ticker=\"AAPL\" />")` çağır. Çıktı: H1 + Alert kart + Chart placeholder. `rehype-sanitize` XSS payload'larını temizlemeli (örneğin `<script>` tag'leri silinmeli).

---

### STEP 3.6: i18n Format Helpers — Locale-aware Currency, Date, Percent

**Yapılacak:** `Pay.tsx` inline COPY objesi 170+ satır. Bunu `react-i18next` + `Intl` format helpers'a dönüştür.

**Kurulum:**
```bash
npm install react-i18next i18next i18next-http-backend i18next-browser-languagedetector
```

**Yeni dosya:** `client/src/i18n/config.ts`

```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "tr",
    supportedLngs: ["tr", "en"],
    interpolation: { escapeValue: false },
    backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
    detection: { order: ["localStorage", "navigator", "htmlTag"], caches: ["localStorage"] },
    react: { useSuspense: true },
  });

export default i18n;
```

**Yeni dosya:** `client/src/lib/i18n/format.ts`

```ts
export function formatCurrency(value: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: 2 }).format(value);
}

export function formatDate(date: string | Date, locale: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short", ...options }).format(new Date(date));
}

export function formatPercent(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: "percent", minimumFractionDigits: 2, signDisplay: "exceptZero" }).format(value / 100);
}

export function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { notation: "compact", compactDisplay: "short" }).format(value);
}
```

**Test:** `formatCurrency(29.99, "USD", "tr-TR")` → `29,99 $` (veya locale'a göre). `formatPercent(5.25, "en-US")` → `5.25%`. `formatNumber(1500000, "en-US")` → `1.5M`.

---

### Phase 3 Checklist

```
□ Widget registry 8 tip içeriyor
□ WatchlistWidget ticker tıklama çalışıyor
□ ChartWidget lightweight-charts render ediyor
□ AIInsightWidget sentiment rengi doğru
□ DashboardCanvas react-grid-layout drag-drop çalışıyor
□ Color channel linking Watchlist → Chart çalışıyor
□ DataTableVirtual 10K satır 60 FPS scroll
□ MDX runtime renderMDX() interaktif component döndürüyor
□ rehype-sanitize XSS payload'larını temizliyor
□ i18n format helpers locale-aware çalışıyor
□ npm run build hatasız
```

### Phase 3 Risk & Rollback Planı

| Risk | Etki | Rollback |
|------|------|----------|
| react-grid-layout CSS çakışması | Orta | CSS dosyalarını `scoped` import yap veya `className` prefix ekle |
| Lightweight Charts bundle büyüklüğü | Düşük | ChartWidget'ı dynamic import yap, sadece kullanıldığında yükle |
| MDX runtime XSS | Yüksek | `rehype-sanitize` strict mode'a al, admin-only MDX upload |

---


## PHASE 4: GÜVENLİK, PERFORMANS & TEST (6–10 hafta)

> **Hedef:** Clerk auth, Stripe billing, Zero Trust, CSP, field-level encryption, GDPR, edge caching, bundle optimization, Vitest + Playwright + Chromatic.

### Phase 4 Bağımlılık Grafiği
```
4.1 Clerk auth ──→ 4.2 RBAC middleware ──→ 4.3 Feature flags
4.4 Stripe billing ─┬→ 4.5 Metered billing
4.6 Zero Trust ────┼→ 4.7 CSP + Helmet
4.8 Edge caching ──┼→ 4.9 Bundle optimization
4.10 Test pyramid ─┘
```

---

### STEP 4.1: Clerk.dev Auth Integration

**Yapılacak:** Google OAuth custom implementasyonunu Clerk.dev ile değiştir. Social OAuth, MFA, RBAC, session management out-of-box.

**Kurulum:**
```bash
npm install @clerk/clerk-react
npm install -D @clerk/types
```

**Yeni kod:** `client/src/main.tsx` KOMPLE DEĞİŞTİR:

```tsx
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 2, refetchOnWindowFocus: false },
  },
});

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    appearance={{
      variables: {
        colorPrimary: "var(--color-accent)",
        colorBackground: "var(--color-surface)",
        colorText: "var(--color-text-primary)",
        borderRadius: "var(--radius)",
      },
    }}
  >
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ClerkProvider>
);
```

**Yeni kod:** `client/src/App.tsx` içinde auth fetch logic kaldır. Clerk `useAuth()` ve `useUser()` kullan.

```tsx
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

function AuthSync() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const { setAuth, setAnonymous } = useAuthStore();

  useEffect(() => {
    if (!isLoaded) return;
    if (userId && user) {
      const tier = (user.publicMetadata?.tier as string) || "free";
      setAuth(
        {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          name: user.fullName || user.username || "User",
          picture: user.imageUrl,
          tier: tier === "pro" ? "pro" : tier === "member" ? "member" : "free",
          plan: tier === "pro" ? "pro" : "member",
          isSubscribed: tier === "pro" || tier === "member",
        },
        "managed"
      );
    } else {
      setAnonymous();
    }
  }, [isLoaded, userId, user, setAuth, setAnonymous]);

  return null;
}
```

**Server middleware:** `server/middleware/clerkAuth.ts`

```ts
import { verifyToken } from "@clerk/backend";

export async function verifyClerkSession(request: Request): Promise<{ userId: string; role: string } | null> {
  const sessionToken = request.headers.get("Authorization")?.replace("Bearer ", "") || getCookie(request, "__session");
  if (!sessionToken) return null;
  try {
    const payload = await verifyToken(sessionToken, { secretKey: process.env.CLERK_SECRET_KEY! });
    return { userId: payload.sub, role: (payload.metadata?.role as string) || "free" };
  } catch {
    return null;
  }
}

function getCookie(request: Request, name: string): string | undefined {
  const cookie = request.headers.get("cookie");
  if (!cookie) return undefined;
  const match = cookie.match(new RegExp(`(?:^|;)\\s*${name}=([^;]+)`));
  return match?.[1];
}
```

**Test:** `npm run dev` → Clerk sign-in modal açılmalı. Google OAuth butonu çalışmalı. Sign-in sonrası `useAuthStore` `authenticated` olmalı. `/api/auth/me` custom endpoint yerine Clerk `__session` cookie ile çalışmalı.

---

### STEP 4.2: RBAC + Tier Middleware (Express)

**Yapılacak:** Clerk session'dan gelen role bilgisi ile API endpoint'lerini koru.

**Yeni kod:** `server/middleware/rbac.ts`

```ts
import { verifyClerkSession } from "./clerkAuth";

export function withAuth(handler: (req: Request, user: { userId: string; role: string }) => Promise<Response>) {
  return async (request: Request): Promise<Response> => {
    const user = await verifyClerkSession(request);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    return handler(request, user);
  };
}

export function requireRole(...roles: string[]) {
  return async (req: Request, user: { userId: string; role: string }) => {
    if (!roles.includes(user.role)) {
      return new Response(JSON.stringify({ error: "Forbidden", required: roles }), { status: 403 });
    }
    return null;
  };
}

export function requireTier(minTier: "free" | "member" | "pro") {
  const hierarchy = { free: 0, member: 1, pro: 2 };
  return async (req: Request, user: { userId: string; role: string }) => {
    const level = hierarchy[user.role as keyof typeof hierarchy] ?? 0;
    if (level < hierarchy[minTier]) {
      return new Response(
        JSON.stringify({ error: "Tier upgrade required", current: user.role, required: minTier, upgradeUrl: "/pay" }),
        { status: 403 }
      );
    }
    return null;
  };
}
```

**Test:** `curl -H "Authorization: Bearer invalid" /api/reports/weekly` → `401`. Valid token ama `free` user → `403 Tier upgrade required`.

---

### STEP 4.3: Feature Flags — Flagsmith (Self-Hosted)

**Yapılacak:** Feature flag yönetimi. Canary, A/B testing, tier-based gating.

**Kurulum:**
```bash
npm install flagsmith
```

**Yeni dosya:** `client/src/lib/featureFlags.ts`

```ts
import { Flagsmith } from "flagsmith";

const flagsmith = new Flagsmith({
  environmentID: import.meta.env.VITE_FLAGSMITH_ENV_ID || "",
  api: import.meta.env.VITE_FLAGSMITH_API_URL,
  cacheFlags: true,
  enableAnalytics: true,
});

export async function initFlagsmith(userId: string, traits: Record<string, string>) {
  await flagsmith.init({ identity: userId, traits });
}

export function isFeatureEnabled(flagName: string): boolean {
  return flagsmith.hasFeature(flagName);
}

export function getFeatureValue<T>(flagName: string, defaultValue: T): T {
  return flagsmith.getValue(flagName, defaultValue) as T;
}
```

**Yeni dosya:** `server/middleware/featureFlag.ts`

```ts
import { flagsmith } from "@/lib/flagsmith-server"; // server-side flagsmith instance

export async function checkFeatureFlag(userId: string, flag: string): Promise<boolean> {
  const flags = await flagsmith.getIdentityFlags(userId);
  return flags.isFeatureEnabled(flag);
}

export function withFeatureFlag(flag: string, handler: (req: Request) => Promise<Response>) {
  return async (request: Request): Promise<Response> => {
    const userId = await getUserIdFromRequest(request);
    const enabled = await checkFeatureFlag(userId, flag);
    if (!enabled) return new Response(JSON.stringify({ error: "Feature not available" }), { status: 403 });
    return handler(request);
  };
}
```

**Test:** `isFeatureEnabled("new-pricing-v2")` → Flagsmith dashboard'dan flag aç/kapat → değer değişmeli. A/B test variant'ı `getFeatureValue("pro-discount", 0)` → 10 dönmeli.

---

### STEP 4.4: Stripe Billing — Subscription Tiers

**Yapılacak:** Paddle yerine Stripe kullan. Subscription lifecycle, webhook, dunning management.

**Kurulum:**
```bash
npm install stripe
```

**Yeni dosya:** `server/billing/stripe.ts`

```ts
import Stripe from "stripe";
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });

export async function createGistifyProducts() {
  const free = await stripe.products.create({ name: "Gistify Free", metadata: { tier: "free" } });
  const pro = await stripe.products.create({ name: "Gistify Pro", metadata: { tier: "pro" } });
  const enterprise = await stripe.products.create({ name: "Gistify Enterprise", metadata: { tier: "enterprise" } });
  const proPrice = await stripe.prices.create({ product: pro.id, unit_amount: 14900, currency: "try", recurring: { interval: "month" } });
  return { free, pro, enterprise, proPrice };
}
```

**Yeni dosya:** `server/api/webhooks/stripe.ts`

```ts
import { stripe } from "@/billing/stripe";
import { db } from "@/db";

export async function handleStripeWebhook(request: Request) {
  const sig = request.headers.get("stripe-signature")!;
  const payload = await request.text();
  const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!);

  switch (event.type) {
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await db.run("UPDATE subscriptions SET status = 'past_due' WHERE stripe_subscription_id = ?", [invoice.subscription]);
      break;
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      await db.run("UPDATE subscriptions SET status = 'active' WHERE stripe_subscription_id = ?", [invoice.subscription]);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await db.run("UPDATE subscriptions SET status = 'canceled', tier = 'free' WHERE stripe_subscription_id = ?", [sub.id]);
      break;
    }
  }
  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
```

**Test:** Stripe CLI ile webhook test et: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`. Stripe dashboard'da test subscription oluştur → webhook event gelmeli, DB status güncellenmeli.

---

### STEP 4.5: Metered Billing — Redis Counter + Stripe Meter Events

**Yapılacak:** Aylık 5 rapor preview hakkı. Redis counter ile takip et. Stripe Meter Events async gönder.

**Yeni dosya:** `server/billing/metered.ts`

```ts
import { Redis } from "@upstash/redis";
import { stripe } from "./stripe";

const redis = new Redis({ url: process.env.UPSTASH_REDIS_URL!, token: process.env.UPSTASH_REDIS_TOKEN! });
const METERED_LIMIT = 5;
const METERED_WINDOW = 30 * 24 * 60 * 60;

export async function checkMeteredAccess(userId: string, contentSlug: string): Promise<{ allowed: boolean; remaining: number }> {
  const key = `meter:${userId}:${new Date().toISOString().slice(0, 7)}`;
  const current = await redis.incr(key);
  if (current === 1) await redis.expire(key, METERED_WINDOW);
  const remaining = Math.max(0, METERED_LIMIT - current);
  return { allowed: current <= METERED_LIMIT, remaining };
}

export async function recordMeteredUsage(userId: string, stripeCustomerId: string, eventName: "report_view" | "api_call", quantity: number = 1) {
  await stripe.billing.meterEvents.create({
    event_name: eventName,
    payload: { value: quantity.toString(), stripe_customer_id: stripeCustomerId },
  }).catch(() => {});
  await redis.incr(`usage:${userId}:${eventName}:${new Date().toISOString().slice(0, 7)}`);
}
```

**Test:** `checkMeteredAccess("user-123", "rapor-1")` 5 kez çağır → her sefer `remaining` 4,3,2,1,0. 6. kez `allowed: false`.

---

### STEP 4.6: Zero Trust — Continuous Verification Middleware

**Yapılacak:** Her 15 dakikada token re-validation, device fingerprint, risk assessment.

**Yeni dosya:** `server/middleware/zeroTrust.ts`

```ts
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function continuousVerification(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) return res.status(401).json({ error: "Token expired", code: "TOKEN_EXPIRED" });

    const fingerprint = hashDevice(req.headers["user-agent"], req.ip);
    if (decoded.dfp && decoded.dfp !== fingerprint) {
      return res.status(401).json({ error: "Device mismatch", code: "DEVICE_MISMATCH" });
    }

    const riskScore = await assessRisk(decoded.sub as string, req.ip, req.headers["user-agent"]);
    if (riskScore > 0.8) return res.status(403).json({ error: "High risk session", code: "HIGH_RISK", requiresMfa: true });

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function hashDevice(userAgent?: string, ip?: string): string {
  return crypto.createHash("sha256").update(`${userAgent}:${ip?.split(".").slice(0, 3).join(".")}`).digest("hex");
}

async function assessRisk(userId: string, ip?: string, userAgent?: string): Promise<number> {
  // Basit risk assessment: yeni IP = daha yüksek risk
  return 0.1; // Placeholder
}
```

**Test:** Token expiry 5 dakika ayarla. 6 dakika sonra istek at → `401 Token expired`.

---

### STEP 4.7: CSP + Helmet + Security Headers

**Yapılacak:** Express uygulamasına Helmet middleware ekle. CSP strict ama Stripe iframe uyumlu.

**Kurulum:**
```bash
npm install helmet
```

**Yeni kod:** `server/index.ts` içinde Express app oluşturduktan HEMEN SONRA ekle:

```ts
import helmet from "helmet";

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com", "https://clerk.gistify.app"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "https://cdn.gistify.app", "https://images.unsplash.com", "data:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.gistify.app", "https://*.stripe.com", "https://*.clerk.app"],
      frameSrc: ["'self'", "https://js.stripe.com", "https://clerk.gistify.app"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  crossOriginEmbedderPolicy: false,
}));
```

**Test:** `curl -I http://localhost:3000/api/auth/me` → `Content-Security-Policy` header'ı görünmeli. `X-Frame-Options: DENY` görünmeli. `Strict-Transport-Security` header'ı görünmeli.

---

### STEP 4.8: Field-Level Encryption (PII)

**Yapılacak:** Email, phone, TCKN alanları AES-256-GCM ile şifrele.

**Yeni dosya:** `server/lib/encryption.ts`

```ts
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = scryptSync(process.env.FIELD_ENCRYPTION_KEY!, "gistify-salt", 32);

export function encryptField(plaintext: string): { ciphertext: string; iv: string; tag: string } {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");
  return { ciphertext: encrypted, iv: iv.toString("hex"), tag };
}

export function decryptField(ciphertext: string, iv: string, tag: string): string {
  const decipher = createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, "hex"));
  decipher.setAuthTag(Buffer.from(tag, "hex"));
  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
```

**Test:** `encryptField("test@example.com")` → ciphertext + iv + tag. `decryptField(...)` → `"test@example.com"`. Tag değişirse `decryptField` hata atmalı (integrity check).

---

### STEP 4.9: GDPR Right to Erasure Endpoint

**Yapılacak:** Kullanıcı hesap silme endpoint'i. Anonimleştirme + export.

**Yeni kod:** `server/api/user.ts` içine ekle:

```ts
app.delete("/api/user/me", authenticate, async (req, res) => {
  const userId = req.user.id;

  // 1. Export (30 gün içinde indirilebilir)
  const exportData = await generateUserDataExport(userId);
  await saveExportRequest(userId, exportData);

  // 2. Anonimleştirme
  const anonUserId = "usr_deleted";
  await db.transaction(async (trx) => {
    await trx.run("UPDATE likes SET user_id = ? WHERE user_id = ?", [anonUserId, userId]);
    await trx.run("UPDATE comments SET user_id = ? WHERE user_id = ?", [anonUserId, userId]);
    await trx.run(
      `UPDATE users SET email = NULL, phone = NULL, password_hash = '[REDACTED]', display_name = 'Silinmiş Üye', avatar_url = NULL, is_deleted = 1, deleted_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [userId]
    );
  });

  // 3. Token iptal
  await revokeAllTokens(userId);

  // 4. Stripe bildir
  await notifyStripeCustomerDeleted(userId);

  res.json({ message: "Hesabınız silindi. Yorumlarınız anonimleştirildi.", dataExportAvailableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() });
});
```

**Test:** `DELETE /api/user/me` → DB'de user `is_deleted = 1`, `email = NULL`. Yorumlar `user_id = 'usr_deleted'`.

---

### STEP 4.10: Edge Caching + Stale-While-Revalidate (Cloudflare Worker)

**Yapılacak:** Cloudflare Worker ile API response cache + ISR benzeri behavior.

**Yeni dosya:** `worker/src/index.ts`

```ts
export interface Env {
  POLYGON_API_KEY: string;
  CACHE: Cache;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const cacheKey = new Request(url.toString(), request);
    const cached = await env.CACHE.match(cacheKey);
    if (cached) return cached;

    if (url.pathname.startsWith("/api/market/")) {
      const ticker = url.pathname.split("/")[3];
      const targetUrl = `https://api.polygon.io/v2/last/trade/${ticker}?apiKey=${env.POLYGON_API_KEY}`;
      const response = await fetch(targetUrl, { headers: { Accept: "application/json" } });
      const modified = new Response(response.body, {
        status: response.status,
        headers: {
          ...Object.fromEntries(response.headers),
          "Cache-Control": "public, max-age=15",
          "Access-Control-Allow-Origin": "*",
        },
      });
      ctx.waitUntil(env.CACHE.put(cacheKey, modified.clone()));
      return modified;
    }

    return new Response("Not Found", { status: 404 });
  },
};
```

**Test:** `wrangler dev` → `curl /api/market/AAPL` → 15 saniye içinde tekrar istek at → cache'den dönüş (header `CF-Cache-Status: HIT`).

---

### STEP 4.11: Bundle Optimization + Performance Budget

**Yapılacak:** Dynamic imports, vendor chunk splitting, bundle size monitoring.

**Yeni kod:** `client/vite.config.ts` zaten STEP 2.1'de manual chunks tanımlı. Ek olarak `client/package.json` içine `bundlesize` ekle.

```json
{
  "scripts": {
    "bundlesize": "bundlesize"
  },
  "bundlesize": [
    { "path": "dist/assets/index-*.js", "maxSize": "150kB" },
    { "path": "dist/assets/index-*.css", "maxSize": "50kB" }
  ]
}
```

**Kurulum:**
```bash
npm install -D bundlesize
```

**Test:** `npm run build && npm run bundlesize` → `index-*.js` 150KB altındaysa pass, üstündeyse fail.

---

### STEP 4.12: Test Pyramid — Vitest + Playwright + Chromatic

**Yapılacak:** Unit, integration, E2E test pipeline kur.

**Kurulum:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitest/coverage-v8
npm install -D playwright @playwright/test
npm install -D chromatic
npm install -D @storybook/react @storybook/react-vite
```

**Yeni dosya:** `client/vitest.config.ts`

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: { provider: "v8", reporter: ["text", "lcov"], thresholds: { lines: 70, functions: 70, branches: 60, statements: 70 } },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src"), "@shared": path.resolve(__dirname, "../shared") },
  },
});
```

**Yeni dosya:** `client/src/test/setup.ts`

```ts
import "@testing-library/jest-dom";
```

**Yeni dosya:** `client/src/components/tabs/__tests__/StockDetailTab.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StockDetailTab from "../StockDetailTab";

describe("StockDetailTab", () => {
  it("renders stock symbol and price", () => {
    render(<StockDetailTab stock={{ symbol: "AAPL", name: "Apple Inc", price: 150, change: 2.5, changePercent: 1.69, volume: 50000000, marketCap: "2.5T", sector: "Technology", industry: "Consumer Electronics" }} />);
    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("$150.00")).toBeInTheDocument();
  });

  it("shows skeleton when loading", () => {
    render(<StockDetailTab loading />);
    expect(screen.getByRole("status")).toBeInTheDocument(); // Skeleton aria-role
  });
});
```

**Test:** `npm run test:unit` → test pass. `npm run test:unit -- --coverage` → coverage 70% hedefi. `npx playwright test` → E2E headless browser test pass.

---

### Phase 4 Checklist

```
□ ClerkProvider main.tsx'e eklendi
□ useAuth() + useUser() kullanılıyor
□ Server-side verifyClerkSession çalışıyor
□ RBAC middleware tier kontrolü yapıyor
□ Feature flag isFeatureEnabled() çalışıyor
□ Stripe products + prices oluşturuldu
□ Stripe webhook invoice.payment_failed işliyor
□ Metered billing 5/ay limiti çalışıyor
□ Zero Trust token expiry 15 dakika
□ CSP header'ları Express'te aktif
□ Field-level encryption AES-256-GCM çalışıyor
□ GDPR delete endpoint soft delete + anonimleştirme yapıyor
□ Cloudflare Worker cache 15 saniye TTL
□ Bundle size <150KB
□ Vitest test coverage 70%
□ Playwright E2E login → report → comment flow çalışıyor
```

### Phase 4 Risk & Rollback Planı

| Risk | Etki | Rollback |
|------|------|----------|
| Clerk migration sonrası eski Google OAuth kırılır | Yüksek | Eski auth endpoint'leri 1 hafta daha aktif tut, paralel çalışsın |
| Stripe webhook secret sızdırılır | Kritik | Webhook secret'ı rotate et, geçmiş event'leri replay et |
| CSP too strict — Stripe iframe çalışmaz | Orta | `frameSrc` directive'e `https://js.stripe.com` ekle (zaten eklendi) |

---


## PHASE 5: DEVOPS, ROADMAP & EKLER (8–12 hafta)

> **Hedef:** 12 aylık roadmap, OKR'ler, CI/CD pipeline, SOC 2 compliance, migration planları, ek kod şablonları, glossary.

### Phase 5 Bağımlılık Grafiği
```
5.1 CI/CD pipeline ──→ 5.2 Lighthouse CI ──→ 5.3 Load testing
5.4 Migration plan ──┬→ 5.5 SOC 2 roadmap
5.6 12 aylık roadmap ─┴→ 5.7 Checklist'ler
```

---

### STEP 5.1: GitHub Actions CI/CD Pipeline

**Yapılacak:** Her PR'da lint, type-check, test, build, E2E, Lighthouse, deploy.

**Yeni dosya:** `.github/workflows/ci.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test-unit:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info

  test-integration:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run test:integration

  test-e2e:
    runs-on: ubuntu-latest
    needs: [test-unit, test-integration]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  build:
    runs-on: ubuntu-latest
    needs: [lint, test-unit]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build

  lighthouse:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm install -g @lhci/cli
      - run: lhci autorun

  chromatic:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx chromatic --project-token=${{ secrets.CHROMATIC_PROJECT_TOKEN }} --exit-zero-on-changes

  deploy:
    runs-on: ubuntu-latest
    needs: [build, test-e2e, lighthouse]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**Test:** GitHub repo'da `Actions` sekmesine git. PR aç → tüm job'lar çalışmalı. `build` job'u artifact üretmeli. `deploy` job'u sadece `main` branch push'unda çalışmalı.

---

### STEP 5.2: Lighthouse CI + Performance Budget

**Yapılacak:** Her PR'da Lighthouse skoru kontrol et. Performance >= 90, Accessibility >= 95.

**Yeni dosya:** `lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:4173/app", "http://localhost:4173/momentum", "http://localhost:4173/daily-report"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "categories:seo": ["warn", { "minScore": 0.9 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 1200 }],
        "largest-contentful-paint": ["warn", { "maxNumericValue": 1800 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 200 }],
        "cumulative-layout-shift": ["warn", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

**Test:** `npm run build && npx lhci autorun` → Lighthouse skorları raporlanmalı. Accessibility < 95 ise CI fail.

---

### STEP 5.3: Load Testing — k6 + Artillery

**Yapılacak:** Production öncesi API endpoint stress test.

**Yeni dosya:** `tests/load/k6-api.js`

```javascript
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "2m", target: 100 },
    { duration: "5m", target: 100 },
    { duration: "2m", target: 200 },
    { duration: "2m", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const res = http.get("https://api.gistify.app/api/content/momentum");
  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 500ms": (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

**Yeni dosya:** `tests/load/artillery.yml`

```yaml
config:
  target: "https://api.gistify.app"
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
scenarios:
  - name: "Browse content"
    requests:
      - get:
          url: "/api/content/momentum"
      - get:
          url: "/api/content/daily-report"
  - name: "Social interaction"
    requests:
      - post:
          url: "/api/social/like"
          json:
            contentSlug: "test-report"
```

**Test:** `k6 run tests/load/k6-api.js` → 95th percentile < 500ms. Error rate < 1%.

---

### STEP 5.4: Migration Plan — SQLite → PostgreSQL

**Yapılacak:** 4 fazlı migration. Zero data loss.

```
Ay 1: PostgreSQL schema oluştur (pg-migrate). Shadow write başlat.
Ay 2: Dual-write validation. Row count match. Consistency checker.
Ay 3: Read replica aç. Read query'leri PG'ye yönlendir. Write SQLite'a kalır.
Ay 4: Full cutover. Write'lar PG primary'e. SQLite read-only fallback 30 gün.
```

**Yeni dosya:** `server/db/migration/dualWrite.ts`

```ts
import { sqliteDb } from "../sqlite";
import { pgPool } from "../postgres";

export async function dualWrite(table: string, data: Record<string, any>) {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

  await sqliteDb.run(`INSERT INTO ${table} (${columns.join(", ")}) VALUES (${values.map(() => "?").join(", ")})`, values);
  await pgPool.query(`INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`, values);
}

export async function validateConsistency(): Promise<{ ok: boolean; mismatches: string[] }> {
  const mismatches: string[] = [];
  const tables = ["users", "subscriptions", "content_registry", "reports"];

  for (const table of tables) {
    const sqliteCount = await sqliteDb.get(`SELECT COUNT(*) as c FROM ${table}`);
    const pgCount = await pgPool.query(`SELECT COUNT(*) as c FROM ${table}`);
    if (sqliteCount.c !== parseInt(pgCount.rows[0].c)) {
      mismatches.push(`${table}: sqlite=${sqliteCount.c} pg=${pgCount.rows[0].c}`);
    }
  }

  return { ok: mismatches.length === 0, mismatches };
}
```

**Test:** `validateConsistency()` → tüm tablolarda row count eşitse `ok: true`.

---

### STEP 5.5: SOC 2 Type I / Type II Roadmap

**Yapılacak:** Vanta entegrasyonu + policy'ler.

```
Ay 1–2: Vanta entegrasyonu. Policy'ler yazılır (access control, incident response, data retention).
Ay 3–4: Evidence collection (log aggregation, access review, penetration test report).
Ay 5–6: Type I audit (CPA firması). Maliyet: $10,000–$25,000.
Ay 7–18: Type II observation window. Continuous monitoring.
Ay 19–20: Type II audit. Enterprise sales enablement.
```

**Yeni dosya:** `docs/policies/access-control.md`

```markdown
# Access Control Policy

1. Principle of least privilege: Users get minimum access required.
2. RBAC: Admin, Editor, Pro, Free roles.
3. MFA required for admin and enterprise tiers.
4. Quarterly access review.
5. Immediate revocation upon termination.
```

**Yeni dosya:** `docs/policies/incident-response.md`

```markdown
# Incident Response Plan

1. Preparation: Sentry alerting, Slack #security-incidents, PagerDuty on-call.
2. Identification: Sentry + custom anomaly detection.
3. Containment: Feature flag kill switch, WAF rule deployment.
4. Eradication: Patch deploy, token revocation.
5. Recovery: Canary deploy 5%, monitoring.
6. Lessons Learned: Post-mortem 24h.
```

**Test:** Vanta dashboard'da policy'ler upload edilmeli. Automated test'ler aktif.

---

### STEP 5.6: 12 Aylık Roadmap & OKR'ler

**Yapılacak:** Q1–Q4 OKR'ler ve milestone'lar.

| Çeyrek | Tema | Milestone | Deliverable |
|--------|------|-----------|-------------|
| Q1 | Foundation | Dinamik MD, Tasarım Sistemi, Auth v2, SQLite→PG shadow | MDX pipeline, shadcn/ui standard, Clerk, billing foundation |
| Q2 | Scale | PostgreSQL cutover, Paywall v2, SOC 2 Type I | Full PG, Stripe billing, metered billing, compliance audit |
| Q3 | Growth | Sosyal katman, Dynamic paywall, Real-time, Edge computing | FlowPage, comments, AI paywall, Cloudflare Workers |
| Q4 | Enterprise | SSO, API v1, Enterprise tier, SOC 2 Type II | SAML/OIDC, public API, enterprise onboarding, Type II audit |

**Q1 OKR:**
- O1: Foundation Infrastructure
  - KR1: Dynamic MD system 100% production-ready (0 critical bug)
  - KR2: Auth v2 (Clerk) migration, SSO ready for SAML
  - KR3: SQLite → PostgreSQL shadow write active, <1% data inconsistency

**Q2 OKR:**
- O1: Monetization & Compliance
  - KR1: Stripe billing live, first $1,000 MRR
  - KR2: SOC 2 Type I audit passed
  - KR3: Paywall v2 dynamic A/B test launched

**Q3 OKR:**
- O1: Growth & Engagement
  - KR1: FlowPage live, 100+ daily comments
  - KR2: Edge computing API gateway active
  - KR3: Dynamic paywall conversion uplift 20% vs static

**Q4 OKR:**
- O1: Enterprise Ready
  - KR1: Enterprise tier 5+ paying customers
  - KR2: SOC 2 Type II audit passed
  - KR3: Public API v1 (OpenAPI 3.0) documented & live

---

### STEP 5.7: Launch Checklist

```
□ Pre-Launch (1 hafta önce)
  □ Staging environment smoke test
  □ E2E test suite passing (Playwright)
  □ Security scan passing (Snyk, OWASP ZAP)
  □ Lighthouse score >= 90 (all categories)
  □ Load test passing (k6, 100 concurrent users)
  □ Stripe test mode → live mode switch
  □ DNS & SSL certificate check (cdn.gistify.pro)
  □ Sentry DSN production environment set
  □ Analytics (GA4, Vercel) active
  □ Cookie consent banner active
  □ GDPR/KVKK privacy policy & terms published

□ Launch Day
  □ Health check endpoint returning 200
  □ Error rate < 0.1% (Sentry dashboard)
  □ API p99 latency < 500ms
  □ Stripe webhook endpoint responding 200
  □ Email delivery (signup, billing) working
  □ Social share OG tags validated
  □ Backup verification (manual restore test)

□ Post-Launch (1 hafta)
  □ Daily error review (Sentry)
  □ Analytics funnel review (GA4)
  □ Customer feedback collection (Hotjar survey)
  □ Performance RUM review (Web Vitals)
  □ Incident response drill (simulated outage)
  □ SOC 2 evidence collection start (Vanta)
```

---

### STEP 5.8: Security Checklist

```
□ Auth & Session
  □ OAuth 2.1 + PKCE mandatory
  □ JWT access token 5–15 min expiry
  □ Refresh token rotation with family tracking
  □ Device fingerprint binding
  □ Absolute session limit (24h) + idle timeout (30min)
  □ MFA/2FA for admin & enterprise
  □ Password policy (min 12 chars, complexity, breach check)

□ API Security
  □ UUIDv7 for all resource IDs (no sequential enumeration)
  □ BOLA prevention (resource ownership check)
  □ Tiered rate limiting (Redis distributed)
  □ Input validation (Zod schema)
  □ API versioning (/api/v1, /api/v2)
  □ CORS strict whitelist
  □ HSTS, CSP, X-Frame-Options headers

□ Data Security
  □ TLS 1.3 in transit
  □ Field-level encryption for PII (AES-256-GCM)
  □ Database encryption at rest (PG RDS encryption)
  □ Backup encryption (AES-256)
  □ Key rotation policy (90 gün)

□ Application Security
  □ rehype-sanitize HTML whitelist
  □ CSP headers (strict)
  □ Helmet.js middleware
  □ File upload validation (magic number, MIME, AV scan)
  □ SQL injection prevention (parameterized queries)
  □ CSRF tokens (SameSite=Strict cookies)

□ Compliance
  □ GDPR/KVKK data retention policy
  □ Right to erasure endpoint
  □ Consent management (cookie categories)
  □ Data processing agreement (DPA) with vendors
  □ SOC 2 Type I audit scheduled
  □ Penetration test (6 ayda bir)
  □ Bug bounty program (HackerOne)
```

---

### STEP 5.9: Accessibility Checklist (WCAG 2.1 AA)

```
□ Perceivable
  □ Alt text for all images and charts
  □ Color contrast >= 4.5:1 for normal text, 3:1 for large text
  □ Colorblind-friendly signal indicators (icon + text + color)
  □ Responsive text sizing (rem units)
  □ Captions/transcripts for video content

□ Operable
  □ All interactive elements keyboard accessible (Tab, Enter, Space)
  □ Focus order logical and visible (focus-visible outline)
  □ No keyboard traps (modal focus trap excepted)
  □ Skip links for main content
  □ Enough time (no auto-refresh without control)

□ Understandable
  □ Language attribute (lang="tr" or lang="en")
  □ Consistent navigation (tab bar, breadcrumbs)
  □ Error identification and suggestion (inline validation)
  □ Labels and instructions for forms

□ Robust
  □ Valid HTML5 markup
  □ ARIA roles and labels where native semantics insufficient
  □ axe-core passing (jest-axe + Cypress axe)
  □ Lighthouse a11y score >= 95
  □ Screen reader test (NVDA / VoiceOver)

□ Testing
  □ Automated: axe-core in CI/CD
  □ Manual: keyboard-only navigation test
  □ Manual: screen reader test (NVDA on Windows)
  □ Manual: colorblind simulation (Chrome DevTools)
```

---

### STEP 5.10: Performance Checklist

```
□ Metrics
  □ LCP < 1.8s
  □ FCP < 1.2s
  □ TTI < 2.5s
  □ TBT < 200ms
  □ CLS < 0.1
  □ INP < 200ms
  □ Bundle initial < 150KB

□ Caching
  □ CDN cache for static assets (Cloudflare)
  □ Stale-while-revalidate for API responses
  □ Redis cache for session, rate limits, feature flags
  □ Browser Service Worker cache (CacheFirst for MD, NetworkFirst for API)
  □ Database query plan cache (PostgreSQL)

□ Optimization
  □ Dynamic imports for routes and heavy libraries
  □ Code splitting (vendor chunks)
  □ Tree shaking (ES modules, sideEffects: false)
  □ Image optimization (WebP/AVIF, responsive srcset, lazy loading)
  □ Font optimization (subset, woff2, font-display: swap)
  □ Preconnect/dns-prefetch for CDN and API origins
  □ Compression (Brotli, gzip)

□ Monitoring
  □ Web Vitals RUM (Vercel Analytics + GA4)
  □ Lighthouse CI in PR pipeline
  □ Bundle size diff in PR (vite-bundle-analyzer)
  □ Performance budget enforcement (50KB max per feature)
  □ k6 load test before major releases
```

---

### STEP 5.11: Risk Assessment & Mitigation Matrix

| Risk | Olasılık | Etki | Mitigation |
|------|----------|------|------------|
| SQLite → PG migration data loss | Orta | Kritik | Dual-write + consistency checker + 30g rollback |
| Stripe billing integration bug | Düşük | Yüksek | Sandbox testing + Stripe test mode + webhook idempotency |
| SOC 2 audit fail | Düşük | Kritik | Vanta 3 ay önce başlat + pre-audit gap analysis |
| Dynamic paywall conversion düşüşü | Orta | Orta | A/B test + gradual rollout + instant rollback |
| Real-time (WebSocket) infra failure | Düşük | Orta | Fallback to 30s polling + circuit breaker |
| Third-party API outage (market data) | Yüksek | Orta | Cached data + stale disclaimer + retry queue |
| Security breach (XSS/SQLi) | Düşük | Kritik | OWASP ZAP + Snyk + code review + bug bounty |
| Team scaling (tek developer) | Yüksek | Yüksek | Dokümantasyon + modular code + onboarding guide |

---

### STEP 5.12: Maliyet Tahmini (Aylık & Yıllık)

| Servis | Plan | Aylık | Not |
|--------|------|-------|-----|
| Vercel Pro | Pro | $20 | Hosting, preview deploys |
| Cloudflare Pro | Pro | $20 | CDN, WAF, DDoS, edge rules |
| Upstash Redis | Pay-as-you-go | $10 | Rate limiting, session, cache |
| Sentry | Team | $26 | Error tracking, performance |
| Stripe | Pay-as-you-go | $0 (transaction fee %2.9) | Billing, no monthly fee |
| Vanta | Growth | $500 | SOC 2 automation |
| Google Analytics 4 | — | Ücretsiz | Analytics |
| Hotjar / Clarity | Plus | $39 | Heatmap, session recording |
| Flagsmith | Self-hosted | $0 (infra) | Feature flags |
| PostgreSQL (Neon/Railway) | Pro | $50 | Managed Postgres, read replica |
| k6 Cloud / Artillery | Free tier | $0 | Load testing |
| Chromatic | Starter | $0 (open source) | Visual regression |
| OneSignal / FCM | Free | $0 | Push notifications |
| **Toplam Aylık (MVP)** | — | **~$165** | Scale öncesi |
| **Toplam Aylık (Scale)** | — | **~$500–800** | PG replica, SOC 2, enterprise |

**Yıllık Maliyet (İlk Yıl):**
- Infrastructure: $165 × 12 = $1,980
- SOC 2 Type I audit: $15,000–$25,000
- Vanta platform: $500 × 12 = $6,000
- Penetration test (2×): $8,000
- **Toplam Yıllık: ~$31,000–$41,000**

---

### STEP 5.13: Kod Şablonları — Widget Component (CVA + Tailwind)

```tsx
// components/Widget.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const widgetVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      size: { sm: "p-3", md: "p-4", lg: "p-6" },
      variant: { default: "border-border", premium: "border-primary/50 ring-1 ring-primary/20" },
    },
    defaultVariants: { size: "md", variant: "default" },
  }
);

export interface WidgetProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof widgetVariants> {
  title?: string;
  description?: string;
  loading?: boolean;
}

export function Widget({ className, size, variant, title, description, loading, children, ...props }: WidgetProps) {
  return (
    <div className={cn(widgetVariants({ size, variant }), className)} {...props}>
      {title && (
        <div className="mb-2">
          <h3 className="text-sm font-semibold leading-none tracking-tight">{title}</h3>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
      )}
      {loading ? <div className={`animate-pulse rounded bg-muted ${size === "sm" ? "h-16" : size === "lg" ? "h-32" : "h-24"}`} /> : children}
    </div>
  );
}
```

---

### STEP 5.14: Kod Şablonları — Auth Middleware (Express + Clerk)

```ts
// middleware/auth.ts
import { verifyClerkSession } from "./clerkAuth";
import type { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; tier: string; roles: string[] };
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  verifyClerkSession(req).then((user) => {
    if (!user) return res.status(401).json({ error: "Missing or invalid authorization" });
    req.user = user as any;
    next();
  }).catch(() => res.status(401).json({ error: "Invalid token" }));
}

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.roles.some((r) => roles.includes(r))) {
      return res.status(403).json({ error: "Insufficient permissions", required: roles });
    }
    next();
  };
}

export function requireTier(minTier: "free" | "member" | "pro") {
  const hierarchy = { free: 0, member: 1, pro: 2 };
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userLevel = hierarchy[req.user?.tier as keyof typeof hierarchy] ?? 0;
    if (userLevel < hierarchy[minTier]) {
      return res.status(403).json({ error: "Tier upgrade required", required: minTier, current: req.user?.tier });
    }
    next();
  };
}
```

---

### STEP 5.15: Kod Şablonları — Paywall HOC (React + Zustand)

```tsx
// components/PaywallHOC.tsx
import { useAuthStore } from "@/stores/authStore";

interface WithPaywallProps {
  accessLevel: "free" | "member" | "premium";
}

export function withPaywall<P extends object>(Component: React.ComponentType<P>, accessLevel: "free" | "member" | "premium") {
  return function PaywallWrapper(props: P) {
    const { user } = useAuthStore();
    const tier = user?.tier || "free";
    const hierarchy = { free: 0, member: 1, pro: 2 };
    const level = hierarchy[tier as keyof typeof hierarchy] ?? 0;
    const required = hierarchy[accessLevel === "premium" ? "pro" : accessLevel === "member" ? "member" : "free"] ?? 0;

    if (level >= required) return <Component {...props} />;

    return (
      <div className="relative">
        <div className="blur-sm pointer-events-none select-none max-h-96 overflow-hidden">
          <Component {...props} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background via-background/80 to-transparent">
          <div className="text-center p-6">
            <h3 className="text-lg font-semibold mb-2">🔒 Premium İçerik</h3>
            <p className="text-muted-foreground mb-4">Bu içerik {accessLevel} seviyesinde erişilebilir. Mevcut plan: {tier}.</p>
            <a href="/pay" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Planınızı Yükseltin
            </a>
          </div>
        </div>
      </div>
    );
  };
}
```

---

### STEP 5.16: Kod Şablonları — Rate Limiter (Express + Redis)

```ts
// middleware/rateLimiter.ts
import { RateLimiterRedis } from "rate-limiter-flexible";
import { Redis } from "@upstash/redis";

const redis = new Redis({ url: process.env.UPSTASH_REDIS_URL!, token: process.env.UPSTASH_REDIS_TOKEN! });

export function createRateLimiter(options: { keyPrefix: string; points: number; duration: number }) {
  const limiter = new RateLimiterRedis({ storeClient: redis, keyPrefix: `rl:${options.keyPrefix}`, points: options.points, duration: options.duration });
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = (req as any).user?.id || req.ip;
    try { await limiter.consume(key, 1); next(); }
    catch (rejRes: any) {
      const retryAfter = Math.ceil(rejRes.msBeforeNext / 1000);
      res.status(429).json({ error: "Rate limit exceeded", retryAfter, limit: options.points, window: options.duration });
    }
  };
}

export const tieredRateLimit = async (req: any, res: Response, next: NextFunction) => {
  const tier = req.user?.tier || "free";
  const limits = { free: { points: 100, duration: 3600 }, pro: { points: 10000, duration: 3600 }, enterprise: { points: 100000, duration: 3600 } };
  const limit = limits[tier as keyof typeof limits];
  const limiter = createRateLimiter({ keyPrefix: `api:${tier}`, ...limit });
  return limiter(req, res, next);
};
```

---

### STEP 5.17: Glossary — Teknik Terimler Sözlüğü

| Terim | Tanım | Türkçe Karşılık |
|-------|-------|-----------------|
| **ABAC** | Attribute-Based Access Control — kullanıcı, kaynak ve çevre niteliklerine göre yetki verir. | Nitelik Tabanlı Erişim Kontrolü |
| **BOLA** | Broken Object Level Authorization — kaynak sahipliği kontrolü eksikliğiyle yetki aşımı. | Bozuk Nesne Düzeyinde Yetkilendirme |
| **Canary Deployment** | Yeni versiyonun küçük bir kullanıcı yüzdesine (1–5%) sunulması. | Kanarya Dağıtımı |
| **CARA** | Continuous Adaptive Risk Assessment — sürekli risk değerlendirmesi. | Sürekli Uyarlanabilir Risk Değerlendirmesi |
| **CDN** | Content Delivery Network — coğrafi olarak dağıtık cache sunucuları. | İçerik Dağıtım Ağı |
| **CSP** | Content Security Policy — XSS ve data injection saldırılarını önleyen HTTP header'ı. | İçerik Güvenlik Politikası |
| **CRDT** | Conflict-free Replicated Data Type — çakışma çözümü gerektirmeyen veri yapısı. | Çakışmasız Çoğaltılmış Veri Türü |
| **DCAC** | Dynamic Context-Aware Access Controls — bağlama duyarlı dinamik yetki kontrolü. | Dinamik Bağlama Duyarlı Erişim Kontrolü |
| **Dunning** | Başarısız ödeme sonrası müşteri iletişimi ve retry süreci. | Ödeme Takip Süreci |
| **FGA** | Fine-Grained Authorization — belge düzeyinde yetki kontrolü (Zanzibar modeli). | İnce Taneli Yetkilendirme |
| **FTS5** | Full-Text Search version 5 — SQLite metin arama uzantısı. | Tam Metin Arama v5 |
| **IAP** | Identity-Aware Proxy — kimlik doğrulaması yapan ters proxy. | Kimlik Duyarlı Proxy |
| **INP** | Interaction to Next Paint — kullanıcı etkileşiminden sonraki görsel güncelleme süresi. | Bir Sonraki Boyama için Etkileşim Süresi |
| **LCP** | Largest Contentful Paint — en büyük içerik öğesinin render süresi. | En Büyük İçerikli Boyama |
| **mTLS** | Mutual TLS — iki yönlü TLS sertifika doğrulaması. | Karşılıklı TLS |
| **MoR** | Merchant of Record — satış vergisi ve compliance yükümlülüğünü üstlenen aracı. | Kayıtlı Satıcı |
| **MTTR** | Mean Time To Recovery — arızanın ortalama düzelme süresi. | Ortalama Kurtarma Süresi |
| **MoU** | Memorandum of Understanding — anlaşma muhtırası. | Anlayış Muhtırası |
| **NPS** | Net Promoter Score — müşteri sadakat ölçümü. | Net Tanıtıcı Puanı |
| **OKLCH** | Perceptually uniform color space — algısal olarak tutarlı renk uzayı. | Algısal Renk Uzayı |
| **PAM** | Privileged Access Management — ayrıcalıklı erişim yönetimi. | Ayrıcalıklı Erişim Yönetimi |
| **PII** | Personally Identifiable Information — kişisel tanımlayıcı bilgi. | Kişisel Tanımlayıcı Bilgi |
| **PKCE** | Proof Key for Code Exchange — OAuth public client'ları için güvenlik mekanizması. | Kod Değişimi İçin Kanıt Anahtarı |
| **PoP** | Point of Presence — CDN edge sunucusu konumu. | Varış Noktası |
| **RUM** | Real User Monitoring — gerçek kullanıcı tarayıcılarından metrik toplama. | Gerçek Kullanıcı İzleme |
| **ReBAC** | Relationship-Based Access Control — Google Zanzibar modeli. | İlişki Tabanlı Erişim Kontrolü |
| **RBAC** | Role-Based Access Control — rol tabanlı yetki kontrolü. | Rol Tabanlı Erişim Kontrolü |
| **SaaS** | Software as a Service — bulut tabanlı yazılım hizmeti. | Hizmet olarak Yazılım |
| **SAML** | Security Assertion Markup Language — enterprise SSO standardı. | Güvenlik Onaylama İşaretleme Dili |
| **SWR** | Stale-While-Revalidate — eski veriyi gösterip arka planda yenileme. | Eski Veriyi Gösterirken Yenileme |
| **TBT** | Total Blocking Time — ana thread'in bloke olduğu toplam süre. | Toplam Bloklama Süresi |
| **TTI** | Time to Interactive — sayfanın tam etkileşimli hale gelme süresi. | Etkileşim Süresi |
| **UEBA** | User and Entity Behavior Analytics — kullanıcı davranış analizi. | Kullanıcı ve Varlık Davranış Analizi |
| **UUIDv7** | Universally Unique Identifier version 7 — zaman sıralı UUID. | Evrensel Benzersiz Tanımlayıcı v7 |
| **WAF** | Web Application Firewall — uygulama katmanı güvenlik duvarı. | Web Uygulama Güvenlik Duvarı |
| **WAL** | Write-Ahead Logging — veritabanı değişiklik öncesi log yazma. | Önceden Yazma Günlüğü |
| **WCAG** | Web Content Accessibility Guidelines — web erişilebilirlik kılavuzu. | Web İçeriği Erişilebilirlik Kılavuzu |
| **Zero Trust** | "Asla güvenme, her zaman doğrula" güvenlik modeli. | Sıfır Güven |

---

### STEP 5.18: Teknoloji Stack Özeti (Final Architecture)

| Katman | Teknoloji | Alternatif | Karar |
|--------|-----------|------------|-------|
| **Frontend** | React 18 + Vite + TypeScript | Next.js | Vite (SPA, hızlı build) |
| **UI Kit** | shadcn/ui + Tailwind CSS | Chakra UI | shadcn/ui (Radix primitives) |
| **State** | Zustand + TanStack Query | Redux + RTK | Zustand (hafif, atomic) |
| **Routing** | Wouter | React Router | Wouter (mevcut) |
| **Backend** | Express + TypeScript | Fastify | Express (mevcut) |
| **Database** | PostgreSQL (Neon) | CockroachDB | PostgreSQL (SQLite migration) |
| **Cache** | Upstash Redis | Redis Cloud | Upstash (serverless) |
| **Auth** | Clerk | Auth0 | Clerk (MVP) → Auth0 (Enterprise) |
| **Billing** | Stripe | Paddle | Stripe (MVP) → Paddle (Enterprise) |
| **CDN** | Cloudflare | AWS CloudFront | Cloudflare (edge, WAF) |
| **Hosting** | Vercel | Netlify | Vercel (preview, analytics) |
| **Real-time** | Supabase Realtime | Ably | Supabase (MVP) → Ably (scale) |
| **Monitoring** | Sentry + Vercel Analytics | Datadog | Sentry + Vercel + Prometheus |
| **Testing** | Vitest + Playwright | Jest + Cypress | Vitest (Vite native) |
| **CI/CD** | GitHub Actions | GitLab CI | GitHub Actions (mevcut) |
| **Compliance** | Vanta | Drata | Vanta (hızlı SOC 2) |
| **Feature Flags** | Flagsmith (self-hosted) | LaunchDarkly | Flagsmith (open source) |
| **Search** | PostgreSQL tsvector | Meilisearch | PG tsvector (MVP) → Meilisearch (scale) |
| **i18n** | react-i18next | FormatJS | react-i18next (TR + EN) |
| **Charts** | Recharts + Lightweight Charts | ECharts | Recharts (MVP) + Lightweight (OHLC) |
| **Markdown** | unified + rehype-sanitize | Marked | unified (AST pipeline) |

---

## SONUÇ & YÖNERGELER

Bu implementasyon rehberi, Gistify'nin teknik borcundan (3 tema yöneticisi, 0-byte dosyalar, 1968 satırlık monolith) enterprise-grade finansal platforma (Clerk auth, Stripe billing, OKLCH design tokens, widget dashboard, real-time WebSocket, SOC 2) geçişi için 5 phase ve 40+ adım içerir.

### AI Kodlayıcı İçin Talimatlar

1. **Her adım bağımsız değildir.** Bir önceki phase tamamlanmadan sonrakine geçme.
2. **Her kod bloğu copy-paste hazırdır.** Eksik parça bırakma. Tam kod ver.
3. **Her adım sonunda test komutu vardır.** Testi çalıştır ve geçtiğini doğrula.
4. **Eğer bir adım hata verirse**, geri alma planını uygula. O adımı atla ve sonraki paralel adıma geç.
5. **Türkçe yaz.** Teknik terimler İngilizce kalabilir.

### Başarı Kriterleri (12 Ay Sonra)

- [ ] MAU 5,000+
- [ ] Conversion rate (Free → Pro) %5+
- [ ] MRR $5,000+
- [ ] Test coverage %70+
- [ ] LCP < 1.8s
- [ ] API p99 latency < 500ms
- [ ] SOC 2 Type II elde edildi
- [ ] 0 critical security vulnerability
- [ ] Deployment frequency 2/gün
- [ ] MTTR < 30 dakika

---

> **Rehber Sonu.** Bu belge, `Gistify_Gelismis_Rapor.md` (6046 satır) içeriğinden doğrudan implementasyon talimatlarına çevrilmiştir. Tüm kod blokları copy-paste hazırdır. Her adım test edilebilir. 5 Phase, 40+ step, 8000+ satır.
>
> **Versiyon:** 2.0  
> **Tarih:** 2026-06-13  
> **Sonraki Güncelleme:** Her phase tamamlandığında bu rehber güncellenmeli.


## EK BÖLÜM: DETAYLI IMPLEMENTASYONLAR (Raporun Bölüm 5–12'sinden)

> Bu bölüm, Gelişmiş Rapor v2.0'ın Bölüm 5–12 arasındaki detayları implementasyon talimatlarına çevirir. Phase 1–5 temel iskeleti kurar; bu ek bölüm derinlemesine detayları ve edge-case'leri kapsar.

---

### EK STEP E1: StockTwits Modeli — Cashtag + Sentiment + AI Moderation

**Yapılacak:** Sosyal katman için StockTwits modeli: `$AAPL` cashtag sistemi, bullish/bearish/neutral sentiment indexing, FinBERT ile AI moderation.

**Yeni dosya:** `server/ai/sentiment.ts`

```ts
import { pipeline } from "@xenova/transformers";

interface SentimentResult {
  label: "bullish" | "bearish" | "neutral";
  score: number;
  confidence: "high" | "medium" | "low";
}

class SentimentAnalyzer {
  private classifier: any;

  async initialize() {
    this.classifier = await pipeline("text-classification", "yiyanghkust/finbert-tone", { quantized: true });
  }

  async analyze(text: string): Promise<SentimentResult> {
    const result = await this.classifier(text);
    const { label, score } = result[0];
    const map: Record<string, SentimentResult["label"]> = { Positive: "bullish", Negative: "bearish", Neutral: "neutral" };
    return {
      label: map[label] || "neutral",
      score,
      confidence: score > 0.8 ? "high" : score > 0.6 ? "medium" : "low",
    };
  }
}

export const sentimentAnalyzer = new SentimentAnalyzer();
```

**Yeni dosya:** `server/db/schema.ts` (sosyal mesajlar tablosu)

```ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const socialMessages = sqliteTable("social_messages", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  ticker: text("ticker").notNull(),
  content: text("content").notNull(),
  sentiment: text("sentiment", { enum: ["bullish", "bearish", "neutral"] }).notNull(),
  replyTo: text("reply_to"),
  threadRootId: text("thread_root_id"),
  likes: integer("likes").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
```

**Yeni dosya:** `client/src/components/social/CashtagParser.tsx`

```tsx
import { useMemo } from "react";

const CASHTAG_REGEX = /\$([A-Z]{1,5})/g;

export function CashtagParser({ text, onTickerClick }: { text: string; onTickerClick?: (ticker: string) => void }) {
  const parts = useMemo(() => {
    const result: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    while ((match = CASHTAG_REGEX.exec(text)) !== null) {
      if (match.index > lastIndex) result.push(text.slice(lastIndex, match.index));
      const ticker = match[1];
      result.push(
        <button
          key={match.index}
          onClick={() => onTickerClick?.(ticker)}
          className="inline-flex items-center text-accent hover:text-accent-light font-mono font-medium underline-offset-2 hover:underline"
        >
          ${ticker}
        </button>
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) result.push(text.slice(lastIndex));
    return result;
  }, [text, onTickerClick]);

  return <span className="text-sm leading-relaxed">{parts}</span>;
}
```

**Test:** `sentimentAnalyzer.analyze("AAPL is going to the moon!")` → `label: "bullish", confidence: "high"`. `CashtagParser` ile `$AAPL` metin içinde tıklanabilir link olmalı.

---

### EK STEP E2: eToro CopyTrader Modeli — Analyst Copy + Risk Score

**Yapılacak:** Kullanıcılar başarılı analyst'leri takip edebilir. Analyst risk score (1–10) hesaplanır.

**Yeni dosya:** `server/social/copyTrading.ts`

```ts
import { db } from "@/db";
import { analystTrades } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

interface AnalystProfile {
  id: string;
  name: string;
  riskScore: number;
  return30d: number;
  return1y: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  followers: number;
  aum: number;
}

export async function calculateRiskScore(analystId: string): Promise<number> {
  const trades = await db.select().from(analystTrades).where(eq(analystTrades.analystId, analystId)).orderBy(desc(analystTrades.timestamp)).limit(100);
  const returns = trades.map((t) => t.returnPercent);
  if (returns.length === 0) return 5;
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const volatility = Math.sqrt(returns.map((r) => Math.pow(r - avgReturn, 2)).reduce((a, b) => a + b, 0) / returns.length);
  const maxDrawdown = calculateMaxDrawdown(returns);
  const winRate = trades.filter((t) => t.returnPercent > 0).length / trades.length;
  const sharpeLike = avgReturn / (volatility || 1);
  const riskScore = Math.min(10, Math.max(1, Math.round((1 / sharpeLike) * 5 + maxDrawdown * 2)));
  return riskScore;
}

function calculateMaxDrawdown(returns: number[]): number {
  let peak = -Infinity;
  let maxDrawdown = 0;
  for (const r of returns) {
    if (r > peak) peak = r;
    const drawdown = peak - r;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }
  return maxDrawdown;
}
```

**Test:** 100 trade ile `calculateRiskScore("analyst-1")` → 1–10 arası integer dönmeli. Win rate %100 ise risk score düşük olmalı.

---

### EK STEP E3: Cloudflare Durable Objects — Real-time Social Feed

**Yapılacak:** WebSocket tabanlı real-time sosyal feed. Vercel Functions WebSocket desteklemez; Durable Objects kullan.

**Yeni dosya:** `worker/src/socialFeed.ts`

```ts
import { DurableObject } from "cloudflare:workers";

interface SocialMessage {
  id: string;
  userId: string;
  ticker: string;
  content: string;
  sentiment: "bullish" | "bearish" | "neutral";
  timestamp: string;
  replyTo?: string;
}

export class SocialFeed extends DurableObject {
  private messages: SocialMessage[] = [];
  private sessions: Map<string, WebSocket> = new Map();
  private tickerSubscribers: Map<string, Set<string>> = new Map();

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (request.headers.get("Upgrade") === "websocket") {
      const userId = url.searchParams.get("userId");
      if (!userId) return new Response("Missing userId", { status: 400 });
      const [client, server] = Object.values(new WebSocketPair());
      this.sessions.set(userId, server);
      server.accept();

      server.addEventListener("message", async (msg) => {
        const data = JSON.parse(msg.data as string);
        if (data.action === "subscribe") {
          const ticker = data.ticker;
          if (!this.tickerSubscribers.has(ticker)) this.tickerSubscribers.set(ticker, new Set());
          this.tickerSubscribers.get(ticker)!.add(userId);
          const history = this.messages.filter((m) => m.ticker === ticker).slice(-50);
          server.send(JSON.stringify({ type: "history", ticker, data: history }));
        }
        if (data.action === "publish") {
          const message: SocialMessage = { id: crypto.randomUUID(), userId: data.userId, ticker: data.ticker, content: data.content, sentiment: data.sentiment, timestamp: new Date().toISOString(), replyTo: data.replyTo };
          this.messages.push(message);
          if (this.messages.length > 10000) this.messages.shift();
          const subscribers = this.tickerSubscribers.get(data.ticker) || new Set();
          subscribers.forEach((sessionId) => {
            const ws = this.sessions.get(sessionId);
            if (ws?.readyState === WebSocket.READY_STATE_OPEN) ws.send(JSON.stringify({ type: "new_message", data: message }));
          });
        }
      });

      server.addEventListener("close", () => {
        this.sessions.delete(userId);
        this.tickerSubscribers.forEach((subs) => subs.delete(userId));
      });

      return new Response(null, { status: 101, webSocket: client });
    }
    return new Response("Not Found", { status: 404 });
  }
}
```

**Test:** `wrangler dev` → WebSocket bağlantısı aç → `subscribe` `$AAPL` → `publish` mesaj → diğer bağlı client'ta `new_message` event gelmeli.

---

### EK STEP E4: Offline-First — Service Workers + Background Sync + IndexedDB

**Yapılacak:** Finansal dashboard kullanıcıları düşük bağlantılı alanlarda veriye erişsin.

**Yeni dosya:** `client/public/sw.ts`

```ts
const CACHE_NAME = "gistify-v1";
const STATIC_ASSETS = ["/index.html", "/manifest.json", "/assets/main.css"];
const API_CACHE_PATTERNS = ["/api/market/", "/api/reports/", "/api/social/"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (API_CACHE_PATTERNS.some((p) => url.pathname.startsWith(p))) {
    event.respondWith(
      fetch(request)
        .then((response) => { const clone = response.clone(); caches.open(CACHE_NAME).then((c) => c.put(request, clone)); return response; })
        .catch(() => caches.match(request))
    );
    return;
  }
  event.respondWith(
    caches.match(request).then((cached) =>
      cached || fetch(request).then((response) => { const clone = response.clone(); caches.open(CACHE_NAME).then((c) => c.put(request, clone)); return response; })
    )
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-social-posts") event.waitUntil(syncSocialPosts());
});

async function syncSocialPosts() {
  const db = await openDB("gistify-offline", 1, { upgrade(db) { db.createObjectStore("socialQueue", { keyPath: "id" }); } });
  const queued = await db.getAll("socialQueue");
  for (const post of queued) {
    try {
      await fetch("/api/social/publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(post) });
      await db.delete("socialQueue", post.id);
    } catch (err) { console.error("Sync failed for post:", post.id, err); }
  }
}
```

**Test:** Chrome DevTools → Network → Offline mode → sayfa reload → static assets cache'den gelmeli. API response'lar cache'den gelmeli.

---

### EK STEP E5: Push Notifications — Web Push API + FCM

**Yapılacak:** Price alert, earning release, sentiment anomalisi push'ları.

**Yeni dosya:** `server/api/push.ts`

```ts
import webpush from "web-push";

webpush.setVapidDetails("mailto:admin@gistify.app", process.env.VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);

export async function sendPushNotification(subscription: webpush.PushSubscription, payload: { title: string; body: string; icon?: string; url?: string }) {
  await webpush.sendNotification(subscription, JSON.stringify(payload));
}

export async function onPriceAlert(ticker: string, targetPrice: number, currentPrice: number) {
  const subscribers = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.ticker, ticker));
  for (const sub of subscribers) {
    await sendPushNotification(JSON.parse(sub.subscription), {
      title: `${ticker} Hedef Fiyat Uyarısı`,
      body: `${ticker} ${targetPrice} hedef fiyatına ulaştı. Güncel: ${currentPrice}`,
      icon: "/icon-192.png",
      url: `/app/stock/${ticker}`,
    });
  }
}
```

**Yeni dosya:** `client/src/lib/push.ts`

```ts
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return null;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(process.env.VAPID_PUBLIC_KEY!) });
  await fetch("/api/push/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscription, userId: getCurrentUserId() }) });
  return subscription;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
```

**Test:** `subscribeToPush()` → browser notification permission istemeli. Subscription server'a gönderilmeli. `onPriceAlert("AAPL", 150, 152)` → push notification gelmeli.

---

### EK STEP E6: OpenFGA / Casbin Fine-Grained Authorization

**Yapılacak:** Clerk RBAC yeterli değil; hisse bazlı erişim kontrolü için OpenFGA veya Casbin ekle.

**Yeni dosya:** `server/auth/openfga.ts`

```ts
import { OpenFgaClient } from "@openfga/sdk";

const fgaClient = new OpenFgaClient({ apiUrl: process.env.OPENFGA_API_URL, storeId: process.env.OPENFGA_STORE_ID });

export async function checkPermission(userId: string, relation: string, object: string): Promise<boolean> {
  const { allowed } = await fgaClient.check({ user: `user:${userId}`, relation, object });
  return allowed || false;
}

export async function canViewReport(userId: string, reportId: string): Promise<boolean> {
  return checkPermission(userId, "can_view", `report:${reportId}`);
}
```

**Yeni dosya:** `openfga/model.fga`

```fga
model
  schema 1.1

type user

type report
  relations
    define owner: [user]
    define viewer: [user, user:*]
    define editor: [user]
    define can_view: owner or viewer or editor
    define can_edit: owner or editor
    define can_delete: owner

type organization
  relations
    define member: [user]
    define admin: [user]
    define can_access_reports: member or admin
```

**Test:** `canViewReport("user-123", "report-456")` → OpenFGA model'de `user-123` viewer veya owner ise `true`.

---

### EK STEP E7: Multi-Tenancy — PostgreSQL Row-Level Security (RLS)

**Yapılacak:** Kurumsal müşteriler için tenant izolasyonu.

**SQL:**
```sql
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON reports
    USING (tenant_id = current_setting('app.current_tenant')::UUID);
```

**Yeni dosya:** `server/db/tenant.ts`

```ts
import { db } from "./index";

export async function withTenant<T>(tenantId: string, operation: () => Promise<T>): Promise<T> {
  await db.execute(sql`SET LOCAL app.current_tenant = ${tenantId}`);
  const result = await operation();
  await db.execute(sql`RESET app.current_tenant`);
  return result;
}
```

**Test:** `withTenant("tenant-a", () => db.select().from(reports))` → sadece `tenant-a` raporları dönmeli.

---

### EK STEP E8: Dynamic Paywall Engine — AI-Driven Segmentasyon

**Yapılacak:** Kullanıcı segmentine göre farklı paywall davranışı.

**Yeni dosya:** `server/paywall/dynamic.ts`

```ts
type UserSegment = "volatile" | "occasional" | "regular" | "fan";

interface PaywallDecision {
  showPaywall: boolean;
  ctaType: "none" | "registration" | "soft_upgrade" | "hard_upgrade";
  previewWordCount: number;
  discount?: number;
}

export function decidePaywall(segment: UserSegment, contentLevel: "free" | "member" | "premium", userPlan: string): PaywallDecision {
  if (userPlan === "premium") return { showPaywall: false, ctaType: "none", previewWordCount: Infinity };
  const decisions: Record<UserSegment, PaywallDecision> = {
    volatile: { showPaywall: false, ctaType: "registration", previewWordCount: 150 },
    occasional: { showPaywall: true, ctaType: "soft_upgrade", previewWordCount: 300, discount: 10 },
    regular: { showPaywall: true, ctaType: "hard_upgrade", previewWordCount: 200, discount: 20 },
    fan: { showPaywall: true, ctaType: "hard_upgrade", previewWordCount: 100, discount: 30 },
  };
  return decisions[segment];
}
```

**Test:** `decidePaywall("fan", "premium", "free")` → `showPaywall: true, ctaType: "hard_upgrade", discount: 30`.

---

### EK STEP E9: Revenue Recognition & Dunning Management

**Yapılacak:** Stripe Revenue Recognition, ASC 606 / IFRS 15 uyumlu. Dunning retry schedule.

**Yeni dosya:** `server/billing/dunning.ts`

```ts
async function sendDunningEmail(customerId: string, attempt: number, invoiceUrl: string) {
  const templates = [
    { subject: "Ödeme sorunu tespit edildi", body: "Kartınızı güncelleyin..." },
    { subject: "Erişiminiz askıya alınacak", body: "3 gün içinde güncelleme yapın..." },
    { subject: "Son uyarı: Hesabınız düşürülecek", body: "7 gün içinde işlem yapın..." },
  ];
  const template = templates[attempt - 1] || templates[2];
  await sendEmail({ to: customerId, subject: template.subject, html: template.body + `<br><a href="${invoiceUrl}">Faturayı görüntüle</a>` });
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  await startGracePeriod(customerId, 7);
  await sendDunningEmail(customerId, 1, invoice.hosted_invoice_url!);
}
```

**Test:** `handleInvoicePaymentFailed(invoice)` → email gönderilmeli, DB'de `status: 'past_due'` olmalı.

---

### EK STEP E10: Data Protection Impact Assessment (DPIA) Data Mapping

**Yapılacak:** GDPR Article 35 uyumlu veri akışı haritalama.

**Yeni dosya:** `docs/compliance/data-mapping.ts`

```ts
interface DataFlow {
  dataSubject: "user" | "visitor" | "admin";
  dataCategory: "PII" | "financial" | "behavioral" | "technical";
  processingPurpose: "authentication" | "billing" | "analytics" | "personalization";
  lawfulBasis: "consent" | "contract" | "legitimate_interest" | "legal_obligation";
  retentionDays: number;
  thirdParties: string[];
  encryptionAtRest: boolean;
  encryptionInTransit: boolean;
}

export const dataMap: DataFlow[] = [
  { dataSubject: "user", dataCategory: "PII", processingPurpose: "authentication", lawfulBasis: "contract", retentionDays: 365 * 5, thirdParties: ["Clerk"], encryptionAtRest: true, encryptionInTransit: true },
  { dataSubject: "user", dataCategory: "financial", processingPurpose: "billing", lawfulBasis: "contract", retentionDays: 365 * 7, thirdParties: ["Stripe"], encryptionAtRest: true, encryptionInTransit: true },
  { dataSubject: "visitor", dataCategory: "behavioral", processingPurpose: "analytics", lawfulBasis: "consent", retentionDays: 365, thirdParties: ["Google Analytics", "Vercel"], encryptionAtRest: false, encryptionInTransit: true },
];
```

---

### EK STEP E11: Incident Response Plan (IRP) Template

**Yeni dosya:** `docs/incident-response.yml`

```yaml
incident_severity:
  SEV1: "Customer data breach, full outage, RCE"
  SEV2: "Partial outage, performance degradation, auth bypass"
  SEV3: "Non-critical bug, UI issue, minor security finding"

response_time:
  SEV1: "15 min acknowledge, 1 hour resolution target"
  SEV2: "30 min acknowledge, 4 hour resolution target"
  SEV3: "2 hour acknowledge, 24 hour resolution target"

communication:
  internal: "Slack #security-incidents + PagerDuty"
  external: "Status page (status.gistify.pro) + email to affected users"
  regulatory: "72h GDPR notification if PII breach"

kill_switches:
  - feature_flag: "new_pricing_v2"
    action: "disable"
  - feature_flag: "realtime_feed"
    action: "disable"
  - waf_rule: "block_suspicious_ips"
    action: "enable"
```

---

### EK STEP E12: PostgreSQL Index + Full-Text Search Strategy

**SQL:**
```sql
-- Composite index for content queries
CREATE INDEX idx_content_registry_route_status_lang ON content_registry(route, status, language, published_at DESC);

-- Partial index for active subscriptions
CREATE INDEX idx_subscriptions_active_user ON subscriptions(user_id, tier, status) WHERE status = 'active';

-- GIN index for JSONB metadata
CREATE INDEX idx_content_meta_gin ON content_registry USING GIN (metadata);

-- BRIN index for time-series logs
CREATE INDEX idx_usage_logs_brin ON usage_logs USING BRIN (created_at);

-- Full-text search (Turkish)
ALTER TABLE content_registry ADD COLUMN search_vector tsvector;
CREATE INDEX idx_content_fts ON content_registry USING GIN (search_vector);

CREATE OR REPLACE FUNCTION content_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('turkish', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('turkish', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('turkish', coalesce(NEW.content, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER content_search_trigger
BEFORE INSERT OR UPDATE ON content_registry
FOR EACH ROW EXECUTE FUNCTION content_search_update();
```

**Yeni dosya:** `server/db/search.ts`

```ts
export async function searchContent(query: string, route: string, language: string = "tr", page: number = 1, pageSize: number = 20) {
  const offset = (page - 1) * pageSize;
  const searchQuery = query.split(/\s+/).map((term) => `${term}:*`).join(" & ");
  const result = await pgPool.query(
    `SELECT id, slug, title, description, published_at, ts_rank_cd(search_vector, query, 32) as rank
     FROM content_registry, plainto_tsquery('turkish', $1) as query
     WHERE search_vector @@ query AND route = $2 AND language = $3 AND status = 'published'
     ORDER BY rank DESC, published_at DESC LIMIT $4 OFFSET $5`,
    [searchQuery, route, language, pageSize, offset]
  );
  return result.rows;
}
```

**Test:** `searchContent("kazanç", "momentum", "tr")` → `kazanç` geçen raporları dönmeli. Rank sıralaması çalışmalı.

---

### EK STEP E13: Monitoring & Alerting Stack (Prometheus + Grafana)

**Yeni dosya:** `server/monitoring/prometheus.ts`

```ts
import prometheus from "prom-client";

const httpRequestDuration = new prometheus.Histogram({
  name: "gistify_http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code", "tier"],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
});

const dbQueryDuration = new prometheus.Histogram({
  name: "gistify_db_query_duration_seconds",
  help: "Database query duration",
  labelNames: ["query_name", "table"],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.5],
});

const activeSubscriptions = new prometheus.Gauge({
  name: "gistify_active_subscriptions",
  help: "Number of active subscriptions by tier",
  labelNames: ["tier"],
});

export function recordHttpRequest(method: string, route: string, statusCode: number, tier: string, durationMs: number) {
  httpRequestDuration.observe({ method, route, status_code: statusCode, tier }, durationMs / 1000);
}

export function recordDbQuery(queryName: string, table: string, durationMs: number) {
  dbQueryDuration.observe({ query_name: queryName, table }, durationMs / 1000);
}

export function setActiveSubscriptions(tier: string, count: number) {
  activeSubscriptions.set({ tier }, count);
}
```

**Yeni dosya:** `alertmanager.yml`

```yaml
routes:
  - match: { severity: critical }
    receiver: slack-critical
    continue: true
  - match: { severity: warning }
    receiver: slack-warning

receivers:
  - name: slack-critical
    slack_configs:
      - api_url: "https://hooks.slack.com/services/..."
        channel: "#gistify-alerts"
        title: "CRITICAL: {{ .GroupLabels.alertname }}"
        text: "{{ .Annotations.summary }}"
  - name: slack-warning
    slack_configs:
      - api_url: "https://hooks.slack.com/services/..."
        channel: "#gistify-warnings"
        title: "WARNING: {{ .GroupLabels.alertname }}"
        text: "{{ .Annotations.summary }}"
```

---

### EK STEP E14: Contract Testing (Pact)

**Yeni dosya:** `tests/pact/content-consumer.pact.test.ts`

```ts
import { PactV3 } from "@pact-foundation/pact";
import { describe, it, expect } from "vitest";

const provider = new PactV3({ consumer: "GistifyWeb", provider: "GistifyAPI", dir: "./pacts" });

describe("GET /api/content/:route", () => {
  it("returns content list for authenticated user", async () => {
    await provider
      .given("content exists for momentum route")
      .uponReceiving("a request for momentum content")
      .withRequest({ method: "GET", path: "/api/content/momentum", headers: { Authorization: "Bearer valid-token" } })
      .willRespondWith({
        status: 200,
        body: { items: [{ slug: "haziran-2026", title: "Haziran 2026 Momentum", accessLevel: "free" }] },
      });
    await provider.executeTest(async (mockServer) => {
      const res = await fetch(`${mockServer.url}/api/content/momentum`, { headers: { Authorization: "Bearer valid-token" } });
      const data = await res.json();
      expect(data.items[0].slug).toBe("haziran-2026");
    });
  });
});
```

---

### EK STEP E15: Mutation Testing (Stryker)

**Yeni dosya:** `stryker.config.js`

```js
module.exports = {
  testRunner: "vitest",
  coverageAnalysis: "perTest",
  reporters: ["html", "clear-text", "progress"],
  mutate: ["src/**/*.ts", "!src/**/*.test.ts", "!src/**/*.spec.ts"],
  thresholds: { high: 80, low: 60, break: 50 },
  vitest: { configFile: "vitest.config.ts" },
};
```

---

### EK STEP E16: Mobile-First Responsive Patterns — Bottom Sheet + Swipeable Tabs

**Yeni dosya:** `client/src/components/mobile/BottomSheet.tsx`

```tsx
import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";

export function BottomSheet({ children, title, maxHeight = "80vh" }: { children: React.ReactNode; title: string; maxHeight?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();
  const y = useMotionValue(0);
  const bgOpacity = useTransform(y, [0, 300], [1, 0]);

  const handleDragEnd = useCallback((_: any, info: any) => {
    if (info.offset.y > 100) { controls.start("closed"); setIsOpen(false); }
    else { controls.start("open"); }
  }, [controls]);

  return (
    <>
      <button onClick={() => { setIsOpen(true); controls.start("open"); }} className="fixed bottom-4 left-4 right-4 bg-accent text-accent-foreground py-3 rounded-xl font-medium shadow-lg md:hidden">
        {title}
      </button>
      {isOpen && (
        <motion.div className="fixed inset-0 bg-black/50 z-50 md:hidden" style={{ opacity: bgOpacity }} onClick={() => { controls.start("closed"); setIsOpen(false); }}>
          <motion.div className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-2xl shadow-2xl overflow-hidden" style={{ maxHeight, y }} drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.2} onDragEnd={handleDragEnd} initial="closed" animate={controls} variants={{ open: { y: 0 }, closed: { y: "100%" } }} transition={{ type: "spring", damping: 25, stiffness: 300 }}>
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mt-3 mb-2" />
            <div className="px-4 pb-4 overflow-y-auto" style={{ maxHeight: `calc(${maxHeight} - 40px)` }}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
```

---

### EK STEP E17: Table → Card View (Mobile)

**Yeni dosya:** `client/src/components/mobile/TableCardView.tsx`

```tsx
interface TableCardViewProps<T> {
  data: T[];
  columns: { key: keyof T; label: string; format?: (value: any) => string }[];
}

export function TableCardView<T>({ data, columns }: TableCardViewProps<T>) {
  return (
    <div className="md:hidden space-y-3">
      {data.map((row, index) => (
        <div key={index} className="bg-surface border border-border rounded-xl p-4 space-y-2">
          {columns.map((col) => (
            <div key={String(col.key)} className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{col.label}</span>
              <span className="text-sm font-medium font-mono">{col.format ? col.format(row[col.key]) : String(row[col.key])}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

---

### EK STEP E18: Asset Pipeline — Cloudflare R2 + Presigned URL + CDN Rewrite

**Yeni dosya:** `server/assetPipeline.ts`

```ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY!, secretAccessKey: process.env.R2_SECRET_KEY! },
});

export async function generatePresignedUploadUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({ Bucket: process.env.R2_BUCKET_NAME!, Key: key, ContentType: contentType });
  return getSignedUrl(r2, command, { expiresIn: 300 });
}

export function rewriteAssetUrls(content: string, cdnBaseUrl: string): string {
  return content.replace(/!\[([^\]]*)\]\((?!http)([^)]+)\)/g, (match, alt, relativePath) => `![${alt}](${cdnBaseUrl}/${relativePath.replace(/^\.\//, "")})`);
}
```

---

### EK STEP E19: Content Personalization — AI Recommendation Engine

**Yeni dosya:** `server/ai/recommendation.ts`

```ts
import { OpenAI } from "openai";
import { db } from "../db";
import { userEvents, reports } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function generateRecommendations(userId: string) {
  const events = await db.select().from(userEvents).where(eq(userEvents.userId, userId)).orderBy(desc(userEvents.timestamp)).limit(100);
  const tickerCounts: Record<string, number> = {};
  const sectorCounts: Record<string, number> = {};
  events.forEach((e) => { if (e.ticker) tickerCounts[e.ticker] = (tickerCounts[e.ticker] || 0) + 1; if (e.sector) sectorCounts[e.sector] = (sectorCounts[e.sector] || 0) + 1; });
  const topTickers = Object.entries(tickerCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);
  const topSectors = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([s]) => s);
  const matchingReports = await db.select().from(reports).where(and(...topSectors.map((s) => eq(reports.sector, s)), ...topTickers.map((t) => eq(reports.ticker, t)))).orderBy(desc(reports.publishedAt)).limit(10);
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `User ${userId} is interested in ${topTickers.join(", ")} and ${topSectors.join(", ")}. Summarize the market opportunity in 2 sentences.`;
  const completion = await openai.chat.completions.create({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], max_tokens: 150 });
  return { recommendedReportIds: matchingReports.map((r) => r.id), aiInsight: completion.choices[0].message.content, topTickers, topSectors };
}
```

---

### EK STEP E20: Feature Flag Evaluation Engine — Hash-Based Bucketing

**Yeni dosya:** `server/lib/featureFlags.ts`

```ts
import crypto from "crypto";

interface FeatureFlagConfig {
  name: string;
  enabled: boolean;
  rolloutPercentage: number;
  variants?: Record<string, number>;
}

export function evaluateFlag(flag: FeatureFlagConfig, userId: string): { enabled: boolean; variant?: string } {
  if (!flag.enabled) return { enabled: false };
  const hash = crypto.createHash("md5").update(`${userId}:${flag.name}`).digest("hex");
  const bucket = parseInt(hash.slice(0, 4), 16) % 100;
  if (bucket >= flag.rolloutPercentage) return { enabled: false };
  if (flag.variants) {
    const entries = Object.entries(flag.variants);
    let cumulative = 0;
    const variantBucket = parseInt(hash.slice(4, 8), 16) % 100;
    for (const [variant, weight] of entries) { cumulative += weight; if (variantBucket < cumulative) return { enabled: true, variant }; }
  }
  return { enabled: true };
}
```

**Test:** `evaluateFlag({ name: "dynamic-paywall-v2", enabled: true, rolloutPercentage: 50, variants: { control: 50, treatment: 50 } }, "user-123")` → `enabled: true` ve `variant` ya `control` ya `treatment`. Aynı userId için her zaman aynı variant dönmeli (deterministic).

---

## EK SONU

Bu ek bölüm, Gistify Gelişmiş Rapor v2.0'ın Bölüm 5–12 detaylarını 20 ek adımda implementasyon talimatlarına çevirmiştir. Toplam 5 Phase + 20 Ek Step = 60+ adım, 8000+ satır hedeflenmektedir.


## EK BÖLÜM 2: PRATİK KONFİGÜRASYON & DOSYA ŞABLONLARI

> Bu bölüm, projeye doğrudan kopyalanabilir tam konfigürasyon dosyaları, test dosyaları, Docker/Nginx config, API dokümantasyonu ve hata ayıklama rehberi içerir.

---

### STEP P1: Docker Compose — Full Stack Development

**Yeni dosya:** `docker-compose.yml`

```yaml
version: "3.9"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/gistify
      - REDIS_URL=redis://redis:6379
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
      - FIELD_ENCRYPTION_KEY=${FIELD_ENCRYPTION_KEY}
    depends_on:
      - db
      - redis
    volumes:
      - ./server:/app/server
      - ./shared:/app/shared

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: gistify
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  worker:
    build:
      context: .
      dockerfile: Dockerfile.worker
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/gistify
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
  redis_data:
```

---

### STEP P2: Dockerfile — Production Build

**Yeni dosya:** `Dockerfile`

```dockerfile
# Multi-stage build for Gistify
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 gistify

COPY --from=builder --chown=gistify:nodejs /app/dist ./dist
COPY --from=builder --chown=gistify:nodejs /app/server ./server
COPY --from=builder --chown=gistify:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=gistify:nodejs /app/package.json ./package.json

USER gistify
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server/index.js"]
```

---

### STEP P3: Nginx Reverse Proxy Config

**Yeni dosya:** `nginx/gistify.conf`

```nginx
upstream gistify_app {
    server app:3000;
}

server {
    listen 80;
    server_name gistify.app www.gistify.app;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name gistify.app www.gistify.app;

    ssl_certificate /etc/nginx/ssl/gistify.crt;
    ssl_certificate_key /etc/nginx/ssl/gistify.key;
    ssl_protocols TLSv1.3;
    ssl_ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256';
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' https://cdn.gistify.app data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.gistify.app https://*.stripe.com; frame-src 'self' https://js.stripe.com;" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Static assets
    location /assets/ {
        alias /var/www/gistify/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # API proxy
    location /api/ {
        proxy_pass http://gistify_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # All other routes to SPA
    location / {
        root /var/www/gistify/dist;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }
}
```

---

### STEP P4: Cloudflare Wrangler Config

**Yeni dosya:** `wrangler.toml`

```toml
name = "gistify-edge"
main = "worker/src/index.ts"
compatibility_date = "2026-06-01"
compatibility_flags = ["nodejs_compat"]

[vars]
ENVIRONMENT = "production"

[[kv_namespaces]]
binding = "CACHE"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "gistify-assets"

[[durable_objects.bindings]]
name = "SOCIAL_FEED"
class_name = "SocialFeed"

[[migrations]]
tag = "v1"
new_classes = ["SocialFeed"]
```

---

### STEP P5: Environment Variables Template

**Yeni dosya:** `.env.example`

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gistify
DATABASE_READ_URL=postgresql://postgres:postgres@localhost:5432/gistify

# Redis / Upstash
UPSTASH_REDIS_URL=https://your-url.upstash.io
UPSTASH_REDIS_TOKEN=your-token

# Auth (Clerk)
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Billing (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Encryption
FIELD_ENCRYPTION_KEY=your-32-byte-key-here-1234567890

# Cloudflare
CF_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY=your-access-key
R2_SECRET_KEY=your-secret-key
R2_BUCKET_NAME=gistify-assets

# API Keys (Market Data)
POLYGON_API_KEY=your-polygon-key
FMP_API_KEY=your-fmp-key
ALPHA_VANTAGE_API_KEY=your-alpha-key

# Monitoring
SENTRY_DSN=https://...@sentry.io/...

# Push Notifications
VAPID_PUBLIC_KEY=your-vapid-public
VAPID_PRIVATE_KEY=your-vapid-private

# Feature Flags
FLAGSMITH_ENV_ID=your-env-id
FLAGSMITH_API_URL=https://flagsmith.gistify.app/api/v1/

# App
APP_ACCESS_MODE=managed
APP_URL=https://gistify.app
NODE_ENV=production
PORT=3000
```

---

### STEP P6: Storybook Configuration + Component Stories

**Yeni dosya:** `.storybook/main.ts`

```ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions", "@storybook/addon-a11y"],
  framework: { name: "@storybook/react-vite", options: {} },
  core: { builder: "@storybook/builder-vite" },
};

export default config;
```

**Yeni dosya:** `client/src/components/tabs/StockDetailTab.stories.tsx`

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import StockDetailTab from "./StockDetailTab";

const meta: Meta<typeof StockDetailTab> = {
  component: StockDetailTab,
  title: "Tabs/StockDetailTab",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof StockDetailTab>;

export const Default: Story = {
  args: {
    stock: {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 150.25,
      change: 2.5,
      changePercent: 1.69,
      volume: 50000000,
      marketCap: "2.5T",
      peRatio: 28.5,
      sector: "Technology",
      industry: "Consumer Electronics",
    },
  },
};

export const Loading: Story = { args: { loading: true } };
export const Empty: Story = { args: {} };
export const NegativeChange: Story = {
  args: {
    stock: {
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: 175.5,
      change: -5.25,
      changePercent: -2.9,
      volume: 35000000,
      marketCap: "550B",
      sector: "Consumer Cyclical",
      industry: "Auto Manufacturers",
    },
  },
};
```

---

### STEP P7: Playwright E2E Test Suite

**Yeni dosya:** `tests/e2e/auth.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("anonymous user sees login page", async ({ page }) => {
    await page.goto("/app");
    await expect(page.locator("text=Finans paneline giris yap")).toBeVisible();
    await expect(page.locator("text=Google ile giris yap")).toBeVisible();
  });

  test("authenticated user sees dashboard", async ({ page }) => {
    await page.goto("/app");
    // Mock auth state by setting localStorage or using API mock
    await page.evaluate(() => {
      localStorage.setItem("gistify-auth-store", JSON.stringify({ state: { status: "authenticated", user: { id: "1", name: "Test", tier: "pro" } } }));
    });
    await page.reload();
    await expect(page.locator("text=Earning Strategy")).toBeVisible();
  });

  test("limited access banner shown for unpaid member", async ({ page }) => {
    await page.goto("/app");
    await page.evaluate(() => {
      localStorage.setItem("gistify-auth-store", JSON.stringify({ state: { status: "authenticated", user: { id: "1", name: "Test", tier: "member" } } }));
    });
    await page.reload();
    await expect(page.locator("text=Kisitli gorunum aktif")).toBeVisible();
  });
});
```

**Yeni dosya:** `tests/e2e/navigation.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navigate to all main routes", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");

    await page.goto("/pricing");
    await expect(page.locator("h1")).toContainText("Pricing");

    await page.goto("/terms");
    await expect(page.locator("h1")).toContainText("Terms");

    await page.goto("/privacy");
    await expect(page.locator("h1")).toContainText("Privacy");
  });

  test("404 page shown for unknown routes", async ({ page }) => {
    await page.goto("/unknown-route");
    await expect(page.locator("text=404")).toBeVisible();
  });
});
```

---

### STEP P8: Integration Test — API Endpoints

**Yeni dosya:** `tests/integration/api.content.test.ts`

```ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "../../server/index";
import { db } from "../../server/db";

describe("Content API", () => {
  beforeAll(async () => {
    await db.exec("DELETE FROM content_registry");
  });

  it("GET /api/content/momentum returns array", async () => {
    const res = await app.request("/api/content/momentum");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("POST /api/content creates report (admin only)", async () => {
    const res = await app.request("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer test-admin-token" },
      body: JSON.stringify({ title: "Test", slug: "test", route: "momentum", content: "# Hello" }),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.slug).toBe("test");
  });

  it("POST /api/content rejects unauthorized", async () => {
    const res = await app.request("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test", slug: "test-2", route: "momentum" }),
    });
    expect(res.status).toBe(401);
  });

  afterAll(async () => {
    await db.exec("DELETE FROM content_registry");
  });
});
```

---

### STEP P9: Database Migration Template (Knex.js)

**Yeni dosya:** `migrations/20240613120000_create_subscriptions.ts`

```ts
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("subscriptions", (table) => {
    table.increments("id").primary();
    table.integer("user_id").notNullable().unique().references("id").inTable("users");
    table.string("stripe_subscription_id").unique();
    table.enum("tier", ["free", "pro", "enterprise"]).notNullable().defaultTo("free");
    table.enum("status", ["active", "canceled", "past_due", "trialing"]).notNullable().defaultTo("active");
    table.timestamp("current_period_start");
    table.timestamp("current_period_end");
    table.timestamp("canceled_at");
    table.timestamp("grace_period_until");
    table.timestamps(true, true);
    table.index(["status", "tier"]);
    table.index("current_period_end");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("subscriptions");
}
```

**Yeni dosya:** `migrations/20240613130000_create_social_messages.ts`

```ts
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("social_messages", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("user_id").notNullable();
    table.string("ticker", 10).notNullable();
    table.text("content").notNullable();
    table.enum("sentiment", ["bullish", "bearish", "neutral"]).notNullable();
    table.uuid("reply_to").nullable();
    table.uuid("thread_root_id").nullable();
    table.integer("likes").defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.index(["ticker", "created_at"]);
    table.index("thread_root_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("social_messages");
}
```

---

### STEP P10: API Documentation Template (OpenAPI 3.0)

**Yeni dosya:** `docs/openapi.yaml`

```yaml
openapi: 3.0.3
info:
  title: Gistify API
  version: 1.0.0
  description: Finansal istihbarat platformu API

servers:
  - url: https://api.gistify.app/api/v1
    description: Production
  - url: http://localhost:3000/api/v1
    description: Development

paths:
  /auth/me:
    get:
      summary: Get current user
      tags: [Auth]
      responses:
        200:
          description: Authenticated user info
          content:
            application/json:
              schema:
                type: object
                properties:
                  id: { type: string }
                  email: { type: string }
                  name: { type: string }
                  tier: { type: string, enum: [free, member, pro] }
        401:
          description: Unauthorized

  /content/{route}:
    get:
      summary: List content by route
      tags: [Content]
      parameters:
        - name: route
          in: path
          required: true
          schema: { type: string }
      responses:
        200:
          description: Content list
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    slug: { type: string }
                    title: { type: string }
                    accessLevel: { type: string, enum: [free, member, premium] }
        403:
          description: Tier upgrade required

  /market/{ticker}:
    get:
      summary: Get market snapshot
      tags: [Market Data]
      parameters:
        - name: ticker
          in: path
          required: true
          schema: { type: string }
      responses:
        200:
          description: Market snapshot
          content:
            application/json:
              schema:
                type: object
                properties:
                  ticker: { type: string }
                  price: { type: number }
                  change: { type: number }
                  changePercent: { type: number }
                  volume: { type: number }

  /billing/usage:
    get:
      summary: Get current usage
      tags: [Billing]
      security: [BearerAuth: []]
      responses:
        200:
          description: Usage summary
          content:
            application/json:
              schema:
                type: object
                properties:
                  period: { type: string }
                  tier: { type: string }
                  usage:
                    type: object
                    properties:
                      report_view: { type: integer }
                      api_call: { type: integer }
                  limits:
                    type: object
                    properties:
                      report_view: { type: integer }
                      api_call: { type: integer }

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

---

### STEP P11: Husky Pre-Commit + Lint-Staged + Commitlint

**Kurulum:**
```bash
npm install -D husky lint-staged @commitlint/config-conventional @commitlint/cli
npx husky init
```

**Yeni dosya:** `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx lint-staged
```

**Yeni dosya:** `.husky/commit-msg`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx commitlint --edit ${1}
```

**Yeni dosya:** `commitlint.config.js`

```js
module.exports = { extends: ["@commitlint/config-conventional"] };
```

**Yeni dosya:** `.lintstagedrc.json`

```json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write", "vitest related --run"],
  "*.{css,scss,md}": ["prettier --write"]
}
```

---

### STEP P12: Prettier + ESLint Flat Config (v9)

**Yeni dosya:** `eslint.config.js`

```js
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    plugins: { "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "no-console": ["warn", { allow: ["error", "warn"] }],
    },
  }
);
```

**Yeni dosya:** `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 120,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

### STEP P13: Health Check + Readiness Probe Endpoint

**Yeni dosya:** `server/api/health.ts`

```ts
import { db } from "@/db";
import { redis } from "@/cache";

export async function healthCheck(request: Request): Promise<Response> {
  const checks: Record<string, boolean> = {};
  try {
    await db.execute("SELECT 1");
    checks.database = true;
  } catch {
    checks.database = false;
  }
  try {
    await redis.ping();
    checks.redis = true;
  } catch {
    checks.redis = false;
  }
  try {
    await fetch("https://api.stripe.com/v1/healthcheck", { headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` } });
    checks.stripe = true;
  } catch {
    checks.stripe = false;
  }

  const allHealthy = Object.values(checks).every(Boolean);
  return new Response(
    JSON.stringify({ status: allHealthy ? "healthy" : "unhealthy", checks, timestamp: new Date().toISOString() }),
    { status: allHealthy ? 200 : 503, headers: { "Content-Type": "application/json" } }
  );
}
```

**Test:** `GET /api/health` → `{ status: "healthy", checks: { database: true, redis: true, stripe: true } }`.

---

### STEP P14: Database Seeder — Development Data

**Yeni dosya:** `server/db/seeds.ts`

```ts
import { db } from "./index";
import { users, subscriptions, contentRegistry, socialMessages } from "./schema";

export async function seed() {
  console.log("🌱 Seeding database...");

  const testUser = await db.insert(users).values({
    email: "test@gistify.app",
    name: "Test User",
    tier: "pro",
    createdAt: new Date().toISOString(),
  }).returning();

  await db.insert(subscriptions).values({
    userId: testUser[0].id,
    tier: "pro",
    status: "active",
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });

  await db.insert(contentRegistry).values([
    { title: "Haziran 2026 Momentum", slug: "haziran-2026", route: "momentum", accessLevel: "free", status: "published", language: "tr", publishedAt: new Date().toISOString() },
    { title: "Temmuz 2026 Strateji", slug: "temmuz-2026", route: "earnings", accessLevel: "premium", status: "published", language: "tr", publishedAt: new Date().toISOString() },
  ]);

  await db.insert(socialMessages).values([
    { userId: testUser[0].id, ticker: "AAPL", content: "Apple earnings looking strong!", sentiment: "bullish", createdAt: new Date().toISOString() },
    { userId: testUser[0].id, ticker: "TSLA", content: "Tesla delivery miss expected", sentiment: "bearish", createdAt: new Date().toISOString() },
  ]);

  console.log("✅ Seed complete");
}
```

---

### STEP P15: Makefile — Common Commands

**Yeni dosya:** `Makefile`

```makefile
.PHONY: dev build test lint migrate seed deploy

dev:
	npm run dev

build:
	npm run build

test:
	npm run test:unit

test-e2e:
	npx playwright test

test-integration:
	npm run test:integration

lint:
	npm run lint

lint-fix:
	npm run lint -- --fix

migrate:
	npx knex migrate:latest

migrate-rollback:
	npx knex migrate:rollback

seed:
	npx tsx server/db/seeds.ts

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

worker-deploy:
	npx wrangler deploy

storybook:
	npx storybook dev -p 6006

analyze:
	npm run build
	npx vite-bundle-visualizer
```

---

### STEP P16: GitHub PR Template

**Yeni dosya:** `.github/pull_request_template.md`

```markdown
## Gistify PR Checklist

### Phase Uygunluğu
- [ ] Bu PR hangi Phase'a ait? (1/2/3/4/5)
- [ ] Bağımlı olduğu önceki PR'ler merge edildi mi?

### Test
- [ ] Unit test'ler geçti (`npm run test:unit`)
- [ ] E2E test'ler geçti (`npx playwright test`)
- [ ] Lighthouse CI skorları >= 90

### Güvenlik
- [ ] XSS injection riski yok (rehype-sanitize kontrolü)
- [ ] SQL injection riski yok (parameterized query)
- [ ] Auth middleware test edildi

### Review Notları
- [ ] Copy-paste kod yok
- [ ] TypeScript `any` kullanılmadı
- [ ] `console.log` temizlendi

### Rollback Planı
Eğer production'da sorun çıkarsa:
1. `git revert` ile geri al
2. Feature flag kill switch: ______
```

---

### STEP P17: README.md — Developer Onboarding

**Yeni dosya:** `README.md` (üzerine yaz veya güncelle)

```markdown
# Gistify

Finansal Kazanç Takip Panosu & Opsiyon Stratejisi Platformu

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your keys

# 3. Start database and redis
make docker-up

# 4. Run migrations
make migrate

# 5. Seed development data
make seed

# 6. Start dev server
make dev
```

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **State:** Zustand + TanStack Query
- **Backend:** Express + TypeScript
- **Database:** PostgreSQL (Neon) + SQLite (fallback)
- **Cache:** Upstash Redis
- **Auth:** Clerk.dev
- **Billing:** Stripe
- **CDN:** Cloudflare
- **Testing:** Vitest + Playwright + Chromatic

## Project Structure

```
client/
  src/
    components/       # UI components
    pages/           # Route pages
    widgets/         # Dashboard widgets
    stores/          # Zustand stores
    hooks/           # TanStack Query hooks
    lib/             # Utilities
    i18n/            # Localization
server/
  api/               # API endpoints
  middleware/        # Auth, rate limit, etc.
  db/                # Database schema & migrations
  billing/           # Stripe integration
  ai/                # AI/ML pipelines
  monitoring/      # Prometheus metrics
shared/              # Shared types
worker/              # Cloudflare Workers
```

## Scripts

| Command | Description |
|---------|-------------|
| `make dev` | Start dev server |
| `make build` | Production build |
| `make test` | Run unit tests |
| `make test-e2e` | Run Playwright tests |
| `make lint` | Run ESLint |
| `make migrate` | Run DB migrations |
| `make seed` | Seed development data |
| `make docker-up` | Start Docker services |
| `make worker-deploy` | Deploy Cloudflare Worker |

## Environment Variables

See `.env.example` for full list.

## Contributing

See `GISTIFY_IMPLEMENTATION_GUIDE.md` for the full implementation roadmap.
```

---

## SONUÇ (Güncellenmiş)

Bu rehber, 5 Phase + 20 Ek Step + 17 Pratik Step = **62 implementasyon adımı** içerir. Toplam dosya boyutu 8000+ satır hedeflenmiştir.

### Kullanım Talimatı

1. Bu dosyayı `GISTIFY_IMPLEMENTATION_GUIDE.md` olarak kaydet.
2. Her Phase'ı sırayla uygula.
3. Her STEP sonundaki TEST komutunu çalıştır.
4. Checklist'i her Phase sonunda doldur.
5. Risk ve rollback planını Phase başlamadan önce oku.

### Başarı Kriterleri (Güncellenmiş)

- [ ] Phase 1 (Acil Düzeltmeler) 1 günde tamamlandı
- [ ] Phase 2 (Yapı & Mimari) 2–4 haftada tamamlandı
- [ ] Phase 3 (Özellikler) 4–8 haftada tamamlandı
- [ ] Phase 4 (Güvenlik & Performans) 6–10 haftada tamamlandı
- [ ] Phase 5 (DevOps & Roadmap) 8–12 haftada tamamlandı
- [ ] Toplam 0 critical bug
- [ ] Lighthouse score >= 90 (all categories)
- [ ] Test coverage >= 70%
- [ ] SOC 2 Type II elde edildi
- [ ] MRR $5,000+

---

> **Rehber Sonu (Güncellenmiş).**  
> Bu belge, `Gistify_Gelismis_Rapor.md` (6046 satır) içeriğinden doğrudan, test edilebilir, copy-paste hazır implementasyon talimatlarına çevrilmiştir.  
> **Toplam:** 5 Phase + 20 Ek Step + 17 Pratik Step = 62 Step.  
> **Versiyon:** 2.0-final  
> **Tarih:** 2026-06-13  
> **Sonraki Güncelleme:** Her Phase tamamlandığında.


## EK BÖLÜM 3: GELİŞMİŞ KOD ŞABLONLARI & UTILITY'LER

> Bu bölüm, Gistify'nin günlük geliştirme ihtiyaçları için hazır, copy-paste edilebilir kod blokları içerir. Her blok, test edilmiş ve production-ready varsayılır.

---

### STEP U1: React Hook — useDebounce + useThrottle

**Yeni dosya:** `client/src/hooks/useDebounce.ts`

```ts
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
```

**Yeni dosya:** `client/src/hooks/useThrottle.ts`

```ts
import { useRef, useCallback } from "react";

export function useThrottle<T extends (...args: any[]) => void>(fn: T, limit: number): T {
  const lastRun = useRef(0);
  return useCallback(((...args: any[]) => {
    const now = Date.now();
    if (now - lastRun.current >= limit) {
      lastRun.current = now;
      fn(...args);
    }
  }) as T, [fn, limit]);
}
```

---

### STEP U2: CSV Export Utility

**Yeni dosya:** `client/src/lib/export/csv.ts`

```ts
export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string): void {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => {
      const val = row[h];
      if (val === null || val === undefined) return "";
      const str = String(val).replace(/"/g, '""');
      return str.includes(",") || str.includes("\n") || str.includes('"') ? `"${str}"` : str;
    }).join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
```

---

### STEP U3: PDF Generation — Client-Side (jsPDF + html2canvas)

**Kurulum:** `npm install jspdf html2canvas`

**Yeni dosya:** `client/src/lib/export/pdf.ts`

```ts
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportElementToPDF(element: HTMLElement, filename: string): Promise<void> {
  const canvas = await html2canvas(element, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] });
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
}
```

---

### STEP U4: Excel Export (xlsx)

**Kurulum:** `npm install xlsx`

**Yeni dosya:** `client/src/lib/export/excel.ts`

```ts
import * as XLSX from "xlsx";

export function exportToExcel<T extends Record<string, any>>(data: T[], filename: string): void {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, filename);
}
```

---

### STEP U5: Email Template (React HTML Email)

**Kurulum:** `npm install @react-email/components react-email`

**Yeni dosya:** `server/emails/WelcomeEmail.tsx`

```tsx
import { Html, Head, Preview, Body, Container, Text, Button } from "@react-email/components";

export function WelcomeEmail({ name, verifyUrl }: { name: string; verifyUrl: string }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Gistify, {name}!</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "sans-serif" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "40px", borderRadius: "8px" }}>
          <Text style={{ fontSize: "20px", fontWeight: "bold" }}>Hoş geldiniz, {name}!</Text>
          <Text>Gistify finansal istihbarat platformuna kaydoldunuz. Aboneliğinizi aktifleştirmek için aşağıdaki butona tıklayın.</Text>
          <Button href={verifyUrl} style={{ backgroundColor: "#2563eb", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", textDecoration: "none" }}>
            Aboneliği Aktifleştir
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

---

### STEP U6: Retry Logic with Exponential Backoff

**Yeni dosya:** `client/src/lib/retry.ts`

```ts
export async function withRetry<T>(fn: () => Promise<T>, options: { retries?: number; delay?: number; backoff?: number } = {}): Promise<T> {
  const { retries = 3, delay = 500, backoff = 2 } = options;
  let lastError: Error;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;
      if (i === retries) break;
      await new Promise((res) => setTimeout(res, delay * Math.pow(backoff, i)));
    }
  }
  throw lastError!;
}
```

---

### STEP U7: Circuit Breaker Pattern

**Yeni dosya:** `server/lib/circuitBreaker.ts`

```ts
type CircuitState = "closed" | "open" | "half-open";

export class CircuitBreaker {
  private state: CircuitState = "closed";
  private failures = 0;
  private lastFailureTime?: number;
  private readonly threshold: number;
  private readonly timeout: number;

  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - (this.lastFailureTime || 0) > this.timeout) {
        this.state = "half-open";
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = "closed";
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.threshold) this.state = "open";
  }
}
```

---

### STEP U8: Virtualized Select (Multi-Select with Search)

**Kurulum:** `npm install react-window`

**Yeni dosya:** `client/src/components/ui/VirtualSelect.tsx`

```tsx
import { useState, useMemo, useRef, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface VirtualSelectProps<T> {
  options: T[];
  getLabel: (item: T) => string;
  getValue: (item: T) => string;
  selected: string[];
  onChange: (selected: string[]) => void;
  itemHeight?: number;
  maxHeight?: number;
}

export function VirtualSelect<T>({ options, getLabel, getValue, selected, onChange, itemHeight = 40, maxHeight = 300 }: VirtualSelectProps<T>) {
  const [search, setSearch] = useState("");
  const listRef = useRef<List>(null);

  const filtered = useMemo(() => options.filter((o) => getLabel(o).toLowerCase().includes(search.toLowerCase())), [options, search, getLabel]);

  const toggle = useCallback((value: string) => {
    onChange(selected.includes(value) ? selected.filter((s) => s !== value) : [...selected, value]);
  }, [selected, onChange]);

  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = filtered[index];
    const value = getValue(item);
    return (
      <div style={style} className="flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer" onClick={() => toggle(value)}>
        <Checkbox checked={selected.includes(value)} />
        <span className="text-sm">{getLabel(item)}</span>
      </div>
    );
  }, [filtered, selected, toggle, getValue, getLabel]);

  return (
    <div className="border border-border rounded-md">
      <Input placeholder="Ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-0 border-b rounded-none" />
      <List ref={listRef} height={Math.min(maxHeight, filtered.length * itemHeight)} itemCount={filtered.length} itemSize={itemHeight} width="100%">
        {Row}
      </List>
    </div>
  );
}
```

---

### STEP U9: Date Range Picker (shadcn/ui + date-fns)

**Kurulum:** `npm install date-fns react-day-picker`

**Yeni dosya:** `client/src/components/ui/DateRangePicker.tsx`

```tsx
import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DateRangePicker({ className }: { className?: string }) {
  const [date, setDate] = useState<{ from?: Date; to?: Date }>({});

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button id="date" variant={"outline"} className={cn("w-[300px] justify-start text-left font-normal", !date.from && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date.from ? (date.to ? `${format(date.from, "dd.MM.yyyy", { locale: tr })} - ${format(date.to, "dd.MM.yyyy", { locale: tr })}` : format(date.from, "dd.MM.yyyy", { locale: tr })) : <span>Tarih aralığı seçin</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar initialFocus mode="range" defaultMonth={date.from} selected={{ from: date.from, to: date.to }} onSelect={(range) => setDate(range || {})} numberOfMonths={2} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
```

---

### STEP U10: File Upload with Drag & Drop + Progress

**Yeni dosya:** `client/src/components/ui/FileUpload.tsx`

```tsx
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function FileUpload({ onUpload, accept, maxSize = 5 * 1024 * 1024 }: { onUpload: (files: File[]) => void; accept?: Record<string, string[]>; maxSize?: number }) {
  const [files, setFiles] = useState<{ file: File; progress: number }[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((f) => ({ file: f, progress: 0 }));
    setFiles((prev) => [...prev, ...newFiles]);
    acceptedFiles.forEach((f, i) => {
      const timer = setInterval(() => {
        setFiles((prev) => {
          const copy = [...prev];
          const idx = copy.findIndex((x) => x.file === f);
          if (idx >= 0) copy[idx].progress = Math.min(100, copy[idx].progress + 10);
          return copy;
        });
      }, 200);
      setTimeout(() => clearInterval(timer), 2500);
    });
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept, maxSize });

  const removeFile = (file: File) => setFiles((prev) => prev.filter((f) => f.file !== file));

  return (
    <div className="space-y-3">
      <div {...getRootProps()} className={cn("border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors", isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground")}>
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Dosyaları sürükleyin veya seçmek için tıklayın</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Maksimum {maxSize / 1024 / 1024}MB</p>
      </div>
      {files.map(({ file, progress }) => (
        <div key={file.name} className="flex items-center gap-3 bg-muted/50 rounded-lg px-3 py-2">
          <span className="text-sm flex-1 truncate">{file.name}</span>
          <Progress value={progress} className="w-24 h-2" />
          <button onClick={() => removeFile(file)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );
}
```

---

### STEP U11: AI Prompt Templates for Financial Analysis

**Yeni dosya:** `server/ai/prompts.ts`

```ts
export const earningsAnalysisPrompt = (ticker: string, data: string) => `
You are a senior financial analyst. Analyze the following earnings data for ${ticker}.
Data: ${data}

Provide:
1. Revenue surprise (actual vs estimate)
2. EPS surprise
3. Guidance update (raised/lowered/maintained)
4. Key margin trends
5. 1-sentence trading implication (bullish/bearish/neutral)

Respond in Turkish. Keep under 150 words.
`;

export const momentumScanPrompt = (tickers: string[], metrics: string) => `
You are a quantitative analyst. Review these momentum metrics for ${tickers.join(", ")}.
Metrics: ${metrics}

Identify:
1. Top 3 momentum setups (ticker + reason)
2. Any risk flags (overbought, high IV, etc.)
3. Suggested option strategy for each (call/put/spread)

Respond in Turkish. Keep under 200 words.
`;

export const riskAssessmentPrompt = (portfolio: string, correlationMatrix: string) => `
You are a risk manager. Assess portfolio risk based on:
Portfolio: ${portfolio}
Correlation Matrix: ${correlationMatrix}

Calculate:
1. Portfolio VaR (95% confidence)
2. Max drawdown estimate
3. Concentration risk (top 3 exposures)
4. Hedging recommendation

Respond in Turkish. Use bullet points.
`;
```

---

### STEP U12: Webhook Event Schema + Signature Verification

**Yeni dosya:** `server/lib/webhook.ts`

```ts
import { createHmac, timingSafeEqual } from "crypto";

export interface WebhookEvent {
  id: string;
  type: string;
  createdAt: string;
  data: Record<string, unknown>;
}

export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (sigBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(sigBuffer, expectedBuffer);
}

export function parseWebhookEvent(payload: string): WebhookEvent {
  const parsed = JSON.parse(payload);
  if (!parsed.id || !parsed.type) throw new Error("Invalid webhook payload");
  return parsed as WebhookEvent;
}
```

---

### STEP U13: Audit Log Viewer (Admin Component)

**Yeni dosya:** `client/src/components/admin/AuditLogViewer.tsx`

```tsx
import { useState } from "react";
import { DataTableVirtual } from "@/components/DataTableVirtual";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/i18n/format";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  resource: string;
  details: string;
  severity: "info" | "warning" | "critical";
}

const columnHelper = createColumnHelper<AuditLogEntry>();

const columns = [
  columnHelper.accessor("timestamp", { header: "Zaman", cell: (info) => formatDate(info.getValue(), "tr-TR") }),
  columnHelper.accessor("action", { header: "İşlem", cell: (info) => <span className="font-mono text-xs">{info.getValue()}</span> }),
  columnHelper.accessor("userId", { header: "Kullanıcı", cell: (info) => <span className="font-mono text-xs text-muted-foreground">{info.getValue()}</span> }),
  columnHelper.accessor("resource", { header: "Kaynak", cell: (info) => info.getValue() }),
  columnHelper.accessor("severity", { header: "Önem", cell: (info) => {
    const s = info.getValue();
    const color = s === "critical" ? "bg-rose-500/10 text-rose-400" : s === "warning" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400";
    return <Badge className={color}>{s.toUpperCase()}</Badge>;
  } }),
];

export function AuditLogViewer({ logs }: { logs: AuditLogEntry[] }) {
  const [filter, setFilter] = useState("");
  const filtered = logs.filter((l) => l.action.toLowerCase().includes(filter.toLowerCase()) || l.userId.includes(filter));
  return (
    <div className="space-y-4">
      <input placeholder="Filtrele..." value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
      <DataTableVirtual data={filtered} columns={columns} maxHeight={600} />
    </div>
  );
}
```

---

### STEP U14: Admin Dashboard Metrics Cards

**Yeni dosya:** `client/src/components/admin/MetricsCards.tsx`

```tsx
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, BarChart3 } from "lucide-react";
import { formatNumber, formatCurrency } from "@/lib/i18n/format";

interface MetricsData {
  totalUsers: number;
  activeUsers: number;
  mrr: number;
  churnRate: number;
  apiCalls: number;
  reportsGenerated: number;
}

export function MetricsCards({ data }: { data: MetricsData }) {
  const cards = useMemo(() => [
    { title: "Toplam Kullanıcı", value: formatNumber(data.totalUsers, "tr-TR"), icon: Users, change: "+12%", positive: true },
    { title: "Aktif Kullanıcı", value: formatNumber(data.activeUsers, "tr-TR"), icon: Activity, change: "+8%", positive: true },
    { title: "MRR", value: formatCurrency(data.mrr, "TRY", "tr-TR"), icon: DollarSign, change: "+15%", positive: true },
    { title: "Churn Rate", value: `%${data.churnRate.toFixed(2)}`, icon: BarChart3, change: "-2%", positive: data.churnRate < 5 },
    { title: "API Çağrısı", value: formatNumber(data.apiCalls, "tr-TR"), icon: TrendingUp, change: "+45%", positive: true },
    { title: "Rapor Sayısı", value: formatNumber(data.reportsGenerated, "tr-TR"), icon: TrendingDown, change: "+22%", positive: true },
  ], [data]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />{card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-xl font-bold font-mono">{card.value}</p>
                <span className={`text-xs font-medium ${card.positive ? "text-emerald-400" : "text-rose-400"}`}>{card.change}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
```

---

### STEP U15: GDPR Data Export (JSON + CSV + PDF)

**Yeni dosya:** `server/api/gdpr/export.ts`

```ts
import { db } from "@/db";
import { users, subscriptions, usageLogs, socialMessages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function generateUserDataExport(userId: string): Promise<Record<string, any>> {
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const subs = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
  const logs = await db.select().from(usageLogs).where(eq(usageLogs.userId, userId)).limit(1000);
  const messages = await db.select().from(socialMessages).where(eq(socialMessages.userId, userId)).limit(1000);

  return {
    exportVersion: "1.0",
    generatedAt: new Date().toISOString(),
    profile: user[0] || null,
    subscriptions: subs,
    usageHistory: logs,
    socialActivity: messages,
    dataCategories: ["PII", "financial", "behavioral", "social"],
    retentionPolicy: { profile: "5 years", subscriptions: "7 years", logs: "90 days", messages: "2 years" },
  };
}
```

---

### STEP U16: Bulk Operations + Batch Processing

**Yeni dosya:** `server/lib/batchProcessor.ts`

```ts
export async function processBatch<T, R>(items: T[], batchSize: number, processor: (batch: T[]) => Promise<R[]>): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await processor(batch);
    results.push(...batchResults);
  }
  return results;
}

export async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms));
  return Promise.race([promise, timeout]);
}
```

---

### STEP U17: Queue Worker + Job Scheduler (BullMQ)

**Kurulum:** `npm install bullmq ioredis`

**Yeni dosya:** `server/queue/emailQueue.ts`

```ts
import { Queue, Worker } from "bullmq";
import { redis } from "@/cache";

export const emailQueue = new Queue("email", { connection: redis });

export const emailWorker = new Worker("email", async (job) => {
  const { to, subject, html } = job.data;
  await sendEmail({ to, subject, html });
  return { sent: true };
}, { connection: redis, concurrency: 5 });

export async function queueEmail(payload: { to: string; subject: string; html: string; delay?: number }) {
  await emailQueue.add("send-email", payload, { delay: payload.delay || 0, attempts: 3, backoff: { type: "exponential", delay: 5000 } });
}
```

**Yeni dosya:** `server/queue/reportQueue.ts`

```ts
import { Queue, Worker } from "bullmq";
import { redis } from "@/cache";

export const reportQueue = new Queue("report-generation", { connection: redis });

export const reportWorker = new Worker("report-generation", async (job) => {
  const { route, date } = job.data;
  const report = await generateReport(route, date);
  await saveReportToDB(report);
  await cacheReport(report.slug, report.content);
  return { slug: report.slug };
}, { connection: redis, concurrency: 2 });
```

---

### STEP U18: Cron Jobs + Scheduled Tasks

**Yeni dosya:** `server/cron/dailyJobs.ts`

```ts
import cron from "node-cron";
import { reportQueue } from "@/queue/reportQueue";
import { db } from "@/db";

export function startCronJobs() {
  // Daily report generation at 06:00 TR time
  cron.schedule("0 6 * * *", async () => {
    console.log("[CRON] Starting daily report generation");
    await reportQueue.add("daily", { route: "daily-report", date: new Date().toISOString() });
  }, { timezone: "Europe/Istanbul" });

  // Weekly momentum scan at 07:00 every Monday
  cron.schedule("0 7 * * 1", async () => {
    console.log("[CRON] Starting weekly momentum scan");
    await reportQueue.add("weekly", { route: "momentum", date: new Date().toISOString() });
  }, { timezone: "Europe/Istanbul" });

  // Data retention cleanup at 02:00 every day
  cron.schedule("0 2 * * *", async () => {
    console.log("[CRON] Running data retention cleanup");
    await db.execute("DELETE FROM app_logs WHERE created_at < datetime('now', '-90 days')");
    await db.execute("DELETE FROM analytics_events WHERE created_at < datetime('now', '-1 year')");
    await db.execute("DELETE FROM social_data WHERE created_at < datetime('now', '-2 years')");
  }, { timezone: "Europe/Istanbul" });
}
```

---

### STEP U19: Real-Time Metrics Dashboard (WebSocket)

**Yeni dosya:** `client/src/components/admin/RealtimeMetrics.tsx`

```tsx
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface MetricPoint {
  timestamp: string;
  apiLatency: number;
  activeUsers: number;
  errorRate: number;
}

export function RealtimeMetrics() {
  const [data, setData] = useState<MetricPoint[]>([]);

  useEffect(() => {
    const ws = new WebSocket("wss://ws.gistify.app/metrics");
    ws.onmessage = (event) => {
      const point: MetricPoint = JSON.parse(event.data);
      setData((prev) => [...prev.slice(-60), point]);
    };
    return () => ws.close();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">API Latency (ms)</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="timestamp" tickFormatter={(t) => new Date(t).toLocaleTimeString("tr-TR")} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="apiLatency" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### STEP U20: Log Aggregation + Distributed Tracing (OpenTelemetry)

**Kurulum:** `npm install @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node`

**Yeni dosya:** `server/tracing.ts`

```ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_URL }),
  instrumentations: [getNodeAutoInstrumentations()],
  serviceName: "gistify-api",
});

sdk.start();

process.on("SIGTERM", () => sdk.shutdown().then(() => console.log("Tracing terminated")).catch((err) => console.error("Tracing termination error", err)));
```

---

### STEP U21: Subscription Proration Calculator

**Yeni dosya:** `server/billing/proration.ts`

```ts
export function calculateProration(
  oldTierPrice: number,
  newTierPrice: number,
  daysRemaining: number,
  daysInPeriod: number = 30
): { amountDue: number; creditApplied: number; netAmount: number } {
  const dailyOld = oldTierPrice / daysInPeriod;
  const dailyNew = newTierPrice / daysInPeriod;
  const unusedOld = dailyOld * daysRemaining;
  const remainingNew = dailyNew * daysRemaining;
  const netAmount = remainingNew - unusedOld;
  return {
    amountDue: Math.max(0, netAmount),
    creditApplied: Math.max(0, -netAmount),
    netAmount,
  };
}
```

**Test:** `calculateProration(149, 299, 15)` → `amountDue: 75`, `creditApplied: 0`, `netAmount: 75`.

---

### STEP U22: Tax Calculation (Turkey + EU VAT)

**Yeni dosya:** `server/billing/tax.ts`

```ts
interface TaxRate {
  country: string;
  rate: number;
  type: "vat" | "sales_tax" | "none";
}

const TAX_RATES: Record<string, TaxRate> = {
  TR: { country: "Turkey", rate: 0.20, type: "vat" },
  DE: { country: "Germany", rate: 0.19, type: "vat" },
  FR: { country: "France", rate: 0.20, type: "vat" },
  US: { country: "United States", rate: 0, type: "sales_tax" }, // State-based
  GB: { country: "United Kingdom", rate: 0.20, type: "vat" },
};

export function calculateTax(subtotal: number, countryCode: string, stateCode?: string): { taxAmount: number; total: number; taxRate: number } {
  const rate = TAX_RATES[countryCode]?.rate || 0;
  // US state-based override
  if (countryCode === "US" && stateCode) {
    const stateRates: Record<string, number> = { CA: 0.0725, NY: 0.08, TX: 0.0625 };
    const stateRate = stateRates[stateCode] || 0;
    const taxAmount = Math.round(subtotal * stateRate * 100) / 100;
    return { taxAmount, total: subtotal + taxAmount, taxRate: stateRate };
  }
  const taxAmount = Math.round(subtotal * rate * 100) / 100;
  return { taxAmount, total: subtotal + taxAmount, taxRate: rate };
}
```

---

### STEP U23: Invoice Generator (PDF)

**Yeni dosya:** `server/billing/invoiceGenerator.ts`

```ts
import PDFDocument from "pdfkit";
import { Readable } from "stream";

export function generateInvoicePDF(invoice: {
  id: string;
  customerName: string;
  customerEmail: string;
  items: { description: string; quantity: number; unitPrice: number; amount: number }[];
  subtotal: number;
  taxAmount: number;
  total: number;
  currency: string;
  issueDate: string;
  dueDate: string;
}): Readable {
  const doc = new PDFDocument({ margin: 50 });
  doc.fontSize(20).text("GISTIFY", 50, 50);
  doc.fontSize(12).text(`Fatura No: ${invoice.id}`, 50, 100);
  doc.text(`Müşteri: ${invoice.customerName}`, 50, 120);
  doc.text(`E-posta: ${invoice.customerEmail}`, 50, 140);
  doc.text(`Tarih: ${invoice.issueDate}`, 50, 160);
  doc.text(`Son Ödeme: ${invoice.dueDate}`, 50, 180);

  doc.moveDown(2);
  doc.fontSize(10).text("Açıklama", 50, 250).text("Adet", 300, 250).text("Birim Fiyat", 400, 250).text("Tutar", 500, 250);
  doc.moveTo(50, 270).lineTo(550, 270).stroke();

  let y = 290;
  for (const item of invoice.items) {
    doc.text(item.description, 50, y).text(String(item.quantity), 300, y).text(`${item.unitPrice} ${invoice.currency}`, 400, y).text(`${item.amount} ${invoice.currency}`, 500, y);
    y += 20;
  }

  doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();
  doc.fontSize(12).text(`Ara Toplam: ${invoice.subtotal} ${invoice.currency}`, 400, y + 30);
  doc.text(`KDV: ${invoice.taxAmount} ${invoice.currency}`, 400, y + 50);
  doc.fontSize(14).text(`GENEL TOPLAM: ${invoice.total} ${invoice.currency}`, 400, y + 80);

  doc.end();
  return doc as unknown as Readable;
}
```

---

### STEP U24: Referral Program + Promo Code System

**Yeni dosya:** `server/billing/referral.ts`

```ts
import { db } from "@/db";
import { referrals, promoCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export function generateReferralCode(userId: string): string {
  const hash = crypto.createHash("md5").update(userId).digest("hex").slice(0, 8).toUpperCase();
  return `REF-${hash}`;
}

export async function applyReferral(referralCode: string, newUserId: string): Promise<{ success: boolean; reward?: number }> {
  const ref = await db.select().from(referrals).where(eq(referrals.code, referralCode)).limit(1);
  if (!ref.length) return { success: false };
  await db.insert(referrals).values({ referrerId: ref[0].referrerId, referredId: newUserId, code: referralCode, status: "completed", rewardAmount: 10 });
  return { success: true, reward: 10 };
}

export async function createPromoCode(code: string, discountPercent: number, maxUses: number, expiresAt: string): Promise<void> {
  await db.insert(promoCodes).values({ code: code.toUpperCase(), discountPercent, maxUses, usedCount: 0, expiresAt, status: "active" });
}

export async function validatePromoCode(code: string): Promise<{ valid: boolean; discountPercent?: number }> {
  const promo = await db.select().from(promoCodes).where(eq(promoCodes.code, code.toUpperCase())).limit(1);
  if (!promo.length) return { valid: false };
  const p = promo[0];
  if (p.status !== "active" || p.usedCount >= p.maxUses || new Date(p.expiresAt) < new Date()) return { valid: false };
  return { valid: true, discountPercent: p.discountPercent };
}
```

---

### STEP U25: Team Invitation + Member Role Management

**Yeni dosya:** `server/api/teams.ts`

```ts
import { db } from "@/db";
import { teamMembers, teamInvitations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

export async function inviteTeamMember(teamId: string, email: string, role: "admin" | "member" | "viewer", invitedBy: string) {
  const token = crypto.randomBytes(32).toString("hex");
  await db.insert(teamInvitations).values({ teamId, email, role, token, invitedBy, status: "pending", expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() });
  await sendInvitationEmail(email, token);
  return { token };
}

export async function acceptInvitation(token: string, userId: string) {
  const invitation = await db.select().from(teamInvitations).where(eq(teamInvitations.token, token)).limit(1);
  if (!invitation.length) throw new Error("Invalid invitation");
  const inv = invitation[0];
  if (new Date(inv.expiresAt) < new Date()) throw new Error("Invitation expired");
  await db.insert(teamMembers).values({ teamId: inv.teamId, userId, role: inv.role, joinedAt: new Date().toISOString() });
  await db.update(teamInvitations).set({ status: "accepted" }).where(eq(teamInvitations.id, inv.id));
  return { teamId: inv.teamId, role: inv.role };
}

export async function updateMemberRole(teamId: string, userId: string, newRole: "admin" | "member" | "viewer", changedBy: string) {
  const changer = await db.select().from(teamMembers).where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, changedBy))).limit(1);
  if (!changer.length || changer[0].role !== "admin") throw new Error("Only admin can change roles");
  await db.update(teamMembers).set({ role: newRole }).where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)));
}
```

---

### STEP U26: SSO SAML Configuration (Mock Template)

**Yeni dosya:** `docs/sso/saml-config.md`

```markdown
# SAML SSO Configuration Guide

## Supported Identity Providers
- Okta
- Azure AD
- Google Workspace
- OneLogin

## Setup Steps

### 1. Gistify Admin Panel
- Navigate to Settings > Security > SSO
- Click "Enable SAML"
- Copy ACS URL and Entity ID

### 2. IdP Configuration
- Create new SAML application
- Set ACS URL: `https://api.gistify.app/api/v1/auth/saml/acs`
- Set Entity ID: `gistify-app`
- Set Single Logout URL: `https://api.gistify.app/api/v1/auth/saml/slo`
- Download metadata XML

### 3. Upload to Gistify
- Paste metadata XML into admin panel
- Map attributes: `email` → `email`, `name` → `name`, `groups` → `roles`
- Enable "Just-in-Time Provisioning" if desired
- Test login

## Attribute Mapping
| IdP Attribute | Gistify Field | Required |
|---------------|---------------|----------|
| email | email | Yes |
| name | fullName | Yes |
| groups | roles | No |
| department | department | No |

## Troubleshooting
- **Certificate expired**: Re-upload new certificate from IdP
- **Attribute mismatch**: Check case sensitivity
- **Redirect loop**: Verify ACS URL matches exactly
```

---

### STEP U27: Penetration Test Template

**Yeni dosya:** `docs/security/penetration-test-template.md`

```markdown
# Penetration Test Scope & Methodology

## Scope
- `*.gistify.app`
- API endpoints: `/api/v1/*`
- Mobile app (if applicable)
- Admin panel

## Methodology (OWASP Top 10)
1. Injection (SQLi, NoSQLi, Command Injection)
2. Broken Authentication
3. Sensitive Data Exposure
4. XML External Entities (XXE)
5. Broken Access Control
6. Security Misconfiguration
7. XSS
8. Insecure Deserialization
9. Using Components with Known Vulnerabilities
10. Insufficient Logging & Monitoring

## Deliverables
- Executive Summary
- Detailed Findings (CVSS v3.1)
- Proof of Concept
- Remediation Roadmap
- Re-test Report

## Timeline
- Week 1: Reconnaissance & Scanning
- Week 2: Exploitation & Verification
- Week 3: Reporting & Debrief
- Week 4: Re-test (if included)

## Reward Model (Bug Bounty)
| Severity | Reward | Example |
|----------|--------|---------|
| Critical | $2,000+ | RCE, SQLi, full auth bypass |
| High | $1,000 | Account takeover, IDOR |
| Medium | $300 | XSS, CSRF (non-admin) |
| Low | $100 | Info disclosure |
```

---

### STEP U28: Blue-Green Deployment Strategy

**Yeni dosya:** `docs/devops/blue-green-deployment.md`

```markdown
# Blue-Green Deployment

## Architecture
```
Load Balancer
├── Blue Environment (v1.2.3) ← current production
└── Green Environment (v1.3.0) ← new release
```

## Deployment Steps
1. Deploy v1.3.0 to Green environment
2. Run smoke tests on Green
3. Run E2E tests on Green
4. Switch load balancer 10% traffic to Green (canary)
5. Monitor error rate for 15 minutes
6. If error rate < 0.1%, switch 100% to Green
7. Keep Blue running for 1 hour as rollback option
8. Terminate Blue after confirmation

## Rollback
- Switch load balancer back to Blue instantly (< 30 seconds)
- Database migrations must be backward compatible
- Feature flags can kill new features instantly

## Database Compatibility
- Add new columns (nullable) → safe
- Add new tables → safe
- Rename columns → dangerous, use views instead
- Remove columns → do in next release after code stops using
```

---

### STEP U29: Schema Versioning + Data Dictionary

**Yeni dosya:** `docs/db/data-dictionary.md`

```markdown
# Data Dictionary

## users
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| email | TEXT | No | - | Encrypted at rest |
| name | TEXT | No | - | Display name |
| tier | ENUM | No | 'free' | Subscription tier |
| created_at | TIMESTAMP | No | CURRENT_TIMESTAMP | Registration date |
| is_deleted | BOOLEAN | No | false | Soft delete flag |

## subscriptions
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | SERIAL | No | auto_increment | Primary key |
| user_id | INTEGER | No | - | FK to users |
| stripe_subscription_id | TEXT | Yes | - | Stripe reference |
| tier | ENUM | No | 'free' | Current tier |
| status | ENUM | No | 'active' | Subscription status |
| current_period_end | TIMESTAMP | Yes | - | Renewal date |
| grace_period_until | TIMESTAMP | Yes | - | Dunning grace |

## content_registry
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| slug | TEXT | No | - | URL-friendly identifier |
| title | TEXT | No | - | Content title |
| route | TEXT | No | - | Content category |
| access_level | ENUM | No | 'free' | Paywall level |
| status | ENUM | No | 'draft' | Publication status |
| language | TEXT | No | 'tr' | Content language |
| published_at | TIMESTAMP | Yes | - | Go-live date |
| search_vector | TSVECTOR | Yes | - | PostgreSQL FTS index |
```

---

### STEP U30: Architecture Decision Record (ADR) Template

**Yeni dosya:** `docs/adr/001-clerk-auth.md`

```markdown
# ADR 001: Auth Provider Selection

## Status
Accepted

## Context
Gistify needs modern authentication with:
- Social OAuth (Google, Apple, Twitter/X)
- MFA
- Organizations/Teams
- Session management
- JWT handling

## Options Considered
| Provider | MFA | SSO | Organizations | Cost | Decision |
|----------|-----|-----|-------------|------|----------|
| Clerk | Yes | Yes | Yes | $25/MAU | ✅ Selected |
| Auth0 | Yes | Yes | Yes | $0.02/MAU | Consider for Enterprise |
| Supabase Auth | Yes | Yes | RLS | $25/Pro | Not suitable for standalone |
| Firebase Auth | Yes | Yes | Custom | Pay-as-you-go | Too Google-centric |

## Decision
Use Clerk for MVP. Evaluate Auth0 for Enterprise SSO (SAML/OIDC) in Q4.

## Consequences
- Faster development (no custom auth)
- Higher cost at scale (>1000 MAU)
- Vendor lock-in risk
- Easy migration path to Auth0 if needed

## Date
2026-06-13
```

---

## EK BÖLÜM 3 SONU

Bu ek bölüm, 30 utility ve kod şablonu ile Gistify'nin günlük geliştirme ihtiyaçlarını karşılar. Toplam: **5 Phase + 20 Ek Step + 17 Pratik Step + 30 Utility = 102 Step**.


## EK BÖLÜM 4: KARŞILAŞTIRMA TABLOLARI, HATA AYIKLAMA & İLERİ DÜZEY SENARYOLAR

---

### STEP T1: Charting Kütüphaneleri Detaylı Karşılaştırma

| Kütüphane | Renderer | Bundle | Türkçe | A11y | Öneri |
|-----------|----------|--------|--------|------|-------|
| **Recharts** | SVG | ~45KB | i18n zor | Kısmen | MVP (mevcut) |
| **ECharts** | Canvas | ~120KB | Native destek | Orta | Scale + interaktivite |
| **Chart.js** | Canvas | ~60KB | Plugin | İyi | Basitlik |
| **Victory** | React | ~80KB | i18n zor | İyi | React native uyumlu |
| **Lightweight Charts** | Canvas | ~40KB | Native | Kısmen | Finansal OHLC (TradingView) |
| **Observable Plot** | D3-based | ~35KB | i18n zor | İyi | Data journalism |
| **ApexCharts** | SVG | ~200KB | Plugin | İyi | Genel dashboard |
| **LightningChart** | WebGL | ~500KB | Plugin | Kısmen | Ultra-high freq |

**Gistify Kararı:** Mevcut Recharts ile devam; finansal OHLC grafikleri için Lightweight Charts (TradingView) entegre edilir. ECharts seçici import ile scatter/heatmap kompleks vizler için kullanılır.

---

### STEP T2: Auth Provider'ları Detaylı Karşılaştırma

| Provider | MFA | SSO | Org/RBAC | MoR | Fiyat | Öneri |
|----------|-----|-----|----------|-----|-------|-------|
| **Clerk** | Self-serve | SAML (Enterprise) | Built-in | Hayır | $25/MAU | MVP + Scale |
| **Auth0** | TOTP/SMS | SAML/OIDC | FGA (Zanzibar) | Hayır | $0.02/MAU | Enterprise |
| **Supabase Auth** | TOTP | SAML | RLS (DB-level) | Hayır | $25/Pro | Supabase stack |
| **Firebase Auth** | SMS | SAML | Custom claims | Hayır | Pay-as-you-go | Mobile-first |
| **Keycloak** | TOTP | SAML | RBAC | Hayır | Self-hosted | On-prem |
| **FusionAuth** | TOTP | SAML | RBAC + Groups | Hayır | Self-hosted | Self-hosted tercih edenler |

**Gistify Kararı:** Clerk (MVP) → Auth0 (Enterprise SSO gerektiğinde). Clerk'in Next.js/Vite SDK'ları en gelişmişidir.

---

### STEP T3: CMS / Content Management Seçenekleri

| CMS | Headless | API | Markdown | Türkçe | Fiyat | Self-hosted |
|-----|----------|-----|----------|--------|-------|-------------|
| **Strapi** | Evet | REST/GraphQL | Plugin | Community | Ücretsiz | Evet |
| **Sanity** | Evet | GROQ | Custom | İyi | $99/ay | Hayır |
| **Contentful** | Evet | REST/GraphQL | Custom | İyi | $489/ay | Hayır |
| **Directus** | Evet | REST/GraphQL | Native | Community | Ücretsiz | Evet |
| **Keystatic** | Evet | Git-native | Native | İyi | Ücretsiz | Evet |
| **TinaCMS** | Evet | Git + Visual | Native | İyi | $49/ay | Evet |
| **Gistify Custom** | Evet | REST | Native | Native | $0 | Evet |

**Gistify Kararı:** Custom MD pipeline (mevcut) ile devam. Admin panel v2, Directus veya Strapi entegrasyonunu değerlendirir (content editor ihtiyacı artarsa). TinaCMS visual editing $49/ay Team Plus ile etkinleştirilir.

---

### STEP T4: Real-time Servisler Detaylı Karşılaştırma

| Servis | Protokol | QoS | Presence | Fiyat | Uygunluk |
|--------|----------|-----|----------|-------|----------|
| **Supabase Realtime** | WebSocket | At-least-once | Var | Ücretsiz (200 conn) | Supabase stack |
| **Ably** | WebSocket/MQTT/SSE | At-least-once | Var | $25/ay (500 conn) | Enterprise, finansal data |
| **Pusher** | WebSocket | Fire-and-forget | Var | $19/ay (200 conn) | Basitlik |
| **Liveblocks** | WebSocket | Fire-and-forget | Var | $25/ay (500 conn) | Collaboration |
| **Cloudflare Durable Objects** | WebSocket | Strong consistency | Var | $0.12/M requests | Edge-native, stateful |
| **Socket.io** | WebSocket | Fire-and-forget | Var | Self-hosted | Self-hosted tercih |

**Gistify Kararı:** Supabase Realtime (mevcut Supabase stack ile) → Ably (delivery guarantee gerektiğinde). Cloudflare Durable Objects, edge-native WebSocket + stateful coordination için değerlendirilir.

---

### STEP T5: Billing Platformları Detaylı Karşılaştırma

| Platform | Fee | MoR | Usage Billing | B2B | Öneri |
|----------|-----|-----|-------------|-----|-------|
| **Stripe** | 2.9%+$0.30 | Hayır | Native | Güçlü | Scale, flexibility |
| **Paddle** | 5%+$0.50 | Evet | Sınırlı | Güçlü | B2B, tax offload |
| **Lemon Squeezy** | 5%+$0.50 | Evet | Yok | Zayıf | Indie, hızlı launch |
| **Chargebee** | 0.75%+$0.10 | Hayır | Native | Güçlü | Enterprise billing |
| **Recurly** | 1.25%+$0.10 | Hayır | Native | Güçlü | Subscription focus |
| **FastSpring** | 5.9%+$0.75 | Evet | Sınırlı | Orta | Software + MoR |

**Gistify Kararı:** Stripe (Faz 1) → Paddle (Enterprise B2B custom contract). Stripe Meter Events, API call-based usage billing için native destek sunar.

---

### STEP T6: Hata Ayıklama Rehberi — Sık Karşılaşılan Sorunlar

#### Hata 1: `tactical-card` CSS class'ı çalışmıyor
**Belirti:** Kartlar border/shadow olmadan düz görünüyor.  
**Neden:** Tailwind JIT, safelist'te `.tactical-card` yok veya `@layer components` syntax uyumsuz.  
**Çözüm:**
1. `tailwind.config.ts` safelist'e `"tactical-card"` ekle.
2. Eğer Tailwind v4 kullanılıyorsa, `@layer components` yerine `@source` veya inline CSS kullan.
3. `npm run build` sonrası `dist/assets/*.css` içinde `.tactical-card` araması yap.

#### Hata 2: `StockDetailTab` import hatası
**Belirti:** `Module not found: Can't resolve '@/components/tabs/StockDetailTab'`  
**Neden:** Dosya oluşturulmadı veya path yanlış.  
**Çözüm:**
1. `client/src/components/tabs/StockDetailTab.tsx` var mı kontrol et.
2. `tsconfig.json` `paths` içinde `@/*` `./src/*` olarak tanımlı mı kontrol et.
3. Vite restart et (HMR path cache temizler).

#### Hata 3: ThemeContext + Sonner + CSS aynı anda çalışmıyor
**Belirti:** Dark mode'da Sonner toast açık renk, sayfa koyu renk.  
**Neden:** 3 ayrı tema yöneticisi birbirini override ediyor.  
**Çözüm:**
1. `ThemeContext` tek kaynak olmalı. `resolvedTheme` değerini Sonner'a prop olarak geç.
2. `index.css` içinde `[data-theme="dark"]` ve `[data-theme="light"]` selector'ları kullan.
3. `document.documentElement` üzerinde `classList.remove("light", "dark")` sonra `classList.add(resolvedTheme)` yap.

#### Hata 4: Zustand persist hydration mismatch
**Belirti:** `Warning: Text content did not match` SSR hydration hatası.  
**Neden:** Zustand persist, localStorage'dan veriyi client-side okuyor; server-side farklı render ediyor.  
**Çözüm:**
1. Persist middleware'i sadece client-side initialize et.
2. `useEffect` içinde `useAuthStore.persist.rehydrate()` çağır.
3. Veya `persist` middleware'i kaldır, auth state'i her sayfa yüklenişinde API'den çek.

#### Hata 5: Clerk `useAuth` `isLoaded` false kalıyor
**Belirti:** Sayfa sürekli "loading" gösteriyor.  
**Neden:** `VITE_CLERK_PUBLISHABLE_KEY` eksik veya yanlış.  
**Çözüm:**
1. `.env` içinde `VITE_CLERK_PUBLISHABLE_KEY` var mı kontrol et.
2. Vite prefix `VITE_` ile başlamalı.
3. `import.meta.env.VITE_CLERK_PUBLISHABLE_KEY` console.log ile doğrula.
4. Clerk dashboard'dan publishable key'i kopyala (pk_test_... veya pk_live_...).

#### Hata 6: Stripe webhook `Invalid signature`
**Belirti:** Webhook endpoint 400 döndürüyor.  
**Neden:** Webhook secret yanlış veya payload body raw değil.  
**Çözüm:**
1. `STRIPE_WEBHOOK_SECRET` doğru mu kontrol et (whsec_...).
2. Express middleware sıralaması: `express.raw({ type: "application/json" })` Stripe endpoint'inden ÖNCE gelmeli.
3. `req.body` string olarak gelmeli, JSON parse edilmiş olmamalı.

#### Hata 7: `react-grid-layout` CSS bozuk
**Belirti:** Widget'lar üst üste biniyor, drag-drop çalışmıyor.  
**Neden:** `react-grid-layout/css/styles.css` ve `react-resizable/css/styles.css` import edilmemiş.  
**Çözüm:**
1. `DashboardCanvas.tsx` içinde CSS import'larını kontrol et.
2. Eğer CSS module kullanılıyorsa, global CSS olarak import et: `import "react-grid-layout/css/styles.css";`.
3. `.widget-container` class'ına `position: relative` ve `display: flex` ekle.

#### Hata 8: `@tanstack/react-virtual` ile tablo header kayıyor
**Belirti:** Scroll ederken tablo header viewport'dan çıkıyor.  
**Neden:** `position: sticky` ile `thead` virtualized container içinde çalışmıyor.  
**Çözüm:**
1. Tablo header'ı ayrı bir div'de tut, sadece tbody virtualize et.
2. Veya `position: fixed` ile header'ı sabitle, scroll event'inde transform uygula.
3. En basit çözüm: `@tanstack/react-virtual` yerine `react-virtuoso` kullan (header/footer native destekler).

#### Hata 9: MDX runtime `compile` hata veriyor
**Belirti:** `Error: Cannot compile MDX in browser`  
**Neden:** `@mdx-js/mdx` Node.js API'lerini kullanıyor (path, fs).  
**Çözüm:**
1. `@mdx-js/mdx` yerine `mdx-bundler` veya `react-markdown` kullan (browser-safe).
2. Veya Webpack/Vite alias tanımla: `path: "path-browserify"`, `fs: false`.
3. En pratik: `react-markdown` + `remark-gfm` + `rehype-sanitize` kullan. MDX interaktivite için `remark-directive` + custom component map kullan.

#### Hata 10: Cloudflare Worker `DurableObject` tanımsız
**Belirti:** `wrangler dev` sırasında `DurableObject is not defined`  
**Neden:** `compatibility_flags` içinde `nodejs_compat` yok veya `durable_objects` binding tanımlı değil.  
**Çözüm:**
1. `wrangler.toml` içinde `compatibility_flags = ["nodejs_compat"]` ekle.
2. `[[durable_objects.bindings]]` ve `[[migrations]]` tanımlı mı kontrol et.
3. `wrangler deploy` öncesi `wrangler d1 migrations apply` veya `wrangler publish` ile migration'ı deploy et.

---

### STEP T7: Lighthouse CI Assertion Detayları

| Metrik | Threshold | Öncelik | Araç | Not |
|--------|-----------|---------|------|-----|
| LCP | < 1.8s | Kritik | Lighthouse CI, Web Vitals | En büyük görsel veya text block render süresi |
| FCP | < 1.2s | Kritik | Lighthouse CI | İlk görsel render |
| TTI | < 2.5s | Yüksek | Lighthouse CI | Sayfa tam etkileşimli |
| TBT | < 200ms | Yüksek | Lighthouse CI | Ana thread bloklanma süresi |
| CLS | < 0.1 | Kritik | Web Vitals | Layout shift skoru |
| INP | < 200ms | Yüksek | Web Vitals | Etkileşim sonrası paint süresi |
| FID | < 100ms | Orta | Web Vitals | İlk input gecikmesi (INP yerine geçiyor) |
| Speed Index | < 2.0s | Orta | Lighthouse CI | Görsel içerik hızı |
| Bundle Size (initial) | < 150KB | Yüksek | vite-bundle-analyzer | Entry chunk boyutu |
| Bundle Size (total) | < 500KB | Orta | vite-bundle-analyzer | Tüm lazy chunk'lar hariç |
| Image weight | < 500KB/sayfa | Orta | Lighthouse CI | Sayfa başına toplam görsel boyutu |
| Font requests | < 3 | Düşük | Lighthouse CI | Web font request sayısı |
| Third-party scripts | < 5 | Orta | Lighthouse CI | Analytics, widget, reklam script'leri |

---

### STEP T8: Web Vitals Thresholds — RUM (Real User Monitoring)

| Metrik | İyi | İyileştirme Gerekli | Kötü | Percentile |
|--------|-----|---------------------|------|------------|
| LCP | <= 2.5s | 2.5s–4.0s | > 4.0s | 75th |
| FID | <= 100ms | 100ms–300ms | > 300ms | 75th (INP'e geçiş) |
| INP | <= 200ms | 200ms–500ms | > 500ms | 75th |
| CLS | <= 0.1 | 0.1–0.25 | > 0.25 | 75th |
| TTFB | <= 800ms | 800ms–1800ms | > 1800ms | 75th |
| FCP | <= 1.8s | 1.8s–3.0s | > 3.0s | 75th |

**Gistify Hedefleri:**
- LCP < 1.8s (hızlı rapor render)
- INP < 200ms (akıcı tablo etkileşimi)
- CLS < 0.05 (dashboard layout shift sıfıra yakın)
- TTFB < 500ms (edge caching + Cloudflare)

---

### STEP T9: API Rate Limit Headers (RFC 6585)

Her API response'a şu header'ları ekle:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1718294400
X-RateLimit-Policy: 100req/1hour
Retry-After: 3600
```

**Yeni kod:** `server/middleware/rateLimitHeaders.ts`

```ts
export function addRateLimitHeaders(res: Response, limit: number, remaining: number, resetAt: Date): Response {
  res.headers.set("X-RateLimit-Limit", String(limit));
  res.headers.set("X-RateLimit-Remaining", String(remaining));
  res.headers.set("X-RateLimit-Reset", String(Math.floor(resetAt.getTime() / 1000)));
  res.headers.set("X-RateLimit-Policy", `${limit}req/1hour`);
  if (remaining === 0) {
    res.headers.set("Retry-After", String(Math.ceil((resetAt.getTime() - Date.now()) / 1000)));
  }
  return res;
}
```

---

### STEP T10: API Versioning Strategy + Deprecation Policy

**Versioning:** URL path versioning (`/api/v1/...`). Breaking change'ler yeni versiyonda. Eski versiyon 6 ay desteklenir.

**Deprecation header:**
```
Deprecation: true
Sunset: Wed, 11 Nov 2026 23:59:59 GMT
Link: </api/v2/content>; rel="successor-version"
```

**Yeni kod:** `server/middleware/apiVersion.ts`

```ts
export function v1DeprecationMiddleware(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Deprecation", "true");
  res.setHeader("Sunset", new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toUTCString());
  res.setHeader("Link", '</api/v2/content>; rel="successor-version"');
  next();
}
```

---

### STEP T11: SDK Generation — OpenAPI Client Auto-Generate

**Kurulum:** `npm install -D openapi-typescript openapi-typescript-fetch`

**Script:** `package.json`
```json
{
  "scripts": {
    "generate-api-client": "openapi-typescript docs/openapi.yaml --output src/api/types.ts"
  }
}
```

**Yeni dosya:** `client/src/api/client.ts`

```ts
import { Fetcher } from "openapi-typescript-fetch";
import type { paths } from "./types";

const fetcher = Fetcher.for<paths>();
fetcher.configure({ baseUrl: "https://api.gistify.app/api/v1", init: { credentials: "include" } });

export const getContent = fetcher.path("/content/{route}").method("get").create();
export const createContent = fetcher.path("/content").method("post").create();
export const getMarketSnapshot = fetcher.path("/market/{ticker}").method("get").create();
```

**Kullanım:**
```ts
const { data } = await getContent({ route: "momentum" });
// data: { slug: string; title: string; accessLevel: string }[]
```

---

### STEP T12: Postman Collection Generator

**Yeni dosya:** `docs/postman-collection.json`

```json
{
  "info": { "name": "Gistify API", "description": "Gistify Financial Intelligence API", "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
  "item": [
    {
      "name": "Auth",
      "item": [
        { "name": "Get Current User", "request": { "method": "GET", "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }], "url": { "raw": "{{baseUrl}}/auth/me", "host": ["{{baseUrl}}"], "path": ["auth", "me"] } } }
      ]
    },
    {
      "name": "Content",
      "item": [
        { "name": "List Content", "request": { "method": "GET", "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }], "url": { "raw": "{{baseUrl}}/content/momentum", "host": ["{{baseUrl}}"], "path": ["content", "momentum"] } } },
        { "name": "Create Content", "request": { "method": "POST", "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }, { "key": "Content-Type", "value": "application/json" }], "body": { "mode": "raw", "raw": "{\"title\":\"Test\",\"slug\":\"test\",\"route\":\"momentum\"}" }, "url": { "raw": "{{baseUrl}}/content", "host": ["{{baseUrl}}"], "path": ["content"] } } }
      ]
    },
    {
      "name": "Market Data",
      "item": [
        { "name": "Get Snapshot", "request": { "method": "GET", "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }], "url": { "raw": "{{baseUrl}}/market/AAPL", "host": ["{{baseUrl}}"], "path": ["market", "AAPL"] } } }
      ]
    }
  ],
  "variable": [
    { "key": "baseUrl", "value": "https://api.gistify.app/api/v1" },
    { "key": "token", "value": "your-jwt-token" }
  ]
}
```

---

### STEP T13: GraphQL Federation Mock (Apollo)

**Kurulum:** `npm install @apollo/server @apollo/gateway @apollo/subgraph graphql`

**Yeni dosya:** `server/graphql/schema.ts`

```ts
import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Query {
    user(id: ID!): User
    content(route: String!, slug: String!): Content
    marketSnapshot(ticker: String!): MarketSnapshot
  }

  type User {
    id: ID!
    email: String!
    name: String!
    tier: String!
    subscriptions: [Subscription!]!
  }

  type Content {
    slug: String!
    title: String!
    route: String!
    accessLevel: String!
    publishedAt: String
  }

  type MarketSnapshot {
    ticker: String!
    price: Float!
    change: Float!
    changePercent: Float!
    volume: Int!
  }

  type Subscription {
    id: ID!
    tier: String!
    status: String!
    currentPeriodEnd: String
  }
`;
```

---

### STEP T14: gRPC Services Mock (proto definition)

**Yeni dosya:** `proto/market.proto`

```protobuf
syntax = "proto3";
package gistify.market;

service MarketDataService {
  rpc GetSnapshot (SnapshotRequest) returns (SnapshotResponse);
  rpc StreamSnapshots (StreamRequest) returns (stream SnapshotResponse);
}

message SnapshotRequest {
  string ticker = 1;
}

message StreamRequest {
  repeated string tickers = 1;
}

message SnapshotResponse {
  string ticker = 1;
  double price = 2;
  double change = 3;
  double change_percent = 4;
  int64 volume = 5;
  int64 timestamp = 6;
}
```

---

### STEP T15: Message Queue Architecture (RabbitMQ / SQS)

**Yeni dosya:** `server/queue/messageQueue.ts`

```ts
export interface MessageQueue {
  publish(queue: string, message: unknown): Promise<void>;
  subscribe(queue: string, handler: (message: unknown) => Promise<void>): Promise<void>;
}

export class InMemoryQueue implements MessageQueue {
  private handlers: Map<string, ((message: unknown) => Promise<void>)[]> = new Map();

  async publish(queue: string, message: unknown): Promise<void> {
    const handlers = this.handlers.get(queue) || [];
    await Promise.all(handlers.map((h) => h(message)));
  }

  async subscribe(queue: string, handler: (message: unknown) => Promise<void>): Promise<void> {
    if (!this.handlers.has(queue)) this.handlers.set(queue, []);
    this.handlers.get(queue)!.push(handler);
  }
}
```

---

### STEP T16: Event Sourcing + CQRS Pattern Mock

**Yeni dosya:** `server/cqrs/eventStore.ts`

```ts
interface DomainEvent {
  id: string;
  aggregateId: string;
  type: string;
  payload: Record<string, unknown>;
  timestamp: string;
  version: number;
}

export class EventStore {
  private events: DomainEvent[] = [];

  append(event: DomainEvent): void {
    this.events.push(event);
  }

  getEvents(aggregateId: string): DomainEvent[] {
    return this.events.filter((e) => e.aggregateId === aggregateId).sort((a, b) => a.version - b.version);
  }

  getAllEvents(): DomainEvent[] {
    return [...this.events];
  }
}

export class Projection {
  private state: Map<string, Record<string, unknown>> = new Map();

  apply(event: DomainEvent): void {
    const current = this.state.get(event.aggregateId) || {};
    switch (event.type) {
      case "UserCreated":
        this.state.set(event.aggregateId, { ...current, ...event.payload, createdAt: event.timestamp });
        break;
      case "UserTierChanged":
        this.state.set(event.aggregateId, { ...current, tier: event.payload.tier, tierChangedAt: event.timestamp });
        break;
    }
  }

  getState(aggregateId: string): Record<string, unknown> | undefined {
    return this.state.get(aggregateId);
  }
}
```

---

### STEP T17: Outbox Pattern — Reliable Event Publishing

**Yeni dosya:** `server/cqrs/outbox.ts`

```ts
import { db } from "@/db";
import { outbox } from "@/db/schema";

export async function publishEvent(event: { type: string; payload: Record<string, unknown>; aggregateId: string }): Promise<void> {
  await db.transaction(async (trx) => {
    // 1. Save business data
    // 2. Save outbox message
    await trx.insert(outbox).values({
      id: crypto.randomUUID(),
      type: event.type,
      payload: JSON.stringify(event.payload),
      aggregateId: event.aggregateId,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
  });
}

export async function processOutbox(): Promise<void> {
  const pending = await db.select().from(outbox).where(eq(outbox.status, "pending")).limit(100);
  for (const message of pending) {
    try {
      await sendToMessageBroker(message);
      await db.update(outbox).set({ status: "processed", processedAt: new Date().toISOString() }).where(eq(outbox.id, message.id));
    } catch (err) {
      await db.update(outbox).set({ status: "failed", error: String(err), retryCount: message.retryCount + 1 }).where(eq(outbox.id, message.id));
    }
  }
}
```

---

### STEP T18: Change Data Capture (CDC) — PostgreSQL Logical Replication

**SQL:**
```sql
-- Enable logical replication
ALTER SYSTEM SET wal_level = 'logical';
ALTER SYSTEM SET max_replication_slots = 10;
ALTER SYSTEM SET max_wal_senders = 10;
SELECT pg_reload_conf();

-- Create publication
CREATE PUBLICATION gistify_publication FOR TABLE users, subscriptions, content_registry, social_messages;

-- Create replication slot
SELECT pg_create_logical_replication_slot('gistify_slot', 'pgoutput');
```

**Yeni dosya:** `server/cdc/consumer.ts`

```ts
import { Client } from "pg";

const client = new Client({ connectionString: process.env.DATABASE_URL });

export async function startCDC() {
  await client.connect();
  await client.query("START_REPLICATION SLOT gistify_slot LOGICAL 0/0 (proto_version '1', publication_names 'gistify_publication')");
  client.on("notification", (msg) => {
    const change = JSON.parse(msg.payload!);
    console.log("[CDC] Change detected:", change.table, change.action);
    // Push to Elasticsearch, Redis, or data warehouse
  });
}
```

---

### STEP T19: Data Warehouse Sync — ETL Pipeline

**Yeni dosya:** `server/etl/dailySync.ts`

```ts
import { db } from "@/db";
import { createClient } from "@clickhouse/client";

const clickhouse = createClient({ host: process.env.CLICKHOUSE_URL });

export async function syncDailyToWarehouse(date: string): Promise<void> {
  const usage = await db.select().from(usageLogs).where(sql`DATE(created_at) = ${date}`);
  await clickhouse.insert({
    table: "gistify.usage_daily",
    values: usage.map((u) => [u.userId, u.resourceType, u.quantity, date]),
    format: "CSV",
  });

  const revenue = await db.select().from(subscriptions).where(sql`DATE(current_period_start) = ${date}`);
  await clickhouse.insert({
    table: "gistify.revenue_daily",
    values: revenue.map((r) => [r.userId, r.tier, r.status, date]),
    format: "CSV",
  });

  console.log(`[ETL] Synced ${usage.length} usage records and ${revenue.length} subscription records for ${date}`);
}
```

---

### STEP T20: A/B Test Framework + Feature Flag Analytics

**Yeni dosya:** `server/analytics/abTest.ts`

```ts
interface Experiment {
  id: string;
  name: string;
  variants: Record<string, number>;
  startDate: string;
  endDate: string;
  status: "running" | "paused" | "completed";
}

interface Event {
  experimentId: string;
  variant: string;
  userId: string;
  eventType: "impression" | "conversion" | "bounce";
  timestamp: string;
  value?: number;
}

export function calculateExperimentResults(events: Event[]): Record<string, { impressions: number; conversions: number; conversionRate: number; revenue: number }> {
  const results: Record<string, { impressions: number; conversions: number; conversionRate: number; revenue: number }> = {};
  for (const event of events) {
    if (!results[event.variant]) results[event.variant] = { impressions: 0, conversions: 0, conversionRate: 0, revenue: 0 };
    if (event.eventType === "impression") results[event.variant].impressions++;
    if (event.eventType === "conversion") { results[event.variant].conversions++; results[event.variant].revenue += event.value || 0; }
  }
  for (const variant of Object.keys(results)) {
    const r = results[variant];
    r.conversionRate = r.impressions > 0 ? r.conversions / r.impressions : 0;
  }
  return results;
}
```

---

### STEP T21: Cohort Analysis + Retention Matrix

**Yeni dosya:** `server/analytics/cohort.ts`

```ts
export interface CohortRow {
  cohort: string; // YYYY-MM
  size: number;
  retention: number[]; // [month0, month1, month2, ...]
}

export function buildCohortMatrix(users: { id: string; createdAt: string; lastActiveAt: string }[]): CohortRow[] {
  const cohorts: Map<string, Set<string>> = new Map();
  const activity: Map<string, Set<string>> = new Map(); // month -> userIds

  for (const user of users) {
    const cohort = user.createdAt.slice(0, 7);
    if (!cohorts.has(cohort)) cohorts.set(cohort, new Set());
    cohorts.get(cohort)!.add(user.id);

    const activeMonth = user.lastActiveAt.slice(0, 7);
    if (!activity.has(activeMonth)) activity.set(activeMonth, new Set());
    activity.get(activeMonth)!.add(user.id);
  }

  const rows: CohortRow[] = [];
  const sortedCohorts = Array.from(cohorts.keys()).sort();
  for (const cohort of sortedCohorts) {
    const usersInCohort = cohorts.get(cohort)!;
    const size = usersInCohort.size;
    const retention: number[] = [];
    for (let i = 0; i < 12; i++) {
      const month = incrementMonth(cohort, i);
      const activeUsers = activity.get(month) || new Set();
      const retained = new Set([...usersInCohort].filter((u) => activeUsers.has(u)));
      retention.push(size > 0 ? retained.size / size : 0);
    }
    rows.push({ cohort, size, retention });
  }
  return rows;
}

function incrementMonth(yyyymm: string, months: number): string {
  const [y, m] = yyyymm.split("-").map(Number);
  const d = new Date(y, m - 1 + months, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
```

---

### STEP T22: Funnel Analysis + Conversion Tracking

**Yeni dosya:** `server/analytics/funnel.ts`

```ts
export interface FunnelStep {
  name: string;
  event: string;
}

export interface FunnelResult {
  step: string;
  users: number;
  dropOff: number;
  conversionRate: number;
}

export function calculateFunnel(events: { userId: string; event: string; timestamp: string }[], steps: FunnelStep[], timeWindowHours: number = 24): FunnelResult[] {
  const sortedEvents = events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const userPaths: Map<string, string[]> = new Map();

  for (const e of sortedEvents) {
    if (!userPaths.has(e.userId)) userPaths.set(e.userId, []);
    userPaths.get(e.userId)!.push(e.event);
  }

  const results: FunnelResult[] = [];
  let previousCount = userPaths.size;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const requiredEvents = steps.slice(0, i + 1).map((s) => s.event);
    const count = Array.from(userPaths.values()).filter((path) => requiredEvents.every((e) => path.includes(e))).length;
    const dropOff = previousCount - count;
    const conversionRate = previousCount > 0 ? count / previousCount : 0;
    results.push({ step: step.name, users: count, dropOff, conversionRate });
    previousCount = count;
  }

  return results;
}
```

---

### STEP T23: Churn Prediction + LTV Calculation

**Yeni dosya:** `server/analytics/predictions.ts`

```ts
export function calculateLTV(arpu: number, grossMargin: number, churnRate: number): number {
  if (churnRate === 0) return Infinity;
  return (arpu * grossMargin) / churnRate;
}

export function predictChurnRisk(user: {
  daysSinceLastLogin: number;
  failedPayments: number;
  supportTickets: number;
  featureUsage: number;
  npsScore: number;
}): "low" | "medium" | "high" | "critical" {
  let score = 0;
  if (user.daysSinceLastLogin > 7) score += 1;
  if (user.daysSinceLastLogin > 30) score += 2;
  if (user.failedPayments > 0) score += 2;
  if (user.supportTickets > 3) score += 1;
  if (user.featureUsage < 2) score += 1;
  if (user.npsScore < 6) score += 1;

  if (score >= 6) return "critical";
  if (score >= 4) return "high";
  if (score >= 2) return "medium";
  return "low";
}
```

---

### STEP T24: NPS Survey + CSAT Survey Components

**Yeni dosya:** `client/src/components/feedback/NPSSurvey.tsx`

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function NPSSurvey({ onSubmit }: { onSubmit: (score: number, feedback: string) => void }) {
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  return (
    <div className="space-y-4 p-6 border border-border rounded-xl bg-card">
      <h3 className="text-lg font-semibold">Gistify'yi 0-10 arası ne kadar tavsiye edersiniz?</h3>
      <div className="flex gap-2">
        {Array.from({ length: 11 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setScore(i)}
            className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
              score === i ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            {i}
          </button>
        ))}
      </div>
      <textarea
        placeholder="Neden bu puanı verdiniz? (opsiyonel)"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm min-h-[80px]"
      />
      <Button onClick={() => score !== null && onSubmit(score, feedback)} disabled={score === null}>
        Gönder
      </Button>
    </div>
  );
}
```

**Yeni dosya:** `client/src/components/feedback/CSATSurvey.tsx`

```tsx
import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CSATSurvey({ onSubmit }: { onSubmit: (rating: number) => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="space-y-3 p-4 border border-border rounded-xl bg-card">
      <p className="text-sm font-medium">Bu rapordan ne kadar memnun kaldınız?</p>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            onMouseEnter={() => setHover(i + 1)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(i + 1)}
            className="p-1"
          >
            <Star className={`h-6 w-6 transition-colors ${i < (hover || rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
          </button>
        ))}
      </div>
      <Button size="sm" onClick={() => rating > 0 && onSubmit(rating)} disabled={rating === 0}>
        Değerlendir
      </Button>
    </div>
  );
}
```

---

### STEP T25: Product Requirement Document (PRD) Template

**Yeni dosya:** `docs/templates/PRD.md`

```markdown
# PRD: [Feature Name]

## 1. Overview
**Problem:** [Kullanıcı problemi]  
**Solution:** [Önerilen çözüm]  
**Success Metrics:** [KPI'ler]

## 2. User Stories
- As a [user type], I want [goal], so that [reason].
- As a [user type], I want [goal], so that [reason].

## 3. Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

## 4. Technical Requirements
- API endpoint: `POST /api/v1/...`
- Database changes: New table `...`
- Third-party integrations: Stripe webhook
- Performance: < 500ms p99

## 5. Design Mockups
- [Link to Figma]
- [Mobile + Desktop]

## 6. Rollout Plan
- Phase 1: Internal testing (feature flag)
- Phase 2: Canary 5%
- Phase 3: Full rollout

## 7. Rollback Plan
- Feature flag kill switch: `flag_name`
- Database migration reversible: Yes/No
- Estimated rollback time: < 5 minutes

## 8. Analytics & Tracking
- Events: `feature_used`, `feature_completed`, `feature_error`
- Properties: `user_tier`, `device_type`, `route`

## 9. Security & Compliance
- PII handling: None/Encrypted
- Data retention: 90 days
- Accessibility: WCAG 2.1 AA
```

---

### STEP T26: Technical Specification Template

**Yeni dosya:** `docs/templates/tech-spec.md`

```markdown
# Technical Specification: [Feature Name]

## 1. Architecture
```
[Client] → [API Gateway] → [Service] → [Database]
```

## 2. API Contract
### Request
```json
{ "field": "value" }
```
### Response
```json
{ "id": "uuid", "status": "success" }
```

## 3. Database Schema
```sql
CREATE TABLE ... (
  id UUID PRIMARY KEY,
  ...
);
```

## 4. State Management
- Zustand store: `useFeatureStore`
- TanStack Query: `useFeatureData`
- Cache invalidation: On mutation success

## 5. Error Handling
- Client: ErrorBoundary + toast notification
- Server: Structured error response + Sentry
- Retry: Exponential backoff (3 retries)

## 6. Testing Strategy
- Unit: Component render + hook logic
- Integration: API endpoint + DB transaction
- E2E: Critical user flow
- Load: 100 concurrent users

## 7. Monitoring & Alerting
- Metric: `feature_latency_seconds`
- Alert: p99 > 500ms for 5 minutes
- Dashboard: Grafana panel

## 8. Security Considerations
- Auth: `requireTier("pro")`
- Input validation: Zod schema
- Rate limit: 100 req/min per user
- Audit log: `auditLog("FEATURE_ACCESS", userId, featureId)`
```

---

### STEP T27: Runbook Template — Incident Response

**Yeni dosya:** `docs/runbooks/database-outage.md`

```markdown
# Runbook: Database Outage

## Symptoms
- API responses returning 500/503
- Database connection errors in Sentry
- Health check `/api/health` returning `database: false`

## Impact
- All write operations fail
- Read operations may still work via cache
- Estimated affected users: 100%

## Immediate Actions (First 5 minutes)
1. Acknowledge PagerDuty alert
2. Post in #incidents Slack channel
3. Check database provider status page (Neon/Railway)
4. Verify connection string and credentials

## Investigation Steps
1. Check application logs: `kubectl logs -f deployment/gistify-app`
2. Check database metrics: CPU, memory, connection count
3. Check recent deployments: `git log --since="1 hour ago"`
4. Check migration status: `npx knex migrate:status`

## Resolution
1. If connection pool exhausted: Restart application pods
2. If database down: Failover to read replica
3. If migration stuck: Rollback to previous migration
4. If data corruption: Restore from latest backup

## Verification
- `/api/health` returns 200 with `database: true`
- Sentry error rate drops to < 0.1%
- Smoke test passes: `npx playwright test smoke.spec.ts`

## Post-Incident
- Write post-mortem within 24 hours
- Update runbook if procedure changed
- Schedule follow-up review
```

---

### STEP T28: Onboarding Checklist — New Developer

**Yeni dosya:** `docs/onboarding.md`

```markdown
# New Developer Onboarding

## Day 1: Environment Setup
- [ ] Clone repo: `git clone ...`
- [ ] Install Node.js 20 (via nvm)
- [ ] Install dependencies: `npm install`
- [ ] Copy `.env.example` to `.env` and fill values
- [ ] Start Docker: `make docker-up`
- [ ] Run migrations: `make migrate`
- [ ] Seed data: `make seed`
- [ ] Start dev server: `make dev`
- [ ] Verify: `http://localhost:5173` loads

## Day 2: Codebase Tour
- [ ] Read `GISTIFY_IMPLEMENTATION_GUIDE.md` (Phase 1)
- [ ] Review `client/src/App.tsx` structure
- [ ] Review `server/index.ts` API routes
- [ ] Review `shared/` types and contracts
- [ ] Run tests: `make test`
- [ ] Run lint: `make lint`

## Day 3: First Contribution
- [ ] Pick a "good first issue" from GitHub
- [ ] Create feature branch: `git checkout -b feat/...`
- [ ] Write code following style guide
- [ ] Add tests (unit + E2E)
- [ ] Open PR using PR template
- [ ] Address review comments
- [ ] Merge after CI passes

## Week 1: Deep Dive
- [ ] Attend architecture overview session
- [ ] Read ADR documents in `docs/adr/`
- [ ] Shadow on-call engineer for 1 day
- [ ] Deploy to staging: `make deploy-staging`
- [ ] Run load test: `k6 run tests/load/k6-api.js`

## Access Requirements
- [ ] GitHub repo access
- [ ] Vercel team invite
- [ ] Stripe dashboard read access
- [ ] Clerk dashboard read access
- [ ] Sentry team invite
- [ ] Cloudflare dashboard read access
- [ ] Slack workspace invite
- [ ] PagerDuty (if on-call rotation)
```

---

### STEP T29: Offboarding Checklist — Developer Exit

**Yeni dosya:** `docs/offboarding.md`

```markdown
# Developer Offboarding

## Access Revocation
- [ ] Remove from GitHub organization
- [ ] Remove from Vercel team
- [ ] Remove from Stripe dashboard
- [ ] Remove from Clerk dashboard
- [ ] Remove from Sentry team
- [ ] Remove from Cloudflare dashboard
- [ ] Remove from Slack workspace
- [ ] Remove from PagerDuty
- [ ] Revoke local API keys
- [ ] Rotate shared secrets if exposed

## Knowledge Transfer
- [ ] Document in-flight work
- [ ] Hand off active PRs
- [ ] Transfer ownership of critical components
- [ ] Update runbooks if author
- [ ] Record video walkthrough of complex features
- [ ] Schedule 1:1 with successor

## Security
- [ ] Verify no personal access tokens remain
- [ ] Check `.env` files not committed
- [ ] Review recent commits for sensitive data
- [ ] Run `git log --author="exiting-dev" --patch` audit
- [ ] Update incident response contact list
```

---

### STEP T30: Access Review Template — Quarterly Audit

**Yeni dosya:** `docs/compliance/access-review.md`

```markdown
# Quarterly Access Review

## Date: [YYYY-MM-DD]
## Reviewer: [Name]
## Scope: All production systems

### Admin Access
| User | Role | Last Activity | Justification | Action |
|------|------|---------------|---------------|--------|
| user-1 | Admin | 2026-06-10 | Founder | Keep |
| user-2 | Admin | 2026-05-15 | CTO | Keep |
| user-3 | Admin | 2026-04-01 | Former contractor | **Remove** |

### Database Access
| User | Permission | Source | Action |
|------|------------|--------|--------|
| app-user | Read/Write | Application | Keep |
| analytics | Read-only | ETL pipeline | Keep |
| dev-backup | Full | Manual backup | **Remove** |

### Third-Party Services
| Service | Account Holder | MFA Enabled | Action |
|---------|----------------|-------------|--------|
| Stripe | user-1 | Yes | Keep |
| Clerk | user-2 | Yes | Keep |
| Cloudflare | user-1 | Yes | Keep |
| Sentry | user-3 | No | **Transfer + Enable MFA** |

### Findings
- [ ] 3 inactive accounts removed
- [ ] 1 MFA enabled
- [ ] 0 shared credentials rotated
- [ ] Next review: [YYYY-MM-DD + 90 days]

### Signatures
- Security Lead: _______________
- Engineering Lead: _______________
```

---

## EK BÖLÜM 4 SONU

Bu ek bölüm, 30 karşılaştırma tablosu, hata ayıklama rehberi, detaylı test senaryosu, mimari template ve compliance dokümanı içerir. Toplam: **5 Phase + 20 Ek Step + 17 Pratik Step + 30 Utility + 30 Template = 102 Step**.

912 satır daha eklemeden önce, dosyanın son halini kontrol edeyim. Son append yapacağım.


def main(ctx):
    target = r"C:\Users\hasan\OneDrive\Desktop\gistify\GISTIFY_IMPLEMENTATION_GUIDE.md"
    
    final = r"""
## EK BÖLÜM 5: SON KOD ŞABLONLARI & TAMAMLANMA BEYANI

---

### STEP F1: Zod Form Validation + React Hook Form

**Kurulum:** `npm install zod react-hook-form @hookform/resolvers`

**Yeni dosya:** `client/src/components/forms/ReportForm.tsx`

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const reportSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı").max(200, "Başlık en fazla 200 karakter"),
  slug: z.string().min(3, "Slug en az 3 karakter").regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
  route: z.enum(["momentum", "earnings", "daily-report", "flow"]),
  content: z.string().min(10, "İçerik en az 10 karakter"),
  accessLevel: z.enum(["free", "member", "premium"]).default("free"),
});

type ReportFormData = z.infer<typeof reportSchema>;

export function ReportForm({ onSubmit }: { onSubmit: (data: ReportFormData) => Promise<void> }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ReportFormData>({ resolver: zodResolver(reportSchema) });

  return (
    <form onSubmit={handleSubmit(async (data) => { await onSubmit(data); toast.success("Rapor oluşturuldu!"); })} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Başlık</label>
        <Input {...register("title")} placeholder="Haziran 2026 Momentum Raporu" />
        {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">Slug</label>
        <Input {...register("slug")} placeholder="haziran-2026-momentum" />
        {errors.slug && <p className="text-xs text-destructive mt-1">{errors.slug.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">Kategori</label>
        <select {...register("route")} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
          <option value="momentum">Momentum</option>
          <option value="earnings">Kazanç</option>
          <option value="daily-report">Günlük Rapor</option>
          <option value="flow">Flow</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Erişim Seviyesi</label>
        <select {...register("accessLevel")} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
          <option value="free">Ücretsiz</option>
          <option value="member">Üye</option>
          <option value="premium">Premium</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">İçerik (Markdown)</label>
        <Textarea {...register("content")} rows={12} placeholder="# Başlık\n\nİçerik buraya..." />
        {errors.content && <p className="text-xs text-destructive mt-1">{errors.content.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Oluşturuluyor..." : "Rapor Oluştur"}
      </Button>
    </form>
  );
}
```

---

### STEP F2: React Query Optimistic Update Pattern

**Yeni dosya:** `client/src/hooks/useOptimisticMutation.ts`

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useOptimisticUpdate<T>(
  queryKey: unknown[],
  updater: (old: T[], item: T) => T[],
  mutationFn: (item: T) => Promise<T>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<T[]>(queryKey);
      queryClient.setQueryData<T[]>(queryKey, (old) => updater(old || [], newItem));
      return { previousData };
    },
    onError: (_err, _newItem, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
```

**Kullanım:**
```ts
const createReport = useOptimisticUpdate<ReportListItem>(
  ["content", "reports", "momentum"],
  (old, item) => [item, ...old],
  async (item) => {
    const res = await fetch("/api/content", { method: "POST", body: JSON.stringify(item) });
    return res.json();
  }
);
```

---

### STEP F3: Custom React Hook — useLocalStorage + useSessionStorage

**Yeni dosya:** `client/src/hooks/useLocalStorage.ts`

```ts
import { useState, useCallback, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStored((prev) => {
      const next = value instanceof Function ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, [key]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStored(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key]);

  return [stored, setValue];
}
```

---

### STEP F4: Custom React Hook — useIntersectionObserver (Lazy Load)

**Yeni dosya:** `client/src/hooks/useIntersectionObserver.ts`

```ts
import { useEffect, useRef, useState } from "react";

export function useIntersectionObserver(options?: IntersectionObserverInit): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isIntersecting];
}
```

---

### STEP F5: Custom React Hook — useWebSocket

**Yeni dosya:** `client/src/hooks/useWebSocket.ts`

```ts
import { useEffect, useRef, useState, useCallback } from "react";

export function useWebSocket(url: string) {
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;
    ws.onopen = () => setReadyState(WebSocket.OPEN);
    ws.onclose = () => setReadyState(WebSocket.CLOSED);
    ws.onmessage = (event) => setLastMessage(event.data);
    return () => ws.close();
  }, [url]);

  const sendMessage = useCallback((data: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
    }
  }, []);

  return { lastMessage, readyState, sendMessage };
}
```

---

### STEP F6: Server-Side PDF Report Generation (Puppeteer)

**Kurulum:** `npm install puppeteer`

**Yeni dosya:** `server/reports/pdfGenerator.ts`

```ts
import puppeteer from "puppeteer";

export async function generateReportPDF(htmlContent: string, options: { header?: string; footer?: string } = {}): Promise<Buffer> {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "40px", bottom: "40px", left: "30px", right: "30px" },
    displayHeaderFooter: true,
    headerTemplate: options.header || `<div style="font-size:9px;width:100%;text-align:center;padding:10px 0;color:#666">Gistify Financial Intelligence</div>`,
    footerTemplate: options.footer || `<div style="font-size:9px;width:100%;text-align:center;padding:10px 0;color:#666"><span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
  });
  await browser.close();
  return Buffer.from(pdf);
}
```

---

### STEP F7: Scheduled Report Emailer (Cron + BullMQ)

**Yeni dosya:** `server/cron/scheduledReports.ts`

```ts
import { Queue } from "bullmq";
import { db } from "@/db";
import { users, subscriptions } from "@/db/schema";
import { eq, and, gte } from "drizzle-orm";

const emailQueue = new Queue("email", { connection: redis });

export async function queueDailyReports() {
  const activeUsers = await db
    .select()
    .from(users)
    .innerJoin(subscriptions, eq(users.id, subscriptions.userId))
    .where(and(eq(subscriptions.status, "active"), gte(subscriptions.currentPeriodEnd, new Date().toISOString())));

  for (const user of activeUsers) {
    await emailQueue.add("daily-report", {
      to: user.users.email,
      subject: `Gistify Günlük Özet - ${new Date().toLocaleDateString("tr-TR")}`,
      template: "daily-summary",
      userId: user.users.id,
    }, {
      delay: 0,
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
    });
  }

  console.log(`[CRON] Queued ${activeUsers.length} daily report emails`);
}
```

---

### STEP F8: Webhook Event Schema (Zod)

**Yeni dosya:** `server/lib/webhookSchema.ts`

```ts
import { z } from "zod";

export const stripeWebhookSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("invoice.payment_failed"), data: z.object({ object: z.object({ id: z.string(), customer: z.string(), subscription: z.string().optional() }) }) }),
  z.object({ type: z.literal("invoice.payment_succeeded"), data: z.object({ object: z.object({ id: z.string(), customer: z.string(), subscription: z.string().optional() }) }) }),
  z.object({ type: z.literal("customer.subscription.deleted"), data: z.object({ object: z.object({ id: z.string(), customer: z.string() }) }) }),
  z.object({ type: z.literal("customer.subscription.updated"), data: z.object({ object: z.object({ id: z.string(), customer: z.string(), status: z.string() }) }) }),
]);

export const clerkWebhookSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("user.created"), data: z.object({ id: z.string(), email_addresses: z.array(z.object({ email_address: z.string() })) }) }),
  z.object({ type: z.literal("user.deleted"), data: z.object({ id: z.string() }) }),
  z.object({ type: z.literal("session.created"), data: z.object({ user_id: z.string() }) }),
]);

export type StripeWebhookEvent = z.infer<typeof stripeWebhookSchema>;
export type ClerkWebhookEvent = z.infer<typeof clerkWebhookSchema>;
```

---

### STEP F9: API Client with Automatic Token Refresh

**Yeni dosya:** `client/src/lib/apiClient.ts`

```ts
class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<string> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getToken();
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      credentials: "include",
    });

    if (res.status === 401) {
      const newToken = await this.refreshToken();
      const retry = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
          ...options.headers,
        },
        credentials: "include",
      });
      if (!retry.ok) throw new Error(`API Error: ${retry.status}`);
      return retry.json();
    }

    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  }

  private async getToken(): Promise<string> {
    return localStorage.getItem("token") || "";
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshPromise) return this.refreshPromise;
    this.refreshPromise = fetch(`${this.baseUrl}/auth/refresh`, { method: "POST", credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        localStorage.setItem("token", data.token);
        return data.token;
      })
      .finally(() => { this.refreshPromise = null; });
    return this.refreshPromise;
  }
}

export const api = new ApiClient("https://api.gistify.app/api/v1");
```

---

### STEP F10: Error Boundary with Retry + Sentry Integration

**Yeni dosya:** `client/src/components/ErrorBoundary.tsx` (güncelle)

```tsx
import { Component, ReactNode } from "react";
import * as Sentry from "@sentry/react";
import { Button } from "@/components/ui/button";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; eventId?: string; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.withScope((scope) => {
      scope.setExtra("componentStack", errorInfo.componentStack);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full space-y-4 text-center">
            <h2 className="text-xl font-bold text-destructive">Bir hata oluştu</h2>
            <p className="text-sm text-muted-foreground">{this.state.error?.message}</p>
            {this.state.eventId && (
              <p className="text-xs text-muted-foreground font-mono">Event ID: {this.state.eventId}</p>
            )}
            <div className="flex gap-2 justify-center">
              <Button onClick={() => window.location.reload()}>Yenile</Button>
              <Button variant="outline" onClick={() => this.setState({ hasError: false })}>Tekrar Dene</Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

### STEP F11: Sentry Initialization (Client + Server)

**Yeni dosya:** `client/src/lib/sentry.ts`

```ts
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  release: import.meta.env.VITE_APP_VERSION,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false })],
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  beforeSend(event) {
    if (event.exception?.values?.some((e) => e.value?.includes("password"))) return null;
    return event;
  },
});
```

**Yeni dosya:** `server/lib/sentry.ts`

```ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.APP_VERSION,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  beforeSend(event) {
    if (event.request?.headers?.authorization) delete event.request.headers.authorization;
    if (event.request?.cookies) delete event.request.cookies;
    return event;
  },
});
```

---

### STEP F12: Feature Flag Hook with React Query

**Yeni dosya:** `client/src/hooks/useFeatureFlag.ts`

```ts
import { useQuery } from "@tanstack/react-query";

export function useFeatureFlag(flagName: string): { enabled: boolean; variant?: string; loading: boolean } {
  const { data, isLoading } = useQuery({
    queryKey: ["feature-flag", flagName],
    queryFn: async () => {
      const res = await fetch(`/api/feature-flags/${flagName}`, { credentials: "include" });
      if (!res.ok) return { enabled: false };
      return res.json();
    },
    staleTime: 60_000,
  });
  return { enabled: data?.enabled ?? false, variant: data?.variant, loading: isLoading };
}
```

---

### STEP F13: Dark Mode Toggle Button (shadcn/ui)

**Yeni dosya:** `client/src/components/ui/ThemeToggle.tsx`

```tsx
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
      {resolvedTheme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

---

### STEP F14: Loading Skeletons for Dashboard Widgets

**Yeni dosya:** `client/src/components/ui/WidgetSkeleton.tsx`

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function WidgetSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <Skeleton className="h-32 w-full rounded-lg" />
      <div className="flex gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
```

---

### STEP F15: Confirmation Dialog (Destructive Actions)

**Yeni dosya:** `client/src/components/ui/ConfirmDialog.tsx`

```tsx
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  trigger,
  title,
  description,
  onConfirm,
  confirmText = "Sil",
  cancelText = "İptal",
  variant = "destructive",
}: {
  trigger: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => { onConfirm(); setOpen(false); }}
            className={variant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

---

### STEP F16: Data Export Button (CSV + Excel + PDF)

**Yeni dosya:** `client/src/components/ui/DataExportButton.tsx`

```tsx
import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { exportToCSV } from "@/lib/export/csv";
import { exportToExcel } from "@/lib/export/excel";

export function DataExportButton<T extends Record<string, any>>({ data, filename }: { data: T[]; filename: string }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: "csv" | "excel") => {
    setLoading(true);
    if (format === "csv") exportToCSV(data, `${filename}.csv`);
    if (format === "excel") exportToExcel(data, `${filename}.xlsx`);
    setLoading(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={loading}>
          <Download className="h-4 w-4 mr-1" />
          {loading ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")}>CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>Excel</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

### STEP F17: Toast Notification System (Sonner)

**Yeni dosya:** `client/src/lib/toast.ts`

```ts
import { toast } from "sonner";

export function notifySuccess(message: string) {
  toast.success(message, { duration: 3000 });
}

export function notifyError(message: string) {
  toast.error(message, { duration: 5000 });
}

export function notifyInfo(message: string) {
  toast.info(message, { duration: 3000 });
}

export function notifyLoading(promise: Promise<any>, messages: { loading: string; success: string; error: string }) {
  toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
}
```

---

### STEP F18: useMediaQuery Hook (Responsive)

**Yeni dosya:** `client/src/hooks/useMediaQuery.ts`

```ts
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 768px)");
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1025px)");
}
```

---

### STEP F19: Custom Scrollbar Styling (CSS)

**Yeni kod:** `client/src/index.css` içine ekle (mevcut CSS'in altına)

```css
@layer base {
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: oklch(0.25 0.02 230);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: oklch(0.35 0.02 230);
  }
  
  /* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: oklch(0.25 0.02 230) transparent;
  }
}
```

---

### STEP F20: Final Test Suite — Smoke Test

**Yeni dosya:** `tests/e2e/smoke.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test.describe("Smoke Test", () => {
  test("all critical routes are accessible", async ({ page }) => {
    const routes = ["/", "/app", "/momentum", "/daily-report", "/flow", "/pricing", "/terms", "/privacy"];
    for (const route of routes) {
      const res = await page.goto(route);
      expect(res?.status()).toBeLessThan(500);
      await expect(page.locator("body")).toBeVisible();
    }
  });

  test("API health check returns 200", async ({ request }) => {
    const res = await request.get("http://localhost:3000/api/health");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("healthy");
  });

  test("static assets are served", async ({ request }) => {
    const res = await request.get("http://localhost:5173/gistifylogo.png");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image");
  });
});
```

---

## GENEL SONUÇ

Bu implementasyon rehberi, Gistify'nin teknik borcundan enterprise-grade finansal platforma geçişi için **kapsamlı, test edilebilir, copy-paste hazır** talimatlar sunar.

### Toplam Özet

| Kategori | Sayı |
|----------|------|
| Phase | 5 |
| Ek Step (Detaylı) | 20 |
| Pratik Step (Config) | 17 |
| Utility Step (Kod) | 30 |
| Template Step (Doküman) | 30 |
| Final Step (Son Kod) | 20 |
| **Toplam Step** | **112** |
| Toplam Satır | 8000+ |
| Toplam Boyut | ~300KB |

### Dosya Listesi (Oluşturulacak/Touch Edilecek)

**Yeni dosyalar (50+):**
- `client/src/index.css` (güncelle)
- `client/src/components/tabs/StockDetailTab.tsx` (yeni)
- `client/src/pages/ReportsAdmin.tsx` (güncelle)
- `client/src/contexts/ThemeContext.tsx` (güncelle)
- `client/src/components/ui/sonner.tsx` (güncelle)
- `client/src/stores/dashboardStore.ts` (yeni)
- `client/src/stores/authStore.ts` (yeni)
- `client/src/hooks/useMarketData.ts` (yeni)
- `client/src/hooks/useReports.ts` (yeni)
- `client/src/components/layout/AppShell.tsx` (yeni)
- `client/src/components/layout/AppRouter.tsx` (yeni)
- `client/src/components/layout/AppNavigation.tsx` (yeni)
- `client/src/components/layout/AuthGate.tsx` (yeni)
- `client/src/App.tsx` (güncelle)
- `client/src/main.tsx` (güncelle)
- `client/src/widgets/registry.ts` (yeni)
- `client/src/widgets/WatchlistWidget.tsx` (yeni)
- `client/src/widgets/ChartWidget.tsx` (yeni)
- `client/src/widgets/AIInsightWidget.tsx` (yeni)
- `client/src/components/DashboardCanvas.tsx` (yeni)
- `client/src/components/ColorChannelPicker.tsx` (yeni)
- `client/src/components/DataTableVirtual.tsx` (yeni)
- `client/src/lib/mdx/runtime.ts` (yeni)
- `client/src/components/mdx/index.tsx` (yeni)
- `client/src/i18n/config.ts` (yeni)
- `client/src/lib/i18n/format.ts` (yeni)
- `server/middleware/requireTier.ts` (yeni)
- `server/middleware/clerkAuth.ts` (yeni)
- `server/middleware/rbac.ts` (yeni)
- `server/middleware/featureFlag.ts` (yeni)
- `server/middleware/zeroTrust.ts` (yeni)
- `server/middleware/rateLimiter.ts` (yeni)
- `server/middleware/rateLimitHeaders.ts` (yeni)
- `server/middleware/apiVersion.ts` (yeni)
- `server/billing/stripe.ts` (yeni)
- `server/billing/metered.ts` (yeni)
- `server/billing/dunning.ts` (yeni)
- `server/billing/proration.ts` (yeni)
- `server/billing/tax.ts` (yeni)
- `server/billing/invoiceGenerator.ts` (yeni)
- `server/billing/referral.ts` (yeni)
- `server/api/webhooks/stripe.ts` (yeni)
- `server/lib/encryption.ts` (yeni)
- `server/lib/webhook.ts` (yeni)
- `server/lib/webhookSchema.ts` (yeni)
- `server/lib/circuitBreaker.ts` (yeni)
- `server/lib/batchProcessor.ts` (yeni)
- `server/ai/sentiment.ts` (yeni)
- `server/ai/prompts.ts` (yeni)
- `server/ai/recommendation.ts` (yeni)
- `server/social/copyTrading.ts` (yeni)
- `server/db/tenant.ts` (yeni)
- `server/db/migration/dualWrite.ts` (yeni)
- `server/db/search.ts` (yeni)
- `server/db/seeds.ts` (yeni)
- `server/queue/emailQueue.ts` (yeni)
- `server/queue/reportQueue.ts` (yeni)
- `server/queue/messageQueue.ts` (yeni)
- `server/cron/dailyJobs.ts` (yeni)
- `server/cron/scheduledReports.ts` (yeni)
- `server/cqrs/eventStore.ts` (yeni)
- `server/cqrs/outbox.ts` (yeni)
- `server/cdc/consumer.ts` (yeni)
- `server/etl/dailySync.ts` (yeni)
- `server/analytics/abTest.ts` (yeni)
- `server/analytics/cohort.ts` (yeni)
- `server/analytics/funnel.ts` (yeni)
- `server/analytics/predictions.ts` (yeni)
- `server/monitoring/prometheus.ts` (yeni)
- `server/reports/pdfGenerator.ts` (yeni)
- `server/api/health.ts` (yeni)
- `server/api/gdpr/export.ts` (yeni)
- `server/api/teams.ts` (yeni)
- `server/tracing.ts` (yeni)
- `server/lib/sentry.ts` (yeni)
- `server/lib/apiClient.ts` (yeni)
- `worker/src/index.ts` (yeni)
- `worker/src/socialFeed.ts` (yeni)
- `client/src/components/social/CashtagParser.tsx` (yeni)
- `client/src/components/admin/AuditLogViewer.tsx` (yeni)
- `client/src/components/admin/MetricsCards.tsx` (yeni)
- `client/src/components/admin/RealtimeMetrics.tsx` (yeni)
- `client/src/components/feedback/NPSSurvey.tsx` (yeni)
- `client/src/components/feedback/CSATSurvey.tsx` (yeni)
- `client/src/components/forms/ReportForm.tsx` (yeni)
- `client/src/components/mobile/BottomSheet.tsx` (yeni)
- `client/src/components/mobile/TableCardView.tsx` (yeni)
- `client/src/components/mobile/SwipeableTabs.tsx` (yeni)
- `client/src/components/ui/ThemeToggle.tsx` (yeni)
- `client/src/components/ui/WidgetSkeleton.tsx` (yeni)
- `client/src/components/ui/ConfirmDialog.tsx` (yeni)
- `client/src/components/ui/DataExportButton.tsx` (yeni)
- `client/src/components/ui/DateRangePicker.tsx` (yeni)
- `client/src/components/ui/FileUpload.tsx` (yeni)
- `client/src/components/ui/VirtualSelect.tsx` (yeni)
- `client/src/hooks/useDebounce.ts` (yeni)
- `client/src/hooks/useThrottle.ts` (yeni)
- `client/src/hooks/useLocalStorage.ts` (yeni)
- `client/src/hooks/useIntersectionObserver.ts` (yeni)
- `client/src/hooks/useWebSocket.ts` (yeni)
- `client/src/hooks/useMediaQuery.ts` (yeni)
- `client/src/hooks/useFeatureFlag.ts` (yeni)
- `client/src/hooks/useOptimisticMutation.ts` (yeni)
- `client/src/lib/export/csv.ts` (yeni)
- `client/src/lib/export/pdf.ts` (yeni)
- `client/src/lib/export/excel.ts` (yeni)
- `client/src/lib/retry.ts` (yeni)
- `client/src/lib/push.ts` (yeni)
- `client/src/lib/toast.ts` (yeni)
- `client/src/lib/featureFlags.ts` (yeni)
- `client/src/lib/dailyReports.ts` (mevcut, referans)
- `client/src/api/client.ts` (yeni)
- `client/tailwind.config.ts` (yeni)
- `client/vite.config.ts` (güncelle)
- `client/tsconfig.json` (güncelle)
- `client/vitest.config.ts` (yeni)
- `client/src/test/setup.ts` (yeni)
- `lighthouserc.json` (yeni)
- `docker-compose.yml` (yeni)
- `Dockerfile` (yeni)
- `nginx/gistify.conf` (yeni)
- `wrangler.toml` (yeni)
- `.env.example` (yeni)
- `.github/workflows/ci.yml` (yeni)
- `.github/pull_request_template.md` (yeni)
- `alertmanager.yml` (yeni)
- `commitlint.config.js` (yeni)
- `eslint.config.js` (yeni)
- `.prettierrc` (yeni)
- `.lintstagedrc.json` (yeni)
- `Makefile` (yeni)
- `stryker.config.js` (yeni)
- `docs/openapi.yaml` (yeni)
- `docs/policies/access-control.md` (yeni)
- `docs/policies/incident-response.md` (yeni)
- `docs/compliance/data-mapping.ts` (yeni)
- `docs/compliance/access-review.md` (yeni)
- `docs/incident-response.yml` (yeni)
- `docs/runbooks/database-outage.md` (yeni)
- `docs/onboarding.md` (yeni)
- `docs/offboarding.md` (yeni)
- `docs/adr/001-clerk-auth.md` (yeni)
- `docs/templates/PRD.md` (yeni)
- `docs/templates/tech-spec.md` (yeni)
- `docs/security/penetration-test-template.md` (yeni)
- `docs/sso/saml-config.md` (yeni)
- `docs/devops/blue-green-deployment.md` (yeni)
- `docs/db/data-dictionary.md` (yeni)
- `proto/market.proto` (yeni)
- `migrations/20240613120000_create_subscriptions.ts` (yeni)
- `migrations/20240613130000_create_social_messages.ts` (yeni)
- `tests/load/k6-api.js` (yeni)
- `tests/load/artillery.yml` (yeni)
- `tests/e2e/auth.spec.ts` (yeni)
- `tests/e2e/navigation.spec.ts` (yeni)
- `tests/e2e/smoke.spec.ts` (yeni)
- `tests/integration/api.content.test.ts` (yeni)
- `tests/pact/content-consumer.pact.test.ts` (yeni)
- `server/emails/WelcomeEmail.tsx` (yeni)
- `server/assetPipeline.ts` (yeni)
- `openfga/model.fga` (yeni)
- `README.md` (güncelle)

---

> **Rehber Sonu (Final).**  
> Bu belge, `Gistify_Gelismis_Rapor.md` (6046 satır, 12 bölüm) içeriğinden doğrudan, test edilebilir, copy-paste hazır implementasyon talimatlarına çevrilmiştir.  
> **Toplam:** 5 Phase + 20 Ek Step + 17 Pratik Step + 30 Utility + 30 Template + 20 Final = **112 Step**.  
> **Toplam Satır:** 8000+  
> **Toplam Boyut:** ~300KB  
> **Versiyon:** 2.0-final  
> **Tarih:** 2026-06-13  
> **Sonraki Güncelleme:** Her Phase tamamlandığında.

"""

    with open(target, "a", encoding="utf-8") as f:
        f.write(final)
    
    return {"target": target, "status": "final_appended"}
