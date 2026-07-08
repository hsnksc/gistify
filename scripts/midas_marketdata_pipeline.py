#!/usr/bin/env python3
"""
Midas MarketData.app Pipeline
------------------------------
Fetches pre-market aware stock quotes and weekly/monthly candles from
MarketData.app and writes midas_signals.json (MidasSignalsData format).

Environment:
    MARKETDATA_TOKEN - Required MarketData.app API token.

Usage:
    python3 scripts/midas_marketdata_pipeline.py
    python3 scripts/midas_marketdata_pipeline.py --output /path/to/midas_signals.json
    python3 scripts/midas_marketdata_pipeline.py --mode aggressive
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from marketdata import MarketDataClient, OutputFormat

from yahoo_market_data import fetch_yahoo_bars, fetch_yahoo_quotes

DEFAULT_SYMBOLS = [
    "HOOD", "HIMS", "TSM", "META", "MU", "ADBE", "PLTR", "PLTU", "AMD", "AMDL",
    "SMCX", "SMCI", "NVDA", "NVDU", "SOXL", "SOXS", "AMZN", "MSFT", "AAPL", "AAPX",
    "GOOG", "GOOGL", "GGLL", "QCOM", "ARM", "TSLA", "AMUU", "INTC", "AVGO", "MRVL",
    "ASML", "ORCL", "SFTBY", "LSCC", "BE", "TQQQ", "TSMX", "TXN", "LRCX", "ADI",
    "KLAC", "AMAT", "NXPI", "MPWR", "MCHP", "ON", "TER", "ENTG", "SWKS", "ONTO",
]

BATCH_SIZE = 50  # MarketData.app supports many symbols per request; keep safe
MAX_RETRIES = 3
RETRY_BACKOFF = [2, 4, 8]


def _get_client() -> MarketDataClient:
    token = os.environ.get("MARKETDATA_TOKEN", "").strip()
    if not token:
        raise RuntimeError("MARKETDATA_TOKEN environment variable is required")
    return MarketDataClient(token=token)


def _is_error_result(result: Any) -> bool:
    """Detect MarketDataClientErrorResult without importing internal types."""
    if result is None:
        return True
    if isinstance(result, dict):
        return str(result.get("s", "")).lower() == "error"
    if isinstance(result, (list, str)):
        return False
    # SDK returns a MarketDataClientErrorResult object (not a dict) on HTTP
    # errors (401 invalid token, 402 plan/credits, 429 rate limit).
    return True


def fetch_quotes_batch(client: MarketDataClient, symbols: list[str]) -> dict[str, dict[str, Any]]:
    """Fetch extended quotes for a batch of symbols."""
    quotes: dict[str, dict[str, Any]] = {}
    if not symbols:
        return quotes

    for attempt in range(MAX_RETRIES):
        try:
            result = client.stocks.quotes(
                symbols,
                extended=True,
                output_format=OutputFormat.JSON,
            )
            if _is_error_result(result):
                print(f"[ERROR] Quotes API error: {str(result)[:400]}", file=sys.stderr)
                break

            if isinstance(result, dict) and "symbol" in result:
                syms = result["symbol"]
                for key in ("last", "changepct", "change", "volume", "bid", "ask", "mid", "updated"):
                    values = result.get(key, [])
                    for i, sym in enumerate(syms):
                        if i >= len(values):
                            continue
                        quotes.setdefault(str(sym).upper(), {})[key] = values[i]
            return quotes
        except Exception as e:
            print(f"[WARN] Quotes fetch failed (attempt {attempt + 1}/{MAX_RETRIES}): {e}", file=sys.stderr)
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_BACKOFF[attempt])

    return quotes


def fetch_candles(
    client: MarketDataClient,
    symbol: str,
    resolution: str,
    countback: int = 5,
) -> list[dict[str, Any]]:
    """Fetch historical candles for a single symbol."""
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
            print(
                f"[WARN] Candles fetch failed for {symbol} (attempt {attempt + 1}/{MAX_RETRIES}): {e}",
                file=sys.stderr,
            )
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_BACKOFF[attempt])

    return []


def calc_period_pct(bars: list[dict[str, Any]]) -> float | None:
    """Calculate % change between the last two candles."""
    if not bars or len(bars) < 2:
        return None
    bars_sorted = sorted(bars, key=lambda b: b.get("t", ""))
    prev_close = float(bars_sorted[-2]["c"])
    last_close = float(bars_sorted[-1]["c"])
    if prev_close == 0:
        return None
    return ((last_close - prev_close) / prev_close) * 100


def generate_signal_tags(daily_pct: float, weekly_pct: float, monthly_pct: float) -> list[str]:
    tags = []
    if daily_pct >= 5:
        tags.append("DAILY_STRONG_UP")
    elif daily_pct >= 1.5:
        tags.append("DAILY_UP")
    elif daily_pct <= -5:
        tags.append("DAILY_STRONG_DOWN")
    elif daily_pct <= -1.5:
        tags.append("DAILY_DOWN")

    if weekly_pct >= 5:
        tags.append("WEEKLY_STRONG_UP")
    elif weekly_pct >= 1.5:
        tags.append("WEEKLY_UP")
    elif weekly_pct <= -5:
        tags.append("WEEKLY_STRONG_DOWN")
    elif weekly_pct <= -1.5:
        tags.append("WEEKLY_DOWN")

    if monthly_pct >= 10:
        tags.append("MONTHLY_STRONG_UP")
    elif monthly_pct >= 3:
        tags.append("MONTHLY_UP")
    elif monthly_pct <= -10:
        tags.append("MONTHLY_STRONG_DOWN")
    elif monthly_pct <= -3:
        tags.append("MONTHLY_DOWN")

    if daily_pct > 0 and weekly_pct > 0 and monthly_pct > 0:
        tags.append("ALL_UP")
    elif daily_pct < 0 and weekly_pct < 0 and monthly_pct < 0:
        tags.append("ALL_DOWN")

    return tags


def generate_signal(daily_pct: float, weekly_pct: float, monthly_pct: float, mode: str = "default") -> tuple[str, float]:
    pos = sum(1 for x in (daily_pct, weekly_pct, monthly_pct) if x > 0)
    neg = sum(1 for x in (daily_pct, weekly_pct, monthly_pct) if x < 0)
    strong_up = sum(1 for x in (daily_pct, weekly_pct, monthly_pct) if x >= 5)
    strong_down = sum(1 for x in (daily_pct, weekly_pct, monthly_pct) if x <= -5)

    if mode == "aggressive":
        if strong_up >= 2 and pos == 3:
            return "STRONG_BUY", 6.0
        if strong_down >= 2 and neg == 3:
            return "STRONG_SELL", -6.0
        if pos >= 2 and daily_pct > 0:
            return "BUY", 4.0
        if neg >= 2 and daily_pct < 0:
            return "SELL", -4.0
        return "HOLD", 0.0

    if mode == "conservative":
        if pos == 3 and daily_pct >= 3 and weekly_pct >= 5 and monthly_pct >= 10:
            return "STRONG_BUY", 6.0
        if neg == 3 and daily_pct <= -3 and weekly_pct <= -5 and monthly_pct <= -10:
            return "STRONG_SELL", -6.0
        if pos == 3 and weekly_pct > 0 and monthly_pct > 5:
            return "BUY", 3.0
        if neg == 3 and weekly_pct < 0 and monthly_pct < -5:
            return "SELL", -3.0
        return "HOLD", 0.0

    if pos == 3 and strong_up >= 1:
        return "STRONG_BUY", 6.0
    if neg == 3 and strong_down >= 1:
        return "STRONG_SELL", -6.0
    if pos >= 2 and weekly_pct > 0 and monthly_pct > 0:
        return "BUY", 4.0
    if neg >= 2 and weekly_pct < 0 and monthly_pct < 0:
        return "SELL", -4.0
    if pos == 3:
        return "BUY", 3.0
    if neg == 3:
        return "SELL", -3.0
    if pos >= 2:
        return "BUY", 2.0
    if neg >= 2:
        return "SELL", -2.0
    return "HOLD", 0.0


def run_marketdata_pipeline(
    symbols: list[str],
    output_path: str | None = None,
    mode: str = "default",
) -> dict[str, Any]:
    print(f"[MarketData Pipeline] {len(symbols)} sembol, mode={mode}")
    force_yahoo = os.environ.get("MIDAS_DATA_SOURCE", "").strip().lower() == "yahoo"
    client = None if force_yahoo else _get_client()

    print("[1/4] Extended quote verileri cekiliyor (fiyat + daily pct)...")
    data_source = "marketdata"
    quotes: dict[str, dict[str, Any]] = {}
    if client is not None:
        for i in range(0, len(symbols), BATCH_SIZE):
            batch = symbols[i:i + BATCH_SIZE]
            batch_quotes = fetch_quotes_batch(client, batch)
            quotes.update(batch_quotes)
            if i + BATCH_SIZE < len(symbols):
                time.sleep(0.2)
    if not quotes:
        if not force_yahoo:
            print(
                "[WARN] MarketData.app quote dondurmedi (token planini/kotasini "
                "kontrol edin); Yahoo fallback deneniyor...",
                file=sys.stderr,
            )
        data_source = "yahoo"
        for sym, q in fetch_yahoo_quotes(symbols).items():
            quotes[sym] = {
                "last": q["last"],
                "change": q["change"],
                # Pipeline expects a decimal fraction (0.0131 = 1.31%)
                "changepct": q["changepct"] / 100.0,
                "volume": q["volume"],
                "bid": q["bid"],
                "ask": q["ask"],
            }
    print(f"      -> {len(quotes)} quote alindi ({data_source})")

    weekly_bars: dict[str, list[dict[str, Any]]] = {}
    monthly_bars: dict[str, list[dict[str, Any]]] = {}

    def _load_yahoo_bars() -> None:
        ybars = fetch_yahoo_bars(symbols)
        for sym, b in ybars.items():
            if b.get("weekly"):
                weekly_bars[sym] = b["weekly"][-5:]
            if b.get("monthly"):
                monthly_bars[sym] = b["monthly"][-3:]

    if data_source == "yahoo":
        print("[2-3/4] Haftalik/aylik barlar Yahoo'dan cekiliyor (batch)...")
        _load_yahoo_bars()
    else:
        print("[2/4] Haftalik barlar cekiliyor...")
        for sym in symbols:
            bars = fetch_candles(client, sym, resolution="W", countback=5)
            if bars:
                weekly_bars[sym] = bars
            time.sleep(0.05)
        print(f"      -> {len(weekly_bars)} sembol haftalik bar alindi")

        print("[3/4] Aylik barlar cekiliyor...")
        for sym in symbols:
            bars = fetch_candles(client, sym, resolution="M", countback=3)
            if bars:
                monthly_bars[sym] = bars
            time.sleep(0.05)

        if not weekly_bars and not monthly_bars:
            print(
                "[WARN] MarketData.app candle dondurmedi; barlar Yahoo'dan cekiliyor...",
                file=sys.stderr,
            )
            data_source = "marketdata+yahoo-bars"
            _load_yahoo_bars()
    print(f"      -> {len(weekly_bars)} haftalik / {len(monthly_bars)} aylik bar alindi")

    print("[4/4] Sinyaller uretiliyor...")
    signals = []
    errors = []
    for sym in symbols:
        quote = quotes.get(sym)
        if not quote or "last" not in quote:
            errors.append(f"{sym}: fiyat verisi alinamadi")
            continue

        price = float(quote["last"])
        # changepct is already a decimal (e.g. 0.0131 = 1.31%)
        raw_change_pct = quote.get("changepct")
        daily_pct = (float(raw_change_pct) * 100) if raw_change_pct is not None else 0.0

        w_bars = weekly_bars.get(sym, [])
        m_bars = monthly_bars.get(sym, [])
        weekly_pct = calc_period_pct(w_bars) if len(w_bars) >= 2 else 0.0
        monthly_pct = calc_period_pct(m_bars) if len(m_bars) >= 2 else 0.0

        if weekly_pct is None:
            weekly_pct = 0.0
        if monthly_pct is None:
            monthly_pct = 0.0

        tags = generate_signal_tags(daily_pct, weekly_pct, monthly_pct)
        sig, strength = generate_signal(daily_pct, weekly_pct, monthly_pct, mode=mode)

        record = {
            "symbol": sym,
            "signal": sig,
            "strength": strength,
            "signals": tags,
            "daily_pct": round(daily_pct, 2),
            "weekly_pct": round(weekly_pct, 2),
            "monthly_pct": round(monthly_pct, 2),
            "price": round(price, 2),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        signals.append(record)

    if not signals:
        # API auth/quota failure — keep the last good snapshot on disk and
        # fail the run so the cron history records the real problem.
        print(
            "[FATAL] MarketData.app hicbir sinyal uretmedi (quotes/candles bos). "
            "Token planini/kotasini kontrol edin. Cikti dosyasi guncellenmedi.",
            file=sys.stderr,
        )
        raise SystemExit(2)

    signal_priority = {"STRONG_BUY": 4, "BUY": 3, "HOLD": 2, "SELL": 1, "STRONG_SELL": 0}
    signals.sort(
        key=lambda s: (signal_priority.get(s["signal"], 2), abs(s["strength"])),
        reverse=True,
    )

    result = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "symbol_count": len(symbols),
        "successful": len(signals),
        "failed": len(errors),
        "mode": mode,
        "dataSource": data_source,
        "signals": signals,
        "errors": errors,
    }

    out = output_path or "midas_signals.json"
    out_path = Path(out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    print(f"[OK] {out_path} kaydedildi ({len(signals)} sinyal, {len(errors)} hata)")

    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Midas MarketData.app Pipeline")
    parser.add_argument("--output", "-o", type=str, default=None, help="Output JSON path")
    parser.add_argument("--mode", "-m", type=str, default="default", choices=["default", "aggressive", "conservative"])
    parser.add_argument("--symbols", "-s", type=str, default=None, help="Comma-separated symbols (override default)")
    args = parser.parse_args()

    symbols = args.symbols.split(",") if args.symbols else DEFAULT_SYMBOLS[:]
    symbols = [s.strip().upper() for s in symbols if s.strip()]

    result = run_marketdata_pipeline(symbols, output_path=args.output, mode=args.mode)

    summary: dict[str, int] = {}
    for s in result["signals"]:
        summary[s["signal"]] = summary.get(s["signal"], 0) + 1
    print(f"[Summary] {summary}")
    print("[Done]")
    return 0


if __name__ == "__main__":
    sys.exit(main())
