/*
 * DESIGN: "Precision Finance" — June Option Strategy Detail Tab
 * Deep dive into each June stock's option strategy
 */

import { juneEarningsData, juneStrategyConfig } from "@/lib/juneEarningsData";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  selectedTicker: string | null;
  onSelectTicker: (ticker: string) => void;
}

export default function JuneOptionDetailTab({
  selectedTicker,
  onSelectTicker,
}: Props) {
  const stock = selectedTicker
    ? juneEarningsData.find(item => item.ticker === selectedTicker) || juneEarningsData[0]
    : juneEarningsData[0];

  const config = juneStrategyConfig[stock.strategyRating];

  const timelineData = [
    { day: "15 gun oncesi", iv: stock.historicalIV, callPrice: stock.callPremiumBuy, status: "BUY" },
    { day: "10 gun oncesi", iv: stock.historicalIV + 8, callPrice: stock.callPremiumBuy + 0.6, status: "HOLD" },
    { day: "5 gun oncesi", iv: stock.currentIV - 15, callPrice: stock.callPremiumBuy + 1.5, status: "HOLD" },
    { day: "2 gun oncesi", iv: stock.currentIV - 5, callPrice: stock.callPremiumSell - 0.4, status: "HOLD" },
    { day: "1 gun oncesi", iv: stock.currentIV, callPrice: stock.callPremiumSell, status: "SELL" },
    {
      day: "Earnings sonrasi",
      iv: stock.currentIV - stock.expectedIVCrush,
      callPrice:
        stock.callPremiumSell -
        (stock.callPremiumSell * stock.expectedIVCrush) / 100,
      status: "CRUSH",
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {juneEarningsData.map(item => {
          const itemConfig = juneStrategyConfig[item.strategyRating];
          const selected = item.ticker === stock.ticker;

          return (
            <button
              key={item.ticker}
              onClick={() => onSelectTicker(item.ticker)}
              className="px-3 py-1.5 text-xs font-bold data-mono border transition-all duration-150"
              style={{
                borderRadius: 0,
                background: selected ? `${itemConfig.color}20` : "transparent",
                borderColor: selected ? itemConfig.color : "oklch(0.25 0.03 225)",
                color: selected ? itemConfig.color : "oklch(0.55 0.015 225)",
              }}
            >
              {item.ticker}
            </button>
          );
        })}
      </div>

      <div
        className="tactical-card p-5"
        style={{ borderLeftColor: config.color, borderLeftWidth: "4px" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="heading-condensed text-3xl" style={{ color: "oklch(0.92 0.01 220)" }}>
                {stock.ticker}
              </h1>
              <span
                className={`text-sm font-bold px-3 py-1 border ${config.bgClass} ${config.textClass} ${config.borderClass}`}
                style={{ borderRadius: 0 }}
              >
                {config.label}
              </span>
            </div>
            <div className="text-base" style={{ color: "oklch(0.65 0.015 225)" }}>
              {stock.name}
            </div>
            <div className="text-sm mt-1" style={{ color: "oklch(0.5 0.015 225)" }}>
              Earnings: {stock.earningsDate} · Sektor: {stock.sector}
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="text-center">
              <div className="data-mono text-2xl font-bold mb-1" style={{ color: config.color }}>
                {stock.ivCrushScore}
              </div>
              <div className="text-xs" style={{ color: "oklch(0.45 0.015 225)" }}>
                IV Crush Skoru
              </div>
            </div>
            <div className="text-center">
              <div className="data-mono text-2xl font-bold mb-1" style={{ color: "oklch(0.78 0.18 160)" }}>
                +{stock.callGainFromIV}%
              </div>
              <div className="text-xs" style={{ color: "oklch(0.45 0.015 225)" }}>
                Call Kazanci
              </div>
            </div>
            <div className="text-center">
              <div className="data-mono text-2xl font-bold mb-1" style={{ color: "oklch(0.75 0.15 75)" }}>
                {stock.targetProfit}%
              </div>
              <div className="text-xs" style={{ color: "oklch(0.45 0.015 225)" }}>
                Hedef Kar
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tactical-card p-4">
        <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "oklch(0.45 0.015 225)" }}>
          Strateji Timeline: IV Expansion Firsat
        </div>
        <div style={{ height: "250px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.03 225)" />
              <XAxis
                dataKey="day"
                tick={{ fill: "oklch(0.45 0.015 225)", fontSize: 9, fontFamily: "JetBrains Mono" }}
                angle={-20}
                textAnchor="end"
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: "oklch(0.45 0.015 225)", fontSize: 9, fontFamily: "JetBrains Mono" }}
                label={{ value: "IV", angle: -90, position: "insideLeft" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: "oklch(0.45 0.015 225)", fontSize: 9, fontFamily: "JetBrains Mono" }}
                label={{ value: "Call Fiyati ($)", angle: 90, position: "insideRight" }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0]?.payload as
                      | { day?: string; iv?: number; callPrice?: number; status?: string }
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
                          {item?.day}
                        </p>
                        <p className="data-mono text-xs" style={{ color: "oklch(0.75 0.15 75)" }}>
                          IV: {item?.iv}
                        </p>
                        <p className="data-mono text-xs" style={{ color: "oklch(0.78 0.18 160)" }}>
                          Call: ${item?.callPrice?.toFixed(2)}
                        </p>
                        <p className="text-xs" style={{ color: config.color }}>
                          {item?.status}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line yAxisId="left" type="monotone" dataKey="iv" stroke="oklch(0.75 0.15 75)" strokeWidth={2} dot={{ fill: "oklch(0.75 0.15 75)", r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="callPrice" stroke="oklch(0.78 0.18 160)" strokeWidth={2} dot={{ fill: "oklch(0.78 0.18 160)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="tactical-card p-4">
          <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "oklch(0.45 0.015 225)" }}>
            CALL OPSIYON STRATEJISI
          </div>
          <div className="space-y-2">
            {[
              { label: "Satin Al (15 gun oncesi)", value: `$${stock.callPremiumBuy.toFixed(2)}`, color: "oklch(0.78 0.18 160)" },
              { label: "Sat (1-2 gun oncesi)", value: `$${stock.callPremiumSell.toFixed(2)}`, color: "oklch(0.75 0.15 75)" },
              { label: "Brut Kar", value: `$${(stock.callPremiumSell - stock.callPremiumBuy).toFixed(2)}`, color: "oklch(0.78 0.18 160)" },
              { label: "Kar Yuzdesi", value: `+${stock.callGainFromIV}%`, color: "oklch(0.78 0.18 160)" },
              { label: "IV Expansion Katkisi", value: `${stock.expectedIVCrush}% IV crush'tan kacinma`, color: "oklch(0.75 0.15 75)" },
            ].map(metric => (
              <div key={metric.label} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid oklch(0.18 0.025 225)" }}>
                <span className="text-xs" style={{ color: "oklch(0.45 0.015 225)" }}>
                  {metric.label}
                </span>
                <span className="data-mono text-xs font-semibold" style={{ color: metric.color }}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="tactical-card p-4">
          <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "oklch(0.45 0.015 225)" }}>
            PUT OPSIYON STRATEJISI
          </div>
          <div className="space-y-2">
            {[
              { label: "Satin Al (15 gun oncesi)", value: `$${stock.putPremiumBuy.toFixed(2)}`, color: "oklch(0.78 0.18 160)" },
              { label: "Sat (1-2 gun oncesi)", value: `$${stock.putPremiumSell.toFixed(2)}`, color: "oklch(0.75 0.15 75)" },
              { label: "Brut Kar", value: `$${(stock.putPremiumSell - stock.putPremiumBuy).toFixed(2)}`, color: "oklch(0.78 0.18 160)" },
              { label: "Kar Yuzdesi", value: `+${stock.putGainFromIV}%`, color: "oklch(0.78 0.18 160)" },
              { label: "Directional Hedging", value: "Asagi yonlu korunma saglar", color: "oklch(0.75 0.15 75)" },
            ].map(metric => (
              <div key={metric.label} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid oklch(0.18 0.025 225)" }}>
                <span className="text-xs" style={{ color: "oklch(0.45 0.015 225)" }}>
                  {metric.label}
                </span>
                <span className="data-mono text-xs font-semibold" style={{ color: metric.color }}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tactical-card p-4">
        <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "oklch(0.45 0.015 225)" }}>
          RISK vs ODUL
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Hedef Kar", value: `+${stock.targetProfit}%`, color: "oklch(0.78 0.18 160)" },
            { label: "Max Zarar", value: `-${stock.maxLoss}%`, color: "oklch(0.65 0.22 25)" },
            { label: "Odul/Risk Orani", value: `${(stock.targetProfit / stock.maxLoss).toFixed(1)}:1`, color: "oklch(0.75 0.15 75)" },
          ].map(metric => (
            <div key={metric.label} className="text-center p-3" style={{ background: "oklch(0.13 0.025 230)", borderRadius: 0 }}>
              <div className="text-xs" style={{ color: "oklch(0.45 0.015 225)" }}>
                {metric.label}
              </div>
              <div className="data-mono text-lg font-bold mt-1" style={{ color: metric.color }}>
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tactical-card p-4" style={{ borderLeftColor: config.color }}>
        <div className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "oklch(0.45 0.015 225)" }}>
          ONERILEN STRATEJI
        </div>
        <div className="text-sm font-semibold mb-2" style={{ color: config.color }}>
          {stock.recommendedStrategy}
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "oklch(0.65 0.015 225)" }}>
          {stock.ticker === "ORCL" &&
            "FY2026 kapanisi. Cloud/AI revenue guidance binary event. IV Rank > 60 ise Iron Condor; IV Rank < 20 ise Long Straddle. OCI buyume orani kritik."}
          {stock.ticker === "LEN" &&
            "Homebuilder sektoru mortgage rate'e ultra-sensitiv. FOMC 16-17 Haziran'dan 5 gun once kazanc acikliyor. EVR 2.1 dusuk volatilite hissi. FOMC oncesi pozisyonu kapat veya hedge'le."}
          {stock.ticker === "ADBE" &&
            "AI-first offerings ARR 3x buyudu. Firefly Enterprise musteri edinimi guclu. AI hype nedeniyle yuksek IV varsa short premium yapisi daha uygun olabilir."}
          {stock.ticker === "SPY" &&
            "FOMC 16-17 Haziran Dot Plot meeting. SPY range 2.0-2.5%. 14:00 ET rate decision genellikle fakeout, 14:30 ET press conference asil hareket. 0DTE credit spread veya iron condor dusunulebilir."}
          {stock.ticker === "QQQ" &&
            "Tech-heavy ETF icin FOMC sonrasi directional bias 66.7% DOWN. Short VIX / QQQ iron condor yapisi event sonrasinda ozel avantaj saglar."}
          {stock.ticker === "NVDA" &&
            "Extreme momentum + AI infrastructure leader. 8-19 Haziran araliginda trend play. Long Call veya Bull Call Spread ile IV expansion'dan faydalanma daha anlamli."}
          {stock.ticker === "AVGO" &&
            "Yuksek momentum + AI chip cycle. Strong relative strength vs SPY. Long Call veya Bull Call Spread tercih edilir."}
          {stock.ticker === "AMZN" &&
            "Guclu momentum + AWS AI capex tailwind. Long Call veya kontrollu bull spread ile stabil bir trend takibi daha makul."}
          {stock.ticker === "DHI" &&
            "Homebuilder momentum play. LEN ile correlation var. FOMC rate sensitivity yuksek. Orta risk, orta odul."}
          {stock.ticker === "TOL" &&
            "Luxury homebuilder momentum. Mortgage rate pivot play. LEN kazanci sektor genel etki yaratabilir."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="tactical-card p-3" style={{ borderLeftColor: "oklch(0.65 0.22 25)" }}>
          <div className="text-xs font-semibold mb-1" style={{ color: "oklch(0.65 0.22 25)" }}>
            Earnings Miss Riski
          </div>
          <div className="data-mono text-2xl font-bold mb-1" style={{ color: "oklch(0.65 0.22 25)" }}>
            {stock.earningsMissRisk}%
          </div>
          <div className="text-xs" style={{ color: "oklch(0.55 0.015 225)" }}>
            Fiyat keskin dusus riski
          </div>
        </div>
        <div className="tactical-card p-3" style={{ borderLeftColor: "oklch(0.75 0.15 75)" }}>
          <div className="text-xs font-semibold mb-1" style={{ color: "oklch(0.75 0.15 75)" }}>
            Gap Riski
          </div>
          <div className="data-mono text-2xl font-bold mb-1" style={{ color: "oklch(0.75 0.15 75)" }}>
            {stock.gapRisk}%
          </div>
          <div className="text-xs" style={{ color: "oklch(0.55 0.015 225)" }}>
            Earnings sonrasi gap riski
          </div>
        </div>
        <div className="tactical-card p-3" style={{ borderLeftColor: "oklch(0.78 0.18 160)" }}>
          <div className="text-xs font-semibold mb-1" style={{ color: "oklch(0.78 0.18 160)" }}>
            Tarihsel Beat Orani
          </div>
          <div className="data-mono text-2xl font-bold mb-1" style={{ color: "oklch(0.78 0.18 160)" }}>
            %{stock.beatRate}
          </div>
          <div className="text-xs" style={{ color: "oklch(0.55 0.015 225)" }}>
            Son 4 ceyrekte beat orani
          </div>
        </div>
      </div>
    </div>
  );
}
