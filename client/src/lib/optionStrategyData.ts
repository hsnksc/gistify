/*
 * DESIGN: "Precision Finance" — Options IV Crush Strategy Data
 * Combines momentum + IV crush opportunity + historical patterns
 */

export interface OptionStrategy {
  ticker: string;
  name: string;
  sector: string;
  earningsDate: string;
  
  // Momentum Metrics
  momentumScore: number;
  priceChange6M: number;
  rsi14: number;
  
  // IV Crush Metrics
  currentIV: number;
  historicalIV: number;
  impliedMove: number;
  expectedIVCrush: number; // Expected IV drop after earnings (%)
  ivCrushPotential: 'HIGH' | 'MEDIUM' | 'LOW'; // >35%, 20-35%, <20%
  
  // Option Strategy Metrics
  callPremiumBuy: number; // Cost to buy call 10-15 days before
  callPremiumSell: number; // Price to sell call 1-2 days before
  callGainFromIV: number; // Gain from IV expansion (%)
  
  putPremiumBuy: number;
  putPremiumSell: number;
  putGainFromIV: number;

  // Directional Bias
  directionalBias: 'CALL' | 'PUT' | 'NEUTRAL';
  biasReason: string;
  biasStrength: number; // 0-100
  
  // Combined Score
  ivCrushScore: number; // 0-100: Higher = Better IV crush opportunity
  strategyRating: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  
  // Risk Factors
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  earningsMissRisk: number; // 0-100
  gapRisk: number; // 0-100
  
  // Recommended Strategy
  recommendedStrategy: string;
  targetProfit: number; // Expected profit in %
  maxLoss: number; // Max loss in %
  
  // Historical Data
  lastEarningsMove: number; // Last earnings price move (%)
  historicalIVCrush: number; // Historical average IV crush (%)
  beatRate: number; // % of beats in last 4 quarters
}

export const optionStrategyData: OptionStrategy[] = [
  {
    ticker: 'MRVL',
    name: 'Marvell Technology',
    sector: 'Semiconductors',
    earningsDate: '27 May 2026',
    
    momentumScore: 80,
    priceChange6M: 136,
    rsi14: 59,
    
    currentIV: 89,
    historicalIV: 65,
    impliedMove: 10.9,
    expectedIVCrush: 42,
    ivCrushPotential: 'HIGH',
    
    callPremiumBuy: 2.50,
    callPremiumSell: 5.80,
    callGainFromIV: 132,
    
    putPremiumBuy: 2.30,
    putPremiumSell: 5.40,
    putGainFromIV: 135,

    directionalBias: 'CALL',
    biasReason: 'Strong AI momentum & institutional volume support.',
    biasStrength: 92,
    
    ivCrushScore: 94,
    strategyRating: 'EXCELLENT',
    
    riskLevel: 'HIGH',
    earningsMissRisk: 35,
    gapRisk: 40,
    
    recommendedStrategy: 'Long Call (Buy 15d before, Sell 1-2d before)',
    targetProfit: 120,
    maxLoss: 30,
    
    lastEarningsMove: 8.5,
    historicalIVCrush: 38,
    beatRate: 75,
  },
  {
    ticker: 'CRWD',
    name: 'CrowdStrike Holdings',
    sector: 'Cybersecurity',
    earningsDate: '3 June 2026',
    
    momentumScore: 93,
    priceChange6M: 90,
    rsi14: 72,
    
    currentIV: 78,
    historicalIV: 52,
    impliedMove: 10.3,
    expectedIVCrush: 38,
    ivCrushPotential: 'HIGH',
    
    callPremiumBuy: 2.80,
    callPremiumSell: 6.20,
    callGainFromIV: 121,
    
    putPremiumBuy: 2.60,
    putPremiumSell: 5.80,
    putGainFromIV: 123,

    directionalBias: 'CALL',
    biasReason: 'Platform consolidation winner, near 52W high.',
    biasStrength: 88,
    
    ivCrushScore: 92,
    strategyRating: 'EXCELLENT',
    
    riskLevel: 'MEDIUM',
    earningsMissRisk: 20,
    gapRisk: 25,
    
    recommendedStrategy: 'Long Call + Bull Call Spread',
    targetProfit: 110,
    maxLoss: 25,
    
    lastEarningsMove: 12.3,
    historicalIVCrush: 35,
    beatRate: 100,
  },
  {
    ticker: 'AVGO',
    name: 'Broadcom Inc.',
    sector: 'Semiconductors',
    earningsDate: '3 June 2026',
    
    momentumScore: 84,
    priceChange6M: 22,
    rsi14: 60,
    
    currentIV: 44,
    historicalIV: 42,
    impliedMove: 6.4,
    expectedIVCrush: 22,
    ivCrushPotential: 'MEDIUM',
    
    callPremiumBuy: 1.50,
    callPremiumSell: 2.80,
    callGainFromIV: 87,
    
    putPremiumBuy: 1.40,
    putPremiumSell: 2.60,
    putGainFromIV: 86,

    directionalBias: 'CALL',
    biasReason: 'Positive guidance beat potential, record EBITDA margins.',
    biasStrength: 85,
    
    ivCrushScore: 75,
    strategyRating: 'GOOD',
    
    riskLevel: 'LOW',
    earningsMissRisk: 15,
    gapRisk: 18,
    
    recommendedStrategy: 'Long Call (Safe play, low IV crush)',
    targetProfit: 80,
    maxLoss: 20,
    
    lastEarningsMove: 5.2,
    historicalIVCrush: 20,
    beatRate: 88,
  },
  {
    ticker: 'COST',
    name: 'Costco Wholesale',
    sector: 'Retail',
    earningsDate: '28 May 2026',
    
    momentumScore: 77,
    priceChange6M: 28,
    rsi14: 59,
    
    currentIV: 22,
    historicalIV: 21,
    impliedMove: 3.7,
    expectedIVCrush: 15,
    ivCrushPotential: 'LOW',
    
    callPremiumBuy: 0.85,
    callPremiumSell: 1.15,
    callGainFromIV: 35,
    
    putPremiumBuy: 0.80,
    putPremiumSell: 1.10,
    putGainFromIV: 38,

    directionalBias: 'NEUTRAL',
    biasReason: 'Defensive play, low beta volatility.',
    biasStrength: 50,
    
    ivCrushScore: 42,
    strategyRating: 'FAIR',
    
    riskLevel: 'LOW',
    earningsMissRisk: 10,
    gapRisk: 8,
    
    recommendedStrategy: 'Iron Condor (Low volatility, limited profit)',
    targetProfit: 30,
    maxLoss: 15,
    
    lastEarningsMove: 2.8,
    historicalIVCrush: 12,
    beatRate: 95,
  },
  {
    ticker: 'DELL',
    name: 'Dell Technologies',
    sector: 'Technology Hardware',
    earningsDate: '29 May 2026',
    
    momentumScore: 84,
    priceChange6M: 36,
    rsi14: 61,
    
    currentIV: 62,
    historicalIV: 55,
    impliedMove: 8.7,
    expectedIVCrush: 28,
    ivCrushPotential: 'MEDIUM',
    
    callPremiumBuy: 1.80,
    callPremiumSell: 3.50,
    callGainFromIV: 94,
    
    putPremiumBuy: 1.70,
    putPremiumSell: 3.30,
    putGainFromIV: 94,

    directionalBias: 'CALL',
    biasReason: 'AI server demand growth, but low volume fatigue.',
    biasStrength: 65,
    
    ivCrushScore: 68,
    strategyRating: 'GOOD',
    
    riskLevel: 'MEDIUM',
    earningsMissRisk: 25,
    gapRisk: 22,
    
    recommendedStrategy: 'Bull Call Spread',
    targetProfit: 85,
    maxLoss: 22,
    
    lastEarningsMove: 6.5,
    historicalIVCrush: 26,
    beatRate: 75,
  },
  {
    ticker: 'PANW',
    name: 'Palo Alto Networks',
    sector: 'Cybersecurity',
    earningsDate: '31 May 2026',
    
    momentumScore: 0,
    priceChange6M: 45,
    rsi14: 87,
    
    currentIV: 88,
    historicalIV: 58,
    impliedMove: 9.1,
    expectedIVCrush: 35,
    ivCrushPotential: 'HIGH',
    
    callPremiumBuy: 2.40,
    callPremiumSell: 5.10,
    callGainFromIV: 113,
    
    putPremiumBuy: 2.20,
    putPremiumSell: 4.80,
    putGainFromIV: 118,

    directionalBias: 'PUT',
    biasReason: 'Overbought (RSI 87), high risk of "sell the news".',
    biasStrength: 72,
    
    ivCrushScore: 85,
    strategyRating: 'EXCELLENT',
    
    riskLevel: 'HIGH',
    earningsMissRisk: 40,
    gapRisk: 38,
    
    recommendedStrategy: 'Covered Call (Overbought, profit-taking)',
    targetProfit: 105,
    maxLoss: 28,
    
    lastEarningsMove: 7.8,
    historicalIVCrush: 32,
    beatRate: 80,
  },
  {
    ticker: 'ADSK',
    name: 'Autodesk Inc.',
    sector: 'Software',
    earningsDate: '2 June 2026',
    
    momentumScore: 65,
    priceChange6M: -8,
    rsi14: 48,
    
    currentIV: 58,
    historicalIV: 52,
    impliedMove: 7.4,
    expectedIVCrush: 25,
    ivCrushPotential: 'MEDIUM',
    
    callPremiumBuy: 1.60,
    callPremiumSell: 3.10,
    callGainFromIV: 94,
    
    putPremiumBuy: 1.55,
    putPremiumSell: 3.00,
    putGainFromIV: 94,

    directionalBias: 'NEUTRAL',
    biasReason: 'Software sector pressure, weak momentum.',
    biasStrength: 45,
    
    ivCrushScore: 58,
    strategyRating: 'FAIR',
    
    riskLevel: 'MEDIUM',
    earningsMissRisk: 45,
    gapRisk: 35,
    
    recommendedStrategy: 'Iron Condor (Neutral, limited directional bias)',
    targetProfit: 65,
    maxLoss: 25,
    
    lastEarningsMove: -3.2,
    historicalIVCrush: 22,
    beatRate: 50,
  },
  {
    ticker: 'CRM',
    name: 'Salesforce Inc.',
    sector: 'Software',
    earningsDate: '1 June 2026',
    
    momentumScore: 58,
    priceChange6M: -32,
    rsi14: 43,
    
    currentIV: 56,
    historicalIV: 48,
    impliedMove: 7.5,
    expectedIVCrush: 24,
    ivCrushPotential: 'MEDIUM',
    
    callPremiumBuy: 1.40,
    callPremiumSell: 2.80,
    callGainFromIV: 100,
    
    putPremiumBuy: 1.35,
    putPremiumSell: 2.70,
    putGainFromIV: 100,

    directionalBias: 'PUT',
    biasReason: 'Broken momentum, high volume distribution.',
    biasStrength: 82,
    
    ivCrushScore: 52,
    strategyRating: 'FAIR',
    
    riskLevel: 'HIGH',
    earningsMissRisk: 50,
    gapRisk: 45,
    
    recommendedStrategy: 'Avoid (Broken momentum, high miss risk)',
    targetProfit: 50,
    maxLoss: 35,
    
    lastEarningsMove: -8.5,
    historicalIVCrush: 20,
    beatRate: 45,
  },
  {
    ticker: 'SNOW',
    name: 'Snowflake Inc.',
    sector: 'Software',
    earningsDate: '30 May 2026',
    
    momentumScore: 38,
    priceChange6M: -35,
    rsi14: 32,
    
    currentIV: 98,
    historicalIV: 62,
    impliedMove: 13.5,
    expectedIVCrush: 45,
    ivCrushPotential: 'HIGH',
    
    callPremiumBuy: 2.80,
    callPremiumSell: 6.50,
    callGainFromIV: 132,
    
    putPremiumBuy: 2.70,
    putPremiumSell: 6.30,
    putGainFromIV: 133,

    directionalBias: 'PUT',
    biasReason: 'Extreme bearish momentum, high valuation risk.',
    biasStrength: 78,
    
    ivCrushScore: 88,
    strategyRating: 'EXCELLENT',
    
    riskLevel: 'VERY_HIGH',
    earningsMissRisk: 65,
    gapRisk: 60,
    
    recommendedStrategy: 'Sell Straddle (IV crush play, but high directional risk)',
    targetProfit: 125,
    maxLoss: 50,
    
    lastEarningsMove: -12.5,
    historicalIVCrush: 42,
    beatRate: 25,
  },
  {
    ticker: 'ZS',
    name: 'Zscaler Inc.',
    sector: 'Cybersecurity',
    earningsDate: '2 June 2026',
    
    momentumScore: 46,
    priceChange6M: -38,
    rsi14: 37,
    
    currentIV: 96,
    historicalIV: 60,
    impliedMove: 12.2,
    expectedIVCrush: 43,
    ivCrushPotential: 'HIGH',
    
    callPremiumBuy: 2.60,
    callPremiumSell: 6.10,
    callGainFromIV: 135,
    
    putPremiumBuy: 2.50,
    putPremiumSell: 5.90,
    putGainFromIV: 136,

    directionalBias: 'PUT',
    biasReason: 'Management uncertainty (EVP exit), broken technicals.',
    biasStrength: 85,
    
    ivCrushScore: 90,
    strategyRating: 'EXCELLENT',
    
    riskLevel: 'VERY_HIGH',
    earningsMissRisk: 70,
    gapRisk: 65,
    
    recommendedStrategy: 'Avoid (IV crush play only, too much directional risk)',
    targetProfit: 130,
    maxLoss: 55,
    
    lastEarningsMove: -15.2,
    historicalIVCrush: 40,
    beatRate: 20,
  },
];

export const strategyConfig = {
  EXCELLENT: {
    label: 'Mükemmel Fırsat',
    color: 'oklch(0.78 0.18 160)',
    bgClass: 'bg-emerald-500/20',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500',
    desc: 'Yüksek IV crush + Güçlü momentum = En iyi fırsat',
  },
  GOOD: {
    label: 'İyi Fırsat',
    color: '#4ade80',
    bgClass: 'bg-green-500/20',
    textClass: 'text-green-400',
    borderClass: 'border-green-500',
    desc: 'Orta IV crush + Makul momentum',
  },
  FAIR: {
    label: 'Makul Fırsat',
    color: 'oklch(0.75 0.15 75)',
    bgClass: 'bg-yellow-500/20',
    textClass: 'text-yellow-400',
    borderClass: 'border-yellow-500',
    desc: 'Düşük IV crush veya zayıf momentum',
  },
  POOR: {
    label: 'Zayıf Fırsat',
    color: 'oklch(0.65 0.22 25)',
    bgClass: 'bg-red-500/20',
    textClass: 'text-red-400',
    borderClass: 'border-red-500',
    desc: 'Çok düşük IV crush + Kırılmış momentum',
  },
};

export const riskLevelConfig = {
  LOW: { label: 'Düşük', color: 'oklch(0.78 0.18 160)', textClass: 'text-emerald-400' },
  MEDIUM: { label: 'Orta', color: 'oklch(0.75 0.15 75)', textClass: 'text-yellow-400' },
  HIGH: { label: 'Yüksek', color: 'oklch(0.65 0.22 25)', textClass: 'text-red-400' },
  VERY_HIGH: { label: 'Çok Yüksek', color: 'oklch(0.55 0.25 25)', textClass: 'text-red-600' },
};
