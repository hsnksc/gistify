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
import sys
import time
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from marketdata import MarketDataClient, OutputFormat

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
    return hasattr(result, "s") and str(getattr(result, "s", "")).lower() == "error"


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
                    print(f"[WARN] Quotes API error: {result}", file=sys.stderr)
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


def _resolve_vix(client: MarketDataClient, quotes: dict[str, Quote]) -> Quote:
    """Resolve VIX level from quotes, candles, or yfinance fallback."""
    vix = quotes.get("VIX")
    if vix and vix.last > 0:
        return vix
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
                print(f"[WARN] Candles API error for {symbol}: {result}", file=sys.stderr)
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


# ─── MAIN PIPELINE ───────────────────────────────────────────────────────────

def run_marketdata_pipeline(
    symbols: list[str],
    output_path: str | None = None,
    verbose: bool = False,
) -> dict[str, Any]:
    print(f"[MarketFlash Pipeline] {len(symbols)} sembol")
    client = _get_client()

    print("[1/5] Endeks ve universe quote'ları çekiliyor...")
    all_symbols = list(dict.fromkeys(INDEX_SYMBOLS + symbols))
    quotes = fetch_quotes_batch(client, all_symbols, use_52_week=True)
    print(f"      -> {len(quotes)} quote alindi")

    vix_quote = _resolve_vix(client, quotes)
    spy_quote = quotes.get("SPY", Quote(symbol="SPY"))

    print("[2/5] Market bars (SPY) çekiliyor...")
    market_bars = Bars(
        daily=fetch_candles(client, "SPY", "D", 80),
        weekly=fetch_candles(client, "SPY", "W", 10),
        monthly=fetch_candles(client, "SPY", "M", 6),
    )

    print("[3/5] Hisse barları çekiliyor...")
    symbol_bars: dict[str, Bars] = {}
    for sym in symbols:
        symbol_bars[sym] = Bars(
            daily=fetch_candles(client, sym, "D", 80),
            weekly=fetch_candles(client, sym, "W", 10),
            monthly=fetch_candles(client, sym, "M", 6),
        )
        # Quotes endpoint does not always return volume; backfill from latest daily bar
        if sym in quotes and symbol_bars[sym].daily:
            latest_daily = symbol_bars[sym].daily[-1]
            if quotes[sym].volume == 0:
                quotes[sym].volume = float(latest_daily.get("v", 0))
        time.sleep(0.03)
    print(f"      -> {len(symbol_bars)} sembol için barlar alindi")

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
        },
    }

    out = output_path or "client/public/marketflash/marketflash_report.json"
    out_path = Path(out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    print(f"[OK] {out_path} kaydedildi (L:{len(call_setups)} S:{len(put_setups)})")

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
