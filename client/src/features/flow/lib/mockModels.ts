import type { AppLanguage } from "@/lib/i18n";

export type FlowModelId = "chatgpt" | "claude" | "gemini" | "grok";

export interface FlowModelDefinition {
  accentClassName: string;
  costLabel: string;
  id: FlowModelId;
  label: string;
  provider: string;
  speedLabel: string;
  toneLabel: string;
}

export const FLOW_MODELS: FlowModelDefinition[] = [
  {
    accentClassName: "text-indigo-300 border-indigo-400/30 bg-indigo-500/10",
    costLabel: "balanced",
    id: "chatgpt",
    label: "ChatGPT",
    provider: "OpenAI",
    speedLabel: "steady",
    toneLabel: "structured",
  },
  {
    accentClassName: "text-emerald-300 border-emerald-400/30 bg-emerald-500/10",
    costLabel: "deep",
    id: "claude",
    label: "Claude",
    provider: "Anthropic",
    speedLabel: "deliberate",
    toneLabel: "analytical",
  },
  {
    accentClassName: "text-sky-300 border-sky-400/30 bg-sky-500/10",
    costLabel: "fast",
    id: "gemini",
    label: "Gemini",
    provider: "Google",
    speedLabel: "quick",
    toneLabel: "broad",
  },
  {
    accentClassName: "text-amber-300 border-amber-400/30 bg-amber-500/10",
    costLabel: "aggressive",
    id: "grok",
    label: "Grok",
    provider: "xAI",
    speedLabel: "spiky",
    toneLabel: "contrarian",
  },
];

function buildLead(language: AppLanguage, prompt: string) {
  return language === "en"
    ? `User prompt: "${prompt.trim()}". The response below focuses on a side-by-side answer that is easy to compare across models.`
    : `Kullanici promptu: "${prompt.trim()}". Asagidaki yanit, modeller arasi yan yana karsilastirmayi kolaylastiracak sekilde kurgulandi.`;
}

function buildCodeExample(model: FlowModelDefinition) {
  if (model.id === "gemini") {
    return [
      "```json",
      '{',
      '  "model": "gemini",',
      '  "confidence": 0.68,',
      '  "playbook": ["watch opening breadth", "wait for confirmation", "scale by volatility"]',
      "}",
      "```",
    ].join("\n");
  }

  if (model.id === "grok") {
    return [
      "```python",
      "score = momentum * 0.45 + catalysts * 0.35 - risk * 0.20",
      "if score > 0.62:",
      "    action = 'press winners carefully'",
      "else:",
      "    action = 'stay selective'",
      "```",
    ].join("\n");
  }

  if (model.id === "claude") {
    return [
      "```ts",
      "type RiskBucket = 'low' | 'medium' | 'high';",
      "",
      "function sizePosition(conviction: number, volatility: number): RiskBucket {",
      "  if (conviction >= 0.75 && volatility < 0.35) return 'low';",
      "  if (conviction >= 0.55) return 'medium';",
      "  return 'high';",
      "}",
      "```",
    ].join("\n");
  }

  return [
    "```ts",
    "const plan = {",
    "  model: 'chatgpt',",
    "  bias: 'balanced',",
    "  trigger: 'wait for confirmation above intraday resistance',",
    "};",
    "```",
  ].join("\n");
}

export function buildMockModelResponse(
  model: FlowModelDefinition,
  prompt: string,
  language: AppLanguage
) {
  const lead = buildLead(language, prompt);

  const sectionsByModel = {
    chatgpt:
      language === "en"
        ? [
            "## Core Thesis",
            lead,
            "",
            "The setup is attractive when the user needs a clean ranking of catalysts, risks and execution triggers instead of a single binary answer.",
            "",
            "## What Matters Most",
            "- Rank upside drivers by durability, not by headline intensity.",
            "- Separate near-term tape behavior from the longer-term thesis.",
            "- Use explicit invalidation levels before pressing size.",
            "",
            "## Execution",
            "1. Define the base case and the bear case separately.",
            "2. Wait for confirmation if volatility expands without breadth support.",
            "3. Tighten size when the prompt implies event risk or guidance uncertainty.",
            "",
            "## Reference Snippet",
            buildCodeExample(model),
          ]
        : [
            "## Ana Tez",
            lead,
            "",
            "Kurulum, tek bir kesin cevap yerine katalizorleri, riskleri ve uygulama tetiklerini temiz bir sirayla gormek gerektiginde daha degerli hale geliyor.",
            "",
            "## En Kritik Noktalar",
            "- Yukari yonlu suruculeri baslik etkisine gore degil kaliciligina gore sirala.",
            "- Kisa vadeli fiyat davranisini uzun vadeli tezden ayir.",
            "- Buyukluk artirmadan once gecersizlik seviyesini acik yaz.",
            "",
            "## Uygulama",
            "1. Temel senaryo ve ayi senaryosunu ayri yaz.",
            "2. Volatilite artip genislik destek vermiyorsa teyit bekle.",
            "3. Prompt olay riski veya rehberlik belirsizligi tasiyorsa boyutu kis.",
            "",
            "## Referans Kod",
            buildCodeExample(model),
          ],
    claude:
      language === "en"
        ? [
            "## Decision Frame",
            lead,
            "",
            "Claude emphasizes structure: first isolate assumptions, then map the quality of evidence, then translate that into a risk budget.",
            "",
            "## Evidence Ladder",
            "- Durable catalysts: operating leverage, product adoption, margin inflection.",
            "- Medium confidence: analyst revisions and channel checks.",
            "- Low confidence: purely narrative multiple expansion.",
            "",
            "## Risk Budget",
            "The user should avoid mixing timing confidence with thesis confidence. A strong thesis can still deserve a smaller near-term size.",
            "",
            "## Position Sizing Logic",
            buildCodeExample(model),
          ]
        : [
            "## Karar Cercevesi",
            lead,
            "",
            "Claude daha yapisal ilerler: once varsayimlari ayirir, sonra kanit kalitesini haritalar, en sonda bunu risk butcesine cevirir.",
            "",
            "## Kanit Merdiveni",
            "- Kalici katalizorler: operasyonel kaldirac, urun benimsenmesi, marj ivmesi.",
            "- Orta guven: analist revizyonlari ve kanal kontrolu.",
            "- Dusuk guven: yalnizca anlatidan beslenen carpana dayali genisleme.",
            "",
            "## Risk Butcesi",
            "Kullanici zamanlama guveni ile tez guvenini karistirmamali. Guclu bir tez kisa vadede yine de daha kucuk boyut gerektirebilir.",
            "",
            "## Pozisyon Boyutlandirma Mantigi",
            buildCodeExample(model),
          ],
    gemini:
      language === "en"
        ? [
            "## Landscape Scan",
            lead,
            "",
            "Gemini tends to widen the frame and connect the prompt to adjacent macro, sector and sentiment factors so the response feels broad and synthesis-heavy.",
            "",
            "## Breadth View",
            "- Market regime matters if the prompt is sensitive to rates, liquidity or beta compression.",
            "- Sector leadership can overpower single-name fundamentals for a session or two.",
            "- Cross-check the prompt against macro calendar pressure.",
            "",
            "## Compact Machine Output",
            buildCodeExample(model),
          ]
        : [
            "## Genel Tarama",
            lead,
            "",
            "Gemini genelde cerceveyi genisletir ve promptu makro, sektor ve duyarlilik baglamina baglar; bu nedenle yanit daha sentez agirlikli olur.",
            "",
            "## Genislik Gorunumu",
            "- Prompt faiz, likidite veya beta baskisina duyarliysa piyasa rejimi belirleyicidir.",
            "- Sektor liderligi bir iki seans boyunca sirket temellerinin onune gecebilir.",
            "- Promptu makro takvim baskisi ile capraz kontrol et.",
            "",
            "## Kompakt Makine Ciktisi",
            buildCodeExample(model),
          ],
    grok:
      language === "en"
        ? [
            "## Fast Take",
            lead,
            "",
            "Grok leans toward sharper positioning language. It is useful when the user wants a bold ranking quickly, but the framing can be intentionally more aggressive.",
            "",
            "## Where It Pushes Harder",
            "- It will press momentum if price, narrative and positioning align together.",
            "- It discounts soft consensus comfort faster than the other models.",
            "- It is more willing to call out weak setups as noise.",
            "",
            "## Tactical Rule",
            buildCodeExample(model),
          ]
        : [
            "## Hizli Yorum",
            lead,
            "",
            "Grok daha sert pozisyonlama dili kullanir. Kullanici hizli ve cesur bir siralama istediginde degerlidir, ancak cercevesi bilerek daha agresiftir.",
            "",
            "## Daha Sert Bastigi Yerler",
            "- Fiyat, anlatı ve pozisyonlanma ayni yone baktiginda momentumu daha kolay iter.",
            "- Yumusa konsensus rahatligini diger modellere gore daha hizli iskonto eder.",
            "- Zayif kurulumlari gurultu diye ayirmaya daha isteklidir.",
            "",
            "## Taktik Kural",
            buildCodeExample(model),
          ],
  } satisfies Record<FlowModelId, string[]>;

  return sectionsByModel[model.id].join("\n");
}

interface StreamMockModelResponseOptions {
  language: AppLanguage;
  model: FlowModelDefinition;
  onChunk: (chunk: string) => void;
  onDone: (fullText: string) => void;
  prompt: string;
}

export function streamMockModelResponse({
  language,
  model,
  onChunk,
  onDone,
  prompt,
}: StreamMockModelResponseOptions) {
  const fullText = buildMockModelResponse(model, prompt, language);
  const chunks = fullText.match(/\S+\s*/g) || [];
  const paceMap: Record<FlowModelId, { chunkSize: number; delayMs: number }> = {
    chatgpt: { chunkSize: 3, delayMs: 44 },
    claude: { chunkSize: 2, delayMs: 62 },
    gemini: { chunkSize: 4, delayMs: 34 },
    grok: { chunkSize: 5, delayMs: 28 },
  };

  const pace = paceMap[model.id];
  let activeTimeout = 0;
  let cursor = 0;
  let cancelled = false;

  const tick = () => {
    if (cancelled) {
      return;
    }

    const chunkSize =
      pace.chunkSize + Math.max(0, Math.round(Math.sin(cursor / 9) * 1));
    const nextChunk = chunks.slice(cursor, cursor + chunkSize).join("");
    cursor += chunkSize;

    if (nextChunk) {
      onChunk(nextChunk);
    }

    if (cursor >= chunks.length) {
      onDone(fullText);
      return;
    }

    activeTimeout = window.setTimeout(tick, pace.delayMs);
  };

  activeTimeout = window.setTimeout(tick, pace.delayMs);

  return () => {
    cancelled = true;
    window.clearTimeout(activeTimeout);
  };
}
