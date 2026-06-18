# Gistify Algoritmik & Mimari Detaylandırma Planı

## Yeni Gereksinimler

### 1. /app — Dinamik MD Deploy Sistemi
- Her yeni eklenen .md dosyası, farklı formatlarda bile olsa, aynı tasarım dilinde deploy edilecek
- Her .md dosyası bir tab olarak seçilebilir olacak
- Seçilince sayfa o tab'a göre yüklenecek
- MD dosyası formatı farklı olsa bile aynı tasarım dilinde render edilecek

### 2. /momentum — Aynı yapıda
- Aynı dinamik MD deploy + tab sistemi
- Momentum-specific içerik desteği

### 3. /daily-report — Aynı yapıda
- Aynı dinamik MD deploy + tab sistemi
- Daily report-specific içerik desteği

### 4. /flow — Dinamik MD + Sosyal Katman
- Aynı dinamik MD deploy + tab sistemi
- **Sosyal özellikler:**
  - Beğenme (like)
  - Copy link (shareable URL)
  - Paylaşım (social share)
  - Yorum (comments)

## Stage 1: Paralel Teknik Spec Üretimi

- **Worker 1 — Mimari & Pipeline**: MD dosya tarama, parse, render pipeline, tab sistemi, dosya izleme
- **Worker 2 — API & Veri Modeli**: Endpoint'ler, DB schema, veri modeli, state yönetimi, URL routing
- **Worker 3 — UX & Sosyal**: Kullanıcı akışı, sosyal özellikler (Flow), admin flow, yeni MD yükleme akışı
- **Worker 4 — Kod Mimarisi**: Bileşen yapısı, TypeScript interface'leri, örnek kod, shared library

## Stage 2: Birleştirme

- Tüm teknik spec'leri birleştir
- Mevcut raporun sonuna yeni bölümler ekle (Bölüm 10-18)
- Docx'e dönüştür

## Yeni Bölümler (Mevcut Raporun Üzerine)

- **Bölüm 10**: Algoritmik Mimari Tasarım (MD Pipeline, Tab Sistemi, Render Engine)
- **Bölüm 11**: MD Dosya Formatı & Meta Veri Şeması
- **Bölüm 12**: Dinamik Tab Sistemi (app, momentum, daily-report, flow)
- **Bölüm 13**: Sosyal Katman (Flow) — Beğenme, Yorum, Link, Paylaşım
- **Bölüm 14**: API Endpoint'leri & Veri Modeli
- **Bölüm 15**: State Yönetimi & URL Routing
- **Bölüm 16**: Bileşen Mimarisi & TypeScript Interface'leri
- **Bölüm 17**: Deployment Pipeline & Admin Flow
- **Bölüm 18**: Güncellenmiş Eylem Planı (Algoritmik)
