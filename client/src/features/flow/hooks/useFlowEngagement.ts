import { useCallback, useEffect, useState } from "react";
import type {
  FlowReportEngagement,
  FlowReportEngagementResponse,
} from "@shared/flow";
import { extractApiErrorMessage, readJsonResponse } from "@/lib/api";
import { type AppLanguage, t } from "@/lib/i18n";

const FLOW_LIKES_STORAGE_KEY = "gistify:flow:likes:v1";
const FLOW_VISITOR_STORAGE_KEY = "gistify:flow:visitor:v1";

export const EMPTY_FLOW_ENGAGEMENT: FlowReportEngagement = {
  likeCount: 0,
  readCount: 0,
  shareCount: 0,
};

type EngagementAction = "view" | "like" | "share";

function normalizeCount(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
}

export function normalizeFlowEngagement(
  engagement?: Partial<FlowReportEngagement> | null
): FlowReportEngagement {
  return {
    likeCount: normalizeCount(engagement?.likeCount),
    readCount: normalizeCount(engagement?.readCount),
    shareCount: normalizeCount(engagement?.shareCount),
  };
}

function readFlowLikes() {
  if (typeof window === "undefined") {
    return {} as Record<string, boolean>;
  }

  try {
    const raw = window.localStorage.getItem(FLOW_LIKES_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeFlowLikes(next: Record<string, boolean>) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(FLOW_LIKES_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Keep the action usable even when local storage is unavailable.
  }
}

function createVisitorId() {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export function getFlowVisitorId() {
  if (typeof window === "undefined") {
    return "server";
  }

  try {
    const stored = window.localStorage.getItem(FLOW_VISITOR_STORAGE_KEY);
    if (stored && /^[a-zA-Z0-9:_-]{8,120}$/.test(stored)) {
      return stored;
    }

    const next = createVisitorId();
    window.localStorage.setItem(FLOW_VISITOR_STORAGE_KEY, next);
    return next;
  } catch {
    return createVisitorId();
  }
}

export async function postFlowEngagement(
  reportId: string,
  action: EngagementAction,
  language: AppLanguage,
  body: { liked?: boolean } = {}
) {
  const response = await fetch(
    `/api/flow-reports/${encodeURIComponent(reportId)}/engagement/${action}`,
    {
      body: JSON.stringify({
        ...body,
        visitorId: getFlowVisitorId(),
      }),
      cache: "no-store",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }
  );
  const payload = await readJsonResponse<FlowReportEngagementResponse>(
    response,
    `flow engagement ${action}`,
    language
  );

  if (!response.ok) {
    throw new Error(
      extractApiErrorMessage(payload, t("flow:engagementCouldNotBeUpdated"))
    );
  }

  return normalizeFlowEngagement(payload.engagement);
}

export function useFlowEngagement(
  reportId: string,
  initialEngagement: Partial<FlowReportEngagement> | undefined,
  language: AppLanguage
) {
  const [engagement, setEngagement] = useState(() =>
    normalizeFlowEngagement(initialEngagement)
  );
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setEngagement(normalizeFlowEngagement(initialEngagement));
  }, [reportId]);

  useEffect(() => {
    if (!reportId) {
      setLiked(false);
      return;
    }

    setLiked(Boolean(readFlowLikes()[reportId]));
  }, [reportId]);

  const recordView = useCallback(async () => {
    if (!reportId) {
      return normalizeFlowEngagement();
    }

    const nextEngagement = await postFlowEngagement(
      reportId,
      "view",
      language
    );
    setEngagement(nextEngagement);
    return nextEngagement;
  }, [language, reportId]);

  const toggleLiked = useCallback(async () => {
    if (!reportId) {
      return normalizeFlowEngagement();
    }

    const previousLikes = readFlowLikes();
    const previousLiked = Boolean(previousLikes[reportId]);
    const nextLiked = !previousLiked;
    const previousEngagement = engagement;
    const nextLikes = {
      ...previousLikes,
      [reportId]: nextLiked,
    };

    if (!nextLiked) {
      delete nextLikes[reportId];
    }

    writeFlowLikes(nextLikes);
    setLiked(nextLiked);
    setEngagement(current => ({
      ...current,
      likeCount: Math.max(
        0,
        current.likeCount + (nextLiked ? 1 : -1)
      ),
    }));

    try {
      const nextEngagement = await postFlowEngagement(
        reportId,
        "like",
        language,
        { liked: nextLiked }
      );
      setEngagement(nextEngagement);
      return nextEngagement;
    } catch (error) {
      writeFlowLikes(previousLikes);
      setLiked(previousLiked);
      setEngagement(previousEngagement);
      throw error;
    }
  }, [engagement, language, reportId]);

  const recordShare = useCallback(async () => {
    if (!reportId) {
      return normalizeFlowEngagement();
    }

    const nextEngagement = await postFlowEngagement(
      reportId,
      "share",
      language
    );
    setEngagement(nextEngagement);
    return nextEngagement;
  }, [language, reportId]);

  return {
    engagement,
    liked,
    recordShare,
    recordView,
    toggleLiked,
  };
}
