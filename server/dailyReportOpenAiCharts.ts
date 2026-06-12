import fs from "node:fs";
import path from "node:path";
import type {
  DailyReportOpenAiChartGenerateRequest,
  DailyReportOpenAiChartGenerateResponse,
} from "../shared/dailyReportOpenAiCharts";
import {
  buildDailyReportOpenAiFigureFileName,
  getDailyReportSourcePackage,
  resolveDailyReportSourceAssetPath,
} from "./dailyReportSources";
import { generateOpenAiImage } from "./openaiImageStudio";

const MAX_PROMPT_LENGTH = 4_000;
const FIGURE_FILE_LIMIT = 12;
const DAILY_CHART_OPENAI_SIZE = "1536x1024";
const DAILY_CHART_QUALITY = "high";

function buildDailyChartPrompt(prompt: string) {
  return [
    "Rebuild the attached market chart as a premium institutional research graphic.",
    "Preserve every numeric relationship, axis scale, date, annotation, legend, arrow, label, and panel structure from the reference image.",
    "Do not invent, omit, smooth, or re-interpret any datapoint. Improve only clarity, typography, spacing, contrast, and line sharpness.",
    prompt,
  ].join("\n\n");
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeFigureFileNames(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map(item => item.trim())
        .filter(Boolean)
    )
  ).slice(0, FIGURE_FILE_LIMIT);
}

function guessMimeType(filePath: string) {
  switch (path.extname(filePath).toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    default:
      return "image/png";
  }
}

function readImageAsDataUrl(filePath: string) {
  const mimeType = guessMimeType(filePath);
  const buffer = fs.readFileSync(filePath);
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

function writeDataUrlToPng(filePath: string, dataUrl: string) {
  const match = dataUrl.match(/^data:image\/png;base64,([A-Za-z0-9+/=\s]+)$/i);
  if (!match) {
    throw new Error("OpenAI yaniti beklenen PNG formatinda degil.");
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, Buffer.from(match[1], "base64"));
}

export function normalizeDailyReportOpenAiChartGenerateRequest(
  value: unknown
): DailyReportOpenAiChartGenerateRequest {
  const source =
    value && typeof value === "object"
      ? (value as Partial<DailyReportOpenAiChartGenerateRequest>)
      : {};

  return {
    sourceId: normalizeString(source.sourceId),
    prompt: normalizeString(source.prompt).slice(0, MAX_PROMPT_LENGTH),
    figureFileNames: normalizeFigureFileNames(source.figureFileNames),
  };
}

export async function generateDailyReportOpenAiCharts(
  payload: DailyReportOpenAiChartGenerateRequest
): Promise<DailyReportOpenAiChartGenerateResponse> {
  const source = getDailyReportSourcePackage(payload.sourceId);
  if (!source) {
    throw new Error("OpenAI chart generation icin gecerli bir source gerekli.");
  }

  const prompt = normalizeString(payload.prompt);
  if (!prompt) {
    throw new Error("Prompt gerekli.");
  }

  const targetFigureFiles =
    payload.figureFileNames && payload.figureFileNames.length
      ? payload.figureFileNames
      : source.figureFiles;

  if (!targetFigureFiles.length) {
    throw new Error("Uretilecek grafik bulunamadi.");
  }

  for (const figureFileName of targetFigureFiles) {
    if (!source.figureFiles.includes(figureFileName)) {
      throw new Error(`Kaynak figuru bulunamadi: ${figureFileName}`);
    }
  }

  const generatedFiles: string[] = [];

  for (const figureFileName of targetFigureFiles) {
    const sourceAssetPath = resolveDailyReportSourceAssetPath(
      source.id,
      figureFileName
    );
    if (!sourceAssetPath) {
      throw new Error(`Kaynak grafik okunamadi: ${figureFileName}`);
    }

    const outputFileName = buildDailyReportOpenAiFigureFileName(figureFileName);
    const outputAssetPath = resolveDailyReportSourceAssetPath(
      source.id,
      outputFileName
    );
    const destinationPath =
      outputAssetPath ||
      path.resolve(path.dirname(sourceAssetPath), path.basename(outputFileName));

    const result = await generateOpenAiImage({
      prompt: buildDailyChartPrompt(prompt),
      referenceImages: [
        {
          name: path.basename(figureFileName),
          dataUrl: readImageAsDataUrl(sourceAssetPath),
        },
      ],
      size: DAILY_CHART_OPENAI_SIZE,
      quality: DAILY_CHART_QUALITY,
      background: "opaque",
      outputFormat: "png",
      inputFidelity: "high",
    });

    writeDataUrlToPng(destinationPath, result.imageDataUrl);
    generatedFiles.push(outputFileName.replace(/\\/g, "/"));
  }

  const refreshedSource = getDailyReportSourcePackage(payload.sourceId);
  if (!refreshedSource) {
    throw new Error("Gunclenen daily report source yeniden okunamadi.");
  }

  return {
    sourceId: payload.sourceId,
    prompt,
    generatedFiles,
    source: refreshedSource,
  };
}
