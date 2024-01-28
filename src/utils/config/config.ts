import { type EvolutionConfig } from '@/utils/types/EvolutionConfig'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CHALLENGE_NONE, CHALLENGE_RIGHT_SIDE_SURVIVES, CHALLENGE_RIGHT_SIDE_20_SURVIVES } from '@/utils/consts/challenges'

export const config: EvolutionConfig = {
  population: 50,
  mapSize: { width: 800, height: 600 },
  secondsPerGeneration: 5,
  genomeSize: 40,
  mutationRate: 0.001,
  challenge: CHALLENGE_RIGHT_SIDE_SURVIVES,
  movingSpeed: 3
  innerNeurons: [10, 5],
}
