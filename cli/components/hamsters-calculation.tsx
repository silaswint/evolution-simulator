import React, { useState, useEffect, useCallback, useRef, type ReactElement } from 'react'
import '@pixi/events'
import { type HamsterState } from '@/utils/types/HamsterState'
import { move } from '@/utils/move'
import { prepareNextGeneration } from '@/utils/evolution/prepareNextGeneration'
import { type MapSize } from '@/utils/types/MapSize'
import { type Ticker } from '@/cli/types/Ticker'
import { Text, useInput, useApp, Newline } from 'ink'
import { percentage } from '@/utils/math/percent'
import { config } from '@/utils/config/config'

interface MapProps {
  ticker: Ticker
  population: number
  secondsLeftForCurrentGeneration: number
  generation: number
  setGeneration: React.Dispatch<React.SetStateAction<number>>
  resetGenerationCountdown: () => void
  setSurvivingPopulation: React.Dispatch<React.SetStateAction<number>>
  hamsters: HamsterState[]
  setHamsters: React.Dispatch<React.SetStateAction<HamsterState[]>>
  mapSize: MapSize
  pause: boolean
  survivingPopulation: number
  setPause: React.Dispatch<React.SetStateAction<boolean>>
  challenge: number
  bestHamsterGenerationAtAll: number
}

const HamstersCalculation = ({ ticker, population, secondsLeftForCurrentGeneration, generation, setGeneration, resetGenerationCountdown, setSurvivingPopulation, hamsters, setHamsters, mapSize, pause, survivingPopulation, setPause, challenge, bestHamsterGenerationAtAll }: MapProps): ReactElement<any, any> => {
  const [isProcessingNextGeneration, setIsProcessingNextGeneration] = useState<boolean>(false)

  const secondsLeftForCurrentGenerationRef = useRef<number>(secondsLeftForCurrentGeneration)
  secondsLeftForCurrentGenerationRef.current = secondsLeftForCurrentGeneration

  const pauseRef = useRef<boolean>(pause)
  pauseRef.current = pause

  const populationRef = useRef<number>(population)
  populationRef.current = population

  const hamstersRef = useRef<HamsterState[]>(hamsters)
  hamstersRef.current = hamsters

  const generationRef = useRef<number>(generation)
  generationRef.current = generation

  const mapSizeRef = useRef<MapSize>(mapSize)
  mapSizeRef.current = mapSize

  const challengeRef = useRef<number>(challenge)
  challengeRef.current = challenge

  const { exit } = useApp()

  useInput((input: string): void => {
    if (input === 'q') {
      exit()
    }

    if (input === 'p') {
      setPause((prevPause) => !prevPause)
    }
  })

  const tick = useCallback((): void => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (secondsLeftForCurrentGenerationRef.current === undefined || pauseRef.current === undefined) {
      return
    }

    const isGenerationRunning = secondsLeftForCurrentGenerationRef.current > 0 && !pauseRef.current
    const shouldPrepareNextGeneration = !isProcessingNextGeneration && secondsLeftForCurrentGenerationRef.current === 0 && hamstersRef.current.length > 0

    if (isGenerationRunning) {
      setHamsters((prevHamsters: HamsterState[]) =>
        prevHamsters.map((prev: HamsterState) => {
          return move(prev, prevHamsters, secondsLeftForCurrentGenerationRef.current, populationRef.current, generationRef.current, mapSizeRef.current)
        })
      )
    } else if (shouldPrepareNextGeneration) {
      prepareNextGeneration(
        hamstersRef.current,
        populationRef.current,
        setIsProcessingNextGeneration,
        setSurvivingPopulation,
        setHamsters,
        resetGenerationCountdown,
        setGeneration,
        mapSizeRef.current,
        setPause,
        challengeRef.current
      )
    }
  }, [])

  // do play
  useEffect(() => {
    if (!pause) {
      ticker.add(tick)
    }
  }, [pause])

  // do pause
  useEffect(() => {
    if (ticker !== null && (pause || survivingPopulation === 0)) {
      ticker.remove(tick)
    }
  }, [pause, survivingPopulation])

  const survivingRate = percentage(survivingPopulation, config.population)

  return <>
    <Text>
      <>
        Gen: {generation} | Seconds left: {secondsLeftForCurrentGeneration} | <Text color={ survivingRate < 80 ? 'red' : 'green' }>Surviving rate: {survivingRate}%</Text>
      </>
    </Text>
    <Text>
      <>
        The best hamster ever survived <Text color={'green'}>{bestHamsterGenerationAtAll} generations</Text>.
      </>
    </Text>
    <Newline />
    <Text>Press “q” to exit or “p“ to pause / continue.</Text>
    { pause && <Text color="red">PAUSE!</Text> }
  </>
}

export default HamstersCalculation
