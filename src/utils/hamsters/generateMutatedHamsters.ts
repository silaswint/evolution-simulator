import { type HamsterState } from '@/utils/types/HamsterState'
import { mutateGenome } from '@/utils/genome'
import { type MapSize } from '@/utils/types/MapSize'
import { findEmptyLocation } from '@/utils/map/findEmptyLocation'
import { calculateRotation } from '@/utils/math/calculateRotation'
import { getRandomDirection } from '@/utils/getRandomDirection'
import { pickRandomHamster } from '@/utils/evolution/pickRandomHamster'

export const generateMutatedHamsters = (
  survivedHamsters: HamsterState[],
  population: number,
  mapSize: MapSize
): HamsterState[] => {
  if (survivedHamsters.length === 0) {
    console.error('all hamsters died')
    return []
  }

  let lastId = 0

  const hamsters: HamsterState[] = []
  survivedHamsters.forEach(hamster => {
    let emptyLocation
    try {
      emptyLocation = findEmptyLocation(hamsters, hamster.id, mapSize)
    } catch (e) {
      console.error('no empty location available', e)
      return hamster
    }

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
  })

  const bestHamsters: HamsterState[] = hamsters
    .slice()
    .sort((a, b) => b.survivedGenerations - a.survivedGenerations || b.id - a.id)
    .slice(0, 5)

  for (let id = lastId; id < population; id++) {
    let emptyLocation
    try {
      emptyLocation = findEmptyLocation(hamsters, id, mapSize)
    } catch (e) {
      continue
    }

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
      lastRotation: 0,
      currentRotation: calculateRotation(directionX, directionY),
      survivedGenerations: 0
    })
  }

  return hamsters
}
