import json
import os

data = {
  "generatedAt": "2026-07-07T00:05:00Z",
  "reportDate": "2026-07-07",
  "title": "US CPI Forecast Snapshot — June 2026 (v3.1 EIA-Validated Methodology)",
  "methodology": "Two-stage aggregation using exact BLS 2024-2025 relative importance weights. Stage 1: component-level forecasts. Stage 2: weighted aggregation. Verification: Food+Energy+Core=100.000% and Shelter+CoreGoods+CoreServices=80.557%. Energy components validated with AAA retail gasoline ($3.797/gal Jul 6). WTI futures NOT used for gasoline CPI per backtest (R²=0.23, MAE=8.1%). Backtest: 15 months weight accuracy MAE 0.035% core, 0.146% headline.",
  "summary": "June 2026 CPI headline +0.2% m/m (consensus +0.2–0.3%) as gasoline collapse drags energy lower. Core +0.3% m/m (consensus +0.3%) with sticky services and shelter offsetting soft core goods. AAA retail gasoline $3.797/gal Jul 6 vs May avg ~$4.32 (-12%). June jobs miss (+57K vs +120K exp) softens hawkish Fed tail risk. 10Y UST 4.46%. FOMC Jun 16-17 hold but dot plot still shows one hike in 2026. Market reaction likely muted unless core surprises.",
  "baseCase": "Inline headline on energy drag; core stable at +0.3% with shelter and services sticky. Weak jobs data caps hawkish reaction.",
  "conviction": 72,
  "weights": {
    "food": 13.25,
    "energy": 6.193,
    "core": 80.557,
    "shelter": 34.411,
    "coreGoods": 18.4,
    "coreServices": 27.746
  },
  "aggregation": {
    "foodContribution": 0.0265,
    "energyContribution": -0.0991,
    "coreContribution": 0.2417,
    "headline": 0.1691,
    "core": 0.30,
    "verification": "Food(13.25) + Energy(6.193) + Core(80.557) = 100.000% | Shelter(34.411) + CoreGoods(18.4) + CoreServices(27.746) = 80.557%"
  },
  "release": {
    "name": "CPI",
    "period": "Jun 2026",
    "releaseDate": "2026-07-10",
    "releaseTimeEt": "08:30 ET",
    "headlineMoM": "+0.2%",
    "headlineYoY": "3.6%",
    "coreMoM": "+0.3%",
    "coreYoY": "3.0%",
    "priorHeadlineMoM": "+0.5%",
    "priorHeadlineYoY": "4.2%",
    "priorCoreMoM": "+0.2%",
    "priorCoreYoY": "2.9%",
    "bias": "INLINE",
    "confidence": 72,
    "thesis": "AAA retail gasoline $3.797/gal Jul 6 vs May avg ~$4.32 (-12%). Energy CPI deflation ≈ -1.6% m/m composite, subtracting ~0.10ppt from headline. Core stable (+0.3%) with shelter sticky (+0.35%) and core services firm (+0.45%) offsetting soft core goods (0.0%). June jobs miss (+57K) shifts Fed focus to growth risks, capping hawkish tail risk. 10Y 4.46% anchors rate sensitivity."
  },
  "scenarios": [
    {
      "id": "base",
      "label": "Base case",
      "probability": 55,
      "outcome": "Headline +0.2% m/m, Core +0.3% m/m — gasoline collapse dominates headline; core stable with shelter sticky and services firm",
      "marketReadthrough": "10Y yields 4.40–4.50%, DXY 101–102. Tech ($QQQ) and duration ($TLT) supported if core does not re-accelerate. Airlines ($UAL) and homebuilders ($DHI) benefit from energy/mortgage relief. Energy sector ($XLE) underperforms.",
      "favoredAssets": ["$QQQ", "$UAL", "$DHI", "$TLT", "$AMT"],
      "invalidation": "Core services re-accelerate above +0.45% m/m; shelter prints above +0.50%; gasoline rebound on Iran flare-up."
    },
    {
      "id": "hot",
      "label": "Hotter inflation surprise",
      "probability": 25,
      "outcome": "Headline +0.3% m/m, Core +0.4% m/m — core services re-accelerate despite gasoline drop; core PPI passthrough materializes",
      "marketReadthrough": "10Y yields spike 4.55%+, DXY 102+. Tech selloff ($NVDA, $MSFT). Gold ($GLD) squeeze. USD long. $SPY PUT setups. $VIX CALL. $XLE short-cover rally.",
      "favoredAssets": ["$USD", "$GLD", "$XLE", "$SPY_PUT", "$VIX_CALL"],
      "invalidation": "Hot print driven by one-off transportation component; core goods actually deflationary; gasoline continues to fall."
    },
    {
      "id": "cool",
      "label": "Cooler disinflation impulse",
      "probability": 20,
      "outcome": "Headline +0.1% m/m, Core +0.2% m/m — oil collapse fully captured, DXY softens, shelter decelerates faster than expected",
      "marketReadthrough": "10Y yields drop 4.30–4.40%, DXY 100–101. Aggressive risk-on: $QQQ +2–3%, $UAL +8%, $DHI +5%. $TLT strong. Fed-cut odds rise. $XLE -5%.",
      "favoredAssets": ["$QQQ", "$UAL", "$DHI", "$TLT", "$NVT"],
      "invalidation": "Market already priced benign outcome after weak jobs; FOMC hawkish tone prevents rally; Warsh 'one data point' rhetoric."
    }
  ],
  "setups": [
    {
      "asset": "UST 10Y / $TLT",
      "bias": "Long duration on cooler or inline core",
      "trigger": "Core CPI <= +0.3% and 10Y yield fails 4.45%; DXY below 101.5",
      "invalidation": "Core services above +0.40% with 10Y yield breaks 4.55%."
    },
    {
      "asset": "NASDAQ / $QQQ / $NVDA",
      "bias": "Long on soft headline — rate-cut pricing revived",
      "trigger": "Headline <= +0.2% and core <= +0.3%; $VIX below 17",
      "invalidation": "Hot core with 10Y yield above 4.55%; DXY above 102."
    },
    {
      "asset": "Airlines — $UAL / $DAL",
      "bias": "Long — jet fuel collapse + summer demand intact",
      "trigger": "AAA gasoline <$3.85 and CPI headline soft; summer bookings strong",
      "invalidation": "Iran deal collapses, WTI above $80, or travel demand disappoints."
    },
    {
      "asset": "Homebuilders — $DHI / $LEN / $XHB",
      "bias": "Long — mortgage rate relief on soft CPI + 10Y fade",
      "trigger": "10Y yield below 4.40% and core CPI inline or cooler",
      "invalidation": "10Y yields spike above 4.55% on hot CPI or PPI passthrough."
    },
    {
      "asset": "Energy — $XLE / $XOM / $CVX",
      "bias": "Short — oil supply recovering, Iran ceasefire holding, gasoline in free fall",
      "trigger": "WTI below $70 and gasoline continues to decline; API inventories build",
      "invalidation": "Iran ceasefire collapses, Israel attacks, or OPEC+ emergency cuts."
    },
    {
      "asset": "Gold — $GLD",
      "bias": "Long hedge — Fed uncertainty + weak jobs + geopolitical risk",
      "trigger": "DXY below 100.50 and real yields compress; geopolitical flare-up",
      "invalidation": "DXY above 102 with 10Y yields >4.60%; strong risk-on kills safe-haven bid."
    }
  ],
  "watchItems": [
    {
      "label": "Fed path / Warsh",
      "value": "1 hike in 2026 (dot plot 3.8%) — but weakening after jobs miss",
      "note": "FOMC Jun 16-17 hawkish hold. Warsh first meeting. 9/18 participants expect hike. June NFP +57K cuts hike odds to ~54% for Sep. PCE forecasts 3.6% headline, 3.3% core. Easing bias removed from statement."
    },
    {
      "label": "10Y UST",
      "value": "4.46% (Jul 6)",
      "note": "Key regime line. Below 4.40% = growth rally. Above 4.55% = risk-off. Gasoline pulling down, FOMC pushing up."
    },
    {
      "label": "AAA Retail Gasoline",
      "value": "$3.797/gal (Jul 6)",
      "note": "AAA National Average. Down from $4.191 month ago (-9.4%). Down from ~$4.32 May avg. EIA retail is primary input. WTI futures NOT used for gasoline CPI per backtest (R²=0.23 failed)."
    },
    {
      "label": "ISM Prices Paid",
      "value": "Mfg 73.0 (Jun), Svcs 71.3 (May)",
      "note": "Manufacturing prices cooling from 82.1 peak but still elevated. Services prices sticky at 71.3. Watch Jun Services print."
    },
    {
      "label": "DXY",
      "value": "101.07 (Jul 6)",
      "note": "Strong dollar = import deflation on core goods. Partially offsets PPI passthrough. YTD +2.70%."
    },
    {
      "label": "Manheim Used Vehicle Index",
      "value": "212.6 (May), +3.6% y/y",
      "note": "Used car prices firm but seasonal depreciation starting. Full Jun release Jul 8."
    },
    {
      "label": "WTI Crude",
      "value": "$68.62 (Jul 6)",
      "note": "Down 24.85% past month. Iran ceasefire + OPEC+ unwinding cuts. War premium evaporating. Directional only — NOT used for gasoline CPI forecast."
    },
    {
      "label": "VIX",
      "value": "16.33 (Jul 6)",
      "note": "Post-expiry normalization. Low VIX = complacency risk. CPI day could see 18–22 spike on surprise."
    },
    {
      "label": "June Jobs",
      "value": "+57K NFP, 4.2% UR",
      "note": "Big miss vs +120K expected. 74K downward revision to Apr/May. Unemployment 4.2%. Cuts hawkish tail risk. Fed may shift to growth-monitoring mode."
    }
  ],
  "keyDrivers": [
    "Oil/gasoline collapse: AAA retail gasoline $3.797/gal Jul 6 vs May avg ~$4.32 (-12%). Energy CPI deflation ≈ -1.6% m/m composite, subtracting ~0.10ppt from headline. EIA retail/AAA is primary source; WTI futures NOT used for gasoline CPI per backtest (R²=0.23, MAE=8.1%).",
    "June jobs miss: +57K NFP vs +120K expected. 74K downward revision. UR 4.2%. Shifts Fed focus to growth risks, reducing hawkish tail risk for CPI reaction. Sep hike odds dropped from 66% to ~54%.",
    "Shelter stickiness: Zillow/Apartment List leading indicators slowing but BLS 6-12 month lag means OER still prints ~0.3–0.35% m/m. Rent of primary residence ~2.5% y/y. Full deceleration not yet in BLS data.",
    "DXY 101.07: Strong dollar = import deflation on core goods. Partially offsets any PPI passthrough. Core goods may see mild deflation (0.0% m/m).",
    "ISM prices divergence: Manufacturing prices cooling (73.0 from 82.1) = goods disinflation. Services prices sticky (71.3) = core services risk. Transportation/warehousing key wildcard.",
    "Core PPI passthrough watch: Prior hot PPI prints feed into core CPI with 1-3 month lag. If services passthrough accelerates in Jul/Aug, core undershoot narrative breaks."
  ],
  "risks": [
    "Core PPI passthrough: Hot PPI feeds into core CPI with 1-3 month lag. If services passthrough materializes in July, core surprise to upside.",
    "Iran ceasefire collapse: Nuclear talks fragile. WTI $80+ = CPI revision to hotter and gasoline rebound.",
    "FOMC hawkish limits reaction: Market may 'sell the rally' even on soft CPI. Warsh 'price stability' rhetoric + dot plot hike = unpredictable Fed.",
    "ISM Services Prices re-acceleration: Jun print if >75 = core services sticky confirmation.",
    "Demand weakness: Global recession fears rising. If oil and risk assets both fall, soft CPI = bad news for equities (stagflation fear).",
    "Shelter lag uncertainty: Zillow/Apartment List slowing but BLS 6-12 month lag. Faster deceleration = core downside surprise; slower = core sticky."
  ]
}

base = r"C:\Users\hasan\OneDrive\Desktop\gistify"
tmp = os.path.join(base, "cpi_forecast.json.tmp")
final = os.path.join(base, "cpi_forecast.json")

with open(tmp, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.flush()
    os.fsync(f.fileno())

os.replace(tmp, final)
print("Written to", final)
