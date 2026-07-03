# COVERAGE SISTEMI - KULLANIM KILAVUZU

> Bu belge Gistify icindeki gercek `/coverage` akisini anlatir. Eski `ingest.js -> data.js -> dist/` akisi bu repoda aktif degil. Coverage artik public `/coverage` yuzeyi, admin `/app/admin` Coverage paneli ve server-side API uzerinden calisir.

## 1. Paket Icerigi

| Dosya | Ne ise yarar | Nerede kullanilir |
|---|---|---|
| `coverage-report-authoring.zip` | Kimi / VS Code skill paketi | Skill kurulumunda |
| `coverage-report-authoring.skill` | Claude skill paketi | Claude ile rapor yazarken |
| `SKILL.md` | Authoritative `coverage-md/1` authoring kontrati | Referans ve paket kaynagi |
| `sablon-rapor.md` | Altin ornek markdown rapor | Ilk test ve kopya kalibi |
| `coverage-kullanim-kilavuzu.md` | Bu belge | Operasyon kilavuzu |

Not:
- `gistify-coverage-master-prompt.md` repo root'tadir; `coverage/` paketi icinde degildir.
- Legacy lokal markdown klasoru `reports/coverage/` altindadir.

## 2. Sistem Mimarisi

Coverage artik 3 katmandan olusur:

1. Rapor yazan taraf:
`coverage-report-authoring` skill'i coverage uyumlu markdown uretir.

2. Admin publish tarafi:
`/app/admin` icindeki `Coverage` paneli markdown'i kabul eder, onizler ve kalici arsive yazar.

3. Public render tarafi:
`/coverage` sayfasi `/api/coverage/reports` uzerinden bu arsivi okur ve custom renderer ile gosterir.

Ek not:
- Public sayfada artik import paneli yok.
- Public sayfa sample seed veriye dusmez.
- Admin arsivi ile local `reports/coverage` legacy klasoru ayridir.
- Gerekirse legacy dosyalar admin panelinden tek tikla arsive import edilir.

## 3. Skill Kurulumu

### Kimi / VS Code

1. `coverage-report-authoring.zip` paketini ac.
2. Icinden cikan `coverage-report-authoring/` klasorunu kullandigin aracin skill dizinine koy.
3. Test:
`CRWV icin coverage raporu yaz.` dediginde cikti `---` frontmatter ile baslamali ve `coverage-md/1` kontratina uymali.

### Claude

1. `coverage-report-authoring.skill` dosyasini sohbete birak.
2. `Save skill` ile kaydet.
3. Test:
`NVDA icin earnings-option-play coverage raporu yaz.` dediginde sadece final markdown donmeli.

## 4. Yeni Rapor Ekleme

Aktif publish akisi budur:

1. Skill ile coverage markdown uret.
2. Gistify'da `/app/admin` ac.
3. `Coverage Workspace` sekmesine gec.
4. Markdown'i editor'e yapistir veya `.md` dosyasi sec.
5. Onizlemede ticker, tarih, baslik ve section yapisini kontrol et.
6. `Kaydet` ile arsive yaz.
7. Public `/coverage` sayfasinda rapor otomatik gorunur.

Dosya adi / sourceName kurali:
- Tercih edilen ad: `{TICKER}-{YYYY-MM-DD}.md`
- Ornek: `CRWV-2026-07-02.md`
- `sourceName` bos birakilirsa server bunu frontmatter `ticker` + `date` alanlarindan uretir.

## 5. Legacy Lokal Dosya Importu

Eski dosya tabanli coverage notlari icin:

1. `reports/coverage/` altina `.md` dosyasini koy.
2. `/app/admin` -> `Coverage` sekmesine git.
3. `Yereli aktar` butonuna bas.
4. Bu dosyalar admin arsivine kopyalanir.

Not:
- `SAMPLE-*` dosyalari public katalogda gosterilmez.
- Legacy klasor artik birincil yayin yeri degil; bootstrap kaynagi gibi dusunulmeli.

## 6. Public Ozellikler

Su anda aktif olan public ozellikler:

- `/coverage`
Ticker index

- `/coverage/calendar`
Earnings tarihine gore takvim gorunumu

- `/coverage/:ticker`
Ticker detail ve versiyon seridi

- `Download all`
Tum coverage arsivini zip olarak indirir

- `Download MD`
Acik version'un orijinal markdown'ini indirir

- `Print / PDF`
Detail sayfasini yazdirir veya tarayicidan PDF olarak kaydetmene izin verir

## 7. Renderer Kontrati

Coverage tam markdown motoru kullanmaz. Renderer su bloklari bilir:

- YAML frontmatter
- `#`, `##`, `###`
- kisa paragraf
- `>`
- duz `-` liste
- duz `- [ ]` checklist
- pipe table
- inline `**bold**`, backtick, link

Ozel render alanlari:

- `Strike | Bid | Ask`
Opsiyon zinciri heatmap

- `Hisse Fiyati | P&L`
Payoff chart

- `Seviye | Tur | Guc`
Level ladder

- `Tarih | Olay`
Catalyst timeline

- `Donem | EPS Tahmin | EPS Gercek`
Earnings history chart

- `Sirket | Ticker | Iliski | Onem | Detay`
Ecosystem chips

- `Kriter ...`
Comparison matrix

- `Senaryo ...`
Scenario cards

- `Kaynak | URL`
Source list cards

- `Katalizor | Etki`
Catalyst card grid

Liste tetikleyicileri:

- `- %70 olasilik: ...`
Probability bars

Checklist tetikleyicileri:

- `### Kirmizi Bayraklar`
- `### Yesil Bayraklar`

## 8. Frontmatter Kurali

Coverage raporunda en az su alanlar olmali:

```yaml
---
contract: coverage-md/1
ticker: CRWV
company: CoreWeave, Inc.
exchange: NASDAQ
date: 2026-07-02
type: earnings-option-play
signal: SPEC-BULLISH
metrics:
  price: 85.69
---
```

Opsiyon stratejili raporda `strategy:` blogu da beklenir:

```yaml
strategy:
  name: 130/150 Call Debit Spread
  legs: 1x Long 130C + 1x Short 150C @ 2026-08-21
  cost: 148
  max_gain: 1852
  max_loss: 148
  breakeven: 131.48
```

## 9. Guncelleme Kurali

- Eski raporu duzenlemek yerine yeni version eklemek tercih edilir.
- Ayni ticker icin version strip otomatik olusur.
- Diff motoru section basliklari sabit kaldiginda daha iyi calisir.
- `reportDate` once raporun kendi `date` alanindan, sonra dosya adindan, en son cok eski/uyumsuz raporlar icin fallback metadata'dan gelir.

## 10. Sorun Giderme

| Belirti | Muhtemel neden | Cozum |
|---|---|---|
| Public `/coverage` bos | Admin arsivinde kayit yok | `/app/admin` -> Coverage -> markdown kaydet |
| Public sayfada rapor gelmiyor | Frontmatter `ticker` veya `date` eksik | Skill kontratina gore raporu duzelt |
| Grafik yerine duz tablo cikiyor | Tablo basliklari imzaya uymuyor | `SKILL.md` icindeki kolon adlarini aynen kullan |
| Admin save 400 donuyor | H1 veya zorunlu frontmatter eksik | `ticker`, `date`, `#` basligi ekle |
| Coverage not found | Ticker icin arsivde rapor yok | Admin panelinden yeni rapor ekle |
| Zip indirilemiyor | API hatasi veya bos arsiv | Once arsive en az bir coverage raporu kaydet |

## 11. Tek Gercek Kaynaklar

Coverage sisteminde bunlar authoritative kabul edilir:

- Authoring kontrati:
`coverage/SKILL.md`

- Altin ornek rapor:
`coverage/sablon-rapor.md`

- Public renderer:
`client/src/pages/Coverage.tsx`

- Parser:
`client/src/features/coverage/lib/coverageParser.ts`

- Admin upload ve public API:
`server/routes/coverage/index.ts`

- Kalici coverage store:
`server/billingStore.ts`
