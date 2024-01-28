import { type HamsterState } from '@/utils/types/HamsterState'
import { mutateGenome } from '@/utils/genome'
import { type MapSize } from '@/utils/types/MapSIze'
import { pickRandomHamster } from '@/utils/pickRandomHamster'
import { findEmptyLocation } from '@/utils/findEmptyLocation'
import { calculateRotation } from '@/utils/calculateRotation'
import { getRandomDirection } from '@/utils/getRandomDirection'

export const generateMutatedHamsters = (survivedHamsters: HamsterState[], population: number, mapSize: MapSize): HamsterState[] => {
  if (survivedHamsters.length === 0) {
    console.error('all hamsters died')
    return []
  }

  const hamsters: HamsterState[] = []
  for (let i = 0; i < population; i++) {
    const id = i + 1

    // Attempts to generate random positions that do not overlap
    let emptyLocation
    try {
      emptyLocation = findEmptyLocation(hamsters, id, mapSize)
    } catch (e) {
      continue
    }

    const directionX = getRandomDirection()
    const directionY = getRandomDirection()

    const randomHamster = pickRandomHamster(survivedHamsters)
    const mutatedGenome = mutateGenome(randomHamster.genome)

    hamsters.push({
      id,
      x: emptyLocation.x,
      y: emptyLocation.y,
      directionX,
      directionY,
      genome: mutatedGenome,
      lastRotation: 0,
      currentRotation: calculateRotation(directionX, directionY)
    })
  }
  return hamsters
}
