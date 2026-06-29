import { describe, expect, it } from "vitest";
import { getViewerFlowReportSummaries } from "../../server/services/flowService";

describe("flow report summaries live smoke", () => {
  it("builds summaries for current repo flow sources without throwing", () => {
    expect(() => getViewerFlowReportSummaries([], {})).not.toThrow();

    const reports = getViewerFlowReportSummaries([], {});
    expect(reports.length).toBeGreaterThan(0);
  });
});
