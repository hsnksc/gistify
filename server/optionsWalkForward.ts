export interface WalkForwardSample {
  date: string;
  candidateReturns: Record<string, number>;
}

export interface WalkForwardFold {
  trainFrom: string;
  trainTo: string;
  testFrom: string;
  testTo: string;
  selectedCandidate: string;
  trainScore: number;
  testReturn: number;
  testSharpe: number;
  maxDrawdown: number;
  hitRate: number;
}

export interface WalkForwardResult {
  folds: WalkForwardFold[];
  compoundedReturn: number;
  outOfSampleSharpe: number;
  maxDrawdown: number;
  hitRate: number;
  selectionStability: number;
  passed: boolean;
  warnings: string[];
}

const round = (value: number, digits = 4) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};
const mean = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
const standardDeviation = (values: number[]) => {
  if (values.length < 2) return 0;
  const average = mean(values);
  return Math.sqrt(values.reduce((sum, value) => sum + (value - average) ** 2, 0) / (values.length - 1));
};

function metrics(returns: number[]) {
  let equity = 1;
  let peak = 1;
  let maxDrawdown = 0;
  for (const value of returns) {
    equity *= 1 + value;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.max(maxDrawdown, 1 - equity / peak);
  }
  const deviation = standardDeviation(returns);
  return {
    totalReturn: equity - 1,
    sharpe: deviation ? mean(returns) / deviation * Math.sqrt(Math.min(252, Math.max(returns.length, 12))) : 0,
    maxDrawdown,
    hitRate: returns.length ? returns.filter(value => value > 0).length / returns.length : 0,
  };
}

export function walkForwardValidate(
  samples: WalkForwardSample[],
  options: { trainSize?: number; testSize?: number; minimumFolds?: number } = {}
): WalkForwardResult {
  const sorted = [...samples].sort((left, right) => left.date.localeCompare(right.date));
  const trainSize = Math.max(20, options.trainSize || 60);
  const testSize = Math.max(5, options.testSize || 20);
  const candidateNames = [...new Set(sorted.flatMap(sample => Object.keys(sample.candidateReturns)))];
  const folds: WalkForwardFold[] = [];
  const allOutOfSample: number[] = [];
  for (let start = 0; start + trainSize + testSize <= sorted.length; start += testSize) {
    const train = sorted.slice(start, start + trainSize);
    const test = sorted.slice(start + trainSize, start + trainSize + testSize);
    const ranking = candidateNames.map(candidate => {
      const returns = train.map(sample => sample.candidateReturns[candidate]).filter(Number.isFinite);
      const result = metrics(returns);
      const stabilityPenalty = result.maxDrawdown * 2 + Math.max(0, 0.45 - result.hitRate);
      return { candidate, score: result.sharpe - stabilityPenalty };
    }).sort((left, right) => right.score - left.score);
    const selected = ranking[0];
    if (!selected) continue;
    const testReturns = test.map(sample => sample.candidateReturns[selected.candidate]).filter(Number.isFinite);
    const result = metrics(testReturns);
    allOutOfSample.push(...testReturns);
    folds.push({
      trainFrom: train[0].date,
      trainTo: train.at(-1)!.date,
      testFrom: test[0].date,
      testTo: test.at(-1)!.date,
      selectedCandidate: selected.candidate,
      trainScore: round(selected.score),
      testReturn: round(result.totalReturn),
      testSharpe: round(result.sharpe),
      maxDrawdown: round(result.maxDrawdown),
      hitRate: round(result.hitRate),
    });
  }
  const combined = metrics(allOutOfSample);
  const selectionCounts = new Map<string, number>();
  for (const fold of folds) selectionCounts.set(fold.selectedCandidate, (selectionCounts.get(fold.selectedCandidate) || 0) + 1);
  const selectionStability = folds.length ? Math.max(...selectionCounts.values()) / folds.length : 0;
  const warnings: string[] = [];
  const minimumFolds = options.minimumFolds || 3;
  if (folds.length < minimumFolds) warnings.push("INSUFFICIENT_OUT_OF_SAMPLE_FOLDS");
  if (combined.sharpe < 0.5) warnings.push("LOW_OUT_OF_SAMPLE_SHARPE");
  if (combined.maxDrawdown > 0.2) warnings.push("EXCESSIVE_DRAWDOWN");
  if (selectionStability < 0.4) warnings.push("UNSTABLE_PARAMETER_SELECTION");
  return {
    folds,
    compoundedReturn: round(combined.totalReturn),
    outOfSampleSharpe: round(combined.sharpe),
    maxDrawdown: round(combined.maxDrawdown),
    hitRate: round(combined.hitRate),
    selectionStability: round(selectionStability),
    passed: warnings.length === 0,
    warnings,
  };
}
