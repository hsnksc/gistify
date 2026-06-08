# Earnings Strateji İyileştirme Raporu: Call/Put Oranları, IV Crush ve Hisse Bazlı Plan

**Rapor Versiyonu:** v2.4 — long call/long put oranlama bölümü eklenmiş sürüm  
**Rapor Tarihi:** 9 Haziran 2026 (Sali)  
**Hazırlayan:** Manus AI  
**Kapsam:** ORCL, CHWY, ADBE, FDX ve MU için earnings öncesi opsiyon stratejisi, call/put oranı yorumu ve risk iyileştirmesi  
**Kaynak Dosya:** `Earnings Strateji İyileştirme Raporu_ Call_Put Oranları, IV Crush ve Hisse Bazlı Plan.md`  
**Yasal Uyarı:** Bu çalışma yalnızca eğitim ve araştırma amacıyla hazırlanmıştır. Finansal tavsiye, alım-satım önerisi veya kişiye özel yatırım danışmanlığı değildir. Opsiyon işlemleri yüksek risk içerir ve tüm stratejiler canlı opsiyon zinciri, spread, likidite, komisyon ve kişisel risk limitiyle yeniden doğrulanmalıdır.

---

## 1. Yönetici Özeti

Ekli raporda ana fikir doğru yöndedir: earnings öncesinde **implied volatility yükselir**, earnings sonrasında belirsizlik çözüldüğü için özellikle kısa vadeli opsiyonlarda **IV crush** oluşabilir. Bu nedenle yüksek IV Rank dönemlerinde naked long call/put veya pahalı long straddle yerine **defined-risk credit spread**, **iron condor**, **asymmetric iron condor** ve seçici **debit spread** yapıları daha mantıklıdır. Kaynaklarda da earnings gibi takvimli olayların opsiyon primlerini yükselttiği, olay sonrasında IV’nin düşerek long opsiyonları zarara sokabileceği ve short premium stratejilerinin IV crush’tan faydalanabileceği belirtilir.[1] [2] [5]

> SpotGamma, earnings sonrası büyük hisselerde front-month IV’nin sıklıkla **%30-%60** aralığında düşebileceğini ve bu düşüşün long opsiyonlarda yön doğru olsa bile zarara neden olabileceğini belirtir.[2]

Mevcut raporda en büyük iyileştirme alanı **call/put oranı terminolojisi ve strateji eşleştirmesidir**. Raporda “CPR” denmiş olsa da yorumlama biçimi pratikte **put/call ratio** mantığıyla yapılmıştır. Bu nedenle bundan sonra standart terim olarak **PCR = Put Volume / Call Volume** ve **POIR = Put Open Interest / Call Open Interest** kullanılmalıdır. Volume PCR günlük akışı, OI PCR ise taşınan pozisyonları gösterir; bu iki sinyal aynı yönde değilse pozisyon büyüklüğü azaltılmalıdır.[3] [4]

| Ana Karar Alanı | Eski Rapor Sorunu | İyileştirilmiş Kural |
|---|---:|---|
| Terim | “CPR” adı kullanılmış fakat değerler put/call gibi yorumlanmış | **PCR** ve **POIR** ayrı takip edilmeli |
| Long call/put | Düşük PCR otomatik bullish görülmüş | Çok düşük PCR, özellikle yüksek IV’de **crowded call** riskidir |
| Credit strateji | Bazı iron condor risk/kredi oranları zayıf | Kredi, wing genişliğinin en az **%25-%33**’ü değilse işlem zayıf kabul edilmeli |
| Earnings zamanlaması | Bazı BMO/AMC farkları yüzeysel kalmış | BMO’da önceki gün kapanış öncesi, AMC’de açıklama günü kapanışa yakın son karar |
| Vade | Raporda 2026 başlığına rağmen bazı vadeler 2025 yazılmış | Vade yılı ve DTE canlı zincirden düzeltilmeli |
| Pozisyon boyutu | Yüksek IV ve makro çakışma ayrı ayrı ele alınmış | CPI/FOMC + earnings çakışmasında baz pozisyon **%50-%75** bandına indirilmeli |

---

## 2. Earnings Öncesi Call/Put Oranı Nasıl Okunmalı?

Put/call ratio, belirli bir zaman aralığında işlem gören put opsiyonu hacminin call opsiyonu hacmine bölünmesiyle hesaplanır.[4] Barchart, volume put/call ratio için **0.7 altını genel olarak bullish**, **1.0 üstünü genel olarak bearish** kabul eder.[3] Ancak earnings haftasında bu eşikler tek başına yön sinyali değildir; çünkü düşük PCR bazen gerçekten güçlü bullish beklenti, bazen de aşırı kalabalıklaşmış call tarafı anlamına gelir.

Bu nedenle earnings öncesi ideal yorum üç katmanlı olmalıdır. Birinci katman, **volume PCR** ile gün içi akışı ölçer. İkinci katman, **open interest PCR** ile taşınan pozisyonları ölçer. Üçüncü katman ise **IV Rank / IV Percentile** ile bu talebin opsiyon primlerini ne kadar pahalılaştırdığını ölçer. IV percentile yüksek olduğunda primler pahalı kabul edilir ve Schwab’a göre short vertical spread veya credit spread gibi satış ağırlıklı stratejiler daha uygun hale gelebilir.[6] [7]

| PCR Aralığı | Piyasa Okuması | Earnings Öncesi Ana Risk | IV Düşük/Orta ise | IV Yüksek ise |
|---:|---|---|---|---|
| **< 0.40** | Aşırı call talebi, crowded bullish | Yukarı hareket fiyatlanmış olabilir | Küçük debit call spread veya lottery call | Naked/large call alınmaz; call tarafı satışı ancak squeeze riski düşükse yapılır |
| **0.40-0.55** | Güçlü bullish akış | Call primleri şişebilir | Call debit spread, düşük maliyetli vertical | Asimetrik iron condor veya put credit spread; call debit boyutu küçültülür |
| **0.55-0.80** | Sağlıklı bullish | Yön doğru olsa bile IV crush | Call debit spread veya bull put spread | Bull put credit spread, call spread yalnız düşük debit ile |
| **0.80-1.20** | Dengeli / nötr | Yön belirsizliği | Strangle/straddle sadece IV düşükse | Simetrik iron condor, iron butterfly, credit spread |
| **1.20-1.80** | Put ağırlıklı bearish/hedge | Downside primleri şişebilir | Bear put spread veya put debit spread | Bull put spread veya geniş iron condor; trend teyidi yoksa long put alınmaz |
| **> 1.80** | Aşırı put talebi, crowded bearish | Ters short squeeze veya relief rally | Küçük contrarian call spread düşünülebilir | Put satışı veya pas; naked long put çoğunlukla pahalıdır |

**Pratik kural:** Earnings öncesi tek başına düşük PCR “call al” demek değildir; yüksek IV Rank ile birleştiğinde daha çok “call tarafındaki prim şişmiş, bu primin IV crush ile erime riski yüksek” anlamına gelir. Aynı şekilde yüksek PCR tek başına “put al” demek değildir; putlar pahalıysa put satışı veya defined-risk bull put spread daha iyi risk/ödül verebilir.

---

## 3. Hangi Oranlarda Call, Put veya Iron Condor Tercih Edilmeli?

Bir hissede call/put kararı için en temiz çerçeve, **yön sinyali** ile **volatilite sinyalini** ayrı okumaktır. Yön sinyali PCR, momentum, hacim, RSI, haber katalisti ve analist revizyonlarından gelir. Volatilite sinyali IV Rank, IV Percentile, implied move ve geçmiş earnings hareketinden gelir. Fidelity’ye göre IV opsiyon sözleşmelerine olan arz-talep sonucunda oluşur ve vega, IV değişiminin opsiyon fiyatına etkisini ölçer.[8]

| Strateji | Gerekli PCR/POIR Yapısı | IV Koşulu | Teknik Koşul | Earnings Öncesi Kullanım |
|---|---|---|---|---|
| **Long Call** | PCR 0.55-0.80, POIR ≤ 1.00 | IV Rank tercihen <50; en fazla <60 | Momentum ≥ %1.2-%1.5, hacim ≥ 2x | Sadece A+ sinyalde ve düşük debit ile |
| **Call Debit Spread** | PCR 0.45-0.80 | IV Rank 40-75 | Katalisit net bullish | Naked call yerine tercih edilir; debit, spread genişliğinin %30-%40’ını aşmamalı |
| **Bull Put Credit Spread** | PCR 0.55-1.20 veya yüksek put IV | IV Rank >60 | Destek güçlü, düşüş sınırlı | Bullish görüşü IV crush ile oynamanın daha verimli yolu |
| **Long Put** | PCR 1.20-1.80, POIR ≥ 1.10 | IV Rank <50-60 | Trend aşağı, destek kırılmış | Yüksek IV’de dikkat; çoğu durumda put debit spread daha iyi |
| **Bear Call Credit Spread** | PCR <0.55 veya call tarafı şişmiş | IV Rank >70 | Yukarı momentum zayıf | Crowded call tarafını satmak için kullanılır |
| **Iron Condor** | PCR 0.80-1.20 | IV Rank >70-75 | Hisse range-bound | Earnings IV crush ana stratejisi |
| **Asymmetric Iron Condor** | PCR <0.65 veya >1.25 | IV Rank >70 | Bir taraf crowded | Şişmiş taraf daha agresif, karşı taraf daha korumalı satılır |
| **Pas Geç** | Volume PCR ve OI PCR çelişkili | IV aşırı yüksek, spread geniş | Likidite zayıf veya makro çakışma var | En iyi risk yönetimi çoğu zaman işlem açmamaktır |

Bu tabloya göre earnings öncesinde **ideal long call ortamı** PCR’nin 0.55-0.80 aralığında, OI PCR’nin 1.00 altında, IV Rank’ın 60 altında, hacmin en az 2x ve momentumun %1.2-%1.5 üzerinde olduğu durumdur. **İdeal long put ortamı** ise PCR’nin 1.20-1.80 aralığında, OI PCR’nin 1.10 üzerinde, IV Rank’ın 60 altında ve fiyatın destek kırdığı durumdur. **İdeal iron condor ortamı** PCR’nin 0.80-1.20 aralığında, IV Rank’ın 70-75 üzerinde, implied move’un tarihsel gerçekleşen hareketten büyük olduğu ve toplanan kredinin wing genişliğinin en az %25-%33’üne ulaştığı durumdur.

### 3.1 Long Call ve Long Put Birlikte Alınacaksa Sermaye/Risk Oranı Nasıl Belirlenmeli?

Buradaki amaç, bir hissede hem yukarı hem aşağı yönlü hareket olasılığı varken **long call + long put** sepetinin kör biçimde %50/%50 kurulmasını engellemektir. Earnings öncesinde IV genellikle yüksek olduğu için iki taraflı long opsiyon almak, fiyat güçlü hareket etse bile IV crush nedeniyle beklenen getiriyi zayıflatabilir.[1] [2] [5] Bu yüzden oranlama, yön sinyali ile oynaklık maliyetini birlikte değerlendirmelidir. Pratikte oran, ödenen prim miktarına göre değil, **maksimum kayıp riski** veya “işlem başına ayrılan toplam debit bütçesi” üzerinden hesaplanmalıdır.

> Temel kural şudur: Long call + long put birlikte alınacaksa, toplam debit bütçesi zaten küçük tutulmalı; call/put dağılımı ise PCR, OI PCR, momentum, hacim ve IV Rank kombinasyonuna göre ayarlanmalıdır. IV Rank **70 üzerindeyse** iki taraflı long debit sepeti ana strateji olmamalı, yalnızca küçük boyutlu olay/lottery pozisyonu olarak kullanılmalıdır.[6] [7] [8]

| Piyasa Koşulu | Volume PCR / OI PCR Yapısı | Teknik Durum | Önerilen Long Call / Long Put Oranı | Uygun Yapı | Yorum |
|---|---|---|---:|---|---|
| **Güçlü bullish ama IV makul** | PCR 0.55-0.80, OI PCR ≤ 1.00 | Momentum ≥ %1.2-%1.5, hacim ≥ 2x | **%70 call / %30 put** | Call debit spread + küçük koruyucu put | Ana beklenti yukarıdır; put tarafı yalnızca gap-down sigortasıdır |
| **Aşırı bullish ve crowded call** | PCR <0.45, OI PCR <0.80 | Fiyat yukarı gitmiş, call primleri pahalı | **%55 call / %45 put** veya pas | Küçük call spread + küçük put spread | Çok düşük PCR call tarafının kalabalık olduğunu gösterir; %80-%90 call almak hatalı olur |
| **Nötr ama büyük hareket bekleniyor** | PCR 0.80-1.20, OI PCR 0.80-1.20 | Sıkışma, dar bant, yüksek beklenen gap | **%50 call / %50 put** | Long strangle veya iki taraflı debit spread | Sadece IV Rank düşük/orta ise uygundur; yüksek IV’de iron condor daha mantıklıdır |
| **Hafif bearish** | PCR 1.20-1.60, OI PCR ≥ 1.10 | Destek kırılımı veya zayıf momentum | **%35 call / %65 put** | Put debit spread + küçük call hedge | Ana risk aşağıdır; call tarafı olası relief rally sigortasıdır |
| **Aşırı bearish ve crowded put** | PCR >1.80, OI PCR yüksek | Put talebi aşırı, negatif haber fiyatlanmış | **%45 call / %55 put** veya pas | Küçük put spread + küçük contrarian call | Putlar pahalıysa %80-%90 put almak IV crush ve squeeze riski yaratır |
| **Volume ve OI çelişkili** | Örneğin volume PCR düşük, OI PCR yüksek | Gün içi akış ile taşınan pozisyon ters | **%50 call / %50 put** veya maksimum yarım pozisyon | Küçük strangle/debit spread | Sinyal net değildir; oranı agresifleştirmek yerine bütçe küçültülmelidir |
| **Makro çakışmalı earnings** | PCR ne olursa olsun CPI/FOMC etkisi var | Endeks yönü hisse sinyalini bozabilir | Baz oran korunur, toplam bütçe **%50-%75 azaltılır** | Küçük debit spread veya pas | Oran değil, pozisyon büyüklüğü asıl risk kontrol aracıdır |

Bu oranlar, kontrat adediyle değil **dolar riskiyle** uygulanmalıdır. Örneğin toplam debit bütçesi 100 dolar ise %70 call / %30 put oranı, yaklaşık 70 dolar call tarafına ve 30 dolar put tarafına ayrılması anlamına gelir. Bir call kontratı 65 dolar ve bir put kontratı 35 dolar ise oran doğal olarak yakındır; ancak bir call 180 dolar, bir put 40 dolar ise “1 call + 1 put” almak gerçekte %82 call / %18 put riski yaratır ve tabloya uymaz.

| Örnek Toplam Debit Bütçesi | Hedef Oran | Call Tarafı Maksimum Debit | Put Tarafı Maksimum Debit | Uygulama Notu |
|---:|---:|---:|---:|---|
| 50 dolar | %70 call / %30 put | 35 dolar | 15 dolar | Düşük bütçede genellikle OTM lottery yerine dar vertical daha kontrollüdür |
| 100 dolar | %60 call / %40 put | 60 dolar | 40 dolar | Bullish ama IV yüksekse call spread + küçük put hedge uygundur |
| 100 dolar | %50 call / %50 put | 50 dolar | 50 dolar | Yön belirsiz ve IV makulse kullanılabilir |
| 100 dolar | %35 call / %65 put | 35 dolar | 65 dolar | Bearish sinyalde put tarafı ana pozisyon olur |
| 200 dolar | %45 call / %55 put | 90 dolar | 110 dolar | Crowded put ortamında put ağırlığı sınırlanır, call hedge korunur |

**Kritik düzeltme:** Eğer hem long call hem long put alınacaksa, bu pozisyon klasik anlamda long straddle/strangle mantığına yaklaşır. Bu yapı, IV düşükken ve beklenen gerçekleşmiş hareket opsiyonların fiyatladığı implied move’dan büyük olacaksa mantıklıdır. IV Rank çok yüksekse aynı yön görüşünü long opsiyonla değil, çoğu zaman **debit spread** veya **defined-risk credit spread** ile ifade etmek daha verimlidir.[5] [6] [8]

| Hisse | Mevcut Sinyal Yorumu | Long Call / Long Put Oranı | Ne Zaman Uygulanır? | Daha Mantıklı Alternatif |
|---|---|---:|---|---|
| **ORCL** | Bullish katalist, düşük PCR, fakat yüksek IV | **%65 call / %35 put** | Sadece call debit pahalı değilse ve momentum güçlü kalırsa | Bull put credit spread + küçük call debit spread |
| **CHWY** | Squeeze potansiyeli, aşırı düşük PCR | **%60 call / %40 put** | Squeeze oynanacaksa ama crowded call riski hedge edilmek istenirse | Küçük call debit spread veya broken-wing call butterfly |
| **ADBE** | Call tarafı crowded, IV çok yüksek, zayıf trend | **%40 call / %60 put** | Yalnızca yönlü debit sepeti zorunluysa; aksi halde tercih edilmez | Bear call credit spread ağırlıklı asymmetric iron condor |
| **FDX** | Dengeli PCR, range-bound beklenti | **%50 call / %50 put** | IV makul kalır ve büyük iki yönlü hareket beklenirse | Kompakt iron condor |
| **MU** | Volume bullish, OI bearish; beta ve implied move çok yüksek | **%50 call / %50 put**, fakat yarım bütçe | Sinyal netleşmeden yalnızca küçük olay pozisyonu olarak | Pas veya çok küçük geniş defined-risk yapı |

Bu ek çerçeveye göre, bir hissede “hem long call hem long put alayım” denildiğinde ilk tercih otomatik %50/%50 olmamalıdır. **Bullish A+ sinyalde 70/30, bearish A+ sinyalde 35/65, nötr ama hareket beklentisinde 50/50, crowded uç değerlerde ise 55/45 veya 45/55** daha sağlıklı bir başlangıç modelidir. Yine de IV Rank 70 üzerindeyse toplam debit bütçesi küçük tutulmalı ve mümkünse naked long yerine vertical spread kullanılmalıdır.

---

## 4. Mevcut Raporun Kritik Düzeltmeleri

Ekli rapor güçlü bir iskelet sunuyor; ancak bazı teknik noktalar düzeltilmeden uygulanmamalıdır. Özellikle iron condor ve credit spread tarafında **max risk / kredi oranı** bazı hisselerde zayıftır. Defined-risk kredi stratejilerinde max risk, genellikle **wing genişliği eksi alınan kredi** olarak hesaplanır. Eğer 10 dolar genişlikte bir spread için yalnızca 1 dolar kredi alınıyorsa risk/ödül zayıftır; earnings gibi gap riski yüksek bir olayda bu oran genellikle yeterli değildir.

| Kontrol Alanı | Rapordaki Durum | İyileştirme |
|---|---|---|
| CPR adı | “Call/Put Ratio” gibi yazılmış, put/call gibi yorumlanmış | Tüm tablolar **PCR = Put/Call** olacak şekilde yeniden adlandırılmalı |
| ORCL IC kontrolü | Max loss / kredi kontrolü uyumsuz | Alternatif IC ancak kredi wing’in ≥%25’i ise kullanılmalı |
| ADBE IC | Fikir mantıklı fakat kredi ve max risk canlı zincirle doğrulanmalı | 10-15 dolar wing ile daha kompakt IC değerlendirilmeli |
| FDX IC | 33 dolar wing, düşük krediyle sermaye verimsiz olabilir | 15-20 dolar wing ve kredi/wing ≥%25 hedeflenmeli |
| MU IC | Çok geniş wing ve beta 2.17 nedeniyle risk yüksek | Pozisyon daha da küçültülmeli veya pas geçilmeli |
| CHWY call satış önerisi | Short squeeze ihtimali varken short call riskli | Call satışı çok dar ve küçük olmalı; ana fikir küçük debit spread veya pas |
| Vade yılı | 2026 raporunda bazı vadeler 2025 yazılmış | Tüm vadeler canlı zincirde **2026** olarak düzeltilmeli |

---

## 5. Hisse Bazlı İyileştirilmiş Strateji Planı

Aşağıdaki plan, ekli rapordaki fiyat ve oranları temel alır. Canlı piyasa verileri değişebileceği için tüm strike, kredi, debit ve DTE bilgileri emir öncesinde yeniden kontrol edilmelidir.

### 5.1 ORCL — Bullish Katalyst Var, Fakat IV Yüksek

ORCL için raporda kullanılan PCR yapısı **Volume PCR 0.52** ve **OI PCR 0.92** şeklindedir. Bu, günlük akışın call tarafına eğildiğini fakat taşınan pozisyonların dengeli olduğunu gösterir. IV Rank’ın yaklaşık %82 olması nedeniyle naked long call veya long straddle pahalıdır. Bu nedenle önceki rapordaki long straddle’dan call spread’e geçiş doğru yöndedir; ancak daha iyi yapı, yüksek IV’den faydalanan **bull put credit spread** ile sınırlı maliyetli **call debit spread** arasında seçim yapmaktır.

| ORCL Kararı | İyileştirilmiş Yaklaşım |
|---|---|
| Ana görüş | Hafif-orta bullish |
| PCR yorumu | 0.52 düşük; call talebi güçlü ama aşırı crowded değil |
| En iyi yapı | **195/185 veya 200/190 bull put credit spread**; alternatif olarak küçük **220/230 call debit spread** |
| Call/put oranı | Bullish pozisyonlarda riskin yaklaşık **%60 put credit / %40 call debit** şeklinde bölünmesi daha dengeli |
| Giriş şartı | Call spread debit’i genişliğin %35-40’ını aşmamalı; put spread kredisi wing’in en az %25’i olmalı |
| Pozisyon boyutu | CPI + earnings çakışması nedeniyle normal büyüklüğün **%50-%75**’i |

**Sonuç:** ORCL’de yalnızca 220/230 call spread almak yerine, yüksek IV Rank nedeniyle **bull put credit spread** ana strateji yapılmalı; call spread ise yalnızca düşük debit ile taktik ek pozisyon olmalıdır. Beklenen hareket yukarı yönde güçlü görülüyorsa call spread korunabilir, fakat IV crush riski nedeniyle pozisyon küçük tutulmalıdır.

### 5.2 CHWY — Squeeze Potansiyeli Var, Fakat Crowded Call Riski Çok Yüksek

CHWY için tahmini PCR **0.35-0.45** bandındadır. Bu oran teorik olarak aşırı bullish akışı gösterir; fakat earnings öncesinde bu kadar düşük PCR, call tarafının aşırı kalabalıklaştığını da anlatır. Short squeeze potansiyeli nedeniyle doğrudan call satışı tehlikelidir. Bu nedenle raporun sonundaki “22/23 call spread sell” fikri ancak çok küçük boyutta ve net risk limitiyle düşünülebilir; ana strateji olmamalıdır.

| CHWY Kararı | İyileştirilmiş Yaklaşım |
|---|---|
| Ana görüş | Yüksek oynaklıklı bullish/squeeze senaryosu |
| PCR yorumu | 0.35 civarı aşırı call talebi; crowded long riski yüksek |
| En iyi yapı | Küçük boyutlu **21/26 call debit spread** veya daha kontrollü **21/24/26 call broken-wing butterfly** |
| Kaçınılacak yapı | Büyük boy short call spread; squeeze olursa risk hızlı büyür |
| Call/put oranı | Pozisyon riskinin en fazla **%70 call debit / %30 nakit veya hedge** olması; credit tarafı küçük kalmalı |
| Pozisyon boyutu | Normalin **%50-%75**’i; lottery call toplam riskin küçük parçası olmalı |

**Sonuç:** CHWY’de düşük PCR “call al” sinyali verse de bu sinyal crowded olabilir. En mantıklı yapı, **maksimum kaybı baştan belli olan küçük debit call spread** veya risk daha da azaltılmak istenirse broken-wing call butterfly’dır. Short squeeze ihtimali varken agresif call satışı ana strateji yapılmamalıdır.

### 5.3 ADBE — En Temiz Short-Vol Adayı

ADBE’de raporda belirtilen **Volume PCR 0.43** ve **OI PCR 0.67**, call tarafının belirgin şekilde crowded olduğunu gösterir. IV Rank’ın yaklaşık %99 olması, long call veya long straddle için çok zor bir ortam yaratır. Trendin zayıf, fiyatın 50 günlük ortalama altında ve yönün belirsiz olması nedeniyle ADBE’de en mantıklı yaklaşım **asymmetric iron condor** veya **bear call credit spread + küçük put credit spread** yapısıdır.

| ADBE Kararı | İyileştirilmiş Yaklaşım |
|---|---|
| Ana görüş | Nötr-hafif bearish; IV crush odaklı |
| PCR yorumu | 0.43 çok düşük; call tarafı crowded |
| En iyi yapı | **260/270 bear call credit spread** + opsiyonel **225/215 bull put credit spread** |
| Call/put oranı | Toplanan kredi riskinin yaklaşık **%65-%70 call tarafı / %30-%35 put tarafı** olması |
| Giriş şartı | Toplam kredi, wing genişliğinin en az %30’una yaklaşmalı |
| Çıkış | Earnings sonrası ilk 30-60 dakikada kredinin %40-%60’ı kazanıldıysa çıkış |

**Sonuç:** ADBE’de call tarafı hem sentiment hem IV açısından pahalı görünmektedir. Bu yüzden long call spread alternatif olmaktan çıkarılmalı; ana strateji **asymmetric iron condor** olmalıdır. Ancak kredi yetersizse işlem pas geçilmelidir.

### 5.4 FDX — Nötr PCR, Yüksek IV, Fakat Giriş İçin Acele Yok

FDX’te tahmini PCR ve OI PCR yaklaşık **1.05-1.10** bandındadır. Bu dengeli bir yapı olduğu için simetrik iron condor fikri mantıklıdır. Ancak earnings tarihine yaklaşık iki hafta olması, FOMC gibi makro olayların araya girmesi ve geniş wing’li condorların sermaye verimsizliği yaratması nedeniyle giriş zamanlaması iyileştirilmelidir.

| FDX Kararı | İyileştirilmiş Yaklaşım |
|---|---|
| Ana görüş | Nötr/range-bound |
| PCR yorumu | 1.05-1.10 dengeli; hafif put ağırlıklı |
| En iyi yapı | Daha kompakt **315/300 put credit spread + 350/365 call credit spread** |
| Call/put oranı | Yaklaşık **%50 call credit / %50 put credit**; hafif put ağırlığı varsa %45/%55 yapılabilir |
| Giriş zamanı | Earnings’e 5-7 işlem günü kala, IV hâlâ yüksekse; FOMC sonrası daha güvenli |
| Kredi şartı | 15 dolar wing için ideal toplam kredi en az **3.75-5.00 dolar** bandına yaklaşmalı |

**Sonuç:** FDX, listedeki en temiz iron condor adaylarından biridir; fakat 14 gün önce giriş yapmak yerine IV’nin yükselmesini ve makro olayların geçmesini beklemek daha verimli olabilir. Geniş wing yerine daha kompakt ve sermaye verimli bir condor tercih edilmelidir.

### 5.5 MU — Yüksek Beta, Geniş Implied Move ve Çelişkili PCR

MU’da Volume PCR **0.66** iken OI PCR **1.31** olarak verilmiştir. Bu yapı günlük akışın call tarafına, taşınan pozisyonların ise put tarafına daha fazla yüklendiğini gösterir. Bu çelişki, özellikle yüksek beta ve çok geniş implied move ile birleştiğinde net sinyal üretmez. Mevcut rapordaki %50 pozisyon küçültme kararı doğru olmakla birlikte, risk hâlâ yüksek olduğu için daha agresif bir küçültme veya pas geçme seçeneği eklenmelidir.

| MU Kararı | İyileştirilmiş Yaklaşım |
|---|---|
| Ana görüş | Yön belirsiz; risk çok yüksek |
| PCR yorumu | Volume bullish, OI bearish; sinyal çelişkili |
| En iyi yapı | Öncelik **pas/gecikmeli giriş**; işlem yapılacaksa çok geniş defined-risk iron condor |
| Call/put oranı | Yaklaşık **%50 call credit / %50 put credit**, fakat short strike’lar implied move dışına taşınmalı |
| Pozisyon boyutu | Normalin **%25-%50**’si; mevcut rapordaki %50 küçültme minimum kabul edilmeli |
| Giriş şartı | Fiyat yatışmadan ve kredi/wing oranı ≥%25 olmadan işlem açılmamalı |

**Sonuç:** MU’da teorik olarak iki taraflı IV satışı çekici görünse de beta, fiyat patlaması ve implied move riski nedeniyle işlem kalitesi düşüktür. Bu hisse için “işlem açmamak” veya yalnızca çok küçük defined-risk pozisyon almak en rasyonel risk yönetimidir.

---

## 6. Nihai Hisse Sıralaması ve Uygulanabilir Strateji

Aşağıdaki tablo, ekli rapordaki stratejileri daha dengeli ve risk kontrollü hale getirir. Buradaki “öncelik”, işlem kalitesi ile risk/ödül dengesini birlikte değerlendirir.

| Sıra | Hisse | Eski Ana Strateji | İyileştirilmiş Ana Strateji | İşlem Kalitesi | Not |
|---:|---|---|---|---|---|
| 1 | **ADBE** | Iron Condor | **Asymmetric IC / Bear Call Credit Spread ağırlıklı** | Yüksek | IV Rank çok yüksek, PCR call crowded |
| 2 | **FDX** | Iron Condor | **Kompakt simetrik IC, giriş geciktirilmiş** | Orta-yüksek | Dengeli PCR, fakat erken giriş gereksiz |
| 3 | **ORCL** | 220/230 Call Spread | **Bull Put Credit Spread + küçük Call Spread** | Orta | Bullish katalist var, IV yüksek |
| 4 | **CHWY** | 21/26 Call Spread | **Küçük Call Debit Spread / Broken-Wing Butterfly** | Orta-düşük | Squeeze var ama crowded call riski yüksek |
| 5 | **MU** | Geniş Iron Condor | **Pas veya çok küçük geniş IC** | Düşük | Beta ve implied move çok yüksek |

---

## 7. Earnings Öncesi Uygulanacak Mekanik Kontrol Listesi

Bu kontrol listesi, her hisse için işlem açmadan önce uygulanmalıdır. Amaç, her gün işlem yapmak değil, yalnızca **A+ sinyal** oluştuğunda işlem almaktır. Kullanıcının önceki optimizasyon kurallarıyla uyumlu olarak momentum eşiği %1.2-%1.5 bandına, hacim filtresi ise en az 2x seviyesine çekilmelidir.

| Kontrol | A+ Koşul | İşlem Kararı |
|---|---|---|
| Volume PCR | Yön stratejisiyle uyumlu | Uyum yoksa pozisyon küçült veya pas geç |
| OI PCR | Volume PCR ile aynı yönde veya nötr | Çelişki varsa maksimum %50 pozisyon |
| IV Rank / Percentile | Credit için >70; debit için <60 | Uygun değilse strateji değiştir |
| Beklenen gap | En az %1 ve komisyon sonrası anlamlı | Beklenen gap düşükse işlem yok |
| Momentum | Minimum %1.2-%1.5 | Zayıf momentumda long call/put yok |
| Hacim | Ortalama hacmin en az 2x’i | Likidite yoksa işlem yok |
| Spread likiditesi | Bid/ask makul ve açık pozisyon yeterli | Geniş spreadlerde emir kovalanmaz |
| Kredi/wing oranı | Credit spread için ≥%25-%33 | Daha düşükse risk/ödül zayıf |
| Makro takvim | CPI/FOMC çakışması yok veya fiyatlandı | Çakışma varsa pozisyon %50-%75 |
| Gün filtresi | Cuma yeni weekly call yok | Hafta sonu theta/gap riski azaltılır |

---

## 8. Giriş ve Çıkış Kuralları

Earnings işlemlerinde strateji kadar çıkış disiplini de önemlidir. IV crush genellikle açıklamadan sonra hızlı gerçekleştiği için, short premium işlemlerinde kazanç ilk saat içinde önemli ölçüde oluşabilir.[2] Long debit spread işlemlerinde ise yön doğruysa açılışta kâr varsa hızlı realize etmek çoğu zaman daha gerçekçidir.

| Açıklama Tipi | Giriş Zamanı | Çıkış Zamanı | Kural |
|---|---|---|---|
| **BMO** | Bir önceki gün kapanıştan önce | Earnings sabahı açılış sonrası 30-60 dakika | Kâr varsa hızlı çık; zarar limiti baştan belli olmalı |
| **AMC** | Açıklama günü kapanışa yakın veya 1 gün önce | Ertesi gün açılış sonrası 30-60 dakika | IV crush sonrası kredi stratejilerinde %40-%60 kâr hedefi |
| **Makro çakışmalı gün** | Pozisyon küçültülerek veya pas geçilerek | İlk likidite oluşunca | CPI/FOMC yönü bozabilir |
| **14+ DTE earnings** | Çok erken değil; IV yükselişi beklenir | Earnings sonrası veya öncesinde hedefe ulaşınca | Erken giriş haber riskini artırır |

---

## 9. Kısa Sonuç

Bu rapora göre stratejilerin ana iyileştirmesi şudur: **Earnings öncesi call/put oranı yön tahmini için değil, hangi opsiyon tarafının pahalılaştığını anlamak için kullanılmalıdır.** Düşük PCR call talebinin güçlü olduğunu gösterir; fakat IV yüksekse bu, long call almak yerine call tarafındaki pahalı primi kontrollü satmak veya bullish görüşü bull put spread ile ifade etmek anlamına gelebilir. Yüksek PCR put talebini gösterir; fakat IV yüksekse long put çoğu zaman pahalıdır ve put credit spread veya pas seçeneği daha mantıklı olabilir.

ADBE ve FDX, yüksek IV nedeniyle en uygun short-vol adaylarıdır. ORCL bullish katalist taşıdığı için call debit spread tamamen dışlanmamalı, fakat ana ifade biçimi yüksek IV nedeniyle bull put credit spread olmalıdır. CHWY’de squeeze riski nedeniyle short call tarafı ana strateji yapılmamalı; sadece küçük riskli call debit yapıları düşünülmelidir. MU ise yüksek beta ve çelişkili PCR nedeniyle en zayıf işlem kalitesine sahiptir; pas geçme seçeneği açıkça plana eklenmelidir.

---

## References

[1]: https://www.tastylive.com/concepts-strategies/iv-crush "TastyLive — What is an Implied Volatility (IV) Crush and How to Avoid it"

[2]: https://support.spotgamma.com/hc/en-us/articles/15249330755859-IV-Crush-Explained-What-It-Is-When-It-Happens-and-How-to-Trade-It "SpotGamma — IV Crush Explained: What It Is, When It Happens, and How to Trade It"

[3]: https://www.barchart.com/stocks/quotes/%24SPX/put-call-ratios "Barchart — Put/Call Ratio"

[4]: https://www.moomoo.com/us/learn/detail-put-call-ratio-117215-240626012 "Moomoo — Understanding Put/Call Ratio in Options Trading"

[5]: https://www.schwab.com/learn/story/trading-options-around-earnings-announcements "Charles Schwab — Tools for Trading Options Around Earnings"

[6]: https://www.schwab.com/learn/story/aligning-your-options-with-implied-volatility "Charles Schwab — Aligning Options Strategies and Implied Volatility"

[7]: https://www.schwab.com/learn/story/using-implied-volatility-percentiles "Charles Schwab — Using Implied Volatility Percentages and Rankings"

[8]: https://www.fidelity.com/bin-public/060_www_fidelity_com/documents/learning-center/options-around-earnings-deck.pdf "Fidelity — Trading Options Around Earnings"
