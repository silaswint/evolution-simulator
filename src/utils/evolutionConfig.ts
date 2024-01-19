// src/utils/evolutionConfig.ts
import { type EvolutionConfig } from '@/utils/types/EvolutionConfig'

export const evolutionConfig: EvolutionConfig = {
  population: 2,
  mapSize: { width: 800, height: 600 },
  secondsPerGeneration: 10,
  genomeSize: 4,
  mutationRate: 0.001,
  innerNeurons: 3,
  speedInMs: 1000
}
