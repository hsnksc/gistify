const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_TRANSLATION_MODEL = "gpt-4.1";
const MAX_TEXTS_PER_REQUEST = 24;
const MAX_TEXT_LENGTH = 2_000;
const MAX_TOTAL_TEXT_LENGTH = 18_000;
const MAX_CACHE_ENTRIES = 2_000;

const translationCache = new Map<string, string>();

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseJsonSafely(value: string) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  const withoutFence = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  try {
    return JSON.parse(withoutFence) as unknown;
  } catch {
    return null;
  }
}

function extractErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const errorSource = (payload as { error?: { message?: unknown } }).error;
  const message =
    errorSource && typeof errorSource === "object"
      ? normalizeString(errorSource.message)
      : "";

  return message || fallback;
}

function extractOutputText(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const direct = (payload as { output_text?: unknown }).output_text;
  if (typeof direct === "string" && direct.trim()) {
    return direct.trim();
  }

  const outputs = Array.isArray((payload as { output?: unknown[] }).output)
    ? ((payload as { output: unknown[] }).output as Array<Record<string, unknown>>)
    : [];

  const parts: string[] = [];

  for (const output of outputs) {
    if (output.type !== "message" || !Array.isArray(output.content)) {
      continue;
    }

    for (const item of output.content as Array<Record<string, unknown>>) {
      const candidate = normalizeString(item.text);
      if (candidate) {
        parts.push(candidate);
      }
    }
  }

  return parts.join("\n").trim();
}

function getOpenAiTranslationApiKey() {
  return normalizeString(process.env.OPENAI_API_KEY);
}

function getOpenAiTranslationModel() {
  return (
    normalizeString(process.env.OPENAI_TRANSLATION_MODEL) ||
    DEFAULT_TRANSLATION_MODEL
  );
}

function setCacheValue(source: string, translation: string) {
  translationCache.set(source, translation);
  if (translationCache.size <= MAX_CACHE_ENTRIES) {
    return;
  }

  const oldestKey = translationCache.keys().next().value;
  if (typeof oldestKey === "string") {
    translationCache.delete(oldestKey);
  }
}

export function normalizeTranslationTexts(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  const normalized: string[] = [];
  let totalLength = 0;

  for (const entry of value) {
    const text = normalizeString(entry);
    if (!text) {
      continue;
    }

    const sliced = text.slice(0, MAX_TEXT_LENGTH);
    if (!sliced) {
      continue;
    }

    if (normalized.length >= MAX_TEXTS_PER_REQUEST) {
      break;
    }

    if (totalLength + sliced.length > MAX_TOTAL_TEXT_LENGTH) {
      break;
    }

    normalized.push(sliced);
    totalLength += sliced.length;
  }

  return Array.from(new Set(normalized));
}

export async function translateTurkishTextsToEnglish(texts: string[]) {
  const uniqueTexts = normalizeTranslationTexts(texts);
  const translations = Object.fromEntries(
    uniqueTexts.map(text => [text, text])
  ) as Record<string, string>;

  if (!uniqueTexts.length) {
    return translations;
  }

  const uncachedTexts = uniqueTexts.filter(text => {
    const cached = translationCache.get(text);
    if (cached) {
      translations[text] = cached;
      return false;
    }

    return true;
  });

  if (!uncachedTexts.length) {
    return translations;
  }

  const apiKey = getOpenAiTranslationApiKey();
  if (!apiKey) {
    return translations;
  }

  const keyedTexts = uncachedTexts.map((text, index) => ({
    key: `t${index + 1}`,
    text,
  }));

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getOpenAiTranslationModel(),
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: [
                "Translate each Turkish string into natural English.",
                "Preserve markdown, bullet markers, whitespace structure, URLs, dates, ticker symbols, numbers, and casing where it carries meaning.",
                "Do not summarize. Do not omit details. If text is already English or should stay unchanged, return it as-is.",
                "Return only valid JSON in the shape {\"t1\":\"...\",\"t2\":\"...\"}.",
                JSON.stringify(keyedTexts),
              ].join("\n\n"),
            },
          ],
        },
      ],
    }),
  });

  const rawBody = await response.text();
  const parsedBody = parseJsonSafely(rawBody);

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(parsedBody, "OpenAI ceviri istegi basarisiz oldu.")
    );
  }

  const outputText = extractOutputText(parsedBody);
  const outputPayload = parseJsonSafely(outputText);

  if (!outputPayload || typeof outputPayload !== "object") {
    return translations;
  }

  for (const [key, source] of keyedTexts.map(entry => [entry.key, entry.text] as const)) {
    const candidate = normalizeString(
      (outputPayload as Record<string, unknown>)[key]
    );
    const translated = candidate || source;
    translations[source] = translated;
    setCacheValue(source, translated);
  }

  return translations;
}
