import { type Genome } from '@/utils/types/Genome'

export interface HamsterState {
  id: number
  x: number
  y: number
  directionX: 1 | -1 | 0
  directionY: 1 | -1 | 0
  genome: Genome
  lastRotation: number
  currentRotation: number
}
