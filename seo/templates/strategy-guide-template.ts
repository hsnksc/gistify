// =============================================================================
// Gistify.pro — Programmatic SEO Template: Strategy Guide Page
// Route: /strategies/:slug
// =============================================================================

export interface StrategyGuideData {
  slug: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  direction: 'Bullish' | 'Bearish' | 'Neutral' | 'Bi-Directional';
  maxProfit: string;
  maxLoss: string;
  breakeven: string;
  idealMarket: string;
  idealIV: 'High' | 'Low' | 'Any';
  setupSteps: string[];
  entryRules: string[];
  exitRules: string[];
  riskManagement: string[];
  realExample: { ticker: string; date: string; setup: string; result: string };
  pros: string[];
  cons: string[];
  relatedStrategies: string[];
}

const SLUG = '{SLUG}';
const TITLE = '{TITLE}';
const DESCRIPTION = '{DESCRIPTION}';
const DIFFICULTY = '{DIFFICULTY}';
const DIRECTION = '{DIRECTION}';
const MAX_PROFIT = '{MAX_PROFIT}';
const MAX_LOSS = '{MAX_LOSS}';
const BREAKEVEN = '{BREAKEVEN}';
const IDEAL_MARKET = '{IDEAL_MARKET}';
const IDEAL_IV = '{IDEAL_IV}';
const SETUP_STEPS = '{SETUP_STEPS}';
const ENTRY_RULES = '{ENTRY_RULES}';
const EXIT_RULES = '{EXIT_RULES}';
const RISK_MANAGEMENT = '{RISK_MANAGEMENT}';
const REAL_EXAMPLE = '{REAL_EXAMPLE}';
const PROS = '{PROS}';
const CONS = '{CONS}';
const RELATED_STRATEGIES = '{RELATED_STRATEGIES}';
const CANONICAL_URL = '{CANONICAL_URL}';
const OG_IMAGE_URL = '{OG_IMAGE_URL}';
const SCHEMA_JSON = '{SCHEMA_JSON}';
const HYDRATION_SCRIPT = '{HYDRATION_SCRIPT}';

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${TITLE}: Options Strategy Guide | Gistify</title>
  <meta name="description" content="Learn the ${TITLE} strategy with step-by-step setup, entry/exit rules, risk management, and a real example. Updated for active options traders." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${CANONICAL_URL}" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${TITLE}: Options Strategy Guide | Gistify" />
  <meta property="og:description" content="Learn the ${TITLE} strategy with step-by-step setup, entry/exit rules, risk management, and a real example." />
  <meta property="og:url" content="${CANONICAL_URL}" />
  <meta property="og:site_name" content="Gistify" />
  <meta property="og:image" content="${OG_IMAGE_URL}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="article:published_time" content="${new Date().toISOString()}" />
  <meta property="article:section" content="Finance" />
  <meta property="article:tag" content="options" />
  <meta property="article:tag" content="strategy" />
  <meta property="article:tag" content="${TITLE}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${TITLE}: Options Strategy Guide | Gistify" />
  <meta name="twitter:description" content="Learn the ${TITLE} strategy with step-by-step setup, entry/exit rules, risk management, and a real example." />
  <meta name="twitter:image" content="${OG_IMAGE_URL}" />
  <meta name="twitter:site" content="@gistify" />
  <meta name="twitter:creator" content="@gistify" />

  <!-- JSON-LD Article Schema -->
  <script type="application/ld+json">${SCHEMA_JSON}</script>

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #0f172a;
      color: #e2e8f0;
      line-height: 1.6;
      min-height: 100vh;
    }
    a { color: #10b981; text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* Nav */
    nav {
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid #1e293b;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-brand { font-weight: 800; font-size: 1.25rem; color: #10b981; letter-spacing: -0.02em; }
    .nav-back { font-size: 0.875rem; color: #94a3b8; transition: color 0.2s; }
    .nav-back:hover { color: #10b981; }

    /* Container */
    .container { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; }

    /* Header */
    .page-header { margin-bottom: 2rem; }
    .strategy-title { font-size: 2rem; font-weight: 800; color: #f8fafc; margin-bottom: 0.5rem; }
    .strategy-desc { color: #94a3b8; font-size: 1.05rem; max-width: 700px; line-height: 1.6; }
    .badge-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.8rem;
      font-weight: 700;
      padding: 0.3rem 0.75rem;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .badge-difficulty-beginner { background: #064e3b; color: #34d399; border: 1px solid #059669; }
    .badge-difficulty-intermediate { background: #78350f; color: #fbbf24; border: 1px solid #d97706; }
    .badge-difficulty-advanced { background: #450a0a; color: #f87171; border: 1px solid #dc2626; }
    .badge-direction-bullish { background: #064e3b; color: #34d399; border: 1px solid #059669; }
    .badge-direction-bearish { background: #450a0a; color: #f87171; border: 1px solid #dc2626; }
    .badge-direction-neutral { background: #1e3a5f; color: #60a5fa; border: 1px solid #3b82f6; }
    .badge-direction-bi-directional { background: #581c87; color: #c084fc; border: 1px solid #a855f7; }
    .badge-iv { background: #1e293b; color: #cbd5e1; border: 1px solid #334155; }

    /* Section cards */
    .section {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 0.75rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .section-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .section-title .icon { color: #10b981; font-size: 1.2rem; }

    /* Payoff table */
    .payoff-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    .payoff-card {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 0.5rem;
      padding: 1rem 1.25rem;
    }
    .payoff-label { font-size: 0.75rem; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
    .payoff-value { font-size: 1.25rem; font-weight: 700; color: #f8fafc; }
    .payoff-value.green { color: #34d399; }
    .payoff-value.red { color: #f87171; }

    /* Lists */
    .styled-list { list-style: none; }
    .styled-list li {
      position: relative;
      padding-left: 1.75rem;
      margin-bottom: 0.75rem;
      color: #cbd5e1;
      line-height: 1.6;
    }
    .styled-list li::before {
      content: attr(data-index);
      position: absolute;
      left: 0;
      top: 0.1rem;
      width: 1.25rem;
      height: 1.25rem;
      background: #10b981;
      color: #0f172a;
      font-size: 0.7rem;
      font-weight: 800;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .bullet-list { list-style: none; }
    .bullet-list li {
      position: relative;
      padding-left: 1.5rem;
      margin-bottom: 0.5rem;
      color: #cbd5e1;
    }
    .bullet-list li::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #10b981;
      font-weight: 700;
    }

    /* Real example */
    .example-card {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 0.5rem;
      padding: 1.25rem;
    }
    .example-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
    }
    .example-ticker {
      background: #10b981;
      color: #0f172a;
      font-weight: 900;
      font-size: 0.9rem;
      padding: 0.2rem 0.7rem;
      border-radius: 0.35rem;
    }
    .example-date { color: #94a3b8; font-size: 0.875rem; }
    .example-row { margin-bottom: 0.5rem; color: #cbd5e1; }
    .example-row strong { color: #f8fafc; }

    /* Pros/Cons table */
    .pros-cons-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }
    .pros-box {
      background: #0f172a;
      border: 1px solid #059669;
      border-radius: 0.5rem;
      padding: 1rem;
    }
    .cons-box {
      background: #0f172a;
      border: 1px solid #dc2626;
      border-radius: 0.5rem;
      padding: 1rem;
    }
    .pros-title { color: #34d399; font-weight: 700; margin-bottom: 0.75rem; font-size: 1rem; }
    .cons-title { color: #f87171; font-weight: 700; margin-bottom: 0.75rem; font-size: 1rem; }

    /* Related strategies */
    .related-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .related-chip {
      background: #0f172a;
      border: 1px solid #334155;
      color: #94a3b8;
      padding: 0.4rem 1rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    .related-chip:hover { border-color: #10b981; color: #10b981; text-decoration: none; }

    /* CTA */
    .cta-section {
      background: #10b981;
      border-radius: 0.75rem;
      padding: 2rem;
      text-align: center;
      margin: 2rem 0;
    }
    .cta-title { color: #0f172a; font-weight: 800; font-size: 1.5rem; margin-bottom: 0.5rem; }
    .cta-sub { color: #065f46; font-size: 1rem; margin-bottom: 1.5rem; }
    .cta-btn {
      display: inline-block;
      background: #0f172a;
      color: #10b981;
      font-weight: 700;
      font-size: 1rem;
      padding: 0.75rem 2rem;
      border-radius: 0.5rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); text-decoration: none; }

    /* Footer */
    footer {
      border-top: 1px solid #1e293b;
      padding: 2rem 1.5rem;
      text-align: center;
      color: #64748b;
      font-size: 0.875rem;
    }
    footer a { color: #94a3b8; }

    /* Risk warning */
    .risk-warning {
      background: #450a0a;
      border: 1px solid #7f1d1d;
      border-radius: 0.75rem;
      padding: 1rem 1.25rem;
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
      margin-top: 1.5rem;
    }
    .risk-icon { font-size: 1.5rem; color: #f87171; flex-shrink: 0; }
    .risk-text { color: #fca5a5; font-size: 0.875rem; line-height: 1.6; }
    .risk-text strong { color: #fecaca; }
  </style>
</head>
<body>
  <nav>
    <div class="nav-inner">
      <span class="nav-brand">Gistify</span>
      <a href="/" class="nav-back">&larr; Back to Gistify</a>
    </div>
  </nav>

  <div class="container">
    <header class="page-header">
      <h1 class="strategy-title">${TITLE}</h1>
      <p class="strategy-desc">${DESCRIPTION}</p>
      <div class="badge-row">
        <span class="badge badge-difficulty-${DIFFICULTY.toLowerCase().replace(' ', '-')}">${DIFFICULTY}</span>
        <span class="badge badge-direction-${DIRECTION.toLowerCase().replace('-', '-')}">${DIRECTION}</span>
        <span class="badge badge-iv">Ideal IV: ${IDEAL_IV}</span>
      </div>
    </header>

    <div class="section">
      <div class="section-title"><span class="icon">&#128200;</span> Strategy Overview</div>
      <div class="payoff-grid">
        <div class="payoff-card">
          <div class="payoff-label">Max Profit</div>
          <div class="payoff-value green">${MAX_PROFIT}</div>
        </div>
        <div class="payoff-card">
          <div class="payoff-label">Max Loss</div>
          <div class="payoff-value red">${MAX_LOSS}</div>
        </div>
        <div class="payoff-card">
          <div class="payoff-label">Breakeven</div>
          <div class="payoff-value">${BREAKEVEN}</div>
        </div>
        <div class="payoff-card">
          <div class="payoff-label">Ideal Market</div>
          <div class="payoff-value">${IDEAL_MARKET}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title"><span class="icon">&#128221;</span> Setup Steps</div>
      <ol class="styled-list">${SETUP_STEPS}</ol>
    </div>

    <div class="section">
      <div class="section-title"><span class="icon">&#128640;</span> Entry Rules</div>
      <ul class="bullet-list">${ENTRY_RULES}</ul>
    </div>

    <div class="section">
      <div class="section-title"><span class="icon">&#127919;</span> Exit Rules</div>
      <ul class="bullet-list">${EXIT_RULES}</ul>
    </div>

    <div class="section">
      <div class="section-title"><span class="icon">&#128737;</span> Risk Management</div>
      <ul class="bullet-list">${RISK_MANAGEMENT}</ul>
    </div>

    <div class="section">
      <div class="section-title"><span class="icon">&#127942;</span> Real Example</div>
      <div class="example-card">${REAL_EXAMPLE}</div>
    </div>

    <div class="section">
      <div class="section-title"><span class="icon">&#9889;</span> Pros & Cons</div>
      <div class="pros-cons-grid">
        <div class="pros-box">
          <div class="pros-title">&#10003; Pros</div>
          <ul class="bullet-list">${PROS}</ul>
        </div>
        <div class="cons-box">
          <div class="cons-title">&#10007; Cons</div>
          <ul class="bullet-list">${CONS}</ul>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title"><span class="icon">&#128279;</span> Related Strategies</div>
      <div class="related-list">${RELATED_STRATEGIES}</div>
      <div class="risk-warning" style="margin-top:1.5rem;">
        <span class="risk-icon">&#9888;</span>
        <div class="risk-text">
          <strong>Risk Warning:</strong> Options trading involves substantial risk and is not suitable for all investors. Past performance of any strategy or example does not guarantee future results. Always understand the risks before deploying any strategy. This content is educational only and not financial advice.
        </div>
      </div>
    </div>

    <div class="cta-section">
      <div class="cta-title">Apply ${TITLE} on Gistify</div>
      <div class="cta-sub">Find real-time setups, scan for IV Rank, and track your trades with Gistify.</div>
      <a href="https://app.gistify.pro" class="cta-btn">Open Gistify App</a>
    </div>
  </div>

  <footer>
    <p>&copy; ${new Date().getFullYear()} Gistify.pro &mdash; <a href="/">Home</a> &middot; <a href="https://app.gistify.pro">App</a></p>
  </footer>

  <script>
    ${HYDRATION_SCRIPT}
  </script>
</body>
</html>`;

/**
 * Generate the complete strategy guide HTML page.
 */
export function generateStrategyGuideHTML(
  slug: string,
  data: StrategyGuideData
): string {
  const canonical = `https://gistify.pro/strategies/${slug}`;
  const ogImage = `https://gistify.pro/gistifylogo.png`;

  const setupStepsHTML = data.setupSteps
    .map((step, i) => `<li data-index="${i + 1}">${step}</li>`)
    .join('');

  const entryRulesHTML = data.entryRules
    .map((rule) => `<li>${rule}</li>`)
    .join('');

  const exitRulesHTML = data.exitRules
    .map((rule) => `<li>${rule}</li>`)
    .join('');

  const riskManagementHTML = data.riskManagement
    .map((item) => `<li>${item}</li>`)
    .join('');

  const realExampleHTML = `
    <div class="example-header">
      <span class="example-ticker">${data.realExample.ticker}</span>
      <span class="example-date">${data.realExample.date}</span>
    </div>
    <div class="example-row"><strong>Setup:</strong> ${data.realExample.setup}</div>
    <div class="example-row"><strong>Result:</strong> ${data.realExample.result}</div>
  `;

  const prosHTML = data.pros.map((p) => `<li>${p}</li>`).join('');
  const consHTML = data.cons.map((c) => `<li>${c}</li>`).join('');

  const relatedHTML = data.relatedStrategies
    .map(
      (s) => `<a href="/strategies/${s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}" class="related-chip">${s}</a>`
    )
    .join('');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${data.title}: Options Strategy Guide`,
    description: data.description,
    author: { '@type': 'Organization', name: 'Gistify', url: 'https://gistify.pro' },
    publisher: {
      '@type': 'Organization',
      name: 'Gistify',
      logo: { '@type': 'ImageObject', url: 'https://gistify.pro/gistifylogo.png' },
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    image: ogImage,
    articleSection: 'Finance',
    keywords: [data.title, 'options strategy', data.difficulty, data.direction, 'options trading'],
  };

  const hydrationScript = `
    (async function() {
      try {
        const res = await fetch('/api/strategies/${slug}');
        if (!res.ok) return;
        const live = await res.json();
        console.log('Strategy guide hydrated:', live);
      } catch (e) { console.error('Strategy hydration failed:', e); }
    })();
  `;

  return HTML_TEMPLATE
    .replace(new RegExp(SLUG, 'g'), slug)
    .replace(new RegExp(TITLE, 'g'), data.title)
    .replace(new RegExp(DESCRIPTION, 'g'), data.description)
    .replace(new RegExp(DIFFICULTY, 'g'), data.difficulty)
    .replace(new RegExp(DIRECTION, 'g'), data.direction)
    .replace(new RegExp(MAX_PROFIT, 'g'), data.maxProfit)
    .replace(new RegExp(MAX_LOSS, 'g'), data.maxLoss)
    .replace(new RegExp(BREAKEVEN, 'g'), data.breakeven)
    .replace(new RegExp(IDEAL_MARKET, 'g'), data.idealMarket)
    .replace(new RegExp(IDEAL_IV, 'g'), data.idealIV)
    .replace(new RegExp(SETUP_STEPS, 'g'), setupStepsHTML)
    .replace(new RegExp(ENTRY_RULES, 'g'), entryRulesHTML)
    .replace(new RegExp(EXIT_RULES, 'g'), exitRulesHTML)
    .replace(new RegExp(RISK_MANAGEMENT, 'g'), riskManagementHTML)
    .replace(new RegExp(REAL_EXAMPLE, 'g'), realExampleHTML)
    .replace(new RegExp(PROS, 'g'), prosHTML)
    .replace(new RegExp(CONS, 'g'), consHTML)
    .replace(new RegExp(RELATED_STRATEGIES, 'g'), relatedHTML)
    .replace(new RegExp(CANONICAL_URL, 'g'), canonical)
    .replace(new RegExp(OG_IMAGE_URL, 'g'), ogImage)
    .replace(new RegExp(SCHEMA_JSON, 'g'), JSON.stringify(schema))
    .replace(new RegExp(HYDRATION_SCRIPT, 'g'), hydrationScript);
}

// =============================================================================
// Express Route Integration Snippet (add to server/index.ts)
// =============================================================================
/*
import { generateStrategyGuideHTML, StrategyGuideData } from './seo/templates/strategy-guide-template';

app.get('/strategies/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const data: StrategyGuideData = await fetchStrategyData(slug);
    const html = generateStrategyGuideHTML(slug, data);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=3600');
    res.send(html);
  } catch (err) {
    console.error('Strategy page error:', err);
    res.status(500).send('Error generating strategy guide. Try again later.');
  }
});

async function fetchStrategyData(slug: string): Promise<StrategyGuideData> {
  // Example: fetch from CMS, database, or static JSON file
  // return await db.strategies.findOne({ slug });
  // return await fetch(\`https://api.gistify.pro/strategies/\${slug}\`).then(r => r.json());
  throw new Error('fetchStrategyData not implemented');
}
*/
