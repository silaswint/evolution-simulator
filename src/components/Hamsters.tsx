import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Container, Sprite, withPixiApp } from '@pixi/react'
import '@pixi/events'
import { type HamsterState } from '@/utils/types/HamsterState'
import { hamsterSize } from '@/utils/consts/hamsterSize'
import { type Genome } from '@/utils/types/Genome'
import { move } from '@/utils/move'
import { prepareNextGeneration } from '@/utils/prepareNextGeneration'
import { type MapSize } from '@/utils/types/MapSIze'

const image = './assets/hamster.svg'

interface MapProps {
  app: any
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

export const Hamsters = withPixiApp(({ app, population, secondsLeftForCurrentGeneration, generation, setSelectedHamster, setGeneration, resetGenerationCountdown, setSurvivingPopulation, hamsters, setHamsters, mapSize, pause }: MapProps) => {
  const [isProcessingNextGeneration, setIsProcessingNextGeneration] = useState<boolean>(false)

  const secondsLeftForCurrentGenerationRef = useRef<any>()
  secondsLeftForCurrentGenerationRef.current = secondsLeftForCurrentGeneration

  const pauseRef = useRef<any>()
  pauseRef.current = pause

  const tick = useCallback((): void => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (secondsLeftForCurrentGenerationRef.current === undefined || pauseRef.current === undefined) {
      return
    }

    if (secondsLeftForCurrentGenerationRef.current > 0 && !pauseRef.current) {
      setHamsters((prevHamsters: HamsterState[]) =>
        prevHamsters.map((prev: HamsterState) => {
          return move(prev, prevHamsters, secondsLeftForCurrentGenerationRef.current as unknown as number, population, generation, mapSize)
        })
      )
    } else if (!isProcessingNextGeneration && secondsLeftForCurrentGenerationRef.current === 0) {
      prepareNextGeneration(
        hamsters,
        population,
        setIsProcessingNextGeneration,
        setSurvivingPopulation,
        setHamsters,
        resetGenerationCountdown,
        setGeneration,
        mapSize
      )
    }
  }, [])

  // do play
  useEffect(() => {
    if (!pause) {
      app.ticker.add(tick)
    }
  }, [app, pause])

  // do pause
  useEffect(() => {
    if (app.ticker !== null && pause) {
      app.ticker.remove(tick)
    }
  }, [app, pause])

  const handleHamsterClick = (hamster: HamsterState): void => {
    setSelectedHamster(hamster)
  }

  // @todo the hamsters are blinking all the time, so I keep it undone until someone knows a solution
  const interpolateRotation = (lastRotation: number, currentRotation: number): number => {
    if (lastRotation > currentRotation) {
      return 0
    } else if (currentRotation > lastRotation) {
      return 0
    } else {
      return 0
    }
  }

  return (
        <>
            {hamsters.map((hamster, index) => (
                <Container key={index} pivot={0} position={[hamster.x, hamster.y]}>
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
                        angle={interpolateRotation(hamster.lastRotation, hamster.currentRotation)}
                        pivot={0}
                    />
                </Container>
            ))}
        </>
  )
})
