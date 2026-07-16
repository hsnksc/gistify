import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCheck, ExternalLink } from "lucide-react";
import type { WatchlistNotificationRecord } from "@shared/opportunities";
import type { AppLanguage } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";

interface NotificationsPayload {
  items: WatchlistNotificationRecord[];
  unreadCount: number;
}

function localizedContent(
  notification: WatchlistNotificationRecord,
  language: AppLanguage
) {
  if (language !== "en") {
    return { title: notification.title, body: notification.body };
  }
  const metadata = notification.metadata;
  const ticker = notification.ticker;
  switch (notification.kind) {
    case "signal_change":
      return {
        title: `${ticker} signal changed`,
        body: `${String(metadata.previousSignal || "Previous")} → ${String(
          metadata.signal || "New"
        )}. Conviction ${Number(metadata.conviction || 0).toFixed(0)}/100.`,
      };
    case "conviction":
      return {
        title: `${ticker} crossed its conviction threshold`,
        body: `Conviction ${Number(metadata.conviction || 0).toFixed(
          0
        )}/100; threshold ${String(metadata.threshold ?? "-")}.`,
      };
    case "price_above":
      return {
        title: `${ticker} crossed above its price alert`,
        body: `Price $${Number(metadata.price || 0).toFixed(2)}; threshold $${Number(
          metadata.threshold || 0
        ).toFixed(2)}.`,
      };
    case "price_below":
      return {
        title: `${ticker} crossed below its price/stop alert`,
        body: `Price $${Number(metadata.price || 0).toFixed(2)}; threshold $${Number(
          metadata.threshold || 0
        ).toFixed(2)}.`,
      };
    case "earnings":
      return {
        title: `${ticker} earnings are approaching`,
        body: `Earnings in ${String(
          metadata.daysUntilEarnings ?? "-"
        )} days (${String(metadata.earningsDate || "-")}).`,
      };
    case "opportunity":
      return {
        title: `New ${ticker} opportunity`,
        body: `${String(metadata.strategy || "Setup")} — composite score ${Number(
          metadata.compositeScore || 0
        ).toFixed(0)}/100.`,
      };
    default:
      return { title: notification.title, body: notification.body };
  }
}

export default function AccountNotificationsBell({
  language,
}: {
  language: AppLanguage;
}) {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<NotificationsPayload>({
    items: [],
    unreadCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const isEnglish = language === "en";

  const copy = useMemo(
    () =>
      isEnglish
        ? {
            title: "Alerts",
            markAll: "Mark all read",
            empty: "No watchlist alerts yet.",
            loading: "Loading alerts...",
            open: "Open alerts",
          }
        : {
            title: "Uyarılar",
            markAll: "Tümünü okundu yap",
            empty: "Henüz watchlist uyarısı yok.",
            loading: "Uyarılar yükleniyor...",
            open: "Uyarıları aç",
          },
    [isEnglish]
  );

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications?limit=30", {
        cache: "no-store",
        credentials: "include",
      });
      if (!response.ok) return;
      setPayload((await response.json()) as NotificationsPayload);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 60_000);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  const applyPayload = async (path: string, method: "PATCH" | "POST") => {
    const response = await fetch(path, { method, credentials: "include" });
    if (response.ok) {
      setPayload((await response.json()) as NotificationsPayload);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(current => !current)}
        aria-label={copy.open}
        aria-expanded={open}
        className="relative inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
      >
        <Bell className="size-4" />
        {payload.unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold leading-none text-white">
            {payload.unreadCount > 99 ? "99+" : payload.unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.65rem)] z-[100] w-[min(24rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{copy.title}</p>
              <p className="text-[11px] text-muted-foreground">
                {payload.unreadCount} {isEnglish ? "unread" : "okunmamış"}
              </p>
            </div>
            {payload.unreadCount > 0 ? (
              <button
                type="button"
                onClick={() => void applyPayload("/api/notifications/read-all", "POST")}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-300 hover:text-sky-200"
              >
                <CheckCheck className="size-3.5" />
                {copy.markAll}
              </button>
            ) : null}
          </div>

          <div className="max-h-[28rem] overflow-y-auto">
            {loading ? (
              <p className="p-6 text-center text-sm text-muted-foreground">
                {copy.loading}
              </p>
            ) : payload.items.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">
                {copy.empty}
              </p>
            ) : (
              payload.items.map(notification => {
                const content = localizedContent(notification, language);
                const href =
                  typeof notification.metadata.href === "string"
                    ? notification.metadata.href
                    : `/coverage/${notification.ticker}`;
                return (
                  <a
                    key={notification.id}
                    href={localizePath(href, language)}
                    onClick={() => {
                      if (!notification.readAt) {
                        void applyPayload(
                          `/api/notifications/${encodeURIComponent(
                            notification.id
                          )}/read`,
                          "PATCH"
                        );
                      }
                    }}
                    className={`block border-b border-border/70 px-4 py-3 transition-colors last:border-0 hover:bg-background/55 ${
                      notification.readAt ? "opacity-70" : "bg-sky-500/[0.045]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {content.title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {content.body}
                        </p>
                        <p className="mt-2 text-[10px] text-muted-foreground">
                          {new Intl.DateTimeFormat(
                            isEnglish ? "en-US" : "tr-TR",
                            {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          ).format(new Date(notification.createdAt))}
                        </p>
                      </div>
                      <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    </div>
                  </a>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
