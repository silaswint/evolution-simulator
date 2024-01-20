import { randomNumberBetween } from '@/utils/math/randomNumberBetween'
import { hamsterSize } from '@/utils/consts/hamsterSize'
import { isOverlap } from '@/utils/isOverlap'
import { config } from '@/utils/config'
import { type HamsterState } from '@/utils/types/HamsterState'

interface EmptyLocation {
  x: number
  y: number
}

export const findEmptyLocation = (hamsters: HamsterState[], id: number): EmptyLocation => {
  let x, y
  const mapSize = config.mapSize

  let attemptCount = 0
  do {
    x = randomNumberBetween(0, mapSize.width - hamsterSize.width)
    y = randomNumberBetween(0, mapSize.height - hamsterSize.height)

    // Check for overlap
    if (isOverlap(x, y, hamsters, id)) {
      attemptCount++

      // Check for more than 10 attempts
      if (attemptCount > 500) {
        throw new Error('Overlapping could not be avoided. Program aborted.')
      }
    } else {
      // If there is no overlap, reset the counter variable
      attemptCount = 0
    }
  } while (attemptCount > 0)

  return {
    x,
    y
  }
}
