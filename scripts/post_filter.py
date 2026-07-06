#!/usr/bin/env python3
"""
post_filter.py — Filter & rank X posts by language, engagement, keywords.

Usage:
    python scripts/post_filter.py

Requires:
    - Python 3.8+
    - langdetect (auto-installed if missing)
"""

import json
import os
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
INPUT_PATH = BASE_DIR / "data" / "x_research" / "raw_posts.json"
OUTPUT_PATH = BASE_DIR / "data" / "x_research" / "filtered_posts.json"

# ---------------------------------------------------------------------------
# Keywords
# ---------------------------------------------------------------------------
TR_KEYWORDS = [
    "yapay zeka", "finans", "kripto", "borsa", "hisse", "ekonomi",
    "faiz", "enflasyon", "fed", "vix", "spy", "qqq", "nasdaq",
    "s&p", "dolar", "altin", "petrol", "recession", "gdp", "cpi",
    "ppi", "opsiyon", "viop", "merkez bankasi", "tcmb", "fomc",
]

EN_KEYWORDS = [
    "AI", "finance", "crypto", "stock", "market", "economy",
    "interest rate", "inflation", "fed", "vix", "spy", "qqq",
    "nasdaq", "s&p 500", "dollar", "gold", "oil", "recession",
    "gdp", "cpi", "ppi", "options", "fomc", "treasury", "yield",
    "bull", "bear",
]

# ---------------------------------------------------------------------------
# Thresholds
# ---------------------------------------------------------------------------
MIN_LIKES_TR = 50
MIN_LIKES_EN = 100
MIN_CHARS_TR = 100
MIN_CHARS_EN = 150
TIME_BONUS_HOURS = 6
TIME_BONUS_POINTS = 20.0

# ---------------------------------------------------------------------------
# Langdetect setup
# ---------------------------------------------------------------------------

try:
    from langdetect import detect, DetectorFactory
    DetectorFactory.seed = 0
    HAS_LANGDETECT = True
except ImportError:
    HAS_LANGDETECT = False


def ensure_langdetect() -> None:
    """Install langdetect if missing."""
    global HAS_LANGDETECT
    if HAS_LANGDETECT:
        return
    print("[INFO] langdetect not found — installing...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "langdetect", "-q"])
        from langdetect import detect, DetectorFactory  # noqa: F811
        DetectorFactory.seed = 0
        HAS_LANGDETECT = True
        print("[INFO] langdetect installed successfully.")
    except Exception as exc:
        print(f"[WARN] Could not install langdetect: {exc}")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def detect_language(text: str) -> str:
    """Return 'tr', 'en', or 'pending'."""
    if not text:
        return "pending"

    # Fast heuristic: Turkish-specific characters
    turkish_chars = set("cgiosuCGIOSU")
    if any(ch in turkish_chars for ch in text):
        return "tr"

    # If ASCII-dominant (>90%), lean English
    ascii_count = sum(1 for ch in text if ord(ch) < 128)
    if ascii_count / max(len(text), 1) > 0.90:
        return "en"

    # Fallback to langdetect if available
    if HAS_LANGDETECT:
        try:
            lang = detect(text)
            if lang in ("tr", "en"):
                return lang
        except Exception:
            pass

    return "pending"


def find_keywords(text: str, keywords: list[str]) -> list[str]:
    """Case-insensitive keyword match."""
    lower_text = text.lower()
    matched = []
    for kw in keywords:
        if kw.lower() in lower_text:
            matched.append(kw)
    return matched


def parse_timestamp(ts: str | None) -> datetime | None:
    """Parse ISO 8601 timestamp string to datetime (UTC)."""
    if not ts:
        return None
    try:
        # Handle 'Z' suffix and fractional seconds
        ts = ts.replace("Z", "+00:00")
        return datetime.fromisoformat(ts)
    except Exception:
        return None


def is_within_hours(dt: datetime, hours: int) -> bool:
    """Check if dt is within the last N hours from now."""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    now = datetime.now(timezone.utc)
    return now - timedelta(hours=hours) <= dt <= now


def compute_engagement_score(post: dict) -> float:
    """Weighted engagement with time bonus."""
    likes = post.get("likes", 0) or 0
    retweets = post.get("retweets", 0) or 0
    replies = post.get("replies", 0) or 0
    score = (likes * 0.6) + (retweets * 0.3) + (replies * 0.1)

    ts = parse_timestamp(post.get("timestamp"))
    if ts and is_within_hours(ts, TIME_BONUS_HOURS):
        score += TIME_BONUS_POINTS

    return round(score, 2)


def passes_filters(post: dict, lang: str) -> bool:
    """Check minimum like and character thresholds by language."""
    text = post.get("text", "")
    likes = post.get("likes", 0) or 0

    if lang == "tr":
        return likes >= MIN_LIKES_TR and len(text) >= MIN_CHARS_TR
    elif lang == "en":
        return likes >= MIN_LIKES_EN and len(text) >= MIN_CHARS_EN
    else:
        # pending — use stricter EN thresholds as default
        return likes >= MIN_LIKES_EN and len(text) >= MIN_CHARS_EN


# ---------------------------------------------------------------------------
# Main pipeline
# ---------------------------------------------------------------------------

def load_raw_posts() -> list[dict]:
    if not INPUT_PATH.exists():
        print(f"[ERROR] Input file not found: {INPUT_PATH}")
        return []
    with open(INPUT_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, list):
        return data
    elif isinstance(data, dict) and "posts" in data:
        return data["posts"]
    return []


def filter_posts(posts: list[dict]) -> list[dict]:
    filtered = []
    errors = 0

    for post in posts:
        try:
            if not isinstance(post, dict):
                continue

            text = post.get("text", "")
            if not text or len(text) < 50:
                continue

            # Language detection
            lang = detect_language(text)

            # Keyword matching (language-agnostic union)
            matched = find_keywords(text, TR_KEYWORDS) + find_keywords(text, EN_KEYWORDS)
            if not matched:
                continue

            # Minimum filters
            if not passes_filters(post, lang):
                continue

            # Engagement score
            score = compute_engagement_score(post)

            filtered.append({
                "id": post.get("id", ""),
                "text": text,
                "author": post.get("author", ""),
                "timestamp": post.get("timestamp", ""),
                "lang": lang,
                "likes": post.get("likes", 0) or 0,
                "retweets": post.get("retweets", 0) or 0,
                "replies": post.get("replies", 0) or 0,
                "engagement_score": score,
                "keywords_matched": matched,
            })
        except Exception as exc:
            errors += 1
            print(f"[WARN] Skipped malformed post: {exc}")

    if errors:
        print(f"[INFO] Total posts skipped due to errors: {errors}")

    return filtered


def build_output(filtered: list[dict]) -> dict[str, Any]:
    # Sort by engagement score descending
    filtered.sort(key=lambda p: p["engagement_score"], reverse=True)

    # Separate top 5 per language
    tr_posts = [p for p in filtered if p["lang"] == "tr"][:5]
    en_posts = [p for p in filtered if p["lang"] == "en"][:5]
    pending_posts = [p for p in filtered if p["lang"] == "pending"][:5]

    return {
        "meta": {
            "filtered_at": datetime.now(timezone.utc).isoformat(),
            "total_raw": len(load_raw_posts()),
            "total_filtered": len(filtered),
        },
        "top_tr": tr_posts,
        "top_en": en_posts,
        "top_pending": pending_posts,
        "posts": filtered,
    }


def save_output(data: dict) -> None:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[INFO] Saved filtered output to {OUTPUT_PATH}")


def main() -> int:
    ensure_langdetect()

    posts = load_raw_posts()
    if not posts:
        print("[WARN] No raw posts to process.")
        save_output({
            "meta": {
                "filtered_at": datetime.now(timezone.utc).isoformat(),
                "total_raw": 0,
                "total_filtered": 0,
            },
            "top_tr": [],
            "top_en": [],
            "top_pending": [],
            "posts": [],
        })
        return 0

    print(f"[INFO] Loaded {len(posts)} raw posts.")
    filtered = filter_posts(posts)
    print(f"[INFO] {len(filtered)} posts passed filters.")

    output = build_output(filtered)
    save_output(output)

    # Summary
    print("\n--- Filter Summary ---")
    print(f"Total raw     : {output['meta']['total_raw']}")
    print(f"Total filtered: {output['meta']['total_filtered']}")
    print(f"Top 5 TR      : {len(output['top_tr'])}")
    print(f"Top 5 EN      : {len(output['top_en'])}")
    print(f"Top 5 Pending : {len(output['top_pending'])}")
    print("----------------------\n")

    return 0


if __name__ == "__main__":
    sys.exit(main())
