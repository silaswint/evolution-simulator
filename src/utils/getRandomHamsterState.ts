import { type HamsterGeneratorResponse } from '@/utils/types/HamsterGeneratorResponse'
import { type HamsterState } from '@/utils/types/HamsterState'
import { config } from '@/utils/config'

export const getRandomHamsterState = (prev: HamsterState): HamsterGeneratorResponse => {
  const newDirectionX = Math.random() > 0.5 ? 1 : -1
  const newDirectionY = Math.random() > 0.5 ? 1 : -1

  const newX = prev.x + prev.directionX * config.movingSpeed
  const newY = prev.y + prev.directionY * config.movingSpeed

  const updatedDirectionX = ((newX === 0) ? -newDirectionX : newDirectionX) as 1 | -1 | 0
  const updatedDirectionY = ((newY === 0) ? -newDirectionY : newDirectionY) as 1 | -1 | 0

  return {
    x: newX,
    y: newY,
    directionX: updatedDirectionX,
    directionY: updatedDirectionY
  }
}
