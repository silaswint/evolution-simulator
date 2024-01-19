import { type HamsterGeneratorResponse } from '@/utils/types/HamsterGeneratorResponse'
import { type HamsterState } from '@/utils/types/HamsterState'
import { getRandomHamsterState } from '@/utils/getRandomHamsterState'
import { brain } from '@/utils/brain'
import { config } from '@/utils/config'
import { randomIntFromInterval } from '@/utils/math/randomIntFromInterval'

export const getGeneratedHamsterState = (prev: HamsterState, secondsLeftForCurrentGeneration: number, population: number, generation: number): HamsterGeneratorResponse => {
  const brainResponse = brain({
    age: config.secondsPerGeneration - secondsLeftForCurrentGeneration,
    random: randomIntFromInterval(-4, 4),
    currentPositionY: prev.y,
    currentPositionX: prev.x,
    generation,
    sizeOfMapX: config.mapSize.width,
    sizeOfMapY: config.mapSize.height,
    population
  }, prev.genome)

  const newDirectionX = brainResponse.directionX > 0 ? -1 : 1
  const newDirectionY = brainResponse.directionY > 0 ? -1 : 1

  const newX = prev.x + prev.directionX * 2
  const newY = prev.y + prev.directionY * 2

  const updatedDirectionX = (newX === 0) ? -newDirectionX : newDirectionX
  const updatedDirectionY = (newY === 0) ? -newDirectionY : newDirectionY

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
