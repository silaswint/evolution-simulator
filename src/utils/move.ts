import { getGeneratedHamsterState } from '@/utils/getGeneratedHamsterState'
import { isOverlap } from '@/utils/map/isOverlap'
import { dontMove } from '@/components/Hamsters'
import type { HamsterState } from '@/utils/types/HamsterState'
import type { MapSize } from '@/utils/types/MapSize'
import { calculateRotation } from '@/utils/math/calculateRotation'
import { isHamsterOutsideBoundaries } from '@/utils/isHamsterOutsideBoundaries'

export const move = (
  prev: HamsterState,
  prevHamsters: HamsterState[],
  secondsLeftForCurrentGeneration: number,
  population: number,
  generation: number,
  mapSize: MapSize
): HamsterState => {
  const { x, y, directionX, directionY } = getGeneratedHamsterState(
    prev,
    secondsLeftForCurrentGeneration,
    population,
    generation,
    prevHamsters
  )

  // Check if the hamster is within the map bounds
  if (isHamsterOutsideBoundaries(x, y, mapSize)) {
    return dontMove(prev)
  }

  // Check if the location is empty
  if (isOverlap(x, y, prevHamsters, prev.id)) {
    return dontMove(prev)
  }

  return {
    id: prev.id,
    x,
    y,
    directionX,
    directionY,
    genome: prev.genome,
    decimalGenome: prev.decimalGenome,
    lastRotation: prev.currentRotation,
    currentRotation: calculateRotation(directionX, directionY),
    survivedGenerations: prev.survivedGenerations
  }
}
