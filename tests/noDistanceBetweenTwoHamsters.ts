import { generateRandomGenome } from '@/utils/genome'
import { getDistanceToNearestHamster } from '@/utils/hamsters/getDistanceToNearestHamster'
import { type HamsterState } from '@/utils/types/HamsterState'
import { getRandomDirection } from '@/utils/getRandomDirection'
import { hamsterSize } from '@/utils/consts/hamsterSize'

describe('noDistanceBetweenTwoHamsters', () => {
  it('should find a distance because they should see each other even if they are not exactly in the same row', () => {
    const hamster1: HamsterState = {
      id: 0,
      x: 50,
      y: 50,
      directionX: getRandomDirection(),
      directionY: getRandomDirection(),
      genome: generateRandomGenome(),
      lastRotation: 0,
      currentRotation: 0,
      survivedGenerations: 0
    }

    const hamster2: HamsterState = {
      id: 1,
      x: 50,
      y: 50 + (hamsterSize.height * 0.5),
      directionX: getRandomDirection(),
      directionY: getRandomDirection(),
      genome: generateRandomGenome(),
      lastRotation: 0,
      currentRotation: 0,
      survivedGenerations: 0
    }

    const otherHamsters = [hamster1, hamster2]
    const distance = getDistanceToNearestHamster(hamster1, otherHamsters)

    expect(distance).toStrictEqual({
      North: 12.5,
      East: Infinity,
      South: Infinity,
      West: Infinity
    })
  })
})
