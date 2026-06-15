import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageSquareText, Send } from "lucide-react";
import type { FlowReportComment } from "@shared/dailyReports";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { AppLanguage } from "@/lib/i18n";
import { toast } from "sonner";

type MembershipPlan = "guest" | "member" | "pro";
type AccessMode = "managed" | "public";

interface FlowCommentsResponse {
  comments?: FlowReportComment[];
}

interface ViewerAuthResponse {
  authenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  } | null;
  membership: {
    plan: MembershipPlan;
    isSubscribed: boolean;
  };
  accessMode: AccessMode;
}

function copy(language: AppLanguage, tr: string, en: string) {
  return language === "en" ? en : tr;
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
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export default function FlowReportCommunityPanel({
  language,
  reportId,
}: {
  language: AppLanguage;
  reportId: string;
}) {
  const locale = language === "en" ? "en-US" : "tr-TR";
  const [comments, setComments] = useState<FlowReportComment[]>([]);
  const [auth, setAuth] = useState<ViewerAuthResponse | null>(null);
  const [loadingComments, setLoadingComments] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [draftComment, setDraftComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadComments = useCallback(async () => {
    if (!reportId) {
      setComments([]);
      setLoadingComments(false);
      return;
    }

    setLoadingComments(true);

    try {
      const response = await fetch(
        `/api/flow-reports/${encodeURIComponent(reportId)}/comments`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        setComments([]);
        return;
      }

      const payload = (await response.json()) as FlowCommentsResponse;
      setComments(Array.isArray(payload.comments) ? payload.comments : []);
    } catch {
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  }, [reportId]);

  const loadAuth = useCallback(async () => {
    setLoadingAuth(true);

    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        setAuth(null);
        return;
      }

      const payload = (await response.json()) as ViewerAuthResponse;
      setAuth(payload);
    } catch {
      setAuth(null);
    } finally {
      setLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  useEffect(() => {
    setDraftComment("");
  }, [reportId]);

  useEffect(() => {
    void loadAuth();
  }, [loadAuth]);

  const canComment = useMemo(
    () =>
      Boolean(
        auth?.authenticated &&
          auth.user &&
          auth.user.id !== "public-access"
      ),
    [auth]
  );

  const handleSubmit = async () => {
    const body = draftComment.trim();
    if (!body) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `/api/flow-reports/${encodeURIComponent(reportId)}/comments`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body }),
        }
      );

      const payload =
        response.headers.get("content-type")?.includes("application/json")
          ? ((await response.json()) as { error?: string; comment?: FlowReportComment })
          : {};

      if (!response.ok) {
        toast.error(
          payload.error ||
            copy(
              language,
              "Yorum gonderilemedi.",
              "Comment could not be posted."
            )
        );
        return;
      }

      setDraftComment("");
      setComments(current =>
        payload.comment ? [payload.comment, ...current] : current
      );
      toast.success(
        copy(language, "Yorum paylasildi.", "Comment posted successfully.")
      );
    } catch {
      toast.error(
        copy(language, "Yorum gonderilemedi.", "Comment could not be posted.")
      );
    } finally {
      setSubmitting(false);
    }
  };

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
              "Bu sayfayi herkes gorebilir. Yorum yazmak icin sadece uye girisi yeterli; ucretli abonelik gerekmez.",
              "Everyone can read this page. Writing a comment only requires member sign-in; a paid subscription is not required."
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
                "Yorumu buraya yaz. Bu alan flow raporu altinda herkese acik gorunur.",
                "Write your comment here. It will appear publicly below this flow report."
              )}
              rows={4}
              maxLength={1200}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {copy(
                  language,
                  "Yorum yazmak icin aktif odeme gerekmiyor.",
                  "An active paid subscription is not required to comment."
                )}
              </p>
              <Button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={submitting || !draftComment.trim()}
              >
                <Send className="size-4" />
                {copy(language, "Yorumu Gonder", "Post Comment")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-[1.55rem] border border-dashed border-border bg-background/40 p-4">
            <p className="text-sm text-muted-foreground">
              {loadingAuth
                ? copy(
                    language,
                    "Yorum izinleri kontrol ediliyor.",
                    "Checking comment permissions."
                  )
                : copy(
                    language,
                    "Yorum yazmak icin uye girisi yapmalisin. Okuma herkese acik kalir.",
                    "You need a member sign-in to comment. Reading remains public."
                  )}
            </p>
            {!loadingAuth ? (
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

        {loadingComments ? (
          <div className="rounded-[1.55rem] border border-border bg-background/40 p-4 text-sm text-muted-foreground">
            {copy(language, "Yorumlar yukleniyor.", "Loading comments.")}
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
