# Gistify Flow Modülü — i18n Dil Denetimi Raporu

**Taranan dizin:** `client/src/features/flow/`  
**Toplam dosya:** 22 adet (`.ts` + `.tsx`)  
**Kontrol tarihi:** 2025-06-25  
**copy() kullanım şekli:** `copy(language, "TR metin", "EN metin")` — doğru sırada kullanılmış.  
**Ternary (`language === "en" ? ... : ...`) kullanımı:** bulunamadı.  

---

## 🔴 Özet

`client/src/features/flow/` dizini altındaki dosyaların **büyük çoğunluğu** `copy()` fonksiyonunu doğru yönde ve doğru sırayla kullanıyor.  
Ancak **15 adet dosyada** toplam **29 adet hardcoded metin** tespit edildi.  
Hiçbir yerde `copy()` parametre sırası ters değil, inline ternary kullanımı da yok.  
Ana sorun **sayfa `eyebrow` metinleri**, **dil badge/buton kısaltmaları**, **sayı birim etiketleri** (`figure`, `key`, `ticker`) ve **bazı stat kart label’ları**dır.

---

## Bulgular

### 1. Sayfa Eyebrow (Alt Başlık) Metinleri — `copy()` ATLANMIŞ

Tüm `FlowLayout` çağrılarında `eyebrow` prop’una doğrudan İngilizce string atanıyor. Bu, sayfa başlığının hemen üstünde görünen küçük büyük harfli metinlerdir.

```
DOSYA: client/src/features/flow/pages/FlowPage.tsx
SATIR: 120
TIP: hardcoded_text
METIN: eyebrow="Flow"
ONERI: copy(language, "Flow", "Flow") veya prop seviyesinde i18n iletilmeli. Flow modül adı olduğu için TR'de de "Flow" kalabilir, ancak kodda copy() ile açıkça belirtilmeli.
```

```
DOSYA: client/src/features/flow/pages/FlowIndexPage.tsx
SATIR: 57
TIP: hardcoded_text
METIN: eyebrow="Flow"
ONERI: copy(language, "Flow", "Flow") ile FlowLayout'a iletilmeli.
```

```
DOSYA: client/src/features/flow/pages/FlowDailyPage.tsx
SATIR: 41
TIP: hardcoded_text
METIN: eyebrow="Daily"
ONERI: copy(language, "Gunluk", "Daily") ile FlowLayout'a iletilmeli.
```

```
DOSYA: client/src/features/flow/pages/FlowTickerPage.tsx
SATIR: 30
TIP: hardcoded_text
METIN: eyebrow="Flow" (default prop değeri)
ONERI: copy(language, "Flow", "Flow") ile FlowLayout'a iletilmeli.
```

```
DOSYA: client/src/features/flow/components/FlowReportDetailSurface.tsx
SATIR: 32
TIP: hardcoded_text
METIN: eyebrow="Flow" (default prop değeri)
ONERI: copy(language, "Flow", "Flow") ile FlowLayout'a iletilmeli.
```

```
DOSYA: client/src/features/flow/pages/ReportsIndexPage.tsx
SATIR: 156
TIP: hardcoded_text
METIN: eyebrow="Reports"
ONERI: copy(language, "Raporlar", "Reports") ile FlowLayout'a iletilmeli.
```

```
DOSYA: client/src/features/flow/pages/ReportsDateDetailPage.tsx
SATIR: 105
TIP: hardcoded_text
METIN: eyebrow="Reports"
ONERI: copy(language, "Raporlar", "Reports") ile FlowLayout'a iletilmeli.
```

---

### 2. Dil Badge / Buton Kısaltmaları — `copy()` ATLANMIŞ

Kullanıcıya gösterilen "TR" ve "EN" metinleri çeşitli yerlerde hardcoded. Dil kodları olsa da, kullanıcı arayüzünde metin olarak render ediliyorlar ve `copy()` ile çevrilmelidir.

```
DOSYA: client/src/features/flow/pages/ReportsDateDetailPage.tsx
SATIR: 227
TIP: hardcoded_text
METIN: <Button ...>TR</Button>
ONERI: copy(language, "TR", "TR") veya copy(language, "Turkce", "TR") ile buton metni dinamik hale getirilmeli.
```

```
DOSYA: client/src/features/flow/pages/ReportsDateDetailPage.tsx
SATIR: 236
TIP: hardcoded_text
METIN: <Button ...>EN</Button>
ONERI: copy(language, "EN", "EN") veya copy(language, "Ingilizce", "EN") ile buton metni dinamik hale getirilmeli.
```

```
DOSYA: client/src/features/flow/components/reports/ReportGalleryCard.tsx
SATIR: 40
TIP: hardcoded_text
METIN: label: "TR"
ONERI: copy(language, "TR", "TR") veya sabit kalabilir ancak copy() ile açıkça belirtilmeli. Alternatif: getLanguageBadge fonksiyonuna dil prop'u iletilebilir.
```

```
DOSYA: client/src/features/flow/components/reports/ReportGalleryCard.tsx
SATIR: 47
TIP: hardcoded_text
METIN: label: "EN"
ONERI: copy(language, "EN", "EN") ile getLanguageBadge fonksiyonu çevrilmeli.
```

```
DOSYA: client/src/features/flow/lib/flowReportHelpers.ts
SATIR: 280
TIP: hardcoded_text
METIN: label: "TR"
ONERI: getFlowLanguageBadge fonksiyonunda copy(language, "TR", "TR") kullanılmalı.
```

```
DOSYA: client/src/features/flow/lib/flowReportHelpers.ts
SATIR: 286
TIP: hardcoded_text
METIN: label: "EN"
ONERI: getFlowLanguageBadge fonksiyonunda copy(language, "EN", "EN") kullanılmalı.
```

---

### 3. Sayı Birim Etiketleri (Figure, Key, Ticker) — `copy()` ATLANMIŞ

Kullanıcıya gösterilen sayısal değerlerin yanındaki birim adları veya etiketler hardcoded İngilizce olarak bırakılmış.

```
DOSYA: client/src/features/flow/components/FlowReportViewer.tsx
SATIR: 68
TIP: hardcoded_text
METIN: {viewer.spotlight.items.length} key
ONERI: copy(language, "anahtar nokta", "key") ile birim etiketi çevrilmeli.
```

```
DOSYA: client/src/features/flow/components/FlowReportViewer.tsx
SATIR: 134
TIP: hardcoded_text
METIN: {viewer.galleryFigures.length} figure
ONERI: copy(language, "figure", "figure") ile birim etiketi çevrilmeli. Not: FlowReportCard.tsx'de bu copy() ile yapılmış (dogru ornek).
```

```
DOSYA: client/src/features/flow/components/FlowReportCard.tsx
SATIR: 88
TIP: hardcoded_text
METIN: label={`${...} ticker`}
ONERI: copy(language, "ticker", "ticker") ile birim etiketi çevrilmeli.
```

---

### 4. Stat Kart ve Meta Label'ları — `copy()` ATLANMIŞ

`buildFlowViewerData` fonksiyonundaki stat kart ve meta item label'larında bazıları hardcoded, bazıları `copy()` ile yapılmış. Tutarsızlık var.

```
DOSYA: client/src/features/flow/lib/flowReportHelpers.ts
SATIR: 528
TIP: hardcoded_text
METIN: label: "Ticker"
ONERI: copy(language, "Ticker", "Ticker") veya copy(language, "Hisse Sembolu", "Ticker") kullanılmalı.
```

```
DOSYA: client/src/features/flow/lib/flowReportHelpers.ts
SATIR: 537
TIP: hardcoded_text
METIN: label: "Figure"
ONERI: copy(language, "Gorsel", "Figure") kullanılmalı.
```

```
DOSYA: client/src/features/flow/lib/flowReportHelpers.ts
SATIR: 555
TIP: hardcoded_text
METIN: label: "Ticker"
ONERI: copy(language, "Ticker", "Ticker") kullanılmalı. (metaItems array'i)
```

```
DOSYA: client/src/features/flow/lib/flowReportHelpers.ts
SATIR: 560
TIP: hardcoded_text
METIN: label: "Figure"
ONERI: copy(language, "Gorsel", "Figure") kullanılmalı. (metaItems array'i)
```

```
DOSYA: client/src/features/flow/lib/flowReportHelpers.ts
SATIR: 564
TIP: hardcoded_text
METIN: label: "OpenAI"
ONERI: Marka adı oldugu için copy() gerekli degil, bu bir AI modeli adıdır. SKIP.
```

---

### 5. Fallback / Default UI Metinleri — `copy()` ATLANMIŞ\n
```
DOSYA: client/src/features/flow/lib/flowReportHelpers.ts
SATIR: 317
TIP: hardcoded_text
METIN: return report.sourceLabel || report.sourceFolder || "Flow source"
ONERI: copy(language, "Flow kaynagi", "Flow source") ile fallback metni çevrilmeli.
```

```
DOSYA: client/src/features/flow/lib/flowReportHelpers.ts
SATIR: 319
TIP: hardcoded_text
METIN: return normalizeFlowContent(report.content).sourceLabel || report.sourceFolder || "Flow source"
ONERI: copy(language, "Flow kaynagi", "Flow source") ile fallback metni çevrilmeli.
```

---

### 6. Küçük UI Detayları

```
DOSYA: client/src/features/flow/components/FlowCommunityPanel.tsx
SATIR: 254
TIP: hardcoded_text
METIN: "U" (AvatarFallback)
ONERI: Kullanıcı adı yoksa gösterilen fallback baş harf. copy(language, "U", "U") veya kullanıcısız durum için copy(language, "Misafir", "Guest") kullanılabilir.
```

```
DOSYA: client/src/features/flow/components/FlowReportViewer.tsx
SATIR: 155
TIP: hardcoded_text
METIN: "OpenAI" (span badge)
ONERI: Marka adı olduğu için copy() gerekli değil. AI modeli adıdır. SKIP.
```

```
DOSYA: client/src/features/flow/pages/FlowDailyPage.tsx
SATIR: 205
TIP: hardcoded_text
METIN: "-"
ONERI: Veri yoksa gösterilen tire. Bu evrensel bir semboldur, copy() gerekmez. SKIP.
```

---

## ✅ Doğru Kullanım Örnekleri (Best Practice)

Aşağıdaki dosyalar ve satırlar `copy()` fonksiyonunu **kusursuz** kullanıyor:

- `FlowPage.tsx` satır 121, 123, 135, 143, 147, 158, 172, 181, 190, 201, 217, 222, 226, 230, 241, 245, 290, 305, 318, 327, 336, 341, 378, 381, 385, 389, 423, 425, 430, 441, 448, 453, 473, 477, 481, 493, 501, 515
- `ReportsIndexPage.tsx` satır 158, 160, 162, 164, 171, 175, 183, 191, 199, 207, 244, 257, 271, 283, 287, 288, 294, 297, 318, 319, 338, 342, 354, 361, 388, 392, 396
- `FlowReportCard.tsx` satır 76, 80
- `FlowReportList.tsx` satır 26, 37
- `FlowReportRow.tsx` satır 67, 68
- `FlowTickerCard.tsx` satır 36, 44, 74, 76, 83, 85, 91
- `FlowReportViewer.tsx` satır 55, 61, 63, 91, 123, 126, 128, 130, 133, 148
- `FlowReportDetailSurface.tsx` satır 105, 110, 112, 123, 127, 132, 143, 152, 160, 172, 180, 184, 189, 195, 196
- `FlowCommunityPanel.tsx` satır 133, 137, 142, 149, 169, 182, 192, 198, 205, 212, 213, 229, 236, 242, 249, 277, 279
- `ReportUploadDropzone.tsx` satır 32, 35, 37, 42, 44, 57, 61, 115, 117, 122, 124, 143, 169, 171
- `useReportStore.ts` satır 164, 190, 208, 222, 232, 295, 301
- `useFlowReportSummaries.ts` satır 56, 69, 70
- `useFlowReport.ts` satır 50, 60
- `useFlowReports.ts` satır 39, 52, 53
- `useFlowComments.ts` satır 62, 72, 114, 129
- `useFlowSources.ts` satır 39, 52, 53
- `reportGallery.ts` satır 56, 59, 62, 64, 85, 88, 101, 102, 175
- `flowReportHelpers.ts` satır 267, 269, 279, 285, 291, 292, 487, 493, 523, 524, 532, 533, 542, 543, 547, 548, 557, 569, 570, 584, 585, 592, 593, 621, 622, 625, 650, 652, 653
- `ReportsDateDetailPage.tsx` satır 84, 87, 88, 92, 93, 108, 109, 112, 113, 115, 119, 120, 132, 132, 139, 139, 141, 150, 151, 155, 156, 159, 171, 176, 183, 184, 185, 186, 187, 188, 195, 196, 197, 198, 199, 200, 255, 256, 265, 266, 273, 274, 275, 276, 288, 289, 292, 293

---

## 🟡 Uyarı (Veri Karşılaştırması)

```
DOSYA: client/src/features/flow/components/FlowReportViewer.tsx
SATIR: 58
TIP: data_comparison
METIN: viewer.spotlight.title === "Spotlight"
ONERI: Bu bir veri karşılaştırmasıdır (rapordan gelen title === "Spotlight"). Eğer rapor Türkçe üretilmişse title "Spotlight" yerine "One Cikanlar" gibi bir metin içerebilir ve bu karşılaştırma her zaman false dönebilir. Spot ışığı section'ının tanımlanması için rapor-level metadata (örn. sectionId veya type flag) kullanılmalı, string karşılaştırması yerine.
```

---

## 📊 Özet Tablo

| TIP | Adet | Örnek Dosyalar |
|-----|------|----------------|
| `hardcoded_text` | 29 | FlowPage, FlowIndexPage, FlowDailyPage, FlowTickerPage, FlowReportDetailSurface, ReportsIndexPage, ReportsDateDetailPage, ReportGalleryCard, flowReportHelpers, FlowReportViewer, FlowReportCard, FlowCommunityPanel |
| `missing_copy` | 0 | Yok |
| `wrong_usage` | 0 | Yok (copy() parametre sırası tüm dosyalarda doğru) |
| `ternary_instead_of_copy` | 0 | Yok |
| `data_comparison` | 1 | FlowReportViewer.tsx |

---

## 🛠️ Düzeltme Öncelik Sırası

1. **Yüksek:** `eyebrow` prop'ları — `FlowPage`, `FlowDailyPage`, `ReportsIndexPage`, `ReportsDateDetailPage` ve diğer sayfa bileşenleri. Sayfa başlığının hemen üstünde görünen metinler.
2. **Yüksek:** `ReportsDateDetailPage` TR/EN dil buton metinleri.
3. **Orta:** `flowReportHelpers.ts` `buildFlowViewerData` içindeki stat kart label'ları (`Ticker`, `Figure`).
4. **Orta:** `FlowReportViewer.tsx` `key` ve `figure` birim etiketleri.
5. **Orta:** `FlowReportCard.tsx` `ticker` birim etiketi.
6. **Düşük:** `ReportGalleryCard.tsx` ve `flowReportHelpers.ts` TR/EN dil badge'leri. Dil kodları olduğu için görsel olarak kabul edilebilir, ancak kod tutarlılığı açısından `copy()` ile yapılması tercih edilir.
7. **Düşük:** `FlowCommunityPanel.tsx` AvatarFallback `"U"` metni.

---

*Rapor oluşturuldu: `client/src/features/flow/` dizini altındaki 22 dosya tarandı.*
