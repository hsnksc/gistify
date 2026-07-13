# Gistify Earnings Options Intelligence Engine

## Amaç ve çalışma ilkesi

Motor; günlük fiyat, OHLCV geçmişi, earnings takvimi, tam opsiyon zinciri, faiz ve geçmiş earnings hareketlerini tek bir kanonik veri paketinde birleştirir. Veri sağlayıcısı hesaplama kodundan ayrıdır. Sağlayıcı değiştiğinde yalnızca adaptör veya endpoint çıktısı değiştirilir; SVI, RND, momentum, jump simülasyonu, portföy stresi ve karar kapıları aynı kalır.

Sistem yatırım tavsiyesi veya otomatik emir iletimi yapmaz. `TRADE`, `WATCH` ve `BLOCKED` çıktıları araştırma/karar destek durumlarıdır. Zincir eksikse yüzey veya RND sonucu uydurulmaz.

## Sağlayıcı bağlantısı

`.env.local` ayarları:

```dotenv
OPTIONS_DATA_PROVIDER_URL=https://provider-adapter.example.com/v1/earnings-market-data
OPTIONS_DATA_API_KEY=secret
OPTIONS_DATA_PROVIDER_NAME=vendor-name
OPTIONS_DATA_AUTH_HEADER=Authorization
OPTIONS_DATA_AUTH_PREFIX="Bearer "
OPTIONS_DATA_TIMEOUT_MS=12000
OPTIONS_DATA_CONCURRENCY=4
```

Gistify endpoint'e `symbol` ve varsa `earningsDate` query parametrelerini ekler. Endpoint aşağıdaki kanonik şekli döndürmelidir. Alan adlarındaki yaygın varyasyonlar adaptör tarafından normalize edilir.

### ThetaData v3 Free bağlantısı

ThetaData v3 doğrudan uzak REST endpoint'i değildir. Java 21+ ile çalışan yerel Theta Terminal, API anahtarıyla ThetaData'ya bağlanır ve `http://127.0.0.1:25503/v3` üzerinde yerel REST sunucusu açar.

```powershell
pnpm thetadata:start
```

Gerekli `.env.local` ayarları:

```dotenv
OPTIONS_DATA_PROVIDER=thetadata
THETADATA_API_KEY=your_key
THETADATA_BASE_URL=http://127.0.0.1:25503/v3
THETADATA_MAX_TICKERS=8
THETADATA_MAX_DTE=60
THETADATA_STRIKE_RANGE=15
THETADATA_REQUEST_GAP_MS=3100
```

Free hesap için adaptör, hisse ve opsiyon `history/eod` endpoint'lerini kullanır. Son uygun iş günündeki bütün vadeleri 60 DTE ve ATM çevresinde 15 strike ile sınırlar. Free EOD zinciri IV, Greeks ve open interest sağlamadığından IV bid/ask midpoint üzerinden BSM ile çözülür; birinci derece Greeks aynı IV ile hesaplanır. Sonuçlar `MODEL_DERIVED_IV_GREEKS` ve `DELAYED_EOD_DATA` kapılarını taşır. Analiz, SVI/RND ve backtest için kullanılabilir fakat yaklaşık bir günlük gecikme nedeniyle işlem durumu `BLOCKED` kalır.

#### Docker/VPS

Üretim Docker imajı Java 21 ve Theta Terminal'i içerir. `OPTIONS_DATA_PROVIDER=thetadata` ve `THETADATA_API_KEY` tanımlıysa container başlangıcında Terminal aynı container içinde başlatılır. Bu mimaride doğru adres:

```dotenv
THETADATA_BASE_URL=http://127.0.0.1:25503/v3
```

`25503` hosta publish edilmez; yalnızca Gistify container'ı erişir. Başlangıç logları `docker logs gistify` içinde, ayrıntılı Terminal hataları container içindeki `/tmp/thetadata-terminal.log` dosyasında görülür.

```json
{
  "data": {
    "asOf": "2026-07-12T16:00:00Z",
    "spot": 100.25,
    "riskFreeRate": 0.043,
    "dividendYield": 0.008,
    "earningsDate": "2026-07-20",
    "delayedMinutes": 0,
    "historicalEarningsMoves": [-0.08, 0.11, -0.04, 0.07],
    "bars": [
      { "time": "2026-07-11", "open": 99, "high": 102, "low": 98, "close": 100.25, "volume": 1500000 }
    ],
    "optionChain": [
      {
        "symbol": "XYZ260821C00100000",
        "underlying": "XYZ",
        "expiration": "2026-08-21",
        "strike": 100,
        "right": "CALL",
        "bid": 5.1,
        "ask": 5.3,
        "last": 5.2,
        "volume": 420,
        "openInterest": 3500,
        "impliedVolatility": 0.46,
        "delta": 0.53,
        "gamma": 0.04,
        "theta": -0.08,
        "vega": 0.12,
        "updatedAt": "2026-07-12T15:59:30Z"
      }
    ]
  }
}
```

IV `0.46` veya `46` biçiminde gelebilir. Faiz ondalık biçimde (`0.043`) gönderilmelidir. Tarihler ISO-8601 olmalıdır. En iyi sonuç için tüm strike/vadelerde call ve put, gerçek bid/ask, volume, OI, IV ve Greeks sağlanmalıdır.

## Hesaplama zinciri

1. Veri doğrulama: crossed quote, sıfır fiyat, hatalı strike ve sembol uyuşmazlıkları elenir. Spread/mid en fazla %25 ve OI ≥ 20 veya volume ≥ 5 olan kontratlar likit kabul edilir.
2. Momentum: RSI(14), MACD(12,26,9), ATR(14), 5/20 günlük getiri, gap ve volume z-score ortak `[-100,100]` skoruna dönüştürülür.
3. Akış: volume ve open-interest put/call oranları ayrı hesaplanır. Yakın-ATM call/put IV farkı skew sinyalidir.
4. SVI: her vadede log-moneyness `k=ln(K/F)` ve toplam varyans `w=IV²T` üzerinden raw-SVI `w(k)=a+b[ρ(k-m)+sqrt((k-m)²+σ²)]` kalibre edilir. RMSE ile birlikte negatif varyans, butterfly ve takvim arbitraj uyarıları üretilir.
5. RND: yeterli likit call bulunan en yakın vadede Breeden–Litzenberger ikinci strike türevi sayısal olarak alınır, negatif yoğunluklar sıfırlanır ve alan bire normalize edilir. Beklenen terminal fiyat, spot altı olasılık ve alt %5 expected-shortfall fiyatı hesaplanır.
6. Jump modeli: en az dört geçmiş earnings getirisi varsa jump ortalaması ve volatilitesi kalibre edilir. Earnings horizon içindeyse planlı jump; kalibrasyon varsa Poisson jump bileşeni simülasyona eklenir.
7. Strateji: momentum, call/put, IV, DTE ve rejim yön/volatilite yapısını seçer. Üretilen bacaklar gerçek zincirde en yakın vade/strike ile eşlenir; alış ask, satış bid üzerinden fiyatlanır. Zincirde tam Greeks varsa strateji Greeks'i bacaklardan toplanır.
8. Monte Carlo: tam zincir ve başarılı jump kalibrasyonunda 50.000; fallback modelde 12.000 deterministik yol çalışır. POP, brüt EV, maliyet sonrası EV, ortalama kazanç/kayıp ve CVaR %95 hesaplanır.
9. Maliyet: gerçek zincirde bid/ask doğrudan bacak fiyatına girer. Fallback modunda likidite, IV rank ve moneyness tabanlı round-trip slippage tahmini kullanılır.
10. Risk: `%−15..+15` fiyat stresleri, maksimum kayıp, Reg-T yaklaşımı, Kelly kesri ve earnings/gamma penceresi kontrol edilir.
11. Karar kapısı: geçmiş/eksik event, canlı fiyat yokluğu, negatif net EV, DTE ≤ 1 veya kullanılamaz zincir `BLOCKED`; bozulmuş zincir, yüksek jump veya DTE ≤ 3 `WATCH`; bütün zorunlu kapılar geçerse `TRADE` olabilir.

## Veri kalite kapıları

- `MINIMUM_CHAIN_DEPTH`: 20'den az geçerli kontrat.
- `LOW_LIQUIDITY`: kontratların %35'inden azı likit.
- `INCOMPLETE_BID_ASK`: bid/ask kapsaması %80'in altında.
- `STALE_QUOTES`: kontratların %10'dan fazlası 20 dakikadan eski.
- `SURFACE_NOT_CALIBRATED`: en az bir vadede beş kullanılabilir IV noktası yok.
- `RND_NOT_AVAILABLE`: aynı vadede en az yedi likit call yok.

`DEGRADED` zincir otomatik olarak `WATCH` seviyesini aşamaz. `UNAVAILABLE` zincir, sağlayıcı veri göndermiş olsa bile işlemi bloke eder.

## Portföy risk API'si

`POST /api/earnings/portfolio-risk`

```json
{
  "benchmarkPrice": 650,
  "positions": [
    {
      "ticker": "XYZ",
      "quantity": 2,
      "multiplier": 100,
      "underlyingPrice": 100.25,
      "beta": 1.15,
      "delta": 0.32,
      "gamma": -0.018,
      "vega": -0.09,
      "theta": 0.07,
      "marketValue": 850
    }
  ]
}
```

Çıktı beta-weighted delta, net gamma/vega/theta, yoğunlaşma, en kötü stres zararı ve 7 fiyat şoku × 3 volatilite şokundan oluşan 21 hücreli matrisi içerir. Bu araştırma stresidir; broker/FINRA portfolio-margin onayı değildir.

## Günlük uyarılar

`EARNINGS_ALERT_WEBHOOK_URL` ayarlanırsa strateji değişimleri, `BLOCKED` durumları ve kritik uyarılar JSON webhook olarak gönderilir. Aynı ticker/strateji/durum/uyarı bileşimi varsayılan altı saat boyunca tekrar gönderilmez. Taşıma hatası ana veri yenilemesini durdurmaz.

## Walk-forward doğrulama

`walkForwardValidate` aday parametre/stratejileri yalnızca geçmiş eğitim penceresinde sıralar ve seçilen adayı bir sonraki görülmemiş test penceresinde ölçer. Pencereler ileri kaydırılır. Raporlanan performans yalnızca out-of-sample getirilerden oluşur: compounded return, Sharpe, maksimum drawdown, hit-rate ve seçim kararlılığı. Üçten az fold, Sharpe < 0.5, drawdown > %20 veya seçim kararlılığı < %40 modeli başarısız sayar.

## Ana dosyalar

- `server/optionsDataProvider.ts`: sağlayıcı adaptörü ve kanonik normalizasyon.
- `server/optionsAdvancedEngine.ts`: zincir analizi, SVI, RND, momentum, jump ve portföy stresi.
- `server/optionsWalkForward.ts`: rolling out-of-sample doğrulama.
- `server/earningsQuantEngine.ts`: strateji seçimi, fiyatlama, Monte Carlo, EV/Kelly ve işlem kapısı.
- `server/earningsAlertDispatcher.ts`: webhook uyarı dağıtımı ve deduplication.
- `shared/optionsAnalytics.ts`: ortak veri ve sonuç tipleri.

## Operasyonel kabul kriterleri

Sağlayıcı bağlandıktan sonra önce fixture yerine gerçek sembollerle quote kapsamı, stale oranı, SVI RMSE, RND integralinin yaklaşık 1 olması, put/call toplamları ve bacak eşleşmeleri kontrol edilmelidir. Emir bağlantısı ancak en az üç aylık walk-forward/out-of-sample izleme, slippage mutabakatı ve risk limitlerinin broker verisiyle karşılaştırılması tamamlandıktan sonra ayrı bir onayla eklenmelidir.
