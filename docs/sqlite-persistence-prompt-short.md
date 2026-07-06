# Gistify SQLite Prompt - Short

## Kisaltma Tespitleri
- En kritik risk persistence degilmis gibi davranmak degil; `/app/data` volume'u duserse deploy sonrasi verinin sifirlanmasi. Bu yuzden volume, fresh-DB warning, backup ve health check maddeleri korundu.
- `billingStore` ve `translationMemory` bu gorevde tasinmamali. Bunlara dokunmak scope'u buyutur ve veri riski yaratir. Bu kisim sonraki migration olarak kalmali.
- CPI/PPI archive istegi soyut bir tablo talebi degil; mevcut `/cpi-ppi` yuzeyinde canli ay vs gecmis ay mukayesesi gerektiriyor. Bu gereksinim promptta acik yazildi.
- Cron/job tarafi yalnizca schedule meselesi degil; lock, retry, run history ve dis tetikleyicinin uygulama katmanindan gecmesi zorunlu.
- Deploy script migration basarisizsa serving durumuna gecmemeli. Bu acik fail kriteri promptta tutuldu.
- Persistence dogrulamasi sadece DB dosyasi var mi kontrolu degil; container recreate sonrasi hem flow counters hem macro archive okunabiliyor olmali.

## Prompt
Bu repoda calisan kidemli bir backend muhendisi gibi davran. Amaç: daginik JSON/file/in-memory runtime persistence'ini kalici SQLite mimarisine tasimak; cron ve deploy akislarini DB-backed, idempotent ve gozlemlenebilir hale getirmek.

Kurallar:
- Kodu gercekten degistir; planla yetinme.
- En guvenli varsayimi yap, varsayimlari final raporda listele.
- Veri silme riski tasiyan komut calistirma.
- `billingStore` ve `translationMemory` davranisina dokunma; gerekiyorsa read-only bridge ekle. Konsolidasyonlarini sonraki adimlara yaz.
- Gorev disi dosyalari degistirme veya revert etme.
- JSON kaynaklari gecis doneminde read-only fallback/tek seferlik import olarak kalsin; runtime truth DB olsun.
- Migration, cron ve deploy akislari idempotent olmadan gorev bitmis sayilmaz.

Baglam:
- Mevcut SQLite kullanimlari: `server/billingStore.ts`, `server/i18n/translationMemory.ts`
- Runtime veriler: flow like/share/read, CPI/PPI aylik archive, cron run history, deploy history, pipeline artifacts
- Deploy Docker tabanli; `docker-compose.yml` ve `scripts/deploy-server.sh` varsa temel al

1. Kesif
- Tum persistence yuzeylerini cikar: kim yaziyor, kim okuyor, format ne, kayip riski ne.
- Dockerfile ve Node surumunun `node:sqlite` icin uygun oldugunu dogrula.
- 5-10 satirlik bulgu ozeti yaz ve sonra implementasyona gec.

2. DB cekirdegi
- `server/db/` altinda merkezi SQLite katmani kur.
- Env: `GISTIFY_DB_PATH`, default `/app/data/gistify.sqlite`
- Production'da `/app/data` yazilabilir degilse fail-fast ver.
- PRAGMA: `journal_mode=WAL`, `busy_timeout=5000`, `foreign_keys=ON`, `synchronous=NORMAL`
- `schema_migrations(id, name, applied_at)` tablosu ve idempotent migration runner ekle.
- Startup loglari: DB path, dosya boyutu, journal mode, migration versiyonu
- Yeni/empty DB production'da olusursa belirgin warning ver: persistent volume monteli mi?
- Tum timestamp alanlari UTC epoch ms `INTEGER` olsun.
- SIGTERM'de `db.close()` ile duzgun kapanis yap.

3. Zorunlu tablolar
- `flow_engagement`
- `macro_archive`
- `cron_jobs`
- `cron_runs`
- `deploy_history`
- `job_locks`
- `artifacts`

Her tablo icin PK/unique/index'leri query pattern'lerine gore kur. Flow counter artislari atomik upsert olsun.

4. Runtime entegrasyonu
- Flow like/share/read sayaçlarini DB'ye tası.
- Macro forecast archive'i DB'ye tasi; mevcut JSON archive varsa tek seferlik idempotent import yap.
- CPI/PPI archive ve comparison tasarimini mevcut `/cpi-ppi` sayfasinda uygula; yeni sayfa ancak net gerekce varsa ac.
- Store API'si en az su yuzeyleri versin:
  - `getMonth(indicator, month)`
  - `getComparison(indicator, month)`
- Artifact uretimleri `artifacts` tablosuna kayit atsın.

5. Cron ve lock koordinasyonu
- `runJob(name, fn, opts)` wrapper'i yaz:
  - lease lock al
  - `running` run satiri ac
  - `success/failed/skipped/timeout` ile kapat
  - duration, error, input/output summary kaydet
  - lock'i yalniz sahibi biraksin
- Retry varsa her deneme ayri run satiri olsun.
- Dis tetikleyici her zaman uygulama katmanindan gecsin:
  - token'li endpoint veya
  - `docker exec <app> node scripts/run-job.mjs <name>`
- Retention/maintenance ekle: eski run kayitlarini buda, `PRAGMA optimize`, `wal_checkpoint(TRUNCATE)`.

6. Deploy kaliciligi
- `docker-compose.yml` icinde `/srv/gistify/data:/app/data` benzeri kalici volume zorunlu olsun.
- `scripts/deploy-server.sh`:
  - deploy oncesi backup al
  - volume mount'u dogrula; yoksa deploy'u durdur
  - deploy baslangic/bitisini `deploy_history`'ye yaz
  - migration basarisizsa yeni container serving durumuna gecmeden fail et
  - health check ile migration versiyonunu dogrula
  - basarisizlikta rollback ve `rollback_of` kaydi yaz
- `docker compose down -v` benzeri veri silen akislari docs'ta yasakla.

7. Admin/debug gorunurlugu
- Korunmus okuma endpoint'leri ekle:
  - `GET /api/admin/diagnostics`
  - `GET /api/admin/cron/runs?job=&status=&limit=`
  - `GET /api/admin/deploys?limit=`
  - `GET /api/admin/macro/archive?indicator=&months=`
- Repo icinde uygun bir admin panel varsa basit bir gorunum ekle; yoksa endpoint yeterli.

8. Dogrulama
- `pnpm check` calistir; varsa `pnpm build` de gecsin.
- Migration runner'i ayni DB'de iki kez calistir; hata olmamali.
- Ayni job'i paralel tetikle; biri calismali, digeri `skipped` kaydi birakmali.
- DB yokken startup warning gorunmeli.
- Flow counter upsert'lerinde lost update olmamali.
- Container recreate sonrasi hem flow counters hem macro archive ayni DB'den okunabilmeli.
- Billing/i18n tarafinda regresyon olmadigini diff ile dogrula.
- Test altyapisi varsa test ekle; yoksa `scripts/` altina calistirilabilir verification script'i koy.

9. Dokumantasyon
- `docs/deployment.md` olustur veya guncelle:
  - zorunlu volume
  - standart deploy komutu
  - backup/restore
  - `PRAGMA integrity_check` recovery
  - host cron/systemd kurulumu
  - env tablosu
  - fresh DB warning anlami

10. Final rapor
- Eklenen tablolar ve amaclari
- DB'ye tasinan runtime akislar
- Eski JSON kaynaklarin yeni rolu
- Standart production deploy komutu
- Calistirilan dogrulamalar
- Varsayimlar
- Kalan riskler ve sonraki migration adimlari
