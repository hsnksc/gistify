# Test Nasıl Yapılır — Adım Adım

> Bu test, production'daki programmatik SEO sayfalarını kontrol eder. 5 curl komutu, 1 dakika sürer.

---

## Seçenek A: Git Bash Terminal (Önerilir)

Git Bash, Git for Windows ile birlikte gelir. Masaüstüne sağ tıkla → "Git Bash Here" varsa kullan.

### Adım 1: Terminal Aç

1. Masaüstüne sağ tıkla → **"Git Bash Here"** (veya Başlat menüsü → "Git Bash")
2. Siyah bir terminal penceresi açılır.

### Adım 2: Komutu Yapıştır

Terminal penceresine sağ tıkla → **Paste** (veya `Shift+Insert`).

Bu komutları aynı anda yapıştır:

```bash
curl -s -o /dev/null -w "AAPL: %{http_code}\n" https://gistify.pro/earnings/AAPL && \
curl -s -o /dev/null -w "Iron Condor: %{http_code}\n" https://gistify.pro/strategies/iron-condor && \
curl -s -o /dev/null -w "Momentum: %{http_code}\n" https://gistify.pro/scanners/momentum && \
curl -s -o /dev/null -w "404 Test: %{http_code}\n" https://gistify.pro/earnings/XYZ && \
curl -s -o /dev/null -w "301 Redirect: %{http_code}\n" https://gistify.pro/screens/momentum
```

### Adım 3: Enter'a Bas

`Enter` tuşuna bas. 5-10 saniye bekle.

### Adım 4: Sonucu Oku

Terminalde şunu görmelisin:

```
AAPL: 200
Iron Condor: 200
Momentum: 200
404 Test: 404
301 Redirect: 301
```

**Bu sonuç = BAŞARI** ✅

---

## Seçenek B: PowerShell (Windows)

### Adım 1: PowerShell Aç

Başlat menüsü → "PowerShell" yaz → **Windows PowerShell** aç.

### Adım 2: Komutları Yapıştır

PowerShell'de sağ tıkla → yapıştır. Her satırı ayrı ayrı yapıştır ve `Enter` bas:

```powershell
Invoke-WebRequest -Uri "https://gistify.pro/earnings/AAPL" -Method GET -UseBasicParsing | Select-Object -ExpandProperty StatusCode
```

Beklenen: `200`

```powershell
Invoke-WebRequest -Uri "https://gistify.pro/strategies/iron-condor" -Method GET -UseBasicParsing | Select-Object -ExpandProperty StatusCode
```

Beklenen: `200`

```powershell
Invoke-WebRequest -Uri "https://gistify.pro/scanners/momentum" -Method GET -UseBasicParsing | Select-Object -ExpandProperty StatusCode
```

Beklenen: `200`

```powershell
Invoke-WebRequest -Uri "https://gistify.pro/earnings/XYZ" -Method GET -UseBasicParsing | Select-Object -ExpandProperty StatusCode
```

Beklenen: `404` (hata verir, bu normal — beklenen sonuç)

```powershell
Invoke-WebRequest -Uri "https://gistify.pro/screens/momentum" -Method GET -UseBasicParsing -MaximumRedirection 0 | Select-Object -ExpandProperty StatusCode
```

Beklenen: `301` (veya redirect hatası — bu normal)

---

## Seçenek C: Tarayıcı (En Basit)

Tarayıcında her URL'i aç ve gördüğünü bana anlat:

1. `https://gistify.pro/earnings/AAPL` → Açılıyor mu? İçerik dolu mu?
2. `https://gistify.pro/strategies/iron-condor` → Açılıyor mu? Setup steps var mı?
3. `https://gistify.pro/scanners/momentum` → Açılıyor mu? Tablo var mı?
4. `https://gistify.pro/earnings/XYZ` → 404 mu gösteriyor? (Beklenen: "Not Found" sayfası)
5. `https://gistify.pro/screens/momentum` → `/scanners/momentum` adresine yönlendiriyor mu?

**Tarayıcı ile test et, sonucu bana söyle.**

---

## Beklenen Sonuç (Özet)

| URL | Beklenen HTTP Kodu | Anlamı |
|-----|-------------------|--------|
| `/earnings/AAPL` | **200** | Sayfa açılıyor, içerik dolu |
| `/strategies/iron-condor` | **200** | Sayfa açılıyor, strateji guide var |
| `/scanners/momentum` | **200** | Sayfa açılıyor, scanner tablosu var |
| `/earnings/XYZ` | **404** | Böyle bir ticker yok, hata sayfası dönüyor |
| `/screens/momentum` | **301** | Eski adres, yeni adrese yönlendiriyor |

**Hepsi bu şekilde çıkıyorsa → Faz 5 tamam.**

---

## Hata Alırsan

| Hata | Nedeni | Çözüm |
|------|--------|-------|
| `404` on AAPL | Branch merge edilmemiş veya deploy olmamış | GitHub'da PR'yi merge et, production'a deploy et |
| `500` | Server hatası | `server/seo-routes.ts` ve `server/templates/` dosyaları deploy edilmemiş olabilir |
| `curl: command not found` | curl yüklü değil | Git Bash kullan (curl yüklü gelir) veya tarayıcı ile test et |
| `Could not resolve host` | İnternet yok veya DNS sorunu | İnternet bağlantını kontrol et |

---

## En Basit Yol: Bana Sonucu Gönder

Tarayıcıda şu 3 URL'i aç, ekran görüntüsü al veya gördüğünü yaz:

1. `https://gistify.pro/earnings/AAPL`
2. `https://gistify.pro/strategies/iron-condor`
3. `https://gistify.pro/scanners/momentum`

**Gördüğün sayfayı bana anlat — düzeltelim.** 🚀
