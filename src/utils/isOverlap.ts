import { type HamsterState } from '@/utils/types/HamsterState'
import { hamsterSize } from '@/utils/consts/hamsterSize'
import { config } from '@/utils/config'

export const circleIntersect = (x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): boolean => {
  return Math.hypot(x0 - x1, y0 - y1) <= r0 + r1
}
interface Circle {
  x: number
  y: number
  radius: number
}

const checkCircleOverlap = (blue: Circle, red: Circle): boolean => {
  // Berechne den Abstand zwischen den Mittelpunkten der Kreise
  const centersDistance = Math.sqrt((red.x - blue.x) ** 2 + (red.y - blue.y) ** 2)

  // Überprüfe, ob ein Kreis den anderen enthält
  const blueContainsRed = blue.radius > centersDistance + red.radius
  const redContainsBlue = red.radius > centersDistance + blue.radius

  // Überprüfe, ob die Kreise sich überlappen
  const circlesOverlap = centersDistance <= blue.radius + red.radius

  // Die endgültige Bedingung
  return !blueContainsRed && !redContainsBlue && circlesOverlap
}

export const isOverlap = (x: number, y: number, existingHamsters: HamsterState[], id: number): boolean => {
  const radius = hamsterSize.width / 2

  return existingHamsters.some((otherHamster): boolean => {
    if (otherHamster.id === id) {
      return false
    }

    return checkCircleOverlap(
      { x: x + (hamsterSize.width / 2), y: y + (hamsterSize.height / 2), radius },
      { x: otherHamster.x + (hamsterSize.width / 2), y: otherHamster.y + (hamsterSize.height / 2), radius }
    )
  })
}
