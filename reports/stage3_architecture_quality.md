# Stage 3: Mimari & Kod Kalitesi Tarama Raporu

## 1. God Component — App.tsx (1,478 satır)

**Severity: CRITICAL**

Teknik Metrikler:
- `useState`: 3 adet | `useEffect`: 6 adet
- `useMemo`: 3 adet | `useCallback`: 2 adet
- `useRef`: 12 adet | `copy()`: 52 adet
- `as` assertion: 11 adet | `console.log`: 0 adet
- `any` type: 0 adet

**Mimari Debt:**
App.tsx bir God Component. Sadece routing olmalı ama şunları da içeriyor:
1. Auth state machine (loading -> anonymous -> authenticated)
2. Google OAuth login/logout handlers
3. Paddle subscription state
4. Runtime DOM translation engine (300 satır)
5. Workspace navigation component
6. SubscriptionRequiredView component
7. SiteFooter component
8. getWorkspaceSectionLabel helper
9. Route kararları (7 farklı boolean flag)

**Cyclomatic Complexity**: 15+ farklı conditional branch.

**Öneri:**
```
App.tsx (50 satır)
├── AuthProvider.tsx
├── TranslationProvider.tsx
├── Layout.tsx
│   ├── WorkspaceHeader.tsx
│   ├── WorkspaceNavigation.tsx
│   └── SiteFooter.tsx
├── SubscriptionGuard.tsx
└── AppRoutes.tsx
```

---

## 2. Monolitik Backend — server/index.ts (4,199 satır)

**Severity: CRITICAL**

- 117 KB tek dosya
- 40+ Express route
- 10+ third-party API entegrasyonu
- SQLite database operations
- File upload handling
- OpenAI prompt execution

**Code Smell:** "Large Class" / "God Object" anti-pattern.

**Öneri:**
```
server/
├── index.ts (50 satır - bootstrap only)
├── middleware/
│   ├── auth.ts
│   ├── errorHandler.ts
│   ├── rateLimiter.ts
│   └── validation.ts
├── routes/
│   ├── auth.ts
│   ├── billing.ts
│   ├── reports.ts
│   ├── marketData.ts
│   ├── openai.ts
│   ├── calendar.ts
│   └── scanner.ts
├── services/
│   ├── authService.ts
│   ├── billingService.ts
│   ├── reportService.ts
│   └── marketDataService.ts
└── utils/
    ├── openaiClient.ts
    └── yahooFinance.ts
```

---

## 3. Component Tree Derinliği & Prop Drilling

**Prop Drilling Zinciri:**
```
App.tsx -> Router -> Page -> Tab -> Component -> UI Component
  |         |       |      |       |            |
language  language language language language   language
```

`language` prop'u 5-6 seviye aşağıya iniyor. Her seviyede `copy(language, "tr", "en")` çağrısı.

**Global State Eksikliği:**
- Zustand/Jotai/Redux yok.
- Sadece `useReportStore.ts` (Flow modülü) var.
- Auth state App.tsx'te local useState.
- Language state App.tsx'te local useState.
- Theme state ThemeContext.tsx'te (React Context).

**Öneri:** Zustand ile global store: `useAuthStore`, `useLanguageStore`, `useThemeStore`.

---

## 4. Code Duplication

### Tab Loading States
Her tab bileşeninde benzer loading state:
```tsx
<div className="px-4 py-8">
  <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-card/95 p-6 shadow-2xl">
    <h2 className="text-lg font-semibold">Yukleniyor...</h2>
  </div>
</div>
```
Bu pattern 15+ farklı yerde tekrarlanıyor.

### Admin Panel'ler
4 ayrı admin panel — her biri benzer yapı. Tek bir generic `AdminPanel.tsx` + config yapılabilir.

### `copy()` Fonksiyonu
Toplam 2,055 `copy()` çağrısı. Her bileşende `copy(language, "tr", "en")` tekrarlanıyor.

---

## 5. TypeScript Strictness

### Metrikler
- `any` type (client): 10 adet
- `as` assertion (client): 306 adet
- `!` non-null assertion (client): 33 adet
- `as` assertion (server): 148 adet

**Değerlendirme:**
- `as` assertion 306 adet — çok yüksek. TypeScript type safety'i zayıflatıyor.
- `any` 10 adet — az ama kritik yerlerde olabilir.

**Öneri:**
- `tsconfig.json` strictness seviyesini artır.
- `as` assertion'ları `type guard` fonksiyonlarıyla değiştir.
- `any` type'ları `unknown` + type guard ile değiştir.

---

## 6. Build & CI/CD

### package.json Scripts
- `dev`: vite --host
- `build`: vite build + esbuild server bundle
- `start`: production node
- `check`: tsc --noEmit
- `format`: prettier --write

**Sorunlar:**
- **ESLint yok!** `package.json`'da ESLint dependency'si yok.
- **Test yok!** `vitest` dependency olarak var ama `test` script'i yok.
- **Prettier var** ama `format` script'i genel `prettier --write .`
- **TypeScript check**: `tsc --noEmit` var. Bu iyi.

**Öneri:**
- ESLint ekle (`eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`)
- Test script'i ekle (`"test": "vitest"`)
- Pre-commit hook (husky + lint-staged) ekle
- GitHub Actions'a test + lint step'i ekle

---

## 7. Performans

### Bundle Size Riskleri
| Paket | Boyut | Kullanım |
|-------|-------|----------|
| recharts | ~80 KB gzipped | Chart'lar her sayfada |
| framer-motion | ~40 KB gzipped | Kullanılmıyor! (import 0) |
| lucide-react | ~20 KB (tree-shake) | Her sayfada 50+ icon |
| axios | ~15 KB | Kullanılmıyor! |

**Dead Dependencies:** `axios`, `framer-motion` (kullanılmıyor ama bundle'a giriyor).

### Lazy Loading
- App.tsx'te `React.lazy` kullanımı var. Bu iyi.
- Ama tab içerikleri lazy değil. `MidasOpportunitiesTab` 1,794 satır — hemen render oluyor.
- Scanner lib 25,000+ satır — muhtemelen hepsi bundle'a giriyor.

### Memory Leak Riskleri
- App.tsx'te 9 `useRef` + `WeakMap` cache. Cleanup fonksiyonları var ama çok karmaşık.
- `runtimeTranslationTimerRef` — cleanup var.
- Event listener'lar (resize, scroll) cleanup ediliyor mu? Kontrol edilmeli.

### Font Loading
- `Inter` ve `JetBrains Mono` tanımlı ama `@font-face` veya Google Fonts import yok.
- Fontlar sistem font'larına fallback yapıyor.

---

## 8. Güvenlik

### XSS Riskleri
- `dangerouslySetInnerHTML` kullanımı var mı? `HtmlReportRenderer.tsx` ve `MarkdownReportRenderer.tsx` kontrol edilmeli.
- Runtime DOM translation text node'ları doğrudan manipüle ediyor.

### CSRF Protection
- Express `csurf` middleware yok.
- Cookie `sameSite` politikası kontrol edilmeli.
- Auth cookie'leri `HttpOnly` + `Secure` + `SameSite=strict` olmalı.

### Input Validation
- Backend'de Zod kullanılmıyor.
- SQL injection riski (SQLite raw query kullanımı varsa).
- File upload validation (tip, boyut, içerik taraması).

### Rate Limiting
- Yok. Brute force, DDoS, API abuse riski.

---

## 9. DX (Developer Experience)

### File Organization
- `features/` pattern sadece Flow'da var.
- `client/src/lib/` altında 20+ dosya — hepsi aynı seviyede.
- `scanner/` dizini ayrı ama `pages/Scanner.tsx` onu sarmalıyor. Tutarsız.

### Import Aliases
- `@/components`, `@/lib`, `@/hooks` — iyi.
- Ama `@/features/flow/*` gibi daha spesifik alias'lar yok.

### Patched Dependencies
- `wouter@3.7.1.patch` — neden patch? Ne değişiklik yapıldı? Patch'in içeriği belgesiz.

### Manus Runtime
- `vite-plugin-manus-runtime` — ne işe yarıyor? Production build'ine giriyor mu?

---

## 10. Package.json Dependency Analizi

### Conflicts / Riskler
- `tailwindcss 4.1.14` + `autoprefixer 10.4.20` + `postcss 8.4.47` — Tailwind 4 PostCSS plugin yerine kendi CSS processor'ünü kullanıyor.
- `pnpm` `devDependencies`'da — `packageManager` zaten pnpm tanımlı. Gereksiz.
- `add` paketi — `devDependencies`'da. Gereksiz.

### Dead Dependencies
- `axios` — kullanılmıyor.
- `streamdown` — ne işe yarıyor?

---

## 11. Mimari & Kalite Özet — En Kritik 10 Sorun

| # | Sorun | Severity | Eylem |
|---|-------|----------|-------|
| 1 | App.tsx 1,478 satır — God Component | **CRITICAL** | Refaktör: AuthProvider, Layout, Router, TranslationProvider |
| 2 | server/index.ts 4,199 satır — monolitik | **CRITICAL** | routes/, services/, middleware/ olarak böl |
| 3 | ESLint yok — kod kalitesi kontrolsüz | **CRITICAL** | ESLint + @typescript-eslint ekle |
| 4 | Test yok — vitest var ama kullanılmıyor | **CRITICAL** | Test script'i ekle, temel test'ler yaz |
| 5 | 306 `as` assertion — type safety zayıf | **HIGH** | Type guard fonksiyonları, strict tsconfig |
| 6 | No rate limiting — security risk | **HIGH** | express-rate-limit ekle |
| 7 | Prop drilling (language prop 5-6 seviye) | **HIGH** | Zustand store kullan |
| 8 | Code duplication (loading states, admin panels) | **HIGH** | Generic bileşenler oluştur |
| 9 | axios dead dependency | **MEDIUM** | Kaldır veya kullan |
| 10 | No error boundary coverage (sadece App.tsx) | **MEDIUM** | Her route'a ErrorBoundary ekle |

---

*Rapor oluşturulma tarihi: 2025-06-25*
