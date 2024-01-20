import { type HamsterState } from '@/utils/types/HamsterState'
import { randomIntFromInterval } from '@/utils/math/randomIntFromInterval'
import { mutateGenome } from '@/utils/genome'
import { type HamsterSize } from '@/utils/types/HamsterSize'
import { type MapSize } from '@/utils/types/MapSIze'
import { pickRandomHamster } from '@/utils/pickRandomHamster'

export const generateMutatedHamsters = (survivedHamsters: HamsterState[], population: number, hamsterSize: HamsterSize, mapSize: MapSize): HamsterState[] => {
  const hamsters: HamsterState[] = []
  for (let i = 0; i < population; i++) {
    const randomHamster = pickRandomHamster(survivedHamsters)
    hamsters.push({
      id: i + 1,
      x: randomIntFromInterval(hamsterSize.width + 1, mapSize.width - hamsterSize.width - 1),
      y: randomIntFromInterval(hamsterSize.height + 1, mapSize.height - hamsterSize.height - 1),
      directionX: Math.random() > 0.5 ? 1 : -1,
      directionY: Math.random() > 0.5 ? 1 : -1,
      genome: mutateGenome(randomHamster.genome)
    })
  }
  return hamsters
}
