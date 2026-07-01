// =============================================================================
// Gistify.pro — Programmatic SEO Routes Integration
// Add this block to server/index.ts after the existing imports and before app.listen()
// =============================================================================

// ── 1. IMPORT TEMPLATES ───────────────────────────────────────────────────────
// Add these imports at the TOP of server/index.ts (after existing imports)
// If you used a different path for the templates, adjust accordingly.

/*
import {
  generateEarningsPreviewHTML,
  type EarningsPreviewData,
} from "../seo/templates/earnings-preview-template";
import {
  generateStrategyGuideHTML,
  type StrategyGuideData,
} from "../seo/templates/strategy-guide-template";
import {
  generateScannerResultsHTML,
  type ScannerResultsData,
} from "../seo/templates/scanner-results-template";
*/

// NOTE: If the templates are in a different location relative to the compiled
// server output, adjust the import path. For Vite/Express, the templates
// should be in the same directory or a sibling that gets copied to dist.
// Alternative: place them in server/ and import from "./templates/..."

// ── 2. DATA FETCH FUNCTIONS (MOCK + PLACEHOLDER) ────────────────────────────
// These are placeholder data sources. Replace with real API calls or DB queries.

// Mock earnings data (replace with real API: e.g., Alpha Vantage, Yahoo Finance, your own DB)
async function fetchEarningsData(ticker: string): Promise<EarningsPreviewData | null> {
  // TODO: Replace with real API call
  // Example: const res = await fetch(`https://api.gistify.pro/earnings/${ticker}`);
  // Example: const data = await db.select().from(earnings).where({ ticker });

  const mockData: Record<string, EarningsPreviewData> = {
    AAPL: {
      ticker: "AAPL",
      companyName: "Apple Inc.",
      reportDate: "2025-07-29",
      reportTime: "AMC",
      ivRank: 68,
      ivPercentile: 72,
      expectedMove: 3.8,
      epsEstimate: 1.35,
      revenueEstimate: 85_200,
      historicalMoves: [
        { quarter: "Q2 2025", move: 2.1, direction: "up" },
        { quarter: "Q1 2025", move: 4.5, direction: "down" },
        { quarter: "Q4 2024", move: 1.8, direction: "up" },
        { quarter: "Q3 2024", move: 3.2, direction: "down" },
      ],
      setupSuggestion: "Straddle",
      setupReasoning:
        "AAPL's IV Rank (68) is elevated but not extreme. Historical post-earnings moves average 2.9%, close to the expected move of 3.8%. A long straddle at-the-money captures the directional move regardless of beat/miss. Risk: IV crush if the move is smaller than expected.",
    },
    NVDA: {
      ticker: "NVDA",
      companyName: "NVIDIA Corporation",
      reportDate: "2025-08-27",
      reportTime: "AMC",
      ivRank: 91,
      ivPercentile: 89,
      expectedMove: 7.2,
      epsEstimate: 0.72,
      revenueEstimate: 28_500,
      historicalMoves: [
        { quarter: "Q1 2025", move: 8.5, direction: "up" },
        { quarter: "Q4 2024", move: 12.3, direction: "up" },
        { quarter: "Q3 2024", move: 5.1, direction: "down" },
        { quarter: "Q2 2024", move: 9.8, direction: "up" },
      ],
      setupSuggestion: "Straddle",
      setupReasoning:
        "NVDA's IV Rank (91) is in the top decile. Historical post-earnings moves average 8.9%, exceeding the expected move of 7.2%. This is a high-conviction straddle setup. Risk: IV crush is severe (expect 50-60% collapse). Must exit at open next day, not hold.",
    },
    TSLA: {
      ticker: "TSLA",
      companyName: "Tesla Inc.",
      reportDate: "2025-07-22",
      reportTime: "AMC",
      ivRank: 82,
      ivPercentile: 85,
      expectedMove: 6.5,
      epsEstimate: 0.48,
      revenueEstimate: 24_800,
      historicalMoves: [
        { quarter: "Q2 2025", move: 5.2, direction: "down" },
        { quarter: "Q1 2025", move: 7.8, direction: "up" },
        { quarter: "Q4 2024", move: 3.4, direction: "down" },
        { quarter: "Q3 2024", move: 9.1, direction: "up" },
      ],
      setupSuggestion: "Straddle",
      setupReasoning:
        "TSLA's IV Rank (82) is elevated. Historical moves average 6.4%, close to expected move of 6.5%. TSLA is highly volatile and unpredictable. Straddle captures the move. Risk: Elon Musk tweets can distort the reaction. Tight time stop required.",
    },
  };

  const upperTicker = ticker.toUpperCase();
  return mockData[upperTicker] || null;
}

// Mock strategy data (replace with real DB or CMS)
async function fetchStrategyData(slug: string): Promise<StrategyGuideData | null> {
  const mockData: Record<string, StrategyGuideData> = {
    "iron-condor": {
      slug: "iron-condor",
      title: "Iron Condor",
      description:
        "A neutral options strategy that profits when the underlying stays within a range. Sell an OTM call spread and an OTM put spread simultaneously.",
      difficulty: "Intermediate",
      direction: "Neutral",
      maxProfit: "Net credit received",
      maxLoss: "Width of wider spread - net credit",
      breakeven: "Short call strike + credit AND short put strike - credit",
      idealMarket: "Range-bound, low volatility",
      idealIV: "High",
      setupSteps: [
        "Choose an underlying with high IV Rank (>50) and range-bound behavior.",
        "Sell an OTM call spread (e.g., $110/$115 on a $100 stock).",
        "Sell an OTM put spread (e.g., $90/$85 on a $100 stock).",
        "Ensure both spreads have the same expiration (usually 30-45 DTE).",
        "Collect net credit. Aim for 1/3 of the spread width.",
      ],
      entryRules: [
        "IV Rank > 50 (you want inflated premiums to sell).",
        "Underlying has been range-bound for 20+ days.",
        "No major earnings or events within the expiration window.",
        "Spread width is 5-10 points per side.",
      ],
      exitRules: [
        "Take profit at 50% of max profit.",
        "If underlying breaches one short strike, roll the threatened side.",
        "If both sides are threatened, close the entire position for a small loss.",
        "Never hold into the last 7 days before expiration (Gamma risk increases).",
      ],
      riskManagement: [
        "Max 2-3% of account per iron condor.",
        "Monitor Delta neutrality — adjust if one side gains too much Delta.",
        "Have a "defense plan" ready before entry (when to roll, when to close).",
        "Avoid earnings week — IV crush can work against you if you are the buyer, but as a seller you want it — just ensure you have enough time.",
      ],
      realExample: {
        ticker: "SPY",
        date: "2025-06-15",
        setup: "Sold $550/$555 call spread + $530/$525 put spread, 30 DTE, collected $1.50 credit",
        result: "SPY stayed between $525-$555. Closed at 50% profit ($0.75) after 14 days.",
      },
      pros: [
        "High probability of profit (win rate often 60-70% if managed well).",
        "Profits from time decay (Theta) when the underlying stays still.",
        "Defined risk — you know the max loss before entering.",
      ],
      cons: [
        "Limited profit — you can only make the net credit.",
        "Requires active management if the underlying moves.",
        " commissions can eat into profits if spreads are too narrow.",
      ],
      relatedStrategies: ["strangle", "calendar-spread", "butterfly-spread"],
    },
    "0dte-straddle": {
      slug: "0dte-straddle",
      title: "0DTE Straddle",
      description:
        "Buy an ATM call and an ATM put with the same strike and same-day expiration. A pure volatility play that profits from large directional moves regardless of direction.",
      difficulty: "Advanced",
      direction: "Bi-Directional",
      maxProfit: "Unlimited (theoretically)",
      maxLoss: "Total premium paid for both legs",
      breakeven: "ATM strike ± total premium paid",
      idealMarket: "High volatility, expected large move",
      idealIV: "Any (but cheaper is better for entry)",
      setupSteps: [
        "Identify a high-conviction catalyst: FOMC, CPI, PPI, or major earnings.",
        "Buy an ATM call and an ATM put with 0DTE expiration.",
        "Ensure the underlying is highly liquid (SPY, QQQ, IWM preferred).",
        "Enter 15-30 minutes before the catalyst (e.g., 14:00 for FOMC at 14:00).",
        "Size: max 0.5% of account per 0DTE straddle.",
      ],
      entryRules: [
        "VIX > 20 OR a major scheduled catalyst within 2 hours.",
        "Underlying has average daily range > 1.5%.",
        "ATM straddle price is < 1.5% of stock price (cheap enough).",
        "You can watch the trade in real-time (no leaving the screen).",
      ],
      exitRules: [
        "Take 50% profit immediately if available.",
        "Time stop: exit by 15:30 regardless of P&L.",
        "Stop loss: 50% of premium — never let it go to zero.",
        "If the catalyst is a non-event, exit immediately (don't hope).",
      ],
      riskManagement: [
        "Max 0.5% of account per trade.",
        "Daily loss limit: 2% of account = stop trading for the day.",
        "Never hold past 15:45 — assignment risk and liquidity dry-up.",
        "Paper trade for 2 weeks before using real money.",
      ],
      realExample: {
        ticker: "SPY",
        date: "2025-03-19",
        setup: "Bought $598 ATM call + $598 ATM put at 13:45, total cost $4.10, FOMC at 14:00",
        result: "SPY dropped 1.8% post-FOMC. Put leg went to $5.80. Closed at 14:45 for +41% ($1.70 profit per contract).",
      },
      pros: [
        "No overnight risk — everything is closed the same day.",
        "Profits from large moves regardless of direction.",
        "No Theta decay worry — you enter and exit within hours.",
      ],
      cons: [
        "Extremely high risk — can lose 100% of premium quickly.",
        "Requires constant monitoring — you cannot step away.",
        "Wide spreads and liquidity issues on low-volume stocks.",
      ],
      relatedStrategies: ["0dte-strangle", "earnings-straddle", "iron-condor"],
    },
    "earnings-gap-fade": {
      slug: "earnings-gap-fade",
      title: "Earnings Gap Fade",
      description:
        "After an earnings report, the stock gaps up or down. The gap fade strategy bets that the stock will retrace part of the gap within the first 30-60 minutes of the next trading day.",
      difficulty: "Intermediate",
      direction: "Bi-Directional",
      maxProfit: "Variable (depends on gap retrace percentage)",
      maxLoss: "If the gap continues and never retraces",
      breakeven: "Entry price of the fade position",
      idealMarket: "Earnings season, high-volatility stocks",
      idealIV: "Any",
      setupSteps: [
        "Identify stocks that gapped > 5% after earnings.",
        "Check the pre-market volume — needs > 2M shares for liquidity.",
        "At 09:30, wait for the first 5-minute candle to close.",
        "If the gap continues with weak volume, enter the fade direction.",
        "Target: 50% retrace of the gap. Stop: beyond the gap extreme.",
      ],
      entryRules: [
        "Gap > 5% (up or down) after earnings.",
        "Pre-market volume > 2M shares.",
        "First 5-min candle shows rejection (long wick, small body).",
        "No additional major news catalyst the same morning.",
      ],
      exitRules: [
        "Target: 50% gap retrace.",
        "Stop loss: beyond the gap extreme (if gap up, stop above the high).",
        "Time stop: exit by 10:30 if no retrace.",
        "If the stock reverts to VWAP, take profit immediately.",
      ],
      riskManagement: [
        "Max 1% of account per gap fade trade.",
        "Never fade a gap on low-float stocks (< 50M shares).",
        "Avoid fading on the same day as a major index event (FOMC, CPI).",
        "If the gap is > 15%, skip — the momentum is too strong.",
      ],
      realExample: {
        ticker: "META",
        date: "2025-04-24",
        setup: "META gapped up 8.2% after earnings. Opened at $515. First 5-min candle showed rejection wick at $518. Entered PUT at $516.50.",
        result: "META retraced to $508 by 10:15 (50% retrace). Closed for +$8.50 per share ($1.70 per $5 wide put spread).",
      },
      pros: [
        "High probability on large gaps (> 70% of gaps > 5% retrace at least 30%).",
        "Quick trades — usually done within 60 minutes.",
        "No overnight risk — you enter after the event.",
      ],
      cons: [
        "Requires fast execution and monitoring.",
        "Can be catastrophic if the gap continues (e.g., 2023 NVDA post-earnings).",
        "Low-float stocks can be manipulated — avoid.",
      ],
      relatedStrategies: ["momentum-continuation", "vwap-bounce", "opening-range-breakout"],
    },
  };

  return mockData[slug] || null;
}

// Mock scanner data (replace with real scanner engine or API)
async function fetchScannerData(type: string): Promise<ScannerResultsData | null> {
  const mockData: Record<string, ScannerResultsData> = {
    momentum: {
      type: "momentum",
      title: "Momentum",
      description:
        "Stocks showing strong directional momentum across multiple timeframes. Scored by Midas Atlas confluence engine.",
      lastUpdated: new Date().toISOString(),
      stocks: [
        { ticker: "AAPL", price: 225.5, change: 2.3, changePercent: 1.02, volume: 45_200_000, ivRank: 68, setup: "CALL", signal: "VWAP bounce, RSI 62, MACD crossover" },
        { ticker: "NVDA", price: 142.8, change: 4.1, changePercent: 2.95, volume: 62_500_000, ivRank: 91, setup: "CALL", signal: "Gap hold, continuation, Bollinger expansion" },
        { ticker: "AMD", price: 178.2, change: 3.5, changePercent: 2.0, volume: 38_000_000, ivRank: 72, setup: "CALL", signal: "Breakout above $175, volume spike" },
        { ticker: "TSLA", price: 263.4, change: -3.2, changePercent: -1.2, volume: 28_000_000, ivRank: 82, setup: "PUT", signal: "Overbought rejection, RSI 78, VWAP fade" },
        { ticker: "META", price: 508.1, change: -2.1, changePercent: -0.41, volume: 15_000_000, ivRank: 55, setup: "PUT", signal: "Weakness vs QQQ, below 20 EMA" },
      ],
      scanCriteria: [
        "Price change > 1.5% in last 15 minutes",
        "Volume > 150% of 20-day average",
        "IV Rank > 50 (options premium worth capturing)",
        "Midas Atlas confluence score > 60",
        "No earnings within next 24 hours (avoid binary events)",
      ],
      methodology:
        "Midas Atlas scores each stock on 5 timeframes (1m, 5m, 15m, 1h, 4h) using RSI, MACD, StochRSI, Bollinger %B, and Ichimoku. A confluence score > 60 means 3+ indicators align on 2+ timeframes. Only stocks with strong directional momentum and liquid options chains are included.",
    },
    "high-iv": {
      type: "high-iv",
      title: "High IV",
      description:
        "Stocks with elevated implied volatility — ideal for premium selling strategies like iron condors, strangles, and credit spreads.",
      lastUpdated: new Date().toISOString(),
      stocks: [
        { ticker: "NVDA", price: 142.8, change: 4.1, changePercent: 2.95, volume: 62_500_000, ivRank: 91, setup: "NEUTRAL", signal: "IV Rank 91 — premium selling zone" },
        { ticker: "TSLA", price: 263.4, change: -3.2, changePercent: -1.2, volume: 28_000_000, ivRank: 82, setup: "NEUTRAL", signal: "IV Rank 82 — iron condor candidate" },
        { ticker: "AMD", price: 178.2, change: 3.5, changePercent: 2.0, volume: 38_000_000, ivRank: 72, setup: "NEUTRAL", signal: "IV Rank 72 — strangle setup" },
        { ticker: "AMZN", price: 198.5, change: 0.8, changePercent: 0.4, volume: 22_000_000, ivRank: 65, setup: "NEUTRAL", signal: "IV Rank 65 — credit spread zone" },
      ],
      scanCriteria: [
        "IV Rank > 60 (elevated premium)",
        "Average daily volume > 5M shares (liquidity for options)",
        "No earnings within 7 days (avoid IV crush timing)",
        "Stock price between $50-$500 (optimal options liquidity)",
        "Bid-ask spread < 5% on ATM options",
      ],
      methodology:
        "High IV stocks are identified by comparing current implied volatility to the 52-week range. IV Rank > 60 means the stock is in the top 40% of its annual volatility range. These stocks offer the highest premium for selling strategies. The scanner filters for liquid options chains to ensure tight bid-ask spreads.",
    },
    "pre-earnings": {
      type: "pre-earnings",
      title: "Pre-Earnings",
      description:
        "Stocks reporting earnings within the next 3 days. Sorted by IV Rank and expected move magnitude.",
      lastUpdated: new Date().toISOString(),
      stocks: [
        { ticker: "PEP", price: 195.2, change: 0.5, changePercent: 0.26, volume: 3_500_000, ivRank: 62, setup: "CALL", signal: "Earnings tomorrow BMO, IV Rank 62, straddle setup" },
        { ticker: "LEVI", price: 18.4, change: 0.2, changePercent: 1.1, volume: 1_800_000, ivRank: 71, setup: "NEUTRAL", signal: "Earnings tomorrow AMC, IV Rank 71, strangle zone" },
        { ticker: "CAG", price: 31.5, change: -0.1, changePercent: -0.32, volume: 2_200_000, ivRank: 58, setup: "CALL", signal: "Earnings Thu BMO, IV Rank 58, call spread" },
      ],
      scanCriteria: [
        "Earnings date within next 3 days",
        "IV Rank > 50 (enough premium to justify the trade)",
        "Expected move > 2.5% (enough directional edge)",
        "Historical post-earnings move > expected move (edge)",
        "No conflicting major macro event the same day",
      ],
      methodology:
        "Pre-earnings scanner pulls upcoming earnings dates from the calendar and filters by IV Rank and expected move. Only stocks with sufficient volatility and liquid options chains are included. Setup suggestions are generated based on historical post-earnings behavior vs. current expected move pricing.",
    },
  };

  return mockData[type] || null;
}

// ── 3. EXPRESS ROUTE INTEGRATION ─────────────────────────────────────────────
// Add these routes inside your main route setup block in server/index.ts
// (after all existing routes, before the SPA fallback)

/*
// ═══════════════════════════════════════════════════════════════════════════
// PROGRAMMATIC SEO ROUTES
// ═══════════════════════════════════════════════════════════════════════════

// ── /earnings/:ticker ──
app.get("/earnings/:ticker", async (req, res) => {
  const { ticker } = req.params;
  const data = await fetchEarningsData(ticker);

  if (!data) {
    // Fallback: serve the SPA and let the client handle the 404
    return res.status(404).send(
      renderStaticMarketingPage(
        `${ticker.toUpperCase()} Earnings Preview | Gistify`,
        `No earnings preview available for ${ticker.toUpperCase()}. Check back soon or explore other tickers.`,
        `<div style="text-align:center;padding:4rem 1rem;"><h1 style="color:#10b981;font-size:2rem;margin-bottom:1rem;">${ticker.toUpperCase()}</h1><p style="color:#94a3b8;margin-bottom:2rem;">No earnings preview available yet. We're working on it.</p><a href="/earnings" style="color:#10b981;text-decoration:underline;">← Back to Earnings Calendar</a></div>`
      )
    );
  }

  const html = generateEarningsPreviewHTML(data);
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "public, max-age=60"); // 1-minute cache for live data
  res.status(200).send(html);
});

// ── /strategies/:slug ──
app.get("/strategies/:slug", async (req, res) => {
  const { slug } = req.params;
  const data = await fetchStrategyData(slug);

  if (!data) {
    return res.status(404).send(
      renderStaticMarketingPage(
        `${slug} Strategy | Gistify`,
        `Strategy guide for ${slug} is coming soon. Explore other options strategies on Gistify.`,
        `<div style="text-align:center;padding:4rem 1rem;"><h1 style="color:#10b981;font-size:2rem;margin-bottom:1rem;">${slug}</h1><p style="color:#94a3b8;margin-bottom:2rem;">This strategy guide is coming soon. Check out our existing guides.</p><a href="/strategies" style="color:#10b981;text-decoration:underline;">← All Strategies</a></div>`
      )
    );
  }

  const html = generateStrategyGuideHTML(data);
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "public, max-age=300"); // 5-minute cache for strategy content
  res.status(200).send(html);
});

// ── /scanners/:type + /screens/:type (alias) ──
app.get("/scanners/:type", async (req, res) => {
  const { type } = req.params;
  const data = await fetchScannerData(type);

  if (!data) {
    return res.status(404).send(
      renderStaticMarketingPage(
        `${type} Scanner | Gistify`,
        `Scanner results for ${type} are coming soon. Explore other scanners on Gistify.`,
        `<div style="text-align:center;padding:4rem 1rem;"><h1 style="color:#10b981;font-size:2rem;margin-bottom:1rem;">${type}</h1><p style="color:#94a3b8;margin-bottom:2rem;">This scanner is coming soon. Check out our existing scanners.</p><a href="/scanners" style="color:#10b981;text-decoration:underline;">← All Scanners</a></div>`
      )
    );
  }

  const html = generateScannerResultsHTML(data);
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "public, max-age=30"); // 30-second cache for live scanner data
  res.status(200).send(html);
});

// Alias: /screens/:type → /scanners/:type
app.get("/screens/:type", async (req, res) => {
  const { type } = req.params;
  return res.redirect(301, `/scanners/${type}`);
});

// ═══════════════════════════════════════════════════════════════════════════
*/

// ── 4. SITEMAP BUILDER UPDATE ──────────────────────────────────────────────
// In your existing `buildSitemapXml()` function, add these URL entries
// to the `urls` array (before the `.join("\n")` call)

/*
// Add these entries inside buildSitemapXml():

// Programmatic SEO pages (static examples for sitemap seeding)
// Earnings preview pages
{ url: `${SITE_URL}/earnings/AAPL`, priority: 0.8, changefreq: "daily" },
{ url: `${SITE_URL}/earnings/NVDA`, priority: 0.8, changefreq: "daily" },
{ url: `${SITE_URL}/earnings/TSLA`, priority: 0.8, changefreq: "daily" },
{ url: `${SITE_URL}/earnings/MSFT`, priority: 0.8, changefreq: "daily" },
{ url: `${SITE_URL}/earnings/AMD`, priority: 0.8, changefreq: "daily" },
{ url: `${SITE_URL}/earnings/AMZN`, priority: 0.8, changefreq: "daily" },
{ url: `${SITE_URL}/earnings/META`, priority: 0.8, changefreq: "daily" },
{ url: `${SITE_URL}/earnings/GOOGL`, priority: 0.8, changefreq: "daily" },
{ url: `${SITE_URL}/earnings/NFLX`, priority: 0.8, changefreq: "daily" },
{ url: `${SITE_URL}/earnings/CRM`, priority: 0.8, changefreq: "daily" },

// Strategy guide pages
{ url: `${SITE_URL}/strategies/iron-condor`, priority: 0.7, changefreq: "weekly" },
{ url: `${SITE_URL}/strategies/0dte-straddle`, priority: 0.7, changefreq: "weekly" },
{ url: `${SITE_URL}/strategies/earnings-gap-fade`, priority: 0.7, changefreq: "weekly" },
{ url: `${SITE_URL}/strategies/vwap-bounce`, priority: 0.7, changefreq: "weekly" },
{ url: `${SITE_URL}/strategies/opening-range-breakout`, priority: 0.7, changefreq: "weekly" },
{ url: `${SITE_URL}/strategies/momentum-continuation`, priority: 0.7, changefreq: "weekly" },
{ url: `${SITE_URL}/strategies/bull-call-spread`, priority: 0.7, changefreq: "weekly" },
{ url: `${SITE_URL}/strategies/bear-put-spread`, priority: 0.7, changefreq: "weekly" },
{ url: `${SITE_URL}/strategies/calendar-spread`, priority: 0.7, changefreq: "weekly" },
{ url: `${SITE_URL}/strategies/butterfly-spread`, priority: 0.7, changefreq: "weekly" },

// Scanner results pages
{ url: `${SITE_URL}/scanners/momentum`, priority: 0.6, changefreq: "hourly" },
{ url: `${SITE_URL}/scanners/high-iv`, priority: 0.6, changefreq: "hourly" },
{ url: `${SITE_URL}/scanners/pre-earnings`, priority: 0.6, changefreq: "hourly" },
{ url: `${SITE_URL}/scanners/gap-up`, priority: 0.6, changefreq: "hourly" },
{ url: `${SITE_URL}/scanners/gap-down`, priority: 0.6, changefreq: "hourly" },
{ url: `${SITE_URL}/scanners/unusual-volume`, priority: 0.6, changefreq: "hourly" },
*/

// ── 5. TYPE DECLARATION (if using TypeScript) ────────────────────────────────
// Add this to server/index.ts or a separate .d.ts file if you get type errors

/*
// If you get "Cannot find module" errors for the templates, add path mapping
// to tsconfig.json:
{
  "compilerOptions": {
    "paths": {
      "@/seo/templates/*": ["./seo/templates/*"]
    }
  }
}

// OR simply copy the template files into the server/ directory and import from "./templates/..."
*/

// =============================================================================
// END OF PROGRAMMATIC SEO INTEGRATION BLOCK
// =============================================================================
