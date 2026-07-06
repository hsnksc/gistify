# Gistify X Research Pipeline

**X.com home feed → post filter → Mistral deep research → article synthesis → Flow HTML → git deploy**

Gistify'in X.com kaynaklı finans/ekonomi içerikli post'ları otomatik olarak toplayıp, Mistral AI ile derin araştırmaya tabi tuttuğu, sonrasında okunabilir makalelere dönüştürdüğü ve `flow/` arşivine HTML olarak deploy ettiği otomasyon pipeline'ı.

---

## 📦 Kurulum

### 1. `.env` dosyası oluştur

Proje root'unda `.env` dosyası oluştur ve aşağıdaki değişkenleri ekle:

```bash
# Mistral API (zorunlu)
MISTRAL_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Opsiyonel — varsayılanlar config.py'de tanımlı
MISTRAL_MODEL=mistral-large-latest
MISTRAL_API_URL=https://api.mistral.ai/v1/chat/completions
WEBBRIDGE_URL=http://127.0.0.1:10086

# Filtreleme threshold'ları
MIN_LIKES_TR=50
MIN_LIKES_EN=100
MIN_CHARS_TR=100
MIN_CHARS_EN=150
TOP_POSTS_PER_LANG=5
TIME_BONUS_HOURS=6
TIME_BONUS_SCORE=20
```

> ⚠️ `MISTRAL_API_KEY` olmadan pipeline research stage'i çalışmaz. Scraper + filter + deploy aşamaları API key'siz çalışabilir.

### 2. Python bağımlılıklarını yükle

```bash
pip install -r requirements_x.txt
```

### 3. WebBridge daemon'ın çalıştığından emin ol

Pipeline X.com verisini çekmek için WebBridge'e ihtiyaç duyar:

```bash
# Kimi Desktop/WebBridge çalışıyor olmalı
# Varsayılan endpoint: http://127.0.0.1:10086
```

---

## 🚀 Çalıştırma

### Manuel çalıştırma

```bash
# Tam pipeline (tüm stage'ler)
python scripts/run_x_research_pipeline.py

# Sadece HTML oluştur, deploy etme (test için)
python scripts/run_x_research_pipeline.py --dry-run

# Scraper'ı atla, mevcut raw_posts.json kullan
python scripts/run_x_research_pipeline.py --skip-scraper

# Mistral research'i atla, mevcut sonuçları kullan
python scripts/run_x_research_pipeline.py --skip-mistral

# Her ikisini birden atla (sadece article → flow → deploy)
python scripts/run_x_research_pipeline.py --skip-scraper --skip-mistral

# Belirli bir tarih için çalıştır
python scripts/run_x_research_pipeline.py --date 5-temmuz-2026
```

### Stage haritası

| #  | Stage                | Script                        | Kritik | Skip flag       |
|----|----------------------|-------------------------------|--------|-----------------|
| 1  | X Scraper            | `scripts/x_scraper.py`        | ✅ Evet | `--skip-scraper` |
| 2  | Post Filter          | `scripts/post_filter.py`      | ✅ Evet | —               |
| 3  | Mistral Research     | `scripts/mistral_research.py` | ❌ Hayır| `--skip-mistral` |
| 4  | Article Synthesizer  | `scripts/article_synthesizer.py`| ❌ Hayır| —               |
| 5  | Flow Converter       | `scripts/flow_converter.py`   | ✅ Evet | —               |
| 6  | Deploy Flow          | `scripts/deploy_flow.py`      | ✅ Evet | `--dry-run`     |

> **Kritik stage** başarısız olursa pipeline durur. **Opsiyonel stage** başarısız olursa loglanır ama pipeline devam eder.

---

## ⏰ Cron Kurulumu (Günde 2 kez)

### Windows — Görev Zamanlayıcı

PowerShell (Administrator) ile:

```powershell
# Görev oluştur — her gün 09:00 ve 21:00'de çalışır
$action = New-ScheduledTaskAction -Execute "python.exe" -Argument "C:\Users\hasan\OneDrive\Desktop\gistify\scripts\run_x_research_pipeline.py"
$trigger1 = New-ScheduledTaskTrigger -Daily -At 09:00
$trigger2 = New-ScheduledTaskTrigger -Daily -At 21:00
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
Register-ScheduledTask -TaskName "GistifyXResearchPipeline" -Action $action -Trigger $trigger1,$trigger2 -Settings $settings -User "hasan" -RunLevel Highest
```

### Linux/macOS — crontab

```bash
# crontab -e
0 9,21 * * * cd /path/to/gistify && python scripts/run_x_research_pipeline.py >> logs/x_pipeline.log 2>&1
```

### Kimi Work Cron (tercih edilen)

Kimi Work içinde cron job olarak:
- **09:00 TSİ** — Sabah bülteni (ön market/Asya kapanış odaklı)
- **21:00 TSİ** — Akşam bülteni (ABD kapanış/ön market özeti)

---

## 📁 Dosya Yapısı

```
gistify/
├── scripts/
│   ├── config.py                    # Ortak config modülü
│   ├── run_x_research_pipeline.py   # Master orchestrator
│   ├── x_scraper.py                 # X.com scraper (WebBridge)
│   ├── post_filter.py               # Post filtreleme & skorlama
│   ├── mistral_research.py          # Mistral AI deep research
│   ├── article_synthesizer.py       # Makale sentezleyici
│   ├── flow_converter.py            # Flow HTML formatına çevirici
│   └── deploy_flow.py               # Git deploy
│
├── data/
│   └── x_research/
│       ├── raw_posts.json           # Scraper çıktısı (tüm post'lar)
│       ├── filtered_posts.json      # Filtrelenmiş post'lar
│       ├── research_results/
│       │   ├── tr/                  # TR dili Mistral çıktıları
│       │   └── en/                  # EN dili Mistral çıktıları
│       └── articles/
│           ├── x-research-tr-<slug>.md
│           └── x-research-en-<slug>.md
│
├── flow/
│   └── daily-x-research-<slug>.html  # Final HTML (Gistify deploy)
│
├── .env                             # API key'ler & config
├── requirements_x.txt               # Python bağımlılıkları
└── README_X_PIPELINE.md             # Bu dosya
```

---

## ⚙️ Config Özelleştirme

Tüm ayarlar `scripts/config.py` içinde tanımlı ve `.env` dosyasıyla override edilebilir:

| Değişken             | Varsayılan           | Açıklama                              |
|----------------------|----------------------|---------------------------------------|
| `MISTRAL_API_KEY`    | *(zorunlu)*          | Mistral AI API key                    |
| `MISTRAL_MODEL`      | `mistral-large-latest`| Kullanılacak model                   |
| `WEBBRIDGE_URL`      | `127.0.0.1:10086`    | WebBridge daemon adresi               |
| `MIN_LIKES_TR`       | `50`                 | TR post'lar için min beğeni           |
| `MIN_LIKES_EN`       | `100`                | EN post'lar için min beğeni           |
| `MIN_CHARS_TR`       | `100`                | TR post'lar için min karakter         |
| `MIN_CHARS_EN`       | `150`                | EN post'lar için min karakter         |
| `TOP_POSTS_PER_LANG` | `5`                  | Her dil için max post sayısı          |
| `TIME_BONUS_HOURS`   | `6`                  | Zaman bonusu penceresi (saat)         |
| `TIME_BONUS_SCORE`   | `20`                 | Yeni post'lara eklenen bonus puan     |

Keyword'leri `scripts/config.py` içindeki `KEYWORDS_TR` ve `KEYWORDS_EN` listelerini düzenleyerek özelleştirebilirsin.

---

## 🐛 Hata Giderme / FAQ

### "MISTRAL_API_KEY not found" hatası

```bash
# .env dosyasının root'ta olduğundan emin ol
ls -la .env
# Yoksa oluştur:
echo "MISTRAL_API_KEY=sk-xxx" > .env
```

### WebBridge bağlantı hatası

```
[FAIL] Stage 1 hata: Connection refused (127.0.0.1:10086)
```

- Kimi Desktop/WebBridge'in çalıştığından emin ol.
- `WEBBRIDGE_URL` değerini `.env` ile override edebilirsin.

### "Module not found" hatası

```bash
# requirements'ı tekrar yükle
pip install -r requirements_x.txt
```

### Pipeline stage skip edildi ama dosya bulunamadı

Skip flag'leri kullanıyorsan (`--skip-scraper`, `--skip-mistral`), ilgili ara dosyaların (`raw_posts.json`, `research_results/*`) `data/x_research/` altında mevcut olmalı.

### Git deploy başarısız

```bash
# flow/ dizininde git repo olduğundan emin ol
cd flow && git status
# Remote ve branch ayarlarını kontrol et
git remote -v
git branch
```

### Log dosyası

Pipeline stdout'a log basar. Kalıcı log için:

```bash
python scripts/run_x_research_pipeline.py >> data/x_research/pipeline.log 2>&1
```

---

## 🔧 Geliştirici Notları

- Yeni stage eklemek için `STAGES` listesine `run_x_research_pipeline.py` içinden ekle.
- Stage'lerin `main()` fonksiyonu `date_slug` ve/veya `dry_run` argümanı kabul edebilir.
- `deploy_flow.py` subprocess olarak çalışır — geri kalan stage'ler doğrudan Python modülü olarak import edilir.

---

## 📄 Lisans

Gistify iç projesi. Dışarıya açık değildir.
