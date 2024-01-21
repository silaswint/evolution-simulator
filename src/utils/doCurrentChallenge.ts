import { type HamsterState } from '@/utils/types/HamsterState'
import { config } from '@/utils/config'
import {
  CHALLENGE_NONE,
  CHALLENGE_RIGHT_SIDE_20_SURVIVES,
  CHALLENGE_RIGHT_SIDE_SURVIVES
} from '@/utils/consts/challenges'
import { type MapSize } from '@/utils/types/MapSIze'

export const doCurrentChallenge = (prevHamsters: HamsterState[], mapSize: MapSize): HamsterState[] => {
  switch (config.challenge) {
    case CHALLENGE_NONE:
      return prevHamsters

    // challenge: If secondsLeftForCurrentGeneration is 0, remove only the hamsters on the left side
    case CHALLENGE_RIGHT_SIDE_SURVIVES:
      return prevHamsters.filter(hamster => hamster.x > mapSize.width / 2)

    case CHALLENGE_RIGHT_SIDE_20_SURVIVES:
      return prevHamsters.filter(hamster => hamster.x >= 0.8 * mapSize.width)
  }
}
