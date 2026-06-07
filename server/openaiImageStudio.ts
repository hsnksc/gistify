import {
  OPENAI_IMAGE_MAX_REFERENCES,
  type OpenAiImageGenerateRequest,
  type OpenAiImageGenerateResponse,
  type OpenAiImageReferencePayload,
} from "../shared/openaiImageStudio";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const MAX_PROMPT_LENGTH = 4_000;
const MAX_DATA_URL_LENGTH = 7_000_000;
const SUPPORTED_DATA_URL_PATTERN =
  /^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=\s]+$/;
const SUPPORTED_REMOTE_IMAGE_PATTERN = /^https?:\/\/.+/i;

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeReferenceImage(
  value: unknown,
  fallbackIndex: number
): OpenAiImageReferencePayload | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const source = value as Partial<OpenAiImageReferencePayload>;
  const dataUrl = normalizeString(source.dataUrl);
  if (!dataUrl) {
    return null;
  }

  const validSource =
    SUPPORTED_DATA_URL_PATTERN.test(dataUrl) ||
    SUPPORTED_REMOTE_IMAGE_PATTERN.test(dataUrl);

  if (!validSource || dataUrl.length > MAX_DATA_URL_LENGTH) {
    return null;
  }

  return {
    name: normalizeString(source.name) || `reference-${fallbackIndex + 1}.png`,
    dataUrl,
  };
}

export function getOpenAiImageApiKey() {
  return normalizeString(process.env.OPENAI_API_KEY);
}

export function getOpenAiImageMainModel() {
  return normalizeString(process.env.OPENAI_IMAGE_MAIN_MODEL) || "gpt-4.1";
}

export function isOpenAiImageStudioConfigured() {
  return Boolean(getOpenAiImageApiKey());
}

export function normalizeOpenAiImageGenerateRequest(
  value: unknown
): OpenAiImageGenerateRequest {
  const source =
    value && typeof value === "object"
      ? (value as Partial<OpenAiImageGenerateRequest>)
      : {};

  const prompt = normalizeString(source.prompt).slice(0, MAX_PROMPT_LENGTH);
  const referenceImages = Array.isArray(source.referenceImages)
    ? source.referenceImages
        .map((image, index) => normalizeReferenceImage(image, index))
        .filter((image): image is OpenAiImageReferencePayload => Boolean(image))
        .slice(0, OPENAI_IMAGE_MAX_REFERENCES)
    : [];

  return {
    prompt,
    referenceImages,
  };
}

function buildPrompt(payload: OpenAiImageGenerateRequest) {
  if (!payload.referenceImages.length) {
    return payload.prompt;
  }

  return [
    "Use the attached reference images as visual guidance.",
    "Preserve relevant composition, palette, and subject cues only when they fit the user's request.",
    payload.prompt,
  ].join("\n\n");
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

function parseJsonSafely(value: string) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

export async function generateOpenAiImage(
  payload: OpenAiImageGenerateRequest
): Promise<OpenAiImageGenerateResponse> {
  const apiKey = getOpenAiImageApiKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY tanimli degil.");
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getOpenAiImageMainModel(),
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: buildPrompt(payload),
            },
            ...payload.referenceImages.map(image => ({
              type: "input_image",
              image_url: image.dataUrl,
            })),
          ],
        },
      ],
      tools: [
        {
          type: "image_generation",
          action: payload.referenceImages.length ? "edit" : "generate",
        },
      ],
    }),
  });

  const rawBody = await response.text();
  const parsedBody = parseJsonSafely(rawBody);

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(parsedBody, "OpenAI image olusturma istegi basarisiz oldu.")
    );
  }

  const outputs = Array.isArray((parsedBody as { output?: unknown[] }).output)
    ? ((parsedBody as { output: unknown[] }).output as Array<
        Record<string, unknown>
      >)
    : [];

  const imageOutput = outputs.find(
    output =>
      output.type === "image_generation_call" &&
      typeof output.result === "string" &&
      output.result.length > 0
  );

  if (!imageOutput || typeof imageOutput.result !== "string") {
    throw new Error("OpenAI yanitinda gorsel verisi bulunamadi.");
  }

  return {
    imageDataUrl: `data:image/png;base64,${imageOutput.result}`,
    mimeType: "image/png",
    model:
      normalizeString((parsedBody as { model?: unknown }).model) ||
      getOpenAiImageMainModel(),
    referenceCount: payload.referenceImages.length,
    requestId: response.headers.get("x-request-id") || undefined,
  };
}
