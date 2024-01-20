// src/utils/evolutionConfig.ts
import { type EvolutionConfig } from '@/utils/types/EvolutionConfig'
import { CHALLENGE_RIGHT_SIDE_SURVIVES } from '@/utils/consts/challenges'

export const config: EvolutionConfig = {
  population: 100,
  mapSize: { width: 800, height: 600 },
  secondsPerGeneration: 5,
  genomeSize: 4,
  mutationRate: 0.01,
  innerNeurons: 1,
  speedInMs: 1000,
  challenge: CHALLENGE_RIGHT_SIDE_SURVIVES,
  movingSpeed: 3
}
