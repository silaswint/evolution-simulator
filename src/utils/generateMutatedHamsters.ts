import { type HamsterState } from '@/utils/types/HamsterState'
import { mutateGenome } from '@/utils/genome'
import { type HamsterSize } from '@/utils/types/HamsterSize'
import { type MapSize } from '@/utils/types/MapSIze'
import { pickRandomHamster } from '@/utils/pickRandomHamster'
import { findEmptyLocation } from '@/utils/findEmptyLocation'

export const generateMutatedHamsters = (survivedHamsters: HamsterState[], population: number, hamsterSize: HamsterSize, mapSize: MapSize): HamsterState[] => {
  const hamsters: HamsterState[] = []
  for (let i = 0; i < population; i++) {
    const randomHamster = pickRandomHamster(survivedHamsters)
    const mutatedGenome = mutateGenome(randomHamster.genome)
    let emptyLocation
    const id = i + 1

    // Attempts to generate random positions that do not overlap
    try {
      emptyLocation = findEmptyLocation(hamsters, id)
    } catch (e) {
      continue
    }

    hamsters.push({
      id,
      x: emptyLocation.x,
      y: emptyLocation.y,
      directionX: Math.random() > 0.5 ? 1 : -1,
      directionY: Math.random() > 0.5 ? 1 : -1,
      genome: mutatedGenome
    })
  }
  return hamsters
}
