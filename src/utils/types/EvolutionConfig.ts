import { type MapSize } from '@/utils/types/MapSIze'

export interface EvolutionConfig {
  population: number // Anzahl der Kreaturen in der Population
  mapSize: MapSize // Größe der Karte in Pixeln
  secondsPerGeneration: 10 // Schritte pro Generation
  genomeSize: 4 // Größe des Genoms pro Kreatur
  mutationRate: 0.001 // Mutationsrate (Beispiel: 0.001 bedeutet 0.1% Wahrscheinlichkeit für eine Mutation pro Gen)
  innerNeurons: 3 // Anzahl der inneren Neuronen im Genom
  speedInMs: 1000
}
