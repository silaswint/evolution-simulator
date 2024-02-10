import { type HamsterState } from '@/utils/types/HamsterState'
import { mutateGenome } from '@/utils/genome'
import { type MapSize } from '@/utils/types/MapSize'
import { findEmptyLocation } from '@/utils/map/findEmptyLocation'
import { calculateRotation } from '@/utils/math/calculateRotation'
import { getRandomDirection } from '@/utils/getRandomDirection'
import { pickRandomHamster } from '@/utils/evolution/pickRandomHamster'

export const generateMutatedHamsters = (survivedHamsters: HamsterState[], population: number, mapSize: MapSize): HamsterState[] => {
  if (survivedHamsters.length === 0) {
    console.error('all hamsters died')
    return []
  }

  // reset the ids for survived generations of the hamsters
  let lastId = 0

  // increment the counter for survived generations of the hamsters
  const hamsters: HamsterState[] = []
  survivedHamsters.forEach(hamster => {
    // Attempts to generate random positions that do not overlap
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

  // sort the best hamsters by the number of survival generations
  const bestHamsters: HamsterState[] = hamsters.slice().sort((a, b) => {
    // Sort by survivedGenerations in descending order
    const generationsComparison = b.survivedGenerations - a.survivedGenerations

    // If survivedGenerations are equal, sort by id in descending order
    if (generationsComparison === 0) {
      return b.id - a.id
    }

    return generationsComparison
  })
    .slice(0, 5)

  for (let id = lastId; id < population; id++) {
    // Attempts to generate random positions that do not overlap
    let emptyLocation
    try {
      emptyLocation = findEmptyLocation(hamsters, id, mapSize)
    } catch (e) {
      continue
    }

    const directionX = getRandomDirection()
    const directionY = getRandomDirection()

    const bestHamster = (bestHamsters[0].survivedGenerations === 0)
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
