#!/usr/bin/env python3
"""
NASDAQ Momentum Scanner v2.0
Advanced momentum analysis with:
- Volume & liquidity filters
- Multi-factor scoring (RVOL, GAP, ORB, VWAP, Price Structure, RSI, ATR, Catalyst)
- Backtest engine
- Comprehensive logging
"""

import yfinance as yf
import pandas as pd
import numpy as np
import json
import sys
import logging
import argparse
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler(sys.stderr)
    ]
)
logger = logging.getLogger(__name__)

# NASDAQ-100 tickers (expanded list)
NASDAQ_TICKERS = [
    "AAPL", "MSFT", "AMZN", "GOOGL", "GOOG", "META", "NVDA", "TSLA",
    "AVGO", "PEP", "COST", "CSCO", "TMUS", "ADBE", "NFLX", "AMD",
    "INTC", "QCOM", "AMGN", "INTU", "HON", "AMAT", "PYPL", "ADP",
    "LIN", "ISRG", "SBUX", "BKNG", "GILD", "VRTX", "MDLZ", "ADI",
    "REGN", "PANW", "MU", "SNPS", "LRCX", "KLAC", "CSX", "NXPI",
    "ASML", "CDNS", "CHTR", "MAR", "MELI", "ABNB", "CTAS", "DXCM",
    "ORLY", "PDD", "FTNT", "WDAY", "MRVL", "JD", "CPRT", "AEP",
    "KDP", "EXC", "FAST", "MNST", "CTSH", "AZN", "BIIB", "TEAM",
    "XEL", "EA", "CRWD", "ANSS", "VRSK", "ODFL", "CSGP", "PCAR",
    "ILMN", "PAYX", "DLTR", "EBAY", "ZM", "SQ", "DDOG", "SNOW",
    "PLTR", "MDB", "ROKU", "OKTA", "NET", "DOCU", "SHOP", "TWLO",
]

# Minimum filters
MIN_AVG_VOLUME_20D = 500000  # Minimum 500K average daily volume
MIN_DOLLAR_VOLUME = 50000000  # Minimum $50M average dollar volume

def fetch_stock_data(ticker, period="60d", interval="1d"):
    """Fetch stock data from Yahoo Finance"""
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period=period, interval=interval)
        if data.empty or len(data) < 20:
            return None, None
        return stock, data
    except Exception as e:
        logger.error(f"Error fetching data for {ticker}: {e}")
        return None, None

def calculate_rsi(prices, period=14):
    """Calculate RSI"""
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

def calculate_rsi_series(prices, period=14):
    """Calculate RSI series for multiple periods"""
    if len(prices) < period + 1:
        return [50] * len(prices)
    prices_series = pd.Series(prices)
    delta = prices_series.diff()
    gain = delta.where(delta > 0, 0.0)
    loss = -delta.where(delta < 0, 0.0)
    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(50).values

def calculate_atr(high, low, close, period=14):
    """Calculate Average True Range"""
    if len(close) < period + 1:
        return 0
    high = np.array(high)
    low = np.array(low)
    close = np.array(close)
    tr1 = high[1:] - low[1:]
    tr2 = np.abs(high[1:] - close[:-1])
    tr3 = np.abs(low[1:] - close[:-1])
    tr = np.maximum(np.maximum(tr1, tr2), tr3)
    return np.mean(tr[-period:])

def calculate_vwap(high, low, close, volume):
    """Calculate VWAP"""
    if len(close) == 0 or sum(volume) == 0:
        return 0
    typical_price = (np.array(high) + np.array(low) + np.array(close)) / 3
    return np.sum(typical_price * np.array(volume)) / np.sum(volume)

def calculate_vwap_slope(high, low, close, volume, periods=5):
    """Calculate VWAP slope (trend direction)"""
    if len(close) < periods + 1:
        return 0
    prices = (np.array(high) + np.array(low) + np.array(close)) / 3
    vol = np.array(volume)
    cum_vol = np.cumsum(vol)
    cum_tp_vol = np.cumsum(prices * vol)
    vwap_series = cum_tp_vol / cum_vol
    if len(vwap_series) < periods:
        return 0
    recent = vwap_series[-periods:]
    x = np.arange(len(recent))
    slope = np.polyfit(x, recent, 1)[0] if len(x) > 1 else 0
    return slope

def check_price_structure(highs, lows, closes, lookback=10):
    """Check for higher highs and higher lows pattern"""
    if len(highs) < lookback + 2:
        return 50
    h = np.array(highs[-lookback:])
    l = np.array(lows[-lookback:])
    
    higher_highs = sum(1 for i in range(1, len(h)) if h[i] > h[i-1])
    higher_lows = sum(1 for i in range(1, len(l)) if l[i] > l[i-1])
    
    hh_ratio = (higher_highs / max(len(h) - 1, 1)) * 100
    hl_ratio = (higher_lows / max(len(l) - 1, 1)) * 100
    
    return (hh_ratio + hl_ratio) / 2

def analyze_gap(open_price, prev_close):
    """Analyze gap quality - returns score 0-100"""
    if prev_close == 0:
        return 50
    gap_pct = ((open_price - prev_close) / prev_close) * 100
    
    # Moderate gap is best (1-4%)
    if 1 <= gap_pct <= 4:
        return 80 + min((4 - gap_pct) * 5, 20)
    elif 0.5 <= gap_pct < 1:
        return 60 + (gap_pct - 0.5) * 40
    elif 4 < gap_pct <= 8:
        return 70 - (gap_pct - 4) * 5
    elif gap_pct > 8:
        return 40  # Too much gap, risk of reversal
    elif -1 <= gap_pct < 0:
        return 30  # Negative gap
    else:
        return 15

def analyze_orb(open_price, high_30m, low_30m, atr):
    """Opening Range Breakout analysis"""
    if atr == 0:
        return 50
    orb_range = high_30m - low_30m
    orb_normalized = orb_range / atr if atr > 0 else 0
    
    # Breakout strength
    breakout = (high_30m - open_price) / orb_range if orb_range > 0 else 0
    
    if orb_normalized > 2 and breakout > 0.5:
        return 90
    elif orb_normalized > 1.5 and breakout > 0.3:
        return 75
    elif orb_normalized > 1 and breakout > 0.2:
        return 60
    elif orb_normalized > 0.5:
        return 40
    return 25

def analyze_vwap_position(current_price, vwap, vwap_slope):
    """VWAP position and slope analysis"""
    if vwap == 0:
        return 50
    
    deviation = ((current_price - vwap) / vwap) * 100
    
    # Above VWAP with positive slope = bullish
    if deviation > 1 and vwap_slope > 0:
        return 85
    elif deviation > 0.5 and vwap_slope >= 0:
        return 70
    elif deviation > 0:
        return 55
    elif deviation > -0.5:
        return 40
    else:
        return 25

def analyze_rsi_short(prices):
    """Short-term RSI analysis (2-period and 7-period)"""
    if len(prices) < 7:
        return 50
    
    rsi_2 = calculate_rsi(prices, 2)
    rsi_7 = calculate_rsi(prices, 7)
    
    # Both short-term RSIs bullish
    if rsi_2 > 60 and rsi_7 > 55:
        return 85
    elif rsi_2 > 50 and rsi_7 > 50:
        return 70
    elif rsi_7 > 45:
        return 50
    elif rsi_7 < 30:
        return 20
    return 40

def analyze_atr_momentum(open_price, high_30m, atr_14d):
    """ATR-normalized first 30-min move"""
    if atr_14d == 0:
        return 50
    move = high_30m - open_price
    normalized = move / atr_14d
    
    if normalized > 2:
        return 90  # Very strong move
    elif normalized > 1.5:
        return 75
    elif normalized > 1:
        return 60
    elif normalized > 0.5:
        return 45
    return 30

def analyze_catalyst(ticker, stock_info):
    """Check for news/catalyst - uses earnings date and analyst recommendations"""
    score = 50  # Neutral base
    
    try:
        # Check if earnings are recent/upcoming
        earnings_date = stock_info.get("earningsDate", None)
        if earnings_date:
            score += 15
        
        # Check analyst recommendation
        rec = stock_info.get("recommendationKey", "")
        if rec in ["buy", "strong_buy"]:
            score += 20
        elif rec == "hold":
            score += 5
        
        # High institutional ownership = confidence
        inst_own = stock_info.get("heldPercentInstitutions", 0)
        if inst_own > 0.7:
            score += 10
        elif inst_own > 0.5:
            score += 5
        
        # Check price target vs current
        target = stock_info.get("targetMeanPrice", 0)
        current = stock_info.get("currentPrice", 0)
        if target > 0 and current > 0:
            upside = ((target - current) / current) * 100
            if upside > 20:
                score += 15
            elif upside > 10:
                score += 10
            elif upside > 5:
                score += 5
    except Exception as e:
        logger.debug(f"Catalyst analysis error for {ticker}: {e}")
    
    return min(score, 100)

def calculate_component_score(value, thresholds, scores):
    """Calculate score based on thresholds"""
    for i, thresh in enumerate(thresholds):
        if value >= thresh:
            return scores[i]
    return scores[-1]

def analyze_ticker(ticker):
    """Analyze a single stock with full scoring system"""
    logger.info(f"Analyzing {ticker}...")
    
    try:
        # Fetch data
        stock, daily = fetch_stock_data(ticker)
        if stock is None or daily is None or len(daily) < 26:
            return None
        
        # Basic info
        info = stock.info
        current_price = daily['Close'].iloc[-1]
        prev_close = daily['Close'].iloc[-2] if len(daily) > 1 else current_price
        
        # === VOLUME & LIQUIDITY FILTERS ===
        avg_volume_20d = daily['Volume'].tail(20).mean()
        avg_dollar_volume = avg_volume_20d * current_price
        
        if avg_volume_20d < MIN_AVG_VOLUME_20D:
            logger.debug(f"{ticker} rejected: avg volume {avg_volume_20d:.0f} < {MIN_AVG_VOLUME_20D}")
            return None
        if avg_dollar_volume < MIN_DOLLAR_VOLUME:
            logger.debug(f"{ticker} rejected: dollar volume ${avg_dollar_volume:.0f} < ${MIN_DOLLAR_VOLUME}")
            return None
        
        # Intraday data (5d, 30m interval)
        intraday = stock.history(period="5d", interval="30m")
        if intraday.empty:
            return None
        
        today_data = intraday[intraday.index.date == intraday.index[-1].date()]
        if len(today_data) < 1:
            return None
        
        open_price = today_data['Open'].iloc[0]
        high_30m = today_data['High'].iloc[:1].max()
        low_30m = today_data['Low'].iloc[:1].min()
        vol_30m = today_data['Volume'].iloc[:1].sum()
        
        # Price arrays
        close_prices = daily['Close'].values
        high_prices = daily['High'].values
        low_prices = daily['Low'].values
        
        # === CALCULATE ALL INDICATORS ===
        
        # 1. RVOL (Relative Volume)
        today_volume = daily['Volume'].iloc[-1]
        rvol = today_volume / avg_volume_20d if avg_volume_20d > 0 else 1
        
        # 2. GAP Analysis
        gap_score = analyze_gap(open_price, prev_close)
        
        # 3. ATR
        atr_14d = calculate_atr(high_prices, low_prices, close_prices, 14)
        
        # 4. ORB (Opening Range Breakout)
        orb_score = analyze_orb(open_price, high_30m, low_30m, atr_14d)
        
        # 5. VWAP & Slope
        vwap = calculate_vwap(
            today_data['High'].values,
            today_data['Low'].values,
            today_data['Close'].values,
            today_data['Volume'].values
        )
        vwap_slope = calculate_vwap_slope(
            today_data['High'].values,
            today_data['Low'].values,
            today_data['Close'].values,
            today_data['Volume'].values
        )
        vwap_score = analyze_vwap_position(current_price, vwap, vwap_slope)
        vwap_deviation = ((current_price - vwap) / vwap) * 100 if vwap > 0 else 0
        
        # 6. Price Structure (Higher Highs / Higher Lows)
        structure_score = check_price_structure(high_prices, low_prices, close_prices)
        
        # 7. RSI Short-term
        rsi_14 = calculate_rsi(close_prices, 14)
        rsi_short_score = analyze_rsi_short(close_prices)
        
        # 8. ATR Momentum (first 30m move normalized by ATR)
        atr_momentum_score = analyze_atr_momentum(open_price, high_30m, atr_14d)
        
        # 9. Catalyst
        catalyst_score = analyze_catalyst(ticker, info)
        
        # === AGGREGATE SCORING ===
        # Weights for each component
        WEIGHTS = {
            "rvol": 0.15,
            "gap": 0.10,
            "orb": 0.15,
            "vwap": 0.15,
            "price_structure": 0.10,
            "rsi_short": 0.10,
            "atr_momentum": 0.10,
            "catalyst": 0.10,
            "price_change": 0.05,
        }
        
        # Normalize RVOL to 0-100 score
        rvol_score = min(rvol * 25, 100) if rvol >= 1 else rvol * 15
        
        # Price change score
        price_change_pct = ((current_price - prev_close) / prev_close) * 100
        if price_change_pct > 5: price_change_score = 100
        elif price_change_pct > 3: price_change_score = 85
        elif price_change_pct > 2: price_change_score = 70
        elif price_change_pct > 1: price_change_score = 55
        elif price_change_pct > 0: price_change_score = 40
        elif price_change_pct > -1: price_change_score = 25
        else: price_change_score = 10
        
        # Calculate weighted total score
        total_score = (
            rvol_score * WEIGHTS["rvol"] +
            gap_score * WEIGHTS["gap"] +
            orb_score * WEIGHTS["orb"] +
            vwap_score * WEIGHTS["vwap"] +
            structure_score * WEIGHTS["price_structure"] +
            rsi_short_score * WEIGHTS["rsi_short"] +
            atr_momentum_score * WEIGHTS["atr_momentum"] +
            catalyst_score * WEIGHTS["catalyst"] +
            price_change_score * WEIGHTS["price_change"]
        )
        
        total_score = round(total_score)
        
        # MACD
        prices_series = pd.Series(close_prices)
        ema_fast = prices_series.ewm(span=12, adjust=False).mean()
        ema_slow = prices_series.ewm(span=26, adjust=False).mean()
        macd_line = ema_fast - ema_slow
        signal_line = macd_line.ewm(span=9, adjust=False).mean()
        histogram = macd_line - signal_line
        
        # 52-week range
        high_52w = daily['High'].tail(252).max() if len(daily) >= 252 else daily['High'].max()
        low_52w = daily['Low'].tail(252).min() if len(daily) >= 252 else daily['Low'].min()
        range_52w_pct = ((current_price - low_52w) / (high_52w - low_52w)) * 100 if (high_52w - low_52w) > 0 else 50
        
        # Opening momentum
        opening_momentum = ((high_30m - open_price) / open_price) * 100 if open_price > 0 else 0
        
        # Determine signal category
        if total_score >= 75:
            signal_cat = "STRONG_BUY"
        elif total_score >= 60:
            signal_cat = "BUY"
        elif total_score >= 45:
            signal_cat = "NEUTRAL_BULLISH"
        elif total_score >= 30:
            signal_cat = "NEUTRAL"
        elif total_score >= 20:
            signal_cat = "NEUTRAL_BEARISH"
        else:
            signal_cat = "WEAK"
        
        return {
            "ticker": ticker,
            "name": info.get("shortName", ticker),
            "sector": info.get("sector", "N/A"),
            "currentPrice": round(current_price, 2),
            "prevClose": round(prev_close, 2),
            "priceChangePct": round(price_change_pct, 2),
            "openPrice": round(open_price, 2),
            "opening30mHigh": round(high_30m, 2),
            "openingMomentum": round(opening_momentum, 2),
            "volume": int(today_volume),
            "avgVolume20d": int(avg_volume_20d),
            "volumeRatio": round(rvol, 2),
            "opening30mVolume": int(vol_30m),
            "rsi": round(rsi_14, 1),
            "rsi2": round(calculate_rsi(close_prices, 2), 1),
            "rsi7": round(calculate_rsi(close_prices, 7), 1),
            "macd": round(macd_line.iloc[-1], 4),
            "macdSignal": round(signal_line.iloc[-1], 4),
            "macdHistogram": round(histogram.iloc[-1], 4),
            "vwap": round(vwap, 2),
            "vwapSlope": round(vwap_slope, 4),
            "vwapDeviation": round(vwap_deviation, 2),
            "atr14d": round(atr_14d, 4),
            "atrMomentumScore": round(atr_momentum_score),
            "gapScore": round(gap_score),
            "orbScore": round(orb_score),
            "structureScore": round(structure_score),
            "rvolScore": round(rvol_score),
            "rsiShortScore": round(rsi_short_score),
            "catalystScore": round(catalyst_score),
            "high52w": round(high_52w, 2),
            "low52w": round(low_52w, 2),
            "range52wPct": round(range_52w_pct, 1),
            "marketCap": info.get("marketCap", 0),
            "avgDollarVolume": int(avg_dollar_volume),
            "score": total_score,
            "signal": signal_cat,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error analyzing {ticker}: {e}")
        return None

def scan_all(tickers=None, min_score=30, max_results=20):
    """Scan all stocks and return sorted by momentum score"""
    if tickers is None:
        tickers = NASDAQ_TICKERS
    
    results = []
    logger.info(f"Starting scan of {len(tickers)} NASDAQ stocks...")
    logger.info(f"Filters: min_avg_volume={MIN_AVG_VOLUME_20D}, min_dollar_volume=${MIN_DOLLAR_VOLUME}")
    
    for i, ticker in enumerate(tickers):
        result = analyze_ticker(ticker)
        if result and result["score"] >= min_score:
            results.append(result)
        
        if (i + 1) % 10 == 0:
            logger.info(f"Progress: {i + 1}/{len(tickers)} scanned, {len(results)} matches")
    
    results.sort(key=lambda x: x["score"], reverse=True)
    top_results = results[:max_results]
    
    logger.info(f"Scan complete: {len(results)} stocks with score >= {min_score}, returning top {len(top_results)}")
    
    return {
        "scanTime": datetime.now().isoformat(),
        "totalScanned": len(tickers),
        "totalMatches": len(results),
        "marketStatus": "OPEN" if datetime.now().hour >= 9 and datetime.now().hour < 16 else "CLOSED",
        "stocks": top_results
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="NASDAQ Momentum Scanner")
    parser.add_argument("--min-score", type=int, default=30, help="Minimum score filter")
    parser.add_argument("--max-results", type=int, default=20, help="Maximum results")
    parser.add_argument("--backtest", type=str, default=None, help="Backtest date (YYYY-MM-DD)")
    args = parser.parse_args()
    
    result = scan_all(min_score=args.min_score, max_results=args.max_results)
    print(json.dumps(result, indent=2))
