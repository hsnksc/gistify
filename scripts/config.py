#!/usr/bin/env python3
"""
Gistify X Research Pipeline — Ortak Config Modülü
X.com home feed → post filter → Mistral deep research → article synthesis → Flow HTML → git deploy
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# ── .env yükle ────────────────────────────────────────────────────────────────
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

# ── Path'ler (absolute) ───────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data" / "x_research"
FLOW_DIR = BASE_DIR / "flow"
SCRIPTS_DIR = BASE_DIR / "scripts"

# ── Mistral API ───────────────────────────────────────────────────────────────
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY", "")
MISTRAL_MODEL = os.getenv("MISTRAL_MODEL", "mistral-large-latest")
MISTRAL_API_URL = os.getenv("MISTRAL_API_URL", "https://api.mistral.ai/v1/chat/completions")

# ── WebBridge ─────────────────────────────────────────────────────────────────
WEBBRIDGE_URL = os.getenv("WEBBRIDGE_URL", "http://127.0.0.1:10086")

# ── Session / Group ───────────────────────────────────────────────────────────
X_RESEARCH_SESSION = "x-research-pipeline"
X_RESEARCH_GROUP = "X Research Pipeline"

# ── Filtreleme threshold'ları ─────────────────────────────────────────────────
MIN_LIKES_TR = int(os.getenv("MIN_LIKES_TR", "50"))
MIN_LIKES_EN = int(os.getenv("MIN_LIKES_EN", "100"))
MIN_CHARS_TR = int(os.getenv("MIN_CHARS_TR", "100"))
MIN_CHARS_EN = int(os.getenv("MIN_CHARS_EN", "150"))
TOP_POSTS_PER_LANG = int(os.getenv("TOP_POSTS_PER_LANG", "5"))

# Zaman bonusu — son X saatteki post'lara ek puan
TIME_BONUS_HOURS = int(os.getenv("TIME_BONUS_HOURS", "6"))
TIME_BONUS_SCORE = int(os.getenv("TIME_BONUS_SCORE", "20"))

# ── Keyword'ler (finans/ekonomi odaklı) ───────────────────────────────────────
KEYWORDS_TR = [
    "borsa", "hisse", "ekonomi", "merkez bankası", "tcmb", "faiz", "enflasyon",
    "dolar", "euro", "altın", "petrol", "kripto", "bitcoin", "bist", "viop",
    "yatırım", "fon", "tahvil", "opsiyon", "varant", "vadeli", "swap",
    "cari açık", "bütçe", "kredi", "mevduat", "repo", "tüfe", "üfe",
    "ithalat", "ihracat", "sanayi üretimi", "işsizlik", "büyüme", "gdp",
    "tcmb faiz", "politika faizi", "rezerv", "kur korumalı", "döviz",
    "spk", "bdkk", "bankacılık", "sigorta", "fintech",
]

KEYWORDS_EN = [
    "stock market", "stocks", "equity", "finance", "economy", "federal reserve",
    "fed", "interest rate", "inflation", "cpi", "ppi", "gdp", "employment",
    "nfp", "jobs report", "dollar", "eurusd", "gold", "oil", "crude", "crypto",
    "bitcoin", "btc", "ethereum", "eth", "s&p 500", "nasdaq", "dow", "vix",
    "yield", "treasury", "bond", "options", "futures", "forex", "trading",
    "investment", "etf", "mutual fund", "hedge fund", "dividend",
    "earnings", "revenue", "profit", "margin", "outlook", "guidance",
    "bull", "bear", "rally", "correction", "crash", "recession",
    "fomc", "monetary policy", "fiscal policy", "stimulus", "austerity",
    "banking", "insurance", "fintech", "private equity", "venture capital",
    "ipo", "merger", "acquisition", "takeover", "valuation", "multiples",
    "leverage", "debt", "credit", "default", "bankruptcy", "restructuring",
    "commodities", "agriculture", "metals", "energy", "utilities",
    "sector rotation", "momentum", "value", "growth", "small cap", "large cap",
    "technical analysis", "fundamental analysis", "quant", "algo trading",
]

# ── Diğer ayarlar ─────────────────────────────────────────────────────────────
# Mistral API timeout (saniye)
MISTRAL_TIMEOUT = int(os.getenv("MISTRAL_TIMEOUT", "120"))
# Retry sayısı
MAX_RETRIES = int(os.getenv("MAX_RETRIES", "3"))
# Retry bekleme süresi (saniye)
RETRY_DELAY = int(os.getenv("RETRY_DELAY", "5"))


# ── Yardımcı fonksiyonlar ─────────────────────────────────────────────────────
def get_date_slug(date=None) -> str:
    """
    Belirtilen tarihi veya bugünü '6-temmuz-2026' formatında döndürür.

    Args:
        date: datetime.date objesi. None ise bugün kullanılır.

    Returns:
        str: "<gün>-<ay_adı>-<yıl>" formatında string (Türkçe aylar).
    """
    import datetime

    months_tr = [
        "ocak", "şubat", "mart", "nisan", "mayıs", "haziran",
        "temmuz", "ağustos", "eylül", "ekim", "kasım", "aralık",
    ]

    if date is None:
        date = datetime.date.today()

    return f"{date.day}-{months_tr[date.month - 1]}-{date.year}"


def ensure_dirs() -> None:
    """
    Pipeline'ın ihtiyaç duyduğu tüm dizinleri oluşturur.
    Mevcut dizinler varsa hata vermez.
    """
    dirs_to_create = [
        DATA_DIR,
        DATA_DIR / "research_results" / "tr",
        DATA_DIR / "research_results" / "en",
        DATA_DIR / "articles",
        FLOW_DIR,
    ]
    for d in dirs_to_create:
        d.mkdir(parents=True, exist_ok=True)


if __name__ == "__main__":
    # Quick smoke test
    print(f"BASE_DIR: {BASE_DIR}")
    print(f"DATA_DIR: {DATA_DIR}")
    print(f"FLOW_DIR: {FLOW_DIR}")
    print(f"SCRIPTS_DIR: {SCRIPTS_DIR}")
    print(f"get_date_slug(): {get_date_slug()}")
    print(f"MISTRAL_MODEL: {MISTRAL_MODEL}")
    print(f"KEYWORDS_TR sayısı: {len(KEYWORDS_TR)}")
    print(f"KEYWORDS_EN sayısı: {len(KEYWORDS_EN)}")
    ensure_dirs()
    print("✓ Dizinler hazır.")
