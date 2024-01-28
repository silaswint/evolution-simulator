export const mapValueToRange = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number => {
  // Calculate the slope and y-intercept for linear transformation
  const slope = (toMax - toMin) / (fromMax - fromMin)
  const intercept = toMin - slope * fromMin

  // Apply the linear transformation
  const result = slope * value + intercept

  // Ensure the result is within the target range
  return Math.max(Math.min(result, toMax), toMin)
}
