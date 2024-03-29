import { generateRandomGenome } from '@/utils/genome'
import { getDistanceToNearestHamster } from '@/utils/hamsters/getDistanceToNearestHamster'
import { type HamsterState } from '@/utils/types/HamsterState'
import { getFormattedDecimalGenome } from '@/utils/getFormattedDecimalGenome'

describe('distanceToNearestHamster', () => {
  it('should find no distance because there is just one hamster and it cant have a distance to itself', () => {
    const randomGenomeForHamster1 = generateRandomGenome()
    const hamster1: HamsterState = {
      id: 0,
      x: 50,
      y: 50,
      directionX: 1,
      directionY: 1,
      genome: randomGenomeForHamster1,
      decimalGenome: getFormattedDecimalGenome(randomGenomeForHamster1),
      lastRotation: 0,
      currentRotation: 0,
      survivedGenerations: 0
    }

    const otherHamsters = [hamster1]
    const distance = getDistanceToNearestHamster(hamster1, otherHamsters)

    expect(distance).toStrictEqual({
      North: Infinity,
      East: Infinity,
      South: Infinity,
      West: Infinity
    })
  })
})
