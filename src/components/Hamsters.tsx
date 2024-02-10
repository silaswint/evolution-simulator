import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Container, Sprite, withFilters, withPixiApp } from '@pixi/react'
import '@pixi/events'
import { type HamsterState } from '@/utils/types/HamsterState'
import { hamsterSize } from '@/utils/consts/hamsterSize'
import { type Genome } from '@/utils/types/Genome'
import { move } from '@/utils/move'
import { prepareNextGeneration } from '@/utils/evolution/prepareNextGeneration'
import { type MapSize } from '@/utils/types/MapSize'
import { type Application as PixiApplication } from '@pixi/app'
import { config } from '@/utils/config/config'
import { ColorMatrixFilter } from '@pixi/filter-color-matrix'
import { getBestHamster } from '@/utils/hamsters/getBestHamster'

const hamsterImage = './assets/hamster.svg'
const bestHamsterImage = './assets/best-hamster.svg'

interface MapProps {
  app: PixiApplication
  population: number
  secondsLeftForCurrentGeneration: number
  generation: number
  setSelectedHamster: React.Dispatch<React.SetStateAction<HamsterState | null>>
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
}

export const dontMove = (prev: HamsterState, id: number, genome: Genome): HamsterState => {
  return {
    id,
    x: prev.x,
    y: prev.y,
    directionX: 0,
    directionY: 0,
    genome,
    lastRotation: prev.currentRotation,
    currentRotation: 0,
    survivedGenerations: prev.survivedGenerations
  }
}

export const Hamsters = withPixiApp(({ app, population, secondsLeftForCurrentGeneration, generation, setSelectedHamster, setGeneration, resetGenerationCountdown, setSurvivingPopulation, hamsters, setHamsters, mapSize, pause, survivingPopulation, setPause, challenge }: MapProps) => {
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
      app.ticker.maxFPS = config.maxFPS
      app.ticker.add(tick)
    }
  }, [app, pause])

  // do pause
  useEffect(() => {
    if (app.ticker !== null && (pause || survivingPopulation === 0)) {
      app.ticker.remove(tick)
    }
  }, [app, pause, survivingPopulation])

  const handleHamsterClick = (hamster: HamsterState): void => {
    setSelectedHamster(hamster)
  }

  const interpolateRotation = (lastRotation: number, currentRotation: number): number => {
    const rotationDifference = Math.abs(lastRotation - currentRotation)

    if (rotationDifference > 360 / 8) {
      return currentRotation
    } else {
      return lastRotation
    }
  }

  const Filters = withFilters(Container, {
    colorMatrix: ColorMatrixFilter
  })

  const bestHamster = getBestHamster(hamsters)

  return (
        <>
            {hamsters.map((hamster, index) => (
                <Container
                    key={index}
                    position={[hamster.x, hamster.y]}
                    pivot={{ x: hamsterSize.width * 0.5, y: hamsterSize.height * 0.5 }}
                    angle={interpolateRotation(hamster.lastRotation, hamster.currentRotation)}
                >
                  <Filters colorMatrix={{
                    matrix: hamster.id === bestHamster.id && hamster.survivedGenerations > 0
                      ? [1, 0, 0, 0, 0, 0, 1, 0.5, 0, 0, 0.5, 0, 1, 0, 0, 0, 0, 0, 1, 0]
                      : [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]
                  }}>
                    <Sprite
                        interactive={true}
                        anchor={0}
                        image={hamster.id === bestHamster.id && hamster.survivedGenerations > 0 ? bestHamsterImage : hamsterImage}
                        x={0}
                        y={0}
                        scale={0}
                        width={hamsterSize.width}
                        height={hamsterSize.height}
                        mousedown={() => {
                          handleHamsterClick(hamster)
                        }}
                        touchstart={() => {
                          handleHamsterClick(hamster)
                        }}
                    />
                  </Filters>
                </Container>
            ))}
        </>
  )
})
