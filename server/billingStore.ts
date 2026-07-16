import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import type {
  AgentRunRecord,
  AgentRunStatus,
  OpportunityRecord,
  OpportunityStatus,
  OpportunityTier,
  OpportunityWindow,
  SavedPortfolioScenarioRecord,
  WatchlistAlertStateRecord,
  WatchlistCollectionRecord,
  WatchlistDeliveryRecord,
  WatchlistItemRecord,
  WatchlistNotificationKind,
  WatchlistNotificationRecord,
  WatchlistRecord,
} from "../shared/opportunities";
import type {
  FlowReportComment,
  DailyReportRecord,
  DailyReportStatus,
} from "../shared/dailyReports";
import type { FlowReportEngagement } from "../shared/flow";
import type {
  MomentumReportRecord,
  MomentumReportStatus,
} from "../shared/momentumReports";
import type {
  WeeklyReportRecord,
  WeeklyReportStatus,
} from "../shared/weeklyReports";
import type {
  WatchtowerLanguage,
  WatchtowerReportRecord,
  WatchtowerStatus,
} from "../shared/watchtower";

export type SubscriptionProvider = "shopier" | "paddle";

export type SubscriptionStatus = "pending" | "active" | "cancelled" | "expired";

export type BillingOrderStatus = "pending" | "active" | "cancelled";

export interface SubscriptionRecord {
  userId?: string;
  email: string;
  provider: SubscriptionProvider;
  status: SubscriptionStatus;
  plan: "monthly";
  startedAt?: string;
  endsAt?: string;
  updatedAt: string;
  lastOrderId?: string;
}

export interface ShopierOrderRecord {
  orderId: string;
  token: string;
  userId: string;
  email: string;
  name: string;
  amount: number;
  currency: string;
  status: BillingOrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUserRecord {
  id: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionStoreRecord {
  id: string;
  userId: string;
  expiresAt: number;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionDbRow {
  user_id: string | null;
  email: string;
  provider: SubscriptionProvider;
  status: SubscriptionStatus;
  plan: "monthly";
  started_at: string | null;
  ends_at: string | null;
  updated_at: string;
  last_order_id: string | null;
}

interface OrderDbRow {
  order_id: string;
  token: string;
  user_id: string;
  email: string;
  name: string;
  amount: number;
  currency: string;
  status: BillingOrderStatus;
  created_at: string;
  updated_at: string;
}

interface AuthUserDbRow {
  id: string;
  email: string;
  name: string;
  picture: string | null;
  created_at: string;
  updated_at: string;
}

interface SessionDbRow {
  id: string;
  user_id: string;
  expires_at: number;
  created_at: string;
  updated_at: string;
}

interface WeeklyReportDbRow {
  id: string;
  slug: string;
  title: string;
  week_start: string;
  week_end: string;
  analysis_date: string;
  status: WeeklyReportStatus;
  author_email: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  content_json: string;
}

interface OpportunityDbRow {
  id: string;
  source_report_id: string | null;
  source_report_title: string | null;
  ticker: string;
  name: string;
  sector: string;
  earnings_date: string;
  earnings_time: string;
  days_to_earnings: number;
  opportunity_window: OpportunityWindow;
  momentum_score: number;
  price_change_6m: number;
  rsi_14: number;
  current_iv: number;
  historical_iv: number;
  implied_move_percent: number;
  expected_iv_crush: number;
  iv_crush_score: number;
  beat_rate: number;
  max_loss_percent: number;
  target_profit_percent: number;
  earnings_miss_risk: number;
  gap_risk: number;
  composite_score: number;
  confidence_level: string;
  directional_bias: string;
  strategy_type: string;
  strategy_rating: number;
  recommended_strategy: string;
  ai_summary: string;
  ai_strategy_rationale: string;
  ai_key_catalysts_json: string;
  ai_execution_notes: string;
  risk_warnings_json: string;
  data_sources_json: string;
  tier_required: OpportunityTier;
  status: OpportunityStatus;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

interface WatchlistDbRow {
  id: string;
  user_id: string;
  email: string;
  ticker: string;
  notes: string | null;
  tags_json: string;
  alert_on_opportunity: number;
  alert_on_signal_change: number;
  conviction_above: number | null;
  price_above: number | null;
  price_below: number | null;
  earnings_within_days: number | null;
  added_at: string;
  updated_at: string;
}

interface WatchlistNotificationDbRow {
  id: string;
  user_id: string;
  email: string;
  list_id: string;
  ticker: string;
  kind: WatchlistNotificationKind;
  title: string;
  body: string;
  fingerprint: string;
  metadata_json: string;
  created_at: string;
  read_at: string | null;
}

interface WatchlistAlertStateDbRow {
  item_id: string;
  rule_kind: WatchlistNotificationKind;
  last_condition: number;
  last_value: string | null;
  last_snapshot_at: string;
  updated_at: string;
}

interface WatchlistDeliveryDbRow {
  id: string;
  notification_id: string;
  user_id: string;
  email: string;
  channel: "email";
  status: WatchlistDeliveryRecord["status"];
  attempts: number;
  next_attempt_at: string;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
  last_error: string | null;
}

interface SavedPortfolioScenarioDbRow {
  id: string;
  user_id: string;
  name: string;
  list_id: string;
  weighting: SavedPortfolioScenarioRecord["weighting"];
  transaction_cost_bps: number;
  tickers_json: string;
  created_at: string;
  updated_at: string;
}

interface WatchlistCollectionDbRow {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

interface WatchlistItemDbRow {
  id: string;
  list_id: string;
  user_id: string;
  email: string;
  ticker: string;
  notes: string | null;
  tags_json: string;
  alert_on_opportunity: number;
  alert_on_signal_change: number;
  conviction_above: number | null;
  price_above: number | null;
  price_below: number | null;
  earnings_within_days: number | null;
  added_at: string;
  updated_at: string;
}

interface AgentRunDbRow {
  id: string;
  run_type: string;
  status: AgentRunStatus;
  tickers_scanned: number;
  opportunities_found: number;
  errors_json: string;
  log: string;
  retry_count: number;
  started_at: string;
  completed_at: string | null;
}

interface MomentumReportDbRow {
  id: string;
  slug: string;
  title: string;
  report_date: string;
  status: MomentumReportStatus;
  author_email: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  content_json: string;
}

interface DailyReportDbRow {
  id: string;
  slug: string;
  title: string;
  report_date: string;
  status: DailyReportStatus;
  author_email: string;
  source_folder: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  content_json: string;
}

interface CoverageReportDbRow {
  id: string;
  source_name: string;
  imported_at: string;
  raw: string;
}

interface FlowReportCommentDbRow {
  id: string;
  report_id: string;
  user_id: string;
  user_name: string;
  user_picture: string | null;
  body: string;
  created_at: string;
  updated_at: string;
}

interface FlowReportEngagementDbRow {
  report_id: string;
  read_count: number | null;
  like_count: number | null;
  share_count: number | null;
}

function getDatabasePath() {
  const configured = process.env.BILLING_DB_PATH?.trim();
  if (!configured) {
    return path.resolve(process.cwd(), "data", "billing.sqlite");
  }

  if (path.isAbsolute(configured)) {
    return configured;
  }

  return path.resolve(process.cwd(), configured);
}

interface TableInfoRow {
  name: string;
  pk: number;
}

function getSubscriptionTableSql(tableName: string) {
  return `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      email TEXT PRIMARY KEY,
      user_id TEXT,
      provider TEXT NOT NULL,
      status TEXT NOT NULL,
      plan TEXT NOT NULL,
      started_at TEXT,
      ends_at TEXT,
      updated_at TEXT NOT NULL,
      last_order_id TEXT
    );
  `;
}

function mapSubscriptionRow(row: SubscriptionDbRow): SubscriptionRecord {
  return {
    userId: row.user_id || undefined,
    email: row.email,
    provider: row.provider,
    status: row.status,
    plan: row.plan,
    startedAt: row.started_at || undefined,
    endsAt: row.ends_at || undefined,
    updatedAt: row.updated_at,
    lastOrderId: row.last_order_id || undefined,
  };
}

function mapOrderRow(row: OrderDbRow): ShopierOrderRecord {
  return {
    orderId: row.order_id,
    token: row.token,
    userId: row.user_id,
    email: row.email,
    name: row.name,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapAuthUserRow(row: AuthUserDbRow): AuthUserRecord {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    picture: row.picture || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSessionRow(row: SessionDbRow): SessionStoreRecord {
  return {
    id: row.id,
    userId: row.user_id,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapWeeklyReportRow(row: WeeklyReportDbRow): WeeklyReportRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    weekStart: row.week_start,
    weekEnd: row.week_end,
    analysisDate: row.analysis_date,
    status: row.status,
    authorEmail: row.author_email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at || undefined,
    content: JSON.parse(row.content_json) as WeeklyReportRecord["content"],
  };
}

function mapOpportunityRow(row: OpportunityDbRow): OpportunityRecord {
  return {
    id: row.id,
    sourceReportId: row.source_report_id || undefined,
    sourceReportTitle: row.source_report_title || undefined,
    ticker: row.ticker,
    name: row.name,
    sector: row.sector,
    earningsDate: row.earnings_date,
    earningsTime: row.earnings_time,
    daysToEarnings: row.days_to_earnings,
    opportunityWindow: row.opportunity_window,
    momentumScore: row.momentum_score,
    priceChange6M: row.price_change_6m,
    rsi14: row.rsi_14,
    currentIV: row.current_iv,
    historicalIV: row.historical_iv,
    impliedMovePercent: row.implied_move_percent,
    expectedIVCrush: row.expected_iv_crush,
    ivCrushScore: row.iv_crush_score,
    beatRate: row.beat_rate,
    maxLossPercent: row.max_loss_percent,
    targetProfitPercent: row.target_profit_percent,
    earningsMissRisk: row.earnings_miss_risk,
    gapRisk: row.gap_risk,
    compositeScore: row.composite_score,
    confidenceLevel:
      row.confidence_level as OpportunityRecord["confidenceLevel"],
    directionalBias: row.directional_bias,
    strategyType: row.strategy_type as OpportunityRecord["strategyType"],
    strategyRating: row.strategy_rating,
    recommendedStrategy: row.recommended_strategy,
    aiSummary: row.ai_summary,
    aiStrategyRationale: row.ai_strategy_rationale,
    aiKeyCatalysts: JSON.parse(row.ai_key_catalysts_json) as string[],
    aiExecutionNotes: row.ai_execution_notes,
    riskWarnings: JSON.parse(row.risk_warnings_json) as string[],
    dataSources: JSON.parse(row.data_sources_json) as string[],
    tierRequired: row.tier_required,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expiresAt: row.expires_at,
  };
}

function mapWatchlistRow(row: WatchlistDbRow): WatchlistRecord {
  let tags: string[] = [];
  try {
    const parsed = JSON.parse(row.tags_json) as unknown;
    tags = Array.isArray(parsed)
      ? parsed.filter((tag): tag is string => typeof tag === "string")
      : [];
  } catch {
    tags = [];
  }

  return {
    id: row.id,
    userId: row.user_id,
    email: row.email,
    ticker: row.ticker,
    notes: row.notes || undefined,
    tags,
    alertOnOpportunity: Boolean(row.alert_on_opportunity),
    alertRules: {
      opportunity: Boolean(row.alert_on_opportunity),
      signalChange: Boolean(row.alert_on_signal_change),
      convictionAbove: row.conviction_above ?? undefined,
      priceAbove: row.price_above ?? undefined,
      priceBelow: row.price_below ?? undefined,
      earningsWithinDays: row.earnings_within_days ?? undefined,
    },
    addedAt: row.added_at,
    updatedAt: row.updated_at,
  };
}

interface WatchtowerReportDbRow {
  id: string;
  report_date: string;
  language: WatchtowerLanguage;
  title: string;
  status: WatchtowerStatus;
  author_email: string;
  reviewer_email: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  content_json: string;
}

function mapWatchlistNotificationRow(
  row: WatchlistNotificationDbRow
): WatchlistNotificationRecord {
  let metadata: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(row.metadata_json) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      metadata = parsed as Record<string, unknown>;
    }
  } catch {
    metadata = {};
  }
  return {
    id: row.id,
    userId: row.user_id,
    email: row.email,
    listId: row.list_id,
    ticker: row.ticker,
    kind: row.kind,
    title: row.title,
    body: row.body,
    fingerprint: row.fingerprint,
    metadata,
    createdAt: row.created_at,
    readAt: row.read_at || undefined,
  };
}

function mapWatchlistAlertStateRow(
  row: WatchlistAlertStateDbRow
): WatchlistAlertStateRecord {
  return {
    itemId: row.item_id,
    ruleKind: row.rule_kind,
    lastCondition: Boolean(row.last_condition),
    lastValue: row.last_value || undefined,
    lastSnapshotAt: row.last_snapshot_at,
    updatedAt: row.updated_at,
  };
}

function mapWatchlistDeliveryRow(
  row: WatchlistDeliveryDbRow
): WatchlistDeliveryRecord {
  return {
    id: row.id,
    notificationId: row.notification_id,
    userId: row.user_id,
    email: row.email,
    channel: row.channel,
    status: row.status,
    attempts: row.attempts,
    nextAttemptAt: row.next_attempt_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sentAt: row.sent_at || undefined,
    lastError: row.last_error || undefined,
  };
}

function mapSavedPortfolioScenarioRow(
  row: SavedPortfolioScenarioDbRow
): SavedPortfolioScenarioRecord {
  let tickers: string[] = [];
  try {
    const parsed = JSON.parse(row.tickers_json) as unknown;
    tickers = Array.isArray(parsed)
      ? parsed.filter((ticker): ticker is string => typeof ticker === "string")
      : [];
  } catch {
    tickers = [];
  }
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    listId: row.list_id,
    weighting: row.weighting,
    transactionCostBps: row.transaction_cost_bps,
    tickers,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapWatchlistCollectionRow(
  row: WatchlistCollectionDbRow
): WatchlistCollectionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    color: row.color,
    isDefault: false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapWatchlistItemRow(row: WatchlistItemDbRow): WatchlistItemRecord {
  let tags: string[] = [];
  try {
    const parsed = JSON.parse(row.tags_json) as unknown;
    tags = Array.isArray(parsed)
      ? parsed.filter((tag): tag is string => typeof tag === "string")
      : [];
  } catch {
    tags = [];
  }

  return {
    id: row.id,
    listId: row.list_id,
    userId: row.user_id,
    email: row.email,
    ticker: row.ticker,
    notes: row.notes || undefined,
    tags,
    alertRules: {
      opportunity: Boolean(row.alert_on_opportunity),
      signalChange: Boolean(row.alert_on_signal_change),
      convictionAbove: row.conviction_above ?? undefined,
      priceAbove: row.price_above ?? undefined,
      priceBelow: row.price_below ?? undefined,
      earningsWithinDays: row.earnings_within_days ?? undefined,
    },
    addedAt: row.added_at,
    updatedAt: row.updated_at,
  };
}

function mapAgentRunRow(row: AgentRunDbRow): AgentRunRecord {
  return {
    id: row.id,
    runType: row.run_type,
    status: row.status,
    tickersScanned: row.tickers_scanned,
    opportunitiesFound: row.opportunities_found,
    errors: JSON.parse(row.errors_json) as string[],
    log: row.log,
    retryCount: row.retry_count,
    startedAt: row.started_at,
    completedAt: row.completed_at || undefined,
  };
}

function mapMomentumReportRow(row: MomentumReportDbRow): MomentumReportRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    reportDate: row.report_date,
    status: row.status,
    authorEmail: row.author_email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at || undefined,
    content: JSON.parse(row.content_json) as MomentumReportRecord["content"],
  };
}

function mapWatchtowerReportRow(
  row: WatchtowerReportDbRow
): WatchtowerReportRecord {
  return {
    id: row.id,
    reportDate: row.report_date,
    language: row.language,
    title: row.title,
    status: row.status,
    authorEmail: row.author_email,
    reviewerEmail: row.reviewer_email || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at || undefined,
    content: JSON.parse(row.content_json) as WatchtowerReportRecord["content"],
  };
}

function mapDailyReportRow(row: DailyReportDbRow): DailyReportRecord {
  const content =
    row.content_json && row.content_json.trim()
      ? (JSON.parse(row.content_json) as Record<string, unknown>)
      : {};
  const normalizeOptionalString = (value: unknown) =>
    typeof value === "string" && value.trim() ? value.trim() : undefined;
  const normalizeStringArray = (
    value: unknown,
    transform?: (item: string) => string
  ) =>
    Array.isArray(value)
      ? value
          .filter((item): item is string => typeof item === "string")
          .map(item => (transform ? transform(item) : item).trim())
          .filter(Boolean)
      : [];
  const normalizeMetadataItems = (value: unknown) =>
    Array.isArray(value)
      ? value
          .filter(
            (item): item is { label?: unknown; value?: unknown } =>
              Boolean(item) && typeof item === "object"
          )
          .map(item => ({
            label: normalizeOptionalString(item.label) || "",
            value: normalizeOptionalString(item.value) || "",
          }))
          .filter(item => item.label && item.value)
      : [];

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    reportDate: row.report_date,
    status: row.status,
    authorEmail: row.author_email,
    sourceFolder: row.source_folder,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at || undefined,
    content: {
      headline:
        (typeof content.headline === "string" && content.headline.trim()) ||
        `${row.title} icin yayinlanmis daily report`,
      author: normalizeOptionalString(content.author),
      coverage: normalizeOptionalString(content.coverage),
      methodology: normalizeOptionalString(content.methodology),
      metadataItems: normalizeMetadataItems(content.metadataItems),
      executiveSummary: normalizeStringArray(content.executiveSummary),
      markdown: typeof content.markdown === "string" ? content.markdown : "",
      html: normalizeOptionalString(content.html),
      sectionFiles: normalizeStringArray(content.sectionFiles),
      figureFiles: normalizeStringArray(content.figureFiles),
      openAiFigureFiles: normalizeStringArray(content.openAiFigureFiles),
      tickerUniverse: normalizeStringArray(content.tickerUniverse, item =>
        item.toUpperCase()
      ),
      researchFileCount:
        typeof content.researchFileCount === "number" &&
        Number.isFinite(content.researchFileCount)
          ? content.researchFileCount
          : 0,
      sourceKind: content.sourceKind === "file" ? "file" : "folder",
      contentFormat: content.contentFormat === "html" ? "html" : "markdown",
      sourceLabel: normalizeOptionalString(content.sourceLabel),
      assetBasePath: normalizeOptionalString(content.assetBasePath),
      language:
        content.language === "tr" || content.language === "en"
          ? content.language
          : undefined,
      availableLanguages: Array.isArray(content.availableLanguages)
        ? content.availableLanguages.filter(
            (item): item is "tr" | "en" => item === "tr" || item === "en"
          )
        : undefined,
      translations:
        content.translations && typeof content.translations === "object"
          ? Object.entries(content.translations).reduce<
              Partial<Record<"tr" | "en", string>>
            >((acc, [lang, value]) => {
              if (
                (lang === "tr" || lang === "en") &&
                typeof value === "string" &&
                value.trim()
              ) {
                acc[lang] = value;
              }
              return acc;
            }, {})
          : undefined,
      sourceHash: normalizeOptionalString(content.sourceHash),
      translationMeta:
        content.translationMeta && typeof content.translationMeta === "object"
          ? Object.entries(content.translationMeta).reduce<
              Partial<
                Record<
                  "tr" | "en",
                  {
                    status: "pending" | "done" | "stale" | "failed";
                    engine: "llm" | "human";
                    promptVersion?: string;
                    sourceHash?: string;
                    translatedAt?: string;
                    error?: string;
                  }
                >
              >
            >((acc, [lang, value]) => {
              if (
                (lang === "tr" || lang === "en") &&
                value &&
                typeof value === "object"
              ) {
                const meta = value as {
                  status?: unknown;
                  engine?: unknown;
                  promptVersion?: unknown;
                  sourceHash?: unknown;
                  translatedAt?: unknown;
                  error?: unknown;
                };
                const status =
                  meta.status === "pending" ||
                  meta.status === "done" ||
                  meta.status === "stale" ||
                  meta.status === "failed"
                    ? meta.status
                    : undefined;
                const engine =
                  meta.engine === "llm" || meta.engine === "human"
                    ? meta.engine
                    : undefined;
                if (status && engine) {
                  acc[lang as "tr" | "en"] = {
                    status,
                    engine,
                    promptVersion: normalizeOptionalString(meta.promptVersion),
                    sourceHash: normalizeOptionalString(meta.sourceHash),
                    translatedAt: normalizeOptionalString(meta.translatedAt),
                    error: normalizeOptionalString(meta.error),
                  };
                }
              }
              return acc;
            }, {})
          : undefined,
    },
  };
}

function mapCoverageReportRow(row: CoverageReportDbRow) {
  return {
    id: row.id,
    importedAt: row.imported_at,
    raw: row.raw,
    sourceName: row.source_name,
  };
}

function mapFlowReportCommentRow(
  row: FlowReportCommentDbRow
): FlowReportComment {
  return {
    id: row.id,
    reportId: row.report_id,
    userId: row.user_id,
    userName: row.user_name,
    userPicture: row.user_picture || undefined,
    body: row.body,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createBillingStore() {
  const dbPath = getDatabasePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const db = new DatabaseSync(dbPath);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS billing_orders (
      order_id TEXT PRIMARY KEY,
      token TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_billing_orders_user_id
      ON billing_orders(user_id);

    CREATE INDEX IF NOT EXISTS idx_billing_orders_status
      ON billing_orders(status);

    CREATE TABLE IF NOT EXISTS auth_users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      picture TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_auth_users_email
      ON auth_users(email);

    CREATE TABLE IF NOT EXISTS auth_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS weekly_reports (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      week_start TEXT NOT NULL,
      week_end TEXT NOT NULL,
      analysis_date TEXT NOT NULL,
      status TEXT NOT NULL,
      author_email TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      published_at TEXT,
      content_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS opportunities (
      id TEXT PRIMARY KEY,
      source_report_id TEXT,
      source_report_title TEXT,
      ticker TEXT NOT NULL,
      name TEXT NOT NULL,
      sector TEXT NOT NULL,
      earnings_date TEXT NOT NULL,
      earnings_time TEXT NOT NULL,
      days_to_earnings INTEGER NOT NULL,
      opportunity_window TEXT NOT NULL,
      momentum_score REAL NOT NULL,
      price_change_6m REAL NOT NULL,
      rsi_14 REAL NOT NULL,
      current_iv REAL NOT NULL,
      historical_iv REAL NOT NULL,
      implied_move_percent REAL NOT NULL,
      expected_iv_crush REAL NOT NULL,
      iv_crush_score REAL NOT NULL,
      beat_rate REAL NOT NULL,
      max_loss_percent REAL NOT NULL,
      target_profit_percent REAL NOT NULL,
      earnings_miss_risk REAL NOT NULL,
      gap_risk REAL NOT NULL,
      composite_score REAL NOT NULL,
      confidence_level TEXT NOT NULL,
      directional_bias TEXT NOT NULL,
      strategy_type TEXT NOT NULL,
      strategy_rating REAL NOT NULL,
      recommended_strategy TEXT NOT NULL,
      ai_summary TEXT NOT NULL,
      ai_strategy_rationale TEXT NOT NULL,
      ai_key_catalysts_json TEXT NOT NULL,
      ai_execution_notes TEXT NOT NULL,
      risk_warnings_json TEXT NOT NULL,
      data_sources_json TEXT NOT NULL,
      tier_required TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      UNIQUE(ticker, earnings_date, opportunity_window)
    );

    CREATE TABLE IF NOT EXISTS watchlists (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      ticker TEXT NOT NULL,
      notes TEXT,
      tags_json TEXT NOT NULL DEFAULT '[]',
      alert_on_opportunity INTEGER NOT NULL DEFAULT 1,
      alert_on_signal_change INTEGER NOT NULL DEFAULT 1,
      conviction_above REAL,
      price_above REAL,
      price_below REAL,
      earnings_within_days INTEGER,
      added_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(user_id, ticker)
    );

    CREATE TABLE IF NOT EXISTS watchlist_collections (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#38bdf8',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(user_id, name)
    );

    CREATE TABLE IF NOT EXISTS watchlist_collection_items (
      id TEXT PRIMARY KEY,
      list_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      ticker TEXT NOT NULL,
      notes TEXT,
      tags_json TEXT NOT NULL DEFAULT '[]',
      alert_on_opportunity INTEGER NOT NULL DEFAULT 1,
      alert_on_signal_change INTEGER NOT NULL DEFAULT 1,
      conviction_above REAL,
      price_above REAL,
      price_below REAL,
      earnings_within_days INTEGER,
      added_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(list_id, ticker),
      FOREIGN KEY (list_id) REFERENCES watchlist_collections(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS watchlist_notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      list_id TEXT NOT NULL,
      ticker TEXT NOT NULL,
      kind TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      fingerprint TEXT NOT NULL,
      metadata_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL,
      read_at TEXT,
      UNIQUE(user_id, fingerprint)
    );

    CREATE TABLE IF NOT EXISTS watchlist_alert_state (
      item_id TEXT NOT NULL,
      rule_kind TEXT NOT NULL,
      last_condition INTEGER NOT NULL DEFAULT 0,
      last_value TEXT,
      last_snapshot_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY(item_id, rule_kind)
    );

    CREATE TABLE IF NOT EXISTS watchlist_deliveries (
      id TEXT PRIMARY KEY,
      notification_id TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      channel TEXT NOT NULL DEFAULT 'email',
      status TEXT NOT NULL DEFAULT 'pending',
      attempts INTEGER NOT NULL DEFAULT 0,
      next_attempt_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      sent_at TEXT,
      last_error TEXT,
      FOREIGN KEY (notification_id) REFERENCES watchlist_notifications(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS saved_portfolio_scenarios (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      list_id TEXT NOT NULL,
      weighting TEXT NOT NULL,
      transaction_cost_bps REAL NOT NULL DEFAULT 0,
      tickers_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS agent_runs (
      id TEXT PRIMARY KEY,
      run_type TEXT NOT NULL,
      status TEXT NOT NULL,
      tickers_scanned INTEGER NOT NULL,
      opportunities_found INTEGER NOT NULL,
      errors_json TEXT NOT NULL,
      log TEXT NOT NULL,
      retry_count INTEGER NOT NULL DEFAULT 0,
      started_at TEXT NOT NULL,
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS momentum_reports (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      report_date TEXT NOT NULL,
      status TEXT NOT NULL,
      author_email TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      published_at TEXT,
      content_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS daily_reports (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      report_date TEXT NOT NULL,
      status TEXT NOT NULL,
      author_email TEXT NOT NULL,
      source_folder TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      published_at TEXT,
      content_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS watchtower_reports (
      id TEXT PRIMARY KEY,
      report_date TEXT NOT NULL,
      language TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL,
      author_email TEXT NOT NULL,
      reviewer_email TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      published_at TEXT,
      content_json TEXT NOT NULL,
      UNIQUE(report_date, language)
    );

    CREATE TABLE IF NOT EXISTS coverage_reports (
      id TEXT PRIMARY KEY,
      source_name TEXT NOT NULL UNIQUE,
      imported_at TEXT NOT NULL,
      raw TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS flow_report_comments (
      id TEXT PRIMARY KEY,
      report_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_picture TEXT,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS flow_report_engagements (
      report_id TEXT NOT NULL,
      actor_key TEXT NOT NULL,
      read_count INTEGER NOT NULL DEFAULT 0,
      liked INTEGER NOT NULL DEFAULT 0,
      share_count INTEGER NOT NULL DEFAULT 0,
      first_read_at TEXT,
      last_read_at TEXT,
      liked_at TEXT,
      first_shared_at TEXT,
      last_shared_at TEXT,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (report_id, actor_key)
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      email TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      subscribed_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id
      ON auth_sessions(user_id);

    CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires_at
      ON auth_sessions(expires_at);

    CREATE INDEX IF NOT EXISTS idx_weekly_reports_status_week
      ON weekly_reports(status, week_start);

    CREATE INDEX IF NOT EXISTS idx_weekly_reports_slug
      ON weekly_reports(slug);

    CREATE INDEX IF NOT EXISTS idx_watchtower_status_date
      ON watchtower_reports(status, language, report_date DESC);

    CREATE INDEX IF NOT EXISTS idx_opportunities_status_score
      ON opportunities(status, composite_score DESC);

    CREATE INDEX IF NOT EXISTS idx_opportunities_earnings_date
      ON opportunities(earnings_date);

    CREATE INDEX IF NOT EXISTS idx_watchlists_user_id
      ON watchlists(user_id);

    CREATE INDEX IF NOT EXISTS idx_watchlist_collections_user_id
      ON watchlist_collections(user_id, updated_at DESC);

    CREATE INDEX IF NOT EXISTS idx_watchlist_collection_items_list_id
      ON watchlist_collection_items(list_id, added_at DESC);

    CREATE INDEX IF NOT EXISTS idx_watchlist_collection_items_user_id
      ON watchlist_collection_items(user_id, ticker);

    CREATE INDEX IF NOT EXISTS idx_watchlist_notifications_user_created
      ON watchlist_notifications(user_id, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_watchlist_notifications_unread
      ON watchlist_notifications(user_id, read_at, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_watchlist_deliveries_pending
      ON watchlist_deliveries(status, next_attempt_at);

    CREATE INDEX IF NOT EXISTS idx_saved_portfolio_scenarios_user
      ON saved_portfolio_scenarios(user_id, updated_at DESC);

    CREATE INDEX IF NOT EXISTS idx_agent_runs_started_at
      ON agent_runs(started_at DESC);

    CREATE INDEX IF NOT EXISTS idx_momentum_reports_status_date
      ON momentum_reports(status, report_date DESC);

    CREATE INDEX IF NOT EXISTS idx_daily_reports_status_date
      ON daily_reports(status, report_date DESC);

    CREATE INDEX IF NOT EXISTS idx_flow_report_comments_report_date
      ON flow_report_comments(report_id, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_flow_report_comments_user_id
      ON flow_report_comments(user_id);

    CREATE INDEX IF NOT EXISTS idx_flow_report_engagements_report_id
      ON flow_report_engagements(report_id);
  `);

  const watchlistTableInfo = db
    .prepare("PRAGMA table_info(watchlists)")
    .all() as unknown as TableInfoRow[];
  const watchlistColumnNames = new Set(watchlistTableInfo.map(row => row.name));
  const watchlistColumnUpgrades = [
    ["tags_json", "TEXT NOT NULL DEFAULT '[]'"],
    ["alert_on_signal_change", "INTEGER NOT NULL DEFAULT 1"],
    ["conviction_above", "REAL"],
    ["price_above", "REAL"],
    ["price_below", "REAL"],
    ["earnings_within_days", "INTEGER"],
  ] as const;
  for (const [columnName, columnDefinition] of watchlistColumnUpgrades) {
    if (!watchlistColumnNames.has(columnName)) {
      db.exec(`ALTER TABLE watchlists ADD COLUMN ${columnName} ${columnDefinition}`);
    }
  }

  const subscriptionTableInfo = db
    .prepare("PRAGMA table_info(billing_subscriptions)")
    .all() as unknown as TableInfoRow[] | undefined;
  const usesLegacySubscriptionSchema = Boolean(
    subscriptionTableInfo?.some(row => row.name === "user_id" && row.pk === 1)
  );

  if (!subscriptionTableInfo?.length) {
    db.exec(getSubscriptionTableSql("billing_subscriptions"));
  } else if (usesLegacySubscriptionSchema) {
    db.exec(`
      ALTER TABLE billing_subscriptions RENAME TO billing_subscriptions_legacy;
      ${getSubscriptionTableSql("billing_subscriptions")}
      INSERT OR REPLACE INTO billing_subscriptions (
        email,
        user_id,
        provider,
        status,
        plan,
        started_at,
        ends_at,
        updated_at,
        last_order_id
      )
      SELECT
        email,
        user_id,
        provider,
        status,
        plan,
        started_at,
        ends_at,
        updated_at,
        last_order_id
      FROM billing_subscriptions_legacy
      WHERE TRIM(COALESCE(email, '')) <> ''
      ORDER BY updated_at ASC;
      DROP TABLE billing_subscriptions_legacy;
    `);
  }

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_user_id
      ON billing_subscriptions(user_id);

    CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_last_order
      ON billing_subscriptions(last_order_id);
  `);

  const getSubscriptionByUserStmt = db.prepare(`
    SELECT
      user_id,
      email,
      provider,
      status,
      plan,
      started_at,
      ends_at,
      updated_at,
      last_order_id
    FROM billing_subscriptions
    WHERE user_id = ?
    LIMIT 1
  `);

  const getSubscriptionByEmailStmt = db.prepare(`
    SELECT
      user_id,
      email,
      provider,
      status,
      plan,
      started_at,
      ends_at,
      updated_at,
      last_order_id
    FROM billing_subscriptions
    WHERE email = ?
    LIMIT 1
  `);

  const getSubscriptionByLastOrderStmt = db.prepare(`
    SELECT
      user_id,
      email,
      provider,
      status,
      plan,
      started_at,
      ends_at,
      updated_at,
      last_order_id
    FROM billing_subscriptions
    WHERE last_order_id = ?
    LIMIT 1
  `);

  const upsertSubscriptionStmt = db.prepare(`
    INSERT INTO billing_subscriptions (
      email,
      user_id,
      provider,
      status,
      plan,
      started_at,
      ends_at,
      updated_at,
      last_order_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET
      user_id = COALESCE(excluded.user_id, billing_subscriptions.user_id),
      provider = excluded.provider,
      status = excluded.status,
      plan = excluded.plan,
      started_at = excluded.started_at,
      ends_at = excluded.ends_at,
      updated_at = excluded.updated_at,
      last_order_id = excluded.last_order_id
  `);

  const getOrderByIdStmt = db.prepare(`
    SELECT
      order_id,
      token,
      user_id,
      email,
      name,
      amount,
      currency,
      status,
      created_at,
      updated_at
    FROM billing_orders
    WHERE order_id = ?
    LIMIT 1
  `);

  const getOrderByTokenStmt = db.prepare(`
    SELECT
      order_id,
      token,
      user_id,
      email,
      name,
      amount,
      currency,
      status,
      created_at,
      updated_at
    FROM billing_orders
    WHERE token = ?
    LIMIT 1
  `);

  const upsertOrderStmt = db.prepare(`
    INSERT INTO billing_orders (
      order_id,
      token,
      user_id,
      email,
      name,
      amount,
      currency,
      status,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(order_id) DO UPDATE SET
      token = excluded.token,
      user_id = excluded.user_id,
      email = excluded.email,
      name = excluded.name,
      amount = excluded.amount,
      currency = excluded.currency,
      status = excluded.status,
      created_at = excluded.created_at,
      updated_at = excluded.updated_at
  `);

  const updateOrderStatusStmt = db.prepare(`
    UPDATE billing_orders
    SET status = ?, updated_at = ?
    WHERE order_id = ?
  `);

  const getUserByIdStmt = db.prepare(`
    SELECT
      id,
      email,
      name,
      picture,
      created_at,
      updated_at
    FROM auth_users
    WHERE id = ?
    LIMIT 1
  `);

  const getUserByEmailStmt = db.prepare(`
    SELECT
      id,
      email,
      name,
      picture,
      created_at,
      updated_at
    FROM auth_users
    WHERE email = ?
    LIMIT 1
  `);

  const upsertUserStmt = db.prepare(`
    INSERT INTO auth_users (
      id,
      email,
      name,
      picture,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      email = excluded.email,
      name = excluded.name,
      picture = excluded.picture,
      updated_at = excluded.updated_at
  `);

  const getSessionByIdStmt = db.prepare(`
    SELECT
      id,
      user_id,
      expires_at,
      created_at,
      updated_at
    FROM auth_sessions
    WHERE id = ?
    LIMIT 1
  `);

  const upsertSessionStmt = db.prepare(`
    INSERT INTO auth_sessions (
      id,
      user_id,
      expires_at,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      user_id = excluded.user_id,
      expires_at = excluded.expires_at,
      updated_at = excluded.updated_at
  `);

  const deleteSessionStmt = db.prepare(`
    DELETE FROM auth_sessions
    WHERE id = ?
  `);

  const deleteExpiredSessionsStmt = db.prepare(`
    DELETE FROM auth_sessions
    WHERE expires_at < ?
  `);

  const listWeeklyReportsStmt = db.prepare(`
    SELECT
      id,
      slug,
      title,
      week_start,
      week_end,
      analysis_date,
      status,
      author_email,
      created_at,
      updated_at,
      published_at,
      content_json
    FROM weekly_reports
    ORDER BY week_start DESC, updated_at DESC
  `);

  const getWeeklyReportByIdStmt = db.prepare(`
    SELECT
      id,
      slug,
      title,
      week_start,
      week_end,
      analysis_date,
      status,
      author_email,
      created_at,
      updated_at,
      published_at,
      content_json
    FROM weekly_reports
    WHERE id = ?
    LIMIT 1
  `);

  const upsertWeeklyReportStmt = db.prepare(`
    INSERT INTO weekly_reports (
      id,
      slug,
      title,
      week_start,
      week_end,
      analysis_date,
      status,
      author_email,
      created_at,
      updated_at,
      published_at,
      content_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      title = excluded.title,
      week_start = excluded.week_start,
      week_end = excluded.week_end,
      analysis_date = excluded.analysis_date,
      status = excluded.status,
      author_email = excluded.author_email,
      created_at = excluded.created_at,
      updated_at = excluded.updated_at,
      published_at = excluded.published_at,
      content_json = excluded.content_json
  `);

  const listOpportunitiesStmt = db.prepare(`
    SELECT
      id,
      source_report_id,
      source_report_title,
      ticker,
      name,
      sector,
      earnings_date,
      earnings_time,
      days_to_earnings,
      opportunity_window,
      momentum_score,
      price_change_6m,
      rsi_14,
      current_iv,
      historical_iv,
      implied_move_percent,
      expected_iv_crush,
      iv_crush_score,
      beat_rate,
      max_loss_percent,
      target_profit_percent,
      earnings_miss_risk,
      gap_risk,
      composite_score,
      confidence_level,
      directional_bias,
      strategy_type,
      strategy_rating,
      recommended_strategy,
      ai_summary,
      ai_strategy_rationale,
      ai_key_catalysts_json,
      ai_execution_notes,
      risk_warnings_json,
      data_sources_json,
      tier_required,
      status,
      created_at,
      updated_at,
      expires_at
    FROM opportunities
    ORDER BY composite_score DESC, earnings_date ASC, ticker ASC
  `);

  const upsertOpportunityStmt = db.prepare(`
    INSERT INTO opportunities (
      id,
      source_report_id,
      source_report_title,
      ticker,
      name,
      sector,
      earnings_date,
      earnings_time,
      days_to_earnings,
      opportunity_window,
      momentum_score,
      price_change_6m,
      rsi_14,
      current_iv,
      historical_iv,
      implied_move_percent,
      expected_iv_crush,
      iv_crush_score,
      beat_rate,
      max_loss_percent,
      target_profit_percent,
      earnings_miss_risk,
      gap_risk,
      composite_score,
      confidence_level,
      directional_bias,
      strategy_type,
      strategy_rating,
      recommended_strategy,
      ai_summary,
      ai_strategy_rationale,
      ai_key_catalysts_json,
      ai_execution_notes,
      risk_warnings_json,
      data_sources_json,
      tier_required,
      status,
      created_at,
      updated_at,
      expires_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      source_report_id = excluded.source_report_id,
      source_report_title = excluded.source_report_title,
      ticker = excluded.ticker,
      name = excluded.name,
      sector = excluded.sector,
      earnings_date = excluded.earnings_date,
      earnings_time = excluded.earnings_time,
      days_to_earnings = excluded.days_to_earnings,
      opportunity_window = excluded.opportunity_window,
      momentum_score = excluded.momentum_score,
      price_change_6m = excluded.price_change_6m,
      rsi_14 = excluded.rsi_14,
      current_iv = excluded.current_iv,
      historical_iv = excluded.historical_iv,
      implied_move_percent = excluded.implied_move_percent,
      expected_iv_crush = excluded.expected_iv_crush,
      iv_crush_score = excluded.iv_crush_score,
      beat_rate = excluded.beat_rate,
      max_loss_percent = excluded.max_loss_percent,
      target_profit_percent = excluded.target_profit_percent,
      earnings_miss_risk = excluded.earnings_miss_risk,
      gap_risk = excluded.gap_risk,
      composite_score = excluded.composite_score,
      confidence_level = excluded.confidence_level,
      directional_bias = excluded.directional_bias,
      strategy_type = excluded.strategy_type,
      strategy_rating = excluded.strategy_rating,
      recommended_strategy = excluded.recommended_strategy,
      ai_summary = excluded.ai_summary,
      ai_strategy_rationale = excluded.ai_strategy_rationale,
      ai_key_catalysts_json = excluded.ai_key_catalysts_json,
      ai_execution_notes = excluded.ai_execution_notes,
      risk_warnings_json = excluded.risk_warnings_json,
      data_sources_json = excluded.data_sources_json,
      tier_required = excluded.tier_required,
      status = excluded.status,
      created_at = excluded.created_at,
      updated_at = excluded.updated_at,
      expires_at = excluded.expires_at
  `);

  const listWatchlistByUserIdStmt = db.prepare(`
    SELECT
      id,
      user_id,
      email,
      ticker,
      notes,
      tags_json,
      alert_on_opportunity,
      alert_on_signal_change,
      conviction_above,
      price_above,
      price_below,
      earnings_within_days,
      added_at,
      updated_at
    FROM watchlists
    WHERE user_id = ?
    ORDER BY added_at DESC, ticker ASC
  `);

  const upsertWatchlistStmt = db.prepare(`
    INSERT INTO watchlists (
      id,
      user_id,
      email,
      ticker,
      notes,
      tags_json,
      alert_on_opportunity,
      alert_on_signal_change,
      conviction_above,
      price_above,
      price_below,
      earnings_within_days,
      added_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, ticker) DO UPDATE SET
      email = excluded.email,
      notes = excluded.notes,
      tags_json = excluded.tags_json,
      alert_on_opportunity = excluded.alert_on_opportunity,
      alert_on_signal_change = excluded.alert_on_signal_change,
      conviction_above = excluded.conviction_above,
      price_above = excluded.price_above,
      price_below = excluded.price_below,
      earnings_within_days = excluded.earnings_within_days,
      updated_at = excluded.updated_at
  `);

  const deleteWatchlistStmt = db.prepare(`
    DELETE FROM watchlists
    WHERE user_id = ? AND ticker = ?
  `);

  const listWatchlistCollectionsStmt = db.prepare(`
    SELECT id, user_id, name, color, created_at, updated_at
    FROM watchlist_collections
    WHERE user_id = ?
    ORDER BY updated_at DESC, name ASC
  `);

  const getWatchlistCollectionStmt = db.prepare(`
    SELECT id, user_id, name, color, created_at, updated_at
    FROM watchlist_collections
    WHERE id = ? AND user_id = ?
  `);

  const insertWatchlistCollectionStmt = db.prepare(`
    INSERT INTO watchlist_collections (
      id, user_id, name, color, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  const updateWatchlistCollectionStmt = db.prepare(`
    UPDATE watchlist_collections
    SET name = ?, color = ?, updated_at = ?
    WHERE id = ? AND user_id = ?
  `);

  const deleteWatchlistCollectionStmt = db.prepare(`
    DELETE FROM watchlist_collections
    WHERE id = ? AND user_id = ?
  `);

  const listWatchlistItemsStmt = db.prepare(`
    SELECT
      id, list_id, user_id, email, ticker, notes, tags_json,
      alert_on_opportunity, alert_on_signal_change, conviction_above,
      price_above, price_below, earnings_within_days, added_at, updated_at
    FROM watchlist_collection_items
    WHERE list_id = ? AND user_id = ?
    ORDER BY added_at DESC, ticker ASC
  `);

  const upsertWatchlistItemStmt = db.prepare(`
    INSERT INTO watchlist_collection_items (
      id, list_id, user_id, email, ticker, notes, tags_json,
      alert_on_opportunity, alert_on_signal_change, conviction_above,
      price_above, price_below, earnings_within_days, added_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(list_id, ticker) DO UPDATE SET
      email = excluded.email,
      notes = excluded.notes,
      tags_json = excluded.tags_json,
      alert_on_opportunity = excluded.alert_on_opportunity,
      alert_on_signal_change = excluded.alert_on_signal_change,
      conviction_above = excluded.conviction_above,
      price_above = excluded.price_above,
      price_below = excluded.price_below,
      earnings_within_days = excluded.earnings_within_days,
      updated_at = excluded.updated_at
  `);

  const deleteWatchlistItemStmt = db.prepare(`
    DELETE FROM watchlist_collection_items
    WHERE list_id = ? AND user_id = ? AND ticker = ?
  `);

  const listAllWatchlistsStmt = db.prepare(`
    SELECT
      id, user_id, email, ticker, notes, tags_json,
      alert_on_opportunity, alert_on_signal_change, conviction_above,
      price_above, price_below, earnings_within_days, added_at, updated_at
    FROM watchlists
    ORDER BY user_id, ticker
  `);

  const listAllWatchlistItemsStmt = db.prepare(`
    SELECT
      id, list_id, user_id, email, ticker, notes, tags_json,
      alert_on_opportunity, alert_on_signal_change, conviction_above,
      price_above, price_below, earnings_within_days, added_at, updated_at
    FROM watchlist_collection_items
    ORDER BY user_id, ticker
  `);

  const getWatchlistAlertStateStmt = db.prepare(`
    SELECT item_id, rule_kind, last_condition, last_value, last_snapshot_at, updated_at
    FROM watchlist_alert_state
    WHERE item_id = ? AND rule_kind = ?
  `);

  const upsertWatchlistAlertStateStmt = db.prepare(`
    INSERT INTO watchlist_alert_state (
      item_id, rule_kind, last_condition, last_value, last_snapshot_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(item_id, rule_kind) DO UPDATE SET
      last_condition = excluded.last_condition,
      last_value = excluded.last_value,
      last_snapshot_at = excluded.last_snapshot_at,
      updated_at = excluded.updated_at
  `);

  const insertWatchlistNotificationStmt = db.prepare(`
    INSERT OR IGNORE INTO watchlist_notifications (
      id, user_id, email, list_id, ticker, kind, title, body,
      fingerprint, metadata_json, created_at, read_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const getWatchlistNotificationStmt = db.prepare(`
    SELECT
      id, user_id, email, list_id, ticker, kind, title, body,
      fingerprint, metadata_json, created_at, read_at
    FROM watchlist_notifications
    WHERE id = ?
  `);

  const listWatchlistNotificationsStmt = db.prepare(`
    SELECT
      id, user_id, email, list_id, ticker, kind, title, body,
      fingerprint, metadata_json, created_at, read_at
    FROM watchlist_notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `);

  const countUnreadWatchlistNotificationsStmt = db.prepare(`
    SELECT COUNT(*) AS count
    FROM watchlist_notifications
    WHERE user_id = ? AND read_at IS NULL
  `);

  const markWatchlistNotificationReadStmt = db.prepare(`
    UPDATE watchlist_notifications
    SET read_at = COALESCE(read_at, ?)
    WHERE id = ? AND user_id = ?
  `);

  const markAllWatchlistNotificationsReadStmt = db.prepare(`
    UPDATE watchlist_notifications
    SET read_at = COALESCE(read_at, ?)
    WHERE user_id = ?
  `);

  const insertWatchlistDeliveryStmt = db.prepare(`
    INSERT OR IGNORE INTO watchlist_deliveries (
      id, notification_id, user_id, email, channel, status, attempts,
      next_attempt_at, created_at, updated_at, sent_at, last_error
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const listPendingWatchlistDeliveriesStmt = db.prepare(`
    SELECT
      id, notification_id, user_id, email, channel, status, attempts,
      next_attempt_at, created_at, updated_at, sent_at, last_error
    FROM watchlist_deliveries
    WHERE status IN ('pending', 'failed') AND next_attempt_at <= ?
    ORDER BY next_attempt_at ASC
    LIMIT ?
  `);

  const updateWatchlistDeliveryStmt = db.prepare(`
    UPDATE watchlist_deliveries
    SET status = ?, attempts = ?, next_attempt_at = ?, updated_at = ?,
        sent_at = ?, last_error = ?
    WHERE id = ?
  `);

  const listSavedPortfolioScenariosStmt = db.prepare(`
    SELECT
      id, user_id, name, list_id, weighting, transaction_cost_bps,
      tickers_json, created_at, updated_at
    FROM saved_portfolio_scenarios
    WHERE user_id = ?
    ORDER BY updated_at DESC
  `);

  const upsertSavedPortfolioScenarioStmt = db.prepare(`
    INSERT INTO saved_portfolio_scenarios (
      id, user_id, name, list_id, weighting, transaction_cost_bps,
      tickers_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      list_id = excluded.list_id,
      weighting = excluded.weighting,
      transaction_cost_bps = excluded.transaction_cost_bps,
      tickers_json = excluded.tickers_json,
      updated_at = excluded.updated_at
    WHERE saved_portfolio_scenarios.user_id = excluded.user_id
  `);

  const deleteSavedPortfolioScenarioStmt = db.prepare(`
    DELETE FROM saved_portfolio_scenarios
    WHERE id = ? AND user_id = ?
  `);

  const listAgentRunsStmt = db.prepare(`
    SELECT
      id,
      run_type,
      status,
      tickers_scanned,
      opportunities_found,
      errors_json,
      log,
      retry_count,
      started_at,
      completed_at
    FROM agent_runs
    ORDER BY started_at DESC
    LIMIT 50
  `);

  const upsertAgentRunStmt = db.prepare(`
    INSERT INTO agent_runs (
      id,
      run_type,
      status,
      tickers_scanned,
      opportunities_found,
      errors_json,
      log,
      retry_count,
      started_at,
      completed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      run_type = excluded.run_type,
      status = excluded.status,
      tickers_scanned = excluded.tickers_scanned,
      opportunities_found = excluded.opportunities_found,
      errors_json = excluded.errors_json,
      log = excluded.log,
      retry_count = excluded.retry_count,
      started_at = excluded.started_at,
      completed_at = excluded.completed_at
  `);

  const listMomentumReportsStmt = db.prepare(`
    SELECT
      id,
      slug,
      title,
      report_date,
      status,
      author_email,
      created_at,
      updated_at,
      published_at,
      content_json
    FROM momentum_reports
    ORDER BY report_date DESC, updated_at DESC
  `);

  const getMomentumReportByIdStmt = db.prepare(`
    SELECT
      id,
      slug,
      title,
      report_date,
      status,
      author_email,
      created_at,
      updated_at,
      published_at,
      content_json
    FROM momentum_reports
    WHERE id = ?
    LIMIT 1
  `);

  const getLatestPublishedMomentumReportStmt = db.prepare(`
    SELECT
      id,
      slug,
      title,
      report_date,
      status,
      author_email,
      created_at,
      updated_at,
      published_at,
      content_json
    FROM momentum_reports
    WHERE status = 'published'
    ORDER BY report_date DESC, published_at DESC, updated_at DESC
    LIMIT 1
  `);

  const upsertMomentumReportStmt = db.prepare(`
    INSERT INTO momentum_reports (
      id,
      slug,
      title,
      report_date,
      status,
      author_email,
      created_at,
      updated_at,
      published_at,
      content_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      title = excluded.title,
      report_date = excluded.report_date,
      status = excluded.status,
      author_email = excluded.author_email,
      created_at = excluded.created_at,
      updated_at = excluded.updated_at,
      published_at = excluded.published_at,
      content_json = excluded.content_json
  `);

  const listWatchtowerReportsStmt = db.prepare(`
    SELECT id, report_date, language, title, status, author_email,
      reviewer_email, created_at, updated_at, published_at, content_json
    FROM watchtower_reports
    ORDER BY report_date DESC, updated_at DESC
  `);

  const getWatchtowerReportByIdStmt = db.prepare(`
    SELECT id, report_date, language, title, status, author_email,
      reviewer_email, created_at, updated_at, published_at, content_json
    FROM watchtower_reports
    WHERE id = ?
    LIMIT 1
  `);

  const getWatchtowerReportByDateAndLanguageStmt = db.prepare(`
    SELECT id, report_date, language, title, status, author_email,
      reviewer_email, created_at, updated_at, published_at, content_json
    FROM watchtower_reports
    WHERE report_date = ? AND language = ?
    LIMIT 1
  `);

  const getLatestPublishedWatchtowerReportStmt = db.prepare(`
    SELECT id, report_date, language, title, status, author_email,
      reviewer_email, created_at, updated_at, published_at, content_json
    FROM watchtower_reports
    WHERE status = 'published' AND language = ?
    ORDER BY report_date DESC, published_at DESC, updated_at DESC
    LIMIT 1
  `);

  const upsertWatchtowerReportStmt = db.prepare(`
    INSERT INTO watchtower_reports (
      id, report_date, language, title, status, author_email, reviewer_email,
      created_at, updated_at, published_at, content_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      report_date = excluded.report_date,
      language = excluded.language,
      title = excluded.title,
      status = excluded.status,
      author_email = excluded.author_email,
      reviewer_email = excluded.reviewer_email,
      created_at = excluded.created_at,
      updated_at = excluded.updated_at,
      published_at = excluded.published_at,
      content_json = excluded.content_json
  `);

  const listDailyReportsStmt = db.prepare(`
    SELECT
      id,
      slug,
      title,
      report_date,
      status,
      author_email,
      source_folder,
      created_at,
      updated_at,
      published_at,
      content_json
    FROM daily_reports
    ORDER BY report_date DESC, updated_at DESC
  `);

  const getDailyReportByIdStmt = db.prepare(`
    SELECT
      id,
      slug,
      title,
      report_date,
      status,
      author_email,
      source_folder,
      created_at,
      updated_at,
      published_at,
      content_json
    FROM daily_reports
    WHERE id = ?
    LIMIT 1
  `);

  const createNewsletterSubscriberStmt = db.prepare(`
    INSERT OR IGNORE INTO newsletter_subscribers (email, source, subscribed_at)
    VALUES (?, ?, ?)
  `);

  const getLatestPublishedDailyReportStmt = db.prepare(`
    SELECT
      id,
      slug,
      title,
      report_date,
      status,
      author_email,
      source_folder,
      created_at,
      updated_at,
      published_at,
      content_json
    FROM daily_reports
    WHERE status = 'published'
    ORDER BY report_date DESC, published_at DESC, updated_at DESC
    LIMIT 1
  `);

  const upsertDailyReportStmt = db.prepare(`
    INSERT INTO daily_reports (
      id,
      slug,
      title,
      report_date,
      status,
      author_email,
      source_folder,
      created_at,
      updated_at,
      published_at,
      content_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      title = excluded.title,
      report_date = excluded.report_date,
      status = excluded.status,
      author_email = excluded.author_email,
      source_folder = excluded.source_folder,
      created_at = excluded.created_at,
      updated_at = excluded.updated_at,
      published_at = excluded.published_at,
      content_json = excluded.content_json
  `);

  const listCoverageReportsStmt = db.prepare(`
    SELECT
      id,
      source_name,
      imported_at,
      raw
    FROM coverage_reports
    ORDER BY imported_at DESC, source_name ASC
  `);

  const getCoverageReportByIdStmt = db.prepare(`
    SELECT
      id,
      source_name,
      imported_at,
      raw
    FROM coverage_reports
    WHERE id = ?
    LIMIT 1
  `);

  const getCoverageReportBySourceNameStmt = db.prepare(`
    SELECT
      id,
      source_name,
      imported_at,
      raw
    FROM coverage_reports
    WHERE source_name = ?
    LIMIT 1
  `);

  const upsertCoverageReportStmt = db.prepare(`
    INSERT INTO coverage_reports (
      id,
      source_name,
      imported_at,
      raw
    ) VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      source_name = excluded.source_name,
      imported_at = excluded.imported_at,
      raw = excluded.raw
  `);

  const listFlowReportCommentsByReportIdStmt = db.prepare(`
    SELECT
      id,
      report_id,
      user_id,
      user_name,
      user_picture,
      body,
      created_at,
      updated_at
    FROM flow_report_comments
    WHERE report_id = ?
    ORDER BY created_at DESC
  `);

  const insertFlowReportCommentStmt = db.prepare(`
    INSERT INTO flow_report_comments (
      id,
      report_id,
      user_id,
      user_name,
      user_picture,
      body,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const recordFlowReportViewStmt = db.prepare(`
    INSERT INTO flow_report_engagements (
      report_id,
      actor_key,
      read_count,
      first_read_at,
      last_read_at,
      updated_at
    ) VALUES (?, ?, 1, ?, ?, ?)
    ON CONFLICT(report_id, actor_key) DO UPDATE SET
      read_count = CASE
        WHEN flow_report_engagements.read_count > 0 THEN flow_report_engagements.read_count
        ELSE 1
      END,
      first_read_at = COALESCE(flow_report_engagements.first_read_at, excluded.first_read_at),
      last_read_at = excluded.last_read_at,
      updated_at = excluded.updated_at
  `);

  const recordFlowReportLikeStmt = db.prepare(`
    INSERT INTO flow_report_engagements (
      report_id,
      actor_key,
      liked,
      liked_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(report_id, actor_key) DO UPDATE SET
      liked = excluded.liked,
      liked_at = excluded.liked_at,
      updated_at = excluded.updated_at
  `);

  const recordFlowReportShareStmt = db.prepare(`
    INSERT INTO flow_report_engagements (
      report_id,
      actor_key,
      share_count,
      first_shared_at,
      last_shared_at,
      updated_at
    ) VALUES (?, ?, 1, ?, ?, ?)
    ON CONFLICT(report_id, actor_key) DO UPDATE SET
      share_count = flow_report_engagements.share_count + 1,
      first_shared_at = COALESCE(flow_report_engagements.first_shared_at, excluded.first_shared_at),
      last_shared_at = excluded.last_shared_at,
      updated_at = excluded.updated_at
  `);

  function getEmptyFlowReportEngagement(): FlowReportEngagement {
    return {
      likeCount: 0,
      readCount: 0,
      shareCount: 0,
    };
  }

  function listFlowReportEngagementsByReportIds(reportIds: string[]) {
    const uniqueReportIds = Array.from(
      new Set(reportIds.map(item => item.trim()).filter(Boolean))
    );

    const engagementByReportId = new Map<string, FlowReportEngagement>();
    for (const reportId of uniqueReportIds) {
      engagementByReportId.set(reportId, getEmptyFlowReportEngagement());
    }

    if (!uniqueReportIds.length) {
      return engagementByReportId;
    }

    const placeholders = uniqueReportIds.map(() => "?").join(", ");
    const rows = db
      .prepare(
        `
          SELECT
            report_id,
            SUM(CASE WHEN read_count > 0 THEN 1 ELSE 0 END) AS read_count,
            SUM(CASE WHEN liked = 1 THEN 1 ELSE 0 END) AS like_count,
            SUM(share_count) AS share_count
          FROM flow_report_engagements
          WHERE report_id IN (${placeholders})
          GROUP BY report_id
        `
      )
      .all(...uniqueReportIds) as unknown as FlowReportEngagementDbRow[];

    for (const row of rows) {
      engagementByReportId.set(row.report_id, {
        likeCount: Number(row.like_count || 0),
        readCount: Number(row.read_count || 0),
        shareCount: Number(row.share_count || 0),
      });
    }

    return engagementByReportId;
  }

  function getFlowReportEngagementByReportId(reportId: string) {
    return (
      listFlowReportEngagementsByReportIds([reportId]).get(reportId) ||
      getEmptyFlowReportEngagement()
    );
  }

  return {
    dbPath,
    pruneExpiredSessions(now = Date.now()) {
      deleteExpiredSessionsStmt.run(now);
    },
    getUserById(userId: string) {
      const row = getUserByIdStmt.get(userId) as AuthUserDbRow | undefined;
      return row ? mapAuthUserRow(row) : null;
    },
    getUserByEmail(email: string) {
      const row = getUserByEmailStmt.get(email) as AuthUserDbRow | undefined;
      return row ? mapAuthUserRow(row) : null;
    },
    upsertUser(record: AuthUserRecord) {
      upsertUserStmt.run(
        record.id,
        record.email,
        record.name,
        record.picture || null,
        record.createdAt,
        record.updatedAt
      );
    },
    getSessionById(sessionId: string) {
      const row = getSessionByIdStmt.get(sessionId) as SessionDbRow | undefined;
      return row ? mapSessionRow(row) : null;
    },
    upsertSession(record: SessionStoreRecord) {
      upsertSessionStmt.run(
        record.id,
        record.userId,
        record.expiresAt,
        record.createdAt,
        record.updatedAt
      );
    },
    deleteSession(sessionId: string) {
      deleteSessionStmt.run(sessionId);
    },
    getSubscriptionByUserId(userId: string) {
      const row = getSubscriptionByUserStmt.get(userId) as
        | SubscriptionDbRow
        | undefined;
      return row ? mapSubscriptionRow(row) : null;
    },
    getSubscriptionByEmail(email: string) {
      const row = getSubscriptionByEmailStmt.get(email) as
        | SubscriptionDbRow
        | undefined;
      return row ? mapSubscriptionRow(row) : null;
    },
    getSubscriptionByLastOrderId(orderId: string) {
      const row = getSubscriptionByLastOrderStmt.get(orderId) as
        | SubscriptionDbRow
        | undefined;
      return row ? mapSubscriptionRow(row) : null;
    },
    upsertSubscription(record: SubscriptionRecord) {
      upsertSubscriptionStmt.run(
        record.email,
        record.userId || null,
        record.provider,
        record.status,
        record.plan,
        record.startedAt || null,
        record.endsAt || null,
        record.updatedAt,
        record.lastOrderId || null
      );
    },
    getOrderById(orderId: string) {
      const row = getOrderByIdStmt.get(orderId) as OrderDbRow | undefined;
      return row ? mapOrderRow(row) : null;
    },
    getOrderByToken(token: string) {
      const row = getOrderByTokenStmt.get(token) as OrderDbRow | undefined;
      return row ? mapOrderRow(row) : null;
    },
    upsertOrder(record: ShopierOrderRecord) {
      upsertOrderStmt.run(
        record.orderId,
        record.token,
        record.userId,
        record.email,
        record.name,
        record.amount,
        record.currency,
        record.status,
        record.createdAt,
        record.updatedAt
      );
    },
    updateOrderStatus(
      orderId: string,
      status: BillingOrderStatus,
      updatedAt: string
    ) {
      updateOrderStatusStmt.run(status, updatedAt, orderId);
    },
    listWeeklyReports() {
      const rows =
        listWeeklyReportsStmt.all() as unknown as WeeklyReportDbRow[];
      return rows.map(mapWeeklyReportRow);
    },
    getWeeklyReportById(reportId: string) {
      const row = getWeeklyReportByIdStmt.get(reportId) as
        | WeeklyReportDbRow
        | undefined;
      return row ? mapWeeklyReportRow(row) : null;
    },
    upsertWeeklyReport(record: WeeklyReportRecord) {
      upsertWeeklyReportStmt.run(
        record.id,
        record.slug,
        record.title,
        record.weekStart,
        record.weekEnd,
        record.analysisDate,
        record.status,
        record.authorEmail,
        record.createdAt,
        record.updatedAt,
        record.publishedAt || null,
        JSON.stringify(record.content)
      );
    },
    listOpportunities() {
      const rows = listOpportunitiesStmt.all() as unknown as OpportunityDbRow[];
      return rows.map(mapOpportunityRow);
    },
    upsertOpportunity(record: OpportunityRecord) {
      upsertOpportunityStmt.run(
        record.id,
        record.sourceReportId || null,
        record.sourceReportTitle || null,
        record.ticker,
        record.name,
        record.sector,
        record.earningsDate,
        record.earningsTime,
        record.daysToEarnings,
        record.opportunityWindow,
        record.momentumScore,
        record.priceChange6M,
        record.rsi14,
        record.currentIV,
        record.historicalIV,
        record.impliedMovePercent,
        record.expectedIVCrush,
        record.ivCrushScore,
        record.beatRate,
        record.maxLossPercent,
        record.targetProfitPercent,
        record.earningsMissRisk,
        record.gapRisk,
        record.compositeScore,
        record.confidenceLevel,
        record.directionalBias,
        record.strategyType,
        record.strategyRating,
        record.recommendedStrategy,
        record.aiSummary,
        record.aiStrategyRationale,
        JSON.stringify(record.aiKeyCatalysts),
        record.aiExecutionNotes,
        JSON.stringify(record.riskWarnings),
        JSON.stringify(record.dataSources),
        record.tierRequired,
        record.status,
        record.createdAt,
        record.updatedAt,
        record.expiresAt
      );
    },
    listWatchlistByUserId(userId: string) {
      const rows = listWatchlistByUserIdStmt.all(
        userId
      ) as unknown as WatchlistDbRow[];
      return rows.map(mapWatchlistRow);
    },
    upsertWatchlist(record: WatchlistRecord) {
      upsertWatchlistStmt.run(
        record.id,
        record.userId,
        record.email,
        record.ticker,
        record.notes || null,
        JSON.stringify(record.tags || []),
        record.alertOnOpportunity ? 1 : 0,
        record.alertRules?.signalChange !== false ? 1 : 0,
        record.alertRules?.convictionAbove ?? null,
        record.alertRules?.priceAbove ?? null,
        record.alertRules?.priceBelow ?? null,
        record.alertRules?.earningsWithinDays ?? null,
        record.addedAt,
        record.updatedAt
      );
    },
    deleteWatchlist(userId: string, ticker: string) {
      deleteWatchlistStmt.run(userId, ticker);
    },
    listWatchlistCollectionsByUserId(userId: string) {
      const rows = listWatchlistCollectionsStmt.all(
        userId
      ) as unknown as WatchlistCollectionDbRow[];
      return rows.map(mapWatchlistCollectionRow);
    },
    getWatchlistCollectionById(userId: string, listId: string) {
      const row = getWatchlistCollectionStmt.get(
        listId,
        userId
      ) as unknown as WatchlistCollectionDbRow | undefined;
      return row ? mapWatchlistCollectionRow(row) : null;
    },
    insertWatchlistCollection(record: WatchlistCollectionRecord) {
      insertWatchlistCollectionStmt.run(
        record.id,
        record.userId,
        record.name,
        record.color,
        record.createdAt,
        record.updatedAt
      );
    },
    updateWatchlistCollection(record: WatchlistCollectionRecord) {
      updateWatchlistCollectionStmt.run(
        record.name,
        record.color,
        record.updatedAt,
        record.id,
        record.userId
      );
    },
    deleteWatchlistCollection(userId: string, listId: string) {
      deleteWatchlistCollectionStmt.run(listId, userId);
    },
    listWatchlistItems(userId: string, listId: string) {
      const rows = listWatchlistItemsStmt.all(
        listId,
        userId
      ) as unknown as WatchlistItemDbRow[];
      return rows.map(mapWatchlistItemRow);
    },
    upsertWatchlistItem(record: WatchlistItemRecord) {
      upsertWatchlistItemStmt.run(
        record.id,
        record.listId,
        record.userId,
        record.email,
        record.ticker,
        record.notes || null,
        JSON.stringify(record.tags),
        record.alertRules.opportunity ? 1 : 0,
        record.alertRules.signalChange ? 1 : 0,
        record.alertRules.convictionAbove ?? null,
        record.alertRules.priceAbove ?? null,
        record.alertRules.priceBelow ?? null,
        record.alertRules.earningsWithinDays ?? null,
        record.addedAt,
        record.updatedAt
      );
    },
    deleteWatchlistItem(userId: string, listId: string, ticker: string) {
      deleteWatchlistItemStmt.run(listId, userId, ticker);
    },
    listAllWatchlists() {
      const rows = listAllWatchlistsStmt.all() as unknown as WatchlistDbRow[];
      return rows.map(mapWatchlistRow);
    },
    listAllWatchlistItems() {
      const rows =
        listAllWatchlistItemsStmt.all() as unknown as WatchlistItemDbRow[];
      return rows.map(mapWatchlistItemRow);
    },
    getWatchlistAlertState(
      itemId: string,
      ruleKind: WatchlistNotificationKind
    ) {
      const row = getWatchlistAlertStateStmt.get(
        itemId,
        ruleKind
      ) as unknown as WatchlistAlertStateDbRow | undefined;
      return row ? mapWatchlistAlertStateRow(row) : null;
    },
    upsertWatchlistAlertState(record: WatchlistAlertStateRecord) {
      upsertWatchlistAlertStateStmt.run(
        record.itemId,
        record.ruleKind,
        record.lastCondition ? 1 : 0,
        record.lastValue || null,
        record.lastSnapshotAt,
        record.updatedAt
      );
    },
    insertWatchlistNotification(record: WatchlistNotificationRecord) {
      insertWatchlistNotificationStmt.run(
        record.id,
        record.userId,
        record.email,
        record.listId,
        record.ticker,
        record.kind,
        record.title,
        record.body,
        record.fingerprint,
        JSON.stringify(record.metadata),
        record.createdAt,
        record.readAt || null
      );
      const changes = db.prepare("SELECT changes() AS count").get() as unknown as {
        count: number;
      };
      return Number(changes.count || 0) > 0;
    },
    getWatchlistNotification(notificationId: string) {
      const row = getWatchlistNotificationStmt.get(
        notificationId
      ) as unknown as WatchlistNotificationDbRow | undefined;
      return row ? mapWatchlistNotificationRow(row) : null;
    },
    listWatchlistNotifications(userId: string, limit = 30) {
      const rows = listWatchlistNotificationsStmt.all(
        userId,
        Math.min(100, Math.max(1, Math.floor(limit)))
      ) as unknown as WatchlistNotificationDbRow[];
      return rows.map(mapWatchlistNotificationRow);
    },
    countUnreadWatchlistNotifications(userId: string) {
      const row = countUnreadWatchlistNotificationsStmt.get(
        userId
      ) as unknown as { count: number } | undefined;
      return Number(row?.count || 0);
    },
    markWatchlistNotificationRead(
      userId: string,
      notificationId: string,
      readAt: string
    ) {
      markWatchlistNotificationReadStmt.run(readAt, notificationId, userId);
    },
    markAllWatchlistNotificationsRead(userId: string, readAt: string) {
      markAllWatchlistNotificationsReadStmt.run(readAt, userId);
    },
    insertWatchlistDelivery(record: WatchlistDeliveryRecord) {
      insertWatchlistDeliveryStmt.run(
        record.id,
        record.notificationId,
        record.userId,
        record.email,
        record.channel,
        record.status,
        record.attempts,
        record.nextAttemptAt,
        record.createdAt,
        record.updatedAt,
        record.sentAt || null,
        record.lastError || null
      );
    },
    listPendingWatchlistDeliveries(nowIso: string, limit = 50) {
      const rows = listPendingWatchlistDeliveriesStmt.all(
        nowIso,
        Math.min(100, Math.max(1, Math.floor(limit)))
      ) as unknown as WatchlistDeliveryDbRow[];
      return rows.map(mapWatchlistDeliveryRow);
    },
    updateWatchlistDelivery(record: WatchlistDeliveryRecord) {
      updateWatchlistDeliveryStmt.run(
        record.status,
        record.attempts,
        record.nextAttemptAt,
        record.updatedAt,
        record.sentAt || null,
        record.lastError || null,
        record.id
      );
    },
    listSavedPortfolioScenarios(userId: string) {
      const rows = listSavedPortfolioScenariosStmt.all(
        userId
      ) as unknown as SavedPortfolioScenarioDbRow[];
      return rows.map(mapSavedPortfolioScenarioRow);
    },
    upsertSavedPortfolioScenario(record: SavedPortfolioScenarioRecord) {
      upsertSavedPortfolioScenarioStmt.run(
        record.id,
        record.userId,
        record.name,
        record.listId,
        record.weighting,
        record.transactionCostBps,
        JSON.stringify(record.tickers),
        record.createdAt,
        record.updatedAt
      );
    },
    deleteSavedPortfolioScenario(userId: string, scenarioId: string) {
      deleteSavedPortfolioScenarioStmt.run(scenarioId, userId);
    },
    listAgentRuns() {
      const rows = listAgentRunsStmt.all() as unknown as AgentRunDbRow[];
      return rows.map(mapAgentRunRow);
    },
    upsertAgentRun(record: AgentRunRecord) {
      upsertAgentRunStmt.run(
        record.id,
        record.runType,
        record.status,
        record.tickersScanned,
        record.opportunitiesFound,
        JSON.stringify(record.errors),
        record.log,
        record.retryCount,
        record.startedAt,
        record.completedAt || null
      );
    },
    listMomentumReports() {
      const rows =
        listMomentumReportsStmt.all() as unknown as MomentumReportDbRow[];
      return rows.map(mapMomentumReportRow);
    },
    getMomentumReportById(reportId: string) {
      const row = getMomentumReportByIdStmt.get(reportId) as
        | MomentumReportDbRow
        | undefined;
      return row ? mapMomentumReportRow(row) : null;
    },
    getLatestPublishedMomentumReport() {
      const row = getLatestPublishedMomentumReportStmt.get() as
        | MomentumReportDbRow
        | undefined;
      return row ? mapMomentumReportRow(row) : null;
    },
    upsertMomentumReport(record: MomentumReportRecord) {
      upsertMomentumReportStmt.run(
        record.id,
        record.slug,
        record.title,
        record.reportDate,
        record.status,
        record.authorEmail,
        record.createdAt,
        record.updatedAt,
        record.publishedAt || null,
        JSON.stringify(record.content)
      );
    },
    listWatchtowerReports() {
      const rows =
        listWatchtowerReportsStmt.all() as unknown as WatchtowerReportDbRow[];
      return rows.map(mapWatchtowerReportRow);
    },
    getWatchtowerReportById(reportId: string) {
      const row = getWatchtowerReportByIdStmt.get(reportId) as
        | WatchtowerReportDbRow
        | undefined;
      return row ? mapWatchtowerReportRow(row) : null;
    },
    getWatchtowerReportByDateAndLanguage(
      reportDate: string,
      language: WatchtowerLanguage
    ) {
      const row = getWatchtowerReportByDateAndLanguageStmt.get(
        reportDate,
        language
      ) as WatchtowerReportDbRow | undefined;
      return row ? mapWatchtowerReportRow(row) : null;
    },
    getLatestPublishedWatchtowerReport(language: WatchtowerLanguage) {
      const row = getLatestPublishedWatchtowerReportStmt.get(language) as
        | WatchtowerReportDbRow
        | undefined;
      return row ? mapWatchtowerReportRow(row) : null;
    },
    upsertWatchtowerReport(record: WatchtowerReportRecord) {
      upsertWatchtowerReportStmt.run(
        record.id,
        record.reportDate,
        record.language,
        record.title,
        record.status,
        record.authorEmail,
        record.reviewerEmail || null,
        record.createdAt,
        record.updatedAt,
        record.publishedAt || null,
        JSON.stringify(record.content)
      );
    },
    listDailyReports() {
      const rows = listDailyReportsStmt.all() as unknown as DailyReportDbRow[];
      return rows.map(mapDailyReportRow);
    },
    getDailyReportById(reportId: string) {
      const row = getDailyReportByIdStmt.get(reportId) as
        | DailyReportDbRow
        | undefined;
      return row ? mapDailyReportRow(row) : null;
    },
    getLatestPublishedDailyReport() {
      const row = getLatestPublishedDailyReportStmt.get() as
        | DailyReportDbRow
        | undefined;
      return row ? mapDailyReportRow(row) : null;
    },
    upsertDailyReport(record: DailyReportRecord) {
      upsertDailyReportStmt.run(
        record.id,
        record.slug,
        record.title,
        record.reportDate,
        record.status,
        record.authorEmail,
        record.sourceFolder,
        record.createdAt,
        record.updatedAt,
        record.publishedAt || null,
        JSON.stringify(record.content)
      );
    },
    listCoverageReports() {
      const rows =
        listCoverageReportsStmt.all() as unknown as CoverageReportDbRow[];
      return rows.map(mapCoverageReportRow);
    },
    getCoverageReportById(reportId: string) {
      const row = getCoverageReportByIdStmt.get(reportId) as
        | CoverageReportDbRow
        | undefined;
      return row ? mapCoverageReportRow(row) : null;
    },
    getCoverageReportBySourceName(sourceName: string) {
      const row = getCoverageReportBySourceNameStmt.get(sourceName) as
        | CoverageReportDbRow
        | undefined;
      return row ? mapCoverageReportRow(row) : null;
    },
    upsertCoverageReport(record: {
      id: string;
      importedAt: string;
      raw: string;
      sourceName: string;
    }) {
      upsertCoverageReportStmt.run(
        record.id,
        record.sourceName,
        record.importedAt,
        record.raw
      );
    },
    listFlowReportCommentsByReportId(reportId: string) {
      const rows = listFlowReportCommentsByReportIdStmt.all(
        reportId
      ) as unknown as FlowReportCommentDbRow[];
      return rows.map(mapFlowReportCommentRow);
    },
    createFlowReportComment(record: FlowReportComment) {
      insertFlowReportCommentStmt.run(
        record.id,
        record.reportId,
        record.userId,
        record.userName,
        record.userPicture || null,
        record.body,
        record.createdAt,
        record.updatedAt
      );
    },
    listFlowReportEngagementsByReportIds(reportIds: string[]) {
      return listFlowReportEngagementsByReportIds(reportIds);
    },
    recordFlowReportView(reportId: string, actorKey: string) {
      const nowIso = new Date().toISOString();
      recordFlowReportViewStmt.run(reportId, actorKey, nowIso, nowIso, nowIso);
      return getFlowReportEngagementByReportId(reportId);
    },
    recordFlowReportLike(
      reportId: string,
      actorKey: string,
      liked: boolean
    ) {
      const nowIso = new Date().toISOString();
      recordFlowReportLikeStmt.run(
        reportId,
        actorKey,
        liked ? 1 : 0,
        liked ? nowIso : null,
        nowIso
      );
      return getFlowReportEngagementByReportId(reportId);
    },
    recordFlowReportShare(reportId: string, actorKey: string) {
      const nowIso = new Date().toISOString();
      recordFlowReportShareStmt.run(reportId, actorKey, nowIso, nowIso, nowIso);
      return getFlowReportEngagementByReportId(reportId);
    },
    createNewsletterSubscriber(email: string, source = "homepage") {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail || !normalizedEmail.includes("@")) {
        return false;
      }
      createNewsletterSubscriberStmt.run(
        normalizedEmail,
        source,
        new Date().toISOString()
      );
      return true;
    },
  };
}

export type BillingStore = ReturnType<typeof createBillingStore>;
