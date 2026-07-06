#!/usr/bin/env python3
"""
flow_converter.py
─────────────────
Sentezlenmis makale Markdown'larini Gistify flow/_template.html standardina
gore zengin HTML'e donusturur. Tek dosyada TR/EN dil destegi saglar.

Kullanim:
    python scripts/flow_converter.py data/x_research/articles/makale_2026-07-06_meta.json

veya

    python scripts/flow_converter.py \
        --tr  data/x_research/articles/makale_2026-07-06_TR.md \
        --en  data/x_research/articles/makale_2026-07-06_EN.md \
        --meta data/x_research/articles/makale_2026-07-06_meta.json

Cikti:
    flow/daily-x-research-<slug>-<gun>-<ay>-<yil>.html
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import List, Tuple

# ──────────────────────────────────────────────────────────────────────────────
# 0. Konfigurasyon
# ──────────────────────────────────────────────────────────────────────────────

ROOT = Path(__file__).resolve().parent.parent  # gistify/
TEMPLATE_PATH = ROOT / "flow" / "_template.html"
FLOW_DIR = ROOT / "flow"
META_DIR = ROOT / "data" / "x_research" / "articles"

AYLAR = [
    "ocak", "subat", "mart", "nisan", "mayis", "haziran",
    "temmuz", "agustos", "eylul", "ekim", "kasim", "aralik",
]

TR_MAP = str.maketrans("iIsSgGuUoOcC", "iIsSgGuUoOcC")

# ──────────────────────────────────────────────────────────────────────────────
# 1. Yardimcilar
# ──────────────────────────────────────────────────────────────────────────────


def tr_slug(text: str) -> str:
    """Turkce karakterleri duzelt, kebap-case uret."""
    text = text.translate(TR_MAP)
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)
    text = re.sub(r"[\s_]+", "-", text.strip().lower())
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


def tarih_slug(d: datetime) -> str:
    return f"{d.day}-{AYLAR[d.month - 1]}-{d.year}"


def iso_ts(d: datetime) -> str:
    return d.strftime("%Y-%m-%dT%H:%M:%S+03:00")


def read_file(path: Path) -> str:
    if not path.exists():
        raise FileNotFoundError(f"Dosya bulunamadi: {path}")
    return path.read_text(encoding="utf-8")


# ──────────────────────────────────────────────────────────────────────────────
# 2. Markdown Parser (dis bagimlilik olmadan calisir, istersen `markdown` lib
#    yukluyse onu da dener)
# ──────────────────────────────────────────────────────────────────────────────


class SimpleMarkdown:
    """Basit Markdown → HTML cevirici."""

    TAG_RE = re.compile(r"\*\*(.+?)\*\*")
    IT_RE = re.compile(r"\*(.+?)\*")
    CODE_RE = re.compile(r"`([^`]+)`")
    LINK_RE = re.compile(r"\[(.+?)\]\((.+?)\)")

    def __init__(self, text: str):
        self.lines = text.splitlines()
        self.i = 0
        self.out: List[str] = []

    def parse(self) -> str:
        while self.i < len(self.lines):
            line = self.lines[self.i]
            stripped = line.strip()

            if not stripped:
                self.i += 1
                continue

            if stripped.startswith("# "):
                self._heading(stripped, 1)
            elif stripped.startswith("## "):
                self._heading(stripped, 2)
            elif stripped.startswith("### "):
                self._heading(stripped, 3)
            elif stripped.startswith("| ") and " | " in stripped:
                self._table()
            elif stripped.startswith("> "):
                self._blockquote()
            elif re.match(r"^\d+\.", stripped):
                self._ol()
            elif stripped.startswith(("- ", "* ")):
                self._ul()
            else:
                self._paragraph()

        return "\n".join(self.out)

    # ── inline format ────────────────────────────────────────────────────────
    @staticmethod
    def _inline(text: str) -> str:
        text = SimpleMarkdown.CODE_RE.sub(r"<code>\1</code>", text)
        text = SimpleMarkdown.TAG_RE.sub(r"<strong>\1</strong>", text)
        text = SimpleMarkdown.IT_RE.sub(r"<em>\1</em>", text)
        text = SimpleMarkdown.LINK_RE.sub(r'<a href="\2">\1</a>', text)
        return text

    def _heading(self, stripped: str, level: int):
        content = stripped.lstrip("# ").strip()
        self.out.append(f"<h{level}>{self._inline(content)}</h{level}>")
        self.i += 1

    def _paragraph(self):
        buf: List[str] = []
        while self.i < len(self.lines):
            line = self.lines[self.i]
            if not line.strip():
                break
            if line.strip().startswith(("#", "|", ">", "- ", "* ")):
                break
            if re.match(r"^\d+\.", line.strip()):
                break
            buf.append(line.strip())
            self.i += 1
        if buf:
            self.out.append(f"<p>{self._inline(' '.join(buf))}</p>")

    def _table(self):
        rows: List[List[str]] = []
        while self.i < len(self.lines):
            line = self.lines[self.i].strip()
            if not line.startswith("|"):
                break
            cells = [c.strip() for c in line.strip("|").split("|")]
            rows.append(cells)
            self.i += 1
        if len(rows) < 2:
            return
        # Ikinci satir ayrac satiri mi kontrol et (markdown standardi)
        if set(rows[1]) <= {"", "-", ":", "|"} or all(
            set(c) <= {"-", ":", " "} for c in rows[1]
        ):
            rows.pop(1)
        if not rows:
            return
        html = ['<table>\n<thead>\n<tr>']
        for cell in rows[0]:
            html.append(f"<th>{self._inline(cell)}</th>")
        html.append('</tr>\n</thead>\n<tbody>')
        for row in rows[1:]:
            html.append('<tr>')
            for cell in row:
                html.append(f"<td>{self._inline(cell)}</td>")
            html.append('</tr>')
        html.append('</tbody>\n</table>')
        self.out.append("\n".join(html))

    def _blockquote(self):
        buf: List[str] = []
        while self.i < len(self.lines):
            line = self.lines[self.i]
            if line.strip().startswith("> "):
                buf.append(line.strip()[2:])
                self.i += 1
            elif line.strip() == ">":
                buf.append("")
                self.i += 1
            else:
                break
        if buf:
            self.out.append(f"<blockquote>{self._inline(' '.join(buf))}</blockquote>")

    def _ul(self):
        items: List[str] = []
        while self.i < len(self.lines):
            line = self.lines[self.i]
            stripped = line.strip()
            if stripped.startswith(("- ", "* ")):
                items.append(stripped[2:])
                self.i += 1
            elif stripped == "" or stripped.startswith(("#", "|", ">")):
                break
            else:
                break
        if items:
            lis = "\n".join(f"<li>{self._inline(item)}</li>" for item in items)
            self.out.append(f"<ul>\n{lis}\n</ul>")

    def _ol(self):
        items: List[str] = []
        while self.i < len(self.lines):
            line = self.lines[self.i]
            stripped = line.strip()
            m = re.match(r"^\d+\.\s+(.*)", stripped)
            if m:
                items.append(m.group(1))
                self.i += 1
            elif stripped == "" or stripped.startswith(("#", "|", ">", "- ", "* ")):
                break
            else:
                break
        if items:
            lis = "\n".join(f"<li>{self._inline(item)}</li>" for item in items)
            self.out.append(f"<ol>\n{lis}\n</ol>")


# `markdown` kutuphanesi yukluyse onu tercih et
def md_to_html(text: str) -> str:
    try:
        import markdown as md_lib  # type: ignore
        return md_lib.markdown(text, extensions=["tables", "fenced_code"])
    except Exception:
        return SimpleMarkdown(text).parse()


# ──────────────────────────────────────────────────────────────────────────────
# 3. Section Extractor
# ──────────────────────────────────────────────────────────────────────────────


def extract_sections(md_text: str) -> Tuple[dict, List[dict]]:
    """
    Markdown'i bolumlere ayir.
    Donus: (hero_dict, [section_dict, ...])
    """
    lines = md_text.splitlines()
    sections: List[dict] = []
    hero = {"title": "", "description": ""}

    buf: List[str] = []
    current_title = ""
    current_level = 0

    def flush():
        nonlocal buf, current_title, current_level
        if current_title or buf:
            body = "\n".join(buf).strip()
            sections.append({
                "title": current_title,
                "level": current_level,
                "body_raw": body,
                "body_html": md_to_html(body) if body else "",
            })
        buf = []

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if stripped.startswith("# ") and not hero["title"]:
            hero["title"] = stripped.lstrip("# ").strip()
            i += 1
            # Bir sonraki paragrafi aciklama olarak al
            desc_lines: List[str] = []
            while i < len(lines) and not lines[i].strip().startswith("#"):
                if lines[i].strip():
                    desc_lines.append(lines[i].strip())
                i += 1
            hero["description"] = " ".join(desc_lines)
            continue

        m = re.match(r"^(#{2,3})\s+(.*)", stripped)
        if m:
            flush()
            current_level = len(m.group(1))
            current_title = m.group(2).strip()
            i += 1
            continue

        buf.append(line)
        i += 1

    flush()
    return hero, sections


# ──────────────────────────────────────────────────────────────────────────────
# 4. HTML Builder
# ──────────────────────────────────────────────────────────────────────────────


SECTION_ID_MAP = {
    "onem": ["onem", "onem", "importance", "why", "neden"],
    "bulgular": ["bulgu", "bulgular", "finding", "findings", "ana bulgular"],
    "analiz": ["analiz", "analysis", "degerlendirme", "degerlendirme"],
    "kaynaklar": ["kaynak", "kaynaklar", "source", "sources", "referans", "references"],
    "ozet": ["ozet", "ozet", "summary", "metrik", "metrics"],
    "tablo": ["tablo", "table", "veri", "data"],
    "timeline": ["zaman", "timeline", "takvim", "calendar"],
    "tavsiye": ["tavsiye", "recommendation", "verdict", "sonuc", "sonuc"],
}


def section_id_from_title(title: str) -> str:
    t_lo = title.lower()
    for sid, keywords in SECTION_ID_MAP.items():
        for kw in keywords:
            if kw in t_lo:
                return sid
    return tr_slug(title)[:24] or "sec-bolum"


def section_icon(title: str) -> str:
    t_lo = title.lower()
    if any(k in t_lo for k in ("onem", "onem", "importance", "why")):
        return "[HOT]"
    if any(k in t_lo for k in ("bulgu", "finding", "bulgular")):
        return "[DATA]"
    if any(k in t_lo for k in ("analiz", "analysis")):
        return "[IDEA]"
    if any(k in t_lo for k in ("kaynak", "source", "referans")):
        return "[BOOK]"
    if any(k in t_lo for k in ("ozet", "ozet", "summary")):
        return "[DATA]"
    if any(k in t_lo for k in ("tablo", "table", "veri")):
        return "[LIST]"
    if any(k in t_lo for k in ("zaman", "timeline", "takvim")):
        return "[TIME]️"
    if any(k in t_lo for k in ("tavsiye", "recommendation", "verdict")):
        return "[TARGET]"
    return "▸"


def guess_insight_class(html: str) -> str:
    """Icerikteki anahtar kelimelere gore insight-box sinifi tahmin et."""
    t = html.lower()
    if any(w in t for w in ("risk", "tehlike", "danger", "dusus", "dusus")):
        return "danger"
    if any(w in t for w in ("uyari", "uyari", "warn", "dikkat")):
        return "warn"
    if any(w in t for w in ("firsat", "firsat", "bull", "opportunity", "yukselis", "yukselis")):
        return "bull"
    return ""


def enrich_section_body(body_html: str, section_id: str) -> str:
    """
    Ham HTML'i zenginlestir: paragraflari insight-box'lara donustur,
    tablolara stil ekle, listeleri timeline'a cevir (kaynaklar bolumu).
    """
    # Basit paragraf → insight-box donusumu (tek satirlik vurgu paragraflari)
    # Eger paragraf 'Onemli:', 'Risk:', 'Uyari:', 'Firsat:' ile basliyorsa
    def _insight_repl(m: re.Match) -> str:
        text = m.group(1)
        cls = guess_insight_class(text)
        cls_attr = f' class="{cls}"' if cls else ""
        # Ilk kelimeyi strong yap
        first_word = text.split(":", 1)[0] if ":" in text else "Bilgi"
        rest = text[len(first_word) + 1:].strip() if ":" in text else text
        return f'<div class="insight-box{cls_attr}"><strong>{first_word}:</strong> {rest}</div>'

    # Tablolara class ekle (eger yoksa)
    body_html = re.sub(
        r"<table>(?!.*?class=)",
        '<table class="data-table">',
        body_html,
    )

    # Kaynaklar / Timeline bolumu icin liste → timeline donusumu
    if section_id in ("kaynaklar", "sec-kaynaklar"):
        body_html = _list_to_timeline(body_html)

    return body_html


def _list_to_timeline(html: str) -> str:
    """<ul> listesini .timeline yapisina cevir."""
    # Tum <ul>...</ul> bloklarini timeline'a cevir
    pattern = re.compile(r"<ul>\s*(.*?)\s*</ul>", re.DOTALL)

    def repl(m: re.Match) -> str:
        inner = m.group(1)
        items = re.findall(r"<li>(.*?)</li>", inner, re.DOTALL)
        if not items:
            return m.group(0)
        out_lines = ['<div class="timeline">']
        for item in items:
            item = item.strip()
            cls = ""
            t_lo = item.lower()
            if any(w in t_lo for w in ("risk", "tehlike", "dusus", "dusus", "bear")):
                cls = "bear"
            elif any(w in t_lo for w in ("firsat", "firsat", "yukselis", "yukselis", "bull")):
                cls = "bull"
            elif any(w in t_lo for w in ("uyari", "uyari", "warn")):
                cls = "warn"
            # Tarih deseni ara: 2026-07-06 veya 6 Temmuz 2026
            date_match = re.search(r"(\d{4}-\d{2}-\d{2}|\d{1,2}\s+[A-Za-zcgiosuCGIOSU]+\s+\d{4})", item)
            date_html = f'<div class="timeline-date">{date_match.group(1)}</div>' if date_match else ""
            body_html = re.sub(r"^\d{4}-\d{2}-\d{2}\s*[-–]\s*", "", item)
            body_html = re.sub(r"^\d{1,2}\s+[A-Za-zcgiosuCGIOSU]+\s+\d{4}\s*[-–]\s*", "", body_html)
            out_lines.append(
                f'  <div class="timeline-item {cls}">\n'
                f'    {date_html}\n'
                f'    <div class="timeline-body">{body_html}</div>\n'
                f'  </div>'
            )
        out_lines.append('</div>')
        return "\n".join(out_lines)

    return pattern.sub(repl, html)


def build_sections_html(sections: List[dict], lang: str) -> str:
    """Bir dil icin section HTML'leri uret."""
    parts: List[str] = []
    for sec in sections:
        sid = section_id_from_title(sec["title"])
        icon = section_icon(sec["title"])
        body = enrich_section_body(sec["body_html"], sid)
        if not body:
            body = "<p><em>Bu bolum icin icerik bulunamadi.</em></p>"
        parts.append(
            f'  <section data-lang="{lang}">\n'
            f'    <div class="section-head" id="sec-{sid}">\n'
            f'      <div class="section-head-inner" onclick="toggle(\'sec-{sid}-body\')">\n'
            f'        <h2 class="section-title">{icon} {sec["title"]}</h2>\n'
            f'        <div class="icon">▾</div>\n'
            f'      </div>\n'
            f'      <div class="section-body" id="sec-{sid}-body">\n'
            f'        {body}\n'
            f'      </div>\n'
            f'    </div>\n'
            f'  </section>'
        )
    return "\n\n".join(parts)


def build_hero_html(hero: dict, meta: dict, lang: str) -> str:
    title = hero.get("title") or meta.get("title", "X Research Raporu")
    desc = hero.get("description") or meta.get("description", "")
    raw_date = meta.get("date", datetime.now().strftime("%Y-%m-%d"))
    d = datetime.strptime(raw_date, "%Y-%m-%d")
    date_str = d.strftime("%d %B %Y")
    tags = meta.get("tags", [])
    tag_html = "\n    ".join(
        f'<span class="meta-pill info">🏷️ {t}</span>' for t in tags
    )
    return (
        f'  <div class="hero" id="hero" data-timestamp="{iso_ts(d)}" data-lang="{lang}">\n'
        f'    <h1 class="hero-h">{title}</h1>\n'
        f'    <p class="hero-desc">{desc}</p>\n'
        f'    <div class="hero-meta">\n'
        f'      <span class="meta-pill info">[DATE] {date_str}</span>\n'
        f'    {tag_html}\n'
        f'    </div>\n'
        f'  </div>'
    )


def build_lang_switch() -> str:
    return (
        '  <div class="lang-switch">\n'
        '    <button class="lang-btn active" onclick="setLang(\'tr\',this)">[TR] TR</button>\n'
        '    <button class="lang-btn" onclick="setLang(\'en\',this)">[EN] EN</button>\n'
        '  </div>'
    )


def build_footer(meta: dict) -> str:
    raw_date = meta.get("date", datetime.now().strftime("%Y-%m-%d"))
    d = datetime.strptime(raw_date, "%Y-%m-%d")
    return f'  <div class="footer">Gistify Flow | X Research | {d.strftime("%d %B %Y")}</div>'


# ──────────────────────────────────────────────────────────────────────────────
# 5. Template Splicing
# ──────────────────────────────────────────────────────────────────────────────


def splice_template(template: str, body_content: str, meta: dict) -> str:
    title = meta.get("title", "X Research Raporu")
    og_title = f"{title} | Gistify X Research"
    og_url = f"https://gistify.pro/flow/daily-x-research-{tr_slug(title)}-{tarih_slug(datetime.strptime(meta.get('date', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d'))}.html"

    # title etiketlerini guncelle
    template = re.sub(
        r"<title>.*?</title>",
        f"<title>{og_title}</title>",
        template,
        count=1,
    )
    template = re.sub(
        r'<meta property="og:title" content=".*?"\s*/?>',
        f'<meta property="og:title" content="{og_title}" />',
        template,
        count=1,
    )
    template = re.sub(
        r'<meta property="og:url" content=".*?"\s*/?>',
        f'<meta property="og:url" content="{og_url}" />',
        template,
        count=1,
    )
    template = re.sub(
        r'<meta name="twitter:title" content=".*?"\s*/?>',
        f'<meta name="twitter:title" content="{og_title}" />',
        template,
        count=1,
    )

    # Dil switch JS'yi ekle
    lang_js = """
<script>
function setLang(lang,btn){
  document.querySelectorAll('.lang-btn').forEach(function(b){b.classList.remove('active');});
  btn.classList.add('active');
  document.querySelectorAll('[data-lang]').forEach(function(el){
    if(el.getAttribute('data-lang')===lang){el.classList.add('visible');}
    else{el.classList.remove('visible');}
  });
  document.querySelectorAll('[data-lang-inline]').forEach(function(el){
    if(el.getAttribute('data-lang-inline')===lang){el.classList.add('visible');}
    else{el.classList.remove('visible');}
  });
}
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('[data-lang="tr"]').forEach(function(el){el.classList.add('visible');});
  document.querySelectorAll('[data-lang-inline="tr"]').forEach(function(el){el.classList.add('visible');});
});
</script>
"""
    # </body>'den hemen once lang_js ekle
    template = template.replace("</body>", lang_js + "\n</body>")

    # <body> ile </body> arasini degistir
    # En guvenli yol: <body> sonrasini bul, </html>'e kadar olan kismi degistir
    m_body = re.search(r"(<body[^>]*>)", template, re.IGNORECASE)
    if not m_body:
        raise RuntimeError("Template'de <body> tag'i bulunamadi.")
    head_part = template[: m_body.end()]

    m_html_end = re.search(r"</html>", template, re.IGNORECASE)
    if not m_html_end:
        raise RuntimeError("Template'de </html> tag'i bulunamadi.")
    tail_part = template[m_html_end.start() :]

    return (
        head_part
        + "\n<div class=\"wrap\">\n\n"
        + body_content
        + "\n\n</div>\n"
        + tail_part
    )


# ──────────────────────────────────────────────────────────────────────────────
# 6. Ana Akis
# ──────────────────────────────────────────────────────────────────────────────


def resolve_paths(args) -> Tuple[Path, Path, Path]:
    if args.meta:
        meta_path = Path(args.meta)
        stem = meta_path.stem.replace("_meta", "")
        tr_path = Path(args.tr) if args.tr else meta_path.with_name(f"{stem}_TR.md")
        en_path = Path(args.en) if args.en else meta_path.with_name(f"{stem}_EN.md")
    else:
        raise ValueError("--meta parametresi gerekli.")
    return tr_path, en_path, meta_path


def main():
    parser = argparse.ArgumentParser(description="Markdown → Gistify Flow HTML")
    parser.add_argument("--tr", help="TR markdown dosyasi")
    parser.add_argument("--en", help="EN markdown dosyasi")
    parser.add_argument("--meta", help="Meta JSON dosyasi")
    parser.add_argument("--out", help="Cikti HTML dosyasi (opsiyonel)")
    args = parser.parse_args()

    if not args.meta:
        # Pozisyonel arguman olarak meta json alinsin
        if len(sys.argv) > 1 and not sys.argv[1].startswith("-"):
            args.meta = sys.argv[1]
        else:
            parser.print_help()
            sys.exit(1)

    tr_path, en_path, meta_path = resolve_paths(args)

    # Oku
    meta = json.loads(read_file(meta_path))
    tr_text = read_file(tr_path)
    en_text = read_file(en_path) if en_path.exists() else ""

    # Parse
    hero_tr, sections_tr = extract_sections(tr_text)
    hero_en, sections_en = extract_sections(en_text)

    # Hero birlestir (TR oncelikli)
    hero = {
        "title": hero_tr.get("title") or hero_en.get("title") or meta.get("title", ""),
        "description": hero_tr.get("description") or hero_en.get("description") or meta.get("description", ""),
    }

    # HTML uret
    body_parts: List[str] = []
    body_parts.append(build_lang_switch())
    body_parts.append(build_hero_html(hero, meta, "tr"))
    if hero_en.get("title"):
        body_parts.append(build_hero_html(hero_en, meta, "en"))

    # Section'lari TR/EN olarak yerlestir
    max_sec = max(len(sections_tr), len(sections_en))
    for idx in range(max_sec):
        sec_tr = sections_tr[idx] if idx < len(sections_tr) else None
        sec_en = sections_en[idx] if idx < len(sections_en) else None

        # TR versiyonu
        if sec_tr:
            sid = section_id_from_title(sec_tr["title"])
            icon = section_icon(sec_tr["title"])
            body_tr = enrich_section_body(sec_tr["body_html"], sid)
            if not body_tr:
                body_tr = "<p><em>Bu bolum icin icerik bulunamadi.</em></p>"
            body_parts.append(
                f'  <section data-lang="tr" class="visible">\n'
                f'    <div class="section-head" id="sec-{sid}">\n'
                f'      <div class="section-head-inner" onclick="toggle(\'sec-{sid}-body\')">\n'
                f'        <h2 class="section-title">{icon} {sec_tr["title"]}</h2>\n'
                f'        <div class="icon">▾</div>\n'
                f'      </div>\n'
                f'      <div class="section-body" id="sec-{sid}-body">\n'
                f'        {body_tr}\n'
                f'      </div>\n'
                f'    </div>\n'
                f'  </section>'
            )

        # EN versiyonu (ayni id, farkli baslik)
        if sec_en:
            sid_en = section_id_from_title(sec_en["title"])
            icon_en = section_icon(sec_en["title"])
            body_en = enrich_section_body(sec_en["body_html"], sid_en)
            if not body_en:
                body_en = "<p><em>No content available for this section.</em></p>"
            body_parts.append(
                f'  <section data-lang="en">\n'
                f'    <div class="section-head" id="sec-en-{sid_en}">\n'
                f'      <div class="section-head-inner" onclick="toggle(\'sec-en-{sid_en}-body\')">\n'
                f'        <h2 class="section-title">{icon_en} {sec_en["title"]}</h2>\n'
                f'        <div class="icon">▾</div>\n'
                f'      </div>\n'
                f'      <div class="section-body" id="sec-en-{sid_en}-body">\n'
                f'        {body_en}\n'
                f'      </div>\n'
                f'    </div>\n'
                f'  </section>'
            )

    body_parts.append(build_footer(meta))
    body_html = "\n\n".join(body_parts)

    # Template'i oku ve birlestir
    template = read_file(TEMPLATE_PATH)
    final_html = splice_template(template, body_html, meta)

    # Cikti path'i
    raw_date = meta.get("date", datetime.now().strftime("%Y-%m-%d"))
    d = datetime.strptime(raw_date, "%Y-%m-%d")
    slug = tr_slug(meta.get("slug", meta.get("title", "x-research")))
    out_name = args.out or f"daily-x-research-{slug}-{tarih_slug(d)}.html"
    out_path = FLOW_DIR / out_name

    FLOW_DIR.mkdir(parents=True, exist_ok=True)
    out_path.write_text(final_html, encoding="utf-8")
    print(f"[OK] Flow HTML olusturuldu: {out_path}")
    print(f"[URL] https://gistify.pro/flow/{out_name}")


if __name__ == "__main__":
    main()
