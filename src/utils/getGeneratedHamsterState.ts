import { type HamsterGeneratorResponse } from '@/utils/types/HamsterGeneratorResponse'
import { type HamsterState } from '@/utils/types/HamsterState'
import { getRandomHamsterState } from '@/utils/getRandomHamsterState'
import { brain } from '@/utils/brain'
import { config } from '@/utils/config'
import { randomNumberBetween } from '@/utils/math/randomNumberBetween'
import { mapValueToRange } from '@/utils/mapValueToRange'
import { getDistanceToNearestHamster } from '@/utils/getDistanceToNearestHamster'
import { type SensoryInputs } from '@/utils/types/SensoryInputs'
import { type MapSize } from '@/utils/types/MapSIze'

export const getGeneratedHamsterState = (prev: HamsterState, secondsLeftForCurrentGeneration: number, population: number, generation: number, prevHamsters: HamsterState[], mapSize: MapSize): HamsterGeneratorResponse => {
  const distancesToOtherHamsters = getDistanceToNearestHamster(prev, prevHamsters)

  const sensoryInputs: SensoryInputs = {
    age: config.secondsPerGeneration - secondsLeftForCurrentGeneration,
    random: randomNumberBetween(-4, 4),
    currentPositionY: prev.y,
    currentPositionX: prev.x,
    generation,
    sizeOfMapX: config.mapSize.width,
    sizeOfMapY: config.mapSize.height,
    population,
    distanceOfNextObjectNorth: distancesToOtherHamsters.North,
    distanceOfNextObjectEast: distancesToOtherHamsters.East,
    distanceOfNextObjectSouth: distancesToOtherHamsters.South,
    distanceOfNextObjectWest: distancesToOtherHamsters.West
  }

  const normalizedSensoryInputs: SensoryInputs = {
    age: mapValueToRange(sensoryInputs.age, 0, config.secondsPerGeneration, 0, 1),
    random: mapValueToRange(sensoryInputs.random, -4, 4, 0, 1),
    currentPositionY: mapValueToRange(sensoryInputs.currentPositionY, 0, mapSize.width, 0, 1),
    currentPositionX: mapValueToRange(sensoryInputs.currentPositionX, 0, mapSize.height, 0, 1),
    generation: Math.tanh(sensoryInputs.generation),
    sizeOfMapX: Math.tanh(sensoryInputs.sizeOfMapX),
    sizeOfMapY: Math.tanh(sensoryInputs.sizeOfMapY),
    population: Math.tanh(sensoryInputs.population),
    distanceOfNextObjectNorth: mapValueToRange(sensoryInputs.distanceOfNextObjectNorth, 0, mapSize.height, 0, 1),
    distanceOfNextObjectEast: mapValueToRange(sensoryInputs.distanceOfNextObjectEast, 0, mapSize.width, 0, 1),
    distanceOfNextObjectSouth: mapValueToRange(sensoryInputs.distanceOfNextObjectSouth, 0, mapSize.height, 0, 1),
    distanceOfNextObjectWest: mapValueToRange(sensoryInputs.distanceOfNextObjectWest, 0, mapSize.width, 0, 1)
  }

  console.log('normalizedSensoryInputs', normalizedSensoryInputs)

  const brainResponse = brain(normalizedSensoryInputs, prev.genome)

  const newDirectionX = Math.sign(brainResponse.directionX)
  const newDirectionY = Math.sign(brainResponse.directionY)

  const movingSpeed = mapValueToRange(brainResponse.movingSpeed, -1, 1, 0, config.movingSpeed)
  const newX = prev.x + prev.directionX * movingSpeed
  const newY = prev.y + prev.directionY * movingSpeed

  const updatedDirectionX = ((newX === 0) ? -newDirectionX : newDirectionX) as 1 | -1 | 0
  const updatedDirectionY = ((newY === 0) ? -newDirectionY : newDirectionY) as 1 | -1 | 0

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
