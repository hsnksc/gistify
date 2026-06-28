import json
import os
from datetime import datetime

report = {
    "reportType": "hourly",
    "reportDate": "2026-06-26",
    "generatedAt": "2026-06-26T22:00:00+03:00",
    "marketSummary": {
        "spy": {
            "price": 731.69,
            "change": -0.36,
            "vwap": 731.69,
            "open": 730.40,
            "high": 736.53,
            "low": 726.86,
            "prevClose": 734.30,
            "note": "Gap down acilis sonrasi recovery. VWAP'e esit. Risk-on/off notr."
        },
        "qqq": {
            "price": 708.44,
            "change": -1.11,
            "vwap": 708.94,
            "open": 709.09,
            "high": 715.56,
            "low": 702.81,
            "prevClose": 716.38,
            "note": "VWAP altinda. Gap down acik, fill edilmedi. Tech zayif."
        },
        "iwm": {
            "price": 296.60,
            "change": -0.77,
            "vwap": 297.45,
            "open": 297.81,
            "high": 300.03,
            "low": 295.73,
            "prevClose": 298.91,
            "note": "VWAP altinda. Gap down kismen doldu. Small-cap zayif."
        },
        "vix": {
            "price": 18.83,
            "change": -0.32,
            "vwap": None,
            "open": 19.70,
            "high": 20.72,
            "low": 18.63,
            "prevClose": 18.89,
            "note": "CBOE verisi (Finnhub VIX icin 0 dondu). Normal regime (15-20). Complacency'tan cikti ama fear degil."
        }
    },
    "topMovers": {
        "gainers": [
            {
                "ticker": "FCEL",
                "company": "FuelCell Energy Inc",
                "price": 24.13,
                "change": 22.86,
                "volume": "16M",
                "catalyst": "Clean energy sector rotation; hydrogen/fuel cell momentum continuation. No specific company news identified — sector-wide momentum driver.",
                "sector": "Electrical Equipment",
                "marketCap": 1328500499,
                "week52Range": None,
                "note": "RVOL > 2x. Strong volume confirmation."
            },
            {
                "ticker": "APOG",
                "company": "Apogee Enterprises Inc",
                "price": 49.05,
                "change": 15.38,
                "volume": "498K",
                "catalyst": "Q1 FY2027 earnings BEAT: EPS $0.57 vs consensus $0.43 (+$0.14 beat). YoY EPS swing from -$0.13 to +$0.57.",
                "sector": "Building",
                "marketCap": 906990697,
                "week52Range": None,
                "note": "Earnings-driven gap up. Conference call 9:00 AM ET."
            },
            {
                "ticker": "SLS",
                "company": "SELLAS Life Sciences Group Inc",
                "price": 12.11,
                "change": 14.90,
                "volume": "11M",
                "catalyst": "Biotech momentum; SLS009 AML pipeline optimism. No specific intraday news identified — sector rotation into beaten-down biotech.",
                "sector": None,
                "marketCap": None,
                "week52Range": None,
                "note": "Volume well above average. High beta biotech bounce."
            },
            {
                "ticker": "MRNA",
                "company": "Moderna Inc",
                "price": 66.45,
                "change": 11.21,
                "volume": "9M",
                "catalyst": "Biotech sector bounce; vaccine pipeline optimism. No specific company news today — sector rotation into beaten-down biotech.",
                "sector": None,
                "marketCap": None,
                "week52Range": None,
                "note": "Volume above average. Mean reversion candidate."
            },
            {
                "ticker": "ASTS",
                "company": "AST SpaceMobile Inc",
                "price": 72.84,
                "change": 11.00,
                "volume": "13M",
                "catalyst": "Satellite telecom momentum; space infrastructure optimism. No specific news today — continuation of recent partnership rally.",
                "sector": "Telecommunication",
                "marketCap": 25468734257,
                "week52Range": None,
                "note": "RVOL elevated. Large-cap satellite play."
            }
        ],
        "losers": [
            {
                "ticker": "ON",
                "company": "ON Semiconductor Corp",
                "price": 90.18,
                "change": -24.08,
                "volume": "25M",
                "catalyst": "Semiconductor sector rout; AI/EV chip demand concerns. Global tech selloff contagion from Asian markets (KOSPI -8% circuit breaker).",
                "sector": "Semiconductors",
                "marketCap": 46534584900,
                "week52Range": None,
                "note": "Massive breakdown. RVOL > 2x. Gap down with no fill."
            },
            {
                "ticker": "BE",
                "company": "Bloom Energy Corp",
                "price": 269.57,
                "change": -12.84,
                "volume": "12M",
                "catalyst": "Clean energy sector profit-taking after recent run-up. Broader energy transition stock volatility. No specific company news today.",
                "sector": None,
                "marketCap": None,
                "week52Range": None,
                "note": "High-beta energy reversal. Recent run-up profit-taking."
            },
            {
                "ticker": "WDC",
                "company": "Western Digital Corp",
                "price": 592.43,
                "change": -12.27,
                "volume": "9M",
                "catalyst": "Semiconductor storage selloff; analyst downgrade (Outperform to Equalweight); capital structure overhang ($858M convertible notes dilution + SanDisk share-swap).",
                "sector": "Technology",
                "marketCap": 234756110000,
                "week52Range": None,
                "note": "Valuation compression after 274% YTD run. Earnings Aug 5, 2026."
            },
            {
                "ticker": "CAPR",
                "company": "Capricor Therapeutics Inc",
                "price": 26.36,
                "change": -13.26,
                "volume": "2M",
                "catalyst": "Biotech profit-taking after recent FDA approval rally. Clinical trial data sentiment shift. No specific news today.",
                "sector": None,
                "marketCap": None,
                "week52Range": None,
                "note": "High-beta healthcare selloff. Recent FDA approval for DMD drug."
            },
            {
                "ticker": "TMDX",
                "company": "TransMedics Group Inc",
                "price": 67.53,
                "change": -13.11,
                "volume": "2M",
                "catalyst": "Medical device sector profit-taking. No specific company news today — high-beta healthcare selloff continuation.",
                "sector": None,
                "marketCap": None,
                "week52Range": None,
                "note": "Organ transplant medical devices. Recent high volatility."
            }
        ]
    },
    "earningsCalendar": [
        {
            "ticker": "APOG",
            "company": "Apogee Enterprises Inc",
            "time": "before-open",
            "consensusEps": 0.43,
            "consensusRev": 333840000,
            "priorEps": -0.13,
            "priorRev": None,
            "expectedMove": None,
            "consensusRange": None,
            "analystSentiment": "bullish",
            "note": "APOG Q1 FY2027 earnings BEAT. EPS $0.57 vs $0.43 consensus (+$0.14 beat). YoY EPS swing from -$0.13. IV crush active post-earnings. 0DTE YASAK. Revenue data not fully available in sources."
        }
    ],
    "callSetups": [
        {
            "ticker": "APOG",
            "direction": "call",
            "entry": 49.05,
            "target": 56.00,
            "stop": 46.00,
            "riskReward": 2.3,
            "rationale": "Earnings beat momentum continuation. VWAP uzerinde kapanis bekleniyor. Volume confirmation. Gap fill 50.76 yakin destek.",
            "timeframe": "intraday",
            "note": "Earnings gunu — IV crush riski dusuyor ama hala yuksek. 0DTE YASAK."
        },
        {
            "ticker": "FCEL",
            "direction": "call",
            "entry": 24.13,
            "target": 29.00,
            "stop": 22.00,
            "riskReward": 2.5,
            "rationale": "Clean energy momentum continuation. Gap up + VWAP uzerinde. RVOL > 2x. Sector rotation.",
            "timeframe": "intraday",
            "note": "No earnings today. Momentum play."
        },
        {
            "ticker": "ASTS",
            "direction": "call",
            "entry": 72.84,
            "target": 82.00,
            "stop": 67.50,
            "riskReward": 2.1,
            "rationale": "Space telecom momentum. VWAP uzerinde consolidation. Breakout continuation setup. Large-cap options liquid.",
            "timeframe": "swing",
            "note": "No earnings today. High-liquidity options chain."
        },
        {
            "ticker": "MRNA",
            "direction": "call",
            "entry": 66.45,
            "target": 75.00,
            "stop": 62.00,
            "riskReward": 2.1,
            "rationale": "Biotech oversold bounce. VWAP reclaim + sector rotation. Mean reversion setup. Volume above average.",
            "timeframe": "swing",
            "note": "No earnings today. Beat-down biotech recovery."
        },
        {
            "ticker": "SPY",
            "direction": "call",
            "entry": 731.69,
            "target": 740.00,
            "stop": 727.00,
            "riskReward": 2.1,
            "rationale": "Gap fill potential + VWAP mean reversion. SPY gap down acildi, gap fill 734.30 hedefi. Risk-on bias.",
            "timeframe": "intraday",
            "note": "Index ETF. 0DTE liquid. VIX normal regime."
        }
    ],
    "putSetups": [
        {
            "ticker": "ON",
            "direction": "put",
            "entry": 90.18,
            "target": 82.00,
            "stop": 94.00,
            "riskReward": 2.0,
            "rationale": "Semiconductor breakdown. VWAP altinda. Sector contagion + momentum continuation. Gap down with no fill. KOSPI -8% contagion.",
            "timeframe": "intraday",
            "note": "No earnings today. Pure momentum breakdown. High volume."
        },
        {
            "ticker": "QQQ",
            "direction": "put",
            "entry": 708.44,
            "target": 692.00,
            "stop": 715.00,
            "riskReward": 2.3,
            "rationale": "Tech sector weakness. QQQ VWAP altinda. Gap down acik, trend continuation. Semiconductor rout drag.",
            "timeframe": "intraday",
            "note": "Index ETF. 0DTE liquid. Tech underperforming."
        },
        {
            "ticker": "WDC",
            "direction": "put",
            "entry": 592.43,
            "target": 540.00,
            "stop": 615.00,
            "riskReward": 2.3,
            "rationale": "Storage semiconductor breakdown. Analyst downgrade + dilution overhang. VWAP altinda. Gap continuation. 274% YTD run profit-taking.",
            "timeframe": "swing",
            "note": "Earnings Aug 5, 2026. No earnings today. Options chain may have wide spreads on such a high price — check bid/ask before entry."
        },
        {
            "ticker": "TMDX",
            "direction": "put",
            "entry": 67.53,
            "target": 58.00,
            "stop": 71.50,
            "riskReward": 2.1,
            "rationale": "Medical device profit-taking. VWAP altinda. High-beta healthcare selloff continuation. Recent high stretched.",
            "timeframe": "swing",
            "note": "No earnings today. Check options liquidity."
        },
        {
            "ticker": "BE",
            "direction": "put",
            "entry": 269.57,
            "target": 245.00,
            "stop": 280.00,
            "riskReward": 2.0,
            "rationale": "Clean energy momentum reversal. VWAP altinda kapanis. Recent run-up profit-taking. Sector rotation out of high-beta energy.",
            "timeframe": "swing",
            "note": "No earnings today. Options liquidity may be limited on such a high price — verify bid/ask."
        }
    ],
    "vwapNotes": "SPY price VWAP'e esit (731.69), gap down acilistan sonra recovery gosteriyor. QQQ ve IWM VWAP altinda kapanis — risk-off bias. QQQ gap down acik kaldi, fill edilmedi. IWM gap down kismen doldu. Tech selloff + semi weakness = VWAP altinda kalan index'ler put bias tasıyor. SPY notr, QQQ/IWM zayif.",
    "riskAssessment": {
        "level": "medium",
        "vixRegime": "VIX 18.83 (CBOE), normal regime (15-20). Onceki kapanis 18.89'den -0.32%. Complacency'tan cikti ama fear bolgesine girmedi.",
        "sectorRotation": "Tech zayif (QQQ -1.11%), Semiconductor sector under heavy pressure (ON -24%, WDC -12%). Biotech mixed (MRNA +11%, SLS +15%, CAPR -13%). Clean energy volatile (FCEL +23%, BE -13%).",
        "earningsRisk": "APOG Q1 earnings beat this morning. IV crush active post-release. 0DTE YASAK on APOG. No major tech earnings today. Next week: WDC Aug 5.",
        "macroRisk": "Fed policy uncertainty, Treasury yields elevated. Geopolitical: Iran Strait of Hormuz tensions supporting oil volatility. Asian markets KOSPI -8% circuit breaker Friday — global risk-off contagion."
    },
    "nextDayCarryForward": []
}

out_dir = r"C:\Users\hasan\OneDrive\Desktop\gistify\client\public\marketflash"
os.makedirs(out_dir, exist_ok=True)

json_path = os.path.join(out_dir, "marketflash_report.json")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(report, f, indent=2, ensure_ascii=False)

print(f"JSON written to: {json_path}")
print(f"File size: {os.path.getsize(json_path)} bytes")
