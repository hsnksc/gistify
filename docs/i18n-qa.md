# i18n QA

## Commands

- `corepack pnpm exec tsc --noEmit`
- `corepack pnpm build`
- `corepack pnpm i18n:check`

## Smoke Checklist

- Open `/tr` and `/en`; confirm the app boots without a client redirect loop.
- Visit a legacy URL such as `/pricing` or `/earnings/AAPL`; confirm the server issues a redirect to `/tr/...`.
- Toggle language in a public page header; confirm the path prefix changes and the page stays on the same route.
- Refresh after switching languages; confirm the selected language persists through `app_language`.
- Inspect page source after route changes; confirm `canonical`, `hreflang`, `og:locale`, and `<html lang>` are aligned.
- Open a flow report with English content available; confirm the English report loads directly with no runtime translation delay.
- Open a flow/daily report without the requested language; confirm the original content renders and the fallback notice is visible.
- Open a flow report comment thread in `/en`; confirm Turkish comments are translated via the explicit dynamic translation path and failures fall back to the original body.
- Verify numbers, dates, currencies, and percentages are rendered through `Intl` helpers and not mutated by translation.
- Verify `/sitemap.xml` includes both `/tr/...` and `/en/...` entries with alternate links.
- Verify `/app` still carries `noindex`.

## Known Warnings

- `corepack pnpm i18n:check` currently reports unused keys as warnings only. The latest baseline is 119 warnings.
- Build emits existing environment placeholder warnings for:
  - `VITE_HOTJAR_SITE_ID`
  - `VITE_ANALYTICS_ENDPOINT`
  - `VITE_ANALYTICS_WEBSITE_ID`
- Build emits an existing large-chunk warning for the main client bundle.
