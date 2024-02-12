import React, { type ReactNode } from 'react'
import { Sprite, withPixiApp } from '@pixi/react'
import { type Application as PixiApplication } from '@pixi/app'
import { type MapSize } from '@/utils/types/MapSize'

interface BackgroundProps {
  app: PixiApplication
  children?: ReactNode
  challenge: number
  mapSize: MapSize
}

const Background = withPixiApp(({ app, children, challenge, mapSize }: BackgroundProps) => {
  return <Sprite image={`./assets/stage-background/challenge-${challenge}.svg`} anchor={{ x: 0, y: (0.25 / 2) }}>
    {children}
  </Sprite>
})

export default Background
