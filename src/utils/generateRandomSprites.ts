import { type SpriteState } from '@/utils/types/SpriteState'
import { randomIntFromInterval } from '@/utils/math/randomIntFromInterval'
import { generateRandomGenome } from '@/utils/genome'
import { type SpriteSize } from '@/utils/types/SpriteSize'
import { type MapSize } from '@/utils/types/MapSIze'

export const generateRandomSprites = (population: number, spriteSize: SpriteSize, mapSize: MapSize): SpriteState[] => {
  const initialSprites: SpriteState[] = []
  for (let i = 0; i < population; i++) {
    initialSprites.push({
      id: i + 1,
      x: randomIntFromInterval(spriteSize.width + 1, mapSize.width - spriteSize.width - 1),
      y: randomIntFromInterval(spriteSize.height + 1, mapSize.height - spriteSize.height - 1),
      directionX: Math.random() > 0.5 ? 1 : -1,
      directionY: Math.random() > 0.5 ? 1 : -1,
      genome: generateRandomGenome()
    })
  }
  return initialSprites
}
