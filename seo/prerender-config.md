# Prerender.io / Cloudflare Worker Configuration Guide for Gistify.pro

> Step-by-step guide for implementing dynamic prerendering for the Gistify SPA so search engines and social bots can crawl fully rendered HTML.

---

## Problem Statement

React SPAs serve a nearly empty `index.html` on initial load. JavaScript renders the page in the browser. Search engine crawlers (Googlebot, Bingbot, social scrapers like Facebook/Twitter/LinkedIn) may not execute JavaScript fully, resulting in:

- Blank or incomplete search snippets
- Missing Open Graph / Twitter Card previews on social shares
- Poor SEO indexing for dynamic routes (`/earnings/AAPL`, `/blog/...`)

**Solution:** Serve prerendered HTML to bots, the SPA to humans.

---

## Option 1: Prerender.io (Easiest — Paid, $80–150/mo)

Prerender.io is a hosted service that caches fully rendered HTML pages and serves them to crawlers. Best for teams that want zero infrastructure management.

### 1. Sign Up & Get Token

1. Go to [https://prerender.io](https://prerender.io)
2. Create an account and add `gistify.pro` as your domain
3. Copy your **Prerender Token** from the dashboard

### 2. Install Middleware (Node.js / Express)

```bash
npm install prerender-node
```

```javascript
// server/prerender.js
const prerender = require('prerender-node');

function setupPrerender(app) {
  // Configure prerender middleware
  app.use(
    prerender
      .set('prerenderToken', 'YOUR_PRERENDER_TOKEN_HERE')
      .set('protocol', 'https')
      .set('host', 'gistify.pro')
      .set('prerenderServiceUrl', 'https://service.prerender.io')
      // Whitelist: only prerender these route patterns
      .whitelist([
        '^/$',                          // homepage
        '^/pricing$',                    // pricing
        '^/blog/',                       // all blog routes
        '^/tools/',                      // all tool pages
        '^/earnings/',                   // all earnings pages
        '^/strategies/',                 // all strategy pages
        '^/faq$',                        // FAQ
        '^/contact$',                    // contact
      ])
      // Blacklist: never prerender these
      .blacklist([
        '^/app',                         // private dashboard
        '^/account',                     // user account
        '^/settings',                    // settings
        '^/api/',                        // API routes
        '^/auth/',                       // auth routes
      ])
  );
}

module.exports = { setupPrerender };
```

### 3. Wire into Express Server

```javascript
// server/index.js
const express = require('express');
const path = require('path');
const { setupPrerender } = require('./prerender');
const sitemapRoute = require('./sitemap');

const app = express();

// 1. Prerender middleware (must be BEFORE static serving)
setupPrerender(app);

// 2. Sitemap route (before static fallback)
app.use('/', sitemapRoute);

// 3. Serve static SPA files
app.use(express.static(path.join(__dirname, 'dist')));

// 4. SPA fallback for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gistify server running on port ${PORT}`);
});
```

### 4. How It Works

1. A bot visits `https://gistify.pro/earnings/AAPL`
2. The Prerender middleware detects the bot User-Agent
3. It forwards the request to `https://service.prerender.io/https://gistify.pro/earnings/AAPL`
4. Prerender.io renders the page (headless Chrome), caches the HTML
5. The cached HTML is returned to the bot
6. A human visiting the same URL bypasses prerender and gets the normal SPA

### 5. Prerender.io Pricing Tiers

| Plan | Cache Size | Price | Best For |
|------|-----------|-------|----------|
| Free | 250 pages | Free | Testing, small sites |
| Accelerated | 5,000 pages | ~$80/mo | Early-stage startups |
| Scale | 25,000 pages | ~$150/mo | Growing sites with many dynamic routes |
| Enterprise | Custom | Custom | High-traffic sites |

---

## Option 2: Cloudflare Worker (Free — More Control)

A Cloudflare Worker sits at the edge and decides: **bot → prerendered HTML**, **human → SPA**. This is completely free on Cloudflare's free tier (100k requests/day).

### 1. Worker Script

Deploy this script in your Cloudflare Workers dashboard (or via Wrangler CLI).

```javascript
// worker.js — Cloudflare Worker for SPA prerendering
/**
 * Gistify.pro Prerender Worker
 * 
 * Intercepts requests and serves prerendered HTML to known crawlers,
 * while passing through the SPA to regular users.
 */

// === Configuration ===
const CONFIG = {
  // Your origin server (where the SPA is hosted)
  ORIGIN_URL: 'https://gistify.pro',
  
  // Prerender service endpoint (Rendertron or your own)
  PRERENDER_URL: 'https://rendertron.your-server.com', // or your Rendertron instance
  
  // Token if using Prerender.io service directly
  PRERENDER_TOKEN: 'YOUR_PRERENDER_TOKEN_HERE',
  
  // Use prerender.io service directly (set to true if using Prerender.io)
  USE_PRERENDER_IO: false,
};

// === Bot User-Agent list ===
// Source: https://github.com/prerender/prerender/blob/master/lib/bots.js
const CRAWLER_USER_AGENTS = [
  'googlebot',
  'googlebot-news',
  'googlebot-image',
  'googlebot-video',
  'bingbot',
  'bingpreview',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'slackbot',
  'discordbot',
  'applebot',
  'mediapartners-google',
  'adsbot-google',
  'ahrefsbot',
  'semrushbot',
  'rogerbot',
  'dotbot',
  'megaindex',
  'pingdom',
  'bot',
  'crawler',
  'spider',
  'scraper',
  'prerender',
  'prerender.io',
  'chrome-lighthouse',
  'gtmetrix',
  'pagespeed',
  'webpagetest',
];

// === Route blacklist (never prerender) ===
const BLACKLISTED_ROUTES = [
  '/app',
  '/account',
  '/settings',
  '/api/',
  '/auth/',
  '/_next/',
  '/static/',
  '/assets/',
  '/favicon',
  '/robots.txt',
  '/sitemap',
];

// === Route whitelist (only prerender these) ===
const WHITELISTED_ROUTES = [
  '/',
  '/pricing',
  '/blog',
  '/tools',
  '/earnings',
  '/strategies',
  '/faq',
  '/contact',
  '/privacy',
  '/terms',
];

function isBotRequest(request) {
  const userAgent = (request.headers.get('User-Agent') || '').toLowerCase();
  return CRAWLER_USER_AGENTS.some((bot) => userAgent.includes(bot));
}

function isBlacklisted(url) {
  const pathname = new URL(url).pathname;
  return BLACKLISTED_ROUTES.some((route) => pathname.startsWith(route));
}

function isWhitelisted(url) {
  const pathname = new URL(url).pathname;
  // Always allow root
  if (pathname === '/') return true;
  // Check whitelist prefixes
  return WHITELISTED_ROUTES.some((route) => pathname.startsWith(route));
}

function shouldPrerender(request) {
  const url = request.url;

  // Only GET requests
  if (request.method !== 'GET') return false;

  // Skip blacklisted routes
  if (isBlacklisted(url)) return false;

  // Check if it's a bot
  if (!isBotRequest(request)) return false;

  // Check whitelist
  if (!isWhitelisted(url)) return false;

  return true;
}

async function fetchPrerendered(url) {
  if (CONFIG.USE_PRERENDER_IO) {
    // Use Prerender.io service
    const prerenderUrl = `https://service.prerender.io/${url}`;
    const response = await fetch(prerenderUrl, {
      headers: {
        'X-Prerender-Token': CONFIG.PRERENDER_TOKEN,
      },
    });
    return response;
  } else {
    // Use self-hosted Rendertron or similar
    const encodedUrl = encodeURIComponent(url);
    const prerenderUrl = `${CONFIG.PRERENDER_URL}/render/${encodedUrl}`;
    const response = await fetch(prerenderUrl);
    return response;
  }
}

async function handleRequest(request) {
  const url = request.url;

  // Determine if we should prerender
  if (shouldPrerender(request)) {
    console.log(`[Prerender] Bot detected, serving prerendered: ${url}`);

    try {
      const prerenderResponse = await fetchPrerendered(url);

      if (prerenderResponse.status === 200) {
        // Clone response and add headers
        const response = new Response(prerenderResponse.body, {
          status: prerenderResponse.status,
          statusText: prerenderResponse.statusText,
          headers: prerenderResponse.headers,
        });

        // Add cache headers for prerendered responses
        response.headers.set('Cache-Control', 'public, max-age=3600');
        response.headers.set('X-Prerendered', 'true');
        response.headers.set('X-Prerendered-By', 'cloudflare-worker');

        return response;
      }
    } catch (error) {
      console.error(`[Prerender] Error for ${url}:`, error);
    }

    // Fallback to origin if prerender fails
    console.log(`[Prerender] Fallback to origin: ${url}`);
  }

  // Pass through to origin (SPA)
  const originResponse = await fetch(request);
  return originResponse;
}

// Cloudflare Worker event listener
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
```

### 2. Deploy via Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create worker project
wrangler init gistify-prerender

# Paste the worker.js script into src/index.js
# Update wrangler.toml:
```

```toml
# wrangler.toml
name = "gistify-prerender"
main = "src/index.js"
compatibility_date = "2025-07-28"

[env.production]
vars = { ORIGIN_URL = "https://gistify.pro", USE_PRERENDER_IO = "false" }

# Secrets (set via wrangler secret put)
# PRERENDER_TOKEN = "your-token"
```

```bash
# Set secrets
wrangler secret put PRERENDER_TOKEN

# Deploy
wrangler deploy
```

### 3. Route Configuration in Cloudflare Dashboard

1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **Your Worker**
2. Click **Triggers** → **Add Custom Domain**
3. Add routes to intercept:
   - `gistify.pro/*`
   - `www.gistify.pro/*`
4. Set **Priority** to run before other rules

### 4. How It Works

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Request   │────▶│ Cloudflare Edge │────▶│ Worker checks UA  │
│  (Bot/Human)│     │   (Worker)      │     │                  │
└─────────────┘     └─────────────────┘     └──────────────────┘
                                                      │
                              ┌─────────────┬─────────┘
                              │             │
                         Bot detected    Human detected
                              │             │
                              ▼             ▼
                    ┌──────────────┐  ┌──────────────┐
                    │ Fetch from   │  │ Pass through │
                    │ Rendertron/  │  │ to origin    │
                    │ Prerender.io │  │ (SPA)        │
                    └──────────────┘  └──────────────┘
```

---

## Option 3: Rendertron (Self-Hosted — Free)

Rendertron is an open-source headless Chrome rendering service from Google. You host it yourself (Docker) and point your middleware/Worker to it.

### 1. Docker Setup

```dockerfile
# Dockerfile.rendertron
FROM node:20-slim

# Install Chrome dependencies
RUN apt-get update && apt-get install -y \
  wget \
  gnupg \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  xdg-utils \
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Clone and install Rendertron
RUN git clone https://github.com/GoogleChrome/rendertron.git . && \
  npm install && \
  npm run build

# Expose Rendertron port
EXPOSE 3000

CMD ["npm", "run", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  rendertron:
    build:
      context: .
      dockerfile: Dockerfile.rendertron
    container_name: gistify-rendertron
    ports:
      - "3001:3000"
    restart: unless-stopped
    environment:
      - CACHE_TTL=3600
      - RENDER_TIMEOUT=10000
      - CLOSE_BROWSER=true
    # Memory limit for headless Chrome
    deploy:
      resources:
        limits:
          memory: 2G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/render/https://gistify.pro/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  # Optional: Redis cache for Rendertron
  redis:
    image: redis:7-alpine
    container_name: gistify-rendertron-redis
    ports:
      - "6379:6379"
    restart: unless-stopped
```

```bash
# Build and run
docker-compose up -d rendertron

# Verify it's working
curl http://localhost:3001/render/https://gistify.pro/earnings/AAPL
```

### 2. Rendertron Configuration (`config.json`)

```json
{
  "cache": "memory",
  "cacheConfig": {
    "cacheDurationMinutes": 360,
    "cacheMaxEntries": 1000
  },
  "timeout": 10000,
  "renderOnly": [
    "https://gistify.pro/"
  ],
  "closeBrowser": true,
  "restrictedUrlPattern": "^(?!https://gistify\\.pro/).*$"
}
```

### 3. Middleware to Use Rendertron (Express)

```javascript
// server/rendertron-middleware.js
const express = require('express');

const RENDERTRON_URL = process.env.RENDERTRON_URL || 'http://localhost:3001';

// Bot user agents
const BOT_AGENTS = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'slackbot',
  'discordbot',
];

function isBot(req) {
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  return BOT_AGENTS.some((bot) => userAgent.includes(bot));
}

function rendertronMiddleware(req, res, next) {
  // Only prerender GET requests to whitelisted paths
  if (req.method !== 'GET') return next();
  
  const path = req.path;
  
  // Blacklist private routes
  if (
    path.startsWith('/app') ||
    path.startsWith('/account') ||
    path.startsWith('/api/') ||
    path.startsWith('/auth/') ||
    path.startsWith('/_next/') ||
    path.startsWith('/static/')
  ) {
    return next();
  }

  // Only prerender for bots
  if (!isBot(req)) return next();

  const targetUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const renderUrl = `${RENDERTRON_URL}/render/${encodeURIComponent(targetUrl)}`;

  console.log(`[Rendertron] Prerendering for bot: ${targetUrl}`);

  fetch(renderUrl, {
    headers: {
      'Accept': 'text/html',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Rendertron returned ${response.status}`);
      }
      return response.text();
    })
    .then((html) => {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('X-Prerendered', 'true');
      res.setHeader('X-Prerendered-By', 'rendertron');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.send(html);
    })
    .catch((error) => {
      console.error('[Rendertron] Error:', error.message);
      // Fallback to normal SPA
      next();
    });
}

module.exports = { rendertronMiddleware };
```

### 4. Wire into Express Server

```javascript
// server/index.js
const express = require('express');
const path = require('path');
const { rendertronMiddleware } = require('./rendertron-middleware');
const sitemapRoute = require('./sitemap');

const app = express();

// 1. Rendertron prerender middleware (MUST be first)
app.use(rendertronMiddleware);

// 2. Sitemap route
app.use('/', sitemapRoute);

// 3. Static SPA files
app.use(express.static(path.join(__dirname, 'dist')));

// 4. SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Comparison Table

| Criteria | Prerender.io | Cloudflare Worker | Rendertron (Self-Hosted) |
|----------|-------------|-------------------|--------------------------|
| **Cost** | $80–150/mo | Free (100k req/day) | Free (server cost only) |
| **Setup** | 5 minutes | 30 minutes | 1–2 hours |
| **Infrastructure** | None | None (Cloudflare edge) | Docker server required |
| **Control** | Low (managed) | High | High |
| **Caching** | Managed by Prerender.io | Cloudflare cache | Memory/Redis cache |
| **Scalability** | Automatic | 100k/day free | Depends on server specs |
| **Maintenance** | None | Minimal | OS + Chrome updates |
| **Best For** | Quick setup, teams without DevOps | Free tier, edge control | Full control, large scale |

---

## Recommended Architecture for Gistify

For a production Gistify setup, a **hybrid approach** is recommended:

```
┌─────────────────────────────────────────────────────────────┐
│                     Cloudflare Edge                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Cloudflare Worker (bot detection + routing)        │   │
│  │  • Human → Pass to origin SPA                       │   │
│  │  • Bot → Fetch from Prerender.io / Rendertron       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
      ┌──────────┐   ┌──────────────┐   ┌──────────────┐
      │  Origin  │   │  Prerender.io│   │  Rendertron  │
      │  (SPA)   │   │  (Fallback)  │   │  (Primary)   │
      │          │   │              │   │  (Docker)    │
      └──────────┘   └──────────────┘   └──────────────┘
```

**Phase 1 (Launch):** Use Prerender.io for simplicity.

**Phase 2 (Scale):** Add a Cloudflare Worker in front. Use Rendertron as primary, with Prerender.io as fallback.

**Phase 3 (Optimize):** Build a custom prerender cache with Redis, invalidate on content updates.

---

## Verification Checklist

After implementing any prerender solution, verify with these tools:

1. **Google Rich Results Test**: [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)
2. **Facebook Sharing Debugger**: [https://developers.facebook.com/tools/debug/](https://developers.facebook.com/tools/debug/)
3. **Twitter Card Validator**: [https://cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator)
4. **LinkedIn Post Inspector**: [https://www.linkedin.com/post-inspector/](https://www.linkedin.com/post-inspector/)
5. **Google Search Console** → URL Inspection → Live Test → View Crawled Page

```bash
# Quick curl test for bot detection
curl -A "Googlebot/2.1 (+http://www.google.com/bot.html)" https://gistify.pro/earnings/AAPL

# Check response headers
# Look for: X-Prerendered: true
```
