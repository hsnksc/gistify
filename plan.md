# Missed Task Recovery — Plan

## Problem
Bilgisayar kapalı olduğunda Kimi Work cron daemon'ı çalışmıyor ve scheduled task'lar kaçırılıyor. Bu kaçırılan görevleri bilgisayar açıldığında otomatik tespit edip trigger eden bir mekanizma gerekiyor.

## Çözüm
"Missed Task Recovery Watcher" isimli bir cron job oluşturulacak. Bu job, diğer tüm cron job'ları periyodik olarak tarayıp kaçırılmış run'ları tespit eder ve otomatik olarak trigger eder.

## Dosyalar
- `scripts/missed_task_recovery.py` — cron expression parse eder, kaçırılmış run'ları tespit eder, JSON çıktı verir
- `missed_task_recovery_state.json` — hangi run'ları zaten trigger ettik (tekrar etmemek için)
- `cron_jobs_snapshot.json` — anlık cron job listesi (geçici, her kontrolde yenilenir)

## Watcher Cron Job
- **Name:** Missed Task Recovery Watcher
- **Trigger:** `*/15 * * * *` (her 15 dakikada bir)
- **Execution:** local_conversation
- **Timeout:** 5 dakika (300.000 ms)
- **Workspace:** `C:\Users\hasan\OneDrive\Desktop\gistify`

## Akış
1. Watcher çalışır
2. `Cron status` ile tüm job'ları listele
3. Job listesini `cron_jobs_snapshot.json` dosyasına yaz
4. `py scripts/missed_task_recovery.py cron_jobs_snapshot.json` çalıştır
5. Script çıktısı kaçırılmış job ID'lerini verir
6. Her kaçırılmış job için `Cron trigger` ile çalıştır
7. Özet rapor ver

## Güvenlik
- Sadece `enabled` job'lar kontrol edilir
- Aynı kaçırılmış run tekrar trigger edilmez (state dosyası ile engellenir)
- 7 günden eski kaçırılmış run'lar atlanır
- 5 dakika tolerans: henüz çalıştırılmamış run'lar kaçırılmış sayılmaz
- `recentRuns` + `lastFiredAt` çift kontrol ile yanlış alarm engellenir
