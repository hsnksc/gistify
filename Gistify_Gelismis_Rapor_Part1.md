# Gistify Gelişmiş Teknik Mimari & Rapor — Part 1

> **Rol:** Teknik Yazar & Mimari Analisti  
> **Proje:** Gistify (Earnings Intelligence, Benchmark, Momentum Scrapper)  
> **Tarih:** 2026-06-13  
> **Kapsam:** Bölüm 1–6 (Executive Summary, Teknik Stack, Dinamik İçerik, Dashboard, Sosyal Katman, Auth)  
> **Araştırma Kaynakları:** Gistify UI/UX & Algoritmik Mimari Raporu (Bölüm 1–10) [Rapor], Gistify Finansal Dashboard & UI Mimarisi Araştırma Raporu [Finans], Gistify Content Pipeline Araştırma Raporu [Content]

---

## Bölüm 1: Executive Summary & Gelişmiş Vizyon

### 1.1 Gistify'nin Mevcut Durumu ve Stratejik Hedefi

Gistify projesi, finansal veri yoğunluklu üç ana uygulamadan oluşan bir **finansal istihbarat ekosistemidir**: **Ana App** (Earnings Intelligence), **Benchmark** (Earnings Benchmark Raporu) ve **Momentum Scrapper** (NASDAQ Momentum Scanner). Her bir uygulama, kendi içinde zengin özelliklere sahip olmakla birlikte, **tutarlılık, bakılabilirlik, ölçeklenebilirlik ve kullanıcı deneyimi** açısından ciddi teknik borç birikimine sahiptir [Rapor]. Mevcut mimaride, üç farklı uygulama üç farklı renk sistemi (HEX, OKLCH, Tailwind Slate), farklı tipografi stratejileri, farklı component yapıları ve **paylaşımlı bir `shared/` katmanı olmaksızın** çalışmaktadır. Bu durum, yeni özellik geliştirmeyi yavaşlatmakta, cross-app deneyimi bozmakta ve marka kimliğini zayıflatmaktadır.

Bu gelişmiş rapor, mevcut UI/UX analizinin [Rapor] ve finansal dashboard [^1][^2] ile content pipeline [^3][^4] araştırmalarının bulgularını birleştirerek, Gistify'nin **teknik çatısını yeniden tasarlamayı** hedefler. Vizyon şudur: Gistify, sadece bir rapor ve screener aracı değil, aynı zamanda **widget-tabanlı, real-time, sosyal ve AI-destekli** bir finansal istihbarat platformuna dönüşmelidir. Bu dönüşüm, üç uygulamanın tek bir **unified design system** ve **shared runtime** üzerinde birleştirilmesiyle mümkündür.

Stratejik hedefler şunlardır:

1. **Tasarım Sistemi Birleştirme:** Üç farklı renk, tipografi ve spacing sistemini, OKLCH tabanlı tek bir design token sistemine indirgeme [^15][^16].
2. **Dinamik İçerik Pipeline:** Statik tab yapılarından, file-based CMS + headless CMS hybrid modeline geçiş [^3][^5].
3. **Widget-Tabanlı Dashboard:** Kullanıcıların kendi dashboard'larını drag-drop ile özelleştirebildiği, Koyfin ve TradingView modeline yakın bir mimari [^1][^2].
4. **Real-time & Sosyal Katman:** WebSocket tabanlı feed'ler, StockTwits modeli sosyal etkileşim, ve offline-first destek [^7][^8].
5. **Modern Auth & RBAC:** Clerk.dev tabanlı authentication, organizasyon desteği, ve feature flag yönetimi.

### 1.2 Endüstri Benchmark Analizi: TradingView, Koyfin, StockTwits, Finviz

Gistify'nin evriminde yol gösterici olacak dört ana benchmark platformu vardır. Her biri, farklı bir teknik ve iş modeli başarısını temsil eder.

#### TradingView — Widget & Linking Mimarisi

TradingView, modern finansal dashboard'ların **widget-based architecture** ve **color channel linking** kavramlarını standartlaştırmıştır [^1]. Kullanıcı, chart, watchlist, screener, financials panel, notes gibi component'leri drag-drop ile customizable layout'lara yerleştirir. **Color channel linking**, watchlist'te seçilen bir sembolün, aynı renk kanalına bağlı tüm chart widget'larını anında güncellemesini sağlar. Bu, Gistify'nin **widget-to-widget communication** ihtiyacının kanıtlanmış bir endüstri standardıdır.

Teknik olarak, TradingView **HTML5 Canvas** tabanlı kendi charting engine'ini kullanır; bu, 10K+ candlestick verisini akıcı şekilde render edebilmesini sağlar [^4]. Gistify için ders: Canvas rendering, SVG rendering'den **5–8x daha fazla data point** işleyebilir [^4]. Eğer Gistify'nin chart'ları ileride intraday tick data veya order book depth gösterecekse, **TradingView Lightweight Charts** veya **Apache ECharts** (Canvas mode) zorunlu hale gelir [^5].

#### Koyfin — "My Dashboards" & Drag-Drop

Koyfin'in **My Dashboards** özelliği, blank dashboard oluşturma, template yükleme, resizable/draggable widget ekleme (watchlist, historical graph, performance graph, news), ve **7 renk grubu** üzerinden widget-to-widget communication (grouping) sunar [^2][^3]. Özellikle, drag-and-drop ile ticker'lar widget'lar arasında taşınabilir; aynı gruptaki component'ler birbirinin değişikliklerini dinler [^3].

Koyfin v3.0 ile **StockTwits integration** ve **scatter plot charts** eklenmiştir [^21]; bu, finansal dashboard'ların sosyal katmanla entegre olmasının değerini gösterir. Gistify için ders: Dashboard sadece veri göstergesi değil, aynı zamanda **sosyal etkileşim ve AI-analyst consensus** sunmalıdır.

#### Finviz — Freemium Screener & Watchlist Farklılaşması

Finviz, **free real-time screener** sunarken, **watchlist** özelliğini **paid tier**'a koymuştur [^20]. TipRanks ise **Smart Score** ve **portfolio report** üzerinden AI-analyst consensus personalizasyonu yapar. **Multiple watchlist support**, TradingView'de paid, Finviz'de free, TipRanks'te paid tier'dadır. Bu farklılaşma, **dashboard core'u free tutup advanced personalization'ı premium'a koyma** stratejisini gösterir [^20].

Gistify için ders: Gistify'nin mevcut `restricted-view` CSS mantığı [Rapor], bu freemium stratejisiyle uyumlu ancak daha sistematik hale getirilmelidir. Temel screener ve raporlar free; widget-based dashboard, AI recommendation, real-time WebSocket, ve sosyal katman Pro/Enterprise tier'da olmalıdır.

#### StockTwits — Sosyal Finans & Sentiment

StockTwits, finansal sosyal medyanın ilk ve en başarılı örneğidir. **Cashtag** (`$AAPL`, `$TSLA`) sistemi, kullanıcıların hisse bazlı konuşmaları takip etmesini sağlar. **Sentiment indexing** (bullish/bearish) ve **AI moderation** modern versiyonlarında kritik özelliklerdir. Gistify'nin Flow sosyal katmanı [Rapor], StockTwits modelini temel almalı ancak **AI-driven moderation** ve **ActivityPub/Fediverse entegrasyonu** ile daha ileriye taşınmalıdır.

### 1.3 Gelişmiş Raporun Kapsamı ve Farklılıkları

Bu rapor, önceki UI/UX analiz raporunun [Rapor] **mimari ve algoritmik derinliğini artıran** bir devamıdır. Farklılıklar şunlardır:

| Önceki Rapor | Bu Gelişmiş Rapor (Part 1) |
|--------------|---------------------------|
| UI/UX sorun listesi ve acil eylem planı | Mimari vizyon, tech stack, ve altyapı önerileri |
| Statik MD deploy pipeline tasarımı (Bölüm 10) | Gelişmiş dinamik içerik sistemi: MDX, ISR, CMS hybrid, i18n |
| Recharts kullanım analizi | Canvas charting, widget mimarisi, data virtualization |
| Sosyal katman eksikliği tespiti | StockTwits + eToro modeli, real-time feed, WebSocket, offline-first |
| Auth state machine tespiti | Clerk.dev, RBAC/ABAC, OpenFGA, multi-tenancy, feature flags |
| 3 ayrı uygulama analizi | Unified teknik stack, micro-frontend düşüncesi, edge computing |

Bu rapor, **somut implementasyon kodları**, **karşılaştırma tabloları**, ve **citation referansları** ile desteklenmiştir. Her bölüm, Gistify'nin mevcut kod tabanından örnekler vererek, önerilen mimariye nasıl geçileceğini adım adım açıklar.

---

## Bölüm 2: Gelişmiş Teknik Stack & Mimari

### 2.1 Mevcut Stack Değerlendirmesi: React 19 + Vite + TypeScript

Gistify'nin mevcut istemci tarafı stack'i **React 19**, **Vite**, **TypeScript**, **Tailwind CSS**, ve **shadcn/ui** üzerine kuruludur. Bu stack, 2026 itibarıyla modern, hızlı, ve type-safe bir temel sunar. Ancak mevcut kullanımda şu kritik sorunlar vardır [Rapor]:

- **React 19'ın concurrent features'leri (Suspense, Transitions, Server Components) kullanılmıyor.** App hâlâ class-based veya eski hook pattern'leriyle yazılmış component'ler içeriyor.
- **Vite'ın module preloading ve code splitting potansiyeli tam kullanılmıyor.** `App.tsx` 1146 satır, `ReportsAdmin.tsx` 1876 satır — bu dosyalar tek chunk'ta yükleniyor, lazy loading yok.
- **TypeScript strictness düşük.** `any` ve `as` kullanımı yaygın; `shared/` klasöründe ortak type tanımları yetersiz.
- **Tailwind JIT, dinamik class'ları göremiyor.** `bg-${accentColor}-500/5` gibi template literal class'lar stilsiz kalıyor [Rapor].

#### Önerilen Stack Güncellemeleri

| Katman | Mevcut | Önerilen | Gerekçe |
|--------|--------|----------|---------|
| React | 19 (basic) | 19 (Strict Mode + Concurrent Features) | Suspense, Transitions, Server Components (eğer Next.js geçişi olursa) |
| Build Tool | Vite 5/6 | Vite 6 + `rollup-plugin-visualizer` | Bundle analizi, dynamic import optimization |
| TypeScript | ~5.3 | 5.6+ (strictest config) | `noImplicitAny`, `strictNullChecks`, `exactOptionalPropertyTypes` |
| Linting | ESLint (basic) | ESLint 9 (flat config) + `typescript-eslint` + `eslint-plugin-react-hooks` | Hook kuralları, exhaustive-deps zorunlu |
| Formatting | Prettier | Prettier + `prettier-plugin-tailwindcss` | Tailwind class sıralama tutarlılığı |
| Test | Yok | Vitest + React Testing Library + Playwright | Unit, integration, E2E test coverage |
| State | React Context + useState | Zustand + TanStack Query | Global state ve server state ayrımı |
| Routing | wouter | wouter (mevcut) + route-based code splitting | `React.lazy()` ile page-level splitting |

```typescript
// vite.config.ts — Gistify için önerilen konfigürasyon
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // React 19 Compiler (eğer stabil ise)
          // 'babel-plugin-react-compiler',
        ],
      },
    }),
    visualizer({ open: true, gzipSize: true, brotliSize: true }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
      '@server': path.resolve(__dirname, '../server'),
    },
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          // Finansal charting kütüphaneleri ayrı chunk
          'charts': ['lightweight-charts', 'echarts'],
          // Content pipeline kütüphaneleri ayrı chunk
          'content': ['react-markdown', 'gray-matter', 'remark-gfm'],
          // UI primitives
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-tabs', 'framer-motion'],
        },
      },
    },
  },
});
```

```typescript
// tsconfig.json — Strictest configuration
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
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
      "@server/*": ["../server/*"]
    }
  }
}
```

### 2.2 State Management: Zustand + TanStack Query + Önerilen Patterns

Gistify'nin mevcut state management'i, **React Context** (`ThemeContext` default `light`, CSS `color-scheme: dark`, Sonner `next-themes` kullanıyor — 3 tema yöneticisi!) [Rapor] üzerine kuruludur. Bu, global state için yetersiz ve performans açısından risklidir. Context, her güncellemede tüm consumer'ları re-render eder; bu da 11 kolonlu `MomentumTab` gibi ağır component'lerde frame drop'a neden olur.

#### Zustand: Global Client State

Zustand, lightweight, fast, ve minimal boilerplate ile global state yönetimi sağlar [^19]. Gistify için, **theme, layout, widget configuration, user preferences** gibi client-side state'ler Zustand store'larında tutulmalıdır.

```typescript
// shared/stores/dashboardStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface WidgetConfig {
  id: string;
  type: 'chart' | 'watchlist' | 'news' | 'screener' | 'notes';
  x: number;
  y: number;
  w: number;
  h: number;
  colorGroup?: string; // Color channel linking: 'red', 'blue', 'green', ...
  props: Record<string, unknown>;
}

interface DashboardState {
  widgets: WidgetConfig[];
  activeLayout: string;
  selectedTickers: Record<string, string[]>; // colorGroup -> ticker[]
  addWidget: (widget: Omit<WidgetConfig, 'id'>) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, partial: Partial<WidgetConfig>) => void;
  linkTicker: (colorGroup: string, ticker: string) => void;
  unlinkTicker: (colorGroup: string, ticker: string) => void;
}

export const useDashboardStore = create<DashboardState>()(
  immer(
    persist(
      (set) => ({
        widgets: [],
        activeLayout: 'default',
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
      }),
      {
        name: 'gistify-dashboard-storage',
        storage: createJSONStorage(() => localStorage),
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

**Immer middleware**, immutable update'leri mutable syntax ile yazmayı sağlar; bu, `MomentumTab` gibi nested state'lerin güncellenmesini kolaylaştırır. **Persist middleware**, layout ve widget configuration'ı `localStorage`'a kaydeder; kullanıcı refresh yaptığında dashboard'u aynen geri yükler [^10].

#### TanStack Query (React Query): Server State

TanStack Query, server state (API'den gelen veri) için caching, background refetching, stale-while-revalidate, ve pagination desteği sunar. Gistify'nin mevcut `useState` + `useEffect` + manuel fetch pattern'leri yerine, **her API call TanStack Query hook'una yönlendirilmelidir**.

```typescript
// client/src/hooks/useMarketData.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface MarketSnapshot {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

const fetchTickerSnapshot = async (ticker: string): Promise<MarketSnapshot> => {
  const res = await fetch(`/api/market/${ticker}`);
  if (!res.ok) throw new Error(`Failed to fetch ${ticker}`);
  return res.json();
};

export const useTickerSnapshot = (ticker: string) => {
  return useQuery({
    queryKey: ['market', 'snapshot', ticker],
    queryFn: () => fetchTickerSnapshot(ticker),
    staleTime: 1000 * 15, // 15 saniye stale (real-time yaklaşımı)
    refetchInterval: 1000 * 30, // 30 saniyede bir refetch (polling fallback)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useInvalidateTicker = () => {
  const queryClient = useQueryClient();
  return (ticker: string) => {
    queryClient.invalidateQueries({ queryKey: ['market', 'snapshot', ticker] });
  };
};
```

**Stale-while-revalidate pattern**, kullanıcıya her zaman cache'den hızlı veri gösterirken arka planda fresh data çekilmesini sağlar. Bu, Gistify'nin rapor sayfaları için idealdir: eski rapor anında görünür, güncelleme gelince seamless şekilde yansır.

### 2.3 Edge Computing: Cloudflare Workers / Durable Objects Önerisi

Gistify'nin mevcut backend'i Vite + Express / Node.js (veya benzeri) üzerinde çalışmaktadır. Ancak finansal dashboard'lar için **real-time data** ve **global latency** kritiktir. Vercel, **WebSocket desteklemez** (Vercel Functions serverless ve stateless'tır; WebSocket persistent connection gerektirir). Bu, Gistify'nin real-time feed mimarisinde ciddi bir kısıtlamadır.

#### Cloudflare Workers: Edge Functions

Cloudflare Workers, **V8 isolate** tabanlı, 0ms cold start, ve 300+ edge location'da çalışan serverless function'lar sunar. Gistify için şu kullanım alanları vardır:

1. **API Proxy & Rate Limiting:** Polygon.io / FMP / Alpha Vantage API'lerine istemciden doğrudan erişimi engellemek, API key'leri gizlemek, ve rate limit uygulamak.
2. **Authentication Edge Middleware:** Clerk.dev JWT token'larını edge'de verify etmek, `__session` cookie'sini parse etmek, ve yetkisiz istekleri origin'e ulaşmadan reddetmek.
3. **Asset Pipeline:** Cloudflare R2'den presigned URL üretmek, image resize/optimization yapmak, ve CDN rewrite kurallarını uygulamak [^15][^16].

```typescript
// worker/src/index.ts — Cloudflare Worker API Proxy
export interface Env {
  POLYGON_API_KEY: string;
  FMP_API_KEY: string;
  R2_BUCKET: R2Bucket;
  CACHE: Cache;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const cacheKey = new Request(url.toString(), request);

    // Cache API (Cloudflare Edge Cache)
    const cached = await env.CACHE.match(cacheKey);
    if (cached) return cached;

    if (url.pathname.startsWith('/api/market/')) {
      const ticker = url.pathname.split('/')[3];
      const targetUrl = `https://api.polygon.io/v2/last/trade/${ticker}?apiKey=${env.POLYGON_API_KEY}`;

      const response = await fetch(targetUrl, {
        headers: { 'Accept': 'application/json' },
      });

      const modified = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers),
          'Cache-Control': 'public, max-age=15',
          'Access-Control-Allow-Origin': '*',
        },
      });

      ctx.waitUntil(env.CACHE.put(cacheKey, modified.clone()));
      return modified;
    }

    if (url.pathname.startsWith('/api/upload')) {
      // R2 presigned URL generation
      const key = url.searchParams.get('key');
      if (!key) return new Response('Missing key', { status: 400 });

      const signedUrl = await env.R2_BUCKET.createSignedUrl(key, {
        method: 'PUT',
        expirySeconds: 300,
      });

      return Response.json({ signedUrl, publicUrl: `https://cdn.gistify.app/${key}` });
    }

    return new Response('Not Found', { status: 404 });
  },
};
```

#### Cloudflare Durable Objects: Real-time Coordination

**Durable Objects (DO)**, Cloudflare'un **stateful, transactional, ve koordinasyon** yetenekleridir. Her DO instance'ı, unique ID'si ile edge'de yaşayan bir stateful nesnedir. Bu, WebSocket alternative olarak **real-time feed aggregation** ve **social presence** (kim hangi hisseyi izliyor) için mükemmeldir.

```typescript
// worker/src/socialRoom.ts — Durable Object for Real-time Social Feed
import { DurableObject } from 'cloudflare:workers';

interface SocialMessage {
  id: string;
  userId: string;
  ticker: string;
  content: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  timestamp: string;
  replyTo?: string;
}

export class SocialRoom extends DurableObject {
  private messages: SocialMessage[] = [];
  private sessions: Set<WebSocket> = new Set();

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.headers.get('Upgrade') === 'websocket') {
      const [client, server] = Object.values(new WebSocketPair());
      this.sessions.add(server);
      server.accept();

      server.addEventListener('message', (msg) => {
        const data = JSON.parse(msg.data as string) as SocialMessage;
        this.messages.push(data);
        // Broadcast to all connected sessions
        this.sessions.forEach((ws) => {
          if (ws.readyState === WebSocket.READY_STATE_OPEN) {
            ws.send(JSON.stringify({ type: 'new_message', data }));
          }
        });
      });

      server.addEventListener('close', () => {
        this.sessions.delete(server);
      });

      return new Response(null, { status: 101, webSocket: client });
    }

    if (url.pathname === '/history') {
      return Response.json(this.messages.slice(-100)); // Last 100 messages
    }

    return new Response('Not Found', { status: 404 });
  }
}
```

**Neden Durable Objects?** Vercel Functions, WebSocket bağlantılarını desteklemez. Cloudflare Durable Objects, **WebSocket server** olarak çalışabilir, state tutabilir, ve edge'de düşük latency ile broadcast yapabilir. Bu, Gistify'nin StockTwits benzeri real-time feed'ini mümkün kılar [^7][^8].

### 2.4 Micro-frontend / Module Federation Düşüncesi

Gistify'nin üç uygulaması (Ana App, Benchmark, Momentum Scrapper) arasında **%100 kod kopyası** (Benchmark vs v2) ve **paylaşımlı `shared/` klasörü olmaması** [Rapor] sorunu, micro-frontend (MFE) mimarisini düşünmeyi gerektirir. Ancak MFE, her zaman doğru çözüm değildir.

#### Karar Matrisi: MFE Gerekli mi?

| Kriter | Durum | MFE İhtiyacı |
|--------|-------|--------------|
| Ayrı deploy takvimleri | ❌ Üç app aynı repo'da, aynı deploy | Düşük |
| Farklı tech stack'ler | ⚠️ Aynı stack (React+Vite) ama farklı versiyonlar | Orta |
| Bağımsız ekipler | ❌ Tek geliştirici/ekip | Düşük |
| Runtime integration | ⚠️ Kullanıcı app'ler arasında geçiş yapıyor | Orta |
| Bundle size | ❌ Her app kendi başına büyük | Yüksek (shared chunk) |

**Öneri:** Tam MFE (Module Federation) yerine, **"Monorepo + Shared Packages"** modeli daha uygun. Gistify, zaten bir monorepo (Ana, Benchmark, Momentum, v2) gibi görünüyor. Ancak `shared/` klasörü yok. Bu durumda:

1. **TurboRepo + pnpm workspaces** kurulmalı.
2. `@gistify/ui` (design system), `@gistify/data` (API hooks + types), `@gistify/content` (MDX pipeline) paketleri ayrılmalı.
3. Her app, bu shared paketleri `workspace:*` ile referans vermeli.

```json
// pnpm-workspace.yaml
packages:
  - 'client'
  - 'benchmark'
  - 'momentum'
  - 'v2/*'
  - 'packages/*'

// packages/ui/package.json
{
  "name": "@gistify/ui",
  "version": "1.0.0",
  "exports": {
    "./components": "./src/components/index.ts",
    "./hooks": "./src/hooks/index.ts",
    "./utils": "./src/utils/index.ts",
    "./styles": "./src/styles/index.css"
  }
}

// packages/data/package.json
{
  "name": "@gistify/data",
  "version": "1.0.0",
  "exports": {
    "./api": "./src/api/index.ts",
    "./types": "./src/types/index.ts",
    "./stores": "./src/stores/index.ts"
  }
}
```

```typescript
// client/src/App.tsx — Monorepo shared paket kullanımı
import { Button, ChartTooltip, DataTable } from '@gistify/ui';
import { useTickerSnapshot, useMarketScreener } from '@gistify/data/api';
import { useDashboardStore } from '@gistify/data/stores';
import '@gistify/ui/styles'; // OKLCH design tokens
```

Eğer gelecekte **farklı ekipler** veya **farklı framework'ler** (örneğin Momentum Scrapper'ın Astro'ya geçirilmesi) gündeme gelirse, o zaman **Module Federation** veya **Native Federation** (eski Module Federation'ın Vite/native versiyonu) değerlendirilebilir. Ama 2026 itibarıyla Gistify için **monorepo + shared packages** yeterlidir.

### 2.5 Real-time Data: WebSocket + SSE + Polling Hybrid Pattern

Finansal dashboard'lar için **real-time data feed** kritiktir. Gistify'nin mevcut yapısı, muhtemelen polling veya statik JSON üzerine kuruludur. Modern mimaride, **hibrid bir pattern** kullanılmalıdır [^7][^22].

#### Hibrid Pattern Mimarisi

```
┌─────────────────────────────────────────────────────────┐
│                    Gistify Client                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ WebSocket    │  │ SSE          │  │ REST Polling │  │
│  │ (Primary)    │  │ (Fallback)   │  │ (EOD/Backup) │  │
│  │ < 50ms       │  │ < 200ms      │  │ < 5000ms     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Cloudflare Edge (Worker + DO)             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ WS Aggregator│  │ SSE Stream   │  │ REST Cache   ││
│  │ (Durable Obj)│  │ (Worker)     │  │ (Worker)     ││
│  └──────────────┘  └──────────────┘  └──────────────┘│
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Data Providers (Primary + Backup)          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Polygon.io   │  │ FMP          │  │ Alpha Vantage││
│  │ $199/mo      │  │ $49/mo       │  │ Free tier    ││
│  │ WebSocket    │  │ REST + WS    │  │ REST polling ││
│  └──────────────┘  └──────────────┘  └──────────────┘│
└─────────────────────────────────────────────────────────┘
```

#### WebSocket (Primary): Cloudflare Durable Objects

WebSocket, **tick-by-tick** ve **order book** updates için kullanılır. Cloudflare Durable Objects, WebSocket server olarak çalışır. Client, DO'ya bağlanır; DO, Polygon.io WebSocket feed'ine abone olur ve client'a broadcast eder.

#### SSE (Server-Sent Events): Fallback

SSE, WebSocket desteklemeyen ağlar veya proxy'ler (bazı corporate firewall'lar WebSocket'i engeller) için fallback'tir. Cloudflare Worker, `text/event-stream` formatında data push edebilir. SSE, **one-way** (server → client) olduğundan, client'tan gelen action'lar (örneğin "ticker abone ol") ayrı bir REST call ile yapılır.

#### REST Polling (Backup): End-of-Day & Snapshot

Polling, **end-of-day (EOD) data**, **historical snapshot'lar**, ve **API backup** için kullanılır. Alpha Vantage free tier, 1-5 saniye latency ile REST polling sunar [^8]. Gistify, Polygon.io primary + Alpha Vantage backup stratejisiyle, **kaynak provider değişikliğine** karşı dayanıklı olmalıdır.

```typescript
// client/src/lib/realtime/useHybridFeed.ts
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface FeedState {
  status: 'ws' | 'sse' | 'polling' | 'offline';
  latency: number;
  lastUpdate: string;
}

export function useHybridFeed(ticker: string) {
  const [feedState, setFeedState] = useState<FeedState>({ status: 'polling', latency: 0, lastUpdate: '' });
  const wsRef = useRef<WebSocket | null>(null);

  // Primary: WebSocket
  useEffect(() => {
    const ws = new WebSocket(`wss://ws.gistify.app/room/${ticker}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setFeedState((s) => ({ ...s, status: 'ws' }));
      ws.send(JSON.stringify({ action: 'subscribe', ticker }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setFeedState((s) => ({ ...s, lastUpdate: data.timestamp, latency: Date.now() - new Date(data.timestamp).getTime() }));
    };

    ws.onerror = () => {
      setFeedState((s) => ({ ...s, status: 'sse' }));
    };

    ws.onclose = () => {
      setFeedState((s) => ({ ...s, status: 'sse' }));
    };

    return () => ws.close();
  }, [ticker]);

  // Fallback: SSE (if WebSocket fails within 5s)
  useEffect(() => {
    if (feedState.status !== 'sse') return;
    const source = new EventSource(`/api/sse/${ticker}`);
    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setFeedState((s) => ({ ...s, lastUpdate: data.timestamp }));
    };
    source.onerror = () => {
      setFeedState((s) => ({ ...s, status: 'polling' }));
    };
    return () => source.close();
  }, [feedState.status, ticker]);

  // Backup: TanStack Query polling
  const pollingQuery = useQuery({
    queryKey: ['market', 'snapshot', ticker],
    queryFn: () => fetch(`/api/market/${ticker}`).then((r) => r.json()),
    refetchInterval: feedState.status === 'polling' ? 5000 : false,
    enabled: feedState.status === 'polling' || feedState.status === 'offline',
  });

  return { feedState, data: pollingQuery.data };
}
```

### 2.6 Content Pipeline: File-based CMS + Headless CMS Hybrid

Gistify'nin mevcut dinamik MD deploy pipeline'ı (Bölüm 10) [Rapor], file-based bir yaklaşımdır: `earningreport/`, `momentum/`, `dailyreport/`, `flow/` dizinlerindeki `.md` dosyaları `chokidar` ile izlenir, `gray-matter` + `remark` ile parse edilir, ve `react-markdown` ile render edilir. Bu pipeline güçlüdür ancak **teknik olmayan editörler** için yetersizdir ve **content scheduling, approval workflow, native localization** desteği yoktur [^8].

#### Hybrid Model: Git-native + API-first

Gistify için önerilen model, **iki katmanlı** bir content pipeline'dır:

1. **File-based CMS (Git-native):** Keystatic [^7] veya TinaCMS [^9] ile local Markdown/YAML/JSON içerik, Git repo'da yönetilir. Teknik editörler (geliştiriciler, quant analyst'ler) bu katmanı kullanır. **Content as code** prensibiyle, CI/CD pipeline içinde review, preview deploy, ve rollback mümkündür [^13][^14].
2. **Headless CMS (API-first):** Sanity [^11] veya Strapi [^11] ile dinamik içerik (haberler, duyurular, kullanıcı yorumları, AI-generated insight'lar) yönetilir. Pazarlamacılar, editörler, ve AI agent'lar bu katmanı kullanır.

```
┌─────────────────────────────────────────────────────────┐
│              Content Creators (Editor Layer)           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Keystatic    │  │ TinaCMS      │  │ Sanity       │  │
│  │ (Git-native) │  │ (Git + Visual│  │ (API-first)  │  │
│  │              │  │  Editing)    │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Content Pipeline (Processing Layer)         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ File Watcher │  │ MDX Parser   │  │ Normalizer   │  │
│  │ (chokidar)   │  │ (gray-matter │  │ (Unified     │  │
│  │              │  │  + remark)    │  │  Schema)      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ API Sync     │  │ Versioning   │  │ ISR Trigger  │  │
│  │ (GitHub API) │  │ (Git commits)│  │ (webhook)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Content Delivery (Runtime Layer)          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ MDX Renderer │  │ React        │  │ CDN Cache    │  │
│  │ (next-mdx-   │  │ Components   │  │ (Cloudflare) │  │
│  │  remote)     │  │ (shadcn/ui)  │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Keystatic vs TinaCMS Karşılaştırması

| Özellik | Keystatic [^7] | TinaCMS [^9] |
|---------|---------------|--------------|
| Git-native | ✅ Yes | ✅ Yes |
| Visual editing | ❌ No (form-based) | ✅ Yes (in-context) |
| MDX support | ✅ Yes | ✅ Yes |
| Next.js entegrasyonu | ✅ Good | ✅ Excellent |
| Editorial workflow | ❌ No | ✅ Yes (Team Plus) |
| Content scheduling | ❌ No | ❌ No (external) |
| Localization | ❌ No | ❌ No (external) |
| Self-hosted | ✅ Yes (local) | ✅ Yes (TinaCloud or self-hosted) |
| Cost | Free | Free (solo) / $49/mo (Team Plus) |

Gistify için öneri: **TinaCMS** tercih edilmeli. Çünkü Gistify'nin editörleri (özellikle finansal analyst'ler), visual in-context editing'i tercih eder. TinaCMS'in Next.js App Router entegrasyonu en güçlü olanıdır [^9]. Ancak Gistify Vite kullandığından, TinaCMS'in Vite plugin'i değerlendirilmelidir. Eğer Vite desteği sınırlıysa, **Keystatic** daha hafif bir alternatiftir.

### 2.7 Asset Pipeline: Cloudflare R2 + CDN Rewrite

Gistify'nin mevcut yapıda, Markdown içindeki görseller muhtemelen relative path (`./assets/cpi.png`) veya public URL olarak referans ediliyor. Bu, **scale** sorunu yaratır: Git repo, büyük asset'lerle şişer; build süresi artar; CDN cache yoktur.

#### Cloudflare R2 Asset Pipeline

Cloudflare R2, S3-compatible API ile **zero egress fee** ve otomatik edge compression sunar [^16]. R2 bucket'larına **presigned URL** ile client-side upload yapılabilir. Markdown içindeki relative image path'leri, build sırasında veya runtime'da CDN URL'lerine rewrite edilir [^15].

```typescript
// server/assetPipeline.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
});

export async function generatePresignedUploadUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(r2, command, { expiresIn: 300 });
}

export function rewriteAssetUrls(content: string, cdnBaseUrl: string): string {
  // Markdown relative paths → CDN URLs
  return content.replace(
    /!\[([^\]]*)\]\((?!http)([^)]+)\)/g,
    (match, alt, relativePath) => {
      const cdnUrl = `${cdnBaseUrl}/${relativePath.replace(/^\.\//, '')}`;
      return `![${alt}](${cdnUrl})`;
    }
  );
}
```

```typescript
// client/src/components/MarkdownRenderEngine.tsx
import { useMemo } from 'react';

const CDN_BASE = 'https://cdn.gistify.app';

export function MarkdownRenderEngine({ content, charts }: { content: string; charts: ChartEmbed[] }) {
  const processedContent = useMemo(() => rewriteAssetUrls(content, CDN_BASE), [content]);
  // ... render logic
}
```

**Lazy Loading**: Görseller için `loading="lazy"` ve `decoding="async"` eklenmelidir. Intersection Observer ile viewport'a yaklaşan görseller önceden fetch edilebilir. **WebP/AVIF** format dönüşümü, Cloudflare Image Resizing ile edge'de yapılabilir.

---

## Bölüm 3: Gelişmiş Dinamik İçerik Sistemi

### 3.1 MDX Pipeline: next-mdx-remote-client vs @next/mdx

Gistify'nin mevcut dinamik MD pipeline'ı [Rapor], `react-markdown` + `remark` + `gray-matter` üzerine kuruludur. Bu, standart Markdown için yeterlidir ancak **MDX** (Markdown + JSX) desteği yoktur. MDX, içerik içinde **interaktif React component'leri** (chart, alert, calculator, embedded widget) kullanmaya izin verir. Gistify'nin raporları, statik metin yerine **canlı chart'lar**, **interaktif tablolar**, ve **AI-generated insight kartları** içermelidir.

#### MDX Runtime Seçimi

| Kütüphane | RSC Desteği | Vite Uyumluluğu | Dynamic Content | MDX v3 | Öneri |
|-----------|-------------|-----------------|---------------|--------|-------|
| `next-mdx-remote` [^5] | ✅ (`next-mdx-remote/rsc`) | ❌ Next.js only | ✅ Remote | ✅ | Next.js kullanılırsa |
| `next-mdx-remote-client` [^6] | ✅ | ❌ Next.js only | ✅ Remote | ✅ | Daha aktif fork |
| `@next/mdx` | ❌ (local files only) | ❌ Next.js only | ❌ Local | ✅ | Local MDX pages |
| `mdx-bundler` | ❌ | ⚠️ Vite desteği var | ✅ | ✅ | Vite + MDX |
| `@mdx-js/react` + `vite-plugin-mdx` | ❌ | ✅ Vite | ⚠️ Compile time | ✅ | Build-time MDX |

Gistify **Vite kullandığından** `next-mdx-remote` doğrudan kullanılamaz. Ancak Gistify, mevcut `react-markdown` pipeline'ını MDX desteği ile genişletebilir. **Öneri:** `react-markdown` yerine `@mdx-js/mdx` runtime'ı kullanılmalı. Vite için `@mdx-js/rollup` plugin'i, build-time MDX compile yapar; ancak Gistify'nin dinamik ihtiyacı (runtime'da MDX parse) için **client-side MDX runtime** gereklidir.

```typescript
// client/src/lib/mdx/runtime.ts
import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import rehypeHighlight from 'rehype-highlight';
import { CustomChart, CustomAlert, CustomTable, CustomCalculator } from '@/components/mdx';

const MDX_COMPONENTS = {
  Chart: CustomChart,
  Alert: CustomAlert,
  Table: CustomTable,
  Calculator: CustomCalculator,
};

export async function renderMDX(source: string): Promise<React.ReactNode> {
  const code = String(
    await compile(source, {
      outputFormat: 'function-body',
      remarkPlugins: [remarkGfm, remarkDirective],
      rehypePlugins: [rehypeHighlight],
      development: false,
    })
  );

  const { default: Content } = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return <Content components={MDX_COMPONENTS} />;
}
```

**Güvenlik Notu:** Client-side MDX compile, **arbitrary code execution riski** taşır. `compile` içinde `rehype-sanitize` ve `remark-lint` kullanılmalı; `dangerouslyAllowChildren` ve `eval` içeren custom component'ler yasaklanmalıdır. Gistify'nin admin paneli, sadece trusted user'ların MDX upload etmesine izin vermelidir.

### 3.2 Content Versioning & Git-based Workflow

Gistify'nin mevcut file-based pipeline'ı [Rapor], Git repo'da çalıştığından dolaylı olarak versiyonlama sağlar. Ancak bu, **content versioning** olarak kullanıcı dostu değildir. Git commit'ler, content değişikliklerini teknik olarak kaydeder; ancak finansal analyst'ler ve editörler için **side-by-side diff**, **anlık rollback**, ve **branch-based staging** araçlarına ihtiyaç vardır [^19].

#### Git-based CMS Versioning Mimarisi

```
┌─────────────────────────────────────────────────────────┐
│              Content Editor (TinaCMS / Keystatic)       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Edit         │  │ Save         │  │ Commit       │  │
│  │ (visual)     │  │ (draft)      │  │ (Git)        │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Git Repository (Content + Code)             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ main         │  │ preview/     │  │ archive/     │  │
│  │ (production) │  │ (staging)    │  │ (rollback)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              CI/CD Pipeline (GitHub Actions)             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Lint Content │  │ Parse MDX    │  │ Deploy       │  │
│  │ (schema)     │  │ (validate)   │  │ (ISR/Static) │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

```yaml
# .github/workflows/content-deploy.yml
name: Content Deploy
on:
  push:
    branches: [main, preview/*]
    paths:
      - 'earningreport/**'
      - 'momentum/**'
      - 'dailyreport/**'
      - 'flow/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm run content:lint  # Schema validation
      - run: pnpm run content:parse # MDX syntax check

  deploy:
    needs: validate
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -X POST https://api.gistify.app/revalidate \
            -H "Authorization: Bearer ${{ secrets.REVALIDATE_TOKEN }}" \
            -d '{"paths": ["/app", "/momentum", "/daily-report", "/flow"]}'
```

**Branch-based Preview:** Her `preview/rapor-adi` branch'i, otomatik olarak `preview.gistify.app/preview/rapor-adi` URL'sine deploy edilir. Editör, PR açmadan önce preview'da içeriği görür. Review sonrası merge, production'a otomatik deploy edilir [^14].

#### Content History & Rollback

Git-based CMS'ler (TinaCMS, Keystatic) içerik değişikliklerini doğal olarak Git commit'leri olarak versiyonlar [^19]. API-first CMS'ler (Strapi, Sanity) de native versioning sunar; Strapi 5 Growth/Enterprise plan'da Content History ile side-by-side snapshot karşılaştırma ve tek tıkla rollback vardır [^20].

Gistify için öneri: TinaCMS veya Keystatic kullanıldığından, **Git native versioning** zaten mevcuttur. Ancak kullanıcı dostu bir arayüz için, TinaCMS'in **Editorial Workflow** (draft, review, publish) özelliği $49/mo Team Plus plan ile etkinleştirilmelidir [^10]. Bu, finansal raporların **onay süreci** (compliance, risk management) için kritiktir.

### 3.3 ISR (Incremental Static Regeneration) Pattern

Gistify'nin mevcut yapısı, muhtemelen tamamen client-side rendered (CSR) veya build-time static (SSG) üzerine kuruludur. Ancak 1000+ rapor sayfası, her biri farklı data ile, **build-time SSG** için çok yavaştır. **ISR**, statik sayfaların runtime'da arka planda yeniden oluşturulmasını sağlar; bu, **binlerce sayfalık sitelerde** sadece etkilenen sayfaların güncellenmesini mümkün kılar [^17].

#### ISR Mimarisi

```
┌─────────────────────────────────────────────────────────┐
│              Client Request (Next.js / Vite + SSR)       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Request      │  │ Cache Hit?   │  │ Serve        │  │
│  │ /app/rapor-1 │  │ (Edge Cache) │  │ Stale / Fresh│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │ Cache Miss or Stale
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Origin Server (Next.js / Custom SSR)        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Re-generate  │  │ Parse MDX    │  │ Update Cache │  │
│  │ (background) │  │ (runtime)    │  │ (purge)      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

Next.js App Router'da ISR, `fetch(..., { next: { revalidate: 60 } })` ile time-based ve `revalidateTag()` / `revalidatePath()` ile on-demand revalidation olarak iki modda çalışır [^17]. Stale-while-revalidate pattern sayesinde kullanıcı her zaman hızlı yanıt alır; arka planda fresh content generate edilir.

Gistify **Vite kullandığından** Next.js App Router'ın ISR'ını doğrudan kullanamaz. Ancak **Vite + SSR** (`vite-plugin-ssr` veya `vike`) ile benzer bir pattern implemente edilebilir. Daha basit bir yaklaşım: **Cloudflare Pages + Functions** ile edge-side rendering (ESR) yapılır; sayfalar HTML olarak cache'lenir, content güncellendiğinde cache purge edilir.

```typescript
// worker/src/isr.ts — Cloudflare Worker ISR Logic
export async function handleISR(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const cacheKey = `isr:${url.pathname}`;
  const cache = await env.CACHE.match(cacheKey);

  // 1. Serve stale if available
  if (cache) {
    const age = Date.now() - new Date(cache.headers.get('x-generated-at') || 0).getTime();
    const maxAge = 60 * 1000; // 60 seconds revalidation

    if (age < maxAge) {
      return cache; // Fresh enough
    }

    // 2. Stale-while-revalidate: return stale, regenerate in background
    const ctx = request as unknown as { waitUntil: (p: Promise<unknown>) => void };
    ctx.waitUntil(regeneratePage(url.pathname, env));
    return cache;
  }

  // 3. Cache miss: generate synchronously
  return regeneratePage(url.pathname, env);
}

async function regeneratePage(path: string, env: Env): Promise<Response> {
  const html = await renderPage(path, env); // SSR render logic
  const response = new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'x-generated-at': new Date().toISOString(),
    },
  });
  await env.CACHE.put(`isr:${path}`, response.clone());
  return response;
}
```

#### On-Demand Revalidation

Headless CMS webhook'leriyle yaygın olarak kullanılır: CMS publish event → webhook → Next.js Route Handler → `revalidateTag` / `revalidatePath`; bu sayede binlerce sayfalık sitelerde sadece etkilenen sayfalar yeniden oluşturulur [^18]. Gistify için:

- **TinaCMS / Keystatic** publish event'i → GitHub Action → Cloudflare API cache purge.
- **Sanity / Strapi** publish event'i → webhook → `https://api.gistify.app/revalidate` → `revalidatePath('/app/rapor-adi')`.

```typescript
// server/api/revalidate.ts
import { LRUCache } from 'lru-cache';

const contentCache = new LRUCache<string, string>({ max: 500, ttl: 1000 * 60 * 30 });

export async function revalidatePath(path: string): Promise<void> {
  contentCache.delete(path);
  // Cloudflare Cache API purge
  await fetch(`https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ files: [`https://gistify.app${path}`] }),
  });
}
```

### 3.4 Content Personalization (AI-driven Recommendation)

Gistify'nin mevcut raporları, tüm kullanıcılara aynı şekilde sunulmaktadır. Ancak modern finansal platformlarda AI **spending pattern** analizi yaparak personalized financial advice, fraud detection, ve **personalized product recommendations** sunar [^12]. Amazon, Netflix, Spotify ile aynı mimari — **collaborative filtering + content-based analysis + behavioral signals** — finansal dashboard'lara uygulanabilir.

#### Personalization Katmanı Mimarisi

```
┌─────────────────────────────────────────────────────────┐
│              User Behavior Signals (Collector)         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Page Views   │  │ Dwell Time   │  │ Ticker Click │  │
│  │ (rapor okuma)│  │ (zaman)      │  │ (hisse)      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Watchlist    │  │ Search Query │  │ Social       │  │
│  │ Add/Remove   │  │ (ticker)     │  │ Interaction  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              AI Recommendation Engine                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Collaborative│  │ Content-Based│  │ Behavioral   │  │
│  │ Filtering    │  │ (tag, sector)│  │ (time, freq) │  │
│  │ (user-user)  │  │ (item-item)  │  │ (context)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Embedding    │  │ LLM Summary  │  │ Rank & Score │  │
│  │ Model        │  │ (rapor özeti)│  │ (relevance)  │  │
│  │ (OpenAI)     │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Personalized Content Delivery             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ "Sizin İçin" │  │ AI Insight   │  │ Smart        │  │
│  │ Raporlar     │  │ Kartları     │  │ Watchlist    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

```typescript
// server/ai/recommendation.ts
import { OpenAI } from 'openai';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db';
import { userEvents, reports, userPreferences } from '../db/schema';

interface UserProfile {
  userId: string;
  preferredSectors: string[];
  preferredTickers: string[];
  readingFrequency: 'daily' | 'weekly' | 'monthly';
  riskTolerance: 'low' | 'medium' | 'high';
}

export async function generateRecommendations(userId: string): Promise<string[]> {
  // 1. Fetch user behavior history
  const events = await db
    .select()
    .from(userEvents)
    .where(eq(userEvents.userId, userId))
    .orderBy(desc(userEvents.timestamp))
    .limit(100);

  // 2. Extract implicit preferences
  const tickerCounts: Record<string, number> = {};
  const sectorCounts: Record<string, number> = {};
  events.forEach((e) => {
    if (e.ticker) tickerCounts[e.ticker] = (tickerCounts[e.ticker] || 0) + 1;
    if (e.sector) sectorCounts[e.sector] = (sectorCounts[e.sector] || 0) + 1;
  });

  const topTickers = Object.entries(tickerCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);
  const topSectors = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([s]) => s);

  // 3. Content-based filtering: find reports matching user's top sectors/tickers
  const matchingReports = await db
    .select()
    .from(reports)
    .where(
      and(
        ...topSectors.map((s) => eq(reports.sector, s)),
        ...topTickers.map((t) => eq(reports.ticker, t))
      )
    )
    .orderBy(desc(reports.publishedAt))
    .limit(10);

  // 4. AI-generated summary (optional, for "AI Insight Card")
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `User ${userId} is interested in ${topTickers.join(', ')} and ${topSectors.join(', ')}. Summarize the market opportunity in 2 sentences.`;
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 150,
  });

  return {
    recommendedReportIds: matchingReports.map((r) => r.id),
    aiInsight: completion.choices[0].message.content,
    topTickers,
    topSectors,
  };
}
```

**Bookmark + Collection Pattern:** Kullanıcıların tek tek chart'ları bookmark'layıp bunları kategorik collection'larda gruplamasına izin veren pattern, My Bookmarks → Collection → Add Collection → Name + Category + Description + Chart selection flow şeklindedir [^13]. Gistify, bu pattern'i raporlar ve ticker'lar için uygulayabilir: "Kazanç Raporlarım", "Momentum Setlerim", "CPI Takibi" gibi collection'lar.

### 3.5 i18n & Localization: Crowdin, Tolgee, veya i18next

Gistify'nin mevcut i18n desteği (TR/EN) geniş kapsamlıdır [Rapor]. Ancak `Pay.tsx` inline COPY objesi 170+ satır [Rapor] ve hardcoded metinler, i18n yönetimini zayıflatır. Modern i18n, sadece metin çevirisi değil, aynı zamanda **locale-aware date/number/currency formatting**, **RTL desteği**, ve **content localization** (farklı locale'de farklı içerik) içerir.

#### i18n Stack Karşılaştırması

| Kütüphane | Translation Management | In-Context Editing | TypeScript | CLI | Fiyat | Öneri |
|-----------|------------------------|--------------------|------------|-----|-------|-------|
| **i18next** | JSON/JSON5 files | ❌ No | ✅ `react-i18next` | ✅ `i18next-parser` | Free | Temel çeviri |
| **Tolgee** | Cloud + local | ✅ Yes (dev tools) | ✅ Tolgee Provider | ✅ CLI | Free / $49/mo | Developer experience |
| **Crowdin** | Cloud platform | ✅ Yes (editor) | ✅ API | ✅ CLI | $0.004/word | Enterprise scale |
| **Lokalise** | Cloud platform | ✅ Yes | ✅ API | ✅ CLI | $120/mo | Orta ölçek |

Gistify için öneri: **Tolgee** veya **i18next + Crowdin** kombinasyonu. Tolgee, in-context editing (uygulama içinde doğrudan çeviri yapma) sunar; bu, teknik olmayan çevirmenler için idealdir. Eğer Gistify profesyonel çevirmenlerle çalışacaksa, **Crowdin** (veya **Lokalise**) cloud platformu, translation memory, glossary, ve proofreading workflow sunar.

```typescript
// client/src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'tr',
    supportedLngs: ['tr', 'en', 'de', 'fr', 'zh'],
    interpolation: { escapeValue: false },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
```

```typescript
// client/src/components/Pricing.tsx
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/i18n/format';

export function Pricing() {
  const { t, i18n } = useTranslation('pricing');
  const locale = i18n.language;

  return (
    <div className="space-y-4">
      <h2 className="text-4xl md:text-5xl font-bold">
        {t('title')}
      </h2>
      <p className="text-2xl">
        {formatCurrency(29.99, 'USD', locale)}
      </p>
      <p className="text-muted-foreground">
        {t('description', { plan: t('plans.pro') })}
      </p>
    </div>
  );
}
```

**Locale-aware Formatting:**

```typescript
// client/src/lib/i18n/format.ts
export function formatCurrency(value: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: string | Date, locale: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  }).format(new Date(date));
}

export function formatPercent(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 2,
    signDisplay: 'exceptZero',
  }).format(value / 100);
}
```

### 3.6 Asset Pipeline: Multipart Upload, ZIP, CDN Rewrite, Lazy Loading

Gistify'nin mevcut content pipeline'ında, asset yönetimi (görsel, PDF, ZIP) muhtemelen manueldir. Markdown içindeki `./assets/cpi.png` gibi path'ler, build sırasında veya runtime'da çözülmelidir. Büyük ölçekte, bu asset'ler Git repo'ya bağlı olduğundan scale sorunu yaratır [^8].

#### Multipart Upload & ZIP Processing

Admin panelinden, editörler çok sayıda görsel veya ZIP dosyası upload edebilir. ZIP dosyaları, server-side açılıp içindeki her dosya ayrı ayrı R2'ye yüklenmelidir.

```typescript
// server/api/upload.ts
import { unzip } from 'unzipper';
import { pipeline } from 'stream/promises';
import { generatePresignedUploadUrl } from '../assetPipeline';

export async function handleMultipartUpload(request: Request): Promise<Response> {
  const formData = await request.formData();
  const files = formData.getAll('files') as File[];
  const results: { filename: string; cdnUrl: string; size: number }[] = [];

  for (const file of files) {
    const key = `uploads/${crypto.randomUUID()}/${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Direct upload to R2 (if server has credentials)
    // Or: generate presigned URL for client-side upload
    const signedUrl = await generatePresignedUploadUrl(key, file.type);

    results.push({
      filename: file.name,
      cdnUrl: `https://cdn.gistify.app/${key}`,
      size: file.size,
    });
  }

  return Response.json({ success: true, files: results });
}

export async function handleZipUpload(request: Request): Promise<Response> {
  const formData = await request.formData();
  const zipFile = formData.get('zip') as File;
  if (!zipFile) return new Response('No ZIP file', { status: 400 });

  const extracted: string[] = [];
  const zipStream = unzip.Parse();

  zipStream.on('entry', async (entry) => {
    if (entry.type === 'File') {
      const key = `uploads/${crypto.randomUUID()}/${entry.path}`;
      // Stream to R2
      // ...
      extracted.push(`https://cdn.gistify.app/${key}`);
    } else {
      entry.autodrain();
    }
  });

  await pipeline(zipFile.stream(), zipStream);

  return Response.json({ success: true, extracted });
}
```

#### Lazy Loading & Intersection Observer

Markdown render ederken, görseller için `loading="lazy"` ve `decoding="async"` eklenmelidir. Daha gelişmiş bir yaklaşım, **Intersection Observer** ile viewport'a yaklaşan görseller için önceden fetch (preload) yapmaktır.

```typescript
// client/src/components/mdx/CustomImage.tsx
import { useEffect, useRef, useState } from 'react';

interface CustomImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
}

export function CustomImage({ src, alt, placeholder, ...props }: CustomImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Preload 200px before viewport
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg">
      {placeholder && !isLoaded && (
        <img
          src={placeholder}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
      )}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-auto transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
    </div>
  );
}
```

---

## Bölüm 4: Gelişmiş Dashboard & Widget Mimarisi

### 4.1 Widget-based Architecture: Koyfin Modeli

Gistify'nin mevcut dashboard'ları (Ana App, Benchmark), **fixed tab yapısı** ile çalışır: `OverviewTab`, `MomentumTab`, `IVCrushTab`, `CalendarTab`, `OptionDetailTab`, `EarningReportPlaybookTab` [Rapor]. Kullanıcı, bu tab'ları özelleştiremez; yeni tab eklemek için kod değişimi gerekir. Bu, **widget-based architecture** ihtiyacını doğurur.

Koyfin modelinde [^2][^3], dashboard blank bir canvas'tır; kullanıcı widget ekler, siler, boyutlandırır, ve yer değiştirir. Widget türleri: watchlist, chart, news, screener, notes, financials, economic calendar. Her widget, ** declarative configuration** ile tanımlanır.

```typescript
// shared/types/widgets.ts
export type WidgetType =
  | 'watchlist'
  | 'chart'
  | 'news'
  | 'screener'
  | 'notes'
  | 'earnings-calendar'
  | 'market-depth'
  | 'ai-insight';

export interface WidgetDefinition {
  id: string;
  type: WidgetType;
  title: string;
  x: number; // grid units
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  colorGroup?: string; // 'red' | 'blue' | 'green' | ... (7 groups)
  config: WidgetConfigMap[WidgetType];
}

export interface WatchlistConfig {
  tickers: string[];
  columns: ('price' | 'change' | 'volume' | 'pe' | 'marketCap')[];
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

export interface ChartConfig {
  ticker: string;
  type: 'candlestick' | 'line' | 'area' | 'bar';
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';
  indicators: ('sma' | 'ema' | 'rsi' | 'macd' | 'bollinger')[];
  dataSource: 'polygon' | 'fmp' | 'alpha';
}

export interface NewsConfig {
  sources: string[];
  tickers: string[];
  maxItems: number;
  sentimentFilter: 'all' | 'positive' | 'negative';
}

export type WidgetConfigMap = {
  watchlist: WatchlistConfig;
  chart: ChartConfig;
  news: NewsConfig;
  screener: ScreenerConfig;
  notes: NotesConfig;
  'earnings-calendar': EarningsCalendarConfig;
  'market-depth': MarketDepthConfig;
  'ai-insight': AIInsightConfig;
};
```

#### Widget Registry

Widget'lar, runtime'da dinamik olarak yüklenmelidir. Her widget, kendi `React.lazy()` chunk'una sahiptir.

```typescript
// client/src/widgets/registry.tsx
import { lazy } from 'react';
import type { WidgetType } from '@shared/types/widgets';

const WIDGET_COMPONENTS: Record<WidgetType, React.LazyExoticComponent<React.FC<any>>> = {
  watchlist: lazy(() => import('./WatchlistWidget')),
  chart: lazy(() => import('./ChartWidget')),
  news: lazy(() => import('./NewsWidget')),
  screener: lazy(() => import('./ScreenerWidget')),
  notes: lazy(() => import('./NotesWidget')),
  'earnings-calendar': lazy(() => import('./EarningsCalendarWidget')),
  'market-depth': lazy(() => import('./MarketDepthWidget')),
  'ai-insight': lazy(() => import('./AIInsightWidget')),
};

export function getWidgetComponent(type: WidgetType) {
  return WIDGET_COMPONENTS[type];
}
```

### 4.2 Drag-Drop & Layout Persistence: react-grid-layout

Widget'ların drag-drop ve resize edilebilmesi için **react-grid-layout** (RGL) en popüler ve kanıtlanmış kütüphanedir [^10]. RGL, grid-based layout sunar; her widget `x`, `y`, `w`, `h` (grid units) ile konumlanır. Layout, `localStorage` veya backend'e persist edilebilir.

```typescript
// client/src/components/DashboardCanvas.tsx
import { useCallback, useMemo } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDashboardStore } from '@gistify/data/stores';
import { getWidgetComponent } from '../widgets/registry';

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
      resizeHandles={['se', 'e', 's']}
    >
      {widgets.map((widget) => {
        const WidgetComponent = getWidgetComponent(widget.type);
        return (
          <div key={widget.id} className="widget-container bg-surface border border-border rounded-xl shadow-sm">
            <div className="widget-drag-handle flex items-center justify-between px-4 py-2 border-b border-border cursor-move">
              <span className="text-sm font-medium">{widget.title}</span>
              <div className="flex gap-2">
                {widget.colorGroup && (
                  <div className={`w-3 h-3 rounded-full bg-${widget.colorGroup}-500`} />
                )}
                <button className="text-muted-foreground hover:text-foreground">⋯</button>
              </div>
            </div>
            <div className="p-4 h-[calc(100%-40px)] overflow-auto">
              <React.Suspense fallback={<WidgetSkeleton />}>
                <WidgetComponent config={widget.config} colorGroup={widget.colorGroup} />
              </React.Suspense>
            </div>
          </div>
        );
      })}
    </GridLayout>
  );
}

function WidgetSkeleton() {
  return <div className="animate-pulse bg-muted/50 rounded-lg h-full w-full" />;
}
```

**Layout Persistence:** Zustand persist middleware ile layout `localStorage`'a kaydedilir. Cross-device sync için, layout backend'e (PostgreSQL / SQLite) kaydedilmelidir.

```typescript
// server/db/schema.ts (Drizzle ORM)
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const userLayouts = sqliteTable('user_layouts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  layout: text('layout', { mode: 'json' }).notNull(), // GridLayout.Layout[] JSON
  isDefault: integer('is_default', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});
```

### 4.3 Color Channel Linking: Widget-to-Widget Communication

TradingView ve Koyfin'de [^1][^3], aynı **color group**'a bağlı widget'lar birbirinin state değişikliklerini dinler. Örneğin, watchlist widget'ında `$AAPL` seçildiğinde, aynı "red" group'undaki chart widget'ı otomatik olarak `$AAPL` chart'ını gösterir.

Bu, **pub/sub pattern** ile implemente edilir. Zustand store, global `selectedTickers` state'i tutar; widget'lar bu state'i subscribe eder.

```typescript
// shared/stores/dashboardStore.ts (Color Channel Linking eklentisi)
interface ColorChannelState {
  selectedTickers: Record<string, string[]>; // colorGroup -> ticker[]
  linkTicker: (group: string, ticker: string) => void;
  unlinkTicker: (group: string, ticker: string) => void;
  setTicker: (group: string, ticker: string) => void; // Single selection
}

// Watchlist Widget
import { useDashboardStore } from '@gistify/data/stores';

export function WatchlistWidget({ config, colorGroup }: WidgetProps) {
  const { linkTicker, setTicker, selectedTickers } = useDashboardStore();

  const handleTickerClick = (ticker: string) => {
    if (colorGroup) {
      setTicker(colorGroup, ticker); // Link to color group
    }
  };

  return (
    <div className="space-y-2">
      {config.tickers.map((ticker) => (
        <button
          key={ticker}
          onClick={() => handleTickerClick(ticker)}
          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
            colorGroup && selectedTickers[colorGroup]?.includes(ticker)
              ? 'bg-accent/20 text-accent'
              : 'hover:bg-muted'
          }`}
        >
          <span className="font-mono font-medium">{ticker}</span>
        </button>
      ))}
    </div>
  );
}

// Chart Widget
export function ChartWidget({ config, colorGroup }: WidgetProps) {
  const { selectedTickers } = useDashboardStore();
  const activeTicker = colorGroup
    ? selectedTickers[colorGroup]?.[0] || config.ticker
    : config.ticker;

  const { data } = useTickerSnapshot(activeTicker);

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono font-bold">{activeTicker}</span>
        {colorGroup && (
          <span className="text-xs text-muted-foreground">Group: {colorGroup}</span>
        )}
      </div>
      <LightweightChart ticker={activeTicker} type={config.type} />
    </div>
  );
}
```

### 4.4 Canvas-based Charting: TradingView Lightweight Charts vs Apache ECharts vs Recharts

Gistify'nin mevcut chart'ları **Recharts** üzerine kuruludur [Rapor]. Recharts, SVG tabanlıdır ve 1K+ data point'te frame drop yaşar [^4]. Gistify'nin 11 faktörlü momentum skoru, intraday tick data, veya order book depth göstereceği senaryolarda, **Canvas-based rendering** zorunludur.

#### Charting Kütüphaneleri Karşılaştırması

| Kütüphane | Renderer | Finansal Özellikler | Performans (10K+ points) | Bundle Size | SSR | Touch | Öneri |
|-----------|----------|---------------------|--------------------------|-------------|-----|-------|-------|
| **Recharts** [^4] | SVG | Genel | ❌ 1K'da frame drop | ~60KB | ✅ Yes | ❌ No | Mevcut (düşük-freq) |
| **TradingView LC** [^5] | Canvas | Candlestick, Line, native | ✅ 10K+ akıcı | ~45KB | ❌ No | ✅ Yes | Finansal chart'lar |
| **Apache ECharts** [^4] | Canvas (default) | Çok çeşitli | ✅ 100K akıcı | ~300KB (naïve) | ❌ No | ✅ Yes | Kompleks viz |
| **ApexCharts** [^27] | SVG | Genel, interaktif | ❌ 500K'da çöker | ~200KB | ❌ No | ✅ Yes | Genel dashboard |
| **LightningChart** [^27] | WebGL | Ultra-high perf | ✅ 10M 290ms | ~500KB | ❌ No | ✅ Yes | Ultra-high freq |
| **visx** [^6] | SVG | Primitives | ⚠️ Özel | ~10KB | ✅ Yes | ❌ No | Custom chart'lar |

**Öneri:**
- **Finansal candlestick/line chart'lar** (Ana App, Benchmark): **TradingView Lightweight Charts** (LC)
- **Kompleks dashboard viz** (scatter, radar, heatmap): **Apache ECharts** (selective import)
- **Mevcut Recharts chart'ları** (low-freq): Geçiş aşamasında paralel çalışır, sonradan LC'ye geçilir

```typescript
// client/src/widgets/ChartWidget.tsx
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

interface ChartWidgetProps {
  ticker: string;
  type: 'candlestick' | 'line' | 'area';
  data: Array<{ time: string; open: number; high: number; low: number; close: number; value?: number }>;
}

export function ChartWidget({ ticker, type, data }: ChartWidgetProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'var(--color-text-primary)',
      },
      grid: {
        vertLines: { color: 'var(--color-border-subtle)' },
        horzLines: { color: 'var(--color-border-subtle)' },
      },
      crosshair: {
        mode: 1, // CrosshairMode.Normal
      },
      rightPriceScale: {
        borderColor: 'var(--color-border-subtle)',
      },
      timeScale: {
        borderColor: 'var(--color-border-subtle)',
        timeVisible: true,
      },
      autoSize: true,
    });

    chartRef.current = chart;

    let series;
    if (type === 'candlestick') {
      series = chart.addCandlestickSeries({
        upColor: 'var(--color-bull)',
        downColor: 'var(--color-bear)',
        borderUpColor: 'var(--color-bull)',
        borderDownColor: 'var(--color-bear)',
        wickUpColor: 'var(--color-bull)',
        wickDownColor: 'var(--color-bear)',
      });
    } else {
      series = chart.addAreaSeries({
        lineColor: 'var(--color-accent)',
        topColor: 'var(--color-accent-alpha)',
        bottomColor: 'transparent',
        lineWidth: 2,
      });
    }

    seriesRef.current = series;
    series.setData(data);

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [type]);

  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.setData(data);
    }
  }, [data]);

  return (
    <div className="w-full h-full">
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
}
```

**CSS Custom Properties ile Theming:** TradingView LC, `textColor` ve `borderColor`'ı CSS variable'lara bağlayarak dark/light mode otomatik switch edilebilir. `var(--color-bull)` ve `var(--color-bear)` OKLCH token'larıdır [^15][^16].

### 4.5 Data Virtualization: TanStack Virtual, react-virtuoso

Gistify'nin `MomentumTab` 11 kolon, `IVCrushTab` 10 kolon, `CalendarTab` 9 kolon [Rapor]. Mobilde kullanılamaz. Masaüstünde bile, 1000+ satır tablo DOM node count'u 100K+ seviyesine çıkar ve scroll performansı felç olur.

#### TanStack Virtual + TanStack Table

**@tanstack/react-table** + **@tanstack/react-virtual** kombinasyonu, pagination olmadan on binlerce row'u sorunsuz render edebilir [^18]. TanStack Table column logic, sorting, filtering, row selection; TanStack Virtual viewport rendering.

```typescript
// client/src/components/DataTableVirtual.tsx
import { useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

interface DataTableVirtualProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  rowHeight?: number;
}

export function DataTableVirtual<T>({ data, columns, rowHeight = 48 }: DataTableVirtualProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table.getRowModel().rows;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div ref={parentRef} className="overflow-auto h-[500px] border border-border rounded-xl">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 text-left font-medium text-muted-foreground">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          <tr>
            <td colSpan={columns.length} style={{ height: `${virtualizer.getTotalSize()}px` }} className="p-0">
              <div
                style={{
                  position: 'relative',
                  height: `${virtualizer.getTotalSize()}px`,
                  width: '100%',
                }}
              >
                {virtualItems.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <div
                      key={row.id}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className="flex border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <div
                          key={cell.id}
                          className="px-4 py-2 flex-1 min-w-0"
                          style={{ width: cell.column.getSize() }}
                        >
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

**Benchmark:** 100K item list için: no virtualization ~2000ms initial render, ~15 FPS. **@tanstack/react-virtual** ~6ms, 60 FPS. DOM node count: virtualization ~20 vs no virtualization 100,000 [^17].

### 4.6 Dark/Light Mode Theming: OKLCH Design Tokens

Gistify'nin mevcut durumunda, 3 farklı renk sistemi (HEX, OKLCH, Tailwind Slate) vardır [Rapor]. Bu, visual disconnect yaratır. **OKLCH**, perceptually uniform color space'dir; aynı Lightness değeri farklı hue'larda eşit parlaklık verir [^15][^16].

#### OKLCH Design Token Sistemi

```css
/* packages/ui/src/styles/tokens.css */
:root {
  /* Base colors */
  --color-bg: oklch(0.11 0.025 230);
  --color-surface: oklch(0.15 0.03 225);
  --color-surface-elevated: oklch(0.18 0.035 220);
  --color-border: oklch(0.25 0.02 230);
  --color-border-subtle: oklch(0.20 0.015 230);

  /* Text */
  --color-text-primary: oklch(0.95 0.01 230);
  --color-text-secondary: oklch(0.75 0.015 230);
  --color-text-tertiary: oklch(0.60 0.01 230);
  --color-text-muted: oklch(0.45 0.01 230);

  /* Semantic */
  --color-bull: oklch(0.78 0.18 160);
  --color-bull-light: oklch(0.85 0.12 160);
  --color-bear: oklch(0.65 0.22 25);
  --color-bear-light: oklch(0.72 0.15 25);
  --color-caution: oklch(0.75 0.15 75);
  --color-accent: oklch(0.70 0.16 260);
  --color-accent-light: oklch(0.80 0.10 260);

  /* Chart */
  --color-chart-1: oklch(0.70 0.16 260);
  --color-chart-2: oklch(0.75 0.14 160);
  --color-chart-3: oklch(0.65 0.18 25);
  --color-chart-4: oklch(0.72 0.12 75);
  --color-chart-5: oklch(0.60 0.10 300);

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-4xl: 32px;
}

[data-theme="light"] {
  --color-bg: oklch(0.98 0.01 230);
  --color-surface: oklch(0.95 0.02 225);
  --color-surface-elevated: oklch(1.0 0 0);
  --color-border: oklch(0.85 0.02 230);
  --color-text-primary: oklch(0.20 0.02 230);
  --color-text-secondary: oklch(0.40 0.015 230);
  --color-text-tertiary: oklch(0.55 0.01 230);
  --color-text-muted: oklch(0.65 0.01 230);
}
```

**Tailwind Integration:**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-elevated': 'var(--color-surface-elevated)',
        border: 'var(--color-border)',
        'border-subtle': 'var(--color-border-subtle)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          muted: 'var(--color-text-muted)',
        },
        bull: {
          DEFAULT: 'var(--color-bull)',
          light: 'var(--color-bull-light)',
        },
        bear: {
          DEFAULT: 'var(--color-bear)',
          light: 'var(--color-bear-light)',
        },
        caution: 'var(--color-caution)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          light: 'var(--color-accent-light)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        '4xl': 'var(--radius-4xl)',
      },
    },
  },
};
```

**Colorblind Accessibility:** Sinyal renkleri (bull, bear, caution) yanında **ikon (▲, ▼, ▶)** veya **text label** kullanılmalıdır. Renk Körlüğü (deuteranopia, protanopia) olan kullanıcılar, renklerden bağımsız sinyal anlayabilir [Rapor].

### 4.7 Mobile-First Responsive Patterns: Bottom Sheet, Swipeable Tabs

Gistify'nin mevcut tabloları (11 kolon, 10 kolon) mobilde kullanılamaz [Rapor]. Mobil finansal dashboard'lar için kritik pattern'ler: **bottom sheet** (detaylı bilgi gösterimi), **swipeable tabs** (multi-view navigation), **one-handed optimization** (sık kullanılan elementler ekran altına), **lazy loading** (performans), **visual hierarchy** (size/color/contrast ile önemli content'i öne çıkarma) [^14].

#### Bottom Sheet Pattern

```typescript
// client/src/components/mobile/BottomSheet.tsx
import { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';

interface BottomSheetProps {
  children: React.ReactNode;
  title: string;
  maxHeight?: string;
}

export function BottomSheet({ children, title, maxHeight = '80vh' }: BottomSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();
  const y = useMotionValue(0);
  const bgOpacity = useTransform(y, [0, 300], [1, 0]);

  const handleDragEnd = useCallback(
    (_: any, info: any) => {
      if (info.offset.y > 100) {
        controls.start('closed');
        setIsOpen(false);
      } else {
        controls.start('open');
      }
    },
    [controls]
  );

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          controls.start('open');
        }}
        className="fixed bottom-4 left-4 right-4 bg-accent text-accent-foreground py-3 rounded-xl font-medium shadow-lg md:hidden"
      >
        {title}
      </button>

      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          style={{ opacity: bgOpacity }}
          onClick={() => {
            controls.start('closed');
            setIsOpen(false);
          }}
        >
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-2xl shadow-2xl overflow-hidden"
            style={{ maxHeight, y }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial="closed"
            animate={controls}
            variants={{
              open: { y: 0 },
              closed: { y: '100%' },
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mt-3 mb-2" />
            <div className="px-4 pb-4 overflow-y-auto" style={{ maxHeight: `calc(${maxHeight} - 40px)` }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
```

#### Swipeable Tabs

Mobil cihazlarda, tab'lar yerine **swipeable tabs** (horizontal swipe ile view değiştirme) kullanılmalıdır. Bu, one-handed kullanımı destekler.

```typescript
// client/src/components/mobile/SwipeableTabs.tsx
import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface SwipeableTabsProps {
  tabs: { id: string; label: string; content: React.ReactNode }[];
}

export function SwipeableTabs({ tabs }: SwipeableTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const width = containerRef.current?.offsetWidth || window.innerWidth;

  const handleDragEnd = (_: any, info: any) => {
    const threshold = width * 0.2;
    if (info.offset.x < -threshold && activeIndex < tabs.length - 1) {
      setActiveIndex(activeIndex + 1);
      animate(x, -(activeIndex + 1) * width, { type: 'spring', stiffness: 300, damping: 30 });
    } else if (info.offset.x > threshold && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      animate(x, -(activeIndex - 1) * width, { type: 'spring', stiffness: 300, damping: 30 });
    } else {
      animate(x, -activeIndex * width, { type: 'spring', stiffness: 300, damping: 30 });
    }
  };

  return (
    <div ref={containerRef} className="w-full overflow-hidden md:hidden">
      <div className="flex mb-4 px-4">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveIndex(index);
              animate(x, -index * width, { type: 'spring', stiffness: 300, damping: 30 });
            }}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              index === activeIndex
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <motion.div
        className="flex"
        style={{ x, width: `${tabs.length * 100}%` }}
        drag="x"
        dragConstraints={{ left: -(tabs.length - 1) * width, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        {tabs.map((tab) => (
          <div key={tab.id} className="w-full flex-shrink-0 px-4">
            {tab.content}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
```

#### Table → Card View (Mobile)

`md:` breakpoint altında tablolar, kart listesine dönüştürülmelidir. Her row = bir card; her kolon = card içinde `label: value`.

```typescript
// client/src/components/mobile/TableCardView.tsx
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
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {col.label}
              </span>
              <span className="text-sm font-medium font-mono">
                {col.format ? col.format(row[col.key]) : String(row[col.key])}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

---

## Bölüm 5: Gelişmiş Sosyal Katman & Real-time

### 5.1 StockTwits Modeli: Cashtag, Sentiment Indexing, AI Moderation

Gistify'nin Flow sosyal katmanı yok [Rapor]: beğenme, yorum, link, paylaşım özellikleri eksik. StockTwits, finansal sosyal medyanın referans modelidir. Gistify için uygulanacak özellikler:

1. **Cashtag:** `$AAPL`, `$TSLA` formatında hisse etiketleri. Her cashtag, o hissenin sosyal sayfasına linklenir.
2. **Sentiment Indexing:** Kullanıcı mesajlarına **bullish / bearish / neutral** sentiment atanır. Bu, aggregate edilerek **hisse başlı sentiment score** oluşturulur.
3. **AI Moderation:** Toxic content, spam, ve manipulation tespiti için **FinBERT** veya **roberta-base** fine-tuned modeli kullanılır.

#### Sentiment Analysis Pipeline

```typescript
// server/ai/sentiment.ts
import { pipeline } from '@xenova/transformers';

interface SentimentResult {
  label: 'bullish' | 'bearish' | 'neutral';
  score: number;
  confidence: number;
}

class SentimentAnalyzer {
  private classifier: any;

  async initialize() {
    // FinBERT veya fine-tuned roberta-base
    this.classifier = await pipeline('text-classification', 'yiyanghkust/finbert-tone');
  }

  async analyze(text: string): Promise<SentimentResult> {
    const result = await this.classifier(text);
    const { label, score } = result[0];

    // Map FinBERT labels to Gistify sentiment
    const sentimentMap: Record<string, SentimentResult['label']> = {
      'Positive': 'bullish',
      'Negative': 'bearish',
      'Neutral': 'neutral',
    };

    return {
      label: sentimentMap[label] || 'neutral',
      score: score,
      confidence: score > 0.8 ? 'high' : score > 0.6 ? 'medium' : 'low',
    };
  }
}

export const sentimentAnalyzer = new SentimentAnalyzer();

// Aggregate sentiment per ticker
export async function aggregateTickerSentiment(ticker: string, timeWindow: string): Promise<{
  bullish: number;
  bearish: number;
  neutral: number;
  overall: 'bullish' | 'bearish' | 'neutral';
}> {
  const messages = await db
    .select()
    .from(socialMessages)
    .where(
      and(
        eq(socialMessages.ticker, ticker),
        gte(socialMessages.timestamp, sql`datetime('now', ${timeWindow})`)
      )
    );

  const counts = { bullish: 0, bearish: 0, neutral: 0 };
  messages.forEach((m) => {
    counts[m.sentiment]++;
  });

  const total = messages.length;
  const overall =
    counts.bullish > counts.bearish && counts.bullish > counts.neutral
      ? 'bullish'
      : counts.bearish > counts.bullish && counts.bearish > counts.neutral
      ? 'bearish'
      : 'neutral';

  return { ...counts, overall };
}
```

### 5.2 eToro CopyTrader Modeli: Social Trading, Risk Score

eToro'nun **CopyTrader** modeli, kullanıcıların başarılı trader'ları takip edip portföylerini otomatik kopyalamasına izin verir. Gistify için, bu model **"Analyst Copy"** veya **"Strategy Copy"** olarak uygulanabilir:

- **Analyst Copy:** Kullanıcı, başarılı bir finansal analyst'i (Gistify'nin AI agent'ları veya topluluk analyst'leri) takip eder. Analyst'in raporları, watchlist değişiklikleri, ve alert'leri otomatik olarak kullanıcının feed'ine düşer.
- **Risk Score:** Her analyst'in veya AI model'in geçmiş performansına dayalı **risk score** (1-10) hesaplanır. Kullanıcı, risk toleransına göre analyst seçer.
- **Portfolio Mirror:** Kullanıcı, analyst'in açık pozisyonlarını (eğer bağlantılı broker varsa) veya sadece "paper trade" olarak izleyebilir.

```typescript
// server/social/copyTrading.ts
interface AnalystProfile {
  id: string;
  name: string;
  riskScore: number; // 1-10
  return30d: number;
  return1y: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  followers: number;
  aum: number; // Assets under management (virtual)
}

interface CopyRelationship {
  userId: string;
  analystId: string;
  copyRatio: number; // 0.1 - 2.0 (multiplier)
  maxExposure: number; // Max $ exposure per trade
  stopLoss: number; // Auto stop copy if drawdown > X%
  isActive: boolean;
}

export async function calculateRiskScore(analystId: string): Promise<number> {
  const trades = await db
    .select()
    .from(analystTrades)
    .where(eq(analystTrades.analystId, analystId))
    .orderBy(desc(analystTrades.timestamp))
    .limit(100);

  const returns = trades.map((t) => t.returnPercent);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const volatility = Math.sqrt(returns.map((r) => Math.pow(r - avgReturn, 2)).reduce((a, b) => a + b, 0) / returns.length);
  const maxDrawdown = calculateMaxDrawdown(returns);
  const winRate = trades.filter((t) => t.returnPercent > 0).length / trades.length;

  // Risk score: higher = riskier (inverse of Sharpe-like metric)
  const sharpeLike = avgReturn / (volatility || 1);
  const riskScore = Math.min(10, Math.max(1, Math.round((1 / sharpeLike) * 5 + maxDrawdown * 2)));

  return riskScore;
}
```

### 5.3 Real-time Feed: WebSocket + SSE + Polling Fallback

Bölüm 2.5'te detaylandırılan hibrid pattern, sosyal feed için de geçerlidir. StockTwits benzeri bir feed, **WebSocket primary**, **SSE fallback**, **REST polling backup** ile çalışır.

#### Cloudflare Durable Objects Social Feed

```typescript
// worker/src/socialFeed.ts
import { DurableObject } from 'cloudflare:workers';

export class SocialFeed extends DurableObject {
  private messages: SocialMessage[] = [];
  private sessions: Map<string, WebSocket> = new Map();
  private tickerSubscribers: Map<string, Set<string>> = new Map(); // ticker -> sessionIds

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.headers.get('Upgrade') === 'websocket') {
      const userId = url.searchParams.get('userId');
      if (!userId) return new Response('Missing userId', { status: 400 });

      const [client, server] = Object.values(new WebSocketPair());
      this.sessions.set(userId, server);
      server.accept();

      server.addEventListener('message', async (msg) => {
        const data = JSON.parse(msg.data as string);

        if (data.action === 'subscribe') {
          // Subscribe to ticker feed
          const ticker = data.ticker;
          if (!this.tickerSubscribers.has(ticker)) {
            this.tickerSubscribers.set(ticker, new Set());
          }
          this.tickerSubscribers.get(ticker)!.add(userId);

          // Send last 50 messages for this ticker
          const history = this.messages.filter((m) => m.ticker === ticker).slice(-50);
          server.send(JSON.stringify({ type: 'history', ticker, data: history }));
        }

        if (data.action === 'publish') {
          const message: SocialMessage = {
            id: crypto.randomUUID(),
            userId: data.userId,
            ticker: data.ticker,
            content: data.content,
            sentiment: data.sentiment,
            timestamp: new Date().toISOString(),
            replyTo: data.replyTo,
          };

          this.messages.push(message);
          if (this.messages.length > 10000) this.messages.shift(); // Keep last 10K

          // Broadcast to subscribers of this ticker
          const subscribers = this.tickerSubscribers.get(data.ticker) || new Set();
          subscribers.forEach((sessionId) => {
            const ws = this.sessions.get(sessionId);
            if (ws?.readyState === WebSocket.READY_STATE_OPEN) {
              ws.send(JSON.stringify({ type: 'new_message', data: message }));
            }
          });
        }
      });

      server.addEventListener('close', () => {
        this.sessions.delete(userId);
        // Clean up subscriptions
        this.tickerSubscribers.forEach((subs) => subs.delete(userId));
      });

      return new Response(null, { status: 101, webSocket: client });
    }

    return new Response('Not Found', { status: 404 });
  }
}
```

### 5.4 Comment Threading: Nested Replies, Pagination, Infinite Scroll

Sosyal feed'lerde, flat comment list yerine **nested reply tree** kullanılmalıdır. Her mesaj, `parentId` ile bir parent'a bağlanır. Root-level mesajlar = ana feed; `replyTo` olanlar = nested reply.

```typescript
// server/db/schema.ts
export const socialMessages = sqliteTable('social_messages', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  ticker: text('ticker').notNull(),
  content: text('content').notNull(),
  sentiment: text('sentiment', { enum: ['bullish', 'bearish', 'neutral'] }).notNull(),
  replyTo: text('reply_to'), // null = root message
  threadRootId: text('thread_root_id'), // Top-level thread ID (for quick filtering)
  likes: integer('likes').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Recursive CTE for thread tree
export async function getThreadTree(rootId: string): Promise<SocialMessage[]> {
  const result = await db.all(sql`
    WITH RECURSIVE thread_tree AS (
      SELECT * FROM social_messages WHERE id = ${rootId}
      UNION ALL
      SELECT m.* FROM social_messages m
      INNER JOIN thread_tree t ON m.reply_to = t.id
    )
    SELECT * FROM thread_tree ORDER BY created_at ASC;
  `);
  return result;
}
```

**Pagination & Infinite Scroll:** Root-level feed, cursor-based pagination ile yüklenir. `createdAt` + `id` composite cursor.

```typescript
// client/src/hooks/useSocialFeed.ts
import { useInfiniteQuery } from '@tanstack/react-query';

export function useSocialFeed(ticker: string) {
  return useInfiniteQuery({
    queryKey: ['social', 'feed', ticker],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/social/${ticker}?cursor=${pageParam || ''}&limit=20`);
      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: '',
  });
}
```

### 5.5 Social Sentiment Analysis: FinBERT, roberta-base Fine-tuned

FinBERT, finansal domain üzerinde fine-tuned BERT modelidir. **yiyanghkust/finbert-tone** modeli, financial text'i Positive / Negative / Neutral olarak sınıflandırır. Gistify, bu modeli kullanarak:

1. **Real-time sentiment:** Her sosyal mesaj post edildiğinde, async olarak sentiment analiz edilir.
2. **Aggregate sentiment:** Hisse başlı 1h, 1d, 1w sentiment trend'i hesaplanır.
3. **Alert:** Sentiment anomalisi (örneğin 1 saatte %50 bearish spike) tespit edilirse, kullanıcıya alert gönderilir.

```typescript
// server/ai/sentiment.ts (Fine-tuned model inference)
import { AutoTokenizer, AutoModelForSequenceClassification, pipeline } from '@xenova/transformers';

// Using transformers.js for Node.js inference (lightweight, no Python needed)
export async function analyzeSentimentTransformers(text: string): Promise<SentimentResult> {
  const classifier = await pipeline('text-classification', 'yiyanghkust/finbert-tone', {
    quantized: true, // Use quantized model for faster inference
  });

  const result = await classifier(text);
  return {
    label: mapLabel(result[0].label),
    score: result[0].score,
    confidence: result[0].score > 0.8 ? 'high' : 'medium',
  };
}
```

**Eğer transformers.js yetersiz kalırsa**, serverless function (Cloudflare Worker) Python runtime (Pyodide veya WASM) kullanabilir; ancak daha pratik yol, **OpenAI API** veya **Hugging Face Inference API** ile remote inference yapmaktır.

### 5.6 ActivityPub / Fediverse Entegrasyon Düşüncesi

ActivityPub, Mastodon, Lemmy, ve PixelFed tarafından kullanılan **decentralized social protocol**'dür. Gistify, ActivityPub entegrasyonu ile:

- **Decentralized identity:** Kullanıcılar, Gistify içindeki profillerini Mastodon / Fediverse üzerinden takip edilebilir hale getirebilir.
- **Cross-platform interaction:** Gistify'daki bir rapor paylaşımı, Mastodon'da görünebilir; Mastodon'dan gelen yanıtlar Gistify'da görünebilir.
- **Content portability:** Kullanıcı içerikleri, kendi sunucularında (self-hosted) saklayabilir.

**Dezavantajları:** ActivityPub implementasyonu karmaşıktır; spam ve moderation riski artar; Gistify'nin kullanıcı kitlesi henüz Fediverse odaklı değildir. **Öneri:** Short-term'de **ActivityPub düşüncesi** not edilmeli, medium-term roadmap'e alınmalı. İlk aşamada, Gistify internal social graph yeterlidir.

### 5.7 Offline-First: Service Workers + Background Sync + IndexedDB

Finansal dashboard kullanıcıları, metroda, uçakta, veya düşük bağlantılı alanlarda bile veriye erişmek ister. **Offline-first**, Service Workers, Background Sync, ve IndexedDB ile sağlanır.

#### Service Worker Stratejileri

```typescript
// client/public/sw.ts
const CACHE_NAME = 'gistify-v1';
const STATIC_ASSETS = ['/index.html', '/manifest.json', '/assets/main.css'];
const API_CACHE_PATTERNS = ['/api/market/', '/api/reports/', '/api/social/'];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Fetch: Cache-First for static, Network-First for API, Stale-While-Revalidate for content
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls
  if (API_CACHE_PATTERNS.some((pattern) => url.pathname.startsWith(pattern))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets: Cache-First
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
      );
    })
  );
});

// Background Sync: queue social posts when offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-social-posts') {
    event.waitUntil(syncSocialPosts());
  }
});

async function syncSocialPosts() {
  const db = await openDB('gistify-offline', 1, {
    upgrade(db) {
      db.createObjectStore('socialQueue', { keyPath: 'id' });
    },
  });

  const queued = await db.getAll('socialQueue');
  for (const post of queued) {
    try {
      await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      await db.delete('socialQueue', post.id);
    } catch (err) {
      console.error('Sync failed for post:', post.id, err);
      // Will retry on next sync event
    }
  }
}
```

#### IndexedDB: Client-Side Data Store

```typescript
// client/src/lib/offline/db.ts
import { openDB, DBSchema } from 'idb';

interface GistifyDB extends DBSchema {
  reports: {
    key: string;
    value: { id: string; content: string; cachedAt: string };
    indexes: { 'by-date': string };
  };
  marketSnapshots: {
    key: string;
    value: { ticker: string; data: any; cachedAt: string };
  };
  socialQueue: {
    key: string;
    value: { id: string; ticker: string; content: string; sentiment: string; timestamp: string };
  };
}

export const gistifyDB = openDB<GistifyDB>('gistify-offline', 1, {
  upgrade(db) {
    const reportStore = db.createObjectStore('reports', { keyPath: 'id' });
    reportStore.createIndex('by-date', 'cachedAt');
    db.createObjectStore('marketSnapshots', { keyPath: 'ticker' });
    db.createObjectStore('socialQueue', { keyPath: 'id' });
  },
});

export async function cacheReport(id: string, content: string) {
  const db = await gistifyDB;
  await db.put('reports', { id, content, cachedAt: new Date().toISOString() });
}

export async function getCachedReport(id: string): Promise<string | undefined> {
  const db = await gistifyDB;
  const report = await db.get('reports', id);
  return report?.content;
}
```

### 5.8 Push Notifications: Web Push API, Firebase Cloud Messaging

Push notifications, kullanıcıyı **real-time alert'ler** (fiyat hedefi, earning release, sentiment anomalisi) hakkında bilgilendirir. Web Push API, tarayıcı-native push desteği sunar; Firebase Cloud Messaging (FCM), cross-platform (web + mobile) push sağlar.

```typescript
// server/api/push.ts
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:admin@gistify.app',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendPushNotification(
  subscription: webpush.PushSubscription,
  payload: { title: string; body: string; icon?: string; url?: string }
): Promise<void> {
  await webpush.sendNotification(
    subscription,
    JSON.stringify(payload)
  );
}

// Trigger push on alert condition
export async function onPriceAlert(ticker: string, targetPrice: number, currentPrice: number) {
  const subscribers = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.ticker, ticker));

  for (const sub of subscribers) {
    await sendPushNotification(JSON.parse(sub.subscription), {
      title: `${ticker} Hedef Fiyat Uyarısı`,
      body: `${ticker} ${targetPrice} hedef fiyatına ulaştı. Güncel: ${currentPrice}`,
      icon: '/icon-192.png',
      url: `/app/stock/${ticker}`,
    });
  }
}
```

```typescript
// client/src/lib/push.ts
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications not supported');
    return null;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.env.VAPID_PUBLIC_KEY!),
  });

  // Send subscription to server
  await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription, userId: getCurrentUserId() }),
  });

  return subscription;
}
```

---

## Bölüm 6: Gelişmiş Auth & Erişim Kontrolü

### 6.1 Clerk.dev: Modern Auth, RBAC, Organizations, MFA

Gistify'nin mevcut auth state machine mantığı (loading → anonymous → authenticated) net [Rapor], ancak implementasyon muhtemelen custom veya eski bir OAuth çözümüne dayanır. **Clerk.dev**, 2026 itibarıyla modern web uygulamaları için en gelişmiş auth platformudur. Next.js, Vite, React, ve React Native için first-class SDK'lar sunar.

#### Clerk Özellikleri

| Özellik | Gistify için Değer | Detay |
|---------|-------------------|-------|
| **Social OAuth** | Google, Apple, Twitter/X | One-click login, friction azaltma |
| **Passwordless** | Magic link, SMS | Güvenlik + UX |
| **MFA** | TOTP, SMS, Backup codes | Finansal data için zorunlu |
| **RBAC** | Admin, Editor, Pro, Free | Tier-based access control |
| **Organizations** | Multi-team support | Kurumsal müşteriler için |
| **Session Management** | JWT, session token, device tracking | Güvenlik ve audit |
| **User Management** | Dashboard, webhooks, API | Admin işlemlerini azaltma |

```typescript
// client/src/main.tsx — Clerk Provider setup
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ClerkProvider
    publishableKey={CLERK_PUBLISHABLE_KEY}
    appearance={{
      baseTheme: dark,
      variables: {
        colorPrimary: 'var(--color-accent)',
        colorBackground: 'var(--color-surface)',
        colorText: 'var(--color-text-primary)',
        borderRadius: 'var(--radius-xl)',
      },
    }}
    localization={trTR} // Turkish localization
  >
    <App />
  </ClerkProvider>
);
```

```typescript
// client/src/components/AuthGuard.tsx
import { useAuth, useUser } from '@clerk/clerk-react';
import { useDashboardStore } from '@gistify/data/stores';

export function AuthGuard({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const { isPro } = useDashboardStore();

  if (!isLoaded) return <LoadingSkeleton />;

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Giriş Gerekli</h1>
          <p className="text-muted-foreground">Bu sayfayı görüntülemek için lütfen giriş yapın.</p>
          <SignInButton mode="modal">
            <Button>Giriş Yap</Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  if (requiredRole && !user?.publicMetadata?.roles?.includes(requiredRole)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Erişim Reddedildi</h1>
          <p className="text-muted-foreground">Bu sayfaya erişmek için {requiredRole} rolüne ihtiyacınız var.</p>
          <Button variant="outline" onClick={() => window.history.back()}>Geri Dön</Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

### 6.2 Google OAuth + Session Management

Clerk.dev, Google OAuth'u native olarak destekler. `UserButton` ve `SignIn` component'leri, Google One Tap login de dahil olmak üzere tüm OAuth flow'ları yönetir. Session management, **JWT token** + **session cookie** (`__session`) ile yapılır.

```typescript
// server/middleware/auth.ts — Clerk session verification
import { verifyToken } from '@clerk/backend';

export async function verifyClerkSession(request: Request): Promise<{ userId: string; role: string } | null> {
  const sessionToken = request.headers.get('Authorization')?.replace('Bearer ', '') ||
    getCookie(request, '__session');

  if (!sessionToken) return null;

  try {
    const payload = await verifyToken(sessionToken, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    const userId = payload.sub;
    const role = payload.metadata?.role || 'free';

    return { userId, role };
  } catch (err) {
    return null;
  }
}

// Middleware: protect API routes
export async function withAuth(handler: (req: Request, user: { userId: string; role: string }) => Promise<Response>) {
  return async (request: Request): Promise<Response> => {
    const user = await verifyClerkSession(request);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    return handler(request, user);
  };
}
```

### 6.3 RBAC vs ABAC: OpenFGA / Casbin Policy Engine

Clerk.dev'in RBAC'i (role-based access control), `publicMetadata.roles` üzerinden çalışır. Ancak finansal platformlarda, **attribute-based access control (ABAC)** daha esnek ve güvenlidir. ABAC, kullanıcının **rolüne** ek olarak **abonelik tier'ine**, **portföy büyüklüğüne**, **IP adresine**, **cihazına**, ve **zaman dilimine** göre erişim kontrolü yapabilir.

#### OpenFGA (Fine-Grained Authorization)

OpenFGA, CNCF sandbox projesidir; Google Zanzibar modelini temel alır. **Relationship-based access control (ReBAC)** sunar.

```typescript
// openfga/model.fga
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

```typescript
// server/auth/openfga.ts
import { OpenFgaClient } from '@openfga/sdk';

const fgaClient = new OpenFgaClient({
  apiUrl: process.env.OPENFGA_API_URL,
  storeId: process.env.OPENFGA_STORE_ID,
});

export async function checkPermission(
  userId: string,
  relation: string,
  object: string
): Promise<boolean> {
  const { allowed } = await fgaClient.check({
    user: `user:${userId}`,
    relation,
    object,
  });
  return allowed || false;
}

// Usage: Check if user can view a specific report
export async function canViewReport(userId: string, reportId: string): Promise<boolean> {
  return checkPermission(userId, 'can_view', `report:${reportId}`);
}
```

#### Casbin: Policy-as-Code

Casbin, daha basit ve yaygın bir policy engine'dir. CSV/CSV-like policy dosyaları ile çalışır.

```typescript
// server/auth/casbin.ts
import { newEnforcer } from 'casbin';

const enforcer = await newEnforcer('rbac_model.conf', 'rbac_policy.csv');

// rbac_model.conf
// [request_definition]
// r = sub, obj, act
// [policy_definition]
// p = sub, obj, act
// [role_definition]
// g = _, _
// [policy_effect]
// e = some(where (p.eft == allow))
// [matchers]
// m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act

// rbac_policy.csv
// p, admin, report, read
// p, admin, report, write
// p, admin, report, delete
// p, editor, report, read
// p, editor, report, write
// p, viewer, report, read
// g, alice, admin
// g, bob, editor
// g, charlie, viewer

export async function enforce(userId: string, object: string, action: string): Promise<boolean> {
  return enforcer.enforce(userId, object, action);
}
```

**Gistify için Öneri:** Kısa vadede Clerk.dev RBAC yeterlidir. Medium-term'de, **OpenFGA** veya **Casbin** ile fine-grained authorization eklenmelidir. Çünkü finansal raporlar, **hisse bazlı erişim kontrolü** (örneğin, sadece Pro kullanıcılar intraday data görebilir) gerektirir.

### 6.4 Feature Flags: Flagsmith / LaunchDarkly

Feature flags, yeni özellikleri **canary release**, **A/B testing**, ve **tier-based gating** ile yönetmeye izin verir. Gistify'nin freemium modeli [^20] için kritiktir.

#### Flagsmith (Open Source + Cloud)

| Özellik | Flagsmith | LaunchDarkly |
|---------|-----------|--------------|
| Fiyat | Free (self-hosted) / $45/mo | $8.33/seat/mo |
| A/B Testing | ✅ Yes | ✅ Yes |
| Segment targeting | ✅ Yes | ✅ Yes |
| Open Source | ✅ Yes | ❌ No |
| Self-hosted | ✅ Yes | ❌ No (Enterprise) |
| Analytics | ✅ Basic | ✅ Advanced |

Gistify için öneri: **Flagsmith** (self-hosted) veya **Unleash** (open source). Bu, maliyeti düşürür ve data privacy sağlar (finansal kullanıcı data'sı third-party cloud'a gitmez).

```typescript
// client/src/lib/featureFlags.ts
import { Flagsmith } from 'flagsmith';

const flagsmith = new Flagsmith({
  environmentID: import.meta.env.VITE_FLAGSMITH_ENV_ID,
  api: import.meta.env.VITE_FLAGSMITH_API_URL,
  cacheFlags: true,
  enableAnalytics: true,
});

export async function initFlagsmith(userId: string, traits: Record<string, string>) {
  await flagsmith.init({
    identity: userId,
    traits,
  });
}

export function isFeatureEnabled(flagName: string): boolean {
  return flagsmith.hasFeature(flagName);
}

export function getFeatureValue<T>(flagName: string, defaultValue: T): T {
  return flagsmith.getValue(flagName, defaultValue) as T;
}

// Usage in component
export function Pricing() {
  const showNewPricing = isFeatureEnabled('new_pricing_v2');
  const discountRate = getFeatureValue('pro_discount_rate', 0);

  return (
    <div>
      {showNewPricing ? <NewPricing discount={discountRate} /> : <OldPricing />}
    </div>
  );
}
```

```typescript
// server/middleware/featureFlag.ts
export async function checkFeatureFlag(userId: string, flag: string): Promise<boolean> {
  const flags = await flagsmith.getIdentityFlags(userId);
  return flags.isFeatureEnabled(flag);
}

// Protect API route with feature flag
export async function withFeatureFlag(flag: string, handler: (req: Request) => Promise<Response>) {
  return async (request: Request): Promise<Response> => {
    const userId = await getUserIdFromRequest(request);
    const enabled = await checkFeatureFlag(userId, flag);
    if (!enabled) {
      return new Response(JSON.stringify({ error: 'Feature not available in your plan' }), { status: 403 });
    }
    return handler(request);
  };
}
```

### 6.5 Multi-tenancy Düşüncesi

Gistify, bireysel kullanıcılar ve küçük ekipler için tasarlanmıştır. Ancak kurumsal müşteriler (hedge funds, family offices, RIAs) **multi-tenancy** (her müşteri kendi izole data'sı, kullanıcıları, raporları, ve dashboard'ları ile çalışır) talep edebilir.

#### Multi-tenancy Modelleri

| Model | Açıklama | Avantaj | Dezavantaj | Gistify için Uygunluk |
|-------|----------|---------|------------|----------------------|
| **Single DB, tenant_id column** | Her tablo'da `tenant_id` | Basit, tek DB | Query complexity, data isolation risk | Short-term |
| **Schema per tenant** | Her tenant = PostgreSQL schema | Daha iyi izolasyon | Schema migration overhead | Medium-term |
| **DB per tenant** | Her tenant = ayrı DB | Tam izolasyon | Maliyet, operasyonel karmaşa | Long-term |
| **Row-level security (RLS)** | PostgreSQL RLS policy | Fine-grained, tek DB | Performans overhead, karmaşık policy | Medium-term |

#### Tenant Isolation with Row-Level Security (RLS)

```sql
-- PostgreSQL RLS setup for multi-tenancy
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

-- Set tenant in application layer
SET LOCAL app.current_tenant = 'tenant-uuid-here';
```

```typescript
// server/db/tenant.ts
import { db } from './index';

export async function withTenant<T>(tenantId: string, operation: () => Promise<T>): Promise<T> {
  await db.execute(sql`SET LOCAL app.current_tenant = ${tenantId}`);
  const result = await operation();
  await db.execute(sql`RESET app.current_tenant`);
  return result;
}

// Usage
export async function getReportsForTenant(tenantId: string) {
  return withTenant(tenantId, async () => {
    return db.select().from(reports).orderBy(desc(reports.createdAt));
  });
}
```

**Gistify için Öneri:** Short-term'de **single DB + tenant_id** yeterlidir. Medium-term'de, **Clerk.dev Organizations** özelliği ile "team/workspace" kavramı implemente edilmelidir. Her organization = bir tenant. Clerk, organization-level role management ve billing sunar. Eğer kurumsal müşteriler ölçeklenecekse, **PostgreSQL RLS** veya **schema per tenant** değerlendirilmelidir.

```typescript
// Clerk Organizations setup
import { useOrganization } from '@clerk/clerk-react';

export function OrganizationSwitcher() {
  const { organization, membership } = useOrganization();

  return (
    <div>
      <p>Current Org: {organization?.name}</p>
      <p>Role: {membership?.role}</p>
      {membership?.role === 'org:admin' && <AdminPanel />}
    </div>
  );
}
```

---

## Kaynakça ve Araştırma Referansları

### UI/UX & Algoritmik Mimari Raporu Referansları [Rapor]

- Gistify UI/UX & Algoritmik Mimari Detaylandırılmış Raporu, 2026-06-12. Kapsam: Ana App + Benchmark App + Momentum Scrapper. 5 paralel UI/UX analiz sub-agent + orchestrator birleştirme.

### Finansal Dashboard & UI Mimarisi Araştırma Raporu Referansları [Finans]

[^1]: Coinprwire. "Best TradingView Alternative for Trading Content Creators in 2026." 2026-03-09. https://www.coinprwire.com/newsroom/best-tradingview-alternative-for-trading-content-creators-in-2026-19797
[^2]: Koyfin Help Center. "Dashboard of stocks, securities, graphs widgets." 2024-06-03. https://www.koyfin.com/help/mydashboards-myd/
[^3]: Koyfin Help Center. "My Dashboards Groups." 2024-06-03. https://www.koyfin.com/help/mydashboards-myd/
[^4]: LogRocket Blog. "Best React chart libraries in 2026: Features, performance, and use cases." 2026-06-01. https://blog.logrocket.com/best-react-chart-libraries-2026/
[^5]: StackShare. "ApexCharts vs Lightweight Charts." https://stackshare.io/stackups/apexcharts-vs-lightweight-charts
[^6]: LogRocket Blog. "Best React chart libraries in 2026." 2026-06-01. https://blog.logrocket.com/best-react-chart-libraries-2026/
[^7]: Financial Modeling Prep. "Best Real-Time Stock Market Data APIs in 2026." 2025-11-07. https://site.financialmodelingprep.com/education/other/best-realtime-stock-market-data-apis-in-
[^8]: Algos.pro. "polygon.io vs alpha vantage — which data feed for algo trading." 2024-02-11. https://algos.pro/posts/2024-02-11-polygon-vs-alpha-vantage-data-feed-comparison/
[^9]: AllTick Blog. "AllTick 的速度和定价与行业竞争对手相比如何？" 2026-04-21. https://blog.alltick.co/zh-CN/alltick-%E7%9A%84%E9%80%9F%E5%BA%A6%E5%92%8C%E5%AE%9A%E4%BB%B7%EF%BC%8C%E4%B8%8E%E8%A1%8C%E4%B8%9A%E7%AB%9E%E4%BA%89%E5%AF%B9%E6%89%8B%E7%9B%B8%E6%AF%94%E5%A6%82%E4%BD%95%EF%BC%9F/
[^10]: GitHub — MehdiiRezakhani. "dynamic-dashboard-widget." 2025-04-15. https://github.com/MehdiiRezakhani/dynamic-dashboard-widget
[^11]: Syncfusion. "Drag and Drop Widgets with Dashboard." 2026-05-20. https://support.syncfusion.com/kb/article/9479/drag-and-drop-widgets-with-dashboard
[^12]: Meegle. "AI For Behavioral Targeting." 2026-02-07. https://www.meegle.com/en_us/topics/ai-powered-insights/ai-for-behavioral-targeting
[^13]: MacroMicro. "New Personalized Dashboard Feature for Your Custom Watchlist." https://en.macromicro.me/blog/elevate-your-investments-new-personalized-dashboard-feature-for-your-custom-watchlist
[^14]: MyDigiCode. "Essentials of Mobile App UI Design in 2024-2025." 2024-11-29. https://www.mydigicode.com/essentials-of-mobile-app-ui-design-in-2024-2025/
[^15]: WizlyTools. "Hex vs RGB vs HSL vs OKLCH: Color Formats for Web Development." 2026-03-19. https://wizlytools.com/blog/color-formats-hex-rgb-hsl-oklch/
[^16]: ColorUI. "HEX vs RGB vs HSL vs LCH vs OKLCH vs LAB - Which to Use?" 2026-02-04. https://colorui.io/blog/hex-rgb-hsl-lch-oklch-lab
[^17]: PkgPulse. "TanStack Virtual vs react-window vs react-virtuoso 2026." 2026-03-09. https://www.pkgpulse.com/guides/tanstack-virtual-vs-react-window-vs-react-virtuoso-2026
[^18]: PkgPulse. "TanStack Virtual vs react-window vs react-virtuoso 2026." 2026-03-09. https://www.pkgpulse.com/guides/tanstack-virtual-vs-react-window-vs-react-virtuoso-2026
[^19]: GitHub — MehdiiRezakhani. "dynamic-dashboard-widget." 2025-04-15. https://github.com/MehdiiRezakhani/dynamic-dashboard-widget
[^20]: Trendlyne. "Trendlyne Vs. TradingView Vs. GuruFocus Vs. Finviz Vs. Tipranks Vs. Investing.com." https://faq.trendlyne.com/support/solutions/articles/84000397249-trendlyne-vs-tradingview-vs-gurufocus-vs-finviz-vs-tipranks-vs-investing-com
[^21]: Koyfin Release Notes. "v3.0: Global Equities, Drag & Drop." 2024-01-10. https://www.koyfin.com/help/release-notes/release-notes-v3-0/
[^22]: Vibe Studio. "Integrating Real-Time Stock Market APIs in Flutter." 2026-03-23. https://vibe-studio.ai/insights/integrating-real-time-stock-market-apis-in-flutter

### Content Pipeline Araştırma Raporu Referansları [Content]

[^1]: Maxwell Weru. "Replacing Contentlayer with Markdownlayer." Mar 17, 2024. https://maxwellweru.com/blog/2024/03/replacing-contentlayer-with-markdownlayer
[^2]: Contentlayer GitHub Issue #429. "State of the project." Apr 24, 2023. https://github.com/contentlayerdev/contentlayer/issues/429
[^3]: Astro Blog. "Astro 5.0." Dec 3, 2024. https://astro.build/blog/astro-5/
[^4]: Peerlist Blog. "What's New With Astro 5." Dec 13, 2024. https://peerlist.io/blog/engineering/whats-new-with-astro-5
[^5]: next-mdx-remote npm. "React Server Components (RSC) & Next.js app Directory Support." Feb 12, 2026. https://www.npmjs.com/package/next-mdx-remote
[^6]: next-mdx-remote-client GitHub. "A wrapper of @mdx-js/mdx for Next.js applications." May 29, 2026. https://github.com/ipikuka/next-mdx-remote-client
[^7]: Keystatic. https://keystatic.com/
[^8]: Lucky Media. "Keystatic CMS Review 2026." Mar 1, 2026. https://www.luckymedia.dev/insights/keystatic
[^9]: TinaCMS. "TinaCMS for Next.js." Mar 20, 2026. https://tina.io/nextjs-cms
[^10]: Lucky Media. "TinaCMS Review 2026." Mar 1, 2026. https://www.luckymedia.dev/insights/tina-cms
[^11]: Contra Collective. "Sanity vs Contentful vs Strapi: Headless CMS Compared for Commerce (2026)." May 24, 2026. https://contracollective.com/blog/sanity-vs-contentful-vs-strapi-headless-cms-2026
[^12]: Cosmic Blog. "Cosmic vs Contentful vs Strapi vs Sanity vs Prismic vs Hygraph." Feb 5, 2026. https://www.cosmicjs.com/blog/headless-cms-comparison-2026-cosmic-contentful-strapi-sanity-prismic-hygraph
[^13]: Gitana Blog. "CMS Versioning Capabilities and Comparison." Dec 29, 2025. https://gitana.io/blog/cms-versioning-comparison
[^14]: GitHub phiychai/turborepo-saas-starter. CI/CD workflows. https://github.com/phiychai/turborepo-saas-starter
[^15]: HeyKyo Blog. "Comprehensive Guide to Cloudflare R2 Image Integration in Hugo." May 11, 2025. https://www.heykyo.com/posts/2025/05/comprehensive-guide-to-cloudflare-r2-image-integration-in-hugo/
[^16]: Cloudflare Developers. "Upload objects - R2." Jun 8, 2026. https://developers.cloudflare.com/r2/objects/upload-objects/
[^17]: Next.js Docs. "How to implement Incremental Static Regeneration (ISR)." Mar 25, 2026. https://nextjs.org/docs/app/guides/incremental-static-regeneration
[^18]: Naturaily Blog. "Next.js ISR: Revalidate & On-Demand Updates." Jan 19, 2026. https://naturaily.com/blog/nextjs-isr
[^19]: Gitana Blog. "CMS Versioning Capabilities and Comparison." Dec 29, 2025. https://gitana.io/blog/cms-versioning-comparison
[^20]: Strapi Blog. "Content Versioning in Strapi: A Complete Developer Guide." Dec 11, 2025. https://strapi.io/blog/content-versioning-strapi-setup; Rwit Blog. "How Payload CMS Solves Content Versioning Challenges for Developers." Jul 4, 2025. https://www.rwit.io/blog/payload-cms-content-versioning-for-developers

---

*Rapor Tarihi: 2026-06-13*  
*Analiz Metodu: UI/UX Raporu (Bölüm 1–10) + Finans Dashboard Araştırması (30 kaynak) + Content Pipeline Araştırması (20 kaynak) birleştirilerek teknik yazım.*  
*Yazar: Teknik Yazar & Mimari Analisti — Gistify Gelişmiş Rapor Part 1*
