import { randomNumberBetween } from '@/utils/math/randomNumberBetween'
import { hamsterSize } from '@/utils/consts/hamsterSize'
import { isOverlap } from '@/utils/map/isOverlap'
import { type HamsterState } from '@/utils/types/HamsterState'
import { type MapSize } from '@/utils/types/MapSIze'

interface EmptyLocation {
  x: number
  y: number
}

export const findEmptyLocation = (hamsters: HamsterState[], id: number, mapSize: MapSize): EmptyLocation => {
  let x, y

  let attemptCount = 0
  do {
    x = randomNumberBetween(0, mapSize.width - hamsterSize.width)
    y = randomNumberBetween(0, mapSize.height - hamsterSize.height)

    // Check for overlap
    if (!isOverlap(x, y, hamsters, id)) {
      return { x, y }
    }

    attemptCount++

    // Check for more than 10 attempts
    if (attemptCount > 500) {
      throw new Error('Overlapping could not be avoided. Program aborted.')
    }
  } while (true)
}
