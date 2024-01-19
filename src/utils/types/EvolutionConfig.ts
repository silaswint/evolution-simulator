import { type MapSize } from '@/utils/types/MapSIze'

export interface EvolutionConfig {
  population: number // Anzahl der Kreaturen in der Population
  mapSize: MapSize // Größe der Karte in Pixeln
  secondsPerGeneration: number // Schritte pro Generation
  genomeSize: number // Größe des Genoms pro Kreatur
  mutationRate: number // Mutationsrate (Beispiel: 0.001 bedeutet 0.1% Wahrscheinlichkeit für eine Mutation pro Gen)
  innerNeurons: number // Anzahl der inneren Neuronen im Genom
  speedInMs: number
}
