import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Container, Sprite, withPixiApp } from '@pixi/react'
import '@pixi/events'
import { type HamsterState } from '@/utils/types/HamsterState'
import { hamsterSize } from '@/utils/consts/hamsterSize'
import { type Genome } from '@/utils/types/Genome'
import { move } from '@/utils/move'
import { prepareNextGeneration } from '@/utils/evolution/prepareNextGeneration'
import { type MapSize } from '@/utils/types/MapSize'
import { type Application as PixiApplication } from '@pixi/app'
import { config } from '@/utils/config/config'

const image = './assets/hamster.svg'

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
    currentRotation: 0
  }
}

export const Hamsters = withPixiApp(({ app, population, secondsLeftForCurrentGeneration, generation, setSelectedHamster, setGeneration, resetGenerationCountdown, setSurvivingPopulation, hamsters, setHamsters, mapSize, pause, survivingPopulation, setPause }: MapProps) => {
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

  const tick = useCallback((): void => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (secondsLeftForCurrentGenerationRef.current === undefined || pauseRef.current === undefined) {
      return
    }

    if (secondsLeftForCurrentGenerationRef.current > 0 && !pauseRef.current) {
      setHamsters((prevHamsters: HamsterState[]) =>
        prevHamsters.map((prev: HamsterState) => {
          return move(prev, prevHamsters, secondsLeftForCurrentGenerationRef.current, populationRef.current, generationRef.current, mapSizeRef.current)
        })
      )
    } else if (!isProcessingNextGeneration && secondsLeftForCurrentGenerationRef.current === 0 && hamstersRef.current.length > 0) {
      prepareNextGeneration(
        hamstersRef.current,
        populationRef.current,
        setIsProcessingNextGeneration,
        setSurvivingPopulation,
        setHamsters,
        resetGenerationCountdown,
        setGeneration,
        mapSizeRef.current,
        setPause
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

  return (
        <>
            {hamsters.map((hamster, index) => (
                <Container key={index} position={[hamster.x, hamster.y]} pivot={{ x: hamsterSize.width * 0.5, y: hamsterSize.height * 0.5 }} angle={interpolateRotation(hamster.lastRotation, hamster.currentRotation)}>
                    <Sprite
                        interactive={true}
                        anchor={0}
                        image={image}
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
                </Container>
            ))}
        </>
  )
})
