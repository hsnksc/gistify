# Midas Pipeline Sync Durum Raporu

**Tarih:** 2026-06-26  
**Zaman:** 16:34 (TR) / 13:34 (UTC)

---

## 1. WebBridge Daemon Kontrolü ✅

- `curl http://127.0.0.1:10086/command` → **OK**
- Daemon aktif, yanıt veriyor.

## 2. Script Varlık Kontrolü ✅

- `midas_pipeline.py` → **OK** (found)
- `midas_vps_sync.py` → **OK** (found)

## 3. Midas Pipeline Çalıştırma ❌

Pipeline çalıştırıldı (`py midas_pipeline.py default`), ancak **veri çekilemedi**.

### Hata Nedeni

Midas Atlas dashboard'ta **kullanıcı oturumu açık değil**. WebBridge snapshot'unda URL:

```
https://sso.getmidas.com/giris?...
```

Giriş sayfası (`Midas SSO Login`) görünüyor. Dashboard verilerine erişilemedi.

### Pipeline Çıktısı

```
[INFO] Connecting to Midas dashboard via WebBridge...
[INFO] Fetching broad market overview...
[INFO] Market overview: ['SPY', 'QQQ', 'DIA', '^VIX']
[INFO] Computing market regime...
[INFO] Regime: RISK-OFF (score=29, long_mult=0.55)
[INFO] Navigating to first page...
[INFO] Reading page 1...
[WARN] extract_page_data_v2 attempt 1/3: symbols=0, values=0
[WARN] extract_page_data_v2 attempt 2/3: symbols=0, values=0
[WARN] extract_page_data_v2 attempt 3/3: symbols=0, values=0
  -> 0 symbols, 0 values (unique so far: 0)
[INFO] Total collected: 0 unique symbols from 1 page(s)
Done. Results: 0 OK, 0 failed.
```

## 4. Mevcut Canonical JSON Durumu ⚠️

- **Dosya:** `C:\Users\hasan\OneDrive\Desktop\midas\midas_signals.json`
- **Durum:** **BOŞ** (0 sinyal, 0 sembol)
- **Timestamp:** `2026-06-26T13:49:02.059864+00:00` (önceki çalıştırmadan kalma, aynı hata)

### Sinyal Özeti (Mevcut Boş JSON)

| Sinyal | Adet |
|--------|------|
| STRONG_BUY | 0 |
| BUY | 0 |
| HOLD | 0 |
| SELL | 0 |
| STRONG_SELL | 0 |
| **Toplam** | **0** |

- **Avg Confidence:** 0
- **Market Sentiment:** NEUTRAL
- **Market Regime:** RISK-OFF (score=29, long_mult=0.55)

### Market Overview (Mevcut)

| Sembol | Fiyat | Değişim % |
|--------|-------|-----------|
| SPY | 729.31 | -0.68% |
| QQQ | 705.80 | -1.48% |
| DIA | 517.64 | -0.31% |
| ^VIX | 20.56 | +8.84% |

## 5. Sync Durumu ⏸️

- **Gistify Local Sync:** Yapılamadı (canonical JSON boş)
- **VPS Atomik Sync:** Yapılamadı (canonical JSON boş)

> ⚠️ Boş `midas_signals.json` dosyasını sync etmek Gistify server'ına da boş sinyal listesi gönderir, bu istenmez.

## 6. Gerekli Aksiyon

Midas Atlas dashboard'ta **giriş yapılması gerekiyor**.

### Adımlar:

1. **Tarayıcıda** `https://atlas.getmidas.com` adresine gidin
2. **Midas hesabınızla giriş yapın**
3. Dashboard açık kalsın (sekme kapatılmamalı)
4. Pipeline tekrar çalıştırılacak:
   ```bash
   py midas_pipeline.py default
   ```

> 💡 WebBridge kullanıcı oturumunu tarayıcıyla paylaşır. Giriş yaptığınızda WebBridge daemon üzerinden erişim sağlanır.

## 7. Pipeline Sonrası Beklenen Flow

Giriş yapıldıktan sonra pipeline tekrar çalıştırıldığında:

1. ✅ WebBridge kontrolü
2. ✅ Midas pipeline çalıştır (50 sembol, ~2-3 dk)
3. ✅ Atomik JSON yaz (`midas_signals.json` → `MIDAS_WORKSPACE`)
4. ✅ Gistify local sync (`client/public/midas_signals.json`)
5. ✅ VPS atomik SCP sync (`midas_vps_sync.py`)
6. ✅ VPS doğrulama (timestamp + sinyal sayısı)
7. ✅ Sinyal özet raporu (STRONG_BUY/BUY/HOLD/SELL/SELL adetleri + top 3 momentum)

---

*Bu rapor fail-safe modda üretildi. Hata log'landı, sync askıya alındı (boş veri gönderilmedi).*