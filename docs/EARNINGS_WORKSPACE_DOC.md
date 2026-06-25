# Gistify `/earnings` Dokümantasyonu

## 1. Amaç

`/earnings`, Gistify içindeki earnings odaklı karar workspace'idir. Sayfanın amacı, tek bir yüzey üzerinde şu katmanları birleştirmektir:

- yaklaşan earnings event takvimi
- makro bağlam
- opsiyon stratejileri
- CPR ve Greeks okumaları
- bütçe bazlı varyasyonlar
- portföy önerileri
- aksiyon planı

Bu alan, yalnızca bir liste veya takvim göstermeyi hedeflemez. Amaç, event öncesi trader'ın "hangi hissede, hangi yapı ile, hangi risk çerçevesinde aksiyon alacağı" sorusuna doğrudan cevap vermektir.

## 2. Erişim ve Route Yapısı

Ana route:

- `/earnings`

Desteklenen alt route'lar:

- `/earnings/calendar`
- `/earnings/strategies`
- `/earnings/:ticker`

Bu route'lar uygulama router'ında ayrı sayfalar olarak tanımlıdır ve workspace navigation içinde bağımsız bir modül olarak görünür. `Earnings` sekmesi ücretli workspace katmanına dahildir; `Flow` gibi public bir yüzey değildir.

## 3. Veri Kaynağı

`/earnings` sayfası verisini frontend'de doğrudan sabit dosyadan değil, API üzerinden alır.

Ana endpoint:

- `GET /api/earnings/strategy`

İndirme endpoint'leri:

- `GET /api/earnings/download?format=md`
- `GET /api/earnings/download?format=docx`

Frontend tarafında veri akışı şu şekildedir:

1. `useEarningsStrategy()` hook'u sayfa açılınca çalışır.
2. Hook `fetch("/api/earnings/strategy", { cache: "no-store", credentials: "include" })` ile güncel snapshot'ı ister.
3. Dönen payload iki parçaya ayrılır:
   - `data`: earnings workspace içeriği
   - `pipeline`: kaynağın senkron durumu
4. Kullanıcı hero içindeki `Refresh` aksiyonu ile aynı isteği manuel olarak tekrar tetikleyebilir.

Backend tarafında bu veri bir markdown pipeline'ından üretilir. `server/earningsStrategy.ts`, markdown raporlarını parse eder ve aşağıdaki veri bloklarını normalize eder:

- `macro`
- `fomc`
- `calendar`
- `cprStocks`
- `strategies`
- `budgetStrategies`
- `portfolio`
- `actionPlan`
- `executiveSummary`

## 4. Sayfa Mimarisi

`/earnings` sayfası tek parça bir dashboard değil, tab tabanlı bir workspace'tir. Üstte ortak hero alanı bulunur; içerik alt tarafta sekmelere göre değişir.

Ana sekmeler:

- `Overview`
- `Calendar`
- `Strategies`
- `CPR & Greeks`
- `Portfolio`
- `Greeks`

Bu yapı, aynı verinin farklı karar lens'leriyle okunmasına izin verir. Kullanıcı takvimden başlayabilir, stratejilere geçebilir, ardından CPR/Greeks ve portföy katmanına inebilir.

## 5. Hero Alanı

Hero bölümü sayfanın görsel ve karar çerçevesi girişidir.

Gösterilen ana ögeler:

- rolling 2-month earnings strateji başlığı
- mevcut ay + sonraki ay gösterimi
- `VIX`, `S&P 500`, `Nasdaq`, `Regime` büyük istatistik kartları
- rapor tarihi
- executive summary chip'leri
- manuel yenileme butonu
- `MD` ve `DOCX` indirme butonları

Bu bölüm iki kritik işi yapar:

1. Kullanıcıya dönem bağlamını verir.
2. Earnings workspace'i izole bir tablo olmaktan çıkarıp makro ortamla ilişkilendirir.

## 6. Overview Sekmesi

`Overview`, ilk açılışta görülen özet çalışma yüzeyidir.

İçerik sırası:

- `EarningsPipelinePanel`
- `FOMCWarningBanner`
- `MacroDashboard`
- `CalendarStatsPanel`
- `ExecutiveSummaryPanel`
- `ActionPlan`
- `ReportDownload`

### 6.1 Pipeline Panel

Pipeline panel, verinin ürün içeriğinden önce operasyonel sağlığını gösterir.

Gösterilen bilgiler:

- pipeline status: `idle`, `ok`, `stale`, `error`
- son senkron zamanı
- kaynak dosyanın son değişim zamanı
- resolve edilen source path
- varsa hata metni

Bu panel özellikle içerik boş geldiğinde debug ve operasyon görünürlüğü sağlar.

### 6.2 FOMC Warning Banner

Eğer veri içinde `fomc` bloğu varsa, sayfa event riskini öne çeker.

Banner şunları gösterebilir:

- FOMC tarihi
- kalan gün sayısı
- blackout başlangıcı
- statü: distant / approaching / imminent / blackout

Bu katman, earnings stratejilerinin makro event yoğunluğundan bağımsız okunmamasını sağlar.

### 6.3 Macro Dashboard

Macro dashboard, earnings okunmasını makro tape ile ilişkilendirir.

Tipik metrikler:

- VIX
- S&P 500
- Nasdaq
- Russell 2000
- 10Y Yield
- DXY
- WTI
- Bitcoin
- Fear & Greed

### 6.4 Calendar Stats Panel

Takvim özet paneli dört hızlı sayı verir:

- toplam earnings event sayısı
- yüksek önem sayısı
- `BMO` sayısı
- `AMC` sayısı

Bu panel, kullanıcının haftalık yoğunluğu tek bakışta anlamasını sağlar.

### 6.5 Executive Summary

Executive summary kartları, raporun üst seviye tezlerini kısa maddeler halinde taşır. Bunlar detaylı analiz yerine karar önceliklerini vurgulayan kısa özetlerdir.

### 6.6 Action Plan

Action plan bölümü, haftalık veya dönemsel çalışma planını gösterir.

Her blok tipik olarak şunları içerir:

- hafta veya tarih aralığı
- odak alanı
- yapılacak aksiyon maddeleri

Bu bölüm, analiz çıktısını izleme listesi olmaktan çıkarıp uygulanabilir iş planına çevirir.

### 6.7 Report Download

Kullanıcı raporu iki formatta indirebilir:

- Markdown
- Word / DOCX

Eğer rapor metadata'sı yoksa butonlar pasif görünür. Eğer mevcutsa aynı içerik doğrudan API download endpoint'i üzerinden teslim edilir.

## 7. Calendar Sekmesi

`Calendar` sekmesi, earnings event akışını daha görsel bir zaman matrisi olarak sunar.

Öne çıkan özellikler:

- ay bazlı pill gösterimi
- haftalara bölünmüş 7 kolonlu takvim grid'i
- `BMO` ve `AMC` için ayrı renk kodları
- yüksek önem için yıldız işaretleri
- hücre hover'ında detay tooltip

Tooltip içinde gösterilebilen alanlar:

- ticker
- company
- sector
- market cap
- strategy
- importance
- `BMO` / `AMC`

Bu sekme, özellikle event yoğunluğu ve gün bazlı yük dağılımını okumak için tasarlanmıştır.

## 8. Strategies Sekmesi

Bu sekme doğrudan yapı ve setup okumaya odaklanır.

İki ana bloktan oluşur:

- `StrategyCollectionPanel`
- `BudgetMatrix`

### 8.1 Strategy Collection

Ana stratejiler listesi, parse edilen `strategies` dizisini kartlar halinde gösterir.

Kartlarda yer alabilen alanlar:

- ticker
- sektör
- price
- IV Rank
- CPR
- strategy type
- credit / max risk
- K.O. probability
- greeks
- budget options

Bu bölüm, yüksek öncelikli earnings setup'larını doğrudan görünür kılar.

### 8.2 Budget Matrix

Budget matrix, aynı event'i farklı sermaye büyüklükleriyle oynama mantığını özetler.

Bucket'lar:

- `$10 – $50`
- `$50 – $200`
- `$200 – $500`
- `$500 – $1,000`

Her bucket içinde şu mantık çalışır:

- uygun budget option'lar gruplanır
- strateji türüne göre ayrıştırılır
- ticker, strategy, cost ve varsa `maxReturn` gösterilir

Bu blok, küçük hesaplar için workspace'i kullanılabilir hale getirir.

## 9. CPR & Greeks Sekmesi

Bu sekme iki ayrı veri yüzeyini yan yana taşır:

- `CPRTable`
- `GreeksDashboard`

### 9.1 CPR Table

CPR tablosu şu işlevlere sahiptir:

- arama
- sektör filtresi
- kolon bazlı sıralama
- `hacimCPR`, `oiCPR`, `sentiment`, `IV Rank` görünümü

Tablo yalnız rakam basmaz; bar görselleştirmesi de kullanır:

- `hacimCPR` için progress bar
- `IV Rank` için seviye barı
- sentiment için renkli badge

Bu yüzeyin amacı, event setup'larını likidite ve opsiyon ilgi yoğunluğu üzerinden elemek.

### 9.2 Greeks Dashboard

Greeks dashboard, strateji bazlı risk haritasıdır.

İzlenen metrikler:

- Delta
- Theta
- Vega
- Gamma

Davranış:

- sektör veya strategy type filtresi vardır
- kolonlar sıralanabilir
- hücre arka planı büyüklüğe göre tonlanır
- Vega negatif alanlar IV crush lehine yeşil okunur
- Gamma yüksek alanlar risk olarak amber tonla vurgulanır

Bu bölüm, earnings öncesi yapıların sadece yön değil, taşıma ve volatilite riski açısından da karşılaştırılmasını sağlar.

## 10. Portfolio Sekmesi

Portfolio sekmesi, `portfolio` verisini yatırım büyüklüğüne göre okunabilir hale getirir.

İki ana parça vardır:

- `PortfolioBuilder`
- `PortfolioPanel`

### 10.1 Portfolio Builder

Portfolio builder önce bütçe seçtirir:

- `$1K`
- `$5K`
- `$10K`
- `$25K`
- `$50K`

Seçilen bütçeye göre şu alt bloklar üretilir:

- sektör dağılımı donut / conic chart
- beklenen toplam getiri
- toplam allocation oranı
- risk matrix
- detailed allocation list

Her öneride şu alanlar gösterilebilir:

- ticker
- strategy
- allocation
- expected return
- risk
- FOMC risk
- entry window
- exit window

### 10.2 Portfolio Panel

Portfolio panel, aynı veriyi daha sade bir liste yapısında sunar. Özellikle hızlı tarama ve farklı budget level'lar arasında kıyas için yararlıdır.

## 11. Greeks Sekmesi

Bu sekme, `GreeksDashboard` bileşeninin tam ekran odaklı versiyonudur. CPR tablosu olmadan sadece opsiyon risk profilini okumak isteyen kullanıcı için ayrılmıştır.

## 12. Ticker Detay Sayfası

Route:

- `/earnings/:ticker`

Bu sayfa belirli bir ticker için workspace içindeki ilgili parçaları bir araya getirir.

Gösterilen bloklar:

- seçili strateji kartı
- strategy detail alanları
- budget variations
- ilgili earnings takvimi event'leri
- desk note

Eğer ticker için strateji snapshot bulunamazsa kullanıcıya bilgi amaçlı bir empty state gösterilir.

## 13. Ayrı Calendar ve Strategies Sayfaları

Ek odak route'lar:

- `/earnings/calendar`
- `/earnings/strategies`

Bu sayfalar aynı veri kaynağını kullanır ama tek bir karar lens'ine yoğunlaşır:

- calendar sayfası: event zamanlama ve yoğunluk
- strategies sayfası: core strategies, budget strategies ve CPR görünümü

## 14. Hata ve Boş Durum Davranışı

Sayfa üç temel state ile çalışır:

- `loading`
- `unavailable`
- `ready`

`loading` durumunda ortak `EarningsLoadingState` görünür.  
API hata dönerse veya `data` boşsa `EarningsUnavailableState` gösterilir.  
Hazır durumda workspace normal render edilir.

Bu ayrım sayesinde ürün katmanı ile pipeline problemi birbirine karışmaz.

## 15. Dil Desteği

`/earnings` bölümü Türkçe ve İngilizce çalışır. Metinler `copy(language, tr, en)` modeli ile üretilir. Bu nedenle aynı yüzey ürün içinde iki dilli olarak sunulabilir.

## 16. Bu Sayfanın Ürün İçindeki Rolü

`/earnings`, Gistify içindeki şu geçiş zincirinin middle-to-deep analysis katmanıdır:

1. `Flow` veya başka discovery yüzeylerinden ticker bulunur.
2. Kullanıcı earnings workspace'e geçer.
3. Event zamanı, strateji yapısı, CPR, Greeks ve portföy seviyesi aynı yerde birleşir.
4. Gerekirse ticker bazlı detail route'a inilerek uygulama planı netleştirilir.

Kısacası `/earnings`, fikir listesinden işlem planına giden katmandır.

## 17. Kısa Yönetici Özeti

`/earnings` bölümü:

- subscription-gated bir workspace'tir
- markdown pipeline'dan beslenir
- event takvimi ile opsiyon stratejisini aynı yüzeyde birleştirir
- makro bağlamı earnings kararından ayırmaz
- küçük hesaplar için budget varyasyonları sunar
- portföy seviyesinde allocation ve risk düşüncesi ekler

Bu nedenle sayfa yalnızca "hangi hissede earnings var" sorusunu değil, "hangi event hangi yapı ile oynanmalı" sorusunu hedefler.
