import type { CoverageStoredRecord } from "./coverageParser";

export interface CoverageApiListResponse {
  reports: CoverageStoredRecord[];
}

export interface CoverageApiDetailResponse {
  report: CoverageStoredRecord;
}

export interface CoverageAdminApiListResponse {
  localReports: CoverageStoredRecord[];
  reports: CoverageStoredRecord[];
  rootPath: string;
}

export interface CoverageAdminApiUpsertResponse {
  report: CoverageStoredRecord;
  reports: CoverageStoredRecord[];
}

export interface CoverageAdminImportResponse {
  imported: number;
  reports: CoverageStoredRecord[];
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

function adminHeaders(adminSecret: string) {
  return {
    "Content-Type": "application/json",
    "x-gistify-admin-secret": adminSecret,
  };
}

export async function fetchCoverageAdminReports(adminSecret: string) {
  const response = await fetch("/api/admin/coverage/reports", {
    credentials: "include",
    headers: {
      "x-gistify-admin-secret": adminSecret,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch coverage admin reports: ${response.status}`);
  }

  return (await response.json()) as CoverageAdminApiListResponse;
}

export async function upsertCoverageAdminReport(
  adminSecret: string,
  input: {
    raw: string;
    sourceName?: string;
  }
) {
  const response = await fetch("/api/admin/coverage/reports", {
    method: "POST",
    credentials: "include",
    headers: adminHeaders(adminSecret),
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(
      payload?.error ||
        `Failed to save coverage admin report: ${response.status}`
    );
  }

  return (await response.json()) as CoverageAdminApiUpsertResponse;
}

export async function importLocalCoverageAdminReports(adminSecret: string) {
  const response = await fetch("/api/admin/coverage/reports/import-local", {
    method: "POST",
    credentials: "include",
    headers: adminHeaders(adminSecret),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(
      payload?.error ||
        `Failed to import local coverage reports: ${response.status}`
    );
  }

  return (await response.json()) as CoverageAdminImportResponse;
}

export function getCoverageMarkdownDownloadHref(id: string) {
  return `/api/coverage/reports/${encodeURIComponent(id)}/markdown`;
}

export function getCoverageZipDownloadHref() {
  return "/api/coverage/reports/download";
}
