import { type SpriteState } from '@/utils/types/SpriteState'
import { type MapSize } from '@/utils/types/MapSIze'
import { type SpriteSize } from '@/utils/types/SpriteSize'

export const getRandomSpriteState = (prev: SpriteState, mapSize: MapSize, spriteSize: SpriteSize): SpriteState => {
  const newDirectionX = Math.random() > 0.5 ? 1 : -1
  const newDirectionY = Math.random() > 0.5 ? 1 : -1

  const newX = prev.x + prev.directionX * 2
  const newY = prev.y + prev.directionY * 2

  const updatedX = Math.max(0, Math.min(mapSize.width - spriteSize.width, newX))
  const updatedY = Math.max(0, Math.min(mapSize.height - spriteSize.height, newY))

  const updatedDirectionX = (updatedX === 0 || updatedX === mapSize.width - spriteSize.width) ? -newDirectionX : newDirectionX
  const updatedDirectionY = (updatedY === 0 || updatedY === mapSize.height - spriteSize.height) ? -newDirectionY : newDirectionY

  return {
    id: prev.id,
    x: updatedX,
    y: updatedY,
    directionX: updatedDirectionX,
    directionY: updatedDirectionY,
    genome: prev.genome
  }
}
