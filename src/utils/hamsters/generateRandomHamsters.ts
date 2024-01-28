import { type HamsterState } from '@/utils/types/HamsterState'
import { generateRandomGenome } from '@/utils/genome'
import { findEmptyLocation } from '@/utils/map/findEmptyLocation'
import { type MapSize } from '@/utils/types/MapSIze'
import { calculateRotation } from '@/utils/math/calculateRotation'
import { type MutableRefObject } from 'react'
import { getRandomDirection } from '@/utils/getRandomDirection'

export const generateRandomHamsters = (populationRef: MutableRefObject<number>, mapSize: MapSize): HamsterState[] => {
  const population = populationRef.current

  const hamsters: HamsterState[] = []

  for (let i = 0; i < population; i++) {
    let emptyLocation
    const id = i + 1

    // Attempts to generate random positions that do not overlap
    try {
      emptyLocation = findEmptyLocation(hamsters, id, mapSize)
    } catch (e) {
      continue
    }

    // these are just random starting positions, act like it's "undefined"
    const directionX = getRandomDirection()
    const directionY = getRandomDirection()

    hamsters.push({
      id,
      x: emptyLocation.x,
      y: emptyLocation.y,
      directionX,
      directionY,
      genome: generateRandomGenome(),
      lastRotation: 0,
      currentRotation: calculateRotation(directionX, directionY)
    })
  }

  return hamsters
}
