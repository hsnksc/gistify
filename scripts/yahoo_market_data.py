"""Yahoo Finance fallback data source shared by marketflash and midas pipelines.

Used when MarketData.app returns no data (invalid token, exhausted plan or
credits) or when forced via MARKETFLASH_DATA_SOURCE / MIDAS_DATA_SOURCE=yahoo.

Quotes come from a single yahooquery bulk-quotes request for the whole
universe. Daily bars come from one batched yfinance download and are resampled
locally to weekly/monthly, so a 100-symbol universe costs a handful of Yahoo
requests instead of hundreds of per-symbol candle calls.

Bar dicts use MarketData-compatible keys {t, o, h, l, c, v}; "t" is unix
seconds. Quote "changepct" is in percent units (1.31 == +1.31%).
"""

from __future__ import annotations

import sys
from typing import Any

_YAHOO_SYMBOL_OVERRIDES = {"VIX": "^VIX"}


def _to_yahoo(symbol: str) -> str:
    return _YAHOO_SYMBOL_OVERRIDES.get(symbol.upper(), symbol.upper())


def fetch_yahoo_quotes(symbols: list[str]) -> dict[str, dict[str, Any]]:
    """Bulk quotes keyed by the caller's symbol names."""
    out: dict[str, dict[str, Any]] = {}
    if not symbols:
        return out

    reverse = {_to_yahoo(s): s.upper() for s in symbols}
    try:
        from yahooquery import Ticker

        raw = Ticker(list(reverse.keys())).quotes
    except Exception as e:
        print(f"[WARN] Yahoo quotes fetch failed: {e}", file=sys.stderr)
        return out

    if not isinstance(raw, dict):
        print(f"[WARN] Yahoo quotes unexpected response: {str(raw)[:200]}", file=sys.stderr)
        return out

    for ysym, q in raw.items():
        if not isinstance(q, dict):
            continue
        last = q.get("regularMarketPrice")
        if last is None:
            continue
        sym = reverse.get(str(ysym), str(ysym).upper())
        out[sym] = {
            "last": float(last),
            "change": float(q.get("regularMarketChange") or 0.0),
            "changepct": float(q.get("regularMarketChangePercent") or 0.0),
            "volume": float(q.get("regularMarketVolume") or 0.0),
            "bid": float(q.get("bid") or 0.0),
            "ask": float(q.get("ask") or 0.0),
            "week52_high": float(q.get("fiftyTwoWeekHigh") or 0.0) or None,
            "week52_low": float(q.get("fiftyTwoWeekLow") or 0.0) or None,
        }
    return out


def _frame_to_bars(frame: Any) -> list[dict[str, Any]]:
    bars: list[dict[str, Any]] = []
    for ts, row in frame.iterrows():
        bars.append(
            {
                "t": int(ts.timestamp()),
                "o": float(row["Open"]),
                "h": float(row["High"]),
                "l": float(row["Low"]),
                "c": float(row["Close"]),
                "v": float(row["Volume"]),
            }
        )
    return bars


def fetch_yahoo_bars(
    symbols: list[str], period: str = "9mo"
) -> dict[str, dict[str, list[dict[str, Any]]]]:
    """Daily/weekly/monthly bars per symbol from one batched daily download."""
    out: dict[str, dict[str, list[dict[str, Any]]]] = {}
    if not symbols:
        return out

    reverse = {_to_yahoo(s): s.upper() for s in symbols}
    try:
        import yfinance as yf

        df = yf.download(
            list(reverse.keys()),
            period=period,
            interval="1d",
            group_by="ticker",
            auto_adjust=False,
            progress=False,
            threads=True,
        )
    except Exception as e:
        print(f"[WARN] Yahoo bars download failed: {e}", file=sys.stderr)
        return out

    if df is None or df.empty:
        print("[WARN] Yahoo bars download returned no data", file=sys.stderr)
        return out

    multi = getattr(df.columns, "nlevels", 1) > 1
    agg = {"Open": "first", "High": "max", "Low": "min", "Close": "last", "Volume": "sum"}

    for ysym, sym in reverse.items():
        try:
            sub = df[ysym] if multi else df
        except KeyError:
            continue
        sub = sub.dropna(subset=["Open", "High", "Low", "Close"])
        if sub.empty:
            continue
        sub = sub.assign(Volume=sub["Volume"].fillna(0.0))
        weekly = sub.resample("W-FRI").agg(agg).dropna(subset=["Close"])
        monthly = sub.resample("ME").agg(agg).dropna(subset=["Close"])
        out[sym] = {
            "daily": _frame_to_bars(sub),
            "weekly": _frame_to_bars(weekly),
            "monthly": _frame_to_bars(monthly),
        }
    return out
