import { type HamsterState } from '@/utils/types/HamsterState'
import { config } from '@/utils/config'
import { CHALLENGE_NONE, CHALLENGE_RIGHT_SIDE_SURVIVES } from '@/utils/consts/challenges'

export const doCurrentChallenge = (prevHamsters: HamsterState[]): HamsterState[] => {
  switch (config.challenge) {
    case CHALLENGE_NONE:
      return prevHamsters

    // challenge: If secondsLeftForCurrentGeneration is 0, remove only the hamsters on the left side
    case CHALLENGE_RIGHT_SIDE_SURVIVES:
      return prevHamsters.filter(hamster => hamster.x > config.mapSize.width / 2)
  }
}
