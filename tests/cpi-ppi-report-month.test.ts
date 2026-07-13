import { describe, expect, it, vi } from "vitest";
import type { MacroForecastWorkspaceData } from "../shared/cpiPpiForecast";
import { resolveForecastReportMonth } from "../shared/cpiPpiForecast";

vi.mock("../server/services/macroArchiveStore", () => ({
  createMacroArchiveStore: () => ({}),
}));

import { resolveArchiveMonth } from "../server/cpiPpiForecast";

function forecast(overrides: Partial<MacroForecastWorkspaceData> = {}) {
  return {
    key: "cpi",
    generatedAt: "2026-07-13T00:00:00Z",
    reportDate: "2026-07-13",
    title: "CPI forecast",
    summary: "",
    baseCase: "",
    conviction: 70,
    release: {
      name: "CPI",
      period: "Jun 2026",
      releaseDate: "2026-07-14",
      releaseTimeEt: "08:30 ET",
      headlineMoM: "+0.1%",
      headlineYoY: "3.9%",
      coreMoM: "+0.2%",
      coreYoY: "2.9%",
      bias: "COOLER",
      confidence: 70,
      thesis: "",
    },
    scenarios: [],
    setups: [],
    watchItems: [],
    keyDrivers: [],
    risks: [],
    ...overrides,
  } satisfies MacroForecastWorkspaceData;
}

describe("CPI/PPI report month", () => {
  it("uses the publication month instead of the covered inflation period", () => {
    const snapshot = forecast();

    expect(resolveForecastReportMonth(snapshot)).toBe("2026-07");
    expect(resolveArchiveMonth(snapshot)).toBe("2026-07");
  });

  it("falls back to the release period for legacy snapshots without dates", () => {
    expect(
      resolveForecastReportMonth(forecast({ reportDate: "", generatedAt: "" }))
    ).toBe("2026-06");
  });
});
