import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { copy, useAppLanguage } from "@/lib/i18n";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const language = useAppLanguage();
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_30%),linear-gradient(160deg,#050814_0%,#0a0e1a_55%,#111827_100%)] px-4">
      <Card className="mx-4 w-full max-w-lg border border-white/10 bg-[rgba(17,24,39,0.88)] shadow-[0_28px_120px_rgba(2,6,23,0.55)] backdrop-blur-xl">
        <CardContent className="px-8 py-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-red-500/18 blur-xl" />
              <div className="relative rounded-full border border-red-400/25 bg-red-500/10 p-4">
                <AlertCircle className="h-10 w-10 text-red-300" />
              </div>
            </div>
          </div>

          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-300">
            Gistify
          </p>
          <h1 className="mb-2 text-5xl font-bold text-white">404</h1>

          <h2 className="mb-4 text-xl font-semibold text-slate-100">
            {copy(language, "Sayfa bulunamadi", "Page not found")}
          </h2>

          <p className="mb-8 leading-relaxed text-slate-400">
            {copy(
              language,
              "Aradigin sayfa yok, tasinmis olabilir veya erisim linki gecersizdir.",
              "The page you are looking for does not exist, may have moved, or the access link is invalid."
            )}
            <br />
            {copy(
              language,
              "Ana gorunume donup akisi devam ettirebilirsin.",
              "You can return to the main view and continue the flow."
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoHome}
              className="rounded-lg border border-indigo-400/30 bg-indigo-500/90 px-6 py-2.5 text-white transition-all duration-200 shadow-[0_16px_40px_rgba(79,70,229,0.28)] hover:bg-indigo-400"
            >
              <Home className="w-4 h-4 mr-2" />
              {copy(language, "Ana sayfaya don", "Return home")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
