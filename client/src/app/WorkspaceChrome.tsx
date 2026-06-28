import { Button } from "@/components/ui/button";
import type { AppLanguage } from "@/lib/i18n";

export function copy(language: AppLanguage, tr: string, en: string) {
  return language === "en" ? en : tr;
}

export type WorkspaceLabelKey =
  | "admin"
  | "calendar"
  | "cpiPpi"
  | "daily"
  | "earnings"
  | "earningsStrategy"
  | "flow"
  | "marketFlash"
  | "momentum";

export function workspaceLabel(language: AppLanguage, key: WorkspaceLabelKey) {
  switch (key) {
    case "admin":
      return copy(language, "Yonetim", "Admin");
    case "calendar":
      return copy(language, "Takvim", "Calendar");
    case "cpiPpi":
      return "CPI/PPI";
    case "daily":
      return copy(language, "Gunluk", "Daily");
    case "earnings":
      return copy(language, "Earnings", "Earnings");
    case "earningsStrategy":
      return copy(language, "Kazanc Stratejisi", "Earnings Strategy");
    case "flow":
      return copy(language, "Akis", "Flow");
    case "marketFlash":
      return copy(language, "Market Flash", "Market Flash");
    case "momentum":
      return copy(language, "Momentum", "Momentum");
    default:
      return "";
  }
}

export function getWorkspaceSectionLabel(path: string, language: AppLanguage) {
  if (path.startsWith("/app/admin")) {
    return workspaceLabel(language, "admin");
  }

  if (path.startsWith("/momentum") || path.startsWith("/scanner")) {
    return workspaceLabel(language, "momentum");
  }

  if (path.startsWith("/daily-report")) {
    return workspaceLabel(language, "daily");
  }

  if (path.startsWith("/cpi-ppi")) {
    return workspaceLabel(language, "cpiPpi");
  }

  if (path.startsWith("/calendar")) {
    return workspaceLabel(language, "calendar");
  }

  if (path.startsWith("/marketflash")) {
    return workspaceLabel(language, "marketFlash");
  }

  if (path.startsWith("/flow") || path.startsWith("/reports")) {
    return workspaceLabel(language, "flow");
  }

  if (path.startsWith("/earnings")) {
    return workspaceLabel(language, "earnings");
  }

  return workspaceLabel(language, "earningsStrategy");
}

export function SiteFooter({ language }: { language: AppLanguage }) {
  const links = [
    { href: "/flow", label: workspaceLabel(language, "flow") },
    { href: "/reports", label: copy(language, "Raporlar", "Reports") },
    { href: "/pricing", label: copy(language, "Fiyatlandirma", "Pricing") },
    { href: "/terms", label: copy(language, "Kosullar", "Terms") },
    { href: "/privacy", label: copy(language, "Gizlilik", "Privacy") },
    { href: "/refund", label: copy(language, "Iade", "Refund") },
    { href: "/pay", label: copy(language, "Odeme", "Billing") },
  ];

  return (
    <footer className="border-t border-border bg-background/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Gistify</p>
          <p className="text-xs text-muted-foreground">
            {copy(
              language,
              "Momentum tarama, earnings oncesi analiz ve opsiyon arastirmasi icin earnings intelligence platformu.",
              "Earnings intelligence platform for momentum scanning, pre-earnings analysis and options research."
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {copy(language, "Destek", "Support")}: support@gistify.pro
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full border border-border bg-card px-3 py-1.5 transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function SubscriptionRequiredView({
  language,
  sectionLabel,
}: {
  language: AppLanguage;
  sectionLabel: string;
}) {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-xl border border-border bg-card/95 p-6 shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {copy(language, "Abonelik kilidi", "Subscription gate")}
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                {copy(
                  language,
                  `${sectionLabel} modulu aktif abonelik gerektiriyor`,
                  `${sectionLabel} requires an active subscription`
                )}
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {copy(
                  language,
                  "Akis herkese acik kalir. Kazanc Stratejisi, Momentum, Gunluk, CPI/PPI, Takvim ve Market Flash modullerini acmak icin Paddle uzerinden aktif abonelik gerekir.",
                  "Flow stays open to everyone. Unlocking Earnings Strategy, Momentum, Daily, CPI/PPI, Calendar and Market Flash requires an active Paddle subscription."
                )}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild>
                  <a href="/pay">
                    {copy(language, "Odeme ekranini ac", "Open payment screen")}
                  </a>
                </Button>
                <Button asChild variant="outline" className="bg-background/70">
                  <a href="/flow">
                    {copy(language, "Akis'a git", "Go to Flow")}
                  </a>
                </Button>
                <Button asChild variant="outline" className="bg-background/70">
                  <a href="/pricing">
                    {copy(
                      language,
                      "Plan detaylarini gor",
                      "View plan details"
                    )}
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid min-w-[220px] grid-cols-2 gap-3">
              {[
                [
                  workspaceLabel(language, "earningsStrategy"),
                  copy(language, "Abonelik", "Subscription"),
                ],
                [
                  workspaceLabel(language, "momentum"),
                  copy(language, "Abonelik", "Subscription"),
                ],
                [
                  workspaceLabel(language, "daily"),
                  copy(language, "Abonelik", "Subscription"),
                ],
                [
                  workspaceLabel(language, "cpiPpi"),
                  copy(language, "Abonelik", "Subscription"),
                ],
                [
                  workspaceLabel(language, "calendar"),
                  copy(language, "Abonelik", "Subscription"),
                ],
                [
                  workspaceLabel(language, "marketFlash"),
                  copy(language, "Abonelik", "Subscription"),
                ],
                [
                  workspaceLabel(language, "flow"),
                  copy(language, "Acik", "Open"),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-border bg-background/60 p-4 text-center"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-2 text-lg font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            copy(
              language,
              "Abonelik acildiginda kazanc stratejisi workspace'ini tam verilerle kullanirsin.",
              "After activation, the earnings strategy workspace opens with full data."
            ),
            copy(
              language,
              "Momentum scanner, daily yuzeyi, CPI/PPI forecast, Economic Calendar ve Market Flash ayni uyelikle acilir.",
              "Momentum scanner, the daily surface, the CPI/PPI forecast, Economic Calendar and Market Flash unlock with the same subscription."
            ),
            copy(
              language,
              "Flow kamuya acik kalir; yorum yazmak icin sadece giris yeterlidir.",
              "Flow remains public; posting comments only requires sign-in."
            ),
          ].map(title => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card/80 p-6 shadow-xl"
            >
              <p className="text-sm font-semibold">{title}</p>
              <div className="mt-4 space-y-3">
                <div className="h-3 rounded-full bg-muted/70" />
                <div className="h-3 w-5/6 rounded-full bg-muted/50" />
                <div className="h-24 rounded-xl border border-dashed border-border bg-background/50" />
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
