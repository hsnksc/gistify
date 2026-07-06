# JSON-LD Structured Data Templates for Gistify.pro

> Copy-paste the `<script type="application/ld+json">` blocks below into the `<head>` section of your React SPA via `react-helmet-async` or directly into your `index.html` for the homepage, then conditionally render route-specific schemas.

---

## 1. SoftwareApplication Schema (Homepage)

Use this on the Gistify homepage (`https://gistify.pro/`).

```html
<script type="application/ld+json">
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
  "image": "https://gistify.pro/gistifylogo.png?v=20260706",
  "author": {
    "@type": "Organization",
    "name": "Gistify"
  },
  "softwareVersion": "1.0.0",
  "applicationSubCategory": "InvestmentManagementApplication",
  "featureList": [
    "Earnings strategy analyzer",
    "Momentum stock scanner",
    "IV Rank & CPR calculator",
    "Macro event calendar",
    "Options flow dashboard"
  ]
}
</script>
```

---

## 2. Organization Schema

Use this site-wide (every page).

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Gistify",
  "url": "https://gistify.pro/",
  "logo": "https://gistify.pro/gistifylogo.png?v=20260706",
  "sameAs": [
    "https://twitter.com/gistify",
    "https://www.linkedin.com/company/gistify"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "support@gistify.pro",
    "contactType": "customer support",
    "availableLanguage": ["English", "Turkish"]
  },
  "foundingDate": "2024",
  "description": "Gistify is a dark-themed finance workspace for options traders, combining earnings intelligence, momentum scanning, and macro event framing.",
  "areaServed": "US",
  "brand": {
    "@type": "Brand",
    "name": "Gistify",
    "slogan": "Trade smarter. Scan faster."
  }
}
</script>
```

---

## 3. WebSite Schema with SearchAction

Use this on the homepage to enable Google Sitelinks Search Box.

```html
<script type="application/ld+json">
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
  },
  "publisher": {
    "@type": "Organization",
    "name": "Gistify",
    "url": "https://gistify.pro/"
  }
}
</script>
```

---

## 4. FAQPage Schema (Blog Posts / Help Center)

Use this on FAQ or blog pages where you list common questions.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Gistify?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Gistify is a dark-themed finance workspace that brings earnings intelligence, momentum scanning, macro event framing, and options research into one unified platform for traders."
      }
    },
    {
      "@type": "Question",
      "name": "How does the IV Rank Calculator work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The IV Rank Calculator compares the current implied volatility of a stock against its 52-week range, giving traders a percentile score to identify cheap or expensive options."
      }
    },
    {
      "@type": "Question",
      "name": "What is the Momentum Scanner?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Momentum Scanner (Midas) scans 50+ US stocks across 10 sectors using technical indicators like RSI, MACD, Bollinger %B, and Ichimoku to generate real-time CALL/PUT signals."
      }
    },
    {
      "@type": "Question",
      "name": "Does Gistify support 0DTE options?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Gistify's earnings strategy module includes 0DTE and weekly option analysis with IV crush modeling, entry/exit timing, and risk-adjusted position sizing."
      }
    },
    {
      "@type": "Question",
      "name": "Is Gistify free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Gistify offers a free tier with limited access. Full access to momentum scans, earnings strategies, and all tools is available with a subscription starting at $29/month."
      }
    }
  ]
}
</script>
```

**Dynamic FAQ Generation (React):**

```tsx
// components/FAQSchema.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export const FAQSchema: React.FC<FAQSchemaProps> = ({ faqs }) => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};

// Usage:
// <FAQSchema faqs={[
//   { question: 'What is Gistify?', answer: '...' },
//   { question: 'How much does it cost?', answer: '...' },
// ]} />
```

---

## 5. BreadcrumbList Schema

Use this on every page that lives within a hierarchy (e.g., `/blog/earnings-strategy/...` or `/earnings/AAPL`).

### Example: Blog Post Breadcrumb

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://gistify.pro/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://gistify.pro/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Earnings Strategy",
      "item": "https://gistify.pro/blog/earnings-strategy"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "AAPL Q3 2025 Earnings Play"
    }
  ]
}
</script>
```

### Example: Earnings Page Breadcrumb

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://gistify.pro/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Earnings",
      "item": "https://gistify.pro/earnings"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "AAPL"
    }
  ]
}
</script>
```

### Dynamic Breadcrumb Component (React)

```tsx
// components/BreadcrumbSchema.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  name: string;
  item?: string; // omit item for the current page (no link)
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ items }) => {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.item && { item: item.item }),
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

// Usage:
// <BreadcrumbSchema items={[
//   { name: 'Home', item: 'https://gistify.pro/' },
//   { name: 'Earnings', item: 'https://gistify.pro/earnings' },
//   { name: 'AAPL' },
// ]} />
```

---

## 6. Additional Schemas (Article / BlogPosting)

For individual blog posts:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "AAPL Q3 2025 Earnings Strategy: IV Crush & Momentum Setup",
  "description": "Deep-dive earnings play on Apple with IV rank analysis, CPR levels, and 0DTE option strategy.",
  "image": "https://gistify.pro/gistifylogo.png?v=20260706",
  "author": {
    "@type": "Organization",
    "name": "Gistify"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Gistify",
    "logo": {
      "@type": "ImageObject",
      "url": "https://gistify.pro/gistifylogo.png?v=20260706"
    }
  },
  "datePublished": "2025-07-28T10:00:00-04:00",
  "dateModified": "2025-07-28T14:00:00-04:00",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://gistify.pro/blog/earnings-strategy/aapl-q3-2025"
  }
}
</script>
```

---

## Implementation Notes

1. **Always validate** your JSON-LD using Google's [Rich Results Test](https://search.google.com/test/rich-results).
2. **Combine schemas** on a single page by using multiple `<script type="application/ld+json">` tags, or merge them into a single `@graph` array.
3. **Use `react-helmet-async`** to inject JSON-LD dynamically per route in a React SPA.
4. **Ensure URLs are absolute** (`https://gistify.pro/...`) — not relative.
5. **Update `aggregateRating` dynamically** when you have real user reviews.
