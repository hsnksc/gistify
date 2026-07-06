// =============================================================================
// Gistify.pro — Programmatic SEO Template: Earnings Preview Page
// Route: /earnings/:ticker
// =============================================================================

export interface EarningsPreviewData {
  ticker: string;
  companyName: string;
  reportDate: string; // ISO date
  reportTime: 'BMO' | 'AMC';
  ivRank: number;
  ivPercentile: number;
  expectedMove: number; // percentage
  epsEstimate: number;
  revenueEstimate: number; // in millions
  historicalMoves: { quarter: string; move: number; direction: 'up' | 'down' }[];
  setupSuggestion: 'Straddle' | 'Strangle' | 'Call Spread' | 'Put Spread' | 'Skip';
  setupReasoning: string;
}

const TICKER = '{TICKER}';
const COMPANY = '{COMPANY}';
const REPORT_DATE = '{REPORT_DATE}';
const REPORT_TIME = '{REPORT_TIME}';
const IV_RANK = '{IV_RANK}';
const IV_PERCENTILE = '{IV_PERCENTILE}';
const EXPECTED_MOVE = '{EXPECTED_MOVE}';
const EPS_ESTIMATE = '{EPS_ESTIMATE}';
const REVENUE_ESTIMATE = '{REVENUE_ESTIMATE}';
const HISTORICAL_MOVES = '{HISTORICAL_MOVES}';
const SETUP_SUGGESTION = '{SETUP_SUGGESTION}';
const SETUP_REASONING = '{SETUP_REASONING}';
const CANONICAL_URL = '{CANONICAL_URL}';
const OG_IMAGE_URL = '{OG_IMAGE_URL}';
const SCHEMA_JSON = '{SCHEMA_JSON}';
const HYDRATION_SCRIPT = '{HYDRATION_SCRIPT}';

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${TICKER} Earnings Preview: Expected Move, IV Rank & Setup | Gistify</title>
  <meta name="description" content="${TICKER} earnings preview — IV Rank, expected move, analyst estimates, and options setup suggestion. Updated daily for active traders." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${CANONICAL_URL}" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${TICKER} Earnings Preview: Expected Move, IV Rank & Setup | Gistify" />
  <meta property="og:description" content="${TICKER} earnings preview — IV Rank, expected move, analyst estimates, and options setup suggestion. Updated daily for active traders." />
  <meta property="og:url" content="${CANONICAL_URL}" />
  <meta property="og:site_name" content="Gistify" />
  <meta property="og:image" content="${OG_IMAGE_URL}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="article:published_time" content="${REPORT_DATE}" />
  <meta property="article:section" content="Finance" />
  <meta property="article:tag" content="earnings" />
  <meta property="article:tag" content="options" />
  <meta property="article:tag" content="${TICKER}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${TICKER} Earnings Preview: Expected Move, IV Rank & Setup | Gistify" />
  <meta name="twitter:description" content="${TICKER} earnings preview — IV Rank, expected move, analyst estimates, and options setup suggestion. Updated daily for active traders." />
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
    .ticker-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #10b981;
      color: #0f172a;
      font-weight: 900;
      font-size: 2rem;
      padding: 0.5rem 1.25rem;
      border-radius: 0.5rem;
      letter-spacing: 0.05em;
      margin-bottom: 0.75rem;
    }
    .company-name { color: #94a3b8; font-size: 1.1rem; font-weight: 500; }
    .meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
      align-items: center;
    }
    .meta-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: #1e293b;
      border: 1px solid #334155;
      padding: 0.35rem 0.9rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      color: #cbd5e1;
    }
    .meta-pill .label { color: #64748b; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .time-badge-bmo { background: #065f46; color: #34d399; border-color: #059669; }
    .time-badge-amc { background: #7c2d12; color: #fb923c; border-color: #c2410c; }

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

    /* IV Bar */
    .iv-bar-bg {
      width: 100%;
      height: 1.25rem;
      background: #0f172a;
      border-radius: 9999px;
      overflow: hidden;
      margin-top: 0.5rem;
      border: 1px solid #334155;
    }
    .iv-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #059669, #10b981, #34d399);
      border-radius: 9999px;
      transition: width 0.6s ease;
      min-width: 4px;
    }
    .iv-bar-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #64748b;
      margin-top: 0.35rem;
    }
    .iv-value { font-size: 1.5rem; font-weight: 800; color: #10b981; }
    .iv-label { font-size: 0.875rem; color: #94a3b8; }

    /* Grid */
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }
    .stat-card {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 0.5rem;
      padding: 1rem 1.25rem;
    }
    .stat-label { font-size: 0.75rem; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
    .stat-value { font-size: 1.5rem; font-weight: 800; color: #f8fafc; }
    .stat-unit { font-size: 0.875rem; color: #94a3b8; font-weight: 400; }

    /* Historical moves */
    .move-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
      background: #0f172a;
      border: 1px solid #334155;
    }
    .move-up { border-left: 3px solid #10b981; }
    .move-down { border-left: 3px solid #ef4444; }
    .move-quarter { font-weight: 600; color: #cbd5e1; }
    .move-pct { font-weight: 700; font-size: 1.1rem; }
    .move-pct.up { color: #34d399; }
    .move-pct.down { color: #f87171; }
    .move-arrow { font-size: 1.2rem; }

    /* Setup suggestion */
    .setup-box {
      background: #0f172a;
      border: 2px solid #10b981;
      border-radius: 0.75rem;
      padding: 1.25rem;
      text-align: center;
      margin-bottom: 1rem;
    }
    .setup-badge {
      display: inline-block;
      background: #10b981;
      color: #0f172a;
      font-weight: 900;
      font-size: 1.25rem;
      padding: 0.4rem 1.2rem;
      border-radius: 0.5rem;
      letter-spacing: 0.02em;
    }
    .setup-reasoning { color: #94a3b8; font-size: 0.95rem; margin-top: 0.75rem; line-height: 1.6; }

    /* Risk warning */
    .risk-warning {
      background: #450a0a;
      border: 1px solid #7f1d1d;
      border-radius: 0.75rem;
      padding: 1rem 1.25rem;
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
    }
    .risk-icon { font-size: 1.5rem; color: #f87171; flex-shrink: 0; }
    .risk-text { color: #fca5a5; font-size: 0.875rem; line-height: 1.6; }
    .risk-text strong { color: #fecaca; }

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

    /* Skeleton */
    .skeleton {
      background: #334155;
      border-radius: 0.25rem;
      animation: pulse 1.5s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.7; }
    }
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
      <div class="ticker-badge">${TICKER}</div>
      <div class="company-name">${COMPANY}</div>
      <div class="meta-row">
        <span class="meta-pill"><span class="label">Earnings</span> ${REPORT_DATE}</span>
        <span class="meta-pill ${REPORT_TIME === 'BMO' ? 'time-badge-bmo' : 'time-badge-amc'}"><span class="label">Time</span> ${REPORT_TIME}</span>
      </div>
    </header>

    <div class="section">
      <div class="section-title"><span class="icon">&#9889;</span> IV Rank & Percentile</div>
      <div class="grid-2">
        <div class="stat-card">
          <div class="stat-label">IV Rank</div>
          <div class="iv-value">${IV_RANK}<span class="stat-unit">/100</span></div>
          <div class="iv-bar-bg"><div class="iv-bar-fill" style="width:${IV_RANK}%" id="iv-rank-bar"></div></div>
          <div class="iv-bar-labels"><span>Low</span><span>High</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">IV Percentile</div>
          <div class="iv-value">${IV_PERCENTILE}<span class="stat-unit">%</span></div>
          <div class="iv-bar-bg"><div class="iv-bar-fill" style="width:${IV_PERCENTILE}%" id="iv-pct-bar"></div></div>
          <div class="iv-bar-labels"><span>Low</span><span>High</span></div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title"><span class="icon">&#128200;</span> Key Metrics</div>
      <div class="grid-2">
        <div class="stat-card">
          <div class="stat-label">Expected Move</div>
          <div class="stat-value">&plusmn;${EXPECTED_MOVE}<span class="stat-unit">%</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">EPS Estimate</div>
          <div class="stat-value">$${EPS_ESTIMATE}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Revenue Estimate</div>
          <div class="stat-value">$${REVENUE_ESTIMATE}<span class="stat-unit">M</span></div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title"><span class="icon">&#128197;</span> Historical Post-Earnings Moves</div>
      <div id="historical-moves">${HISTORICAL_MOVES}</div>
    </div>

    <div class="section">
      <div class="section-title"><span class="icon">&#128161;</span> Setup Suggestion</div>
      <div class="setup-box">
        <div class="setup-badge">${SETUP_SUGGESTION}</div>
        <div class="setup-reasoning">${SETUP_REASONING}</div>
      </div>
      <div class="risk-warning">
        <span class="risk-icon">&#9888;</span>
        <div class="risk-text">
          <strong>Risk Warning:</strong> Options trading involves substantial risk. Earnings plays are especially volatile. IV crush after earnings can significantly erode option premiums. Past post-earnings moves do not guarantee future results. Always size positions appropriately and use stop-losses. This is not financial advice.
        </div>
      </div>
    </div>

    <div class="cta-section">
      <div class="cta-title">Track ${TICKER} in Real Time</div>
      <div class="cta-sub">Get live IV Rank, technical signals, and earnings alerts on Gistify.</div>
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
 * Generate the complete earnings preview HTML page.
 */
export function generateEarningsPreviewHTML(
  ticker: string,
  data: EarningsPreviewData
): string {
  const canonical = `https://gistify.pro/earnings/${ticker.toUpperCase()}`;
  const ogImage = `https://gistify.pro/gistifylogo.png`;
  const reportDateStr = new Date(data.reportDate).toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });

  const historicalMovesHTML = data.historicalMoves
    .map(
      (m) => `
      <div class="move-row ${m.direction === 'up' ? 'move-up' : 'move-down'}">
        <span class="move-quarter">${m.quarter}</span>
        <span class="move-pct ${m.direction}">${m.direction === 'up' ? '&#9650;' : '&#9660;'} ${Math.abs(m.move)}%</span>
      </div>`
    )
    .join('');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${ticker.toUpperCase()} Earnings Preview: Expected Move, IV Rank & Setup`,
    description: `${ticker.toUpperCase()} earnings preview — IV Rank, expected move, analyst estimates, and options setup suggestion.`,
    author: { '@type': 'Organization', name: 'Gistify', url: 'https://gistify.pro' },
    publisher: {
      '@type': 'Organization',
      name: 'Gistify',
      logo: { '@type': 'ImageObject', url: 'https://gistify.pro/gistifylogo.png' },
    },
    datePublished: data.reportDate,
    dateModified: new Date().toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    image: ogImage,
    articleSection: 'Finance',
    keywords: [ticker.toUpperCase(), 'earnings', 'options', 'IV Rank', 'expected move'],
  };

  const hydrationScript = `
    (async function() {
      try {
        const res = await fetch('/api/earnings/${ticker.toUpperCase()}');
        if (!res.ok) return;
        const live = await res.json();
        if (live.ivRank != null) {
          const rankBar = document.getElementById('iv-rank-bar');
          if (rankBar) rankBar.style.width = live.ivRank + '%';
        }
        if (live.ivPercentile != null) {
          const pctBar = document.getElementById('iv-pct-bar');
          if (pctBar) pctBar.style.width = live.ivPercentile + '%';
        }
        if (live.historicalMoves && Array.isArray(live.historicalMoves)) {
          const container = document.getElementById('historical-moves');
          if (container) {
            container.innerHTML = live.historicalMoves.map(m => \`
              <div class="move-row \${m.direction === 'up' ? 'move-up' : 'move-down'}">
                <span class="move-quarter">\${m.quarter}</span>
                <span class="move-pct \${m.direction}">\${m.direction === 'up' ? '&#9650;' : '&#9660;'} \${Math.abs(m.move)}%</span>
              </div>
            \`).join('');
          }
        }
      } catch (e) { console.error('Earnings hydration failed:', e); }
    })();
  `;

  return HTML_TEMPLATE
    .replace(new RegExp(TICKER, 'g'), ticker.toUpperCase())
    .replace(new RegExp(COMPANY, 'g'), data.companyName)
    .replace(new RegExp(REPORT_DATE, 'g'), reportDateStr)
    .replace(new RegExp(REPORT_TIME, 'g'), data.reportTime)
    .replace(new RegExp(IV_RANK, 'g'), String(data.ivRank))
    .replace(new RegExp(IV_PERCENTILE, 'g'), String(data.ivPercentile))
    .replace(new RegExp(EXPECTED_MOVE, 'g'), String(data.expectedMove))
    .replace(new RegExp(EPS_ESTIMATE, 'g'), String(data.epsEstimate))
    .replace(new RegExp(REVENUE_ESTIMATE, 'g'), String(data.revenueEstimate))
    .replace(new RegExp(HISTORICAL_MOVES, 'g'), historicalMovesHTML)
    .replace(new RegExp(SETUP_SUGGESTION, 'g'), data.setupSuggestion)
    .replace(new RegExp(SETUP_REASONING, 'g'), data.setupReasoning)
    .replace(new RegExp(CANONICAL_URL, 'g'), canonical)
    .replace(new RegExp(OG_IMAGE_URL, 'g'), ogImage)
    .replace(new RegExp(SCHEMA_JSON, 'g'), JSON.stringify(schema))
    .replace(new RegExp(HYDRATION_SCRIPT, 'g'), hydrationScript);
}

// =============================================================================
// Express Route Integration Snippet (add to server/index.ts)
// =============================================================================
/*
import { generateEarningsPreviewHTML, EarningsPreviewData } from './seo/templates/earnings-preview-template';

app.get('/earnings/:ticker', async (req, res) => {
  const { ticker } = req.params;
  try {
    // Fetch data from your data source (API, DB, cache, etc.)
    const data: EarningsPreviewData = await fetchEarningsData(ticker.toUpperCase());
    const html = generateEarningsPreviewHTML(ticker, data);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    res.send(html);
  } catch (err) {
    console.error('Earnings page error:', err);
    res.status(500).send('Error generating earnings preview. Try again later.');
  }
});

// Placeholder data fetcher — replace with real implementation
async function fetchEarningsData(ticker: string): Promise<EarningsPreviewData> {
  // Example: fetch from internal API, database, or cache
  // return await db.earnings.findOne({ ticker });
  // return await fetch(\`https://api.gistify.pro/earnings/\${ticker}\`).then(r => r.json());
  throw new Error('fetchEarningsData not implemented');
}
*/
