# Dynamic Sitemap.xml Template for Gistify.pro

> Complete sitemap solution for a React SPA with dynamic routes. Includes a static example and a dynamic generation approach.

---

## 1. Static Sitemap.xml (Reference Example)

Save this as `public/sitemap.xml` or serve it from your CDN for basic coverage.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Homepage -->
  <url>
    <loc>https://gistify.pro/</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- App entry (noindex, but included for completeness) -->
  <url>
    <loc>https://gistify.pro/app</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Pricing -->
  <url>
    <loc>https://gistify.pro/pricing</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Blog index -->
  <url>
    <loc>https://gistify.pro/blog</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Blog posts -->
  <url>
    <loc>https://gistify.pro/blog/earnings-strategy/aapl-q3-2025</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://gistify.pro/blog/earnings-strategy/tsla-q2-2025</loc>
    <lastmod>2025-07-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://gistify.pro/blog/momentum-scanning/midas-v4-launch</loc>
    <lastmod>2025-07-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://gistify.pro/blog/macro-events/cpi-july-2025-trade-setup</loc>
    <lastmod>2025-07-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://gistify.pro/blog/options-education/iv-rank-explained</loc>
    <lastmod>2025-07-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Tool pages -->
  <url>
    <loc>https://gistify.pro/tools/iv-rank-calculator</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://gistify.pro/tools/cpr-calculator</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://gistify.pro/tools/expected-move-calculator</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://gistify.pro/tools/position-size-calculator</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Earnings pages -->
  <url>
    <loc>https://gistify.pro/earnings/AAPL</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://gistify.pro/earnings/TSLA</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://gistify.pro/earnings/NVDA</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://gistify.pro/earnings/META</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://gistify.pro/earnings/AMZN</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://gistify.pro/earnings/GOOGL</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://gistify.pro/earnings/MSFT</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://gistify.pro/earnings/NFLX</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://gistify.pro/earnings/AMD</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://gistify.pro/earnings/CRM</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Strategy pages -->
  <url>
    <loc>https://gistify.pro/strategies/momentum</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://gistify.pro/strategies/mean-reversion</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://gistify.pro/strategies/earnings-plays</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://gistify.pro/strategies/gap-fade</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://gistify.pro/strategies/vwap-bounce</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Help / FAQ -->
  <url>
    <loc>https://gistify.pro/faq</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://gistify.pro/contact</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://gistify.pro/privacy</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://gistify.pro/terms</loc>
    <lastmod>2025-07-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

---

## 2. Dynamic Sitemap Generation (Node.js / Express API Route)

This approach generates the sitemap on-demand from a database/CMS.

### `server/sitemap.js` — Express Route

```javascript
// server/sitemap.js
const express = require('express');
const router = express.Router();

// Static routes that always exist
const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/pricing', priority: 0.9, changefreq: 'weekly' },
  { path: '/blog', priority: 0.8, changefreq: 'daily' },
  { path: '/tools/iv-rank-calculator', priority: 0.8, changefreq: 'weekly' },
  { path: '/tools/cpr-calculator', priority: 0.8, changefreq: 'weekly' },
  { path: '/tools/expected-move-calculator', priority: 0.8, changefreq: 'weekly' },
  { path: '/tools/position-size-calculator', priority: 0.8, changefreq: 'weekly' },
  { path: '/strategies/momentum', priority: 0.8, changefreq: 'weekly' },
  { path: '/strategies/mean-reversion', priority: 0.8, changefreq: 'weekly' },
  { path: '/strategies/earnings-plays', priority: 0.8, changefreq: 'weekly' },
  { path: '/strategies/gap-fade', priority: 0.8, changefreq: 'weekly' },
  { path: '/strategies/vwap-bounce', priority: 0.8, changefreq: 'weekly' },
  { path: '/faq', priority: 0.5, changefreq: 'monthly' },
  { path: '/contact', priority: 0.5, changefreq: 'monthly' },
  { path: '/privacy', priority: 0.3, changefreq: 'monthly' },
  { path: '/terms', priority: 0.3, changefreq: 'monthly' },
];

// Fetch dynamic routes from your database/CMS
async function getDynamicRoutes() {
  // Example: fetch from your DB
  // const blogPosts = await db.blogPosts.find({ published: true });
  // const earningsTickers = await db.earningsTickers.find({ active: true });

  // Mock data — replace with actual DB calls
  const blogPosts = [
    { slug: 'aapl-q3-2025', category: 'earnings-strategy', updatedAt: '2025-07-28' },
    { slug: 'tsla-q2-2025', category: 'earnings-strategy', updatedAt: '2025-07-25' },
    { slug: 'midas-v4-launch', category: 'momentum-scanning', updatedAt: '2025-07-20' },
    { slug: 'cpi-july-2025-trade-setup', category: 'macro-events', updatedAt: '2025-07-15' },
    { slug: 'iv-rank-explained', category: 'options-education', updatedAt: '2025-07-10' },
  ];

  const earningsTickers = [
    'AAPL', 'TSLA', 'NVDA', 'META', 'AMZN', 'GOOGL', 'MSFT', 'NFLX', 'AMD', 'CRM',
    'HOOD', 'COIN', 'SQ', 'UBER', 'LYFT', 'SHOP', 'PYPL', 'ROKU', 'ZM', 'SNOW',
    'PLTR', 'INTC', 'QCOM', 'AVGO', 'MU', 'KLAC', 'LRCX', 'AMAT', 'ADBE', 'CRM',
  ];

  const blogRoutes = blogPosts.map((post) => ({
    path: `/blog/${post.category}/${post.slug}`,
    priority: 0.7,
    changefreq: 'weekly',
    lastmod: post.updatedAt,
  }));

  const earningsRoutes = earningsTickers.map((ticker) => ({
    path: `/earnings/${ticker}`,
    priority: 0.7,
    changefreq: 'daily',
    lastmod: new Date().toISOString().split('T')[0],
  }));

  return [...blogRoutes, ...earningsRoutes];
}

function generateSitemapXml(routes) {
  const baseUrl = 'https://gistify.pro';
  const today = new Date().toISOString().split('T')[0];

  const urls = routes.map((route) => {
    const loc = `${baseUrl}${route.path}`;
    const lastmod = route.lastmod || today;
    const priority = route.priority || 0.5;
    const changefreq = route.changefreq || 'weekly';

    return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;
}

router.get('/sitemap.xml', async (req, res) => {
  try {
    const dynamicRoutes = await getDynamicRoutes();
    const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes];
    const sitemap = generateSitemapXml(allRoutes);

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;
```

### Wire up in your Express server:

```javascript
// server/index.js
const express = require('express');
const sitemapRoute = require('./sitemap');

const app = express();

// ... other middleware ...

app.use('/', sitemapRoute);

// Serve static SPA files
app.use(express.static('dist'));

// Fallback for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

## 3. Dynamic Sitemap Generation (Next.js API Route)

If you migrate to Next.js or use it alongside your SPA:

### `pages/api/sitemap.xml.ts` (Next.js Pages Router)

```typescript
// pages/api/sitemap.xml.ts
import { NextApiRequest, NextApiResponse } from 'next';

interface SitemapRoute {
  path: string;
  priority: number;
  changefreq: string;
  lastmod?: string;
}

const STATIC_ROUTES: SitemapRoute[] = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/pricing', priority: 0.9, changefreq: 'weekly' },
  { path: '/blog', priority: 0.8, changefreq: 'daily' },
  { path: '/tools/iv-rank-calculator', priority: 0.8, changefreq: 'weekly' },
  { path: '/tools/cpr-calculator', priority: 0.8, changefreq: 'weekly' },
  { path: '/tools/expected-move-calculator', priority: 0.8, changefreq: 'weekly' },
  { path: '/tools/position-size-calculator', priority: 0.8, changefreq: 'weekly' },
  { path: '/strategies/momentum', priority: 0.8, changefreq: 'weekly' },
  { path: '/strategies/mean-reversion', priority: 0.8, changefreq: 'weekly' },
  { path: '/strategies/earnings-plays', priority: 0.8, changefreq: 'weekly' },
  { path: '/strategies/gap-fade', priority: 0.8, changefreq: 'weekly' },
  { path: '/strategies/vwap-bounce', priority: 0.8, changefreq: 'weekly' },
  { path: '/faq', priority: 0.5, changefreq: 'monthly' },
  { path: '/contact', priority: 0.5, changefreq: 'monthly' },
  { path: '/privacy', priority: 0.3, changefreq: 'monthly' },
  { path: '/terms', priority: 0.3, changefreq: 'monthly' },
];

async function getDynamicRoutes(): Promise<SitemapRoute[]> {
  // Replace with your CMS/DB fetch
  const blogPosts = [
    { slug: 'aapl-q3-2025', category: 'earnings-strategy', updatedAt: '2025-07-28' },
    { slug: 'tsla-q2-2025', category: 'earnings-strategy', updatedAt: '2025-07-25' },
    { slug: 'midas-v4-launch', category: 'momentum-scanning', updatedAt: '2025-07-20' },
  ];

  const earningsTickers = [
    'AAPL', 'TSLA', 'NVDA', 'META', 'AMZN', 'GOOGL', 'MSFT', 'NFLX', 'AMD', 'CRM',
  ];

  const blogRoutes = blogPosts.map((post) => ({
    path: `/blog/${post.category}/${post.slug}`,
    priority: 0.7,
    changefreq: 'weekly',
    lastmod: post.updatedAt,
  }));

  const earningsRoutes = earningsTickers.map((ticker) => ({
    path: `/earnings/${ticker}`,
    priority: 0.7,
    changefreq: 'daily',
    lastmod: new Date().toISOString().split('T')[0],
  }));

  return [...blogRoutes, ...earningsRoutes];
}

function generateSitemapXml(routes: SitemapRoute[]): string {
  const baseUrl = 'https://gistify.pro';
  const today = new Date().toISOString().split('T')[0];

  const urls = routes.map((route) => {
    const loc = `${baseUrl}${route.path}`;
    const lastmod = route.lastmod || today;
    const priority = route.priority || 0.5;
    const changefreq = route.changefreq || 'weekly';

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dynamicRoutes = await getDynamicRoutes();
    const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes];
    const sitemap = generateSitemapXml(allRoutes);

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}
```

---

## 4. Sitemap Index (For Large Sites)

When you exceed 50,000 URLs or 50MB, use a sitemap index:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://gistify.pro/sitemap-static.xml</loc>
    <lastmod>2025-07-28</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://gistify.pro/sitemap-blog.xml</loc>
    <lastmod>2025-07-28</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://gistify.pro/sitemap-earnings.xml</loc>
    <lastmod>2025-07-28</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://gistify.pro/sitemap-tools.xml</loc>
    <lastmod>2025-07-28</lastmod>
  </sitemap>
</sitemapindex>
```

Update `robots.txt` to point to the sitemap index:

```
Sitemap: https://gistify.pro/sitemap-index.xml
```

---

## Best Practices

| Rule | Recommendation |
|------|----------------|
| **Max URLs** | 50,000 per sitemap file |
| **Max file size** | 50MB (uncompressed) |
| **lastmod** | Use `YYYY-MM-DD` format (ISO 8601 date only is fine) |
| **changefreq** | Be honest — daily for earnings, weekly for blog, monthly for static |
| **priority** | 1.0 = homepage, 0.3-0.5 = legal pages, 0.7-0.8 = content/tool pages |
| **Submit to Google** | Add to Google Search Console > Sitemaps |
| **Submit to Bing** | Add to Bing Webmaster Tools > Sitemaps |
| **Cache** | Cache for 1 hour minimum to reduce server load |
| **Auto-generate** | Regenerate on content publish/update events |
