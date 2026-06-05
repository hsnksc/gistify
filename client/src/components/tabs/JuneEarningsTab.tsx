/*
 * DESIGN: "Precision Finance" — June 8-19 Earnings IV Crush & Momentum Strategy Tab
 * 8-19 June window: ORCL, LEN, ADBE earnings + FOMC 16-17 + Juneteenth 19
 */

import { juneEarningsData, juneStrategyConfig } from "@/lib/juneEarningsData";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  onStockClick: (ticker: string) => void;
}

export default function JuneEarningsTab({ onStockClick }: Props) {
  const sorted = [...juneEarningsData].sort((a, b) => b.ivCrushScore - a.ivCrushScore);

  const scatterData = juneEarningsData.map(stock => ({
    ticker: stock.ticker,
    x: stock.currentIV,
    y: stock.momentumScore,
    crush: stock.expectedIVCrush,
    rating: stock.strategyRating,
  }));

  const profitData = juneEarningsData.map(stock => ({
    ticker: stock.ticker,
    callGain: stock.callGainFromIV,
    putGain: stock.putGainFromIV,
    targetProfit: stock.targetProfit,
  }));

  const getRatingColor = (rating: string) => {
    if (rating === "EXCELLENT") return "oklch(0.78 0.18 160)";
    if (rating === "GOOD") return "#4ade80";
    if (rating === "FAIR") return "oklch(0.75 0.15 75)";
    return "oklch(0.65 0.22 25)";
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5" style={{ background: "oklch(0.78 0.18 160)" }} />
          <h1 className="heading-condensed text-xl" style={{ color: "oklch(0.92 0.01 220)" }}>
            8-19 HAZIRAN EARNINGS & MOMENTUM SETUPLARI
          </h1>
        </div>
        <p className="text-sm ml-3" style={{ color: "oklch(0.5 0.015 225)" }}>
          ORCL (10 Haz), LEN + ADBE (11 Haz) · FOMC Dot Plot (16-17 Haz) ·
          Juneteenth (19 Haz) · IV Crush + Momentum
        </p>
      </div>

      <div
        className="tactical-card p-5"
        style={{ borderLeftColor: "oklch(0.78 0.18 160)", borderLeftWidth: "4px" }}
      >
        <div
          className="heading-condensed text-base mb-3"
          style={{ color: "oklch(0.78 0.18 160)" }}
        >
          June 8-19 Makro Takvim
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-semibold mb-1" style={{ color: "oklch(0.85 0.01 220)" }}>
              10 Haziran — ORCL Q4 FY2026
            </div>
            <div style={{ color: "oklch(0.65 0.015 225)" }}>
              Kapanis sonrasi. Cloud/AI revenue guidance binary event. FY2026 kapanisi.
            </div>
          </div>
          <div>
            <div className="font-semibold mb-1" style={{ color: "oklch(0.85 0.01 220)" }}>
              11 Haziran — LEN + ADBE Q2 2026
            </div>
            <div style={{ color: "oklch(0.65 0.015 225)" }}>
              Iki buyuk hisse ayni gun. LEN: ~4.3% implied move, EVR 2.1.
              ADBE: AI-first ARR 3x buyume.
            </div>
          </div>
          <div>
            <div className="font-semibold mb-1" style={{ color: "oklch(0.85 0.01 220)" }}>
              16-17 Haziran — FOMC + Dot Plot
            </div>
            <div style={{ color: "oklch(0.65 0.015 225)" }}>
              Quarterly SEP meeting. SPY range 2.0-2.5%. VIX consistently duser.
              66.7% next day DOWN.
            </div>
          </div>
        </div>
        <div className="mt-3 text-sm" style={{ color: "oklch(0.65 0.22 25)" }}>
          <strong>19 Haziran Juneteenth:</strong> Piyasalar kapali. 18 Haziran
          kapanista tum pozisyonlari review et.
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: "oklch(0.78 0.18 160)" }} />
          <h2 className="heading-condensed text-base" style={{ color: "oklch(0.92 0.01 220)" }}>
            8-19 HAZIRAN FIRSAT SIRALAMASI
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  borderBottom: "2px solid oklch(0.22 0.03 225)",
                  background: "oklch(0.13 0.025 230)",
                }}
              >
                {[
                  "Sira",
                  "Hisse",
                  "Rating",
                  "IV Crush Skoru",
                  "Mevcut IV",
                  "Beklenen IV Crush",
                  "Call Kazanci",
                  "Put Kazanci",
                  "Hedef Kar",
                  "Earnings",
                ].map(header => (
                  <th
                    key={header}
                    className="px-3 py-2 text-left heading-condensed text-xs tracking-wider"
                    style={{ color: "oklch(0.55 0.015 225)" }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((stock, index) => {
                const config = juneStrategyConfig[stock.strategyRating];
                return (
                  <tr
                    key={stock.ticker}
                    onClick={() => onStockClick(stock.ticker)}
                    className="cursor-pointer transition-colors"
                    style={{
                      borderBottom: "1px solid oklch(0.18 0.025 225)",
                      background:
                        index % 2 === 0 ? "transparent" : "oklch(0.13 0.025 230 / 0.5)",
                    }}
                    onMouseEnter={event =>
                      (event.currentTarget.style.background =
                        "oklch(0.78 0.18 160 / 0.05)")
                    }
                    onMouseLeave={event =>
                      (event.currentTarget.style.background =
                        index % 2 === 0 ? "transparent" : "oklch(0.13 0.025 230 / 0.5)")
                    }
                  >
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-bold" style={{ color: "oklch(0.4 0.02 225)" }}>
                        #{index + 1}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-sm font-bold" style={{ color: "oklch(0.92 0.01 220)" }}>
                        {stock.ticker}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 border ${config.bgClass} ${config.textClass} ${config.borderClass}`}
                        style={{ borderRadius: 0 }}
                      >
                        {config.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="data-mono text-sm font-bold" style={{ color: config.color }}>
                          {stock.ivCrushScore}
                        </span>
                        <div style={{ width: "50px", height: "4px", background: "oklch(0.2 0.03 225)" }}>
                          <div
                            style={{
                              width: `${stock.ivCrushScore}%`,
                              height: "100%",
                              background: config.color,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: "oklch(0.75 0.15 75)" }}>
                        {stock.currentIV}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: "oklch(0.78 0.18 160)" }}>
                        -{stock.expectedIVCrush}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: "oklch(0.78 0.18 160)" }}>
                        +{stock.callGainFromIV}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: "oklch(0.78 0.18 160)" }}>
                        +{stock.putGainFromIV}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="data-mono text-xs font-semibold" style={{ color: "oklch(0.75 0.15 75)" }}>
                        {stock.targetProfit}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs" style={{ color: "oklch(0.65 0.015 225)" }}>
                        {stock.earningsDate}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4" style={{ background: "oklch(0.6 0.12 250)" }} />
            <h2 className="heading-condensed text-base" style={{ color: "oklch(0.92 0.01 220)" }}>
              MEVCUT IV vs MOMENTUM
            </h2>
          </div>
          <div className="tactical-card p-4" style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" />
                <XAxis
                  dataKey="x"
                  tick={{ fill: "oklch(0.45 0.015 225)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  label={{ value: "Mevcut IV", position: "insideBottom", offset: -10, fill: "oklch(0.45 0.015 225)", fontSize: 10 }}
                />
                <YAxis
                  dataKey="y"
                  tick={{ fill: "oklch(0.45 0.015 225)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  label={{ value: "Momentum Skoru", angle: -90, position: "insideLeft", fill: "oklch(0.45 0.015 225)", fontSize: 10 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0]?.payload as
                        | { ticker?: string; x?: number; y?: number; crush?: number }
                        | undefined;
                      return (
                        <div
                          className="px-3 py-2 border"
                          style={{
                            background: "oklch(0.15 0.03 225)",
                            borderColor: "oklch(0.25 0.03 225)",
                            borderRadius: 0,
                          }}
                        >
                          <p className="data-mono text-xs font-bold" style={{ color: "oklch(0.78 0.18 160)" }}>
                            {item?.ticker}
                          </p>
                          <p className="data-mono text-xs" style={{ color: "oklch(0.75 0.15 75)" }}>
                            IV: {item?.x}
                          </p>
                          <p className="data-mono text-xs" style={{ color: "oklch(0.78 0.18 160)" }}>
                            Momentum: {item?.y}
                          </p>
                          <p className="data-mono text-xs" style={{ color: "oklch(0.65 0.22 25)" }}>
                            IV Crush: -{item?.crush}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell key={`${entry.ticker}-${index + 1}`} fill={getRatingColor(entry.rating)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4" style={{ background: "oklch(0.75 0.15 75)" }} />
            <h2 className="heading-condensed text-base" style={{ color: "oklch(0.92 0.01 220)" }}>
              CALL vs PUT KAR POTANSIYELI
            </h2>
          </div>
          <div className="tactical-card p-4" style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" />
                <XAxis
                  dataKey="ticker"
                  tick={{
                    fill: "oklch(0.55 0.015 225)",
                    fontSize: 10,
                    fontFamily: "JetBrains Mono",
                    fontWeight: 600,
                  }}
                />
                <YAxis
                  tick={{ fill: "oklch(0.45 0.015 225)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  unit="%"
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div
                          className="px-3 py-2 border"
                          style={{
                            background: "oklch(0.15 0.03 225)",
                            borderColor: "oklch(0.25 0.03 225)",
                            borderRadius: 0,
                          }}
                        >
                          <p className="data-mono text-xs font-bold" style={{ color: "oklch(0.78 0.18 160)" }}>
                            {label}
                          </p>
                          {payload.map((item, index) => (
                            <p key={`${label}-${index + 1}`} className="data-mono text-xs" style={{ color: item.color }}>
                              {item.name}: +{item.value}%
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", color: "oklch(0.55 0.015 225)" }} />
                <Bar dataKey="callGain" name="Call Kazanci" fill="oklch(0.78 0.18 160)" maxBarSize={20} />
                <Bar dataKey="putGain" name="Put Kazanci" fill="oklch(0.75 0.15 75)" maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4" style={{ background: "oklch(0.78 0.18 160)" }} />
          <h2 className="heading-condensed text-base" style={{ color: "oklch(0.92 0.01 220)" }}>
            EN IYI 8-19 HAZIRAN FIRSAT HISSELER
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.slice(0, 4).map(stock => {
            const config = juneStrategyConfig[stock.strategyRating];
            return (
              <button
                key={stock.ticker}
                onClick={() => onStockClick(stock.ticker)}
                className="tactical-card p-4 text-left"
                style={{ borderLeftColor: config.color }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="data-mono text-lg font-bold" style={{ color: "oklch(0.92 0.01 220)" }}>
                    {stock.ticker}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 border ${config.bgClass} ${config.textClass} ${config.borderClass}`}
                    style={{ borderRadius: 0 }}
                  >
                    {config.label}
                  </span>
                </div>
                <div className="text-sm mb-3" style={{ color: "oklch(0.65 0.015 225)" }}>
                  {stock.name}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <div className="text-xs" style={{ color: "oklch(0.4 0.015 225)" }}>
                      Mevcut IV
                    </div>
                    <div className="data-mono text-sm font-bold" style={{ color: "oklch(0.75 0.15 75)" }}>
                      {stock.currentIV}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: "oklch(0.4 0.015 225)" }}>
                      IV Crush
                    </div>
                    <div className="data-mono text-sm font-bold" style={{ color: "oklch(0.78 0.18 160)" }}>
                      -{stock.expectedIVCrush}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: "oklch(0.4 0.015 225)" }}>
                      Call Kazanci
                    </div>
                    <div className="data-mono text-sm font-bold" style={{ color: "oklch(0.78 0.18 160)" }}>
                      +{stock.callGainFromIV}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: "oklch(0.4 0.015 225)" }}>
                      Hedef Kar
                    </div>
                    <div className="data-mono text-sm font-bold" style={{ color: "oklch(0.75 0.15 75)" }}>
                      {stock.targetProfit}%
                    </div>
                  </div>
                </div>
                <div className="text-xs" style={{ color: "oklch(0.55 0.015 225)" }}>
                  <strong>Earnings:</strong> {stock.earningsDate}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="tactical-card p-4"
        style={{ borderLeftColor: "oklch(0.65 0.22 25)", borderLeftWidth: "4px" }}
      >
        <div className="heading-condensed text-sm mb-2" style={{ color: "oklch(0.65 0.22 25)" }}>
          RISK UYARISI
        </div>
        <div className="text-sm space-y-1.5" style={{ color: "oklch(0.65 0.015 225)" }}>
          <p>
            <strong>FOMC Dot Plot (16-17 Haz):</strong> Yilin en volatil gunlerinden biri.
            SPY range 2.0-2.5%. 14:00 ET rate decision fakeout, 14:30 ET press conference asil hareket.
          </p>
          <p>
            <strong>LEN + ADBE Same Day (11 Haz):</strong> Ayni gun 2 buyuk hisse correlation riski yaratir.
            Pozisyonlari kucult veya birini sec.
          </p>
          <p>
            <strong>Juneteenth (19 Haz):</strong> Piyasalar kapali. 18 Haziran kapanista tum pozisyonlari review et.
            3 gunluk weekend gap riski var.
          </p>
          <p>
            <strong>Position sizing:</strong> Her setup maksimum portfoyun 1-2% riski.
            Dot plot meeting gunlerinde normalden %50 daha kucuk pozisyon.
          </p>
        </div>
      </div>
    </div>
  );
}
