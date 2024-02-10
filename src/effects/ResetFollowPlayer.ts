import { Effect } from 'pixi-game-camera'

import { type Container } from '@pixi/display'

export class ResetFollowPlayer extends Effect {
  /**
     * @param {Container} container A reference to the container to apply the panto effect to.
     * @param {number} duration The amount of time, in milliseconds, that the effect should take.
     */
  constructor (container: Container, duration: number) {
    super(container)

    this.duration = duration
  }

  /**
     * Updates the status of this effect on a frame by frame basis.
     */
  update (): void {
    if (this.criteriaMet()) {
      this.finished.dispatch()
      return
    }

    this.current = performance.now()

    this.container.position.x = 1
    this.container.position.y = 1

    // scale
    this.container.scale = {
      x: 1,
      y: 1
    }

    // //now character inside stage is mapped to center of screen
    this.container.pivot.x = 0
    this.container.pivot.y = 0

    if (this.useRAF) this.id = requestAnimationFrame(() => { this.update() })
  }

  /**
     * Checks to see if the panto criteria has been met so that the effect can end.
     *
     * @returns {boolean} Returns true if the panto effect is finished or false otherwise.
     */
  criteriaMet (): boolean {
    return (
      this.container.pivot.x === 0 &&
      this.container.pivot.y === 0 &&
      this.container.position.x === 1 &&
      this.container.position.y === 1 &&
      this.container.scale.x === 1 &&
      this.container.scale.y === 1
    )
  }
}
