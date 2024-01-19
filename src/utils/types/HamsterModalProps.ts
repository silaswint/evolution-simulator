import { type HamsterState } from '@/utils/types/HamsterState'
import type React from 'react'

export interface HamsterModalProps {
  selectedHamster: HamsterState | null
  setSelectedHamster: React.Dispatch<React.SetStateAction<HamsterState | null>>
}
