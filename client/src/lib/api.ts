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
  context: string
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
        `${context}: sunucu JSON yerine HTML dondu (HTTP ${response.status}). Muhtemel neden: eski deploy, proxy fallback veya admin route'unun yayinlanmamis olmasi. ${snippet}`
      );
    }

    throw new Error(
      `${context}: gecersiz JSON yaniti alindi (HTTP ${response.status}${contentType ? `, ${contentType}` : ""}). ${snippet}`
    );
  }
}
