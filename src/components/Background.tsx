import React, { type ReactNode } from 'react'
import { Sprite } from '@pixi/react'

interface BackgroundProps {
  children?: ReactNode
  challenge: number
}

const Background: React.FC<BackgroundProps> = ({ children, challenge }) => {
  return <Sprite image={`./assets/stage-background/challenge-${challenge}.svg`}>
    {children}
  </Sprite>
}

export default Background
