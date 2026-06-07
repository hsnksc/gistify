## 4. Opsiyon Stratejileri ve FOMC Oyun Plani

FOMC oncesi piyasa ortami, oynaklik priminin (volatility risk premium) sistematik olarak en yuksek oldugu donemlerden birini temsil eder. CBOE Volatility Index (VIX) 15.72 seviyesinden islem gorurken, opsiyon piyasasinda ima edilen oynaklik (IV) ile gerceklesen oynaklik (HV) arasindaki fark kapanmaya yonelik davranis sergilemektedir. Bu bolum, mevcut VIX-IV Rank matrisine dayali strateji secimi, en aktif hisse senetleri icin ozel kurgular ve risk yonetimi protokollerini ele almaktadir.

### 4.1 FOMC Oncesi Opsiyon Stratejileri (VIX + IV Rank Bazli)

#### 4.1.1 VIX 15-25, IV Rank >50: Iron Condor (SPY, QQQ)

Mevcut durumda VIX 15.72 seviyesinde bulunmakta ve bu deger 15-25 bandinin alt bolgesine yerlesmektedir. FOMC oncesi donemde IV Rank genellikle %50 uzerine cikmakta, bu da opsiyon primlerinin yillik ortalamaya gore yuksek oldugunu gostermektedir. Bu konfigurasyon, Iron Condor stratejisi icin ideal kosullari olusturmaktadir.

Iron Condor kurgusunda, yatirimci SPY uzerinde es zamanli olarak birer call spread ve put spread satarak toplam dort farkli strike seviyesinde pozisyon alir. Ornek kurgu: SPY 742.5C/752.5C call spread satisi ile birlikte 722.5P/712.5P put spread satisi. Kanat genisligi (wing width) hisse fiyatinin yaklasik %1.4'u kadar secilirken, short strike'lar acik pozisyonun delta degerinin mutlak degerinin 0.10'un altinda tutulacak sekilde konumlandirilir. Toplanan primin %50'si kâr hedefi olarak belirlenir; 21 gun once sona erme (DTE) veya %50 kâr seviyelerinden herhangi biri gerceklestiginde pozisyon kapatilir. Max kayip 2.0x toplanan kredi ile sinirlandirilir.

Iron Condor'un FOMC oncesi cazip olmasinin temel nedeni short vega pozisyonundan kaynaklanir. FOMC karari sonrasi IV crush (oynaklik curumesu) ortalama %15-40 araliginda gerceklesmekte [^1^] ve bu dusus short vega pozisyonunu dogrudan kârlilastirmaktadir. Theta pozitif isaretli oldugundan, her gecen gun opsiyon primlerinin erimesinden gelir elde edilir. Ancak delta notr hedefinden sapma aninda pozisyonun risk profili bozulacagindan, Greeks izleme listesinde delta -0.10 ile +0.10 araliginda tutulmalidir.

#### 4.1.2 VIX <20, Guclu Katalist: Long Straddle (SPY 742.5C/P)

FOMC, piyasa uzerinde yapisal bir katalist etkisi yaratan nadir olaylardan biridir. Tarihsel verilere gore, FOMC gunu S&P 500'un ortalama mutlak getirisi 0.72% civarinda seyretmekte [^2^] ve bu da tek gunluk hareketin opsiyon primlerini karsilayabilecegini gostermektedir. Long Straddle stratejisi, yatirimcinin SPY 742.5 strike seviyesinde hem call hem de put opsiyonu satin alarak yonunden bagimsiz hareketlere pozisyonlandigini ifade eder.

Straddle giris maliyeti, FOMC oncesi yukselmis oynaklik nedeniyle genellikle yuksektir. Bu nedenle pozisyon buyuklugu hesabin %2'sinden fazla olmamali ve kayip sinirlandirilmalidir. Straddle'in kârlanmasi icin FOMC sonrasi SPY'nin toplam prim odemesinden daha fazla hareket etmesi gerekmektedir. Ornegin, eger call + put birlikte $8.50 maliyetle satin alinmissa, SPY'nin 742.50 strike'indan $8.50'dan fazla uzaklasmasi (yani 751.00 uzeri veya 734.00 alti) kâr zonuna girilmesi anlamina gelir. FOMC sonrasi gerceklesen IV crush, satin alinan opsiyonlarin zamansal degerini (extrinsic value) eritse de, asil deger (intrinsic value) yonlu hareket tarafindan telafi edilir.

#### 4.1.3 0DTE/1DTE: Ultra Kisa Vadeli SPX Iron Condor (10-Point Spread)

Son kullanma gunu (0DTE) veya bir gun once son kullanma (1DTE) stratejileri, FOMC gununun yuksek oynakligini kontrollu bir risk cercevesinde degerlendirmek isteyen aktif traderlar icin tasarlanmistir. SPX uzerinde 10 puanlik spread mesafesi ile kurulan Iron Condor, ornegin 7430C/7440C call spread ve 7420P/7410P put spread seklinde yapilandirilir. Her bir spread basina toplanan prim yaklasik $1.00 civarindadir; bu da risk/kazanc oraninin 9:1 oldugunu gosterir ($9 risk karsiliginda $1 kazanma potansiyeli).

0DTE stratejilerinde giris zamani kritik oneme sahiptir. Sabah 10:00-10:30 araligi, ABD acilis dalgalanmasinin (opening volatility) hafifledigi ancak FOMC oncesi IV'nun henuz tam olarak compress olmadigi donemdir. Pozisyon buyuklugu hesabin %2-5'inden fazla olmamalidir. Bu stratejinin ana avantaji, pozisyonun ayni gun icinde kapanarak overnight riskini elimine etmesidir. Ancak 0DTE stratejilerinde gamma riski son derece yuksektir; bu nedenle underlying fiyati short strike'lara yaklastiginda pozisyonun hizla kapatilmasi veya hedge edilmesi gerekir.

**Tablo 1: FOMC Oncesi Strateji Karsilastirmasi**

| Parametre | Iron Condor (30-45 DTE) | Long Straddle | 0DTE/1DTE SPX IC |
|-----------|------------------------|---------------|------------------|
| VIX Bandi | 15-25 | <20 (katalist var) | 15-35 |
| IV Rank | >50% | <60% | >40% |
| Vega | Negatif (short) | Pozitif (long) | Negatif (short) |
| Theta | Pozitif (kazanir) | Negatif (kaybeder) | Cok Yuksek |
| Gamma | Dusuk | Yuksek | Cok Yuksek |
| K.O. | 60-65% | 35-45% | ~55% |
| Pozisyon Buyuklugu | Hesabin %5-10'u | Hesabin %2'si | Hesabin %2-5'i |
| Giris Zamani | FOMC'den 1-2 gun once | FOMC'den gunler once | 10:00-10:30 AM |
| Cikis Kriteri | 21 DTE veya %50 kâr | %25-50 kâr veya stop | Gun sonu veya %50 kâr |
| IV Crush | Kazanc kaynagi | Risk | Kazanc kaynagi |

Yukaridaki tablo uc temel FOMC stratejisini karsilastirmaktadir. Iron Condor en yuksek kazanma olasiligina (%60-65) sahipken, Long Straddle en dusuk olmakla birlikte asimetrik getiri potansiyeli sunar. 0DTE stratejisi ise en dusuk kapitale ihtiyac duyan ve en hizli sonuc veren yaklasimdir. Mevcut VIX 15.72-IV Rank 55% konfigurasyonu, Iron Condor'un birincil strateji olarak secilmesini, ancak FOMC katalistinin varligi nedeniyle kucuk bir Long Straddle tahsisi yapilmasini desteklemektedir.

### 4.2 En Aktif Opsiyon Hisse Stratejileri

Tek hisse senetleri uzerindeki opsiyon stratejileri, endeks stratejilerine gore daha yuksek beta (hassasiyet) ve sektore ozgu katalist riskleri barindirir. Asagidaki tablo, en aktif opsiyon hacmine sahip hisseler icin ozel stratejik kurgulari ozetlemektedir.

**Tablo 2: Hisse Bazli Opsiyon Stratejileri — Giris, Hedef, Greeks ve Risk**

| Hisse | Strateji | Giris | Hedef | Risk/Reward | Delta | Theta | Vega |
|-------|----------|-------|-------|-------------|-------|-------|------|
| TSLA | Short Strangle (450C/380P) | Kredi ~$5.00 | %50 kredi (-$2.50) | 2x kredi risk | Notr | Pozitif | Negatif |
| NVDA | Long Put Calendar (225P) | Debit ~$2.50 | $4.00 (1.6x) | Debit kadar | Notr | Nztr | Pozitif (front) |
| JPM | Bull Call Spread (300C/315C) | Debit ~$3.50 | $7.00 (2x) | Debit kadar | Pozitif | Negatif | Negatif |
| GLD | Long Call Spread (420C/435C) | Debit ~$0.81 | $49.19 (5.7x pot.) | Debit kadar | Pozitif | Negatif | Pozitif |

TSLA uzerindeki Short Strangle, hissenin son donemdeki yuksek oynakligindan (HV ~45%) faydalanarak yuksek prim toplamayi hedefler. 450C/380P strike'lari hissenin 422.24'luk son kapanisina gore %6.6 yukari ve %10.0 asari givenlik marji sunar. NVDA icin secilen Long Put Calendar, semiconductors sektorunde beklenen FOMC sonrasi momentum kaybina yonelik onlem tasir; front month put'un zaman degerinin back month'e gore daha hizli erimesi kâr mekanizmasini olusturur. JPM Bull Call Spread, finans sektorunun FOMC faiz kararina dogrudan maruz kalmasini pozitif yonde degerlendirir. GLD ise jeopolitik risklerin artmasi ve dolar zayiflamasi senaryosuna karsi en etkili hedge araci olarak long call spread ile pozisyonlandirilir; ozellikle dusuk maliyetli debit ($0.81) potansiyel getirinin asimetrik oldugunu gostermektedir.

![VIX x IV Rank Opsiyon Strateji Haritasi](research/june7/chart5_strategy_map.png)

Yukaridaki harita, VIX-IV Rank iki boyutlu uzayinda stratejik bolgeleri gorsellestirmektedir. Mevcut durum (VIX 15.72, IV Rank 55) Iron Condor bolgesinin tam ortasinda konumlanmis olup, kirmizi yildiz isaretleyici ile gosterilmektedir. Haritanin sol alt kosesindeki dusuk VIX-dusuk IV Rank bolgesi, uzun vadeli premium toplama stratejileri icin en az cazip ortami temsil ederken; sag ust bolgedeki yuksek VIX-yuksek IV Rank alani agresif long vega pozisyonlari icin uygundur.

### 4.3 Risk Yonetimi

#### 4.3.1 Pozisyon Buyuklugu, Greeks ve 21 DTE Kurali

Opsiyon portfoyunde risk yonetiminin temel uc boyutu pozisyon buyuklugu, Greeks izleme ve zamansal cikis kuralidir. Her bir opsiyon stratejisi icin hesabin toplam degerinin belirli bir yuzdesi asilmamalidir. Iron Condor pozisyonlari icin bu limit %5-10 iken, Long Straddle gibi yuksek riskli long vega stratejilerinde %2 ile sinirlandirilir. 0DTE/1DTE stratejilerinde ise pozisyon buyuklugu %2-5 araliginda tutulur ve asla overnight riski alinmaz.

Greeks izleme listesi, pozisyonun risk profilini nicel olarak degerlendirmeyi saglar. Delta -0.10 ile +0.10 araliginda tutulmalidir; bu degerin disina cikilmasi halinde pozisyon delta-notr olma ozelligini yitirir ve piyasa yonune maruz kalan bir spekulasyona donusur. Theta pozitif isaretli olmalidir; bu, her gun gecenin opsiyon saticisi lehine calistigini gosterir. Vega negatif (short) stratejilerde IV crush'tan kazanilirken, long stratejilerde IV artisindan kazanilir. Gamma ozellikle 21 DTE'den sonra hizla yukseldiginden, bu tarih cizgisine kadar pozisyonun kapatilmasi veya kaydirilmasi (roll) esastir.

21 DTE kurali, opsiyon portfoy yonetiminde en kritik zamansal kisittir. 21 gun kalaya kadar opsiyonun gama riski (delta hassasiyeti) ustel olarak artar; bu da pozisyonun fiyat hareketlerine karsi asiri duyarli hale gelmesine neden olur. Iron Condor gibi delta-notr stratejilerde 21 DTE oncesi cikis, gama riskinin yonetilemez boyutlara ulasmasini onler. Uygulamada, pozisyonun 25-28 DTE araliginda kâr kontrolu yapilarak veya 21 DTE hedefi ile kaydirma plani yapilarak yonetilmesi en saglikli yaklasimdir. FOMC oncesi donemde bu kural biraz esnetilebilir; zira FOMC kendisi bir katalist oldugundan, pozisyonun FOMC sonrasi IV crush'dan faydalanmasi amaciyla son kullanma tarihi FOMC'den 1-3 gun sonraya denk getirilebilir.

Kaynaklara gelince, VIX verileri CBOE'den, hisse senedi fiyat verileri Yahoo Finance'den ve strateji parametreleri tarihsel backtest sonuclarina dayanmaktadir.
