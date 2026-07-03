import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageSquareText, Send } from "lucide-react";
import { PUBLIC_ACCESS_USER_ID } from "@shared/flow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type AppLanguage, t } from "@/lib/i18n";
import { toast } from "sonner";
import { useFlowComments } from "../hooks/useFlowComments";

type MembershipPlan = "guest" | "member" | "pro";
type AccessMode = "managed" | "public";

interface ViewerAuthResponse {
  accessMode: AccessMode;
  authenticated: boolean;
  membership: {
    isSubscribed: boolean;
    plan: MembershipPlan;
  };
  user: {
    email: string;
    id: string;
    name: string;
    picture?: string;
  } | null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map(part => part.trim().charAt(0).toUpperCase())
    .filter(Boolean)
    .join("")
    .slice(0, 2);
}

function formatTimestamp(value: string, locale: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export default function FlowCommunityPanel({
  language,
  reportId,
}: {
  language: AppLanguage;
  reportId: string;
}) {
  const locale = language === "en" ? "en-US" : "tr-TR";
  const [auth, setAuth] = useState<ViewerAuthResponse | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [draftComment, setDraftComment] = useState("");
  const { comments, error, loading, submitComment, submitting } =
    useFlowComments(reportId, language);

  const loadAuth = useCallback(async () => {
    setAuthLoading(true);

    try {
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        setAuth(null);
        return;
      }

      setAuth((await response.json()) as ViewerAuthResponse);
    } catch {
      setAuth(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAuth();
  }, [loadAuth]);

  useEffect(() => {
    setDraftComment("");
  }, [reportId]);

  const canComment = useMemo(
    () =>
      Boolean(auth?.authenticated && auth.user?.id !== PUBLIC_ACCESS_USER_ID),
    [auth]
  );
  const isPublicPreviewUser = auth?.user?.id === PUBLIC_ACCESS_USER_ID;

  const handleSubmit = useCallback(async () => {
    if (!draftComment.trim()) {
      return;
    }

    try {
      await submitComment(draftComment);
      setDraftComment("");
      toast.success(t("flow:commentPosted"));
    } catch (caughtError) {
      toast.error(
        caughtError instanceof Error
          ? caughtError.message
          : t("flow:commentCouldNotBePosted")
      );
    }
  }, [draftComment, language, submitComment]);

  return (
    <section className="rounded-xl border border-border bg-card/90 p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquareText className="size-4 text-emerald-300" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              {t("flow:community")}
            </p>
          </div>
          <h3 className="mt-2 text-xl font-semibold text-foreground">
            {t("flow:comments")}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("flow:signInIfYouWant")}
          </p>
        </div>

        <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {comments.length} {t("flow:comments1237")}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {canComment ? (
          <div className="rounded-xl border border-border bg-background/55 p-4">
            <Textarea
              value={draftComment}
              onChange={event => setDraftComment(event.target.value)}
              placeholder={t("flow:writeYourCommentHereIt")}
              rows={4}
              maxLength={1200}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {t("flow:aPaidSubscriptionIsNot")}
              </p>
              <Button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={submitting || !draftComment.trim()}
                aria-busy={submitting}
              >
                <Send className="size-4" />
                {t("flow:postComment")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-background/40 p-4">
            <p className="text-sm text-muted-foreground">
              {authLoading
                ? t("earnings:sourceModified")
                : isPublicPreviewUser
                  ? t("flow:thePublicPreviewAccountCannot")
                  : t("flow:signInWithGoogleTo")}
            </p>
            {!authLoading ? (
              <div className="mt-3">
                <Button asChild variant="outline">
                  <a href="/api/auth/google">
                    {t("marketing:importantNotes")}
                  </a>
                </Button>
              </div>
            ) : null}
          </div>
        )}

        {loading ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-xl border border-border bg-background/40 p-4 text-sm text-muted-foreground"
          >
            {t("flow:loadingComments")}
          </div>
        ) : error && !comments.length ? (
          <div
            role="alert"
            className="rounded-xl border border-dashed border-border bg-background/40 p-4 text-sm text-muted-foreground"
          >
            {error}
          </div>
        ) : comments.length ? (
          <div className="space-y-3">
            {comments.map(comment => (
              <article
                key={comment.id}
                className="rounded-xl border border-border bg-background/55 p-4"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="size-10 border border-border">
                    {comment.userPicture ? (
                      <AvatarImage
                        src={comment.userPicture}
                        alt={`${comment.userName} profile`}
                      />
                    ) : null}
                    <AvatarFallback className="text-[11px] font-semibold">
                      {getInitials(comment.userName) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {comment.userName}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(comment.createdAt, locale)}
                      </span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                      {comment.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-background/40 p-4 text-sm text-muted-foreground">
            {t("flow:noCommentsYet")}
          </div>
        )}
      </div>
    </section>
  );
}

