# Opsiyon IV Crush Stratejisi — Araştırma Bulguları

## Temel Konseptler

### IV Crush Nedir?
- **Tanım**: Earnings öncesi yükselen Implied Volatility (IV), earnings sonrası keskin düşüş yaşar
- **Zamanı**: IV, earnings açıklamasından hemen sonra (pre-market veya açılışta) düşmeye başlar
- **Büyüklüğü**: Tipik olarak IV, earnings sonrası %30-40 düşebilir (bazı hisseler %50+)

### Earnings Öncesi IV Davranışı
1. **10-30 gün öncesi**: IV kademeli olarak yükselişe başlar
2. **5-2 gün öncesi**: IV hızlı yükselir (peak IV)
3. **1 gün öncesi**: IV maksimum seviyede
4. **Earnings sonrası**: IV ani düşüş (IV crush)

### Tarihsel Ortalamalar
- **Ortalama IV Düşüşü**: %18-40 (hisseye göre değişir)
- **Düşük IV Hisseler** (COST, AVGO): %15-20 düşüş
- **Yüksek IV Hisseler** (MRVL, CRWD): %35-45 düşüş

---

## Stratejik Fırsat: "Buy Low IV, Sell High IV"

### Strateji Adımları
1. **Aşama 1 (10-15 gün öncesi)**: 
   - IV düşük olduğunda CALL/PUT satın al
   - Maliyet: Düşük premium
   - Hedef: Earnings öncesi IV yükselmesinden faydalanmak

2. **Aşama 2 (1-2 gün öncesi)**:
   - IV maksimum seviyede
   - CALL/PUT satış (close position)
   - Kar: IV yükselmesinden sağlanan theta decay + vega kazancı

3. **Aşama 3 (Earnings sonrası)**:
   - IV crush meydana gelir
   - Pozisyon kapalı olduğu için IV crush riskinden korunmuş olursun

### Örnek Senaryo: MRVL
- **15 gün öncesi**: IV 60, Call $2.50
- **1 gün öncesi**: IV 92, Call $5.80 (IV yükselmesinden +$3.30)
- **Satış**: $5.80'de satış
- **Kar**: $3.30 (IV crush'tan kaçınıp, IV expansion'dan faydalanma)

---

## Hisse Bazlı IV Crush Profilleri

### Yüksek IV Crush Potansiyeli (>35% düşüş beklentisi)
- **MRVL**: IV 92 → Beklenen 50-55 (±12.5% implied move)
- **CRWD**: IV 78 → Beklenen 45-50 (±10.4% implied move)
- **ZS**: IV 95 → Beklenen 55-60 (±11.8% implied move)
- **SNOW**: IV 98 → Beklenen 60-65 (±13.5% implied move)

### Orta IV Crush Potansiyeli (20-30% düşüş)
- **PANW**: IV 88 → Beklenen 60-65 (±9.2% implied move)
- **DELL**: IV 62 → Beklenen 45-50 (±8.5% implied move)
- **CRM**: IV 55 → Beklenen 40-45 (±7.2% implied move)

### Düşük IV Crush Potansiyeli (<20% düşüş)
- **AVGO**: IV 45 → Beklenen 35-40 (±6.8% implied move)
- **COST**: IV 22 → Beklenen 18-20 (±3.5% implied move)

---

## Momentum + IV Crush Kombinasyonu

### En İyi Fırsat Hisseler (Momentum + IV Crush)
1. **CRWD**: 
   - Momentum: 94/100 (güçlü)
   - IV Crush: 35-40% beklentisi
   - Strateji: Call satın al (momentum), earnings öncesi sat (IV crush)

2. **MRVL**:
   - Momentum: 96/100 (çok güçlü)
   - IV Crush: 40-45% beklentisi
   - Strateji: Call satın al (momentum), earnings öncesi sat (IV crush)

3. **AVGO**:
   - Momentum: 88/100 (güçlü)
   - IV Crush: 20-25% beklentisi
   - Strateji: Daha güvenli, düşük risk IV crush

### Kaçınılması Gereken Kombinasyonlar
- **Kırılmış Momentum + Yüksek IV**: SNOW, ZS
  - Momentum düşük, IV yüksek = Double risk
  - Earnings sonrası hem IV crush hem fiyat düşüşü riski

---

## Friday Kapanış Opsiyon Dinamikleri

### Post-Earnings Friday Patterns
1. **Earnings Salı/Çarşamba açıklanırsa**:
   - Cuma kapanışına kadar 2-3 gün kalır
   - Friday options (weeklies) IV crush'tan etkilenir
   - Theta decay hızlanır (son gün)

2. **Earnings Perşembe/Cuma açıklanırsa**:
   - Gelecek hafta Friday options daha güvenli
   - Mevcut hafta Friday options IV crush'tan çok etkilenir

### Strateji: "Sell Before Friday"
- Earnings öncesi (Perşembe günü) opsiyon satış
- Friday kapanışında IV crush'tan kaçınma
- Theta decay + IV crush kombinasyonundan kaçınma

---

## Uygulanabilir Stratejiler

### 1. "Long Call/Put + IV Crush Escape"
- Satın Al: 10-15 gün öncesi (IV düşük)
- Sat: 1-2 gün öncesi (IV yüksek, earnings öncesi)
- Kar: IV expansion'dan
- Risk: Earnings öncesi fiyat hareketinden korunmuş

### 2. "Bull Call Spread" (Düşük Maliyetli)
- Long Call: OTM (earnings öncesi)
- Short Call: Daha OTM (IV crush'tan faydalanma)
- Maliyet: Düşük
- Kar: IV crush + fiyat hareketi

### 3. "Iron Condor" (Yüksek IV Hisseler)
- Short Call + Short Put (ATM)
- Long Call + Long Put (daha OTM)
- Kar: IV crush + theta decay
- Risk: Sınırlı (spread stratejisi)

---

## Riski Yönetme

### Uyarılar
1. **Earnings Miss Riski**: Fiyat keskin düşüş yaşayabilir
2. **Gap Risk**: Earnings sonrası gap açılabilir
3. **IV Expansion Riski**: Bazı durumlarda IV crush yerine expansion olabilir

### Koruma Yöntemleri
1. **Position Sizing**: Küçük pozisyonlar (risk sınırı)
2. **Stop Loss**: IV crush öncesi (earnings öncesi satış)
3. **Diversifikasyon**: Birden fazla hisse (risk dağılımı)
4. **Hedging**: Opposite direction spread (risk azaltma)

---

## Sonuç

**En Garantili Yol**: 
- Earnings öncesi IV düşük olduğunda CALL/PUT satın al
- Earnings 1-2 gün öncesi (IV maksimum) sat
- IV crush'tan kaçın, IV expansion'dan faydalanın
- Momentum + IV crush kombinasyonu = En yüksek fırsat
