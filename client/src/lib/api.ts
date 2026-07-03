import { type AppLanguage, t } from "@/lib/i18n";

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
        `${context}: ${t("common:serverReturnedHtmlInsteadOf", { status: response.status })} ${snippet}`
      );
    }

    throw new Error(
      `${context}: ${t("common:invalidJsonResponseReceivedHttp", { status: response.status, contenttypeContenttype: contentType ? `, ${contentType}` : "" })} ${snippet}`
    );
  }
}
