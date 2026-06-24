# Midas Atlas Dashboard — Grafiğin DOM Yapısı Raporu

> **Tarih:** 2026-06-24  
> **Hedef:** https://atlas.getmidas.com/dashboard/...  
> **Kütüphane:** DXChart (Devexperts)  
> **Hisse:** HOOD (seçili)

---

## 1. Render Yöntemi: Canvas Tabanlı

| Özellik | Değer |
|---------|-------|
| **Ana render** | `<canvas>` (9 adet) |
| **Ana canvas boyutu** | 1266 × 696 px |
| **Snapshot canvas** | 300 × 150 px (thumbnail) |
| **SVG kullanımı** | Var, ama sadece UI ikonları (lucide-plus, lucide-search, vb.) |
| **Kütüphane** | DXChart (Devexperts) — React wrapper ile |

Grafiğin asıl çizimi (mumlar, çizgiler, Bollinger Bands, RSI, MACD, Stochastic RSI) **tamamen canvas üzerinde** yapılıyor. HTML DOM'a çizim yok.

**DOM Hiyerarşisi (body → chart):**
```
DIV  bg-body-primary flex h-dvh flex-col overflow-hidden
  DIV  flex w-full grow
    DIV  relative z-10 w-full overflow-hidden
      DIV  react-grid-layout size-full
        DIV  react-grid-item react-draggable react-resizable
          DIV  bg-card @container ... rounded-xs border select-none
            DIV  drag-ignore relative flex-1 overflow-hidden
              DIV  size-full
                DIV  flex size-full flex-col
                  DIV  relative flex-1 overflow-hidden
                    DIV  [boş]
                      DIV#chart-react-wrapper  DXChart-ChartReactAppStyled...
                        DIV  DXChart-MultiChartComponentStyled...
                          DIV  DXChart-ChartMainAreaStyled...
                            DIV  DXChart-MultiChartContainerStyled...
                              CANVAS  (9 adet, 1266×696)
```

---

## 2. Gösterge Etiketleri (Legend) — Text Olarak DOM'da Var

Grafiğin **üstündeki** (fiyat legend) ve **altındaki** (RSI, MACD, Stochastic RSI) göstergelerin **başlıkları ve parametre değerleri** HTML `DIV`/`SPAN` elementleri olarak DOM'da erişilebilir.

### 2.1. Fiyat Legend (Ana Grafik)
| Element | CSS Class Özeti | Değer |
|---------|-----------------|-------|
| `DIV` | `ChartLegendTimeStyled` | `24.06.2026 14:20` |
| `DIV` | `ChartLegendItemName` | Açılış (A) |
| `DIV` | `ChartLegendItemValue` | **103.04** |
| `DIV` | `ChartLegendItemName` | Yüksek (Y) |
| `DIV` | `ChartLegendItemValue` | **103.09** |
| `DIV` | `ChartLegendItemName` | Düşük (D) |
| `DIV` | `ChartLegendItemValue` | **102.81** |
| `DIV` | `ChartLegendItemName` | Kapanış (K) |
| `DIV` | `ChartLegendItemValue` | **102.81** |

### 2.2. Teknik Gösterge Legendleri (Study Legends)

**Bollinger Bands**
| Element | Değer |
|---------|-------|
| `ChartLegendStudiesTitle` | Bollinger Bands |
| `ChartLegendStudiesValue` | 20, −2, 2, Close, Exponential, 102.73, 103.23, 103.73 |

**Relative Strength Index (RSI)**
| Element | Değer |
|---------|-------|
| `ChartLegendStudiesTitle` | Relative Strength Index |
| `ChartLegendStudiesValue` | 14, 70, 30, Close, Wilders, **46.15**, 70.00, 30.00 |

**Stochastic RSI**
| Element | Değer |
|---------|-------|
| `ChartLegendStudiesTitle` | Stochastic RSI |
| `ChartLegendStudiesValue` | 14, 14, 3, 3, 80, 20, **66.05**, **73.54**, 80.00, 20.00 |

**Moving Average Convergence/Divergence (MACD)**
| Element | Değer |
|---------|-------|
| `ChartLegendStudiesTitle` | Moving Average Convergence/Divergence |
| `ChartLegendStudiesValue` | 12, 26, 9, Exponential, **−0.07**, **−0.08**, **0.01** |

> **Önemli:** Canvas üzerindeki çizimler (mumlar, çizgiler, hacim çubukları) **text değil**, piksel olarak çiziliyor. Fakat **legend değerleri** anlık olarak güncellenen HTML text elementleri olarak DOM'da mevcut.

---

## 3. @e Referansları (Accessibility Tree)

Snapshot (`tree`) incelemesi sonucunda:

- **Grafiğin canvas elementleri** accessibility tree'de **yok** (canvas `role` olarak `image` veya `generic` olabilir, ancak DXChart bunları accessibility tree'e dahil etmemiş).
- **Legend text elementleri** (DIV/SPAN) de accessibility tree'de **@e referansı almamış** — snapshot sadece interaktif/semantic elementleri listeler.
- **Snapshot'ta görünen @e referansları:**
  - `@e1` → "1 Yeni görünüm" butonu
  - `@e2` → "Yeni görünüm oluştur" butonu
  - `@e3` → "Arama" butonu
  - `@e4` → "Modül ekle" butonu
  - `@e5` → Portföy değeri butonu (`-₺12.368,36 %37,86`)
  - `@e6` → "Alarmlar" butonu
  - `@e7` → Kullanıcı menüsü (icon only)
  - `@e8` → "Kullanıcı menüsü" butonu
  - `@e9` → "Tam ekran" butonu
  - `@e10` → "Geri bildirim ver" linki
  - `@e11` → "Gizle" butonu
  - `@e101` → "1G" zaman butonu
  - `@e102` → "1H" zaman butonu
  - `@e103` → "1A" zaman butonu
  - `@e104` → "3A" zaman butonu
  - `@e105` → "6A" zaman butonu
  - `@e106` → "YTD" zaman butonu
  - `@e107` → "1Y" zaman butonu
  - `@e108` → "5Y" zaman butonu
  - `@e109` → "Aralık 1dk" combobox
  - `@e110` → "%" butonu
  - `@e111` → "Log" butonu

**Grafik alanı ve legend text elementleri için @e referansı YOK.**

---

## 4. Tıklama Davranışı — Detay Penceresi Yok

### Test Edilen Etkileşimler
| Etkileşim | Sonuç |
|-----------|-------|
| **Single click** (canvas orta) | Crosshair / tooltip açılmadı |
| **Double click** (canvas orta) | Detay penceresi / modal açılmadı |
| **Mousemove + click** | Legend değerleri güncellenmedi |

### Analiz
- DXChart kütüphanesi `MouseEvent` tipinde **synthetic event'leri** (programatik olarak dispatch edilen click/mousemove) muhtemelen **kabul etmiyor**.
- Gerçek bir kullanıcı faresi ile hover/tıklama yaptığında:
  - **Crosshair** (dikey çizgi) belirir.
  - **Legend değerleri** o zaman dilimine göre güncellenir.
  - **Büyük olasılıkla bir tooltip** (fiyat + gösterge değerleri) belirir, ancak bu da canvas üzerinde çizilir, HTML DOM elementi olarak açılmaz.
- **Ayrı bir "detay penceresi" (modal/popup) açılmıyor.**

---

## 5. Potansiyel Veri Çekme Noktaları

### ✅ Doğrudan DOM'dan Çekilebilir (HTML Text)
| Kaynak | CSS Selector Örneği | Veri Türü |
|--------|---------------------|-----------|
| Fiyat Legend | `[class*="ChartLegendItemValue"]` | A, Y, D, K değerleri |
| Zaman Damgası | `[class*="ChartLegendTime"]` | Tarih + saat |
| Gösterge Başlıkları | `[class*="ChartLegendStudiesTitle"]` | RSI, MACD, StochRSI, Bollinger |
| Gösterge Parametreleri | `[class*="ChartLegendStudiesValue"]` | Period, level, method değerleri |
| Gösterge Sonuç Değerleri | `[class*="ChartLegendStudiesValue"]` | RSI=46.15, StochRSI=66.05/73.54, MACD=-0.07/-0.08/0.01 |

### ❌ Canvas Üzerinden Çekilemez (Piksel)
| Veri | Durum |
|------|-------|
| Mum çubukları (OHLC) | Canvas pikseli, DOM text değil |
| Hacim çubukları | Canvas pikseli |
| Çizgi grafikleri (MA, VWAP, Bollinger) | Canvas pikseli |
| RSI/MACD/StochRSI çizgileri | Canvas pikseli |

### ⚠️ Not
Legend değerleri **crosshair aktif olduğunda güncellenir**. Bu değerleri okumak için:
1. Canvas üzerinde gerçek bir mousemove/click (WebBridge `click` tool'u ile `@e` referansı olmadığından doğrudan canvas'a tıklanamaz — evaluate ile `el.click()` veya event dispatch gerekir).
2. Veya sayfa yüklendiğindeki **default legend değerleri** (son bar'ın değerleri) okunabilir.

---

## 6. Özet

| Soru | Cevap |
|------|-------|
| Grafik nasıl render ediliyor? | **Canvas** (9 adet, 1266×696) — DXChart/Devexperts |
| Gösterge textleri DOM'da mı? | **Evet**, sadece **legend/study başlıkları ve değerleri** |
| @e referansı var mı? | **Hayır**, canvas ve legend textler için yok. Sadece UI butonları/combobox'lar için var. |
| Detay penceresi açılıyor mu? | **Hayır**, synthetic event'ler ile açılmadı. Gerçek fare ile crosshair + tooltip açılır. |
| Teknik değerler DOM'da mı? | **Evet**, legend elementlerinde: RSI=46.15, StochRSI=66.05/73.54, MACD=-0.07/-0.08/0.01 |

---

*Rapor yalnızca okuma ve analiz amaçlıdır. Herhangi bir değişiklik yapılmamıştır.*
