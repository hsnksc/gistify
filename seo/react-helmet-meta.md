# React Helmet Async Meta Tag Setup for Gistify.pro

> Complete, production-ready code for dynamic SEO meta tags in a React SPA using `react-helmet-async`. Copy-paste into your codebase.

---

## Step 1: Install Dependencies

```bash
npm install react-helmet-async
```

---

## Step 2: Wrap App with `HelmetProvider`

```tsx
// src/main.tsx or src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
```

---

## Step 3: Reusable `<SEO />` Component

```tsx
// src/components/SEO.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'software';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  hreflang?: { lang: string; url: string }[];
  noindex?: boolean;
  nofollow?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  keywords?: string;
  robots?: string;
}

const DEFAULT_OG_IMAGE = 'https://gistify.pro/og-image.png';
const SITE_URL = 'https://gistify.pro';

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  hreflang = [],
  noindex = false,
  nofollow = false,
  jsonLd,
  keywords,
  robots,
}) => {
  const fullTitle = title.includes('Gistify') ? title : `${title} | Gistify`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined;
  const robotsContent = robots
    ? robots
    : `${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`;

  // Normalize jsonLd to array
  const jsonLdArray = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsContent} />

      {/* Canonical */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Gistify" />
      <meta property="og:locale" content="en_US" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@gistify" />
      <meta name="twitter:creator" content="@gistify" />

      {/* Alternate Language (hreflang) */}
      {hreflang.map((hl) => (
        <link
          key={hl.lang}
          rel="alternate"
          hrefLang={hl.lang}
          href={hl.url}
        />
      ))}

      {/* Default hreflang fallback */}
      {hreflang.length > 0 && (
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
      )}

      {/* JSON-LD Structured Data */}
      {jsonLdArray.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
```

---

## Step 4: Default SEO Component (Global Defaults)

```tsx
// src/components/DefaultSEO.tsx
import React from 'react';
import { SEO } from './SEO';

export const DefaultSEO: React.FC = () => {
  return (
    <SEO
      title="Gistify — Earnings Intelligence & Momentum Scanning for Options Traders"
      description="Gistify brings earnings intelligence, momentum scanning, macro event framing and options research into one dark finance workspace."
      canonical="/"
      ogImage="https://gistify.pro/og-image.png"
      ogType="website"
      twitterCard="summary_large_image"
      hreflang={[
        { lang: 'en', url: 'https://gistify.pro/' },
        { lang: 'tr', url: 'https://gistify.pro/tr/' },
      ]}
      jsonLd={[
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Gistify',
          url: 'https://gistify.pro/',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://gistify.pro/app?search={search_term}',
            },
            'query-input': 'required name=search_term',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Gistify',
          url: 'https://gistify.pro/',
          logo: 'https://gistify.pro/logo.png',
          sameAs: [
            'https://twitter.com/gistify',
            'https://www.linkedin.com/company/gistify',
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            email: 'support@gistify.pro',
            contactType: 'customer support',
          },
        },
      ]}
    />
  );
};

export default DefaultSEO;
```

---

## Step 5: Route-Specific SEO Examples

### 1. Homepage (`/`)

```tsx
// src/pages/HomePage.tsx
import React from 'react';
import { SEO } from '../components/SEO';

const HomePage: React.FC = () => {
  return (
    <>
      <SEO
        title="Gistify — Earnings Intelligence & Momentum Scanning for Options Traders"
        description="Gistify brings earnings intelligence, momentum scanning, macro event framing and options research into one dark finance workspace."
        canonical="/"
        ogImage="https://gistify.pro/og-image-home.png"
        ogType="website"
        hreflang={[
          { lang: 'en', url: 'https://gistify.pro/' },
          { lang: 'tr', url: 'https://gistify.pro/tr/' },
        ]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Gistify',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '29.00',
            priceCurrency: 'USD',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '150',
          },
          description:
            'Gistify brings earnings intelligence, momentum scanning, macro event framing and options research into one dark finance workspace.',
          url: 'https://gistify.pro/',
          image: 'https://gistify.pro/og-image.png',
        }}
      />
      {/* Page content */}
    </>
  );
};

export default HomePage;
```

---

### 2. App Dashboard (`/app`)

```tsx
// src/pages/AppDashboard.tsx
import React from 'react';
import { SEO } from '../components/SEO';

const AppDashboard: React.FC = () => {
  return (
    <>
      <SEO
        title="Dashboard — Gistify Trading Workspace"
        description="Access your personalized trading dashboard with momentum scanners, earnings plays, and macro event alerts."
        canonical="/app"
        ogImage="https://gistify.pro/og-image-dashboard.png"
        ogType="website"
        noindex={true} // Private app area — do not index
        hreflang={[
          { lang: 'en', url: 'https://gistify.pro/app' },
          { lang: 'tr', url: 'https://gistify.pro/tr/app' },
        ]}
      />
      {/* Page content */}
    </>
  );
};

export default AppDashboard;
```

---

### 3. Blog Post (`/blog/earnings-strategy/:slug`)

```tsx
// src/pages/BlogPost.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';

interface BlogPostData {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  modifiedAt: string;
  ogImage: string;
  keywords: string;
  tags: string[];
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Fetch or derive post data from your CMS/state
  const post: BlogPostData = {
    title: 'AAPL Q3 2025 Earnings Strategy: IV Crush & Momentum Setup',
    description:
      'Deep-dive earnings play on Apple with IV rank analysis, CPR levels, and 0DTE option strategy.',
    slug: `aapl-q3-2025`,
    publishedAt: '2025-07-28T10:00:00-04:00',
    modifiedAt: '2025-07-28T14:00:00-04:00',
    ogImage: 'https://gistify.pro/blog/aapl-q3-2025-og.png',
    keywords:
      'AAPL, Apple earnings, options strategy, IV crush, 0DTE, momentum trading',
    tags: ['earnings', 'AAPL', 'options'],
  };

  const canonical = `/blog/earnings-strategy/${post.slug}`;

  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        canonical={canonical}
        ogImage={post.ogImage}
        ogType="article"
        twitterCard="summary_large_image"
        keywords={post.keywords}
        hreflang={[
          { lang: 'en', url: `https://gistify.pro${canonical}` },
          { lang: 'tr', url: `https://gistify.pro/tr${canonical}` },
        ]}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            image: post.ogImage,
            author: {
              '@type': 'Organization',
              name: 'Gistify',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Gistify',
              logo: {
                '@type': 'ImageObject',
                url: 'https://gistify.pro/logo.png',
              },
            },
            datePublished: post.publishedAt,
            dateModified: post.modifiedAt,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://gistify.pro${canonical}`,
            },
            keywords: post.tags.join(', '),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://gistify.pro/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: 'https://gistify.pro/blog',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'Earnings Strategy',
                item: 'https://gistify.pro/blog/earnings-strategy',
              },
              {
                '@type': 'ListItem',
                position: 4,
                name: post.title,
              },
            ],
          },
        ]}
      />
      {/* Page content */}
    </>
  );
};

export default BlogPost;
```

---

### 4. Tool Page (`/tools/iv-rank-calculator`)

```tsx
// src/pages/IVRankCalculator.tsx
import React from 'react';
import { SEO } from '../components/SEO';

const IVRankCalculator: React.FC = () => {
  return (
    <>
      <SEO
        title="IV Rank Calculator — Compare Implied Volatility Percentiles"
        description="Free IV Rank Calculator for options traders. Compare current implied volatility against 52-week range for any US stock."
        canonical="/tools/iv-rank-calculator"
        ogImage="https://gistify.pro/og-image-tools.png"
        ogType="product"
        keywords="IV Rank, implied volatility, options calculator, volatility percentile, options trading"
        hreflang={[
          { lang: 'en', url: 'https://gistify.pro/tools/iv-rank-calculator' },
          { lang: 'tr', url: 'https://gistify.pro/tr/tools/iv-rank-calculator' },
        ]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'IV Rank Calculator',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          description:
            'Free IV Rank Calculator for options traders. Compare current implied volatility against 52-week range for any US stock.',
          url: 'https://gistify.pro/tools/iv-rank-calculator',
          image: 'https://gistify.pro/og-image-tools.png',
        }}
      />
      {/* Page content */}
    </>
  );
};

export default IVRankCalculator;
```

---

### 5. Earnings Page (`/earnings/:ticker`)

```tsx
// src/pages/EarningsPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';

const EarningsPage: React.FC = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const upperTicker = ticker?.toUpperCase() || '';

  return (
    <>
      <SEO
        title={`${upperTicker} Earnings Strategy — IV Crush & Option Setup | Gistify`}
        description={`Complete earnings play analysis for ${upperTicker}. IV Rank, CPR levels, expected move, and 0DTE/weekly option strategies.`}
        canonical={`/earnings/${upperTicker}`}
        ogImage={`https://gistify.pro/og-image-earnings/${upperTicker}.png`}
        ogType="article"
        keywords={`${upperTicker}, earnings, options strategy, IV crush, ${upperTicker} earnings, ${upperTicker} options`}
        hreflang={[
          {
            lang: 'en',
            url: `https://gistify.pro/earnings/${upperTicker}`,
          },
          {
            lang: 'tr',
            url: `https://gistify.pro/tr/earnings/${upperTicker}`,
          },
        ]}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `${upperTicker} Earnings Strategy — IV Crush & Option Setup`,
            description: `Complete earnings play analysis for ${upperTicker}. IV Rank, CPR levels, expected move, and 0DTE/weekly option strategies.`,
            image: `https://gistify.pro/og-image-earnings/${upperTicker}.png`,
            author: {
              '@type': 'Organization',
              name: 'Gistify',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Gistify',
              logo: {
                '@type': 'ImageObject',
                url: 'https://gistify.pro/logo.png',
              },
            },
            datePublished: new Date().toISOString(),
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://gistify.pro/earnings/${upperTicker}`,
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://gistify.pro/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Earnings',
                item: 'https://gistify.pro/earnings',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: upperTicker,
              },
            ],
          },
        ]}
      />
      {/* Page content */}
    </>
  );
};

export default EarningsPage;
```

---

## Step 6: App Router Integration (Optional but Recommended)

```tsx
// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DefaultSEO } from './components/DefaultSEO';
import HomePage from './pages/HomePage';
import AppDashboard from './pages/AppDashboard';
import BlogPost from './pages/BlogPost';
import IVRankCalculator from './pages/IVRankCalculator';
import EarningsPage from './pages/EarningsPage';

const App: React.FC = () => {
  return (
    <>
      <DefaultSEO />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app" element={<AppDashboard />} />
        <Route path="/blog/earnings-strategy/:slug" element={<BlogPost />} />
        <Route path="/tools/iv-rank-calculator" element={<IVRankCalculator />} />
        <Route path="/earnings/:ticker" element={<EarningsPage />} />
        {/* Add more routes */}
      </Routes>
    </>
  );
};

export default App;
```

---

## Important Notes

| Concern | Recommendation |
|--------|----------------|
| **Hydration mismatch** | Ensure `title` and `description` are deterministic on first render. Avoid async data that changes during SSR/hydration unless using `useEffect`. |
| **Noindex for private pages** | Use `noindex={true}` for `/app`, `/account`, `/settings`, etc. |
| **Dynamic OG images** | Generate per-page OG images at build time or via an image service (e.g., `@vercel/og`, `next/og`). |
| **Canonical self-referencing** | Every indexable page should have a canonical tag pointing to itself. |
| **hreflang x-default** | Always include `x-default` as the fallback for unmatched languages. |
| **Helmet key prop** | When using `react-helmet-async`, each `<Helmet>` instance on a page will merge. Route-level `<SEO>` overrides global `<DefaultSEO>` for overlapping tags. |
