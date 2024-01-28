import { type EvolutionConfig } from '@/utils/types/EvolutionConfig'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CHALLENGE_NONE, CHALLENGE_RIGHT_SIDE_SURVIVES, CHALLENGE_RIGHT_SIDE_20_SURVIVES } from '@/utils/consts/challenges'

export const config: EvolutionConfig = {
  population: 50,
  mapSize: { width: 800, height: 600 },
  secondsPerGeneration: 3,
  genomeSize: 60,
  mutationRate: 0.01,
  innerNeurons: [6, 5],
  challenge: CHALLENGE_RIGHT_SIDE_20_SURVIVES,
  movingSpeed: 5,
  maxFPS: 30
}
