import React, { type ReactNode } from 'react'
import { Sprite } from '@pixi/react'
import { type MapSize } from '@/utils/types/MapSize'

interface BackgroundProps {
  children?: ReactNode
  mapSize: MapSize
  challenge: number
}

const Background: React.FC<BackgroundProps> = ({ children, mapSize, challenge }) => {
  return <Sprite
      image={`./assets/stage-background/challenge-${challenge}.svg`}
      width={mapSize.width}
      height={mapSize.height}
  >
    {children}
  </Sprite>
}

export default Background
