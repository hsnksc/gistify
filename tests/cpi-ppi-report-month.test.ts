import { describe, expect, it, vi } from "vitest";
import type { MacroForecastWorkspaceData } from "../shared/cpiPpiForecast";
import {
  normalizeForecastMonth,
  resolveForecastMeasurementMonth,
} from "../shared/cpiPpiForecast";

vi.mock("../server/services/macroArchiveStore", () => ({
  createMacroArchiveStore: () => ({}),
}));

import { resolveArchiveMonth } from "../server/cpiPpiForecast";

function forecast(overrides: Partial<MacroForecastWorkspaceData> = {}) {
  return {
    key: "cpi",
    measurementMonth: "",
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
  it("uses the covered inflation period instead of the publication month", () => {
    const snapshot = forecast();

    expect(resolveForecastMeasurementMonth(snapshot)).toBe("2026-06");
    expect(resolveArchiveMonth(snapshot)).toBe("2026-06");
  });

  it("prefers an explicit measurement month", () => {
    expect(
      resolveForecastMeasurementMonth(
        forecast({ measurementMonth: "2026-07" })
      )
    ).toBe("2026-07");
  });

  it("uses publication dates only when no measured period exists", () => {
    expect(
      resolveForecastMeasurementMonth(
        forecast({
          measurementMonth: "",
          release: { ...forecast().release, period: "" },
        })
      )
    ).toBe("2026-07");
  });

  it("normalizes named release periods for legacy JSON", () => {
    expect(normalizeForecastMonth("Jul 2026")).toBe("2026-07");
    expect(normalizeForecastMonth("2026-07")).toBe("2026-07");
    expect(normalizeForecastMonth("2026-13")).toBeNull();
  });
});
