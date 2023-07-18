export function calculateMean(numbers: number[]): number {
  if (numbers.length === 0) {
    throw new Error('Cannot calculate mean of an empty array');
  }

  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

export function calculateStandardDeviation(numbers: number[]): number {
  if (numbers.length === 0) {
    throw new Error('Cannot calculate standard deviation of an empty array');
  }

  const mean = calculateMean(numbers);
  const squaredDifferences = numbers.map(num => Math.pow(num - mean, 2));
  const sumSquaredDifferences = squaredDifferences.reduce((acc, num) => acc + num, 0);
  const variance = sumSquaredDifferences / numbers.length;
  const standardDeviation = Math.sqrt(variance);
  return standardDeviation;
}