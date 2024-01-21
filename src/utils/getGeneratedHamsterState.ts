import { type HamsterGeneratorResponse } from '@/utils/types/HamsterGeneratorResponse'
import { type HamsterState } from '@/utils/types/HamsterState'
import { getRandomHamsterState } from '@/utils/getRandomHamsterState'
import { brain } from '@/utils/brain'
import { config } from '@/utils/config'
import { randomNumberBetween } from '@/utils/math/randomNumberBetween'

export const getGeneratedHamsterState = (prev: HamsterState, secondsLeftForCurrentGeneration: number, population: number, generation: number): HamsterGeneratorResponse => {
  const brainResponse = brain({
    age: config.secondsPerGeneration - secondsLeftForCurrentGeneration,
    random: randomNumberBetween(-4, 4),
    currentPositionY: prev.y,
    currentPositionX: prev.x,
    generation,
    sizeOfMapX: config.mapSize.width,
    sizeOfMapY: config.mapSize.height,
    population
  }, prev.genome)

  const newDirectionX = Math.sign(brainResponse.directionX)
  const newDirectionY = Math.sign(brainResponse.directionY)

  const newX = prev.x + prev.directionX * config.movingSpeed
  const newY = prev.y + prev.directionY * config.movingSpeed

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
