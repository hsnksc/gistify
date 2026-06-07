## 1. Piyasa Rejimi Tespiti ve Hafta Özeti

### 1.1 7-Gösterge Rejim Analizi

7 Haziran 2026 itibarıyla piyasa rejimi tespiti için kullanılan yedi göstergenin değerlendirmesi, piyasaların belirsizlikle karakterize edilen bir **GEÇİŞ rejiminde** olduğunu ortaya koymaktadır. Göstergelerden üçü bullish, üçü bearish ve biri nötr sinyal vermektedir; bu dağınık görünüm, Federal Reserve (FED) politikasına dair artan belirsizliğin piyasa katılımcıları üzerinde baskı oluşturduğunu yansıtmaktadır.

VIX endeksi 15.72 seviyesinde kapanarak 18 eşiğinin altında kalmayı sürdürmüş ve teknik olarak "normal" aralıkta yer almıştır. Bununla birlikte, Cuma günü %2.08'lik artışla yükseliş trendine girmiştir; bu durum opsiyon piyasasında maliyetlenmenin (IV) kademeli olarak arttığına işaret etmektedir [^1^]. MOVE endeksi tahvil piyasası oynaklığını ölçen temel gösterge olarak yaklaşık 105 seviyesinde işlem görmektedir. İdeal olarak 85'in altında olmasına rağmen, 126 tolerans eşiğinin altında kalması piyasaların henüz stresli bir bölgeye girmediğini ancak faiz hareketliliğinin artmaya başladığını göstermektedir [^2^].

S&P 500 endeksi 7,428 puanda 200 günlük hareketli ortalamanın (yaklaşık 7,350) üzerinde kalmayı sürdürmüştür. Bu teknik konum bullish olarak sınıflandırılsa da, Cuma günkü %2.05'lik keskin düşüş ve artan satış baskısı bu desteğin zayıfladığına dair bir uyarı sinyali oluşturmaktadır [^3^]. Kredi piyasalarında HY (yüksek getirili) tahvil spreadleri yaklaşık 380 baz puanda kalarak 500 baz puanlık risk eşiğinin oldukça altında seyretmiştir; bu durum kredi koşullarının halen stabil olduğunu ve finansal stresin sınırlı kaldığını göstermektedir [^4^].

Öte yandan, faiz ve döviz piyasalarından gelen sinyaller daha endişe vericidir. 10 yıllık Hazine tahvili getirisi %4.54 seviyesine yükselerek %4.75 kriz eşiğine yaklaşmıştır. Bu yükseliş, NFP verisi sonrası FED'in sıkılaştırma (hawkish) duruşunu sürdüreceği beklentisinin fiyatlanması sonucu ortaya çıkmıştır [^5^]. DXY (dolar endeksi) 99.49 seviyesinde güçlenmeye devam etmekte olup, bu durum riskli varlıklar — özellikle büyüme odaklı teknoloji hisseleri ve gelişmekte olan piyasalar — üzerinde baskı yaratmaktadır [^6^]. Put/Call oranı 0.85 ile 0.72-1.23 aralığının içinde nötr bölgede yer almakla birlikte, hafif put ağırlıklı yapı piyasa katılımcılarının korunma talebinin arttığını göstermektedir [^7^].

Fear & Greed endeksi 54-55 bandında nötr konumdadır; bu da piyasa duyarlılığının ne aşırı korku ne de açgözlülük bölgesinde olduğunu, kararsızlık döneminde olunduğunu teyit etmektedir [^8^].

**Tablo 1: 7-Gösterge Rejim Matrisi (7 Haziran 2026)**

| Gösterge | Değer | Sinyal | Eşik / Referans | Yorum |
|----------|-------|--------|-----------------|-------|
| VIX | 15.72 | 🟦 Bullish | < 18 normal | Nispeten düşük ama yükseliş trendinde |
| MOVE Endeksi | ~105 | 🟦 Bullish | < 126 tolerable | Tahvil oynaklığı artıyor |
| SPX / 200MA | 7,428 / ~7,350 | 🟦 Bullish | Üzerinde | 200MA üzerinde ama zayıf |
| 10Y Yield | %4.54 | 🟥 Bearish | %4.75 kriz eşiği yakın | FED sıkılaşma baskısı |
| DXY | 99.49 | 🟥 Bearish | Güçleniyor | Riskli varlıklar için baskı |
| HY Spread | ~380 bps | 🟦 Bullish | < 500 | Kredi piyasası stabil |
| Put/Call Ratio | ~0.85 | ⬜ Nötr | 0.72 – 1.23 | Hafif put ağırlıklı |
| **Toplam** | | **3B / 3Br / 1N** | | **REJİM: GEÇİŞ** |


![7-Gösterge Piyasa Rejimi Analizi](research/june7/chart1_regime.png)

*Şekil 1: Yedi göstergenin bullish/bearish/nötr dağılımı. 3-3-1 dağılımı GEÇİŞ rejimini işaret etmektedir. Kaynak: CBOE, FRED, Yahoo Finance.*

VIX bazlı pozisyon büyüklüğü çerçevesinde, mevcut 15.72 seviyesi 12-18 aralığında kaldığından **1.0x standart pozisyon** büyüklüğü önerilmektedir [^9^]. Bu durum, piyasada aşırı korku olmadığı için tam kapitülasyon stratejilerinin (örneğin aşırı satım rallilerine yönelik call alımı) henüz devreye girmemesi gerektiğini; ancak artan oynaklık nedeniyle de normalden daha küçük pozisyon alınmaması gerektiğini göstermektedir.

### 1.2 5 Haziran Cuma Kapanış Özeti

5 Haziran Cuma günü piyasalar tarım dışı istihdam (NFP) verisinin yarattığı şokla karşılaştı. Mayıs ayı NFP verisi +172K artış göstererek 85K'lık piyasa beklentisinin iki katından fazla üzerinde gerçekleşti. İşsizlik oranı %4.3 seviyesinde sabit kalırken, saatlik ücret enflasyonu yıllık %3.4'e yükseldi [^10^]. Bu veri seti, ABD iş gücü piyasasının beklenenden daha sıcak olduğunu ve FED'in enflasyonla mücadelede agresif bir duruş sürdürmesine olanak tanıyacağını göstermektedir.

Veri açıklamasının ardından para piyasaları FED'in Eylül 2026 toplantısında faiz indirimi ihtimalini fiyatlamaktan vazgeçti; hatta bazı fed funds vadelilerinde sınırlı bir faiz artırımı olasılığı fiyatlanmaya başladı. 2 yıllık Hazine tahvili getirisi +10 baz puan yükselirken, 10 yıllık getiri %4.54'e çıktı [^11^]. Bu gelişme hisse senedi piyasalarında sert bir satış dalgasına yol açtı.

S&P 500 endeksi 7,428.31 puanda (%-2.05, -156 puan) kapanırken, teknoloji ağırlıklı Nasdaq 26,047 puana gerileyerek %2.92'lik (-784 puan) bir düşüş kaydetti. Dow Jones Industrial Average 51,160 puana (%-0.78, -403 puan) çekildi. Not edilmesi gereken bir ayrışma ise Russell 2000 endeksinin %1.45 kazançla kapanması oldu; bu durum küçük sermaye şirketlerinin finansal ve endüstriyel sektörlerdeki göreceli dayanıklılığını ve büyük teknoloji hisselerinden (Magnificent 7) kaynaklı satışların piyasayı nasıl böldüğünü göstermektedir [^12^].

**Tablo 2: 5 Haziran 2026 Kapanış Verileri**

| Endekm / Gösterge | Kapanış | Değişim (Günlük) | Değişim (Puan) | Not |
|-------------------|---------|------------------|----------------|-----|
| S&P 500 (SPX) | 7,428.31 | -2.05% | -156 pts | 200MA üzerinde kaldı |
| Nasdaq Composite | 26,047 | -2.92% | -784 pts | Teknoloji satışı derin |
| Dow Jones | 51,160 | -0.78% | -403 pts | Göreceli dayanıklı |
| Russell 2000 | — | +1.45% | — | Küçük hisseler pozitif ayrıştı |
| VIX | 15.72 | +2.08% | — | Nispi sakinlik sürüyor |
| 10Y Yield | %4.54 | +baz puan | — | FED sıkılaşma baskısı |
| 2Y Yield | — | +10 bps | — | Kısa vade daha hassas |


NFP şokunun ardından piyasa rejimi GEÇİŞ durumunda kalmış; ancak bearish göstergelerin sayısı artmıştır. 10 yıllık tahvil getirisinin %4.75 kriz eşiğine yaklaşması ve DXY'nin güçlenmeye devam etmesi, haftaya genel olarak riskli varlıklar üzerinde baskı oluşturacağını düşündürmektedir. Özellikle faize duyarlı büyüme hisseleri (teknoloji, yapay zeka) ve gelişmekte olan piyasa varlıkları bu ortamda kırılgan kalmaya devam edecektir. Cuma günkü kapanışa yakın görülen alıcıların (dip alımı) varlığı, piyasaların henüz tam bir panik moduna girmediğini ancak yukarı yönlü ivmenin kırıldığını göstermektedir. Hafta başında izlenecek kritik seviyeler olarak S&P 500'de 7,350 (200MA) desteği ve 10 yıllık getiride %4.75 üstü kapanışlar öne çıkmaktadır [^13^].


