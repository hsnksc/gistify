import type { Router } from "express";
import express from "express";
import { createBillingStore } from "../../billingStore";
import type { OpportunityTier } from "../../../shared/opportunities";
import {
  filterOpportunitiesForTier,
  normalizeNumber,
  normalizeString,
  resolveOpportunityTier,
  setPrivateNoStore,
} from "../../index";

export type BillingStore = ReturnType<typeof createBillingStore>;

export function createOpportunitiesRouter(billingStore: BillingStore): Router {
  const router = express.Router();

  router.get("/", (req, res) => {
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

  router.get("/:id/related", (req, res) => {
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

  router.get("/:id", (req, res) => {
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

  return router;
}
