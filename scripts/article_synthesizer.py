#!/usr/bin/env python3
"""
article_synthesizer.py
----------------------
Mistral deep research ciktilarini ve filtrelenmis post'lari sentezleyerek
cift dilli (TR / EN) makale uretir.

Girdi:
  - data/x_research/research_results/tr/*.md
  - data/x_research/research_results/en/*.md
  - data/x_research/filtered_posts.json

Cikti:
  - data/x_research/articles/makale_{gun}-{ay}-{yil}_TR.md
  - data/x_research/articles/makale_{gun}-{ay}-{yil}_EN.md
  - data/x_research/articles/makale_{gun}-{ay}-{yil}_meta.json
"""

import json
import logging
import re
import sys
from datetime import datetime
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# -----------------------------------------------------------------------------
# Sabitler
# -----------------------------------------------------------------------------
RESEARCH_TR_DIR = Path("data/x_research/research_results/tr")
RESEARCH_EN_DIR = Path("data/x_research/research_results/en")
POSTS_FILE = Path("data/x_research/filtered_posts.json")
ARTICLES_DIR = Path("data/x_research/articles")

TR_MONTHS = {
    1: "ocak",
    2: "subat",
    3: "mart",
    4: "nisan",
    5: "mayis",
    6: "haziran",
    7: "temmuz",
    8: "agustos",
    9: "eylul",
    10: "ekim",
    11: "kasim",
    12: "aralik",
}

TR_STOPWORDS = {
    "bir", "ve", "bu", "da", "de", "mi", "icin", "ile", "cok", "ama", "ise",
    "kadar", "gibi", "her", "daha", "en", "ben", "sen", "o", "biz", "siz",
    "onlar", "olan", "tarafindan", "kendi", "yok", "evet", "cunku", "eger",
}

EN_STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "must", "shall", "can", "need", "this",
    "that", "these", "those", "not", "no", "yes", "because", "if", "so",
}


# -----------------------------------------------------------------------------
# Yardimci Fonksiyonlar
# -----------------------------------------------------------------------------
def format_date_tr(dt: datetime | None = None) -> str:
    """Ornek: 6-temmuz-2026"""
    if dt is None:
        dt = datetime.now()
    return f"{dt.day}-{TR_MONTHS[dt.month]}-{dt.year}"


def extract_urls(text: str) -> list[str]:
    """Metindeki URL'leri bulur."""
    return re.findall(r"https?://\S+", text)


def extract_section(markdown: str, keyword: str) -> str:
    """
    Markdown icinde ### ile baslayan bolumu arar.
    'keyword' iceren baslikla eslesir; bir sonraki ### veya dosya sonuna kadar
    olan kismi dondurur.
    """
    pattern = rf"###\s*[^\n]*{re.escape(keyword)}[^\n]*\n(.*?)(?:\n###|\Z)"
    match = re.search(pattern, markdown, re.IGNORECASE | re.DOTALL)
    return match.group(1).strip() if match else ""


def extract_proper_nouns(text: str) -> set[str]:
    """Buyuk harfle baslayan kelimeleri (ozel isim, borsa kodu vb.) cikarir."""
    words = re.findall(r"\b[A-Z][a-zA-Z]{2,}\b", text)
    return set(words)


def extract_keywords(text: str, stopwords: set[str]) -> list[str]:
    """Basit kelime cikarimi (stopword filtresi, min 4 harf)."""
    words = re.findall(r"\b[a-zA-ZcgiosuCGIOSU]{4,}\b", text.lower())
    return [w for w in words if w not in stopwords]


def find_common_themes(tr_posts: list[dict], en_posts: list[dict]) -> list[str]:
    """TR ve EN post metinlerindeki ortak buyuk harfli kelimeleri dondurur."""
    tr_text = " ".join(p.get("text", "") for p in tr_posts)
    en_text = " ".join(p.get("text", "") for p in en_posts)

    tr_nouns = extract_proper_nouns(tr_text)
    en_nouns = extract_proper_nouns(en_text)
    common = tr_nouns & en_nouns

    # Ek olarak kucuk harfli ortak kelimeler de varsa ekle
    tr_kw = set(extract_keywords(tr_text, TR_STOPWORDS))
    en_kw = set(extract_keywords(en_text, EN_STOPWORDS))
    common |= tr_kw & en_kw

    return sorted(common)[:10]


def pick_main_topic(posts: list[dict]) -> str:
    """En yuksek engagement skorlu post'un metnini konu basligi olarak dondurur."""
    if not posts:
        return "Guncel Gelismeler"

    sorted_posts = sorted(
        posts,
        key=lambda p: p.get("engagement_score", 0),
        reverse=True,
    )
    top = sorted_posts[0]
    text = top.get("text", "")
    headline = text.split(".")[0].split("\n")[0][:120]
    return headline if headline else "Guncel Gelismeler"


# -----------------------------------------------------------------------------
# Makale Derleyici
# -----------------------------------------------------------------------------
def compile_article(
    lang: str,
    posts: list[dict],
    research_map: dict[str, str],
    all_tr_sources: list[str],
    all_en_sources: list[str],
    common_themes: list[str],
    main_topic: str,
    date_str: str,
) -> str:
    """Belirli bir dil icin Markdown makale dondurur."""
    is_tr = lang == "tr"
    cross_sources = all_en_sources if is_tr else all_tr_sources
    cross_label = (
        "[EN] Ingilizce Kaynaklara Atif" if is_tr else "[TR] Turkce Kaynaklara Atif"
    )

    tr_count = sum(1 for p in posts if p.get("lang") == "tr")
    en_count = sum(1 for p in posts if p.get("lang") == "en")

    # Ozet: en yuksek etkilesimli post'un research'inden baglam bolumu
    summary = ""
    top_post = max(
        posts,
        key=lambda p: p.get("engagement_score", 0),
        default={},
    )
    top_pid = str(top_post.get("id") or top_post.get("post_id") or "")
    if top_pid and top_pid in research_map:
        md = research_map[top_pid]
        section = extract_section(md, "baglam") or extract_section(md, "context")
        if not section:
            section = md[:600]
        summary = section

    # Ana bulgular tablosu
    table_rows: list[str] = []
    for post in posts:
        pid = str(post.get("id") or post.get("post_id") or "")
        md = research_map.get(pid, "")
        verification = extract_section(md, "dogrulama") or extract_section(
            md, "fact-check"
        )
        if not verification:
            verification = md[:300]
        verification_short = verification.replace("\n", " ").replace("|", ",").strip()[:200]
        urls = extract_urls(md)
        source_link = urls[0] if urls else "-"
        author = post.get("author", "unknown")
        table_rows.append(f"| {pid} | {author} | {verification_short}… | {source_link} |")

    # Analiz bolumu
    analyses: list[str] = []
    for post in posts:
        pid = str(post.get("id") or post.get("post_id") or "")
        md = research_map.get(pid, "")
        ctx = extract_section(md, "baglam") or extract_section(md, "context")
        if ctx:
            # Ilk 250 karakteri al, markdown listeye cevir
            snippet = ctx.replace("\n", " ").strip()[:250]
            analyses.append(f"- **{pid}:** {snippet}…")

    analysis_text = "\n".join(analyses[:5]) if analyses else "- Henuz yeterli analiz verisi yok."

    # Kaynaklar listesi
    own_sources = all_tr_sources if is_tr else all_en_sources
    source_lines = [f"{idx}. [{url}]({url})" for idx, url in enumerate(own_sources[:15], 1)]

    # Cross-reference
    cross_lines = [f"- [{url}]({url})" for url in cross_sources[:10]]

    newline = "\n"

    if is_tr:
        article = (
            f"# [SEARCH] Derinlemesine: {main_topic} – {date_str}\n\n"
            f"**[DATE] Yayin Tarihi:** {date_str} (TSI)\n"
            f"**[SEARCH] Arastirma Yapan:** Kimi (Hasan Kuscu Workflow)\n"
            f"**[WORLD] Dil:** Turkce\n"
            f"**[DATA] Kaynak Postlar:** {tr_count} (Turkce), {en_count} (Ingilizce)\n"
            f"**[URL] Ortak Temalar:** {', '.join(common_themes) if common_themes else 'Belirlenemedi'}\n\n"
            f"## [HOT] Neden Onemli?\n"
            f"{summary}\n\n"
            f"## [DATA] Ana Bulgular\n"
            f"| Post | Yazar | Dogrulanmis Bilgi | Kaynak |\n"
            f"|------|-------|-------------------|--------|\n"
            f"{newline.join(table_rows)}\n\n"
            f"## [IDEA] Analiz (Turkiye Odakli)\n"
            f"{analysis_text}\n\n"
            f"## [BOOK] Kaynaklar\n"
            f"{newline.join(source_lines) if source_lines else '- Kaynak bulunamadi.'}\n\n"
            f"## 🌐 {cross_label}\n"
            f"{newline.join(cross_lines) if cross_lines else '-'}\n"
        )
    else:
        article = (
            f"# [SEARCH] Deep Dive: {main_topic} – {date_str}\n\n"
            f"**[DATE] Published:** {date_str} (TSI)\n"
            f"**[SEARCH] Research by:** Kimi (Hasan Kuscu Workflow)\n"
            f"**[WORLD] Language:** English\n"
            f"**[DATA] Source Posts:** {tr_count} (Turkish), {en_count} (English)\n"
            f"**[URL] Common Themes:** {', '.join(common_themes) if common_themes else 'N/A'}\n\n"
            f"## [HOT] Why Does It Matter?\n"
            f"{summary}\n\n"
            f"## [DATA] Key Findings\n"
            f"| Post | Author | Verified Information | Source |\n"
            f"|------|--------|----------------------|--------|\n"
            f"{newline.join(table_rows)}\n\n"
            f"## [IDEA] Analysis (Global-Focused)\n"
            f"{analysis_text}\n\n"
            f"## [BOOK] Sources\n"
            f"{newline.join(source_lines) if source_lines else '- No sources found.'}\n\n"
            f"## 🌐 {cross_label}\n"
            f"{newline.join(cross_lines) if cross_lines else '-'}\n"
        )

    return article


# -----------------------------------------------------------------------------
# Ana Akis
# -----------------------------------------------------------------------------
def main() -> int:
    if not POSTS_FILE.exists():
        logging.error("Post dosyasi bulunamadi: %s", POSTS_FILE)
        return 1

    raw_posts = json.loads(POSTS_FILE.read_text(encoding="utf-8"))
    if isinstance(raw_posts, dict):
        posts = list(raw_posts.values())
    elif isinstance(raw_posts, list):
        posts = raw_posts
    else:
        logging.error("Beklenmeyen JSON yapisi.")
        return 1

    # Arastirma dosyalarini oku
    research_map: dict[str, str] = {}
    all_tr_sources: list[str] = []
    all_en_sources: list[str] = []

    def load_research(directory: Path, source_bucket: list[str]) -> None:
        if not directory.exists():
            return
        for md_file in sorted(directory.glob("*.md")):
            pid = md_file.stem
            content = md_file.read_text(encoding="utf-8")
            research_map[pid] = content
            source_bucket.extend(extract_urls(content))

    load_research(RESEARCH_TR_DIR, all_tr_sources)
    load_research(RESEARCH_EN_DIR, all_en_sources)

    # Benzersiz kaynaklar (sirayi koruyarak)
    all_tr_sources = list(dict.fromkeys(all_tr_sources))
    all_en_sources = list(dict.fromkeys(all_en_sources))

    if not research_map:
        logging.warning("Hic research ciktisi bulunamadi. Makale uretilemiyor.")
        return 0

    # Tematik analiz
    tr_posts = [p for p in posts if p.get("lang") == "tr"]
    en_posts = [p for p in posts if p.get("lang") == "en"]
    common_themes = find_common_themes(tr_posts, en_posts)
    main_topic = pick_main_topic(posts)

    date_str = format_date_tr()
    ARTICLES_DIR.mkdir(parents=True, exist_ok=True)

    # TR makale
    tr_article = compile_article(
        lang="tr",
        posts=posts,
        research_map=research_map,
        all_tr_sources=all_tr_sources,
        all_en_sources=all_en_sources,
        common_themes=common_themes,
        main_topic=main_topic,
        date_str=date_str,
    )
    tr_path = ARTICLES_DIR / f"makale_{date_str}_TR.md"
    tr_path.write_text(tr_article, encoding="utf-8")
    logging.info("Turkce makale kaydedildi: %s", tr_path)

    # EN makale
    en_article = compile_article(
        lang="en",
        posts=posts,
        research_map=research_map,
        all_tr_sources=all_tr_sources,
        all_en_sources=all_en_sources,
        common_themes=common_themes,
        main_topic=main_topic,
        date_str=date_str,
    )
    en_path = ARTICLES_DIR / f"makale_{date_str}_EN.md"
    en_path.write_text(en_article, encoding="utf-8")
    logging.info("English article saved: %s", en_path)

    # Meta JSON
    meta = {
        "topic": main_topic,
        "tr_posts_used": len(tr_posts),
        "en_posts_used": len(en_posts),
        "tr_sources": all_tr_sources,
        "en_sources": all_en_sources,
        "generated_at": datetime.now().isoformat(),
    }
    meta_path = ARTICLES_DIR / f"makale_{date_str}_meta.json"
    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    logging.info("Meta JSON kaydedildi: %s", meta_path)

    return 0


if __name__ == "__main__":
    sys.exit(main())
