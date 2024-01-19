import { type Genome } from '@/utils/types/Genome'

export interface HamsterState {
  id: number
  x: number
  y: number
  directionX: number
  directionY: number
  genome: Genome
}
