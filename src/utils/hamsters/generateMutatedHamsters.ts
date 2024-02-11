import { type HamsterState } from '@/utils/types/HamsterState'
import { mutateGenome } from '@/utils/genome'
import { type MapSize } from '@/utils/types/MapSize'
import { findEmptyLocation } from '@/utils/map/findEmptyLocation'
import { calculateRotation } from '@/utils/math/calculateRotation'
import { getRandomDirection } from '@/utils/getRandomDirection'
import { pickRandomHamster } from '@/utils/evolution/pickRandomHamster'
import { config } from '@/utils/config/config'
import { getFormattedDecimalGenome } from '@/utils/getFormattedDecimalGenome'

export const generateMutatedHamsters = (
  survivedHamsters: HamsterState[],
  population: number,
  mapSize: MapSize
): HamsterState[] => {
  if (survivedHamsters.length === 0) {
    console.error('All hamsters died')
    return []
  }

  let lastId = 0

  const hamsters: HamsterState[] = []

  // Update hamsters that survived
  survivedHamsters.forEach(hamster => {
    try {
      const emptyLocation = findEmptyLocation(hamsters, hamster.id, mapSize)
      const directionX = getRandomDirection()
      const directionY = getRandomDirection()

      hamsters.push({
        ...hamster,
        survivedGenerations: hamster.survivedGenerations + 1,
        x: emptyLocation.x,
        y: emptyLocation.y,
        directionX,
        directionY,
        lastRotation: 0,
        currentRotation: calculateRotation(directionX, directionY),
        id: lastId++
      })
    } catch (e) {
      console.error('No empty location available', e)
      return hamster
    }
  })

  // Sort and get the best hamsters
  const bestHamsters: HamsterState[] = hamsters
    .sort((a, b) => b.survivedGenerations - a.survivedGenerations || b.id - a.id)
    .slice(0, Math.round(hamsters.length * config.reproductionRate))

  // Generate new hamsters for the population
  for (let id = lastId; id < population; id++) {
    try {
      const emptyLocation = findEmptyLocation(hamsters, id, mapSize)
      const directionX = getRandomDirection()
      const directionY = getRandomDirection()

      const bestHamster =
          bestHamsters[0].survivedGenerations === 0
            ? pickRandomHamster(bestHamsters)
            : bestHamsters[id % bestHamsters.length]

      const mutatedGenome = mutateGenome(bestHamster.genome)

      hamsters.push({
        id,
        x: emptyLocation.x,
        y: emptyLocation.y,
        directionX,
        directionY,
        genome: mutatedGenome,
        decimalGenome: getFormattedDecimalGenome(mutatedGenome),
        lastRotation: 0,
        currentRotation: calculateRotation(directionX, directionY),
        survivedGenerations: 0
      })
    } catch (e) {

    }
  }

  return hamsters
}
