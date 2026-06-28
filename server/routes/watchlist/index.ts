import crypto from "node:crypto";
import type { Router } from "express";
import express from "express";
import { createBillingStore } from "../../billingStore";
import type { WatchlistRecord } from "../../../shared/opportunities";
import {
  getRequestActor,
  normalizeString,
  setPrivateNoStore,
} from "../../index";

export type BillingStore = ReturnType<typeof createBillingStore>;

interface WatchlistUpsertRequestBody {
  ticker?: string;
  notes?: string;
  alertOnOpportunity?: boolean;
}

export function createWatchlistRouter(billingStore: BillingStore): Router {
  const router = express.Router();

  const handler = (req: express.Request, res: express.Response) => {
    setPrivateNoStore(res);
    const actor = getRequestActor(req);
    if (!actor) {
      res.status(401).json({ error: "Oturum gerekli." });
      return;
    }

    res.status(200).json({
      items: billingStore.listWatchlistByUserId(actor.id),
    });
  };

  router.get("/", handler);

  router.post("/", (req, res) => {
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

  router.patch("/:ticker", (req, res) => {
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

  router.delete("/:ticker", (req, res) => {
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
