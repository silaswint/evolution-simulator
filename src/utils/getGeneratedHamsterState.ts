import type { HamsterGeneratorResponse } from '@/utils/types/HamsterGeneratorResponse'
import type { HamsterState } from '@/utils/types/HamsterState'
import type { SensoryInputs } from '@/utils/types/SensoryInputs'
import { getRandomHamsterState } from '@/utils/getRandomHamsterState'
import { brain } from '@/utils/brain'
import { config } from '@/utils/config/config'
import { randomNumberBetween } from '@/utils/math/randomNumberBetween'
import { mapValueToRange } from '@/utils/mapValueToRange'
import { getDistanceToNearestHamster } from '@/utils/getDistanceToNearestHamster'
import { Map } from 'immutable'

export const getGeneratedHamsterState = (
  prev: HamsterState,
  secondsLeftForCurrentGeneration: number,
  population: number,
  generation: number,
  prevHamsters: HamsterState[]
): HamsterGeneratorResponse => {
  const {
    secondsPerGeneration,
    mapSize: { width, height },
    movingSpeed
  } = config

  const distancesToOtherHamsters = getDistanceToNearestHamster(prev, prevHamsters)

  const sensoryInputs: SensoryInputs = {
    age: secondsPerGeneration - secondsLeftForCurrentGeneration,
    random: randomNumberBetween(-4, 4),
    currentPositionY: prev.y,
    currentPositionX: prev.x,
    generation,
    sizeOfMapX: width,
    sizeOfMapY: height,
    population,
    distanceOfNextObjectNorth: distancesToOtherHamsters.North,
    distanceOfNextObjectEast: distancesToOtherHamsters.East,
    distanceOfNextObjectSouth: distancesToOtherHamsters.South,
    distanceOfNextObjectWest: distancesToOtherHamsters.West
  }

  const normalizedSensoryInputs: SensoryInputs = Map(sensoryInputs).map((value) => Math.tanh(value)).toJS() as unknown as SensoryInputs

  const brainResponse = brain(normalizedSensoryInputs, prev.genome)

  const newDirectionX = Math.sign(brainResponse.directionX)
  const newDirectionY = Math.sign(brainResponse.directionY)

  const movingSpeedValue = mapValueToRange(brainResponse.movingSpeed, -1, 1, 0, movingSpeed)
  const newX = prev.x + prev.directionX * movingSpeedValue
  const newY = prev.y + prev.directionY * movingSpeedValue

  const updatedDirectionX = (newX === 0 ? -newDirectionX : newDirectionX) as 1 | -1 | 0
  const updatedDirectionY = (newY === 0 ? -newDirectionY : newDirectionY) as 1 | -1 | 0

  if (brainResponse.random > 0.5) {
    return getRandomHamsterState(prev)
  }

  return {
    x: newX,
    y: newY,
    directionX: updatedDirectionX,
    directionY: updatedDirectionY
  }
}
