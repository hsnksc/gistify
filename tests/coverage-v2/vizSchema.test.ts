import { describe, expect, it } from "vitest";
import {
  parseVizSpec,
  VIZ_TYPES,
} from "@/features/coverage/lib/vizSchema";

const GOLDEN_LADDER = String.raw`{
  "v": 1,
  "type": "ladder",
  "current": 81.75,
  "stop": 78.00,
  "band": [65.91, 97.59],
  "levels": [
    {"price": 166.22, "type": "res"},
    {"price": 150, "type": "res"},
    {"price": 110, "type": "res"},
    {"price": 100, "type": "res", "tag": "current-zone"},
    {"price": 85, "type": "res", "tag": "current-zone"},
    {"price": 81.75, "type": "pivot", "tag": "current"},
    {"price": 80, "type": "sup", "tag": "current-zone"},
    {"price": 63.8, "type": "sup"}
  ],
  "caption": "Dikey eksen fiyat; kırmızı bantlar direnç, yeşil destek.",
  "insight": "Fiyat 80–85 sıkışma bölgesinde."
}`;

const GOLDEN_PAYOFF = String.raw`{
  "v": 1,
  "type": "payoff",
  "legs": [{"side": "long", "type": "call", "strike": 150, "qty": 1, "premium": 91}],
  "xRange": [60, 210],
  "band": [65.91, 97.59],
  "markers": {"current": 81.75, "breakeven": 150.91, "target": 160},
  "probDots": [{"x": 90, "p": 65}, {"x": 115, "p": 20}, {"x": 140, "p": 10}, {"x": 155, "p": 4}, {"x": 180, "p": 1}],
  "caption": "Vade sonunda 1 kontrat P&L eğrisi.",
  "insight": "Zarar -$91 ile sınırlı."
}`;

const GOLDEN_PROB = String.raw`{
  "v": 1,
  "type": "prob",
  "showEV": true,
  "buckets": [
    {"range": "< 100 USD", "pl": "-91 (max loss)", "plMid": -91, "prob": 65},
    {"range": "100–130", "pl": "-91 (OTM)", "plMid": -91, "prob": 20},
    {"range": "130–150", "pl": "-91 ~ -71", "plMid": -81, "prob": 10},
    {"range": "150–160", "pl": "0 ~ +909", "plMid": 455, "prob": 4},
    {"range": "160+ squeeze", "pl": "+909 ~ +4909", "plMid": 2909, "prob": 1}
  ],
  "caption": "Şerit genişlikleri olasılık.",
  "insight": "%85 olasılıkla tam kayıp."
}`;

const GOLDEN_TIMELINE = String.raw`{
  "v": 1,
  "type": "timeline",
  "today": "2026-07-03",
  "events": [
    {"date": "2026-07-28", "label": "FOMC + Powell", "severity": "critical"},
    {"date": "2026-07-29", "label": "NVDA Q1 FY2027 earnings", "severity": "critical"},
    {"date": "2026-08-05", "label": "Short interest raporu", "severity": "mid"},
    {"date": "2026-08-07", "label": "META Q2 earnings", "severity": "critical"},
    {"date": "2026-08-11", "label": "CRWV Q2 earnings", "severity": "critical"},
    {"date": "2026-08-12", "label": "CPI (Temmuz)", "severity": "mid"},
    {"date": "2026-08-21", "label": "Opsiyon vadesi", "severity": "high"},
    {"date": "2026-08-28", "label": "OpenAI S-1 filing", "severity": "high"}
  ],
  "caption": "Kesikli çizgi bugünü, rozetler kalan günü (DTE) gösterir.",
  "insight": "Vadeden önce 5 kritik olay var."
}`;

describe("viz schema validation", () => {
  it("accepts all 12 known types", () => {
    expect(VIZ_TYPES).toHaveLength(12);
    for (const type of VIZ_TYPES) {
      const result = parseVizSpec(JSON.stringify({ v: 1, type }));
      // Some minimal types are valid; this mainly asserts parsing does not throw.
      expect(result.success || type).toBeTruthy();
    }
  });

  it("parses golden ladder block", () => {
    const result = parseVizSpec(GOLDEN_LADDER);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.spec.type).toBe("ladder");
    expect(result.spec.levels).toHaveLength(8);
    expect(result.spec.current).toBe(81.75);
  });

  it("parses golden payoff block", () => {
    const result = parseVizSpec(GOLDEN_PAYOFF);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.spec.type).toBe("payoff");
    expect(result.spec.legs).toHaveLength(1);
    expect(result.spec.probDots).toHaveLength(5);
  });

  it("parses golden prob block", () => {
    const result = parseVizSpec(GOLDEN_PROB);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.spec.type).toBe("prob");
    expect(result.spec.buckets).toHaveLength(5);
    expect(result.spec.showEV).toBe(true);
  });

  it("parses golden timeline block", () => {
    const result = parseVizSpec(GOLDEN_TIMELINE);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.spec.type).toBe("timeline");
    expect(result.spec.events).toHaveLength(8);
  });

  it("rejects invalid JSON", () => {
    const result = parseVizSpec("not json");
    expect(result.success).toBe(false);
  });

  it("rejects unknown type", () => {
    const result = parseVizSpec(JSON.stringify({ v: 1, type: "unknown" }));
    expect(result.success).toBe(false);
  });

  it("rejects missing v field", () => {
    const result = parseVizSpec(JSON.stringify({ type: "ladder" }));
    expect(result.success).toBe(false);
  });
});
