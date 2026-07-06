#!/usr/bin/env python3
"""
mistral_research.py
-------------------
Filtrelenmis X.com post'larini Mistral API'ye gondererek derinlemesine
arastirma ciktisi uretir. Sonuclari Markdown ve meta JSON olarak kaydeder.

Girdi : data/x_research/filtered_posts.json
Cikti : data/x_research/research_results/{tr,en}/{post_id}.md
          data/x_research/research_results/{tr,en}/{post_id}.meta.json
"""

import json
import logging
import os
import sys
import time
from pathlib import Path

import requests
from dotenv import load_dotenv

# -----------------------------------------------------------------------------
# Konfigurasyon
# -----------------------------------------------------------------------------
load_dotenv()

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
if not MISTRAL_API_KEY:
    raise ValueError("MISTRAL_API_KEY not found in .env")

API_ENDPOINT = "https://api.mistral.ai/v1/chat/completions"
MODEL = os.getenv("MISTRAL_MODEL", "mistral-large-latest")

INPUT_FILE = Path("data/x_research/filtered_posts.json")
OUTPUT_ROOT = Path("data/x_research/research_results")

BATCH_SIZE = 3
BATCH_DELAY_SECONDS = 15
MAX_RETRIES = 3
RETRY_BACKOFF_SECONDS = 30
REQUEST_TIMEOUT = 120

HEADERS = {
    "Authorization": f"Bearer {MISTRAL_API_KEY}",
    "Content-Type": "application/json",
}

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# -----------------------------------------------------------------------------
# Prompt Sablonlari
# -----------------------------------------------------------------------------
TR_PROMPT = """Sen bir fact-checker ve arastirmacisin. Asagidaki X.com postunu Turkce olarak derinlemesine arastir:

Post: {text}
Yazar: {author}
Tarih: {timestamp}

Gorevler:
1. Dogrulama: Posttaki iddialari Turkce kaynaklarla dogrula. Yanlis bilgiler varsa duzelt ve kaynak goster.
2. Baglam Ekle: Konunun Turkiye'deki etkileri neler? Sektorel analizi yap.
3. Karsit Gorusler: Konu hakkinda farkli bakis acilari sun.
4. Kaynaklar: Minimum 3 Turkce kaynak (URL + ozet).

Cikti Formati: Markdown (### basliklari kullan).
Dil: Yalnizca Turkce.
"""

EN_PROMPT = """You are a fact-checker and researcher. Deeply investigate the following X.com post in English:

Post: {text}
Author: {author}
Date: {timestamp}

Tasks:
1. Fact-Checking: Verify claims using English sources. Correct false information and cite sources.
2. Context Addition: What are the global impacts? Sectoral analysis.
3. Opposing Views: Provide alternative perspectives.
4. Sources: Minimum 3 English sources (URL + summary).

Output Format: Markdown (use ### headers).
Language: English only.
"""


# -----------------------------------------------------------------------------
# Yardimci Fonksiyonlar
# -----------------------------------------------------------------------------
def build_prompt(post: dict) -> str:
    """Post'un diline gore uygun prompt'u dondurur."""
    lang = post.get("lang", "en")
    template = TR_PROMPT if lang == "tr" else EN_PROMPT
    return template.format(
        text=post.get("text", ""),
        author=post.get("author", "unknown"),
        timestamp=post.get("timestamp", ""),
    )


def call_mistral(prompt: str) -> dict | None:
    """
    Mistral API'ye chat completion istegi gonderir.
    429 durumunda sabit bekleme ile retry uygular.
    """
    payload = {
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3,
    }

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = requests.post(
                API_ENDPOINT,
                headers=HEADERS,
                json=payload,
                timeout=REQUEST_TIMEOUT,
            )

            if response.status_code == 429:
                logging.warning(
                    "429 Too Many Requests — bekleniyor (%d sn) | deneme %d/%d",
                    RETRY_BACKOFF_SECONDS,
                    attempt,
                    MAX_RETRIES,
                )
                time.sleep(RETRY_BACKOFF_SECONDS)
                continue

            response.raise_for_status()
            return response.json()

        except requests.exceptions.HTTPError as exc:
            logging.error("HTTP hatasi (deneme %d/%d): %s", attempt, MAX_RETRIES, exc)
            # 429 disinda client hatasi varsa tekrar denemeye gerek yok
            if response.status_code not in (429, 502, 503, 504):
                break
            time.sleep(RETRY_BACKOFF_SECONDS)

        except requests.exceptions.RequestException as exc:
            logging.error("Baglanti hatasi (deneme %d/%d): %s", attempt, MAX_RETRIES, exc)
            time.sleep(RETRY_BACKOFF_SECONDS)

    return None


def save_result(post_id: str, lang: str, content: str, meta: dict) -> None:
    """Markdown ve meta JSON'u diske yazar."""
    out_dir = OUTPUT_ROOT / lang
    out_dir.mkdir(parents=True, exist_ok=True)

    md_path = out_dir / f"{post_id}.md"
    meta_path = out_dir / f"{post_id}.meta.json"

    md_path.write_text(content, encoding="utf-8")
    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")

    logging.info("Kaydedildi: %s", md_path)


# -----------------------------------------------------------------------------
# Ana Akis
# -----------------------------------------------------------------------------
def main() -> int:
    if not INPUT_FILE.exists():
        logging.error("Girdi dosyasi bulunamadi: %s", INPUT_FILE)
        return 1

    raw_data = json.loads(INPUT_FILE.read_text(encoding="utf-8"))

    # JSON yapisi liste veya dict olabilir
    if isinstance(raw_data, list):
        posts = raw_data
    elif isinstance(raw_data, dict):
        posts = list(raw_data.values())
    else:
        logging.error("Beklenmeyen JSON yapisi: %s", type(raw_data))
        return 1

    if not posts:
        logging.warning("Islenecek post bulunamadi.")
        return 0

    total = len(posts)
    logging.info("Toplam %d post islenecek.", total)

    for batch_start in range(0, total, BATCH_SIZE):
        batch = posts[batch_start : batch_start + BATCH_SIZE]
        logging.info(
            "Batch %d-%d / %d baslatiliyor...",
            batch_start + 1,
            min(batch_start + BATCH_SIZE, total),
            total,
        )

        for post in batch:
            post_id = str(post.get("id") or post.get("post_id") or "unknown")
            lang = post.get("lang", "en")

            # Daha once islendiyse atla (idempotency)
            md_path = OUTPUT_ROOT / lang / f"{post_id}.md"
            if md_path.exists():
                logging.info("Post %s zaten islenmis, atlaniyor.", post_id)
                continue

            prompt = build_prompt(post)
            result = call_mistral(prompt)

            if result is None:
                logging.error("Post %s icin API yaniti alinamadi.", post_id)
                continue

            try:
                message = result["choices"][0]["message"]["content"]
                usage = result.get("usage", {})
                model_used = result.get("model", MODEL)
            except (KeyError, IndexError) as exc:
                logging.error("Post %s icin yanit yapisi bozuk: %s", post_id, exc)
                continue

            meta = {
                "post_id": post_id,
                "author": post.get("author", ""),
                "timestamp": post.get("timestamp", ""),
                "lang": lang,
                "prompt_tokens": usage.get("prompt_tokens", 0),
                "completion_tokens": usage.get("completion_tokens", 0),
                "model": model_used,
            }

            save_result(post_id, lang, message, meta)

        # Batch'ler arasi bekleme (son batch haric)
        next_start = batch_start + BATCH_SIZE
        if next_start < total:
            logging.info("Batch tamamlandi. %d saniye bekleniyor...", BATCH_DELAY_SECONDS)
            time.sleep(BATCH_DELAY_SECONDS)

    logging.info("Tum islemler tamamlandi.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
