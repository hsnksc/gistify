import { describe, expect, it } from "vitest";
import { parseEarningsStrategyMarkdown } from "../server/earningsStrategy";

describe("earnings strategy current-format parser", () => {
  it("reads unnumbered ticker headings and combines multiple calendar tables", () => {
    const markdown = `# Gistify Earnings Opsiyon Master Stratejisi

**Dönem:** Temmuz 2026 + Ağustos 2026
**Rapor Tarihi:** 2026-07-01

| Tarih | Hisse | Saat | Sektör | Not |
|---|---|---|---|---|
| 2026-07-16 | **NFLX** | AMC | Teknoloji | Q2 |

| Tarih | Hisse | Saat | Sektör | Not |
|---|---|---|---|---|
| 2026-08-20 | **NVDA** | AMC | Teknoloji | Q2 |

### NFLX — $74.22 | IV Rank: 72/100 | CPR: 0.85 | NEUTRAL

| Parametre | Değer |
|---|---|
| **Fiyat** | $74.22 |
| **Sektör** | Teknoloji |
| **Entry** | 11 Jul – 14 Jul |
| **Exit** | 17 Jul – 18 Jul |
| **IV Rank** | 72/100 |

#### Strateji 1: Iron Condor
| Parametre | Değer |
|---|---|
| Maliyet | $1.86 |
| Max Loss | $314 |
`;

    const result = parseEarningsStrategyMarkdown(markdown, "current.md");

    expect(result?.calendar.map(item => item.ticker)).toEqual(["NFLX", "NVDA"]);
    expect(result?.strategies).toHaveLength(1);
    expect(result?.strategies[0]).toMatchObject({
      ticker: "NFLX",
      cpr: "0.85",
      type: "Iron Condor",
      entry: "11 Jul – 14 Jul",
      exit: "17 Jul – 18 Jul",
    });
  });
});
