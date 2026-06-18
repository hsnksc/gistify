# Gistify /flow — Tam Eksiksiz Web App Geliştirme Promptu (GPT için)

> Bu dosyayı bir AI kod asistanına (ChatGPT / Claude / Cursor / v0 vb.) baştan sona vereceksin.
> Amaç: `gistify.pro/flow` sayfasını, çoklu yapay zeka modeli (ChatGPT, Claude, Gemini, Grok)
> yanıtlarını karşılaştıran, "müthiş" bir kullanıcı deneyimine sahip bir web uygulamasına dönüştürmek.
> AYRICA: kullanıcının günlük olarak hisse hisse yükleyeceği tek dosya HTML analiz raporlarını
> otomatik parse edip güvenli biçimde yayınlayan bir rapor modülü içerecek (bkz. Bölüm 9.5).
> Mevcut teknik temel: React 18 + Vite + Tailwind CSS v4 + koyu tema (OKLCH renk paleti).
> Promptu adım adım, sırayla uygula. Her adımın sonunda ürettiğin kodu doğrula, sonra bir sonrakine geç.

---

## 0. ROL VE BAĞLAM (Bunu önce oku, sonra başla)

Sen kıdemli bir frontend mühendisi ve ürün tasarımcısısın. Hem React + TypeScript mimarisi
kurabilir, hem de bilgi yoğun (information-dense) karşılaştırma arayüzlerinde dünya standardında
UX kararları alabilirsin. İşin: aşağıdaki spesifikasyona göre `/flow` sayfasını sıfırdan, üretime
hazır kalitede inşa etmek.

**Ürünün özü:** Kullanıcı tek bir prompt yazar, birden fazla yapay zeka modeli (ChatGPT, Claude,
Gemini, Grok) aynı anda yanıt üretir, kullanıcı bu yanıtları yan yana karşılaştırır. Bu nedenle
ekranın kalbi "çoklu sütun karşılaştırma" deneyimidir. Her tasarım kararını şu soruyla test et:
*"Bu, iki yanıtı yan yana karşılaştırmayı kolaylaştırıyor mu?"*

**Çalışma kuralları:**
- TypeScript kullan, `any` tipinden kaçın.
- Mevcut stack'i koru: React 18, Vite, Tailwind CSS v4, koyu tema varsayılan.
- Her bileşeni erişilebilir (WCAG 2.1 AA) ve responsive olarak üret.
- Kod bloklarını dosya dosya ver; hangi dosyaya ne yazılacağını açıkça belirt.
- Mock veri / mock streaming ile çalışan bir demo üret; gerçek API anahtarı isteme.
- Her adım sonunda "Bu adımda ne yaptım / sıradaki adım ne" diye 2 cümlelik özet yaz.

---

## 1. TEKNOLOJİ STACK VE PROJE KURULUMU

Aşağıdaki stack ile başla:

- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Stil:** Tailwind CSS v4.1.x (utility-first), koyu tema varsayılan
- **Routing:** React Router v6 (`/flow` ana rota)
- **State:** Zustand (hafif, global karşılaştırma state'i için) + React local state
- **Animasyon:** Framer Motion (mikro etkileşimler ve skeleton shimmer için)
- **İkonlar:** lucide-react
- **Markdown render:** react-markdown + remark-gfm
- **Syntax highlight:** Shiki veya highlight.js (koyu tema uyumlu)
- **Diff:** `diff` paketi (kelime düzeyi karşılaştırma için)

Proje iskeletini, klasör yapısını ve `package.json` bağımlılıklarını üret. Klasör yapısı:

```
src/
  components/        # tekrar kullanılabilir UI
    ModelColumn/
    PromptComposer/
    ModelSelector/
    SkeletonLoader/
    CopyButton/
    CodeBlock/
    DiffView/
  pages/
    FlowPage.tsx
  store/
    useFlowStore.ts
  lib/
    mockModels.ts     # sahte streaming yanıt üretici
    theme.ts
  styles/
    tokens.css        # tasarım token'ları
  App.tsx
  main.tsx
```

---

## 2. TASARIM SİSTEMİ (Token'lar — bunlara harfiyen uy)

`src/styles/tokens.css` içine aşağıdaki tasarım token'larını CSS değişkeni olarak tanımla.
Bunlar mevcut sitenin paletidir; renk tutarlılığı için DEĞİŞTİRME.

```css
:root {
  /* Arka planlar (koyu tema, katmanlı) */
  --color-bg-base: #0a0e1a;       /* ana arka plan */
  --color-bg-elevated: #111827;   /* yükseltilmiş kartlar */
  --color-bg-surface: #1a2235;    /* yüzeyler */
  --color-bg-overlay: #232d42;    /* overlay / hover */

  /* Metin */
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-text-tertiary: #64748b;

  /* Anlamsal renkler */
  --color-bull: #10b981;     /* pozitif / başarı */
  --color-bear: #ef4444;     /* negatif / hata */
  --color-caution: #f59e0b;  /* uyarı */
  --color-info: #3b82f6;     /* bilgi */
  --color-accent: #6366f1;   /* vurgu / birincil aksiyon */

  /* Tipografi */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-display: 'Barlow Condensed', sans-serif;

  /* Spacing birimi: 4px tabanlı (Tailwind ile uyumlu) */
  --radius-card: 0.75rem;
  --radius-sm: 0.375rem;
}
```

**Font kuralı:** `font-display: swap` kullan. Google Fonts'u preconnect ile yükle.
**Kontrast kuralı:** Tüm metin/arka plan çiftleri en az 4.5:1 kontrast oranını sağlamalı;
birincil metin için 7:1 hedefle. İkincil/pasif metinleri aşırı silikleştirme.

---

## 3. ANA YERLEŞİM VE GRID SİSTEMİ (En kritik bölüm)

`/flow` sayfası üç bölgeden oluşur: üst bar (model seçimi + ayarlar), orta karşılaştırma
alanı (çoklu sütun), alt prompt giriş alanı (sabit).

Aşağıdaki gereksinimleri **harfiyen** uygula:

1. **Dinamik sütun genişliği:** Kullanıcı 2 model seçtiğinde sütunlar ekranı dengeli kaplamalı
   (ortada boşluk kalmamalı). 3-4 model seçildiğinde sütunlar otomatik daralmalı ama minimum
   320px genişlik altına inmemeli; bu noktadan sonra yatay kaydırma devreye girmeli.
2. **Yeniden boyutlandırılabilir sütunlar (resizable columns):** Kullanıcı sütun aralarındaki
   tutamaçları (drag handle) sürükleyerek genişlikleri manuel ayarlayabilmeli. 1440px ve üzeri
   ekranlarda bu özellik aktif olsun.
3. **Bağımsız sütun kaydırma (independent scrolling):** Her model sütunu KENDİ içinde
   `overflow-y: auto` ile kaydırılmalı. Bir model uzun, diğeri kısa yanıt verdiğinde, sayfa
   genelinde kaydırma yerine her sütun ayrı kayar. Böylece kullanıcı iki yanıtın farklı
   bölümlerini hizalayarak okuyabilir.
4. **Sticky başlıklar:** Her sütunun model adı/ikonu içeren başlığı, sütun kaydırılırken
   üstte sabit (sticky) kalmalı.
5. **Senkron kaydırma seçeneği (bonus):** Üst barda bir "sync scroll" geçişi (toggle) olsun;
   açıldığında tüm sütunlar birlikte kaysın.

Bu bölge için `ModelColumn` ve karşılaştırma grid bileşenini üret.

---

## 4. PROMPT GİRİŞ ALANI (PromptComposer)

Alt kısımda sabit duran prompt giriş bileşenini üret. Gereksinimler:

1. **Otomatik büyüyen textarea:** Kullanıcı yazdıkça textarea dikeyde otomatik genişlemeli
   (min 1 satır, max ~8 satır, sonrası iç kaydırma). Sabit küçük kutu HİSSİ verme.
2. **Klavye kısayolları:**
   - `Enter` → gönder
   - `Shift + Enter` → yeni satır
   - `Cmd/Ctrl + Enter` → gönder (alternatif)
   Bu davranışı kutunun altında çok hafif gri bir metinle belirt: *"Enter ile gönder · Shift+Enter yeni satır"*.
3. **Gönder butonu:** Birincil aksiyon rengi (`--color-accent`). Boş prompt'ta devre dışı (disabled)
   görünmeli. Yanıt üretilirken "Durdur" (stop) durumuna dönmeli.
4. **Karakter/token sayacı (opsiyonel):** Sağ altta hafif bir sayaç.
5. **Erişilebilirlik:** textarea'ya `aria-label`, gönder butonuna `aria-label="Promptu gönder"`.

---

## 5. MODEL SEÇİMİ VE YÖNETİMİ (ModelSelector)

Üst barda model seçim bileşeni üret. Gereksinimler:

1. **Net aktif/pasif durumu:** Sadece kenarlık (border) rengi değiştirme. Aktif modeller için
   ARKA PLAN doygunluğunu artır + küçük bir onay işareti (checkmark) göster. Pasif modeller
   görsel olarak belirgin biçimde sönük ama okunabilir olsun.
2. Her model için ikon/logo + isim + (opsiyonel) hız/maliyet rozeti.
3. Model ekle/çıkar işlemi karşılaştırma grid'ini anında güncellemeli (animasyonlu giriş/çıkış).
4. En fazla 4 model seçilebilsin; limit aşılırsa nazik bir tooltip uyarısı.

---

## 6. MİKRO ETKİLEŞİMLER VE HIZLI EYLEMLER

Her model yanıt kartına aşağıdakileri ekle:

1. **Kopyala butonu (CopyButton):** Kartın sağ üst köşesinde belirgin "Kopyala" ikonu.
   Tıklanınca ikon anlık olarak checkmark'a dönsün ve "Kopyalandı!" tooltip/balonu belirsin
   (~1.5 sn sonra eski haline dönsün). Framer Motion ile yumuşak geçiş.
2. **Kod blokları (CodeBlock):**
   - Koyu tema uyumlu syntax highlighting (Shiki/highlight.js).
   - Sağ üstte "Kodu Kopyala" butonu.
   - Sol üstte dil etiketi (örn. `python`, `typescript`).
3. **Yeniden üret (regenerate) ve oyla (👍/👎):** Her kartın altında ince aksiyon çubuğu.
4. **Diff / fark vurgulama (DiffView):** İki model yanıtını karşılaştıran bir mod. Kelime
   düzeyindeki farklar git-diff mantığıyla — eklenenler yeşil (`--color-bull`) arka plan,
   çıkarılanlar kırmızı (`--color-bear`) arka plan — vurgulansın. Bunu açıp kapatan bir geçiş ekle.

---

## 7. YÜKLENME DURUMLARI VE ALGILANAN PERFORMANS

1. **Skeleton yükleyiciler (SkeletonLoader):** Yanıt beklenirken boş ekran veya tek bir spinner
   GÖSTERME. Bunun yerine soldan sağa hafifçe parıldayan (shimmer) iskelet satır animasyonları
   kullan. Bu, bekleme süresini psikolojik olarak kısaltır (perceived performance).
2. **Streaming imleci:** Yanıtlar akarak (streaming) gelirken, metnin sonunda yanıp sönen dikey
   bir imleç bloğu (cursor block) göster. Bu, sürecin aktif olduğunu güçlü biçimde belli eder.
3. **Mock streaming:** `src/lib/mockModels.ts` içinde, her model için kelime kelime akan sahte
   yanıt üreten bir fonksiyon yaz (farklı modeller farklı hızda/uzunlukta yanıt versin ki
   bağımsız kaydırma ve hizalama senaryoları test edilebilsin). Gerçek API anahtarı isteme.

---

## 8. MOBİL VE RESPONSIVE STRATEJİ

Çok sütunlu karşılaştırmayı mobilde sıkıştırarak okunamaz hale getirme. Şunları uygula:

1. **Anti-pattern'den kaçın:** Mobilde tüm sütunları yan yana mikro ölçekte gösterme; sayfayı
   yatay kaydırmaya zorlama.
2. **Mobil için sekme (tab) yapısı:** Mobilde üstte "ChatGPT / Claude / Gemini / Grok" sekmeleri
   göster; sadece aktif sekmenin yanıtı tam genişlikte okunsun.
3. **Kaydırılabilir kartlar (swipeable):** Kullanıcı sağa-sola kaydırarak modeller arasında geçiş
   yapabilsin. Sekme başlıkları üstte sabit (sticky) kalsın. Aktif sekme göstergesi animasyonlu olsun.
4. Kırılma noktaları: `< 768px` mobil (sekme), `768–1439px` tablet (2 sütun + yatay kaydırma),
   `>= 1440px` masaüstü (resizable çoklu sütun).

---

## 9. ERİŞİLEBİLİRLİK (WCAG 2.1 AA — zorunlu)

Her bileşende uygula:

1. **Semantik HTML:** `header`, `main`, `section`, doğru başlık hiyerarşisi (tek `h1`).
2. **ARIA:** İnteraktif her öğeye `aria-label`. Yükleniyor durumları için `aria-live="polite"`.
   Modallar için `role="dialog"` + `aria-modal="true"` + `aria-labelledby`.
3. **Klavye navigasyonu:** Tüm butonlar, sütunlar, sekmeler klavyeyle erişilebilir. Görünür
   `:focus-visible` stilleri (aksesuar değil, gerçek odak halkası). Skip-link ekle.
4. **Renk kontrastı:** Min 4.5:1. Renk tek başına bilgi taşımasın (örn. diff'te renk + ikon).
5. **Reduced motion:** `prefers-reduced-motion` saygısı — shimmer/animasyonları azalt.

---

## 9.5. GÜNLÜK HİSSE RAPORLARI — YÜKLEME, PARSE VE YAYINLAMA (Kritik özellik)

Kullanıcı her gün, **hisse hisse ayrı ayrı, tek dosya (self-contained) HTML raporları** yükleyecek
ve sistem bunları otomatik parse edip düzgün şekilde yayınlayacak. Örnek bir rapor dosyasının
yapısı aşağıda tanımlı; senin ürettiğin sistem bu formatı SORUNSUZ parse edip listelemeli ve
güvenli biçimde göstermeli. Bu, ürünün ikinci ana modülüdür ve `/flow` ile aynı tasarım dilini
(koyu finans teması, OKLCH/aynı palet, Inter/JetBrains Mono) paylaşmalı.

### 9.5.1. Yüklenen raporun yapısı (örnek formatı tanı)

Her rapor şu özelliklere sahip **tek bir `.html` dosyasıdır**:

- `<!DOCTYPE html>` ile başlayan tam bir HTML belgesi; CSS `<style>` içinde gömülü, JS (Chart.js
  grafikleri) `<script>` içinde gömülü — yani **kendi kendine yeten (self-contained)** bir dosya.
- `<title>` formatı: `TICKER — Şirket Adı Advanced Analysis Report` (örn. `META — Meta Platforms, Inc. Advanced Analysis Report`).
- **Çift dilli (TR/EN):** `<body class="lang-tr">` varsayılan; `.tr-only` ve `.en-only` sınıflarıyla
  her iki dilin metni dosyada gömülü. CSS kuralı: `body.lang-tr .en-only{display:none}` ve tersi.
  Bir `setLang` fonksiyonu ile dil değişiyor.
- **Hero bölümü:** ticker (örn. `META`), borsa (`NASDAQ`), canlı fiyat sayacı (`id="price-counter"`),
  fiyat değişimi.
- **Sabit bölüm seti** (nav linkleri ile bağlı): Finansallar (`#fundamentals`), Teknik (`#technical`),
  Haberler & Kararlar (`#news`), Analistler (`#analysts`), Riskler (`#risk`), Opsiyon Stratejileri,
  ayrıca `#recommendation` (al/tut/sat kararı).
- **Chart.js grafikleri** (CDN'den yüklü), canvas id'leri: `perfChart`, `revenueChart`, `incomeChart`,
  `volumeChart`, `ratingsChart`, `riskChart`, `macroChart`.
- Fontlar: Space Grotesk, Inter, JetBrains Mono (Google Fonts).
- Kendi renk token seti var (yeşil = pozitif/`#00C805`, kırmızı = negatif, amber = uyarı, mavi = bilgi).

> **Not:** Format zaman içinde küçük farklılıklar gösterebilir (farklı hisse, farklı grafik sayısı,
> eksik bölüm). Parser **dayanıklı (defensive)** olmalı: bir alan yoksa çökmemeli, makul varsayılana düşmeli.

### 9.5.2. Parse edilecek metadata (her yüklemede otomatik çıkar)

Yüklenen HTML'den şu alanları **otomatik** çıkar ve bir `ReportMeta` nesnesine doldur:

```ts
interface ReportMeta {
  ticker: string;          // <title> başından, örn. "META"
  companyName: string;     // <title>'dan, "—" ile "Advanced" arası
  exchange: string;        // hero ticker-label'dan, örn. "NASDAQ"
  price: number | null;    // #price-counter + ondalık
  priceChangePct: number | null;
  recommendation: string | null;   // #recommendation bölümünden: AL / TUT / SAT (BUY/HOLD/SELL)
  reportDate: string;      // dosya adından (örn. meta16062026 → 2026-06-16) veya bugünün tarihi
  sections: string[];      // bulunan bölüm id'leri
  hasCharts: boolean;
  fileName: string;
  rawHtml: string;         // tam dosya içeriği (güvenli gösterim için)
}
```

**Parse stratejisi:**
- Tarayıcıda `DOMParser` ile parse et (`new DOMParser().parseFromString(html, "text/html")`).
- Dosya adından tarih çıkar: `TICKER + DDMMYYYY` deseni (örn. `meta16062026` → 16 Haziran 2026).
  Desen tutmazsa yükleme tarihini kullan.
- `<title>`'ı regex/split ile ayır: `TICKER` ve şirket adı.
- Her alan için try/catch + null-safe; eksik alan parser'ı çökertmesin.

### 9.5.3. Güvenli yayınlama (XSS'e karşı zorunlu)

Yüklenen HTML keyfi script (Chart.js) içerdiğinden, ANA uygulamanın DOM'una asla doğrudan
`dangerouslySetInnerHTML` ile basma. Bunun yerine:

1. **Sandbox'lı iframe kullan:** Raporu `<iframe sandbox="allow-scripts" srcdoc={rawHtml}>` içinde
   göster. `allow-same-origin` VERME (script'lerin ana uygulamaya erişimini engeller). Böylece
   raporun kendi Chart.js'i ve `setLang`'i iframe içinde güvenle çalışır, ana uygulama izole kalır.
2. İframe yüksekliğini içeriğe göre ayarla (postMessage ile yükseklik bildirimi veya makul büyük
   sabit + iç kaydırma).
3. Sadece metadata çıkarımı için parse ettiğin DOM'u render etme; o yalnızca veri okumak için.

### 9.5.4. Yükleme akışı (UX)

1. **Yükleme alanı:** Sürükle-bırak (drag & drop) + dosya seç butonu. Çoklu dosya kabul et
   (günde birden çok hisse). `.html` dışını reddet, nazik hata göster.
2. Yükleme anında her dosyayı parse et, `ReportMeta` üret, başarı/başarısızlık durumunu göster.
3. **Skeleton + ilerleme:** Parse sırasında shimmer iskelet; bittiğinde kart belirir.
4. Aynı ticker+tarih tekrar yüklenirse "üzerine yaz / kopya tut" sor.

### 9.5.5. Rapor listeleme / galeri sayfası (`/reports`)

1. Yüklenen tüm raporları **kart grid** olarak listele. Her kartta: ticker (büyük, display fontu),
   şirket adı, borsa, fiyat + değişim (yeşil/kırmızı renk kodlu), AL/TUT/SAT rozeti (renkli),
   rapor tarihi, küçük "grafik var" ikonu.
4. **Filtre & arama:** ticker'a göre ara; tarihe / öneriye (AL/TUT/SAT) / borsaya göre filtrele;
   tarihe göre sırala (en yeni üstte). "Bugünün raporları" hızlı filtresi.
5. **Gruplama:** Tarihe göre grupla (örn. "16 Haziran 2026" başlığı altında o günün hisseleri).
6. Karta tıklayınca **rapor detay görünümüne** (`/reports/:ticker/:date`) git → orada sandbox'lı
   iframe içinde tam rapor + üstte parse edilmiş özet şerit (fiyat, öneri, tarih) + dil geçişi
   (TR/EN) butonu (iframe'e postMessage ile `setLang` tetikle).

### 9.5.6. Saklama (storage)

- Demo için: yüklenen raporları ve metadata'yı **IndexedDB**'de sakla (büyük HTML için localStorage
  yetersiz). `idb` paketi kullanılabilir. Sayfa yenilense de raporlar kalsın.
- (Not olarak belirt) Üretimde: dosyalar object storage'a, metadata bir veritabanına; bu adımda
  IndexedDB ile client-side kal.

### 9.5.7. Bu modülün kabul kriterleri

- [ ] Örnek `meta16062026.html` sürükle-bırakla yüklenince ticker=META, exchange=NASDAQ, fiyat,
      öneri ve tarih doğru parse ediliyor.
- [ ] Rapor sandbox'lı iframe içinde tam çalışıyor (Chart.js grafikleri ve TR/EN dil geçişi dahil).
- [ ] Ana uygulama, raporun script'lerinden izole (XSS yok); `allow-same-origin` verilmemiş.
- [ ] Çoklu dosya yüklenebiliyor; bozuk/eksik alanlı dosyada parser çökmüyor, makul varsayılana düşüyor.
- [ ] Galeri: ara/filtrele/tarihe göre grupla çalışıyor; AL/TUT/SAT rozetleri renk kodlu.
- [ ] Sayfa yenilense de raporlar IndexedDB'den geri yükleniyor.

---

## 10. SEO VE META (SPA olsa da temelleri kur)

1. Doğru `<title>`, `<meta name="description">`, `lang="tr"`.
2. OpenGraph + Twitter Card etiketleri.
3. Schema.org structured data (WebApplication).
4. `react-helmet-async` ile sayfa başına meta yönetimi.
5. (Not olarak belirt) SSR/SSG gerekirse Next.js'e taşıma yolu — ama bu adımda Vite ile kal.

---

## 11. PERFORMANS

1. **Code splitting:** `React.lazy` + `Suspense` ile `FlowPage` ve ağır bileşenleri lazy yükle.
2. **Manuel chunk'lar:** Vite config'de `react`/`react-dom` vendor chunk'ı ayır.
3. **Font:** preconnect + `display=swap`.
4. **Memoization:** Sütun bileşenlerinde gereksiz render'ları `React.memo`/`useMemo` ile önle.
5. Hedef: Lighthouse Performance 90+, Accessibility 95+.

---

## 12. ÇIKTI VE TESLİM SIRASI

Aşağıdaki sırayla, her birini ayrı kod blokları halinde üret:

1. `package.json` + Vite/Tailwind/TS config dosyaları
2. `src/styles/tokens.css` + global stiller
3. `src/lib/mockModels.ts` (mock streaming üretici)
4. `src/store/useFlowStore.ts` (Zustand state)
5. `ModelSelector` bileşeni
6. `PromptComposer` bileşeni
7. `ModelColumn` + karşılaştırma grid (resizable + independent scroll)
8. `CopyButton`, `CodeBlock`, `SkeletonLoader`, `DiffView`
9. Mobil sekme/swipe katmanı
10. **Rapor modülü:** `lib/parseReport.ts` (DOMParser ile metadata çıkarımı) + `ReportMeta` tipi
11. **Rapor modülü:** `store/useReportStore.ts` + IndexedDB saklama (`idb`)
12. **Rapor modülü:** yükleme alanı (drag & drop), `ReportGallery` (`/reports`), `ReportDetail`
    (`/reports/:ticker/:date`) — sandbox'lı iframe ile güvenli gösterim + TR/EN dil geçişi
13. `FlowPage.tsx` + rota tanımları (`/flow`, `/reports`, `/reports/:ticker/:date`) + `App.tsx`
14. Erişilebilirlik ve performans geçişlerinin son kontrol listesi

Her adım sonunda kısa bir doğrulama notu ekle. En sonda, projeyi çalıştırma talimatlarını
(`npm install`, `npm run dev`) ve test edilmesi gereken UX senaryolarını (2 model vs 4 model,
uzun vs kısa yanıt hizalama, mobil swipe, kopyala animasyonu, diff modu) listele.

---

## 13. KABUL KRİTERLERİ (Bitince bunları sağladığından emin ol)

- [ ] 2 model seçildiğinde sütunlar ekranı boşluksuz kaplıyor; 4 modelde minimum genişlik korunuyor.
- [ ] Sütunlar bağımsız kayıyor ve başlıklar sticky.
- [ ] Sütunlar masaüstünde resizable.
- [ ] Prompt textarea otomatik büyüyor; Enter/Shift+Enter/Cmd+Enter doğru çalışıyor.
- [ ] Aktif/pasif model durumu arka plan + checkmark ile net ayrışıyor.
- [ ] Kopyala butonu checkmark + tooltip geri bildirimi veriyor.
- [ ] Kod blokları syntax highlight + dil etiketi + kopyala içeriyor.
- [ ] Diff modu kelime düzeyinde yeşil/kırmızı vurgu yapıyor.
- [ ] Yükleme skeleton shimmer + streaming imleci ile gösteriliyor.
- [ ] Mobilde sekme/swipe yapısı çalışıyor; yatay sıkışma yok.
- [ ] WCAG 2.1 AA: kontrast, klavye, ARIA, focus-visible, reduced-motion sağlanıyor.
- [ ] Günlük hisse raporları (örn. `meta16062026.html`) sürükle-bırakla yüklenip doğru parse ediliyor,
      sandbox'lı iframe içinde (Chart.js + TR/EN dahil) güvenle yayınlanıyor, galeride listeleniyor.
- [ ] Lighthouse Performance 90+, Accessibility 95+.

---

**Şimdi 1. adımdan başla ve sırayla ilerle. Her adımı tamamlamadan bir sonrakine geçme.**
