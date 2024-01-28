import { generateRandomGenome } from '@/utils/genome'
import { getDistanceToNearestHamster } from '@/utils/hamsters/getDistanceToNearestHamster'
import { type HamsterState } from '@/utils/types/HamsterState'
import { getRandomDirection } from '@/utils/getRandomDirection'

describe('distanceToNearestHamsterWithTwoHamsters', () => {
  it('should find a distance because they should see each other', () => {
    const hamster1: HamsterState = {
      id: 0,
      x: 50,
      y: 50,
      directionX: getRandomDirection(),
      directionY: getRandomDirection(),
      genome: generateRandomGenome(),
      lastRotation: 0,
      currentRotation: 0
    }

    const hamster2: HamsterState = {
      id: 1,
      x: 100,
      y: 50,
      directionX: getRandomDirection(),
      directionY: getRandomDirection(),
      genome: generateRandomGenome(),
      lastRotation: 0,
      currentRotation: 0
    }

    const otherHamsters = [hamster1, hamster2]
    const distance = getDistanceToNearestHamster(hamster1, otherHamsters)

    expect(distance).toStrictEqual({
      North: Infinity,
      East: 50,
      South: Infinity,
      West: Infinity
    })
  })
})
