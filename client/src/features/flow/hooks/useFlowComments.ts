import { useCallback, useEffect, useState } from "react";
import type { FlowReportComment } from "@shared/dailyReports";
import type {
  FlowCommentsResponse, FlowReportCommentCreateRequestBody, } from "@shared/flow";
import { extractApiErrorMessage, readJsonResponse } from "@/lib/api";
import { type AppLanguage, t } from "@/lib/i18n";
import { detectLanguageOfText } from "@/lib/languageDetection";
import { translateDynamic } from "@/lib/translateDynamic";

interface CreateCommentResponse extends FlowCommentsResponse {
  comment?: FlowReportComment;
  error?: string;
}

export interface FlowCommentViewModel extends FlowReportComment {
  bodyOriginal: string;
  isTranslated: boolean;
  sourceLanguage: AppLanguage | "unknown";
}

interface UseFlowCommentsResult {
  comments: FlowCommentViewModel[];
  error: string;
  loading: boolean;
  reload: () => Promise<void>;
  submitComment: (body: string) => Promise<void>;
  submitting: boolean;
}

export function useFlowComments(
  reportId: string,
  language: AppLanguage
): UseFlowCommentsResult {
  const [comments, setComments] = useState<FlowCommentViewModel[]>([]);
  const [loading, setLoading] = useState(Boolean(reportId));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const localizeComments = useCallback(
    async (inputComments: FlowReportComment[]) => {
      if (!inputComments.length) {
        return [] as FlowCommentViewModel[];
      }

      const translations = await translateDynamic(
        inputComments.map(comment => ({
          context: `Flow community comment for report ${reportId}`,
          id: comment.id,
          text: comment.body,
        })),
        language
      );

      return inputComments.map(comment => {
        const translatedBody = translations[comment.id] || comment.body;

        return {
          ...comment,
          body: translatedBody,
          bodyOriginal: comment.body,
          isTranslated: translatedBody !== comment.body,
          sourceLanguage: detectLanguageOfText(comment.body),
        };
      });
    },
    [language, reportId]
  );

  const reload = useCallback(async () => {
    if (!reportId) {
      setComments([]);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/flow-reports/${encodeURIComponent(reportId)}/comments`,
        {
          cache: "no-store",
          credentials: "include",
        }
      );
      const payload = await readJsonResponse<FlowCommentsResponse>(
        response,
        "flow comments",
        language
      );

      if (!response.ok) {
        throw new Error(
          extractApiErrorMessage(
            payload,
            t("common:refreshFailed")
          )
        );
      }

      const normalizedComments = Array.isArray(payload.comments)
        ? payload.comments
        : [];
      setComments(await localizeComments(normalizedComments));
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : t("flow:flowNowOpensByTicker")
      );
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [language, reportId]);

  const submitComment = useCallback(
    async (body: string) => {
      const trimmedBody = body.trim();
      if (!reportId || !trimmedBody) {
        return;
      }

      setSubmitting(true);
      setError("");

      try {
        const response = await fetch(
          `/api/flow-reports/${encodeURIComponent(reportId)}/comments`,
          {
            body: JSON.stringify({
              body: trimmedBody,
            } satisfies FlowReportCommentCreateRequestBody),
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          }
        );
        const payload = await readJsonResponse<CreateCommentResponse>(
          response,
          "create flow comment",
          language
        );

        if (!response.ok) {
          throw new Error(
            extractApiErrorMessage(
              payload,
              t("flow:commentCouldNotBePosted")
            )
          );
        }

        if (payload.comment) {
          const [localizedComment] = await localizeComments([
            payload.comment as FlowReportComment,
          ]);
          setComments(current => [localizedComment, ...current]);
          return;
        }

        await reload();
      } catch (caughtError) {
        const message =
          caughtError instanceof Error
            ? caughtError.message
            : t("marketing:nextEvent");
        setError(message);
        throw caughtError;
      } finally {
        setSubmitting(false);
      }
    },
    [language, localizeComments, reload, reportId]
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    comments,
    error,
    loading,
    reload,
    submitComment,
    submitting,
  };
}
