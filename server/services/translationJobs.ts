import crypto from "node:crypto";
import type {
  DailyReportLanguage,
  DailyReportRecord,
} from "../../shared/dailyReports";
import type { BillingStore } from "../billingStore";
import { translateContentDocument } from "../openaiTranslation";

const TRANSLATION_PROMPT_VERSION = "2026-07-07";
const MAX_DOCUMENT_LENGTH = 80_000;
const MIN_CONTENT_LENGTH = 50;

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getSourceContent(record: DailyReportRecord): string {
  const html = normalizeString(record.content.html);
  if (html) {
    return html;
  }
  return normalizeString(record.content.markdown);
}

function computeSourceHash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function detectSourceLanguage(record: DailyReportRecord): DailyReportLanguage {
  const explicit = record.content.language;
  if (explicit === "tr" || explicit === "en") {
    return explicit;
  }

  const content = getSourceContent(record);
  if (content) {
    const turkishCharCount = (content.match(/[çğıöşüÇĞİÖŞÜ]/g) || []).length;
    const englishCharCount = (content.match(/\b(the|and|for|with|from|that|this|are|was|were|have|has|will|would|could|should)\b/gi) || []).length;

    if (turkishCharCount > 3 || turkishCharCount > englishCharCount) {
      return "tr";
    }
  }

  return "tr";
}

interface TranslationNeed {
  reportId: string;
  sourceLang: DailyReportLanguage;
  targetLang: DailyReportLanguage;
  sourceContent: string;
  sourceHash: string;
  reason: "missing" | "stale" | "failed-retry";
}

export interface TranslationJobResult {
  processed: number;
  translated: number;
  skipped: number;
  failed: number;
  details: Array<{
    reportId: string;
    targetLang: DailyReportLanguage;
    status: "translated" | "skipped" | "failed";
    error?: string;
  }>;
}

/**
 * Analyzes published reports and returns which ones need translation.
 * A report needs translation if:
 * 1. No translation exists for the target language
 * 2. Source hash changed since last translation (stale)
 * 3. Previous translation failed (retry)
 *
 * Stale translations are NEVER served — the caller must check translationMeta.status === "done".
 */
export function findReportsNeedingTranslation(
  reports: DailyReportRecord[]
): TranslationNeed[] {
  const needs: TranslationNeed[] = [];

  for (const report of reports) {
    if (report.status !== "published") {
      continue;
    }

    const sourceContent = getSourceContent(report);
    if (sourceContent.length < MIN_CONTENT_LENGTH) {
      continue;
    }

    const sourceLang = detectSourceLanguage(report);
    const targetLang: DailyReportLanguage = sourceLang === "tr" ? "en" : "tr";
    const sourceHash = computeSourceHash(sourceContent);

    const existingTranslation = report.content.translations?.[targetLang];
    const existingMeta = report.content.translationMeta?.[targetLang];

    // No translation at all
    if (!existingTranslation) {
      needs.push({
        reportId: report.id,
        sourceLang,
        targetLang,
        sourceContent: sourceContent.slice(0, MAX_DOCUMENT_LENGTH),
        sourceHash,
        reason: "missing",
      });
      continue;
    }

    // Previous translation failed — retry
    if (existingMeta?.status === "failed") {
      needs.push({
        reportId: report.id,
        sourceLang,
        targetLang,
        sourceContent: sourceContent.slice(0, MAX_DOCUMENT_LENGTH),
        sourceHash,
        reason: "failed-retry",
      });
      continue;
    }

    // Source changed since last translation
    if (
      existingMeta?.sourceHash &&
      existingMeta.sourceHash !== sourceHash
    ) {
      needs.push({
        reportId: report.id,
        sourceLang,
        targetLang,
        sourceContent: sourceContent.slice(0, MAX_DOCUMENT_LENGTH),
        sourceHash,
        reason: "stale",
      });
    }
  }

  return needs;
}

/**
 * Generates a translation for a single report and returns the updated content fields.
 * The caller is responsible for persisting the result to the DB.
 *
 * On failure, returns the original content with translationMeta.status = "failed".
 * The original (untranslated) content is ALWAYS preserved as the source of truth.
 */
export async function generateTranslation(
  need: TranslationNeed
): Promise<{
  targetLang: DailyReportLanguage;
  translatedContent: string | null;
  meta: {
    status: "done" | "failed";
    engine: "llm";
    promptVersion: string;
    sourceHash: string;
    translatedAt: string;
    error?: string;
  };
}> {
  const translatedAt = new Date().toISOString();

  try {
    const translatedText = await translateContentDocument(
      need.sourceContent,
      need.sourceLang,
      need.targetLang,
      "flow-report"
    );

    if (!translatedText || translatedText === need.sourceContent) {
      return {
        targetLang: need.targetLang,
        translatedContent: null,
        meta: {
          status: "failed",
          engine: "llm",
          promptVersion: TRANSLATION_PROMPT_VERSION,
          sourceHash: need.sourceHash,
          translatedAt,
          error: "Translation returned empty or identical to source",
        },
      };
    }

    return {
      targetLang: need.targetLang,
      translatedContent: translatedText,
      meta: {
        status: "done",
        engine: "llm",
        promptVersion: TRANSLATION_PROMPT_VERSION,
        sourceHash: need.sourceHash,
        translatedAt,
      },
    };
  } catch (error) {
    return {
      targetLang: need.targetLang,
      translatedContent: null,
      meta: {
        status: "failed",
        engine: "llm",
        promptVersion: TRANSLATION_PROMPT_VERSION,
        sourceHash: need.sourceHash,
        translatedAt,
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

/**
 * Process a batch of translation needs.
 * Updates the provided report records in-place with translation results.
 * The caller should persist updated records to DB.
 */
export async function processTranslationBatch(
  reports: DailyReportRecord[],
  needs: TranslationNeed[],
  options: {
    delayMs?: number;
    onProgress?: (detail: TranslationJobResult["details"][number]) => void;
  } = {}
): Promise<TranslationJobResult> {
  const delayMs = options.delayMs ?? 500;
  const details: TranslationJobResult["details"] = [];
  let translated = 0;
  let skipped = 0;
  let failed = 0;

  const reportById = new Map(reports.map(r => [r.id, r]));

  for (const need of needs) {
    const report = reportById.get(need.reportId);
    if (!report) {
      details.push({
        reportId: need.reportId,
        targetLang: need.targetLang,
        status: "skipped",
        error: "Report not found in batch",
      });
      skipped++;
      continue;
    }

    const result = await generateTranslation(need);

    // Update report in-place
    if (!report.content.translations) {
      report.content.translations = {};
    }
    if (!report.content.translationMeta) {
      report.content.translationMeta = {};
    }

    if (result.translatedContent) {
      report.content.translations[result.targetLang] =
        result.translatedContent;
      report.content.translationMeta[result.targetLang] = result.meta;
      translated++;

      // Update availableLanguages
      const langs = new Set(report.content.availableLanguages || []);
      langs.add(result.targetLang);
      report.content.availableLanguages = Array.from(langs);

      details.push({
        reportId: need.reportId,
        targetLang: result.targetLang,
        status: "translated",
      });
    } else {
      // Mark as failed but preserve any previous translation (don't serve stale)
      report.content.translationMeta[result.targetLang] = result.meta;
      failed++;
      details.push({
        reportId: need.reportId,
        targetLang: result.targetLang,
        status: "failed",
        error: result.meta.error,
      });
    }

    // Always update sourceHash
    report.content.sourceHash = need.sourceHash;

    options.onProgress?.(
      details[details.length - 1]!
    );

    // Rate-limit delay between API calls
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return {
    processed: needs.length,
    translated,
    skipped,
    failed,
    details,
  };
}

/**
 * Checks if a translation should be served to readers.
 * Stale or failed translations are NEVER served — the original is shown instead.
 */
export function shouldServeTranslation(
  report: DailyReportRecord,
  lang: DailyReportLanguage
): boolean {
  const meta = report.content.translationMeta?.[lang];
  if (!meta) {
    // No meta — serve if translation exists (e.g. file-based from .premium.en.md)
    return Boolean(report.content.translations?.[lang]);
  }

  return meta.status === "done";
}

/**
 * Full translation cycle: find reports needing translation → translate → persist to DB.
 * Intended to be called by the cron job handler or admin "Run" button.
 */
export async function runTranslationCycle(
  billingStore: BillingStore,
  options: {
    maxReports?: number;
    delayMs?: number;
  } = {}
): Promise<TranslationJobResult> {
  const maxReports = options.maxReports ?? 5;
  const delayMs = options.delayMs ?? 500;

  const allReports = billingStore.listDailyReports();
  const needs = findReportsNeedingTranslation(allReports).slice(0, maxReports);

  if (needs.length === 0) {
    return {
      processed: 0,
      translated: 0,
      skipped: 0,
      failed: 0,
      details: [],
    };
  }

  const reportsById = new Map(allReports.map(r => [r.id, r]));
  const reportsToProcess = needs
    .map(n => reportsById.get(n.reportId))
    .filter((r): r is DailyReportRecord => Boolean(r));

  const result = await processTranslationBatch(reportsToProcess, needs, {
    delayMs,
  });

  // Persist updated reports to DB
  for (const report of reportsToProcess) {
    billingStore.upsertDailyReport(report);
  }

  return result;
}
