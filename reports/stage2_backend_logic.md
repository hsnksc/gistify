# Stage 2: Backend/Logic Tarama Raporu

## 1. Backend Ölçeği

| Kategori | Dosya Sayısı | Toplam Satır |
|----------|-------------|-------------|
| Server (root) | 17 | ~15,000+ |
| server/index.ts | 1 | 4,199 satır (117 KB) |
| server/billingStore.ts | 1 | 1,739 satır (44 KB) |
| server/dailyReportSources.ts | 1 | 1,316 satır |
| server/momentumReportSources.ts | 1 | ~1,300 satır |
| server/cpiPpiForecast.ts | 1 | ~800 satır |
| server/calendarSync.ts | 1 | ~400 satır |
| server/weeklyReportSeeds.ts | 1 | ~400 satır |
| server/routes/ | 3 | ~500 satır |
| server/services/ | 1 | ~200 satır |

---

## 2. Monolitik Backend: server/index.ts (4,199 satır, 117 KB)

**Severity: CRITICAL**

server/index.ts tek dosyada:
- Express app kurulumu (middleware, CORS, body-parser, static files)
- 40+ API route tanımı (GET, POST, PUT, DELETE)
- Google OAuth auth flow (/api/auth/*)
- Paddle billing webhooks (/api/billing/*)
- OpenAI entegrasyonu (image generation, chart generation, translation, daily report)
- Yahoo Finance data fetching (fallback: Massive, TwelveData)
- SQLite database operations
- File upload handling
- Admin market data endpoints
- Earning report sources
- Momentum report generation
- Daily report generation
- Weekly report seeds
- Calendar sync
- CPI/PPI forecast
- Midas signals

**Bulgular (ilk 200 satır):**
- `as` assertion: 0 adet
- `console.log`: 0 adet
- `TODO` yorum: Yok (ilk 200 satırda)

**Sorunlar:**
1. **Tek Dosya = Tek Sorumluluk İlkesi Çiğneniyor** — 117 KB'lık dosyada 40+ endpoint, 10+ entegrasyon.
2. **Route Organizasyonu Yok** — `server/routes/` altında sadece 3 dosya var (Flow modülüne ait). Diğer 40+ route hâlâ `index.ts` içinde.
3. **Error Handling Tutarsız** — Bazı route'lar try-catch içinde, bazıları değil. Express error middleware yok.
4. **Rate Limiting Yok** — OpenAI API, Yahoo Finance, Massive, TwelveData — tüm dış API'lere rate limit yok.
5. **API Key Exposure Riski** — `process.env` kullanımı var ama .env.example dosyasındaki tüm key'ler boş.
6. **No Validation Middleware** — Zod backend'de kullanılmıyor gibi görünüyor (package.json'da zod var ama frontend'te). Request body validation yetersiz.

**Öneri:**
- `server/routes/` altına her domain için ayrı route file: `auth.ts`, `billing.ts`, `reports.ts`, `marketData.ts`, `openai.ts`, `calendar.ts`, `scanner.ts`.
- `server/services/` altına business logic.
- `server/middleware/` ekle: `errorHandler.ts`, `rateLimiter.ts`, `authMiddleware.ts`, `validationMiddleware.ts`.
- Zod ile request validation ekle.

---

## 3. Auth & Billing Logic

### Auth Flow
- Google OAuth `/api/auth/google`, `/api/auth/me`, `/api/auth/logout`
- Session cookie ile auth state
- `public` access mode: `accessMode` ile bazı kullanıcılar ücretsiz erişim alıyor
- Guest flow: `guest` planı ile kısıtlı erişim

**Sorunlar:**
- Auth state client-side `fetch("/api/auth/me")` ile alınıyor. Her sayfa yüklenişinde bu istek atılıyor.
- Auth state timeout 8,000ms + 4,000ms fallback — bu uzun.
- Public access mode mantığı client ve server'da ayrı ayrı implemente edilmiş. Tek kaynak olmalı.

### Billing Flow (billingStore.ts — 1,739 satır)
- Paddle JS SDK entegrasyonu
- Subscription plan yönetimi (guest, member, pro)
- Checkout, subscription, pause, cancel, update billing
- Webhook handling

**Sorunlar:**
- 1,739 satır — tek dosyada tüm billing logic. Customer, Subscription, Plan, Checkout, Webhook — hepsi bir arada.
- `billingStore.ts` ismi "store" ama bu bir dosya — Zustand/Redux store değil, Express endpoint'leri ve business logic.
- Client-side `paddleClient.ts` ile server-side `billingStore.ts` arasındaki sorumluluk bölümü belirsiz.

---

## 4. OpenAI Entegrasyonu

**Kapsam:**
- `server/openaiImageStudio.ts` — image generation
- `server/openaiTranslation.ts` — runtime translation
- `server/dailyReportOpenAiCharts.ts` — chart generation
- `server/dailyReportSources.ts` — daily report generation
- `server/momentumReportSources.ts` — momentum report generation

**Sorunlar:**
- OpenAI API'ye rate limit yok. Her kullanıcı istediği kadar request atabilir.
- Prompt engineering dosyaları ayrı değil — prompt'lar string literal olarak kod içinde.
- OpenAI hata durumlarında fallback yetersiz. API down olduğunda ne oluyor?
- `dailyReportOpenAiCharts.ts` — chart generation için OpenAI kullanıyor. Bu maliyetli. Recharts ile client-side chart daha mantıklı.

---

## 5. Veri Kaynakları (Data Sources)

**Yahoo Finance** (primary):
- `server/index.ts` içinde Yahoo Finance data fetching
- `client/src/scanner/lib/yahooFinance.ts` (frontend de ayrıca fetch ediyor)
- Fallback: Massive, TwelveData

**Sorunlar:**
- Aynı veri hem client'tan hem server'dan fetch ediliyor. Double fetching.
- Yahoo Finance API rate limit'i yok. IP ban riski var.
- Data caching stratejisi yok. Her sayfa yüklenişinde aynı veri tekrar fetch ediliyor.
- No SWR/React Query. Client-side cache yönetimi yok.

---

## 6. Translation API (Runtime DOM Translation)

**Mekanizma:**
1. App.tsx `language` state'i tutuyor.
2. `useEffect` ile DOM'u tarıyor (`document.createTreeWalker`).
3. Text node'ları `WeakMap` cache ile translate ediyor.
4. `/api/i18n/translate` endpoint'ine batch POST yapıyor.
5. Numeric text'leri maskeliyor.

**Sorunlar:**
- **Performans**: Her `language` değişiminde tüm DOM tree taranıyor. 1000+ element olan sayfada ciddi lag yaratır.
- **Güvenilirlik**: Text node walker script, style, textarea, input, pre, code element'lerini atlıyor ama bu liste yetersiz.
- **Ölçeklenebilirlik**: 18 text batch limiti, 12,000 karakter limiti. Büyük sayfalarda yetersiz.
- **Cache**: `WeakMap` cache kullanıyor ama sayfa refresh'inde cache kayboluyor. localStorage cache yok.
- **Maintenance**: 300 satırlık translation logic App.tsx içinde. Test edilmesi imkansız.
- **Bu çözümün yerine**: `react-i18next` veya `i18next` + `i18next-http-backend` kullanın. Build-time JSON translation files.

---

## 7. Frontend Logic (client/src/lib/)

**Dosyalar:**
- `api.ts` — API client (fetch wrapper)
- `stockData.ts`, `earningReports.ts`, `momentumReports.ts`, `dailyReports.ts`, `weeklyReports.ts` — data fetching
- `earningStrategyData.ts`, `optionStrategyData.ts`, `juneEarningsData.ts` — static data
- `reportMarkdown.ts`, `reportPost.ts`, `reportSpotlight.ts` — report rendering
- `dailyReportInsights.ts` — insight generation
- `momentumReportSource.ts` (1,382 satır), `momentumReportLibrary.ts` — report sources
- `earningReportSource.ts` (4,224 satır!) — earning report source data

**Sorunlar:**
- `earningReportSource.ts` 4,224 satır — statik earning data. Bu kadar büyük statik dosya client bundle'ına giriyor. Code splitting ile lazy load edilmeli.
- `momentumReportSource.ts` 1,382 satır — aynı sorun.
- No SWR, no React Query, no TanStack Query. Her component kendi fetch logic'ini yazıyor.
- No error retry logic. Network hatasında component crash ediyor.

---

## 8. Scanner Lib (client/src/scanner/lib/)

**Dosyalar:** 20+ analitik dosya

**Sorunlar:**
- `aiCatalystAnalyzer.ts`, `browserTrainer.ts`, `trainedModel.ts` — isimler çok havalı ama muhtemelen basit algoritmalar. "AI" jargonu kullanıcı beklentisini yükseltiyor.
- `v4Engine.ts`, `v3Report.ts` — versiyon numaralı dosyalar. Hangisi aktif? Eski versiyonları silin.
- `parallelScanner.ts`, `dailyScanner.ts` — frontend'de paralel scanning? Tarayıcıda Web Worker kullanımı yok. Main thread'i block ediyor olabilir.
- No test coverage. `vitest` package.json'da var ama test dosyası yok.

---

## 9. Backend/Logic Özet — En Kritik 10 Sorun

| # | Sorun | Severity | Eylem |
|---|-------|----------|-------|
| 1 | server/index.ts 4,199 satır — monolitik | **CRITICAL** | Route'ları `routes/` altına, logic'i `services/` altına taşı |
| 2 | No rate limiting — API abuse riski | **CRITICAL** | express-rate-limit ekle |
| 3 | No request validation (Zod backend'de yok) | **CRITICAL** | Zod schema validation middleware ekle |
| 4 | Runtime DOM translation (300 satır App.tsx) | **HIGH** | react-i18next'e geç |
| 5 | OpenAI rate limit yok — maliyet riski | **HIGH** | Kullanıcı başına rate limit, caching |
| 6 | Data caching stratejisi yok | **HIGH** | SWR/React Query veya server-side Redis cache |
| 7 | billingStore.ts 1,739 satır | **HIGH** | CustomerService, SubscriptionService, PlanService olarak böl |
| 8 | earningReportSource.ts 4,224 satır (client bundle) | **HIGH** | Code splitting, lazy load, veya API'ye taşı |
| 9 | No test coverage (vitest var ama test yok) | **HIGH** | Unit test ve integration test yaz |
| 10 | No Express error middleware | **MEDIUM** | Centralized error handler ekle |

---

*Rapor oluşturulma tarihi: 2025-06-25*
