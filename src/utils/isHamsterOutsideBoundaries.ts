import { hamsterSize } from '@/utils/consts/hamsterSize'
import { type MapSize } from '@/utils/types/MapSize'

export const isHamsterOutsideBoundaries = (x: number, y: number, mapSize: MapSize): boolean => {
  return x - (hamsterSize.width * 0.5) < 0 || y - (hamsterSize.height * 0.5) < 0 || x + (hamsterSize.width * 0.5) > mapSize.width || y + (hamsterSize.height * 0.5) > mapSize.height
}
