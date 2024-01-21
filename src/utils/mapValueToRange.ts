export const mapValueToRange = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number => {
  // Linear transformation
  const m = (toMax - toMin) / (fromMax - fromMin)
  const b = toMin - m * fromMin

  // Apply the transformation
  const result = m * value + b

  // Make sure that the result is within the target range
  return Math.max(Math.min(result, toMax), toMin)
}
