import { useCallback, useEffect, useState } from "react";

const FLOW_LIKES_STORAGE_KEY = "gistify:flow:likes:v1";

function readFlowLikes() {
  if (typeof window === "undefined") {
    return {} as Record<string, boolean>;
  }

  try {
    const raw = window.localStorage.getItem(FLOW_LIKES_STORAGE_KEY);
    if (!raw) {
      return {} as Record<string, boolean>;
    }

    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {} as Record<string, boolean>;
  }
}

function writeFlowLikes(next: Record<string, boolean>) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(FLOW_LIKES_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage failures so the like button remains non-blocking.
  }
}

export function useFlowLike(reportId: string) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!reportId) {
      setLiked(false);
      return;
    }

    const likes = readFlowLikes();
    setLiked(Boolean(likes[reportId]));
  }, [reportId]);

  const toggleLiked = useCallback(() => {
    if (!reportId) {
      return;
    }

    const likes = readFlowLikes();
    const nextLiked = !likes[reportId];
    const nextLikes = {
      ...likes,
      [reportId]: nextLiked,
    };

    if (!nextLiked) {
      delete nextLikes[reportId];
    }

    writeFlowLikes(nextLikes);
    setLiked(nextLiked);
  }, [reportId]);

  return {
    liked,
    toggleLiked,
  };
}
