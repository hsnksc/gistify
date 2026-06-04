#!/usr/bin/env python3
"""
NASDAQ Momentum Scanner - Backtest Engine
Simulate trading signals on historical data with TP/SL logic
"""

import yfinance as yf
import pandas as pd
import numpy as np
import json
import logging
import sys
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s', handlers=[logging.StreamHandler(sys.stderr)])
logger = logging.getLogger(__name__)

# Scoring weights matching scanner.py
WEIGHTS = {
    "rvol": 0.15, "gap": 0.10, "orb": 0.15, "vwap": 0.15,
    "price_structure": 0.10, "rsi_short": 0.10, "atr_momentum": 0.10,
    "catalyst": 0.10, "price_change": 0.05,
}

def calculate_rsi(prices, period=14):
    if len(prices) < period + 1:
        return 50
    deltas = np.diff(prices)
    gains = np.where(deltas > 0, deltas, 0)
    losses = np.where(deltas < 0, -deltas, 0)
    avg_gain = np.mean(gains[-period:])
    avg_loss = np.mean(losses[-period:])
    if avg_loss == 0:
        return 100
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))

def calculate_atr(high, low, close, period=14):
    if len(close) < period + 1:
        return 0
    h, l, c = np.array(high), np.array(low), np.array(close)
    tr1, tr2, tr3 = h[1:]-l[1:], np.abs(h[1:]-c[:-1]), np.abs(l[1:]-c[:-1])
    tr = np.maximum(np.maximum(tr1, tr2), tr3)
    return np.mean(tr[-period:])

def analyze_backtest_day(ticker, target_date, tp_pct=3.0, sl_pct=2.0, timeout_bars=13):
    """
    Backtest a single day for a ticker.
    Entry: First 30-min breakout
    TP/SL: Based on ATR multiples
    Returns: profit/loss % and exit reason
    """
    try:
        # Download intraday data for target date
        stock = yf.Ticker(ticker)
        
        # Get daily data for context
        start = (datetime.strptime(target_date, "%Y-%m-%d") - timedelta(days=30)).strftime("%Y-%m-%d")
        end = (datetime.strptime(target_date, "%Y-%m-%d") + timedelta(days=1)).strftime("%Y-%m-%d")
        
        daily = stock.history(start=start, end=end, interval="1d")
        if daily.empty or len(daily) < 5:
            return None
        
        # Get the target day data
        target_idx = None
        for i, idx in enumerate(daily.index):
            if idx.strftime("%Y-%m-%d") == target_date:
                target_idx = i
                break
        
        if target_idx is None or target_idx == 0:
            return None
        
        prev_close = daily['Close'].iloc[target_idx - 1]
        day_open = daily['Open'].iloc[target_idx]
        day_high = daily['High'].iloc[target_idx]
        day_low = daily['Low'].iloc[target_idx]
        day_close = daily['Close'].iloc[target_idx]
        day_volume = daily['Volume'].iloc[target_idx]
        
        # ATR calculation
        atr = calculate_atr(daily['High'].values[:target_idx], daily['Low'].values[:target_idx], daily['Close'].values[:target_idx])
        if atr == 0:
            return None
        
        # Opening range (simulated first 30min as 30% of daily range)
        day_range = day_high - day_low
        orb_high = day_open + day_range * 0.4
        orb_low = day_open - day_range * 0.1
        
        # Entry at ORB breakout
        entry_price = orb_high
        
        # If breakout didn't happen, skip
        if day_high < entry_price:
            return None
        
        # TP/SL levels
        tp_price = entry_price * (1 + tp_pct / 100)
        sl_price = entry_price * (1 - sl_pct / 100)
        
        # Determine outcome
        if day_high >= tp_price:
            pnl = tp_pct
            exit_reason = "TP"
        elif day_low <= sl_price:
            pnl = -sl_pct
            exit_reason = "SL"
        else:
            # Close at EOD
            pnl = ((day_close - entry_price) / entry_price) * 100
            exit_reason = "EOD"
        
        # Calculate score for this day (simplified)
        avg_vol = daily['Volume'].tail(20).mean()
        rvol = day_volume / avg_vol if avg_vol > 0 else 1
        gap_pct = ((day_open - prev_close) / prev_close) * 100
        price_change = ((day_close - prev_close) / prev_close) * 100
        
        score = min(rvol * 15, 15)  # RVOL component
        if 1 <= gap_pct <= 4: score += 8
        if price_change > 0: score += 5
        
        return {
            "ticker": ticker,
            "date": target_date,
            "entry": round(entry_price, 2),
            "exit": round(day_close, 2),
            "tp_level": round(tp_price, 2),
            "sl_level": round(sl_price, 2),
            "pnl_pct": round(pnl, 2),
            "exit_reason": exit_reason,
            "day_high": round(day_high, 2),
            "day_low": round(day_low, 2),
            "rvol": round(rvol, 2),
            "atr": round(atr, 4),
            "score": round(score),
        }
    except Exception as e:
        logger.error(f"Backtest error for {ticker} on {target_date}: {e}")
        return None

def run_backtest(tickers, start_date, end_date, tp_pct=3.0, sl_pct=2.0):
    """Run backtest over a date range"""
    logger.info(f"Running backtest from {start_date} to {end_date}")
    logger.info(f"TP: {tp_pct}%, SL: {sl_pct}%")
    
    all_trades = []
    
    # Generate trading days
    current = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    
    while current <= end:
        if current.weekday() >= 5:  # Skip weekends
            current += timedelta(days=1)
            continue
        
        date_str = current.strftime("%Y-%m-%d")
        day_trades = []
        
        for ticker in tickers[:20]:  # Limit for performance
            result = analyze_backtest_day(ticker, date_str, tp_pct, sl_pct)
            if result:
                day_trades.append(result)
        
        # Take top 5 signals per day
        day_trades.sort(key=lambda x: x["score"], reverse=True)
        all_trades.extend(day_trades[:5])
        
        current += timedelta(days=1)
        if len(all_trades) > 0 and len(all_trades) % 50 == 0:
            logger.info(f"  Processed {len(all_trades)} trades...")
    
    # Statistics
    if not all_trades:
        return {"error": "No trades generated"}
    
    total_trades = len(all_trades)
    winning_trades = sum(1 for t in all_trades if t["pnl_pct"] > 0)
    losing_trades = total_trades - winning_trades
    win_rate = (winning_trades / total_trades) * 100 if total_trades > 0 else 0
    
    total_pnl = sum(t["pnl_pct"] for t in all_trades)
    avg_pnl = total_pnl / total_trades if total_trades > 0 else 0
    
    avg_win = np.mean([t["pnl_pct"] for t in all_trades if t["pnl_pct"] > 0]) if winning_trades > 0 else 0
    avg_loss = np.mean([t["pnl_pct"] for t in all_trades if t["pnl_pct"] <= 0]) if losing_trades > 0 else 0
    
    tp_exits = sum(1 for t in all_trades if t["exit_reason"] == "TP")
    sl_exits = sum(1 for t in all_trades if t["exit_reason"] == "SL")
    eod_exits = sum(1 for t in all_trades if t["exit_reason"] == "EOD")
    
    return {
        "startDate": start_date,
        "endDate": end_date,
        "tpPct": tp_pct,
        "slPct": sl_pct,
        "totalTrades": total_trades,
        "winningTrades": winning_trades,
        "losingTrades": losing_trades,
        "winRate": round(win_rate, 1),
        "totalPnL": round(total_pnl, 2),
        "avgPnL": round(avg_pnl, 2),
        "avgWin": round(avg_win, 2),
        "avgLoss": round(avg_loss, 2),
        "profitFactor": round(abs(avg_win * winning_trades / (avg_loss * losing_trades)), 2) if avg_loss != 0 and losing_trades > 0 else float('inf'),
        "tpExits": tp_exits,
        "slExits": sl_exits,
        "eodExits": eod_exits,
        "trades": all_trades[:50]  # Limit output
    }

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--tickers", nargs="+", default=["AAPL", "MSFT", "NVDA", "TSLA", "META"])
    parser.add_argument("--start", default=(datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d"))
    parser.add_argument("--end", default=datetime.now().strftime("%Y-%m-%d"))
    parser.add_argument("--tp", type=float, default=3.0)
    parser.add_argument("--sl", type=float, default=2.0)
    args = parser.parse_args()
    
    result = run_backtest(args.tickers, args.start, args.end, args.tp, args.sl)
    print(json.dumps(result, indent=2))
