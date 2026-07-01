# IV Crush Explained: What Happens to Options Before, During, and After Earnings

If you trade options around earnings, there is one force more powerful than direction, more predictable than price action, and more destructive to unprepared traders than any bad stock pick: **IV crush**.

Implied volatility crush is the overnight collapse in option premiums that happens after a scheduled event—most dramatically, an earnings report. It can wipe out 50%, 70%, even 90% of an option's time value in a single session. Traders who buy calls or puts before earnings, hoping for a directional windfall, often find themselves right on direction and still losing money.

This guide explains exactly what IV crush is, why it happens, how to measure it, and—most importantly—how to trade around it instead of being crushed by it.

---

## What Is Implied Volatility (IV)? A 2-Minute Primer

### IV vs. Historical Volatility

Implied volatility is not the same as historical volatility. Historical volatility looks backward. It measures how much a stock has actually moved in the past. Implied volatility looks forward. It is the market's best estimate of how much a stock *will* move between now and the option's expiration.

Think of it like insurance pricing. If a hurricane is approaching, insurance premiums spike before the storm hits—not after. Once the storm passes, premiums collapse back to normal. The storm itself may have caused minimal damage, but the uncertainty premium is gone.

Implied volatility works the same way. Before earnings, the market doesn't know if the stock will gap up 10% or down 10%. That uncertainty is priced into every option on the chain. After earnings, the uncertainty is resolved. The gap either happened or it didn't. The premium deflates.

### Why IV Is the "Fear Premium" in Options

IV is often called the fear premium because it rises when uncertainty rises. Not just uncertainty about earnings—uncertainty about macro events, Fed policy, geopolitical shocks, or sector-specific news.

For options traders, IV is a separate profit-and-loss driver. You can be right on the stock direction and still lose money if IV collapses against you. Or you can be directionally neutral and profit purely from the rise and fall of volatility.

Understanding this distinction is the foundation of every advanced options strategy. Delta is direction. Vega is volatility. Theta is time. In earnings trading, vega often matters more than delta.

---

## What Is IV Crush?

### The Mechanics of Volatility Collapse

IV crush is the rapid, often overnight decline in implied volatility after a scheduled event removes uncertainty from the market. The mechanism is simple:

1. Before the event, option market makers demand a premium for the risk of a large gap.
2. The event occurs. The gap either happens or doesn't.
3. The uncertainty is gone. Market makers no longer need the same premium.
4. IV drops. Option prices drop with it.

This is not a theoretical concept. It is a mechanical, repeatable, and highly predictable event. If you know when earnings are scheduled, you know when IV crush will happen.

The crush is most severe in the expiration cycle that includes the earnings date. Weekly options that expire the Friday after a Wednesday earnings report can see IV drop from 80% to 30% overnight. The further-dated expirations (2–4 weeks out) also see declines, but the magnitude is smaller because they still carry uncertainty from future events.

### Why Earnings Are the Biggest IV Crush Events

Earnings are the most reliable and most dramatic IV crush events in the market because they are:

- **Scheduled:** Everyone knows when they happen. No surprise.
- **Binary:** The company beats or misses. The stock moves or it doesn't.
- **Information-dense:** Earnings reports contain revenue, EPS, guidance, margins, and forward commentary. The market reprices everything overnight.
- **Widely traded:** For large-cap names, millions of options contracts change hands in the days before earnings. This liquidity creates deep, tradable IV curves.

Other events (FDA decisions, product launches, legal verdicts) can cause IV spikes, but none are as predictable and widespread as quarterly earnings season.

### Visual: IV Curve Before vs. After Earnings (Text-Based)

Imagine a bell curve. The x-axis is the stock price. The y-axis is probability density. Before earnings, the curve is wide and flat—reflecting the market's uncertainty about where the stock will land. After earnings, the curve is tall and narrow—reflecting the fact that the stock has settled on a new price.

In options terms, this translates to:

- **Before earnings:** ATM implied volatility is 80%. The 100-strike call costs $8.00. The 100-strike put costs $8.00. The market expects a ±$12 move.
- **After earnings:** The stock moved $5. ATM implied volatility is now 35%. The 100-strike call is worth $2.50. The 100-strike put is worth $1.00. The premium has evaporated even though the stock moved.

This is the crush in action. The event occurred, the stock moved, but the move was smaller than the premium priced in. The long option holder is crushed.

---

## The Three Phases of IV Crush

IV crush is not a single moment. It unfolds across three distinct phases, each with its own trading implications.

### Phase 1: Before Earnings (IV Expansion — "The Setup")

In the 5–10 days before an earnings report, implied volatility begins rising. This is the expansion phase. The market starts pricing in the event.

- **What happens:** Option premiums rise. The at-the-money straddle gets more expensive. Out-of-the-money puts and calls gain value even if the stock price barely moves.
- **Who profits:** Traders who bought options early (T-10 to T-7) benefit from the rise in premium. Short volatility traders (iron condors, strangles) start getting squeezed.
- **What to watch:** IV Rank. If IV Rank is already above 80%, the easy expansion is done. If it's below 40%, there's still room for the pre-event ramp.

### Phase 2: The Earnings Event (IV Peak — "The Trap")

On the day of earnings, IV reaches its maximum. The market has priced in the maximum expected move. The straddle is at its most expensive. The options chain is swollen with premium.

- **What happens:** This is the point of maximum risk for long volatility traders. You are paying top dollar for the option. To profit, the stock must move *more* than the expected move. Anything less, and the IV crush will eat your gains.
- **Who profits:** Short volatility traders who entered before the peak. They collected the premium and are now waiting for the collapse.
- **What to watch:** The expected move vs. the historical average move. If the expected move is much larger than history, the setup favors sellers. If it's smaller, it favors buyers.

### Phase 3: After Earnings (IV Collapse — "The Crush")

The report is out. The stock has gapped. And now the premium that was priced in for the event is worthless.

- **What happens:** IV drops 40–70% in a single session. The weekly options that were trading at $5.00 are now worth $1.50. The stock moved 4%, but the expected move was 6%. The long option holder is down 40% despite being right on direction.
- **Who profits:** Short volatility traders. Iron condor sellers. Strangle sellers. Anyone who collected premium before the event and let time and uncertainty do the work.
- **What to watch:** How the stock behaves in the first 30 minutes. If the gap reverses (gap fade), the short volatility position can profit from both the IV crush and the directional reversal.

Understanding these three phases is the key to timing your entries and exits. Buy before the peak, sell into the peak, or sell before the peak and let the crush do the work. Each approach requires a different strategy and a different risk profile.

---

## How to Measure IV Crush Risk Before You Trade

### IV Rank vs. IV Percentile (Which to Use?)

IV Rank and IV Percentile are both measures of how expensive options are relative to history. They answer the same question but with slightly different math.

- **IV Rank:** (Current IV − 52-Week Low IV) ÷ (52-Week High IV − 52-Week Low IV). Tells you where current IV sits within the year's range.
- **IV Percentile:** The percentage of days in the past year where IV was *lower* than today. Tells you how many days were cheaper.

**For earnings trading, IV Rank is usually more useful.** It tells you whether the options are near their most expensive or cheapest levels of the year. An IV Rank of 90% means you're paying close to the top of the year's range. An IV Rank of 15% means you're getting a discount.

The general rule:
- **IV Rank > 70%:** Favors short volatility strategies (sell premium).
- **IV Rank < 30%:** Favors long volatility strategies (buy premium).
- **IV Rank 30–70%:** Neutral zone. Use directional spreads.

### The Expected Move Formula

The options market prices the expected move into the at-the-money straddle. You can estimate it with a simple formula:

**Expected Move = Stock Price × (IV × √(Days to Expiration / 365))**

For a quick approximation using the nearest weekly expiration:

**Expected Move ≈ Stock Price × (IV × √(Days/365))**

**Example:** A stock is trading at $200. IV is 50%. The earnings are in 7 days.

Expected Move = $200 × (0.50 × √(7/365)) = $200 × (0.50 × 0.139) = $200 × 0.0695 = **$13.90**

This means the market is pricing in a ±$13.90 move (about ±7%) for the event. If you believe the stock will move more than $13.90, buying a straddle or strangle has edge. If you believe it will move less, selling a strangle or iron condor has edge.

A simpler, faster proxy: the price of the at-the-money call + the at-the-money put. If the 200 call is $7.00 and the 200 put is $6.50, the market expects a ±$13.50 move. This is the straddle price and it is often more accurate than the formula because it uses live market prices.

### Reading the Options Chain for IV Crush Clues

The options chain tells you what the market expects. Before earnings, look at:

- **The ATM straddle price:** This is the expected move in dollars.
- **The skew:** Are puts or calls more expensive? If puts are pricing much higher than calls, the market is hedging downside risk. This often happens ahead of uncertain reports.
- **The term structure:** Compare IV across expirations. If the weekly expiration is at 80% and the monthly is at 45%, the market is pricing the event heavily into the weekly. The crush will be concentrated there.

Gistify surfaces IV Rank and IV Percentile automatically in the Pre-Earnings Brief—so you can see the risk before you size the trade.

---

## IV Crush Strategies: Long vs. Short Volatility

### When to BUY Options Before Earnings (Long Volatility)

You should buy options when the market is underpricing the move. The signals:

- IV Rank is below 30% (options are cheap relative to the year)
- The expected move is smaller than the stock's historical average earnings move
- The stock is breaking out or breaking down on volume into the event
- The whisper number diverges significantly from consensus

**Best strategies for long volatility:**
- Long straddles (directionally neutral, need large move)
- Long strangles (cheaper than straddle, need even larger move)
- Naked calls or puts (directional, high risk, high reward)

The key risk: even if you are right on direction and the move is large, you still need to overcome the premium you paid. If you paid $12 for a straddle and the stock moves $10, you lose money. The move must exceed the expected move.

### When to SELL Options Before Earnings (Short Volatility)

You should sell options when the market is overpricing the move. The signals:

- IV Rank is above 70% (options are expensive)
- The expected move is larger than the stock's historical average earnings move
- The stock has been range-bound for weeks
- The options market is pricing in a panic that probably won't materialize

**Best strategies for short volatility:**
- Short strangles (sell OTM call and put, profit from range-bound action)
- Iron condors (defined-risk version of the strangle)
- Credit spreads (directional short volatility with capped risk)

The key risk: if the stock moves more than expected, losses can be substantial. Short strangles have unlimited risk on the call side and large risk on the put side. Iron condors cap the risk but also cap the reward.

### The Straddle Buyer's Nightmare (Real Example with AAPL)

In January 2024, AAPL reported earnings after the close. The stock was at $185. The weekly 185 straddle was trading at $8.50, implying a ±$8.50 expected move (about 4.6%).

AAPL beat EPS but missed on iPhone revenue. The stock opened the next day at $183.50—down $1.50. By noon, it was at $182.00. The straddle that cost $8.50 was now worth $3.00.

The straddle buyer was crushed. They paid $8.50 for a position now worth $3.00—a 65% loss. The stock moved less than expected. The IV collapse took the rest.

This is the nightmare. The stock moved. The report was newsworthy. But the market had priced in too much uncertainty. The straddle buyer paid for a move that didn't happen.

### The Iron Condor Seller's Dream (Real Example)

In the same AAPL earnings cycle, an iron condor seller sold the 195 call / 200 call spread and the 175 put / 170 put spread, collecting $2.00 in premium. AAPL closed the next day at $183.

All legs expired worthless. The seller kept the full $2.00 premium. The IV crush accelerated the decay, and the stock stayed comfortably within the range. This is the dream scenario: the event passed, the uncertainty evaporated, and the premium was collected.

Of course, if AAPL had gapped to $200, the condor seller would have hit max loss. The strategy works over time because most earnings moves are smaller than the market prices. But position sizing is critical because the outliers are painful.

---

## Real Example: NVDA Earnings IV Crush (Q1 2025)

### IV Before the Event

In May 2025, NVDA reported Q1 earnings. The stock was trading at $1,120. The options market was pricing a massive move.

- **IV Rank:** 94% (near the highest of the year)
- **ATM straddle price:** $62.00 (±5.5% expected move)
- **Weekly 1120 call:** $31.00
- **Weekly 1120 put:** $31.00

The market was priced for perfection. NVDA had run up 30% in the two months prior. The whisper number was sky-high. Every analyst on Wall Street had a "buy" rating. The options market was demanding a premium for the risk of a disappointment.

### The Actual Move vs. Expected Move

NVDA beat EPS and revenue. Guidance was raised. But the stock had run so far into the event that the beat was already priced in. NVDA opened the next morning at $1,145—up $25 (2.2%).

The expected move was ±$62. The actual move was +$25. The stock moved in the "right" direction but less than half of what the market priced.

### What Happened to Straddle Prices the Next Morning

The 1120 straddle that cost $62.00 at the close was worth $28.00 at the open. The call leg gained value from the stock move but lost more from IV crush. The put leg was nearly worthless.

A trader who bought the straddle for $62.00 and held through the event lost $34.00 per share ($3,400 per contract)—a 55% loss. They were right on direction (the stock went up) and still lost money because the move was too small to overcome the premium and the crush.

### Lesson Learned

When IV Rank is above 90% and the stock has run hard into the event, the market is pricing in a massive move. The bar is extremely high. Even a good result may not be enough. In these conditions, short volatility strategies or simply avoiding the trade are often the better choices.

---

## Tools to Track IV Crush in Real Time

### Free Tools vs. Premium Tools

**Free tools:**
- **Broker platforms (Thinkorswim, Tastytrade, Webull):** Most brokers show IV Rank, IV Percentile, and expected move on the options chain. The data is real-time but limited in historical comparison.
- **Market Chameleon:** Offers free IV analysis, earnings calendars, and historical move data. Excellent for checking past earnings reactions.
- **CBOE VIX:** The overall market fear gauge. Not stock-specific, but useful for context.

**Premium tools:**
- **ORATS:** Institutional-grade options analytics with detailed IV term structure, skew analysis, and backtesting.
- **CML Viz:** Earnings-specific tools with historical move distributions and win-rate statistics.
- **Unusual Whales:** Flow data and IV tracking with a focus on institutional order flow.

For most active traders, a combination of a solid broker platform (for real-time chain data) and a free earnings analysis site (for historical context) is sufficient.

### Gistify's Risk Matrix for IV Crush Context

Gistify's Risk Matrix visualizes IV crush alongside expected move and position sizing—so you see the full picture before clicking. The tool shows:

- IV Rank and IV Percentile at a glance
- Expected move vs. historical average move
- Strategy-specific risk/reward (straddle, spread, condor)
- Position size based on your account and max loss preference

Instead of tabbing between your broker, an earnings calendar, and a calculator, the Risk Matrix surfaces everything on one screen. You can compare 5 setups in 30 seconds and trade the one with the cleanest edge.

### Gistify's Free IV Rank Calculator

If you want a quick, standalone check, Gistify offers a free IV Rank Calculator at `/tools/iv-rank-calculator`. Enter the stock ticker, and it pulls the current IV, 52-week high/low, and calculates IV Rank and IV Percentile in real time. No signup required. Use it as a first filter before deciding whether to buy or sell volatility on any earnings setup.

---

## IV Crush FAQ

### What exactly is IV crush?

IV crush is the rapid, usually overnight decline in implied volatility after a scheduled event (like earnings) removes uncertainty from the market. It causes option prices to drop even when the stock moves in the expected direction.

### Does IV crush happen after every earnings report?

Yes. Some degree of IV crush happens after every earnings report because the uncertainty is resolved. The magnitude varies. High-profile events with extreme IV expansion see the largest crushes. Quiet reports with little pre-event positioning see smaller crushes.

### Can I lose money even if the stock moves in my direction?

Absolutely. If you buy a call and the stock goes up 3%, but the expected move was 8%, the IV crush can erase the small directional gain and leave you with a loss. Direction alone is not enough.

### How do I avoid IV crush?

You can't avoid it if you hold long options through the event. But you can trade around it: use vertical spreads (which are less sensitive to IV), sell options instead of buying them, or close positions before the event. Alternatively, choose expirations further out to reduce the crush's impact.

### Is IV crush worse for weekly or monthly options?

Weekly options that expire closest to the earnings date experience the worst crush. They have the most event premium baked in. Monthly options (30+ DTE) still see IV declines, but the percentage is smaller because they carry other time value.

### Can I profit from IV crush?

Yes. Short volatility strategies—iron condors, short strangles, credit spreads—profit from IV crush. You collect premium before the event, and the crush accelerates your gains as the options lose value.

### What is a good IV Rank for buying options before earnings?

Generally, you want IV Rank below 30% for long volatility strategies. This means the options are cheap relative to the past year, and the market may be underpricing the event. Above 70%, selling is usually more favorable.

### How long does IV crush last?

The majority of the crush happens in the first trading session after the event. By the second day, IV has usually settled into a new, lower range. However, if the earnings result changes the stock's forward trajectory (e.g., guidance raised significantly), the new baseline IV may be higher than before.

---

## Don't Get Crushed — Use Gistify

IV crush is not a mystery. It is a mechanical, predictable event that happens four times a year for every publicly traded company. The traders who get crushed are the ones who ignore it. The traders who profit are the ones who measure it, account for it, and build it into their strategy.

Before your next earnings trade, ask yourself:
- What is the IV Rank?
- What is the expected move?
- What is the historical average move?
- Am I buying overpriced insurance or selling it?

Gistify is built to answer these questions in seconds, not minutes. The Pre-Earnings Brief surfaces IV Rank and IV Percentile automatically. The Risk Matrix visualizes IV crush alongside expected move and position sizing. And the free IV Rank Calculator lets you run a quick check on any ticker, anytime.

Stop trading earnings on instinct. Start trading them with data.

**[Try Gistify's Risk Matrix and free IV Rank Calculator →]**

*Measure the crush before it measures you.*

---

*Last updated: July 1, 2026*

## Related Reading
- Previous: [The Complete Guide to Trading Earnings with Options](/blog/earnings-strategy/complete-guide-trading-earnings-options)
- Next: [Momentum Scanner: How to Find High-Probability Setups Every Morning](/blog/momentum-trading/momentum-scanner-high-probability-setups)
- [Free IV Rank Calculator →](/tools/iv-rank-calculator)
