import { type HamsterState } from '@/utils/types/HamsterState'
import { randomIntFromInterval } from '@/utils/math/randomIntFromInterval'
import { generateRandomGenome } from '@/utils/genome'
import { type HamsterSize } from '@/utils/types/HamsterSize'
import { type MapSize } from '@/utils/types/MapSIze'

export const generateRandomHamsters = (population: number, hamsterSize: HamsterSize, mapSize: MapSize): HamsterState[] => {
  const hamsters: HamsterState[] = []
  for (let i = 0; i < population; i++) {
    hamsters.push({
      id: i + 1,
      x: randomIntFromInterval(hamsterSize.width + 1, mapSize.width - hamsterSize.width - 1),
      y: randomIntFromInterval(hamsterSize.height + 1, mapSize.height - hamsterSize.height - 1),
      directionX: Math.random() > 0.5 ? 1 : -1,
      directionY: Math.random() > 0.5 ? 1 : -1,
      genome: generateRandomGenome()
    })
  }
  return hamsters
}
