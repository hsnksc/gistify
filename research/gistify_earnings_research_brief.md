# Gistify Earnings Research — Araştırma Notları ve Rakip Analizi

## 1. Mevcut Gistify Earnings Modülü Tespiti

### Genel Bakış (Overview) Tabı
- Rolling 2-aylık strateji: Mevcut ay (Haziran 2026) + Sonraki ay (Temmuz 2026)
- Market Regime Summary: VIX (18.63), S&P 500 (7,358.22), NASDAQ (25,476.64), FOMC countdown (34 gün kaldı, 2026-07-29)
- Anlam Sözlüğü: Bullish / destekleyici, Bearish / baskı, Neutral, BMO Açılış öncesi, AMC Kapanış sonrası
- Pipeline Durumu: Güncel, son güncelleme zamanı (5 dk önce)
- Checklist: Greeks dashboard kontrolü, Entry/Exit seviyelerini güncelle, Pozisyon risk limiti kontrolü
- Rapor İndir: Markdown (.md) ve Word (.docx) formatlarında — 202606_202607_Earnings_Opsiyon_Master_Stratejisi.md

### Takvim (Calendar) Tabı
- Earnings Takvimi: Haziran 2026 · Temmuz 2026
- BMO 21, AMC 10, Yüksek Önem 17
- Haftalık takvim görünümü (PZT-SAL-ÇAR-PER-CUM-CMT-PAZ)
- Legend: Renklerin yanına ikon ve etiket eklenir; kritik anlamlar tek yerden okunur

### Stratejiler (Strategies) Tabı
- 14 strateji kartı
- Örnek kartlar:
  - NFLX: Communication Services, $706.22, IV Rank 65, CPR 0.72, Long Call, Giriş 2026-07-14, Çıkış 2026-07-23
  - META: Communication Services, $556.33, IV Rank 58, CPR 0.85, Long Call, Giriş 2026-07-15, Çıkış 2026-07-30
  - TSLA: Consumer Discretionary, $375.53, IV Rank 72, CPR 0.78, Long Straddle, Giriş 2026-07-16, Çıkış 2026-07-24
- VIX regime summary: "VIX 18.6 ile low-volatility ortamı; IV crush riski yüksek, directional theta-negative long stratejilerde dikkatli olun."

### CPR & Greeks Tabı
- CPR Sıralaması: 17 hisse, sektör filtreleri (Tümü, Communication Services, Consumer Discretionary, Technology, Financials, Healthcare, Energy)
- Kolonlar: HİSSE, HACİM CPR, OI CPR, SEKTÖR, SENTİMENT, IV RANK
- Örnek: PLTR $106.00, Hacim CPR 0.92, OI CPR 0.88, Technology, Güçlü Boğa, IV Rank 75
- Greeks Dashboard: 14 hisse, Delta/Theta/Vega/Gamma/IV Rank
- Örnek: AMD Delta 0.30, Theta -0.10, Vega 0.20, Gamma 0.04, IV Rank 68

### Portföy & Greeks Tabları
- Authentication required (login sonrası erişilebilen özellikler)
- Çalışma alanı yükleniyor: "Kazanç stratejisi, momentum, günlük ve portföy modülleri bağlanıyor."

---

## 2. Rakip Platform Analizi

### Unusual Whales ($50/ay)
- Gerçek zamanlı options flow, sweep/block/multi-leg detection
- Deep filtering, kaydedilebilir/shareable preset'ler
- Dark pool, congressional trades, insider Form 4, 13F institutional flow
- REST API, WebSocket, Kafka streaming, MCP integration for AI agents
- iOS app, 15 dk gecikmeli ücretsiz tier
- 8,000+ ticker coverage
- Earnings calendar + flow data overlay

### CheddarFlow ($85/ay)
- Hızlı, temiz feed, sweep ve block tagging
- Web-focused interface, mobil responsive ama native app yok
- Dark pool, congressional, insider data YOK
- Entry tier'da watchlist yok
- Basit ama hızlı, yeni trader için uygun

### FlowAlgo ($149/ay)
- Intermarket sweep orders, block trades, dark pool prints
- Real-time voice alerts, Alpha AI signals, historical data
- FlowAlgo Levels (Institutional Zones), Top OI changes
- Trader chatroom, mobile/desktop compatible
- En pahalı, feature set eskimiş

### TradeAlgo
- Dark Market Activity (DMA) Detection: 50 milyar+ market event günlük
- AI classification: institutional accumulation, distribution, block positioning
- Earnings Flow view: 5 gün içindeki earnings'e odaklanır, AI scoring, dark pool cross-reference
- CBOE: earnings öncesi options volume %40-60 spike

### Market Chameleon
- Deep options research, IV, earnings tools, usable free tier
- Live flow secondary, research suite primary
- Earnings history, options screening, IV analizi

### BlackBoxStocks
- Flow + unusual activity alerts
- Aktif chat community, live audio rooms
- Equities ve options alerts
- Mid-tier filtering depth

### Barchart
- Geniş free tier, ucuz ($30/ay)
- Basic unusual activity, çok asset class
- Options flow specialist'lere göre hafif

### ImpliedOptions ($49/ay)
- Full flow at entry price
- Realtime P&L analysis, strategy builder, market insights
- iOS app, unlimited watchlists, dark pool included

---

## 3. Earnings Opsiyon Stratejileri Best Practices

### Temel Stratejiler
- **Long Straddle:** Aynı strike'da call+put alımı. Yüksek volatilite beklenen durumlar. Risk primle sınırlı. Earnings straddles %60-65 başarı IV 10%+ genişlediğinde.
- **Long Strangle:** OTM call + OTM put. Straddle'dan daha ucuz, daha geniş breakeven.
- **Short Straddle / Strangle:** Düşük volatilite beklenen durumlar. Theta kazancı hedeflenir. Sınırsız risk potansiyeli.
- **Iron Condor:** OTM call spread + OTM put spread. Range-bound market. Defined risk. IV yüksekken ideal (IVR > 50).
- **Iron Butterfly:** Short straddle + OTM wings. Daha dar range, daha yüksek kredi.
- **Credit Spreads:** Directional bias varsa. Bull put spread / Bear call spread.
- **Calendar Spread:** Volatilite + zaman farkı. Back month IV yükselişi beklenirken.

### IV Crush Dinamiği
- Earnings öncesi IV spike eder (belirsizlik fiyatlanır).
- Earnings sonrası IV hızla düşer (IV crush).
- Bu nedenle long straddle/strangle'de hem yön hem IV genişlemesi gerekir.
- Short straddle/strangle/iron condor, IV crush'dan faydalanır.
- **Expected Move vs Actual Move:** Piyasa genelde implied move'u gerçekleşen move'dan daha yüksek fiyatlar. AAPL örneği: expected move +/-5.62%, actual move +/-4.20%. Bu satıcı lehine bir edge.

### Greeks Bazlı Risk Yönetimi
- **IV Rank önce kontrol:** IVR > 80% → sat, IVR < 20% → al. IVR mean-reverting.
- **Delta:** Yön riski. ITM olasılığı. 0.15-0.30 Delta = %70-85 kâr olasılığı.
- **Gamma:** Kısa vadeli ATM opsiyonlarda yüksek. Seller'ın en büyük riski.
- **Theta:** Zaman çürümesi. 30-45 DTE optimal. 21 DTE veya %50 max kârda çıkış.
- **Vega:** Volatilite hassasiyeti. Long-dated = yüksek Vega, short-dated = düşük Vega.
- **Gamma vs Theta trade-off:** Long options = Gamma fayda, Theta maliyet. Short options = Theta gelir, Gamma risk.

### Dashboard Best Practices
- Greeks birlikte okunmalı (tek başına yetersiz).
- IV Rank ve IV Percentile her zaman önce kontrol edilmeli.
- Per-leg (taktik) + Per-book (stratejik) aggregation.
- GEX (Gamma Exposure) profile: market maker pozisyonu.
- Max Pain: Delta-weighted open interest.
- Expected Move: Delta-derived range, IV'dan hesaplanır.
- OI/Volume statistics: per-strike Greek snapshot.

---

## 4. Geliştirme Alanları ve İnsight'lar

### Insight 1: Gistify'in CPR + Greeks entegrasyonu nadir
Çoğu platform ya sadece flow (Unusual Whales) ya da sadece Greeks (Option Samurai) sunar. Gistify hem CPR (hacim + OI) hem Greeks (Delta, Theta, Vega, Gamma) tek ekranda birleştiriyor. Bu institutional-grade analitikle retail arayüzünü birleştiren bir farklılaştırıcı.

### Insight 2: Rolling 2-aylık strateji + rapor indirme workflow'u eşsiz
Global platformlarda earnings calendar var, strateji önerileri var, ama otomatik rolling 2-aylık master rapor üretimi ve indirme (.md + .docx) neredeyse hiçbir platformda yok. Bu Gistify'in "earnings intelligence" positioning'ini güçlendiren bir özellik.

### Insight 3: Türkçe arayüz + ABD piyasası kombinasyonu boş alan
Global platformlar İngilizce, yerli platformlar Türk piyasası. Gistify Türkçe arayüzle ABD opsiyon piyasasına odaklanıyor. Bu niş bir avantaj ama aynı zamanda İngilizce versiyon (EN butonu zaten var) ile global ölçeklenebilirlik potansiyeli taşıyor.

### Insight 4: Portföy ve Greeks tabları authentication bağımlılığı
Login olmadan erişilemeyen tablar, kullanıcı dönüşümü (conversion) için bir barrier. Freemium modelde bu tabların bir kısmı public'e açılabilir (örn: sadece 1-2 pozisyon göster, tamamı için login).

### Insight 5: IV Crush risk uyarısı güçlü ama otomatize edilebilir
"VIX 18.6 ile low-volatility ortamı; IV crush riski yüksek..." mesajı manuel. Bu, VIX, IV Rank, ve expected move verilerine bağlı otomatik bir "Market Regime Engine" ile dinamik hale getirilebilir.

### Insight 6: Expected Move vs Actual Move analizi eksik
Market Chameleon ve Option Samurai gibi platformlar bu karşılaştırmayı sunar. Gistify'de strateji kartlarında expected move veya historical earnings move data'sı görünmüyor. Bu eklendiğinde strateji seçimi daha bilinçli olur.

### Insight 7: GEX (Gamma Exposure) ve Max Pain eksik
Unusual Whales ve StrikeWatch gibi platformlar GEX profile ve Max Pain sunar. Bu market maker dynamics ve pin risk hakkında önemli bilgi verir. Gistify Greeks Dashboard'una GEX katmanı eklenebilir.

### Insight 8: Alert ve notification sistemi görünmüyor
Rakip platformların çoğu (Unusual Whales, FlowAlgo, BlackBoxStocks) real-time alert ve Discord/Telegram integration sunar. Gistify'de bildirim/alarm sistemi mevcut sayfa yapısında görünmüyor. Bu kritik bir eksiklik.

### Insight 9: Mobile app yok
SIFMA 2025 araştırması: Aktif retail trader'ların %42'si market saatlerinde primarily mobile'dan takip ediyor. Gistify'in native mobil app'i veya en azından PWA (Progressive Web App) olması gerekiyor.

### Insight 10: API ve automation eksik
Unusual Whales MCP integration, REST API, WebSocket sunuyor. Gistify kullanıcıları için bir API, webhook veya automation layer (Zapier, Make) eksik. Bu power user'lar için büyük bir limitasyon.
