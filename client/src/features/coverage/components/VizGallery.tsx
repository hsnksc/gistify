import { type AppLanguage } from "@/lib/i18n";
import { type CoverageVizSpec } from "../lib/vizSchema";
import VizRenderer from "./VizRenderer";

interface VizGalleryProps {
  language: AppLanguage;
}

const SAMPLES: { label: string; spec: CoverageVizSpec }[] = [
  {
    label: "ladder",
    spec: {
      v: 1,
      type: "ladder",
      current: 81.75,
      stop: 78,
      band: [65.91, 97.59],
      levels: [
        { price: 166.22, type: "res" },
        { price: 150, type: "res" },
        { price: 110, type: "res" },
        { price: 100, type: "res", tag: "current-zone" },
        { price: 85, type: "res", tag: "current-zone" },
        { price: 81.75, type: "pivot", tag: "current" },
        { price: 80, type: "sup", tag: "current-zone" },
        { price: 63.8, type: "sup" },
      ],
      caption: "Dikey eksen fiyat; kırmızı bantlar direnç, yeşil destek.",
      insight: "Fiyat 80–85 sıkışma bölgesinde; 78 altı kapanış 63.80'i açar.",
    },
  },
  {
    label: "gauge",
    spec: {
      v: 1,
      type: "gauge",
      value: 37.98,
      min: 0,
      max: 100,
      zones: [
        { to: 30, color: "var(--color-bull)", label: "Aşırı satım" },
        { to: 70, color: "var(--color-caution)", label: "Nötr" },
        { to: 100, color: "var(--color-bear)", label: "Aşırı alım" },
      ],
      label: "RSI 14",
      caption: "Yay üzerinde iğne mevcut değeri gösterir.",
      insight: "RSI 38 civarında nötr-negatif bölgede.",
    },
  },
  {
    label: "bullet",
    spec: {
      v: 1,
      type: "bullet",
      value: 81.75,
      band: [80, 85],
      max: 100,
      label: "Fiyat vs Sıkışma Bandı",
      caption: "Ana çubuk mevcut fiyatı; gri arka plan normal bandı.",
      insight: "Fiyat bandın üst kısmında; üzerinde kalıcılık 85 hedefler.",
    },
  },
  {
    label: "payoff",
    spec: {
      v: 1,
      type: "payoff",
      legs: [{ side: "long", type: "call", strike: 150, qty: 1, premium: 91 }],
      xRange: [60, 210],
      band: [65.91, 97.59],
      markers: { current: 81.75, breakeven: 150.91, target: 160 },
      probDots: [
        { x: 90, p: 65 },
        { x: 115, p: 20 },
        { x: 140, p: 10 },
        { x: 155, p: 4 },
        { x: 180, p: 1 },
      ],
      caption: "Vade sonunda 1 kontrat P&L eğrisi.",
      insight: "Zarar -$91 ile sınırlı; kâr +%84 üzeri harekette başlar.",
    },
  },
  {
    label: "earnings",
    spec: {
      v: 1,
      type: "earnings",
      rows: [
        { q: "Q1 25", est: -0.12, act: -0.08, surprise: 33.3, rev: 98.4, reaction: 5.2 },
        { q: "Q2 25", est: -0.09, act: -0.11, surprise: -22.2, rev: 102.1, reaction: -3.1 },
        { q: "Q3 25", est: -0.07, act: -0.05, surprise: 28.6, rev: 110.5, reaction: 4.8 },
      ],
      caption: "Mavi barlar tahmin, turuncu noktalar gerçekleşen.",
      insight: "Son çeyrekte sürpriz pozitif; gelir artışı sürüyor.",
    },
  },
  {
    label: "rangeDot",
    spec: {
      v: 1,
      type: "rangeDot",
      rows: [
        {
          metric: "Hedef Fiyat",
          low: 80,
          value: 143.41,
          high: 200,
          analysts: 12,
          revision: { from: 135, window: "30 gün" },
        },
      ],
      caption: "Nokta ortalama hedef; yatay çizgi low-high aralığı.",
      insight: "Ortalama hedef %75 yukarı potansiyel taşıyor.",
    },
  },
  {
    label: "donut",
    spec: {
      v: 1,
      type: "donut",
      total: 4200,
      unit: "MW",
      slices: [
        { name: "Microsoft", value: 1200 },
        { name: "NVIDIA", value: 900 },
        { name: "OpenAI", value: 700 },
        { name: "Diğer", value: 1400 },
      ],
      note: "Backlog dağılımı örneği.",
      caption: "Dilim büyüklüğü backlog payını temsil eder.",
      insight: "İlk üç müşteri backlog'un %66'sını oluşturuyor.",
    },
  },
  {
    label: "network",
    spec: {
      v: 1,
      type: "network",
      center: { id: "CRWV", label: "CoreWeave" },
      nodes: [
        { id: "MSFT", label: "Microsoft", relation: "customer", weight: 0.9 },
        { id: "NVDA", label: "NVIDIA", relation: "supplier", weight: 0.85 },
        { id: "ORCL", label: "Oracle", relation: "partner", weight: 0.6 },
        { id: "OAI", label: "OpenAI", relation: "frenemy", weight: 0.5 },
        { id: "GS", label: "Goldman Sachs", relation: "underwriter", weight: 0.4 },
      ],
      caption: "Merkezde ticker; çizgi kalınlığı ilişki tipine göre.",
      insight: "CRWV hem NVIDIA'nın büyük müşterisi hem rakibi.",
    },
  },
  {
    label: "chainViz",
    spec: {
      v: 1,
      type: "chainViz",
      rows: [
        { strike: 70, iv: 1.12, volume: 120, delta: -0.12 },
        { strike: 80, iv: 0.98, volume: 340, delta: -0.22 },
        { strike: 90, iv: 0.85, volume: 890, delta: -0.38, atm: true },
        { strike: 100, iv: 0.82, volume: 560, delta: 0.31 },
        { strike: 110, iv: 0.88, volume: 210, delta: 0.19 },
      ],
      caption: "Çizgi IV; yarı saydam barlar hacmi.",
      insight: "ATM civarında IV en düşük; uç strike'larda volatilite tepesi.",
    },
  },
  {
    label: "prob",
    spec: {
      v: 1,
      type: "prob",
      showEV: true,
      buckets: [
        { range: "< 100", pl: "-91", plMid: -91, prob: 65 },
        { range: "100–130", pl: "-91", plMid: -91, prob: 20 },
        { range: "130–150", pl: "-81", plMid: -81, prob: 10 },
        { range: "150–160", pl: "455", plMid: 455, prob: 4 },
        { range: "160+", pl: "2909", plMid: 2909, prob: 1 },
      ],
      caption: "Şerit genişlikleri olasılık.",
      insight: "%85 olasılıkla tam kayıp; beklenen değer negatif.",
    },
  },
  {
    label: "timeline",
    spec: {
      v: 1,
      type: "timeline",
      today: "2026-07-03",
      events: [
        { date: "2026-07-28", label: "FOMC + Powell", severity: "critical" },
        { date: "2026-07-29", label: "NVDA Q1 FY2027 earnings", severity: "critical" },
        { date: "2026-08-05", label: "Short interest raporu", severity: "mid" },
        { date: "2026-08-07", label: "META Q2 earnings", severity: "critical" },
        { date: "2026-08-11", label: "CRWV Q2 earnings", severity: "critical" },
        { date: "2026-08-12", label: "CPI (Temmuz)", severity: "mid" },
        { date: "2026-08-21", label: "Opsiyon vadesi", severity: "high" },
        { date: "2026-08-28", label: "OpenAI S-1 filing", severity: "high" },
      ],
      caption: "Kesikli çizgi bugünü, rozetler kalan günü.",
      insight: "Vadeden önce 5 kritik olay var.",
    },
  },
  {
    label: "scenario",
    spec: {
      v: 1,
      type: "scenario",
      cases: [
        {
          key: "bull",
          title: "Squeeze + hedef revizyonu",
          drivers: [
            ["Microsoft", "Yeni sözleşme", "bull"],
            ["NVIDIA", "Stokta kalma", "bull"],
          ],
          range: [150, 200],
          pl: 4909,
        },
        {
          key: "base",
          title: "Yatay sıkışma devamı",
          drivers: [["Piyasa", "Netflow zayıf", "neutral"]],
          range: [75, 95],
          pl: -91,
        },
        {
          key: "bear",
          title: "Direnç kırılımı",
          drivers: [["OpenAI", "Rakip anlaşma", "bear"]],
          range: [60, 75],
          pl: -91,
        },
      ],
      caption: "Kartlar varsayım, aralık ve P&L'yi gösterir.",
      insight: "Base senaryo zararla sonuçlanıyor; bull asimetrik kazanç.",
    },
  },
];

function ThemeColumn({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: "light" | "dark";
}) {
  return (
    <div
      className={
        theme === "dark"
          ? "dark rounded-xl bg-background p-4"
          : "rounded-xl bg-white p-4"
      }
    >
      <h2
        className={
          theme === "dark"
            ? "mb-4 text-sm font-bold uppercase tracking-wider text-foreground"
            : "mb-4 text-sm font-bold uppercase tracking-wider text-slate-900"
        }
      >
        {theme === "dark" ? "Dark" : "Light"}
      </h2>
      <div className="space-y-8">{children}</div>
    </div>
  );
}

export default function VizGallery({ language }: VizGalleryProps) {
  const title = language === "en" ? "Viz Gallery" : "Viz Galeri";
  const description =
    language === "en"
      ? "12 coverage viz types, light and dark theme side by side."
      : "12 coverage viz tipi, acik ve koyu tema yan yana.";

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold">
          {title}
        </h1>
        <p className="mb-8 text-muted-foreground">
          {description}
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <ThemeColumn theme="light">
            {SAMPLES.map(({ label, spec }) => (
              <VizRenderer
                key={`light-${label}`}
                block={{ raw: JSON.stringify(spec), spec, type: "viz" }}
                language={language}
              />
            ))}
          </ThemeColumn>

          <ThemeColumn theme="dark">
            {SAMPLES.map(({ label, spec }) => (
              <VizRenderer
                key={`dark-${label}`}
                block={{ raw: JSON.stringify(spec), spec, type: "viz" }}
                language={language}
              />
            ))}
          </ThemeColumn>
        </div>
      </div>
    </div>
  );
}
