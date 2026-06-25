# GISTIFY REDESIGN — MASTER PROMPT
## "AI-üretimi generic template" hissini sil, özgün profesyonel finans platformuna dönüştür

---

## 0. SANA NE VERİLDİĞİ VE NE BEKLENDİĞİ

Sen kıdemli bir frontend mühendisi + product designer'sın. Önünde çalışan ama
görsel ve mimari olarak "yapay zeka tarafından üretilmiş generic shadcn/ui
template" hissi veren bir kod tabanı var: **Gistify** — earnings/momentum
intelligence platformu.

**Stack:** React 19 + Vite + Tailwind CSS 4 + shadcn/ui + Express + TypeScript.
**Ölçek:** 360 dosya, 101.579+ satır.

**Senden beklenen:** Fonksiyonu BOZMADAN, görsel kimliği sıfırdan kurmak ve
"uydurukluk" hissinin somut kaynaklarını tek tek temizlemek. Bu bir yeniden
boyama değil — sistematik bir kimlik operasyonu.

**ÇALIŞMA DİSİPLİNİ (her adımda zorunlu):**
1. Önce ilgili dosyaları OKU. Tahminle değiştirme.
2. Her değişiklikten sonra `build` çalıştır + smoke test. Kırık bırakma.
3. Atomik commit/PR. Her görev kendi commit'i.
4. Değişiklik öncesi/sonrası diff'i bana göster, onay al, sonra devam et.
5. Asla "şuna benzer bir şey yaptım" deme — gerçek dosyada, gerçek satırda çalış.

---

## 1. NEDEN "UYDURUK" HİSSEDİYOR — KÖK SEBEP ANALİZİ

Bu his rastgele değil. Kodda ölçülmüş karşılıkları var. Düzeltmen gereken tam
olarak bunlar:

| Belirti | Kod karşılığı | Neden "AI-üretimi" sinyali |
|---|---|---|
| Kutu içinde kutu | `border-border` **570 kez** | Hierarchy boşlukla değil border'la kurulmuş → "boxy" |
| Soluk, kimliksiz | `text-muted-foreground` **695 kez** | shadcn default text rengi her yerde |
| Sahte "premium" | `gradient` **78 kez** | Neredeyse aynı 3-4 gradient her karta kopyalanmış |
| Ağır gölge enflasyonu | `shadow-2xl` **28 kez** | Her kart "havada uçuyor" → gerçek hierarchy yok |
| Tutarsız radius | `rounded-2xl` 107x + `rounded-3xl` 13x | Tek karar yok → dağınık |
| Tutarsız spacing | `p-4` 295x, `p-5` 104x, `p-6` 110x | 4px grid yok, ara değerler (p-5=20px) kirlilik |
| Kimliksiz accent | Indigo `#6366f1` | shadcn'nin BİREBİR default accent rengi = imza |
| Generic ikon | 66 lucide import, özel set yok | TradingView/Robinhood'un kendi ikon dili var, burada yok |
| Kopyala-yapıştır | 15+ aynı loading/empty state | "Üretilmiş" hissinin en görünür kanıtı |
| Abartılı jargon | `aiCatalystAnalyzer`, `trainedModel`, `tactical-card`, `browserTrainer`, `regimeDetector`, `microstructureCheck`, `varEngine`, `pdtAnalyzer` | İsim beklenti şişiriyor, içerik basit → hayal kırıklığı |

**Tasarım felsen (her karar bu süzgeçten geçecek):**
> Profesyonel trading terminali yoğunluğu (Bloomberg / TradingView) +
> modern fintech disiplini (Linear / Robinhood temizliği).
> **ALAN > KUTU. Boşluk ve tipografi hierarchy kurar, border değil.**

---

## 2. ADIM ADIM GÖREVLER (bu sırayla teslim et)

### ━━━ GÖREV 1: DESIGN TOKEN SİSTEMİ (temel — önce bu) ━━━

Her şeyin tek kaynaktan beslendiği token katmanı kur. `tailwind.config` +
`src/styles/tokens.css` (veya Tailwind 4 `@theme` bloğu).

**1a — Accent rengini değiştir (en hızlı görsel etki):**
Indigo `#6366f1`'i TAMAMEN kaldır. Yeni accent: **Sky #0ea5e9 (soğuk/teknik)**.
- `--accent: #0ea5e9`
- `--accent-hover: #0284c7` (sky-600)
- `--accent-active: #0369a1` (sky-700)
- `--accent-subtle: rgba(14,165,233,0.12)` (focus ring / hover bg için)
Kod tabanını grep'le: `#6366f1`, `indigo`, `--color-accent` geçen HER yeri yeni
token'la değiştir. Hardcoded indigo bırakma.

**1b — Yüzey sistemi (gradient enflasyonunu bitir):**
78 dağınık gradient yerine 3 katmanlı SOLID yüzey. Gradient artık sadece istisna
(yalnızca landing hero ve sayfada öne çıkan TEK kart).
- `--surface-base: #0a0e1a` (sayfa zemini)
- `--surface-raised: #111827` (kartlar)
- `--surface-overlay: #1a2235` (dialog, popover, tooltip, dropdown)
Net kontrast farkı olsun — katmanlar gözle ayrışsın. `tactical-card` ve
`workspace-panel` gradient'lerini bu solid yüzeylerle değiştir.

**1c — Spacing 4px grid'e kilitle:**
İzin verilen TEK scale: `4 / 8 / 12 / 16 / 24 / 32 / 48`.
Kod tabanında `p-5`, `gap-5`, `space-y-5`, `m-5` gibi ara (20px) değerleri
grep'le ve en yakın grid değerine çevir (genelde `p-4` veya `p-6`). 104 adet
`p-5` kullanımı var — hepsini temizle.

**1d — Border radius tek değer:**
Globalde **12px** (`--radius: 0.75rem`). `rounded-2xl` (16px) ve `rounded-3xl`
(24px) karmaşasını bitir — özel istisna gerekmedikçe hepsi `--radius`'a insin.

**1e — Bull/Bear colorblind-safe:**
Yeşil/kırmızı YALNIZ renk OLAMAZ. Bir `<Delta value={} />` componenti yap:
daima **ok (↑/↓) + renk + işaret** birlikte. 
- Bull: `#10b981` + `↑`
- Bear: `#ef4444` + `↓`
Fiyat/yüzde gösterilen HER yerde bu componenti kullan. Çıplak renkli sayı bırakma.

**1f — Kontrast (WCAG AA):**
`text-muted-foreground` (#94a3b8) + kart zemini kombinasyonu **4.5:1** geçsin.
Geçmeyen tüm muted text tonlarını bir tık aç. Test et, raporla.

---

### ━━━ GÖREV 2: shadcn BİLEŞENLERİNİ MARKALAŞTIR (53 dosya) ━━━

Factory-default'u kır. Tek tek değil, bileşen şablonu üzerinden — her kullanım
otomatik markaya uysun.

- **Card:** Tek shadow stratejisi → SADECE `surface-raised` kartta hafif shadow,
  base'de YOK. Border yerine yüzey kontrastı kullan (570 border'ı buradan kır).
  Hover: `translateY(-2px)` + subtle shadow, 200ms ease.
- **Button:** primary/secondary/ghost'u accent'e göre yeniden tanımla.
  primary = sky dolu; secondary = surface-overlay + ince kenar; ghost = şeffaf.
  Click feedback: `scale(0.98)` 120ms.
- **Dialog / Sheet:** Özel overlay (backdrop-blur + düşük opacity, ~0.6),
  giriş animasyonu 200ms fade + 8px slide.
- **Input / Select:** Focus ring = `--accent`, 2px + 2px offset. `--accent-subtle`
  hover zemini.
- **Tooltip / Popover / Dropdown:** `surface-overlay` zemin, monospace değerler.
- **Skeleton:** Shimmer animasyonlu (aşağıda Görev 3'te kullanacaksın).

---

### ━━━ GÖREV 3: KOPYALA-YAPIŞTIR PATTERN'LERİ TEK COMPONENT'E İNDİR ━━━

"Üretilmiş" hissini en hızlı silen müdahale. Şu an her tab'ta tekrarlanan bu blok:
```tsx
<div className="px-4 py-8">
  <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-card/95 p-6 shadow-2xl">
    <h2 className="text-lg font-semibold">Yukleniyor...</h2>
  </div>
</div>
```
15+ yerde birebir kopya. Bunları sil:

- **`<LoadingState />`** — tek component, Skeleton shimmer'lı. Tüm "Yukleniyor..."
  bloklarını bununla değiştir.
- **`<EmptyState icon title description action />`** — illüstrasyon/ikon +
  açıklama + CTA. Tüm boş durumlar buna geçsin.
- **`<AdminPanel config={} />`** — şu 4 panel birebir aynı yapı (table+form+button):
  `DailyReportAdminPanel.tsx`, `MomentumReportAdminPanel.tsx`,
  `WeeklyReportAdminPanel.tsx`, `OpenAiImageAdminPanel.tsx`.
  Tek generic `AdminPanel` + config objesi ile birleştir.

---

### ━━━ GÖREV 4: GRAFİKLER — "generic recharts" hissini kır ━━━

32 recharts importu var, hepsi default temalı = aynı görünüm. Düzelt:

- **Tek chart tema dosyası** (`src/lib/chartTheme.ts`): accent renkleri, grid
  opacity, font (JetBrains Mono değerlerde), tooltip stili — tek yerden. Her
  recharts bu temayı alsın.
- **Tooltip'leri markala:** `surface-overlay` zemin + monospace + `<Delta>` ile
  renk/ok.
- **Etkileşim:** Data-heavy chart'lara crosshair / hover-line ekle. Recharts ile
  zorlanırsan, ağır chart'lar için **TradingView Lightweight Charts**'a geçişi
  öner (ama önce recharts'ı düzelt, sonra öner).
- **Maliyet:** `dailyReportOpenAiCharts.ts` chart üretimi için OpenAI kullanıyor —
  bu pahalı ve gereksiz. Client-side recharts'a taşı.
- **a11y:** Her chart'a `aria-label` / alt-text.

---

### ━━━ GÖREV 5: MOBILE (şu an navigation YOK) ━━━

`WorkspaceNavigation` mobilde `hidden md:flex` → mobil kullanıcı menüye
erişemiyor. `useMobile.tsx` hook'u var ama az kullanılmış.

- **Bottom navigation** (5 ana item) veya hamburger menü ekle.
- **Touch target min 44px.** `px-3 py-1.5` butonları büyüt.
- **Tablolar → mobilde stacked card layout** (yatay scroll'u bitir).
- **Font:** `text-xs` (11px) mobilde min 14px. `clamp()` ile responsive scale.

---

### ━━━ GÖREV 6: LANDING PAGE ━━━

Şu an "yeni/boş site" hissi veriyor.

- Generic "Earnings Intelligence Platform" başlığını NET değer önerisiyle değiştir.
- Hero'ya gerçek app screenshot / interaktif preview koy (boş hero = güvensizlik).
- Trust signal alanı: kullanıcı sayısı / yorum / logo grid. Gerçek veri varsa onu,
  yoksa yapısını kur (placeholder component) — sonra doldurursun.
- CTA netliği: ücretsiz (Flow) vs ücretli (abonelik) ayrımı görsel olarak net olsun.

---

### ━━━ GÖREV 7: "AI JARGON" TEMİZLİĞİ (kimlik, görsel değil) ━━━

Abartılı isimler beklenti şişiriyor, içerik basit kalınca "uyduruk" hissi katıyor.

- Yeniden adlandır: `aiCatalystAnalyzer`→`CatalystAnalyzer`,
  `trainedModel.ts`→`signalModel.ts`, `tactical-card`→`data-card`,
  `tactical-grid`→`data-grid`, `workspace-panel`→`panel`.
- Kullanılmayan scanner dosyalarını SİL (`browserTrainer`, `regimeDetector`,
  `microstructureCheck`, `varEngine`, `pdtAnalyzer` — gerçekten kullanılmıyorsa).
- Aktif olanların adını işlevine sadık ve sade tut.

---

### ━━━ GÖREV 8: ÖLÜ BAĞIMLILIK + framer-motion ━━━

- `axios` — kullanılmıyorsa kaldır.
- `framer-motion` — yüklü ama import 0. İki seçenek: ya tab/page geçişleri için
  AKTİF ET (tercih edilen — `AnimatePresence`, 200ms fade+slide), ya da kaldır.
- `streamdown`, gereksiz `pnpm`/`add` devDependency'lerini gözden geçir.

---

## 3. KESİN KISITLAR (İHLAL ETME)

- **Fonksiyonu bozma.** Her commit sonrası build + smoke test geçsin.
- **God-component refaktörü BU TURDA YOK.** `App.tsx` (1.478 satır) ve
  `server/index.ts` (4.199 satır) çok riskli — onlara YALNIZ görsel/token
  değişikliği için dokun, mimari bölme YAPMA. (Mimari refaktör ayrı bir görevdir,
  bu prompt'un kapsamı dışında. Karıştırma.)
- **Atomik PR.** Token → bileşen → pattern → chart → mobile → landing → jargon →
  deps. Her biri ayrı, gözden geçirilebilir.
- **Runtime DOM translation'a dokunma** (2.055 `copy()` çağrısı + App.tsx'teki
  300 satır i18n) — bu görsel iş değil, ayrı bir migration. Bu turda bırak.
- **Hardcoded değer bırakma.** Renk/spacing/radius her zaman token'dan gelsin.

---

## 4. TESLİM SIRASI VE ONAY DÖNGÜSÜ

1. **Görev 1** — Token sistemi + sky accent (en yüksek görsel etki)
2. **Görev 2** — Card / Button / Dialog / Input / Skeleton markalaştırma
3. **Görev 3** — LoadingState / EmptyState / AdminPanel birleştirme
4. **Görev 4** — Chart tema dosyası
5. **Görev 5** — Mobile navigation + touch targets
6. **Görev 6** — Landing hero + trust signals
7. **Görev 7** — Jargon temizliği
8. **Görev 8** — Dead deps + framer-motion

**Her görevin sonunda:**
- Hangi dosyaları, hangi satırları değiştirdiğini özetle.
- Önce/sonra diff (mümkünse ekran görüntüsü).
- "Build + smoke test geçti" doğrulaması.
- DUR, onayımı bekle, sonra bir sonraki göreve geç.

---

## 5. BAŞARI KRİTERİ

İş bittiğinde şunlar doğru olmalı:
- Kod tabanında hardcoded `#6366f1` / `indigo` = 0.
- `p-5` / `rounded-2xl` / `rounded-3xl` rastgele kullanımı temizlenmiş.
- `border-border` kullanımı en az %50 azalmış (boşlukla hierarchy).
- Tek `<LoadingState>`, tek `<EmptyState>`, tek `<AdminPanel>`.
- Tüm chart'lar tek temadan besleniyor.
- Mobilde gezilebilir (bottom nav + 44px+ touch).
- Bull/bear her yerde ok+renk (`<Delta>`).
- Hiçbir build hatası, hiçbir kırık sayfa yok.

Sonuç: kullanıcının "AI uydurukluğu" dediği his yerine **özgün, sıkı, güvenilir
bir finansal terminal** hissi.
