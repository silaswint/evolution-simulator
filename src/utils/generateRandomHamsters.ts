import { type HamsterState } from '@/utils/types/HamsterState'
import { randomNumberBetween } from '@/utils/math/randomNumberBetween'
import { generateRandomGenome } from '@/utils/genome'
import { hamsterSize } from '@/utils/consts/hamsterSize'
import { config } from '@/utils/config'

export const generateRandomHamsters = (population: number): HamsterState[] => {
  const hamsters: HamsterState[] = []
  const mapSize = config.mapSize

  for (let i = 0; i < population; i++) {
    hamsters.push({
      id: i + 1,
      x: randomNumberBetween(hamsterSize.width + 1, mapSize.width - hamsterSize.width - 1),
      y: randomNumberBetween(hamsterSize.height + 1, mapSize.height - hamsterSize.height - 1),
      directionX: Math.random() > 0.5 ? 1 : -1,
      directionY: Math.random() > 0.5 ? 1 : -1,
      genome: generateRandomGenome()
    })
  }
  return hamsters
}
