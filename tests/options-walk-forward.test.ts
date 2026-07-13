import { describe, expect, it } from "vitest";
import { walkForwardValidate } from "../server/optionsWalkForward";

describe("options walk-forward validation", () => {
  it("selects candidates on training windows and reports only out-of-sample performance", () => {
    const samples = Array.from({ length: 140 }, (_, index) => ({
      date: `2026-${String(Math.floor(index / 28) + 1).padStart(2, "0")}-${String(index % 28 + 1).padStart(2, "0")}`,
      candidateReturns: {
        conservative: index % 5 === 0 ? -0.004 : 0.003,
        unstable: index % 3 === 0 ? -0.03 : 0.012,
      },
    }));
    const result = walkForwardValidate(samples, { trainSize: 60, testSize: 20 });
    expect(result.folds).toHaveLength(4);
    expect(result.folds.every(fold => fold.selectedCandidate === "conservative")).toBe(true);
    expect(result.compoundedReturn).toBeGreaterThan(0);
    expect(result.outOfSampleSharpe).toBeGreaterThan(0.5);
    expect(result.passed).toBe(true);
  });
});
