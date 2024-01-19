import { type HamsterState } from '@/utils/types/HamsterState'

export const pickRandomHamster = (survivedHamsters: HamsterState[]): HamsterState => {
  return survivedHamsters[Math.floor(Math.random() * survivedHamsters.length)]
}
