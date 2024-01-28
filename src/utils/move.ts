import { getGeneratedHamsterState } from '@/utils/getGeneratedHamsterState'
import { hamsterSize } from '@/utils/consts/hamsterSize'
import { isOverlap } from '@/utils/map/isOverlap'
import { dontMove } from '@/components/Hamsters'
import type { HamsterState } from '@/utils/types/HamsterState'
import type { MapSize } from '@/utils/types/MapSIze'
import { calculateRotation } from '@/utils/math/calculateRotation'

export const move = (
  prev: HamsterState,
  prevHamsters: HamsterState[],
  secondsLeftForCurrentGeneration: number,
  population: number,
  generation: number,
  mapSize: MapSize
): HamsterState => {
  const { id, genome } = prev
  const { x, y, directionX, directionY } = getGeneratedHamsterState(
    prev,
    secondsLeftForCurrentGeneration,
    population,
    generation,
    prevHamsters
  )

  // Check if the hamster is within the map bounds
  if (x - (hamsterSize.width * 0.5) < 0 || y - (hamsterSize.height * 0.5) < 0 || x + (hamsterSize.width * 0.5) > mapSize.width || y + (hamsterSize.height * 0.5) > mapSize.height) {
    return dontMove(prev, id, genome)
  }

  // Check if the location is empty
  if (isOverlap(x, y, prevHamsters, id)) {
    return dontMove(prev, id, genome)
  }

  return {
    id,
    x,
    y,
    directionX,
    directionY,
    genome,
    lastRotation: prev.currentRotation,
    currentRotation: calculateRotation(directionX, directionY)
  }
}
