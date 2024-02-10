/* eslint-disable no-case-declarations */
import { type HamsterState } from '@/utils/types/HamsterState'
import {
  CHALLENGE_INNER_CIRCLE_SURVIVES,
  CHALLENGE_NONE,
  CHALLENGE_RIGHT_SIDE_20_SURVIVES,
  CHALLENGE_RIGHT_SIDE_SURVIVES
} from '@/utils/consts/challenges'
import { type MapSize } from '@/utils/types/MapSize'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const doCurrentChallenge = (prevHamsters: HamsterState[], mapSize: MapSize, challenge: number): HamsterState[] => {
  switch (challenge) {
    case CHALLENGE_NONE:
      return prevHamsters

    // challenge: If secondsLeftForCurrentGeneration is 0, remove only the hamsters on the left side
    case CHALLENGE_RIGHT_SIDE_SURVIVES:
      return prevHamsters.filter(hamster => hamster.x >= 0.5 * mapSize.width)

    // challenge: Only the hamsters on the right 20 percent of the map survive
    case CHALLENGE_RIGHT_SIDE_20_SURVIVES:
      return prevHamsters.filter(hamster => hamster.x >= 0.8 * mapSize.width)

    case CHALLENGE_INNER_CIRCLE_SURVIVES:
      const centerX = 0.5 * mapSize.width
      const centerY = 0.5 * mapSize.height
      const innerCircleRadius = 0.25 * Math.min(mapSize.width, mapSize.height)

      return prevHamsters.filter(hamster => {
        const distance = Math.sqrt((hamster.x - centerX) ** 2 + (hamster.y - centerY) ** 2)
        return distance <= innerCircleRadius
      })
  }
}
