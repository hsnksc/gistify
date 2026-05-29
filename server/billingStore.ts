import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export type SubscriptionProvider = "shopier";

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

export function createBillingStore() {
  const dbPath = getDatabasePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const db = new DatabaseSync(dbPath);
  db.exec(`
    PRAGMA journal_mode = WAL;

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
  `);

  const subscriptionTableInfo = db.prepare("PRAGMA table_info(billing_subscriptions)").all() as
    unknown as TableInfoRow[] | undefined;
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

  return {
    dbPath,
    getSubscriptionByUserId(userId: string) {
      const row = getSubscriptionByUserStmt.get(userId) as SubscriptionDbRow | undefined;
      return row ? mapSubscriptionRow(row) : null;
    },
    getSubscriptionByEmail(email: string) {
      const row = getSubscriptionByEmailStmt.get(email) as SubscriptionDbRow | undefined;
      return row ? mapSubscriptionRow(row) : null;
    },
    getSubscriptionByLastOrderId(orderId: string) {
      const row = getSubscriptionByLastOrderStmt.get(orderId) as SubscriptionDbRow | undefined;
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
    updateOrderStatus(orderId: string, status: BillingOrderStatus, updatedAt: string) {
      updateOrderStatusStmt.run(status, updatedAt, orderId);
    },
  };
}
