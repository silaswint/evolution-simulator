import React, { type ReactElement, useEffect, useRef, useState } from 'react'
import { config } from '@/utils/config/config'
import { type HamsterState } from '@/utils/types/HamsterState'
import { generateRandomHamsters } from '@/utils/hamsters/generateRandomHamsters'
import { type MapSize } from '@/utils/types/MapSize'
import HamstersCalculation from './components/hamsters-calculation'
import { useTicker } from './utils/useTicker'
import { type Ticker } from './types/Ticker'
import { getBestHamster } from '@/utils/hamsters/getBestHamster'
import { genomeToHex } from '@/utils/genome'
import * as fs from 'fs'

interface AppCliProps {
  saveThresholdGenerations: number
}

const AppCli = ({ saveThresholdGenerations = 50 }: AppCliProps): ReactElement<any, any> => {
  const [ticker, setTicker] = useState<Ticker>(useTicker(config.maxFPS))
  const [generation, setGeneration] = useState<number>(0)
  const [population] = useState<number>(config.population)
  const [secondsPerGeneration] = useState<number>(config.secondsPerGeneration)
  const [secondsLeftForCurrentGeneration, setSecondsLeftForCurrentGeneration] = useState<number>(secondsPerGeneration)
  const [pause, setPause] = useState<boolean>(false)
  const [survivingPopulation, setSurvivingPopulation] = useState<number>(config.population)
  const [challenge, setChallenge] = useState<number>(config.challenge)
  const [mapSizeIsLoaded, setMapSizeIsLoaded] = useState<boolean>(true)
  const [mapSize, setMapSize] = useState<MapSize>({
    width: config.mapSize.width,
    height: config.mapSize.height
  })
  const populationRef = useRef(population)
  const [hamsters, setHamsters] = useState<HamsterState[]>([])

  useEffect(() => {
    if (mapSizeIsLoaded) {
      setHamsters(generateRandomHamsters(populationRef, mapSize))
    }
  }, [mapSizeIsLoaded])

  useEffect(() => {
    if (pause) {
      // Reset timer and return if paused
      return
    }

    const timerInterval = setInterval(() => {
      setSecondsLeftForCurrentGeneration((prevSeconds) => Math.max(0, prevSeconds - 1))
    }, 1000)

    // Cleanup function to cancel the interval when removing the component or when paused
    return () => {
      clearInterval(timerInterval)
    }
  }, [pause, secondsPerGeneration])

  const resetGenerationCountdown = (): void => {
    setSecondsLeftForCurrentGeneration(config.secondsPerGeneration)
  }

  const bestHamster = getBestHamster(hamsters)

  if (bestHamster?.survivedGenerations >= saveThresholdGenerations) {
    const data = {
      config: {
        genomeSize: config.genomeSize,
        innerNeurons: config.innerNeurons
      },
      hamsters: [genomeToHex(bestHamster.genome)]
    }
    const asJson = JSON.stringify(data)

    fs.writeFileSync('generation.json', asJson)
  }

  return <>
      {hamsters.length > 0 && (
          <HamstersCalculation
              ticker={ticker}
              population={population}
              secondsLeftForCurrentGeneration={secondsLeftForCurrentGeneration}
              generation={generation}
              resetGenerationCountdown={resetGenerationCountdown}
              setGeneration={setGeneration}
              setSurvivingPopulation={setSurvivingPopulation}
              hamsters={hamsters}
              setHamsters={setHamsters}
              mapSize={mapSize}
              pause={pause}
              survivingPopulation={survivingPopulation}
              challenge={challenge}
              setPause={setPause}
              bestHamster={bestHamster}
          />
      )}
    </>
}

export default AppCli
