#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gistify Calendar Event Watcher v1.0
===================================
Olay-gudumlu (event-driven) canli makro veri yakalama servisi.

Eski model : 3 sabit pencere (Asia 08:30 / US 16:00 / Final 23:58)
Yeni model : Takvimdeki HER olayin saati bellidir -> o saatte kaynak
             yoklanir, 'actual' duser dusmez yakalanir; JSON, git ve
             X.com post'u saniyeler icinde guncellenir.

Mevcut pipeline ile birebir uyumlu temel garantiler:
  * SADECE 'actual' (+ ek meta: actualCapturedAt, actualSurprise) yazilir.
    forecast / previous / analysis / optionSetups / vixOutlook /
    fearGreedOutlook / marketNarrative alanlarina DOKUNULMAZ.
  * Atomik yazma: .json.tmp -> json validate -> os.replace
  * Veri cekilemezse tahmin/uydurma deger YAZILMAZ.
  * Mevcut Asia/US/Final cron'lari backstop (revizyon + kacak) olarak kalir.

Kullanim:
  python event_watcher.py            # daemon modu (varsayilan)
  python event_watcher.py --plan     # gunun yakalama planini goster ve cik
  python event_watcher.py --once     # tek gecis (5 dk'lik cron ile de kosturulabilir)
  python event_watcher.py --dry-run  # yazma / git push / post uretmeden test
"""

import argparse
import difflib
import json
import logging
import os
import re
import subprocess
import sys
import time as time_mod
from datetime import datetime, timedelta, timezone
from logging.handlers import TimedRotatingFileHandler
from pathlib import Path

# ------------------------------------------------------------------ zaman dilimi
try:
    from zoneinfo import ZoneInfo  # Windows'ta ek olarak: pip install tzdata
    TZ = ZoneInfo("Europe/Istanbul")
except Exception:
    TZ = timezone(timedelta(hours=3))  # TR'de DST yok; sabit GMT+3 guvenli fallback


def now_tr():
    return datetime.now(TZ)


SCRIPT_DIR = Path(__file__).resolve().parent

# ------------------------------------------------------------------ konfigurasyon
DEFAULT_CONFIG = {
    "paths": {
        "calendar_primary": "C:/Users/hasan/OneDrive/Desktop/gistify/client/public/calendar/calendar_forecast.json",
        "calendar_targets": [
            "C:/Users/hasan/OneDrive/Desktop/gistify/client/public/calendar/calendar_forecast.json",
            "C:/Users/hasan/OneDrive/Desktop/calendar/calendar_forecast.json"
        ],
        "status_file": "C:/Users/hasan/OneDrive/Desktop/calendar/watcher_status.json",
        "logs_dir": "C:/Users/hasan/OneDrive/Desktop/calendar/logs"
    },
    "source": {
        "embed_url": ("https://sslecal2.forexprostools.com/?columns=exc_flags,exc_currency,"
                      "exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone"
                      "&countries=25,32,6,37,72,22,17,39,14,10,35,43,56,36,110,11,26,12,4,5"
                      "&calType=day&timeZone=63&lang=1"),
        "http_timeout": 25
    },
    "schedule": {
        "tick_seconds": 30,
        "plan_refresh_minutes": 15,
        "first_check_seconds_after": 15,
        "startup_catchup_minutes": 90,
        "warmup_minutes_before_high": 2,
        "retry_ladder_minutes": {
            "3": [0.25, 0.5, 1, 2, 3, 5, 8, 12, 20, 30, 45],
            "2": [0.5, 2, 5, 10, 20, 35],
            "1": [1, 5, 15, 35]
        }
    },
    "matching": {"fuzzy_enabled": True, "fuzzy_ratio": 0.86},
    "git": {
        "enabled": True,
        "repo_dir": "C:/Users/hasan/OneDrive/Desktop/gistify",
        "add_paths": ["client/public/calendar/calendar_forecast.json"],
        "branch": "main",
        "debounce_minutes": 5,
        "push_immediately_min_importance": 3,
        "cmd_timeout_seconds": 120
    },
    "posts": {
        "enabled": True,
        "templates_path": "C:/Users/hasan/OneDrive/Desktop/gistify/client/public/calendar/TEMPLATES.md",
        "output_dir": "C:/Users/hasan/Documents/kimi/workspace/xcom_posts",
        "min_importance": 2
    },
    "on_exhausted": "leave"  # "leave": alana dokunma | "mark": 'Canli veri alinamadi' yaz
}


def deep_merge(base, override):
    for k, v in override.items():
        if isinstance(v, dict) and isinstance(base.get(k), dict):
            deep_merge(base[k], v)
        else:
            base[k] = v
    return base


def load_config():
    cfg = json.loads(json.dumps(DEFAULT_CONFIG))
    p = SCRIPT_DIR / "watcher_config.json"
    if p.exists():
        try:
            deep_merge(cfg, json.loads(p.read_text(encoding="utf-8")))
        except Exception as e:
            print(f"[UYARI] watcher_config.json okunamadi: {e}", file=sys.stderr)
    return cfg


def setup_logging(cfg):
    log = logging.getLogger("watcher")
    if log.handlers:
        return log
    log.setLevel(logging.INFO)
    fmt = logging.Formatter("[%(asctime)s] [%(levelname)s] %(message)s", "%Y-%m-%d %H:%M:%S")
    sh = logging.StreamHandler(sys.stdout)
    sh.setFormatter(fmt)
    log.addHandler(sh)
    try:
        d = Path(cfg["paths"]["logs_dir"])
        d.mkdir(parents=True, exist_ok=True)
        fh = TimedRotatingFileHandler(d / "event_watcher.log", when="midnight",
                                      backupCount=14, encoding="utf-8")
        fh.setFormatter(fmt)
        log.addHandler(fh)
    except Exception as e:
        log.warning("Log dosyasi acilamadi: %s", e)
    return log


# ------------------------------------------------------------------ yardimcilar
_DASHES = {"-", "\u2014", "\u2013", "\u2010"}
_EMPTY_ACTUAL = {"", "-", "\u2014", "\u2013", "tbd", "n/a", "na",
                 "canlı veri alınamadı", "canli veri alinamadi"}
_TIME_RE = re.compile(r"^([01]?\d|2[0-3]):([0-5]\d)$")


def clean_text(s):
    if s is None:
        return ""
    s = str(s).replace("\xa0", " ").replace("&nbsp;", " ")
    s = re.sub(r"\s+", " ", s).strip()
    return "" if s in _DASHES else s


def norm_text(s):
    return re.sub(r"\s+", " ", str(s or "").strip().lower())


def is_empty_actual(v):
    if v is None:
        return True
    return norm_text(v) in _EMPTY_ACTUAL


def event_key(name, country):
    return (norm_text(name), norm_text(country))


def parse_time_str(t):
    m = _TIME_RE.match(clean_text(t))
    if not m:
        return None
    return int(m.group(1)), int(m.group(2))


def parse_num(v):
    """'250K', '5.3%', '-0.4%', '1,234.5' gibi degerleri float'a cevirir."""
    if v is None:
        return None
    s = str(v).strip().replace("\u2212", "-").replace(",", "")
    m = re.search(r"([+-]?\d+(?:\.\d+)?)\s*([kKmMbB%]?)", s)
    if not m:
        return None
    try:
        val = float(m.group(1))
    except ValueError:
        return None
    mult = {"k": 1e3, "m": 1e6, "b": 1e9}.get(m.group(2).lower(), 1.0)
    return val * mult


def surprise(actual, forecast):
    a, f = parse_num(actual), parse_num(forecast)
    if a is None or f is None:
        return None
    diff = a - f
    if abs(diff) < 1e-12:
        direction = "inline"
    else:
        direction = "above" if diff > 0 else "below"
    pct = round(diff / abs(f) * 100.0, 2) if f != 0 else None
    return {"direction": direction, "diff": round(diff, 4), "pct": pct}


def importance_of(rec):
    v = rec.get("importance")
    if isinstance(v, bool):
        return 2
    if isinstance(v, (int, float)):
        return max(1, min(3, int(v)))
    s = norm_text(v)
    if s in {"3", "high", "yüksek", "yuksek", "***", "critical"}:
        return 3
    if s in {"1", "low", "düşük", "dusuk", "*"}:
        return 1
    return 2


def ladder_for(imp, cfg):
    ladders = cfg["schedule"]["retry_ladder_minutes"]
    return ladders.get(str(int(imp)), ladders["2"])


def latency_seconds(rec):
    tm = parse_time_str(str(rec.get("time", "")))
    if not tm:
        return None
    now = now_tr()
    sched = now.replace(hour=tm[0], minute=tm[1], second=0, microsecond=0)
    return max(0, int((now - sched).total_seconds()))


def _is_today(d, today):
    d = str(d).strip()
    for fmt in ("%Y-%m-%d", "%d.%m.%Y", "%d/%m/%Y", "%Y/%m/%d"):
        try:
            return datetime.strptime(d[:10], fmt).date() == today
        except ValueError:
            continue
    return True  # tarih formati anlasilamadiysa dosya gunluk varsayilir


# ------------------------------------------------------------------ takvim IO
def load_calendar(cfg):
    p = Path(cfg["paths"]["calendar_primary"])
    return json.loads(p.read_text(encoding="utf-8"))


def get_events_list(cal):
    if isinstance(cal, list):
        return cal
    if isinstance(cal, dict):
        for k in ("events", "calendar", "data", "items"):
            v = cal.get(k)
            if isinstance(v, list):
                return v
        for v in cal.values():
            if isinstance(v, list) and v and isinstance(v[0], dict) and "eventName" in v[0]:
                return v
    return None


def atomic_write_all(cal, cfg, log):
    """tmp'ye yaz -> json.loads ile dogrula -> os.replace ile atomik tasi (tum hedeflere)."""
    payload = json.dumps(cal, ensure_ascii=False, indent=2)
    json.loads(payload)  # round-trip validasyon
    written = []
    for target in cfg["paths"]["calendar_targets"]:
        pt = Path(target)
        tmp = pt.with_suffix(pt.suffix + ".tmp")
        try:
            pt.parent.mkdir(parents=True, exist_ok=True)
            tmp.write_text(payload, encoding="utf-8")
            json.loads(tmp.read_text(encoding="utf-8"))  # diskteki kopyayi da dogrula
            os.replace(tmp, pt)
            written.append(str(pt))
        except Exception as e:
            log.error("Yazma hatasi (%s): %s", target, e)
            try:
                tmp.unlink(missing_ok=True)
            except Exception:
                pass
    return written


# ------------------------------------------------------------------ kaynak cekimi
UA_HEADERS = {
    "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                   "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"),
    "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
    "Referer": "https://tr.investing.com/",
}


def _has_exact_class(tag, name):
    return name in (tag.get("class") or [])


def parse_embed_html(html, log):
    """sslecal2 embed tablosunu {time,country,eventName,importance,previous,forecast,actual}
    listesine cevirir. Hucre siniflari degisirse WebBridge fallback devreye girer."""
    try:
        from bs4 import BeautifulSoup
    except ImportError:
        log.error("beautifulsoup4 kurulu degil. Kurulum: pip install -r requirements.txt")
        return []
    soup = BeautifulSoup(html, "html.parser")
    out = []
    for tr in soup.find_all("tr"):
        tds = tr.find_all("td")
        if not tds:
            continue
        ev_td = next((td for td in tds if _has_exact_class(td, "event")), None)
        if ev_td is None:
            continue
        name = clean_text(ev_td.get_text(" "))
        if not name:
            continue

        def cell(cls_name, _tds=tds):
            td = next((t for t in _tds if _has_exact_class(t, cls_name)), None)
            return clean_text(td.get_text(" ")) if td is not None else ""

        t = cell("time") or clean_text(tds[0].get_text(" "))
        country = ""
        flag = tr.find("span", class_=lambda c: bool(c) and "ceFlags" in c)
        if flag is not None:
            country = flag.get("title") or flag.get("data-country") or ""
        if not country:
            country = cell("flagCur")
        imp = 0
        sent = next((td for td in tds if _has_exact_class(td, "sentiment")), None)
        if sent is not None:
            imp = len(sent.find_all("i", class_=lambda c: bool(c) and "FullBullish" in c))
            m = re.search(r"bull(\d)", sent.get("data-img_key") or "")
            if m:
                imp = int(m.group(1))
        out.append({
            "time": t,
            "country": clean_text(country),
            "eventName": name,
            "importance": imp,
            "actual": cell("act"),
            "forecast": cell("fore"),
            "previous": cell("prev"),
        })
    return out


def fetch_and_parse(cfg, log):
    """Once hafif yol (dogrudan HTTP GET), olmazsa opsiyonel WebBridge adaptoru."""
    url = cfg["source"]["embed_url"]
    html = None
    try:
        import requests
        r = requests.get(url, headers=UA_HEADERS, timeout=cfg["source"]["http_timeout"])
        if r.status_code == 200 and len(r.text or "") > 500:
            html = r.text
        else:
            log.warning("Dogrudan cekim HTTP %s (uzunluk=%s)", r.status_code, len(r.text or ""))
    except Exception as e:
        log.warning("Dogrudan cekim hatasi: %s", e)
    if html:
        ev = parse_embed_html(html, log)
        if ev:
            return ev, "direct"
        log.warning("Sayfa alindi ama satir cikarilamadi - WebBridge adaptoru deneniyor")
    try:
        import webbridge_adapter  # kullanici saglarsa devreye girer (ornek dosyaya bakin)
        html = webbridge_adapter.fetch_calendar_html(url)
        if html:
            ev = parse_embed_html(html, log)
            if ev:
                return ev, "webbridge"
    except ImportError:
        pass
    except Exception as e:
        log.warning("WebBridge adaptoru hatasi: %s", e)
    return [], None


# ------------------------------------------------------------------ eslestirme
PROTECTED_FIELDS = ("forecast", "previous", "analysis", "optionSetups",
                    "vixOutlook", "fearGreedOutlook", "marketNarrative")

# Embed bazen olay adina milliyet oneki ekler ("German Factory Orders" vs
# JSON'daki "Factory Orders"). Bu tokenlar cikarilarak ikinci bir eslesme
# denenir; ulke zaten ayri alanda eslestigi icin bilgi kaybi olmaz.
_NATIONALITY_TOKENS = {
    "german", "french", "italian", "spanish", "british", "uk", "u.k.",
    "us", "u.s.", "american", "chinese", "japanese", "swiss", "australian",
    "canadian", "russian", "brazilian", "indian", "turkish", "korean",
    "mexican", "eurozone", "euro-zone",
}


def strip_nationality(name_norm):
    toks = [t for t in name_norm.split(" ") if t not in _NATIONALITY_TOKENS]
    return " ".join(toks) or name_norm


def apply_updates(cal, scraped, cfg, log):
    """Kaynaktan gelen actual degerlerini JSON kayitlariyla eslestirir.
    SADECE actual + actualCapturedAt + actualSurprise yazilir; korunan alanlara dokunulmaz."""
    evs = get_events_list(cal)
    if evs is None:
        raise ValueError("calendar_forecast.json icinde olay listesi bulunamadi")
    index, stripped_index, by_country = {}, {}, {}
    for rec in evs:
        k = event_key(rec.get("eventName"), rec.get("country"))
        index[k] = rec
        by_country.setdefault(k[1], []).append(rec)
        sk = (strip_nationality(k[0]), k[1])
        # ayni onek-siz ada birden fazla kayit dusuyorsa belirsizdir, kullanma
        stripped_index[sk] = None if sk in stripped_index else rec

    updated, unmatched = [], []
    now_iso = now_tr().isoformat(timespec="seconds")
    for s in scraped:
        if is_empty_actual(s.get("actual")):
            continue
        if not s.get("eventName") or not s.get("country"):
            continue
        k = event_key(s["eventName"], s["country"])
        rec = index.get(k)
        if rec is None:  # 2. kademe: milliyet oneki temizlenmis exact eslesme
            rec = stripped_index.get((strip_nationality(k[0]), k[1]))
            if rec is not None:
                log.info("ONEKSIZ eslesme: '%s' -> '%s' [%s]",
                         s["eventName"], rec.get("eventName"), s["country"])
        if rec is None and cfg["matching"]["fuzzy_enabled"]:
            # 3. kademe: korumali fuzzy (ilk kelime ayni degilse >=0.93 sart —
            # CPI/PPI gibi tek harf farkli serilerin karismasini engeller)
            s_stripped = strip_nationality(k[0])
            best, best_r = None, 0.0
            for c in by_country.get(k[1], []):
                c_stripped = strip_nationality(norm_text(c.get("eventName")))
                r = difflib.SequenceMatcher(None, c_stripped, s_stripped).ratio()
                if r > best_r:
                    best, best_r = c, r
            if best is not None and best_r >= cfg["matching"]["fuzzy_ratio"]:
                b_stripped = strip_nationality(norm_text(best.get("eventName")))
                same_head = (b_stripped.split(" ")[0] == s_stripped.split(" ")[0])
                if same_head or best_r >= 0.93:
                    rec = best
                    log.info("FUZZY eslesme (%.2f): '%s' -> '%s' [%s]",
                             best_r, s["eventName"], best.get("eventName"), s["country"])
        if rec is None:
            unmatched.append(s)
            continue
        old = rec.get("actual")
        if not is_empty_actual(old) and norm_text(old) == norm_text(s["actual"]):
            continue  # zaten ayni deger
        revision = not is_empty_actual(old)
        rec["actual"] = s["actual"]
        rec["actualCapturedAt"] = now_iso
        sp = surprise(s["actual"], rec.get("forecast"))
        if sp:
            rec["actualSurprise"] = sp
        updated.append({"rec": rec, "revision": revision})
        log.info("%s | %s / %s : %s -> %s (beklenti: %s)",
                 "REVIZYON" if revision else "YAKALANDI",
                 rec.get("country"), rec.get("eventName"), old, s["actual"], rec.get("forecast"))
    if unmatched:
        log.info("Eslesmeyen %d olay (actual dolu ama JSON'da karsiligi yok): %s",
                 len(unmatched),
                 "; ".join(f"{u['country']}/{u['eventName']}" for u in unmatched[:6]))
    return updated


# ------------------------------------------------------------------ plan
def build_plan(cal, cfg, now, prev=None, log=None):
    """Gunun actual bekleyen olaylarini saat gruplarina boler; deneme takvimi kurar."""
    evs = get_events_list(cal) or []
    groups = {}
    today = now.date()
    for rec in evs:
        if not is_empty_actual(rec.get("actual")):
            continue
        d = rec.get("date")
        if d and not _is_today(d, today):
            continue
        tm = parse_time_str(str(rec.get("time", "")))
        if tm is None:
            continue  # 'All Day' / 'Tentative' vb. backstop cron'lara kalir
        hh, mm = tm
        gk = f"{hh:02d}:{mm:02d}"
        g = groups.get(gk)
        if g is None:
            g = groups[gk] = {
                "when": now.replace(hour=hh, minute=mm, second=0, microsecond=0),
                "keys": [], "imp": 1, "attempts": 0,
                "status": "pending", "next_try": None, "warmup_done": False,
            }
        g["keys"].append(event_key(rec.get("eventName"), rec.get("country")))
        g["imp"] = max(g["imp"], importance_of(rec))

    lead = timedelta(seconds=cfg["schedule"]["first_check_seconds_after"])
    grace = timedelta(minutes=cfg["schedule"]["startup_catchup_minutes"])
    for gk, g in groups.items():
        ladder = ladder_for(g["imp"], cfg)
        window_end = g["when"] + timedelta(minutes=ladder[-1])
        if now <= g["when"]:
            g["next_try"] = g["when"] + lead
        elif now <= window_end:
            g["attempts"] = sum(1 for m in ladder if g["when"] + timedelta(minutes=m) <= now)
            g["next_try"] = now
        elif now <= g["when"] + grace:
            g["attempts"] = max(0, len(ladder) - 1)  # tek catch-up denemesi
            g["next_try"] = now
        else:
            g["status"] = "expired"

    if prev:  # plan yenilenirken onceki durumu tasi
        for gk, g in groups.items():
            pg = prev.get(gk)
            if not pg:
                continue
            if pg["status"] == "exhausted" and set(g["keys"]) <= set(pg.get("keys", [])):
                g["status"] = "exhausted"
                g["attempts"] = pg["attempts"]
            elif pg["status"] == "pending":
                g["attempts"] = max(g["attempts"], pg["attempts"])
                if pg.get("next_try"):
                    g["next_try"] = pg["next_try"]
                g["warmup_done"] = pg.get("warmup_done", False)
    return groups


def refresh_group_completion(plan, cal, log=None):
    evs = get_events_list(cal) or []
    amap = {event_key(r.get("eventName"), r.get("country")): r.get("actual") for r in evs}
    for gk, g in plan.items():
        if g["status"] != "pending":
            continue
        remaining = [k for k in g["keys"] if k in amap and is_empty_actual(amap[k])]
        g["keys"] = remaining
        if not remaining:
            g["status"] = "done"
            if log:
                log.info("Grup %s tamamlandi (tum actual degerler yakalandi)", gk)


def _mark_unavailable(group, cfg, state, log):
    try:
        cal = load_calendar(cfg)
        evs = get_events_list(cal) or []
        keys = set(group["keys"])
        marked = 0
        for r in evs:
            if event_key(r.get("eventName"), r.get("country")) in keys and is_empty_actual(r.get("actual")):
                r["actual"] = "Canlı veri alınamadı"
                r["actualCapturedAt"] = now_tr().isoformat(timespec="seconds")
                marked += 1
        if marked:
            atomic_write_all(cal, cfg, log)
            state["dirty"] = True
            state["dirty_since"] = state.get("dirty_since") or now_tr()
            log.info("%d olay 'Canlı veri alınamadı' olarak isaretlendi", marked)
    except Exception as e:
        log.error("Isaretleme hatasi: %s", e)


# ------------------------------------------------------------------ yakalama dongusu
def capture_cycle(due, plan, cfg, state, log, dry=False):
    now = now_tr()
    scraped, src = fetch_and_parse(cfg, log)
    if scraped:
        filled = sum(1 for s in scraped if not is_empty_actual(s.get("actual")))
        log.info("Kaynak (%s): %d satir, %d tanesinde actual dolu", src, len(scraped), filled)
    else:
        log.warning("Kaynaktan satir alinamadi - deneme merdiveni ilerletiliyor")

    cal = None
    try:
        cal = load_calendar(cfg)  # her denemede taze oku (backstop cron yazmis olabilir)
    except Exception as e:
        log.error("calendar_forecast.json okunamadi: %s", e)

    updated = []
    if cal is not None and scraped:
        try:
            updated = apply_updates(cal, scraped, cfg, log)
        except Exception as e:
            log.error("Eslestirme hatasi: %s", e)
        if updated and not dry:
            written = atomic_write_all(cal, cfg, log)
            log.info("Atomik yazma: %d hedef guncellendi", len(written))
            try:
                write_posts(updated, cfg, log)
            except Exception as e:
                log.error("X.com post uretim hatasi (senkronizasyon etkilenmedi): %s", e)
            state["dirty"] = True
            state["dirty_since"] = state.get("dirty_since") or now
            if any(importance_of(u["rec"]) >= cfg["git"]["push_immediately_min_importance"]
                   for u in updated):
                state["dirty_high"] = True
            for u in updated:
                r = u["rec"]
                state["recent"].append({
                    "at": now.isoformat(timespec="seconds"),
                    "event": r.get("eventName"),
                    "country": r.get("country"),
                    "actual": r.get("actual"),
                    "forecast": r.get("forecast"),
                    "surprise": r.get("actualSurprise"),
                    "latencySec": latency_seconds(r),
                    "revision": u["revision"],
                })
            state["recent"] = state["recent"][-100:]
        elif updated and dry:
            log.info("[DRY-RUN] %d guncelleme diske YAZILMADI", len(updated))

    if cal is not None:
        refresh_group_completion(plan, cal, log)

    # deneme merdivenini ilerlet
    for gk in due:
        g = plan.get(gk)
        if not g or g["status"] != "pending":
            continue
        ladder = ladder_for(g["imp"], cfg)
        g["attempts"] += 1
        if g["attempts"] >= len(ladder):
            g["status"] = "exhausted"
            log.warning("Grup %s: %d deneme sonunda %d olayin actual'i gelmedi - "
                        "backstop cron'lara birakildi", gk, g["attempts"], len(g["keys"]))
            if cfg.get("on_exhausted") == "mark" and not dry:
                _mark_unavailable(g, cfg, state, log)
        else:
            nxt = g["when"] + timedelta(minutes=ladder[g["attempts"]])
            g["next_try"] = max(nxt, now + timedelta(seconds=5))
    return updated


# ------------------------------------------------------------------ git
def git_push(cfg, log, msg):
    g = cfg["git"]
    if not g.get("enabled"):
        return True

    def run(*args):
        return subprocess.run(["git", *args], cwd=g["repo_dir"],
                              capture_output=True, text=True,
                              timeout=g["cmd_timeout_seconds"])

    try:
        run("add", *g["add_paths"])
        if run("diff", "--cached", "--quiet").returncode == 0:
            log.info("Git: staged degisiklik yok, push atlandi")
            return True
        c = run("commit", "-m", msg)
        if c.returncode != 0:
            log.error("Git commit hatasi: %s", (c.stderr or c.stdout).strip())
            return False
        p = run("push", "origin", g["branch"])
        if p.returncode != 0:
            log.error("Git push hatasi: %s", (p.stderr or p.stdout).strip())
            return False
        log.info("Git push OK: %s", msg)
        return True
    except Exception as e:
        log.error("Git istisnasi: %s", e)
        return False


def maybe_push(cfg, state, log, force=False):
    """Debounce'lu push: yuksek onemli veri aninda, digerleri toplu gider."""
    if not state.get("dirty"):
        return
    now = now_tr()
    debounce = timedelta(minutes=cfg["git"]["debounce_minutes"])
    due = force or state.get("dirty_high") or \
        (state.get("dirty_since") and now - state["dirty_since"] >= debounce)
    if not due:
        return
    msg = f"calendar: live update {now:%Y%m%d %H:%M} (event watcher)"
    if git_push(cfg, log, msg):
        state["dirty"] = False
        state["dirty_high"] = False
        state["dirty_since"] = None
        state["last_push"] = now.isoformat(timespec="seconds")


# ------------------------------------------------------------------ X.com post
DEFAULT_TEMPLATE = """\U0001F4CA {{COUNTRY}} \u2014 {{EVENT_NAME}}
A\u00e7\u0131klanan: {{ACTUAL}} | Beklenti: {{FORECAST}} | \u00d6nceki: {{PREVIOUS}}
Sapma: {{DEVIATION}} ({{DIRECTION}})
\u23F1 {{CAPTURED_AT}} GMT+3 | \u00d6nem: {{IMPORTANCE}}/3
#macro #ekonomiktakvim"""

_DIR_TR = {"above": "beklenti \u00fcst\u00fc", "below": "beklenti alt\u0131",
           "inline": "beklentiye paralel"}


def load_template(cfg):
    p = Path(cfg["posts"]["templates_path"])
    if p.exists():
        try:
            txt = p.read_text(encoding="utf-8")
            for block in re.findall(r"```(?:\w+)?\n(.*?)```", txt, flags=re.S):
                if "{{ACTUAL}}" in block:
                    return block.strip()
            if "{{ACTUAL}}" in txt:
                for part in re.split(r"\n(?=#)", txt):
                    if "{{ACTUAL}}" in part:
                        return part.strip()
        except Exception:
            pass
    return DEFAULT_TEMPLATE


def render_post(tpl, rec):
    sp = rec.get("actualSurprise") or {}
    dev = f"{sp['pct']:+.2f}%" if sp.get("pct") is not None else "n/a"
    rep = {
        "{{EVENT_NAME}}": str(rec.get("eventName", "")),
        "{{COUNTRY}}": str(rec.get("country", "")),
        "{{ACTUAL}}": str(rec.get("actual", "")),
        "{{FORECAST}}": str(rec.get("forecast", "N/A")),
        "{{PREVIOUS}}": str(rec.get("previous", "N/A")),
        "{{DEVIATION}}": dev,
        "{{DIRECTION}}": _DIR_TR.get(sp.get("direction", ""), "n/a"),
        "{{IMPORTANCE}}": str(importance_of(rec)),
        "{{CAPTURED_AT}}": str(rec.get("actualCapturedAt", "")),
    }
    out = tpl
    for k, v in rep.items():
        out = out.replace(k, v)
    return out


def write_posts(updated, cfg, log):
    if not cfg["posts"]["enabled"]:
        return
    picks = [u["rec"] for u in updated
             if importance_of(u["rec"]) >= cfg["posts"]["min_importance"]]
    if not picks:
        return
    tpl = load_template(cfg)
    now = now_tr()
    outdir = Path(cfg["posts"]["output_dir"]) / now.strftime("%Y-%m-%d")
    outdir.mkdir(parents=True, exist_ok=True)
    body = "\n\n---\n\n".join(render_post(tpl, r) for r in picks)
    fm = (f"---\ngenerated_at: {now.isoformat(timespec='seconds')}\n"
          f"source: event_watcher\nevents: {len(picks)}\n---\n\n")
    f = outdir / f"live_{now:%H%M%S}.md"
    f.write_text(fm + body + "\n", encoding="utf-8")
    log.info("X.com post yazildi: %s (%d olay)", f, len(picks))


# ------------------------------------------------------------------ durum dosyasi
def write_status(cfg, plan, state, log):
    """UI ve monitoring icin canli durum: siradaki olay, grup durumlari, son yakalamalar."""
    now = now_tr()
    next_event = None
    for gk in sorted(plan):
        g = plan[gk]
        if g["status"] == "pending" and g["when"] >= now:
            next_event = {"time": gk, "events": len(g["keys"]), "importance": g["imp"]}
            break
    st = {
        "updatedAt": now.isoformat(timespec="seconds"),
        "pid": os.getpid(),
        "date": now.strftime("%Y-%m-%d"),
        "nextEvent": next_event,
        "groups": [
            {
                "time": gk,
                "events": len(g["keys"]),
                "importance": g["imp"],
                "status": g["status"],
                "attempts": g["attempts"],
                "nextTry": (g["next_try"].isoformat(timespec="seconds")
                            if g.get("next_try") and g["status"] == "pending" else None),
            }
            for gk, g in sorted(plan.items())
        ],
        "recentCaptures": state["recent"][-20:],
        "git": {"pendingPush": bool(state.get("dirty")), "lastPush": state.get("last_push")},
    }
    try:
        p = Path(cfg["paths"]["status_file"])
        p.parent.mkdir(parents=True, exist_ok=True)
        tmp = p.with_suffix(".tmp")
        tmp.write_text(json.dumps(st, ensure_ascii=False, indent=2), encoding="utf-8")
        os.replace(tmp, p)
    except Exception as e:
        log.warning("Status dosyasi yazilamadi: %s", e)


# ------------------------------------------------------------------ isinma & uyku
def do_warmups(plan, cfg, log, now):
    """Yuksek onemli olaydan N dk once kaynak erisilebilirligini test eder."""
    wm = cfg["schedule"]["warmup_minutes_before_high"]
    if wm <= 0:
        return
    for gk, g in plan.items():
        if g["status"] != "pending" or g["imp"] < 3 or g["warmup_done"]:
            continue
        if g["when"] - timedelta(minutes=wm) <= now < g["when"]:
            g["warmup_done"] = True
            ev, src = fetch_and_parse(cfg, log)
            if ev:
                log.info("Isinma OK (%s): %s yuksek onemli grubu oncesi kaynak erisilebilir",
                         src, gk)
            else:
                log.warning("Isinma BASARISIZ: %s grubu oncesi kaynaga erisilemiyor! "
                            "Ag/WebBridge kontrol edin", gk)


def next_wakeup(plan, cfg, now):
    cands = []
    wm = timedelta(minutes=cfg["schedule"]["warmup_minutes_before_high"])
    for g in plan.values():
        if g["status"] != "pending":
            continue
        if g.get("next_try"):
            cands.append(g["next_try"])
        if g["imp"] >= 3 and not g["warmup_done"] and g["when"] - wm > now:
            cands.append(g["when"] - wm)
    if not cands:
        return now + timedelta(seconds=cfg["schedule"]["tick_seconds"])
    return min(cands)


# ------------------------------------------------------------------ calisma modlari
def run_daemon(cfg, log, dry=False):
    log.info("Event Watcher basladi (pid=%s, dry=%s, tz=%s)", os.getpid(), dry, TZ)
    state = {"dirty": False, "dirty_high": False, "dirty_since": None,
             "last_push": None, "recent": []}
    plan, plan_date, plan_built, last_status = {}, None, None, None
    while True:
        try:
            now = now_tr()
            stale = (plan_built is None or plan_date != now.date() or
                     (now - plan_built) >= timedelta(minutes=cfg["schedule"]["plan_refresh_minutes"]))
            if stale:
                if plan_date and plan_date != now.date() and not dry:
                    maybe_push(cfg, state, log, force=True)  # gun devri: bekleyeni gonder
                try:
                    cal = load_calendar(cfg)
                    prev = plan if plan_date == now.date() else None
                    plan = build_plan(cal, cfg, now, prev=prev, log=log)
                    plan_date, plan_built = now.date(), now
                    pend = sum(1 for g in plan.values() if g["status"] == "pending")
                    log.info("Plan yenilendi: %d saat grubu (%d bekliyor)", len(plan), pend)
                except Exception as e:
                    log.error("Plan kurulamadi: %s", e)

            do_warmups(plan, cfg, log, now)

            due = [gk for gk, g in plan.items()
                   if g["status"] == "pending" and g.get("next_try") and g["next_try"] <= now]
            if due:
                log.info("Yoklama vadesi gelen gruplar: %s", ", ".join(sorted(due)))
                capture_cycle(due, plan, cfg, state, log, dry=dry)

            if not dry:
                maybe_push(cfg, state, log)

            if last_status is None or (now_tr() - last_status).total_seconds() >= 30:
                write_status(cfg, plan, state, log)
                last_status = now_tr()

            wake = next_wakeup(plan, cfg, now_tr())
            sleep_s = (wake - now_tr()).total_seconds()
            time_mod.sleep(max(3.0, min(sleep_s, float(cfg["schedule"]["tick_seconds"]))))
        except KeyboardInterrupt:
            log.info("Durduruluyor - bekleyen degisiklikler push ediliyor")
            if not dry:
                maybe_push(cfg, state, log, force=True)
            return
        except Exception as e:
            log.exception("Dongu hatasi: %s", e)
            time_mod.sleep(10)


def run_once(cfg, log, dry=False):
    """Tek gecis: mevcut cron altyapisiyla (or. 5 dk'da bir) da calistirilabilir."""
    now = now_tr()
    cal = load_calendar(cfg)
    plan = build_plan(cal, cfg, now, log=log)
    due = [gk for gk, g in plan.items()
           if g["status"] == "pending" and g.get("next_try") and g["next_try"] <= now]
    state = {"dirty": False, "dirty_high": False, "dirty_since": None,
             "last_push": None, "recent": []}
    if not due:
        log.info("Vadesi gelmis grup yok - yine de firsatci tek yoklama yapiliyor")
    updated = capture_cycle(due, plan, cfg, state, log, dry=dry)
    if not dry:
        maybe_push(cfg, state, log, force=bool(updated))
        write_status(cfg, plan, state, log)
    log.info("Tek gecis tamamlandi: %d guncelleme", len(updated))


def print_plan(cfg, log):
    now = now_tr()
    try:
        cal = load_calendar(cfg)
    except Exception as e:
        print(f"HATA: takvim okunamadi: {e}")
        return
    plan = build_plan(cal, cfg, now)
    print(f"\nBugunun yakalama plani ({now:%Y-%m-%d %H:%M}, GMT+3):\n")
    if not plan:
        print("  (actual bekleyen zamanli olay yok)\n")
        return
    for gk in sorted(plan):
        g = plan[gk]
        nt = g["next_try"].strftime("%H:%M:%S") if g.get("next_try") else "-"
        print(f"  {gk}  | {len(g['keys']):2d} olay | onem {g['imp']} | "
              f"durum: {g['status']:<9} | ilk/sonraki deneme: {nt}")
    print()


def main():
    ap = argparse.ArgumentParser(description="Gistify Calendar Event Watcher")
    ap.add_argument("--once", action="store_true", help="tek gecis yap ve cik")
    ap.add_argument("--plan", action="store_true", help="gunun yakalama planini goster ve cik")
    ap.add_argument("--dry-run", action="store_true", help="yazma / git push / post uretme")
    args = ap.parse_args()
    cfg = load_config()
    log = setup_logging(cfg)
    if args.plan:
        print_plan(cfg, log)
        return
    if args.once:
        run_once(cfg, log, dry=args.dry_run)
        return
    run_daemon(cfg, log, dry=args.dry_run)


if __name__ == "__main__":
    main()
