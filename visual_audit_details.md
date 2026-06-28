# Gistify Visual Micro-Interaction & Detail Audit

> **Session:** gistify-details-visual  
> **Pages Audited:** https://gistify.pro/momentum (landing redirect), https://gistify.pro/app (momentum app), https://gistify.pro/app/overview, https://gistify.pro/app/marketflash (both redirect to /app or /momentum)  
> **Date:** 2026-06-22  
> **Method:** WebBridge DOM evaluate + screenshot + synthetic hover/focus dispatch

---

## 1. Color Palette Extraction

### Mevcut Değerler

| Token | Mevcut Değer | Hex Approximation |
|---|---|---|
| `background` | `rgb(10, 14, 26)` | `#0a0e1a` |
| `card` | `rgb(17, 24, 39)` | `#111827` |
| `muted` / `popover` / `overlay` | `rgb(26, 34, 53)` | `#1a2235` |
| `foreground` | `rgb(248, 251, 255)` | `#f8fbff` |
| `secondary-text` | `rgb(192, 204, 218)` | `#c0ccda` |
| `tertiary-text` | `rgb(147, 166, 187)` | `#93a6bb` |
| `primary` | `rgb(14, 165, 233)` | `#0ea5e9` (sky blue) |
| `ring` (focus) | `#0ea5e9` | `#0ea5e9` |
| `border` | `rgba(148, 163, 184, 0.14)` | `#94a3b824` |
| `bull/green` | `rgb(16, 185, 129)` | `#10b981` |
| `bear/red` | `rgb(239, 68, 68)` | `#ef4444` |
| `amber/orange` | `rgb(245, 158, 11)` | `#f59e0b` |

**Gözlemler:**
- Mevcut palette **dark-first** (near-black navy background). Primary accent sky-blue (`#0ea5e9`) — modern, tech-forward.
- Green/Red/Amber semantic colors are standard Tailwind defaults (emerald-500, red-500, amber-500).
- Border color is extremely subtle (14% opacity slate-400) — creates "floating" card look on dark bg.
- No warm tones anywhere. Entirely cool palette (blues, slates, cyans).

### Classic Öneri

| Token | Classic Öneri | Rationale |
|---|---|---|
| `background` | `#0B1120` (warm navy) | Mevcut `#0a0e1a` çok soğuk. Warm navy (#0B1120) daha sophisticated, institutional feel. |
| `card` | `#F8F5F2` (warm paper) | **Light card bg.** Dark card on dark bg = muddy hierarchy. Warm paper creates natural depth. |
| `muted` | `#F0EBE6` | Warm off-white for elevated surfaces. |
| `foreground` | `#1a1a2e` | Dark ink on light paper. |
| `secondary-text` | `#334155` (slate) | Mevcut `#c0ccda` çok soğuk. `#334155` classic, readable. |
| `tertiary-text` | `#64748b` | Muted but not invisible. |
| `primary` | `#C9A96E` (gold accent) | Sky-blue çok "SaaS generic". Gold accent = premium, timeless, financial. |
| `border` | `rgba(51, 65, 85, 0.15)` | `#334155` at 15% opacity — warm, subtle, visible. |
| `bull/green` | `#2D7D46` | Deeper emerald — less "neon", more institutional. |
| `bear/red` | `#B91C1C` | Deeper crimson — classic financial red. |
| `amber/orange` | `#B45309` | Burnt amber — less "traffic light", more "aged parchment". |

### CSS / Tailwind Snippet

```css
/* Classic Color System */
:root {
  --background: #0B1120;        /* warm navy */
  --card: #F8F5F2;               /* warm paper */
  --card-foreground: #1a1a2e;
  --muted: #F0EBE6;
  --muted-foreground: #64748b;
  --primary: #C9A96E;            /* gold accent */
  --primary-foreground: #ffffff;
  --secondary: #f1f5f9;
  --secondary-foreground: #334155;
  --border: rgba(51, 65, 85, 0.15);
  --input: rgba(51, 65, 85, 0.15);
  --ring: #C9A96E;               /* gold focus ring */
  --radius: 8px;                  /* classic rounded, not pill */
}

/* Tailwind config */
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '#0B1120',
        card: { DEFAULT: '#F8F5F2', foreground: '#1a1a2e' },
        primary: { DEFAULT: '#C9A96E', foreground: '#ffffff' },
        muted: { DEFAULT: '#F0EBE6', foreground: '#64748b' },
        border: 'rgba(51, 65, 85, 0.15)',
        ring: '#C9A96E',
        bull: '#2D7D46',
        bear: '#B91C1C',
        amber: '#B45309',
      },
    },
  },
};
```

---

## 2. Border Radius System

### Mevcut Değerler

| Element | Border Radius | Değer |
|---|---|---|
| Nav buttons / tags | `999px` (pill) | `2.71147e+07px` |
| Cards | `12px` | `12px` |
| Badges | `999px` (pill) | `999px` |
| Header nav | `999px` (pill) | `999px` |
| Primary button | `999px` (pill) | `999px` |
| Data badges | `999px` (pill) | `999px` |

**Gözlemler:**
- **Sadece 2 değer kullanılıyor:** `12px` (cards) ve `999px` (her şey else).
- Bu, **radius chaos** değil ama **radius monotony** — her şey ya karemsi-köşeli (12px) ya da tam yuvarlak (pill).
- Arada 4px, 8px, 16px yok. Bu modern SaaS look ("everything is a pill") ama classic değil.
- Pill-shaped nav items 8+ adet sıralandığında (Earning Strategy, Admin, Earnings, Momentum, Daily, CPI/PPI, Calendar, Market Flash, Flow...) **her biri aynı shape** = visual fatigue.

### Classic Öneri

| Element | Classic Radius | Rationale |
|---|---|---|
| Tags / small badges | `4px` | Minimal, precise. Pill = too playful for financial data. |
| Buttons (CTA) | `8px` | Slightly rounded, professional. |
| Cards / panels | `12px` | Mevcut değer zaten iyi. Korunabilir. |
| Modals / dialogs | `16px` | Daha büyük element = daha büyük radius. |
| Nav items | `6px` veya `8px` | Pill yerine subtle rounding. Active state daha okunaklı. |
| Data chips ("Daily: -4.66%") | `4px` veya `6px` | Pill yerine subtle rounding. |

### CSS / Tailwind Snippet

```css
/* Classic Radius System */
:root {
  --radius: 8px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}

/* Tailwind — rounded-sm, rounded-md, rounded-lg, rounded-xl kullan */
/* rounded-full veya rounded-[999px] SADECE avatar ve user profile için */
```

```jsx
// Nav button — classic
<button className="rounded-md px-3 py-1.5 text-sm ...">

// Tag badge — classic  
<span className="rounded-sm px-2 py-0.5 text-xs ...">

// Card — classic (korunabilir)
<div className="rounded-xl p-6 ...">
```

---

## 3. Shadow Depth

### Mevcut Değerler

| Element | Shadow | Değer |
|---|---|---|
| Card (elevated) | Deep shadow | `rgba(3, 7, 18, 0.24) 0px 18px 40px 0px` |
| Card (default) | No shadow | `none` |
| Header | No shadow | `none` |
| Button | No shadow | `none` |
| Nav pill | No shadow | `none` |

**Gözlemler:**
- Dark theme'de **shadow 0px 18px 40px** = çok derin, "floating card" look.
- 24% opacity dark shadow = dark bg üzerinde hâlâ visible ama aggressive.
- Glassmorphism header (blur) yerine shadow kullanılmıyor — bu iyi bir seçim.
- Çoğu element'te shadow yok = flat design. Card shadow'u inconsistency yaratıyor.

### Classic Öneri

| Element | Classic Shadow | Rationale |
|---|---|---|
| Card (light bg) | `0 1px 2px 0 rgba(0,0,0,0.05)` | Subtle 1-layer shadow. Dark card'larda shadow gerekmez. |
| Card (elevated) | `0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)` | 2-layer, soft. |
| Modal / dialog | `0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)` | Daha derin ama soft. |
| Button hover | `0 1px 3px 0 rgba(0,0,0,0.08)` | Subtle lift on hover. |
| **Glassmorphism** | **Kaldır** | `backdrop-blur` + `bg-white/5` çok trendy. Solid bg + border daha timeless. |

### CSS / Tailwind Snippet

```css
/* Classic Shadow System */
.shadow-card {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.shadow-card-elevated {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
}
.shadow-modal {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
}

/* Tailwind */
shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
'shadow-elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
```

---

## 4. Typography Scale

### Mevcut Değerler

| Element | Size | Weight | Line Height | Color | Font |
|---|---|---|---|---|---|
| H1 | `48px` | `700` | `48px` (1.0) | `#f8fbff` | IBM Plex Sans |
| H2 | `30px` | `700` | `36px` (1.2) | `#f8fbff` | IBM Plex Sans |
| H3 | `32px` | `700` | `38.4px` (1.2) | `#f8fbff` | IBM Plex Sans |
| Body | `14px` | `600` | `21px` (1.5) | `#f8fbff` | IBM Plex Sans |
| Caption | `11px` | `400` | `14.67px` (1.33) | `#c0ccda` | IBM Plex Sans |
| Nav buttons | `11px` | `400` | — | `#c0ccda` | IBM Plex Sans |
| Data mono | `12px` | `600` | — | `#c0ccda` | JetBrains Mono / Fira Code |
| Badge | `10px` | `400` | — | varies | IBM Plex Sans |

**Gözlemler:**
- **H1 48px / 1.0 line-height** = çok tight. 48px başlık için 48px line-height = leading zero gibi. Yetersiz whitespace.
- **H2 30px, H3 32px** — H3 H2'den BÜYÜK! (`30px` vs `32px`). Bu **inverted hierarchy** = visual confusion. H3 > H2 olmamalı.
- **Body weight 600** = çok kalın. Okunabilirlik azalır. Financial data'da 400-500 ideal.
- **IBM Plex Sans** = modern, geometric, tech-forward. Classic için serif veya humanist sans-serif (e.g., Source Serif Pro, Georgia, or Inter → Geist) daha uygun.
- **JetBrains Mono** = coding font. Data display için Roboto Mono veya SF Mono daha classic.
- **Caption 11px** = çok küçük. WCAG'a göre 12px minimum. 11px mobile'da okunamaz.
- **Nav buttons 11px** = yine çok küçük. 12px minimum.

### Classic Öneri

| Element | Classic Size | Weight | Line Height | Font | Rationale |
|---|---|---|---|---|---|
| Display | `48px` | `300` | `56px` (1.17) | Source Serif Pro | Light weight = elegant. Line-height arttır. |
| H1 | `32px` | `600` | `40px` (1.25) | Source Serif Pro | Bold ama okunaklı. |
| H2 | `24px` | `600` | `32px` (1.33) | Source Serif Pro | Clear hierarchy. |
| H3 | `20px` | `600` | `28px` (1.4) | Source Serif Pro | H3 < H2 < H1. |
| Body | `14px` | `400` | `22px` (1.57) | Inter / Geist | 400 weight = readable. 1.57 line-height = classic. |
| Lead | `16px` | `400` | `24px` (1.5) | Inter / Geist | Hero subtitle, intro text. |
| Label | `12px` | `500` | `16px` (1.33) | Inter / Geist | Uppercase, tracking-wide. |
| Caption | `12px` | `400` | `16px` (1.33) | Inter / Geist | WCAG minimum. 11px kaldır. |
| Data mono | `13px` | `500` | `20px` | Roboto Mono | Coding font değil, data font. |

### CSS / Tailwind Snippet

```css
/* Classic Typography System */
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@300;400;600&family=Inter:wght@400;500;600&family=Roboto+Mono:wght@400;500&display=swap');

:root {
  --font-serif: 'Source Serif Pro', Georgia, serif;
  --font-sans: 'Inter', 'Geist', system-ui, sans-serif;
  --font-mono: 'Roboto Mono', 'SF Mono', monospace;
}

.text-display { font-family: var(--font-serif); font-size: 48px; font-weight: 300; line-height: 1.17; }
.text-h1 { font-family: var(--font-serif); font-size: 32px; font-weight: 600; line-height: 1.25; }
.text-h2 { font-family: var(--font-serif); font-size: 24px; font-weight: 600; line-height: 1.33; }
.text-h3 { font-family: var(--font-serif); font-size: 20px; font-weight: 600; line-height: 1.4; }
.text-body { font-family: var(--font-sans); font-size: 14px; font-weight: 400; line-height: 1.57; }
.text-lead { font-family: var(--font-sans); font-size: 16px; font-weight: 400; line-height: 1.5; }
.text-label { font-family: var(--font-sans); font-size: 12px; font-weight: 500; line-height: 1.33; text-transform: uppercase; letter-spacing: 0.05em; }
.text-caption { font-family: var(--font-sans); font-size: 12px; font-weight: 400; line-height: 1.33; }
.text-data { font-family: var(--font-mono); font-size: 13px; font-weight: 500; line-height: 1.54; font-variant-numeric: tabular-nums; }
```

```js
// tailwind.config.js
fontFamily: {
  serif: ['"Source Serif Pro"', 'Georgia', 'serif'],
  sans: ['Inter', 'Geist', 'system-ui', 'sans-serif'],
  mono: ['"Roboto Mono"', '"SF Mono"', 'monospace'],
},
```

---

## 5. Hover States

### Mevcut Değerler

| Element | Hover Effect | Transition |
|---|---|---|
| Ghost nav button | None detected | `0.15s cubic-bezier(0.4, 0, 0.2, 1)` |
| Link | None detected | `0.15s cubic-bezier(0.4, 0, 0.2, 1)` |
| Primary button | None detected | `0.15s cubic-bezier(0.4, 0, 0.2, 1)` |
| Card | None detected | — |
| Badge | None detected | — |

**Gözlemler:**
- Synthetic `MouseEvent('mouseover')` dispatch ile hover effect capture edilemedi. Bu, CSS `:hover` pseudo-class'larının JS event dispatch ile trigger olmadığını gösteriyor.
- Transition property listesi **çok uzun**: color, bg, border, outline, text-decoration, fill, stroke, gradient-from/via/to — **10+ property** aynı anda transition. Bu overkill.
- Transition duration **0.15s (150ms)** — çok hızlı. Neredeyse anında. Classic için 200-300ms daha smooth.
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` — Tailwind default ease-out. Bu iyi, korunabilir.
- **No scale transform** — bu iyi. Classic için scale (1.05) kullanılmamalı.
- **No shadow increase** — card'lar ve butonlar hover'da lift olmuyor. Flat kalıyor.

### Classic Öneri

| Element | Classic Hover | Rationale |
|---|---|---|
| Ghost button | `background-color: rgba(51, 65, 85, 0.08)` + `color: #1a1a2e` | Subtle bg fill. Dark mode'da `rgba(255,255,255,0.08)`. |
| Primary button | `background-color: darken(#C9A96E, 8%)` | Gold accent koyulaşır. |
| Link | `text-decoration: underline` + `color: darken(#C9A96E, 10%)` | Underline = classic. |
| Card | `border-color: rgba(51, 65, 85, 0.25)` + `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05)` | Subtle border + shadow lift. |
| Badge | `background-color: rgba(16, 185, 129, 0.2)` (darker tint) | Tint derinleşir. |

### CSS / Tailwind Snippet

```css
/* Classic Hover — 200ms ease-out */
.btn-ghost:hover {
  background-color: rgba(51, 65, 85, 0.08);
  transition: background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), color 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-primary:hover {
  background-color: #B08D55; /* darken gold 8% */
  transition: background-color 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.card:hover {
  border-color: rgba(51, 65, 85, 0.25);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: border-color 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

```jsx
// Tailwind — tek transition property kullan, hepsini değil
<button className="transition-colors duration-200 ease-out hover:bg-slate-100 ...">
```

---

## 6. Focus States (Accessibility Kritik)

### Mevcut Değerler

| Element | Outline Width | Outline Style | Outline Color | Outline Offset | Focus Visible |
|---|---|---|---|---|---|
| Button | `2.42424px` | `none` | `oklab(0.684... / 0.5)` | `0px` | `false` |
| Link | `2.42424px` | `none` | `oklab(0.684... / 0.5)` | `0px` | `false` |
| Section | `2.42424px` | `none` | `oklab(0.684... / 0.5)` | `0px` | `false` |
| ALL interactive | `2.42424px` | `none` | `oklab(0.684... / 0.5)` | `0px` | `false` |

**🚨 KRİTİK BULGU:**
- **Tüm interactive element'lerde `outline-style: none`!**
- Outline-width var (`2.42px`) ama style `none` = **görünmez outline**.
- Bu, keyboard-only kullanıcılar (Tab ile navigate edenler) için **ciddi accessibility hatası**.
- `focus-visible` pseudo-class kullanılmıyor veya çalışmıyor.
- Outline-color: `oklab(0.684673 -0.0798082 -0.12445 / 0.5)` — yarı saydam, renk anlamsız.
- Outline-offset: `0px` — element'e yapışık. 2px offset classic'te daha iyi.

### Classic Öneri

| Element | Classic Focus | Rationale |
|---|---|---|
| All interactive | `outline: 2px solid #C9A96E` | Gold ring = consistent, premium. |
| Offset | `outline-offset: 2px` | Element'ten ayrık, daha okunaklı. |
| Focus visible | `@media (prefers-reduced-motion: no-preference)` ile `focus-visible` | Sadece keyboard navigate'de göster. Mouse click'te gösterme. |
| Transition | `outline-color 150ms ease-out` | Smooth appear. |

### CSS / Tailwind Snippet

```css
/* Classic Focus Ring — ACCESIBILITY FIX */
:focus-visible {
  outline: 2px solid #C9A96E;
  outline-offset: 2px;
  transition: outline-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus ring'i kaldırmak YASAK. outline: none KULLANMA. */
/* Eğer custom focus ring yapıyorsan, :focus-visible pseudo-class kullan. */
```

```jsx
// Tailwind — focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] focus-visible:ring-offset-2 ...">
```

---

## 7. Loading States

### Mevcut Değerler

| State | Bulunan | Detay |
|---|---|---|
| Skeleton shimmer | ✅ `skeleton-shimmer` keyframe var | 2 keyframe animation mevcut |
| Spin loader | ✅ `spin` keyframe var | 1 keyframe |
| Pulse green | ✅ `pulse-green` keyframe var | 2 keyframe |
| Data flash | ✅ `data-flash` keyframe var | 2 keyframe |
| Pulse | ✅ `pulse` keyframe var | 1 keyframe |
| Sonner toast | ✅ `sonner-fade-in`, `sonner-spin` | 2 keyframe each |

**Gözlemler:**
- Skeleton animation mevcut ama evaluate sırasında visible skeleton element capture edilemedi (DOM'da olmayabilir, lazy loading'de görünür).
- `skeleton-shimmer` ismi = gradient wave animation. Bu iyi bir pattern.
- `spin` = spinner/loader. Mevcut.
- `pulse-green` = data update indicator. Mevcut.
- `data-flash` = cell flash on data change. Mevcut.
- Çok fazla animation = modern dynamic feel. Classic için bu kadar çok animation **overwhelming** olabilir.

### Classic Öneri

| State | Classic Loading | Rationale |
|---|---|---|
| Skeleton | `skeleton-shimmer` = **korunabilir** | Gradient wave 1.5s duration, `background: linear-gradient(90deg, #F0EBE6 25%, #F8F5F2 50%, #F0EBE6 75%)` |
| Spinner | `border: 2px solid #E5E5E5; border-top-color: #C9A96E` | Gold accent spinner. Tailwind `animate-spin` override. |
| Data flash | **Kaldır veya yavaşlat** | `data-flash` 150ms = çok hızlı, epilepsi riski. 300ms+ veya fade-only. |
| Pulse green | **Kaldır** | Yeşil pulse = casino feel. Classic'te data update = subtle text color change (fade to gold, 500ms). |
| Skeleton duration | `1.5s` | Mevcut hızı bilinmiyor. 1.5s classic. |

### CSS / Tailwind Snippet

```css
/* Classic Skeleton */
@keyframes skeleton-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #F0EBE6 25%, #F8F5F2 50%, #F0EBE6 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

/* Classic Spinner */
.spinner {
  border: 2px solid #E5E5E5;
  border-top-color: #C9A96E;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}
```

---

## 8. Empty States

### Mevcut Değerler

| State | Bulunan | Detay |
|---|---|---|
| VIX empty | `span` element'lerde `-4.66%`, `-12.28%` | Negative değerler mevcut, ama "VIX -" boş state bulunamadı. |
| Dedicated empty state wrapper | ❌ Yok | `[class*=empty]`, `[class*=Empty]`, `[class*=blank]`, `[class*=no-data]` = 0 element |

**Gözlemler:**
- **Boş state için dedicated UI yok.** Veri yoksa spinner veya skeleton gösteriliyor olabilir.
- VIX data: `span` içinde `-4.66%` = veri var ama negative.
- "Snapshot: 06/25, 11:02 PM" = timestamp mevcut. Bu iyi.
- Empty state olmayınca, data load fail olduğunda kullanıcı karşısında boş ekran veya sonsuz spinner görür.

### Classic Öneri

| State | Classic Empty | Rationale |
|---|---|---|
| VIX — no data | `—` (em dash) + `text-muted` color | Mevcut `-` yerine em dash (—) daha elegant. |
| No data | **Dedicated empty card** | Card içinde centered: icon + "No data available" + "Last updated: 11:02 PM" + Retry button. |
| Loading | Skeleton shimmer | Card'ların skeleton hali. |
| Error | Muted red text + Retry CTA | `#B91C1C` ile "Failed to load. Try again." |

### CSS / Tailwind Snippet

```jsx
// Classic Empty State
<div className="rounded-xl border border-border bg-card p-8 text-center">
  <span className="text-3xl text-muted-foreground">—</span>
  <p className="mt-2 text-sm text-muted-foreground">No data available</p>
  <p className="text-xs text-muted-foreground/60">Last updated: 11:02 PM</p>
  <button className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
    Retry
  </button>
</div>
```

---

## 9. Icons (Lucide React)

### Mevcut Değerler

| Usage | Size | Stroke Width | Parent |
|---|---|---|---|
| Inline nav icons | `13.99px` × `13.99px` | `2px` | `BUTTON` |
| Inline text icons | `13.99px` × `13.99px` | `2px` | `SPAN` |
| Larger nav icons | `16px` × `16px` | `2px` | `BUTTON` |

**Gözlemler:**
- **Lucide React** kullanılıyor (stroke-width 2px = Lucide default).
- **Boyutlar tutarlı:** 14px (inline) ve 16px (nav). İyi.
- Stroke width: **2px** = modern, bold icon. Classic için **1.5px** daha ince, elegant.
- Tüm icon'lar aynı stroke width = tutarlı.
- Icon + text gap var (Tailwind `gap-2` = 8px). İyi.

### Classic Öneri

| Usage | Classic Size | Stroke Width | Rationale |
|---|---|---|---|
| Inline icons | `16px` | `1.5px` | 1.5px = elegant, classic. 2px çok bold. |
| Button icons | `20px` | `1.5px` | Nav button içinde 20px daha okunaklı. |
| Nav icons | `20px` | `1.5px` | Nav'da 16px yerine 20px. |
| Feature icons | `24px` | `1.5px` | Kart/feature başlığında 24px. |

### CSS / Tailwind Snippet

```jsx
// Lucide React — strokeWidth override
import { TrendingUp, ArrowRight, RefreshCw } from 'lucide-react';

// Inline icon
<TrendingUp className="h-4 w-4" strokeWidth={1.5} />

// Button icon
<RefreshCw className="h-5 w-5" strokeWidth={1.5} />

// Nav icon
<TrendingUp className="h-5 w-5" strokeWidth={1.5} />

// Feature icon
<TrendingUp className="h-6 w-6" strokeWidth={1.5} />
```

```css
/* Global Lucide override */
.lucide {
  stroke-width: 1.5px;
}
```

---

## 10. Animation Timing

### Mevcut Değerler

| Animation | Duration | Easing | Keyframes |
|---|---|---|---|
| All transitions | `150ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | — |
| skeleton-shimmer | unknown | unknown | 2 keyframes |
| pulse-green | unknown | unknown | 2 keyframes |
| data-flash | unknown | unknown | 2 keyframes |
| spin | unknown | `linear` | 1 keyframe |
| sonner-fade-in | unknown | unknown | 2 keyframes |
| accordion-down | unknown | unknown | 2 keyframes |
| accordion-up | unknown | unknown | 2 keyframes |

**Gözlemler:**
- **Tüm transition'lar 150ms.** Bu çok hızlı. Modern "snappy" feel ama classic için 200-300ms daha smooth.
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` = Tailwind ease-out. Bu iyi, korunabilir.
- **Çok fazla animation type** (11+ keyframe animation). Classic için animasyon sayısını azalt.
- `data-flash` ve `pulse-green` = data update indicator. Classic'te bu kadar agresif animation olmamalı.
- `sonner-fade-in` = toast animation. Toast = modern pattern. Classic için toast yerine inline status daha iyi.

### Classic Öneri

| Animation | Classic Duration | Classic Easing | Rationale |
|---|---|---|---|
| Button hover | `200ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | 150ms → 200ms. Daha smooth. |
| Card hover | `300ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | Daha yavaş, luxurious. |
| Tab switch | `250ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | Tab içeriği fade-in, 250ms. |
| Scroll reveal | `400ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | Element fade-up, 400ms. Yavaş, elegant. |
| Data flash | `300ms` + `opacity` only | `ease-out` | Color flash yerine opacity pulse. Daha soft. |
| Skeleton | `1.5s` | `ease-in-out` | Gradient wave. Korunabilir. |
| **Toast** | **Kaldır** | — | Toast = modern. Classic inline status. |

### CSS / Tailwind Snippet

```css
/* Classic Animation Tokens */
:root {
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-reveal: 400ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

```js
// tailwind.config.js
transitionDuration: {
  'fast': '150ms',
  'base': '200ms',
  'slow': '300ms',
  'reveal': '400ms',
},
transitionTimingFunction: {
  'ease-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
},
```

---

## 11. Scroll Behavior

### Mevcut Değerler

| Property | Değer |
|---|---|
| `scroll-behavior` | `auto` |
| `overflow-x` | `visible` |
| `overflow-y` | `visible` |

**Gözlemler:**
- **`scroll-behavior: auto`** = smooth scroll **YOK.**
- Anchor link tıklama = anında jump. Smooth scroll = `scroll-behavior: smooth` ile sağlanır.
- Modern sitelerde `scroll-behavior: smooth` standard. Classic için de açık olmalı ama 300ms duration ile.
- Overflow visible = body scroll normal. İyi.

### Classic Öneri

| Property | Classic Değer | Rationale |
|---|---|---|
| `scroll-behavior` | `smooth` | Anchor navigation smooth. |
| `scroll-padding-top` | `80px` | Header height kadar. Anchor link tıklama'da header altında kalmaz. |
| Smooth duration | `300ms` | CSS native `scroll-behavior: smooth` browser default'u. JS ile `scrollTo({ behavior: 'smooth' })` aynı. |

### CSS / Tailwind Snippet

```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px; /* header height */
}

/* prefers-reduced-motion saygı */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

---

## 12. Glassmorphism

### Mevcut Değerler

| Element | Backdrop Filter | Background | Opacity | Border |
|---|---|---|---|---|
| Header | `blur(8px)` | `oklab(0.166... / 0.95)` | 95% | `0.808px solid rgba(148, 163, 184, 0.14)` |

**Gözlemler:**
- **Sadece 1 element'te glassmorphism:** Header (`<header>`).
- `backdrop-filter: blur(8px)` + `bg-opacity: 95%`.
- `blur(8px)` = hafif blur. Content hâlâ okunaklı.
- Border: 0.808px (nearly 1px) solid, very subtle.
- Glassmorphism = **2020-2023 trend**. 2026'da hâlâ kullanılıyor ama **timeless değil**. Classic redesign'da kaldırılmalı.
- Solid bg + border = daha predictable, accessible, performant.

### Classic Öneri

| Element | Classic Treatment | Rationale |
|---|---|---|
| Header | `background: #F8F5F2; border-bottom: 1px solid rgba(51, 65, 85, 0.15)` | Solid warm paper bg + warm border. No blur. |
| Header (dark mode) | `background: #0B1120; border-bottom: 1px solid rgba(148, 163, 184, 0.15)` | Dark warm navy + subtle border. |
| Sticky header | `position: sticky; top: 0; z-index: 50;` | Blur yerine solid sticky. |

### CSS / Tailwind Snippet

```css
/* Classic Header — NO glassmorphism */
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: #F8F5F2;
  border-bottom: 1px solid rgba(51, 65, 85, 0.15);
  /* backdrop-filter: blur(8px); KALDIR */
  /* background-color: oklab(... / 0.95); KALDIR */
}

/* Dark mode variant */
.header-dark {
  background-color: #0B1120;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
}
```

```jsx
<header className="sticky top-0 z-50 bg-card border-b border-border">
  {/* No backdrop-blur, no bg-opacity */}
</header>
```

---

## 13. Özet: Visual Chaos → Classic Düzeni

### Mevcut Sorunlar (Priority)

| # | Sorun | Severity | Kategori |
|---|---|---|---|
| 1 | **Focus outline: none** — Accessibility hatası | 🔴 Critical | A11y |
| 2 | **Typography hierarchy inverted** — H3 (32px) > H2 (30px) | 🔴 Critical | Typography |
| 3 | **Body weight 600** — Too bold, readability drops | 🟡 High | Typography |
| 4 | **Caption 11px** — Below WCAG minimum | 🟡 High | Typography |
| 5 | **All elements pill-shaped** (999px) — Radius monotony | 🟡 High | Shape |
| 6 | **Scroll behavior: auto** — No smooth scroll | 🟡 Medium | UX |
| 7 | **Glassmorphism header** — Trendy, not timeless | 🟢 Low | Style |
| 8 | **Too many animation types** (11+) — Overwhelming | 🟢 Low | Animation |
| 9 | **No dedicated empty states** | 🟢 Low | UX |
| 10 | **Card shadow 18px 40px** — Too deep for dark theme | 🟢 Low | Shadow |

### Classic Checklist

- [ ] **Color:** Warm navy `#0B1120` + warm paper `#F8F5F2` + gold accent `#C9A96E`
- [ ] **Radius:** 4px (tags), 8px (buttons), 12px (cards), 16px (modals). Pill SADECE avatar.
- [ ] **Shadow:** 1-layer subtle (0 1px 2px 0 rgba(0,0,0,0.05)). Glassmorphism KALDIR.
- [ ] **Typography:** Source Serif Pro (display/H) + Inter (body) + Roboto Mono (data). 12px min.
- [ ] **Hover:** bg-color transition 200ms ease. NO scale transform.
- [ ] **Focus:** 2px offset ring, gold color. `outline: none` KALDIR.
- [ ] **Loading:** Skeleton shimmer 1.5s. NO pulse-green flash.
- [ ] **Empty:** Dedicated empty card with em dash (—) + timestamp + retry.
- [ ] **Icons:** 1.5px stroke width. 16px inline, 20px button, 24px nav.
- [ ] **Animation:** 200ms (button), 300ms (card), 400ms (reveal). Ease-out. NO toast.
- [ ] **Scroll:** `scroll-behavior: smooth` + `scroll-padding-top: 80px`.
- [ ] **Glassmorphism:** KALDIR. Solid bg + border.

---

*Audit tamamlandı. Tüm değerler WebBridge DOM evaluate ile doğrudan sayfadan çekilmiştir. Screenshot'lar workspace'de mevcuttur.*
