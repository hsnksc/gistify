# Bölüm 10: Algoritmik Mimari Tasarım — Gistify Dinamik MD Deploy Sistemi

## 10.1 Sistem Genel Bakış

Gistify dinamik MD deploy pipeline’ı, statik Markdown dosyalarını runtime’da keşfedip, parse edip, normalize edip, React tab’ları olarak render eden ve son kullanıcıya deploy eden bir **content-as-code** pipeline’dır. Mevcut sistemde her route (`/app`, `/momentum`, `/daily-report`, `/flow`) manuel tab yapılarıyla çalışmaktadır. Yeni mimari, bu route’lara **dinamik MD tab discovery** yeteneği kazandırır.

### Yüksek Seviyeli Mimari Diyagram (Metinsel)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  MD Source      │────▶│  File Watcher   │────▶│  Parser         │
│  (FS / Git /    │     │  (chokidar)     │     │  (gray-matter   │
│   Upload)       │     │                 │     │   + remark)     │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Renderer       │◄────│  Normalizer     │◄────│  Meta Extractor │
│  (react-markdown│     │  (Unified       │     │  (frontmatter   │
│   + custom      │     │   Schema)       │     │   validation)   │
│   components)   │     │                 │     │                 │
└────────┬────────┘     └─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Tab Registry   │◄────│  Router         │◄────│  Cache Layer    │
│  (per-route)    │     │  (wouter +      │     │  (LRU + memo)   │
│                 │     │   query param)  │     │                 │
└────────┬────────┘     └─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  React UI       │◄────│  ErrorBoundary  │
│  (shadcn/ui +   │     │  + Fallback     │
│   Tailwind)     │     │                 │
└─────────────────┘     └─────────────────┘
```

### Veri Akışı (Data Flow)

1. **MD dosya ekleme**: Dosya sistemine yeni `.md` dosyası yazılır veya admin panelden upload edilir.
2. **Parse**: `gray-matter` YAML frontmatter’ı ile Markdown body’yi ayırır. `remark` AST üretir.
3. **Meta veri çıkarımı**: Frontmatter’dan `title`, `date`, `category`, `tags`, `author`, `status`, `route`, `priority` alanları çıkarılır.
4. **Normalize**: Farklı MD formatları (plain, table-heavy, chart-heavy) unified `NormalizedContent` şemasına çevrilir.
5. **Tab listesi güncelleme**: `TabRegistry` ilgili route’un tab listesini günceller. Sıralama `priority` ve `date` alanlarına göre yapılır.
6. **Render**: `react-markdown` + custom component mapping ile MD → React dönüşümü gerçekleşir.
7. **Deploy**: Kullanıcı ilgili route’a geldiğinde tab listesi API veya FS cache’den çekilir, aktif tab render edilir.

---

## 10.2 MD Dosya Pipeline

### 10.2.1 Dosya İzleme (File Watcher)

**Teknoloji**: `chokidar` (v4+)

Gistify projesi Windows + Git Bash ortamında çalıştığı için `fs.watch` yerine **cross-platform çalışan `chokidar` tercih edilir**. `fs.watch` Windows’ta recursive dizin izlemede stabilite sorunları yaşayabilir.

```typescript
// server/contentWatcher.ts
import chokidar from "chokidar";
import { processMarkdownFile } from "./contentPipeline";

const WATCH_ROOTS = {
  app: path.join(process.cwd(), "earningreport"),
  momentum: path.join(process.cwd(), "momentum"),
  "daily-report": path.join(process.cwd(), "dailyreport"),
  flow: path.join(process.cwd(), "flow"),
};

export function startContentWatchers() {
  Object.entries(WATCH_ROOTS).forEach(([route, rootPath]) => {
    const watcher = chokidar.watch(`${rootPath}/**/*.md`, {
      ignored: /(^|[\/\\])\../, // dotfiles
      persistent: true,
      ignoreInitial: false, // Başlangıçta mevcut dosyaları da process et
      awaitWriteFinish: {
        stabilityThreshold: 300, // 300ms yazma stabilitesi
        pollInterval: 100,
      },
    });

    watcher
      .on("add", (filePath) => processMarkdownFile(route, filePath, "add"))
      .on("change", (filePath) => processMarkdownFile(route, filePath, "change"))
      .on("unlink", (filePath) => processMarkdownFile(route, filePath, "unlink"));
  });
}
```

**Polling stratejisi**: `chokidar` native OS events’leri kullanır. Network mount veya Docker volume senaryolarında `usePolling: true` fallback olarak aktif edilebilir.

**İzlenen dizinler**:
- `earningreport/` → `/app` route
- `momentum/` → `/momentum` route  
- `dailyreport/` → `/daily-report` route
- `flow/` → `/flow` route

### 10.2.2 Parser

**Stack**: `gray-matter` + `remark` + `remark-gfm` + `remark-frontmatter`

```typescript
// server/contentPipeline.ts
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive"; // :::chart, :::alert desteği

interface ParsedContent {
  data: ContentMeta;
  content: string;       // Markdown body (frontmatter hariç)
  ast: Root;             // remark AST
  raw: string;           // Orijinal dosya içeriği
}

export async function parseMarkdown(raw: string): Promise<ParsedContent> {
  const { data, content, matter: rawFrontmatter } = matter(raw, {
    engines: {
      yaml: (s) => yaml.parse(s, { schema: "json" }),
    },
  });

  const processor = remark()
    .use(remarkGfm)      // Tables, task lists, strikethrough
    .use(remarkDirective); // Custom directives :::chart, :::alert

  const ast = processor.parse(content);

  return {
    data: normalizeMeta(data),
    content,
    ast,
    raw,
  };
}
```

**Frontmatter Şeması (Zorunlu + Opsiyonel)**:

```yaml
---
title: "CPI Sonrası Setup Değerlendirmesi"
date: "2026-06-10"
category: "setup"
tags: ["cpi", "setup", "spx"]
author: "Gistify Agent"
status: "published"        # draft | published | archived
route: "app"               # app | momentum | daily-report | flow
priority: 10               # Sıralama: düşük = önce
slug: "cpi-sonrasi-setup"  # URL-friendly identifier
cover: "./assets/cpi.png"  # Opsiyonel kapak görseli
---
```

### 10.2.3 Normalizer

Farklı formatlardaki MD dosyalarını aynı `NormalizedContent` yapısına çevirir. Bu, renderer’ın her zaman tutarlı veri almasını garanti eder.

```typescript
// shared/contentSchema.ts
export interface NormalizedContent {
  id: string;              // slug + date hash
  meta: ContentMeta;
  body: string;            // İşlenmiş Markdown body
  tables: NormalizedTable[]; // Çıkarılmış tablolar
  charts: ChartEmbed[];    // :::chart directive’lerinden çıkarılmış chart config
  directives: Directive[]; // :::alert, :::card, vb.
  assets: string[];        // Görseller, dosya referansları
}
```

**Desteklenen Formatlar**:

| Format | Açıklama | Normalizasyon |
|--------|----------|---------------|
| `frontmatter` | Standart YAML + MD | Doğrudan parse edilir |
| `plain_md` | Frontmatter yok | `title` dosya adından, `date` mtime’dan türetilir |
| `table-heavy` | Çok sayıda tablo | Tablolar `NormalizedTable` array’ine çıkarılır, body’de referans bırakılır |
| `chart-heavy` | `:::chart` direktifleri | JSON config parse edilir, `ChartEmbed` array’ine dönüştürülür |

```typescript
// server/normalizer.ts
export function normalizeContent(parsed: ParsedContent, filePath: string): NormalizedContent {
  const meta = parsed.data;
  
  // Plain MD fallback: frontmatter yoksa
  if (!meta.title) {
    meta.title = path.basename(filePath, ".md").replace(/[-_]/g, " ");
  }
  if (!meta.date) {
    meta.date = new Date(fs.statSync(filePath).mtime).toISOString().split("T")[0];
  }
  if (!meta.slug) {
    meta.slug = slugify(meta.title);
  }
  if (!meta.status) {
    meta.status = "published";
  }

  // Directive extraction
  const directives = extractDirectives(parsed.ast);
  const charts = directives.filter((d) => d.name === "chart").map(parseChartDirective);
  const alerts = directives.filter((d) => d.name === "alert");

  // Table extraction
  const tables = extractTables(parsed.ast);

  return {
    id: `${meta.slug}-${meta.date}`,
    meta,
    body: parsed.content,
    tables,
    charts,
    directives: alerts, // ve diğer directive'ler
    assets: extractAssets(parsed.content, filePath),
  };
}
```

### 10.2.4 Renderer

**Client tarafı**: `react-markdown` (v9+) + `remark-gfm` + `rehype-highlight` + `rehype-sanitize`

```typescript
// client/src/components/MarkdownRenderEngine.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import { defaultSchema } from "hast-util-sanitize";
import { CustomTable, CustomCode, CustomAlert, CustomChart } from "./mdComponents";

const customSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), "div", "span"],
  attributes: {
    ...defaultSchema.attributes,
    "*": ["className", "style"],
  },
};

export function MarkdownRenderEngine({ content, charts }: { content: string; charts: ChartEmbed[] }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkDirective]}
      rehypePlugins={[rehypeHighlight, [rehypeSanitize, customSchema]]}
      components={{
        table: CustomTable,      // shadcn/ui Table
        code: CustomCode,        // shadcn Card + PrismJS
        pre: CustomPre,          // Scroll container
        img: CustomImage,        // Lazy loading + placeholder
        div: (props) => {
          // :::chart directive render
          if (props.className?.includes("chart-directive")) {
            const chartId = props["data-chart-id"];
            const config = charts.find((c) => c.id === chartId);
            return config ? <CustomChart config={config} /> : <ChartFallback />;
          }
          // :::alert directive render
          if (props.className?.includes("alert-directive")) {
            return <CustomAlert variant={props["data-variant"]}>{props.children}</CustomAlert>;
          }
          return <div {...props} />;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
```

**Tailwind Class Mapping**:

```typescript
// client/src/components/mdComponents/CustomTable.tsx
export function CustomTable({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm text-left" {...props}>
        {children}
      </table>
    </div>
  );
}

export function CustomTableHead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">{children}</thead>;
}

export function CustomTableRow({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-border transition-colors hover:bg-muted/30">{children}</tr>;
}
```

**Code Block Highlighting**: `PrismJS` via `rehype-highlight`. Tema: `atom-dark` veya `vsc-dark-plus`. Dil tanıma: `tsx`, `typescript`, `yaml`, `json`, `sql`, `python`.

**Chart Embedding**: MD içinde Recharts chart tanımlama:

```markdown
:::chart{type="area" data="./assets/chart-data.json" xKey="date" yKey="price"}
:::
```

Runtime’da `CustomChart` component’i JSON config’i alıp Recharts `AreaChart`, `BarChart`, `LineChart` vb. render eder.

### 10.2.5 Cache

**Çift katmanlı cache stratejisi**:

1. **Server-side LRU**: `lru-cache` (v11+). Parsed + normalized content cache’lenir. Key: `route:slug:date`.
2. **Client-side memoization**: React `useMemo` + `useCallback`. Tab content değişmeden re-render engellenir.

```typescript
// server/contentCache.ts
import { LRUCache } from "lru-cache";

const contentCache = new LRUCache<string, NormalizedContent>({
  max: 500,               // Max 500 doküman
  ttl: 1000 * 60 * 30,    // 30 dakika TTL
  updateAgeOnGet: true,   // Erişimde TTL yenile
  allowStale: false,      // Stale data serve etme
});

export function getCachedContent(route: string, slug: string): NormalizedContent | undefined {
  return contentCache.get(`${route}:${slug}`);
}

export function setCachedContent(route: string, slug: string, content: NormalizedContent) {
  contentCache.set(`${route}:${slug}`, content);
}

export function invalidateCache(route: string, slug: string) {
  contentCache.delete(`${route}:${slug}`);
  // WebSocket / SSE broadcast
  broadcastCacheInvalidation(route, slug);
}
```

**Invalidation Stratejisi**:
- **File Watcher**: `change` event’inde cache entry silinir.
- **Admin Upload**: Yeni dosya upload edildiğinde ilgili route cache’i temizlenir.
- **Git Hook**: Push sonrası tüm cache flush edilir (veya diff-based invalidation).
- **TTL**: 30 dakika. Dosya değişmediyse cache’den serve edilir.

### 10.2.6 Error Handling

| Hata Tipi | Gradyasyon | Kullanıcı Deneyimi |
|-----------|------------|-------------------|
| Parse hatası (YAML syntax) | `gray-matter` hata fırlatır → `catch` | Tab görünür, içerik yerine "Parse hatası" alert’i gösterilir. Frontmatter eksikse fallback meta üretilir. |
| Eksik frontmatter | Zorunlu alan `title` yoksa fallback | Dosya adı `title` olarak kullanılır. `date` = mtime. |
| Boş dosya | `content.length === 0` | "Bu rapor henüz içerik içermiyor" placeholder. |
| Invalid format (binary, .exe) | `mime-types` check | Dosya reddedilir, admin panelde hata mesajı. |
| Render crash | React ErrorBoundary | "Bu içerik render edilemiyor. Lütfen daha sonra tekrar deneyin." |

```typescript
// server/contentPipeline.ts
export async function processMarkdownFile(route: string, filePath: string, event: "add" | "change" | "unlink") {
  try {
    if (event === "unlink") {
      tabRegistry.remove(route, filePath);
      invalidateCache(route, pathToSlug(filePath));
      return;
    }

    const raw = await fs.promises.readFile(filePath, "utf8");
    if (!raw.trim()) {
      logger.warn(`Boş MD dosyası: ${filePath}`);
      return;
    }

    const parsed = await parseMarkdown(raw);
    const normalized = normalizeContent(parsed, filePath);
    
    // Route override check
    if (normalized.meta.route && normalized.meta.route !== route) {
      logger.warn(`Route mismatch: ${filePath} meta.route=${normalized.meta.route}, expected=${route}`);
      // Dosya mevcut route dışında bir route’a aitse, o route’un registry’sine ekle
      route = normalized.meta.route;
    }

    tabRegistry.upsert(route, normalized);
    setCachedContent(route, normalized.meta.slug, normalized);
  } catch (err) {
    logger.error(`MD pipeline hatası: ${filePath}`, err);
    // Graceful: registry’e hata flag’li entry ekle
    tabRegistry.upsertError(route, filePath, err instanceof Error ? err.message : "Bilinmeyen hata");
  }
}
```

---

## 10.3 Tab Sistemi

### 10.3.1 Tab Registry

**Mimari Kararı**: **Her route’un kendi Tab Registry’si olacak**. Global tek registry karmaşayı artırır; route izolasyonu daha temizdir. Ancak registry yönetimi merkezi `TabRegistryManager` üzerinden yapılır.

```typescript
// shared/tabRegistry.ts
export interface TabEntry {
  id: string;              // slug
  label: string;            // title (frontmatter)
  meta: ContentMeta;
  contentRef: string;       // Cache key veya file path
  status: "ok" | "error" | "loading";
  errorMessage?: string;
  priority: number;
  date: string;             // ISO date
  category?: string;
  tags: string[];
}

export interface TabRegistryState {
  tabs: TabEntry[];
  lastUpdated: string;
  route: string;
}

class TabRegistry {
  private registries = new Map<string, TabRegistryState>();

  upsert(route: string, content: NormalizedContent) {
    const state = this.getOrCreate(route);
    const existingIndex = state.tabs.findIndex((t) => t.id === content.meta.slug);
    const entry: TabEntry = {
      id: content.meta.slug,
      label: content.meta.title,
      meta: content.meta,
      contentRef: `${route}:${content.meta.slug}`,
      status: "ok",
      priority: content.meta.priority ?? 0,
      date: content.meta.date,
      category: content.meta.category,
      tags: content.meta.tags ?? [],
    };

    if (existingIndex >= 0) {
      state.tabs[existingIndex] = entry;
    } else {
      state.tabs.push(entry);
    }

    this.sortTabs(state);
    state.lastUpdated = new Date().toISOString();
  }

  upsertError(route: string, filePath: string, errorMessage: string) {
    const state = this.getOrCreate(route);
    const slug = pathToSlug(filePath);
    const existingIndex = state.tabs.findIndex((t) => t.id === slug);
    const entry: TabEntry = {
      id: slug,
      label: path.basename(filePath),
      meta: {} as ContentMeta,
      contentRef: "",
      status: "error",
      errorMessage,
      priority: 0,
      date: new Date().toISOString(),
      tags: [],
    };

    if (existingIndex >= 0) {
      state.tabs[existingIndex] = entry;
    } else {
      state.tabs.push(entry);
    }
  }

  remove(route: string, filePath: string) {
    const state = this.registries.get(route);
    if (!state) return;
    state.tabs = state.tabs.filter((t) => t.id !== pathToSlug(filePath));
  }

  getTabs(route: string): TabEntry[] {
    return this.registries.get(route)?.tabs ?? [];
  }

  private getOrCreate(route: string): TabRegistryState {
    if (!this.registries.has(route)) {
      this.registries.set(route, { tabs: [], lastUpdated: new Date().toISOString(), route });
    }
    return this.registries.get(route)!;
  }

  private sortTabs(state: TabRegistryState) {
    state.tabs.sort((a, b) => {
      // 1. Priority (düşük değer = önce)
      if (a.priority !== b.priority) return a.priority - b.priority;
      // 2. Date (yeni = önce)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }
}

export const tabRegistry = new TabRegistry();
```

### 10.3.2 Tab Discovery

Tab discovery **iki kaynaktan** yapılır:

1. **Dosya sistemi (File Watcher)**: `chokidar` yeni dosya ekledikçe registry güncellenir. **Primary source**.
2. **API (Manual trigger)**: Admin panelden upload veya `POST /api/content/:route/refresh` endpoint’i ile manuel tarama.

```typescript
// server/index.ts — endpoint
app.get("/api/content/:route/tabs", (req, res) => {
  const route = req.params.route;
  const tabs = tabRegistry.getTabs(route);
  res.json({ tabs, lastUpdated: tabRegistry.getLastUpdated(route) });
});

app.post("/api/content/:route/refresh", requireAdmin, async (req, res) => {
  const route = req.params.route;
  const rootPath = WATCH_ROOTS[route as keyof typeof WATCH_ROOTS];
  if (!rootPath) return res.status(400).json({ error: "Bilinmeyen route" });

  // Tüm .md dosyalarını rescan et
  const files = await glob(`${rootPath}/**/*.md`);
  for (const file of files) {
    await processMarkdownFile(route, file, "change");
  }
  res.json({ scanned: files.length, tabs: tabRegistry.getTabs(route) });
});
```

### 10.3.3 Tab Ordering

Sıralama mantığı **3 katmanlı**:

1. **`priority`**: `number` (0-100). Düşük değer = önce. Örn: `priority: 5` olan "Günlük Özet" her zaman üstte.
2. **`date`**: Yeni tarih önce. Aynı priority içinde tarih sıralar.
3. **`title`**: Tertiary sort, alfabetik (opsiyonel).

Admin panelden `priority` override edilebilir. Bu durumda `meta` içine `adminPriority` eklenir ve normalizer bunu `priority` olarak kullanır.

### 10.3.4 Tab Persistence

Kullanıcının son seçtiği tab **localStorage**’da saklanır.

```typescript
// client/src/hooks/useTabPersistence.ts
const TAB_STORAGE_KEY = "gistify:active-tab";

export function useTabPersistence(route: string) {
  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(`${TAB_STORAGE_KEY}:${route}`);
      return stored || "";
    } catch {
      return "";
    }
  });

  const persistTab = useCallback((tabId: string) => {
    try {
      localStorage.setItem(`${TAB_STORAGE_KEY}:${route}`, tabId);
    } catch {
      // Storage quota exceeded — ignore
    }
    setActiveTab(tabId);
  }, [route]);

  return { activeTab, persistTab };
}
```

**Karar**: URL query param (`?tab=rapor-1`) **kullanılmayacak**. Sebep:
- `wouter` query param parsing’i minimaldir, URL state management karmaşıklığı artırır.
- localStorage daha hızlıdır, sayfa refresh sonrası kullanıcı deneyimi korunur.
- Paylaşılabilir linkler için **shareable link** özelliği ayrıca implemente edilir (Bölüm 10.4.4).

### 10.3.5 Active Tab State

```typescript
// client/src/components/DynamicTabShell.tsx
export function DynamicTabShell({ route, language }: { route: string; language: AppLanguage }) {
  const { data: tabs, isLoading } = useSWR(`/api/content/${route}/tabs`, fetcher);
  const { activeTab, persistTab } = useTabPersistence(route);
  const { data: content } = useSWR(
    activeTab ? `/api/content/${route}/${activeTab}` : null,
    fetcher
  );

  const defaultTab = tabs?.[0]?.id;
  const resolvedTab = activeTab && tabs?.find((t: TabEntry) => t.id === activeTab)
    ? activeTab
    : defaultTab;

  useEffect(() => {
    if (resolvedTab && resolvedTab !== activeTab) {
      persistTab(resolvedTab);
    }
  }, [resolvedTab, activeTab, persistTab]);

  return (
    <div className="space-y-4">
      <TabStrip tabs={tabs} activeTab={resolvedTab} onChange={persistTab} />
      <AnimatePresence mode="wait">
        {content ? (
          <motion.div key={resolvedTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <MarkdownRenderEngine content={content.body} charts={content.charts} />
          </motion.div>
        ) : (
          <ContentSkeleton />
        )}
      </AnimatePresence>
    </div>
  );
}
```

### 10.3.6 Tab Rendering

**Lazy Loading**: Her tab kendi MD content’ini **on-demand** fetch eder. İlk yüklemede sadece tab listesi (meta) gelir; content seçim anında çekilir.

**Pre-fetching**: `useSWR` `preload` API’si ile mouse hover anında content pre-fetch edilir.

```typescript
// Pre-fetch on hover
const handleTabHover = (tabId: string) => {
  preload(`/api/content/${route}/${tabId}`, fetcher);
};
```

---

## 10.4 Render Engine Detayları

### 10.4.1 Markdown → HTML

`remark` + `remark-gfm` + `remark-directive` pipeline’ı:

```
Raw MD ──▶ remark-parse ──▶ remark-gfm ──▶ remark-directive ──▶ remark-rehype ──▶ rehype-highlight ──▶ rehype-sanitize ──▶ React
```

`remark-rehype` dönüşümü HTML AST üretir. `rehype-sanitize` XSS koruması sağlar. `rehype-highlight` code block’ları renklendirir.

### 10.4.2 HTML → Styled HTML (Tailwind + shadcn/ui)

`react-markdown` `components` prop’u ile her HTML elementi shadcn/ui karşılığına map edilir:

| Markdown Element | shadcn/ui Component | Tailwind Classes |
|------------------|-------------------|----------------|
| `table` | `Table` wrapper | `overflow-x-auto rounded-xl border border-border` |
| `thead` | `TableHeader` | `bg-muted/50 text-xs uppercase` |
| `tr` | `TableRow` | `border-b border-border hover:bg-muted/30` |
| `th` | `TableHead` | `px-4 py-3 font-medium text-muted-foreground` |
| `td` | `TableCell` | `px-4 py-3` |
| `code` (inline) | `code` | `rounded bg-muted px-1.5 py-0.5 text-sm font-mono` |
| `pre > code` | `Card` container | `rounded-xl border border-border bg-card p-4 overflow-x-auto` |
| `blockquote` | `Alert` | `border-l-4 border-primary bg-muted/30 pl-4 py-2` |
| `img` | `LazyImage` | `rounded-xl border border-border object-cover` |
| `h1` | `h1` | `text-2xl font-bold tracking-tight mt-8 mb-4` |
| `h2` | `h2` | `text-xl font-semibold tracking-tight mt-6 mb-3 border-b border-border pb-2` |
| `h3` | `h3` | `text-lg font-semibold mt-4 mb-2` |
| `ul` | `ul` | `list-disc pl-6 space-y-1 my-4` |
| `ol` | `ol` | `list-decimal pl-6 space-y-1 my-4` |
| `a` | `a` | `text-primary underline underline-offset-4 hover:text-primary/80` |
| `hr` | `Separator` | `my-8 border-border` |

### 10.4.3 Custom Directives

`remark-directive` ile tanımlanan custom directive’ler:

```markdown
:::alert{type="warning"}
Bu rapor yüksek volatilite içerir. Risk yönetimi kurallarınıza sadık kalın.
:::

:::card{title="IV Crush Skoru" variant="metric"}
- Ticker: AAPL
- Skor: 87
- Risk: Yüksek
:::

:::chart{type="bar" data="inline"}
{"labels": ["AAPL", "TSLA", "NVDA"], "datasets": [{"label": "IV", "data": [45, 62, 58]}]}
:::
```

Directive parser:

```typescript
// server/directiveParser.ts
function parseDirective(node: DirectiveNode): Directive {
  return {
    name: node.name,       // "alert", "card", "chart"
    attributes: node.attributes || {},
    children: node.children,
  };
}
```

### 10.4.4 Chart Embedding

MD içinde Recharts chart tanımlama:

```markdown
:::chart
{
  "type": "area",
  "data": "./assets/momentum-area.json",
  "xKey": "date",
  "yKeys": ["price", "volume"],
  "colors": ["#10b981", "#6366f1"],
  "height": 320
}
:::
```

Runtime render:

```typescript
// client/src/components/mdComponents/CustomChart.tsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function CustomChart({ config }: { config: ChartEmbed }) {
  const data = useChartData(config.data); // fetch JSON data

  return (
    <Card className="my-6 p-4">
      <ResponsiveContainer width="100%" height={config.height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`color-${config.yKeys[0]}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={config.colors[0]} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={config.colors[0]} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey={config.xKey} />
          <YAxis />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }} />
          <Area type="monotone" dataKey={config.yKeys[0]} stroke={config.colors[0]} fillOpacity={1} fill={`url(#color-${config.yKeys[0]})`} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
```

### 10.4.5 Image Handling

MD’deki görseller:
- **Relative path**: `./assets/gorsel.png` → server’dan serve edilir, path çözümlenir.
- **Absolute URL**: `https://cdn.example.com/gorsel.png` → doğrudan kullanılır.
- **Lazy loading**: `loading="lazy"` + `IntersectionObserver`.
- **Placeholder**: Blur-up placeholder (low-res base64 veya dominant color).
- **Optimizasyon**: `sharp` ile server-side resize/optimize. `?w=800&format=webp` query param’ları.

```typescript
// client/src/components/mdComponents/CustomImage.tsx
export function CustomImage({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="relative my-6 overflow-hidden rounded-xl border border-border">
      {!loaded && <ImageSkeleton />}
      <img
        src={src}
        alt={alt || ""}
        loading="lazy"
        className={cn("w-full object-cover transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </div>
  );
}
```

### 10.4.6 Math Rendering

KaTeX desteği (opsiyonel, ileri aşama):

```markdown
$$
\text{IV Crush} = \frac{\sigma_{\text{pre}} - \sigma_{\text{post}}}{\sigma_{\text{pre}}} \times 100
$$
```

```typescript
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// react-markdown plugins array’ine ekle
rehypePlugins: [rehypeKatex]
```

---

## 10.5 Performans Stratejisi

### 10.5.1 Lazy Loading

- **Tab content**: Sadece aktif tab’ın MD content’i render edilir. Diğer tab’lar DOM’a hiç girmez.
- **Images**: `loading="lazy"` + `IntersectionObserver`. Görünür alana giren görsel yüklenir.
- **Charts**: `CustomChart` component’i `React.lazy()` ile sarmalanır. Chart kütüphanesi (Recharts) sadece chart içeren sayfada yüklenir.
- **Math**: KaTeX CSS ve parser sadece math içeren MD’lerde yüklenir.

### 10.5.2 Code Splitting

Vite `manualChunks` konfigürasyonu:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "md-render": ["react-markdown", "remark-gfm", "rehype-highlight", "rehype-sanitize"],
          "charts": ["recharts"],
          "katex": ["katex", "rehype-katex"],
        },
      },
    },
  },
});
```

### 10.5.3 SSR vs CSR

| Route | Strateji | Gerekçe |
|-------|----------|---------|
| `/app` (Earnings) | **CSR** | İçerik admin panelden dinamik, statik build zamanı bilinmez. SEO kritik değil (auth protected). |
| `/momentum` | **CSR** | Aynı gerekçe. Scanner verileri real-time. |
| `/daily-report` | **CSR** | Günlük raporlar dinamik. |
| `/flow` | **CSR** | Sosyal özellikler (beğenme, yorum) tamamen client-driven. |
| Landing (`/`) | **SSG** (mevcut) | Marketing sayfası, statik. |

**SSR not**: İçerik dinamik olduğundan ISR (Incremental Static Regeneration) veya SSR anlamlı değildir. Her istekte güncel içerik gösterilmelidir. CSR + API caching yeterlidir.

### 10.5.4 Pre-fetching

```typescript
// client/src/components/TabStrip.tsx
import { preload } from "swr";

export function TabStrip({ tabs, activeTab, onChange, route }: TabStripProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cn("tab-button", activeTab === tab.id && "active")}
          onClick={() => onChange(tab.id)}
          onMouseEnter={() => preload(`/api/content/${route}/${tab.id}`, fetcher)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

### 10.5.5 Bundle Size

| Kütüphane | Gzip | Code Splitting | Not |
|-----------|------|----------------|-----|
| `react-markdown` | ~12KB | `md-render` chunk | Core render engine |
| `remark-gfm` | ~8KB | `md-render` chunk | Tables, task lists |
| `rehype-highlight` | ~5KB | `md-render` chunk | Code highlighting |
| `rehype-sanitize` | ~4KB | `md-render` chunk | XSS koruması |
| `recharts` | ~45KB | `charts` chunk | Sadece chart sayfalarında |
| `katex` | ~25KB | `katex` chunk | Sadece math sayfalarında |
| **Toplam (min)** | ~29KB | — | Chart/math yoksa |
| **Toplam (max)** | ~99KB | — | Tüm özellikler aktif |

**Optimizasyon**: `React.lazy()` + `Suspense` ile MD render engine sadece `/app`, `/momentum`, `/daily-report`, `/flow` route’larında yüklenir. Landing page ve marketing route’ları etkilenmez.

---

## 10.6 Güvenlik

### 10.6.1 XSS Koruması

MD içindeki HTML injection, script tag, event handler **engellenmelidir**.

**Katman 1 — Parse time**: `rehype-sanitize` ile `hast-util-sanitize` şeması. İzin verilen tag’ler: `div`, `span`, `p`, `h1-h6`, `ul`, `ol`, `li`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `a`, `img`, `code`, `pre`, `blockquote`, `strong`, `em`, `del`, `hr`, `br`.

**Yasaklanan tag’ler**: `script`, `style`, `iframe`, `object`, `embed`, `form`, `input`, `textarea`, `button`, `meta`, `link`.

**Yasaklanan attribute’lar**: `on*` event handler’lar, `javascript:`, `data:` URL’ler.

```typescript
const customSchema = {
  ...defaultSchema,
  tagNames: defaultSchema.tagNames?.filter((t) => !["script", "style", "iframe"].includes(t)),
  attributes: {
    ...defaultSchema.attributes,
    "*": ["className"],
    a: ["href"],
    img: ["src", "alt", "title", "loading"],
  },
  clobberPrefix: "user-content-",
};
```

**Katman 2 — Content Security Policy (CSP)**:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn.gistify.pro; connect-src 'self' /api;
```

**Katman 3 — DOMPurify (Opsiyonel)**: Client-side double-check. `react-markdown` `rehype-sanitize` zaten sanitize ettiğinden DOMPurify **fallback** olarak kullanılır. `dangerouslySetInnerHTML` kullanılmadığından gerekli değildir, ancak custom directive’lerde `innerHTML` injection riski varsa eklenebilir.

### 10.6.2 Content Sanitization

```typescript
// server/contentValidation.ts
import sanitizeHtml from "sanitize-html";

export function sanitizeMarkdownContent(raw: string): string {
  // HTML tag'leri içeren MD dosyaları için server-side sanitize
  return sanitizeHtml(raw, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title"],
      a: ["href", "title"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "data"],
  });
}
```

### 10.6.3 File Upload Validation

Admin panelden MD upload sırasında:

1. **Dosya tipi**: `multipart/form-data` `file.mimetype` check. Sadece `text/markdown`, `text/plain`, `text/x-markdown` kabul edilir.
2. **Boyut limit**: Max 5MB. Daha büyük dosyalar (image-heavy) ayrı asset upload sistemi ile yönetilir.
3. **İçerik tarayıcı**: İlk 1KB içinde `---` YAML frontmatter delimiter aranır. Yoksa `plain_md` olarak işlenir.
4. **Depth limit**: İç içe geçmiş `:::directive` max 3 seviye. Fazlası parse error.
5. **Asset path validation**: `../../etc/passwd` gibi path traversal engellenir. Sadece relative path veya whitelisted domain’ler kabul edilir.

```typescript
// server/uploadValidation.ts
export function validateUpload(file: UploadedFile): ValidationResult {
  const errors: string[] = [];

  if (file.size > 5 * 1024 * 1024) {
    errors.push("Dosya boyutu 5MB'yi aşamaz.");
  }

  if (!file.mimetype?.startsWith("text/")) {
    errors.push("Sadece Markdown (.md) dosyaları kabul edilir.");
  }

  const raw = file.buffer.toString("utf8").slice(0, 1024);
  if (!raw.trim()) {
    errors.push("Dosya boş.");
  }

  return { valid: errors.length === 0, errors };
}
```

### 10.6.4 Rate Limiting

Yeni MD yükleme frekansı limiti:

```typescript
// server/index.ts
import rateLimit from "express-rate-limit";

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 20, // Her IP 15 dk içinde max 20 upload
  message: { error: "Çok fazla dosya yükleme isteği. Lütfen 15 dakika sonra tekrar deneyin." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post("/api/content/:route/upload", uploadLimiter, requireAdmin, uploadHandler);
```

---

## 10.7 Hata Yönetimi

### 10.7.1 Parse Error

**Senaryo**: YAML frontmatter hatalı (`---` kapatılmamış, indentation bozuk).

**Gradyasyon**:
1. `gray-matter` hata fırlatır.
2. `catch` bloğunda dosya `plain_md` olarak retry edilir. İlk `---`’den sonrası body olarak alınır, `---` öncesi ignore edilir.
3. Retry başarısız olursa tab listesine hata flag’li entry eklenir. Kullanıcıya: `"Bu rapor işlenirken hata oluştu. YAML frontmatter syntax'ını kontrol edin."`

```typescript
async function parseWithFallback(raw: string): Promise<ParsedContent> {
  try {
    return await parseMarkdown(raw);
  } catch (err) {
    // Fallback: plain MD
    const withoutFrontmatter = raw.replace(/^---\s*[\s\S]*?---\s*/, "");
    return parseMarkdown(withoutFrontmatter); // matter() body döndürür
  }
}
```

### 10.7.2 Render Error

**React ErrorBoundary** ile component crash yönetimi:

```typescript
// client/src/components/MarkdownErrorBoundary.tsx
export class MarkdownErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>İçerik render hatası</AlertTitle>
          <AlertDescription>
            Bu rapor görüntülenirken teknik bir hata oluştu. 
            <Button variant="link" onClick={() => window.location.reload()}>Sayfayı yenileyin</Button>
            veya farklı bir rapor seçin.
          </AlertDescription>
        </Alert>
      );
    }
    return this.props.children;
  }
}
```

### 10.7.3 Missing Tab (Dosya Silindi)

**Senaryo**: Dosya silindi ama tab hala gösteriliyor (cache’de veya client state’te).

**Auto-cleanup**:
1. File Watcher `unlink` event’i registry’den ve cache’den siler.
2. Client tarafı `useSWR` 404 alırsa tab listesini revalidate eder, silinen tab otomatik kalkar.
3. 404 yerine fallback: `"Bu rapor artık mevcut değil."` toast mesajı.

```typescript
// Client tarafı 404 handling
const { error } = useSWR(`/api/content/${route}/${tabId}`, fetcher);
if (error?.status === 404) {
  toast.error("Rapor kaldırılmış veya taşınmış.");
  // Auto-redirect to first available tab
  setActiveTab(tabs[0]?.id);
}
```

### 10.7.4 Stale Cache

**Senaryo**: Dosya güncellendi ama cache eski.

**Invalidation**:
1. `chokidar` `change` event’i cache’i invalidates eder.
2. `Cache-Control: no-cache` header ile client cache’i bypass eder.
3. `useSWR` `revalidateOnFocus: true` ayarı ile pencere focus olduğunda tab listesi yeniden fetch edilir.

```typescript
// Server'da cache bypass header
app.get("/api/content/:route/:slug", (req, res) => {
  const { route, slug } = req.params;
  const content = getCachedContent(route, slug);
  
  res.setHeader("Cache-Control", "private, no-cache, must-revalidate");
  res.setHeader("Vary", "Accept-Encoding");
  
  if (content) {
    res.json(content);
  } else {
    res.status(404).json({ error: "Content not found" });
  }
});
```

---

# Bölüm 17: Deployment Pipeline

## 17.1 MD Dosya Yükleme Akışı

### 17.1.1 Admin Panel Upload UI

Mevcut `ReportsAdmin.tsx` paneline yeni **"Markdown Yükle"** modülü eklenir. Üç yükleme yöntemi:

1. **Drag & Drop**: `react-dropzone` ile MD dosyası sürükle-bırak. Çoklu dosya destekli.
2. **File Picker**: Geleneksel `<input type="file" accept=".md" multiple />`.
3. **Paste**: Panodan `.md` içeriği yapıştırma. `Clipboard API` ile text/plain içeriği alınır, frontmatter parse edilir.

```typescript
// client/src/components/reports/MarkdownUploader.tsx
import { useDropzone } from "react-dropzone";

export function MarkdownUploader({ route, onUpload }: { route: string; onUpload: () => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "text/markdown": [".md"], "text/plain": [".txt", ".md"] },
    maxSize: 5 * 1024 * 1024,
    multiple: true,
    onDrop: async (files) => {
      for (const file of files) {
        const text = await file.text();
        await uploadMarkdown(route, file.name, text);
      }
      onUpload();
    },
  });

  return (
    <div {...getRootProps()} className={cn("dropzone", isDragActive && "active")}>
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        {isDragActive ? "Dosyaları buraya bırakın..." : "MD dosyalarını sürükleyin veya tıklayın"}
      </p>
    </div>
  );
}
```

### 17.1.2 API Endpoint

```typescript
// server/index.ts
app.post("/api/content/:route/upload", requireAdmin, uploadLimiter, async (req, res) => {
  const route = req.params.route;
  const { filename, content } = req.body as { filename: string; content: string };

  // Validation
  const validation = validateUpload({ filename, content, size: Buffer.byteLength(content, "utf8") });
  if (!validation.valid) {
    return res.status(400).json({ error: "Validation failed", details: validation.errors });
  }

  // Parse + Normalize
  const parsed = await parseMarkdown(content);
  const normalized = normalizeContent(parsed, filename);

  // Route override check
  const targetRoute = normalized.meta.route || route;

  // Storage
  const rootPath = WATCH_ROOTS[targetRoute as keyof typeof WATCH_ROOTS];
  const filePath = path.join(rootPath, `${normalized.meta.slug}.md`);
  await fs.promises.writeFile(filePath, content, "utf8");

  // Registry + Cache update
  tabRegistry.upsert(targetRoute, normalized);
  setCachedContent(targetRoute, normalized.meta.slug, normalized);

  // Notification
  broadcastToClients({ type: "content:uploaded", route: targetRoute, slug: normalized.meta.slug });

  res.json({ success: true, slug: normalized.meta.slug, route: targetRoute });
});
```

### 17.1.3 Validation

| Kural | Açıklama | Hata Mesajı |
|-------|----------|-------------|
| Dosya tipi | `.md` veya `.txt` | "Sadece Markdown dosyaları kabul edilir" |
| Boyut | Max 5MB | "Dosya boyutu 5MB'yi aşamaz" |
| Format | Geçerli UTF-8 text | "Dosya okunamıyor, geçersiz encoding" |
| Frontmatter | `title` zorunlu | "Frontmatter'da 'title' alanı zorunludur" |
| Slug unique | Aynı route’ta aynı slug | "Bu slug ile başka bir rapor zaten mevcut" |
| Path safe | `../` içermemeli | "Geçersiz dosya adı" |

### 17.1.4 Storage

**Karar**: **Disk (Dosya sistemi)** — Mevcut proje yapısında raporlar zaten `earningreport/`, `momentum/`, `dailyreport/`, `flow/` dizinlerinde saklanıyor. S3/R2 geçişi ileri aşamadır (Bölüm 17.3.3).

Dosya yapısı:

```
earningreport/
  ├── 2026-06-10-cpi-sonrasi.md
  ├── 2026-06-11-opsiyon-stratejisi.md
  └── assets/
      ├── cpi-chart.json
      └── spx-setup.png

momentum/
  ├── 2026-06-12-momentum-scan.md
  └── assets/

dailyreport/
  ├── 2026-06-12-gunluk-rapor.md
  └── assets/

flow/
  ├── 2026-06-12-meta-guncel-durum.md
  └── assets/
```

### 17.1.5 Processing Pipeline

Upload sonrası işlem akışı:

```
Admin Upload ──▶ Validation ──▶ Parse ──▶ Normalize ──▶ Meta Extract ──▶
Disk Write ──▶ Index (TabRegistry) ──▶ Cache Warm ──▶ Deploy ──▶
Client Notification (WebSocket / SSE / Polling)
```

**Cache Warm**: Yeni dosya parse edildikten hemen sonra cache’e yazılır. İlk kullanıcı isteğinde cache miss olmaz.

### 17.1.6 Notification

Yeni MD eklendiğinde kullanıcıya bildirim:

- **Admin panel**: Sonner toast `toast.success("Rapor yayına alındı: CPI Sonrası Setup")`.
- **Client (aktif kullanıcı)**: WebSocket veya SSE ile `content:uploaded` event’i. Tab listesi otomatik revalidate olur.
- **Push Notification** (opsiyonel, ileri aşama): PWA service worker ile abone kullanıcılara bildirim.

```typescript
// Server'dan client'a broadcast
function broadcastToClients(payload: ServerEvent) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
}
```

---

## 17.2 Auto-Deploy Pipeline

### 17.2.1 Git Hook (Git Push Trigger)

Repo’ya yeni MD push edildiğinde otomatik deploy:

**GitHub Actions / GitLab CI** (opsiyonel, ileri aşama):

```yaml
# .github/workflows/md-deploy.yml
name: MD Auto Deploy
on:
  push:
    paths:
      - 'earningreport/**/*.md'
      - 'momentum/**/*.md'
      - 'dailyreport/**/*.md'
      - 'flow/**/*.md'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trigger Server Deploy
        run: |
          curl -X POST https://gistify.pro/api/admin/deploy-content \
            -H "Authorization: Bearer ${{ secrets.DEPLOY_TOKEN }}"
```

**Basit yaklaşım (mevcut)**: Production sunucuda `git pull` sonrası server restart edilir. File Watcher başlangıçta tüm `.md` dosyalarını `ignoreInitial: false` ile otomatik process eder. Yani `git pull` + `pm2 restart` yeterlidir.

### 17.2.2 Webhook

CMS veya Notion’dan yeni içerik geldiğinde trigger:

```typescript
app.post("/api/webhook/content", verifyWebhookSignature, async (req, res) => {
  const { source, content, metadata } = req.body;
  
  // CMS’den gelen içeriği MD formatına dönüştür
  const markdown = cmsToMarkdown(content, metadata);
  
  // Process pipeline
  const parsed = await parseMarkdown(markdown);
  const normalized = normalizeContent(parsed, metadata.title);
  
  // Deploy
  await deployContent(normalized);
  
  res.json({ received: true, deployed: normalized.meta.slug });
});
```

**Webhook Signature**: `crypto.createHmac('sha256', WEBHOOK_SECRET).update(JSON.stringify(body)).digest('hex')` ile verify edilir.

### 17.2.3 Cron (Periyodik Tarama)

Her 5 dakikada bir `md5` hash kontrolü ile dosya değişimi tespiti:

```typescript
// server/cron.ts
import { CronJob } from "cron";

const contentIntegrityJob = new CronJob("*/5 * * * *", async () => {
  for (const [route, rootPath] of Object.entries(WATCH_ROOTS)) {
    const files = await glob(`${rootPath}/**/*.md`);
    for (const file of files) {
      const hash = await computeFileHash(file);
      const cached = hashRegistry.get(file);
      
      if (cached && cached !== hash) {
        // File changed, re-process
        await processMarkdownFile(route, file, "change");
        hashRegistry.set(file, hash);
      }
    }
  }
});
```

**Gerekçe**: `chokidar` bazı edge case’lerde (VM, Docker) event kaçırabilir. Cron job fallback olarak çalışır.

### 17.2.4 Rollback

Hatalı deploy durumunda bir önceki versiyona geri dönüş:

**Strateji**: Her dosya overwrite edilmeden önce `.md.bak` kopyası alınır. Hata durumunda restore edilir.

```typescript
// server/rollback.ts
const BACKUP_SUFFIX = ".md.bak";

export async function backupFile(filePath: string) {
  const backupPath = filePath + BACKUP_SUFFIX;
  await fs.promises.copyFile(filePath, backupPath);
}

export async function rollbackFile(filePath: string) {
  const backupPath = filePath + BACKUP_SUFFIX;
  if (fs.existsSync(backupPath)) {
    await fs.promises.copyFile(backupPath, filePath);
    await fs.promises.unlink(backupPath);
    return true;
  }
  return false;
}

// Upload endpoint içinde
await backupFile(filePath); // Önce backup
await fs.promises.writeFile(filePath, content, "utf8"); // Yeni dosya
```

**Admin panel**: "Önceki versiyona dön" butonu. `POST /api/content/:route/:slug/rollback` endpoint’i backup’dan restore eder.

### 17.2.5 Versioning

Her MD’nin versiyon geçmişi:

```
earningreport/
  ├── 2026-06-10-cpi-sonrasi.md
  └── .versions/
      ├── 2026-06-10-cpi-sonrasi-20260610-143022.md
      ├── 2026-06-10-cpi-sonrasi-20260610-152145.md
      └── manifest.json
```

`manifest.json`:

```json
{
  "slug": "cpi-sonrasi",
  "versions": [
    { "timestamp": "2026-06-10T14:30:22Z", "path": "..." },
    { "timestamp": "2026-06-10T15:21:45Z", "path": "..." }
  ]
}
```

Admin panelden versiyon listesi görüntülenebilir ve istenilen versiyona geçiş yapılabilir.

---

## 17.3 Environment-Based Config

### 17.3.1 Development

| Ayar | Değer | Açıklama |
|------|-------|----------|
| `CONTENT_SOURCE` | `filesystem` | Dosya sistemi izleme |
| `WATCH_MODE` | `hot` | `chokidar` hot reload, değişiklik anında yansır |
| `CACHE_TTL` | `0` | Cache disabled, her zaman fresh |
| `VALIDATION_STRICT` | `false` | Eksik frontmatter’da warning, error değil |
| `LOG_LEVEL` | `debug` | Tüm pipeline log’ları görünür |

```typescript
// server/config.ts
const isDev = process.env.NODE_ENV !== "production";

export const contentConfig = {
  source: process.env.CONTENT_SOURCE || (isDev ? "filesystem" : "api"),
  watchMode: isDev ? "hot" : "poll",
  cacheTtl: isDev ? 0 : 1000 * 60 * 30,
  validationStrict: !isDev,
  logLevel: isDev ? "debug" : "warn",
};
```

**Development DX**:
- `pnpm dev` çalıştığında `chokidar` tüm ` earningreport/**/*.md` dosyalarını izler.
- Dosya kaydedildiğinde server log’una `📝 [content] earningreport/cpi.md updated → tab registry refreshed` yazılır.
- Client’da `useSWR` `refreshInterval: 2000` ile 2 saniyede bir tab listesi yenilenir (development only).
- HMR yoktur (API verisi olduğundan), ancak client otomatik revalidate eder.

### 17.3.2 Staging

| Ayar | Değer | Açıklama |
|------|-------|----------|
| `CONTENT_SOURCE` | `api` | API’dan çekme, test verisi |
| `API_BASE` | `https://staging-api.gistify.pro` | Staging endpoint |
| `CACHE_TTL` | `5m` | 5 dakika cache |
| `VALIDATION_STRICT` | `true` | Frontmatter zorunlu |
| `RATE_LIMIT` | `100/15min` | Yüksek limit, test için |

Staging ortamında: **test verisi** (fixture `.md` dosyaları) repo’da tutulur. CI/CD pipeline deploy ederken bu dosyaları staging sunucusuna kopyalar.

### 17.3.3 Production

| Ayar | Değer | Açıklama |
|------|-------|----------|
| `CONTENT_SOURCE` | `api` | CDN + API |
| `CDN_BASE` | `https://cdn.gistify.pro/content` | Statik asset’ler CDN’den |
| `CACHE_TTL` | `30m` | 30 dakika server cache |
| `CACHE_CONTROL` | `public, max-age=300` | 5 dakika browser cache |
| `RATE_LIMIT` | `20/15min` | Her IP 20 upload/15dk |
| `CSP` | `strict` | Full Content Security Policy |
| `ROLLBACK_ENABLED` | `true` | Auto-backup aktif |
| `VERSIONING_ENABLED` | `true` | Versiyon geçmişi tutulur |

**CDN + API stratejisi**:
- **MD content**: API’dan (`/api/content/:route/:slug`) JSON olarak çekilir. Server-side LRU cache’lenir.
- **Asset’ler** (görseller, JSON chart data): ` earningreport/assets/*.png` dosyaları Cloudflare R2 / S3 üzerinden serve edilir. `sharp` ile resize edilmiş versiyonlar.
- **Edge Function** (opsiyonel, ileri aşama): Vercel Edge Function veya Cloudflare Worker ile MD content’i edge’de cache’lenir, origin’a gitmeden serve edilir.

```typescript
// Production config
export const prodConfig = {
  cdn: {
    baseUrl: process.env.CDN_BASE,
    imageVariants: ["320w", "640w", "1200w"],
  },
  edge: {
    enabled: process.env.EDGE_CACHE === "true",
    ttl: 60 * 5, // 5 dakika edge cache
  },
  rateLimit: {
    upload: { windowMs: 15 * 60 * 1000, max: 20 },
    read: { windowMs: 60 * 1000, max: 120 },
  },
};
```

**Production dosya yapısı**:

```
/home/gistify/
├── app/                    # Node.js uygulama
│   ├── server/
│   ├── client/dist/
│   └── ...
├── content/                # MD content (ağaç yapısı aynı)
│   ├── earningreport/
│   ├── momentum/
│   ├── dailyreport/
│   └── flow/
├── content-backups/        # .versions/ dizinleri
└── nginx/                  # Reverse proxy + cache
```

**Nginx Cache Layer** (opsiyonel):

```nginx
# /etc/nginx/sites-available/gistify
location /api/content/ {
    proxy_pass http://localhost:3000;
    proxy_cache content_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_use_stale error timeout updating;
    add_header X-Cache-Status $upstream_cache_status;
}
```

---

## Özet: Teknoloji Stack Tablosu

| Katman | Teknoloji | Versiyon | Not |
|--------|-----------|----------|-----|
| File Watcher | `chokidar` | v4+ | Cross-platform, Windows uyumlu |
| MD Parser | `gray-matter` + `remark` | v4+ / v15+ | YAML + AST |
| GFM | `remark-gfm` | v4+ | Tablolar, task lists |
| Directives | `remark-directive` | v3+ | Custom `:::chart` / `:::alert` |
| MD → React | `react-markdown` | v9+ | Component mapping |
| Highlight | `rehype-highlight` + `prismjs` | v7+ / v1.29+ | Code block renklendirme |
| Sanitize | `rehype-sanitize` + `hast-util-sanitize` | v6+ | XSS koruması |
| Charts | `recharts` | v2+ | Sadece chart sayfalarında |
| Math | `katex` + `rehype-katex` | v0.16+ | Opsiyonel |
| Cache | `lru-cache` | v11+ | Server-side |
| Rate Limit | `express-rate-limit` | v7+ | Upload koruması |
| Upload | `react-dropzone` | v14+ | Drag & drop |
| HTTP Client | `swr` | v2+ | Client caching + revalidation |
| Animation | `framer-motion` | v11+ | Tab switch animasyonu |
| Cron | `cron` (node-cron) | v3+ | Periyodik rescan |

