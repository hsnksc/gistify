import { useCallback, useEffect, useState } from "react";
import type { FlowReportComment } from "@shared/dailyReports";
import type {
  FlowCommentsResponse,
  FlowReportCommentCreateRequestBody,
} from "@shared/flow";
import { extractApiErrorMessage, readJsonResponse } from "@/lib/api";
import { copy, type AppLanguage } from "@/lib/i18n";

interface CreateCommentResponse extends FlowCommentsResponse {
  comment?: FlowReportComment;
  error?: string;
}

interface UseFlowCommentsResult {
  comments: FlowReportComment[];
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
  const [comments, setComments] = useState<FlowReportComment[]>([]);
  const [loading, setLoading] = useState(Boolean(reportId));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
            copy(language, "Yorumlar yuklenemedi.", "Comments could not be loaded.")
          )
        );
      }

      setComments(Array.isArray(payload.comments) ? payload.comments : []);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : copy(language, "Yorumlar yuklenemedi.", "Comments could not be loaded.")
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
              copy(language, "Yorum gonderilemedi.", "Comment could not be posted.")
            )
          );
        }

        if (payload.comment) {
          setComments(current => [payload.comment as FlowReportComment, ...current]);
          return;
        }

        await reload();
      } catch (caughtError) {
        const message =
          caughtError instanceof Error
            ? caughtError.message
            : copy(language, "Yorum gonderilemedi.", "Comment could not be posted.");
        setError(message);
        throw caughtError;
      } finally {
        setSubmitting(false);
      }
    },
    [language, reload, reportId]
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
