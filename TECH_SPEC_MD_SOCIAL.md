# Bölüm 14: API Endpoint'leri & Veri Modeli

## 14.1 Content API (MD Yönetimi)

Tüm endpoint'ler `server/index.ts` içinde Express router olarak tanımlanır. Auth middleware mevcut `readAuthPayload()` fonksiyonunu kullanır. Admin kontrolü mevcut `getWeeklyReportAdminEmail()` + `getWeeklyReportAdminSecret()` veya `Authorization: Bearer <admin-secret>` header'ı ile yapılır.

| Method | Endpoint | Açıklama | Request Body | Response | Auth |
|---|---|---|---|---|---|
| `GET` | `/api/content/:route` | Route altındaki tüm MD dosyalarını meta veriyle listele | — | `{ items: ContentMeta[] }` | Guest+ (public route'lar), Member+ (kısıtlı route'lar) |
| `GET` | `/api/content/:route/:slug` | Belirli MD dosyasını getir (full content + frontmatter) | — | `{ meta: ContentMeta, content: string, frontmatter: object }` | Guest+ |
| `POST` | `/api/content/:route` | Yeni MD dosyası yükle (YAML frontmatter + Markdown body) | `{ slug, title, description?, category?, tags?, frontmatter?, body }` | `{ slug, route, status: "draft" }` | Admin only |
| `PUT` | `/api/content/:route/:slug` | MD dosyasını güncelle (full replace) | `{ title?, description?, category?, tags?, frontmatter?, body, status? }` | `{ slug, route, version, updatedAt }` | Admin only |
| `DELETE` | `/api/content/:route/:slug` | MD dosyasını soft-delete yap (status: deleted) | — | `{ slug, deleted: true }` | Admin only |
| `POST` | `/api/content/:route/:slug/publish` | Publish status'ünü değiştir (draft ↔ published) | `{ status: "published" \| "draft" }` | `{ slug, status, publishedAt? }` | Admin only |
| `GET` | `/api/content/:route/:slug/history` | Versiyon geçmişini listele | — | `{ versions: Version[] }` | Admin only |
| `GET` | `/api/content/search` | Tüm route'lar içinde full-text arama | `?q=query&route=flow&limit=20` | `{ results: SearchResult[] }` | Guest+ |
| `GET` | `/api/content/tags` | Tüm kullanılan tag'leri ve kullanım sayılarını listele | — | `{ tags: { tag, count }[] }` | Guest+ |
| `GET` | `/api/content/:route/tags/:tag` | Tag bazlı filtreleme | `?sort=createdAt&order=desc&page=1` | `{ items: ContentMeta[] }` | Guest+ |

### 14.1.1 Request/Response Örnekleri

**GET /api/content/flow**
```json
{
  "items": [
    {
      "slug": "meta-guncel-durum-raporu-11haziran2026",
      "route": "flow",
      "title": "META Güncel Durum Raporu",
      "description": "11 Haziran 2026 META teknik ve temel analiz",
      "category": "Teknik Rapor",
      "tags": ["META", "FANG", "Teknik Analiz"],
      "author": "admin@gistify.pro",
      "status": "published",
      "createdAt": "2026-06-11T08:00:00.000Z",
      "updatedAt": "2026-06-11T12:30:00.000Z",
      "version": 3,
      "fileSize": 45230,
      "meta": {
        "viewCount": 1240,
        "likeCount": 87,
        "commentCount": 14
      }
    }
  ]
}
```

**GET /api/content/flow/meta-guncel-durum-raporu-11haziran2026**
```json
{
  "meta": {
    "slug": "meta-guncel-durum-raporu-11haziran2026",
    "route": "flow",
    "title": "META Güncel Durum Raporu",
    "status": "published",
    "createdAt": "2026-06-11T08:00:00.000Z",
    "updatedAt": "2026-06-11T12:30:00.000Z"
  },
  "frontmatter": {
    "title": "META Güncel Durum Raporu",
    "date": "2026-06-11",
    "author": "Gistify Analiz Ekibi",
    "tags": ["META", "FANG", "Teknik Analiz"],
    "category": "Teknik Rapor"
  },
  "content": "## Giriş\n\nMETA 2026 Q2..."
}
```

**POST /api/content/flow** (Admin)
```json
// Request Body
{
  "slug": "nvidia-teknik-raporu-haziran",
  "title": "NVIDIA Teknik Raporu — Haziran 2026",
  "description": "NVIDIA momentum ve IV crush analizi",
  "category": "Earnings Play",
  "tags": ["NVDA", "Earnings", "Teknik Analiz"],
  "frontmatter": {
    "title": "NVIDIA Teknik Raporu — Haziran 2026",
    "date": "2026-06-12",
    "author": "Gistify Analiz Ekibi",
    "tags": ["NVDA", "Earnings", "Teknik Analiz"]
  },
  "body": "## Teknik Görünüm\n\nNVDA günlük grafik..."
}

// Response
{
  "slug": "nvidia-teknik-raporu-haziran",
  "route": "flow",
  "status": "draft",
  "createdAt": "2026-06-12T13:11:56.000Z"
}
```

### 14.1.2 Admin Yetkilendirme Middleware

```typescript
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = readAuthPayload(req);
  if (!auth.authenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const adminEmail = getWeeklyReportAdminEmail();
  const adminSecret = getWeeklyReportAdminSecret();
  const providedSecret = req.headers.authorization?.replace("Bearer ", "").trim();

  const isAdmin =
    auth.user?.email === adminEmail ||
    (adminSecret && providedSecret === adminSecret);

  if (!isAdmin) {
    return res.status(403).json({ error: "Forbidden — admin only" });
  }
  next();
}
```

### 14.1.3 MD Dosya Yapısı & Frontmatter Parse

Her MD dosyası şu yapıyı takip eder:

```
---
title: "META Güncel Durum Raporu"
date: "2026-06-11"
author: "Gistify Analiz Ekibi"
tags: ["META", "FANG"]
category: "Teknik Rapor"
---

## Giriş

İçerik body...
```

Backend parse mantığı (mevcut `dailyReportSources.ts` pattern'ine uygun):

```typescript
function parseMarkdownFile(filePath: string): { frontmatter: Record<string, unknown>; body: string } {
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: raw };
  }
  // YAML parse: mevcut projede yaml yoksa basit key-value parse veya `js-yaml` ekle
  const frontmatter = parseYamlFrontmatter(match[1]); // { title, date, author, tags, category }
  return { frontmatter, body: match[2].trim() };
}
```

Dosya sistemi layout'u:
```
data/content/
├── app/
│   ├── rapor-haziran-2026.md
│   └── strateji-temmuz-2026.md
├── momentum/
│   ├── momentum-05-haziran.md
│   └── momentum-12-haziran.md
├── daily-report/
│   └── 09062026.md
└── flow/
    ├── meta-guncel-durum-raporu-11haziran2026.md
    └── nvidia-teknik-raporu-haziran.md
```

---

## 14.2 Sosyal API (Flow)

Flow route'u sosyal katman içerir: beğenme, yorum, paylaşım, görüntülenme. Tüm endpoint'ler mevcut `readAuthPayload()` üzerinden auth kontrolü yapar. Guest kullanıcılar read-only erişim alır (yorum/beğeni yapamaz).

| Method | Endpoint | Açıklama | Request Body | Response | Auth |
|---|---|---|---|---|---|
| `POST` | `/api/social/like` | Beğenme ekle/kaldır (toggle) | `{ contentSlug, route: "flow" }` | `{ liked: boolean, likeCount: number }` | Member+ |
| `GET` | `/api/social/like/:route/:contentSlug` | Beğeni sayısı + mevcut kullanıcı beğenmiş mi? | — | `{ likeCount: number, likedByMe: boolean }` | Guest+ (likedByMe: false) |
| `POST` | `/api/social/comment` | Yorum ekle (threaded/nested reply destekli) | `{ contentSlug, route: "flow", body, parentId? }` | `{ comment: Comment, pending: false }` | Member+ |
| `GET` | `/api/social/comment/:route/:contentSlug` | Yorumları ağaç (tree) yapısında listele | `?sort=oldest\|newest&limit=50` | `{ comments: CommentTree[] }` | Guest+ |
| `PUT` | `/api/social/comment/:commentId` | Yorum güncelle (kendi yorumu) | `{ body }` | `{ comment: Comment, edited: true }` | Member+ (owner only) |
| `DELETE` | `/api/social/comment/:commentId` | Yorum soft-delete (status: deleted) | — | `{ deleted: true }` | Member+ (owner or admin) |
| `GET` | `/api/social/share/:route/:contentSlug` | Paylaşım metadata (OG tags, preview) | — | `{ title, description, image?, url, ogTags }` | Guest+ (public) |
| `POST` | `/api/social/view/:route/:contentSlug` | Görüntülenme sayısını artır (idempotent — IP + session bazlı 5dk throttle) | — | `{ viewCount: number }` | Guest+ |
| `GET` | `/api/social/activity/me` | Giriş yapmış kullanıcının sosyal aktivitesi | — | `{ likes: string[], comments: Comment[] }` | Member+ |
| `GET` | `/api/social/trending/:route` | Popülerlik skoruna göre en popüler içerikler | `?period=7d\|30d&limit=10` | `{ items: TrendingItem[] }` | Guest+ |

### 14.2.1 Request/Response Örnekleri

**POST /api/social/like** (Toggle)
```json
// Request
{ "contentSlug": "meta-guncel-durum-raporu-11haziran2026", "route": "flow" }

// Response — beğenme eklenmişse
{ "liked": true, "likeCount": 88 }

// Response — beğenme kaldırılmışsa
{ "liked": false, "likeCount": 86 }
```

**POST /api/social/comment** (Root comment)
```json
// Request
{
  "contentSlug": "meta-guncel-durum-raporu-11haziran2026",
  "route": "flow",
  "body": "META'nın 200 günlük hareketli ortalama kırılması çok önemli bir sinyal."
}

// Response
{
  "comment": {
    "id": "cmt_abc123",
    "contentSlug": "meta-guncel-durum-raporu-11haziran2026",
    "userId": "usr_xyz789",
    "userName": "Hasan Koş",
    "userPicture": "https://...",
    "parentId": null,
    "body": "META'nın 200 günlük hareketli ortalama kırılması çok önemli bir sinyal.",
    "createdAt": "2026-06-12T13:11:56.000Z",
    "updatedAt": "2026-06-12T13:11:56.000Z",
    "edited": false,
    "status": "active"
  }
}
```

**POST /api/social/comment** (Reply — threaded)
```json
// Request
{
  "contentSlug": "meta-guncel-durum-raporu-11haziran2026",
  "route": "flow",
  "body": "Katılıyorum, özellikle hacim de destekliyor.",
  "parentId": "cmt_abc123"
}
```

**GET /api/social/comment/flow/meta-guncel-durum-raporu-11haziran2026**
```json
{
  "comments": [
    {
      "id": "cmt_abc123",
      "userId": "usr_xyz789",
      "userName": "Hasan Koş",
      "userPicture": "https://...",
      "parentId": null,
      "body": "META'nın 200 günlük hareketli ortalama kırılması çok önemli bir sinyal.",
      "createdAt": "2026-06-12T10:00:00.000Z",
      "updatedAt": "2026-06-12T10:00:00.000Z",
      "edited": false,
      "status": "active",
      "replies": [
        {
          "id": "cmt_def456",
          "userId": "usr_aaa111",
          "userName": "Ahmet Y.",
          "parentId": "cmt_abc123",
          "body": "Katılıyorum, özellikle hacim de destekliyor.",
          "createdAt": "2026-06-12T11:30:00.000Z",
          "updatedAt": "2026-06-12T11:30:00.000Z",
          "edited": false,
          "status": "active",
          "replies": []
        }
      ]
    }
  ]
}
```

**GET /api/social/share/flow/meta-guncel-durum-raporu-11haziran2026**
```json
{
  "title": "META Güncel Durum Raporu — Gistify",
  "description": "11 Haziran 2026 META teknik ve temel analiz. Günlük momentum, IV crush, earnings setup.",
  "image": "https://gistify.pro/gistifylogo.png",
  "url": "https://gistify.pro/flow/meta-guncel-durum-raporu-11haziran2026",
  "ogTags": {
    "og:title": "META Güncel Durum Raporu — Gistify",
    "og:description": "11 Haziran 2026 META teknik ve temel analiz...",
    "og:image": "https://gistify.pro/gistifylogo.png",
    "og:url": "https://gistify.pro/flow/...",
    "og:type": "article",
    "twitter:card": "summary_large_image"
  }
}
```

**GET /api/social/trending/flow?period=7d&limit=10**
```json
{
  "items": [
    {
      "slug": "meta-guncel-durum-raporu-11haziran2026",
      "title": "META Güncel Durum Raporu",
      "route": "flow",
      "popularityScore": 94.5,
      "viewCount": 1240,
      "likeCount": 87,
      "commentCount": 14,
      "shareCount": 23
    }
  ]
}
```

### 14.2.2 Popülerlik Skoru (popularityScore)

`content_meta` tablosundaki `popularityScore` şu formülle hesaplanır:

```typescript
function calculatePopularityScore(meta: ContentMeta): number {
  const now = Date.now();
  const ageHours = (now - Date.parse(meta.createdAt)) / (1000 * 60 * 60);
  const decayFactor = Math.exp(-ageHours / 168); // 7 günlük yarılanma süresi

  const weighted =
    meta.viewCount * 1 +
    meta.likeCount * 5 +
    meta.commentCount * 10 +
    meta.shareCount * 8;

  return Number((weighted * decayFactor).toFixed(2));
}
```

---

## 14.3 Veri Modeli (Database Schema)

Tüm tablolar mevcut `data/billing.sqlite` içinde `createBillingStore()` init bloğuna eklenir. SQLite `node:sqlite` `DatabaseSync` kullanılır. `PRAGMA journal_mode = WAL` mevcut yapıda zaten aktiftir.

### 14.3.1 content_registry

MD dosyalarının master kaydı. Dosya sistemi + SQLite senkronizasyonu burada yönetilir.

```sql
CREATE TABLE IF NOT EXISTS content_registry (
  slug TEXT NOT NULL,
  route TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags_json TEXT NOT NULL DEFAULT '[]',
  author TEXT NOT NULL DEFAULT 'admin@gistify.pro',
  status TEXT NOT NULL DEFAULT 'draft',          -- draft | published | deleted | archived
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL DEFAULT 0,
  frontmatter_json TEXT NOT NULL DEFAULT '{}',
  PRIMARY KEY (route, slug)
);

CREATE INDEX IF NOT EXISTS idx_content_registry_route_status
  ON content_registry(route, status);

CREATE INDEX IF NOT EXISTS idx_content_registry_author
  ON content_registry(author);

CREATE INDEX IF NOT EXISTS idx_content_registry_created_at
  ON content_registry(created_at DESC);
```

### 14.3.2 content_meta

Sayım (count) ve popülerlik metrikleri. `content_registry` ile 1:1 ilişki, ama sık güncellenen sayaçlar ayrı tabloda tutulur (write contention azaltmak için).

```sql
CREATE TABLE IF NOT EXISTS content_meta (
  slug TEXT NOT NULL,
  route TEXT NOT NULL,
  view_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  share_count INTEGER NOT NULL DEFAULT 0,
  last_accessed_at TEXT,
  popularity_score REAL NOT NULL DEFAULT 0.0,
  PRIMARY KEY (route, slug)
);

CREATE INDEX IF NOT EXISTS idx_content_meta_popularity
  ON content_meta(popularity_score DESC);

CREATE INDEX IF NOT EXISTS idx_content_meta_route_score
  ON content_meta(route, popularity_score DESC);
```

### 14.3.3 likes

Kullanıcı beğenileri. `UNIQUE(contentSlug, route, userId)` ile duplicate engellenir.

```sql
CREATE TABLE IF NOT EXISTS likes (
  id TEXT PRIMARY KEY,
  content_slug TEXT NOT NULL,
  route TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(content_slug, route, user_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_user_id
  ON likes(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_likes_content
  ON likes(content_slug, route);
```

### 14.3.4 comments

Threaded/nested yorumlar. `parent_id` nullable; `NULL` ise root comment, dolu ise reply.

```sql
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  content_slug TEXT NOT NULL,
  route TEXT NOT NULL,
  user_id TEXT NOT NULL,
  parent_id TEXT,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  edited INTEGER NOT NULL DEFAULT 0,            -- boolean: 0 | 1
  status TEXT NOT NULL DEFAULT 'active',        -- active | deleted | hidden
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_comments_content
  ON comments(content_slug, route, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_user_id
  ON comments(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_parent
  ON comments(parent_id);
```

### 14.3.5 shares

Paylaşım log'u. Analitik + virallite takibi. `ip_hash` GDPR/CCPA uyumlu anonimizasyon.

```sql
CREATE TABLE IF NOT EXISTS shares (
  id TEXT PRIMARY KEY,
  content_slug TEXT NOT NULL,
  route TEXT NOT NULL,
  user_id TEXT,
  platform TEXT NOT NULL,                        -- twitter | linkedin | whatsapp | telegram | copy_link
  created_at TEXT NOT NULL,
  ip_hash TEXT                                   -- SHA-256(first 3 octets + salt) of request IP
);

CREATE INDEX IF NOT EXISTS idx_shares_content
  ON shares(content_slug, route, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_shares_platform
  ON shares(platform, created_at DESC);
```

### 14.3.6 content_versions

MD içerik versiyon geçmişi. Her `PUT` ve `publish` işleminde yeni versiyon oluşturulur. `diff` opsiyonel; tam içerik `content_hash` ile SHA-256 referans verilir.

```sql
CREATE TABLE IF NOT EXISTS content_versions (
  id TEXT PRIMARY KEY,
  content_slug TEXT NOT NULL,
  route TEXT NOT NULL,
  version INTEGER NOT NULL,
  content_hash TEXT NOT NULL,                    -- SHA-256 of full file content
  created_at TEXT NOT NULL,
  diff_json TEXT,                                -- opsiyonel: { previousHash, changedFields[] }
  author TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_content_versions_slug
  ON content_versions(content_slug, route, version DESC);
```

### 14.3.7 user_activity

Kullanıcı aktivite feed'i. "Hangi kullanıcı ne zaman ne yapmış?" sorguları için.

```sql
CREATE TABLE IF NOT EXISTS user_activity (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  activity_type TEXT NOT NULL,                   -- like | comment | share | view
  content_slug TEXT NOT NULL,
  route TEXT NOT NULL,
  created_at TEXT NOT NULL,
  metadata_json TEXT                             -- opsiyonel: { commentId?, platform? }
);

CREATE INDEX IF NOT EXISTS idx_user_activity_user
  ON user_activity(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_activity_content
  ON user_activity(content_slug, route, activity_type);

CREATE INDEX IF NOT EXISTS idx_user_activity_type
  ON user_activity(activity_type, created_at DESC);
```

### 14.3.8 content_tags

Tag-normalized lookup tablosu. `content_registry.tags_json` parse edilerek buraya `INSERT` yapılır; arama/filtreleme performansı için.

```sql
CREATE TABLE IF NOT EXISTS content_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  route TEXT NOT NULL,
  tag TEXT NOT NULL,
  UNIQUE(slug, route, tag)
);

CREATE INDEX IF NOT EXISTS idx_content_tags_tag
  ON content_tags(tag, route);

CREATE INDEX IF NOT EXISTS idx_content_tags_slug
  ON content_tags(slug, route);
```

### 14.3.9 Schema Migration Stratejisi

Mevcut `billingStore.ts` migration pattern'ine uygun:

```typescript
// billingStore.ts init bloğu içine ekle
const tableInfo = db.prepare("PRAGMA table_info(content_registry)").all() as unknown as TableInfoRow[] | undefined;
if (!tableInfo?.length) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS content_registry (...);
    CREATE TABLE IF NOT EXISTS content_meta (...);
    CREATE TABLE IF NOT EXISTS likes (...);
    CREATE TABLE IF NOT EXISTS comments (...);
    CREATE TABLE IF NOT EXISTS shares (...);
    CREATE TABLE IF NOT EXISTS content_versions (...);
    CREATE TABLE IF NOT EXISTS user_activity (...);
    CREATE TABLE IF NOT EXISTS content_tags (...);
    -- tüm index'ler
  `);
}
```

---

## 14.4 Index & Query Strategy

### 14.4.1 Index Haritası

| Tablo | Index | Kolon(lar) | Amaç |
|---|---|---|---|
| `content_registry` | `idx_content_registry_route_status` | `route, status` | Route listeleme — `published` filtreli |
| `content_registry` | `idx_content_registry_author` | `author` | Admin "benim yazılarım" sorgusu |
| `content_registry` | `idx_content_registry_created_at` | `created_at DESC` | Kronolojik sıralama |
| `content_meta` | `idx_content_meta_popularity` | `popularity_score DESC` | Trending sıralama |
| `content_meta` | `idx_content_meta_route_score` | `route, popularity_score DESC` | Route bazlı trending |
| `likes` | `idx_likes_content` | `content_slug, route` | Beğeni sayısı aggregate |
| `likes` | `idx_likes_user_id` | `user_id, created_at DESC` | Kullanıcı "beğendiklerim" |
| `comments` | `idx_comments_content` | `content_slug, route, created_at DESC` | Yorum listeleme |
| `comments` | `idx_comments_user_id` | `user_id, created_at DESC` | Kullanıcı "yorumlarım" |
| `comments` | `idx_comments_parent` | `parent_id` | Nested reply tree build |
| `shares` | `idx_shares_content` | `content_slug, route` | Share count aggregate |
| `content_versions` | `idx_content_versions_slug` | `content_slug, route, version DESC` | Versiyon geçmişi |
| `user_activity` | `idx_user_activity_user` | `user_id, created_at DESC` | Aktivite feed'i |
| `content_tags` | `idx_content_tags_tag` | `tag, route` | Tag bazlı filtreleme |

### 14.4.2 Sık Kullanılan Sorgular & Execution Plan

**Q1: Route'daki tüm published içerikleri listele (meta ile)**
```sql
SELECT
  r.slug,
  r.route,
  r.title,
  r.description,
  r.category,
  r.tags_json,
  r.author,
  r.status,
  r.created_at,
  r.updated_at,
  r.version,
  m.view_count,
  m.like_count,
  m.comment_count,
  m.share_count,
  m.popularity_score
FROM content_registry r
LEFT JOIN content_meta m ON r.slug = m.slug AND r.route = m.route
WHERE r.route = ? AND r.status = 'published'
ORDER BY r.created_at DESC
LIMIT ? OFFSET ?;
```
*Plan:* `idx_content_registry_route_status` → `idx_content_registry_created_at` → LEFT JOIN `content_meta` (PK lookup, O(1) per row).

**Q2: Belirli içeriğin yorum ağacı**
```sql
SELECT
  c.id,
  c.content_slug,
  c.user_id,
  u.name AS user_name,
  u.picture AS user_picture,
  c.parent_id,
  c.body,
  c.created_at,
  c.updated_at,
  c.edited,
  c.status
FROM comments c
LEFT JOIN auth_users u ON c.user_id = u.id
WHERE c.content_slug = ? AND c.route = ? AND c.status = 'active'
ORDER BY c.created_at ASC;
```
*Tree build:* Backend'de `parent_id` gruplama ile O(n) ağaç oluşturma. Derinlik limiti: 3 seviye (root → reply → sub-reply).

**Q3: Kullanıcının beğendiği içerikler**
```sql
SELECT
  l.content_slug,
  l.route,
  l.created_at,
  r.title
FROM likes l
LEFT JOIN content_registry r ON l.content_slug = r.slug AND l.route = r.route
WHERE l.user_id = ?
ORDER BY l.created_at DESC
LIMIT ?;
```

**Q4: Popülerlik skoru güncelle (batch job veya trigger)**
```sql
UPDATE content_meta
SET popularity_score = (
  (view_count * 1.0 + like_count * 5.0 + comment_count * 10.0 + share_count * 8.0)
  * EXP(-((julianday('now') - julianday(created_at)) * 24) / 168)
)
WHERE route = ?;
```
Not: `content_meta` tablosuna `created_at` kolonu eklenebilir veya `content_registry` JOIN ile yapılır. Pratikte batch job (her 5 dakikada) daha sağlıklıdır.

### 14.4.3 Full-Text Search Stratejisi

Seçenekler:

1. **SQLite FTS5** (önerilen — sıfır dependency):
   ```sql
   CREATE VIRTUAL TABLE IF NOT EXISTS content_fts USING fts5(
     slug, route, title, description, body, content='content_registry'
   );
   ```
   - Avantaj: `billing.sqlite` içinde, ek sunucu yok.
   - Dezavantaj: Türkçe stemming yok; kelime tabanlı exact match + prefix search.
   - Kullanım: `SELECT * FROM content_fts WHERE content_fts MATCH 'META AND teknik';`

2. **External: Meilisearch / Algolia** (gelecekte):
   - Avantaj: Fuzzy matching, typo tolerance, ranking.
   - Dezavantaj: Ek infra, sync complexity.
   - **Karar:** MVP'de FTS5, üretimde trafik artarsa Meilisearch'e geçiş.

### 14.4.4 Pagination Stratejisi

| Senaryo | Strateji | Page Size | Neden |
|---|---|---|---|
| Route listeleme (`/api/content/:route`) | Offset-based | 20 | Sayfa sayısı önemli, sıralama stabil |
| Trending (`/api/social/trending`) | Offset-based | 10 | Skor sık değişmez, cache-friendly |
| Yorum listeleme | Offset-based | 50 (root) + 20 (replies) | Derinlik sınırlı, esnek yeterli |
| Arama sonuçları | Cursor-based | 20 | Score sıralama stabil, real-time infinite scroll |

Cursor-based implementasyon (search için):
```typescript
interface CursorPaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;  // base64(JSON({ score, createdAt, slug }))
  hasMore: boolean;
}
```

---

# Bölüm 15: State Yönetimi & URL Routing

## 15.1 URL Routing Stratejisi

### 15.1.1 Tab Bazlı Routing

Gistify'da her dinamik MD dosyası bir tab temsil eder. İki URL stratejisi değerlendirilmiştir:

| Strateji | URL | Avantaj | Dezavantaj |
|---|---|---|---|
| **Query param (seçilen)** | `/app?tab=rapor-haziran-2026` | Tab switch sayfa değişimi yok; aynı route'da kalınır; state restore hızlı | Paylaşım URL'si daha az "temiz" |
| Path param | `/app/rapor-haziran-2026` | Deep link doğal, SEO-friendly | Her tab değişimi route mount/unmount; gereksiz re-render |

**Karar:** Query param tab switching için; path param server-rendered deep link fallback için.

### 15.1.2 Deep Linking & Paylaşım URL'leri

```
/app?tab=rapor-haziran-2026              → Belirli tab açık
/momentum?tab=momentum-12-haziran        → Momentum raporu
/daily-report?tab=09062026               → Günlük rapor
/flow/meta-guncel-durum-raporu-11haziran2026 → Flow sosyal (path param + slug)
/flow/meta-guncel-durum?comment=cmt_abc  → Belirli yoruma scroll
```

**Flow için özel deep link davranışı:**
- `/flow/:slug` → `flow` route'unda path param kullanılır. Sebep: Flow sosyal paylaşım URL'leri `og:url` ve sosyal medya preview'ları için path param daha güvenlidir (query param'ları bazı platformlar strip eder).
- `/flow/:slug?comment=:commentId` → Sayfa yüklenince `IntersectionObserver` + `scrollIntoView` ile ilgili yoruma scroll.

### 15.1.3 Admin Routing

```
/app/admin/content/app          → App route içerik yönetimi
/app/admin/content/momentum     → Momentum route içerik yönetimi
/app/admin/content/flow         → Flow route içerik yönetimi
/app/admin/content/daily-report → Daily report yönetimi
```

### 15.1.4 URL ↔ State Sync

React hook: `useSyncedTabState`

```typescript
// client/src/hooks/useSyncedTabState.ts
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "wouter";

export function useSyncedTabState(route: string) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || undefined;
  const [activeTab, setActiveTab] = useState<string | undefined>(tab);

  // URL'den tab oku
  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  // Tab değişince URL güncelle
  const selectTab = useCallback((slug: string) => {
    setActiveTab(slug);
    setSearchParams({ tab: slug });
  }, [setSearchParams]);

  // Browser back/forward desteği
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveTab(params.get("tab") || undefined);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return { activeTab, selectTab };
}
```

### 15.1.5 Back/Forward Navigation

- Tab switch `history.pushState` ile yapılır (back button önceki tab'a döner).
- Flow sosyal: Yorum thread'inde reply açmak `history.replaceState` (back ile yorum değil, önceki sayfa kapanır).
- Admin panel: CRUD işlemleri sonrası `navigate(-1)` ile listeye dönüş.

---

## 15.2 State Yönetimi

### 15.2.1 Mevcut State Stack

Gistify şu anda herhangi bir global state kütüphanesi kullanmıyor (React useState / useEffect + API fetch). Yeni sistemde şu stack önerilir:

| Katman | Araç | Amaç |
|---|---|---|
| Server state | **TanStack Query (React Query)** | MD içerik fetch, cache, background refetch, stale-while-revalidate |
| Client state | **Zustand** (lightweight) | Tab state, UI modals (yorum aç/kapa), admin edit mode |
| Form state | **React Hook Form** (zaten mevcut) | Yorum form, admin MD editor form |
| Routing | **Wouter** (zaten mevcut) | URL sync, deep link, navigation |

### 15.2.2 MD Content Cache (React Query)

```typescript
// client/src/hooks/useContent.ts
import { useQuery, useMutation } from "@tanstack/react-query";

const contentQueryKey = (route: string, slug: string) => ["content", route, slug];

export function useContent(route: string, slug: string) {
  return useQuery({
    queryKey: contentQueryKey(route, slug),
    queryFn: () => fetch(`/api/content/${route}/${slug}`).then(r => r.json()),
    staleTime: 5 * 60 * 1000,      // 5 dakika fresh
    gcTime: 30 * 60 * 1000,         // 30 dakika cache'de tut
    placeholderData: (previousData) => previousData, // keepPreviousData
  });
}

export function useContentList(route: string) {
  return useQuery({
    queryKey: ["content", route, "list"],
    queryFn: () => fetch(`/api/content/${route}`).then(r => r.json()),
    staleTime: 2 * 60 * 1000,
  });
}
```

Cache invalidation stratejisi:
- Admin yeni MD yüklediğinde: `queryClient.invalidateQueries({ queryKey: ["content", route, "list"] })`
- Admin MD güncellediğinde: `queryClient.invalidateQueries({ queryKey: ["content", route, slug] })`

### 15.2.3 Sosyal State — Optimistic Updates

Beğenme (like) ve yorum gönderme anında UI hemen güncellenir, API cevabı gelince onaylanır.

```typescript
// client/src/hooks/useSocialLike.ts
export function useSocialLike(route: string, slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetch("/api/social/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentSlug: slug, route }),
      }).then(r => r.json()),

    // Optimistic update
    onMutate: async () => {
      const queryKey = ["social", "like", route, slug];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<LikeState>(queryKey);
      queryClient.setQueryData(queryKey, (old: LikeState | undefined) => ({
        liked: !old?.liked,
        likeCount: (old?.likeCount || 0) + (old?.liked ? -1 : 1),
      }));
      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["social", "like", route, slug], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["social", "like", route, slug] });
    },
  });
}
```

### 15.2.4 Pending & Error State

| İşlem | Pending UI | Error UI | Retry |
|---|---|---|---|
| Like | Kalp ikonu anında dolu/boş değişir | Toast "İşlem başarısız", ikon revert | 1 otomatik retry (network error) |
| Comment submit | Buton "Gönderiliyor..." + spinner | Inline error mesajı + retry butonu | 3 exponential backoff retry |
| MD yükleme (admin) | Progress bar (% dosya boyutu) | Modal hata detayı | Manuel retry |
| Yorum listeleme | Skeleton loader | "Yorumlar yüklenemedi. Tekrar dene" butonu | Infinite retry with backoff |

---

## 15.3 Real-time Considerations

### 15.3.1 Yeni Yorum Bildirimi

| Seçenek | Karmaşıklık | Ölçek | Gistify için Uygun? |
|---|---|---|---|
| **Polling (önerilen)** | Düşük | Yüksek | Flow sayfasında 30sn interval ile yeni yorum check. Beğeni/view için overkill. |
| SSE | Orta | Orta | Tek yönlü server→client. SSE connection başına 1. Node.js event emitter ile yönetilebilir. |
| WebSocket | Yüksek | Düşük-orta | Çift yönlü, stateful. Gistify için gereksiz complexity. |

**Karar:** MVP'de polling (30s). Yorum yüksek trafik görürse SSE'ye geçiş.

```typescript
// client/src/hooks/useCommentsRealtime.ts
export function useCommentsRealtime(route: string, slug: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({
        queryKey: ["social", "comment", route, slug],
      });
    }, 30_000);
    return () => clearInterval(interval);
  }, [route, slug, queryClient]);
}
```

### 15.3.2 Beğeni Sayısı Anlık Güncelleme

Beğeni sayısı **broadcast edilmez**. Her kullanıcı kendi beğenisini optimistic update ile görür; toplam sayısı kendi fetch'inde alır. Beğeni sayısı son derece sık değişmiyor (per-user action, viral değil). 30s polling ile `content_meta` güncellenir yeterli.

### 15.3.3 Presence (Kim Online / Kim Okuyor)

Flow için "X kişi şu an bu raporu okuyor" göstergesi:
- **V1: Atlanacak.** Kullanıcı faydası düşük, infra maliyeti yüksek.
- **V2 (gelecek):** Redis + WebSocket presence tracking. Gistify şu an Redis kullanmıyor.

### 15.3.4 Conflict Resolution — Aynı Anda Edit

Admin panelde iki admin aynı MD'yi düzenlerse:
1. Her edit `PUT` işlemi `version` ve `updatedAt` kontrolü yapar.
2. Client `ETag` header (content_hash) gönderir.
3. Server `If-Match` kontrolü yapar; eşleşmezse `409 Conflict` döner.
4. Client 409 alırsa "Bu içerik başka bir admin tarafından değiştirildi. Yeniden yükleyip değişikliklerinizi birleştirin." mesajı gösterir.

```typescript
// Admin PUT request
try {
  const response = await fetch(`/api/content/${route}/${slug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "If-Match": localContentHash, // SHA-256 of body before edit
    },
    body: JSON.stringify({ body: newBody, title: newTitle }),
  });
  if (response.status === 409) {
    showConflictModal(); // "Yeniden yükle ve birleştir"
  }
} catch (e) { ... }
```

---

## 15.4 Offline & Sync

### 15.4.1 Service Worker Stratejisi

Gistify mevcutta Vite PWA plugin'i veya custom SW kullanıyor olabilir. Yeni gereksinim:

**Cache stratejisi:**
- **Cache-First:** MD içerikleri (`/api/content/*`) — statik, nadiren değişir.
- **Network-First:** Sosyal endpoint'leri (`/api/social/*`) — canlı data.
- **Stale-While-Revalidate:** Meta veriler, tag listesi.

```typescript
// sw.ts (vite-plugin-pwa workbox generateSW config'e eklenecek)
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith("/api/content/"),
  new workbox.strategies.CacheFirst({
    cacheName: "gistify-content",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 gün
      }),
    ],
  })
);
```

### 15.4.2 Background Sync — Yorum

Kullanıcı offline iken yorum yazarsa:
1. Yorum `localStorage` veya `IndexedDB` queue'ya yazılır.
2. `navigator.serviceWorker.ready` → `sync.register("comment-sync")`.
3. SW `sync` event'i yakalar, queue'daki yorumları `POST /api/social/comment` ile gönderir.
4. Başarılı olunca queue temizlenir; UI toast "Yorumunuz gönderildi".
5. Başarısız olunca retry 3x; sonra "Yorum gönderilemedi" bildirim.

```typescript
// client/src/utils/commentQueue.ts
const COMMENT_QUEUE_KEY = "gistify_comment_queue";

export function queueComment(payload: CommentPayload) {
  const queue = JSON.parse(localStorage.getItem(COMMENT_QUEUE_KEY) || "[]");
  queue.push({ ...payload, queuedAt: Date.now() });
  localStorage.setItem(COMMENT_QUEUE_KEY, JSON.stringify(queue));
  requestSync("comment-sync");
}

async function requestSync(tag: string) {
  const reg = await navigator.serviceWorker.ready;
  await reg.sync.register(tag);
}
```

```typescript
// sw.ts
self.addEventListener("sync", (event: SyncEvent) => {
  if (event.tag === "comment-sync") {
    event.waitUntil(processCommentQueue());
  }
});

async function processCommentQueue() {
  const queue = JSON.parse(localStorage.getItem("gistify_comment_queue") || "[]");
  for (const item of queue) {
    try {
      await fetch("/api/social/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    } catch (e) {
      // Bir sonraki sync event'inde retry
      return;
    }
  }
  localStorage.removeItem("gistify_comment_queue");
}
```

### 15.4.3 IndexedDB — Yapılandırılmış MD Veri Saklama

`localStorage` yerine `IndexedDB` (via `idb` kütüphanesi) kullanılır. Sebep:
- MD içerikleri 1MB+ olabilir; localStorage 5MB limit.
- IndexedDB structured data, indexing, async API destekler.

```typescript
// client/src/db/contentCache.ts
import { openDB, type DBSchema } from "idb";

interface ContentCacheSchema extends DBSchema {
  content: {
    key: string; // `${route}:${slug}`
    value: {
      route: string;
      slug: string;
      frontmatter: Record<string, unknown>;
      body: string;
      cachedAt: number;
      meta: ContentMeta;
    };
    indexes: { "by-route": string };
  };
}

export const contentDB = openDB<ContentCacheSchema>("gistify-content", 1, {
  upgrade(db) {
    const store = db.createObjectStore("content", { keyPath: "slug" });
    store.createIndex("by-route", "route", { unique: false });
  },
});

export async function cacheContent(route: string, slug: string, data: ContentData) {
  const db = await contentDB;
  await db.put("content", { ...data, route, slug, cachedAt: Date.now() });
}

export async function getCachedContent(route: string, slug: string) {
  const db = await contentDB;
  return db.get("content", slug);
}

export async function clearExpiredCache(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000) {
  const db = await contentDB;
  const tx = db.transaction("content", "readwrite");
  const store = tx.objectStore("content");
  const now = Date.now();
  const all = await store.getAll();
  for (const item of all) {
    if (now - item.cachedAt > maxAgeMs) {
      await store.delete(item.slug);
    }
  }
  await tx.done;
}
```

---

## Özet Karar Tablosu

| Konu | Karar | Gerekçe |
|---|---|---|
| Global state | **Zustand** | Mevcut projeye en hafif entegrasyon, Context/Redux'e göre az boilerplate |
| Server cache | **TanStack Query** | Stale-while-revalidate, background refetch, cache invalidation built-in |
| Tab routing | **Query param** (`?tab=slug`) | Aynı route'da kalma, hızlı tab switch, back button desteği |
| Flow deep link | **Path param** (`/flow/:slug`) | OG tag uyumluluğu, sosyal medya preview güvenilirliği |
| Search | **SQLite FTS5** | Sıfır ek infra, MVP için yeterli, Meilisearch geçiş yolu açık |
| Pagination (list) | **Offset-based** | Page count önemli, basit implementasyon |
| Pagination (search) | **Cursor-based** | Infinite scroll, real-time score sıralama |
| Real-time yorum | **30s polling** | Complexity düşük, MVP için yeterli, SSE geçiş yolu açık |
| Beğeni broadcast | **Yapılmayacak** | Per-user action, toplam sayı 30s polling ile yeterli |
| Offline yorum | **Background Sync + localStorage queue** | Kullanıcı deneyimi korunur, SW sync API kullanılır |
| Offline cache | **Service Worker CacheFirst** | MD içerikleri 7 gün cache, sosyal network-first |
| Conflict resolution | **ETag / If-Match + 409** | Admin çakışmaları önlenir, explicit merge UI |
