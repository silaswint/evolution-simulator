export const percentage = (partialValue: number, totalValue: number): number => {
  return Math.ceil((100 * partialValue) / totalValue)
}
