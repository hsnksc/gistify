# Gistify Daily Report — Premium Markdown Template

Bu doküman, `dailyreport/` ve `flow/` altındaki raporların premium, bilingual (TR+EN) ve tutarlı görsel deneyim için izlemesi gereken markdown standartlarını tanımlar.

## Dosya İsimlendirme

Her rapor için iki kaynak dosyası üretilir:

- `{rapor-adi}.premium.tr.md` — Türkçe versiyon
- `{rapor-adi}.premium.en.md` — İngilizce versiyon

Sunucu bu dosyaları tercihli olarak okur; eski `.md` ve `.html` dosyaları fallback olarak kalır.

## Zorunlu Metadata (Header)

```markdown
# {Rapor Başlığı}

**Hazırlayan / Author:** Gistify AI
**Tarih / Date:** 8 Haziran 2026 / June 8, 2026
**Kapsam / Coverage:** ABD endeksleri, makro göstergeler, sektör rotasyonu
**Metodoloji / Methodology:** Multi-factor momentum scan + macro event filter
**Rapor Türü / Report Type:** Daily Market Brief
```

## Standart Bölümler

Her premium rapor aşağıdaki bölümleri içermelidir. Sıra korunabilir; rapor türüne göre bazı bölümler kısa tutulabilir.

### 1. Executive Summary / Yönetici Özeti

3–5 maddelik, rakam ve eylem vurgulu özet. Her madde tek cümle, güçlü ve net olmalı.

```markdown
## Executive Summary / Yönetici Özeti

- S&P 500 7.406 seviyesinde tutunuyor; kısa vadeli tepki alımı için 7.465 direnci kırılmalı.
- VIX 18.78'e geriledi; tam normalleşme için 15 altına inmesi gerekli.
- Teknoloji sepeti (XLK +%2.18) günün en güçlü sektörü; NVDA öncülüğünde AI altyapı teması canlı.
- Brent petrol 94.25 dolar; jeopolitik risk primi enflasyon beklentilerini canlı tutuyor.
- FOMC öncesi pozisyon boyutları sınırlı tutulmalı, nakit oranı %20–30 aralığında korunmalı.
```

### 2. Market Regime / Piyasa Rejimi

Rejim tanımı + KPI tablosu. Göstergeler, seviyeler ve yorumlar üç sütunda verilir.

### 3. Macro Snapshot / Makro Görünüm

Fed, enflasyon, tahvil faizi, petrol, dolar, jeopolitik risk başlıkları altında kısa paragraflar.

### 4. Sector Leadership / Sektör Liderliği

ETF tablosu: Sektör, ETF, günlük performans, teknik/temel yorum.

### 5. Top Trade Ideas / İşlem Fikirleri

| Sıra | Varlık | Fiyat | Tez | Ana Risk | Olasılık |

### 6. Asset Deep Dives / Varlık Analizi

En önemli 1–3 varlık için teknik ve temel analiz, işlem disiplini.

### 7. Key Levels / Teknik Seviyeler

Pivot, destek ve direnç tablosu; her seviyenin anlamı kısa açıklanır.

### 8. Risk Map / Risk Haritası

| Risk | Tetikleyici | Beklenen Etki | Aksiyon Çerçevesi |

### 9. Portfolio Framework / Portföy Çerçevesi

Ağırlık önerileri tablosu + gerekçe.

### 10. Conclusion / Sonuç

Tek paragraf: ana tema, en yüksek olasılıklı aday, kritik teyit koşulları.

### 11. Sources / Kaynaklar

Footnote formatında: `[1]: URL "Açıklama"`.

### 12. Disclaimer / Yasal Uyarı

> This report is for informational purposes only and does not constitute investment advice.

## Dil Kuralları

- `.premium.tr.md` tamamen Türkçe yazılır; teknik terimler (VIX, FOMC, ETF, EPS) parantezsiz kullanılabilir.
- `.premium.en.md` tamamen İngilizce yazılır; finansal terminoloji profesyonel yatırım notu diliyle tutarlı olmalıdır.
- İki versiyon bölüm başlıkları ve tablo sütunları dışında birebir çeviri değil, karşılıklı olmalıdır.
- Emojiler sadece bölüm ikonlarında ve uyarı kutularında sınırlı kullanılır.

## Görsel İpuçları

- Görseller `![alt text](dosya.png)` formatında eklenir; caption otomatik oluşur.
- Tablolarda her sütun kısa tutulur; uzun metinler hücre içinde `<br>` ile bölünebilir.
- `**kalın**` vurgusu sadece kritik rakam veya eylem kelimelerinde kullanılır.
