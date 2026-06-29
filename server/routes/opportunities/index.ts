import type { Request, Response, Router } from "express";
import express from "express";
import crypto from "node:crypto";
import type { BillingStore } from "../../billingStore";
import type {
  OpportunityRecord,
  OpportunityTier,
  WatchlistRecord,
} from "../../../shared/opportunities";

interface WatchlistUpsertRequestBody {
  ticker?: unknown;
  notes?: unknown;
  alertOnOpportunity?: unknown;
}

type RequestActor = {
  id: string;
  email: string;
};

type OpportunitiesRouterDependencies = {
  billingStore: BillingStore;
  filterOpportunitiesForTier: (
    opportunities: OpportunityRecord[],
    tier: OpportunityTier
  ) => OpportunityRecord[];
  getRequestActor: (req: Request) => RequestActor | null;
  normalizeNumber: (value: unknown, fallback?: number) => number;
  normalizeString: (value: unknown) => string;
  resolveOpportunityTier: (req: Request) => OpportunityTier;
  setPrivateNoStore: (res: Response) => void;
};

export function createOpportunitiesRouter({
  billingStore,
  filterOpportunitiesForTier,
  getRequestActor,
  normalizeNumber,
  normalizeString,
  resolveOpportunityTier,
  setPrivateNoStore,
}: OpportunitiesRouterDependencies): Router {
  const router = express.Router();

  router.get("/opportunities", (req, res) => {
    setPrivateNoStore(res);
    const tier = resolveOpportunityTier(req);
    const minScore = normalizeNumber(req.query.minScore, 0);
    const strategy = normalizeString(req.query.strategy);
    const sector = normalizeString(req.query.sector);
    const days = normalizeNumber(req.query.days, 0);
    const page = Math.max(1, normalizeNumber(req.query.page, 1));
    const limit = Math.min(
      50,
      Math.max(1, normalizeNumber(req.query.limit, 20))
    );
    const offset = (page - 1) * limit;

    const filtered = filterOpportunitiesForTier(
      billingStore
        .listOpportunities()
        .filter(opportunity => opportunity.status === "active")
        .filter(opportunity => opportunity.compositeScore >= minScore)
        .filter(opportunity =>
          strategy ? opportunity.strategyType === strategy : true
        )
        .filter(opportunity => (sector ? opportunity.sector === sector : true))
        .filter(opportunity =>
          days > 0 ? opportunity.daysToEarnings <= days : true
        ),
      tier
    );

    const items = filtered.slice(offset, offset + limit);
    res.status(200).json({
      data: items,
      meta: {
        total: filtered.length,
        page,
        limit,
        hasMore: filtered.length > offset + items.length,
        tier,
      },
    });
  });

  router.get("/opportunities/:id/related", (req, res) => {
    setPrivateNoStore(res);
    const tier = resolveOpportunityTier(req);
    const opportunityId = normalizeString(req.params.id);
    const opportunity = billingStore
      .listOpportunities()
      .find(item => item.id === opportunityId);

    if (!opportunity) {
      res.status(404).json({ error: "Firsat bulunamadi." });
      return;
    }

    const allowedItems = filterOpportunitiesForTier(
      billingStore
        .listOpportunities()
        .filter(item => item.status === "active")
        .filter(item => item.id !== opportunity.id)
        .filter(item => item.sector === opportunity.sector)
        .sort((left, right) => right.compositeScore - left.compositeScore),
      tier
    ).slice(0, 4);

    res.status(200).json({
      data: allowedItems,
      meta: {
        tier,
        sourceOpportunityId: opportunity.id,
      },
    });
  });

  router.get("/opportunities/:id", (req, res) => {
    setPrivateNoStore(res);
    const tier = resolveOpportunityTier(req);
    const opportunityId = normalizeString(req.params.id);
    const opportunity = billingStore
      .listOpportunities()
      .find(item => item.id === opportunityId);

    if (!opportunity) {
      res.status(404).json({ error: "Firsat bulunamadi." });
      return;
    }

    const allowedItems = filterOpportunitiesForTier([opportunity], tier);
    if (!allowedItems.length) {
      res.status(403).json({
        error: "Bu firsat daha yuksek uyelik seviyesi gerektiriyor.",
        required: opportunity.tierRequired,
        current: tier,
      });
      return;
    }

    res.status(200).json({
      data: opportunity,
      meta: {
        tier,
      },
    });
  });

  router.get(["/watchlist", "/me/watchlist"], (req, res) => {
    setPrivateNoStore(res);
    const actor = getRequestActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }

    res.status(200).json({
      items: billingStore.listWatchlistByUserId(actor.id),
    });
  });

  router.post(["/watchlist", "/me/watchlist"], (req, res) => {
    setPrivateNoStore(res);
    const actor = getRequestActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }

    const body = (req.body ?? {}) as WatchlistUpsertRequestBody;
    const ticker = normalizeString(body.ticker).toUpperCase();
    if (!ticker) {
      res.status(400).json({ error: "Ticker gerekli." });
      return;
    }

    const nowIso = new Date().toISOString();
    const record: WatchlistRecord = {
      id: crypto.randomUUID(),
      userId: actor.id,
      email: actor.email,
      ticker,
      notes: normalizeString(body.notes) || undefined,
      alertOnOpportunity: body.alertOnOpportunity !== false,
      addedAt: nowIso,
      updatedAt: nowIso,
    };

    billingStore.upsertWatchlist(record);
    res.status(201).json({
      item: record,
      items: billingStore.listWatchlistByUserId(actor.id),
    });
  });

  router.patch(["/watchlist/:ticker", "/me/watchlist/:ticker"], (req, res) => {
    setPrivateNoStore(res);
    const actor = getRequestActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }

    const ticker = normalizeString(req.params.ticker).toUpperCase();
    if (!ticker) {
      res.status(400).json({ error: "Ticker gerekli." });
      return;
    }

    const existing = billingStore
      .listWatchlistByUserId(actor.id)
      .find(item => item.ticker === ticker);
    if (!existing) {
      res.status(404).json({ error: "Watchlist kaydi bulunamadi." });
      return;
    }

    const body = (req.body ?? {}) as WatchlistUpsertRequestBody;
    const updatedRecord: WatchlistRecord = {
      ...existing,
      notes: normalizeString(body.notes) || undefined,
      alertOnOpportunity: body.alertOnOpportunity !== false,
      updatedAt: new Date().toISOString(),
    };

    billingStore.upsertWatchlist(updatedRecord);
    res.status(200).json({
      item: updatedRecord,
      items: billingStore.listWatchlistByUserId(actor.id),
    });
  });

  router.delete(["/watchlist/:ticker", "/me/watchlist/:ticker"], (req, res) => {
    setPrivateNoStore(res);
    const actor = getRequestActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }

    const ticker = normalizeString(req.params.ticker).toUpperCase();
    if (!ticker) {
      res.status(400).json({ error: "Ticker gerekli." });
      return;
    }

    billingStore.deleteWatchlist(actor.id, ticker);
    res.status(200).json({
      items: billingStore.listWatchlistByUserId(actor.id),
    });
  });

  return router;
}
