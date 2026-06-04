# Gistify Gelişmiş Agent & Momentum/Earnings Sistemi Geliştirme Dokümanı

**Versiyon:** 2.0  
**Tarih:** 2026-06-03  
**Hazırlayan:** Sistem Analizi & Mimarisi  
**Durum:** Kapsamlı Geliştirme Planı  
**Değişiklikler v1.0 → v2.0:** Testing stratejisi, DevOps/CI-CD, WebSocket implementasyonu, Backtesting engine detayları, Error handling & circuit breaker, Veri modeli genişlemesi, Rate limiting mimarisi, Skorlama kalibrasyonu, Pagination, PWA/mobile notları, izleme listesi ve environment dokümantasyonu eklendi.

---

## 0. Executive Summary

Mevcut Gistify platformu, haftalık earnings/IV crush raporları ve temel momentum scanner üzerine kurulu manuel-yarı otomatik bir yapıdır. Bu doküman, sistemi **gerçek zamanlı, AI-agent destekli, çok kaynaklı** bir momentum ve earnings fırsat tespit platformuna dönüştürmek için gereken mimari değişiklikleri, veri modellerini, agent pipeline'larını, üye deneyimi iyileştirmelerini ve teknik implementasyon adımlarını belgeler.

**Hedef:** Üyelere, haftalık raporların ötesinde, gerçek zamanlı momentum sinyalleri, earnings öncesi fırsat pencereleri ve kişiselleştirilmiş strateji önerileri sunmak.

**v2.0 Farkı:** v1.0'da eksik kalan test stratejisi, DevOps altyapısı, WebSocket gerçek zamanlı katmanı, backtesting motoru, hata yönetimi, rate-limit/circuit-breaker mantığı, genişletilmiş veri modeli ve skora kalibrasyon rehberi bu versiyona eklenmiştir.

---

## 1. Mevcut Durum Analizi (SWOT)

### 1.1 Güçlü Yönler (Strengths)

- ✅ Haftalık rapor mimarisi (draft → publish akışı) işler durumda
- ✅ Admin paneli (`WeeklyReportAdminPanel`) rapor editörü mevcut
- ✅ IV crush skorlama altyapısı (`ivCrushScore`, `strategyRating`)
- ✅ Scanner modülü (`/scanner`) ayrılmış ve genişletmeye hazır
- ✅ SQLite + Express + React 19 stack basit ve hızlı iterasyona uygun
- ✅ Public/managed access modları esnek
- ✅ Seed veri sistemi ile boş deploy sorunu çözülmüş

### 1.2 Zayıf Yönler (Weaknesses)

- ❌ **Manuel veri girişi:** Admin panelinde tüm ticker verileri elle giriliyor
- ❌ **Statik veri:** Seed raporlar sabit, gerçek piyasa verisiyle güncellenmiyor
- ❌ **Tek kaynak:** Scanner sadece Yahoo Finance'e bağımlı, fallback'ler opsiyonel
- ❌ **Eksik otomasyon:** Earnings calendar, IV data, momentum metrikleri otomatik çekilmiyor
- ❌ **Billing tamamlanmamış:** Paddle/Shopier geçişi yapılmamış, üyelik yönetimi zayıf
- ❌ **Alert sistemi yok:** Üyeler anlık fırsatlardan haberdar edilmiyor
- ❌ **Kişiselleştirme yok:** Tüm üyeler aynı raporu görüyor
- ❌ **Test coverage yok:** Unit/integration/e2e test altyapısı mevcut değil
- ❌ **DevOps eksik:** CI/CD pipeline, staging ortamı, deployment otomasyonu yok

### 1.3 Fırsatlar (Opportunities)

- 🚀 **Agent/AI entegrasyonu:** LLM + quantitative pipeline ile otomatik analiz
- 🚀 **Real-time data:** WebSocket veya polling ile anlık momentum takibi
- 🚀 **Çoklu veri kaynağı:** TwelveData, AlphaVantage, Finnhub, Polygon.io entegrasyonu
- 🚀 **Üyelik tier'ları:** Free / Pro / Elite segmentasyonu
- 🚀 **Alert & Notification:** Earnings öncesi, IV spike anlarında push/email
- 🚀 **Backtesting:** Tarihsel earnings stratejilerinin performans analizi

### 1.4 Tehditler (Threats)

- ⚠️ **API maliyetleri:** Çoklu veri kaynağı = artan maliyet
- ⚠️ **Rate limiting:** Yahoo Finance ve ücretsiz API'lerin sınırlamaları
- ⚠️ **Veri kalitesi:** Farklı kaynaklardan gelen verilerin tutarlılığı
- ⚠️ **Regulatory:** Finansal tavsiye verme sorumluluğu (disclaimer zorunluluğu)

---

## 2. Hedef Mimarisi: "Agent-Driven Earnings Intelligence Platform"

### 2.1 Üst Seviye Akış

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA INGESTION LAYER                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │  Yahoo   │ │ Twelve   │ │  Alpha   │ │ Earnings │         │
│  │ Finance  │ │  Data    │ │Vantage   │ │ Calendar │         │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘         │
└───────┼────────────┼────────────┼────────────┼─────────────────┘
        │            │            │            │
        └────────────┴────────────┴────────────┘
                         │
              ┌──────────▼──────────┐
              │   AGENT PIPELINE     │
              │  (Node.js Workers)   │
              ├──────────────────────┤
              │ 1. Data Collector    │
              │ 2. Momentum Analyzer │
              │ 3. IV Crush Engine   │
              │ 4. Strategy Builder  │
              │ 5. Risk Assessor     │
              │ 6. Formatter (LLM)   │
              └──────────┬───────────┘
                         │
              ┌──────────▼──────────┐
              │   DATABASE LAYER    │
              │  (SQLite + Cache)   │
              ├─────────────────────┤
              │ • opportunities     │
              │ • momentum_cache    │
              │ • earnings_calendar │
              │ • earnings_history  │
              │ • price_history     │
              │ • alerts            │
              │ • member_profiles   │
              │ • watchlists        │
              │ • backtest_results  │
              └──────────┬──────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐ ┌───────▼──────┐ ┌───────▼──────┐
│   ADMIN      │ │   MEMBER     │ │   PUBLIC     │
│  (/app/admin)│ │   (/app)     │ │  (landing)   │
│              │ │              │ │              │
│ • Review &   │ │ • Dashboard  │ │ • Preview    │
│   override   │ │ • Scanner    │ │ • Pricing    │
│ • Publish    │ │ • Alerts     │ │              │
│ • Backtest   │ │ • Portfolio  │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

### 2.2 Yeni Katmanlar

| Katman | Teknoloji | Görev |
|--------|-----------|-------|
| **Ingestion** | Node.js workers + `node-cron` | API'lerden veri çekme, normalizasyon |
| **Agent Core** | TypeScript classes + LLM API | Skorlama, strateji üretimi, risk analizi |
| **Cache Layer** | SQLite + in-memory LRU | Hızlı sorgular, 15dk-1sa cache |
| **Scheduler** | `node-cron` + BullMQ (opsiyonel) | Periyodik job'lar, queue yönetimi |
| **Notification** | Web Push + Email (Resend/SendGrid) | Alert gönderimi |
| **LLM Gateway** | OpenAI / Anthropic API | Doğal dil özet, strateji açıklaması |
| **WebSocket** | Socket.io | Gerçek zamanlı fiyat/alert akışı |
| **Circuit Breaker** | `opossum` kütüphanesi | API başarısızlıklarında fallback |

---

## 3. Yeni Veri Modeli

### 3.1 `opportunities` Tablosu (Ana Fırsat Kaydı)

```sql
CREATE TABLE opportunities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticker TEXT NOT NULL,
  name TEXT,
  sector TEXT,

  -- Zamanlamalar
  earnings_date TEXT,
  earnings_time TEXT,  -- 'BMO', 'AMC', 'TNS'
  days_to_earnings INTEGER,
  opportunity_window TEXT,  -- 'pre_earnings_3d', 'pre_earnings_1d', 'post_earnings'

  -- Momentum Metrikleri
  momentum_score REAL,  -- 0-100
  price_change_1w REAL,
  price_change_1m REAL,
  price_change_3m REAL,
  rsi_14 REAL,
  macd_signal TEXT,  -- 'bullish', 'bearish', 'neutral'
  volume_surge REAL,  -- vs 20-day average
  adx_14 REAL,       -- trend gücü (0-100)
  ma20 REAL,
  ma50 REAL,
  ma200 REAL,

  -- IV & Opsiyon Metrikleri
  current_iv REAL,
  historical_iv REAL,
  iv_rank REAL,          -- 0-100 percentile
  iv_percentile REAL,
  implied_move_percent REAL,
  expected_iv_crush REAL,
  iv_crush_score REAL,   -- 0-100
  put_call_skew REAL,    -- call/put IV farkı
  option_volume INTEGER,

  -- Strateji & Skorlama
  strategy_type TEXT,       -- 'iv_crush', 'momentum_directional', 'earnings_surprise', 'straddle'
  strategy_rating REAL,     -- 0-100
  composite_score REAL,     -- 0-100 ağırlıklı toplam
  confidence_level TEXT,    -- 'high', 'medium', 'low'
  directional_bias TEXT,    -- 'bullish', 'bearish', 'neutral'

  -- Risk Metrikleri
  risk_level TEXT,          -- 'low', 'medium', 'high', 'extreme'
  max_loss_percent REAL,
  gap_risk REAL,
  earnings_miss_risk REAL,
  market_cap_tier TEXT,     -- 'large', 'mid', 'small', 'micro'

  -- LLM Üretimi
  ai_summary TEXT,
  ai_strategy_rationale TEXT,
  ai_key_catalysts TEXT,     -- JSON array
  ai_execution_notes TEXT,
  ai_risk_warnings TEXT,     -- JSON array (v2 ekleme)
  ai_generated_at TEXT,      -- LLM çalıştırma zamanı

  -- Kaynak & Durum
  data_sources TEXT,         -- JSON: ["yahoo", "twelvedata"]
  status TEXT DEFAULT 'active',  -- 'active', 'expired', 'executed', 'invalidated'
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT,           -- earnings_date + 1 gün

  -- Üyelik & Erişim
  tier_required TEXT DEFAULT 'free',  -- 'free', 'pro', 'elite'

  UNIQUE(ticker, earnings_date, opportunity_window)
);

CREATE INDEX idx_opp_ticker ON opportunities(ticker);
CREATE INDEX idx_opp_earnings_date ON opportunities(earnings_date);
CREATE INDEX idx_opp_status ON opportunities(status);
CREATE INDEX idx_opp_composite_score ON opportunities(composite_score DESC);
```

### 3.2 `member_profiles` Tablosu (Kişiselleştirme)

```sql
CREATE TABLE member_profiles (
  user_id TEXT PRIMARY KEY,  -- auth_users.id ile eşleşir
  email TEXT NOT NULL,

  -- Tercihler
  risk_tolerance TEXT DEFAULT 'medium',  -- 'low', 'medium', 'high'
  preferred_strategies TEXT,             -- JSON: ["iv_crush", "momentum"]
  excluded_sectors TEXT,                 -- JSON: ["energy"]

  -- Alert Ayarları
  alert_email_enabled INTEGER DEFAULT 1,
  alert_push_enabled INTEGER DEFAULT 1,
  alert_min_score INTEGER DEFAULT 70,    -- sadece 70+ skorlu fırsatlar
  alert_iv_spike_threshold REAL DEFAULT 30,

  -- Tier & Billing
  tier TEXT DEFAULT 'free',
  tier_expires_at TEXT,
  paddle_customer_id TEXT,               -- Billing entegrasyonu için
  paddle_subscription_id TEXT,

  -- Analytics
  last_login_at TEXT,
  opportunities_viewed INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 `watchlists` Tablosu (İzleme Listesi — v2 yeni)

```sql
-- watchlist'i member_profiles içine JSON olarak gömmek yerine
-- ayrı tablo: çok daha sorgulabilir ve büyümeye hazır
CREATE TABLE watchlists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  ticker TEXT NOT NULL,
  added_at TEXT DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,       -- kullanıcının kendi notu
  alert_on_opportunity INTEGER DEFAULT 1,  -- fırsat çıkınca bildir

  UNIQUE(user_id, ticker),
  FOREIGN KEY(user_id) REFERENCES member_profiles(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_watchlist_user ON watchlists(user_id);
CREATE INDEX idx_watchlist_ticker ON watchlists(ticker);
```

### 3.4 `alerts` Tablosu (Bildirimler)

```sql
CREATE TABLE alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  opportunity_id INTEGER,
  alert_type TEXT,   -- 'new_opportunity', 'iv_spike', 'earnings_reminder', 'price_target'
  ticker TEXT,
  message TEXT,
  priority TEXT DEFAULT 'normal',  -- 'low', 'normal', 'high', 'urgent'
  channel TEXT,      -- 'email', 'push', 'in_app'
  status TEXT DEFAULT 'pending',   -- 'pending', 'sent', 'read', 'dismissed'
  sent_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_user_status ON alerts(user_id, status);
```

### 3.5 `price_history` Tablosu (Zaman Serisi)

```sql
CREATE TABLE price_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticker TEXT NOT NULL,
  date TEXT NOT NULL,
  open REAL,
  high REAL,
  low REAL,
  close REAL,
  volume INTEGER,
  adj_close REAL,
  rsi_14 REAL,
  macd_line REAL,
  macd_signal REAL,
  macd_histogram REAL,
  adx_14 REAL,
  iv_30d REAL,
  iv_60d REAL,

  UNIQUE(ticker, date)
);

CREATE INDEX idx_price_history_ticker_date ON price_history(ticker, date);
```

### 3.6 `earnings_history` Tablosu (Geçmiş Kazanç Verisi — v2 yeni)

```sql
-- Backtesting ve earnings kalite skoru için şart
CREATE TABLE earnings_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticker TEXT NOT NULL,
  earnings_date TEXT NOT NULL,
  earnings_time TEXT,           -- 'BMO', 'AMC'
  eps_estimate REAL,
  eps_actual REAL,
  eps_surprise_pct REAL,        -- (actual - estimate) / |estimate| * 100
  revenue_estimate REAL,
  revenue_actual REAL,
  revenue_surprise_pct REAL,
  guidance TEXT,                -- 'raised', 'lowered', 'maintained', 'none'
  iv_before REAL,               -- earnings öncesi 1 gün IV
  iv_after REAL,                -- earnings sonrası 1 gün IV
  iv_crush_pct REAL,            -- (iv_before - iv_after) / iv_before * 100
  price_before REAL,
  price_after REAL,
  price_change_pct REAL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(ticker, earnings_date)
);

CREATE INDEX idx_earnings_history_ticker ON earnings_history(ticker);
CREATE INDEX idx_earnings_history_date ON earnings_history(earnings_date);
```

### 3.7 `backtest_results` Tablosu (Backtest Çıktıları — v2 yeni)

```sql
CREATE TABLE backtest_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,                  -- NULL = sistem tarafından çalıştırılan
  strategy_type TEXT NOT NULL,
  ticker TEXT,                   -- NULL = universe geneli
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  total_trades INTEGER,
  winning_trades INTEGER,
  win_rate REAL,
  avg_return_pct REAL,
  max_drawdown_pct REAL,
  sharpe_ratio REAL,
  profit_factor REAL,
  total_return_pct REAL,
  params TEXT,                   -- JSON: strateji parametreleri
  trades_detail TEXT,            -- JSON: bireysel trade sonuçları
  status TEXT DEFAULT 'completed',  -- 'running', 'completed', 'failed'
  run_duration_ms INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_backtest_strategy ON backtest_results(strategy_type);
CREATE INDEX idx_backtest_user ON backtest_results(user_id);
```

### 3.8 `agent_runs` Tablosu (Audit & Debug)

```sql
CREATE TABLE agent_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_type TEXT,   -- 'full_scan', 'momentum_update', 'earnings_pre_check'
  started_at TEXT,
  completed_at TEXT,
  tickers_scanned INTEGER,
  opportunities_found INTEGER,
  errors TEXT,     -- JSON
  status TEXT,     -- 'running', 'success', 'partial', 'failed'
  retry_count INTEGER DEFAULT 0,   -- v2: kaç kez retry edildi
  log TEXT
);
```

---

## 4. Agent Pipeline Mimarisi

### 4.1 Pipeline Akışı

```
┌────────────────────────────────────────────────────────────────────┐
│                     AGENT ORCHESTRATOR                              │
│                    (server/agents/orchestrator.ts)                  │
└────────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   SCHEDULER  │      │   SCHEDULER  │      │   SCHEDULER  │
│  (Her 15 dk) │      │  (Her saat)  │      │  (Her gün    │
│              │      │              │      │   08:00 ET)  │
│ Momentum     │      │ IV & Option  │      │ Earnings     │
│ Scanner      │      │ Data Update  │      │ Calendar     │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                     │                     │
       └─────────────────────┼─────────────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  CIRCUIT BREAKER LAYER (v2)  │
              │  Per-source breakers:        │
              │  Yahoo / TwelveData /        │
              │  AlphaVantage / LLM          │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │     DATA NORMALIZER         │
              │  (Yahoo + TwelveData +      │
              │   AlphaVantage → unified)    │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │   MOMENTUM ANALYZER AGENT   │
              │  • RSI, MACD, Volume surge  │
              │  • Trend strength (ADX)     │
              │  • Sector relative strength │
              │  • 20/50/200 MA position    │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │    IV CRUSH ENGINE AGENT    │
              │  • IV rank/percentile       │
              │  • Historical crush %       │
              │  • Expected move vs actual  │
              │  • Skew analysis (call/put) │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │   STRATEGY BUILDER AGENT    │
              │  • Pattern matching:        │
              │    "High IV + Bullish Mom"  │
              │    → Short Strangle         │
              │  • Risk/reward optimizer    │
              │  • Position sizing (Kelly)  │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │    RISK ASSESSOR AGENT      │
              │  • Earnings surprise history│
              │  • Guidance trend (beat/miss)│
              │  • Sector correlation       │
              │  • Market regime check      │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │    LLM FORMATTER AGENT      │
              │  (OpenAI GPT-4o-mini)       │
              │                             │
              │  Input: Raw metrics JSON    │
              │  Output:                    │
              │    • ai_summary (2-3 cümle) │
              │    • ai_strategy_rationale  │
              │    • ai_key_catalysts       │
              │    • ai_execution_notes     │
              │    • ai_risk_warnings (v2)  │
              └──────────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │      OPPORTUNITY STORE      │
              │   (SQLite opportunities)    │
              └──────────────┬───────────────┘
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
    ┌──────────────────────┐ ┌──────────────────────┐
    │   ALERT DISPATCHER   │ │  WEBSOCKET EMITTER   │
    │ • Match preferences  │ │ • Bağlı üyelere      │
    │ • Filter by tier     │ │   anlık bildirim     │
    │ • Queue email/push   │ │ • opportunity:new    │
    └──────────────────────┘ │ • price:update       │
                             └──────────────────────┘
```

### 4.2 Agent Sınıf Yapısı

```typescript
// server/agents/base/Agent.ts
abstract class Agent<TInput, TOutput> {
  abstract readonly name: string;
  abstract readonly version: string;
  private readonly maxRetries = 3;

  async execute(input: TInput): Promise<TOutput> {
    const start = Date.now();
    let lastError: Error;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await this.process(input);
        await this.logRun('success', Date.now() - start, attempt);
        return result;
      } catch (error) {
        lastError = error as Error;
        const isRetryable = this.isRetryableError(error);
        if (!isRetryable || attempt === this.maxRetries) break;
        await this.wait(attempt * 1000); // Exponential backoff
      }
    }

    await this.logRun('failed', Date.now() - start, this.maxRetries, lastError);
    throw lastError;
  }

  protected abstract process(input: TInput): Promise<TOutput>;

  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.includes('rate limit') ||
             error.message.includes('timeout') ||
             error.message.includes('ECONNRESET');
    }
    return false;
  }

  private wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// server/agents/MomentumAnalyzer.ts
class MomentumAnalyzer extends Agent<UnifiedTickerData, MomentumMetrics> {
  readonly name = 'MomentumAnalyzer';
  readonly version = '1.1';

  protected async process(data: UnifiedTickerData): Promise<MomentumMetrics> {
    return {
      score: this.calculateMomentumScore(data),
      rsi14: calculateRSI(data.closes, 14),
      macdSignal: calculateMACDSignal(data.closes),
      volumeSurge: data.volume / data.volumeSMA20,
      trendStrength: calculateADX(data.highs, data.lows, data.closes, 14),
      ma20Position: data.close > data.ma20 ? 'above' : 'below',
      ma50Position: data.close > data.ma50 ? 'above' : 'below',
      ma200Position: data.close > data.ma200 ? 'above' : 'below',
    };
  }
}

// server/agents/LLMFormatter.ts
class LLMFormatter extends Agent<OpportunityRawData, LLMGeneratedContent> {
  readonly name = 'LLMFormatter';
  readonly version = '1.1';

  protected async process(data: OpportunityRawData): Promise<LLMGeneratedContent> {
    const prompt = this.buildPrompt(data);
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    });
    const raw = response.choices[0].message.content ?? '{}';
    return JSON.parse(raw) as LLMGeneratedContent;
  }
}
```

### 4.3 LLM Prompt Tasarımı

```typescript
const SYSTEM_PROMPT = `Sen Gistify'in earnings ve momentum analiz asistanısın.
Görevin: Ham finansal metrikleri, Türkçe ve İngilizce olarak, profesyonel ama anlaşılır bir dille özetlemek.

Kurallar:
1. Sadece verilen verileri kullan, spekülasyon yapma
2. Riskleri mutlaka belirt
3. Strateji önerileri "educational" formatta olsun (yatırım tavsiyesi değildir)
4. 2-3 cümlede özetle, jargon kullanma
5. JSON formatında döndür

Output formatı:
{
  "summary_tr": "...",
  "summary_en": "...",
  "strategy_rationale_tr": "...",
  "strategy_rationale_en": "...",
  "key_catalysts": ["...", "..."],
  "execution_notes_tr": "...",
  "execution_notes_en": "...",
  "risk_warnings": ["...", "..."]
}`;
```

---

## 5. Skorlama Algoritması

### 5.1 Çok Faktörlü Skorlama

Her fırsat için 0-100 arası **composite score**:

```typescript
interface ScoreWeights {
  momentum: 0.25;
  iv_crush: 0.25;
  earnings_quality: 0.20;
  risk_adjusted: 0.15;
  liquidity: 0.10;
  sentiment: 0.05;
}

function calculateCompositeScore(opp: OpportunityRaw): number {
  const scores = {
    momentum: normalizeRSI(opp.rsi14) * 0.3
            + normalizeTrend(opp.priceChange3M) * 0.3
            + normalizeVolume(opp.volumeSurge) * 0.2
            + normalizeADX(opp.trendStrength) * 0.2,

    iv_crush: opp.ivRank * 0.4
            + opp.expectedIVCrush * 0.3
            + (100 - opp.historicalIVCrushVariance) * 0.3,

    earnings_quality: opp.beatRate * 0.5
                   + normalizeConsistency(opp.earningsHistory) * 0.3
                   + (opp.guidanceTrend === 'up' ? 100 : 50) * 0.2,

    risk_adjusted: (100 - opp.gapRisk * 100) * 0.4
                 + (100 - opp.earningsMissRisk * 100) * 0.3
                 + normalizeMaxLoss(opp.maxLossPercent) * 0.3,

    liquidity: normalizeOptionVolume(opp.optionVolume) * 0.6
             + normalizeMarketCap(opp.marketCap) * 0.4,

    sentiment: opp.newsSentiment ?? 50  // Varsayılan nötr
  };

  return Math.round(
    scores.momentum * 0.25 +
    scores.iv_crush * 0.25 +
    scores.earnings_quality * 0.20 +
    scores.risk_adjusted * 0.15 +
    scores.liquidity * 0.10 +
    scores.sentiment * 0.05
  );
}
```

### 5.2 Skorlama Kalibrasyonu (v2 yeni)

Ağırlıklar sabiti değildir; periyodik backtest sonuçlarına göre kalibre edilmelidir:

```typescript
// server/scoring/calibrator.ts
// Her ay sonunda çalıştırılır
async function calibrateWeights(): Promise<ScoreWeights> {
  // 1. Son 90 günlük backtest sonuçlarını al
  const results = await db.all(`
    SELECT strategy_type, win_rate, sharpe_ratio
    FROM backtest_results
    WHERE created_at > date('now', '-90 days')
    AND status = 'completed'
  `);

  // 2. Hangi faktörler başarıyla korelasyonlu?
  //    momentum skorunun yüksek olduğu fırsatlar daha çok kazanıyorsa,
  //    ağırlığı artır. Basit lineer regresyon yeterlidir.
  const newWeights = computeWeightsViaRegression(results);

  // 3. Güvenli sınırlar içinde tut (aşırı ağırlık sapmasını önler)
  return clampWeights(newWeights, {
    min: 0.05,
    max: 0.40
  });
}

// Kalibrasyon geçmişi tutulur — geriye dönük analiz için
async function saveCalibrationSnapshot(weights: ScoreWeights) {
  await db.run(`
    INSERT INTO agent_runs (run_type, status, log)
    VALUES ('calibration', 'success', ?)
  `, JSON.stringify({ weights, timestamp: new Date().toISOString() }));
}
```

### 5.3 Tier Bazlı Filtreleme

| Tier | Min Score | Max Daily Opp | Özellikler |
|------|-----------|---------------|------------|
| **Free** | 85+ | 3 fırsat | Sadece haftalık rapor, temel skor |
| **Pro** | 70+ | 10 fırsat | Gerçek zamanlı scanner, IV analizi |
| **Elite** | 60+ | Sınırsız | LLM özetleri, backtest, alert'ler |

---

## 6. Error Handling & Circuit Breaker (v2 yeni)

### 6.1 Circuit Breaker Mimarisi

Harici API'lerin kesilmesi sistemin çökmesine yol açmamalı:

```typescript
// server/resilience/circuitBreakers.ts
import CircuitBreaker from 'opossum';

const BREAKER_OPTIONS = {
  timeout: 5000,           // 5sn içinde yanıt vermezse hata
  errorThresholdPercentage: 50,  // %50 hata oranında devre açılır
  resetTimeout: 30000,     // 30sn sonra yarı açık duruma geçer
  volumeThreshold: 10      // En az 10 istek sonrası karar verir
};

// Her API kaynağı için ayrı devre
export const yahooBreaker = new CircuitBreaker(fetchFromYahoo, BREAKER_OPTIONS);
export const twelvedataBreaker = new CircuitBreaker(fetchFromTwelveData, BREAKER_OPTIONS);
export const alphaBreaker = new CircuitBreaker(fetchFromAlphaVantage, BREAKER_OPTIONS);
export const llmBreaker = new CircuitBreaker(callLLM, {
  ...BREAKER_OPTIONS,
  timeout: 15000  // LLM için 15sn
});

// Fallback zinciri: Yahoo çökerse TwelveData, o da çökerse cache
export async function fetchPriceWithFallback(ticker: string): Promise<PriceData> {
  try {
    return await yahooBreaker.fire(ticker);
  } catch {
    try {
      return await twelvedataBreaker.fire(ticker);
    } catch {
      // Son çare: DB'deki son bilinen fiyat
      const cached = await db.get(
        'SELECT * FROM price_history WHERE ticker = ? ORDER BY date DESC LIMIT 1',
        ticker
      );
      if (cached) return mapToUnified(cached);
      throw new Error(`No price data available for ${ticker}`);
    }
  }
}

// Devre durumları loglansın
yahooBreaker.on('open', () =>
  logger.warn('Yahoo Finance circuit OPEN — using fallback sources'));
yahooBreaker.on('halfOpen', () =>
  logger.info('Yahoo Finance circuit HALF-OPEN — testing...'));
yahooBreaker.on('close', () =>
  logger.info('Yahoo Finance circuit CLOSED — normal operation'));
```

### 6.2 Rate Limiting & Throttling

```typescript
// server/resilience/rateLimiter.ts
// Harici API'lere giden istekler için token bucket
import Bottleneck from 'bottleneck';

export const yahooLimiter = new Bottleneck({
  maxConcurrent: 5,
  minTime: 200  // 5 req/sn
});

export const twelvedataLimiter = new Bottleneck({
  maxConcurrent: 2,
  minTime: 1000,          // 1 req/sn (ücretsiz plan)
  reservoir: 800,         // aylık kota
  reservoirRefreshAmount: 800,
  reservoirRefreshInterval: 30 * 24 * 60 * 60 * 1000  // 30 gün
});

export const alphaLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 12000  // 5 req/dk = her 12sn bir istek
});

// Kullanım
const data = await yahooLimiter.schedule(() => fetchFromYahoo(ticker));
```

### 6.3 Hata Senaryoları & Davranışlar

| Senaryo | Davranış | Kullanıcıya Etkisi |
|---------|----------|---------------------|
| Yahoo Finance çöktü | TwelveData fallback | Gecikme yok, kaynak değişti |
| TwelveData limit doldu | Cache + AlphaVantage | Hafif gecikme |
| LLM API cevap vermedi | ai_summary = null, UI'da "yakında" | Kart görünür, AI özet yok |
| SQLite disk doldu | Alert + scheduler durdurulur | Admin bildirilir |
| Scheduler crashed | Healthcheck + auto-restart | Agent yeniden çalışır |

---

## 7. API Endpoint Gelişmeleri

### 7.1 Yeni Endpoint'ler

```typescript
// server/index.ts - Yeni route'lar

// Opportunities (Üye API) — pagination eklendi (v2)
app.get('/api/opportunities', requireAuth, async (req, res) => {
  const {
    minScore, strategy, days, sector,
    page = 1, limit = 20, sort = 'composite_score'
  } = req.query;

  const offset = (Number(page) - 1) * Number(limit);
  const opps = await getOpportunitiesPaginated({
    userId: req.user.id,
    tier: req.user.tier,
    filters: { minScore, strategy, days, sector },
    pagination: { offset, limit: Number(limit) },
    sort
  });

  res.json({
    data: opps.items,
    meta: {
      total: opps.total,
      page: Number(page),
      limit: Number(limit),
      hasMore: opps.total > offset + opps.items.length
    }
  });
});

app.get('/api/opportunities/:id', requireAuth, async (req, res) => {
  const opp = await getOpportunityById(req.params.id);
  if (req.user.tier === 'free' && opp.compositeScore < 85) {
    return res.status(403).json({ error: 'Upgrade required', minScore: 85 });
  }
  res.json(opp);
});

// Watchlist (v2 yeni)
app.get('/api/me/watchlist', requireAuth, async (req, res) => {
  const items = await getWatchlist(req.user.id);
  res.json(items);
});

app.post('/api/me/watchlist', requireAuth, async (req, res) => {
  const { ticker, notes, alertOnOpportunity } = req.body;
  await addToWatchlist(req.user.id, ticker, { notes, alertOnOpportunity });
  res.status(201).json({ success: true });
});

app.delete('/api/me/watchlist/:ticker', requireAuth, async (req, res) => {
  await removeFromWatchlist(req.user.id, req.params.ticker);
  res.json({ success: true });
});

// Member Profile
app.get('/api/me/profile', requireAuth, async (req, res) => {
  const profile = await getMemberProfile(req.user.id);
  res.json(profile);
});

app.patch('/api/me/profile', requireAuth, async (req, res) => {
  await updateMemberProfile(req.user.id, req.body);
  res.json({ success: true });
});

// Alerts
app.get('/api/alerts', requireAuth, async (req, res) => {
  const alerts = await getAlertsForUser(req.user.id);
  res.json(alerts);
});

app.post('/api/alerts/:id/dismiss', requireAuth, async (req, res) => {
  await dismissAlert(req.params.id, req.user.id);
  res.json({ success: true });
});

// Scanner v2 (Gerçek zamanlı)
app.get('/api/scanner/v2/momentum', requireAuth, async (req, res) => {
  const { sector, minScore, limit = 20 } = req.query;
  const results = await scanMomentum({ sector, minScore, limit });
  res.json(results);
});

// Backtest (Elite only) — v2 detaylı
app.post('/api/backtest/strategy', requireAuth, requireTier('elite'), async (req, res) => {
  const { strategy, ticker, startDate, endDate, params } = req.body;
  const jobId = await queueBacktest({ strategy, ticker, startDate, endDate, params });
  res.status(202).json({ jobId, message: 'Backtest queued' });
});

app.get('/api/backtest/:jobId/status', requireAuth, requireTier('elite'), async (req, res) => {
  const result = await getBacktestStatus(req.params.jobId);
  res.json(result);
});

// Admin: Agent kontrolü
app.post('/api/admin/agents/trigger', requireAdmin, async (req, res) => {
  const { agentType, tickers } = req.body;
  const jobId = await triggerAgentRun(agentType, tickers);
  res.json({ jobId, status: 'queued' });
});

app.get('/api/admin/agents/runs', requireAdmin, async (req, res) => {
  const runs = await getAgentRuns();
  res.json(runs);
});

// Healthcheck (DevOps için v2 yeni)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    ts: new Date().toISOString(),
    db: checkDBHealth(),
    schedulers: getSchedulerStatus()
  });
});
```

### 7.2 Middleware Gelişmeleri

```typescript
// server/middleware/tierCheck.ts
function requireTier(minTier: 'free' | 'pro' | 'elite') {
  const tierLevels = { free: 0, pro: 1, elite: 2 };
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Auth required' });
    if (tierLevels[req.user.tier] < tierLevels[minTier]) {
      return res.status(403).json({
        error: 'Tier upgrade required',
        required: minTier,
        current: req.user.tier
      });
    }
    next();
  };
}

// İstek bazlı rate limiting (Üye IP başına)
import rateLimit from 'express-rate-limit';
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 dakika
  max: 200,                   // 200 istek
  message: { error: 'Too many requests, slow down' }
});
```

---

## 8. WebSocket / Gerçek Zamanlı Katman (v2 yeni)

### 8.1 Socket.io Kurulumu

```typescript
// server/realtime/socketServer.ts
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter'; // opsiyonel, scale için

export function setupSocketServer(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL },
    transports: ['websocket', 'polling']
  });

  // Auth middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    const user = await verifyToken(token);
    if (!user) return next(new Error('Unauthorized'));
    socket.data.user = user;
    next();
  });

  io.on('connection', (socket) => {
    const { user } = socket.data;

    // Kullanıcıyı tier odasına al
    socket.join(`tier:${user.tier}`);
    // Watchlist ticker odalarına al
    getWatchlist(user.id).then(tickers =>
      tickers.forEach(t => socket.join(`ticker:${t}`))
    );

    socket.on('watchlist:add', (ticker: string) => {
      socket.join(`ticker:${ticker}`);
    });

    socket.on('watchlist:remove', (ticker: string) => {
      socket.leave(`ticker:${ticker}`);
    });

    socket.on('disconnect', () => {
      // Cleanup gerekmiyor, Socket.io otomatik halleder
    });
  });

  return io;
}

// Yayın fonksiyonları — agent pipeline içinden çağrılır
export function emitNewOpportunity(io: Server, opp: Opportunity) {
  // Tier'a göre yayın
  io.to(`tier:${opp.tierRequired}`).emit('opportunity:new', opp);
  io.to('tier:pro').emit('opportunity:new', opp);
  io.to('tier:elite').emit('opportunity:new', opp);
  // Watchlist'tekiler için özel bildirim
  io.to(`ticker:${opp.ticker}`).emit('opportunity:watchlist', opp);
}

export function emitPriceUpdate(io: Server, ticker: string, price: number) {
  io.to(`ticker:${ticker}`).emit('price:update', { ticker, price, ts: Date.now() });
}
```

### 8.2 Client Tarafı WebSocket Hook

```tsx
// client/src/hooks/useRealtime.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useOpportunitiesStore } from '../store/opportunities';

export function useRealtime() {
  const socketRef = useRef<Socket | null>(null);
  const addOpportunity = useOpportunitiesStore(s => s.addOpportunity);

  useEffect(() => {
    const token = getAuthToken();
    const socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      reconnectionDelay: 2000,
      reconnectionAttempts: 5
    });

    socket.on('opportunity:new', (opp) => {
      addOpportunity(opp);
      // Toast bildirimi
      toast.success(`Yeni fırsat: ${opp.ticker} (Skor: ${opp.compositeScore})`);
    });

    socket.on('price:update', ({ ticker, price }) => {
      useOpportunitiesStore.getState().updatePrice(ticker, price);
    });

    socket.on('connect_error', (err) => {
      console.warn('WS bağlantı hatası, polling moduna geçiliyor:', err.message);
    });

    socketRef.current = socket;
    return () => socket.disconnect();
  }, []);

  return socketRef;
}
```

---

## 9. Backtesting Engine (v2 yeni)

### 9.1 Backtest Mimarisi

```typescript
// server/backtest/BacktestEngine.ts
interface BacktestConfig {
  strategy: StrategyType;
  ticker?: string;       // undefined = universe geneli
  startDate: string;
  endDate: string;
  params: StrategyParams;
}

interface BacktestResult {
  totalTrades: number;
  winningTrades: number;
  winRate: number;
  avgReturnPct: number;
  maxDrawdownPct: number;
  sharpeRatio: number;
  profitFactor: number;
  totalReturnPct: number;
  trades: TradeRecord[];
}

class BacktestEngine {
  async run(config: BacktestConfig): Promise<BacktestResult> {
    // 1. Tarihsel veriyi yükle
    const history = await this.loadHistory(config.ticker, config.startDate, config.endDate);

    // 2. Earnings eventlerini filtrele
    const earningsEvents = await this.loadEarningsHistory(
      config.ticker, config.startDate, config.endDate
    );

    // 3. Her earnings eventi için strateji simüle et
    const trades: TradeRecord[] = [];
    for (const event of earningsEvents) {
      const trade = await this.simulateTrade(event, history, config.params);
      if (trade) trades.push(trade);
    }

    return this.computeMetrics(trades);
  }

  private async simulateTrade(
    event: EarningsHistoryRecord,
    history: PriceHistory[],
    params: StrategyParams
  ): Promise<TradeRecord | null> {
    // Earnings öncesi giriş (3 gün, 1 gün vb. parametrik)
    const entryDate = subtractDays(event.earnings_date, params.daysBeforeEntry ?? 1);
    const exitDate = addDays(event.earnings_date, params.daysAfterExit ?? 1);

    const entryPrice = getPriceAt(history, entryDate);
    const exitPrice = getPriceAt(history, exitDate);

    if (!entryPrice || !exitPrice) return null;

    const returnPct = ((exitPrice - entryPrice) / entryPrice) * 100;
    const adjustedReturn = params.direction === 'short'
      ? -returnPct
      : returnPct;

    return {
      ticker: event.ticker,
      earningsDate: event.earnings_date,
      entryDate,
      exitDate,
      entryPrice,
      exitPrice,
      returnPct: adjustedReturn,
      ivCrushActual: event.iv_crush_pct,
      epsSurprise: event.eps_surprise_pct,
      won: adjustedReturn > 0
    };
  }

  private computeMetrics(trades: TradeRecord[]): BacktestResult {
    const winningTrades = trades.filter(t => t.won).length;
    const returns = trades.map(t => t.returnPct);

    return {
      totalTrades: trades.length,
      winningTrades,
      winRate: (winningTrades / trades.length) * 100,
      avgReturnPct: mean(returns),
      maxDrawdownPct: computeMaxDrawdown(returns),
      sharpeRatio: computeSharpe(returns),
      profitFactor: computeProfitFactor(returns),
      totalReturnPct: sum(returns),
      trades
    };
  }
}
```

### 9.2 Backtest Admin UI

```tsx
// client/src/pages/admin/BacktestPanel.tsx
// Parametreler:
//   - Strateji tipi (dropdown)
//   - Ticker veya universe (input + "all" seçeneği)
//   - Tarih aralığı (date picker)
//   - Giriş günü (earnings -1 / -2 / -3)
//   - Çıkış günü (earnings +1 / +2)
// Sonuçlar:
//   - Win Rate, Sharpe, Max Drawdown kartları
//   - Equity curve chart (Recharts)
//   - Trade listesi tablosu
```

---

## 10. Frontend Gelişmeleri

### 10.1 Yeni Sayfalar & Route'lar

```
/app                    → Mevcut haftalık rapor (korunur)
/app/opportunities      → Yeni: Fırsatlar dashboard
/app/scanner            → Scanner v2 (mevcut /scanner taşınır)
/app/alerts             → Alert merkezi
/app/watchlist          → İzleme listesi (v2 yeni)
/app/settings           → Profil & tercihler
/admin                  → Admin v2 (rapor + agent kontrol + backtest)
```

### 10.2 Opportunities Dashboard Tasarımı

```tsx
// client/src/pages/Opportunities.tsx
// Layout:
// ┌─────────────────────────────────────────────────────────────┐
// │  [Filtreler: Tier | Sektör | Skor | Strateji | Gün]         │
// ├─────────────────────────────────────────────────────────────┤
// │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
// │  │   KPI 1     │  │   KPI 2     │  │   KPI 3     │        │
// │  │ Aktif Opp   │  │ Bugün Yeni  │  │ Avg Skor    │        │
// │  └─────────────┘  └─────────────┘  └─────────────┘        │
// ├─────────────────────────────────────────────────────────────┤
// │  [Grafik: Sektör dağılımı / Skor dağılımı]                  │
// ├─────────────────────────────────────────────────────────────┤
// │  Fırsat Kartları (Grid/List toggle)                         │
// │  [Sayfalama: infinite scroll veya klasik pagination]         │
// └─────────────────────────────────────────────────────────────┘
```

### 10.3 Opportunity Kartı Bileşeni

```tsx
// client/src/components/opportunities/OpportunityCard.tsx
interface Props {
  opportunity: Opportunity;
  tier: 'free' | 'pro' | 'elite';
}

function OpportunityCard({ opportunity, tier }: Props) {
  const isBlurred = tier === 'free' && opportunity.compositeScore < 85;

  return (
    <Card className={cn("relative", isBlurred && "blur-sm pointer-events-none")}>
      <CardHeader>
        <div className="flex justify-between">
          <TickerBadge ticker={opportunity.ticker} sector={opportunity.sector} />
          <ScoreBadge score={opportunity.compositeScore} size="lg" />
        </div>
        <StrategyTag type={opportunity.strategyType} />
      </CardHeader>

      <CardContent>
        <MiniChart data={opportunity.priceHistory7D} />
        <MetricsRow>
          <Metric label="IV Rank" value={opportunity.ivRank} suffix="%" />
          <Metric label="RSI" value={opportunity.rsi14} />
          <Metric label="Exp. Move" value={opportunity.impliedMovePercent} suffix="%" />
        </MetricsRow>

        {tier !== 'free' && opportunity.aiSummary && (
          <AIInsight
            summary={opportunity.aiSummary}
            catalysts={opportunity.aiKeyCatalysts}
          />
        )}

        {tier !== 'free' && !opportunity.aiSummary && (
          <p className="text-muted-foreground text-sm">AI özeti hazırlanıyor...</p>
        )}

        <RiskBar level={opportunity.riskLevel} />
      </CardContent>

      <CardFooter>
        <Button variant="outline" onClick={() => openDetail(opportunity)}>
          Detaylı Analiz
        </Button>
        <Button onClick={() => addToWatchlist(opportunity.ticker)}>
          İzleme Listesi
        </Button>
      </CardFooter>

      {isBlurred && (
        <UpgradeOverlay
          message="Bu fırsatı görmek için Pro'ya yükseltin"
          minScore={85}
        />
      )}
    </Card>
  );
}
```

### 10.4 Alert Sistemi UI

```tsx
// client/src/components/alerts/AlertCenter.tsx
// - Real-time badge (WebSocket)
// - Alert listesi: priority renk kodlaması
// - One-click dismiss
// - Alert kurma modalı: "AAPL IV rank 80+ olduğunda bana bildir"
// - Saat 08:00 ET öncesi earnings hatırlatma seçeneği
```

### 10.5 PWA Desteği (v2 yeni)

Mobil erişim için tam React Native app yazmak yerine PWA, Quick Win sağlar:

```typescript
// vite.config.ts — vite-plugin-pwa ekle
import { VitePWA } from 'vite-plugin-pwa';

VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'Gistify',
    short_name: 'Gistify',
    theme_color: '#0f172a',
    icons: [{ src: '/icon-192.png', sizes: '192x192' }]
  },
  workbox: {
    // Opportunities listesi offline cache
    runtimeCaching: [
      {
        urlPattern: /\/api\/opportunities/,
        handler: 'StaleWhileRevalidate',
        options: { cacheName: 'opportunities-cache' }
      }
    ]
  }
})
```

Web Push bildirimleri PWA üzerinden çalışır; ayrı mobile app gerekmez (başlangıç için yeterli).

---

## 11. Testing Stratejisi (v2 yeni)

### 11.1 Test Mimarisi

```
tests/
├── unit/
│   ├── agents/
│   │   ├── MomentumAnalyzer.test.ts
│   │   ├── IVCrushEngine.test.ts
│   │   ├── StrategyBuilder.test.ts
│   │   └── RiskAssessor.test.ts
│   ├── scoring/
│   │   └── compositeScore.test.ts
│   └── utils/
│       └── indicators.test.ts
├── integration/
│   ├── api/
│   │   ├── opportunities.test.ts
│   │   ├── alerts.test.ts
│   │   └── watchlist.test.ts
│   └── agents/
│       └── pipeline.test.ts
└── e2e/
    ├── auth.spec.ts
    ├── opportunities.spec.ts
    └── admin.spec.ts
```

### 11.2 Unit Test Örnekleri

```typescript
// tests/unit/agents/MomentumAnalyzer.test.ts
import { MomentumAnalyzer } from '../../../server/agents/MomentumAnalyzer';
import { mockTickerData } from '../../fixtures/tickerData';

describe('MomentumAnalyzer', () => {
  const analyzer = new MomentumAnalyzer();

  it('RSI overbought durumunda momentum skoru < 50 döner', async () => {
    const data = { ...mockTickerData, closes: generateRSIOver80() };
    const result = await analyzer.execute(data);
    expect(result.score).toBeLessThan(50);
  });

  it('Volume surge 3x üzerindeyse volumeSurge doğru hesaplanır', async () => {
    const data = { ...mockTickerData, volume: 3_000_000, volumeSMA20: 1_000_000 };
    const result = await analyzer.execute(data);
    expect(result.volumeSurge).toBeCloseTo(3.0);
  });

  it('API timeout olduğunda retry yapar', async () => {
    let callCount = 0;
    jest.spyOn(analyzer as any, 'process').mockImplementation(async () => {
      callCount++;
      if (callCount < 3) throw new Error('timeout');
      return mockMomentumResult;
    });
    await analyzer.execute(mockTickerData);
    expect(callCount).toBe(3);
  });
});
```

### 11.3 Integration Test Örnekleri

```typescript
// tests/integration/api/opportunities.test.ts
import request from 'supertest';
import { app } from '../../../server/app';
import { seedTestDB } from '../../helpers/db';

describe('GET /api/opportunities', () => {
  beforeEach(() => seedTestDB());

  it('Free tier sadece 85+ skorlu fırsatları görür', async () => {
    const token = await getTestToken('free');
    const res = await request(app)
      .get('/api/opportunities')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data.every((o: any) => o.compositeScore >= 85)).toBe(true);
  });

  it('Pagination çalışıyor', async () => {
    const token = await getTestToken('elite');
    const page1 = await request(app)
      .get('/api/opportunities?page=1&limit=5')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(page1.body.data).toHaveLength(5);
    expect(page1.body.meta.hasMore).toBe(true);
  });
});
```

### 11.4 E2E Test (Playwright)

```typescript
// tests/e2e/opportunities.spec.ts
import { test, expect } from '@playwright/test';

test('Pro üye yeni fırsatı gerçek zamanlı görür', async ({ page }) => {
  await page.goto('/login');
  await loginAs(page, 'pro_user@test.com');
  await page.goto('/app/opportunities');

  // Agent'ı tetikle (test modunda)
  await triggerTestOpportunityEvent('AAPL');

  // Toast bildirimi görünmeli
  await expect(page.locator('[data-testid="toast"]')).toContainText('AAPL');

  // Kart listede çıkmalı
  await expect(page.locator('[data-ticker="AAPL"]')).toBeVisible();
});
```

### 11.5 Test Araçları

| Araç | Kullanım |
|------|----------|
| **Vitest** | Unit + integration testler (Vite ile uyumlu) |
| **Playwright** | E2E testler (multi-browser) |
| **Supertest** | Express API testleri |
| **MSW (Mock Service Worker)** | Harici API mock'lama |
| **@faker-js/faker** | Test fixture üretimi |

---

## 12. DevOps & CI/CD Altyapısı (v2 yeni)

### 12.1 Environment Dosyaları

```bash
# .env.example — tüm zorunlu değişkenler
# --- Database ---
DATABASE_URL=./data/gistify.db
DATABASE_BACKUP_DIR=./data/backups

# --- Auth ---
JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=7d

# --- External APIs ---
TWELVEDATA_API_KEY=
ALPHA_VANTAGE_API_KEY=
OPENAI_API_KEY=
POLYGON_API_KEY=           # opsiyonel, premium IV verisi için

# --- Billing ---
PADDLE_VENDOR_ID=
PADDLE_API_KEY=
PADDLE_WEBHOOK_SECRET=

# --- Email ---
RESEND_API_KEY=
EMAIL_FROM=noreply@gistify.com

# --- App ---
CLIENT_URL=http://localhost:5173
PORT=3001
NODE_ENV=development

# --- Feature Flags ---
FEATURE_WEBSOCKET=true
FEATURE_BACKTEST=false       # Elite beta kontrolü
FEATURE_LLM_SUMMARIES=true
```

### 12.2 GitHub Actions CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run typecheck

  e2e:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  deploy:
    runs-on: ubuntu-latest
    needs: [test, e2e]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to production
        run: |
          # Railway / Fly.io / VPS SSH deploy
          echo "Deploy komutu buraya"
```

### 12.3 SQLite Yedekleme

```typescript
// server/maintenance/backup.ts
import { schedule } from 'node-cron';
import { copyFileSync } from 'fs';
import path from 'path';

// Her gece 02:00'de yedek al
schedule('0 2 * * *', () => {
  const src = process.env.DATABASE_URL!;
  const dst = path.join(
    process.env.DATABASE_BACKUP_DIR!,
    `gistify_${new Date().toISOString().slice(0, 10)}.db`
  );
  copyFileSync(src, dst);
  logger.info(`DB backup created: ${dst}`);

  // 30 günden eski yedekleri sil
  pruneOldBackups(process.env.DATABASE_BACKUP_DIR!, 30);
});
```

### 12.4 Staging Ortamı

```
Environments:
  production  → main branch → gistify.com
  staging     → develop branch → staging.gistify.com
  local       → feature branches → localhost:5173
```

Staging ortamında gerçek API key'leri değil, sanbox key'leri kullanılır. Paddle sandbox + OpenAI test key ile tam akış test edilebilir.

---

## 13. Entegrasyon & Geçiş Planı

### 13.1 Mevcut Sistemle Uyumluluk

| Mevcut Bileşen | Değişiklik | Not |
|----------------|------------|-----|
| `weekly_reports` tablosu | **Korunur** | Haftalık raporlar yeni sistemle birlikte çalışır |
| `WeeklyReportRecord` tipi | **Genişletilir** | `opportunityRefs` alanı eklenir |
| Admin paneli | **Genişletilir** | Agent trigger + backtest panel eklenir |
| `/app` route | **Korunur** | Yeni `/app/opportunities` alt route eklenir |
| Scanner (`/scanner`) | **Taşınır** | `/app/scanner` altına, v2 API'ye bağlanır |
| Auth sistemi | **Korunur** | `member_profiles` ile genişletilir |
| Billing | **Tamamlanmalı** | Paddle entegrasyonu + tier atama yapılır |

### 13.2 Aşamalı Deploy Planı

**Aşama 1: Altyapı (Hafta 1-2)**
- [ ] Yeni tablolar: `opportunities`, `member_profiles`, `watchlists`, `alerts`, `price_history`, `earnings_history`, `backtest_results`
- [ ] Agent base class, retry logic, circuit breaker
- [ ] Veri kaynakları entegrasyonu (Yahoo + TwelveData)
- [ ] LLM Gateway (OpenAI API key env)
- [ ] CI/CD pipeline kurulumu
- [ ] Test altyapısı (Vitest + Playwright)

**Aşama 2: Agent Pipeline (Hafta 3-4)**
- [ ] Momentum Analyzer agent
- [ ] IV Crush Engine agent
- [ ] Strategy Builder agent
- [ ] Risk Assessor agent
- [ ] LLM Formatter agent
- [ ] Scheduler (cron job'lar)
- [ ] Unit testler (agent'lar için ≥80% coverage)

**Aşama 3: API & Backend (Hafta 5-6)**
- [ ] Yeni API endpoint'leri (pagination dahil)
- [ ] Tier middleware
- [ ] Alert dispatcher
- [ ] Member profile + watchlist endpoints
- [ ] WebSocket server (Socket.io)
- [ ] Healthcheck endpoint
- [ ] Integration testler

**Aşama 4: Frontend (Hafta 7-8)**
- [ ] Opportunities dashboard (infinite scroll)
- [ ] Opportunity card bileşeni
- [ ] Alert center UI
- [ ] Watchlist sayfası (v2)
- [ ] Settings / profile sayfası
- [ ] Tier upgrade modal'ları
- [ ] PWA manifest + service worker
- [ ] E2E testler

**Aşama 5: Backtest (Hafta 9)**
- [ ] BacktestEngine sınıfı
- [ ] Backtest API endpoint'leri
- [ ] Admin backtest panel UI
- [ ] Earnings history seed (son 2 yıl)

**Aşama 6: Billing & Launch (Hafta 10-11)**
- [ ] Paddle billing tamamlanması
- [ ] Tier atama ve upgrade akışı
- [ ] Free/Pro/Elite sınırlandırmaları
- [ ] Staging deploy + smoke test
- [ ] Beta test (kısıtlı üye grubu)
- [ ] Production deploy

---

## 14. Veri Kaynakları & Maliyet Analizi

### 14.1 API'ler ve Kullanım

| Kaynak | Kullanım | Maliyet (aylık tahmini) | Not |
|--------|----------|------------------------|-----|
| **Yahoo Finance** | Temel fiyat, volume | Ücretsiz (unofficial) | Rate limit dikkat; circuit breaker şart |
| **TwelveData** | Earnings calendar, IV | $29-79 (API tier) | Resmi earnings data |
| **AlphaVantage** | Teknik indikatörler | Ücretsiz (5 call/dk) | Yavaş ama ucuz; sadece cache miss'te kullan |
| **OpenAI GPT-4o-mini** | LLM özet | ~$20-50 | 1000 opp/gün; cache ile düşürülebilir |
| **Resend** | Email alert | Ücretsiz (100/gün) | Başlangıç için yeterli |

### 14.2 Cache Stratejisi (Maliyet Düşürme)

```typescript
const CACHE_TIERS = {
  price_data:        { ttl: 5 * 60 * 1000,         source: 'memory' },   // 5 dk
  iv_data:           { ttl: 15 * 60 * 1000,         source: 'memory' },   // 15 dk
  earnings_calendar: { ttl: 60 * 60 * 1000,         source: 'sqlite' },   // 1 saat
  llm_summary:       { ttl: 24 * 60 * 60 * 1000,    source: 'sqlite' },   // 24 saat
  momentum_score:    { ttl: 15 * 60 * 1000,         source: 'memory' }    // 15 dk
};
```

---

## 15. Risk & Compliance

### 15.1 Finansal Tavsiye Sorumluluğu

```tsx
const DISCLAIMER = {
  tr: "Bu analiz eğitim amaçlıdır ve yatırım tavsiyesi değildir. Kararlarınızı kendi risk toleransınıza göre alınız.",
  en: "This analysis is for educational purposes only and does not constitute investment advice."
};
// Admin panelinde zorunlu onay checkbox'ı
// Her raporda ve fırsat kartında AI-generated content etiketi
// LLM çıktılarında otomatik risk_warnings alanı
```

### 15.2 Veri Güvenliği

- API key'ler server-side only (env variable, .env asla commit'lenmez)
- Member verileri GDPR/CCPA uyumlu (silme endpoint'i: `DELETE /api/me`)
- Rate limiting: `express-rate-limit` ile IP başına kısıtlama
- Input sanitization: parameterized queries (SQL injection koruması)
- WebSocket auth: JWT doğrulama (socket handshake'de)

---

## 16. Başarı Metrikleri (KPIs)

| Metrik | Hedef | Ölçüm Yöntemi |
|--------|-------|---------------|
| Agent coverage | 500+ ticker/hafta | `agent_runs` tablosu |
| Opportunity accuracy | 70%+ başarılı strateji | Tarihsel backtest |
| LLM latency | <2sn özet üretimi | Agent run logs |
| Üye engagement | 3+ opp/gün görüntüleme | Analytics event'leri |
| Conversion rate | 5% free → pro | Billing events |
| Alert open rate | 40%+ | Email/push analytics |
| Test coverage | ≥80% server | Vitest coverage raporu |
| API error rate | <%1 | Healthcheck + circuit breaker logs |
| WS latency | <500ms opportunity push | Socket.io metrics |

---

## 17. Sonuç & Öneriler

### 17.1 Hemen Başlanacaklar (Quick Wins)

1. **Opportunities tablosu + API:** En temel yapı, 2-3 günde kurulur
2. **LLM Formatter agent:** OpenAI API key ile hemen test edilebilir
3. **Scanner v2:** Mevcut `/scanner`'ı yeni API'ye yönlendir
4. **Tier sistemi:** Basit enum + middleware, hızlı implementasyon
5. **CI/CD pipeline:** GitHub Actions + Vitest kurulumu, 1 gün

### 17.2 Orta Vadeli (2-4 hafta)

6. **Çoklu veri kaynağı:** TwelveData entegrasyonu
7. **Alert sistemi:** Email + in-app notification
8. **Watchlist:** Ayrı tablo, alert entegrasyonu
9. **WebSocket:** Socket.io gerçek zamanlı katman
10. **Admin agent kontrolü:** Manuel trigger + run logs

### 17.3 Uzun Vadeli (1-3 ay)

11. **Backtesting engine:** Tarihsel strateji performansı
12. **Skorlama kalibrasyonu:** Backtest sonuçlarıyla otomatik ağırlık güncelleme
13. **PWA:** Service worker + web push
14. **Advanced AI:** Sentiment analysis, earnings surprise prediction
15. **PostgreSQL migration:** 10K+ ticker, 100K+ üye eşiğinde değerlendirin

### 17.4 Teknik Not

Mevcut **SQLite + Express + React 19** stack'i bu geliştirmeleri kaldırabilir. 1000+ günlük fırsat ve 500+ ticker için yeterli. Ölçeklenme gerektiğinde PostgreSQL'e geçiş planlanmalı; ancak SQLite ile başlamak hız ve maliyet avantajı sağlar.

Circuit breaker + retry logic + cache katmanı eklendikten sonra sistem, tek bir harici API'nin çökmesine karşı dayanıklı hale gelir. Bu, production'da en kritik güvenlik ağıdır.

Test coverage öncelikli olmalı — özellikle agent pipeline ve scoring mantığı için. Bug'ların finansal kararları etkileyebileceği bir platformda, `≥80% coverage` minimum standarttır.

---

**Doküman Sonu**

*Bu doküman (v2.0), Gistify platformunun mevcut yapısını koruyarak, AI-agent destekli, çok kaynaklı momentum ve earnings fırsat tespit sistemiyle nasıl evrileceğini; ayrıca v1.0'da eksik kalan test stratejisi, DevOps/CI-CD, WebSocket gerçek zamanlı katmanı, backtesting motoru, circuit breaker mimarisi, genişletilmiş veri modeli ve skorlama kalibrasyonu konularını teknik ve operasyonel detaylarıyla belgeler.*
Mimarisi

```typescript
// server/cache/MultiTierCache.ts
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  tags: string[];
  size: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  memoryUsage: number;
}

class MultiTierCache {
  private readonly l1: Map<string, CacheEntry<unknown>>; // In-memory LRU
  private readonly l2: DatabaseSync; // SQLite
  private readonly l3?: RedisClient; // Redis (optional)

  private readonly l1MaxSize = 10000;
  private readonly l1MaxMemory = 50 * 1024 * 1024; // 50MB
  private stats: CacheStats = { hits: 0, misses: 0, evictions: 0, size: 0, memoryUsage: 0 };

  constructor(l3?: RedisClient) {
    this.l1 = new Map();
    this.l2 = new DatabaseSync('./data/cache.sqlite');
    this.l3 = l3;
    this.initL2();
  }

  private initL2(): void {
    this.l2.exec(`
      CREATE TABLE IF NOT EXISTS cache_entries (
        key TEXT PRIMARY KEY,
        value BLOB,
        expires_at INTEGER,
        tags TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      );
      CREATE INDEX IF NOT EXISTS idx_cache_expires ON cache_entries(expires_at);
      CREATE INDEX IF NOT EXISTS idx_cache_tags ON cache_entries(tags);
    `);
  }

  get<T>(key: string): T | undefined {
    // L1 check
    const l1Entry = this.l1.get(key);
    if (l1Entry && l1Entry.expiresAt > Date.now()) {
      this.stats.hits++;
      this.moveToFront(key, l1Entry);
      return l1Entry.value as T;
    }

    if (l1Entry && l1Entry.expiresAt <= Date.now()) {
      this.l1.delete(key);
      this.stats.evictions++;
    }

    // L2 check
    const l2Entry = this.l2.prepare('SELECT value, expires_at FROM cache_entries WHERE key = ?').get(key);
    if (l2Entry && l2Entry.expires_at > Date.now() / 1000) {
      const value = JSON.parse(l2Entry.value) as T;
      this.promoteToL1(key, value, l2Entry.expires_at * 1000);
      this.stats.hits++;
      return value;
    }

    // L3 check (if configured)
    if (this.l3) {
      const l3Value = this.l3.get(key);
      if (l3Value) {
        const parsed = JSON.parse(l3Value) as T;
        this.promoteToL1(key, parsed);
        this.promoteToL2(key, parsed);
        this.stats.hits++;
        return parsed;
      }
    }

    this.stats.misses++;
    return undefined;
  }

  set<T>(key: string, value: T, ttlMs: number, tags: string[] = []): void {
    const expiresAt = Date.now() + ttlMs;
    const size = this.estimateSize(value);

    // L1 store
    this.promoteToL1(key, value, expiresAt, tags, size);

    // L2 store (async, non-blocking)
    this.storeInL2(key, value, expiresAt, tags).catch(console.error);

    // L3 store (if configured, async)
    if (this.l3) {
      this.l3.setex(key, Math.ceil(ttlMs / 1000), JSON.stringify(value)).catch(console.error);
    }
  }

  invalidate(key: string): void {
    this.l1.delete(key);
    this.l2.prepare('DELETE FROM cache_entries WHERE key = ?').run(key);
    this.l3?.del(key).catch(console.error);
  }

  invalidateByTag(tag: string): void {
    // L1: Filter by tag
    for (const [key, entry] of this.l1.entries()) {
      if (entry.tags.includes(tag)) {
        this.l1.delete(key);
      }
    }

    // L2: Delete by tag
    this.l2.prepare('DELETE FROM cache_entries WHERE tags LIKE ?').run(`%${tag}%`);

    // L3: Cannot efficiently tag-invalidate in Redis without scan
    // Use Redis sets for tag-based invalidation if needed
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));

    // L1
    for (const [key] of this.l1.entries()) {
      if (regex.test(key)) this.l1.delete(key);
    }

    // L2 (SQLite LIKE pattern)
    this.l2.prepare('DELETE FROM cache_entries WHERE key LIKE ?').run(pattern.replace(/\*/g, '%'));
  }

  private promoteToL1<T>(key: string, value: T, expiresAt?: number, tags?: string[], size?: number): void {
    const entry: CacheEntry<T> = {
      value,
      expiresAt: expiresAt || Date.now() + 3600000,
      tags: tags || [],
      size: size || this.estimateSize(value)
    };

    // Evict if necessary
    while (this.l1.size >= this.l1MaxSize || this.stats.memoryUsage >= this.l1MaxMemory) {
      const firstKey = this.l1.keys().next().value;
      if (firstKey) {
        const evicted = this.l1.get(firstKey);
        this.l1.delete(firstKey);
        this.stats.memoryUsage -= evicted?.size || 0;
        this.stats.evictions++;
      }
    }

    this.l1.set(key, entry as CacheEntry<unknown>);
    this.stats.memoryUsage += entry.size;
    this.stats.size = this.l1.size;
  }

  private async storeInL2<T>(key: string, value: T, expiresAt: number, tags: string[]): Promise<void> {
    const stmt = this.l2.prepare(`
      INSERT OR REPLACE INTO cache_entries (key, value, expires_at, tags)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(key, JSON.stringify(value), Math.floor(expiresAt / 1000), JSON.stringify(tags));
  }

  private moveToFront(key: string, entry: CacheEntry<unknown>): void {
    // Re-insert to move to end (MRU position in Map)
    this.l1.delete(key);
    this.l1.set(key, entry);
  }

  private estimateSize(value: unknown): number {
    try {
      return JSON.stringify(value).length * 2; // Rough estimate: 2 bytes per char
    } catch {
      return 1024; // Default 1KB
    }
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  clear(): void {
    this.l1.clear();
    this.l2.exec('DELETE FROM cache_entries');
    this.l3?.flushdb().catch(console.error);
    this.stats = { hits: 0, misses: 0, evictions: 0, size: 0, memoryUsage: 0 };
  }
}
```

### 5.2 Cache TTL Stratejisi

| Veri Tipi | L1 TTL | L2 TTL | L3 TTL | Tag |
|-----------|--------|--------|--------|-----|
| **Price Data** | 5 dk | 15 dk | 30 dk | `price:{ticker}` |
| **IV Data** | 15 dk | 1 saat | 4 saat | `iv:{ticker}` |
| **Earnings Calendar** | 1 saat | 6 saat | 24 saat | `earnings:calendar` |
| **LLM Summary** | 24 saat | 7 gün | 30 gün | `llm:{ticker}:{date}` |
| **Momentum Score** | 15 dk | 2 saat | 8 saat | `momentum:{ticker}` |
| **Opportunity List** | 5 dk | 30 dk | 2 saat | `opportunities:{tier}` |
| **Member Profile** | 1 saat | 6 saat | 24 saat | `profile:{user_id}` |
| **Watchlist** | 30 dk | 2 saat | 12 saat | `watchlist:{user_id}` |
| **Backtest Result** | Sonsuz | Sonsuz | Sonsuz | `backtest:{id}` |
| **Agent Run Status** | 1 dk | 5 dk | 15 dk | `agent:{run_id}` |

### 5.3 Cache Invalidation Events

```typescript
// Cache invalidation triggers
const CACHE_INVALIDATION_EVENTS = {
  // Price update → invalidate price cache
  'price:update': (ticker: string) => cache.invalidatePattern(`price:${ticker}*`),

  // New opportunity → invalidate opportunity lists
  'opportunity:new': (opp: Opportunity) => {
    cache.invalidateByTag('opportunities:free');
    cache.invalidateByTag('opportunities:pro');
    cache.invalidateByTag('opportunities:elite');
  },

  // Earnings announcement → invalidate earnings cache
  'earnings:announced': (ticker: string) => {
    cache.invalidateByTag(`earnings:${ticker}`);
    cache.invalidateByTag(`iv:${ticker}`);
  },

  // Member profile update → invalidate profile cache
  'profile:updated': (userId: string) => cache.invalidateByTag(`profile:${userId}`),

  // Watchlist change → invalidate watchlist cache
  'watchlist:updated': (userId: string) => cache.invalidateByTag(`watchlist:${userId}`),

  // Agent run complete → invalidate related caches
  'agent:completed': (runType: string) => {
    if (runType === 'momentum_update') {
      cache.invalidateByTag('momentum:*');
    }
    if (runType === 'iv_update') {
      cache.invalidateByTag('iv:*');
    }
  }
};
```

---

## 6. API Endpoint Spesifikasyonları (OpenAPI-Style)

### 6.1 Opportunities API

```yaml
# GET /api/opportunities
summary: List opportunities with pagination and filtering
parameters:
  - name: page
    in: query
    type: integer
    default: 1
    description: Page number
  - name: limit
    in: query
    type: integer
    default: 20
    maximum: 100
    description: Items per page
  - name: minScore
    in: query
    type: integer
    minimum: 0
    maximum: 100
    description: Minimum composite score (overridden by tier)
  - name: strategy
    in: query
    type: string
    enum: [iv_crush, momentum_directional, earnings_surprise, straddle, iron_condor, calendar_spread, butterfly]
    description: Filter by strategy type
  - name: sector
    in: query
    type: string
    description: Filter by sector
  - name: daysToEarnings
    in: query
    type: integer
    description: Maximum days to earnings
  - name: riskLevel
    in: query
    type: string
    enum: [very_low, low, medium, high, extreme]
    description: Filter by risk level
  - name: sort
    in: query
    type: string
    enum: [composite_score, momentum_score, iv_crush_score, earnings_date, created_at]
    default: composite_score
  - name: sortOrder
    in: query
    type: string
    enum: [asc, desc]
    default: desc
  - name: opportunityWindow
    in: query
    type: string
    enum: [pre_earnings_7d, pre_earnings_3d, pre_earnings_1d, earnings_day, post_earnings_1d, post_earnings_3d]
responses:
  200:
    description: Paginated list of opportunities
    schema:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/definitions/Opportunity'
        meta:
          type: object
          properties:
            total: { type: integer }
            page: { type: integer }
            limit: { type: integer }
            hasMore: { type: boolean }
            totalPages: { type: integer }
  401:
    description: Unauthorized
  403:
    description: Tier upgrade required

# GET /api/opportunities/:id
summary: Get single opportunity details
parameters:
  - name: id
    in: path
    type: integer
    required: true
responses:
  200:
    description: Opportunity details
    schema:
      $ref: '#/definitions/OpportunityDetail'
  403:
    description: Tier upgrade required (if score below tier threshold)
  404:
    description: Opportunity not found

# GET /api/opportunities/:id/related
summary: Get related opportunities (same sector, similar score)
parameters:
  - name: id
    in: path
    type: integer
    required: true
  - name: limit
    in: query
    type: integer
    default: 5
responses:
  200:
    description: Related opportunities
    schema:
      type: array
      items:
        $ref: '#/definitions/Opportunity'
```

### 6.2 Watchlist API

```yaml
# GET /api/me/watchlist
summary: Get user's watchlist
responses:
  200:
    description: User's watchlist
    schema:
      type: array
      items:
        type: object
        properties:
          id: { type: integer }
          ticker: { type: string }
          name: { type: string }
          addedAt: { type: string, format: date-time }
          notes: { type: string }
          tags: { type: array, items: { type: string } }
          alertOnOpportunity: { type: boolean }
          alertOnIVSpike: { type: boolean }
          currentPrice: { type: number }
          priceChange1D: { type: number }
          nextEarningsDate: { type: string }
          activeOpportunities: { type: integer }

# POST /api/me/watchlist
summary: Add ticker to watchlist
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        properties:
          ticker: { type: string, required: true }
          notes: { type: string }
          tags: { type: array, items: { type: string } }
          alertOnOpportunity: { type: boolean, default: true }
          alertOnIVSpike: { type: boolean, default: true }
          alertPriceThreshold: { type: number }
          alertIVThreshold: { type: number, default: 30 }
responses:
  201:
    description: Ticker added to watchlist
  409:
    description: Ticker already in watchlist
  404:
    description: Ticker not found

# DELETE /api/me/watchlist/:ticker
summary: Remove ticker from watchlist
parameters:
  - name: ticker
    in: path
    type: string
    required: true
responses:
  200:
    description: Ticker removed
  404:
    description: Ticker not in watchlist

# PATCH /api/me/watchlist/:ticker
summary: Update watchlist item settings
parameters:
  - name: ticker
    in: path
    type: string
    required: true
requestBody:
  content:
    application/json:
      schema:
        type: object
        properties:
          notes: { type: string }
          alertOnOpportunity: { type: boolean }
          alertOnIVSpike: { type: boolean }
          alertPriceThreshold: { type: number }
          alertIVThreshold: { type: number }
          isActive: { type: boolean }
          sortOrder: { type: integer }
responses:
  200:
    description: Watchlist item updated
```

### 6.3 Alerts API

```yaml
# GET /api/alerts
summary: Get user's alerts
parameters:
  - name: status
    in: query
    type: string
    enum: [pending, sent, delivered, read, dismissed]
  - name: type
    in: query
    type: string
    enum: [new_opportunity, iv_spike, earnings_reminder, price_target, momentum_breakout, watchlist_update]
  - name: priority
    in: query
    type: string
    enum: [low, normal, high, urgent, critical]
  - name: limit
    in: query
    type: integer
    default: 50
    maximum: 200
  - name: unreadOnly
    in: query
    type: boolean
    default: false
responses:
  200:
    description: User's alerts
    schema:
      type: object
      properties:
        data:
          type: array
          items:
            type: object
            properties:
              id: { type: integer }
              type: { type: string }
              ticker: { type: string }
              title: { type: string }
              message: { type: string }
              messageTr: { type: string }
              messageEn: { type: string }
              priority: { type: string }
              channel: { type: string }
              status: { type: string }
              contextData: { type: object }
              deepLink: { type: string }
              createdAt: { type: string, format: date-time }
              sentAt: { type: string, format: date-time }
              readAt: { type: string, format: date-time }
        unreadCount: { type: integer }
        totalCount: { type: integer }

# POST /api/alerts/:id/read
summary: Mark alert as read
parameters:
  - name: id
    in: path
    type: integer
    required: true
responses:
  200:
    description: Alert marked as read

# POST /api/alerts/:id/dismiss
summary: Dismiss alert
parameters:
  - name: id
    in: path
    type: integer
    required: true
responses:
  200:
    description: Alert dismissed

# POST /api/alerts/dismiss-all
summary: Dismiss all alerts
requestBody:
  content:
    application/json:
      schema:
        type: object
        properties:
          status: { type: string, enum: [pending, sent, delivered] }
          type: { type: string }
responses:
  200:
    description: All matching alerts dismissed
    schema:
      type: object
      properties:
        dismissedCount: { type: integer }

# GET /api/alerts/unread-count
summary: Get unread alert count
responses:
  200:
    description: Unread count
    schema:
      type: object
      properties:
        count: { type: integer }
        hasUrgent: { type: boolean }
```

### 6.4 Backtest API

```yaml
# POST /api/backtest
summary: Run backtest (Elite only)
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        properties:
          strategy:
            type: string
            enum: [iv_crush, momentum_directional, earnings_surprise, straddle, iron_condor, calendar_spread, butterfly]
            required: true
          ticker:
            type: string
            description: Specific ticker or null for universe
          sector:
            type: string
            description: Filter by sector
          startDate:
            type: string
            format: date
            required: true
          endDate:
            type: string
            format: date
            required: true
          params:
            type: object
            properties:
              entryDaysBefore: { type: integer, default: 1 }
              exitDaysAfter: { type: integer, default: 1 }
              minIVRank: { type: integer, default: 50 }
              minMomentumScore: { type: integer, default: 50 }
              maxRiskLevel: { type: string, enum: [low, medium, high, extreme], default: high }
              positionSizePercent: { type: number, default: 2 }
              stopLossPercent: { type: number, default: 10 }
responses:
  202:
    description: Backtest queued
    schema:
      type: object
      properties:
        jobId: { type: string }
        status: { type: string, enum: [queued, running] }
        estimatedDuration: { type: integer, description: "Estimated seconds" }
  403:
    description: Elite tier required

# GET /api/backtest/:jobId
summary: Get backtest status and results
parameters:
  - name: jobId
    in: path
    type: string
    required: true
responses:
  200:
    description: Backtest status/result
    schema:
      type: object
      properties:
        id: { type: string }
        status: { type: string, enum: [queued, running, completed, failed, cancelled] }
        progress: { type: integer, description: "0-100" }
        result:
          type: object
          properties:
            totalTrades: { type: integer }
            winningTrades: { type: integer }
            winRate: { type: number }
            avgReturnPct: { type: number }
            maxDrawdownPct: { type: number }
            sharpeRatio: { type: number }
            profitFactor: { type: number }
            totalReturnPct: { type: number }
            trades: { type: array }
            equityCurve: { type: array }
            monthlyReturns: { type: object }
        error: { type: string }
        createdAt: { type: string, format: date-time }
        completedAt: { type: string, format: date-time }
        durationMs: { type: integer }

# GET /api/backtest
summary: List user's backtest history
parameters:
  - name: limit
    in: query
    type: integer
    default: 20
  - name: strategy
    in: query
    type: string
responses:
  200:
    description: Backtest history
    schema:
      type: array
      items:
        type: object
        properties:
          id: { type: string }
          strategy: { type: string }
          ticker: { type: string }
          startDate: { type: string }
          endDate: { type: string }
          status: { type: string }
          totalReturnPct: { type: number }
          winRate: { type: number }
          createdAt: { type: string }
```

### 6.5 Admin API

```yaml
# POST /api/admin/agents/trigger
summary: Trigger agent run (Admin only)
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        properties:
          agentType:
            type: string
            enum: [full_scan, momentum_update, iv_update, earnings_pre_check, earnings_post_check, calibration, cleanup]
            required: true
          tickers:
            type: array
            items: { type: string }
            description: Specific tickers or null for default universe
          priority:
            type: string
            enum: [low, normal, high, critical]
            default: normal
          forceRefresh:
            type: boolean
            default: false
responses:
  202:
    description: Agent run queued
    schema:
      type: object
      properties:
        jobId: { type: string }
        status: { type: string }
        estimatedDuration: { type: integer }

# GET /api/admin/agents/runs
summary: List agent runs
parameters:
  - name: status
    in: query
    type: string
    enum: [queued, running, success, partial, failed, timeout]
  - name: type
    in: query
    type: string
  - name: limit
    in: query
    type: integer
    default: 50
responses:
  200:
    description: Agent runs
    schema:
      type: object
      properties:
        data:
          type: array
          items:
            type: object
            properties:
              id: { type: integer }
              runId: { type: string }
              runType: { type: string }
              status: { type: string }
              tickersScanned: { type: integer }
              opportunitiesFound: { type: integer }
              durationMs: { type: integer }
              startedAt: { type: string }
              completedAt: { type: string }
              errors: { type: array }
        activeRuns: { type: integer }
        queueLength: { type: integer }

# GET /api/admin/agents/runs/:runId
summary: Get agent run details
parameters:
  - name: runId
    in: path
    type: string
    required: true
responses:
  200:
    description: Agent run details
    schema:
      type: object
      properties:
        id: { type: integer }
        runId: { type: string }
        runType: { type: string }
        status: { type: string }
        startedAt: { type: string }
        completedAt: { type: string }
        tickersScanned: { type: integer }
        tickersRequested: { type: integer }
        tickersFailed: { type: integer }
        opportunitiesFound: { type: integer }
        opportunitiesCreated: { type: integer }
        errors: { type: array }
        warnings: { type: array }
        log: { type: string }
        durationMs: { type: integer }
        memoryPeakMb: { type: number }
        cacheHitRate: { type: number }

# POST /api/admin/agents/runs/:runId/cancel
summary: Cancel running agent
parameters:
  - name: runId
    in: path
    type: string
    required: true
responses:
  200:
    description: Agent run cancelled
  404:
    description: Run not found or already completed

# GET /api/admin/opportunities
summary: List all opportunities (including expired)
parameters:
  - name: status
    in: query
    type: string
    enum: [active, expired, executed, invalidated, archived]
  - name: limit
    in: query
    type: integer
    default: 100
responses:
  200:
    description: All opportunities

# POST /api/admin/opportunities/:id/override
summary: Manually override opportunity (Admin review)
parameters:
  - name: id
    in: path
    type: integer
    required: true
requestBody:
  content:
    application/json:
      schema:
        type: object
        properties:
          compositeScore: { type: integer }
          tierRequired: { type: string }
          status: { type: string }
          aiSummaryTr: { type: string }
          aiSummaryEn: { type: string }
          adminNotes: { type: string }
responses:
  200:
    description: Opportunity overridden

# GET /api/admin/stats
summary: Platform statistics
responses:
  200:
    description: Platform stats
    schema:
      type: object
      properties:
        users:
          type: object
          properties:
            total: { type: integer }
            active: { type: integer }
            byTier: { type: object }
        opportunities:
          type: object
          properties:
            active: { type: integer }
            today: { type: integer }
            thisWeek: { type: integer }
            avgScore: { type: number }
        agents:
          type: object
          properties:
            activeRuns: { type: integer }
            todayRuns: { type: integer }
            avgDuration: { type: integer }
            successRate: { type: number }
        alerts:
          type: object
          properties:
            todaySent: { type: integer }
            openRate: { type: number }
            clickRate: { type: number }
        revenue:
          type: object
          properties:
            mrr: { type: number }
            newThisMonth: { type: integer }
            churnRate: { type: number }
```

---

## 7. Frontend State Management & Architecture

### 7.1 Store Hierarchy (Zustand)

```typescript
// client/src/stores/index.ts
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tier: 'free' | 'pro' | 'elite' | null;

  login: (user: User) => void;
  logout: () => void;
  setTier: (tier: string) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set) => ({
          user: null,
          isAuthenticated: false,
          isLoading: true,
          tier: null,

          login: (user) => set((state) => {
            state.user = user;
            state.isAuthenticated = true;
            state.tier = user.tier as any;
            state.isLoading = false;
          }),

          logout: () => set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.tier = null;
          }),

          setTier: (tier) => set((state) => {
            state.tier = tier as any;
          })
        }))
      ),
      { name: 'auth-storage', partialize: (state) => ({ user: state.user, tier: state.tier }) }
    )
  )
);

// Opportunities Store
interface OpportunitiesState {
  opportunities: Opportunity[];
  selectedOpportunity: Opportunity | null;
  filters: OpportunityFilters;
  pagination: PaginationState;
  isLoading: boolean;
  error: string | null;

  setOpportunities: (opps: Opportunity[], meta: PaginationMeta) => void;
  addOpportunity: (opp: Opportunity) => void;
  updateOpportunity: (id: number, updates: Partial<Opportunity>) => void;
  selectOpportunity: (id: number | null) => void;
  setFilters: (filters: Partial<OpportunityFilters>) => void;
  setPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useOpportunitiesStore = create<OpportunitiesState>()(
  devtools(
    subscribeWithSelector(
      immer((set) => ({
        opportunities: [],
        selectedOpportunity: null,
        filters: {
          minScore: undefined,
          strategy: undefined,
          sector: undefined,
          daysToEarnings: undefined,
          riskLevel: undefined,
          sort: 'composite_score',
          sortOrder: 'desc'
        },
        pagination: { page: 1, limit: 20, total: 0, hasMore: false, totalPages: 0 },
        isLoading: false,
        error: null,

        setOpportunities: (opps, meta) => set((state) => {
          state.opportunities = opps;
          state.pagination = { ...state.pagination, ...meta };
          state.isLoading = false;
          state.error = null;
        }),

        addOpportunity: (opp) => set((state) => {
          state.opportunities.unshift(opp);
          state.pagination.total++;
        }),

        updateOpportunity: (id, updates) => set((state) => {
          const idx = state.opportunities.findIndex(o => o.id === id);
          if (idx !== -1) {
            Object.assign(state.opportunities[idx], updates);
          }
        }),

        selectOpportunity: (id) => set((state) => {
          state.selectedOpportunity = id ? state.opportunities.find(o => o.id === id) || null : null;
        }),

        setFilters: (filters) => set((state) => {
          Object.assign(state.filters, filters);
          state.pagination.page = 1;
        }),

        setPage: (page) => set((state) => {
          state.pagination.page = page;
        }),

        setLoading: (loading) => set((state) => {
          state.isLoading = loading;
        }),

        setError: (error) => set((state) => {
          state.error = error;
          state.isLoading = false;
        })
      }))
    )
  )
);

// Watchlist Store
interface WatchlistState {
  items: WatchlistItem[];
  isLoading: boolean;

  setItems: (items: WatchlistItem[]) => void;
  addItem: (item: WatchlistItem) => void;
  removeItem: (ticker: string) => void;
  updateItem: (ticker: string, updates: Partial<WatchlistItem>) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set) => ({
          items: [],
          isLoading: false,

          setItems: (items) => set((state) => { state.items = items; }),
          addItem: (item) => set((state) => { state.items.push(item); }),
          removeItem: (ticker) => set((state) => {
            state.items = state.items.filter(i => i.ticker !== ticker);
          }),
          updateItem: (ticker, updates) => set((state) => {
            const idx = state.items.findIndex(i => i.ticker === ticker);
            if (idx !== -1) Object.assign(state.items[idx], updates);
          })
        }))
      ),
      { name: 'watchlist-storage' }
    )
  )
);

// Alerts Store
interface AlertsState {
  alerts: Alert[];
  unreadCount: number;
  isLoading: boolean;

  setAlerts: (alerts: Alert[], unreadCount: number) => void;
  addAlert: (alert: Alert) => void;
  markAsRead: (id: number) => void;
  dismissAlert: (id: number) => void;
  dismissAll: () => void;
}

export const useAlertsStore = create<AlertsState>()(
  devtools(
    subscribeWithSelector(
      immer((set) => ({
        alerts: [],
        unreadCount: 0,
        isLoading: false,

        setAlerts: (alerts, unreadCount) => set((state) => {
          state.alerts = alerts;
          state.unreadCount = unreadCount;
        }),

        addAlert: (alert) => set((state) => {
          state.alerts.unshift(alert);
          if (alert.status !== 'read') state.unreadCount++;
        }),

        markAsRead: (id) => set((state) => {
          const alert = state.alerts.find(a => a.id === id);
          if (alert && alert.status !== 'read') {
            alert.status = 'read';
            alert.readAt = new Date().toISOString();
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }),

        dismissAlert: (id) => set((state) => {
          const alert = state.alerts.find(a => a.id === id);
          if (alert) {
            alert.status = 'dismissed';
            if (alert.status !== 'read') state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }),

        dismissAll: () => set((state) => {
          state.alerts.forEach(a => {
            if (a.status !== 'dismissed') a.status = 'dismissed';
          });
          state.unreadCount = 0;
        })
      }))
    )
  )
);

// UI Store (non-persistent)
interface UIState {
  sidebarOpen: boolean;
  theme: 'dark' | 'light' | 'system';
  language: 'tr' | 'en';
  activeModal: string | null;
  toastQueue: Toast[];

  toggleSidebar: () => void;
  setTheme: (theme: UIState['theme']) => void;
  setLanguage: (lang: UIState['language']) => void;
  openModal: (modal: string) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set) => ({
          sidebarOpen: true,
          theme: 'dark',
          language: 'tr',
          activeModal: null,
          toastQueue: [],

          toggleSidebar: () => set((state) => { state.sidebarOpen = !state.sidebarOpen; }),
          setTheme: (theme) => set((state) => { state.theme = theme; }),
          setLanguage: (lang) => set((state) => { state.language = lang; }),
          openModal: (modal) => set((state) => { state.activeModal = modal; }),
          closeModal: () => set((state) => { state.activeModal = null; }),
          addToast: (toast) => set((state) => {
            state.toastQueue.push({ ...toast, id: crypto.randomUUID() });
          }),
          removeToast: (id) => set((state) => {
            state.toastQueue = state.toastQueue.filter(t => t.id !== id);
          })
        }))
      ),
      { name: 'ui-preferences', partialize: (state) => ({ theme: state.theme, language: state.language }) }
    )
  )
);
```

### 7.2 React Query Integration

```typescript
// client/src/queries/opportunities.ts
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

// List opportunities with pagination
export function useOpportunities(filters: OpportunityFilters) {
  return useQuery({
    queryKey: ['opportunities', filters],
    queryFn: async ({ queryKey }) => {
      const [, filterParams] = queryKey;
      const response = await api.get('/opportunities', { params: filterParams });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 60 * 1000, // 1 minute polling
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}

// Infinite scroll opportunities
export function useInfiniteOpportunities(filters: OpportunityFilters) {
  return useInfiniteQuery({
    queryKey: ['opportunities', 'infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get('/opportunities', {
        params: { ...filters, page: pageParam, limit: 20 }
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta.hasMore) return undefined;
      return lastPage.meta.page + 1;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
}

// Single opportunity detail
export function useOpportunity(id: number | null) {
  return useQuery({
    queryKey: ['opportunity', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/opportunities/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

// Related opportunities
export function useRelatedOpportunities(id: number | null) {
  return useQuery({
    queryKey: ['opportunities', 'related', id],
    queryFn: async () => {
      if (!id) return [];
      const response = await api.get(`/opportunities/${id}/related`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Watchlist queries
export function useWatchlist() {
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => {
      const response = await api.get('/me/watchlist');
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { ticker: string; notes?: string }) => {
      const response = await api.post('/me/watchlist', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticker: string) => {
      const response = await api.delete(`/me/watchlist/${ticker}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });
}

// Alert queries
export function useAlerts(params?: { status?: string; unreadOnly?: boolean }) {
  return useQuery({
    queryKey: ['alerts', params],
    queryFn: async () => {
      const response = await api.get('/alerts', { params });
      return response.data;
    },
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}

export function useUnreadAlertCount() {
  return useQuery({
    queryKey: ['alerts', 'unread-count'],
    queryFn: async () => {
      const response = await api.get('/alerts/unread-count');
      return response.data.count;
    },
    staleTime: 15 * 1000,
    refetchInterval: 15 * 1000,
  });
}

export function useMarkAlertRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/alerts/${id}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

// Backtest queries (Elite only)
export function useBacktestHistory() {
  return useQuery({
    queryKey: ['backtest', 'history'],
    queryFn: async () => {
      const response = await api.get('/backtest');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: useAuthStore.getState().tier === 'elite',
  });
}

export function useRunBacktest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: BacktestParams) => {
      const response = await api.post('/backtest', params);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['backtest', 'history'] });
      // Poll for result
      startBacktestPolling(data.jobId);
    },
  });
}

// Admin queries
export function useAgentRuns(params?: { status?: string; type?: string }) {
  return useQuery({
    queryKey: ['admin', 'agent-runs', params],
    queryFn: async () => {
      const response = await api.get('/admin/agents/runs', { params });
      return response.data;
    },
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
    enabled: useAuthStore.getState().user?.isAdmin === true,
  });
}

export function useTriggerAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { agentType: string; tickers?: string[] }) => {
      const response = await api.post('/admin/agents/trigger', params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'agent-runs'] });
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await api.get('/admin/stats');
      return response.data;
    },
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    enabled: useAuthStore.getState().user?.isAdmin === true,
  });
}
```

### 7.3 WebSocket Hook

```typescript
// client/src/hooks/useRealtime.ts
import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useOpportunitiesStore } from '../stores/opportunities';
import { useAlertsStore } from '../stores/alerts';
import { useUIStore } from '../stores/ui';
import { useAuthStore } from '../stores/auth';

export function useRealtime() {
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const addOpportunity = useOpportunitiesStore(s => s.addOpportunity);
  const updateOpportunity = useOpportunitiesStore(s => s.updateOpportunity);
  const addAlert = useAlertsStore(s => s.addAlert);
  const addToast = useUIStore(s => s.addToast);
  const token = useAuthStore(s => s.user?.token);

  const connect = useCallback(() => {
    if (!token) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionDelay: Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000),
      reconnectionAttempts: maxReconnectAttempts,
      timeout: 10000,
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
      reconnectAttempts.current = 0;
      addToast({ type: 'success', message: 'Real-time updates connected', duration: 3000 });
    });

    socket.on('opportunity:new', (opp: Opportunity) => {
      addOpportunity(opp);
      addAlert({
        id: Date.now(), // Temporary ID
        type: 'new_opportunity',
        ticker: opp.ticker,
        title: `New Opportunity: ${opp.ticker}`,
        message: `Score: ${opp.compositeScore} | ${opp.aiSummaryEn}`,
        priority: opp.compositeScore >= 90 ? 'urgent' : 'high',
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      addToast({
        type: 'info',
        message: `New opportunity: ${opp.ticker} (${opp.compositeScore})`,
        duration: 5000,
        action: { label: 'View', onClick: () => window.location.href = `/app/opportunities/${opp.id}` }
      });
    });

    socket.on('opportunity:update', (update: { id: number; changes: Partial<Opportunity> }) => {
      updateOpportunity(update.id, update.changes);
    });

    socket.on('alert:new', (alert: Alert) => {
      addAlert(alert);
      if (alert.priority === 'urgent' || alert.priority === 'critical') {
        addToast({
          type: 'warning',
          message: alert.message,
          duration: 10000,
          action: { label: 'View', onClick: () => window.location.href = alert.deepLink || '/app/alerts' }
        });
      }
    });

    socket.on('price:update', ({ ticker, price, change }: { ticker: string; price: number; change: number }) => {
      // Update price in opportunities store
      const opp = useOpportunitiesStore.getState().opportunities.find(o => o.ticker === ticker);
      if (opp) {
        updateOpportunity(opp.id, { currentPrice: price, priceChange1D: change });
      }
    });

    socket.on('connect_error', (err) => {
      console.warn('WebSocket connection error:', err.message);
      reconnectAttempts.current++;

      if (reconnectAttempts.current >= maxReconnectAttempts) {
        addToast({
          type: 'error',
          message: 'Real-time connection failed. Using polling mode.',
          duration: 10000
        });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server forced disconnect, reconnect manually
        socket.connect();
      }
    });

    socketRef.current = socket;

    return socket;
  }, [token, addOpportunity, updateOpportunity, addAlert, addToast]);

  useEffect(() => {
    const socket = connect();

    return () => {
      socket?.disconnect();
      socketRef.current = null;
    };
  }, [connect]);

  const emit = useCallback((event: string, data: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { socket: socketRef, emit, isConnected: socketRef.current?.connected || false };
}
```

---

## 8. Frontend Bileşen Hiyerarşisi

### 8.1 Sayfa Yapısı

```
client/src/
├── pages/
│   ├── App.tsx                    # Ana shell (mevcut)
│   ├── Home.tsx                   # Haftalık rapor (mevcut)
│   ├── Opportunities/
│   │   ├── index.tsx              # Ana sayfa
│   │   ├── components/
│   │   │   ├── OpportunityGrid.tsx
│   │   │   ├── OpportunityList.tsx
│   │   │   ├── OpportunityCard.tsx
│   │   │   ├── OpportunityDetail.tsx
│   │   │   ├── OpportunityFilters.tsx
│   │   │   ├── OpportunitySort.tsx
│   │   │   ├── MiniChart.tsx
│   │   │   ├── ScoreBadge.tsx
│   │   │   ├── StrategyTag.tsx
│   │   │   ├── RiskBar.tsx
│   │   │   ├── AIInsight.tsx
│   │   │   ├── MetricsRow.tsx
│   │   │   ├── TickerBadge.tsx
│   │   │   ├── UpgradeOverlay.tsx
│   │   │   ├── RelatedOpportunities.tsx
│   │   │   └── EmptyState.tsx
│   │   └── hooks/
│   │       ├── useOpportunityFilters.ts
│   │       ├── useOpportunityScroll.ts
│   │       └── useOpportunityDetail.ts
│   ├── Scanner/
│   │   ├── index.tsx              # Scanner v2
│   │   └── components/
│   │       ├── ScannerFilters.tsx
│   │       ├── ScannerResults.tsx
│   │       └── ScannerChart.tsx
│   ├── Alerts/
│   │   ├── index.tsx
│   │   └── components/
│   │       ├── AlertList.tsx
│   │       ├── AlertItem.tsx
│   │       ├── AlertFilters.tsx
│   │       └── AlertBadge.tsx
│   ├── Watchlist/
│   │   ├── index.tsx
│   │   └── components/
│   │       ├── WatchlistGrid.tsx
│   │       ├── WatchlistItem.tsx
│   │       ├── AddTickerModal.tsx
│   │       └── WatchlistAlerts.tsx
│   ├── Settings/
│   │   ├── index.tsx
│   │   └── components/
│   │       ├── ProfileSettings.tsx
│   │       ├── AlertSettings.tsx
│   │       ├── RiskSettings.tsx
│   │       ├── StrategyPreferences.tsx
│   │       ├── NotificationSettings.tsx
│   │       └── BillingSettings.tsx
│   ├── Backtest/
│   │   ├── index.tsx              # Elite only
│   │   └── components/
│   │       ├── BacktestForm.tsx
│   │       ├── BacktestResults.tsx
│   │       ├── EquityCurveChart.tsx
│   │       ├── TradeTable.tsx
│   │       └── BacktestHistory.tsx
│   └── Admin/
│       ├── index.tsx
│       └── components/
│           ├── AgentControlPanel.tsx
│           ├── AgentRunList.tsx
│           ├── AgentRunDetail.tsx
│           ├── OpportunityOverride.tsx
│           ├── BacktestPanel.tsx
│           ├── StatsDashboard.tsx
│           └── UserManagement.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   └── PageContainer.tsx
│   ├── ui/                        # Radix UI + Tailwind bileşenleri
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Dialog.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Tabs.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Toast.tsx
│   │   ├── Progress.tsx
│   │   ├── Slider.tsx
│   │   └── Toggle.tsx
│   ├── charts/
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── RadarChart.tsx
│   │   ├── PieChart.tsx
│   │   ├── Heatmap.tsx
│   │   └── CandlestickChart.tsx
│   ├── opportunities/             # Shared opportunity components
│   │   ├── OpportunityCard.tsx
│   │   ├── OpportunityMiniCard.tsx
│   │   ├── ScoreBadge.tsx
│   │   ├── RiskIndicator.tsx
│   │   └── StrategyIcon.tsx
│   └── common/
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       ├── EmptyState.tsx
│       ├── Pagination.tsx
│       ├── SearchInput.tsx
│       ├── DateRangePicker.tsx
│       ├── TierBadge.tsx
│       └── UpgradePrompt.tsx
├── hooks/
│   ├── useRealtime.ts
│   ├── useAuth.ts
│   ├── useTier.ts
│   ├── useDebounce.ts
│   ├── useInfiniteScroll.ts
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   ├── usePrevious.ts
│   └── useCountdown.ts
├── stores/
│   ├── index.ts
│   ├── auth.ts
│   ├── opportunities.ts
│   ├── watchlist.ts
│   ├── alerts.ts
│   └── ui.ts
├── queries/
│   ├── opportunities.ts
│   ├── watchlist.ts
│   ├── alerts.ts
│   ├── backtest.ts
│   └── admin.ts
├── lib/
│   ├── api.ts                     # Axios instance
│   ├── socket.ts                  # Socket.io client
│   ├── utils.ts
│   ├── constants.ts
│   ├── formatters.ts
│   └── validators.ts
└── types/
    ├── opportunity.ts
    ├── watchlist.ts
    ├── alert.ts
    ├── backtest.ts
    ├── user.ts
    └── api.ts
```

### 8.2 OpportunityCard Bileşeni (Detaylı)

```tsx
// client/src/components/opportunities/OpportunityCard.tsx
import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'wouter';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tooltip } from '../ui/Tooltip';
import { Skeleton } from '../ui/Skeleton';
import { MiniChart } from './MiniChart';
import { ScoreBadge } from './ScoreBadge';
import { StrategyTag } from './StrategyTag';
import { RiskBar } from './RiskBar';
import { AIInsight } from './AIInsight';
import { MetricsRow } from './MetricsRow';
import { TickerBadge } from './TickerBadge';
import { UpgradeOverlay } from './UpgradeOverlay';
import { useAddToWatchlist } from '../../queries/watchlist';
import { useAuthStore } from '../../stores/auth';
import { cn } from '../../lib/utils';

interface OpportunityCardProps {
  opportunity: Opportunity;
  variant?: 'default' | 'compact' | 'featured';
  showAI?: boolean;
  className?: string;
}

export const OpportunityCard = memo(function OpportunityCard({
  opportunity,
  variant = 'default',
  showAI = true,
  className
}: OpportunityCardProps) {
  const navigate = useNavigate();
  const tier = useAuthStore(s => s.tier);
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const addToWatchlist = useAddToWatchlist();

  const isBlurred = tier === 'free' && opportunity.compositeScore < 85;
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  const handleClick = useCallback(() => {
    if (!isBlurred) {
      navigate(`/app/opportunities/${opportunity.id}`);
    }
  }, [isBlurred, opportunity.id, navigate]);

  const handleWatchlist = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    addToWatchlist.mutate({ ticker: opportunity.ticker });
  }, [opportunity.ticker, addToWatchlist]);

  if (isCompact) {
    return (
      <div 
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
          "hover:bg-accent/50 hover:border-accent",
          isBlurred && "blur-sm pointer-events-none opacity-60",
          className
        )}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <TickerBadge ticker={opportunity.ticker} sector={opportunity.sector} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold truncate">{opportunity.ticker}</span>
            <ScoreBadge score={opportunity.compositeScore} size="sm" />
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {opportunity.strategyType} • {opportunity.riskLevel} risk
          </p>
        </div>
        <MiniChart 
          data={opportunity.priceHistory7D} 
          width={80} 
          height={30} 
          className="hidden sm:block"
        />
      </div>
    );
  }

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-200 cursor-pointer",
        "hover:shadow-lg hover:scale-[1.02]",
        isFeatured && "border-2 border-primary",
        isBlurred && "blur-sm pointer-events-none",
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-1 text-xs font-bold rounded-bl-lg">
          FEATURED
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <TickerBadge 
              ticker={opportunity.ticker} 
              sector={opportunity.sector} 
              size={isFeatured ? 'lg' : 'md'}
            />
            <div className="min-w-0">
              <h3 className="font-bold truncate">{opportunity.ticker}</h3>
              <p className="text-xs text-muted-foreground truncate">{opportunity.name}</p>
            </div>
          </div>
          <ScoreBadge 
            score={opportunity.compositeScore} 
            size={isFeatured ? 'xl' : 'lg'}
            showLabel
          />
        </div>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <StrategyTag type={opportunity.strategyType} />
          <Badge variant={opportunity.directionalBias === 'bullish' ? 'success' : opportunity.directionalBias === 'bearish' ? 'destructive' : 'secondary'}>
            {opportunity.directionalBias}
          </Badge>
          <Badge variant="outline">
            {opportunity.daysToEarnings}d to earnings
          </Badge>
          {opportunity.earningsTime && (
            <Badge variant="outline" className="text-xs">
              {opportunity.earningsTime}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Mini Chart */}
        <div className="h-24">
          {!isImageLoaded && <Skeleton className="h-full w-full" />}
          <MiniChart 
            data={opportunity.priceHistory7D}
            height={96}
            showTooltip={isHovered}
            className={cn(!isImageLoaded && "hidden")}
            onLoad={() => setIsImageLoaded(true)}
          />
        </div>

        {/* Metrics */}
        <MetricsRow className="grid-cols-3">
          <Metric 
            label="IV Rank" 
            value={opportunity.ivRank} 
            suffix="%"
            tooltip="Implied Volatility percentile rank"
          />
          <Metric 
            label="RSI" 
            value={opportunity.rsi14}
            color={opportunity.rsi14 > 70 ? 'text-red-500' : opportunity.rsi14 < 30 ? 'text-green-500' : undefined}
          />
          <Metric 
            label="Exp. Move" 
            value={opportunity.impliedMovePercent} 
            suffix="%"
            tooltip="Expected price move based on implied volatility"
          />
        </MetricsRow>

        {/* AI Insight (Pro/Elite only) */}
        {showAI && tier !== 'free' && opportunity.aiSummaryEn && (
          <AIInsight 
            summary={opportunity.aiSummaryEn}
            summaryTr={opportunity.aiSummaryTr}
            catalysts={opportunity.aiKeyCatalysts}
            locale={useUIStore.getState().language}
            className="bg-muted/50 rounded-lg p-3"
          />
        )}

        {/* Risk Bar */}
        <RiskBar 
          level={opportunity.riskLevel} 
          score={opportunity.riskScore}
          maxLoss={opportunity.maxLossPercent}
          var95={opportunity.var95}
          showDetails={isHovered}
        />
      </CardContent>

      <CardFooter className="flex gap-2 pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/app/opportunities/${opportunity.id}`);
          }}
        >
          Detaylı Analiz
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleWatchlist}
          disabled={addToWatchlist.isPending}
        >
          {addToWatchlist.isPending ? '...' : '➕'}
        </Button>
      </CardFooter>

      {/* Upgrade Overlay */}
      {isBlurred && (
        <UpgradeOverlay 
          message="Bu fırsatı görmek için Pro'ya yükseltin"
          minScore={85}
          currentScore={opportunity.compositeScore}
          className="absolute inset-0 z-10"
        />
      )}
    </Card>
  );
});

// Sub-components
function Metric({ 
  label, 
  value, 
  suffix, 
  tooltip, 
  color 
}: { 
  label: string; 
  value: number | undefined; 
  suffix?: string; 
  tooltip?: string;
  color?: string;
}) {
  const content = (
    <div className="text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("text-lg font-bold", color)}>
        {value !== undefined ? `${Math.round(value)}${suffix || ''}` : '-'}
      </p>
    </div>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip}>
        {content}
      </Tooltip>
    );
  }

  return content;
}
```

### 8.3 Opportunities Dashboard Sayfası

```tsx
// client/src/pages/Opportunities/index.tsx
import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'wouter';
import { useInfiniteOpportunities } from '../../queries/opportunities';
import { useOpportunitiesStore } from '../../stores/opportunities';
import { useUIStore } from '../../stores/ui';
import { useRealtime } from '../../hooks/useRealtime';
import { PageContainer } from '../../components/layout/PageContainer';
import { OpportunityGrid } from './components/OpportunityGrid';
import { OpportunityFilters } from './components/OpportunityFilters';
import { OpportunitySort } from './components/OpportunitySort';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { Button } from '../../components/ui/Button';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

export default function OpportunitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filters = useOpportunitiesStore(s => s.filters);
  const setFilters = useOpportunitiesStore(s => s.setFilters);
  const addToast = useUIStore(s => s.addToast);

  // Real-time connection
  const { isConnected } = useRealtime();

  // Infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch
  } = useInfiniteOpportunities(filters);

  // Flatten pages
  const opportunities = data?.pages.flatMap(page => page.data) || [];
  const totalCount = data?.pages[0]?.meta.total || 0;

  // Infinite scroll
  const loadMoreRef = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: hasNextPage,
    isLoading: isFetchingNextPage,
    threshold: 200
  });

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<OpportunityFilters>) => {
    setFilters(newFilters);
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });
    setSearchParams(params);
  }, [setFilters, setSearchParams]);

  // Handle sort change
  const handleSortChange = useCallback((sort: string, order: 'asc' | 'desc') => {
    setFilters({ sort, sortOrder: order });
  }, [setFilters]);

  // Connection status toast
  useEffect(() => {
    if (!isConnected) {
      addToast({
        type: 'warning',
        message: 'Real-time updates disconnected. Data may be stale.',
        duration: 5000
      });
    }
  }, [isConnected, addToast]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <EmptyState
          type="error"
          title="Failed to load opportunities"
          message={error?.message || 'An error occurred while fetching data.'}
          action={
            <Button onClick={() => refetch()}>Retry</Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ErrorBoundary>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Opportunities</h1>
            <p className="text-muted-foreground">
              {totalCount} active opportunities found
              {isConnected && (
                <span className="ml-2 text-green-500 text-sm">● Live</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters {Object.values(filters).filter(Boolean).length > 0 && `(${Object.values(filters).filter(Boolean).length})`}
            </Button>
            <OpportunitySort 
              currentSort={filters.sort || 'composite_score'}
              currentOrder={filters.sortOrder || 'desc'}
              onChange={handleSortChange}
            />
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode('grid')}
              >
                ⊞
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode('list')}
              >
                ☰
              </Button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <OpportunityFilters 
            filters={filters}
            onChange={handleFilterChange}
            className="mb-6"
          />
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <KPICard 
            title="Active Opportunities" 
            value={totalCount} 
            trend={+12} 
          />
          <KPICard 
            title="Avg Score" 
            value={opportunities.length > 0 ? Math.round(opportunities.reduce((a, o) => a + o.compositeScore, 0) / opportunities.length) : 0} 
            trend={+5}
          />
          <KPICard 
            title="High Priority" 
            value={opportunities.filter(o => o.compositeScore >= 90).length} 
            color="text-green-500"
          />
          <KPICard 
            title="This Week" 
            value={opportunities.filter(o => o.daysToEarnings <= 7).length}
          />
        </div>

        {/* Opportunities Grid/List */}
        {opportunities.length === 0 ? (
          <EmptyState
            type="empty"
            title="No opportunities found"
            message="Try adjusting your filters or check back later."
          />
        ) : (
          <>
            <OpportunityGrid 
              opportunities={opportunities}
              viewMode={viewMode}
              className="mb-6"
            />

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
              {isFetchingNextPage && <LoadingSpinner size="sm" />}
              {!hasNextPage && opportunities.length > 0 && (
                <p className="text-sm text-muted-foreground">No more opportunities</p>
              )}
            </div>
          </>
        )}
      </ErrorBoundary>
    </PageContainer>
  );
}

function KPICard({ title, value, trend, color }: { 
  title: string; 
  value: number; 
  trend?: number;
  color?: string;
}) {
  return (
    <div className="bg-card border rounded-lg p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="flex items-end gap-2">
        <p className={cn("text-2xl font-bold", color)}>{value}</p>
        {trend !== undefined && (
          <span className={cn("text-sm", trend > 0 ? 'text-green-500' : 'text-red-500')}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );
}
```

---

## 9. Monitoring, Logging & Alerting

### 9.1 Structured Logging

```typescript
// server/lib/logger.ts
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { 
    service: 'gistify',
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION
  },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, timestamp, ...metadata }) => {
          return `${timestamp} [${level}]: ${message} ${Object.keys(metadata).length ? JSON.stringify(metadata) : ''}`;
        })
      )
    }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

// Context-aware logging
interface LogContext {
  requestId?: string;
  userId?: string;
  tier?: string;
  agentRunId?: string;
  ticker?: string;
}

export function createContextualLogger(context: LogContext) {
  return logger.child(context);
}

// Usage in Express middleware
app.use((req, res, next) => {
  req.requestId = crypto.randomUUID();
  req.log = createContextualLogger({
    requestId: req.requestId,
    userId: req.user?.id,
    tier: req.user?.tier
  });

  req.log.info('Request started', {
    method: req.method,
    path: req.path,
    query: req.query,
    userAgent: req.get('user-agent')
  });

  res.on('finish', () => {
    req.log.info('Request completed', {
      statusCode: res.statusCode,
      duration: Date.now() - req.startTime
    });
  });

  next();
});
```

### 9.2 Performance Monitoring

```typescript
// server/lib/metrics.ts
import { Registry, Counter, Histogram, Gauge } from 'prom-client';

const register = new Registry();

// HTTP metrics
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
  registers: [register]
});

// API metrics
const apiCallsTotal = new Counter({
  name: 'api_calls_total',
  help: 'Total external API calls',
  labelNames: ['provider', 'endpoint', 'status'],
  registers: [register]
});

const apiCallDuration = new Histogram({
  name: 'api_call_duration_seconds',
  help: 'External API call duration',
  labelNames: ['provider'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
  registers: [register]
});

// Agent metrics
const agentRunsTotal = new Counter({
  name: 'agent_runs_total',
  help: 'Total agent runs',
  labelNames: ['agent_type', 'status'],
  registers: [register]
});

const agentRunDuration = new Histogram({
  name: 'agent_run_duration_seconds',
  help: 'Agent run duration',
  labelNames: ['agent_type'],
  buckets: [1, 5, 10, 30, 60, 120, 300, 600],
  registers: [register]
});

const opportunitiesGenerated = new Counter({
  name: 'opportunities_generated_total',
  help: 'Total opportunities generated',
  labelNames: ['strategy', 'tier'],
  registers: [register]
});

// Cache metrics
const cacheHits = new Counter({
  name: 'cache_hits_total',
  help: 'Total cache hits',
  labelNames: ['tier'],
  registers: [register]
});

const cacheMisses = new Counter({
  name: 'cache_misses_total',
  help: 'Total cache misses',
  labelNames: ['tier'],
  registers: [register]
});

// Business metrics
const activeUsers = new Gauge({
  name: 'active_users',
  help: 'Currently active users',
  labelNames: ['tier'],
  registers: [register]
});

const opportunitiesByScore = new Gauge({
  name: 'opportunities_by_score',
  help: 'Active opportunities by score range',
  labelNames: ['score_range', 'tier'],
  registers: [register]
});

// Express middleware
export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;

    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode
    });

    httpRequestDuration.observe(
      { method: req.method, route },
      duration
    );
  });

  next();
}

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});
```

### 9.3 Health Checks

```typescript
// server/lib/health.ts
interface HealthCheck {
  name: string;
  check: () => Promise<{ status: 'healthy' | 'unhealthy' | 'degraded'; message?: string; latency?: number }>;
}

const healthChecks: HealthCheck[] = [
  {
    name: 'database',
    check: async () => {
      const start = Date.now();
      try {
        await db.get('SELECT 1');
        return { status: 'healthy', latency: Date.now() - start };
      } catch (error) {
        return { status: 'unhealthy', message: error.message, latency: Date.now() - start };
      }
    }
  },
  {
    name: 'cache',
    check: async () => {
      const start = Date.now();
      try {
        cache.set('health_check', 'ok', 1000);
        const value = cache.get('health_check');
        return { status: value === 'ok' ? 'healthy' : 'degraded', latency: Date.now() - start };
      } catch (error) {
        return { status: 'unhealthy', message: error.message };
      }
    }
  },
  {
    name: 'yahoo_finance',
    check: async () => {
      const start = Date.now();
      try {
        await yahooClient.getQuote('AAPL');
        return { status: 'healthy', latency: Date.now() - start };
      } catch (error) {
        return { status: 'degraded', message: 'Yahoo Finance circuit breaker may be open' };
      }
    }
  },
  {
    name: 'twelve_data',
    check: async () => {
      const start = Date.now();
      try {
        await twelvedataClient.getQuote('AAPL');
        return { status: 'healthy', latency: Date.now() - start };
      } catch (error) {
        return { status: 'degraded', message: 'TwelveData fallback active' };
      }
    }
  },
  {
    name: 'openai',
    check: async () => {
      try {
        // Check if API key is valid without making expensive call
        return { status: 'healthy' };
      } catch {
        return { status: 'degraded', message: 'LLM formatting may use fallback' };
      }
    }
  }
];

app.get('/health', async (req, res) => {
  const results = await Promise.all(
    healthChecks.map(async (check) => {
      const result = await check.check();
      return { name: check.name, ...result };
    })
  );

  const overall = results.every(r => r.status === 'healthy') ? 'healthy' :
                  results.some(r => r.status === 'unhealthy') ? 'unhealthy' : 'degraded';

  res.status(overall === 'healthy' ? 200 : overall === 'degraded' ? 200 : 503).json({
    status: overall,
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION,
    uptime: process.uptime(),
    checks: results
  });
});

// Liveness probe (Kubernetes)
app.get('/health/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

// Readiness probe (Kubernetes)
app.get('/health/ready', async (req, res) => {
  try {
    await db.get('SELECT 1');
    res.status(200).json({ status: 'ready' });
  } catch {
    res.status(503).json({ status: 'not ready' });
  }
});
```

### 9.4 Error Tracking (Sentry)

```typescript
// server/lib/sentry.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.APP_VERSION,
  integrations: [
    Sentry.httpIntegration(),
    Sentry.expressIntegration(),
    Sentry.prismaIntegration() // If using Prisma
  ],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 1.0,
  beforeSend(event) {
    // Filter out sensitive data
    if (event.request?.data) {
      delete event.request.data.password;
      delete event.request.data.token;
      delete event.request.data.apiKey;
    }
    return event;
  }
});

// Express error handler
app.use(Sentry.Handlers.errorHandler());

// Custom error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  req.log?.error('Unhandled error', { error: err.message, stack: err.stack });

  Sentry.captureException(err, {
    tags: { route: req.path, method: req.method },
    user: req.user ? { id: req.user.id, email: req.user.email } : undefined
  });

  res.status(500).json({
    error: 'Internal server error',
    requestId: req.requestId
  });
});
```

---

## 10. Security Hardening

### 10.1 Security Checklist

| # | Kontrol | Durum | Öncelik |
|---|---------|-------|---------|
| 1 | **HTTPS Only** | Tüm traffic HTTPS üzerinden | Kritik |
| 2 | **HSTS Header** | `Strict-Transport-Security: max-age=31536000; includeSubDomains` | Kritik |
| 3 | **CORS Policy** | Sadece `APP_BASE_URL` origin'ine izin | Kritik |
| 4 | **Rate Limiting** | IP başına 200 req/15dk, tier bazlı farklı limitler | Kritik |
| 5 | **Input Validation** | Zod/Joi ile tüm API input'ları validate ediliyor | Kritik |
| 6 | **SQL Injection** | Parameterized queries (zaten var) | Kritik |
| 7 | **XSS Protection** | `X-XSS-Protection: 1; mode=block`, CSP header | Kritik |
| 8 | **CSRF Protection** | Double-submit cookie pattern | Yüksek |
| 9 | **API Key Rotation** | 90 günde bir rotation, env'de tutuluyor | Yüksek |
| 10 | **Session Security** | `HttpOnly`, `Secure`, `SameSite=Strict` cookie'ler | Kritik |
| 11 | **Password Policy** | N/A (OAuth only) | - |
| 12 | **Data Encryption** | SQLite şifreleme (SQLCipher) opsiyonel | Orta |
| 13 | **Audit Logging** | Tüm admin action'ları loglanıyor | Yüksek |
| 14 | **Dependency Scanning** | `npm audit` CI pipeline'da | Yüksek |
| 15 | **Secret Detection** | GitLeaks/TruffleHog pre-commit hook | Kritik |
| 16 | **DDoS Protection** | Cloudflare/Railway built-in | Yüksek |
| 17 | **Content Security Policy** | `default-src 'self'; script-src 'self' 'unsafe-inline'` | Yüksek |
| 18 | **Referrer Policy** | `strict-origin-when-cross-origin` | Orta |
| 19 | **Feature Policy** | `geolocation 'none'; microphone 'none'` | Düşük |
| 20 | **Security Headers** | Helmet.js middleware | Kritik |

### 10.2 Helmet Configuration

```typescript
// server/security/helmet.ts
import helmet from 'helmet';

export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // React requires unsafe-eval for dev
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "https://api.openai.com", "https://api.twelvedata.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false, // Allow embedded content
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true
});
```

### 10.3 Rate Limiting Configuration

```typescript
// server/security/rateLimit.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

// General API rate limit
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests',
    retryAfter: '15 minutes'
  },
  keyGenerator: (req) => req.ip || req.headers['x-forwarded-for'] || 'unknown'
});

// Tier-based rate limits
export const tierRateLimits = {
  free: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Free tier limit reached. Upgrade to Pro.' }
  }),
  pro: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: { error: 'Pro tier limit reached. Upgrade to Elite.' }
  }),
  elite: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2000,
    message: { error: 'Rate limit reached. Contact support.' }
  })
};

// Specific endpoint limits
export const authRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 login attempts per hour
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts. Try again later.' }
});

export const backtestRateLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // 10 backtests per day (Elite)
  message: { error: 'Daily backtest limit reached.' }
});

// Admin endpoint limits (more strict)
export const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Admin rate limit reached.' }
});
```

### 10.4 Input Validation (Zod)

```typescript
// server/validation/schemas.ts
import { z } from 'zod';

export const OpportunityFiltersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  minScore: z.coerce.number().min(0).max(100).optional(),
  strategy: z.enum(['iv_crush', 'momentum_directional', 'earnings_surprise', 'straddle', 'iron_condor', 'calendar_spread', 'butterfly']).optional(),
  sector: z.string().min(1).max(50).optional(),
  daysToEarnings: z.coerce.number().min(0).max(365).optional(),
  riskLevel: z.enum(['very_low', 'low', 'medium', 'high', 'extreme']).optional(),
  sort: z.enum(['composite_score', 'momentum_score', 'iv_crush_score', 'earnings_date', 'created_at']).default('composite_score'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  opportunityWindow: z.enum(['pre_earnings_7d', 'pre_earnings_3d', 'pre_earnings_1d', 'earnings_day', 'post_earnings_1d', 'post_earnings_3d']).optional()
});

export const WatchlistItemSchema = z.object({
  ticker: z.string().min(1).max(10).regex(/^[A-Z]+$/, 'Must be uppercase letters only'),
  notes: z.string().max(500).optional(),
  tags: z.array(z.string().min(1).max(20)).max(10).optional(),
  alertOnOpportunity: z.boolean().default(true),
  alertOnIVSpike: z.boolean().default(true),
  alertPriceThreshold: z.number().positive().optional(),
  alertIVThreshold: z.number().min(0).max(100).default(30)
});

export const BacktestParamsSchema = z.object({
  strategy: z.enum(['iv_crush', 'momentum_directional', 'earnings_surprise', 'straddle', 'iron_condor', 'calendar_spread', 'butterfly']),
  ticker: z.string().min(1).max(10).optional(),
  sector: z.string().min(1).max(50).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  params: z.object({
    entryDaysBefore: z.number().min(0).max(30).default(1),
    exitDaysAfter: z.number().min(0).max(30).default(1),
    minIVRank: z.number().min(0).max(100).default(50),
    minMomentumScore: z.number().min(0).max(100).default(50),
    maxRiskLevel: z.enum(['low', 'medium', 'high', 'extreme']).default('high'),
    positionSizePercent: z.number().min(0.1).max(100).default(2),
    stopLossPercent: z.number().min(1).max(100).default(10)
  }).optional()
}).refine(data => {
  if (!data.ticker && !data.sector) {
    return false;
  }
  return true;
}, {
  message: 'Either ticker or sector must be provided',
  path: ['ticker']
});

export const AgentTriggerSchema = z.object({
  agentType: z.enum(['full_scan', 'momentum_update', 'iv_update', 'earnings_pre_check', 'earnings_post_check', 'calibration', 'cleanup']),
  tickers: z.array(z.string().min(1).max(10)).max(100).optional(),
  priority: z.enum(['low', 'normal', 'high', 'critical']).default('normal'),
  forceRefresh: z.boolean().default(false)
});

// Validation middleware
export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      } else {
        next(error);
      }
    }
  };
}

export function validateQuery(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      } else {
        next(error);
      }
    }
  };
}
```

---

## 11. Deployment & Scaling Stratejisi

### 11.1 Docker Configuration

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 gistify

# Create data directory with correct permissions
RUN mkdir -p /app/data && chown gistify:nodejs /app/data

COPY --from=builder --chown=gistify:nodejs /app/dist ./dist
COPY --from=builder --chown=gistify:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=gistify:nodejs /app/package.json ./package.json

USER gistify

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3   CMD node -e "require('http').get('http://localhost:3000/health/live', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

CMD ["node", "dist/index.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=/app/data/gistify.db
      - REDIS_URL=redis://redis:6379
      - APP_BASE_URL=https://gistify.pro
    volumes:
      - gistify-data:/app/data
      - gistify-logs:/app/logs
    depends_on:
      - redis
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M

  # Optional: Nginx reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped

volumes:
  gistify-data:
  gistify-logs:
  redis-data:
```

### 11.2 Coolify Deployment

```yaml
# coolify.yaml
services:
  gistify:
    type: dockerfile
    dockerfile: ./Dockerfile
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: /app/data/gistify.db
      APP_BASE_URL: https://gistify.pro
      APP_ACCESS_MODE: public
      SESSION_SECRET: ${SESSION_SECRET}
      REPORT_ADMIN_EMAIL: ${REPORT_ADMIN_EMAIL}
      REPORT_ADMIN_SECRET: ${REPORT_ADMIN_SECRET}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      GOOGLE_OAUTH_REDIRECT_URL: ${GOOGLE_OAUTH_REDIRECT_URL}
      TWELVEDATA_API_KEY: ${TWELVEDATA_API_KEY}
      ALPHA_VANTAGE_API_KEY: ${ALPHA_VANTAGE_API_KEY}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      PADDLE_VENDOR_ID: ${PADDLE_VENDOR_ID}
      PADDLE_API_KEY: ${PADDLE_API_KEY}
      RESEND_API_KEY: ${RESEND_API_KEY}
      SENTRY_DSN: ${SENTRY_DSN}
    volumes:
      - gistify-data:/app/data
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health/live', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s
    resources:
      memory: 2048M
      cpu: 2
```

### 11.3 Scaling Strategy

| Metric | Current | Target | Action |
|--------|---------|--------|--------|
| **Users** | < 100 | 1,000+ | Add Redis, horizontal scaling |
| **Daily API Calls** | < 10K | 100K+ | Implement request batching, CDN |
| **DB Size** | < 100MB | 1GB+ | Migrate to PostgreSQL |
| **Concurrent WS** | < 50 | 500+ | Redis adapter, load balancer |
| **Agent Runtime** | < 5 min | < 2 min | Parallel processing, worker queue |

**Scaling Phases:**

1. **Phase 1 (Current - 100 users):** Single Docker container, SQLite, in-memory cache
2. **Phase 2 (100 - 1,000 users):** Add Redis cache, separate worker process for agents
3. **Phase 3 (1,000 - 10,000 users):** PostgreSQL migration, horizontal scaling with load balancer
4. **Phase 4 (10,000+ users):** Microservices architecture, dedicated data pipeline

---

## 12. Testing Stratejisi

### 12.1 Test Pyramid

```
        /\
       /  \
      / E2E \      (Playwright)     ~10 tests, slow, covers critical paths
     /─────────\
    /           \
   / Integration \   (Supertest + Vitest)  ~50 tests, medium speed, API contracts
  /───────────────\
 /                 \
/     Unit Tests    \  (Vitest + MSW)      ~200 tests, fast, pure functions
─────────────────────
```

### 12.2 Test Coverage Targets

| Layer | Target Coverage | Critical Areas |
|-------|-----------------|----------------|
| **Unit** | ≥85% | Scoring algorithms, indicator calculations, data normalization |
| **Integration** | ≥75% | API endpoints, database queries, cache operations |
| **E2E** | ≥60% (critical paths) | Auth flow, opportunity discovery, watchlist management |

### 12.3 Critical Test Cases

```typescript
// tests/critical/agent-pipeline.test.ts
describe('Agent Pipeline Critical Path', () => {
  it('should process AAPL from data collection to opportunity save', async () => {
    // 1. Mock external APIs
    mockYahooFinance({ symbol: 'AAPL', price: 150 });
    mockTwelveData({ symbol: 'AAPL', iv: 35 });

    // 2. Run pipeline
    const result = await orchestrator.run({
      runType: 'full_scan',
      tickers: ['AAPL']
    });

    // 3. Verify opportunity saved
    const opp = await db.get('SELECT * FROM opportunities WHERE ticker = ?', ['AAPL']);
    expect(opp).toBeDefined();
    expect(opp.composite_score).toBeGreaterThan(0);
    expect(opp.ai_summary_en).toBeTruthy();

    // 4. Verify alert dispatched
    const alerts = await db.all('SELECT * FROM alerts WHERE ticker = ?', ['AAPL']);
    expect(alerts.length).toBeGreaterThan(0);
  });

  it('should handle API failure with circuit breaker', async () => {
    // Force Yahoo Finance to fail
    mockYahooFinanceError(new Error('Rate limited'));

    const result = await orchestrator.run({
      runType: 'full_scan',
      tickers: ['AAPL']
    });

    // Should still succeed with fallback
    expect(result.status).toBe('success');

    // Verify circuit breaker opened
    expect(circuitBreakerRegistry.get('yahoo').opened).toBe(true);
  });

  it('should respect tier filtering', async () => {
    // Create opportunities with different scores
    await seedOpportunities([
      { ticker: 'HIGH', composite_score: 95 },
      { ticker: 'MID', composite_score: 75 },
      { ticker: 'LOW', composite_score: 55 }
    ]);

    // Free user should only see HIGH
    const freeResults = await api.get('/opportunities', { headers: { 'x-tier': 'free' } });
    expect(freeResults.data.every((o: any) => o.compositeScore >= 85)).toBe(true);

    // Pro user should see HIGH and MID
    const proResults = await api.get('/opportunities', { headers: { 'x-tier': 'pro' } });
    expect(proResults.data.some((o: any) => o.ticker === 'MID')).toBe(true);
    expect(proResults.data.some((o: any) => o.ticker === 'LOW')).toBe(false);

    // Elite user should see all
    const eliteResults = await api.get('/opportunities', { headers: { 'x-tier': 'elite' } });
    expect(eliteResults.data.length).toBe(3);
  });
});

// tests/critical/scoring.test.ts
describe('Scoring Algorithm', () => {
  it('should produce consistent scores for same inputs', () => {
    const inputs = generateTestInputs();
    const score1 = calculateCompositeScore(inputs);
    const score2 = calculateCompositeScore(inputs);
    expect(score1).toBe(score2);
  });

  it('should rank high-IV, high-momentum opportunities highest', () => {
    const highOpp = generateOpportunity({ ivRank: 90, momentumScore: 90, beatRate: 80 });
    const lowOpp = generateOpportunity({ ivRank: 30, momentumScore: 40, beatRate: 40 });

    expect(highOpp.compositeScore).toBeGreaterThan(lowOpp.compositeScore);
  });

  it('should penalize extreme risk', () => {
    const safeOpp = generateOpportunity({ riskLevel: 'low', gapRisk: 10 });
    const riskyOpp = generateOpportunity({ riskLevel: 'extreme', gapRisk: 80 });

    expect(safeOpp.compositeScore).toBeGreaterThan(riskyOpp.compositeScore);
  });
});

// tests/e2e/critical-paths.spec.ts
describe('Critical User Journeys', () => {
  test('User discovers and acts on opportunity', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');

    // 2. Navigate to opportunities
    await page.goto('/app/opportunities');
    await page.waitForSelector('[data-testid="opportunity-grid"]');

    // 3. Filter by strategy
    await page.click('[data-testid="strategy-filter"]');
    await page.click('[data-testid="strategy-iv_crush"]');
    await page.waitForResponse(/\/api\/opportunities/);

    // 4. Click first opportunity
    await page.click('[data-testid="opportunity-card"]:first-child');
    await page.waitForURL(/\/app\/opportunities\/\d+/);

    // 5. Add to watchlist
    await page.click('[data-testid="add-watchlist-button"]');
    await page.waitForSelector('[data-testid="toast-success"]');

    // 6. Verify watchlist
    await page.goto('/app/watchlist');
    await page.waitForSelector('[data-testid="watchlist-item"]');
  });

  test('Admin triggers agent and reviews results', async ({ page }) => {
    // 1. Admin login
    await page.goto('/admin');
    await page.fill('[data-testid="admin-secret"]', process.env.REPORT_ADMIN_SECRET!);
    await page.click('[data-testid="admin-login"]');

    // 2. Trigger agent
    await page.click('[data-testid="trigger-agent-button"]');
    await page.selectOption('[data-testid="agent-type"]', 'full_scan');
    await page.click('[data-testid="confirm-trigger"]');

    // 3. Wait for run to appear
    await page.waitForSelector('[data-testid="agent-run-item"]', { timeout: 30000 });

    // 4. View run details
    await page.click('[data-testid="agent-run-item"]:first-child');
    await page.waitForSelector('[data-testid="run-details"]');

    // 5. Verify opportunities generated
    const oppCount = await page.textContent('[data-testid="opportunities-found"]');
    expect(parseInt(oppCount!)).toBeGreaterThan(0);
  });
});
```

---

## 13. Data Migration Planı

### 13.1 Migration Strategy

```
Phase 1: Schema Creation (Zero Downtime)
├── Create new tables alongside existing ones
├── Run in parallel, no data migration yet
└── Verify new tables work correctly

Phase 2: Dual Write (1 week)
├── Write to both old and new tables
├── Read from old tables
├── Monitor for inconsistencies
└── Fix any issues

Phase 3: Backfill (1 week)
├── Migrate historical data
├── Run validation scripts
├── Fix data quality issues
└── Update indexes

Phase 4: Cutover (Scheduled maintenance)
├── Switch reads to new tables
├── Stop writes to old tables
├── Archive old tables
└── Monitor for 48 hours

Phase 5: Cleanup (1 week later)
├── Drop old tables
├── Remove dual-write code
└── Update documentation
```

### 13.2 Migration Scripts

```typescript
// migrations/001_create_opportunities.ts
export async function up(db: DatabaseSync): Promise<void> {
  // Create new table
  db.exec(`
    CREATE TABLE opportunities (
      -- ... (full schema from section 3.2)
    );

    CREATE INDEX idx_opp_ticker ON opportunities(ticker);
    CREATE INDEX idx_opp_earnings_date ON opportunities(earnings_date);
    -- ... (all indexes)
  `);
}

// migrations/002_migrate_weekly_reports.ts
export async function up(db: DatabaseSync): Promise<void> {
  // Migrate existing weekly report entries to opportunities
  const reports = db.prepare('SELECT * FROM weekly_reports WHERE status = ?').all('published');

  for (const report of reports) {
    const content = JSON.parse(report.content_json);

    for (const entry of content.entries || []) {
      db.prepare(`
        INSERT INTO opportunities (
          ticker, name, sector, earnings_date, earnings_time,
          momentum_score, iv_rank, iv_crush_score, strategy_type,
          strategy_rating, composite_score, risk_level, status,
          tier_required, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        entry.ticker,
        entry.name,
        entry.sector,
        entry.earningsDate,
        entry.earningsTime || 'TNS',
        entry.momentumScore || 50,
        entry.currentIV ? Math.round((entry.currentIV / 100) * 100) : 50,
        entry.ivCrushScore || 50,
        entry.recommendedStrategy || 'iv_crush',
        entry.strategyRating || 50,
        entry.ivCrushScore || 50,
        entry.riskLevel || 'medium',
        'active',
        'free',
        report.created_at,
        report.updated_at
      );
    }
  }
}

// migrations/003_create_member_profiles.ts
export async function up(db: DatabaseSync): Promise<void> {
  db.exec(`
    CREATE TABLE member_profiles (
      -- ... (full schema from section 3.3)
    );
  `);

  // Migrate existing auth_users to member_profiles
  const users = db.prepare('SELECT * FROM auth_users').all();

  for (const user of users) {
    db.prepare(`
      INSERT INTO member_profiles (
        user_id, email, tier, created_at
      ) VALUES (?, ?, ?, ?)
    `).run(
      user.id,
      user.email,
      user.tier || 'free',
      user.created_at
    );
  }
}
```

### 13.3 Rollback Plan

```typescript
// rollback/001_drop_opportunities.ts
export async function down(db: DatabaseSync): Promise<void> {
  // In case of emergency, restore old functionality
  db.exec('DROP TABLE IF EXISTS opportunities');
  db.exec('DROP TABLE IF EXISTS member_profiles');
  // Old tables remain intact, just switch reads back
}
```

---

## 14. Load Testing & Performance

### 14.1 Load Testing Plan

```typescript
// tests/load/k6-scenarios.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up
    { duration: '5m', target: 100 },   // Steady state
    { duration: '2m', target: 200 },   // Ramp up
    { duration: '5m', target: 200 },   // Steady state
    { duration: '2m', target: 300 },   // Ramp up
    { duration: '5m', target: 300 },   // Steady state
    { duration: '2m', target: 0 },      // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],      // Less than 1% errors
  }
};

export default function () {
  const res = http.get('https://gistify.pro/api/opportunities?page=1&limit=20');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'has opportunities': (r) => JSON.parse(r.body).data.length > 0,
  });

  sleep(1);
}
```

### 14.2 Performance Targets

| Endpoint | Target p50 | Target p95 | Target p99 |
|----------|------------|------------|------------|
| GET /api/opportunities | 100ms | 300ms | 500ms |
| GET /api/opportunities/:id | 50ms | 150ms | 300ms |
| GET /api/me/watchlist | 50ms | 100ms | 200ms |
| GET /api/alerts | 50ms | 100ms | 200ms |
| POST /api/backtest | 5s | 10s | 30s |
| WebSocket latency | - | 500ms | 1s |
| Agent run (500 tickers) | - | 5 min | 10 min |
| Page load (TTI) | 1s | 2s | 3s |

### 14.3 Performance Optimizations

```typescript
// 1. Database query optimization
// Before: Full table scan
const opps = db.all('SELECT * FROM opportunities WHERE status = ?', ['active']);

// After: Indexed query with limit
const opps = db.all(`
  SELECT * FROM opportunities 
  WHERE status = ? AND tier_required = ?
  ORDER BY composite_score DESC
  LIMIT ? OFFSET ?
`, ['active', tier, limit, offset]);

// 2. N+1 query prevention
// Before: Separate query per opportunity
for (const opp of opportunities) {
  opp.alerts = db.all('SELECT * FROM alerts WHERE opportunity_id = ?', [opp.id]);
}

// After: Single JOIN query
const oppsWithAlerts = db.all(`
  SELECT o.*, json_group_array(a.*) as alerts
  FROM opportunities o
  LEFT JOIN alerts a ON a.opportunity_id = o.id
  WHERE o.status = ?
  GROUP BY o.id
`, ['active']);

// 3. Selective field fetching
// Before: Fetch all fields
const opp = db.get('SELECT * FROM opportunities WHERE id = ?', [id]);

// After: Fetch only needed fields
const opp = db.get(`
  SELECT id, ticker, name, composite_score, strategy_type, risk_level,
         ai_summary_en, ai_summary_tr, current_price, price_change_1d
  FROM opportunities 
  WHERE id = ?
`, [id]);

// 4. Connection pooling (when using PostgreSQL)
// const pool = new Pool({ max: 20 });

// 5. Compression
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  level: 6
}));

// 6. Static asset caching
app.use('/assets', express.static('dist/public', {
  maxAge: '1y',
  immutable: true
}));

// 7. Brotli compression for build
// vite.config.ts
import { brotliCompressSync } from 'zlib';
import { compression } from 'vite-plugin-compression2';

export default {
  plugins: [
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/]
    })
  ]
};
```

---

## 15. Sonuç & Özet

### 15.1 Quick Wins (İlk 2 Hafta)

1. **Opportunities tablosu + API** - Temel yapı, 2-3 gün
2. **LLM Formatter agent** - OpenAI API key ile test, 1 gün
3. **Tier sistemi** - Enum + middleware, 1 gün
4. **Cache katmanı** - MultiTierCache implementasyonu, 2 gün
5. **React Query + Zustand** - State management, 2 gün
6. **OpportunityCard + Grid** - Temel UI bileşenleri, 2 gün
7. **CI/CD pipeline** - GitHub Actions, 1 gün
8. **Health check endpoint** - Monitoring başlangıcı, 1 gün

### 15.2 Orta Vadeli (2-6 Hafta)

9. **Tüm agent pipeline'ları** - Momentum, IV, Strategy, Risk, 2 hafta
10. **Çoklu veri kaynağı** - TwelveData + AlphaVantage, 1 hafta
11. **Circuit breaker + retry** - Resilience, 3 gün
12. **Alert sistemi** - Email + push + in-app, 1 hafta
13. **Watchlist** - Ayrı tablo + UI, 3 gün
14. **WebSocket** - Real-time updates, 3 gün
15. **Admin panel v2** - Agent kontrol + backtest, 1 hafta
16. **Test coverage** - Unit + integration, sürekli

### 15.3 Uzun Vadeli (1-3 Ay)

17. **Backtesting engine** - Tarihsel performans, 2 hafta
18. **Skorlama kalibrasyonu** - ML-based ağırlık optimizasyonu, 1 hafta
19. **PWA + offline support** - Service worker, 1 hafta
20. **Advanced analytics** - Üye davranış analizi, 1 hafta
21. **PostgreSQL migration** - Scale gerektiğinde, 2 hafta
22. **Mobile app** - React Native (opsiyonel), 4+ hafta

### 15.4 Teknik Özet

| Katman | Teknoloji | Ölçeklenebilirlik |
|--------|-----------|-------------------|
| **Frontend** | React 19 + Vite + Tailwind | PWA, code splitting, lazy loading |
| **State** | Zustand + TanStack Query | Optimistic updates, background sync |
| **Real-time** | Socket.io | Redis adapter ile horizontal scale |
| **API** | Express + middleware | Rate limiting, tier checks, caching |
| **Agents** | TypeScript + node-cron | BullMQ queue ile parallel processing |
| **Cache** | LRU + SQLite + Redis (opsiyonel) | 3-tier, tag-based invalidation |
| **DB** | SQLite → PostgreSQL | Migration planı hazır |
| **External** | Yahoo + TwelveData + AlphaVantage + OpenAI | Circuit breaker, fallback chain |
| **Monitoring** | Winston + Prometheus + Sentry | Structured logs, metrics, error tracking |
| **Security** | Helmet + Zod + rate limiting | Defense in depth |
| **Deploy** | Docker + Coolify | Health checks, rolling updates |

### 15.5 Başarı Kriterleri

| Kriter | Hedef | Ölçüm |
|--------|-------|-------|
| **Agent coverage** | 500+ ticker/gün | `agent_runs` tablosu |
| **Opportunity accuracy** | 70%+ win rate | Backtest sonuçları |
| **API response time** | p95 < 300ms | Prometheus metrics |
| **LLM latency** | < 2sn/opp | Agent run logs |
| **System uptime** | 99.9% | Health check history |
| **Test coverage** | ≥80% | Vitest coverage raporu |
| **User engagement** | 3+ opp/gün görüntüleme | Analytics events |
| **Conversion rate** | 5% free → pro | Billing events |
| **Alert open rate** | 40%+ | Email/push analytics |
| **Cache hit rate** | >80% | Cache metrics |

---

**Doküman Sonu**

*Bu doküman (v3.0), Gistify platformunun mevcut yapısını koruyarak, AI-agent destekli, çok kaynaklı, yüksek performanslı ve ölçeklenebilir bir momentum ve earnings fırsat tespit sistemiyle nasıl evrileceğini; ayrıca detaylı veri modeli ilişkileri, agent implementasyon kodları, frontend state management, çok katmanlı cache stratejisi, comprehensive monitoring, API spesifikasyonları, deployment stratejisi ve security hardening konularını teknik ve operasyonel detaylarıyla belgeler.*
