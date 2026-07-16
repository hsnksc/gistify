import crypto from "node:crypto";
import type { BillingStore } from "./billingStore";
import type {
  WatchlistAlertRules,
  WatchlistItemRecord,
  WatchlistNotificationKind,
  WatchlistNotificationRecord,
  WatchlistRecord,
} from "../shared/opportunities";
import type {
  FactorBreakdown,
  MidasSignalRecord,
  MidasSignalsData,
} from "../shared/midasSignals";

const DEFAULT_LIST_ID = "default";

interface TrackedItem {
  id: string;
  listId: string;
  userId: string;
  email: string;
  ticker: string;
  rules: WatchlistAlertRules;
}

interface AlertCandidate {
  kind: WatchlistNotificationKind;
  condition: boolean;
  stateValue?: string;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  notifyOnFirstMatch?: boolean;
}

export interface WatchlistAlertEvaluationResult {
  evaluatedItems: number;
  createdNotifications: number;
  queuedEmails: number;
  snapshotAt: string;
}

function defaultRules(record: WatchlistRecord): WatchlistAlertRules {
  return (
    record.alertRules || {
      opportunity: record.alertOnOpportunity,
      signalChange: true,
    }
  );
}

function trackedItems(store: BillingStore): TrackedItem[] {
  const legacy = store.listAllWatchlists().map(record => ({
    id: record.id,
    listId: DEFAULT_LIST_ID,
    userId: record.userId,
    email: record.email,
    ticker: record.ticker,
    rules: defaultRules(record),
  }));
  const custom = store.listAllWatchlistItems().map(
    (record: WatchlistItemRecord) => ({
      id: record.id,
      listId: record.listId,
      userId: record.userId,
      email: record.email,
      ticker: record.ticker,
      rules: record.alertRules,
    })
  );
  return [...legacy, ...custom];
}

function conviction(signal: MidasSignalRecord) {
  const raw =
    signal.apex_score ?? signal.confidence ?? Math.abs(signal.strength) * 14;
  return Math.min(100, Math.max(0, raw));
}

function daysUntil(date: string, now: Date) {
  const timestamp = Date.parse(`${date.slice(0, 10)}T00:00:00Z`);
  if (!Number.isFinite(timestamp)) return null;
  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  return Math.ceil((timestamp - today) / 86_400_000);
}

function factorChanges(
  previous: FactorBreakdown | undefined,
  current: FactorBreakdown | undefined
) {
  if (!previous || !current) return [];
  return (Object.keys(current) as Array<keyof FactorBreakdown>)
    .map(key => ({ key, delta: current[key] - previous[key] }))
    .filter(item => Math.abs(item.delta) >= 0.1)
    .sort((left, right) => Math.abs(right.delta) - Math.abs(left.delta))
    .slice(0, 3);
}

function buildCandidates({
  item,
  signal,
  previousSignal,
  opportunity,
  now,
}: {
  item: TrackedItem;
  signal: MidasSignalRecord;
  previousSignal?: MidasSignalRecord;
  opportunity?: ReturnType<BillingStore["listOpportunities"]>[number];
  now: Date;
}): AlertCandidate[] {
  const rules = item.rules;
  const score = conviction(signal);
  const changedFactors = factorChanges(
    previousSignal?.factor_breakdown,
    signal.factor_breakdown
  );
  const factorText = changedFactors.length
    ? ` En büyük faktör değişimleri: ${changedFactors
        .map(item => `${item.key} ${item.delta > 0 ? "+" : ""}${item.delta.toFixed(1)}`)
        .join(", ")}.`
    : "";
  const earningsDays = opportunity
    ? daysUntil(opportunity.earningsDate, now)
    : null;

  return [
    {
      kind: "opportunity",
      condition: Boolean(rules.opportunity && opportunity),
      stateValue: opportunity?.id,
      title: `${item.ticker} için yeni fırsat`,
      body: opportunity
        ? `${opportunity.recommendedStrategy} — bileşik skor ${opportunity.compositeScore.toFixed(0)}/100.`
        : "",
      metadata: opportunity
        ? {
            opportunityId: opportunity.id,
            compositeScore: opportunity.compositeScore,
            strategy: opportunity.recommendedStrategy,
          }
        : {},
      notifyOnFirstMatch: true,
    },
    {
      kind: "signal_change",
      condition: Boolean(rules.signalChange),
      stateValue: signal.signal,
      title: `${item.ticker} sinyali değişti`,
      body: previousSignal
        ? `${previousSignal.signal} → ${signal.signal}. Conviction ${score.toFixed(0)}/100.${factorText}`
        : `Yeni sinyal: ${signal.signal}. Conviction ${score.toFixed(0)}/100.`,
      metadata: {
        previousSignal: previousSignal?.signal,
        signal: signal.signal,
        conviction: score,
        changedFactors,
      },
      notifyOnFirstMatch: false,
    },
    {
      kind: "conviction",
      condition:
        typeof rules.convictionAbove === "number" &&
        score >= rules.convictionAbove,
      stateValue:
        typeof rules.convictionAbove === "number"
          ? String(rules.convictionAbove)
          : undefined,
      title: `${item.ticker} conviction eşiğini geçti`,
      body: `Conviction ${score.toFixed(0)}/100; tanımlı eşik ${rules.convictionAbove ?? "-"}.`,
      metadata: { conviction: score, threshold: rules.convictionAbove },
      notifyOnFirstMatch: true,
    },
    {
      kind: "price_above",
      condition:
        typeof rules.priceAbove === "number" && signal.price >= rules.priceAbove,
      stateValue:
        typeof rules.priceAbove === "number" ? String(rules.priceAbove) : undefined,
      title: `${item.ticker} üst fiyat eşiğini geçti`,
      body: `Fiyat $${signal.price.toFixed(2)}; eşik $${rules.priceAbove?.toFixed(2) ?? "-"}.`,
      metadata: { price: signal.price, threshold: rules.priceAbove },
      notifyOnFirstMatch: true,
    },
    {
      kind: "price_below",
      condition:
        typeof rules.priceBelow === "number" && signal.price <= rules.priceBelow,
      stateValue:
        typeof rules.priceBelow === "number" ? String(rules.priceBelow) : undefined,
      title: `${item.ticker} alt fiyat/stop eşiğine indi`,
      body: `Fiyat $${signal.price.toFixed(2)}; eşik $${rules.priceBelow?.toFixed(2) ?? "-"}.`,
      metadata: { price: signal.price, threshold: rules.priceBelow },
      notifyOnFirstMatch: true,
    },
    {
      kind: "earnings",
      condition:
        typeof rules.earningsWithinDays === "number" &&
        earningsDays !== null &&
        earningsDays >= 0 &&
        earningsDays <= rules.earningsWithinDays,
      stateValue: opportunity?.earningsDate,
      title: `${item.ticker} earnings tarihi yaklaşıyor`,
      body:
        earningsDays === null
          ? ""
          : `Earnings ${earningsDays} gün sonra (${opportunity?.earningsDate}).`,
      metadata: {
        earningsDate: opportunity?.earningsDate,
        daysUntilEarnings: earningsDays,
      },
      notifyOnFirstMatch: true,
    },
  ];
}

export function evaluateWatchlistAlerts({
  billingStore,
  snapshot,
  previousSnapshot,
  now = new Date(),
}: {
  billingStore: BillingStore;
  snapshot: MidasSignalsData;
  previousSnapshot?: MidasSignalsData | null;
  now?: Date;
}): WatchlistAlertEvaluationResult {
  const snapshotAt = snapshot.timestamp || now.toISOString();
  const nowIso = now.toISOString();
  const signalByTicker = new Map(
    snapshot.signals.map(signal => [signal.symbol.toUpperCase(), signal])
  );
  const previousByTicker = new Map(
    (previousSnapshot?.signals || []).map(signal => [
      signal.symbol.toUpperCase(),
      signal,
    ])
  );
  const opportunityByTicker = new Map<
    string,
    ReturnType<BillingStore["listOpportunities"]>[number]
  >();
  for (const opportunity of billingStore
    .listOpportunities()
    .filter(opportunity => opportunity.status === "active")
    .sort((left, right) => right.compositeScore - left.compositeScore)) {
    const ticker = opportunity.ticker.toUpperCase();
    if (!opportunityByTicker.has(ticker)) {
      opportunityByTicker.set(ticker, opportunity);
    }
  }

  const items = trackedItems(billingStore);
  let createdNotifications = 0;
  let queuedEmails = 0;

  for (const item of items) {
    const signal = signalByTicker.get(item.ticker.toUpperCase());
    if (!signal) continue;
    const candidates = buildCandidates({
      item,
      signal,
      previousSignal: previousByTicker.get(item.ticker.toUpperCase()),
      opportunity: opportunityByTicker.get(item.ticker.toUpperCase()),
      now,
    });

    for (const candidate of candidates) {
      const previousState = billingStore.getWatchlistAlertState(
        item.id,
        candidate.kind
      );
      const stateValueChanged =
        Boolean(previousState) &&
        previousState?.lastValue !== candidate.stateValue;
      const shouldNotify =
        candidate.condition &&
        ((candidate.notifyOnFirstMatch && !previousState) ||
          Boolean(previousState && !previousState.lastCondition) ||
          stateValueChanged);

      if (shouldNotify) {
        const fingerprint = [
          item.id,
          candidate.kind,
          candidate.stateValue || "match",
          snapshotAt,
        ].join(":");
        const notification: WatchlistNotificationRecord = {
          id: crypto.randomUUID(),
          userId: item.userId,
          email: item.email,
          listId: item.listId,
          ticker: item.ticker,
          kind: candidate.kind,
          title: candidate.title,
          body: candidate.body,
          fingerprint,
          metadata: {
            ...candidate.metadata,
            snapshotAt,
            href: `/coverage/${item.ticker}`,
          },
          createdAt: nowIso,
        };
        if (billingStore.insertWatchlistNotification(notification)) {
          createdNotifications += 1;
          billingStore.insertWatchlistDelivery({
            id: crypto.randomUUID(),
            notificationId: notification.id,
            userId: item.userId,
            email: item.email,
            channel: "email",
            status: "pending",
            attempts: 0,
            nextAttemptAt: nowIso,
            createdAt: nowIso,
            updatedAt: nowIso,
          });
          queuedEmails += 1;
        }
      }

      billingStore.upsertWatchlistAlertState({
        itemId: item.id,
        ruleKind: candidate.kind,
        lastCondition: candidate.condition,
        lastValue: candidate.stateValue,
        lastSnapshotAt: snapshotAt,
        updatedAt: nowIso,
      });
    }
  }

  return {
    evaluatedItems: items.length,
    createdNotifications,
    queuedEmails,
    snapshotAt,
  };
}
