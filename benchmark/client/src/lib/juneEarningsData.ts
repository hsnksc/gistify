/*
 * DESIGN: "Precision Finance" — June 1-12 Earnings Data
 * IV Crush Strategy + Momentum Analysis for June earnings
 */

export interface JuneEarningsStock {
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
  expectedIVCrush: number;
  ivCrushPotential: 'HIGH' | 'MEDIUM' | 'LOW';
  
  // Option Strategy Metrics
  callPremiumBuy: number;
  callPremiumSell: number;
  callGainFromIV: number;
  
  putPremiumBuy: number;
  putPremiumSell: number;
  putGainFromIV: number;
  
  // Combined Score
  ivCrushScore: number;
  strategyRating: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  
  // Risk Factors
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  earningsMissRisk: number;
  gapRisk: number;
  
  // Recommended Strategy
  recommendedStrategy: string;
  targetProfit: number;
  maxLoss: number;
  
  // Historical Data
  lastEarningsMove: number;
  historicalIVCrush: number;
  beatRate: number;
}

export const juneEarningsData: JuneEarningsStock[] = [
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Semiconductors',
    earningsDate: '3 June 2026',
    
    momentumScore: 98,
    priceChange6M: 185,
    rsi14: 78,
    
    currentIV: 105,
    historicalIV: 72,
    impliedMove: 14.8,
    expectedIVCrush: 48,
    ivCrushPotential: 'HIGH',
    
    callPremiumBuy: 3.20,
    callPremiumSell: 7.80,
    callGainFromIV: 144,
    
    putPremiumBuy: 2.90,
    putPremiumSell: 7.20,
    putGainFromIV: 148,
    
    ivCrushScore: 96,
    strategyRating: 'EXCELLENT',
    
    riskLevel: 'HIGH',
    earningsMissRisk: 25,
    gapRisk: 35,
    
    recommendedStrategy: 'Long Call (Extreme momentum, massive IV crush)',
    targetProfit: 140,
    maxLoss: 32,
    
    lastEarningsMove: 18.5,
    historicalIVCrush: 45,
    beatRate: 88,
  },
  {
    ticker: 'AMD',
    name: 'Advanced Micro Devices',
    sector: 'Semiconductors',
    earningsDate: '4 June 2026',
    
    momentumScore: 92,
    priceChange6M: 156,
    rsi14: 75,
    
    currentIV: 98,
    historicalIV: 68,
    impliedMove: 13.2,
    expectedIVCrush: 44,
    ivCrushPotential: 'HIGH',
    
    callPremiumBuy: 2.80,
    callPremiumSell: 7.10,
    callGainFromIV: 154,
    
    putPremiumBuy: 2.60,
    putPremiumSell: 6.80,
    putGainFromIV: 162,
    
    ivCrushScore: 94,
    strategyRating: 'EXCELLENT',
    
    riskLevel: 'HIGH',
    earningsMissRisk: 28,
    gapRisk: 38,
    
    recommendedStrategy: 'Bull Call Spread (High IV, strong momentum)',
    targetProfit: 150,
    maxLoss: 28,
    
    lastEarningsMove: 16.2,
    historicalIVCrush: 42,
    beatRate: 85,
  },
  {
    ticker: 'INTC',
    name: 'Intel Corporation',
    sector: 'Semiconductors',
    earningsDate: '5 June 2026',
    
    momentumScore: 58,
    priceChange6M: -22,
    rsi14: 44,
    
    currentIV: 82,
    historicalIV: 65,
    impliedMove: 11.5,
    expectedIVCrush: 38,
    ivCrushPotential: 'MEDIUM',
    
    callPremiumBuy: 2.10,
    callPremiumSell: 5.20,
    callGainFromIV: 148,
    
    putPremiumBuy: 2.00,
    putPremiumSell: 5.00,
    putGainFromIV: 150,
    
    ivCrushScore: 72,
    strategyRating: 'GOOD',
    
    riskLevel: 'HIGH',
    earningsMissRisk: 55,
    gapRisk: 50,
    
    recommendedStrategy: 'Iron Condor (Weak momentum, IV crush play)',
    targetProfit: 95,
    maxLoss: 35,
    
    lastEarningsMove: -8.5,
    historicalIVCrush: 35,
    beatRate: 35,
  },
  {
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    sector: 'Automotive',
    earningsDate: '6 June 2026',
    
    momentumScore: 85,
    priceChange6M: 128,
    rsi14: 72,
    
    currentIV: 110,
    historicalIV: 75,
    impliedMove: 15.2,
    expectedIVCrush: 50,
    ivCrushPotential: 'HIGH',
    
    callPremiumBuy: 3.50,
    callPremiumSell: 8.50,
    callGainFromIV: 143,
    
    putPremiumBuy: 3.20,
    putPremiumSell: 8.00,
    putGainFromIV: 150,
    
    ivCrushScore: 95,
    strategyRating: 'EXCELLENT',
    
    riskLevel: 'VERY_HIGH',
    earningsMissRisk: 40,
    gapRisk: 45,
    
    recommendedStrategy: 'Long Call (Extreme volatility, high risk/reward)',
    targetProfit: 140,
    maxLoss: 38,
    
    lastEarningsMove: 12.8,
    historicalIVCrush: 48,
    beatRate: 72,
  },
  {
    ticker: 'META',
    name: 'Meta Platforms',
    sector: 'Technology',
    earningsDate: '7 June 2026',
    
    momentumScore: 88,
    priceChange6M: 95,
    rsi14: 70,
    
    currentIV: 92,
    historicalIV: 62,
    impliedMove: 12.8,
    expectedIVCrush: 42,
    ivCrushPotential: 'HIGH',
    
    callPremiumBuy: 2.70,
    callPremiumSell: 6.50,
    callGainFromIV: 141,
    
    putPremiumBuy: 2.50,
    putPremiumSell: 6.20,
    putGainFromIV: 148,
    
    ivCrushScore: 92,
    strategyRating: 'EXCELLENT',
    
    riskLevel: 'MEDIUM',
    earningsMissRisk: 22,
    gapRisk: 28,
    
    recommendedStrategy: 'Long Call + Bull Call Spread',
    targetProfit: 135,
    maxLoss: 26,
    
    lastEarningsMove: 10.5,
    historicalIVCrush: 40,
    beatRate: 82,
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Technology',
    earningsDate: '8 June 2026',
    
    momentumScore: 82,
    priceChange6M: 72,
    rsi14: 68,
    
    currentIV: 85,
    historicalIV: 58,
    impliedMove: 11.2,
    expectedIVCrush: 38,
    ivCrushPotential: 'MEDIUM',
    
    callPremiumBuy: 2.40,
    callPremiumSell: 5.80,
    callGainFromIV: 142,
    
    putPremiumBuy: 2.20,
    putPremiumSell: 5.50,
    putGainFromIV: 150,
    
    ivCrushScore: 88,
    strategyRating: 'EXCELLENT',
    
    riskLevel: 'LOW',
    earningsMissRisk: 18,
    gapRisk: 22,
    
    recommendedStrategy: 'Long Call (Stable, good IV crush)',
    targetProfit: 130,
    maxLoss: 24,
    
    lastEarningsMove: 8.2,
    historicalIVCrush: 36,
    beatRate: 88,
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    earningsDate: '9 June 2026',
    
    momentumScore: 80,
    priceChange6M: 65,
    rsi14: 66,
    
    currentIV: 78,
    historicalIV: 55,
    impliedMove: 10.5,
    expectedIVCrush: 35,
    ivCrushPotential: 'MEDIUM',
    
    callPremiumBuy: 2.20,
    callPremiumSell: 5.20,
    callGainFromIV: 136,
    
    putPremiumBuy: 2.00,
    putPremiumSell: 4.90,
    putGainFromIV: 145,
    
    ivCrushScore: 85,
    strategyRating: 'GOOD',
    
    riskLevel: 'LOW',
    earningsMissRisk: 15,
    gapRisk: 18,
    
    recommendedStrategy: 'Long Call (Safe, consistent)',
    targetProfit: 120,
    maxLoss: 22,
    
    lastEarningsMove: 6.8,
    historicalIVCrush: 33,
    beatRate: 90,
  },
  {
    ticker: 'ORCL',
    name: 'Oracle Corporation',
    sector: 'Software',
    earningsDate: '10 June 2026',
    
    momentumScore: 72,
    priceChange6M: 48,
    rsi14: 62,
    
    currentIV: 68,
    historicalIV: 52,
    impliedMove: 8.8,
    expectedIVCrush: 32,
    ivCrushPotential: 'MEDIUM',
    
    callPremiumBuy: 1.80,
    callPremiumSell: 4.20,
    callGainFromIV: 133,
    
    putPremiumBuy: 1.70,
    putPremiumSell: 4.00,
    putGainFromIV: 135,
    
    ivCrushScore: 78,
    strategyRating: 'GOOD',
    
    riskLevel: 'LOW',
    earningsMissRisk: 20,
    gapRisk: 24,
    
    recommendedStrategy: 'Bull Call Spread (Moderate IV crush)',
    targetProfit: 110,
    maxLoss: 20,
    
    lastEarningsMove: 5.5,
    historicalIVCrush: 30,
    beatRate: 85,
  },
  {
    ticker: 'IBM',
    name: 'IBM Corporation',
    sector: 'Technology',
    earningsDate: '11 June 2026',
    
    momentumScore: 55,
    priceChange6M: -15,
    rsi14: 48,
    
    currentIV: 62,
    historicalIV: 50,
    impliedMove: 7.5,
    expectedIVCrush: 28,
    ivCrushPotential: 'LOW',
    
    callPremiumBuy: 1.50,
    callPremiumSell: 3.40,
    callGainFromIV: 127,
    
    putPremiumBuy: 1.40,
    putPremiumSell: 3.20,
    putGainFromIV: 129,
    
    ivCrushScore: 62,
    strategyRating: 'FAIR',
    
    riskLevel: 'MEDIUM',
    earningsMissRisk: 45,
    gapRisk: 40,
    
    recommendedStrategy: 'Iron Condor (Low IV crush, weak momentum)',
    targetProfit: 75,
    maxLoss: 25,
    
    lastEarningsMove: -3.2,
    historicalIVCrush: 25,
    beatRate: 50,
  },
  {
    ticker: 'QCOM',
    name: 'Qualcomm Inc.',
    sector: 'Semiconductors',
    earningsDate: '12 June 2026',
    
    momentumScore: 84,
    priceChange6M: 118,
    rsi14: 71,
    
    currentIV: 88,
    historicalIV: 60,
    impliedMove: 12.2,
    expectedIVCrush: 40,
    ivCrushPotential: 'HIGH',
    
    callPremiumBuy: 2.60,
    callPremiumSell: 6.30,
    callGainFromIV: 142,
    
    putPremiumBuy: 2.40,
    putPremiumSell: 6.00,
    putGainFromIV: 150,
    
    ivCrushScore: 90,
    strategyRating: 'EXCELLENT',
    
    riskLevel: 'MEDIUM',
    earningsMissRisk: 26,
    gapRisk: 32,
    
    recommendedStrategy: 'Long Call (Strong momentum, good IV crush)',
    targetProfit: 135,
    maxLoss: 25,
    
    lastEarningsMove: 11.5,
    historicalIVCrush: 38,
    beatRate: 83,
  },
];

export const juneStrategyConfig = {
  EXCELLENT: {
    label: 'Mükemmel Fırsat',
    color: 'oklch(0.78 0.18 160)',
    bgClass: 'bg-emerald-500/20',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500',
  },
  GOOD: {
    label: 'İyi Fırsat',
    color: '#4ade80',
    bgClass: 'bg-green-500/20',
    textClass: 'text-green-400',
    borderClass: 'border-green-500',
  },
  FAIR: {
    label: 'Makul Fırsat',
    color: 'oklch(0.75 0.15 75)',
    bgClass: 'bg-yellow-500/20',
    textClass: 'text-yellow-400',
    borderClass: 'border-yellow-500',
  },
  POOR: {
    label: 'Zayıf Fırsat',
    color: 'oklch(0.65 0.22 25)',
    bgClass: 'bg-red-500/20',
    textClass: 'text-red-400',
    borderClass: 'border-red-500',
  },
};
