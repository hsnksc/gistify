import type { MouseEvent } from "react";
import { Heart, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { copy, type AppLanguage } from "@/lib/i18n";
import { useFlowLike } from "../hooks/useFlowLike";

interface FlowPostActionsProps {
  compact?: boolean;
  language: AppLanguage;
  reportId: string;
  sharePath: string;
  title: string;
}

export default function FlowPostActions({
  compact = false,
  language,
  reportId,
  sharePath,
  title,
}: FlowPostActionsProps) {
  const { liked, toggleLiked } = useFlowLike(reportId);

  const handleLike = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggleLiked();
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
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      toast.success(copy(language, "Baglanti kopyalandi.", "Link copied."));
    } catch {
      toast.error(
        copy(language, "Paylasim tamamlanamadi.", "Share could not be completed.")
      );
    }
  };

  const buttonClassName = compact
    ? "h-9 rounded-full px-3 text-xs"
    : "h-10 rounded-full px-4 text-sm";

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        className={buttonClassName}
        onClick={handleLike}
        aria-pressed={liked}
      >
        <Heart className={`size-4 ${liked ? "fill-current text-rose-300" : ""}`} />
        {liked
          ? copy(language, "Begendin", "Liked")
          : copy(language, "Begen", "Like")}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className={buttonClassName}
        onClick={handleShare}
      >
        <Share2 className="size-4" />
        {copy(language, "Paylas", "Share")}
      </Button>
    </div>
  );
}
