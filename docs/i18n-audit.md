# i18n Audit

## Stack

- Client: React 19 + TypeScript + Vite + Wouter SPA under `client/src`.
- Server: Express app bundled from `server/index.ts`.
- Storage: SQLite through `server/billingStore.ts`.
- Meta management: client-side `usePageMeta` in `client/src/hooks/usePageMeta.ts`.
- Public server routing: `server/index.ts` plus SPA fallback.

## UI Migration

- Legacy `copy(language, tr, en)` source lived in `client/src/lib/i18n.ts`.
- Initial inventory before codemod: 3,147 `copy()` call sites across `client/src`.
- Migration tooling:
  - `scripts/i18n-migrate.ts`: converted literal/template `copy()` calls into `t("ns:key")`.
  - `scripts/remove-copy-imports.ts`: removed stale `copy` imports after migration.
- Current state:
  - `copy()` call sites: 0
  - `copy()` definition: removed
  - Locale catalog root: `client/src/locales/{tr,en}`
  - Generated key union: `client/src/i18n.generated.ts`

## Runtime Translation Inventory

- Removed body-level DOM translation observer from `client/src/App.tsx`.
- Flow title/summary client translation fallbacks were collapsed to pass-through hooks in `client/src/features/flow/hooks/useFlowTranslation.ts`.
- Flow translation health probe no longer pings `/api/i18n/translate`.
- `HtmlReportRenderer.tsx` now renders stored/preferred language content and surfaces a fallback notice instead of dispatching parent-side translation requests.
- Client-side `/api/i18n/translate` is now called only through `client/src/lib/translateDynamic.ts` for explicit user-content translation (currently flow comments).
- `client/src/App.tsx` performs a one-time `i18n_cache_version` migration and purges legacy runtime translation cache keys from `localStorage`.

## Language Routing

- Language source precedence is centralized in `client/src/lib/i18n.ts`:
  - URL prefix
  - `localStorage["app_language"]`
  - browser locale
  - default `tr`
- Client router now runs under `/${language}` via Wouter base path.
- Server legacy redirects:
  - `/` -> `302 /tr` or `302 /en` based on `app_language` cookie or `Accept-Language`
  - prefixless deep links -> `301 /tr/...`
- Sitemap is emitted as bilingual `tr`/`en` entries with `xhtml:link` alternates.

## Content Sources

- Flow/daily report bilingual payloads already exist in `server/dailyReportSources.ts` via `translations` and `availableLanguages`.
- Flow summary/report language projection lives in:
  - `server/routes/flow/reports.ts`
  - `server/services/flowService.ts`
- Coverage markdown sources live in `server/coverageSources.ts` and can load `.en.md` sidecars plus source-language fallback metadata.

## Formatting / Intl

- Locale-safe format helpers live in `client/src/lib/format.ts`:
  - `formatNumber`
  - `formatCurrency`
  - `formatDate`
  - `formatPercent`

## Translation Assets

- Prompt template: `server/i18n/prompt.ts`
- Glossary seed: `server/i18n/glossary.json`
- Do-not-translate seed: `server/i18n/do-not-translate.json`

## Validation

- Typecheck: `corepack pnpm exec tsc --noEmit`
- Build: `corepack pnpm build`
- Locale parity check: `corepack pnpm i18n:check`
