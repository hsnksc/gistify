import type { BillingStore } from "./billingStore";

export interface WatchlistDeliveryResult {
  providerConfigured: boolean;
  attempted: number;
  sent: number;
  failed: number;
  pendingWithoutProvider: number;
}

function nextAttemptIso(now: Date, attempts: number) {
  const delayMinutes = Math.min(360, 2 ** Math.min(8, attempts));
  return new Date(now.getTime() + delayMinutes * 60_000).toISOString();
}

export async function processWatchlistEmailQueue(
  billingStore: BillingStore,
  options: { now?: Date; limit?: number } = {}
): Promise<WatchlistDeliveryResult> {
  const now = options.now || new Date();
  const deliveries = billingStore.listPendingWatchlistDeliveries(
    now.toISOString(),
    options.limit || 50
  );
  const webhookUrl = process.env.WATCHLIST_ALERT_WEBHOOK_URL?.trim();
  let validWebhookUrl: string | null = null;
  if (webhookUrl) {
    try {
      validWebhookUrl = new URL(webhookUrl).toString();
    } catch {
      validWebhookUrl = null;
    }
  }

  if (!validWebhookUrl) {
    return {
      providerConfigured: false,
      attempted: 0,
      sent: 0,
      failed: 0,
      pendingWithoutProvider: deliveries.length,
    };
  }

  let sent = 0;
  let failed = 0;
  for (const delivery of deliveries) {
    const notification = billingStore.getWatchlistNotification(
      delivery.notificationId
    );
    if (!notification) {
      billingStore.updateWatchlistDelivery({
        ...delivery,
        status: "failed",
        attempts: delivery.attempts + 1,
        nextAttemptAt: nextAttemptIso(now, delivery.attempts + 1),
        updatedAt: now.toISOString(),
        lastError: "Notification record not found.",
      });
      failed += 1;
      continue;
    }

    try {
      const response = await fetch(validWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.WATCHLIST_ALERT_WEBHOOK_SECRET
            ? {
                "X-Gistify-Signature":
                  process.env.WATCHLIST_ALERT_WEBHOOK_SECRET,
              }
            : {}),
        },
        body: JSON.stringify({
          event: "watchlist_email_alert",
          emittedAt: now.toISOString(),
          channel: "email",
          recipient: notification.email,
          subject: `[Gistify] ${notification.title}`,
          notification: {
            id: notification.id,
            ticker: notification.ticker,
            kind: notification.kind,
            title: notification.title,
            body: notification.body,
            metadata: notification.metadata,
            createdAt: notification.createdAt,
          },
        }),
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok) {
        throw new Error(`Delivery webhook returned HTTP ${response.status}.`);
      }
      billingStore.updateWatchlistDelivery({
        ...delivery,
        status: "sent",
        attempts: delivery.attempts + 1,
        nextAttemptAt: now.toISOString(),
        updatedAt: now.toISOString(),
        sentAt: now.toISOString(),
        lastError: undefined,
      });
      sent += 1;
    } catch (error) {
      const attempts = delivery.attempts + 1;
      billingStore.updateWatchlistDelivery({
        ...delivery,
        status: "failed",
        attempts,
        nextAttemptAt: nextAttemptIso(now, attempts),
        updatedAt: now.toISOString(),
        lastError:
          error instanceof Error ? error.message.slice(0, 500) : String(error),
      });
      failed += 1;
    }
  }

  return {
    providerConfigured: true,
    attempted: deliveries.length,
    sent,
    failed,
    pendingWithoutProvider: 0,
  };
}
