# Gistify → X.com Daily Post Prompt

Gistify'daki güncel market ve momentum verilerini oku, günün özetini X.com post'u olarak hazırla ve WebBridge ile X.com'a at.

## Adım 1 — Veri Okuma

Aşağıdaki dosyaları oku (varsa):

1. `C:\Users\hasan\OneDrive\Desktop\gistify\client\public\marketflash\marketflash_report.json`
   - `marketSnapshot` (SPY, QQQ, IWM, VIX değişimleri)
   - `premarketMovers` veya `intradayMovers` (gainer/loser listesi)
   - `optionSetups` (CALL/PUT setup'ları)
   - `riskAssessment` (VIX regime, piyasa seviyesi)

2. `C:\Users\hasan\OneDrive\Desktop\gistify\client\public\midas_signals.json`
   - `signals[]` array'inden top 2-3 sinyal
   - `direction` (CALL/PUT), `confidence`, `confluenceScore`

3. `C:\Users\hasan\OneDrive\Desktop\gistify\ppi_forecast.json` (varsa)
   - `scenarios[0]` (base case probability)

4. `C:\Users\hasan\OneDrive\Desktop\gistify\cpi_forecast.json` (varsa)

5. `C:\Users\hasan\OneDrive\Desktop\gistify\earningreport\` dizinindeki son `.md` dosyası (varsa)

Eğer dosya yoksa veya boşsa, atla ve mevcut verilerle devam et. Eğer tüm dosyalar yoksa, web araştırması ile günün piyasa özetini üret.

## Adım 2 — Post Metni Üret (X Pro Formatı)

**Format:** Kısa satırlar, bol emoji, punchy, Twitter-native. Duvar metni (wall of text) YASAK.

**Stil:**
- Türkçe ana dil, finansal jargon İngilizce (VWAP, 0DTE, CALL, PUT, IV Crush, momentum)
- Her satır 40-60 karakter max (mobilde okunabilir)
- Bol emoji, her paragraf 1-2 satır max
- $ işareti TÜM ticker'lar önüne (SPY değil $SPY)
- Hashtag yok (spam algılanmaması için)
- FOTO ÜRETME (grafik, chart, screenshot YASAK)

**Post Template (Market Flash — After-Market):**
```
📊 25.06 | $SPY $QQQ $IWM $VIX

Endeks:
🔴 $SPY -0.05% 733.24
🔴 $QQQ -0.42% 710.62
🟢 $IWM +0.46% 296.69
🟢 $VIX 18.6 (-4.4%)

🔥 Gainer:
$KBH +16.7% — homebuilder rally
$FOUR +14.4% — fintech bounce
$RUN +12.6% — solar rebound

❄️ Loser:
$CBRS -17.9% — AI chip selloff
$NVTS -18.3% — semi break

🎯 $MU +13% AH
$25.11 vs $20.20 est
Q4 guidance 49-51B
0DTE YASAK — IV crush

⚠️ PCE 8:30 ET
Core 3.4% est
3-gün negatif → mean reversion?
```

**Post Template (Midas — Sinyal):**
```
🎯 Midas | 50 sembol | 49 OK

🏆 Top STRONG_BUY:
$MU — Score 43
Entry 1239 | Stop 1085
Target 1471/1626 | R/R 2.5x

$INTC — Score 45.5
Entry 138 | Stop 122
Target 162/178 | R/R 2.5x

$ALAB — Score 30.4
MACD bullish cross
Monthly +33%

⚠️ $MU IV crush yüksek
Swing izle, 0DTE tavsiye edilmez
```

**Post Template (Macro — PCE/CPI):**
```
📈 Macro | 25.06.2026

PCE 8:30 ET yarın:
• Core 3.4% est
• Jobless Claims
• GDP Revision

CPI Forecast (11 Temmuz):
Base: Headline +0.10%
Core +0.20%
Brent 72.56 → oil deflation

PPI Forecast (15 Temmuz):
Base: Headline +0.1%
Core +0.3% — sticky
Hormuz 60-day window

10Y 4.50% — regime line
DXY 101.50 — 52w high yakını
```

**Post Template (Earnings Strategy):**
```
📅 Earnings | Rolling 2-Ay

🎯 $MU — MASSIVE BEAT
EPS 25.11 vs 20.20
AH +13% → swing carry

🏠 Homebuilders güçlü
$KBH +16.7% — rate-cut narrative
Rotation real assets

✈️ Airlines UAL/DAL
Jet fuel collapse + summer
CPI soft = +10-15%

⚠️ Kurallar:
0DTE = earnings day ONLY
IV crush: enter 2-5g önce
Max hold 2 gün
FOMC week: size -50%
```

## Adım 3 — X.com Post Atma (WebBridge)

**Windows kullanıyoruz.** Her curl komutunda JSON body'yi dosyaya yaz, sonra `curl.exe` ile gönder. Inline JSON Türkçe karakterleri bozar.

### 3.1 Daemon Kontrolü
```bash
curl.exe -s http://127.0.0.1:10086/command
```
Yanıt alamazsan:
```bash
"C:\Users\hasan\.kimi-webbridge\bin\kimi-webbridge.exe" start
```
5 saniye bekle, tekrar dene.

### 3.2 X.com Compose Sayfasına Git
JSON body'yi dosyaya yaz (`C:\Users\hasan\AppData\Local\Temp\webbridge-xpost-1.json`):
```json
{
  "action": "navigate",
  "args": {
    "url": "https://x.com/compose/tweet",
    "newTab": true,
    "group_title": "Gistify X Post"
  },
  "session": "gistify-xpost"
}
```
Sonra:
```bash
curl.exe -s -X POST http://127.0.0.1:10086/command -H "Content-Type: application/json" --data-binary "@C:\Users\hasan\AppData\Local\Temp\webbridge-xpost-1.json"
```

### 3.3 Snapshot Al ve Elementleri Bul
JSON body'yi dosyaya yaz (`C:\Users\hasan\AppData\Local\Temp\webbridge-xpost-2.json`):
```json
{
  "action": "snapshot",
  "args": {},
  "session": "gistify-xpost"
}
```
```bash
curl.exe -s -X POST http://127.0.0.1:10086/command -H "Content-Type: application/json" --data-binary "@C:\Users\hasan\AppData\Local\Temp\webbridge-xpost-2.json"
```

Snapshot'ta:
- `@e` ref ile text input/textarea ara (label: "What is happening?!", "Post", "Tweet", "What's happening?")
- `@e` ref ile "Post" button ara (label: "Post" veya "Tweet")

### 3.4 Post Metnini Yaz
JSON body'yi dosyaya yaz (`C:\Users\hasan\AppData\Local\Temp\webbridge-xpost-3.json`):
```json
{
  "action": "fill",
  "args": {
    "selector": "@eXXX",
    "value": "[POST_METNI]"
  },
  "session": "gistify-xpost"
}
```
```bash
curl.exe -s -X POST http://127.0.0.1:10086/command -H "Content-Type: application/json" --data-binary "@C:\Users\hasan\AppData\Local\Temp\webbridge-xpost-3.json"
```

### 3.5 Post Et
JSON body'yi dosyaya yaz (`C:\Users\hasan\AppData\Local\Temp\webbridge-xpost-4.json`):
```json
{
  "action": "click",
  "args": {
    "selector": "@eYYY"
  },
  "session": "gistify-xpost"
}
```
```bash
curl.exe -s -X POST http://127.0.0.1:10086/command -H "Content-Type: application/json" --data-binary "@C:\Users\hasan\AppData\Local\Temp\webbridge-xpost-4.json"
```

### 3.6 Doğrula
5 saniye bekle, sonra snapshot al ve timeline'da post görünüyor mu kontrol et. Veya screenshot al.

### 3.7 Session Kapat
JSON body'yi dosyaya yaz:
```json
{
  "action": "close_session",
  "args": {},
  "session": "gistify-xpost"
}
```
```bash
curl.exe -s -X POST http://127.0.0.1:10086/command -H "Content-Type: application/json" --data-binary "@C:\Users\hasan\AppData\Local\Temp\webbridge-xpost-close.json"
```

**Fallback:** Eğer X.com'a login olunmamışsa veya captcha/bot koruması varsa, post metnini dosyaya kaydet ve "X.com login required — post ready at [path]" rapor et. Kullanıcıya manuel atması için post metnini göster.

**ÖNEMLİ:** Fotoğraf, grafik, chart, screenshot ÜRETME ve UPLOAD ETME. Sadece metin post'ları.

## Adım 4 — Kaydet

Post metnini, atma durumunu, timestamp'i JSON olarak kaydet:

```json
{
  "date": "YYYY-MM-DD",
  "postText": "...",
  "status": "posted | failed | login_required",
  "timestamp": "ISO8601",
  "sources": ["marketflash", "midas"]
}
```

Hedef:
- `C:\Users\hasan\OneDrive\Desktop\gistify\xpost\YYYY-MM-DD_post.json`
- `C:\Users\hasan\OneDrive\Desktop\xpost\YYYY-MM-DD_post.json`

Klasör yoksa oluştur: `mkdir -p` (Git Bash'te) veya `mkdir` (cmd'de).

## Adım 5 — Raporla

Bu conversation'da şunları raporla:
1. Üretilen post metni (tam metin)
2. X.com atma durumu (başarılı / başarısız / login_required)
3. Hata varsa nedeni ve çözüm önerisi
4. Kaydedilen dosya path'leri
5. Kullanıcıya: "Post hazır. X.com'da kontrol edebilirsin."
