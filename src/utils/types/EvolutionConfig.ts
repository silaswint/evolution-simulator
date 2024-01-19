import { type MapSize } from '@/utils/types/MapSIze'

export interface EvolutionConfig {
  population: number // Number of hamsters in the population
  mapSize: MapSize // Size of the map in pixels
  secondsPerGeneration: number // Steps per generation
  genomeSize: number // Size of the genome per hamster
  mutationRate: number // Mutation rate (example: 0.001 means 0.1% probability of a mutation per gene)
  innerNeurons: number // Number of inner neurons in the genome
  speedInMs: number
}
