#!/usr/bin/env python3
"""
Model Training Engine v2 - Using yfinance
Fetches 6 months historical data, runs walk-forward simulation.
"""

import yfinance as yf
import json
from datetime import datetime
from collections import defaultdict
import time

TICKERS = [
    "AAPL", "MSFT", "AMZN", "GOOGL", "META", "NVDA", "TSLA", "AVGO",
    "JPM", "JNJ", "V", "WMT", "PG", "MA", "UNH", "HD", "BAC",
    "PFE", "KO", "MRK", "XOM", "ABBV", "DIS", "NKE", "ABT",
    "CRM", "LLY", "T", "BMY", "PM", "IBM", "GE", "CAT", "GS",
    "AMD", "ADBE", "QCOM", "INTC", "CSCO", "VZ", "NFLX", "CVX",
    "AMGN", "INTU", "HON", "AMAT", "LIN", "ISRG", "SBUX", "BKNG",
    "GILD", "VRTX", "MDLZ", "ADI", "REGN", "PANW", "MU", "SNPS",
    "LRCX", "KLAC", "CSX", "ASML", "MELI", "ABNB", "FTNT", "WDAY",
    "MRVL", "CRWD", "EA", "DXCM", "CTSH", "CPRT", "FAST", "MNST",
    "XEL", "ANSS", "VRSK", "ODFL", "ILMN", "PAYX", "EBAY", "DDOG",
    "SNOW", "PLTR", "MDB", "WFC", "MS", "AXP", "BLK", "C",
]

WEIGHTS = {
    'rvol': 0.22, 'gap': 0.12, 'orb': 0.15, 'vwap': 0.15,
    'structure': 0.08, 'rsi_short': 0.10, 'velocity_dir': 0.08,
    'velocity_vol': 0.02, 'marketCap': 0.02, 'retention': 0.04, 'price_change': 0.02
}

def calc_rsi(prices, period=7):
    if len(prices) < period + 1:
        return 50
    deltas = [prices[i] - prices[i-1] for i in range(1, len(prices))]
    gains = [d if d > 0 else 0 for d in deltas]
    losses = [-d if d < 0 else 0 for d in deltas]
    avg_gain = sum(gains[-period:]) / period
    avg_loss = sum(losses[-period:]) / period
    if avg_loss == 0:
        return 100
    return max(0, min(100, 100 - 100 / (1 + avg_gain / avg_loss)))

def calc_momentum_score(hist, day_idx):
    """Walk-forward momentum score calculation"""
    if day_idx < 20:
        return None
    
    past = hist.iloc[:day_idx]
    today = hist.iloc[day_idx]
    
    closes = past['Close'].tolist()
    highs = past['High'].tolist()
    lows = past['Low'].tolist()
    volumes = past['Volume'].tolist()
    
    avg_vol_20 = sum(volumes[-20:]) / 20
    prev_close = closes[-1]
    
    # ATR (simplified)
    trs = []
    for i in range(1, len(closes)):
        tr = max(highs[i] - lows[i], abs(highs[i] - closes[i-1]), abs(lows[i] - closes[i-1]))
        trs.append(tr)
    atr = sum(trs[-14:]) / 14 if len(trs) >= 14 else sum(trs) / len(trs)
    
    if atr == 0 or prev_close == 0:
        return None
    
    # Factors
    rvol = today['Volume'] / avg_vol_20 if avg_vol_20 > 0 else 1
    gap_pct = (today['Open'] - prev_close) / prev_close * 100
    
    # RVOL score
    rvol_s = min(100, rvol / 4 * 100) if rvol < 4 else 100
    
    # Gap score
    if 1 <= gap_pct <= 4:
        gap_s = 80 + min((4 - gap_pct) * 5, 20)
    elif 0.5 <= gap_pct < 1:
        gap_s = 60 + (gap_pct - 0.5) * 40
    elif 4 < gap_pct <= 8:
        gap_s = 70 - (gap_pct - 4) * 5
    elif gap_pct > 8:
        gap_s = 40
    else:
        gap_s = 15
    
    # ORB (simulated)
    orb_range = today['High'] - today['Low']
    orb_norm = orb_range / atr
    breakout = 1.0 if today['Close'] > today['Open'] else 0.5
    if orb_norm > 2 and breakout >= 1.0:
        orb_s = 95
    elif orb_norm > 1.5:
        orb_s = 80
    elif orb_norm > 1:
        orb_s = 65
    elif orb_norm > 0.5:
        orb_s = 45
    else:
        orb_s = 30
    
    # VWAP (simplified)
    recent_avg = sum(closes[-10:]) / 10
    vwap_dev = (today['Close'] - recent_avg) / recent_avg * 100 if recent_avg > 0 else 0
    if vwap_dev > 1.5: vwap_s = 90
    elif vwap_dev > 1: vwap_s = 85
    elif vwap_dev > 0.5: vwap_s = 70
    elif vwap_dev > 0: vwap_s = 55
    elif vwap_dev > -0.5: vwap_s = 40
    else: vwap_s = 25
    
    # Structure
    if len(highs) >= 10:
        hh = sum(1 for i in range(-10, 0) if highs[i] > highs[i-1])
        hl = sum(1 for i in range(-10, 0) if lows[i] > lows[i-1])
        struct_s = ((hh / 9 * 100) + (hl / 9 * 100)) / 2
    else:
        struct_s = 50
    
    # RSI
    rsi = calc_rsi(closes, 7)
    if 60 <= rsi < 75: rsi_s = 85
    elif 55 <= rsi < 60: rsi_s = 70
    elif 45 <= rsi < 55: rsi_s = 55
    elif 75 <= rsi <= 80: rsi_s = 60
    elif rsi > 80: rsi_s = 30
    else: rsi_s = 25
    
    # Velocity direction
    dir_move = (today['Close'] - today['Open']) / atr
    if dir_move > 2.0: vel_dir = 95
    elif dir_move > 1.5: vel_dir = 85
    elif dir_move > 1.0: vel_dir = 70
    elif dir_move > 0.5: vel_dir = 55
    elif dir_move > 0: vel_dir = 40
    elif dir_move > -0.5: vel_dir = 25
    else: vel_dir = 15
    
    # Retention
    if today['High'] > 0:
        pullback = (today['High'] - today['Close']) / today['High'] * 100
        if pullback < 0.3: ret_s = 85
        elif pullback < 0.8: ret_s = 70
        elif pullback < 1.5: ret_s = 55
        elif pullback < 3.0: ret_s = 40
        else: ret_s = 25
    else:
        ret_s = 50
    
    # Weighted score
    score = round(
        rvol_s * WEIGHTS['rvol'] + gap_s * WEIGHTS['gap'] + orb_s * WEIGHTS['orb'] +
        vwap_s * WEIGHTS['vwap'] + struct_s * WEIGHTS['structure'] + rsi_s * WEIGHTS['rsi_short'] +
        vel_dir * WEIGHTS['velocity_dir'] + 50 * WEIGHTS['velocity_vol'] + 50 * WEIGHTS['marketCap'] +
        ret_s * WEIGHTS['retention'] + 30 * WEIGHTS['price_change']
    )
    
    return {
        'score': max(0, min(100, int(score))),
        'rvol': round(rvol, 2),
        'gap_pct': round(gap_pct, 2),
        'rsi': round(rsi, 1),
        'vwap_dev': round(vwap_dev, 2),
    }

def train_model():
    all_trades = []
    
    print(f"Training on {len(TICKERS)} tickers (6 months data)...")
    print("=" * 60)
    
    for idx, ticker in enumerate(TICKERS):
        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(period="6mo")
            
            if len(hist) < 30:
                print(f"[{idx+1}/{len(TICKERS)}] {ticker} SKIP ({len(hist)} bars)")
                continue
            
            trade_count = 0
            for day_idx in range(20, len(hist) - 1):
                result = calc_momentum_score(hist, day_idx)
                if not result:
                    continue
                
                score = result['score']
                today = hist.iloc[day_idx]
                tomorrow = hist.iloc[day_idx + 1]
                
                next_day_change = (tomorrow['Close'] - today['Close']) / today['Close'] * 100
                
                if score >= 40:
                    dow = hist.index[day_idx].weekday()
                    all_trades.append({
                        'ticker': ticker,
                        'score': score,
                        'rvol': result['rvol'],
                        'gap_pct': result['gap_pct'],
                        'rsi': result['rsi'],
                        'vwap_dev': result['vwap_dev'],
                        'next_day_change': round(next_day_change, 2),
                        'profitable': next_day_change > 0,
                        'day_of_week': dow,
                    })
                    trade_count += 1
            
            print(f"[{idx+1}/{len(TICKERS)}] {ticker} OK ({trade_count} trades, {len(hist)} days)")
            time.sleep(0.5)  # Rate limit
            
        except Exception as e:
            print(f"[{idx+1}/{len(TICKERS)}] {ticker} ERROR: {str(e)[:50]}")
    
    print(f"\nTotal trades analyzed: {len(all_trades)}")
    
    if len(all_trades) < 50:
        print("ERROR: Insufficient data")
        return None
    
    # ANALYSIS
    print("\n" + "=" * 60)
    print("TRAINING RESULTS")
    print("=" * 60)
    
    # Score thresholds
    print("\n--- Score Threshold ---")
    for t in [40, 45, 50, 55, 60, 65, 70]:
        subset = [x for x in all_trades if x['score'] >= t]
        if len(subset) < 10: continue
        wr = sum(1 for x in subset if x['profitable']) / len(subset) * 100
        avg = sum(x['next_day_change'] for x in subset) / len(subset)
        print(f"  Score>={t}: WR={wr:.1f}% AvgPnL={avg:.2f}% N={len(subset)}")
    
    # RVOL
    print("\n--- RVOL Threshold ---")
    for t in [1.0, 1.5, 2.0, 2.5, 3.0, 4.0]:
        subset = [x for x in all_trades if x['rvol'] >= t]
        if len(subset) < 10: continue
        wr = sum(1 for x in subset if x['profitable']) / len(subset) * 100
        avg = sum(x['next_day_change'] for x in subset) / len(subset)
        print(f"  RVOL>={t}: WR={wr:.1f}% AvgPnL={avg:.2f}% N={len(subset)}")
    
    # RSI
    print("\n--- RSI Bands ---")
    for lo, hi in [(30,45), (45,55), (55,65), (65,75), (75,85)]:
        subset = [x for x in all_trades if lo <= x['rsi'] < hi]
        if len(subset) < 10: continue
        wr = sum(1 for x in subset if x['profitable']) / len(subset) * 100
        avg = sum(x['next_day_change'] for x in subset) / len(subset)
        print(f"  RSI {lo}-{hi}: WR={wr:.1f}% AvgPnL={avg:.2f}% N={len(subset)}")
    
    # Day of week
    print("\n--- Day of Week ---")
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    for d in range(5):
        subset = [x for x in all_trades if x['day_of_week'] == d]
        if len(subset) < 5: continue
        wr = sum(1 for x in subset if x['profitable']) / len(subset) * 100
        avg = sum(x['next_day_change'] for x in subset) / len(subset)
        print(f"  {days[d]}: WR={wr:.1f}% AvgPnL={avg:.2f}% N={len(subset)}")
    
    # Gap
    print("\n--- Gap Size ---")
    for lo, hi in [(0,1), (1,2), (2,3), (3,5), (5,10)]:
        subset = [x for x in all_trades if lo <= x['gap_pct'] < hi]
        if len(subset) < 5: continue
        wr = sum(1 for x in subset if x['profitable']) / len(subset) * 100
        avg = sum(x['next_day_change'] for x in subset) / len(subset)
        print(f"  Gap {lo}-{hi}%: WR={wr:.1f}% AvgPnL={avg:.2f}% N={len(subset)}")
    
    # Combined optimal
    print("\n--- Optimal Combined Filter ---")
    best_wr = 0
    best_cfg = None
    for st in [50, 55, 60]:
        for rt in [1.5, 2.0, 2.5, 3.0]:
            for rmin in [50, 55, 60]:
                for rmax in [75, 80, 85]:
                    subset = [x for x in all_trades 
                              if x['score'] >= st and x['rvol'] >= rt 
                              and rmin <= x['rsi'] <= rmax]
                    if len(subset) < 15: continue
                    wr = sum(1 for x in subset if x['profitable']) / len(subset) * 100
                    avg_pnl = sum(x['next_day_change'] for x in subset) / len(subset)
                    if wr > best_wr:
                        best_wr = wr
                        best_cfg = {'score': st, 'rvol': rt, 'rsi_min': rmin, 'rsi_max': rmax,
                                    'wr': wr, 'avg_pnl': avg_pnl, 'n': len(subset)}
    
    if best_cfg:
        print(f"  BEST: Score>={best_cfg['score']}, RVOL>={best_cfg['rvol']}, RSI {best_cfg['rsi_min']}-{best_cfg['rsi_max']}")
        print(f"  WinRate={best_cfg['wr']:.1f}% AvgPnL={best_cfg['avg_pnl']:.2f}% N={best_cfg['n']}")
    
    # Overall
    overall_wr = sum(1 for x in all_trades if x['profitable']) / len(all_trades) * 100
    overall_avg = sum(x['next_day_change'] for x in all_trades) / len(all_trades)
    print(f"\n--- Overall: {len(all_trades)} trades, WR={overall_wr:.1f}%, AvgPnL={overall_avg:.2f}% ---")
    
    results = {
        'optimal_score_threshold': best_cfg['score'] if best_cfg else 55,
        'optimal_rvol': best_cfg['rvol'] if best_cfg else 2.0,
        'optimal_rsi_min': best_cfg['rsi_min'] if best_cfg else 55,
        'optimal_rsi_max': best_cfg['rsi_max'] if best_cfg else 78,
        'overall_wr': round(overall_wr, 1),
        'best_wr': round(best_cfg['wr'], 1) if best_cfg else round(overall_wr, 1),
        'total_trades': len(all_trades),
        'best_config': best_cfg,
    }
    
    with open('/mnt/agents/output/training_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    return results

if __name__ == "__main__":
    results = train_model()
    if results:
        print(f"\nSaved to training_results.json")
        print(f"\nKey findings:")
        print(f"  Optimal entry: Score>={results['optimal_score_threshold']}")
        print(f"  Optimal RVOL: >={results['optimal_rvol']}x")
        print(f"  Optimal RSI: {results['optimal_rsi_min']}-{results['optimal_rsi_max']}")
        print(f"  Best WR achieved: {results['best_wr']}%")
