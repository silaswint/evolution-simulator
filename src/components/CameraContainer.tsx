import React, { type ReactNode } from 'react'
import { withPixiApp } from '@pixi/react'
import '@pixi/events'
import { type Application as PixiApplication } from '@pixi/app'
import { Camera } from 'pixi-game-camera'
import { type HamsterState } from '@/utils/types/HamsterState'
import { FollowPlayer } from '@/effects/FollowPlayer'
import { ResetFollowPlayer } from '@/effects/ResetFollowPlayer'

interface CameraProps {
  app: PixiApplication
  children?: ReactNode
  hamster: HamsterState | undefined
  active: boolean
}

/**
 * @todo effects must stop when shouldNotFollow changes
 * @todo background image should be a sprite instead a css background
 * @todo watch CPU time
 */
export const CameraContainer = withPixiApp(({ app, children, hamster, active }: CameraProps) => {
  const options = {
    // ticker: app.ticker
  }
  const camera = new Camera(options)

  const shouldNotFollow = !hamster?.x || !hamster?.y || hamster.survivedGenerations === 0 || !active
  if (shouldNotFollow) {
    const resetFollowPlayer = new ResetFollowPlayer(app.stage, 0)
    camera.effect(resetFollowPlayer)
  } else {
    const followPlayer = new FollowPlayer(app.stage, hamster.x, hamster.y, 0)
    camera.effect(followPlayer)
  }

  return (
        <>
          {children}
        </>
  )
})
