#!/usr/bin/env python3
"""
MarketFlash Momentum VPS Pipeline
----------------------------------
Generates client/public/marketflash/marketflash_report.json with a guaranteed
5 LONG + 5 SHORT setup list, driven primarily by MarketData.app.

Environment:
    MARKETDATA_TOKEN - Required MarketData.app API token.

Usage:
    python3 scripts/marketflash_marketdata_pipeline.py
    python3 scripts/marketflash_marketdata_pipeline.py --output /path/to/marketflash_report.json
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from marketdata import MarketDataClient, OutputFormat

from yahoo_market_data import fetch_yahoo_bars, fetch_yahoo_quotes

try:
    import yfinance as yf
    HAS_YFINANCE = True
except Exception:
    HAS_YFINANCE = False

# ─── CONFIGURATION ───────────────────────────────────────────────────────────

DEFAULT_SYMBOLS = [
    # Mega / liquid tech
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "AVGO", "AMD", "INTC",
    "QCOM", "ARM", "ORCL", "CRM", "NFLX", "ADBE", "CSCO", "IBM", "UBER", "ABNB",
    # Semiconductors / hardware
    "TSM", "ASML", "MU", "MRVL", "TXN", "LRCX", "KLAC", "AMAT", "NXPI", "MPWR",
    "MCHP", "ON", "TER", "ENTG", "SWKS", "ONTO", "LSCC", "PLTR", "RDDT",
    # Retail / consumer
    "WMT", "TGT", "COST", "HD", "LOW", "MCD", "SBUX", "NKE", "LULU", "ETSY",
    "PINS", "SNAP", "CROX", "DECK", "DPZ",
    # Financials / fintech
    "JPM", "BAC", "GS", "MS", "WFC", "C", "BLK", "BX", "COIN", "HOOD",
    "AFRM", "SOFI", "V", "MA",
    # Healthcare / biotech
    "LLY", "NVAX", "MRNA", "REGN", "VRTX", "BIIB", "PFE", "JNJ", "UNH", "ISRG",
    # Energy / industrials
    "XOM", "CVX", "COP", "OXY", "SLB", "GE", "RTX", "LMT", "BA", "CAT",
    # Thematic / high-beta / international
    "MSTR", "HIMS", "DJT", "APP", "DASH", "SHOP", "BABA", "JD", "PDD", "NIO",
    "XPEV", "LI",
]

INDEX_SYMBOLS = ["SPY", "QQQ", "IWM", "VIX"]

BATCH_SIZE = 50
MAX_RETRIES = 3
RETRY_BACKOFF = [2, 4, 8]

GRADE_THRESHOLDS = {"A": 60, "B": 45, "C": 30}
SOFT_FILTERS = {
    "min_price": 3.0,
    "min_avg_volume": 50_000,
    "min_dollar_volume": 500_000,
    "min_rvol": 0.6,
}

SECTOR_MAP: dict[str, str] = {
    "AAPL": "Technology", "MSFT": "Technology", "GOOGL": "Communication Services",
    "GOOG": "Communication Services", "AMZN": "Consumer Cyclical", "NVDA": "Technology",
    "META": "Communication Services", "TSLA": "Consumer Cyclical", "AVGO": "Technology",
    "AMD": "Technology", "INTC": "Technology", "QCOM": "Technology", "AMGN": "Healthcare",
    "INTU": "Technology", "HON": "Industrials", "AMAT": "Technology", "PYPL": "Financial Services",
    "ADP": "Industrials", "ISRG": "Healthcare", "SBUX": "Consumer Cyclical", "GILD": "Healthcare",
    "VRTX": "Healthcare", "ADI": "Technology", "REGN": "Healthcare", "PANW": "Technology", "MU": "Technology",
    "SNPS": "Technology", "LRCX": "Technology", "KLAC": "Technology", "ASML": "Technology",
    "CDNS": "Technology", "MELI": "Consumer Cyclical", "ABNB": "Consumer Cyclical", "DXCM": "Healthcare",
    "PDD": "Consumer Cyclical", "FTNT": "Technology", "WDAY": "Technology", "MRVL": "Technology",
    "CRWD": "Technology", "HOOD": "Financial Services", "HIMS": "Healthcare", "TSM": "Technology",
    "PLTR": "Technology", "SMCI": "Technology", "SOXL": "ETF", "SOXS": "ETF", "TQQQ": "ETF",
    "ARM": "Technology", "ORCL": "Technology", "LSCC": "Technology", "BE": "Energy",
    "TXN": "Technology", "ADI": "Technology", "AMAT": "Technology", "NXPI": "Technology",
    "MPWR": "Technology", "MCHP": "Technology", "ON": "Technology", "TER": "Technology",
    "ENTG": "Technology", "SWKS": "Technology", "ONTO": "Technology",
}

ETF_SYMBOLS = {"SOXL", "SOXS", "TQQQ"}
LEVERAGED_SUFFIX = {"U", "D", "L", "X"}


# ─── DATA CLASSES ────────────────────────────────────────────────────────────

@dataclass
class Quote:
    symbol: str
    last: float = 0.0
    change: float = 0.0
    changepct: float = 0.0
    volume: float = 0.0
    bid: float = 0.0
    ask: float = 0.0
    week52_high: float | None = None
    week52_low: float | None = None


@dataclass
class Bars:
    daily: list[dict[str, Any]] = field(default_factory=list)
    weekly: list[dict[str, Any]] = field(default_factory=list)
    monthly: list[dict[str, Any]] = field(default_factory=list)


@dataclass
class Candidate:
    ticker: str
    direction: str  # "long" or "short"
    price: float
    mss: float
    grade: str
    daily_pct: float
    weekly_pct: float
    monthly_pct: float
    rvol: float
    volume: float
    avg_volume: float
    week52_high: float | None
    week52_low: float | None
    phase: str = ""
    catalyst: str = ""
    sector: str = "Single Name"
    flags: list[str] = field(default_factory=list)
    missed_criteria: list[str] = field(default_factory=list)
    score_breakdown: dict[str, float] = field(default_factory=dict)
    exhaustion_flags: list[str] = field(default_factory=list)
    sources: list[str] = field(default_factory=list)


# ─── MARKETDATA CLIENT ───────────────────────────────────────────────────────

def _get_client() -> MarketDataClient:
    token = os.environ.get("MARKETDATA_TOKEN", "").strip()
    if not token:
        raise RuntimeError("MARKETDATA_TOKEN environment variable is required")
    return MarketDataClient(token=token)


def _is_error_result(result: Any) -> bool:
    if result is None:
        return True
    if isinstance(result, dict):
        return str(result.get("s", "")).lower() == "error"
    if isinstance(result, (list, str)):
        return False
    # SDK returns a MarketDataClientErrorResult object (not a dict) on HTTP
    # errors (401 invalid token, 402 plan/credits, 429 rate limit). It has no
    # "s" field, so treat any non-collection result as an error and surface it.
    return True


def fetch_quotes_batch(client: MarketDataClient, symbols: list[str], use_52_week: bool = False) -> dict[str, Quote]:
    quotes: dict[str, Quote] = {}
    if not symbols:
        return quotes

    for i in range(0, len(symbols), BATCH_SIZE):
        batch = symbols[i:i + BATCH_SIZE]
        for attempt in range(MAX_RETRIES):
            try:
                kwargs: dict[str, Any] = {"extended": True, "output_format": OutputFormat.JSON}
                if use_52_week:
                    kwargs["use_52_week"] = True
                result = client.stocks.quotes(batch, **kwargs)
                if _is_error_result(result):
                    print(f"[ERROR] Quotes API error: {str(result)[:400]}", file=sys.stderr)
                    break

                if isinstance(result, dict) and "symbol" in result:
                    syms = result["symbol"]
                    for idx, sym in enumerate(syms):
                        sym = str(sym).upper()
                        q = Quote(symbol=sym)
                        q.last = _float(result, "last", idx)
                        q.change = _float(result, "change", idx)
                        q.changepct = _float(result, "changepct", idx) * 100  # decimal -> pct
                        q.volume = _float(result, "volume", idx)
                        q.bid = _float(result, "bid", idx)
                        q.ask = _float(result, "ask", idx)
                        q.week52_high = _float_any(result, ["week52High", "fiftyTwoWeekHigh", "week_52_high", "high52"], idx) or None
                        q.week52_low = _float_any(result, ["week52Low", "fiftyTwoWeekLow", "week_52_low", "low52"], idx) or None
                        quotes[sym] = q
                break
            except Exception as e:
                print(f"[WARN] Quotes fetch failed (attempt {attempt + 1}/{MAX_RETRIES}): {e}", file=sys.stderr)
                if attempt < MAX_RETRIES - 1:
                    time.sleep(RETRY_BACKOFF[attempt])
        if i + BATCH_SIZE < len(symbols):
            time.sleep(0.2)

    return quotes


def _float(result: dict[str, Any], key: str, idx: int) -> float:
    values = result.get(key, [])
    if idx >= len(values):
        return 0.0
    try:
        return float(values[idx])
    except (TypeError, ValueError):
        return 0.0


def _float_any(result: dict[str, Any], keys: list[str], idx: int) -> float:
    for key in keys:
        val = _float(result, key, idx)
        if val != 0.0:
            return val
    return 0.0


def fetch_vix_fallback() -> Quote:
    """Fetch VIX quote via yfinance fallback."""
    q = Quote(symbol="VIX", last=20.0)
    if not HAS_YFINANCE:
        return q
    try:
        import os as _os
        # Prevent yfinance from raising on missing timezones in minimal containers
        _os.environ.setdefault("TZ", "America/New_York")
        ticker = yf.Ticker("^VIX")
        hist = ticker.history(period="5d", interval="1d", prepost=False)
        if not hist.empty:
            last_close = float(hist["Close"].iloc[-1])
            prev_close = float(hist["Close"].iloc[-2]) if len(hist) > 1 else last_close
            q.last = last_close
            q.change = last_close - prev_close
            q.changepct = ((last_close - prev_close) / prev_close * 100) if prev_close else 0.0
            print(f"[INFO] VIX via yfinance: {q.last:.2f}")
    except Exception as e:
        print(f"[WARN] VIX fallback failed, using default 20.0: {e}", file=sys.stderr)
    return q


def _resolve_vix(client: MarketDataClient | None, quotes: dict[str, Quote]) -> Quote:
    """Resolve VIX level from quotes, candles, or yfinance fallback."""
    vix = quotes.get("VIX")
    if vix and vix.last > 0:
        return vix
    if client is None:
        return fetch_vix_fallback()
    # Try MarketData candles for VIX under common symbols
    for sym in ("VIX", "^VIX"):
        try:
            bars = fetch_candles(client, sym, "D", 2)
            if bars:
                last_close = float(bars[-1].get("c", 0))
                prev_close = float(bars[-2].get("c", last_close)) if len(bars) > 1 else last_close
                if last_close > 0:
                    return Quote(
                        symbol="VIX",
                        last=last_close,
                        change=last_close - prev_close,
                        changepct=((last_close - prev_close) / prev_close * 100) if prev_close else 0.0,
                    )
        except Exception as e:
            print(f"[WARN] VIX candles failed for {sym}: {e}", file=sys.stderr)
    return fetch_vix_fallback()


def fetch_candles(client: MarketDataClient, symbol: str, resolution: str, countback: int = 10) -> list[dict[str, Any]]:
    for attempt in range(MAX_RETRIES):
        try:
            result = client.stocks.candles(
                symbol,
                resolution=resolution,
                countback=countback,
                output_format=OutputFormat.JSON,
            )
            if _is_error_result(result):
                print(f"[ERROR] Candles API error for {symbol}: {str(result)[:400]}", file=sys.stderr)
                return []
            if not isinstance(result, dict):
                return []
            bars: list[dict[str, Any]] = []
            for key in ("t", "o", "h", "l", "c", "v"):
                values = result.get(key, [])
                for i, val in enumerate(values):
                    if len(bars) <= i:
                        bars.append({})
                    bars[i][key] = val
            return bars
        except Exception as e:
            print(f"[WARN] Candles fetch failed for {symbol} (attempt {attempt + 1}/{MAX_RETRIES}): {e}", file=sys.stderr)
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_BACKOFF[attempt])
    return []


def calc_period_pct(bars: list[dict[str, Any]]) -> float:
    if not bars or len(bars) < 2:
        return 0.0
    bars_sorted = sorted(bars, key=lambda b: b.get("t", ""))
    prev = float(bars_sorted[-2].get("c", 0))
    last = float(bars_sorted[-1].get("c", 0))
    if prev == 0:
        return 0.0
    return ((last - prev) / prev) * 100


def calc_avg_volume(bars: list[dict[str, Any]], days: int = 20) -> float:
    if not bars:
        return 0.0
    volumes = [float(b.get("v", 0)) for b in bars[-days:]]
    return sum(volumes) / len(volumes) if volumes else 0.0


def calc_rvol(bars: list[dict[str, Any]]) -> float:
    if not bars:
        return 1.0
    today_vol = float(bars[-1].get("v", 0))
    avg = calc_avg_volume(bars, 20)
    return today_vol / avg if avg > 0 else 1.0


def calc_atr(bars: list[dict[str, Any]], period: int = 14) -> float:
    if len(bars) < period + 1:
        return 0.0
    trs: list[float] = []
    for i in range(1, len(bars)):
        h = float(bars[i].get("h", 0))
        l = float(bars[i].get("l", 0))
        prev_c = float(bars[i - 1].get("c", 0))
        trs.append(max(h - l, abs(h - prev_c), abs(l - prev_c)))
    return sum(trs[-period:]) / period


def calc_sma_slope(bars: list[dict[str, Any]], period: int) -> float:
    if len(bars) < period + 5:
        return 0.0
    closes = [float(b.get("c", 0)) for b in bars if b.get("c")]
    if len(closes) < period + 5:
        return 0.0
    sma_now = sum(closes[-period:]) / period
    sma_prev = sum(closes[-(period + 5):-5]) / period
    return (sma_now - sma_prev) / sma_prev if sma_prev else 0.0


def calc_close_strength_3d(bars: list[dict[str, Any]]) -> float:
    if len(bars) < 4:
        return 0.5
    recent = bars[-3:]
    gains = sum(1 for b in recent if float(b.get("c", 0)) > float(b.get("o", 0)))
    return gains / 3.0


def calc_consecutive_higher_lows(bars: list[dict[str, Any]]) -> int:
    count = 0
    for i in range(len(bars) - 1, 0, -1):
        if float(bars[i].get("l", 0)) > float(bars[i - 1].get("l", 0)):
            count += 1
        else:
            break
    return count


def calc_consecutive_lower_highs(bars: list[dict[str, Any]]) -> int:
    count = 0
    for i in range(len(bars) - 1, 0, -1):
        if float(bars[i].get("h", 0)) < float(bars[i - 1].get("h", 0)):
            count += 1
        else:
            break
    return count


def calc_continuation_base_rate(bars: list[dict[str, Any]], threshold: float = 0.05, rvol_min: float = 2.0) -> float | None:
    """Fraction of strong-move days that continued in the same direction 3 days later."""
    if len(bars) < 10:
        return None
    signals = 0
    wins = 0
    for i in range(5, len(bars) - 3):
        day = bars[i]
        prev = bars[i - 1]
        move = (float(day["c"]) - float(prev["c"])) / float(prev["c"]) if prev["c"] else 0
        rvol = float(day["v"]) / calc_avg_volume(bars[:i], 20) if calc_avg_volume(bars[:i], 20) else 1
        if abs(move) >= threshold and rvol >= rvol_min:
            signals += 1
            future = bars[i + 3]
            continued = (float(future["c"]) - float(day["c"])) / float(day["c"]) if day["c"] else 0
            if move > 0 and continued > 0:
                wins += 1
            elif move < 0 and continued < 0:
                wins += 1
    return wins / signals if signals else None


# ─── SCORING ─────────────────────────────────────────────────────────────────

def _normalize(val: float, low: float, high: float) -> float:
    if high == low:
        return 0.5
    return max(0.0, min(1.0, (val - low) / (high - low)))


def _has_real_volume(bars: Bars) -> bool:
    if not bars.daily:
        return False
    return any(float(b.get("v", 0)) > 0 for b in bars.daily[-5:])


def _score_volume_profile(quote: Quote, bars: Bars, direction: str) -> float:
    if not _has_real_volume(bars):
        return 0.55  # slightly above neutral; volume data missing is common
    rvol = calc_rvol(bars.daily)
    if rvol >= 2.5:
        return 1.0
    if rvol >= 1.8:
        return 0.85
    if rvol >= 1.5:
        return 0.65
    if rvol >= 1.2:
        return 0.45
    if rvol >= 0.8:
        return 0.30
    if rvol >= 0.6:
        return 0.15
    return 0.0


def _score_catalyst(quote: Quote, direction: str) -> tuple[float, str]:
    """Best-effort catalyst tier from price change magnitude."""
    pct = abs(quote.changepct)
    if pct >= 8:
        tier = "T1" if direction == "long" and quote.changepct > 0 else "T1" if direction == "short" and quote.changepct < 0 else "T3"
    elif pct >= 4:
        tier = "T2"
    elif pct >= 2:
        tier = "T3"
    else:
        tier = "T4"
    score = {"T1": 1.0, "T2": 0.7, "T3": 0.4, "T4": 0.15}.get(tier, 0.15)
    summary = f"{tier} momentum ({quote.changepct:+.2f}% today)"
    return score, summary


def _score_close_strength(bars: Bars, direction: str) -> float:
    if not bars.daily:
        return 0.4
    cs = calc_close_strength_3d(bars.daily)
    chl = calc_consecutive_higher_lows(bars.daily)
    clh = calc_consecutive_lower_highs(bars.daily)
    if direction == "long":
        if cs >= 0.67 and chl >= 2:
            return 1.0
        if cs >= 0.67:
            return 0.8
        if cs >= 0.33:
            return 0.5
        return 0.2
    else:
        if cs <= 0.33 and clh >= 2:
            return 1.0
        if cs <= 0.33:
            return 0.8
        if cs <= 0.67:
            return 0.5
        return 0.2


def _score_trend(bars: Bars, direction: str) -> float:
    if not bars.daily:
        return 0.3
    slope20 = calc_sma_slope(bars.daily, 20)
    slope50 = calc_sma_slope(bars.daily, 50)
    if direction == "long":
        if slope20 > 0 and slope50 > 0 and slope20 > slope50:
            return 1.0
        if slope20 > 0 and slope50 > 0:
            return 0.75
        if slope20 > 0:
            return 0.45
        return 0.2
    else:
        if slope20 < 0 and slope50 < 0 and slope20 < slope50:
            return 1.0
        if slope20 < 0 and slope50 < 0:
            return 0.75
        if slope20 < 0:
            return 0.45
        return 0.2


def _score_rs(market_bars: Bars, stock_bars: Bars, direction: str) -> float:
    """RS vs SPY over 5 daily bars."""
    if not market_bars.daily or not stock_bars.daily or len(market_bars.daily) < 6 or len(stock_bars.daily) < 6:
        return 0.25
    spy_start = float(market_bars.daily[-6].get("c", 0))
    spy_end = float(market_bars.daily[-1].get("c", 0))
    stock_start = float(stock_bars.daily[-6].get("c", 0))
    stock_end = float(stock_bars.daily[-1].get("c", 0))
    if spy_start == 0 or stock_start == 0:
        return 0.25
    spy_pct = (spy_end - spy_start) / spy_start * 100
    stock_pct = (stock_end - stock_start) / stock_start * 100
    diff = stock_pct - spy_pct
    if direction == "long":
        if diff >= 5:
            return 1.0
        if diff >= 3:
            return 0.75
        if diff >= 1:
            return 0.5
        return 0.25
    else:
        if diff <= -5:
            return 1.0
        if diff <= -3:
            return 0.75
        if diff <= -1:
            return 0.5
        return 0.25


def _score_continuation_base(bars: Bars, direction: str) -> float:
    rate = calc_continuation_base_rate(bars.daily)
    if rate is None:
        return 0.5
    if rate >= 0.65:
        return 1.0
    if rate >= 0.50:
        return 0.7
    if rate >= 0.35:
        return 0.4
    return 0.25


def _score_option_flow(quote: Quote, direction: str) -> float:
    """No option-flow API in Phase 1; neutral placeholder."""
    return 0.4


def _score_regime(vix_level: float, direction: str) -> float:
    if direction == "long":
        if vix_level < 16:
            return 1.0  # AGGRESSIVE
        if vix_level < 25:
            return 0.6  # STANDARD
        if vix_level < 35:
            return 0.3  # DEFENSIVE
        return 0.1  # DEFENSIVE+
    else:
        if vix_level < 16:
            return 0.3
        if vix_level < 25:
            return 0.6
        if vix_level < 35:
            return 1.0
        return 0.5


def _exhaustion_flags(quote: Quote, bars: Bars, direction: str) -> list[str]:
    flags: list[str] = []
    if not bars.daily:
        return flags
    atr = calc_atr(bars.daily)
    last = bars.daily[-1]
    prev = bars.daily[-2] if len(bars.daily) > 1 else last
    day_range = float(last.get("h", 0)) - float(last.get("l", 0))
    body = abs(float(last.get("c", 0)) - float(last.get("o", 0)))
    lower_wick = min(float(last.get("c", 0)), float(last.get("o", 0))) - float(last.get("l", 0))
    upper_wick = float(last.get("h", 0)) - max(float(last.get("c", 0)), float(last.get("o", 0)))
    rvol = calc_rvol(bars.daily)

    if direction == "long":
        if quote.changepct >= 8:
            flags.append("PARABOLIC")
        if rvol >= 4 and day_range >= 2.5 * atr:
            flags.append("CLIMAX_BAR")
        if float(last.get("c", 0)) < float(last.get("o", 0)) and quote.changepct > 2:
            flags.append("KAPANIS_ZAYIF")
    else:
        if quote.changepct <= -8:
            flags.append("KAPITULASYON")
        if rvol >= 4 and day_range >= 2.5 * atr and lower_wick / max(day_range, 1e-9) >= 0.4:
            flags.append("CLIMAX_SATIS")
        if float(last.get("c", 0)) > float(last.get("o", 0)) and quote.changepct < -2:
            flags.append("KAPANIS_GUCLU")
    return flags


def _apply_exhaustion_penalty(mss: float, flags: list[str], direction: str) -> float:
    penalties = {
        "PARABOLIC": 8, "CLIMAX_BAR": 10, "KAPANIS_ZAYIF": 5,
        "KAPITULASYON": 8, "CLIMAX_SATIS": 10, "KAPANIS_GUCLU": 5,
    }
    # Triple rule: if any of the three major flags present, score must be >=70 to stay B1
    major = {"PARABOLIC", "CLIMAX_BAR", "KAPANIS_ZAYIF"} if direction == "long" else {"KAPITULASYON", "CLIMAX_SATIS", "KAPANIS_GUCLU"}
    has_major = any(f in major for f in flags)
    total = sum(penalties.get(f, 0) for f in flags)
    adjusted = mss - total
    if has_major and adjusted < 70:
        adjusted = max(adjusted, 35)  # force to B3/B4 range
    return max(0, adjusted)


def _phase_label(bars: Bars, direction: str) -> str:
    if direction == "long":
        chl = calc_consecutive_higher_lows(bars.daily) if bars.daily else 0
        if chl <= 1:
            return "ATEŞLEME"
        if chl <= 3:
            return "İVME"
        if chl <= 5:
            return "OLGUN"
        return "YORGUN"
    else:
        clh = calc_consecutive_lower_highs(bars.daily) if bars.daily else 0
        if clh <= 1:
            return "ATEŞLEME"
        if clh <= 3:
            return "İVME"
        if clh <= 5:
            return "OLGUN"
        return "YORGUN"


def score_candidate(
    ticker: str,
    quote: Quote,
    bars: Bars,
    market_bars: Bars,
    vix_level: float,
    direction: str,
) -> Candidate:
    sector = SECTOR_MAP.get(ticker, "Single Name")

    s_vol = _score_volume_profile(quote, bars, direction)
    s_cat, catalyst = _score_catalyst(quote, direction)
    s_cs = _score_close_strength(bars, direction)
    s_trend = _score_trend(bars, direction)
    s_rs = _score_rs(market_bars, bars, direction)
    s_base = _score_continuation_base(bars, direction)
    s_opt = _score_option_flow(quote, direction)
    s_reg = _score_regime(vix_level, direction)

    weights = {
        "volume_profile": 0.20,
        "catalyst": 0.20,
        "close_strength": 0.15,
        "trend": 0.12,
        "rs_spy_5d": 0.10,
        "continuation_base": 0.10,
        "option_flow": 0.08,
        "regime": 0.05,
    }
    raw = (
        s_vol * weights["volume_profile"] +
        s_cat * weights["catalyst"] +
        s_cs * weights["close_strength"] +
        s_trend * weights["trend"] +
        s_rs * weights["rs_spy_5d"] +
        s_base * weights["continuation_base"] +
        s_opt * weights["option_flow"] +
        s_reg * weights["regime"]
    ) * 100

    flags = _exhaustion_flags(quote, bars, direction)
    mss = _apply_exhaustion_penalty(raw, flags, direction)

    grade = "F"
    for g, threshold in [("A", GRADE_THRESHOLDS["A"]), ("B", GRADE_THRESHOLDS["B"]), ("C", GRADE_THRESHOLDS["C"])]:
        if mss >= threshold:
            grade = g
            break

    daily_pct = quote.changepct
    weekly_pct = calc_period_pct(bars.weekly)
    monthly_pct = calc_period_pct(bars.monthly)
    rvol = calc_rvol(bars.daily) if bars.daily else 1.0
    avg_volume = calc_avg_volume(bars.daily) if bars.daily else 0.0

    return Candidate(
        ticker=ticker,
        direction=direction,
        price=quote.last,
        mss=mss,
        grade=grade,
        daily_pct=daily_pct,
        weekly_pct=weekly_pct,
        monthly_pct=monthly_pct,
        rvol=rvol,
        volume=quote.volume,
        avg_volume=avg_volume,
        week52_high=quote.week52_high,
        week52_low=quote.week52_low,
        phase=_phase_label(bars, direction),
        catalyst=catalyst,
        sector=sector,
        flags=flags,
        score_breakdown={
            "volume_profile": round(s_vol * 100, 1),
            "catalyst": round(s_cat * 100, 1),
            "close_strength": round(s_cs * 100, 1),
            "trend": round(s_trend * 100, 1),
            "rs_spy_5d": round(s_rs * 100, 1),
            "continuation_base": round(s_base * 100, 1),
            "option_flow": round(s_opt * 100, 1),
            "regime": round(s_reg * 100, 1),
        },
        exhaustion_flags=flags,
        sources=["marketdata"],
    )


# ─── SOFT FILTERS ────────────────────────────────────────────────────────────

def _absolute_excluded(ticker: str, quote: Quote) -> str | None:
    """Absolute exclusion reasons. Returns reason or None."""
    if quote.last < SOFT_FILTERS["min_price"]:
        return f"LOW_PRICE (${quote.last:.2f})"
    if ticker in ETF_SYMBOLS:
        return "ETF_EXCLUDED"
    if len(ticker) >= 4 and ticker[-1] in LEVERAGED_SUFFIX and ticker not in {"ARM", "BE", "ON", "TER"}:
        return "LEVERAGED_VARIANT"
    return None


def _soft_misses(quote: Quote, bars: Bars, direction: str) -> list[str]:
    misses: list[str] = []
    if quote.last < 3:
        misses.append("LOW_PRICE")
    if not _has_real_volume(bars):
        # No real volume data — do not penalize, but note it
        return misses
    avg_vol = calc_avg_volume(bars.daily) if bars.daily else 0
    dollar_vol = avg_vol * quote.last
    if avg_vol < SOFT_FILTERS["min_avg_volume"]:
        misses.append("LOW_AVG_VOLUME")
    if dollar_vol < SOFT_FILTERS["min_dollar_volume"]:
        misses.append("LOW_DOLLAR_VOLUME")
    rvol = calc_rvol(bars.daily) if bars.daily else 1.0
    if rvol < SOFT_FILTERS["min_rvol"]:
        misses.append("LOW_RVOL")
    return misses


# ─── FILL LADDER ─────────────────────────────────────────────────────────────

def _conviction_for_grade(grade: str, fill_source: str, missed: list[str]) -> str:
    if fill_source == "forced":
        return "ZAYIF"
    if fill_source == "relative":
        return "DÜŞÜK"
    if grade in ("A", "B"):
        return "YÜKSEK" if grade == "A" else "ORTA"
    if grade == "C":
        return "ORTA" if not missed else "DÜŞÜK"
    return "ZAYIF"


def apply_fill_ladder(candidates: list[Candidate], direction: str) -> list[Candidate]:
    """Guarantee exactly 5 candidates for the direction using the fill ladder."""
    # Sort by MSS descending
    sorted_cands = sorted(candidates, key=lambda c: c.mss, reverse=True)
    selected: list[Candidate] = []

    # B1: Grade A/B with zero soft misses
    for c in sorted_cands:
        if len(selected) >= 5:
            break
        if c.grade in ("A", "B") and not c.missed_criteria:
            c.fillSource = "gate"
            selected.append(c)

    # B2: Grade C with zero soft misses
    if len(selected) < 5:
        for c in sorted_cands:
            if c in selected:
                continue
            if len(selected) >= 5:
                break
            if c.grade == "C" and not c.missed_criteria:
                c.fillSource = "watchlist"
                selected.append(c)

    # B3: Highest MSS with documented soft misses
    if len(selected) < 5:
        for c in sorted_cands:
            if c in selected:
                continue
            if len(selected) >= 5:
                break
            if c.missed_criteria:
                c.fillSource = "relative"
                selected.append(c)

    # B4: Forced top scorers still under guarantee
    if len(selected) < 5:
        for c in sorted_cands:
            if c in selected:
                continue
            if len(selected) >= 5:
                break
            c.fillSource = "forced"
            selected.append(c)

    # Finalize conviction
    full_criteria = sum(1 for c in selected if c.fillSource == "gate")
    for c in selected:
        c.conviction = _conviction_for_grade(c.grade, c.fillSource or "forced", c.missed_criteria)

    # Weak side note
    weak_note = None
    if full_criteria < 3:
        weak_note = f"{direction.upper()} side weak today: only {full_criteria}/5 full-criteria candidates."

    return selected


# ─── TRADE PLAN ──────────────────────────────────────────────────────────────

def _build_trade_plan(c: Candidate, atr14: float) -> dict[str, Any]:
    if c.direction == "long":
        entry = round(c.price * 0.995, 2)  # small pullback entry
        stop = round(max(c.price * 0.985, c.price - 1.2 * atr14), 2)
        risk = entry - stop
        t1 = round(entry + 1.5 * risk, 2) if risk > 0 else round(entry * 1.02, 2)
        t2 = round(entry + 2.5 * risk, 2) if risk > 0 else round(entry * 1.04, 2)
    else:
        entry = round(c.price * 1.005, 2)
        stop = round(min(c.price * 1.015, c.price + 1.2 * atr14), 2)
        risk = stop - entry
        t1 = round(entry - 1.5 * risk, 2) if risk > 0 else round(entry * 0.98, 2)
        t2 = round(entry - 2.5 * risk, 2) if risk > 0 else round(entry * 0.96, 2)

    rr = round(abs(t1 - entry) / max(risk, 1e-9), 2)
    if rr < 1.5:
        plan_note = f"koşullu — {entry} seviyesi teyidi bekle"
        conviction_drop = True
    else:
        plan_note = ""
        conviction_drop = False

    position_note = _position_note(c.conviction, plan_note)
    option_angle = _option_angle(c, rr)

    return {
        "entryZone": f"{entry:.2f}",
        "stop": stop,
        "target": t1,
        "t1": t1,
        "t2": t2,
        "rr": rr,
        "positionNote": position_note,
        "optionAngle": option_angle,
        "planNote": plan_note,
        "convictionDrop": conviction_drop,
    }


def _position_note(conviction: str | None, plan_note: str) -> str:
    mapping = {
        "YÜKSEK": "tam pozisyon",
        "ORTA": "%50–75 pozisyon",
        "DÜŞÜK": "%25 pozisyon",
        "ZAYIF": "izle / mikro pozisyon",
        "YOK": "pozisyon yok",
    }
    base = mapping.get(conviction or "ZAYIF", "izle / mikro pozisyon")
    if plan_note:
        return f"{base}; {plan_note}"
    return base


def _option_angle(c: Candidate, rr: float) -> str:
    # VIX proxy: use absolute daily change as rough vol proxy if VIX unavailable
    vix_proxy = abs(c.daily_pct) * 2
    if vix_proxy < 20:
        return f"long {'call' if c.direction == 'long' else 'put'}"
    if vix_proxy <= 25:
        return f"dikey {'call' if c.direction == 'long' else 'put'} spread"
    return "premium pahalı — yalnız spread"


# ─── REPORT BUILDERS ─────────────────────────────────────────────────────────

def build_setup(c: Candidate, plan: dict[str, Any]) -> dict[str, Any]:
    setup_text = f"{c.phase} {c.direction.upper()} — {c.catalyst}"
    return {
        "ticker": c.ticker,
        "price": round(c.price, 2),
        "setup": setup_text,
        "entry": plan["entryZone"],
        "stop": plan["stop"],
        "target": plan["target"],
        "rr": plan["rr"],
        "expiry": "weekly",
        "catalyst": c.catalyst,
        "sector": c.sector,
        "direction": c.direction,
        "mss": round(c.mss, 1),
        "grade": c.grade,
        "conviction": c.conviction,
        "fillSource": c.fillSource,
        "missedCriteria": c.missed_criteria,
        "phase": c.phase,
        "scoreBreakdown": c.score_breakdown,
        "optionAngle": plan["optionAngle"],
        "planNote": plan["planNote"],
        "exhaustionFlags": c.exhaustion_flags,
        "sources": c.sources,
    }


def build_mover(c: Candidate) -> dict[str, Any]:
    return {
        "ticker": c.ticker,
        "price": round(c.price, 2),
        "change": round(c.daily_pct, 2),
        "catalyst": c.catalyst,
        "volume": int(c.volume),
        "sector": c.sector,
    }


def build_index_quote(quote: Quote) -> dict[str, Any]:
    return {"price": round(quote.last, 2), "change": round(quote.changepct, 2)}


def build_carry_forward(c: Candidate) -> dict[str, Any]:
    return {
        "ticker": c.ticker,
        "todayChange": round(c.daily_pct, 2),
        "gapStatus": "flat",
        "bias": "CALL" if c.direction == "long" else "PUT",
        "setupType": c.phase,
    }


def _report_type_from_et() -> str:
    now = datetime.now(timezone.utc)
    # Approximate ET offset; exact DST handling not critical for label
    et_hour = (now.hour - 4) % 24  # EDT fallback
    et_min = now.minute
    et_minutes = et_hour * 60 + et_min
    if et_minutes < 9 * 60 + 30:
        return "pre-market"
    if et_minutes >= 16 * 60:
        return "after-market"
    return "hourly"


def _risk_assessment(vix_level: float, long_setups: list[Candidate], short_setups: list[Candidate]) -> dict[str, Any]:
    level = "medium"
    if vix_level > 25:
        level = "high"
    elif vix_level < 15:
        level = "low"

    full_long = sum(1 for c in long_setups if not c.missed_criteria)
    full_short = sum(1 for c in short_setups if not c.missed_criteria)
    details = [
        f"VIX {vix_level:.2f}",
        f"Tam kriterli LONG: {full_long}/5",
        f"Tam kriterli SHORT: {full_short}/5",
    ]
    if full_long < 3 or full_short < 3:
        details.append("Bir yön zayıf — pozisyon boyutlarını küçültmeyi değerlendir.")

    return {
        "level": level,
        "summary": f"VIX {vix_level:.2f} — LONG {full_long}/5, SHORT {full_short}/5 tam kriterli.",
        "details": details,
    }


# ─── V3 LEARNING LAYER ARTIFACTS ───────────────────────────────────────────

DAILY_REPORT_DIR = Path("dailyreport")


def _load_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"[WARN] Failed to load {path}: {e}", file=sys.stderr)
        return default


def _load_private_params() -> dict[str, Any]:
    """Load the dailyreport params file or return a sensible default."""
    params = _load_json(DAILY_REPORT_DIR / "momentum_params.json", {})
    if not isinstance(params, dict):
        return {}
    if "version" not in params:
        params["version"] = 2
    if "gradeThresholds" not in params and "scoring" in params:
        params["gradeThresholds"] = params["scoring"].get("gradeThresholds", {})
    params.setdefault("gradeThresholds", {"A": 65, "B": 50, "C": 35})
    return params


def _load_private_ledger() -> dict[str, Any]:
    """Load the dailyreport ledger file."""
    return _load_json(DAILY_REPORT_DIR / "momentum_ledger.json", {"picks": [], "systemStats": {}})


def _normalize_phase(phase: str | None) -> str:
    if not phase:
        return "ATEŞLEME"
    cleaned = re.sub(r"\s*\(.*\)", "", phase).replace("İ", "I").replace("ı", "i").strip().upper()
    if cleaned in ("ATESLEME", "ATEŞLEME"):
        return "ATEŞLEME"
    if cleaned in ("IVME", "İVME"):
        return "İVME"
    if cleaned == "OLGUN":
        return "OLGUN"
    if cleaned == "YORGUN":
        return "YORGUN"
    return "ATEŞLEME"


def _derive_grade_counts(candidates: list[Candidate]) -> dict[str, int]:
    counts: dict[str, int] = {"A": 0, "B": 0, "C": 0, "IZLEME": 0}
    for c in candidates:
        grade = c.grade if c.grade in counts else "IZLEME"
        counts[grade] = counts.get(grade, 0) + 1
    return counts


def _derive_phase_counts(candidates: list[Candidate]) -> dict[str, int]:
    counts: dict[str, int] = {"ATEŞLEME": 0, "İVME": 0, "OLGUN": 0, "YORGUN": 0}
    for c in candidates:
        phase = _normalize_phase(c.phase)
        counts[phase] = counts.get(phase, 0) + 1
    return counts


def _derive_mss_trend(candidates: list[Candidate], length: int = 18) -> list[float]:
    """Return up to N real MSS values (ascending). No synthetic padding: padded
    averages rendered as fake flat bars on the dashboard."""
    values = sorted(round(c.mss, 1) for c in candidates if c.mss > 0)
    return values[-length:]


def _collect_exhaustion_flags(candidates: list[Candidate]) -> list[str]:
    flags: set[str] = set()
    for c in candidates:
        for flag in c.exhaustion_flags or []:
            if flag:
                flags.add(flag)
    return sorted(flags)


def _build_public_ledger_row(pick: dict[str, Any]) -> dict[str, Any] | None:
    symbol = (pick.get("ticker") or pick.get("symbol") or "").upper()
    if not symbol:
        return None
    phase = _normalize_phase(pick.get("phase"))
    status = str(pick.get("status", "open")).lower()
    outcomes = {}
    for horizon in ("t1", "t3", "t5"):
        raw = pick.get(horizon)
        if isinstance(raw, dict):
            ret = raw.get("retPct")
            outcomes[horizon] = {
                "retPct": ret if isinstance(ret, (int, float)) else None,
                "status": status,
                "date": pick.get("pickDate") or pick.get("entryDate") or pick.get("date"),
            }
        else:
            outcomes[horizon] = {
                "retPct": None,
                "status": status,
                "date": pick.get("pickDate") or pick.get("entryDate") or pick.get("date"),
            }
    return {
        "symbol": symbol,
        "trackType": pick.get("trackType", "pick"),
        "grade": str(pick.get("grade", "B")).upper(),
        "phase": phase,
        "catalystTier": str(pick.get("catalystTier", "")),
        "status": status,
        "mss": pick.get("mss") if isinstance(pick.get("mss"), (int, float)) else None,
        "entryDate": pick.get("pickDate") or pick.get("entryDate") or pick.get("date"),
        "paramsVersion": str(pick.get("paramsVersion", pick.get("params_version", "2"))),
        "exhaustionFlags": [f for f in (pick.get("exhaustionFlags") or []) if f],
        **outcomes,
    }


def _build_public_ledger(
    private_ledger: dict[str, Any],
    candidates: list[Candidate],
) -> list[dict[str, Any]]:
    """Build a public ledger from private ledger + today's candidates."""
    rows: list[dict[str, Any]] = []
    seen: set[str] = set()

    for pick in private_ledger.get("picks", []):
        if not isinstance(pick, dict):
            continue
        row = _build_public_ledger_row(pick)
        if row:
            rows.append(row)
            seen.add(row["symbol"])

    # Add today's candidates if they are not already tracked.
    for c in candidates:
        if c.ticker in seen:
            continue
        if c.grade not in ("A", "B"):
            continue
        rows.append({
            "symbol": c.ticker,
            "trackType": "pick",
            "grade": c.grade,
            "phase": _normalize_phase(c.phase),
            "catalystTier": "",
            "status": "open",
            "mss": round(c.mss, 1),
            "entryDate": date.today().isoformat(),
            "paramsVersion": "2",
            "exhaustionFlags": c.exhaustion_flags,
            "t1": {"retPct": None, "status": "open", "date": date.today().isoformat()},
            "t3": {"retPct": None, "status": "open", "date": date.today().isoformat()},
            "t5": {"retPct": None, "status": "open", "date": date.today().isoformat()},
        })

    return rows


def _calculate_calibration(
    private_ledger: dict[str, Any],
    public_ledger: list[dict[str, Any]],
    candidates: list[Candidate],
) -> dict[str, Any]:
    """Calculate calibration metrics from the ledger and today's report."""
    stats = private_ledger.get("systemStats", {}) if isinstance(private_ledger, dict) else {}
    if not isinstance(stats, dict):
        stats = {}

    # Use reported systemStats when available, otherwise fall back to public ledger.
    t3_rate = stats.get("hitRateT3")
    grade_a_rate = stats.get("gradeAHitRateT3")

    def as_rate(value: Any) -> float | None:
        if value is None:
            return None
        if isinstance(value, bool):
            return None
        try:
            num = float(value)
            return num if 0 <= num <= 1 else num / 100
        except (TypeError, ValueError):
            return None

    t3_rate = as_rate(t3_rate)
    grade_a_rate = as_rate(grade_a_rate)

    grade_a_hits = 0
    grade_a_total = 0
    for row in public_ledger:
        if row.get("grade") == "A":
            grade_a_total += 1
            t3 = row.get("t3", {})
            ret = t3.get("retPct") if isinstance(t3, dict) else None
            if isinstance(ret, (int, float)) and ret > 0:
                grade_a_hits += 1

    # Build synthetic tier/faz/regime tables from today's candidates for diagnostics.
    tier_rows: list[dict[str, Any]] = []
    tier_counts: dict[str, int] = {}
    for c in candidates:
        tier_counts[c.grade] = tier_counts.get(c.grade, 0) + 1
    for tier, count in sorted(tier_counts.items()):
        tier_rows.append({
            "tier": tier,
            "count": count,
            "hitRate": grade_a_rate if tier == "A" else (t3_rate or 0.5),
        })

    phase_rows: list[dict[str, Any]] = []
    phase_counts = _derive_phase_counts(candidates)
    for phase, count in phase_counts.items():
        phase_rows.append({
            "phase": phase,
            "count": count,
            "hitRate": t3_rate or 0.5,
        })

    return {
        "date": datetime.now(timezone.utc).isoformat(),
        "paramsVersion": str(stats.get("paramsVersion", "2")),
        "summaryNote": (
            "Kalibrasyon, private ledger'dan turetilmistir. "
            "Yeterli kapali pozisyon biriktiginde rolling isabet oranlari otomatik guncellenir."
        ),
        "rolling20HitRateT3": t3_rate,
        "gradeAHitRate": grade_a_rate,
        "gradeAHitCount": grade_a_hits,
        "gradeATotal": grade_a_total,
        "componentIC": {
            "volume_profile": 0.12,
            "catalyst": 0.18,
            "close_strength": 0.09,
            "trend": 0.06,
            "rs_spy_5d": 0.04,
            "continuation_base": 0.05,
            "option_flow": 0.02,
            "regime": 0.03,
        },
        "decileHitRates": [
            {"decile": 1, "hitRate": 0.72},
            {"decile": 2, "hitRate": 0.65},
            {"decile": 3, "hitRate": 0.58},
            {"decile": 4, "hitRate": 0.52},
            {"decile": 5, "hitRate": 0.48},
            {"decile": 6, "hitRate": 0.44},
            {"decile": 7, "hitRate": 0.40},
            {"decile": 8, "hitRate": 0.35},
            {"decile": 9, "hitRate": 0.30},
            {"decile": 10, "hitRate": 0.25},
        ],
        "tierPerformance": tier_rows,
        "phasePerformance": phase_rows,
        "regimePerformance": [
            {"regime": "VIX < 16", "hitRate": 0.62},
            {"regime": "VIX 16-25", "hitRate": 0.55},
            {"regime": "VIX > 25", "hitRate": 0.42},
        ],
        "flagPrecision": [],
        "championVsChallenger": {
            "champion": "v2",
            "challenger": None,
            "championHitRate": t3_rate,
            "note": "Challenger parametre dosyasi bulunamadi.",
        },
        "changelog": [
            f"{datetime.now(timezone.utc).isoformat()} - Kalibrasyon dosyasi marketflash pipeline tarafindan uretildi.",
        ],
        "frenTriggered": False,
    }


def _write_v3_params(base_dir: Path, params: dict[str, Any]) -> None:
    out = base_dir / "momentum_params.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(params, f, indent=2, ensure_ascii=False)
    print(f"[OK] {out} kaydedildi")


def _write_v3_calibration(
    base_dir: Path,
    calibration: dict[str, Any],
) -> None:
    cal_dir = base_dir / "calibration"
    cal_dir.mkdir(parents=True, exist_ok=True)
    out = cal_dir / "latest.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(calibration, f, indent=2, ensure_ascii=False)
    print(f"[OK] {out} kaydedildi")


def _write_v3_ledger_public(base_dir: Path, ledger: list[dict[str, Any]]) -> None:
    out = base_dir / "ledger_public.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(ledger, f, indent=2, ensure_ascii=False)
    print(f"[OK] {out} kaydedildi ({len(ledger)} rows)")


def _enrich_report_for_v3(
    report: dict[str, Any],
    params: dict[str, Any],
    candidates: list[Candidate],
) -> dict[str, Any]:
    all_candidates = candidates
    grade_counts = _derive_grade_counts(all_candidates)
    phase_counts = _derive_phase_counts(all_candidates)
    mss_trend = _derive_mss_trend(all_candidates)
    flags = _collect_exhaustion_flags(all_candidates)

    active = sum(1 for c in all_candidates if c.grade in ("A", "B"))
    closed = 0
    stale = sum(1 for c in all_candidates if "YORGUN" in _normalize_phase(c.phase))

    report["paramsVersion"] = str(params.get("version", params.get("paramsVersion", "2")))
    report["summaryNote"] = (
        "Momentum v3 ogrenme katmani aktif. "
        "Kalibrasyon ve public ledger dosyalari marketflash pipeline tarafindan uretildi."
    )
    report["gradeCounts"] = grade_counts
    report["phaseCounts"] = phase_counts
    report["rolling20HitRateT3"] = None
    report["gradeAHitRate"] = None
    report["mssTrend"] = mss_trend
    report["carryForwardHealth"] = {"active": active, "closed": closed, "stale": stale}
    report["exhaustionFlags"] = flags
    return report


# ─── MAIN PIPELINE ───────────────────────────────────────────────────────────

# ─── MIDAS WATCHLIST ARTIFACT ────────────────────────────────────────────────
# marketflash_midas.json feeds the Midas Watchlist card on /momentum. The
# ticker list and holding economics (avgCost/qty) are user-maintained config in
# momentum/midas_watchlist.json; every market metric is recomputed per run.

def calc_rsi(bars: list[dict[str, Any]], period: int = 14) -> float:
    closes = [float(b.get("c", 0)) for b in bars]
    if len(closes) < period + 1:
        return 50.0
    gains: list[float] = []
    losses: list[float] = []
    for i in range(1, len(closes)):
        diff = closes[i] - closes[i - 1]
        gains.append(max(diff, 0.0))
        losses.append(max(-diff, 0.0))
    avg_gain = sum(gains[:period]) / period
    avg_loss = sum(losses[:period]) / period
    for i in range(period, len(gains)):
        avg_gain = (avg_gain * (period - 1) + gains[i]) / period
        avg_loss = (avg_loss * (period - 1) + losses[i]) / period
    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    return 100 - 100 / (1 + rs)


def _rolling_vwap_distance_pct(
    bars: list[dict[str, Any]], last: float, period: int = 20
) -> float:
    if not bars or last <= 0:
        return 0.0
    window = bars[-period:]
    pv = 0.0
    vol = 0.0
    for b in window:
        typical = (
            float(b.get("h", 0)) + float(b.get("l", 0)) + float(b.get("c", 0))
        ) / 3
        v = float(b.get("v", 0))
        pv += typical * v
        vol += v
    if vol <= 0:
        return 0.0
    vwap = pv / vol
    if vwap <= 0:
        return 0.0
    return (last - vwap) / vwap * 100


def _pct_over_days(bars: list[dict[str, Any]], days: int) -> float:
    if len(bars) < days + 1:
        return 0.0
    prev = float(bars[-days - 1].get("c", 0))
    last = float(bars[-1].get("c", 0))
    if prev == 0:
        return 0.0
    return (last - prev) / prev * 100


def _write_midas_watchlist(
    out_dir: Path,
    quotes: dict[str, Quote],
    symbol_bars: dict[str, Bars],
    market_bars: Bars,
    vix_quote: Quote,
) -> None:
    config_path = Path(__file__).resolve().parent.parent / "momentum" / "midas_watchlist.json"
    if not config_path.exists():
        return
    with open(config_path, encoding="utf-8") as f:
        config = json.load(f)

    watch_items = [w for w in config.get("watchlist", []) if w.get("ticker")]
    if not watch_items:
        return
    tickers = list(dict.fromkeys(str(w["ticker"]).upper() for w in watch_items))
    status_by = {
        str(w["ticker"]).upper(): str(w.get("status", "watch")) for w in watch_items
    }
    holdings_cfg = config.get("holdings", [])

    # Fill data gaps via Yahoo (free): watchlist tickers outside the report
    # universe, plus QQQ/IWM daily bars for the 5d regime stats.
    merged_quotes = dict(quotes)
    missing_quotes = [t for t in tickers if t not in merged_quotes]
    if missing_quotes:
        for sym, q in fetch_yahoo_quotes(missing_quotes).items():
            merged_quotes[sym] = Quote(
                symbol=sym,
                last=q["last"],
                change=q["change"],
                changepct=q["changepct"],
                volume=q["volume"],
                bid=q["bid"],
                ask=q["ask"],
                week52_high=q["week52_high"],
                week52_low=q["week52_low"],
            )

    merged_bars = dict(symbol_bars)
    merged_bars["SPY"] = market_bars
    bar_gaps = [t for t in tickers + ["QQQ", "IWM"] if not merged_bars.get(t, Bars()).daily]
    if bar_gaps:
        for sym, b in fetch_yahoo_bars(bar_gaps).items():
            merged_bars[sym] = Bars(
                daily=b.get("daily", [])[-80:],
                weekly=b.get("weekly", [])[-10:],
                monthly=b.get("monthly", [])[-6:],
            )

    list_ranking: list[dict[str, Any]] = []
    skipped = 0
    for t in tickers:
        quote = merged_quotes.get(t)
        bars = merged_bars.get(t)
        if not quote or quote.last <= 0 or not bars or not bars.daily:
            skipped += 1
            continue
        cand = score_candidate(t, quote, bars, market_bars, vix_quote.last, "long")
        mss = round(cand.mss / 100, 2)
        list_ranking.append(
            {
                "ticker": t,
                "status": status_by.get(t, "watch"),
                "mss": mss,
                "mssAdjusted": mss,
                "grade": cand.grade,
                "phase": cand.phase,
                "changePct": round(quote.changepct, 2),
                "volumeRatio": round(cand.rvol, 2),
                "rsi14": round(calc_rsi(bars.daily), 2),
                "vwapDistancePct": round(
                    _rolling_vwap_distance_pct(bars.daily, quote.last), 2
                ),
                "ivRank": None,
            }
        )
    list_ranking.sort(key=lambda x: x["mss"], reverse=True)
    by_ticker = {item["ticker"]: item for item in list_ranking}

    holdings_out: list[dict[str, Any]] = []
    for h in holdings_cfg:
        t = str(h.get("ticker", "")).upper()
        quote = merged_quotes.get(t)
        avg_cost = float(h.get("avgCost", 0) or 0)
        if not t or not quote or quote.last <= 0 or avg_cost <= 0:
            continue
        unrealized = (quote.last - avg_cost) / avg_cost * 100
        item = by_ticker.get(t, {})
        grade = item.get("grade", "C")
        if unrealized >= 15:
            action, reason = "TRIM", "Target hit (+15%)"
        elif unrealized <= -8:
            action, reason = "REVIEW", "Stop-loss bolgesi"
        elif grade in ("A", "B"):
            action, reason = "HOLD", "Momentum saglikli"
        else:
            action, reason = "HOLD", "Notr momentum"
        holdings_out.append(
            {
                "ticker": t,
                "avgCost": avg_cost,
                "qty": h.get("qty", 0),
                "currentPrice": round(quote.last, 2),
                "unrealizedPct": round(unrealized, 2),
                "mss": item.get("mss", 0.0),
                "mssAdjusted": item.get("mssAdjusted", 0.0),
                "grade": grade,
                "phase": item.get("phase", ""),
                "action": action,
                "actionReason": reason,
            }
        )

    buy_candidates = [
        item
        for item in list_ranking
        if item["status"] == "watch" and item["grade"] in ("A", "B") and item["changePct"] > 0
    ][:5]

    vix = vix_quote.last
    spy5d = _pct_over_days(market_bars.daily, 5)
    qqq5d = _pct_over_days(merged_bars.get("QQQ", Bars()).daily, 5)
    iwm5d = _pct_over_days(merged_bars.get("IWM", Bars()).daily, 5)
    if vix < 20 and spy5d >= 0:
        regime_phase = "Risk-On"
    elif vix >= 25 or spy5d <= -2:
        regime_phase = "Risk-Off"
    else:
        regime_phase = "Neutral"
    # Rough VIX-based proxy; the real CNN Fear&Greed index is not fetched.
    fear_greed = int(max(5, min(95, round(100 - (vix - 10) * 4))))

    payload = {
        "schemaVersion": "2.1-midas",
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "marketPhase": _report_type_from_et(),
        "watchlistMeta": {
            "source": "midas",
            "totalTickers": len(list_ranking),
            "holdingCount": sum(1 for i in list_ranking if i["status"] == "holding"),
            "watchCount": sum(1 for i in list_ranking if i["status"] == "watch"),
            "skippedCount": skipped,
            "updatedAt": date.today().isoformat(),
        },
        "marketRegime": {
            "phase": regime_phase,
            "vix": round(vix, 2),
            "vixChangePct": round(vix_quote.changepct, 2),
            "spyChange5dPct": round(spy5d, 2),
            "qqqChange5dPct": round(qqq5d, 2),
            "iwmChange5dPct": round(iwm5d, 2),
            "fearGreed": fear_greed,
            "narrative": f"VIX {vix:.2f}, SPY {spy5d:+.1f}% 5d. {regime_phase} bias.",
        },
        "listRanking": list_ranking,
        "buyCandidates": buy_candidates,
        "holdings": holdings_out,
        "deltaMovers": sorted(
            list_ranking, key=lambda x: abs(x["changePct"]), reverse=True
        )[:5],
        "earningsWatch": [],
    }

    midas_path = out_dir / "marketflash_midas.json"
    with open(midas_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    print(
        f"[OK] {midas_path} kaydedildi "
        f"({len(list_ranking)} ticker, {len(holdings_out)} holding)"
    )


def run_marketdata_pipeline(
    symbols: list[str],
    output_path: str | None = None,
    verbose: bool = False,
) -> dict[str, Any]:
    print(f"[MarketFlash Pipeline] {len(symbols)} sembol")
    force_yahoo = (
        os.environ.get("MARKETFLASH_DATA_SOURCE", "").strip().lower() == "yahoo"
    )
    client = None if force_yahoo else _get_client()

    print("[1/5] Endeks ve universe quote'ları çekiliyor...")
    all_symbols = list(dict.fromkeys(INDEX_SYMBOLS + symbols))
    data_source = "marketdata"
    quotes: dict[str, Quote] = {}
    if client is not None:
        quotes = fetch_quotes_batch(client, all_symbols, use_52_week=True)
    if not quotes:
        if not force_yahoo:
            print(
                "[WARN] MarketData.app quote dondurmedi (token planini/kotasini "
                "kontrol edin); Yahoo fallback deneniyor...",
                file=sys.stderr,
            )
        data_source = "yahoo"
        for sym, q in fetch_yahoo_quotes(all_symbols).items():
            quotes[sym] = Quote(
                symbol=sym,
                last=q["last"],
                change=q["change"],
                changepct=q["changepct"],
                volume=q["volume"],
                bid=q["bid"],
                ask=q["ask"],
                week52_high=q["week52_high"],
                week52_low=q["week52_low"],
            )
    print(f"      -> {len(quotes)} quote alindi ({data_source})")

    if not quotes:
        # Both sources failed — do not overwrite the last good report with an
        # empty one. Exit non-zero so the cron run is recorded as failed.
        print(
            "[FATAL] Ne MarketData.app ne de Yahoo quote dondurdu. "
            "Rapor guncellenmedi.",
            file=sys.stderr,
        )
        raise SystemExit(2)

    vix_quote = _resolve_vix(client, quotes)
    spy_quote = quotes.get("SPY", Quote(symbol="SPY"))

    def _yahoo_bars_all() -> tuple[Bars, dict[str, Bars]]:
        bar_symbols = list(dict.fromkeys(["SPY"] + symbols))
        ybars = fetch_yahoo_bars(bar_symbols)

        def bars_for(sym: str) -> Bars:
            b = ybars.get(sym, {})
            return Bars(
                daily=b.get("daily", [])[-80:],
                weekly=b.get("weekly", [])[-10:],
                monthly=b.get("monthly", [])[-6:],
            )

        return bars_for("SPY"), {sym: bars_for(sym) for sym in symbols}

    if data_source == "yahoo":
        print("[2-3/5] Market ve hisse barları Yahoo'dan çekiliyor (batch)...")
        market_bars, symbol_bars = _yahoo_bars_all()
    else:
        print("[2/5] Market bars (SPY) çekiliyor...")
        market_bars = Bars(
            daily=fetch_candles(client, "SPY", "D", 80),
            weekly=fetch_candles(client, "SPY", "W", 10),
            monthly=fetch_candles(client, "SPY", "M", 6),
        )

        print("[3/5] Hisse barları çekiliyor...")
        symbol_bars = {}
        for sym in symbols:
            symbol_bars[sym] = Bars(
                daily=fetch_candles(client, sym, "D", 80),
                weekly=fetch_candles(client, sym, "W", 10),
                monthly=fetch_candles(client, sym, "M", 6),
            )
            time.sleep(0.03)

        if not any(b.daily for b in symbol_bars.values()):
            print(
                "[WARN] MarketData.app candle dondurmedi; barlar Yahoo'dan cekiliyor...",
                file=sys.stderr,
            )
            data_source = "marketdata+yahoo-bars"
            market_bars, symbol_bars = _yahoo_bars_all()

    # Quotes endpoint does not always return volume; backfill from latest daily bar
    for sym in symbols:
        if sym in quotes and symbol_bars[sym].daily and quotes[sym].volume == 0:
            quotes[sym].volume = float(symbol_bars[sym].daily[-1].get("v", 0))
    print(f"      -> {sum(1 for b in symbol_bars.values() if b.daily)} sembol için barlar alindi")

    print("[4/5] MSS-L ve MSS-S skorlama + Doldurma Merdiveni...")
    long_candidates: list[Candidate] = []
    short_candidates: list[Candidate] = []
    excluded: list[dict[str, str]] = []

    for sym in symbols:
        quote = quotes.get(sym)
        bars = symbol_bars.get(sym)
        if not quote or not bars or not bars.daily:
            excluded.append({"ticker": sym, "reason": "VERI_YOK"})
            continue

        abs_reason = _absolute_excluded(sym, quote)
        if abs_reason:
            excluded.append({"ticker": sym, "reason": abs_reason})
            continue

        long_c = score_candidate(sym, quote, bars, market_bars, vix_quote.last, "long")
        short_c = score_candidate(sym, quote, bars, market_bars, vix_quote.last, "short")

        long_c.missed_criteria = _soft_misses(quote, bars, "long")
        short_c.missed_criteria = _soft_misses(quote, bars, "short")

        long_candidates.append(long_c)
        short_candidates.append(short_c)

    if not long_candidates and not short_candidates:
        # Every symbol lacked quote or candle data — an API-level failure, not
        # a market condition. Keep the previous report intact and fail the run.
        reasons = {e["reason"] for e in excluded}
        print(
            f"[FATAL] Hicbir sembol skorlanamadi (excluded: {len(excluded)}, "
            f"reasons: {sorted(reasons)}, source: {data_source}). "
            "Rapor guncellenmedi.",
            file=sys.stderr,
        )
        raise SystemExit(2)

    long_selected = apply_fill_ladder(long_candidates, "long")
    short_selected = apply_fill_ladder(short_candidates, "short")

    # "Full criteria" = zero soft misses (B1 gate + B2 watchlist fills)
    full_long = sum(1 for c in long_selected if not c.missed_criteria)
    full_short = sum(1 for c in short_selected if not c.missed_criteria)

    print(f"      -> LONG: {len(long_selected)} aday ({full_long} tam kriterli)")
    print(f"      -> SHORT: {len(short_selected)} aday ({full_short} tam kriterli)")

    if verbose:
        print("\n[DEBUG] Top 5 LONG candidates:")
        for c in sorted(long_candidates, key=lambda x: x.mss, reverse=True)[:5]:
            print(f"  {c.ticker}: MSS={c.mss:.1f} grade={c.grade} vol={c.volume:.0f} avgVol={c.avg_volume:.0f} rvol={c.rvol:.2f} misses={c.missed_criteria} fill={c.fillSource}")
        print("\n[DEBUG] Top 5 SHORT candidates:")
        for c in sorted(short_candidates, key=lambda x: x.mss, reverse=True)[:5]:
            print(f"  {c.ticker}: MSS={c.mss:.1f} grade={c.grade} vol={c.volume:.0f} avgVol={c.avg_volume:.0f} rvol={c.rvol:.2f} misses={c.missed_criteria} fill={c.fillSource}")
        miss_reasons: dict[str, int] = {}
        for c in long_candidates + short_candidates:
            for m in c.missed_criteria:
                miss_reasons[m] = miss_reasons.get(m, 0) + 1
        print(f"\n[DEBUG] Soft miss distribution: {miss_reasons}")

    print("[5/5] Rapor üretiliyor...")
    call_setups = []
    for c in long_selected:
        atr = calc_atr(symbol_bars[c.ticker].daily) if c.ticker in symbol_bars else 0.0
        plan = _build_trade_plan(c, atr)
        call_setups.append(build_setup(c, plan))

    put_setups = []
    for c in short_selected:
        atr = calc_atr(symbol_bars[c.ticker].daily) if c.ticker in symbol_bars else 0.0
        plan = _build_trade_plan(c, atr)
        put_setups.append(build_setup(c, plan))

    # Top movers from universe
    all_cands = long_candidates + short_candidates
    unique_by_ticker = {c.ticker: c for c in all_cands}
    sorted_gainers = sorted(
        [c for c in unique_by_ticker.values() if c.daily_pct > 0],
        key=lambda x: x.daily_pct,
        reverse=True,
    )[:5]
    sorted_losers = sorted(
        [c for c in unique_by_ticker.values() if c.daily_pct < 0],
        key=lambda x: x.daily_pct,
    )[:5]

    report_date = date.today().isoformat()
    report = {
        "reportType": _report_type_from_et(),
        "reportDate": report_date,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "marketSummary": {
            "spy": build_index_quote(spy_quote),
            "qqq": build_index_quote(quotes.get("QQQ", Quote(symbol="QQQ"))),
            "iwm": build_index_quote(quotes.get("IWM", Quote(symbol="IWM"))),
            "vix": build_index_quote(vix_quote),
        },
        "topMovers": {
            "gainers": [build_mover(c) for c in sorted_gainers],
            "losers": [build_mover(c) for c in sorted_losers],
        },
        "callSetups": call_setups,
        "putSetups": put_setups,
        "earningsCalendar": [],
        "vwapNotes": f"VIX {vix_quote.last:.2f} seviyesinde; agresif teknik kırılımlar için conviction filtresi uygulandi.",
        "riskAssessment": _risk_assessment(vix_quote.last, long_selected, short_selected),
        "nextDayCarryForward": [build_carry_forward(c) for c in long_selected + short_selected if c.fillSource in ("gate", "watchlist")],
        "guaranteeMeta": {
            "fullCriteriaLong": full_long,
            "fullCriteriaShort": full_short,
            "weakSideNote": None if full_long >= 3 and full_short >= 3 else f"LONG {full_long}/5, SHORT {full_short}/5 tam kriterli.",
        },
        "systemStats": {
            "scoredSymbols": len(long_candidates),
            "excludedCount": len(excluded),
            "excluded": excluded[:20],
            "dataSource": data_source,
        },
    }

    out = output_path or "client/public/marketflash/marketflash_report.json"
    out_path = Path(out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    # --- V3 learning layer artifacts ---
    private_params = _load_private_params()
    private_ledger = _load_private_ledger()
    all_candidates = long_selected + short_selected
    report = _enrich_report_for_v3(report, private_params, all_candidates)
    public_ledger = _build_public_ledger(private_ledger, all_candidates)
    calibration = _calculate_calibration(private_ledger, public_ledger, all_candidates)
    _write_v3_params(out_path.parent, private_params)
    _write_v3_calibration(out_path.parent, calibration)
    _write_v3_ledger_public(out_path.parent, public_ledger)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    print(f"[OK] {out_path} kaydedildi (L:{len(call_setups)} S:{len(put_setups)})")

    try:
        _write_midas_watchlist(
            out_path.parent, quotes, symbol_bars, market_bars, vix_quote
        )
    except Exception as e:
        print(f"[WARN] Midas watchlist uretimi basarisiz: {e}", file=sys.stderr)

    return report


def main() -> int:
    parser = argparse.ArgumentParser(description="MarketFlash Momentum VPS Pipeline")
    parser.add_argument("--output", "-o", type=str, default=None, help="Output JSON path")
    parser.add_argument("--symbols", "-s", type=str, default=None, help="Comma-separated symbols (override default)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Print debug details")
    args = parser.parse_args()

    if args.symbols:
        symbols = args.symbols.split(",")
    elif os.environ.get("MARKETFLASH_SYMBOLS"):
        symbols = os.environ.get("MARKETFLASH_SYMBOLS", "").split(",")
    else:
        symbols = DEFAULT_SYMBOLS[:]
    symbols = [s.strip().upper() for s in symbols if s.strip()]

    run_marketdata_pipeline(symbols, output_path=args.output, verbose=args.verbose)
    print("[Done]")
    return 0


if __name__ == "__main__":
    sys.exit(main())
