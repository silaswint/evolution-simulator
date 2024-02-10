import { doCurrentChallenge } from '@/utils/doCurrentChallenge'
import { generateMutatedHamsters } from '@/utils/hamsters/generateMutatedHamsters'
import type React from 'react'
import { type HamsterState } from '@/utils/types/HamsterState'
import { type MapSize } from '@/utils/types/MapSize'

export const prepareNextGeneration = (
  hamsters: HamsterState[],
  population: number,
  setIsProcessingNextGeneration: React.Dispatch<React.SetStateAction<boolean>>,
  setSurvivingPopulation: React.Dispatch<React.SetStateAction<number>>,
  setHamsters: React.Dispatch<React.SetStateAction<HamsterState[]>>,
  resetGenerationCountdown: () => void,
  setGeneration: React.Dispatch<React.SetStateAction<number>>,
  mapSize: MapSize,
  setPause: React.Dispatch<React.SetStateAction<boolean>>,
  challenge: number
): void => {
  try {
    // set processing state
    setIsProcessingNextGeneration(true)

    // process challenge
    const survivedHamsters = doCurrentChallenge(hamsters, mapSize, challenge)

    // update survived hamsters stats
    setSurvivingPopulation(survivedHamsters.length)

    if (survivedHamsters.length === 0) {
      setPause(true)
      return
    }

    // let the survived hamsters mutate
    const mutatedHamsters = generateMutatedHamsters(survivedHamsters, population, mapSize)
    setHamsters(mutatedHamsters)

    // reset the countdown
    resetGenerationCountdown()

    // increment generation
    setGeneration(prevGeneration => prevGeneration + 1)
  } finally {
    // reset processing state
    setIsProcessingNextGeneration(false)
  }
}
