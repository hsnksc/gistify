---
name: coverage-report-authoring
description: >
  Gistify Coverage render motoruyla birebir uyumlu (kontrat: coverage-md/1) hisse, earnings ve
  opsiyon araştırma raporlarını markdown olarak üretir ve biçimlendirir. Ham notları, web
  araştırmasını veya analiz çıktısını; sitenin grafik ve interaktif bileşenlerini — Karar Kartı,
  payoff grafiği, opsiyon zinciri, destek/direnç merdiveni, katalizör timeline, kırmızı/yeşil
  bayrak checklistleri, ticker cross-link chipleri — TETİKLEYEN yapıya çevirir. Şu ifade ve
  durumların HEPSİNDE, rapor markdown'ı üretmeden önce bu skill'i devreye al: "coverage raporu",
  "coverage formatı", "siteye push edilecek rapor", "render kontratı", "raporu formatla",
  "hisse raporu yaz", "earnings play raporu", "opsiyon stratejisi raporu", "araştırmayı rapora
  çevir", "markdown rapor", "raporun yeni versiyonu / güncellemesi", ve bir ticker için
  Coverage'a gidecek her türlü rapor üretimi. Çıktı her zaman YALNIZ final markdown'dır.
---

# Coverage Report Authoring — Render Kontratı `coverage-md/1`

Bu dosya iki tarafın **ortak dilidir**: (1) raporu yazan ve push eden ajan (Kimi, VS Code,
Claude…), (2) Gistify `/coverage` sekmesinin render motoru. Aşağıdaki kalıplar **aynen**
kullanıldığında site ilgili bloğu grafiğe veya interaktif bileşene çevirir. Kalıp bozulursa
(farklı kolon adı, eksik anahtar, yanlış başlık) blok **düz tabloya düşer** ve rapor "kötü
görünür". Bu skill'in tek amacı, her bloğun doğru tetikleyiciyle çıkmasını garanti etmektir.

> Not: Bu dosyanın içindeki ``` kod çitleri yalnızca **gösterim** amaçlıdır. Üretilen raporda
> kod çiti KULLANILMAZ.

## 0. Çıktı Sözleşmesi

Yalnızca şu bloklar kullanılabilir:

- YAML frontmatter (dosyanın en başında, tek blok)
- Bir adet `#` H1 başlık
- Numaralı `##` ve `###` başlıklar (`## 1.`, `### 5.2` biçiminde)
- Kısa paragraflar (en fazla 2–3 cümle)
- Tek seviyeli `>` blockquote'lar
- Düz `-` madde listeleri (3–6 madde ideal)
- Düz `- [ ]` checklistler (yalnızca izleme/aksiyon maddeleri için)
- Pipe tablolar (başlık satırı + ayraç satırı zorunlu)
- Satır içi `**bold**`, `` `kod` ``, `[etiket](https://...)`

Kesinlikle yasak (renderer tam markdown motoru değildir; bunlar ya kaybolur ya yapıyı kırar):

- Ham HTML, `<img>`, görsel gömme
- Sıralı (1. 2. 3.) listeler
- İç içe liste, iç içe blockquote, blockquote içinde liste
- Dipnot, tanım listesi
- `---` yatay çizgi (frontmatter sınırları hariç — gövdede ASLA)
- Kod çiti (``` ```), açıkça istenmedikçe
- Birleştirilmiş hücreli veya hücre içinde çok satırlı tablo

## 1. Frontmatter — Makine Katmanı (ZORUNLU)

Sitenin hero şeridi, Karar Kartı, sinyal rozeti ve versiyonlar arası "Ne Değişti?" diff motoru
doğrudan buradan beslenir. Regex tahminine bırakma; bildiğin her kanonik alanı buraya yaz.

```yaml
---
contract: coverage-md/1
ticker: CRWV                  # BÜYÜK harf, zorunlu
company: CoreWeave, Inc.
exchange: NASDAQ              # NYSE | NASDAQ | AMEX | OTC
sector: AI Infrastructure
date: 2026-07-02              # ISO, zorunlu — versiyon zincirini bu tarih sürer
type: earnings-option-play    # earnings-option-play | deep-research | momentum-scan | explosion-watch | research
signal: SPEC-BULLISH          # SPEC-BULLISH | BULLISH | NEUTRAL | BEARISH | SPEC-BEARISH
metrics:                      # birimsiz sayı, ISO tarih; SADECE gerçekten bilinenler
  price: 85.69
  price_date: 2026-07-01
  change_pct: -13.92
  low52: 63.80
  high52: 166.22
  target_avg: 143.41
  earnings_date: 2026-08-11
  earnings_approx: true       # tarih "~" ise
  option_expiry: 2026-08-21
  iv: 96.2
  iv_rank: 31.7
  short_float: 15.42
  rsi: 37.98
  sma50: 110.42
  sma200: 100.48
  budget: 150
strategy:                     # Karar Kartı; gövdedeki STRATEJİ bloğuyla AYNI değerler
  name: 130/150 Call Debit Spread
  legs: 1x Long 130C + 1x Short 150C @ 2026-08-21
  cost: 148
  max_gain: 1852
  max_loss: 148
  breakeven: 131.48
---
```

Kurallar:

- Bilinmeyen alanı **yazma**; değer uydurmak yasaktır. `metrics.price` + `date` asgari çekirdektir.
- `strategy` bloğu yalnızca `earnings-option-play` tipinde zorunludur; diğer tiplerde varsa yaz.
- Frontmatter ile gövde tabloları asla çelişemez — aynı sayı, aynı tarih.
- Sinyal etiketi rapor tarihine aittir; site onu tarihli gösterir.

## 2. Dosya Adı, Push ve Versiyonlama

- Dosya adı / sourceName: `{TICKER}-{YYYY-MM-DD}.md` · legacy local path: `reports/coverage/{TICKER}-{YYYY-MM-DD}.md` · aynı gün ikinci rapor: `...-b.md`
- Commit mesajı önerisi: `report: CRWV 2026-07-02`
- **Güncelleme = yeni dosya.** Eski raporu asla düzenleme; site aynı `ticker + type` zincirinde
  yeni versiyonu öne alır, eskisini arşivler ve diff'i otomatik üretir.
- Diff'in doğru çalışması için: bölüm **numaraları ve başlıkları versiyonlar arasında sabit**
  tutulur; yalnızca değerler ve metinler güncellenir. Yeni bölüm gerekiyorsa sona eklenir.

## 3. Rapor İskeleti

H1 kalıbı (parantezli ticker zorunlu — renderer'ın yedek ticker kaynağıdır):

```md
# CoreWeave (CRWV) — Q2 Earnings Opsiyon Stratejisi
```

H1'in hemen altına **insan katmanı** metadata tablosu (2 kolon, boş başlık satırı kalıbı aynen):

```md
|  |  |
|---|---|
| **Rapor Tarihi** | 2026-07-02 |
| **Mevcut Fiyat** | 85.69 USD |
| **52 Haftalık Aralık** | 63.80 – 166.22 USD |
| **Earnings Tarihi** | ~2026-08-11 |
| **Opsiyon Vadesi** | 2026-08-21 |
| **Analyst Hedef Ortalama** | 143.41 USD |
| **IV (Mutlak)** | 96.2% |
| **Short % of Float** | 15.42% |
| **Bütçe** | 150 USD |
```

Yalnızca verisi olan satırlar yazılır; değerler frontmatter'la birebir aynıdır.

Tip bazlı bölüm sırası (içerik azsa bölümler sıkıştırılır ama numara + mantık korunur):

- **earnings-option-play** (varsayılan): `1. Executive Summary` (STRATEJİ bloğu burada) ·
  `2. Teknik Durum & Seviyeler` · `3. Earnings Geçmişi & Konsensus` ·
  `4. Ekosistem & İlişkili Hisseler` · `5. Opsiyon Yapısı` · `6. Katalizör Takvimi` ·
  `7. Takip & Bayraklar` · `8. Sonuç & Olasılıklar` · `9. Kaynaklar`
- **deep-research**: `1. Özet` · `2. Fiyat & Piyasa` · `3. Kazanç Geçmişi` · `4. SEC & Insider` ·
  `5. Analist Görünümü` · `6. Haber & Katalizörler` · `7. Teknik Analiz` ·
  `8. Sektör & Rakipler` · `9. SWOT` · `10. Kaynaklar`
- **momentum-scan / explosion-watch**: `1. Özet & Sinyal` · `2. Skor Tablosu` · `3. Seviyeler` ·
  `4. Risk & Plan` · `5. Kaynaklar`

## 4. RENDER KONTRATI — Tablo İmzaları (skill'in kalbi)

Renderer, tabloyu **başlık hücrelerinden** tanır. Zorunlu kolon adlarını **aynen** kullan
(büyük/küçük harf serbest, kelime aynen); ekstra kolon eklemek serbesttir. İmza tutmayan tablo
grafiğe dönüşmez.

| Bileşen | Zorunlu kolonlar (aynen) | Önerilen ek kolonlar | Sitenin ürettiği |
|---|---|---|---|
| OptionsChain | `Strike`, `Bid`, `Ask` | `Mid`, `Last`, `Volume`, `OI`, `IV`, `Delta`, `Gamma`, `Theta`, `Vega` | Sabit başlıklı zincir, ATM satırı vurgusu (`metrics.price`'tan), IV/Volume ısı haritası, üstünde IV eğrisi grafiği |
| Payoff | `Hisse Fiyatı`, `P&L` | `ROI`, `Durum` | İnteraktif payoff grafiği + fiyat kaydırıcı; breakeven çizgisi |
| LevelLadder | `Seviye`, `Tür`, `Güç` | `Gerekçe`, `Stratejik Önemi` | Destek/direnç merdiveni görseli; ★ sayısı bar kalınlığı olur |
| EarningsHistory | `Dönem`, `EPS Tahmin`, `EPS Gerçek` | `Sürpriz`, `Revenue Tahmin`, `Revenue Gerçek`, `Fiyat Tepkisi` | Beat/miss kartları + sürpriz bar grafiği |
| Konsensus | `Metrik`, `Konsensus` | `Düşük`, `Yüksek`, `Analist Sayısı` | Düşük–yüksek aralık barları |
| Ekosistem | `Ticker` | `Şirket`, `İlişki`, `Önem`, `Detay` | Ticker hücreleri tıklanabilir cross-link chip'e dönüşür |
| CatalystTimeline | `Tarih`, `Olay` | `Önem`, `Etki` | Dikey zaman çizelgesi; geleceğe countdown, geçmiş soluk |
| CatalystMatrix | `Katalizör`, `Etki` | `Önem`, `Durum`, `Takip` | Etki yönlü kart grid (Pozitif ▲ / Negatif ▼ / Çift Yönlü ⇅) |
| ComparisonMatrix | ilk kolon başlığı `Kriter` | strateji/aday kolonları | Sabit ilk kolon, ✅ ❌ ⭐ ikonlaşır, kazanan kolon vurgulanır |
| ScenarioCards | ilk kolon başlığı `Senaryo` | hedef, P&L, strateji | Senaryo kartları (Beat yeşil / Miss kırmızı ton) |
| InsiderTable | `Görev`, `Satış` içeren kolonlar | `İsim`, `Değer`, `Fiyat Aralığı` | Satış vurgulu insider tablosu |
| SourceList | `Kaynak`, `URL` | `Zaman Damgası` | Katlanabilir kaynakça; dış link ikonu |

Tablo yazım kuralları:

- OptionsChain: strike'lar artan sıralı; Greeks bilinmiyorsa hücreye `—` yaz (boş bırakma, uydurma).
- Payoff: en az 5 satır; fiyatlar artan; mevcut fiyat, breakeven ve max-gain civarında birer satır bulunsun.
- LevelLadder: `Tür` ∈ `Destek` | `Direnç` | `Pivot`; `Güç` = `★` … `★★★★★`.
- Ekosistem: halka açık değilse `Ticker` hücresine `Özel` yaz; `Önem` ∈ `🔴 Kritik` | `🟠 Yüksek` | `🟡 Orta` | `🟢 Düşük`.
- CatalystTimeline: `Tarih` daima ISO (`2026-07-28`); kritik olay satırında olayı `**bold**` yaz → büyük düğüm olur.
- İmzalardan hiçbirine uymayan tablo da geçerlidir; temalı düz tablo olarak çıkar — bilinçli kullan.

## 5. Blockquote Grameri

**STRATEJİ bloğu** — rapor başına tam 1 adet, `## 1. Executive Summary` altında. Anahtar adları
aynen; her anahtar kendi `>` satırında. Site bundan hero'daki Karar Kartı'nı üretir:

```md
> **STRATEJİ:** 130/150 Call Debit Spread (CRWV · vade 2026-08-21)
> **Kurulum:** 1x Long 130 Call + 1x Short 150 Call
> **Maliyet:** 148 USD
> **Max Gain:** 1,852 USD
> **Max Loss:** 148 USD
> **Breakeven:** 131.48 USD
> **Hedef:** 150.00 USD ve üzeri
```

Alternatif stratejiler blockquote'a değil, `Kriter` başlıklı ComparisonMatrix tablosuna yazılır.

Diğer callout'lar:

- Risk uyarısı: `> ⚠️ ...` ile başlayan satır → kırmızı callout.
- Bilgi notu: `> **Not:** ...` → mavi callout.
- Yasal uyarı: raporun **son bloğu**, içinde "yatırım tavsiyesi değildir" ifadesi geçen paragraf →
  sabit Disclaimer bileşeni. **Her raporda zorunludur.**

## 6. AutoViz Tetikleyicileri (tablo dışı)

- **Olasılık dağılımı** → yığılmış olasılık çubuğu. `8. Sonuç` bölümünde, ardışık 3–5 madde,
  toplam ≈ 100, format aynen `- %70 olasılık: ...`:

```md
- %70 olasılık: Spread değersiz kapanır, kayıp 148 USD
- %20 olasılık: 130–150 aralığı, kâr 200–1,000 USD
- %8 olasılık: 150 USD üzeri, max gain 1,852 USD
- %2 olasılık: 170 USD üzeri squeeze senaryosu
```

- **Beklenen hareket** → fiyat bandı görseli. `5. Opsiyon Yapısı` içinde tek satır, kalıp aynen:
  `**Expected Move:** ±18.4% (±15.84 USD)`
- **Bayrak checklistleri** → interaktif kırmızı/yeşil listeler. Başlıklar aynen
  `### Kırmızı Bayraklar` ve `### Yeşil Bayraklar`; altlarında yalnız düz `- [ ]` maddeler.
  Kullanıcı sitede işaretler, durum kalıcıdır — bu yüzden maddeler gözlemlenebilir/aksiyon
  alınabilir olmalı ("CRWV 80.00 USD altında kapanırsa" gibi), görüş cümlesi değil.
- **RSI göstergesi** → `metrics.rsi` doluysa site gauge'u kendisi çizer; gövdeye ekstra bir şey yazma.

## 7. Ticker ve Cross-Link Yazımı

- Gerçek ticker'ları düz metinde **çıplak BÜYÜK** harfle yaz: `META 2032'ye kadar bağlı.` —
  site bunu tıklanabilir chip'e çevirir (Coverage'da raporu varsa aktif, yoksa pasif).
- Ticker OLMAYAN büyük harfli ürün/kod adlarını backtick'e al (`` `ARIA` ``) veya normal yaz
  (Aria); backtick içi asla linklenmez. `GAAP`, `FOMC`, `EBITDA` gibi finans kısaltmaları
  zaten güvenli listededir, dokunma.
- Ekosistem tablolarında `Ticker` kolonunu her satırda doldur (`Özel` dahil) — cross-link'in
  ana kaynağı bu tablodur.
- Var olmayan ticker uydurma; raporun kendi ticker'ı için özel bir şey yapma (site self-link'i
  kendisi engeller).

## 8. Sayı, Tarih ve Dil Standartları

- Ondalık ABD biçimi: `85.69` · binlik ayraç virgül: `1,852` · büyük sayılar: `35.2B USD`, `69.0M`
- Yüzde işareti **sonda**: `15.42%` · negatifte eksi, sürpriz/beat'te artı işareti: `-13.92%`, `+54.4%`
- Para: tablolarda `85.69 USD`; frontmatter'da birimsiz sayı
- Tarih: frontmatter ve timeline tablolarında ISO `2026-08-11`; düz metinde `~11 Ağustos 2026`
  serbest (yaklaşıklık frontmatter'da `earnings_approx: true` ile ayrıca işaretlenir)
- Bilinmeyen değer: hücreye `—` (tire); "Veri bulunamadı" yazma, değer uydurma
- Rapor dili Türkçe; yerleşik finans terimleri (Call, Put, Spread, IV, Breakeven, Short Float)
  İngilizce kalır

## 9. Ham Nottan Rapora Dönüşüm Sırası

- Tezi çıkar → `signal` + STRATEJİ bloğu
- Tekrarlanan sayısal gerçekleri → Bölüm 4'teki **imzalı** tablolara (kolon adları aynen)
- Tarihli olayları → CatalystTimeline tablosuna (ISO)
- İzleme maddelerini → Kırmızı/Yeşil Bayrak checklistlerine
- Kaynak URL'lerini → SourceList tablosuna
- Desteklenmeyen her biçimi düşür; korumaya çalışma
- En son frontmatter'ı gövdeden doldur ve çapraz doğrula (aynı sayılar, aynı tarihler)

## 10. Yayın Öncesi — Render Önizleme Matrisi

Raporu döndürmeden önce her satırı doğrula; biri eksikse ilgili bileşen sitede ÇIKMAZ:

- [ ] Frontmatter geçerli: `contract`, `ticker`, `date`, `type`, `signal`, `metrics.price`
- [ ] H1'de `({TICKER})` kalıbı var
- [ ] earnings-option-play ise: tek STRATEJİ bloğu, 7 anahtarıyla tam; frontmatter.strategy eş
- [ ] Opsiyon zinciri `Strike | Bid | Ask` başlıklı ve artan sıralı
- [ ] `Hisse Fiyatı | P&L` payoff tablosu ≥ 5 satır
- [ ] `Seviye | Tür | Güç` tablosu var, Güç ★ biçiminde
- [ ] Timeline tarihleri ISO; kritik olaylar **bold**
- [ ] `### Kırmızı Bayraklar` / `### Yeşil Bayraklar` başlıkları aynen, altları düz `- [ ]`
- [ ] `- %X olasılık:` listesi ardışık ve toplamı ≈ 100
- [ ] Ticker'lar çıplak BÜYÜK; sahte ticker yok; ürün adları backtick'te
- [ ] Gövdede `---`, HTML, sıralı liste, iç içe yapı, kod çiti YOK
- [ ] `Kaynak | URL` tablosu + "yatırım tavsiyesi değildir" disclaimer'ı en sonda
- [ ] Hiçbir değer uydurulmadı; bilinmeyenler `—` veya satır atlandı

Sonra çıktıyı **yalnız markdown** olarak döndür — öncesinde ve sonrasında açıklama, selamlama,
kod çiti sarmalayıcısı yok.

## 11. Renderer Tarafına Not (site ekibi / render promptu için)

Bu kontrat, Coverage master build promptunun Bölüm 4–7'sini üç noktada genişletir; render tarafı
da buna göre güncellenmelidir:

- `frontmatter.metrics` → hero şeridi ve diff motoru birincil kaynak (Türkçe etiket regex'i
  yalnızca eski raporlar için fallback kalır)
- `frontmatter.strategy` → Karar Kartı birincil kaynak (STRATEJİ blockquote'u fallback)
- `contract: coverage-md/1` → gelecekte kontrat sürümüne göre dallanma imkânı

Kontratın herhangi bir tarafı değişirse iki taraf **birlikte** güncellenir; tek taraflı değişiklik
render kalitesini sessizce bozar.

## Referans

- `references/sablon-rapor.md` — Tüm bileşenleri tetikleyen, gerçek CRWV verisiyle yazılmış
  altın örnek. Yeni rapor yazarken kalıpları (kolon adları, blok gramerleri) buradan kopyala;
  emin olmadığın her biçim sorusunda önce bu dosyaya bak.
