// =============================================================================
// Gistify.pro — Programmatic SEO Template: Scanner Results Page
// Route: /scanners/:type
// =============================================================================

export interface ScannerResultsData {
  type: string;
  title: string;
  description: string;
  lastUpdated: string;
  stocks: {
    ticker: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    ivRank: number;
    setup: 'CALL' | 'PUT' | 'NEUTRAL';
    signal: string;
  }[];
  scanCriteria: string[];
  methodology: string;
}

const TYPE = '{TYPE}';
const TITLE = '{TITLE}';
const DESCRIPTION = '{DESCRIPTION}';
const LAST_UPDATED = '{LAST_UPDATED}';
const SCAN_CRITERIA = '{SCAN_CRITERIA}';
const METHODOLOGY = '{METHODOLOGY}';
const STOCKS_TABLE = '{STOCKS_TABLE}';
const CANONICAL_URL = '{CANONICAL_URL}';
const OG_IMAGE_URL = '{OG_IMAGE_URL}';
const SCHEMA_JSON = '{SCHEMA_JSON}';
const HYDRATION_SCRIPT = '{HYDRATION_SCRIPT}';

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${TITLE} Scanner Results &mdash; Live Signals | Gistify</title>
  <meta name="description" content="Real-time ${TITLE} scanner results with IV Rank, setup type, and technical signals for active options traders. Updated continuously." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${CANONICAL_URL}" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${TITLE} Scanner Results &mdash; Live Signals | Gistify" />
  <meta property="og:description" content="Real-time ${TITLE} scanner results with IV Rank, setup type, and technical signals for active options traders." />
  <meta property="og:url" content="${CANONICAL_URL}" />
  <meta property="og:site_name" content="Gistify" />
  <meta property="og:image" content="${OG_IMAGE_URL}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="article:published_time" content="${LAST_UPDATED}" />
  <meta property="article:section" content="Finance" />
  <meta property="article:tag" content="scanner" />
  <meta property="article:tag" content="momentum" />
  <meta property="article:tag" content="options" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${TITLE} Scanner Results &mdash; Live Signals | Gistify" />
  <meta name="twitter:description" content="Real-time ${TITLE} scanner results with IV Rank, setup type, and technical signals for active options traders." />
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
    .scanner-title { font-size: 2rem; font-weight: 800; color: #f8fafc; margin-bottom: 0.5rem; }
    .scanner-desc { color: #94a3b8; font-size: 1.05rem; max-width: 700px; line-height: 1.6; }
    .last-updated { color: #64748b; font-size: 0.875rem; margin-top: 0.75rem; }
    .last-updated .dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #10b981;
      border-radius: 50%;
      margin-right: 0.4rem;
      animation: pulse-dot 2s infinite;
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

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

    /* Criteria list */
    .criteria-list { list-style: none; }
    .criteria-list li {
      position: relative;
      padding-left: 1.5rem;
      margin-bottom: 0.5rem;
      color: #cbd5e1;
    }
    .criteria-list li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #10b981;
      font-weight: 700;
    }

    /* Methodology */
    .methodology-text { color: #cbd5e1; line-height: 1.7; font-size: 0.95rem; }

    /* Results table */
    .results-table-wrapper { overflow-x: auto; border-radius: 0.5rem; border: 1px solid #334155; }
    .results-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
      min-width: 700px;
    }
    .results-table thead {
      background: #0f172a;
      position: sticky;
      top: 0;
    }
    .results-table th {
      text-align: left;
      padding: 0.75rem 1rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.05em;
      font-weight: 700;
      border-bottom: 1px solid #334155;
      white-space: nowrap;
    }
    .results-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #1e293b;
      color: #e2e8f0;
      vertical-align: middle;
    }
    .results-table tbody tr:hover { background: #0f172a; }
    .results-table tbody tr:last-child td { border-bottom: none; }

    .ticker-link {
      font-weight: 800;
      color: #10b981;
      font-size: 0.95rem;
      background: #0f172a;
      padding: 0.2rem 0.6rem;
      border-radius: 0.35rem;
      display: inline-block;
    }
    .ticker-link:hover { text-decoration: none; background: #10b981; color: #0f172a; }

    .price-value { font-weight: 700; color: #f8fafc; }
    .change-up { color: #34d399; font-weight: 700; }
    .change-down { color: #f87171; font-weight: 700; }
    .volume-value { color: #94a3b8; }
    .iv-value { font-weight: 700; color: #f8fafc; }
    .setup-call { background: #064e3b; color: #34d399; padding: 0.2rem 0.6rem; border-radius: 0.35rem; font-size: 0.8rem; font-weight: 700; }
    .setup-put { background: #450a0a; color: #f87171; padding: 0.2rem 0.6rem; border-radius: 0.35rem; font-size: 0.8rem; font-weight: 700; }
    .setup-neutral { background: #1e3a5f; color: #60a5fa; padding: 0.2rem 0.6rem; border-radius: 0.35rem; font-size: 0.8rem; font-weight: 700; }
    .signal-text { color: #94a3b8; font-size: 0.85rem; max-width: 200px; }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: #64748b;
    }
    .empty-state-icon { font-size: 3rem; margin-bottom: 1rem; }

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

    /* Responsive */
    @media (max-width: 640px) {
      .scanner-title { font-size: 1.5rem; }
      .section { padding: 1rem; }
      .results-table td, .results-table th { padding: 0.6rem 0.75rem; font-size: 0.85rem; }
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
      <h1 class="scanner-title">${TITLE}</h1>
      <p class="scanner-desc">${DESCRIPTION}</p>
      <div class="last-updated"><span class="dot"></span>Last updated: ${LAST_UPDATED}</div>
    </header>

    <div class="section">
      <div class="section-title"><span class="icon">&#128270;</span> Scan Criteria</div>
      <ul class="criteria-list">${SCAN_CRITERIA}</ul>
    </div>

    <div class="section">
      <div class="section-title"><span class="icon">&#128200;</span> Methodology</div>
      <p class="methodology-text">${METHODOLOGY}</p>
    </div>

    <div class="section">
      <div class="section-title"><span class="icon">&#9889;</span> Results</div>
      <div class="results-table-wrapper">
        <table class="results-table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Price</th>
              <th>Change</th>
              <th>Volume</th>
              <th>IV Rank</th>
              <th>Setup</th>
              <th>Signal</th>
            </tr>
          </thead>
          <tbody id="results-body">${STOCKS_TABLE}</tbody>
        </table>
      </div>
      <div class="risk-warning">
        <span class="risk-icon">&#9888;</span>
        <div class="risk-text">
          <strong>Disclaimer:</strong> Scanner results are generated algorithmically and should not be considered as trading recommendations. Always conduct your own due diligence before making any investment decisions. Market conditions can change rapidly. This is not financial advice.
        </div>
      </div>
    </div>

    <div class="cta-section">
      <div class="cta-title">Get Real-Time Scanner Data</div>
      <div class="cta-sub">Access live momentum, IV rank, and earnings scanners with real-time updates on Gistify.</div>
      <a href="https://gistify.pro" class="cta-btn">Open Gistify App</a>
    </div>
  </div>

  <footer>
    <p>&copy; ${new Date().getFullYear()} Gistify.pro &mdash; <a href="/">Home</a> &middot; <a href="/blog/momentum-trading/momentum-scanner-high-probability-setups">Momentum Guide</a> &middot; <a href="https://gistify.pro">App</a></p>
  </footer>

  <script>
    ${HYDRATION_SCRIPT}
  </script>
</body>
</html>`;

function formatVolume(vol: number): string {
  if (vol >= 1_000_000) return (vol / 1_000_000).toFixed(1) + 'M';
  if (vol >= 1_000) return (vol / 1_000).toFixed(1) + 'K';
  return String(vol);
}

function buildStockRow(stock: ScannerResultsData['stocks'][0]): string {
  const changeClass = stock.changePercent >= 0 ? 'change-up' : 'change-down';
  const changeSign = stock.changePercent >= 0 ? '+' : '';
  const setupClass =
    stock.setup === 'CALL' ? 'setup-call' : stock.setup === 'PUT' ? 'setup-put' : 'setup-neutral';

  return `
    <tr data-ticker="${stock.ticker}">
      <td><a href="/earnings/${stock.ticker}" class="ticker-link">${stock.ticker}</a></td>
      <td class="price-value">$${stock.price.toFixed(2)}</td>
      <td class="${changeClass}">${changeSign}${stock.changePercent.toFixed(2)}%</td>
      <td class="volume-value">${formatVolume(stock.volume)}</td>
      <td class="iv-value">${stock.ivRank}</td>
      <td><span class="${setupClass}">${stock.setup}</span></td>
      <td class="signal-text">${stock.signal}</td>
    </tr>
  `;
}

/**
 * Generate the complete scanner results HTML page.
 */
export function generateScannerResultsHTML(
  type: string,
  data: ScannerResultsData
): string {
  const canonical = `https://gistify.pro/scanners/${type}`;
  const ogImage = `https://gistify.pro/og/scanners/${type}.png`;
  const lastUpdatedStr = new Date(data.lastUpdated).toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const scanCriteriaHTML = data.scanCriteria
    .map((c) => `<li>${c}</li>`)
    .join('');

  const stocksTableHTML = data.stocks.length
    ? data.stocks.map(buildStockRow).join('')
    : `
      <tr>
        <td colspan="7" class="empty-state">
          <div class="empty-state-icon">&#128269;</div>
          <div>No results match the current scan criteria.</div>
        </td>
      </tr>
    `;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${data.title} Scanner Results — Live Signals`,
    description: data.description,
    author: { '@type': 'Organization', name: 'Gistify', url: 'https://gistify.pro' },
    publisher: {
      '@type': 'Organization',
      name: 'Gistify',
      logo: { '@type': 'ImageObject', url: 'https://gistify.pro/logo.png' },
    },
    datePublished: data.lastUpdated,
    dateModified: new Date().toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    image: ogImage,
    articleSection: 'Finance',
    keywords: [data.title, 'scanner', 'momentum', 'options', 'IV Rank'],
  };

  const hydrationScript = `
    (async function() {
      try {
        const res = await fetch('/api/scanners/${type}');
        if (!res.ok) return;
        const live = await res.json();
        if (live.stocks && Array.isArray(live.stocks)) {
          const tbody = document.getElementById('results-body');
          if (tbody) {
            tbody.innerHTML = live.stocks.map(s => {
              const changeClass = s.changePercent >= 0 ? 'change-up' : 'change-down';
              const changeSign = s.changePercent >= 0 ? '+' : '';
              const setupClass = s.setup === 'CALL' ? 'setup-call' : s.setup === 'PUT' ? 'setup-put' : 'setup-neutral';
              const volFmt = s.volume >= 1000000 ? (s.volume/1000000).toFixed(1)+'M' : s.volume >= 1000 ? (s.volume/1000).toFixed(1)+'K' : s.volume;
              return \`
                <tr data-ticker="\${s.ticker}">
                  <td><a href="/earnings/\${s.ticker}" class="ticker-link">\${s.ticker}</a></td>
                  <td class="price-value">$\${s.price.toFixed(2)}</td>
                  <td class="\${changeClass}">\${changeSign}\${s.changePercent.toFixed(2)}%</td>
                  <td class="volume-value">\${volFmt}</td>
                  <td class="iv-value">\${s.ivRank}</td>
                  <td><span class="\${setupClass}">\${s.setup}</span></td>
                  <td class="signal-text">\${s.signal}</td>
                </tr>
              \`;
            }).join('');
          }
        }
      } catch (e) { console.error('Scanner hydration failed:', e); }
    })();
  `;

  return HTML_TEMPLATE
    .replace(new RegExp(TYPE, 'g'), type)
    .replace(new RegExp(TITLE, 'g'), data.title)
    .replace(new RegExp(DESCRIPTION, 'g'), data.description)
    .replace(new RegExp(LAST_UPDATED, 'g'), lastUpdatedStr)
    .replace(new RegExp(SCAN_CRITERIA, 'g'), scanCriteriaHTML)
    .replace(new RegExp(METHODOLOGY, 'g'), data.methodology)
    .replace(new RegExp(STOCKS_TABLE, 'g'), stocksTableHTML)
    .replace(new RegExp(CANONICAL_URL, 'g'), canonical)
    .replace(new RegExp(OG_IMAGE_URL, 'g'), ogImage)
    .replace(new RegExp(SCHEMA_JSON, 'g'), JSON.stringify(schema))
    .replace(new RegExp(HYDRATION_SCRIPT, 'g'), hydrationScript);
}

// =============================================================================
// Express Route Integration Snippet (add to server/index.ts)
// =============================================================================
/*
import { generateScannerResultsHTML, ScannerResultsData } from './seo/templates/scanner-results-template';

app.get('/scanners/:type', async (req, res) => {
  const { type } = req.params;
  try {
    const data: ScannerResultsData = await fetchScannerData(type);
    const html = generateScannerResultsHTML(type, data);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=60');
    res.send(html);
  } catch (err) {
    console.error('Scanner page error:', err);
    res.status(500).send('Error generating scanner results. Try again later.');
  }
});

// Optional: alias /screens/:type to /scanners/:type for backward compatibility
app.get('/screens/:type', async (req, res) => {
  const { type } = req.params;
  try {
    const data: ScannerResultsData = await fetchScannerData(type);
    const html = generateScannerResultsHTML(type, data);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=60');
    res.send(html);
  } catch (err) {
    console.error('Screen page error:', err);
    res.status(500).send('Error generating screen results. Try again later.');
  }
});

async function fetchScannerData(type: string): Promise<ScannerResultsData> {
  // Example: fetch from internal scanner engine, database, or cache
  // return await db.scanners.findOne({ type });
  // return await fetch(\`https://api.gistify.pro/scanners/\${type}\`).then(r => r.json());
  throw new Error('fetchScannerData not implemented');
}
*/
