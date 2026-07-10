#!/usr/bin/env python3
"""
weekly_market_data.py
---------------------
/gistweekly skill'inin teknik-analiz veri katmani. Verilen ticker listesi icin
Yahoo Finance'ten (scripts/yahoo_market_data.py uzerinden) gunluk/haftalik
barlari ceker ve her ticker icin HESAPLANMIS teknik ozet uretir:

    haftalik OHLC + degisim, 4 haftalik degisim, SMA20/50/200 durumu,
    RSI(14), 52 hafta high/low mesafesi, klasik pivot seviyeleri (P/R1/S1/R2/S2),
    son 20/60 gunun swing high/low'lari, hacim (son hafta vs 20g ortalama).

Sayilar Claude tarafindan UYDURULMAZ; bu script gercek fiyat verisinden
hesaplar. Yahoo'dan veri gelmeyen ticker JSON'da "error" alaniyla isaretlenir
-> raporda o ticker icin teknik bolum "veri yok" olarak durustce yazilir.

Kullanim:
    python scripts/weekly_market_data.py AVGO NVDA MSFT
    python scripts/weekly_market_data.py AVGO NVDA --end 2026-07-10

Cikti:
    data/weekly_research/weekly-{end}.json
    stdout'a ticker basina tek satirlik ozet tablo.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from yahoo_market_data import fetch_yahoo_bars, fetch_yahoo_quotes  # noqa: E402

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_ROOT = BASE_DIR / "data" / "weekly_research"


def sma(closes: list[float], length: int) -> float | None:
    if len(closes) < length:
        return None
    return sum(closes[-length:]) / length


def rsi14(closes: list[float]) -> float | None:
    period = 14
    if len(closes) < period + 1:
        return None
    gains, losses = [], []
    for i in range(1, len(closes)):
        delta = closes[i] - closes[i - 1]
        gains.append(max(delta, 0.0))
        losses.append(max(-delta, 0.0))
    avg_gain = sum(gains[:period]) / period
    avg_loss = sum(losses[:period]) / period
    for i in range(period, len(gains)):
        avg_gain = (avg_gain * (period - 1) + gains[i]) / period
        avg_loss = (avg_loss * (period - 1) + losses[i]) / period
    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    return 100.0 - (100.0 / (1.0 + rs))


def pct(a: float, b: float) -> float | None:
    if not b:
        return None
    return round((a - b) / b * 100.0, 2)


def round_or_none(value: float | None, digits: int = 2) -> float | None:
    return None if value is None else round(value, digits)


def analyze_symbol(
    bars: dict[str, list[dict]], quote: dict | None, end_date: dt.date
) -> dict:
    daily = [b for b in bars.get("daily", []) if dt.date.fromtimestamp(b["t"]) <= end_date]
    weekly = [b for b in bars.get("weekly", []) if dt.date.fromtimestamp(b["t"]) - dt.timedelta(days=6) <= end_date]
    if not daily or not weekly:
        return {"error": "no bars from yahoo"}

    closes = [b["c"] for b in daily]
    last = daily[-1]
    this_week = weekly[-1]
    prev_week = weekly[-2] if len(weekly) >= 2 else None
    week4_ago = weekly[-5] if len(weekly) >= 5 else None

    sma20 = sma(closes, 20)
    sma50 = sma(closes, 50)
    sma200 = sma(closes, 200)
    rsi = rsi14(closes)

    # klasik pivot: bu haftanin HLC'sinden GELECEK haftanin seviyeleri
    p = (this_week["h"] + this_week["l"] + this_week["c"]) / 3.0
    r1 = 2 * p - this_week["l"]
    s1 = 2 * p - this_week["h"]
    r2 = p + (this_week["h"] - this_week["l"])
    s2 = p - (this_week["h"] - this_week["l"])

    last20 = daily[-20:]
    last60 = daily[-60:]
    vol20 = sum(b["v"] for b in last20) / len(last20) if last20 else None
    week_vol_avg = this_week["v"] / 5.0 if this_week.get("v") else None

    out = {
        "asOf": dt.date.fromtimestamp(last["t"]).isoformat(),
        "close": round(last["c"], 2),
        "week": {
            "open": round(this_week["o"], 2),
            "high": round(this_week["h"], 2),
            "low": round(this_week["l"], 2),
            "close": round(this_week["c"], 2),
            "changePct": pct(this_week["c"], prev_week["c"]) if prev_week else None,
        },
        "prevWeekChangePct": (
            pct(prev_week["c"], weekly[-3]["c"]) if len(weekly) >= 3 else None
        ),
        "fourWeekChangePct": pct(this_week["c"], week4_ago["c"]) if week4_ago else None,
        "sma": {
            "sma20": round_or_none(sma20),
            "sma50": round_or_none(sma50),
            "sma200": round_or_none(sma200),
            "aboveSma20": None if sma20 is None else last["c"] > sma20,
            "aboveSma50": None if sma50 is None else last["c"] > sma50,
            "aboveSma200": None if sma200 is None else last["c"] > sma200,
        },
        "rsi14": round_or_none(rsi, 1),
        "pivot": {
            "p": round(p, 2),
            "r1": round(r1, 2),
            "r2": round(r2, 2),
            "s1": round(s1, 2),
            "s2": round(s2, 2),
        },
        "swing": {
            "high20d": round(max(b["h"] for b in last20), 2) if last20 else None,
            "low20d": round(min(b["l"] for b in last20), 2) if last20 else None,
            "high60d": round(max(b["h"] for b in last60), 2) if last60 else None,
            "low60d": round(min(b["l"] for b in last60), 2) if last60 else None,
        },
        "volume": {
            "weekDailyAvg": round(week_vol_avg) if week_vol_avg else None,
            "avg20d": round(vol20) if vol20 else None,
            "ratio": (
                round(week_vol_avg / vol20, 2) if week_vol_avg and vol20 else None
            ),
        },
    }

    if quote:
        w52h = quote.get("week52_high")
        w52l = quote.get("week52_low")
        out["week52"] = {
            "high": w52h,
            "low": w52l,
            "pctFromHigh": pct(last["c"], w52h) if w52h else None,
            "pctFromLow": pct(last["c"], w52l) if w52l else None,
        }

    return out


def main() -> int:
    parser = argparse.ArgumentParser(description="Weekly technical data for /gistweekly")
    parser.add_argument("tickers", nargs="+", help="ticker symbols (e.g. AVGO NVDA)")
    parser.add_argument(
        "--end",
        default=None,
        help="week-end date YYYY-MM-DD (default: today); bars after this date are ignored",
    )
    args = parser.parse_args()

    end_date = (
        dt.date.fromisoformat(args.end) if args.end else dt.date.today()
    )
    symbols = sorted({t.upper() for t in args.tickers})

    print(f"[INFO] fetching {len(symbols)} symbols, week ending {end_date}", file=sys.stderr)
    bars = fetch_yahoo_bars(symbols, period="1y")
    quotes = fetch_yahoo_quotes(symbols)

    result: dict[str, dict] = {}
    for symbol in symbols:
        if symbol in bars:
            result[symbol] = analyze_symbol(bars[symbol], quotes.get(symbol), end_date)
        else:
            result[symbol] = {"error": "no bars from yahoo"}

    payload = {
        "generatedAt": dt.datetime.now().isoformat(timespec="seconds"),
        "weekEnd": end_date.isoformat(),
        "tickers": result,
    }

    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    out_path = OUTPUT_ROOT / f"weekly-{end_date.isoformat()}.json"
    out_path.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    for symbol, data in result.items():
        if "error" in data:
            print(f"{symbol:8s} !! {data['error']}")
            continue
        week = data["week"]
        print(
            f"{symbol:8s} close {data['close']:>10.2f}  wk {week['changePct'] if week['changePct'] is not None else '—':>7}%  "
            f"rsi {data['rsi14'] if data['rsi14'] is not None else '—':>5}  "
            f"sma50 {'^' if data['sma']['aboveSma50'] else 'v' if data['sma']['aboveSma50'] is not None else '?'}  "
            f"sma200 {'^' if data['sma']['aboveSma200'] else 'v' if data['sma']['aboveSma200'] is not None else '?'}"
        )

    print(f"[OK] {out_path.relative_to(BASE_DIR)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
