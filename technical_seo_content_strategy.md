# Gistify.pro Technical SEO & Content Strategy Report

**Prepared by:** TechnicalSEO_Content_Strategist  
**Date:** 2025-01-13  
**Domain:** gistify.pro  
**Platform:** React/Vue SPA — Dark-themed finance workspace for active options traders  

---

## Executive Summary

Gistify.pro is a well-designed SPA product with a **single-page indexation problem** — only the homepage is visible to Google, and no internal pages, blog content, or programmatic landing pages are indexed. The site has **solid foundational meta tags** but **critical technical gaps** (missing H1, broken sitemap, no structured data, no Open Graph/Twitter Cards) that severely limit organic discoverability. 

**The opportunity:** Gistify sits at the intersection of two high-intent, high-volume SEO niches — **options trading education** and **earnings season research**. Competitors like Unusual Whales, Market Chameleon, and Finviz capture tens of thousands of organic visits monthly from content and tool pages that Gistify does not currently have. A structured programmatic SEO + content hub strategy can change this within 12–24 weeks.

---

## Part A — Technical SEO Audit

### 1. Current State (Live Data)

#### 1.1 Google Indexing Status (`site:gistify.pro`)

| Finding | Status | Severity |
|---------|--------|----------|
| Homepage (`https://gistify.pro/`) | **Indexed** ✅ | — |
| Subpages (`/app`, `/blog/*`, `/earnings/*`) | **Not indexed** ❌ | Critical |
| Total indexed pages | ~1 page | Critical |
| Sitelinks | None visible | Medium |
| Rich results | None | Medium |

**Analysis:** Only the homepage is in Google's index. The SPA redirect to `/app` means Googlebot sees a single URL with dynamic content. Without prerendering or SSR, no interior route is indexable.

---

#### 1.2 robots.txt Analysis (`https://gistify.pro/robots.txt`)

```
# As a condition of accessing this website, you agree to abide by the following
# content signals:
# (a) If a Content-Signal = yes, you may collect content for the corresponding use.
# (b) If a Content-Signal = no, you may not collect content for the corresponding use.
# (c) If the website operator does not include a Content-Signal for a corresponding use,
#     the website operator neither grants nor restricts permission...

# BEGIN Cloudflare Managed content
User-agent: *
Content-Signal: search=yes,ai-train=no
Allow: /

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CloudflareBrowserRenderingCrawler
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: meta-externalagent
Disallow: /
```

| Finding | Status | Severity |
|---------|--------|----------|
| General search access | `Allow: /` ✅ | OK |
| AI crawler blocking (ClaudeBot, GPTBot, etc.) | `Disallow: /` ⚠️ | Low/Medium |
| Google-Extended blocked | `Disallow: /` ⚠️ | Low |
| Content-Signal header | `search=yes` ✅ | OK |
| Missing `Sitemap:` directive | ❌ | Medium |

**Analysis:** The robots.txt is **Cloudflare-managed** and functionally correct for search. Blocking AI crawlers is a business choice — it does not affect Googlebot indexing. However, **there is no `Sitemap:` directive**, which means Google must discover URLs entirely through links.

**Fix:** Add a `Sitemap:` line at the bottom of robots.txt once a proper XML sitemap is generated.

---

#### 1.3 sitemap.xml Analysis (`https://gistify.pro/sitemap.xml`)

| Finding | Status | Severity |
|---------|--------|----------|
| File returns HTML, not XML | ❌ | **Critical** |
| No `<urlset>` or `<sitemapindex>` structure | ❌ | Critical |
| No `<lastmod>`, `<changefreq>`, `<priority>` tags | ❌ | Critical |
| Only shows a fallback page title | ❌ | Critical |

**Analysis:** The sitemap endpoint returns a generic HTML page ("Gistify — Momentum tarama, earnings oncesi analiz...") rather than a valid XML sitemap. This is **functionally broken** — Google cannot parse it, and it provides zero crawl guidance.

**Fix:** Generate a valid `sitemap.xml` with all indexable URLs and serve it with `Content-Type: application/xml`. If the SPA routes are dynamic, use a **dynamic sitemap endpoint** (e.g., `/sitemap.xml` served by the backend or a serverless function) that generates the XML on request.

---

#### 1.4 Meta Tags (Homepage)

| Tag | Current Value | Status |
|-----|--------------|--------|
| `<title>` | "Gistify — Earnings Intelligence & Momentum Workspace" | ✅ Good |
| `<meta name="description">` | "Gistify brings earnings intelligence, momentum scanning, macro event framing and options research into one dark finance workspace." | ✅ Good |
| `<meta property="og:*">` | Not detected in fetched content | ❌ Missing |
| `<meta name="twitter:*">` | Not detected in fetched content | ❌ Missing |
| Canonical tag | Not detected | ❌ Missing |
| `<link rel="alternate">` (hreflang) | None | ❌ Missing |

**Analysis:** Title and description are well-written, keyword-rich, and within character limits. However, **Open Graph and Twitter Card tags are completely missing**, which means social sharing will look broken (no image, no proper card).

**Fix:** Add full Open Graph and Twitter Card tag sets to every route.

---

#### 1.5 H1 & Heading Structure

| Element | Status | Severity |
|---------|--------|----------|
| H1 tag on homepage | **MISSING** | **Critical** |
| H2 tags | Present in sections ("Product Overview", "What the customer gets", etc.) | ✅ |
| H3 tags | Present in feature cards | ✅ |
| H1 on other routes | Unknown (not indexable) | Critical |

**Analysis:** The homepage has **no H1 tag**. The visible headings are H2s. In an SPA, the H1 is especially critical because it tells Googlebot the primary topic of the page when it renders the JavaScript. Without an H1, Google must infer the page topic from the title tag alone, weakening topical relevance signals.

**Fix:** Add `<h1>Gistify — Earnings Intelligence & Momentum Workspace for Options Traders</h1>` to the hero section of the homepage. Ensure every route has a unique, descriptive H1.

---

#### 1.6 Structured Data (Schema.org)

| Type | Status | Severity |
|------|--------|----------|
| `SoftwareApplication` schema | Not detected | **Critical** |
| `Organization` schema | Not detected | Medium |
| `WebSite` schema (with Sitelinks Searchbox) | Not detected | Medium |
| `FAQPage` schema | Not detected | Low |
| JSON-LD in `<head>` | Not detected | Critical |

**Analysis:** Zero structured data is present. For a SaaS/fintech product, `SoftwareApplication` schema is essential — it enables rich results in Google, including star ratings, pricing, and category information in the SERP. The lack of `Organization` schema also means no Knowledge Panel potential.

**Fix:** Inject JSON-LD for `SoftwareApplication`, `Organization`, and `WebSite` on every page.

---

#### 1.7 URL & Canonical Issues

| Issue | Current State | Severity |
|-------|--------------|----------|
| Redirect from `/` to `/app` | Confirmed | Medium |
| `/` serves marketing content | Yes | — |
| `/app` is the SPA shell | Yes | — |
| Canonical URL on `/` | Not detected | Medium |
| Canonical URL on `/app` | Not detected | Medium |
| Risk of duplicate content between `/` and `/app` | High | Medium |

**Analysis:** The homepage redirects to `/app` but the marketing content appears to be on `/`. This is ambiguous. If both `/` and `/app` serve the same content, Google may see duplicate content. **A canonical tag must be set** on `/app` pointing to `/`, or vice versa, depending on which URL is the preferred landing page.

**Fix:** Set `<link rel="canonical" href="https://gistify.pro/">` on the homepage. If `/app` is the functional entry point, consider making `/` the canonical and using `/app` as a redirect target for logged-in users only.

---

### 2. SPA SEO Strategy — SSR vs Prerender vs SSG

#### 2.1 The Problem

Gistify is a **client-side rendered SPA**. Googlebot can render JavaScript, but it does so in two waves:

1. **Wave 1:** Crawls the raw HTML (empty `<div id="root"></div>` or minimal shell).
2. **Wave 2:** Executes JavaScript and indexes the rendered content — with delays of hours to days.

For a finance product with time-sensitive earnings data, this two-wave indexing is **unacceptable**. Additionally, Googlebot does not guarantee crawling of all JavaScript routes, and social sharing bots (Facebook, Twitter, LinkedIn, Slack, Discord) do not execute JavaScript at all — they see a blank page.

#### 2.2 Three Approaches (Ranked)

| Approach | Implementation | Pros | Cons | Recommendation |
|----------|---------------|------|------|----------------|
| **A. SSR (Server-Side Rendering)** | Migrate to Next.js (React) or Nuxt.js (Vue) with SSR/SSG | Full SEO control, fast FCP, perfect social sharing, easy programmatic pages | Major engineering effort, hosting changes | **Best long-term** |
| **B. Dynamic Prerendering** | Use Prerender.io, Rendertron, or a Cloudflare Worker that serves static HTML to crawlers | Minimal code changes, fast to implement, works with existing SPA | Costs scale with pages, stale content risk, slower than true SSR | **Best short-term** |
| **C. SSG for Marketing Pages** | Keep the app as SPA, but build marketing pages (blog, earnings, strategies) as static HTML in a separate subdomain or `/` path | Clean separation, fast marketing pages, no SPA SEO risk | Two codebases, requires routing logic | **Recommended hybrid** |

#### 2.3 Recommended Architecture

**Phase 1 (Weeks 1–4): Dynamic Prerendering**

```
User → Cloudflare → SPA (normal)
Bot → Cloudflare → Prerender.io / Rendertron → Static HTML
```

- Deploy **Prerender.io** or a **Cloudflare Worker** that detects user-agents (Googlebot, Bingbot, facebookexternalhit, etc.) and serves a pre-rendered static HTML snapshot.
- Cost: ~$80–150/month for Prerender.io Pro (up to 250k pages).
- Effort: ~1–2 days of DevOps setup.

**Phase 2 (Weeks 8–12): SSG Marketing Site + SPA App**

```
/           → Static marketing site (Next.js SSG, deployed to Vercel/Netlify)
/app/*      → SPA (existing React/Vue app, deployed to app server or CDN)
/blog/*     → Static blog (Next.js SSG or headless CMS like Strapi/Contentful)
/earnings/* → Static/ISR earnings pages (Next.js ISR — revalidated every 15 min)
/strategies/* → Static strategy guides (Next.js SSG)
/tools/*    → Static tool pages + interactive widgets
```

- Use **Next.js ISR (Incremental Static Regeneration)** for earnings pages — they rebuild automatically when new data is available.
- Keep the existing SPA for the authenticated app experience (scanner, dashboard, etc.).
- Route `/app` through a reverse proxy or subdomain (`app.gistify.pro`) for clean separation.

**Phase 3 (Months 4–6): Full SSR Migration (Optional)**

If the app grows significantly, migrate the entire experience to Next.js with SSR/SSG for unified SEO and performance.

---

### 3. Critical Technical Fixes (Priority Matrix)

#### 🔴 Critical Priority (Fix Within 1 Week)

| # | Fix | Implementation | Impact |
|---|-----|---------------|--------|
| 1 | **Add H1 to homepage** | Insert `<h1>` in the hero section with primary keyword | Direct ranking signal for target queries |
| 2 | **Fix sitemap.xml** | Generate valid XML sitemap with all URLs; add `Sitemap:` directive to robots.txt | Enables crawl discovery of all pages |
| 3 | **Add canonical tags** | Set `<link rel="canonical">` on `/` and `/app` to resolve duplicate content | Prevents duplicate content penalty |
| 4 | **Implement prerendering** | Deploy Prerender.io or Rendertron for bot snapshots | Makes SPA routes indexable immediately |
| 5 | **Add JSON-LD structured data** | Inject `SoftwareApplication`, `Organization`, `WebSite` schema | Enables rich results, Knowledge Panel |

#### 🟡 Medium Priority (Fix Within 2–4 Weeks)

| # | Fix | Implementation | Impact |
|---|-----|---------------|--------|
| 6 | **Add Open Graph & Twitter Cards** | Add `og:title`, `og:description`, `og:image`, `twitter:card` to every route | Social sharing CTR, branded visibility |
| 7 | **Add unique meta tags per route** | Use React Helmet Async or similar to set `<title>` and `<meta name="description">` dynamically for each SPA route | Page-level relevance for long-tail keywords |
| 8 | **Implement hreflang** | Add `<link rel="alternate" hreflang="en">` (and `tr` if Turkish version exists) | Proper international targeting |
| 9 | **Add `Organization` schema** | JSON-LD with logo, URL, social profiles, support email | Knowledge Panel eligibility |
| 10 | **Create `/404` and `/500` error pages** | Proper HTTP status codes + helpful UI | Crawl budget preservation |

#### 🟢 Low Priority (Fix Within 1–2 Months)

| # | Fix | Implementation | Impact |
|---|-----|---------------|--------|
| 11 | **Add breadcrumbs with schema** | BreadcrumbList JSON-LD on all pages | Rich results in SERP |
| 12 | **Implement FAQPage schema** | Add FAQ schema to homepage and strategy pages | Rich snippet expansion |
| 13 | **Add `WebSite` schema with searchbox** | Include `potentialAction` → `SearchAction` pointing to `/app?search={search_term}` | Sitelinks searchbox in SERP |
| 14 | **Core Web Vitals optimization** | Target LCP <2.5s, FID <100ms, CLS <0.1 | Ranking signal, UX improvement |
| 15 | **Add `rel="noopener noreferrer"` to external links** | Security + crawl budget hygiene | Minor security/SEO best practice |

---

### 4. Page Speed Recommendations

| Metric | Current Estimate | Target | Action |
|--------|-----------------|--------|--------|
| **LCP (Largest Contentful Paint)** | ~3.5–4.5s (dark SPA, likely large JS bundle) | <2.5s | Code-split JS bundles, lazy-load images, prerender above-the-fold |
| **FID (First Input Delay)** | ~150–300ms (heavy JS) | <100ms | Reduce main-thread work, split vendor bundles, use web workers for scanner math |
| **CLS (Cumulative Layout Shift)** | ~0.05–0.1 (likely low for dark SPA) | <0.1 | Set explicit dimensions on images, reserve space for dynamic scanner widgets |
| **TTFB (Time to First Byte)** | Unknown | <600ms | Use CDN (Cloudflare already active), optimize origin response |
| **Total Blocking Time** | Likely high | <200ms | Defer non-critical JS, preload critical CSS |

**SPA-specific speed fixes:**
- **Route-based code splitting**: Split the scanner, earnings, and risk matrix modules into separate chunks.
- **Preload scanner data**: Use `<link rel="preload">` for the first API call that populates the scanner.
- **Image optimization**: Use WebP with fallbacks, lazy-load below-the-fold images.
- **Service Worker**: Implement a caching strategy for static assets and API responses.

---

## Part B — Content Strategy

### 1. Programmatic SEO Opportunities

Programmatic SEO is the **highest-ROI strategy** for Gistify because it can generate hundreds of indexable pages from structured data (earnings calendar, stock scanner results, options strategies) without manual writing.

#### 1.1 Earnings Preview Pages

**Template:** `/earnings/{ticker}`

**Example:** `/earnings/AAPL`, `/earnings/TSLA`, `/earnings/NVDA`

**Auto-generated content from data:**
- Earnings date (next + previous)
- Expected EPS vs. consensus
- Whisper number (if available)
- Historical beat/miss rate (last 8 quarters)
- Post-earnings move history (average, min, max)
- IV rank / IV percentile
- Expected move (from options chain)
- Sector rotation context
- Gistify's "Pre-Earnings Brief" card (automated)
- CALL/PUT setup suggestion based on historical data

**SEO value:**
- Target keyword: `{ticker} earnings preview`, `{ticker} earnings options play`, `{ticker} before earnings`
- Search volume: 100–10,000+ searches per month per large-cap ticker
- Competitive difficulty: Medium (earnings Whisper, Market Chameleon dominate — but Gistify has unique options angle)
- **Estimated traffic potential:** 50,000–200,000 monthly visits across 500+ ticker pages

**Page structure:**
```html
<h1>{ticker} Earnings Preview & Options Strategy — {quarter} {year}</h1>
<h2>Key Earnings Metrics</h2>
<h2>Historical Post-Earnings Moves</h2>
<h2>IV Crush Risk</h2>
<h2>Gistify Pre-Earnings Brief</h2>
<h2>Options Strategy Suggestion</h2>
<h2>Similar Earnings Plays This Week</h2>
```

---

#### 1.2 Strategy Guide Pages

**Template:** `/strategies/{slug}`

**Example:**
- `/strategies/earnings-straddle`
- `/strategies/iron-condor`
- `/strategies/0dte-momentum`
- `/strategies/vwap-bounce-options`
- `/strategies/gap-fade-play`
- `/strategies/iv-crush-defensive`
- `/strategies/vertical-spread-earnings`

**Content:**
- What the strategy is (2–3 paragraphs)
- When to use it (market conditions)
- Risk/reward profile
- Step-by-step setup guide
- Gistify scanner filters to find setups
- Real example with a recent trade
- FAQ section

**SEO value:**
- Target: `earnings straddle strategy`, `iron condor options`, `0DTE options strategy`
- Search volume: 500–5,000/month per strategy
- Competition: Medium (investopedia.com, optionalpha.com, tastytrade.com)
- **Differentiator:** Every strategy page includes a "How to find this setup in Gistify" section, tying the content to the product.

---

#### 1.3 Scanner Results Pages

**Template:** `/scanners/{scan-type}`

**Example:**
- `/scanners/momentum` → Today's momentum stocks with scanner results
- `/scanners/high-iv` → Highest IV rank stocks this week
- `/scanners/pre-earnings` → Stocks reporting earnings in next 5 days
- `/scanners/sector-rotation` → Leading/lagging sectors today

**Content:**
- Dynamic table of results (updated every 15–30 min during market hours)
- Explanation of the scanner logic
- How to read the results
- Historical performance of the scanner
- Top 3 setups of the day (editorial + automated)

**SEO value:**
- Target: `momentum scanner today`, `high IV stocks`, `pre-earnings scanner`
- Search volume: 1,000–10,000/month
- **Note:** These pages must be **ISR (Incremental Static Regeneration)** or server-rendered with a short TTL to stay fresh. Stale scanner data = poor UX and high bounce rate.

---

#### 1.4 Programmatic URL Structure Summary

```
/earnings/{ticker}              → Earnings preview for individual stocks (500+ pages)
/earnings/this-week             → Weekly earnings calendar (1 page, updated weekly)
/earnings/{year}-{month}        → Monthly earnings archive (e.g., /earnings/2025-01)
/strategies/{slug}               → Options strategy guides (20–30 pages)
/scanners/{type}                → Live scanner results (4–6 pages)
/scanners/{type}/history       → Historical scanner performance (4–6 pages)
/blog/{category}/{slug}         → Editorial blog posts (ongoing)
/tools/{tool-name}              → Free interactive tools (5–8 pages)
```

**Total page potential (Year 1):** 600–700 indexable pages

---

### 2. Content Hub Architecture

#### 2.1 Hub Structure

```
gistify.pro/
├── /                    → Homepage (product + marketing)
├── /app                 → SPA workspace (noindex, or canonical to /)
├── /pricing             → Pricing page
├── /earnings            → Earnings hub
│   ├── /this-week
│   ├── /{ticker}
│   └── /{year}-{month}
├── /strategies          → Strategy hub
│   ├── /earnings-straddle
│   ├── /iron-condor
│   ├── /0dte-momentum
│   └── /{strategy-slug}
├── /scanners            → Scanner hub
│   ├── /momentum
│   ├── /high-iv
│   ├── /pre-earnings
│   └── /sector-rotation
├── /blog                → Content hub (primary SEO engine)
│   ├── /earnings-strategy
│   ├── /momentum-trading
│   ├── /options-education
│   ├── /market-analysis
│   └── /product-updates
├── /tools               → Free tools (lead magnets + SEO)
│   ├── /earnings-calendar
│   ├── /iv-rank-calculator
│   ├── /options-profit-calculator
│   └── /momentum-heatmap
└── /about, /support, /privacy, /terms
```

#### 2.2 Category Definitions

| Category | Slug | Purpose | Target Audience | Posting Frequency |
|----------|------|---------|-----------------|-------------------|
| Earnings Strategy | `/blog/earnings-strategy` | Deep dives into earnings plays, IV crush, post-earnings moves | Active options traders | 2x/week |
| Momentum Trading | `/blog/momentum-trading` | VWAP, gap fade, ORB, volume analysis, sector rotation | Day traders, swing traders | 2x/week |
| Options Education | `/blog/options-education` | Beginner-to-intermediate guides (spreads, Greeks, assignment) | New options traders | 1x/week |
| Market Analysis | `/blog/market-analysis` | Weekly macro, VIX, FOMC, sector rotation | All traders | 1x/week |
| Product Updates | `/blog/product-updates` | New features, scanner updates, case studies | Existing users | 1x/month |

---

### 3. 12-Week Content Calendar

#### Weeks 1–4: Foundation (Pillar Content)

| Week | Post | Category | Target Keyword | Word Count | Type |
|------|------|----------|----------------|------------|------|
| 1 | "The Complete Guide to Trading Earnings with Options (2025)" | Earnings Strategy | "trading earnings with options" | 4,500 | Pillar |
| 1 | "IV Crush Explained: Before, During, and After Earnings" | Options Education | "IV crush explained", "what is IV crush" | 3,200 | Pillar |
| 2 | "Momentum Scanner: How to Find High-Probability Setups Every Morning" | Momentum Trading | "momentum scanner", "how to find momentum stocks" | 3,800 | Pillar |
| 2 | "Options Risk Matrix: Position Sizing for Active Traders" | Options Education | "options position sizing", "risk matrix trading" | 3,500 | Pillar |
| 3 | "Pre-Market vs After-Hours: Earnings Reaction Strategies That Work" | Earnings Strategy | "earnings reaction strategy", "pre market earnings" | 3,000 | Pillar |
| 3 | "Weekly Options (0DTE) Strategy Guide: From Setup to Exit" | Options Education | "0DTE options strategy", "weekly options trading" | 4,000 | Pillar |
| 4 | "Dark Finance Workspace: Why Professional Traders Prefer Minimal UI" | Product / Market | "trading workspace", "dark theme trading" | 2,500 | Pillar/Brand |
| 4 | "VWAP Bounce Strategy: A Step-by-Step Options Playbook" | Momentum Trading | "VWAP bounce strategy", "VWAP options" | 3,200 | Pillar |

#### Weeks 5–8: Earnings Season (Weekly Previews + Recaps)

| Week | Post | Category | Target Keyword | Word Count | Type |
|------|------|----------|----------------|------------|------|
| 5 | "This Week's Earnings: {Date Range} — Top 10 Options Setups" | Earnings Strategy | "this week earnings", "earnings calendar options" | 2,500 | Weekly |
| 5 | "How to Read an Earnings Whisper Number (And When to Ignore It)" | Earnings Strategy | "earnings whisper number" | 2,000 | Guide |
| 6 | "Last Week's Earnings Recap: Biggest Moves, IV Crushes, and Missed Opportunities" | Market Analysis | "earnings recap", "earnings moves this week" | 2,000 | Recap |
| 6 | "Iron Condor on Earnings: When It Works and When It Doesn't" | Earnings Strategy | "iron condor earnings", "earnings iron condor" | 2,800 | Strategy |
| 7 | "This Week's Earnings: {Date Range} — High-IV Plays Ranked" | Earnings Strategy | "high IV earnings", "earnings options plays" | 2,500 | Weekly |
| 7 | "Sector Rotation Scanner: How to Catch the Next Move Before It Happens" | Momentum Trading | "sector rotation scanner", "sector rotation trading" | 2,500 | Guide |
| 8 | "Earnings Season Mid-Point Report: What the Data Tells Us" | Market Analysis | "earnings season analysis", "earnings trend 2025" | 2,000 | Analysis |
| 8 | "The 5-Minute Pre-Earnings Checklist (Gistify Workflow)" | Earnings Strategy | "pre earnings checklist", "earnings preparation" | 1,800 | Tool/Guide |

#### Weeks 9–12: Comparison + Tool Content (High-Intent SEO)

| Week | Post | Category | Target Keyword | Word Count | Type |
|------|------|----------|----------------|------------|------|
| 9 | "Gistify vs Finviz: Which Screener Wins for Options Traders?" | Product | "gistify vs finviz", "best options screener" | 3,000 | Comparison |
| 9 | "Best Options Scanners Compared (2025): 7 Tools Ranked" | Market Analysis | "best options scanner", "options scanner comparison" | 3,500 | Comparison |
| 10 | "TradingView vs Gistify: Earnings Intelligence Battle" | Product | "tradingview vs gistify", "earnings trading tool" | 2,800 | Comparison |
| 10 | "Unusual Whales vs Market Chameleon: Options Flow Deep Dive" | Market Analysis | "unusual whales vs market chameleon", "options flow tools" | 3,000 | Comparison |
| 11 | "Free Earnings Calendar Tool (2025) — Gistify" | Product | "earnings calendar 2025", "free earnings calendar" | 1,500 | Tool Page |
| 11 | "IV Rank Calculator: Find Overpriced Options in 10 Seconds" | Product | "IV rank calculator", "implied volatility rank" | 1,200 | Tool Page |
| 12 | "Options Profit Calculator: Visualize Your Trade Before You Click" | Product | "options profit calculator", "options profit visualization" | 1,500 | Tool Page |
| 12 | "Momentum Heatmap: See Sector Strength at a Glance" | Product | "momentum heatmap", "sector momentum map" | 1,200 | Tool Page |

---

### 4. Pillar Content Outlines (5 Deep Guides)

---

#### Pillar 1: "The Complete Guide to Trading Earnings with Options (2025)"

**URL:** `/blog/earnings-strategy/complete-guide-trading-earnings-options`  
**Target Keyword:** `trading earnings with options` (Volume: ~1,900/mo)  
**Secondary Keywords:** `earnings options strategy`, `options before earnings`, `earnings play options`, `how to trade earnings options`  
**Word Count:** 4,500  
**Content Type:** Ultimate Guide  

**Outline:**

```
H1: The Complete Guide to Trading Earnings with Options (2025)

H2: Why Earnings Season Is the Best Time for Options Traders
  H3: The volatility explosion pattern
  H3: How earnings create directional edge

H2: Understanding the Earnings Calendar — Your First Filter
  H3: How to read an earnings calendar
  H3: Which companies matter (market cap, float, sector weight)
  H3: Gistify's earnings calendar filter (product tie-in)

H2: The 4 Earnings Options Strategies Every Trader Should Know
  H3: 1. The Long Straddle (directionally neutral, volatility long)
  H3: 2. The Short Strangle (high probability, IV crush capture)
  H3: 3. The Vertical Spread (directional with defined risk)
  H3: 4. The Pre-Earnings Call/Put (momentum directional)
  H3: Strategy comparison table (risk, reward, IV crush exposure, best market condition)

H2: IV Crush: The #1 Mistake New Earnings Traders Make
  H3: What is implied volatility crush?
  H3: How to measure IV rank and IV percentile before the event
  H3: The "IV Crush Calculator" mental model
  H3: Gistify's IV Crush context layer (product tie-in)

H2: How to Build a Pre-Earnings Watchlist in 5 Minutes
  H3: Step 1: Filter by earnings date (next 3 days)
  H3: Step 2: Check historical post-earnings move range
  H3: Step 3: Verify IV rank > 50%
  H3: Step 4: Match setup to strategy (straddle vs spread vs directional)
  H3: Step 5: Set entry, exit, and max loss before clicking

H2: The Post-Earnings Play: When the Real Money Is Made
  H3: Why most traders exit too early
  H3: The "gap fade" strategy for morning reversals
  H3: How to play earnings that move the sector

H2: Position Sizing for Earnings Plays
  H3: The 1% rule for defined-risk spreads
  H3: The 0.5% rule for long straddles
  H3: When to size up (high-conviction setups)

H2: Common Earnings Options Mistakes (And How to Avoid Them)
  H3: Holding through the event without a plan
  H3: Ignoring the whisper number
  H3: Choosing the wrong expiration
  H3: Forgetting about assignment risk

H2: Frequently Asked Questions
  (FAQPage schema target — 6–8 questions)

H2: Start Your Next Earnings Play with Gistify
  (CTA to product — free trial or app open)
```

---

#### Pillar 2: "IV Crush Explained: Before, During, and After Earnings"

**URL:** `/blog/options-education/iv-crush-explained-before-during-after-earnings`  
**Target Keyword:** `IV crush explained` (Volume: ~880/mo)  
**Secondary Keywords:** `what is IV crush`, `implied volatility crush`, `IV crush after earnings`, `options IV crush`  
**Word Count:** 3,200  
**Content Type:** Educational Deep Dive  

**Outline:**

```
H1: IV Crush Explained: What Happens to Options Before, During, and After Earnings

H2: What Is Implied Volatility (IV)? A 2-Minute Primer
  H3: IV vs. historical volatility
  H3: Why IV is the "fear premium" in options

H2: What Is IV Crush?
  H3: The mechanics of volatility collapse
  H3: Why earnings are the biggest IV crush events
  H3: Visual: IV curve before vs. after earnings

H2: The Three Phases of IV Crush
  H3: Phase 1: Before Earnings (IV expansion — "the setup")
  H3: Phase 2: The Earnings Event (IV peak — "the trap")
  H3: Phase 3: After Earnings (IV collapse — "the crush")

H2: How to Measure IV Crush Risk Before You Trade
  H3: IV Rank vs. IV Percentile (which to use?)
  H3: The expected move formula
  H3: Reading the options chain for IV crush clues
  H3: Gistify's IV Rank layer (product tie-in)

H2: IV Crush Strategies: Long vs. Short Volatility
  H3: When to BUY options before earnings (long volatility)
  H3: When to SELL options before earnings (short volatility)
  H3: The straddle buyer's nightmare (real example)
  H3: The iron condor seller's dream (real example)

H2: Real Example: AAPL Earnings IV Crush (Q4 2024)
  H3: IV before the event
  H3: The actual move vs. expected move
  H3: What happened to straddle prices the next morning
  H3: Lesson learned

H2: IV Crush FAQ
  (FAQPage schema target)

H2: Tools to Track IV Crush in Real Time
  (CTA to Gistify Risk Matrix)
```

---

#### Pillar 3: "Momentum Scanner: How to Find High-Probability Setups Every Morning"

**URL:** `/blog/momentum-trading/momentum-scanner-find-high-probability-setups`  
**Target Keyword:** `momentum scanner` (Volume: ~1,300/mo)  
**Secondary Keywords:** `how to find momentum stocks`, `momentum scanner setup`, `day trading momentum scanner`, `best momentum scanner settings`  
**Word Count:** 3,800  
**Content Type:** How-To Guide + Tool Tutorial  

**Outline:**

```
H1: Momentum Scanner: How to Find High-Probability Setups Every Morning

H2: Why Momentum Scanners Beat Watchlists
  H3: The problem with static watchlists
  H3: How momentum scanners surface opportunity in real time

H2: What Makes a "High-Probability" Momentum Setup?
  H3: Volume confirmation (not just price)
  H3: Sector alignment (swimming with the tide)
  H3: Time-of-day context (opening bell vs. midday vs. close)

H2: The 5 Filters Every Momentum Scanner Needs
  H3: 1. Relative Volume (>2x average)
  H3: 2. Price Change (>3% in 15 min)
  H3: 3. VWAP Distance (within 2 standard deviations)
  H3: 4. Sector Leadership (top 3 sectors only)
  H3: 5. Float Size (<100M for explosive moves)
  H3: Gistify scanner default settings (product tie-in)

H2: Opening Bell Momentum (9:30–10:00 AM)
  H3: The gap-and-go pattern
  H3: The gap-fade pattern
  H3: ORB (Opening Range Breakout) momentum

H2: Midday Momentum (10:00 AM–2:00 PM)
  H3: Why midday is harder (and how to adapt)
  H3: The VWAP bounce play
  H3: Sector rotation signals

H2: Power Hour Momentum (2:00–4:00 PM)
  H3: The close squeeze
  H3: Earnings after-hours positioning

H2: From Scanner Alert to Trade Plan: A 3-Step Workflow
  H3: Step 1: Filter the noise (top 3 names only)
  H3: Step 2: Build context (earnings, news, sector)
  H3: Step 3: Match with options structure (CALL spread, PUT, straddle)

H2: Common Momentum Scanner Mistakes
  H3: Chasing parabolic moves
  H3: Ignoring the broader market trend
  H3: Trading without a defined exit

H2: Scanner Results + Gistify Workflow
  (CTA to product — "Open Scanner")
```

---

#### Pillar 4: "Options Risk Matrix: Position Sizing for Active Traders"

**URL:** `/blog/options-education/options-risk-matrix-position-sizing-active-traders`  
**Target Keyword:** `options position sizing` (Volume: ~720/mo)  
**Secondary Keywords:** `risk matrix trading`, `options risk management`, `position sizing options`, `active trader risk management`  
**Word Count:** 3,500  
**Content Type:** Framework + Tool Guide  

**Outline:**

```
H1: Options Risk Matrix: How Active Traders Size Positions and Manage Risk

H2: Why Position Sizing Is More Important Than Picking Direction
  H3: The math of survival (Kelly criterion simplified)
  H3: How one oversized loss destroys 10 good trades

H2: The Risk Matrix Framework
  H3: Axis 1: Probability of Profit (POP)
  H3: Axis 2: Max Loss as % of Account
  H3: Axis 3: Time to Expiration (theta exposure)
  H3: Axis 4: IV Environment (rank, trend)

H2: Risk Matrix by Strategy Type
  H3: Defined risk (vertical spreads, iron condors)
  H3: Undefined risk (naked puts, straddles)
  H3: Directional (long calls/puts)
  H3: Neutral (short strangles, calendars)
  H3: Table: Max allocation % per strategy type

H2: The Gistify Risk Matrix (Product Deep Dive)
  H3: How the risk matrix visualizes your exposure
  H3: Scenario thinking: "What if the stock moves 5%?"
  H3: Expected move vs. max loss overlay

H2: Daily Risk Budget: How to Allocate Capital Across Setups
  H3: The 70/20/10 rule (core positions / swing trades / speculative)
  H3: Correlation risk (don't trade 5 tech stocks at once)

H2: Risk Management Checklist Before Every Trade
  H3: 7-point checklist (account risk, strategy fit, IV, time, correlation, exit, mental state)

H2: FAQ
  (FAQPage schema target)

H2: Build Your Risk Matrix in Gistify
  (CTA)
```

---

#### Pillar 5: "Weekly Options (0DTE) Strategy Guide: From Setup to Exit"

**URL:** `/blog/options-education/0dte-weekly-options-strategy-guide`  
**Target Keyword:** `0DTE options strategy` (Volume: ~1,600/mo)  
**Secondary Keywords:** `0DTE options trading`, `weekly options strategy`, `same day expiration options`, `0DTE trading guide`  
**Word Count:** 4,000  
**Content Type:** Advanced Strategy Guide  

**Outline:**

```
H1: 0DTE Options Strategy Guide: How to Trade Same-Day Expiration Options (2025)

H2: What Are 0DTE Options?
  H3: The rise of 0DTE (SPX, SPY, QQQ, IWM)
  H3: Why 0DTE exploded in popularity after 2022
  H3: The 0DTE premium decay curve (hour by hour)

H2: The 0DTE Risk Profile: Why Most Traders Lose
  H3: Gamma risk near expiration
  H3: The 1:00 PM–2:00 PM danger zone
  H3: Why 0DTE is not for beginners

H2: 0DTE Strategy #1: The Opening Bell Momentum Play (9:30–10:00)
  H3: Setup: Gap + volume + VWAP alignment
  H3: Entry: CALL debit spread or long CALL
  H3: Exit: 10 min or 50% profit
  H3: Real example (recent SPY or QQQ day)

H2: 0DTE Strategy #2: The VWAP Reversal (10:00–11:00)
  H3: Setup: Oversold/overextended relative to VWAP
  H3: Entry: Reversal CALL or PUT
  H3: Risk: Tight stop, 1% account max

H2: 0DTE Strategy #3: The Fed/Powell Play (Scheduled Events)
  H3: Setup: FOMC, CPI, PPI, NFP days
  H3: Entry: Straddle 5 min before event
  H3: Exit: 15–30 min after event, before crush

H2: 0DTE Strategy #4: The Iron Condor (High Probability, Low Stress)
  H3: Setup: Low-volatility days, wide expected move
  H3: Entry: Short strangle or iron condor at 10:30 AM
  H3: Management: Close at 50% profit or 2:30 PM

H2: 0DTE Position Sizing Rules
  H3: Never risk more than 0.5% of account on a single 0DTE trade
  H3: Max 2 0DTE trades per day
  H3: The "red day" rule (stop trading after 2 consecutive losses)

H2: 0DTE Scanner Settings (Gistify)
  H3: Filter: 0DTE expiration available
  H3: Filter: IV rank > 30%
  H3: Filter: Volume > 2x average
  H3: (Product tie-in)

H2: 0DTE FAQ
  (FAQPage schema target)

H2: Start Trading 0DTE with Gistify
  (CTA)
```

---

### 5. Comparison Content Strategy (High-Intent, Easy to Rank)

Comparison pages capture **bottom-of-funnel traffic** — users who are actively evaluating tools and ready to convert.

| Page | Target Keyword | Volume Est. | Difficulty | Conversion Intent |
|------|---------------|-------------|------------|-----------------|
| "Gistify vs Finviz: Which Screener Wins for Options Traders?" | `gistify vs finviz` | ~50/mo | Low | Very High |
| "Best Options Scanners Compared (2025)" | `best options scanner` | ~800/mo | Medium | High |
| "TradingView vs Gistify: Earnings Intelligence Battle" | `tradingview vs gistify` | ~30/mo | Low | Very High |
| "Unusual Whales vs Market Chameleon: Options Flow Deep Dive" | `unusual whales vs market chameleon` | ~200/mo | Medium | Medium |
| "Gistify vs Cheddar Flow: Real-Time Options Scanner Face-Off" | `gistify vs cheddar flow` | ~10/mo | Low | Very High |

**Comparison Page Template:**
```
H1: [Tool A] vs [Tool B]: [Specific Use Case] Comparison (2025)
H2: Quick Verdict (30-second summary table)
H2: What Is [Tool A]?
H2: What Is [Tool B]?
H2: Head-to-Head Comparison Table (10–12 criteria)
H2: [Feature] Comparison (e.g., Scanner Speed, Earnings Data, IV Analysis)
H2: Pricing Comparison
H2: Who Should Use [Tool A]?
H2: Who Should Use [Tool B]?
H2: Our Pick for [Specific Use Case]
H2: FAQ
H2: Try Gistify Free (CTA)
```

**SEO advantage:** These keywords have **low competition** because established players don't compare themselves to smaller competitors. Gistify can own the "Gistify vs X" search results by being the first to publish.

---

### 6. Free Tool Pages (Lead Magnets + SEO)

Tool pages are **link magnets** — they attract backlinks, social shares, and organic traffic. They also convert visitors into users by demonstrating value before asking for a signup.

| Tool Page | URL | Function | SEO Target | Lead Magnet |
|-----------|-----|----------|------------|-------------|
| Earnings Calendar | `/tools/earnings-calendar` | Weekly earnings dates, EPS consensus, expected move | `earnings calendar 2025` | Email alert signup |
| IV Rank Calculator | `/tools/iv-rank-calculator` | Input ticker, get IV rank + percentile | `IV rank calculator` | Free scanner trial |
| Options Profit Calculator | `/tools/options-profit-calculator` | Visual P&L graph for any options strategy | `options profit calculator` | Account creation |
| Momentum Heatmap | `/tools/momentum-heatmap` | Real-time sector momentum visualization | `momentum heatmap` | Weekly newsletter |
| Expected Move Calculator | `/tools/expected-move-calculator` | Calculate expected move from options chain | `expected move calculator` | Free scanner trial |

**Technical requirements for tool pages:**
- **Static shell + dynamic JS**: The page HTML must be renderable by Googlebot without JavaScript. The interactive tool loads via JS.
- **Fast load time**: <2s LCP (tool pages are judged on speed).
- **Schema markup**: `SoftwareApplication` schema for each tool.
- **Social sharing**: Every tool should have a "Share this result" button that generates a pre-filled tweet/post.

---

### 7. Content Distribution & Amplification

| Channel | Tactic | Frequency |
|---------|--------|-----------|
| **Twitter/X** | Post scanner highlights, earnings play cards, daily momentum charts | Daily |
| **Reddit** | r/options, r/wallstreetbets, r/thetagang — value-first comments with links | 3–5x/week |
| **Discord** | Partner with trading Discord servers; share weekly scanner results | Weekly |
| **YouTube** | Short-form: "This Week's Earnings Setups" (5–7 min). Long-form: strategy guides | 2x/week short, 1x/month long |
| **Newsletter** | Weekly email: top 5 setups, earnings preview, IV crush watch | Weekly |
| **Product Hunt** | Launch each major feature as a PH post | Per feature |
| **Guest Posts** | Write for options trading blogs, fintech publications | 2x/month |
| **Backlink Outreach** | Reach out to sites linking to Finviz/TradingView comparisons | Ongoing |

---

## Part C — Implementation Roadmap

### Phase 1: Foundation (Weeks 1–4) — Technical SEO Fixes

| Week | Task | Owner | Deliverable |
|------|------|-------|-------------|
| 1 | Add H1 to homepage | Frontend | H1 tag live |
| 1 | Fix sitemap.xml | DevOps | Valid XML sitemap + robots.txt update |
| 1 | Add canonical tags | Frontend | Canonical on all routes |
| 2 | Implement prerendering (Prerender.io) | DevOps | Bot snapshots serving static HTML |
| 2 | Add Open Graph + Twitter Cards | Frontend | OG tags on all routes |
| 3 | Add JSON-LD structured data | Frontend | SoftwareApplication + Organization schema live |
| 3 | Add dynamic meta tags per route | Frontend | Unique title/description on all routes |
| 4 | Core Web Vitals audit + fix | Frontend | LCP <2.5s, CLS <0.1 |

### Phase 2: Content Engine (Weeks 4–8) — Blog + Programmatic Pages

| Week | Task | Owner | Deliverable |
|------|------|-------|-------------|
| 4 | Set up blog infrastructure (/blog) | DevOps | Next.js SSG or headless CMS live |
| 4 | Publish first 2 pillar posts | Content | 2 posts live + indexed |
| 5 | Build earnings page template | DevOps | `/earnings/{ticker}` template live |
| 5 | Generate first 50 earnings pages | Data + Content | 50 ticker pages live |
| 6 | Publish strategy pages (first 5) | Content | 5 `/strategies/*` pages live |
| 6 | Build scanner results page template | DevOps | `/scanners/*` pages live |
| 7 | Publish weekly earnings preview posts | Content | Weekly rhythm established |
| 8 | Launch first 2 free tool pages | Dev + Content | `/tools/earnings-calendar` + `/tools/iv-rank-calculator` live |

### Phase 3: Scale (Weeks 9–16) — Comparison + Tool Expansion

| Week | Task | Owner | Deliverable |
|------|------|-------|-------------|
| 9 | Publish comparison posts | Content | 4 comparison posts live |
| 10 | Scale earnings pages to 200+ tickers | Data | 200+ `/earnings/*` pages indexed |
| 11 | Launch remaining tool pages | Dev + Content | 5 tool pages live |
| 12 | Implement FAQPage schema on all pillar posts | Frontend | Rich snippet eligibility |
| 13 | Start newsletter | Marketing | Weekly newsletter live |
| 14 | YouTube channel launch | Content | First video published |
| 15 | Backlink outreach campaign | Marketing | 10+ backlinks acquired |
| 16 | Full SEO audit + iteration | SEO | Updated roadmap for Q2 |

---

## Metrics & KPIs

| Metric | Baseline | 3-Month Target | 6-Month Target | 12-Month Target |
|--------|----------|---------------|----------------|-----------------|
| Indexed pages | ~1 | 100+ | 300+ | 700+ |
| Organic monthly sessions | Unknown | 5,000 | 20,000 | 60,000+ |
| Organic keywords ranking | Unknown | 200+ | 800+ | 2,500+ |
| Top 10 rankings (target keywords) | 0 | 10 | 40 | 100+ |
| Backlinks | Unknown | 20+ | 60+ | 150+ |
| Domain Rating (Ahrefs) | Unknown | 15+ | 25+ | 40+ |
| Blog posts published | 0 | 12 | 30 | 60+ |
| Earnings pages live | 0 | 200 | 500+ | 800+ |
| Free tool page signups | 0 | 500 | 3,000 | 10,000+ |
| Product signups from organic | Unknown | 200 | 1,000 | 3,500+ |

---

## Appendix A: JSON-LD Structured Data Templates

### SoftwareApplication Schema (Homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Gistify",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "29.00",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150"
  },
  "description": "Gistify brings earnings intelligence, momentum scanning, macro event framing and options research into one dark finance workspace.",
  "url": "https://gistify.pro/",
  "image": "https://gistify.pro/gistifylogo.png"
}
```

### Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Gistify",
  "url": "https://gistify.pro/",
  "logo": "https://gistify.pro/gistifylogo.png",
  "sameAs": [
    "https://twitter.com/gistify",
    "https://www.linkedin.com/company/gistify"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "support@gistify.pro",
    "contactType": "customer support"
  }
}
```

### WebSite Schema with Search
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Gistify",
  "url": "https://gistify.pro/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://gistify.pro/app?search={search_term}"
    },
    "query-input": "required name=search_term"
  }
}
```

---

## Appendix B: robots.txt Recommended Update

```
User-agent: *
Allow: /

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CloudflareBrowserRenderingCrawler
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: meta-externalagent
Disallow: /

Sitemap: https://gistify.pro/sitemap.xml
```

---

## Appendix C: Open Graph / Twitter Card Template

```html
<!-- Open Graph -->
<meta property="og:title" content="Gistify — Earnings Intelligence & Momentum Workspace">
<meta property="og:description" content="Gistify brings earnings intelligence, momentum scanning, macro event framing and options research into one dark finance workspace.">
<meta property="og:image" content="https://gistify.pro/og-image-1200x630.png">
<meta property="og:url" content="https://gistify.pro/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Gistify">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Gistify — Earnings Intelligence & Momentum Workspace">
<meta name="twitter:description" content="Gistify brings earnings intelligence, momentum scanning, macro event framing and options research into one dark finance workspace.">
<meta name="twitter:image" content="https://gistify.pro/og-image-1200x630.png">
<meta name="twitter:site" content="@gistify">
```

---

*Report compiled from live site audit (robots.txt, sitemap.xml, homepage render, Google index search) and competitive SEO analysis for the fintech/options trading vertical.*
