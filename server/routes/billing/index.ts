import type { Request, Response, Router } from "express";
import express from "express";
import type { BillingStore } from "../../billingStore";

interface PaddleManagementUrls {
  update_payment_method?: unknown;
  cancel?: unknown;
}

interface PaddleSubscriptionPeriod {
  starts_at?: unknown;
  ends_at?: unknown;
}

interface PaddleSubscriptionEntity {
  id?: unknown;
  status?: unknown;
  customer_id?: unknown;
  transaction_id?: unknown;
  started_at?: unknown;
  first_billed_at?: unknown;
  next_billed_at?: unknown;
  canceled_at?: unknown;
  paused_at?: unknown;
  current_billing_period?: PaddleSubscriptionPeriod | null;
  custom_data?: unknown;
  management_urls?: PaddleManagementUrls | null;
}

interface PaddleWebhookPayload {
  event_type?: unknown;
  data?: PaddleSubscriptionEntity;
}

type SessionUser = {
  id: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: string;
  updatedAt: string;
};

type BillingRouterDependencies = {
  billingStore: BillingStore;
  extractObjectRecord: (value: unknown) => Record<string, unknown> | null;
  getPaddleCancelUrl: () => string;
  getPaddleCheckoutConfigIssues: () => string[];
  getPaddleClientToken: () => string;
  getPaddleEnvironment: () => "live" | "sandbox";
  getPaddleManagementUrls: (subscriptionId: string) => Promise<{
    updatePaymentMethod?: string;
    cancel?: string;
  }>;
  getPaddlePriceId: () => string;
  getPaddleServerConfigIssues: () => string[];
  getPaddleSuccessUrl: () => string;
  getSessionUser: (req: Request) => SessionUser | null;
  isPublicAccessMode: () => boolean;
  isSubscribedEmail: (email: string) => boolean;
  normalizeEmail: (value: unknown) => string;
  normalizeString: (value: unknown) => string;
  readAuthPayload: (req: Request) => {
    membership: unknown;
    accessMode: unknown;
  };
  resolveMembershipForUser: (user: SessionUser) => unknown;
  setPrivateNoStore: (res: Response) => void;
  upsertPaddleSubscriptionFromEntity: (
    entity: PaddleSubscriptionEntity
  ) => Promise<unknown>;
  verifyPaddleWebhook: (req: Request) => boolean;
};

export function createBillingRouter({
  billingStore,
  extractObjectRecord,
  getPaddleCancelUrl,
  getPaddleCheckoutConfigIssues,
  getPaddleClientToken,
  getPaddleEnvironment,
  getPaddleManagementUrls,
  getPaddlePriceId,
  getPaddleServerConfigIssues,
  getPaddleSuccessUrl,
  getSessionUser,
  isPublicAccessMode,
  isSubscribedEmail,
  normalizeEmail,
  normalizeString,
  readAuthPayload,
  resolveMembershipForUser,
  setPrivateNoStore,
  upsertPaddleSubscriptionFromEntity,
  verifyPaddleWebhook,
}: BillingRouterDependencies): Router {
  const router = express.Router();

  router.get("/billing/status", (req, res) => {
    setPrivateNoStore(res);
    if (isPublicAccessMode()) {
      const payload = readAuthPayload(req);
      res.status(200).json({
        membership: payload.membership,
        allowListOverride: false,
        managedSubscription: null,
        accessMode: payload.accessMode,
      });
      return;
    }

    const user = getSessionUser(req);
    if (!user) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }

    const membership = resolveMembershipForUser(user);
    const managedSubscription = billingStore.getSubscriptionByEmail(
      normalizeEmail(user.email)
    );

    res.status(200).json({
      membership,
      allowListOverride: isSubscribedEmail(user.email),
      managedSubscription,
      accessMode: "managed",
    });
  });

  router.get("/billing/paddle/public-config", (_req, res) => {
    setPrivateNoStore(res);
    const issues = getPaddleCheckoutConfigIssues();

    res.status(200).json({
      enabled: issues.length === 0,
      environment: getPaddleEnvironment(),
      clientToken: issues.length === 0 ? getPaddleClientToken() : null,
      priceId: issues.length === 0 ? getPaddlePriceId() : null,
      successUrl: getPaddleSuccessUrl() || null,
      cancelUrl: getPaddleCancelUrl() || null,
      issues,
    });
  });

  router.get("/billing/paddle/manage", async (req, res) => {
    setPrivateNoStore(res);
    if (isPublicAccessMode()) {
      res.status(409).json({
        error:
          "Public preview modu acik. Paddle abonelik yonetimi icin APP_ACCESS_MODE=managed olmalidir.",
        managementUrls: null,
      });
      return;
    }

    const user = getSessionUser(req);
    if (!user) {
      res.status(401).json({ error: "Oturum gerekli.", managementUrls: null });
      return;
    }

    const localSubscription = billingStore.getSubscriptionByEmail(
      normalizeEmail(user.email)
    );
    if (
      !localSubscription ||
      localSubscription.provider !== "paddle" ||
      !localSubscription.lastOrderId
    ) {
      res.status(200).json({
        subscription: localSubscription,
        managementUrls: null,
      });
      return;
    }

    try {
      const managementUrls = await getPaddleManagementUrls(
        localSubscription.lastOrderId
      );

      res.status(200).json({
        subscription: localSubscription,
        managementUrls,
      });
    } catch (error) {
      console.error("Paddle management URL fetch failed", error);
      res.status(502).json({
        error: "Paddle abonelik yonetim linkleri alinamadi.",
        subscription: localSubscription,
        managementUrls: null,
      });
    }
  });

  router.post("/billing/paddle/webhook", async (req, res) => {
    if (getPaddleServerConfigIssues().length > 0) {
      res.status(503).json({
        error:
          "Paddle webhook hazir degil. PADDLE_API_KEY ve PADDLE_WEBHOOK_SECRET gerekli.",
      });
      return;
    }

    if (!verifyPaddleWebhook(req)) {
      res.status(401).json({ error: "Paddle imzasi dogrulanamadi." });
      return;
    }

    const payload = extractObjectRecord(
      (req.body ?? {}) as PaddleWebhookPayload
    );
    const eventType = normalizeString(payload?.event_type).toLowerCase();
    const data = extractObjectRecord(payload?.data);

    if (!eventType || !data) {
      res.status(200).json({ received: true, ignored: true });
      return;
    }

    try {
      switch (eventType) {
        case "subscription.created":
        case "subscription.activated":
        case "subscription.updated":
        case "subscription.trialing":
        case "subscription.resumed":
        case "subscription.canceled":
        case "subscription.past_due":
        case "subscription.paused":
          await upsertPaddleSubscriptionFromEntity(
            data as PaddleSubscriptionEntity
          );
          break;
        default:
          break;
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Paddle webhook processing failed", {
        eventType,
        error,
      });
      res.status(500).json({ error: "Paddle webhook islenemedi." });
    }
  });

  router.post("/billing/shopier/checkout", (_req, res) => {
    res.status(410).json({
      error:
        "Shopier odeme akisi kapatildi. Paddle kurulumu tamamlaninca yeni odeme ekrani acilacak.",
    });
  });

  router.post("/billing/shopier/webhook", (_req, res) => {
    res.status(410).json({
      error:
        "Shopier webhook devre disi. Yeni odeme akisi Paddle uzerinden acilacak.",
    });
  });

  return router;
}
