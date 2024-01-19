import React, { useState, useEffect } from 'react'
import { Container, Sprite, withPixiApp } from '@pixi/react'
import { evolutionConfig } from '@/utils/evolutionConfig'
import { randomIntFromInterval } from '@/utils/random'

const image = './assets/creature.svg'

interface SpriteState {
  x: number
  y: number
  directionX: number
  directionY: number
}

const mapSize = evolutionConfig.mapSize
const spriteSize = {
  width: 50,
  height: 50
} // Größe des Sprites

export const Map = withPixiApp(
  ({ app }) => {
    const [sprites, setSprites] = useState<SpriteState[]>(() => {
      const initialSprites: SpriteState[] = []
      for (let i = 0; i < evolutionConfig.population; i++) { // Hier die gewünschte Anzahl von Sprites angeben
        initialSprites.push({
          x: randomIntFromInterval(spriteSize.width + 1, mapSize.width - spriteSize.width - 1),
          y: randomIntFromInterval(spriteSize.height + 1, mapSize.height - spriteSize.height - 1),
          directionX: Math.random() > 0.5 ? 1 : -1,
          directionY: Math.random() > 0.5 ? 1 : -1
        })
      }
      return initialSprites
    })

    useEffect(() => {
      const tick = (delta: number): void => {
        setSprites((prevSprites: SpriteState[]) => (
          prevSprites.map((prev: SpriteState) => {
            const newDirectionX = Math.random() > 0.5 ? 1 : -1
            const newDirectionY = Math.random() > 0.5 ? 1 : -1

            const newX = prev.x + prev.directionX * 2
            const newY = prev.y + prev.directionY * 2

            // Überprüfen, ob die neuen Positionen innerhalb der Grenzen liegen
            const updatedX = Math.max(0, Math.min(mapSize.width - spriteSize.width, newX))
            const updatedY = Math.max(0, Math.min(mapSize.height - spriteSize.height, newY))

            // Wenn der Sprite die Grenze erreicht, die Richtung umkehren
            const updatedDirectionX = (updatedX === 0 || updatedX === mapSize.width - spriteSize.width) ? -newDirectionX : newDirectionX
            const updatedDirectionY = (updatedY === 0 || updatedY === mapSize.height - spriteSize.height) ? -newDirectionY : newDirectionY

            // @debug
            if (updatedX <= spriteSize.width || updatedX >= mapSize.width - spriteSize.width) {
              console.log(`Sprite berührt die Grenze bei x: ${updatedX}`)
            }

            if (updatedY <= spriteSize.height || updatedY >= mapSize.height - spriteSize.height) {
              console.log(`Sprite berührt die Grenze bei y: ${updatedY}`)
            }

            // Wenn die Positionen aktualisiert wurden, logge die Position
            if (updatedX <= spriteSize.width || updatedY <= spriteSize.height || updatedX >= mapSize.width - spriteSize.width || updatedY >= mapSize.height - spriteSize.height) {
              const newDirectionX = prev.directionX === 1 ? -1 : 1
              const newDirectionY = prev.directionX === 1 ? -1 : 1

              return {
                x: Math.max(0, Math.min(mapSize.width - spriteSize.width, prev.x + newDirectionX * 2)),
                y: Math.max(0, Math.min(mapSize.height - spriteSize.height, prev.y + newDirectionY * 2)),
                directionX: newDirectionX,
                directionY: newDirectionY
              }
            }

            return {
              x: updatedX,
              y: updatedY,
              directionX: updatedDirectionX,
              directionY: updatedDirectionY
            }
          })
        ))
      }

      app.ticker.add(tick)

      return () => {
        app.ticker.remove(tick)
      }
    }, [app])

    return (
          <>
            {sprites.map((sprite, index) => (
                <Container key={index} pivot={50} position={[sprite.x, sprite.y]}>
                  <Sprite anchor={0.5} image={image} x={0} y={0} scale={1} width={spriteSize.width} height={spriteSize.height} />
                </Container>
            ))}
          </>
    )
  }
)
