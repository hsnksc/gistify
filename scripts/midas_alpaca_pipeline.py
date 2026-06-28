#!/usr/bin/env python3
"""
midas_alpaca_pipeline.py

Midas Atlas WebBridge fallback + Alpaca Markets API primary veri kaynagi.
Midas sayfasi bos cikarsa veya WebBridge erisilemezse Alpaca'dan veri cekip
midas_signals.json formatinda momentum sinyalleri uretir.

Kullanim:
    python midas_alpaca_pipeline.py
    python midas_alpaca_pipeline.py --output /path/to/midas_signals.json
    python midas_alpaca_pipeline.py --mode aggressive
    python midas_alpaca_pipeline.py --symbols AAPL,TSLA,NVDA

Cikti: midas_signals.json (MidasSignalsData format, full compatible)
"""

import argparse
import json
import os
import subprocess
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
ALPACA_API_KEY = os.environ.get("ALPACA_API_KEY", "PKSF4JFJVCWUCH6THPJ7MQYZG5")
ALPACA_API_SECRET = os.environ.get("ALPACA_API_SECRET", "8WSJFnFrx29Qs1mKAXUhHTiZeikiVM5YvPbnfXLKuiLJ")
ALPACA_DATA_URL = "https://data.alpaca.markets/v2"
ALPACA_PAPER_URL = "https://paper-api.alpaca.markets/v2"

# Retry config
MAX_RETRIES = 3
RETRY_BACKOFF = [2, 4, 8]

DEFAULT_SYMBOLS = [
    "HOOD", "HIMS", "TSM", "META", "MU", "ADBE", "PLTR", "PLTU", "AMD", "AMDL",
    "SMCX", "SMCI", "NVDA", "NVDU", "SOXL", "SOXS", "AMZN", "MSFT", "AAPL", "AAPX",
    "GOOG", "GOOGL", "GGLL", "QCOM", "ARM", "TSLA", "AMUU", "INTC", "AVGO", "MRVL",
    "ASML", "ORCL", "SFTBY", "LSCC", "BE", "TQQQ", "TSMX", "TXN", "LRCX", "ADI",
    "KLAC", "AMAT", "NXPI", "MPWR", "MCHP", "ON", "TER", "ENTG", "SWKS", "ONTO",
]

BATCH_SIZE = 100  # Alpaca symbols per request limit


# ---------------------------------------------------------------------------
# HTTP helpers (curl subprocess — reliable on Windows, macOS, Linux)
# ---------------------------------------------------------------------------
import subprocess

def _curl_json(url: str, method: str = "GET", payload: dict | None = None, retries: int = MAX_RETRIES) -> dict[str, Any] | None:
    """Execute curl subprocess and return parsed JSON."""
    headers = {
        "APCA-API-KEY-ID": ALPACA_API_KEY,
        "APCA-API-SECRET-KEY": ALPACA_API_SECRET,
        "Accept": "application/json",
    }
    cmd = ["curl", "-s", "-X", method, url]
    for k, v in headers.items():
        cmd += ["-H", f"{k}: {v}"]
    if payload is not None:
        cmd += ["-H", "Content-Type: application/json", "-d", json.dumps(payload)]

    for attempt in range(retries):
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            if result.returncode != 0:
                print(f"[CURL ERROR] {url} -> {result.stderr.strip()}", file=sys.stderr)
                time.sleep(RETRY_BACKOFF[min(attempt, len(RETRY_BACKOFF) - 1)])
                continue
            return json.loads(result.stdout)
        except json.JSONDecodeError as e:
            print(f"[JSON ERROR] {url} -> {e}", file=sys.stderr)
            return None
        except Exception as e:
            print(f"[REQUEST ERROR] {url} -> {e}", file=sys.stderr)
            time.sleep(RETRY_BACKOFF[min(attempt, len(RETRY_BACKOFF) - 1)])
    return None


def _get_json(url: str, retries: int = MAX_RETRIES) -> dict[str, Any] | None:
    """GET via curl subprocess."""
    return _curl_json(url, method="GET", retries=retries)


def _post_json(url: str, payload: dict[str, Any], retries: int = MAX_RETRIES) -> dict[str, Any] | None:
    """POST via curl subprocess."""
    return _curl_json(url, method="POST", payload=payload, retries=retries)


# ---------------------------------------------------------------------------
# Alpaca data fetchers
# ---------------------------------------------------------------------------
def fetch_latest_trades(symbols: list[str]) -> dict[str, float]:
    """Fetch latest trade prices for symbols."""
    prices: dict[str, float] = {}
    if not symbols:
        return prices

    for i in range(0, len(symbols), BATCH_SIZE):
        batch = symbols[i:i + BATCH_SIZE]
        sym_str = ",".join(batch)
        url = f"{ALPACA_DATA_URL}/stocks/trades/latest?symbols={sym_str}"
        data = _get_json(url)
        if not data or "trades" not in data:
            print(f"[WARN] No trade data for batch {i}-{i+len(batch)}", file=sys.stderr)
            continue
        for sym, trade in data["trades"].items():
            if isinstance(trade, dict) and "p" in trade:
                prices[sym.upper()] = float(trade["p"])
        time.sleep(0.2)  # Rate limit cushion

    return prices


def fetch_snapshots(symbols: list[str]) -> dict[str, dict]:
    """Fetch snapshot data (dailyBar, prevDailyBar, latestTrade) for all symbols."""
    snapshots: dict[str, dict] = {}
    if not symbols:
        return snapshots

    for i in range(0, len(symbols), BATCH_SIZE):
        batch = symbols[i:i + BATCH_SIZE]
        sym_str = ",".join(batch)
        url = f"{ALPACA_DATA_URL}/stocks/snapshots?symbols={sym_str}&feed=iex"
        data = _get_json(url)
        if not data:
            print(f"[WARN] No snapshot data for batch {i}-{i+len(batch)}", file=sys.stderr)
            continue
        for sym, snap in data.items():
            if isinstance(snap, dict):
                snapshots[sym.upper()] = snap
        time.sleep(0.2)

    return snapshots


def fetch_bars_single(symbol: str, timeframe: str, limit: int = 5) -> list[dict]:
    """Fetch bars for a single symbol using path variable (reliable on free tier)."""
    end = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    if timeframe == "1Day":
        start = (datetime.now(timezone.utc) - timedelta(days=limit + 5)).strftime("%Y-%m-%d")
    elif timeframe == "1Week":
        start = (datetime.now(timezone.utc) - timedelta(weeks=limit + 2)).strftime("%Y-%m-%d")
    else:  # 1Month
        start = (datetime.now(timezone.utc) - timedelta(days=limit * 35 + 10)).strftime("%Y-%m-%d")

    url = f"{ALPACA_DATA_URL}/stocks/{symbol}/bars?timeframe={timeframe}&start={start}&end={end}&limit={limit+2}&feed=iex"
    data = _get_json(url)
    if not data or "bars" not in data:
        return []
    bars = data["bars"]
    if isinstance(bars, list):
        return bars
    return []


def fetch_bars_batch(symbols: list[str], timeframe: str, limit: int = 5) -> dict[str, list[dict]]:
    """Fetch bars for symbols in batch; fallback to single-symbol for missing ones."""
    bars: dict[str, list[dict]] = {}
    if not symbols:
        return bars

    end = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    if timeframe == "1Day":
        start = (datetime.now(timezone.utc) - timedelta(days=limit + 5)).strftime("%Y-%m-%d")
    elif timeframe == "1Week":
        start = (datetime.now(timezone.utc) - timedelta(weeks=limit + 2)).strftime("%Y-%m-%d")
    else:  # 1Month
        start = (datetime.now(timezone.utc) - timedelta(days=limit * 35 + 10)).strftime("%Y-%m-%d")

    for i in range(0, len(symbols), BATCH_SIZE):
        batch = symbols[i:i + BATCH_SIZE]
        sym_str = ",".join(batch)
        url = f"{ALPACA_DATA_URL}/stocks/bars?symbols={sym_str}&timeframe={timeframe}&start={start}&end={end}&limit={limit+2}&feed=iex"
        data = _get_json(url)
        if data and "bars" in data:
            for sym, sym_bars in data["bars"].items():
                if isinstance(sym_bars, list):
                    bars[sym.upper()] = sym_bars

    # Fallback for missing symbols
    missing = [s for s in symbols if s.upper() not in bars]
    for sym in missing:
        sym_bars = fetch_bars_single(sym, timeframe, limit)
        if sym_bars:
            bars[sym.upper()] = sym_bars

    return bars


# ---------------------------------------------------------------------------
# Percentage change calculations
# ---------------------------------------------------------------------------
def calc_daily_pct(bars: list[dict]) -> float | None:
    """Calculate daily % change from last two daily bars."""
    if not bars or len(bars) < 2:
        return None
    bars_sorted = sorted(bars, key=lambda b: b.get("t", ""))
    prev_close = float(bars_sorted[-2]["c"])
    last_close = float(bars_sorted[-1]["c"])
    if prev_close == 0:
        return None
    return ((last_close - prev_close) / prev_close) * 100


def calc_weekly_pct(bars: list[dict]) -> float | None:
    """Calculate weekly % change: last week close vs previous week close."""
    if not bars or len(bars) < 2:
        return None
    bars_sorted = sorted(bars, key=lambda b: b.get("t", ""))
    prev_close = float(bars_sorted[-2]["c"])
    last_close = float(bars_sorted[-1]["c"])
    if prev_close == 0:
        return None
    return ((last_close - prev_close) / prev_close) * 100


def calc_monthly_pct(bars: list[dict]) -> float | None:
    """Calculate monthly % change: last month close vs previous month close."""
    if not bars or len(bars) < 2:
        return None
    bars_sorted = sorted(bars, key=lambda b: b.get("t", ""))
    prev_close = float(bars_sorted[-2]["c"])
    last_close = float(bars_sorted[-1]["c"])
    if prev_close == 0:
        return None
    return ((last_close - prev_close) / prev_close) * 100


# ---------------------------------------------------------------------------
# Signal engine
# ---------------------------------------------------------------------------
def generate_signal_tags(daily_pct: float, weekly_pct: float, monthly_pct: float) -> list[str]:
    """Generate Midas-style signal tags."""
    tags = []
    # Daily
    if daily_pct >= 5:
        tags.append("DAILY_STRONG_UP")
    elif daily_pct >= 1.5:
        tags.append("DAILY_UP")
    elif daily_pct <= -5:
        tags.append("DAILY_STRONG_DOWN")
    elif daily_pct <= -1.5:
        tags.append("DAILY_DOWN")

    # Weekly
    if weekly_pct >= 5:
        tags.append("WEEKLY_STRONG_UP")
    elif weekly_pct >= 1.5:
        tags.append("WEEKLY_UP")
    elif weekly_pct <= -5:
        tags.append("WEEKLY_STRONG_DOWN")
    elif weekly_pct <= -1.5:
        tags.append("WEEKLY_DOWN")

    # Monthly
    if monthly_pct >= 10:
        tags.append("MONTHLY_STRONG_UP")
    elif monthly_pct >= 3:
        tags.append("MONTHLY_UP")
    elif monthly_pct <= -10:
        tags.append("MONTHLY_STRONG_DOWN")
    elif monthly_pct <= -3:
        tags.append("MONTHLY_DOWN")

    # Alignment
    if daily_pct > 0 and weekly_pct > 0 and monthly_pct > 0:
        tags.append("ALL_UP")
    elif daily_pct < 0 and weekly_pct < 0 and monthly_pct < 0:
        tags.append("ALL_DOWN")

    return tags


def generate_signal(daily_pct: float, weekly_pct: float, monthly_pct: float, mode: str = "default") -> tuple[str, float]:
    """
    Generate Midas signal and strength.
    Returns (signal, strength).
    """
    # Count positive/negative timeframes
    pos = sum(1 for x in (daily_pct, weekly_pct, monthly_pct) if x > 0)
    neg = sum(1 for x in (daily_pct, weekly_pct, monthly_pct) if x < 0)

    # Strong thresholds
    strong_up = sum(1 for x in (daily_pct, weekly_pct, monthly_pct) if x >= 5)
    strong_down = sum(1 for x in (daily_pct, weekly_pct, monthly_pct) if x <= -5)

    # Mode adjustments
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

    elif mode == "conservative":
        if pos == 3 and daily_pct >= 3 and weekly_pct >= 5 and monthly_pct >= 10:
            return "STRONG_BUY", 6.0
        if neg == 3 and daily_pct <= -3 and weekly_pct <= -5 and monthly_pct <= -10:
            return "STRONG_SELL", -6.0
        if pos == 3 and weekly_pct > 0 and monthly_pct > 5:
            return "BUY", 3.0
        if neg == 3 and weekly_pct < 0 and monthly_pct < -5:
            return "SELL", -3.0
        return "HOLD", 0.0

    # default mode
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


# ---------------------------------------------------------------------------
# Main pipeline
# ---------------------------------------------------------------------------
def run_alpaca_pipeline(
    symbols: list[str],
    output_path: str | None = None,
    mode: str = "default",
) -> dict[str, Any]:
    """
    Run the full Alpaca -> Midas signals pipeline.
    Returns the MidasSignalsData dict.
    """
    print(f"[Alpaca Pipeline] {len(symbols)} sembol, mode={mode}")
    print("[1/4] Snapshot verileri cekiliyor (fiyat + daily)...")
    snapshots = fetch_snapshots(symbols)
    prices = {}
    daily_pcts = {}
    for sym, snap in snapshots.items():
        latest = snap.get("latestTrade", {})
        if latest and "p" in latest:
            prices[sym] = float(latest["p"])
        else:
            # Fallback to dailyBar close
            db = snap.get("dailyBar", {})
            if db and "c" in db:
                prices[sym] = float(db["c"])

        # Daily pct from dailyBar / prevDailyBar
        db = snap.get("dailyBar", {})
        pdb = snap.get("prevDailyBar", {})
        if db and pdb and "c" in db and "c" in pdb:
            prev = float(pdb["c"])
            curr = float(db["c"])
            if prev != 0:
                daily_pcts[sym] = ((curr - prev) / prev) * 100

    print(f"      -> {len(prices)} fiyat, {len(daily_pcts)} daily pct alindi")

    print("[2/4] Haftalik barlar cekiliyor...")
    weekly_bars = fetch_bars_batch(symbols, "1Week", limit=5)
    print(f"      -> {len(weekly_bars)} sembol haftalik bar alindi")

    print("[3/4] Aylik barlar cekiliyor...")
    monthly_bars = fetch_bars_batch(symbols, "1Month", limit=3)
    print(f"      -> {len(monthly_bars)} sembol aylik bar alindi")

    print("[4/4] Sinyaller uretiliyor...")
    signals = []
    errors = []
    for sym in symbols:
        price = prices.get(sym)
        if price is None:
            errors.append(f"{sym}: fiyat verisi alinamadi")
            continue

        daily_pct = daily_pcts.get(sym, 0.0)
        w_bars = weekly_bars.get(sym, [])
        m_bars = monthly_bars.get(sym, [])

        weekly_pct = calc_weekly_pct(w_bars) if len(w_bars) >= 2 else 0.0
        monthly_pct = calc_monthly_pct(m_bars) if len(m_bars) >= 2 else 0.0

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

    # Sort by signal strength descending
    signal_priority = {"STRONG_BUY": 4, "BUY": 3, "HOLD": 2, "SELL": 1, "STRONG_SELL": 0}
    signals.sort(key=lambda s: (signal_priority.get(s["signal"], 2), abs(s["strength"])), reverse=True)

    result = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "symbol_count": len(symbols),
        "successful": len(signals),
        "failed": len(errors),
        "mode": mode,
        "signals": signals,
        "errors": errors,
    }

    # Save
    out = output_path or "midas_signals.json"
    out_path = Path(out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    print(f"[OK] {out_path} kaydedildi ({len(signals)} sinyal, {len(errors)} hata)")

    return result


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Midas Alpaca Pipeline")
    parser.add_argument("--output", "-o", type=str, default=None, help="Output JSON path")
    parser.add_argument("--mode", "-m", type=str, default="default", choices=["default", "aggressive", "conservative"])
    parser.add_argument("--symbols", "-s", type=str, default=None, help="Comma-separated symbols (override default)")
    parser.add_argument("--env-key", type=str, default=None, help="Alpaca API Key (or ALPACA_API_KEY env)")
    parser.add_argument("--env-secret", type=str, default=None, help="Alpaca API Secret (or ALPACA_API_SECRET env)")
    args = parser.parse_args()

    if args.env_key:
        global ALPACA_API_KEY
        ALPACA_API_KEY = args.env_key
    if args.env_secret:
        global ALPACA_API_SECRET
        ALPACA_API_SECRET = args.env_secret

    symbols = args.symbols.split(",") if args.symbols else DEFAULT_SYMBOLS[:]
    symbols = [s.strip().upper() for s in symbols if s.strip()]

    result = run_alpaca_pipeline(symbols, output_path=args.output, mode=args.mode)

    # Summary print
    summary = {}
    for s in result["signals"]:
        summary[s["signal"]] = summary.get(s["signal"], 0) + 1
    print(f"[Summary] {summary}")
    print("[Done]")
    return 0


if __name__ == "__main__":
    sys.exit(main())
