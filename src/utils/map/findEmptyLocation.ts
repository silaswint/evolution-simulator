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
    x = randomNumberBetween(hamsterSize.width * 0.5, mapSize.width - hamsterSize.width * 0.5)
    y = randomNumberBetween(hamsterSize.height * 0.5, mapSize.height - hamsterSize.height * 0.5)

    // Check for overlap
    if (!isOverlap(x, y, hamsters, id)) {
      return { x, y }
    }

    attemptCount++

    if (attemptCount > 500) {
      throw new Error('Overlapping could not be avoided. Program aborted.')
    }
  } while (true)
}
