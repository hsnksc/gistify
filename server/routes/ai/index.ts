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
  source?: unknown;
  target?: unknown;
  texts?: unknown;
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
  normalizeString: (value: unknown) => string;
  normalizeTranslationTexts: (value: unknown) => string[];
  requireWeeklyReportAdmin: (req: Request, res: Response) => boolean;
  setPrivateNoStore: (res: Response) => void;
  translateTexts: (
    texts: string[],
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
  normalizeString,
  normalizeTranslationTexts,
  requireWeeklyReportAdmin,
  setPrivateNoStore,
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

    if (!texts.length) {
      res.status(200).json({ translations: {} });
      return;
    }

    const supportedPairs = new Set(["tr:en", "en:tr"]);
    if (!supportedPairs.has(`${source}:${target}`)) {
      res.status(200).json({
        translations: Object.fromEntries(texts.map(text => [text, text])),
      });
      return;
    }

    try {
      const translations = await translateTexts(texts, source, target);
      res.status(200).json({ translations });
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
