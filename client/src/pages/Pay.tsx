import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CreditCard,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppLanguage } from "@/lib/i18n";
import { getPaddleClient } from "@/lib/paddleClient";

type MembershipPlan = "guest" | "member" | "pro";
type AccessMode = "managed" | "public";

type PayAuthState =
  | { status: "loading" }
  | { status: "anonymous"; error?: string }
  | {
      status: "authenticated";
      user: {
        id: string;
        email: string;
        name: string;
        picture?: string;
      };
      membership: {
        plan: MembershipPlan;
        isSubscribed: boolean;
      };
      accessMode: AccessMode;
    };

interface PaddlePublicConfigResponse {
  enabled: boolean;
  environment: "live" | "sandbox";
  clientToken: string | null;
  priceId: string | null;
  successUrl: string | null;
  cancelUrl: string | null;
  issues?: string[];
}

interface PaddleManagementResponse {
  managementUrls?: {
    updatePaymentMethod?: string;
    cancel?: string;
  } | null;
  error?: string;
}

const COPY = {
  tr: {
    eyebrow: "Gistify Billing",
    title: "Google hesabinla gir, Paddle ile aboneligi ac",
    description:
      "Odeme akisi artik hazir. Uyelik hesabina bagli olarak Paddle checkout ile scanner, daily ve earning strategy modullerini acabilirsin.",
    secure: "Paddle checkout aktif",
    accountLinked: "Hesap bazli erisim",
    webhookSync: "Webhook senkronu",
    back: "Siteye don",
    priceLabel: "Aylik plan",
    priceSuffix: "TRY / ay",
    authLoading: "Oturum kontrol ediliyor",
    authLoadingBody:
      "Checkout acmadan once hesap durumu dogrulaniyor.",
    signInTitle: "Checkout icin once giris yap",
    signInBody:
      "Abonelik Google hesabinla eslestirilir. Satin alma sonrasi erisim ayni hesaba otomatik acilir.",
    signInButton: "Google ile giris yap",
    publicModeTitle: "Public preview modu hala acik",
    publicModeBody:
      "Bu modda gercek hesap eslesmesi yok. Paddle checkout acmadan once `APP_ACCESS_MODE=managed` ile auth'u geri ac.",
    activeTitle: "Abonelik aktif",
    activeBody:
      "Bu hesapta erisim zaten acik. Uygulamaya donebilir veya Paddle uzerinden odeme metodunu/aboneligi yonetebilirsin.",
    openApp: "Uygulamayi ac",
    managePayment: "Odeme metodunu guncelle",
    manageSubscription: "Aboneligi yonet",
    checkoutTitle: "Paddle checkout hazir",
    checkoutBody:
      "Odeme ayni hesap e-postasina on tanimli acilir. Basarili odemeden sonra erisim webhook ile otomatik aktif edilir.",
    checkoutButton: "Paddle ile odemeyi ac",
    refresh: "Durumu yenile",
    configTitle: "Eksik billing ayari var",
    configBody:
      "Checkout acilmadi. Asagidaki env degerleri tamamlanmadan canli odeme baslatilamaz.",
    paymentSuccessTitle: "Odeme tamamlandi, erisim senkron bekleniyor",
    paymentSuccessBody:
      "Paddle donusu alindi. Webhook geldiginde bu hesap otomatik pro olacak. Gecikirse durumu yenileyebilirsin.",
    paymentCancelTitle: "Checkout kapatildi",
    paymentCancelBody:
      "Odeme tamamlanmadi. Hazir oldugunda tekrar checkout acabilirsin.",
    genericError:
      "Checkout baslatilirken bir sorun olustu. Lutfen tekrar dene.",
    settingsTitle: "Kurulum akisi",
    step1: "1. Google girisi ile hesabi dogrula",
    step2: "2. Paddle checkout ac ve odemeyi tamamla",
    step3: "3. Webhook senkronundan sonra scanner ve raporlar acilsin",
    accountLabel: "Hesap",
    modeLabel: "Erisim modu",
    billingLabel: "Billing durumu",
    subscribed: "Aktif",
    notSubscribed: "Kapali",
    managedMode: "Managed",
    publicMode: "Public preview",
    openReady: "Hazir",
    opening: "Checkout aciliyor",
    syncing: "Senkron bekleniyor",
    transactionDetected: "Paddle transaction parametresi algilandi.",
    guest: "Misafir",
  },
  en: {
    eyebrow: "Gistify Billing",
    title: "Sign in with Google, then activate your subscription with Paddle",
    description:
      "Billing is now ready. You can unlock the scanner, daily, and earning strategy modules through Paddle checkout tied to your account.",
    secure: "Paddle checkout live",
    accountLinked: "Account-linked access",
    webhookSync: "Webhook sync",
    back: "Back to site",
    priceLabel: "Monthly plan",
    priceSuffix: "TRY / month",
    authLoading: "Checking session",
    authLoadingBody: "Your account status is being verified before checkout.",
    signInTitle: "Sign in before opening checkout",
    signInBody:
      "The subscription is matched to your Google account. After purchase, access is opened automatically for the same account.",
    signInButton: "Sign in with Google",
    publicModeTitle: "Public preview mode is still enabled",
    publicModeBody:
      "There is no real account mapping in this mode. Re-enable auth with `APP_ACCESS_MODE=managed` before opening Paddle checkout.",
    activeTitle: "Subscription active",
    activeBody:
      "Access is already open for this account. You can go back to the app or manage billing through Paddle.",
    openApp: "Open app",
    managePayment: "Update payment method",
    manageSubscription: "Manage subscription",
    checkoutTitle: "Paddle checkout is ready",
    checkoutBody:
      "Checkout opens with the current account email prefilled. After a successful payment, access is activated automatically through the webhook sync.",
    checkoutButton: "Open Paddle checkout",
    refresh: "Refresh status",
    configTitle: "Billing configuration is incomplete",
    configBody:
      "Checkout is blocked until the missing environment values are configured.",
    paymentSuccessTitle: "Payment completed, waiting for access sync",
    paymentSuccessBody:
      "The Paddle return was received. This account becomes pro automatically when the webhook lands. Refresh if it takes longer than expected.",
    paymentCancelTitle: "Checkout closed",
    paymentCancelBody:
      "The payment was not completed. You can reopen checkout when ready.",
    genericError:
      "Checkout could not be started. Please try again.",
    settingsTitle: "Activation flow",
    step1: "1. Confirm the account with Google sign-in",
    step2: "2. Open Paddle checkout and complete payment",
    step3: "3. Wait for the webhook sync to unlock scanner and reports",
    accountLabel: "Account",
    modeLabel: "Access mode",
    billingLabel: "Billing status",
    subscribed: "Active",
    notSubscribed: "Closed",
    managedMode: "Managed",
    publicMode: "Public preview",
    openReady: "Ready",
    opening: "Opening checkout",
    syncing: "Waiting for sync",
    transactionDetected: "Paddle transaction parameter detected.",
    guest: "Guest",
  },
} as const;

export default function Pay({
  language,
  onLanguageChange,
  authState,
  onSignIn,
  onRefreshAuthState,
}: {
  language: AppLanguage;
  onLanguageChange: (next: AppLanguage) => void;
  authState: PayAuthState;
  onSignIn: () => void;
  onRefreshAuthState: () => Promise<void>;
}) {
  const copy = COPY[language];
  const [config, setConfig] = useState<PaddlePublicConfigResponse | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const [managementUrls, setManagementUrls] =
    useState<PaddleManagementResponse["managementUrls"]>(null);
  const [managementError, setManagementError] = useState<string | null>(null);
  const [checkoutState, setCheckoutState] = useState<
    "idle" | "opening" | "syncing" | "error"
  >("idle");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const params = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  );
  const billingOutcome = params.get("billing");
  const transactionId = params.get("_ptxn") || params.get("transaction_id");
  const isManagedAuthenticated =
    authState.status === "authenticated" && authState.accessMode === "managed";
  const isSubscribed =
    authState.status === "authenticated" && authState.membership.isSubscribed;

  useEffect(() => {
    let disposed = false;

    async function loadConfig() {
      setConfigLoading(true);
      setConfigError(null);

      try {
        const response = await fetch("/api/billing/paddle/public-config", {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("config_failed");
        }

        const payload = (await response.json()) as PaddlePublicConfigResponse;
        if (!disposed) {
          setConfig(payload);
        }
      } catch {
        if (!disposed) {
          setConfigError(copy.genericError);
        }
      } finally {
        if (!disposed) {
          setConfigLoading(false);
        }
      }
    }

    void loadConfig();

    return () => {
      disposed = true;
    };
  }, [copy.genericError]);

  useEffect(() => {
    if (!isManagedAuthenticated) {
      setManagementUrls(null);
      setManagementError(null);
      return;
    }

    let disposed = false;

    async function loadManagement() {
      try {
        const response = await fetch("/api/billing/paddle/manage", {
          credentials: "include",
          cache: "no-store",
        });
        const payload =
          (await response.json().catch(() => ({}))) as PaddleManagementResponse;

        if (disposed) {
          return;
        }

        if (!response.ok) {
          setManagementError(payload.error || copy.genericError);
          return;
        }

        setManagementUrls(payload.managementUrls || null);
        setManagementError(null);
      } catch {
        if (!disposed) {
          setManagementError(copy.genericError);
        }
      }
    }

    void loadManagement();

    return () => {
      disposed = true;
    };
  }, [copy.genericError, isManagedAuthenticated, isSubscribed]);

  useEffect(() => {
    if (
      billingOutcome !== "success" ||
      !isManagedAuthenticated ||
      isSubscribed
    ) {
      return;
    }

    setCheckoutState("syncing");
    let disposed = false;
    let attempts = 0;

    const intervalId = window.setInterval(() => {
      if (disposed) {
        return;
      }

      attempts += 1;
      void onRefreshAuthState();

      if (attempts >= 8) {
        window.clearInterval(intervalId);
      }
    }, 2500);

    return () => {
      disposed = true;
      window.clearInterval(intervalId);
    };
  }, [billingOutcome, isManagedAuthenticated, isSubscribed, onRefreshAuthState]);

  useEffect(() => {
    if (billingOutcome === "success" && isSubscribed) {
      setCheckoutState("idle");
      setCheckoutError(null);
    }
  }, [billingOutcome, isSubscribed]);

  async function openCheckout() {
    if (authState.status !== "authenticated") {
      onSignIn();
      return;
    }

    if (authState.accessMode !== "managed") {
      setCheckoutError(copy.publicModeBody);
      return;
    }

    if (
      !config?.enabled ||
      !config.clientToken ||
      !config.priceId ||
      !config.successUrl
    ) {
      setCheckoutError(copy.configBody);
      return;
    }

    setCheckoutState("opening");
    setCheckoutError(null);

    try {
      const paddle = await getPaddleClient({
        environment: config.environment,
        token: config.clientToken,
      });

      if (!paddle) {
        throw new Error("paddle_init_failed");
      }

      paddle.Checkout.open({
        items: [{ priceId: config.priceId, quantity: 1 }],
        customer: {
          email: authState.user.email,
        },
        customData: {
          app: "gistify",
          plan: "monthly",
          source: "pay-page",
          userId: authState.user.id,
          email: authState.user.email,
        },
        settings: {
          displayMode: "overlay",
          variant: "one-page",
          theme: "dark",
          locale: language === "tr" ? "tr" : "en",
          allowLogout: false,
          successUrl: config.successUrl,
        },
      });

      setCheckoutState("idle");
    } catch {
      setCheckoutState("error");
      setCheckoutError(copy.genericError);
    }
  }

  const statusLabel =
    checkoutState === "opening"
      ? copy.opening
      : checkoutState === "syncing" || billingOutcome === "success"
        ? copy.syncing
        : copy.openReady;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
        <div className="rounded-xl border border-border bg-card/90 p-6 shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                <Sparkles className="size-3.5" />
                {copy.eyebrow}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {copy.title}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {copy.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center rounded-full border border-border bg-background/70 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => onLanguageChange("tr")}
                  className={`rounded-full px-3 py-1.5 font-semibold transition-colors ${
                    language === "tr"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  TR
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange("en")}
                  className={`rounded-full px-3 py-1.5 font-semibold transition-colors ${
                    language === "en"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  EN
                </button>
              </div>

              <Button asChild variant="outline" className="bg-background/70">
                <a href="/">
                  <ArrowLeft className="size-4" />
                  {copy.back}
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[copy.secure, copy.accountLinked, copy.webhookSync].map(label => (
              <div
                key={label}
                className="rounded-xl border border-border bg-background/60 px-4 py-3 text-sm font-medium"
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-xl border border-border bg-card/85 p-6 shadow-xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {copy.priceLabel}
                </p>
                <div className="mt-3 flex items-end gap-3">
                  <span className="text-5xl font-semibold">250</span>
                  <span className="pb-1 text-sm text-muted-foreground">
                    {copy.priceSuffix}
                  </span>
                </div>
              </div>

              <div className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
                {statusLabel}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-background/55 p-6">
              {authState.status === "loading" ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <LoaderCircle className="size-4 animate-spin text-primary" />
                    {copy.authLoading}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {copy.authLoadingBody}
                  </p>
                </div>
              ) : authState.status === "anonymous" ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <LockKeyhole className="size-4 text-primary" />
                    {copy.signInTitle}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {copy.signInBody}
                  </p>
                  <Button onClick={onSignIn}>{copy.signInButton}</Button>
                </div>
              ) : authState.accessMode === "public" ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="size-4 text-primary" />
                    {copy.publicModeTitle}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {copy.publicModeBody}
                  </p>
                </div>
              ) : authState.membership.isSubscribed ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <BadgeCheck className="size-4 text-primary" />
                    {copy.activeTitle}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {copy.activeBody}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <a href="/app">{copy.openApp}</a>
                    </Button>
                    {managementUrls?.updatePaymentMethod ? (
                      <Button
                        asChild
                        variant="outline"
                        className="bg-background/70"
                      >
                        <a href={managementUrls.updatePaymentMethod}>
                          {copy.managePayment}
                        </a>
                      </Button>
                    ) : null}
                    {managementUrls?.cancel ? (
                      <Button
                        asChild
                        variant="outline"
                        className="bg-background/70"
                      >
                        <a href={managementUrls.cancel}>
                          {copy.manageSubscription}
                        </a>
                      </Button>
                    ) : null}
                  </div>
                  {managementError ? (
                    <p className="text-xs text-muted-foreground">
                      {managementError}
                    </p>
                  ) : null}
                </div>
              ) : !configLoading && (!config || !config.enabled) ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="size-4 text-primary" />
                    {copy.configTitle}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {copy.configBody}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(config?.issues || []).map(issue => (
                      <div
                        key={issue}
                        className="rounded-full border border-border bg-card px-3 py-1 text-xs"
                      >
                        {issue}
                      </div>
                    ))}
                  </div>
                  {configError ? (
                    <p className="text-sm text-destructive">{configError}</p>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <CreditCard className="size-4 text-primary" />
                    {billingOutcome === "success"
                      ? copy.paymentSuccessTitle
                      : billingOutcome === "cancel"
                        ? copy.paymentCancelTitle
                        : copy.checkoutTitle}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {billingOutcome === "success"
                      ? copy.paymentSuccessBody
                      : billingOutcome === "cancel"
                        ? copy.paymentCancelBody
                        : copy.checkoutBody}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => void openCheckout()}
                      disabled={checkoutState === "opening"}
                    >
                      {checkoutState === "opening" ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : null}
                      {copy.checkoutButton}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-background/70"
                      onClick={() => void onRefreshAuthState()}
                    >
                      {copy.refresh}
                    </Button>
                  </div>

                  {checkoutError || configError ? (
                    <p className="text-sm text-destructive">
                      {checkoutError || configError}
                    </p>
                  ) : null}

                  {transactionId ? (
                    <p className="text-xs text-muted-foreground">
                      {copy.transactionDetected} {transactionId}
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </section>

          <aside className="rounded-xl border border-border bg-card/80 p-6 shadow-xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {copy.settingsTitle}
            </div>
            <div className="mt-4 space-y-3">
              {[copy.step1, copy.step2, copy.step3].map(step => (
                <div
                  key={step}
                  className="rounded-xl border border-border bg-background/60 p-4 text-sm"
                >
                  {step}
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-border bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {copy.accountLabel}
                </p>
                <p className="mt-2 text-sm font-semibold">
                  {authState.status === "authenticated"
                    ? authState.user.email
                    : copy.guest}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {copy.modeLabel}
                </p>
                <p className="mt-2 text-sm font-semibold">
                  {authState.status === "authenticated" &&
                  authState.accessMode === "managed"
                    ? copy.managedMode
                    : copy.publicMode}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {copy.billingLabel}
                </p>
                <p className="mt-2 text-sm font-semibold">
                  {isSubscribed ? copy.subscribed : copy.notSubscribed}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

