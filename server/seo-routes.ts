// server/seo-routes.ts
// Programmatic SEO routes for Gistify — /earnings/:ticker, /strategies/:slug, /scanners/:type
// Mounts cleanly into server/index.ts via registerSeoRoutes(app)

import type { Express, Request, Response } from "express";
import {
  generateEarningsPreviewHTML,
  type EarningsPreviewData,
} from "./templates/earnings-preview-template";
import {
  generateStrategyGuideHTML,
  type StrategyGuideData,
} from "./templates/strategy-guide-template";
import {
  generateScannerResultsHTML,
  type ScannerResultsData,
} from "./templates/scanner-results-template";

// ── MOCK DATA (TODO: replace with real API / DB calls) ──────────────────────

const mockEarningsData: Record<string, EarningsPreviewData> = {
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
      "NVDA's IV Rank (91) is in the top decile. Historical post-earnings moves average 8.9%, exceeding the expected move of 7.2%. High-conviction straddle setup. Must exit at open next day.",
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
      "TSLA's IV Rank (82) is elevated. Historical moves average 6.4%, close to expected move of 6.5%. TSLA is highly volatile and unpredictable. Straddle captures the move.",
  },
  MSFT: {
    ticker: "MSFT",
    companyName: "Microsoft Corporation",
    reportDate: "2025-07-28",
    reportTime: "AMC",
    ivRank: 55,
    ivPercentile: 60,
    expectedMove: 3.2,
    epsEstimate: 3.15,
    revenueEstimate: 65_000,
    historicalMoves: [
      { quarter: "Q4 2025", move: 2.8, direction: "up" },
      { quarter: "Q3 2025", move: 1.5, direction: "down" },
      { quarter: "Q2 2025", move: 3.1, direction: "up" },
      { quarter: "Q1 2025", move: 2.2, direction: "up" },
    ],
    setupSuggestion: "Call Spread",
    setupReasoning:
      "MSFT's IV Rank (55) is moderate. Historical moves average 2.4%, below expected move of 3.2%. Call spread is safer — limited risk with upside capture. Less IV crush exposure than straddle.",
  },
  AMD: {
    ticker: "AMD",
    companyName: "Advanced Micro Devices",
    reportDate: "2025-07-29",
    reportTime: "AMC",
    ivRank: 75,
    ivPercentile: 78,
    expectedMove: 5.5,
    epsEstimate: 0.72,
    revenueEstimate: 6_800,
    historicalMoves: [
      { quarter: "Q2 2025", move: 4.2, direction: "up" },
      { quarter: "Q1 2025", move: 6.8, direction: "down" },
      { quarter: "Q4 2024", move: 3.5, direction: "up" },
      { quarter: "Q3 2024", move: 7.2, direction: "up" },
    ],
    setupSuggestion: "Straddle",
    setupReasoning:
      "AMD's IV Rank (75) is elevated. Historical moves average 5.4%, close to expected move of 5.5%. Straddle captures the bi-directional move. Risk: high gamma, need to exit quickly post-earnings.",
  },
};

const mockStrategyData: Record<string, StrategyGuideData> = {
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
      "Never hold into the last 7 days before expiration.",
    ],
    riskManagement: [
      "Max 2-3% of account per iron condor.",
      "Monitor Delta neutrality — adjust if one side gains too much Delta.",
      "Have a defense plan ready before entry.",
      "Avoid earnings week.",
    ],
    realExample: {
      ticker: "SPY",
      date: "2025-06-15",
      setup: "Sold $550/$555 call spread + $530/$525 put spread, 30 DTE, collected $1.50 credit",
      result: "SPY stayed between $525-$555. Closed at 50% profit ($0.75) after 14 days.",
    },
    pros: [
      "High probability of profit (60-70% if managed well).",
      "Profits from time decay (Theta).",
      "Defined risk.",
    ],
    cons: [
      "Limited profit — you can only make the net credit.",
      "Requires active management if the underlying moves.",
      "Commissions can eat into profits.",
    ],
    relatedStrategies: ["strangle", "calendar-spread", "butterfly-spread"],
  },
  "0dte-straddle": {
    slug: "0dte-straddle",
    title: "0DTE Straddle",
    description:
      "Buy an ATM call and an ATM put with the same strike and same-day expiration. A pure volatility play that profits from large directional moves.",
    difficulty: "Advanced",
    direction: "Bi-Directional",
    maxProfit: "Unlimited (theoretically)",
    maxLoss: "Total premium paid for both legs",
    breakeven: "ATM strike ± total premium paid",
    idealMarket: "High volatility, expected large move",
    idealIV: "Any",
    setupSteps: [
      "Identify a high-conviction catalyst: FOMC, CPI, PPI, or major earnings.",
      "Buy an ATM call and an ATM put with 0DTE expiration.",
      "Ensure the underlying is highly liquid (SPY, QQQ, IWM preferred).",
      "Enter 15-30 minutes before the catalyst.",
      "Size: max 0.5% of account per 0DTE straddle.",
    ],
    entryRules: [
      "VIX > 20 OR a major scheduled catalyst within 2 hours.",
      "Underlying has average daily range > 1.5%.",
      "ATM straddle price is < 1.5% of stock price.",
      "You can watch the trade in real-time.",
    ],
    exitRules: [
      "Take 50% profit immediately if available.",
      "Time stop: exit by 15:30 regardless of P&L.",
      "Stop loss: 50% of premium.",
      "If the catalyst is a non-event, exit immediately.",
    ],
    riskManagement: [
      "Max 0.5% of account per trade.",
      "Daily loss limit: 2% of account = stop trading for the day.",
      "Never hold past 15:45.",
      "Paper trade for 2 weeks before using real money.",
    ],
    realExample: {
      ticker: "SPY",
      date: "2025-03-19",
      setup: "Bought $598 ATM call + $598 ATM put at 13:45, total cost $4.10, FOMC at 14:00",
      result: "SPY dropped 1.8% post-FOMC. Put leg went to $5.80. Closed at 14:45 for +41%.",
    },
    pros: [
      "No overnight risk.",
      "Profits from large moves regardless of direction.",
      "No Theta decay worry.",
    ],
    cons: [
      "Extremely high risk — can lose 100% of premium quickly.",
      "Requires constant monitoring.",
      "Wide spreads on low-volume stocks.",
    ],
    relatedStrategies: ["0dte-strangle", "earnings-straddle", "iron-condor"],
  },
  "earnings-gap-fade": {
    slug: "earnings-gap-fade",
    title: "Earnings Gap Fade",
    description:
      "After an earnings report, the stock gaps up or down. The gap fade strategy bets that the stock will retrace part of the gap within the first 30-60 minutes.",
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
      "First 5-min candle shows rejection.",
      "No additional major news catalyst the same morning.",
    ],
    exitRules: [
      "Target: 50% gap retrace.",
      "Stop loss: beyond the gap extreme.",
      "Time stop: exit by 10:30 if no retrace.",
      "If the stock reverts to VWAP, take profit immediately.",
    ],
    riskManagement: [
      "Max 1% of account per gap fade trade.",
      "Never fade a gap on low-float stocks.",
      "Avoid fading on the same day as a major index event.",
      "If the gap is > 15%, skip.",
    ],
    realExample: {
      ticker: "META",
      date: "2025-04-24",
      setup: "META gapped up 8.2% after earnings. Opened at $515. First 5-min candle showed rejection wick at $518. Entered PUT at $516.50.",
      result: "META retraced to $508 by 10:15 (50% retrace). Closed for +$8.50 per share.",
    },
    pros: [
      "High probability on large gaps (> 70% of gaps > 5% retrace at least 30%).",
      "Quick trades — usually done within 60 minutes.",
      "No overnight risk.",
    ],
    cons: [
      "Requires fast execution and monitoring.",
      "Can be catastrophic if the gap continues.",
      "Low-float stocks can be manipulated.",
    ],
    relatedStrategies: ["momentum-continuation", "vwap-bounce", "opening-range-breakout"],
  },
};

const mockScannerData: Record<string, ScannerResultsData> = {
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
      "IV Rank > 50",
      "Midas Atlas confluence score > 60",
      "No earnings within next 24 hours",
    ],
    methodology:
      "Midas Atlas scores each stock on 5 timeframes (1m, 5m, 15m, 1h, 4h) using RSI, MACD, StochRSI, Bollinger %B, and Ichimoku. A confluence score > 60 means 3+ indicators align on 2+ timeframes.",
  },
  "high-iv": {
    type: "high-iv",
    title: "High IV",
    description:
      "Stocks with elevated implied volatility — ideal for premium selling strategies.",
    lastUpdated: new Date().toISOString(),
    stocks: [
      { ticker: "NVDA", price: 142.8, change: 4.1, changePercent: 2.95, volume: 62_500_000, ivRank: 91, setup: "NEUTRAL", signal: "IV Rank 91 — premium selling zone" },
      { ticker: "TSLA", price: 263.4, change: -3.2, changePercent: -1.2, volume: 28_000_000, ivRank: 82, setup: "NEUTRAL", signal: "IV Rank 82 — iron condor candidate" },
      { ticker: "AMD", price: 178.2, change: 3.5, changePercent: 2.0, volume: 38_000_000, ivRank: 72, setup: "NEUTRAL", signal: "IV Rank 72 — strangle setup" },
      { ticker: "AMZN", price: 198.5, change: 0.8, changePercent: 0.4, volume: 22_000_000, ivRank: 65, setup: "NEUTRAL", signal: "IV Rank 65 — credit spread zone" },
    ],
    scanCriteria: [
      "IV Rank > 60",
      "Average daily volume > 5M shares",
      "No earnings within 7 days",
      "Stock price between $50-$500",
      "Bid-ask spread < 5% on ATM options",
    ],
    methodology:
      "High IV stocks are identified by comparing current implied volatility to the 52-week range. IV Rank > 60 means the stock is in the top 40% of its annual volatility range.",
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
      "IV Rank > 50",
      "Expected move > 2.5%",
      "Historical post-earnings move > expected move",
      "No conflicting major macro event the same day",
    ],
    methodology:
      "Pre-earnings scanner pulls upcoming earnings dates and filters by IV Rank and expected move. Only stocks with sufficient volatility and liquid options chains are included.",
  },
};

// ── ROUTE REGISTRATION ──────────────────────────────────────────────────────

export function registerSeoRoutes(app: Express): void {
  // ── /earnings/:ticker ──
  app.get("/earnings/:ticker", (req: Request, res: Response) => {
    const { ticker } = req.params;
    const data = mockEarningsData[ticker.toUpperCase()];

    if (!data) {
      res.status(404).type("html").send(
        `<!DOCTYPE html><html><head><title>${ticker.toUpperCase()} Not Found | Gistify</title></head><body style="background:#0f172a;color:#e2e8f0;text-align:center;padding:4rem;"><h1 style="color:#10b981">${ticker.toUpperCase()}</h1><p>No earnings preview available yet.</p><a href="/" style="color:#10b981">← Back to Gistify</a></body></html>`
      );
      return;
    }

    const html = generateEarningsPreviewHTML(data);
    res.setHeader("Cache-Control", "public, max-age=60");
    res.status(200).type("html").send(html);
  });

  // ── /strategies/:slug ──
  app.get("/strategies/:slug", (req: Request, res: Response) => {
    const { slug } = req.params;
    const data = mockStrategyData[slug];

    if (!data) {
      res.status(404).type("html").send(
        `<!DOCTYPE html><html><head><title>${slug} Strategy | Gistify</title></head><body style="background:#0f172a;color:#e2e8f0;text-align:center;padding:4rem;"><h1 style="color:#10b981">${slug}</h1><p>Strategy guide coming soon.</p><a href="/" style="color:#10b981">← Back to Gistify</a></body></html>`
      );
      return;
    }

    const html = generateStrategyGuideHTML(data);
    res.setHeader("Cache-Control", "public, max-age=300");
    res.status(200).type("html").send(html);
  });

  // ── /scanners/:type ──
  app.get("/scanners/:type", (req: Request, res: Response) => {
    const { type } = req.params;
    const data = mockScannerData[type];

    if (!data) {
      res.status(404).type("html").send(
        `<!DOCTYPE html><html><head><title>${type} Scanner | Gistify</title></head><body style="background:#0f172a;color:#e2e8f0;text-align:center;padding:4rem;"><h1 style="color:#10b981">${type}</h1><p>Scanner results coming soon.</p><a href="/" style="color:#10b981">← Back to Gistify</a></body></html>`
      );
      return;
    }

    const html = generateScannerResultsHTML(data);
    res.setHeader("Cache-Control", "public, max-age=30");
    res.status(200).type("html").send(html);
  });

  // Alias: /screens/:type → /scanners/:type
  app.get("/screens/:type", (req: Request, res: Response) => {
    res.redirect(301, `/scanners/${req.params.type}`);
  });
}
