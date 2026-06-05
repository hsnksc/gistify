/*
 * DESIGN: "Precision Finance" — June 8-19 Earnings & Momentum Data
 * IV Crush Strategy + Momentum Analysis for 8-19 June window
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
    ticker: 'ORCL',
    name: 'Oracle Corporation',
    sector: 'Software',
    earningsDate: '10 June 2026',
    
    momentumScore: 78,
    priceChange6M: 48,
    rsi14: 62,
    
    currentIV: 72,
    historicalIV: 52,
    impliedMove: 5.5,
    expectedIVCrush: 32,
    ivCrushPotential: 'MEDIUM',
    
    callPremiumBuy: 1.80,
    callPremiumSell: 4.20,
    callGainFromIV: 133,
    
    putPremiumBuy: 1.70,
    putPremiumSell: 4.00,
    putGainFromIV: 135,
    
    ivCrushScore: 82,
    strategyRating: 'EXCELLENT',
    
    riskLevel: 'MEDIUM',
    earningsMissRisk: 20,
    gapRisk: 24,
    
    recommendedStrategy: 'Long Call + Bull Call Spread (Cloud/AI guidance binary event)',
    targetProfit: 120,
    maxLoss: 22,
    
    lastEarningsMove: 5.5,
    historicalIVCrush: 30,
    beatRate: 85,
  },
  {
    ticker: 'LEN',
    name: 'Lennar Corporation',
    sector: 'Homebuilders',
    earningsDate: '11 June 2026',
    
    momentumScore: 65,
    priceChange6M: 22,
    rsi14: 55,
    
    currentIV: 58,
    historicalIV: 42,
    impliedMove: 4.3,
    expectedIVCrush: 26,
    ivCrushPotential: 'MEDIUM',
    
    callPremiumBuy: 1.40,
    callPremiumSell: 3.20,
    callGainFromIV: 129,
    
    putPremiumBuy: 1.30,
    putPremiumSell: 3.00,
    putGainFromIV: 131,
    
    ivCrushScore: 68,
    strategyRating: 'GOOD',
    
    riskLevel: 'MEDIUM',
    earningsMissRisk: 28,
    gapRisk: 30,
    
    recommendedStrategy: 'Iron Condor (Low EVR 2.1, mortgage rate sensitive, FOMC pre-event)',
    targetProfit: 95,
    maxLoss: 20,
    
    lastEarningsMove: 4.3,
    historicalIVCrush: 25,
    beatRate: 72,
  },
  {
    ticker: 'ADBE',
    name: 'Adobe Inc.',
    sector: 'Software',
    earningsDate: '11 June 2026',
    
    momentumScore: 85,
    priceChange6M: 35,
    rsi14: 68,
    
    currentIV: 82,
    historicalIV: 58,
    impliedMove: 6.2,
    expectedIVCrush: 38,
    ivCrushPotential: 'HIGH',
    
    callPremiumBuy: 2.40,
    callPremiumSell: 5.80,
    callGainFromIV: 142,
    
    putPremiumBuy: 2.20,
    putPremiumSell: 5.50,
    putGainFromIV: 150,
    
    ivCrushScore: 88,
    strategyRating: 'EXCELLENT',
    
    riskLevel: 'MEDIUM',
    earningsMissRisk: 22,
    gapRisk: 26,
    
    recommendedStrategy: 'Short Premium (AI hype = high IV) or Long Straddle if IV Rank < 20',
    targetProfit: 130,
    maxLoss: 24,
    
    lastEarningsMove: 8.2,
    historicalIVCrush: 35,
    beatRate: 88,
  },
  {
    ticker: 'SPY',
    name: 'SPDR S&P 500 ETF',
    sector: 'Macro / FOMC',
    earningsDate: '16-17 June 2026',
    
    momentumScore: 70,
    priceChange6M: 12,
    rsi14: 58,
    
    currentIV: 28,
    historicalIV: 18,
    impliedMove: 2.5,
    expectedIVCrush: 22,
    ivCrushPotential: 'MEDIUM',
    
    callPremiumBuy: 0.80,
    callPremiumSell: 1.80,
    callGainFromIV: 125,
    
    putPremiumBuy: 0.75,
    putPremiumSell: 1.70,
    putGainFromIV: 127,
    
    ivCrushScore: 75,
    strategyRating: 'GOOD',
    
    riskLevel: 'MEDIUM',
    earningsMissRisk: 15,
    gapRisk: 20,
    
    recommendedStrategy: 'Iron Condor / 0DTE Credit Spread (FOMC Dot Plot IV crush)',
    targetProfit: 110,
    maxLoss: 18,
    
    lastEarningsMove: 2.5,
    historicalIVCrush: 20,
    beatRate: 90,
  },
  {
    ticker: 'QQQ',
    name: 'Invesco QQQ Trust',
    sector: 'Macro / FOMC',
    earningsDate: '16-17 June 2026',
    
    momentumScore: 82,
    priceChange6M: 18,
    rsi14: 62,
    
    currentIV: 32,
    historicalIV: 22,
    impliedMove: 3.2,
    expectedIVCrush: 25,
    ivCrushPotential: 'MEDIUM',
    
    callPremiumBuy: 1.00,
    callPremiumSell: 2.40,
    callGainFromIV: 140,
    
    putPremiumBuy: 0.95,
    putPremiumSell: 2.30,
    putGainFromIV: 142,
    
    ivCrushScore: 80,
    strategyRating: 'EXCELLENT',
    
    riskLevel: 'MEDIUM',
    earningsMissRisk: 18,
    gapRisk: 22,
    
    recommendedStrategy: 'Short VIX / QQQ Iron Condor (FOMC day VIX consistently drops)',
    targetProfit: 125,
    maxLoss: 20,
    
    lastEarningsMove: 3.2,
    historicalIVCrush: 22,
    beatRate: 88,
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Semiconductors',
    earningsDate: '8-19 June Momentum',
    
    momentumScore: 98,
    priceChange6M: 185,
    rsi14: 78,
    
    currentIV: 65,
    historicalIV: 48,
    impliedMove: 8.5,
    expectedIVCrush: 30,
    ivCrushPotential: 'HIGH',
    
    callPremiumBuy: 2.80,
    callPremiumSell: 6.50,
    callGainFromIV: 132,
    
    putPremiumBuy: 2.60,
    putPremiumSell: 6.20,
    putGainFromIV: 138,
    
    ivCrushScore: 92,
    strategyRating: 'EXCELLENT',
    
    riskLevel: 'HIGH',
    earningsMissRisk: 25,
    gapRisk: 35,
    
    recommendedStrategy: 'Momentum Long (AI infrastructure leader, 8-19 window trend play)',
    targetProfit: 140,
    maxLoss: 32,
    
    lastEarningsMove: 18.5,
    historicalIVCrush: 45,
    beatRate: 88,
  },
  {
    ticker: 'AVGO',
    name: 'Broadcom Inc.',
    sector: 'Semiconductors',
    earningsDate: '8-19 June Momentum',
    
    momentumScore: 88,
    priceChange6M: 125,
    rsi14: 72,
    
    currentIV: 55,
    historicalIV: 40,
    impliedMove: 6.8,
    expectedIVCrush: 28,
    ivCrushPotential: 'MEDIUM',
    
    callPremiumBuy: 2.20,
    callPremiumSell: 5.20,
    callGainFromIV: 136,
    
    putPremiumBuy: 2.00,
    putPremiumSell: 4.90,
    putGainFromIV: 145,
    
    ivCrushScore: 85,
    strategyRating: 'EXCELLENT',
    
    riskLevel: 'MEDIUM',
    earningsMissRisk: 23,
    gapRisk: 29,
    
    recommendedStrategy: 'Momentum Long (AI chip cycle, strong relative strength vs SPY)',
    targetProfit: 130,
    maxLoss: 26,
    
    lastEarningsMove: 11.8,
    historicalIVCrush: 39,
    beatRate: 83,
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    sector: 'Technology',
    earningsDate: '8-19 June Momentum',
    
    momentumScore: 85,
    priceChange6M: 95,
    rsi14: 70,
    
    currentIV: 42,
    historicalIV: 32,
    impliedMove: 4.5,
    expectedIVCrush: 24,
    ivCrushPotential: 'MEDIUM',
    
    callPremiumBuy: 1.60,
    callPremiumSell: 3.80,
    callGainFromIV: 138,
    
    putPremiumBuy: 1.50,
    putPremiumSell: 3.60,
    putGainFromIV: 140,
    
    ivCrushScore: 78,
    strategyRating: 'GOOD',
    
    riskLevel: 'LOW',
    earningsMissRisk: 18,
    gapRisk: 22,
    
    recommendedStrategy: 'Momentum Long (AWS AI capex $200B guidance tailwind)',
    targetProfit: 115,
    maxLoss: 20,
    
    lastEarningsMove: 8.5,
    historicalIVCrush: 28,
    beatRate: 87,
  },
  {
    ticker: 'DHI',
    name: 'D.R. Horton Inc.',
    sector: 'Homebuilders',
    earningsDate: '8-19 June Momentum',
    
    momentumScore: 72,
    priceChange6M: 28,
    rsi14: 58,
    
    currentIV: 48,
    historicalIV: 38,
    impliedMove: 4.8,
    expectedIVCrush: 22,
    ivCrushPotential: 'LOW',
    
    callPremiumBuy: 1.20,
    callPremiumSell: 2.80,
    callGainFromIV: 133,
    
    putPremiumBuy: 1.10,
    putPremiumSell: 2.60,
    putGainFromIV: 136,
    
    ivCrushScore: 70,
    strategyRating: 'GOOD',
    
    riskLevel: 'MEDIUM',
    earningsMissRisk: 30,
    gapRisk: 32,
    
    recommendedStrategy: 'Momentum Long (Homebuilder correlation with LEN, FOMC rate sensitivity)',
    targetProfit: 100,
    maxLoss: 20,
    
    lastEarningsMove: 5.2,
    historicalIVCrush: 22,
    beatRate: 75,
  },
  {
    ticker: 'TOL',
    name: 'Toll Brothers Inc.',
    sector: 'Homebuilders',
    earningsDate: '8-19 June Momentum',
    
    momentumScore: 70,
    priceChange6M: 25,
    rsi14: 56,
    
    currentIV: 52,
    historicalIV: 40,
    impliedMove: 5.2,
    expectedIVCrush: 24,
    ivCrushPotential: 'LOW',
    
    callPremiumBuy: 1.30,
    callPremiumSell: 3.00,
    callGainFromIV: 131,
    
    putPremiumBuy: 1.20,
    putPremiumSell: 2.80,
    putGainFromIV: 133,
    
    ivCrushScore: 72,
    strategyRating: 'GOOD',
    
    riskLevel: 'MEDIUM',
    earningsMissRisk: 32,
    gapRisk: 34,
    
    recommendedStrategy: 'Momentum Long (Luxury homebuilder, mortgage rate pivot play)',
    targetProfit: 98,
    maxLoss: 21,
    
    lastEarningsMove: 4.8,
    historicalIVCrush: 24,
    beatRate: 72,
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
