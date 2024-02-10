import { type HamsterState } from '@/utils/types/HamsterState'

export const getBestHamster = (hamsters: HamsterState[]): HamsterState => hamsters
  .sort((a, b) => b.survivedGenerations - a.survivedGenerations || b.id - a.id)[0]
