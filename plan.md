# Gistify Agent Ordusu - Site Geliştirme Tarama Planı

## Proje Özeti
- **Stack**: React 19 + Vite + Tailwind CSS 4 + shadcn/ui (Radix) + Express + TypeScript
- **Router**: wouter
- **State**: useState/useEffect (global state yok)
- **Charts**: recharts
- **Animation**: framer-motion
- **i18n**: Runtime DOM translation + copy() helper
- **Auth**: Google OAuth + Paddle billing
- **Backend**: Express monolith (server/index.ts ~120KB)

## Aşamalar

### Stage 1: Frontend/UI Tarama (subagent_type: explore)
**Hedef**: Tüm UI bileşenlerini, sayfaları, tab'ları ve görsel sistemini tarayıp sorunları raporla.
**Çıktı**: `reports/stage1_frontend_ui.md`
**Kapsam**:
- client/src/pages/*.tsx - tüm sayfalar
- client/src/components/tabs/*.tsx - tüm tab bileşenleri
- client/src/components/ui/*.tsx - shadcn override'ları
- client/src/features/flow/**/*.tsx - flow özelliği
- client/src/scanner/components/*.tsx - scanner bileşenleri
- index.css tasarım sistemi analizi
- App.tsx routing ve layout yapısı
- Landing page analizi

### Stage 2: Backend/Logic Tarama (subagent_type: explore)
**Hedef**: Backend API, veri akışı, state yönetimi ve logic katmanını tarayıp sorunları raporla.
**Çıktı**: `reports/stage2_backend_logic.md`
**Kapsam**:
- server/index.ts - ana backend (120KB, muhtemelen monolitik)
- server/routes/ - API route'ları
- server/services/ - servis katmanı
- client/src/lib/ - frontend logic katmanı (api.ts, data provider'lar)
- client/src/hooks/ - custom hook'lar
- Auth & billing flow
- Veri fetch/cache stratejileri
- Translation API ve i18n mekanizması

### Stage 3: Mimari & Kalite Tarama (subagent_type: explore)
**Hedef**: Kod kalitesi, mimari debt, performans ve DX (developer experience) analizi.
**Çıktı**: `reports/stage3_architecture_quality.md`
**Kapsam**:
- App.tsx 1478 satır - monolitik God component
- server/index.ts 120KB - monolitik backend
- Component tree derinliği ve prop drilling
- Code duplication (scanner/flow/reports arası)
- TypeScript strictness ve type safety
- Build/CI/CD pipeline (.github/workflows)
- Test coverage (vitest var ama kullanılıyor mu?)
- Error boundary coverage
- Memory leak riskleri (WeakMap kullanımı, useEffect cleanup)
- Lazy loading stratejisi
- Package.json dependency analizi

### Stage 4: UX & Tasarım Tarama (subagent_type: explore)
**Hedef**: Kullanıcı deneyimi, görsel tutarlılık, mobile uyumluluk ve "uydurukluk" hissini kaynaklarını bulma.
**Çıktı**: `reports/stage4_ux_design.md`
**Kapsam**:
- Landing page -> app geçiş hissi
- Sayfalar arası tutarlılık
- Dark mode sadece, light mode yok mu?
- Responsive design (mobile first?)
- Loading states ve skeleton'lar
- Empty states
- Error states
- Navigation UX (mobile hamburger?)
- Animation overuse / underuse
- Chart UX (recharts kullanımı)
- Copy/paste hissiyatı - yapay zeka uydurukluğu nereden geliyor?
- Typography tutarlılığı
- Spacing ve layout tutarlılığı
- Interaction feedback (hover, active, focus states)

### Stage 5: Entegrasyon (Ana Agent)
Tüm stage raporlarını birleştir, önceliklendir, nihai rapor üret.
**Çıktı**: `reports/GISTIFY_GELISTIRME_RAPORU.md` + `reports/GISTIFY_GELISTIRME_RAPORU.docx`
