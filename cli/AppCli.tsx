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
  challenge: number
}

const AppCli = ({ saveThresholdGenerations = 0, challenge = config.challenge }: AppCliProps): ReactElement<any, any> => {
  const [ticker, setTicker] = useState<Ticker>(useTicker(config.maxFPS))
  const [generation, setGeneration] = useState<number>(0)
  const [population] = useState<number>(config.population)
  const [secondsPerGeneration] = useState<number>(config.secondsPerGeneration)
  const [secondsLeftForCurrentGeneration, setSecondsLeftForCurrentGeneration] = useState<number>(secondsPerGeneration)
  const [pause, setPause] = useState<boolean>(false)
  const [survivingPopulation, setSurvivingPopulation] = useState<number>(config.population)
  const [mapSizeIsLoaded, setMapSizeIsLoaded] = useState<boolean>(true)
  const [mapSize, setMapSize] = useState<MapSize>({
    width: config.mapSize.width,
    height: config.mapSize.height
  })
  const populationRef = useRef(population)
  const [hamsters, setHamsters] = useState<HamsterState[]>([])
  const [bestHamsterGenerationAtAll, setBestHamsterGenerationAtAll] = useState<number>(0)

  useEffect(() => {
    if (mapSizeIsLoaded) {
      setHamsters(generateRandomHamsters(populationRef, mapSize))
    }
  }, [mapSizeIsLoaded])

  useEffect(() => {
    if (ticker.stepsPerTicker.current < ((Math.max(config.mapSize.width, config.mapSize.height) / config.movingSpeed) / config.secondsPerGeneration) || pause) {
      return
    }

    setSecondsLeftForCurrentGeneration((prevSeconds) => Math.max(0, prevSeconds - 1))
    ticker.stepsPerTicker.current = 0
  }, [ticker.stepsPerTicker.current])

  const resetGenerationCountdown = (): void => {
    setSecondsLeftForCurrentGeneration(config.secondsPerGeneration)
  }

  const bestHamster = getBestHamster(hamsters)

  if (bestHamster) {
    const isNewHamsterGenerationAtAll = saveThresholdGenerations === 0 && bestHamster.survivedGenerations > bestHamsterGenerationAtAll
    const isUsingThreshold = saveThresholdGenerations !== 0 && bestHamster.survivedGenerations >= saveThresholdGenerations

    if (isUsingThreshold || isNewHamsterGenerationAtAll) {
      if (isNewHamsterGenerationAtAll) {
        setBestHamsterGenerationAtAll(bestHamster.survivedGenerations)
      }

      const data = {
        config: {
          genomeSize: config.genomeSize,
          innerNeurons: config.innerNeurons,
          survivedGenerations: bestHamster.survivedGenerations
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
              bestHamsterGenerationAtAll={bestHamsterGenerationAtAll}
          />
      )}
    </>
  }

  return <></>
}

export default AppCli
