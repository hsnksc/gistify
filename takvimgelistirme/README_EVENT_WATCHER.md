# Gistify Event Watcher — Olay-Güdümlü Canlı Veri Yakalama

Mevcut Calendar Live Update pipeline'ının bir üst versiyonu. Üç sabit pencere (Asia 08:30 / US 16:00 / Final 23:58) yerine, **takvimdeki her olayın kendi saatinde** kaynağı yoklayan, `actual` düşer düşmez yakalayan ve saniyeler içinde JSON + Git + X.com post'a yansıtan bir servis.

## 1. Ne değişti?

| Senaryo | Eski model (3 pencere) | Yeni model (Event Watcher) |
|---|---|---|
| 15:30 TRT — ABD NFP | 16:00 US sync'ini bekler → **~30 dk gecikme** | 15:30:15'te ilk yoklama → **~15-60 sn** |
| 17:00 TRT — ISM Services | 23:58 Final'i bekler → **~7 saat gecikme** | 17:00:15 → **~15-60 sn** |
| 11:00 TRT — Almanya ZEW | 16:00 US sync → **~5 saat** | 11:00:15 → **~15-60 sn** |
| Geciken açıklama (örn. +4 dk) | Bir sonraki pencereye kadar boş | Önem-bazlı retry merdiveni açıklamayı bekler |
| Veri "canlı" mı bilgisi | Yok | `actualCapturedAt` + `actualSurprise` + `watcher_status.json` |

Mevcut üç cron **kaldırılmaz**; revizyonları ve watcher'ın kaçırdıklarını toplayan **backstop** katmanı olur (bkz. §7).

## 2. Mimari

```
                       ┌──────────────────────────────────────────────┐
calendar_forecast.json │  PLAN: günün olayları saat gruplarına bölünür │
  (time alanları)  ───▶│  08:30 │ 11:00 │ 15:30(NFP+2) │ 17:00 │ ...  │
                       └───────────────┬──────────────────────────────┘
                                       │ olay saati T geldiğinde
                                       ▼
                   T+15sn ilk yoklama ──▶ actual boşsa retry merdiveni
                   (önem 3: +15sn,+30sn,+1m,+2m,+3m,+5m,+8m,+12m,+20m,+30m,+45m)
                                       │
                    ┌── Doğrudan HTTP GET (hafif yol, ~1-2 sn) ──┐
                    │   başarısızsa: webbridge_adapter fallback   │
                    └──────────────────┬──────────────────────────┘
                                       ▼
             eventName+country eşleştirme (exact → öneksiz → korumalı fuzzy)
             SADECE actual + actualCapturedAt + actualSurprise yazılır
                                       ▼
             Atomik yazma (.json.tmp → validate → os.replace) × tüm hedefler
                          │                    │
                          ▼                    ▼
              X.com post (anında)     Git push (önem 3: anında,
                                      diğerleri: 5 dk debounce)
                                       ▼
                          watcher_status.json (UI/monitoring)
```

Kritik tasarım kuralları mevcut pipeline ile **birebir aynıdır**: yalnızca `actual` güncellenir; `forecast`, `previous`, `analysis`, `optionSetups`, `vixOutlook`, `fearGreedOutlook`, `marketNarrative` korunur; veri çekilemezse tahmin yazılmaz; her yazma atomiktir.

## 3. Kurulum ve test

```bash
# 1) Bağımlılıklar (Windows'ta tzdata zorunlu)
pip install -r requirements.txt

# 2) watcher_config.json içindeki path'leri kontrol et
#    (varsayılanlar mevcut kurulumuna göre dolduruldu)

# 3) Günün planını gör — hiçbir şey yazmaz
python event_watcher.py --plan

# 4) Kuru test — kaynağı çeker, eşleştirir ama diske/git'e DOKUNMAZ
python event_watcher.py --once --dry-run

# 5) Canlı tek geçiş
python event_watcher.py --once

# 6) Daemon modu (asıl çalışma şekli)
python event_watcher.py
```

**Kalıcı çalıştırma (Windows):** `run_watcher.bat` dosyasını script klasörüne koy, Görev Zamanlayıcı'da "Bilgisayar açılışında" tetiklenen bir görev oluştur (`schtasks /Create /TN "GistifyEventWatcher" /SC ONSTART /TR "C:\...\run_watcher.bat"`). Bat dosyası çökme durumunda 15 sn sonra otomatik yeniden başlatır. Alternatif: NSSM ile Windows servisi.

**Daemon istemiyorsan:** `--once` modu tek geçiş yapıp çıkar; mevcut Kimi cron altyapına **5 dakikada bir** çalışan dördüncü bir job olarak da eklenebilir (30 dk timeout'un çok altında, ~10-30 sn sürer). Gecikme bu durumda en fazla 5 dk olur — yine de eski modelden kat kat iyidir.

## 4. Zamanlama mantığı

- **Plan:** Watcher her 15 dk'da bir `calendar_forecast.json`'ı okur, `actual`'ı boş ve `time`'ı `HH:MM` formatında olan olayları saat gruplarına böler. Aynı saate düşen olaylar (örn. 15:30 ABD bloku) **tek fetch'te** yakalanır.
- **İlk yoklama:** T+15 sn (`first_check_seconds_after`).
- **Retry merdiveni** (dakika, T'den itibaren):

  | Önem | Merdiven |
  |---|---|
  | 3 (yüksek) | 0.25, 0.5, 1, 2, 3, 5, 8, 12, 20, 30, 45 |
  | 2 (orta) | 0.5, 2, 5, 10, 20, 35 |
  | 1 (düşük) | 1, 5, 15, 35 |

- **Fırsatçı güncelleme:** Her fetch'te ekranda `actual`'ı dolu olan *tüm* olaylar eşleştirilir — erken açıklanan ya da başka grubun beklediği veri de anında yakalanır.
- **Isınma:** Önem-3 gruptan 2 dk önce kaynak erişilebilirliği test edilir; NFP öncesi ağ/kaynak sorunu varsa açıklama saatinden ÖNCE WARN loglanır.
- **Catch-up:** Watcher gün ortasında (yeniden) başlarsa, son 90 dk içindeki `actual`'sız olaylar için tek deneme yapar; daha eskiler `expired` olarak backstop cron'lara bırakılır.
- **Merdiven tükenirse:** Grup `exhausted` işaretlenir, alan boş bırakılır (`on_exhausted: "leave"`). Raporundaki iki farklı kuraldan güvenli olanı varsayılan yapıldı; `"mark"` seçersen "Canlı veri alınamadı" yazılır.
- `All Day` / `Tentative` olaylar plana alınmaz; backstop cron'lar kapsar.

## 5. JSON'a eklenen alanlar ve UI'da gösterim

Yakalanan her olaya iki **ek** alan yazılır (mevcut hiçbir alan silinmez/değişmez):

```json
{
  "eventName": "Nonfarm Payrolls",
  "country": "United States",
  "actual": "250K",
  "actualCapturedAt": "2026-07-06T15:30:31+03:00",
  "actualSurprise": { "direction": "above", "diff": 65000.0, "pct": 35.14 }
}
```

Gistify client'ta "açıklanan veriyi gösterme" için öneri: takvim satırında `actual` doluysa `actualSurprise.direction`'a göre yeşil/kırmızı/gri rozet + `pct` değeri; `actualCapturedAt`'ten "X sn/dk önce açıklandı" etiketi. Frontend `calendar_forecast.json`'ı 30-60 sn'de bir `?t=<timestamp>` cache-bust parametresiyle çekerse veriler yayın anından ~1 dk içinde ekranda olur.

`watcher_status.json` ise sayfa üstünde canlılık göstergesi için idealdir:

```json
{
  "updatedAt": "...", "nextEvent": {"time": "15:30", "events": 3, "importance": 3},
  "groups": [ {"time": "15:30", "status": "pending", "attempts": 0, "nextTry": "..."} ],
  "recentCaptures": [ {"event": "...", "actual": "...", "latencySec": 23, "surprise": {...}} ],
  "git": {"pendingPush": false, "lastPush": "..."}
}
```

`recentCaptures[].latencySec` yakalama gecikmesini ölçer — sistemin performans KPI'ı budur.

## 6. Git ve X.com post davranışı

- **Push debounce:** Önem-3 veri yakalanınca **anında** commit+push; önem 1-2 veriler 5 dk'lık pencerede biriktirilip tek commit'te gider (commit spam önlenir). Commit formatı: `calendar: live update YYYYMMDD HH:MM (event watcher)` — mevcut audit trail düzenine uyumlu.
- **Push başarısızlığı:** Loglanır, `pendingPush: true` kalır, sonraki döngüde tekrar denenir; local JSON zaten günceldir (mevcut fail-safe #5 ile aynı).
- **Post:** Yakalama anında `xcom_posts/YYYY-MM-DD/live_HHMMSS.md` yazılır. `TEMPLATES.md` içinde `{{ACTUAL}}` placeholder'ı geçen ilk kod bloğu/bölüm şablon olarak kullanılır; bulunamazsa yerleşik şablon devreye girer. Değişkenler: `{{EVENT_NAME}} {{COUNTRY}} {{ACTUAL}} {{FORECAST}} {{PREVIOUS}} {{DEVIATION}} {{DIRECTION}} {{IMPORTANCE}} {{CAPTURED_AT}}`.

## 7. Mevcut 3 cron ile geçiş planı

| Aşama | Yapılacak |
|---|---|
| Hafta 1 | Watcher'ı `--dry-run` daemon olarak çalıştır, logları izle; sonra canlıya al. **Üç cron aynen kalsın.** Çakışma olmaz: iki taraf da aynı merge kuralını uygular, korunan alanlara dokunmaz, atomik yazar. |
| Hafta 2 | Loglarda `latencySec` ve `exhausted` oranını kontrol et. Sorun yoksa **Asia ve US cron'ları kaldırılabilir** — watcher onların işini gerçek zamanlı yapıyor. |
| Kalıcı | **Final (23:58) cron'u daima kalsın**: gün sonu revizyonları, `All Day` olaylar, watcher'ın exhausted bıraktıkları ve VIX/Fear&Greed/marketNarrative güncellemeleri için reconciliation katmanı. |

## 8. Sorun giderme

| Belirti | Neden | Çözüm |
|---|---|---|
| `Dogrudan cekim HTTP 403` | forexprostools anti-bot / Cloudflare | `webbridge_adapter.py`'yi doldur (bkz. §9) — watcher otomatik ona düşer |
| `Sayfa alindi ama satir cikarilamadi` | Embed HTML yapısı değişti | Adaptör fallback devrede; kalıcıysa `parse_embed_html` içindeki hücre sınıflarını güncelle |
| `Eslesmeyen N olay` logu | Olay adı JSON'dakiyle farklı | 3 kademeli eşleştirme (exact → milliyet-öneksiz → korumalı fuzzy) çoğunu çözer; kalıcı farklar için JSON'daki adı embed'dekiyle hizala |
| Grup hep `exhausted` | Olay o gün gerçekten açıklanmadı (konuşma/tatil) | Normal — alan boş kalır, Final cron doğrular |
| Git push `non-fast-forward` | Remote'ta başka commit | Repo'da `git pull --rebase origin main`; watcher sonraki döngüde push'u tamamlar |
| OneDrive dosya kilidi / yavaşlık | OneDrive senkronu `.git`'i tarıyor | `.git` klasörünü OneDrive dışına al ya da klasörü "Her zaman bu cihazda tut" yap |
| `ZoneInfo` hatası | Windows'ta tzdata yok | `pip install tzdata` (yoksa sabit GMT+3 fallback zaten devrede) |

## 9. WebBridge adaptörü

`webbridge_adapter.example.py` dosyasını `webbridge_adapter.py` olarak kopyala ve `fetch_calendar_html(url)` fonksiyonunu mevcut cron scriptlerindeki Kimi WebBridge çağrılarıyla (`http://127.0.0.1:10086` health check → daemon başlat → navigate → render bekle → HTML al) doldur. Sözleşme basit: **HTML string döndür, başarısızlıkta None** — gerisini watcher yönetir. Doğrudan HTTP çalıştığı sürece bu dosyaya hiç ihtiyaç olmayabilir.

## 10. Konfig referansı (watcher_config.json)

- `paths.calendar_primary` — okunacak ana JSON; `calendar_targets` — atomik yazılacak tüm kopyalar (3. konum gerekiyorsa listeye ekle); `status_file`, `logs_dir`.
- `source.embed_url` — mevcut 20 ülkeli, `timeZone=63` (GMT+3) URL; `http_timeout`.
- `schedule.*` — §4'teki tüm zamanlama parametreleri.
- `matching.fuzzy_enabled` / `fuzzy_ratio` — 3. kademe eşleştirme.
- `git.*` — repo dizini, eklenecek path'ler, branch, debounce, anında-push önem eşiği.
- `posts.*` — şablon yolu, çıktı dizini, post için minimum önem.
- `on_exhausted` — `"leave"` (varsayılan) veya `"mark"`.

Loglar `logs/event_watcher.log` (gece yarısı rotasyonlu, 14 gün) altında tutulur; her yakalama `YAKALANDI | ülke / olay : eski -> yeni (beklenti: X)` formatında tek satırdır.
