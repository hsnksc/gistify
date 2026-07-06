import type { MouseEvent } from "react";
import type { FlowReportEngagement } from "@shared/flow";
import { Eye, Heart, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { type AppLanguage, t } from "@/lib/i18n";
import { useFlowEngagement } from "../hooks/useFlowEngagement";

interface FlowPostActionsProps {
  compact?: boolean;
  engagement?: FlowReportEngagement;
  language: AppLanguage;
  reportId: string;
  sharePath: string;
  title: string;
}

function formatEngagementCount(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`;
  }

  return String(value);
}

export default function FlowPostActions({
  compact = false,
  engagement: initialEngagement,
  language,
  reportId,
  sharePath,
  title,
}: FlowPostActionsProps) {
  const { engagement, liked, recordShare, toggleLiked } = useFlowEngagement(
    reportId,
    initialEngagement,
    language
  );

  const handleLike = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      await toggleLiked();
    } catch {
      toast.error(t("flow:engagementCouldNotBeUpdated"));
    }
  };

  const handleShare = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (typeof window === "undefined") {
      return;
    }

    const shareUrl = `${window.location.origin}${sharePath}`;

    try {
      if (navigator.share) {
        await navigator.share({
          text: title,
          title,
          url: shareUrl,
        });
        void recordShare().catch(() => undefined);
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      void recordShare().catch(() => undefined);
      toast.success(t("flow:linkCopied"));
    } catch {
      toast.error(
        t("flow:shareCouldNotBeCompleted")
      );
    }
  };

  const buttonClassName = compact
    ? "h-9 rounded-full px-3 text-xs"
    : "h-10 rounded-full px-4 text-sm";
  const metricClassName = compact
    ? "h-9 rounded-full px-3 text-xs"
    : "h-10 rounded-full px-4 text-sm";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 border border-transparent text-muted-foreground ${metricClassName}`}
        title={t("flow:readers")}
      >
        <Eye className="size-4" />
        <span className="font-semibold text-foreground">
          {formatEngagementCount(engagement.readCount)}
        </span>
        <span>{t("flow:readers")}</span>
      </span>
      <Button
        type="button"
        variant="ghost"
        className={buttonClassName}
        onClick={handleLike}
        aria-pressed={liked}
      >
        <Heart className={`size-4 ${liked ? "fill-current text-rose-300" : ""}`} />
        <span>{liked ? t("flow:liked") : t("flow:like")}</span>
        <span className="font-semibold">
          {formatEngagementCount(engagement.likeCount)}
        </span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        className={buttonClassName}
        onClick={handleShare}
      >
        <Share2 className="size-4" />
        <span>{t("flow:share")}</span>
        <span className="font-semibold">
          {formatEngagementCount(engagement.shareCount)}
        </span>
      </Button>
    </div>
  );
}
