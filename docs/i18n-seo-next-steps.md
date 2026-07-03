# i18n SEO Next Steps

## Current State

- URLs are language-prefixed at `/tr/...` and `/en/...`.
- Client meta now emits canonical, `hreflang`, `x-default`, and `og:locale`.
- Server sitemap is bilingual.
- Public pages are still rendered as SPA routes after the redirect layer.

## Option 1: Prerender

- Lowest migration cost.
- Works well for a bounded set of public routes such as home, pricing, terms, privacy, refund, scanner landing pages, and stable report index routes.
- Can reuse the current Vite build and emit static HTML snapshots after build.
- Good first step if the goal is better crawl reliability without restructuring app routing.

## Option 2: Full SSR

- Highest implementation cost, but strongest crawl consistency.
- Better fit if public report pages, coverage pages, and marketing pages keep expanding and need first-response metadata/content without client execution.
- Requires replacing or wrapping current SPA bootstrap and routing assumptions.

## Recommendation

- Short term: add a post-build prerender pass for the top public routes under both `/tr` and `/en`.
- Medium term: revisit SSR only if public SEO pages become a primary acquisition surface or if prerender maintenance grows too large.
- Keep route ownership explicit: marketing/public SEO pages should be the first candidates for server-side or prerendered delivery, not the gated `/app` workspace.
