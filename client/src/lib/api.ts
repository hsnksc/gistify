import { copy, type AppLanguage } from "@/lib/i18n";

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function summarizeResponseBody(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 220);
}

export function extractApiErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object") {
    const message = normalizeString((payload as { error?: unknown }).error);
    if (message) {
      return message;
    }
  }

  return fallback;
}

export async function readJsonResponse<T>(
  response: Response,
  context: string,
  language: AppLanguage = "tr"
): Promise<T> {
  const rawBody = await response.text();
  if (!rawBody.trim()) {
    return {} as T;
  }

  try {
    return JSON.parse(rawBody) as T;
  } catch {
    const contentType = normalizeString(response.headers.get("content-type"));
    const snippet = summarizeResponseBody(rawBody);

    if (/^\s*</.test(rawBody)) {
      throw new Error(
        `${context}: ${copy(
          language,
          `sunucu JSON yerine HTML dondu (HTTP ${response.status}). Muhtemel neden: eski deploy, proxy fallback veya admin route'unun yayinlanmamis olmasi.`,
          `server returned HTML instead of JSON (HTTP ${response.status}). Possible cause: stale deploy, proxy fallback, or an unpublished admin route.`
        )} ${snippet}`
      );
    }

    throw new Error(
      `${context}: ${copy(
        language,
        `gecersiz JSON yaniti alindi (HTTP ${response.status}${contentType ? `, ${contentType}` : ""}).`,
        `invalid JSON response received (HTTP ${response.status}${contentType ? `, ${contentType}` : ""}).`
      )} ${snippet}`
    );
  }
}
