import type { Strategy } from "../shared/earnings";

const sentAt = new Map<string, number>();

function fingerprint(strategy: Strategy) {
  const intelligence = strategy.intelligence;
  if (!intelligence) return "";
  const critical = intelligence.alerts.filter(alert => alert.severity === "critical").map(alert => alert.title).sort().join("|");
  return `${strategy.ticker}:${intelligence.decision.tradeStatus}:${intelligence.decision.strategy}:${critical}`;
}

export async function dispatchEarningsAlerts(strategies: Strategy[]) {
  const webhookUrl = process.env.EARNINGS_ALERT_WEBHOOK_URL?.trim();
  if (!webhookUrl) return { attempted: 0, delivered: 0 };
  try {
    new URL(webhookUrl);
  } catch {
    return { attempted: 0, delivered: 0 };
  }
  const cooldownMs = Math.max(60_000, Number(process.env.EARNINGS_ALERT_COOLDOWN_MS) || 6 * 60 * 60_000);
  const now = Date.now();
  const candidates = strategies.filter(strategy => {
    const intelligence = strategy.intelligence;
    if (!intelligence) return false;
    return intelligence.decision.changed || intelligence.decision.tradeStatus === "BLOCKED" || intelligence.alerts.some(alert => alert.severity === "critical");
  }).filter(strategy => {
    const key = fingerprint(strategy);
    return key && now - (sentAt.get(key) || 0) >= cooldownMs;
  });
  let delivered = 0;
  for (const strategy of candidates) {
    const intelligence = strategy.intelligence!;
    const key = fingerprint(strategy);
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.EARNINGS_ALERT_WEBHOOK_SECRET ? { "X-Gistify-Signature": process.env.EARNINGS_ALERT_WEBHOOK_SECRET } : {}),
        },
        body: JSON.stringify({
          event: "earnings_strategy_alert",
          emittedAt: new Date().toISOString(),
          ticker: strategy.ticker,
          status: intelligence.decision.tradeStatus,
          strategy: intelligence.decision.strategy,
          previousStrategy: intelligence.decision.previousStrategy,
          changed: intelligence.decision.changed,
          confidence: intelligence.decision.confidence,
          netExpectedValue: intelligence.options.expectedValueAfterCosts,
          probabilityOfProfit: intelligence.options.probabilityOfProfit,
          alerts: intelligence.alerts,
        }),
        signal: AbortSignal.timeout(8_000),
      });
      if (response.ok) {
        sentAt.set(key, now);
        delivered += 1;
      }
    } catch {
      // Alert transport must never break the earnings refresh pipeline.
    }
  }
  for (const [key, timestamp] of sentAt) {
    if (now - timestamp > cooldownMs * 4) sentAt.delete(key);
  }
  return { attempted: candidates.length, delivered };
}
