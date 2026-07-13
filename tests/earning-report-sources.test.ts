import { describe, expect, it } from "vitest";
import { listEarningReportSources } from "../server/earningReportSources";

describe("earning report source ordering", () => {
  it("uses semantic report dates and keeps the newest reporting period current", () => {
    const reports = listEarningReportSources();
    const current = reports[0];
    const temmuz = reports.find(report => report.fileName === "Temmuz_Earnings_Strateji.md");

    expect(current?.fileName).toBe("202607_202608_Earnings_Opsiyon_Master_Stratejisi.md");
    expect(current?.reportDate).toBe("2026-07-01");
    expect(temmuz?.reportDate).toBe("2026-06-09");
  });
});
