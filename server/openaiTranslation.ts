import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { buildProtectedTerms } from "../shared/marketTerms";
import { buildTranslationSystemPrompt } from "./i18n/prompt";
import {
  getTranslationMemoryEntry,
  upsertTranslationMemoryEntry,
} from "./i18n/translationMemory";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_TRANSLATION_MODEL = "gpt-4.1";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const DEFAULT_MISTRAL_MODEL = "mistral-medium-latest";
const TRANSLATION_PROMPT_VERSION = "2026-07-07";
const MAX_TEXTS_PER_REQUEST = 24;
const MAX_TEXT_LENGTH = 2_000;
const MAX_TOTAL_TEXT_LENGTH = 18_000;
const MAX_DOCUMENT_TEXT_LENGTH = 80_000;
const MAX_CACHE_ENTRIES = 2_000;

const translationCache = new Map<string, string>();
const protectedTerms = buildProtectedTerms();

export interface TranslationItem {
  context?: string;
  id: string;
  text: string;
}

interface TranslationGlossary {
  [term: string]: {
    en: string;
  };
}

interface TermReplacement {
  original: string;
  placeholder: string;
}

interface PreparedTranslationItem {
  cacheKey: string;
  context: string;
  originalIds: string[];
  originalText: string;
  protectedText: string;
  providerId: string;
  replacements: TermReplacement[];
  sourceHash: string;
}

function readTranslationJsonFile<T>(fileName: string, fallback: T) {
  try {
    return JSON.parse(
      fs.readFileSync(
        path.resolve(process.cwd(), "server", "i18n", fileName),
        "utf8"
      )
    ) as T;
  } catch (error) {
    console.warn(
      `[openaiTranslation] Failed to read server/i18n/${fileName}. Using fallback.`,
      error instanceof Error ? error.message : error
    );
    return fallback;
  }
}

const translationGlossary = readTranslationJsonFile<TranslationGlossary>(
  "glossary.json",
  {}
);
const translationDoNotTranslate = readTranslationJsonFile<string[]>(
  "do-not-translate.json",
  []
);
const translationSystemPrompt = buildTranslationSystemPrompt({
  doNotTranslate: translationDoNotTranslate,
  glossary: translationGlossary,
});

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

function hashTranslationPayload(parts: {
  context?: string;
  source: string;
  target: string;
  text: string;
}) {
  return crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        context: parts.context || "",
        promptVersion: TRANSLATION_PROMPT_VERSION,
        source: parts.source,
        target: parts.target,
        text: parts.text,
      })
    )
    .digest("hex");
}

function buildTranslationCacheKey(parts: {
  context?: string;
  source: string;
  target: string;
  text: string;
}) {
  return [
    TRANSLATION_PROMPT_VERSION,
    parts.source,
    parts.target,
    parts.context || "",
    parts.text,
  ].join("\u0001");
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function protectMarketTerms(
  text: string,
  startIndex: number
): {
  replacements: TermReplacement[];
  text: string;
} {
  let result = text;
  const replacements: TermReplacement[] = [];

  const protectPattern = (pattern: RegExp, prefix: string) => {
    result = result.replace(pattern, match => {
      const placeholder = `__GISTIFY_${prefix}_${startIndex}_${replacements.length}__`;
      replacements.push({ original: match, placeholder });
      return placeholder;
    });
  };

  // Preserve structured tokens exactly as-is.
  protectPattern(/\{\{[^}]+\}\}/g, "TPL");
  protectPattern(/`[^`\n]+`/g, "CODE");
  protectPattern(/\[[^\]]+\]\([^)]+\)/g, "MDLINK");
  protectPattern(/https?:\/\/\S+/gi, "URL");
  protectPattern(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "MAIL");
  protectPattern(/[$@][A-Za-z0-9._-]+/g, "TAG");

  for (let i = 0; i < protectedTerms.length; i += 1) {
    const term = protectedTerms[i];
    if (!term) {
      continue;
    }

    const regex = new RegExp(
      `(?<=^|[^a-zA-Z0-9._])${escapeRegex(term)}(?=[^a-zA-Z0-9._]|$)`,
      "g"
    );

    result = result.replace(regex, match => {
      const placeholder = `__GISTIFY_TERM_${startIndex}_${replacements.length}__`;
      replacements.push({ original: match, placeholder });
      return placeholder;
    });
  }

  return { replacements, text: result };
}

function restoreMarketTerms(
  text: string,
  replacements: TermReplacement[]
): string {
  let result = text;
  for (const { original, placeholder } of replacements) {
    result = result.replace(
      new RegExp(escapeRegex(placeholder), "g"),
      original
    );
  }
  return result;
}

function hasAllProtectedPlaceholders(
  text: string,
  replacements: TermReplacement[]
) {
  return replacements.every(({ placeholder }) => text.includes(placeholder));
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
    ? ((payload as { output: unknown[] }).output as Array<
        Record<string, unknown>
      >)
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
  const candidates = ["MISTRAL_API_KEY", "MISTRAL_KEY"];
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

function setCacheValue(cacheKey: string, translation: string) {
  translationCache.set(cacheKey, translation);
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

export function normalizeTranslationItems(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as TranslationItem[];
  }

  const normalized: TranslationItem[] = [];
  const seenIds = new Set<string>();
  let totalLength = 0;

  for (let index = 0; index < value.length; index += 1) {
    const entry = value[index];
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const item = entry as {
      context?: unknown;
      id?: unknown;
      text?: unknown;
    };
    const text = normalizeString(item.text).slice(0, MAX_TEXT_LENGTH);
    if (!text) {
      continue;
    }

    if (normalized.length >= MAX_TEXTS_PER_REQUEST) {
      break;
    }

    if (totalLength + text.length > MAX_TOTAL_TEXT_LENGTH) {
      break;
    }

    const rawId = normalizeString(item.id) || `item-${index + 1}`;
    const id = seenIds.has(rawId) ? `${rawId}-${index + 1}` : rawId;
    seenIds.add(id);

    normalized.push({
      context: normalizeString(item.context),
      id,
      text,
    });
    totalLength += text.length;
  }

  return normalized;
}

async function translateWithOpenAI(
  keyedTexts: { context?: string; key: string; text: string }[],
  target: string
) {
  const apiKey = getOpenAiTranslationApiKey();
  if (!apiKey) {
    return null;
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      instructions: translationSystemPrompt,
      model: getOpenAiTranslationModel(),
      input: [
        {
          type: "message",
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify({
                items: keyedTexts.map(({ context, key, text }) => ({
                  context: context || "",
                  id: key,
                  text,
                })),
                targetLang: target,
              }),
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
  keyedTexts: { context?: string; key: string; text: string }[],
  target: string
) {
  const apiKey = getMistralApiKey();
  if (!apiKey) {
    return null;
  }

  const response = await fetch(MISTRAL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getMistralModel(),
      response_format: { type: "json_object" },
      temperature: 0,
      messages: [
        {
          role: "system",
          content: translationSystemPrompt,
        },
        {
          role: "user",
          content: JSON.stringify({
            items: keyedTexts.map(({ context, key, text }) => ({
              context: context || "",
              id: key,
              text,
            })),
            targetLang: target,
          }),
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
          (
            (
              parsedBody as {
                choices: Array<{ message?: { content?: unknown } }>;
              }
            ).choices[0] || {}
          ).message?.content
        )
      : "";

  return parseJsonSafely(content);
}

function extractTranslatedItems(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const items = (payload as { items?: unknown }).items;
  if (Array.isArray(items)) {
    const translations: Record<string, string> = {};

    for (const item of items) {
      if (!item || typeof item !== "object") {
        continue;
      }

      const id = normalizeString((item as { id?: unknown }).id);
      const text =
        typeof (item as { text?: unknown }).text === "string"
          ? ((item as { text?: string }).text as string)
          : "";
      if (!id || !text.trim()) {
        continue;
      }

      translations[id] = text;
    }

    return Object.keys(translations).length ? translations : null;
  }

  const directEntries = Object.entries(
    payload as Record<string, unknown>
  ).filter(
    ([key, value]) =>
      normalizeString(key) && typeof value === "string" && value.trim()
  );
  if (!directEntries.length) {
    return null;
  }

  return Object.fromEntries(
    directEntries.map(([key, value]) => [key, value as string])
  );
}

function ensureTranslationProviderConfigured() {
  const openAiKey = getOpenAiTranslationApiKey();
  const mistralKey = getMistralApiKey();

  if (!openAiKey && !mistralKey) {
    const error = new Error(
      "No translation API key configured. Translation unavailable."
    );
    (error as Error & { statusCode?: number }).statusCode = 503;
    throw error;
  }

  return { mistralKey, openAiKey };
}

function readCachedTranslation(
  cacheKey: string,
  sourceHash: string,
  target: string
) {
  const memoryValue = translationCache.get(cacheKey);
  if (memoryValue) {
    return memoryValue;
  }

  const persisted = getTranslationMemoryEntry(sourceHash, target);
  if (!persisted?.translatedText) {
    return "";
  }

  setCacheValue(cacheKey, persisted.translatedText);
  return persisted.translatedText;
}

function writeCachedTranslation(
  item: PreparedTranslationItem,
  provider: string,
  source: string,
  target: string,
  translatedText: string
) {
  setCacheValue(item.cacheKey, translatedText);
  upsertTranslationMemoryEntry({
    createdAt: new Date().toISOString(),
    provider,
    sourceHash: item.sourceHash,
    sourceLang: source,
    sourceText: item.originalText,
    targetLang: target,
    translatedText,
  });
}

function prepareStructuredItems(
  items: TranslationItem[],
  source: string,
  target: string
) {
  const grouped = new Map<string, PreparedTranslationItem>();
  let providerIndex = 0;

  for (const item of items) {
    const originalText = normalizeString(item.text);
    const context = normalizeString(item.context);
    const itemId = normalizeString(item.id);

    if (!itemId || !originalText) {
      continue;
    }

    const cacheKey = buildTranslationCacheKey({
      context,
      source,
      target,
      text: originalText,
    });
    const existing = grouped.get(cacheKey);
    if (existing) {
      existing.originalIds.push(itemId);
      continue;
    }

    const protectedItem = protectMarketTerms(originalText, providerIndex);
    providerIndex += 1;

    grouped.set(cacheKey, {
      cacheKey,
      context,
      originalIds: [itemId],
      originalText,
      protectedText: protectedItem.text,
      providerId: `t${providerIndex}`,
      replacements: protectedItem.replacements,
      sourceHash: hashTranslationPayload({
        context,
        source,
        target,
        text: originalText,
      }),
    });
  }

  return Array.from(grouped.values());
}

async function requestStructuredTranslations(items: PreparedTranslationItem[]) {
  const { mistralKey, openAiKey } = ensureTranslationProviderConfigured();
  let outputPayload: unknown = null;
  let lastProviderError: unknown = null;
  let provider = "";

  const providerItems = items.map(item => ({
    context: item.context,
    key: item.providerId,
    text: item.protectedText,
  }));

  if (mistralKey) {
    try {
      outputPayload = await translateWithMistral(providerItems, "en");
      provider = "mistral";
    } catch (providerError) {
      lastProviderError = providerError;
      console.error(
        "[openaiTranslation] Mistral translation failed.",
        providerError instanceof Error ? providerError.message : providerError
      );
    }
  }

  if (!outputPayload && openAiKey) {
    try {
      outputPayload = await translateWithOpenAI(providerItems, "en");
      provider = "openai";
    } catch (providerError) {
      lastProviderError = providerError;
      console.error(
        "[openaiTranslation] OpenAI translation failed.",
        providerError instanceof Error ? providerError.message : providerError
      );
    }
  }

  const translatedItems = extractTranslatedItems(outputPayload);
  if (!translatedItems) {
    console.error(
      "[openaiTranslation] All translation providers failed, returning source texts.",
      lastProviderError instanceof Error
        ? lastProviderError.message
        : lastProviderError
    );
    return null;
  }

  return { provider: provider || "unknown", translatedItems };
}

async function requestStructuredTranslationsForTarget(
  items: PreparedTranslationItem[],
  target: string
) {
  const { mistralKey, openAiKey } = ensureTranslationProviderConfigured();
  let outputPayload: unknown = null;
  let lastProviderError: unknown = null;
  let provider = "";

  const providerItems = items.map(item => ({
    context: item.context,
    key: item.providerId,
    text: item.protectedText,
  }));

  if (mistralKey) {
    try {
      outputPayload = await translateWithMistral(providerItems, target);
      provider = "mistral";
    } catch (providerError) {
      lastProviderError = providerError;
      console.error(
        "[openaiTranslation] Mistral translation failed.",
        providerError instanceof Error ? providerError.message : providerError
      );
    }
  }

  if (!outputPayload && openAiKey) {
    try {
      outputPayload = await translateWithOpenAI(providerItems, target);
      provider = "openai";
    } catch (providerError) {
      lastProviderError = providerError;
      console.error(
        "[openaiTranslation] OpenAI translation failed.",
        providerError instanceof Error ? providerError.message : providerError
      );
    }
  }

  const translatedItems = extractTranslatedItems(outputPayload);
  if (!translatedItems) {
    console.error(
      "[openaiTranslation] All translation providers failed, returning source texts.",
      lastProviderError instanceof Error
        ? lastProviderError.message
        : lastProviderError
    );
    return null;
  }

  return { provider: provider || "unknown", translatedItems };
}

export async function translateStructuredItems(
  items: TranslationItem[],
  source: string,
  target: string
) {
  const normalizedSource = normalizeString(source).toLowerCase();
  const normalizedTarget = normalizeString(target).toLowerCase();
  const results = Object.fromEntries(
    items.map(item => [item.id, normalizeString(item.text)])
  ) as Record<string, string>;

  if (!items.length || !normalizedSource || !normalizedTarget) {
    return results;
  }

  if (normalizedSource === normalizedTarget) {
    return results;
  }

  const preparedItems = prepareStructuredItems(
    items,
    normalizedSource,
    normalizedTarget
  );
  const uncachedItems: PreparedTranslationItem[] = [];

  for (const item of preparedItems) {
    const cachedTranslation = readCachedTranslation(
      item.cacheKey,
      item.sourceHash,
      normalizedTarget
    );
    if (cachedTranslation) {
      for (const originalId of item.originalIds) {
        results[originalId] = cachedTranslation;
      }
      continue;
    }

    uncachedItems.push(item);
  }

  if (!uncachedItems.length) {
    return results;
  }

  const response = await requestStructuredTranslationsForTarget(
    uncachedItems,
    normalizedTarget
  );
  if (!response) {
    return results;
  }

  for (const item of uncachedItems) {
    const candidate =
      typeof response.translatedItems[item.providerId] === "string"
        ? response.translatedItems[item.providerId]
        : "";
    const structurallyValid =
      !candidate || hasAllProtectedPlaceholders(candidate, item.replacements);
    const translatedText = candidate
      ? structurallyValid
        ? restoreMarketTerms(candidate, item.replacements) || item.originalText
        : item.originalText
      : item.originalText;

    for (const originalId of item.originalIds) {
      results[originalId] = translatedText;
    }

    writeCachedTranslation(
      item,
      response.provider,
      normalizedSource,
      normalizedTarget,
      translatedText
    );
  }

  return results;
}

export async function translateTexts(
  texts: string[],
  source: string,
  target: string
) {
  const uniqueTexts = normalizeTranslationTexts(texts);
  const keyedItems = uniqueTexts.map((text, index) => ({
    id: `text-${index + 1}`,
    text,
  }));
  const translatedItems = await translateStructuredItems(
    keyedItems,
    source,
    target
  );

  return Object.fromEntries(
    keyedItems.map(item => [item.text, translatedItems[item.id] || item.text])
  ) as Record<string, string>;
}

export async function translateTurkishTextsToEnglish(texts: string[]) {
  return translateTexts(texts, "tr", "en");
}

export async function translateContentDocument(
  text: string,
  source: string,
  target: string,
  context = ""
) {
  const rawText = typeof text === "string" ? text : String(text ?? "");
  const normalizedText = rawText.slice(0, MAX_DOCUMENT_TEXT_LENGTH);
  const normalizedSource = normalizeString(source).toLowerCase();
  const normalizedTarget = normalizeString(target).toLowerCase();
  const normalizedContext = normalizeString(context);

  if (!normalizedText.trim() || !normalizedSource || !normalizedTarget) {
    return normalizedText;
  }

  if (normalizedSource === normalizedTarget) {
    return normalizedText;
  }

  const cacheKey = buildTranslationCacheKey({
    context: normalizedContext,
    source: normalizedSource,
    target: normalizedTarget,
    text: normalizedText,
  });
  const sourceHash = hashTranslationPayload({
    context: normalizedContext,
    source: normalizedSource,
    target: normalizedTarget,
    text: normalizedText,
  });
  const cachedTranslation = readCachedTranslation(
    cacheKey,
    sourceHash,
    normalizedTarget
  );
  if (cachedTranslation) {
    return cachedTranslation;
  }

  const protectedDocument = protectMarketTerms(normalizedText, 0);
  const preparedItem: PreparedTranslationItem = {
    cacheKey,
    context: normalizedContext,
    originalIds: ["doc"],
    originalText: normalizedText,
    protectedText: protectedDocument.text,
    providerId: "doc",
    replacements: protectedDocument.replacements,
    sourceHash,
  };

  const response = await requestStructuredTranslationsForTarget(
    [preparedItem],
    normalizedTarget
  );
  if (!response) {
    return normalizedText;
  }

  const candidate =
    typeof response.translatedItems.doc === "string"
      ? response.translatedItems.doc
      : "";
  const structurallyValid =
    !candidate ||
    hasAllProtectedPlaceholders(candidate, preparedItem.replacements);
  const translatedText = candidate
    ? structurallyValid
      ? restoreMarketTerms(candidate, preparedItem.replacements) ||
        normalizedText
      : normalizedText
    : normalizedText;

  writeCachedTranslation(
    preparedItem,
    response.provider,
    normalizedSource,
    normalizedTarget,
    translatedText
  );

  return translatedText;
}
