/*
 * DESIGN: "Precision Finance" — Report Generator Engine
 * Dynamically generates detailed earnings reports from date range
 */

export interface DynamicStock {
  ticker: string;
  name: string;
  sector: string;
  earningsDate: string;
  earningsTime: 'AMC' | 'BMO' | 'AH' | 'BH';
  
  momentumScore: number;
  priceChange6M: number;
  rsi14: number;
  
  currentIV: number;
  historicalIV: number;
  impliedMove: number;
  expectedIVCrush: number;
  ivCrushPotential: 'HIGH' | 'MEDIUM' | 'LOW';
  
  callPremiumBuy: number;
  callPremiumSell: number;
  callGainFromIV: number;
  
  putPremiumBuy: number;
  putPremiumSell: number;
  putGainFromIV: number;
  
  ivCrushScore: number;
  strategyRating: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  earningsMissRisk: number;
  gapRisk: number;
  
  recommendedStrategy: string;
  targetProfit: number;
  maxLoss: number;
  
  lastEarningsMove: number;
  historicalIVCrush: number;
  beatRate: number;
}

export interface DynamicReport {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  stocks: DynamicStock[];
  createdAt: string;
  summary: {
    totalStocks: number;
    excellentCount: number;
    avgIVCrush: number;
    avgTargetProfit: number;
    topStock: DynamicStock | null;
  };
}

// Mock earnings calendar data - in production, this would come from an API
const earningsCalendarMock: Record<string, { ticker: string; name: string; sector: string; earningsTime: 'AMC' | 'BMO' | 'AH' | 'BH' }[]> = {
  '2026-05-27': [
    { ticker: 'MRVL', name: 'Marvell Technology', sector: 'Semiconductors', earningsTime: 'AH' },
    { ticker: 'COST', name: 'Costco Wholesale', sector: 'Retail', earningsTime: 'AH' },
  ],
  '2026-05-28': [
    { ticker: 'CRWD', name: 'CrowdStrike Holdings', sector: 'Cybersecurity', earningsTime: 'AH' },
    { ticker: 'DELL', name: 'Dell Technologies', sector: 'Technology', earningsTime: 'AH' },
  ],
  '2026-05-29': [
    { ticker: 'AVGO', name: 'Broadcom Inc.', sector: 'Semiconductors', earningsTime: 'AH' },
  ],
  '2026-05-30': [
    { ticker: 'PANW', name: 'Palo Alto Networks', sector: 'Cybersecurity', earningsTime: 'AH' },
  ],
  '2026-06-01': [
    { ticker: 'ADSK', name: 'Autodesk Inc.', sector: 'Software', earningsTime: 'AH' },
  ],
  '2026-06-02': [
    { ticker: 'SNOW', name: 'Snowflake Inc.', sector: 'Software', earningsTime: 'AH' },
  ],
  '2026-06-03': [
    { ticker: 'LRCX', name: 'Lam Research Corporation', sector: 'Semiconductors', earningsTime: 'AH' },
    { ticker: 'CRM', name: 'Salesforce Inc.', sector: 'Software', earningsTime: 'AH' },
  ],
  '2026-06-04': [
    { ticker: 'ASML', name: 'ASML Holding N.V.', sector: 'Semiconductors', earningsTime: 'BMO' },
    { ticker: 'NVDA', name: 'NVIDIA Corporation', sector: 'Semiconductors', earningsTime: 'AH' },
  ],
  '2026-06-05': [
    { ticker: 'MCHP', name: 'Microchip Technology Inc.', sector: 'Semiconductors', earningsTime: 'AH' },
    { ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'Semiconductors', earningsTime: 'AH' },
  ],
  '2026-06-06': [
    { ticker: 'NXPI', name: 'NXP Semiconductors N.V.', sector: 'Semiconductors', earningsTime: 'BMO' },
    { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive', earningsTime: 'AH' },
  ],
  '2026-06-07': [
    { ticker: 'AMAT', name: 'Applied Materials Inc.', sector: 'Semiconductors', earningsTime: 'AH' },
    { ticker: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', earningsTime: 'AH' },
  ],
  '2026-06-08': [
    { ticker: 'SNPS', name: 'Synopsys Inc.', sector: 'Software', earningsTime: 'AH' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', earningsTime: 'AH' },
  ],
  '2026-06-09': [
    { ticker: 'CDNS', name: 'Cadence Design Systems Inc.', sector: 'Software', earningsTime: 'BMO' },
    { ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'Software', earningsTime: 'AH' },
  ],
  '2026-06-10': [
    { ticker: 'ACLS', name: 'Axcelis Technologies Inc.', sector: 'Semiconductors', earningsTime: 'BMO' },
    { ticker: 'ORCL', name: 'Oracle Corporation', sector: 'Software', earningsTime: 'AH' },
  ],
  '2026-06-11': [
    { ticker: 'AVGO', name: 'Broadcom Inc.', sector: 'Semiconductors', earningsTime: 'AH' },
    { ticker: 'INTC', name: 'Intel Corporation', sector: 'Semiconductors', earningsTime: 'AH' },
  ],
  '2026-06-12': [
    { ticker: 'SLAB', name: 'Silicon Laboratories Inc.', sector: 'Semiconductors', earningsTime: 'BMO' },
    { ticker: 'IBM', name: 'IBM Corporation', sector: 'Technology', earningsTime: 'AH' },
  ],
  '2026-06-15': [
    { ticker: 'ZS', name: 'Zscaler Inc.', sector: 'Cybersecurity', earningsTime: 'AH' },
  ],
  '2026-06-16': [
    { ticker: 'QCOM', name: 'Qualcomm Inc.', sector: 'Semiconductors', earningsTime: 'AH' },
  ],
};

// Generate random but realistic stock data
function generateStockData(
  ticker: string,
  name: string,
  sector: string,
  earningsDate: string,
  earningsTime: 'AMC' | 'BMO' | 'AH' | 'BH'
): DynamicStock {
  const baseScore = Math.floor(Math.random() * 40) + 60; // 60-100
  const ivCrush = Math.floor(Math.random() * 20) + 25; // 25-45%
  const callGain = Math.floor(Math.random() * 50) + 120; // 120-170%
  const targetProfit = Math.floor(Math.random() * 50) + 100; // 100-150%
  const beatRate = Math.floor(Math.random() * 20) + 75; // 75-95%

  const rating =
    baseScore >= 85 ? 'EXCELLENT' : baseScore >= 75 ? 'GOOD' : baseScore >= 65 ? 'FAIR' : 'POOR';

  return {
    ticker,
    name,
    sector,
    earningsDate,
    earningsTime,
    momentumScore: baseScore,
    priceChange6M: Math.floor(Math.random() * 80) + 60,
    rsi14: Math.floor(Math.random() * 20) + 65,
    currentIV: Math.floor(Math.random() * 30) + 70,
    historicalIV: Math.floor(Math.random() * 20) + 50,
    impliedMove: Math.random() * 5 + 8,
    expectedIVCrush: ivCrush,
    ivCrushPotential: ivCrush > 35 ? 'HIGH' : ivCrush > 28 ? 'MEDIUM' : 'LOW',
    callPremiumBuy: Math.random() * 1.5 + 1.5,
    callPremiumSell: Math.random() * 2 + 4.5,
    callGainFromIV: callGain,
    putPremiumBuy: Math.random() * 1.5 + 1.5,
    putPremiumSell: Math.random() * 2 + 4.5,
    putGainFromIV: callGain + Math.floor(Math.random() * 10),
    ivCrushScore: baseScore,
    strategyRating: rating,
    riskLevel: rating === 'EXCELLENT' ? 'HIGH' : rating === 'GOOD' ? 'MEDIUM' : 'LOW',
    earningsMissRisk: Math.floor(Math.random() * 30) + 15,
    gapRisk: Math.floor(Math.random() * 30) + 20,
    recommendedStrategy:
      rating === 'EXCELLENT'
        ? 'Bull Call Spread (High momentum, strong IV crush)'
        : rating === 'GOOD'
          ? 'Long Call (Good momentum, moderate IV crush)'
          : 'Iron Condor (Moderate opportunity)',
    targetProfit,
    maxLoss: Math.floor(targetProfit / 5),
    lastEarningsMove: Math.random() * 10 + 8,
    historicalIVCrush: ivCrush - Math.floor(Math.random() * 5),
    beatRate,
  };
}

// Generate report from date range
export function generateReportFromDateRange(
  startDate: string,
  endDate: string,
  reportName: string
): DynamicReport {
  const stocks: DynamicStock[] = [];

  // Parse dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Iterate through date range and collect earnings
  for (const [dateStr, earningsData] of Object.entries(earningsCalendarMock)) {
    const date = new Date(dateStr + 'T00:00:00Z');
    const startUTC = new Date(startDate + 'T00:00:00Z');
    const endUTC = new Date(endDate + 'T23:59:59Z');
    if (date >= startUTC && date <= endUTC) {
      earningsData.forEach(earning => {
        const stock = generateStockData(
          earning.ticker,
          earning.name,
          earning.sector,
          dateStr,
          earning.earningsTime
        );
        stocks.push(stock);
      });
    }
  }

  // Calculate summary
  const excellentCount = stocks.filter(s => s.strategyRating === 'EXCELLENT').length;
  const avgIVCrush =
    stocks.length > 0
      ? Math.round(stocks.reduce((a, s) => a + s.expectedIVCrush, 0) / stocks.length)
      : 0;
  const avgTargetProfit =
    stocks.length > 0
      ? Math.round(stocks.reduce((a, s) => a + s.targetProfit, 0) / stocks.length)
      : 0;
  const topStock =
    stocks.length > 0
      ? stocks.reduce((prev, current) =>
          current.ivCrushScore > prev.ivCrushScore ? current : prev
        )
      : null;

  return {
    id: `report_${Date.now()}`,
    name: reportName,
    startDate,
    endDate,
    stocks: stocks.sort((a, b) => b.ivCrushScore - a.ivCrushScore),
    createdAt: new Date().toISOString(),
    summary: {
      totalStocks: stocks.length,
      excellentCount,
      avgIVCrush,
      avgTargetProfit,
      topStock,
    },
  };
}

export const reportStrategyConfig = {
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
