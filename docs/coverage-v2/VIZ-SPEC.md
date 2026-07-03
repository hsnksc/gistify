# Coverage Viz DSL — Yazar (Admin) Şeması

Coverage raporlarına deklaratif görselleştirme eklemek için kullanılan markdown DSL'i.

## Format

Markdown içinde tek bir JSON objesi içeren ` ```viz ` fenced block kullanılır:

```markdown
```viz
{ "v": 1, "type": "ladder", ... }
```
```

- `"v"` şema versiyonudur; şu an `1` olmalıdır.
- `"type"` aşağıdaki 12 türden biri olmalıdır.
- `"caption"` ve `"insight"` opsiyoneldir; render sonrası kartın altında "Nasıl okunur" ve "Kilit çıkarım" satırları olarak görünür.

## Frontmatter Uzantıları

### `spark` — hero kartı sparkline'ı

```yaml
---
metrics:
  price: 81.75
  change_pct: -5.2
spark:
  price: [85.12, 84.50, 83.20, 82.10, 81.75]
---
```

- `spark.price`: son kapanış fiyatlarının dizisi (soldan sağa kronolojik).

### `strategy.max_gain: "unlimited"`

Sınırsız kazanç profilli stratejilerde (örn. uzun call):

```yaml
---
strategy:
  name: Long Call 150C
  legs: 1x Long 150C @ 2026-08-21
  cost: 91
  max_gain: unlimited
  max_loss: 91
  breakeven: 150.91
---
```

- `max_gain` artık `number | "unlimited"` alır; `"unlimited"` yazıldığında kartta "Sınırsız / Unlimited" gösterilir.

## 12 Viz Tipi

### 1. `ladder` — Seviye merdiveni

Dikey fiyat ekseni; direnç/destek/pivot seviyeleri ve opsiyon bandı.

```viz
{
  "v": 1,
  "type": "ladder",
  "current": 81.75,
  "stop": 78.00,
  "band": [65.91, 97.59],
  "levels": [
    { "price": 166.22, "type": "res" },
    { "price": 150, "type": "res" },
    { "price": 110, "type": "res" },
    { "price": 100, "type": "res", "tag": "current-zone" },
    { "price": 85, "type": "res", "tag": "current-zone" },
    { "price": 81.75, "type": "pivot", "tag": "current" },
    { "price": 80, "type": "sup", "tag": "current-zone" },
    { "price": 63.8, "type": "sup" }
  ],
  "caption": "Dikey eksen fiyat; kırmızı bantlar direnç, yeşil destek. Mavi şerit opsiyonların ima ettiği ±%18.4 hareket bandı.",
  "insight": "Fiyat 80–85 sıkışma bölgesinde; 78 altı kapanış 63.80'i açar, 150 hedefi +%83 uzakta."
}
```

| Alan | Tür | Zorunlu | Açıklama |
|---|---|---|---|
| `levels` | `{price,type,tag?}[]` | evet | `type`: `"res"`, `"sup"` veya `"pivot"` |
| `current` | `number` | evet | Güncel fiyat |
| `stop` | `number` | hayır | Stop seviyesi |
| `band` | `[number, number]` | hayır | Opsiyonların ima ettiği hareket bandı [lo, hi] |

---

### 2. `gauge` — RSI/IV yay göstergesi

```viz
{
  "v": 1,
  "type": "gauge",
  "value": 37.98,
  "min": 0,
  "max": 100,
  "zones": [
    { "to": 30, "color": "var(--color-bull)", "label": "Aşırı satım" },
    { "to": 70, "color": "var(--color-caution)", "label": "Nötr" },
    { "to": 100, "color": "var(--color-bear)", "label": "Aşırı alım" }
  ],
  "label": "RSI 14",
  "caption": "Yay üzerinde iğne mevcut değeri gösterir; renk zonları aşırı satım/alım bölgeleridir.",
  "insight": "RSI 38 civarında nötr-negatif bölgede; momentum henüz aşırı satıma ulaşmadı."
}
```

| Alan | Tür | Zorunlu |
|---|---|---|
| `value` | `number` | evet |
| `min` | `number` | hayır (varsayılan 0) |
| `max` | `number` | hayır (varsayılan 100) |
| `zones` | `{to,color?,label?}[]` | hayır |
| `label` | `string` | hayır |

---

### 3. `bullet` — Spread/normal-bant karşılaştırması

```viz
{
  "v": 1,
  "type": "bullet",
  "value": 81.75,
  "band": [80, 85],
  "max": 100,
  "label": "Fiyat vs Sıkışma Bandı",
  "caption": "Ana çubuk mevcut fiyatı; gri arka plan normal bandı gösterir.",
  "insight": "Fiyat 80–85 sıkışma bandının üst kısmında; üzerinde kalıcılık 85 direncini hedefler."
}
```

| Alan | Tür | Zorunlu |
|---|---|---|
| `value` | `number` | evet |
| `band` | `[number, number]` | evet |
| `max` | `number` | evet |
| `label` | `string` | hayır |

---

### 4. `payoff` — Opsiyon vade P&L eğrisi

```viz
{
  "v": 1,
  "type": "payoff",
  "legs": [
    { "side": "long", "type": "call", "strike": 150, "qty": 1, "premium": 91 }
  ],
  "xRange": [60, 210],
  "band": [65.91, 97.59],
  "markers": {
    "current": 81.75,
    "breakeven": 150.91,
    "target": 160
  },
  "probDots": [
    { "x": 90, "p": 65 },
    { "x": 115, "p": 20 },
    { "x": 140, "p": 10 },
    { "x": 155, "p": 4 },
    { "x": 180, "p": 1 }
  ],
  "caption": "Vade sonunda 1 kontrat P&L eğrisi; kırmızı alan kayıp, yeşil kâr bölgesi. Daire boyutu senaryo olasılığı.",
  "insight": "Zarar -$91 ile sınırlı; kâr ancak +%84 üzeri harekette başlıyor — klasik lottery-ticket profili."
}
```

| Alan | Tür | Zorunlu |
|---|---|---|
| `legs` | `{side,type,strike,qty?,premium?}[]` | evet |
| `xRange` | `[number, number]` | evet |
| `band` | `[number, number]` | hayır |
| `markers` | `{current?,breakeven?,target?}` | hayır |
| `probDots` | `{x,p}[]` | hayır |

Leg tipleri:
- `side`: `"long"` | `"short"`
- `type`: `"call"` | `"put"` | `"stock"`

---

### 5. `earnings` — EPS tahmin/gerçek barlar + sürpriz lollipop

```viz
{
  "v": 1,
  "type": "earnings",
  "rows": [
    { "q": "Q1 2025", "est": -0.12, "act": -0.08, "surprise": 33.3, "rev": 98.4, "reaction": 5.2 },
    { "q": "Q2 2025", "est": -0.09, "act": -0.11, "surprise": -22.2, "rev": 102.1, "reaction": -3.1 }
  ],
  "caption": "Mavi barlar piyasa tahminini, turuncu noktalar gerçekleşeni gösterir.",
  "insight": "Son iki çeyrekte sürprizler karışık; gelir artışına rağmen marj baskısı sürdü."
}
```

| Alan | Tür | Zorunlu |
|---|---|---|
| `rows` | `{q,est,act,surprise?,rev?,reaction?}[]` | evet |

---

### 6. `rangeDot` — Konsensüs low–mid–high whisker

```viz
{
  "v": 1,
  "type": "rangeDot",
  "rows": [
    {
      "metric": "Hedef Fiyat",
      "low": 80,
      "value": 143.41,
      "high": 200,
      "analysts": 12,
      "revision": { "from": 135, "window": "30 gün" }
    }
  ],
  "caption": "Nokta ortalama hedef; yatay çizgi low-high aralığını gösterir.",
  "insight": "Ortalama hedef %75 yukarı potansiyel taşıyor; revizyonlar son 30 günde yukarı yönlü."
}
```

| Alan | Tür | Zorunlu |
|---|---|---|
| `rows` | `{metric,low,value,high,analysts?,revision?}[]` | evet |
| `revision` | `{from,window}` | hayır |

---

### 7. `donut` — Backlog konsantrasyonu

```viz
{
  "v": 1,
  "type": "donut",
  "total": 4200,
  "unit": "MW",
  "slices": [
    { "name": "Microsoft", "value": 1200 },
    { "name": "NVIDIA", "value": 900 },
    { "name": "OpenAI", "value": 700 },
    { "name": "Diğer", "value": 1400 }
  ],
  "note": "Backlog değişkenliğine göre örnek dağılım.",
  "caption": "Dilim büyüklüğü backlog payını temsil eder; %5'in altındaki dilimler 'Diğer' altında gruplanır.",
  "insight": "İlk üç müşteri backlog'un %66'sını oluşturuyor; müşteri konsantrasyonu yüksek."
}
```

| Alan | Tür | Zorunlu |
|---|---|---|
| `total` | `number` | evet |
| `unit` | `string` | hayır |
| `slices` | `{name,value}[]` | evet |
| `note` | `string` | hayır |

---

### 8. `network` — Ekosistem grafı

```viz
{
  "v": 1,
  "type": "network",
  "center": { "id": "CRWV", "label": "CoreWeave" },
  "nodes": [
    { "id": "MSFT", "label": "Microsoft", "relation": "customer", "weight": 0.9 },
    { "id": "NVDA", "label": "NVIDIA", "relation": "supplier", "weight": 0.85 },
    { "id": "ORCL", "label": "Oracle", "relation": "partner", "weight": 0.6 },
    { "id": "OAI", "label": "OpenAI", "relation": "frenemy", "weight": 0.5 },
    { "id": "GS", "label": "Goldman Sachs", "relation": "underwriter", "weight": 0.4 }
  ],
  "caption": "Merkezde ticker; çizgi kalınlığı ve renk ilişki tipine göre değişir.",
  "insight": "CRWV hem NVIDIA'nın en büyük müşterilerinden biri hem de Microsoft/OpenAI ile rekabet ediyor."
}
```

| Alan | Tür | Zorunlu |
|---|---|---|
| `center` | `{id,label?}` | evet |
| `nodes` | `{id,label?,relation,weight?}[]` | evet |

`relation` değerleri: `"customer"`, `"supplier"`, `"frenemy"`, `"partner"`, `"underwriter"`

---

### 9. `chainViz` — IV eğrisi + hacim barları

```viz
{
  "v": 1,
  "type": "chainViz",
  "rows": [
    { "strike": 70, "iv": 1.12, "volume": 120, "delta": -0.12 },
    { "strike": 80, "iv": 0.98, "volume": 340, "delta": -0.22 },
    { "strike": 90, "iv": 0.85, "volume": 890, "delta": -0.38, "atm": true },
    { "strike": 100, "iv": 0.82, "volume": 560, "delta": 0.31 },
    { "strike": 110, "iv": 0.88, "volume": 210, "delta": 0.19 }
  ],
  "caption": "Çizgi implied volatility; yarı saydam barlar hacmi gösterir. ATM kırmızı ile işaretlenir.",
  "insight": "ATM civarında IV en düşük; uç strike'larda volatilite tepesi — çan eğrisi."
}
```

| Alan | Tür | Zorunlu |
|---|---|---|
| `rows` | `{strike,iv,volume?,delta?,atm?}[]` | evet |

---

### 10. `prob` — Segmentli olasılık şeridi + EV

```viz
{
  "v": 1,
  "type": "prob",
  "showEV": true,
  "buckets": [
    { "range": "< 100 USD", "pl": "-91 (max loss)", "plMid": -91, "prob": 65 },
    { "range": "100–130", "pl": "-91 (OTM)", "plMid": -91, "prob": 20 },
    { "range": "130–150", "pl": "-91 ~ -71", "plMid": -81, "prob": 10 },
    { "range": "150–160", "pl": "0 ~ +909", "plMid": 455, "prob": 4 },
    { "range": "160+ squeeze", "pl": "+909 ~ +4909", "plMid": 2909, "prob": 1 }
  ],
  "caption": "Şerit genişlikleri olasılık; renk P&L işaretine göre.",
  "insight": "%85 olasılıkla tam kayıp; beklenen değer negatif — pozisyon boyutu buna göre küçük tutulmalı."
}
```

| Alan | Tür | Zorunlu |
|---|---|---|
| `buckets` | `{range,pl?,plMid,prob}[]` | evet |
| `showEV` | `boolean` | hayır |

Beklenen değer (EV) bileşen içinde `Σ p×plMid` olarak hesaplanır; varsayım notuyla birlikte gösterilir.

---

### 11. `timeline` — Katalizör zaman çizelgesi

```viz
{
  "v": 1,
  "type": "timeline",
  "today": "2026-07-03",
  "events": [
    { "date": "2026-07-28", "label": "FOMC + Powell", "severity": "critical" },
    { "date": "2026-07-29", "label": "NVDA Q1 FY2027 earnings", "severity": "critical" },
    { "date": "2026-08-05", "label": "Short interest raporu", "severity": "mid" },
    { "date": "2026-08-07", "label": "META Q2 earnings", "severity": "critical" },
    { "date": "2026-08-11", "label": "CRWV Q2 earnings", "severity": "critical" },
    { "date": "2026-08-12", "label": "CPI (Temmuz)", "severity": "mid" },
    { "date": "2026-08-21", "label": "Opsiyon vadesi", "severity": "high" },
    { "date": "2026-08-28", "label": "OpenAI S-1 filing", "severity": "high" }
  ],
  "caption": "Kesikli çizgi bugünü, rozetler kalan günü (DTE) gösterir.",
  "insight": "Vadeden önce 5 kritik makro/mikro olay var; pozisyon tümünün volatilitesine maruz."
}
```

| Alan | Tür | Zorunlu |
|---|---|---|
| `today` | `string` (ISO date) | evet |
| `events` | `{date,label,severity}[]` | evet |

`severity` değerleri: `"critical"`, `"high"`, `"mid"`

---

### 12. `scenario` — Bull/Base/Bear kartları

```viz
{
  "v": 1,
  "type": "scenario",
  "cases": [
    {
      "key": "bull",
      "title": "Squeeze + hedef revizyonu",
      "drivers": [
        ["Microsoft", "Yeni sözleşme duyurusu", "bull"],
        ["NVIDIA", "Stokta kalma haberi", "bull"],
        ["FOMC", "Dovish 25bp", "bull"]
      ],
      "range": [150, 200],
      "pl": 4909
    },
    {
      "key": "base",
      "title": "Yatay sıkışma devamı",
      "drivers": [
        ["Piyasa", "Netflow zayıf", "neutral"],
        ["CRWV", "Guidance inline", "neutral"]
      ],
      "range": [75, 95],
      "pl": -91
    },
    {
      "key": "bear",
      "title": "Direnç kırılımı + short baskısı",
      "drivers": [
        ["OpenAI", "Rakip GPU anlaşması", "bear"],
        ["Short", "Short float artışı", "bear"]
      ],
      "range": [60, 75],
      "pl": -91
    }
  ],
  "caption": "Kartlar varsayım, fiyat aralığı ve beklenen P&L'yi bir arada gösterir.",
  "insight": "Base senaryo zararla sonuçlanıyor; bull senaryo küçük olasılıklı ama asimetrik kazanç sunuyor."
}
```

| Alan | Tür | Zorunlu |
|---|---|---|
| `cases` | `{key,title,drivers?,range?,pl?}[]` | evet |

`drivers` içindeki her satır `[actor, note]` veya `[actor, note, tone]` şeklinde olabilir; `tone` değerleri: `"bull"`, `"bear"`, `"neutral"`.

---

## Doğrulama & Hata Davranışı

- Geçersiz JSON veya şema hatası durumunda sayfa **patlamaz**.
- Hatalı blok yerine "Görselleştirme yüklenemedi" fallback kartı çıkar; ham blok `<details>` içinde gösterilir.
- Tanınmayan `"type"` değeri aynı fallback'e düşer.
- Gelecekte şema değişikliği gerektiğinde `"v"` alanı artırılarak geriye dönük uyumluluk korunur.

## Teknik Notlar

- Tüm render CSS custom property'leri (`var(--color-*)`) üzerinden yapılır; inline hex kullanılmaz.
- Sayılar ve eksen etiketleri `JetBrains Mono` ile, başlıklar `IBM Plex Sans` ile render edilir.
- `prefers-reduced-motion` etkin olduğunda animasyonlar kapatılır.
- Viz blokları SSR gerektirmez; mevcut SPA yapısına uygundur.
