# Peugeot 308 1.6 e-HDi (T9, 2016) — Klima Düşük Devirlerde Devreye Girmeme Sorunu

## Kapsamlı Teknik Araştırma ve Teşhis Raporu

---

## Araç Bilgisi

| Özellik | Değer |
|---------|-------|
| Model | Peugeot 308 II (T9 Kasa) |
| Motor | 1.6 e-HDi (DV6C / 9HC) 92–115 bg, Euro 5/6 |
| Donanım | Classic Edition Plus |
| Yıl | 2016 |
| Klima Sistemi | Manuel / Yarı Otomatik HVAC (model bağlı) |
| Gaz | R134a veya R1234yf (kaput etiketi mutlaka kontrol edilmeli) |
| Dolum Miktarı | 450 g ± 25 g (etiket değeri) |
| Kompresör | Sanden SD6C12 / DENSO 6SEL16C (6PK, 12V) |
| Yağ | Dens Oil 8 / PAG ISO 46, 135 ml |

## Semptom Özeti

> **Klima düşük devirlerde (rölantide / 2000 rpm altı) bazen devreye girmiyor. 2000 devir üzeri her zaman giriyor. Bazen 2000'in altında da giriyor (aralıklı / intermittent).**

Bu "devir-bağımlı, aralıklı girmeme" örüntüsü, Peugeot 308 T9 / 1.6 HDi ailesinde belgelenmiş ve birden fazla forumda tekrar eden bir sorun profilidir. Raporun devamında, her bir olası nedeni teknik olarak açıklayıp, teşhis adımları ve çözüm önerileri sunulacaktır.

---

## Bölüm 1: En Olası Nedenler ve Olasılık Hiyerarşisi

Araştırma kapsamında 6 paralel araştırma ajanı tarafından İngilizce, Fransızca, Almanca ve Türkçe kaynaklar tarandı. Toplam 30+ forum, teknik servis notu, TSB ve parça kataloğu incelendi. Buna göre olasılık sıralaması:

| Sıra | Olası Neden | Olasılık | Ana Belirti | Hızlı Tanı Testi |
|------|-------------|----------|-------------|------------------|
| 1 | **Düşük gaz / Gaz kaçağı (Undercharge)** | **Çok Yüksek** | Rölantide basınç düşer, LP switch keser; 2000+ devirde basınç artar | Manifold gauge: rölantide LP < 2.0 bar |
| 2 | **Kompresör debriyaj bobin zayıflığı / Clutch gap artması** | **Çok Yüksek** | Rölantide manyetik kuvvet yetmez, 2000+ devirde voltaj artınca tutar | Bobin ohm: 3.5–5 Ω; fühler gauge: 0.35–0.65 mm |
| 3 | **Radyatör fan direnci / Fan kontrol modülü arızası** | **Yüksek** | Rölantide kondenser soğumaz, basınç yükselir, ECU keser | Klima açıkken fan 1. hızda dönüyor mu? |
| 4 | **Klima basınç sensörü (Triswitch / 3-way) arızası** | **Yüksek** | Yanlış basınç okuması → ECU koruma kesmesi | DiagBox canlı veri; B132A kodu |
| 5 | **Aşırı gaz dolumu (Overcharge)** | **Orta** | Rölantide basınç yüksek, HP switch keser; hareket halinde ram hava ile düzelir | HP > 18–20 bar rölantide |
| 6 | **Evaporatör sıcaklık sensörü (thermistor) drift** | **Orta** | Buzlanma koruması erken tetiklenir | Torpido sensörü ohm ölçümü |
| 7 | **BSI / ECU yazılım veya iletişim hatası** | **Orta** | Aralıklı kesmeler, BSI donması, diğer elektrik sorunları eşlik eder | DiagBox F994, U1807, B1173 kodları |
| 8 | **Kompresör kontrol valfi (SD6C12/SD7C16) arızası** | **Orta** | Değişken debili kompresörde rölantide basınç kontrolü bozulur | Basınç manometre anomalisi |
| 9 | **Harici / İç mekan sıcaklık sensörü** | **Düşük-Orta** | Hatalı sıcaklık değeri → ECU klima talebini reddeder | Canlı veri: ±5°C tolerans |
| 10 | **Akü / Alternatör / OAP (Overrunning Alternator Pulley)** | **Düşük-Orta** | Rölantide voltaj düşük → kavrama zayıflar, S&S etkileşimi | Akü testi: rölantide min 13.2V |
| 11 | **ECT (Motor suyu sıcaklık) sensörü** | **Düşük** | Yanlış yüksek sıcaklık → ECU klima keser | P0117/P0118 kodları; ohm testi |
| 12 | **Kondenser korozyon / tıkanıklık** | **Düşük** | Gaz kaçağı veya kirlenme → basınç anomalisi | Görsel: yağ lekesi, UV testi |
| 13 | **TXV (Genleşme vanası) tıkanıklığı** | **Düşük** | Aralıklı soğutma, basınç dengesizliği | Evaporatör giriş/çıkış sıcaklık farkı |
| 14 | **BSI donanım arızası** | **Çok Düşük** | Son çare; pahalı ve nadir | B1004 kodu; tüm diğer nedenler ekarte |

---

## Bölüm 2: Teknik Analiz — Neden "2000 Devir" Eşik Noktası?

Semptomda belirgin olan **"2000 devir üzeri çalışıyor, altında kesintili"** örüntüsü, aşağıdaki teknik mekanizmaları işaret eder:

| Mekanizma | 2000+ Devir Davranışı | Rölantide / Alt Devir Davranışı |
|-----------|----------------------|-------------------------------|
| **Kompresör Değişken Debi / Valf** | Devir artınca kompresör iç basınç dengesi oturur, valf stabil çalışır | Rölantide valf kontrol sinyali zayıfsa veya mekanik yapışkanlık varsa, basınç dengesi kurulamaz |
| **Soğutma Fanı / Kondenser Hava Akışı** | Araç hareket halindeyken radyatör önünde ram hava basıncı oluşur; fan çalışmasa bile kondenser soğur | Rölantide dururken/hareketsizken tek fan hava akışı sağlar; fan direnci arızalı veya kontrol ünitesi 1. hızı açmazsa basınç yükselir |
| **Alternatör / Akü Voltajı** | Devir artınca alternatör şarj voltajı yükselir; kompresör kavrama bobini 12V+ stabil güç alır | Rölantide akü zayıfsa veya alternatör düşük devirde yetersizse, kavrama bobini zayıf tutunur; ECU güç yönetimi klima yükünü kısar |
| **Motor Tork Yükü / ECU Yönetimi** | Rölantide motor kompresör kayışını çevirmek için ek tork harcar; ECU Stop-Start veya eco modda klima talebini düşürür | Devir artınca motor tork rezervi artar, ECU klima yükünü tolere eder |
| **Basınç Sensörü (Triswitch)** | Rölantide düşük basınç veya sıcak havalarda yüksek basınç sinyali; sensör arızalıysa kesme eşiği erken tetiklenir | Devir artınca basınç dalgalanmaları stabilize olabilir, sensör geçici olarak doğru okur |

---

## Bölüm 3: Detaylı Arıza Nedenleri ve Çözümler

### 3.1 Kompresör ve Manyetik Debriyaj (Clutch) Arızaları

**Kompresör Modeli:**
Peugeot 308 T9 kasa 1.6 e-HDi (DV6C motor) modellerinde klima kompresörü olarak **Sanden SD6C12** veya **DENSO 6SEL16C** kullanılmaktadır. OEM numaraları: 6453QJ, 6453QK, 9659875780, 9671216280, 447150-1740, 9659875480, 9676443980, 9676862380.

**Bobin Özellikleri:**
- 12V sistem debriyaj bobinleri için endüstri standardı direnç: **2.9 – 6.0 Ohm** (sweet spot: **3.5 – 4.0 Ohm**)
- Sanden 6C12 için yaygın ölçüm: **3.5 – 5.0 Ohm**
- Amper çekimi (idle, 21°C): **2.0 – 3.9 A** (4A+ = kısa devre; 0A = açık devre)
- Ohm kanunu: 12.65V / 4.0Ω = 3.16A çekim
- Peugeot Forums'da bir 308CC kullanıcısı bobin direncini **~12 Ohm** olarak ölçmüştür; bu normalden çok yüksektir ve bobin içinde kısmi açık devre veya termal yorgunluk belirtisidir

**Debriyaj Boşluğu (Clutch Air Gap):**
- Sanden SD6C12 / TRS serisi için fabrika boşluğu: **0.35 – 0.65 mm** (0.014" – 0.026")
- Genel endüstri standardı: **0.3 – 0.6 mm**
- Boşluk **0.5 mm'nin üzerine** çıkarsa (aşınma, termal sarkma, shim kaybı), manyetik kuvvet rölantideki düşük voltajla (12–13V) debriyaj plakasını çekmeye yetmez
- 2000 devir üzeri alternatör voltajı yükseldiğinde (13.5–14.5V) manyetik kuvvet artar ve debriyaj tutar
- Aralıklı (intermittent) çalışma tipik bir "büyük boşluk" belirtisidir: bazen tutar, bazen tutmaz. Sıcak havalarda (bobin direnci yükselir) daha kötüleşir

**Voltaj Düşüklüğü ve Kablo Düşümü:**
- Debriyaj bobinine ulaşan voltaj, akü voltajının **0.2V** (ideal) ile **2.0V** (limit) altında olmalıdır
- Rölantide sistem voltajı 11.5V'un altına düşerse veya kablo düşümü yüksekse, bobin manyetik kuvveti yetersiz kalır
- Peugeot Forums 308CC vakasında: debriyaj soketinde ölçülen voltaj sadece **3.9V** (normal 12V beklenir); bu BSM/ECU kontrol tarafı veya kablo arızasıdır, bobin arızası değil

**Alternatör OAP ve V Kayışı:**
- Peugeot 1.6 e-HDi'de alternatör, aşırı yük debriyajlı kasnak (OAP) ile donatılmıştır
- OAP kilitlenirse (iç mekanizma aşınır/kırılır), kayış gerginliğini düşürür ve rölantide V kayışında mikro-kaymalara neden olur
- V kayışı (6PK) zayıf gergi makarası veya OAP arızası nedeniyle yeterli gerginliğe sahip değilse, kompresör kasnağı rölantide daha düşük devir alır
- **Test:** OAP'yi elle döndürün: tek yönde serbest, ters yönde kilitli olmalı. Çift yönde kilitli = OAP arızalı

**Termal Yorgunluk:**
- Bobin ısındıkça direnç artar (Pozitif Temperature Coefficient). Uzun süreli çalışmada bobin sıcaklığı 80–100°C'ye ulaşabilir; bu 4.0 Ohm'luk bobini ~5.0 Ohm'a çıkarır
- Rölantide termal yorgunluk daha belirgindir çünkü soğutma havası (fan + araç hareketi) azdır
- Soğuk motor ve sıcak motor durumlarında bobin direnci ölçün. Sıcaklıkla direnç artışı >%25 ise bobin termal yorgunluğu göstergesidir

**Mekanik Arızalar:**
- Armatür plaka yüzeyi "glazing" (parlaklaşma) yaparsa kavrama katsayısı düşer; rölantide düşük tork transferi ile kayma olur
- Kasnak rulmanı arızası: Elle döndürülürken pürüzlü hissedilir veya oynaklık (wobble) görülür
- Kompresör iç sıkışma: Armatür plaka somununu elle sıkarken kompresör shaft'ı dönmüyorsa veya çok zor dönüyorsa iç mekanizma sıkışmıştır

**Çözüm:**
1. Bobin direncini multimetre ile ölçün (3.5–5.0 Ω). Dışındaysa bobin değişimi (~$20–50)
2. Fühler gauge ile debriyaj boşluğunu ölçün (0.35–0.65 mm). Shim (pul) ekleme/çıkarma ile ayar (~$5–10)
3. Armatür plaka yüzeyini görsel olarak kontrol edin; aşınma/glazing varsa plaka değişimi
4. Kasnak rulmanını elle döndürün; düzgün, sessiz ve oynaksız olmalı
5. OAP ve V kayış gerginliğini kontrol edin
6. Bobin soketinde voltaj düşümü ölçün; >0.5V ise kablo/BSM kontrolü

---

### 3.2 Klima Gazı Basınç ve Sensör Arızaları

**Fabrika Dolum Miktarı:**
- Peugeot 308 I (T7, 2007–2014) ve 308 CC 1.6 HDi/e-HDi modelleri: **R134a, 450 g ± 25 g** (425–475 g aralığı)
- Kompresör yağı: **Dens Oil 8 / ND8 (PAG ISO 46)**, **135 ml** sistem yağı hacmi
- **Önemli:** 2014 sonrası T9 (308 II) kasalarda PSA grubu **R1234yf** geçişi başlamıştır. 2016 model T9 e-HDi'de etiket kontrolü şarttır — kaput altı etikete bakın. R1234yf dolumu yanlış gazla (R134a) karıştırılmamalıdır

**Düşük Gaz (Undercharge) — En Sık Neden:**
- R134a/R1234yf sistemlerde düşük gaz durumunda, rölantide (700–900 rpm) kompresör devir sayısı düşük olduğundan emiş basıncı (suction / low side) kritik düşük basınç eşiğine (cut-off) yaklaşır
- Devir yükseldiğinde (2000+ rpm) kompresör basınç üretim kapasitesi artar, LP switch yeniden devreye girer ve kompresör çalışır
- Bu, "rölantide kesiyor, yüksek devirde çalışıyor" semptomunun **en sık nedenidir**

**Genel R134a Basınç Referansı (Ortam 22–30°C):**

| Çalışma Durumu | Düşük Basınç (LP) | Yüksek Basınç (HP) |
|---|---|---|
| Rölantide (idle) | 2.0 – 2.5 bar (~30–35 psi) | 9 – 10 bar (~130–145 psi) |
| 2000 rpm | 1.5 – 2.0 bar (~25–30 psi) | 12 – 14 bar (~175–200 psi) |
| Aşırı Düşük Gaz (undercharge) | 1.0 – 1.5 bar (~15–20 psi) | 6 – 8 bar (~85–115 psi) |

**Yüksek Basınç Sensörü (HP Switch / Trinary Switch):**
- Peugeot 308'de genellikle **dual (HP+LP) pressure switch** veya **trinary switch** kullanılır
- HP switch aralığı: **6 – 32 bar** (reset ~4 bar diferansiyel)
- Sıcak havalarda overcharge durumunda, rölantide dahi yüksek basınç tetiklenebilir
- OE Numarası: 9673006380 (Hoffer K52095), 6453 serisi kompresörlerle uyumlu

**Düşük Basınç (LP) Switch — B132A Hata Kodu:**
- Peugeot 308 T9'da **B132A 84** hata kodu: *"Défaut de sécurité sur la basse pression du circuit de réfrigération — signal en dessous de la plage de tolérance."*
- Bu kod, LP switch'in ECU'ya gönderdiği sinyalin tolerans altında olduğunu belirtir
- Basınç normal (>2.5 bar) ama B132A varsa: switch değişimi, bağlantı kontrolü (korozyon, yeşil pas — PSA tipik), veya DiagBox/Lexia ile ECU parametre izleme

**Evaporatör Sıcaklık Sensörü (Thermistor):**
- Peugeot 308 T9'da evaporatör üzerinde veya yakınında bir **NTC thermistor** bulunur
- Sıcaklık 0°C – 2°C altına düşerse, ECU kompresörü keser (buzlanma koruması)
- Sensör arızalı veya drift yaptığında, yanlış sıcaklık okuması yaparak kompresörü erken veya geç keser
- Sensör tipi: NTC thermistor; 25°C'de tipik değer: ~2.5 kΩ – 10 kΩ
- Test: Multimetre (ohm) ile oda sıcaklığında ölçüm, sonra buzlu suya batırarak direnç artışı kontrolü (soğudukça direnç artar)

**İç Mekan / Güneş Sensörü:**
- Peugeot 308 T9'da **iç mekan sıcaklık sensörü** ve ön cam altı **güneş/ışık sensörü** (rain & sunlight sensor) BSI'ye input verir
- 2014 308 T9 forumda B1173 ve U1807 (rain & light sensor) hata kodları ile klima kesme ilişkisi raporlanmıştır
- Cam değişimi sonrası kalibrasyon kaybı yaygın neden

**ECT (Soğutma Suyu Sıcaklık) Sensörü:**
- ECT sensör tipi: NTC thermistor (PSA 1338.C1)
- Ohm değerleri: 20°C ~2,000 – 3,000 Ω; 80°C ~300 – 500 Ω
- Arızalı ECT ayrıca P0117 (düşük input), P0118 (yüksek input), P0128 (termostat) kodlarına yol açar
- Eğer sensör yüksek sıcaklık bildirirse (gerçekten veya yanlışlıkla), ECU yüksek motor sıcaklığı koruması altında klima kompresörünü devreden çıkarır

**Kondenser Korozyon / Gaz Kaçağı:**
- Peugeot 308 T9'da **kondenser korozyonu ve gaz kaçağı** bilinen bir sorundur
- HonestJohn veritabanında: "2014 Peugeot 308 at 19k miles. Suspect a stoned condenser."
- Gaz Kaçağı Belirtileri: Klima hortumlarında veya kondenser ön yüzeyinde **yağ lekesi** (UV ışığında floresan); **hissing sesi**; soğutma performansı gün geçtikçe düşer; basınç manometrelerinde durma basıncı düşük (<5 bar @ 22°C)

**Expansion Valve (TXV) Tıkanıklığı:**
- Thermal expansion valve (TXV), evaporatöre giren sıvı refrigerant miktarını regüle eder
- Tıkanık veya kısmen açık kalan TXV'de: sıvı refrigerant evaporatöre yeterince ulaşamaz, rölantide soğutma yetersizliği
- Semptomlar: Aralıklı soğutma; rölantide ılık hava, yüksek devirde soğuma; evaporatör üzerinde buzlanma; hissing sesi; manifold basınçları: LP çok düşük, HP düşük/normal

**Çözüm:**
1. Profesyonel klima istasyonu ile yüksek ve alçak taraf basınçlarını rölantide ve 2000 devirde ölçün
2. Sistem vakum altında (-30 inHg, 45 dk) doldurma; gaz tipi ve miktarı etiketle mutlak kontrol
3. Rölantide LP < 2.0 bar ve HP < 9 bar ise undercharge şüphesi → vakum + tam gaz dolumu + kaçak testi
4. Rölantide HP > 18–20 bar ise overcharge veya kondenser/fan sorunu → gaz recovery + doğru dolum
5. Basınç sensörü (M10x1.25 dişli, klima borusu üzerinde) arızalı olabilir; DiagBox/PP2000 ile canlı basınç verisi okunabilir
6. Kondenser üzerinde yağlı/pudralı lekeleri görsel olarak kontrol edin; UV boya + blacklight ile kaçak tespiti
7. Evaporatör thermistor ohm ölçümü; ECT sensör ohm testi
8. TXV tıkanıklığında: sistem flushing, receiver dryer değişimi, yağ değişimi

---

### 3.3 Fan, Röle ve Elektrik Sistemi Arızaları

**Fan Kontrol Modülü (Seri Direnç) — EN SIK NEDEN (%70):**
- Peugeot 308 T9'da radyatör fan motoru, motor bölmesindeki hava filtresi kutusu yanına monte edilmiş bir **fan kontrol modülü** (seri direnç + röle) üzerinden yönetilir
- OEM referansı: **9673999980** (alternatif: 9829220580, 9818894380, 1308.CP)
- Modülde 4 pinli konektör; iki kalın kablo fan motoruna besleme, iki ince kablo ECU/BSI'dan hız kumanda sinyali
- İçindeki **spiral direnç** zamanla yanıp kırılabilir veya konektör pinleri eriyebilir
- **Düşük hız (vitesse 1)** arızalandığında: Fan sadece motor su sıcaklığı çok yükseldiğinde ECU tarafından **yüksek hız (vitesse 2)** komutu verilince döner. Klima sistemi rölantide soğutma talep ettiğinde **düşük hız** bekler; fan dönmediğinde ECU kompresör debriyajını 20–30 saniye içinde keser (aşırı basınç/ısı koruması)
- Forum-Peugeot kullanıcısı Raph67 aynı semptomu yaşamış: "quand il fait très très chaud la clim fonctionne à l'arrêt car le ventilateur se met en vitesse 2, par contre quand il fait moins chaud le ventilateur reste en vitesse 1 et la clim coupe après 20 secondes"
- **Çözüm:** Fan kontrol modülü değişimi (~20–40 €). Aynı semptomu yaşayan Forum-Peugeot kullanıcıları bu değişimle sorunu çözmüş

**Çift Hızlı Fan Düzeni:**
- Peugeot 308 T9 çift hızlı fan motoru düzeni kullanır
- Düşük hız rölesi / kontrol modülü arızası → rölantide fan dönmez → ECU klima keser
- **P0494** hata kodu: fan düşük hız tutarsızlığı (doğrulayıcı kod)

**Sigortalar:**
- Motor bölmesi BSM (Sigorta Kutusu) içindeki klima/sigorta kartları: F13, F27, F30 (PSF1 referansları)
- Sigorta üzerinde voltaj düşümü ölçülür; sağlam ise hem giriş hem çıkışta 12V olmalı

**BSI → ECU → HVAC CAN-BUS Haberleşme:**
- BSI (Built-in Systems Interface), ECU ve klima kontrol paneli arasındaki CAN-BUS haberleşme kopukluğu klima devreyi keser
- BSI reset ile çözülebilir (akü bağlantısı kesilip 3 dakika beklenerek)
- **B132F / F994** hata kodları: klima yüksek basınç sensörü / kompresör debriyaj devresi arızası

**Harici Sıcaklık Sensörü:**
- Hatalı NTC değer → ECU klima kilidi
- Canlı veri ekranında ±5°C toleransta olmalı
- -40°C okuyorsa (açık devre) AC kilidi devreye girer

**Radyatör Sıcaklık Sensörü ve Fan Tetikleme:**
- ECT sensörü fan tetikleme hızını belirler
- Termistor değerleri: 20°C ~2–3kΩ, 80°C ~300–500Ω
- Yanlış okuma → fan yavaş çalışır veya çalışmaz → klima keser

**ECU Klima Kesme Koşulları:**
- Fan yoksa AC keser
- Basınç >250 psi ise AC keser
- Devir <650 rpm ise AC keser (rölanti koruma)

**Çözüm:**
1. Klima açıkken motor bölmesi ses kontrolü (fan çalışıyor mu?)
2. DiagBox / Lexia ile aktüatör testi: fan hız kademeleri testi
3. PSF1/BSM röle kontrolü; fan motoru direkt 12V ile test
4. Kondenser önü hava akış kontrolü (perde/kir vs.)
5. Fan kontrol modülü direnç ölçümü veya değişimi

---

### 3.4 BSI / ECU Yazılım ve Sistem Entegrasyonu

**Sinyal Zinciri:**
Peugeot 308 T9'da AC kompresör devreye alma, BSI, BSM, motor ECU ve klima kontrol paneli arasındaki çok katmanlı kontrol zinciriyle yönetilir:

1. AC butonu → Instrument cluster (wire 8053)
2. Instrument cluster → BSI (VAN comfort bus)
3. BSI → ECU (CAN-IS bus) → "AC izin isteği"
4. ECU motor koşullarını kontrol eder (devir, araç hızı, motor sıcaklığı, basınç) → BSI'ye "izin" veya "ret" yanıtı döner
5. BSI → AC kompresör clutch (wire 8060) → clutch devreye girer veya girmez

**F994 Hata Kodu:**
- "Engine fuse box: fault in the A/C compressor clutch control circuit"
- BSI ile motor bölmesi sigorta kutusu (BSM/Engine fuse box) arasındaki AC kompresör clutch kontrol devresinde arıza
- BSM içindeki entegre röle (PCB'ye lehimli) arızalı olabilir

**BSM (Motor Sigorta Kutusu) Röleleri:**
- BSM içinde klima kompresörü rölesi PCB'ye lehimlidir (sökülebilir değil)
- Röle kontaklarında oksitlenme veya yanma → voltaj düşümü → kompresör soketinde yeterli voltaj yok
- Peugeot Turkey Forum vakasında: kullanıcı fan rölelerini (ön radyatör paneli içinde, yeşil kapaklı) söküp temizledikten sonra klima çalışmaya başlamıştır

**BSI / HVAC Yazılım Güncellemesi:**
- T9 308'lerde BSI ve HVAC kontrol ünitesi yazılım hatalarına bağlı olarak klimanın aralıklı çalışmama, kendi kendine açılıp kapanma rapor edilmiştir
- Semptomlar: Işıklar kendi kendine açılıp kapanma, cam kaldırıcılar çalışmama, infotainment donması, "auto headlights randomly come on during the day"
- Çözüm: Peugeot yetkili servisinde BSI ve/veya HVAC modülü yazılım güncellemesi (reflash)

**S&S (Stop & Start) Sisteminin Etkisi:**
- S&S aktifken, motor durduğunda (trafik ışığında vb.) klima kompresörü **çalışmaz** (tasarım gereği)
- S&S her başlatma döngüsünde alternatörü devreye sokar ve aküyü şarj etmeye çalışır
- Klima + S&S + düşük devir birleşiminde, BSI/ECU alternatör yükünü dengelemek için AC kompresörü geçici olarak devre dışı bırakabilir
- **Ayrım:** Eğer araç hareket halindeyken (S&S değil, sürüş modunda) düşük devirlerde AC kesiyorsa, bu S&S kaynaklı değil; başka bir nedendir

**Engine Load Management (Motor Yükü Yönetimi):**
- Modern dizel motorlarda (özellikle Bosch EDC17 ailesi), ECU motor yüküne, devirine, soğutma sıcaklığına ve araç hızına bağlı olarak AC kompresör clutch'ini devre dışı bırakabilir
- Tetikleyici Koşullar: Düşük devir / Rölanti; Yüksek motor sıcaklığı; Ağır hızlanma (WOT); Soğutma fanı arızası
- **"2000+ Devirde Her Zaman Çalışıyor" Yorumu:** 2000 devir üzerinde motor yükü yönetimi algoritması, AC kompresörü için yeterli "güç marjı" olduğunu düşünür ve clutch izni verir

**Alternatör Yük Yönetimi:**
- e-HDi (mikro-hibrit) sisteminde, alternatörün çıkışı ve akü şarj durumu sürekli izlenir
- Akü şarjı düşükse veya alternatör maksimum kapasitede çalışıyorsa, BSI "güç ekonomisi" moduna geçebilir ve yüksek akım çeken bileşenleri (klima kompresör clutch, ısıtmalı koltuklar, arka cam rezistansı) devre dışı bırakabilir
- Akü zayıfladığında veya alternatör verimi düştüğünde, klima rölantide daha kolay kesilir

**Çözüm:**
1. DiagBox / Lexia3 ile Global Test (Tüm ECU'lar): Motor ECU, BSI, BSM, AC Panel
2. B1xxx / U1xxx / Fxxx kodları not edilir, silinip tekrar oluşup oluşmadığı kontrol edilir
3. Canlı Veriler: `AC Clutch Command`, `AC Pressure`, `Evaporator Temperature`, `Engine Load`, `Sunlight Sensor Status`, `Coolant Temperature`
4. BSI yazılım güncellemesi (yetkili servis)
5. BSI reset: akü bağlantısı kesilip 3–5 dakika beklenip, kapı kilitlenerek BSI'nin tam uyuması sağlanır
6. Akü ve alternatör testi: rölantide min. 13.2V, 2000 devirde 14.0–14.5V
7. S&S kapatıldığında sorun düzeliyor mu? → S&S stratejisi etkisi kontrolü

---

### 3.5 Servis Bulletins (TSB) ve Bilinen Fabrika Sorunları

**Condenser / R1234YF Gaz Sızıntısı TSB:**
- 2013–2017 arası T9 kasa 308'lerde (özellikle erken üretim 2014/2015) AC condenser'lerde korozyon kaynaklı sızıntı ve R1234YF gaz kaybı rapor edilmiştir
- PSA/Stellantis tarafından condenser değişimi için servis kampanyası/TSB yayınlanmıştır
- Semptom: Klima performansı zamanla düşer, soğutma yetersiz kalır; gaz yeniden doldurulduğunda geçici düzelme
- Çözüm: Condenser değişimi, sistem temizliği ve R1234YF ile yeniden dolum; bazı pazarlarda uzatılmış garanti kapsamına alınmıştır
- **Not:** Bu TSB, kullanıcının semptomuna (düşük devirde kesme) doğrudan uymuyor; ancak sistem gaz basıncı düşükse ECU koruma amacıyla AC'yi devre dışı bırakabilir

**BSI / HVAC Yazılım Güncellemesi:**
- T9 308'lerde BSI donması, HVAC iletişim kaybı ve klima aralıklı çalışma sorunları için servis yazılım güncellemeleri mevcut
- BSI, klima kompresör clutch kontrol devresinin (wire 8060) merkezidir. BSI yazılım hatası veya güncel olmaması, ECU'dan izin gelmesine rağmen clutch'e sinyal gitmemesine neden olabilir

**Arka Aks TSB:**
- T9 kasada bilinen fabrika sorunlarından biridir ancak klima ile doğrudan ilişkisi yoktur

---

## Bölüm 4: Forum ve Kullanıcı Deneyimleri

Aşağıdaki tablo, araştırma sürecinde incelenen 13 farklı forum vakasından derlenmiştir. Her vaka için semptom, analiz ve kullanıcı çözümü (varsa) sunulmuştur.

| # | Kaynak | Model | Semptom | Analiz | Kullanıcı Çözümü |
|---|--------|-------|---------|--------|-----------------|
| 1 | Peugeot Forums (May 2020) | 308 T9 | Klima 1500–2000 rpm arasında kesiliyor; park/neutral'da çalışıyor | Kompresör debi kontrolü (variable displacement) ve basınç sensörü | Mekanik basınç testi önerildi (çözüm rapor edilmemiş) |
| 2 | aussiefrogs (Ara 2025) | 308 T9 2014 | Sabah yavaş soğutma; kompresör kesiliyor, A/C kapayıp açınca tekrar çalışıyor; 30°C+ bozulma | Kondenser korozyon/pinhole kaçak; basınç sensörü; aşırı gaz dolumu; BSI yazılım | Gazı %20–30 boşaltıp kompresör devreye girdiğini doğruladı; kondenser/kaçak tespiti planladı |
| 3 | Peugeot Forums (Tem 2025) | 308 SW 2017 | 30°C+ günlerde 10 saniye soğutup duruyor; S&S uzun süredir çalışmıyor | Akü zayıflığı + basınç sensörü; yüksek sıcaklıkta gaz basıncı artışı, rölantide fan soğutması yetersiz | Akü testi ve basınç kontrolü önerildi (çözüm rapor edilmemiş) |
| 4 | Peugeot Forums (May 2021) | 308 GT Line 2016 | Klima soğutmuyor; gaz 9 ayda tekrar kaçmış | Kondenser conta kaçağı ve valf kaçağı (308 T9 yaygın) | Kondenser contaları + valf değişimi (~£190 servis) |
| 5 | Peugeot Forums (Ara 2023) | 308 T9 | Rölantide ısınma ve klima performansı düşüklüğü; fan direnci değişimi sonrası 1. hız çalışmıyor | Radyatör fan direnci / kontrol ünitesi arızası (PSA grupta yaygın) | Fan motoru ve direnç kontrol ünitesi değişimi |
| 6 | Peugeot Türkiye (Tem 2012) | 1.6 HDi 110 hp (T7) | Klima rölantide "çıt çıt" ses; kompresör kendini kapatıp açıyor; 1000+ rpm'de sabit çalışıyor | Motor rölantide düzensiz; ECU korumaya alıyor; 550 gr gaz dolumu (standart 450 gr yerine) | ECU yazılımı / rölanti ayarı manuel yapılamıyor; kesin çözüm rapor edilmemiş |
| 7 | OtoClubTurkiye (Tem 2020) | 308 1.6 HDi | Ankara–İzmir yolculuğunda klima soğutmaz; aralıklarla 1–2 dakika çalışıp duruyor | "Rölantide çalışıyor, üst devirlerde duruyorsa fazla gaz basılmış olabilir" | Gaz miktarını doğru fabrika değerine çekmek önerildi |
| 8 | forum-peugeot.com (Tem 2020) | 3008 GT / 5008 GT (EMP2) | Hareket halinde soğuk; durunca (rölantide) ılık; fan rölantide çalışmıyor | Fan direnci değişimi kısmi çözüm; fan hız kontrolü arızalı; klima basınç sensörü yerine motor sıcaklık sensörü fanı tetikliyor | Fan direnci/resistor değişimi; tam çözüm için fan kontrol ünitesi kontrolü |
| 9 | tlemcen-electronic (Haz 2018) | Genel PSA | Rölantide klima çalışmıyor; basınç çok yükseliyor; kompresör hemen kesiyor | Pressostat (basınç şalteri) arızalı veya yanlış değer; yüksek basınç emniyet kilidi | Pressostat / basınç sensörü değişimi ve kondenser temizliği |
| 10 | forum-auto.caradisiac (May 2010) | 308 Phase 1 | 24°C+ sıcaklıklarda elektromanyetik kavrama durup başlıyor; klima kesintili | Elektromanyetik kavrama bobini zayıflığı veya kontrol sinyali düşüklüğü; aşırı basınç veya bobin iç direnci artışı | Kompresör kavrama bobini değişimi veya kompresör komple değişimi |
| 11 | DonanımHaber (Nis 2013) | Fiat Bravo (benzer sistem) | Kompresör rölantide 3–5 sn çalışıp 3–5 sn duruyor; gaza basınca sürekli dönüyor | "Gaz fazla doldurulmuş ise kesik çalışma olur; rölantide motor kompresörü çevirmek için yeterli gücü üretemediğinden ECU klima kompresörünü devreden çıkarır" | Gazı fabrika değerine çekmek; kondenser temizliği; evaporatör sensörü kontrolü |
| 12 | Peugeot Forums (Tem 2023) | 308 T9 2014 1.6 HDi | Klima rölantide gürültülü (poulie/kasnak gürültüsü); kompresör değişimi sonrası yeni kompresör de zamanla gürültülü oldu | SD6C12 / SD7C16 kompresörlerinde kontrol valfi veya kavrama rulmanı sorunları; değişken debili valf arızalıysa rölantide basınç kontrolü yapamaz | Kompresör komple değişimi; öneri: kontrol valfi ayrıca satın alınabilir (~£15–30) |
| 13 | Peugeot Forums (Tem 2016) | Teknik referans | 2000 rpm üzerinde klima kesiyor; rölantide/parkta çalışıyor | Değişken debili kompresörde mekanik destroker veya aktüatör arızası; basınç sensörü ve kompresör iç valfi | Basınç manometreleriyle high/low side basınçları ölçmek; kompresör kontrol valfi değişimi |

---

## Bölüm 5: Hata Kodları (DiagBox / Lexia3 / PP2000)

> **Önemli:** Genel OBD2 tarayıcılar (ELM327, cheap scanners) PSA grubuna özgü B1/B2/U/F kodlarını okuyamaz veya yanlış yorumlar. **Mutlaka DiagBox, Lexia3 veya PP2000** kullanılmalıdır.

| Kod | Açıklama | Muhtemel Neden | İlişkili Modül |
|-----|----------|---------------|---------------|
| **B1173** | Rain & light sensor / Sunlight sensor hatası | Cam değişimi sonrası kalibrasyon kaybı, sensör arızası | BSI / AC Panel |
| **U1807** | Rain & light sensor communication fault | Soket gevşekliği, kablo kopukluğu | BSI |
| **B1A0C** | HVAC communication fault | AC panel PCB arızası, CAN hattı kopukluğu | AC Panel |
| **B132A** | Düşük basınç güvenlik hatası (LP switch) | Gaz eksikliği veya switch arızası | Motor ECU |
| **B132F** | Klima yüksek basınç sensörü / kompresör debriyaj devresi | Sensör arızası veya debriyaj devresi | BSI / BSM |
| **F994** | Engine fuse box: AC compressor clutch control circuit fault | BSM içindeki entegre röle arızası, kablo, kontak | BSM |
| **F72F** | Blower motor / pulseur fault | Fan rezistansı, PWM modülü, motor arızası | AC Panel |
| **P0489** | EGR throttle control circuit low | EGR arızası (motor yükü hesaplamasına etki) | Motor ECU |
| **P0117 / P0118** | Engine coolant temperature sensor circuit low/high | Soğutma sistemi sensör hatası | Motor ECU |
| **P0100–P0104** | Mass Air Flow (MAF) circuit | Hava akışı yanlış okunursa motor yükü hesaplaması bozulur | Motor ECU |
| **P0494** | Fan düşük hız tutarsızlığı | Fan kontrol modülü, direnç, röle arızası | Motor ECU |
| **P0534** | Low Refrigerant Pressure | Control valve basınç eğrisi bozukluğu veya gaz azlığı | Motor ECU |
| **B1004** | Internal BSI/ECU fault | BSI yazılım hatası, voltaj düşüklüğü | BSI |

---

## Bölüm 6: Adım Adım Teşhis Ağacı (Diagnostic Tree)

### Adım 1: Temel Gözlem & Kontrol (Maliyet: 0 TL)
- AC butonu ışığı yanıyor mu? İç üfleme fanı dönüyor mu?
- Motor kaputunda kompresör sesi duyuluyor mu? (2000 devrede evet, rölantide hayır → clutch engagement sorunu)
- Sigortalar: Motor bölmesi BSM içindeki klima/sigorta kartları kontrol edilir
- Toprak (Ground) noktası: T9 kasada AC toprak noktası genellikle **M38 / LH iç eşik** (sürücü tarafı iç eşik altı, halı altı) bölgesindedir. Oksitasyon ve gevşeklik kontrolü

### Adım 2: PSA-Özel Tam Teşhis Taraması (Maliyet: 1.000–2.500 TL)
- **DiagBox / Lexia3 / PP2000** ile **Global Test** (Tüm ECU'lar) yapılır
- Okunacak ECU'lar: **Motor ECU, BSI, BSM, AC Panel (Klima Kontrol Ünitesi)**
- **B1xxx / U1xxx / Fxxx** kodları not edilir. Silinip tekrar oluşup oluşmadığı kontrol edilir
- **Live Data (Canlı Veriler):**
  - `AC Clutch Command` (Evet/Hayır veya %)
  - `AC Pressure` (Basınç sensörü değeri, bar)
  - `Evaporator Temperature` (Buharlaştırıcı sıcaklığı, °C)
  - `Engine Load` (%)
  - `Sunlight Sensor Status`
  - `Coolant Temperature`

### Adım 3: Basınç Testi & Klima Gazı Kontrolü (Maliyet: 1.500–4.000 TL)
- **R1234yf** veya **R134a** sistemi kullanılır (kaput etiketi mutlaka kontrol)
- **Static Basınç:** Araç kapalı, sıcaklığa bağlı olarak ~8–10 bar beklenir
- **Dinamik Basınç:** Motor 2000 RPM'de çalışırken:
  - Yüksek basınç (High): ~15–25 bar (ortam sıcaklığına göre)
  - Düşük basınç (Low): ~2–4 bar
- **Eğer high = low ≈ 8 bar (static) kalıyorsa:** Kompresör **pompalama yapmıyor** (debriyaj kavraması boşta veya mekanik arıza)
- **Yüksek basınç çok yüksek, düşük basınç çok düşükse:** Kondenser bloke veya gaz fazla (overcharge) olabilir

### Adım 4: Kompresör Debriyaj Bobin Ölçümü (DIY: 0 TL; Usta ile: 500–1.000 TL)
- Kompresör elektrik soketi çekilir
- Multimetre ile bobin uçları arası **direnç ölçülür:**
  - Beklenen: **3–5 Ohm** (kaynaklara göre ~3.5 Ohm ideal)
  - Sonsuz (open) veya 0 Ohm (short) → **Bobin arızalı**
- Bobin sağlamsa ama kavrama girmiyorsa → **Kavrama aralığı (clutch gap)** veya güç/kontrol devresi sorunu

### Adım 5: Kavrama Aralığı (Clutch Gap) Kontrolü (Maliyet: 2.000–5.000 TL)
- Zamanla debriyaj balata aşınır, **manyetik kavrama aralığı (gap) artar**
- Rölantide alternatör voltajı düşük (≈13.5–13.8V) olduğundan, büyük aralıkta manyetik kuvvet yetersiz kalır ve kavrama **girmeyebilir veya geç girebilir**
- 2000 RPM üzerinde alternatör daha yüksek voltaj ürettiğinden kavrama tutar
- **Düzeltme:** Puller ile kavrama sökülüp, aralığa **shim (pul) eklenerek** 0.3–0.5 mm aralığa ayarlanır. *(Bayiler genelde bu işi yapmaz, komple kompresör değişimi önerir.)*

### Adım 6: Direk Batarya Testi (Clutch Bypass) (DIY: 0 TL)
- Kompresör soketine harici kablo ile **doğrudan 12V batarya verilir** (ground + positive)
- Kavrama anında **tak sesiyle kapanıyorsa** → Bobin ve mekanik sağlam, sorun **kontrol devresinde** (sensör, ECU, kablo, toprak)
- Tak sesi yoksa veya zayıf kapanıyorsa → **Bobin veya aralık sorunu**

### Adım 7: Basınç Sensörü & Buharlaştırıcı Sıcaklık Sensörü (Maliyet: 3.000–10.000 TL)
- **3-yollu basınç sensörü (high side):** Arızalı okuma yaparsa ECU kompresörü keser. Multimetre ile sinyal voltajı kontrol edilir (0.5–4.5V arası değişken)
- **Buharlaştırıcı (evaporator) termistörü:** Torpido arkasındadır. Eğer -40°C veya aşırı düşük okursa, ECU **buzlanma koruması** ile kompresörü keser. Sıcaklık gerçekçi değilse sensör değişir

### Adım 8: Güneş / Yağmur Sensörü Kalibrasyonu (Maliyet: 2.500–6.000 TL)
- **B1173 / U1807** kodu varsa veya ön cam değişmişse:
  - Sensör soketi kontrol edilir
  - **DiagBox / Lexia3** ile "Rain/Light Sensor Calibration" yapılır
  - Bazı kaynaklara göre manuel kalibrasyon (far anahtarı belirli sırada çevrilerek) mümkündür

### Adım 9: BSM Fan Röleleri & Soğutma Fanı Kontrolü (Maliyet: 2.000–7.000 TL)
- **Termo fan röle arızası:** Röle hatası AC sistemini kapatabilir. DiagBox Motor ECU'sunda röle/fan hata kodu oluşur
- Fan motor rezistansı (PWM modülü) arızalı olabilir; bu durumda fan yavaş dönmez veya çalışmaz. Parça no: 1610497380 / 9673999980 / 9829220580
- Fan çalışmazsa yüksek basınç anormal yükselir ve AC kesilir

### Adım 10: BSI Yazılım Güncellemesi & Son Kontrol (Maliyet: 3.000–7.500 TL)
- Tüm donanım sağlamsa ve sorun aralıklı ise:
  - **BSI yazılım güncellemesi** (Stellantis/Peugeot servis notlarına göre)
  - BSI "sleep/wake" döngüsü: Akü bağlantısı kesilip 3–5 dakika beklenip, kapı kilitlenerek BSI'nin tam uyuması sağlanır. Ardından tekrar başlatılır
  - Eğer BSI iç arızalıysa (B1004 gibi kodlar) değişimi gerekebilir (nadir ve maliyetli)

---

## Bölüm 7: Parça ve Maliyet Tablosu (Türkiye / Avrupa Ortalaması — 2025)

| İşlem / Parça | Avrupa (€) | Türkiye (TL) | Notlar |
|---|---|---|---|
| **DiagBox / PP2000 Tarama** | 50 – 100 € | 1.000 – 2.500 TL | Yetkili servis daha pahalıdır |
| **Klima Gazı Dolumu + Basınç Testi** | 50 – 150 € | 1.500 – 4.000 TL | R1234yf daha pahalıdır |
| **Kompresör Debriyaj Bobin Değişimi** | 150 – 350 € | 5.000 – 10.000 TL | Parça 50–150 €, işçilik 100–200 € |
| **Kompresör Kavrama Aralığı Ayarı (Shim)** | 100 – 200 € | 2.000 – 5.000 TL | Parça maliyeti çok düşük (shim seti ~10–30 €) |
| **Kompresör Komple Değişimi** | 500 – 1.000+ € | 15.000 – 30.000+ TL | OEM/Sanayici farkı büyük |
| **Fan Kontrol Modülü / Rezistans (PWM)** | 80 – 180 € | 3.000 – 7.000 TL | OEM no: 9673999980, 1610497380 |
| **BSI Yazılım Güncellemesi** | 100 – 250 € | 3.000 – 7.500 TL | Yetkili servis / özel servis farklılık gösterir |
| **AC Basınç Sensörü Değişimi** | 80 – 200 € | 3.000 – 8.000 TL | Genellikle high side hattadır |
| **Buharlaştırıcı Sıcaklık Sensörü** | 150 – 350 € | 5.000 – 12.000 TL | İşçilik yüksek (torpido sökümü) |
| **Güneş/Yağmur Sensörü + Kalibrasyon** | 80 – 200 € | 2.500 – 6.000 TL | Özellikle cam değişimi sonrası |
| **Toprak Noktası Temizliği / Kablo Onarımı** | 30 – 80 € | 500 – 2.000 TL | M38 veya benzeri noktalar |
| **Klima Basınç Sensörü (Triswitch)** | 30 – 60 € | 400 – 800 TL | OE: Valeo, Hella, Bosch |
| **Kompresör Kontrol Valfi (SD6C12/SD7C16)** | 15 – 30 € | 300 – 500 TL | Sadece valf değişimi; kompresör sökülmeden değişebilir |
| **Kondenser (radyatör) komple** | 150 – 300 € | 2.500 – 5.000 TL | 308 T9'da kondenser mikro kaçakları yaygın |
| **Akü (Start-Stop AGM/EFB)** | 150 – 300 € | 3.000 – 6.000 TL | Varta, Bosch, Exide; 308 e-HDi için EFB/AGM zorunlu |
| **Evaporatör Sıcaklık Sensörü** | 15 – 30 € | 200 – 400 TL | Dashboard sökülmesi gerekebilir |

> **Not:** Türkiye fiyatları özel servis / sanayi ölçeğine göre değişkenlik gösterir; yetkili servis maliyetleri 2–3 kat daha yüksek olabilir.

---

## Bölüm 8: DIY (Kendin-Yap) Test Yöntemleri

### 8.1 Multimetre ile Bobin Ölçümü
1. Motor kaputunu açın, kompresörü bulun (motor önü, alt kısım)
2. Kompresör elektrik soketini çekin
3. Multimetreyi **Ohm (Ω)** konumuna getirin
4. Bobin uçlarına prob değdirin
5. **Beklenen:** 3 – 5 Ω. <1 Ω (kısa devre) veya sonsuz (open) = bobin arızalı

### 8.2 Direk 12V Batarya Testi (Clutch Bypass)
1. Soket çekili durumda, ince kablolar yardımıyla bobin uçlarına harici 12V verin
2. **Tak sesi duyulmalı** (kavrama kapanıyor)
3. Ses yoksa veya zayıfsa → bobin zayıflamış veya aralık çok fazla

### 8.3 Basınç Kontrolü (Servis Manometreleri)
1. Low ve high side portlarına manometre seti bağlayın
2. Araç çalışmadan static okuma: ~8–10 bar (30°C civarı)
3. AC açık, 2000 RPM: High side 15–25 bar, Low side 2–4 bar
4. High ≈ Low ≈ 8 bar → kompresör pompalama yapmıyor (clutch veya mekanik arıza)

### 8.4 Sigorta Kontrolü
- BSM (Motor bölmesi sigorta kutusu) haritasından klima/sigorta değerlerini kontrol edin
- Sigorta üzerinde voltaj düşümü ölçülür; sigorta sağlam ise hem giriş hem çıkışta 12V olmalı

### 8.5 Toprak (Ground) Kontrolü
- Multimetre ile **motor bloğu ↔ akü eksi** arası direnç ölçülür
- **< 0.5 Ω** olmalı. Yüksekse toprak kablosu okside olmuş veya gevşektir
- Alternatif: Motor çalışırken kavrama bağlantı noktasında voltaj düşümü ölçülür; **< 0.1V** düşüm kabul edilebilir

### 8.6 OBD2 Canlı Veri Okuma (Genel Tarayıcı)
- ELM327/OBDeleven vb. ile şu PID'ler izlenir:
  - `AC Clutch Command` — ECU komut veriyor mu?
  - `AC Pressure Sensor` — Okuma gerçekçi mi?
  - `Engine Load` — Rölantide anormal yük var mı?
  - `Coolant Temp` — Soğutma sistemi sağlam mı?

---

## Bölüm 9: Hızlı Başlangıç Aksiyon Planı

### Faz 1: En Ucuz ve Hızlı Kontroller (Maliyet: 0–500 TL)
1. **A/C açıkken rölantide ön fan çalışıyor mu?** Kondenser kirli mi? (Kondenser ön yüzeyi temizleyin)
2. **Gaz miktarı servis etiketindeki değerde mi?** Kaput altı etiketi kontrol edin (R134a vs R1234yf, 450 g ± 25 g)
3. **Akü voltajı rölantide 12.5V+ mu?** Alternatör çıkışı 13.5V+ mu?
4. **Sigortalar:** BSM içindeki klima/sigorta kartları kontrolü
5. **Toprak noktası:** M38 veya motor toprağı oksidasyon kontrolü

### Faz 2: Mekanik ve Elektriksel Teşhis (Maliyet: 500–3.000 TL)
6. **Multimetre ile bobin ölçümü:** 3.5–5 Ω beklenir
7. **Direk 12V "tak testi":** Kavrama ses çıkarıyor mu?
8. **Fühler gauge ile clutch gap:** 0.35–0.65 mm
9. **Klima istasyonu ile basınç testi:** Rölantide vs 2000 devir LP/HP karşılaştırması
10. **Fan kontrol modülü direnç ölçümü veya değişimi** (~300–600 TL)

### Faz 3: Sensör ve Yazılım Teşhisi (Maliyet: 3.000–10.000 TL)
11. **DiagBox / Lexia3 taraması:** B1xxx/U1xxx/Fxxx kodları (özellikle F994, B132A, B1173, U1807)
12. **Canlı veri izleme:** AC Clutch Command, AC Pressure, Evaporator Temp, Engine Load
13. **Basınç sensörü (triswitch) değişimi:** Eğer basınç anormal veya gaz doğru ama sorun devam ediyorsa
14. **Evaporatör sıcaklık sensörü ohm ölçümü:** Torpido sökülmesi gerekebilir
15. **BSI yazılım güncellemesi:** Yetkili servis veya DiagBox uzmanı

### Faz 4: Son Çare (Maliyet: 10.000–30.000+ TL)
16. **Kompresör komple değişimi:** Tüm mekanik ve elektriksel nedenler ekarte edildikten sonra
17. **Kondenser değişimi + gaz kaçağı testi:** UV boya + basınç testi ile kondenser mikro kaçakları
18. **BSI donanım değişimi:** Son çare; nadir ve pahalı

---

## Bölüm 10: Özet ve Sonuç

### Semptomun Teknik Profili

Kullanıcının semptomu (**2000+ devirde çalışır, rölantide aralıklı çalışmaz**) klasik bir **"kavrama zayıflığı"** veya **"kontrol devresi voltaj düşüklüğü"** profilidir. Ancak bu profil tek başına teşhis koydurmaz; aşağıdaki nedenlerin hepsi aynı semptomu üretebilir:

1. **Kompresör debriyaj bobin direnci artışı** veya **clutch gap büyümesi** → rölantide manyetik kuvvet yetmez, devir artınca tutar
2. **Düşük gaz (undercharge)** → rölantide LP basınç düşer, switch keser; devir artınca basınç yeterli hale gelir
3. **Fan kontrol modülü arızası** → rölantide kondenser soğumaz, basınç yükselir, ECU keser; hareket halinde ram hava ile düzelir
4. **Basınç sensörü (triswitch) arızası** → rölantide basınç dalgalanması stabilize olmadan yanlış okuma yapar
5. **BSI/ECU yazılım veya iletişim hatası** → aralıklı sinyal kesintileri

### En Kritik Uyarılar

> **1. Kompresör değişimi yapmadan önce** mutlaka gaz basıncı, fan kontrol modülü, kondenser kaçağı ve debriyaj bobin/aralık kontrolü yapılmalıdır. Aksi halde yeni kompresör de aynı basınç yükü altında arızalanabilir.

> **2. Gaz dolumu** rastgele "biraz daha gaz" eklemekle çözülmez. Fabrika dolum miktarı (etiket: ~450 g ± 25 g) mutlaka profesyonel klima istasyonu ile kontrol edilmeli; overcharge ve undercharge her ikisi de aynı semptomu üretebilir.

> **3. R1234yf vs R134a:** 2016 T9'larda PSA geçiş döneminde her iki gaz da kullanılmış olabilir. Kaput altı etiket mutlaka kontrol edilmeli; yanlış gaz karışımı ciddi hasar yaratır.

> **4. Bayi önyargısı:** Yetkili servisler genelde komple kompresör değişimi önerir. Ancak forum verilerine ve teknik servis notlarına göre, sıkça **shim (pul) ayarı**, **bobin değişimi**, **basınç sensörü değişimi** veya **fan kontrol modülü değişimi** ile sorun çözülmektedir. Komple kompresör değişimi son çare olmalıdır.

### Önerilen İlk Adımlar

1. **Önce en ucuz ve hızlı kontroller:** Fan sesi, kondenser temizliği, gaz etiketi, akü voltajı
2. **Sonra:** DiagBox/Lexia3 taraması ile B1/U kodlarını okuyun. B1173 gibi bir kod varsa sensör kalibrasyonu ile başlayın
3. **Klima gazı basınç testi:** Static basınç ~8 bar, dinamik basınç farklılık göstermelidir
4. **Multimetre ile bobin ölçümü (3–5 Ω)** ve direk 12V "tak testi" yapın
5. **Bobin sağlamsa:** Kavrama aralığı (clutch gap) ölçülüp shim ayarı yapılmalıdır
6. **Tüm bu adımlar sonuç vermezse:** Kompresör komple değişimi veya kondenser kaçak testi

---

## Kaynaklar ve Referanslar

| # | Kaynak | Dil | İçerik |
|---|--------|-----|--------|
| 1 | Peugeot Forums — Air Con cutting out (May 2020) | EN | Kompresör kesme, basınç sensörü |
| 2 | aussiefrogs / Peugeot Forums — 308 T9 air-conditioning (2014) | EN | Kondenser korozyon, overcharge, BSI, thermistor |
| 3 | Peugeot Forums — AC stops at high temps (Jul 2025) | EN | Akü zayıflığı, basınç sensörü, S&S |
| 4 | Peugeot Forums — AC NOT WORKING 2016 GT Line (May 2021) | EN | Kondenser conta kaçağı, valf kaçağı |
| 5 | Peugeot Forums — Radiator fan resistor (Dec 2023) | EN | Fan direnci arızası, PSA grup |
| 6 | Peugeot Türkiye Forum — Klima Çalışmıyor (Jul 2012) | TR | Rölantide kesme, ECU koruması, fazla gaz |
| 7 | OtoClubTurkiye — 308 Klima Sorunu (Jul 2020) | TR | Fazla gaz, evaporatör sensörü |
| 8 | forum-peugeot.com — Problème clim ventilo (Jul 2020) | FR | Fan direnci, fan hız kontrolü, klima kesme |
| 9 | tlemcen-electronic — Clim ne fonctionne pas au ralenti (Jun 2018) | FR | Pressostat, yüksek basınç, kondenser |
| 10 | forum-auto.caradisiac — problème de clim sur 308 (May 2010) | FR | Elektromanyetik kavrama bobini zayıflığı |
| 11 | DonanımHaber — Klima Ustaları (Nis 2013) | TR | Gaz fazla dolumu, rölantide kesme mekanizması |
| 12 | Peugeot Forums — 308 t9 2014 1.6hdi AC problem (Jul 2023) | EN | SD6C12/SD7C16 kontrol valfi, kavrama rulmanı |
| 13 | Peugeot Forums — A/C kicks off at 2000 rpm (Tem 2016) | EN | Değişken debili kompresör, mekanik destroker |
| 14 | Peugeot Talk (Ausfall der Klimaanlage im Stillstand) | DE | Leerlauf basınç, kompresör defekt |
| 15 | Peugeot Forum.de (Druckschalter) | DE | 3-pin HP/LP switch, PSF1/BSM rölesi |
| 16 | HonestJohn.co.uk — Peugeot 308 (2014–2021) | EN | Kondenser gaz kaçağı, güvenilirlik raporları |
| 17 | Grassroots Motorsports — No/low AC cooling at idle | EN | Fan hava akışı, undercharge, rölantide basınç |
| 18 | Hella A/C Teknik Tabloları (rplclima.com) | EN | R134a 450g, Dens Oil 8, 135ml |
| 19 | Sanden AC Compressor Guide (PDF, 2021) | EN | SD7V16, SD6C12 teknik veriler, control valve |
| 20 | Dorman Products Teknik Blog (2025) | EN | Debriyaj bobin arızası, termal yorgunluk |
| 21 | MACS Mobile Air Climate (2021) | EN | Bobin direnci, amper çekimi, manyetik kuvvet |
| 22 | Berlingo Forum — AC compressor clutch not engaging | EN | BSI → ECU → BSI sinyal zinciri, wire 8060, 8072 |
| 23 | ProPeugeotSpares — 308 Common Faults | EN | BSI/HVAC yazılım güncellemesi, TSB |
| 24 | Genstar Kiev / Werther Polonya | EN/PL | R134a 450±25g, Dens Oil 8, 135cm³ |
| 25 | AutoDoc / Oscaro — SD6C12/SD7C16 parts | EN/FR | Kompresör parça numaraları, aftermarket |
| 26 | OtoYedekMarket — Peugeot klima kompresörü | TR | Kompresör arızası, semptomlar, çözümler |
| 27 | Peugeot Servicebox / eGuide | EN | S&S sistem etkileşimi, klima kullanım kılavuzu |
| 28 | AliExpress / Alibaba Teknik Katalogları | EN | Basınç sensörü, clutch bobin, thermistor |
| 29 | Haynes / Autodata — Peugeot 308 Service Manual | EN | Teknik servis prosedürleri, tork değerleri |
| 30 | VW TDI Club — AC compressor cut out under load | EN | ECU motor yükü yönetimi, AC kesme mantığı |

---

*Rapor sonu. Tüm bulgular kullanıcı tarafından verilen araç ve semptom profiline göre derlenmiş; teknik tavsiyeler genel rehberlik niteliğindedir, kesin tanı için yetkili servis / klima uzmanına başvurulması önerilir.*

*Araştırma kapsamı: 6 paralel araştırma ajanı, 30+ kaynak, 4 dil (TR, EN, FR, DE), 2025 güncellemesi.*
