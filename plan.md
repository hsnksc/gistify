# Gistify Sistem Denetimi — Plan

## Amaç
Local workspace + gistify.pro üzerinde kapsamlı bir denetim: boş/null değerler, taşan metinler, UI/UX hataları, yapısal tutarsızlıklar ve genel sağlık raporu.

## Stage 1 — Paralel Keşif (Bağımsız)
- **Local Config Denetimi**: .env, package.json, tsconfig.json, .project-config.json, components.json, template.json, midas_signals.json, cpi_forecast.json, ppi_forecast.json, deploy.yml okunup boş/null/undefined değerler ve tutarsızlıklar aranacak.
- **WebBridge UI Denetimi**: gistify.pro'ya navigate, snapshot + screenshot, boş içerikli elementler, overflow/width sorunları, null metinler tespiti.

## Stage 2 — Synthesis
Stage 1 bulguları birleştirilerek kategorize edilmiş rapor üretilecek:
- Kritik (Kırık link, null data, build hatası)
- Uyarı (Boş değer, taşan metin, config eksikliği)
- Bilgi (İyileştirme önerileri, tutarsızlıklar)

## Output
`GISTIFY_SYSTEM_AUDIT_REPORT.md` workspace'e yazılacak.
