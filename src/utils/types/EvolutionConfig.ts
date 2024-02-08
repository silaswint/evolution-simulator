import { type MapSize } from '@/utils/types/MapSize'
import {
  type CHALLENGE_INNER_CIRCLE_SURVIVES,
  type CHALLENGE_NONE,
  type CHALLENGE_RIGHT_SIDE_20_SURVIVES,
  type CHALLENGE_RIGHT_SIDE_SURVIVES
} from '@/utils/consts/challenges'

export interface EvolutionConfig {
  population: number // Number of hamsters in the population
  mapSize: MapSize // Size of the map in pixels
  secondsPerGeneration: number // Steps per generation
  genomeSize: number // Size of the genome per hamster
  mutationRate: number // Mutation rate (example: 0.001 means 0.1% probability of a mutation per gene)
  innerNeurons: number[] // Number of inner neurons in the genome per layer
  challenge: typeof CHALLENGE_NONE | typeof CHALLENGE_RIGHT_SIDE_SURVIVES | typeof CHALLENGE_RIGHT_SIDE_20_SURVIVES | typeof CHALLENGE_INNER_CIRCLE_SURVIVES
  movingSpeed: number
  maxFPS: number
}
