#!/usr/bin/env python3
"""
x_scraper.py — X.com home feed scraper via Kimi WebBridge.

Usage:
    python scripts/x_scraper.py

Requires:
    - Python 3.8+
    - requests (pip install requests)
    - curl.exe available on Windows (fallback)
"""

import json
import os
import subprocess
import sys
import tempfile
import time
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
WEBBRIDGE_URL = "http://127.0.0.1:10086/command"
TARGET_URL = "https://x.com/home"
SESSION_NAME = "x-research-pipeline"
GROUP_TITLE = "X Research Pipeline"
OUTPUT_DIR = Path(r"C:\Users\hasan\OneDrive\Desktop\gistify\data\x_research")
OUTPUT_PATH = OUTPUT_DIR / "raw_posts.json"
MAX_SCROLL_ATTEMPTS = 5
SCROLL_DELAY = 2  # seconds between scrolls
NAVIGATE_WAIT = 5  # seconds after initial navigation

# JS extractor sent to WebBridge evaluate
EXTRACTOR_JS = """
(() => {
  const articles = document.querySelectorAll('article[data-testid="tweet"]');
  const posts = [];
  articles.forEach((article, idx) => {
    try {
      const textEl = article.querySelector('[data-testid="tweetText"]');
      const text = textEl ? textEl.innerText : '';
      const authorEl = article.querySelector('[data-testid="User-Names"] a');
      const author = authorEl ? authorEl.getAttribute('href').replace('/', '') : '';
      const timeEl = article.querySelector('time');
      const timestamp = timeEl ? timeEl.getAttribute('datetime') : '';
      const likesEl = article.querySelector('[data-testid="like"]');
      const likes = likesEl ? parseInt(likesEl.innerText.replace(/[^0-9]/g, '')) || 0 : 0;
      const retweetsEl = article.querySelector('[data-testid="retweet"]');
      const retweets = retweetsEl ? parseInt(retweetsEl.innerText.replace(/[^0-9]/g, '')) || 0 : 0;
      const repliesEl = article.querySelector('[data-testid="reply"]');
      const replies = repliesEl ? parseInt(repliesEl.innerText.replace(/[^0-9]/g, '')) || 0 : 0;
      if (text.length > 50) {
        posts.push({
          id: 'post_' + idx + '_' + Date.now(),
          text,
          author,
          timestamp,
          likes,
          retweets,
          replies,
          scraped_at: new Date().toISOString()
        });
      }
    } catch (e) {}
  });
  return JSON.stringify(posts);
})()
"""

SCROLL_JS = "window.scrollBy(0, 800);"


# ---------------------------------------------------------------------------
# HTTP helpers — prefer requests, fall back to curl.exe on Windows
# ---------------------------------------------------------------------------

try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False


def _post_with_requests(action: str, args: dict, session: str) -> dict:
    """POST to WebBridge using requests."""
    payload = {"action": action, "args": args, "session": session}
    resp = requests.post(WEBBRIDGE_URL, json=payload, timeout=60)
    resp.raise_for_status()
    return resp.json()


def _post_with_curl(action: str, args: dict, session: str) -> dict:
    """POST to WebBridge using Windows curl.exe with temp file body."""
    payload = {"action": action, "args": args, "session": session}
    fd, tmp_path = tempfile.mkstemp(suffix=".json", prefix="wb_payload_")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False)
        cmd = [
            "curl.exe",
            "-s",
            "-X", "POST",
            "-H", "Content-Type: application/json",
            "--data-binary", f"@{tmp_path}",
            WEBBRIDGE_URL,
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        if result.returncode != 0:
            raise RuntimeError(f"curl.exe failed: {result.stderr}")
        return json.loads(result.stdout)
    finally:
        try:
            os.remove(tmp_path)
        except OSError:
            pass


def webbridge_post(action: str, args: dict, session: str = SESSION_NAME) -> dict:
    """Dispatch POST to WebBridge (requests preferred, curl fallback)."""
    if HAS_REQUESTS:
        try:
            return _post_with_requests(action, args, session)
        except Exception as exc:
            print(f"[WARN] requests failed ({exc}), trying curl.exe fallback...")
            return _post_with_curl(action, args, session)
    else:
        return _post_with_curl(action, args, session)


# ---------------------------------------------------------------------------
# Core scraping logic
# ---------------------------------------------------------------------------

def ensure_output_dir() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def save_posts(posts: list) -> None:
    ensure_output_dir()
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    print(f"[INFO] Saved {len(posts)} posts to {OUTPUT_PATH}")


def load_existing_posts() -> list:
    if OUTPUT_PATH.exists():
        try:
            with open(OUTPUT_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    print(f"[INFO] Loaded {len(data)} existing posts from fallback file.")
                    return data
        except Exception as exc:
            print(f"[WARN] Could not read existing posts: {exc}")
    return []


def scrape_posts() -> list:
    """Navigate to X home feed and extract posts via WebBridge."""
    # 1. Navigate
    print(f"[INFO] Navigating to {TARGET_URL} ...")
    webbridge_post(
        "navigate",
        {
            "url": TARGET_URL,
            "newTab": True,
            "group_title": GROUP_TITLE,
        },
        session=SESSION_NAME,
    )
    print(f"[INFO] Waiting {NAVIGATE_WAIT}s for page load...")
    time.sleep(NAVIGATE_WAIT)

    posts = []
    for attempt in range(1, MAX_SCROLL_ATTEMPTS + 1):
        # 2. Evaluate extractor
        print(f"[INFO] Extraction attempt {attempt}/{MAX_SCROLL_ATTEMPTS} ...")
        result = webbridge_post("evaluate", {"script": EXTRACTOR_JS}, session=SESSION_NAME)
        data = result.get("data", {}) if isinstance(result, dict) else {}
        raw = data.get("value", "[]") if isinstance(data, dict) else "[]"
        try:
            batch = json.loads(raw) if isinstance(raw, str) else raw
        except json.JSONDecodeError:
            batch = []

        if isinstance(batch, list) and batch:
            posts.extend(batch)
            print(f"[INFO] Found {len(batch)} posts on attempt {attempt}.")
            # Continue scrolling to get more posts (X is infinite-scroll)
        else:
            print(f"[INFO] No posts found on attempt {attempt}.")

        # 3. Scroll down for next batch
        if attempt < MAX_SCROLL_ATTEMPTS:
            print("[INFO] Scrolling down...")
            webbridge_post("evaluate", {"script": SCROLL_JS}, session=SESSION_NAME)
            time.sleep(SCROLL_DELAY)

    # Deduplicate by id
    seen = set()
    unique_posts = []
    for p in posts:
        pid = p.get("id")
        if pid and pid not in seen:
            seen.add(pid)
            unique_posts.append(p)

    return unique_posts


def main() -> int:
    try:
        posts = scrape_posts()
        if not posts:
            print("[WARN] No posts scraped from WebBridge.")
            posts = load_existing_posts()
            if not posts:
                print("[WARN] No fallback posts found — writing empty array.")
                save_posts([])
                return 0
        save_posts(posts)
        return 0
    except Exception as exc:
        print(f"[ERROR] Scraping failed: {exc}")
        posts = load_existing_posts()
        if not posts:
            save_posts([])
        return 1


if __name__ == "__main__":
    sys.exit(main())
