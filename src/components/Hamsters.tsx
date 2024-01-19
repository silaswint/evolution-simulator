import React, { useState, useEffect } from 'react'
import { Container, Sprite, withPixiApp } from '@pixi/react'
import { config } from '@/utils/config'
import '@pixi/events'
import { type HamsterState } from '@/utils/types/HamsterState'
import { generateRandomHamsters } from '@/utils/generateRandomHamsters'
import { getGeneratedHamsterState } from '@/utils/getGeneratedHamsterState'
import { hamsterSize } from '@/utils/consts/hamsterSize'

const image = './assets/hamster.svg'

const mapSize = config.mapSize

interface MapProps {
  app: any
  population: number
  secondsLeftForCurrentGeneration: number
  generation: number
  setSelectedHamster: React.Dispatch<React.SetStateAction<HamsterState | null>>
}

export const Hamsters = withPixiApp(({ app, population, secondsLeftForCurrentGeneration, generation, setSelectedHamster }: MapProps) => {
  const [hamsters, setHamsters] = useState<HamsterState[]>(generateRandomHamsters(population, hamsterSize, mapSize))

  useEffect(() => {
    const tick = (): void => {
      if (secondsLeftForCurrentGeneration > 0) {
        setHamsters((prevHamsters: HamsterState[]) =>
          prevHamsters.map((prev: HamsterState) => {
            const { id, genome } = prev
            const { x, y, directionX, directionY } = getGeneratedHamsterState(prev, secondsLeftForCurrentGeneration, population, generation)

            if (x <= hamsterSize.width || x >= mapSize.width - hamsterSize.width) {
              // console.log(`Hamster touches the limit at x: ${x}`)
            }

            if (y <= hamsterSize.height || y >= mapSize.height - hamsterSize.height) {
              // console.log(`Hamster touches the limit at y: ${y}`)
            }

            if (x <= hamsterSize.width || y <= hamsterSize.height || x >= mapSize.width - hamsterSize.width || y >= mapSize.height - hamsterSize.height) {
              const newDirectionX = prev.directionX === 1 ? -1 : 1
              const newDirectionY = prev.directionX === 1 ? -1 : 1

              return {
                id,
                x: Math.max(0, Math.min(mapSize.width - hamsterSize.width, prev.x + newDirectionX * 2)),
                y: Math.max(0, Math.min(mapSize.height - hamsterSize.height, prev.y + newDirectionY * 2)),
                directionX: newDirectionX,
                directionY: newDirectionY,
                genome
              }
            }

            return {
              id,
              x,
              y,
              directionX,
              directionY,
              genome
            }
          })
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
                        scale={1}
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
