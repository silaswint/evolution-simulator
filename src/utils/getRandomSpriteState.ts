import { type SpriteGeneratorResponse } from '@/utils/types/SpriteGeneratorResponse'
import { type SpriteState } from '@/utils/types/SpriteState'

export const getRandomSpriteState = (prev: SpriteState): SpriteGeneratorResponse => {
  const newDirectionX = Math.random() > 0.5 ? 1 : -1
  const newDirectionY = Math.random() > 0.5 ? 1 : -1

  const newX = prev.x + prev.directionX * 2
  const newY = prev.y + prev.directionY * 2

  const updatedDirectionX = (newX === 0) ? -newDirectionX : newDirectionX
  const updatedDirectionY = (newY === 0) ? -newDirectionY : newDirectionY

  return {
    x: newX,
    y: newY,
    directionX: updatedDirectionX,
    directionY: updatedDirectionY
  }
}
