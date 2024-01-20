// src/utils/evolutionConfig.ts
import { type EvolutionConfig } from '@/utils/types/EvolutionConfig'
import { CHALLENGE_RIGHT_SIDE_SURVIVES } from '@/utils/consts/challenges'

export const config: EvolutionConfig = {
  population: 100,
  mapSize: { width: 800, height: 600 },
  secondsPerGeneration: 10,
  genomeSize: 64,
  mutationRate: 0.001,
  innerNeurons: 5,
  speedInMs: 1000,
  challenge: CHALLENGE_RIGHT_SIDE_SURVIVES
}
