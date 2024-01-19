import { randomIntFromInterval } from '@/utils/random'
import { evolutionConfig } from '@/utils/evolutionConfig'
import { type Positions } from '@/utils/types/Positions'

export const getRandomPositions = (prevPosition: Positions, population: number) => {
  const newPosition: Record<number, { x: number, y: number }> = {}
  for (let i = 0; i < population; i++) {
    newPosition[i] = {
      x: randomIntFromInterval(0, evolutionConfig.mapSize.width),
      y: randomIntFromInterval(0, evolutionConfig.mapSize.height)
    }
  }
  return { ...prevPosition, ...newPosition }
}
