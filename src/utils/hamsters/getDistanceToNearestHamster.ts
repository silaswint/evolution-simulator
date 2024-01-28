import type { HamsterState } from '@/utils/types/HamsterState'
import { hamsterSize } from '@/utils/consts/hamsterSize'
import { Map } from 'immutable'

export const getDistanceToNearestHamster = (currentHamster: HamsterState, otherHamsters: HamsterState[]): Record<string, number> => {
  const distances: Record<string, number> = {
    North: Infinity,
    East: Infinity,
    South: Infinity,
    West: Infinity
  }

  const halfWidth = hamsterSize.width / 2
  const halfHeight = hamsterSize.height / 2

  for (const otherHamster of otherHamsters) {
    if (!Map(otherHamster).equals(Map(currentHamster))) {
      const deltaX = otherHamster.x - currentHamster.x
      const deltaY = otherHamster.y - currentHamster.y

      // Calculate distance using Pythagorean theorem
      const distance = Math.hypot(deltaX, deltaY)

      // Check direction and update distance if it's shorter
      if (deltaY > 0 && distance < distances.North && deltaY > halfHeight) {
        distances.North = distance
      } else if (deltaX > 0 && distance < distances.East && deltaX > halfWidth) {
        distances.East = distance
      } else if (deltaY < 0 && distance < distances.South && -deltaY > halfHeight) {
        distances.South = distance
      } else if (deltaX < 0 && distance < distances.West && -deltaX > halfWidth) {
        distances.West = distance
      }
    }
  }

  return distances
}
