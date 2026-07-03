import type { Request, Response, Router } from "express";
import express from "express";
import type {
  DailyReportOpenAiChartGenerateRequest,
  DailyReportOpenAiChartGenerateResponse,
} from "../../../shared/dailyReportOpenAiCharts";
import type {
  OpenAiImageGenerateRequest,
  OpenAiImageGenerateResponse,
} from "../../../shared/openaiImageStudio";

interface TranslateRequestBody {
  items?: unknown;
  source?: unknown;
  target?: unknown;
  texts?: unknown;
}

const TRANSLATION_RATE_LIMIT_MAX_REQUESTS = 30;
const TRANSLATION_RATE_LIMIT_WINDOW_MS = 60_000;

const translationRateLimitStore = new Map<
  string,
  { count: number; resetAt: number }
>();

function getTranslationRateLimitKey(req: Request) {
  return req.ip || "unknown";
}

function consumeTranslationRateLimit(key: string) {
  const now = Date.now();
  const current = translationRateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    translationRateLimitStore.set(key, {
      count: 1,
      resetAt: now + TRANSLATION_RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= TRANSLATION_RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((current.resetAt - now) / 1_000)
      ),
    };
  }

  current.count += 1;
  translationRateLimitStore.set(key, current);

  return { allowed: true, retryAfterSeconds: 0 };
}

type AiRouterDependencies = {
  generateDailyReportOpenAiCharts: (
    payload: DailyReportOpenAiChartGenerateRequest
  ) => Promise<DailyReportOpenAiChartGenerateResponse>;
  generateOpenAiImage: (
    payload: OpenAiImageGenerateRequest
  ) => Promise<OpenAiImageGenerateResponse>;
  isOpenAiImageStudioConfigured: () => boolean;
  normalizeDailyReportOpenAiChartGenerateRequest: (
    value: unknown
  ) => DailyReportOpenAiChartGenerateRequest;
  normalizeOpenAiImageGenerateRequest: (
    value: unknown
  ) => OpenAiImageGenerateRequest;
  normalizeTranslationItems: (value: unknown) => Array<{
    context?: string;
    id: string;
    text: string;
  }>;
  normalizeString: (value: unknown) => string;
  normalizeTranslationTexts: (value: unknown) => string[];
  requireWeeklyReportAdmin: (req: Request, res: Response) => boolean;
  setPrivateNoStore: (res: Response) => void;
  translateTexts: (
    texts: string[],
    source: string,
    target: string
  ) => Promise<Record<string, string>>;
  translateStructuredItems: (
    items: Array<{
      context?: string;
      id: string;
      text: string;
    }>,
    source: string,
    target: string
  ) => Promise<Record<string, string>>;
};

export function createAiRouter({
  generateDailyReportOpenAiCharts,
  generateOpenAiImage,
  isOpenAiImageStudioConfigured,
  normalizeDailyReportOpenAiChartGenerateRequest,
  normalizeOpenAiImageGenerateRequest,
  normalizeTranslationItems,
  normalizeString,
  normalizeTranslationTexts,
  requireWeeklyReportAdmin,
  setPrivateNoStore,
  translateStructuredItems,
  translateTexts,
}: AiRouterDependencies): Router {
  const router = express.Router();

  router.post("/i18n/translate", async (req, res) => {
    setPrivateNoStore(res);

    const body =
      req.body && typeof req.body === "object"
        ? (req.body as TranslateRequestBody)
        : {};

    const source = normalizeString(body.source).toLowerCase();
    const target = normalizeString(body.target).toLowerCase();
    const texts = normalizeTranslationTexts(body.texts);
    const items = normalizeTranslationItems(body.items);

    if (!texts.length && !items.length) {
      res.status(200).json({ items: [], translations: {} });
      return;
    }

    const supportedPairs = new Set(["tr:en", "en:tr"]);
    if (!supportedPairs.has(`${source}:${target}`)) {
      res.status(200).json({
        translations: Object.fromEntries(texts.map(text => [text, text])),
      });
      return;
    }

    const rateLimit = consumeTranslationRateLimit(
      getTranslationRateLimitKey(req)
    );
    if (!rateLimit.allowed) {
      res.setHeader("Retry-After", String(rateLimit.retryAfterSeconds));
      res.status(429).json({
        error: "Too many translation requests. Please retry shortly.",
      });
      return;
    }

    try {
      if (items.length) {
        const translations = await translateStructuredItems(
          items,
          source,
          target
        );
        res.status(200).json({
          items: items.map(item => ({
            id: item.id,
            text: translations[item.id] || item.text,
          })),
          translations,
        });
        return;
      }

      const translations = await translateTexts(texts, source, target);
      res.status(200).json({ items: [], translations });
    } catch (error) {
      const statusCode =
        error && typeof error === "object" && "statusCode" in error
          ? (error as { statusCode: number }).statusCode
          : 500;
      const message =
        error instanceof Error
          ? error.message
          : "Ceviri istegi basarisiz oldu.";
      res.status(statusCode).json({ error: message });
    }
  });

  router.post("/admin/openai/image-generate", async (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    if (!isOpenAiImageStudioConfigured()) {
      res.status(503).json({
        error: "OpenAI image studio hazir degil. OPENAI_API_KEY gerekli.",
      });
      return;
    }

    const payload = normalizeOpenAiImageGenerateRequest(req.body);
    if (!payload.prompt) {
      res.status(400).json({ error: "Prompt gerekli." });
      return;
    }

    try {
      const result = await generateOpenAiImage(payload);
      res.status(200).json(result);
    } catch (error) {
      console.error("OpenAI image generation failed", error);
      res.status(502).json({
        error:
          error instanceof Error
            ? error.message
            : "OpenAI image olusturma istegi tamamlanamadi.",
      });
    }
  });

  router.post("/admin/daily-report-charts/openai", async (req, res) => {
    setPrivateNoStore(res);
    if (!requireWeeklyReportAdmin(req, res)) {
      return;
    }

    if (!isOpenAiImageStudioConfigured()) {
      res.status(503).json({
        error: "OpenAI chart workflow hazir degil. OPENAI_API_KEY gerekli.",
      });
      return;
    }

    const payload = normalizeDailyReportOpenAiChartGenerateRequest(req.body);
    if (!payload.sourceId) {
      res.status(400).json({ error: "Source secimi gerekli." });
      return;
    }

    if (!payload.prompt) {
      res.status(400).json({ error: "Prompt gerekli." });
      return;
    }

    try {
      const result = await generateDailyReportOpenAiCharts(payload);
      res.status(200).json(result);
    } catch (error) {
      console.error("Daily report OpenAI chart generation failed", error);
      res.status(502).json({
        error:
          error instanceof Error
            ? error.message
            : "Daily report OpenAI chart generation tamamlanamadi.",
      });
    }
  });

  return router;
}
