const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_TRANSLATION_MODEL = "gpt-4.1";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const DEFAULT_MISTRAL_MODEL = "mistral-medium-latest";
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
  const candidates = [
    "OPENAI_API_KEY",
    "OPENAI_KEY",
    "OPENAI_SECRET",
    "OPENAI_API_SECRET",
  ];
  for (const key of candidates) {
    const value = normalizeString(process.env[key]);
    if (value) {
      return value;
    }
  }
  return "";
}

function getOpenAiTranslationModel() {
  return (
    normalizeString(process.env.OPENAI_TRANSLATION_MODEL) ||
    DEFAULT_TRANSLATION_MODEL
  );
}

function getMistralApiKey() {
  const candidates = [
    "MISTRAL_API_KEY",
    "MISTRAL_KEY",
  ];
  for (const key of candidates) {
    const value = normalizeString(process.env[key]);
    if (value) {
      return value;
    }
  }
  return "";
}

function getMistralModel() {
  return (
    normalizeString(process.env.MISTRAL_TRANSLATION_MODEL) ||
    DEFAULT_MISTRAL_MODEL
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

function languageDisplayName(code: string) {
  if (code === "tr") return "Turkish";
  if (code === "en") return "English";
  return code;
}

async function translateWithOpenAI(
  keyedTexts: { key: string; text: string }[],
  source: string,
  target: string
) {
  const apiKey = getOpenAiTranslationApiKey();
  if (!apiKey) {
    return null;
  }

  const sourceName = languageDisplayName(source);
  const targetName = languageDisplayName(target);

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
          type: "message",
          role: "user",
          content: [
            {
              type: "input_text",
              text: [
                `Translate each ${sourceName} string into natural ${targetName}.`,
                "Preserve markdown, bullet markers, whitespace structure, URLs, dates, ticker symbols, numbers, and casing where it carries meaning.",
                `Do not summarize. Do not omit details. If text is already ${targetName} or should stay unchanged, return it as-is.`,
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
    const errorMessage = extractErrorMessage(
      parsedBody,
      "OpenAI ceviri istegi basarisiz oldu."
    );
    console.error(
      `[openaiTranslation] OpenAI API error ${response.status}: ${errorMessage}`,
      { rawBody: rawBody.slice(0, 500) }
    );
    throw new Error(errorMessage);
  }

  const outputText = extractOutputText(parsedBody);
  return parseJsonSafely(outputText);
}

async function translateWithMistral(
  keyedTexts: { key: string; text: string }[],
  source: string,
  target: string
) {
  const apiKey = getMistralApiKey();
  if (!apiKey) {
    return null;
  }

  const sourceName = languageDisplayName(source);
  const targetName = languageDisplayName(target);

  const response = await fetch(MISTRAL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getMistralModel(),
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            `You are a professional ${sourceName}-to-${targetName} translator for financial and market-analysis reports. ` +
            "Return only valid JSON mapping each input id to its translation.",
        },
        {
          role: "user",
          content: [
            `Translate each ${sourceName} string into natural ${targetName}.`,
            "Preserve markdown, bullet markers, whitespace structure, URLs, dates, ticker symbols, numbers, and casing where it carries meaning.",
            `Do not summarize. Do not omit details. If text is already ${targetName} or should stay unchanged, return it as-is.`,
            "Return only valid JSON in the shape {\"t1\":\"...\",\"t2\":\"...\"}.",
            JSON.stringify(keyedTexts),
          ].join("\n\n"),
        },
      ],
    }),
  });

  const rawBody = await response.text();
  const parsedBody = parseJsonSafely(rawBody);

  if (!response.ok) {
    const errorMessage = extractErrorMessage(
      parsedBody,
      "Mistral ceviri istegi basarisiz oldu."
    );
    console.error(
      `[openaiTranslation] Mistral API error ${response.status}: ${errorMessage}`,
      { rawBody: rawBody.slice(0, 500) }
    );
    throw new Error(errorMessage);
  }

  const content =
    parsedBody &&
    typeof parsedBody === "object" &&
    Array.isArray((parsedBody as { choices?: unknown[] }).choices)
      ? normalizeString(
          ((parsedBody as { choices: Array<{ message?: { content?: unknown } }> }).choices[0] || {})
            .message?.content
        )
      : "";

  return parseJsonSafely(content);
}

export async function translateTexts(
  texts: string[],
  source: string,
  target: string
) {
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

  const openAiKey = getOpenAiTranslationApiKey();
  const mistralKey = getMistralApiKey();

  if (!openAiKey && !mistralKey) {
    const error = new Error("No translation API key configured. Translation unavailable.");
    (error as Error & { statusCode?: number }).statusCode = 503;
    throw error;
  }

  const keyedTexts = uncachedTexts.map((text, index) => ({
    key: `t${index + 1}`,
    text,
  }));

  let outputPayload: unknown = null;

  try {
    if (openAiKey) {
      outputPayload = await translateWithOpenAI(keyedTexts, source, target);
    }

    if (!outputPayload && mistralKey) {
      outputPayload = await translateWithMistral(keyedTexts, source, target);
    }
  } catch (providerError) {
    console.error(
      "[openaiTranslation] Translation provider failed, returning source texts.",
      providerError instanceof Error ? providerError.message : providerError
    );
    return translations;
  }

  if (!outputPayload || typeof outputPayload !== "object") {
    console.warn(
      `[openaiTranslation] Could not parse output JSON.`
    );
    return translations;
  }

  for (const [key, sourceText] of keyedTexts.map(
    entry => [entry.key, entry.text] as const
  )) {
    const candidate = normalizeString(
      (outputPayload as Record<string, unknown>)[key]
    );
    const translated = candidate || sourceText;
    translations[sourceText] = translated;
    setCacheValue(sourceText, translated);
  }

  return translations;
}

export async function translateTurkishTextsToEnglish(texts: string[]) {
  return translateTexts(texts, "tr", "en");
}
