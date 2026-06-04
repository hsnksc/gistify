import { Scan, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScannerControlsProps {
  onScan: () => void;
  isScanning: boolean;
  lastScanTime?: string;
  hasScanned?: boolean;
}

export default function ScannerControls({
  onScan,
  isScanning,
  lastScanTime,
  hasScanned,
}: ScannerControlsProps) {
  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString("tr-TR");
    } catch {
      return iso;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={onScan}
        disabled={isScanning}
        className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-2xl shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-emerald-500/30 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
      >
        {isScanning ? (
          <>
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            Taranıyor...
          </>
        ) : hasScanned ? (
          <>
            <RefreshCw className="w-5 h-5 mr-2" />
            Tekrar Tara
          </>
        ) : (
          <>
            <Scan className="w-5 h-5 mr-2" />
            NASDAQ Taraması Başlat
          </>
        )}
      </Button>

      {lastScanTime && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="w-4 h-4" />
          <span>Son tarama: {formatTime(lastScanTime)}</span>
        </div>
      )}
    </div>
  );
}
