import { type SpriteGeneratorResponse } from '@/utils/types/SpriteGeneratorResponse'
import { type SpriteState } from '@/utils/types/SpriteState'
import { getRandomSpriteState } from '@/utils/getRandomSpriteState'
import { brainOfGenome } from '@/utils/brainOfGenome'
import { evolutionConfig } from '@/utils/evolutionConfig'
import { randomIntFromInterval } from '@/utils/random'

export const getGeneratedSpriteState = (prev: SpriteState, secondsLeftForCurrentGeneration: number, population: number, generation: number): SpriteGeneratorResponse => {
  const brain = brainOfGenome({
    age: evolutionConfig.secondsPerGeneration - secondsLeftForCurrentGeneration,
    random: randomIntFromInterval(-4, 4),
    currentPositionY: prev.y,
    currentPositionX: prev.x,
    generation,
    sizeOfMapX: evolutionConfig.mapSize.width,
    sizeOfMapY: evolutionConfig.mapSize.height,
    population
  }, prev.genome)

  const newDirectionX = brain.directionX > 0 ? -1 : 1
  const newDirectionY = brain.directionY > 0 ? -1 : 1

  const newX = prev.x + prev.directionX * 2
  const newY = prev.y + prev.directionY * 2

  const updatedDirectionX = (newX === 0) ? -newDirectionX : newDirectionX
  const updatedDirectionY = (newY === 0) ? -newDirectionY : newDirectionY

  if (brain.random > 0.5) {
    return getRandomSpriteState(prev)
  }

  return {
    x: newX,
    y: newY,
    directionX: updatedDirectionX,
    directionY: updatedDirectionY
  }
}
