#!/usr/bin/env python3
"""
coverage_research.py
--------------------
Bir Flow kaynagini (flow/*.html | *.md) Mistral API'ye gondererek, tek bir
ticker icin YAPILANDIRILMIS coverage analizi (JSON) uretir. Cikti, /gistcoverage
skill'inin coverage-md/1 raporunu yazarken kullandigi ara katmandir:

    Flow haberi  ->  [Mistral: anlam cikarma]  ->  coverage_research JSON
                                                     |
                                        Claude coverage-md/1'e dokup
                                        coverage-verify.mjs ile dogrular

Mistral SADECE analiz/cikarim yapar (tez, sinyal, metrikler, kataliz-timeline,
SWOT, bayraklar, kaynaklar). Kati render kontratini Claude uygular; bu yuzden
buradaki cikti serbest yapili JSON'dur, markdown DEGILDIR.

Kullanim:
    python scripts/coverage_research.py flow/<kaynak>.html --ticker AVGO
    python scripts/coverage_research.py flow/<kaynak>.md --ticker NVDA --company "NVIDIA Corporation"

Cikti:
    data/coverage_research/{TICKER}-{YYYY-MM-DD}.json   (+ .meta.json)
    stdout'a kisa ozet ve dosya yolu.

Onemli: Bu script sayilar uretmez; yalnizca kaynakta gecen verileri cikarir.
Bilinmeyen alanlar JSON'da null kalir -> Claude bunlari "—" yapar veya satiri atlar.
"""

import argparse
import datetime
import json
import logging
import os
import re
import sys
import time
from pathlib import Path

import requests

# config.py scripts/ altinda; ayni klasoru path'e ekleyip ortak ayarlari kullan.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config  # noqa: E402

API_URL = config.MISTRAL_API_URL
MODEL = config.MISTRAL_MODEL
TIMEOUT = config.MISTRAL_TIMEOUT
MAX_RETRIES = config.MAX_RETRIES
RETRY_DELAY = max(config.RETRY_DELAY, 5)

OUTPUT_ROOT = config.BASE_DIR / "data" / "coverage_research"

# Cok buyuk Flow HTML'lerini token patlamasi olmadan gondermek icin ust sinir.
MAX_SOURCE_CHARS = 45_000

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)


# -----------------------------------------------------------------------------
# Kaynak okuma / temizleme
# -----------------------------------------------------------------------------
def load_source_text(path: Path) -> str:
    """Flow kaynagini oku; HTML ise etiketleri soyup duz metne indir."""
    raw = path.read_text(encoding="utf-8", errors="replace")

    if path.suffix.lower() in {".html", ".htm"}:
        # script/style bloklarini komple at, sonra etiketleri temizle.
        raw = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", raw)
        raw = re.sub(r"(?s)<!--.*?-->", " ", raw)
        raw = re.sub(r"(?i)<(br|/p|/div|/tr|/li|/h[1-6])\s*/?>", "\n", raw)
        raw = re.sub(r"(?s)<[^>]+>", " ", raw)
        # HTML entity'lerini kaba cozum
        entities = {
            "&nbsp;": " ", "&amp;": "&", "&lt;": "<", "&gt;": ">",
            "&quot;": '"', "&#39;": "'", "&mdash;": "—", "&ndash;": "–",
        }
        for ent, ch in entities.items():
            raw = raw.replace(ent, ch)

    # Fazla bosluklari sadelestir ama satir yapisini koru.
    raw = re.sub(r"[ \t]+", " ", raw)
    raw = re.sub(r"\n{3,}", "\n\n", raw)
    text = raw.strip()

    if len(text) > MAX_SOURCE_CHARS:
        logging.warning(
            "Kaynak %d karakter; %d karaktere kirpiliyor.", len(text), MAX_SOURCE_CHARS
        )
        text = text[:MAX_SOURCE_CHARS]
    return text


# -----------------------------------------------------------------------------
# Prompt
# -----------------------------------------------------------------------------
SYSTEM_PROMPT = (
    "Sen Gistify icin calisan kidemli bir hisse arastirma analistisin. "
    "Sana verilen Flow haber/analiz kaynagindan, TEK bir ticker icin coverage "
    "raporuna girecek yapilandirilmis analizi cikarirsin. "
    "Yalnizca gecerli JSON dondur; markdown, aciklama veya kod citi ekleme. "
    "KURAL: Sadece kaynakta acikca gecen veya kaynaktan mantikli sekilde cikarilan "
    "bilgileri kullan. Fiyat, tarih, hedef gibi sayilari ASLA uydurma; bilinmiyorsa "
    "ilgili alani null birak. Metinler Turkce olsun; yerlesik finans terimleri "
    "(Call, Put, Spread, IV, Breakeven, Short Float) Ingilizce kalabilir."
)

# Bos sema -> Mistral'e beklenen anahtarlari gosterir. Ayni sirayla doldurmasini isteriz.
SCHEMA_HINT = {
    "ticker": "AVGO",
    "company": "sirket tam adi veya null",
    "exchange": "NYSE|NASDAQ|AMEX|OTC veya null",
    "sector": "sektor veya null",
    "signal": "SPEC-BULLISH|BULLISH|NEUTRAL|BEARISH|SPEC-BEARISH",
    "signal_rationale": "sinyalin 1-2 cumlelik gerekcesi",
    "thesis": "raporun ana tezi, 2-3 cumle",
    "summary": "Ozet bolumu prozu, 2-4 cumle",
    "metrics": {
        "price": "birimsiz sayi veya null",
        "price_date": "ISO tarih veya null",
        "change_pct": "birimsiz sayi veya null",
        "low52": "veya null",
        "high52": "veya null",
        "target_avg": "veya null",
        "earnings_date": "ISO veya null",
        "earnings_approx": "true/false veya null",
        "market_cap": "metin (35.2B USD) veya null",
        "rsi": "veya null",
        "sma50": "veya null",
        "sma200": "veya null",
        "short_float": "veya null",
    },
    "price_market": "Fiyat & Piyasa bolumu prozu veya null",
    "earnings_history": [
        {"period": "Q1 2026", "eps_est": None, "eps_actual": None,
         "surprise": None, "revenue_actual": None, "price_reaction": None}
    ],
    "consensus": [
        {"metric": "Q2 Revenue", "consensus": None, "low": None,
         "high": None, "analysts": None}
    ],
    "sec_insider": "SEC & Insider gozlemleri veya null",
    "analyst_view": "Analist gorunumu prozu veya null",
    "catalysts_timeline": [
        {"date": "2026-08-11 (ISO)", "event": "olay", "importance": "Kritik|Yuksek|Orta|Dusuk"}
    ],
    "catalyst_matrix": [
        {"catalyst": "...", "impact": "Pozitif|Negatif|Cift Yonlu",
         "importance": "1-5 yildiz", "status": "durum veya null"}
    ],
    "technical": "Teknik analiz prozu veya null",
    "levels": [
        {"level": "80.00", "type": "Destek|Direnc|Pivot",
         "strength": "1-5 yildiz", "rationale": "gerekce"}
    ],
    "ecosystem": [
        {"company": "Meta", "ticker": "META veya Ozel",
         "relation": "iliski", "importance": "Kritik|Yuksek|Orta|Dusuk", "detail": "..."}
    ],
    "sector_peers": "Sektor & Rakipler prozu veya null",
    "swot": {
        "strengths": ["..."], "weaknesses": ["..."],
        "opportunities": ["..."], "threats": ["..."],
    },
    "red_flags": ["gozlemlenebilir/aksiyon alinabilir uyari ( or. 'X 80.00 USD altinda kapanirsa')"],
    "green_flags": ["gozlemlenebilir pozitif tetik"],
    "sources": [
        {"source": "kaynak adi", "url": "https://...", "timestamp": "ISO veya null"}
    ],
}


def build_user_prompt(ticker: str, company: str | None, source_text: str) -> str:
    company_line = f"Sirket (ipucu): {company}\n" if company else ""
    schema_str = json.dumps(SCHEMA_HINT, ensure_ascii=False, indent=2)
    return (
        f"Ticker: {ticker}\n"
        f"{company_line}"
        f"Bugunun tarihi: {datetime.date.today().isoformat()}\n\n"
        "Asagida bir Gistify Flow kaynagi var. Bu kaynaktan yukaridaki ticker'a "
        "odakli coverage analizini cikar ve TAM OLARAK su JSON semasiyla doldur:\n\n"
        f"{schema_str}\n\n"
        "Doldurma kurallari:\n"
        "- Kaynakta o ticker icin veri yoksa ilgili alani null veya bos liste birak.\n"
        "- Liste alanlarinda (earnings_history, consensus, catalysts_timeline, levels, "
        "ecosystem, sources) yalnizca kaynaktan desteklenen satirlari uret; sayi uydurma.\n"
        "- red_flags/green_flags maddeleri gorus degil, gozlemlenebilir kosul olsun.\n"
        "- sources: kaynagin kendisi ve icinde atifta bulunulan somut kaynak URL'leri.\n"
        "- signal degeri semadaki enum'lardan biri olmali.\n\n"
        "=== FLOW KAYNAGI BASLANGIC ===\n"
        f"{source_text}\n"
        "=== FLOW KAYNAGI SON ==="
    )


# -----------------------------------------------------------------------------
# Mistral cagrisi
# -----------------------------------------------------------------------------
def call_mistral(system_prompt: str, user_prompt: str) -> dict:
    headers = {
        "Authorization": f"Bearer {config.MISTRAL_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
    }

    last_err = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = requests.post(API_URL, headers=headers, json=payload, timeout=TIMEOUT)
            if resp.status_code in (429, 502, 503, 504):
                wait = RETRY_DELAY * attempt
                logging.warning(
                    "%s — %d sn bekleniyor | deneme %d/%d",
                    resp.status_code, wait, attempt, MAX_RETRIES,
                )
                time.sleep(wait)
                last_err = f"HTTP {resp.status_code}"
                continue
            resp.raise_for_status()
            return resp.json()
        except requests.exceptions.HTTPError as exc:
            # 4xx (429 disinda) — tekrar denemenin anlami yok.
            logging.error("HTTP hatasi: %s | govde: %s", exc, resp.text[:400])
            raise
        except requests.exceptions.RequestException as exc:
            last_err = str(exc)
            logging.error("Baglanti hatasi (deneme %d/%d): %s", attempt, MAX_RETRIES, exc)
            time.sleep(RETRY_DELAY * attempt)

    raise RuntimeError(f"Mistral cagrisi {MAX_RETRIES} denemede basarisiz: {last_err}")


def parse_content_json(content: str) -> dict:
    """Model JSON mode'da olsa da bazen kod citi/onsoz ekleyebilir; toleransli ayristir."""
    content = content.strip()
    content = re.sub(r"^```(?:json)?\s*|\s*```$", "", content).strip()
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        # Ilk '{' ile son '}' arasini dene.
        start, end = content.find("{"), content.rfind("}")
        if start != -1 and end != -1 and end > start:
            return json.loads(content[start : end + 1])
        raise


# -----------------------------------------------------------------------------
# Ana akis
# -----------------------------------------------------------------------------
def main() -> int:
    parser = argparse.ArgumentParser(
        description="Flow kaynagindan Mistral ile yapilandirilmis coverage analizi uretir."
    )
    parser.add_argument("source", help="Flow kaynak dosyasi (flow/*.html | *.md)")
    parser.add_argument("--ticker", required=True, help="Analiz edilecek ticker (BUYUK harf)")
    parser.add_argument("--company", default=None, help="Sirket adi ipucu (opsiyonel)")
    parser.add_argument("--out", default=None, help="Cikti klasoru (varsayilan data/coverage_research/)")
    args = parser.parse_args()

    if not config.MISTRAL_API_KEY:
        logging.error("MISTRAL_API_KEY .env'de tanimli degil.")
        return 2

    source_path = Path(args.source)
    if not source_path.is_absolute():
        source_path = config.BASE_DIR / source_path
    if not source_path.exists():
        logging.error("Kaynak dosya bulunamadi: %s", source_path)
        return 2

    ticker = args.ticker.strip().upper()
    out_root = Path(args.out) if args.out else OUTPUT_ROOT
    out_root.mkdir(parents=True, exist_ok=True)

    logging.info("Kaynak okunuyor: %s", source_path.name)
    source_text = load_source_text(source_path)
    if len(source_text) < 200:
        logging.warning("Kaynak metni cok kisa (%d karakter) — sonuc zayif olabilir.", len(source_text))

    user_prompt = build_user_prompt(ticker, args.company, source_text)

    logging.info("Mistral'e gonderiliyor (model=%s, ticker=%s)...", MODEL, ticker)
    result = call_mistral(SYSTEM_PROMPT, user_prompt)

    try:
        content = result["choices"][0]["message"]["content"]
        usage = result.get("usage", {})
    except (KeyError, IndexError) as exc:
        logging.error("Beklenmeyen API yanit yapisi: %s", exc)
        return 1

    try:
        analysis = parse_content_json(content)
    except json.JSONDecodeError as exc:
        logging.error("Model JSON dondurmedi: %s", exc)
        # Ham cikti hata ayiklama icin diske yazilir.
        (out_root / f"{ticker}-{datetime.date.today().isoformat()}.raw.txt").write_text(
            content, encoding="utf-8"
        )
        return 1

    # ticker'i garanti altina al.
    analysis.setdefault("ticker", ticker)

    today = datetime.date.today().isoformat()
    json_path = out_root / f"{ticker}-{today}.json"
    meta_path = out_root / f"{ticker}-{today}.meta.json"

    json_path.write_text(json.dumps(analysis, ensure_ascii=False, indent=2), encoding="utf-8")
    meta_path.write_text(
        json.dumps(
            {
                "ticker": ticker,
                "source_file": str(source_path.relative_to(config.BASE_DIR))
                if str(source_path).startswith(str(config.BASE_DIR)) else str(source_path),
                "generated_at": datetime.datetime.now().isoformat(timespec="seconds"),
                "model": result.get("model", MODEL),
                "prompt_tokens": usage.get("prompt_tokens", 0),
                "completion_tokens": usage.get("completion_tokens", 0),
                "source_chars": len(source_text),
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    # stdout ozeti — skill/Claude bunu okur.
    sig = analysis.get("signal", "?")
    n_cat = len(analysis.get("catalysts_timeline") or [])
    n_src = len(analysis.get("sources") or [])
    n_lvl = len(analysis.get("levels") or [])
    print("\n=== COVERAGE RESEARCH OZET ===")
    print(f"ticker      : {ticker}")
    print(f"company     : {analysis.get('company') or '—'}")
    print(f"signal      : {sig}")
    print(f"thesis      : {(analysis.get('thesis') or '')[:160]}")
    print(f"catalysts   : {n_cat} | levels: {n_lvl} | sources: {n_src}")
    print(f"JSON        : {json_path}")
    print("Sonraki adim: Claude bu JSON'u coverage-md/1 kontratina dokup coverage-verify.mjs ile dogrular.")
    logging.info("Tamamlandi. (%s prompt / %s completion token)",
                 usage.get("prompt_tokens", 0), usage.get("completion_tokens", 0))
    return 0


if __name__ == "__main__":
    sys.exit(main())
