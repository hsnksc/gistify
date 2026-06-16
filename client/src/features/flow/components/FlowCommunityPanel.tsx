import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageSquareText, Send } from "lucide-react";
import { PUBLIC_ACCESS_USER_ID } from "@shared/flow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { copy, type AppLanguage } from "@/lib/i18n";
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
  const { comments, error, loading, submitComment, submitting } = useFlowComments(
    reportId,
    language
  );

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
    () => Boolean(auth?.authenticated && auth.user?.id !== PUBLIC_ACCESS_USER_ID),
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
      toast.success(copy(language, "Yorum paylasildi.", "Comment posted."));
    } catch (caughtError) {
      toast.error(
        caughtError instanceof Error
          ? caughtError.message
          : copy(language, "Yorum gonderilemedi.", "Comment could not be posted.")
      );
    }
  }, [draftComment, language, submitComment]);

  return (
    <section className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquareText className="size-4 text-emerald-300" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              {copy(language, "Topluluk", "Community")}
            </p>
          </div>
          <h3 className="mt-2 text-xl font-semibold text-foreground">
            {copy(language, "Yorumlar", "Comments")}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {copy(
              language,
              "Okuma herkese acik kalir. Yorum yazmak icin normal uye girisi gerekir; public preview hesabi yorum gonderemez.",
              "Reading stays public. Posting requires a normal member sign-in; the public preview account cannot submit comments."
            )}
          </p>
        </div>

        <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {comments.length} {copy(language, "yorum", "comments")}
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {canComment ? (
          <div className="rounded-[1.55rem] border border-border bg-background/55 p-4">
            <Textarea
              value={draftComment}
              onChange={event => setDraftComment(event.target.value)}
              placeholder={copy(
                language,
                "Yorumu buraya yaz. Bu alan Flow raporunun altinda herkese acik gorunur.",
                "Write your comment here. It will appear publicly below this flow report."
              )}
              rows={4}
              maxLength={1200}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {copy(
                  language,
                  "Yorum icin ucretli abonelik gerekmiyor.",
                  "A paid subscription is not required to comment."
                )}
              </p>
              <Button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={submitting || !draftComment.trim()}
                aria-busy={submitting}
              >
                <Send className="size-4" />
                {copy(language, "Yorumu Gonder", "Post Comment")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-[1.55rem] border border-dashed border-border bg-background/40 p-4">
            <p className="text-sm text-muted-foreground">
              {authLoading
                ? copy(
                    language,
                    "Yorum izinleri kontrol ediliyor.",
                    "Checking comment permissions."
                  )
                : isPublicPreviewUser
                  ? copy(
                      language,
                      "Public preview kullanicisi yorum gonderemez. Kendi Google hesabinla giris yapmalisin.",
                      "The public preview user cannot post comments. Sign in with your own Google account."
                    )
                  : copy(
                      language,
                      "Yorum yazmak icin Google ile uye girisi yapmalisin. Okuma herkese acik kalir.",
                      "You need a Google member sign-in to comment. Reading remains public."
                    )}
            </p>
            {!authLoading ? (
              <div className="mt-3">
                <Button asChild variant="outline">
                  <a href="/api/auth/google">
                    {copy(language, "Google ile Giris Yap", "Sign in with Google")}
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
            className="rounded-[1.55rem] border border-border bg-background/40 p-4 text-sm text-muted-foreground"
          >
            {copy(language, "Yorumlar yukleniyor.", "Loading comments.")}
          </div>
        ) : error && !comments.length ? (
          <div
            role="alert"
            className="rounded-[1.55rem] border border-dashed border-border bg-background/40 p-4 text-sm text-muted-foreground"
          >
            {error}
          </div>
        ) : comments.length ? (
          <div className="space-y-3">
            {comments.map(comment => (
              <article
                key={comment.id}
                className="rounded-[1.55rem] border border-border bg-background/55 p-4"
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
          <div className="rounded-[1.55rem] border border-dashed border-border bg-background/40 p-4 text-sm text-muted-foreground">
            {copy(
              language,
              "Bu rapor icin henuz yorum yok. Ilk yorumu uye girisi yapan biri birakabilir.",
              "There are no comments on this report yet. The first one can be posted by any signed-in member."
            )}
          </div>
        )}
      </div>
    </section>
  );
}
