# Gistify Reddit Post Templates

> Ready-to-post text posts. No direct links in the main body. Follow each subreddit's tone. Customize bracket placeholders before posting.

---

## 1. r/options — Sunday Earnings Preview

**Title:** Sunday Earnings Preview: Top 10 Earnings Plays for [Week] — IV Rank & Setup Analysis

**Body:**

Hey r/options — weekly earnings preview is back. Here's what I'm watching for [Week] based on IV Rank, expected moves, and recent price action.

I run a momentum scanner that flags these setups automatically, but the analysis below is all manual. Happy to share details if anyone's interested.

---

**Top 10 Earnings Plays:**

| Ticker | Report Date | Time | IV Rank | Expected Move | Setup Suggestion |
|--------|-------------|------|---------|---------------|------------------|
| [Ticker1] | [Date] | BMO | [X]% | ±[X]% | [Straddle/Iron Condor] |
| [Ticker2] | [Date] | AMC | [X]% | ±[X]% | [Directional Call/Put] |
| [Ticker3] | [Date] | BMO | [X]% | ±[X]% | [Strangle] |
| [Ticker4] | [Date] | AMC | [X]% | ±[X]% | [Call Spread/Put Spread] |
| [Ticker5] | [Date] | BMO | [X]% | ±[X]% | [Iron Condor] |
| [Ticker6] | [Date] | AMC | [X]% | ±[X]% | [Directional] |
| [Ticker7] | [Date] | BMO | [X]% | ±[X]% | [Straddle] |
| [Ticker8] | [Date] | AMC | [X]% | ±[X]% | [Put Spread] |
| [Ticker9] | [Date] | BMO | [X]% | ±[X]% | [Call Spread] |
| [Ticker10] | [Date] | AMC | [X]% | ±[X]% | [Strangle] |

---

**What I'm looking at this week:**

- **[Ticker1]**: IV Rank sitting at [X]%, which is [X]th percentile for the past year. The stock has moved [X]% on average over the last 8 reports. Directional bias: [bullish/bearish/neutral] based on [technical/fundamental reason].
- **[Ticker2]**: Post-earnings IV crush has averaged [X]% over the last 4 quarters. If you're selling premium, this is one to watch.
- **[Ticker5]**: Wide expected move but low actual realized vol historically. Iron Condor at [X]/$[X] wings looks interesting.

**My rules for earnings plays:**
1. IV Rank > 50% = premium is expensive → consider selling
2. IV Rank < 30% = premium is cheap → consider buying
3. Always know your max loss before you enter
4. Never risk more than 2% of account on a single earnings play

What's on your earnings radar this week? Any tickers I'm missing?

---

## 2. r/thetagang — Mid-Week IV Crush Report

**Title:** Mid-Week IV Crush Report: This Week's Post-Earnings Volatility Collapse Analysis

**Body:**

Thetagang — time for the mid-week vol crush check-in. Here's how the earnings plays played out so far.

**IV Crush Scorecard (Monday–Wednesday):**

| Ticker | Pre-Earnings IV | Post-Earnings IV | Crush % | Straddle Price Change | Theta Profit |
|--------|-----------------|------------------|---------|----------------------|--------------|
| [Ticker1] | [X]% | [X]% | -[X]% | $[X] → $[X] | $[X] |
| [Ticker2] | [X]% | [X]% | -[X]% | $[X] → $[X] | $[X] |
| [Ticker3] | [X]% | -[X]% | -[X]% | $[X] → $[X] | $[X] |
| [Ticker4] | [X]% | [X]% | -[X]% | $[X] → $[X] | $[X] |
| [Ticker5] | [X]% | [X]% | -[X]% | $[X] → $[X] | $[X] |

---

**The winners:**
- **[Ticker1]** crushed [X]% as expected. Sold the [straddle/strangle] at [X] DTE for $[X], bought back at $[X] the next morning. Clean theta capture.
- **[Ticker2]** was a bit tricky — the stock moved [X]% against the short side but the vol collapse more than offset directional risk. Net profit: $[X] per contract.

**The surprise:**
- **[Ticker3]** missed on revenue and IV actually *expanded* post-earnings. This is why position sizing matters — even "high probability" setups can go sideways. My loss was contained to [X]% of the trade because I sized for the max loss.

**What I'm watching Thursday/Friday:**
- [Ticker6] reports [time] tomorrow. IV Rank at [X]%. Looking at a [setup type].
- [Ticker7] is the big one — [X]% expected move, but historically only moves [X]%. Potential vol seller's dream if the straddle is priced too high.

I track all of this through a scanner I built that monitors IV Rank, expected moves, and historical realized vol. Happy to share details if anyone's interested.

What crushed for you this week? Any painful surprises?

---

## 3. r/algotrading — Momentum Scanner Build

**Title:** How I Built a Momentum Scanner That Filters 50+ Stocks in Under 5 Seconds

**Body:**

r/algotrading — wanted to share the architecture of a scanner I've been building and iterating on. Not here to sell anything. Just sharing what worked and what didn't.

**The Problem:**
I was spending 30+ minutes every morning building a watchlist across Finviz, TradingView, and my broker's scanner. By the time I finished, the best setups were already moving. I needed something that could rank everything in one place — fast.

**The Solution:**
A real-time pipeline that pulls market data, runs technical indicators, scores confluence, and ranks by setup quality. Here's the stack:

**Data Layer:**
- Real-time price data via [broker API / data provider]
- Options data (IV, IV Rank, expected move) via [provider]
- Earnings calendar feed

**Indicator Layer:**
- VWAP with standard deviation bands
- CPR (Central Pivot Range) — S1, R1, central pivot
- RSI, MACD, Bollinger %B for confluence scoring
- Relative volume vs. 20-day average

**Scoring Engine:**
Each stock gets a confluence score (0-100) based on:
- How many indicators align (e.g., VWAP bounce + RSI oversold + CPR support)
- Volume confirmation
- Options flow skew (call/put ratio)
- IV Rank regime (sell vol when high, buy when low)

**Output:**
A ranked list with setup type (CALL/PUT), entry level, stop, target, and confidence score. Refresh every 15 minutes during market hours.

**What I learned:**
- **Speed matters more than perfection.** A "good enough" scan in 5 seconds beats a "perfect" scan in 5 minutes.
- **Confluence > single indicator.** A stock at VWAP alone is a coin flip. VWAP + RSI oversold + volume spike = edge.
- **IV Rank is underrated.** Most retail traders look at IV. IV Rank tells you if that IV is actually expensive or cheap *for that stock*.

**Current stack:**
Frontend: React + lightweight charting
Backend: Node.js + real-time data feeds
Scoring: Custom weighted algorithm (backtested on 2 years of data)

I use this scanner daily for my options trading. If anyone's interested in the methodology or wants to discuss the scoring logic, happy to share more.

What's your scanner setup? Any indicators you'd add?

---

## 4. r/Daytrading — Monday Momentum Scan

**Title:** Monday Momentum Scan: Top 20 Stocks with Technical Levels and Setup Types

**Body:**

Happy Monday, traders. Here's my pre-market momentum scan for today. 20 stocks filtered by relative volume, VWAP position, and technical confluence.

I generate this through a scanner I built that tracks these metrics in real-time. Happy to share details if anyone's interested.

**Top 20 Momentum Plays:**

| Rank | Ticker | Setup | Price | VWAP | Key Level | Stop | Target | Confidence |
|------|--------|-------|-------|------|-----------|------|--------|------------|
| 1 | [Ticker1] | CALL | $[X] | Above | $[X] | $[X] | $[X] | [X]% |
| 2 | [Ticker2] | PUT | $[X] | Below | $[X] | $[X] | $[X] | [X]% |
| 3 | [Ticker3] | CALL | $[X] | Above | $[X] | $[X] | $[X] | [X]% |
| 4 | [Ticker4] | PUT | $[X] | Below | $[X] | $[X] | $[X] | [X]% |
| 5 | [Ticker5] | CALL | $[X] | Above | $[X] | $[X] | $[X] | [X]% |
| 6 | [Ticker6] | PUT | $[X] | Below | $[X] | $[X] | $[X] | [X]% |
| 7 | [Ticker7] | CALL | $[X] | Above | $[X] | $[X] | $[X] | [X]% |
| 8 | [Ticker8] | PUT | $[X] | Below | $[X] | $[X] | $[X] | [X]% |
| 9 | [Ticker9] | CALL | $[X] | Above | $[X] | $[X] | $[X] | [X]% |
| 10 | [Ticker10] | PUT | $[X] | Below | $[X] | $[X] | $[X] | [X]% |
| 11 | [Ticker11] | CALL | $[X] | Above | $[X] | $[X] | $[X] | [X]% |
| 12 | [Ticker12] | PUT | $[X] | Below | $[X] | $[X] | $[X] | [X]% |
| 13 | [Ticker13] | CALL | $[X] | Above | $[X] | $[X] | $[X] | [X]% |
| 14 | [Ticker14] | PUT | $[X] | Below | $[X] | $[X] | $[X] | [X]% |
| 15 | [Ticker15] | CALL | $[X] | Above | $[X] | $[X] | $[X] | [X]% |
| 16 | [Ticker16] | PUT | $[X] | Below | $[X] | $[X] | $[X] | [X]% |
| 17 | [Ticker17] | CALL | $[X] | Above | $[X] | $[X] | $[X] | [X]% |
| 18 | [Ticker18] | PUT | $[X] | Below | $[X] | $[X] | $[X] | [X]% |
| 19 | [Ticker19] | CALL | $[X] | Above | $[X] | $[X] | $[X] | [X]% |
| 20 | [Ticker20] | PUT | $[X] | Below | $[X] | $[X] | $[X] | [X]% |

---

**How I use this:**
- I focus on the top 5 by confidence score
- I need to see VWAP alignment + volume confirmation before entry
- If VIX > 25, I favor mean reversion (PUT) setups. If VIX < 20, I favor momentum continuation (CALL) setups.
- No trade before 9:45 ET. Let the first 15 minutes settle.

**Market context today:**
- VIX: [X] (calm/choppy/volatile)
- SPY: [above/below] VWAP — [bullish/bearish] bias
- QQQ: [above/below] VWAP — tech [strong/weak]
- IWM: [above/below] VWAP — small caps [leading/lagging]

**My rules today:**
1. Max 3 trades before lunch
2. No revenge trading if the first one stops out
3. Walk away if nothing sets up by 11:00

What's on your watchlist today? Any tickers I'm missing?

---

## 5. r/wallstreetbets — Earnings Play Breakdown

**Title:** Earnings Play Breakdown: [Ticker] — Why IV Rank [X]% Makes This a [Setup] Setup

**Body:**

Alright degenerates, here's an actual analysis post instead of a rocket emoji chain. [Ticker] reports [Date] at [Time] ET. Here's why I'm watching it.

**The Numbers:**
- IV Rank: [X]% — that's [X]th percentile over the past year. Translation: options are [expensive/cheap] as fuck right now.
- Expected Move: ±[X]% (priced into the straddle)
- Historical Average Move: ±[X]% (what the stock actually did the last 8 reports)
- Implied vs. Realized Vol Spread: [X]% — [favoring buyers/sellers]

**The Setup:**
[Directional/Neutral thesis here — e.g., "I'm going with a straddle because the stock has moved less than expected in 6 of the last 8 reports, and IV Rank at 75% means you're paying a fat premium for those options."]

**My Play:**
- [Setup Type]: [e.g., Short Straddle at $X / Iron Condor at $X-$X wings / Call Spread at $X/$X]
- Max Profit: $[X]
- Max Loss: $[X]
- Breakevens: $[X] and $[X]
- Risk/Reward: [X]:1

**Why this might work:**
1. [Technical reason — e.g., "The stock is pinned between CPR S1 and R1. No clear directional bias."]
2. [Volatility reason — e.g., "IV Rank is in the 80th percentile. Even a moderate move will crush the straddle."]
3. [Historical reason — e.g., "Last 4 beats: 3 misses. The market is pricing in uncertainty that may not materialize."]

**Why this might blow up:**
1. [Ticker] could gap [X]% on a surprise and you're fucked if directional
2. [Sector] is moving as a group, so stock-specific vol might not matter
3. I might be wrong about everything because I'm a random person on the internet

**Position Sizing:**
I'm risking [X]% of my account on this. If it goes to max loss, I move on. No "it'll come back" hopium.

I built a scanner that tracks IV Rank, expected moves, and historical realized vol for all earnings plays. Happy to share details if anyone's interested.

**TL;DR:** [One-sentence summary — e.g., "IV is fat, stock is range-bound, selling premium."]

Not financial advice. I eat crayons. Do your own research.

What's your [Ticker] play? Anyone else selling vol or are you all buying lotto tickets?

---

*Last updated: 2025-07-07 | Gistify Growth Team*
