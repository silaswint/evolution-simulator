import type { HamsterState } from '@/utils/types/HamsterState'
import { hamsterSize } from '@/utils/consts/hamsterSize'

interface Circle {
  x: number
  y: number
  radius: number
}

const checkCircleOverlap = (circle1: Circle, circle2: Circle): boolean => {
  const centersDistance = Math.hypot(circle1.x - circle2.x, circle1.y - circle2.y)
  return centersDistance <= circle1.radius + circle2.radius
}

export const isOverlap = (x: number, y: number, existingHamsters: HamsterState[], id: number): boolean => {
  const radius = hamsterSize.width / 2

  return existingHamsters.some((otherHamster): boolean => {
    if (otherHamster.id === id) {
      return false
    }

    const currentHamsterCircle: Circle = { x: x + radius, y: y + radius, radius }
    const otherHamsterCircle: Circle = { x: otherHamster.x + radius, y: otherHamster.y + radius, radius }

    return checkCircleOverlap(currentHamsterCircle, otherHamsterCircle)
  })
}
