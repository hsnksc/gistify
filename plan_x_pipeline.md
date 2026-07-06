# X.com → Mistral Deep Research → Flow Pipeline Planı

## Amaç
Kullanıcının X.com home feed'ini periyodik olarak tarayan, USA borsa & küresel ekonomi odaklı post'ları filtreleyen, Mistral API ile deep research yaptıran, Kimi'nin kendi araştırmasıyla sentezleyen, çift dilli (TR+EN) makale üreten ve Gistify `flow/` dizinine deploy eden uçtan uca otomasyon pipeline'ı.

## Workspace
`C:\Users\hasan\OneDrive\Desktop\gistify\`

## Output Dizini
`C:\Users\hasan\OneDrive\Desktop\gistify\flow\`

---

## Stage 1 — X.com Scraper + Post Filter (Sub-Agent: Coder_A)
**Görev:**
1. `scripts/x_scraper.py` — WebBridge daemon'a curl POST ile bağlanır, X.com/home'a navigate eder, JS evaluate ile post'ları çeker, JSON kaydeder.
2. `scripts/post_filter.py` — TR/EN dil tespiti, engagement skoru hesaplama, keyword filtreleme, sıralama.

**Input:** WebBridge daemon (127.0.0.1:10086), X.com login session
**Output:** `data/x_research/raw_posts.json`, `data/x_research/filtered_posts.json`

**Kısıtlar:**
- Windows → curl.exe ile file-body pattern kullan
- Session adı: `x-research-pipeline`
- `group_title`: "X Research Pipeline"
- evaluate'de compact JSON.stringify

---

## Stage 2 — Mistral Deep Research + Sentez (Sub-Agent: Coder_B)
**Görev:**
1. `scripts/mistral_research.py` — Filtrelenmiş post'ları Mistral API'ye gönderir (TR/EN ayrı ayrı). Deep research çıktısını Markdown olarak kaydeder.
2. `scripts/article_synthesizer.py` — Mistral araştırma sonuçlarını + Kimi'nin web araştırmasını (kimi_search_v2) sentezler. Çift dilli makale üretir.

**Input:** `data/x_research/filtered_posts.json`
**Output:** `data/x_research/research_results/`, `data/x_research/articles/makale_*.md`

**Kısıtlar:**
- Mistral API key `.env` dosyasından `MISTRAL_API_KEY` olarak okunacak
- Batch: max 3 post / batch, 15 sn ara
- Türkçe post'lar için Türkçe prompt, İngilizce için İngilizce

---

## Stage 3 — Flow HTML Converter + Deploy (Sub-Agent: Coder_C)
**Görev:**
1. `scripts/flow_converter.py` — Sentezlenmiş makaleyi `flow/_template.html` standardına göre HTML'e dönüştürür. TR ve EN versiyonlarını tek HTML'de (lang switch) veya ayrı ayrı üretir.
2. `scripts/deploy_flow.py` — git add, commit, push ile Gistify.pro/flow'a deploy eder.

**Input:** `data/x_research/articles/makale_*.md`
**Output:** `flow/daily-x-research-<tarih>.html`, `flow/daily-x-research-<tarih>.en.html`

**Kısıtlar:**
- `flow/_template.html` CSS/JS bloğunu değiştirme
- `section-head` + `section-title` zorunlu
- `data-timestamp` ISO 8601
- daily-* prefix zorunlu
- git commit message: `flow: daily-x-research-<tarih> [auto-deploy]`

---

## Stage 4 — Master Pipeline + Config/Docs (Sub-Agent: Coder_D)
**Görev:**
1. `scripts/run_x_research_pipeline.py` — Tüm stage'leri sırayla çalıştıran master orchestrator.
2. `scripts/config.py` — Ortak config (path'ler, API key'ler, threshold'lar).
3. `README_X_PIPELINE.md` — Kurulum, çalıştırma, cron talimatları.
4. `.env.example` güncelleme — MISTRAL_API_KEY ekle.

**Input:** Tüm upstream script'ler
**Output:** Koşullu çalışan master pipeline

---

## Stage 5 — Cron Job (Ana Agent)
**Görev:** `Cron(action=create)` ile 09:00 ve 21:00 TSİ'de çalışacak job oluştur.

**Trigger:** `0 6,18 * * *` (UTC — TSİ 09:00, 21:00)
**Prompt:** Master pipeline'ı çalıştır
**Workspace:** `C:\Users\hasan\OneDrive\Desktop\gistify`

---

## Skill Kullanımı
| Stage | Skill | Nasıl |
|-------|-------|-------|
| 1 | `kimi-webbridge` | Inline — curl pattern, evaluate, session kuralları |
| 3 | `flow` | Inline — template, naming, CSS standardı, deploy komutları |
| 5 | `cron` | Inline — create, trigger, expr formatı |

## A2A Dosya Akışı
```
scripts/x_scraper.py ──► data/x_research/raw_posts.json
                         ↓
scripts/post_filter.py ──► data/x_research/filtered_posts.json
                             ↓
scripts/mistral_research.py ──► data/x_research/research_results/*.md
                                  ↓
scripts/article_synthesizer.py ──► data/x_research/articles/makale_*.md
                                      ↓
scripts/flow_converter.py ──► flow/daily-x-research-<tarih>.html
                                  ↓
scripts/deploy_flow.py ──► git push → Gistify.pro/flow
```

## Dil Politikası
- Sub-agent prompt'ları Türkçe
- Kod yorumları ve değişken isimleri İngilizce
- Rapor çıktısı çift dil (TR + EN)
