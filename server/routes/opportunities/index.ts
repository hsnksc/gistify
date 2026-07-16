import type { Request, Response, Router } from "express";
import express from "express";
import crypto from "node:crypto";
import type { BillingStore } from "../../billingStore";
import type {
  OpportunityRecord,
  OpportunityTier,
  SavedPortfolioScenarioRecord,
  WatchlistAlertRules,
  WatchlistCollectionWithItems,
  WatchlistItemRecord,
  WatchlistRecord,
} from "../../../shared/opportunities";

interface WatchlistUpsertRequestBody {
  ticker?: unknown;
  notes?: unknown;
  alertOnOpportunity?: unknown;
}

interface WatchlistCollectionRequestBody {
  name?: unknown;
  color?: unknown;
}

interface WatchlistItemRequestBody extends WatchlistUpsertRequestBody {
  tags?: unknown;
  alertRules?: unknown;
}

interface SavedPortfolioRequestBody {
  name?: unknown;
  listId?: unknown;
  weighting?: unknown;
  transactionCostBps?: unknown;
  tickers?: unknown;
}

const DEFAULT_WATCHLIST_ID = "default";
const DEFAULT_WATCHLIST_COLOR = "#f59e0b";
const PUBLIC_ACCESS_USER_ID = "public-access";

function optionalFiniteNumber(value: unknown, min: number, max: number) {
  if (value === null || value === undefined || value === "") return undefined;
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return undefined;
  return Math.min(max, Math.max(min, numeric));
}

function normalizeAlertRules(
  value: unknown,
  fallback: WatchlistAlertRules
): WatchlistAlertRules {
  const rules =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  const numberRule = (
    key: string,
    min: number,
    max: number,
    fallbackValue: number | undefined
  ) =>
    Object.prototype.hasOwnProperty.call(rules, key)
      ? optionalFiniteNumber(rules[key], min, max)
      : fallbackValue;
  return {
    opportunity:
      typeof rules.opportunity === "boolean"
        ? rules.opportunity
        : fallback.opportunity,
    signalChange:
      typeof rules.signalChange === "boolean"
        ? rules.signalChange
        : fallback.signalChange,
    convictionAbove: numberRule(
      "convictionAbove",
      0,
      100,
      fallback.convictionAbove
    ),
    priceAbove: numberRule(
      "priceAbove",
      0,
      1_000_000,
      fallback.priceAbove
    ),
    priceBelow: numberRule(
      "priceBelow",
      0,
      1_000_000,
      fallback.priceBelow
    ),
    earningsWithinDays: numberRule(
      "earningsWithinDays",
      0,
      60,
      fallback.earningsWithinDays
    ),
  };
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

  const getWatchlistActor = (req: Request) => {
    const actor = getRequestActor(req);
    return actor?.id === PUBLIC_ACCESS_USER_ID ? null : actor;
  };

  const defaultItems = (actor: RequestActor): WatchlistItemRecord[] =>
    billingStore.listWatchlistByUserId(actor.id).map(item => ({
      ...item,
      listId: DEFAULT_WATCHLIST_ID,
      tags: item.tags || [],
      alertRules: item.alertRules || {
        opportunity: item.alertOnOpportunity,
        signalChange: true,
      },
    }));

  const listCollections = (
    actor: RequestActor
  ): WatchlistCollectionWithItems[] => {
    const legacyItems = billingStore.listWatchlistByUserId(actor.id);
    const defaultCreatedAt =
      legacyItems.at(-1)?.addedAt || new Date().toISOString();
    const defaultUpdatedAt =
      legacyItems.reduce(
        (latest, item) => (item.updatedAt > latest ? item.updatedAt : latest),
        defaultCreatedAt
      ) || defaultCreatedAt;

    return [
      {
        id: DEFAULT_WATCHLIST_ID,
        userId: actor.id,
        name: "Favoriler",
        color: DEFAULT_WATCHLIST_COLOR,
        isDefault: true,
        createdAt: defaultCreatedAt,
        updatedAt: defaultUpdatedAt,
        items: defaultItems(actor),
      },
      ...billingStore.listWatchlistCollectionsByUserId(actor.id).map(list => ({
        ...list,
        items: billingStore.listWatchlistItems(actor.id, list.id),
      })),
    ];
  };

  const ownsList = (actor: RequestActor, listId: string) =>
    listId === DEFAULT_WATCHLIST_ID ||
    Boolean(billingStore.getWatchlistCollectionById(actor.id, listId));

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
    const actor = getWatchlistActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }

    res.status(200).json({
      items: billingStore.listWatchlistByUserId(actor.id),
    });
  });

  router.get("/watchlists", (req, res) => {
    setPrivateNoStore(res);
    const actor = getWatchlistActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }

    res.status(200).json({ lists: listCollections(actor) });
  });

  router.post("/watchlists", (req, res) => {
    setPrivateNoStore(res);
    const actor = getWatchlistActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }

    const body = (req.body ?? {}) as WatchlistCollectionRequestBody;
    const name = normalizeString(body.name).slice(0, 48);
    if (!name) {
      res.status(400).json({ error: "Liste adi gerekli." });
      return;
    }

    const nowIso = new Date().toISOString();
    const record = {
      id: crypto.randomUUID(),
      userId: actor.id,
      name,
      color: normalizeString(body.color).slice(0, 24) || "#38bdf8",
      isDefault: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    try {
      billingStore.insertWatchlistCollection(record);
    } catch {
      res.status(409).json({ error: "Bu isimde bir liste zaten var." });
      return;
    }
    res.status(201).json({ list: { ...record, items: [] }, lists: listCollections(actor) });
  });

  router.patch("/watchlists/:listId", (req, res) => {
    setPrivateNoStore(res);
    const actor = getWatchlistActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }

    const listId = normalizeString(req.params.listId);
    if (listId === DEFAULT_WATCHLIST_ID) {
      res.status(400).json({ error: "Varsayilan liste yeniden adlandirilamaz." });
      return;
    }
    const existing = billingStore.getWatchlistCollectionById(actor.id, listId);
    if (!existing) {
      res.status(404).json({ error: "Liste bulunamadi." });
      return;
    }

    const body = (req.body ?? {}) as WatchlistCollectionRequestBody;
    const updated = {
      ...existing,
      name: normalizeString(body.name).slice(0, 48) || existing.name,
      color: normalizeString(body.color).slice(0, 24) || existing.color,
      updatedAt: new Date().toISOString(),
    };
    try {
      billingStore.updateWatchlistCollection(updated);
    } catch {
      res.status(409).json({ error: "Bu isimde bir liste zaten var." });
      return;
    }
    res.status(200).json({ list: updated, lists: listCollections(actor) });
  });

  router.delete("/watchlists/:listId", (req, res) => {
    setPrivateNoStore(res);
    const actor = getWatchlistActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }

    const listId = normalizeString(req.params.listId);
    if (listId === DEFAULT_WATCHLIST_ID) {
      res.status(400).json({ error: "Varsayilan liste silinemez." });
      return;
    }
    if (!billingStore.getWatchlistCollectionById(actor.id, listId)) {
      res.status(404).json({ error: "Liste bulunamadi." });
      return;
    }
    billingStore.deleteWatchlistCollection(actor.id, listId);
    res.status(200).json({ lists: listCollections(actor) });
  });

  router.post("/watchlists/:listId/items", (req, res) => {
    setPrivateNoStore(res);
    const actor = getWatchlistActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }

    const listId = normalizeString(req.params.listId);
    if (!ownsList(actor, listId)) {
      res.status(404).json({ error: "Liste bulunamadi." });
      return;
    }
    const body = (req.body ?? {}) as WatchlistItemRequestBody;
    const ticker = normalizeString(body.ticker).toUpperCase().slice(0, 12);
    if (!ticker || !/^[A-Z0-9.-]+$/.test(ticker)) {
      res.status(400).json({ error: "Gecerli bir ticker gerekli." });
      return;
    }

    const nowIso = new Date().toISOString();
    const alertRules = normalizeAlertRules(body.alertRules, {
      opportunity: body.alertOnOpportunity !== false,
      signalChange: true,
    });
    if (listId === DEFAULT_WATCHLIST_ID) {
      billingStore.upsertWatchlist({
        id: crypto.randomUUID(),
        userId: actor.id,
        email: actor.email,
        ticker,
        notes: normalizeString(body.notes) || undefined,
        tags: Array.isArray(body.tags)
          ? body.tags.map(normalizeString).filter(Boolean).slice(0, 8)
          : [],
        alertOnOpportunity: alertRules.opportunity,
        alertRules,
        addedAt: nowIso,
        updatedAt: nowIso,
      });
    } else {
      billingStore.upsertWatchlistItem({
        id: crypto.randomUUID(),
        listId,
        userId: actor.id,
        email: actor.email,
        ticker,
        notes: normalizeString(body.notes) || undefined,
        tags: Array.isArray(body.tags)
          ? body.tags.map(normalizeString).filter(Boolean).slice(0, 8)
          : [],
        alertRules,
        addedAt: nowIso,
        updatedAt: nowIso,
      });
    }
    res.status(201).json({ lists: listCollections(actor) });
  });

  router.patch("/watchlists/:listId/items/:ticker", (req, res) => {
    setPrivateNoStore(res);
    const actor = getWatchlistActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }
    const listId = normalizeString(req.params.listId);
    const ticker = normalizeString(req.params.ticker).toUpperCase();
    if (!ownsList(actor, listId)) {
      res.status(404).json({ error: "Liste bulunamadi." });
      return;
    }
    const body = (req.body ?? {}) as WatchlistItemRequestBody;

    if (listId === DEFAULT_WATCHLIST_ID) {
      const existing = billingStore
        .listWatchlistByUserId(actor.id)
        .find(item => item.ticker === ticker);
      if (!existing) {
        res.status(404).json({ error: "Watchlist kaydi bulunamadi." });
        return;
      }
      const rules = normalizeAlertRules(body.alertRules, {
        ...(existing.alertRules || {
          opportunity: existing.alertOnOpportunity,
          signalChange: true,
        }),
      });
      billingStore.upsertWatchlist({
        ...existing,
        notes:
          body.notes === undefined
            ? existing.notes
            : normalizeString(body.notes) || undefined,
        tags: Array.isArray(body.tags)
          ? body.tags.map(normalizeString).filter(Boolean).slice(0, 8)
          : existing.tags,
        alertOnOpportunity: rules.opportunity,
        alertRules: rules,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const existing = billingStore
        .listWatchlistItems(actor.id, listId)
        .find(item => item.ticker === ticker);
      if (!existing) {
        res.status(404).json({ error: "Watchlist kaydi bulunamadi." });
        return;
      }
      billingStore.upsertWatchlistItem({
        ...existing,
        notes:
          body.notes === undefined
            ? existing.notes
            : normalizeString(body.notes) || undefined,
        tags: Array.isArray(body.tags)
          ? body.tags.map(normalizeString).filter(Boolean).slice(0, 8)
          : existing.tags,
        alertRules: normalizeAlertRules(body.alertRules, existing.alertRules),
        updatedAt: new Date().toISOString(),
      });
    }
    res.status(200).json({ lists: listCollections(actor) });
  });

  router.delete("/watchlists/:listId/items/:ticker", (req, res) => {
    setPrivateNoStore(res);
    const actor = getWatchlistActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }
    const listId = normalizeString(req.params.listId);
    const ticker = normalizeString(req.params.ticker).toUpperCase();
    if (!ownsList(actor, listId)) {
      res.status(404).json({ error: "Liste bulunamadi." });
      return;
    }
    if (listId === DEFAULT_WATCHLIST_ID) {
      billingStore.deleteWatchlist(actor.id, ticker);
    } else {
      billingStore.deleteWatchlistItem(actor.id, listId, ticker);
    }
    res.status(200).json({ lists: listCollections(actor) });
  });

  router.post(["/watchlist", "/me/watchlist"], (req, res) => {
    setPrivateNoStore(res);
    const actor = getWatchlistActor(req);
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
    const actor = getWatchlistActor(req);
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
    const actor = getWatchlistActor(req);
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

  router.get("/notifications", (req, res) => {
    setPrivateNoStore(res);
    const actor = getWatchlistActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }
    const requestedLimit = normalizeNumber(req.query.limit, 30);
    const limit = Math.min(100, Math.max(1, Math.floor(requestedLimit)));
    res.status(200).json({
      items: billingStore.listWatchlistNotifications(actor.id, limit),
      unreadCount: billingStore.countUnreadWatchlistNotifications(actor.id),
    });
  });

  router.get("/portfolios", (req, res) => {
    setPrivateNoStore(res);
    const actor = getWatchlistActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }
    res.status(200).json({
      items: billingStore.listSavedPortfolioScenarios(actor.id),
    });
  });

  router.post("/portfolios", (req, res) => {
    setPrivateNoStore(res);
    const actor = getWatchlistActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }
    const body = (req.body ?? {}) as SavedPortfolioRequestBody;
    const name = normalizeString(body.name).slice(0, 64);
    const listId = normalizeString(body.listId) || DEFAULT_WATCHLIST_ID;
    const weighting =
      body.weighting === "risk_parity" ? "risk_parity" : "equal";
    const transactionCostBps = Math.min(
      100,
      Math.max(0, normalizeNumber(body.transactionCostBps, 0))
    );
    const tickers = Array.isArray(body.tickers)
      ? Array.from(
          new Set(
            body.tickers
              .map(normalizeString)
              .map(ticker => ticker.toUpperCase())
              .filter(ticker => /^[A-Z0-9.-]+$/.test(ticker))
          )
        ).slice(0, 100)
      : [];
    if (!name || !tickers.length) {
      res.status(400).json({ error: "Sepet adi ve en az bir ticker gerekli." });
      return;
    }
    if (!ownsList(actor, listId)) {
      res.status(404).json({ error: "Liste bulunamadi." });
      return;
    }
    const nowIso = new Date().toISOString();
    const record: SavedPortfolioScenarioRecord = {
      id: crypto.randomUUID(),
      userId: actor.id,
      name,
      listId,
      weighting,
      transactionCostBps,
      tickers,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    billingStore.upsertSavedPortfolioScenario(record);
    res.status(201).json({
      item: record,
      items: billingStore.listSavedPortfolioScenarios(actor.id),
    });
  });

  router.delete("/portfolios/:scenarioId", (req, res) => {
    setPrivateNoStore(res);
    const actor = getWatchlistActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }
    const scenarioId = normalizeString(req.params.scenarioId);
    billingStore.deleteSavedPortfolioScenario(actor.id, scenarioId);
    res.status(200).json({
      items: billingStore.listSavedPortfolioScenarios(actor.id),
    });
  });

  router.patch("/notifications/:notificationId/read", (req, res) => {
    setPrivateNoStore(res);
    const actor = getWatchlistActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }
    const notificationId = normalizeString(req.params.notificationId);
    if (!notificationId) {
      res.status(400).json({ error: "Bildirim kimligi gerekli." });
      return;
    }
    billingStore.markWatchlistNotificationRead(
      actor.id,
      notificationId,
      new Date().toISOString()
    );
    res.status(200).json({
      items: billingStore.listWatchlistNotifications(actor.id, 30),
      unreadCount: billingStore.countUnreadWatchlistNotifications(actor.id),
    });
  });

  router.post("/notifications/read-all", (req, res) => {
    setPrivateNoStore(res);
    const actor = getWatchlistActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }
    billingStore.markAllWatchlistNotificationsRead(
      actor.id,
      new Date().toISOString()
    );
    res.status(200).json({
      items: billingStore.listWatchlistNotifications(actor.id, 30),
      unreadCount: 0,
    });
  });

  return router;
}
