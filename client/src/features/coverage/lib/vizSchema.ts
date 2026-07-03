import { z } from "zod";

/**
 * Coverage Viz DSL — version 1
 *
 * Markdown içinde ` ```viz ` fenced block'larına yerleştirilen, tek bir JSON
 * objesinden oluşan deklaratif görselleştirme sözleşmesi.
 *
 * Her blok: `{ "v": 1, "type": "...", ...props }`
 */

const vizBaseSchema = z.object({
  v: z.literal(1),
  caption: z.string().optional(),
  insight: z.string().optional(),
});

// ---------------------------------------------------------------------------
// 1. ladder — Seviye merdiveni
// ---------------------------------------------------------------------------
export const ladderSchema = vizBaseSchema.extend({
  type: z.literal("ladder"),
  levels: z.array(
    z.object({
      price: z.number(),
      type: z.enum(["res", "sup", "pivot"]),
      tag: z.string().optional(),
    })
  ),
  current: z.number(),
  stop: z.number().optional(),
  band: z.tuple([z.number(), z.number()]).optional(),
});

// ---------------------------------------------------------------------------
// 2. gauge — RSI/IV yay göstergesi
// ---------------------------------------------------------------------------
export const gaugeSchema = vizBaseSchema.extend({
  type: z.literal("gauge"),
  value: z.number(),
  min: z.number().default(0),
  max: z.number().default(100),
  zones: z
    .array(
      z.object({
        to: z.number(),
        color: z.string().optional(),
        label: z.string().optional(),
      })
    )
    .optional(),
  label: z.string().optional(),
});

// ---------------------------------------------------------------------------
// 3. bullet — Spread/normal-bant karşılaştırması
// ---------------------------------------------------------------------------
export const bulletSchema = vizBaseSchema.extend({
  type: z.literal("bullet"),
  value: z.number(),
  band: z.tuple([z.number(), z.number()]),
  max: z.number(),
  label: z.string().optional(),
});

// ---------------------------------------------------------------------------
// 4. payoff — Opsiyon vade P&L eğrisi
// ---------------------------------------------------------------------------
export const payoffLegSchema = z.object({
  side: z.enum(["long", "short"]),
  type: z.enum(["call", "put", "stock"]),
  strike: z.number(),
  qty: z.number().default(1),
  premium: z.number().default(0),
});

export const payoffSchema = vizBaseSchema.extend({
  type: z.literal("payoff"),
  legs: z.array(payoffLegSchema),
  xRange: z.tuple([z.number(), z.number()]),
  band: z.tuple([z.number(), z.number()]).optional(),
  markers: z
    .object({
      current: z.number().optional(),
      breakeven: z.number().optional(),
      target: z.number().optional(),
    })
    .optional(),
  probDots: z
    .array(
      z.object({
        x: z.number(),
        p: z.number(),
      })
    )
    .optional(),
});

// ---------------------------------------------------------------------------
// 5. earnings — EPS tahmin/gerçek barlar + sürpriz lollipop
// ---------------------------------------------------------------------------
export const earningsSchema = vizBaseSchema.extend({
  type: z.literal("earnings"),
  rows: z.array(
    z.object({
      q: z.string(),
      est: z.number(),
      act: z.number(),
      surprise: z.number().optional(),
      rev: z.number().optional(),
      reaction: z.number().optional(),
    })
  ),
});

// ---------------------------------------------------------------------------
// 6. rangeDot — Konsensüs low–mid–high whisker
// ---------------------------------------------------------------------------
export const rangeDotSchema = vizBaseSchema.extend({
  type: z.literal("rangeDot"),
  rows: z.array(
    z.object({
      metric: z.string(),
      low: z.number(),
      value: z.number(),
      high: z.number(),
      analysts: z.number().optional(),
      revision: z
        .object({
          from: z.number(),
          window: z.string(),
        })
        .optional(),
    })
  ),
});

// ---------------------------------------------------------------------------
// 7. donut — Backlog konsantrasyonu
// ---------------------------------------------------------------------------
export const donutSchema = vizBaseSchema.extend({
  type: z.literal("donut"),
  total: z.number(),
  unit: z.string().optional(),
  slices: z.array(
    z.object({
      name: z.string(),
      value: z.number(),
    })
  ),
  note: z.string().optional(),
});

// ---------------------------------------------------------------------------
// 8. network — Ekosistem grafı
// ---------------------------------------------------------------------------
export const networkSchema = vizBaseSchema.extend({
  type: z.literal("network"),
  center: z.object({
    id: z.string(),
    label: z.string().optional(),
  }),
  nodes: z.array(
    z.object({
      id: z.string(),
      label: z.string().optional(),
      relation: z.enum(["customer", "supplier", "frenemy", "partner", "underwriter"]),
      weight: z.number().optional(),
    })
  ),
});

// ---------------------------------------------------------------------------
// 9. chainViz — IV eğrisi + hacim barları (strike bazında)
// ---------------------------------------------------------------------------
export const chainVizSchema = vizBaseSchema.extend({
  type: z.literal("chainViz"),
  rows: z.array(
    z.object({
      strike: z.number(),
      iv: z.number(),
      volume: z.number().optional(),
      delta: z.number().optional(),
      atm: z.boolean().optional(),
    })
  ),
});

// ---------------------------------------------------------------------------
// 10. prob — Segmentli olasılık şeridi + EV
// ---------------------------------------------------------------------------
export const probSchema = vizBaseSchema.extend({
  type: z.literal("prob"),
  buckets: z.array(
    z.object({
      range: z.string(),
      pl: z.string().optional(),
      plMid: z.number(),
      prob: z.number(),
    })
  ),
  showEV: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// 11. timeline — Katalizör zaman çizelgesi
// ---------------------------------------------------------------------------
export const timelineSchema = vizBaseSchema.extend({
  type: z.literal("timeline"),
  today: z.string(),
  events: z.array(
    z.object({
      date: z.string(),
      label: z.string(),
      severity: z.enum(["critical", "high", "mid"]),
    })
  ),
});

// ---------------------------------------------------------------------------
// 12. scenario — Bull/Base/Bear kartları
// ---------------------------------------------------------------------------
export const scenarioSchema = vizBaseSchema.extend({
  type: z.literal("scenario"),
  cases: z.array(
    z.object({
      key: z.string(),
      title: z.string(),
      drivers: z.array(z.array(z.string())).optional(),
      range: z.tuple([z.number(), z.number()]).optional(),
      pl: z.number().optional(),
    })
  ),
});

// ---------------------------------------------------------------------------
// Birleşik şema
// ---------------------------------------------------------------------------
export const vizSpecSchema = z.union([
  ladderSchema,
  gaugeSchema,
  bulletSchema,
  payoffSchema,
  earningsSchema,
  rangeDotSchema,
  donutSchema,
  networkSchema,
  chainVizSchema,
  probSchema,
  timelineSchema,
  scenarioSchema,
]);

export type CoverageVizSpec = z.infer<typeof vizSpecSchema>;

export type VizType = CoverageVizSpec["type"];

export interface CoverageVizBlock {
  error?: string;
  raw: string;
  spec?: CoverageVizSpec;
  type: "viz";
}

export const VIZ_TYPES: VizType[] = [
  "ladder",
  "gauge",
  "bullet",
  "payoff",
  "earnings",
  "rangeDot",
  "donut",
  "network",
  "chainViz",
  "prob",
  "timeline",
  "scenario",
];

/**
 * Ham JSON metnini parse edip şemaya göre doğrular.
 * Başarısız olursa sayfa patlamaz; hata mesajı ve ham içerik fallback'de kullanılır.
 */
export function parseVizSpec(raw: string):
  | { success: true; spec: CoverageVizSpec }
  | { success: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    return {
      success: false,
      error: `Invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  const result = vizSpecSchema.safeParse(parsed);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join("; "),
    };
  }

  return { success: true, spec: result.data };
}

/**
 * Türkçe/İngilizce etiketler. Arayüz metinleri bu fonksiyon üzerinden döner;
 * caption/insight gibi yazar metinleri ise JSON'da TR olarak kalır.
 */
export function vizLabel(
  language: "tr" | "en",
  key:
    | "howToRead"
    | "keyTakeaway"
    | "vizError"
    | "unknownType"
    | "rawBlock"
    | "expectedValue"
    | "assumption"
    | VizType
) {
  const labels: Record<typeof key, [string, string]> = {
    howToRead: ["Nasıl okunur", "How to read"],
    keyTakeaway: ["Kilit çıkarım", "Key takeaway"],
    vizError: ["Görselleştirme yüklenemedi", "Visualization could not be loaded"],
    unknownType: ["Bilinmeyen görselleştirme tipi", "Unknown visualization type"],
    rawBlock: ["Ham blok", "Raw block"],
    expectedValue: ["Beklenen değer", "Expected value"],
    assumption: ["Varsayım notu", "Assumption note"],
    ladder: ["Seviye Merdiveni", "Level Ladder"],
    gauge: ["Gösterge", "Gauge"],
    bullet: ["Karşılaştırma", "Bullet"],
    payoff: ["P&L Eğrisi", "Payoff Curve"],
    earnings: ["Kazanç Geçmişi", "Earnings History"],
    rangeDot: ["Hedef Aralığı", "Range Dot"],
    donut: ["Konsantrasyon", "Concentration"],
    network: ["Ekosistem", "Ecosystem"],
    chainViz: ["Opsiyon Zinciri", "Option Chain"],
    prob: ["Olasılık Dağılımı", "Probability Distribution"],
    timeline: ["Katalizör Zaman Çizelgesi", "Catalyst Timeline"],
    scenario: ["Senaryolar", "Scenarios"],
  };

  const entry = labels[key];
  return language === "en" ? entry[1] : entry[0];
}
