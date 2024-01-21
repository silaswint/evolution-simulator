import { getGeneratedHamsterState } from '@/utils/getGeneratedHamsterState'
import { hamsterSize } from '@/utils/consts/hamsterSize'
import { isOverlap } from '@/utils/isOverlap'
import { dontMove } from '@/components/Hamsters'
import { type HamsterState } from '@/utils/types/HamsterState'
import { type MapSize } from '@/utils/types/MapSIze'
import {calculateRotation} from "@/utils/calculateRotation";

export const move = (prev: HamsterState, prevHamsters: HamsterState[], secondsLeftForCurrentGeneration: number, population: number, generation: number, mapSize: MapSize): HamsterState => {
  const { id, genome } = prev
  const { x, y, directionX, directionY } = getGeneratedHamsterState(prev, secondsLeftForCurrentGeneration, population, generation)

  // This condition checks whether the hamster is within the limits
  if (x < 0 || y < 0 || (x + hamsterSize.width) > mapSize.width || (y + hamsterSize.height) > mapSize.height) {
    return dontMove(prev, id, genome)
  }

  // This conditions checks whether the location is empty
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
