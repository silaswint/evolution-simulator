import React, { useState, useEffect } from 'react'
import { Container, Sprite, withPixiApp } from '@pixi/react'
import '@pixi/events'
import { type HamsterState } from '@/utils/types/HamsterState'
import { generateRandomHamsters } from '@/utils/generateRandomHamsters'
import { hamsterSize } from '@/utils/consts/hamsterSize'
import { type Genome } from '@/utils/types/Genome'
import { move } from '@/utils/move'
import { prepareNextGeneration } from '@/utils/prepareNextGeneration'

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
}

export const dontMove = (prev: HamsterState, id: number, genome: Genome): HamsterState => {
  return {
    id,
    x: prev.x,
    y: prev.y,
    directionX: 0,
    directionY: 0,
    genome
  }
}

export const Hamsters = withPixiApp(({ app, population, secondsLeftForCurrentGeneration, generation, setSelectedHamster, setGeneration, resetGenerationCountdown, setSurvivingPopulation }: MapProps) => {
  const [hamsters, setHamsters] = useState<HamsterState[]>(generateRandomHamsters(population))
  const [isProcessingNextGeneration, setIsProcessingNextGeneration] = useState<boolean>(false)

  useEffect(() => {
    const tick = (): void => {
      if (secondsLeftForCurrentGeneration > 0) {
        setHamsters((prevHamsters: HamsterState[]) =>
          prevHamsters.map((prev: HamsterState) => {
            return move(prev, prevHamsters, secondsLeftForCurrentGeneration, population, generation)
          })
        )
      } else if (!isProcessingNextGeneration) {
        prepareNextGeneration(
          hamsters,
          population,
          setIsProcessingNextGeneration,
          setSurvivingPopulation,
          setHamsters,
          resetGenerationCountdown,
          setGeneration
        )
      }
    }

    app.ticker.add(tick)

    return () => {
      if (app.ticker !== null) {
        app.ticker.remove(tick)
      }
    }
  }, [app, secondsLeftForCurrentGeneration])

  const handleHamsterClick = (hamster: HamsterState): void => {
    setSelectedHamster(hamster)
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
                    />
                </Container>
            ))}
        </>
  )
})
