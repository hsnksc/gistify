import type { CoverageStoredRecord } from "./coverageParser";

export interface CoverageApiListResponse {
  reports: CoverageStoredRecord[];
}

export interface CoverageApiDetailResponse {
  report: CoverageStoredRecord;
}

export async function fetchCoverageReports(): Promise<CoverageStoredRecord[]> {
  const response = await fetch("/api/coverage/reports", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch coverage reports: ${response.status}`);
  }

  const payload = (await response.json()) as CoverageApiListResponse;
  return payload.reports || [];
}

export async function fetchCoverageReport(
  id: string
): Promise<CoverageStoredRecord | null> {
  const response = await fetch(
    `/api/coverage/reports/${encodeURIComponent(id)}`,
    { credentials: "include" }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch coverage report: ${response.status}`);
  }

  const payload = (await response.json()) as CoverageApiDetailResponse;
  return payload.report || null;
}
