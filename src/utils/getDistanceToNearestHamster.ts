import { type HamsterState } from '@/utils/types/HamsterState'

export const getDistanceToNearestHamster = (currentHamster: HamsterState, otherHamsters: HamsterState[]): Record<string, number> => {
  const distances: Record<string, number> = {
    North: Number.POSITIVE_INFINITY,
    East: Number.POSITIVE_INFINITY,
    South: Number.POSITIVE_INFINITY,
    West: Number.POSITIVE_INFINITY
  }

  for (const otherHamster of otherHamsters) {
    if (otherHamster !== currentHamster) {
      const deltaX = otherHamster.x - currentHamster.x
      const deltaY = otherHamster.y - currentHamster.y

      // Calculate distance using Pythagorean theorem
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)

      // Check direction and update distance if it's shorter
      if (deltaY > 0 && distance < distances.North) {
        distances.North = distance
      } else if (deltaX > 0 && distance < distances.East) {
        distances.East = distance
      } else if (deltaY < 0 && distance < distances.South) {
        distances.South = distance
      } else if (deltaX < 0 && distance < distances.West) {
        distances.West = distance
      }
    }
  }

  return distances
}
