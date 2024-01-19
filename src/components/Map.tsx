import React, { useState, useEffect } from 'react'
import { Container, Sprite, withPixiApp } from '@pixi/react'
import { evolutionConfig } from '@/utils/evolutionConfig'
import '@pixi/events'
import { type SpriteState } from '@/utils/types/SpriteState'
import { type SpriteSize } from '@/utils/types/SpriteSize'
import { getRandomSpriteState } from '@/utils/getRandomSpriteState'
import { generateRandomSprites } from '@/utils/generateRandomSprites'

const image = './assets/creature.svg'

const mapSize = evolutionConfig.mapSize
const spriteSize: SpriteSize = {
  width: 50,
  height: 50
}

interface MapProps {
  app: any
  population: number
  secondsLeftForCurrentGeneration: number
  generation: number
  setSelectedSprite: React.Dispatch<React.SetStateAction<SpriteState | null>>
}

export const Map = withPixiApp(({ app, population, secondsLeftForCurrentGeneration, generation, setSelectedSprite }: MapProps) => {
  const [sprites, setSprites] = useState<SpriteState[]>(generateRandomSprites(population, spriteSize, mapSize))

  useEffect(() => {
    const tick = (): void => {
      if (secondsLeftForCurrentGeneration > 0) {
        setSprites((prevSprites: SpriteState[]) =>
          prevSprites.map((prev: SpriteState) => {
            const { id, genome } = prev
            const { x, y, directionX, directionY } = getRandomSpriteState(prev)

            if (x <= spriteSize.width || x >= mapSize.width - spriteSize.width) {
              // console.log(`Sprite berührt die Grenze bei x: ${x}`)
            }

            if (y <= spriteSize.height || y >= mapSize.height - spriteSize.height) {
              // console.log(`Sprite berührt die Grenze bei y: ${y}`)
            }

            if (x <= spriteSize.width || y <= spriteSize.height || x >= mapSize.width - spriteSize.width || y >= mapSize.height - spriteSize.height) {
              const newDirectionX = prev.directionX === 1 ? -1 : 1
              const newDirectionY = prev.directionX === 1 ? -1 : 1

              return {
                id,
                x: Math.max(0, Math.min(mapSize.width - spriteSize.width, prev.x + newDirectionX * 2)),
                y: Math.max(0, Math.min(mapSize.height - spriteSize.height, prev.y + newDirectionY * 2)),
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

  const handleSpriteClick = (sprite: SpriteState): void => {
    setSelectedSprite(sprite)
  }

  return (
        <>
            {sprites.map((sprite, index) => (
                <Container key={index} pivot={50} position={[sprite.x, sprite.y]}>
                    <Sprite
                        interactive={true}
                        anchor={0.5}
                        image={image}
                        x={0}
                        y={0}
                        scale={1}
                        width={spriteSize.width}
                        height={spriteSize.height}
                        mousedown={() => {
                          handleSpriteClick(sprite)
                        }}
                        touchstart={() => {
                          handleSpriteClick(sprite)
                        }}
                    />
                </Container>
            ))}
        </>
  )
})
