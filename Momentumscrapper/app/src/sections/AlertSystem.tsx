import { useEffect, useRef } from "react";
import type { StockResult } from "@/types/scanner";
import { AlertTriangle, Volume2 } from "lucide-react";

interface AlertSystemProps {
  stocks: StockResult[];
  isScanComplete: boolean;
}

export default function AlertSystem({ stocks, isScanComplete }: AlertSystemProps) {
  const notifiedRef = useRef(false);

  // Browser notification for STRONG_BUY
  useEffect(() => {
    if (!isScanComplete || notifiedRef.current) return;

    const hasStrongBuy = stocks.some((s) => s.signal === "STRONG_BUY");
    if (hasStrongBuy && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("NASDAQ Momentum Scanner", {
          body: "GÜÇLÜ AL sinyali tespit edildi! Paneli kontrol edin.",
          icon: "/favicon.ico",
        });
        notifiedRef.current = true;
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((p) => {
          if (p === "granted") {
            new Notification("NASDAQ Momentum Scanner", {
              body: "GÜÇLÜ AL sinyali tespit edildi!",
              icon: "/favicon.ico",
            });
          }
        });
        notifiedRef.current = true;
      }
    }
  }, [isScanComplete, stocks]);

  const extremeRsi = stocks.find((s) => s.rsi > 80);
  const extremeVolume = stocks.find((s) => s.volumeRatio > 5);

  if (!extremeRsi && !extremeVolume) return null;

  return (
    <div className="space-y-2 mb-6">
      {extremeRsi && (
        <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <p className="text-sm text-red-400 font-medium">
              Aşırı Alım Uyarısı: {extremeRsi.ticker} (RSI: {extremeRsi.rsi})
            </p>
            <p className="text-xs text-slate-400">Düzeltme riski yüksek - kısa vadeli call'lardan kaçının</p>
          </div>
        </div>
      )}
      {extremeVolume && (
        <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <Volume2 className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <p className="text-sm text-amber-400 font-medium">
              Aşırı Hacim Uyarısı: {extremeVolume.ticker} (RVOL: {extremeVolume.volumeRatio}x)
            </p>
            <p className="text-xs text-slate-400">Olağanüstü hacim aktivitesi - dikkatle takip edin</p>
          </div>
        </div>
      )}
    </div>
  );
}
