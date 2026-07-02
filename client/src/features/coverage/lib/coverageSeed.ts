import {
  buildCoverageRecordId,
  type CoverageStoredRecord,
} from "./coverageParser";

const SAMPLE_CRWV_V1 = String.raw`---
ticker: CRWV
company: CoreWeave, Inc.
exchange: NASDAQ
date: 2026-07-02
type: earnings-option-play
signal: SPEC-BULLISH
sector: AI Infrastructure
---
# CoreWeave (NASDAQ: CRWV) Earnings Coverage

| **Rapor Tarihi** | 2026-07-02 |
| **Mevcut Fiyat** | 85.69 USD |
| **Fiyat Degisimi** | -13.92% |
| **52 Haftalik Aralik** | 63.80 - 166.22 |
| **Earnings Tarihi** | 2026-08-11 |
| **Opsiyon Vadesi** | 2026-08-21 |
| **Analyst Hedef Ortalama** | 143.41 |
| **IV (Mutlak)** | 96.2% |
| **Short % of Float** | 15.42% |
| **RSI 14** | 31.7 |
| **Butce** | 150 USD |

## 1. Executive Summary
> 130/150 call debit spread. Maliyet 148 USD. Max gain 1,852 USD. Max loss 148 USD. Breakeven 131.48 USD.

Piyasa AI compute capex temasini yeniden fiyatlarken CRWV hizli bir sentiment reset'i yasiyor. Bu versiyon, agresif ama tanimli riskli bir bounce senaryosunu baz aliyor.

## 2. Positioning
- META ve NVDA baglantili talep okumalari hissede ana tetikleyici.
- 85 seviyesi kisa vade pivot, 75 seviyesi ise daha sert risk limiti.
- RSI asiri satima yakin ama trend teyidi henuz yok.

## 3. Options Structure
| Kriter | 130/150 Spread | 100C Long | 80/70 Put Spread |
| --- | --- | --- | --- |
| Sermaye Verimliligi | High | Low | Low |
| IV Crush Direnci | Yes | No | Yes |
| Asimetrik Getiri | Yes | Yes | No |
| Oneri Puani | 9.4 | 6.8 | 5.2 |

## 4. Watchlist
- [ ] Borrow cost tekrar yukseliyor
- [ ] 85 ustunde kapanislar korunuyor
- [ ] NVDA ve META capex tonu zayifliyor

## 5. Timeline
| Tarih | Olay | Not |
| --- | --- | --- |
| 2026-07-10 | Channel check | Talep ivmesi kontrol edilir |
| 2026-07-24 | OI ve IV refresh | Pozisyon ayari hazirligi |
| 2026-08-11 | Earnings | Ana katalizor |

## 6. Sources
- [Yahoo Finance](https://finance.yahoo.com/quote/CRWV)
- [Nasdaq](https://www.nasdaq.com/market-activity/stocks/crwv)
- [SEC Filings](https://www.sec.gov/)
`;

const SAMPLE_CRWV_V2 = String.raw`---
ticker: CRWV
company: CoreWeave, Inc.
exchange: NASDAQ
date: 2026-07-04
type: earnings-option-play
signal: SPEC-BULLISH
sector: AI Infrastructure
---
# CoreWeave (NASDAQ: CRWV) Earnings Coverage

| **Rapor Tarihi** | 2026-07-04 |
| **Mevcut Fiyat** | 91.24 USD |
| **Fiyat Degisimi** | 6.48% |
| **52 Haftalik Aralik** | 63.80 - 166.22 |
| **Earnings Tarihi** | 2026-08-11 |
| **Opsiyon Vadesi** | 2026-08-21 |
| **Analyst Hedef Ortalama** | 145.00 |
| **IV (Mutlak)** | 88.4% |
| **Short % of Float** | 14.80% |
| **RSI 14** | 39.1 |
| **Butce** | 180 USD |

## 1. Executive Summary
> 110/140 call debit spread. Maliyet 176 USD. Max gain 2,824 USD. Max loss 176 USD. Breakeven 111.76 USD.

Iki gunluk toparlanma sonrasi CRWV fiyat aksiyonu daha duzenli gorunuyor. Bu versiyon ilk rapora gore daha yakin strike ve daha yuksek sermaye kullanimina geciyor.

## 2. Positioning
- 90 ustu tutunma kisa vadede senaryo lehine.
- Short tarafin sikismasi hala masada fakat tek basina tez degil.
- Spread secimi artik tamamen IV crush direnci ve sermaye etkinligine odakli.

## 3. Options Structure
| Kriter | 110/140 Spread | 100C Long | 85/75 Put Spread |
| --- | --- | --- | --- |
| Sermaye Verimliligi | High | Medium | Low |
| IV Crush Direnci | Yes | No | Yes |
| Asimetrik Getiri | Yes | Yes | No |
| Oneri Puani | 9.1 | 7.0 | 4.9 |

## 4. Watchlist
- [ ] 90 ustu kapanislar korunuyor
- [ ] OI ve hacim tek strike'da yigilmiyor
- [ ] FOMC oncesi beta yeniden bozuluyor

## 5. Timeline
| Tarih | Olay | Not |
| --- | --- | --- |
| 2026-07-15 | Supply chain check | GPU tedarik tonu izlenir |
| 2026-07-29 | FOMC | Faiz patikasi ana risk |
| 2026-08-11 | Earnings | Ana katalizor |

## 6. Sources
- [Yahoo Finance](https://finance.yahoo.com/quote/CRWV)
- [Nasdaq](https://www.nasdaq.com/market-activity/stocks/crwv)
- [SEC Filings](https://www.sec.gov/)
`;

const SAMPLE_NBIS_V1 = String.raw`---
ticker: NBIS
company: Nebius Group
exchange: NASDAQ
date: 2026-07-01
type: earnings-option-play
signal: TACTICAL-BULLISH
sector: AI Infrastructure
---
# Nebius Group (NASDAQ: NBIS) Earnings Coverage

| **Rapor Tarihi** | 2026-07-01 |
| **Mevcut Fiyat** | 42.55 USD |
| **Fiyat Degisimi** | 2.31% |
| **52 Haftalik Aralik** | 22.40 - 58.90 |
| **Earnings Tarihi** | 2026-08-08 |
| **Opsiyon Vadesi** | 2026-08-21 |
| **Analyst Hedef Ortalama** | 51.75 |
| **IV (Mutlak)** | 72.6% |
| **Short % of Float** | 7.20% |
| **RSI 14** | 56.4 |
| **Butce** | 120 USD |

## 1. Executive Summary
> 45/55 call spread. Maliyet 118 USD. Max gain 882 USD. Max loss 118 USD. Breakeven 46.18 USD.

NBIS icin temel tez, daha duzenli balance sheet ve daha az kaotik fiyatlama sayesinde daha sakin bir AI infra trade'i sunmasi.

## 2. Positioning
- CRWV kadar sikismis degil ama execution riski daha dusuk.
- 40-41 bolgesi savunuldukca yukari carry daha temiz.
- Bu isimde hikaye momentumdan cok risk ayarinda.

## 3. Peer Matrix
| Kriter | NBIS | CRWV | ORCL |
| --- | --- | --- | --- |
| Balance Sheet | Better | Weaker | Strong |
| Hype Beta | Medium | Very High | Low |
| Execution Visibility | Medium | Low | High |

## 4. Watchlist
- [ ] 41 ustunde kalicilik suruyor
- [ ] AI infra comps yeniden zayifliyor
- [ ] Option skew agresiflesiyor

## 5. Timeline
| Tarih | Olay | Not |
| --- | --- | --- |
| 2026-07-09 | Peer read-through | CRWV ve ORCL etkisi izlenir |
| 2026-08-08 | Earnings | Ana olay |

## 6. Sources
- [Company IR](https://group.nebius.com/)
- [Nasdaq](https://www.nasdaq.com/)
`;

const SEED_PAYLOADS = [
  {
    importedAt: "2026-07-02T08:45:00+03:00",
    raw: SAMPLE_CRWV_V1,
    sourceName: "seed:crwv-v1.md",
  },
  {
    importedAt: "2026-07-04T09:10:00+03:00",
    raw: SAMPLE_CRWV_V2,
    sourceName: "seed:crwv-v2.md",
  },
  {
    importedAt: "2026-07-01T11:20:00+03:00",
    raw: SAMPLE_NBIS_V1,
    sourceName: "seed:nbis-v1.md",
  },
];

export function getCoverageSeedRecords(): CoverageStoredRecord[] {
  return SEED_PAYLOADS.map(payload => ({
    id: buildCoverageRecordId(payload.raw, payload.sourceName),
    importedAt: payload.importedAt,
    raw: payload.raw,
    sourceName: payload.sourceName,
  }));
}
