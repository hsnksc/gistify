# Gistify Gelişmiş Teknik Raporu — Part 2

> **Rol:** Teknik Yazar & Güvenlik Analisti  
> **Tarih:** 2026-06-13  
> **Kapsam:** Bölüm 7–12 (Paywall & Monetizasyon, Güvenlik & Compliance, Performans & Ölçeklendirme, Test & Kalite Güvencesi, Strateji & Roadmap, Ekler)  
> **Yazım Dili:** Türkçe (teknik terimler İngilizce)  
> **Araştırma Kaynakları:** `gistify_security_auth_research.md`, `gistify_social_edge_research.md`, `Gistify_UIUX_Grafik_Analiz_Raporu.md` (Bölüm 16–20)

---

## Bölüm 7: Gelişmiş Paywall & Monetizasyon

### 7.1 SaaS Billing Platform Karşılaştırması: Paddle vs Stripe vs LemonSqueezy

Gistify'nin finansal rapor ve momentum içerikleri, farklı erişim seviyelerine sahip olacağından, billing altyapısının seçimi doğrudan revenue recognition, tax compliance ve operational overhead'i etkiler. Üç ana aday değerlendirilmiştir: Stripe, Paddle ve Lemon Squeezy. [^b1][^b2][^b3][^b4]

| Kriter | Stripe | Paddle | Lemon Squeezy |
|--------|--------|--------|---------------|
| **Transaction Fee** | 2.9% + $0.30 [^b1] | 5% + $0.50 [^b3] | 5% + $0.50 [^b4] |
| **Merchant of Record (MoR)** | Hayır (kendi tax compliance) | Evet (global VAT/GST) [^b3] | Evet (Stripe-owned, MoR) [^b2] |
| **Subscription Management** | Çok esnek (Stripe Billing) | Advanced (dunning, proration) [^b3] | Temel (hosted checkout) [^b2] |
| **Usage-Based Billing** | Native (Stripe Meter Events) | Sınırlı | Yok |
| **Invoice & B2B Features** | Çok güçlü (Stripe Invoicing) | Multi-seat, custom contracts [^b3] | Dijital ürün odaklı [^b2] |
| **Developer Experience** | API-first, en esnek [^b1] | SDK + Webhook | Sıfır kod (hosted) |
| **Adoption (Indie Hackers)** | Dominant | 0.8% (6/708 site) [^b5] | 0.6% (4/708 site) [^b5] |
| **Best For** | Scale, flexibility, lower fees | B2B SaaS, tax offload | Indie builders, hızlı launch |

**Gistify Kararı:** Faz 1'de **Stripe** tercih edilmelidir. Transaction fee %50 daha düşüktür ve usage-based billing (API call sayısı, content view limiti) Stripe Meter Events ile native desteklenir. Paddle, B2B enterprise müşteriler (custom contract, multi-seat) geldiğinde değerlendirilir. [^b1][^b3]

```typescript
// Stripe Billing — Subscription tier creation (server-side)
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' });

export async function createGistifyProducts() {
  const freePlan = await stripe.products.create({
    name: 'Gistify Free',
    description: '5 rapor/ay, temel momentum taraması',
    metadata: { tier: 'free', reportsPerMonth: '5', apiCalls: '100' }
  });

  const proPlan = await stripe.products.create({
    name: 'Gistify Pro',
    description: 'Sınırsız rapor, gelişmiş filtreler, API erişimi',
    metadata: { tier: 'pro', reportsPerMonth: 'unlimited', apiCalls: '10000' }
  });

  const enterprisePlan = await stripe.products.create({
    name: 'Gistify Enterprise',
    description: 'Custom SLA, SSO, dedicated support, white-label API',
    metadata: { tier: 'enterprise', custom: 'true' }
  });

  // Fiyatlandırma (TRY cinsinden)
  const proPrice = await stripe.prices.create({
    product: proPlan.id,
    unit_amount: 14900, // 149 TRY
    currency: 'try',
    recurring: { interval: 'month' },
  });

  return { freePlan, proPlan, enterprisePlan, proPrice };
}
```

### 7.2 Paywall Pattern'leri: Freemium, Metered, Hard, Dynamic

Gistify içerisinde dört temel paywall modeli bir arada kullanılacaktır: freemium (ücretsiz temel içerik), metered (sınırlı sayıda ücretsiz görüntüleme), hard (tamamen kilitli premium içerik) ve dynamic (AI-driven, kullanıcı davranışına göre değişen) [^p1].

**Freemium Model:** Tüm kullanıcılar landing page, günlük özet ve temel momentum taramasına erişebilir. Bu, "top of funnel" dönüşümü için kritiktir. Ücretsiz kullanıcılar, içerik kalitesini deneyimler ancak derinlemesine analiz ve geçmiş veriler kilitlidir.

**Metered Model:** Kullanıcı başına aylık 5 adet "premium rapor preview" hakkı tanınır. Bu, New York Times ve Financial Times'ın kullandığı "soft paywall" yaklaşımıdır. Metered limit, Redis counter ile takip edilir: [^p1]

```typescript
// Metered billing counter (Redis / Upstash)
import { Redis } from '@upstash/redis';
const redis = new Redis({ url: process.env.UPSTASH_REDIS_URL!, token: process.env.UPSTASH_REDIS_TOKEN! });

const METERED_LIMIT = 5;
const METERED_WINDOW = 30 * 24 * 60 * 60; // 30 gün (saniye)

export async function checkMeteredAccess(userId: string, contentSlug: string): Promise<{ allowed: boolean; remaining: number }> {
  const key = `meter:${userId}:${new Date().toISOString().slice(0, 7)}`; // YYYY-MM
  const current = await redis.incr(key);
  if (current === 1) await redis.expire(key, METERED_WINDOW);

  const remaining = Math.max(0, METERED_LIMIT - current);
  return { allowed: current <= METERED_LIMIT, remaining };
}
```

**Hard Paywall:** "Earnings Radar", "Dark Pool Flow" gibi yüksek değerli, nadir içerikler tamamen kilitlidir. Sadece Pro/Enterprise kullanıcılar erişebilir. API'de `access_level: 'premium'` olarak işaretlenir. [^p1]

**Dynamic Paywall (AI-Driven):** Financial Times, AI-driven dynamic paywall ile conversion'da %290 artış elde etmiştir [^p2]. The Globe and Mail ise %51 subscription artışı raporlamıştır [^p2]. Gistify'de dynamic paywall, kullanıcının engagement seviyesine (volatile, occasional, regular, fan) göre farklı davranır [^p3].

```typescript
// Dynamic paywall engine (simplified)
type UserSegment = 'volatile' | 'occasional' | 'regular' | 'fan';

interface PaywallDecision {
  showPaywall: boolean;
  ctaType: 'none' | 'registration' | 'soft_upgrade' | 'hard_upgrade';
  previewWordCount: number;
  discount?: number; // % indirim
}

function decidePaywall(segment: UserSegment, contentLevel: 'free' | 'member' | 'premium', userPlan: string): PaywallDecision {
  if (userPlan === 'premium') return { showPaywall: false, ctaType: 'none', previewWordCount: Infinity };

  const decisions: Record<UserSegment, PaywallDecision> = {
    volatile:     { showPaywall: false, ctaType: 'registration', previewWordCount: 150 }, // Soft CTA, register wall [^p4]
    occasional:   { showPaywall: true,  ctaType: 'soft_upgrade',  previewWordCount: 300, discount: 10 },
    regular:      { showPaywall: true,  ctaType: 'hard_upgrade',  previewWordCount: 200, discount: 20 },
    fan:          { showPaywall: true,  ctaType: 'hard_upgrade',  previewWordCount: 100, discount: 30 }, // En engaged, en agresif CTA
  };

  return decisions[segment];
}
```

### 7.3 Subscription Tiers: Free / Pro / Enterprise

Gistify üç temel tier üzerinden monetize edilir. Her tier, API rate limit, content access depth ve feature set ile ayrılır.

| Tier | Fiyat | Rapor Erişimi | API Rate Limit | Özellikler |
|------|-------|--------------|----------------|------------|
| **Free** | Ücretsiz | 5 rapor/ay (metered) | 100 req/ay | Temel tablolar, 30s gecikmeli data |
| **Pro** | ₺149/ay | Sınırsız | 10.000 req/ay | Gelişmiş filtreler, real-time data, export (CSV/PDF) |
| **Enterprise** | Custom | Sınırsız + API key | 100.000 req/ay | SSO, audit log, white-label, dedicated support, custom SLA |

```sql
-- Subscription tiers veritabanı şeması
CREATE TABLE subscriptions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  stripe_subscription_id TEXT,
  tier TEXT NOT NULL DEFAULT 'free' CHECK(tier IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start DATETIME,
  current_period_end DATETIME,
  canceled_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE usage_logs (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  resource_type TEXT NOT NULL CHECK(resource_type IN ('report_view', 'api_call', 'export')),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Metered usage sorgusu (aylık)
CREATE INDEX idx_usage_logs_user_month ON usage_logs(user_id, resource_type, created_at);
```

```typescript
// Tier-based API rate limiter middleware
import { RateLimiterRedis } from 'rate-limiter-flexible';

const tierLimits: Record<string, { points: number; duration: number }> = {
  free:       { points: 100,  duration: 30 * 24 * 60 * 60 }, // 100 req/ay
  pro:        { points: 10000, duration: 30 * 24 * 60 * 60 }, // 10K req/ay
  enterprise: { points: 100000, duration: 30 * 24 * 60 * 60 }, // 100K req/ay
};

export const apiRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const tier = req.user?.tier || 'free';
  const limit = tierLimits[tier];

  const limiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'api_rate',
    points: limit.points,
    duration: limit.duration,
  });

  try {
    await limiter.consume(userId, 1);
    next();
  } catch (rejRes) {
    res.status(429).json({
      error: 'API limit exceeded',
      tier,
      limit: limit.points,
      resetAt: new Date(Date.now() + limit.duration * 1000).toISOString(),
      upgradeUrl: '/plans'
    });
  }
};
```

### 7.4 Revenue Recognition & Dunning Management

Stripe Billing, subscription lifecycle'ını tamamen yönetir. Revenue recognition için Stripe Revenue Recognition entegrasyonu kullanılabilir. Dunning (başarısız ödeme retry) yönetimi, Stripe'in smart retry logic'i ile otomatikleştirilir.

```typescript
// Stripe webhook handler — dunning & lifecycle events
import { Stripe } from 'stripe';

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature']!;
  const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

  switch (event.type) {
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      // 1. Grace period başlat (7 gün erişim devam)
      await startGracePeriod(customerId, 7);

      // 2. Kullanıcıya email bildirim
      await notifyUser(customerId, 'payment_failed', {
        retryUrl: `${process.env.APP_URL}/billing/retry?invoice=${invoice.id}`,
      });
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      await clearGracePeriod(invoice.customer as string);
      await updateSubscriptionStatus(invoice.subscription as string, 'active');
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      // Downgrade to free tier at period end
      await downgradeToFree(sub.customer as string, sub.current_period_end);
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      await syncTierFromStripe(sub.customer as string, sub.items.data[0].price.product as string);
      break;
    }
  }

  res.json({ received: true });
}
```

```typescript
// Grace period helper
async function startGracePeriod(customerId: string, days: number) {
  const user = await db.get('SELECT id FROM users WHERE stripe_customer_id = ?', [customerId]);
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await db.run(
    `UPDATE subscriptions SET status = 'past_due', grace_period_until = ? WHERE user_id = ?`,
    [expiresAt.toISOString(), user.id]
  );
}
```

### 7.5 Metered Billing: API Call-Based & Content-Based

Stripe Meter Events, usage-based billing için en esnek yoldur. Gistify'de iki metered dimension vardır: `report_view` (içerik bazlı) ve `api_call` (API bazlı).

```typescript
// Stripe Meter Event recording
export async function recordMeteredUsage(userId: string, eventName: 'report_view' | 'api_call', quantity: number = 1) {
  const user = await db.get('SELECT stripe_customer_id, tier FROM users WHERE id = ?', [userId]);
  if (user.tier === 'enterprise') return; // Enterprise unlimited

  // 1. Stripe Meter Event (async, best-effort)
  await stripe.billing.meterEvents.create({
    event_name: eventName,
    payload: {
      value: quantity.toString(),
      stripe_customer_id: user.stripe_customer_id,
    },
  }).catch(() => { /* fail silently, local DB is source of truth */ });

  // 2. Local usage log (source of truth)
  await db.run(
    'INSERT INTO usage_logs (user_id, resource_type, quantity) VALUES (?, ?, ?)',
    [userId, eventName, quantity]
  );
}
```

```typescript
// Usage summary endpoint (dashboard için)
app.get('/api/billing/usage', authenticate, async (req, res) => {
  const userId = req.user.id;
  const tier = req.user.tier;
  const periodStart = new Date();
  periodStart.setDate(1); // Ay başı
  periodStart.setHours(0, 0, 0, 0);

  const usage = await db.all(
    `SELECT resource_type, SUM(quantity) as total
     FROM usage_logs
     WHERE user_id = ? AND created_at >= ?
     GROUP BY resource_type`,
    [userId, periodStart.toISOString()]
  );

  const limits = { free: { report_view: 5, api_call: 100 }, pro: { report_view: Infinity, api_call: 10000 } };

  res.json({
    period: periodStart.toISOString().slice(0, 7),
    tier,
    usage: Object.fromEntries(usage.map(u => [u.resource_type, u.total])),
    limits: limits[tier as keyof typeof limits] || limits.free,
  });
});
```

---

## Bölüm 8: Gelişmiş Güvenlik & Compliance

### 8.1 Zero Trust Architecture

Zero Trust, "asla güvenme, her zaman doğrula" prensibi üzerine kuruludur. NIST SP 800-207, Zero Trust'i lateral movement'ı önlemeye yönelik bir strateji olarak tanımlar [^z1]. Gistify, B2B finansal SaaS olduğundan, Zero Trust implementation'ı 4 fazda ilerler: [^z3]

**Phase 1: MFA + SSO Foundation.** Clerk veya Auth0 ile multi-factor authentication zorunlu hale getirilir. SSO (SAML/OIDC) Enterprise tier için aktif edilir. [^z3]

**Phase 2: PAM + UEBA.** Privileged Access Management (admin panel erişimi) ve User & Entity Behavior Analytics (anomali tespiti) implemente edilir. [^z3]

**Phase 3: Micro-segmentation + Continuous Verification.** API gateway seviyesinde micro-segmentation; her endpoint kendi yetki ve rate limit segment'inde çalışır. Continuous verification: her 15 dakikada token re-validation. [^z2][^z3]

**Phase 4: mTLS + Workload Identity.** Service-to-service iletişimde mutual TLS (Istio/Calico modeli) kullanılır. SPIFFE/SPIRE standardıyla workload identity atanır. [^z4]

Microsegmentation, IAP (Identity-Aware Proxy) ve CARA (Continuous Adaptive Risk Assessment) birlikte kullanıldığında, simüle edilmiş saldırılarda Mean Time To Contain (MTTC) 11.3 dakikadan 48 saniyeye düşmüştür (%91 iyileşme) [^z2].

```typescript
// Zero Trust — Continuous verification middleware
export async function continuousVerification(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

    // 1. Token expiry check (5-15 min) [^api2]
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }

    // 2. Device fingerprint validation [^s4]
    const fingerprint = hashDevice(req.headers['user-agent'], req.ip);
    if (decoded.dfp && decoded.dfp !== fingerprint) {
      await revokeTokenFamily(decoded.sub as string, decoded.sid as string);
      return res.status(401).json({ error: 'Device mismatch', code: 'DEVICE_MISMATCH' });
    }

    // 3. Risk assessment (basit)
    const riskScore = await assessRisk(decoded.sub as string, req.ip, req.headers['user-agent']);
    if (riskScore > 0.8) {
      return res.status(403).json({ error: 'High risk session', code: 'HIGH_RISK', requiresMfa: true });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function hashDevice(userAgent?: string, ip?: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(`${userAgent}:${ip?.split('.').slice(0,3).join('.')}`).digest('hex');
}
```

### 8.2 API Security: OAuth 2.1 + PKCE, Rate Limiting, API Versioning

OAuth 2.1, PKCE'yi tüm client'lar için zorunlu kılar, Implicit Grant ve Password Grant'ı kaldırır, refresh token rotation'ı public client'lar için zorunlu tutar [^api1]. Gistify'nin tüm client'ları (web, mobil, third-party) PKCE kullanmalıdır.

```typescript
// OAuth 2.1 + PKCE — Authorization flow (Clerk/Auth0 compatible)
interface PKCEChallenge {
  codeVerifier: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256';
}

export function generatePKCE(): PKCEChallenge {
  const crypto = require('crypto');
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  return { codeVerifier: verifier, codeChallenge: challenge, codeChallengeMethod: 'S256' };
}

// Client-side PKCE initiation
function initiateOAuth() {
  const pkce = generatePKCE();
  sessionStorage.setItem('pkce_verifier', pkce.codeVerifier);

  const params = new URLSearchParams({
    client_id: process.env.OAUTH_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: `${window.location.origin}/auth/callback`,
    scope: 'openid profile email gistify:read gistify:write',
    code_challenge: pkce.codeChallenge,
    code_challenge_method: 'S256',
    state: crypto.randomUUID(),
  });

  window.location.href = `https://auth.gistify.pro/oauth/authorize?${params}`;
}
```

**Tiered Rate Limiting:** Endpoint hassasiyetine göre rate limit'ler değişir [^api3]. Redis üzerinden distributed enforcement yapılır.

```typescript
// Tiered rate limiter configuration
import { RateLimiterRedis } from 'rate-limiter-flexible';

const limiters = {
  login: new RateLimiterRedis({ storeClient: redis, keyPrefix: 'rl_login', points: 5, duration: 15 * 60 }), // 5/15min [^api3]
  passwordReset: new RateLimiterRedis({ storeClient: redis, keyPrefix: 'rl_pwd', points: 3, duration: 60 * 60 }), // 3/hour
  publicRead: new RateLimiterRedis({ storeClient: redis, keyPrefix: 'rl_read', points: 100, duration: 60 }), // 100/min
  write: new RateLimiterRedis({ storeClient: redis, keyPrefix: 'rl_write', points: 30, duration: 60 }), // 30/min
  apiKey: new RateLimiterRedis({ storeClient: redis, keyPrefix: 'rl_api', points: 1000, duration: 60 }), // 1000/min (Enterprise)
};

export function rateLimitByRoute(route: string) {
  if (route.includes('/auth/login')) return limiters.login;
  if (route.includes('/auth/reset')) return limiters.passwordReset;
  if (route.startsWith('/api/content')) return limiters.publicRead;
  if (route.startsWith('/api/comments')) return limiters.write;
  if (route.startsWith('/api/v1')) return limiters.apiKey;
  return limiters.publicRead;
}
```

**API Versioning:** URL path versioning (`/api/v1/...`) kullanılır. Breaking change'ler yeni versiyonda; eski versiyon 6 ay desteklenir (deprecation header ile).

```typescript
// API versioning middleware
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

// Deprecated API response header
v1Router.use((req, res, next) => {
  res.setHeader('Deprecation', 'true');
  res.setHeader('Sunset', new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toUTCString());
  next();
});
```

### 8.3 Content Security: CSP Headers, rehype-sanitize, XSS Prevention

Markdown içeriklerinin render edilmesi, XSS attack surface'ini oluşturur. `rehype-sanitize` ile HTML whitelist yaklaşımı kullanılır. CSP (Content Security Policy) header'ları, inline script injection'ları engeller. [^api5]

```typescript
// Unified + rehype-sanitize pipeline
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

const gistifySchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'div', 'span', 'iframe' // ihtiyaç halinde
  ],
  attributes: {
    ...defaultSchema.attributes,
    '*': ['className', 'style', 'data*'],
    iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
    img: ['src', 'alt', 'width', 'height', 'loading', 'srcset'],
    a: ['href', 'title', 'target', 'rel'],
  },
  protocols: {
    ...defaultSchema.protocols,
    src: ['https', 'http', 'data'],
    href: ['https', 'http', 'mailto'],
  }
};

export const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSanitize, gistifySchema)
  .use(rehypeStringify);
```

```typescript
// Express CSP + Security Headers (Helmet)
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // React inline scripts (strict CSP'de nonce kullanılmalı)
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "https://cdn.gistify.pro", "https://images.unsplash.com", "data:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.gistify.pro", "https://*.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      frameAncestors: ["'none'"], // Clickjacking prevention
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  crossOriginEmbedderPolicy: false, // Stripe iframe uyumluluğu
}));
```

### 8.4 Data Security: Encryption at Rest + In Transit, Field-Level Encryption

**In Transit:** Tüm trafik TLS 1.3 ile şifrelenir. Cloudflare CDN edge'de TLS termination; origin'a kadar mTLS.

**At Rest:** SQLite veritabanı dosyası, LUKS veya platform-level encryption (AWS EBS encryption, Vercel'de değil — bu yüzden migration roadmap'te PostgreSQL'e geçişte RDS encryption).

**Field-Level Encryption:** PII (Personally Identifiable Information) alanları — email, phone, TCKN — AES-256-GCM ile field-level encryption yapılır. Key management AWS KMS veya HashiCorp Vault.

```typescript
// Field-level encryption helper
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = scryptSync(process.env.FIELD_ENCRYPTION_KEY!, 'gistify-salt', 32);

export function encryptField(plaintext: string): { ciphertext: string; iv: string; tag: string } {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return { ciphertext: encrypted, iv: iv.toString('hex'), tag };
}

export function decryptField(ciphertext: string, iv: string, tag: string): string {
  const decipher = createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Kullanım: users tablosunda email alanı
export async function createUserWithEncryptedEmail(email: string) {
  const encrypted = encryptField(email);
  return db.run(
    `INSERT INTO users (email_cipher, email_iv, email_tag, created_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
    [encrypted.ciphertext, encrypted.iv, encrypted.tag]
  );
}
```

### 8.5 GDPR / KVKK Compliance: Data Retention, Right to Erasure, Consent Management

GDPR ve KVKK kapsamında Gistify, "data minimization", "purpose limitation" ve "storage limitation" prensiplerine uyar. Kullanıcı verileri, belirli saklama süreleri sonunda otomatik purge edilir. [^g1]

```sql
-- Data retention policy (GDPR/KVKK uyumlu)
-- Loglar: 90 gün
-- Analytics: 1 yıl
-- Social data: 2 yıl
-- Session/audit log: 6 ay

-- Otomatik purge (SQLite cron job tetiklemesi için Node.js scheduler)
-- Aşağıdaki SQL, daily cron job içinde çalıştırılır:

DELETE FROM app_logs WHERE created_at < datetime('now', '-90 days');
DELETE FROM analytics_events WHERE created_at < datetime('now', '-1 year');
DELETE FROM social_data WHERE created_at < datetime('now', '-2 years');
DELETE FROM user_sessions WHERE created_at < datetime('now', '-6 months');
```

**Right to Erasure ("Right to be Forgotten"):** Kullanıcı hesap silme endpoint'i, anonimleştirme + export mekanizması içerir. Cascade delete yerine soft delete + anonimleştirme tercih edilir; çünkü yorumlar ve beğeniler topluluk değerini korur. [^g2]

```typescript
// DELETE /api/user/me — GDPR Right to Erasure
app.delete('/api/user/me', authenticate, async (req, res) => {
  const userId = req.user.id;

  // 1. Data export (30 gün içinde indirilebilir)
  const exportData = await generateUserDataExport(userId);
  await saveExportRequest(userId, exportData);

  // 2. Anonimleştirme (PII sil, social data anonim kullanıcıya yönlendir)
  const anonUserId = 0; // usr_deleted placeholder
  await db.transaction(async (trx) => {
    await trx.run('UPDATE likes SET user_id = ? WHERE user_id = ?', [anonUserId, userId]);
    await trx.run('UPDATE comments SET user_id = ? WHERE user_id = ?', [anonUserId, userId]);
    await trx.run(
      `UPDATE users SET
        email = NULL, phone = NULL, password_hash = '[REDACTED]',
        display_name = 'Silinmiş Üye', avatar_url = NULL,
        is_deleted = 1, deleted_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [userId]
    );
  });

  // 3. Auth token'ları iptal et
  await revokeAllTokens(userId);

  // 4. 3. taraf billing entegrasyonu bildir
  await notifyStripeCustomerDeleted(userId);

  res.json({
    message: 'Hesabınız silindi. Yorumlarınız anonimleştirildi.',
    dataExportAvailableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
});
```

**Consent Management:** Cookie consent, analytics, marketing ve social kategorilerine ayrılır. Zorunlu (necessary) consent devre dışı bırakılamaz. [^g1]

```typescript
// Consent management store (Zustand)
interface ConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  social: boolean;
  grant: (category: 'analytics' | 'marketing' | 'social') => void;
  revoke: (category: 'analytics' | 'marketing' | 'social') => void;
}

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      necessary: true,
      analytics: false,
      marketing: false,
      social: false,
      grant: (category) => {
        set((s) => ({ ...s, [category]: true }));
        logConsent(category, true);
      },
      revoke: (category) => {
        set((s) => ({ ...s, [category]: false }));
        logConsent(category, false);
      },
    }),
    { name: 'gistify-consent' }
  )
);

async function logConsent(category: string, granted: boolean) {
  await db.run(
    `INSERT INTO user_consents (user_id, category, granted, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, category, granted ? 1 : 0, req.ip, req.headers['user-agent']]
  );
}
```

### 8.6 SOC 2 Type I/II Roadmap (Vanta / Drata)

Enterprise müşteriler için SOC 2 Type II neredeyse zorunludur. Type I, 30–60 gün içinde alınabilir; Type II ise 6–12 aylık gözlem penceresi gerektirir [^g2]. Automation platformları (Vanta, Drata, Sprinto) evidence toplama süresini 100–200 saat tasarruf sağlar [^g3].

| Platform | Güçlü Yön | Maliyet | Gistify için Uygunluk |
|----------|-----------|---------|----------------------|
| **Vanta** | En hızlı SOC 2 Type I, 400+ integration, 1,300+ automated test [^g4] | $2,000–$10,000/yıl | Faz 1 (hızlı trust) |
| **Drata** | Multi-framework (SOC 2 + ISO 27001 + HIPAA), AI policy generation [^g5] | $3,000–$10,000/yıl | Faz 2 (scale) |
| **Sprinto** | En düşük maliyet, startup odaklı | $3,000–$5,000/yıl | MVP fazı |

**Gistify SOC 2 Roadmap:**

- **Ay 1–2:** Vanta entegrasyonu. Policy'ler yazılır (access control, incident response, data retention).
- **Ay 3–4:** Evidence collection (log aggregation, access review, penetration test report).
- **Ay 5–6:** Type I audit (CPA firması). Maliyet: $10,000–$25,000 [^g3].
- **Ay 7–18:** Type II observation window. Continuous monitoring.
- **Ay 19–20:** Type II audit. Enterprise sales enablement.

### 8.7 Audit Trails & Logging (Winston / Morgan + Sentry)

Production'da structured JSON logging zorunludur. Winston + Morgan kombinasyonu, hem HTTP request hem de application event log'larını merkezi hale getirir. Sentry, error tracking ve performance monitoring için kullanılır; production'da %10 sampling ile çalışır. [^s6]

```typescript
// Winston + Morgan structured logging
import winston from 'winston';
import morgan from 'morgan';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'gistify-api', environment: process.env.NODE_ENV },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/audit.log', level: 'info' }),
  ],
});

// Morgan JSON stream
app.use(morgan((tokens, req, res) => {
  return JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    responseTime: parseFloat(tokens['response-time'](req, res) || '0'),
    userAgent: tokens['user-agent'](req, res),
    userId: (req as any).user?.id,
    timestamp: new Date().toISOString(),
  });
}, { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Audit trail helper
export function auditLog(action: string, userId: string, resource: string, details?: object) {
  logger.info('AUDIT', {
    action,
    userId,
    resource,
    details,
    ip: (global as any).req?.ip,
    userAgent: (global as any).req?.headers?.['user-agent'],
  });
}

// Kullanım: auditLog('CONTENT_ACCESS', userId, contentSlug, { tier: 'pro' });
```

```typescript
// Sentry initialization (PII redaction)
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.APP_VERSION,
  tracesSampleRate: 0.1, // Production: 10%
  beforeSend(event) {
    if (event.request?.headers?.authorization) {
      delete event.request.headers.authorization;
    }
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    return event;
  },
});
```

### 8.8 Penetration Testing & Bug Bounty Program

**Penetration Testing:** Yılda 2 kez (6 ayda bir) third-party penetration test yapılır. OWASP Top 10 kapsamında test edilir: Injection, Broken Authentication, Sensitive Data Exposure, XML External Entities (XXE), Broken Access Control, Security Misconfiguration, XSS, Insecure Deserialization, Using Components with Known Vulnerabilities, Insufficient Logging & Monitoring.

**Bug Bounty:** HackerOne veya Bugcrowd platformları üzerinden public bug bounty programı açılır. Scope: `*.gistify.pro`, API endpoints, mobile app (gelecekte). Reward modeli:

| Severity | Ödeme | Örnek |
|----------|-------|-------|
| Critical | $2,000+ | RCE, SQLi, full auth bypass |
| High | $1,000 | Account takeover, IDOR, sensitive data leak |
| Medium | $300 | XSS, CSRF (non-admin) |
| Low | $100 | Information disclosure, best practice violation |

---

## Bölüm 9: Gelişmiş Performans & Ölçeklendirme

### 9.1 Edge Caching: Cloudflare CDN, Vercel Edge Config

Cloudflare, 300+ PoP (Point of Presence) ve V8 Isolate teknolojisi sayesinde <1ms cold start süresi sunar. Bu, AWS Lambda'nın 100ms–1s cold start'ine karşı dramatik bir avantajdır [^16]. Gistify'nin statik asset'leri, API response'ları ve feature flag'leri edge'de cachelenir. [^16]

```typescript
// Cloudflare CDN cache control headers
app.use('/api/content/public', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=86400'); // 5min fresh, 1 day stale
  next();
});

app.use('/api/content/premium', authenticate, (req, res, next) => {
  // Premium içerik: private cache, no-store (her kullanıcıya özel)
  res.setHeader('Cache-Control', 'private, no-cache, must-revalidate');
  next();
});
```

```typescript
// Vercel Edge Config — feature flags & A/B test config
import { get } from '@vercel/edge-config';

export async function getFeatureFlag(flag: string, userId: string): Promise<boolean> {
  const config = await get<{ flags: Record<string, number> }>('gistify-config');
  const rollout = config?.flags?.[flag] ?? 0;

  // Deterministic user bucketing (hash-based)
  const hash = crypto.createHash('md5').update(`${userId}:${flag}`).digest('hex');
  const bucket = parseInt(hash.slice(0, 4), 16) % 100;

  return bucket < rollout; // e.g., rollout 10 → %10 kullanıcı
}
```

### 9.2 Database Optimization: SQLite → PostgreSQL Migration Path, Read Replicas, Connection Pooling

Mevcut SQLite altyapısı, single-node, single-writer modeliyle MVP fazını destekler. Ancak concurrent write'lar, connection limit ve read replica ihtiyacı nedeniyle PostgreSQL'e migration planlanır. [^19]

**Migration Roadmap:**

1. **Phase 1 (Ay 1–2):** SQLite + `better-sqlite3` optimization. WAL mode, connection pooling (thread pool), query optimization.
2. **Phase 2 (Ay 3–4):** PostgreSQL shadow write. Tüm write'lar hem SQLite hem PostgreSQL'e gider; read hâlâ SQLite'dan. Data consistency checker çalışır.
3. **Phase 3 (Ay 5):** Read replica açılır. Read query'ler PostgreSQL read replica'ya yönlendirilir. Write hâlâ SQLite'a.
4. **Phase 4 (Ay 6):** Full cutover. Write'lar PostgreSQL primary'e; SQLite read-only fallback. [^19]

```typescript
// Database connection pool (PostgreSQL — Phase 4)
import { Pool } from 'pg';

const primaryPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const readPool = new Pool({
  connectionString: process.env.DATABASE_READ_URL,
  max: 50, // Read replica daha fazla connection alabilir
  idleTimeoutMillis: 30000,
});

export function queryPrimary(sql: string, params?: any[]) {
  return primaryPool.query(sql, params);
}

export function queryRead(sql: string, params?: any[]) {
  return readPool.query(sql, params);
}
```

```sql
-- PostgreSQL-specific optimizations
-- 1. Partitioning (monthly content logs)
CREATE TABLE content_logs_2026_01 PARTITION OF content_logs
FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

-- 2. Read replica streaming replication (pg_hba.conf + postgresql.conf)
-- wal_level = replica
-- max_wal_senders = 10
-- hot_standby = on

-- 3. Connection pooling (PgBouncer) — transaction pooling mode
```

### 9.3 Caching Stratejisi: Redis / Upstash, Stale-While-Revalidate

Gistify'de çok katmanlı caching stratejisi uygulanır: [^26]

| Katman | Teknoloji | TTL | Kullanım |
|--------|-----------|-----|----------|
| **Browser Cache** | Cache API | 7 gün | Static assets, MD content |
| **CDN Cache** | Cloudflare | 5 min – 1 day | Public API responses, images |
| **Application Cache** | Upstash Redis | 2 min – 1 hour | Session, feature flags, rate limits |
| **Database Cache** | PostgreSQL shared buffers | — | Query plan cache |

```typescript
// Stale-while-revalidate pattern (Upstash Redis)
import { Redis } from '@upstash/redis';
const redis = new Redis({ url: process.env.UPSTASH_REDIS_URL!, token: process.env.UPSTASH_REDIS_TOKEN! });

async function getContentWithSWR(slug: string, route: string) {
  const cacheKey = `content:${route}:${slug}`;
  const cached = await redis.get<string>(cacheKey);

  if (cached) {
    // Background revalidation (async, non-blocking)
    revalidateContent(slug, route, cacheKey).catch(() => {});
    return JSON.parse(cached);
  }

  // Cache miss: fetch and populate
  const content = await fetchContentFromDB(slug, route);
  await redis.set(cacheKey, JSON.stringify(content), { ex: 300 }); // 5 min TTL
  return content;
}

async function revalidateContent(slug: string, route: string, cacheKey: string) {
  const content = await fetchContentFromDB(slug, route);
  await redis.set(cacheKey, JSON.stringify(content), { ex: 300 });
}
```

### 9.4 Bundle Optimization: Dynamic Imports, Code Splitting, Tree Shaking

Vite, tree shaking ve dynamic import'lar için native destek sunar. Gistify'nin initial bundle boyutu <150KB hedeflenir (mevcut tahmini <200KB). [^26]

```typescript
// Dynamic imports — route-based code splitting
import { lazy, Suspense } from 'react';

const ContentPage = lazy(() => import('./pages/ContentPage'));
const FlowPage = lazy(() => import('./pages/FlowPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function App() {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <Routes>
        <Route path="/app/:route" element={<ContentPage />} />
        <Route path="/flow/:slug" element={<FlowPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </Suspense>
  );
}
```

```typescript
// Library-level dynamic import (charting)
const ChartRenderer = lazy(() => import('./components/ChartRenderer'));

// Vendor chunk splitting (vite.config.ts)
import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-tabs', 'class-variance-authority'],
          'chart-vendor': ['recharts', 'echarts'],
          'md-vendor': ['unified', 'remark-parse', 'rehype-sanitize'],
        },
      },
    },
  },
});
```

### 9.5 Image Optimization: next/image, Cloudflare Images, WebP/AVIF

Gistify raporları, yoğun grafik ve chart içerir. Image optimization, LCP (Largest Contentful Paint) metriğini doğrudan etkiler. [^26]

```typescript
// Cloudflare Images + responsive srcset
interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export function OptimizedImage({ src, alt, width, height, priority }: OptimizedImageProps) {
  // Cloudflare Image Resizing URL format
  const cfUrl = (w: number, format: 'webp' | 'avif' = 'webp') =>
    `https://cdn.gistify.pro/cdn-cgi/image/width=${w},format=${format},quality=85/${src}`;

  return (
    <img
      src={cfUrl(width)}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      srcSet={`${cfUrl(400)} 400w, ${cfUrl(800)} 800w, ${cfUrl(1200)} 1200w`}
      sizes="(max-width: 768px) 100vw, 800px"
    />
  );
}
```

### 9.6 Lazy Loading & Virtualization: TanStack Virtual, react-virtuoso

Flow sayfasındaki comment listeleri, momentum taramasındaki hisse listeleri ve admin paneldeki içerik listeleri virtualized rendering ile optimize edilir. DOM'da sadece görünür alandaki öğeler render edilir. [^31]

```typescript
// TanStack Virtual — infinite scroll list
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

function VirtualCommentList({ comments }: { comments: Comment[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: comments.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Her yorum ~120px
    overscan: 5, // Görünür alanın üstü/altı 5 öğe render
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={item.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${item.start}px)`,
            }}
          >
            <CommentCard comment={comments[item.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 9.7 Performance Metrics: Web Vitals, Lighthouse CI, Real User Monitoring (RUM)

Performance ölçümü üç seviyede yapılır: development (Lighthouse CI), CI/CD (automated Lighthouse audit), production (Real User Monitoring via Web Vitals API). [^26]

```typescript
// Web Vitals reporting (Vercel Analytics compatible)
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  const body = JSON.stringify(metric);
  // Vercel Analytics, Google Analytics 4, veya custom endpoint
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', body);
  } else {
    fetch('/api/vitals', { body, method: 'POST', keepalive: true });
  }
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

```yaml
# .github/workflows/lighthouse-ci.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:4173/app", "http://localhost:4173/flow/test"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "categories:seo": ["warn", { "minScore": 0.9 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 1200 }],
        "largest-contentful-paint": ["warn", { "maxNumericValue": 1800 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 200 }]
      }
    }
  }
}
```

### 9.8 Load Testing: k6, Artillery

Load testing, production öncesi bottleneck'leri ortaya çıkarır. k6, JavaScript-based modern load testing aracıdır. Artillery, YAML-based declarative test yazımı sunar. [^26]

```javascript
// k6 load test — API endpoint stress test
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Steady state
    { duration: '2m', target: 200 }, // Spike
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95th percentile < 500ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
  },
};

export default function () {
  const res = http.get('https://api.gistify.pro/api/content/momentum');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

```yaml
# artillery.yml — scenario-based load test
config:
  target: 'https://api.gistify.pro'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
scenarios:
  - name: 'Browse content'
    requests:
      - get:
          url: '/api/content/momentum'
      - get:
          url: '/api/content/daily-report'
  - name: 'Social interaction'
    requests:
      - post:
          url: '/api/social/like'
          json:
            contentSlug: 'test-report'
```

---

## Bölüm 10: Gelişmiş Test & Kalite Güvencesi

### 10.1 Test Piramidi: Unit (Vitest) → Integration (Supertest) → E2E (Playwright)

Gistify test stratejisi, Mike Cohn'ın test piramidi modelini takip eder: çok sayıda hızlı unit test, orta sayıda integration test, az sayıda yavaş E2E test. [^26]

```
        /\
       /  \     E2E (Playwright) — ~20 test, slow, expensive
      /----\   
     /      \   Integration (Supertest + SQLite) — ~100 test, medium
    /--------\  
   /          \ Unit (Vitest + React Testing Library) — ~500 test, fast
  /____________\
```

**Unit Test (Vitest):** Bileşen render'ı, hook state değişimi, utility fonksiyonları. Hedef: %70 coverage. [^26]

```typescript
// Vitest + React Testing Library — ContentViewer unit test
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContentViewer } from './ContentViewer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('ContentViewer', () => {
  it('renders tab bar with correct tabs', () => {
    render(<ContentViewer route="momentum" />, { wrapper: createWrapper() });
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('switches tab on click', async () => {
    render(<ContentViewer route="momentum" />, { wrapper: createWrapper() });
    const tab = screen.getByRole('tab', { name: /haziran 2026/i });
    fireEvent.click(tab);
    expect(tab).toHaveAttribute('aria-selected', 'true');
  });

  it('shows skeleton while loading', () => {
    render(<ContentViewer route="momentum" />, { wrapper: createWrapper() });
    expect(screen.getByTestId('content-skeleton')).toBeInTheDocument();
  });
});
```

**Integration Test (Supertest + SQLite):** API endpoint'leri, database transaction'ları, auth middleware. SQLite in-memory test DB kullanılır. [^26]

```typescript
// Supertest integration test — Auth & Content API
import request from 'supertest';
import { app } from '../server';
import { db } from '../db';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('POST /api/content', () => {
  let authToken: string;

  beforeAll(async () => {
    // Seed test DB
    await db.exec('DELETE FROM users');
    await db.exec('DELETE FROM content_registry');
    const user = await db.run('INSERT INTO users (email, tier) VALUES (?, ?)', ['test@gistify.pro', 'pro']);
    authToken = generateTestToken(user.lastID);
  });

  it('creates content for pro user', async () => {
    const res = await request(app)
      .post('/api/content')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Test Rapor', slug: 'test-rapor', route: 'momentum' });

    expect(res.status).toBe(201);
    expect(res.body.slug).toBe('test-rapor');
  });

  it('rejects content creation for free user', async () => {
    const freeUser = await db.run('INSERT INTO users (email, tier) VALUES (?, ?)', ['free@gistify.pro', 'free']);
    const freeToken = generateTestToken(freeUser.lastID);

    const res = await request(app)
      .post('/api/content')
      .set('Authorization', `Bearer ${freeToken}`)
      .send({ title: 'Test', slug: 'test-2', route: 'momentum' });

    expect(res.status).toBe(403);
  });
});
```

**E2E Test (Playwright):** Kritik kullanıcı akışları. Headless browser'da gerçekleşir. [^26]

```typescript
// Playwright E2E — Critical user flow
import { test, expect } from '@playwright/test';

test('full user journey: login → view report → comment → logout', async ({ page }) => {
  // 1. Login
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', 'test@gistify.pro');
  await page.fill('[data-testid="password-input"]', 'Test1234!');
  await page.click('[data-testid="login-button"]');
  await expect(page).toHaveURL('/app');

  // 2. View report
  await page.click('[data-testid="tab-haziran-2026"]');
  await expect(page.locator('[data-testid="content-body"]')).toBeVisible();

  // 3. Add comment
  await page.fill('[data-testid="comment-input"]', 'Harika analiz!');
  await page.click('[data-testid="comment-submit"]');
  await expect(page.locator('text=Harika analiz!')).toBeVisible();

  // 4. Logout
  await page.click('[data-testid="user-menu"]');
  await page.click('[data-testid="logout"]');
  await expect(page).toHaveURL('/');
});
```

### 10.2 Visual Regression: Chromatic, Storybook

Storybook, izole bileşen geliştirme ve dokümantasyon için kullanılır. Chromatic, Storybook üzerinde visual regression test'leri çalıştırır; her PR'da pixel-by-pixel diff raporlanır. [^26]

```typescript
// Storybook — ContentViewer stories
import type { Meta, StoryObj } from '@storybook/react';
import { ContentViewer } from './ContentViewer';

const meta: Meta<typeof ContentViewer> = {
  component: ContentViewer,
  title: 'Content/ContentViewer',
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof ContentViewer>;

export const Default: Story = { args: { route: 'momentum' } };
export const Loading: Story = { args: { route: 'momentum', __mockState: 'loading' } };
export const Error: Story = { args: { route: 'momentum', __mockState: 'error' } };
export const Empty: Story = { args: { route: 'momentum', __mockState: 'empty' } };
export const PremiumLocked: Story = { args: { route: 'momentum', __mockState: 'premium' } };
```

```yaml
# .github/workflows/chromatic.yml
name: Chromatic Visual Regression
on: push
jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Chromatic requires full git history
      - run: npm ci
      - run: npx chromatic --project-token=${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

### 10.3 Accessibility Testing: axe-core, jest-axe, Lighthouse a11y, WCAG 2.1 AA

Accessibility testing, hem otomatik (axe-core, jest-axe) hem manuel (screen reader, keyboard-only) olarak yapılır. Hedef: WCAG 2.1 AA compliance, Lighthouse a11y skoru 95+. [^26]

```typescript
// jest-axe — component accessibility unit test
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ReportCard } from './ReportCard';
import { expect, describe, it } from 'vitest';

expect.extend(toHaveNoViolations);

describe('ReportCard Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <ReportCard title="Ocak 2024 Borsa Özeti" date="2024-01-15" accessLevel="premium" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper heading hierarchy', () => {
    const { container } = render(<ReportCard title="Test" date="2024-01-15" />);
    const heading = container.querySelector('h2');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test');
  });

  it('has accessible color contrast', () => {
    const { container } = render(<ReportCard title="Test" date="2024-01-15" />);
    const text = container.querySelector('p');
    expect(text).toHaveStyle('color: rgb(100, 116, 139)'); // slate-500, 4.6:1 contrast
  });
});
```

```typescript
// Cypress + axe-core E2E accessibility test
import 'cypress-axe';

describe('WCAG 2.1 AA — Content Pages', () => {
  beforeEach(() => {
    cy.visit('/app?tab=rapor');
    cy.injectAxe();
  });

  it('report page passes WCAG 2.1 AA', () => {
    cy.checkA11y(undefined, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    });
  });

  it('comment form is accessible', () => {
    cy.get('[data-testid="comment-form"]').within(() => {
      cy.checkA11y();
    });
  });
});
```

### 10.4 Security Testing: OWASP ZAP, Dependency Audit (Snyk)

**OWASP ZAP:** Full application spider scan + active scan. CI/CD pipeline'da nightly çalışır. High+ severity finding'ler build'ı fail eder.

```yaml
# .github/workflows/security-scan.yml
name: Security Scan
on:
  schedule:
    - cron: '0 2 * * *' # Her gece 2 AM
  workflow_dispatch:

jobs:
  zap_scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Start app
        run: docker compose up -d
      - name: OWASP ZAP Full Scan
        uses: zaproxy/action-full-scan@v0.9.0
        with:
          target: 'http://localhost:3000'
          rules_file_name: '.zap/rules.tsv'
          cmd_options: '-a'
```

**Snyk:** Dependency vulnerability scan. `package.json` ve `package-lock.json` otomatik taranır. Critical severity dependency'ler, PR block'u oluşturur.

```bash
# Snyk CLI (CI/CD integration)
npm install -g snyk
snyk auth $SNYK_TOKEN
snyk test --severity-threshold=high
snyk monitor --project-name=gistify-api
```

### 10.5 Performance Testing: Lighthouse CI, Web Vitals Thresholds

Her PR'da Lighthouse CI çalışır. Performance, Accessibility, Best Practices, SEO kategorilerinde threshold'lar uygulanır. Web Vitals metrikleri, Vercel Analytics + GA4 üzerinden Real User Monitoring (RUM) ile toplanır. [^26]

| Metrik | Threshold | Öncelik | Araç |
|--------|-----------|---------|------|
| LCP | < 1.8s | Critical | Lighthouse CI, Web Vitals |
| FCP | < 1.2s | Critical | Lighthouse CI |
| TTI | < 2.5s | High | Lighthouse CI |
| TBT | < 200ms | High | Lighthouse CI |
| CLS | < 0.1 | Critical | Web Vitals |
| INP | < 200ms | High | Web Vitals |
| Bundle Size (initial) | < 150KB | High | vite-bundle-analyzer |

```yaml
# .github/workflows/ci.yml — Performance budget gate
- name: Bundle Size Check
  run: |
    npm run build
    npx bundlesize
  env:
    BUNDLESIZE_GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

# .bundlesize.json
{
  "files": [
    { "path": "dist/assets/index-*.js", "maxSize": "150kB" },
    { "path": "dist/assets/index-*.css", "maxSize": "50kB" }
  ]
}
```

### 10.6 CI/CD Pipeline: GitHub Actions, Preview Deploy, Automated Rollback

GitHub Actions pipeline'ı, her PR'da lint, type check, test, build ve deploy aşamalarını çalıştırır. Vercel preview deploy, her PR için otomatik preview URL oluşturur. [^26]

```yaml
# .github/workflows/ci.yml (full)
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - run: npm run test:integration
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build

  lighthouse:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - run: npm install -g @lhci/cli
      - run: lhci autorun

  deploy:
    runs-on: ubuntu-latest
    needs: [build, e2e, lighthouse]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**Automated Rollback:** Her production deploy, Vercel deployment ID'si ile tag'lenir. Hata durumunda `/api/admin/rollback` endpoint'i veya Vercel CLI ile anlık geri alma yapılır. Database migration'lar reversible olmalıdır (down migration her migration dosyasında). [^26]

```bash
# Vercel rollback CLI
vercel --version $PREVIOUS_DEPLOYMENT_ID --prod

# Database rollback (example)
npx knex migrate:rollback --env production
```

### 10.7 Code Quality: ESLint, Prettier, TypeScript Strict Mode, Husky Pre-Commit Hooks

Code quality, otomasyon ile zorlanır. TypeScript strict mode, `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes` ile açılır. Husky pre-commit hook, her commit öncesi lint, type check ve staged test çalıştırır. [^26]

```json
// tsconfig.json (strict mode)
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "isolatedModules": true,
    "skipLibCheck": true
  }
}
```

```json
// .eslintrc.json (Gistify-specific rules)
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "react-hooks/exhaustive-deps": "error",
    "jsx-a11y/anchor-is-valid": "error",
    "no-console": ["warn", { "allow": ["error", "warn"] }]
  }
}
```

```json
// package.json (husky + lint-staged)
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write", "vitest related --run"],
    "*.{css,scss,md}": ["prettier --write"]
  }
}
```

---

## Bölüm 11: Gelişmiş Strateji, Roadmap & Kaynak Planlaması

### 11.1 12 Aylık Roadmap (4 Çeyrek)

| Çeyrek | Tema | Milestone'lar | Deliverable'lar |
|--------|------|--------------|-----------------|
| **Q1 (Ay 1–3)** Foundation | Dinamik MD, Tasarım Sistemi, Auth v2, SQLite→PG shadow | Dinamik içerik sistemi, shadcn/ui standardizasyonu, Clerk entegrasyonu, billing foundation |
| **Q2 (Ay 4–6)** Scale | PostgreSQL cutover, Paywall v2, SOC 2 Type I, Admin v2 | Full PG, Stripe billing, metered billing, compliance audit |
| **Q3 (Ay 7–9)** Growth | Sosyal katman (Flow), Dynamic paywall, Real-time (SSE/WS), Edge computing | FlowPage, like/comment/share, AI-driven paywall, Cloudflare Workers |
| **Q4 (Ay 10–12)** Enterprise | SSO, API v1, Enterprise tier, SOC 2 Type II, White-label | SAML/OIDC, public API, enterprise onboarding, Type II audit |

### 11.2 Bağımlılık Grafiği (Kritik Yol Analizi)

Önceki rapordan (Bölüm 20.1) devam eden kritik yol, Part 2 scope'uyla genişletilmiştir:

```
Dinamik MD Sistemi (A1)
  → Tasarım Sistemi Birleştirme (A3) [bloke eder]
  → Sosyal Katman (A4) [içerik olmadan sosyal anlamsız]
  → Paywall v2 (B7) [access_level MD'den gelir]
  → SQLite → PG Migration (B9) [data layer değişimi]

Tasarım Sistemi Birleştirme (A3)
  → Responsive Tablo (A4)
  → Accessibility (A4) [kontrast renkler temadan]
  → Dynamic Paywall UI (B7) [paywall CSS temaya bağımlı]

Auth v2 (Clerk / OAuth 2.1)
  → Paywall v2 (B7) [kullanıcı planı auth'dan gelir]
  → API Rate Limiting (B7) [tier auth'dan bilinir]
  → Admin v2 (B8) [RBAC auth üzerine kurulur]

PostgreSQL Cutover (B9)
  → Read Replica (B9) [primary önce kurulmalı]
  → Connection Pooling (B9)
  → Full Text Search (B9) [FTS5 → PG tsvector]

SOC 2 Type I (B8)
  → SOC 2 Type II (B11) [Type I önce tamamlanmalı]
```

**Kritik Yol (Güncellenmiş):** A1 (Dinamik MD) → A3 (Tasarım) → Auth v2 → B7 (Paywall) → B9 (PG Migration) → B11 (SOC 2 Type I) → Q4 Enterprise

**Paralel Yollar:**
- Sosyal Katman (A4) ve Admin v2 (A2), A1 ve Auth v2 tamamlandıktan sonra paralel çalışabilir.
- Edge Computing (B9) ve Caching (B9), backend stabilize olduktan sonra paralel eklenebilir.
- Test & QA (B10), her milestone sonunda paralel sprint olarak çalışır.

### 11.3 Feature Flag Stratejisi (Canary, A/B Testing)

Feature flag'ler, Flagsmith (open-source, self-hosted) veya LaunchDarkly (enterprise) kullanılarak yönetilir. Canary ve A/B test, birbirini tamamlayan ama farklı sorulara cevap veren yaklaşımlardır: Canary "güvenli mi?" (error rate, latency) sorusunu sorar; A/B test "daha iyi mi?" (conversion, revenue) sorusunu sorar [^f4]. [^f1][^f2][^f3]

**Progressive Delivery Pipeline:** [^f5]

```
Step 1: Internal testing (feature flag, dev team)
Step 2: Canary 1–5% (safety check: error rate < %0.1, p99 latency < 500ms)
Step 3: A/B test 50/50 (conversion, engagement metric karşılaştırması)
Step 4: Gradual rollout (10% → 25% → 50% → 75% → 100%)
Step 5: Full deployment + cleanup (flag kaldırılır, kod kalıcı hale gelir)
```

```typescript
// Feature flag evaluation (Flagsmith compatible)
interface FeatureFlagConfig {
  name: string;
  enabled: boolean;
  rolloutPercentage: number;
  variants?: Record<string, number>; // A/B test weights
}

export function evaluateFlag(flag: FeatureFlagConfig, userId: string): { enabled: boolean; variant?: string } {
  if (!flag.enabled) return { enabled: false };

  // Deterministic bucketing (hash-based, session-consistent)
  const hash = crypto.createHash('md5').update(`${userId}:${flag.name}`).digest('hex');
  const bucket = parseInt(hash.slice(0, 4), 16) % 100;

  if (bucket >= flag.rolloutPercentage) return { enabled: false };

  // A/B variant selection
  if (flag.variants) {
    const entries = Object.entries(flag.variants);
    let cumulative = 0;
    const variantBucket = parseInt(hash.slice(4, 8), 16) % 100;
    for (const [variant, weight] of entries) {
      cumulative += weight;
      if (variantBucket < cumulative) return { enabled: true, variant };
    }
  }

  return { enabled: true };
}

// Kullanım: Dynamic paywall A/B test
const flag = {
  name: 'dynamic-paywall-v2',
  enabled: true,
  rolloutPercentage: 50,
  variants: { 'control': 50, 'treatment': 50 }
};

const decision = evaluateFlag(flag, userId);
if (decision.enabled && decision.variant === 'treatment') {
  showDynamicPaywallV2();
} else {
  showStaticPaywall();
}
```

### 11.4 Migration Plan: SQLite → PostgreSQL, HEX → OKLCH, Monolith → Modular

**SQLite → PostgreSQL Migration (Ay 3–6):** [^19]

```
Ay 3: PostgreSQL schema oluşturma (pg-migrate). Shadow write başlat.
Ay 4: Dual-write validation (consistency checker, row count match).
Ay 5: Read replica aç, read query'leri PG'ye yönlendir. Write SQLite'a kalır.
Ay 6: Full cutover. SQLite read-only. Fallback 30 gün boyunca aktif.
```

```typescript
// Dual-write consistency checker (daily cron)
async function validateConsistency() {
  const sqliteCounts = await sqliteDb.all('SELECT route, COUNT(*) as c FROM content_registry GROUP BY route');
  const pgCounts = await pgDb.query('SELECT route, COUNT(*) as c FROM content_registry GROUP BY route');

  for (const sq of sqliteCounts) {
    const pg = pgCounts.rows.find(r => r.route === sq.route);
    if (pg?.c !== sq.c) {
      await alertSlack(`Inconsistency: route=${sq.route} sqlite=${sq.c} pg=${pg?.c}`);
    }
  }
}
```

**HEX → OKLCH Geçişi (Ay 2–3):** Feature flag `oklch-theme` ile aşamalı geçiş. Kullanıcıların %10'una önce gösterilir, stabilite onaylandıktan sonra %100 açılır. [^26]

```css
/* OKLCH color tokens (globals.css) */
@layer base {
  :root {
    --color-primary: oklch(0.55 0.2 250);     /* #2563eb eşdeğeri */
    --color-success: oklch(0.65 0.18 145);    /* #16a34a eşdeğeri */
    --color-warning: oklch(0.65 0.18 65);     /* #ea580c eşdeğeri */
    --color-danger: oklch(0.55 0.22 25);      /* #dc2626 eşdeğeri */
  }
}
```

**Monolith → Modular:** Server kodu, domain-driven module'lere ayrılır:

```
server/
  ├── auth/          # Clerk integration, OAuth, session
  ├── billing/       # Stripe webhooks, subscription, usage
  ├── content/       # MD pipeline, registry, search
  ├── social/        # Like, comment, share, activity
  ├── admin/         # Upload, publish, analytics
  ├── reporting/     # Daily, momentum, earnings generators
  └── common/        # DB, cache, config, middleware
```

### 11.5 Risk Assessment & Mitigation

| Risk | Olasılık | Etki | Mitigation |
|------|----------|------|------------|
| **SQLite → PG migration data loss** | Orta | Critical | Dual-write + consistency checker + 30g rollback |
| **Stripe billing integration bug** | Düşük | High | Sandbox testing + Stripe test mode + webhook idempotency |
| **SOC 2 audit fail** | Düşük | Critical | Vanta 3 ay önce başlat + pre-audit gap analysis |
| **Dynamic paywall conversion düşüşü** | Orta | Medium | A/B test + gradual rollout + instant rollback |
| **Real-time (WebSocket) infra failure** | Düşük | Medium | Fallback to 30s polling + circuit breaker |
| **Third-party API outage (market data)** | Yüksek | Medium | Cached data + stale disclaimer + retry queue |
| **Security breach (XSS/SQLi)** | Düşük | Critical | OWASP ZAP + Snyk + code review + bug bounty |
| **Team scaling (tek developer)** | Yüksek | High | Dokümantasyon + modular code + onboarding guide |

### 11.6 Maliyet Tahmini (Güncellenmiş, Araştırmaya Dayalı)

Önceki rapor (Bölüm 20.5) $90–100/aylık maliyet öngörmüştü. Part 2 scope'uyla (billing, compliance, edge, real-time) maliyet güncellenmiştir:

| Servis | Plan | Aylık Maliyet | Not |
|--------|------|---------------|-----|
| **Vercel Pro** | Pro | $20 | Hosting, preview deploys |
| **Cloudflare Pro** | Pro | $20 | CDN, WAF, DDoS, edge rules |
| **Upstash Redis** | Pay-as-you-go | $10 | Rate limiting, session, cache |
| **Sentry** | Team | $26 | Error tracking, performance |
| **Stripe** | Pay-as-you-go | $0 (transaction fee %2.9) | Billing, no monthly fee |
| **Vanta** | Growth | $500 | SOC 2 automation |
| **Google Analytics 4** | — | Ücretsiz | Analytics |
| **Hotjar / Clarity** | Plus | $39 | Heatmap, session recording |
| **Flagsmith** | Self-hosted | $0 (infra) | Feature flags |
| **PostgreSQL (Neon/Railway)** | Pro | $50 | Managed Postgres, read replica |
| **k6 Cloud / Artillery** | Free tier | $0 | Load testing |
| **Chromatic** | Starter | $0 (open source) | Visual regression |
| **OneSignal / FCM** | Free | $0 | Push notifications [^34] |
| **Supabase Realtime** | Free | $0 | 200 concurrent connections [^14] |
| **Ably (opsiyonel)** | Pro | $0 (başlangıç) | Real-time upgrade path [^13] |
| **Toplam Aylık (MVP)** | — | **~$165** | Scale öncesi |
| **Toplam Aylık (Scale)** | — | **~$500–800** | PG replica, Ably, SOC 2, enterprise |

**Yıllık Maliyet (İlk Yıl):**
- Infrastructure: $165 × 12 = $1,980
- SOC 2 Type I audit: $15,000–$25,000 [^g3]
- Vanta platform: $500 × 12 = $6,000
- Penetration test (2×): $8,000
- **Toplam Yıllık: ~$31,000–$41,000**

### 11.7 Team Composition & Hiring Plan

Mevcut durumda tek full-time developer olduğu varsayılır. 12 aylık roadmap için team composition:

| Rol | Ay | FTE | Açıklama |
|-----|-----|-----|----------|
| **Full-Stack Developer** | 1–12 | 1.0 | Mevcut, core development |
| **Backend Developer** | 4–12 | 0.5–1.0 | PG migration, API, real-time |
| **Frontend Developer** | 6–12 | 0.5 | UI/UX, performance, accessibility |
| **DevOps / SRE** | 8–12 | 0.25 | Infrastructure, monitoring, CI/CD |
| **QA Engineer** | 9–12 | 0.5 | Test automation, E2E, security scan |
| **Product Designer** | 3–6 | 0.25 | Design system, UX research |

**Hiring Timeline:**
- Ay 3: Backend developer (contract → full-time)
- Ay 6: Frontend developer + Product designer (contract)
- Ay 8: DevOps consultant (monthly retainer)
- Ay 9: QA engineer (contract → full-time)

### 11.8 Success Metrics & KPIs

| Kategori | KPI | Hedef (12 Ay) | Ölçüm Aracı |
|----------|-----|---------------|-------------|
| **Growth** | Monthly Active Users (MAU) | 5,000 | GA4, Clerk |
| **Growth** | Conversion Rate (Free → Pro) | %5 | Stripe, GA4 funnel |
| **Growth** | Churn Rate (aylık) | <%5 | Stripe |
| **Revenue** | MRR (Monthly Recurring Revenue) | $5,000 | Stripe Dashboard |
| **Revenue** | ARPU (Average Revenue Per User) | $50 | Stripe + internal |
| **Product** | NPS (Net Promoter Score) | >50 | Hotjar survey |
| **Product** | Feature adoption (Flow, comments) | %30 MAU | Internal analytics |
| **Engineering** | Test Coverage | %70 | Vitest + Codecov |
| **Engineering** | Deployment Frequency | 2/gün | GitHub Actions |
| **Engineering** | Mean Time To Recovery (MTTR) | <30 min | Sentry + PagerDuty |
| **Security** | Critical vulnerabilities | 0 | Snyk + ZAP |
| **Security** | SOC 2 Type II | Elde edildi | Vanta + CPA audit |
| **Performance** | LCP | <1.8s | Lighthouse CI, Web Vitals |
| **Performance** | API p99 latency | <500ms | Sentry + Prometheus |

---

## Bölüm 12: Ekler

### 12.1 Karşılaştırma Tabloları

#### Charting Kütüphaneleri

| Kütüphane | Tür | Bundle | Türkçe | A11y | Öneri |
|-----------|-----|--------|--------|------|-------|
| **Recharts** | React | ~45KB | i18n zor | Kısmen | MVP (mevcut) |
| **ECharts** | Canvas | ~120KB | Native destek | Orta | Scale + interaktivite |
| **Chart.js** | Canvas | ~60KB | Plugin | İyi | Basitlik |
| **Victory** | React | ~80KB | i18n zor | İyi | React native uyumlu |
| **Lightweight Charts** | Canvas | ~40KB | Native | Kısmen | Finansal OHLC (TradingView) |
| **Observable Plot** | D3-based | ~35KB | i18n zor | İyi | Data journalism |

**Gistify Kararı:** Mevcut Recharts ile devam; finansal OHLC grafikleri için Lightweight Charts (TradingView) entegre edilir.

#### Auth Provider'ları

| Provider | MFA | SSO | Org/RBAC | MoR | Fiyat | Öneri |
|----------|-----|-----|----------|-----|-------|-------|
| **Clerk** | Self-serve | SAML (Enterprise) | Built-in | Hayır | $25/MAU | MVP + Scale [^c1][^c2] |
| **Auth0** | TOTP/SMS | SAML/OIDC | FGA (Zanzibar) | Hayır | $0.02/MAU | Enterprise [^a1][^a2] |
| **Supabase Auth** | TOTP | SAML | RLS (DB-level) | Hayır | $25/Pro | Supabase stack |
| **Firebase Auth** | SMS | SAML | Custom claims | Hayır | Pay-as-you-go | Mobile-first |
| **Keycloak** | TOTP | SAML | RBAC | Hayır | Self-hosted | On-prem |

**Gistify Kararı:** Clerk (MVP) → Auth0 (Enterprise SSO gerektiğinde). [^c1][^a1]

#### CMS / Content Management Seçenekleri

| CMS | Headless | API | Markdown | Türkçe | Fiyat |
|-----|----------|-----|----------|--------|-------|
| **Strapi** | Evet | REST/GraphQL | Plugin | Community | Self-hosted |
| **Sanity** | Evet | GROQ | Custom | İyi | $99/ay |
| **Contentful** | Evet | REST/GraphQL | Custom | İyi | $489/ay |
| **Directus** | Evet | REST/GraphQL | Native | Community | Self-hosted |
| **Gistify Custom** | Evet | REST | Native | Native | $0 |

**Gistify Kararı:** Custom MD pipeline (mevcut) ile devam. Admin panel v2, Directus veya Strapi entegrasyonunu değerlendirir (content editor ihtiyacı artarsa).

#### Real-time Servisler

| Servis | Protokol | QoS | Presence | Fiyat | Uygunluk |
|--------|----------|-----|----------|-------|----------|
| **Supabase Realtime** | WebSocket | At-least-once | Var | Ücretsiz (200 conn) [^14] | Supabase stack |
| **Ably** | WebSocket/MQTT/SSE | At-least-once | Var | $25/ay (500 conn) [^13] | Enterprise, finansal data |
| **Pusher** | WebSocket | Fire-and-forget | Var | $19/ay (200 conn) | Basitlik |
| **Liveblocks** | WebSocket | Fire-and-forget | Var | $25/ay (500 conn) [^15] | Collaboration |
| **Cloudflare Durable Objects** | WebSocket | Strong consistency | Var | $0.12/M requests [^17] | Edge-native, stateful |

**Gistify Kararı:** Supabase Realtime (mevcut Supabase stack ile) → Ably (delivery guarantee gerektiğinde). [^14][^13]

#### Billing Platformları

| Platform | Fee | MoR | Usage Billing | B2B | Öneri |
|----------|-----|-----|-------------|-----|-------|
| **Stripe** | 2.9%+$0.30 | Hayır | Native | Güçlü | Scale, flexibility [^b1] |
| **Paddle** | 5%+$0.50 | Evet | Sınırlı | Güçlü | B2B, tax offload [^b3] |
| **Lemon Squeezy** | 5%+$0.50 | Evet | Yok | Zayıf | Indie, hızlı launch [^b2] |
| **Chargebee** | 0.75%+$0.10 | Hayır | Native | Güçlü | Enterprise billing |

**Gistify Kararı:** Stripe (Faz 1) → Paddle (Enterprise B2B custom contract). [^b1][^b3]

### 12.2 Kod Şablonları

#### Widget Component (TypeScript + React)

```typescript
// components/Widget.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const widgetVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      size: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
      variant: {
        default: 'border-border',
        premium: 'border-primary/50 ring-1 ring-primary/20',
      },
    },
    defaultVariants: { size: 'md', variant: 'default' },
  }
);

export interface WidgetProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof widgetVariants> {
  title?: string;
  description?: string;
  loading?: boolean;
}

export function Widget({ className, size, variant, title, description, loading, children, ...props }: WidgetProps) {
  return (
    <div className={cn(widgetVariants({ size, variant }), className)} {...props}>
      {title && (
        <div className="mb-2">
          <h3 className="text-sm font-semibold leading-none tracking-tight">{title}</h3>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
      )}
      {loading ? <WidgetSkeleton size={size} /> : children}
    </div>
  );
}

function WidgetSkeleton({ size }: { size?: 'sm' | 'md' | 'lg' }) {
  const heights = { sm: 'h-16', md: 'h-24', lg: 'h-32' };
  return <div className={`animate-pulse rounded bg-muted ${heights[size || 'md']}`} />;
}
```

#### Auth Middleware (Express + JWT)

```typescript
// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; tier: string; roles: string[] };
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token', code: 'TOKEN_INVALID' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.roles.some(r => roles.includes(r))) {
      return res.status(403).json({ error: 'Insufficient permissions', required: roles });
    }
    next();
  };
}

export function requireTier(minTier: 'free' | 'pro' | 'enterprise') {
  const hierarchy = { free: 0, pro: 1, enterprise: 2 };
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userLevel = hierarchy[req.user?.tier as keyof typeof hierarchy] ?? 0;
    if (userLevel < hierarchy[minTier]) {
      return res.status(403).json({ error: 'Tier upgrade required', required: minTier, current: req.user?.tier });
    }
    next();
  };
}
```

#### Paywall HOC (React)

```typescript
// components/PaywallHOC.tsx
import { useUser } from '@/hooks/useUser';
import { useContentAccess } from '@/hooks/useContentAccess';

interface WithPaywallProps {
  accessLevel: 'free' | 'member' | 'premium';
}

export function withPaywall<P extends object>(
  Component: React.ComponentType<P>,
  accessLevel: 'free' | 'member' | 'premium'
) {
  return function PaywallWrapper(props: P) {
    const { user } = useUser();
    const { hasAccess, previewContent } = useContentAccess(accessLevel);

    if (hasAccess) {
      return <Component {...props} />;
    }

    return (
      <div className="relative">
        <div className="blur-sm pointer-events-none select-none max-h-96 overflow-hidden">
          <Component {...props} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background via-background/80 to-transparent">
          <div className="text-center p-6">
            <h3 className="text-lg font-semibold mb-2">🔒 Premium İçerik</h3>
            <p className="text-muted-foreground mb-4">
              Bu içerik {accessLevel} seviyesinde erişilebilir. Mevcut plan: {user?.tier}.
            </p>
            <a href="/plans" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Planınızı Yükseltin
            </a>
          </div>
        </div>
      </div>
    );
  };
}

// Kullanım:
// const PremiumReport = withPaywall(ReportContent, 'premium');
```

#### Rate Limiter (Express + Redis)

```typescript
// middleware/rateLimiter.ts
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { Redis } from '@upstash/redis';

const redis = new Redis({ url: process.env.UPSTASH_REDIS_URL!, token: process.env.UPSTASH_REDIS_TOKEN! });

export function createRateLimiter(options: { keyPrefix: string; points: number; duration: number }) {
  const limiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: `rl:${options.keyPrefix}`,
    points: options.points,
    duration: options.duration,
  });

  return async (req: Request, res: Response, next: NextFunction) => {
    const key = req.user?.id || req.ip;
    try {
      await limiter.consume(key, 1);
      next();
    } catch (rejRes: any) {
      const retryAfter = Math.ceil(rejRes.msBeforeNext / 1000);
      res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter,
        limit: options.points,
        window: options.duration,
      });
    }
  };
}

// Tier-based composite rate limiter
export const tieredRateLimit = async (req: any, res: Response, next: NextFunction) => {
  const tier = req.user?.tier || 'free';
  const limits = {
    free: { points: 100, duration: 3600 },
    pro: { points: 10000, duration: 3600 },
    enterprise: { points: 100000, duration: 3600 },
  };
  const limit = limits[tier as keyof typeof limits];
  const limiter = createRateLimiter({ keyPrefix: `api:${tier}`, ...limit });
  return limiter(req, res, next);
};
```

### 12.3 Checklist'ler

#### Security Checklist

```
□ Auth & Session
  □ OAuth 2.1 + PKCE mandatory [^api1]
  □ JWT access token 5–15 min expiry [^api2]
  □ Refresh token rotation with family tracking [^s1][^s2]
  □ Device fingerprint binding [^s4]
  □ Absolute session limit (24h) + idle timeout (30min) [^s5]
  □ MFA/2FA for admin & enterprise [^s6]
  □ Password policy (min 12 chars, complexity, breach check)

□ API Security
  □ UUIDv7 for all resource IDs (no sequential enumeration) [^api5]
  □ BOLA prevention (resource ownership check) [^api5]
  □ Tiered rate limiting (Redis distributed) [^api3]
  □ Input validation (Zod schema) [^26]
  □ API versioning (/api/v1, /api/v2)
  □ CORS strict whitelist
  □ HSTS, CSP, X-Frame-Options headers [^26]

□ Data Security
  □ TLS 1.3 in transit
  □ Field-level encryption for PII (AES-256-GCM)
  □ Database encryption at rest (PG RDS encryption)
  □ Backup encryption (AES-256)
  □ Key rotation policy (90 gün)

□ Application Security
  □ rehype-sanitize HTML whitelist [^26]
  □ CSP headers (strict) [^26]
  □ Helmet.js middleware [^26]
  □ File upload validation (magic number, MIME, AV scan) [^26]
  □ SQL injection prevention (parameterized queries) [^26]
  □ CSRF tokens (SameSite=Strict cookies) [^26]

□ Compliance
  □ GDPR/KVKK data retention policy [^g1]
  □ Right to erasure endpoint [^g2]
  □ Consent management (cookie categories) [^g1]
  □ Data processing agreement (DPA) with vendors
  □ SOC 2 Type I audit scheduled [^g2]
  □ Penetration test (6 ayda bir)
  □ Bug bounty program (HackerOne)
```

#### Accessibility Checklist (WCAG 2.1 AA)

```
□ Perceivable
  □ Alt text for all images and charts
  □ Color contrast ≥ 4.5:1 for normal text, 3:1 for large text
  □ Colorblind-friendly signal indicators (icon + text + color) [^26]
  □ Responsive text sizing (rem units)
  □ Captions/transcripts for video content

□ Operable
  □ All interactive elements keyboard accessible (Tab, Enter, Space)
  □ Focus order logical and visible (focus-visible outline) [^26]
  □ No keyboard traps (modal focus trap excepted)
  □ Skip links for main content
  □ Enough time (no auto-refresh without control)

□ Understandable
  □ Language attribute (lang="tr" or lang="en")
  □ Consistent navigation (tab bar, breadcrumbs)
  □ Error identification and suggestion (inline validation)
  □ Labels and instructions for forms

□ Robust
  □ Valid HTML5 markup
  □ ARIA roles and labels where native semantics insufficient
  □ axe-core passing (jest-axe + Cypress axe) [^26]
  □ Lighthouse a11y score ≥ 95
  □ Screen reader test (NVDA / VoiceOver)

□ Testing
  □ Automated: axe-core in CI/CD
  □ Manual: keyboard-only navigation test
  □ Manual: screen reader test (NVDA on Windows)
  □ Manual: colorblind simulation (Chrome DevTools)
```

#### Performance Checklist

```
□ Metrics
  □ LCP < 1.8s
  □ FCP < 1.2s
  □ TTI < 2.5s
  □ TBT < 200ms
  □ CLS < 0.1
  □ INP < 200ms
  □ Bundle initial < 150KB

□ Caching
  □ CDN cache for static assets (Cloudflare)
  □ Stale-while-revalidate for API responses
  □ Redis cache for session, rate limits, feature flags
  □ Browser Service Worker cache (CacheFirst for MD, NetworkFirst for API)
  □ Database query plan cache (PostgreSQL)

□ Optimization
  □ Dynamic imports for routes and heavy libraries
  □ Code splitting (vendor chunks)
  □ Tree shaking (ES modules, sideEffects: false)
  □ Image optimization (WebP/AVIF, responsive srcset, lazy loading)
  □ Font optimization (subset, woff2, font-display: swap)
  □ Preconnect/dns-prefetch for CDN and API origins
  □ Compression (Brotli, gzip)

□ Monitoring
  □ Web Vitals RUM (Vercel Analytics + GA4)
  □ Lighthouse CI in PR pipeline
  □ Bundle size diff in PR (vite-bundle-analyzer)
  □ Performance budget enforcement (50KB max per feature)
  □ k6 load test before major releases
```

#### Launch Checklist

```
□ Pre-Launch (1 hafta önce)
  □ Staging environment smoke test
  □ E2E test suite passing (Playwright)
  □ Security scan passing (Snyk, OWASP ZAP)
  □ Lighthouse score ≥ 90 (all categories)
  □ Load test passing (k6, 100 concurrent users)
  □ Stripe test mode → live mode switch
  □ DNS & SSL certificate check (cdn.gistify.pro)
  □ Sentry DSN production environment set
  □ Analytics (GA4, Vercel) active
  □ Cookie consent banner active
  □ GDPR/KVKK privacy policy & terms published

□ Launch Day
  □ Health check endpoint returning 200
  □ Error rate < 0.1% (Sentry dashboard)
  □ API p99 latency < 500ms
  □ Stripe webhook endpoint responding 200
  □ Email delivery (signup, billing) working
  □ Social share OG tags validated (Facebook Debugger, Twitter Card Validator)
  □ Backup verification (manual restore test)

□ Post-Launch (1 hafta)
  □ Daily error review (Sentry)
  □ Analytics funnel review (GA4)
  □ Customer feedback collection (Hotjar survey)
  □ Performance RUM review (Web Vitals)
  □ Incident response drill (simulated outage)
  □ SOC 2 evidence collection start (Vanta)
```

### 12.4 Glossary: Teknik Terimler Sözlüğü

| Terim | Tanım | Türkçe Karşılık |
|-------|-------|-----------------|
| **ABAC** | Attribute-Based Access Control — kullanıcı, kaynak ve çevre niteliklerine göre yetki verir. | Nitelik Tabanlı Erişim Kontrolü |
| **BOLA** | Broken Object Level Authorization — kaynak sahipliği kontrolü eksikliğiyle yetki aşımı. | Bozuk Nesne Düzeyinde Yetkilendirme |
| **Canary Deployment** | Yeni versiyonun küçük bir kullanıcı yüzdesine (1–5%) sunulması. | Kanarya Dağıtımı |
| **CARA** | Continuous Adaptive Risk Assessment — sürekli risk değerlendirmesi. | Sürekli Uyarlanabilir Risk Değerlendirmesi |
| **CDN** | Content Delivery Network — coğrafi olarak dağıtık cache sunucuları. | İçerik Dağıtım Ağı |
| **CSP** | Content Security Policy — XSS ve data injection saldırılarını önleyen HTTP header'ı. | İçerik Güvenlik Politikası |
| **CRDT** | Conflict-free Replicated Data Type — çakışma çözümü gerektirmeyen veri yapısı. | Çakışmasız Çoğaltılmış Veri Türü |
| **DCAC** | Dynamic Context-Aware Access Controls — bağlama duyarlı dinamik yetki kontrolü. | Dinamik Bağlama Duyarlı Erişim Kontrolü |
| **Dunning** | Başarısız ödeme sonrası müşteri iletişimi ve retry süreci. | Ödeme Takip Süreci |
| **FGA** | Fine-Grained Authorization — belge düzeyinde yetki kontrolü (Zanzibar modeli). | İnce Taneli Yetkilendirme |
| **FTS5** | Full-Text Search version 5 — SQLite metin arama uzantısı. | Tam Metin Arama v5 |
| **IAP** | Identity-Aware Proxy — kimlik doğrulaması yapan ters proxy. | Kimlik Duyarlı Proxy |
| **INP** | Interaction to Next Paint — kullanıcı etkileşiminden sonraki görsel güncelleme süresi. | Bir Sonraki Boyama için Etkileşim Süresi |
| **LCP** | Largest Contentful Paint — en büyük içerik öğesinin render süresi. | En Büyük İçerikli Boyama |
| **mTLS** | Mutual TLS — iki yönlü TLS sertifika doğrulaması. | Karşılıklı TLS |
| **MoR** | Merchant of Record — satış vergisi ve compliance yükümlülüğünü üstlenen aracı. | Kayıtlı Satıcı |
| **MTTR** | Mean Time To Recovery — arızanın ortalama düzelme süresi. | Ortalama Kurtarma Süresi |
| **MoU** | Memorandum of Understanding — anlaşma muhtırası. | Anlayış Muhtırası |
| **NPS** | Net Promoter Score — müşteri sadakat ölçümü. | Net Tanıtıcı Puanı |
| **OKLCH** | Perceptually uniform color space — algısal olarak tutarlı renk uzayı. | Algısal Renk Uzayı |
| **PAM** | Privileged Access Management — ayrıcalıklı erişim yönetimi. | Ayrıcalıklı Erişim Yönetimi |
| **PII** | Personally Identifiable Information — kişisel tanımlayıcı bilgi. | Kişisel Tanımlayıcı Bilgi |
| **PKCE** | Proof Key for Code Exchange — OAuth public client'ları için güvenlik mekanizması. | Kod Değişimi İçin Kanıt Anahtarı |
| **PoP** | Point of Presence — CDN edge sunucusu konumu. | Varış Noktası |
| **RUM** | Real User Monitoring — gerçek kullanıcı tarayıcılarından metrik toplama. | Gerçek Kullanıcı İzleme |
| **ReBAC** | Relationship-Based Access Control — Google Zanzibar modeli. | İlişki Tabanlı Erişim Kontrolü |
| **RBAC** | Role-Based Access Control — rol tabanlı yetki kontrolü. | Rol Tabanlı Erişim Kontrolü |
| **SaaS** | Software as a Service — bulut tabanlı yazılım hizmeti. | Hizmet olarak Yazılım |
| **SAML** | Security Assertion Markup Language — enterprise SSO standardı. | Güvenlik Onaylama İşaretleme Dili |
| **SWR** | Stale-While-Revalidate — eski veriyi gösterip arka planda yenileme. | Eski Veriyi Gösterirken Yenileme |
| **TBT** | Total Blocking Time — ana thread'in bloke olduğu toplam süre. | Toplam Bloklama Süresi |
| **TTI** | Time to Interactive — sayfanın tam etkileşimli hale gelme süresi. | Etkileşim Süresi |
| **UEBA** | User and Entity Behavior Analytics — kullanıcı davranış analizi. | Kullanıcı ve Varlık Davranış Analizi |
| **UUIDv7** | Universally Unique Identifier version 7 — zaman sıralı UUID. | Evrensel Benzersiz Tanımlayıcı v7 |
| **WAF** | Web Application Firewall — uygulama katmanı güvenlik duvarı. | Web Uygulama Güvenlik Duvarı |
| **WAL** | Write-Ahead Logging — veritabanı değişiklik öncesi log yazma. | Önceden Yazma Günlüğü |
| **WCAG** | Web Content Accessibility Guidelines — web erişilebilirlik kılavuzu. | Web İçeriği Erişilebilirlik Kılavuzu |
| **Zero Trust** | "Asla güvenme, her zaman doğrula" güvenlik modeli. | Sıfır Güven |

---

## Referanslar

### Güvenlik & Auth Araştırması (gistify_security_auth_research.md)

[^c1]: Clerk Official Website, https://clerk.com/, 2026-06-12.  
[^c2]: Theo - t3.gg quoted on Clerk site, https://clerk.com/, 2024.  
[^c3]: Clerk Official Website, https://clerk.com/, 2026-06-12.  
[^c4]: Clerk Official Website, https://clerk.com/, 2026-06-12.  
[^a1]: checkthat.ai, "Auth0 vs Okta: Choose Your Identity Platform", https://checkthat.ai/compare/auth0-vs-okta-2, 2026-04-17.  
[^a2]: checkthat.ai, "Auth0 vs Okta", https://checkthat.ai/compare/auth0-vs-okta-2, 2026-04-17.  
[^a3]: checkthat.ai / Okta, "Auth0 vs Okta", https://checkthat.ai/compare/auth0-vs-okta-2, 2026-04-17.  
[^a4]: Okta, "Getting Your Apps Enterprise-Ready Using Auth0 Tools", https://www.okta.com/sites/default/files/2024-11/Getting_Your_Apps_Enterprise_Ready.pdf, 2024-11.  
[^a5]: siit.io, "Auth0 vs Ping Identity", https://www.siit.io/tools/comparison/auth0-vs-ping-identity, 2024-05-03.  
[^b1]: blog.vibecoder.me, "Stripe vs Lemon Squeezy vs Paddle", https://blog.vibecoder.me/stripe-vs-lemon-squeezy-vs-paddle, 2026-04-05.  
[^b2]: blog.vibecoder.me, "Stripe vs Lemon Squeezy vs Paddle", https://blog.vibecoder.me/stripe-vs-lemon-squeezy-vs-paddle, 2026-04-05.  
[^b3]: blog.vibecoder.me, "Stripe vs Lemon Squeezy vs Paddle", https://blog.vibecoder.me/stripe-vs-lemon-squeezy-vs-paddle, 2026-04-05.  
[^b4]: fungies.io, "Paddle vs Lemon Squeezy", https://fungies.io/paddle-vs-lemon-squeezy/, 2026-04-12.  
[^b5]: mrrscout.com, "Payment Processors Indie Hackers 2026", https://mrrscout.com/blog/payment-processors-indie-hackers-2026, 2026-03-09.  
[^r1]: Supertokens, "RBAC vs ABAC", https://supertokens.com/blog/what-is-roles-based-access-control-vs-abac, 2024-07-07.  
[^r2]: RedHat, "What is RBAC", https://www.redhat.com/en/topics/security/what-is-role-based-access-control, 2024-05-14.  
[^r3]: LibHunt / OpenFGA, https://www.libhunt.com/topic/abac, 2025-03-06.  
[^r4]: LibHunt / Casbin, https://www.libhunt.com/topic/abac, 2025-03-06.  
[^r5]: Pathlock, "RBAC Comprehensive Guide", https://pathlock.com/blog/role-based-access-control-rbac/, 2026-03-05.  
[^g1]: trusteraai.com, "AI Security Compliance Tools 2026", https://trusteraai.com/ai-security-compliance-tools-for-saas-startups/, 2026-05-07.  
[^g2]: strac.io, "SOC 2 Compliance Software 2026", https://www.strac.io/blog/soc-2-compliance-software, 2026-06-06.  
[^g3]: trusteraai.com, "AI Security Compliance Tools 2026", https://trusteraai.com/ai-security-compliance-tools-for-saas-startups/, 2026-05-07.  
[^g4]: vanta.com, "Vanta vs Drata vs AuditBoard", https://www.vanta.com/resources/vanta-vs-drata-vs-auditboard, 2026-06-01.  
[^g5]: trusteraai.com, "AI Security Compliance Tools 2026", https://trusteraai.com/ai-security-compliance-tools-for-saas-startups/, 2026-05-07.  
[^z1]: keypasco.com, "Zero Trust Architecture 2025", https://www.keypasco.com/en/what-is-zero-trust-architecture-why-every-business-needs-a-zero-trust-strategy-in-2025/, 2026-03-16.  
[^z2]: IJCAT, "Zero Trust Enforcement Using Microsegmentation", https://ijcat.com/archieve/volume14/issue7/ijcatr14071006.pdf, 2025-07-14.  
[^z3]: Code Ninety, "Zero Trust Architecture", https://codeninety.com/trust-center/access-control, 2025.  
[^z4]: TU Delft Repository, "Micro-Segmentation for Zero Trust", https://repository.tudelft.nl/file/File_c02962fc-d399-4f37-8cf4-f8bc85eb68d8?preview=1, 2025.  
[^api1]: daily.dev, "OAuth 2.1, JWT Best Practices", https://daily.dev/blog/dev-guide-api-security-oauth-2-1-jwt-vulnerabilities/, 2026-05-25.  
[^api2]: daily.dev, "OAuth 2.1, JWT Best Practices", https://daily.dev/blog/dev-guide-api-security-oauth-2-1-jwt-vulnerabilities/, 2026-05-25.  
[^api3]: daily.dev, "OAuth 2.1, JWT Best Practices", https://daily.dev/blog/dev-guide-api-security-oauth-2-1-jwt-vulnerabilities/, 2026-05-25.  
[^api4]: zuplo.com, "Top 7 API Authentication Methods", https://zuplo.com/learning-center/top-7-api-authentication-methods-compared, 2025-01-03.  
[^api5]: daily.dev, "OAuth 2.1, JWT Best Practices", https://daily.dev/blog/dev-guide-api-security-oauth-2-1-jwt-vulnerabilities/, 2026-05-25.  
[^p1]: evolok.com, "5 Proven Paywall Models", https://www.evolok.com/blog/5-proven-paywall-models-that-drive-digital-subscription-growth-for-publishers, 2025-07-01.  
[^p2]: pugpig.com, "How apps can shape the next phase of subscription strategy", https://www.pugpig.com/2026/05/28/how-apps-can-shape-the-next-phase-of-subscription-strategy/, 2026-05-28.  
[^p3]: theaudiencers.com, "What is a dynamic paywall?", https://theaudiencers.com/what-is-a-dynamic-paywall/, 2025-08-19.  
[^p4]: theaudiencers.com, "What is a dynamic paywall?", https://theaudiencers.com/what-is-a-dynamic-paywall/, 2025-08-19.  
[^p5]: leakypaywall.com, "Best Paywall Providers 2025", https://leakypaywall.com/best-paywall-providers-for-publishers/, 2025-09-17.  
[^f1]: octopus.com, "9 Feature Flag Tools 2025", https://octopus.com/devops/feature-flags/feature-flag-tools/, 2026-06-12.  
[^f2]: aeo.sig.ai, "Flagsmith Market Signal", https://aeo.sig.ai/brands/flagsmith, 2026-03-29.  
[^f3]: octopus.com, "9 Feature Flag Tools 2025", https://octopus.com/devops/feature-flags/feature-flag-tools/, 2026-06-12.  
[^f4]: atticusli.com, "Feature Flags vs A/B Tests", https://atticusli.com/blog/posts/feature-flags-vs-ab-tests-canary-deployment/, 2026-03-29.  
[^f5]: atticusli.com, "Feature Flags vs A/B Tests", https://atticusli.com/blog/posts/feature-flags-vs-ab-tests-canary-deployment/, 2026-03-29.  
[^s1]: webline.global, "Why Your JWT Refresh Token Rotation Still Leaks", https://webline.global/posts/why-your-jwt-refresh-token-rotation-still-leaks-session-hijacks/, 2026-05-29.  
[^s2]: webline.global, "Why Your JWT Refresh Token Rotation Still Leaks", https://webline.global/posts/why-your-jwt-refresh-token-rotation-still-leaks-session-hijacks/, 2026-05-29.  
[^s3]: Auth0 Docs, "Refresh Token Rotation", https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation, 2026.  
[^s4]: webline.global, "Why Your JWT Refresh Token Rotation Still Leaks", https://webline.global/posts/why-your-jwt-refresh-token-rotation-still-leaks-session-hijacks/, 2026-05-29.  
[^s5]: webline.global, "Why Your JWT Refresh Token Rotation Still Leaks", https://webline.global/posts/why-your-jwt-refresh-token-rotation-still-leaks-session-hijacks/, 2026-05-29.  
[^s6]: certera.com, "Ransomware Key Insights 2024", https://certera.com/blog/ransomware-key-insights-2024-and-essential-defense-strategies-for-2025/, 2025-01-17.

### Social & Edge Araştırması (gistify_social_edge_research.md)

[^1]: Business Model Canvas, "How Does Stocktwits Company Work?", 2024-12-19.  
[^2]: Business Model Canvas, "Stocktwits: Business Model Canvas", 2024-11-28.  
[^3]: Business Model Canvas, "Stocktwits: Business Model Canvas", 2024-11-28.  
[^4]: PR Newswire, "Stocktwits Launches Cryptotwits", 2025-05-12.  
[^5]: BrokerChooser, "eToro Copy Trading — CopyTrader in Detail", 2025-08-26.  
[^6]: CopyTrader.org, "eToro Copy trading system review 2024", 2024-02-23.  
[^7]: Appinventiv, "Cost to Build a Trading App like eToro", 2025-09-17.  
[^8]: CopyTrader.org, "eToro Copy trading system review 2024", 2024-02-23.  
[^9]: arXiv, "Mind Your Ps and Qs: Supporting Positive Reinforcement in Moderation Through a Positive Queue", 2025.  
[^10]: arXiv, "Think about it like you're a firefighter: Understanding How Reddit Moderators Use the Modqueue", 2025-06-21.  
[^11]: Reddit mimarisi literatürü (indirekt, arXiv moderation papers).  
[^12]: Cloudflare Blog, "Cloudflare acquires PartyKit", 2024-04-05.  
[^13]: BuildMVPFast, "Pusher vs Ably (2026): Realtime Messaging Comparison", 2026-02-01.  
[^14]: BuildMVPFast, "Pusher vs Ably (2026)", 2026-02-01.  
[^15]: Ably, "Liveblocks Broadcast vs Supabase Realtime".  
[^16]: Digital Applied, "Edge Computing: Cloudflare Workers Dev Guide 2026", 2026-01-14.  
[^17]: Architecting on Cloudflare, "Chapter 6: Durable Objects", 2026-04-02.  
[^18]: Architecting on Cloudflare, "Chapter 6: Durable Objects", 2026-04-02.  
[^19]: 10x.pub, "Serverless 2.0: Durable Functions and Stateful Edge", 2026-02-12.  
[^20]: SocialRails, "What Is the Fediverse?", 2026-01.  
[^21]: Fediview, "Lemmy and Decentralized Forums", 2026-04-15.  
[^22]: Fediview, "Lemmy and Decentralized Forums", 2026-04-15.  
[^23]: EPFL Digital Finance, "StockTwits classified sentiment and stock returns", 2024.  
[^24]: PMC, "Stock price movement prediction based on Stocktwits investor sentiment using FinBERT and ensemble SVM", 2023-2024.  
[^25]: Apify, "Stocktwits Scraper — Extract Stock Sentiment & Messages", 2026-05-12.  
[^26]: LogRocket, "Offline-first frontend apps in 2025", 2026-03-27.  
[^27]: LogRocket, "Offline-first frontend apps in 2025", 2026-03-27.  
[^28]: awesome-local-first (GitHub), 2025-01-06.  
[^29]: awesome-local-first (GitHub), 2025-01-06.  
[^30]: Locize, "Offline-First Apps: Architecture, Frameworks & Real Examples", 2025-10-01.  
[^31]: System Design Handbook, "Design Live Comment System: A Complete Guide", 2026-02-27.  
[^32]: System Design Handbook, "Design Live Comment System", 2026-02-27.  
[^33]: n8n, "Moderate Facebook comments with AI", 2025-12-11.  
[^34]: BuildMVPFast, "Best Firebase FCM Alternatives (2026)", 2026-06-06.  
[^35]: Sashido, "Push Notifications at Scale: FCM vs OneSignal Explained", 2026-03-09.  
[^36]: Knock.app, "Firebase FCM vs OneSignal | Push API benchmarks", 2026-06-11.  
[^37]: Knock.app, "Firebase FCM vs OneSignal", 2026-06-11.


### 7.6 Revenue Recognition & Dunning Management (Detaylı)

Stripe Revenue Recognition, ASC 606 / IFRS 15 uyumlu revenue amortization sağlar. Subscription revenue, service period boyunca eşit olarak dağıtılır. Metered revenue (API call-based), kullanım gerçekleştikçe recognized edilir.

```typescript
// Revenue recognition helper (Stripe Revenue Recognition API)
import Stripe from 'stripe';

export async function createRevenueRecognitionSchedule(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const items = subscription.items.data;

  for (const item of items) {
    const price = await stripe.prices.retrieve(item.price.id);
    const product = await stripe.products.retrieve(price.product as string);

    // Revenue recognition rule
    if (product.metadata.recognition_type === 'subscription') {
      // Amortize over subscription period
      await stripe.billing.meterEvents.create({
        event_name: 'revenue.recognized',
        payload: {
          stripe_customer_id: subscription.customer as string,
          value: (item.amount_total! / 100).toString(),
          currency: item.currency,
          period_start: subscription.current_period_start.toString(),
          period_end: subscription.current_period_end.toString(),
        },
      });
    }
  }
}
```

**Dunning Management:** Stripe Smart Retries, başarısız ödeme sonrası optimal retry zamanlamasını (ML-based) belirler. Gistify, 4 retry schedule kullanır: [^b3]

```
Retry 1: 1 gün sonra (email: "Ödeme sorunu — kartınızı güncelleyin")
Retry 2: 3 gün sonra (email: "Erişiminiz askıya alınacak — güncelleme yapın")
Retry 3: 5 gün sonra (email: "Son uyarı — hesabınız free tier'a düşürülecek")
Retry 4: 7 gün sonra (grace period sonu — downgrade to free + data retention warning)
```

```typescript
// Custom dunning email handler
async function sendDunningEmail(customerId: string, attempt: number, invoiceUrl: string) {
  const templates = [
    { subject: 'Ödeme sorunu tespit edildi', body: 'Kartınızı güncelleyin...' },
    { subject: 'Erişiminiz askıya alınacak', body: '3 gün içinde güncelleme yapın...' },
    { subject: 'Son uyarı: Hesabınız düşürülecek', body: '7 gün içinde işlem yapın...' },
  ];

  const template = templates[attempt - 1] || templates[2];
  await sendEmail({
    to: customerId,
    subject: template.subject,
    html: template.body + `<br><a href="${invoiceUrl}">Faturayı görüntüle</a>`,
  });
}
```

---

## Bölüm 8: Gelişmiş Güvenlik & Compliance (Genişletilmiş)

### 8.9 Data Protection Impact Assessment (DPIA) ve Data Mapping

GDPR Article 35 gereği, yüksek riskli işlemler için DPIA zorunludur. Gistify için DPIA kapsamı: kullanıcı profilleme (dynamic paywall), otomatik karar alma (AI-driven content recommendation), ve üçüncü taraf veri paylaşımı (Stripe, Clerk, analytics). [^g1]

```typescript
// Data mapping registry (internal tracking)
interface DataFlow {
  dataSubject: 'user' | 'visitor' | 'admin';
  dataCategory: 'PII' | 'financial' | 'behavioral' | 'technical';
  processingPurpose: 'authentication' | 'billing' | 'analytics' | 'personalization';
  lawfulBasis: 'consent' | 'contract' | 'legitimate_interest' | 'legal_obligation';
  retentionDays: number;
  thirdParties: string[];
  encryptionAtRest: boolean;
  encryptionInTransit: boolean;
}

const dataMap: DataFlow[] = [
  {
    dataSubject: 'user',
    dataCategory: 'PII',
    processingPurpose: 'authentication',
    lawfulBasis: 'contract',
    retentionDays: 365 * 5, // Account active + 5 years
    thirdParties: ['Clerk', 'Auth0'],
    encryptionAtRest: true,
    encryptionInTransit: true,
  },
  {
    dataSubject: 'user',
    dataCategory: 'financial',
    processingPurpose: 'billing',
    lawfulBasis: 'contract',
    retentionDays: 365 * 7, // Tax compliance
    thirdParties: ['Stripe'],
    encryptionAtRest: true,
    encryptionInTransit: true,
  },
  {
    dataSubject: 'visitor',
    dataCategory: 'behavioral',
    processingPurpose: 'analytics',
    lawfulBasis: 'consent',
    retentionDays: 365,
    thirdParties: ['Google Analytics', 'Vercel'],
    encryptionAtRest: false, // Aggregated
    encryptionInTransit: true,
  },
];
```

### 8.10 Incident Response Plan (IRP)

SOC 2 CC7.2 gereği, security incident response plan dokümante edilmelidir. Gistify IRP 6 aşamadır:

1. **Preparation:** Sentry alerting, Slack #security-incidents kanalı, on-call rotation (PagerDuty).
2. **Identification:** Sentry + custom anomaly detection (p99 latency spike, error rate >1%, unauthorized access pattern).
3. **Containment:** Feature flag kill switch (instant disable), WAF rule deployment (Cloudflare), database connection cut (PgBouncer).
4. **Eradication:** Vulnerable dependency remove (Snyk auto-PR), patch deploy, token revocation.
5. **Recovery:** Canary deploy (%5), monitoring, gradual rollback or full deploy.
6. **Lessons Learned:** Post-mortem doc (24h içinde), action items, policy update.

```yaml
# incident-response.yml (template)
incident_severity:
  SEV1: "Customer data breach, full outage, RCE"
  SEV2: "Partial outage, performance degradation, auth bypass"
  SEV3: "Non-critical bug, UI issue, minor security finding"

response_time:
  SEV1: "15 min acknowledge, 1 hour resolution target"
  SEV2: "30 min acknowledge, 4 hour resolution target"
  SEV3: "2 hour acknowledge, 24 hour resolution target"

communication:
  internal: "Slack #security-incidents + PagerDuty"
  external: "Status page (status.gistify.pro) + email to affected users"
  regulatory: "72h GDPR notification if PII breach"
```

---

## Bölüm 9: Gelişmiş Performans & Ölçeklendirme (Genişletilmiş)

### 9.9 Database Query Optimization & Index Strategy

PostgreSQL'e geçiş sonrası query performance, index ve partition stratejisiyle optimize edilir.

```sql
-- Gistify PostgreSQL index strategy
-- 1. Composite index for content queries (most common)
CREATE INDEX idx_content_registry_route_status_lang
ON content_registry(route, status, language, published_at DESC);

-- 2. Partial index for active subscriptions (fast lookup)
CREATE INDEX idx_subscriptions_active_user
ON subscriptions(user_id, tier, status)
WHERE status = 'active';

-- 3. GIN index for JSONB metadata (if used)
CREATE INDEX idx_content_meta_gin ON content_registry USING GIN (metadata);

-- 4. BRIN index for time-series logs (low cardinality, high volume)
CREATE INDEX idx_usage_logs_brin ON usage_logs USING BRIN (created_at);

-- 5. Full-text search (tsvector for Turkish content)
ALTER TABLE content_registry ADD COLUMN search_vector tsvector;
CREATE INDEX idx_content_fts ON content_registry USING GIN (search_vector);

-- Trigger to maintain tsvector
CREATE OR REPLACE FUNCTION content_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('turkish', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('turkish', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('turkish', coalesce(NEW.content, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER content_search_trigger
BEFORE INSERT OR UPDATE ON content_registry
FOR EACH ROW EXECUTE FUNCTION content_search_update();
```

```typescript
// Query optimization — parameterized search with pagination
export async function searchContent(
  query: string,
  route: string,
  language: string = 'tr',
  page: number = 1,
  pageSize: number = 20
) {
  const offset = (page - 1) * pageSize;

  // Use tsquery for full-text search
  const searchQuery = query
    .split(/\s+/)
    .map(term => `${term}:*`)
    .join(' & ');

  const result = await pgPool.query(
    `SELECT id, slug, title, description, published_at,
            ts_rank_cd(search_vector, query, 32) as rank
     FROM content_registry,
          plainto_tsquery('turkish', $1) as query
     WHERE search_vector @@ query
       AND route = $2
       AND language = $3
       AND status = 'published'
     ORDER BY rank DESC, published_at DESC
     LIMIT $4 OFFSET $5`,
    [searchQuery, route, language, pageSize, offset]
  );

  return result.rows;
}
```

### 9.10 Monitoring & Alerting Stack (Prometheus + Grafana)

Production monitoring, Prometheus metrics + Grafana dashboard + Alertmanager ile yapılır.

```typescript
// Prometheus metrics registration
import prometheus from 'prom-client';

const httpRequestDuration = new prometheus.Histogram({
  name: 'gistify_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code', 'tier'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
});

const dbQueryDuration = new prometheus.Histogram({
  name: 'gistify_db_query_duration_seconds',
  help: 'Database query duration',
  labelNames: ['query_name', 'table'],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.5],
});

const activeSubscriptions = new prometheus.Gauge({
  name: 'gistify_active_subscriptions',
  help: 'Number of active subscriptions by tier',
  labelNames: ['tier'],
});

// Middleware to record metrics
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.observe(
      { method: req.method, route: req.route?.path || 'unknown', status_code: res.statusCode, tier: req.user?.tier || 'anonymous' },
      duration
    );
  });
  next();
});

// Metrics endpoint for Prometheus scraping
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});
```

```yaml
# alertmanager.yml
routes:
  - match:
      severity: critical
    receiver: slack-critical
    continue: true
  - match:
      severity: warning
    receiver: slack-warning

receivers:
  - name: slack-critical
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/...'
        channel: '#gistify-alerts'
        title: 'CRITICAL: {{ .GroupLabels.alertname }}'
        text: '{{ .Annotations.summary }}'

  - name: slack-warning
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/...'
        channel: '#gistify-warnings'
        title: 'WARNING: {{ .GroupLabels.alertname }}'
```

---

## Bölüm 10: Gelişmiş Test & Kalite Güvencesi (Genişletilmiş)

### 10.8 Contract Testing (Pact)

Microservices veya modüler backend'e geçişte, API contract test'leri Pact ile yönetilir. Consumer-driven contract testing, frontend (consumer) ve backend (provider) arasındaki anlaşmayı otomatik olarak doğrular.

```typescript
// Pact consumer test (Vitest + @pact-foundation/pact)
import { PactV3 } from '@pact-foundation/pact';
import { describe, it, expect } from 'vitest';

const provider = new PactV3({
  consumer: 'GistifyWeb',
  provider: 'GistifyAPI',
  dir: './pacts',
});

describe('GET /api/content/:route', () => {
  it('returns content list for authenticated user', async () => {
    await provider
      .given('content exists for momentum route')
      .uponReceiving('a request for momentum content')
      .withRequest({
        method: 'GET',
        path: '/api/content/momentum',
        headers: { Authorization: 'Bearer valid-token' },
      })
      .willRespondWith({
        status: 200,
        body: {
          items: [
            { slug: 'haziran-2026', title: 'Haziran 2026 Momentum', accessLevel: 'free' },
          ],
        },
      });

    await provider.executeTest(async (mockServer) => {
      const res = await fetch(`${mockServer.url}/api/content/momentum`, {
        headers: { Authorization: 'Bearer valid-token' },
      });
      const data = await res.json();
      expect(data.items[0].slug).toBe('haziran-2026');
    });
  });
});
```

### 10.9 Mutation Testing (Stryker)

Mutation testing, test suite'in kalitesini ölçer: kodda bilinçli "mutation" (hata) eklenir, test'ler bunu yakalarsa "killed", yakalayamazsa "survived". Hedef: %70+ mutation score.

```javascript
// stryker.config.js
module.exports = {
  testRunner: 'vitest',
  coverageAnalysis: 'perTest',
  reporters: ['html', 'clear-text', 'progress'],
  mutate: ['src/**/*.ts', '!src/**/*.test.ts', '!src/**/*.spec.ts'],
  thresholds: { high: 80, low: 60, break: 50 },
  vitest: {
    configFile: 'vitest.config.ts',
  },
};
```

---

## Bölüm 11: Gelişmiş Strateji, Roadmap & Kaynak Planlaması (Genişletilmiş)

### 11.9 Quarterly OKR'ler (Objectives & Key Results)

**Q1 OKR:**
- O1: Foundation Infrastructure
  - KR1: Dynamic MD system %100 production-ready (0 critical bug)
  - KR2: Auth v2 (Clerk) migration, SSO ready for SAML
  - KR3: SQLite → PostgreSQL shadow write active, <1% data inconsistency

**Q2 OKR:**
- O1: Monetization & Compliance
  - KR1: Stripe billing live, first $1,000 MRR
  - KR2: SOC 2 Type I audit passed
  - KR3: Paywall v2 dynamic (AI-driven) A/B test başlatılır

**Q3 OKR:**
- O1: Growth & Engagement
  - KR1: FlowPage (social layer) live, 100+ daily comments
  - KR2: Edge computing (Cloudflare Workers) API gateway active
  - KR3: Dynamic paywall conversion uplift %20 (vs static)

**Q4 OKR:**
- O1: Enterprise Ready
  - KR1: Enterprise tier 5+ paying customers
  - KR2: SOC 2 Type II audit passed
  - KR3: Public API v1 (OpenAPI 3.0 spec) documented & live

### 11.10 Resource Allocation by Quarter

| Quarter | Engineering | Design | QA | DevOps | Compliance | Total FTE |
|---------|-------------|--------|-----|--------|------------|-----------|
| Q1 | 1.5 | 0.25 | 0 | 0 | 0.1 | 1.85 |
| Q2 | 2.0 | 0.25 | 0.25 | 0.25 | 0.25 | 3.0 |
| Q3 | 2.5 | 0.5 | 0.5 | 0.5 | 0.1 | 4.1 |
| Q4 | 3.0 | 0.5 | 0.5 | 0.5 | 0.25 | 4.75 |

**Burn Rate Estimate:**
- Average blended monthly cost per FTE: $4,000 (Turkey-based remote)
- Q4 peak burn: 4.75 × $4,000 = $19,000/month
- Infrastructure: $800/month
- **Total monthly burn (Q4): ~$20,000**
- 12-month runway with $250K seed: comfortable

### 11.11 Competitive Positioning Matrix

| Dimension | Gistify (MVP) | StockTwits | eToro | Finviz | Koyfin |
|-----------|---------------|------------|-------|--------|--------|
| **Real-time Social** | FlowPage (Q3) | 10M users, cashtag [^1] | CopyTrader [^5] | Forum | Limited |
| **AI Sentiment** | Planned (Q3) | %92 bot detection, 0.38 correlation [^2] | Risk Score [^6] | N/A | N/A |
| **Paywall Model** | Metered + Dynamic (Q2) | Ad-supported + Pro | Spread | Freemium | Freemium + Pro |
| **Turkish Market** | Native | English only | Multi-lang | English | English |
| **Data Depth** | Momentum + Earnings + Daily | Social sentiment | Social trading | Technical | Fundamental |
| **API Access** | Enterprise (Q4) | Data-feed ($18.5M ARR) [^2] | Limited | N/A | Limited |

Gistify'nin differentiation: Turkish market focus + AI-driven dynamic paywall + offline-first PWA + modular content pipeline.

---

## Bölüm 12: Ekler (Genişletilmiş)

### 12.5 Ek Kod Şablonları

#### Database Migration Template (Knex.js)

```typescript
// migrations/20240613120000_create_subscriptions.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('subscriptions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().unique().references('id').inTable('users');
    table.string('stripe_subscription_id').unique();
    table.enum('tier', ['free', 'pro', 'enterprise']).notNullable().defaultTo('free');
    table.enum('status', ['active', 'canceled', 'past_due', 'trialing']).notNullable().defaultTo('active');
    table.timestamp('current_period_start');
    table.timestamp('current_period_end');
    table.timestamp('canceled_at');
    table.timestamp('grace_period_until');
    table.timestamps(true, true);

    table.index(['status', 'tier']);
    table.index('current_period_end');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('subscriptions');
}
```

#### Webhook Signature Verification (Stripe)

```typescript
// Stripe webhook signature verification
import Stripe from 'stripe';
import { createHmac } from 'crypto';

export function verifyStripeWebhook(payload: string, signature: string, secret: string): Stripe.Event {
  const sig = signature;
  const event = stripe.webhooks.constructEvent(payload, sig, secret);
  return event;
}

// Express handler
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  try {
    const event = verifyStripeWebhook(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    handleStripeEvent(event);
    res.json({ received: true });
  } catch (err) {
    res.status(400).json({ error: 'Invalid signature' });
  }
});
```

#### Feature Flag Hook (React)

```typescript
// hooks/useFeatureFlag.ts
import { useQuery } from '@tanstack/react-query';

export function useFeatureFlag(flagName: string): { enabled: boolean; variant?: string; loading: boolean } {
  const { data, isLoading } = useQuery({
    queryKey: ['feature-flag', flagName],
    queryFn: async () => {
      const res = await fetch(`/api/feature-flags/${flagName}`);
      return res.json();
    },
    staleTime: 60 * 1000, // 1 min
  });

  return { enabled: data?.enabled ?? false, variant: data?.variant, loading: isLoading };
}

// Kullanım
function ContentPage() {
  const { enabled, variant } = useFeatureFlag('dynamic-paywall-v2');
  if (enabled && variant === 'treatment') {
    return <DynamicPaywall />;
  }
  return <StaticPaywall />;
}
```

#### Error Boundary (React + Sentry)

```typescript
// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-600">Bir hata oluştu</h2>
          <p className="text-muted-foreground mt-2">
            Sayfa yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Yenile
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### 12.6 Teknoloji Stack Özeti (Final Architecture)

| Katman | Teknoloji | Alternatif | Karar |
|--------|-----------|------------|-------|
| **Frontend** | React 18 + Vite + TypeScript | Next.js | Vite (SPA, hızlı build) |
| **UI Kit** | shadcn/ui + Tailwind CSS | Chakra UI | shadcn/ui (Radix primitives) |
| **State** | Zustand + TanStack Query | Redux + RTK | Zustand (hafif, atomic) |
| **Routing** | Wouter | React Router | Wouter (mevcut) |
| **Backend** | Express + TypeScript | Fastify | Express (mevcut) |
| **Database** | PostgreSQL (Neon) | CockroachDB | PostgreSQL (SQLite migration) |
| **Cache** | Upstash Redis | Redis Cloud | Upstash (serverless) |
| **Auth** | Clerk | Auth0 | Clerk (MVP) → Auth0 (Enterprise) |
| **Billing** | Stripe | Paddle | Stripe (MVP) → Paddle (Enterprise) |
| **CDN** | Cloudflare | AWS CloudFront | Cloudflare (edge, WAF) |
| **Hosting** | Vercel | Netlify | Vercel (preview, analytics) |
| **Real-time** | Supabase Realtime | Ably | Supabase (MVP) → Ably (scale) |
| **Monitoring** | Sentry + Vercel Analytics | Datadog | Sentry + Vercel + Prometheus |
| **Testing** | Vitest + Playwright | Jest + Cypress | Vitest (Vite native) |
| **CI/CD** | GitHub Actions | GitLab CI | GitHub Actions (mevcut) |
| **Compliance** | Vanta | Drata | Vanta (hızlı SOC 2) |
| **Feature Flags** | Flagsmith (self-hosted) | LaunchDarkly | Flagsmith (open source) |
| **Search** | PostgreSQL tsvector | Meilisearch | PG tsvector (MVP) → Meilisearch (scale) |
| **i18n** | react-i18next | FormatJS | react-i18next (TR + EN) |
| **Charts** | Recharts + Lightweight Charts | ECharts | Recharts (MVP) + Lightweight (OHLC) |
| **Markdown** | unified + rehype-sanitize | Marked | unified (AST pipeline) |

---

> **Rapor Sonu.** Bu belge, Gistify projesinin 12 aylık teknik stratejisini, güvenlik ve compliance yol haritasını, performans ölçeklendirme planını, test & kalite güvence süreçlerini, detaylı karşılaştırma tablolarını ve implementasyon odaklı kod şablonlarını içermektedir. Tüm kararlar, Haziran 2026 itibarıyla yapılan internet araştırmasına dayalıdır ve [^id] citation formatıyla kaynak gösterilmiştir.


> **Ek Not:** Bu rapor, Gistify proje ekibi için hazırlanmış teknik bir strateji dokümanıdır. Tüm kararlar, araştırma bulgularına dayalıdır ve implementasyon öncesi tekrar değerlendirilmelidir. Son güncelleme: 2026-06-13.


---

> **Version:** 1.0  
> **Author:** Teknik Yazar & Güvenlik Analisti  
> **Status:** Final Review  
> **Next Review:** 2026-09-13
