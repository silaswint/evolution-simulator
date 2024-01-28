import type { HamsterState } from '@/utils/types/HamsterState'

export const pickRandomHamster = (survivedHamsters: HamsterState[]): HamsterState => {
  const randomIndex = Math.floor(Math.random() * survivedHamsters.length)
  return survivedHamsters[randomIndex]
}
