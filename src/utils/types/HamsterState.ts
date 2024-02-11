import { type Genome } from '@/utils/types/Genome'
import { type DecimalGenome } from '@/utils/types/DecimalGenome'

export interface HamsterState {
  id: number
  x: number
  y: number
  directionX: 1 | -1 | 0
  directionY: 1 | -1 | 0
  genome: Genome
  decimalGenome: DecimalGenome
  lastRotation: number
  currentRotation: number
  survivedGenerations: number
}
