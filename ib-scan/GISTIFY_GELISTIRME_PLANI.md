# Gistify × Investment Bastion — Ürün Geliştirme Planı

**Hazırlanma:** 16 Temmuz 2026
**Kaynak:** `ib-scan/_ANA_RAPOR.md` ve alt incelemeler
**İlke:** Rakibin ekranlarını kopyalamak yerine, kanıtlanmış keşif akışlarını Gistify'nin canlı Midas sinyalleri, açıklanabilir skorları ve rapor altyapısıyla birleştirmek.

## Ürün kararı

Gistify'nin farkı 4.000 hisselik genel bir fundamental terminal olmak değil; canlı momentum sinyallerini **keşif → doğrulama → takip → işlem planı** zincirine dönüştürmek olmalı. İlk yatırım bu nedenle mevcut `/momentum` alanına yapılır.

## Faz 0 — Market Radar (bu geliştirmede tamamlandı)

- Tek tabloda tüm semboller, sinyal, fiyat, 1G/1H/1A performans, güç ve risk.
- Günlük, haftalık, aylık ve conviction sıralama lensleri.
- Lider, nötr, risk ve favori filtreleri ile sembol arama.
- Tablo ve ısı haritası görünümü.
- Tarayıcıda kalıcı favoriler ve Coverage detayına doğrudan geçiş.
- Yeni veri kaynağı yok; mevcut Midas snapshot ve live-rescore çıktıları kullanılır.

**Başarı ölçütleri:** Radar etkileşim oranı, favoriye eklenen sembol sayısı, Radar → Coverage geçiş oranı, kullanıcının ilk anlamlı sinyale ulaşma süresi.

## Faz 1 — Açıklanabilir hisse detay sayfası (tamamlandı)

- `/coverage/:ticker` içinde Momentum, Relative Strength, Volume/Liquidity, Technical Structure, Volatility Regime ve Catalyst faktörlerini ortak 0–100 dilinde göster.
- Skorun değişim nedenini “önceki snapshot → yeni snapshot” karşılaştırmasıyla açıkla.
- Giriş, invalidation, hedefler, R/R ve pozisyon boyutunu tek işlem planı kartında birleştir.
- Hisseye bağlı Flow raporlarını, earnings tarihini ve haber/katalizörleri aynı sayfada ilişkilendir.

**Uygulama notu:** Coverage detayına canlı Midas Signal Intelligence katmanı eklendi. Altı faktör ortak 0–100 ölçeğinde, ham katkı puanları korunarak gösteriliyor. Snapshot skoru public ledger ile karşılaştırılıyor; trade plan, pozisyon boyutu, teknik/piyasa bağlamı ve ilişkili Flow raporları aynı yüzeyde birleşiyor. Markdown coverage kaydı olmayan Radar hisselerinde de sinyal sayfası çalışıyor. Midas kaynak seçimi, ortam değişkeniyle sabitlenmemişse mevcut dosyalar arasından en güncel olanı kullanacak biçimde düzeltildi.

**Başarı ölçütleri:** Detay sayfası açılma oranı, açıklama paneli etkileşimi, rapor okuma ve watchlist dönüşümü.

## Faz 2 — Sunucu taraflı watchlist ve uyarılar (temel sürüm tamamlandı)

- LocalStorage favorilerini kullanıcı hesabına taşı; birden fazla liste ve etiket desteği ekle.
- Kullanıcının Radar ekranından doğrudan liste oluşturmasını sağla.
- Sinyal değişimi, conviction eşiği, fiyat/stop ihlali ve earnings yaklaşımı için uyarı kuralları ekle.
- E-posta/uygulama içi bildirimlerde hangi faktörün değiştiğini açıkça belirt.

**Uygulama notu:** Radar ve Coverage favorileri ortak bir hesap tabanlı watchlist istemcisine taşındı. Oturum yoksa LocalStorage davranışı korunuyor; kullanıcı giriş yaptığında iki eski favori anahtarındaki hisseler varsayılan listeye otomatik aktarılıyor. Radar içinden çoklu liste oluşturma ve aktif liste seçme eklendi. Her hisse için yeni fırsat, sinyal değişimi, conviction eşiği, üst/alt fiyat ve earnings yaklaşımı kuralları düzenlenebiliyor. API, kullanıcı sahipliği doğrulanan koleksiyon/öğe CRUD uçlarını sağlıyor; public-access oturumu kullanıcı verisi yazamıyor. Mevcut `/api/watchlist` sözleşmesi varsayılan liste olarak geriye uyumlu bırakıldı.

**Dağıtım katmanı:** Kurallar her yeni Midas snapshot'ında değerlendirilir. Kalıcı rule-state tablosu aynı koşul devam ederken tekrar bildirim üretimini engeller; koşul bozulup yeniden gerçekleştiğinde kural tekrar devreye girer. Yeni fırsat, sinyal/faktör değişimi, conviction, üst/alt fiyat ve earnings olayları uygulama içi bildirim kutusuna yazılır. Okunmamış sayaç ve tekil/toplu okundu işlemleri kullanıcı hesabına bağlıdır. Her olay aynı anda e-posta teslimat kuyruğuna alınır; `WATCHLIST_ALERT_WEBHOOK_URL` tanımlıysa dakikalık worker tarafından gönderilir, tanımlı değilse veri kaybı olmadan pending kalır ve sağlayıcı bağlandıktan sonra işlenir. Başarısız teslimatlar artan bekleme süresiyle tekrar denenir.

**Başarı ölçütleri:** Aktif watchlist sayısı, haftalık geri dönüş, uyarı açılma oranı, uyarı sonrası detay görüntüleme.

## Faz 3 — Strateji lensleri ve portföy simülasyonu (temel sürüm tamamlandı)

- Tek bir “Momentum” skoru yerine mevcut faktörlerden doğrulanmış lensler üret: Opening Drive, Trend Continuation, Reversal, Defensive ve Catalyst.
- Her lens için ağırlıkları, veri kapsamını ve son kalibrasyon tarihini yayınla.
- Seçilen Radar listesinden eşit ağırlık/risk-parity sepet simülasyonu oluştur.
- Benchmark, drawdown, Sharpe, volatilite ve işlem maliyetini aynı grafikte göster; backtest ile live performansı kesin biçimde ayır.

**Uygulama notu:** Radar'a Opening Drive, Trend Continuation, Reversal, Defensive ve Catalyst lensleri eklendi. Her lens 0–100 aralığında hesaplanıyor; faktör adları ve ağırlıkları arayüzde yayınlanıyor, Midas kalibrasyon tarihi ve parametre sürümü gösteriliyor. Aktif watchlist, eşit ağırlık veya inverse-volatility risk parity yöntemiyle simüle ediliyor. Mevcut hisselerin gerçek `closes_21` dizileri kullanılıyor; kapsam yetersizse metrik üretilmiyor. İşlem maliyeti bps olarak ayarlanabiliyor; getiri, yıllık volatilite, Sharpe ve maksimum drawdown eşit ağırlıklı Midas evreniyle aynı grafikte karşılaştırılıyor. Sonuç yüzeyi bunun kısa snapshot-pencere simülasyonu olduğunu ve üretim backtest'i/tahmin olmadığını açıkça belirtiyor. Hesap sahipleri sepet konfigürasyonlarını ticker, ağırlık yöntemi ve maliyet varsayımıyla kaydedip silebiliyor.

**Başarı ölçütleri:** Strateji lensi kullanımı, simülasyon oluşturma, kaydedilen sepet ve ücretli dönüşüm.

## Faz 4 — Veri kapsamı ve içerik dağıtımı (temel sürüm tamamlandı)

- ABD likit evreninden sektör, ülke ve endeks evrenlerine kontrollü genişle.
- Fundamental veri kalitesi sağlandıktan sonra Growth, Quality ve Value lenslerini ekle.
- Radar çıktılarından otomatik ama editör kontrollü Watchtower benzeri günlük içerikler üret.
- Her içerikte yazar, metodoloji, veri zamanı ve ilgili ticker linklerini zorunlu kıl.

**Uygulama notu:** Midas kayıt sözleşmesi şirket adı, sektör, endüstri, ülke, borsa ve endeks üyeliklerini kayıpsız taşıyacak biçimde genişletildi. Radar sektör/ülke/endeks seçeneklerini gerçek snapshot evreninden türetiyor; ilgili metadata yoksa boş ya da sahte filtre göstermiyor. Fundamental veri kalitesi henüz doğrulanmadığı için Growth, Quality ve Value skorları bilinçli olarak üretilmedi. Her yeni Midas snapshot'ı TR ve EN için deterministik Watchtower taslağı oluşturuyor; mevcut editör değişiklikleri veya yayınlanmış kayıtlar otomatik olarak ezilmiyor. Admin çalışma alanında özet ve ticker tezleri düzenlenebiliyor, açık editör onayıyla yayınlanıyor. Public Momentum yüzeyi yalnız yayınlanmış kaydı gösteriyor. Her kayıtta yazar/onaylayan, metodoloji, kaynak zamanı, model sürümü, evren büyüklüğü ve Coverage bağlantıları zorunlu olarak saklanıyor.

## Kalite kapıları

- Her metrikte kaynak ve güncelleme zamanı görünür olmalı.
- Eksik veri skora sessizce `0` olarak girmemeli; coverage/confidence düşürülmeli.
- Snapshot, live ve backtest verileri aynı etiketi kullanmamalı.
- Yüzde formatları merkezi formatter'dan geçmeli; 100× gösterim hatası testle engellenmeli.
- Deep-link, mobil tablo, klavye erişimi ve TR/EN metinleri her sürümde doğrulanmalı.
- Yatırım tavsiyesi olmadığını belirten risk metni ve metodoloji bağlantısı kritik karar yüzeylerinde bulunmalı.
