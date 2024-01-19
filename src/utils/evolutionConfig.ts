// src/utils/evolutionConfig.ts
import { type EvolutionConfig } from '@/utils/types/EvolutionConfig'

export const evolutionConfig: EvolutionConfig = {
  population: 100,
  mapSize: { width: 800, height: 600 },
  secondsPerGeneration: 10,
  genomeSize: 64,
  mutationRate: 0.001,
  innerNeurons: 5,
  speedInMs: 1000
}
