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

## Adım 2 — Post Metni Üret

**Format:** Tek post, max 280 karakter (X.com tweet limiti).

**Stil:**
- Türkçe ana dil, finansal jargon İngilizce (VWAP, 0DTE, CALL, PUT, IV Crush, momentum)
- Emojili ve görsel
- Kısa, net, aksiyon odaklı
- Hashtag yok (spam algılanmaması için)

**Post template (aktif piyasa):**
```
📊 Gün Özeti | [GG.AA.YYYY]
• SPY [±%] | QQQ [±%] | VIX [değer]
• 🔥 [Ticker] [±%] momentum
• ❄️ [Ticker] [±%] pullback
• Midas: [Direction] | Score [X/10]
[1 cümle insight]
```

**Post template (yatay piyasa — "too quiet"):**
```
📊 Gün Özeti | [GG.AA.YYYY]
• SPY [±%] | QQQ [±%] | VIX [değer]
• Too quiet — mean reversion modu
• Midas: [N] CALL, [N] PUT sinyali
• VWAP bounce & gap fade fırsatları
[1 cümle risk notu]
```

**Örnek:**
```
📊 Gün Özeti | 25.06.2026
• SPY +0.8% | QQQ +1.2% | VIX 18.5
• 🔥 TSLA +4.5% VWAP break
• ❄️ META -2.1% gap fade
• Midas: CALL | Score 8.2/10
FOMC öncesi volatilite yükseliyor, 0DTE straddle izle.
```

Karakter limitini kesinlikle aşma. 280 karakterin altında kal.

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
